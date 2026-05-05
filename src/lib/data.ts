import constituenciesJson from "@data/kerala-2026.json"
import alliancesJson from "@data/alliances.json"
import districtsJson from "@data/districts.json"
import demographicsJson from "@data/demographics.json"
import candidateAliasesJson from "@data/candidate-aliases.json"
import constituencyNamesJson from "@data/constituency-names.json"

const historicalModules = import.meta.glob<{ default: HistoricalConstituency }>(
  "../../data/historical/S11-*.json",
  { eager: true }
)

export type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER" | "NOTA"

export type Candidate = {
  name: string
  party: string
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

export type Alliance = {
  code: AllianceCode
  name: string
  ledBy: string | null
  color: string
}

const alliancesMeta = alliancesJson as {
  alliances: Record<AllianceCode, Alliance>
  partyToAlliance: Record<string, AllianceCode>
  partyAbbreviation: Record<string, string>
  partyAliases: Record<string, string>
  independentOverrides: Record<string, AllianceCode | string>
}

const abbreviationToFull: Record<string, string> = {}
for (const [full, abbr] of Object.entries(alliancesMeta.partyAbbreviation)) {
  abbreviationToFull[abbr] = full
}

export function partyShort(party: string): string {
  return alliancesMeta.partyAbbreviation[party] ?? party
}

const candidateAliases = (
  candidateAliasesJson as { aliases: Record<string, string> }
).aliases

type ConstituencyNameEntry = {
  primary: string
  eci: string
  wikipedia?: string
  wikipediaUrl?: string
  aliases?: string[]
}

const constituencyNames = constituencyNamesJson as Record<
  string,
  ConstituencyNameEntry
>

export function displayConstituencyName(c: Constituency | number): string {
  const num = typeof c === "number" ? c : c.constituencyNumber
  const entry = constituencyNames[String(num)]
  if (entry?.primary) return entry.primary
  if (typeof c !== "number") return c.constituencyName
  return ""
}

export function normalizeCandidateName(raw: string): string {
  if (!raw) return raw
  const aliased = candidateAliases[raw] ?? raw
  return aliased
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((token) => {
      const stripped = token.replace(/,/g, "")
      if (stripped.length === 0) return ""
      if (stripped.length === 1) return stripped.toUpperCase() + "."
      return stripped.charAt(0).toUpperCase() + stripped.slice(1).toLowerCase()
    })
    .filter(Boolean)
    .join(" ")
}

export function canonicalPartyName(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return trimmed
  if (alliancesMeta.partyAbbreviation[trimmed]) return trimmed
  if (alliancesMeta.partyAliases[trimmed]) {
    return alliancesMeta.partyAliases[trimmed]
  }
  if (abbreviationToFull[trimmed]) return abbreviationToFull[trimmed]
  return trimmed
}

export const constituencies: Constituency[] = (
  constituenciesJson as Constituency[]
)
  .slice()
  .sort((a, b) => a.constituencyNumber - b.constituencyNumber)

export type District = {
  id: string
  name: string
  order: number
}

const districtsMeta = districtsJson as {
  districts: District[]
  constituencyToDistrict: Record<string, string>
}

export const districts: District[] = districtsMeta.districts
  .slice()
  .sort((a, b) => a.order - b.order)

export function getDistrict(id: string): District | null {
  return districts.find((d) => d.id === id) ?? null
}

export function districtForConstituency(c: Constituency): District | null {
  const id = districtsMeta.constituencyToDistrict[String(c.constituencyNumber)]
  return id ? getDistrict(id) : null
}

export function constituenciesIn(districtId: string | null): Constituency[] {
  if (districtId == null) return constituencies
  return constituencies.filter(
    (c) =>
      districtsMeta.constituencyToDistrict[String(c.constituencyNumber)] ===
      districtId
  )
}

export const alliances: Alliance[] = (
  ["UDF", "LDF", "NDA", "OTHER", "NOTA"] as AllianceCode[]
).map((code) => alliancesMeta.alliances[code])

export function getAlliance(code: AllianceCode): Alliance {
  return alliancesMeta.alliances[code]
}

const MAIN_FRONTS = new Set<AllianceCode>(["UDF", "LDF", "NDA"])
export function isMainFront(code: AllianceCode): boolean {
  return MAIN_FRONTS.has(code)
}

export function allianceForCandidate(
  c: Constituency,
  candidate: Candidate
): AllianceCode {
  if (candidate.isNota) return "NOTA"
  if (candidate.party === "Independent") {
    const key = `${c.constituencyNumber}:${candidate.name}`
    const override = alliancesMeta.independentOverrides[key]
    if (
      override === "UDF" ||
      override === "LDF" ||
      override === "NDA" ||
      override === "OTHER" ||
      override === "NOTA"
    ) {
      return override
    }
    return "OTHER"
  }
  return alliancesMeta.partyToAlliance[candidate.party] ?? "OTHER"
}

export function winnerOf(c: Constituency): Candidate {
  const w = c.candidates.find((cand) => cand.status === "won")
  if (!w) throw new Error(`No winner for ${c.constituencyNumber}`)
  return w
}

function realCandidatesByVotes(c: Constituency): Candidate[] {
  return c.candidates
    .filter((x) => !x.isNota)
    .slice()
    .sort((a, b) => b.votes - a.votes)
}

export function runnerUpOf(c: Constituency): Candidate {
  return realCandidatesByVotes(c)[1]!
}

export function secondRunnerUpOf(c: Constituency): Candidate | null {
  return realCandidatesByVotes(c)[2] ?? null
}

export function totalVotesIn(c: Constituency): number {
  return c.candidates.reduce((s, x) => s + x.votes, 0)
}

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

export type ReligionCode = "hindu" | "muslim" | "christian" | "other"

export type Religion = {
  code: ReligionCode
  label: string
  color: string
}

export const religions: Religion[] = [
  { code: "hindu", label: "Hindu", color: "#B45309" },
  { code: "muslim", label: "Muslim", color: "#16A34A" },
  { code: "christian", label: "Christian", color: "#7C3AED" },
  { code: "other", label: "Other", color: "#6B7280" },
]

export function getReligion(code: ReligionCode): Religion {
  return religions.find((r) => r.code === code)!
}

type DistrictDemographics = {
  population: number
  religions: Record<ReligionCode, number>
}

const demoMeta = demographicsJson as {
  year: number
  source: string
  note?: string
  districts: Record<string, DistrictDemographics>
}

export const demographicsYear = demoMeta.year

export type Demographics = {
  scope: "state" | "district"
  population: number
  religions: Record<ReligionCode, number>
}

export function getDemographicsFor(districtId: string | null): Demographics {
  if (districtId) {
    const d = demoMeta.districts[districtId]
    if (!d) {
      return {
        scope: "district",
        population: 0,
        religions: { hindu: 0, muslim: 0, christian: 0, other: 0 },
      }
    }
    return {
      scope: "district",
      population: d.population,
      religions: { ...d.religions },
    }
  }
  let total = 0
  const counts: Record<ReligionCode, number> = {
    hindu: 0,
    muslim: 0,
    christian: 0,
    other: 0,
  }
  for (const id in demoMeta.districts) {
    const d = demoMeta.districts[id]!
    total += d.population
    for (const code of [
      "hindu",
      "muslim",
      "christian",
      "other",
    ] as ReligionCode[]) {
      counts[code] += (d.religions[code] / 100) * d.population
    }
  }
  return {
    scope: "state",
    population: total,
    religions: {
      hindu: total > 0 ? (counts.hindu / total) * 100 : 0,
      muslim: total > 0 ? (counts.muslim / total) * 100 : 0,
      christian: total > 0 ? (counts.christian / total) * 100 : 0,
      other: total > 0 ? (counts.other / total) * 100 : 0,
    },
  }
}

export type HistoricalCandidate = {
  name: string
  party: string
  votes: number
  votePct: number
}

export type HistoricalElection = {
  year: number
  type: "general" | "by-election"
  reason: string | null
  candidates: HistoricalCandidate[]
  margin: number | null
  marginPct: number | null
  turnout: number | null
  turnoutPct: number | null
  result: string | null
}

export type HistoricalConstituency = {
  constituencyNumber: number
  constituencyName: string
  wikipediaName: string
  wikipediaUrl: string
  elections: HistoricalElection[]
}

const historicalByNumber = new Map<number, HistoricalConstituency>()
for (const path in historicalModules) {
  const mod = historicalModules[path] as
    | { default: HistoricalConstituency }
    | HistoricalConstituency
  const data = "default" in mod ? mod.default : mod
  historicalByNumber.set(data.constituencyNumber, data)
}

export function getHistoricalFor(
  constituencyNumber: number
): HistoricalConstituency | null {
  return historicalByNumber.get(constituencyNumber) ?? null
}

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

  const series: TrendSeries[] = partyKeys.map((partyKey) => {
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
    const totalVotesAcrossYears = points.reduce((s, p) => s + (p.votes ?? 0), 0)
    return {
      party: partyKey,
      partyShort: partyShort(partyKey),
      color: meta.color,
      allianceCode,
      isCurrent2026: c.candidates.some(
        (cd) => canonicalPartyName(cd.party) === partyKey && !cd.isNota
      ),
      points,
      _sortKey: totalVotesAcrossYears,
    } as TrendSeries & { _sortKey: number }
  })

  series.sort(
    (a, b) =>
      (b as TrendSeries & { _sortKey: number })._sortKey -
      (a as TrendSeries & { _sortKey: number })._sortKey
  )

  const years = elections.map((e) => e.year)
  const byelectionYears = elections
    .filter((e) => e.type === "by-election")
    .map((e) => e.year)

  return { years, byelectionYears, series }
}

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

