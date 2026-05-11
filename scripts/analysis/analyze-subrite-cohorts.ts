/**
 * Sprint 2 analysis — Christian + Muslim sub-rite cohort × UDF performance.
 *
 * Reads the cohort layer from src/lib/data/subrite-bins.ts, joins with
 * 2021/2026 alliance shares computed inline from JSON, and writes a
 * markdown report at docs/narratives/sub-rite-cohort-analysis.md.
 *
 * The report is the deliverable; the script is reproducible — re-run
 * after any OSM pipeline refresh or election-data change.
 *
 * Usage: bun run scripts/analysis/analyze-subrite-cohorts.ts
 *
 * Note on script architecture: this script duplicates the alliance-
 * share computation from src/lib/data/walkthrough-metrics.ts because
 * that module transitively imports historical.ts which uses Vite's
 * import.meta.glob (browser-only). Keep the logic here in sync.
 */
import { readdirSync } from "node:fs"

import {
  CHRISTIAN_SUBRITE_COHORTS,
  MUSLIM_SUBRITE_COHORTS,
  christianSubRiteCohortFor,
  muslimSubRiteCohortFor,
  type ChristianSubRiteCohort,
  type MuslimSubRiteCohort,
} from "@/lib/data/subrite-bins"
import {
  COHORT_VOTER_SHARE_THRESHOLD,
  MIN_CLASSIFIED_FOR_COHORT,
  getReligiousSignatureForAC,
} from "@/lib/data/religious-pois"
import {
  shares2026FromCandidates,
  sharesHistoricalFromCandidates,
  winnerOf,
  type AllianceShares,
} from "@/lib/data/alliance-shares-core"

// ── Share computation wrappers ────────────────────────────────────────
// Share-math is shared with the runtime app via alliance-shares-core.
type Candidate2026 = {
  alliance?: string
  isNota?: boolean
  votes: number
  party: string
}
type Constituency2026 = {
  constituencyNumber: number
  constituencyName: string
  district?: string
  candidates: Candidate2026[]
}
type HistoricalCandidate = {
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
  elections: HistoricalElection[]
}

const shares2026 = (c: Constituency2026): AllianceShares =>
  shares2026FromCandidates(c.candidates)

const shares2021FromHistorical = (
  hist: HistoricalConstituency
): AllianceShares | null => {
  const e = hist.elections.find((e) => e.year === 2021 && e.type === "general")
  if (!e) return null
  return sharesHistoricalFromCandidates(e.candidates)
}

const winner2026Of = (s: AllianceShares): keyof AllianceShares | null =>
  winnerOf(s)

