# Roadmap

Two major feature directions planned. Both build on the existing drilldown (district → alliance → party → constituency) without rebuilding it.

## Feature 1 — Insights chips (analytical query shortcuts)

**Problem.** The candidate table is already a powerful query surface. To answer "where did INC lose ground vs 2021?" today, the user has to know to: pick the INC pill, click the `Δ share '21` column header, ensure direction is ascending. That's 3 informed actions, and it assumes the user knows the data supports the question at all.

**Proposal.** A slim chip strip above the candidate table. Each chip is a *launcher* — clicking it applies a saved combination of `(filter + sort + direction + result toggle)`. Curated, hand-picked, ~6–10 chips. Same data the table already exposes.

**Scope.** Single horizontal row of chips. Above the candidate table, not in the breadcrumb (different conceptual category — the breadcrumb shows *active scope*, chips are *one-shot launchers*).

### Initial chip list

| Chip | Filter | Sort | Direction | Result |
|---|---|---|---|---|
| Closest wins | — | margin | asc | Winners |
| Closest losses | — | margin | desc (least negative) | Losers |
| Biggest gains: INC | party=INC | Δ share '21 | desc | All |
| Biggest gains: CPI(M) | party=CPI(M) | Δ share '21 | desc | All |
| Biggest gains: BJP | party=BJP | Δ share '21 | desc | All |
| Biggest gains: IUML | party=IUML | Δ share '21 | desc | All |
| Biggest declines: INC / CPI(M) / BJP / IUML | per-party | Δ share '21 | asc | All |
| Constituency flips | (computed: prev winner alliance ≠ current) | margin | desc | Winners |

### Design rules

- **Chips are launchers, not state.** No "active" indicator. Clicking applies state; user can refine afterwards. The breadcrumb already conveys active state.
- **Result-shaped labels.** `Closest INC wins`, not `Sort by margin asc within INC`.
- **Chips compose with scope.** `Closest wins` + `Wayanad` (already filtered) → closest wins in Wayanad. No special handling needed.
- **Each chip declares its own preferred result toggle.** `Closest wins` → `Winners`. `Closest losses` → `Losers`. `Biggest gains: INC` → `All` (so wins and losses both surface).
- **Curation > generation.** 8 hand-picked chips beat 30 auto-generated. Promote new chips when usage warrants.
- **Definition tooltip.** Single ⓘ next to the chip strip header opens a popover explaining what each chip does, rather than per-chip tooltips. Less clutter.

### What needs new data / helpers

- "Constituency flips" needs a small helper comparing 2026 winner alliance to 2021 winner alliance. Both are derivable from existing data — no new sources.

### Mobile / responsive

- Chips wrap or horizontally scroll with snap. Minor work.

### Effort

Small. Half a day. No new data sources, no new components beyond a chip-strip wrapper.

---

## Feature 2 — Constituency-level map

**Problem.** Spatial questions ("which regions swung?", "are religious-majority districts moving together?", "is the swing geographic or scattered?") are hard to answer from the table alone. The district map answers them at a coarse 14-region level; constituency-level (140 polygons) is the right granularity.

**Proposal.** A new section after the candidate table — `ConstituencyMap` — using `assembly-constituencies/India_AC.shp` from datameet. 140 SVG paths, same pipeline as the district map (extract → simplify → pre-project → render). Overlay toggle in the section header.

### Overlays

Default to `Winner alliance` for first-load familiarity. The other overlays are where the spatial story lives.

| Overlay | Encoding | Answers |
|---|---|---|
| Winner alliance | Solid alliance fill | What's the political map? |
| Margin | Alliance fill, opacity scaled to margin | Where are the safe seats vs battlegrounds? |
| Swing share vs 2021 | Diverging scale (UDF blue ↔ LDF red ↔ NDA orange, white near 0) | Where did the wind blow? |
| Swing margin vs 2021 | Same as above with margin Δ | Where did races tighten or widen? |
| Flips since 2021 | Binary: flipped (saturated) vs held (muted) | Where did the alliance actually change hands? |

