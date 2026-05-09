import { useState, type ReactNode } from "react"
import paths from "@data/kerala-constituencies-paths.json"

import { constituencies } from "@/lib/data"
import { cn } from "@/lib/utils"

type ColorScale = "diverging" | "sequential"

type Props = {
  /** AC number → numeric value mapping. Missing ACs are rendered with a
   *  neutral muted fill. */
  valueByAC: Map<number, number>
  /**
   * Color scale type:
   *  - "diverging": red ↔ neutral ↔ blue, centered on `divergingMidpoint`.
   *    Right for Δ values where positive vs negative direction matters.
   *  - "sequential": light → dark single hue. Right for absolute shares
   *    where higher = more intense.
   */
  colorScale: ColorScale
  /** Color domain. If omitted, derived from the value distribution
   *  (symmetric around 0 for diverging, [0, max] for sequential). */
  domain?: [number, number]
  /** Center point for the diverging scale. Defaults to 0. */
  divergingMidpoint?: number
  /** Hue for sequential scale. Defaults to a blue tone. */
  sequentialColor?: string
  /** Optional set of ACs to highlight with a heavier outline (e.g.
   *  the 3 BJP wins on the BJP-pocket arc page). */
  highlightSeats?: Set<number>
  /**
   * Tooltip content for the hovered AC. The default formats as
   *   "<AC name>: <value> <unit>"
   * but pages can supply a custom formatter for richer tooltips
   * (e.g. showing the 2021 → 2026 trajectory).
   */
  tooltipFormat?: (acNumber: number, value: number | null) => ReactNode
  /** Suffix appended to the value in the default tooltip. */
  unit?: string
  /** Decimals shown in the default tooltip. */
  decimals?: number
  /** Aria label for the SVG container. */
  ariaLabel: string
  /** Optional className applied to the wrapping <svg>. */
  className?: string
  /**
   * Optional viewBox override to zoom into a region (e.g. just
   * Trivandrum + Kollam districts) instead of the full state.
   * `[x, y, width, height]` in the same coordinate space as the
   * raw paths. Off-region paths still render but get clipped by
   * the SVG viewport.
   */
  viewBox?: [number, number, number, number]
}

/**
 * Diverging color scale: red (negative) ↔ neutral (zero) ↔ blue
 * (positive). Returns a CSS color string. Saturation scales with
 * |value − midpoint| / domainHalf.
 */
