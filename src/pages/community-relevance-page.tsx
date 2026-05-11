import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { IconArrowDown, IconArrowUp, IconArrowsSort, IconX } from "@tabler/icons-react"

import { AlliancePill } from "@/components/alliance-pill"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  communityRelevance,
  type CommunityRelevanceRecord,
} from "@/lib/data/community-relevance"
import { districts as ALL_DISTRICTS } from "@/lib/data/districts"
import { cn } from "@/lib/utils"

type SortKey = "ac" | "name" | "margin" | "ndaShare" | "confidence" | "district"
type SortDir = "asc" | "desc"

const CONFIDENCE_RANK: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
  UNKNOWN: 0,
}

const TAG_LABELS: Record<string, string> = {
  decisive: "Decisive",
  blocking: "Blocking",
  "hindu-driven": "Hindu-driven",
  diffuse: "Diffuse",
}

const DRIVER_LABELS: Record<string, string> = {
  "both-christian-muslim": "Christian + Muslim",
  "christian-subrite": "Christian (sub-rite)",
  "christian-aggregate": "Christian (aggregate)",
  muslim: "Muslim",
  "hindu-district": "Hindu (district)",
  diffuse: "Diffuse",
}

const TAG_COLORS: Record<string, string> = {
  decisive: "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  blocking: "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "hindu-driven": "border-violet-500/60 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  diffuse: "border-muted-foreground/40 bg-muted/40 text-muted-foreground",
}

const TREND_COLORS: Record<string, string> = {
  rising: "text-rose-600 dark:text-rose-400",
  flat: "text-muted-foreground",
  declining: "text-emerald-600 dark:text-emerald-400",
  unknown: "text-muted-foreground/60",
}

function tierStars(conf: string): string {
  if (conf === "HIGH") return "★★★"
  if (conf === "MEDIUM") return "★★"
  if (conf === "LOW") return "★"
  return "—"
}

function historyToken(h: CommunityRelevanceRecord["history"]): string {
  const c = (a: string | null) => (a ? a.charAt(0) : "?")
  return `${c(h.y2016)}-${c(h.y2021)}-${c(h.y2026)}`
}

function trendArrow(t: string): string {
  return t === "rising" ? "↑" : t === "declining" ? "↓" : t === "flat" ? "→" : "?"
}

const DISTRICT_LOOKUP = new Map(ALL_DISTRICTS.map((d) => [d.id, d.name]))

function districtLabel(id: string): string {
  return DISTRICT_LOOKUP.get(id) ?? id
}

/**
 * Per-AC community-relevance explorer. Surfaces the framework documented
 * in `docs/community-relevance.md` — primary driver, net tag, confidence,
 * 3-cycle winner history, structural blocker stability, NDA share trend,
 * compact community-presence + alliance-role note.
 *
 * Rows link to `/explore?seat=N` for the per-AC detail view.
 */