### Out of scope (for now)

- **Demographics overlay.** Census data is district-level; projecting onto 6–15 ACs in the same district shows identical religion bars per AC and adds no information. Don't ship it unless real constituency-level census data becomes available.

### Interaction

- Hover any AC → tooltip with constituency name + 2026 winner + share + margin. Match the compact format used elsewhere.
- Click AC → set `selectedSeat`, smooth-scroll to existing `ConstituencySection`.
- Selected AC gets thicker stroke, same as the existing constituency-row selection in the candidate table.

### Layout decisions

- **Coexists with district map** at the top. Different scale, different role.
- **Mounted after `CandidateTable`** (and before `ConstituencySection` since the AC map sits above the per-constituency drilldown).
- Not sticky. The district map already serves the persistent-orientation role.

### What needs new data / pipeline

- Run `extract-kerala-map.py` against `assembly-constituencies/India_AC.shp` (currently it only reads the district shapefile). Output: `data/kerala-constituencies.geojson`.
- Handle the **AC #87 Kothamangalam dedupe**: the shapefile has two records (Ernakulam DT_CODE=8 vs Idukki PC mislabel DT_CODE=9). Pick the Ernakulam record per our authoritative `data/districts.json` mapping.
- Run `build-kerala-map-paths.ts` against the new GeoJSON. Output: `data/kerala-constituencies-paths.json`.
- Same `geoMercator().fitSize` projection. Likely target dimensions ~600 × 900 (taller than district map to fit 140 finer-grained polygons).
- Datameet "shift in data" caveat — visual quality needs eyeballing before committing.

### Effort

Medium. ~1–2 days for the shell + one overlay; further overlays add hours each.

### Mobile

- Hover doesn't exist on touch — fall back to tap-to-show-tooltip.
- AC tap targets are small (e.g. Kollam ACs). Defer the touch-friendly version to a focused mobile pass.

---

## Build order

**1. Insights chips first.**
- Lower effort, immediate user-visible win
- All data already in place
- Usage will reveal which dimensions matter most, informing which AC map overlays to prioritize

**2. Constituency-level map second.**
- Bigger investment
- Benefits from feedback on chip usage to prioritize overlays
- Needs new data pipeline work but it's the same shape as the district map

---

## Open design questions to resolve at build time

### Chips

- Should the chip strip have a header label ("Insights" or similar)? Probably yes; helps distinguish it from the result toggle that lives above the table.
- When chip is clicked while a constituency is already selected (so `ConstituencySection` is open), should we deselect the constituency? Yes — chips are exploration mode; per-constituency drilldown is closure mode. Each chip clear can reset `selectedSeat`.
- Should chips support a "favourite this view" pattern (URL-share / save)? Out of scope for v1; revisit if useful.

### AC map

- Default overlay: **winner alliance** (familiar) or **swing vs 2021** (more interesting)? Lean familiar for v1; the user picks "swing" intentionally to see the story.
- Should district map and AC map compete or coexist? Coexist; different roles. Don't make district map go away.
- Cluster point for legend / overlay-toggle controls — top-right of section? Inline with section header? Decide at build time based on space.

### Both

- A "reset all" affordance somewhere? The breadcrumb already supports per-segment clearing; a global reset is rarely needed if breadcrumb is comprehensive. Skip unless real friction emerges.

---

# Code maintainability — pre-feature inventory

Before building Insights chips and the AC map, several refactors will pay back fast. The codebase is small (~3.5k lines across `src/`), patterns are consistent, but a few high-leverage cleanups will simplify both new features.

## Audit findings

### Repeated structural patterns

Every analytical section (`AllianceSection`, `PartySection`, `ConstituencySection`) opens with:

