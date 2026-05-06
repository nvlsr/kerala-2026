import {
  allianceForCandidate,
  canonicalPartyName,
  constituenciesIn,
  isAllianceCode,
  type AllianceCode,
} from "@/lib/data"

export type ResultFilter = "winners" | "losers" | "all"

export type SortColumn =
  | "constituency"
  | "candidate"
  | "party"
  | "share"
  | "shareDelta"
  | "votes"
  | "margin"
  | "marginDelta"

export type SortDir = "asc" | "desc"

export type Filters = {
  district: string | null
  alliance: AllianceCode | null
  party: string | null
  seat: number | null
  result: ResultFilter
  sort: { column: SortColumn; dir: SortDir }
}

export const initialFilters: Filters = {
  district: null,
  alliance: null,
  party: null,
  seat: null,
  result: "winners",
  sort: { column: "votes", dir: "desc" },
}

export type FilterAction =
  | { type: "set-district"; district: string | null }
  | { type: "set-alliance"; alliance: AllianceCode | null }
  | { type: "set-party"; party: string | null }
  | { type: "set-seat"; seat: number | null }
  | { type: "set-result"; result: ResultFilter }
  | { type: "set-sort"; column: SortColumn; dir?: SortDir }
  | { type: "clear-district" }
  | { type: "clear-alliance" }
  | { type: "clear-party" }
  | { type: "clear-seat" }
  | { type: "reset" }
  /** Apply a curated combo (Insights chips) — overwrites multiple slots at once. */
  | { type: "apply-preset"; preset: Partial<Filters> }
  /** Replace the whole state — used to sync filters from URL changes
   *  driven by React Router (e.g., the SearchBar navigating to
   *  /explore?alliance=NDA while the page is already mounted). */
  | { type: "replace"; filters: Filters }

export function filtersReducer(state: Filters, action: FilterAction): Filters {
  switch (action.type) {
    case "set-district":
      return { ...state, district: action.district }
    case "set-alliance":
      // Changing alliance clears party (party belongs to alliance)
      return action.alliance !== state.alliance
        ? { ...state, alliance: action.alliance, party: null }
        : { ...state, alliance: action.alliance }
    case "set-party":
      return { ...state, party: action.party }
    case "set-seat":
      return { ...state, seat: action.seat }
    case "set-result":
      return { ...state, result: action.result }
    case "set-sort":
      return {
        ...state,
        sort: {
          column: action.column,
          dir: action.dir ?? sortDirFor(state.sort, action.column),
        },
      }
    case "clear-district":
      return { ...state, district: null }
    case "clear-alliance":
      return { ...state, alliance: null, party: null }
    case "clear-party":
      return { ...state, party: null }
    case "clear-seat":
      return { ...state, seat: null }
    case "reset":
      return initialFilters
    case "apply-preset":
      return { ...state, ...action.preset }
    case "replace":
      return action.filters
  }
}

export function hasActiveFilters(filters: Filters): boolean {
  return serializeFilters(filters).toString() !== ""
}

/**
 * Default sort direction when toggling a column. Same column toggles direction;
 * different column picks asc for text/delta columns, desc for numeric magnitudes.
 */
function sortDirFor(
  currentSort: { column: SortColumn; dir: SortDir },
  nextColumn: SortColumn
): SortDir {
  if (currentSort.column === nextColumn) {
    return currentSort.dir === "asc" ? "desc" : "asc"
  }
  const ascByDefault =
    nextColumn === "constituency" ||
    nextColumn === "party" ||
    nextColumn === "shareDelta" ||
    nextColumn === "marginDelta"
  return ascByDefault ? "asc" : "desc"
}

const SORT_COLUMNS: readonly SortColumn[] = [
  "constituency",
  "candidate",
  "party",
  "share",
  "shareDelta",
  "votes",
  "margin",
  "marginDelta",
]
const RESULT_VALUES: readonly ResultFilter[] = ["winners", "losers", "all"]

function isSortColumn(value: string): value is SortColumn {
  return (SORT_COLUMNS as readonly string[]).includes(value)
}

function isSortDir(value: string): value is SortDir {
  return value === "asc" || value === "desc"
}

function isResultFilter(value: string): value is ResultFilter {
  return (RESULT_VALUES as readonly string[]).includes(value)
}

/**
 * Serialize active filters to URL search params. Default values are omitted to
 * keep the unfiltered URL clean.
 */
export function serializeFilters(filters: Filters): URLSearchParams {
  const p = new URLSearchParams()
  if (filters.district) p.set("district", filters.district)
  if (filters.alliance) p.set("alliance", filters.alliance)
  if (filters.party) p.set("party", filters.party)
  if (filters.seat != null) p.set("seat", String(filters.seat))
  if (filters.result !== initialFilters.result) p.set("result", filters.result)
  if (
    filters.sort.column !== initialFilters.sort.column ||
    filters.sort.dir !== initialFilters.sort.dir
  ) {
    p.set("sort", `${filters.sort.column}:${filters.sort.dir}`)
  }
  return p
}

/**
 * Parse URL search params into Filters, falling back to defaults for missing or
 * invalid values.
 */
export function parseFilters(params: URLSearchParams): Filters {
  const filters: Filters = { ...initialFilters }

  const district = params.get("district")
  if (district) filters.district = district

  const alliance = params.get("alliance")
  if (isAllianceCode(alliance)) filters.alliance = alliance

  const party = params.get("party")
  if (party) filters.party = party

  const seat = params.get("seat")
  if (seat) {
    const n = Number(seat)
    if (Number.isInteger(n) && n >= 1 && n <= 140) filters.seat = n
  }

  const result = params.get("result")
  if (result && isResultFilter(result)) filters.result = result

  const sort = params.get("sort")
  if (sort) {
    const [col, dir] = sort.split(":")
    if (col && dir && isSortColumn(col) && isSortDir(dir)) {
      filters.sort = { column: col, dir }
    }
  }

  return filters
}

/**
 * Constituency numbers that contain at least one candidate matching the active
 * structural filters (district + alliance + party + result). Used by the AC
 * map to dim out-of-set seats. Free-text search is intentionally excluded —
 * search is a refinement within the table view, not a constituency-level
 * filter.
 */
export function getFilteredConstituencyNumbers(filters: Filters): Set<number> {
  const result = new Set<number>()
  for (const c of constituenciesIn(filters.district)) {
    for (const cand of c.candidates) {
      if (cand.isNota) continue
      if (filters.result === "winners" && cand.status !== "won") continue
      if (filters.result === "losers" && cand.status === "won") continue
      if (
        filters.alliance &&
        allianceForCandidate(c, cand) !== filters.alliance
      )
        continue
      if (filters.party && canonicalPartyName(cand.party) !== filters.party)
        continue
      result.add(c.constituencyNumber)
      break
    }
  }
  return result
}