export function CommunityRelevancePage() {
  const [search, setSearch] = useState("")
  const [driverFilter, setDriverFilter] = useState<Set<string>>(new Set())
  const [tagFilter, setTagFilter] = useState<Set<string>>(new Set())
  const [trendFilter, setTrendFilter] = useState<Set<string>>(new Set())
  const [sortKey, setSortKey] = useState<SortKey>("ac")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return communityRelevance.filter((r) => {
      if (q) {
        const hay = `${r.name.toLowerCase()} ${districtLabel(r.district).toLowerCase()}`
        if (!hay.includes(q)) return false
      }
      if (driverFilter.size > 0 && !driverFilter.has(r.primaryDriver)) return false
      if (tagFilter.size > 0 && !tagFilter.has(r.netTag)) return false
      if (trendFilter.size > 0 && !trendFilter.has(r.ndaTrend)) return false
      return true
    })
  }, [search, driverFilter, tagFilter, trendFilter])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    const dir = sortDir === "asc" ? 1 : -1
    arr.sort((a, b) => {
      switch (sortKey) {
        case "ac":
          return (a.ac - b.ac) * dir
        case "name":
          return a.name.localeCompare(b.name) * dir
        case "margin":
          return (a.margin - b.margin) * dir
        case "ndaShare":
          return (a.ndaShareTrajectory.y2026 - b.ndaShareTrajectory.y2026) * dir
        case "confidence":
          return (
            (CONFIDENCE_RANK[a.confidence] - CONFIDENCE_RANK[b.confidence]) * dir
          )
        case "district":
          return a.district.localeCompare(b.district) * dir
        default:
          return 0
      }
    })
    return arr
  }, [filtered, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir(key === "ac" || key === "name" || key === "district" ? "asc" : "desc")
    }
  }

  function toggleSet(set: Set<string>, value: string, setter: (s: Set<string>) => void) {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setter(next)
  }

  const totalFiltered = sorted.length
  const totalAll = communityRelevance.length
  const hasAnyFilter =
    search.length > 0 ||
    driverFilter.size > 0 ||
    tagFilter.size > 0 ||
    trendFilter.size > 0

  return (
    <PageShell
      breadcrumbs={[{ label: "Community relevance" }]}
      title="Community relevance"
      subtitle={
        <p className="max-w-prose">
          Per-AC analytical view of which communities are{" "}
          <em>electorally relevant</em> — large enough and organised enough to
          shape (or have shaped) the 2026 result, or to constrain candidate
          selection in future cycles. Framework documented at{" "}
          <a
            href="https://github.com/nvlsr/kerala-2026/blob/main/docs/community-relevance.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            docs/community-relevance.md
          </a>
          .
        </p>
      }
      aboutContent={
        <AboutPopover />
      }
    >
      <PageMain>
        <div className="space-y-6">
          <FilterBar
            search={search}
            onSearch={setSearch}
            driverFilter={driverFilter}
            onToggleDriver={(v) => toggleSet(driverFilter, v, setDriverFilter)}
            tagFilter={tagFilter}
            onToggleTag={(v) => toggleSet(tagFilter, v, setTagFilter)}
            trendFilter={trendFilter}
            onToggleTrend={(v) => toggleSet(trendFilter, v, setTrendFilter)}
            onClear={() => {
              setSearch("")
              setDriverFilter(new Set())
              setTagFilter(new Set())
              setTrendFilter(new Set())
            }}
            hasAnyFilter={hasAnyFilter}
            totalFiltered={totalFiltered}
            totalAll={totalAll}
          />

          <div className="overflow-hidden rounded-md border">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <SortableHead
                    label="AC"
                    sortKey="ac"
                    activeKey={sortKey}
                    dir={sortDir}
                    onToggle={toggleSort}
                    className="w-12 text-right"
                  />
                  <SortableHead
                    label="Name"
                    sortKey="name"
                    activeKey={sortKey}
                    dir={sortDir}
                    onToggle={toggleSort}
                  />
                  <SortableHead
                    label="District"
                    sortKey="district"
                    activeKey={sortKey}
                    dir={sortDir}
                    onToggle={toggleSort}
                  />
                  <SortableHead
                    label="Margin"
                    sortKey="margin"
                    activeKey={sortKey}
                    dir={sortDir}
                    onToggle={toggleSort}
                    className="text-right"
                  />
                  <TableHead>Tag</TableHead>
                  <SortableHead
                    label="Conf"
                    sortKey="confidence"
                    activeKey={sortKey}
                    dir={sortDir}
                    onToggle={toggleSort}
                    className="text-center"
                  />
                  <TableHead className="text-center font-mono">History</TableHead>
                  <SortableHead
                    label="NDA%"
                    sortKey="ndaShare"
                    activeKey={sortKey}
                    dir={sortDir}
                    onToggle={toggleSort}
                    className="text-right"
                  />
                  <TableHead className="text-center">Stable</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead className="min-w-64">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((r) => (
                  <CommunityRow key={r.ac} record={r} />
                ))}
                {sorted.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No ACs match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </PageMain>
    </PageShell>
  )
}

function CommunityRow({ record }: { record: CommunityRelevanceRecord }) {
  const r = record
  const marginAbs = Math.abs(r.margin)
  const marginSign = r.margin >= 0 ? "+" : "−"
  return (
    <TableRow className="align-top">
      <TableCell className="w-12 text-right font-mono text-muted-foreground">
        {r.ac}
      </TableCell>
      <TableCell className="font-medium">
        <Link
          to={`/explore?seat=${r.ac}`}
          className="hover:underline hover:underline-offset-2"
        >
          {r.name}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {districtLabel(r.district)}
      </TableCell>
      <TableCell className="whitespace-nowrap text-right tabular-nums">
        <span>{marginSign}{marginAbs.toFixed(1)}pp</span>{" "}
        <AlliancePill code={r.winner} />
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn("px-1.5 text-[10px] uppercase tracking-wider", TAG_COLORS[r.netTag])}
        >
          {TAG_LABELS[r.netTag] ?? r.netTag}
        </Badge>
      </TableCell>
      <TableCell className="text-center font-mono">{tierStars(r.confidence)}</TableCell>
      <TableCell className="text-center font-mono text-muted-foreground">
        {historyToken(r.history)}
      </TableCell>
      <TableCell className="whitespace-nowrap text-right tabular-nums">
        <span>{r.ndaShareTrajectory.y2026.toFixed(0)}%</span>{" "}
        <span className={cn("font-mono", TREND_COLORS[r.ndaTrend])}>
          {trendArrow(r.ndaTrend)}
        </span>
      </TableCell>
      <TableCell className="text-center">
        {r.stableFor ? (
          <span className="font-mono text-muted-foreground">→</span>
        ) : (
          <span className="text-muted-foreground/60">—</span>
        )}
        {r.stableFor && <AlliancePill code={r.stableFor} className="ml-1" />}
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {DRIVER_LABELS[r.primaryDriver] ?? r.primaryDriver}
      </TableCell>
      <TableCell className="text-muted-foreground leading-relaxed">
        {r.note}
      </TableCell>
    </TableRow>
  )
}

