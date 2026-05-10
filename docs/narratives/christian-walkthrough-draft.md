# Christian Communities Walkthrough — Draft

**Status**: drafting — thesis seeded, data partially collected, structure not yet committed

**Audience**: yourself (private investigation doc; will get distilled into a public walkthrough page once thesis solidifies)

**Sibling**: [muslim-walkthrough-draft.md](./muslim-walkthrough-draft.md)

---

## Working thesis

> **Kerala Christians moved together in 2026 — but with three distinct profiles inside the bloc.** Catholics (Latin + Syro-Malabar) swung uniformly toward UDF by ~+8-9pp. Indian Orthodox swung the same amount but stayed competitive (only half of Orthodox-cohort ACs went UDF, vs ~80% in Catholic cohorts). CSI barely moved (+2.2pp, with 2/5 UDF wins) — the LDF-leaning Christian outlier.

If this holds up under more cuts, it argues against the "Christian bloc voted UDF" frame (too coarse) and the "every Christian sub-rite has its own politics" frame (too granular). Three categories, not nine.

## Why this walkthrough?

The party walkthroughs (`/walkthroughs/udf`, etc.) examine alliance strategy. This walkthrough flips the axis to **community behaviour** — what did each Christian sub-community do in 2026, and how did it compare to past cycles?

This is structurally enabled by the new OSM-derived sub-rite cohort layer (`src/lib/data/subrite-bins.ts`, commit `42dee05`). Before that data existed, "Christian" was a monolithic column in religion-share analysis. Now we can decompose it into Latin / Syro-Malabar / Orthodox / Jacobite / Marthoma / CSI / Pentecostal at AC granularity.

The walkthrough's contribution to the site: **first AC-level Christian sub-rite political analysis** in any Kerala election dataset (as far as I know). The party walkthroughs already cover the high-level UDF/LDF/NDA dynamics; this one adds the religious-community lens.

## Data we have

From Sprint 1 + 2 (commits `42dee05`, `a8f6268`):

### Cohort sizes (AC counts, 2025-projected, 5% voter-share threshold, ≥3 classified POIs)

| Cohort | n | Notes |
|---|---:|---|
| Syro-Malabar | 31 | Largest. Interior central Kerala: Kottayam, Idukki, Ernakulam interior, Thrissur interior |
| Latin Catholic | 28 | Coastal corridor: Trivandrum coast → Alleppey → Ernakulam coastal → Kannur Latin diocese (Peravoor/Irikkur), plus Kodungallur |
| Indian Orthodox | 10 | Central Travancore: Tiruvalla / Niranam / Parumala / Aranmula |
| CSI | 5 | Sparse, mostly southern Kerala |
| Jacobite Syrian | 3 | Even sparser |
| Marthoma | 2 | Aranmula corridor |
| (Pentecostal, Knanaya, etc.) | 0 | No AC dominates above the threshold |
| Below threshold | 61 | Mostly Muslim-belt + Hindu-majority interior — no consequential Christian sub-rite |

### 2026 UDF margin + 2021→2026 swing per cohort

| Cohort | n | UDF 2026 | Δ UDF | LDF 2026 | Δ LDF | Wins (U/L/N) |
|---|---:|---:|---:|---:|---:|:---:|
| Syro-Malabar | 31 | 48.4 | +8.2 | 35.8 | −8.0 | 26·5·0 |
| Latin Catholic | 28 | 45.6 | +9.0 | 39.7 | −7.4 | 21·6·1 |
| Indian Orthodox | 10 | 44.8 | +7.3 | 37.6 | −6.9 | 5·4·1 |
| Marthoma | 2 | 44.5 | +7.1 | 36.7 | −7.1 | 2·0·0 |
| Jacobite | 3 | 52.1 | +9.4 | 33.7 | −5.8 | 3·0·0 |
| **CSI** | **5** | **35.4** | **+2.2** | **38.1** | **−5.7** | **2·2·1** |
| Below-threshold residual | 61 | 47.1 | +6.3 | 38.2 | −7.5 | 43·18·0 |

### Variance explained (Christian cohort vs raw religion share, predicting 2026 UDF)

|  | Christian cohort R² | Christian % R² |
|---|---:|---:|
| UDF 2026 vote share (level) | 0.139 | 0.169 |
| Δ UDF (swing) | **0.072** | **0.036** |

Cohort identity adds ~2× the explanatory power for the *swing* compared to raw Christian share. For static level, raw share wins. Read as: "where Christians live tells you most of the UDF level, but which Christians live there tells you how much the AC moved."

### Source provenance

