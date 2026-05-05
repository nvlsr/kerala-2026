import { describe, expect, test } from "vitest"

import { canonicalPartyName, partyShort } from "./parties"
import { allianceForRawParty } from "./alliances"
import { constituencies, totalVotesIn, winnerOf } from "./constituencies"
import {
  get2021Baseline,
  getAllianceTrendData,
  getPartyTrendData,
  getPastCandidates,
  getPastWinners,
  getStateSummary,
} from "./aggregates"
import { buildCandidateRows } from "./candidate-rows"
import { sortCandidateRows } from "@/lib/candidate-sort"
import {
  filtersReducer,
  hasActiveFilters,
  initialFilters,
  type Filters,
} from "@/lib/filters"
import {
  computeSeatEncodings,
  encodingModeFor,
} from "@/lib/seat-encoding"

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
    expect(canonicalPartyName("CPM")).toBe("Communist Party of India (Marxist)")
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
        winnersByConstituency.set(
          num,
          (winnersByConstituency.get(num) ?? 0) + 1
        )
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

describe("getPastWinners (Aluva 76)", () => {
  test("returns one row per past election + 2026, sorted by year", () => {
    const winners = getPastWinners(76)
    expect(winners.length).toBeGreaterThanOrEqual(2)
    const years = winners.map((w) => w.year)
    const sorted = [...years].sort((a, b) => a - b)
    expect(years).toEqual(sorted)
    expect(years).toContain(2026)
  })

  test("every row is the election winner (isWinnerOfElection)", () => {
    const winners = getPastWinners(76)
    for (const w of winners) {
      expect(w.didNotContest).toBe(false)
      expect(w.isWinnerOfElection).toBe(true)
      expect(w.margin).toBeGreaterThan(0)
    }
  })

  test("only the 2026 row is marked isCurrent", () => {
    const winners = getPastWinners(76)
    const current = winners.filter((w) => w.isCurrent)
    expect(current).toHaveLength(1)
    expect(current[0]!.year).toBe(2026)
  })
})

describe("getPastCandidates (Aluva 76, party-scoped)", () => {
  test("INC: contested every election; runner-up rows have negative margin", () => {
    const incRows = getPastCandidates(76, "Indian National Congress")
    expect(incRows.length).toBeGreaterThanOrEqual(2)
    for (const r of incRows) {
      expect(r.party).toBe("Indian National Congress")
      expect(r.didNotContest).toBe(false)
      if (!r.isWinnerOfElection) {
        expect(r.margin).toBeLessThan(0)
      } else {
        expect(r.margin).toBeGreaterThan(0)
      }
    }
  })

  test("a party that didn't contest a year produces a didNotContest stub", () => {
    const rows = getPastCandidates(76, "Nonexistent Party Xyz")
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((r) => r.didNotContest)).toBe(true)
    for (const r of rows) {
      expect(r.votes).toBe(0)
      expect(r.share).toBe(0)
      expect(r.isWinnerOfElection).toBe(false)
    }
  })
})

describe("getPastCandidates / getPastWinners edge cases", () => {
  test("invalid constituency number returns empty array", () => {
    expect(getPastCandidates(99999)).toEqual([])
    expect(getPastWinners(99999)).toEqual([])
  })
})

describe("sortCandidateRows", () => {
  const rows = buildCandidateRows(null)

  test("desc by votes lists highest first", () => {
    const sorted = sortCandidateRows(rows, "votes", "desc")
    expect(sorted[0]!.votes).toBeGreaterThanOrEqual(sorted[1]!.votes)
    expect(sorted[0]!.votes).toBeGreaterThanOrEqual(
      sorted[sorted.length - 1]!.votes
    )
  })

  test("asc by constituency uses numeric AC number, not string", () => {
    const sorted = sortCandidateRows(rows, "constituency", "asc")
    for (let i = 1; i < sorted.length; i++) {
      expect(
        sorted[i]!.constituency.constituencyNumber
      ).toBeGreaterThanOrEqual(sorted[i - 1]!.constituency.constituencyNumber)
    }
  })

  test("nullable shareDelta asc pushes nulls to the end; non-null is sorted ascending", () => {
    const asc = sortCandidateRows(rows, "shareDelta", "asc")
    const firstNull = asc.findIndex((r) => r.shareDelta2021 == null)
    if (firstNull !== -1) {
      for (let i = firstNull; i < asc.length; i++) {
        expect(asc[i]!.shareDelta2021).toBeNull()
      }
      const head = asc.slice(0, firstNull)
      for (let i = 1; i < head.length; i++) {
        expect(head[i]!.shareDelta2021!).toBeGreaterThanOrEqual(
          head[i - 1]!.shareDelta2021!
        )
      }
    }
  })

  test("does not mutate input array", () => {
    const subset = rows.slice(0, 5)
    const before = subset.map((r) => r.candidate.name)
    sortCandidateRows(subset, "votes", "asc")
    expect(subset.map((r) => r.candidate.name)).toEqual(before)
  })
})

