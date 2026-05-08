# Synthesis — Kerala 2026 was three overlapping patterns, not one wave

**Thesis: Kerala 2026 is best read as three distinct patterns laid over the same map. Much of the dominant post-election commentary implicitly pooled these patterns into a single broad minority-consolidation narrative; the constituency-level data shows them as separate phenomena that happen to align in some places and diverge in others.** Anti-LDF anti-incumbency was the broad universal driver (~7pp uniform); a Christian-belt UDF coalition-share premium added ~3-4pp on top in Central Kerala (with a partly KC(M)-base-movement mechanism); and a geographically concentrated BJP advance captured 3 wins in Trivandrum-area Hindu-heavy seats where UDF candidate selection was weak. Reading these three layers together — instead of as one bloc story — is what the AC-level data unlocks.

**Confidence: Interpretive synthesis** — the three patterns are each grounded in their own evidence cards (cited below). The synthesis itself is a framework for reading the catalog, not a separate empirical finding. The pattern-decomposition is testable in 2031 (do the same three patterns recur, or do they merge / diverge differently?).

This card is a synthesis spine for the catalog. Individual evidence chapters are:

- **Pattern 1 (anti-LDF wave):** A1 (religion-blind LDF collapse), A2 (Sabarimala-route doesn't add a separate effect), A6 (cabinet status doesn't add a separate effect), `ldf-shallow-distribution.md` (the full distribution shape backing "uniform"), `anti-ldf-flow.md` (where the LDF loss landed)
- **Pattern 2 (Central Kerala UDF surge):** A1 (Christian-belt premium with district-FE robustness), A8 (47-of-47 sweep across 5 districts), `vote-efficiency.md` (FPTP amplification of the Central-5 swing into 102 seats)
- **Pattern 3 (BJP geographic pocket):** A3 (3 wins in Hindu-heavy Trivandrum-area + UDF underperformance), B3+B4 (district-level Nair-belt overlaps with NDA concentration, exploratory)

> **A note on inference:** This synthesis describes constituency-level patterns aggregated across the catalog. Each pattern's underlying mechanism is multi-causal and not fully resolvable from constituency vote totals alone. Voter-level claims are avoided; the language throughout is constrained to AC-level outcomes and direction-of-effect tests against press claims.

---

## Pattern 1: Anti-LDF anti-incumbency was uniform

What this means: LDF lost approximately 7pp of vote share across nearly every constituency it contested in 2021. The drop was effectively religion-blind, geography-blind, route-blind, and cabinet-status-blind. The press post-mortems sliced the wave into many sub-narratives ("Hindu backlash", "minister punishment", "Sabarimala anger"); the constituency-level data finds no robust *additional* differentials beyond the uniform baseline.

Evidence:

- **A1**: Statewide LDF Δshare = -7.4pp. Pearson r between Christian/Muslim share and LDF Δ collapses or flips sign under district fixed effects — the LDF collapse is not religion-share-mediated within-district.
- **A2**: Geographic Sabarimala-route ACs (Aranmula, Konni, Ranni) show LDF Δ -3.6pp vs -7.3pp in matched Hindu-majority controls — *less* LDF loss in pilgrim-route ACs, opposite of the press prediction. NDA share fell in those ACs too. The "Hindu-issue route penalty" prediction has the wrong sign on both limbs.
- **A6**: Mean LDF Δshare among 21 cabinet ministers = -6.89pp; among 78 non-minister LDF incumbents = -7.63pp. Differential of +0.74pp — ministers lost slightly *less*, not more. A constituency-level minister penalty above the LDF-incumbent baseline is not detectable.

Together: the "things voters thought were targeted" (religion, route, cabinet) do not register as drivers of differential LDF loss at the constituency level. The wave was broad and even.

## Pattern 2: Central Kerala UDF coalition-share surge

What this means: ACs with high Christian share — particularly the central Kerala mixed-religion belt (Kottayam, Idukki, Pathanamthitta, Ernakulam) — added a ~3-4pp UDF coalition-share premium on top of the statewide ~7pp gain. This signal survives district fixed effects (β=+0.194, p=0.008), distinguishing it from Pattern 1's uniform wave. Mechanism is a mix: ~88% non-KC(M) cross-community consolidation + ~12% Kerala Congress (M) base defection from LDF-aligned KC(M) to UDF-aligned KC(J) and INC.

Evidence:

