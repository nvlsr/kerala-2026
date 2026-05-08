# B3 + B4 — District-level Hindu caste-belt geography overlaps with alliance geography (exploratory)

> **⚠️ EXPLORATORY ONLY.** This card analyses caste data at *district* granularity assigned uniformly to all ACs within each district. It is structurally subject to ecological-fallacy: variation between caste-share and vote-swing at the AC level is bounded by district-level structure. The originally-posed B3 and B4 hypotheses — about Ezhava-base-erosion and Nair-UDF-lean as voter-behavior claims — cannot be tested at AC granularity from this data. The card re-poses them as geographic-overlap questions and reports what is observable under that weaker framing. Do not cite as evidence for caste-voter behavior.

**Verdict (geography-overlap framing): The geography of high Nair-share (concentrated in Trivandrum + adjacent districts) overlaps with the geography of NDA concentration (BJP's 3 wins, all in Trivandrum). District-level Nair share has a weak negative within-region association with UDF Δshare (β=-0.272, p=0.044 with region FE — see methodology). Ezhava-share-of-total has no detectable within-region association with any alliance Δ. Caste-voter behavior cannot be separated from regional clustering at this resolution: with caste data district-level only, district fixed effects absorb caste perfectly, leaving no within-district variation to test against.**

**Confidence: Exploratory** — district-level caste data + 25-year-old survey baseline + ecological-fallacy concerns make caste-voter behavior indistinguishable from regional clustering. Reframed as geography-overlap observation. Do not cite as evidence for caste-voter behavior at AC granularity.

This card uses Hindu sub-community data at **district level**, attributed uniformly to ACs within each district. The original framing tried to derive AC-level voter-behavior conclusions; this version reports only what the district-level resolution supports.

## The consensus claims

Both narratives appear in `docs/narratives.md` Tier B as "needs community-coded constituency typology that isn't yet available." Provenance check passed; the typology is now available (Zachariah 2003 / KSI 2000 survey). Reframing them as testable hypotheses:

**B3 — Ezhava base erosion.** *"Polstrat/CSDS-CPPR longitudinal series shows LDF's Ezhava share dropped from ~64-65% (2006/11) to ~49% (2016) to 53% (2021); BJP rose from 6-7% to ~21% (2019) to 23% (2021). Multi-cycle drift, not 2026-specific."*
- Implies: Ezhava-heavy ACs should have shown bigger LDF losses + bigger NDA gains in 2026
- Statistical test: r(Ezhava share, LDF Δ) < 0; r(Ezhava share, NDA Δ) > 0

**B4 — Nair community partial UDF lean.** *"Sections of Nairs leaned UDF (Satheesan, Venugopal, Chennithala are Nair leaders); Polstrat shows LDF Nair share dropped from ~40-45% (2006/11) to ~20% (2016/19)."*
- Implies: Nair-heavy ACs should have shown bigger UDF gains in 2026
- Statistical test: r(Nair share, UDF Δ) > 0

## What the data shows

### Correlations across 140 ACs

|  | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|
| **Nair share (% of total)** | **r = −0.27** | r = +0.09 | r = +0.13 |
| Ezhava share (% of total) | r = −0.02 | r = −0.02 | r = −0.05 |

**Direction-of-effect interpretation:**

- **Nair × UDF Δ: r = −0.27** — opposite of B4's prediction. Nair-heavy areas gained UDF *less* than Nair-light areas.
- **Nair × NDA Δ: r = +0.13** — mild but consistent. Nair-heavy areas gained NDA *more*.
- **Ezhava × LDF Δ: r = −0.02** — basically zero. Ezhava share doesn't predict LDF loss.
- **Ezhava × NDA Δ: r = −0.05** — basically zero. Ezhava share doesn't predict NDA gain either.

### Bins by Nair share

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Very high Nair (≥25%) | 14 (Trivandrum) | **+3.87pp** | -7.30pp | **+4.19pp** |
| High Nair (15-25%) | 16 | +5.88pp | -6.90pp | +2.04pp |
| Mid Nair (10-15%) | 43 | +6.96pp | -7.18pp | +1.81pp |
| Low Nair (<10%) | 67 | **+8.55pp** | -7.74pp | +1.77pp |

The Nair-share pattern is **monotonic and clear**: as Nair share drops, UDF gain rises (4pp → 9pp); NDA gain rises slightly the other direction. LDF lost ~7pp uniformly across all bins.

### Bins by Ezhava share

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Very high Ezhava (≥30%) | 20 | +7.57pp | -7.99pp | +1.37pp |
| High Ezhava (22-30%) | 26 | +6.81pp | -7.03pp | +1.24pp |
| Mid Ezhava (15-22%) | 65 | +7.31pp | -7.39pp | +3.07pp |
| Low Ezhava (<15%) | 29 | +7.47pp | -7.49pp | +0.98pp |

**Flat across bins.** Every Ezhava-share group saw similar LDF drop and UDF gain. The cycle-on-cycle Ezhava drift is invisible.

### District-level snapshot (sorted by Ezhava-share-of-total)

| District | Hindu% | Nair-of-total% | Ezhava-of-total% | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|---|---|
| Kannur | 59.8% | 9.3% | **38.9%** | +8.51pp | -9.10pp | +1.81pp |
| Alappuzha | 68.6% | 13.9% | 38.0% | +6.41pp | -6.63pp | +0.83pp |
| Kozhikode | 56.2% | 12.1% | 29.3% | +6.99pp | -7.28pp | +1.26pp |
| Thrissur | 58.4% | 9.3% | 27.0% | +6.64pp | -6.77pp | +1.22pp |
| Palakkad | 66.8% | 10.5% | 20.7% | +5.93pp | -5.85pp | +0.34pp |
| Idukki | 48.9% | 3.3% | 20.2% | **+11.38pp** | **-12.94pp** | +2.36pp |
| Kollam | 64.4% | 20.6% | 19.6% | +6.11pp | -7.24pp | +2.09pp |
| Kottayam | 49.8% | 12.0% | 19.0% | +8.81pp | -9.35pp | +5.53pp |
| Ernakulam | 46.0% | 8.4% | 18.2% | +10.48pp | -5.68pp | +3.71pp |
| Thiruvananthapuram | 66.5% | **25.9%** | 17.8% | **+3.87pp** | -7.30pp | **+4.19pp** |
| Pathanamthitta | 56.9% | 21.3% | 15.0% | +5.37pp | -6.17pp | +1.95pp |
| Kasaragod | 55.8% | 8.3% | 14.5% | +6.67pp | -5.81pp | -0.33pp |
| Wayanad | 49.5% | 8.5% | 12.3% | +4.22pp | -8.26pp | +4.67pp |
| Malappuram | 27.6% | 3.9% | 10.4% | +8.98pp | -8.28pp | +0.40pp |

Kannur is the most Ezhava-heavy district (39%) and shows a *typical* swing for the state (UDF +8.5, LDF -9.1, NDA +1.8). Idukki and Ernakulam, which are *moderate* on Ezhava, show the *biggest* UDF gains. Trivandrum, the most Nair-heavy district, shows the *smallest* UDF gain and the *biggest* NDA gain.

## The opinionated reframe (geography-overlap, not voter-behavior)

> **The geographic clustering of caste data complicates voter-behavior inference at the resolution available here. The visible pattern: ACs in high-Nair-share districts (concentrated in Trivandrum + adjacent) had smaller UDF gains and larger NDA gains than ACs in lower-Nair-share districts. But "high Nair share" and "Trivandrum geography" are nearly identical at district granularity — "Nair voters behaved differently" cannot be separated from "Trivandrum voters behaved differently for non-Nair reasons" using this data. Ezhava-share variation is not detectable as predictive of any alliance Δ.**

The press framing — that Ezhava-base-erosion explains LDF's collapse and Nair-UDF-lean explains UDF's gains — implies AC-resolution voter-behavior claims. The data does not support those claims at AC resolution because the catalog has only district-level caste shares. The visible patterns are at the district level and are confounded with all other district-level dynamics.

Restated for the catalog:
- **B3 (Ezhava drift)**: not visible as a 2026-cycle effect at the AC resolution available here. May be true longitudinally (per Polstrat/CSDS) but doesn't show up in this swing.
- **B4 (Nair UDF lean)**: under the geography-overlap framing only, Nair-heavy *districts* showed smaller UDF gains. Cannot be ascribed to Nair voters specifically; it could equally be a Trivandrum-region effect.

## Robustness check — region fixed effects

Adding region fixed effects (3 regions: North / Central / South Kerala) to the simple Pearson r:

| Test | No controls | + region FE | Notes |
|---|---|---|---|
| Nair × UDF Δ | β=-0.222, p=0.002 | β=-0.272, p=0.044 | Survives region FE (just) |
| Nair × NDA Δ | β=+0.102, p=0.114 | β=+0.072, p=0.562 | Doesn't hold |
| Ezhava × UDF Δ | β=+0.005, p=0.927 | β=+0.015, p=0.803 | No effect either way |
| Ezhava × NDA Δ | β=-0.023, p=0.638 | β=-0.018, p=0.738 | No effect either way |

District FE absorbs caste perfectly (caste is district-constant in this dataset), so the within-district test cannot be run. The region-FE result is the strictest control available.

**Reading:** the Nair-UDF inverse association is weakly supported under region controls (p just under 0.05). The Nair-NDA association doesn't hold once region is controlled. Neither result is robust enough to ground a voter-behavior claim — they're consistent with the geography-overlap reading: Nair-heavy districts (mostly Trivandrum) had smaller UDF gains, possibly for caste reasons but possibly for the many other things that distinguish Trivandrum (urbanization, BJP organisational strength, candidate selection, government-employee concentration).

## What this directly shows / what it cannot prove / what would weaken the conclusion

### What this directly shows

- District-level Nair-share is negatively associated with UDF Δshare (simple r=-0.27). Under region FE the association is β=-0.272, p=0.044. Under district FE it cannot be tested (caste constant within district).
- Trivandrum district (highest Nair share, 25.9% of total population) has the smallest UDF Δshare mean (+3.87pp) and largest NDA Δshare mean (+4.19pp).
- Ezhava-share variation has no detectable association with any alliance Δ.

### What this does NOT prove

- **Nair voters behaved differently than non-Nair voters.** The data is district-level. Nair-voter behavior cannot be disentangled from Trivandrum-region effects (urbanization, BJP organizational strength, government-employee base, etc.) at this resolution.
- **Ezhava voters didn't shift.** The Polstrat/CSDS multi-cycle Ezhava-erosion narrative may be true; this single-cycle test doesn't directly contradict it. The drift may have plateaued, or may operate at sub-AC granularity invisible to district-level data.
- **Caste-bloc voting is not a feature of Kerala 2026.** This resolution can't detect it. Survey-microdata work could find caste differences within districts that are invisible here.

### What would weaken (or strengthen) this conclusion

- **AC-resolution caste data** (NSSO microdata, recent surveys) would permit testing caste effects directly within districts. Highest-priority resolution upgrade.
- **Multi-cycle longitudinal test** with 2011/2016/2021/2026 caste-vs-vote correlations — would distinguish "caste drift exists historically but stalled" from "caste drift never existed at AC resolution."
- **Sub-community resolution within "Nair"** — Nairs aren't a unified bloc (sub-community identity, NSS organisational membership, etc. matter politically). Currently treated as a single category.
- **Replication in a different election context** — same caste-share-vs-swing patterns appearing in 2031 or earlier cycles would suggest structural caste-belt effects, even if individual cycle tests are noisy.

## Methodology + limitations

- **Source**: Zachariah, Mathew & Rajan (2003) "Dynamics of Migration in Kerala," based on Kerala Statistical Institute household survey, 2000.
- **Granularity**: district-level (14 districts). Each AC inherits its district's caste mix uniformly. Within-district variation is invisible.
- **Year staleness**: 2000 baseline, ~25 years old. Geographic rank order is likely stable; absolute shares may have drifted.
- **Sample variance**: household survey, not census. Confidence intervals not computed for the original survey shares.
- **Hindu-only**: doesn't speak to Muslim sub-community or Christian denomination — those need separate sources not currently available.

## Cross-references

- **A3 (BJP's 3 wins)**: all 3 BJP wins are in the Nair-heavy Trivandrum belt. A3 finds the BJP-share × Hindu-share gradient weakens under district FE; B3+B4 finds the parallel Nair-share × UDF-Δ gradient survives barely under region FE. Both are consistent with "Trivandrum-region effect" rather than "religion-share or caste-share gradient."
- **A1 (minority consolidation)**: A1's Christian-belt UDF premium *survives* district FE (within-district Christian variation predicts UDF gain). B3+B4's caste effects do not (caste constant within district). The religion finding is causally tighter; the caste finding is a geographic-overlap observation.

## Reproduce

`bun run scripts/narrative-b3b4-caste.ts` — uses `data/hindu-caste-by-district.json` + `data/demographics.json` + 2021/2026 candidate data. Regression results from `python3 scripts/narrative-regression.py`.
