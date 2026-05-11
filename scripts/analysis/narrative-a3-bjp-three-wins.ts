/**
 * A3 — BJP's 3 wins came from concentrated Hindu pockets, not statewide
 * consolidation. Tests four sub-claims from the narrative:
 *
 *   (i)   BJP statewide vote share was nearly flat ('21 ≈ '26)
 *   (ii)  NDA crossed 20% in ~29 of 140 ACs — concentration thesis
 *   (iii) The 3 BJP wins (Nemom, Chathannoor, Kazhakoottam) sit in
 *         high-Hindu-share Trivandrum/Kollam-area seats
 *   (iv)  All 3 BJP winners are Hindu candidates; every named
 *         Christian BJP candidate (Shone George/Pala, George
 *         Kurian/Kanjirappally, P.C. George/Poonjar, Anoop
 *         Antony/Thiruvalla) lost
 *
 * Run: bun run scripts/analysis/narrative-a3-bjp-three-wins.ts
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
  fs.readFileSync("data/kerala-2026.json", "utf8")
)
const hist: Hist[] = fs
  .readdirSync("data/historical")
  .filter((f) => f.startsWith("S11-"))
  .map((f) =>
    JSON.parse(fs.readFileSync(path.join("data/historical", f), "utf8"))
  )
const histByNum = new Map(hist.map((h) => [h.constituencyNumber, h]))
const acDemo = JSON.parse(
  fs.readFileSync("data/ac-demographics-2025.json", "utf8")
)

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

function shareOfParty(cands: Cand[], partyExact: string): number {
  let v = 0,
    t = 0
  for (const c of cands) {
    if (c.isNota) continue
    t += c.votes
    if (c.party === partyExact) v += c.votes
  }
  return t > 0 ? (v / t) * 100 : 0
}

type Row = {
  seat: number
  name: string
  hindu: number
  ndaShare2026: number
  bjpShare2026: number
  ndaDelta: number
  bjpDelta: number
  udfDelta: number
  ldfDelta: number
  ndaWon: boolean
}

const rows: Row[] = []
let totalVotes2021 = 0
let totalVotes2026 = 0
let totalNDA2021 = 0
let totalNDA2026 = 0
let totalBJP2021 = 0
let totalBJP2026 = 0

for (const c of data2026) {
  const ac = acDemo.constituencies[String(c.constituencyNumber)]
  if (!ac) continue
  const h = histByNum.get(c.constituencyNumber)
  const e21 = h?.elections.find((e) => e.year === 2021 && e.type === "general")
  if (!e21) continue

  // Tally vote-totals for statewide aggregation
  for (const cd of e21.candidates) {
    if (cd.isNota) continue
    totalVotes2021 += cd.votes
    if (cd.alliance === "NDA") totalNDA2021 += cd.votes
    if (cd.party === "Bharatiya Janata Party") totalBJP2021 += cd.votes
  }
  for (const cd of c.candidates) {
    if (cd.isNota) continue
    totalVotes2026 += cd.votes
    if (cd.alliance === "NDA") totalNDA2026 += cd.votes
    if (cd.party === "Bharatiya Janata Party") totalBJP2026 += cd.votes
  }

  const winner26 = c.candidates
    .filter((x) => !x.isNota)
    .reduce<Cand | null>(
      (best, x) => (best == null || x.votes > best.votes ? x : best),
      null
    )

  rows.push({
    seat: c.constituencyNumber,
    name: c.constituencyName,
    hindu: ac.religions.hindu,
    ndaShare2026: shareIn(c.candidates, "NDA"),
    bjpShare2026: shareOfParty(c.candidates, "Bharatiya Janata Party"),
    ndaDelta: shareIn(c.candidates, "NDA") - shareIn(e21.candidates, "NDA"),
    bjpDelta:
      shareOfParty(c.candidates, "Bharatiya Janata Party") -
      shareOfParty(e21.candidates, "Bharatiya Janata Party"),
    udfDelta: shareIn(c.candidates, "UDF") - shareIn(e21.candidates, "UDF"),
    ldfDelta: shareIn(c.candidates, "LDF") - shareIn(e21.candidates, "LDF"),
    ndaWon: winner26?.alliance === "NDA",
  })
}

console.log(`Loaded ${rows.length} ACs.\n`)

// ─── (i) Statewide BJP vote share ────────────────────────────────────
const bjp21 = (totalBJP2021 / totalVotes2021) * 100
const bjp26 = (totalBJP2026 / totalVotes2026) * 100
const nda21 = (totalNDA2021 / totalVotes2021) * 100
const nda26 = (totalNDA2026 / totalVotes2026) * 100

console.log("=== (i) Statewide BJP/NDA vote share ===")
console.log(
  `  BJP party share: ${bjp21.toFixed(2)}% → ${bjp26.toFixed(2)}%  Δ ${bjp26 - bjp21 >= 0 ? "+" : ""}${(bjp26 - bjp21).toFixed(2)}pp`
)
console.log(
  `  NDA alliance:    ${nda21.toFixed(2)}% → ${nda26.toFixed(2)}%  Δ ${nda26 - nda21 >= 0 ? "+" : ""}${(nda26 - nda21).toFixed(2)}pp`
)
console.log(`  Narrative claim: BJP grew ~0.12pp (11.30 → 11.42)`)
console.log()

// ─── (ii) Concentration: NDA ≥ 20% in how many ACs? ──────────────────
const ndaAt20 = rows.filter((r) => r.ndaShare2026 >= 20).length
const ndaAt25 = rows.filter((r) => r.ndaShare2026 >= 25).length
const ndaAt30 = rows.filter((r) => r.ndaShare2026 >= 30).length
const ndaAt40 = rows.filter((r) => r.ndaShare2026 >= 40).length

console.log("=== (ii) NDA share concentration in 2026 ===")
console.log(`  NDA ≥ 20%   : ${ndaAt20} of 140 ACs  (narrative claim: 29)`)
console.log(`  NDA ≥ 25%   : ${ndaAt25}`)
console.log(`  NDA ≥ 30%   : ${ndaAt30}`)
console.log(`  NDA ≥ 40%   : ${ndaAt40}`)

// What % of total NDA votes are in the top-N ACs? (Lorenz-style concentration)
const ndaShares = rows.map((r) => r.ndaShare2026).sort((a, b) => b - a)
const topN = (n: number) =>
  ndaShares.slice(0, n).reduce((a, b) => a + b, 0) /
  ndaShares.reduce((a, b) => a + b, 0)
console.log(
  `  Top 10 ACs hold ${(topN(10) * 100).toFixed(1)}% of NDA aggregate share`
)
console.log(
  `  Top 20 ACs hold ${(topN(20) * 100).toFixed(1)}% of NDA aggregate share`
)
console.log(
  `  Top 30 ACs hold ${(topN(30) * 100).toFixed(1)}% of NDA aggregate share`
)

// Where are the high-NDA ACs concentrated geographically?
const districtOf: Record<number, string> = JSON.parse(
  fs.readFileSync("data/districts.json", "utf8")
).constituencyToDistrict
const districtCounts: Record<string, number> = {}
for (const r of rows.filter((r) => r.ndaShare2026 >= 25)) {
  const d = districtOf[r.seat] ?? "?"
  districtCounts[d] = (districtCounts[d] ?? 0) + 1
}
console.log(`\n  NDA ≥ 25% ACs by district:`)
for (const [d, n] of Object.entries(districtCounts).sort(
  (a, b) => b[1] - a[1]
)) {
  console.log(`    ${d.padEnd(20)} ${n}`)
}
console.log()

// ─── (iii) The 3 BJP wins — religion mix ─────────────────────────────
const BJP_WINS = [126, 132, 135] // Chathannoor, Kazhakoottam, Nemom
console.log("=== (iii) The 3 BJP wins — religion mix + swing ===")
for (const seat of BJP_WINS) {
  const r = rows.find((x) => x.seat === seat)!
  console.log(
    `  ${r.seat} ${r.name.padEnd(14)}  H ${r.hindu.toFixed(1)}%   ` +
      `NDA ${r.ndaShare2026.toFixed(1)}% (Δ ${r.ndaDelta >= 0 ? "+" : ""}${r.ndaDelta.toFixed(1)}pp)   ` +
      `UDF Δ ${r.udfDelta >= 0 ? "+" : ""}${r.udfDelta.toFixed(1)}pp   ` +
      `LDF Δ ${r.ldfDelta >= 0 ? "+" : ""}${r.ldfDelta.toFixed(1)}pp`
  )
}
const winsHinduMean =
  rows
    .filter((r) => BJP_WINS.includes(r.seat))
    .reduce((a, b) => a + b.hindu, 0) / 3
const allHinduMean = rows.reduce((a, b) => a + b.hindu, 0) / rows.length
console.log(
  `\n  Mean Hindu share: BJP wins ${winsHinduMean.toFixed(1)}%  vs statewide ${allHinduMean.toFixed(1)}%`
)
console.log()

// ─── (iv) Christian BJP candidates: did they all lose? ──────────────
const CHRISTIAN_BJP_NAMES = [
  { ac: 93, candidate: "SHONE GEORGE", seat: "Pala" },
  { ac: 100, candidate: "ADV. GEORGE KURIAN", seat: "Kanjirappally" },
  { ac: 101, candidate: "P.C. GEORGE", seat: "Poonjar" },
  { ac: 111, candidate: "ANOOP ANTONY", seat: "Thiruvalla" },
]

console.log("=== (iv) Christian BJP candidates ===")
for (const cn of CHRISTIAN_BJP_NAMES) {
  const c = data2026.find((x) => x.constituencyNumber === cn.ac)!
  const cand = c.candidates.find((x) => x.name === cn.candidate)!
  const won = cand.status === "won"
  const r = rows.find((x) => x.seat === cn.ac)!
  console.log(
    `  ${cn.ac} ${cn.seat.padEnd(14)}  ${cand.name.padEnd(20)}  ` +
      `H ${r.hindu.toFixed(1)}%  C ${(100 - r.hindu - acDemo.constituencies[String(cn.ac)].religions.muslim).toFixed(1)}%  ` +
      `BJP share ${r.bjpShare2026.toFixed(1)}%  ${won ? "✓ WON" : "✗ lost"}  ` +
      `(BJP Δ ${r.bjpDelta >= 0 ? "+" : ""}${r.bjpDelta.toFixed(1)}pp)`
  )
}
console.log()

// ─── (v) The "weak UDF" sub-claim in the 3 BJP-won seats ────────────
console.log("=== (v) UDF performance in the 3 BJP-won seats ===")
const ndaWinUDFΔ =
  rows
    .filter((r) => BJP_WINS.includes(r.seat))
    .reduce((a, b) => a + b.udfDelta, 0) / 3
const allUDFΔ = rows.reduce((a, b) => a + b.udfDelta, 0) / rows.length
const hindu60UDFΔ = (() => {
  const h = rows.filter((r) => r.hindu >= 60 && !BJP_WINS.includes(r.seat))
  return h.reduce((a, b) => a + b.udfDelta, 0) / h.length
})()
console.log(
  `  Mean UDF Δ in BJP-won seats: ${ndaWinUDFΔ >= 0 ? "+" : ""}${ndaWinUDFΔ.toFixed(2)}pp`
)
console.log(
  `  Mean UDF Δ statewide:        ${allUDFΔ >= 0 ? "+" : ""}${allUDFΔ.toFixed(2)}pp`
)
console.log(
  `  Mean UDF Δ in Hindu ≥ 60% (excluding BJP-won): ${hindu60UDFΔ >= 0 ? "+" : ""}${hindu60UDFΔ.toFixed(2)}pp`
)
console.log()

// ─── (vi) BJP party share Δ — where did BJP grow most? ──────────────
console.log("=== (vi) Top 12 ACs by BJP party share Δ ('21 → '26) ===")
const sorted = [...rows].sort((a, b) => b.bjpDelta - a.bjpDelta).slice(0, 12)
for (const r of sorted) {
  const d = districtOf[r.seat] ?? "?"
  console.log(
    `  ${r.seat.toString().padStart(3)} ${r.name.padEnd(18)} ${d.padEnd(18)}  ` +
      `H ${r.hindu.toFixed(0).padStart(2)}%   ` +
      `BJP ${r.bjpShare2026.toFixed(1).padStart(5)}%  Δ ${r.bjpDelta >= 0 ? "+" : ""}${r.bjpDelta.toFixed(1)}pp`
  )
}
