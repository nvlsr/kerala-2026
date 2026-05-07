import {
  constituenciesData,
  districtsMeta,
  reservationsMeta,
  type ReservationCode,
} from "@/lib/data/loaders"

import type { AllianceCode } from "@/lib/data/alliances"

export type Candidate = {
  name: string
  party: string
  alliance: AllianceCode
  votes: number
  margin: number
  status: "won" | "lost" | "nota"
  isNota: boolean
}

export type Constituency = {
  constituency: string
  constituencyNumber: number
  constituencyName: string
  state: string
  candidates: Candidate[]
  checksum: { computedMarginsMatchScraped: boolean; mismatches: unknown[] }
  source: string
}

export const constituencies: Constituency[] = constituenciesData
  .slice()
  .sort((a, b) => a.constituencyNumber - b.constituencyNumber)

export function constituenciesIn(districtId: string | null): Constituency[] {
  if (districtId == null) return constituencies
  return constituencies.filter(
    (c) =>
      districtsMeta.constituencyToDistrict[String(c.constituencyNumber)] ===
      districtId
  )
}

export function winnerOf(c: Constituency): Candidate {
  const w = c.candidates.find((cand) => cand.status === "won")
  if (!w) throw new Error(`No winner for ${c.constituencyNumber}`)
  return w
}

export function totalVotesIn(c: Constituency): number {
  return c.candidates.reduce((s, x) => s + x.votes, 0)
}

/**
 * Returns "SC" or "ST" if the given constituency is reserved, else null.
 * Reservations are stable since the 2008 Delimitation Order — the same
 * 14 SC + 2 ST seats apply for 2011, 2016, 2021, and 2026 elections.
 */
export function getReservation(
  constituencyNumber: number
): ReservationCode | null {
  return (
    reservationsMeta.constituencyToReservation[String(constituencyNumber)] ??
    null
  )
}

/**
 * Returns true if the given constituency is reserved (SC or ST).
 */
export function isReserved(constituencyNumber: number): boolean {
  return getReservation(constituencyNumber) != null
}
