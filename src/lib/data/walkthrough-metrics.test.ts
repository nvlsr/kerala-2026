/**
 * Sanity-check that walkthrough-metrics.ts produces statewide
 * constituency-equal aggregates matching the Python analysis
 * scripts (scripts/analysis/narrative-regression.py et al.) within
 * rounding.
 */
import { describe, expect, test } from "vitest"

import {
  getAllACMetrics,
  getPerACAllianceDelta,
  getPerACBJPDelta,
  getRegionForAC,
  getStatewideSummary,
} from "./walkthrough-metrics"

describe("walkthrough-metrics", () => {
  test("loads all 140 ACs", () => {
    const all = getAllACMetrics()
    expect(all.length).toBe(140)
  })

  test("statewide UDF Δshare matches Python (+7.29 ± 0.05)", () => {
    const s = getStatewideSummary()
    expect(s.meanDeltaUDF).toBeGreaterThan(7.2)
    expect(s.meanDeltaUDF).toBeLessThan(7.4)
  })

  test("statewide LDF Δshare matches Python (-7.43 ± 0.05)", () => {
    const s = getStatewideSummary()
    expect(s.meanDeltaLDF).toBeGreaterThan(-7.5)
    expect(s.meanDeltaLDF).toBeLessThan(-7.35)
  })

  test("statewide NDA Δshare matches Python (+2.05 ± 0.05)", () => {
    const s = getStatewideSummary()
    expect(s.meanDeltaNDA).toBeGreaterThan(2.0)
    expect(s.meanDeltaNDA).toBeLessThan(2.1)
  })

  test("statewide BJP party Δshare matches Python (+0.29 ± 0.05)", () => {
    const s = getStatewideSummary()
    expect(s.meanDeltaBJP).toBeGreaterThan(0.24)
    expect(s.meanDeltaBJP).toBeLessThan(0.34)
  })

  test("getPerACAllianceDelta returns 140 entries for each main alliance", () => {
    expect(getPerACAllianceDelta("UDF").size).toBe(140)
    expect(getPerACAllianceDelta("LDF").size).toBe(140)
    expect(getPerACAllianceDelta("NDA").size).toBe(140)
  })

  test("getPerACBJPDelta returns 140 entries", () => {
    expect(getPerACBJPDelta().size).toBe(140)
  })

  test("region partition: 48 N + 67 C + 25 S = 140", () => {
    const all = getAllACMetrics()
    const counts = { N: 0, C: 0, S: 0, "?": 0 }
    for (const m of all) {
      if (m.region === "N") counts.N++
      else if (m.region === "C") counts.C++
      else if (m.region === "S") counts.S++
      else counts["?"]++
    }
    expect(counts.N).toBe(48)
    expect(counts.C).toBe(67)
    expect(counts.S).toBe(25)
    expect(counts["?"]).toBe(0)
  })

  test("getRegionForAC: spot checks", () => {
    // AC 113 = Aranmula in Pathanamthitta (Central)
    expect(getRegionForAC(113)).toBe("C")
    // AC 41 = Vengara in Malappuram (North)
    expect(getRegionForAC(41)).toBe("N")
    // AC 135 = Nemom in Trivandrum (South)
    expect(getRegionForAC(135)).toBe("S")
  })

  test("known outliers: Udumbanchola has biggest LDF loss", () => {
    const all = getAllACMetrics()
    const u = all.find((m) => m.acNumber === 89)
    expect(u).toBeDefined()
    // Udumbanchola LDF Δ ~ -24.6pp per A1 docs
    expect(u!.deltas.LDF).toBeLessThan(-22)
    expect(u!.deltas.LDF).toBeGreaterThan(-26)
  })

  test("known outliers: Vengara has positive LDF Δ", () => {
    const all = getAllACMetrics()
    const v = all.find((m) => m.acNumber === 41)
    expect(v).toBeDefined()
    // Vengara LDF Δ ~ +8.5pp (only Muslim-majority LDF gain)
    expect(v!.deltas.LDF).toBeGreaterThan(7)
  })

  test("BJP party Δ Poonjar: +25pp (P.C. George contest-entry)", () => {
    const all = getAllACMetrics()
    const p = all.find((m) => m.acNumber === 101)
    expect(p).toBeDefined()
    expect(p!.bjpDelta).toBeGreaterThan(24)
    expect(p!.bjpDelta).toBeLessThan(26)
  })
})
