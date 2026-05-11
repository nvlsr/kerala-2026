/**
 * A6 — Were the LDF cabinet's losses minister-targeted or just generic
 * incumbency? Statewide LDF lost ~7pp uniformly. Did ministers lose more?
 *
 * Hypothesis (per narratives.md): "13 of 21 LDF ministers defeated —
 * anti-incumbency was minister-targeted." If true, ministers should
 * show a larger LDF Δshare loss than non-minister LDF incumbents (i.e.,
 * 2021 LDF winners who weren't in the cabinet).
 *
 * The null: ministers lost at the same rate as non-minister LDF
 * incumbents. Anti-incumbency was uniform; ministers just happened to
 * be the high-visibility casualties because they were ministers.
 *
 * Data: data/ldf-ministers-2021.json (21 cabinet members,
 * Wikipedia-cross-checked).
 *
 * Run: bun run scripts/analysis/narrative-a6-cabinet-collapse.ts
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
const ministers: Minister[] = JSON.parse(
  fs.readFileSync("data/ldf-ministers-2021.json", "utf8")
).ministers

const ministerSeats = new Set(ministers.map((m) => m.constituencyNumber))

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
  isMinister: boolean
  ldf2021: number
  ldf2026: number
  ldfDelta: number
  winner2021: string | null
  winner2026: string | null
  ldfWon2021: boolean
  ldfWon2026: boolean
}

const rows: Row[] = []
for (const c of data2026) {
  const h = histByNum.get(c.constituencyNumber)
  const e21 = h?.elections.find((e) => e.year === 2021 && e.type === "general")
  if (!e21) continue
  const ldf2021 = shareIn(e21.candidates, "LDF")
  const ldf2026 = shareIn(c.candidates, "LDF")
  const w21 = winnerAlliance(e21.candidates)
  const w26 = winnerAlliance(c.candidates)
  rows.push({
    seat: c.constituencyNumber,
    name: c.constituencyName,
    isMinister: ministerSeats.has(c.constituencyNumber),
    ldf2021,
    ldf2026,
    ldfDelta: ldf2026 - ldf2021,
    winner2021: w21,
    winner2026: w26,
    ldfWon2021: w21 === "LDF",
    ldfWon2026: w26 === "LDF",
  })
}

const mean = (xs: number[]) =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length

console.log(`Loaded ${rows.length} ACs.\n`)

// ─── Confirm headline counts ──────────────────────────────────────────
const ministerRows = rows.filter((r) => r.isMinister)
const ministersLost = ministerRows.filter((r) => !r.ldfWon2026)
const ministersWon = ministerRows.filter((r) => r.ldfWon2026)

console.log(
  `Ministers (n=${ministerRows.length}): ${ministersLost.length} lost / ${ministersWon.length} won 2026`
)
console.log(`Narrative claim: 13 of 21 lost.\n`)

console.log("Ministers who LOST 2026:")
for (const r of ministersLost) {
  const m = ministers.find((mm) => mm.constituencyNumber === r.seat)!
  console.log(
    `  ${r.seat.toString().padStart(3)} ${r.name.padEnd(16)} ${m.name.padEnd(28)} (${m.portfolio.split(",")[0].trim()})  ` +
      `LDF ${r.ldf2021.toFixed(1)}% → ${r.ldf2026.toFixed(1)}%  Δ ${r.ldfDelta >= 0 ? "+" : ""}${r.ldfDelta.toFixed(1)}pp`
  )
}
console.log("\nMinisters who WON 2026:")
for (const r of ministersWon) {
  const m = ministers.find((mm) => mm.constituencyNumber === r.seat)!
  console.log(
    `  ${r.seat.toString().padStart(3)} ${r.name.padEnd(16)} ${m.name.padEnd(28)} (${m.portfolio.split(",")[0].trim()})  ` +
      `LDF ${r.ldf2021.toFixed(1)}% → ${r.ldf2026.toFixed(1)}%  Δ ${r.ldfDelta >= 0 ? "+" : ""}${r.ldfDelta.toFixed(1)}pp`
  )
}

// ─── The core test: minister Δ vs non-minister LDF incumbent Δ ───────
console.log("\n=== Core test: LDF Δshare ('21→'26) ===\n")

// 2021 LDF winners (incumbents)
const ldf2021Winners = rows.filter((r) => r.ldfWon2021)
const ministerIncumbents = ldf2021Winners.filter((r) => r.isMinister)
const nonMinisterIncumbents = ldf2021Winners.filter((r) => !r.isMinister)

console.log(`2021 LDF winners (incumbents):  n=${ldf2021Winners.length}`)
console.log(`  Of which ministers:           n=${ministerIncumbents.length}`)
console.log(`  Non-minister LDF incumbents:  n=${nonMinisterIncumbents.length}`)
console.log()

const meanMinister = mean(ministerIncumbents.map((r) => r.ldfDelta))
const meanNonMin = mean(nonMinisterIncumbents.map((r) => r.ldfDelta))
const meanAll = mean(rows.map((r) => r.ldfDelta))

console.log(
  `  Mean LDF Δ (minister incumbents):     ${meanMinister.toFixed(2)}pp`
)
console.log(
  `  Mean LDF Δ (non-minister incumbents): ${meanNonMin.toFixed(2)}pp`
)
console.log(`  Mean LDF Δ (all 140 ACs, statewide):  ${meanAll.toFixed(2)}pp`)
console.log()
console.log(
  `  Differential (minister – non-minister incumbent): ${(meanMinister - meanNonMin).toFixed(2)}pp`
)
console.log(
  `  → If negative & |large|, ministers lost MORE than non-minister LDF incumbents (narrative supported).`
)

// ─── Distribution view ────────────────────────────────────────────────
console.log("\n=== Distribution: each minister's LDF Δ ranked ===\n")
const sorted = [...ministerRows].sort((a, b) => a.ldfDelta - b.ldfDelta)
console.log("(most negative — biggest LDF loss — first)")
console.log(
  "Seat               Minister                       LDF Δ      2026 winner"
)
for (const r of sorted) {
  const m = ministers.find((mm) => mm.constituencyNumber === r.seat)!
  console.log(
    `${r.name.padEnd(18)} ${m.name.padEnd(30)} ${r.ldfDelta >= 0 ? "+" : ""}${r.ldfDelta.toFixed(1).padStart(5)}pp    ${r.winner2026}`
  )
}

// ─── Did Pinarayi himself collapse? ──────────────────────────────────
const pinarayi = ministerRows.find((r) => r.seat === 12)!
console.log(
  `\nPinarayi (Dharmadam): LDF ${pinarayi.ldf2021.toFixed(1)}% → ${pinarayi.ldf2026.toFixed(1)}%  Δ ${pinarayi.ldfDelta.toFixed(1)}pp  (won; margin shrank from 50,123 to 19,247 per narrative)`
)
