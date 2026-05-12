/**
 * Phase 5 builder: generates one markdown dossier per curated candidate.
 *
 * Output: twitter-responses/data/candidates/<slug>.md
 *
 * Each dossier has TWO sections by data origin:
 *
 *  - **Auto-generated**: cross-cycle assembly history via normalizeName
 *    lookup (which ACs they contested, parties, shares, ranks).
 *  - **Manual / TBD**: community, gender, prior non-assembly elections
 *    (Lok Sabha, local body), organizational roles, notable career
 *    context. These are the "candidate qualitative data gap" fields
 *    identified in tweet #008 — they live OUTSIDE our 4-cycle assembly
 *    dataset and need research to fill in.
 *
 * The build script writes placeholder values for the manual fields so
 * the infrastructure is ready; the user fills them in via separate edit
 * (Wikipedia + news + party-website lookups). Once filled, manual
 * sections are preserved across rebuilds via a `<!-- AUTO-ABOVE -->`
 * sentinel.
 *
 * Usage:
 *   bun run scripts/analysis/tweet-dossiers/build-candidate-dossiers.ts
 *   bun run scripts/analysis/tweet-dossiers/build-candidate-dossiers.ts --candidate b-b-gopakumar
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import results2026 from "../../../data/results-2026.json"
import history from "../../../data/ac-history.json"
import names from "../../../data/ac-names.json"
import alliancesMeta from "../../../data/alliances.json"

import { normalizeName } from "../../_lib/names"
import { buildCanonicalNameMap, displayName } from "./lib/canonical-names"

const PROJECT_ROOT = resolve(__dirname, "..", "..", "..")
const OUT_DIR = resolve(PROJECT_ROOT, "twitter-responses", "data", "candidates")

const partyToAlliance: Record<string, string> = (alliancesMeta as any).partyToAlliance

let canonicalNameMap: Map<string, string> = new Map()
const display = (raw: string) => displayName(canonicalNameMap, raw)

const AUTO_SENTINEL = "<!-- AUTO-ABOVE — manual sections below preserved across rebuilds -->"

// ─── curated candidate list ──────────────────────────────────────────────────

/**
 * Candidates with cross-tweet relevance — most-cited across tweets #001-013.
 * Add more as future tweets surface them.
 *
 * `match_names`: variants we know the candidate appears under in our data
 * (will be normalized via `normalizeName` for cross-cycle matching).
 * The first entry is the canonical display name.
 */
type CandidateDef = {
  key: string                       // file slug
  match_names: string[]
  primary_party_2026: string        // BJP | CPI(M) | INC | etc.
}

const CURATED: CandidateDef[] = [
  { key: "rajeev-chandrasekhar", match_names: ["Rajeev Chandrasekhar"], primary_party_2026: "BJP" },
  { key: "sobha-surendran", match_names: ["Sobha Surendran"], primary_party_2026: "BJP" },
  { key: "shone-george", match_names: ["Shone George"], primary_party_2026: "BJP" },
  { key: "anoop-antony", match_names: ["Anoop Antony"], primary_party_2026: "BJP" },
  { key: "b-b-gopakumar", match_names: ["B.B. Gopakumar", "B. B. Gopakumar"], primary_party_2026: "BJP" },
  { key: "t-raneesh", match_names: ["T. Raneesh", "T Raneesh"], primary_party_2026: "BJP" },
  { key: "v-muraleedharan", match_names: ["V. Muraleedharan"], primary_party_2026: "BJP" },
  { key: "kummanam-rajasekharan", match_names: ["Kummanam Rajasekharan"], primary_party_2026: "BJP" },
  { key: "k-surendran", match_names: ["K. Surendran"], primary_party_2026: "BJP" },
  { key: "mani-c-kappen", match_names: ["Mani C. Kappen", "Mani C. Kappan"], primary_party_2026: "Independent (UDF)" },
  { key: "jose-k-mani", match_names: ["Jose K. Mani"], primary_party_2026: "Kerala Congress (M)" },
  { key: "k-m-mani", match_names: ["K. M. Mani"], primary_party_2026: "—" }, // historical figure
  { key: "mathew-t-thomas", match_names: ["Mathew T. Thomas"], primary_party_2026: "Independent (LDF)" },
  { key: "v-sivankutty", match_names: ["V. Sivankutty"], primary_party_2026: "CPI(M)" },
  { key: "pinarayi-vijayan", match_names: ["Pinarayi Vijayan"], primary_party_2026: "CPI(M)" },
]

// ─── cross-cycle assembly history ────────────────────────────────────────────

type Appearance = {
  year: 2011 | 2016 | 2021 | 2026
  ac: number
  acName: string
  rawName: string
  party: string
  alliance: string
  votes: number
  share: number
  rank: number
  result: "won" | "runner-up" | "third" | "lower"
}