```jsx
<section className="border-t">
  <div className="mx-auto max-w-6xl px-6 py-6">
    <h2 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
      {title}
      <span className="ml-1.5 font-normal text-muted-foreground/70 normal-case">
        · {hint}
      </span>
    </h2>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3">{tablePane}</div>
      <div className="lg:col-span-2">{chartPane}</div>
    </div>
  </div>
</section>
```

That shape appears 3 times today. The AC map will be the 4th. Extract `<Section title hint>` and (optionally) `<SectionGrid leftPane rightPane>` shells. Saves ~10 lines per section, makes the convention explicit, and makes it impossible to drift on padding/spacing.

### Duplicated tiny components

- **`Stat` helper** (label over value, tabular-nums) is inlined as a local function in `constituency-section.tsx` and was inlined in earlier `alliance-section`/`party-section` versions. Move to `components/stat.tsx`.
- **`CompositionRow`** (the 3-segment bar with optional label) lives only in `kerala-map.tsx` today, but the AC map and any other "alliance composition strip" usages will want the same component. Move to `components/composition-row.tsx` when the second use-site shows up; until then, leave inline.

### Active toggle-pill styling

The colored "active state" for `ToggleGroupItem` (`backgroundColor`, `borderColor`, `color: "#fff"` from the alliance/party color) is repeated in `party-section.tsx`, `constituency-section.tsx`, and was in the old constituency drawer. Extract a tiny helper:

```ts
function activePillStyle(color: string): CSSProperties {
  return { backgroundColor: color, borderColor: color, color: "#fff" }
}
```

Or — better — wrap a `<ColoredPill value color>` component and have the toggle-group children use that. Removes an `if (active)` branch from every call site.

### Color manipulation

Hex-suffix tinting (`color + "1A"`, `color + "12"`, `color + "26"`, `color + "55"`) appears in 6+ places. The suffixes encode meaning ("1A" = 10% alpha, "26" = 15%, "55" = 33%). Extract to `lib/color.ts`:

```ts
export const tint = {
  bg: (hex: string) => hex + "1A",      // backdrop fill
  bgSoft: (hex: string) => hex + "12",  // softer fill (loser bars)
  bgStrong: (hex: string) => hex + "26",// winner bars
  border: (hex: string) => hex + "55",  // borders
}
```

Self-documenting + makes any future change (move to oklch with proper alpha, swap palette, etc.) a one-line edit.

### `data.ts` is a god module (954 lines)

Currently holds:
- Raw JSON imports + alias maps
- ~10 type definitions
- ~25 exported functions across 5 different concerns
- The historical glob loader

Split into a `src/lib/data/` directory with focused files:

| File | Responsibility |
|---|---|
| `data/loaders.ts` | Raw JSON imports, `historicalModules` glob, internal `alliancesMeta` |
| `data/format.ts` | `formatNumber`, `formatPercent`, `normalizeCandidateName`, `displayConstituencyName` |
| `data/parties.ts` | `partyShort`, `canonicalPartyName`, party aliases |
| `data/alliances.ts` | `getAlliance`, `isMainFront`, `allianceForCandidate`, `getStateSummary`, `getAllianceBreakdown`, `getAllianceTrendData` |
| `data/parties-trend.ts` | `getPartyTrendData` |
| `data/historical.ts` | `getHistoricalFor`, `getTrendData`, `getPastCandidates`, `get2021Baseline` |
| `data/constituencies.ts` | `constituencies` const, `winnerOf`, `totalVotesIn`, `constituenciesIn` |
| `data/districts.ts` | `districts`, `getDistrict`, `districtForConstituency` |
| `data/demographics.ts` | `getDemographicsFor`, `religions`, `getReligion` |
| `data/types.ts` | All exported types |
| `data/index.ts` | Re-exports for backwards compatibility |

The re-exports mean the rest of the codebase keeps importing from `@/lib/data` exactly as today. Pure organization, no breaking change. This is **not blocking** for new features — just makes navigation easier when the file grows past 1,000 lines.

