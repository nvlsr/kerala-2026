# Data pipelines

Four independent pipelines feed the primary data files this app consumes. Each turns external raw sources into committed JSON in `data/`. A fifth *derived* layer builds analytical artifacts on top of pipeline outputs (no external source). All pipeline code lives under [`scripts/pipeline/`](../scripts/pipeline/); derived builders and analysis scripts that *consume* this data are under [`scripts/analysis/`](../scripts/analysis/).

| Pipeline | External source | Output |
| --- | --- | --- |
| 1. Election results | ECI 2026 + keralaassembly.org (historical) | `data/results-2026.json` + `data/historical/S11-*.json` |
| 2. AC religion demographics | Census 2011 C-01 + SHRUG location keys | `data/ac-religion.json` + `data/ac-religion-2025.json` |
| 3. Religious POIs | OpenStreetMap Overpass API | `data/places-of-worship.json` (gitignored) + `data/ac-religious-pois.json` |
| 4. Maps (one-off) | Datameet shapefiles | `data/kerala-*.geojson` + `data/kerala-*-paths.json` |
| 5. Derived analytical layer | Pipelines 1-3 (no external source) | `data/community-relevance.json`, `data/hereditary-seats.json`, `data/candidate-continuity.json`, `data/ac-summaries.json` |

Source URLs live in [`docs/links.md`](links.md). For each pipeline, that document tells you where the raw data comes from; this document tells you how to turn it into committed JSON.

---

# Pipeline 1 — Election results (ECI + keralaassembly.org)

## Flow

```
ECI 2026 candidate pages              keralaassembly.org per-seat tables
  candidateswise-S11{N}.htm  (140)      assembly_poll.php?year=YYYY&no={N}
        │                                       │
   browser scrape                          scrape-2021.ts (Bun fetch)
        │                                       │
        ▼                                       ▼
   data/raw/constituencies/             data/raw/scraped-2021/seat-{N}.json
       S11-{N}.json (140)                       │
                                       canonicalize-2021-parties.py
        │                                       │
        │ (aggregation: manual — no committed script)
        │                                       ▼
        ▼                            merge-2021.ts merges into historical/
   data/results-2026.json
                                                ▼
                                      data/historical/S11-{N}.json
                                      (years: 2011, 2016, 2019, 2021)
```

## 2026 results

ECI's per-constituency HTML pages are scraped via the in-page browser (Chrome) because direct `curl`/`fetch` returns HTTP 403. Per-seat JSON intermediates land in `data/raw/constituencies/S11-{N}.json` and are aggregated by hand into `data/results-2026.json` — there is no committed aggregation script at this time. The raw per-seat files use the same shape (the trimmed shape after P1: `constituencyNumber` + `candidates: [{name, party, votes}]`); `results-2026.json` is the concatenated array.

Source URLs: `https://results.eci.gov.in/ResultAcGenMay2026/candidateswise-S11{N}.htm` for N = 1..140. State code `S11` = Kerala. Two raw HTML reference files are committed at `data/raw/eci-html/` (partywise summary + partywise winners).

## Historical (2011 / 2016 / 2019 / 2021)

Three steps:

1. **Scrape** (`scripts/pipeline/scrape-2021.ts`) — per-seat fetch from `http://keralaassembly.org/election/2021/assembly_poll.php?year=2021&no={N}`. Writes one JSON per seat to `data/raw/scraped-2021/`. The keralaassembly.org tables are the authoritative backfill; they match ECI's Form-20 format and resolved several Wikipedia gaps during the audit pass (see `docs/data-issues.md`).
2. **Canonicalize parties** (`scripts/pipeline/canonicalize-2021-parties.py`) — the scrape uses ECI short codes (BJP, T2P, INC, CPIM, ...) which forced every cross-cycle script to handle both forms. This rewrites the raw files in place to use the canonical long-form names that 2026 and pre-2021 historical already use.
3. **Merge** (`scripts/pipeline/merge-2021.ts`) — replaces the 2021 general-election candidates list per seat in `data/historical/S11-{N}.json`. The 2011 / 2016 / 2019 elections were sourced from Wikipedia + keralaassembly.org earlier; they're already in the historical files when merge-2021 runs.

