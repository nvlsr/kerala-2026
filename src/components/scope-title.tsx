import { IconChevronRight, IconX } from "@tabler/icons-react"

import { ThemeToggle } from "@/components/theme-toggle"
import {
  constituencies,
  displayConstituencyName,
  getDistrict,
  partyShort,
  type AllianceCode,
} from "@/lib/data"

/**
 * The site's home-page title block — "Kerala · May 2026 / Legislative
 * Assembly Election Results" + the theme toggle. Used on `/` only.
 * Other pages (/explore, /flows, /drifts, /belts, /religion-map,
 * /insights, /religion-map) render their own custom headers.
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
  onClearScope: () => void
  onClearAlliance: () => void
  onClearParty: () => void
  onClearSeat: () => void
  onReset: () => void
}

type Crumb = { label: string; onClear: () => void }

/**
 * Sticky filter breadcrumb. Used on `/explore` to surface the active
 * filter chain ("Kerala > Kollam > NDA > BJP > Aluva") with per-segment
 * X buttons + a "Clear all" reset.
 */
export function FilterBreadcrumb({
  scope,
  selectedAlliance,
  selectedParty,
  selectedSeat,
  canReset,
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

  const crumbs: Crumb[] = []
  if (district) crumbs.push({ label: district.name, onClear: onClearScope })
  if (selectedAlliance)
    crumbs.push({ label: selectedAlliance, onClear: onClearAlliance })
  if (selectedParty)
    crumbs.push({ label: partyShort(selectedParty), onClear: onClearParty })
  if (constituency)
    crumbs.push({
      label: displayConstituencyName(constituency),
      onClear: onClearSeat,
    })

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
        {crumbs.map((c) => (
          <span key={c.label} className="flex items-center gap-1.5">
            <IconChevronRight
              className="h-3 w-3 text-muted-foreground/50"
              aria-hidden
            />
            <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-0.5 font-medium">
              {c.label}
              <button
                type="button"
                onClick={c.onClear}
                aria-label={`Clear ${c.label}`}
                className="rounded-full p-0.5 hover:bg-foreground/10"
              >
                <IconX className="h-3 w-3" aria-hidden />
              </button>
            </span>
          </span>
        ))}
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
