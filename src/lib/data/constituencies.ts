import { constituenciesData, districtsMeta } from "@/lib/data/loaders"

export type Candidate = {
  name: string
  party: string
  votes: number
  margin: number
  status: "won" | "lost" | "nota"
  isNota: boolean
}

export type Constituency = {
  constituency: string
  constituencyNumber: number
  constituencyName: string
  state: string
  candidates: Candidate[]
  checksum: { computedMarginsMatchScraped: boolean; mismatches: unknown[] }
  source: string
}

export const constituencies: Constituency[] = constituenciesData
  .slice()
  .sort((a, b) => a.constituencyNumber - b.constituencyNumber)

export function constituenciesIn(districtId: string | null): Constituency[] {
  if (districtId == null) return constituencies
  return constituencies.filter(
    (c) =>
      districtsMeta.constituencyToDistrict[String(c.constituencyNumber)] ===
      districtId
  )
}

export function winnerOf(c: Constituency): Candidate {
  const w = c.candidates.find((cand) => cand.status === "won")
  if (!w) throw new Error(`No winner for ${c.constituencyNumber}`)
  return w
}

export function totalVotesIn(c: Constituency): number {
  return c.candidates.reduce((s, x) => s + x.votes, 0)
}
