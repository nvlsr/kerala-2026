# Christian-belt premium — deep dive

> **Status:** restructured around the chosen narrative arc. Six numbered
> sections — strategy → performance → assessment → takeaway-insight — with
> outliers identified for sensitivity tests.
>
> **Reproduce:** `bun run scripts/analyze-christian-belt.ts`
>
> **Religion in candidate names**: marked in parentheses next to each
> candidate (best inference from the name). `(?)` flags ambiguous —
> please overwrite with ground truth where I got it wrong.

---

## 1. Christians traditionally vote UDF — and gave UDF an extra premium in 2026

Comparing UDF performance in the rest of state vs ACs with ≥40% Christian
share: UDF consistently does better at Christian-heavy ACs.

**Christian premium = (UDF mean at ≥40% Christian) − (UDF statewide):**

| Year | UDF at ≥40% Chr | UDF statewide | Premium (all 21 ACs) | Premium (outliers dropped, 17 ACs) |
|---|---|---|---|---|
| 2011 | 48.8% / 49.2% | 46.2% | +2.6pp | +3.0pp |
| 2016 | 42.2% / 43.4% | 39.3% | +2.9pp | +4.1pp |
| 2021 | 41.4% / 41.9% | 39.3% | +2.1pp | +2.7pp |
| **2026** | **51.2% / 53.1%** | **46.6%** | **+4.6pp** | **+6.4pp** |

- Outlier-dropped column excludes Pala, Poonjar, Devikulam, Peerumade
  (personal-vote / reserved-seat distortions identified in §5).
- The premium has been real but historically modest (~2.5–4pp).
- **In 2026 it doubled to +4.6pp (raw) or +6.4pp (cleaned).** This is
  the second story of the Christian belt this cycle — UDF didn't just
  ride the statewide wave at Christian-heavy ACs, it gained an
  additional ~3–4pp on top of the baseline they have always had.
- This is consistent with Christians who voted LDF in 2021 swinging
  to UDF in 2026 (mechanism examined below).

---

## 2. Christian-party-reserved seats — for context

(These are not the protagonist of the analysis. They establish what
"Christian seat" means by alliance design before we look at outcomes.)

### 2.1 UDF Christian-party seats in 2026 (KEC + KC-Jacob, 9 ACs)

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

**8 of 9 won.** (Kanhangad was a low-Christian-share coalition allocation, not a Christian-belt seat.)

### 2.2 LDF Christian-party seats in 2026 (KC(M) + KC(B), 13 ACs)

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

**LDF Christian parties lost all 13.**

### 2.3 Common list — head-to-head (KEC vs KC(M), same AC, 2026)

| AC | Name | Chr% | KEC vote | KCM vote | UDF Δ | LDF Δ | UDF margin |
|---|---|---|---|---|---|---|---|
| 85 | Piravom | 42.1 | 59.2 | 29.7 | +5.4 | −8.1 | +29.5pp |
| 90 | Thodupuzha | 40.6 | 58.4 | 27.9 | +9.7 | −6.2 | +30.5pp |
| 94 | Kaduthuruthy | 44.1 | 56.8 | 31.5 | +11.4 | −10.6 | +25.3pp |
| 99 | Changanassery | 43.5 | 46.4 | 39.5 | +6.5 | −5.4 | +6.9pp |

**KEC won all 4 head-to-heads.**

### 2.4 Top 15 ACs by Christian share — UDF and LDF candidate breakdown

Religion of candidate is best inference from the name; please correct
the `(?)` and any others where I got it wrong.

