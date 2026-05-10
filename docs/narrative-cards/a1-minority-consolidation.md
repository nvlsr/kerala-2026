# A1 — Did "minority consolidation" really drive UDF's 2026 sweep?

**Verdict (v2, AC-level): the "Muslim + Christian as one consolidating bloc" framing doesn't hold at the constituency level. Christian-heavy ACs show a robust UDF coalition-share premium of ~3-4pp above the Hindu-majority baseline (survives district fixed-effect controls; β = +0.19, p = 0.008). Muslim-share variation does not predict differential UDF swing — Muslim-heavy ACs largely tracked the statewide ~7pp anti-LDF trend with no detectable additional Muslim-concentration premium. LDF's collapse was uniform across religion mix.** The press framing pooled the two religions into one bloc story; only the Christian half exhibits a constituency-level differential. The Muslim half is consistent with generic anti-incumbency.

**Confidence: Strong** — Christian-share gradient survives district fixed effects (p<0.01); KC(M) sub-mechanism quantified at ~12% of premium; multiple robustness checks (reserved-seat exclusion, KC(M) stripping) confirm headline.

> **A note on inference:** This card analyses constituency-level patterns, not voter-level behaviour. The data shows that Christian-heavy ACs swung more strongly to UDF; individual Christian voters' choices are not directly observable. Causal language ("Christian voters shifted") is shorthand for the constituency-level pattern; the underlying mechanism could be any of (a) cross-community voter switching, (b) differential turnout, (c) candidate-personality effects, (d) sub-community dynamics within "Christian", or (e) some combination. Survey microdata could resolve which. See `methodology-core-concepts.md` for the catalog's standing convention on constituency-level vs voter-level inference.

This card has two versions of the verdict. The original district-level analysis (still useful as a methodology demonstration) is preserved at the bottom. **The current verdict above uses AC-level religion data**, built by joining SHRUG's `shrid → AC` keys against Census 2011 Table C-01 (sub-district + town religion shares) — see `scripts/build-ac-demographics.py`.

**Baseline:** Numbers below use the **2025 projection** (Census 2011 + state-level cohort multipliers from CRS births-by-religion, applied uniformly per AC and renormalised). The choice between 2025 and the raw 2011 baseline moves correlations by ≤0.01 — uniform multipliers preserve rank order — but 2025 is reality-aligned for absolute-share statements ("Vengara is 85% Muslim") and external cross-checks. Re-run with `--baseline-2011` for the pre-projection numbers; the verdict is identical.

**Unit:** Unless otherwise noted, bin means and correlations below are constituency-equal — each AC counts once, regardless of turnout. Statewide aggregate vote-share figures are vote-weighted. The unit of analysis is the constituency, not the individual voter.

## The consensus claim

Six post-mortems (Federal, Quint, Outlook, ToI, NIE, Lokniti baseline) converged on this story:

> Lokniti-CSDS 2021 had recorded ~40% of Muslims and Christians voting LDF — peak Left support among minorities. The 2026 verdict reversed that decisively: UDF swept all seats in Idukki, Ernakulam, Wayanad, Malappuram, and Kottayam — the Christian-Muslim heartland — and IUML won 22 of 27 contested seats (81% strike rate). Multiple sources describe the shift in Muslim and Christian-majority pockets as "near total."

If correct, the data should show (a) substantially stronger UDF growth in high-minority districts vs Hindu-majority ones, and (b) substantially deeper LDF losses in those same minority districts. The narrative treats Muslim-share and Christian-share as one consolidating bloc.

## What the AC-level data shows

### Correlations across 140 ACs (AC religion shares × per-AC alliance Δ)

|  | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|
| Muslim share | r = **-0.01** | r = +0.04 | r = -0.09 |
| Christian share | r = **+0.20** | r = -0.05 | r = +0.07 |
| Hindu share | r = -0.21 | r = -0.00 | r = +0.05 |
| (Muslim + Christian) | r = +0.21 | r = +0.00 | r = -0.05 |

