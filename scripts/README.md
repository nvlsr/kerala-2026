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

## [`analysis/`](analysis/) — consumes data files

Evidence generators cited in [`docs/narratives/`](../docs/narratives/). Each script produces tables / numbers that show up in one of the five narrative reference files (`ldf.md`, `udf.md`, `nda.md`, `christian.md`, `muslim.md`).

| Group | Scripts |
| --- | --- |
| Narrative tests (one per finding) | `narrative-a1-ac-level.ts`, `narrative-a1-no-kcm.py`, `narrative-a2-sabarimala.ts`, `narrative-a3-bjp-three-wins.ts`, `narrative-a6-cabinet-collapse.ts`, `narrative-a8-central-kerala.ts`, `narrative-anti-ldf-flow.py`, `narrative-b3b4-caste.ts`, `narrative-bjp-ac-growth.py`, `narrative-ldf-shallow-distribution.py`, `narrative-regression.py`, `narrative-vote-efficiency.py` |
| Christian deep-dives | `analyze-christian-belt.ts`, `analyze-christian-cohort-detail.ts`, `analyze-christian-mitigations.ts` |
| Muslim + sub-rite cohorts | `analyze-muslim-belt.ts`, `analyze-subrite-cohorts.ts` |

## Helpers

All scripts that consume `data/results-2026.json` / `data/ac-history.json` / `data/alliances.json` import from `_lib/`:

- [`_lib/load.ts`](_lib/load.ts) (bun) and [`_lib/load.py`](_lib/load.py) (python) — `load2026()` / `loadHistorical()` / `loadAlliances()` return the legacy array/Map shape with per-candidate `alliance` / `status` / `margin` / `isNota` rehydrated from the trimmed JSON.
- [`_lib/save.ts`](_lib/save.ts) — `saveJson(path, obj)` writes **compact** JSON (all committed `data/*.json` is stored without pretty-printing — 30-40% smaller per file; see commit 88d0501).

If you add a new analysis script, prefer these over reading the raw JSON directly. They mirror `src/lib/data/constituencies.ts:hydrateConstituency`; if the source schema changes, update the helper in one place.