// ── Load data ─────────────────────────────────────────────────────────
const constituencies2026 = (await Bun.file(
  "data/results-2026.json"
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

console.log(
  `[analysis] loaded ${constituencies2026.length} 2026 ACs + ${historicalByAc.size} historical entries`
)

// Per-AC metrics — only ACs with both 2026 + 2021 data
type ACMetrics = {
  acNumber: number
  acName: string
  district: string
  shares2026: AllianceShares
  shares2021: AllianceShares
  deltas: AllianceShares
  winner2026: keyof AllianceShares | null
  christianCohort: ChristianSubRiteCohort
  muslimCohort: MuslimSubRiteCohort
  christianPct: number
  muslimPct: number
}

const rows: ACMetrics[] = []
for (const c of constituencies2026) {
  const s26 = shares2026(c)
  const hist = historicalByAc.get(c.constituencyNumber)
  if (!hist) continue
  const s21 = shares2021FromHistorical(hist)
  if (!s21) continue
  const sig = getReligiousSignatureForAC(c.constituencyNumber)
  rows.push({
    acNumber: c.constituencyNumber,
    acName: c.constituencyName,
    district: c.district ?? "",
    shares2026: s26,
    shares2021: s21,
    deltas: {
      UDF: s26.UDF - s21.UDF,
      LDF: s26.LDF - s21.LDF,
      NDA: s26.NDA - s21.NDA,
      OTHER: s26.OTHER - s21.OTHER,
    },
    winner2026: winner2026Of(s26),
    christianCohort: christianSubRiteCohortFor(c.constituencyNumber),
    muslimCohort: muslimSubRiteCohortFor(c.constituencyNumber),
    christianPct: sig?.religionPopPct.christian ?? 0,
    muslimPct: sig?.religionPopPct.muslim ?? 0,
  })
}

console.log(`[analysis] computed metrics for ${rows.length} ACs`)

// ── Aggregation helpers ───────────────────────────────────────────────
type CohortStats = {
  cohort: string
  label: string
  n: number
  meanUDF2026: number
  meanUDF2021: number
  meanDeltaUDF: number
  meanLDF2026: number
  meanLDF2021: number
  meanDeltaLDF: number
  udfWins: number
  ldfWins: number
  ndaWins: number
  otherWins: number
}

const round = (x: number, dp = 1) => Number(x.toFixed(dp))
const mean = (xs: number[]) =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length
const signed = (x: number, dp = 1) =>
  `${x >= 0 ? "+" : ""}${x.toFixed(dp)}`

function aggregateCohort(
  cohort: string,
  label: string,
  acs: ACMetrics[]
): CohortStats {
  const counts: Record<keyof AllianceShares, number> = {
    UDF: 0,
    LDF: 0,
    NDA: 0,
    OTHER: 0,
  }
  for (const ac of acs) {
    if (ac.winner2026) counts[ac.winner2026]++
  }
  return {
    cohort,
    label,
    n: acs.length,
    meanUDF2026: mean(acs.map((a) => a.shares2026.UDF)),
    meanUDF2021: mean(acs.map((a) => a.shares2021.UDF)),
    meanDeltaUDF: mean(acs.map((a) => a.deltas.UDF)),
    meanLDF2026: mean(acs.map((a) => a.shares2026.LDF)),
    meanLDF2021: mean(acs.map((a) => a.shares2021.LDF)),
    meanDeltaLDF: mean(acs.map((a) => a.deltas.LDF)),
    udfWins: counts.UDF,
    ldfWins: counts.LDF,
    ndaWins: counts.NDA,
    otherWins: counts.OTHER,
  }
}

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length
  if (n === 0) return 0
  const mx = mean(xs),
    my = mean(ys)
  let num = 0,
    sx = 0,
    sy = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx
    const dy = ys[i] - my
    num += dx * dy
    sx += dx * dx
    sy += dy * dy
  }
  const denom = Math.sqrt(sx * sy)
  return denom === 0 ? 0 : num / denom
}

function etaSquared(values: number[], groups: string[]): number {
  if (values.length === 0) return 0
  const overall = mean(values)
  const total = values.reduce((a, v) => a + (v - overall) ** 2, 0)
  const byGroup = new Map<string, number[]>()
  for (let i = 0; i < values.length; i++) {
    if (!byGroup.has(groups[i])) byGroup.set(groups[i], [])
    byGroup.get(groups[i])!.push(values[i])
  }
  let within = 0
  for (const arr of byGroup.values()) {
    const m = mean(arr)
    within += arr.reduce((a, v) => a + (v - m) ** 2, 0)
  }
  return total === 0 ? 0 : 1 - within / total
}

// ── Cohort aggregates ─────────────────────────────────────────────────
const christianStats: CohortStats[] = []
for (const meta of CHRISTIAN_SUBRITE_COHORTS) {
  const acs = rows.filter((r) => r.christianCohort === meta.code)
  if (acs.length === 0) continue
  christianStats.push(aggregateCohort(meta.code, meta.label, acs))
}

const muslimStats: CohortStats[] = []
for (const meta of MUSLIM_SUBRITE_COHORTS) {
  const acs = rows.filter((r) => r.muslimCohort === meta.code)
  if (acs.length === 0) continue
  muslimStats.push(aggregateCohort(meta.code, meta.label, acs))
}

