# Methodology — core concepts

Reference doc covering the methodological choices that recur across the catalog. Individual cards link here instead of re-explaining each concept.

This document is hierarchically beneath the synthesis card and parallel to `methodology-gradient-vs-cluster.md` (which covers the conceptual distinction between gradient and cluster claims).

## Constituency-level inference vs voter-level inference

The most consequential interpretive boundary in this catalog. Almost every analysis operates on **constituency-level totals** (vote share, seats, alliance Δ) and not on voter-level data (individual voter intent, sub-community motivation, turnout decomposition).

The asymmetry: a constituency-level pattern is consistent with multiple voter-level mechanisms.

Example. The finding that "Christian-heavy ACs swung +3-4pp more to UDF than matched Hindu-majority controls" is a constituency-level statement. It's consistent with:

1. Christian voters individually switching from LDF to UDF (the press's typical reading)
2. Differential turnout — Christian LDF voters staying home, Christian UDF voters showing up
3. Cross-community voter movement — Hindu and Muslim voters in those ACs moving to UDF for non-religion reasons that happened to correlate with Christian-share geography
4. Candidate-personality effects — UDF candidates in Christian-heavy ACs being structurally stronger
5. Sub-community dynamics — specific Christian denominations (Syro-Malabar vs Latin Catholic vs Marthoma) moving differently
6. Some combination of the above

Constituency-level data cannot discriminate between these mechanisms. Survey microdata (booth-level polling, exit polls, post-poll panels) could.

**Convention used in this catalog:** When a card says "Christian-heavy ACs swung to UDF," that's shorthand for the constituency-level pattern. When precision matters, cards use formulations like "Christian-heavy constituencies showed larger UDF swings" rather than "Christian voters moved to UDF." The former is what the data says; the latter is one inference consistent with the former.

This distinction maps to the **ecological fallacy**: drawing voter-level conclusions from group-level data is a known statistical pitfall. Cards should be readable as ecological-fallacy-free if they stick to constituency-level claims; voter-level claims require explicit caveat.

## Vote-share Δ accounting

The basic operation underlying most cards: per-AC alliance vote-share Δ between 2021 and 2026.

### Definitions

- **Alliance share in an AC** = (sum of alliance-tagged candidate votes) / (total non-NOTA votes) × 100. Computed per AC.
- **Alliance Δshare** = 2026 share − 2021 share. Per AC.
- **Statewide aggregate** = vote-weighted across all 140 ACs. Different from constituency-equal mean.

### Alliance tagging

Every candidate has an `alliance` field set in the source data. Most candidates are tagged via their party (Congress → UDF, CPI(M) → LDF, BJP → NDA). Some candidates have explicit alliance variants:

- `Independent (UDF)`, `Independent (LDF)`, `Independent (NDA)` — alliance-aligned independents (rebels supported by an alliance, or sub-alliance candidates). Tagged with their backing alliance.
- `Independent` (no parenthetical) — genuinely unaligned. Tagged `OTHER`.
- Allied small parties (KC(M), KC(J), JD(S), NCP, RSP, BDJS, etc.) — tagged with their alliance at the time of each election.

This means a small-party candidate's votes count toward whatever alliance they were associated with in that cycle. If a party switches alliances between cycles, the 2021 vs 2026 Δshares will reflect both voter movement AND the alliance relabeling. See "KC(M) handling" below for the one case in this dataset where this matters most.

### KC(M) handling

Kerala Congress (M) — Jose K. Mani's faction — is alliance-tagged LDF in **both** 2021 AND 2026 in the source data. KC(M) joined LDF in 2020, before this catalog's analysis window. The "KC(M) returned to UDF in 2026" claim that some commentary makes is a misremembering of the 2016→2020 switch.

Implication: there is *no alliance-relabel artifact* in 2021→2026 alliance-Δshare figures from KC(M). KC(M) candidates count as LDF in both cycles' totals. Where KC(M)'s vote share dropped in 2026 (which it did, by ~7pp on average across the 12 KC(M)-contested ACs), that drop appears as LDF Δ — which in those specific seats reflects KC(M) base movement to other alliances, not relabeling.

A1 includes a robustness check stripping KC(M) from both cycles' totals and re-running the Christian-belt premium calculation. About 12% of A1's Christian-belt premium is mechanically attributable to KC(M)-specific dynamics; ~88% is non-KC(M).

### NOTA exclusion

NOTA votes are excluded from all denominators. Alliance shares are computed as a proportion of *non-NOTA* total votes. NOTA Δshare is not analysed independently — it's a small residual (~1% in most ACs).

## Constituency-equal vs vote-weighted

Two different ways to summarise an alliance's swing:

- **Constituency-equal mean Δshare** — sum of per-AC Δshares, divided by 140. Each AC counts once regardless of turnout. Used for bin tables, regression coefficients, and most card-level comparisons. The unit of analysis is the constituency.
- **Vote-weighted statewide Δshare** — sum of alliance votes / sum of total votes, computed separately for 2021 and 2026, then differenced. Each voter counts once regardless of which AC they're in. Used for headline statewide aggregates ("BJP +0.18pp statewide").

These can differ. A constituency-equal mean Δ of, say, +7pp can correspond to a vote-weighted statewide Δ of +5pp if the swing was larger in low-turnout ACs. In Kerala 2026, the two metrics happen to be close (constituency-equal UDF Δ = +7.29pp, vote-weighted UDF Δ = +7.40pp), but the distinction is methodologically real.

**The choice in this catalog:** constituency-equal for everything seat-related (which AC swung how, what bin shows what differential, what regression says); vote-weighted for headline statewide aggregates (which gives the metric appropriate to "the state's voters as a whole"). Each card states its convention.

## Religion baseline (2025 projection vs 2011 raw)

Per-AC religion shares come from `data/ac-demographics-2025.json`, which is the **2025 cohort projection**: Census 2011 base × state-level CRS-births-by-religion multipliers (Hindu × 0.96, Muslim × 1.12, Christian × 0.97), applied uniformly per AC and renormalised. The raw 2011 baseline is at `data/ac-demographics.json`.

The catalog defaults to 2025. Switching to raw 2011 moves Pearson correlations by ≤0.01 (uniform multipliers preserve rank order, and Pearson is invariant to monotonic transformations of a single variable). Cards verify their findings under both bases; results are unchanged.

The 2025 projection is reality-aligned for absolute-share statements ("Vengara is 85% Muslim"). The raw 2011 base is the original census; projection is an estimate. Either base produces the same correlation analyses; the choice mainly affects the absolute-share readings in the bin tables.

## District / region fixed effects

Used in `scripts/narrative-regression.py` to test whether per-AC Pearson correlations between religion/caste shares and alliance Δshare survive geographic-clustering controls.

### District FE (14 dummies, one dropped as reference)

Each AC contributes a dummy for its district (one dropped to avoid perfect collinearity with the intercept). In a model `udf_delta ~ christian_share + muslim_share + udf21_share + district_FE`, the coefficient on `christian_share` represents the *within-district* effect of Christian share on UDF Δshare. ACs in the same district share the same district fixed effect, so the coefficient captures only AC-to-AC variation within each district.

This is the strictest geographic control available at the dataset's current resolution. If a coefficient survives district FE at p<0.05, the relationship is robust to "the religion gradient is just a Central-Kerala-region effect" critique.

District FE absorbs **caste data perfectly** because Hindu sub-community shares in this catalog are inherited from district-level data (`data/hindu-caste-by-district.json`) — every AC in a given district has the same caste shares. So caste effects can only be tested under region FE, not district FE.

### Region FE (3 regions: North / Central / South)

Coarser geographic control. North = Kasaragod / Kannur / Kozhikode / Wayanad / Malappuram; Central = Palakkad / Thrissur / Ernakulam / Idukki / Kottayam / Pathanamthitta / Alappuzha; South = Kollam / Trivandrum.

Used when district FE is too strong (e.g., for caste analysis where district FE absorbs the predictor) or when region-level interpretation is more informative than district-level.

### Reading FE results

A coefficient that:
- **Survives district FE** → within-district variation in the predictor genuinely associates with the outcome. Strongest evidence for a gradient.
- **Survives region FE only** → the predictor associates at coarser geographic resolution but not within-district. Weaker; possibly explained by some region-level factor correlated with the predictor.
- **Doesn't survive even region FE** → the simple Pearson r was driven by between-region clustering. The "gradient" was actually a "cluster."

Cards that report FE results: A1 (Christian survives district FE; Muslim collapses), A3 (BJP × Hindu weakens to p=0.213 with district FE), B3+B4 (Nair × UDF Δ barely survives region FE; can't test district FE). Cards that don't (A2, A6, A8) use treatment-control or descriptive designs where FE isn't the relevant test.

## Treatment-control design (small-sample comparisons)

Used in A2 and A6. Logic: identify a small "treatment" group (3-21 ACs) defined by a hypothesis (Sabarimala-route ACs, cabinet ministers); compare to a "control" group (statewide or matched-Hindu-majority); report the differential.

This is more robust to small samples than regression because it doesn't require large-N variance estimation. Direction-of-effect findings (e.g., "LDF lost LESS in Sabarimala-route ACs, opposite of the press prediction") are robust to small-N noise; magnitude estimates are not. Cards using this design report differentials but flag that formal hypothesis tests aren't applied at meaningful power with n=3-5.

## Bin tables vs regression

**Bin tables** (used in A1, B3+B4, anti-ldf-flow) discretise a continuous predictor into bins (e.g., Christian-heavy 30-50%) and report the mean outcome per bin. Useful for showing thresholded or non-monotonic patterns.

**Regression** (used in `narrative-regression.py`) treats the predictor as continuous and fits a coefficient. Useful for testing gradient claims with controls.

Both are reported in A1 — the bin tables describe the practical magnitude (n=32 in the Christian-heavy bin, +10.40pp UDF Δ), while regression confirms the gradient survives controls (β=+0.19, p=0.008 with district FE). Bin tables and regression are complementary, not redundant.

## Outlier handling

Outliers are identified via 2-SD threshold on the relevant Δshare distribution and reported individually in each card. The catalog does NOT exclude outliers from primary analyses; instead it reports them transparently and discusses whether they affect the headline finding.

Recurrent outlier ACs across the catalog:

- **Pala** (52% Christian, NDA win 2026 by Mani C. Kappan / NCP) — appears in A1, A2, A8, bjp-ac-growth
- **Thiruvalla** (48% Christian, three-way fragmentation with JD(S) winner) — appears in A1, A2, bjp-ac-growth
- **Udumbanchola** (48% Christian, Idukki, biggest Christian-belt swing) — A1
- **Vengara** (85% Muslim, only Muslim-majority LDF gain) — A1, ldf-shallow-distribution
- **Konni** (61% Hindu, only Pathanamthitta LDF win) — A2, A8, ldf-shallow-distribution
- **Puthuppally** (49% Christian, KC(M) seat with -16.8pp LDF) — A1, ldf-shallow-distribution
- **Kazhakoottam** (69% Hindu, BJP win by 428 votes) — A2, A3, A6
- **Nemom** (69% Hindu, Sivankutty's seat lost to BJP) — A3, A6

Cards reference these outliers consistently — when the same AC appears in multiple cards, it should map to the same explanation across cards.

## Falsification triggers (the "would weaken" framing)

Every evidence card includes a "What would weaken this conclusion" section listing concrete tests that would force a re-evaluation. This is Popperian methodology applied to election analysis: the value of a finding is partly defined by what would falsify it.

Common falsification triggers:
- **Multi-cycle replication failure** — if 2031 doesn't show a similar pattern, the 2026 effect was cycle-specific
- **Survey microdata** — if voter-level surveys contradict a constituency-level inference, the inference loses ground
- **Higher-resolution geographic controls** — sub-district / Lok Sabha-constituency FE could absorb a finding currently surviving district FE
- **Sub-community data** — Christian / Muslim sub-community polling could decompose patterns the catalog treats as monolithic
- **Counterfactual sharpening** — vote-efficiency's "+58 seats" attribution depends on uniform-swing assumption; a religion-conditioned counterfactual could re-attribute

Each card's specific falsification triggers are listed in its trifecta closing section.

## Card structure convention

Most evidence cards in this catalog follow:

1. **Verdict block** — one paragraph stating the finding.
2. **Confidence label** — Strong / Moderate / Exploratory tag with one-clause justification.
3. **Inference note** — short callout flagging constituency-level vs voter-level boundary.
4. **Unit declaration** — constituency-equal vs vote-weighted convention for that card.
5. **Body** — analysis with bin tables, regression results, treatment-control comparisons, etc.
6. **The opinionated reframe** — sharpened reading of the press claim.
7. **Trifecta closing** —
   - "What this directly shows"
   - "What this does NOT prove"
   - "What would weaken the conclusion"
8. **Cross-references** — pointers to other cards that overlap the finding.
9. **Reproduce** — script reference.

The synthesis card and methodology briefs (this doc + `methodology-gradient-vs-cluster.md`) follow a different structure — they're framework-level rather than evidence-level.

## What this methodology page does NOT cover

- **Visualization conventions** — charts and maps aren't yet built; a separate visualization methodology will follow if/when that phase happens.
- **Cross-state comparisons** — this catalog is Kerala-only; comparing 2026 Kerala dynamics to elections elsewhere requires data + methodology not in scope.
- **Forecasting** — the catalog is descriptive / explanatory, not predictive. 2031 falsification triggers are listed in cards, but no formal predictions are made.

## Cross-references

- `methodology-gradient-vs-cluster.md` — distinct conceptual layer covering the gradient-effect vs cluster-effect distinction
- `synthesis-three-patterns.md` — the catalog's interpretive spine
- `docs/narrative-improvements-notes-session1.md` — full regression tables from the methodology-hardening pass
- `docs/data-pipeline.md` — upstream data construction (SHRUG joins, Census C-01 aggregation, 2025 projection)
- `scripts/narrative-regression.py` — OLS with district / region FE
- `scripts/narrative-a1-no-kcm.py` — KC(M)-isolated robustness check
