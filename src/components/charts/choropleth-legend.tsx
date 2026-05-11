import { cn } from "@/lib/utils"

type ColorScale = "diverging" | "sequential"

type Props = {
  colorScale: ColorScale
  /** Min and max of the data domain. */
  domain: readonly [number, number]
  /** Sequential single-hue color. */
  sequentialColor?: string
  /** Suffix on the labels. E.g. "pp" for percentage points. */
  unit?: string
  /** Decimals shown on the labels. */
  decimals?: number
  className?: string
}

/**
 * Small horizontal color-bar legend companion to ChoroplethMap.
 * Displays the color → value mapping with min / midpoint / max
 * labels.
 */
export function ChoroplethLegend({
  colorScale,
  domain,
  sequentialColor = "#1F77B4",
  unit = "",
  decimals = 1,
  className,
}: Props) {
  const [min, max] = domain
  const formatNum = (n: number) =>
    `${n >= 0 && colorScale === "diverging" ? "+" : ""}${n.toFixed(decimals)}${unit}`

  if (colorScale === "diverging") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-[11px] text-muted-foreground",
          className
        )}
        role="img"
        aria-label={`Legend: diverging color scale from ${formatNum(min)} to ${formatNum(max)}`}
      >
        <span className="font-mono">{formatNum(min)}</span>
        <div
          className="h-2 flex-1 rounded-sm"
          style={{
            background:
              "linear-gradient(to right, rgb(220, 38, 38), rgb(229, 231, 235), rgb(29, 78, 216))",
          }}
        />
        <span className="font-mono">{formatNum(max)}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[11px] text-muted-foreground",
        className
      )}
      role="img"
      aria-label={`Legend: sequential color scale from ${formatNum(min)} to ${formatNum(max)}`}
    >
      <span className="font-mono">{formatNum(min)}</span>
      <div
        className="h-2 flex-1 rounded-sm"
        style={{
          background: `linear-gradient(to right, color-mix(in srgb, ${sequentialColor} 15%, transparent), ${sequentialColor})`,
        }}
      />
      <span className="font-mono">{formatNum(max)}</span>
    </div>
  )
}
