/**
 * Christian-walkthrough drill-down — answers the seven questions in
 * docs/narratives/christian-walkthrough-draft.md by computing per-
 * cohort breakdowns of:
 *   1. Multi-cycle UDF/LDF/NDA mean (2011, 2016, 2021, 2026)
 *   2. CSI cohort ACs (which 5, district, religion share, history)
 *   3. Twenty 20 vote share by cohort
 *   4. NDA / BJP performance per Christian cohort
 *   5. Latin Catholic × BJP share (vs other cohorts)
 *   6. UDF candidate party mix per cohort
 *   7. Per-cohort AC lists (sanity-check)
 *
 * Output is printed; the human-readable findings get distilled into
 * docs/narratives/christian-walkthrough-draft.md by hand.
 *
 * Usage: bun run scripts/analyze-christian-cohort-detail.ts
 */
import { readdirSync } from "node:fs"

import {
  CHRISTIAN_SUBRITE_COHORTS,
  christianSubRiteCohortFor,
  type ChristianSubRiteCohort,
} from "@/lib/data/subrite-bins"
import { getReligiousSignatureForAC } from "@/lib/data/religious-pois"

// ── Types ─────────────────────────────────────────────────────────────
type AllianceShares = { UDF: number; LDF: number; NDA: number; OTHER: number }
type Candidate2026 = {
  alliance?: string
  isNota?: boolean
  votes: number
  party: string
  candidate?: string
}
type Constituency2026 = {
  constituencyNumber: number
  constituencyName: string
  district?: string
  candidates: Candidate2026[]
}
type HistoricalCandidate = {
  name: string
  party: string
  alliance: string
  votes: number
}
type HistoricalElection = {
  year: number
  type: string
  candidates: HistoricalCandidate[]
}
type HistoricalConstituency = {
  constituencyNumber: number
  constituencyName: string
  elections: HistoricalElection[]
}

const TARGET_YEARS = [2011, 2016, 2021] as const

// ── Helpers ───────────────────────────────────────────────────────────
function shares2026(c: Constituency2026): AllianceShares {
  let total = 0
  for (const cand of c.candidates) {
    if (!cand.isNota) total += cand.votes
  }
  const out: AllianceShares = { UDF: 0, LDF: 0, NDA: 0, OTHER: 0 }
  if (total === 0) return out
  for (const cand of c.candidates) {
    if (cand.isNota) continue
    const a = cand.alliance
    if (a === "UDF" || a === "LDF" || a === "NDA") {
      out[a] += (cand.votes / total) * 100
    } else {
      out.OTHER += (cand.votes / total) * 100
    }
  }
  return out
}

function sharesHistorical(
  hist: HistoricalConstituency,
  year: number
): AllianceShares | null {
  const e = hist.elections.find((e) => e.year === year && e.type === "general")
  if (!e) return null
  let total = 0
  for (const c of e.candidates) total += c.votes
  if (total === 0) return null
  const out: AllianceShares = { UDF: 0, LDF: 0, NDA: 0, OTHER: 0 }
  for (const c of e.candidates) {
    if (c.alliance === "NOTA") continue
    const pct = (c.votes / total) * 100
    if (c.alliance === "UDF" || c.alliance === "LDF" || c.alliance === "NDA") {
      out[c.alliance as keyof AllianceShares] += pct
    } else {
      out.OTHER += pct
    }
  }
  return out
}

function partySharesHistorical(
  hist: HistoricalConstituency,
  year: number
): Map<string, number> {
  const e = hist.elections.find((e) => e.year === year && e.type === "general")
  if (!e) return new Map()
  let total = 0
  for (const c of e.candidates) total += c.votes
  const out = new Map<string, number>()
  for (const c of e.candidates) {
    if (c.alliance === "NOTA") continue
    out.set(c.party, (out.get(c.party) ?? 0) + (c.votes / total) * 100)
  }
  return out
}

function partyShares2026(c: Constituency2026): Map<string, number> {
  let total = 0
  for (const cand of c.candidates) {
    if (!cand.isNota) total += cand.votes
  }
  const out = new Map<string, number>()
  if (total === 0) return out
  for (const cand of c.candidates) {
    if (cand.isNota) continue
    out.set(cand.party, (out.get(cand.party) ?? 0) + (cand.votes / total) * 100)
  }
  return out
}

