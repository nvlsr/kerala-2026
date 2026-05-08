# A2 — Did the Sabarimala gold scandal hammer LDF in Devaswom-route seats?

**Verdict: A route-targeted LDF penalty is not detectable at the constituency level. The three geographic Sabarimala-route ACs (Aranmula, Konni, Ranni) showed a smaller LDF Δshare loss than matched Hindu-majority controls (-3.6pp vs -7.3pp; differential +3.7pp), and NDA share fell in those ACs (-2.3pp vs +1.9pp). Both directions are inconsistent with the press framing's predictions. What is detectable: the three Devaswom-related ministers' seats showed ~4pp larger LDF loss than matched controls (-11.5pp vs -7.2pp). That's consistent with a minister-incumbency penalty applied to high-visibility cabinet members, not with a Hindu-issue effect on geographic pilgrim-corridor ACs.** The press framing collapses two distinct phenomena (geographic route effect / cabinet-member effect); the constituency-level data carries signal only for the second.

**Confidence: Strong (with small-sample caveat)** — direction of the route-effect differential is robust (wrong sign in 3 of 4 nested treatment groups), but n=3-5 in each treatment group precludes formal significance testing. The minister-effect finding is sample-bounded to the 3 Devaswom-related ministers; A6 shows it doesn't generalise to the full cabinet.

> **A note on inference:** This card analyses constituency-level patterns. The 6 ACs in the treatment groups are small samples; differentials are reported but formal hypothesis tests cannot be applied at meaningful power with n=3-5. The directional evidence (LDF lost LESS in the geographic group, NDA also lost share) is what the data shows, but readers should weight 3-AC means accordingly. See `methodology-core-concepts.md` § "Treatment-control design".

This card uses AC-level religion data (2025 projection of Census 2011) and 2021/2026 alliance share deltas. See `scripts/narrative-a2-sabarimala.ts` to reproduce.

**Unit:** Constituency-equal means throughout. The unit of analysis is the constituency, not the individual voter.

## The consensus claim

The Sabarimala gold-cladding scandal (April 2026 — A. Padmakumar, former Travancore Devaswom Board president, arrested; SIT investigation) compounded with residual anger from the 2018 women-entry decision. Press reports across The Print, The Quint, Onmanorama, Organiser, and Open Magazine attributed LDF's Devaswom-route losses — Devaswom Minister V.N. Vasavan (lost Ettumanoor), former Devaswom Minister Kadakampally Surendran (lost Kazhakoottam by 428 votes), Health Minister Veena George (lost Aranmula) — to a Hindu-issue backlash specifically concentrated along the Sabarimala pilgrim corridor.

If correct, the data should show (a) larger LDF share losses in the Sabarimala-route ACs vs the statewide ~7pp baseline, and (b) corresponding NDA gains in those ACs as the Hindu-shift's likely beneficiary.

## What the data shows

Three nested treatment groups, comparing each against the statewide average AND against Hindu-majority (Hindu ≥ 50%) controls:

### TEST 1 — Geographic Sabarimala route (n=3)

The three ACs closest to the shrine and its primary pilgrim corridor: **Aranmula**, **Konni**, **Ranni** (all in Pathanamthitta district).

| AC | Hindu % | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| 112 RANNI | 48.3% | +4.1pp | **-0.4pp** | -0.7pp |
| 113 ARANMULA | 55.2% | +10.1pp | -13.7pp | +4.3pp |
| 114 KONNI | 61.3% | +7.6pp | **+3.2pp** | -10.6pp |
| **Mean** | | **+7.3pp** | **-3.6pp** | **-2.3pp** |
| Hindu ≥ 50% control (n=88) | | +6.3pp | -7.3pp | +1.9pp |
| **Differential** | | +0.9pp | **+3.7pp** (LDF lost LESS) | **-4.3pp** (NDA gained LESS) |