- **A1**: Christian-share × UDF-Δ Pearson r = +0.20 simple; β=+0.194 (p=0.008) under district FE. Within-district Christian-share variation predicts UDF gain robustly. Mean UDF Δshare in Christian-heavy bin (30-50%, n=32) = +10.40pp, premium of +3.11pp over statewide. ~12% of premium attributable to KC(M) base movement; ~88% non-KC(M).
- **A8**: UDF won 47 of 47 seats across Idukki, Ernakulam, Wayanad, Malappuram, Kottayam (the "Central-5" districts). Pre-poll Manorama-C Voter projection ("UDF 33 of 53") underestimated by 23-38pp. 46% of UDF's 102-seat majority came from these 5 districts containing 34% of Kerala's ACs. Strip Central-5 and UDF doesn't cross the 71-seat majority threshold.

Mechanism note: Muslim-share variation does *not* add a separate detectable premium in this pattern (A1's Muslim coefficient collapses under district FE). Muslim-heavy ACs (Malappuram) participated in the UDF surge but at the statewide baseline rate, not above it. The press's "Muslim + Christian as one consolidating bloc" framing combines a real Christian premium with a non-finding on the Muslim side.

## Pattern 3: BJP's 3 wins as a geographically concentrated pocket

What this means: BJP captured 3 seats — Nemom, Chathannoor, Kazhakoottam — all in or adjacent to Trivandrum district, all in 65%+ Hindu-share ACs, all in seats where UDF candidate selection underperformed. Statewide BJP vote-share aggregate moved only +0.18pp — but underneath the flat aggregate, BJP gained 14-25pp in 11 specific ACs and withdrew from 26 others (yielding to NDA allies). The wins are real and concentrated; the "BJP grew systematically more in Hindu-heavy seats" gradient claim weakens under controls (district-FE β=+0.098, p=0.213).

Evidence:

- **A3**: 3 BJP wins have mean Hindu share 70.2% vs 53.4% statewide. UDF Δshare in those 3 ACs = +0.64pp vs +5.79pp in matched Hindu-majority controls — about 5pp UDF underperformance differential. All 4 named Christian BJP candidates lost; 3 of the 4 added 14-25pp to BJP's local share without winning. The "BJP can't make Christian inroads" framing is correct on win-rate but misleading on momentum.
- **BJP AC-growth (`bjp-ac-growth.md`)**: documents the broader per-AC reshuffle the +0.18pp aggregate hides. Distribution: -21.9pp to +25.1pp across 140 ACs. 11 ACs gained ≥10pp; 10 ACs lost ≥10pp; 26 ACs were BJP cessions to its two NDA allies — Twenty 20 (Ernakulam) and BDJS (elsewhere). Most central-Kerala BJP cessions occurred in Christian-mixed Ernakulam (mean BJP Δ -4.40pp district-wide). The +14-25pp gains in Pala, Poonjar, Thiruvalla concentrate where BJP fielded high-profile candidates (Shone George, P.C. George, Anoop Antony).
- **B3+B4 (exploratory)**: District-level Nair share is negatively associated with UDF Δshare under region fixed effects (β=-0.272, p=0.044). District FE absorbs caste perfectly, so the within-district test isn't feasible. The Nair-heavy belt overlaps geographically with NDA concentration — consistent with a Trivandrum-region pattern, not a per-AC caste-voter behavior claim.

Mechanism note: this pattern is concentrated AND reshuffled, not gradient. The 3 wins themselves are descriptive observations on 3 specific ACs. The broader "BJP grew where Hindu share is higher" claim is statistically marginal once geographic clustering is controlled. The under-the-aggregate reshuffle (gains in some central-Kerala ACs + cessions in others, both at ~10-25pp magnitudes) is the more striking finding.

---

## How the three patterns interact

**Where they align:** Central Kerala (Pattern 2) sat on top of the broad anti-LDF wave (Pattern 1). The 47-of-47 UDF sweep across 5 districts is Pattern 1 (uniform LDF -7pp) + Pattern 2 (+3-4pp Christian-belt premium) reinforcing each other. UDF needed both layers to convert Central Kerala into a complete sweep.

**Where they diverge:** BJP's 3 wins (Pattern 3) sit *outside* Pattern 2's geography. They occur in Trivandrum-area Hindu-heavy seats where Pattern 1's anti-LDF wave + UDF candidate weakness left openings BJP exploited. Pattern 3 is structurally different: it's about a cluster of opportunity-conversion in a specific district, not a gradient or a wave.

**Where commentary tends to collapse them:** much of the dominant post-mortem framing pools Christian + Muslim consolidation and treats BJP's 3 wins as either a "breakthrough" or a "limited gain" without contextualising them as a separable concentrated pocket. Some commentary did distinguish anti-incumbency, BJP concentration, and Christian-belt motion; what the constituency-level analysis adds is a coherent decomposition where each pattern is testable independently rather than implicitly combined into a single narrative.

## Swing source vs seat amplification

A distinction worth making explicit because the catalog has cards on both sides of it:

- **Swing source** — where the votes came from, where they went. This is what `anti-ldf-flow.md` analyses: the per-AC arithmetic of LDF Δshare landing on UDF / NDA / OTHER. It describes the *vote movement mechanics*.
- **Seat amplification** — how FPTP plurality converted that vote movement into seat counts. This is what `vote-efficiency.md` analyses: the seats-per-vote-share ratio flip, the wasted-votes accounting, the counterfactual that ~58 of UDF's 102 seats came from FPTP amplifying the geographic distribution of the swing.

These are analytically separable layers. A 7pp uniform LDF→UDF swing in a system with proportional representation would have produced ~10 additional UDF seats. The same swing in Kerala's FPTP system, applied to a vote distribution that already sat near 50/50 in many ACs, produced 61. The "amplification" is the institutional layer; the "swing source" is the voter-movement layer. Neither alone explains 2026; together they explain how a calm-looking distributional shift produced a landslide-looking seat split.

## Kerala 2026 was not highly polarized geographically

A finding that the catalog implies but the press framing rarely acknowledges: **Kerala 2026 was a calm distribution shift overlaid with modest local patterns, not a sharply polarized communal realignment.**

Evidence for this reading:

- **Pattern 1 (uniform anti-LDF)** — LDF Δshare distribution has SD 4.47pp, the smallest of the three alliances; 75% of ACs lost 0-10pp; only 6 (4.3%) had catastrophic loss (`ldf-shallow-distribution.md`). This is consistent with broad anti-incumbency hitting roughly evenly, not with concentrated geographic wipeouts.
- **Pattern 2 (Christian-belt premium)** — within-district Christian gradient survives FE controls but is modest (~3-4pp differential, β=+0.19). The "consolidation" is real but small relative to the uniform wave (7pp).
- **Pattern 3 (BJP pocket)** — 3 wins in 3 specific seats, statewide BJP aggregate +0.18pp. Concentrated geographic pocket, not a state-level Hindu-realignment surge.

The implicit press framing — that 2026 represented "communal realignment" or "minority consolidation" as a primary mechanism — predicts a much more polarized geography than the data shows. A genuinely polarized realignment would produce bimodal LDF-loss distributions (wipeout zones + held zones), large within-region religion gradients, and broad-based BJP advance reflecting durable Hindu mobilisation. The 2026 data shows none of those. What it shows is a calm 7pp anti-LDF drift, with a modest Christian-belt overlay that survived controls and a localised BJP cluster that doesn't. This is a much more structurally coherent — and politically less alarming — interpretation than the realignment framing.

This matters because the predictive implications differ sharply between the two readings. A polarized-realignment interpretation predicts continuing fracture and durable shifts. A calm-distribution-shift interpretation predicts that swings are more reversible: a future LDF recovery from a -7pp baseline is structurally more plausible than a recovery from a polarized "permanent loss of community X" reading.

## What contradicted my prior expectations

This catalog accumulated several findings that ran against my pre-analysis intuitions. Documenting them here because the surprises are part of the epistemic record — and because findings that reverse priors are often the most informative.

- **Sabarimala-route effect had the wrong sign.** Going in: expected geographic Sabarimala-route ACs to show LDF losses larger than matched-Hindu controls + corresponding NDA gains. Found: smaller LDF loss (-3.6pp vs -7.3pp) and *negative* NDA Δshare in those ACs. Both limbs of the press prediction inverted.
- **Muslim-share gradient collapsed under district FE.** Going in: expected the simple Pearson r=-0.01 for Muslim × UDF Δ to be the headline. Found: that simple-correlation finding actually *strengthens* under district FE — within-district Muslim share has zero predictive power for UDF Δ (β=+0.016, p=0.795). The press's "Muslim consolidation" framing fails even more cleanly than the simple correlation suggested.
- **Cabinet-status had no constituency-level penalty.** Going in: "13 of 21 ministers lost" headline implied minister-targeting. Found: the 21-minister vs 78-non-minister-LDF-incumbent comparison shows ministers lost slightly *less* (-6.89pp vs -7.63pp). The headline is a true statement that doesn't support the causal story it implies.
- **UDF didn't win mostly on tight margins.** Going in (writing the vote-efficiency card): expected UDF's "efficient" win pattern to mean lots of close margins. Found: UDF's median winning margin is 12.19pp; LDF's is 6.99pp. UDF won by *bigger* margins on average. The efficiency story is the seat:vote ratio flip (UDF 1.04 → 2.18, LDF 2.19 → 0.93), not a "won on tight margins" pattern.
- **BJP's flat statewide aggregate hides ±25pp AC reorganisation.** Going in: expected the +0.18pp number to mean "BJP stayed flat" everywhere. Found: 11 ACs gained ≥10pp, 26 ACs lost share entirely (BJP cessions to NDA allies), gains and cessions roughly cancel. The aggregate masks one of the most significant geographic reshuffles in the dataset.
- **Of those 11 big BJP gainers, 8 were contest-entry activations rather than organic expansion.** Going in (writing bjp-ac-growth): expected most of the +14-25pp gains to represent BJP brand-building. Found: 8 of 12 came from a near-zero 2021 base, primarily explained by BJP fielding seriously where it had previously stood aside. Only 3-4 represent genuine organic expansion. Sharpens the durability story.

The pattern across these surprises is consistent: press framings tend to project causal mechanisms onto raw correlations or headline statistics that the constituency-level data doesn't support once tested. The "minority consolidation," "Sabarimala-route backlash," "minister-targeted anti-incumbency," and "BJP breakthrough" framings all map to genuine descriptive patterns but mis-attribute them to specific causal mechanisms. The catalog's main analytical contribution is decomposing those framings into testable sub-claims and showing which sub-claims survive constituency-level scrutiny.

## What this synthesis does NOT prove

- **The three patterns are causally independent.** They share geography, voters, and timing. The decomposition operates at the level of "different things testable against constituency-level data," not at the level of underlying voter motivations.
- **Pattern 2's Christian-belt premium is voter-switching in the conventional sense.** The mechanism could be turnout, party-base mechanical consolidation (KC(M) defection), denominational shift, or candidate-personality. The constituency-level pattern is documented; the voter-level mechanism is not.
- **Pattern 3's BJP wins are a stable structural achievement.** P.C. George, Shone George, Anoop Antony each contributed 14-25pp BJP-share growth in Christian-mixed central Kerala — but those gains may be candidate-personality bumps that revert in 2031 with different candidates. The 3 wins themselves were narrow (5,000 / 4,402 / 428 votes); 2031 is the durability test.
- **2026 is reproducible.** This synthesis is built on a single observation. The three-patterns framework would gain credibility if elements recur in 2031 (Central-5 sweep durability, Trivandrum BJP retention, religion-blind anti-incumbency in subsequent anti-government cycles).

## What would weaken the synthesis

- **Survey microdata showing voters in Pattern-2 ACs reported Pattern-3-style motivations** (Hindu-issue or BJP-curious sentiment) — would suggest the patterns are confounded at voter level even if separable at constituency level.
- **Multi-cycle data showing Pattern 1's "religion-blind wave" doesn't generalize** — would suggest 2026's apparent uniformity was specific to that cycle's anti-incumbency dynamics.
- **A more granular regression with sub-district / Lok Sabha constituency fixed effects** showing Pattern 2's Christian-belt premium dissolves at finer geographic resolution — would force a reframe to "central Kerala region effect" rather than "Christian-share effect."
- **Pattern 3's BJP gains reverting in 2031** — would suggest the geographic-pocket framing was correct for 2026 but transient.

## Cross-reference index

| Pattern | Primary cards | Secondary cards |
|---|---|---|
| 1: Anti-LDF wave | A1, A2, A6, ldf-shallow-distribution, anti-ldf-flow | A8 (geographic distribution of the wave) |
| 2: Central Kerala UDF surge | A1, A8, vote-efficiency | A2 (Sabarimala falsification clarifies the geography is Christian-belt, not Hindu-route), anti-ldf-flow (Central-5 absorbed 110% of LDF loss) |
| 3: BJP geographic pocket | A3, bjp-ac-growth | B3+B4 (district-level Nair-belt overlap, exploratory), anti-ldf-flow (South Kerala 45% NDA absorption) |

For methodology and data:
- `scripts/narrative-regression.py` — regression with district / region FE
- `scripts/narrative-a1-no-kcm.py` — KC(M)-isolated A1 robustness check
- `data/ldf-ministers-2021.json` — cabinet roster used in A6
- `docs/narrative-improvements-notes-session1.md` — full Session-1 regression results

The three-patterns reading is the unified framing; each individual card is the evidence chapter for one pattern (or the falsification of a pattern that the press claimed but the data doesn't support).