`keralaassembly.org` covers 2021 only. Earlier cycles (2011 / 2016) were ingested from Wikipedia per-constituency articles directly — that ingestion was a one-time manual pass and is not scripted.

## Validation

`scripts/pipeline/validate-alliances.ts` checks: every party in `data/alliances.json` has a registered alliance + abbreviation; every party appearing in `results-2026.json` is registered; per-candidate alliance labels are consistent.

## Re-running

```bash
# 1. Re-scrape 2021 (idempotent — skips files that already exist)
bun run scripts/pipeline/scrape-2021.ts

# 2. Canonicalize party names in the raw scrape (in place)
python3 scripts/pipeline/canonicalize-2021-parties.py

# 3. Merge into historical/
bun run scripts/pipeline/merge-2021.ts

# 4. Validate
bun run scripts/pipeline/validate-alliances.ts
```

For 2026, currently no scripted re-runner — the per-seat ECI scrape is browser-only and the aggregation is manual.

---

# Pipeline 2 — AC religion demographics (Census 2011 + SHRUG)

How `data/ac-religion.json` is produced, what's known to be incomplete, and what we'd improve next.

## Architecture

```
[Census 2011 Table C-01]               [SHRUG]
  Religion shares per:                   Provides:
  - State                                - shrid → AC mapping (con08 keys)
  - District (Total/Rural/Urban)         - shrid → Census village (rural) codes
  - Sub-district (Total/Rural/Urban)     - shrid → Census town (urban) codes
  - Town (Urban only)                    - population per shrid (PCA)
                                         
              ↓ join via                 ↓
              ↓ Census codes             ↓
              
        Per-shrid: pop × religion% → AC weights
                       ↓
                 Aggregate to AC
                       ↓
              ac-religion.json (140 ACs)
```

**Build script:** `scripts/pipeline/build-ac-demographics.py`

**Inputs:**
- `data/raw/census-c01/DDW32C-01-MDDS.XLS` — Kerala C-01 from censusindia.gov.in (committed; ~268KB)
- `data/shrug/shrug-con-keys-csv/shrid_frag_con08_key.csv` (73 MB) — shrid → AC, with fragment weights
- `data/shrug/shrug-pc-keys-csv/pc11r_shrid_key.csv` (33 MB) — rural shrids → village/sub-district codes
- `data/shrug/shrug-pc-keys-csv/pc11u_shrid_key.csv` (0.4 MB) — urban shrids → town codes
- `data/shrug/shrug-pca11-csv/pc11_pca_clean_shrid.csv` (259 MB) — population per shrid

