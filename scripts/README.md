# Scripts

Two folders, two roles:

## [`pipeline/`](pipeline/) — produces data files

Generates committed JSON in `data/`. App + analysis scripts depend on the output. End-to-end documentation in [`docs/data-pipeline.md`](../docs/data-pipeline.md).

| Group | Scripts |
| --- | --- |
| Election results | `scrape-2021.ts`, `canonicalize-2021-parties.py`, `merge-2021.ts`, `validate-alliances.ts` |
| AC religion demographics | `build-ac-demographics.py`, `project-ac-demographics-2025.py` |
| Religious POIs (OSM) | `fetch-osm-pow.ts`, `inspect-osm-pow.ts`, `diagnose-osm-pow-coverage.ts`, `classify-osm-pow.ts`, `aggregate-ac-religion-pois.ts`, `validate-classified-pow.ts` |
| Maps | `extract-kerala-map.py`, `build-kerala-map-paths.ts` |
| Community-relevance framework | `build-community-relevance.ts` — produces `data/community-relevance.json` (per-AC driver, durability, alliance-roles matrix, NDA trajectory). Documented in [`docs/community-relevance.md`](../docs/community-relevance.md). |

## [`analysis/`](analysis/) — consumes data files

Evidence generators cited in [`docs/narratives/`](../docs/narratives/). Each script produces tables / numbers that show up in one of the four narrative reference files (`ldf.md`, `udf.md`, `nda.md`, `christian.md`), or a derived analytical artifact.

| Group | Scripts |
| --- | --- |
| Narrative tests (one per finding) | `narrative-a1-ac-level.ts`, `narrative-a1-no-kcm.py`, `narrative-a2-sabarimala.ts`, `narrative-a3-bjp-three-wins.ts`, `narrative-a6-cabinet-collapse.ts`, `narrative-a8-central-kerala.ts`, `narrative-anti-ldf-flow.py`, `narrative-b3b4-caste.ts`, `narrative-bjp-ac-growth.py`, `narrative-ldf-shallow-distribution.py`, `narrative-regression.py`, `narrative-vote-efficiency.py` |
| Christian deep-dives | `analyze-christian-belt.ts`, `analyze-christian-cohort-detail.ts`, `analyze-christian-mitigations.ts` |
| Muslim + sub-rite cohorts | `analyze-muslim-belt.ts`, `analyze-subrite-cohorts.ts` |
| Candidate-name continuity | `audit-candidate-names.ts` — produces `data/candidate-continuity.json` + `docs/candidate-continuity-audit.md`. Consumes manual verdicts from `data/candidate-classifications.json`. |
| Hereditary seats | `build-hereditary-seats.ts` — produces `data/hereditary-seats.json` from union-find over same-person verdicts in the candidate-continuity audit. Six confirmed family-succession seats. |
| Community-relevance reporting | `render-community-relevance-tables.ts` — pretty-prints the framework output for review. |
| AC summary prep | `build-ac-summary-prep.ts` — joins `data/community-relevance.json` + `data/hereditary-seats.json` + NDA cohort memberships into `data/temp/ac-summary-prep.json` (gitignored). Input table for hand-composing or auditing `data/ac-summaries.json`. The summaries themselves are prose; this script is the *audit helper*, not a regenerator. |
| Tweet-response dossiers | [`tweet-dossiers/`](analysis/tweet-dossiers/) — pipeline that builds per-AC markdown dossiers + flat aggregate TSV at `twitter-responses/data/`. Joins every site data source for one consolidated narrative-friendly view per entity. Used by the Twitter-response workflow; gitignored output. Run with `bun run scripts/analysis/tweet-dossiers/build-all.ts`. |

## Helpers

All scripts that consume `data/results-2026.json` / `data/ac-history.json` / `data/alliances.json` import from `_lib/`:

- [`_lib/load.ts`](_lib/load.ts) (bun) and [`_lib/load.py`](_lib/load.py) (python) — `load2026()` / `loadHistorical()` / `loadAlliances()` return the legacy array/Map shape with per-candidate `alliance` / `status` / `margin` / `isNota` rehydrated from the trimmed JSON.
- [`_lib/save.ts`](_lib/save.ts) — `saveJson(path, obj)` writes **compact** JSON (all committed `data/*.json` is stored without pretty-printing — 30-40% smaller per file; see commit 88d0501).

If you add a new analysis script, prefer these over reading the raw JSON directly. They mirror `src/lib/data/constituencies.ts:hydrateConstituency`; if the source schema changes, update the helper in one place.

**Candidate-name normalisation**: any script that compares candidate names across cycles must use [`_lib/names.ts:normalizeName()`](_lib/names.ts) — never compare raw strings. ECI publishes the same person's name inconsistently (case, periods, honorifics, caste suffixes) and a raw equality check fragments the same candidate across multiple keys. Pair with `data/candidate-aliases.json` for spelling variants the normaliser can't fix (e.g. `Kappan` ↔ `Kappen`). The util also exports `extractCasteSuffix()` and `nameSimilarity()`; the canonical reference implementation is [`audit-candidate-names.ts`](analysis/audit-candidate-names.ts).
