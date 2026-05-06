import paths from "@data/kerala-constituencies-paths.json"

import { districtsMeta } from "@/lib/data/loaders"
import { demoMeta } from "@/lib/data/loaders"
import type { ReligionCode } from "@/lib/data/demographics"

type Props = {
  religion: ReligionCode
  baseColor: string
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
  minOpacity = 0.1,
  maxOpacity = 0.9,
  outlinedSeats,
  outlineColor = "var(--foreground)",
  hoveredDistrictId,
  onDistrictHover,
  ariaLabel,
}: Props) {
  // Anchor the gradient to the actual range of the chosen religion so
  // mid-share districts read as mid-saturated rather than faint.
  const maxPct = Math.max(
    ...Object.values(demoMeta.districts).map((d) => d.religions[religion])
  )

  const interactive = onDistrictHover != null

  return (
    <svg
      viewBox={`0 0 ${paths.width} ${paths.height}`}
      role="img"
      aria-label={ariaLabel}
      className="h-auto w-full"
    >
      {paths.constituencies.map((p) => {
        const districtId =
          districtsMeta.constituencyToDistrict[String(p.constituencyNumber)]
        const districtMeta = districtId
          ? demoMeta.districts[districtId]
          : null
        const pct = districtMeta?.religions[religion] ?? 0
        const norm = maxPct > 0 ? pct / maxPct : 0
        const opacity = minOpacity + norm * (maxOpacity - minOpacity)
        const isInHoveredDistrict =
          hoveredDistrictId != null && hoveredDistrictId === districtId
        const isOutlined = outlinedSeats?.has(p.constituencyNumber) ?? false
        return (
          <path
            key={p.constituencyNumber}
            d={p.pathD}
            fill={baseColor}
            fillOpacity={
              isInHoveredDistrict ? Math.min(1, opacity + 0.1) : opacity
            }
            stroke={isOutlined ? outlineColor : "var(--background)"}
            strokeWidth={isOutlined ? 1.4 : 0.3}
            strokeOpacity={isOutlined ? 0.9 : 0.5}
            className={interactive ? "cursor-default" : undefined}
            onMouseEnter={
              interactive && districtId
                ? () => onDistrictHover?.(districtId)
                : undefined
            }
            onMouseLeave={
              interactive ? () => onDistrictHover?.(null) : undefined
            }
            style={isOutlined ? { pointerEvents: "none" } : undefined}
          />
        )
      })}
    </svg>
  )
}
