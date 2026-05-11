# LDF — findings reference

**Audience**: future analysis (agent + author). Page version at `/walkthroughs/ldf-walkthrough`. This file is the deeper analytical reference — methodology, mitigation tests, full data tables, source pointers.

**Sources consolidated**: `a2-sabarimala-route.md` + `a6-cabinet-collapse.md` + `anti-ldf-flow.md` + `ldf-shallow-distribution.md` (all deleted on consolidation).

**Pages-served-by-this-file**: `/walkthroughs/ldf-walkthrough` (`src/pages/walkthroughs-ldf-page.tsx`).

---

## TL;DR

- **The 2026 anti-LDF wave was uniform, not concentrated.** LDF lost ~7.4pp on average (mean −7.43pp, median −7.73pp) across 140 ACs with the smallest standard deviation (4.47pp) of any alliance — tighter than UDF (5.65) or NDA (5.04).
- **The wave was religion-blind, route-blind, cabinet-status-blind.** Three press-favoured causal stories don't survive constituency-level testing:
  - Sabarimala-route ACs lost LESS LDF share than matched Hindu controls (wrong sign).
  - Cabinet ministers lost SLIGHTLY LESS than non-minister LDF incumbents (+0.74pp differential).
  - Religion-mix didn't predict LDF Δ either (LDF lost ~7pp regardless of bin).
- **The lost LDF vote landed on UDF (98% of LDF loss absorbed by UDF statewide) with a meaningful NDA slice in southern Hindu pockets (~45% of LDF loss in South Kerala absorbed by NDA).**
- **The shape reads as anti-incumbency, not realignment** — broad/shallow/symmetric distributions, no concentrated wipeout zones, no targeted bloc. This implies UDF's recovery prospects in 2031 depend on whether the wave is situational (UDF-fatigue, inflation reversal) or structural (community-shift away from LDF).

---

## §1 — The distribution: tight, symmetric, shallow

LDF Δshare 2021→2026 across 140 ACs:

| Statistic | Value |
|---|---|
| Mean | −7.43pp |
| Median | −7.73pp |
| Standard deviation | 4.47pp |
| Min | −24.59pp (Udumbanchola) |
| Max | +8.51pp (Vengara) |
| Range | 33.10pp |
| IQR (Q1, Q3) | −9.96pp, −4.16pp |
| IQR width | 5.80pp |
| Skewness | −0.10 (essentially symmetric) |
| Excess kurtosis | +1.55 (slightly fatter tails than normal) |

### Bin classification

| Bin | Definition | n | % |
|---|---|---|---|
| Held / gained | LDF Δ > −5pp | 40 | 28.6% |
| Modest loss | −10 to −5pp | 65 | 46.4% |
| Deep loss | −15 to −10pp | 29 | 20.7% |
| Catastrophic loss | worse than −15pp | 6 | 4.3% |

75% of ACs in held-or-modest. Catastrophic just 6 ACs.

### Cross-alliance distribution comparison

| Distribution | Mean | SD | Range |
|---|---|---|---|
| **LDF Δ** | −7.43pp | **4.47pp** | [−24.6, +8.5] |
| UDF Δ | +7.29pp | 5.65pp | [−12.9, +22.6] |
| NDA Δ | +2.05pp | 5.04pp | [−10.6, +22.9] |

LDF's SD is the *smallest*. The losing party's distribution is the tightest — the shape "broad anti-incumbency" produces, not the shape a "concentrated communal realignment" would produce.

### Outliers

**Catastrophic-loss outliers (LDF Δ < −16.4pp, ~2 SD)**:

| AC | Name | LDF Δ | UDF Δ | NDA Δ | Note |
|---|---|---|---|---|---|
| 89 | UDUMBANCHOLA | −24.59 | +22.59 | +2.66 | Idukki Christian highlands, biggest Christian-belt flip |
| 6 | PAYYANNUR | −17.81 | +20.23 | −2.09 | Northern Kannur CPI(M) stronghold; clean LDF→UDF transfer |
| 98 | PUTHUPPALLY | −16.82 | +17.79 | +0.18 | Central Kerala KC(M)/Christian belt |

All three are clean LDF→UDF transfers (small NDA component); geographically scattered (Idukki, Kannur, Kottayam) — not a regional collapse pattern.

**LDF-gained outliers (LDF Δ > +1.5pp)**:

