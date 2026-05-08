# A2 — Did the Sabarimala gold scandal hammer LDF in Devaswom-route seats?

**Verdict: The "Sabarimala-route Hindu backlash" framing is wrong as stated. LDF lost LESS share in the three geographic Sabarimala-route ACs than in matched Hindu-majority controls — the opposite of what the narrative predicted. NDA actually lost share in those ACs too. What is real: the three Devaswom-related ministers lost their *own seats* by ~11pp on average, vs ~7pp uniform LDF loss elsewhere. That's a minister-targeted incumbency penalty, not a route-targeted Hindu-issue swing.** The press collapsed two distinct phenomena into one — and only one of them carries data signal.

This card uses AC-level religion data (2025 projection of Census 2011) and 2021/2026 alliance share deltas. See `scripts/narrative-a2-sabarimala.ts` to reproduce.

## The consensus claim

The Sabarimala gold-cladding scandal (April 2026 — A. Padmakumar, former Travancore Devaswom Board president, arrested; SIT investigation) compounded with residual anger from the 2018 women-entry decision. Press reports across The Print, The Quint, Onmanorama, Organiser, and Open Magazine attributed LDF's Devaswom-route losses — Devaswom Minister V.N. Vasavan (lost Ettumanoor), former Devaswom Minister Kadakampally Surendran (lost Kazhakoottam by 428 votes), Health Minister Veena George (lost Aranmula) — to a Hindu-issue backlash specifically concentrated along the Sabarimala pilgrim corridor.

If correct, we should see (a) larger LDF share losses in the Sabarimala-route ACs vs the statewide ~7pp baseline, and (b) corresponding NDA gains in those ACs as the Hindu-shift's likely beneficiary.

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

**Now we see a real signal.** The three ministers lost ~4pp more than the matched-Hindu control. This IS a minister-targeted incumbency penalty.

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

> **There were two stories, not one. The press fused them and called the result "Sabarimala backlash."**
>
> 1. **Geographic Sabarimala-route ACs voted MORE pro-LDF than matched Hindu-majority controls** (LDF -3.6pp vs -7.3pp). NDA *lost* share in these ACs (-2.3pp vs +1.9pp). The "pilgrim corridor punished LDF" framing is unsupported.
>
> 2. **Devaswom ministers lost their own seats by ~4pp more than non-minister LDF incumbents** (LDF -11.5pp vs -7.2pp matched). This is a minister-incumbency penalty, not a Hindu-issue shift. The penalty flowed primarily to UDF, not to NDA — except in Kazhakoottam, which BJP won by 428 votes (effectively a coin flip).

The "Sabarimala-backlash" framing implicitly predicts a *route-targeted* swing benefiting BJP. Neither half of that prediction holds. What we observed: anti-LDF swing was *uniform across Hindu-share*, with an extra penalty applied to *individual cabinet members* regardless of constituency religion mix — and the beneficiary was UDF, not NDA.

## Why this matters analytically

The "Sabarimala-route" story was attractive because the three lost-minister seats are nominally in or near the pilgrim corridor. But proximity to a temple doesn't equal political effect. The data forces a sharper question: **was Kerala 2026 a Hindu-issue election, or a generic anti-incumbency election with high-profile casualties?**

The minister effect (-4pp differential) is exactly the size we'd expect from generic incumbency penalty applied to high-visibility targets. The pilgrim-corridor non-effect (zero or wrong-sign differential) is the test that distinguishes "Hindu-issue election" from "incumbency election with Hindu-issue framing." The data answers the latter.

This is consistent with A1's finding that LDF's collapse was religion-blind across all bins. A2 just adds the second layer: incumbency penalties were minister-targeted, but not religion-targeted.

## Methodology & limitations

- **Treatment AC selection**: pulled from the narrative text directly. Three nested groups (geographic / named-set / minister) test increasingly broad interpretations.
- **Control groups**: statewide (n=137) and Hindu-majority (Hindu ≥ 50%, n=88). The matched-Hindu control is the right comparison for the narrative's claim, since the narrative is about Hindu-share-mediated effects.
- **Religion baseline**: 2025 cohort projection. Switching to raw 2011 census moves bin assignments by ≤1 AC and doesn't change the verdict (per the Pearson invariance noted in A1).
- **What we can't tell**:
  - Within each AC, did individual Hindu voters actually shift on Sabarimala specifically? Survey microdata could answer; AC totals can't.
  - Was the missing "Hindu shift" *latent* — held back by something else (UDF's local strength, candidate dynamics)? Possible but unfalsifiable from this data.
  - Could the geographic test be too narrow? We tested 3, 5, and 5 (district) ACs. None showed the predicted signal. Adding more ACs that aren't actually pilgrim-route would dilute the test, not strengthen it.
- **Sample sizes**: 3 and 5 ACs are small. The 4pp differentials we see are point estimates, not statistically tested with formal CIs. But the *direction* of the differential — wrong sign in Tests 1, 2, 4 — is robust to noise.

## Cross-references

- **A1 (minority consolidation)**: established that LDF's collapse was religion-blind. A2 extends this: it's also Sabarimala-geography-blind, but minister-incumbency-sensitive.
- **A3 (BJP's 3 wins)**: Kazhakoottam is one of BJP's 3 wins. The 428-vote margin and the lack of a corresponding pattern in nearby ACs argue against treating it as evidence for a broader Hindu-issue shift — it's better explained as a 3-way Trivandrum-area dynamic.

## Reproduce

`bun run scripts/narrative-a2-sabarimala.ts`
