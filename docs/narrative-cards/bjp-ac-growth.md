# BJP's flat statewide aggregate hides large AC-level reorganisation

> **BJP's vote share moved by +0.18pp statewide. The same number moved by ±25pp at the AC level. Both are true.**
>
> The aggregate hides a major geographic reshuffle: BJP added 14-25pp of vote share in several central-Kerala mixed-religion seats (Poonjar, Pala, Thiruvalla, Guruvayoor, Vaikom) while ceding 10-22pp in 26 ACs where it withdrew from the contest entirely, mostly to NDA allies (BDJS, KC(B), Twenty20). Statewide gains and statewide cessions roughly cancel — yielding the +0.18pp aggregate that conventional readings of "BJP didn't break out" rest on.

**Confidence: Moderate-strong (descriptive / mixed mechanism)** — the per-AC vote-share movements are exact. Substantive caveat: a meaningful share of the top-line gains are *contest-entry effects* (BJP fielding seriously in 2026 from a near-zero 2021 base) rather than *organic expansion* of an existing base. The two are separated explicitly below; the durability story differs sharply between them.

This card explores the per-AC distribution of BJP's vote-share movement that the statewide number obscures. Reproduce: `python3 scripts/narrative-bjp-ac-growth.py`.

> **A note on inference:** This card is descriptive — it documents constituency-level BJP vote-share movements without claiming to identify causal mechanisms behind them. Several alternative explanations apply (candidate-personality bumps, alliance-fielding strategy, three-way fragmentation); these are flagged but cannot be adjudicated from constituency vote totals alone.

**Unit:** Statewide aggregates (+0.18pp) are vote-weighted; per-AC means and Δ figures are constituency-equal. The unit of analysis is the constituency, not the individual voter.

---

## The headline puzzle: ±25pp at AC level, +0.18pp in aggregate

Distribution of BJP party-share Δ across all 140 ACs (2021 → 2026):

| Statistic | Value |
|---|---|
| Min | -21.9pp (Konni) |
| Max | +25.1pp (Poonjar) |
| Mean (constituency-equal) | +0.29pp |
| Median | +0.00pp |
| Vote-weighted statewide Δ | **+0.18pp** |

| Threshold | # ACs |
|---|---|
| BJP Δ > +15pp | 6 |
| BJP Δ > +10pp | 11 |
| BJP Δ > +5pp | 23 |
| BJP Δ < -5pp | 24 |
| BJP Δ < -10pp | 10 |

**Sum of positive Δ (where BJP gained): +349.6pp across all ACs.**
**Sum of negative Δ (where BJP shrank): -308.7pp across all ACs.**

Roughly 350pp of constituency-level gain and 309pp of constituency-level loss net to a vote-weighted +0.18pp once you account for which ACs hold which voter populations. The "flat statewide" reading is correct as a vote-weighted statement; it does not capture the geographic reshuffle.

## Where BJP grew (top 12 gainers)

| AC | District | Hindu % | Christian % | Muslim % | BJP '21 | BJP '26 | Δ |
|---|---|---|---|---|---|---|---|
| 101 POONJAR | Kottayam | 42% | 41% | 16% | 0.0% | 25.1% | **+25.1pp** |
| 127 VARKALA | Trivandrum | 71% | 4% | 25% | 0.0% | 19.9% | +19.9pp |
| 93 PALA | Kottayam | 38% | 52% | 10% | 7.9% | 26.1% | +18.2pp |
| 63 GURUVAYOOR | Thrissur | 40% | 7% | 53% | 0.0% | 17.9% | +17.9pp |
| 95 VAIKOM | Kottayam | 72% | 24% | 4% | 0.0% | 16.2% | +16.2pp |
| 13 THALASSERY | Kannur | 61% | 2% | 37% | 0.0% | 15.8% | +15.8pp |
| 111 THIRUVALLA | Pathanamthitta | 48% | 48% | 4% | 16.2% | 30.7% | +14.5pp |
| 88 DEVIKULAM | Idukki | 61% | 32% | 7% | 0.0% | 13.5% | +13.5pp |
| 78 PARAVUR | Ernakulam | 59% | 33% | 7% | 0.0% | 12.8% | +12.8pp |
| 116 KARUNAGAPPALLY | Kollam | 66% | 5% | 29% | 7.0% | 18.7% | +11.6pp |
| 123 KUNDARA | Kollam | 58% | 13% | 29% | 0.0% | 11.6% | +11.6pp |
| 47 THAVANUR | Malappuram | 33% | 0% | 67% | 0.0% | 9.8% | +9.8pp |