When religion share is measured at the AC level (instead of broadcast from district), the picture sharpens:

- **Christian share's correlation with UDF gain nearly doubled** (district: +0.11 → AC: +0.20). Substantively meaningful.
- **Muslim share's correlation drifted to near zero** (district: +0.07 → AC: -0.01). No detectable relationship at the AC level.
- The pooled "minority share" signal (+0.21) is **entirely the Christian half** — the Muslim half is consistent with no additional Muslim-concentration premium beyond the statewide trend.

### Mean swings by Christian-share bin

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Christian-majority (≥50%) | 2 | **-2.28pp**¹ | -6.27pp | **+9.78pp** |
| Christian-heavy (30–50%) | 32 | **+10.40pp** | -7.99pp | +2.61pp |
| Christian-mid (15–30%) | 37 | +6.95pp | -6.94pp | +0.92pp |
| Low Christian (<15%) | 69 | +6.30pp | -7.46pp | +2.18pp |

¹ The 2 Christian-majority ACs are PALA (52% C) and ANGAMALY (65% C). They split very differently — Angamaly +8.3pp UDF (clean swing), Pala -12.9pp UDF / +18.2pp NDA (Mani C. Kappan / NCP / KC(M) churn unrelated to religion). The bin mean reflects this.

The Christian-heavy 30–50% bin is the headline finding: **+10.40pp UDF gain across 32 ACs**, vs +6.30pp in low-Christian seats. A clean **4.10pp differential** attributable to Christian-share — the actual signal "minority consolidation" was pointing at.

### Mean swings by Muslim-share bin

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Muslim-majority (≥60%) | 16 | +8.98pp | -8.28pp | +0.40pp |
| Muslim-heavy (40–60%) | 23 | +5.76pp | -6.83pp | +2.22pp |
| Muslim-mid (20–40%) | 44 | +7.80pp | -7.39pp | +1.95pp |
| Low Muslim (<20%) | 57 | +7.03pp | -7.46pp | +2.53pp |

Muslim-majority ACs gained UDF +8.98pp — slightly above the statewide ~7pp trend, but not dramatically. The 40–60% Muslim bin gained *less* than the low-Muslim bin (+5.76pp vs +7.03pp). **No monotonic relationship between Muslim share and UDF gain is detectable in this data.** Muslim-heavy seats largely tracked the statewide trend.

