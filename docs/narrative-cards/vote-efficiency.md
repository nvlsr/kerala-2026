# UDF's victory was the result of an efficiency flip, not just a vote-share swing

**Verdict: A 7.4pp UDF vote-share gain produced 61 additional UDF seats. Equivalently, a 7.4pp LDF loss produced 64 fewer LDF seats. Each percentage point of swing bought ~8 seats — far above the proportional rate. The 2026 swing did not just shift votes; it shifted them across critical FPTP thresholds in many marginal seats simultaneously. UDF's seats-per-vote-share ratio more than doubled (1.04 → 2.18); LDF's halved (2.19 → 0.93). The two alliances effectively traded efficiency. Under a counterfactual where 2021 vote shares had held statewide, UDF would have won 44 seats, not 102. FPTP amplified the geographic distribution of the swing into roughly 58 additional seats beyond what proportional representation would have produced.**

**Confidence: Strong (with counterfactual caveat)** — the seat:vote-share efficiency-flip is exact at the aggregate level. The +58-seat amplification estimate depends on the uniform-swing counterfactual assumption; a religion- or region-conditioned counterfactual would attribute fewer seats to "geography" and more to "differentiated swing magnitude." The qualitative point (FPTP near-threshold amplification produced an outsized seat shift) is robust regardless.

This card formalises an observation that's implicit in A8 ("kingmaker arithmetic") and the synthesis card: Kerala's 2026 result was over-determined geographically. A modest statewide swing crossed many close-race thresholds at once, producing landslide-scale seat conversion.

> **A note on inference:** Vote-efficiency analysis is a structural statement about how votes converted into seats under FPTP plurality rules. It does not claim that UDF strategically targeted marginal seats; the geographic distribution of the swing emerged from the underlying religion/region patterns documented in A1–A8. This card describes how the FPTP system amplified a 7.4pp swing into a 102-35 seat split.

**Unit:** Statewide aggregates are vote-weighted; seat counts and per-AC margins are constituency-equal. The unit of the seat:vote-share ratio is "seats won per percentage point of statewide vote share." Reproduce: `python3 scripts/narrative-vote-efficiency.py`.

---

## The headline: vote share → seat share

|  | 2021 | | 2026 | |
|---|---|---|---|---|
| Alliance | Vote % | Seats | Vote % | Seats |
| UDF | 39.41% | 41 / 140 | 46.81% | **102 / 140** |
| LDF | 45.28% | **99 / 140** | 37.86% | 35 / 140 |
| NDA | 12.45% | 0 / 140 | 14.28% | 3 / 140 |

Vote-share Δ:
- UDF: +7.40pp → +61 seats
- LDF: -7.43pp → -64 seats
- NDA: +1.83pp → +3 seats

For UDF, **8.2 additional seats per pp gained.** For LDF, **8.6 fewer seats per pp lost.** Compare to a proportional benchmark: if Kerala used pure proportional representation, +7.4pp would yield roughly +10 seats (7.4% of 140). Under FPTP, the same +7.4pp produced +61 seats — 6× the proportional rate.

This is not because UDF's swing was ideologically extreme or because LDF's loss was a wipeout (per the LDF distribution card, the loss was tightly clustered around -7pp). The amplification comes from FPTP's threshold-crossing effect: many seats sat near 50/50 in 2021, and a uniform 7pp shift flipped them simultaneously.

## Seats per percentage point of statewide vote share

The seats:vote-share ratio is a coarse efficiency metric. Higher = more seats per vote = more efficient distribution.

| Alliance | 2021 ratio | 2026 ratio | Δ |
|---|---|---|---|
| **UDF** | 1.04 | **2.18** | **+1.14** |
| **LDF** | **2.19** | 0.93 | **-1.26** |
| NDA | 0.00 | 0.21 | +0.21 |

**The two alliances traded efficiency almost exactly.** UDF gained +1.14 ratio-points; LDF lost -1.26. In 2021, LDF was the efficient alliance — winning 99 seats with 45% of the vote because its support was concentrated in winnable ACs. In 2026, UDF is the efficient alliance — winning 102 seats with 47%, because the same geographic structure flipped to favor it once 7pp moved.

This is what FPTP does in a 50-50 environment: small swings near the threshold produce disproportionate seat changes because many marginal contests resolve in the same direction.

## Wasted votes per alliance, 2026

Wasted votes = (winning-side surplus above the runner-up) + (all losing-side votes). A vote is "wasted" in the partisan-efficiency sense if it didn't contribute to winning a seat.

| Alliance | Wasted votes | % of total cast | Of alliance's own votes |
|---|---|---|---|
| UDF | 4,412,426 | 20.55% | 43.9% wasted of 10,051,695 |
| LDF | 6,088,795 | **28.36%** | **74.9% wasted of 8,128,438** |
| NDA | 2,920,510 | 13.60% | 95.2% wasted of 3,066,385 |

