/**
 * Audit candidate-name normalisation across cycles.
 *
 * Walks every top-3 finisher in every general / by-election cycle
 * (2011, 2016, 2019 by-elections, 2021) plus 2026, computes the
 * canonical key via `normalizeName()`, and emits two outputs:
 *
 *  - `data/candidate-continuity.json` — structured per-key index of
 *    every appearance (year, AC, alliance, position, raw name).
 *
 *  - `docs/candidate-continuity-audit.md` — human-reviewable markdown:
 *      §A  multi-appearance candidates the normaliser detected (>= 2 hits)
 *      §B  suspected matches the normaliser missed (Jaccard ≥ 0.5,
 *          different canonical keys, same AC OR same alliance + same surname)
 *
 * §A is for spotting false positives (different people the normaliser
 * collapsed); §B is for spotting false negatives (same person the
 * normaliser kept apart, prompting normaliser refinement).
 *
 * Run: `bun run scripts/analysis/audit-candidate-names.ts`
 */
import { constituencies, type Candidate } from "@/lib/data/constituencies"

import { existsSync, readFileSync } from "fs"

import { loadHistorical } from "../_lib/load"
import { extractCasteSuffix, nameSimilarity, normalizeName } from "../_lib/names"
import { saveJson } from "../_lib/save"

// ── Manual classifications (persist across re-runs) ──────────────────

type Verdict = "same-person-switched" | "different-people-same-name" |
  "word-order-swap-same-person" | "initial-changed-same-person" |
  "hereditary-different-people" | "spelling-drift-same-person" |
  "needs-more-info"

interface Classification {
  verdict: Verdict
  note?: string
}

interface ClassificationsFile {
  version: number
  description?: string
  multiAlliance: Record<string, Classification>
  suspectedMatch: Record<string, Classification>
}

const CLASSIFICATIONS_PATH = "data/candidate-classifications.json"
let classifications: ClassificationsFile = {
  version: 1,
  multiAlliance: {},
  suspectedMatch: {},
}
if (existsSync(CLASSIFICATIONS_PATH)) {
  classifications = JSON.parse(readFileSync(CLASSIFICATIONS_PATH, "utf-8"))
}

const VERDICT_BADGE: Record<Verdict, string> = {
  "same-person-switched": "✅ same person (alliance switch)",
  "different-people-same-name": "🟰 different people · same name",
  "word-order-swap-same-person": "✅ same person (word order)",
  "initial-changed-same-person": "✅ same person (initial dropped/added)",
  "hereditary-different-people": "👨‍👦 hereditary succession · different people",
  "spelling-drift-same-person": "✅ same person (spelling drift)",
  "needs-more-info": "❔ needs more info",
}

interface Appearance {
  year: number
  cycleType: "general" | "by-election"
  ac: number
  acName: string
  rank: 1 | 2 | 3
  alliance: string
  rawName: string
  normKey: string
  /** Caste suffix detected on the raw name (NAIR / PILLAI / etc.) or null. */
  casteSuffix: string | null
}

const appearances: Appearance[] = []

// ── 2011 / 2016 / 2019-bye / 2021 from ac-history.json ───────────────

const historical = loadHistorical()
const acNameById = new Map<number, string>(
  constituencies.map(c => [c.constituencyNumber, c.constituencyName])
)

for (const [acNum, h] of historical.entries()) {
  for (const e of h.elections) {
    if (e.type !== "general" && e.type !== "by-election") continue
    const sorted = [...e.candidates].sort((a, b) => b.votes - a.votes)
    const top3 = sorted.slice(0, 3)
    top3.forEach((cand, idx) => {
      appearances.push({
        year: e.year,
        cycleType: e.type as "general" | "by-election",
        ac: acNum,
        acName: acNameById.get(acNum) ?? `AC-${acNum}`,
        rank: (idx + 1) as 1 | 2 | 3,
        alliance: cand.alliance ?? "OTHER",
        rawName: cand.name,
        normKey: normalizeName(cand.name),
        casteSuffix: extractCasteSuffix(cand.name),
      })
    })
  }
}

// ── 2026 from constituencies ─────────────────────────────────────────

