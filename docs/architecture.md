# Architecture

A short tour of how the app is organized. Read this before adding a new section, overlay, chip, or data field — most of the code conventions are deliberately consistent so changes go in predictably.

## Page layout

Top to bottom:

```
ScopeTitle              header (h1) + sticky breadcrumb
KeralaMap               district map + All-Kerala overview panel
AllianceSection         alliance table + 3-line chart
PartySection            (only when an alliance is selected) parties + chart
CandidateTable          insights chips + filtered candidate table
ConstituencyMap         140-AC choropleth with overlay toggle
ConstituencySection     (only when a seat is selected) per-seat detail
footer
```

The breadcrumb in `ScopeTitle` is `position: sticky` and reflects all active filters. Each level appends a clearable chip (district → alliance → party → seat).

## Section template

Every analytical section uses `<Section>` (`src/components/section.tsx`), which provides:

- `<section className="border-t">` wrapper
- `<div className="mx-auto max-w-6xl px-6 py-6">` container
- `<h2>` with title + optional muted subtitle (the `· click a row to drill in` style hint)
- Optional `actions` slot (right-aligned, used by `CandidateTable` for search + result toggle, and by `ConstituencyMap` for the overlay toggle)

When you add a new section, use `<Section>` rather than rebuilding the wrapper. Match existing subtitle conventions:

- "Alliances · click a row to drill in"
- "Map · click a district to filter"
- "Constituency · {name} · {district} district"

For inner table-vs-chart layouts, keep the standard `grid grid-cols-1 lg:grid-cols-5` with `lg:col-span-3` (table) and `lg:col-span-2` (chart).

## State conventions

All filter state lives in a single reducer at `src/lib/filters.ts`:

```ts
type Filters = {
  district: string | null
  alliance: AllianceCode | null
  party: string | null
  seat: number | null
  result: "winners" | "losers" | "all"
  sort: { column: SortColumn; dir: SortDir }
}
```

`App.tsx` owns the reducer (`useReducer(filtersReducer, ...)`) and passes either the full state down, or specific props plus a typed `dispatch` callback. The candidate table is fully controlled — its sort and result toggle live in the same reducer.

When a filter changes, an effect in `App` calls `serializeFilters(filters)` and `history.replaceState` to keep the URL in sync. On mount, `parseFilters(URLSearchParams)` seeds the reducer from the URL.

When you add a new filter dimension:

1. Add the field to `Filters`
2. Add a `set-*` and `clear-*` action to `FilterAction`
3. Add a case to `filtersReducer`
4. Update `serializeFilters` + `parseFilters` so the URL reflects the new dimension
5. (Optional) Update Insights chip presets to use the new field

When components only need to dispatch (not read filter state), they take a typed `dispatch: Dispatch<FilterAction>` prop. Insights chips do this — each click is one `apply-preset` action that overwrites multiple slots at once.

## Data module

`src/lib/data/` is the data layer. Most code imports from `@/lib/data` (the index barrel); the underlying split is:

| File | Responsibility |
|---|---|
| `loaders.ts` | All raw JSON imports + parsed metadata (alliancesMeta, demoMeta, districtsMeta, etc.). Single source of truth for static data. |
| `format.ts` | `formatNumber`, `formatPercent`, `displayConstituencyName`, `normalizeCandidateName` |
| `parties.ts` | `partyShort`, `canonicalPartyName` (alias resolution) |
| `alliances.ts` | `getAlliance`, `isMainFront`, `allianceForCandidate`, `allianceForRawParty`. Defines `AllianceCode` and `Alliance` types. |
| `constituencies.ts` | The 2026 `constituencies` const, `winnerOf`, `totalVotesIn`, `constituenciesIn`. Defines `Candidate` and `Constituency` types. |
| `districts.ts` | `districts` const, `getDistrict`, `districtForConstituency`. Defines `District` type. |
| `demographics.ts` | `religions`, `getReligion`, `getDemographicsFor`, `demographicsYear`. Defines `ReligionCode`, `Religion`, `Demographics`. |
| `historical.ts` | Vite glob loader for `data/historical/S11-*.json` + `getHistoricalFor`. Defines `HistoricalCandidate`, `HistoricalElection`, `HistoricalConstituency`. |
| `aggregates.ts` | Cross-cutting aggregations: `getStateSummary`, `getAllianceBreakdown`, `getAllianceTrendData`, `getPartyTrendData`, `getTrendData`, `getPastCandidates`, `getPastWinners`, `get2021Baseline` |
| `candidate-rows.ts` | `buildCandidateRows(scope)` and `CandidateRow` — the flat list used by the candidate table and (eventually) Insights/AC-map row derivations |
| `index.ts` | Barrel re-exports. Add new exports here when new symbols are introduced. |

When adding new data:

- Pure JSON → put in `data/*.json` and import from `loaders.ts`
- New cross-cutting aggregation → `aggregates.ts`
- New per-candidate field → extend `CandidateRow` and `buildCandidateRows`
- A new typed entity → its own file under `src/lib/data/`, with the type and helpers colocated

