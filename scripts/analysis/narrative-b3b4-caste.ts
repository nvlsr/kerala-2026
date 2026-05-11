/**
 * Caste correlation pass — first-cut test of narrative hypotheses
 * B3 (Ezhava base erosion + BJP encroachment) and B4 (Nair UDF lean).
 *
 * Inputs:
 * - data/district-hindu-castes.json (Zachariah 2003, ~2000 survey)
 * - data/district-religion.json (district Hindu shares — to weight)
 * - data/results-2026.json + data/historical/ (alliance Δ per AC)
 *
 * For each AC:
 *   x_nair    = (district Nair % of Hindu) × (district Hindu % of total)
 *             = Nair share of total district population
 *   x_ezhava  = same, for Ezhava
 *   y_X       = AC's 2021→2026 alliance X share Δ in pp
 *
 * Hypotheses tested:
 *   B4: Nair share predicts UDF gain.       Expect r > 0.
 *   B3: Ezhava share predicts LDF loss.     Expect r < 0.
 *   B3': Ezhava share predicts NDA gain.    Expect r > 0.
 *
 * Caveats: district-level data (15 unique points across 14 districts +
 * state row), so AC-level correlations are mostly driven by
 * between-district variation; ecological fallacy risk same as A1 v1.
 * 2000 baseline survey + state-level uniform fertility drift; absolute
 * shares may be off ±3pp.
 */
import * as fs from "fs"
import {
  load2026,
  loadHistorical,
  type Candidate2026 as Cand,
  type Constituency2026 as C2026,
  type HistoricalConstituency as Hist,
} from "../_lib/load"

const data2026: C2026[] = load2026()
const histByNum: Map<number, Hist> = loadHistorical()
const hist: Hist[] = [...histByNum.values()]

const caste = JSON.parse(
  fs.readFileSync("data/district-hindu-castes.json", "utf8")
)
const demo = JSON.parse(fs.readFileSync("data/district-religion.json", "utf8"))
const districtData = JSON.parse(fs.readFileSync("data/districts.json", "utf8"))
const distByConst = new Map<number, string>()
for (const [k, v] of Object.entries(districtData.constituencyToDistrict)) {
  distByConst.set(Number(k), v as string)
}

function shareIn(cands: Cand[], a: string): number {
  let v = 0,
    t = 0
  for (const c of cands) {
    if (c.isNota) continue
    t += c.votes
    if (c.alliance === a) v += c.votes
  }
  return t > 0 ? (v / t) * 100 : 0
}

type Row = {
  seat: number
  name: string
  district: string
  hinduShare: number
  // Hindu sub-community shares as % of TOTAL district population
  nairOfTotal: number
  ezhavaOfTotal: number
  brahminOfTotal: number | null
  udfDelta: number
  ldfDelta: number
  ndaDelta: number
}

const rows: Row[] = []
for (const c of data2026) {
  const dist = distByConst.get(c.constituencyNumber)
  if (!dist) continue
  const cd = caste.districts[dist]
  if (!cd) continue
  const hindu = demo.districts[dist]?.religions?.hindu ?? 0
  const h = histByNum.get(c.constituencyNumber)
  const e21 = h?.elections.find((e) => e.year === 2021 && e.type === "general")
  if (!e21) continue
  rows.push({
    seat: c.constituencyNumber,
    name: c.constituencyName,
    district: dist,
    hinduShare: hindu,
    nairOfTotal: (cd.nair / 100) * hindu,
    ezhavaOfTotal: (cd.ezhava / 100) * hindu,
    brahminOfTotal: cd.brahmin != null ? (cd.brahmin / 100) * hindu : null,
    udfDelta: shareIn(c.candidates, "UDF") - shareIn(e21.candidates, "UDF"),
    ldfDelta: shareIn(c.candidates, "LDF") - shareIn(e21.candidates, "LDF"),
    ndaDelta: shareIn(c.candidates, "NDA") - shareIn(e21.candidates, "NDA"),
  })
}

console.log(`Loaded ${rows.length}/140 ACs with caste + alliance Δ data\n`)

function corr(xs: number[], ys: number[]): number {
  const n = xs.length
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let num = 0,
    dx = 0,
    dy = 0
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my)
    dx += (xs[i] - mx) ** 2
    dy += (ys[i] - my) ** 2
  }
  return num / Math.sqrt(dx * dy)
}

