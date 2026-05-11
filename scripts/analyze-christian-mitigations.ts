/**
 * Christian-walkthrough draft — confounder mitigations.
 *
 * Tests three ecological-fallacy bounds raised during draft review:
 *
 *   M1 — Does NDA share GROW between 2021→2026 in south Latin ACs?
 *        Tests Hindu→NDA absorption alternative explanation.
 *
 *   M2 — Within Ernakulam district, do SM-cohort and Latin-cohort ACs
 *        swing differently? Tests district-effect confounding.
 *
 *   M3 — Within each cohort, do high-Christian-share ACs swing
 *        differently from low-Christian-share ACs? Tests within-cohort
 *        heterogeneity — whether the cohort label means the same thing
 *        in a 40%-Christian AC and a 12%-Christian AC.
 *
 * Usage: bun run scripts/analyze-christian-mitigations.ts
 */
import { readdirSync } from "node:fs"

import {
  christianSubRiteCohortFor,
  CHRISTIAN_SUBRITE_COHORTS,
  type ChristianSubRiteCohort,
} from "@/lib/data/subrite-bins"
import { getReligiousSignatureForAC } from "@/lib/data/religious-pois"
import { ZONE, type Zone } from "@/lib/data/zones"

type AllianceShares = { UDF: number; LDF: number; NDA: number; OTHER: number }
type Candidate2026 = {
  alliance?: string
  isNota?: boolean
  votes: number
  party: string
}
type Constituency2026 = {
  constituencyNumber: number
  constituencyName: string
  candidates: Candidate2026[]
}
type HistoricalCandidate = { alliance: string; votes: number }
type HistoricalElection = {
  year: number
  type: string
  candidates: HistoricalCandidate[]
}
type HistoricalConstituency = {
  constituencyNumber: number
  elections: HistoricalElection[]
}

// ZONE map now lives in src/lib/data/zones.ts (sanity-checked against
// districts.json on import).

