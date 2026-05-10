# Sub-rite cohort × UDF performance — Sprint 2 analysis

**Generated:** 2026-05-10 by `scripts/analyze-subrite-cohorts.ts`

First quantitative pass over the new OSM-derived sub-rite cohort layer
(`src/lib/data/subrite-bins.ts`) against alliance performance.

The cohort assignment uses 2025-projected Census religion shares × OSM
POI mix, with a 5% voter-share threshold
and a 3-POI minimum sample. ACs that don't
meet both fall into the "below threshold" residual bucket.

## Method

For each AC:
- **Cohort**: dominant sub-rite among that religion's classified POIs,
  weighted by Census religion share to estimate "share of voters".
- **Alliance shares**: 2026 vote share from `data/kerala-2026.json`;
  2021 baseline from `data/historical/S11-*.json`. Δ = 2026 − 2021,
  percentage points.
- **Winner**: 2026 alliance with the highest share.

Within-cohort statistics are unweighted means across ACs in the cohort.
We're asking: among ACs where X sub-rite is the dominant religious
sub-community, what does the alliance pattern look like on average?

## Christian sub-rite cohorts

| Cohort | n | UDF 2026 | UDF 2021 | Δ UDF | LDF 2026 | LDF 2021 | Δ LDF | Wins (U/L/N) |
|---|---:|---:|---:|---:|---:|---:|---:|:---:|
| Latin Catholic | 28 | 45.6 | 36.7 | +9.0 | 39.7 | 47.1 | -7.4 | 21/6/1 |
| Syro-Malabar | 31 | 48.4 | 40.2 | +8.2 | 35.8 | 43.8 | -8.0 | 26/5/0 |
| Marthoma | 2 | 44.5 | 37.4 | +7.1 | 36.7 | 43.8 | -7.1 | 2/0/0 |
| Indian Orthodox | 10 | 44.8 | 37.6 | +7.3 | 37.6 | 44.4 | -6.9 | 5/4/1 |
| Jacobite Syrian | 3 | 52.1 | 42.7 | +9.4 | 33.7 | 39.5 | -5.8 | 3/0/0 |
| CSI | 5 | 35.4 | 33.3 | +2.2 | 38.1 | 43.9 | -5.7 | 2/2/1 |
| No consequential Christian sub-rite | 61 | 47.1 | 40.8 | +6.3 | 38.2 | 45.7 | -7.5 | 43/18/0 |

### Reading the Christian table

The 8 Christian sub-rite cohorts plus a "below threshold" residual
cover all 140 ACs. Cohort sizes range from 2 (Marthoma) to 31
(Syro-Malabar) to 61 (below threshold — mostly Muslim-belt + Hindu-
majority interior ACs where no Christian sub-rite reaches the 5%
voter-share threshold).

Cross-cohort comparisons to read:

- **Syro-Malabar (n=31)** vs **Latin Catholic (n=28)**: the two largest
  Christian cohorts. Compare 2026 UDF margins and the 2021→2026 swing.
- **Indian Orthodox (n=10)**: distinct geography (Tiruvalla / Niranam
  belt) — does the alliance trajectory differ from the Catholic blocs?
- **Marthoma (n=2)**: tiny sample; treat any pattern as suggestive
  rather than conclusive.
- **CSI (n=5)** + **Jacobite (n=3)**: also small; useful for contrast,
  not for statistical claims.
- **Below-threshold residual (n=61)**: this is the "Christian is not
  the relevant axis here" bucket. Its alliance pattern is the baseline
  to compare cohort patterns against.

## Muslim sub-rite cohorts

| Cohort | n | UDF 2026 | UDF 2021 | Δ UDF | LDF 2026 | LDF 2021 | Δ LDF | Wins (U/L/N) |
|---|---:|---:|---:|---:|---:|---:|---:|:---:|
| Sunni | 48 | 49.2 | 42.7 | +6.5 | 36.5 | 43.6 | -7.1 | 40/7/1 |
| Salafi / Mujahid | 14 | 46.5 | 37.8 | +8.7 | 36.5 | 44 | -7.5 | 9/5/0 |
| No consequential Muslim sub-rite | 78 | 45 | 37.5 | +7.5 | 38.9 | 46.5 | -7.6 | 53/23/2 |

### Reading the Muslim table

Two real cohorts: Sunni (n=48) and Salafi/Mujahid (n=14). The
Ahmadiyya cohort that appeared in the visualisation pre-N≥3 gate fell
out (all three Ahmadiyya-dominant ACs had ≤2 classified Muslim POIs).