function allianceForRawParty(party: string): AllianceCode {
  const canonical = canonicalPartyName(party)
  if (canonical === "Independent") return "OTHER"
  return (alliancesMeta.partyToAlliance[canonical] ?? "OTHER") as AllianceCode
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

export type PartyLens =
  | "top-share"
  | "won"
  | "closest-losses"
  | "biggest-gains"
  | "biggest-declines"

export type PartyConstituencyRow = {
  constituencyNumber: number
  constituencyName: string
  candidateName: string
  votes: number
  share: number
  margin: number
  marginPct: number
  isWinner: boolean
  rank: number
  winnerName: string
  winnerParty: string
  winnerPartyShort: string
  winnerAllianceCode: AllianceCode
  shareDelta: number | null
}

const PARTY_TABLE_LIMIT = 10

export function getPartyConstituencies(
  party: string,
  lens: PartyLens,
  districtId: string | null = null
): PartyConstituencyRow[] {
  const list = constituenciesIn(districtId)
  const rows: PartyConstituencyRow[] = []

  for (const c of list) {
    const total = totalVotesIn(c)
    if (total === 0) continue

    const candidate = c.candidates.find(
      (x) => !x.isNota && canonicalPartyName(x.party) === party
    )
    if (!candidate) continue

    const winner = winnerOf(c)
    const isWinner = candidate === winner
    const realCands = c.candidates
      .filter((x) => !x.isNota)
      .sort((a, b) => b.votes - a.votes)
    const rank = realCands.findIndex((x) => x === candidate) + 1

    const margin = isWinner ? candidate.margin : candidate.votes - winner.votes
    const marginPct = total > 0 ? (margin / total) * 100 : 0
    const share = (candidate.votes / total) * 100

    let shareDelta: number | null = null
    const hist = getHistoricalFor(c.constituencyNumber)
    if (hist) {
      const prev = hist.elections.find(
        (e) => e.type === "general" && e.year === 2021
      )
      if (prev) {
        const prevCand = prev.candidates.find(
          (cd) => canonicalPartyName(cd.party) === party
        )
        const prevTotal = prev.candidates.reduce((s, cd) => s + cd.votes, 0)
        if (prevCand && prevTotal > 0) {
          shareDelta = share - (prevCand.votes / prevTotal) * 100
        }
      }
    }

    rows.push({
      constituencyNumber: c.constituencyNumber,
      constituencyName: displayConstituencyName(c),
      candidateName: candidate.name,
      votes: candidate.votes,
      share,
      margin,
      marginPct,
      isWinner,
      rank,
      winnerName: winner.name,
      winnerParty: canonicalPartyName(winner.party),
      winnerPartyShort: partyShort(winner.party),
      winnerAllianceCode: allianceForCandidate(c, winner),
      shareDelta,
    })
  }

  switch (lens) {
    case "top-share":
      return rows.sort((a, b) => b.share - a.share).slice(0, PARTY_TABLE_LIMIT)
    case "won":
      return rows
        .filter((r) => r.isWinner)
        .sort((a, b) => b.share - a.share)
        .slice(0, PARTY_TABLE_LIMIT)
    case "closest-losses":
      return rows
        .filter((r) => !r.isWinner)
        .sort((a, b) => b.margin - a.margin)
        .slice(0, PARTY_TABLE_LIMIT)
    case "biggest-gains":
      return rows
        .filter((r) => r.shareDelta != null)
        .sort((a, b) => (b.shareDelta ?? 0) - (a.shareDelta ?? 0))
        .slice(0, PARTY_TABLE_LIMIT)
    case "biggest-declines":
      return rows
        .filter((r) => r.shareDelta != null)
        .sort((a, b) => (a.shareDelta ?? 0) - (b.shareDelta ?? 0))
        .slice(0, PARTY_TABLE_LIMIT)
  }
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN")
}

export function formatPercent(p: number, digits = 1): string {
  return `${(p * 100).toFixed(digits)}%`
}
