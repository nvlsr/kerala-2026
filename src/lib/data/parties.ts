import { abbreviationToFull, alliancesMeta } from "@/lib/data/loaders"

export function partyShort(party: string): string {
  return alliancesMeta.partyAbbreviation[party] ?? party
}

export function canonicalPartyName(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return trimmed
  if (alliancesMeta.partyAbbreviation[trimmed]) return trimmed
  if (alliancesMeta.partyAliases[trimmed]) {
    return alliancesMeta.partyAliases[trimmed]
  }
  if (abbreviationToFull[trimmed]) return abbreviationToFull[trimmed]
  return trimmed
}
