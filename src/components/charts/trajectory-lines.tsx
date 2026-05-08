import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export type TrajectorySeries = {
  /** Series label (e.g. "POONJAR (P.C. George)"). */
  label: string
  /** Line color. */
  color: string
  /** Stroke style — "solid" or "dashed". Used to differentiate
   *  contest-entry vs organic on the BJP-pocket arc. */
  strokeStyle?: "solid" | "dashed"
  /** Y-values per cycle. Length must match `cycles`. */
  values: (number | null)[]
}

type Props = {
  /** Cycle years on the x-axis (e.g. [2016, 2021, 2026]). */
  cycles: number[]
  /** Series to plot. */
  series: TrajectorySeries[]
  /** Optional explicit y-domain. */
  yDomain?: [number, number]
  yUnit?: string
  yDecimals?: number
  ariaLabel: string
  className?: string
}

/**
 * Multi-line trajectory chart showing 2-N values per cycle for each
 * series. Used for the BJP-pocket arc to show 2016 → 2021 → 2026
 * BJP party-share trajectories per AC, color-coded by contest-entry
 * vs organic.
 */
export function TrajectoryLines({
  cycles,
  series,
  yDomain,
  yUnit = "",
  yDecimals = 1,
  ariaLabel,
  className,
}: Props) {
  const chartConfig: ChartConfig = Object.fromEntries(
    series.map((s) => [s.label, { label: s.label, color: s.color }])
  )

  // Reshape: cycles array → rows of {cycle, [series.label]: value}
  const data = cycles.map((cycle, i) => {
    const row: Record<string, number | null | string> = { cycle }
    for (const s of series) {
      row[s.label] = s.values[i] ?? null
    }
    return row
  })

  const fmtY = (v: number) => `${v.toFixed(yDecimals)}${yUnit}`

  return (
    <ChartContainer
      config={chartConfig}
      className={className ?? "h-72 w-full"}
      aria-label={ariaLabel}
    >
      <LineChart
        data={data}
        margin={{ top: 8, right: 24, bottom: 8, left: -8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="cycle"
          type="number"
          domain={[Math.min(...cycles), Math.max(...cycles)]}
          ticks={cycles}
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tickFormatter={(v) => String(v)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tickFormatter={fmtY}
          domain={yDomain}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }}
          content={
            <ChartTooltipContent
              indicator="line"
              formatter={(value, name) => {
                if (value == null) return null
                return (
                  <>
                    <span className="text-xs text-muted-foreground">
                      {String(name)}:{" "}
                    </span>
                    <span className="font-mono text-xs">
                      {fmtY(Number(value))}
                    </span>
                  </>
                )
              }}
            />
          }
        />
        {series.map((s) => (
          <Line
            key={s.label}
            type="linear"
            dataKey={s.label}
            stroke={s.color}
            strokeWidth={2}
            strokeDasharray={s.strokeStyle === "dashed" ? "4 3" : undefined}
            dot={{ r: 2.5, fill: s.color }}
            activeDot={{ r: 4 }}
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}
