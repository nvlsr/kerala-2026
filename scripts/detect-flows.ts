/**
 * One-off analysis script: identify seats where significant alliance-level
 * vote flows happened between 2021 and 2026.
 *
 * Run: bun run scripts/detect-flows.ts
 *
 * Method (caveats below):
 *
 *   For each seat, compute alliance-level vote share (UDF/LDF/NDA/OTHER) for
 *   2021 and 2026, then take the deltas. Classify the seat as a flow if:
 *
 *   - "Two-way" — biggest gainer ≥ +5pp AND biggest loser ≤ -5pp AND the
 *     third main alliance moved < ±2pp. The simplest case: votes plausibly
 *     moved from the loser to the gainer.
 *
 *   - "Both → one" — the gainer ≥ +5pp AND BOTH other main alliances each
 *     fell by ≥ 2pp AND their combined drop roughly equals the gain. The
 *     gainer absorbed votes from both opposing alliances.
 *
 * Caveats:
 *   - We INFER flows from net share changes. Individual voter movement is
 *     not observable from results. A pattern that looks like "LDF → NDA"
 *     could actually be (a) LDF voters going to NDA, (b) a wave of new NDA
 *     voters with old LDF voters staying home, or (c) any combination.
 *   - The thresholds (5pp gain, 5pp loss, 2pp stable) are heuristics. Tune
 *     after eyeballing results.
 *   - Party→alliance is fixed at the 2026 mapping. For 2021 this is fine
 *     for major parties but may misclassify minor parties that switched
 *     fronts between cycles.
 */

