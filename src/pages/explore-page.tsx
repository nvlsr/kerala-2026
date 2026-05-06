import { useEffect, useMemo, useReducer } from "react"
import { Link } from "react-router-dom"

import { FilterBreadcrumb } from "@/components/scope-title"
import { KeralaMap } from "@/components/kerala-map"
import { AllianceSection } from "@/components/alliance-section"
import { PartySection } from "@/components/party-section"
import { CandidateTable } from "@/components/candidate-table"
import { ConstituencyMap } from "@/components/constituency-map"
import { ConstituencySection } from "@/components/constituency-section"
import { InsightsTeaser } from "@/components/insights-teaser"
import { SearchBar } from "@/components/search-bar"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { constituencies } from "@/lib/data"
import {
  filtersReducer,
  getFilteredConstituencyNumbers,
  hasActiveFilters,
  initialFilters,
  parseFilters,
  serializeFilters,
} from "@/lib/filters"

const SEAT_DETAIL_ANCHOR_ID = "constituency-detail"

function loadInitialFilters() {
  if (typeof window === "undefined") return initialFilters
  return parseFilters(new URLSearchParams(window.location.search))
}

/**
 * Browse-driven explorer for the 140-seat dataset. Inherits the filter
 * cascade UI, candidate table, and detail panel that lived on the old
 * single-page dashboard. Reachable via:
 *   - Direct nav from `/` (the lean home)
 *   - Search results (search → /explore?seat=N etc.)
 *   - Deep links from /flows, /drifts, /belts, /religion-map
 */
export function ExplorePage() {
  const [filters, dispatch] = useReducer(
    filtersReducer,
    undefined,
    loadInitialFilters
  )

  // Sync filter state to URL on every change.
  useEffect(() => {
    const params = serializeFilters(filters)
    const query = params.toString()
    const url = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname
    window.history.replaceState(null, "", url)
  }, [filters])

  // Auto-scroll to the constituency detail panel when a seat becomes
  // selected (either via deep-link load, search-result click, or
  // constituency-map click). Skips if the seat is cleared.
  useEffect(() => {
    if (filters.seat == null) return
    const handle = requestAnimationFrame(() => {
      document
        .getElementById(SEAT_DETAIL_ANCHOR_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
    return () => cancelAnimationFrame(handle)
  }, [filters.seat])

  const inFilterSet = useMemo(
    () => getFilteredConstituencyNumbers(filters),
    [filters]
  )

  const selectedConstituency =
    filters.seat != null
      ? (constituencies.find((c) => c.constituencyNumber === filters.seat) ??
        null)
      : null

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header>
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 pt-6 pb-2">
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-foreground">
                Kerala 2026
              </Link>{" "}
              · Explorer
            </p>
            <h1 className="font-heading mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Browse all 140 seats
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Filter, sort, and dig into the constituency-level results.
              Click a district to filter by region, an alliance row to
              drill into its parties, or any seat on the constituency
              map below to open its detail panel. Filter state lives in
              the URL — every view is shareable.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <FilterBreadcrumb
        scope={filters.district}
        selectedAlliance={filters.alliance}
        selectedParty={filters.party}
        selectedSeat={filters.seat}
        canReset={hasActiveFilters(filters)}
        onClearScope={() => dispatch({ type: "clear-district" })}
        onClearAlliance={() => dispatch({ type: "clear-alliance" })}
        onClearParty={() => dispatch({ type: "clear-party" })}
        onClearSeat={() => dispatch({ type: "clear-seat" })}
        onReset={() => dispatch({ type: "reset" })}
      />
      <SearchBar />
      <AllianceSection
        scope={filters.district}
        selectedAlliance={filters.alliance}
        onSelectAlliance={(alliance) =>
          dispatch({ type: "set-alliance", alliance })
        }
      />
      <KeralaMap
        scope={filters.district}
        onSelect={(district) => dispatch({ type: "set-district", district })}
      />
      {filters.alliance && (
        <PartySection
          scope={filters.district}
          alliance={filters.alliance}
          selectedParty={filters.party}
          onSelectParty={(party) => dispatch({ type: "set-party", party })}
        />
      )}
      <CandidateTable filters={filters} dispatch={dispatch} />
      <ConstituencyMap
        filters={filters}
        inFilterSet={inFilterSet}
        selectedSeat={filters.seat}
        onSelect={(seat) => dispatch({ type: "set-seat", seat })}
      />
      {selectedConstituency && (
        <div id={SEAT_DETAIL_ANCHOR_ID}>
          <ConstituencySection
            key={selectedConstituency.constituencyNumber}
            constituency={selectedConstituency}
          />
        </div>
      )}
      <InsightsTeaser />
      <SiteFooter />
    </div>
  )
}