for (const c of constituencies) {
  const sorted = [...c.candidates].sort((a: Candidate, b: Candidate) => b.votes - a.votes)
  const top3 = sorted.slice(0, 3)
  top3.forEach((cand, idx) => {
    appearances.push({
      year: 2026,
      cycleType: "general",
      ac: c.constituencyNumber,
      acName: c.constituencyName,
      rank: (idx + 1) as 1 | 2 | 3,
      alliance: cand.alliance ?? "OTHER",
      rawName: cand.name,
      normKey: normalizeName(cand.name),
      casteSuffix: extractCasteSuffix(cand.name),
    })
  })
}

// ── Group by normalised key (the "duplicates" found) ─────────────────

const byKey = new Map<string, Appearance[]>()
for (const a of appearances) {
  if (!byKey.has(a.normKey)) byKey.set(a.normKey, [])
  byKey.get(a.normKey)!.push(a)
}

// Treat NOTA / OTHER as "non-main"; alliance-conflict is interesting only
// for UDF/LDF/NDA mixing.
const MAIN_ALLIANCES = new Set(["UDF", "LDF", "NDA"])

const multiAppearance = [...byKey.entries()]
  .filter(([_, hits]) => hits.length >= 2)
  .map(([key, hits]) => {
    const distinctAlliances = [...new Set(hits.map(h => h.alliance))]
    const mainAlliancesSeen = distinctAlliances.filter(a => MAIN_ALLIANCES.has(a))
    return {
      normKey: key,
      appearanceCount: hits.length,
      distinctRawNames: [...new Set(hits.map(h => h.rawName))],
      distinctAlliances,
      mainAlliancesSeen,
      distinctACs: [...new Set(hits.map(h => h.ac))].length,
      isMultiAlliance: mainAlliancesSeen.length > 1,
      casteSuffixes: [...new Set(hits.map(h => h.casteSuffix).filter(Boolean) as string[])],
      hits: hits.sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.ac - b.ac
      ),
    }
  })
  .sort((a, b) => b.appearanceCount - a.appearanceCount)

const multiAlliance = multiAppearance.filter(e => e.isMultiAlliance)
const singleAlliance = multiAppearance.filter(e => !e.isMultiAlliance)

// ── Suspected missed matches ─────────────────────────────────────────
//
// Build candidate "key contexts": one entry per (normKey, surname-token,
// alliance, AC-or-cross-AC). We then walk pairs of different keys and
// check Jaccard similarity. To control noise, we gate suspected matches:
//   - Same AC (any years): Jaccard ≥ 0.5  — likely tenure-detection gap
//   - Cross-AC: Jaccard ≥ 0.6 AND same alliance — likely candidate-name
//     drift across constituencies
//
// We also dedupe symmetric pairs (A, B) ↔ (B, A).

interface SuspectedPair {
  keyA: string
  keyB: string
  jaccard: number
  scope: "same-ac" | "cross-ac"
  sharedTokensSample: string[]
  examplesA: Appearance[]
  examplesB: Appearance[]
}

const keys = [...byKey.keys()].sort()
const suspected: SuspectedPair[] = []
const seenPair = new Set<string>()

for (let i = 0; i < keys.length; i++) {
  for (let j = i + 1; j < keys.length; j++) {
    const a = keys[i]
    const b = keys[j]
    if (a === b) continue
    const sim = nameSimilarity(a, b)
    if (sim < 0.5) continue

    const hitsA = byKey.get(a)!
    const hitsB = byKey.get(b)!

    // Are there hits in the SAME AC?
    const acsA = new Set(hitsA.map(h => h.ac))
    const acsB = new Set(hitsB.map(h => h.ac))
    const sharedACs = [...acsA].filter(ac => acsB.has(ac))
    const sameAC = sharedACs.length > 0

    // Cross-AC: require same alliance to filter noise
    const alliancesA = new Set(hitsA.map(h => h.alliance))
    const alliancesB = new Set(hitsB.map(h => h.alliance))
    const sharedAlliance = [...alliancesA].some(al => alliancesB.has(al))

    const shouldFlag = sameAC
      ? sim >= 0.5
      : sim >= 0.6 && sharedAlliance

    if (!shouldFlag) continue

    const pairKey = a < b ? `${a}|${b}` : `${b}|${a}`
    if (seenPair.has(pairKey)) continue
    seenPair.add(pairKey)

    // Sample shared tokens for the audit narrative
    const tokensA = new Set(a.split(" ").filter(t => t.length >= 2))
    const tokensB = new Set(b.split(" ").filter(t => t.length >= 2))
    const shared = [...tokensA].filter(t => tokensB.has(t))

    suspected.push({
      keyA: a,
      keyB: b,
      jaccard: sim,
      scope: sameAC ? "same-ac" : "cross-ac",
      sharedTokensSample: shared,
      examplesA: hitsA.slice(0, 3),
      examplesB: hitsB.slice(0, 3),
    })
  }
}

