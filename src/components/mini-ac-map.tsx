import { useMemo } from "react"

import paths from "@data/kerala-constituencies-paths.json"
import { buildMapData } from "@/lib/seat-encoding"
import type { Filters } from "@/lib/filters"

type Props = {
  filters: Filters
  inFilterSet: Set<number>
  ariaLabel?: string
}

/**
 * Read-only AC choropleth for snippet contexts (insight cards, etc.).
 * Reuses the same encoding pipeline as the live ConstituencyMap, but
 * skips hover state, click handlers, and the SeatPanel popup.
 */
export function MiniACMap({ filters, inFilterSet, ariaLabel }: Props) {
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
        return (
          <path
            key={num}
            d={c.pathD}
            fill={fill.color}
            fillOpacity={fill.opacity}
            stroke="var(--background)"
            strokeWidth={0.4}
          />
        )
      })}
    </svg>
  )
}
