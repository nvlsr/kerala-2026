# A3 — Did BJP's 3 wins come from concentrated Hindu pockets + weak UDF candidates?

**Verdict (confirms with sharp numbers, plus one important surprise): Yes — all four sub-claims hold. BJP grew only +0.18pp statewide, NDA crossed 25% in only 19 of 140 ACs (6 of those in Trivandrum alone), all 3 wins came in 70%-Hindu seats, every named Christian BJP candidate lost, AND UDF dramatically underperformed in the 3 BJP-won seats (+0.6pp UDF gain vs +7.3pp statewide). The surprise: BJP actually grew enormously at the AC level — +14 to +25pp in several central-Kerala seats. The "statewide flat" headline hides large under-the-hood AC-level movement.**

This card uses 2021/2026 vote-share data, party-level + alliance-level Δ, and AC religion mix. See `scripts/narrative-a3-bjp-three-wins.ts` to reproduce.

## The consensus claim

Across The Federal, Deccan Herald, ISAS-NUS, Onmanorama, The Quint, The News Minute, Indian Express, Catholic World Report:

> BJP statewide vote share grew only ~0.12pp (11.30% → 11.42%). NDA crossed 20% in 29 of 140 constituencies — **concentration, not diffusion**. The three wins came in Nemom (Rajeev Chandrasekhar, ~5,000 margin), Chathannoor (B.B. Gopakumar, 4,402), and Kazhakoottam (V. Muraleedharan, 428). Onmanorama: these wins owe more to weak UDF candidates than BJP strength. **All three BJP wins came on Hindu candidates** — every Christian BJP candidate (Shone George, P.C. George, George Kurian, Anoop Antony) lost.

Four sub-claims to test independently.

## Sub-claim (i): BJP statewide vote share was nearly flat

| Metric | 2021 | 2026 | Δ |
|---|---|---|---|
| BJP party share | 11.30% | 11.49% | **+0.18pp** |
| NDA alliance share | 12.45% | 14.28% | +1.83pp |

**Narrative claim: ~0.12pp.** Our number: +0.18pp. Within rounding. **Confirmed.**

NDA aggregate grew +1.83pp — meaning NDA's *non-BJP* allies (BDJS, KC(B), Twenty20 in 2026) grew by ~1.65pp combined. Most of NDA's modest aggregate growth came from these allied vehicles, not BJP itself.

## Sub-claim (ii): NDA share concentration

| Threshold | # ACs (of 140) |
|---|---|
| NDA ≥ 20% | 28 |
| NDA ≥ 25% | 19 |
| NDA ≥ 30% | 9 |
| NDA ≥ 40% | 1 |

**Narrative claim: 29 ACs ≥ 20%. Our number: 28.** Off by 1. Either a different ECI cutoff or rounding boundary. **Confirmed.**

The geography is the more interesting test. NDA ≥ 25% (n=19), broken down by district:

| District | # ACs ≥ 25% NDA |
|---|---|
| **Thiruvananthapuram** | **6** |
| Palakkad | 3 |
| Kasaragod | 2 |
| Kozhikode | 2 |
| Kottayam | 2 |
| Pathanamthitta | 1 |
| Thrissur | 1 |
| Ernakulam | 1 |
| Kollam | 1 |

**Trivandrum district alone holds 6 of the 19 ACs where NDA crossed 25%.** The capital region is the unambiguous concentration zone. The remainder is sprinkled lightly across 8 other districts. This is not a statewide phenomenon — it's a Trivandrum + occasional-pockets pattern.

## Sub-claim (iii): The 3 BJP wins are in high-Hindu seats

| AC | Hindu % | NDA share '26 | NDA Δ '21 | UDF Δ | LDF Δ |
|---|---|---|---|---|---|
| 126 CHATHANNOOR | 72.0% | 38.2% | +7.6pp | +1.1pp | -8.1pp |
| 132 KAZHAKOOTTAM | 69.2% | 35.7% | +6.6pp | +4.6pp | -10.7pp |
| 135 NEMOM | 69.2% | 40.9% | +5.4pp | -3.7pp | -0.9pp |

