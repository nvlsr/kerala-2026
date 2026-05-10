# Christian-belt premium — deep dive

> **Status:** restructured around the narrative direction. Six numbered
> sections; data only, no prose for site yet.
>
> **Reproduce:** `bun run scripts/analyze-christian-belt.ts`

---

## 1. Christians traditionally vote UDF

Comparing UDF performance in the rest of state vs ACs with ≥40% Christian
population: UDF consistently does better in Christian-heavy ACs.

**Christian premium = (UDF mean at ≥40% Christian) − (UDF statewide):**

| Year | UDF at ≥40% Chr | UDF statewide | Premium |
|---|---|---|---|
| 2011 | 48.8% | 46.2% | **+2.6pp** |
| 2016 | 42.2% | 39.3% | **+2.9pp** |
| 2021 | 41.4% | 39.3% | **+2.1pp** |
| 2026 | 51.2% | 46.6% | **+4.6pp** |

- The premium is real but historically modest (~2–3pp).
- **The 2026 premium roughly doubled to +4.6pp.** That's the news, not the premium itself.

---

## 2. Christian-party-reserved seats

### 2.1 UDF Christian-party seats in 2026 (KEC + KC-Jacob)

| AC | District | Name | Chr% | Party 2021 | Party 2026 | Δ | UDF Δ | Won? |
|---|---|---|---|---|---|---|---|---|
| 4 | Kasaragod | Kanhangad | 12.1 | 0% (didn't contest) | 37.0 | +37.0 | +2.5 | lost |
| 70 | Thrissur | Irinjalakuda | 26.6 | 36.4 | 43.8 | +7.3 | +7.3 | won |
| 85 | Ernakulam | Piravom (KC-Jacob) | 42.1 | 53.8 | 59.2 | +5.4 | +5.4 | won |
| 87 | Ernakulam | Kothamangalam | 29.2 | 42.2 | 53.1 | +10.9 | +10.9 | won |
| 90 | Idukki | Thodupuzha | 40.6 | 48.6 | 58.4 | +9.7 | +9.7 | won |
| 94 | Kottayam | Kaduthuruthy | 44.1 | 45.4 | 56.8 | +11.4 | +11.4 | won |
| 99 | Kottayam | Changanassery | 43.5 | 39.9 | 46.4 | +6.5 | +6.5 | won |
| 106 | Alappuzha | Kuttanad | 36.7 | 41.3 | 50.6 | +9.3 | +9.3 | won |
| 111 | Pathanamthitta | Thiruvalla | 47.8 | 36.4 | 38.0 | +1.6 | +1.6 | won |

**8 of 9 won.**

### 2.2 LDF Christian-party seats in 2026 (KC(M) + KC(B))

| AC | District | Name | Chr% | Party 2021 | Party 2026 | Δ | LDF Δ | Won? |
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

**LDF Christian parties lost all 13 seats. Mean KCM/KCB drop −6.65pp.**

### 2.3 Common list — head-to-head (UDF Christian vs LDF Christian, same AC, 2026)

| AC | Name | Chr% | KEC vote | KCM vote | UDF Δ | LDF Δ | UDF margin |
|---|---|---|---|---|---|---|---|
| 85 | Piravom | 42.1 | 59.2 | 29.7 | +5.4 | −8.1 | +29.5pp |
| 90 | Thodupuzha | 40.6 | 58.4 | 27.9 | +9.7 | −6.2 | +30.5pp |
| 94 | Kaduthuruthy | 44.1 | 56.8 | 31.5 | +11.4 | −10.6 | +25.3pp |
| 99 | Changanassery | 43.5 | 46.4 | 39.5 | +6.5 | −5.4 | +6.9pp |

**KEC won all 4 head-to-heads.** Three were 25–30pp blowouts.

### 2.4 Top 15 ACs by Christian share — and how the parties allocated them

| Rank | AC | Name | District | Chr% | UDF Christian party? | LDF Christian party? |
|---|---|---|---|---|---|---|
| 1 | 75 | Angamaly | Ernakulam | 64.5 | — | — |
| 2 | 93 | Pala | Kottayam | 52.0 | — | KC(M) (Jose K. Mani) |
| 3 | 98 | Puthuppally | Kottayam | 49.1 | — | — |
| 4 | 89 | Udumbanchola | Idukki | 48.3 | — | — |
| 5 | 111 | Thiruvalla | Pathanamthitta | 47.8 | KEC | — |
| 6 | 91 | Idukki | Idukki | 47.3 | — | KC(M) |
| 7 | 112 | Ranni | Pathanamthitta | 46.9 | — | KC(M) |
| 8 | 137 | Parassala | Thiruvananthapuram | 45.1 | — | — |
| 9 | 96 | Ettumanoor | Kottayam | 44.6 | — | — |
| 10 | 72 | Chalakudy | Thrissur | 44.4 | — | KC(M) |
| 11 | 94 | Kaduthuruthy | Kottayam | 44.1 | KEC | KC(M) |
| 12 | 99 | Changanassery | Kottayam | 43.5 | KEC | KC(M) |
| 13 | 100 | Kanjirappally | Kottayam | 43.0 | — | KC(M) |
| 14 | 85 | Piravom | Ernakulam | 42.1 | KC-Jacob | KC(M) |
| 15 | 101 | Poonjar | Kottayam | 41.5 | — | KC(M) |

**Pattern:**

- **5 of top-15 are "neither"** (no Christian party either side) — Angamaly, Puthuppally, Udumbanchola, Parassala, Ettumanoor. INC contests directly for UDF; CPI(M) contests directly for LDF.
- **6 of top-15 are LDF-Christian-only** (KC(M) on the LDF side, INC on the UDF side).
- **3 of top-15 are head-to-head** (KEC vs KC(M)).
- **1 of top-15 is UDF-Christian-only** (Thiruvalla — KEC on UDF, INC or LDF non-Christian-party on LDF).
- LDF (via KC(M)) chose to put a Christian-party candidate at 9 of the top-15 high-Christian seats. UDF (via KEC + KC-Jacob) chose to do so at only 4 of the top-15. **UDF more often chose to contest high-Christian seats with an INC candidate; LDF more often used KC(M).**

> ### Open: where do parties traditionally contest with Christian candidates?
>
> Distinct from "Christian *party*" allocation: at high-Christian seats, do
> INC and CPI(M) field Christian *candidates* even when there's no Christian
> party in the formal coalition? E.g., Puthuppally (Oommen Chandy / Chandy
> Oommen — both Christian; INC); Udumbanchola, Ettumanoor, Angamaly winners.
> This requires candidate-religion data we don't currently have. Would
> sharpen the "Christian community vote vs Christian party vote" distinction.

---

## 3. UDF wave + an additional Christian premium

This is what Section 1 already shows. The 2026 Christian premium (+4.6pp)
is roughly twice the 2021 premium (+2.1pp). Christians who had voted LDF
in 2021 — particularly KC(M) base, see §4a — moved to UDF.

---

## 4. Pattern in Central-5 — split by alliance treatment of Christian seats

Of the 47 Central-5 ACs, dropping the 5 "Other Central-5" seats (Wayanad
ACs 17/18/19, Aluva 76, Vaikom 95) which are neither Christian-belt nor
Muslim-belt, we focus on the three relevant subsets, plus the Muslim
slice tracked separately in §6:

| Subset | n | Mean Chr% | Mean ΔUDF |
|---|---|---|---|
| (a) Christian-party seats — UDF side (KEC/KC-Jacob) | 5 | 39.9 | **+8.8pp** |
| (b) Christian-party seats — LDF only (KC(M), no UDF Christian party) | 5 | 44.5 | **+7.2pp** |
| (c) High-Christian (≥30%) but no Christian party either side | 16 | 40.4 | **+11.9pp** |

(Statewide ΔUDF reference: ~+7pp.)

### 4a. UDF Christian-party seats — clean LDF-to-UDF switch at the wave rate

The 5 UDF-Christian-party seats inside Central-5 (Piravom, Kothamangalam,
Thodupuzha, Kaduthuruthy, Changanassery) gained UDF +8.8pp on average.
Approximately wave-sized, slightly above. KEC won all 5.

At KC(M) seats specifically, the LDF loss is **100% KC(M)-specific**: at
every KC(M) seat, ΔLDF = ΔKCM exactly. CPI(M) and CPI shares didn't move.
Only KC(M) bled, and most of it went to UDF.

### 4b. Christian-majority LDF-only seats — also wave-sized

The 5 LDF-Christian-only Central-5 seats (Idukki, Pala, Kanjirappally,
Poonjar, Perumbavoor): ΔUDF +7.2pp on average. Pala (−12.9pp) drags this
down — without Pala, mean ΔUDF +12.7pp. **Pala is the only seat in this
group where the entire pattern reverses** (Mani C. Kappan personal-vote
shift to LDF; BJP marquee Christian candidate Shone George — NDA gained
+18.2pp).

### 4c. High-Christian seats with no Christian party — biggest movers

**16 ACs in Central-5** with ≥30% Christian and no Christian party on
either ballot: ΔUDF **+11.9pp**, well above the wave.

```
AC 75  ANGAMALY        (ernakulam)        chr 64.5%  ΔUDF  +8.3pp
AC 77  KALAMASSERY     (ernakulam)        chr 33.9%  ΔUDF +10.1pp
AC 78  PARAVUR         (ernakulam)        chr 33.5%  ΔUDF  -2.3pp ← only negative
AC 79  VYPEN           (ernakulam)        chr 41.0%  ΔUDF +15.5pp
AC 80  KOCHI           (ernakulam)        chr 40.0%  ΔUDF +16.7pp
AC 81  THRIPUNITHURA   (ernakulam)        chr 33.9%  ΔUDF  +3.7pp
AC 82  ERANAKULAM      (ernakulam)        chr 33.9%  ΔUDF +15.8pp
AC 83  THRIKKAKARA     (ernakulam)        chr 33.9%  ΔUDF +16.1pp
AC 84  KUNNATHUNAD     (ernakulam)        chr 34.7%  ΔUDF +11.9pp
AC 86  MUVATTUPUZHA    (ernakulam)        chr 40.4%  ΔUDF +16.4pp
AC 88  DEVIKULAM       (idukki)           chr 31.8%  ΔUDF  +1.2pp ← reserved (ST)
AC 89  UDUMBANCHOLA    (idukki)           chr 48.3%  ΔUDF +22.6pp ← biggest in Kerala
AC 92  PEERUMADE       (idukki)           chr 41.3%  ΔUDF +11.4pp ← reserved (SC)
AC 96  ETTUMANOOR      (kottayam)         chr 44.6%  ΔUDF +17.5pp
AC 97  KOTTAYAM        (kottayam)         chr 41.1%  ΔUDF  +7.2pp
AC 98  PUTHUPPALLY     (kottayam)         chr 49.1%  ΔUDF +17.8pp ← Chandy legacy
```

- 13 of 16 swung +7pp or more (above statewide); 11 of 16 swung +10pp or more.
- These are mostly Ernakulam city + Kottayam non-KC(M) seats. INC contested directly on the UDF side at all of these.

### What this comparison says

(a) and (b) — both Christian-party-allocated subsets — moved roughly
with the statewide wave (+8.8 and +7.2pp). (c) — non-Christian-party-
allocated high-Christian seats — moved much faster (+11.9pp).

> **Hypothesis (to test more carefully):** UDF's "field Christian
> candidates directly via INC at high-Christian seats" strategy
> outperformed its "delegate to KEC alliance" strategy this cycle.
> Where INC/Congress put up its own (often Christian) candidate at a
> high-Christian seat, the swing was large. Where UDF outsourced the
> seat to KEC, the swing was wave-sized.
>
> **Alternative explanation (must rule out):** KEC-allocated UDF seats
> already started from very high UDF baselines (Piravom 53.8%,
> Thodupuzha 48.6%, Kaduthuruthy 45.4%) — there's less ceiling, so the
> swing is mechanically smaller. The non-Christian-party high-Christian
> seats started from lower UDF baselines and had more room to grow.
>
> Both effects are probably real. We can't fully separate them from
> aggregate Δshare — would need ceiling-adjusted regression to be sure.

---

## 5. Bin-sliced correlation

### 5.1 ΔUDF by Christian-share bin (all 140 ACs)

| Bin | n | ΔUDF | ΔLDF | ΔNDA |
|---|---|---|---|---|
| <5% | 44 | +6.83 | −7.42 | +1.47 |
| 5-15% | 25 | +5.38 | −7.55 | +3.42 |
| 15-30% | 37 | +6.95 | −6.94 | +0.92 |
| 30-40% | 13 | **+9.45** | −6.96 | +3.19 |
| ≥40% | 21 | **+9.78** | −8.46 | +2.94 |

Above 30% Christian share, ΔUDF jumps from ~7pp to ~10pp. The +3pp premium on top of the statewide wave is visible in raw means.

### 5.2 ΔUDF by bin × Christian-party-seat flag

| Christian bin | Christian-party seat | No Christian party |
|---|---|---|
| <5% | n=0, n/a | n=44, +6.83pp |
| 5-15% | n=1, +2.53pp | n=24, +5.50pp |
| 15-30% | n=4, +9.84pp | n=33, +6.60pp |
| 30-40% | n=2, +11.71pp | n=11, +9.04pp |
| **≥40%** | **n=11, +6.30pp** | **n=10, +13.61pp** |

At ≥40% Christian, ACs without any Christian party contesting swung
**+13.6pp** — more than double the +6.3pp at Christian-party-contested
seats in the same bin.

This is the central tension of the Christian-belt story:

- The "Christian community swung to UDF" effect is real — the +13.6pp at high-Christian, non-allied seats can't be explained by KC(M) defection alone (no KC(M) to defect from at those seats).
- BUT the "field-Christian-candidates-directly outperformed alliance-with-KEC" hypothesis (§4) is consistent with this number too.
- The same caveat from §4 applies: KEC-allocated seats started from high UDF baselines (less ceiling).

---

## 6. Muslim parallel

### 6.1 UDF baseline by Muslim-share bin

| Year | <10% | 10-25% | 25-50% | 50-70% | ≥70% | Statewide |
|---|---|---|---|---|---|---|
| 2011 | 47.5 | 45.1 | 43.7 | 47.0 | 57.0 | 46.2 |
| 2016 | 39.5 | 37.3 | 38.2 | 41.6 | 50.0 | 39.3 |
| 2021 | 39.4 | 36.7 | 38.6 | 43.3 | 50.6 | 39.3 |
| 2026 | 48.3 | 43.8 | 44.7 | 50.4 | **59.4** | 46.6 |

### 6.2 Muslim premium = (UDF at ≥70% Muslim) − (UDF statewide)

| Year | Premium |
|---|---|
| 2011 | +10.8pp |
| 2016 | +10.7pp |
| 2021 | +11.3pp |
| 2026 | +12.8pp |

### 6.3 ΔUDF by Muslim-share bin (2021→2026)

| Bin | n | ΔUDF |
|---|---|---|
| <10% | 27 | +8.89 |
| 10-25% | 52 | +7.10 |
| 25-50% | 40 | +6.08 |
| 50-70% | 10 | +7.12 |
| ≥70% | 11 | +8.77 |

### Findings

- **Muslim premium is structurally larger than the Christian premium and much more stable.** Muslim-heavy ACs have given UDF +10–13pp above statewide every cycle since 2011.
- **In 2026, the Muslim premium grew +1.5pp; the Christian premium grew +2.5pp.** Both grew, but the Christian premium is the bigger 2026 story.
- **The 2026 Muslim swing is wave-sized** (+8.77pp at ≥70% Muslim, ~1pp above statewide). Muslims didn't surge in 2026 — they just rode the wave from a higher baseline.
- **No LDF Muslim party of comparable scale** to KC(M) for Christians. Some minor LDF Muslim allies (INL, scattered independents) but no equivalent vehicle that could collapse. The Muslim story therefore cannot follow the same "LDF Muslim party wiped out, UDF Muslim party absorbed" pattern.

---

## Open questions / next investigations

1. **Candidate-religion data.** We can identify Christian *parties* (KEC, KC-Jacob, KC(M), KC(B)) but not Christian *candidates* fielded by non-Christian parties (INC, CPI(M)). Would let us properly separate "Christian community vote" from "Christian party vote."
2. **Pala (AC 93)** — the only seat in our Christian-party set where the pattern fully reverses. Worth its own paragraph for the contrast.
3. **Poonjar's NDA +22.9pp spike** — unexplained; need candidate-level lookup.
4. **Ceiling-adjusted ΔUDF regression** — to disentangle the "INC-direct vs KEC-alliance" hypothesis (§4) from the "high-baseline-less-headroom" alternative.
5. **Site placement** — whether to rewrite the Christian-belt section in place, expand it to multiple sub-sections, or split into a dedicated `community-belts` page. Decide after findings stabilise.
