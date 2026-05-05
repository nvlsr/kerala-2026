import {
  allianceForCandidate,
  canonicalPartyName,
  constituenciesIn,
  displayConstituencyName,
  get2021Baseline,
  normalizeCandidateName,
  partyShort,
  totalVotesIn,
  type AllianceCode,
  type Candidate,
  type Constituency,
} from "@/lib/data"

export type CandidateRow = {
  key: string
  constituency: Constituency
  constituencyName: string
  candidate: Candidate
  candidateDisplay: string
  party: string
  partyShort: string
  allianceCode: AllianceCode
  votes: number
  share: number
  shareDelta2021: number | null
  margin: number
  marginPct: number
  marginDelta2021: number | null
  isWinner: boolean
  rank: number
}

export function buildCandidateRows(scope: string | null): CandidateRow[] {
  const rows: CandidateRow[] = []
  for (const c of constituenciesIn(scope)) {
    const total = totalVotesIn(c)
    if (total === 0) continue
    const real = c.candidates
      .filter((x) => !x.isNota)
      .sort((a, b) => b.votes - a.votes)
    real.forEach((cand, i) => {
      const winner = real[0]!
      const isWinner = cand === winner
      const margin = isWinner ? cand.margin : cand.votes - winner.votes
      const marginPct = (margin / total) * 100
      const share = (cand.votes / total) * 100
      const partyCanonical = canonicalPartyName(cand.party)
      const baseline = get2021Baseline(c, partyCanonical)
      const shareDelta2021 = baseline ? share - baseline.sharePct : null
      const marginDelta2021 = baseline ? marginPct - baseline.marginPct : null
      rows.push({
        key: `${c.constituencyNumber}:${i}:${cand.name}:${cand.party}`,
        constituency: c,
        constituencyName: displayConstituencyName(c),
        candidate: cand,
        candidateDisplay: normalizeCandidateName(cand.name),
        party: partyCanonical,
        partyShort: partyShort(cand.party),
        allianceCode: allianceForCandidate(c, cand),
        votes: cand.votes,
        share,
        shareDelta2021,
        margin,
        marginPct,
        marginDelta2021,
        isWinner,
        rank: i + 1,
      })
    })
  }
  return rows
}