function findAppearances(targetKey: string): Appearance[] {
  const out: Appearance[] = []

  for (const [acStr, payload] of Object.entries(results2026 as any)) {
    const cands = (payload as any).candidates as Array<{ name: string; party: string; votes: number }>
    const sorted = [...cands].sort((a, b) => b.votes - a.votes)
    let totalPolled = 0
    for (const c of cands) totalPolled += c.votes
    for (let i = 0; i < sorted.length; i++) {
      const c = sorted[i]
      if (normalizeName(c.name) === targetKey) {
        out.push({
          year: 2026,
          ac: Number(acStr),
          acName: (names as any)[acStr]?.primary ?? `AC ${acStr}`,
          rawName: c.name,
          party: c.party,
          alliance: partyToAlliance[c.party] ?? "OTHER",
          votes: c.votes,
          share: (c.votes / totalPolled) * 100,
          rank: i + 1,
          result: i === 0 ? "won" : i === 1 ? "runner-up" : i === 2 ? "third" : "lower",
        })
      }
    }
  }

  for (const [acStr, payload] of Object.entries(history as any)) {
    for (const ev of (payload as any).elections as Array<any>) {
      if (ev.type !== "general") continue
      if (![2011, 2016, 2021].includes(ev.year)) continue
      const sorted = [...ev.candidates].sort((a: any, b: any) => b.votes - a.votes)
      let totalPolled = 0
      for (const c of ev.candidates as { votes: number }[]) totalPolled += c.votes
      for (let i = 0; i < sorted.length; i++) {
        const c = sorted[i] as any
        if (normalizeName(c.name) === targetKey) {
          out.push({
            year: ev.year,
            ac: Number(acStr),
            acName: (names as any)[acStr]?.primary ?? `AC ${acStr}`,
            rawName: c.name,
            party: c.party,
            alliance: c.alliance ?? "OTHER",
            votes: c.votes,
            share: c.votePct ?? (c.votes / totalPolled) * 100,
            rank: i + 1,
            result: i === 0 ? "won" : i === 1 ? "runner-up" : i === 2 ? "third" : "lower",
          })
        }
      }
    }
  }

  out.sort((a, b) => a.year - b.year)
  return out
}

// ─── rendering ───────────────────────────────────────────────────────────────

