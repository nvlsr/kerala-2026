import { useState } from "react"

import { ScopeTitle } from "@/components/scope-title"
import { StateHeader } from "@/components/state-header"
import { DistrictStrip } from "@/components/district-strip"
import { SeatGrid } from "@/components/seat-grid"
import { ConstituencyDetail } from "@/components/constituency-detail"
import { AllianceDetail } from "@/components/alliance-detail"
import { PartyDetail } from "@/components/party-detail"
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

  return (
    <div className="min-h-svh bg-background text-foreground">
      <ScopeTitle scope={scope} />
      <DistrictStrip scope={scope} onSelect={setScope} />
      <StateHeader scope={scope} onSelectAlliance={setSelectedAlliance} />
      <SeatGrid scope={scope} onSelect={setSelectedSeat} />
      <ConstituencyDetail
        constituency={selectedConstituency}
        onClose={() => setSelectedSeat(null)}
        onSelectDistrict={(districtId) => {
          setScope(districtId)
          setSelectedSeat(null)
        }}
        onSelectParty={setSelectedParty}
      />
      <AllianceDetail
        alliance={selectedAlliance}
        scope={scope}
        onClose={() => setSelectedAlliance(null)}
        onSelectParty={setSelectedParty}
      />
      <PartyDetail
        party={selectedParty}
        scope={scope}
        onClose={() => setSelectedParty(null)}
        onSelectConstituency={(n) => {
          setSelectedParty(null)
          setSelectedSeat(n)
        }}
      />
      <footer className="mx-auto max-w-6xl px-6 pt-2 pb-10 text-xs text-muted-foreground">
        Source: Election Commission of India · results.eci.gov.in
      </footer>
    </div>
  )
}

export default App