LDF *underperformed* its statewide baseline — by losing ~4pp less than expected. Konni went the wrong direction entirely (LDF +3.2pp, NDA -10.6pp). Ranni held flat. Only Aranmula matched the narrative's prediction, and Aranmula's loss is better explained by Test 3 below (Veena George was a sitting minister).

**NDA's response is the giveaway**: NDA *lost* share in geographic Sabarimala-route ACs (-2.3pp vs +1.9pp in matched controls). If Hindu voters were angry at LDF over Sabarimala, NDA should have been the natural beneficiary. Instead NDA dropped, particularly in Konni (-10.6pp). The "Hindu-issue backlash benefited the BJP" hypothesis has the wrong sign.

### TEST 2 — Devaswom route as named in the narrative (n=5)

The narrative explicitly named six ACs: Aranmula, Konni, Ranni, "Pathanamthitta", Ettumanoor, Kottayam. (Pathanamthitta isn't an AC; it's the district name.) The five existing ACs:

| AC | Hindu % | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| 96 ETTUMANOOR | 49.5% | +17.5pp | -10.0pp | -0.3pp |
| 97 KOTTAYAM | 50.2% | +7.2pp | -9.2pp | +1.5pp |
| 112 RANNI | 48.3% | +4.1pp | -0.4pp | -0.7pp |
| 113 ARANMULA | 55.2% | +10.1pp | -13.7pp | +4.3pp |
| 114 KONNI | 61.3% | +7.6pp | +3.2pp | -10.6pp |
| **Mean** | | **+9.3pp** | **-6.0pp** | **-1.2pp** |
| Hindu ≥ 50% control (n=87) | | +6.3pp | -7.3pp | +1.9pp |
| **Differential** | | +3.0pp | +1.3pp (LDF lost LESS) | -3.1pp |

Even with the wider "Devaswom-route" set, LDF lost slightly *less* than the matched-Hindu baseline. The signal isn't there.

### TEST 3 — Devaswom ministers' own seats (n=3)

Now isolate the ministers — the 3 LDF cabinet members the narrative connects to Devaswom + Sabarimala themes:

| AC | Minister | Portfolio | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|---|
| 96 ETTUMANOOR | V.N. Vasavan | Devaswom (incumbent) | +17.5pp | -10.0pp | -0.3pp |
| 113 ARANMULA | Veena George | Health (Sabarimala-route geography) | +10.1pp | -13.7pp | +4.3pp |
| 132 KAZHAKOOTTAM | Kadakampally Surendran | former Devaswom (cabinet member) | +4.6pp | -10.7pp | +6.6pp |
| **Mean** | | | **+10.7pp** | **-11.5pp** | **+3.5pp** |
| Hindu ≥ 50% control (n=88) | | | +6.4pp | -7.2pp | +1.7pp |
| **Differential** | | | +4.4pp | **-4.3pp** (LDF lost MORE) | +1.8pp |

**A clear differential emerges.** The three ministers lost ~4pp more share than the matched-Hindu control — consistent with a minister-incumbency penalty applied to high-visibility cabinet members. (See A6 for the broader cabinet-level test, which finds this is *not* generalisable across the full 21-member cabinet.)

But the mechanism is muddier than the narrative implies:
- **Ettumanoor (Vasavan)**: UDF took the entire LDF loss; NDA stayed flat. This looks like a clean minister-incumbency penalty that flowed straight to UDF — not a Hindu shift to BJP.
- **Aranmula (Veena George)**: similar pattern. UDF took most. NDA gained only +4.3pp.
- **Kazhakoottam (Kadakampally)**: this is the ONE seat where the narrative's "Hindu backlash → BJP" story partially holds. NDA +6.6pp, V. Muraleedharan flipped the seat to BJP. But it was won by **428 votes** — a single ward of differential turnout could explain it. One thin data point isn't a movement.

### TEST 4 — Pathanamthitta district as a whole (n=5)