The key question: do Mujahid-dominant ACs vote like the Sunni cohort,
or differently? The standing political assumption is that IUML's
Sunni-establishment relationship is firmer than its relationship with
Mujahid factions — so Mujahid ACs might be less reliably UDF.

## Variance explained — sub-rite cohort vs raw religion share

For 2026 UDF vote share among Christian-cohort-labelled ACs (n=79):

| Predictor | R² |
|---|---:|
| Christian sub-rite cohort (one-way) | 0.139 |
| Christian % of population (linear)  | 0.169 |

For the Δ UDF (2026 − 2021) swing:

| Predictor | R² |
|---|---:|
| Christian sub-rite cohort (one-way) | 0.072 |
| Christian % of population (linear)  | 0.036 |

For Muslim cohort vs Muslim % (n=62, on UDF 2026):

| Predictor | R² |
|---|---:|
| Muslim sub-rite cohort (one-way) | 0.014 |
| Muslim % of population (linear)  | 0.237 |

### Reading the variance table

A higher R² for "cohort" relative to "% population" suggests the
specific sub-rite identity adds information beyond the simple
religion-share — i.e., it matters not just *how many* Christians live
in an AC but *which* Christians.

Caveats:
- One-way ANOVA inflates R² when there are many cohorts; the raw
  comparison favours the cohort term. A fair contest would apply a
  degrees-of-freedom correction or use cross-validated R²; we haven't.
- Religion share has a near-monotonic relationship with UDF, so a
  linear-Pearson R² is a sensible baseline.
- The point of this table is **whether the cohort term has explanatory
  power at all**, not which is strictly "better". If cohort R² is
  barely above religion-share R², the sub-rite distinction is mostly
  noise. If it's substantially higher, sub-rite identity is a real
  second-order variable.

## Christian cohort outliers

### Latin Catholic cohort (modal winner: UDF) — 7 outliers