| AC | Name | LDF Δ | UDF Δ | NDA Δ | Note |
|---|---|---|---|---|---|
| 41 | VENGARA | +8.51 | +3.18 | −0.91 | Only Muslim-majority AC where LDF gained |
| 114 | KONNI | +3.24 | +7.55 | −10.56 | Pathanamthitta holdout; surrounded by Sabarimala-route ACs |
| 2 | KASARAGOD | +2.17 | +1.54 | −3.01 | Far north traditional LDF base |
| 103 | CHERTHALA | +1.61 | −3.40 | +2.34 | P. Prasad's seat — only minister with non-negative LDF Δ |

---

## §2 — Falsifier 1: Sabarimala-route effect

> Press framing: the Sabarimala gold-cladding scandal compounded with residual 2018 women-entry anger, driving Hindu backlash in pilgrim-corridor ACs. Predicted larger LDF losses + corresponding NDA gains there.

**Tested three nested treatment groups.**

### TEST 1 — Geographic Sabarimala route (n=3 ACs: Aranmula, Konni, Ranni)

| AC | Hindu % | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| 112 RANNI | 48.3% | +4.1 | **−0.4** | −0.7 |
| 113 ARANMULA | 55.2% | +10.1 | −13.7 | +4.3 |
| 114 KONNI | 61.3% | +7.6 | **+3.2** | −10.6 |
| **Mean** |  | **+7.3** | **−3.6** | **−2.3** |
| Hindu ≥ 50% control (n=88) |  | +6.3 | −7.3 | +1.9 |
| **Differential** |  | +0.9 | **+3.7** (LDF lost LESS) | **−4.3** (NDA lost MORE) |

**Wrong sign on both limbs.** LDF lost less in the route ACs; NDA share *fell* there.

### TEST 2 — Devaswom route as named (n=5: Aranmula, Konni, Ranni, Ettumanoor, Kottayam)

| Cohort | UDF Δ | LDF Δ | NDA Δ | LDF differential |
|---|---|---|---|---|
| 5-AC named set | +9.3 | −6.0 | −1.2 | **+1.3 (less LDF loss)** |
| Hindu ≥ 50% control | +6.3 | −7.3 | +1.9 | — |

Even with wider set: signal not there.

### TEST 3 — Devaswom-related ministers' seats (n=3)

| AC | Minister | LDF Δ | UDF Δ | NDA Δ |
|---|---|---|---|---|
| 96 ETTUMANOOR | V.N. Vasavan (Devaswom incumbent) | −10.0 | +17.5 | −0.3 |
| 113 ARANMULA | Veena George (Health, Sabarimala-route geog.) | −13.7 | +10.1 | +4.3 |
| 132 KAZHAKOOTTAM | Kadakampally Surendran (former Devaswom) | −10.7 | +4.6 | +6.6 |
| **Mean** | | **−11.5** | **+10.7** | **+3.5** |
| Hindu ≥ 50% control | | −7.2 | +6.4 | +1.7 |
| **Differential** | | **−4.3** (LDF lost MORE) | +4.4 | +1.8 |

The 3 Devaswom ministers DID lose ~4pp more than matched controls — but this generalises to §3 (cabinet-status test), where it does NOT hold across the full 21-member cabinet. So these 3 are outliers within the cabinet, not representatives.

Notably: Ettumanoor's loss flowed to UDF, not NDA. Aranmula similar. Only Kazhakoottam (428-vote NDA win) partly fits the "Hindu→BJP" framing.

### TEST 4 — Pathanamthitta district as a whole (n=5: + Thiruvalla, Adoor)

Differential collapses (LDF +1.2 vs Hindu control). Thiruvalla's NDA +14.5pp is a JD(S)-winner three-way fragmentation outlier, not a Sabarimala effect.

**Reading**: Sabarimala-route effect not detectable; the apparent ~4pp penalty on Devaswom ministers is bounded to those 3 specific seats.

---

## §3 — Falsifier 2: cabinet-status / minister-targeting

> Press framing: 13 of 21 LDF ministers were defeated. Cabinet collapse signals governance rejection.

**Recount: 14 of 21 lost** (narrative miscounts Kadakampally Surendran — he was 2016 cabinet, not 2021).

### The core test

| Group | n | Mean LDF Δ |
|---|---|---|
| Minister incumbents | 21 | **−6.89pp** |
| Non-minister LDF 2021 incumbents | 78 | **−7.63pp** |
| All 140 ACs | 140 | −7.43pp |

