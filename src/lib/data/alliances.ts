import { alliancesMeta } from "@/lib/data/loaders"
import { canonicalPartyName } from "@/lib/data/parties"
import type { Candidate } from "@/lib/data/constituencies"

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
  return (
    typeof value === "string" && ALLIANCE_CODE_SET.has(value as AllianceCode)
  )
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

/**
 * The alliance lives directly on the candidate record (rehydrated by
 * `hydrateConstituency` from the canonical party→alliance map). This
 * helper just reads it through, kept as a named function so call sites
 * read intent ("alliance for THIS candidate") rather than dotting into
 * a generic field.
 */
export function allianceForCandidate(candidate: Candidate): AllianceCode {
  return candidate.alliance
}

/**
 * Used in places that have a raw party string but no candidate context
 * (e.g. tests, party-trend aggregations that walk the partyToAlliance
 * map directly). Independents can't be classified via this path because
 * we don't know which Independent candidate is being referred to —
 * always returns OTHER for them. Use `candidate.alliance` whenever a
 * candidate object is in scope.
 */
export function allianceForRawParty(party: string): AllianceCode {
  const canonical = canonicalPartyName(party)
  if (canonical === "Independent") return "OTHER"
  return (alliancesMeta.partyToAlliance[canonical] ?? "OTHER") as AllianceCode
}