- **KANHANGAD** (AC #4) — winner LDF: UDF 37 · LDF 45.7 · NDA 15.5 · Δ UDF +2.5
- **MATTANNUR** (AC #15) — winner LDF: UDF 39.8 · LDF 48.2 · NDA 10.5 · Δ UDF +17.1
- **CHERTHALA** (AC #103) — winner LDF: UDF 40.1 · LDF 48.6 · NDA 10.5 · Δ UDF -3.4
- **MAVELIKKARA** (AC #109) — winner LDF: UDF 36.2 · LDF 47.3 · NDA 16.3 · Δ UDF +5.0
- **PUNALUR** (AC #121) — winner LDF: UDF 35.7 · LDF 50.9 · NDA 10.9 · Δ UDF +6.0
- **ATTINGAL** (AC #128) — winner LDF: UDF 27.8 · LDF 39.8 · NDA 30.8 · Δ UDF +2.8
- **KAZHAKOOTTAM** (AC #132) — winner NDA: UDF 28.5 · LDF 35.3 · NDA 35.7 · Δ UDF +4.6

### Syro-Malabar cohort (modal winner: UDF) — 5 outliers

- **MANALUR** (AC #64) — winner LDF: UDF 38.2 · LDF 38.3 · NDA 22.3 · Δ UDF +9.3
- **WADAKKANCHERY** (AC #65) — winner LDF: UDF 40 · LDF 43.5 · NDA 15.9 · Δ UDF +1.3
- **OLLUR** (AC #66) — winner LDF: UDF 40.2 · LDF 46.1 · NDA 13.1 · Δ UDF +4.9
- **NATTIKA** (AC #68) — winner LDF: UDF 33.2 · LDF 37.8 · NDA 29 · Δ UDF +4.3
- **PUDUKKAD** (AC #71) — winner LDF: UDF 39.4 · LDF 41.3 · NDA 18.3 · Δ UDF +10.0

### Indian Orthodox cohort (modal winner: UDF) — 5 outliers

- **KUNNAMKULAM** (AC #62) — winner LDF: UDF 42.6 · LDF 45.6 · NDA 11.2 · Δ UDF +11.0
- **CHENGANNUR** (AC #110) — winner LDF: UDF 34.8 · LDF 42.3 · NDA 22.6 · Δ UDF +8.0
- **KONNI** (AC #114) — winner LDF: UDF 43.5 · LDF 44.9 · NDA 11.4 · Δ UDF +7.6
- **KOTTARAKKARA** (AC #119) — winner LDF: UDF 42.4 · LDF 43.1 · NDA 13.9 · Δ UDF +3.7
- **CHATHANNOOR** (AC #126) — winner NDA: UDF 26 · LDF 35 · NDA 38.2 · Δ UDF +1.1

### CSI cohort (modal winner: UDF) — 3 outliers

- **NEDUMANGAD** (AC #130) — winner LDF: UDF 30.2 · LDF 43.8 · NDA 24.7 · Δ UDF -2.2
- **NEMOM** (AC #135) — winner NDA: UDF 21.3 · LDF 37.4 · NDA 40.9 · Δ UDF -3.7
- **PARASSALA** (AC #137) — winner LDF: UDF 35.1 · LDF 44.8 · NDA 19.4 · Δ UDF +2.7

## Muslim cohort outliers

### Sunni cohort (modal winner: UDF) — 8 outliers

- **KANHANGAD** (AC #4) — winner LDF: UDF 37 · LDF 45.7 · NDA 15.5 · Δ UDF +2.5
- **KALLIASSERI** (AC #7) — winner LDF: UDF 39.6 · LDF 51.2 · NDA 8.2 · Δ UDF +9.5
- **AZHIKODE** (AC #10) — winner LDF: UDF 43.7 · LDF 43.9 · NDA 11.8 · Δ UDF +2.5
- **THALASSERY** (AC #13) — winner LDF: UDF 34.3 · LDF 48.6 · NDA 15.8 · Δ UDF +0.4
- **SHORNUR** (AC #51) — winner LDF: UDF 34 · LDF 44.3 · NDA 20.9 · Δ UDF +9.1
- **GURUVAYOOR** (AC #63) — winner LDF: UDF 39.7 · LDF 40.9 · NDA 17.9 · Δ UDF -0.4
- **KAIPAMANGALAM** (AC #69) — winner LDF: UDF 39 · LDF 46 · NDA 13.8 · Δ UDF +2.0
- **NEMOM** (AC #135) — winner NDA: UDF 21.3 · LDF 37.4 · NDA 40.9 · Δ UDF -3.7

### Salafi / Mujahid cohort (modal winner: UDF) — 5 outliers

- **PATTAMBI** (AC #50) — winner LDF: UDF 41.8 · LDF 47.4 · NDA 9 · Δ UDF +4.1
- **MALAMPUZHA** (AC #55) — winner LDF: UDF 26.3 · LDF 42.7 · NDA 30.4 · Δ UDF +4.6
- **KUNNAMKULAM** (AC #62) — winner LDF: UDF 42.6 · LDF 45.6 · NDA 11.2 · Δ UDF +11.0
- **NATTIKA** (AC #68) — winner LDF: UDF 33.2 · LDF 37.8 · NDA 29 · Δ UDF +4.3
- **ATTINGAL** (AC #128) — winner LDF: UDF 27.8 · LDF 39.8 · NDA 30.8 · Δ UDF +2.8

## Open questions for follow-up

1. **Latin vs Syro-Malabar swing direction.** If the table shows the
   two largest Catholic cohorts moved differently in 2026, that's a
   walkthrough-worthy finding. The UDF walkthrough currently treats
   the Christian-belt sweep as monolithic.
2. **Orthodox-belt independence.** If the Indian Orthodox cohort shows
   a swing distinct from the Catholic cohorts, the Tiruvalla–Niranam
   corridor is doing something specific.
3. **Sunni vs Mujahid split.** If Mujahid-dominant ACs show
   systematically different UDF margin than Sunni-dominant ACs, that
   speaks to IUML's organisational reach within Muslim sub-sects.
4. **Predictive power of cohort vs religion-share.** If cohort R²
   meaningfully exceeds religion-share R² (after a fair correction),
   then sub-rite identity is a real second-order variable.

## What this report doesn't do

- No 2016 / 2011 trend (multi-cycle). Add as a follow-up if cross-
  cycle behaviour seems different from 2021→2026.
- No district-fixed-effect controls. Some sub-rite cohorts cluster
  geographically (Syro-Malabar ≈ Kottayam-Idukki belt, Latin ≈ coastal)
  so cohort effects may be confounded with district effects. A proper
  model would partial out district.
- No vote-flow (UDF→LDF transitions) analysis by cohort. Could be a
  next-phase if cohort margins look interesting.