**Differential: +0.74pp** — ministers lost *slightly less* than non-minister LDF incumbents. No detectable minister-targeted penalty.

### 14 ministers who lost (ranked by LDF Δ severity)

| Seat | Name | Portfolio | LDF Δ | 2026 winner |
|---|---|---|---|---|
| 58 CHITTUR | K. Krishnankutty | Electricity (JD(S)) | **−15.2** | UDF |
| 26 ELATHUR | A.K. Saseendran | Forest (NCP) | **−13.9** | UDF |
| 113 ARANMULA | Veena George | Health (CPI(M)) | **−13.7** | UDF |
| 91 IDUKKI | Roshy Augustine | Water Resources (KC(M)) | −10.9 | UDF |
| 96 ETTUMANOOR | V.N. Vasavan | Co-op/Devaswom | −10.0 | UDF |
| 77 KALAMASSERY | P. Rajeeve | Law/Industries | −9.8 | UDF |
| 44 TANUR | V. Abdurahiman | Sports/Wakf | −8.6 | UDF |
| 11 KANNUR | Kadannappalli Ramachandran | Registration | −7.7 | UDF |
| 17 MANANTHAVADY | O.R. Kelu | SC/ST/BC | −6.8 | UDF |
| 122 CHADAYAMANGALAM | J. Chinchu Rani | Animal Husbandry | −5.8 | UDF |
| 120 PATHANAPURAM | K.B. Ganesh Kumar | Transport | −5.3 | UDF |
| 49 THRITHALA | M.B. Rajesh | Local Self Govt | −3.8 | UDF |
| 70 IRINJALAKUDA | R. Bindu | Higher Education | −3.2 | UDF |
| 135 NEMOM | V. Sivankutty | Education | **−0.9** | NDA |

### 7 ministers who survived

| Seat | Name | Portfolio | LDF 2021 → 2026 | Δ |
|---|---|---|---|---|
| 12 DHARMADAM | Pinarayi Vijayan | Chief Minister | 59.6% → 50.1% | **−9.5** |
| 29 BEYPORE | P.A. Mohammed Riyas | Public Works | 49.7% → 44.3% | −5.4 |
| 66 OLLUR | K. Rajan | Revenue | 49.1% → 46.1% | −3.0 |
| 103 CHERTHALA | P. Prasad | Agriculture | 47.0% → 48.6% | **+1.6** |
| 110 CHENGANNUR | Saji Cherian | Fisheries | 48.6% → 42.3% | −6.3 |
| 119 KOTTARAKKARA | K.N. Balagopal | Finance | 46.0% → 43.1% | −2.9 |
| 130 NEDUMANGAD | G.R. Anil | Food | 47.5% → 43.8% | −3.7 |

### Outsized losses concentrate in small-party LDF allies

Krishnankutty (JD(S), −15.2), Saseendran (NCP, −13.9), Augustine (KC(M), −10.9). This is a **coalition** finding (small-ally bases declining), not a *cabinet* finding. CPI(M) ministers don't show systematic outsized loss.

Pinarayi's Dharmadam −9.5pp is slightly above baseline but his absolute margin (50,123 → 19,247 votes) is dramatic because Dharmadam was a high-margin seat; the Δshare is just modestly above the −7.4 mean.

**Reading**: Anti-incumbency rolled over ministers at roughly the same rate as non-minister LDF incumbents. "13 of 21 lost" is correctly reported but is consistent with uniform LDF wave + ministers happening to be sitting in 21 of the 99 LDF-held seats.

---

## §4 — Falsifier 3: religion-blind / minority-share

LDF Δ × religion-share correlations across 140 ACs (Pearson r):

|  | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|
| Muslim share (AC-level) | r = −0.01 | **r = +0.04** | r = −0.09 |
| Christian share (AC-level) | r = +0.20 | **r = −0.05** | r = +0.07 |
| Hindu share | r = −0.21 | **r = −0.00** | r = +0.05 |

LDF Δ doesn't correlate with religion-share at AC level — religion-blind collapse. Under district FE, the LDF×Christian relationship doesn't survive (simple p=0.020 → district-FE p=0.993): the press framing of "LDF lost more in Christian-heavy seats" is a between-district artefact.

