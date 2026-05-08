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

type CategoryRow = {
  /** Category label for the x-axis. */
  category: string
  /** Positive component of the stack. */
  positive: number
  /** Negative component of the stack (rendered as a downward bar). */
  negative: number
}

type Props = {
  rows: CategoryRow[]
  positiveLabel: string
  negativeLabel: string
  positiveColor?: string
  negativeColor?: string
  yUnit?: string
  yDecimals?: number
  ariaLabel: string
  className?: string
}

/**
 * Stacked bar chart showing positive + negative components per
 * category. Used for the BJP-pocket arc page (gains vs cessions
 * by district, with each district showing both its sum-of-positive
 * Δs and sum-of-negative Δs).
 */
export function StackedBarByCategory({
  rows,
  positiveLabel,
  negativeLabel,
  positiveColor = "rgb(29, 78, 216)",
  negativeColor = "rgb(220, 38, 38)",
  yUnit = "",
  yDecimals = 1,
  ariaLabel,
  className,
}: Props) {
  const chartConfig: ChartConfig = {
    positive: { label: positiveLabel, color: positiveColor },
    negative: { label: negativeLabel, color: negativeColor },
  }
  const fmtY = (v: number) =>
    `${v >= 0 ? "+" : ""}${v.toFixed(yDecimals)}${yUnit}`

  return (
    <ChartContainer
      config={chartConfig}
      className={className ?? "h-72 w-full"}
      aria-label={ariaLabel}
    >
      <BarChart
        data={rows}
        margin={{ top: 8, right: 12, bottom: 36, left: -8 }}
        stackOffset="sign"
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="category"
          tickLine={false}
          axisLine={false}
          fontSize={10}
          angle={-30}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tickFormatter={fmtY}
        />
        <ReferenceLine y={0} stroke="var(--foreground)" strokeOpacity={0.4} />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", fillOpacity: 0.2 }}
          content={
            <ChartTooltipContent
              indicator="dot"
              formatter={(_value, name, item) => {
                const r = item.payload as CategoryRow
                if (name === "positive") {
                  return (
                    <>
                      <span className="text-xs text-muted-foreground">{positiveLabel}: </span>
                      <span className="font-mono text-xs">{fmtY(r.positive)}</span>
                    </>
                  )
                }
                return (
                  <>
                    <span className="text-xs text-muted-foreground">{negativeLabel}: </span>
                    <span className="font-mono text-xs">{fmtY(r.negative)}</span>
                  </>
                )
              }}
            />
          }
        />
        <Bar dataKey="positive" stackId="a" fill={positiveColor} radius={[3, 3, 0, 0]} />
        <Bar dataKey="negative" stackId="a" fill={negativeColor} radius={[0, 0, 3, 3]} />
      </BarChart>
    </ChartContainer>
  )
}
