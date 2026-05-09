/**
 * Narrative A1 test: did UDF's 2026 sweep correlate with district-level
 * minority share?
 *
 * Test design:
 *   x-axis: district's (Muslim + Christian) population share (2011 census)
 *   y-axis: AC's UDF vote-share delta 2021 → 2026 (in pp)
 *
 * If the consensus narrative (UDF won by consolidating minority votes
 * back from LDF) is correct, the correlation should be positive AND
 * substantively large (high-minority districts showing meaningfully
 * stronger UDF growth than low-minority ones).
 *
 * Caveats: religion data is district-level, not AC-level. All 14 ACs
 * in Malappuram share the same minority share. This blurs intra-
 * district variation but should preserve the inter-district signal.
 */
import * as fs from "fs"
import * as path from "path"

type Cand = {
  name: string
  party: string
  alliance: string
  votes: number
  isNota?: boolean
}
type C2026 = {
  constituencyNumber: number
  constituencyName: string
  candidates: Cand[]
}
type Hist = {
  constituencyNumber: number
  constituencyName: string
  elections: { year: number; type?: string; candidates: Cand[] }[]
}

const data2026: C2026[] = JSON.parse(
  fs.readFileSync("data/kerala-2026.json", "utf8")
)
const hist: Hist[] = fs
  .readdirSync("data/historical")
  .filter((f) => f.startsWith("S11-"))
  .map((f) =>
    JSON.parse(fs.readFileSync(path.join("data/historical", f), "utf8"))
  )
const histByNum = new Map(hist.map((h) => [h.constituencyNumber, h]))

const districtData = JSON.parse(
  fs.readFileSync("data/districts.json", "utf8")
) as { constituencyToDistrict: Record<string, string> }
const districtByConst = new Map<number, string>()
for (const [k, v] of Object.entries(districtData.constituencyToDistrict)) {
  districtByConst.set(Number(k), v)
}

const demoData = JSON.parse(fs.readFileSync("data/demographics.json", "utf8"))
const religionByDist = demoData.districts as Record<
  string,
  {
    religions: {
      hindu: number
      muslim: number
      christian: number
      other: number
    }
  }
>

function shareForAC(
  c: C2026 | { candidates: Cand[] },
  alliance: string
): number {
  let v = 0,
    total = 0
  for (const cand of c.candidates) {
    if (cand.isNota) continue
    total += cand.votes
    if (cand.alliance === alliance) v += cand.votes
  }
  return total > 0 ? (v / total) * 100 : 0
}

type Row = {
  seat: number
  name: string
  district: string
  hinduPct: number
  muslimPct: number
  christianPct: number
  minorityPct: number
  udfPct2021: number
  udfPct2026: number
  udfDelta: number
  ldfPct2021: number
  ldfPct2026: number
  ldfDelta: number
  ndaPct2026: number
}

const rows: Row[] = []
for (const c of data2026) {
  const distId = districtByConst.get(c.constituencyNumber)
  if (!distId) continue
  const r = religionByDist[distId]?.religions
  if (!r) continue
  const h = histByNum.get(c.constituencyNumber)
  const e21 = h?.elections.find((e) => e.year === 2021 && e.type === "general")
  if (!e21) continue
  const udf26 = shareForAC(c, "UDF")
  const udf21 = shareForAC(e21, "UDF")
  const ldf26 = shareForAC(c, "LDF")
  const ldf21 = shareForAC(e21, "LDF")
  const nda26 = shareForAC(c, "NDA")
  rows.push({
    seat: c.constituencyNumber,
    name: c.constituencyName,
    district: distId,
    hinduPct: r.hindu,
    muslimPct: r.muslim,
    christianPct: r.christian,
    minorityPct: r.muslim + r.christian,
    udfPct2021: udf21,
    udfPct2026: udf26,
    udfDelta: udf26 - udf21,
    ldfPct2021: ldf21,
    ldfPct2026: ldf26,
    ldfDelta: ldf26 - ldf21,
    ndaPct2026: nda26,
  })
}

console.log(
  `Loaded ${rows.length}/140 ACs with full religion + 2021 + 2026 data\n`
)

