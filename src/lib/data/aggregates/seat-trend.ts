/**
 * Per-constituency historical trend, used by the seat-detail historical
 * chart. Series is one-per-alliance (UDF/LDF/NDA/OTHER) — a seat where the
 * UDF candidate was KC(M) in 2011/2016 and IUML in 2026 becomes a single
 * UDF line spanning all four cycles, with the underlying party at each
 * cycle in the point's metadata for the tooltip.
 */

import { type AllianceCode } from "@/lib/data/alliances"
import { constituencies } from "@/lib/data/constituencies"
import { getHistoricalFor } from "@/lib/data/historical"
import { alliancesMeta } from "@/lib/data/loaders"
import { canonicalPartyName, partyShort } from "@/lib/data/parties"

export type TrendPoint = {
  year: number
  type: "general" | "by-election"
  reason: string | null
  share: number | null
  votes: number | null
  candidate: string | null
  /** The party of the candidate at this point (may differ across years for the
   *  same alliance — e.g. KC(M) in 2011/2016 then IUML in 2026 both UDF). */
  party: string | null
  partyShort: string | null
}

export type TrendSeries = {
  /** Alliance code, used as the React key and for highlight matching. */
  party: string
  /** Display label (e.g. "UDF"). Kept under `partyShort` for backwards
   *  compatibility with the chart's tooltip code. */
  partyShort: string
  color: string
  allianceCode: AllianceCode
  isCurrent2026: boolean
  points: TrendPoint[]
}

export type PartyOption = {
  party: string
  partyShort: string
  color: string
  allianceCode: AllianceCode
  isCurrent2026: boolean
}

export type TrendData = {
  years: number[]
  byelectionYears: number[]
  /** One series per alliance (UDF / LDF / NDA / OTHER), used by the chart. */
  series: TrendSeries[]
  /** Party-level options used by chips and party-filtered tables. Order:
   *  highest to lowest by total votes across cycles. Each party carries
   *  its most-recent alliance for chip colouring. */
  parties: PartyOption[]
}

export function getTrendData(constituencyNumber: number): TrendData | null {
  const c = constituencies.find(
    (x) => x.constituencyNumber === constituencyNumber
  )
  if (!c) return null
  const hist = getHistoricalFor(constituencyNumber)
  const total2026 = c.candidates.reduce((s, x) => s + x.votes, 0)

  const elections: Array<{
    year: number
    type: "general" | "by-election"
    reason: string | null
    candidates: Array<{
      party: string
      votes: number
      votePct: number
      name: string
      alliance: AllianceCode
    }>
  }> = []

  if (hist) {
    for (const e of hist.elections) {
      elections.push({
        year: e.year,
        type: e.type,
        reason: e.reason,
        candidates: e.candidates.map((cd) => ({
          party: canonicalPartyName(cd.party),
          votes: cd.votes,
          votePct: cd.votePct,
          name: cd.name,
          alliance: cd.alliance,
        })),
      })
    }
  }

  elections.push({
    year: 2026,
    type: "general",
    reason: null,
    candidates: c.candidates
      .filter((cd) => !cd.isNota)
      .map((cd) => ({
        party: canonicalPartyName(cd.party),
        votes: cd.votes,
        votePct: total2026 > 0 ? (cd.votes / total2026) * 100 : 0,
        name: cd.name,
        alliance: cd.alliance,
      })),
  })

  elections.sort((a, b) => a.year - b.year)

  // Collect every alliance that ever appeared in this seat. Walk in order so
  // the chart legend reflects the alliance's debut cycle.
  const ALLIANCES_BY_PRESENCE: AllianceCode[] = []
  const seenAlliances = new Set<AllianceCode>()
  for (const e of elections) {
    for (const cand of e.candidates) {
      if (!seenAlliances.has(cand.alliance)) {
        seenAlliances.add(cand.alliance)
        ALLIANCES_BY_PRESENCE.push(cand.alliance)
      }
    }
  }

  // Skip NOTA — it's not an alliance, it's an option.
  const allianceKeys = ALLIANCES_BY_PRESENCE.filter((a) => a !== "NOTA")

  const seriesWithTotals = allianceKeys.map((allianceKey) => {
    const points: TrendPoint[] = elections.map((e) => {
      // Pick the highest-vote candidate of this alliance in this election.
      const cand = e.candidates
        .filter((cd) => cd.alliance === allianceKey)
        .sort((a, b) => b.votes - a.votes)[0]
      return {
        year: e.year,
        type: e.type,
        reason: e.reason,
        share: cand ? cand.votePct : null,
        votes: cand ? cand.votes : null,
        candidate: cand ? cand.name : null,
        party: cand ? cand.party : null,
        partyShort: cand ? partyShort(cand.party) : null,
      }
    })
    const meta = alliancesMeta.alliances[allianceKey]
    const totalVotes = points.reduce((s, p) => s + (p.votes ?? 0), 0)
    const trendSeries: TrendSeries = {
      party: allianceKey,
      partyShort: meta.code,
      color: meta.color,
      allianceCode: allianceKey,
      isCurrent2026: c.candidates.some(
        (cd) => !cd.isNota && cd.alliance === allianceKey
      ),
      points,
    }
    return { trendSeries, totalVotes }
  })

  seriesWithTotals.sort((a, b) => b.totalVotes - a.totalVotes)
  const series: TrendSeries[] = seriesWithTotals.map((s) => s.trendSeries)

  // Party-level options for chips/table — top-3 parties per cycle, ordered
  // by their cumulative votes. Each party carries its MOST RECENT alliance
  // so the chip colour reflects current affiliation (e.g. KC(M) which
  // switched in 2020 will be LDF-coloured because their most recent
  // appearance was LDF).
  const partyTotals = new Map<string, number>()
  const partyMostRecentAlliance = new Map<string, AllianceCode>()
  const partyAppearedIn2026 = new Set<string>()
  for (const e of elections) {
    const top3 = [...e.candidates].sort((a, b) => b.votes - a.votes).slice(0, 3)
    for (const cd of top3) {
      partyTotals.set(cd.party, (partyTotals.get(cd.party) ?? 0) + cd.votes)
      // elections is sorted ascending; later writes override → most recent
      partyMostRecentAlliance.set(cd.party, cd.alliance)
      if (e.year === 2026) partyAppearedIn2026.add(cd.party)
    }
  }
  const parties: PartyOption[] = [...partyTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([party]) => {
      const allianceCode =
        partyMostRecentAlliance.get(party) ?? ("OTHER" as AllianceCode)
      const meta = alliancesMeta.alliances[allianceCode]
      return {
        party,
        partyShort: partyShort(party),
        color: meta.color,
        allianceCode,
        isCurrent2026: partyAppearedIn2026.has(party),
      }
    })

  const years = elections.map((e) => e.year)
  const byelectionYears = elections
    .filter((e) => e.type === "by-election")
    .map((e) => e.year)

  return { years, byelectionYears, series, parties }
}
