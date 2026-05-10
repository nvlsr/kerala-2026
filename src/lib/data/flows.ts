/**
 * Alliance-level vote flow detection across 2011 → 2026.
 *
 * Two passes:
 *
 * 1. Single-cycle (2021 → 2026): a seat is classified when one alliance gained
 *    ≥ 5pp at the expense of either one (third stable) or both other main
 *    alliances (with combined drop matching the gain). See
 *    `classifySingleCycleFlow`.
 *
 * 2. Multi-cycle drift (2011 → 2026): cumulative gainer ≥ +10pp and loser
 *    ≤ −10pp, with at least 2 of the 3 cycle transitions for the gainer
 *    moving in the same direction as the cumulative drift (filters out
 *    single-cycle anomalies). See `classifyMultiCycleDrift`.
 *
 * Critical caveat — these are *inferred* flows from net share changes.
 * Individual voter movement isn't observable from results data; we
 * surface seats whose alliance-level deltas suggest a flow.
 *
 * Logic ported from `scripts/detect-flows.ts`. The script is the working
 * tool for ad-hoc analysis and threshold tuning; this module is the runtime
 * version that the `/flows` page reads from.
 */

import {
  constituencies,
  totalVotesIn,
  type Constituency,
} from "@/lib/data/constituencies"
import {
  getHistoricalFor,
  type HistoricalElection,
} from "@/lib/data/historical"

import type { AllianceCode } from "@/lib/data/alliances"

// ─── Types ──────────────────────────────────────────────────────────────

export type AllianceShares = Record<AllianceCode, number>

export type SingleCycleFlow =
  | {
      kind: "two-way"
      from: AllianceCode
      to: AllianceCode
      magnitude: number
    }
  | {
      kind: "both-to-one"
      from: [AllianceCode, AllianceCode]
      to: AllianceCode
      magnitude: number
    }

export type SeatFlow = {
  constituency: Constituency
  flow: SingleCycleFlow
  shares2021: AllianceShares
  shares2026: AllianceShares
  deltas: AllianceShares
}

export type MultiCycleDrift = {
  constituency: Constituency
  /** Shares for each cycle that has data; null if a cycle is missing. */
  shares: {
    2011: AllianceShares | null
    2016: AllianceShares | null
    2021: AllianceShares | null
    2026: AllianceShares
  }
  cumulative: AllianceShares
  gainer: AllianceCode
  loser: AllianceCode
  /** How many of the 3 cycle transitions for the gainer agree with the
   *  overall drift direction. 2 = sustained, 3 = monotonic. */
  consistentCycles: number
}

// ─── Thresholds ─────────────────────────────────────────────────────────

const SINGLE_GAIN = 5 // pp
const SINGLE_LOSS = 5 // pp absolute
const SINGLE_THIRD_STABLE = 2 // pp absolute
const SINGLE_BOTH_LOSS_EACH = 2 // pp loss minimum per side
const SINGLE_FLOW_BALANCE = 3 // pp tolerance gain vs combined loss

const MULTI_GAIN = 10 // pp cumulative
const MULTI_LOSS = 10 // pp absolute cumulative
const MULTI_MIN_CONSISTENT_CYCLES = 2 // of 3 transitions

// ─── Share computation ─────────────────────────────────────────────────

function emptyShares(): AllianceShares {
  return { UDF: 0, LDF: 0, NDA: 0, OTHER: 0, NOTA: 0 }
}

function shares2026(c: Constituency): AllianceShares {
  const real = c.candidates.filter((cand) => !cand.isNota)
  const total = totalVotesIn(c)
  if (total === 0) return emptyShares()
  const out = emptyShares()
  for (const cand of real) {
    out[cand.alliance] += (cand.votes / total) * 100
  }
  return out
}

function sharesForElection(election: HistoricalElection): AllianceShares {
  const out = emptyShares()
  for (const cand of election.candidates) {
    out[cand.alliance] += cand.votePct
  }
  return out
}

function sharesForYear(
  constituencyNumber: number,
  year: number
): AllianceShares | null {
  const hist = getHistoricalFor(constituencyNumber)
  if (!hist) return null
  const election = hist.elections.find(
    (e) => e.year === year && e.type === "general"
  )
  return election ? sharesForElection(election) : null
}

