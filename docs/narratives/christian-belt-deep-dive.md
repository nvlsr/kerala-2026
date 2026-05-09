# Christian-belt premium — deep dive

> **Status:** initial pass complete. Data tables populated, findings drafted, key
> questions surfaced. Discuss before promoting any of this to the public site.
>
> **Reproduce:** `bun run scripts/analyze-christian-belt.ts`

## Why this exists

Current `Christian-belt premium` section on `/walkthroughs/udf-walkthrough` says:

- Pearson r = +0.20 (Christian share × UDF Δshare)
- Under district fixed effects: β = +0.194, p = 0.008
- ~12% of the premium is mechanical KC(M) defection
- ~88% is "non-KC(M) cross-community signal"

The 88% claim is **incomplete**: it only subtracts KC(M) (the LDF Christian
party). It does not subtract movement within UDF's own Christian parties
(Kerala Congress / Joseph faction; KC-Jacob). Their gains in their own
historical seats sit silently inside the 88%.

This deep-dive disentangles that — and uses the resulting structure as a
template for a Muslim parallel.

## Operational definitions

- **Christian-dominant AC**: ≥40% Christian share (21 ACs). Kerala has only
  2 ACs at ≥50%, so "majority" is too narrow a threshold.
- **Christian-significant AC**: 30–40% Christian (13 ACs).
- **Christian-moderate AC**: 15–30% Christian (37 ACs).
- **Christian-low AC**: 5–15% Christian (25 ACs).
- **Christian-trace AC**: <5% Christian (44 ACs).

- **Christian-party seat**: an AC where a Christian-affiliated party
  contested in 2026. UDF side: KEC (PJ Joseph faction) at 8 seats; KC-Jacob
  at 1 seat. LDF side: KC(M) at 12 seats; KC(B) at 1 seat. **13 distinct
  seats** (4 are head-to-head: KEC vs KC(M) at ACs 85, 90, 94, 99).
  - **Caveat 1**: AC 4 (Kanhangad, Kasaragod, Christian 12.1%) is a
    coalition allocation, not a Christian-belt seat. Flag and exclude
    from "Christian-party seats by demographic logic".
  - **Caveat 2**: AC 120 (Pathanapuram, Kollam, Christian 20.2%) — KC(B)
    contested but it's not a Christian-belt seat. K B Ganesh Kumar is the
    veteran candidate; this is a personality-driven contest.

- **Central-5 districts**: Idukki, Ernakulam, Kottayam, Wayanad, Malappuram
  (47 ACs). UDF won 47 of 47 here.

---

## Section 1 — Historical UDF baseline at high-Christian ACs

UDF vote share by Christian-share bin, mean across ACs in each bin:

| Christian bin | n | 2011 | 2016 | 2021 | 2026 |
|---|---|---|---|---|---|
| <5% | 44 | 46.7% | 40.7% | 40.9% | 47.8% |
| 5-15% | 25 | 44.7% | 39.5% | 39.8% | 45.2% |
| 15-30% | 37 | 44.0% | 35.0% | 36.0% | 43.0% |
| 30-40% | 13 | 49.6% | 41.7% | 39.0% | 48.5% |
| ≥40% | 21 | 48.8% | 42.2% | 41.4% | **51.2%** |
| **Statewide (constituency-mean)** | 140 | 46.2% | 39.3% | 39.3% | 46.6% |

**Christian premium = UDF at ≥40% Christian − UDF statewide:**

| Year | Premium |
|---|---|
| 2011 | +2.6pp |
| 2016 | +2.9pp |
| 2021 | +2.1pp |
| **2026** | **+4.6pp** |

### Findings

- **Christians have voted UDF more than statewide in every cycle since 2011** — the historical premium is real but modest, ~2–3pp.
- **The 2026 premium roughly doubled to +4.6pp**. The size of the 2026 premium is the news, not the premium itself.
- The 30–40% bin tracks closely with the ≥40% bin in every year, suggesting the gradient is monotonic above ~30% Christian, not a sharp threshold effect.

