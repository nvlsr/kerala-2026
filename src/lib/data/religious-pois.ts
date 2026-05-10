/**
 * Religious place-of-worship inventory (from OpenStreetMap).
 *
 * Source: `data/ac-religious-poi-inventory.json` — derived from the
 * Overpass dump via `scripts/classify-osm-pow.ts` +
 * `scripts/aggregate-ac-religion-pois.ts`. See `data/raw/osm/README.md`
 * for the pipeline and caveats.
 *
 * CAVEAT: POI counts are NOT population shares. Hindu temples are
 * smaller and more numerous per capita than churches/mosques. Use these
 * counts to identify *dominant sub-rite among that religion's POIs in
 * an AC*, not to estimate religious composition.
 */
import inventoryJson from "@data/ac-religious-poi-inventory.json"

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

/**
 * Build a `{ ac_id (as string) → share (0-100) }` map for a single
 * sub-rite. Share is computed as a percent of that religion's
 * classified POIs in the AC (i.e. excluding the "(none)" bucket).
 * ACs with zero classified POIs of that religion get omitted.
 */
export function buildChristianDenominationShareMap(
  denom: ChristianDenomination
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const r of religiousPOIs) {
    const buckets = r.by_christian_denomination
    let classified = 0
    for (const [k, v] of Object.entries(buckets)) {
      if (k !== "(none)") classified += v
    }
    if (classified === 0) continue
    const n = buckets[denom] ?? 0
    out[String(r.ac_id)] = (n / classified) * 100
  }
  return out
}

export function buildMuslimDenominationShareMap(
  denom: MuslimDenomination
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const r of religiousPOIs) {
    const buckets = r.by_muslim_denomination
    let classified = 0
    for (const [k, v] of Object.entries(buckets)) {
      if (k !== "(none)") classified += v
    }
    if (classified === 0) continue
    const n = buckets[denom] ?? 0
    out[String(r.ac_id)] = (n / classified) * 100
  }
  return out
}

/**
 * Map of `{ ac_id (as string) → dominant sub-rite }`. ACs with no
 * classified POIs of that religion get omitted (so consumers can show
 * them as a separate "no data" colour).
 */
export function buildDominantChristianMap(): Record<
  string,
  ChristianDenomination
> {
  const out: Record<string, ChristianDenomination> = {}
  for (const r of religiousPOIs) {
    if (r.dominant_christian_denomination) {
      out[String(r.ac_id)] = r.dominant_christian_denomination
    }
  }
  return out
}

export function buildDominantMuslimMap(): Record<string, MuslimDenomination> {
  const out: Record<string, MuslimDenomination> = {}
  for (const r of religiousPOIs) {
    if (r.dominant_muslim_denomination) {
      out[String(r.ac_id)] = r.dominant_muslim_denomination
    }
  }
  return out
}

/** Total classified POIs of a religion in an AC (excludes "(none)" bucket). */
export function getClassifiedCount(
  ac: ACReligiousInventory,
  religion: "christian" | "muslim"
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