console.log(
  "=== Caste-share × alliance Δ correlations (across 140 ACs, district-attributed) ==="
)
console.log("                            UDF Δ      LDF Δ      NDA Δ")
const xN = rows.map((r) => r.nairOfTotal)
const xE = rows.map((r) => r.ezhavaOfTotal)
const yU = rows.map((r) => r.udfDelta)
const yL = rows.map((r) => r.ldfDelta)
const yN = rows.map((r) => r.ndaDelta)

console.log(
  `Nair share (% total)     ${corr(xN, yU).toFixed(3).padStart(7)}    ${corr(xN, yL).toFixed(3).padStart(7)}    ${corr(xN, yN).toFixed(3).padStart(7)}`
)
console.log(
  `Ezhava share (% total)   ${corr(xE, yU).toFixed(3).padStart(7)}    ${corr(xE, yL).toFixed(3).padStart(7)}    ${corr(xE, yN).toFixed(3).padStart(7)}`
)
console.log()

// Per-district summary
console.log("=== District-level snapshot (sorted by Ezhava share desc) ===")
const distMap = new Map<string, Row[]>()
for (const r of rows) {
  if (!distMap.has(r.district)) distMap.set(r.district, [])
  distMap.get(r.district)!.push(r)
}

const distRows = [...distMap.entries()].map(([d, rs]) => {
  const cd = caste.districts[d]
  const hindu = demo.districts[d].religions.hindu
  const meanU = rs.reduce((s, r) => s + r.udfDelta, 0) / rs.length
  const meanL = rs.reduce((s, r) => s + r.ldfDelta, 0) / rs.length
  const meanN = rs.reduce((s, r) => s + r.ndaDelta, 0) / rs.length
  return {
    district: d,
    n: rs.length,
    hindu,
    nairOfTotal: (cd.nair / 100) * hindu,
    ezhavaOfTotal: (cd.ezhava / 100) * hindu,
    udfDelta: meanU,
    ldfDelta: meanL,
    ndaDelta: meanN,
  }
})
distRows.sort((a, b) => b.ezhavaOfTotal - a.ezhavaOfTotal)
console.log(
  "  district          H%    Nair%   Ezhava%    UDF Δ      LDF Δ      NDA Δ"
)
for (const d of distRows) {
  console.log(
    `  ${d.district.padEnd(17)} ${d.hindu.toFixed(1).padStart(4)}%  ${d.nairOfTotal.toFixed(1).padStart(5)}%  ${d.ezhavaOfTotal.toFixed(1).padStart(6)}%   ${(d.udfDelta >= 0 ? "+" : "") + d.udfDelta.toFixed(2)}pp   ${(d.ldfDelta >= 0 ? "+" : "") + d.ldfDelta.toFixed(2)}pp   ${(d.ndaDelta >= 0 ? "+" : "") + d.ndaDelta.toFixed(2)}pp`
  )
}
console.log()

// Bin by Ezhava share
function binMean(filter: (r: Row) => boolean, label: string) {
  const subset = rows.filter(filter)
  if (!subset.length) return
  const u = subset.reduce((s, r) => s + r.udfDelta, 0) / subset.length
  const l = subset.reduce((s, r) => s + r.ldfDelta, 0) / subset.length
  const n = subset.reduce((s, r) => s + r.ndaDelta, 0) / subset.length
  console.log(
    `  ${label.padEnd(36)} n=${subset.length.toString().padStart(3)}   UDF Δ ${u >= 0 ? "+" : ""}${u.toFixed(2)}pp   LDF Δ ${l >= 0 ? "+" : ""}${l.toFixed(2)}pp   NDA Δ ${n >= 0 ? "+" : ""}${n.toFixed(2)}pp`
  )
}

console.log("=== ACs binned by Ezhava share (% of total district pop) ===")
binMean((r) => r.ezhavaOfTotal >= 30, "Very high Ezhava (≥30%)")
binMean(
  (r) => r.ezhavaOfTotal >= 22 && r.ezhavaOfTotal < 30,
  "High Ezhava (22-30%)"
)
binMean(
  (r) => r.ezhavaOfTotal >= 15 && r.ezhavaOfTotal < 22,
  "Mid Ezhava (15-22%)"
)
binMean((r) => r.ezhavaOfTotal < 15, "Low Ezhava (<15%)")
console.log()

console.log("=== ACs binned by Nair share (% of total district pop) ===")
binMean((r) => r.nairOfTotal >= 25, "Very high Nair (≥25%)")
binMean((r) => r.nairOfTotal >= 15 && r.nairOfTotal < 25, "High Nair (15-25%)")
binMean((r) => r.nairOfTotal >= 10 && r.nairOfTotal < 15, "Mid Nair (10-15%)")
binMean((r) => r.nairOfTotal < 10, "Low Nair (<10%)")
