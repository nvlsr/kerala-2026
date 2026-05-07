/**
 * Aggregation modules. Each file has one public function (or a tightly
 * related pair) and computes a single shape:
 *
 *   - state-summary.ts    — getStateSummary (state-level totals)
 *   - alliance-breakdown.ts — getAllianceBreakdown (parties within an alliance)
 *   - departed-parties.ts — getDepartedAllianceParties (parties that left)
 *   - seat-trend.ts       — getTrendData (per-seat historical chart)
 *   - seat-history.ts     — getPastCandidates / getPastWinners /
 *                           get2021Baseline (per-seat historical lookups)
 *   - alliance-trend.ts   — getAllianceTrendData (scope-wide alliance trend)
 *   - party-trend.ts      — getPartyTrendData (scope-wide single-party trend)
 *
 * The `_helpers.ts` file holds tiny shared utilities (currently just
 * `ensureMapEntry`). Public API is exposed via this barrel; consumers
 * import from `@/lib/data` and never reach in directly.
 */

export * from "./alliance-breakdown"
export * from "./alliance-trend"
export * from "./departed-parties"
export * from "./party-trend"
export * from "./seat-history"
export * from "./seat-trend"
export * from "./state-summary"