| AC | Name | Chr% | UDF candidate (party) | LDF candidate (party) |
|---|---|---|---|---|
| 75 | Angamaly | 64.5 | Roji M. John (Christian) — INC | Saju Paul (Christian) — CPI(M) |
| 93 | Pala | 52.0 | (no formal UDF) — Mani C. Kappen contested as Independent (Christian) and won | Jose K. Mani (Christian) — KC(M) |
| 98 | Puthuppally | 49.1 | Adv. Chandy Oommen (Christian) — INC | K.M. Radhakrishnan (Hindu) — CPI(M) |
| 89 | Udumbanchola | 48.3 | Adv. Senapathy Venu (Hindu) — INC | K.K. Jayachandran (Hindu) — CPI(M) |
| 111 | Thiruvalla | 47.8 | Adv. Varghese Mammen (Christian) — KEC | Adv. Mathew T. Thomas (Christian) — Independent (was JD(S)/LDF in 2021) |
| 91 | Idukki | 47.3 | Roy K. Paulose (Christian) — INC | Roshy Augustine (Christian) — KC(M) |
| 112 | Ranni | 46.9 | Adv. Pazhakulam Madhu (Hindu) — INC | Adv. Pramod Narayan (Hindu) — KC(M) |
| 137 | Parassala | 45.1 | Neyyattinkara Sanal (Hindu) — INC | C.K. Hareendran (Hindu) — CPI(M) |
| 96 | Ettumanoor | 44.6 | Nattakom Suresh (Hindu) — INC | V.N. Vasavan (Hindu) — CPI(M) |
| 72 | Chalakudy | 44.4 | Saneeshkumar Joseph (Christian) — INC | Adv. Biju S. Chirayath (Christian) — KC(M) |
| 94 | Kaduthuruthy | 44.1 | Adv. Mons Joseph (Christian) — KEC | Nirmala Jimmy (Christian) — KC(M) |
| 99 | Changanassery | 43.5 | Vinu Job Kuzhimannil (Christian) — KEC | Adv. Job Maichil (Christian) — KC(M) |
| 100 | Kanjirappally | 43.0 | Rony K. Baby (Christian) — INC | Dr. N. Jayaraj (Hindu) — KC(M) |
| 85 | Piravom | 42.1 | Anoop Jacob (Christian) — KC(Jacob) | Sabu K. Jacob (Christian) — KC(M) |
| 101 | Poonjar | 41.5 | Adv. Sebastian M.J. (Christian) — INC | Adv. Sebastian Kulathunkal (Christian) — KC(M) |

**Pattern observation (counts of "Christian-party" in top 15):**

- **5 of top-15 are "neither"** — Angamaly, Puthuppally, Udumbanchola, Parassala, Ettumanoor — INC vs CPI(M), no Christian party.
- **6 of top-15 have only LDF Christian party (KC(M))** — UDF contests via INC; LDF via KC(M).
- **3 of top-15 have both** (head-to-head KEC vs KC(M)).
- **1 of top-15 has only UDF Christian party** (Thiruvalla — KEC).
- **LDF (via KC(M)) chose a Christian party at 9 of top-15. UDF chose KEC/KC-Jacob at only 4.**

UDF more often contested high-Christian seats with an INC candidate (often a Christian one) directly. LDF more often outsourced to KC(M).

---

## 3. UDF's Christian strategy in 2026 — three buckets

For the seats where UDF could plausibly win Christian votes, UDF used
three approaches:

### 3a. Christian-alliance approach — give the seat to KEC / KC-Jacob

9 seats. Concentrated in the central Christian belt (plus Kanhangad as a
coalition outlier). Won 8 of 9. KEC's own party-share grew an average of
~9pp at the seats it contested in both 2021 and 2026.

### 3b. Direct INC approach — INC fields its own candidate (often Christian)

At many high-Christian ACs, UDF didn't delegate to KEC. INC contested
directly, often with a Christian candidate (Roji M. John, Chandy Oommen,
Tony Chammany, Mathew Kuzhalnadan, Cyriac Thomas, Uma Thomas, Saneeshkumar
Joseph, Rony K. Baby, Sebastian M.J., etc.).

### 3c. The remaining seats

LDF-only Christian-party seats (UDF accepted KC(M) on the LDF side and
contested with INC anyway), and the "neither" seats — INC vs CPI(M) at
moderately Christian ACs. We treat these as "direct INC" too, since UDF's
side of the contest was simply INC.

> Strategy 3a vs 3b is the analytically interesting split. Strategy 3c
> is operationally indistinguishable from 3b on the UDF side.

---

## 4. UDF's Christian performance — where the swings actually came

