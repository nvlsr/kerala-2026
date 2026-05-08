import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type Props = {
  /** Raw values to bin. */
  values: number[]
  /** Bin width in value units. */
  binWidth: number
  /** Optional explicit domain (min, max). If absent, computed from data. */
  domain?: [number, number]
  /** Optional center reference line (e.g. mean = -7.43 for LDF). */
  meanLine?: number
  /** Bar fill color. */
  fill?: string
  /** Bar fill color for bins to the LEFT of `divergeAt` (when set,
   *  enables a diverging bar style — e.g. red for losses, blue for gains). */
  fillNegative?: string
  /** Threshold for diverging coloring. Bins with right-edge < this get
   *  fillNegative; others get fill. */
  divergeAt?: number
  /** X-axis suffix for ticks (e.g. "pp"). */
  xUnit?: string
  /** Decimals for tick labels. */
  xDecimals?: number
  /** Aria label for the chart. */
  ariaLabel: string
  /** Recharts container className passthrough. */
  className?: string
}

/**
 * Binned bar histogram with diverging-color support and optional
 * mean reference line. Used for distribution-shape visualisations
 * (e.g. LDF Δshare distribution showing the bell + outliers).
 */
export function Histogram({
  values,
  binWidth,
  domain,
  meanLine,
  fill = "var(--primary)",
  fillNegative,
  divergeAt,
  xUnit = "",
  xDecimals = 0,
  ariaLabel,
  className,
}: Props) {
  const data = useMemo(() => {
    if (values.length === 0) return []
    const min = domain?.[0] ?? Math.floor(Math.min(...values) / binWidth) * binWidth
    const max =
      domain?.[1] ?? Math.ceil(Math.max(...values) / binWidth) * binWidth
    const bins: { binStart: number; binEnd: number; count: number; binMid: number }[] =
      []
    for (let edge = min; edge < max; edge += binWidth) {
      bins.push({ binStart: edge, binEnd: edge + binWidth, count: 0, binMid: edge + binWidth / 2 })
    }
    for (const v of values) {
      const i = Math.floor((v - min) / binWidth)
      if (i >= 0 && i < bins.length) bins[i].count++
    }
    return bins
  }, [values, binWidth, domain])

  const chartConfig: ChartConfig = { count: { label: "ACs", color: fill } }
  const fmtTick = (n: number) =>
    `${n >= 0 && (divergeAt != null || meanLine != null) ? "+" : ""}${n.toFixed(xDecimals)}${xUnit}`

  return (
    <ChartContainer
      config={chartConfig}
      className={className ?? "h-56 w-full"}
      aria-label={ariaLabel}
    >
      <BarChart
        data={data}
        margin={{ top: 8, right: 12, bottom: 8, left: -12 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="binMid"
          type="number"
          domain={data.length > 0 ? [data[0].binStart, data[data.length - 1].binEnd] : ["auto", "auto"]}
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tickFormatter={fmtTick}
          tickCount={Math.min(data.length, 8)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          allowDecimals={false}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(_value, _name, item) => {
                const d = item.payload as {
                  binStart: number
                  binEnd: number
                  count: number
                }
                return (
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs">
                      {fmtTick(d.binStart)} to {fmtTick(d.binEnd)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {d.count} {d.count === 1 ? "AC" : "ACs"}
                    </span>
                  </div>
                )
              }}
            />
          }
        />
        {meanLine != null && (
          <ReferenceLine
            x={meanLine}
            stroke="var(--foreground)"
            strokeDasharray="2 2"
            strokeOpacity={0.5}
            label={{
              value: `mean ${fmtTick(meanLine)}`,
              position: "top",
              fontSize: 10,
              fill: "var(--muted-foreground)",
            }}
          />
        )}
        <Bar
          dataKey="count"
          fill={fill}
          radius={[3, 3, 0, 0]}
          shape={(props: unknown) => {
            const p = props as {
              x: number
              y: number
              width: number
              height: number
              payload: { binEnd: number }
            }
            const useNegative =
              fillNegative != null &&
              divergeAt != null &&
              p.payload.binEnd <= divergeAt
            return (
              <rect
                x={p.x}
                y={p.y}
                width={p.width}
                height={p.height}
                fill={useNegative ? fillNegative : fill}
                rx={3}
                ry={3}
              />
            )
          }}
        />
      </BarChart>
    </ChartContainer>
  )
}
