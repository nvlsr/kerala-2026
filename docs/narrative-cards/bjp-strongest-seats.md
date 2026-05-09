# Where BJP performed strongest in Kerala 2026 — three cohorts

Three slices of "doing well," each capturing a different dimension of strength. A seat can qualify for multiple cohorts; cross-cohort membership is shown at the bottom.

## Methodology — effective baselines

Comparing 2016/2021/2026 BJP-only shares produces misleadingly large Δs when BJP didn't field but BDJS/Twenty20 did, or when the same individual ran under a different party. To prevent this, we compute an **effective NDA baseline** at each AC for each cycle, in priority order:

1. **BJP share** if BJP fielded a candidate
2. **Same-individual share under any party** if the 2026 BJP candidate ran at the same AC under another flag (e.g. P.C. George at Poonjar — Independent 2016, KJS 2021, BJP 2026)
3. **BDJS share** if BJP didn't field but BDJS did
4. **Twenty 20 share** if neither BJP nor BDJS fielded but T20 did
5. **0%** otherwise (no NDA-aligned vehicle present)

Candidate continuity is resolved via `data/candidate-aliases.json`. Source field used in the tables: shows which vehicle / individual contributed the baseline at that cycle.

The most consequential alias-corrected case: **Poonjar**. P.C. George had 44.9% as Independent in 2016, 29.9% as KJS in 2021, and 25.1% as BJP in 2026 — a steady **personal-vote decline of ~20pp across three cycles**. The naïve BJP-only comparison would show "Poonjar BJP +25.1pp in 2026" — a complete inversion of what's actually happening.

---

## Cohort 1 — Mature base + successful growth

**Definition**: 2026 BJP share ≥ 25% **AND** 2021→2026 Δ ≥ +5pp (using effective baselines). Seats with structural BJP presence that *also* grew this cycle. The most demanding cohort — must have both presence and momentum.

**8 seats qualify.**

| AC | Name | District | H/C/M | 2016 | 2021 | 2026 | Δ21-26 | Outcome | 2026 BJP candidate |
|---|---|---|---|---:|---:|---:|---:|---|---|
| 135 | **Nemom** | Trivandrum | 69/16/13 | 48.2% | 35.5% | 40.9% | **+5.4** | **BJP win** | Rajeev Chandrasekhar |
| 126 | **Chathannoor** | Kollam | 72/13/14 | 25.1% | 30.6% | 38.2% | **+7.6** | **BJP win** | B.B. Gopakumar |
| 132 | **Kazhakoottam** | Trivandrum | 69/16/13 | 32.5% | 29.1% | 35.7% | **+6.6** | **BJP win** | V. Muraleedharan |
| 111 | Thiruvalla | Pathanamthitta | 48/47/3 | 21.9% (BDJS) | 16.2% | 30.7% | **+14.5** | UDF | Anoop Antony |
| 68 | Nattika | Thrissur | 63/16/19 | 22.6% (BDJS) | 22.0% | 29.0% | **+7.0** | LDF | C.C. Mukundan |
| 27 | Kozhikode North | Kozhikode | 56/1/41 | 22.8% | 22.5% | 28.3% | **+5.8** | UDF | Navya Haridas |
| 93 | Pala | Kottayam | 37/52/10 | 17.9% | 7.9% | 26.1% | **+18.2** | UDF | Shone George |
| 52 | Ottappalam | Palakkad | 54/2/43 | 18.7% | 15.5% | 25.1% | **+9.6** | LDF | Major Ravi |

**Observations.** All 3 BJP wins are in this cohort. Trivandrum belt accounts for 3 of 8 (Nemom, Kazhakoottam, plus Chathannoor in adjacent Kollam district). The remaining 5 are scattered: 2 Christian-mixed Central Kerala (Thiruvalla, Pala — both with marquee Christian candidates), 1 Hindu-Muslim Thrissur (Nattika), 1 Hindu-Muslim Kozhikode (Kozhikode North), 1 Hindu-Muslim Palakkad (Ottappalam). Of these 5 non-belt mature-grower seats, all lost — none converted to a win. **Poonjar dropped out** of this cohort under effective-baseline accounting: P.C. George's vote shrank steadily from 45% (Indep 2016) → 30% (KJS 2021) → 25% (BJP 2026), so Δ21-26 effective is −4.8pp, failing the threshold.

