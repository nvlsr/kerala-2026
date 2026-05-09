/**
 * Side-by-side A1 correlation: how much does our religion baseline
 * (2011 census vs 2025 projection) actually move the verdict?
 *
 * Hypothesis: correlations should be very similar because the
 * projection applies a uniform per-religion multiplier statewide.
 * Pearson correlation is invariant to monotonic transformations of a
 * single variable, BUT our renormalization step (rescale to sum=100
 * per AC) is not strictly linear — it depends on the other religions'
 * values. So the correlations could shift, just probably not much.
 *
 * Run: bun run scripts/narrative-a1-2011-vs-2025.ts
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

const acDemo2011 = JSON.parse(
  fs.readFileSync("data/ac-demographics.json", "utf8")
)
const acDemo2025 = JSON.parse(
  fs.readFileSync("data/ac-demographics-2025.json", "utf8")
)
const reservations = JSON.parse(
  fs.readFileSync("data/reservations.json", "utf8")
).constituencyToReservation as Record<string, "SC" | "ST">

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

type AcRow = {
  seat: number
  hindu11: number
  muslim11: number
  christian11: number
  hindu25: number
  muslim25: number
  christian25: number
  reserved: boolean
  udfDelta: number
  ldfDelta: number
  ndaDelta: number
}

const rows: AcRow[] = []
for (const c of data2026) {
  const ac11 = acDemo2011.constituencies[String(c.constituencyNumber)]
  const ac25 = acDemo2025.constituencies[String(c.constituencyNumber)]
  if (!ac11 || !ac25) continue
  const h = histByNum.get(c.constituencyNumber)
  const e21 = h?.elections.find((e) => e.year === 2021 && e.type === "general")
  if (!e21) continue
  rows.push({
    seat: c.constituencyNumber,
    hindu11: ac11.religions.hindu,
    muslim11: ac11.religions.muslim,
    christian11: ac11.religions.christian,
    hindu25: ac25.religions.hindu,
    muslim25: ac25.religions.muslim,
    christian25: ac25.religions.christian,
    reserved: !!reservations[String(c.constituencyNumber)],
    udfDelta: shareIn(c.candidates, "UDF") - shareIn(e21.candidates, "UDF"),
    ldfDelta: shareIn(c.candidates, "LDF") - shareIn(e21.candidates, "LDF"),
    ndaDelta: shareIn(c.candidates, "NDA") - shareIn(e21.candidates, "NDA"),
  })
}

console.log(`Loaded ${rows.length} ACs\n`)

function showCorrs(rows: AcRow[], label: string) {
  const xH11 = rows.map((r) => r.hindu11)
  const xM11 = rows.map((r) => r.muslim11)
  const xC11 = rows.map((r) => r.christian11)
  const xH25 = rows.map((r) => r.hindu25)
  const xM25 = rows.map((r) => r.muslim25)
  const xC25 = rows.map((r) => r.christian25)
  const yU = rows.map((r) => r.udfDelta)
  const yL = rows.map((r) => r.ldfDelta)
  const yN = rows.map((r) => r.ndaDelta)

  console.log(`=== ${label} (n=${rows.length}) ===`)
  console.log("                          UDF Δ           LDF Δ           NDA Δ")
  console.log(
    "                       2011    2025    2011    2025    2011    2025"
  )
  const fmt = (x: number) => (x >= 0 ? "+" : "") + x.toFixed(3)
  console.log(
    `Hindu share         ${fmt(corr(xH11, yU)).padStart(8)}${fmt(corr(xH25, yU)).padStart(8)}${fmt(corr(xH11, yL)).padStart(8)}${fmt(corr(xH25, yL)).padStart(8)}${fmt(corr(xH11, yN)).padStart(8)}${fmt(corr(xH25, yN)).padStart(8)}`
  )
  console.log(
    `Muslim share        ${fmt(corr(xM11, yU)).padStart(8)}${fmt(corr(xM25, yU)).padStart(8)}${fmt(corr(xM11, yL)).padStart(8)}${fmt(corr(xM25, yL)).padStart(8)}${fmt(corr(xM11, yN)).padStart(8)}${fmt(corr(xM25, yN)).padStart(8)}`
  )
  console.log(
    `Christian share     ${fmt(corr(xC11, yU)).padStart(8)}${fmt(corr(xC25, yU)).padStart(8)}${fmt(corr(xC11, yL)).padStart(8)}${fmt(corr(xC25, yL)).padStart(8)}${fmt(corr(xC11, yN)).padStart(8)}${fmt(corr(xC25, yN)).padStart(8)}`
  )
  console.log()
}

showCorrs(rows, "All 140 ACs")
showCorrs(
  rows.filter((r) => !r.reserved),
  "Excluding 16 SC/ST reserved"
)

// Show a few specific ACs where projection shifts the most
console.log("=== Largest absolute share shifts (2011 → 2025) ===")
const shifts = rows.map((r) => ({
  seat: r.seat,
  muslimShift: r.muslim25 - r.muslim11,
  hinduShift: r.hindu25 - r.hindu11,
  christianShift: r.christian25 - r.christian11,
}))
shifts.sort((a, b) => Math.abs(b.muslimShift) - Math.abs(a.muslimShift))
console.log("Top 8 by |Muslim shift|:")
for (const s of shifts.slice(0, 8)) {
  const c = data2026.find((x) => x.constituencyNumber === s.seat)!
  console.log(
    `  ${s.seat.toString().padStart(3)} ${c.constituencyName.padEnd(20)}  ΔH ${(s.hinduShift >= 0 ? "+" : "") + s.hinduShift.toFixed(2)}pp   ΔM ${(s.muslimShift >= 0 ? "+" : "") + s.muslimShift.toFixed(2)}pp   ΔC ${(s.christianShift >= 0 ? "+" : "") + s.christianShift.toFixed(2)}pp`
  )
}
