/**
 * Raw data imports + parsed metadata. All other data modules read from here.
 *
 * The actual JSON files in @data/* are the source of truth; this module is the
 * single boundary between "static JSON" and "typed runtime values used by the
 * app".
 */
import acDemographicsJson from "@data/ac-religion.json"
import acDemographics2025Json from "@data/ac-religion-2025.json"
import alliancesJson from "@data/alliances.json"
import candidateAliasesJson from "@data/candidate-aliases.json"
import casteByDistrictJson from "@data/district-hindu-castes.json"
import communityBeltsJson from "@data/community-belts.json"
import constituenciesJson from "@data/results-2026.json"
import constituencyNamesJson from "@data/ac-names.json"
import demographicsJson from "@data/district-religion.json"
import districtsJson from "@data/districts.json"
import reservationsJson from "@data/reservations.json"

import type { Alliance, AllianceCode } from "@/lib/data/alliances"
import type { District } from "@/lib/data/districts"
import type { ReligionCode } from "@/lib/data/demographics"

export type RawCandidate = {
  name: string
  party: string
  votes: number
}

export type RawConstituency = {
  constituencyNumber: number
  candidates: RawCandidate[]
}

type RawResultsFile = Record<string, { candidates: RawCandidate[] }>

export const alliancesMeta = alliancesJson as {
  alliances: Record<AllianceCode, Alliance>
  partyToAlliance: Record<string, AllianceCode>
  partyAbbreviation: Record<string, string>
  partyAliases: Record<string, string>
}

export const abbreviationToFull: Record<string, string> = {}
for (const [full, abbr] of Object.entries(alliancesMeta.partyAbbreviation)) {
  abbreviationToFull[abbr] = full
}

export const candidateAliases = (
  candidateAliasesJson as { aliases: Record<string, string> }
).aliases

export type ConstituencyNameEntry = {
  primary: string
  eci: string
  wikipedia?: string
  wikipediaUrl?: string
  aliases?: string[]
}

type RawAcNameEntry = {
  primary: string
  wikipedia?: string
  aliases?: string[]
}

const rawAcNames = constituencyNamesJson as Record<string, RawAcNameEntry>

/**
 * AC display-name registry. `eci` (uppercase form) and `wikipediaUrl` are
 * derived: ECI form is always the uppercase primary, and the Wikipedia URL
 * follows the stable pattern `https://en.wikipedia.org/wiki/{wikipedia}_Assembly_constituency`.
 */
export const constituencyNames: Record<string, ConstituencyNameEntry> =
  Object.fromEntries(
    Object.entries(rawAcNames).map(([k, v]) => [
      k,
      {
        primary: v.primary,
        eci: v.primary.toUpperCase(),
        ...(v.wikipedia
          ? {
              wikipedia: v.wikipedia,
              wikipediaUrl: `https://en.wikipedia.org/wiki/${v.wikipedia}_Assembly_constituency`,
            }
          : {}),
        ...(v.aliases ? { aliases: v.aliases } : {}),
      },
    ])
  )

const rawResults = constituenciesJson as RawResultsFile

export const rawConstituencies: RawConstituency[] = Object.entries(
  rawResults
).map(([k, v]) => ({
  constituencyNumber: Number(k),
  candidates: v.candidates,
}))

export const districtsMeta = districtsJson as {
  districts: District[]
  constituencyToDistrict: Record<string, string>
}

type DistrictDemographics = {
  population: number
  religions: Record<ReligionCode, number>
}

export const demoMeta = demographicsJson as {
  year: number
  source: string
  note?: string
  districts: Record<string, DistrictDemographics>
}

export type AcDemographics = {
  matchedPopulation: number | null
  religions: Record<ReligionCode | "sikh" | "buddhist" | "jain", number>
  /**
   * `shrug-c01-aggregated` — directly aggregated from sub-district + town
   * Census shares using SHRUG keys (high-quality, 114 of 140 ACs)
   * `district-urban-fallback` — urban-heavy AC where SHRUG's spatial
   * join failed; uses district URBAN religion shares as a tactical fix
   * (see docs/data-pipeline.md for the improvement roadmap)
   */
  source:
    | "shrug-c01-aggregated"
    | "district-urban-fallback"
    | "district-total-fallback"
}

export const acDemoMeta = acDemographicsJson as {
  year: number
  source: string
  note?: string
  constituencies: Record<string, AcDemographics>
}

/**
 * State-level uniform projection of `acDemoMeta` to ~2025 using
 * cohort multipliers from CRS births-by-religion data. This is the
 * **default baseline** for both visualisation (/religion-map) and
 * walkthrough analysis. Pearson correlation differs from the raw
 * 2011 base by ≤0.011 (uniform multipliers preserve rank order), but
 * 2025 is reality-aligned for absolute-share statements. The raw
 * 2011 baseline lives in `acDemoMeta` and is available for
 * verification. See docs/data-pipeline.md.
 */
export const acDemo2025Meta = acDemographics2025Json as {
  year: number
  baseYear: number
  source: string
  note?: string
  multipliers: Record<string, number>
  constituencies: Record<string, AcDemographics>
}

/**
 * Hindu sub-community shares per district (~2000, Zachariah/KSI
 * survey). District-level only — no AC granularity. Denominator is
 * Hindu population in the district; multiply by district Hindu share
 * to recover fraction of total district population. State aggregate
 * is provided for fallback at non-district scopes. ~25 years stale;
 * geographic rank order is structurally stable, absolute shares may
 * have shifted modestly. See docs/caste-data.md.
 */
export type HinduCasteShares = {
  nair: number
  ezhava: number
  brahmin: number
  nadar: number
  viswakarma: number
  barber: number
  sc: number
  st: number
  other: number
}

export const casteByDistrictMeta = casteByDistrictJson as {
  year: number
  source: string
  sourceMethodology: string
  denominator: string
  note: string
  districts: Record<string, HinduCasteShares>
  stateAggregate: HinduCasteShares
}

export type BeltDef = {
  id: string
  label: string
  description: string
  color: string
}

export const beltsMeta = communityBeltsJson as {
  belts: BeltDef[]
  districtToBelt: Record<string, string>
  constituencyOverrides: Record<string, string | { _doc?: string }>
}

export type ReservationCode = "SC" | "ST"

/**
 * Per-AC reservation status. Stable across all four elections in our
 * dataset (2011, 2016, 2021, 2026) per the 2008 Delimitation Order;
 * the same 14 SC + 2 ST seats apply throughout. See data/reservations.json
 * for provenance.
 */
export const reservationsMeta = reservationsJson as {
  year: number
  source: string
  verified: string
  counts: { SC: number; ST: number; total: number }
  constituencyToReservation: Record<string, ReservationCode>
}