// ─── Classification ─────────────────────────────────────────────────────

const MAIN: AllianceCode[] = ["UDF", "LDF", "NDA"]

function classifySingleCycleFlow(
  deltas: AllianceShares
): SingleCycleFlow | null {
  const sorted = MAIN.map((a) => ({ alliance: a, delta: deltas[a] })).sort(
    (a, b) => b.delta - a.delta
  )
  const [gainer, middle, loser] = sorted

  if (gainer.delta < SINGLE_GAIN) return null

  // Two-way flow: third alliance roughly stable
  if (
    -loser.delta >= SINGLE_LOSS &&
    Math.abs(middle.delta) <= SINGLE_THIRD_STABLE
  ) {
    return {
      kind: "two-way",
      from: loser.alliance,
      to: gainer.alliance,
      magnitude: gainer.delta,
    }
  }

  // Both-to-one flow: gainer absorbs from both opposing alliances
  if (
    middle.delta <= -SINGLE_BOTH_LOSS_EACH &&
    loser.delta <= -SINGLE_BOTH_LOSS_EACH &&
    Math.abs(gainer.delta + middle.delta + loser.delta) <= SINGLE_FLOW_BALANCE
  ) {
    return {
      kind: "both-to-one",
      from: [middle.alliance, loser.alliance],
      to: gainer.alliance,
      magnitude: gainer.delta,
    }
  }

  return null
}

// ─── Public memoised getters ────────────────────────────────────────────

let cachedSingle: SeatFlow[] | null = null
let cachedDrift: MultiCycleDrift[] | null = null

export function getSingleCycleFlows(): SeatFlow[] {
  if (cachedSingle) return cachedSingle
  const out: SeatFlow[] = []
  for (const c of constituencies) {
    const s2021 = sharesForYear(c.constituencyNumber, 2021)
    if (!s2021) continue
    const s2026 = shares2026(c)
    const deltas: AllianceShares = {
      UDF: s2026.UDF - s2021.UDF,
      LDF: s2026.LDF - s2021.LDF,
      NDA: s2026.NDA - s2021.NDA,
      OTHER: s2026.OTHER - s2021.OTHER,
      NOTA: s2026.NOTA - s2021.NOTA,
    }
    const flow = classifySingleCycleFlow(deltas)
    if (flow) {
      out.push({
        constituency: c,
        flow,
        shares2021: s2021,
        shares2026: s2026,
        deltas,
      })
    }
  }
  cachedSingle = out
  return out
}

export function getMultiCycleDrifts(): MultiCycleDrift[] {
  if (cachedDrift) return cachedDrift
  const out: MultiCycleDrift[] = []
  for (const c of constituencies) {
    const s2011 = sharesForYear(c.constituencyNumber, 2011)
    if (!s2011) continue
    const s2016 = sharesForYear(c.constituencyNumber, 2016)
    const s2021 = sharesForYear(c.constituencyNumber, 2021)
    const s2026 = shares2026(c)
    const cumulative: AllianceShares = {
      UDF: s2026.UDF - s2011.UDF,
      LDF: s2026.LDF - s2011.LDF,
      NDA: s2026.NDA - s2011.NDA,
      OTHER: s2026.OTHER - s2011.OTHER,
      NOTA: s2026.NOTA - s2011.NOTA,
    }
    const main = MAIN.map((a) => ({ alliance: a, delta: cumulative[a] }))
    const gainer = [...main].sort((a, b) => b.delta - a.delta)[0]
    const loser = [...main].sort((a, b) => a.delta - b.delta)[0]
    if (gainer.delta < MULTI_GAIN) continue
    if (-loser.delta < MULTI_LOSS) continue

    const transitions: number[] = []
    if (s2016) transitions.push(s2016[gainer.alliance] - s2011[gainer.alliance])
    if (s2016 && s2021)
      transitions.push(s2021[gainer.alliance] - s2016[gainer.alliance])
    if (s2021) transitions.push(s2026[gainer.alliance] - s2021[gainer.alliance])
    const consistent = transitions.filter((d) => d > 0).length
    if (consistent < MULTI_MIN_CONSISTENT_CYCLES) continue

    out.push({
      constituency: c,
      shares: { 2011: s2011, 2016: s2016, 2021: s2021, 2026: s2026 },
      cumulative,
      gainer: gainer.alliance,
      loser: loser.alliance,
      consistentCycles: consistent,
    })
  }
  cachedDrift = out
  return out
}

