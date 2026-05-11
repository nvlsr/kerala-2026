/**
 * Scope-wide alliance trend over time. Returns one line per alliance
 * (UDF/LDF/NDA/OTHER/NOTA) across every available cycle, with seats /
 * contested / votes / share for each.
 *
 * Per-cycle alliance attribution: each candidate carries their own
 * `alliance` field reflecting the alliance they ran with that cycle.
 * KC(M) was UDF in 2011/2016 and LDF from 2020 onwards, RSP was LDF in
 * 2011 and UDF from 2014, etc. — those switches are honoured here.
 */

import { allianceForCandidate, type AllianceCode } from "@/lib/data/alliances"
import { constituenciesIn } from "@/lib/data/constituencies"
import { getHistoricalFor } from "@/lib/data/historical"

import { ensureMapEntry } from "./_helpers"

export type AllianceTrendPoint = {
  year: number
  seats: number
  contested: number
  votes: number
  totalVotes: number
  share: number
}

export type AllianceTrendData = {
  years: number[]
  totalSeats: number
  series: Record<AllianceCode, AllianceTrendPoint[]>
}

const CODES: AllianceCode[] = ["UDF", "LDF", "NDA", "OTHER", "NOTA"]

export function getAllianceTrendData(
  districtId: string | null = null
): AllianceTrendData {
  const list = constituenciesIn(districtId)
  const yearTotals = new Map<
    number,
    {
      totalVotes: number
      perAlliance: Record<
        AllianceCode,
        { seats: number; contested: number; votes: number }
      >
    }
  >()

  const ensureYear = (year: number) =>
    ensureMapEntry(yearTotals, year, () => ({
      totalVotes: 0,
      perAlliance: {
        UDF: { seats: 0, contested: 0, votes: 0 },
        LDF: { seats: 0, contested: 0, votes: 0 },
        NDA: { seats: 0, contested: 0, votes: 0 },
        OTHER: { seats: 0, contested: 0, votes: 0 },
        NOTA: { seats: 0, contested: 0, votes: 0 },
      },
    }))

  for (const c of list) {
    const hist = getHistoricalFor(c.constituencyNumber)
    if (hist) {
      for (const e of hist.elections) {
        if (e.type !== "general") continue
        if (e.candidates.length === 0) continue
        const entry = ensureYear(e.year)
        const winner = [...e.candidates].sort((a, b) => b.votes - a.votes)[0]!
        entry.perAlliance[winner.alliance].seats++
        for (const cand of e.candidates) {
          entry.perAlliance[cand.alliance].contested++
          entry.perAlliance[cand.alliance].votes += cand.votes
          entry.totalVotes += cand.votes
        }
      }
    }

    const entry2026 = ensureYear(2026)
    for (const cand of c.candidates) {
      const a = allianceForCandidate(cand)
      entry2026.perAlliance[a].contested++
      entry2026.perAlliance[a].votes += cand.votes
      entry2026.totalVotes += cand.votes
      if (cand.status === "won") entry2026.perAlliance[a].seats++
    }
  }

  const years = [...yearTotals.keys()].sort((a, b) => a - b)
  const series = {} as Record<AllianceCode, AllianceTrendPoint[]>
  for (const code of CODES) {
    series[code] = years.map((year) => {
      const entry = yearTotals.get(year)!
      const a = entry.perAlliance[code]
      return {
        year,
        seats: a.seats,
        contested: a.contested,
        votes: a.votes,
        totalVotes: entry.totalVotes,
        share: entry.totalVotes > 0 ? (a.votes / entry.totalVotes) * 100 : 0,
      }
    })
  }

  return { years, totalSeats: list.length, series }
}
