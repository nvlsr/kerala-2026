/**
 * A8 — Was Central Kerala (Christian-Muslim heartland) the
 * kingmaker region in 2026?
 *
 * Narrative claims:
 *   (i)   UDF won every seat in Idukki, Ernakulam, Wayanad,
 *         Malappuram, Kottayam (5 districts)
 *   (ii)  UDF lost only one each in Pathanamthitta, Kasaragod,
 *         Kozhikode (3 districts)
 *   (iii) LDF residual strength: Thrissur and Kannur (and not even
 *         those fully)
 *   (iv)  Pre-poll Manorama–C Voter: UDF 33 of 53 in Central Kerala
 *
 * Run: bun run scripts/analysis/narrative-a8-central-kerala.ts
 */
import * as fs from "fs"
import * as path from "path"

type Cand = {
  name: string
  party: string
  alliance: string
  votes: number
  isNota?: boolean
  status?: string
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
  fs.readFileSync("data/results-2026.json", "utf8")
)
const hist: Hist[] = fs
  .readdirSync("data/historical")
  .filter((f) => f.startsWith("S11-"))
  .map((f) =>
    JSON.parse(fs.readFileSync(path.join("data/historical", f), "utf8"))
  )
const histByNum = new Map(hist.map((h) => [h.constituencyNumber, h]))

const districtsMeta = JSON.parse(fs.readFileSync("data/districts.json", "utf8"))
const districtById: Record<string, { name: string }> = Object.fromEntries(
  districtsMeta.districts.map((d: { id: string; name: string }) => [d.id, d])
)
const districtOf: Record<string, string> = districtsMeta.constituencyToDistrict

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

function winnerAlliance(cands: Cand[]): string | null {
  let best: Cand | null = null
  for (const c of cands) {
    if (c.isNota) continue
    if (!best || c.votes > best.votes) best = c
  }
  return best?.alliance ?? null
}

type Row = {
  seat: number
  name: string
  district: string
  winner2021: string | null
  winner2026: string | null
  udf26: number
  ldf26: number
  nda26: number
  udfDelta: number
  ldfDelta: number
}

const rows: Row[] = []
for (const c of data2026) {
  const h = histByNum.get(c.constituencyNumber)
  const e21 = h?.elections.find((e) => e.year === 2021 && e.type === "general")
  const distId = districtOf[String(c.constituencyNumber)] ?? "?"
  const w21 = e21 ? winnerAlliance(e21.candidates) : null
  const w26 = winnerAlliance(c.candidates)
  rows.push({
    seat: c.constituencyNumber,
    name: c.constituencyName,
    district: distId,
    winner2021: w21,
    winner2026: w26,
    udf26: shareIn(c.candidates, "UDF"),
    ldf26: shareIn(c.candidates, "LDF"),
    nda26: shareIn(c.candidates, "NDA"),
    udfDelta: e21
      ? shareIn(c.candidates, "UDF") - shareIn(e21.candidates, "UDF")
      : 0,
    ldfDelta: e21
      ? shareIn(c.candidates, "LDF") - shareIn(e21.candidates, "LDF")
      : 0,
  })
}

console.log(`Loaded ${rows.length} ACs.\n`)

// ─── (i) Did UDF really sweep these 5 districts? ─────────────────────
const SWEEP_DISTRICTS = [
  "idukki",
  "ernakulam",
  "wayanad",
  "malappuram",
  "kottayam",
]
console.log("=== (i) Claimed UDF sweep districts ===")
for (const d of SWEEP_DISTRICTS) {
  const dRows = rows.filter((r) => r.district === d)
  const udfWins = dRows.filter((r) => r.winner2026 === "UDF").length
  const ldfWins = dRows.filter((r) => r.winner2026 === "LDF").length
  const ndaWins = dRows.filter((r) => r.winner2026 === "NDA").length
  const swept = udfWins === dRows.length
  console.log(
    `  ${districtById[d]?.name.padEnd(15) ?? d.padEnd(15)} (${dRows.length} ACs): UDF ${udfWins}, LDF ${ldfWins}, NDA ${ndaWins}  ` +
      `${swept ? "✓ SWEEP" : "✗ NOT a sweep"}`
  )
  if (!swept) {
    for (const r of dRows.filter((r) => r.winner2026 !== "UDF")) {
      console.log(
        `      └─ ${r.seat} ${r.name} → ${r.winner2026} (${r.winner2021}→${r.winner2026})`
      )
    }
  }
}
console.log()

// ─── (ii) UDF "lost only one" in 3 districts ─────────────────────────
const LOST_ONE_DISTRICTS = ["pathanamthitta", "kasaragod", "kozhikode"]
console.log("=== (ii) Claimed 'UDF lost only 1' districts ===")
for (const d of LOST_ONE_DISTRICTS) {
  const dRows = rows.filter((r) => r.district === d)
  const udfWins = dRows.filter((r) => r.winner2026 === "UDF").length
  const nonUdf = dRows.filter((r) => r.winner2026 !== "UDF")
  console.log(
    `  ${districtById[d]?.name.padEnd(15) ?? d.padEnd(15)} (${dRows.length} ACs): UDF ${udfWins}, others ${nonUdf.length}`
  )
  for (const r of nonUdf) {
    console.log(`      └─ ${r.seat} ${r.name} → ${r.winner2026}`)
  }
}
console.log()

