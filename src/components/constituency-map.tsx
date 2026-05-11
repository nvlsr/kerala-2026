import { useMemo } from "react"

import { acPaths as paths } from "@/lib/data/maps"
import {
  buildMapData,
  NEGATIVE_HUE,
  POSITIVE_HUE,
  type EncodingMode,
} from "@/lib/seat-encoding"
import type { Filters } from "@/lib/filters"
import { getAlliance, MAIN_FRONT_CODES } from "@/lib/data"
import { displayConstituencyName } from "@/lib/data/format"

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
          const name = displayConstituencyName(num)
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
              aria-label={`${name} (${num})`}
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
              stroke={isSelected ? "var(--foreground)" : "var(--border)"}
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
              <title>{name}</title>
            </path>
          )
        })}
      </svg>
    </div>
  )
}

/**
 * Empty-state hint shown in the detail column when no seat is
 * selected. Explains the map's encoding and prompts the user to
 * click a polygon. Follows the standard data-viz legend convention:
 * a small swatch on the left demonstrates the color; the text
 * after it describes what that color means in plain readable text.
 *
 * Alliance mode is a special case — UDF / LDF / NDA are entity
 * labels (not color names), so they're rendered in their alliance
 * color (consistent with how political maps usually work).
 */
export function Hint({ mode }: { mode: EncodingMode }) {
  return (
    <div className="min-h-[12rem] rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
      <div className="mb-3 font-medium tracking-wide text-foreground/70 uppercase">
        Hover or click a seat
      </div>
      <ul className="space-y-1.5">
        {mode === "diverging" && (
          <>
            <SwatchRow color={POSITIVE_HUE}>Gain over 2021</SwatchRow>
            <SwatchRow color={NEGATIVE_HUE}>Loss vs 2021</SwatchRow>
            <li className="text-muted-foreground/80">
              Darker shades = larger swing
            </li>
          </>
        )}
        {mode === "alliance" && (
          <>
            {MAIN_FRONT_CODES.map((code) => {
              const a = getAlliance(code)
              return (
                <li key={code} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: a.color }}
                    aria-hidden
                  />
                  <span className="font-medium" style={{ color: a.color }}>
                    {a.code}
                  </span>
                  <span className="text-muted-foreground/80">— {a.name}</span>
                </li>
              )
            })}
            <li className="text-muted-foreground/80">
              Darker shades = bigger value on the active sort
            </li>
          </>
        )}
        {mode === "magnitude" && (
          <li className="text-muted-foreground/80">
            Darker shades = higher values on the active sort
          </li>
        )}
        <li className="text-muted-foreground/80">Out-of-filter seats fade</li>
      </ul>
    </div>
  )
}

/** Standard swatch + plain-text legend row. Color is conveyed by
 *  the swatch only — the text is in normal foreground for
 *  readability. */
function SwatchRow({
  color,
  children,
}: {
  color: string
  children: React.ReactNode
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-sm"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="text-foreground/80">{children}</span>
    </li>
  )
}
