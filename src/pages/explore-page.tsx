import { useEffect, useMemo, useReducer, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import { FilterBreadcrumb } from "@/components/scope-title"
import { AllianceSection } from "@/components/alliance-section"
import { PartySection } from "@/components/party-section"
import { CandidateTable } from "@/components/candidate-table"
import {
  ConstituencyMap,
  Hint,
  describeMapSubtitle,
} from "@/components/constituency-map"
import { ConstituencySection } from "@/components/constituency-section"
import { QuestionsTeaser } from "@/components/questions-teaser"
import { SearchBar } from "@/components/search-bar"
import { SeatPreviewCard } from "@/components/seat-preview-card"
import { Section } from "@/components/section"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  constituencies,
  displayConstituencyName,
  districtForConstituency,
} from "@/lib/data"
import {
  filtersReducer,
  getFilteredConstituencyNumbers,
  hasActiveFilters,
  initialFilters,
  parseFilters,
  serializeFilters,
} from "@/lib/filters"
import { encodingModeFor } from "@/lib/seat-encoding"

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
  const location = useLocation()

  // Sync filter state to URL on every change.
  useEffect(() => {
    const params = serializeFilters(filters)
    const query = params.toString()
    const url = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname
    window.history.replaceState(null, "", url)
  }, [filters])

  // Sync URL → filters when React Router drives a navigation (search bar
  // routing to /explore?alliance=…, deep links from elsewhere, back/forward).
  // Internal filter changes use window.history.replaceState which bypasses
  // React Router, so this effect doesn't loop with the one above.
  useEffect(() => {
    const next = parseFilters(new URLSearchParams(location.search))
    dispatch({ type: "replace", filters: next })
  }, [location.search])

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
    <div className="flex min-h-svh flex-col bg-background text-foreground">
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
        onSetScope={(district) => dispatch({ type: "set-district", district })}
        onSetAlliance={(alliance) =>
          dispatch({ type: "set-alliance", alliance })
        }
        onClearScope={() => dispatch({ type: "clear-district" })}
        onClearAlliance={() => dispatch({ type: "clear-alliance" })}
        onClearParty={() => dispatch({ type: "clear-party" })}
        onClearSeat={() => dispatch({ type: "clear-seat" })}
        onReset={() => dispatch({ type: "reset" })}
      />
      <SearchBar />
      {(filters.district || filters.alliance) && (
        <AllianceSection
          scope={filters.district}
          selectedAlliance={filters.alliance}
          onSelectAlliance={(alliance) =>
            dispatch({ type: "set-alliance", alliance })
          }
        />
      )}
      {filters.alliance && (
        <PartySection
          scope={filters.district}
          alliance={filters.alliance}
          selectedParty={filters.party}
          onSelectParty={(party) => dispatch({ type: "set-party", party })}
        />
      )}
      <CandidateTable filters={filters} dispatch={dispatch} />
      <ConstituencyDetailRow
        filters={filters}
        inFilterSet={inFilterSet}
        selectedConstituency={selectedConstituency}
        onSelectSeat={(seat) => dispatch({ type: "set-seat", seat })}
      />
      <QuestionsTeaser />
      <SiteFooter />
    </div>
  )
}

/**
 * Two-column layout: left shows either the seat-detail (when a seat
 * is selected) or a Hint card (otherwise); right always shows the
 * constituency map. The map stays in a fixed position regardless of
 * selection, so clicking/unclicking a seat doesn't reflow the page.
 */
function ConstituencyDetailRow({
  filters,
  inFilterSet,
  selectedConstituency,
  onSelectSeat,
}: {
  filters: ReturnType<typeof loadInitialFilters>
  inFilterSet: Set<number>
  selectedConstituency: (typeof constituencies)[number] | null
  onSelectSeat: (n: number | null) => void
}) {
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null)
  const hoveredConstituency = useMemo(
    () =>
      hoveredSeat
        ? (constituencies.find(
            (c) => c.constituencyNumber === hoveredSeat
          ) ?? null)
        : null,
    [hoveredSeat]
  )

  const mapMode = encodingModeFor(filters)
  const mapSubtitle = describeMapSubtitle(filters, inFilterSet.size, mapMode)
  const district = selectedConstituency
    ? districtForConstituency(selectedConstituency)
    : null

  const subtitle = selectedConstituency ? (
    <>
      {displayConstituencyName(selectedConstituency)}
      {district && (
        <span className="text-muted-foreground/60">
          {" · "}
          {district.name} district
        </span>
      )}
    </>
  ) : (
    mapSubtitle
  )

  return (
    <Section
      title="Constituency map"
      subtitle={subtitle}
      className="scroll-mt-4"
    >
      <div
        id={SEAT_DETAIL_ANCHOR_ID}
        className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5"
      >
        <div className="lg:col-span-3">
          {selectedConstituency ? (
            <ConstituencySection
              key={selectedConstituency.constituencyNumber}
              constituency={selectedConstituency}
            />
          ) : hoveredConstituency ? (
            <SeatPreviewCard constituency={hoveredConstituency} />
          ) : (
            <Hint mode={mapMode} />
          )}
        </div>
        <div className="lg:col-span-2">
          <ConstituencyMap
            filters={filters}
            inFilterSet={inFilterSet}
            selectedSeat={filters.seat}
            hoveredSeat={hoveredSeat}
            onSelect={onSelectSeat}
            onHover={setHoveredSeat}
          />
        </div>
      </div>
    </Section>
  )
}
