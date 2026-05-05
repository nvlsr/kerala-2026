import type { AllianceCode } from "@/lib/data"

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
  /** Apply a curated combo (Insights chips) — overwrites multiple slots at once. */
  | { type: "apply-preset"; preset: Partial<Filters> }

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
    case "apply-preset":
      return { ...state, ...action.preset }
  }
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
