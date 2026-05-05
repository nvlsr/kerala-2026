import { useMemo, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { IconArrowUpRight } from "@tabler/icons-react"

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

/**
 * For delta-sorted cards, only rows whose delta sign matches the sort direction
 * count as answers to the question. A "biggest gainers" view (delta desc) that
 * fills with rows of slightly negative delta tells a different story than the
 * card promises. Returns null when no sign filter applies.
 */
function pickSignFilter(
  filters: Filters
): ((r: CandidateRow) => boolean) | null {
  const { column, dir } = filters.sort
  if (column === "shareDelta") {
    return (r) =>
      r.shareDelta2021 != null &&
      (dir === "desc" ? r.shareDelta2021 > 0 : r.shareDelta2021 < 0)
  }
  if (column === "marginDelta") {
    return (r) =>
      r.marginDelta2021 != null &&
      (dir === "desc" ? r.marginDelta2021 > 0 : r.marginDelta2021 < 0)
  }
  return null
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
    let rows = applyFilters(all, filters)
    const signFilter = pickSignFilter(filters)
    if (signFilter) rows = rows.filter(signFilter)
    return sortCandidateRows(
      rows,
      filters.sort.column,
      filters.sort.dir
    ).slice(0, TOP_N)
  }, [filters])

  const focusSeats = useMemo(
    () => new Set(topRows.map((r) => r.constituency.constituencyNumber)),
    [topRows]
  )

  const dashboardUrl = `/?${serializeFilters(filters).toString()}`

  return (
    <article className="rounded-lg border bg-card/50 p-6 transition hover:border-foreground/40">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        <div className="flex flex-col lg:col-span-2">
          <h2 className="text-base leading-snug font-semibold sm:text-lg">
            <Link
              to={dashboardUrl}
              className="group inline-flex items-baseline gap-2 hover:text-foreground/80"
              aria-label={`${insight.question} — open in dashboard`}
            >
              <span className="underline-offset-4 group-hover:underline">
                {insight.question}
              </span>
              <IconArrowUpRight
                aria-hidden
                className="h-4 w-4 shrink-0 self-center text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </Link>
          </h2>
          <div className="mt-5">
            <TopRowsTable rows={topRows} sortColumn={filters.sort.column} />
          </div>
          <NotesSection notes={pickNotes(filters.sort.column)} />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-[260px]">
            <MiniACMap
              filters={filters}
              inFilterSet={inFilterSet}
              focusSeats={focusSeats}
              ariaLabel={`Constituency map for: ${insight.question}`}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Short methodological notes that explain how the metric in the table was
 * computed and how to read it. Shown beneath the table on every card so each
 * snippet is self-contained — readers don't have to remember definitions
 * from a different card or a separate page.
 */
function pickNotes(sortColumn: SortColumn): string[] {
  const notes: string[] = []
  if (sortColumn === "share" || sortColumn === "shareDelta") {
    notes.push(
      "Vote share changes are calculated only for seats where the same party contested both 2021 and 2026 — without a 2021 baseline there's nothing to compare against."
    )
  }
  if (sortColumn === "margin" || sortColumn === "marginDelta") {
    notes.push(
      "Margin is the gap between the winning candidate and the runner-up in a seat, in percentage points of total turnout. It's a property of the seat, not of any one candidate."
    )
    if (sortColumn === "marginDelta") {
      notes.push(
        "Comparing 2021 and 2026 margins shows who got safer (winners widening their lead) and who closed in (runners-up narrowing the gap to winning)."
      )
    }
  }
  return notes
}

function NotesSection({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null
  return (
    <div className="mt-5 space-y-1.5">
      <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        Notes
      </p>
      <div className="space-y-1.5">
        {notes.map((note, i) => (
          <p
            key={i}
            className="max-w-prose text-xs leading-relaxed text-muted-foreground"
          >
            {note}
          </p>
        ))}
      </div>
    </div>
  )
}

type ValueColumn = {
  key: string
  label: string
  /** True if this is the column that drives the sort — shows the highlight. */
  isSort: boolean
  render: (r: CandidateRow) => ReactNode
}

function formatSignedPercent(pct: number): string {
  return `${pct >= 0 ? "+" : ""}${formatPercent(pct / 100, 1)}`
}

/**
 * Pick the value columns that match the question this card answers. A
 * share-driven sort (gains/declines) gets the share-history columns; a
 * margin-driven sort (closest contests, gap-closers) gets the margin-history
 * columns. Other sorts fall back to a generic share + margin pair.
 */
function pickValueColumns(sortColumn: SortColumn): ValueColumn[] {
  const isShareSort = sortColumn === "share" || sortColumn === "shareDelta"
  const isMarginSort = sortColumn === "margin" || sortColumn === "marginDelta"

  if (isShareSort) {
    return [
      {
        key: "share-2021",
        label: "'21 share",
        isSort: false,
        render: (r) =>
          r.shareDelta2021 == null ? (
            <span className="text-muted-foreground/60">—</span>
          ) : (
            formatPercent((r.share - r.shareDelta2021) / 100, 1)
          ),
      },
      {
        key: "share-2026",
        label: "'26 share",
        isSort: sortColumn === "share",
        render: (r) => formatPercent(r.share / 100, 1),
      },
      {
        key: "share-delta",
        label: "Δ share",
        isSort: sortColumn === "shareDelta",
        render: (r) => <DeltaPercent value={r.shareDelta2021} />,
      },
    ]
  }

  if (isMarginSort) {
    return [
      {
        key: "margin-2021",
        label: "'21 margin",
        isSort: false,
        render: (r) =>
          r.marginDelta2021 == null ? (
            <span className="text-muted-foreground/60">—</span>
          ) : (
            formatSignedPercent(r.marginPct - r.marginDelta2021)
          ),
      },
      {
        key: "margin-2026",
        label: "'26 margin",
        isSort: sortColumn === "margin",
        render: (r) => formatSignedPercent(r.marginPct),
      },
      {
        key: "margin-delta",
        label: "Δ margin",
        isSort: sortColumn === "marginDelta",
        render: (r) => <DeltaPercent value={r.marginDelta2021} />,
      },
    ]
  }

  return [
    {
      key: "share-2026",
      label: "Share",
      isSort: false,
      render: (r) => formatPercent(r.share / 100, 1),
    },
    {
      key: "margin-2026",
      label: "Margin",
      isSort: false,
      render: (r) => formatSignedPercent(r.marginPct),
    },
  ]
}

function TopRowsTable({
  rows,
  sortColumn,
}: {
  rows: CandidateRow[]
  sortColumn: SortColumn
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No matching seats.</p>
  }
  const cellPad = "px-2 py-1.5"
  const sortHi = "border-l-2 border-foreground/60"
  const valueColumns = pickValueColumns(sortColumn)
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="text-left text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <th className={cellPad}>Seat</th>
            {valueColumns.map((col) => (
              <th
                key={col.key}
                className={cn(cellPad, "text-right", col.isSort && sortHi)}
              >
                {col.label}
              </th>
            ))}
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
              {valueColumns.map((col) => (
                <td
                  key={col.key}
                  className={cn(cellPad, "text-right", col.isSort && sortHi)}
                >
                  {col.render(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