Reading row-by-row:
- **UDF**: 44% of UDF voters' votes "wasted" — meaning more than half were efficiently spent on winning seats with modest surplus. UDF has the lowest wasted-share of votes-cast.
- **LDF**: 75% of LDF voters' votes "wasted" — most LDF votes either piled up in losing efforts (in seats UDF won) or in surplus in the 35 seats LDF won. Despite getting 38% of votes, only ~25% of those votes converted to seat-winning effort.
- **NDA**: 95% wasted — almost no NDA votes won seats. NDA's 3 wins were tight (median margin 3.24pp), so the surplus was small in those seats; the rest of NDA's votes were in losing efforts. This is consistent with the "concentrated pocket" finding from A3.

## Distribution of winning margins, 2026

| Alliance | n won | min | 25% | median | mean | 75% | max |
|---|---|---|---|---|---|---|---|
| UDF | 102 | 0.97pp | 6.40pp | 12.19pp | 14.42pp | 19.98pp | 43.64pp |
| LDF | 35 | 0.07pp | 1.95pp | 6.99pp | 7.05pp | 11.07pp | 18.15pp |
| NDA | 3 | 0.33pp | 0.33pp | 3.24pp | 2.38pp | 3.56pp | 3.56pp |

**Surprise (relative to my pre-analysis hypothesis):** UDF did *not* win predominantly on tight margins. UDF's median winning margin (12.19pp) is *larger* than LDF's (6.99pp) and substantially larger than NDA's (3.24pp). UDF's wins are widely distributed; LDF's are concentrated near zero; NDA's are uniformly tight.

This makes sense once you see the efficiency flip: UDF won a wide variety of seats — some narrow (Central-5 sweep edges), some wide (already-strong UDF seats that grew), some massive (Christian-belt premium seats). LDF held its 35 seats almost entirely because they were strongholds where the 7pp loss didn't quite knock them out — close-margin holds. NDA's 3 wins are all by single-digit margins, by definition the result of close 3-way splits in Trivandrum.

### Histogram (5pp bins)

```
Margin (pp)     UDF    LDF    NDA
[ 0,  5)        18     14      3
[ 5, 10)        26     11      0
[10, 15)        16      7      0
[15, 20)        17      3      0
[20, 25)         7      0      0
[25, 30)         9      0      0
[30, 40)         7      0      0
[40, 100)         2      0      0
```

UDF's distribution is roughly bell-shaped, peaking in the 5-10pp bin. LDF's is heavily right-skewed with mass concentrated below 10pp. NDA's is concentrated below 5pp.

## The efficiency flip — what 2021 looked like in reverse

In 2021, LDF won 99 seats with 45.3% statewide. Roughly: in 99 ACs, LDF candidates either won outright (sometimes by big margins) or held just enough to clear UDF runners-up. UDF in 2021 won 41 seats with 39.4% — meaning UDF voters were piled up in losing efforts in 99 ACs. UDF was the inefficient alliance in 2021.

In 2026, the same geographic structure tilts the other way. The seats UDF was losing by 5-10pp in 2021 (where UDF voters were "wasted" in losing efforts) are exactly the seats UDF picks up when a uniform 7pp swing applies. LDF candidates who won 2021 by 5-10pp now lose by 0-3pp; UDF candidates who lost 2021 by 5-10pp now win by 0-3pp. Same voters, same constituencies, different seat outcomes.

This isn't unique to Kerala — it's the structural property of FPTP near threshold. But the *magnitude* of the 2026 flip (102-35-3 from 41-99-0 with only ~7pp shift) is unusually severe even for FPTP. The arithmetic specifics:

- UDF efficient-flip seats: 60+ ACs that UDF lost by <10pp in 2021 became UDF wins in 2026.
- LDF efficient-loss seats: same geography, mirror-image — 60+ wins LDF held by <10pp in 2021 lost in 2026.

The two are the same seats. The flip is not separate from the swing; it's what the swing *means* in seat terms when it's distributed across many marginal contests.

## Counterfactual: what if 2021 vote shares had held?

A simple uniform-swing counterfactual: take each AC's 2026 candidate list, but shift each alliance's per-AC share by the inverse of the statewide swing (i.e., subtract +7.40pp from each UDF candidate, add +7.43pp to each LDF candidate, etc.). Recompute who would have won each AC.

Result:

| Alliance | 2026 actual | Counterfactual (2021 shares) | Δ |
|---|---|---|---|
| UDF | 102 | 44 | -58 |
| LDF | 35 | 96 | +61 |
| NDA | 3 | 0 | -3 |

