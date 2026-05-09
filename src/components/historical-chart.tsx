import { useMemo } from "react"
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  XAxis,
  YAxis,
  type DotItemDotProps,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatPercent, getTrendData, type AllianceCode } from "@/lib/data"

type Props = {
  constituencyNumber: number
  highlightAlliance?: AllianceCode | null
}

export function HistoricalChart({
  constituencyNumber,
  highlightAlliance,
}: Props) {
  const trend = useMemo(
    () => getTrendData(constituencyNumber),
    [constituencyNumber]
  )

  if (!trend || trend.series.length === 0) return null

  const chartConfig: ChartConfig = Object.fromEntries(
    trend.series.map((s) => [s.party, { label: s.partyShort, color: s.color }])
  )

  const data = trend.years.map((year) => {
    const point: Record<string, number | null | string> = { year }
    for (const s of trend.series) {
      const p = s.points.find((pt) => pt.year === year)
      point[s.party] = p?.share ?? null
      if (p?.candidate) point[`${s.party}__name`] = p.candidate
      if (p?.type) point[`${s.party}__type`] = p.type
      if (p?.reason) point[`${s.party}__reason`] = p.reason
    }
    point.__type = trend.byelectionYears.includes(year)
      ? "by-election"
      : "general"
    return point
  })

  const yMax =
    Math.ceil(
      Math.max(
        ...trend.series.flatMap((s) => s.points.map((p) => p.share ?? 0))
      ) / 10
    ) * 10

  const noHighlight = !highlightAlliance

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
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
          tickFormatter={(v) => `${v}%`}
          domain={[0, yMax]}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(label, payload) => {
                const value = Number(label)
                const isBy = trend.byelectionYears.includes(value)
                const reason =
                  payload?.[0]?.payload?.[`${payload[0].dataKey}__reason`]
                if (isBy) {
                  return `${value} · by-election${reason ? ` (${reason})` : ""}`
                }
                return String(value)
              }}
              formatter={(value, _name, item) => {
                const partyKey = item.dataKey as string
                const meta = chartConfig[partyKey]
                if (value == null) return null
                return (
                  <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: meta?.color }}
                        aria-hidden
                      />
                      <span className="text-foreground/80">
                        {meta?.label as string}
                      </span>
                    </div>
                    <span className="font-medium tabular-nums">
                      {formatPercent((value as number) / 100, 1)}
                    </span>
                  </div>
                )
              }}
            />
          }
        />
        {trend.series.map((s) => {
          const isHighlighted = highlightAlliance === s.allianceCode
          const dimmed = !noHighlight && !isHighlighted
          return (
            <Line
              key={s.party}
              dataKey={s.party}
              type="monotone"
              stroke={s.color}
              strokeWidth={isHighlighted ? 3 : 2}
              strokeOpacity={dimmed ? 0.3 : 1}
              connectNulls={false}
              dot={(props: DotItemDotProps) => {
                const isBy = props.payload?.__type === "by-election"
                const {
                  key,
                  points: _points,
                  index: _index,
                  value: _value,
                  dataKey: _dataKey,
                  ...rest
                } = props as DotItemDotProps & { key?: string }
                void _points
                void _index
                void _value
                void _dataKey
                return (
                  <Dot
                    key={key ?? `${s.party}-${rest.cx}`}
                    {...rest}
                    r={isBy ? 3 : 4}
                    fill={isBy ? "var(--background)" : s.color}
                    stroke={s.color}
                    strokeWidth={2}
                    opacity={dimmed ? 0.4 : 1}
                  />
                )
              }}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: s.color,
                stroke: "var(--background)",
              }}
              isAnimationActive={false}
            />
          )
        })}
      </LineChart>
    </ChartContainer>
  )
}