// ── Predictive comparison ────────────────────────────────────────────
const labeledRows = rows.filter((r) => r.christianCohort !== "below_threshold")
const cohortR2 = etaSquared(
  labeledRows.map((r) => r.shares2026.UDF),
  labeledRows.map((r) => r.christianCohort)
)
const christianPctR2 =
  pearson(
    labeledRows.map((r) => r.christianPct),
    labeledRows.map((r) => r.shares2026.UDF)
  ) ** 2
const cohortR2Delta = etaSquared(
  labeledRows.map((r) => r.deltas.UDF),
  labeledRows.map((r) => r.christianCohort)
)
const christianPctR2Delta =
  pearson(
    labeledRows.map((r) => r.christianPct),
    labeledRows.map((r) => r.deltas.UDF)
  ) ** 2

const muslimLabeledRows = rows.filter(
  (r) => r.muslimCohort !== "below_threshold"
)
const muslimCohortR2 = etaSquared(
  muslimLabeledRows.map((r) => r.shares2026.UDF),
  muslimLabeledRows.map((r) => r.muslimCohort)
)
const muslimPctR2 =
  pearson(
    muslimLabeledRows.map((r) => r.muslimPct),
    muslimLabeledRows.map((r) => r.shares2026.UDF)
  ) ** 2

// ── Build the report ──────────────────────────────────────────────────
function tableRow(s: CohortStats): string {
  return `| ${s.label} | ${s.n} | ${round(s.meanUDF2026)} | ${round(s.meanUDF2021)} | ${signed(s.meanDeltaUDF)} | ${round(s.meanLDF2026)} | ${round(s.meanLDF2021)} | ${signed(s.meanDeltaLDF)} | ${s.udfWins}/${s.ldfWins}/${s.ndaWins}${s.otherWins > 0 ? `/${s.otherWins} (other)` : ""} |`
}

function expectedWinner(stats: CohortStats): keyof AllianceShares {
  const max = Math.max(
    stats.udfWins,
    stats.ldfWins,
    stats.ndaWins,
    stats.otherWins
  )
  if (max === stats.udfWins) return "UDF"
  if (max === stats.ldfWins) return "LDF"
  if (max === stats.ndaWins) return "NDA"
  return "OTHER"
}

function outliersFor(
  statsArr: CohortStats[],
  cohortField: "christianCohort" | "muslimCohort"
): string {
  const blocks: string[] = []
  for (const s of statsArr) {
    if (s.cohort === "below_threshold") continue
    const expected = expectedWinner(s)
    const outliers = rows.filter(
      (r) => r[cohortField] === s.cohort && r.winner2026 !== expected
    )
    if (outliers.length === 0) continue
    const lines = outliers.map((r) => {
      const u = round(r.shares2026.UDF)
      const l = round(r.shares2026.LDF)
      const n = round(r.shares2026.NDA)
      return `- **${r.acName}** (AC #${r.acNumber}) — winner ${r.winner2026}: UDF ${u} · LDF ${l} · NDA ${n} · Δ UDF ${signed(r.deltas.UDF)}`
    })
    blocks.push(
      `### ${s.label} cohort (modal winner: ${expected}) — ${outliers.length} outlier${outliers.length === 1 ? "" : "s"}\n\n${lines.join("\n")}`
    )
  }
  return blocks.length === 0
    ? "_No outliers — all cohort ACs went with the modal winner._"
    : blocks.join("\n\n")
}

const today = new Date().toISOString().split("T")[0]

