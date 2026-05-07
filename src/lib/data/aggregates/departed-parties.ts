/**
 * Lists parties that contested under an alliance in the previous cycle
 * but no longer appear under that alliance in 2026 — either because
 * they switched alliances (e.g., NCK left UDF), dissolved (JKC, NSC),
 * or merged into a successor (LJD, JD(S)).
 *
 * The PartySection table only shows parties currently in the alliance,
 * which makes the alliance-level Δ '21 unreconcilable to the per-party
 * Δ rows. This function surfaces the missing piece: each departed
 * party's 2021 share is exactly the contribution they no longer make
 * to the alliance in 2026.
 */
import {
  allianceForCandidate,
  type AllianceCode,
} from "@/lib/data/alliances"
import { constituenciesIn } from "@/lib/data/constituencies"
import { getHistoricalFor } from "@/lib/data/historical"
import { partyShort } from "@/lib/data/parties"

export type DepartedParty = {
  party: string
  partyShort: string
  /** 2021 vote count for candidates that were tagged with this alliance. */
  votes2021: number
  /** 2021 statewide vote share (votes / totalValidVotes2021), as percent. */
  share2021: number
  /** 2021 candidates contested under this alliance. */
  contested2021: number
  /** 2021 wins (rank-1 finishes) for candidates of this party + alliance. */
  won2021: number
}

export function getDepartedAllianceParties(
  code: AllianceCode,
  districtId: string | null = null
): DepartedParty[] {
  const list = constituenciesIn(districtId)

  // 1. Parties currently in this alliance in 2026 — exclude these.
  const currentParties = new Set<string>()
  for (const c of list) {
    for (const cand of c.candidates) {
      const a = allianceForCandidate(c, cand)
      if (a === code) currentParties.add(cand.party)
    }
  }

  // 2. Walk 2021 candidates whose alliance == code; tally those whose
  //    party is NOT in currentParties.
  const map = new Map<
    string,
    { votes: number; contested: number; won: number }
  >()
  let totalValid2021 = 0
  for (const c of list) {
    const hist = getHistoricalFor(c.constituencyNumber)
    if (!hist) continue
    const e = hist.elections.find((x) => x.year === 2021 && x.type === "general")
    if (!e || e.candidates.length === 0) continue
    const winner = [...e.candidates].sort((a, b) => b.votes - a.votes)[0]!
    for (const cand of e.candidates) {
      // NOTA candidates have alliance="NOTA"; the `!== code` check
      // below excludes them from the departed tally. We DO include
      // their votes in the denominator to stay consistent with
      // getAllianceTrendData (which includes NOTA in totalVotes).
      totalValid2021 += cand.votes
      if (cand.alliance !== code) continue
      if (currentParties.has(cand.party)) continue
      const entry = map.get(cand.party) ?? { votes: 0, contested: 0, won: 0 }
      entry.votes += cand.votes
      entry.contested++
      if (winner.name === cand.name && winner.party === cand.party) entry.won++
      map.set(cand.party, entry)
    }
  }

  const result: DepartedParty[] = [...map.entries()].map(([party, t]) => ({
    party,
    partyShort: partyShort(party),
    votes2021: t.votes,
    share2021: totalValid2021 > 0 ? (t.votes / totalValid2021) * 100 : 0,
    contested2021: t.contested,
    won2021: t.won,
  }))

  result.sort((a, b) => b.share2021 - a.share2021)
  return result
}