The "Muslim consolidation" framing in coverage implies a Muslim-share-mediated extra premium for UDF in Muslim-heavy seats; no such premium is detectable at the constituency level. This is consistent with several mechanisms (ceiling effects in already-pro-UDF Muslim areas, IUML's strong incumbency flattening swing variation, turnout effects rather than switching) — the data shows that the *gradient* isn't there, not which mechanism explains its absence.

### Pala and the limit of correlation analysis

Looking at the top-10 most-Christian ACs, individual seats show very different swings:

| Seat | Christian% | UDF Δ | LDF Δ | NDA Δ | Notes |
|---|---|---|---|---|---|
| ANGAMALY | 64% | +8.3 | -8.6 | +1.3 | Clean swing |
| **PALA** | 52% | **-12.9** | -4.0 | **+18.2** | Mani C. Kappan / NCP / KC(M) churn |
| PUTHUPPALLY | 49% | +17.8 | -16.8 | +0.2 | Massive UDF consolidation |
| **UDUMBANCHOLA** | 48% | **+22.6** | -24.6 | +2.7 | Largest Christian-belt swing |
| **THIRUVALLA** | 48% | +1.6 | -14.6 | **+14.5** | LDF crater + JD(S) winner / fragmentation; NDA caught the residue |
| IDUKKI | 47% | +12.0 | -10.9 | +0.3 | Clean swing |
| RANNI | 47% | +4.1 | -0.4 | -0.7 | Stable / minimal swing |
| ETTUMANOOR | 45% | +17.5 | -10.0 | -0.3 | Devaswom Minister Vasavan lost — Sabarimala backlash visible |

The Christian-belt narrative holds across most ACs but **two outliers (Pala, Thiruvalla) account for ~18pp of NDA gain in this top-10 alone**. Both reflect non-religious local dynamics: Pala's NCK/KC(M) coalition churn and Thiruvalla's three-way fragmentation with a JD(S) winner. Strip those two and the Christian-belt → UDF story is even cleaner than the bin means suggest.

For the top-10 Muslim ACs, the picture is different: 9 of 10 show strong LDF→UDF swings (UDF +5 to +14pp); only Vengara saw LDF gain. But this is mostly **incumbent IUML strongholds** holding ground — IUML's strike rate of 22/27 reflects its existing base, not new consolidation.

## The opinionated reframe (v2)

> **Anti-incumbency reduced LDF's vote share ~7pp uniformly across the religion-mix gradient. The "minority consolidation" story splits into two distinct phenomena at AC level: a ~3-4pp Christian-belt UDF premium concentrated in central Kerala (Syro-Malabar dioceses + Idukki Christian highlands + Pathanamthitta + Kottayam), and no detectable additional Muslim-share-mediated premium beyond the statewide trend. The press framing — pooling Muslim + Christian as one consolidating bloc — combines a real Christian-belt signal with a non-finding on the Muslim side and labels the average "minority consolidation."**

The Christian-share differential is real and substantial. The Muslim-share differential is consistent with no additional concentration premium.

## What the new resolution unlocked

Moving from district-level to AC-level religion data wasn't just a refinement — it changed the verdict's character. Three things became visible:

1. **The Christian effect was twice as strong as previously measurable.** District averages diluted the signal; once resolved at AC level (with PALA at 52% C distinguishable from rural Kottayam at 30% C), the correlation jumped from +0.11 to +0.21.
2. **The Muslim effect went from "weak" to "absent."** Same disaggregation, opposite direction. Within Malappuram district, Muslim shares vary from 70% (Malappuram AC) to 83% (Vengara) to 79% (Tirurangadi) — and their UDF swings vary from +3.2 to +14.1pp. The Muslim share doesn't predict the swing.
3. **Outliers became identifiable.** Pala's UDF -12.9pp and Thiruvalla's NDA +14.5pp are now correctly placed in their actual religion context (both are 48–52% Christian seats with non-religious local dynamics), instead of being averaged into Kottayam/Pathanamthitta district means.

## Notable outliers

| Seat | District | Christian% | Muslim% | UDF Δ | LDF Δ | What's going on |
|---|---|---|---|---|---|---|
| 93 PALA | Kottayam | 52% | 10% | **-12.9pp** | -4.0pp | NCK / Mani C. Kappan / KC(M) churn |
| 78 PARAVUR | Ernakulam | (urban-fallback) | — | -2.3pp | -1.8pp | Latin Catholic coastal — Munambam Waqf effect |
| 111 THIRUVALLA | Pathanamthitta | 48% | 4% | +1.6pp | **-14.6pp** | NDA +14.5pp — Sabarimala-route + JD(S) winner |
| 41 VENGARA | Malappuram | 0% | 85% | +3.2pp | **+8.5pp** | Only Muslim-majority seat where LDF GAINED |
| 89 UDUMBANCHOLA | Idukki | 48% | 4% | **+22.6pp** | -24.6pp | Largest single-seat Christian-belt swing |

These outliers are no longer "explained away" by district-mean averaging — they sit visibly outside the trend at AC resolution.

## Methodology & limitations

### What changed in this version
- **Religion data resolution**: 14 districts → 114 AC-level + 26 district-fallback (urban-heavy ACs).
- **Source**: Census 2011 Table C-01 (religion at sub-district + town level) joined to SHRUG's `shrid → AC` mapping with population-weighted aggregation.
- **State aggregate sanity check**: Recomputed from AC-level 2025-projection data = Hindu 52.2% / Muslim 29.0% / Christian 18.7%. Cohort-projection target (state-level CRS-derived): 52.5% / 29.7% / 17.9%. Within 1pp on all three, confirming both the per-AC application of state multipliers and the renormalisation step. The raw 2011 baseline likewise checks out: AC-aggregate 53.8% / 26.8% / 19.1% vs Census state totals 54.7% / 26.6% / 18.4%.

### What this data still cannot determine
- **26 ACs (mostly major urban — Trivandrum city, Cochin, Kozhikode city, Alappuzha) fall back to district-level religion** because SHRUG's spatial join failed for those urban shrids. Population coverage of AC-level data: 27.0M of Kerala's 33.4M (~80%). Re-running the analysis on AC-only ACs (n=114) gives: Christian r=+0.22, Muslim r=-0.04 — so the headline finding holds in the strict subset.

### Robustness check — excluding SC/ST reserved seats

Reserved seats (14 SC + 2 ST = 16 of 140) have structurally different dynamics: only SC/ST candidates contest. Reserved seats correlate with high-Hindu/low-minority districts which could confound the religion × vote-swing correlation measured here.

Re-running with `bun run scripts/narrative-a1-ac-level.ts --exclude-reserved` (n=124):

| | All 140 | n=124 (excl. reserved) |
|---|---|---|
| Christian × UDF Δ | r = +0.20 | r = **+0.22** (slightly stronger) |
| Muslim × UDF Δ | r = -0.00 | r = -0.04 (still ~zero) |
| Muslim + Christian × UDF Δ | r = +0.22 | r = +0.21 (essentially same) |

The Christian-belt premium **strengthens slightly** when reserved seats are dropped (consistent with reserved seats being concentrated in low-Christian Hindu-majority districts that contribute little to the gradient). The Muslim non-finding holds. **A1's verdict is robust to reserved-seat exclusion.**

### Robustness check — district fixed effects (the geographic-clustering test)

The simple Pearson r could partly reflect Central-Kerala regional clustering rather than within-district Christian-share variation. To isolate the within-district effect, OLS with district fixed effects on `udf_delta ~ christian + muslim + udf21 + district_FE` is run (see `scripts/narrative-regression.py`):

| Predictor | No controls | + region FE | + district FE |
|---|---|---|---|
| Christian share | β = +0.225 *** | β = +0.223 *** | β = **+0.194** *** (p=0.008) |
| Muslim share | β = +0.160 *** | β = +0.116 *** | β = +0.016 (p=0.795) |
| Prior UDF share | β = -0.273 *** | β = -0.282 *** | β = -0.337 *** |

**The Christian effect survives district FE at p<0.01.** The coefficient drops by ~14% (+0.225 → +0.194) — meaning roughly a seventh of the simple-Pearson signal was between-district clustering, but the within-district variation still carries a robust effect. Within a given Kerala district, ACs with higher Christian share showed larger UDF gains.

**The Muslim effect collapses entirely under district FE** (β=+0.016, p=0.795). The simple-Pearson signal was driven by between-district variation (specifically Malappuram clustering). Within a given district, Muslim share has no detectable predictive power for UDF Δ. This *strengthens* the card's existing finding ("Muslim share doesn't predict differential swing") — the within-district test is the cleaner test, and it confirms.

**The LDF × Christian relationship doesn't survive district FE either** (simple p=0.020 → district-FE p=0.993). The press framing implied LDF lost more in Christian-heavy seats; the data shows that's a between-district artifact. Within a given district, Christian share doesn't predict LDF Δ — LDF lost ~7pp uniformly.

### Robustness check — KC(M) base movement

Christian-heavy seats include 12 ACs where Kerala Congress (M) (Jose K. Mani's faction, alliance-tagged LDF) contested both 2021 and 2026. KC(M)'s mean party-share dropped from 41.2% to 34.4% in those ACs (~7pp decline). To check whether the Christian-belt UDF premium is a genuine cross-community shift or partly KC(M)-specific churn, alliance shares are recomputed with KC(M) candidates excluded from both years (`scripts/narrative-a1-no-kcm.py`):

| Christian-heavy bin (n=32) | Original | KC(M)-stripped |
|---|---|---|
| Mean UDF Δ | +10.40pp | +9.71pp |
| Premium vs statewide | +3.11pp | +2.74pp |

**About 12% of the Christian-belt UDF premium is mechanically attributable to KC(M)-specific dynamics; ~88% remains as a non-KC(M) signal.** In the 12 KC(M)-active ACs specifically, UDF gain closely tracks KC(M) loss (e.g., Idukki: KC(M) -10.88pp, UDF +12.02pp) — consistent with KC(M)'s base partially migrating to UDF (a behavioral story, but one specific to that party's voters). In the 22 non-KC(M) Christian-heavy ACs, a smaller residual UDF surge persists.

A clarification on alliance accounting: KC(M) was alliance-tagged LDF in *both* 2021 and 2026 in this dataset (not 2021-LDF then 2026-UDF as some commentary suggested — that was the 2016→2020 switch, which preceded this cycle comparison). So there's no alliance-relabel artifact in the alliance-Δ figures; the KC(M) effect detected is voter base movement, not bookkeeping. See `methodology-core-concepts.md` § "KC(M) handling".

- **Sub-community shifts** within "Christian" (Syro-Malabar vs Latin vs Marthoma) and "Muslim" (Sunni vs Mujahid) — not observable from C-01. The Christian-belt premium might be concentrated in one denomination (e.g., Syro-Malabar Catholics) rather than uniformly distributed.
- **Mechanism remains underdetermined**: a +10pp UDF gain in Christian-heavy ACs is consistent with several mechanisms — voter switching from LDF/independents to UDF, differential turnout (Christian LDF voters staying home), Christian non-voters mobilising for UDF, KC(M)-base defection (partially documented above), or some combination. AC-level vote totals can't distinguish these; survey microdata could.
- **Projection vs raw 2011**: This catalog defaults to a 2025 projection (Census 2011 base × state-level CRS-derived cohort multipliers, applied uniformly per AC). Because the multipliers are uniform statewide, **rank order is preserved exactly** and Pearson correlations shift by at most 0.01 vs the raw 2011 baseline — both bases produce the same A1 verdict. 2025 is reality-aligned for absolute-share statements; the raw 2011 base is available via `--baseline-2011`.
- **Sub-state demographic drift**: The cohort projection assumes Kerala's geographic religion distribution shifted uniformly between 2011 and 2025. This is a strong assumption — Malappuram likely grew its Muslim share faster than the state average, and central Travancore likely lost Christian share faster. No district-level or AC-level CRS data is currently available to refine this. Absolute shares in any single AC may be off by a few pp in either direction.

## What this directly shows / what it cannot prove / what would weaken the conclusion

### What this directly shows

- Christian-heavy ACs (30-50% Christian, n=32) gained UDF coalition share by ~3-4pp more than the statewide ~7pp anti-LDF baseline.
- Within a Kerala district, ACs with higher Christian share systematically swung more strongly to UDF (district-FE robust at p<0.01).
- Within a Kerala district, Muslim share has no detectable relationship with UDF Δ.
- LDF lost ~7pp uniformly across the religion-mix gradient.
- The 12 KC(M)-active ACs show ~1:1 transfer of KC(M) loss to UDF gain.

### What this does NOT prove

- **Christian voters individually shifted from LDF to UDF.** This card observes constituency-level patterns, not voter-level behaviour. The constituency premium is consistent with voter switching, but also with differential turnout, candidate-personality effects, sub-community dynamics, or a combination.
- **No Muslim consolidation occurred.** Absence of cross-sectional gradient is not absence of voter consolidation. Muslim voters may have moved to UDF without producing constituency-level variation (ceiling effects, IUML incumbency flattening, turnout dynamics). What the data shows: Muslim *share* does not predict differential UDF swing.
- **The Christian-belt premium is uniformly Syro-Malabar-driven.** Sub-community denominations (Syro-Malabar vs Latin Catholic vs Marthoma vs Pentecostal) are not disaggregated in this dataset. The same +3-4pp could mask very different intra-Christian patterns.
- **The KC(M) defection is a "Catholic Church to UDF" story.** It's specifically Jose K. Mani's KC(M) base movement; party-personality effects vs religion-effects can't be separated here.

### What would weaken this conclusion

- **Booth-level survey data showing Christians voted similarly across LDF/UDF in 2026.** Would suggest the constituency-level premium is driven by non-Christian voters in those ACs rather than Christians themselves.
- **Sub-community-resolved religion data revealing the premium is a Latin Catholic Munambam-Waqf story rather than a generic Christian one.** Would shift the interpretation from "Christian-belt consolidation" to "Latin Catholic specific reaction."
- **Multi-cycle confirmation in 2031.** If the Christian-belt premium reverts, the 2026 effect was cycle-specific (anti-incumbency manifestation channeled through the Christian belt) rather than structural (durable Christian re-alignment).
- **Replication of the KC(M)-stripped null finding with a more sophisticated counterfactual.** The exclude-from-numerator-and-denominator method used here has a degenerate case for LDF where KC(M) was the only major LDF candidate. A regression that partials out KC(M) Δ as a predictor of UDF Δ would be more rigorous.

## Next narrative cards (related)

- **A2 — Sabarimala-route Hindu backlash**: Tested separately. The "geographic Sabarimala route" hypothesis didn't survive — see `a2-sabarimala-route.md`.
- **A3 — BJP's 3 wins in Trivandrum**: Tested separately. Concentration thesis confirmed for the 3 wins; gradient claim weakens under district FE — see `a3-bjp-three-wins.md`.

---

# Appendix — Original district-level analysis (v1)

Preserved for methodology comparison. The verdict shifted meaningfully when the analysis moved to AC-level data; the v1 framing called the narrative "partially supported but substantially overstated." The v2 framing identifies two distinct patterns where the press treats one — Christian-share differential is real, Muslim-share differential is consistent with no premium beyond statewide trend.

### v1 correlations (district religion shares × per-AC alliance Δ)

|  | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|
| Muslim share (district) | r = +0.07 | r = -0.02 | r = -0.19 |
| Christian share | r = +0.11 | r = -0.06 | r = +0.23 |
| Hindu share | r = -0.24 | r = +0.10 | r = +0.02 |
| (Muslim + Christian) | r = +0.24 | r = -0.10 | — |

### v1 bins (combined minority share)

| Bin | n | UDF Δ | LDF Δ |
|---|---|---|---|
| Very high minority (≥60%) | 16 | +8.98pp | -8.28pp |
| High (50–60%) | 19 | +10.71pp | -7.59pp |
| Mid-high (40–50%) | 48 | +6.86pp | -7.32pp |
| Mid (33–40%) | 34 | +6.82pp | -7.35pp |
| Low / Hindu-heavy (<33%) | 23 | +4.87pp | -7.04pp |

### Why v1 understated

The v1 numbers were blunted by ecological-fallacy attribution: every AC in Malappuram got the same 70% Muslim label, every AC in Kottayam got the same 49% minority label. Within-district variation (PALA at 52% Christian vs surrounding rural-Kottayam at 30% Christian) was invisible. AC-level data brought it into focus — and showed that the Christian half of the "minority bloc" was carrying the entire signal.

## Sources cross-checked

The Federal (5 May 2026), The Quint (May 2026), Outlook (May 2026), Times of India (May 2026), New Indian Express (Jan 2026 pre-poll), Lokniti-CSDS Kerala 2021 post-poll, The Print on Lokniti (2021).

## Reproduce

- AC-level analysis: `bun run scripts/narrative-a1-ac-level.ts`
- AC demographics build: `python3 scripts/build-ac-demographics.py` (requires `data/shrug/` from DDL + `data/raw/census-c01/DDW32C-01-MDDS.XLS` from censusindia.gov.in)
- Original district-level analysis: `bun run scripts/narrative-a1-minority-consolidation.ts`