// Order suspected pairs: same-ac first (higher review priority), then
// by Jaccard descending
suspected.sort((x, y) => {
  if (x.scope !== y.scope) return x.scope === "same-ac" ? -1 : 1
  return y.jaccard - x.jaccard
})

// ── Write structured output ──────────────────────────────────────────

// Caste-suffix distribution (for §A.3 in the markdown + future analysis)
const casteSuffixCounts = new Map<string, number>()
for (const a of appearances) {
  if (a.casteSuffix) {
    casteSuffixCounts.set(a.casteSuffix, (casteSuffixCounts.get(a.casteSuffix) ?? 0) + 1)
  }
}

saveJson("data/candidate-continuity.json", {
  totalAppearances: appearances.length,
  uniqueNormalisedKeys: byKey.size,
  multiAppearanceCount: multiAppearance.length,
  multiAllianceCount: multiAlliance.length,
  suspectedMissedMatchesCount: suspected.length,
  casteSuffixCounts: Object.fromEntries(casteSuffixCounts),
  multiAppearance,
  suspectedMissedMatches: suspected,
})

// ── Render markdown audit ────────────────────────────────────────────

function fmtAppearance(h: Appearance): string {
  const cycleTag = h.cycleType === "by-election" ? " by-bye" : ""
  return `${h.year}${cycleTag} · AC ${h.ac} ${h.acName} (${h.alliance}, rank ${h.rank}): \`${h.rawName}\``
}

const lines: string[] = []
lines.push("# Candidate-name normalisation audit")
lines.push("")
lines.push(
  "Auto-generated. Walks every top-3 finisher across 2011 / 2016 / 2019-bye / 2021 / 2026 cycles, normalises names via `scripts/_lib/names.ts:normalizeName()`, and reports cross-cycle matches the normaliser caught (§A) and likely-same-person pairs it missed (§B)."
)
lines.push("")
lines.push(
  `Run: \`bun run scripts/analysis/audit-candidate-names.ts\` — regenerates \`data/candidate-continuity.json\` and this file.`
)
lines.push("")
lines.push("## Headline numbers")
lines.push("")
lines.push(`- Total top-3 appearances: **${appearances.length}**`)
lines.push(`- Unique normalised keys: **${byKey.size}**`)
lines.push(`- Candidates appearing ≥ 2 times: **${multiAppearance.length}**`)
lines.push(`  - of which **multi-alliance** (priority review — likely different people sharing a normalised name): **${multiAlliance.length}**`)
lines.push(`  - single-alliance multi-appearance: ${singleAlliance.length}`)
lines.push(`- Suspected missed matches: **${suspected.length}**`)
lines.push(
  `  - same-AC: ${suspected.filter(s => s.scope === "same-ac").length} (likely tenure-detection gaps)`
)
lines.push(
  `  - cross-AC same-alliance: ${suspected.filter(s => s.scope === "cross-ac").length} (likely cross-constituency name drift)`
)
lines.push("")
lines.push(`### Caste-suffix distribution`)
lines.push("")
lines.push("Detected via `extractCasteSuffix()` (trailing token only). Recorded per-appearance in `data/candidate-continuity.json` for future analysis.")
lines.push("")
lines.push("| Suffix | Count |")
lines.push("| --- | ---: |")
for (const [suffix, count] of [...casteSuffixCounts.entries()].sort((a, b) => b[1] - a[1])) {
  lines.push(`| \`${suffix}\` | ${count} |`)
}
lines.push("")
lines.push("---")
lines.push("")

