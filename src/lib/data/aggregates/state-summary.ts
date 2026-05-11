import { allianceForCandidate, type AllianceCode } from "@/lib/data/alliances"
import { constituenciesIn } from "@/lib/data/constituencies"

export type StateSummary = {
  totalSeats: number
  totalVotes: number
  rows: Array<{
    code: AllianceCode
    seats: number
    votes: number
    voteShare: number
  }>
}

const ROW_ORDER: AllianceCode[] = ["UDF", "LDF", "NDA", "OTHER", "NOTA"]

export function getStateSummary(
  districtId: string | null = null
): StateSummary {
  const list = constituenciesIn(districtId)
  const seats: Record<AllianceCode, number> = {
    UDF: 0,
    LDF: 0,
    NDA: 0,
    OTHER: 0,
    NOTA: 0,
  }
  const votes: Record<AllianceCode, number> = {
    UDF: 0,
    LDF: 0,
    NDA: 0,
    OTHER: 0,
    NOTA: 0,
  }
  let totalVotes = 0
  for (const c of list) {
    for (const cand of c.candidates) {
      const a = allianceForCandidate(cand)
      votes[a] += cand.votes
      totalVotes += cand.votes
      if (cand.status === "won") seats[a]++
    }
  }
  return {
    totalSeats: list.length,
    totalVotes,
    rows: ROW_ORDER.map((code) => ({
      code,
      seats: seats[code],
      votes: votes[code],
      voteShare: totalVotes > 0 ? votes[code] / totalVotes : 0,
    })),
  }
}
