import {
  allianceForCandidate,
  allianceForRawParty,
  type AllianceCode,
} from "@/lib/data/alliances"
import {
  constituencies,
  constituenciesIn,
  totalVotesIn,
  winnerOf,
  type Constituency,
} from "@/lib/data/constituencies"
import { getHistoricalFor } from "@/lib/data/historical"
import { alliancesMeta } from "@/lib/data/loaders"
import { canonicalPartyName, partyShort } from "@/lib/data/parties"

// ─── State-level summary ────────────────────────────────────────────────

export type StateSummary = {
  totalSeats: number
  totalVotes: number
  rows: Array<{
    code: AllianceCode
    seats: number
    votes: number
    voteShare: number
  }>
}

export function getStateSummary(
  districtId: string | null = null
): StateSummary {
  const list = constituenciesIn(districtId)
  const seats: Record<AllianceCode, number> = {
    UDF: 0,
    LDF: 0,
    NDA: 0,
    OTHER: 0,
    NOTA: 0,
  }
  const votes: Record<AllianceCode, number> = {
    UDF: 0,
    LDF: 0,
    NDA: 0,
    OTHER: 0,
    NOTA: 0,
  }
  let totalVotes = 0
  for (const c of list) {
    for (const cand of c.candidates) {
      const a = allianceForCandidate(c, cand)
      votes[a] += cand.votes
      totalVotes += cand.votes
      if (cand.status === "won") seats[a]++
    }
  }
  return {
    totalSeats: list.length,
    totalVotes,
    rows: (["UDF", "LDF", "NDA", "OTHER", "NOTA"] as AllianceCode[]).map(
      (code) => ({
        code,
        seats: seats[code],
        votes: votes[code],
        voteShare: totalVotes > 0 ? votes[code] / totalVotes : 0,
      })
    ),
  }
}

// ─── Alliance breakdown (parties within an alliance) ───────────────────

export type PartyBreakdown = {
  party: string
  partyShort: string
  allianceCode: AllianceCode
  contested: number
  won: number
  votes: number
  voteShare: number
}

export type AllianceBreakdown = {
  code: AllianceCode
  totalSeats: number
  totalContested: number
  totalVotes: number
  totalVoteShare: number
  parties: PartyBreakdown[]
}

export function getAllianceBreakdown(
  code: AllianceCode,
  districtId: string | null = null
): AllianceBreakdown {
  const list = constituenciesIn(districtId)
  const scopeTotal = list.reduce(
    (s, c) => s + c.candidates.reduce((t, x) => t + x.votes, 0),
    0
  )
  const map = new Map<string, PartyBreakdown>()
  for (const c of list) {
    for (const cand of c.candidates) {
      const a = allianceForCandidate(c, cand)
      if (a !== code) continue
      const existing = map.get(cand.party) ?? {
        party: cand.party,
        partyShort: partyShort(cand.party),
        allianceCode: a,
        contested: 0,
        won: 0,
        votes: 0,
        voteShare: 0,
      }
      existing.contested++
      existing.votes += cand.votes
      if (cand.status === "won") existing.won++
      map.set(cand.party, existing)
    }
  }
  const parties = [...map.values()]
  for (const p of parties)
    p.voteShare = scopeTotal > 0 ? p.votes / scopeTotal : 0
  parties.sort((a, b) => b.won - a.won || b.votes - a.votes)
  const totalSeats = parties.reduce((s, p) => s + p.won, 0)
  const totalContested = parties.reduce((s, p) => s + p.contested, 0)
  const totalVotes = parties.reduce((s, p) => s + p.votes, 0)
  return {
    code,
    totalSeats,
    totalContested,
    totalVotes,
    totalVoteShare: scopeTotal > 0 ? totalVotes / scopeTotal : 0,
    parties,
  }
}

// ─── Per-constituency historical trend (used by charts) ────────────────

export type TrendPoint = {
  year: number
  type: "general" | "by-election"
  reason: string | null
  share: number | null
  votes: number | null
  candidate: string | null
}

export type TrendSeries = {
  party: string
  partyShort: string
  color: string
  allianceCode: AllianceCode
  isCurrent2026: boolean
  points: TrendPoint[]
}

export type TrendData = {
  years: number[]
  byelectionYears: number[]
  series: TrendSeries[]
}