function fmtPct(x: number | null | undefined, digits = 2): string {
  if (x == null) return "—"
  return x.toFixed(digits)
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function padAc(ac: number): string {
  return String(ac).padStart(3, "0")
}

function renderFrontmatter(def: CandidateDef, appearances: Appearance[], displayName: string, canonicalKey: string): string {
  const parties = [...new Set(appearances.map((a) => a.party))]
  const acs = [...new Set(appearances.map((a) => a.ac))]
  const years = appearances.map((a) => a.year)
  const wins = appearances.filter((a) => a.result === "won").length
  const bestShare = appearances.reduce((max, a) => Math.max(max, a.share), 0)
  const bestYear = appearances.find((a) => a.share === bestShare)?.year

  const lines: string[] = ["---"]
  lines.push(`type: candidate`)
  lines.push(`key: ${def.key}`)
  lines.push(`slug: candidate-${def.key}`)
  lines.push(`display_name: ${displayName}`)
  lines.push(`canonical_key: ${JSON.stringify(canonicalKey)}`)
  lines.push(`primary_party_2026: ${JSON.stringify(def.primary_party_2026)}`)
  lines.push("")
  lines.push(`# === MANUAL FIELDS (populate from web research / Wikipedia / news / party-website) ===`)
  lines.push(`community: ""           # TODO: ezhava | nair | sc | st | nadar | brahmin | latin-catholic | csi | syro-malabar | muslim | other`)
  lines.push(`gender: ""              # TODO: male | female`)
  lines.push(`year_of_birth: null      # TODO`)
  lines.push(`organizational_roles: [] # TODO: list of {role, since, until?}`)
  lines.push(`prior_non_assembly_elections: []  # TODO: list of {type, year, seat, party, result, share_pct?}`)
  lines.push(`notable_for: ""         # TODO: 1-sentence "why this candidate matters beyond their assembly contests"`)
  lines.push("")
  lines.push(`# === AUTO-GENERATED (from results-2026.json + ac-history.json) ===`)
  lines.push(`assembly_cycles_contested: [${years.join(", ")}]`)
  lines.push(`assembly_acs: [${acs.join(", ")}]`)
  lines.push(`assembly_wins: ${wins}`)
  lines.push(`assembly_best_share: ${bestShare.toFixed(2)}`)
  lines.push(`assembly_best_year: ${bestYear ?? "null"}`)
  lines.push(`parties_contested_under: [${parties.map((p) => JSON.stringify(p)).join(", ")}]`)
  lines.push("")
  lines.push(`related:`)
  for (const ac of acs) {
    const acName = (names as any)[String(ac)]?.primary ?? `AC ${ac}`
    lines.push(`  - "[[ac-${ac}-${slugify(acName)}]]"`)
  }
  const partiesUnique = new Set(parties)
  for (const p of partiesUnique) {
    const partySlug = slugify(p)
    if (partySlug && partySlug !== "—") lines.push(`  - "[[party-${partySlug}]]"`)
  }
  lines.push("---")
  return lines.join("\n")
}

function renderTitle(def: CandidateDef, displayName: string): string {
  return `\n# ${displayName}\n\nPrimary party (2026): ${def.primary_party_2026}`
}

function renderAssemblyHistory(appearances: Appearance[]): string {
  const out: string[] = []
  out.push(`\n## Assembly election history (auto, from our 4-cycle data)\n`)
  if (appearances.length === 0) {
    out.push(`*(no appearances found in 2011-2026 state-assembly data via normalizeName lookup. This candidate may have only contested non-assembly elections, or our match-names list needs an alias.)*`)
    return out.join("\n")
  }
  out.push(`| Cycle | AC | Party | Alliance | Votes | Share | Rank | Result |`)
  out.push(`| --- | --- | --- | --- | --- | --- | --- | --- |`)
  for (const a of appearances) {
    const result = a.result === "won" ? "**WON**" : a.result
    out.push(
      `| ${a.year} | [${a.acName}](../acs/${padAc(a.ac)}-${slugify(a.acName)}.md) | ${a.party} | ${a.alliance} | ${a.votes.toLocaleString()} | ${fmtPct(a.share)}% | ${a.rank} | ${result} |`
    )
  }

  // Quick arc summary
  if (appearances.length >= 2) {
    const arcShares = appearances.map((a) => Math.round(a.share))
    const arcYears = appearances.map((a) => a.year)
    out.push("")
    out.push(`**Arc:** ${arcShares.join("% → ")}% across ${arcYears.join("/")}.`)
    if (new Set(appearances.map((a) => a.ac)).size === 1) {
      out.push(`Same AC each cycle — **architect pattern** (candidate built the seat).`)
    } else {
      out.push(`Across ${new Set(appearances.map((a) => a.ac)).size} different ACs.`)
    }
  }

  return out.join("\n")
}

const MANUAL_STUB = `
## Pre-assembly career (manual — fill from research)

*(TBD. Cover: Lok Sabha contests, local-body / panchayat wins, party-organisational history. This data is OUTSIDE our 4-cycle assembly dataset.)*

## Community + identity (manual)

*(TBD. Caste / sub-rite / religion-community identity if politically relevant. Per the candidate-qualitative-data-gap memory — don't fill unless sourced.)*

## Notable angles for tweet replies (manual, append-only)

*(TBD. Curated angles surfaced by past tweet responses.)*
`

function renderDossier(def: CandidateDef, appearances: Appearance[], existing: string | null): string {
  const canonicalKey = normalizeName(def.match_names[0])
  const displayN = canonicalNameMap.get(canonicalKey) ?? def.match_names[0]

  const autoTop = [
    renderFrontmatter(def, appearances, displayN, canonicalKey),
    renderTitle(def, displayN),
    renderAssemblyHistory(appearances),
    "",
    AUTO_SENTINEL,
    "",
  ].join("\n")

  // Preserve any manual content below the sentinel on rebuild
  if (existing) {
    const idx = existing.indexOf(AUTO_SENTINEL)
    if (idx >= 0) {
      const manualPortion = existing.slice(idx + AUTO_SENTINEL.length)
      return autoTop + manualPortion
    }
  }
  return autoTop + MANUAL_STUB
}

// ─── main ────────────────────────────────────────────────────────────────────

function parseArgs(): { candidate?: string } {
  const args = process.argv.slice(2)
  const out: { candidate?: string } = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--candidate" && args[i + 1]) {
      out.candidate = args[i + 1]
      i++
    }
  }
  return out
}

function main() {
  const args = parseArgs()
  canonicalNameMap = buildCanonicalNameMap()
  mkdirSync(OUT_DIR, { recursive: true })

  const toBuild = args.candidate
    ? CURATED.filter((c) => c.key === args.candidate)
    : CURATED

  let written = 0
  for (const def of toBuild) {
    try {
      const canonicalKey = normalizeName(def.match_names[0])
      const appearances = findAppearances(canonicalKey)
      const filePath = resolve(OUT_DIR, `${def.key}.md`)
      const existing = existsSync(filePath) ? readFileSync(filePath, "utf-8") : null
      const md = renderDossier(def, appearances, existing)
      writeFileSync(filePath, md, "utf-8")
      written++
    } catch (err: any) {
      console.error(`  ${def.key} failed:`, err.stack ?? err.message)
    }
  }
  console.log(`Wrote ${written} candidate dossier(s) to ${OUT_DIR}`)
}

main()
