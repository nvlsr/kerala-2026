/**
 * Build the hereditary-seats analytical layer.
 *
 * Reads:
 *   - data/candidate-classifications.json (user-confirmed verdicts)
 *   - ac-history.json + data/results-2026.json (via constituencies + loadHistorical)
 *
 * Writes:
 *   - data/hereditary-seats.json — one record per AC where the
 *     classifications mark a `hereditary-different-people` succession.
 *     Includes predecessor + successor candidate details (cycles,
 *     alliances, ranks) and a derived total-family-cycles count.
 *
 * Surfaces a first-class "hereditary politics" dimension on top of the
 * candidate-name audit. Used downstream by
 * `build-community-relevance.ts` to inject a hereditary-succession
 * sentence into the per-AC story field.
 *
 * Run: `bun run scripts/analysis/build-hereditary-seats.ts`
 */
import { existsSync, readFileSync } from "fs"

import { constituencies, type Candidate } from "@/lib/data/constituencies"
import { districtsMeta } from "@/lib/data/loaders"

import { loadHistorical } from "../_lib/load"
import { normalizeName } from "../_lib/names"
import { saveJson } from "../_lib/save"

// ── Load classifications ─────────────────────────────────────────────

interface Classification { verdict: string; note?: string }
interface ClassificationsFile {
  multiAlliance: Record<string, Classification>
  suspectedMatch: Record<string, Classification>
}

const classifications: ClassificationsFile = existsSync("data/candidate-classifications.json")
  ? JSON.parse(readFileSync("data/candidate-classifications.json", "utf-8"))
  : { multiAlliance: {}, suspectedMatch: {} }

const hereditaryPairs: Array<{ keyA: string; keyB: string; note: string }> = []
for (const [pairKey, cls] of Object.entries(classifications.suspectedMatch)) {
  if (cls.verdict !== "hereditary-different-people") continue
  const [keyA, keyB] = pairKey.split("|")
  hereditaryPairs.push({ keyA, keyB, note: cls.note ?? "" })
}

// ── Walk appearances (mirrors audit-candidate-names.ts) ──────────────

interface Appearance {
  year: number
  cycleType: "general" | "by-election"
  ac: number
  rank: number
  alliance: string
  rawName: string
  normKey: string
}

const appearances: Appearance[] = []
const historical = loadHistorical()
for (const [acNum, h] of historical.entries()) {
  for (const e of h.elections) {
    if (e.type !== "general" && e.type !== "by-election") continue
    const sorted = [...e.candidates].sort((a, b) => b.votes - a.votes)
    sorted.slice(0, 3).forEach((cand, idx) => {
      appearances.push({
        year: e.year,
        cycleType: e.type as "general" | "by-election",
        ac: acNum,
        rank: idx + 1,
        alliance: cand.alliance ?? "OTHER",
        rawName: cand.name,
        normKey: normalizeName(cand.name),
      })
    })
  }
}
for (const c of constituencies) {
  const sorted = [...c.candidates].sort((a: Candidate, b: Candidate) => b.votes - a.votes)
  sorted.slice(0, 3).forEach((cand, idx) => {
    appearances.push({
      year: 2026,
      cycleType: "general",
      ac: c.constituencyNumber,
      rank: idx + 1,
      alliance: cand.alliance ?? "OTHER",
      rawName: cand.name,
      normKey: normalizeName(cand.name),
    })
  })
}

const byKey = new Map<string, Appearance[]>()
for (const a of appearances) {
  if (!byKey.has(a.normKey)) byKey.set(a.normKey, [])
  byKey.get(a.normKey)!.push(a)
}

const acNameById = new Map<number, string>(
  constituencies.map(c => [c.constituencyNumber, c.constituencyName])
)

// ── Build the hereditary index ───────────────────────────────────────

interface CandidateSummary {
  /** Canonical display name (most common raw spelling for this key). */
  displayName: string
  normKey: string
  /** All top-3 appearances at the AC, sorted by year. */
  cycles: Array<{
    year: number
    cycleType: "general" | "by-election"
    alliance: string
    rank: number
  }>
  earliestYear: number
  latestYear: number
  /** Cycles where this candidate won (rank 1). */
  winsCount: number
}

interface HereditaryRecord {
  ac: number
  name: string
  district: string
  /** Family chain at this AC, ordered by earliest-year ascending. */
  family: CandidateSummary[]
  /** Primary alliance (mode of alliances across family wins). */
  primaryAlliance: string
  /** Total years from earliest family appearance to latest. */
  earliestYear: number
  latestYear: number
  /** Total cycles where any family member appeared in top-3 at this AC. */
  totalFamilyCycles: number
  /** Total wins (rank 1) across the family at this AC. */
  totalFamilyWins: number
  /** User-supplied notes from candidate-classifications.json, joined. */
  notes: string[]
}