function divergingColor(
  value: number,
  midpoint: number,
  halfRange: number
): string {
  if (halfRange <= 0) return "rgb(229, 231, 235)" // neutral if no spread
  const normalized = Math.max(-1, Math.min(1, (value - midpoint) / halfRange))
  if (normalized === 0) return "rgb(229, 231, 235)"
  if (normalized < 0) {
    // Red side. -1 → strong red; 0 → neutral.
    const t = -normalized
    const r = Math.round(229 + (220 - 229) * t)
    const g = Math.round(231 + (38 - 231) * t)
    const b = Math.round(235 + (38 - 235) * t)
    return `rgb(${r}, ${g}, ${b})`
  }
  // Blue side. 0 → neutral; +1 → strong blue.
  const t = normalized
  const r = Math.round(229 + (29 - 229) * t)
  const g = Math.round(231 + (78 - 231) * t)
  const b = Math.round(235 + (216 - 235) * t)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Sequential color scale: light → dark in a single hue. Returns
 * an opacity that the consumer applies to the hue color.
 */
function sequentialOpacity(
  value: number,
  min: number,
  max: number
): number {
  if (max <= min) return 0
  const t = (value - min) / (max - min)
  return Math.max(0, Math.min(1, t)) * 0.85 + 0.15 // floor at 0.15 so paths stay visible
}

const acByNumber = new Map(
  constituencies.map((c) => [c.constituencyNumber, c])
)

/**
 * Reusable choropleth map of Kerala's 140 ACs. Used across the
 * /narratives surface (each arc page wires its own data + color
 * scale). Hover shows a tooltip; supports an optional set of ACs
 * to outline as highlights.
 *
 * Built per docs/narratives-publish-plan.md Phase 3.
 */
export function ChoroplethMap({
  valueByAC,
  colorScale,
  domain,
  divergingMidpoint = 0,
  sequentialColor = "#1F77B4",
  highlightSeats,
  tooltipFormat,
  unit = "",
  decimals = 1,
  ariaLabel,
  className,
  viewBox,
}: Props) {
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null)

  // Derive domain if not provided.
  const values = Array.from(valueByAC.values()).filter((v) => Number.isFinite(v))
  let dMin: number, dMax: number
  if (domain) {
    ;[dMin, dMax] = domain
  } else if (colorScale === "diverging") {
    const absMax = Math.max(
      ...values.map((v) => Math.abs(v - divergingMidpoint))
    )
    dMin = divergingMidpoint - absMax
    dMax = divergingMidpoint + absMax
  } else {
    dMin = Math.min(0, ...values)
    dMax = Math.max(0, ...values)
  }
  const halfRange =
    colorScale === "diverging"
      ? Math.max(Math.abs(dMax - divergingMidpoint), Math.abs(dMin - divergingMidpoint))
      : 0

  const hoveredAC = hoveredSeat != null ? acByNumber.get(hoveredSeat) : null
  const hoveredValue =
    hoveredSeat != null ? (valueByAC.get(hoveredSeat) ?? null) : null

  const defaultFormat = (acNum: number, value: number | null): ReactNode => {
    const ac = acByNumber.get(acNum)
    return (
      <span>
        <span className="font-medium">{ac?.constituencyName ?? `AC ${acNum}`}</span>
        {value != null ? (
          <>
            : <span className="font-mono">
              {value >= 0 && colorScale === "diverging" ? "+" : ""}
              {value.toFixed(decimals)}{unit}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground"> · no data</span>
        )}
      </span>
    )
  }

  return (
    <div className="relative">
      <svg
        viewBox={
          viewBox
            ? `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`
            : `0 0 ${paths.width} ${paths.height}`
        }
        className={cn("h-auto w-full", className)}
        role="img"
        aria-label={ariaLabel}
      >
        <g
          onMouseLeave={() => setHoveredSeat(null)}
        >
          {paths.constituencies.map((p) => {
            const acNum = p.constituencyNumber
            const value = valueByAC.get(acNum)
            const hasValue = value != null && Number.isFinite(value)
            const isHovered = hoveredSeat === acNum
            const isHighlighted = highlightSeats?.has(acNum) ?? false

            let fill: string
            let fillOpacity: number = 1
            if (!hasValue) {
              fill = "var(--muted)"
              fillOpacity = 0.4
            } else if (colorScale === "diverging") {
              fill = divergingColor(value, divergingMidpoint, halfRange)
            } else {
              fill = sequentialColor
              fillOpacity = sequentialOpacity(value, dMin, dMax)
            }

            return (
              <path
                key={acNum}
                d={p.pathD}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke={
                  isHighlighted
                    ? "var(--foreground)"
                    : isHovered
                      ? "var(--foreground)"
                      : "var(--background)"
                }
                strokeWidth={isHighlighted ? 1.5 : isHovered ? 1.2 : 0.5}
                style={{ cursor: "default" }}
                onMouseEnter={() => setHoveredSeat(acNum)}
              />
            )
          })}
        </g>
      </svg>
      {hoveredSeat != null && hoveredAC && (
        <div
          className={cn(
            "pointer-events-none absolute right-2 bottom-2 z-10",
            "rounded-md border bg-background/95 px-3 py-1.5 text-xs shadow-md",
            "supports-backdrop-filter:bg-background/80 supports-backdrop-filter:backdrop-blur"
          )}
        >
          {(tooltipFormat ?? defaultFormat)(hoveredSeat, hoveredValue)}
        </div>
      )}
    </div>
  )
}
