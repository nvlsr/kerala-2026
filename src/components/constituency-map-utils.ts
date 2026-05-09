/**
 * Non-component helpers extracted from `constituency-map.tsx` so the
 * component file only exports React components (required for fast-refresh
 * to work cleanly under Vite/HMR).
 */
import paths from "@data/kerala-constituencies-paths.json"

import type { EncodingMode } from "@/lib/seat-encoding"
import type { Filters, SortColumn } from "@/lib/filters"

function sortLabel(col: SortColumn): string {
  switch (col) {
    case "votes":
      return "votes"
    case "share":
      return "vote share"
    case "margin":
      return "margin"
    case "shareDelta":
      return "Δ share '21"
    case "marginDelta":
      return "Δ margin '21"
    default:
      return ""
  }
}

/**
 * Subtitle string for the map's surrounding Section. Reflects the
 * current filter set size + the encoding mode (winner alliance,
 * runner-up alliance, magnitude, gain/loss).
 */
export function describeMapSubtitle(
  filters: Filters,
  inFilterSize: number,
  mode: EncodingMode
): string {
  const subset =
    inFilterSize === paths.constituencies.length
      ? null
      : `${inFilterSize} of ${paths.constituencies.length} seats`
  const encoding =
    mode === "magnitude"
      ? `colored by ${sortLabel(filters.sort.column)}`
      : mode === "diverging"
        ? `colored by ${sortLabel(filters.sort.column)} (gain / loss)`
        : filters.result === "losers"
          ? "colored by runner-up's alliance"
          : "colored by winning alliance"
  return [subset, encoding].filter(Boolean).join(" · ")
}
