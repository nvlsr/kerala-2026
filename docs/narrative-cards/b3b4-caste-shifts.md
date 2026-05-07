# B3 + B4 — Did caste-bloc voting drive 2026's swing?

**Verdict: Both narratives are wrong as stated. The Nair-UDF-lean (B4) reverses — Nair-heavy areas saw SMALLER UDF gains because more of the LDF loss went to NDA. The Ezhava-base-erosion (B3) isn't detectable as a 2026 cycle-specific signal — Ezhava-heavy ACs swung the same as everywhere else.** The post-mortem framing of "Hindu sub-community shifts" doesn't map cleanly to the observed swing pattern. What does map: the same Hindu sub-community geography (Nair-heavy Trivandrum) where BJP's three wins concentrated.

This card uses Hindu sub-community data at **district level**, attributed to ACs. Subject to ecological-fallacy caveats. See "Methodology" at the bottom.

## The consensus claims

Both narratives appear in our `docs/narratives.md` Tier B as "needs community-coded constituency typology that we don't have." Provenance check passed; we have the typology now (Zachariah 2003 / KSI 2000 survey). Reframing them as testable hypotheses:

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

## The opinionated reframe

> **The "Hindu sub-community shifts" framing applies to ONE geography only — Nair-heavy Trivandrum, where BJP's three 2026 wins concentrated. There, the LDF→NDA channel was bigger than the LDF→UDF channel, producing a smaller UDF gain than elsewhere. Outside Trivandrum, neither Nair share nor Ezhava share carries differential signal: the LDF collapse and UDF reward followed religion (Christian-belt premium), not caste.**

Restated for the catalog:
- **B3 (Ezhava drift)**: not visible as a 2026-cycle effect. May be true longitudinally (per Polstrat/CSDS) but doesn't show up in this swing. If continuing, it's happening at the same uniform state pace.
- **B4 (Nair UDF lean)**: reverses for 2026. Nair-heavy = smaller UDF gain because BJP captured more of the LDF defectors there. The "Nair drift" framing should be **Nair → NDA** in the Trivandrum belt, not "Nair → UDF" generically.

## Why the BJP-3-wins point matters here

All three BJP 2026 wins are in **Trivandrum district** (Nemom, Kazhakoottam, Chathannoor — Chathannoor is technically Kollam district adjacent to TVM). The Nair-share-correlation finding gives the structural explanation: a Nair-heavy belt where Hindu consolidation toward BJP can outpace UDF's residual gains. **A3 (BJP's 3 wins concentration) and B3/B4 are the same finding viewed from two angles.**

## Methodology + limitations

- **Source**: Zachariah, Mathew & Rajan (2003) "Dynamics of Migration in Kerala," based on Kerala Statistical Institute household survey, 2000.
- **Granularity**: district-level (14 districts). Each AC inherits its district's caste mix. Same ecological-fallacy concern as our v1 religion analysis: within-district AC variation in caste mix is invisible.
- **Year staleness**: 2000 baseline, ~25 years old. Geographic rank should be stable; absolute shares may have drifted.
- **Sample variance**: household survey, not census. Has confidence intervals we don't have specific numbers for.
- **Hindu-only**: this table doesn't speak to Muslim sub-community (Sunni/Mujahid/Salafi) or Christian denomination (Syro-Malabar/Latin/Marthoma/Pentecostal) — those need separate sources we don't have.
- **The Nair r = −0.27 is moderate.** Statistical confidence is meaningful (n=140) but causal claim is weak: high-Nair districts also have high Hindu share overall (66% in TVM vs 54% statewide), so the negative Nair-vs-UDF correlation could be partially the negative Hindu-vs-UDF correlation we already saw.

## Cross-checks that would strengthen this verdict

- AC-level caste data (would need NSSO/NCAES microdata or a more granular published source)
- Multi-cycle test (B3's claim is multi-cycle; we tested only 2021→2026): correlate Ezhava share with cumulative 2011→2026 LDF share change. If the drift exists historically but stalled by 2026, that'd reconcile our finding.
- Multivariate regression — if we control for Hindu share + Christian share simultaneously, does Nair-share have residual explanatory power?

## Reproduce

`bun run scripts/narrative-b3b4-caste.ts` — uses `data/hindu-caste-by-district.json` + `data/demographics.json` + 2021/2026 candidate data.