---

## Cohort 2 — Consistent multi-cycle growth

**Definition**: BJP / NDA-vehicle share grew by **≥ +2pp in *both* cycles** (2016→2021 *and* 2021→2026), AND 2016 baseline > 0% (NDA had a candidate fielded that cycle, so "growth" is real not "showed up"). Captures durable upward trajectory.

**4 seats qualify.**

| AC | Name | District | H/C/M | 2016 | 2021 | 2026 | Δ16-21 | Δ21-26 | Cumul. | Outcome |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---|
| 126 | **Chathannoor** | Kollam | 72/13/14 | 25.1% | 30.6% | 38.2% | +5.5 | +7.6 | **+13.1** | **BJP win** |
| 107 | Haripad | Alappuzha | 79/9/11 | 8.9% | 11.9% | 21.5% | +3.0 | +9.6 | **+12.6** | UDF |
| 128 | Attingal | Trivandrum | 69/16/13 | 20.4% | 25.9% | 30.8% | +5.5 | +4.9 | **+10.4** | LDF |
| 28 | Kozhikode South | Kozhikode | 56/1/41 | 16.8% (BDJS) | 20.9% | 25.6% | +4.1 | +4.7 | **+8.8** | UDF |

**Observations.** The strict cohort — only 4 seats show meaningful sustained growth across both cycles from a real NDA baseline. **Chathannoor is the only seat that converted sustained build into a 2026 win.** Haripad (Alappuzha), Attingal (Trivandrum belt), Kozhikode South (Kozhikode) all show durable upward trajectories but lost in 2026. Note that 2 of 4 (Haripad, Kozhikode South) are Hindu-Muslim mix with very low Christian share — the same demographic profile that dominates the Trivandrum belt.

---

## Cohort 3 — New growth from a low base

**Definition**: 2021 effective NDA baseline < 10% **AND** 2021→2026 Δ ≥ +10pp. Seats where NDA went from negligible-to-meaningful in one cycle.

**6 seats qualify.**

| AC | Name | District | H/C/M | 2016 | 2021 | 2026 | Δ21-26 | Outcome | 2026 BJP candidate | Pattern |
|---|---|---|---|---:|---:|---:|---:|---|---|---|
| 93 | Pala | Kottayam | 37/52/10 | 17.9% | 7.9% | 26.1% | **+18.2** | UDF | Shone George | Marquee Christian fielding |
| 63 | Guruvayoor | Thrissur | 40/6/52 | 17.5% | 0.0%* | 17.9% | **+17.9** | LDF | Adv. B. Gopalakrishnan | Re-entry after non-fielding |
| 13 | Thalassery | Kannur | 61/1/36 | 16.8% | 0.0%* | 15.8% | **+15.8** | LDF | O. Nidheesh | Re-entry after non-fielding |
| 88 | Devikulam | Idukki | 60/31/7 | 8.3% | 0.0%* | 13.5% | **+13.5** | UDF | S. Rajendran | Re-entry after non-fielding |
| 116 | Karunagappally | Kollam | 65/5/28 | 11.9% (BDJS) | 7.0% | 18.7% | **+11.6** | UDF | V.S. Jithin Dev | Marquee priority + sustained build |
| 127 | Varkala | Trivandrum | 71/3/25 | 15.7% (BDJS) | 8.3% (BDJS) | 19.9% | **+11.6** | LDF | Adv. Smitha Sundaresan | BDJS → BJP slot rotation |

*\*BJP didn't field in 2021; no other NDA vehicle present.*

**Observations.** Most "new growth" cases are **re-entries** (BJP fielded in 2016, sat out 2021, returned in 2026) or seats where BJP sat above the 2026 base in 2016 already — so they're more accurately recoveries than new growth. **Pala is the cleanest** new-base build with marquee — was 17.9% in 2016, dipped to 7.9% in 2021, jumped to 26% with Shone George. **Karunagappally is the only seat with sustained build** across both cycles AND a low-base origin (BDJS 11.9% → BJP 7.0% → BJP 18.7%). Poonjar previously appeared here with +22.9pp; under candidate-continuity accounting it correctly drops out (P.C. George had 30% in 2021, not 0%).

