/**
 * Base SVG choropleth of Kerala's 140 ACs.
 *
 * Hosts the shared concerns — viewbox state, zoom controls, drag-to-pan,
 * hover propagation, SVG structure — so concrete maps focus on their
 * unique part: how each AC is filled.
 *
 * Used directly by `ReligionCategoricalMap`. `ReligionGradientMap` has
 * additional complexity (district hover, outlined-seats overlay, level
 * toggle) and shares the viewport machinery via `useACMapViewport` +
 * `ACMapZoomControls` while keeping its own SVG render.
 */
import paths from "@data/kerala-constituencies-paths.json"

import { ACMapZoomControls } from "@/components/charts/ac-map-zoom-controls"
import { useACMapViewport } from "@/components/charts/use-ac-map-viewport"
import { districtsMeta } from "@/lib/data/loaders"
import { cn } from "@/lib/utils"

export type ACStyle = {
  fill: string
  /** 0-1; defaults to 1. */
  fillOpacity?: number
}

export type GetACStyle = (args: {
  acNumber: number
  districtId: string | undefined
  isHighlighted: boolean
}) => ACStyle

type Props = {
  /** Computes the fill for each AC. */
  getStyleForAC: GetACStyle
  /** Hover state propagated by callers; null = nothing hovered. */
  hoveredSeat?: number | null
  /** Set when caller wants the base to fire hover events. */
  onAcHover?: (seat: number | null) => void
  zoomable?: boolean
  /** Optional className composed onto the <svg>. */
  className?: string
  ariaLabel: string
}

export function KeralaACMapBase({
  getStyleForAC,
  hoveredSeat,
  onAcHover,
  zoomable = false,
  className,
  ariaLabel,
}: Props) {
  const vp = useACMapViewport(zoomable)
  const interactive = onAcHover != null

  const svg = (
    <svg
      viewBox={vp.viewBoxAttr}
      role="img"
      aria-label={ariaLabel}
      className={cn("h-auto w-full select-none", vp.cursorClass, className)}
      onPointerDown={vp.onPointerDown}
      onPointerMove={vp.onPointerMove}
      onPointerUp={vp.onPointerUp}
      onPointerCancel={vp.onPointerUp}
      onMouseLeave={interactive ? () => onAcHover?.(null) : undefined}
    >
      {paths.constituencies.map((p) => {
        const districtId =
          districtsMeta.constituencyToDistrict[String(p.constituencyNumber)]
        const isHighlighted =
          hoveredSeat != null && hoveredSeat === p.constituencyNumber
        const style = getStyleForAC({
          acNumber: p.constituencyNumber,
          districtId,
          isHighlighted,
        })
        return (
          <path
            key={p.constituencyNumber}
            d={p.pathD}
            fill={style.fill}
            fillOpacity={style.fillOpacity ?? 1}
            stroke={isHighlighted ? "var(--foreground)" : "var(--background)"}
            strokeWidth={isHighlighted ? 1.0 : 0.3}
            strokeOpacity={isHighlighted ? 0.9 : 0.5}
            className={interactive ? "cursor-default" : undefined}
            onMouseEnter={
              interactive
                ? () => onAcHover?.(p.constituencyNumber)
                : undefined
            }
          />
        )
      })}
    </svg>
  )

  if (!zoomable) return svg
  return (
    <div className="relative">
      {svg}
      <ACMapZoomControls
        zoomIn={vp.zoomIn}
        zoomOut={vp.zoomOut}
        reset={vp.reset}
        zoomInDisabled={vp.zoomInDisabled}
        zoomOutDisabled={vp.zoomOutDisabled}
        resetDisabled={vp.resetDisabled}
      />
    </div>
  )
}
