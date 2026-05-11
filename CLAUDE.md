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
| `/walkthroughs/muslim-walkthrough` (planning) | [`docs/narratives/muslim.md`](docs/narratives/muslim.md) |

Each file follows the same skeleton: TL;DR → sub-findings (with data tables) → methodology → cross-refs to sibling pages → scripts/data pointers.

## Other key docs

- [`docs/architecture.md`](docs/architecture.md) — page layout, section template, state conventions, walkthrough component system, typography tiers, test setup. **Read before adding a new section, overlay, chip, or data field.**
- [`docs/data-pipeline.md`](docs/data-pipeline.md) — ingest → enrich → bundle flow, where the raw sources live, how Supabase rows become `src/lib/data/*`.
- [`docs/data-audit.md`](docs/data-audit.md) — known data caveats and gaps.
- [`docs/caste-data.md`](docs/caste-data.md) — district-level Hindu sub-community shares (Nair/Ezhava/etc.), what's rendered where.
- [`docs/links.md`](docs/links.md) — outbound URL inventory.
- [`MEMORY.md`](MEMORY.md) — does not exist at project root; the project-scoped memory index lives at `~/.claude/projects/-Users-admin-Projects-Vite-kerala-2026/memory/MEMORY.md` and is auto-loaded.

## Code conventions (quick reminders — full text in `architecture.md`)

- Walkthrough pages compose `WalkthroughPageShell` + `ThesisLede` + `WalkthroughSection` + `WhatWouldWeakenSection`. Tokens (colors, typography, table classes) are centralised in `src/components/walkthroughs/`.
- Cohort row tables for NDA/UDF live in sibling `walkthroughs-<arc>-data.ts` files, not in the page component.
- By-religion pages use the OSM-derived sub-rite cohort layer (`subrite-bins.ts` + `religious-pois.ts`).
- All filter state for the dashboard goes through the reducer at `src/lib/filters.ts`.
- Tests: `bun run test` (vitest). `bun test` does **not** work.
- Builds: `bun run build`. Pre-push runs full build + tests.

## When updating narratives

1. If the displayed data on a walkthrough page changes, update the corresponding `docs/narratives/<page>.md` in the same commit.
2. Cross-page findings (e.g. caste, vote-efficiency) are distributed into the relevant pages — `udf.md §5` holds the caste geography reference; vote-efficiency lives under each alliance's reference.
3. Scripts referenced in narratives live under `scripts/` (named `narrative-*` or `analysis-*`). Use `bun run scripts/<file>.ts`.