Patterns visible in this list:
- **Many gainers had near-zero BJP base in 2021** (Poonjar 0.0%, Varkala 0.0%, Vaikom 0.0%, Thalassery 0.0%, Devikulam 0.0%, Paravur 0.0%, Kundara 0.0%). These are seats BJP didn't seriously contest in 2021; the 2026 entries are first-time concentrated efforts.
- **Religion mix is heterogeneous**: Hindu-heavy seats appear (Varkala 71% Hindu, Vaikom 72%) but so do Christian-heavy (Pala 52% Christian, Thiruvalla 48%, Devikulam 32%, Paravur 33%) and Muslim-heavy (Thalassery 37% Muslim, Guruvayoor 53%, Karunagappally 29%, Thavanur 67%).
- **Candidate-personality cases dominate the top tier**: Poonjar (P.C. George switch from independent to BJP after 5-cycle Poonjar incumbency), Pala (Shone George — Catholic candidate), Thiruvalla (Anoop Antony — Catholic candidate). For these specifically, the +14-25pp gain is hard to separate from the candidate's personal vote.

## Where BJP retreated (top 12 cessions)

| AC | District | Hindu % | BJP '21 | BJP '26 | NDA Δ | Cession destination |
|---|---|---|---|---|---|---|
| 114 KONNI | Pathanamthitta | 61% | 21.9% | 0.0% | -10.6pp | BDJS 11.4% |
| 73 KODUNGALLUR | Thrissur | 57% | 18.9% | 0.0% | -2.7pp | (no ally — pure NDA loss) |
| 62 KUNNAMKULAM | Thrissur | 57% | 18.0% | 0.0% | -6.8pp | BDJS 11.2% |
| 90 THODUPUZHA | Idukki | 39% | 15.3% | 0.0% | -6.6pp | (no ally) |
| 81 THRIPUNITHURA | Ernakulam | 45% | 15.2% | 0.0% | +4.0pp | (Twenty20 / KC(B)) |
| 121 PUNALUR | Kollam | 57% | 13.7% | 0.0% | -2.8pp | (no ally) |
| 83 THRIKKAKARA | Ernakulam | 45% | 11.3% | 0.0% | +4.1pp | (Twenty20 / KC(B)) |
| 96 ETTUMANOOR | Kottayam | 49% | 10.9% | 0.0% | -0.3pp | (no ally) |
| 74 PERUMBAVOOR | Ernakulam | 43% | 10.5% | 0.0% | +4.8pp | (Twenty20 / KC(B)) |
| 79 VYPEN | Ernakulam | 52% | 10.4% | 0.0% | +0.0pp | (no ally) |
| 120 PATHANAPURAM | Kollam | 60% | 9.0% | 0.0% | (varies) | (no ally) |
| 94 KADUTHURUTHY | Kottayam | 53% | 8.9% | 0.0% | (varies) | BDJS 9.9% |

26 of 140 ACs were BJP cessions (BJP fielded 2021, not 2026). Mean BJP-share in those ACs in 2021: roughly 12%. In 2026: 0%. The vote did not disappear — it went to NDA allies in many cases (BDJS, KC(B), Twenty20). Mean NDA-aggregate share in cession ACs: 9.6% (2021) → 9.8% (2026), essentially flat.

