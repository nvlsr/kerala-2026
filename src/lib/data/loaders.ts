/**
 * Raw data imports + parsed metadata. All other data modules read from here.
 *
 * The actual JSON files in @data/* are the source of truth; this module is the
 * single boundary between "static JSON" and "typed runtime values used by the
 * app".
 */
import alliancesJson from "@data/alliances.json"
import candidateAliasesJson from "@data/candidate-aliases.json"
import communityBeltsJson from "@data/community-belts.json"
import constituenciesJson from "@data/kerala-2026.json"
import constituencyNamesJson from "@data/constituency-names.json"
import demographicsJson from "@data/demographics.json"
import districtsJson from "@data/districts.json"

import type { Alliance, AllianceCode } from "@/lib/data/alliances"
import type { Constituency } from "@/lib/data/constituencies"
import type { District } from "@/lib/data/districts"
import type { ReligionCode } from "@/lib/data/demographics"

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

export const constituencyNames = constituencyNamesJson as Record<
  string,
  ConstituencyNameEntry
>

export const constituenciesData =
  constituenciesJson as unknown as Constituency[]

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
