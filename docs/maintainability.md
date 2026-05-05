# Maintainability review

Snapshot of refactor opportunities as of 2026-05-05. Each item names the problem, where it lives, and a concrete fix. Severity is the maintenance pain it causes today, not its size.

## High

### H1. Alliance code list duplicated across 5+ sites
- **Where:** `src/lib/filters.ts:119`, `src/lib/data/alliances.ts:15`, `src/components/kerala-map.tsx:15`, `src/components/alliance-section.tsx:23`, `src/components/alliance-historical-chart.tsx`
- **Why it hurts:** Adding or reordering an alliance touches every site; silent inconsistencies have already happened (NOTA omitted in some renderings).
- **Fix:** Export `ALLIANCE_CODES: readonly AllianceCode[]` (and a matching `Set`) from `alliances.ts`; replace every literal array with the import.

### H2. `buildCandidateRows` missing from data barrel
- **Where:** `src/lib/data/index.ts`
- **Why it hurts:** Components reach into `@/lib/data/candidate-rows` directly, breaking the documented "import from `@/lib/data`" convention.
- **Fix:** Add `export * from "./candidate-rows"` to the barrel; switch deep imports.

### H3. Unsafe casts in `parseFilters`
- **Where:** `src/lib/filters.ts:152, 171`
- **Why it hurts:** The `as AllianceCode` and `as [SortColumn, SortDir]` happen before validation, so the code reads as type-safe while actually relying on the next-line `Array.includes` check to retroactively justify the cast. Easy to misuse when the validation check is later edited.
- **Fix:** Validate first as `string`, narrow with the type guard, only then cast — or replace with a small `parse` helper per field.

### H4. `candidate-table.tsx` (440 lines) holds a tangled inline sort switch
- **Where:** `src/components/candidate-table.tsx:76–118`
- **Why it hurts:** Eight columns with replicated null-handling in one switch; this is the file most likely to grow when adding metrics, and it's already at the cognitive limit.
- **Fix:** Extract per-column comparators to `src/lib/candidate-sort.ts` keyed by `SortColumn`; component just looks up the comparator.

### H5. Manual 5-way enum check in `allianceForCandidate`
- **Where:** `src/lib/data/alliances.ts:35–40`
- **Why it hurts:** Adding an alliance silently misses validation here, with no test to catch it.
- **Fix:** Use the `ALLIANCE_CODES_SET` from H1.

### H6. Theme persistence duplicated between callback and keyboard handler
- **Where:** `src/components/theme-provider.tsx:98, 160–172`
- **Why it hurts:** localStorage write logic lives in two places and can drift; one path can update storage while the other doesn't.
- **Fix:** Extract `persistTheme(theme)` helper, call from both sites.

## Medium

### M1. `aggregates.ts` (647 lines) has two near-identical `ensureYear` helpers
- **Where:** `src/lib/data/aggregates.ts:485–501` and `582–589`
- **Why it hurts:** ~20 lines of duplication; either copy can drift from the other.
- **Fix:** Lift `ensureYearEntry` to module scope; both callers use it.

### M2. Inconsistent null contracts across trend/historical helpers
- **Where:** `getTrendData` returns `null` (`aggregates.ts:164–169`); `getPastCandidates` returns `[]` (`aggregates.ts:293–300`)
- **Why it hurts:** Consumers branch differently for "no data" by accident; missed checks silently render empty UI.
- **Fix:** Pick one contract per shape (recommend: arrays return `[]`, single objects return `null`); document at the type.

### M3. Cast-based `_sortKey` augmentation in trend builder
- **Where:** `src/lib/data/aggregates.ts:254, 259–260`
- **Why it hurts:** Synthetic field added/stripped via cast. Fragile if the trend type ever grows a real `_sortKey`.
- **Fix:** Build a sorted index array first, then map series; no in-place augmentation.

### M4. Test coverage gap on historical math
- **Where:** `getPastCandidates` and `getPastWinners` in `src/lib/data/aggregates.ts:293–418`; nothing in `src/lib/data/data.test.ts`
- **Why it hurts:** ~125 lines of branching margin/share math with no regression net; this code is exactly the kind that breaks on data updates.
- **Fix:** Add 3–5 tests: no historical data, party didn't contest, winner-vs-runner-up margin signs, NOTA exclusion.

## Low

### L1. Magic threshold in constituency-section
- **Where:** `src/components/constituency-section.tsx:30` (`ROSTER_THRESHOLD = 0.01`)
- **Why it hurts:** Tweaking the cutoff means re-deriving its meaning from context.
- **Fix:** One-line comment ("hide candidates under 1% of votes from the default roster") or rename to `MIN_ROSTER_SHARE`.

---

## Phased plan

Three short phases, each independently shippable. Each phase ends with `bun run typecheck && bun run lint && bun run test && bun run build` green. Commit per phase.

### Phase 1 — Constants & barrel hygiene (low risk, unblocks later phases)

1. **H1** Add `ALLIANCE_CODES` (array + Set) to `alliances.ts`; replace literals across the 5 call sites.
2. **H5** Switch `allianceForCandidate` to the new Set.
3. **H2** Re-export `candidate-rows` from `@/lib/data` barrel; convert deep imports.
4. **L1** Document `ROSTER_THRESHOLD`.

Why first: pure refactor, mechanical, no behavior change, and H5 depends on H1.

### Phase 2 — Type & boundary tightening (small, focused)

5. **H3** Replace casts in `parseFilters` with validate-then-cast helpers.
6. **H6** Extract `persistTheme` in `theme-provider.tsx`.
7. **M3** Drop the `_sortKey` cast in `aggregates.ts`; sort indices first.
8. **M2** Standardize null contracts in `aggregates.ts` and update consumers.

Why second: each change is local, with clear correctness criteria; M2 is the only one that touches multiple files but it's a 4–6 site sweep.

### Phase 3 — Larger surgery + safety net

9. **M4** Add tests for `getPastCandidates` / `getPastWinners` **first** (lock in current behavior).
10. **M1** Lift `ensureYearEntry` to module scope.
11. **H4** Extract candidate-table comparators into `src/lib/candidate-sort.ts`; component looks up by `SortColumn`.

Why last: H4 is the biggest change in the plan; doing M4 first guarantees aggregates math is locked before any later refactor touches it. M1 piggybacks on the same file.

### Out of scope

- `theme-provider.tsx` (230 lines) full rewrite — not painful enough today.
- `kerala-map.tsx` / `constituency-map.tsx` — recently rewritten, no signal of decay.
- shadcn/ui components — generated, leave alone.
