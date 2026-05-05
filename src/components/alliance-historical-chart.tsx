import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  formatPercent,
  getAlliance,
  getAllianceTrendData,
  type AllianceCode,
} from "@/lib/data"

export type AllianceMode = "share" | "seats"

type Props = {
  selected: AllianceCode
  scope: string | null
  mode: AllianceMode
}

const FRONTS: AllianceCode[] = ["UDF", "LDF", "NDA"]

export function AllianceHistoricalChart({ selected, scope, mode }: Props) {
  const trend = useMemo(() => getAllianceTrendData(scope), [scope])

  if (trend.years.length === 0) return null

  const chartConfig: ChartConfig = Object.fromEntries(
    FRONTS.map((code) => {
      const meta = getAlliance(code)
      return [code, { label: meta.code, color: meta.color }]
    })
  )

  const data = trend.years.map((year, i) => {
    const point: Record<string, number | string> = { year }
    for (const code of FRONTS) {
      const p = trend.series[code][i]
      point[code] = mode === "share" ? p.share : p.seats
    }
    return point
  })

  const yDomain: [number, number | "auto"] =
    mode === "share" ? [0, 60] : [0, trend.totalSeats]

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
          tickFormatter={(v) => (mode === "share" ? `${v}%` : String(v))}
          domain={yDomain as [number, number]}
          allowDecimals={false}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              formatter={(value, _name, item) => {
                const code = item.dataKey as AllianceCode
                const meta = getAlliance(code)
                const display =
                  mode === "share"
                    ? formatPercent((value as number) / 100, 1)
                    : `${value} seats`
                return (
                  <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: meta.color }}
                        aria-hidden
                      />
                      <span className="text-foreground/80">{meta.code}</span>
                    </div>
                    <span className="font-medium tabular-nums">{display}</span>
                  </div>
                )
              }}
            />
          }
        />
        {FRONTS.map((code) => {
          const meta = getAlliance(code)
          const isSelected = code === selected
          return (
            <Line
              key={code}
              dataKey={code}
              type="monotone"
              stroke={meta.color}
              strokeWidth={isSelected ? 3 : 2}
              strokeOpacity={isSelected ? 1 : 0.35}
              dot={{
                r: isSelected ? 4 : 3,
                fill: meta.color,
                strokeWidth: 0,
                opacity: isSelected ? 1 : 0.4,
              }}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: meta.color,
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