**Under uniform-swing-back-to-2021, the seat split would be approximately 96-44-0 — almost a mirror of the actual 2021 result (99-41-0).** Removing the 7.4pp swing from each AC unwinds nearly all of UDF's gains. This is the cleanest evidence that the 2026 outcome is *swing-driven* rather than *base-realignment-driven*: the underlying geographic structure of votes hasn't changed; the swing tilted it.

The analytical move: the counterfactual also implies that **roughly 58 of UDF's 102 seats are attributable to the efficient-distribution amplification.** A uniform 7.4pp swing in a perfectly proportional system would produce ~10 additional seats. In Kerala's FPTP system, the same swing produced 58 additional seats — meaning ~48 seats are "efficiency premium" beyond proportionality.

This isn't a partisan-gerrymander argument. It's that the 2026 swing landed on top of a vote distribution that *was already* close-to-50/50 in many ACs. When the structural distribution sits near threshold, even modest swings flip many seats.

## What this directly shows / what it cannot prove / what would weaken the conclusion

### What this directly shows

- 2026 statewide vote shares: UDF 46.81%, LDF 37.86%, NDA 14.28%.
- 2026 seat counts: UDF 102, LDF 35, NDA 3.
- Seats:vote-share ratio: UDF 2.18, LDF 0.93, NDA 0.21.
- 2021 vs 2026 ratio Δ: UDF +1.14, LDF -1.26 — near-mirror efficiency flip.
- Wasted-vote share of total cast: UDF 20.6%, LDF 28.4%, NDA 13.6%.
- Median winning margin: UDF 12.19pp, LDF 6.99pp, NDA 3.24pp.
- Counterfactual seats under 2021-share uniform shift: UDF 44, LDF 96, NDA 0.

### What this does NOT prove

- **The geographic distribution was strategic.** UDF didn't choose to be inefficient in 2021 or efficient in 2026. The distribution emerges from the underlying religion-region patterns (A1, A8). The efficiency flip is a structural property of FPTP mapping a uniform swing onto a near-50/50 vote distribution, not evidence of strategic vote management.
- **2031 will have similar dynamics.** If the 2026 geographic distribution stays similar, even a small UDF-to-LDF swing in 2031 could flip the seat count back dramatically. Symmetric reasoning. But if the underlying religion/region patterns shift (e.g., Christian-belt premium reverts, NDA expands its Trivandrum cluster), the counterfactual base changes.
- **Wasted-vote percentages are causally meaningful.** "Wasted" is a definitional metric, not a behavioral one. LDF voters in Kannur didn't "waste" their vote in any morally relevant sense — they voted for the candidate who won. The metric quantifies how votes mapped to seats, not how voters experienced their choice.

### What would weaken the conclusion

- **A multi-cycle test showing Kerala's FPTP-vote distribution does NOT typically sit near threshold.** If 2011/2016/2021/2026 all show median margins around 5-10pp, the "near-50/50 structural distribution" claim is robust. If past cycles show larger median margins (15-20pp), the 2026 efficiency amplification is unusual and may reflect a specific configuration that won't recur.
- **A 2031 test where a 5pp swing produces only ~10 seat changes** — would suggest 2026's amplification was specific to that election's marginal-seat geography, not a general property of Kerala FPTP.
- **A more sophisticated counterfactual** using AC-level uniform swing rather than statewide-flat swing — might reveal that some of the +58 "efficiency-premium" seats came from non-uniform geographic concentration of the swing (e.g., the Christian-belt premium concentrated swing in marginal central-Kerala seats specifically). The simple counterfactual run here assumes uniform per-AC subtraction; a religion-share-conditioned counterfactual would attribute fewer seats to "geography" and more to "swing-magnitude differentiated by religion."

## Cross-references

- **A8 (Central Kerala kingmaker)**: showed Central-5 contributed 47 of UDF's 102 seats. This card adds the structural reason: those 47 seats sat near threshold, so the +7pp swing flipped them simultaneously. The kingmaker arithmetic is an instance of FPTP-near-threshold amplification.
- **LDF shallow-distribution card**: showed LDF Δ was tightly clustered around -7pp with low variance. This card explains why a tight distribution centered on -7pp could produce a 64-seat loss: the geography of where -7pp lands matters more than the variance.
- **Synthesis (three patterns)**: Pattern 1 (anti-LDF wave) is the swing; this card shows how Pattern 1's geography (uniform across ACs) interacted with the FPTP system to produce the 102-35 split. The wave wasn't unique; the amplification was.
- **A3 + bjp-ac-growth.md**: NDA's 95.2% wasted-vote share confirms the "concentrated pocket" framing from those cards. NDA's 14% statewide share converted to just 3 seats because almost none of the votes were near threshold.

## Reproduce

`python3 scripts/narrative-vote-efficiency.py`
