/**
 * Categorical choropleth — each AC coloured by a discrete bucket
 * (e.g. dominant Christian sub-rite). Thin wrapper over
 * `KeralaACMapBase`; the base hosts viewbox + zoom + pan + SVG
 * scaffolding.
 *
 * Used on /religion-map for the dominant-sub-rite maps + on the
 * /walkthroughs index for the Christian-card thumbnail.
 */
import { KeralaACMapBase } from "@/components/charts/kerala-ac-map-base"

type Props = {
  /** ac_id (as string) → bucket key (e.g. "syro_malabar"). */
  acValues: Record<string, string>
  /** bucket key → hex colour. */
  bucketColors: Record<string, string>
  /** Colour for ACs not present in `acValues`. */
  noDataColor: string
  hoveredSeat?: number | null
  onAcHover?: (seat: number | null) => void
  zoomable?: boolean
  /** Optional className composed onto the wrapping <svg>. */
  className?: string
  ariaLabel: string
}

export function ReligionCategoricalMap({
  acValues,
  bucketColors,
  noDataColor,
  hoveredSeat,
  onAcHover,
  zoomable = false,
  className,
  ariaLabel,
}: Props) {
  return (
    <KeralaACMapBase
      getStyleForAC={({ acNumber, isHighlighted }) => {
        const bucket = acValues[String(acNumber)]
        const fill = bucket ? (bucketColors[bucket] ?? noDataColor) : noDataColor
        return { fill, fillOpacity: isHighlighted ? 1 : 0.85 }
      }}
      hoveredSeat={hoveredSeat}
      onAcHover={onAcHover}
      zoomable={zoomable}
      className={className}
      ariaLabel={ariaLabel}
    />
  )
}

/** Helper: count how many ACs are in each bucket. */
export function bucketCounts(
  acValues: Record<string, string>
): Map<string, number> {
  const m = new Map<string, number>()
  for (const v of Object.values(acValues)) {
    m.set(v, (m.get(v) ?? 0) + 1)
  }
  return m
}