---

## Cross-cohort membership

| Membership | Seats |
|---|---|
| Cohort 1 ∩ Cohort 2 (mature base + consistent multi-cycle build) | **Chathannoor** |
| Cohort 1 ∩ Cohort 3 (mature now, reached via low-base jump) | **Pala** |
| Cohort 2 ∩ Cohort 3 (consistent build *from* a low base) | (none) |
| Cohort 1 ∩ 2 ∩ 3 (all three) | (none) |

**Chathannoor is the only seat that satisfies both Cohort 1 and Cohort 2** — it has the structural strength (38.2% share), the recent-cycle growth (+7.6pp Δ21-26), AND the durable build across two cycles (+5.5pp Δ16-21). And it won. **It is BJP's single strongest performance in Kerala 2026** by every "doing well" measure simultaneously.

**Pala is the cleanest "rebuilt from a 2021 dip"** — was 17.9% in 2016, dipped to 7.9% in 2021, jumped to 26.1% in 2026 with Shone George. Both mature-now and recovered-from-low.

---

## Cohort 4a — Declining mature

**Definition**: 2021 effective NDA baseline ≥ 20% **AND** 2021→2026 Δ ≤ −2pp. Seats where BJP had a meaningful base going in but *lost ground* this cycle. The "actively eroding" set.

**8 seats qualify.**

| AC | Name | District | H/C/M | 2021 base | 2026 BJP | Δ21-26 | Outcome | 2026 BJP candidate |
|---|---|---|---|---:|---:|---:|---|---|
| 114 | Konni | Pathanamthitta | 61/33/5 | 21.9% (BJP) | 0.0% | **−21.9** | LDF | (no BJP — withdrew) |
| 67 | Thrissur | Thrissur | 54/39/5 | 31.3% (BJP) | 23.3% | **−8.0** | UDF | Padmaja Venugopal |
| 101 | Poonjar | Kottayam | 42/41/16 | 29.9% (P.C. George/KJS) | 25.1% | **−4.8** | UDF | P.C. George |
| 109 | Mavelikkara | Alappuzha | 73/18/7 | 20.5% (BJP) | 16.3% | **−4.2** | LDF | K. Ajimon |
| 70 | Irinjalakuda | Thrissur | 63/26/9 | 22.1% (BJP) | 17.9% | **−4.2** | UDF | Santhosh Cherakulam |
| 71 | Pudukkad | Thrissur | 58/35/5 | 22.3% (BJP) | 18.3% | **−4.0** | LDF | Parameswaran A |
| 51 | Shornur | Palakkad | 60/1/37 | 24.3% (BJP) | 20.9% | **−3.4** | LDF | Adv. Sanku T. Das |
| 2 | Kasaragod | Kasaragod | 43/2/53 | 34.9% (BJP) | 31.9% | **−3.0** | UDF | Ashwini M.L. |

**Observations.** **5 of 8 declining-mature seats are Hindu+Christian** (Konni 33% C, Thrissur 39%, Mavelikkara 18%, Irinjalakuda 26%, Pudukkad 35%). One more is Christian-mixed (Poonjar 41%). That's **6 of 8 = 75% of the declining-mature cohort sitting in seats with significant Christian populations**. The Hindu+Christian terrain is BJP's most active erosion zone in 2026.

This is striking when read against bjp-1.md's Section 3 ("Kottayam experimental") which highlights Pala, Thiruvalla, Poonjar as marquee Christian-candidate successes. The data show: where BJP deployed marquee Christian candidates in Hindu+Christian terrain (Pala, Thiruvalla), it gained. Where BJP fielded *non-marquee* candidates in similar terrain (Mavelikkara, Irinjalakuda, Pudukkad), it *declined*. The marquee Christian strategy is doing real work against an underlying erosion pattern. Without it, BJP is losing Hindu+Christian terrain.

