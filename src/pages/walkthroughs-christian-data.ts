/**
 * Data preparation for /walkthroughs/christian-walkthrough.
 *
 * Computes multi-cycle alliance trajectories per Christian sub-rite
 * cohort + auxiliary tables (win counts, Latin-zone breakdown,
 * mitigation evidence).
 *
 * The cohort layer comes from src/lib/data/subrite-bins.ts; the
 * alliance data comes from constituencies (2026) + getHistoricalFor
 * (2011/2016/2021).
 */

import { constituencies } from "@/lib/data/constituencies"
import { getHistoricalFor } from "@/lib/data/historical"
import { districtsMeta } from "@/lib/data/loaders"
import {
  CHRISTIAN_SUBRITE_COHORTS,
  christianSubRiteCohortFor,
  type ChristianSubRiteCohort,
} from "@/lib/data/subrite-bins"

export type CycleYear = 2011 | 2016 | 2021 | 2026
export const CYCLE_YEARS: readonly CycleYear[] = [2011, 2016, 2021, 2026]

export type AllianceShares = {
  UDF: number
  LDF: number
  NDA: number
  OTHER: number
}

// ── Share computation per AC per year ─────────────────────────────────
function shares2026Of(acNumber: number): AllianceShares | null {
  const c = constituencies.find((x) => x.constituencyNumber === acNumber)
  if (!c) return null
  let total = 0
  for (const cand of c.candidates) {
    if (cand.isNota) continue
    total += cand.votes
  }
  if (total === 0) return null
  const out: AllianceShares = { UDF: 0, LDF: 0, NDA: 0, OTHER: 0 }
  for (const cand of c.candidates) {
    if (cand.isNota) continue
    const a = cand.alliance
    if (a === "UDF" || a === "LDF" || a === "NDA") {
      out[a] += (cand.votes / total) * 100
    } else {
      out.OTHER += (cand.votes / total) * 100
    }
  }
  return out
}

function sharesHistoricalOf(
  acNumber: number,
  year: 2011 | 2016 | 2021
): AllianceShares | null {
  const hist = getHistoricalFor(acNumber)
  if (!hist) return null
  const e = hist.elections.find((e) => e.year === year && e.type === "general")
  if (!e) return null
  let total = 0
  for (const c of e.candidates) total += c.votes
  if (total === 0) return null
  const out: AllianceShares = { UDF: 0, LDF: 0, NDA: 0, OTHER: 0 }
  for (const c of e.candidates) {
    if (c.alliance === "NOTA") continue
    const pct = (c.votes / total) * 100
    if (c.alliance === "UDF" || c.alliance === "LDF" || c.alliance === "NDA") {
      out[c.alliance] += pct
    } else {
      out.OTHER += pct
    }
  }
  return out
}

function sharesFor(acNumber: number, year: CycleYear): AllianceShares | null {
  return year === 2026
    ? shares2026Of(acNumber)
    : sharesHistoricalOf(acNumber, year)
}

function winnerOf(s: AllianceShares): keyof AllianceShares {
  let best: keyof AllianceShares = "UDF"
  let bestVal = -Infinity
  for (const a of ["UDF", "LDF", "NDA", "OTHER"] as const) {
    if (s[a] > bestVal) {
      bestVal = s[a]
      best = a
    }
  }
  return best
}

const mean = (xs: number[]) =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length

// ── Aggregate per cohort × cycle ─────────────────────────────────────
export type CohortCyclePoint = {
  year: CycleYear
  UDF: number
  LDF: number
  NDA: number
  udfWins: number
  ldfWins: number
  ndaWins: number
}

// Display order for "real" Christian cohorts (excludes below-threshold residual)
export const REAL_COHORTS: readonly ChristianSubRiteCohort[] = [
  "syro_malabar",
  "latin_catholic",
  "indian_orthodox",
  "jacobite_syrian",
  "marthoma",
  "csi",
]

export const COHORT_LABEL: Record<ChristianSubRiteCohort, string> =
  Object.fromEntries(
    CHRISTIAN_SUBRITE_COHORTS.map((c) => [c.code, c.label])
  ) as Record<ChristianSubRiteCohort, string>

export const COHORT_COLOR: Record<ChristianSubRiteCohort, string> =
  Object.fromEntries(
    CHRISTIAN_SUBRITE_COHORTS.map((c) => [c.code, c.color])
  ) as Record<ChristianSubRiteCohort, string>

export const COHORT_SIZE: Record<ChristianSubRiteCohort, number> = (() => {
  const out = Object.fromEntries(
    CHRISTIAN_SUBRITE_COHORTS.map((c) => [c.code, 0])
  ) as Record<ChristianSubRiteCohort, number>
  for (const c of constituencies) {
    out[christianSubRiteCohortFor(c.constituencyNumber)]++
  }
  return out
})()

export const COHORT_TRAJECTORY: Record<
  ChristianSubRiteCohort,
  CohortCyclePoint[]
