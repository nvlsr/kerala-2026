/**
 * Geographic-zone grouping for Kerala's 14 districts.
 *
 * Used by analyses that need a coarser-than-district axis (e.g. the
 * Christian-walkthrough's within-Latin north/south split).
 *
 * Definitions:
 *   south   — Trivandrum / Kollam / Pathanamthitta
 *   central — Alappuzha / Kottayam / Ernakulam / Thrissur / Idukki / Palakkad
 *   north   — Kozhikode / Malappuram / Kannur / Kasaragod / Wayanad
 *
 * Palakkad sits in "central" rather than "north" because it lines up
 * politically + culturally with the central Travancore-Cochin
 * communities more than the Malabar coast (most Muslim-belt + Hindu-
 * interior dynamics there match central Kerala patterns).
 */
import districtsJson from "@data/districts.json"

export type Zone = "south" | "central" | "north"

export const ZONE: Record<string, Zone> = {
  thiruvananthapuram: "south",
  kollam: "south",
  pathanamthitta: "south",
  alappuzha: "central",
  kottayam: "central",
  ernakulam: "central",
  thrissur: "central",
  idukki: "central",
  palakkad: "central",
  kozhikode: "north",
  malappuram: "north",
  kannur: "north",
  kasaragod: "north",
  wayanad: "north",
}

// Sanity check at module load — if districts.json adds or renames a
// district, the ZONE table must be updated. Throws early rather than
// silently mismapping in downstream analyses.
{
  const districts = (districtsJson as { districts: Array<{ id: string }> })
    .districts
  const known = new Set(Object.keys(ZONE))
  const expected = new Set(districts.map((d) => d.id))
  const missing = [...expected].filter((id) => !known.has(id))
  const extra = [...known].filter((id) => !expected.has(id))
  if (missing.length > 0 || extra.length > 0) {
    throw new Error(
      `zones.ts ZONE table out of sync with districts.json: ` +
        (missing.length > 0 ? `missing [${missing.join(", ")}] ` : "") +
        (extra.length > 0 ? `extra [${extra.join(", ")}]` : "")
    )
  }
}

export function getDistrictZone(districtId: string): Zone | null {
  return ZONE[districtId] ?? null
}