Special case: **Thrissur with Padmaja Venugopal**. She was previously INC at Thrissur (2016, 37% as Congress candidate) and defected to BJP for 2026. Despite BJP itself fielding both years, the seat declined 8pp from 2021 to 2026 (different BJP candidates). The marquee-Christian strategy's effect is heterogeneous within Hindu+Christian terrain — Pala/Thiruvalla worked, Thrissur didn't.

---

## Cohort 4b — Stable mature

**Definition**: 2021 effective NDA baseline ≥ 20% **AND** |Δ21-26| < 2pp (movement within noise). Seats where BJP held a meaningful base but didn't grow or shrink meaningfully — saturation at a ceiling.

**8 seats qualify.**

| AC | Name | District | H/C/M | 2021 base | 2026 BJP | Δ21-26 | Outcome | 2026 BJP candidate |
|---|---|---|---|---:|---:|---:|---|---|
| 1 | Manjeshwar | Kasaragod | 44/2/53 | 37.7% (BJP) | 36.1% | −1.6 | UDF | K. Surendran (state pres) |
| 56 | Palakkad | Palakkad | 62/2/34 | 35.3% (BJP) | 33.5% | −1.8 | UDF | Sobha Surendran |
| 55 | Malampuzha | Palakkad | 62/2/34 | 30.7% (BJP) | 30.4% | −0.3 | LDF | C. Krishnakumar |
| 133 | Vattiyoorkavu | Trivandrum | 69/16/14 | 28.8% (BJP) | 28.8% | +0.0 | UDF | R. Sreelekha |
| 110 | Chengannur | Alappuzha | 66/29/4 | 23.5% (BJP) | 22.6% | −0.9 | LDF | M.V. Gopakumar |
| 64 | Manalur | Thrissur | 56/19/24 | 21.8% (BJP) | 22.3% | +0.5 | LDF | Adv. K.K. Aneeshkumar |
| 129 | Chirayinkeezhu | Trivandrum | 69/16/13 | 21.4% (BJP) | 22.5% | +1.1 | UDF | B.S. Anoop |
| 100 | Kanjirappally | Kottayam | 46/42/10 | 21.2% (BJP) | 20.0% | −1.2 | UDF | Adv. George Kurian |

**Observations.** **The stable-mature seats are dominated by Hindu+Muslim terrain and the Trivandrum belt**, in contrast to Cohort 4a's Hindu+Christian skew. Manjeshwar, Palakkad, Malampuzha — all Hindu+Muslim with 30%+ Muslim share — are all near-flat at high BJP shares. These are the "BJP's ceiling" seats: they hold the share but can't grow further. Vattiyoorkavu and Chirayinkeezhu (Trivandrum belt) show the same pattern at lower 21-29% shares.

**Three of 8 stable-mature seats are also on BJP's priority list**: Manjeshwar, Palakkad, Vattiyoorkavu. **Priority placement plus stable-but-flat outcome = "tried hard, ceiling reached."** These are the seats that test BJP's structural ceiling in different terrains: Hindu-Muslim Kasaragod (Manjeshwar), Hindu-Muslim Palakkad (Palakkad), Trivandrum belt (Vattiyoorkavu). All three returned essentially the same share they had in 2021 despite marquee candidate placement.

