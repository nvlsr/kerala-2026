/**
 * Scope-wide single-party trend over time. Returns the party's seats /
 * contested / votes / share for each available cycle.
 *
 * Note: alliance code on the result reflects the party's CURRENT (2026)
 * alliance — used for chart line colour. The data layer doesn't try to
 * model "which alliance was the party in for each historical year" here
 * because the alliance-trend chart already handles that story; this
 * function exists to draw a single-party line whose colour is keyed to
 * its present-day affiliation.
 */

import {
  allianceForRawParty,
  type AllianceCode,
} from "@/lib/data/alliances"
import { constituenciesIn } from "@/lib/data/constituencies"
import { getHistoricalFor } from "@/lib/data/historical"
import { alliancesMeta } from "@/lib/data/loaders"
import { canonicalPartyName, partyShort } from "@/lib/data/parties"

import { ensureMapEntry } from "./_helpers"

export type PartyTrendPoint = {
  year: number
  seats: number
  contested: number
  votes: number
  totalVotes: number
  share: number
}

export type PartyTrendData = {
  party: string
  partyShort: string
  allianceCode: AllianceCode
  color: string
  years: number[]
  points: PartyTrendPoint[]
  totalSeats: number
}

export function getPartyTrendData(
  party: string,
  districtId: string | null = null
): PartyTrendData {
  const list = constituenciesIn(districtId)
  const yearMap = new Map<
    number,
    { seats: number; contested: number; votes: number; totalVotes: number }
  >()

  const ensureYear = (year: number) =>
    ensureMapEntry(yearMap, year, () => ({
      seats: 0,
      contested: 0,
      votes: 0,
      totalVotes: 0,
    }))

  for (const c of list) {
    const hist = getHistoricalFor(c.constituencyNumber)
    if (hist) {
      for (const e of hist.elections) {
        if (e.type !== "general") continue
        if (e.candidates.length === 0) continue
        const entry = ensureYear(e.year)
        const winner = [...e.candidates].sort((a, b) => b.votes - a.votes)[0]!
        const winnerCanonical = canonicalPartyName(winner.party)
        for (const cand of e.candidates) {
          entry.totalVotes += cand.votes
          if (canonicalPartyName(cand.party) === party) {
            entry.contested++
            entry.votes += cand.votes
          }
        }
        if (winnerCanonical === party) entry.seats++
      }
    }

    const entry2026 = ensureYear(2026)
    for (const cand of c.candidates) {
      entry2026.totalVotes += cand.votes
      if (canonicalPartyName(cand.party) === party) {
        entry2026.contested++
        entry2026.votes += cand.votes
        if (cand.status === "won") entry2026.seats++
      }
    }
  }

  const years = [...yearMap.keys()].sort((a, b) => a - b)
  const points: PartyTrendPoint[] = years.map((year) => {
    const entry = yearMap.get(year)!
    return {
      year,
      seats: entry.seats,
      contested: entry.contested,
      votes: entry.votes,
      totalVotes: entry.totalVotes,
      share: entry.totalVotes > 0 ? (entry.votes / entry.totalVotes) * 100 : 0,
    }
  })

  const allianceCode = allianceForRawParty(party)
  const meta = alliancesMeta.alliances[allianceCode]

  return {
    party,
    partyShort: partyShort(party),
    allianceCode,
    color: meta.color,
    years,
    points,
    totalSeats: list.length,
  }
}