import { readFileSync, readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

// ─── Types ────────────────────────────────────────────────────────────

type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER"

type Candidate2026 = {
  name: string
  party: string
  votes: number
  margin: number
  status: string
  isNota: boolean
}

type Seat2026 = {
  constituencyNumber: number
  constituencyName: string
  candidates: Candidate2026[]
}

type HistoricalCandidate = {
  name: string
  party: string
  votes: number
  votePct: number
}

type HistoricalElection = {
  year: number
  type: string
  candidates: HistoricalCandidate[]
}

type HistoricalSeat = {
  constituencyNumber: number
  constituencyName: string
  elections: HistoricalElection[]
}

type AlliancesMeta = {
  partyToAlliance: Record<string, string>
  partyAbbreviation: Record<string, string>
  partyAliases: Record<string, string>
}

// ─── Load data ────────────────────────────────────────────────────────

const alliancesMeta: AlliancesMeta = JSON.parse(
  readFileSync(join(root, "data/alliances.json"), "utf8")
)
const seats2026: Seat2026[] = JSON.parse(
  readFileSync(join(root, "data/kerala-2026.json"), "utf8")
)

const historicalDir = join(root, "data/historical")
const historicalFiles = readdirSync(historicalDir).filter(
  (f) => f.startsWith("S11-") && f.endsWith(".json")
)
const historicalByNumber = new Map<number, HistoricalSeat>()
for (const file of historicalFiles) {
  const data: HistoricalSeat = JSON.parse(
    readFileSync(join(historicalDir, file), "utf8")
  )
  historicalByNumber.set(data.constituencyNumber, data)
}

// ─── Party → alliance mapping ─────────────────────────────────────────

// Reverse the partyAbbreviation map (full→abbr) so we can resolve
// historical entries that use abbreviations like "IUML", "BJP", "CPI(M)".
const abbreviationToFull: Record<string, string> = {}
for (const [full, abbr] of Object.entries(alliancesMeta.partyAbbreviation)) {
  abbreviationToFull[abbr] = full
}

function canonicalPartyName(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return trimmed
  if (alliancesMeta.partyAbbreviation[trimmed]) return trimmed
  if (alliancesMeta.partyAliases[trimmed]) {
    return alliancesMeta.partyAliases[trimmed]
  }
  if (abbreviationToFull[trimmed]) return abbreviationToFull[trimmed]
  return trimmed
}

function partyToAlliance(rawParty: string): AllianceCode {
  const canonical = canonicalPartyName(rawParty)
  const a = alliancesMeta.partyToAlliance[canonical]
  if (a) return a as AllianceCode
  return "OTHER"
}

// ─── Compute alliance shares per cycle ────────────────────────────────

type AllianceShares = Record<AllianceCode, number>
const emptyShares = (): AllianceShares => ({ UDF: 0, LDF: 0, NDA: 0, OTHER: 0 })

function shares2026(seat: Seat2026): AllianceShares {
  const real = seat.candidates.filter((c) => !c.isNota)
  const total = real.reduce((s, c) => s + c.votes, 0)
  if (total === 0) return emptyShares()
  const out = emptyShares()
  for (const c of real) {
    out[partyToAlliance(c.party)] += (c.votes / total) * 100
  }
  return out
}

function sharesForYear(
  constituencyNumber: number,
  year: number
): AllianceShares | null {
  const hist = historicalByNumber.get(constituencyNumber)
  if (!hist) return null
  const election = hist.elections.find(
    (e) => e.year === year && e.type === "general"
  )
  if (!election) return null
  const out = emptyShares()
  for (const c of election.candidates) {
    out[partyToAlliance(c.party)] += c.votePct
  }
  return out
}

// ─── Detection ────────────────────────────────────────────────────────

const GAIN_THRESHOLD = 5 // pp
const LOSS_THRESHOLD = 5 // pp (absolute value)
const STABLE_THRESHOLD = 2 // pp (absolute value)
const BOTH_TO_ONE_LOSS_EACH = 2 // pp loss minimum per side
const FLOW_BALANCE_TOLERANCE = 3 // pp tolerance between gain and combined loss

type FlowResult =
  | {
      pattern: "two-way"
      from: AllianceCode
      to: AllianceCode
      magnitude: number
    }
  | {
      pattern: "both-to-one"
      from: [AllianceCode, AllianceCode]
      to: AllianceCode
      magnitude: number
    }

function classifyFlow(deltas: AllianceShares): FlowResult | null {
  const main = (["UDF", "LDF", "NDA"] as const).map((a) => ({
    alliance: a,
    delta: deltas[a],
  }))
  const sorted = [...main].sort((a, b) => b.delta - a.delta)
  const [gainer, middle, loser] = sorted

  if (gainer.delta < GAIN_THRESHOLD) return null

  // Two-way swap: third alliance roughly stable
  if (
    -loser.delta >= LOSS_THRESHOLD &&
    Math.abs(middle.delta) <= STABLE_THRESHOLD
  ) {
    return {
      pattern: "two-way",
      from: loser.alliance,
      to: gainer.alliance,
      magnitude: gainer.delta,
    }
  }

  // Both-to-one: gainer absorbs from both opposing alliances
  if (
    middle.delta <= -BOTH_TO_ONE_LOSS_EACH &&
    loser.delta <= -BOTH_TO_ONE_LOSS_EACH &&
    Math.abs(gainer.delta + middle.delta + loser.delta) <=
      FLOW_BALANCE_TOLERANCE
  ) {
    return {
      pattern: "both-to-one",
      from: [middle.alliance, loser.alliance],
      to: gainer.alliance,
      magnitude: gainer.delta,
    }
  }

  return null
}

// ─── Run ──────────────────────────────────────────────────────────────

type SeatFlow = {
  seat: string
  number: number
  flow: FlowResult
  shares2021: AllianceShares
  shares2026: AllianceShares
  deltas: AllianceShares
}

const flows: SeatFlow[] = []
for (const seat of seats2026) {
  const s2021 = sharesForYear(seat.constituencyNumber, 2021)
  if (!s2021) continue
  const s2026 = shares2026(seat)
  const deltas: AllianceShares = {
    UDF: s2026.UDF - s2021.UDF,
    LDF: s2026.LDF - s2021.LDF,
    NDA: s2026.NDA - s2021.NDA,
    OTHER: s2026.OTHER - s2021.OTHER,
  }
  const flow = classifyFlow(deltas)
  if (flow) {
    flows.push({
      seat: seat.constituencyName,
      number: seat.constituencyNumber,
      flow,
      shares2021: s2021,
      shares2026: s2026,
      deltas,
    })
  }
}

// Group by pattern key
function patternKey(f: FlowResult): string {
  if (f.pattern === "two-way") return `${f.from} → ${f.to}`
  return `[${f.from.join("+")}] → ${f.to}`
}

const byPattern = new Map<string, SeatFlow[]>()
for (const f of flows) {
  const key = patternKey(f.flow)
  if (!byPattern.has(key)) byPattern.set(key, [])
  byPattern.get(key)!.push(f)
}

// Print
const PAD = (s: string, n: number) => s.padEnd(n)
const DELTA = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(1).padStart(5)

console.log(
  `\n2021 → 2026 alliance-level flow detection\nThresholds: gain ≥ ${GAIN_THRESHOLD}pp, loss ≤ -${LOSS_THRESHOLD}pp, third stable < ±${STABLE_THRESHOLD}pp\n`
)

const orderedKeys = [...byPattern.keys()].sort((a, b) => {
  const ca = byPattern.get(a)!.length
  const cb = byPattern.get(b)!.length
  return cb - ca
})

for (const key of orderedKeys) {
  const seats = byPattern.get(key)!
  console.log(`\n━━━ ${key} ━━━ (${seats.length} seats)`)
  seats
    .sort((a, b) => b.flow.magnitude - a.flow.magnitude)
    .forEach((f) => {
      console.log(
        `  ${PAD(f.seat, 28)}  ` +
          `UDF ${DELTA(f.deltas.UDF)}  ` +
          `LDF ${DELTA(f.deltas.LDF)}  ` +
          `NDA ${DELTA(f.deltas.NDA)}  ` +
          `OTH ${DELTA(f.deltas.OTHER)}`
      )
    })
}

console.log(`\nTotal seats with detected flow: ${flows.length} of 140`)
console.log(
  `Seats not classified: ${140 - flows.length} (no significant single dominant flow)\n`
)

// ─── Multi-cycle drift (2011 → 2026) ──────────────────────────────────
//
// Catches sustained shifts that any single cycle would miss. Example:
// Attingal — NDA 4% → 20% → 26% → 31% over four cycles. The 2021→2026
// leg alone is sub-threshold; the 15-year drift is unambiguous.

const CUMULATIVE_GAIN = 10 // pp over 2011→2026
const CUMULATIVE_LOSS = 10 // pp absolute

type Drift = {
  seat: string
  number: number
  shares: { 2011: AllianceShares; 2016: AllianceShares | null; 2021: AllianceShares | null; 2026: AllianceShares }
  cumulative: AllianceShares
  gainer: AllianceCode
  loser: AllianceCode
  consistentCycles: number // how many cycle-by-cycle deltas agree with cumulative direction
}

const drifts: Drift[] = []
for (const seat of seats2026) {
  const s2011 = sharesForYear(seat.constituencyNumber, 2011)
  const s2016 = sharesForYear(seat.constituencyNumber, 2016)
  const s2021 = sharesForYear(seat.constituencyNumber, 2021)
  if (!s2011) continue
  const s2026 = shares2026(seat)
  const cumulative: AllianceShares = {
    UDF: s2026.UDF - s2011.UDF,
    LDF: s2026.LDF - s2011.LDF,
    NDA: s2026.NDA - s2011.NDA,
    OTHER: s2026.OTHER - s2011.OTHER,
  }
  const main = (["UDF", "LDF", "NDA"] as const).map((a) => ({
    alliance: a,
    delta: cumulative[a],
  }))
  const gainerEntry = [...main].sort((a, b) => b.delta - a.delta)[0]
  const loserEntry = [...main].sort((a, b) => a.delta - b.delta)[0]
  if (gainerEntry.delta < CUMULATIVE_GAIN) continue
  if (-loserEntry.delta < CUMULATIVE_LOSS) continue

  // Count how many cycle-by-cycle deltas for the gainer agree with the
  // overall direction (positive). 2/3 = sustained, 3/3 = monotonic.
  const gainerCycleDeltas: number[] = []
  if (s2016) gainerCycleDeltas.push(s2016[gainerEntry.alliance] - s2011[gainerEntry.alliance])
  if (s2016 && s2021) gainerCycleDeltas.push(s2021[gainerEntry.alliance] - s2016[gainerEntry.alliance])
  if (s2021) gainerCycleDeltas.push(s2026[gainerEntry.alliance] - s2021[gainerEntry.alliance])
  const consistent = gainerCycleDeltas.filter((d) => d > 0).length

  if (consistent < 2) continue // require at least 2 of 3 cycles in same direction

  drifts.push({
    seat: seat.constituencyName,
    number: seat.constituencyNumber,
    shares: { 2011: s2011, 2016: s2016, 2021: s2021, 2026: s2026 },
    cumulative,
    gainer: gainerEntry.alliance,
    loser: loserEntry.alliance,
    consistentCycles: consistent,
  })
}

console.log(
  `\n\n2011 → 2026 multi-cycle drift\nThresholds: cumulative gain ≥ ${CUMULATIVE_GAIN}pp, cumulative loss ≤ -${CUMULATIVE_LOSS}pp, gainer's direction consistent ≥ 2/3 cycles\n`
)

const driftByPattern = new Map<string, Drift[]>()
for (const d of drifts) {
  const key = `${d.loser} → ${d.gainer}`
  if (!driftByPattern.has(key)) driftByPattern.set(key, [])
  driftByPattern.get(key)!.push(d)
}

const driftKeys = [...driftByPattern.keys()].sort(
  (a, b) => driftByPattern.get(b)!.length - driftByPattern.get(a)!.length
)

for (const key of driftKeys) {
  const seats = driftByPattern.get(key)!
  console.log(`\n━━━ ${key} ━━━ (${seats.length} seats, sustained over 4 cycles)`)
  seats
    .sort(
      (a, b) =>
        b.cumulative[b.gainer] -
        b.cumulative[b.loser] -
        (a.cumulative[a.gainer] - a.cumulative[a.loser])
    )
    .forEach((d) => {
      console.log(
        `  ${PAD(d.seat, 22)}  cum: UDF ${DELTA(d.cumulative.UDF)}  LDF ${DELTA(d.cumulative.LDF)}  NDA ${DELTA(d.cumulative.NDA)}  ` +
          `[${d.consistentCycles}/3 same direction]`
      )
    })
}

console.log(`\nTotal seats with sustained drift: ${drifts.length} of 140\n`)
