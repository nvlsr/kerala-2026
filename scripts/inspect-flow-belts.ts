/**
 * One-off inspection script: cross-tab of single-cycle flow patterns
 * (2021 → 2026) against the community belt taxonomy.
 *
 * Standalone — re-reads JSON directly and reproduces the single-cycle
 * classification, so it works under Bun without Vite's
 * import.meta.glob plumbing.
 *
 * Run: bun run scripts/inspect-flow-belts.ts
 *
 * Purpose: decide which /flows patterns earn a belt-framing block
 * before writing any UI changes. Cross-tab strong → patterns get a
 * framing. Cross-tab diffuse → patterns get a one-liner instead.
 */

import { readFileSync, readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER" | "NOTA"
type Shares = Record<AllianceCode, number>

// ─── Load data ────────────────────────────────────────────────────────

type Candidate2026 = {
  alliance: AllianceCode
  votes: number
  isNota: boolean
}
type Seat2026 = {
  constituencyNumber: number
  constituencyName: string
  candidates: Candidate2026[]
}
const seats2026: Seat2026[] = JSON.parse(
  readFileSync(join(root, "data/kerala-2026.json"), "utf8")
)

type HistoricalCandidate = { alliance: AllianceCode; votePct: number }
type HistoricalElection = {
  year: number
  type: string
  candidates: HistoricalCandidate[]
}
type HistoricalSeat = {
  constituencyNumber: number
  elections: HistoricalElection[]
}
const historicalDir = join(root, "data/historical")
const histByNum = new Map<number, HistoricalSeat>()
for (const f of readdirSync(historicalDir).filter(
  (x) => x.startsWith("S11-") && x.endsWith(".json")
)) {
  const data: HistoricalSeat = JSON.parse(
    readFileSync(join(historicalDir, f), "utf8")
  )
  histByNum.set(data.constituencyNumber, data)
}

type BeltDef = { id: string; label: string; description: string; color: string }
const beltsJson = JSON.parse(
  readFileSync(join(root, "data/community-belts.json"), "utf8")
) as {
  belts: BeltDef[]
  districtToBelt: Record<string, string>
}
const beltById = new Map(beltsJson.belts.map((b) => [b.id, b]))

const districtsJson = JSON.parse(
  readFileSync(join(root, "data/districts.json"), "utf8")
) as { constituencyToDistrict: Record<string, string> }
const constToDistrict = districtsJson.constituencyToDistrict

function beltFor(num: number): BeltDef | null {
  const districtId = constToDistrict[String(num)]
  if (!districtId) return null
  const beltId = beltsJson.districtToBelt[districtId]
  return beltId ? beltById.get(beltId) ?? null : null
}

// ─── Share computation (matches v5-aligned src/lib/data/flows.ts) ────

const empty = (): Shares => ({ UDF: 0, LDF: 0, NDA: 0, OTHER: 0, NOTA: 0 })

function shares2026(seat: Seat2026): Shares {
  const total = seat.candidates.reduce((s, c) => s + c.votes, 0)
  if (total === 0) return empty()
  const out = empty()
  for (const c of seat.candidates) {
    if (c.isNota) continue
    out[c.alliance] += (c.votes / total) * 100
  }
  return out
}

function sharesForYear(num: number, year: number): Shares | null {
  const h = histByNum.get(num)
  if (!h) return null
  const e = h.elections.find((x) => x.year === year && x.type === "general")
  if (!e) return null
  const out = empty()
  for (const c of e.candidates) out[c.alliance] += c.votePct
  return out
}

// ─── Single-cycle classification (matches src/lib/data/flows.ts) ─────

const GAIN = 5
const LOSS = 5
const STABLE = 2
const BOTH_LOSS = 2
const BALANCE = 3
const MAIN: AllianceCode[] = ["UDF", "LDF", "NDA"]

type Flow =
  | { kind: "two-way"; from: AllianceCode; to: AllianceCode }
  | { kind: "both-to-one"; from: [AllianceCode, AllianceCode]; to: AllianceCode }

function classify(deltas: Shares): Flow | null {
  const sorted = MAIN.map((a) => ({ a, d: deltas[a] })).sort(
    (x, y) => y.d - x.d
  )
  const [g, m, l] = sorted
  if (g.d < GAIN) return null
  if (-l.d >= LOSS && Math.abs(m.d) <= STABLE) {
    return { kind: "two-way", from: l.a, to: g.a }
  }
  if (
    m.d <= -BOTH_LOSS &&
    l.d <= -BOTH_LOSS &&
    Math.abs(g.d + m.d + l.d) <= BALANCE
  ) {
    return { kind: "both-to-one", from: [m.a, l.a], to: g.a }
  }
  return null
}

function patternKey(f: Flow): string {
  if (f.kind === "two-way") return `${f.from}_to_${f.to}`
  return `${[...f.from].sort().join("+")}_to_${f.to}`
}
function patternLabel(f: Flow): string {
  if (f.kind === "two-way") return `${f.from} → ${f.to}`
  return `${[...f.from].sort().join(" + ")} → ${f.to}`
}

// ─── Run classification ──────────────────────────────────────────────

type FlowSeat = { seat: Seat2026; flow: Flow; deltas: Shares }
const flows: FlowSeat[] = []
for (const s of seats2026) {
  const s2021 = sharesForYear(s.constituencyNumber, 2021)
  if (!s2021) continue
  const s2026 = shares2026(s)
  const deltas: Shares = {
    UDF: s2026.UDF - s2021.UDF,
    LDF: s2026.LDF - s2021.LDF,
    NDA: s2026.NDA - s2021.NDA,
    OTHER: s2026.OTHER - s2021.OTHER,
    NOTA: s2026.NOTA - s2021.NOTA,
  }
  const f = classify(deltas)
  if (f) flows.push({ seat: s, flow: f, deltas })
}

// ─── Group + cross-tab ───────────────────────────────────────────────

const groups = new Map<string, { key: string; label: string; items: FlowSeat[] }>()
for (const f of flows) {
  const k = patternKey(f.flow)
  if (!groups.has(k)) {
    groups.set(k, { key: k, label: patternLabel(f.flow), items: [] })
  }
  groups.get(k)!.items.push(f)
}
const sortedGroups = [...groups.values()].sort(
  (a, b) => b.items.length - a.items.length
)

// ─── Print ──────────────────────────────────────────────────────────

console.log("\nSingle-cycle (2021 → 2026) flow × community belt cross-tab")
console.log(`Classified ${flows.length} of ${seats2026.length} seats\n`)

for (const g of sortedGroups) {
  console.log(`━━━ ${g.label} ━━━ (${g.items.length} seats)`)
  const byBelt = new Map<
    string,
    { label: string; count: number; seats: string[] }
  >()
  for (const it of g.items) {
    const b = beltFor(it.seat.constituencyNumber)
    if (!b) continue
    if (!byBelt.has(b.id)) {
      byBelt.set(b.id, { label: b.label, count: 0, seats: [] })
    }
    const entry = byBelt.get(b.id)!
    entry.count++
    entry.seats.push(it.seat.constituencyName)
  }
  const sorted = [...byBelt.entries()].sort(
    (a, b) => b[1].count - a[1].count
  )
  for (const [, data] of sorted) {
    console.log(
      `  ${data.label.padEnd(45)} ${data.count.toString().padStart(3)}  (${data.seats.join(", ")})`
    )
  }
  const absent = beltsJson.belts
    .filter((b) => !byBelt.has(b.id))
    .map((b) => b.label)
  if (absent.length > 0 && absent.length <= 5) {
    console.log(`  Absent from: ${absent.join(", ")}`)
  } else if (absent.length > 0) {
    console.log(`  Absent from: ${absent.length} belts`)
  }
  console.log()
}