Adding Thiruvalla and Adoor (both in Pathanamthitta district but not on the immediate pilgrim route):

| AC | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|
| 111 THIRUVALLA | +1.6pp | -14.6pp | **+14.5pp** |
| 112 RANNI | +4.1pp | -0.4pp | -0.7pp |
| 113 ARANMULA | +10.1pp | -13.7pp | +4.3pp |
| 114 KONNI | +7.6pp | +3.2pp | -10.6pp |
| 115 ADOOR | +3.5pp | -5.3pp | +2.3pp |
| **Mean** | **+5.4pp** | **-6.2pp** | **+2.0pp** |
| Hindu ≥ 50% control | +6.3pp | -7.3pp | +1.9pp |
| **Differential** | -1.0pp | +1.2pp | +0.0pp |

District-wide, the differential collapses — Pathanamthitta district performed almost identically to the matched-Hindu baseline. (Thiruvalla's NDA +14.5pp is an outlier covered in A1 — JD(S) candidate as winner, three-way fragmentation; not a Sabarimala story.)

## The opinionated reframe

> **The "Sabarimala backlash" framing collapses two distinct phenomena into one.** The press treats them as a single story; the data shows them as separate:
>
> 1. **Geographic Sabarimala-route ACs (Aranmula, Konni, Ranni) had a SMALLER LDF Δshare loss than matched Hindu-majority controls** (LDF -3.6pp vs -7.3pp; differential +3.7pp). NDA share fell in these ACs (-2.3pp vs +1.9pp control). The "pilgrim-corridor punished LDF / Hindu shift to BJP" prediction has the wrong sign on both limbs.
>
> 2. **Three Devaswom-related ministers lost their own seats by ~4pp more than matched controls** (LDF -11.5pp vs -7.2pp). The penalty flowed primarily to UDF, not to NDA — Kazhakoottam (the one BJP win in this group) was decided by 428 votes, statistically indistinguishable from noise.

The "Sabarimala-backlash" framing implicitly predicts a *route-targeted* swing benefiting BJP. That effect is not detectable in this data. The observed pattern is consistent with anti-LDF swing being roughly uniform across Hindu-share gradient, plus an additional incumbency penalty on individual high-visibility cabinet members.

## Why this matters analytically

The "Sabarimala-route" story was attractive because the three lost-minister seats are nominally in or near the pilgrim corridor. But proximity to a temple is not, on this data, predictive of political effect at the constituency level. The sharper question this data answers: **is Kerala 2026 better described as a Hindu-issue election, or as a generic anti-incumbency election with high-profile cabinet casualties?**

The minister-level differential (-4pp) is consistent with generic incumbency penalty applied to high-visibility targets. The pilgrim-corridor non-effect (zero or wrong-sign differential) is the test that distinguishes the two readings. On this data, the latter reading fits better.

This is consistent with A1's finding that LDF's collapse was religion-blind across all bins. A2 adds: it was also Sabarimala-geography-blind. (A6 adds a third: it was minister-incidence-blind too — the cabinet-level mean shows no penalty above the LDF-incumbent baseline. The 3 Devaswom ministers studied here are outliers within the cabinet, not representatives of it.)

## Methodology & limitations

- **Treatment AC selection**: pulled from the narrative text directly. Three nested groups (geographic / named-set / minister) test increasingly broad interpretations.
- **Control groups**: statewide (n=137) and Hindu-majority (Hindu ≥ 50%, n=88). The matched-Hindu control is the right comparison for the narrative's claim, since the narrative is about Hindu-share-mediated effects.
- **Religion baseline**: 2025 cohort projection. Switching to raw 2011 census moves bin assignments by ≤1 AC and doesn't change the verdict (per the Pearson invariance noted in A1).
- **What this data cannot determine**:
  - Within each AC, did individual Hindu voters actually shift on Sabarimala specifically? Survey microdata could answer; AC totals can't.
  - Was the missing "Hindu shift" *latent* — held back by something else (UDF's local strength, candidate dynamics)? Possible but unfalsifiable from this data.
  - Could the geographic test be too narrow? Tested 3, 5, and 5 (district) ACs. None showed the predicted signal. Adding more ACs that aren't actually pilgrim-route would dilute the test, not strengthen it.
- **Sample sizes**: 3 and 5 ACs are small. The 4pp differentials reported are point estimates, not statistically tested with formal CIs. But the *direction* of the differential — wrong sign in Tests 1, 2, 4 — is robust to noise.

## What this directly shows / what it cannot prove / what would weaken the conclusion

### What this directly shows

- The 3 geographic Sabarimala-route ACs (Aranmula, Konni, Ranni) have mean LDF Δshare of -3.6pp, vs -7.3pp in matched Hindu-majority controls. Differential is positive (less LDF loss in route ACs) — wrong direction for the press framing.
- NDA share fell in those 3 ACs (-2.3pp vs +1.9pp in matched controls).
- The 3 Devaswom-related ministers' seats showed mean LDF Δshare of -11.5pp, vs -7.2pp in matched controls. Differential is -4.3pp (minister-targeted penalty consistent with cabinet-level incumbency effect).
- Pathanamthitta district as a whole tracked the matched-Hindu baseline closely (LDF -6.2pp vs -7.3pp).

### What this does NOT prove

- **Hindu voters did not shift on Sabarimala.** Individual Hindu voters' choices are not directly observable in this data. Constituency-level absence of differential is consistent with several mechanisms — including counterbalancing voter movements that net to zero at the AC level.
- **The minister effect is generally about ministers.** The 3 ministers studied here are a hand-picked Devaswom-related subset. A6 finds the broader 21-member cabinet shows no penalty above non-minister LDF incumbents — these 3 are outliers within the cabinet. The "minister-incumbency penalty" framing is supported only for these 3, not generally.
- **Sample size is small.** Three-AC means are point estimates, not formally tested. The direction of the differential (positive in Tests 1/2/4) is robust to small-sample variation, but the magnitudes are not estimated with formal precision.

### What would weaken this conclusion

- **A more inclusive definition of "Sabarimala route" that includes additional ACs and shows a coherent LDF differential.** Tested 3-AC and 5-AC subsets; both showed wrong-sign or zero differentials. A clearly justified larger group (e.g., all ACs within ~50km of Sabarimala) showing a route-targeted penalty would force a reconsideration.
- **Survey microdata showing Hindu voters in pilgrim-route ACs cited Sabarimala as a primary motivator while Hindu voters elsewhere did not.** Would suggest a *latent* Sabarimala effect that was masked at the constituency level.
- **Multi-cycle test in 2031.** If pilgrim-route ACs show systematically different LDF performance from matched-Hindu controls in future cycles when Sabarimala is no longer salient, the 2026 non-effect documented here may need reinterpreting.

## Cross-references

- **A1 (minority consolidation)**: established that LDF's collapse was religion-blind. A2 extends: also Sabarimala-geography-blind. The 3 ministers studied here showed a minister-targeted penalty; A6 shows this doesn't generalize across the full cabinet.
- **A3 (BJP's 3 wins)**: Kazhakoottam is one of BJP's 3 wins. The 428-vote margin and the lack of a corresponding pattern in nearby ACs argue against treating it as evidence for a broader Hindu-issue shift — it's better explained as a 3-way Trivandrum-area dynamic.
- **A6 (cabinet collapse)**: A2's "minister penalty" finding for 3 specific ministers is consistent with generic incumbency penalty applied to high-visibility cabinet members. A6's broader cabinet-level test (n=21 ministers vs n=78 non-minister LDF incumbents) finds no systematic penalty — meaning the 3 Devaswom-related ministers studied here are outliers within the cabinet, not representatives.

## Reproduce

`bun run scripts/narrative-a2-sabarimala.ts`
