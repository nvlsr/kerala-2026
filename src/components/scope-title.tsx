import { IconChevronDown, IconChevronRight, IconX } from "@tabler/icons-react"

import { ReservationBadge } from "@/components/reservation-badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  constituencies,
  displayConstituencyName,
  districts,
  getDistrict,
  MAIN_FRONT_CODES,
  partyShort,
  type AllianceCode,
} from "@/lib/data"

/**
 * The site's home-page title block — "Kerala · May 2026 / Legislative
 * Assembly Election Results" + the theme toggle. Used on `/` only.
 * Other pages (/explore, /flows, /drifts, /belts, /religion-map,
 * /questions, /religion-map) render their own custom headers.
 */
export function HomeHeader() {
  return (
    <header>
      <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-6">
        <div className="min-w-0">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Kerala · May 2026
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Legislative Assembly Election Results
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

type FilterBreadcrumbProps = {
  scope: string | null
  selectedAlliance: AllianceCode | null
  selectedParty: string | null
  selectedSeat: number | null
  canReset: boolean
  onSetScope: (district: string) => void
  onSetAlliance: (alliance: AllianceCode) => void
  onClearScope: () => void
  onClearAlliance: () => void
  onClearParty: () => void
  onClearSeat: () => void
  onReset: () => void
}

const DISTRICT_OPTIONS: FilterOption[] = districts.map((d) => ({
  value: d.id,
  label: d.name,
}))

const ALLIANCE_OPTIONS: FilterOption[] = MAIN_FRONT_CODES.map((code) => ({
  value: code,
  label: code,
}))

/**
 * Sticky filter breadcrumb. Used on `/explore` to surface the active
 * filter chain ("Kerala > Kollam > NDA > BJP > Aluva") and to *set*
 * the district + alliance dims (each is either a clearable value pill
 * if filtered, or a dropdown picker if not). Party + seat are
 * read-only crumbs — party is set via PartySection rows, seat via the
 * candidate table or constituency map.
 */
export function FilterBreadcrumb({
  scope,
  selectedAlliance,
  selectedParty,
  selectedSeat,
  canReset,
  onSetScope,
  onSetAlliance,
  onClearScope,
  onClearAlliance,
  onClearParty,
  onClearSeat,
  onReset,
}: FilterBreadcrumbProps) {
  const district = scope ? getDistrict(scope) : null
  const constituency =
    selectedSeat != null
      ? (constituencies.find((c) => c.constituencyNumber === selectedSeat) ??
        null)
      : null

  return (
    <nav
      aria-label="Active filters"
      className="sticky top-0 z-40 border-y bg-background/85 supports-backdrop-filter:backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-6 py-2 text-xs">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="rounded font-medium text-foreground/80 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          Kerala
        </button>
        {district ? (
          <Crumb label={district.name} onClear={onClearScope} />
        ) : (
          <FilterPicker
            label="District"
            options={DISTRICT_OPTIONS}
            onSelect={onSetScope}
          />
        )}
        {selectedAlliance ? (
          <Crumb label={selectedAlliance} onClear={onClearAlliance} />
        ) : (
          <FilterPicker
            label="Alliance"
            options={ALLIANCE_OPTIONS}
            onSelect={(value) => onSetAlliance(value as AllianceCode)}
          />
        )}
        {selectedParty && (
          <Crumb label={partyShort(selectedParty)} onClear={onClearParty} />
        )}
        {constituency && (
          <Crumb
            label={
              <span className="inline-flex items-center gap-1">
                {displayConstituencyName(constituency)}
                <ReservationBadge seat={constituency.constituencyNumber} />
              </span>
            }
            ariaLabel={displayConstituencyName(constituency)}
            onClear={onClearSeat}
          />
        )}
        {canReset && (
          <button
            type="button"
            onClick={onReset}
            className="ml-auto rounded-full px-2 py-0.5 font-medium text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>
    </nav>
  )
}

/** Active-filter pill: value + X-to-clear, with the leading separator. */
function Crumb({
  label,
  ariaLabel,
  onClear,
}: {
  label: React.ReactNode
  /** Override for the X-button's aria-label. Defaults to the label
   *  when label is a string; required otherwise (else screen readers
   *  hear "Clear [object Object]"). */
  ariaLabel?: string
  onClear: () => void
}) {
  const clearLabel =
    ariaLabel ?? (typeof label === "string" ? label : "filter")
  return (
    <span className="flex items-center gap-1.5">
      <IconChevronRight
        className="h-3 w-3 text-muted-foreground/50"
        aria-hidden
      />
      <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-0.5 font-medium">
        {label}
        <button
          type="button"
          onClick={onClear}
          aria-label={`Clear ${clearLabel}`}
          className="rounded-full p-0.5 hover:bg-foreground/10"
        >
          <IconX className="h-3 w-3" aria-hidden />
        </button>
      </span>
    </span>
  )
}

type FilterOption = { value: string; label: string }

/**
 * Empty-slot trigger pill in the breadcrumb. Renders a dashed-border
 * "{label} ⌄" trigger; clicking it opens a dropdown of `options`.
 * Used for district + alliance — both are low-cardinality, fixed
 * lists. Once a value is set, the parent swaps in a `Crumb` instead;
 * clearing brings the picker back.
 */
function FilterPicker({
  label,
  options,
  onSelect,
}: {
  label: string
  options: FilterOption[]
  onSelect: (value: string) => void
}) {
  return (
    <span className="flex items-center gap-1.5">
      <IconChevronRight
        className="h-3 w-3 text-muted-foreground/50"
        aria-hidden
      />
      <Popover>
        <PopoverTrigger
          className="inline-flex items-center gap-1 rounded-full border border-dashed bg-transparent px-2 py-0.5 font-medium text-muted-foreground hover:border-solid hover:bg-muted/40 hover:text-foreground"
          aria-label={`Filter by ${label.toLowerCase()}`}
        >
          {label}
          <IconChevronDown className="h-3 w-3" aria-hidden />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-44 p-1">
          <ul role="listbox" aria-label={`${label} options`}>
            {options.map((o) => (
              <li key={o.value} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => onSelect(o.value)}
                  className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-foreground/5"
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </span>
  )
}
