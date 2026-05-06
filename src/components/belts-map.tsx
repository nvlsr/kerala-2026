import paths from "@data/kerala-constituencies-paths.json"

import { constituencies } from "@/lib/data/constituencies"
import { beltForConstituency } from "@/lib/data/belts"

type Props = {
  /** If provided, only these constituencies render at full opacity; the
   *  rest are dimmed for context. Used by the per-pattern overlay maps. */
  focusSeats?: Set<number>
  /** Stroke seats in this set with a contrasting border. Used to mark
   *  drift seats on the belt baseline. */
  strokeSeats?: Set<number>
  strokeColor?: string
  ariaLabel: string
}

const CONSTITUENCY_BY_NUM = new Map(
  constituencies.map((c) => [c.constituencyNumber, c])
)

export function BeltsMap({
  focusSeats,
  strokeSeats,
  strokeColor = "var(--foreground)",
  ariaLabel,
}: Props) {
  return (
    <svg
      viewBox={`0 0 ${paths.width} ${paths.height}`}
      role="img"
      aria-label={ariaLabel}
      className="h-auto w-full"
    >
      {paths.constituencies.map((p) => {
        const num = p.constituencyNumber
        const c = CONSTITUENCY_BY_NUM.get(num)
        const belt = c ? beltForConstituency(c) : null
        const fill = belt?.color ?? "var(--muted)"
        const focused = !focusSeats || focusSeats.has(num)
        const stroked = strokeSeats?.has(num) ?? false
        return (
          <path
            key={num}
            d={p.pathD}
            fill={fill}
            fillOpacity={focused ? 0.55 : 0.12}
            stroke={stroked ? strokeColor : "var(--background)"}
            strokeWidth={stroked ? 1.4 : 0.4}
            strokeOpacity={stroked ? 0.9 : 0.6}
          />
        )
      })}
    </svg>
  )
}
