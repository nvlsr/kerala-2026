import { useMemo } from "react"

import paths from "@data/kerala-constituencies-paths.json"
import {
  buildMapData,
  type EncodingMode,
} from "@/lib/seat-encoding"
import type { Filters, SortColumn } from "@/lib/filters"

type Props = {
  filters: Filters
  inFilterSet: Set<number>
  selectedSeat: number | null
  hoveredSeat: number | null
  onSelect: (n: number | null) => void
  onHover: (n: number | null) => void
}

/**
 * Renders only the constituency-map SVG (no surrounding section,
 * no side panel). Parent owns the hover + selection state and the
 * left-column preview. Each polygon is interactive — click selects
 * the seat, hover surfaces a preview in the parent's detail column.
 */
export function ConstituencyMap({
  filters,
  inFilterSet,
  selectedSeat,
  hoveredSeat,
  onSelect,
  onHover,
}: Props) {
  const data = useMemo(
    () => buildMapData(filters, inFilterSet),
    [filters, inFilterSet]
  )
  const fills = data.encodings

  return (
    <div className="flex justify-center">
      <svg
        viewBox={`0 0 ${paths.width} ${paths.height}`}
        role="img"
        aria-label="Kerala constituency map"
        className="h-auto w-full max-w-md"
        onMouseLeave={() => onHover(null)}
      >
        {paths.constituencies.map((c) => {
          const num = c.constituencyNumber
          const isSelected = selectedSeat === num
          const isHovered = hoveredSeat === num
          const fill = fills.get(num) ?? {
            color: "var(--muted)",
            opacity: 0.2,
          }
          const baseOpacity = fill.opacity
          return (
            <path
              key={num}
              d={c.pathD}
              role="button"
              aria-label={`${c.name} (${num})`}
              aria-pressed={isSelected}
              tabIndex={0}
              fill={fill.color}
              fillOpacity={
                isSelected
                  ? 0.95
                  : isHovered
                    ? Math.min(1, baseOpacity + 0.2)
                    : baseOpacity
              }
              stroke={
                isSelected ? "var(--foreground)" : "var(--border)"
              }
              strokeWidth={isSelected ? 1.5 : 0.5}
              className="cursor-pointer transition-opacity outline-none focus-visible:stroke-foreground focus-visible:[stroke-width:1.5]"
              onClick={() => onSelect(isSelected ? null : num)}
              onMouseEnter={() => onHover(num)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelect(isSelected ? null : num)
                }
              }}
            >
              <title>{c.name}</title>
            </path>
          )
        })}
      </svg>
    </div>
  )
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
 * Empty-state hint shown in the detail column when no seat is
 * selected. Explains the map's encoding and prompts the user to
 * click a polygon.
 */
export function Hint({ mode }: { mode: EncodingMode }) {
  const explainer =
    mode === "magnitude"
      ? "Single neutral hue; darker shades = higher values on the active sort column."
      : mode === "diverging"
        ? "Green = gain over 2021, rose = loss; darker shades = larger swings."
        : "Polygons are colored by alliance. When sorted by a numeric column, darker shades mean a bigger value or swing."
  return (
    <div className="min-h-[12rem] rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
      <div className="mb-2 font-medium tracking-wide text-foreground/70 uppercase">
        Hover or click a seat
      </div>
      {explainer} Out-of-filter seats fade.
    </div>
  )
}
