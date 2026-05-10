/**
 * Categorical choropleth — each AC coloured by a discrete bucket
 * (e.g. dominant Christian sub-rite). Sibling to ReligionGradientMap.
 *
 * Used on /religion-map for the dominant-sub-rite maps. Bucket → colour
 * comes from CHRISTIAN_SUBRITE_COLORS / MUSLIM_SUBRITE_COLORS in
 * walkthroughs/colors.ts; ACs missing from the value map are filled
 * with `noDataColor`.
 */
import { useRef, useState } from "react"
import { IconPlus, IconMinus, IconRefresh } from "@tabler/icons-react"
import paths from "@data/kerala-constituencies-paths.json"

import { districtsMeta } from "@/lib/data/loaders"
import { cn } from "@/lib/utils"

type ViewBox = { x: number; y: number; w: number; h: number }
const FULL_VIEW: ViewBox = { x: 0, y: 0, w: paths.width, h: paths.height }
const ZOOM_FACTOR = 1.5
const MIN_W = paths.width / 8

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
  ariaLabel: string
}

export function ReligionCategoricalMap({
  acValues,
  bucketColors,
  noDataColor,
  hoveredSeat,
  onAcHover,
  zoomable = false,
  ariaLabel,
}: Props) {
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
      nx = clamp(nx, 0, paths.width - newW)
      ny = clamp(ny, 0, paths.height - newH)
      return { x: nx, y: ny, w: newW, h: newH }
    })
  }

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!zoomable || !isZoomed) return
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

  const interactive = onAcHover != null

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
      onMouseLeave={interactive ? () => onAcHover?.(null) : undefined}
    >
      {paths.constituencies.map((p) => {
        const bucket = acValues[String(p.constituencyNumber)]
        const fill = bucket ? (bucketColors[bucket] ?? noDataColor) : noDataColor
        const isHighlighted =
          hoveredSeat != null && hoveredSeat === p.constituencyNumber
        return (
          <path
            key={p.constituencyNumber}
            d={p.pathD}
            fill={fill}
            fillOpacity={isHighlighted ? 1 : 0.85}
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
      <div className="absolute top-2 right-2 flex flex-col gap-1 rounded-md border bg-background/85 p-0.5 shadow-sm supports-backdrop-filter:backdrop-blur">
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

// districtsMeta is imported so future revisions can group ACs by district
// for legends/captions; keep the import even if not yet read.
void districtsMeta
