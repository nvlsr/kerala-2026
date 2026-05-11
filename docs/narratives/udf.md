# UDF — findings reference

**Audience**: future analysis (agent + author). Page version at `/walkthroughs/udf-walkthrough`. This file is the deeper analytical reference — strategy data, mitigation tests, full per-AC tables, source pointers.

**Sources consolidated**: `a1-minority-consolidation.md` + `a8-central-kerala-kingmaker.md` + relevant fragments of `b3b4-caste-shifts.md` + `vote-efficiency.md` + portions of `christian-belt-deep-dive.md` and `muslim-belt-deep-dive.md` covering UDF strategy (all deleted on consolidation).

**Pages-served-by-this-file**: `/walkthroughs/udf-walkthrough` (`src/pages/walkthroughs-udf-page.tsx` + `src/pages/walkthroughs-udf-data.ts`).

---

## TL;DR

- **2026 was an anti-LDF wave (~7.4pp uniform) that converted into a UDF landslide (102 seats) via geographic concentration in Central Kerala + FPTP near-threshold amplification.**
- **Central-5 districts (Idukki, Ernakulam, Wayanad, Malappuram, Kottayam) delivered 47 of 47 UDF wins** — 46% of UDF's 102-seat majority from 34% of the state's ACs. Strip those 47 wins → UDF (55 seats) below the 71-seat majority threshold.
- **The two religious belts in Central-5 deployed different UDF strategies that both delivered:**
  - **Christian belt** (Christian-heavy 30%+ ACs, n=36 statewide): historic ~3pp UDF premium **doubled to +4.6pp** in 2026. UDF mixed INC-Hindu and INC-Christian candidates freely; both worked.
  - **Muslim belt** (Malappuram non-reserved, n=15): UDF's premium was already **~+11pp since 2011** and grew modestly to +12.8pp. Wave-sized swing on a stable high baseline. Strategy menu was structurally narrower: IUML alliance or INC-Muslim, never INC-Hindu.
- **Vote-efficiency flipped between LDF and UDF.** 2021: LDF ratio 2.19 / UDF 1.04. 2026: LDF 0.93 / UDF 2.18. Same FPTP threshold geometry, flipped sign.
- **Mechanism**: 88% of UDF's Christian-belt premium is non-KC(M) cross-community shift; ~12% is KC(M) base movement (Jose K. Mani's faction lost ~7pp share where it contested, UDF gained proportionally).
- **Press framing "minority consolidation" is HALF supported.** Christian-share predicts differential UDF swing (β=+0.19 under district FE, p=0.008). Muslim-share doesn't (β=+0.016 under district FE, p=0.795). The two halves get pooled in coverage; only the Christian half carries a constituency-level differential.

---

## §1 — The minority-consolidation question (AC-level)

### Correlations across 140 ACs (AC religion shares × per-AC alliance Δ)

|  | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|
| Muslim share | r = **−0.01** | r = +0.04 | r = −0.09 |
| Christian share | r = **+0.20** | r = −0.05 | r = +0.07 |
| Hindu share | r = −0.21 | r = −0.00 | r = +0.05 |
| (Muslim + Christian) | r = +0.21 | r = +0.00 | r = −0.05 |

Reading: the pooled "minority share" r = +0.21 with UDF is **entirely the Christian half**. Muslim share is consistent with no additional concentration premium beyond statewide trend.

### Bin means by Christian share

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Christian-majority (≥50%) | 2 | −2.3 | −6.3 | +9.8 |
| **Christian-heavy (30–50%)** | **32** | **+10.4** | −8.0 | +2.6 |
| Christian-mid (15–30%) | 37 | +7.0 | −6.9 | +0.9 |
| Low Christian (<15%) | 69 | +6.3 | −7.5 | +2.2 |

**+4.10pp differential** between Christian-heavy (32 ACs at +10.4) and Low Christian (69 ACs at +6.3) — the actual "minority consolidation" signal.

The 2-AC Christian-majority bin has Angamaly (+8.3 UDF, clean) + Pala (−12.9 UDF, Mani C. Kappan NCK churn). Bin mean splits.

