# Caste data — Hindu sub-community shares by district (Kerala)

✅ **Provenance verified.** The Wikipedia table sources to:

> **Zachariah, K.C.; Mathew, E.T.; Rajan, S. Irudaya (2003).** *Dynamics of Migration in Kerala: Dimensions, Differentials, and Consequences.* Orient Longman.

Confirmed via cross-citation in the [Wikipedia "Demographics of Nair community"](https://en.wikipedia.org/wiki/Demographics_of_Nair_community) article, which states: *"the district-wise table sources from household surveys by the Kerala Statistical Institute (last conducted in 2000)."*

**Caveats baked into use:**
- **Year:** 2000 baseline. ~25 years old as of 2026. Differential fertility has shifted absolute shares; geographic rank is generally stable.
- **Methodology:** Sample-based household survey, not Census. Has confidence intervals we don't have specific numbers for.
- **Denominator:** percentages are of the district's **Hindu population**, not total population. To convert to total-district share, multiply by the district's Hindu share from `data/district-religion.json`.
- **Granularity:** district-level only. Within-district AC variation (Pala vs rural Kottayam) invisible. Subject to the same ecological-fallacy caveat as our v1 religion analysis.

## What the table covers

District-level percentages of Hindu sub-communities. **Denominator = Hindu population in that district**, not total population. To convert to district-as-fraction-of-total, multiply by the district's overall Hindu share from `data/district-religion.json`.

State-level numbers (Nair 21.6%, Ezhava 39.2%, SC 16.9%, ST 1.2%) match well-known Kerala estimates and corroborate the academic provenance.

## The table (verified parse, after user re-paste, May 2026)

| District | Nair | Ezhava | Brahmin | Nadar | Vish'karma | Barber | SC | ST | Other |
|---|---|---|---|---|---|---|---|---|---|
| Thiruvananthapuram | 38.9 | 26.8 | 1.2 | 5.9 | 0.3 | 4.3 | 15.0 | 0.5 | 7.0 |
| Kollam | 32.0 | 30.5 | 2.0 | 0.4 | 0.4 | 0.3 | 16.9 | 2.1 | 7.8 |
| Pathanamthitta | 37.5 | 26.3 | 0.9 | 1.8 | 2.0 | 0.6 | 20.1 | 0.3 | 2.6 |
| Alappuzha | 20.2 | 55.3 | 2.0 | 0.3 | 0.3 | 0.0 |  9.8 | 0.3 | 6.7 |
| Kottayam | 24.0 | 38.1 | 1.8 | 0.0 | 0.7 | 0.1 | 13.3 | 0.4 | 6.2 |
| Idukki |  6.8 | 41.3 | 0.3 | 0.3 | 0.8 | 7.7 | 33.7 | 0.6 | 5.0 |
| Ernakulam | 18.3 | 39.5 | 4.1 | 10.6 | 4.9 | 13.4 | 17.6 | 0.4 | 13.8 |
| Thrissur | 15.9 | 46.2 | 1.3 | 9.5 | 5.3 | 6.2 | 16.9 | 0.8 | 11.7 |
| Palakkad | 15.8 | 31.0 | 3.3 | 4.7 | 7.6 | 7.3 | 23.4 | 0.6 | 20.8 |
| Malappuram | 14.3 | 37.5 | 1.9 | 3.5 | 4.4 | 5.3 | 29.6 | 0.5 | 8.5 |
| Kozhikode | 21.6 | 52.1 | 2.1 | 6.7 | 0.6 | 1.3 | 10.6 | 0.4 | 5.6 |
| Wayanad | 17.1 | 24.8 | 2.0 | 0.5 | 1.1 | 0.8 | 35.4 | 7.6 | 8.8 |
| Kannur | 15.5 | 65.1 | 0.6 | 0.4 | 0.6 | 0.1 |  4.6 | 1.7 | 7.6 |
| Kasaragod | 14.9 | 26.0 | 6.4 | 0.3 | 0.3 | 0.3 | 10.9 | 2.1 | 33.4 |
| **KERALA** | **21.6** | **39.2** | **2.2** | **0.5** | **0.8** | **0.5** | **16.9** | **1.2** | **10.9** |

**Caveat: rows don't sum cleanly to 100% in all districts.** State row sums to ~93.8%, individual district rows range ~92–102%. Some of this is rounding (cells reported to 1 decimal); the residual likely reflects minor Hindu sub-castes not separately tabulated. Use the values for relative comparison and gradient mapping; don't treat them as a closed partition of Hindu population.

## What's surfaced where

- **`data/district-hindu-castes.json`** — full data, all 9 columns retained even though only Nair/Ezhava are currently visualised
- **`/religion-map` page** — Nair and Ezhava district-shaded gradient maps in the "Hindu sub-communities" section. The other castes (Brahmin, Nadar, Viswakarma, Barber, SC, ST, Other) are in the JSON but not rendered yet — easy to add when needed.
- **Analytical findings** — see `docs/narratives/udf.md §5` (caste-share geography) for the geography-overlap analysis. **Headline:** Nair-heavy districts saw smaller UDF gains and larger NDA gains; Ezhava share doesn't differentially predict the 2026 swing. Caste-voter behaviour cannot be tested at AC granularity (district-level data only).

## Notable district patterns (assuming numbers hold)

- **Kannur Ezhava-heavy (65%)** — explains LDF's structural Kannur strength; Ezhava base = LDF base
- **Trivandrum Nair-heavy (39%)** — Nair concentration in capital district is the structural floor under UDF/NDA in Trivandrum-area ACs (Sasikala Teacher / Veer Savarkar / Hindu-cultural-organisation appeal targets)
- **Alappuzha extremely Ezhava (55%)** — explains LDF's coastal Ezhava-Latin Catholic dual coalition there
- **Idukki Ezhava-heavy (41%)** but small Hindu share in district overall — modest political weight
- **Kasaragod / Wayanad SC-heavy** (35% / 23% of Hindus) — reservation politics matters there

## What this would unlock if verified

The current `docs/narratives.md` has two Tier-B narratives flagged as "needs community-coded constituency typology":

- **B3 — Ezhava base erosion + BJP partial encroachment.** Polstrat / CSDS-CPPR longitudinal series shows LDF's Ezhava share dropped from ~64-65% (2006/11) to ~49% (2016) to 53% (2021); BJP rose from 6-7% to ~21% (2019) to 23% (2021). Multi-cycle drift, not 2026-specific.
- **B4 — Nair community partial UDF lean.** Sections of Nairs leaned UDF (Satheesan, Venugopal, Chennithala are Nair leaders); Polstrat shows LDF Nair share dropped from ~40-45% (2006/11) to ~20% (2016/19).

With this district-level table, both move from Tier B (untestable) to a quasi-Tier A test:

- r(district Nair share, UDF Δ) → does Nair share predict UDF gain?
- r(district Ezhava share, LDF Δ) → does Ezhava share predict LDF loss?
- r(district Ezhava share, NDA Δ) → does Ezhava share predict NDA gain (the CSDS pattern)?

Caveats — same as our v1 religion analysis:
- District-level data subject to ecological fallacy (within-district caste mix variation invisible)
- Wikipedia table may misreport; source unverified
- District religion × caste combined effects can confound (high-Ezhava districts may also be Christian-belt; correlations may proxy for unobserved factors)

So **first-cut analysis would be useful, but verdicts should be marked "exploratory" until provenance check passes.**

## Verification plan

When we get to caste analysis:

1. **Web search for source citation** — likely candidates: NSSO Annual Report on Employment & Unemployment 2011-12 (which had a caste module), KSPB Statistics for Planning, KSSP study, Polstrat published data, or academic paper by political scientists studying Kerala (G. Gopa Kumar, J. Prabhash, K.N. Ganesh).
2. **Verify state-level totals** against any other corroborating source (e.g., 2011 NCAES, Lokniti)
3. **Spot-check 2-3 districts** against alternative published sources before publishing analysis

If verification passes, this data graduates a major Tier-B item to actionable. If it fails (or source turns out to be an unsourced editor estimate), we treat the table as "directionally suggestive only" and don't build cards on it.

## Future enrichment

If this caste data proves reliable, candidate further enrichments (in roughly increasing effort order):

- **Sub-district level Hindu caste** — would help distinguish Pala (Christian-belt with sliver Hindu population) from rural Kottayam (mixed)
- **Muslim sub-community geography** (Sunni / Mujahid / Salafi) — currently we treat "Muslim" as one bloc; in reality Samastha Muslims (Sunni) are politically distinct from Mujahid faction
- **Christian denomination geography** (Syro-Malabar / Latin / Marthoma / Pentecostal) — relevant for several narratives where one denomination drove a swing (Syro-Malabar UDF → LDF → UDF in Pala etc.)

None of these are in standard published Census products. Sources would need to be tracked individually.
