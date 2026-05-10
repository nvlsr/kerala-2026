/**
 * Religious place-of-worship inventory (from OpenStreetMap).
 *
 * Source: `data/ac-religious-poi-inventory.json` — derived from the
 * Overpass dump via `scripts/classify-osm-pow.ts` +
 * `scripts/aggregate-ac-religion-pois.ts`. See `data/raw/osm/README.md`.
 *
 * The primary metric exposed here is **estimated sub-rite share of
 * total voters per AC** = `(sub-rite POI share among religion's POIs)
 * × (religion's population share from Census)`. This combines the OSM
 * within-religion mix with Census religion shares to produce something
 * that approximates "what fraction of this AC's voters belong to this
 * sub-community" — the electorally meaningful question.
 *
 * The assumption is that within a religion, POI distribution proxies
 * for population distribution. Between religions, POI counts mislead
 * (Hindu temples are smaller and more numerous per capita) and the
 * Census religion share carries the load.
 */
import inventoryJson from "@data/ac-religious-poi-inventory.json"

import { getReligionForAC } from "@/lib/data/demographics"

export type ChristianDenomination =
  | "latin_catholic"
  | "syro_malabar"
  | "syro_malankara"
  | "knanaya_catholic"
  | "marthoma"
  | "indian_orthodox"
  | "jacobite_syrian"
  | "knanaya_jacobite"
  | "csi"
  | "pentecostal"
  | "brethren"
  | "other_christian"

export type MuslimDenomination =
  | "sunni"
  | "salafi_mujahid"
  | "jamaat_islami"
  | "ahmadiyya"
  | "shia"
  | "other_muslim"

export type SubRiteReligion = "christian" | "muslim"
export type Year = 2011 | 2025

export type ACReligiousInventory = {
  ac_id: number
  ac_name: string
  district: string
  total_pois: number
  by_religion: {
    christian: number
    muslim: number
    hindu: number
    other: number
    unknown: number
  }
  by_christian_denomination: Record<string, number>
  by_muslim_denomination: Record<string, number>
  dominant_christian_denomination: ChristianDenomination | null
  dominant_muslim_denomination: MuslimDenomination | null
}

export const religiousPOIs = inventoryJson as unknown as ACReligiousInventory[]

const byAc = new Map<number, ACReligiousInventory>(
  religiousPOIs.map((r) => [r.ac_id, r])
)

export function getReligiousPOIsForAC(
  acNumber: number
): ACReligiousInventory | undefined {
  return byAc.get(acNumber)
}

/** Total classified POIs of a religion in an AC (excludes "(none)" bucket). */
export function getClassifiedCount(
  ac: ACReligiousInventory,
  religion: SubRiteReligion
): number {
  const buckets =
    religion === "christian"
      ? ac.by_christian_denomination
      : ac.by_muslim_denomination
  let n = 0
  for (const [k, v] of Object.entries(buckets)) {
    if (k !== "(none)") n += v
  }
  return n
}

/**
 * Detailed breakdown of a sub-rite's voter-share estimate for one AC.
 * Returns null if the AC is missing demographics or has no classified
 * POIs of that religion (i.e. the sub-rite mix is undetermined).
 */
export type VoterShareBreakdown = {
  religionPopPct: number // Census religion share of total population (0-100)
  subriteCount: number // POIs tagged/inferred to this sub-rite
  classifiedCount: number // total POIs of that religion with a known sub-rite
  subriteShareOfReligion: number // 0-100, POI share among classified
  voterSharePct: number // 0-100, the combined metric
}

export function getVoterShareBreakdown(
  acNumber: number,
  religion: SubRiteReligion,
  subrite: string,
  year: Year
): VoterShareBreakdown | null {
  const ac = byAc.get(acNumber)
  if (!ac) return null
  const demo = getReligionForAC(acNumber, year)
  if (!demo) return null
  const religionPopPct = demo.religions[religion] ?? 0
  if (religionPopPct === 0) return null
  const buckets =
    religion === "christian"
      ? ac.by_christian_denomination
      : ac.by_muslim_denomination
  const classified = getClassifiedCount(ac, religion)
  if (classified === 0) return null
  const subriteCount = buckets[subrite] ?? 0
  const subriteShareOfReligion = (subriteCount / classified) * 100
  const voterSharePct = (subriteShareOfReligion / 100) * religionPopPct
  return {
    religionPopPct,
    subriteCount,
    classifiedCount: classified,
    subriteShareOfReligion,
    voterSharePct,
  }
}

/**
 * Build `{ ac_id (as string) → voter-share % }` for a sub-rite.
 * Skips ACs where the sub-rite mix is undetermined (no classified POIs
 * of that religion) or where the religion is absent.
 */
export function buildSubRiteVoterShareMap(
  religion: SubRiteReligion,
  subrite: string,
  year: Year
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const ac of religiousPOIs) {
    const b = getVoterShareBreakdown(ac.ac_id, religion, subrite, year)
    if (!b) continue
    out[String(ac.ac_id)] = b.voterSharePct
  }
  return out
}

/**
 * Build `{ ac_id (as string) → dominant sub-rite }` filtered to ACs
 * where the dominant sub-rite is at least `minVoterSharePct` of the
 * total voter population. Below the threshold, the sub-rite isn't
 * electorally consequential and the AC is omitted.
 */
export function buildDominantSubRiteByVoterShare(
  religion: SubRiteReligion,
  year: Year,
  minVoterSharePct: number
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const ac of religiousPOIs) {
    const dominantField =
      religion === "christian"
        ? ac.dominant_christian_denomination
        : ac.dominant_muslim_denomination
    if (!dominantField) continue
    const b = getVoterShareBreakdown(
      ac.ac_id,
      religion,
      dominantField,
      year
    )
    if (!b) continue
    if (b.voterSharePct < minVoterSharePct) continue
    out[String(ac.ac_id)] = dominantField
  }
  return out
}

/**
 * Filter a voter-share map to only ACs at/above `minVoterSharePct`.
 * Used at render time so the gradient map can render below-threshold
 * ACs as a separate no-data colour rather than a faint tint.
 */
export function filterVoterShareMap(
  m: Record<string, number>,
  minVoterSharePct: number
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [k, v] of Object.entries(m)) {
    if (v >= minVoterSharePct) out[k] = v
  }
  return out
}
