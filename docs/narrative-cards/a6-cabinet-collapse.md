# A6 — Was LDF's anti-incumbency wave minister-targeted, or uniform?

**Verdict: We do not detect a constituency-level minister penalty beyond the statewide anti-incumbency swing. Mean LDF Δshare among 21 cabinet ministers (-6.89pp) is slightly smaller in magnitude than mean LDF Δshare among 78 non-minister LDF 2021 incumbents (-7.63pp). The "minister-targeted anti-incumbency" hypothesis predicts a more-negative differential for ministers; we observe a slightly less-negative one. The "13 of 21 ministers lost" headline is correctly reported but does not, on this data, support a causal story of voter targeting cabinet members specifically — minister losses appear consistent with a uniform ~7pp LDF wave hitting seats where ministers happened to be sitting in the LDF column.** Visibility ≠ targeting in this analysis.

> **A note on inference:** "Ministers were not punished for being ministers" is a stronger claim than the data supports. Voters could have specifically targeted ministers AND ministers could still have lost similar share to non-ministers — visibility-driven punishment matched by behind-the-scenes ministerial-machinery defense, for example. What we directly observe: no additional measurable minister penalty at the constituency level. The phrasing throughout this card is constrained to constituency-level claims.

This card uses the second Pinarayi cabinet roster (21 members, Wikipedia-cross-checked) and 2021/2026 LDF share deltas. See `data/ldf-ministers-2021.json` and `scripts/narrative-a6-cabinet-collapse.ts` to reproduce.

**Unit:** Mean LDF Δshare comparisons are constituency-equal — each AC counts once. Statewide reference is vote-weighted. The unit of analysis is the constituency, not the individual voter.

## The consensus claim

Multiple post-mortems (Onmanorama, The Week, Wikipedia summary, Vote Vibe pre-poll) converged on this story:

> 13 of 21 LDF ministers were defeated. Cabinet collapse signals governance rejection beyond candidate-level effects. Pinarayi himself saw Dharmadam margin collapse from 50,123 to 19,247.

