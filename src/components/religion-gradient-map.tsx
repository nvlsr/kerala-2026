import paths from "@data/kerala-districts-paths.json"
import acPaths from "@data/kerala-constituencies-paths.json"

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
   *  /flows to show which flow-pattern seats sit on the religion gradient.
   *  Each set gets a different stroke colour. */
  outlinedSeats?: Set<number>
  outlineColor?: string
  /** Hovered district id, propagated from the parent so all three maps on
   *  /religion-map can highlight the same district in sync. */
  hoveredDistrictId?: string | null
  onDistrictHover?: (id: string | null) => void
  ariaLabel: string
  /** Compact mode: smaller stroke, no hover affordance. Used inside /flows
   *  pattern blocks where the map is just informational. */
  compact?: boolean
}

/**
 * Renders Kerala as a district choropleth shaded by one religion's
 * percentage share (per 2011 census). Optionally overlays AC outlines
 * for a list of seats — letting consumers (e.g. /flows) show "this
 * pattern's seats sit on top of these religion-share gradients".
 *
 * District-level: religion data only exists at sub-district / district
 * level in the public census. AC granularity isn't available; consumers
 * should treat all ACs in the same district as having the same religion
 * mix when reading the gradient.
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
  compact = false,
}: Props) {
  // Find the maximum percentage for this religion across districts so the
  // gradient anchors to the actual range, not 0-100% (which would make
  // most districts appear faint for a religion that never crosses 50%).
  const maxPct = Math.max(
    ...Object.values(demoMeta.districts).map((d) => d.religions[religion])
  )

  const interactive = !compact && onDistrictHover != null

  return (
    <svg
      viewBox={`0 0 ${paths.width} ${paths.height}`}
      role="img"
      aria-label={ariaLabel}
      className="h-auto w-full"
    >
      {/* District shading layer */}
      {paths.districts.map((d) => {
        const districtMeta = demoMeta.districts[d.id]
        const pct = districtMeta?.religions[religion] ?? 0
        // Linear scale from minOpacity (lowest %) to maxOpacity (highest %)
        const norm = maxPct > 0 ? pct / maxPct : 0
        const opacity = minOpacity + norm * (maxOpacity - minOpacity)
        const isHovered = hoveredDistrictId === d.id
        return (
          <path
            key={`d-${d.id}`}
            d={d.pathD}
            fill={baseColor}
            fillOpacity={isHovered ? Math.min(1, opacity + 0.1) : opacity}
            stroke="var(--background)"
            strokeWidth={compact ? 0.6 : 1}
            strokeOpacity={0.7}
            className={interactive ? "cursor-default" : undefined}
            onMouseEnter={
              interactive ? () => onDistrictHover?.(d.id) : undefined
            }
            onMouseLeave={
              interactive ? () => onDistrictHover?.(null) : undefined
            }
          />
        )
      })}
      {/* Optional AC outline overlay layer */}
      {outlinedSeats &&
        acPaths.constituencies
          .filter((p) => outlinedSeats.has(p.constituencyNumber))
          .map((p) => (
            // Only outline; no fill — the religion gradient underneath
            // shows through.
            <path
              key={`ac-${p.constituencyNumber}`}
              d={p.pathD}
              fill="none"
              stroke={outlineColor}
              strokeWidth={1.4}
              strokeOpacity={0.9}
              style={{ pointerEvents: "none" }}
            />
          ))}
    </svg>
  )
}
