# 2026 was anti-LDF, not pro-UDF — where the LDF vote went

**Verdict: UDF's 2026 +7.29pp statewide gain is almost numerically identical to LDF's -7.43pp loss. In aggregate, UDF absorbed 98% of the LDF loss; NDA absorbed 28%; OTHER alliances/independents lost a net 1.91pp (i.e., OTHER also bled mostly to UDF). The "UDF surge" is best read as the geographic landing pattern of LDF erosion. The constituency-level arithmetic is dominated by LDF erosion rather than an independently identifiable UDF-specific surge: 65% of ACs show UDF-dominant absorption (>70% of LDF loss flowing to UDF), 23% show NDA-dominant absorption (>40% to NDA, concentrated in Hindu-heavy southern Kerala), and only 3% saw LDF hold or gain.**

**Confidence: Strong (mass-conservation) / Moderate (causal interpretation)** — the per-AC Δshare arithmetic is exact (UDF, LDF, NDA, OTHER Δs sum to ~0). The "anti-LDF, not pro-UDF" causal reframing depends on interpreting the constituency-level mass-conservation as evidence about voter intent — which it is consistent with but does not directly establish. Survey microdata could discriminate between "LDF voters defected" and "differential turnout aligned with LDF erosion."

This card reframes A1, A8, and the synthesis card from "UDF gained ground" to "LDF lost ground, and most of it landed on UDF." That's not just rhetoric — the per-AC arithmetic confirms it. UDF and LDF Δshares are near-mirrors at the constituency level.

> **A note on inference:** Per-AC alliance Δshares sum to approximately zero (within rounding for NOTA). When LDF lost X pp in an AC, that X pp was absorbed by UDF + NDA + OTHER + (NOTA Δ) combined. The decomposition attributes "where the loss went" using positive-component shares. This is a mechanical decomposition of vote-share movement, not a voter-level claim. The card does not assert that specific LDF voters individually defected; it shows that the *vote totals* moved in those proportions. See `methodology-core-concepts.md` § "Constituency-level vs voter-level inference".

**Unit:** Constituency-equal Δshares throughout. The unit of analysis is the constituency, not the individual voter.

Reproduce: `python3 scripts/narrative-anti-ldf-flow.py`.

---

## Statewide flow accounting

Mean alliance Δshare across 140 ACs:

| Alliance | Mean Δ | % of LDF loss |
|---|---|---|
| UDF | **+7.29pp** | 98% |
| LDF | **-7.43pp** | (= 100%) |
| NDA | +2.05pp | 28% |
| OTHER (incl. independents, NOTA) | -1.91pp | -26% |
| Sum | -0.00pp | |

Reading: the average AC saw LDF drop 7.43pp. Of that 7.43pp, 7.29pp showed up as UDF gain — almost the entire LDF loss landed on UDF on average. NDA also gained 2.05pp on average, which combined with UDF's gain exceeds LDF's loss — meaning the additional 1.91pp came from OTHER (independents and small parties whose vote share fell). OTHER's collapse is part of the same anti-LDF story: voters who'd gone to non-aligned options in 2021 also consolidated on UDF and NDA.

**The headline arithmetic: UDF gain ≈ LDF loss + OTHER's collapse-share that flowed to UDF.** This isn't an addition to LDF's loss; it's roughly: "all the votes that were available to redistribute, including OTHER's collapse, went mostly to UDF."

## Per-AC attribution categories

Classifying each AC by where its LDF loss flowed (using positive-component shares of UDF/NDA/OTHER gains):

| Category | Definition | n | % |
|---|---|---|---|
| **UDF-dominant absorption** | UDF received >70% of LDF loss | 91 | **65.0%** |
| Mixed (UDF + NDA share) | Neither alliance dominant | 13 | 9.3% |
| **NDA-dominant absorption** | NDA received >40% of LDF loss | 32 | 22.9% |
| LDF held / gained share | LDF Δ ≥ 0 | 4 | 2.9% |

**Two-thirds of ACs show clean UDF-dominant absorption.** A meaningful 23% are NDA-dominant — this is where the LDF loss split substantially toward NDA, mostly Trivandrum-area and a handful of Hindu-heavy seats elsewhere. Only 4 ACs saw LDF hold its 2021 share or improve (Vengara, Konni, Kasaragod, Cherthala — all documented in other cards).

## Geographic breakdown of flow

Per-region tally of flow types:

| Region | n | UDF-dom | Mixed | NDA-dom | LDF held |
|---|---|---|---|---|---|
| North (Kasaragod / Kannur / Kozhikode / Wayanad / Malappuram) | 48 | **35 (72%)** | 5 (10%) | 6 (12%) | 2 (4%) |
| Central (Palakkad / Thrissur / Ernakulam / Idukki / Kottayam / Pathanamthitta / Alappuzha) | 67 | **44 (65%)** | 5 (7%) | 16 (23%) | 2 (2%) |
| South (Kollam / Thiruvananthapuram) | 25 | 12 (48%) | 3 (12%) | **10 (40%)** | 0 (0%) |