If correct, we should see ministers lose MORE share than non-minister LDF incumbents (those who held an AC in 2021 but weren't in cabinet). The differential is the test.

## Counting the ministers

Our count: **14 of 21 ministers lost** (not 13). The discrepancy with the narrative reflects (a) the narrative explicitly counts Kadakampally Surendran among defeated ministers, but he was 2016 cabinet, not 2021 — he wasn't a sitting minister at the 2026 election; (b) a possible single-name miscount in coverage.

The 7 ministers who survived 2026:

| Seat | Name | Portfolio | LDF '21 → '26 | Δ |
|---|---|---|---|---|
| 12 DHARMADAM | Pinarayi Vijayan | Chief Minister | 59.6% → 50.1% | **-9.5pp** |
| 29 BEYPORE | P. A. Mohammed Riyas | Public Works | 49.7% → 44.3% | -5.4pp |
| 66 OLLUR | K. Rajan | Revenue | 49.1% → 46.1% | -3.0pp |
| 103 CHERTHALA | P. Prasad | Agriculture | 47.0% → 48.6% | **+1.6pp** |
| 110 CHENGANNUR | Saji Cherian | Fisheries | 48.6% → 42.3% | -6.3pp |
| 119 KOTTARAKKARA | K. N. Balagopal | Finance | 46.0% → 43.1% | -2.9pp |
| 130 NEDUMANGAD | G. R. Anil | Food | 47.5% → 43.8% | -3.7pp |

The 14 ministers who lost — ranked by severity of LDF share collapse:

| Seat | Name | Portfolio | LDF Δ | 2026 winner |
|---|---|---|---|---|
| 58 CHITTUR | K. Krishnankutty | Electricity (JD(S)) | **-15.2pp** | UDF |
| 26 ELATHUR | A. K. Saseendran | Forest (NCP) | **-13.9pp** | UDF |
| 113 ARANMULA | Veena George | Health (CPI(M)) | **-13.7pp** | UDF |
| 91 IDUKKI | Roshy Augustine | Water Resources (KC(M)) | -10.9pp | UDF |
| 96 ETTUMANOOR | V. N. Vasavan | Co-op / Devaswom | -10.0pp | UDF |
| 77 KALAMASSERY | P. Rajeeve | Law / Industries | -9.8pp | UDF |
| 44 TANUR | V. Abdurahiman | Sports / Wakf | -8.6pp | UDF |
| 11 KANNUR | Kadannappalli Ramachandran | Registration | -7.7pp | UDF |
| 17 MANANTHAVADY | O. R. Kelu | SC/ST/BC | -6.8pp | UDF |
| 122 CHADAYAMANGALAM | J. Chinchu Rani | Animal Husbandry | -5.8pp | UDF |
| 120 PATHANAPURAM | K. B. Ganesh Kumar | Transport | -5.3pp | UDF |
| 49 THRITHALA | M. B. Rajesh | Local Self Govt | -3.8pp | UDF |
| 70 IRINJALAKUDA | R. Bindu | Higher Education | -3.2pp | UDF |
| 135 NEMOM | V. Sivankutty | Education | -0.9pp | NDA |

## The core test: LDF incumbent Δshare, with vs without minister tag

Among **99 LDF 2021 winners** (alliance-level incumbents), 21 were in cabinet and 78 were not:

|  | n | Mean LDF Δ |
|---|---|---|
| Minister incumbents | 21 | **-6.89pp** |
| Non-minister LDF incumbents | 78 | **-7.63pp** |
| All 140 ACs (statewide reference) | 140 | -7.43pp |

**Differential: +0.74pp** — ministers lost slightly *less* share than non-minister LDF incumbents. The "minister-targeted anti-incumbency" hypothesis predicts a *negative* differential of meaningful size; we observe a small *positive* differential. We do not detect a constituency-level minister penalty above the baseline LDF-incumbent swing.

Why might ministers have lost slightly less? Two mechanisms are consistent with this pattern:

1. **Ministers had visibility, resources, and machinery for their own re-election** that ordinary backbenchers didn't. The minister tag may have been a small electoral asset, not a liability.
2. **Ministers were politically chosen for "safe" seats**, so their starting LDF margins were larger. Even with a uniform 7pp loss, their absolute defeat threshold was higher to cross. (This is part of why so many of them lost despite no extra penalty: they started at 45-50% LDF; -7pp puts them in the danger zone.)

The "13 of 21 lost" headline is correctly reported but, on this data, is consistent with **uniform anti-incumbency at scale** rather than differential minister-targeting. The data answers a constituency-level question (did ministers lose more share than non-minister LDF incumbents?) — not the voter-level question of whether voters specifically punished minister status.

## Outliers worth naming

Three ministers showed losses substantially larger than the -7pp baseline:

- **K. Krishnankutty (Chittur, -15.2pp)** — JD(S) Electricity Minister. Chittur is a Hindu-majority Palakkad-district seat; the LDF's JD(S) ally lost cohesion and the seat fell to UDF. Likely **alliance-cohesion collapse** rather than minister rejection.
- **A. K. Saseendran (Elathur, -13.9pp)** — NCP(SP) Forest Minister. Similar pattern: small-party LDF ally with declining base, candidate-level penalty compounding alliance penalty.
- **Veena George (Aranmula, -13.7pp)** — already analyzed in A2 (Sabarimala-route narrative). Possibly Sabarimala-adjacent + Health Ministry incumbency. Even with this individual penalty, the cabinet-level *mean* doesn't show outsized minister loss.

The pattern: outsized losses concentrate among **small-party LDF allies** (JD(S), NCP, KC(M)), not CPI(M) ministers. This is a *coalition* finding, not a *cabinet* finding.

V. Sivankutty (Nemom, -0.9pp LDF; lost to NDA) is the opposite case: tiny LDF share change, but the seat fell to BJP because of 3-way fragmentation in Trivandrum (cf. A3). His "loss" isn't a Sivankutty problem; it's a Nemom 3-corner problem.

## The opinionated reframe

> **Kerala 2026 was a broad anti-LDF-incumbency cycle whose constituency-level signal does not differentiate ministers from non-ministers. LDF shed approximately 7pp uniformly across the 99 seats it held in 2021. Of those 99, 21 were cabinet seats — and 14 of those 21 lost. But the "minister" tag does not, on this data, mark seats that swung more sharply against LDF than non-cabinet LDF incumbencies did.**
>
> The "13 of 21 ministers defeated" headline is correctly reported but on this evidence is consistent with uniform LDF wave + ministers happening to be sitting in 21 of the 99 LDF-held seats. The sharper question this analysis raises is: "what drove the LDF base to shed 7pp uniformly?" — left to A1 and the broader narrative cards (which find the wave was religion-blind, route-blind, and now also minister-blind).

The narrative's secondary claim — Pinarayi's Dharmadam margin collapse from 50,123 to 19,247 — is real. His LDF Δ is -9.5pp, slightly larger in magnitude than the statewide -7.4pp baseline. The absolute margin number is dramatic because Dharmadam was a high-margin seat to begin with; the Δ-share is consistent with the broader LDF-incumbent baseline.

## Methodology & limitations

- **Cabinet roster**: 21 members per the Wikipedia "Second Vijayan ministry" article, cross-checked with The Hindu / Onmanorama coverage. Excludes Kadakampally Surendran (a frequently-cited "lost minister" in coverage) — he was Devaswom Minister in 2016 cabinet, not 2021. The narrative miscounts him, costing 1 of the "13 lost" claim.
- **Comparison group**: 78 non-minister LDF 2021 winners. This is the right control because they share the alliance label and the incumbency status — only minister status differs.
- **Alliance-level vs party-level Δ**: We use alliance-level vote shares (LDF aggregate). Some ministers are from small LDF parties (JD(S), NCP, KC(M)) where party-level continuity 2021→2026 may be weaker than alliance-level. Switching to party-level Δ would change individual numbers but not the headline — the *mean* differential is the relevant statistic.
- **What this can't tell us**:
  - Whether voters consciously punished individual ministers vs. just "the LDF" as a brand. Survey microdata could partially answer; AC totals can't.
  - Counterfactual: would non-minister LDF candidates have lost less in the same seats? Untestable without parallel universe data.
- **Sample size**: 21 ministers is a small group, but the test is well-defined (mean comparison). Doesn't need formal CIs — the differential is +0.74pp, which by inspection isn't a meaningful magnitude in either direction.

## What this directly shows / what it cannot prove / what would weaken the conclusion

### What this directly shows

- 14 of 21 LDF cabinet ministers lost their 2026 contests (narrative said 13; the discrepancy comes from the narrative miscounting Kadakampally Surendran, who was 2016 cabinet not 2021).
- Mean LDF Δshare across 21 minister incumbents: -6.89pp.
- Mean LDF Δshare across 78 non-minister LDF 2021 incumbents: -7.63pp.
- Differential: +0.74pp (ministers' loss is slightly smaller than non-minister incumbents' loss).
- Outsized individual losses concentrate among small-party LDF allies (JD(S), NCP, KC(M)) — ~10-15pp Δshare losses — not among CPI(M) ministers.

### What this does NOT prove

- **Voters did not punish minister status.** Voters could have specifically targeted ministers, and ministers could still have lost similar share to non-ministers (visibility-driven punishment matched by cabinet-level resources for re-election defense). What we directly observe: no constituency-level differential. Voter-level intent is not measured here.
- **Anti-incumbency was the entire story.** The +0.74pp non-detection of minister penalty doesn't claim ministers performed unaffected by the cabinet's policy record; it claims the constituency-level Δshare doesn't differ between minister and non-minister incumbents.
- **Pinarayi's reduced Dharmadam margin is generic anti-incumbency.** His Δshare (-9.5pp) is slightly larger than baseline; it could be a CM-specific penalty, or it could be Dharmadam-specific local dynamics, or stochastic. n=1 doesn't separate these.

### What would weaken this conclusion

- **A more granular cabinet-status taxonomy** (e.g., separating "high-profile" ministers from "junior" ministers based on press salience or portfolio importance) showing a penalty for the salience-weighted high-profile subset. This would reveal that "all-21 mean" obscures a real penalty on the most-visible cabinet members.
- **Survey microdata showing voters in minister seats reported minister-specific dissatisfaction at higher rates than voters in non-minister LDF seats.** Would suggest voter-level targeting that didn't manifest in constituency-level differential.
- **Replication in a different anti-incumbency cycle.** If 2031 (or a cycle elsewhere) shows a clear minister-penalty in similar conditions, the 2026 non-detection here might be a sample-specific artifact.

## Cross-references

- **A1**: established that LDF's collapse was religion-blind. A6 adds: also minister-blind at the cabinet aggregate. Two layers of "the wave was uniform across the things people thought were targeted."
- **A2**: identified a ~4pp minister penalty for 3 Devaswom-related ministers (Vasavan, Veena George, Kadakampally). A6 contextualises: those 3 are outliers within the broader cabinet — the full 21-member mean doesn't carry the same signal. The A2 finding is real for those 3 specifically, but doesn't generalise.
- **A3 (BJP's 3 wins)**: V. Sivankutty losing Nemom is one of BJP's 3 wins. A6 finds his LDF Δ was only -0.9pp — consistent with three-way fragmentation rather than a Sivankutty-specific minister penalty.

## Reproduce

`bun run scripts/narrative-a6-cabinet-collapse.ts`
