import { describe, expect, test } from "vitest"

import { canonicalPartyName, partyShort } from "./parties"
import { allianceForRawParty } from "./alliances"
import {
  constituencies,
  totalVotesIn,
  winnerOf,
} from "./constituencies"
import {
  get2021Baseline,
  getAllianceTrendData,
  getPartyTrendData,
  getStateSummary,
} from "./aggregates"
import { buildCandidateRows } from "./candidate-rows"

const ALUVA = constituencies.find((c) => c.constituencyNumber === 76)!

describe("canonicalPartyName", () => {
  test("returns canonical full name as-is", () => {
    expect(canonicalPartyName("Indian National Congress")).toBe(
      "Indian National Congress"
    )
  })

  test("resolves abbreviation to full name", () => {
    expect(canonicalPartyName("INC")).toBe("Indian National Congress")
    expect(canonicalPartyName("CPI(M)")).toBe(
      "Communist Party of India (Marxist)"
    )
  })

  test("resolves alternate spelling via partyAliases", () => {
    expect(canonicalPartyName("CPM")).toBe(
      "Communist Party of India (Marxist)"
    )
    expect(canonicalPartyName("Muslim League")).toBe(
      "Indian Union Muslim League"
    )
  })

  test("returns input unchanged when not in any map", () => {
    expect(canonicalPartyName("Unknown Party Xyz")).toBe("Unknown Party Xyz")
  })

  test("trims whitespace", () => {
    expect(canonicalPartyName("  INC  ")).toBe("Indian National Congress")
  })
})

describe("partyShort", () => {
  test("returns abbreviation for known party", () => {
    expect(partyShort("Indian National Congress")).toBe("INC")
    expect(partyShort("Bharatiya Janata Party")).toBe("BJP")
  })

  test("returns input when no abbreviation known", () => {
    expect(partyShort("Unknown Party Xyz")).toBe("Unknown Party Xyz")
  })
})

describe("allianceForRawParty", () => {
  test("INC routes to UDF", () => {
    expect(allianceForRawParty("Indian National Congress")).toBe("UDF")
  })

  test("CPI(M) routes to LDF", () => {
    expect(allianceForRawParty("Communist Party of India (Marxist)")).toBe(
      "LDF"
    )
  })

  test("BJP routes to NDA", () => {
    expect(allianceForRawParty("Bharatiya Janata Party")).toBe("NDA")
  })

  test("Independent routes to OTHER", () => {
    expect(allianceForRawParty("Independent")).toBe("OTHER")
  })

  test("LDF/UDF placeholder route to themselves (historical alliance-as-party fallback)", () => {
    expect(allianceForRawParty("LDF")).toBe("LDF")
    expect(allianceForRawParty("UDF")).toBe("UDF")
    expect(allianceForRawParty("NDA")).toBe("NDA")
  })

  test("unknown party routes to OTHER", () => {
    expect(allianceForRawParty("Unknown Party Xyz")).toBe("OTHER")
  })
})

describe("get2021Baseline (Aluva, INC)", () => {
  test("returns baseline for INC in Aluva 2021", () => {
    const baseline = get2021Baseline(ALUVA, "Indian National Congress")
    expect(baseline).not.toBeNull()
    // Anwar Sadath INC won Aluva 2021 with 73,703 votes / 49.30% share / 12.63 pp margin
    expect(baseline!.sharePct).toBeCloseTo(49.3, 1)
    expect(baseline!.marginPct).toBeCloseTo(12.63, 1)
  })

  test("returns null for party that didn't contest", () => {
    expect(get2021Baseline(ALUVA, "Aam Aadmi Party")).toBeNull()
  })

  test("returns null for Independent party", () => {
    expect(get2021Baseline(ALUVA, "Independent")).toBeNull()
  })
})