**The flow direction varies sharply by region.** In the North, 72% of ACs are UDF-dominant absorption — Muslim-majority Malappuram + Kannur stronghold collapse both flow primarily to UDF. In Central Kerala, 65% UDF-dominant. In South Kerala, only 48% UDF-dominant and 40% NDA-dominant — the LDF loss in Trivandrum + south Kollam fragmented across UDF and NDA roughly equally.

This is the geographic anchor for the synthesis card's "Three patterns" reading. Pattern 2 (Central Kerala UDF surge) corresponds to the North + Central UDF-dominant absorption. Pattern 3 (BJP walkthrough) corresponds to the South's NDA-dominant absorption.

## Mean flow proportions by region

| Region | n | LDF Δ | UDF Δ | NDA Δ | OTHER Δ | UDF / -LDF | NDA / -LDF |
|---|---|---|---|---|---|---|---|
| North | 48 | -7.94pp | +7.79pp | +1.15pp | -1.00pp | **98%** | 14% |
| Central | 67 | -7.12pp | +7.83pp | +2.25pp | -2.96pp | **110%** | 32% |
| South | 25 | -7.27pp | +4.85pp | +3.26pp | -0.84pp | 67% | **45%** |

**In Central Kerala, UDF absorbed 110% of LDF's loss** — meaning UDF gained MORE than LDF lost there, with the extra coming from OTHER's -2.96pp collapse. This is the classic "consolidation behind UDF" pattern: LDF voters defected to UDF AND independents/small-party voters consolidated on UDF too. NDA in Central Kerala only absorbed 32% of LDF's loss.

**In South Kerala, NDA absorbed 45% of LDF's loss** — nearly half. UDF only absorbed 67%. The remaining 12-15pp goes to OTHER's collapse residual. This is structurally different: the LDF loss in Trivandrum / south Kollam doesn't flow primarily to UDF; NDA picks up a much bigger share. This is consistent with A3's BJP-3-wins concentration thesis — the southern frontier is where NDA is the main beneficiary of LDF erosion.

## Religion-bin breakdown

| Bin | n | LDF Δ | UDF absorption | NDA absorption |
|---|---|---|---|---|
| Christian-heavy (≥30% Christian) | 34 | -7.89pp | **122%** | 38% |
| Muslim-majority (≥60%) | 16 | -8.28pp | **108%** | 5% |
| Muslim 30-60% | 37 | -6.72pp | 91% | 30% |
| Hindu-heavy (≥70%) | 10 | -8.85pp | 61% | **44%** |
| Mixed (50-70% Hindu, low M+C) | 43 | -7.03pp | 89% | 22% |

**Two clean patterns visible:**

