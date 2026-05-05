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

const NEUTRAL_HUE = "#64748b" // slate-500: scalar magnitude in result=all
const POSITIVE_HUE = "#10b981" // emerald-500: gains
const NEGATIVE_HUE = "#f43f5e" // rose-500: losses
const NO_DATA_FILL = "var(--muted)"

const DIM_FACTOR = 0.2
const DIM_FLOOR = 0.15
const NO_DATA_OPACITY = 0.18

const DELTA_COLUMNS: ReadonlySet<SortColumn> = new Set([
  "shareDelta",
  "marginDelta",
])
const SCALAR_COLUMNS: ReadonlySet<SortColumn> = new Set([
  "votes",
  "share",
  "margin",
])

export function encodingModeFor(filters: Filters): EncodingMode {
  if (filters.result !== "all") return "alliance"
  if (DELTA_COLUMNS.has(filters.sort.column)) return "diverging"
  if (SCALAR_COLUMNS.has(filters.sort.column)) return "magnitude"
  return "alliance"
}

function valueForSort(row: CandidateRow, col: SortColumn): number | null {
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

export function computeSeatEncodings(
  filters: Filters,
  inFilterSet: Set<number>
): Map<number, SeatEncoding> {
  const all = buildCandidateRows(null)
  const byNum = new Map<number, CandidateRow[]>()
  for (const r of all) {
    const n = r.constituency.constituencyNumber
    const list = byNum.get(n)
    if (list) list.push(r)
    else byNum.set(n, [r])
  }

  const subjectByNum = new Map<number, CandidateRow | null>()
  for (const [num, rows] of byNum) {
    subjectByNum.set(num, pickSubjectRow(rows, filters))
  }

  const mode = encodingModeFor(filters)
  const sortCol = filters.sort.column

  const visibleValues: number[] = []
  if (mode !== "alliance" || SCALAR_COLUMNS.has(sortCol)) {
    for (const [num, subj] of subjectByNum) {
      if (!inFilterSet.has(num) || !subj) continue
      const v = valueForSort(subj, sortCol)
      if (v != null) visibleValues.push(v)
    }
  }

  let absMax = 0
  let scalarMin = 0
  let scalarMax = 0
  if (visibleValues.length > 0) {
    if (mode === "diverging") {
      absMax = Math.max(...visibleValues.map(Math.abs))
    } else {
      scalarMin = Math.min(...visibleValues)
      scalarMax = Math.max(...visibleValues)
    }
  }

  const out = new Map<number, SeatEncoding>()
  for (const [num, subj] of subjectByNum) {
    out.set(num, encodeSeat(subj, mode, sortCol, scalarMin, scalarMax, absMax))
  }

  for (const [num, enc] of out) {
    if (!inFilterSet.has(num)) {
      out.set(num, {
        color: enc.color,
        opacity: Math.max(DIM_FLOOR, enc.opacity * DIM_FACTOR),
      })
    }
  }

  return out
}

function encodeSeat(
  subj: CandidateRow | null,
  mode: EncodingMode,
  sortCol: SortColumn,
  scalarMin: number,
  scalarMax: number,
  absMax: number
): SeatEncoding {
  if (!subj) return { color: NO_DATA_FILL, opacity: NO_DATA_OPACITY }

  if (mode === "alliance") {
    const meta = getAlliance(subj.allianceCode)
    const flat = isMainFront(subj.allianceCode) ? 0.7 : 0.25
    if (SCALAR_COLUMNS.has(sortCol)) {
      const v = valueForSort(subj, sortCol)
      const opacity =
        v == null ? flat : magnitudeOpacity(v, scalarMin, scalarMax)
      return { color: meta.color, opacity }
    }
    return { color: meta.color, opacity: flat }
  }

  if (mode === "magnitude") {
    const v = valueForSort(subj, sortCol)
    if (v == null) return { color: NO_DATA_FILL, opacity: NO_DATA_OPACITY }
    return {
      color: NEUTRAL_HUE,
      opacity: magnitudeOpacity(v, scalarMin, scalarMax),
    }
  }

  // diverging
  const v = valueForSort(subj, sortCol)
  if (v == null) return { color: NO_DATA_FILL, opacity: NO_DATA_OPACITY }
  const color = v >= 0 ? POSITIVE_HUE : NEGATIVE_HUE
  const opacity = absMax > 0 ? 0.25 + (Math.abs(v) / absMax) * 0.7 : 0.25
  return { color, opacity }
}

function magnitudeOpacity(value: number, min: number, max: number): number {
  if (max <= min) return 0.7
  const t = (value - min) / (max - min)
  return 0.25 + t * 0.7
}
