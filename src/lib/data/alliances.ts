import { alliancesMeta } from "@/lib/data/loaders"
import { canonicalPartyName } from "@/lib/data/parties"
import type { Candidate, Constituency } from "@/lib/data/constituencies"

export type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER" | "NOTA"

export type Alliance = {
  code: AllianceCode
  name: string
  ledBy: string | null
  color: string
}

export const alliances: Alliance[] = (
  ["UDF", "LDF", "NDA", "OTHER", "NOTA"] as AllianceCode[]
).map((code) => alliancesMeta.alliances[code])

export function getAlliance(code: AllianceCode): Alliance {
  return alliancesMeta.alliances[code]
}

const MAIN_FRONTS = new Set<AllianceCode>(["UDF", "LDF", "NDA"])
export function isMainFront(code: AllianceCode): boolean {
  return MAIN_FRONTS.has(code)
}

export function allianceForCandidate(
  c: Constituency,
  candidate: Candidate
): AllianceCode {
  if (candidate.isNota) return "NOTA"
  if (candidate.party === "Independent") {
    const key = `${c.constituencyNumber}:${candidate.name}`
    const override = alliancesMeta.independentOverrides[key]
    if (
      override === "UDF" ||
      override === "LDF" ||
      override === "NDA" ||
      override === "OTHER" ||
      override === "NOTA"
    ) {
      return override
    }
    return "OTHER"
  }
  return alliancesMeta.partyToAlliance[candidate.party] ?? "OTHER"
}

export function allianceForRawParty(party: string): AllianceCode {
  const canonical = canonicalPartyName(party)
  if (canonical === "Independent") return "OTHER"
  return (alliancesMeta.partyToAlliance[canonical] ?? "OTHER") as AllianceCode
}