- Cohort assignment: `src/lib/data/subrite-bins.ts` (OSM sub-rite POI mix × Census religion share, 2025 projection)
- Alliance shares: `data/kerala-2026.json` (2026) + `data/historical/S11-*.json` (2021)
- Methodology: `data/raw/osm/README.md`
- Visualisation: `/religion-map` Religious-sub-communities section

## Findings from Sprint 2 (the seed)

### Finding 1 — Catholic uniformity

Latin Catholic (+9.0) and Syro-Malabar (+8.2) swung **almost identically**. This refutes the hypothesis that one Catholic sub-rite drove the 2026 UDF Christian-belt sweep more than the other.

**What it means**: whatever the structural cause of the Catholic→UDF shift, it operated **across diocesan boundaries**. The Bishops' Council statement, post-Manipur narrative, Christian-belt UDF outreach — these affected all Catholics. Not a coordinated diocesan-specific push.

**What to investigate**:
- [ ] Same uniformity in 2021→2016? (multi-cycle test — does the SM/Latin pair always move together, or was 2026 unusual?)
- [ ] Within-cohort variance — does Latin variability differ from SM variability?
- [ ] District clustering — if Latin ACs cluster in 4 districts and SM in 4 different districts, district FE might absorb the cohort effect.

### Finding 2 — CSI is the outlier

CSI swung just +2.2pp toward UDF — vs +7-9 elsewhere. And only 2 of 5 CSI-cohort ACs went UDF (vs ~75% in Catholic cohorts). CSI is structurally more LDF-leaning than other Christian sub-rites.

**Hypothesis (to test)**: CSI is a Protestant denomination with historical Communist sympathies in pockets of Travancore. CSI churches in central Travancore include LDF-supporting clergy traditions. The 2.2pp shift suggests CSI's UDF affinity is genuinely weaker than mainstream Christian Kerala.

**What to investigate**:
- [ ] Which 5 ACs are in the CSI cohort? Are they geographically clustered?
- [ ] Are the 5 CSI ACs majority-Christian, or just plurality-Christian where CSI happens to be the dominant sub-rite?
- [ ] Compare CSI cohort to the "Below threshold" residual — is the 2.2pp swing similar to Hindu-majority interior ACs (suggesting CSI cohort = "low Christian density" not "CSI-driven")?

### Finding 3 — Indian Orthodox stayed competitive

Orthodox cohort swung +7.3 (Catholic-similar) but UDF only won 5/10 ACs. The Tiruvalla/Niranam belt is **structurally competitive between alliances** in a way the Catholic belts aren't.

**Hypothesis**: Indian Orthodox Church has historically supported both fronts in central Travancore — bishop families with INC/UDF, parishioner-level LDF affinity. The 2026 swing brought half the Orthodox ACs over the line but the rest stayed LDF.

**What to investigate**:
- [ ] Which 5 LDF-winning Orthodox ACs? Are they clustered? What's distinctive?
- [ ] What's the UDF-LDF margin in the 5 UDF-winning Orthodox ACs — narrow or wide?
- [ ] Did Indian Orthodox ACs swing this much in 2016 or 2011, or is 2026 unusual?

## Per-sub-rite scratch

### Syro-Malabar (n=31)

**Geography**: Mostly Pala / Kanjirapally / Idukki / Ernakulam interior / Thrissur interior / Mananthavady.

**Alliance behaviour 2026**: 48.4% UDF, 35.8% LDF, +8.2pp UDF swing, 26/31 UDF wins (84%). The textbook Christian-belt-UDF result.

**Notable outliers** (5 LDF wins out of 31):
- [ ] Identify and list (TODO — run drill-down script)

**Multi-cycle** (TODO): does SM swing back and forth across cycles, or is 2026 a one-time shift?

---

### Latin Catholic (n=28)

**Geography**: Coastal Trivandrum, Alleppey, Ernakulam (Kochi/Vypeen/Ernakulam ACs), Kodungallur, Peravoor/Irikkur (Kannur Latin diocese).

**Alliance behaviour 2026**: 45.6% UDF, 39.7% LDF, +9.0pp UDF swing, 21/28 UDF wins (75%).

**Notable outliers** (6 LDF + 1 NDA out of 28):
- [ ] Identify and list

**Multi-cycle** (TODO): the coastal Latin belt has historically been more competitive than interior SM. Does the multi-cycle trend show oscillation?

---

### Indian Orthodox (n=10)

**Geography**: Central Travancore Pathanamthitta and Kottayam corridor — Tiruvalla, Niranam, Parumala, Aranmula territory plus a few others.

**Alliance behaviour 2026**: 44.8% UDF, 37.6% LDF, +7.3pp UDF swing, **only 5/10 UDF wins** (50%).