function winnerOf(s: AllianceShares): keyof AllianceShares | null {
  let best: keyof AllianceShares | null = null
  let bestVal = -Infinity
  for (const a of ["UDF", "LDF", "NDA", "OTHER"] as const) {
    if (s[a] > bestVal) {
      bestVal = s[a]
      best = a
    }
  }
  return best
}

const mean = (xs: number[]) =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length
const round = (x: number, dp = 1) => Number(x.toFixed(dp))
const signed = (x: number, dp = 1) =>
  `${x >= 0 ? "+" : ""}${x.toFixed(dp)}`

// ── Load data ─────────────────────────────────────────────────────────
const constituencies2026 = (await Bun.file(
  "data/kerala-2026.json"
).json()) as Constituency2026[]

const historicalByAc = new Map<number, HistoricalConstituency>()
const histFiles = readdirSync("data/historical").filter(
  (f) => f.startsWith("S11-") && f.endsWith(".json")
)
for (const f of histFiles) {
  const data = (await Bun.file(`data/historical/${f}`).json()) as
    | HistoricalConstituency
    | { default: HistoricalConstituency }
  const c = "default" in data ? data.default : data
  historicalByAc.set(c.constituencyNumber, c)
}

const c2026ByAc = new Map<number, Constituency2026>(
  constituencies2026.map((c) => [c.constituencyNumber, c])
)

// Build per-AC row with cohort + alliance metrics
type Row = {
  acNumber: number
  acName: string
  district: string
  christianCohort: ChristianSubRiteCohort
  christianPct: number
  s2011: AllianceShares | null
  s2016: AllianceShares | null
  s2021: AllianceShares | null
  s2026: AllianceShares
  bjp2026: number
  twenty202026: number
  udfParty2026: string | null
  winner2026: keyof AllianceShares | null
}

const rows: Row[] = []
for (const c of constituencies2026) {
  const hist = historicalByAc.get(c.constituencyNumber)
  const s2026 = shares2026(c)
  const sig = getReligiousSignatureForAC(c.constituencyNumber)
  const partyShares = partyShares2026(c)
  const udfCand = c.candidates.find((cand) => cand.alliance === "UDF")
  rows.push({
    acNumber: c.constituencyNumber,
    acName: c.constituencyName,
    district: c.district ?? "",
    christianCohort: christianSubRiteCohortFor(c.constituencyNumber),
    christianPct: sig?.religionPopPct.christian ?? 0,
    s2011: hist ? sharesHistorical(hist, 2011) : null,
    s2016: hist ? sharesHistorical(hist, 2016) : null,
    s2021: hist ? sharesHistorical(hist, 2021) : null,
    s2026,
    bjp2026: partyShares.get("Bharatiya Janata Party") ?? 0,
    twenty202026: partyShares.get("Twenty 20 Party") ?? 0,
    udfParty2026: udfCand?.party ?? null,
    winner2026: winnerOf(s2026),
  })
}

// ── Reporting ─────────────────────────────────────────────────────────
const CHRISTIAN_REAL_COHORTS: ChristianSubRiteCohort[] = [
  "latin_catholic",
  "syro_malabar",
  "indian_orthodox",
  "jacobite_syrian",
  "marthoma",
  "csi",
  "below_threshold",
]
const labelOf = (code: ChristianSubRiteCohort) =>
  CHRISTIAN_SUBRITE_COHORTS.find((c) => c.code === code)?.label ?? code

function printDivider(title: string) {
  console.log(`\n${"═".repeat(80)}\n${title}\n${"═".repeat(80)}`)
}

// Q1: Multi-cycle UDF / LDF / NDA per cohort
printDivider("Q1 — Multi-cycle alliance trajectory per Christian cohort")