function pickDisplayName(hits: Appearance[]): string {
  // Most common raw spelling (or the longest if tied — more info)
  const counts = new Map<string, number>()
  for (const h of hits) counts.set(h.rawName, (counts.get(h.rawName) ?? 0) + 1)
  let best = hits[0].rawName
  let bestCount = 0
  for (const [name, count] of counts) {
    if (count > bestCount || (count === bestCount && name.length > best.length)) {
      best = name
      bestCount = count
    }
  }
  // Normalise display case — most ECI is title-case, some is uppercase
  // Heuristic: if the name is all-uppercase, title-case it
  if (best === best.toUpperCase()) {
    best = best
      .toLowerCase()
      .replace(/\b([a-z])/g, (_, c) => c.toUpperCase())
  }
  return best
}

// Group hereditary pairs by AC: for each pair, find the AC(s) where
// both keys appeared (almost always one shared AC; safeguard for edges)
const byAc = new Map<number, {
  pairs: Array<{ keyA: string; keyB: string; note: string }>
  keys: Set<string>
}>()

for (const pair of hereditaryPairs) {
  const aHits = byKey.get(pair.keyA) ?? []
  const bHits = byKey.get(pair.keyB) ?? []
  const aAcs = new Set(aHits.map(h => h.ac))
  const bAcs = new Set(bHits.map(h => h.ac))
  const sharedAcs = [...aAcs].filter(ac => bAcs.has(ac))
  if (sharedAcs.length === 0) {
    console.warn(`[hereditary] pair ${pair.keyA} | ${pair.keyB} — no shared AC, skipping`)
    continue
  }
  for (const ac of sharedAcs) {
    if (!byAc.has(ac)) byAc.set(ac, { pairs: [], keys: new Set() })
    const e = byAc.get(ac)!
    e.pairs.push(pair)
    e.keys.add(pair.keyA)
    e.keys.add(pair.keyB)
  }
}

const records: HereditaryRecord[] = []

for (const [ac, entry] of byAc.entries()) {
  // For each key in the family, gather its appearances at this AC
  const family: CandidateSummary[] = []
  for (const key of entry.keys) {
    const hitsAtAc = (byKey.get(key) ?? []).filter(h => h.ac === ac)
    if (hitsAtAc.length === 0) continue
    const sortedHits = [...hitsAtAc].sort((a, b) => a.year - b.year)
    family.push({
      displayName: pickDisplayName(hitsAtAc),
      normKey: key,
      cycles: sortedHits.map(h => ({
        year: h.year,
        cycleType: h.cycleType,
        alliance: h.alliance,
        rank: h.rank,
      })),
      earliestYear: sortedHits[0].year,
      latestYear: sortedHits[sortedHits.length - 1].year,
      winsCount: sortedHits.filter(h => h.rank === 1).length,
    })
  }
  family.sort((a, b) => a.earliestYear - b.earliestYear)

  // Primary alliance: most-common alliance among wins (rank 1)
  const winAlliances = new Map<string, number>()
  for (const m of family) {
    for (const c of m.cycles) {
      if (c.rank === 1) winAlliances.set(c.alliance, (winAlliances.get(c.alliance) ?? 0) + 1)
    }
  }
  const primaryAlliance = [...winAlliances.entries()]
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? family[0]?.cycles[0]?.alliance ?? "OTHER"

  const allYears = family.flatMap(m => m.cycles.map(c => c.year))
  const totalFamilyCycles = allYears.length
  const totalFamilyWins = family.reduce((s, m) => s + m.winsCount, 0)
  const earliestYear = Math.min(...allYears)
  const latestYear = Math.max(...allYears)

  records.push({
    ac,
    name: acNameById.get(ac) ?? `AC-${ac}`,
    district: districtsMeta.constituencyToDistrict[String(ac)] ?? "unknown",
    family,
    primaryAlliance,
    earliestYear,
    latestYear,
    totalFamilyCycles,
    totalFamilyWins,
    notes: entry.pairs.map(p => p.note).filter(Boolean),
  })
}

records.sort((a, b) => a.ac - b.ac)

saveJson("data/hereditary-seats.json", {
  totalSeats: records.length,
  seats: records,
})

// ── Console summary ──────────────────────────────────────────────────

console.log(`Wrote data/hereditary-seats.json (${records.length} hereditary seats)`)
console.log("")
console.log("Hereditary seats:")
for (const r of records) {
  console.log(`  AC ${r.ac} ${r.name} (${r.district}, ${r.primaryAlliance}) · ${r.totalFamilyWins} wins / ${r.totalFamilyCycles} cycles · ${r.earliestYear}–${r.latestYear}`)
  for (const m of r.family) {
    console.log(`    - ${m.displayName} (${m.winsCount}W/${m.cycles.length} cycles, ${m.earliestYear}–${m.latestYear})`)
  }
}

// Quick aggregate slices
const byDistrict = new Map<string, number>()
const byAlliance = new Map<string, number>()
for (const r of records) {
  byDistrict.set(r.district, (byDistrict.get(r.district) ?? 0) + 1)
  byAlliance.set(r.primaryAlliance, (byAlliance.get(r.primaryAlliance) ?? 0) + 1)
}
console.log("")
console.log("By district:", Object.fromEntries(byDistrict))
console.log("By primary alliance:", Object.fromEntries(byAlliance))