**Interpretation:** the cessions are alliance-management rather than voter-loss. BJP gave allies the slot in 26 ACs where it had previously contested with 8-22% share; the alliance carriers (BDJS especially) maintained roughly the same NDA aggregate.

## District-level reshuffle

Sorted by BJP Δshare mean per district (constituency-equal within district):

| District | n | Mean BJP Δ | Min | Max |
|---|---|---|---|---|
| Wayanad | 3 | **+4.67pp** | +1.9 | +8.8 |
| Thiruvananthapuram | 14 | **+4.47pp** | +0.0 | +19.9 |
| Kottayam | 9 | **+3.57pp** | -10.9 | +25.1 |
| Kollam | 11 | +0.86pp | -13.7 | +11.6 |
| Kannur | 11 | +0.73pp | -6.4 | +15.8 |
| Kozhikode | 13 | +0.44pp | -6.3 | +5.8 |
| Palakkad | 12 | +0.28pp | -3.4 | +9.6 |
| Idukki | 5 | +0.03pp | -15.3 | +13.5 |
| Pathanamthitta | 5 | -0.17pp | -21.9 | +14.5 |
| Malappuram | 16 | -0.22pp | -6.8 | +9.8 |
| Alappuzha | 9 | -0.45pp | -4.6 | +9.6 |
| Kasaragod | 5 | -1.25pp | -6.8 | +2.6 |
| Thrissur | 13 | -1.42pp | -18.9 | +17.9 |
| Ernakulam | 14 | **-4.40pp** | -15.2 | +12.8 |

**Top growth zones**: Trivandrum (already concentrated, gained more), Kottayam (despite high variance — the +25 in Poonjar offsets -10 in Ettumanoor), Wayanad.
**Biggest cession zone**: Ernakulam — BJP withdrew from 7+ ACs there, ceding to Twenty20 (Kitex-backed NDA partner) and KC(B). Christian-heavy Ernakulam was the strategic-withdrawal corridor.
**Variable**: Kottayam's range (-10.9 to +25.1) and Pathanamthitta's range (-21.9 to +14.5) demonstrate that "Christian-mixed central Kerala" is BOTH the biggest growth zone AND the biggest cession zone for BJP — depending on which AC.

## Religion-bin cross-tab

ACs binned by religion mix; mean BJP Δshare per bin:

| Bin | n | Mean BJP Δ | Note |
|---|---|---|---|
| Hindu ≥ 70% | 10 | **+5.12pp** | Major growth corridor |
| Hindu 50-70% | 80 | +0.22pp | Flat |
| Christian ≥ 30% | 23 | -1.44pp | Mixed: big gainers (Pala, Poonjar) + cessions (Konni, Thripunithura) |
| Muslim ≥ 60% | 16 | -0.22pp | Flat |
| Muslim 30-60% | 10 | +1.39pp | Modest growth |
| Mixed | 1 | -5.13pp | n too small |

The clearest signal: **BJP grew most in the smaller Hindu ≥ 70% subset** (+5.12pp mean across 10 ACs). The Christian ≥ 30% bin is the most heterogeneous — bin mean is -1.44pp but with massive within-bin variance: BJP added +25pp in Poonjar, +18 in Pala, +15 in Thiruvalla, while losing -22pp in Konni, -10 in Ettumanoor, -9 in Kaduthuruthy. The bin mean averages a strategic-withdrawal pattern over an aggressive-fielding pattern, and the average is meaningless without that context.

## Contest-entry effects vs organic expansion

A critical distinction the headline obscures: did BJP's +14-25pp gains come from *expanding an existing base* (organic growth) or from *seriously contesting where it didn't seriously contest before* (contest-entry effects)? These are qualitatively different and have different durability implications. An organic expansion (5% → 18%) suggests the party brand is gaining traction; a contest-entry jump (0% → 25%) is partly the candidate showing up at all.

For the top 12 BJP gainers (Δshare ≥ +9.6pp), broken out by 2016 / 2021 / 2026 trajectory:

