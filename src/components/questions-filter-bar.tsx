import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  themeLabel,
  type QuestionParty,
  type QuestionTheme,
} from "@/lib/curated-questions"
import { cn } from "@/lib/utils"

export type PartyFilter = QuestionParty | "all"
export type ThemeFilter = QuestionTheme | "all"

type Props = {
  parties: QuestionParty[]
  themes: QuestionTheme[]
  partyFilter: PartyFilter
  themeFilter: ThemeFilter
  onPartyChange: (next: PartyFilter) => void
  onThemeChange: (next: ThemeFilter) => void
  shownCount: number
  totalCount: number
}

export function QuestionsFilterBar({
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
      aria-label="Question filters"
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

// className overrides to keep the existing pill aesthetic (rounded-full,
// shorter than default Toggle height) while leveraging ToggleGroup's
// single-select state machine and ARIA wiring. Tokens preserved from the
// previous hand-rolled Pill component. `aria-pressed:` (set by base-ui
// Toggle when active) drives the pressed-state styling.
const PILL_ITEM_CLASSES =
  "h-auto rounded-full border bg-muted/40 px-2.5 py-0.5 text-xs font-medium hover:bg-foreground/10 aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground"

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
      <ToggleGroup
        // base-ui ToggleGroup is single-select by default (multiple=false);
        // value is an array for shape consistency with the multi-select
        // case. Empty array can result if the user clicks the active
        // option to deselect — we treat that as "back to all".
        value={[active]}
        onValueChange={(v) => onChange((v[0] as string | undefined) ?? "all")}
        spacing={1.5}
        className="flex-wrap"
        aria-label={label}
      >
        <ToggleGroupItem value="all" className={PILL_ITEM_CLASSES}>
          {allLabel}
        </ToggleGroupItem>
        {options.map((opt) => (
          <ToggleGroupItem
            key={opt.value}
            value={opt.value}
            className={PILL_ITEM_CLASSES}
          >
            {opt.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
