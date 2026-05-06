import {
  allianceForCandidate,
  type AllianceCode,
} from "@/lib/data/alliances"
import { constituenciesIn } from "@/lib/data/constituencies"
import { partyShort } from "@/lib/data/parties"

export type PartyBreakdown = {
  party: string
  partyShort: string
  allianceCode: AllianceCode
  contested: number
  won: number
  votes: number
  voteShare: number
}

export type AllianceBreakdown = {
  code: AllianceCode
  totalSeats: number
  totalContested: number
  totalVotes: number
  totalVoteShare: number
  parties: PartyBreakdown[]
}

export function getAllianceBreakdown(
  code: AllianceCode,
  districtId: string | null = null
): AllianceBreakdown {
  const list = constituenciesIn(districtId)
  const scopeTotal = list.reduce(
    (s, c) => s + c.candidates.reduce((t, x) => t + x.votes, 0),
    0
  )
  const map = new Map<string, PartyBreakdown>()
  for (const c of list) {
    for (const cand of c.candidates) {
      const a = allianceForCandidate(c, cand)
      if (a !== code) continue
      const existing = map.get(cand.party) ?? {
        party: cand.party,
        partyShort: partyShort(cand.party),
        allianceCode: a,
        contested: 0,
        won: 0,
        votes: 0,
        voteShare: 0,
      }
      existing.contested++
      existing.votes += cand.votes
      if (cand.status === "won") existing.won++
      map.set(cand.party, existing)
    }
  }
  const parties = [...map.values()]
  for (const p of parties)
    p.voteShare = scopeTotal > 0 ? p.votes / scopeTotal : 0
  parties.sort((a, b) => b.won - a.won || b.votes - a.votes)
  const totalSeats = parties.reduce((s, p) => s + p.won, 0)
  const totalContested = parties.reduce((s, p) => s + p.contested, 0)
  const totalVotes = parties.reduce((s, p) => s + p.votes, 0)
  return {
    code,
    totalSeats,
    totalContested,
    totalVotes,
    totalVoteShare: scopeTotal > 0 ? totalVotes / scopeTotal : 0,
    parties,
  }
}
