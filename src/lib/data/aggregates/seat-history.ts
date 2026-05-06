/**
 * Per-seat historical lookups: past winners (cycle-by-cycle table) and
 * 2021 baseline for a specific party (used by candidate rows + AC map).
 *
 * Both walk the same per-seat historical data; kept together so the
 * helpers and types live in one place.
 */

import { type AllianceCode } from "@/lib/data/alliances"
import {
  constituencies,
  totalVotesIn,
  winnerOf,
  type Constituency,
} from "@/lib/data/constituencies"
import { getHistoricalFor } from "@/lib/data/historical"
import { canonicalPartyName, partyShort } from "@/lib/data/parties"

// ─── Past-winners table ────────────────────────────────────────────────

export type PastWinner = {
  year: number
  type: "general" | "by-election"
  reason: string | null
  winnerName: string
  party: string
  partyShort: string
  allianceCode: AllianceCode
  share: number
  votes: number
  margin: number
  marginPct: number
  isCurrent: boolean
}

export type PastCandidate = PastWinner & {
  isWinnerOfElection: boolean
  didNotContest: boolean
}

/**
 * If `partyKey` is null, returns the winner of every cycle. Otherwise
 * returns that party's candidate in every cycle (with `didNotContest`
 * flagged for cycles where they didn't run).
 */
export function getPastCandidates(
  constituencyNumber: number,
  partyKey: string | null = null
): PastCandidate[] {
  const c = constituencies.find(
    (x) => x.constituencyNumber === constituencyNumber
  )
  if (!c) return []

  const out: PastCandidate[] = []
  const hist = getHistoricalFor(constituencyNumber)

  if (hist) {
    for (const e of hist.elections) {
      if (e.candidates.length === 0) continue
      const winner = [...e.candidates].sort((a, b) => b.votes - a.votes)[0]!
      const cand =
        partyKey == null
          ? winner
          : e.candidates.find(
              (cd) => canonicalPartyName(cd.party) === partyKey
            )

      if (!cand) {
        out.push({
          year: e.year,
          type: e.type,
          reason: e.reason,
          winnerName: "",
          party: partyKey ?? "",
          partyShort: partyKey ? partyShort(partyKey) : "",
          allianceCode: "OTHER",
          share: 0,
          votes: 0,
          margin: 0,
          marginPct: 0,
          isCurrent: false,
          isWinnerOfElection: false,
          didNotContest: true,
        })
        continue
      }

      const partyCanonical = canonicalPartyName(cand.party)
      const allianceCode = cand.alliance
      const isWinnerRow = cand === winner
      const margin = isWinnerRow ? (e.margin ?? 0) : cand.votes - winner.votes
      const marginPct = isWinnerRow
        ? (e.marginPct ?? 0)
        : cand.votePct - winner.votePct
      out.push({
        year: e.year,
        type: e.type,
        reason: e.reason,
        winnerName: cand.name,
        party: partyCanonical,
        partyShort: partyShort(partyCanonical),
        allianceCode,
        share: cand.votePct,
        votes: cand.votes,
        margin,
        marginPct,
        isCurrent: false,
        isWinnerOfElection: isWinnerRow,
        didNotContest: false,
      })
    }
  }

  const winner2026 = winnerOf(c)
  const total2026 = totalVotesIn(c)
  const cand2026 =
    partyKey == null
      ? winner2026
      : c.candidates.find(
          (cd) => !cd.isNota && canonicalPartyName(cd.party) === partyKey
        )
  if (cand2026) {
    const allianceCode2026 = cand2026.alliance
    const isWinnerRow = cand2026.status === "won"
    const margin = cand2026.margin
    const marginPct = total2026 > 0 ? (margin / total2026) * 100 : 0
    out.push({
      year: 2026,
      type: "general",
      reason: null,
      winnerName: cand2026.name,
      party: canonicalPartyName(cand2026.party),
      partyShort: partyShort(cand2026.party),
      allianceCode: allianceCode2026,
      share: total2026 > 0 ? (cand2026.votes / total2026) * 100 : 0,
      votes: cand2026.votes,
      margin,
      marginPct,
      isCurrent: true,
      isWinnerOfElection: isWinnerRow,
      didNotContest: false,
    })
  } else {
    out.push({
      year: 2026,
      type: "general",
      reason: null,
      winnerName: "",
      party: partyKey ?? "",
      partyShort: partyKey ? partyShort(partyKey) : "",
      allianceCode: "OTHER",
      share: 0,
      votes: 0,
      margin: 0,
      marginPct: 0,
      isCurrent: true,
      isWinnerOfElection: false,
      didNotContest: true,
    })
  }

  out.sort((a, b) => a.year - b.year)
  return out
}

export function getPastWinners(constituencyNumber: number): PastCandidate[] {
  return getPastCandidates(constituencyNumber, null)
}

// ─── 2021 baseline lookup ──────────────────────────────────────────────

export type Party2021Baseline = {
  sharePct: number
  marginPct: number
}

export function get2021Baseline(
  c: Constituency,
  partyCanonical: string
): Party2021Baseline | null {
  if (partyCanonical === "Independent") return null
  const hist = getHistoricalFor(c.constituencyNumber)
  if (!hist) return null
  const prev = hist.elections.find(
    (e) => e.type === "general" && e.year === 2021
  )
  if (!prev || prev.candidates.length === 0) return null

  const prevCand = prev.candidates.find(
    (cd) => canonicalPartyName(cd.party) === partyCanonical
  )
  if (!prevCand) return null

  const sorted = [...prev.candidates].sort((a, b) => b.votes - a.votes)
  const prevWinner = sorted[0]!
  const wasWinner = prevCand === prevWinner
  const marginPct = wasWinner
    ? prevWinner.votePct - (sorted[1]?.votePct ?? 0)
    : prevCand.votePct - prevWinner.votePct
  return { sharePct: prevCand.votePct, marginPct }
}
