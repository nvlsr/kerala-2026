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
import { cn } from "@/lib/utils"
import {
  formatNumber,
  formatPercent,
  getTrendData,
  type TrendSeries,
} from "@/lib/data"

export type DrawerMode = "share" | "votes"

type Props = {
  constituencyNumber: number
  mode: DrawerMode
}

export function HistoricalChart({ constituencyNumber, mode }: Props) {
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
      const value = mode === "share" ? (p?.share ?? null) : (p?.votes ?? null)
      point[s.party] = value
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
    mode === "share"
      ? Math.ceil(
          Math.max(
            ...trend.series.flatMap((s) => s.points.map((p) => p.share ?? 0))
          ) / 10
        ) * 10
      : "auto"

  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <div className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        History · 2011 → 2026
      </div>

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
              mode === "share" ? `${v}%` : formatNumber(v)
            }
            domain={[0, yMax as number]}
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
                  const display =
                    mode === "share"
                      ? formatPercent((value as number) / 100, 1)
                      : formatNumber(value as number)
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
                        {display}
                      </span>
                    </div>
                  )
                }}
              />
            }
          />
          {trend.series.map((s) => (
            <Line
              key={s.party}
              dataKey={s.party}
              type="monotone"
              stroke={s.color}
              strokeWidth={2}
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
          ))}
        </LineChart>
      </ChartContainer>

      <Legend
        series={trend.series}
        hasByElection={trend.byelectionYears.length > 0}
      />
    </div>
  )
}

function Legend({
  series,
  hasByElection,
}: {
  series: TrendSeries[]
  hasByElection: boolean
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
      {series.map((s) => (
        <span key={s.party} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: s.color }}
            aria-hidden
          />
          <span
            className={cn(
              "font-medium text-foreground/80",
              !s.isCurrent2026 && "text-muted-foreground/70"
            )}
          >
            {s.partyShort}
          </span>
        </span>
      ))}
      {hasByElection && (
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground/70">
          <span className="inline-block h-2 w-2 rounded-full border border-muted-foreground/40 bg-background" />
          by-election
        </span>
      )}
    </div>
  )
}
