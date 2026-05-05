import { useMemo, useState, type Dispatch } from "react"
import {
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AlliancePill } from "@/components/alliance-pill"
import { DeltaPercent } from "@/components/delta-percent"
import { InfoIcon } from "@/components/info-icon"
import { InsightsChips } from "@/components/insights-chips"
import { Section } from "@/components/section"
import { cn } from "@/lib/utils"
import {
  buildCandidateRows,
  type CandidateRow,
} from "@/lib/data/candidate-rows"
import {
  formatNumber,
  formatPercent,
  getAlliance,
  getDistrict,
  isMainFront,
  partyShort,
} from "@/lib/data"
import type {
  FilterAction,
  Filters,
  ResultFilter,
  SortColumn,
  SortDir,
} from "@/lib/filters"

const PAGE_SIZE = 10

type Props = {
  filters: Filters
  dispatch: Dispatch<FilterAction>
}

export function CandidateTable({ filters, dispatch }: Props) {
  const { district: scope, alliance, party, seat, result, sort } = filters
  const { column: sortColumn, dir: sortDir } = sort
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const district = scope ? getDistrict(scope) : null
  const allRows = useMemo(() => buildCandidateRows(scope), [scope])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allRows.filter((r) => {
      if (result === "winners" && !r.isWinner) return false
      if (result === "losers" && r.isWinner) return false
      if (alliance && r.allianceCode !== alliance) return false
      if (party && r.party !== party) return false
      if (!q) return true
      return (
        r.constituencyName.toLowerCase().includes(q) ||
        r.candidate.name.toLowerCase().includes(q) ||
        r.party.toLowerCase().includes(q) ||
        r.partyShort.toLowerCase().includes(q)
      )
    })
  }, [allRows, query, result, alliance, party])

  const sorted = useMemo(() => {
    const list = [...filtered]
    const dir = sortDir === "asc" ? 1 : -1
    switch (sortColumn) {
      case "constituency":
        list.sort(
          (a, b) =>
            dir *
            (a.constituency.constituencyNumber -
              b.constituency.constituencyNumber)
        )
        break
      case "candidate":
        list.sort(
          (a, b) => dir * a.candidateDisplay.localeCompare(b.candidateDisplay)
        )
        break
      case "party":
        list.sort((a, b) => dir * a.partyShort.localeCompare(b.partyShort))
        break
      case "share":
        list.sort((a, b) => dir * (a.share - b.share))
        break
      case "shareDelta":
        list.sort((a, b) => {
          if (a.shareDelta2021 == null && b.shareDelta2021 == null) return 0
          if (a.shareDelta2021 == null) return 1
          if (b.shareDelta2021 == null) return -1
          return dir * (a.shareDelta2021 - b.shareDelta2021)
        })
        break
      case "votes":
        list.sort((a, b) => dir * (a.votes - b.votes))
        break
      case "margin":
        list.sort((a, b) => dir * (a.margin - b.margin))
        break
      case "marginDelta":
        list.sort((a, b) => {
          if (a.marginDelta2021 == null && b.marginDelta2021 == null) return 0
          if (a.marginDelta2021 == null) return 1
          if (b.marginDelta2021 == null) return -1
          return dir * (a.marginDelta2021 - b.marginDelta2021)
        })
        break
    }
    return list
  }, [filtered, sortColumn, sortDir])

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
      actions={
        <>
          <div className="relative">
            <IconSearch
              className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search seat, candidate, party"
              className="w-60 pl-8"
            />
          </div>
          <ToggleGroup
            value={[result]}
            onValueChange={(v) => {
              const next = (v[0] as ResultFilter | undefined) ?? "winners"
              dispatch({ type: "set-result", result: next })
              setPage(1)
            }}
            variant="outline"
            size="sm"
            spacing={0}
          >
            <ToggleGroupItem value="winners">Winners</ToggleGroupItem>
            <ToggleGroupItem value="losers">Losers</ToggleGroupItem>
            <ToggleGroupItem value="all">All</ToggleGroupItem>
          </ToggleGroup>
        </>
      }
    >
      <InsightsChips dispatch={dispatch} />
      {sorted.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          No candidates match your filters.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <tr className="border-b">
                  <Th
                    column="constituency"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    className="px-3 py-2 text-left"
                  >
                    Constituency
                  </Th>
                  <Th
                    column="candidate"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    className="px-3 py-2 text-left"
                  >
                    Candidate
                  </Th>
                  <Th
                    column="party"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    className="px-3 py-2 text-left"
                  >
                    Party
                  </Th>
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
                    Δ share '21
                  </Th>
                  <Th
                    column="votes"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    className="px-3 py-2 text-right"
                  >
                    Votes
                  </Th>
                  <Th
                    column="margin"
                    sortColumn={sortColumn}
                    sortDir={sortDir}
                    onSort={setSort}
                    className="px-3 py-2 text-right"
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
                    Δ margin '21
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
  children,
}: {
  column: SortColumn
  sortColumn: SortColumn
  sortDir: SortDir
  onSort: (c: SortColumn) => void
  className?: string
  tooltip?: string
  children: React.ReactNode
}) {
  const active = sortColumn === column
  return (
    <th className={className}>
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
        <span className="block truncate font-medium">
          {row.constituencyName}
        </span>
      </td>
      <td className="px-3 py-2">
        <span className="flex items-center gap-1.5">
          <span className="truncate">{row.candidateDisplay}</span>
          {row.isWinner && (
            <IconCheck
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: main ? meta.color : undefined }}
              aria-hidden
            />
          )}
        </span>
      </td>
      <td className="px-3 py-2">
        <span className="flex items-center gap-1.5">
          <span className="truncate" title={row.candidate.party}>
            {row.partyShort}
          </span>
          <AlliancePill code={row.allianceCode} />
        </span>
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        {formatPercent(row.share / 100, 1)}
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        <DeltaPercent value={row.shareDelta2021} />
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        {formatNumber(row.votes)}
      </td>
      <td
        className={cn(
          "px-3 py-2 text-right tabular-nums",
          row.isWinner ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {row.margin >= 0 ? "+" : ""}
        {formatNumber(row.margin)}
        <span className="ml-1 text-[11px] text-muted-foreground/70">
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