const md = `# Sub-rite cohort × UDF performance — Sprint 2 analysis

**Generated:** ${today} by \`scripts/analysis/analyze-subrite-cohorts.ts\`

First quantitative pass over the new OSM-derived sub-rite cohort layer
(\`src/lib/data/subrite-bins.ts\`) against alliance performance.

The cohort assignment uses 2025-projected Census religion shares × OSM
POI mix, with a ${COHORT_VOTER_SHARE_THRESHOLD}% voter-share threshold
and a ${MIN_CLASSIFIED_FOR_COHORT}-POI minimum sample. ACs that don't
meet both fall into the "below threshold" residual bucket.

## Method

For each AC:
- **Cohort**: dominant sub-rite among that religion's classified POIs,
  weighted by Census religion share to estimate "share of voters".
- **Alliance shares**: 2026 vote share from \`data/results-2026.json\`;
  2021 baseline from \`data/historical/S11-*.json\`. Δ = 2026 − 2021,
  percentage points.
- **Winner**: 2026 alliance with the highest share.

Within-cohort statistics are unweighted means across ACs in the cohort.
We're asking: among ACs where X sub-rite is the dominant religious
sub-community, what does the alliance pattern look like on average?

## Christian sub-rite cohorts

| Cohort | n | UDF 2026 | UDF 2021 | Δ UDF | LDF 2026 | LDF 2021 | Δ LDF | Wins (U/L/N) |
|---|---:|---:|---:|---:|---:|---:|---:|:---:|
${christianStats.map(tableRow).join("\n")}

### Reading the Christian table

The 8 Christian sub-rite cohorts plus a "below threshold" residual
cover all 140 ACs. Cohort sizes range from 2 (Marthoma) to 31
(Syro-Malabar) to 61 (below threshold — mostly Muslim-belt + Hindu-
majority interior ACs where no Christian sub-rite reaches the 5%
voter-share threshold).

Cross-cohort comparisons to read:

- **Syro-Malabar (n=31)** vs **Latin Catholic (n=28)**: the two largest
  Christian cohorts. Compare 2026 UDF margins and the 2021→2026 swing.
- **Indian Orthodox (n=10)**: distinct geography (Tiruvalla / Niranam
  belt) — does the alliance trajectory differ from the Catholic blocs?
- **Marthoma (n=2)**: tiny sample; treat any pattern as suggestive
  rather than conclusive.
- **CSI (n=5)** + **Jacobite (n=3)**: also small; useful for contrast,
  not for statistical claims.
- **Below-threshold residual (n=61)**: this is the "Christian is not
  the relevant axis here" bucket. Its alliance pattern is the baseline
  to compare cohort patterns against.

## Muslim sub-rite cohorts

| Cohort | n | UDF 2026 | UDF 2021 | Δ UDF | LDF 2026 | LDF 2021 | Δ LDF | Wins (U/L/N) |
|---|---:|---:|---:|---:|---:|---:|---:|:---:|
${muslimStats.map(tableRow).join("\n")}

### Reading the Muslim table

Two real cohorts: Sunni (n=48) and Salafi/Mujahid (n=14). The
Ahmadiyya cohort that appeared in the visualisation pre-N≥3 gate fell
out (all three Ahmadiyya-dominant ACs had ≤2 classified Muslim POIs).

The key question: do Mujahid-dominant ACs vote like the Sunni cohort,
or differently? The standing political assumption is that IUML's
Sunni-establishment relationship is firmer than its relationship with
Mujahid factions — so Mujahid ACs might be less reliably UDF.

## Variance explained — sub-rite cohort vs raw religion share

For 2026 UDF vote share among Christian-cohort-labelled ACs (n=${labeledRows.length}):

| Predictor | R² |
|---|---:|
| Christian sub-rite cohort (one-way) | ${cohortR2.toFixed(3)} |
| Christian % of population (linear)  | ${christianPctR2.toFixed(3)} |

For the Δ UDF (2026 − 2021) swing:

| Predictor | R² |
|---|---:|
| Christian sub-rite cohort (one-way) | ${cohortR2Delta.toFixed(3)} |
| Christian % of population (linear)  | ${christianPctR2Delta.toFixed(3)} |

For Muslim cohort vs Muslim % (n=${muslimLabeledRows.length}, on UDF 2026):

| Predictor | R² |
|---|---:|
| Muslim sub-rite cohort (one-way) | ${muslimCohortR2.toFixed(3)} |
| Muslim % of population (linear)  | ${muslimPctR2.toFixed(3)} |

### Reading the variance table

A higher R² for "cohort" relative to "% population" suggests the
specific sub-rite identity adds information beyond the simple
religion-share — i.e., it matters not just *how many* Christians live
in an AC but *which* Christians.

Caveats:
- One-way ANOVA inflates R² when there are many cohorts; the raw
  comparison favours the cohort term. A fair contest would apply a
  degrees-of-freedom correction or use cross-validated R²; we haven't.
- Religion share has a near-monotonic relationship with UDF, so a
  linear-Pearson R² is a sensible baseline.
- The point of this table is **whether the cohort term has explanatory
  power at all**, not which is strictly "better". If cohort R² is
  barely above religion-share R², the sub-rite distinction is mostly
  noise. If it's substantially higher, sub-rite identity is a real
  second-order variable.

## Christian cohort outliers

${outliersFor(christianStats, "christianCohort")}

## Muslim cohort outliers

${outliersFor(muslimStats, "muslimCohort")}

## Open questions for follow-up

1. **Latin vs Syro-Malabar swing direction.** If the table shows the
   two largest Catholic cohorts moved differently in 2026, that's a
   walkthrough-worthy finding. The UDF walkthrough currently treats
   the Christian-belt sweep as monolithic.
2. **Orthodox-belt independence.** If the Indian Orthodox cohort shows
   a swing distinct from the Catholic cohorts, the Tiruvalla–Niranam
   corridor is doing something specific.
3. **Sunni vs Mujahid split.** If Mujahid-dominant ACs show
   systematically different UDF margin than Sunni-dominant ACs, that
   speaks to IUML's organisational reach within Muslim sub-sects.
4. **Predictive power of cohort vs religion-share.** If cohort R²
   meaningfully exceeds religion-share R² (after a fair correction),
   then sub-rite identity is a real second-order variable.

## What this report doesn't do

- No 2016 / 2011 trend (multi-cycle). Add as a follow-up if cross-
  cycle behaviour seems different from 2021→2026.
- No district-fixed-effect controls. Some sub-rite cohorts cluster
  geographically (Syro-Malabar ≈ Kottayam-Idukki belt, Latin ≈ coastal)
  so cohort effects may be confounded with district effects. A proper
  model would partial out district.
- No vote-flow (UDF→LDF transitions) analysis by cohort. Could be a
  next-phase if cohort margins look interesting.
`