### Bin means by Muslim share

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Muslim-majority (≥60%) | 16 | +9.0 | −8.3 | +0.4 |
| Muslim-heavy (40–60%) | 23 | +5.8 | −6.8 | +2.2 |
| Muslim-mid (20–40%) | 44 | +7.8 | −7.4 | +2.0 |
| Low Muslim (<20%) | 57 | +7.0 | −7.5 | +2.5 |

No monotonic relationship. Muslim-heavy 40-60% bin gained UDF *less* than low-Muslim. Muslim-majority gained +9pp — slightly above statewide, not dramatically so.

### District-FE regression — the cleanest test

`udf_delta ~ christian + muslim + udf21 + district_FE`:

| Predictor | No controls | + region FE | + district FE |
|---|---|---|---|
| Christian share | β = +0.225 *** | β = +0.223 *** | **β = +0.194 *** (p=0.008)** |
| Muslim share | β = +0.160 *** | β = +0.116 *** | β = +0.016 (p=0.795) |
| Prior UDF share | β = −0.273 *** | β = −0.282 *** | β = −0.337 *** |

**The Christian effect survives district FE (p<0.01).** Within any given Kerala district, ACs with higher Christian share showed larger UDF gains. The Muslim effect collapses (β=+0.016, p=0.795) — driven by between-district variation (Malappuram clustering).

### Robustness: KC(M)-stripped Christian premium

KC(M) (alliance-tagged LDF in both cycles) lost ~7pp share in 12 ACs where it contested. Re-running with KC(M) candidates excluded from both years:

| Christian-heavy bin (n=32) | Original | KC(M)-stripped |
|---|---|---|
| Mean UDF Δ | +10.40pp | +9.71pp |
| Premium vs statewide | +3.11pp | +2.74pp |

~12% of the Christian-belt UDF premium is mechanically attributable to KC(M)-specific dynamics; **~88% remains as non-KC(M) signal**.

### Robustness: reserved-seat exclusion

| | All 140 | n=124 (excl. 16 reserved) |
|---|---|---|
| Christian × UDF Δ | r = +0.20 | r = **+0.22** (slightly stronger) |
| Muslim × UDF Δ | r = −0.00 | r = −0.04 (still ~zero) |

Christian premium strengthens slightly; Muslim non-finding holds.

### Notable outliers (top-10 Christian ACs)

| Seat | Christian% | UDF Δ | LDF Δ | NDA Δ | Notes |
|---|---|---|---|---|---|
| ANGAMALY | 64% | +8.3 | −8.6 | +1.3 | Clean swing |
| **PALA** | 52% | **−12.9** | −4.0 | **+18.2** | Mani C. Kappan/NCK/KC(M) churn |
| PUTHUPPALLY | 49% | +17.8 | −16.8 | +0.2 | Massive UDF consolidation |
| **UDUMBANCHOLA** | 48% | **+22.6** | −24.6 | +2.7 | Largest Christian-belt swing |
| **THIRUVALLA** | 48% | +1.6 | −14.6 | **+14.5** | JD(S) winner / 3-way fragmentation; NDA caught the residue |
| IDUKKI | 47% | +12.0 | −10.9 | +0.3 | Clean swing |
| RANNI | 47% | +4.1 | −0.4 | −0.7 | Stable / minimal swing |
| ETTUMANOOR | 45% | +17.5 | −10.0 | −0.3 | Devaswom Minister Vasavan lost |

Pala and Thiruvalla are non-religious local dynamics; strip them and the Christian-belt → UDF story is cleaner than bin means suggest.

---

## §2 — Central Kerala kingmaker arithmetic

### UDF swept 5 districts (47 of 47 ACs)

| District | ACs | UDF | LDF | NDA | Mean UDF Δ | Mean LDF Δ |
|---|---|---|---|---|---|---|
| Idukki | 5 | **5** | 0 | 0 | +11.4 | −12.9 |
| Ernakulam | 14 | **14** | 0 | 0 | +10.5 | −5.7 |
| Wayanad | 3 | **3** | 0 | 0 | +4.2 | −8.3 |
| Malappuram | 16 | **16** | 0 | 0 | +9.0 | −8.3 |
| Kottayam | 9 | **9** | 0 | 0 | +8.8 | −9.4 |
| **Total** | **47** | **47** | **0** | **0** | | |

Mean UDF gain across Central-5: +9.4pp — about 2pp ahead of the statewide +7.3 baseline.

