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

| Year | UDF at ≥40% Chr | UDF statewide | **Premium** |
|---|---|---|---|
| 2011 | 48.8% | 46.2% | +2.6pp |
| 2016 | 42.2% | 39.3% | +2.9pp |
| 2021 | 41.4% | 39.3% | +2.1pp |
| **2026** | **51.2%** | **46.6%** | **+4.6pp** |

- The premium has been real but historically modest (~2–3pp).
- **In 2026 it roughly doubled to +4.6pp.** This is the second story
  of the Christian belt this cycle — UDF didn't just ride the
  statewide wave at Christian-heavy ACs, it gained an additional
  ~2.5pp on top of the baseline they have always had.
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
| 137 | Parassala | 45.1 | Neyyattinkara Sanal (Hindu ?) — INC | C.K. Hareendran (Hindu) — CPI(M) |
| 96 | Ettumanoor | 44.6 | Nattakom Suresh (Hindu) — INC | V.N. Vasavan (Hindu) — CPI(M) |
| 72 | Chalakudy | 44.4 | Saneeshkumar Joseph (Christian) — INC | Adv. Biju S. Chirayath (Hindu ?) — KC(M) |
| 94 | Kaduthuruthy | 44.1 | Adv. Mons Joseph (Christian) — KEC | Nirmala Jimmy (Christian ?) — KC(M) |
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

> **Suggested next step for §5**: recompute means with Pala, Poonjar,
> Paravur, Devikulam, Peerumade dropped — see if the (a) vs (c) gap
> widens or narrows. The current write-up holds the analytic claim only
> if the gap survives outlier removal. Not yet done.

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
| 79 | Vypen (Ernakulam) | 41.0 | Tony Chammany (Christian) — INC | +15.5 | Anitha Thomas (Christian ?) — Twenty 20 | 10.4% | −12.7 |
| 80 | Kochi (Ernakulam) | 40.0 | Mohammed Shiyas (Muslim) — INC | +16.7 | Adv. Xavier Julappan (Christian) — Twenty 20 | 8.9% | −14.9 |
| 81 | Thripunithura (Ernakulam) | 33.9 | Deepak Joy (Christian ?) — INC | +3.7 | Anjali P.V. (Hindu) — Twenty 20 | 19.2% | +4.0 |
| 82 | Eranakulam (Ernakulam) | 33.9 | T.J. Vinod (Hindu ?) — INC | +15.8 | P.R. Sivasankar (Hindu) — BJP | 18.0% | −6.3 |
| 83 | Thrikkakara (Ernakulam) | 33.9 | Uma Thomas (Christian) — INC | +16.1 | Akhil Raj/Marar (Hindu) — Twenty 20 | 15.4% | −6.1 |
| 84 | Kunnathunad (Ernakulam) | 34.7 | V.P. Sajeendran (Hindu) — INC | +11.9 | Babu Divakaran (Hindu) — Twenty 20 | 25.1% | −7.1 |
| 86 | Muvattupuzha (Ernakulam) | 40.4 | Dr. Mathew Kuzhalnadan (Christian) — INC | +16.4 | Sunny Kadoothazhe (Christian ?) — Twenty 20 | 6.7% | −7.9 |
| 88 | Devikulam (Idukki) — **ST reserved** | 31.8 | F. Raja (?) — INC | +1.2 | S. Rajendran (Hindu) — BJP | 13.5% | +13.5 |
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

1. **Verify candidate religion** in the §2.4 and §6 tables. Mark `(?)` are best-guesses; user to confirm or correct. (A few are clearly inferred from name conventions; some are ambiguous — Joy, Jacob, T.J. initials.)
2. **Recompute §4 means after dropping personal-vote outliers** (Pala, Poonjar, Paravur, Devikulam, Peerumade) — does the (a) +8.8 vs (c) +11.9 gap widen or narrow? Test before publishing claims.
3. **Ceiling-adjusted ΔUDF** — does the (a) vs (c) gap survive after controlling for 2021 UDF baseline (KEC seats started higher, less headroom)?
4. **Site placement decision**: rewrite the Christian-belt section in place, expand to multi-section, or split off into `community-belts` page. Decide after #1–#3 settle.