### Filter state lives in App as 4 separate `useState`s

```tsx
const [scope, setScope] = useState<string | null>(null)
const [selectedSeat, setSelectedSeat] = useState<number | null>(null)
const [selectedAlliance, setSelectedAlliance] = useState<AllianceCode | null>(null)
const [selectedParty, setSelectedParty] = useState<string | null>(null)
```

Plus inside `CandidateTable`:

```tsx
const [result, setResult] = useState<ResultFilter>("winners")
const [sortColumn, setSortColumn] = useState<SortColumn>("votes")
const [sortDir, setSortDir] = useState<SortDir>("desc")
```

Insights chips will need to mutate **multiple of these at once** (set party + result + sort + direction in one click). Today that requires lifting 3 more useStates from `CandidateTable` to `App` (or threading callbacks).

Suggested refactor: a single `Filters` object with a reducer:

```ts
type Filters = {
  scope: string | null
  alliance: AllianceCode | null
  party: string | null
  seat: number | null
  result: "winners" | "losers" | "all"
  sort: { column: SortColumn; dir: SortDir }
}

type Action =
  | { type: "set-scope"; scope: string | null }
  | { type: "set-alliance"; alliance: AllianceCode | null }
  | { type: "set-party"; party: string | null }
  | { type: "set-seat"; seat: number | null }
  | { type: "set-sort"; column: SortColumn; dir?: SortDir }
  | { type: "apply-chip"; chip: ChipDef }
  | { type: "clear"; level: "scope" | "alliance" | "party" | "seat" }

function filtersReducer(state: Filters, action: Action): Filters { ... }
```

Pulled into `lib/filters.ts` or `state/filters.ts`. Single source of truth, chips become a one-line dispatch:

```tsx
dispatch({ type: "apply-chip", chip: BIGGEST_GAINS_INC })
```

**This refactor unblocks Insights chips.** Recommend doing it first. Effort: ~half a day.

### Three historical chart components

`historical-chart.tsx`, `alliance-historical-chart.tsx`, `party-historical-chart.tsx` are 137–176 lines each, all built around recharts `LineChart`. They share:
- `ChartContainer` setup with `chartConfig`
- `XAxis` configured for years
- `YAxis` configured for percentages or counts
- `ChartTooltip` with custom formatter
- `Line` per series with stroke / opacity / dot logic

But they differ enough (multi-line w/ by-election dots vs single-line vs alliance-fronts-only) that unifying them risks an over-configurable Frankenstein. **Don't unify.** Extract instead a small `chart-utils.ts` for the shared bits (year axis tick formatter, tooltip indicator config) but keep the three components as siblings.

### Map component pattern will duplicate

`KeralaMap` will look ~80% identical to the future `ConstituencyMap`:
- Same SVG `viewBox` rendering
- Same `<path>` per feature with hover/click
- Same focus / keyboard handling
- Different fill function, different tooltip content, different selection model

Extract `<ChoroplethMap features fillFor={...} renderTooltip={...} onSelect={...}>` shell when the AC map lands. Don't pre-build it before there's a second use site — high risk of mis-abstracting.

### Builder for candidate rows

`buildRows()` inside `candidate-table.tsx` constructs a `CandidateRow[]` from constituencies. Insights chips might want similar derived rows for non-table presentations (chip-driven highlights on the AC map, mini-list previews). Move `buildRows` and the `CandidateRow` type into `lib/data/candidate-rows.ts` so it's reusable.

### Naming inconsistency

- `selectedAlliance` / `selectedParty` / `selectedSeat` — all `selected*` prefix
- `scope` — different naming convention for the same idea (the active district)

Rename `scope` → `selectedDistrict` for consistency. App-wide find/replace, low risk. (Or alternatively: rename `selectedSeat` → `selectedConstituency` and `selectedParty` → `selectedPartyName`. Pick one convention and align.)

