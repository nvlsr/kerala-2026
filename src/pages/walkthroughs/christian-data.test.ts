import { describe, expect, test } from "vitest"

import {
  COHORT_AC_LIST,
  COHORT_BY_AC,
  COHORT_SIZE,
  COHORT_TABLE_ROWS,
  COHORT_TRAJECTORY,
  CYCLE_YEARS,
  LATIN_ZONE_BREAKDOWN,
  M_EVIDENCE,
} from "./christian-data"

// Reference numbers come from the analysis scripts (scripts/analyze-
// subrite-cohorts.ts + analyze-christian-cohort-detail.ts + analyze-
// christian-mitigations.ts). If the OSM pipeline or historical share
// computation drifts, these will flag.

describe("walkthroughs-christian-data — cohort sizes", () => {
  test("Christian-cohort totals match the documented Sprint 2 numbers", () => {
    expect(COHORT_SIZE.syro_malabar).toBe(31)
    expect(COHORT_SIZE.latin_catholic).toBe(28)
    expect(COHORT_SIZE.indian_orthodox).toBe(10)
    expect(COHORT_SIZE.csi).toBe(5)
    expect(COHORT_SIZE.jacobite_syrian).toBe(3)
    expect(COHORT_SIZE.marthoma).toBe(2)
    expect(COHORT_SIZE.below_threshold).toBe(61)
  })

  test("table rows match cohort sizes", () => {
    for (const row of COHORT_TABLE_ROWS) {
      expect(row.n).toBe(COHORT_SIZE[row.code])
    }
  })
})

describe("walkthroughs-christian-data — multi-cycle trajectories", () => {
  test("Syro-Malabar: 2011 high → 2016/21 LDF wobble → 2026 restored", () => {
    const traj = COHORT_TRAJECTORY.syro_malabar
    expect(traj).toHaveLength(CYCLE_YEARS.length)
    const get = (y: number) => traj.find((p) => p.year === y)
    // Mean UDF share — directional values (rounded to ints in walkthrough prose).
    expect(Math.round(get(2011)!.UDF)).toBe(49)
    expect(Math.round(get(2026)!.UDF)).toBe(48)
    // Wins out of 31.
    expect(get(2011)!.udfWins).toBe(21)
    expect(get(2016)!.udfWins).toBe(14)
    expect(get(2021)!.udfWins).toBe(13)
    expect(get(2026)!.udfWins).toBe(26)
  })

  test("Latin Catholic: structurally LDF 2011-2021 (4 of 28 wins)", () => {
    const traj = COHORT_TRAJECTORY.latin_catholic
    const get = (y: number) => traj.find((p) => p.year === y)
    expect(get(2016)!.udfWins).toBe(4)
    expect(get(2021)!.udfWins).toBe(4)
    expect(get(2026)!.udfWins).toBe(21)
    // The "17 ACs flipped LDF→UDF" headline derives from 21 − 4.
    expect(get(2026)!.udfWins - get(2021)!.udfWins).toBe(17)
  })

  test("Indian Orthodox: perennial 50/50 — even 2026 splits ~5/4/1", () => {
    const traj = COHORT_TRAJECTORY.indian_orthodox
    const p2026 = traj.find((p) => p.year === 2026)!
    expect(p2026.udfWins).toBe(5)
    expect(p2026.ldfWins).toBe(4)
    expect(p2026.ndaWins).toBe(1)
  })

  test("Jacobite: 100% UDF in 2026 (n=3)", () => {
    const p2026 = COHORT_TRAJECTORY.jacobite_syrian.find(
      (p) => p.year === 2026
    )!
    expect(p2026.udfWins).toBe(3)
    expect(p2026.ldfWins).toBe(0)
  })

  test("CSI: NDA share consistently 20%+ across all 4 cycles", () => {
    for (const p of COHORT_TRAJECTORY.csi) {
      expect(p.NDA).toBeGreaterThan(15)
    }
  })
})