describe("encodingModeFor / computeSeatEncodings", () => {
  const ALL_SEATS = new Set(constituencies.map((c) => c.constituencyNumber))

  test("default filters → alliance mode", () => {
    expect(encodingModeFor(initialFilters)).toBe("alliance")
  })

  test("result=all + sort=margin → magnitude mode", () => {
    const f: Filters = {
      ...initialFilters,
      result: "all",
      sort: { column: "margin", dir: "desc" },
    }
    expect(encodingModeFor(f)).toBe("magnitude")
  })

  test("result=all + sort=shareDelta → diverging mode", () => {
    const f: Filters = {
      ...initialFilters,
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    }
    expect(encodingModeFor(f)).toBe("diverging")
  })

  test("result=all + categorical sort → falls back to alliance", () => {
    const f: Filters = {
      ...initialFilters,
      result: "all",
      sort: { column: "constituency", dir: "asc" },
    }
    expect(encodingModeFor(f)).toBe("alliance")
  })

  test("alliance mode covers every seat with a color/opacity", () => {
    const enc = computeSeatEncodings(initialFilters, ALL_SEATS)
    expect(enc.size).toBe(140)
    for (const [, e] of enc) {
      expect(typeof e.color).toBe("string")
      expect(e.opacity).toBeGreaterThan(0)
      expect(e.opacity).toBeLessThanOrEqual(1)
    }
  })

  test("magnitude mode: highest sort value gets the highest opacity", () => {
    const f: Filters = {
      ...initialFilters,
      result: "all",
      sort: { column: "votes", dir: "desc" },
    }
    const enc = computeSeatEncodings(f, ALL_SEATS)
    const opacities = [...enc.values()].map((e) => e.opacity)
    expect(Math.max(...opacities)).toBeGreaterThan(Math.min(...opacities))
  })

  test("diverging mode: positive deltas use a different color than negative", () => {
    const f: Filters = {
      ...initialFilters,
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    }
    const enc = computeSeatEncodings(f, ALL_SEATS)
    const colors = new Set([...enc.values()].map((e) => e.color))
    // expect at least 2 distinct hues (gain + loss); no-data fills add a third
    expect(colors.size).toBeGreaterThanOrEqual(2)
  })

  test("out-of-filter seats are dimmed", () => {
    const inSet = new Set([76]) // only Aluva
    const enc = computeSeatEncodings(initialFilters, inSet)
    const aluva = enc.get(76)!
    const other = enc.get(1)!
    expect(other.opacity).toBeLessThan(aluva.opacity)
  })
})

describe("filtersReducer reset + hasActiveFilters", () => {
  test("hasActiveFilters is false for initialFilters", () => {
    expect(hasActiveFilters(initialFilters)).toBe(false)
  })

  test("hasActiveFilters is true once any URL-synced field diverges", () => {
    const withDistrict = filtersReducer(initialFilters, {
      type: "set-district",
      district: "wayanad",
    })
    expect(hasActiveFilters(withDistrict)).toBe(true)

    const withResult = filtersReducer(initialFilters, {
      type: "set-result",
      result: "all",
    })
    expect(hasActiveFilters(withResult)).toBe(true)
  })

  test("reset returns initialFilters from any state", () => {
    let state = filtersReducer(initialFilters, {
      type: "apply-preset",
      preset: { district: "wayanad", alliance: "LDF", result: "all" },
    })
    expect(hasActiveFilters(state)).toBe(true)
    state = filtersReducer(state, { type: "reset" })
    expect(state).toEqual(initialFilters)
    expect(hasActiveFilters(state)).toBe(false)
  })
})