Don't add code to a sub-module that imports from the index barrel; that creates a cycle. Inside `lib/data/`, always import sibling files directly (`@/lib/data/parties`, not `@/lib/data`).

## Color and palette conventions

Alliance colors come from `data/alliances.json` and are looked up via `getAlliance(code).color`. Don't hardcode hex.

For tinted variants (backgrounds, borders), use `tint.bg / tint.bgSoft / tint.bgStrong / tint.border` from `src/lib/color.ts`. The values map to alpha-suffixed hex (`color + "1A"` etc.), but the helpers name the intent.

For map overlays, opacity is the natural way to encode magnitude. Common pattern:

```ts
const opacity = Math.min(0.95, 0.2 + (value / max) * 0.75)
```

## Components

- `Section` / `Stat` / `DeltaPercent` / `AlliancePill` / `PartyLink` / `InfoIcon` — small reusables in `src/components/`. Use them rather than reinventing.
- `KeralaMap` and `ConstituencyMap` — both render SVG paths from pre-projected JSON files in `data/`. Same pattern: hover/click states, ARIA roles, side panel with details. If a third map appears, extract a `<ChoroplethMap>` shell.
- `HistoricalChart` / `AllianceHistoricalChart` / `PartyHistoricalChart` — three line charts over recharts. They look similar but each handles a different data shape (multi-line w/ by-election dots, multi-line w/ highlight, single-line). Don't try to unify; the abstraction would over-fit.
- `InsightsChips` — chip strip above the candidate table. Each chip has a preset that's `dispatch`'d as `apply-preset`.

## Adding a new section

