import type { CandidateRow } from "@/lib/data"
import type { SortColumn, SortDir } from "@/lib/filters"

type Comparator = (a: CandidateRow, b: CandidateRow) => number

function nullableNumber(
  pick: (row: CandidateRow) => number | null
): Comparator {
  return (a, b) => {
    const av = pick(a)
    const bv = pick(b)
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    return av - bv
  }
}

const COMPARATORS: Record<SortColumn, Comparator> = {
  constituency: (a, b) =>
    a.constituency.constituencyNumber - b.constituency.constituencyNumber,
  candidate: (a, b) => a.candidateDisplay.localeCompare(b.candidateDisplay),
  party: (a, b) => a.partyShort.localeCompare(b.partyShort),
  share: (a, b) => a.share - b.share,
  shareDelta: nullableNumber((r) => r.shareDelta2021),
  votes: (a, b) => a.votes - b.votes,
  margin: (a, b) => a.margin - b.margin,
  marginDelta: nullableNumber((r) => r.marginDelta2021),
}

export function sortCandidateRows(
  rows: CandidateRow[],
  column: SortColumn,
  dir: SortDir
): CandidateRow[] {
  const sign = dir === "asc" ? 1 : -1
  const cmp = COMPARATORS[column]
  return [...rows].sort((a, b) => sign * cmp(a, b))
}
