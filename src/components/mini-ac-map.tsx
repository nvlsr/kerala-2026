import { useMemo } from "react"

import paths from "@data/kerala-constituencies-paths.json"
import { buildMapData } from "@/lib/seat-encoding"
import type { Filters } from "@/lib/filters"

type Props = {
  filters: Filters
  inFilterSet: Set<number>
  /**
   * If provided, only these constituencies render with their encoded colour;
   * everything else is muted to a low-opacity neutral so Kerala's outline
   * stays legible without competing with the focused seats.
   */
  focusSeats?: Set<number>
  ariaLabel?: string
}

/**
 * Read-only AC choropleth for snippet contexts (insight cards, etc.).
 * Reuses the same encoding pipeline as the live ConstituencyMap, but
 * skips hover state, click handlers, and the SeatPanel popup.
 */
export function MiniACMap({
  filters,
  inFilterSet,
  focusSeats,
  ariaLabel,
}: Props) {
  const data = useMemo(
    () => buildMapData(filters, inFilterSet),
    [filters, inFilterSet]
  )
  const fills = data.encodings

  return (
    <svg
      viewBox={`0 0 ${paths.width} ${paths.height}`}
      role="img"
      aria-label={ariaLabel ?? "Kerala constituency map"}
      className="h-auto w-full"
    >
      {paths.constituencies.map((c) => {
        const num = c.constituencyNumber
        const fill = fills.get(num) ?? {
          color: "var(--muted)",
          opacity: 0.2,
        }
        const focused = !focusSeats || focusSeats.has(num)
        return (
          <path
            key={num}
            d={c.pathD}
            fill={focused ? fill.color : "var(--muted-foreground)"}
            fillOpacity={focused ? fill.opacity : 0.08}
            stroke={focused ? "var(--foreground)" : "var(--background)"}
            strokeWidth={focused ? 0.8 : 0.4}
            strokeOpacity={focused ? 0.6 : 1}
          />
        )
      })}
    </svg>
  )
}