| Type | Definition | n | ACs |
|---|---|---|---|
| **Contest-entry activation** | BJP share ≤ 5% in 2021, jumped to 10-25% in 2026 | **8** | Poonjar (0→0→25), Varkala (0→0→20), Vaikom (0→0→16), Thalassery (0→0→16), Devikulam (0→0→14), Paravur (0→0→13), Kundara (0→0→12), Thavanur (0→0→10) |
| **Organic expansion** | BJP share >5% in 2021, grew further in 2026 | **3** | Thiruvalla (16→16→31), Karunagappally (7→7→19), Pala (4→8→26 — partial: jumped both '21→'26 and benefited from the Shone George candidacy) |
| **Mixed (organic + activation)** | Existed at low share, then candidate switch / national name | **1** | Guruvayoor (0→0→18 — but with national-name BJP candidate) |

**Two-thirds of the top-tier BJP gains (8 of 12) are contest-entry activations, not organic expansion.** This sharpens the durability story:

- **Contest-entry gains are partly mechanical**: they reflect BJP fielding a serious candidate where it had previously stood aside or fielded a placeholder. P.C. George contesting Poonjar (after a 5-cycle Poonjar incumbency under different colours) is not "BJP brand-building" — it's P.C. George's personal vote registering in the BJP column. The 2031 test: does the Poonjar BJP share hold at 20%+ when a different candidate runs? If not, the gain was personality-attributable.
- **Organic gains are stronger evidence for durable BJP advance**: Thiruvalla 16% → 31% is BJP doubling its base; Karunagappally 7% → 19% is BJP nearly tripling. These are structurally meaningful even if Anoop Antony specifically isn't the candidate in 2031. The party brand presumably retains *some* of those voters.

| 2016 baseline | n | Interpretation |
|---|---|---|
| BJP > 5% in 2016 | 5 of 11 (45%) | Gain built on prior toehold (e.g., Karunagappally 7→7→19, Thiruvalla 16→16→31) |
| BJP ≤ 5% in 2016 | 6 of 11 (55%) | Gain from near-zero base (e.g., Poonjar 0→0→25, Vaikom 0→0→16) |

A slight majority of the big gains came from near-zero 2016 baselines. Combined with the 2021 baseline check above, **the durable-growth subset is small** — perhaps Thiruvalla, Karunagappally, and possibly Pala if the 2026 jump persists past Shone George's candidacy. The other 8-9 of 12 are contest-entry effects whose 2031 status depends on who BJP fields and whether the alliance-management strategy sticks.

## What this directly shows / what it cannot prove / what would weaken the conclusion

### What this directly shows

