/**
 * Narrative A1 test, RE-RUN with AC-level religion data (built via
 * scripts/build-ac-demographics.py from SHRUG + Census 2011 C-01).
 * Compares against the original district-level run for delta analysis.
 *
 * The point of using AC-level data: avoid the ecological fallacy where
 * all 16 Malappuram ACs share an identical "70% Muslim" label. Now
 * each AC carries its own religion mix (114 / 140 directly aggregated
 * from sub-district + town Census data; 26 urban-heavy ACs still fall
 * back to district-level via SHRUG limitation).
 *
 * Run with `--exclude-reserved` to drop the 16 SC/ST reserved seats
 * from the analysis (they have structurally different dynamics — only
 * SC/ST candidates contest, and reserved seats correlate with high-
 * Hindu / low-minority districts which can confound the religion ×
 * vote-swing correlation).
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

const reservations = JSON.parse(
  fs.readFileSync("data/reservations.json", "utf8")
).constituencyToReservation as Record<string, "SC" | "ST">

const excludeReserved = process.argv.includes("--exclude-reserved")
// Default baseline: 2025 projection (closer to election year). Use
// `--baseline-2011` to fall back to the raw Census 2011 baseline. The
// two are empirically near-identical for correlation analysis (uniform
// multipliers preserve rank order), but 2025 is reality-aligned for
// absolute-share claims and external cross-checks.
const useBaseline2011 = process.argv.includes("--baseline-2011")
const baselineFile = useBaseline2011
  ? "data/ac-demographics.json"
  : "data/ac-demographics-2025.json"

const acDemo = JSON.parse(fs.readFileSync(baselineFile, "utf8"))
type AcRel = {
  matchedPopulation: number | null
  religions: Record<string, number>
  source: "shrug-c01-aggregated" | "district-fallback"
}
const religionByAc = acDemo.constituencies as Record<string, AcRel>

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
  hinduPct: number
  muslimPct: number
  christianPct: number
  minorityPct: number
  udfDelta: number
  ldfDelta: number
  ndaDelta: number
  source: AcRel["source"]
}

const rows: Row[] = []
let reservedSkipped = 0
for (const c of data2026) {
  if (excludeReserved && reservations[String(c.constituencyNumber)]) {
    reservedSkipped++
    continue
  }
  const ac = religionByAc[String(c.constituencyNumber)]
  if (!ac) continue
  const h = histByNum.get(c.constituencyNumber)
  const e21 = h?.elections.find((e) => e.year === 2021 && e.type === "general")
  if (!e21) continue
  rows.push({
    seat: c.constituencyNumber,
    name: c.constituencyName,
    hinduPct: ac.religions.hindu,
    muslimPct: ac.religions.muslim,
    christianPct: ac.religions.christian,
    minorityPct: ac.religions.muslim + ac.religions.christian,
    udfDelta: shareIn(c.candidates, "UDF") - shareIn(e21.candidates, "UDF"),
    ldfDelta: shareIn(c.candidates, "LDF") - shareIn(e21.candidates, "LDF"),
    ndaDelta: shareIn(c.candidates, "NDA") - shareIn(e21.candidates, "NDA"),
    source: ac.source,
  })
}

const baselineLabel = useBaseline2011
  ? "Census 2011 baseline"
  : "2025 projection (default; use --baseline-2011 for raw Census 2011)"
console.log(
  `Loaded ${rows.length}/140 ACs with AC-level religion + 2021/2026 deltas` +
    (excludeReserved
      ? ` (${reservedSkipped} reserved seats excluded)`
      : ` (use --exclude-reserved to drop the 16 SC/ST seats)`)
)
console.log(`Demographics baseline: ${baselineLabel}`)
console.log()

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

console.log("=== Correlations (Pearson r): religion shares × alliance Δ ===")
console.log("                     UDF Δ      LDF Δ      NDA Δ")
const m = rows.map((r) => r.muslimPct)
const c = rows.map((r) => r.christianPct)
const h = rows.map((r) => r.hinduPct)
const mc = rows.map((r) => r.minorityPct)
const yU = rows.map((r) => r.udfDelta)
const yL = rows.map((r) => r.ldfDelta)
const yN = rows.map((r) => r.ndaDelta)
console.log(
  `Muslim share        ${corr(m, yU).toFixed(3).padStart(7)}    ${corr(m, yL).toFixed(3).padStart(7)}    ${corr(m, yN).toFixed(3).padStart(7)}`
)
console.log(
  `Christian share     ${corr(c, yU).toFixed(3).padStart(7)}    ${corr(c, yL).toFixed(3).padStart(7)}    ${corr(c, yN).toFixed(3).padStart(7)}`
)
console.log(
  `Hindu share         ${corr(h, yU).toFixed(3).padStart(7)}    ${corr(h, yL).toFixed(3).padStart(7)}    ${corr(h, yN).toFixed(3).padStart(7)}`
)
console.log(
  `Muslim + Christian  ${corr(mc, yU).toFixed(3).padStart(7)}    ${corr(mc, yL).toFixed(3).padStart(7)}    ${corr(mc, yN).toFixed(3).padStart(7)}`
)
console.log()

console.log(
  "=== Same correlation, restricted to AC-level (excludes 26 fallbacks) ==="
)
const acOnly = rows.filter((r) => r.source === "shrug-c01-aggregated")
console.log(`n = ${acOnly.length}\n`)
const m2 = acOnly.map((r) => r.muslimPct)
const c2 = acOnly.map((r) => r.christianPct)
const h2 = acOnly.map((r) => r.hinduPct)
const mc2 = acOnly.map((r) => r.minorityPct)
const yU2 = acOnly.map((r) => r.udfDelta)
const yL2 = acOnly.map((r) => r.ldfDelta)
const yN2 = acOnly.map((r) => r.ndaDelta)
console.log(
  `Muslim share        ${corr(m2, yU2).toFixed(3).padStart(7)}    ${corr(m2, yL2).toFixed(3).padStart(7)}    ${corr(m2, yN2).toFixed(3).padStart(7)}`
)
console.log(
  `Christian share     ${corr(c2, yU2).toFixed(3).padStart(7)}    ${corr(c2, yL2).toFixed(3).padStart(7)}    ${corr(c2, yN2).toFixed(3).padStart(7)}`
)
console.log(
  `Hindu share         ${corr(h2, yU2).toFixed(3).padStart(7)}    ${corr(h2, yL2).toFixed(3).padStart(7)}    ${corr(h2, yN2).toFixed(3).padStart(7)}`
)
console.log(
  `Muslim + Christian  ${corr(mc2, yU2).toFixed(3).padStart(7)}    ${corr(mc2, yL2).toFixed(3).padStart(7)}    ${corr(mc2, yN2).toFixed(3).padStart(7)}`
)
console.log()

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

console.log("=== Bins by minority share (AC-level) ===")
binMean((r) => r.minorityPct >= 70, "Very high minority (≥70%)")
binMean((r) => r.minorityPct >= 50 && r.minorityPct < 70, "High (50–70%)")
binMean((r) => r.minorityPct >= 35 && r.minorityPct < 50, "Mid (35–50%)")
binMean((r) => r.minorityPct >= 20 && r.minorityPct < 35, "Low (20–35%)")
binMean((r) => r.minorityPct < 20, "Very low / Hindu-heavy (<20%)")
console.log()

console.log("=== Bins by CHRISTIAN share (AC-level) ===")
binMean((r) => r.christianPct >= 50, "Christian-majority (≥50%)")
binMean(
  (r) => r.christianPct >= 30 && r.christianPct < 50,
  "Christian-heavy (30–50%)"
)
binMean(
  (r) => r.christianPct >= 15 && r.christianPct < 30,
  "Christian-mid (15–30%)"
)
binMean((r) => r.christianPct < 15, "Low Christian (<15%)")
console.log()

console.log("=== Bins by MUSLIM share (AC-level) ===")
binMean((r) => r.muslimPct >= 60, "Muslim-majority (≥60%)")
binMean((r) => r.muslimPct >= 40 && r.muslimPct < 60, "Muslim-heavy (40–60%)")
binMean((r) => r.muslimPct >= 20 && r.muslimPct < 40, "Muslim-mid (20–40%)")
binMean((r) => r.muslimPct < 20, "Low Muslim (<20%)")
console.log()

console.log("=== Top 10 most-Christian ACs and their swings ===")
const topC = [...rows]
  .sort((a, b) => b.christianPct - a.christianPct)
  .slice(0, 10)
console.log(
  "seat name                     C%      H%      M%   UDF Δ    LDF Δ    NDA Δ"
)
for (const r of topC) {
  console.log(
    `${r.seat.toString().padStart(3)}  ${r.name.padEnd(22)} ${r.christianPct.toFixed(1).padStart(5)}%  ${r.hinduPct.toFixed(1).padStart(5)}%  ${r.muslimPct.toFixed(1).padStart(5)}%  ${(r.udfDelta >= 0 ? "+" : "") + r.udfDelta.toFixed(1).padStart(5)}pp  ${(r.ldfDelta >= 0 ? "+" : "") + r.ldfDelta.toFixed(1).padStart(5)}pp  ${(r.ndaDelta >= 0 ? "+" : "") + r.ndaDelta.toFixed(1).padStart(5)}pp`
  )
}
console.log()

console.log("=== Top 10 most-Muslim ACs and their swings ===")
const topM = [...rows].sort((a, b) => b.muslimPct - a.muslimPct).slice(0, 10)
console.log(
  "seat name                     M%      H%      C%   UDF Δ    LDF Δ    NDA Δ"
)
for (const r of topM) {
  console.log(
    `${r.seat.toString().padStart(3)}  ${r.name.padEnd(22)} ${r.muslimPct.toFixed(1).padStart(5)}%  ${r.hinduPct.toFixed(1).padStart(5)}%  ${r.christianPct.toFixed(1).padStart(5)}%  ${(r.udfDelta >= 0 ? "+" : "") + r.udfDelta.toFixed(1).padStart(5)}pp  ${(r.ldfDelta >= 0 ? "+" : "") + r.ldfDelta.toFixed(1).padStart(5)}pp  ${(r.ndaDelta >= 0 ? "+" : "") + r.ndaDelta.toFixed(1).padStart(5)}pp`
  )
}