### Typing

- `partyName: string` is used everywhere a canonical party name is expected. No type-level guarantee. Could use a `PartyName` branded type, but probably overkill for app code.
- `selectedSeat: number | null` represents a `constituencyNumber`. Naming would be clearer as `selectedConstituencyNumber`.
- `AllianceCode` is well-typed already.

### No tests

For the data transformations specifically (`canonicalPartyName`, `get2021Baseline`, `getAllianceTrendData`, `getPartyTrendData`), a thin layer of tests would protect refactors and prevent regressions. The data audit cleanup we just did would have benefited from these.

Recommend adding `bun:test` (zero-config in Bun) with ~10–15 test cases covering: alias resolution, baseline computation for known constituencies (Aluva 2021), trend aggregation, and one round-trip through `buildRows`. ~half a day of work; pays back the first time anything in `data.ts` changes shape.

### URL state / deep linking

None today. Bookmarking, sharing, and back-button support are all broken — every refresh resets to defaults. Adding `URLSearchParams` sync to the new `Filters` reducer is a 1-hour task once the reducer exists.

For Insights chips specifically, deep linking is the difference between "I can share this view" and "you have to click these things in order to see it". Worth adding when the reducer lands.

### Architecture doc missing

`docs/links.md`, `docs/data-issues.md`, `docs/scraping-requirements.md` cover *where data comes from*. Nothing covers *how the components compose*, what conventions a new section should follow, or where to put new code.

Add `docs/architecture.md` (short — 1–2 pages) covering:
- Page layout (sticky breadcrumb, sections, drilldown order)
- Section template (the `<Section>` shell, when to use the 2-col grid, where the click-hint goes)
- State conventions (the `Filters` reducer, when components manage local state)
- Color / palette / spacing conventions
- Data module organization (after the split)
- How to add a new section / overlay / chip

## Recommended order

| # | Refactor | Effort | Unblocks |
|---|---|---|---|
| 1 | ✅ Extract `<Section>` and `<SectionHeader>` shells | 30 min | Cleaner section additions |
| 2 | ✅ Extract `<Stat>` to its own component | 15 min | — |
| 3 | ✅ Extract `lib/color.ts` palette helpers | 30 min | Cleaner map overlays |
| 4 | ⏭ Skipped — only 1 use site remains after refactor 1; not worth abstracting | — | — |
| 5 | ✅ Move `buildRows` + `CandidateRow` to `lib/data/candidate-rows.ts` | 30 min | Insights chips |
| 6 | ✅ Consolidate filter state into `Filters` + reducer | 4 hours | **Insights chips** (multi-mutation) |
| 7 | Add URL-state sync to the reducer | 1 hour | Sharable views |
| 8 | Split `data.ts` into `data/` module | 2 hours | DX |
| 9 | Add `docs/architecture.md` | 1 hour | Onboarding |
| 10 | Add data-transformation tests | 4 hours | Refactor safety |
| — | (Skip) Unify 3 historical charts | — | (would over-abstract) |
| — | (Defer) `<ChoroplethMap>` shell | — | Wait for AC map; do it once both maps exist |
| — | (Defer) Brand-typed `PartyName` | — | Probably never needed |

Steps 1–6 should happen **before Feature 1**. Step 7 should happen **with Feature 1**. Step 8 can happen anytime (low risk, all re-exports). Steps 9–10 are nice-to-have at any point.

## What we are not changing

- Component file structure (one component per file) — works well
- Tailwind / CSS variable approach — works well
- Recharts choice for line charts — works well
- ESLint / TS / Prettier setup — already strict and clean
- shadcn UI primitives — keep using as-is
- `bun` as runtime — keep
- The cascading drilldown UX — settled and working

The refactors above are surgical: extract repeated patterns, group state, split the largest file. None changes user-visible behavior. Do them in small commits before Feature 1, and Feature 1 falls out of them naturally.