1. New file in `src/components/<name>-section.tsx`
2. Use `<Section title=... subtitle=...>` shell
3. If it contains a chart + table, use the `lg:grid-cols-5` split
4. If it needs filter state, take `filters` and `dispatch` props (don't lift a duplicate state)
5. Mount in `App.tsx` at the right hierarchy point
6. If the section reads or sets `seat`/`alliance`/`party`/`district`, the breadcrumb already handles those; no new chip wiring needed

## Adding a new Insights chip

1. Add an entry to `insightChips` in `src/lib/insights.ts`
2. Each chip is `{ id, label, description, preset: Partial<Filters> }`
3. The preset overwrites only the fields it specifies; other state is preserved (so chips compose with active scope)
4. `InsightsChips` automatically picks up new entries

## Adding a new map overlay

1. Extend the `Overlay` type in `src/components/constituency-map.tsx`
2. Add a `ToggleGroupItem`
3. Add a branch to `computeFills(overlay)` returning `{ color, opacity }` per constituency
4. Add a one-line description to `OverlayLegend`
5. (Optional) Surface relevant stats in `SeatPanel` when this overlay is active

## Adding a new data field

If it's per-candidate-per-constituency:

1. Compute it in `buildCandidateRows` and add to `CandidateRow`
2. If the candidate table needs to sort by it: add to `SortColumn`, the `setSort` direction defaults, the URL serializer, and the table's switch statement

If it's a per-constituency aggregate:

1. New helper in `aggregates.ts`
2. Re-export from `index.ts`

## What we are not changing (yet)

- One file per component — works well, don't pre-emptively bundle
- Tailwind / CSS variable approach
- shadcn UI primitives — keep using as-is
- Recharts for line charts
- The cascading drilldown UX
- ESLint / TS strict / Prettier — already strict

## Walkthrough pages

The `/walkthroughs` surface is a separate UX from the dashboard. Three alliance walkthrough pages (LDF, UDF, NDA) plus an index and a methodology page. Each walkthrough page composes a small set of building blocks:

- `WalkthroughSection` — heading + prose + optional visual (`visual-right` / `visual-left` / `stacked` layout).
- `ChoroplethMap` — the standard map; takes a `valueByAC: Map<number, number>`, a colour scale, optional `highlightSeats: Set<number>` for outlining a subset, and optional `viewBox` to crop into a region (e.g. Trivandrum + Kollam for the NDA page).
- `CohortSection` (NDA page only, currently) — domain-specific 2-column variant: heading on top, then map | content side-by-side, with `id` for anchor linking. See `walkthroughs-nda-page.tsx`.
- `Table` (shadcn) — built-in horizontal scroll on overflow; styled compactly via the `COMPACT_HEAD_CLASS` / `COMPACT_CELL_CLASS` shared constants.
- `SeatLink` / `PartyLink` / `ProseLink` — subtle inline anchor links to `/explore?seat=N`, party views, etc.

**Cohort data convention.** Cohort row tables for the NDA page live in `src/pages/walkthroughs-nda-data.ts`, separated from the page component so the page itself stays scannable. Each cohort defines:

- A `*_ROWS` array (typed) — the table data.
- A `*_ACS` set derived from `_ROWS` — used to drive the binary-highlight choropleth map for that cohort.

Per-cohort vote-share aggregates (BJP / NDA Δ) are pre-computed and live in the same data file alongside the row arrays.

### Typography system

Each walkthrough page applies a small named-tier typography system rather than ad-hoc inline classes. The NDA page is the reference implementation; the constants live at the top of `walkthroughs-nda-page.tsx` and can be promoted to a shared `src/components/walkthroughs/typography.ts` when other walkthrough pages adopt them.

Five tiers, applied consistently so the reader's eye learns the hierarchy quickly:

| Tier | Constant | What it's for | Class shape |
|---|---|---|---|
| Section lead | `SECTION_LEAD` | The opening paragraph of a section. Slightly larger, almost-foreground colour. Sets the scene before detail prose starts. Used right after each section's `<h2>`. | `text-base sm:text-[16.5px] leading-relaxed text-foreground/90` |
| Sub-heading | `SUB_HEADING` | `<h3>` inside a section. Bigger than body so the visual jump is clear; `tracking-tight` to match `<h2>`. | `mt-7 font-heading text-lg font-semibold tracking-tight` |
| Definition | `DEFINITION` | One per cohort, stating the formal selection criteria. Italic muted with a left border so it reads as "metadata about this section" rather than body emphasis. | `border-l-2 border-muted-foreground/30 pl-3 italic text-muted-foreground` |
| Preview list | `PREVIEW_LIST` | Compact ordered list shown right after a lead paragraph that says "N patterns / N reasons / N mechanisms". Tells the reader what the next N sub-sections will cover. | `my-3 list-inside list-decimal space-y-0.5 text-[14px] text-muted-foreground` |
| Aside | `ASIDE` | Small muted text for parenthetical notes and footnote-equivalents (e.g. "Caste data is district-level only"). | `text-[12.5px] text-muted-foreground` |

**Body prose default.** `text-sm sm:text-[15px] leading-relaxed`, applied at the section level by `CohortSection`'s content column, so individual `<p>` elements inherit it without an explicit class. Only override when the paragraph belongs to one of the five named tiers above.

**`<h2>` (section heading).** Defined inside `CohortSection`, kept consistent across all sections: `font-heading text-xl sm:text-2xl font-semibold tracking-tight`.

**Why not `@tailwindcss/typography`?** Considered and rejected: the plugin owns layout via `max-w-prose`, re-styles tables, and competes with our custom inline elements (`SeatLink`, `CohortLink`, definition lines, mechanism detail rows). For our hand-built mix of structured prose + data + maps + tables, explicit utility classes per element are a better fit than a flowing-markdown plugin.

### Cohort section template

Every cohort section (`mature-growers`, `low-base-breakouts`, `declining-mature`, `wave-capture`, `strategic-abstention`, `structural-exclusion`) follows the same five-block rhythm so the reader learns the structure once and can scan all six identically:

1. **Definition** (`DEFINITION` tier) — formal selection criteria. One paragraph, italic muted, left-bordered. States the rule that decides which seats are in the cohort.
2. **Why it matters** — body prose, 1-2 sentences. Answers *what looking at this group tells us analytically* — its analytical role, its relationship to other cohorts. Often references sibling cohorts via `CohortLink`.
3. **Table** — the data. Inside `CohortSection`'s content column with horizontal-scroll on overflow. Sorted by the cohort's natural ordering (2026 share descending, gap descending, etc.).
4. **Insight** — body prose, opens with a bolded headline finding (e.g. *"**75% of declining-mature seats** sit in Hindu+Christian terrain."*). 1 paragraph. The "newspaper lede" sentence for this cohort.
5. **Patterns** (optional) — body prose, 1-2 paragraphs. Demographic / geographic / candidate-quality regularities visible in the data. Special cases (e.g. Padmaja at Thrissur) live here.

**Order discipline.** Definition → Why → Table → Insight → Patterns. Even when an "insight = definition" temptation exists (e.g. structural exclusion's "BJP can't break in" is almost the definition itself), force a non-trivial insight that adds something the definition doesn't say (e.g. *"**BJP fell −2.17pp** — the alliance is getting thinner in this terrain, not building."*).

**Implicit signposting.** No eyebrow labels above each block; the order is the structure. Once the reader has been through 1-2 cohorts, the rhythm absorbs without explicit marking.

**Asides.** When a section needs a methodological caveat (e.g. an "n is small" note, a sit-out exclusion, a denominator quirk), it lives as an `ASIDE`-tier paragraph *between* the Definition and Why-it-matters blocks. Keep asides distinct from "why it matters" — one explains *the data we're showing*, the other explains *the analytical role of this group*.

## Tests

`bun run test` (vitest). Three suites under `src/lib/data/`: `data.test.ts`, `flows.test.ts`, `walkthrough-metrics.test.ts`. `bun test` (raw bun runner) does **not** work — bun's matcher is incompatible with vitest's; always go through the npm script.

## See also

- `docs/links.md` — data sources (ECI, Wikipedia, datameet, keralaassembly.org)
- `docs/data-issues.md` — historical-data audit log + the AC #87 Kothamangalam dedupe rationale
- `docs/scraping-requirements.md` — ECI scrape pipeline notes
- `docs/roadmap.md` — completed and pending feature work
