import { alliancesMeta } from "@/lib/data/loaders"
import { canonicalPartyName } from "@/lib/data/parties"
import type { Candidate, Constituency } from "@/lib/data/constituencies"

export type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER" | "NOTA"

export const ALLIANCE_CODES: readonly AllianceCode[] = [
  "UDF",
  "LDF",
  "NDA",
  "OTHER",
  "NOTA",
]
const ALLIANCE_CODE_SET: ReadonlySet<AllianceCode> = new Set(ALLIANCE_CODES)

export const MAIN_FRONT_CODES: readonly AllianceCode[] = ["UDF", "LDF", "NDA"]
const MAIN_FRONT_SET: ReadonlySet<AllianceCode> = new Set(MAIN_FRONT_CODES)

export const COMPARABLE_ALLIANCE_CODES: readonly AllianceCode[] = [
  "UDF",
  "LDF",
  "NDA",
  "OTHER",
]

export function isAllianceCode(value: unknown): value is AllianceCode {
  return typeof value === "string" && ALLIANCE_CODE_SET.has(value as AllianceCode)
}

export type Alliance = {
  code: AllianceCode
  name: string
  ledBy: string | null
  color: string
}

export const alliances: Alliance[] = ALLIANCE_CODES.map(
  (code) => alliancesMeta.alliances[code]
)

export function getAlliance(code: AllianceCode): Alliance {
  return alliancesMeta.alliances[code]
}

export function isMainFront(code: AllianceCode): boolean {
  return MAIN_FRONT_SET.has(code)
}

export function allianceForCandidate(
  c: Constituency,
  candidate: Candidate
): AllianceCode {
  if (candidate.isNota) return "NOTA"
  if (candidate.party === "Independent") {
    const key = `${c.constituencyNumber}:${candidate.name}`
    const override = alliancesMeta.independentOverrides[key]
    if (isAllianceCode(override)) return override
    return "OTHER"
  }
  return alliancesMeta.partyToAlliance[candidate.party] ?? "OTHER"
}

export function allianceForRawParty(party: string): AllianceCode {
  const canonical = canonicalPartyName(party)
  if (canonical === "Independent") return "OTHER"
  return (alliancesMeta.partyToAlliance[canonical] ?? "OTHER") as AllianceCode
}
