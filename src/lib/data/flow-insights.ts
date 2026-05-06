/**
 * Layer-A computed observations for flow-pattern cards on /flows.
 *
 * Pure data — no causal claims, no editorial prose. Each card's seat set
 * gets summarised on two axes: where they cluster geographically (top
 * districts) and how their average religion mix compares to the state
 * baseline.
 *
 * Religion data is the 2011 census (the most recent available). Hindu and
 * Christian shares are likely marginally higher than current reality due
 * to differential fertility; Muslim share likely marginally lower. We
 * surface the figures with a "(2011 census)" parenthetical so readers
 * aren't misled.
 */

import { districtForConstituency } from "@/lib/data/districts"
import { demoMeta } from "@/lib/data/loaders"
import { getDemographicsFor, type ReligionCode } from "@/lib/data/demographics"
import type { Constituency } from "@/lib/data/constituencies"

export type DistrictConcentration = {
  /** Top districts by seat count, descending. */
  top: Array<{ name: string; count: number }>
  /** Total seats with a known district. */
  totalCounted: number
}

export function computeDistrictConcentration(
  seats: Constituency[]
): DistrictConcentration {
  const counts = new Map<string, number>()
  let totalCounted = 0
  for (const seat of seats) {
    const district = districtForConstituency(seat)
    if (!district) continue
    counts.set(district.name, (counts.get(district.name) ?? 0) + 1)
    totalCounted++
  }
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))
  return { top, totalCounted }
}

export type ReligionMix = Record<ReligionCode, number>

/** Averaged religion mix across the seats — each seat contributes its
 *  district's mix once (equal weight per seat, not population-weighted). */
export function computeReligionMix(seats: Constituency[]): ReligionMix | null {
  const sums: ReligionMix = { hindu: 0, muslim: 0, christian: 0, other: 0 }
  let counted = 0
  for (const seat of seats) {
    const district = districtForConstituency(seat)
    if (!district) continue
    const mix = demoMeta.districts[district.id]?.religions
    if (!mix) continue
    sums.hindu += mix.hindu
    sums.muslim += mix.muslim
    sums.christian += mix.christian
    sums.other += mix.other
    counted++
  }
  if (counted === 0) return null
  return {
    hindu: sums.hindu / counted,
    muslim: sums.muslim / counted,
    christian: sums.christian / counted,
    other: sums.other / counted,
  }
}

let cachedStateBaseline: ReligionMix | null = null
export function getStateReligionBaseline(): ReligionMix {
  if (cachedStateBaseline) return cachedStateBaseline
  const r = getDemographicsFor(null).religions
  cachedStateBaseline = r
  return r
}

// ─── Observation generation ────────────────────────────────────────────
//
// We surface observations whenever a card has ≥ 5 seats. No magnitude
// gating — observations are factual, and the reader should see what the
// data says without the helper deciding what's "notable enough". The
// 5-seat floor just keeps tiny groups (where averages are unstable) out.

const DISTRICT_TOP_N = 3
const MIN_SEATS_FOR_OBSERVATION = 5

export type CardObservations = {
  geography: string | null
  religion: string | null
}

function fmtPp(delta: number): string {
  if (Math.abs(delta) < 0.5) return "≈ baseline"
  const sign = delta > 0 ? "+" : "−"
  return `${sign}${Math.abs(delta).toFixed(0)}pp`
}

export function computeCardObservations(
  seats: Constituency[]
): CardObservations {
  if (seats.length < MIN_SEATS_FOR_OBSERVATION) {
    return { geography: null, religion: null }
  }

  // Geography
  const conc = computeDistrictConcentration(seats)
  const topN = conc.top.slice(0, DISTRICT_TOP_N)
  const topNCount = topN.reduce((s, d) => s + d.count, 0)
  let geography: string | null = null
  if (topN.length >= 1) {
    const phrasing = topN.map((d) => `${d.name} (${d.count})`).join(", ")
    geography = `${topNCount} of ${conc.totalCounted} seats in ${phrasing}.`
  }

  // Religion mix vs state baseline
  const cardMix = computeReligionMix(seats)
  const baseline = getStateReligionBaseline()
  let religion: string | null = null
  if (cardMix) {
    const dH = cardMix.hindu - baseline.hindu
    const dM = cardMix.muslim - baseline.muslim
    const dC = cardMix.christian - baseline.christian
    const fmt = (n: number) => `${n.toFixed(0)}%`
    religion =
      `Avg religion mix (2011 census): ${fmt(cardMix.hindu)} Hindu, ` +
      `${fmt(cardMix.christian)} Christian, ${fmt(cardMix.muslim)} Muslim ` +
      `(vs state ${fmt(baseline.hindu)} / ${fmt(baseline.christian)} / ${fmt(baseline.muslim)} → ` +
      `Hindu ${fmtPp(dH)}, Christian ${fmtPp(dC)}, Muslim ${fmtPp(dM)}).`
  }

  return { geography, religion }
}
