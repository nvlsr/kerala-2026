/**
 * Christian-walkthrough draft — confounder mitigations.
 *
 * Tests two ecological-fallacy bounds raised during draft review:
 *
 *   M1 — Does NDA share GROW between 2021→2026 in south Latin ACs?
 *        If yes, "Hindu shift to NDA absorbed Christian UDF swing" gains
 *        aggregate support. If no, south Latin UDF swing (+6.8pp) is
 *        genuinely smaller than central/north (+10pp) — not absorption.
 *
 *   M2 — Within Ernakulam district, do SM-cohort and Latin-cohort ACs
 *        swing differently? If yes, the cohort effect survives a
 *        same-district control. If no, the cohort effect is mostly a
 *        district effect.
 *
 * Usage: bun run scripts/analyze-christian-mitigations.ts
 */
import { readdirSync } from "node:fs"

import { christianSubRiteCohortFor } from "@/lib/data/subrite-bins"

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

const ZONE: Record<string, "south" | "central" | "north"> = {
  thiruvananthapuram: "south",
  kollam: "south",
  pathanamthitta: "south",
  alappuzha: "central",
  kottayam: "central",
  ernakulam: "central",
  thrissur: "central",
  idukki: "central",
  palakkad: "central",
  kozhikode: "north",
  malappuram: "north",
  kannur: "north",
  kasaragod: "north",
  wayanad: "north",
}

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
  zone: "south" | "central" | "north" | "(unzoned)"
  cohort: ReturnType<typeof christianSubRiteCohortFor>
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
  rows.push({
    acNumber: c.constituencyNumber,
    acName: nameByAc.get(c.constituencyNumber) ?? c.constituencyName,
    district: dist,
    zone: ZONE[dist] ?? "(unzoned)",
    cohort: christianSubRiteCohortFor(c.constituencyNumber),
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

console.log(``)
