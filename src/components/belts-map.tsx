import paths from "@data/kerala-constituencies-paths.json"

import { constituencies } from "@/lib/data/constituencies"
import { beltForConstituency } from "@/lib/data/belts"

type Props = {
  /** If set, only ACs assigned to this belt render at full colour;
   *  every other AC is muted to a low-opacity neutral. */
  selectedBeltId?: string | null
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
  selectedBeltId,
  focusSeats,
  strokeSeats,
  strokeColor = "var(--foreground)",
  ariaLabel,
}: Props) {
  const hasSelection = !!selectedBeltId
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

        const inSelectedBelt = !hasSelection || belt?.id === selectedBeltId
        const inFocus = !focusSeats || focusSeats.has(num)
        const visible = inSelectedBelt && inFocus

        const fill = visible ? (belt?.color ?? "var(--muted)") : "var(--muted-foreground)"
        const fillOpacity = visible ? (hasSelection ? 0.7 : 0.55) : 0.06
        const stroked = strokeSeats?.has(num) ?? false

        return (
          <path
            key={num}
            d={p.pathD}
            fill={fill}
            fillOpacity={fillOpacity}
            stroke={stroked ? strokeColor : "var(--background)"}
            strokeWidth={stroked ? 1.4 : 0.4}
            strokeOpacity={stroked ? 0.9 : 0.6}
          />
        )
      })}
    </svg>
  )
}