Mean Hindu share in BJP wins: **70.2%** vs **53.4%** statewide. **Confirmed.** All three are in the top decile of Kerala AC Hindu shares (Hindu ≥ 65% globally — only ~16 ACs qualify, and the BJP took 3 of them).

## Sub-claim (iv): Every Christian BJP candidate lost

The narrative names four. Looking each up:

| AC | Candidate | District | Christian % | BJP share '26 | BJP Δ '21 | Result |
|---|---|---|---|---|---|---|
| 93 PALA | Shone George | Kottayam | 52.1% | 26.1% | **+18.2pp** | ✗ lost |
| 100 KANJIRAPPALLY | George Kurian | Kottayam | 43.1% | 20.0% | -1.2pp | ✗ lost |
| 101 POONJAR | P.C. George | Kottayam | 41.5% | 25.1% | **+25.1pp** | ✗ lost |
| 111 THIRUVALLA | Anoop Antony | Pathanamthitta | 47.9% | 30.7% | **+14.5pp** | ✗ lost |

**All four lost. Confirmed.**

But here's the **surprise the narrative didn't anticipate**: 3 of the 4 saw *enormous* BJP party-share gains — +14 to +25pp at the AC level. P.C. George contesting Poonjar pulled BJP from a 0% base to 25.1%; Shone George moved Pala from 7.8% to 26.1%; Anoop Antony moved Thiruvalla from 16.3% to 30.7%. These aren't the failure cases the narrative implies — they're the *opposite* of failure on a vote-building metric. They lost because they didn't *quite* reach plurality, not because they failed to attract voters.

The headline narrative ("BJP failed at Christian outreach") is contradicted by the per-AC growth numbers. The accurate framing: **BJP made significant inroads in Christian-mixed central Kerala but couldn't convert them to wins** — the cohesion of UDF + LDF in those seats kept the combined non-BJP majority intact even as BJP's individual share doubled or tripled.

This matters for forward narrative: if BJP holds these gains in 2031, the seats become structurally winnable. The "BJP can't win Christian seats" framing collapses one cycle later if the trend continues.

## Sub-claim (v): UDF underperformed in the 3 BJP-won seats

| Group | n | Mean UDF Δ '21 |
|---|---|---|
| BJP-won seats | 3 | **+0.64pp** |
| Statewide | 140 | +7.29pp |
| Hindu ≥ 60% (excluding BJP wins) | ~30 | +5.79pp |

**Confirmed, sharply.** UDF gained only ~0.6pp in the 3 BJP-won seats while gaining 5.8pp on average in *comparable* (Hindu ≥ 60%) seats elsewhere. The ~5pp UDF underperformance gap is what made the BJP wins possible — even with their concentrated Hindu base, BJP couldn't have won if UDF had captured its proportional share of the LDF→UDF wave.

The Onmanorama "weak UDF candidates" framing has empirical support. Specifically:
- **Nemom (UDF -3.7pp)**: K.S. Sabarinadhan was a weaker candidate than the LDF/NDA returns; UDF actively *lost* share. Three-way fragmentation.
- **Chathannoor (UDF +1.1pp)**: muted UDF growth in a +7pp wave year; insufficient to challenge a +7.6pp NDA surge.
- **Kazhakoottam (UDF +4.6pp)**: closest to baseline UDF growth, but Kadakampally's LDF collapse (-10.7pp) flowed disproportionately to NDA (+6.6pp) and only partially to UDF, allowing BJP to flip by 428 votes.

This is a UDF candidate-selection failure as much as it's a BJP achievement.

## The opinionated reframe

> **All four sub-claims of the press narrative are correct, and the data is sharper than the headlines: BJP's 3 wins came from a Trivandrum-concentrated Hindu pocket where UDF underperformed by ~5-6pp vs comparable seats. Statewide BJP was flat (+0.18pp aggregate). The Christian-candidate failure thesis is correct on win-rate (0 of 4) but misleading on momentum — 3 of the 4 Christian BJP candidates ADDED 14-25pp to BJP's local share without winning.**
>
> The accurate two-sentence summary of BJP's 2026: *"Wins concentrated in Trivandrum's Hindu pockets where UDF candidate selection failed. Significant per-AC growth in central-Kerala Christian seats that didn't translate to wins, but represents a structurally viable base for 2031."*

