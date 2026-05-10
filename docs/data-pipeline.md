# Data pipeline — AC-level demographics

How `data/ac-demographics.json` is produced, what's known to be incomplete, and what we'd improve next.

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
              ac-demographics.json (140 ACs)
```

**Build script:** `scripts/build-ac-demographics.py`

**Inputs:**
- `data/raw/census-c01/DDW32C-01-MDDS.XLS` — Kerala C-01 from censusindia.gov.in (committed; ~268KB)
- `data/shrug/shrug-con-keys-csv/shrid_frag_con08_key.csv` — shrid → AC, with fragment weights
- `data/shrug/shrug-pc-keys-csv/pc11r_shrid_key.csv` — rural shrids → village/sub-district codes
- `data/shrug/shrug-pc-keys-csv/pc11u_shrid_key.csv` — urban shrids → town codes
- `data/shrug/shrug-pca11-csv/pc11_pca_clean_shrid.csv` — population per shrid

SHRUG data is gitignored (DDL CC-BY-NC-SA license restricts redistribution); re-download from [devdatalab.org/shrug_download](https://www.devdatalab.org/shrug_download/).

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

Implemented in `scripts/project-ac-demographics-2025.py`. State-level uniform multipliers from cohort projection (Hindu × 0.9591, Muslim × 1.1166, Christian × 0.9712) applied to all AC shares with per-AC renormalization. Output: `data/ac-demographics-2025.json` alongside the raw 2011 baseline at `data/ac-demographics.json`.

Multipliers come from the cohort projection in `scripts/cohort-project-2011-to-2025.py`: Census 2011 starting populations + Kerala CRS births by religion 2011-2023 + crude death rate ~7/1000.

**This is the default baseline for both `/religion-map` and narrative-card analysis** (e.g., A1 minority consolidation). The raw 2011 baseline remains available via `--baseline-2011` on analysis scripts and via the year toggle on `/religion-map`.

**Why default to 2025:** Pearson correlation is invariant to monotonic transformations of a single variable, and our renormalization step (rescale to sum=100 per AC) is near-linear because state-level multipliers are uniform. Empirically (`scripts/narrative-a1-2011-vs-2025.ts`) the choice between 2011 and 2025 moves correlations by at most 0.011 across all 140 ACs — same verdict, same rank order. 2025 is reality-aligned for absolute-share statements ("Vengara is 85% Muslim") and external cross-checks; 2011 is still useful as the tamper-evident base layer.

**Limitations** (baked into the file's `note` field):
- Uniform state-level multiplier; assumes Kerala's geographic gradient hasn't shifted, only absolute shares.
- Doesn't model district-specific fertility differentials (Muslim TFR is higher in already-Muslim-heavy Malappuram than in Trivandrum).
- Absolute shares for any single AC may be off by a few pp; rank order is preserved exactly.

Spot-check (Manjeshwar AC 1): our projection said H 44.2% / M 53.1% / C 2.7%; an independent commentator's 2026 voter prediction was H 42.8% / M 54.5% / C 2.7%. Match within 1.5pp on every religion despite different sources, methods, and population-vs-voters distinction.

### 🔴 Tier D (deferred, ~3-4 weeks effort) — district-specific drift via NFHS-5 microdata

NFHS-5 District Fact Sheets don't publish religion shares (health-only template). NFHS microdata via [DHS Program](https://dhsprogram.com/data/available-datasets.cfm) does include religion in household roster, allows district-level computation. Requires registration + research justification + approval (2-4 weeks). Sample sizes ~700-1000 per district give ±3-5pp confidence intervals — modest improvement over Tier C's uniform projection.

**When to pursue:** if a specific narrative card requires defensible district-religion drift estimates (e.g., "Has Malappuram's Muslim share grown faster than Kasaragod's?").

### 🔴 Tier E (deferred indefinitely) — 2026 Census refresh

When India's delayed 2026 Census data publishes (probably 2027-28), the entire pipeline replays cleanly with new C-01. No methodology change required.

## Things the pipeline can't do (data limits, not methodology)

- **Sub-community shifts within "Hindu" / "Muslim" / "Christian"** — Census C-01 doesn't disaggregate to Nair/Ezhava, Sunni/Mujahid, Syro-Malabar/Latin/Marthoma. NSSO survey data captures sub-communities but at state level. See `docs/caste-data.md` for a Wikipedia table that covers Hindu sub-communities at district level (provenance unverified).
- **Causal mechanism (vote switching vs turnout shifts)** — Religion-share × alliance Δ correlations measure association, not which voters did what. Distinguishing requires survey microdata.
- **AC boundary changes** — pipeline assumes 2008 delimitation (140 ACs), stable since then for Kerala.
