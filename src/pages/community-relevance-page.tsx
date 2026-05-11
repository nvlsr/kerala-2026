import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { IconX } from "@tabler/icons-react"

import { AlliancePill } from "@/components/alliance-pill"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import {
  communityRelevance,
  type CommunityRelevanceRecord,
} from "@/lib/data/community-relevance"
import { districts as ALL_DISTRICTS } from "@/lib/data/districts"
import { cn } from "@/lib/utils"

const DISTRICT_LOOKUP = new Map(ALL_DISTRICTS.map((d) => [d.id, d.name]))

function districtLabel(id: string): string {
  return DISTRICT_LOOKUP.get(id) ?? id
}

/**
 * Per-AC community-relevance — the rich-story view.
 *
 * For each AC, the framework composes a 5-sentence narrative
 * (`record.story`) that splices together:
 *   1. Headline — margin, winner, cycle story, candidate tenure
 *   2. Driver — which Christian sub-rites / Muslim / Hindu sub-caste matter (with %)
 *   3. Geographic context — Muslim sub-type + Hindu district profile
 *   4. Structural reading — `stableFor` + blocker pattern
 *   5. Trajectory + 2031 watch — history + NDA share trend
 *
 * Filters (chip groups) let you narrow to a sub-set; rows link to
 * `/explore?seat=N` for per-seat detail. Framework: docs/community-relevance.md.
 */
export function CommunityRelevancePage() {
  const [search, setSearch] = useState("")
  const [driverFilter, setDriverFilter] = useState<Set<string>>(new Set())
  const [tagFilter, setTagFilter] = useState<Set<string>>(new Set())
  const [trendFilter, setTrendFilter] = useState<Set<string>>(new Set())
  const [stableFilter, setStableFilter] = useState<Set<string>>(new Set())
  const [winnerFilter, setWinnerFilter] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return communityRelevance.filter((r) => {
      if (q) {
        const hay = `${r.name.toLowerCase()} ${districtLabel(r.district).toLowerCase()} ${r.story.toLowerCase()}`
        if (!hay.includes(q)) return false
      }
      if (driverFilter.size > 0 && !driverFilter.has(r.primaryDriver)) return false
      if (tagFilter.size > 0 && !tagFilter.has(r.netTag)) return false
      if (trendFilter.size > 0 && !trendFilter.has(r.ndaTrend)) return false
      if (stableFilter.size > 0) {
        const key = r.stableFor ?? "none"
        if (!stableFilter.has(key)) return false
      }
      if (winnerFilter.size > 0 && !winnerFilter.has(r.winner)) return false
      return true
    })
  }, [search, driverFilter, tagFilter, trendFilter, stableFilter, winnerFilter])

  function toggleSet(set: Set<string>, value: string, setter: (s: Set<string>) => void) {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setter(next)
  }

  const totalFiltered = filtered.length
  const totalAll = communityRelevance.length
  const hasAnyFilter =
    search.length > 0 ||
    driverFilter.size > 0 ||
    tagFilter.size > 0 ||
    trendFilter.size > 0 ||
    stableFilter.size > 0 ||
    winnerFilter.size > 0

  return (
    <PageShell
      breadcrumbs={[{ label: "Community relevance" }]}
      title="Community relevance"
      subtitle={
        <p className="max-w-prose">
          Per-AC narrative reading. Each row is one of Kerala's 140 ACs;
          the story is composed from the structured framework (driver +
          tag + 3-cycle history + NDA trajectory + structural lock +
          candidate tenure). Framework documented at{" "}
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
            stableFilter={stableFilter}
            onToggleStable={(v) => toggleSet(stableFilter, v, setStableFilter)}
            winnerFilter={winnerFilter}
            onToggleWinner={(v) => toggleSet(winnerFilter, v, setWinnerFilter)}
            onClear={() => {
              setSearch("")
              setDriverFilter(new Set())
              setTagFilter(new Set())
              setTrendFilter(new Set())
              setStableFilter(new Set())
              setWinnerFilter(new Set())
            }}
            hasAnyFilter={hasAnyFilter}
            totalFiltered={totalFiltered}
            totalAll={totalAll}
          />

          <div className="space-y-3">
            {filtered.map((r) => (
              <StoryCard key={r.ac} record={r} />
            ))}
            {filtered.length === 0 && (
              <p className="rounded-md border bg-muted/30 py-12 text-center text-sm text-muted-foreground">
                No ACs match the current filters.
              </p>
            )}
          </div>
        </div>
      </PageMain>
    </PageShell>
  )
}

function StoryCard({ record }: { record: CommunityRelevanceRecord }) {
  const r = record
  return (
    <article className="rounded-md border bg-card p-4 transition-colors hover:border-foreground/30">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Link
          to={`/explore?seat=${r.ac}`}
          className="font-medium tracking-tight hover:underline hover:underline-offset-2"
        >
          <span className="mr-1.5 font-mono text-xs text-muted-foreground">
            {r.ac}
          </span>
          {r.name}
        </Link>
        <span className="text-xs text-muted-foreground">
          {districtLabel(r.district)}
        </span>
        <AlliancePill code={r.winner} className="ml-auto" />
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{r.story}</p>
    </article>
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
  stableFilter,
  onToggleStable,
  winnerFilter,
  onToggleWinner,
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
  stableFilter: Set<string>
  onToggleStable: (v: string) => void
  winnerFilter: Set<string>
  onToggleWinner: (v: string) => void
  onClear: () => void
  hasAnyFilter: boolean
  totalFiltered: number
  totalAll: number
}) {
  return (
    <div className="space-y-3 rounded-md border bg-muted/20 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search AC / district / story…"
          className="flex-1 min-w-48 rounded-md border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="text-xs text-muted-foreground tabular-nums">
          {totalFiltered === totalAll
            ? `${totalAll} ACs`
            : `${totalFiltered} of ${totalAll}`}
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
            Clear
          </Button>
        )}
      </div>

      <FilterChipGroup
        label="Winner"
        options={[
          ["UDF", "UDF"],
          ["LDF", "LDF"],
          ["NDA", "NDA"],
        ]}
        active={winnerFilter}
        onToggle={onToggleWinner}
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
        label="Structurally locked for"
        options={[
          ["UDF", "→UDF"],
          ["LDF", "→LDF"],
          ["NDA", "→NDA"],
          ["none", "Contested"],
        ]}
        active={stableFilter}
        onToggle={onToggleStable}
      />
      <FilterChipGroup
        label="NDA trend"
        options={[
          ["rising", "Rising ↑"],
          ["flat", "Flat →"],
          ["declining", "Declining ↓"],
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
