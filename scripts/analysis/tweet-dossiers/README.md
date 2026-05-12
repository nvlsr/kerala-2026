# `tweet-dossiers/` — pipeline

Builds the tweet-response dossier database in `twitter-responses/data/`. One markdown dossier per entity (Phase 1 = 140 ACs), plus flat tabular lookups for cross-AC queries.

This is a parallel, analytical-only data layer. **Site code does not consume from `twitter-responses/data/`.** The pipeline reads from the site's `data/*.json` + `src/lib/` (loaders, curated questions, sort logic) and writes a denormalized, narrative-friendly view designed for drafting Twitter replies.

## Run

```bash
# Full regeneration (currently Phase 1 only — AC dossiers + lookups)
bun run scripts/analysis/tweet-dossiers/build-all.ts

# Just the 140 AC dossiers
bun run scripts/analysis/tweet-dossiers/build-ac-dossiers.ts

# Single AC for spot-checking
bun run scripts/analysis/tweet-dossiers/build-ac-dossiers.ts --ac 135

# Flat aggregate table only
bun run scripts/analysis/tweet-dossiers/build-lookups.ts
```

All scripts are **idempotent** — same input data → same output. Output overwrites previous files.

## Layout

```
scripts/analysis/tweet-dossiers/
├── README.md                          ← this file
├── build-all.ts                       ← orchestrator (runs every phase that exists)
├── build-ac-dossiers.ts               ← Phase 1: 140 AC dossiers
├── build-lookups.ts                   ← Phase 1: flat aggregate TSV + party-alliance JSON
└── lib/
    └── replay-questions.ts            ← shared: replays /questions cards' filter+sort+top-5
```

## Phase plan

| Phase | Entities | Status |
| --- | --- | --- |
| **1** | 140 AC dossiers + 3 alliance stubs + flat ac-table.tsv | ✅ AC dossiers + TSV done; alliance stubs not yet |
| 2 | ~10 community dossiers (Nair, Ezhava, SC, CSI, Latin Catholic, Syro-Malabar, Malabar-bloc Muslim, Cosmopolitan Muslim, …) | not started |
| 3 | ~10 key party dossiers (BJP, INC, CPI(M), IUML, KEC factions, RSP, …) | not started |
| 4 | ~20-30 curated candidate dossiers | not started |
| 5 | 14 district dossiers | not started |

Later phases add a `build-<entity>-dossiers.ts` here + a corresponding entry in `build-all.ts`. The orchestrator runs only the phases that exist — no "not implemented" errors.

## When to rebuild

After any refresh of source data the dossier consumes:

- `data/results-2026.json`
- `data/ac-history.json`
- `data/community-relevance.json`
- `data/ac-summaries.json`
- `data/hereditary-seats.json`
- `data/ldf-ministers-2021.json`
- `data/ac-religious-pois.json`
- `data/ac-religion.json`
- `data/district-religion.json`, `data/district-hindu-castes.json`
- `data/community-belts.json`
- `data/districts.json`, `data/reservations.json`, `data/alliances.json`, `data/ac-names.json`
- `src/lib/curated-questions.ts` (questions list changes)

Output goes to `twitter-responses/data/`, which is gitignored. Re-run on each machine after `git pull`.

## Schema

The output file shapes and section conventions are documented in [`twitter-responses/data/README.md`](../../../twitter-responses/data/README.md). Edit that doc when you change a section template, not this README.

## Replay logic

`lib/replay-questions.ts` imports `curatedQuestions`, `buildCandidateRows`, `sortCandidateRows`, and `getFilteredConstituencyNumbers` from the site code (`src/lib/`). It applies the **exact same filter + sort + top-5 logic** as the live `/questions` cards, then exposes:

- `byAc[ac] = [{ id, rank }, ...]` — for the per-AC "Featured in /questions" section
- `byQuestion[id] = { id, question, rows: TopRow[], ... }` — full top-5 per question, so dossiers can render the surrounding rows for context

If the live question card logic changes, this replay needs to match. The two functions to keep in sync are `applyFilters()` + `pickSignFilter()` in `src/components/question-card.tsx`.
