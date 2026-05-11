# Community-relevance pilot — Christian sub-rites

A first attempt at identifying *which communities are electorally relevant within each AC*, applied to Christian sub-rites as a pilot. The discussion behind this lives in the chat history; this document records what the pilot computed, what it found, what it agrees with, where it disagrees, and what we learned about the framework before generalising.

## 1. The framework

For every (AC, Christian sub-rite) pair where the sub-rite's **voter-share** is at least 5 %, compute:

```
required_swing_pp = AC_margin_pp / (voter_share / 100)
```

This is "how much would this community need to swing to flip the AC outcome?". Assign a tag:

| Tag | Condition | Interpretation |
| --- | --- | --- |
| **decisive** | `required_swing ≤ 25 pp` | Community can plausibly flip the seat — 25 pp is at the high end of observed sub-rite swing magnitudes in our data, so anything inside this bound is reachable. |
| **blocking** | not decisive, but `voter_share ≥ 20 %` | Too few to flip the AC alone given the 2026 margin, but large enough that no party can ignore them. |
| **latent** | otherwise | Present but neither decisive nor blocking — small share + safe seat. |

### Inputs

- **Voter share** per (AC, sub-rite) — from `getVoterShareBreakdown()` in `src/lib/data/religious-pois.ts`, which combines the OSM-derived within-Christian sub-rite mix with the AC's Census Christian share (2025-projected baseline).
- **AC margin** — winner vs runner-up, as % of total votes cast, from `data/results-2026.json`.
- **Strategy table** — the 36-AC `CHRISTIAN_BELT_36` data in `src/pages/walkthroughs/udf-data.ts` (the parties' actual candidate-selection strategy per AC). Used only for cross-validation, not for tagging.

### What the framework does NOT do

- Doesn't estimate **how** the community voted — only whether they're large enough to matter.
- Doesn't distinguish **2026-specific relevance** from **durable political relevance**. Some ACs that look "latent" under the framework still have parties fielding Christian candidates — see §4.
- Doesn't handle **Hindu sub-communities** or **Muslim sub-rites** (out of scope for the pilot).
- Doesn't compound POI-proxy error with religion-share error — both are inputs we treat as fixed, but each carries its own noise.

---

## 2. Headline numbers

Out of **143** (AC, sub-rite) pairs at ≥ 5 % voter-share across all 140 ACs:

| Tag | Pair count | Distinct AC count |
| --- | ---: | ---: |
| **decisive** | 16 | 14 |
| **blocking** | 15 | 15 |
| **latent** | 112 | (rest) |

**83 of 140 ACs** carry at least one Christian sub-rite at ≥ 5 % voter-share. Of these 83:

- **14 ACs** have at least one **decisive** sub-rite — i.e. a Christian sub-rite that could plausibly flip the 2026 outcome.
- **15 ACs** have a **blocking** sub-rite but no decisive one — large Christian sub-rite present, but the 2026 margin was too wide for plausible community swing to matter.
- **54 ACs** carry only latent Christian sub-rite presence — too small + the AC's electoral dynamics live elsewhere.

### Per-sub-rite breakdown

| Sub-rite | Decisive | Blocking | Latent | Total |
| --- | ---: | ---: | ---: | ---: |
| syro_malabar | 9 | 10 | 22 | 41 |
| latin_catholic | 3 | 4 | 26 | 33 |
| indian_orthodox | 2 | 0 | 22 | 24 |
| marthoma | 2 | 0 | 10 | 12 |
| csi | 0 | 1 | 9 | 10 |
| jacobite_syrian | 0 | 0 | 14 | 14 |
| pentecostal | 0 | 0 | 4 | 4 |
| knanaya_catholic | 0 | 0 | 2 | 2 |
| syro_malankara | 0 | 0 | 2 | 2 |
| other_christian | 0 | 0 | 1 | 1 |

Syro-Malabar dominates the decisive + blocking columns (19 of 31 = 61 %) — which matches the central-Kerala SM heartland of the Christian belt. Latin Catholic adds another 7. Indian Orthodox + Marthoma surface 4 more decisive tags in the Pathanamthitta corridor.

---

## 3. The 14 decisive ACs

ACs sorted by 2026 margin (closest first). These are the seats where a Christian sub-rite at ≥ 5 % voter-share could plausibly have flipped the result.

| AC | Name | Margin | Winner | Decisive sub-rite(s) | Strategy* |
| ---: | --- | ---: | --- | --- | --- |
| 64 | Manalur | 0.1 pp | LDF | syro_malabar @ 18 % | — |
| 132 | Kazhakoottam | 0.3 pp | NDA | latin_catholic @ 7 % | — |
| 119 | Kottarakkara | 0.7 pp | LDF | indian_orthodox @ 7 % | — |
| 129 | Chirayinkeezhu | 1.0 pp | UDF | latin_catholic @ 9 % | — |
| 95 | Vaikom | 1.1 pp | UDF | syro_malabar @ 11 % | — |
| 63 | Guruvayoor | 1.2 pp | LDF | syro_malabar @ 7 % | — |
| **114** | **Konni** | **1.4 pp** | **LDF** | **indian_orthodox @ 12 % + marthoma @ 7 % + syro_malabar @ 7 %** | INC-Hindu |
| 71 | Pudukkad | 1.9 pp | LDF | syro_malabar @ 32 % | INC-Hindu |
| 93 | Pala | 2.2 pp | UDF | syro_malabar @ 43 % | Special |
| 65 | Wadakkanchery | 3.5 pp | LDF | syro_malabar @ 20 % | — |
| 112 | Ranni | 3.5 pp | UDF | marthoma @ 14 % | INC-Hindu |
| 101 | Poonjar | 4.6 pp | UDF | syro_malabar @ 27 % | INC-Christian |
| 80 | Kochi | 6.1 pp | UDF | latin_catholic @ 35 % | Special |
| 99 | Changanassery | 6.9 pp | UDF | syro_malabar @ 28 % | Christian Alliance |

\* Strategy column is filled only for the 36 ACs in the Christian-belt strategy table.

**AC 114 Konni is the pilot's marquee finding.** Three distinct Christian sub-rites — Indian Orthodox (12 %), Marthoma (7 %), Syro-Malabar (7 %) — are individually decisive in the same 1.4-pp-margin AC. This is exactly the "multiple-relevant-communities-per-AC" pattern the question was looking for. None of the three individually has the share to dominate a candidate-selection strategy; together they make Konni's electoral dynamics genuinely multi-sub-rite at the margin.

---

## 4. The 15 blocking-only ACs

ACs with a Christian sub-rite ≥ 20 % but no decisive sub-rite (margin too wide in 2026 for community swing to flip). Listed in descending sub-rite share.

| AC | Name | Margin | Blocking sub-rite |
| ---: | --- | ---: | --- |
| 75 | Angamaly | 28.3 pp | syro_malabar @ 41 % |
| 72 | Chalakudy | 16.8 pp | syro_malabar @ 35 % |
| 79 | Vypen | 11.9 pp | latin_catholic @ 33 % |
| 78 | Paravur | 12.9 pp | syro_malabar @ 32 % |
| 90 | Thodupuzha | 30.3 pp | syro_malabar @ 31 % |
| 89 | Udumbanchola | 16.5 pp | syro_malabar @ 29 % |
| 91 | Idukki | 18.5 pp | syro_malabar @ 26 % |
| 70 | Irinjalakuda | 6.7 pp | syro_malabar @ 25 % |
| 67 | Thrissur | 21.6 pp | syro_malabar @ 24 % |
| 9 | Irikkur | 28.0 pp | latin_catholic @ 23 % |
| 94 | Kaduthuruthy | 25.1 pp | syro_malabar @ 22 % |
| 102 | Aroor | 5.8 pp | latin_catholic @ 22 % |
| 137 | Parassala | 9.7 pp | csi @ 21 % |
| 82 | Eranakulam | 33.6 pp | latin_catholic @ 21 % |
| 83 | Thrikkakara | 35.7 pp | syro_malabar @ 20 % |

Several of these are the canonical "Christian-belt safe-UDF" seats (Angamaly, Thrikkakara, Eranakulam) — large Christian community present but the AC was effectively won at the prior level (incumbency, candidate quality, or wave effects) and any community-level swing would be a rounding-error on the margin.

---

## 5. Cross-validation against parties' actual candidate strategy

The 36-AC `CHRISTIAN_BELT_36` strategy table records what the parties actually did — which kind of candidate (INC-Christian / INC-Hindu / Christian Alliance / Special) they fielded in each Christian-belt AC. The framework's tags should largely agree with these strategic choices.

### Agreement by strategy bucket

| Party strategy | Framework expectation | Agreement | Notes |
| --- | --- | ---: | --- |
| **INC-Christian** | top sub-rite decisive or blocking | **6 / 13 (46 %)** | Many of these ACs are safe seats where Christians are large but margin is wide. Framework calls them "latent". |
| **Christian Alliance** (KEC, KC-Jacob) | top sub-rite decisive or blocking | **4 / 8 (50 %)** | Same pattern — alliance partners hold safe Christian seats; framework reads them as "latent". |
| **INC-Hindu** | top sub-rite latent or blocking (NOT decisive) | **9 / 12 (75 %)** | Strong agreement. INC-Hindu was generally chosen in seats where Christian wasn't the swing community. |
| **Special** | * (any) | **3 / 3 (100 %)** | The special bucket is residual — framework neutral. |

### What the disagreements reveal

There are 14 disagreements, in two distinct flavours.

**Flavour A — Framework says "latent", strategy fielded Christian candidate (12 ACs).**

| AC | Name | Margin | Strategy | Why "latent" |
| ---: | --- | ---: | --- | --- |
| 98 | Puthuppally | 41.3 pp | INC-Christian | Sub-rites all <12 %; 41 pp margin makes any individual sub-rite unable to flip |
| 111 | Thiruvalla | 7.2 pp | Christian Alliance | Indian Orthodox 18 %, Marthoma 9 %, etc — none ≥ 20 % blocking, margin/share ratio just above 25 pp threshold |
| 85 | Piravom | 29.3 pp | Christian Alliance | Sub-rites at 7–14 %, margin too wide |
| 86 | Muvattupuzha | 28.9 pp | INC-Christian | Same pattern |
| 92 | Peerumade | 22.5 pp | INC-Christian | Same |
| 87 | Kothamangalam | 12.1 pp | Christian Alliance | Sub-rites 11 % + 13 % — neither passes 20 % blocking |
| 88 | Devikulam | 4.7 pp | INC-Christian | Syro-Malabar 12 %, Jacobite 10 % — close but `req_swing = 4.7/0.12 = 39 pp` ABOVE 25 threshold |
| 81 | Thripunithura | 12.0 pp | INC-Christian | Multiple sub-rites at 9–12 %, none crossing tag bar |
| 100 | Kanjirappally | 4.2 pp | INC-Christian | 4 sub-rites all 5–15 %, dispersed — none individually decisive |
| 106 | Kuttanad | 18.3 pp | Christian Alliance | Latin 12 %, Marthoma 8 % — small + safe-ish |
| 113 | Aranmula | 12.1 pp | INC-Christian | Marthoma 11 %, Orthodox 10 % — sub-cohort dispersed |
| 113 | (Devikulam etc duplicate covered above) |  |  |  |

**Interpretation**: parties fielded Christian candidates in places where the framework reads sub-rite presence as too dispersed or too safe-margin to be 2026-decisive. The candidate choices are **durable strategic decisions** — made before the result, on a model that anticipated tighter margins, OR on a model that treats *aggregate Christian* (sum across sub-rites) as the relevant community rather than any individual sub-rite.

For Kanjirappally (100), Thripunithura (81), and Devikulam (88) in particular, the dispersed sub-rite mix is itself informative: parties chose Christian candidates because **the aggregate Christian share is ~25–40 %** even though no individual sub-rite tops 15 %. The framework's per-sub-rite test misses this — aggregating across sub-rites within the community would catch it.

**Flavour B — Framework says "decisive", strategy fielded Hindu candidate (2 ACs).**

| AC | Name | Margin | Decisive sub-rite | Strategy |
| ---: | --- | ---: | --- | --- |
| **114** | **Konni** | 1.4 pp | indian_orthodox 12 %, marthoma 7 %, syro_malabar 7 % | INC-Hindu |
| **112** | **Ranni** | 3.5 pp | marthoma 14 % | INC-Hindu |
| 71 | Pudukkad | 1.9 pp | syro_malabar 32 % | INC-Hindu (not in agreement set, listed for completeness) |

**Interpretation**: in Konni and Ranni (both Pathanamthitta district), parties fielded Hindu candidates despite Christian sub-rites being individually capable of flipping the seat. Two possible explanations:

1. **The larger Hindu share (≥ 50 % in both ACs) outweighs the swing-capacity of the Christian sub-rite.** A Hindu candidate addresses the 50 % directly; a Christian sub-rite swing of 25 pp moves the 7–14 % community by ~2 pp of AC vote.
2. **Within-Christian sub-rite split.** Konni has three decisive sub-rites — if they vote differently from each other (Orthodox to UDF, Marthoma to NDA, Syro-Malabar to either), the net Christian impact may cancel. The framework's per-sub-rite test doesn't capture this within-community competition.

Pudukkad is a separate signal — Syro-Malabar at 32 % is large enough that "INC-Hindu" looks like a defensive call, possibly because UDF lacked a strong Syro-Malabar-acceptable Christian candidate in 2026.

---

## 6. What the pilot established about the framework

### What works ✅

- **The margin/share decisiveness metric captures the closest-fought ACs cleanly.** All 14 decisive ACs have margin ≤ 7 pp. That's the framework correctly surfacing the marginal seats.
- **The framework finds the "multi-community-per-AC" cases the original question asked for.** Konni (3 sub-rites simultaneously decisive) is the proof-of-concept. The 14 disagreements with strategy that are "framework: latent, parties: chose Christian" cluster in ACs where multiple small sub-rites add up — also a multi-community signal, just at the aggregated-Christian level.
- **The within-cohort sub-rite resolution is meaningful.** Indian Orthodox and Marthoma surface as decisive sub-rites in Pathanamthitta ACs (Konni, Ranni) — these are precisely the sub-rites our christian walkthrough documented as politically distinct. The framework recovers that from voter-share alone, without needing to encode the political ties.

### What doesn't work / what to fix 🛠

- **Per-sub-rite test misses aggregate-Christian decisiveness.** In ACs where Christians are 35 % in total but split across 3–4 sub-rites at 8–12 % each, no individual sub-rite passes the test. But parties clearly target the aggregate. **Fix:** add an `aggregate_christian` row per AC that sums voter-share across sub-rites and applies the same decisiveness test. This would catch Kanjirappally, Thripunithura, etc.
- **Decisiveness threshold (25 pp plausible swing) is a model knob, not data.** It changes the count materially: 12 pp threshold → 8 decisive ACs; 25 pp → 16; 40 pp → ~30. The right choice depends on observed sub-rite swing magnitudes per cohort, which we have multi-cycle data for but didn't feed in. **Fix:** calibrate the per-sub-rite plausible swing from multi-cycle Δ data in `christian-data.ts` cohort trajectories.
- **The framework doesn't see safe-but-relevant communities.** A 35 % Latin Catholic share in an AC UDF wins by 12 pp is "blocking" — present but framework-quiet. Yet that 35 % is exactly why UDF fields a Christian candidate there. **Fix:** for "blocking" ACs, surface them with a different semantic ("durable base") rather than implying they're not relevant.
- **POI proxy + religion-share noise compounds invisibly.** Voter-share at 5 % is at the edge — ±2 pp noise on each multiplicand swings tag assignment. We should add a confidence-interval to the voter-share output or a `low-confidence` flag for ACs near the threshold.
- **No within-Christian split modelled.** When Konni shows 3 decisive sub-rites, we can't say whether they vote together or against each other. Multi-cycle cohort trajectories in the christian walkthrough show different swing patterns per sub-rite, suggesting they *don't* vote together. Framework should expose this.

### What's structurally out of reach for now

- **Pinpointing within-AC community geography.** Vypen is 33 % Latin Catholic at AC level, but coastal Vypen is ~80 % Latin Catholic while interior is ~10 %. We can't see this without booth-level data, which isn't published.
- **Candidate-community confirmation at scale.** Within the 36-AC strategy table this is captured by hand; expanding to all 83 Christian-bearing ACs requires surname analysis we haven't built.

---

## 7. Generalisation to other communities — what to expect

Based on what the pilot showed, here's how the framework should perform on the other community types:

| Community | AC-level data? | Likely framework value |
| --- | --- | --- |
| Muslim sub-rite (Sunni / Mujahid / Jamaat-e-Islami / Shia) | ✅ via OSM POIs | **Low** — sub-rite distinction didn't show swing differentiation in 2026; framework would tag everything as Sunni-decisive in Muslim-heavy ACs but add no new insight beyond aggregate Muslim share. |
| Aggregate religion (Hindu / Muslim / Christian) | ✅ AC level | **Medium** — captures the obvious cases (75 % Hindu = blocking, 60 % Muslim = decisive in margin seats). Mostly confirms what we already know. |
| Hindu sub-community (Nair / Ezhava / SC / Brahmin) | ❌ district only | **Aspirational** — framework can run on inherited district shares, but the resulting AC tags will all share the district's sub-community mix. Doesn't surface within-district variation. **Needed:** survey microdata or AC-level Hindu sub-community estimates. |

**My recommendation for the next pass:** add `aggregate_christian` rollup + extend to `aggregate_muslim` and `aggregate_hindu`. That's a 4-line addition to the framework that produces the religion-level decisive table immediately useful. Sub-rite extension within Muslim is low ROI; Hindu sub-community is blocked on data.

---

## 8. Deliverables

This pilot produced:

- **Per-AC tag table** computed in-memory from `religiousPOIs` + `constituencies` + Christian sub-rite voter-share. Not yet a committed data file — currently exists as a transient computation. To make this a permanent artefact:
  - Option A: bake a `data/community-relevance.json` produced by a `scripts/pipeline/build-community-relevance.ts`, refreshed when data changes.
  - Option B: expose it as a runtime function in `src/lib/data/community-relevance.ts`, computed on app load. (Cheap — < 5 ms.)
- **Validation report** comparing 36-AC strategy table against framework tags. Documented in §5 above.
- **Method documented** for generalisation (this file).

### What to do next, when the user wants to proceed

1. Extend the framework with `aggregate_<religion>` rollup to catch dispersed-but-aggregate-decisive cases (Kanjirappally pattern).
2. Calibrate the `plausible_swing` parameter from multi-cycle cohort trajectories rather than hand-picking 25 pp.
3. Run on Muslim sub-rites + aggregate religion (≈ 30 min work).
4. Surface the output in the app — either as an enrichment of the existing cohort-section panels or as a new `/community-relevance` page.
5. (Aspirational) Find an AC-level Hindu sub-community proxy: candidate-surname analysis on multi-cycle data could give a coarse cohort split (Nair-leaning ACs vs Ezhava-leaning ACs).

Nothing here ships yet — this document records what the pilot demonstrated, so the next pass starts from solid ground.
