import {
  alliancesMeta,
  constituencyNames,
  districtsMeta,
  rawConstituencies,
  reservationsMeta,
  type RawCandidate,
  type RawConstituency,
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
  constituencyNumber: number
  constituencyName: string
  candidates: Candidate[]
}

/**
 * Hydrate a raw constituency into the runtime Constituency shape, deriving
 * `constituencyName` from the canonical registry and per-candidate
 * `alliance` / `isNota` / `status` / `margin` from the rank + party tables.
 *
 * Margin convention (matches the source ECI data):
 *   - winner.margin = winner.votes - second.votes (second is 2nd by votes,
 *     possibly NOTA)
 *   - everyone else.margin = self.votes - winner.votes (always ≤ 0)
 */
function hydrateConstituency(raw: RawConstituency): Constituency {
  const sorted = raw.candidates.slice().sort((a, b) => b.votes - a.votes)
  const winner = sorted[0]
  const second = sorted[1]
  const winnerVotes = winner?.votes ?? 0
  const secondVotes = second?.votes ?? 0
  const candidates: Candidate[] = sorted.map((c, i) =>
    hydrateCandidate(c, i, winnerVotes, secondVotes)
  )
  const eci = constituencyNames[String(raw.constituencyNumber)]?.eci ?? ""
  return {
    constituencyNumber: raw.constituencyNumber,
    constituencyName: eci,
    candidates,
  }
}

function hydrateCandidate(
  c: RawCandidate,
  rank: number,
  winnerVotes: number,
  secondVotes: number
): Candidate {
  const isNota = c.name === "NOTA"
  const status: Candidate["status"] = isNota
    ? "nota"
    : rank === 0
      ? "won"
      : "lost"
  const margin = rank === 0 ? winnerVotes - secondVotes : c.votes - winnerVotes
  const alliance =
    (alliancesMeta.partyToAlliance[c.party] as AllianceCode | undefined) ??
    "OTHER"
  return {
    name: c.name,
    party: c.party,
    alliance: isNota ? ("NOTA" as AllianceCode) : alliance,
    votes: c.votes,
    margin,
    status,
    isNota,
  }
}

export const constituencies: Constituency[] = rawConstituencies
  .map(hydrateConstituency)
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
