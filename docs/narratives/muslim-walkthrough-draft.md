# Muslim Communities Walkthrough — Draft

**Status**: drafting — thesis seeded, data partially collected, structure not yet committed

**Audience**: yourself (private investigation doc; will get distilled into a public walkthrough page once thesis solidifies)

**Sibling**: [christian-walkthrough-draft.md](./christian-walkthrough-draft.md)

---

## Working thesis

> **Kerala Muslims don't vote as one bloc — Mujahid-dominant ACs swung harder toward UDF in 2026 than Sunni-dominant ACs (+8.7 vs +6.5), and were more bipartisan (36% LDF retention vs 15%).** The standing political assumption that "Muslim = UDF via IUML" overstates IUML's organisational reach. IUML's relationship with Mujahid factions is structurally different from its relationship with the Sunni establishment, and the 2026 cycle revealed that difference.

If this holds up, the walkthrough argues that the Muslim-belt UDF margin in 2026 was driven by **Sunni stability + Mujahid swing**, not by uniform mobilisation across the Muslim spectrum.

## Why this walkthrough?

The party walkthroughs treat the Muslim-belt as a UDF stronghold without internal differentiation. The UDF walkthrough's Muslim-belt section credits the 23-of-23 Malappuram sweep without examining whether Mujahid + Sunni areas moved the same way.

The new OSM-derived sub-rite cohort layer (`src/lib/data/subrite-bins.ts`, commit `42dee05`) makes the Mujahid / Sunni / Jamaat-e-Islami split visible at AC granularity for the first time. Before this, Muslim sub-sect was qualitatively known (which mosques are Mujahid-affiliated, etc.) but not quantitatively mapped to ACs.

The walkthrough's contribution: **first AC-level Muslim sub-sect political analysis** in any Kerala election dataset. The party walkthroughs cover IUML's high-level role; this one examines the within-Muslim variance.

## Data we have

From Sprint 1 + 2 (commits `42dee05`, `a8f6268`):

### Cohort sizes (AC counts, 2025-projected, 5% voter-share threshold, ≥3 classified POIs)

| Cohort | n | Notes |
|---|---:|---|
| Sunni | 48 | Largest. Spread across Muslim-majority Malabar + Muslim-significant central/south coastal |
| Salafi/Mujahid | 14 | Concentrated in north Kerala — Malappuram/Kozhikode/Kannur interior |
| Jamaat-e-Islami | 0 | None reach the threshold (JIH is organisationally diffuse, not geographically dominant) |
| Ahmadiyya | 0 | Filtered out by N≥3 gate (was 3 pre-gate; all were N=1/2 samples) |
| Shia | 0 | Negligible in Kerala |
| Below threshold | 78 | More than half. Includes most of central/southern Kerala where Muslim share is <10% |

### 2026 UDF margin + 2021→2026 swing per cohort

| Cohort | n | UDF 2026 | Δ UDF | LDF 2026 | Δ LDF | Wins (U/L/N) | LDF retention |
|---|---:|---:|---:|---:|---:|:---:|:---:|
| Sunni | 48 | 49.2 | +6.5 | 36.5 | −7.1 | 40·7·1 | **15%** |
| **Salafi/Mujahid** | **14** | **46.5** | **+8.7** | **36.5** | **−7.5** | **9·5·0** | **36%** |
| Below-threshold residual | 78 | 45.0 | +7.5 | 38.9 | −7.6 | 53·23·2 | 29% |

### Variance explained (Muslim cohort vs raw religion share, predicting 2026 UDF)

|  | Muslim cohort R² | Muslim % R² |
|---|---:|---:|
| UDF 2026 vote share (level) | 0.014 | 0.237 |

Muslim cohort identity adds essentially nothing over raw Muslim share for predicting UDF level — Muslim share alone captures the signal. **Important caveat**: this is for level (where is UDF strong), not swing. We haven't computed swing R² for Muslim cohort yet — that's the more relevant test.

- [ ] Compute Muslim cohort vs Muslim % R² on Δ UDF (swing), not just level. If the swing pattern is cohort-dependent, the thesis stays alive even though level isn't.

### Source provenance

- Cohort assignment: `src/lib/data/subrite-bins.ts` (OSM sub-rite POI mix × Census religion share, 2025 projection)
- Alliance shares: `data/kerala-2026.json` (2026) + `data/historical/S11-*.json` (2021)
- Methodology: `data/raw/osm/README.md`
- Visualisation: `/religion-map` Religious-sub-communities section