**Kanjirappally** is interesting: marquee Christian candidate (George Kurian) both years, religious composition similar to Pala (46/42/10 vs Pala's 37/52/10), yet stable rather than growing. The marquee Christian strategy has limits even with the right demographics — Kerala Congress (M)'s Catholic-vote dominance there appears to be a hard ceiling.

---

## Combined view — "Plateaued mature"

**Cohorts 4a + 4b together = 16 seats** where BJP had ≥20% in 2021 but couldn't grow ≥+2pp by 2026. This is the saturation set: where BJP's structural presence has reached a ceiling, whether expressed as flat (4b) or active decline (4a).

The split between 4a and 4b is meaningful, not arbitrary:
- **Declining (4a)** is dominated by Hindu+Christian seats — terrain where BJP needs an active strategy (marquee Christian candidates) and absent that, *loses ground*.
- **Stable (4b)** is dominated by Hindu+Muslim seats and Trivandrum belt — terrain where BJP has a structural floor but also a structural ceiling.

Different strategic implications:
- **Hindu+Christian non-marquee seats** are losing voters BJP could potentially recover with the right candidate pivot (the Pala/Thiruvalla template).
- **Hindu+Muslim plateau seats** are at a ceiling that may not be breakable through candidate quality alone — Manjeshwar with the state president, Palakkad with Sobha Surendran, both flat.

---

## Cross-reference against the priority list

(See `bjp-priority-seats.md` for the priority list.)

| Priority seat | C1 (mature+grew) | C2 (consistent) | C3 (new low-base) | C4a (declining) | C4b (stable) |
|---|:---:|:---:|:---:|:---:|:---:|
| Manjeshwar | — | — | — | — | ✓ |
| Palakkad (Sobha Surendran) | — | — | — | — | ✓ |
| Thrissur (Padmaja Venugopal) | — | — | — | **✓** | — |
| Aranmula | — | — | — | — | — |
| Karunagappally | — | — | ✓ | — | — |
| Varkala | — | — | ✓ | — | — |
| Kazhakoottam | ✓ | — | — | — | — |
| Thiruvananthapuram | — | — | — | — | — |
| Nemom | ✓ | — | — | — | — |
| Vattiyoorkavu | — | — | — | — | ✓ |

**Sharper picture now**: of 10 priority seats, **8 appear in some cohort** (vs 4 before adding 4a and 4b). The new view:

- **2 priority seats produced "doing well" outcomes** (Nemom, Kazhakoottam — both wins, Cohort 1).
- **2 priority seats are new-growth from low base** (Karunagappally, Varkala — Cohort 3, both lost but moved meaningfully upward).
- **3 priority seats are stable mature** (Manjeshwar, Palakkad, Vattiyoorkavu — Cohort 4b: marquee candidates placed but ceiling held).
- **1 priority seat is actively declining** (Thrissur with Padmaja Venugopal — Cohort 4a: lost 8pp despite marquee placement).
- **Aranmula and Thiruvananthapuram appear in no cohort** — they're the "modest gain, didn't reach any threshold" priority seats.

The strongest "doing well" performers are still mostly **not on the priority list**: Nattika, Pala, Thiruvalla, Kozhikode North, Ottappalam, Chathannoor (officially ambiguous), Haripad, Attingal, Kozhikode South. Several seats produced strong returns BJP may not have publicly prioritised.

---

## Open questions for analysis

1. **Threshold tuning** — Cohort 1 thresholds (≥25% share, ≥+5pp Δ) yield 8 seats. Could tighten or loosen.
2. **Hindu+Christian erosion as a fourth article theme.** The Cohort 4a finding — 6 of 8 declining-mature seats have significant Christian populations — points to a real strategic story not currently in bjp-1.md: BJP is *losing* Hindu+Christian terrain where it doesn't deploy marquee Christian candidates. The Pala/Thiruvalla successes are exceptions to a broader decline, not the rule. Worth integrating into the article as either a falsification (the marquee strategy is necessary, not just sufficient) or a separate theme on the Hindu+Christian belt as contested ground.
3. **Hindu+Muslim ceiling as a fifth article theme.** Cohort 4b's stable-mature seats are dominated by Hindu+Muslim Kasaragod / Palakkad and Trivandrum belt — places where BJP has ceiling-bound presence (~30–37%) that isn't moving. If priority placement (Manjeshwar with state president, Palakkad with Sobha Surendran) couldn't break that ceiling, it suggests a structural limit BJP can't overcome through candidate quality alone. This is the inverse story to the Trivandrum belt's growth thesis.
4. **NDA-aggregate parallel** — should we compute all five cohorts using NDA-aggregate share? Would surface T20-Ernakulam patterns we'd otherwise miss.
5. **Geographic micro-clusters** — Cohort 1's Hindu-Muslim non-belt seats (Nattika, Kozhikode North, Ottappalam) and Cohort 2's Haripad + Kozhikode South suggest a possible secondary "Hindu-Muslim Central+North coastal" pattern. Combined with Cohort 4b's Hindu-Muslim plateau seats (Manjeshwar, Palakkad, Malampuzha), this might be a single coherent story: BJP has a Hindu+Muslim presence belt across Kerala — a few seats slowly building, more seats stuck at a ceiling. Worth examining as a possible fourth bjp-1.md theme.
