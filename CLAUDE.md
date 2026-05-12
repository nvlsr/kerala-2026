# Kerala 2026 — Claude reference index

This is the entry point for future Claude sessions. Read the relevant doc(s) below before touching code; don't reconstruct intent from memory.

## Per-page narrative references

One file per walkthrough page. Each is a comprehensive reference (data tables, script pointers, methodology, falsifiers) — not a 1:1 mirror of in-app content. When a walkthrough page changes, update the matching file.

| Page | Reference doc |
| --- | --- |
| `/walkthroughs/ldf-walkthrough` | [`docs/narratives/ldf.md`](docs/narratives/ldf.md) |
| `/walkthroughs/udf-walkthrough` | [`docs/narratives/udf.md`](docs/narratives/udf.md) |
| `/walkthroughs/nda-walkthrough` | [`docs/narratives/nda.md`](docs/narratives/nda.md) |
| `/walkthroughs/christian-walkthrough` | [`docs/narratives/christian.md`](docs/narratives/christian.md) |

Each file follows the same skeleton: TL;DR → sub-findings (with data tables) → methodology → cross-refs to sibling pages → scripts/data pointers.

## Other key docs

- [`docs/architecture.md`](docs/architecture.md) — page layout, section template, state conventions, walkthrough component system, typography tiers, test setup. **Read before adding a new section, overlay, chip, or data field.**
- [`docs/data-pipeline.md`](docs/data-pipeline.md) — the four pipelines that produce `data/` (election results, AC religion demographics, OSM POIs, maps).
- [`docs/data-audit.md`](docs/data-audit.md) — known data caveats and gaps.
- [`docs/caste-data.md`](docs/caste-data.md) — district-level Hindu sub-community shares (Nair/Ezhava/etc.), what's rendered where.
- [`docs/links.md`](docs/links.md) — outbound URL inventory + raw-source catalog.
- [`scripts/README.md`](scripts/README.md) — split between `scripts/pipeline/` (data producers) and `scripts/analysis/` (narrative evidence generators).
- [`MEMORY.md`](MEMORY.md) — does not exist at project root; the project-scoped memory index lives at `~/.claude/projects/-Users-admin-Projects-Vite-kerala-2026/memory/MEMORY.md` and is auto-loaded.

## Code conventions (quick reminders — full text in `architecture.md`)

- Walkthrough pages compose `WalkthroughPageShell` + `ThesisLede` + `WalkthroughSection` + `WhatWouldWeakenSection`. Tokens (colors, typography, table classes) are centralised in `src/components/walkthroughs/`.
- Cohort row tables for NDA/UDF live in sibling `walkthroughs-<arc>-data.ts` files, not in the page component.
- By-religion pages use the OSM-derived sub-rite cohort layer (`subrite-bins.ts` + `religious-pois.ts`).
- All filter state for the dashboard goes through the reducer at `src/lib/filters.ts`.
- Tests: `bun run test` (vitest). `bun test` does **not** work.
- Builds: `bun run build`. Pre-push runs full build + tests.

## Data layer conventions

The on-disk JSON in `data/` is trimmed and shape-optimised; the runtime types are rehydrated by loaders. **Don't read `@data/*.json` directly outside the loader layer** — use the runtime modules instead, or you'll fight rehydration.

**Filename convention**: `ac-*` for per-AC files, `district-*` for per-district, `results-2026.json` for the current cycle, `ac-history.json` for past cycles (single consolidated file, not a directory). See [`docs/data-pipeline.md`](docs/data-pipeline.md) for the source-to-file map.

**JSON storage**: all committed `data/*.json` is compact (no indent) — pretty format costs 30-40% per file. Pipeline scripts that write to `data/` go through `scripts/_lib/save.ts:saveJson()`. To inspect a file, pipe through `jq .` locally.

**Runtime boundary**:
- `src/lib/data/loaders.ts` — the single import site for `@data/*.json`. Rehydrates `eci`/`wikipediaUrl` for AC names, exports raw constituency / alliance / district / reservation metas.
- `src/lib/data/constituencies.ts` — `hydrateConstituency()` rebuilds full `Candidate` shape (alliance/status/margin/isNota) from the trimmed `{name, party, votes}` rows in `results-2026.json`.
- `src/lib/data/historical.ts` — loads `ac-history.json` as plain JSON (no `import.meta.glob`; the 140-file directory was consolidated).
- `src/lib/data/religious-pois.ts` — maps trimmed POI inventory (camelCase short fields, AC#-keyed object) onto the legacy `ACReligiousInventory` type.
- `src/lib/data/maps.ts` — **always import paths via `acPaths` / `districtPaths` from here**, not directly from `@data/ac-paths.json`. The adapter exposes the array shape components expect.

**Scripts** (`scripts/pipeline/` + `scripts/analysis/`): use `scripts/_lib/load.{ts,py}` for `load2026()` / `loadHistorical()` / `loadAlliances()`. These mirror `hydrateConstituency()` so analysis scripts get the same `.alliance` / `.status` / `.margin` / `.isNota` per-candidate fields the runtime sees. Don't re-implement the rehydration in each script.

## When updating narratives

1. If the displayed data on a walkthrough page changes, update the corresponding `docs/narratives/<page>.md` in the same commit.
2. Cross-page findings (e.g. caste, vote-efficiency) are distributed into the relevant pages — `udf.md §5` holds the caste geography reference; vote-efficiency lives under each alliance's reference.
3. Scripts referenced in narratives live under `scripts/analysis/` (one-off evidence generators). Pipeline scripts that build `data/` live under `scripts/pipeline/`. Use `bun run scripts/<dir>/<file>.ts` or `python3 scripts/<dir>/<file>.py`. For python scripts that need pandas/scipy/etc., run via `uv run --with <pkg> --no-project python3 <script>`.
