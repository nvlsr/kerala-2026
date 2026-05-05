import { useMemo } from "react"

import { AllianceHistoricalChart } from "@/components/alliance-historical-chart"
import { DeltaPercent } from "@/components/delta-percent"
import { InfoIcon } from "@/components/info-icon"
import { Section } from "@/components/section"
import { cn } from "@/lib/utils"
import {
  COMPARABLE_ALLIANCE_CODES,
  formatPercent,
  getAlliance,
  getAllianceBreakdown,
  getAllianceTrendData,
  getStateSummary,
  type AllianceCode,
} from "@/lib/data"

type Props = {
  scope: string | null
  selectedAlliance: AllianceCode | null
  onSelectAlliance: (code: AllianceCode | null) => void
}

export function AllianceSection({
  scope,
  selectedAlliance,
  onSelectAlliance,
}: Props) {
  const summary = getStateSummary(scope)
  const trend = useMemo(() => getAllianceTrendData(scope), [scope])

  const rows = useMemo(
    () =>
      COMPARABLE_ALLIANCE_CODES.map((code) => {
        const breakdown = getAllianceBreakdown(code, scope)
        const series = trend.series[code]
        const point2026 = series[series.length - 1]
        const point2021 = series.length >= 2 ? series[series.length - 2] : null
        const delta =
          point2026 && point2021 ? point2026.share - point2021.share : null
        return {
          code,
          meta: getAlliance(code),
          seatsWon: breakdown.totalSeats,
          contested: breakdown.totalContested,
          voteShare: breakdown.totalVoteShare,
          winRate:
            breakdown.totalContested > 0
              ? breakdown.totalSeats / breakdown.totalContested
              : null,
          delta,
        }
      }),
    [scope, trend]
  )

  return (
    <Section title="Alliances" subtitle="click a row to drill in">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="overflow-hidden rounded-lg border lg:col-span-3">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <tr className="border-b">
                <th className="px-3 py-2 text-left">Alliance</th>
                <th className="px-3 py-2 text-right">Seats</th>
                <th className="px-3 py-2 text-right">Vote share</th>
                <th className="px-3 py-2 text-right">Win rate</th>
                <th className="px-3 py-2 text-right">
                  <span className="inline-flex items-center gap-1">
                    Δ share '21
                    <InfoIcon text="Change in this alliance's statewide vote share between 2021 and 2026 (percentage points)" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isSelected = r.code === selectedAlliance
                return (
                  <tr
                    key={r.code}
                    onClick={() => onSelectAlliance(isSelected ? null : r.code)}
                    className={cn(
                      "cursor-pointer border-b last:border-b-0 hover:bg-foreground/5",
                      isSelected && "bg-foreground/5"
                    )}
                  >
                    <td className="relative px-3 py-2">
                      <span
                        className="absolute inset-y-0 left-0 w-0.5"
                        style={{ backgroundColor: r.meta.color }}
                        aria-hidden
                      />
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: r.meta.color }}
                          aria-hidden
                        />
                        <span className="font-medium">{r.meta.code}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {r.seatsWon}
                      <span className="text-muted-foreground">
                        {" "}
                        / {summary.totalSeats}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatPercent(r.voteShare, 1)}
                    </td>
                    <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                      {r.winRate != null ? formatPercent(r.winRate, 0) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      <DeltaPercent value={r.delta} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border bg-muted/40 p-4 lg:col-span-2">
          <AllianceHistoricalChart
            selected={selectedAlliance}
            scope={scope}
            mode="share"
          />
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/70">
        Historical alliance and party totals are anchored on 2026 composition.
        Parties are classified by their current 2026 alliance for all cycles.
      </p>
    </Section>
  )
}