## Findings from Sprint 2 (the seed)

### Finding 1 — Mujahid ACs swung HARDER toward UDF than Sunni ACs

+8.7pp UDF in Mujahid cohort vs +6.5pp in Sunni cohort. This is **opposite** to the conventional assumption that IUML (UDF's Muslim-establishment party) holds the Sunni vote more firmly than the Mujahid vote. If anything, Mujahid ACs moved further toward UDF than Sunni ACs did.

**Possible explanations**:
- Mujahid had room to swing because their UDF baseline was lower (37.8 vs 42.7) — i.e., regression-to-Mujahid-as-UDF-already.
- Anti-LDF sentiment in 2026 was stronger in Mujahid communities than in Sunni communities for non-religious reasons (e.g., specific local issues, anti-incumbency).
- Salafi-aligned candidates / Welfare Party of India (the JIH political vehicle) may have absorbed LDF-leaning Mujahid votes in past cycles, then redirected to UDF in 2026.

**What to investigate**:
- [ ] What was the Mujahid cohort UDF level in 2011 and 2016, not just 2021? If 2016/2021 were anomalously LDF for Mujahid, +8.7 is the rebound.
- [ ] District clustering — are the 14 Mujahid ACs all in Malappuram, or spread? If concentrated, "Mujahid swung" may be "Malappuram swung".
- [ ] Welfare Party / SDPI / minor-Muslim-party votes — did these flip from LDF to UDF, or just disappear?

### Finding 2 — Mujahid ACs are MORE BIPARTISAN than Sunni ACs

36% of Mujahid-cohort ACs went LDF in 2026 vs 15% of Sunni-cohort ACs. Mujahid ACs are **structurally more competitive** between alliances than Sunni ACs.

**Hypothesis**: IUML's grip is tighter in Sunni-Establishment areas (the EK Sunni / AP Sunni mainstream). Mujahid areas have always been more pluralistic — KNM (Salafi) doesn't have a dedicated political wing, so Mujahid voters distribute across UDF (IUML/INC), LDF, and minor Muslim parties.

If true, this contradicts the framing that "Muslim Kerala = UDF reliably". A meaningful chunk of Muslim Kerala (the Mujahid 36%) doesn't reliably go UDF.

**What to investigate**:
- [ ] Which 5 LDF-winning Mujahid ACs? Are they clustered or scattered? Names + districts.
- [ ] Margin sizes in the 9 UDF-winning Mujahid ACs — are they narrow or wide?
- [ ] Comparison: Mujahid LDF retention 36% vs Christian Indian Orthodox LDF retention 50%. Both are the "competitive" cohorts of their religions. Different mechanism or similar one?

### Finding 3 — Muslim share crushes sub-sect cohort for predicting UDF *level*

R² = 0.237 (Muslim %) vs 0.014 (cohort). Muslim Kerala votes UDF at a level that's almost entirely determined by *how Muslim* the AC is, not *which kind of Muslim*. Sub-sect identity is noise.

**BUT**: this is for level, not swing. The swing analysis (cohort vs share R² on Δ UDF) hasn't been computed yet — and the headline cohort means (+8.7 vs +6.5) suggest the swing IS cohort-dependent.

**What to investigate**:
- [ ] Run swing R² for Muslim cohort. If cohort R² ≈ share R² for swing, sub-sect identity matters for swing direction even though it doesn't matter for level.

## Per-sub-rite scratch

### Sunni (n=48)

**Geography**: Spread across Muslim Kerala. Includes most Malappuram ACs, central-Kerala Muslim ACs (Aluva, Perumbavoor, Mattancherry coastal), south-Kerala Muslim pockets.

**Alliance behaviour 2026**: 49.2% UDF, 36.5% LDF, +6.5pp UDF swing, 40/48 UDF wins (83%).

**Notable**: largest, most UDF-dominant cohort. The textbook Muslim-belt UDF result.

**Multi-cycle** (TODO): is Sunni-cohort UDF stable, or oscillating?

---

### Salafi/Mujahid (n=14)

**Geography**: Concentrated north Kerala. Includes Mujahid-organisational strongholds in Malappuram interior, Kozhikode interior, possibly Kannur east.

**Alliance behaviour 2026**: 46.5% UDF, 36.5% LDF, +8.7pp UDF swing, 9/14 UDF wins (64%, **lowest of the two real cohorts**), 5 LDF wins.

**Notable**:
- Lower baseline UDF % than Sunni (37.8 in 2021 → 46.5 in 2026 is a big jump but from a smaller base).
- Higher LDF retention than Sunni — the bipartisan signal.

**Open question**: are the 5 LDF wins in geographic clusters, or scattered?

---

### Jamaat-e-Islami (n=0)

No AC has JIH as the dominant sub-sect at our threshold. JIH operates as an organisational network across many areas without dominating any single AC's mosque count. The Welfare Party of India (JIH's political vehicle) gets votes in select ACs but isn't geographically concentrated enough to flip a cohort.

