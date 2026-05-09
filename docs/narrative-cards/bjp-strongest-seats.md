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

## Cross-reference against the priority list

(See `bjp-priority-seats.md` for the priority list.)

| Priority seat | Cohort 1? | Cohort 2? | Cohort 3? |
|---|:---:|:---:|:---:|
| Manjeshwar | — | — | — |
| Palakkad (Sobha Surendran) | — | — | — |
| Thrissur (Padmaja Venugopal) | — | — | — |
| Aranmula | — | — | — |
| Karunagappally | — | — | ✓ |
| Varkala | — | — | ✓ |
| Kazhakoottam | ✓ | — | — |
| Thiruvananthapuram | — | — | — |
| Nemom | ✓ | — | — |
| Vattiyoorkavu | — | — | — |

**Only 4 of 10 priority seats appear in any cohort.** Three priority seats (Manjeshwar, Palakkad, Thrissur) appear in *no* cohort despite marquee placement — they're the "tried hard, didn't perform" set. The strongest "doing well" performers are mostly **not on the priority list**: Nattika, Pala, Thiruvalla, Kozhikode North, Ottappalam, Chathannoor (officially ambiguous), Haripad, Attingal, Kozhikode South. Several seats produced strong returns BJP may not have publicly prioritised.

---

## Open questions for analysis

1. **Threshold tuning** — Cohort 1 thresholds (≥25% share, ≥+5pp Δ) yield 8 seats. Could tighten to ≥30% / +7pp (~5 seats) or loosen to ≥20% / +3pp (~15-20 seats).
2. **Should we add a fourth cohort — declining mature base?** Seats with ≥25% in 2021 but Δ21-26 < 0 would surface BJP's *erosion* zones. Manjeshwar, Thrissur, Kanjirappally, Vattiyoorkavu would qualify. **Poonjar would also qualify here** — under effective-baseline accounting, P.C. George's personal-vote decline is the cleanest example of this pattern.
3. **NDA-aggregate parallel** — should we compute the same three cohorts using NDA-aggregate share instead of BJP-only? Would surface T20-Ernakulam strength patterns we'd otherwise miss.
4. **Geographic clustering** — Cohorts 1+2+3 contain seats from 9 districts. Are there micro-clusters within each cohort that aren't captured by the bjp-1.md "Trivandrum belt / Kottayam experimental / Ernakulam alliance" framework? Specifically: Cohort 1's Hindu-Muslim non-belt seats (Nattika, Kozhikode North, Ottappalam) and Cohort 2's Haripad + Kozhikode South suggest a possible secondary "Hindu-Muslim Central+North coastal" pattern that bjp-1.md doesn't currently capture.