Intra-set variation: Idukki had largest swings (+11.4 / −12.9). Ernakulam had smallest LDF collapse (−5.7) but still flipped completely — Latin Catholic + Munambam Waqf effects. Wayanad gained UDF only +4.2 yet still swept 3/3 — seats were already structurally close.

### UDF lost exactly one each in 3 districts

| District | UDF wins | UDF lost | Lost seat |
|---|---|---|---|
| Pathanamthitta | 4 of 5 | 1 | KONNI → LDF (Sabarimala-route outlier; A2) |
| Kasaragod | 4 of 5 | 1 | KANHANGAD → LDF (far-north CPI(M) belt) |
| Kozhikode | 12 of 13 | 1 | BEYPORE → LDF (P.A. Mohammed Riyas, CM's son-in-law) |

### LDF residual strongholds

| District | UDF | LDF | NDA | Mean LDF share | Mean LDF Δ |
|---|---|---|---|---|---|
| Thrissur | 4 | **9** | 0 | 40.3% | −6.8 |
| Kannur | 5 | **6** | 0 | 43.9% | −9.1 |
| Kasaragod | 4 | 1 | 0 | 33.2% | −5.8 |

LDF held majority in Thrissur (9 of 13 = 69%) and Kannur (6 of 11 = 55%). Kasaragod NOT an LDF stronghold despite press framing.

### Pre-poll under-prediction

Manorama-C Voter pre-poll: "UDF 33 of 53 in Central Kerala" — between two readings:
- Central-5 (Idukki/Ernakulam/Wayanad/Malappuram/Kottayam): 47 of 47 = **100%** (vs predicted ~62%)
- Central-7 (+ Pathanamthitta + Thrissur): 55 of 65 = **85%**

Pre-poll surveys flagged the right geography but **underestimated the wave by 23–38pp**.

### Kingmaker arithmetic

| Source | UDF wins | Cumulative | % of UDF total |
|---|---|---|---|
| Central-5 districts | 47 | 47 | **46.1%** |
| + Pathanamthitta + Thrissur | +8 | 55 | 53.9% |
| + Kannur, Kollam, Alappuzha | +19 | 74 | 72.5% |
| + remainder | +28 | 102 | 100% |

Strip Central-5: UDF = 55 seats (below 71-seat majority threshold).

---

## §3 — Christian-belt strategy deep-dive (Central-3 application)

The Christian-belt analysis universe is 36 ACs statewide with Christian share ≥30%. Applied focus is **Central-3** (Idukki, Ernakulam, Kottayam) = 26 of those 36.

### Historic premium has doubled

| Year | UDF at ≥40% Christian | UDF statewide | Premium (cleaned, 17 ACs) |
|---|---|---|---|
| 2011 | 49.2% | 46.2% | +3.0pp |
| 2016 | 43.4% | 39.3% | +4.1pp |
| 2021 | 41.9% | 39.3% | +2.7pp |
| **2026** | **53.1%** | **46.6%** | **+6.4pp** |

Historic premium ~2.5–4pp doubled to ~+6.4pp in 2026.

### Three strategies UDF deployed

Within INC-direct contests in Central-3 Christian-belt seats:

| Strategy | n | Won | Mean ΔUDF | Read |
|---|---|---|---|---|
| **Christian Alliance** (KEC or KC-Jacob) | 5 | 5 | **+8.8pp** | Wave-rate. KEC/KC-Jacob won by big margins because of high baselines, but additional swing was modest. |
| **INC-Christian** (INC fields a Christian) | 11 | 11 | **+11.4pp** | INC's own Christian candidates picked up large swings. |
| **INC-Hindu** (INC fields a Hindu) | 7 | 7 | **+12.4pp** | **Christians moved toward INC regardless of candidate religion.** |

Statewide UDF Δ ~+7pp. INC-direct outperformed alliance. Within INC-direct, candidate religion didn't matter for swing magnitude.

**Outlier-removal sensitivity**: dropping personal-vote/reserved-seat distortions (Pala, Poonjar, Paravur, Devikulam, Kunnathunad, Thiruvalla) widens (3a) vs (3c) gap from 3.1pp to 5.0pp — strategy claim strengthens.

**Ceiling-adjusted**: dividing ΔUDF by (100 − UDF2021) accounts for headroom. (3a) consumed 16.2% headroom, (3c) 23.1%. INC-direct still gained markedly more.

### The 36 ACs (Christian-belt universe, statewide)

Sorted by Christian share. **Strategy** classifies UDF's approach: Alliance / INC-Christian / INC-Hindu / Special.

| AC | District | H/C/M | Res | Candidate | Party | UDF Δ | Won | Strategy |
|---|---|---|---|---|---|---|---|---|
| Angamaly | Ernakulam | 34/65/1 | — | Roji M. John (Christian) | INC | +8.3 | ✓ | INC-Christian |
| Pala | Kottayam | 38/52/10 | — | Mani C. Kappen (Christian) | Indep | −12.9 | ✓ Indep | Special |
| Puthuppally | Kottayam | 49/49/2 | — | Chandy Oommen (Christian) | INC | +17.8 | ✓ | INC-Christian |
| Udumbanchola | Idukki | 48/48/4 | — | Senapathy Venu (Hindu) | INC | +22.6 | ✓ | INC-Hindu |
| Thiruvalla | Pathanamthitta | 48/48/4 | — | Varghese Mammen (Christian) | KEC | +1.6 | ✓ | Alliance |
| Idukki | Idukki | 48/47/5 | — | Roy K. Paulose (Christian) | INC | +12.0 | ✓ | INC-Christian |
| Ranni | Pathanamthitta | 48/47/5 | — | Pazhakulam Madhu (Hindu) | INC | +4.1 | ✓ | INC-Hindu |
| Parassala | Trivandrum | 49/45/6 | — | Neyyattinkara Sanal (Hindu) | INC | +2.7 | ✗ | INC-Hindu |
| Ettumanoor | Kottayam | 49/45/6 | — | Nattakom Suresh (Hindu) | INC | +17.5 | ✓ | INC-Hindu |
| Chalakudy | Thrissur | 49/44/7 | — | Saneeshkumar Joseph (Christian) | INC | +8.7 | ✓ | INC-Christian |
| Kaduthuruthy | Kottayam | 53/44/3 | — | Mons Joseph (Christian) | KEC | +11.4 | ✓ | Alliance |
| Changanassery | Kottayam | 46/44/11 | — | Vinu Job Kuzhimannil (Christian) | KEC | +6.5 | ✓ | Alliance |
| Kanjirappally | Kottayam | 46/43/10 | — | Rony K. Baby (Christian) | INC | +8.1 | ✓ | INC-Christian |
| Piravom | Ernakulam | 49/42/9 | — | Anoop Jacob (Christian) | KC-Jacob | +5.4 | ✓ | Alliance |
| Poonjar | Kottayam | 42/41/16 | — | Sebastian M.J. (Christian) | INC | +14.7 | ✓ | INC-Christian |
| Peerumade | Idukki | 51/41/8 | — | Cyriac Thomas (Christian) | INC | +11.4 | ✓ | INC-Christian |
| Kottayam | Kottayam | 50/41/9 | — | Thiruvanchoor Radhakrishnan (Hindu) | INC | +7.2 | ✓ | INC-Hindu |
| Vypen | Ernakulam | 52/41/7 | — | Tony Chammany (Christian) | INC | +15.5 | ✓ | INC-Christian |
| Thodupuzha | Idukki | 39/41/21 | — | Apu John Joseph (Christian) | KEC | +9.7 | ✓ | Alliance |
| Muvattupuzha | Ernakulam | 35/40/24 | — | Mathew Kuzhalnadan (Christian) | INC | +16.4 | ✓ | INC-Christian |
| Kochi | Ernakulam | 43/40/17 | — | Mohammed Shiyas (Muslim) | INC | +16.7 | ✓ | Special |
| Thrissur | Thrissur | 54/40/6 | — | Rajan J. Pallan (Hindu) | INC | +15.4 | ✓ | INC-Hindu |
| Perumbavoor | Ernakulam | 43/39/19 | — | Manoj Moothedan (Hindu) | INC | +14.1 | ✓ | INC-Hindu |
| Kuttanad | Alappuzha | 59/37/4 | — | Reji Cheriyan (Christian) | KEC | +9.3 | ✓ | Alliance |
| Aranmula | Pathanamthitta | 55/36/8 | — | Abin Varkey Kodiyattu (Christian) | INC | +10.1 | ✓ | INC-Christian |
| Pudukkad | Thrissur | 59/36/6 | — | K.M. Baburajan (Hindu) | INC | +10.0 | ✗ | INC-Hindu |
| Kunnathunad | Ernakulam | 45/35/20 | SC | V.P. Sajeendran (Hindu) | INC | +11.9 | ✓ | INC-Hindu |
| Kalamassery | Ernakulam | 45/34/21 | — | V.E. Abdul Gafoor (Muslim) | IUML | +10.1 | ✓ | Special |
| Thripunithura | Ernakulam | 45/34/21 | — | Deepak Joy (Christian) | INC | +3.7 | ✓ | INC-Christian |
| Eranakulam | Ernakulam | 45/34/21 | — | T.J. Vinod (Hindu) | INC | +15.8 | ✓ | INC-Hindu |
| Thrikkakara | Ernakulam | 45/34/21 | — | Uma Thomas (Christian) | INC | +16.1 | ✓ | INC-Christian |
| Paravur | Ernakulam | 59/33/7 | — | V.D. Satheesan (Hindu) | INC | −2.3 | ✓ | INC-Hindu |
| Konni | Pathanamthitta | 61/33/5 | — | Satheesh Kochuparambil (Hindu) | INC | +7.6 | ✗ | INC-Hindu |
| Devikulam | Idukki | 61/32/7 | SC | F. Raja (Christian) | INC | +1.2 | ✓ | INC-Christian |
| Kothamangalam | Ernakulam | 34/29/37 | — | Shibu Theckumpuram (Christian) | KEC | +10.9 | ✓ | Alliance |
| Irinjalakuda | Thrissur | 64/27/10 | — | Thomas Unniyadan (Christian) | KEC | +7.3 | ✓ | Alliance |

---

## §4 — Muslim-belt strategy (Malappuram non-reserved 15)

Universe: Malappuram district minus Wandoor (SC) and minus 3 Wayanad ST ACs. **UDF won 15 of 15.**

### Historic premium has been large and stable

| Year | UDF ≥70% Muslim (n=11) | UDF statewide | Premium |
|---|---|---|---|
| 2011 | 57.0% | 46.2% | +10.8pp |
| 2016 | 50.0% | 39.3% | +10.7pp |
| 2021 | 50.6% | 39.3% | +11.3pp |
| **2026** | **59.4%** | **46.6%** | **+12.8pp** |

Muslim premium ~+11pp since 2011, grew modestly to +12.8 in 2026. **Wave-sized swing, not amplified**: ΔUDF at ≥70% Muslim ACs was +8.77pp — barely above statewide +7pp. **Opposite shape from Christian**: stable historic premium continuing, vs. smaller historic premium that doubled this cycle.

### UDF strategy menu in Malappuram non-reserved

| Strategy | n | Won | Mean ΔUDF |
|---|---|---|---|
| **Muslim Alliance (IUML)** | 12 | 12 | **+8.8pp** |
| **INC-Muslim** | 2 | 2 | **+12.9pp** |
| **INC-Hindu** | **0** | — | — |
| Special (INC-Christian: Thavanur) | 1 | 1 | +4.1pp |
| **Total** | **15** | **15** | |

**Empty INC-Hindu bucket is the headline finding.**

In Christian-belt UDF freely mixed candidate religions (INC-Hindu and INC-Christian both worked +10-12pp). In Muslim-Malappuram **UDF was not willing to put a Hindu in front of Muslim voters** at non-reserved seats — only Muslim (via IUML or INC-Muslim) was on the menu.

### The 15 ACs (Malappuram non-reserved)

| Name | H/C/M | Candidate (party) | UDF Δ | Strategy |
|---|---|---|---|---|
| Vengara | 14/0/85 | K.M. Shaji (Muslim) — IUML | +3.2 | Muslim Alliance |
| Tirurangadi | 18/0/82 | P.M.A. Sameer (Muslim) — IUML | +14.1 | Muslim Alliance |
| Tanur | 18/0/82 | P.K. Navas (Muslim) — IUML | +7.9 | Muslim Alliance |
| Tirur | 21/1/78 | Kurukkoli Moideen (Muslim) — IUML | +5.4 | Muslim Alliance |
| Ernad | 22/1/77 | P.K. Basheer (Muslim) — IUML | +4.3 | Muslim Alliance |
| Kottakkal | 25/0/75 | Prof. Abid Hussain Thangal (Muslim) — IUML | +11.1 | Muslim Alliance |
| Mankada | 24/2/75 | Manjalamkuzhi Ali (Muslim) — IUML | +9.9 | Muslim Alliance |
| Manjeri | 24/1/75 | Adv. M. Rahmathulla (Muslim) — IUML | +10.6 | Muslim Alliance |
| Malappuram | 24/1/75 | P.K. Kunhalikutty (Muslim) — IUML | +9.8 | Muslim Alliance |
| Kondotty | 27/1/72 | T.P. Ashrafali (Muslim) — IUML | +9.9 | Muslim Alliance |
| Perinthalmanna | 27/2/71 | Najeeb Kanthapuram (Muslim) — IUML | +10.4 | Muslim Alliance |
| Vallikunnu | 30/1/69 | T.V. Ibrahim (Muslim) — IUML | +8.6 | Muslim Alliance |
| Thavanur | 33/0/67 | Adv. V.S. Joy (Christian) — INC | +4.1 | Special |
| Ponnani | 33/0/67 | K.P. Noushad Ali (Muslim) — INC | +10.4 | INC-Muslim |
| Nilambur | 31/8/61 | Aryadan Shoukath (Muslim) — INC | +15.4 | INC-Muslim |

**Caveats**:
- INC-Muslim n=2 — small sample. Both Ponnani and Nilambur swung >+10pp but two seats can't bear too much weight.
- Thavanur INC-Christian +4.1 — well below wave. Suggests UDF's refusal to put non-Muslim INC in Muslim-Malappuram is empirically supported (one exception barely cleared baseline).

### Vengara is the LDF-gain outlier in this set

The only Muslim-majority AC where LDF gained (+8.51pp). 85% Muslim; was already structurally an LDF holdout via local IUML-faction dynamics.

---

## §5 — Caste-share geography (district-level, exploratory)

> Caste data is district-level only. **CANNOT test caste-voter behaviour at AC granularity**. Below is geography-overlap observation.

| | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|
| **Nair share** (district-level) | **r = −0.27** | r = +0.09 | r = +0.13 |
| Ezhava share (district-level) | r = −0.02 | r = −0.02 | r = −0.05 |

### Bins by Nair share

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Very high Nair (≥25%, Trivandrum) | 14 | +3.87 | −7.30 | **+4.19** |
| High Nair (15–25%) | 16 | +5.88 | −6.90 | +2.04 |
| Mid Nair (10–15%) | 43 | +6.96 | −7.18 | +1.81 |
| Low Nair (<10%) | 67 | **+8.55** | −7.74 | +1.77 |

Monotonic: as Nair share drops, UDF gain rises (3.87 → 8.55). NDA gain rises in the other direction (4.19 in high-Nair → 1.77 in low-Nair). LDF lost ~7pp flat.

### Bins by Ezhava share

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Very high Ezhava (≥30%) | 20 | +7.57 | −7.99 | +1.37 |
| High Ezhava (22–30%) | 26 | +6.81 | −7.03 | +1.24 |
| Mid Ezhava (15–22%) | 65 | +7.31 | −7.39 | +3.07 |
| Low Ezhava (<15%) | 29 | +7.47 | −7.49 | +0.98 |

**Flat.** Ezhava-share variation doesn't predict any alliance Δ.

### Robustness — region FE

| Test | No controls | + region FE |
|---|---|---|
| Nair × UDF Δ | β=−0.222, p=0.002 | β=−0.272, p=0.044 (just survives) |
| Nair × NDA Δ | β=+0.102, p=0.114 | β=+0.072, p=0.562 (doesn't hold) |
| Ezhava × UDF Δ | β=+0.005, p=0.927 | β=+0.015, p=0.803 |
| Ezhava × NDA Δ | β=−0.023, p=0.638 | β=−0.018, p=0.738 |

Nair × UDF survives region FE (just); Nair × NDA doesn't. District FE absorbs caste perfectly (caste constant within district).

**Reading**: high-Nair districts (Trivandrum + adjacent) saw smaller UDF gains. Can't separate from Trivandrum-region effects (urbanization, BJP organisational strength, government-employee concentration). Geography-overlap, not voter-behaviour.

---

## §6 — Vote-share to seats: UDF efficiency

|  | 2021 | | 2026 | |
|---|---|---|---|---|
| Alliance | Vote % | Seats | Vote % | Seats |
| UDF | 39.41% | 41 / 140 | 46.81% | **102 / 140** |
| LDF | 45.28% | **99 / 140** | 37.86% | 35 / 140 |
| NDA | 12.45% | 0 / 140 | 14.28% | 3 / 140 |

UDF +7.40pp → +61 seats. **~8.2 seats per pp** — far above proportional (~10 seats for +7.4pp under PR).

### Efficiency ratio (seats per pp of statewide vote share)

| Alliance | 2021 | 2026 | Δ |
|---|---|---|---|
| **UDF** | 1.04 | **2.18** | **+1.14** |
| **LDF** | **2.19** | 0.93 | **−1.26** |
| NDA | 0.00 | 0.21 | +0.21 |

UDF gained +1.14 ratio-points; LDF lost −1.26. Two alliances traded efficiency nearly exactly.

### UDF wasted-vote share

| Alliance | Wasted votes | % of total cast | % of own votes wasted |
|---|---|---|---|
| **UDF** | 4,412,426 | **20.55%** | **43.9%** |
| LDF | 6,088,795 | 28.36% | 74.9% |
| NDA | 2,920,510 | 13.60% | 95.2% |

UDF: 44% of own votes wasted (much better than LDF's 75%). More than half went to winning effort.

### Winning-margin distribution

| Alliance | n won | min | 25% | median | mean | 75% | max |
|---|---|---|---|---|---|---|---|
| **UDF** | **102** | 0.97 | 6.40 | **12.19** | 14.42 | 19.98 | 43.64 |
| LDF | 35 | 0.07 | 1.95 | 6.99 | 7.05 | 11.07 | 18.15 |
| NDA | 3 | 0.33 | 0.33 | 3.24 | 2.38 | 3.56 | 3.56 |

UDF did NOT win predominantly on tight margins — median 12.19pp (larger than LDF's 6.99 and NDA's 3.24). UDF wins were widely distributed; LDF's clustered near zero; NDA's all <5pp.

### Counterfactual (2021-share uniform-rollback)

| Alliance | 2026 actual | Counterfactual | Δ |
|---|---|---|---|
| UDF | 102 | 44 | **−58** |
| LDF | 35 | 96 | +61 |
| NDA | 3 | 0 | −3 |

Under uniform-swing-back, the seat split nearly mirrors 2021's actual 99-41-0. **~58 of UDF's 102 seats are FPTP-near-threshold-amplification beyond what PR would have produced.**

This is structural: the 2026 swing landed on top of an already close-to-50/50 vote distribution in many ACs.

---

## §7 — Three patterns synthesis

Kerala 2026 was three overlapping patterns:

1. **Anti-LDF wave** — broad, uniform ~7pp loss across 140 ACs (covered in `ldf.md §1`).
2. **Central Kerala UDF kingmaker** — geographic landing pattern of the wave + Christian-belt premium converting modest swings into a 47-of-47 sweep.
3. **BJP targeted consolidation** — fewer seats contested, higher share where it does (covered in `nda.md`).

Pattern 2 is this file's headline. Pattern 1 + 2 combined: a ~7pp uniform swing on top of a near-50/50 baseline distribution in central Kerala produced 47 simultaneously-flipped seats.

---

## §8 — Mechanism, what's open, what would weaken

### What's directly observable

- Christian-share predicts differential UDF swing (district-FE robust at p<0.01); Muslim-share doesn't.
- Central-5 contributed 46% of UDF's majority (47 of 102 wins).
- KC(M) base movement explains ~12% of Christian-belt premium; ~88% is non-KC(M).
- INC-direct outperformed alliance route in Christian belt (+12.4 INC-Hindu / +11.4 INC-Christian vs +8.8 KEC).
- Empty INC-Hindu bucket in Muslim-Malappuram — UDF's strategic menu was structurally narrower.

### What's NOT proven

- **Christian voters individually shifted from LDF to UDF.** Constituency-level data is consistent with this but also with differential turnout, candidate-personality effects, sub-community dynamics. Survey microdata could discriminate.
- **The Christian-belt premium is uniformly Syro-Malabar-driven.** Sub-community resolution (Syro-Malabar vs Latin Catholic vs Marthoma) is in `christian.md` (sub-rite cohort layer), which shows it splits into Catholic-restorations + Latin/Marthoma-flips.
- **The Central-5 sweep is durable.** 2026 was an anti-LDF wave year; 47-0 may be cycle-specific.
- **KC(M) defection is a "Catholic Church to UDF" story.** Specifically Jose K. Mani's faction; party-personality vs religion-effects can't be separated here.

### What would weaken the headline

- **Booth-level survey data showing Christians voted similarly across LDF/UDF in 2026** → constituency-level premium driven by non-Christian voters.
- **Sub-community-resolved data revealing the premium is Latin Catholic-Munambam-Waqf-specific** rather than generic Christian.
- **2031 reversal** of the Christian-belt premium → 2026 was cycle-specific, not structural.
- **A regression partialling out KC(M) Δ as a predictor of UDF Δ** could refine the KC(M)-stripped null.

---

## Scripts + data

| Source | Path |
|---|---|
| AC-level alliance metrics | `getAllACMetrics()`, `getPerACAllianceDelta("UDF")` in `src/lib/data/walkthrough-metrics.ts` |
| Christian-belt analysis | `scripts/analysis/analyze-christian-belt.ts` |
| Muslim-belt analysis | `scripts/analysis/analyze-muslim-belt.ts` |
| Minority consolidation (A1) | `scripts/analysis/narrative-a1-ac-level.ts` (+ `--exclude-reserved` flag for reserved-seat robustness; `--baseline-2011` for raw 2011) |
| District-FE regression | `scripts/analysis/narrative-regression.py` |
| Caste analysis (B3+B4) | `scripts/analysis/narrative-b3b4-caste.ts` |
| KC(M)-stripped recompute | `scripts/analysis/narrative-a1-no-kcm.py` |
| Central-Kerala kingmaker | `scripts/analysis/narrative-a8-central-kerala.ts` |
| Vote efficiency | `scripts/analysis/narrative-vote-efficiency.py` |
| AC religion data (build) | `python3 scripts/pipeline/build-ac-demographics.py` (needs `data/shrug/` + `data/raw/census-c01/`) |
| AC religion data (consumed) | `data/ac-demographics.json` + `data/ac-demographics-2025.json` |
| Caste district data | `data/hindu-caste-by-district.json` |
| Page | `src/pages/walkthroughs-udf-page.tsx` + `src/pages/walkthroughs-udf-data.ts` |

---

## Cross-references

- **`ldf.md §6`** — flow-decomposition from LDF side. UDF absorbed 122% of LDF loss in Christian-heavy ACs (110% in Central Kerala region) — sets the geographic frame for this file's Central-5 thesis.
- **`christian.md`** — sub-rite resolution: the Christian-belt premium splits into Catholic restorations (SM/Jacobite/Orthodox returned to 2011 baselines) + Latin/Marthoma flips (LDF→UDF for first time in 4-cycle window).
- **`muslim.md`** — Muslim-belt analysis at sub-sect resolution.
- **`nda.md`** — BJP's NDA Δ +2pp aggregate hid +5.2pp in the 30-AC targeted set; UDF's near-flat NDA-Δ in central Latin Kerala (per `christian.md §6`) is the geographic complement.
- **`docs/data-pipeline.md`** — methodology for AC-level religion + caste data sources.

---

## Methodology notes

- **AC-level religion**: 114 of 140 ACs at SHRUG→Census C-01 resolution; 26 urban-heavy ACs fall back to district-Urban shares. State aggregate from AC-level data matches Census state totals within ~0.6pp.
- **2025 vs 2011 baseline**: uniform statewide multipliers preserve rank order; correlations shift by ≤0.01. 2026 verdicts identical under either.
- **KC(M) alliance tagging**: KC(M) joined LDF in 2020, before this analysis window. Alliance Δshare reflects voter base movement, NOT a bookkeeping alliance-relabel.
- **NOTA**: 2026 excludes from denominator; 2021 includes. Reproduces Python catalogue asymmetry; drags 2021 shares ~0.2–0.4pp.
- **Christian-belt outlier removal**: Pala, Poonjar, Paravur, Devikulam, Kunnathunad, Thiruvalla. Strategy claim strengthens when removed; not bookkeeping.