for (const cohort of CHRISTIAN_REAL_COHORTS) {
  const cohortRows = rows.filter((r) => r.christianCohort === cohort)
  if (cohortRows.length === 0) continue
  console.log(`\n${labelOf(cohort)} (n=${cohortRows.length})`)
  console.log(
    `  Year   UDF    LDF    NDA    OTHER  Wins (U/L/N)`
  )
  for (const year of TARGET_YEARS) {
    const key = year === 2011 ? "s2011" : year === 2016 ? "s2016" : "s2021"
    const present = cohortRows.filter((r) => r[key])
    if (present.length === 0) continue
    const udf = mean(present.map((r) => r[key]!.UDF))
    const ldf = mean(present.map((r) => r[key]!.LDF))
    const nda = mean(present.map((r) => r[key]!.NDA))
    const other = mean(present.map((r) => r[key]!.OTHER))
    const winners = present.map((r) => winnerOf(r[key]!))
    const u = winners.filter((w) => w === "UDF").length
    const l = winners.filter((w) => w === "LDF").length
    const n = winners.filter((w) => w === "NDA").length
    console.log(
      `  ${year}   ${round(udf).toString().padStart(4)}  ${round(ldf).toString().padStart(4)}  ${round(nda).toString().padStart(4)}  ${round(other).toString().padStart(5)}  ${u}/${l}/${n}`
    )
  }
  const u26 = cohortRows.filter((r) => r.winner2026 === "UDF").length
  const l26 = cohortRows.filter((r) => r.winner2026 === "LDF").length
  const n26 = cohortRows.filter((r) => r.winner2026 === "NDA").length
  console.log(
    `  2026   ${round(mean(cohortRows.map((r) => r.s2026.UDF))).toString().padStart(4)}  ${round(mean(cohortRows.map((r) => r.s2026.LDF))).toString().padStart(4)}  ${round(mean(cohortRows.map((r) => r.s2026.NDA))).toString().padStart(4)}  ${round(mean(cohortRows.map((r) => r.s2026.OTHER))).toString().padStart(5)}  ${u26}/${l26}/${n26}`
  )
}

// Q2: CSI cohort deep-dive
printDivider("Q2 — CSI cohort: which ACs and what's special?")
const csiRows = rows.filter((r) => r.christianCohort === "csi")
for (const r of csiRows) {
  console.log(
    `\n  AC ${r.acNumber} ${r.acName} (${r.district})   Christian ${round(r.christianPct)}%`
  )
  console.log(
    `    2011: UDF ${round(r.s2011?.UDF ?? 0)}  LDF ${round(r.s2011?.LDF ?? 0)}  NDA ${round(r.s2011?.NDA ?? 0)}`
  )
  console.log(
    `    2016: UDF ${round(r.s2016?.UDF ?? 0)}  LDF ${round(r.s2016?.LDF ?? 0)}  NDA ${round(r.s2016?.NDA ?? 0)}`
  )
  console.log(
    `    2021: UDF ${round(r.s2021?.UDF ?? 0)}  LDF ${round(r.s2021?.LDF ?? 0)}  NDA ${round(r.s2021?.NDA ?? 0)}`
  )
  console.log(
    `    2026: UDF ${round(r.s2026.UDF)}  LDF ${round(r.s2026.LDF)}  NDA ${round(r.s2026.NDA)}  → winner ${r.winner2026}`
  )
}

// Q3: Twenty 20 — Jacobite-cohort attention
printDivider("Q3 — Twenty 20 vote share by Christian cohort")
console.log(
  `\nTwenty 20 is a Jacobite-Syrian-led NDA partner (Sabu M Jacob, Kitex). Where did they contest in 2026?\n`
)
for (const cohort of CHRISTIAN_REAL_COHORTS) {
  const cohortRows = rows.filter((r) => r.christianCohort === cohort)
  const contested = cohortRows.filter((r) => r.twenty202026 > 0)
  if (contested.length === 0) continue
  console.log(`\n${labelOf(cohort)}:`)
  const sorted = [...contested].sort((a, b) => b.twenty202026 - a.twenty202026)
  for (const r of sorted) {
    console.log(
      `  ${r.acName} (${r.district})   ${round(r.twenty202026)}% (NDA total ${round(r.s2026.NDA)}%; UDF ${round(r.s2026.UDF)}, LDF ${round(r.s2026.LDF)})`
    )
  }
}

const t20All = rows.filter((r) => r.twenty202026 > 0)
console.log(
  `\nTwenty 20 contested ${t20All.length} ACs in 2026. Mean Twenty 20 share: ${round(mean(t20All.map((r) => r.twenty202026)))}%`
)

// Q4: NDA + BJP performance per Christian cohort
printDivider("Q4 — NDA / BJP performance per Christian cohort")
for (const cohort of CHRISTIAN_REAL_COHORTS) {
  const cohortRows = rows.filter((r) => r.christianCohort === cohort)
  if (cohortRows.length === 0) continue
  const nda21 = mean(cohortRows.map((r) => r.s2021?.NDA ?? 0))
  const nda26 = mean(cohortRows.map((r) => r.s2026.NDA))
  const bjp26 = mean(cohortRows.map((r) => r.bjp2026))
  const ndaWins = cohortRows.filter((r) => r.winner2026 === "NDA").length
  console.log(
    `\n${labelOf(cohort)}  (n=${cohortRows.length})`
  )
  console.log(
    `  Mean NDA 2021: ${round(nda21)}%   Mean NDA 2026: ${round(nda26)}%   Δ ${signed(nda26 - nda21)}`
  )
  console.log(`  Mean BJP (party) 2026: ${round(bjp26)}%   NDA wins: ${ndaWins}`)
}