- BJP's vote-weighted statewide aggregate moved +0.18pp; the constituency-level distribution ranges from -21.9pp to +25.1pp.
- BJP was new to 26 ACs in 2026 (didn't field 2021), and withdrew from 26 ACs (fielded 2021, not 2026). Net fielding count: 89 + 9 = 98 in 2026 vs 89 + 26 = 115 in 2021 — BJP fielded *fewer* candidates in 2026 (98 of 140 vs 115 of 140), even as its statewide share crept up.
- Cession ACs went from mean NDA-aggregate 9.6% to 9.8% — alliance allies absorbed BJP's withdrawn vote share.
- 6 of 11 BJP big-gainers (Δ ≥ +10pp) came from BJP-near-zero 2016 baselines — new footholds, not extensions.
- 8 of 12 top-tier 2021→2026 BJP gainers are *contest-entry activations* (BJP fielded seriously where it had previously stood aside); only 3-4 are *organic expansion* of an existing base.

### What this does NOT prove

- **BJP is on a structural growth trajectory in central Kerala.** The +14-25pp jumps in Pala, Poonjar, Thiruvalla, Guruvayoor are concentrated in seats where BJP either fielded high-profile defectors (P.C. George/Poonjar, Shone George/Pala, Anoop Antony/Thiruvalla) or contested unusually energetically. These could be candidate-personality bumps that revert in 2031 with different candidates.
- **The cession strategy succeeded.** NDA aggregate held in cession ACs (+0.2pp), but those are seats where NDA was at ~10% and stayed ~10%. "Held" doesn't mean "leveraged" — alliance-management may have prevented further decline without producing growth.
- **Christian voters are warming to BJP.** The +14-25pp gains in Christian-heavy ACs include Hindu, Muslim, Christian voters in those constituencies. Sub-community decomposition isn't available in this dataset. The candidate-personality alternative is especially live for the four named Christian BJP candidates (3 of 4 with major gains).
- **The +5.12pp Hindu ≥ 70% bin mean is replicable.** n=10 is small; the bin mean is heavily influenced by Varkala (+19.9), Vaikom (+16.2), and Karunagappally (+11.6). Without those three, the remaining 7 average roughly flat.

### What would weaken this conclusion

- **2031 BJP share reverting to <10% in Pala, Poonjar, Thiruvalla** when those candidates aren't on the ballot — would suggest the +14-25pp gains were candidate-specific, not BJP brand-building.
- **Cession ACs (Konni, Thripunithura, Thodupuzha, Ettumanoor, etc.) showing NDA aggregate decline to ≤5% in 2031** — would suggest the alliance-management strategy permanently sacrificed BJP's footprint there rather than maintaining it.
- **Sub-community polling of Christian voters in Pala/Poonjar/Thiruvalla showing the +14-25pp BJP gain came overwhelmingly from non-Christian voters in those mixed-religion ACs** — would dismantle the implicit "BJP making Christian inroads" reading some commentary draws from the candidate-selection pattern.
- **Multi-cycle data showing BJP's per-AC variance is always large in Kerala** — would suggest the ±25pp range observed here is normal cycle-on-cycle, not a 2026-specific reshuffle. This card reports 2021→2026 only; longer baselines would contextualize the magnitude.

## What this card adds to the catalog

Most narrative cards (A1, A2, A3, A6, A8) test specific press claims. This card surfaces a finding that the press generally hasn't articulated: **the statewide-flat narrative is incomplete — there's a major geographic reorganization underneath it.** The story isn't visible in headline aggregates because the gains and cessions roughly cancel.

Forward implications worth tracking in 2031:
- **Durability of the +14-25pp central-Kerala-Christian-area gains.** P.C. George/Poonjar is the cleanest test: if BJP holds 20%+ there with a different candidate, durable. If it falls to 5%, candidate effect.
- **Whether cession ACs (Konni, Ettumanoor, Thodupuzha, Thripunithura) re-enter BJP fielding** in 2031 or stay with allies. The alliance-management strategy works only if BJP can re-field where conditions become favorable.
- **Whether the Hindu ≥ 70% growth concentration extends.** A3 documents 3 BJP wins; this card adds 7 more Hindu-heavy seats where BJP grew but didn't win. If that base grows further by 2031 — and especially if it converts to wins — the "concentrated pocket" becomes a regional foothold.

## Cross-references

- **A3 (BJP's 3 wins concentrated)**: confirms the 3 wins are in Hindu-heavy Trivandrum-area seats. This card extends to the broader BJP-share-Δ distribution including the ACs where BJP grew but didn't win.
- **Synthesis (Three overlapping patterns)**: Pattern 3 (BJP geographic pocket). This card is the detailed evidence for Pattern 3's per-AC reshuffle.
- **A1 (minority consolidation)**: A1's KC(M) defection finding overlaps with this card's documentation of BJP's gains in central-Kerala mixed-religion ACs. Some of the +14-25pp BJP gains in Pala/Poonjar/Kanjirappally area might be tracking similar voter movements (away from LDF/KC(M)) but landing on a different alliance (NDA via BJP candidates, instead of UDF via INC/KC(J)).

## Reproduce

`python3 scripts/narrative-bjp-ac-growth.py`
