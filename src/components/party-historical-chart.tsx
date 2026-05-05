import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  formatNumber,
  formatPercent,
  getPartyTrendData,
  type PartyTrendData,
} from "@/lib/data"

export type PartyMode = "share" | "seats" | "votes"

type Props = {
  party: string
  scope: string | null
  mode: PartyMode
}

export function PartyHistoricalChart({ party, scope, mode }: Props) {
  const trend: PartyTrendData = useMemo(
    () => getPartyTrendData(party, scope),
    [party, scope]
  )

  if (trend.years.length === 0) return null

  const chartConfig: ChartConfig = {
    [trend.party]: { label: trend.partyShort, color: trend.color },
  }

  const data = trend.points.map((p) => ({
    year: p.year,
    [trend.party]:
      mode === "share" ? p.share : mode === "seats" ? p.seats : p.votes,
  }))

  const yMax =
    mode === "share"
      ? Math.max(
          10,
          Math.ceil(Math.max(...trend.points.map((p) => p.share)) / 10) * 10
        )
      : mode === "seats"
        ? trend.totalSeats
        : Math.ceil(Math.max(...trend.points.map((p) => p.votes)) * 1.05)

  return (
    <ChartContainer config={chartConfig} className="h-44 w-full">
      <LineChart
        data={data}
        margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          type="number"
          domain={[Math.min(...trend.years), Math.max(...trend.years)]}
          ticks={trend.years}
          tickFormatter={(v) => String(v)}
          tickLine={false}
          axisLine={false}
          fontSize={11}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tickFormatter={(v) =>
            mode === "share"
              ? `${v}%`
              : mode === "votes"
                ? formatNumber(v)
                : String(v)
          }
          domain={[0, yMax]}
          allowDecimals={false}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              formatter={(value) => {
                const display =
                  mode === "share"
                    ? formatPercent((value as number) / 100, 1)
                    : mode === "seats"
                      ? `${value} seats`
                      : `${formatNumber(value as number)} votes`
                return (
                  <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: trend.color }}
                        aria-hidden
                      />
                      <span className="text-foreground/80">
                        {trend.partyShort}
                      </span>
                    </div>
                    <span className="font-medium tabular-nums">{display}</span>
                  </div>
                )
              }}
            />
          }
        />
        <Line
          dataKey={trend.party}
          type="monotone"
          stroke={trend.color}
          strokeWidth={2.5}
          dot={{ r: 4, fill: trend.color, strokeWidth: 0 }}
          activeDot={{
            r: 5,
            strokeWidth: 2,
            fill: trend.color,
            stroke: "var(--background)",
          }}
          isAnimationActive={false}
          connectNulls={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