// Pearson correlation
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

const xs = rows.map((r) => r.minorityPct)
const yUDF = rows.map((r) => r.udfDelta)
const yLDF = rows.map((r) => r.ldfDelta)

console.log("=== Correlation (Pearson r) ===")
console.log(
  `  Minority share × UDF Δ:  r = ${corr(xs, yUDF).toFixed(3)}  (positive = narrative supported)`
)
console.log(
  `  Minority share × LDF Δ:  r = ${corr(xs, yLDF).toFixed(3)}  (negative = narrative supported)`
)
console.log()

// Bin by minority share
function binMean(filter: (r: Row) => boolean, label: string) {
  const subset = rows.filter(filter)
  const m = (key: keyof Row) =>
    subset.reduce((s, r) => s + (r[key] as number), 0) /
    Math.max(1, subset.length)
  const mu = m("udfDelta"),
    ml = m("ldfDelta")
  // residual: where did LDF's loss go that UDF didn't catch?
  const residual = -ml - mu
  console.log(
    `  ${label.padEnd(28)} n=${subset.length.toString().padStart(3)}   UDF Δ ${mu >= 0 ? "+" : ""}${mu.toFixed(2)}pp   LDF Δ ${ml >= 0 ? "+" : ""}${ml.toFixed(2)}pp   residual ${residual >= 0 ? "+" : ""}${residual.toFixed(2)}pp`
  )
}

console.log("=== Mean swings by minority-share bin ===")
console.log(
  "  (residual = LDF loss not absorbed by UDF — went to NDA/OTHER/turnout shifts)"
)
binMean((r) => r.minorityPct >= 60, "Very high minority (≥60%)")
binMean((r) => r.minorityPct >= 50 && r.minorityPct < 60, "High (50–60%)")
binMean((r) => r.minorityPct >= 40 && r.minorityPct < 50, "Mid-high (40–50%)")
binMean((r) => r.minorityPct >= 33 && r.minorityPct < 40, "Mid (33–40%)")
binMean((r) => r.minorityPct < 33, "Low / Hindu-heavy (<33%)")
console.log()

console.log("=== Per-district summary (sorted by minority share desc) ===")
const distRows = new Map<string, Row[]>()
for (const r of rows) {
  if (!distRows.has(r.district)) distRows.set(r.district, [])
  distRows.get(r.district)!.push(r)
}
const distSummary = [...distRows.entries()].map(([d, rs]) => ({
  district: d,
  n: rs.length,
  minPct: rs[0].minorityPct,
  meanUDF: rs.reduce((s, r) => s + r.udfDelta, 0) / rs.length,
  meanLDF: rs.reduce((s, r) => s + r.ldfDelta, 0) / rs.length,
  hindu: rs[0].hinduPct,
  muslim: rs[0].muslimPct,
  christian: rs[0].christianPct,
}))
distSummary.sort((a, b) => b.minPct - a.minPct)
console.log("  district          n  min%   M%    C%    H%    UDF Δ      LDF Δ")
for (const d of distSummary) {
  console.log(
    `  ${d.district.padEnd(17)} ${d.n.toString().padStart(2)}  ${d.minPct.toFixed(1).padStart(4)}%  ${d.muslim.toFixed(1).padStart(4)}%  ${d.christian.toFixed(1).padStart(4)}%  ${d.hindu.toFixed(1).padStart(4)}%  ${(d.meanUDF >= 0 ? "+" : "") + d.meanUDF.toFixed(2)}pp  ${(d.meanLDF >= 0 ? "+" : "") + d.meanLDF.toFixed(2)}pp`
  )
}
console.log()

// Where did LDF's lost vote go?
console.log("=== LDF loss decomposition (statewide totals) ===")
const totalUDFDelta = rows.reduce((s, r) => s + r.udfDelta, 0) / rows.length
const totalLDFDelta = rows.reduce((s, r) => s + r.ldfDelta, 0) / rows.length
// NDA Δ: we have 2026 NDA and need 2021 NDA. Get from the rows
let totalNDA21 = 0,
  totalNDA26 = 0,
  totalValid = 0