### Open question

The 2026 baseline jump (+10pp at ≥40% Christian: 41.4 → 51.2) is large.
~7pp of that is the statewide wave; ~3pp is the additional premium. The
question is what proportion of the +3pp comes from KC(M) defection vs.
non-KC(M) Christian community shift. Answered partially in §3 and §5.

---

## Section 2 — Christian-party seats over time

### 2.1 UDF Christian-party seats in 2026 (KEC + KC-Jacob, 9 ACs)

| AC | District | Name | Chr% | Party vote 2021 | Party vote 2026 | Δ | UDF vote 2026 | UDF Δ | Won? |
|---|---|---|---|---|---|---|---|---|---|
| 4 | Kasaragod | Kanhangad | 12.1 | 0% (didn't contest) | 37.0 | +37.0 | 37.0 | +2.5 | lost |
| 70 | Thrissur | Irinjalakuda | 26.6 | 36.4 | 43.8 | +7.3 | 43.8 | +7.3 | won |
| 85 | Ernakulam | Piravom (KC-Jacob) | 42.1 | 53.8 | 59.2 | +5.4 | 59.2 | +5.4 | won |
| 87 | Ernakulam | Kothamangalam | 29.2 | 42.2 | 53.1 | +10.9 | 53.1 | +10.9 | won |
| 90 | Idukki | Thodupuzha | 40.6 | 48.6 | 58.4 | +9.7 | 58.4 | +9.7 | won |
| 94 | Kottayam | Kaduthuruthy | 44.1 | 45.4 | 56.8 | +11.4 | 56.8 | +11.4 | won |
| 99 | Kottayam | Changanassery | 43.5 | 39.9 | 46.4 | +6.5 | 46.4 | +6.5 | won |
| 106 | Alappuzha | Kuttanad | 36.7 | 41.3 | 50.6 | +9.3 | 50.6 | +9.3 | won |
| 111 | Pathanamthitta | Thiruvalla | 47.8 | 36.4 | 38.0 | +1.6 | 38.0 | +1.6 | won |

**8 of 9 won.** Only Kanhangad lost (it was a low-Christian seat, coalition
allocation only — the KEC vote there grew because they didn't contest in
2021, so the +37 is structural, not a community shift).

### 2.2 LDF Christian-party seats in 2026 (KC(M) + KC(B), 13 ACs)

| AC | District | Name | Chr% | KCM/KCB 2021 | KCM/KCB 2026 | Δ | LDF Δ | Won? |
|---|---|---|---|---|---|---|---|---|
| 9 | Kannur | Irikkur | 28.1 | 43.8 | 32.1 | −11.6 | −11.6 | lost |
| 72 | Thrissur | Chalakudy | 44.4 | 42.5 | 35.1 | −7.4 | −7.4 | lost |
| 74 | Ernakulam | Perumbavoor | 38.6 | 35.1 | 31.8 | −3.3 | −3.3 | lost |
| 85 | Ernakulam | Piravom | 42.1 | 37.8 | 29.7 | −8.1 | −8.1 | lost |
| 90 | Idukki | Thodupuzha | 40.6 | 34.0 | 27.9 | −6.2 | −6.2 | lost |
| 91 | Idukki | Idukki | 47.3 | 47.5 | 36.6 | −10.9 | −10.9 | lost |
| 93 | Kottayam | Pala | 52.0 | 39.3 | 35.3 | −4.0 | −4.0 | lost |
| 94 | Kottayam | Kaduthuruthy | 44.1 | 42.2 | 31.5 | −10.6 | −10.6 | lost |
| 99 | Kottayam | Changanassery | 43.5 | 44.8 | 39.5 | −5.4 | −5.4 | lost |
| 100 | Kottayam | Kanjirappally | 43.0 | 43.8 | 37.6 | −6.2 | −6.2 | lost |
| 101 | Kottayam | Poonjar | 41.5 | 41.9 | 34.8 | −7.1 | −7.1 | lost |
| 112 | Pathanamthitta | Ranni | 46.9 | 41.2 | 40.8 | −0.4 | −0.4 | lost |
| 120 | Kollam | Pathanapuram (KC(B)) | 20.2 | 49.1 | 43.8 | −5.3 | −5.3 | lost |

**LDF's Christian parties lost all 13 seats they contested. KC(M) vote share dropped on average −6.65pp.**

### 2.3 Head-to-head — KEC vs KC(M) at the same AC (2026)

| AC | Name | Chr% | KEC vote | KCM vote | UDF vote | LDF vote | UDF won by |
|---|---|---|---|---|---|---|---|
| 85 | Piravom | 42.1 | 59.2 | 29.7 | 59.2 | 29.7 | 29.5pp |
| 90 | Thodupuzha | 40.6 | 58.4 | 27.9 | 58.4 | 27.9 | 30.5pp |
| 94 | Kaduthuruthy | 44.1 | 56.8 | 31.5 | 56.8 | 31.5 | 25.3pp |
| 99 | Changanassery | 43.5 | 46.4 | 39.5 | 46.4 | 39.5 | 6.9pp |

**KEC won all 4 head-to-heads.** Three of the four were blowouts (25–30pp margins).

### Findings

- **The cleanest single statistic from this election: KC(M) and KC(B) lost all 13 seats they contested. KEC and KC-Jacob won 8 of 9.** The "Christian alliance" of LDF was wiped out at every Christian seat it ran.
- The 4 head-to-head results are decisive — when Christian voters chose between a UDF Christian party and an LDF Christian party, they chose UDF Christian by 7–30pp margins.
- KEC's own party-share grew an average of ~9pp at the seats it contested in both 2021 and 2026 (excluding Kanhangad anomaly).
- **Pala is the only KC(M) seat where the LDF drop is small (−4pp) but UDF dropped MORE (−12.9pp).** This is the Mani C. Kappan / Shone George story — both an LDF gain (Mani C. Kappan moved his vote from UDF NCK to LDF NCP-SP) and a BJP candidate spike (+18.2pp). Pala is a counter-example to the rest of the section's pattern; it deserves its own paragraph in any section we write.

---

## Section 3 — KC(M) seat decomposition (where did the votes go?)

Vote-share movements 2021→2026 at the 12 KC(M) seats, sorted by Christian share:

| AC | Name | Chr% | ΔKCM | ΔUDF | ΔLDF | ΔNDA |
|---|---|---|---|---|---|---|
| 93 | Pala | 52.0 | −4.0 | −12.9 | −4.0 | **+18.2** |
| 91 | Idukki | 47.3 | −10.9 | +12.0 | −10.9 | +0.3 |
| 112 | Ranni | 46.9 | −0.4 | +4.1 | −0.4 | −0.7 |
| 72 | Chalakudy | 44.4 | −7.4 | +8.7 | −7.4 | −0.4 |
| 94 | Kaduthuruthy | 44.1 | −10.6 | +11.4 | −10.6 | +1.0 |
| 99 | Changanassery | 43.5 | −5.4 | +6.5 | −5.4 | +0.5 |
| 100 | Kanjirappally | 43.0 | −6.2 | +8.1 | −6.2 | −1.2 |
| 85 | Piravom | 42.1 | −8.1 | +5.4 | −8.1 | +2.9 |
| 101 | Poonjar | 41.5 | −7.1 | +14.7 | −7.1 | **+22.9** |
| 90 | Thodupuzha | 40.6 | −6.2 | +9.7 | −6.2 | −6.6 |
| 74 | Perumbavoor | 38.6 | −3.3 | +14.1 | −3.3 | +4.8 |
| 9 | Irikkur | 28.1 | −11.6 | +9.9 | −11.6 | +1.2 |
| **Mean** | | | **−6.65** | **+7.92** | **−6.65** | **+3.01** |

### Findings

- **ΔLDF = ΔKCM exactly at every single KC(M) seat.** This means at KC(M) seats, LDF's losses are entirely KC(M)-specific. CPI(M)/CPI shares didn't change at these seats; KC(M) bled, and only KC(M).
- Mean ΔUDF at KC(M) seats (+7.92pp) is slightly above the statewide ΔUDF (~7pp). So KC(M) seats moved roughly with the wave PLUS the KC(M) defection.
- **Pala (AC 93)** is the giant outlier — UDF *lost* 12.9pp here while NDA gained 18.2pp. Driven entirely by the Mani C. Kappan personal-vote shift to LDF and BJP fielding marquee candidate Shone George. Pala drags the mean.
- **Poonjar (AC 101)** has the same NDA spike (+22.9pp). Worth investigating — likely also a personal-vote / BJP-marquee story. We have not yet identified the candidate-level cause.
- **Excluding Pala**: mean ΔKCM −6.89pp, mean ΔUDF +9.81pp. Without the Pala outlier, KC(M) seats swung +9.8pp to UDF — clearly above the statewide wave. Worth flagging both numbers.

### What this says about KC(M) → UDF defection

If ΔKCM ≈ −6.65pp and ΔUDF ≈ +7.92pp at KC(M) seats, the simplest reading
is: **6.65pp of UDF's gain at these seats is direct KC(M) defection;
~1.27pp is "the rest of the wave."** That's tighter than the methodology
page's "12% mechanical KC(M)" framing, which was a statewide-regression
attribution. At the KC(M) seats themselves, KC(M) defection accounts for
roughly 80% of UDF's gain.

But the regression is statewide. At KC(M) seats specifically, the
mechanical share is much higher than 12%. The "12%" applies to KC(M)'s
contribution to UDF's regression-coefficient on Christian share across
all 140 ACs.

---

## Section 4 — Central-5 internal heterogeneity

Of the 47 Central-5 ACs:

| Subset | n | Mean Chr% | Mean Mus% | Mean ΔUDF |
|---|---|---|---|---|
| UDF Christian-party seat (KEC/KC-Jacob) | 5 | 39.9 | 16.0 | +8.8pp |
| LDF Christian-party only (KC(M)/KC(B), no UDF Christian) | 5 | 44.5 | 12.1 | +7.2pp |
| **High-Christian (≥30%) but no Christian party either side** | **16** | **40.4** | **12.2** | **+11.9pp** |
| Muslim-heavy (≥50%) | 16 | 1.7 | 73.2 | +9.0pp |
| Other Central-5 (Wayanad + Aluva + Vaikom) | 5 | 22.6 | 26.9 | +5.2pp |

### Findings

- **The Central-5 sweep is at least three different stories spatially co-located:**
  1. **Muslim Malappuram (16 ACs)**: ΔUDF +9.0pp — the Muslim-heavy north of Malappuram swept clean, with IUML doing the work. This is a Muslim-community story, not a Christian one.
  2. **Christian Idukki/Kottayam/Ernakulam (~26 ACs)**: ΔUDF ranging from +7.2pp at KC(M) seats to +11.9pp at high-Christian no-party-contesting seats. This is the Christian-belt story.
  3. **Wayanad + scattered (5 ACs)**: ΔUDF +5.2pp — much closer to statewide wave, neither Christian-belt nor Muslim-belt. Wayanad's swing to UDF was real but unremarkable.
- The "Central-5 sweep" framing on the public site implies one cohesive story. **It's three stories that happened to all break UDF's way.**
- **Most striking number**: high-Christian Central-5 ACs *without* a Christian party on either ballot moved **+11.9pp to UDF** — well above both the statewide wave (+7pp) and the Christian-party-contested seats (+7-9pp). This is the strongest single piece of evidence yet that there's a real cross-community Christian shift, separate from Christian-party mechanics.

### The 16 "high-Christian, no-Christian-party" seats

These are the cleanest test of cross-community Christian-belt premium:

```
AC 75 ANGAMALY        (ernakulam)        chr 64.5%  ΔUDF  +8.3pp
AC 77 KALAMASSERY     (ernakulam)        chr 33.9%  ΔUDF +10.1pp
AC 78 PARAVUR         (ernakulam)        chr 33.5%  ΔUDF  -2.3pp ← only negative
AC 79 VYPEN           (ernakulam)        chr 41.0%  ΔUDF +15.5pp
AC 80 KOCHI           (ernakulam)        chr 40.0%  ΔUDF +16.7pp
AC 81 THRIPUNITHURA   (ernakulam)        chr 33.9%  ΔUDF  +3.7pp
AC 82 ERANAKULAM      (ernakulam)        chr 33.9%  ΔUDF +15.8pp
AC 83 THRIKKAKARA     (ernakulam)        chr 33.9%  ΔUDF +16.1pp
AC 84 KUNNATHUNAD     (ernakulam)        chr 34.7%  ΔUDF +11.9pp
AC 86 MUVATTUPUZHA    (ernakulam)        chr 40.4%  ΔUDF +16.4pp
AC 88 DEVIKULAM       (idukki)           chr 31.8%  ΔUDF  +1.2pp ← reserved (ST)?
AC 89 UDUMBANCHOLA    (idukki)           chr 48.3%  ΔUDF +22.6pp ← biggest swing in Kerala
AC 92 PEERUMADE       (idukki)           chr 41.3%  ΔUDF +11.4pp ← reserved (SC)
AC 96 ETTUMANOOR      (kottayam)         chr 44.6%  ΔUDF +17.5pp
AC 97 KOTTAYAM        (kottayam)         chr 41.1%  ΔUDF  +7.2pp
AC 98 PUTHUPPALLY     (kottayam)         chr 49.1%  ΔUDF +17.8pp ← Chandy legacy seat
```

- 13 of 16 swung +7pp or more (above statewide wave); 11 of 16 swung +10pp or more.
- Outliers: Paravur (−2.3), Devikulam (+1.2), Thripunithura (+3.7) — worth understanding why these three didn't move.
- Several Ernakulam city ACs (Kochi, Eranakulam, Thrikkakara) all swung +15–17pp. These are urban Christian-significant seats with no Christian party — strong evidence the swing is community-wide, not party-mechanical.

---

## Section 5 — Bin-sliced ΔUDF + Christian-party-seat flag

### 5.1 ΔUDF by Christian-share bin (all 140 ACs)

| Bin | n | ΔUDF | ΔLDF | ΔNDA |
|---|---|---|---|---|
| <5% | 44 | +6.83 | −7.42 | +1.47 |
| 5-15% | 25 | +5.38 | −7.55 | +3.42 |
| 15-30% | 37 | +6.95 | −6.94 | +0.92 |
| 30-40% | 13 | +9.45 | −6.96 | +3.19 |
| ≥40% | 21 | +9.78 | −8.46 | +2.94 |

The gradient is clear: **above 30% Christian share, ΔUDF jumps from ~7pp to ~10pp**. The +3pp premium on top of the statewide wave is real and visible in raw means before any regression.

### 5.2 ΔUDF by bin × Christian-party-seat flag

| Christian bin | Christian-party seat (n, ΔUDF) | No Christian party (n, ΔUDF) |
|---|---|---|
| <5% | n=0, n/a | n=44, +6.83pp |
| 5-15% | n=1, +2.53pp | n=24, +5.50pp |
| 15-30% | n=4, +9.84pp | n=33, +6.60pp |
| 30-40% | n=2, +11.71pp | n=11, +9.04pp |
| **≥40%** | **n=11, +6.30pp** | **n=10, +13.61pp** |

### Findings — the most important table in this doc

- **At the highest Christian bin (≥40%), ACs WITHOUT any Christian party contesting swung +13.6pp — more than double the +6.3pp at Christian-party-contested seats.** This is the opposite of what would happen if the premium were Christian-party-mechanical.
- The ≥40% Christian-party seats (n=11) include all 12 KC(M) seats *minus* AC 9 (Irikkur, only 28% Christian) plus Pala outlier (−12.9). Without Pala, mean would be much higher.
- **The interpretation**: when there's no Christian-party candidate to absorb the swing into a "party movement," the entire community shift goes through the UDF/LDF/NDA channel directly. Where there IS a Christian party, the swing partly registers as Christian-party-share-change rather than alliance-share-change.
- This is **stronger evidence than the 88% claim** that the Christian premium is genuinely cross-community. At seats where there's literally no Christian party to defect within, Christians at ≥40% share still moved +13.6pp to UDF.

### Caveat

Sample size in the ≥40% no-party bin is 10 ACs. Pala is in the party bin, not here. The 10 are mostly Ernakulam + Kottayam urban / semi-urban ACs (Kochi, Ettumanoor, Puthuppally, etc.). The community-shift signal is real, but generalizing it from 10 ACs requires care — there could be confounders like urban concentration, ex-Chandy network seats, anti-incumbency clusters in Ernakulam, etc.

---

## Section 6 — Muslim parallel

### 6.1 ΔUDF by Muslim-share bin (all 140 ACs)

| Muslim bin | n | ΔUDF | ΔLDF | ΔNDA |
|---|---|---|---|---|
| <10% | 27 | +8.89 | −8.53 | +1.16 |
| 10-25% | 52 | +7.10 | −6.98 | +2.74 |
| 25-50% | 40 | +6.08 | −7.20 | +2.37 |
| 50-70% | 10 | +7.12 | −7.44 | +1.71 |
| ≥70% | 11 | +8.77 | −7.66 | +0.13 |

### 6.2 UDF baseline by Muslim-share bin (multi-cycle)

| Year | <10% | 10-25% | 25-50% | 50-70% | ≥70% | Statewide |
|---|---|---|---|---|---|---|
| 2011 | 47.5 | 45.1 | 43.7 | 47.0 | 57.0 | 46.2 |
| 2016 | 39.5 | 37.3 | 38.2 | 41.6 | 50.0 | 39.3 |
| 2021 | 39.4 | 36.7 | 38.6 | 43.3 | 50.6 | 39.3 |
| 2026 | 48.3 | 43.8 | 44.7 | 50.4 | **59.4** | 46.6 |

### 6.3 Muslim premium = UDF at ≥70% Muslim − UDF statewide

| Year | Premium |
|---|---|
| 2011 | +10.8pp |
| 2016 | +10.7pp |
| 2021 | +11.3pp |
| 2026 | +12.8pp |

### Findings

- **The Muslim premium is structurally larger than the Christian premium and much more stable.** Muslim-heavy ACs have given UDF +10–13pp above statewide in every cycle since 2011.
- **In 2026, the Muslim premium grew modestly (+1.5pp). The Christian premium roughly doubled (+1.7pp).** Both grew, but the Christian premium grew off a smaller base.
- **The Muslim *swing* in 2026 was ordinary** — ΔUDF at ≥70% Muslim was +8.77pp, only ~1pp above statewide. Muslims didn't swing much; they just rode the statewide wave from a higher baseline. This is structurally different from Christians, who swung MORE in 2026 (+9.78pp at ≥40% Christian, ~3pp above statewide).
- **Inverted U-shape**: ΔUDF dips at the 10–25% and 25–50% Muslim bins (+7.10 and +6.08). Why? These are mostly mixed-religion areas (parts of Kasaragod, Kannur, Kozhikode, Thrissur). Possible reasons: (a) closer 3-way contests where the wave splits; (b) BJP gained in mixed areas; (c) IUML doesn't dominate these — it's INC vs CPI(M) directly, with less coalition-amplification.
- **No LDF Muslim party of comparable scale to KC(M)** for Christians. The Muslim story is therefore one-sided structurally: IUML dominates the Muslim-heavy belt; LDF has scattered Muslim allies (INL, occasional independents) but no equivalent vehicle that could "collapse." So the Muslim parallel cannot follow the same "LDF Muslim party wiped out, UDF Muslim party absorbed" pattern.

### What this means for site narrative

The "minority premium" framing should split into two distinct stories:

1. **Muslim story**: a stable, structural +11pp UDF lean at Muslim-heavy ACs that delivered ordinary 2026 swings. Malappuram swept UDF because of the wave, not because of a 2026 Muslim shift. This complicates any "Muslim community angry at LDF" narrative — the swing here is wave-sized.
2. **Christian story**: a smaller historical premium that **grew sharply in 2026**. The shift at high-Christian ACs is +3-4pp ABOVE the wave — a real 2026 community swing, not a baseline.

These are different stories with different mechanisms. Currently the site's section flattens them.

---

## Open questions

1. **Pala counter-narrative deserves treatment.** It's the only seat where the entire Christian-belt pattern reverses — UDF lost 12.9pp, NDA gained 18.2pp. Worth a paragraph or callout. (Already in current section but framed as "outlier"; could be reframed as a structural contrast — what happens when local-personality politics overrides community sentiment.)
2. **Poonjar's NDA +22.9pp spike** — what's the candidate story? We haven't checked.
3. **Ernakulam city cluster** (Kochi, Eranakulam, Thripunithura, Thrikkakara) all show different ΔUDF magnitudes despite identical Christian share (33.9% — same SHRUG aggregation). Variance is candidate/local-issue driven; worth flagging that AC-level demographic data has limits in urban contiguous areas.
4. **Why the dip at 5-15% Christian (+5.38 vs +6.83 at <5%)?** Modest sample variance, or a real pattern (maybe these are mixed Hindu-Muslim areas where the swing is smaller)?
5. **Should we publish all this in the walkthrough section, or is this better as a separate analysis page?** The current Christian-belt premium section is one section in a 5-section walkthrough. To do this analysis justice we'd need 4–5 sub-sections OR a dedicated `/walkthroughs/community-belts` page.

---

## Provisional rewrite of the section

> *Hold until findings are stable and we've decided on placement.*

A first sketch of what the *findings* of a rewritten section would look like, in priority order:

1. **The Christian premium is real, modest historically, and grew sharply in 2026.** Christians have favoured UDF by +2-3pp above statewide since 2011; in 2026 the gap doubled to ~+4.6pp.
2. **LDF's Christian vehicles collapsed — KC(M) and KC(B) lost all 13 seats they contested. UDF's Christian vehicles (KEC, KC-Jacob) won 8 of 9.** Where they met head-to-head, KEC won by 7–30pp.
3. **At KC(M) seats, every percentage point LDF lost was KC(M)-specific.** The defection is clean: ΔLDF = ΔKCM seat-by-seat, mean −6.65pp. Most of that went to UDF.
4. **At high-Christian ACs with no Christian party on either ballot, UDF still gained +13.6pp** — well above the statewide wave. This is the cleanest evidence for a cross-community shift, separate from Christian-party-mechanics.
5. **Pala is the structural counter-example** — local personality (Mani C. Kappan) and BJP marquee candidate (Shone George) overwhelmed the community pattern. Worth a paragraph on what it tells us about the limits of community-vote analysis.
6. **The Muslim story is structurally different** and should not be merged with the Christian story. Muslim-heavy ACs have a stable +11pp UDF premium across every cycle since 2011; the 2026 swing there was wave-sized, not amplified.
