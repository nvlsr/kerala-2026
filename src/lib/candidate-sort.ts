import type { CandidateRow } from "@/lib/data"
import type { SortColumn, SortDir } from "@/lib/filters"

type Sign = 1 | -1
type Comparator = (a: CandidateRow, b: CandidateRow, sign: Sign) => number

function numeric(pick: (row: CandidateRow) => number): Comparator {
  return (a, b, sign) => sign * (pick(a) - pick(b))
}

function localeString(pick: (row: CandidateRow) => string): Comparator {
  return (a, b, sign) => sign * pick(a).localeCompare(pick(b))
}

/**
 * Compare a column whose value can be null. Nulls always sort to the end of the
 * list — for both `asc` and `desc` — because they represent "no data", not an
 * extreme value. Only the value-vs-value branch honours `sign`.
 */
function nullableNumber(
  pick: (row: CandidateRow) => number | null
): Comparator {
  return (a, b, sign) => {
    const av = pick(a)
    const bv = pick(b)
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    return sign * (av - bv)
  }
}

const COMPARATORS: Record<SortColumn, Comparator> = {
  constituency: numeric((r) => r.constituency.constituencyNumber),
  candidate: localeString((r) => r.candidateDisplay),
  party: localeString((r) => r.partyShort),
  share: numeric((r) => r.share),
  shareDelta: nullableNumber((r) => r.shareDelta2021),
  votes: numeric((r) => r.votes),
  margin: numeric((r) => r.margin),
  marginDelta: nullableNumber((r) => r.marginDelta2021),
}

export function sortCandidateRows(
  rows: CandidateRow[],
  column: SortColumn,
  dir: SortDir
): CandidateRow[] {
  const sign: Sign = dir === "asc" ? 1 : -1
  const cmp = COMPARATORS[column]
  return [...rows].sort((a, b) => cmp(a, b, sign))
}