const outputPath = "docs/narratives/sub-rite-cohort-analysis.md"
await Bun.write(outputPath, md)
console.log(`[analysis] wrote ${outputPath}`)
console.log(``)
console.log(`Christian cohorts:`)
for (const s of christianStats) {
  console.log(
    `  ${s.label.padEnd(36)} n=${String(s.n).padStart(3)}  UDF ${round(s.meanUDF2026).toFixed(1).padStart(5)} (Δ ${signed(s.meanDeltaUDF).padStart(5)})  wins U/L/N = ${s.udfWins}/${s.ldfWins}/${s.ndaWins}`
  )
}
console.log(``)
console.log(`Muslim cohorts:`)
for (const s of muslimStats) {
  console.log(
    `  ${s.label.padEnd(36)} n=${String(s.n).padStart(3)}  UDF ${round(s.meanUDF2026).toFixed(1).padStart(5)} (Δ ${signed(s.meanDeltaUDF).padStart(5)})  wins U/L/N = ${s.udfWins}/${s.ldfWins}/${s.ndaWins}`
  )
}
console.log(``)
console.log(`Variance explained (R²):`)
console.log(`  Christian cohort on UDF 2026: ${cohortR2.toFixed(3)}`)
console.log(`  Christian % on UDF 2026:      ${christianPctR2.toFixed(3)}`)
console.log(`  Christian cohort on Δ UDF:    ${cohortR2Delta.toFixed(3)}`)
console.log(`  Christian % on Δ UDF:         ${christianPctR2Delta.toFixed(3)}`)
console.log(`  Muslim cohort on UDF 2026:    ${muslimCohortR2.toFixed(3)}`)
console.log(`  Muslim % on UDF 2026:         ${muslimPctR2.toFixed(3)}`)