> = (() => {
  const result = Object.fromEntries(
    CHRISTIAN_SUBRITE_COHORTS.map((c) => [c.code, [] as CohortCyclePoint[]])
  ) as unknown as Record<ChristianSubRiteCohort, CohortCyclePoint[]>

  for (const cohort of CHRISTIAN_SUBRITE_COHORTS.map((c) => c.code)) {
    const acsInCohort = constituencies
      .map((c) => c.constituencyNumber)
      .filter((n) => christianSubRiteCohortFor(n) === cohort)
    for (const year of CYCLE_YEARS) {
      const shares = acsInCohort
        .map((ac) => sharesFor(ac, year))
        .filter((s): s is AllianceShares => s != null)
      const winners = shares.map(winnerOf)
      result[cohort].push({
        year,
        UDF: mean(shares.map((s) => s.UDF)),
        LDF: mean(shares.map((s) => s.LDF)),
        NDA: mean(shares.map((s) => s.NDA)),
        udfWins: winners.filter((w) => w === "UDF").length,
        ldfWins: winners.filter((w) => w === "LDF").length,
        ndaWins: winners.filter((w) => w === "NDA").length,
      })
    }
  }
  return result
})()

// ── Latin Catholic geographic zone breakdown (§10) ───────────────────
const ZONE: Record<string, "south" | "central" | "north"> = {
  thiruvananthapuram: "south",
  kollam: "south",
  pathanamthitta: "south",
  alappuzha: "central",
  kottayam: "central",
  ernakulam: "central",
  thrissur: "central",
  idukki: "central",
  palakkad: "central",
  kozhikode: "north",
  malappuram: "north",
  kannur: "north",
  kasaragod: "north",
  wayanad: "north",
}

export type ZoneLabel = "south" | "central" | "north"
export type LatinZoneRow = {
  zone: ZoneLabel
  n: number
  meanUDF2021: number
  meanUDF2026: number
  meanDeltaUDF: number
  meanNDA2021: number
  meanNDA2026: number
  meanDeltaNDA: number
}

export const LATIN_ZONE_BREAKDOWN: readonly LatinZoneRow[] = (() => {
  const buckets: Record<ZoneLabel, number[][]> = {
    south: [],
    central: [],
    north: [],
  }
  // Each entry is [UDF2021, UDF2026, NDA2021, NDA2026]
  for (const c of constituencies) {
    if (christianSubRiteCohortFor(c.constituencyNumber) !== "latin_catholic")
      continue
    const districtId =
      districtsMeta.constituencyToDistrict[String(c.constituencyNumber)] ?? null
    if (!districtId) continue
    const zone = ZONE[districtId]
    if (!zone) continue
    const s21 = sharesHistoricalOf(c.constituencyNumber, 2021)
    const s26 = shares2026Of(c.constituencyNumber)
    if (!s21 || !s26) continue
    buckets[zone].push([s21.UDF, s26.UDF, s21.NDA, s26.NDA])
  }
  const rows: LatinZoneRow[] = []
  for (const zone of ["south", "central", "north"] as const) {
    const list = buckets[zone]
    if (list.length === 0) continue
    const udf21 = mean(list.map((r) => r[0]))
    const udf26 = mean(list.map((r) => r[1]))
    const nda21 = mean(list.map((r) => r[2]))
    const nda26 = mean(list.map((r) => r[3]))
    rows.push({
      zone,
      n: list.length,
      meanUDF2021: udf21,
      meanUDF2026: udf26,
      meanDeltaUDF: udf26 - udf21,
      meanNDA2021: nda21,
      meanNDA2026: nda26,
      meanDeltaNDA: nda26 - nda21,
    })
  }
  return rows
})()

// ── Mitigation evidence (M1, M2, M3) for §11 + §12 ───────────────────
// Numbers computed by scripts/analyze-christian-mitigations.ts.

export const M_EVIDENCE = {
  // M2: Ernakulam same-district
  ernakulam: {
    latin: { n: 3, deltaUDF: 16.0, udf21: 36.1, udf26: 52.1 },
    sm: { n: 8, deltaUDF: 8.8, udf21: 45.0, udf26: 53.8 },
    gap: 7.2,
  },
  // M3: High vs low Christian-share
  highLowChristianShare: {
    latin: { lowDelta: 6.7, highDelta: 11.3, gap: 4.6 },
    sm: { lowDelta: 5.4, highDelta: 10.9, gap: 5.4 },
    orthodox: { lowDelta: 6.1, highDelta: 8.4, gap: 2.3 },
    belowThreshold: { lowDelta: 7.2, highDelta: 5.5, gap: -1.8 },
  },
  // Bonus: Hindu-NDA separation
  thrissurNda: {
    hindu: 10.8, // ΔNDA in Hindu-majority Thrissur ACs
    sm: -0.9, // ΔNDA in SM-cohort Thrissur ACs
  },
} as const

// ── Cohort-by-AC mapping for the categorical map (§2) ────────────────
// Map of ac_id (as string) → cohort code, for cohorts above threshold.
// ACs with cohort "below_threshold" are omitted so the map can render
// them as a separate no-data colour.
export const COHORT_BY_AC: Record<string, ChristianSubRiteCohort> = (() => {
  const out: Record<string, ChristianSubRiteCohort> = {}
  for (const c of constituencies) {
    const cohort = christianSubRiteCohortFor(c.constituencyNumber)
    if (cohort !== "below_threshold") {
      out[String(c.constituencyNumber)] = cohort
    }
  }
  return out
})()
