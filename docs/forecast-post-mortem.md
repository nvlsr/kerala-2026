# Forecast post-mortem — Kerala Assembly 2026

The [kerala-vote-forecast](https://github.com/nvlsr/kerala-vote-forecast) project published a pre-election forecast for the 2026 Kerala Assembly. The headline point estimates (all knobs at Medium default):

| Alliance | Forecast point | Forecast σ | Actual | Residual | In units of σ |
| --- | ---: | ---: | ---: | ---: | ---: |
| **UDF** | 38.88 % | 1.60 | **46.55 %** | **+7.67 pp** | **+4.8 σ** |
| **LDF** | 42.93 % | 1.53 | **37.64 %** | **−5.29 pp** | **−3.5 σ** |
| **NDA** | 15.77 % | 1.84 | **14.20 %** | **−1.57 pp** | **−0.9 σ** |

Forecast methodology + per-alliance trace files live at [`kerala-vote-forecast/docs/post-mortem/`](https://github.com/nvlsr/kerala-vote-forecast/tree/main/docs/post-mortem). This file is the analysis of that forecast against actual results. The forecast targeted statewide vote share, not seats — this post-mortem is therefore vote-share only.

## TL;DR

- **NDA: the model got it right.** Point estimate inside 1σ of actual.
- **UDF + LDF: catastrophic miss, both in the same direction.** The model expected a small UDF decline + LDF holding ground. Reality was a ~13 pp swing between them.
- **The model architecturally could not produce the actual outcome.** Even at every user-reachable knob extreme, LDF could not be predicted below ~41 % and UDF could not be predicted above ~42 %.
- **The forecast's own "post-mortem checklist" sections identified the failure modes correctly before they happened.** The model author saw the trapdoors; the model just couldn't move off them.

---

## 1. Common findings (apply to all three alliances)

These are structural / architectural observations independent of which alliance you look at.

### 1a. The conversion-factor framework was directionally right ✅

The principle — that LS and Local results need alliance-specific translation to Assembly-equivalents — was sound. LS over-states LDF and under-states UDF / NDA in Kerala; Local sits between LS and Assembly. The model's directional choices (subtract for UDF & NDA, add for LDF) matched the observed pattern. The failures were in *magnitude*, not direction.

### 1b. Backward-looking architecture ❌

60 % weight on the last Assembly is a strong prior. It assumes the most recent same-type election is the best estimate of the next same-type election. In a regime-shift cycle, this prior is wrong by construction.

The model's own §6.1 named this: *"A 7 pp swing since 2021 enters the blend only at 40 % through Local + LS signals."* That's exactly the swing that happened.

### 1c. Calibration on two history points ❌

Each conversion offset (LS→Assembly, Local→Assembly) was tuned against two historical pairs. For NDA and UDF, those pairs *disagreed on sign*. The model chose the more recent pair as the "Medium" value rather than averaging — locking in the 2019→2021 special case (a high-turnout anti-Centre Assembly during the pandemic) as the central case.

The 2019→2021 pair was itself produced by Kerala-specific dynamics (LDF's two-thirds-win re-election; rallying-around-the-flag). Treating it as the canonical LS-to-Assembly translation was over-fitting to a single observation.

### 1d. Each alliance forecast independently — no zero-sum constraint ❌

The forecast pipeline runs three times independently. The fact that NDA + UDF + LDF must sum to ≤ 100 doesn't enter. So a "UDF gains 7 pp from LDF" event is modelled as two improbable events multiplied (each ~1 % probability) rather than a single zero-sum swing event.

Treating UDF and LDF as a system:

| | Forecast | Actual | Swing vs forecast |
| --- | ---: | ---: | ---: |
| UDF − LDF gap | −4.05 pp (LDF ahead) | +8.91 pp (UDF ahead) | **+12.96 pp** |
| UDF + LDF total | 81.81 pp | 84.19 pp | +2.38 pp |

The joint "UDF ≥ 46 AND LDF ≤ 38" event had effectively zero probability mass under the independent-alliance assumption.

### 1e. Over-confident σ ❌

The Medium-knob σ values were calibrated for "noise around a correct point estimate", not for "uncertainty about which regime we're in":

| | NDA σ | UDF σ | LDF σ |
| --- | ---: | ---: | ---: |
| Model value | 1.5 | 1.2 | 1.1 |
| Model rationale | "newer coalition, higher variance" | "broad coalition, moderate stability" | "most disciplined voter base" |
| Actual \|residual\| | 1.6 pp | 7.7 pp | 5.3 pp |

LDF being assigned the *smallest* σ ("most disciplined base") is exactly the failure pattern: when the disciplined base is the one breaking, "discipline" becomes confidence in the wrong place. σ should have widened proportional to the divergence between calibration pairs, not narrowed because of historical stability.

### 1f. Turnout: structurally framed, magnitude unconfirmed

The forecast assumed 2026 turnout would be ~74.83 %. **This repository does not include the official 2026 turnout figure (the committed `data/results-2026.json` carries vote counts but not electorate counts).** Two scenarios:

1. **If actual turnout came in below 75 %** — the expected value was approximately right; turnout-elasticity magnitudes could be analysed but the term contributes little to the residuals.
2. **If actual turnout came in above 76 %** — the model's expected value was wrong AND the elasticity sign for LDF (+0.25, "high turnout helps LDF") may have been categorically wrong relative to 2026 dynamics.

In either case the bulk of the LDF and UDF residuals comes from the 60 % anchor on 2021, not from turnout. Turnout is at most a 0.5–1 pp lever; the alliance residuals are 5–8 pp.

### 1g. The forecast author identified the failure modes ✅

The methodology document's §6 ("Where this model can fail") and each alliance file's "Post-mortem checklist" section flagged — before results came in — exactly the structural issues that ended up driving the residuals:

- "Anchor weighting is 60 % the last Assembly. … If the regime has shifted since 2021, the model will systematically pull the forecast back."
- "Only two historical pairs calibrate each conversion offset. All 'Medium' values were largely anchored to the 2019→2021 pair, which was a high-turnout, anti-NDA Assembly election."
- "Turnout sign for LDF is positive by construction. … If 2026 turnout went up *and* the swing went against LDF, the turnout term moved in the wrong direction."
- "Each alliance is forecast independently. … A correct anti-incumbency story should show UDF *gaining what LDF lost* — but the model treats those as separate processes."

The watchpoints were correct. The model just couldn't act on them.

### 1h. Architectural ceiling on what was reachable

Even with every user-facing knob at the extreme:

| Adjustment | Knob change | Effect on point estimate | Closes the gap by |
| --- | --- | ---: | ---: |
| **UDF: every UDF-favourable knob** | LS-conv Medium→High (8→5), Local Medium→High (+1.6→+2.5), Trend Medium→High (0→+0.3) | 38.88 → ~40.5 | ~22 % of the 7.67 pp gap |
| **LDF: every LDF-unfavourable knob** | LS-conv Medium→Low (+10→+6), Local Medium→Low (+5→+4), Trend Medium→Low (0→−0.3) | 42.93 → ~40.5 | ~46 % of the 5.29 pp gap |

The model could not produce UDF > 41 % or LDF < 40 % at any user-reachable setting. The miss was *architectural*, not parameterisation.

---

## 2. UDF — what went right, what went wrong

**Forecast 38.88 % · Actual 46.55 % · Residual +7.67 pp (+4.8 σ).**

The model said UDF would slightly *decline* from 2021 (39.47 → 38.88). Reality: UDF surged to its highest Assembly vote share since 2011. P(UDF ≥ 44) per the model = **0.0 %**. P(UDF ≥ 46) = **0.0 %**.

### What was right ✅

- **The directional inputs were available.** 2024 LS (45.40 %) and 2025 Local (40.70 %) both pointed up from 2021. The model saw them; it just heavily discounted them.
- **The Local-implied component (42.30 pp) was the highest of the three signals** — the closest to reality. The +1.6 pp Local→Assembly addition was reasonable.

### What was wrong ❌

Mechanical decomposition of the +7.67 pp residual:

| Source | Magnitude (pp) | Why |
| --- | ---: | --- |
| 60 % anchor on 2021 Assembly (39.47) | ~+4.0 | 2024 LS at 45.4 was much closer to reality. If 2021 weight dropped from 0.60 to 0.30, the blend would have risen ~3–4 pp. |
| LS–Assembly subtraction over-aggressive | ~+0.5 | −8 pp was the 2019→2021 value. 2014→2016 said −3.2. Using the average (−5.6) would have added ~0.36 pp via 0.15 weight. |
| Trend sign error (−0.2 → reality positive) | ~+1.0 | UDF was trending up from LDF-base erosion. The model's "gradual erosion" prior had the sign wrong. |
| Turnout sign error (if 2026 turnout was high) | ~+0.3 | UDF elasticity −0.10 assumed UDF *loses* with high turnout. Wrong if high turnout was anti-LDF mobilisation. |
| Residual (anti-incumbency wave, not modellable) | ~+1.8 | The genuinely unmodelled piece. |

### Why

- **The 2024 LS signal was the closest to reality but got only 15 % weight + an aggressive translation.** 45.40 LS → 37.40 implied Assembly (after −8 pp). The 37.40 figure was actually *below* the 2021 Assembly anchor — so the LS signal pulled the blend *down*, when in reality LS was a leading indicator of UDF strength.
- **The "Low" knob for LS conversion (subtract 10) would have been even worse.** "High" (subtract 5) would have given 40.4 implied. The Medium of 8 was midway through a historically inconsistent calibration band.
- **The model has no representation for "vote transfer from LDF".** Whatever UDF gained had to come from somewhere — and that somewhere was LDF. The independent-alliance design couldn't link them.

---

## 3. LDF — what went right, what went wrong

**Forecast 42.93 % · Actual 37.64 % · Residual −5.29 pp (−3.5 σ).**

The model assumed LDF would defend its 2021 position (drop only 2.5 pp over the cycle). Reality: LDF lost ~7.8 pp, the worst LDF vote share since 2011. P(LDF ≤ 38) per the model = **0.06 %**.

### What was right ✅

- **The conversion-factor *direction* was correct.** LDF reliably outperforms in Assembly vs. LS / Local in Kerala. The +10 LS-add and +5 Local-add both have the right sign — LDF still came in *above* its 2024 LS share (33.6 → 37.6), so the principle of an Assembly bonus held. The magnitude was wrong, but the sign was right.
- **A small negative trend was correct in sign.** The −0.1 pp/yr drift for LDF moved the right direction, just way too gently.

### What was wrong ❌

Mechanical decomposition of the −5.29 pp residual:

| Source | Magnitude (pp) | Why |
| --- | ---: | --- |
| 60 % anchor on 2021 Assembly (45.43 — LDF's peak) | ~−3.0 | LDF's national signal had been collapsing (LS 35.3 → 33.6). The 60 % weight forced the forecast to look like a small dip from peak. |
| Trend (−0.1 pp/yr) under-stated incumbency drag | ~−2.0 | Two-term incumbency in Kerala had no precedent; calibration treated LDF as a single-term incumbent. The actual anti-incumbency swing was 5–7 pp. |
| LS–Assembly addition over-generous | ~−1.0 | +10 pp was the 2019→2021 value (anti-Centre pandemic recovery). 2014→2016 said +3.4. Using the average (+6.8) would have lowered the blend by ~0.5 pp. |
| Turnout sign error (positive elasticity) | ~−0.5 to −1.0 | LDF ε = +0.25. If high turnout was anti-LDF, this term was wrong by 0.5–1 pp. |
| Residual | ~+0.2 | Most of the LDF miss IS architecturally explainable. |

### Why

- **The 2019→2021 LS→Assembly pair was a one-off.** LDF's +10.1 pp Assembly bonus in 2021 came from anti-Centre rallying during the pandemic, plus the Sabarimala saturation effect dissipating. Using it as the canonical LS-to-Assembly translation for 2026 over-stated LDF's Assembly bonus by ~3 pp.
- **There was no incumbency-tenure variable.** Two-term Kerala incumbency had no precedent — but only because no party had done it before LDF in 2021. The drift parameter was set as if LDF were a single-term incumbent like any other. The genuine anti-incumbency swing (~7 pp) had no place in the model.
- **The turnout sign was a correlation-not-mechanism error.** Historically, LDF won under high-turnout years. The model encoded "high turnout → LDF gains". But the mechanism was "LDF gets its base out when the wind is favourable". When the wind switched, high turnout became *anti-LDF* turnout.
- **σ = 1.1 was the smallest of the three alliances** because LDF "has the most disciplined voter base". This was textbook overconfidence: when the disciplined base is the one breaking, predictability collapses.

---

## 4. NDA — what went right, what went wrong

**Forecast 15.77 % · Actual 14.20 % · Residual −1.57 pp (−0.85 σ).**

The actual NDA result sits inside the model's 1σ band [13.93, 17.61]. P(NDA ≤ 14) was 17 % — non-trivial; the outcome wasn't a tail event.

### What was right ✅

- **NDA point estimate was a genuine hit.** The model captured a steadily-expanding NDA story without over-projecting it as a breakout.
- **The +0.6 pp/yr trend (×5 = +3.0 pp) worked.** NDA's long-run trajectory in national signals (10.8 → 15.6 → 19.4 LS) was real, and the smoothed projection landed in the right neighbourhood.
- **The −4 pp LS subtraction was a reasonable compromise.** Two historical pairs disagreed on sign (+4.2 vs −3.2). The Medium value of −4 sat in the middle and translated 19.4 LS → 15.4 — within 1.2 pp of the 14.2 actual.
- **The "small but not breakout" framing was correct.** Even the upper-tier threshold (17 %, P ≈ 26 %) didn't fire.

### What was wrong ❌

- **Slight over-estimate (−0.85 σ).** Two possibilities, neither catastrophic:
  - The +3.0 pp trend may have over-projected: NDA's 2024 LS (19.4 %) was a national-electoral peak that didn't translate fully to Assembly. The trend term smoothed across LS years that may have over-influenced it.
  - The −3 pp Local→Assembly subtraction was the larger of the two haircuts; the 2015→2016 pair argued for less.
- **No seat-level forecast.** The model targeted vote share only — the 3-seat outcome (Nemom 135, Kazhakoottam 132, Chathannoor 126) was consistent with the model's expectation but not explicitly forecast.

### Why

- **NDA was the alliance the model was best-suited to.** A clear monotonic LS trajectory, no incumbency complication, a small enough share that the smoothing-on-history approach didn't trip on regime change.
- **The structural issues that wrecked UDF and LDF didn't bind NDA**: the 60 % 2021-Assembly anchor was at 12.4 % — close to the eventual 14.2 % — so backward-looking didn't hurt. The independent-alliance design didn't matter because NDA wasn't a substitute for either UDF or LDF in the 2026 swing.

---

## 5. Improvements for the next election forecast (combined list)

Listed in priority order. **Not for application now** — pointers for the next cycle.

### 5a. Move from independent alliances to a joint / constrained system

The single highest-impact change. Either:

- **Compositional forecast**: forecast `(s_NDA, s_UDF, s_LDF, s_OTHER, s_NOTA)` as a Dirichlet or logistic-normal distribution constrained to sum to 1. Swings are naturally zero-sum.
- **Forecast the SWING from last Assembly**, distributed across alliances with a covariance matrix. Negatively correlated UDF / LDF residuals fall out automatically.
- **Pair-based forecast**: forecast `(UDF + LDF, UDF − LDF, NDA)` — the third coordinate "swing between the two main fronts" is the policy-relevant axis. The 2026 result is captured by a +13 pp move on that axis.

Any of these would have made "UDF +7 / LDF −7" a single coherent event, not two near-impossible events.

### 5b. Down-weight the previous Assembly when regime signals diverge

A simple version:

```
if abs(LS_signal − last_Assembly_signal) > threshold:
    increase weight on Local + LS, decrease weight on Assembly
```

The 2024 LS–2021 Assembly divergence was: LDF 33.6 vs 45.4 (−11.8 pp), UDF 45.4 vs 39.5 (+5.9 pp), NDA 19.4 vs 12.4 (+7.0 pp). A regime-aware blend would have rebalanced toward LS.

Alternatively: **continuous decay** rather than fixed 60 % weight. Last Assembly weight = `e^(-years/τ)` with τ ~ 4 years. By year 5, the Assembly anchor has decayed to ~30 % rather than 60 %.

### 5c. Add an incumbency-tenure term

Variables that *should* be in any future Kerala model:

- `is_incumbent_alliance` (one-hot)
- `terms_in_power` (continuous; 1, 2, 3+)
- `national_government_aligned` (alignment with central government)
- `years_since_last_change` (incumbency-fatigue proxy)

A two-term incumbent should have a structural −3 to −5 pp shift built in, not a smooth −0.1 pp/yr drift.

### 5d. Re-derive turnout elasticity from mechanism, not correlation

"LDF wins in high-turnout years" is a sample-selection artefact. A causal turnout model needs to ask:

- Whose marginal voter shows up when turnout rises? LDF-aligned, UDF-aligned, or anti-incumbent?
- Is current-cycle mobilisation expanding the LDF base or pulling anti-LDF voters?
- Survey data (CSDS / CVoter) discriminating turnout-driven swing from switching-driven swing.

A safer default for the next stable model: **set turnout elasticity to zero unless there's a strong mechanism to assert otherwise.**

### 5e. Use all historical pairs with explicit uncertainty

Instead of "pick the recent pair as Medium and let the user choose Low/High":

- Compute the conversion-offset distribution over ALL available LS→Assembly pairs (Kerala has 8–10).
- Use a Bayesian prior with the historical distribution.
- Let the σ of the conversion-offset distribution feed into the model's σ — *uncertainty about the offset itself* widens the forecast distribution, not just within-cycle noise.

### 5f. Wider tails; allow asymmetry

`σ = 1.1` for LDF was over-confident because it represented "noise around a known regime". When there's substantive uncertainty about *which* regime, σ should be 2–3 pp at the prior level. Observed residuals (5–7 pp) suggest the right base σ is 3–4 pp.

For incumbents in their second term, an **asymmetric mixture** (`wLow = 0.40, wHigh = 0.15`) would acknowledge that anti-incumbency surprise is more likely than pro-incumbency surprise.

### 5g. Out-of-sample validation before publishing

Before publishing the 2031 forecast, **withhold the most recent Assembly and predict it from older data**. Use 2011–2019 LS + Local + the 2011 Assembly to predict 2016. Then use 2014 LS + 2015 Local + 2016 Assembly to predict 2021. Compare to truth.

If the model can't predict 2021 from earlier data within its own quoted σ, the quoted σ for 2026 was over-confident.

### 5h. Forecast at AC level, then aggregate

Even crudely, with district-level priors and uniform-swing fallbacks. Would surface:

- Where the seat-count cliffs are (UDF gets 102 seats at 46 % share but ~75 at 43 %).
- Which sub-regions are most volatile (e.g. the Christian-belt swing in 2026).
- AC-level vote-flow consistency checks.

A bigger build but produces a fundamentally more useful forecast than "statewide percent". *(Note: the forecast did not aim for seats — but an AC-level approach also produces a better statewide aggregate, since it embeds geographic structure.)*

### 5i. Add fundamentals — economic / sentiment / candidate-level inputs

The forecast had zero non-historical-election inputs. For 2031:

- **Sentiment / surveys**: even one or two CSDS-style polls 3–6 months out narrow uncertainty hugely.
- **Economic indicators**: Kerala remittance inflows, unemployment, fiscal stress proxies.
- **Candidate-quality flags**: incumbent retiring? cross-over? prominent newcomer? AC-level binary flags help.
- **National-government alignment**: in 2026, BJP at the centre meant Kerala's UDF was opposition to both LDF (state) AND BJP (centre). In 2031, alignment may flip.

### 5j. Document calibration provenance and re-run on each data update

Every parameter in `adjustment-parameters.json` and `conversion-factors.json` should carry a comment with (a) which historical pairs informed it and (b) when it was last reviewed. When 2026 results came in, those parameters should have been mechanically re-calibrated and a new "Medium" published.

---

## 6. Summary scorecard

| Dimension | Verdict |
| --- | --- |
| NDA point estimate | ✅ Hit. Within 1 σ. |
| UDF point estimate | ❌ Catastrophic miss. 4.8 σ off. |
| LDF point estimate | ❌ Catastrophic miss. 3.5 σ off. |
| Joint UDF / LDF swing direction | ❌ Wrong direction by 13 pp. |
| Calibration of uncertainty (σ) | ❌ Too narrow for two-term-incumbent cycle. |
| Conversion-factor framework | ✅ Directionally right. Magnitudes over-fit to recent pair. |
| Trend term | ⚠️ Worked for NDA. Wrong sign / magnitude for UDF and LDF given the regime shift. |
| Turnout term | ⚠️ Sign uncertain pending actual turnout; mechanism almost certainly wrong for LDF in any case. |
| Independent-alliance design | ❌ Couldn't represent the central event (vote transfer between LDF and UDF). |
| Self-awareness of failure modes | ✅ Forecast docs identified every binding constraint that ended up biting. |

**The most useful thing in the kerala-vote-forecast project, in hindsight, is its `methodology.md` §6 — the "where this can fail" list. It got the post-mortem right before the post-mortem existed.** The model architecture didn't have enough degrees of freedom to act on its own diagnoses; that's the lesson for next cycle.