SHRUG data is gitignored (DDL CC-BY-NC-SA license restricts redistribution); re-download just these four files from [devdatalab.org/shrug_download](https://www.devdatalab.org/shrug_download/) — selecting Population (PCA) and Location Keys modules. The full SHRUG download is ~1 GB across many modules; this pipeline only needs ~365 MB. District-name → Census-district-code mapping (previously read from `shrug-shrid-keys-csv/shrid_loc_names.csv`) is now hardcoded in the script as a 14-row table since Kerala's districts are post-1956 stable.

## Coverage

| Category | Count | How religion is computed |
|---|---|---|
| `shrug-c01-aggregated` | 114 ACs | Per-shrid religion (sub-district rural for rural shrids, town for urban shrids) × shrid population × SHRUG con08 fragment weight, aggregated to AC |
| `district-urban-fallback` | 26 ACs | Inherits the AC's district URBAN religion shares from C-01 (these are urban-heavy ACs that SHRUG's spatial join couldn't allocate; using district URBAN is closer than district TOTAL since these ACs are mostly urban) |
| `district-total-fallback` | 0 ACs | Reserved for ACs where even district URBAN fallback isn't available — none in current Kerala data. |

**Bug-fix note (2026-05-07):** A previous version of the parser keyed town religion by town_id only. Three Kerala towns span multiple sub-districts and emit separate per-tehsil "Part" rows in C-01 (Trivandrum Corp, Kochi Corp, Kollam Corp). The parser was writing each Part over the previous and ending up with the smallest weirdest part for AC 133 Vattiyoorkavu (showing H 16.8% / M 46.1% / C 36.9% — implausible). Fix: key town religion by `(tehsil_id, town_id)`. Vattiyoorkavu now shows H 70.2% / M 12.7% / C 16.1% as expected.

**State aggregate sanity check (post-build):** Hindu 53.8% / Muslim 26.8% / Christian 19.1% (matches Census state totals 54.7% / 26.6% / 18.4% within 1pp).

## Why some ACs fall back

SHRUG explicitly documents this limitation. From [their docs](https://docs.devdatalab.org/SHRUG-Construction-Details/location-identifiers/legislative-constituency-identifiers/):

> *"In constituencies that contain or overlap with large cities, constituency population data and population-weighted variables may be distorted. Because the maximum electorate of a constituency is lower than the population of India's largest cities, a small subset of large city shrids span multiple constituencies."*

Affected Kerala ACs: 26 of 140, distributed across 8 districts. Most are city corporation areas (Trivandrum, Kozhikode, Cochin, Alappuzha) where Census town-level data exists but ward-level data isn't published, so SHRUG can't allocate population fragments across multiple ACs.

Missing AC numbers: 8, 23–29, 31, 37, 40, 55, 56, 66, 77, 81–83, 103, 104, 128, 129, 132, 134, 135, 139, 140.

## Improvements roadmap

### ✅ Tier A (current) — district URBAN fallback for missing ACs

Implemented in v2 of build-ac-demographics.py. Replaces the v1 district-TOTAL fallback. Better because the 26 missing ACs are urban-heavy, and district URBAN is closer to their true mix than district TOTAL (which averages rural + urban).

Improvement vs district TOTAL: noticeable for Trivandrum-area ACs (Christian/Muslim shares higher in urban Trivandrum than district average), more modest for districts where urban ≈ total.

### 🟡 Tier B (future) — hand-built town → AC table for major cities

For the largest urban ACs (Trivandrum Corporation's 5 ACs, Kozhikode Corporation's 5 ACs, Cochin Corporation's 4 ACs, Alappuzha Municipality, Palakkad Municipality), the district URBAN fallback over-aggregates. Trivandrum-1 (which contains Latin Catholic coastal pockets) likely has a different mix from Trivandrum-2 (more Hindu interior).

**Effort:** ~1-2 hours. Manual lookup of:
- Which towns each major-city AC contains (from [Kerala CEO LAC-LBS document](https://www.ceo.kerala.gov.in/pdf/05-REPORTS/04-LAC-LBS.pdf))
- Use town-level religion data from C-01 directly (we already parse this)
- Encode as a `data/town-to-ac-overrides.json` lookup the build script consumes BEFORE the district-URBAN fallback

**Affected cities (in priority order by missing population):**
1. Kozhikode Corporation (~710K) — splits across ~5 ACs
2. Trivandrum Corporation (~750K) — splits across 5 ACs (134 Trivandrum, 135 Nemom, 132 Kazhakoottam, 133 Vattiyoorkavu, 138 Kattakkada partially)
3. Cochin Corporation (~600K) — splits across 4 ACs (77 Kalamassery, 81 Thrippunithura, 82 Ernakulam, 83 Thrikkakara)
4. Alappuzha Municipality (~150K) — entire AC 104 Alappuzha
5. Palakkad Municipality (~190K) — entire AC 56 Palakkad
6. Smaller: Cherthala, Manjeri, Quilandy, Taliparamba, Neyyattinkara, Attingal — single-town ACs each

Tier B would get us to ~95% high-quality population coverage. Skip until a specific narrative card needs urban-AC precision.

### ✅ Tier C (current default) — 2025 projection

Implemented in `scripts/pipeline/project-ac-demographics-2025.py`. State-level uniform multipliers from cohort projection (Hindu × 0.9591, Muslim × 1.1166, Christian × 0.9712) applied to all AC shares with per-AC renormalization. Output: `data/ac-religion-2025.json` alongside the raw 2011 baseline at `data/ac-religion.json`.

Multipliers come from the cohort projection in `scripts/cohort-project-2011-to-2025.py`: Census 2011 starting populations + Kerala CRS births by religion 2011-2023 + crude death rate ~7/1000.

**This is the default baseline for both `/religion-map` and narrative-card analysis** (e.g., A1 minority consolidation). The raw 2011 baseline remains available via `--baseline-2011` on analysis scripts and via the year toggle on `/religion-map`.

**Why default to 2025:** Pearson correlation is invariant to monotonic transformations of a single variable, and our renormalization step (rescale to sum=100 per AC) is near-linear because state-level multipliers are uniform. Empirically (verified at the time of building) the choice between 2011 and 2025 moves correlations by at most 0.011 across all 140 ACs — same verdict, same rank order. 2025 is reality-aligned for absolute-share statements ("Vengara is 85% Muslim") and external cross-checks; 2011 is still useful as the tamper-evident base layer.

**Limitations** (baked into the file's `note` field):
- Uniform state-level multiplier; assumes Kerala's geographic gradient hasn't shifted, only absolute shares.
- Doesn't model district-specific fertility differentials (Muslim TFR is higher in already-Muslim-heavy Malappuram than in Trivandrum).
- Absolute shares for any single AC may be off by a few pp; rank order is preserved exactly.

Spot-check (Manjeshwar AC 1): our projection said H 44.2% / M 53.1% / C 2.7%; an independent commentator's 2026 voter prediction was H 42.8% / M 54.5% / C 2.7%. Match within 1.5pp on every religion despite different sources, methods, and population-vs-voters distinction.

### 🔴 Tier D (deferred, ~3-4 weeks effort) — district-specific drift via NFHS-5 microdata

NFHS-5 District Fact Sheets don't publish religion shares (health-only template). NFHS microdata via the DHS Program does include religion in household roster, allows district-level computation. Requires registration + research justification + approval (2-4 weeks). Sample sizes ~700-1000 per district give ±3-5pp confidence intervals — modest improvement over Tier C's uniform projection.

**When to pursue:** if a specific narrative card requires defensible district-religion drift estimates (e.g., "Has Malappuram's Muslim share grown faster than Kasaragod's?").

### 🔴 Tier E (deferred indefinitely) — 2026 Census refresh

When India's delayed 2026 Census data publishes (probably 2027-28), the entire pipeline replays cleanly with new C-01. No methodology change required.

## Things the pipeline can't do (data limits, not methodology)

- **Sub-community shifts within "Hindu" / "Muslim" / "Christian"** — Census C-01 doesn't disaggregate to Nair/Ezhava, Sunni/Mujahid, Syro-Malabar/Latin/Marthoma. NSSO survey data captures sub-communities but at state level. See `docs/caste-data.md` for a Wikipedia table that covers Hindu sub-communities at district level (provenance unverified).
- **Causal mechanism (vote switching vs turnout shifts)** — Religion-share × alliance Δ correlations measure association, not which voters did what. Distinguishing requires survey microdata.
- **AC boundary changes** — pipeline assumes 2008 delimitation (140 ACs), stable since then for Kerala.

---

# Pipeline 3 — Religious POI inventory (OpenStreetMap)

How `data/ac-religious-pois.json` is produced — the AC × sub-rite POI counts that drive the cohort layer in [`src/lib/data/subrite-bins.ts`](../src/lib/data/subrite-bins.ts) and the by-religion walkthroughs.

## Architecture

```
OpenStreetMap (Overpass API)
  amenity=place_of_worship          ← primary tag
  building=church|mosque|temple     ← building polygons
  historic=wayside_shrine, etc.     ← long tail
        │
        ▼  fetch-osm-pow.ts (gitignored snapshot)
        │
data/raw/osm/places-of-worship-kerala.json
   ~25k raw elements (nodes + ways + relations, includes duplicates)
        │
        ▼  classify-osm-pow.ts (~30s, derivable; gitignored)
        │   – spatial dedupe (30m BFS cluster)
        │   – religion normalisation (christian / muslim / hindu / other / unknown)
        │   – name-regex inference where tags are missing
        │   – Catholic sub-rite disambiguation via district-level prior
        │     + 9 AC-level overrides (e.g. Vypen → Latin)
        │   – spatial join to AC polygon
        │
data/places-of-worship.json (per-POI, ~22k rows)
        │
        ▼  aggregate-ac-religion-pois.ts
        │
data/ac-religious-pois.json (committed; 140 AC × bucket counts)
```

## Fetch

`scripts/pipeline/fetch-osm-pow.ts --full` writes the raw Overpass dump to `data/raw/osm/places-of-worship-kerala.json`. The fetch unions three filters to maximise coverage (`amenity=place_of_worship` is the primary tag but ~12% of churches/mosques are tagged only via `building=church|mosque|temple`, and small Hindu shrines often only have `historic=wayside_shrine` or `religion=hindu` on a generic node).

`--sample` fetches only Kottayam district as a faster iteration target.

Snapshot date, exact Overpass queries, and per-tag coverage stats live in [`data/raw/osm/README.md`](../data/raw/osm/README.md). Raw dumps are gitignored (DDL CC-BY 2.0 license + size).

## Classify

`scripts/pipeline/classify-osm-pow.ts` reads the raw dump, dedupes spatially, normalises tags, and emits a per-POI classified JSON. Output (`data/places-of-worship.json`) is also gitignored — it's derivable from `data/raw/osm/` in ~30 seconds.

Key choices in the classifier:

- **Religion priority**: `religion` tag > `building` tag > name-regex inference. Unknown unless at least one signal lines up.
- **Christian sub-rite**: 12-way classification (latin_catholic, syro_malabar, syro_malankara, knanaya_catholic, marthoma, indian_orthodox, jacobite_syrian, knanaya_jacobite, csi, pentecostal, brethren, other_christian). Tags like `denomination=catholic` are ambiguous (Latin vs Syro-Malabar vs Syro-Malankara); resolved by:
  1. Name-regex (e.g. "Syro Malabar Forane Church" → syro_malabar) — strong.
  2. District-level prior: each Kerala district has a dominant Catholic sub-rite (e.g. Kottayam = syro_malabar, Trivandrum = latin_catholic). Applied to generic `catholic` POIs.
  3. AC-level override: 9 ACs whose district default would mis-classify (e.g. Vypen / Eranakulam / Kochi sit in Ernakulam district where Syro-Malabar dominates overall, but coastal Latin Catholic is the dominant sub-rite in those specific ACs).
- **Muslim sub-rite**: 6-way (sunni, salafi_mujahid, jamaat_islami, ahmadiyya, shia, other_muslim). Detected via name-regex on community-organisation prefixes (`Mujahid`, `KNM`, `ISM`, `JIH`, `Hira Centre`).

## Aggregate

`scripts/pipeline/aggregate-ac-religion-pois.ts` reduces the per-POI classified dataset to per-AC summary: total POIs, by religion (christian / muslim / hindu / other / unknown), by Christian denomination, by Muslim denomination, and a `dominant_*_denomination` field per religion.

`data/ac-religious-pois.json` is the committed product. At runtime [`src/lib/data/religious-pois.ts`](../src/lib/data/religious-pois.ts) loads it and rehydrates `ac_name` + `district` from the canonical registries (so the inventory file carries only `ac_id` + counts).

## Validation

`scripts/pipeline/validate-classified-pow.ts` spot-checks the classified per-POI output against known religious geography (e.g. Manjeshwar should be Sunni-majority muslim; Pala should be Syro-Malabar-majority Christian). Pre-fix list of expected dominant sub-rites per AC is hard-coded in the script.

`scripts/pipeline/diagnose-osm-pow-coverage.ts` runs a per-filter Overpass count to compare what each filter alone would have returned vs. the union; used to decide whether to broaden the fetch.

`scripts/pipeline/inspect-osm-pow.ts` is a manual exploration tool — coverage report + spatial-dedup tracing on the raw dump. Useful when a sub-rite count looks suspicious.

## What this pipeline cannot do

- **Distinguish active vs disused POIs** — OSM doesn't tag this consistently. Old shrines and active congregations weigh equally.
- **Population proxy across religions** — POIs proxy *within* a religion's spatial distribution but NOT across religions (Hindu temples are much smaller and more numerous per capita than churches). The cohort layer combines POI within-religion mix with Census religion-share population to bridge this.
- **Sub-rite assignment for POIs lacking both tag and naming signal** — fall back to district prior, which is a 80%-accurate heuristic, not measurement.

## Re-running

```bash
# Full refresh end-to-end
bun run scripts/pipeline/fetch-osm-pow.ts --full
bun run scripts/pipeline/classify-osm-pow.ts
bun run scripts/pipeline/aggregate-ac-religion-pois.ts

# Validate
bun run scripts/pipeline/validate-classified-pow.ts
```

---

# Pipeline 4 — Maps (one-off shapefile extraction)

For completeness. This pipeline ran once at project setup and is unlikely to re-run unless district / AC boundaries change.

```
Datameet shapefiles (CC-BY 2.5 IN; gitignored at data/maps-master/)
       │
       ▼  extract-kerala-map.py (filter to Kerala, simplify geometry)
       │
data/district.geojson + data/ac.geojson  (committed)
       │
       ▼  build-kerala-map-paths.ts (Mercator-project via d3-geo)
       │
data/district-paths.json + data/ac-paths.json  (committed)
       └─ runtime artifact — no d3-geo dep at runtime, just SVG path strings
```

Source: [`projects.datameet.org/maps`](https://projects.datameet.org/maps/) · repo: [`datameet/maps`](https://github.com/datameet/maps).

The `data/maps-master/` directory is gitignored (486 MB). Re-clone the upstream repo if you need to re-run extraction. After re-running `build-kerala-map-paths.ts`, the `data.test.ts` invariants will fail if any AC name in the geojson drifts from `ac-names.json` (see commit 0968bc2 for the 3-AC reconciliation pass).

---

# Pipeline 5 — Derived analytical layer

Four committed data files in `data/` are *derived* — built from the outputs of pipelines 1-3, no external source. These power the `/community-relevance` page, the candidate-continuity audit, the hereditary-seats analytical layer, and the AC summary tab on `/explore`.

Each output below is built by a single script and depends only on already-committed JSON. Re-running these is cheap and deterministic.

| Output | Builder | Inputs |
| --- | --- | --- |
| `data/community-relevance.json` | `scripts/pipeline/build-community-relevance.ts` | `results-2026.json`, `ac-history.json`, `ac-religion-2025.json`, `district-hindu-castes.json`, `ac-religious-pois.json`, `community-belts.json` |
| `data/candidate-continuity.json` + `docs/candidate-continuity-audit.md` | `scripts/analysis/audit-candidate-names.ts` | `results-2026.json`, `ac-history.json`, `data/candidate-classifications.json` (manual verdicts) |
| `data/hereditary-seats.json` | `scripts/analysis/build-hereditary-seats.ts` | `data/candidate-continuity.json` (union-find over same-person verdicts) |
| `data/ac-summaries.json` | **None — hand-composed prose.** Use `scripts/analysis/build-ac-summary-prep.ts` to regenerate `data/temp/ac-summary-prep.json` (the audit-input table) | `data/community-relevance.json`, `data/hereditary-seats.json`, NDA cohort definitions parsed from `src/pages/walkthroughs/nda-data.ts` |

## Community-relevance framework

`build-community-relevance.ts` assigns each AC a primary driver (christian-subrite / christian-aggregate / muslim / both-christian-muslim / hindu-district / diffuse), a durability category (always-X / flipped-2026 / X-since-2021 / ldf-since-2021), a stable-for reading (UDF/LDF/NDA/null), an alliance-roles matrix (flipTo/blockFrom per UDF/LDF/NDA), and a 3-cycle NDA trajectory.

Framework documentation lives in [`docs/community-relevance.md`](community-relevance.md). The runtime page reads through `src/lib/data/community-relevance.ts`.

Re-run:
```bash
bun run scripts/pipeline/build-community-relevance.ts
```

## Candidate-continuity audit

`audit-candidate-names.ts` normalises every top-3 finisher across 2011/2016/2019-bye/2021/2026 cycles via `scripts/_lib/names.ts:normalizeName()`. Reports:
- §A: matches the normaliser caught (same-name across cycles)
- §B: likely-same-person pairs the normaliser missed (suspected via Jaccard token similarity)
- §C: multi-alliance suspects (same name running for different alliances in different cycles)

Manual verdicts (`same-person-switched`, `different-people-same-name`, `hereditary-different-people`, etc.) persist in `data/candidate-classifications.json`. Re-running the audit preserves prior verdicts and only re-evaluates new pairs.

Re-run:
```bash
bun run scripts/analysis/audit-candidate-names.ts
```

## Hereditary seats

`build-hereditary-seats.ts` runs union-find over the `same-person-switched` and `hereditary-different-people` verdicts in `data/candidate-classifications.json`, grouping candidates into family lineages per AC. Six confirmed seats: Chittur (AC 58), Thrikkakara (83), Piravom (85), Pala (93), Puthuppally (98), Kuttanad (106).

Re-run after the audit:
```bash
bun run scripts/analysis/build-hereditary-seats.ts
```

## AC summaries (hand-composed)

`data/ac-summaries.json` contains 140 hand-written 4-6 sentence narrative summaries — one per AC. Used by the `/explore` DemographicsPanel "Summary" tab. **No script regenerates the prose.**

When upstream data refreshes, summaries can drift silently. The intended audit flow:

```bash
# 1. Regenerate the joined input table (gitignored, in data/temp/)
bun run scripts/analysis/build-ac-summary-prep.ts

# 2. Read data/temp/ac-summary-prep.json side-by-side against
#    data/ac-summaries.json, checking per-AC facts:
#      - 2026 winner + margin
#      - NDA trajectory (NN>NN>NN)
#      - Christian/Muslim/Hindu shares + tier labels
#      - durability + history framing (always-X, since-X, flipped)
#      - hereditary lineage where applicable
#      - NDA cohort tags (declining-mature, wave-capture, etc.)
#      - any superlative or comparative claims ("largest", "narrowest")
# 3. Update affected summaries manually.
```

The 14-batch review checklist used to ship v4 is documented in commit `005f106` (the original ac-summaries.json commit) and `2316bba` (final review pass). Word-count budget: 80-120 words per summary.

The summary schema is `{ ac, name, summary }` only — minimal by design so the JSON file size stays small and the prose is the only thing that can drift.
