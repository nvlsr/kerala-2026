import { useEffect, useMemo, useReducer } from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ScopeTitle } from "@/components/scope-title"
import { KeralaMap } from "@/components/kerala-map"
import { AllianceSection } from "@/components/alliance-section"
import { PartySection } from "@/components/party-section"
import { CandidateTable } from "@/components/candidate-table"
import { ConstituencyMap } from "@/components/constituency-map"
import { ConstituencySection } from "@/components/constituency-section"
import { constituencies } from "@/lib/data"
import {
  filtersReducer,
  getFilteredConstituencyNumbers,
  initialFilters,
  parseFilters,
  serializeFilters,
} from "@/lib/filters"

function loadInitialFilters() {
  if (typeof window === "undefined") return initialFilters
  return parseFilters(new URLSearchParams(window.location.search))
}

export function App() {
  const [filters, dispatch] = useReducer(
    filtersReducer,
    undefined,
    loadInitialFilters
  )

  useEffect(() => {
    const params = serializeFilters(filters)
    const query = params.toString()
    const url = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname
    window.history.replaceState(null, "", url)
  }, [filters])

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
    <TooltipProvider delay={200}>
      <div className="min-h-svh bg-background text-foreground">
        <ScopeTitle
          scope={filters.district}
          selectedAlliance={filters.alliance}
          selectedParty={filters.party}
          selectedSeat={filters.seat}
          onClearScope={() => dispatch({ type: "clear-district" })}
          onClearAlliance={() => dispatch({ type: "clear-alliance" })}
          onClearParty={() => dispatch({ type: "clear-party" })}
          onClearSeat={() => dispatch({ type: "clear-seat" })}
        />
        <KeralaMap
          scope={filters.district}
          onSelect={(district) => dispatch({ type: "set-district", district })}
        />
        <AllianceSection
          scope={filters.district}
          selectedAlliance={filters.alliance}
          onSelectAlliance={(alliance) =>
            dispatch({ type: "set-alliance", alliance })
          }
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
          inFilterSet={inFilterSet}
          selectedSeat={filters.seat}
          onSelect={(seat) => dispatch({ type: "set-seat", seat })}
        />
        {selectedConstituency && (
          <ConstituencySection
            key={selectedConstituency.constituencyNumber}
            constituency={selectedConstituency}
          />
        )}
        <footer className="mx-auto max-w-6xl px-6 pt-2 pb-10 text-xs text-muted-foreground">
          Source: Election Commission of India · results.eci.gov.in
        </footer>
      </div>
    </TooltipProvider>
  )
}

export default App
