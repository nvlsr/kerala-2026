import { useMemo } from "react"

import { DeltaPercent } from "@/components/delta-percent"
import { InfoIcon } from "@/components/info-icon"
import { PartyHistoricalChart } from "@/components/party-historical-chart"
import { Section } from "@/components/section"
import { cn } from "@/lib/utils"
import {
  formatPercent,
  getAlliance,
  getAllianceBreakdown,
  getPartyTrendData,
  type AllianceCode,
} from "@/lib/data"

type Props = {
  scope: string | null
  alliance: AllianceCode
  selectedParty: string | null
  onSelectParty: (party: string | null) => void
}

export function PartySection({
  scope,
  alliance,
  selectedParty,
  onSelectParty,
}: Props) {
  const allianceMeta = getAlliance(alliance)

  const rows = useMemo(() => {
    const breakdown = getAllianceBreakdown(alliance, scope)
    return breakdown.parties.map((p) => {
      // Alliance-filter the trend so a party's prior-cycle vote share
      // only counts contributions from the SAME alliance. Without this
      // filter, e.g. LDF-RJD's Δ '21 would include 511 votes from two
      // OTHER-tagged fringe RJD candidates in 2021 — apples-to-oranges.
      const trend = getPartyTrendData(p.party, scope, alliance)
      const cur = trend.points[trend.points.length - 1]
      const prev =
        trend.points.length >= 2 ? trend.points[trend.points.length - 2] : null
      const rawDelta = cur && prev ? cur.share - prev.share : null
      // "new" means the party did not contest in this alliance last cycle
      // but does this cycle. Distinct from threshold suppression below;
      // surfaces a "new" indicator instead of a numeric delta.
      const isNewToAlliance =
        cur != null && prev != null && prev.share === 0 && cur.share > 0
      // Suppress delta when both cycles are below 0.5% statewide share —
      // tiny-base deltas (e.g. a single Independent's 0.03pp move) are
      // rounding noise and read as misleadingly large in the UI. We use
      // max() rather than min() so a party that disappeared (was big,
      // now zero) still surfaces a meaningful negative delta.
      const peakShare =
        cur && prev ? Math.max(cur.share, prev.share) : (cur?.share ?? 0)
      const delta =
        isNewToAlliance || peakShare < 0.5 ? null : rawDelta
      return {
        party: p.party,
        partyShort: p.partyShort,
        seatsWon: p.won,
        contested: p.contested,
        voteShare: p.voteShare,
        winRate: p.contested > 0 ? p.won / p.contested : null,
        delta,
        isNewToAlliance,
      }
    })
  }, [alliance, scope])

  return (
    <Section
      title={`${allianceMeta.code} parties`}
      subtitle="click a row to drill in"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="overflow-hidden rounded-lg border lg:col-span-3">
          {rows.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No parties recorded for this alliance.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left">Party</th>
                  <th className="px-3 py-2 text-right">Seats</th>
                  <th className="px-3 py-2 text-right">Share</th>
                  <th className="px-3 py-2 text-right">Win rate</th>
                  <th className="px-3 py-2 text-right">
                    <span className="inline-flex items-center gap-1">
                      Δ share '21
                      <InfoIcon text="Change in this party's statewide vote share between 2021 and 2026 (percentage points)" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const isSelected = r.party === selectedParty
                  return (
                    <tr
                      key={r.party}
                      onClick={() => onSelectParty(isSelected ? null : r.party)}
                      className={cn(
                        "cursor-pointer border-b last:border-b-0 hover:bg-foreground/5",
                        isSelected && "bg-foreground/5"
                      )}
                    >
                      <td className="relative px-3 py-2">
                        <span
                          className="absolute inset-y-0 left-0 w-0.5"
                          style={{ backgroundColor: allianceMeta.color }}
                          aria-hidden
                        />
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: allianceMeta.color }}
                            aria-hidden
                          />
                          <span className="font-medium" title={r.party}>
                            {r.partyShort}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {r.seatsWon}
                        <span className="text-muted-foreground">
                          {" "}
                          / {r.contested}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatPercent(r.voteShare, 1)}
                      </td>
                      <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                        {r.winRate != null ? formatPercent(r.winRate, 0) : "—"}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {r.isNewToAlliance ? (
                          <span className="text-xs text-muted-foreground italic">
                            new to {alliance}
                          </span>
                        ) : (
                          <DeltaPercent value={r.delta} />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex min-h-[176px] items-center justify-center rounded-lg border bg-muted/40 p-4 lg:col-span-2">
          {rows.length > 0 ? (
            <PartyHistoricalChart
              parties={rows.map((r) => r.party)}
              selected={selectedParty}
              scope={scope}
              mode="share"
            />
          ) : (
            <div className="px-4 text-center text-xs text-muted-foreground">
              No parties recorded for this alliance.
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