function shares2026(c: Constituency2026): AllianceShares {
  let total = 0
  for (const cand of c.candidates) if (!cand.isNota) total += cand.votes
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

function shares2021(h: HistoricalConstituency): AllianceShares | null {
  const e = h.elections.find((e) => e.year === 2021 && e.type === "general")
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

// Load
const cs = (await Bun.file(
  "data/kerala-2026.json"
).json()) as Constituency2026[]

const historicalByAc = new Map<number, HistoricalConstituency>()
for (const f of readdirSync("data/historical").filter(
  (x) => x.startsWith("S11-") && x.endsWith(".json")
)) {
  const d = (await Bun.file(`data/historical/${f}`).json()) as
    | HistoricalConstituency
    | { default: HistoricalConstituency }
  const c = "default" in d ? d.default : d
  historicalByAc.set(c.constituencyNumber, c)
}

const geo = (await Bun.file("data/kerala-constituencies.geojson").json()) as {
  features: Array<{
    properties: { constituencyNumber: number; name: string; districtId: string }
  }>
}
const distByAc = new Map<number, string>()
const nameByAc = new Map<number, string>()
for (const f of geo.features) {
  distByAc.set(f.properties.constituencyNumber, f.properties.districtId)
  nameByAc.set(f.properties.constituencyNumber, f.properties.name)
}

type Row = {
  acNumber: number
  acName: string
  district: string
  zone: Zone | "(unzoned)"
  cohort: ReturnType<typeof christianSubRiteCohortFor>
  christianPct: number
  s2021: AllianceShares
  s2026: AllianceShares
  delta: AllianceShares
}

const rows: Row[] = []
for (const c of cs) {
  const h = historicalByAc.get(c.constituencyNumber)
  if (!h) continue
  const s21 = shares2021(h)
  if (!s21) continue
  const s26 = shares2026(c)
  const dist = distByAc.get(c.constituencyNumber) ?? ""
  const sig = getReligiousSignatureForAC(c.constituencyNumber)
  rows.push({
    acNumber: c.constituencyNumber,
    acName: nameByAc.get(c.constituencyNumber) ?? c.constituencyName,
    district: dist,
    zone: ZONE[dist] ?? "(unzoned)",
    cohort: christianSubRiteCohortFor(c.constituencyNumber),
    christianPct: sig?.religionPopPct.christian ?? 0,
    s2021: s21,
    s2026: s26,
    delta: {
      UDF: s26.UDF - s21.UDF,
      LDF: s26.LDF - s21.LDF,
      NDA: s26.NDA - s21.NDA,
      OTHER: s26.OTHER - s21.OTHER,
    },
  })
}

const mean = (xs: number[]) =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length
const signed = (x: number, dp = 1) =>
  `${x >= 0 ? "+" : ""}${x.toFixed(dp)}`

// ── M1 — NDA Δ alongside UDF Δ per zone within Latin Catholic cohort ──
console.log(
  "═".repeat(80) +
    "\nM1 — Latin Catholic cohort: NDA Δ alongside UDF Δ per zone\n" +
    "═".repeat(80)
)
console.log(
  `\nHypothesis to test: If south Latin's smaller UDF swing (+6.8pp) is\n` +
    `because NDA absorbed Hindus, NDA share should GROW in south Latin.\n` +
    `If NDA Δ is small/flat/negative, the +6.8 is genuinely a smaller\n` +
    `Christian swing.\n`
)
const latin = rows.filter((r) => r.cohort === "latin_catholic")
const byZone = { south: [] as Row[], central: [] as Row[], north: [] as Row[] }
for (const r of latin) {
  if (r.zone in byZone) byZone[r.zone as keyof typeof byZone].push(r)
}
console.log(
  `\nZone       n   UDF21  UDF26  ΔUDF    LDF21  LDF26  ΔLDF    NDA21  NDA26  ΔNDA`
)
for (const [zone, acs] of Object.entries(byZone)) {
  if (acs.length === 0) continue
  const f = (key: "UDF" | "LDF" | "NDA", year: "s2021" | "s2026" | "delta") =>
    mean(acs.map((r) => r[year][key])).toFixed(1).padStart(5)
  console.log(
    `${zone.padEnd(8)} ${String(acs.length).padStart(3)}   ${f("UDF", "s2021")}  ${f("UDF", "s2026")}  ${signed(mean(acs.map((r) => r.delta.UDF)))}    ${f("LDF", "s2021")}  ${f("LDF", "s2026")}  ${signed(mean(acs.map((r) => r.delta.LDF)))}    ${f("NDA", "s2021")}  ${f("NDA", "s2026")}  ${signed(mean(acs.map((r) => r.delta.NDA)))}`
  )
}

console.log(
  `\nReading: Compare the ΔNDA column across zones. A meaningfully\n` +
    `larger ΔNDA in south Latin (vs central / north) would support the\n` +
    `"NDA absorbed Hindu swing" hypothesis. A flat or smaller ΔNDA in\n` +
    `south Latin means the +6.8pp UDF swing was genuinely smaller.\n`
)

// ── M2 — Same-district cross-cohort: Ernakulam SM vs Latin ───────────
console.log(
  "═".repeat(80) +
    "\nM2 — Same-district cross-cohort: Ernakulam SM vs Latin cohorts\n" +
    "═".repeat(80)
)
console.log(
  `\nHypothesis to test: If SM-cohort and Latin-cohort ACs within\n` +
    `Ernakulam swing DIFFERENTLY, the cohort effect survives a same-\n` +
    `district control. If they swing SIMILARLY, the cohort effect is\n` +
    `mostly a district effect.\n`
)

const TARGET_DISTRICTS = ["ernakulam", "alappuzha", "kottayam", "thrissur"]
for (const dist of TARGET_DISTRICTS) {
  const distRows = rows.filter((r) => r.district === dist)
  if (distRows.length === 0) continue
  console.log(
    `\n${dist.toUpperCase()} (n=${distRows.length} ACs with 2021 data)`
  )
  const cohorts = new Map<string, Row[]>()
  for (const r of distRows) {
    if (!cohorts.has(r.cohort)) cohorts.set(r.cohort, [])
    cohorts.get(r.cohort)!.push(r)
  }
  const ordered = [...cohorts.entries()].sort((a, b) => b[1].length - a[1].length)
  console.log(
    `  Cohort                           n    UDF21  UDF26  ΔUDF    NDA21  NDA26  ΔNDA`
  )
  for (const [cohort, acs] of ordered) {
    const m = (key: "UDF" | "NDA", year: "s2021" | "s2026") =>
      mean(acs.map((r) => r[year][key])).toFixed(1).padStart(5)
    console.log(
      `  ${cohort.padEnd(32)} ${String(acs.length).padStart(3)}    ${m("UDF", "s2021")}  ${m("UDF", "s2026")}  ${signed(mean(acs.map((r) => r.delta.UDF)))}    ${m("NDA", "s2021")}  ${m("NDA", "s2026")}  ${signed(mean(acs.map((r) => r.delta.NDA)))}`
    )
  }
  // List ACs within Ernakulam for spot-check
  if (dist === "ernakulam") {
    console.log(`\n  Per-AC detail (Ernakulam):`)
    console.log(
      `  ${"AC".padEnd(20)} ${"Cohort".padEnd(22)} ${"UDF21".padStart(5)} ${"UDF26".padStart(5)} ${"ΔUDF".padStart(5)} ${"ΔNDA".padStart(5)}`
    )
    for (const r of distRows.sort((a, b) => b.delta.UDF - a.delta.UDF)) {
      console.log(
        `  ${r.acName.padEnd(20)} ${r.cohort.padEnd(22)} ${r.s2021.UDF.toFixed(1).padStart(5)} ${r.s2026.UDF.toFixed(1).padStart(5)} ${signed(r.delta.UDF)} ${signed(r.delta.NDA)}`
      )
    }
  }
}

// ── M3 — Within-cohort heterogeneity by Christian share ──────────────
console.log(
  "═".repeat(80) +
    "\nM3 — Within-cohort heterogeneity: does Christian-share split the cohort signal?\n" +
    "═".repeat(80)
)
console.log(
  `\nHypothesis to test: a cohort like Latin Catholic includes ACs at\n` +
    `41% Christian (Vypeen) AND 10% Christian (Trikaripur). If high- and\n` +
    `low-share ACs swing similarly, the cohort signal generalises. If\n` +
    `they swing differently, the cohort mean is mixing two distinct\n` +
    `populations.\n`
)

const COHORTS_TO_TEST: ChristianSubRiteCohort[] = [
  "latin_catholic",
  "syro_malabar",
  "indian_orthodox",
  "jacobite_syrian",
  "below_threshold",
]

for (const cohort of COHORTS_TO_TEST) {
  const cohortRows = rows.filter((r) => r.cohort === cohort)
  if (cohortRows.length < 4) {
    console.log(
      `\n${CHRISTIAN_SUBRITE_COHORTS.find((c) => c.code === cohort)?.label ?? cohort}: n=${cohortRows.length}, too small to split meaningfully — skipping`
    )
    continue
  }
  // Split at median Christian share within the cohort
  const sorted = [...cohortRows].sort((a, b) => a.christianPct - b.christianPct)
  const medianIdx = Math.floor(sorted.length / 2)
  const median = sorted[medianIdx].christianPct
  const lo = sorted.slice(0, medianIdx)
  const hi = sorted.slice(medianIdx)

  const fLo = (key: "UDF" | "NDA", year: "s2021" | "s2026" | "delta") =>
    mean(lo.map((r) => r[year][key])).toFixed(1).padStart(5)
  const fHi = (key: "UDF" | "NDA", year: "s2021" | "s2026" | "delta") =>
    mean(hi.map((r) => r[year][key])).toFixed(1).padStart(5)
  const cMin = (xs: Row[]) =>
    xs
      .reduce((a, b) => Math.min(a, b.christianPct), Infinity)
      .toFixed(1)
      .padStart(5)
  const cMax = (xs: Row[]) =>
    xs
      .reduce((a, b) => Math.max(a, b.christianPct), -Infinity)
      .toFixed(1)
      .padStart(5)

  const label =
    CHRISTIAN_SUBRITE_COHORTS.find((c) => c.code === cohort)?.label ?? cohort

  console.log(
    `\n${label} (n=${cohortRows.length}, median Christian = ${median.toFixed(1)}%):`
  )
  console.log(
    `  Half       n    Christian-range   UDF21  UDF26  ΔUDF    NDA21  NDA26  ΔNDA`
  )
  console.log(
    `  LOW-share  ${String(lo.length).padStart(2)}   ${cMin(lo)}-${cMax(lo)}%   ${fLo("UDF", "s2021")}  ${fLo("UDF", "s2026")}  ${signed(mean(lo.map((r) => r.delta.UDF)))}    ${fLo("NDA", "s2021")}  ${fLo("NDA", "s2026")}  ${signed(mean(lo.map((r) => r.delta.NDA)))}`
  )
  console.log(
    `  HIGH-share ${String(hi.length).padStart(2)}   ${cMin(hi)}-${cMax(hi)}%   ${fHi("UDF", "s2021")}  ${fHi("UDF", "s2026")}  ${signed(mean(hi.map((r) => r.delta.UDF)))}    ${fHi("NDA", "s2021")}  ${fHi("NDA", "s2026")}  ${signed(mean(hi.map((r) => r.delta.NDA)))}`
  )

  // Diagnostic: did the swing differ meaningfully?
  const loDelta = mean(lo.map((r) => r.delta.UDF))
  const hiDelta = mean(hi.map((r) => r.delta.UDF))
  const gap = hiDelta - loDelta
  console.log(
    `  Gap (HIGH − LOW) ΔUDF: ${signed(gap)}pp  →  ${Math.abs(gap) < 2 ? "swings are similar — cohort signal generalises" : Math.abs(gap) < 5 ? "moderate heterogeneity" : "STRONG heterogeneity — investigate"}`
  )
}

// Within-cohort detail for cohorts that show heterogeneity — print per-AC
console.log("\nPer-AC detail for Latin Catholic, sorted by Christian share:")
const latinSorted = [...rows.filter((r) => r.cohort === "latin_catholic")].sort(
  (a, b) => a.christianPct - b.christianPct
)
console.log(
  `  ${"AC".padEnd(20)} ${"district".padEnd(20)} ${"Christian%".padStart(10)} ${"UDF21".padStart(6)} ${"UDF26".padStart(6)} ${"ΔUDF".padStart(6)} ${"ΔNDA".padStart(6)}`
)
for (const r of latinSorted) {
  console.log(
    `  ${r.acName.padEnd(20)} ${r.district.padEnd(20)} ${r.christianPct.toFixed(1).padStart(10)} ${r.s2021.UDF.toFixed(1).padStart(6)} ${r.s2026.UDF.toFixed(1).padStart(6)} ${signed(r.delta.UDF)} ${signed(r.delta.NDA)}`
  )
}

console.log(``)