function SortableHead({
  label,
  sortKey,
  activeKey,
  dir,
  onToggle,
  className,
}: {
  label: string
  sortKey: SortKey
  activeKey: SortKey
  dir: SortDir
  onToggle: (k: SortKey) => void
  className?: string
}) {
  const isActive = activeKey === sortKey
  const Icon = !isActive ? IconArrowsSort : dir === "asc" ? IconArrowUp : IconArrowDown
  return (
    <TableHead className={cn("cursor-pointer select-none", className)}>
      <button
        type="button"
        onClick={() => onToggle(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 hover:text-foreground",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <span>{label}</span>
        <Icon size={12} className="opacity-70" />
      </button>
    </TableHead>
  )
}

function FilterBar({
  search,
  onSearch,
  driverFilter,
  onToggleDriver,
  tagFilter,
  onToggleTag,
  trendFilter,
  onToggleTrend,
  onClear,
  hasAnyFilter,
  totalFiltered,
  totalAll,
}: {
  search: string
  onSearch: (s: string) => void
  driverFilter: Set<string>
  onToggleDriver: (v: string) => void
  tagFilter: Set<string>
  onToggleTag: (v: string) => void
  trendFilter: Set<string>
  onToggleTrend: (v: string) => void
  onClear: () => void
  hasAnyFilter: boolean
  totalFiltered: number
  totalAll: number
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search AC or district…"
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">
          {totalFiltered === totalAll
            ? `${totalAll} ACs`
            : `${totalFiltered} of ${totalAll} ACs`}
        </div>
        {hasAnyFilter && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 gap-1 text-xs"
          >
            <IconX size={12} />
            Clear filters
          </Button>
        )}
      </div>

      <FilterChipGroup
        label="Driver"
        options={[
          ["both-christian-muslim", "Christian + Muslim"],
          ["christian-subrite", "Christian sub-rite"],
          ["christian-aggregate", "Christian aggregate"],
          ["muslim", "Muslim"],
          ["hindu-district", "Hindu"],
          ["diffuse", "Diffuse"],
        ]}
        active={driverFilter}
        onToggle={onToggleDriver}
      />
      <FilterChipGroup
        label="Tag"
        options={[
          ["decisive", "Decisive"],
          ["blocking", "Blocking"],
          ["hindu-driven", "Hindu-driven"],
          ["diffuse", "Diffuse"],
        ]}
        active={tagFilter}
        onToggle={onToggleTag}
      />
      <FilterChipGroup
        label="NDA trend"
        options={[
          ["rising", "Rising ↑"],
          ["flat", "Flat →"],
          ["declining", "Declining ↓"],
          ["unknown", "Unknown ?"],
        ]}
        active={trendFilter}
        onToggle={onToggleTrend}
      />
    </div>
  )
}

function FilterChipGroup({
  label,
  options,
  active,
  onToggle,
}: {
  label: string
  options: [string, string][]
  active: Set<string>
  onToggle: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {options.map(([value, displayLabel]) => {
        const isActive = active.has(value)
        return (
          <button
            type="button"
            key={value}
            onClick={() => onToggle(value)}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:border-foreground/60 hover:text-foreground"
            )}
          >
            {displayLabel}
          </button>
        )
      })}
    </div>
  )
}

function AboutPopover() {
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <p>
        Each row is one of Kerala's 140 ACs. The framework assigns each AC a{" "}
        <strong>primary driver</strong> (which community is most relevant), a{" "}
        <strong>net tag</strong> (decisive / blocking / hindu-driven / diffuse), and a{" "}
        <strong>confidence tier</strong> (★★★ HIGH / ★★ MEDIUM / ★ LOW).
      </p>
      <p>
        Stability has three dimensions: <strong>History</strong> shows the
        winner across 2016 / 2021 / 2026 (e.g. <code className="text-xs">U-L-U</code>{" "}
        = UDF → LDF → UDF). <strong>NDA%</strong> shows BJP's 2026 vote share
        and the 10-year trend (↑ rising +3pp, ↓ declining −3pp, → flat).{" "}
        <strong>Stable</strong> is the forward-structural reading from the
        blocker pattern.
      </p>
      <p>
        The <strong>Note</strong> column summarises the relevant communities
        plus compact alliance-role tokens — <code className="text-xs">flip→UDF</code>,{" "}
        <code className="text-xs">block-NDA</code>, <code className="text-xs">stable-UDF</code>, etc.
      </p>
      <p className="border-t pt-3 text-muted-foreground">
        Click any AC name to open the per-seat detail view on Explore.
      </p>
    </div>
  )
}