**Notable**: Orthodox cohort is the **least UDF-dominant** Christian cohort. Half the cohort still goes LDF.

**Multi-cycle** (TODO): is Orthodox-belt the most "swing voter" Christian cohort historically?

---

### CSI (n=5)

**Geography**: TODO — identify which 5 ACs.

**Alliance behaviour 2026**: 35.4% UDF, 38.1% LDF, +2.2pp UDF swing, 2/5 UDF wins (40%).

**Notable**: lowest UDF level + lowest UDF swing across the Christian cohorts. CSI is the LDF-leaning Christian community in 2026.

**Multi-cycle** (TODO): does CSI move with general Christian Kerala, or follow a different rhythm?

---

### Jacobite Syrian (n=3)

**Geography**: TODO.

**Alliance behaviour 2026**: 52.1% UDF (highest of any Christian cohort), +9.4pp UDF swing, 3/3 UDF wins.

**Notable**: smallest n, biggest cohort effect. Single cohort that went 100% UDF. Treat as suggestive only.

---

### Marthoma (n=2)

**Geography**: Aranmula corridor (Pathanamthitta).

**Alliance behaviour 2026**: 44.5% UDF, +7.1pp swing, 2/2 UDF wins.

**Notable**: n=2, no statistical claim possible. Add commentary or omit?

---

## Synthesis candidates

Three threads that could weave the per-sub-rite story together:

1. **"Catholic uniformity, Protestant divergence"** — Catholics moved as one bloc; CSI broke ranks. The 2026 Catholic-shift was driven by something specific to the Catholic Church (Bishops' Council, post-Manipur, etc.) that didn't reach CSI.

2. **"Three tiers of UDF affinity"** — Catholic + Jacobite (high UDF affinity), Orthodox + Marthoma (competitive), CSI (LDF-leaning). Within "Christian", there's structured variance.

3. **"The Christian swing was real, but didn't reach all Christians"** — Headline UDF gains in Christian Kerala disguise the CSI exception. The walkthrough's value is showing where the swing landed and where it didn't.

## Falsifiers / what would weaken the thesis

- **CSI cohort n=5 turns out to be 3 SC-reserved + 2 Hindu-majority** — then CSI cohort isn't really "CSI ACs" but "low-Christian-density ACs where CSI happens to be the dominant sub-rite". The +2.2 swing wouldn't be about CSI behaviour.
- **Indian Orthodox cohort is geographically all in Pathanamthitta** — then "Orthodox stayed competitive" might just be "Pathanamthitta district stayed competitive". District-fixed-effect would absorb the cohort signal.
- **Latin Catholic ACs had structurally different turnout or candidate quality than SM ACs** — the +9.0 vs +8.2 difference could be explained by district-FE or candidate-level effects, not sub-rite identity.
- **2021 baseline issue** — if 2021 had an unusual UDF dip in CSI ACs for some reason, the +2.2 in 2026 is the regression, not a stable CSI alignment.

## Open data needs / scripts to run

Prioritised by what would most sharpen or kill the thesis:

- [ ] **List ACs per Christian cohort** — print AC name, district, religion-share, UDF/LDF/NDA shares 2021/2026. Sanity-check cohort assignments by hand. (`scripts/list-christian-cohort-acs.ts`)
- [ ] **District clustering audit** — for each cohort, what % of its ACs are in one district vs spread across many? If SM=Kottayam-only and Latin=Alleppey-only, district FE problem is severe.
- [ ] **Multi-cycle swing** — re-run cohort × UDF margin for 2011, 2016, 2021, 2026. Is 2026 unusual vs the cohort's historical pattern?
- [ ] **Within-cohort variance** — compute SD of UDF 2026 within each cohort. If Latin has high variance and SM has low, "Catholic uniformity" is misleading.
- [ ] **CSI deep-dive** — which 5 ACs? What's the Christian %? What's the historic UDF/LDF pattern?
- [ ] **Orthodox deep-dive** — which 5 ACs went UDF, which 5 went LDF? Identify the splitting variable.
- [ ] **Hindu-belt comparison** — what's the Δ UDF in "Below threshold" Christian ACs? If +6.3 is the Christian-irrelevant baseline, the Catholic +8-9 and CSI +2.2 are both meaningfully different from the baseline.
- [ ] **Candidate-party check** — are CSI cohort UDF candidates a different party mix than Catholic cohort UDF candidates? (E.g., CSI cohort might be INC-heavy while Catholic cohort might be KEC/Kerala Congress-heavy.)

## Decisions log

- **2026-05-10**: draft seeded with Sprint 2 findings. Working thesis = three Christian profiles (Catholic bloc / Orthodox competitive / CSI outlier). Next: AC drill-down + multi-cycle.
