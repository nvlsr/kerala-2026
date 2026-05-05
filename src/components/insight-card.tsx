import { useMemo } from "react"
import { Link } from "react-router-dom"

import { DeltaPercent } from "@/components/delta-percent"
import { MiniACMap } from "@/components/mini-ac-map"
import { sortCandidateRows } from "@/lib/candidate-sort"
import {
  buildCandidateRows,
  formatPercent,
  type CandidateRow,
} from "@/lib/data"
import type { CuratedInsight } from "@/lib/curated-insights"
import {
  getFilteredConstituencyNumbers,
  initialFilters,
  serializeFilters,
  type Filters,
  type SortColumn,
} from "@/lib/filters"
import { cn } from "@/lib/utils"

const TOP_N = 5

function resolveFilters(preset: Partial<Filters>): Filters {
  return { ...initialFilters, ...preset }
}

function applyFilters(rows: CandidateRow[], filters: Filters): CandidateRow[] {
  return rows.filter((r) => {
    if (filters.result === "winners" && !r.isWinner) return false
    if (filters.result === "losers" && r.isWinner) return false
    if (filters.alliance && r.allianceCode !== filters.alliance) return false
    if (filters.party && r.party !== filters.party) return false
    return true
  })
}

type Props = {
  insight: CuratedInsight
}

export function InsightCard({ insight }: Props) {
  const filters = useMemo(() => resolveFilters(insight.filters), [insight])
  const inFilterSet = useMemo(
    () => getFilteredConstituencyNumbers(filters),
    [filters]
  )

  const topRows = useMemo(() => {
    const all = buildCandidateRows(null)
    const filtered = applyFilters(all, filters)
    return sortCandidateRows(
      filtered,
      filters.sort.column,
      filters.sort.dir
    ).slice(0, TOP_N)
  }, [filters])

  const dashboardUrl = `/?${serializeFilters(filters).toString()}`

  return (
    <article className="rounded-lg border bg-card/50 p-6">
      <h2 className="text-base leading-snug font-semibold sm:text-lg">
        {insight.question}
      </h2>
      <div className="mt-5 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopRowsTable rows={topRows} sortColumn={filters.sort.column} />
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-[260px]">
            <MiniACMap
              filters={filters}
              inFilterSet={inFilterSet}
              ariaLabel={`Constituency map for: ${insight.question}`}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Link
          to={dashboardUrl}
          className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium hover:bg-foreground/10"
        >
          Open in dashboard →
        </Link>
      </div>
    </article>
  )
}

function TopRowsTable({
  rows,
  sortColumn,
}: {
  rows: CandidateRow[]
  sortColumn: SortColumn
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No matching seats.</p>
    )
  }
  const cellPad = "px-2 py-1.5"
  const sortHi = "border-l-2 border-foreground/60"
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="text-left text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <th className={cellPad}>Seat</th>
            <th
              className={cn(
                cellPad,
                "text-right",
                sortColumn === "share" && sortHi
              )}
            >
              Share
            </th>
            <th
              className={cn(
                cellPad,
                "text-right",
                sortColumn === "shareDelta" && sortHi
              )}
            >
              Δ '21
            </th>
            <th
              className={cn(
                cellPad,
                "text-right",
                sortColumn === "margin" && sortHi
              )}
            >
              Margin
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-t">
              <td className={cellPad}>
                <div className="font-medium">{r.constituencyName}</div>
                <div className="text-xs text-muted-foreground">
                  {r.partyShort} · {r.candidateDisplay}
                </div>
              </td>
              <td
                className={cn(
                  cellPad,
                  "text-right",
                  sortColumn === "share" && sortHi
                )}
              >
                {formatPercent(r.share / 100, 1)}
              </td>
              <td
                className={cn(
                  cellPad,
                  "text-right",
                  sortColumn === "shareDelta" && sortHi
                )}
              >
                <DeltaPercent value={r.shareDelta2021} />
              </td>
              <td
                className={cn(
                  cellPad,
                  "text-right",
                  sortColumn === "margin" && sortHi,
                  r.isWinner ? "" : "text-muted-foreground"
                )}
              >
                {r.marginPct >= 0 ? "+" : ""}
                {formatPercent(r.marginPct / 100, 1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