Bin means by Christian share:

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Christian-majority (≥50%) | 2 | −2.3 | −6.3 | +9.8 |
| Christian-heavy (30–50%) | 32 | +10.4 | −8.0 | +2.6 |
| Christian-mid (15–30%) | 37 | +7.0 | −6.9 | +0.9 |
| Low Christian (<15%) | 69 | +6.3 | −7.5 | +2.2 |

LDF loss is flat across bins. Christian-heavy ACs gained UDF more — that's the UDF story (see `udf.md`); LDF lost ~7pp uniformly.

Bin means by Muslim share:

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Muslim-majority (≥60%) | 16 | +9.0 | −8.3 | +0.4 |
| Muslim-heavy (40–60%) | 23 | +5.8 | −6.8 | +2.2 |
| Muslim-mid (20–40%) | 44 | +7.8 | −7.4 | +2.0 |
| Low Muslim (<20%) | 57 | +7.0 | −7.5 | +2.5 |

Same story for LDF — uniform −7 to −8 across the gradient.

---

## §5 — Caste-share (district-level): Nair × LDF flat

Caste data is district-level only (Zachariah 2003 / KSI 2000); each AC inherits district. **Cannot test caste-voter behaviour at AC granularity** — ecological-fallacy hard.

Geography-overlap correlations (district-level caste × per-AC alliance Δ):

|  | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|
| **Nair share** | **r = −0.27** | r = +0.09 | r = +0.13 |
| Ezhava share | r = −0.02 | r = −0.02 | r = −0.05 |

LDF Δ doesn't correlate with either caste share. The Nair-share × UDF effect (r = −0.27) is detectable but explained by Trivandrum-district clustering (Nair-heavy = Trivandrum geography, not Nair voters specifically).

Bin means by Nair share:

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Very high Nair (≥25%) | 14 (TVM district) | +3.9 | −7.3 | **+4.2** |
| High Nair (15–25%) | 16 | +5.9 | −6.9 | +2.0 |
| Mid Nair (10–15%) | 43 | +7.0 | −7.2 | +1.8 |
| Low Nair (<10%) | 67 | **+8.6** | −7.7 | +1.8 |

LDF loss is again roughly flat across bins (−6.9 to −7.7). The pattern is: high-Nair districts saw smaller UDF gains + bigger NDA gains, but **LDF lost at the typical rate everywhere**. The "Nair effect" is a UDF/NDA-distribution story, not an LDF-loss story.

Under region FE: Nair×UDF β=−0.272, p=0.044 (just survives). Under district FE: cannot test (caste constant within district).

---

## §6 — Flow accounting: where the LDF vote went

Mean alliance Δshare across 140 ACs:

| Alliance | Mean Δ | % of LDF loss |
|---|---|---|
| UDF | **+7.29pp** | **98%** |
| LDF | **−7.43pp** | (= 100%) |
| NDA | +2.05pp | 28% |
| OTHER (incl. independents, NOTA) | −1.91pp | −26% |
| Sum | −0.00pp | |