1. **In Christian-heavy and Muslim-majority ACs, the LDF loss flows almost exclusively to UDF.** Christian-heavy: UDF absorbs 122% (more than LDF lost; OTHER's collapse provides the extra). Muslim-majority: UDF absorbs 108%; NDA gets just 5%. These are seats with structural UDF affinity (Christian-Catholic + IUML-aligned populations) where the LDF loss represents reverting to a prior alliance preference.
2. **In Hindu-heavy ACs (≥70% Hindu, n=10), NDA absorbs 44% of the LDF loss** — by far the highest NDA-absorption rate. UDF only 61%. The Hindu-heavy seats are exactly where Pattern 3 (BJP walkthrough) concentrates; they're also where the LDF loss splits most evenly between UDF and NDA.

## Net pp accounting (constituency-equal sums)

Across all 140 ACs:

| Movement | pp summed | n ACs |
|---|---|---|
| UDF gain (where it gained) | 1066.3pp | 129 |
| NDA gain (where it gained) | 389.1pp | 94 |
| OTHER gain (where it gained) | 18.1pp | 19 |
| LDF loss (where it lost) | -1055.5pp | 136 |

UDF's total constituency-equal gain (1066pp) is essentially identical to LDF's total constituency-equal loss (1055pp). The +389pp NDA gain comes from a combination of LDF loss + OTHER collapse. **The UDF-LDF mass conservation is striking: nearly every percentage point UDF gained corresponds to a percentage point LDF lost somewhere.**

This is the strongest evidence yet for the "anti-LDF, not pro-UDF" framing: there is no significant non-LDF source for UDF's gains. UDF's 102 seats came from LDF's 64-seat loss. The voters left LDF; they landed mostly on UDF.

## The opinionated reframe

> **Reading 2026 as a "Congress resurgence" or "UDF mobilisation" inverts the causality. The constituency-level vote movement is dominated by LDF erosion; UDF's gain is the geographic landing pattern of that erosion. Where the LDF voter went depends on the AC: in central and northern Kerala (Christian-Muslim heartland), LDF→UDF cleanly; in southern Kerala (Trivandrum-area Hindu pockets), LDF splits substantially toward NDA. The story is "LDF coalition exhaustion plus alliance landing-pattern" rather than "Congress comeback."**

This reframe matters because it changes the predictive model for 2031:

- A "UDF mobilisation" story implies UDF has a positive momentum that could continue. The 2031 baseline would be UDF strong.
- An "anti-LDF" story implies the swing was reactive — about LDF specifically, not UDF — and the 2031 baseline depends on whether LDF can rebuild or whether the anti-incumbency holds. The voters who defected in 2026 are not committed UDF voters; they're former LDF voters who landed on UDF for one cycle.

The Christian-Muslim-heartland landing is more durable (alliance affinity reasons); the Hindu-heavy NDA-share landing is also potentially durable if BJP holds its 2026 gains. The "UDF mobilisation" framing would predict broad-based UDF strength in 2031; the "anti-LDF" framing predicts UDF strength contingent on LDF not recovering.

## What this directly shows / what it cannot prove / what would weaken the conclusion

### What this directly shows

- Constituency-equal mean: UDF +7.29pp, LDF -7.43pp, NDA +2.05pp, OTHER -1.91pp. UDF and LDF are near-mirrors.
- Total constituency-equal pp gained / lost: UDF +1066, LDF -1055, NDA +389, OTHER +18.
- 65% of ACs show UDF-dominant absorption of LDF loss; 23% show NDA-dominant absorption; 3% saw LDF hold/gain.
- Region pattern: North 72% UDF-dominant; Central 65% UDF-dominant + 23% NDA-dominant; South 48% UDF-dominant + 40% NDA-dominant.
- Religion-bin pattern: Christian/Muslim ACs flow almost entirely to UDF; Hindu-heavy ACs split most evenly between UDF (61%) and NDA (44%).

### What this does NOT prove

- **Specific LDF voters individually defected to UDF / NDA.** This card observes vote-share movement, not voter-level switching. The same Δshare patterns are consistent with (a) direct switching, (b) differential turnout (LDF voters staying home, fresh UDF voters showing up), (c) generational replacement, or any combination. AC totals can't distinguish these.
- **UDF has no positive mobilisation factor.** The data is consistent with "anti-LDF dominates" but doesn't *exclude* a UDF mobilisation contribution that's collinear with LDF erosion (e.g., UDF mobilising existing supporters to higher turnout in seats where LDF collapse happens to be larger). The simplest reading is "LDF erosion lands on UDF"; richer mechanisms aren't ruled out.
- **The 2031 baseline is fixed.** "Anti-LDF" framing predicts UDF's gains are reversible if LDF rebuilds. But the question of whether LDF *can* rebuild is separate — voters who defected may have anchored on UDF/NDA and not return, in which case the 2026 outcome is also a structural realignment, not just an anti-incumbency manifestation.

### What would weaken the conclusion

- **Survey microdata showing significant UDF-positive sentiment as the primary motivator** for 2026 voters in central Kerala — would suggest the per-AC Δshare patterns are *consistent with* anti-LDF but the underlying voter intent was pro-UDF, which the constituency-level data can't distinguish.
- **Multi-cycle data showing the 2026 LDF defectors return to LDF in 2031** — would confirm the "anti-LDF, reversible" reading. Failure of LDF to recover any of its losses in 2031 would suggest realignment rather than transient defection.
- **A finer regression decomposition** controlling for incumbency-tenure, candidate-personality, alliance changes, etc. — could quantify what fraction of the constituency-level Δshare is "explainable" by anti-LDF factors vs. what's residual. Currently this card reports the gross movement only.

## Cross-references

- **A1 (minority consolidation)**: established that Christian-heavy ACs gained UDF disproportionately. This card adds the flow-decomposition: in Christian-heavy ACs, 122% of LDF loss flows to UDF (NDA picks up 38%; OTHER collapses too).
- **A8 (Central Kerala kingmaker)**: showed UDF won 47-of-47 in Central-5 districts. This card adds: those 47 wins are almost entirely LDF-loss redirections (Central absorbs 110% of LDF loss to UDF). The "kingmaker" outcome is the geographic landing of the LDF loss.
- **A3 (BJP wins) + bjp-ac-growth.md**: NDA's 2.05pp aggregate Δ corresponds to a 28% of LDF loss absorption nationally, but 45% in South Kerala specifically. The southern NDA-dominant pattern is structurally different from the rest of Kerala — and corresponds to the BJP-pocket geography.
- **LDF shallow-distribution**: showed LDF Δ was tightly clustered around -7pp. This card adds: that uniform loss had a *non-uniform* landing pattern — UDF absorbed it in central/northern Kerala, NDA absorbed it disproportionately in southern Kerala.
- **Vote-efficiency card**: explains the seat-conversion mechanics. This card explains the vote-share movement underlying it. Together: LDF lost ~7pp tightly (LDF shallow-distribution), the loss landed mostly on UDF in central Kerala (this card), and FPTP amplified that into a 102-seat majority (vote-efficiency card).

## Reproduce

`python3 scripts/narrative-anti-ldf-flow.py`
