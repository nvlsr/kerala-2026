import { TOTAL_SEATS } from "@/lib/constants"
import {
  allianceForCandidate,
  canonicalPartyName,
  constituenciesIn,
  getACsInReligionMix,
  isAllianceCode,
  type AllianceCode,
} from "@/lib/data"
import { reservationsMeta } from "@/lib/data/loaders"

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

/**
 * Demographic-mix bins, computed from the 2025 religion projection.
 * A read-only filter dimension on /explore (only set via curated
 * question presets, not directly settable from the breadcrumb), but
 * appears as a clearable chip when active.
 *
 *   muslim-majority      Muslim ≥ 60%
 *   muslim-heavy         40 ≤ Muslim < 60
 *   christian-majority   Christian ≥ 50%
 *   christian-heavy      30 ≤ Christian < 50
 *   hindu-heavy          Hindu ≥ 70%
 */
export type ReligionMix =
  | "muslim-majority"
  | "muslim-heavy"
  | "christian-majority"
  | "christian-heavy"
  | "hindu-heavy"

export type ReservationFilter = "SC" | "ST"

export const RELIGION_MIX_LABELS: Record<ReligionMix, string> = {
  "muslim-majority": "Muslim-majority",
  "muslim-heavy": "Muslim-heavy",
  "christian-majority": "Christian-majority",
  "christian-heavy": "Christian-heavy",
  "hindu-heavy": "Hindu-heavy",
}

export const RESERVATION_LABELS: Record<ReservationFilter, string> = {
  SC: "SC reserved",
  ST: "ST reserved",
}

export type Filters = {
  district: string | null
  alliance: AllianceCode | null
  party: string | null
  seat: number | null
  religionMix: ReligionMix | null
  reservation: ReservationFilter | null
  result: ResultFilter
  sort: { column: SortColumn; dir: SortDir }
}

export const initialFilters: Filters = {
  district: null,
  alliance: null,
  party: null,
  seat: null,
  religionMix: null,
  reservation: null,
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
  | { type: "clear-religion-mix" }
  | { type: "clear-reservation" }
  | { type: "reset" }
  /** Apply a curated combo (Quick views chips) — overwrites multiple slots at once. */
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
    case "clear-religion-mix":
      return { ...state, religionMix: null }
    case "clear-reservation":
      return { ...state, reservation: null }
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
const RELIGION_MIX_VALUES: readonly ReligionMix[] = [
  "muslim-majority",
  "muslim-heavy",
  "christian-majority",
  "christian-heavy",
  "hindu-heavy",
]
const RESERVATION_VALUES: readonly ReservationFilter[] = ["SC", "ST"]

function isSortColumn(value: string): value is SortColumn {
  return (SORT_COLUMNS as readonly string[]).includes(value)
}

function isSortDir(value: string): value is SortDir {
  return value === "asc" || value === "desc"
}

function isResultFilter(value: string): value is ResultFilter {
  return (RESULT_VALUES as readonly string[]).includes(value)
}

function isReligionMix(value: string): value is ReligionMix {
  return (RELIGION_MIX_VALUES as readonly string[]).includes(value)
}

function isReservationFilter(value: string): value is ReservationFilter {
  return (RESERVATION_VALUES as readonly string[]).includes(value)
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
  if (filters.religionMix) p.set("religion", filters.religionMix)
  if (filters.reservation) p.set("reservation", filters.reservation)
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
    if (Number.isInteger(n) && n >= 1 && n <= TOTAL_SEATS) filters.seat = n
  }

  const religion = params.get("religion")
  if (religion && isReligionMix(religion)) filters.religionMix = religion

  const reservation = params.get("reservation")
  if (reservation && isReservationFilter(reservation))
    filters.reservation = reservation

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
  const religionAllowed = filters.religionMix
    ? getACsInReligionMix(filters.religionMix)
    : null
  const result = new Set<number>()
  for (const c of constituenciesIn(filters.district)) {
    if (religionAllowed && !religionAllowed.has(c.constituencyNumber)) continue
    if (
      filters.reservation &&
      reservationsMeta.constituencyToReservation[
        String(c.constituencyNumber)
      ] !== filters.reservation
    )
      continue
    for (const cand of c.candidates) {
      if (cand.isNota) continue
      if (filters.result === "winners" && cand.status !== "won") continue
      if (filters.result === "losers" && cand.status === "won") continue
      if (
        filters.alliance &&
        allianceForCandidate(cand) !== filters.alliance
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