Of the 47 Central-5 ACs (Idukki, Ernakulam, Kottayam, Wayanad,
Malappuram), excluding the 5 "doesn't fit Christian or Muslim" ACs
(Wayanad 17/18/19, Aluva 76, Vaikom 95):

| Subset | n | Mean Chr% | **Mean ΔUDF** |
|---|---|---|---|
| **(a) Christian-alliance seats** (KEC/KC-Jacob inside Central-5) | 5 | 39.9 | **+8.8pp** |
| **(b) Christian-majority, LDF-Christian only (no UDF Christian party)** | 5 | 44.5 | **+7.2pp** *(Pala outlier drags this)* |
| **(c) High-Christian (≥30%) but no Christian party either side** | 16 | 40.4 | **+11.9pp** |
| Muslim-heavy (≥50%) — tracked separately in §6 | 16 | 1.7 | +9.0pp |

Statewide ΔUDF reference: ~+7pp.

### 4a. Christian-alliance seats — wave-rate (~+8.8pp)

These are the 5 KEC/KC-Jacob seats inside Central-5 (Piravom,
Kothamangalam, Thodupuzha, Kaduthuruthy, Changanassery). UDF won all 5.
ΔUDF averaged +8.8pp — slightly above the statewide wave.

### 4b. LDF-Christian-only seats — TBC (Pala distorts)

The 5 LDF-Christian-only Central-5 seats (Idukki, Pala, Kanjirappally,
Poonjar, Perumbavoor) gained UDF +7.2pp on average. **Pala (−12.9pp) and
Poonjar (NDA +22.9pp via P.C. George moving to BJP) are personal-vote
outliers that distort this** — see §5 outlier handling.

Excluding Pala: mean ΔUDF +12.7pp. So if we drop the personal-vote
outlier, this bucket also looks more like §4c than §4a.

### 4c. High-Christian, no-Christian-party seats — biggest movers (+11.9pp)

This is where the Christian premium is concentrated. 16 ACs in
Central-5 with ≥30% Christian and no Christian party on either ballot.

---

## 5. Assessment — what worked

| Subset | ΔUDF | Strategy interpretation |
|---|---|---|
| 4a — KEC alliance | +8.8pp | Wave-rate. KEC won by big margins, but the swing on top of the baseline was modest. Possibly because these seats already had high UDF baselines (less ceiling). |
| 4b — LDF-Christian-only (clean, ex-Pala) | ~+12.7pp | Where INC contested the Christian-belt seat directly against KC(M), it picked up a large additional swing. |
| 4c — no Christian party either side | +11.9pp | INC contesting directly, with often a Christian INC candidate, picked up the biggest swings of the cycle in Christian areas. |

**Reading the data**: where INC put up its own (often Christian)
candidate at a high-Christian seat, the swing was large (+11–13pp).
Where UDF outsourced the seat to KEC, the swing was wave-sized
(~+8pp). The "go get Christian votes ourselves" strategy
substantially out-performed the "delegate to KEC alliance" strategy
this cycle.

**Caveat (must rule out before publishing)**: KEC-allocated seats had
high UDF baselines in 2021 (Piravom 53.8%, Thodupuzha 48.6%,
Kaduthuruthy 45.4%). Less ceiling = mechanically smaller Δ. Not yet
controlled for.

### Outliers — to identify and (optionally) drop before recomputing

These are the "personal vote bringing confusion to UDF impact analysis":