export function getTrendData(constituencyNumber: number): TrendData | null {
  const c = constituencies.find(
    (x) => x.constituencyNumber === constituencyNumber
  )
  if (!c) return null
  const hist = getHistoricalFor(constituencyNumber)
  const total2026 = c.candidates.reduce((s, x) => s + x.votes, 0)

  const elections: Array<{
    year: number
    type: "general" | "by-election"
    reason: string | null
    candidates: Array<{
      party: string
      votes: number
      votePct: number
      name: string
    }>
  }> = []

  if (hist) {
    for (const e of hist.elections) {
      elections.push({
        year: e.year,
        type: e.type,
        reason: e.reason,
        candidates: e.candidates.map((cd) => ({
          party: canonicalPartyName(cd.party),
          votes: cd.votes,
          votePct: cd.votePct,
          name: cd.name,
        })),
      })
    }
  }

  elections.push({
    year: 2026,
    type: "general",
    reason: null,
    candidates: c.candidates
      .filter((cd) => !cd.isNota)
      .map((cd) => ({
        party: canonicalPartyName(cd.party),
        votes: cd.votes,
        votePct: total2026 > 0 ? (cd.votes / total2026) * 100 : 0,
        name: cd.name,
      })),
  })

  elections.sort((a, b) => a.year - b.year)

  const top3PartiesPerElection = new Set<string>()
  for (const e of elections) {
    const sorted = [...e.candidates]
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3)
    for (const cd of sorted) top3PartiesPerElection.add(cd.party)
  }

  const partyKeys = [...top3PartiesPerElection]

  const seriesWithTotals = partyKeys.map((partyKey) => {
    const points: TrendPoint[] = elections.map((e) => {
      const cand = e.candidates.find((cd) => cd.party === partyKey)
      return {
        year: e.year,
        type: e.type,
        reason: e.reason,
        share: cand ? cand.votePct : null,
        votes: cand ? cand.votes : null,
        candidate: cand ? cand.name : null,
      }
    })
    const allianceCode =
      partyKey === "Independent"
        ? "OTHER"
        : ((alliancesMeta.partyToAlliance[partyKey] ?? "OTHER") as AllianceCode)
    const meta = alliancesMeta.alliances[allianceCode]
    const totalVotes = points.reduce((s, p) => s + (p.votes ?? 0), 0)
    const trendSeries: TrendSeries = {
      party: partyKey,
      partyShort: partyShort(partyKey),
      color: meta.color,
      allianceCode,
      isCurrent2026: c.candidates.some(
        (cd) => canonicalPartyName(cd.party) === partyKey && !cd.isNota
      ),
      points,
    }
    return { trendSeries, totalVotes }
  })

  seriesWithTotals.sort((a, b) => b.totalVotes - a.totalVotes)
  const series: TrendSeries[] = seriesWithTotals.map((s) => s.trendSeries)

  const years = elections.map((e) => e.year)
  const byelectionYears = elections
    .filter((e) => e.type === "by-election")
    .map((e) => e.year)

  return { years, byelectionYears, series }
}

// ─── Past candidates (filterable timeline) ─────────────────────────────

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
          : e.candidates.find((cd) => canonicalPartyName(cd.party) === partyKey)

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
      const allianceCode: AllianceCode =
        partyCanonical === "Independent"
          ? "OTHER"
          : ((alliancesMeta.partyToAlliance[partyCanonical] ??
              "OTHER") as AllianceCode)
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
    const allianceCode2026 = allianceForCandidate(c, cand2026)
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

// ─── 2021 baseline lookup (used by candidate rows + AC map) ────────────

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

// ─── Aggregate trend data (alliance + party scope-wide) ────────────────

export type AllianceTrendPoint = {
  year: number
  seats: number
  contested: number
  votes: number
  totalVotes: number
  share: number
}

export type AllianceTrendData = {
  years: number[]
  totalSeats: number
  series: Record<AllianceCode, AllianceTrendPoint[]>
}

