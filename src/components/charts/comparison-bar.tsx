import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

type Group = {
  /** Group name for the x-axis tick. */
  label: string
  /** Group's mean value (the bar height). */
  mean: number
  /** Number of observations in the group. Shown in tooltip. */
  n: number
  /** Bar color override; falls back to default. */
  color?: string
  /** Optional sublabel shown beneath the group label (e.g. "n=21"). */
  sublabel?: string
}

type Props = {
  groups: Group[]
  /** Optional baseline value to draw as a horizontal reference line. */
  baseline?: number
  /** Label for the baseline. */
  baselineLabel?: string
  /** Y-axis unit suffix. */
  yUnit?: string
  /** Y-axis decimals. */
  yDecimals?: number
  /** Aria label. */
  ariaLabel: string
  /** Optional explicit y-domain. */
  yDomain?: [number, number]
  className?: string
}

/**
 * Small bar chart comparing 2-N group means. Used for
 * treatment-vs-control comparisons (e.g. ministers vs non-minister
 * incumbents; Sabarimala-route vs matched-Hindu-controls).
 */
export function ComparisonBar({
  groups,
  baseline,
  baselineLabel,
  yUnit = "",
  yDecimals = 1,
  ariaLabel,
  yDomain,
  className,
}: Props) {
  const chartConfig: ChartConfig = { mean: { label: "Mean" } }
  const fmtY = (v: number) =>
    `${v >= 0 ? "+" : ""}${v.toFixed(yDecimals)}${yUnit}`

  return (
    <ChartContainer
      config={chartConfig}
      className={className ?? "h-56 w-full"}
      aria-label={ariaLabel}
    >
      <BarChart
        data={groups}
        margin={{ top: 14, right: 12, bottom: 8, left: -8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          fontSize={11}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tickFormatter={fmtY}
          domain={yDomain}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(_value, _name, item) => {
                const g = item.payload as Group
                return (
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{g.label}</span>
                    <span className="font-mono text-xs">{fmtY(g.mean)}</span>
                    <span className="text-[11px] text-muted-foreground">
                      n = {g.n}
                    </span>
                  </div>
                )
              }}
            />
          }
        />
        {baseline != null && (
          <ReferenceLine
            y={baseline}
            stroke="var(--foreground)"
            strokeDasharray="2 2"
            strokeOpacity={0.5}
            label={
              baselineLabel
                ? {
                    value: baselineLabel,
                    position: "right",
                    fontSize: 10,
                    fill: "var(--muted-foreground)",
                  }
                : undefined
            }
          />
        )}
        <Bar dataKey="mean" radius={[4, 4, 0, 0]}>
          {groups.map((g, i) => (
            <Cell key={i} fill={g.color ?? "var(--primary)"} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
