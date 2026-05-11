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

## Caveat

Several `analysis/` scripts and `validate-alliances.ts` still read `data/kerala-2026.json` directly and reference fields that were denormalized in commit ac1d440 (per-candidate `alliance`, `isNota`, `status`, `margin`; top-level `constituency`, `state`, `source`, `checksum`). They won't run as-is — fix by importing from the runtime (`src/lib/data/...`) which rehydrates the full shape, or rehydrate inline using the formula in `src/lib/data/constituencies.ts:hydrateConstituency`. Pipeline scripts that *write* `data/kerala-2026.json` already emit the new trimmed shape.