// ─── State-level seat-winner flow (2021 → 2026) ───────────────────────
//
// For the Sankey hero on /flows. Counts seats by (winner alliance in 2021,
// winner alliance in 2026). This is a SEAT-LEVEL flow (which alliance
// holds the seat), not a vote-share flow — distinct from the per-pattern
// detections above. Both stories matter, this one reads in five seconds.

const MAIN_ALLIANCES: AllianceCode[] = ["UDF", "LDF", "NDA"]

export type StateLevelFlow = {
  /** Winner-alliance counts by year. */
  fromTotals: Record<AllianceCode, number>
  toTotals: Record<AllianceCode, number>
  /** Seat counts by (2021 winner alliance, 2026 winner alliance) pair. */
  byPair: Array<{ from: AllianceCode; to: AllianceCode; count: number }>
  /** Seats where the 2021 winner couldn't be determined (no historical data). */
  missingFromCount: number
  totalSeats: number
}

let cachedStateLevelFlow: StateLevelFlow | null = null

export function getStateLevelFlow(): StateLevelFlow {
  if (cachedStateLevelFlow) return cachedStateLevelFlow

  const fromTotals: Record<AllianceCode, number> = {
    UDF: 0,
    LDF: 0,
    NDA: 0,
    OTHER: 0,
    NOTA: 0,
  }
  const toTotals: Record<AllianceCode, number> = {
    UDF: 0,
    LDF: 0,
    NDA: 0,
    OTHER: 0,
    NOTA: 0,
  }
  const pairCounts = new Map<string, number>()
  let missingFromCount = 0

  for (const c of constituencies) {
    // 2026 winner — pick highest-vote non-NOTA candidate
    const winner2026 = c.candidates
      .filter((x) => !x.isNota)
      .sort((a, b) => b.votes - a.votes)[0]
    if (!winner2026) continue
    const to = winner2026.alliance

    // 2021 winner from historical
    const hist = getHistoricalFor(c.constituencyNumber)
    const e2021 = hist?.elections.find(
      (e) => e.year === 2021 && e.type === "general"
    )
    if (!e2021) {
      missingFromCount++
      continue
    }
    const winner2021 = [...e2021.candidates].sort(
      (a, b) => b.votes - a.votes
    )[0]
    if (!winner2021) {
      missingFromCount++
      continue
    }
    const from = winner2021.alliance

    fromTotals[from]++
    toTotals[to]++
    const key = `${from}>${to}`
    pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1)
  }

  const byPair: StateLevelFlow["byPair"] = []
  for (const from of MAIN_ALLIANCES) {
    for (const to of MAIN_ALLIANCES) {
      const count = pairCounts.get(`${from}>${to}`) ?? 0
      if (count > 0) byPair.push({ from, to, count })
    }
  }

  cachedStateLevelFlow = {
    fromTotals,
    toTotals,
    byPair,
    missingFromCount,
    totalSeats: constituencies.length,
  }
  return cachedStateLevelFlow
}

// ─── Pattern grouping helpers ───────────────────────────────────────────

export function singleCyclePatternKey(flow: SingleCycleFlow): string {
  if (flow.kind === "two-way") return `${flow.from}_to_${flow.to}`
  return `${[...flow.from].sort().join("+")}_to_${flow.to}`
}

export function singleCyclePatternLabel(flow: SingleCycleFlow): string {
  if (flow.kind === "two-way") return `${flow.from} → ${flow.to}`
  return `${[...flow.from].sort().join(" + ")} → ${flow.to}`
}

export function multiCyclePatternKey(d: MultiCycleDrift): string {
  return `${d.loser}_to_${d.gainer}`
}

export function multiCyclePatternLabel(d: MultiCycleDrift): string {
  return `${d.loser} → ${d.gainer}`
}
