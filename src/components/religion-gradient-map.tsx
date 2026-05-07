import { useRef, useState } from "react"
import { IconPlus, IconMinus, IconRefresh } from "@tabler/icons-react"
import paths from "@data/kerala-constituencies-paths.json"

import { acDemo2025Meta, acDemoMeta, districtsMeta } from "@/lib/data/loaders"
import { demoMeta } from "@/lib/data/loaders"
import type { ReligionCode } from "@/lib/data/demographics"
import { cn } from "@/lib/utils"

export type GradientLevel = "district" | "ac"
export type GradientYear = 2011 | 2025

type ViewBox = { x: number; y: number; w: number; h: number }
const FULL_VIEW: ViewBox = { x: 0, y: 0, w: paths.width, h: paths.height }
const ZOOM_FACTOR = 1.5
const MIN_W = paths.width / 8 // max zoom = 8×

type Props = {
  religion: ReligionCode
  baseColor: string
  /**
   * "district" — every AC inherits its district's religion share.
   *              Coarser, but uniform across the whole district.
   * "ac"       — each AC carries its own share (114 ACs at SHRUG +
   *              Census aggregation; 26 urban-heavy ACs fall back to
   *              district-URBAN). Higher resolution; reveals
   *              within-district variation (Pala vs rural Kottayam).
   */
  level?: GradientLevel
  /**
   * 2011 — Census 2011 baseline (default).
   * 2025 — state-level uniform projection of 2011 (Hindu × 0.96,
   *         Muslim × 1.12, Christian × 0.97). District-specific
   *         drift is NOT modelled. Visualisation only.
   * Only consulted when `level === "ac"` — district-level data
   * (demoMeta) doesn't have a 2025 counterpart yet.
   */
  year?: GradientYear
  /** Min opacity floor for districts with very low % of this religion. Keeps
   *  outlines visible without making low-share districts invisible. */
  minOpacity?: number
  /** Max opacity ceiling — applied to whichever district has the highest %.
   *  Other districts scale linearly to maxOpacity * (district_pct / max_pct). */
  maxOpacity?: number
  /** ACs to outline as an overlay layer on top of district shading. Used by
   *  /flows to show which flow-pattern seats sit on the religion gradient. */
  outlinedSeats?: Set<number>
  outlineColor?: string
  /** Hovered district id, propagated from the parent so all three maps on
   *  /religion-map can highlight the same district in sync. */
  hoveredDistrictId?: string | null
  onDistrictHover?: (id: string | null) => void
  /** Hovered AC number; like hoveredDistrictId but for level="ac" mode where
   *  highlighting tracks individual seats rather than whole districts. */
  hoveredSeat?: number | null
  onAcHover?: (seat: number | null) => void
  /** When true, render zoom +/- and reset controls + drag-to-pan when zoomed.
   *  Default false so other pages (/flows, /drifts) get a static map. */
  zoomable?: boolean
  /**
   * If supplied, the component uses these per-AC values instead of
   * the religion-based lookup. Lets non-religion gradients (e.g.
   * Hindu sub-community shares like Nair, Ezhava) reuse this
   * component's hover/zoom/pan/highlight machinery without
   * duplicating it. Map keys are AC numbers as strings; values are
   * percent (0-100) of total population.
   */
  acValuesOverride?: Record<string, number>
  /**
   * District-level value overrides. Used when `level === "district"`
   * and `acValuesOverride` is provided. Map keys are district ids
   * (matching `data/districts.json`), values are 0-100 percent.
   */
  districtValuesOverride?: Record<string, number>
  ariaLabel: string
}

/**
 * Renders Kerala as an AC-level shape grid where each AC is shaded by
 * its DISTRICT's percentage of the chosen religion. Adjacent ACs in
 * the same district receive identical colours, so the visual reads as
 * a district choropleth — but every shape is in the AC coordinate
 * system, which means the optional `outlinedSeats` overlay aligns
 * perfectly with the underlying gradient (no coord mismatch between
 * district paths and AC outlines).
 *
 * Religion data is at district granularity in the public census; AC
 * granularity isn't available. All ACs in the same district share
 * the same gradient cell.
 */