| AC | Name | Why it's an outlier | What it does to means |
|---|---|---|---|
| 93 | Pala | Mani C. Kappan (Christian) ran as Independent and won; Jose K. Mani contested for KC(M); Shone George (Christian) was BJP marquee. Three-way personal-vote contest; alliance-tagging is broken. | Pulls 4b ΔUDF down from ~+12.7 to +7.2pp. |
| 101 | Poonjar | P.C. George moved his personal vote from KJ(S) (2021, OTHER) to BJP (2026, NDA), giving NDA +22.9pp. UDF still gained but the alliance Δ math is muddied. | Inflates 4b ΔNDA; ΔUDF less affected. |
| 78 | Paravur | V.D. Satheesan (Hindu, INC, Leader of Opposition) lost ground locally despite statewide UDF wave. Personality-of-the-LoP story; only seat in 4c with negative ΔUDF. | Drags 4c mean by ~1pp. |
| 88 | Devikulam | Reserved (ST). Idukki ST seat with NDA +13.5pp anomaly (BJP didn't contest 2021 here?). Different dynamics from religion-driven analysis. | Drags 4c mean. |
| 92 | Peerumade | Reserved (SC). Same caveat — different dynamics. | Worth flagging, though Δ here was wave-sized. |
| 111 | Thiruvalla | Three-way fragmentation: KEC won, BJP marquee Anoop Antony (Christian, +14.5pp NDA), JD(S) → Independent Mathew T. Thomas (Christian) split LDF vote. | Compresses ΔUDF at a KEC seat. |

### Recomputed means with outliers dropped

Reproduce: `bun run scripts/recompute-christian-belt-no-outliers.ts`

Outliers dropped: Pala (93), Poonjar (101), Paravur (78), Devikulam
(88), Peerumade (92), Thiruvalla (111).

| Subset | With outliers | **Without outliers** |
|---|---|---|
| 4a. KEC/KC-Jacob alliance | +8.78pp (n=5) | +8.78pp (n=5) — no outliers in this group |
| 4b. LDF-Christian-only | +7.20pp (n=5) | **+11.39pp (n=3)** — Pala+Poonjar were dragging it down |
| 4c. High-Christian, no Christian party | +11.86pp (n=16) | **+13.81pp (n=13)** — Paravur+Devikulam+Peerumade were dragging it down |

After outlier removal:

- **4b ≈ 4c**: When INC contests a Christian seat directly (whether
  KC(M) is on the LDF side or not), UDF gains ~+11.4–13.8pp.
- **4a is meaningfully lower**: KEC alliance seats only gain +8.8pp.
- The (a) vs (c) gap was 3.1pp before outlier removal; **5.0pp after**.
  Outlier removal *strengthens* the "INC-direct out-performed
  KEC-alliance" claim.

### Ceiling-adjusted view (Δ as % of headroom)

To rule out the "high-baseline = less room to grow" alternative:
divide ΔUDF by (100 − UDF2021) to express each gain as a fraction of
the available headroom.

| Subset | Mean UDF 2021 | ΔUDF | Δ as % of headroom |
|---|---|---|---|
| 4a. KEC alliance | 46.0% | +8.78pp | 16.2% |
| 4b. LDF-only (cleaned) | 38.1% | +11.39pp | 18.6% |
| 4c. No Christian party (cleaned) | 40.8% | +13.81pp | **23.1%** |
| Muslim-heavy reference | 49.1% | +8.98pp | 17.6% |

Even after controlling for headroom, (c) still gains markedly more
than (a) — 23.1% of available headroom vs 16.2%. The "INC-direct"
seats consumed roughly 7pp more of the headroom than KEC-alliance
seats did. The high-baseline argument explains some of the gap, but
not all of it. **The strategy claim survives both outlier removal and
ceiling adjustment.**

### Bin-sliced ΔUDF — outliers dropped (cleanest comparison)

| Christian bin | All ACs in bin | Christian-party seat | No Christian party |
|---|---|---|---|
| <5% | n=44, +6.83pp | n=0, n/a | n=44, +6.83pp |
| 5–15% | n=25, +5.38pp | n=1, +2.53pp | n=24, +5.50pp |
| 15–30% | n=37, +6.95pp | n=4, +9.84pp | n=33, +6.60pp |
| 30–40% | n=11, +11.27pp | n=2, +11.71pp | n=9, +11.18pp |
| **≥40%** | **n=17, +11.22pp** | **n=8, +8.24pp** | **n=9, +13.86pp** |

At ≥40% Christian (cleaned): no-Christian-party seats swung +13.86pp,
Christian-party seats +8.24pp. **Gap of 5.6pp** — bigger than the raw
gap (5.4pp before cleaning), much cleaner attribution.

---

## 6. The takeaway insight — the 16 ACs that drove the premium

At ≥40% Christian, ACs without any Christian party contesting swung
**+13.6pp** (n=10), more than double the +6.3pp at Christian-party-
contested seats in the same bin (n=11).

Below: the 16 high-Christian (≥30%) Central-5 ACs with no Christian
party either side — these are the cleanest test of cross-community
Christian shift, because there's no Christian-party mechanic to
absorb the swing into party-share.

| AC | Name (district) | Chr% | UDF candidate (party) | ΔUDF | NDA candidate (party) | NDA 2026 | ΔNDA |
|---|---|---|---|---|---|---|---|
| 75 | Angamaly (Ernakulam) | 64.5 | Roji M. John (Christian) — INC | +8.3 | (BJP, no marquee) | 7.6% | +1.3 |
| 77 | Kalamassery (Ernakulam) | 33.9 | Adv. V.E. Abdul Gafoor (Muslim) — IUML | +10.1 | BDJS | 8.7% | +1.5 |
| 78 | Paravur (Ernakulam) | 33.5 | Adv. V.D. Satheesan (Hindu) — INC | **−2.3** | Valsala Prasannakumar (Hindu) — BJP | 12.8% | +4.7 |
| 79 | Vypen (Ernakulam) | 41.0 | Tony Chammany (Christian) — INC | +15.5 | Anitha Thomas (Christian) — Twenty 20 | 10.4% | −12.7 |
| 80 | Kochi (Ernakulam) | 40.0 | Mohammed Shiyas (Muslim) — INC | +16.7 | Adv. Xavier Julappan (Christian) — Twenty 20 | 8.9% | −14.9 |
| 81 | Thripunithura (Ernakulam) | 33.9 | Deepak Joy (Christian) — INC | +3.7 | Anjali P.V. (Hindu) — Twenty 20 | 19.2% | +4.0 |
| 82 | Eranakulam (Ernakulam) | 33.9 | T.J. Vinod (Hindu) — INC | +15.8 | P.R. Sivasankar (Hindu) — BJP | 18.0% | −6.3 |
| 83 | Thrikkakara (Ernakulam) | 33.9 | Uma Thomas (Christian) — INC | +16.1 | Akhil Raj/Marar (Hindu) — Twenty 20 | 15.4% | −6.1 |
| 84 | Kunnathunad (Ernakulam) | 34.7 | V.P. Sajeendran (Hindu) — INC | +11.9 | Babu Divakaran (Hindu) — Twenty 20 | 25.1% | −7.1 |
| 86 | Muvattupuzha (Ernakulam) | 40.4 | Dr. Mathew Kuzhalnadan (Christian) — INC | +16.4 | Sunny Kadoothazhe (Christian) — Twenty 20 | 6.7% | −7.9 |
| 88 | Devikulam (Idukki) — **ST reserved** | 31.8 | F. Raja (Christian) — INC | +1.2 | S. Rajendran (Hindu) — BJP | 13.5% | +13.5 |
| 89 | Udumbanchola (Idukki) | 48.3 | Adv. Senapathy Venu (Hindu) — INC | **+22.6** | Adv. Sangeetha Viswanadhan (Hindu) — BDJS | 8.4% | +2.7 |
| 92 | Peerumade (Idukki) — **SC reserved** | 41.3 | Adv. Cyriac Thomas (Christian) — INC | +11.4 | Ratheesh Varakumala (Hindu) — BJP | 7.6% | +2.0 |
| 96 | Ettumanoor (Kottayam) | 44.6 | Nattakom Suresh (Hindu) — INC | +17.5 | Athira D. Nair (Hindu) — Twenty 20 | 10.6% | −0.3 |
| 97 | Kottayam (Kottayam) | 41.1 | Thiruvanchoor Radhakrishnan (Hindu) — INC | +7.2 | P. Anilkumar (Hindu) — BDJS | 8.6% | +1.5 |
| 98 | Puthuppally (Kottayam) | 49.1 | Adv. Chandy Oommen (Christian) — INC | +17.8 | Raveendranath Vakathanam (Hindu) — BJP | 9.0% | +0.2 |

### Patterns visible in the table

- **13 of 16 swung +7pp or more (above wave); 11 of 16 swung +10pp or more.** This is the strongest cross-community Christian shift in the dataset.
- **The biggest swings are clustered around Ernakulam city** (Vypen +15.5, Kochi +16.7, Eranakulam +15.8, Thrikkakara +16.1, Muvattupuzha +16.4) and **central Kottayam** (Ettumanoor +17.5, Puthuppally +17.8). Both clusters are urban / semi-urban, high-Christian, INC-direct.
- **NDA's pattern in this 16-AC subset is consistent with the Twenty 20 narrative:** at the Ernakulam city ACs where Twenty 20 fielded candidates, BJP/BDJS effectively didn't contest. Twenty 20 absorbed the NDA-tagged vote. ΔNDA went *negative* at Vypen (−12.7), Kochi (−14.9), Eranakulam (−6.3), Thrikkakara (−6.1), Kunnathunad (−7.1), Muvattupuzha (−7.9). NDA's "loss" here is not a community shift — it's an alliance-tagging effect (Twenty 20 was OTHER in 2021, NDA in 2026, but votes went elsewhere).
- **Outliers in this subset**:
  - **Devikulam** (ST reserved, Idukki) and **Peerumade** (SC reserved, Idukki) — reserved-seat dynamics, not religion-driven; either drop or footnote.
  - **Paravur** is the only negative ΔUDF — V.D. Satheesan's home seat. Personality story.
  - **Udumbanchola +22.6pp** is the single largest UDF swing anywhere in Kerala. Worth a single sentence in the prose.

### Counter to the "premium = mechanical KC(M) defection" story

Most of these 16 ACs **had no KC(M) candidate to defect from on the LDF
side**. The LDF candidate was CPI(M) or CPI; the swing toward UDF
therefore can't be the "KC(M) base moved to UDF" mechanism. It has to
be a broader community shift.

That shift averaged +11.9pp at these 16 ACs — well above the +7pp
statewide wave. Roughly +5pp of community-driven premium on top of the
wave. That matches the +4.6pp 2026 Christian premium identified in §1.

---

## Open questions / next investigations

1. ✅ **Candidate religion verified** by user across §2.4 and §6.
2. ✅ **Outlier-dropped recomputation** done — see §5. (a) vs (c) gap *widened* from 3.1pp to 5.0pp. Strategy claim strengthens.
3. ✅ **Ceiling-adjusted view** done — see §5. Even controlling for headroom, (c) consumed 23.1% of available room vs (a)'s 16.2%. Strategy claim survives.
4. **Site placement decision** — pending. Now that §1–§5 findings are stable: rewrite the Christian-belt section in place, expand to multi-section, or split off into `community-belts` page?

## Stable findings (ready to promote, pending site-placement decision)

1. Christians have voted UDF more than statewide in every cycle since 2011 — historical premium ~3pp (cleaned).
2. **In 2026 the premium more than doubled** to +6.4pp (cleaned), or +4.6pp (raw). UDF gained an extra ~3–4pp on top of its historical Christian-belt baseline.
3. **LDF Christian parties (KC(M), KC(B)) lost all 13 seats they contested.** UDF Christian parties (KEC, KC-Jacob) won 8 of 9. Where head-to-head (4 seats), KEC won by 7–30pp.
4. **At KC(M) seats, ΔLDF = ΔKCM seat by seat.** LDF's loss in those seats was 100% KC(M)-specific.
5. **The premium is mostly driven by INC-direct seats, not KEC-alliance seats.** Where INC fielded its own candidate at a high-Christian seat (often a Christian INC candidate), ΔUDF +13.8pp. Where UDF outsourced to KEC, ΔUDF +8.8pp. Gap survives outlier removal AND ceiling adjustment.
6. **At ≥40% Christian + no Christian party either side, ΔUDF +13.86pp** — vs +8.24pp at the same bin where a Christian party contested. The 16-AC table in §6 is the clean evidence.
7. **Pala is the structural counter-example** — Mani C. Kappan personal vote + Shone George BJP marquee broke the community-vote pattern.
8. **The Muslim story is structurally different** — premium is bigger (+12.8pp at ≥70% Muslim) but more stable; the 2026 Muslim swing was wave-sized, not amplified. Should be its own section, not merged with Christian.