**Note for walkthrough**: this is a finding in itself. Treat JIH as "organisationally distributed, not geographically dominant".

---

## Synthesis candidates

Three threads:

1. **"Sunni stability, Mujahid swing"** — UDF's 2026 Muslim-belt gains were a Sunni-stable + Mujahid-swung story. The headline UDF margin in Muslim Kerala disguises this split.

2. **"Two Muslim Keralas vote differently"** — Sunni Kerala is a UDF stronghold; Mujahid Kerala is competitive. IUML's organisational reach extends fully into Sunni areas but more lightly into Mujahid areas. Voter behaviour reflects this.

3. **"Mujahid is the swing voter"** — The 14 Mujahid ACs are the marginal seats in Muslim Kerala. Whoever wins Mujahid wins the Muslim-belt margin. In 2026, UDF won big in Mujahid (+8.7) but didn't sweep (5 LDF wins). In 2021, both were closer (regression hypothesis).

## Falsifiers / what would weaken the thesis

- **Mujahid cohort is geographically concentrated in 1-2 districts** — then "Mujahid swung" might just be "this specific cluster swung", and the mechanism could be local (anti-incumbency, candidate effects) rather than Mujahid-identity.
- **The 14 Mujahid ACs include several SC-reserved seats** — then the Mujahid-cohort label is misleading; those ACs are actually SC-Muslim joint areas, not pure Mujahid territory.
- **OSM Mujahid signal is too sparse** — Salafi/Mujahid mosques tend to be smaller and may be under-mapped relative to mainstream Sunni mosques (which are often larger physical landmarks). The Mujahid cohort might be capturing "low Muslim density + 1-2 Mujahid mosques" rather than genuine Mujahid majority.
- **2021 was anomalous for Mujahid** — if there was a one-off LDF push in Mujahid areas in 2021 (some local controversy), the +8.7 in 2026 is a single-cycle correction, not a structural difference.
- **Welfare Party vote redistribution** — if WPI got 5-10% in Mujahid ACs in 2021 but stood down in 2026, the UDF swing might just be absorbing WPI's vote share, not converting LDF voters.

## Open data needs / scripts to run

- [ ] **List ACs per Muslim cohort** — print AC name, district, Muslim share, UDF/LDF/NDA shares 2021/2026. Sanity-check cohort assignments. (`scripts/list-muslim-cohort-acs.ts`)
- [ ] **District clustering audit** — for each cohort, what fraction of ACs are in one district vs spread? If Mujahid=Malappuram-only, district FE problem.
- [ ] **Multi-cycle swing per cohort** — re-run cohort × UDF margin for 2011, 2016, 2021, 2026. Is the +8.7 Mujahid 2026 swing unusual vs cohort history?
- [ ] **Mujahid LDF-winner identification** — list the 5 LDF-winning Mujahid ACs by name/district/margin. Look for a common factor.
- [ ] **Welfare Party / SDPI / minor-Muslim-party share, per cohort, 2021** — did the minor parties cluster in Mujahid ACs in 2021? Did they disappear in 2026?
- [ ] **Swing R² for Muslim cohort** — extend Sprint 2's analysis script to compute Δ UDF R² for Muslim cohort vs Muslim share.
- [ ] **Sunni LDF-winner identification** — list the 7 LDF-winning Sunni ACs. Are they Muslim-minority ACs where Sunni is technically the dominant sub-sect but Muslim share is low?
- [ ] **OSM Mujahid coverage audit** — how many of the 14 Mujahid-cohort ACs have classified Muslim N ≥ 10 (vs 3-9)? Robustness check.
- [ ] **IUML / INC / WPI candidate breakdown by cohort** — did the UDF candidate in Mujahid ACs differ from the UDF candidate in Sunni ACs (party / muslim-identity / etc.)?

## Decisions log

- **2026-05-10**: draft seeded with Sprint 2 findings. Working thesis = Sunni-stable + Mujahid-swung. Next: AC drill-down + multi-cycle + minor-party vote redistribution check.
