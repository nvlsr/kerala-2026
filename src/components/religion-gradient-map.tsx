import paths from "@data/kerala-constituencies-paths.json"

import { ACMapZoomControls } from "@/components/charts/ac-map-zoom-controls"
import { useACMapViewport } from "@/components/charts/use-ac-map-viewport"
import { acDemo2025Meta, acDemoMeta, districtsMeta } from "@/lib/data/loaders"
import { demoMeta } from "@/lib/data/loaders"
import type { ReligionCode } from "@/lib/data/demographics"
import { cn } from "@/lib/utils"

export type GradientLevel = "district" | "ac"
export type GradientYear = 2011 | 2025

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
  /**
   * When `acValuesOverride` is supplied, ACs that are MISSING from the
   * override map render with this fill colour (instead of the default
   * "missing = 0 = faint tint" behaviour). Used by /religion-map to
   * gray out electorally-irrelevant ACs in the sub-rite section.
   */
  noDataColor?: string
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
  noDataColor,
  ariaLabel,
}: Props) {
  const acData =
    year === 2025 ? acDemo2025Meta.constituencies : acDemoMeta.constituencies
  const usingOverride = acValuesOverride != null
  // Independent zoom state per map instance — each of the 3 religion
  // maps on /religion-map can be zoomed/panned to a different region.
  // Viewport state + zoom + drag-to-pan lives in useACMapViewport.
  const vp = useACMapViewport(zoomable)
  // Anchor the gradient to the actual range of the metric so mid-share
  // ACs/districts read as mid-saturated rather than faint. For AC
  // level, we measure against the AC max (which is higher than district
  // max — extreme ACs like Vengara at 83% Muslim).
  const maxPct = usingOverride
    ? level === "ac"
      ? Math.max(...Object.values(acValuesOverride))
      : Math.max(...Object.values(districtValuesOverride ?? acValuesOverride))
    : level === "ac"
      ? Math.max(
          ...Object.values(acData).map((c) => c.religions[religion] ?? 0)
        )
      : Math.max(
          ...Object.values(demoMeta.districts).map((d) => d.religions[religion])
        )

  const interactive = onDistrictHover != null || onAcHover != null

  const svg = (
    <svg
      viewBox={vp.viewBoxAttr}
      role="img"
      aria-label={ariaLabel}
      className={cn("h-auto w-full select-none", vp.cursorClass)}
      onPointerDown={vp.onPointerDown}
      onPointerMove={vp.onPointerMove}
      onPointerUp={vp.onPointerUp}
      onPointerCancel={vp.onPointerUp}
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
        let isMissing = false
        if (usingOverride) {
          if (level === "ac") {
            const raw = acValuesOverride[String(p.constituencyNumber)]
            isMissing = raw == null
            pct = raw ?? 0
          } else {
            const raw = districtId
              ? districtValuesOverride?.[districtId]
              : undefined
            isMissing = raw == null
            pct = raw ?? 0
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
        const useNoData = usingOverride && isMissing && noDataColor != null
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
            fill={useNoData ? noDataColor : baseColor}
            fillOpacity={
              useNoData
                ? isHighlighted
                  ? 1
                  : 0.7
                : isHighlighted
                  ? Math.min(1, opacity + 0.15)
                  : opacity
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
