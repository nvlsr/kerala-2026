import { useState } from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ScopeTitle } from "@/components/scope-title"
import { KeralaMap } from "@/components/kerala-map"
import { AllianceSection } from "@/components/alliance-section"
import { PartySection } from "@/components/party-section"
import { CandidateTable } from "@/components/candidate-table"
import { ConstituencySection } from "@/components/constituency-section"
import { constituencies, type AllianceCode } from "@/lib/data"

export function App() {
  const [scope, setScope] = useState<string | null>(null)
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null)
  const [selectedAlliance, setSelectedAlliance] = useState<AllianceCode | null>(
    null
  )
  const [selectedParty, setSelectedParty] = useState<string | null>(null)

  const selectedConstituency =
    selectedSeat != null
      ? (constituencies.find((c) => c.constituencyNumber === selectedSeat) ??
        null)
      : null

  const handleSelectAlliance = (code: AllianceCode | null) => {
    setSelectedAlliance(code)
    if (code !== selectedAlliance) setSelectedParty(null)
  }

  return (
    <TooltipProvider delay={200}>
      <div className="min-h-svh bg-background text-foreground">
        <ScopeTitle
          scope={scope}
          selectedAlliance={selectedAlliance}
          selectedParty={selectedParty}
          selectedSeat={selectedSeat}
          onClearScope={() => setScope(null)}
          onClearAlliance={() => handleSelectAlliance(null)}
          onClearParty={() => setSelectedParty(null)}
          onClearSeat={() => setSelectedSeat(null)}
        />
        <KeralaMap scope={scope} onSelect={setScope} />
        <AllianceSection
          scope={scope}
          selectedAlliance={selectedAlliance}
          onSelectAlliance={handleSelectAlliance}
        />
        {selectedAlliance && (
          <PartySection
            scope={scope}
            alliance={selectedAlliance}
            selectedParty={selectedParty}
            onSelectParty={setSelectedParty}
          />
        )}
        <CandidateTable
          scope={scope}
          alliance={selectedAlliance}
          party={selectedParty}
          selectedConstituency={selectedSeat}
          onSelectConstituency={setSelectedSeat}
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