**UDF absorbed 98% of LDF's loss on average**. NDA's +2pp gain plus UDF's +7.29 sum to MORE than LDF's loss (the extra came from OTHER's −1.91pp collapse — small-party + independent voters also consolidated on UDF/NDA).

### Per-AC absorption categories

| Category | Definition | n | % |
|---|---|---|---|
| **UDF-dominant absorption** | UDF received >70% of LDF loss | 91 | **65.0%** |
| Mixed (UDF + NDA split) | Neither dominant | 13 | 9.3% |
| **NDA-dominant absorption** | NDA received >40% of LDF loss | 32 | 22.9% |
| LDF held / gained | LDF Δ ≥ 0 | 4 | 2.9% |

### Per-region flow

| Region | n | UDF-dom | Mixed | NDA-dom | LDF held |
|---|---|---|---|---|---|
| **North** (Kasaragod/Kannur/Kozhikode/Wayanad/Malappuram) | 48 | **35 (72%)** | 5 (10%) | 6 (12%) | 2 (4%) |
| **Central** (Palakkad/Thrissur/Ernakulam/Idukki/Kottayam/Pathanamthitta/Alappuzha) | 67 | **44 (65%)** | 5 (7%) | 16 (23%) | 2 (2%) |
| **South** (Kollam/Thiruvananthapuram) | 25 | 12 (48%) | 3 (12%) | **10 (40%)** | 0 (0%) |

### Per-region UDF / NDA absorption rate

| Region | n | LDF Δ | UDF Δ | NDA Δ | OTHER Δ | UDF / −LDF | NDA / −LDF |
|---|---|---|---|---|---|---|---|
| North | 48 | −7.94 | +7.79 | +1.15 | −1.00 | **98%** | 14% |
| Central | 67 | −7.12 | +7.83 | +2.25 | −2.96 | **110%** | 32% |
| South | 25 | −7.27 | +4.85 | +3.26 | −0.84 | 67% | **45%** |

In Central Kerala, UDF absorbed 110% of LDF's loss (extra from OTHER collapse) — classic "consolidation behind UDF". In South Kerala, NDA absorbed 45% of LDF's loss; UDF only 67% — structurally different.

### Per-religion-bin absorption

| Bin | n | LDF Δ | UDF absorption | NDA absorption |
|---|---|---|---|---|
| Christian-heavy (≥30%) | 34 | −7.89 | **122%** | 38% |
| Muslim-majority (≥60%) | 16 | −8.28 | **108%** | 5% |
| Muslim 30–60% | 37 | −6.72 | 91% | 30% |
| Hindu-heavy (≥70%) | 10 | −8.85 | 61% | **44%** |
| Mixed (50–70% Hindu, low M+C) | 43 | −7.03 | 89% | 22% |

Christian-heavy + Muslim-majority → almost entirely UDF. Hindu-heavy → 44% NDA absorption (Pattern 3 / BJP-pocket geography).

### Net pp accounting

| Movement | Σ pp | n ACs |
|---|---|---|
| UDF gain (where it gained) | +1066.3 | 129 |
| NDA gain (where it gained) | +389.1 | 94 |
| OTHER gain (where it gained) | +18.1 | 19 |
| LDF loss (where it lost) | −1055.5 | 136 |

UDF's total ≈ LDF's total → mass conservation between UDF and LDF. Nearly every pp UDF gained corresponds to a pp LDF lost somewhere.

---

## §7 — Vote-share to seats: efficiency flip

Vote share → seat counts:

|  | 2021 | | 2026 | |
|---|---|---|---|---|
| Alliance | Vote % | Seats | Vote % | Seats |
| UDF | 39.41% | 41 / 140 | 46.81% | **102 / 140** |
| LDF | 45.28% | **99 / 140** | 37.86% | 35 / 140 |
| NDA | 12.45% | 0 / 140 | 14.28% | 3 / 140 |

LDF loss: −7.43pp → −64 seats. UDF gain: +7.40pp → +61 seats. **~8.5 seats per pp** — far above proportional (a 7.4pp swing in PR would yield ~10 seats; FPTP delivered 61).

### Efficiency ratio (seats per pp of statewide vote share)

| Alliance | 2021 | 2026 | Δ |
|---|---|---|---|
| UDF | 1.04 | **2.18** | **+1.14** |
| LDF | **2.19** | 0.93 | **−1.26** |
| NDA | 0.00 | 0.21 | +0.21 |

LDF and UDF traded efficiency almost exactly. In 2021 LDF was the efficient alliance (won 99 seats with 45%); in 2026 UDF is (102 seats with 47%). Same FPTP threshold geometry, flipped sign.

### LDF wasted-vote share

| Alliance | Wasted votes | % of total cast | % of own votes wasted |
|---|---|---|---|
| UDF | 4,412,426 | 20.55% | 43.9% |
| **LDF** | 6,088,795 | **28.36%** | **74.9%** |
| NDA | 2,920,510 | 13.60% | 95.2% |

LDF: 75% of its votes "wasted" (didn't contribute to a win) — most piled up in losing efforts.

### Counterfactual (uniform-swing-back-to-2021 shares)

| Alliance | 2026 actual | Counterfactual | Δ |
|---|---|---|---|
| UDF | 102 | 44 | −58 |
| LDF | 35 | 96 | +61 |
| NDA | 3 | 0 | −3 |

Removing the 7.4pp swing unwinds nearly all of UDF's gains. Roughly **58 of UDF's 102 seats are attributable to FPTP near-threshold amplification** beyond what PR would have produced.

---

## §8 — Mechanisms ruled out, mechanisms still open

### Ruled out at constituency level (this dataset)

- **Sabarimala-route Hindu backlash** — wrong-sign differential in 3-AC + 5-AC route definitions; LDF lost LESS in route ACs than matched controls.
- **Hindu-share-mediated LDF collapse** — LDF Δ flat across Hindu-share bins; doesn't survive district FE.
- **Cabinet-status / minister-targeting** — minister incumbents lost +0.74pp LESS than non-minister LDF incumbents.
- **Religion-bloc consolidation hitting LDF specifically** — LDF lost ~7pp regardless of religion mix; the "Christian shift to UDF" is a UDF-gain story (see `udf.md §1`), not an LDF-share-loss story.

### Still consistent with the data (cannot be ruled out)

- **Generic anti-incumbency** — broad/shallow/symmetric distribution is exactly what generic anti-incumbency produces.
- **UDF welfare-credibility recovery** — could be substantive UDF positive movement collinear with LDF erosion (constituency-level data can't distinguish).
- **Differential turnout** — LDF voters staying home rather than switching. AC totals can't distinguish "vote loss" from "turnout loss".
- **KC(M) base movement** — Jose K. Mani's KC(M) lost ~7pp share in 12 ACs where it contested, with UDF gaining proportionally. Tagged LDF in both cycles (so alliance Δ shows the loss). About 12% of A1's Christian-belt UDF premium is attributable to KC(M)-specific dynamics; ~88% is non-KC(M). For the LDF story, this is partly a "small-ally collapse" within the LDF column.

### What would weaken the "wave was uniform" framing

- Multi-cycle data showing wave elections always have tight distributions → LDF's tightness isn't 2026-specific.
- 2031 recovery from the −7pp baseline → confirms situational/anti-incumbency reading.
- 2031 failure to recover → suggests structural realignment, not transient.

---

## Scripts + data

| Source | Path |
|---|---|
| Per-AC LDF Δ (computed) | `getPerACAllianceDelta("LDF")` in `src/lib/data/walkthrough-metrics.ts` |
| Distribution stats | `scripts/narrative-ldf-shallow-distribution.py` (legacy) |
| Sabarimala-route test | `scripts/narrative-a2-sabarimala.ts` |
| Cabinet collapse test | `scripts/narrative-a6-cabinet-collapse.ts` + `data/ldf-ministers-2021.json` |
| Flow decomposition | `scripts/narrative-anti-ldf-flow.py` |
| Religion-share AC data | `data/ac-demographics.json` + `data/ac-demographics-2025.json` |
| Caste-share district data | `data/hindu-caste-by-district.json` (Zachariah/KSI 2000) |
| 2021 historical shares | `data/historical/S11-*.json` |
| 2026 shares | `data/kerala-2026.json` |
| Page | `src/pages/walkthroughs-ldf-page.tsx` |

---

## Cross-references

- **`udf.md`** — UDF's gain side of the same flow. Christian-heavy ACs absorbing 122% of LDF loss is the UDF Christian-belt story.
- **`nda.md`** — BJP's 95% wasted-vote share + concentrated-pocket pattern that explains the South-Kerala 45% NDA absorption.
- **`christian.md`** — Latin Catholic / Marthoma flip ACs are mostly in the LDF-deep-loss zone (Udumbanchola, Puthuppally — see §1 outliers).
- **`docs/data-pipeline.md`** — methodology for AC-level religion data (SHRUG + Census C-01).
- **`docs/caste-data.md`** — provenance for Zachariah/KSI district-level caste data.

---

## Methodology notes (operative for this file)

- **Unit**: constituency-equal Δshares throughout (each AC counts once). Statewide vote-share figures are vote-weighted.
- **NOTA handling**: 2026 excludes NOTA from the denominator; 2021/2016/2011 includes NOTA. Reproduces the Python analysis-script asymmetry; drags 2021 shares ~0.2–0.4pp.
- **AC-level religion**: 2025 cohort projection of Census 2011 (state-level CRS multipliers, per-AC uniform). Rank order preserved against raw 2011.
- **Reserved-seat exclusion**: Robustness — re-runs with 16 reserved seats dropped don't change verdicts. Reserved seats correlate with high-Hindu/low-minority and could confound; they don't.
- **District FE**: Christian-share × UDF survives at p<0.01; Christian-share × LDF doesn't. Caste shares are district-constant so district FE can't test them; region FE used as the next-strictest control.
- **KC(M) handling**: KC(M) tagged LDF in both 2021 and 2026 (joined LDF in 2020, before the 2021→2026 window). So there's no alliance-relabel artefact in Δshare — the KC(M) effect detected is voter base movement, not bookkeeping.
