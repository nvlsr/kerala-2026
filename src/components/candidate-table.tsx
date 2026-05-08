import { useMemo, useState, type Dispatch } from "react"
import {
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { DeltaPercent } from "@/components/delta-percent"
import { InfoIcon } from "@/components/info-icon"
import { QuickViewsChips } from "@/components/quick-views-chips"
import { ReservationBadge } from "@/components/reservation-badge"
import { Section } from "@/components/section"
import { cn } from "@/lib/utils"
import {
  buildCandidateRows,
  formatNumber,
  formatPercent,
  getAlliance,
  getDistrict,
  isMainFront,
  partyShort,
  type CandidateRow,
} from "@/lib/data"
import { sortCandidateRows } from "@/lib/candidate-sort"
import { CANDIDATE_TABLE_PAGE_SIZE as PAGE_SIZE } from "@/lib/constants"
import {
  getFilteredConstituencyNumbers,
  type FilterAction,
  type Filters,
  type ResultFilter,
  type SortColumn,
  type SortDir,
} from "@/lib/filters"

type Props = {
  filters: Filters
  dispatch: Dispatch<FilterAction>
}

export function CandidateTable({ filters, dispatch }: Props) {
  const { district: scope, alliance, party, seat, result, sort } = filters
  const { column: sortColumn, dir: sortDir } = sort
  const [page, setPage] = useState(1)

  const district = scope ? getDistrict(scope) : null
  const allRows = useMemo(() => buildCandidateRows(scope), [scope])

  // Set of AC numbers that pass the constituency-level filters
  // (district + religionMix + reservation). Computed once and joined
  // against the candidate-row list below for consistency with the
  // ConstituencyMap's "in filter" set.
  const acsInScope = useMemo(
    () => getFilteredConstituencyNumbers(filters),
    [filters]
  )

  const filtered = useMemo(
    () =>
      allRows.filter((r) => {
        if (!acsInScope.has(r.constituency.constituencyNumber)) return false
        if (result === "winners" && !r.isWinner) return false
        if (result === "losers" && r.isWinner) return false
        if (alliance && r.allianceCode !== alliance) return false
        if (party && r.party !== party) return false
        return true
      }),
    [allRows, acsInScope, result, alliance, party]
  )

  // Count of rows that match the structural filters (alliance/party/scope/
  // religionMix/reservation) BUT ignoring the result filter — used to detect
  // "everything is hidden by the Winner column toggle" cases (e.g., clicking
  // a party that has 0 winners produces an empty table even though candidates
  // exist).
  const ignoreResultMatchCount = useMemo(
    () =>
      allRows.filter((r) => {
        if (!acsInScope.has(r.constituency.constituencyNumber)) return false
        if (alliance && r.allianceCode !== alliance) return false
        if (party && r.party !== party) return false
        return true
      }).length,
    [allRows, acsInScope, alliance, party]
  )

  const sorted = useMemo(
    () => sortCandidateRows(filtered, sortColumn, sortDir),
    [filtered, sortColumn, sortDir]
  )

  const hiddenByResultFilter =
    sorted.length === 0 && ignoreResultMatchCount > 0 && result !== "all"

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = sorted.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  const setSort = (col: SortColumn) => {
    dispatch({ type: "set-sort", column: col })
    setPage(1)
  }

  // Winner-column header click toggles the result filter:
  // winners ⇄ all, with losers (chip-driven) collapsing back to all.
  // Semantically: any filtered state (winners or losers) clicks to
  // "all"; only "all" clicks to "winners".
  const toggleWinnerFilter = () => {
    const next: ResultFilter = result === "all" ? "winners" : "all"
    dispatch({ type: "set-result", result: next })
    setPage(1)
  }

  const scopeLabel = [
    district ? district.name : null,
    alliance ? getAlliance(alliance).code : null,
    party ? partyShort(party) : null,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <Section
      title="Candidates"
      subtitle={`${scopeLabel ? scopeLabel + " " : ""}· ${sorted.length}`}
    >
      <QuickViewsChips dispatch={dispatch} />
      {sorted.length === 0 ? (
        hiddenByResultFilter ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="mb-2 text-sm">
              <span className="font-medium">
                {ignoreResultMatchCount} candidate
                {ignoreResultMatchCount === 1 ? "" : "s"}
              </span>{" "}
              hidden by the Winner filter.
            </p>
            <p className="mb-4 text-xs text-muted-foreground">
              The{" "}
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border bg-background align-text-bottom text-foreground/80">
                <IconCheck className="h-3 w-3" aria-hidden />
              </span>{" "}
              in the table header (next to "Winner") toggles between winners-only and all candidates. Click it to switch.
            </p>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "set-result", result: "all" })
                setPage(1)
              }}
              className="rounded-full border bg-background px-3 py-1 text-xs font-medium hover:bg-foreground/5"
            >
              Show all {ignoreResultMatchCount} candidate
              {ignoreResultMatchCount === 1 ? "" : "s"}
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
            No candidates match your filters.
          </div>
        )
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col style={{ width: "15%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "5%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "10%" }} />
              </colgroup>
              <thead className="bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <tr>
                  <Th
                    column="constituency"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    rowSpan={2}
                    className="px-3 py-2 text-left"
                  >
                    Constituency
                  </Th>
                  <Th
                    column="candidate"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    rowSpan={2}
                    className="px-3 py-2 text-left"
                  >
                    Candidate
                  </Th>
                  <Th
                    column="party"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    rowSpan={2}
                    className="px-3 py-2 text-left"
                  >
                    Party
                  </Th>
                  <WinnerTh
                    result={result}
                    onToggle={toggleWinnerFilter}
                    rowSpan={2}
                  />
                  <Th
                    column="votes"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    rowSpan={2}
                    className="px-3 py-2 text-right"
                  >
                    Votes
                  </Th>
                  <GroupTh colSpan={2}>Share</GroupTh>
                  <GroupTh colSpan={2}>Margin</GroupTh>
                </tr>
                <tr>
                  <Th
                    column="share"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    className="px-3 py-2 text-right"
                  >
                    Share
                  </Th>
                  <Th
                    column="shareDelta"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    className="px-3 py-2 text-right"
                    tooltip="Change in this party's vote share in this constituency between 2021 and 2026 (percentage points)"
                  >
                    Δ '21
                  </Th>
                  <Th
                    column="margin"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    className="px-3 py-2 text-right"
                    tooltip="Votes ahead of the runner-up (winners, positive) or behind the winner (losers, negative). The smaller value is the margin as a share of total votes cast in this constituency."
                  >
                    Margin
                  </Th>
                  <Th
                    column="marginDelta"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    className="px-3 py-2 text-right"
                    tooltip="Change in this party's win/loss margin in this constituency between 2021 and 2026 (percentage points)"
                  >
                    Δ '21
                  </Th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => (
                  <CandidateTr
                    key={r.key}
                    row={r}
                    isSelected={r.constituency.constituencyNumber === seat}
                    onSelect={(n) => dispatch({ type: "set-seat", seat: n })}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="tabular-nums">
              {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
              >
                <IconChevronLeft />
                Prev
              </Button>
              <span className="tabular-nums">
                Page {safePage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
              >
                Next
                <IconChevronRight />
              </Button>
            </div>
          </div>
        </>
      )}
    </Section>
  )
}

