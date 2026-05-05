import {
  themeLabel,
  type InsightParty,
  type InsightTheme,
} from "@/lib/curated-insights"
import { cn } from "@/lib/utils"

export type PartyFilter = InsightParty | "all"
export type ThemeFilter = InsightTheme | "all"

type Props = {
  parties: InsightParty[]
  themes: InsightTheme[]
  partyFilter: PartyFilter
  themeFilter: ThemeFilter
  onPartyChange: (next: PartyFilter) => void
  onThemeChange: (next: ThemeFilter) => void
  shownCount: number
  totalCount: number
}

export function InsightsFilterBar({
  parties,
  themes,
  partyFilter,
  themeFilter,
  onPartyChange,
  onThemeChange,
  shownCount,
  totalCount,
}: Props) {
  const isFiltered = partyFilter !== "all" || themeFilter !== "all"
  return (
    <nav
      aria-label="Insight filters"
      className="sticky top-0 z-40 border-y bg-background/85 supports-backdrop-filter:backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-3 text-xs sm:flex-row sm:items-center sm:gap-4">
        <FilterRow
          label="Party"
          allLabel="All parties"
          active={partyFilter}
          options={parties.map((p) => ({ value: p, label: p }))}
          onChange={(v) => onPartyChange(v as PartyFilter)}
        />
        <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
        <FilterRow
          label="Theme"
          allLabel="All themes"
          active={themeFilter}
          options={themes.map((t) => ({ value: t, label: themeLabel(t) }))}
          onChange={(v) => onThemeChange(v as ThemeFilter)}
        />
        <span
          className={cn(
            "ml-auto shrink-0 text-muted-foreground",
            isFiltered && "text-foreground"
          )}
        >
          {shownCount} of {totalCount}
        </span>
      </div>
    </nav>
  )
}

function FilterRow({
  label,
  allLabel,
  active,
  options,
  onChange,
}: {
  label: string
  allLabel: string
  active: string
  options: Array<{ value: string; label: string }>
  onChange: (next: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <Pill active={active === "all"} onClick={() => onChange("all")}>
        {allLabel}
      </Pill>
      {options.map((opt) => (
        <Pill
          key={opt.value}
          active={active === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Pill>
      ))}
    </div>
  )
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-xs font-medium transition",
        active
          ? "border-foreground bg-foreground text-background"
          : "bg-muted/40 hover:bg-foreground/10"
      )}
    >
      {children}
    </button>
  )
}
