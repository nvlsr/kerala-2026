/**
 * Barrel re-exports. Most of the app imports from `@/lib/data`; this file is
 * the resolved entry. Add new exports here when adding to a sub-module.
 *
 * Module organization:
 *   - loaders.ts       — JSON imports + parsed metadata (the source of truth)
 *   - format.ts        — formatNumber/formatPercent + name normalization
 *   - parties.ts       — party short/canonical helpers
 *   - alliances.ts     — alliance lookup + allianceForCandidate
 *   - constituencies.ts — 2026 constituency list + scope helpers
 *   - districts.ts     — district list + lookup
 *   - demographics.ts  — religion + per-district census
 *   - historical.ts    — past-cycle data loader
 *   - aggregates/     — state/alliance/party summaries + trend builders
 *                       (one public function per file under this directory;
 *                       see `aggregates/index.ts` for the layout)
 *   - candidate-rows.ts — flat row builder used by the candidate table
 *   - religion-bins.ts — AC sets for ReligionMix bins (2025 projection)
 */
export * from "./alliances"
export * from "./aggregates"
export * from "./candidate-rows"
export * from "./constituencies"
export * from "./demographics"
export * from "./districts"
export * from "./format"
export * from "./historical"
export * from "./parties"
export * from "./religion-bins"
export { demographicsYear } from "./demographics"