function Th({
  column,
  sortColumn,
  sortDir,
  onSort,
  className,
  tooltip,
  rowSpan,
  children,
}: {
  column: SortColumn
  sortColumn: SortColumn
  sortDir: SortDir
  onSort: (c: SortColumn) => void
  className?: string
  tooltip?: string
  rowSpan?: number
  children: React.ReactNode
}) {
  const active = sortColumn === column
  return (
    <th rowSpan={rowSpan} className={cn("border-b", className)}>
      <span className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={() => onSort(column)}
          className={cn(
            "inline-flex items-center gap-1 tracking-wide uppercase hover:text-foreground",
            active && "text-foreground"
          )}
        >
          {children}
          {active &&
            (sortDir === "asc" ? (
              <IconArrowUp className="h-3 w-3" aria-hidden />
            ) : (
              <IconArrowDown className="h-3 w-3" aria-hidden />
            ))}
        </button>
        {tooltip && <InfoIcon text={tooltip} />}
      </span>
    </th>
  )
}

/**
 * Non-interactive group header that spans multiple sub-columns. Used
 * in the two-row `<thead>` to label related metric pairs (Share /
 * Δ Share '21, Margin / Δ Margin '21) under one umbrella header.
 */
function GroupTh({
  colSpan,
  children,
}: {
  colSpan: number
  children: React.ReactNode
}) {
  return (
    <th colSpan={colSpan} className="border-b px-3 py-2 text-center">
      {children}
    </th>
  )
}

