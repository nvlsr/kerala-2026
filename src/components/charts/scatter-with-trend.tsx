import { useMemo } from "react"
import {
  CartesianGrid,
  Line,
  ComposedChart,
  ReferenceLine,
  Scatter,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type Point = {
  x: number
  y: number
  /** AC number — used in default tooltip. */
  acNumber: number
  /** AC name — used in default tooltip. */
  acName: string
  /** Optional flag — if true, point is rendered with a stronger
   *  outline (used for outliers worth labelling). */
  highlighted?: boolean
}

type Props = {
  points: Point[]
  xLabel: string
  yLabel: string
  /** Suffix on x-axis ticks. */
  xUnit?: string
  /** Suffix on y-axis ticks. */
  yUnit?: string
  /** Decimals on x-ticks. */
  xDecimals?: number
  /** Decimals on y-ticks. */
  yDecimals?: number
  /** If true, draw a least-squares regression line. */
  showTrend?: boolean
  /** Color for normal points. */
  pointColor?: string
  /** Color for highlighted points (outliers). */
  highlightColor?: string
  /** Aria label. */
  ariaLabel: string
  className?: string
}

/**
 * Scatter plot with an optional least-squares trend line. Used for
 * gradient visualisations (e.g. Christian-share % vs UDF Δshare).
 */
export function ScatterWithTrend({
  points,
  xLabel,
  yLabel,
  xUnit = "",
  yUnit = "",
  xDecimals = 0,
  yDecimals = 1,
  showTrend = true,
  pointColor = "var(--primary)",
  highlightColor = "var(--foreground)",
  ariaLabel,
  className,
}: Props) {
  // Compute regression line endpoints if trend requested.
  const trendData = useMemo(() => {
    if (!showTrend || points.length < 2) return null
    const n = points.length
    const sumX = points.reduce((s, p) => s + p.x, 0)
    const sumY = points.reduce((s, p) => s + p.y, 0)
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0)
    const sumXX = points.reduce((s, p) => s + p.x * p.x, 0)
    const meanX = sumX / n
    const meanY = sumY / n
    const denom = sumXX - n * meanX * meanX
    if (Math.abs(denom) < 1e-9) return null
    const slope = (sumXY - n * meanX * meanY) / denom
    const intercept = meanY - slope * meanX
    const minX = Math.min(...points.map((p) => p.x))
    const maxX = Math.max(...points.map((p) => p.x))
    return [
      { x: minX, y: intercept + slope * minX },
      { x: maxX, y: intercept + slope * maxX },
    ]
  }, [points, showTrend])

  const fmtX = (v: number) => `${v.toFixed(xDecimals)}${xUnit}`
  const fmtY = (v: number) =>
    `${v >= 0 ? "+" : ""}${v.toFixed(yDecimals)}${yUnit}`

  const chartConfig: ChartConfig = {
    points: { label: "ACs", color: pointColor },
    trend: { label: "Trend", color: "var(--muted-foreground)" },
  }

  // Combine trend (as line) with points (as scatter) on a single
  // ComposedChart.
  const chartData = points.map((p) => ({ x: p.x, y: p.y, payload: p }))

  return (
    <ChartContainer
      config={chartConfig}
      className={className ?? "h-72 w-full"}
      aria-label={ariaLabel}
    >
      <ComposedChart margin={{ top: 8, right: 16, bottom: 28, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          tickLine={false}
          fontSize={11}
          tickFormatter={fmtX}
          label={{
            value: xLabel,
            position: "bottom",
            offset: 12,
            fontSize: 11,
            fill: "var(--muted-foreground)",
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          tickLine={false}
          fontSize={11}
          tickFormatter={fmtY}
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            offset: 16,
            fontSize: 11,
            fill: "var(--muted-foreground)",
          }}
        />
        <ReferenceLine
          y={0}
          stroke="var(--muted-foreground)"
          strokeOpacity={0.3}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(_value, _name, item) => {
                const p = (item.payload as { payload: Point }).payload
                return (
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{p.acName}</span>
                    <span className="font-mono text-xs">
                      {xLabel}: {fmtX(p.x)}
                    </span>
                    <span className="font-mono text-xs">
                      {yLabel}: {fmtY(p.y)}
                    </span>
                  </div>
                )
              }}
            />
          }
        />
        <Scatter
          name="points"
          data={chartData}
          shape={(props: unknown) => {
            const p = props as {
              cx: number
              cy: number
              payload: { payload: Point }
            }
            const point = p.payload.payload
            return (
              <circle
                cx={p.cx}
                cy={p.cy}
                r={point.highlighted ? 4 : 2.5}
                fill={point.highlighted ? highlightColor : pointColor}
                fillOpacity={point.highlighted ? 1 : 0.6}
                stroke={point.highlighted ? "var(--background)" : "transparent"}
                strokeWidth={point.highlighted ? 1.5 : 0}
              />
            )
          }}
        />
        {trendData && (
          <Line
            data={trendData}
            type="linear"
            dataKey="y"
            stroke="var(--muted-foreground)"
            strokeWidth={2}
            strokeDasharray="4 3"
            dot={false}
            isAnimationActive={false}
            legendType="none"
          />
        )}
      </ComposedChart>
    </ChartContainer>
  )
}