// §A.1 — MULTI-ALLIANCE (priority — likely different people)
const classifiedMA = multiAlliance.filter(e => classifications.multiAlliance[e.normKey])
const unclassifiedMA = multiAlliance.filter(e => !classifications.multiAlliance[e.normKey])

lines.push("## A.1 Multi-alliance multi-appearance keys (priority review)")
lines.push("")
lines.push(
  "Normalised keys appearing under **≥ 2 main alliances** (UDF/LDF/NDA). Mix of (a) same person who genuinely switched fronts (Kerala Congress factions, defections), and (b) different people sharing a common name. Verdicts persisted in `data/candidate-classifications.json` — survive audit re-runs."
)
lines.push("")
lines.push(`**${classifiedMA.length} classified · ${unclassifiedMA.length} unclassified · ${multiAlliance.length} total.**`)
lines.push("")

// Unclassified first (need attention), then classified (already done)
function renderMultiAllianceEntry(entry: typeof multiAlliance[number]): string[] {
  const out: string[] = []
  const cls = classifications.multiAlliance[entry.normKey]
  const badge = cls ? VERDICT_BADGE[cls.verdict] : "❓ **NEEDS REVIEW**"
  out.push(
    `### \`${entry.normKey}\` — ${entry.appearanceCount} appearances · ${entry.distinctACs} AC${entry.distinctACs === 1 ? "" : "s"} · alliances: **${entry.mainAlliancesSeen.join(" / ")}**`
  )
  out.push("")
  out.push(`**Verdict:** ${badge}`)
  if (cls?.note) {
    out.push("")
    out.push(`> ${cls.note}`)
  }
  out.push("")
  if (entry.distinctRawNames.length > 1) {
    out.push(
      `Raw name variants: ${entry.distinctRawNames.map(n => `\`${n}\``).join(", ")}`
    )
  }
  if (entry.casteSuffixes.length > 0) {
    out.push(`Caste suffix(es) seen: ${entry.casteSuffixes.map(s => `\`${s}\``).join(", ")}`)
  }
  out.push("")
  for (const h of entry.hits) {
    out.push(`- ${fmtAppearance(h)}`)
  }
  out.push("")
  return out
}

if (unclassifiedMA.length > 0) {
  lines.push("### ❓ Unclassified — needs review")
  lines.push("")
  for (const entry of unclassifiedMA) {
    for (const l of renderMultiAllianceEntry(entry)) lines.push(l)
  }
}

if (classifiedMA.length > 0) {
  lines.push("### ✓ Already classified")
  lines.push("")
  for (const entry of classifiedMA) {
    for (const l of renderMultiAllianceEntry(entry)) lines.push(l)
  }
}

if (multiAlliance.length === 0) {
  lines.push("_None._")
  lines.push("")
}

lines.push("---")
lines.push("")

// §A.2 — SINGLE-ALLIANCE multi-appearance (the bulk)
lines.push("## A.2 Single-alliance multi-appearance candidates")
lines.push("")
lines.push(
  "Each block: one normalised key + every top-3 appearance attributed to it. All within a single main alliance (or OTHER/NOTA). Scan for **false positives** — different people the normaliser collapsed."
)
lines.push("")
lines.push(`Showing the top ${Math.min(singleAlliance.length, 200)} by appearance count.`)
lines.push("")

for (const entry of singleAlliance.slice(0, 200)) {
  lines.push(
    `### \`${entry.normKey}\` — ${entry.appearanceCount} appearances across ${entry.distinctACs} AC${entry.distinctACs === 1 ? "" : "s"}`
  )
  if (entry.distinctRawNames.length > 1) {
    lines.push(
      `Raw name variants: ${entry.distinctRawNames.map(n => `\`${n}\``).join(", ")}`
    )
  }
  if (entry.distinctAlliances.length > 1) {
    lines.push(`Alliances seen: ${entry.distinctAlliances.join(", ")}`)
  }
  if (entry.casteSuffixes.length > 0) {
    lines.push(`Caste suffix(es) seen: ${entry.casteSuffixes.map(s => `\`${s}\``).join(", ")}`)
  }
  lines.push("")
  for (const h of entry.hits) {
    lines.push(`- ${fmtAppearance(h)}`)
  }
  lines.push("")
}

if (singleAlliance.length > 200) {
  lines.push(
    `_… and ${singleAlliance.length - 200} more in \`data/candidate-continuity.json\`._`
  )
  lines.push("")
}