for (const c of data2026) {
  for (const cand of c.candidates) {
    if (cand.isNota) continue
    totalValid += cand.votes
    if (cand.alliance === "NDA") totalNDA26 += cand.votes
  }
}
let totalValid21 = 0
for (const h of hist) {
  const e = h.elections.find((x) => x.year === 2021 && x.type === "general")
  if (!e) continue
  for (const c of e.candidates) {
    if ((c as Cand).isNota) continue
    totalValid21 += c.votes
    if (c.alliance === "NDA") totalNDA21 += c.votes
  }
}
const ndaShare21 = (totalNDA21 / totalValid21) * 100
const ndaShare26 = (totalNDA26 / totalValid) * 100
console.log(
  `  Mean UDF Δ across 140 ACs:  ${totalUDFDelta >= 0 ? "+" : ""}${totalUDFDelta.toFixed(2)}pp`
)
console.log(
  `  Mean LDF Δ:                 ${totalLDFDelta >= 0 ? "+" : ""}${totalLDFDelta.toFixed(2)}pp`
)
console.log(
  `  Statewide NDA Δ:            ${ndaShare26 - ndaShare21 >= 0 ? "+" : ""}${(ndaShare26 - ndaShare21).toFixed(2)}pp`
)
console.log()

// District-level NDA Δ vs minority share
console.log("=== District NDA Δ — does NDA grow more in Hindu-heavy areas? ===")
const distSummary2: Array<{
  district: string
  minPct: number
  ndaDelta: number
  ldfDelta: number
}> = []
for (const [d, rs] of distRows.entries()) {
  // get mean NDA Δ for this district
  let nda21Sum = 0,
    nda26Sum = 0,
    valid21Sum = 0,
    valid26Sum = 0
  for (const r of rs) {
    const c26 = data2026.find((x) => x.constituencyNumber === r.seat)!
    const h = histByNum.get(r.seat)!
    const e21 = h.elections.find(
      (e) => e.year === 2021 && e.type === "general"
    )!
    for (const cand of c26.candidates) {
      if (cand.isNota) continue
      valid26Sum += cand.votes
      if (cand.alliance === "NDA") nda26Sum += cand.votes
    }
    for (const cand of e21.candidates) {
      if ((cand as Cand).isNota) continue
      valid21Sum += cand.votes
      if (cand.alliance === "NDA") nda21Sum += cand.votes
    }
  }
  const ndaDelta = (nda26Sum / valid26Sum) * 100 - (nda21Sum / valid21Sum) * 100
  const meanLDF = rs.reduce((s, r) => s + r.ldfDelta, 0) / rs.length
  distSummary2.push({
    district: d,
    minPct: rs[0].minorityPct,
    ndaDelta,
    ldfDelta: meanLDF,
  })
}
distSummary2.sort((a, b) => a.minPct - b.minPct)
console.log("  district          min%   NDA Δ      LDF Δ")
for (const d of distSummary2) {
  console.log(
    `  ${d.district.padEnd(17)}  ${d.minPct.toFixed(1).padStart(4)}%  ${d.ndaDelta >= 0 ? "+" : ""}${d.ndaDelta.toFixed(2)}pp   ${d.ldfDelta >= 0 ? "+" : ""}${d.ldfDelta.toFixed(2)}pp`
  )
}
console.log()

// Outliers
console.log("=== Outliers: high-minority (≥40%) ACs with UDF Δ < +3pp ===")
const highMinUnderperformers = rows
  .filter((r) => r.minorityPct >= 40 && r.udfDelta < 3)
  .sort((a, b) => a.udfDelta - b.udfDelta)
for (const r of highMinUnderperformers) {
  console.log(
    `  seat=${r.seat.toString().padStart(3)}  ${r.name.padEnd(20)}  ${r.district.padEnd(15)} min=${r.minorityPct.toFixed(0)}%  UDF Δ ${r.udfDelta >= 0 ? "+" : ""}${r.udfDelta.toFixed(1)}pp  LDF Δ ${r.ldfDelta >= 0 ? "+" : ""}${r.ldfDelta.toFixed(1)}pp`
  )
}
