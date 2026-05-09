/**
 * Community-belt assignments for Kerala constituencies.
 *
 * The taxonomy in `data/community-belts.json` assigns each district to a
 * primary belt label based on academic literature (Zachariah et al 2003,
 * GeoCurrents Kerala synthesis 2014, KCBC diocese geography). Per-AC
 * overrides handle cases where a district default mis-represents a
 * specific seat's character.
 *
 * This is qualitative inference, not census measurement. The cross-tab
 * helpers below produce pattern-suggestive, not statistically-grounded,
 * counts.
 */

import { beltsMeta, type BeltDef } from "@/lib/data/loaders"
import { districtForConstituency } from "@/lib/data/districts"
import type { Constituency } from "@/lib/data/constituencies"

export type BeltCode = string

export const belts: BeltDef[] = beltsMeta.belts

const BELT_BY_ID: Map<string, BeltDef> = new Map(belts.map((b) => [b.id, b]))

export function getBelt(id: string): BeltDef | null {
  return BELT_BY_ID.get(id) ?? null
}

/** Returns the belt assigned to a constituency. Per-AC override wins
 *  over the district default. Returns null when no assignment exists
 *  (e.g. AC has no district mapping — shouldn't happen for Kerala). */
export function beltForConstituency(c: Constituency): BeltDef | null {
  const acKey = String(c.constituencyNumber)
  const override = beltsMeta.constituencyOverrides[acKey]
  if (typeof override === "string") {
    return getBelt(override)
  }
  const district = districtForConstituency(c)
  if (!district) return null
  const districtBelt = beltsMeta.districtToBelt[district.id]
  return districtBelt ? getBelt(districtBelt) : null
}

export function beltForDistrict(districtId: string): BeltDef | null {
  const id = beltsMeta.districtToBelt[districtId]
  return id ? getBelt(id) : null
}

// ─── Cross-tab: drift pattern × belt ───────────────────────────────────

export type BeltCrossTabRow = {
  patternKey: string
  patternLabel: string
  total: number
  byBelt: Record<string, { count: number; seats: string[] }>
}

export type BeltCrossTab = {
  belts: BeltDef[]
  rows: BeltCrossTabRow[]
}

/**
 * Cross-tabulates a list of (pattern, seats) groups against the belt
 * taxonomy. Each row = one pattern, each column = one belt, cells =
 * seat counts (with the seat names retained for tooltips/expansion).
 */
export function buildBeltCrossTab(
  groups: Array<{
    key: string
    label: string
    seats: Constituency[]
  }>
): BeltCrossTab {
  const rows: BeltCrossTabRow[] = groups.map((g) => {
    const byBelt: Record<string, { count: number; seats: string[] }> = {}
    for (const b of belts) byBelt[b.id] = { count: 0, seats: [] }
    for (const seat of g.seats) {
      const b = beltForConstituency(seat)
      if (!b) continue
      byBelt[b.id]!.count++
      byBelt[b.id]!.seats.push(seat.constituencyName)
    }
    return {
      patternKey: g.key,
      patternLabel: g.label,
      total: g.seats.length,
      byBelt,
    }
  })
  return { belts, rows }
}