describe("getStateSummary", () => {
  test("totals all 140 seats statewide", () => {
    const s = getStateSummary(null)
    expect(s.totalSeats).toBe(140)
    const totalAllianceSeats = s.rows.reduce((sum, r) => sum + r.seats, 0)
    expect(totalAllianceSeats).toBe(140)
  })

  test("vote shares sum to ~1", () => {
    const s = getStateSummary(null)
    const totalShare = s.rows.reduce((sum, r) => sum + r.voteShare, 0)
    expect(totalShare).toBeCloseTo(1, 3)
  })

  test("scoping to a district reduces seat total", () => {
    const wayanad = getStateSummary("wayanad")
    expect(wayanad.totalSeats).toBeLessThan(140)
    expect(wayanad.totalSeats).toBeGreaterThan(0)
  })
})

describe("getAllianceTrendData", () => {
  test("contains all 3 main fronts + OTHER + NOTA series", () => {
    const data = getAllianceTrendData(null)
    expect(data.series.UDF).toBeDefined()
    expect(data.series.LDF).toBeDefined()
    expect(data.series.NDA).toBeDefined()
    expect(data.years).toContain(2026)
  })

  test("series points sum (across alliances) to ~totalVotes per year", () => {
    const data = getAllianceTrendData(null)
    const yearIdx = data.years.indexOf(2026)
    const total =
      data.series.UDF[yearIdx]!.votes +
      data.series.LDF[yearIdx]!.votes +
      data.series.NDA[yearIdx]!.votes +
      data.series.OTHER[yearIdx]!.votes +
      data.series.NOTA[yearIdx]!.votes
    expect(total).toBe(data.series.UDF[yearIdx]!.totalVotes)
  })
})

describe("getPartyTrendData", () => {
  test("INC trend includes 2026 data", () => {
    const data = getPartyTrendData("Indian National Congress", null)
    expect(data.party).toBe("Indian National Congress")
    expect(data.years).toContain(2026)
    const point2026 = data.points.find((p) => p.year === 2026)
    expect(point2026).toBeDefined()
    expect(point2026!.contested).toBeGreaterThan(0)
    expect(point2026!.share).toBeGreaterThan(0)
  })
})

describe("buildCandidateRows", () => {
  test("statewide row count matches sum of real candidates across constituencies", () => {
    const rows = buildCandidateRows(null)
    const expected = constituencies.reduce(
      (s, c) => s + c.candidates.filter((x) => !x.isNota).length,
      0
    )
    expect(rows.length).toBe(expected)
  })

  test("each constituency has exactly one isWinner row", () => {
    const rows = buildCandidateRows(null)
    const winnersByConstituency = new Map<number, number>()
    for (const r of rows) {
      if (r.isWinner) {
        const num = r.constituency.constituencyNumber
        winnersByConstituency.set(num, (winnersByConstituency.get(num) ?? 0) + 1)
      }
    }
    for (const [, count] of winnersByConstituency) {
      expect(count).toBe(1)
    }
    expect(winnersByConstituency.size).toBe(140)
  })

  test("winner row's vote count + margin = winner_votes (consistency check)", () => {
    const rows = buildCandidateRows(null)
    for (const r of rows) {
      if (r.isWinner) {
        const c = r.constituency
        const winner = winnerOf(c)
        expect(r.votes).toBe(winner.votes)
        expect(r.margin).toBe(winner.margin)
      }
    }
  })

  test("scoped rows are subset of unscoped", () => {
    const all = buildCandidateRows(null)
    const wayanad = buildCandidateRows("wayanad")
    expect(wayanad.length).toBeLessThan(all.length)
    expect(wayanad.length).toBeGreaterThan(0)
  })

  test("Aluva 2026 row has correct totals (smoke check)", () => {
    const rows = buildCandidateRows(null)
    const aluvaWinnerRow = rows.find(
      (r) => r.constituency.constituencyNumber === 76 && r.isWinner
    )
    expect(aluvaWinnerRow).toBeDefined()
    const total = totalVotesIn(ALUVA)
    expect(aluvaWinnerRow!.share).toBeCloseTo(
      (aluvaWinnerRow!.votes / total) * 100,
      5
    )
  })
})