describe("walkthroughs-christian-data — Latin zone breakdown", () => {
  test("three zones present with expected order south/central/north", () => {
    const zones = LATIN_ZONE_BREAKDOWN.map((r) => r.zone)
    expect(zones).toEqual(["south", "central", "north"])
  })

  test("zone ΔUDF matches the Latin-flipped headline (south smaller, central+north larger)", () => {
    const south = LATIN_ZONE_BREAKDOWN.find((r) => r.zone === "south")!
    const central = LATIN_ZONE_BREAKDOWN.find((r) => r.zone === "central")!
    const north = LATIN_ZONE_BREAKDOWN.find((r) => r.zone === "north")!
    expect(Math.round(south.meanDeltaUDF * 10) / 10).toBeCloseTo(6.8, 1)
    expect(Math.round(central.meanDeltaUDF * 10) / 10).toBeCloseTo(10.6, 1)
    expect(Math.round(north.meanDeltaUDF * 10) / 10).toBeCloseTo(10.2, 1)
  })

  test("ΔNDA: south Latin saw modest growth; central/north shrank", () => {
    const south = LATIN_ZONE_BREAKDOWN.find((r) => r.zone === "south")!
    const central = LATIN_ZONE_BREAKDOWN.find((r) => r.zone === "central")!
    const north = LATIN_ZONE_BREAKDOWN.find((r) => r.zone === "north")!
    expect(south.meanDeltaNDA).toBeGreaterThan(1)
    expect(central.meanDeltaNDA).toBeLessThanOrEqual(0)
    expect(north.meanDeltaNDA).toBeLessThanOrEqual(0)
  })
})

describe("walkthroughs-christian-data — mitigation evidence", () => {
  test("Ernakulam: Latin +16.0 vs SM +8.8 (a 7pp gap)", () => {
    expect(M_EVIDENCE.ernakulam.latin.deltaUDF).toBeCloseTo(16.0, 1)
    expect(M_EVIDENCE.ernakulam.sm.deltaUDF).toBeCloseTo(8.8, 1)
    expect(M_EVIDENCE.ernakulam.gap).toBeCloseTo(7.2, 1)
  })

  test("High vs low Christian-share gaps are positive for all Christian cohorts", () => {
    expect(M_EVIDENCE.highLowChristianShare.latin.gap).toBeGreaterThan(0)
    expect(M_EVIDENCE.highLowChristianShare.sm.gap).toBeGreaterThan(0)
    expect(M_EVIDENCE.highLowChristianShare.orthodox.gap).toBeGreaterThan(0)
    // But the below-threshold control shows no positive gradient.
    expect(M_EVIDENCE.highLowChristianShare.belowThreshold.gap).toBeLessThan(0)
  })

  test("Hindu-NDA absorption: separable from Christian-cohort story", () => {
    // Thrissur Hindu ACs got the big NDA gain; Thrissur SM ACs did not.
    expect(M_EVIDENCE.thrissurNda.hindu).toBeGreaterThan(8)
    expect(M_EVIDENCE.thrissurNda.sm).toBeLessThan(0)
  })
})

describe("walkthroughs-christian-data — AC list + cohort map shape", () => {
  test("COHORT_AC_LIST sums to COHORT_SIZE for each cohort", () => {
    for (const code of Object.keys(COHORT_SIZE) as Array<
      keyof typeof COHORT_SIZE
    >) {
      expect(COHORT_AC_LIST[code]).toHaveLength(COHORT_SIZE[code])
    }
  })

  test("COHORT_BY_AC omits below_threshold ACs (so map renders them as no-data)", () => {
    const labelledCount = Object.keys(COHORT_BY_AC).length
    expect(labelledCount).toBe(140 - COHORT_SIZE.below_threshold)
  })

  test("AC list within a cohort is sorted by Christian share descending", () => {
    for (const list of Object.values(COHORT_AC_LIST)) {
      for (let i = 1; i < list.length; i++) {
        expect(list[i - 1].christianPct).toBeGreaterThanOrEqual(
          list[i].christianPct
        )
      }
    }
  })
})
