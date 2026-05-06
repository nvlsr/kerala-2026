import {
  buildCandidateRows,
  getAlliance,
  isMainFront,
  type CandidateRow,
} from "@/lib/data"
import type { Filters, SortColumn } from "@/lib/filters"

export type SeatEncoding = {
  color: string
  opacity: number
}

export type EncodingMode = "alliance" | "magnitude" | "diverging"

export type MapData = {
  mode: EncodingMode
  sortCol: SortColumn
  isMagSort: boolean
  minAbs: number
  maxAbs: number
  encodings: Map<number, SeatEncoding>
  subjects: Map<number, CandidateRow | null>
}

export const NEUTRAL_HUE = "#64748b" // slate-500: scalar magnitude in result=all
export const POSITIVE_HUE = "#10b981" // emerald-500: gains
export const NEGATIVE_HUE = "#f43f5e" // rose-500: losses
// var(--foreground) (not --muted) so that the no-data fill is visible
// in both light and dark mode. --muted is too close to --background in
// light mode (oklch 0.97 vs 1.0), so muted-filled cells were
// effectively invisible there — including the selected-seat case at
// 0.95 opacity. Foreground inverts symmetrically across themes, so
// we use much lower base opacities here than the prior muted-based
// values; selected (0.95 opacity in the JSX) pops cleanly in either
// mode, while ambient dim cells stay subtle.
const NO_DATA_FILL = "var(--foreground)"

const DIM_FACTOR = 0.2
const DIM_FLOOR = 0.05
const NO_DATA_OPACITY = 0.06

const DELTA_COLUMNS: ReadonlySet<SortColumn> = new Set([
  "shareDelta",
  "marginDelta",
])
const SCALAR_COLUMNS: ReadonlySet<SortColumn> = new Set([
  "votes",
  "share",
  "margin",
])
const MAGNITUDE_COLUMNS: ReadonlySet<SortColumn> = new Set([
  ...SCALAR_COLUMNS,
  ...DELTA_COLUMNS,
])

export function encodingModeFor(filters: Filters): EncodingMode {
  if (filters.result !== "all") return "alliance"
  if (DELTA_COLUMNS.has(filters.sort.column)) return "diverging"
  if (SCALAR_COLUMNS.has(filters.sort.column)) return "magnitude"
  return "alliance"
}

export function valueForSort(
  row: CandidateRow,
  col: SortColumn
): number | null {
  switch (col) {
    case "votes":
      return row.votes
    case "share":
      return row.share
    case "margin":
      return row.margin
    case "shareDelta":
      return row.shareDelta2021
    case "marginDelta":
      return row.marginDelta2021
    default:
      return null
  }
}

function pickSubjectRow(
  rows: CandidateRow[],
  filters: Filters
): CandidateRow | null {
  let pool = rows
  if (filters.result === "winners") pool = pool.filter((r) => r.isWinner)
  else if (filters.result === "losers") pool = pool.filter((r) => !r.isWinner)
  if (filters.party) pool = pool.filter((r) => r.party === filters.party)
  if (pool.length === 0) return null
  // Highest-vote row wins ties: in winners mode this is the winner; in losers
  // it's the top runner-up; in all+no-party it's still the winner.
  return pool.reduce((best, r) => (r.votes > best.votes ? r : best))
}

export function buildMapData(
  filters: Filters,
  inFilterSet: Set<number>
): MapData {
  const all = buildCandidateRows(null)
  const byNum = new Map<number, CandidateRow[]>()
  for (const r of all) {
    const n = r.constituency.constituencyNumber
    const list = byNum.get(n)
    if (list) list.push(r)
    else byNum.set(n, [r])
  }

  const subjects = new Map<number, CandidateRow | null>()
  for (const [num, rows] of byNum) {
    subjects.set(num, pickSubjectRow(rows, filters))
  }

  const mode = encodingModeFor(filters)
  const sortCol = filters.sort.column
  const isMagSort = MAGNITUDE_COLUMNS.has(sortCol)

  let minAbs = 0
  let maxAbs = 0
  if (isMagSort) {
    const visibleAbs: number[] = []
    for (const [num, subj] of subjects) {
      if (!inFilterSet.has(num) || !subj) continue
      const v = valueForSort(subj, sortCol)
      if (v != null) visibleAbs.push(Math.abs(v))
    }
    if (visibleAbs.length > 0) {
      minAbs = Math.min(...visibleAbs)
      maxAbs = Math.max(...visibleAbs)
    }
  }

  const encodings = new Map<number, SeatEncoding>()
  for (const [num, subj] of subjects) {
    encodings.set(
      num,
      encodeSeat(subj, mode, sortCol, isMagSort, minAbs, maxAbs)
    )
  }

  for (const [num, enc] of encodings) {
    if (!inFilterSet.has(num)) {
      encodings.set(num, {
        color: enc.color,
        opacity: Math.max(DIM_FLOOR, enc.opacity * DIM_FACTOR),
      })
    }
  }

  return { mode, sortCol, isMagSort, minAbs, maxAbs, encodings, subjects }
}

export function computeSeatEncodings(
  filters: Filters,
  inFilterSet: Set<number>
): Map<number, SeatEncoding> {
  return buildMapData(filters, inFilterSet).encodings
}

function encodeSeat(
  subj: CandidateRow | null,
  mode: EncodingMode,
  sortCol: SortColumn,
  isMagSort: boolean,
  minAbs: number,
  maxAbs: number
): SeatEncoding {
  if (!subj) return { color: NO_DATA_FILL, opacity: NO_DATA_OPACITY }

  const v = isMagSort ? valueForSort(subj, sortCol) : null
  const magOpacity =
    v == null ? null : rangeOpacity(Math.abs(v), minAbs, maxAbs)

  if (mode === "alliance") {
    const meta = getAlliance(subj.allianceCode)
    const flat = isMainFront(subj.allianceCode) ? 0.7 : 0.25
    return { color: meta.color, opacity: magOpacity ?? flat }
  }
  if (mode === "magnitude") {
    if (v == null || magOpacity == null)
      return { color: NO_DATA_FILL, opacity: NO_DATA_OPACITY }
    return { color: NEUTRAL_HUE, opacity: magOpacity }
  }
  if (v == null || magOpacity == null)
    return { color: NO_DATA_FILL, opacity: NO_DATA_OPACITY }
  return {
    color: v >= 0 ? POSITIVE_HUE : NEGATIVE_HUE,
    opacity: magOpacity,
  }
}

function rangeOpacity(absValue: number, minAbs: number, maxAbs: number): number {
  if (maxAbs <= minAbs) return 0.7
  const t = (absValue - minAbs) / (maxAbs - minAbs)
  const clamped = Math.max(0, Math.min(1, t))
  return 0.25 + clamped * 0.7
}