// Q5: Latin Catholic × BJP share specifically
printDivider("Q5 — Latin Catholic × BJP support (test the common-knowledge claim)")
const latin = rows.filter((r) => r.christianCohort === "latin_catholic")
const syroMalabar = rows.filter((r) => r.christianCohort === "syro_malabar")
const orthodox = rows.filter((r) => r.christianCohort === "indian_orthodox")
const belowThreshold = rows.filter((r) => r.christianCohort === "below_threshold")
console.log(
  `\nMean BJP share 2026:`
)
console.log(`  Latin Catholic (n=${latin.length}):       ${round(mean(latin.map((r) => r.bjp2026)))}%`)
console.log(`  Syro-Malabar  (n=${syroMalabar.length}):       ${round(mean(syroMalabar.map((r) => r.bjp2026)))}%`)
console.log(`  Indian Orthodox (n=${orthodox.length}):    ${round(mean(orthodox.map((r) => r.bjp2026)))}%`)
console.log(`  Below threshold (n=${belowThreshold.length}):    ${round(mean(belowThreshold.map((r) => r.bjp2026)))}%`)

console.log(
  `\nNDA 2026 distribution in Latin Catholic ACs:`
)
const latinNDAMax = [...latin].sort((a, b) => b.s2026.NDA - a.s2026.NDA).slice(0, 5)
const latinNDAMin = [...latin].sort((a, b) => a.s2026.NDA - b.s2026.NDA).slice(0, 5)
console.log(`  Highest NDA 5 Latin ACs:`)
for (const r of latinNDAMax) {
  console.log(`    ${r.acName} (${r.district}): NDA ${round(r.s2026.NDA)}%  BJP ${round(r.bjp2026)}%`)
}
console.log(`  Lowest NDA 5 Latin ACs:`)
for (const r of latinNDAMin) {
  console.log(`    ${r.acName} (${r.district}): NDA ${round(r.s2026.NDA)}%  BJP ${round(r.bjp2026)}%`)
}

// Q6: UDF candidate party mix per cohort
printDivider("Q6 — UDF candidate party allocation per Christian cohort")
for (const cohort of CHRISTIAN_REAL_COHORTS) {
  const cohortRows = rows.filter((r) => r.christianCohort === cohort)
  if (cohortRows.length === 0) continue
  const partyCount = new Map<string, number>()
  for (const r of cohortRows) {
    const p = r.udfParty2026 ?? "(no UDF candidate)"
    partyCount.set(p, (partyCount.get(p) ?? 0) + 1)
  }
  console.log(`\n${labelOf(cohort)} (n=${cohortRows.length}):`)
  const sorted = [...partyCount.entries()].sort((a, b) => b[1] - a[1])
  for (const [p, n] of sorted) {
    console.log(`  ${p.padEnd(50)} ${n}`)
  }
}

// Q7: List ACs per cohort (sanity check)
printDivider("Q7 — List of ACs per Christian cohort (sanity check)")
for (const cohort of CHRISTIAN_REAL_COHORTS) {
  const cohortRows = rows.filter((r) => r.christianCohort === cohort)
  if (cohortRows.length === 0) continue
  const sorted = [...cohortRows].sort((a, b) => b.christianPct - a.christianPct)
  console.log(`\n${labelOf(cohort)} (n=${cohortRows.length}):`)
  for (const r of sorted) {
    const sig = getReligiousSignatureForAC(r.acNumber)
    const dom = sig?.christian.dominant
    const subPct = dom ? round(dom.voterSharePct) : 0
    console.log(
      `  AC ${String(r.acNumber).padStart(3)} ${r.acName.padEnd(20)} (${r.district.padEnd(20)})  Christian ${round(r.christianPct).toString().padStart(4)}%   ${dom?.code.replace(/_/g, " ") ?? "—"} ${subPct}% est. voters   2026 ${r.winner2026}`
    )
  }
}

console.log("")
