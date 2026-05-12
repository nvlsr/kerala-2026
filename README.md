# Kerala 2026

An interactive results dashboard for the 2026 Kerala Legislative Assembly election. All 140 constituencies, three alliances (UDF, LDF, NDA), and historical context back to earlier cycles, in a single page that you drill into by clicking the map, alliance table, party row, or seat polygon.

## What's in it

- **District map + alliance/party tables** at `/` — clickable choropleth that scopes every section below; seat tallies, vote shares, and 2021→2026 deltas with sparkline trends.
- **Candidate table** at `/explore` — every contesting candidate with vote share, margin, and Δ-from-2021 columns; full text search; result and sort filters with shareable URLs. Per-AC detail panel includes a demographics card (Composition / Caste / Summary tabs), historical chart, and past-winners table.
- **Walkthroughs** at `/walkthroughs` — guided narratives for each alliance (`/walkthroughs/{ldf,udf,nda}-walkthrough`) and the Christian-belt sub-rite story (`/walkthroughs/christian-walkthrough`). Each backed by a comprehensive reference doc under `docs/narratives/`.
- **Community relevance** at `/community-relevance` — per-AC framework view (driver, durability, alliance-roles matrix, NDA-share trajectory) covering all 140 ACs. Framework doc at `docs/community-relevance.md`.
- **Religion map** at `/religion-map` — religious-composition choropleth with sub-rite cohort overlays from the OSM places-of-worship inventory.
- **Belt overlays** at `/belts` — district-level community-belt patterns.
- **Insights chips** — curated multi-filter combos like "BJP gains 2021→2026" or "Closest contests" that scope the candidate table in one click.
- **Forecast post-mortem** at `/from-forecast` — comparison of the pre-election forecast against actual results.

All filter state is URL-synced, so any view is shareable as a link.

## Stack

- **Vite 7 + React 19 + TypeScript** with the `@/` path alias.
- **Tailwind CSS v4** + **shadcn/ui** (style: `base-nova`, on `@base-ui/react`).
- **Recharts** for line charts; SVG-rendered maps with `d3-geo` paths pre-projected at build time.
- **Bun** as the runtime and package manager.
- **Vitest** for unit tests.

## Getting started

```bash
bun install
bun run dev          # serves at http://localhost:5173 (Vite default)
```

Other scripts:

```bash
bun run typecheck    # tsc --noEmit
bun run lint         # eslint .
bun run test         # vitest run
bun run build        # tsc -b && vite build
bun run format       # prettier --write
```

## Project layout

```
data/                 source JSON (election + historical + map paths)
src/
  App.tsx             page composition + URL state plumbing
  components/         section components + shadcn/ui primitives
  lib/
    data/             data layer: parties, alliances, constituencies,
                      historical, aggregates, candidate-rows
    filters.ts        Filters reducer + URL serialization
    seat-encoding.ts  result/sort-aware AC map encoding
    candidate-sort.ts column comparators for the candidate table
    insights.ts       curated chip definitions
docs/
  architecture.md     read this before adding a section/feature
  maintainability.md  open refactor backlog
```

`docs/architecture.md` is the contract for how new sections, filters, and data fields fit in. Read it before you build anything bigger than a one-line tweak.

## Data

Election results are sourced from the Election Commission of India (`results.eci.gov.in`). Historical cycles, alliance metadata, and constituency geometry are bundled in `data/` as JSON. There is no runtime API call — the entire dataset is shipped with the build.

## Contributing

Bug reports, data corrections, and pull requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow.

For feedback or issues, the GitHub issue tracker is the right place: https://github.com/nvlsr/kerala-2026/issues

## License

MIT — see [LICENSE](./LICENSE).
