/**
 * Flow detection — snapshot test of pattern counts.
 *
 * The runtime classifications power /flows (single-cycle 2021→2026)
 * and /drifts (multi-cycle 2011→2026). Both depend on every candidate
 * carrying a correct per-cycle `alliance` field; if a data edit shifts
 * a few seat assignments or a logic change moves a threshold, the
 * pattern counts visibly drift.
 *
 * The snapshot below pins those counts. If a future change moves them,
 * the test fails with a diff. Then:
 *
 *   - If the change was intentional (e.g. you fixed an alliance
 *     misattribution), regenerate the snapshot with `bunx vitest -u`,
 *     review the diff in git, and commit it alongside the data fix.
 *
 *   - If the change was unintentional, the test caught a regression.
 */

import { describe, expect, test } from "vitest"

import {
  getMultiCycleDrifts,
  getSingleCycleFlows,
  multiCyclePatternKey,
  singleCyclePatternKey,
} from "./flows"

function countByPattern<T>(items: T[], keyFn: (t: T) => string): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const item of items) {
    const k = keyFn(item)
    counts[k] = (counts[k] ?? 0) + 1
  }
  // Sort keys so the snapshot is order-stable across runs.
  const ordered: Record<string, number> = {}
  for (const k of Object.keys(counts).sort()) ordered[k] = counts[k]!
  return ordered
}

describe("flow detection — pattern counts", () => {
  test("single-cycle (2021 → 2026) breakdown", () => {
    const flows = getSingleCycleFlows()
    const counts = countByPattern(flows, (f) => singleCyclePatternKey(f.flow))
    expect({
      total: flows.length,
      byPattern: counts,
    }).toMatchSnapshot()
  })

  test("multi-cycle drift (2011 → 2026) breakdown", () => {
    const drifts = getMultiCycleDrifts()
    const counts = countByPattern(drifts, (d) => multiCyclePatternKey(d))
    expect({
      total: drifts.length,
      byPattern: counts,
    }).toMatchSnapshot()
  })

  test("the three canonical validation cases stay classified as expected", () => {
    // Spot-checks tied to docs/vote-flows.md. These three seats were
    // the original threshold-tuning examples and are the most-cited
    // patterns; if any of them stops classifying, the methodology
    // probably needs revisiting.

    const single = getSingleCycleFlows()
    const drifts = getMultiCycleDrifts()

    // Manjeshwar (#1) — single-cycle LDF→UDF and multi-cycle LDF→UDF
    const manjeshwarSingle = single.find(
      (f) => f.constituency.constituencyNumber === 1
    )
    expect(manjeshwarSingle?.flow.kind).toBe("two-way")
    if (manjeshwarSingle?.flow.kind === "two-way") {
      expect(manjeshwarSingle.flow.from).toBe("LDF")
      expect(manjeshwarSingle.flow.to).toBe("UDF")
    }
    const manjeshwarDrift = drifts.find(
      (d) => d.constituency.constituencyNumber === 1
    )
    expect(manjeshwarDrift?.gainer).toBe("UDF")
    expect(manjeshwarDrift?.loser).toBe("LDF")

    // Karunagappally (#116) — single-cycle [LDF+UDF]→NDA
    const karunagappallySingle = single.find(
      (f) => f.constituency.constituencyNumber === 116
    )
    expect(karunagappallySingle?.flow.kind).toBe("both-to-one")
    if (karunagappallySingle?.flow.kind === "both-to-one") {
      expect(karunagappallySingle.flow.to).toBe("NDA")
    }

    // Attingal (#128) — multi-cycle LDF→NDA, the canonical sustained drift
    const attingalDrift = drifts.find(
      (d) => d.constituency.constituencyNumber === 128
    )
    expect(attingalDrift?.gainer).toBe("NDA")
    expect(attingalDrift?.loser).toBe("LDF")
  })

  test("invariant: every multi-cycle drift has a different gainer and loser", () => {
    for (const d of getMultiCycleDrifts()) {
      expect(d.gainer).not.toBe(d.loser)
    }
  })
})