export function getAllianceTrendData(
  districtId: string | null = null
): AllianceTrendData {
  const list = constituenciesIn(districtId)
  const yearTotals = new Map<
    number,
    {
      totalVotes: number
      perAlliance: Record<
        AllianceCode,
        { seats: number; contested: number; votes: number }
      >
    }
  >()

  const ensureYear = (year: number) => {
    let entry = yearTotals.get(year)
    if (!entry) {
      entry = {
        totalVotes: 0,
        perAlliance: {
          UDF: { seats: 0, contested: 0, votes: 0 },
          LDF: { seats: 0, contested: 0, votes: 0 },
          NDA: { seats: 0, contested: 0, votes: 0 },
          OTHER: { seats: 0, contested: 0, votes: 0 },
          NOTA: { seats: 0, contested: 0, votes: 0 },
        },
      }
      yearTotals.set(year, entry)
    }
    return entry
  }

  for (const c of list) {
    const hist = getHistoricalFor(c.constituencyNumber)
    if (hist) {
      for (const e of hist.elections) {
        if (e.type !== "general") continue
        if (e.candidates.length === 0) continue
        const entry = ensureYear(e.year)
        const winner = [...e.candidates].sort((a, b) => b.votes - a.votes)[0]!
        const winnerAlliance = allianceForRawParty(winner.party)
        entry.perAlliance[winnerAlliance].seats++
        for (const cand of e.candidates) {
          const a = allianceForRawParty(cand.party)
          entry.perAlliance[a].contested++
          entry.perAlliance[a].votes += cand.votes
          entry.totalVotes += cand.votes
        }
      }
    }

    const entry2026 = ensureYear(2026)
    for (const cand of c.candidates) {
      const a = allianceForCandidate(c, cand)
      entry2026.perAlliance[a].contested++
      entry2026.perAlliance[a].votes += cand.votes
      entry2026.totalVotes += cand.votes
      if (cand.status === "won") entry2026.perAlliance[a].seats++
    }
  }

  const years = [...yearTotals.keys()].sort((a, b) => a - b)
  const codes: AllianceCode[] = ["UDF", "LDF", "NDA", "OTHER", "NOTA"]
  const series = {} as Record<AllianceCode, AllianceTrendPoint[]>
  for (const code of codes) {
    series[code] = years.map((year) => {
      const entry = yearTotals.get(year)!
      const a = entry.perAlliance[code]
      return {
        year,
        seats: a.seats,
        contested: a.contested,
        votes: a.votes,
        totalVotes: entry.totalVotes,
        share: entry.totalVotes > 0 ? (a.votes / entry.totalVotes) * 100 : 0,
      }
    })
  }

  return { years, totalSeats: list.length, series }
}

export type PartyTrendPoint = {
  year: number
  seats: number
  contested: number
  votes: number
  totalVotes: number
  share: number
}

export type PartyTrendData = {
  party: string
  partyShort: string
  allianceCode: AllianceCode
  color: string
  years: number[]
  points: PartyTrendPoint[]
  totalSeats: number
}

export function getPartyTrendData(
  party: string,
  districtId: string | null = null
): PartyTrendData {
  const list = constituenciesIn(districtId)
  const yearMap = new Map<
    number,
    { seats: number; contested: number; votes: number; totalVotes: number }
  >()

  const ensureYear = (year: number) => {
    let entry = yearMap.get(year)
    if (!entry) {
      entry = { seats: 0, contested: 0, votes: 0, totalVotes: 0 }
      yearMap.set(year, entry)
    }
    return entry
  }

  for (const c of list) {
    const hist = getHistoricalFor(c.constituencyNumber)
    if (hist) {
      for (const e of hist.elections) {
        if (e.type !== "general") continue
        if (e.candidates.length === 0) continue
        const entry = ensureYear(e.year)
        const winner = [...e.candidates].sort((a, b) => b.votes - a.votes)[0]!
        const winnerCanonical = canonicalPartyName(winner.party)
        for (const cand of e.candidates) {
          entry.totalVotes += cand.votes
          if (canonicalPartyName(cand.party) === party) {
            entry.contested++
            entry.votes += cand.votes
          }
        }
        if (winnerCanonical === party) entry.seats++
      }
    }

    const entry2026 = ensureYear(2026)
    for (const cand of c.candidates) {
      entry2026.totalVotes += cand.votes
      if (canonicalPartyName(cand.party) === party) {
        entry2026.contested++
        entry2026.votes += cand.votes
        if (cand.status === "won") entry2026.seats++
      }
    }
  }

  const years = [...yearMap.keys()].sort((a, b) => a - b)
  const points: PartyTrendPoint[] = years.map((year) => {
    const entry = yearMap.get(year)!
    return {
      year,
      seats: entry.seats,
      contested: entry.contested,
      votes: entry.votes,
      totalVotes: entry.totalVotes,
      share: entry.totalVotes > 0 ? (entry.votes / entry.totalVotes) * 100 : 0,
    }
  })

  const allianceCode = allianceForRawParty(party)
  const meta = alliancesMeta.alliances[allianceCode]

  return {
    party,
    partyShort: partyShort(party),
    allianceCode,
    color: meta.color,
    years,
    points,
    totalSeats: list.length,
  }
}