export function ReligionGradientMap({
  religion,
  baseColor,
  level = "district",
  year = 2011,
  minOpacity = 0.1,
  maxOpacity = 0.9,
  outlinedSeats,
  outlineColor = "var(--foreground)",
  hoveredDistrictId,
  onDistrictHover,
  hoveredSeat,
  onAcHover,
  zoomable = false,
  acValuesOverride,
  districtValuesOverride,
  ariaLabel,
}: Props) {
  const acData =
    year === 2025 ? acDemo2025Meta.constituencies : acDemoMeta.constituencies
  const usingOverride = acValuesOverride != null
  // Independent zoom state per map instance — each of the 3 religion
  // maps on /religion-map can be zoomed/panned to a different region.
  // Stored as a viewBox so the SVG natively renders at any zoom.
  const [viewBox, setViewBox] = useState<ViewBox>(FULL_VIEW)
  const isZoomed = viewBox.w < paths.width
  const dragRef = useRef<{
    startClientX: number
    startClientY: number
    startVbX: number
    startVbY: number
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const zoomBy = (factor: number) => {
    setViewBox((v) => {
      const newW = clamp(v.w * factor, MIN_W, paths.width)
      const newH = (newW / paths.width) * paths.height
      const cx = v.x + v.w / 2
      const cy = v.y + v.h / 2
      let nx = cx - newW / 2
      let ny = cy - newH / 2
      // Clamp so we never pan beyond the map's bounds
      nx = clamp(nx, 0, paths.width - newW)
      ny = clamp(ny, 0, paths.height - newH)
      return { x: nx, y: ny, w: newW, h: newH }
    })
  }

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!zoomable || !isZoomed) return
    // Don't start a drag from a button click etc.; only the SVG body itself
    if ((e.target as Element).tagName === "BUTTON") return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startVbX: viewBox.x,
      startVbY: viewBox.y,
    }
    setIsDragging(true)
  }
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const dx =
      ((e.clientX - dragRef.current.startClientX) / rect.width) * viewBox.w
    const dy =
      ((e.clientY - dragRef.current.startClientY) / rect.height) * viewBox.h
    setViewBox((v) => ({
      ...v,
      x: clamp(dragRef.current!.startVbX - dx, 0, paths.width - v.w),
      y: clamp(dragRef.current!.startVbY - dy, 0, paths.height - v.h),
    }))
  }
  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    dragRef.current = null
    setIsDragging(false)
  }
  // Anchor the gradient to the actual range of the metric so mid-share
  // ACs/districts read as mid-saturated rather than faint. For AC
  // level, we measure against the AC max (which is higher than district
  // max — extreme ACs like Vengara at 83% Muslim).
  const maxPct = usingOverride
    ? level === "ac"
      ? Math.max(...Object.values(acValuesOverride))
      : Math.max(
          ...Object.values(districtValuesOverride ?? acValuesOverride)
        )
    : level === "ac"
      ? Math.max(
          ...Object.values(acData).map(
            (c) => c.religions[religion] ?? 0
          )
        )
      : Math.max(
          ...Object.values(demoMeta.districts).map((d) => d.religions[religion])
        )

  const interactive = onDistrictHover != null || onAcHover != null

  const svg = (
    <svg
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "h-auto w-full select-none",
        zoomable && isZoomed
          ? isDragging
            ? "cursor-grabbing"
            : "cursor-grab"
          : ""
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      // Clear hover state ONLY when cursor leaves the whole SVG.
      // Moving between adjacent path elements would otherwise fire each
      // path's own mouseLeave on its way to the next path's mouseEnter,
      // creating a brief "no hover" frame that flickers as a stutter.
      onMouseLeave={
        interactive
          ? () => {
              onAcHover?.(null)
              onDistrictHover?.(null)
            }
          : undefined
      }
    >
      {paths.constituencies.map((p) => {
        const districtId =
          districtsMeta.constituencyToDistrict[String(p.constituencyNumber)]
        let pct = 0
        if (usingOverride) {
          if (level === "ac") {
            pct = acValuesOverride[String(p.constituencyNumber)] ?? 0
          } else {
            pct = districtId
              ? (districtValuesOverride?.[districtId] ?? 0)
              : 0
          }
        } else if (level === "ac") {
          const ac = acData[String(p.constituencyNumber)]
          pct = ac?.religions[religion] ?? 0
        } else {
          const districtMeta = districtId
            ? demoMeta.districts[districtId]
            : null
          pct = districtMeta?.religions[religion] ?? 0
        }
        const norm = maxPct > 0 ? pct / maxPct : 0
        const opacity = minOpacity + norm * (maxOpacity - minOpacity)
        // Highlight rules:
        //   level="ac"      → individual AC under cursor lights up
        //   level="district" → all ACs in the hovered district light up
        const isHighlighted =
          level === "ac"
            ? hoveredSeat != null && hoveredSeat === p.constituencyNumber
            : hoveredDistrictId != null && hoveredDistrictId === districtId
        const isOutlined = outlinedSeats?.has(p.constituencyNumber) ?? false
        return (
          <path
            key={p.constituencyNumber}
            d={p.pathD}
            fill={baseColor}
            fillOpacity={
              isHighlighted ? Math.min(1, opacity + 0.15) : opacity
            }
            stroke={
              isOutlined
                ? outlineColor
                : isHighlighted
                  ? "var(--foreground)"
                  : "var(--background)"
            }
            strokeWidth={isOutlined ? 1.4 : isHighlighted ? 1.0 : 0.3}
            strokeOpacity={isOutlined ? 0.9 : isHighlighted ? 0.9 : 0.5}
            className={interactive ? "cursor-default" : undefined}
            onMouseEnter={
              interactive
                ? () => {
                    if (level === "ac") onAcHover?.(p.constituencyNumber)
                    if (districtId) onDistrictHover?.(districtId)
                  }
                : undefined
            }
            style={isOutlined ? { pointerEvents: "none" } : undefined}
          />
        )
      })}
    </svg>
  )

  if (!zoomable) return svg

  // Zoomable wrapper: relative container with absolute-positioned controls
  return (
    <div className="relative">
      {svg}
      <div className="absolute right-2 top-2 flex flex-col gap-1 rounded-md border bg-background/85 p-0.5 shadow-sm supports-backdrop-filter:backdrop-blur">
        <button
          type="button"
          onClick={() => zoomBy(1 / ZOOM_FACTOR)}
          disabled={viewBox.w <= MIN_W}
          aria-label="Zoom in"
          className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconPlus className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => zoomBy(ZOOM_FACTOR)}
          disabled={!isZoomed}
          aria-label="Zoom out"
          className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconMinus className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setViewBox(FULL_VIEW)}
          disabled={!isZoomed}
          aria-label="Reset zoom"
          className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconRefresh className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  )
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
