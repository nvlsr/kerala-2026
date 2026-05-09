import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatNumber, formatPercent, getPartyTrendData } from "@/lib/data"

export type PartyMode = "share" | "seats" | "votes"

type Props = {
  /** All parties to render as overlaid lines. */
  parties: string[]
  /** Optional emphasis: this line gets full opacity + thicker stroke,
   *  others dim. When null, all lines render equally. */
  selected: string | null
  scope: string | null
  mode: PartyMode
}

/**
 * Multi-line historical chart for a set of parties (typically all the
 * constituent parties of an alliance). Mirrors `AllianceHistoricalChart`'s
 * emphasis pattern: when `selected` is set, that party's line is
 * highlighted and others dim; when null, every line renders equally so
 * the chart functions as an "alliance family" overview.
 */
export function PartyHistoricalChart({
  parties,
  selected,
  scope,
  mode,
}: Props) {
  const trends = useMemo(
    () => parties.map((p) => getPartyTrendData(p, scope)),
    [parties, scope]
  )

  if (trends.length === 0 || trends.every((t) => t.years.length === 0)) {
    return null
  }

  // Union of years across all party trends, sorted ascending. (Some
  // smaller parties may have gaps, e.g., didn't contest in 2011.)
  const years = Array.from(new Set(trends.flatMap((t) => t.years))).sort(
    (a, b) => a - b
  )

  const chartConfig: ChartConfig = Object.fromEntries(
    trends.map((t) => [t.party, { label: t.partyShort, color: t.color }])
  )

  const data = years.map((year) => {
    const point: Record<string, number | string> = { year }
    for (const t of trends) {
      const idx = t.years.indexOf(year)
      if (idx < 0) continue
      const p = t.points[idx]
      point[t.party] =
        mode === "share" ? p.share : mode === "seats" ? p.seats : p.votes
    }
    return point
  })

  const allValues = trends.flatMap((t) =>
    t.points.map((p) =>
      mode === "share" ? p.share : mode === "seats" ? p.seats : p.votes
    )
  )
  const yMax =
    mode === "share"
      ? Math.max(10, Math.ceil(Math.max(...allValues) / 10) * 10)
      : mode === "seats"
        ? Math.max(...trends.map((t) => t.totalSeats))
        : Math.ceil(Math.max(...allValues) * 1.05)

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
          domain={[Math.min(...years), Math.max(...years)]}
          ticks={years}
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
              formatter={(value, _name, item) => {
                const partyKey = item.dataKey as string
                const trend = trends.find((t) => t.party === partyKey)
                if (!trend) return null
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
        {trends.map((t) => {
          const noSelection = selected === null
          const isSelected = t.party === selected
          const dimmed = !noSelection && !isSelected
          return (
            <Line
              key={t.party}
              dataKey={t.party}
              type="monotone"
              stroke={t.color}
              strokeWidth={isSelected ? 3 : 2}
              strokeOpacity={dimmed ? 0.35 : 1}
              dot={{
                r: isSelected ? 4 : 3,
                fill: t.color,
                strokeWidth: 0,
                opacity: dimmed ? 0.4 : 1,
              }}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: t.color,
                stroke: "var(--background)",
              }}
              isAnimationActive={false}
              connectNulls={false}
            />
          )
        })}
      </LineChart>
    </ChartContainer>
  )
}