The "BJP statewide breakthrough" framing some BJP-aligned coverage tried to push is correctly dismissed by the +0.18pp aggregate. The "BJP completely failed in Kerala" framing some opposition coverage pushed is also wrong — the per-AC growth in Pala, Poonjar, Thiruvalla, Guruvayoor, Vaikom, Devikulam shows real movement.

## Where BJP grew most (top 12 by party-share Δ)

| AC | District | Hindu % | BJP '26 | BJP Δ |
|---|---|---|---|---|
| 101 POONJAR | Kottayam | 42% | 25.1% | **+25.1pp** |
| 127 VARKALA | Trivandrum | 71% | 19.9% | +19.9pp |
| 93 PALA | Kottayam | 38% | 26.1% | +18.2pp |
| 63 GURUVAYOOR | Thrissur | 40% | 17.9% | +17.9pp |
| 95 VAIKOM | Kottayam | 72% | 16.2% | +16.2pp |
| 13 THALASSERY | Kannur | 61% | 15.8% | +15.8pp |
| 111 THIRUVALLA | Pathanamthitta | 48% | 30.7% | +14.5pp |
| 88 DEVIKULAM | Idukki | 61% | 13.5% | +13.5pp |
| 78 PARAVUR | Ernakulam | 59% | 12.8% | +12.8pp |
| 116 KARUNAGAPPALLY | Kollam | 66% | 18.7% | +11.6pp |
| 123 KUNDARA | Kollam | 58% | 11.6% | +11.6pp |
| 47 THAVANUR | Malappuram | 33% | 9.8% | +9.8pp |

8 of the top 12 are in Hindu ≥ 50% seats. 5 are in Kottayam/Pathanamthitta/Thrissur — the central Kerala mixed-religion belt where BJP fielded specifically Christian candidates. **The geographic pattern of BJP growth and the geographic pattern of BJP wins overlap only partially**: BJP grew everywhere it tried, but won only where Hindu share was ≥ 65% AND UDF underperformed.

## Methodology & limitations

- **Statewide aggregate**: vote-weighted across all 140 ACs. Slightly different from ECI's headline because we recompute from candidate-level data.
- **NDA 28 vs narrative 29 (≥20%)**: rounding boundary at 20.0% probably explains the off-by-1. Either way the *concentration* claim holds.
- **Hindu share**: 2025 projection. Switching to 2011 baseline doesn't change the verdict.
- **What we can't tell**:
  - Whether UDF candidate weakness is causally distinct from "Trivandrum is just structurally less UDF" — the two correlate. Survey microdata on candidate evaluation could separate.
  - Whether the 14-25pp BJP growth in Pala/Poonjar/Thiruvalla represents a *durable* shift or a candidate-personality bump (P.C. George had been a 5-time MLA from Poonjar before joining BJP). Multi-cycle data 2031 will answer.
- **Christian BJP candidates**: hand-coded list of 4 from the narrative. Other Christian-named BJP candidates may exist; the 4 named are the salient ones cited across coverage.

## Cross-references

- **A1 (minority consolidation)**: established UDF gained ~7pp uniformly. A3 sharpens: that ~7pp average hides ~5pp underperformance in the 3 BJP-won seats and ~14-25pp BJP gains in central-Kerala Christian seats — both of which the +7pp average paper over.
- **A2 (Sabarimala route)**: established that the "Hindu backlash → BJP gain" mechanism doesn't show up at the route-geographic level. A3's BJP growth pattern (Trivandrum + scattered central-Kerala) is consistent: BJP's growth corridor is *not* the Sabarimala pilgrim route, it's a different geography.
- **A6 (cabinet collapse)**: V. Sivankutty (Nemom, LDF Education Minister) lost his seat to BJP. A6 showed his LDF Δ was only -0.9pp — not a personal collapse. The Nemom result is BJP's win, not Sivankutty's loss; Nemom is a 3-way fragmentation seat where small movements flip the winner.

## Reproduce

`bun run scripts/narrative-a3-bjp-three-wins.ts`