/**
 * Header cell for the Winner column. Click toggles the result filter
 * winners ⇄ all (with chip-driven losers state collapsing back to
 * all). Visual states:
 *   - winners: filled IconCheck in foreground color (filter active)
 *   - all: muted IconCheck (filter off)
 *   - losers: IconX (chip set this; click escapes back to all)
 */
function WinnerTh({
  result,
  onToggle,
  rowSpan,
}: {
  result: ResultFilter
  onToggle: () => void
  rowSpan?: number
}) {
  const Icon = result === "losers" ? IconX : IconCheck
  const active = result === "winners"
  const title =
    result === "winners"
      ? "Showing winners only · click to show all"
      : result === "losers"
        ? "Showing losers (chip-set) · click to show all"
        : "Click to filter to winners only"
  return (
    <th rowSpan={rowSpan} className="border-b px-3 py-2 text-center">
      <button
        type="button"
        onClick={onToggle}
        title={title}
        aria-label={title}
        className={cn(
          "inline-flex items-center justify-center rounded-full border bg-background p-1 transition-colors hover:bg-foreground/5",
          active
            ? "border-foreground/30 text-foreground"
            : "border-border text-muted-foreground/70"
        )}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </button>
    </th>
  )
}

function CandidateTr({
  row,
  isSelected,
  onSelect,
}: {
  row: CandidateRow
  isSelected: boolean
  onSelect: (n: number | null) => void
}) {
  const meta = getAlliance(row.allianceCode)
  const main = isMainFront(row.allianceCode)
  return (
    <tr
      className={cn(
        "cursor-pointer border-b last:border-b-0 hover:bg-foreground/5",
        isSelected && "bg-foreground/5"
      )}
      onClick={() =>
        onSelect(isSelected ? null : row.constituency.constituencyNumber)
      }
    >
      <td className="relative px-3 py-2">
        <span
          className="absolute inset-y-0 left-0 w-0.5"
          style={{
            backgroundColor: main ? meta.color : "var(--border)",
          }}
          aria-hidden
        />
        <span className="flex items-center gap-1.5 truncate font-medium">
          <span className="truncate">{row.constituencyName}</span>
          <ReservationBadge seat={row.constituency.constituencyNumber} />
        </span>
      </td>
      <td className="px-3 py-2">
        <span className="block truncate">{row.candidateDisplay}</span>
      </td>
      <td className="px-3 py-2">
        <span className="block truncate" title={row.candidate.party}>
          {row.partyShort}
        </span>
      </td>
      <td className="px-3 py-2 text-center">
        {row.isWinner && (
          <IconCheck
            className="inline-block h-3.5 w-3.5 text-emerald-500"
            aria-label="Winner"
          />
        )}
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        {formatNumber(row.votes)}
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        {formatPercent(row.share / 100, 1)}
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        <DeltaPercent value={row.shareDelta2021} />
      </td>
      <td
        className={cn(
          "px-3 py-2 text-right whitespace-nowrap tabular-nums",
          row.isWinner ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {row.margin >= 0 ? "+" : ""}
        {formatNumber(row.margin)}
        <span className="ml-1 inline-block min-w-[2.75rem] text-right text-[11px] text-muted-foreground/70">
          {row.marginPct >= 0 ? "+" : ""}
          {formatPercent(row.marginPct / 100, 1)}
        </span>
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        <DeltaPercent value={row.marginDelta2021} />
      </td>
    </tr>
  )
}