// ─── (iii) LDF residual strength: Thrissur, Kannur ──────────────────
console.log("=== (iii) LDF residual strength check ===")
const LDF_STRONGHOLD_DISTRICTS = ["thrissur", "kannur", "kasaragod"]
for (const d of LDF_STRONGHOLD_DISTRICTS) {
  const dRows = rows.filter((r) => r.district === d)
  const ldfWins = dRows.filter((r) => r.winner2026 === "LDF").length
  const udfWins = dRows.filter((r) => r.winner2026 === "UDF").length
  const ndaWins = dRows.filter((r) => r.winner2026 === "NDA").length
  const ldfShare = dRows.reduce((a, b) => a + b.ldf26, 0) / dRows.length
  const ldfDelta = dRows.reduce((a, b) => a + b.ldfDelta, 0) / dRows.length
  console.log(
    `  ${districtById[d]?.name.padEnd(15) ?? d.padEnd(15)} (${dRows.length} ACs): UDF ${udfWins}, LDF ${ldfWins}, NDA ${ndaWins}  ` +
      `mean LDF share ${ldfShare.toFixed(1)}%  Δ ${ldfDelta >= 0 ? "+" : ""}${ldfDelta.toFixed(1)}pp`
  )
}
console.log()

// ─── (iv) "Central Kerala" — UDF 33 of 53 ────────────────────────────
// Manorama-C Voter's "Central Kerala" definition isn't formally
// codified, but based on coverage it appears to span the 5 sweep
// districts (Idukki, Ernakulam, Wayanad, Malappuram, Kottayam) plus
// Pathanamthitta + Thrissur. Test both definitions.
console.log("=== (iv) Central Kerala UDF tally ===")
const CENTRAL_5 = SWEEP_DISTRICTS // 5-district reading
const CENTRAL_7 = [...SWEEP_DISTRICTS, "pathanamthitta", "thrissur"] // 7-district reading
for (const set of [
  { name: "5-district reading (sweep districts only)", districts: CENTRAL_5 },
  {
    name: "7-district reading (+ Pathanamthitta + Thrissur)",
    districts: CENTRAL_7,
  },
]) {
  const dRows = rows.filter((r) => set.districts.includes(r.district))
  const udfWins = dRows.filter((r) => r.winner2026 === "UDF").length
  const ldfWins = dRows.filter((r) => r.winner2026 === "LDF").length
  const ndaWins = dRows.filter((r) => r.winner2026 === "NDA").length
  console.log(
    `  ${set.name}: ${dRows.length} ACs total — UDF ${udfWins}, LDF ${ldfWins}, NDA ${ndaWins}`
  )
}
console.log("  Pre-poll Manorama-C Voter prediction: UDF 33 of 53\n")

// ─── (v) Statewide breakdown by district ────────────────────────────
console.log("=== (v) Full district-by-district 2026 result ===")
const byDist: Record<
  string,
  {
    udf: number
    ldf: number
    nda: number
    udfΔ: number
    ldfΔ: number
    total: number
  }
> = {}
for (const r of rows) {
  if (!byDist[r.district])
    byDist[r.district] = { udf: 0, ldf: 0, nda: 0, udfΔ: 0, ldfΔ: 0, total: 0 }
  if (r.winner2026 === "UDF") byDist[r.district].udf++
  else if (r.winner2026 === "LDF") byDist[r.district].ldf++
  else if (r.winner2026 === "NDA") byDist[r.district].nda++
  byDist[r.district].udfΔ += r.udfDelta
  byDist[r.district].ldfΔ += r.ldfDelta
  byDist[r.district].total++
}

console.log(
  `${"District".padEnd(20)} ${"Seats".padStart(6)} ${"UDF".padStart(4)} ${"LDF".padStart(4)} ${"NDA".padStart(4)}  Mean UDF Δ   Mean LDF Δ`
)
const ordered = districtsMeta.districts as { id: string; name: string }[]
for (const d of ordered) {
  const v = byDist[d.id]
  if (!v) continue
  console.log(
    `${d.name.padEnd(20)} ${String(v.total).padStart(6)} ${String(v.udf).padStart(4)} ${String(v.ldf).padStart(4)} ${String(v.nda).padStart(4)}  ` +
      `${(v.udfΔ / v.total >= 0 ? "+" : "") + (v.udfΔ / v.total).toFixed(2).padStart(6)}pp   ` +
      `${(v.ldfΔ / v.total >= 0 ? "+" : "") + (v.ldfΔ / v.total).toFixed(2).padStart(6)}pp`
  )
}

// ─── (vi) "Kingmaker" framing: did Central Kerala flip the result? ─
console.log(
  "\n=== (vi) Central Kerala's contribution to UDF's 102-seat majority ==="
)
const total = rows.length
const udfStateTotal = rows.filter((r) => r.winner2026 === "UDF").length
const c5Rows = rows.filter((r) => CENTRAL_5.includes(r.district))
const c5UDF = c5Rows.filter((r) => r.winner2026 === "UDF").length
const c7Rows = rows.filter((r) => CENTRAL_7.includes(r.district))
const c7UDF = c7Rows.filter((r) => r.winner2026 === "UDF").length
console.log(`  Total UDF wins statewide: ${udfStateTotal} of ${total}`)
console.log(
  `  In Central-5 districts: ${c5UDF} of ${c5Rows.length}  (${((c5UDF / udfStateTotal) * 100).toFixed(1)}% of UDF's wins)`
)
console.log(
  `  In Central-7 districts: ${c7UDF} of ${c7Rows.length}  (${((c7UDF / udfStateTotal) * 100).toFixed(1)}% of UDF's wins)`
)
console.log(
  `  Majority threshold (71): UDF needs ${Math.max(0, 71 - (udfStateTotal - c5UDF))} from Central-5 to cross 71`
)