lines.push("---")
lines.push("")

// §B
lines.push("## B. Suspected missed matches (normaliser kept apart)")
lines.push("")
lines.push(
  "Pairs of different canonical keys with high token overlap (Jaccard ≥ 0.5 same-AC, ≥ 0.6 cross-AC). Each pair is **probably the same person but didn't merge** — review the patterns to extend `normalizeName()` rules."
)
lines.push("")

const sameAcSuspected = suspected.filter(s => s.scope === "same-ac")
const crossAcSuspected = suspected.filter(s => s.scope === "cross-ac")

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

const classifiedSame = sameAcSuspected.filter(s =>
  classifications.suspectedMatch[pairKey(s.keyA, s.keyB)]
)
const unclassifiedSame = sameAcSuspected.filter(s =>
  !classifications.suspectedMatch[pairKey(s.keyA, s.keyB)]
)

lines.push(`### B.1 Same-AC suspected matches (${sameAcSuspected.length} — ${classifiedSame.length} classified · ${unclassifiedSame.length} unclassified)`)
lines.push("")
if (sameAcSuspected.length === 0) {
  lines.push("_None._")
} else {
  lines.push("Pairs of normalised keys with high token overlap in the same AC. Could be: (a) same person with word-order or initial drift (extend normaliser), (b) hereditary succession (father-son), or (c) coincidental surname-sharers.")
  lines.push("")
  function renderSuspectedPair(s: typeof sameAcSuspected[number]): string[] {
    const out: string[] = []
    const cls = classifications.suspectedMatch[pairKey(s.keyA, s.keyB)]
    const badge = cls ? VERDICT_BADGE[cls.verdict] : "❓ **NEEDS REVIEW**"
    out.push(
      `- **\`${s.keyA}\`** ↔ **\`${s.keyB}\`** (Jaccard ${s.jaccard.toFixed(2)}, shared: ${s.sharedTokensSample.map(t => `\`${t}\``).join(", ")}) — ${badge}`
    )
    if (cls?.note) out.push(`    > ${cls.note}`)
    for (const h of s.examplesA) out.push(`    - A: ${fmtAppearance(h)}`)
    for (const h of s.examplesB) out.push(`    - B: ${fmtAppearance(h)}`)
    return out
  }
  if (unclassifiedSame.length > 0) {
    lines.push("#### ❓ Unclassified — needs review")
    lines.push("")
    for (const s of unclassifiedSame) {
      for (const l of renderSuspectedPair(s)) lines.push(l)
    }
  }
  if (classifiedSame.length > 0) {
    lines.push("")
    lines.push("#### ✓ Already classified")
    lines.push("")
    for (const s of classifiedSame) {
      for (const l of renderSuspectedPair(s)) lines.push(l)
    }
  }
}
lines.push("")

// Cross-AC split: ≥2 shared tokens (priority review) vs 1 shared token
// (mostly common-surname false positives). The latter set is collapsed
// to a summary; the former is shown in full.
const crossAcMultiToken = crossAcSuspected.filter(s => s.sharedTokensSample.length >= 2)
const crossAcSingleToken = crossAcSuspected.filter(s => s.sharedTokensSample.length < 2)

const classifiedCross = crossAcMultiToken.filter(s =>
  classifications.suspectedMatch[pairKey(s.keyA, s.keyB)]
)
const unclassifiedCross = crossAcMultiToken.filter(s =>
  !classifications.suspectedMatch[pairKey(s.keyA, s.keyB)]
)

lines.push(`### B.2 Cross-AC same-alliance suspected matches (${crossAcSuspected.length})`)
lines.push("")
lines.push(
  `Same alliance, different ACs, token overlap. Split by token-count: pairs with ≥2 shared tokens are likely same person (name drift across constituencies); pairs with only 1 shared token are mostly different people sharing a common Kerala surname.`
)
lines.push("")

lines.push(`#### B.2.a Multi-token cross-AC pairs (${crossAcMultiToken.length}) — priority review`)
lines.push("")
lines.push(
  `Two or more name tokens shared across ACs. High probability of being the same person under different name spellings (e.g. word-order swap, initials dropped between constituencies).`
)
lines.push("")

function renderCrossPair(s: typeof crossAcMultiToken[number]): string[] {
  const out: string[] = []
  const cls = classifications.suspectedMatch[pairKey(s.keyA, s.keyB)]
  const badge = cls ? VERDICT_BADGE[cls.verdict] : "❓ **NEEDS REVIEW**"
  out.push(
    `- **\`${s.keyA}\`** ↔ **\`${s.keyB}\`** (Jaccard ${s.jaccard.toFixed(2)}, shared: ${s.sharedTokensSample.map(t => `\`${t}\``).join(", ")}) — ${badge}`
  )
  if (cls?.note) out.push(`    > ${cls.note}`)
  for (const h of s.examplesA) out.push(`    - A: ${fmtAppearance(h)}`)
  for (const h of s.examplesB) out.push(`    - B: ${fmtAppearance(h)}`)
  return out
}

if (crossAcMultiToken.length === 0) {
  lines.push("_None._")
  lines.push("")
} else {
  if (unclassifiedCross.length > 0) {
    lines.push("##### ❓ Unclassified")
    lines.push("")
    for (const s of unclassifiedCross) {
      for (const l of renderCrossPair(s)) lines.push(l)
    }
    lines.push("")
  }
  if (classifiedCross.length > 0) {
    lines.push("##### ✓ Already classified")
    lines.push("")
    for (const s of classifiedCross) {
      for (const l of renderCrossPair(s)) lines.push(l)
    }
    lines.push("")
  }
}

// Surface common-surname false positives in summary form
lines.push(
  `#### B.2.b Single-token cross-AC pairs (${crossAcSingleToken.length}) — surname collisions`
)
lines.push("")
lines.push(
  "These pairs share only one token (a surname). Almost all are different people coincidentally sharing a common Kerala surname. Collapsed to a summary; full pair list lives in `data/candidate-continuity.json`."
)
lines.push("")
const tokenFreq = new Map<string, number>()
for (const s of crossAcSingleToken) {
  const t = s.sharedTokensSample[0] ?? "?"
  tokenFreq.set(t, (tokenFreq.get(t) ?? 0) + 1)
}
const sortedTokens = [...tokenFreq.entries()].sort((a, b) => b[1] - a[1])
lines.push("Surnames driving these false positives:")
lines.push("")
lines.push("| Surname | Pair count |")
lines.push("| --- | ---: |")
for (const [t, c] of sortedTokens) lines.push(`| \`${t}\` | ${c} |`)
lines.push("")

import { writeFileSync } from "fs"
writeFileSync("docs/candidate-continuity-audit.md", lines.join("\n"))

console.log(
  `Wrote data/candidate-continuity.json (${appearances.length} appearances → ${byKey.size} unique keys, ${multiAppearance.length} multi-appearance, ${multiAlliance.length} multi-alliance, ${suspected.length} suspected misses)`
)
console.log(`Wrote docs/candidate-continuity-audit.md`)
console.log("")
console.log(`Caste suffixes detected:`)
for (const [s, c] of [...casteSuffixCounts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${s}: ${c}`)
}
console.log("")
console.log(`Top 10 multi-alliance candidates (priority review):`)
for (const e of multiAlliance.slice(0, 10)) {
  console.log(
    `  ${e.appearanceCount}× \`${e.normKey}\` — ${e.mainAlliancesSeen.join("/")}, ${e.distinctACs} AC(s)`
  )
}
console.log("")
console.log(
  `Suspected misses: ${sameAcSuspected.length} same-AC + ${crossAcSuspected.length} cross-AC`
)
