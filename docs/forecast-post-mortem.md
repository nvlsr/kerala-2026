# Forecast post-mortem — Kerala Assembly 2026

The [kerala-vote-forecast](https://github.com/nvlsr/kerala-vote-forecast) project published a pre-election forecast for the 2026 Kerala Assembly. The headline point estimates (all knobs at Medium default):

| Alliance | Forecast point | Forecast σ | Actual | Residual | In units of σ |
| --- | ---: | ---: | ---: | ---: | ---: |
| **UDF** | 38.88 % | 1.60 | **46.55 %** | **+7.67 pp** | **+4.8 σ** |
| **LDF** | 42.93 % | 1.53 | **37.64 %** | **−5.29 pp** | **−3.5 σ** |
| **NDA** | 15.77 % | 1.84 | **14.20 %** | **−1.57 pp** | **−0.9 σ** |

Forecast methodology + per-alliance trace files live at [`kerala-vote-forecast/docs/post-mortem/`](https://github.com/nvlsr/kerala-vote-forecast/tree/main/docs/post-mortem). This file is the analysis of that forecast against actual results.

## TL;DR

- **NDA: the model got it right.** Point estimate inside 1σ of actual. Direction, magnitude, "small but expanding" framing all correct. The 3-seat conversion outcome was within the model's reasonable expectation.
- **UDF + LDF: catastrophic miss, both in the same direction.** The model expected a small UDF decline + LDF holding ground. Reality was a UDF sweep + LDF collapse, with a ~13 pp swing between the two alliances that the model assigned essentially zero joint probability to.
- **The model architecturally could not produce the actual outcome.** Even at every user-reachable knob extreme, LDF could not be predicted below ~41 % and UDF could not be predicted above ~42 %.
- **The forecast's own "post-mortem checklist" sections identified the failure modes correctly before they happened.** Anchoring to 2021 Assembly (60 % weight), turnout-sign for LDF (positive elasticity), and incumbency drag (only −0.1 pp/yr) were all flagged as vulnerabilities. The model author saw the trapdoors; the model just couldn't move off them.

---

## 1. What the forecast got right

### 1a. NDA point estimate and direction

| Forecast | Actual | Residual |
| --- | --- | --- |
| 15.77 % | 14.20 % | −1.57 pp (−0.85 σ) |

The actual NDA result sits inside the model's 1σ band [13.93, 17.61]. P(NDA ≤ 14) was 17 % — non-trivial; the outcome wasn't a tail event for NDA.

Why this part of the model worked:

- **NDA was on a clear upward LS trajectory** (10.8 → 15.6 → 19.4) and the model captured that with `annualTrendDrift = +0.6 pp/yr × 5 = +3.0 pp`. Without that trend term, the blend alone would have placed NDA at ~13 pp.
- **The LS→Assembly subtraction of −4 pp** translated 19.4 LS down to 15.4 — close to the actual 14.2. Even though the two historical pairs (+4.2 and −3.2) disagreed on sign, the model's compromise value of −4 worked out for 2026.
- **The 3 wins** (Nemom 135, Kazhakoottam 132, Chathannoor 126) are consistent with the model's expectation of "targeted consolidation, not statewide expansion" — though seat-level forecasting wasn't actually in the model.

### 1b. The conversion-factor framework was directionally right

The principle — that LS and Local results need alliance-specific translation to Assembly-equivalents — was sound. LS over-states LDF and under-states UDF / NDA in Kerala; Local sits between LS and Assembly. The model's directional choices (subtract for UDF & NDA, add for LDF) matched the observed pattern.

The failure was in *magnitude*, not direction (see §2).

### 1c. The forecast author identified the failure modes

The methodology document's §6 ("Where this model can fail") and each alliance file's "Post-mortem checklist" section flagged — before results came in — exactly the structural issues that ended up driving the residuals:

- "Anchor weighting is 60 % the last Assembly. … If the regime has shifted since 2021, the model will systematically pull the forecast back."
- "Only two historical pairs calibrate each conversion offset. All 'Medium' values were largely anchored to the 2019→2021 pair, which was a high-turnout, anti-NDA Assembly election."
- "Turnout sign for LDF is positive by construction. … If 2026 turnout went up *and* the swing went against LDF (anti-incumbency-driven turnout rather than mobilization-driven turnout), the turnout term moved in the wrong direction."
- "Each alliance is forecast independently. Vote shares do not sum to 100. … A correct anti-incumbency story should show UDF *gaining what LDF lost* — but the model treats those as separate processes."

The watchpoints were correct. The model just couldn't act on them — every knob was structurally limited.

---

## 2. What the forecast got wrong

### 2a. UDF + LDF: the joint miss

Treating the two as a system (since they're substitutes in the Kerala electorate):

| | Forecast | Actual | Swing vs forecast |
| --- | ---: | ---: | ---: |
| UDF − LDF gap | −4.05 pp (LDF ahead) | +8.91 pp (UDF ahead) | **+12.96 pp** |
| UDF + LDF total | 81.81 pp | 84.19 pp | +2.38 pp |

The model's joint probability for the actual outcome — "UDF ≥ 46 AND LDF ≤ 38" — is essentially zero:

- P(UDF ≥ 44) per the model = **0.0 %** (rounded). P(UDF ≥ 46) = **0.0 %**.
- P(LDF ≤ 38) per the model = **0.06 %**.
- Treating them as independent (which the model does): joint P ≈ 0.0 % × 0.06 % ≈ **essentially zero**.

That is a calibration failure of kind, not degree. The model said the realised world was effectively impossible.

### 2b. The mechanical decomposition for UDF

Forecast 38.88 vs actual 46.55 = +7.67 pp residual. Sources:

| Contribution to error | Magnitude (pp) | Why |
| --- | ---: | --- |
| LS-Assembly subtraction over-aggressive | ~+0.5 | −8 pp was the 2019→2021 value. 2014→2016 said −3.2. Using the average (−5.6) instead of the recent pair would have added 0.36 pp. |
| 60 % anchor on 2021 Assembly (39.47) | ~+4.0 | 2024 LS at 45.4 was much closer to reality. If 2021 weight dropped from 0.60 to 0.30 and LS picked up the slack, the blend rises by ~3–4 pp. |
| Trend sign error (−0.2 → reality positive) | ~+1.0 | UDF was trending up from LDF-base erosion. Sign was wrong. |
| Turnout sign error (if 2026 turnout was high) | ~+0.3 | UDF elasticity −0.10 assumed UDF *loses* with high turnout. Wrong if high turnout was anti-LDF mobilization. |
| Residual (regime-change anti-incumbency wave) | ~+1.8 | The genuinely unmodelled piece. |

### 2c. The mechanical decomposition for LDF

Forecast 42.93 vs actual 37.64 = −5.29 pp residual. Sources:

| Contribution to error | Magnitude (pp) | Why |
| --- | ---: | --- |
| LS-Assembly addition over-generous | ~−1.0 | +10 pp was the 2019→2021 value (anti-Centre recovery). 2014→2016 said +3.4. Using the average (+6.8) would have lowered the blend by ~0.5 pp. |
| 60 % anchor on 2021 Assembly (45.43 — LDF's peak) | ~−3.0 | LDF's national signal had been collapsing (LS 35.3 → 33.6). The model's 60 % weight on 2021 forced the forecast to look like a small dip from peak. |
| Trend (−0.1 pp/yr) under-stated incumbency | ~−2.0 | Two-term incumbency in Kerala had no precedent; calibration treated LDF as a single-term incumbent. |
| Turnout sign error (positive elasticity) | ~−0.5 to −1.0 | LDF ε = +0.25. If high turnout was anti-LDF rather than pro-LDF, this term was wrong by 0.5–1 pp. |
| Residual | ~+0.2 | Most of the LDF miss IS architecturally explainable. |

### 2d. The over-confident σ

The Medium-knob σ values were calibrated for "noise around a correct point estimate", not for "uncertainty about which regime we're in":

| | NDA σ | UDF σ | LDF σ |
| --- | ---: | ---: | ---: |
| Model value | 1.5 | 1.2 | 1.1 |
| Comment in `adjustment-parameters.json` | "newer coalition, higher variance" | "broad coalition, moderate stability" | "most disciplined voter base" |
| Actual residual | 1.6 pp | 7.7 pp | 5.3 pp |

LDF being assigned the *smallest* σ ("most disciplined base") is exactly the failure pattern: when the disciplined base is the one breaking, "discipline" becomes confidence in the wrong place. The σ should have widened proportional to the divergence between calibration pairs, not narrowed because of historical stability.

### 2e. Seat-count miss

The model produced no seat-level forecast — only statewide vote shares. The actual outcome:

| | Forecast implies (carry-forward 2021 mapping) | Actual |
| --- | --- | ---: |
| UDF seats | ~50–60 (model didn't compute) | **102** |
| LDF seats | ~80–90 | **35** |
| NDA seats | 0–3 | **3** |

UDF's 102-seat sweep was the largest UDF margin since 2011. The vote share alone (38.88 forecast → 46.55 actual) doesn't fully convey the seat-count realignment because Kerala's first-past-the-post system amplifies swings above ~6 pp. Even a small additional vote-share win for UDF would have produced a large seat-count win.

A seat-level model — even a crude uniform-swing one — would have shown how cliff-shaped the vote-to-seat mapping is around 42 / 43 % and made the high-leverage tails more visible.

### 2f. Turnout: uncertain, but the sign matters

The forecast assumed 2026 turnout would be ~74.83 % (a backward-looking blend of 2024 LS 72.04, 2025 Local 73.69, 2021 Assembly 76.0).

**Caveat: this repository does not include the official 2026 turnout figure (the committed `data/results-2026.json` carries vote counts but not electorate counts).** The post-mortem on this term depends on what the official ECI Form-20 turnout settled at. Two scenarios:

1. **If actual turnout came in below 75 %** (continuing the 2024 LS / 2025 Local declining trend) — the model's expected turnout was approximately right. The turnout-elasticity *magnitudes* could be analysed but the term contributes little either way.
2. **If actual turnout came in above 76 %** — the model's expected value was wrong AND the elasticity sign for LDF (+0.25, "high turnout helps LDF") may have been categorically wrong relative to 2026 dynamics. The methodology doc's §3d "critical post-mortem hook" explicitly identifies this scenario.

In either case the bulk of the LDF and UDF residuals comes from the blend's 60 % anchor on 2021, not from turnout. Turnout is a 0.5–1 pp lever; the residuals are 5–8 pp.

---

## 3. Why the failures happened (root causes)

### 3a. Backward-looking architecture

60 % weight on the last Assembly is a strong prior. It assumes the most recent same-type election is the best estimate of the next same-type election. In a regime-shift cycle, this prior is wrong by construction.

The model's own §6.1 named this: *"A 7 pp swing since 2021 enters the blend only at 40 % through Local + LS signals."* That's exactly the swing that happened.

### 3b. Calibration on two history points

Each conversion offset (LS→Assembly, Local→Assembly) was tuned against two historical pairs. For NDA and UDF, those pairs *disagreed on sign*. The model chose the more recent pair as the "Medium" value rather than averaging — locking in the 2019→2021 special case (a high-turnout anti-Centre Assembly) as the central case.

The 2019→2021 pair was itself produced by Kerala-specific dynamics (LDF's two-thirds-win re-election; rallying-around-the-flag during the pandemic). Treating it as the canonical LS-to-Assembly translation was over-fitting to a single observation.

### 3c. Correlation, not mechanism

The turnout-elasticity signs were derived from historical correlations:

- LDF had won in high-turnout years → encode "high turnout helps LDF" (ε = +0.25).
- UDF had won in lower-turnout years → encode "high turnout hurts UDF" (ε = −0.10).

The mechanism behind those correlations was *who turned out, when, and why* — not just the gross number. The mechanism flipped in 2026 (if turnout was high, it was anti-LDF turnout) without the correlation predicting it.

### 3d. No incumbency model

`annualTrendDrift = −0.1` for LDF was calibrated on parties that had served one term and then lost. LDF in 2026 was a **two-term** incumbent — a regime none of the calibration pairs (2014→2016, 2019→2021) capture. The genuine anti-incumbency swing was ~5–7 pp; the model represented it as 0.5 pp.

### 3e. Independence across alliances

The forecast pipeline runs three times independently. The fact that NDA + UDF + LDF must sum to ≤ 100 doesn't enter. So a "UDF gains 7 pp from LDF" event is modelled as two improbable events multiplied (each ~1 % probability) rather than a single zero-sum swing event.

This is the single biggest structural improvement opportunity.

### 3f. Univariate Gaussian distributions

The mixture-of-Normals shape is symmetric around the point estimate. There's no representation of "wave against incumbent" as skewed downside risk on LDF and skewed upside on the challenger. Tail mass was symmetric and too narrow.

---

## 4. Improvements for the next election forecast

Listed in rough priority order. **Not for application now** — pointers for the next cycle.

### 4a. Move from independent alliances to a joint / constrained system

The single highest-impact change. Either:

- **Compositional forecast**: forecast `(s_NDA, s_UDF, s_LDF, s_OTHER, s_NOTA)` as a Dirichlet or logistic-normal distribution constrained to sum to 1. Swings are naturally zero-sum.
- **Forecast the SWING from last Assembly**, distributed across alliances with a covariance matrix. Negatively correlated UDF / LDF residuals fall out automatically.
- **Pair-based forecast**: forecast `(UDF + LDF, UDF − LDF, NDA)` — the third coordinate "swing between the two main fronts" is the policy-relevant axis. The 2026 result is captured by a +13 pp move on that axis.

Any of these would have made "UDF +7 / LDF −7" a single coherent event, not two near-impossible events.

### 4b. Down-weight the previous Assembly when regime signals diverge

A simple version:

```
if abs(LS_signal − last_Assembly_signal) > threshold:
    increase weight on Local + LS, decrease weight on Assembly
```

The 2024 LS-Assembly divergence was: LDF 33.6 vs 45.4 (-11.8 pp), UDF 45.4 vs 39.5 (+5.9 pp), NDA 19.4 vs 12.4 (+7.0 pp). The model treated this as "noise around the 2021 anchor". A regime-aware blend would have rebalanced toward LS.

Alternatively: **use a continuous decay** rather than fixed 60 % weight. Last Assembly weight = `e^(-years/τ)` with τ ~ 4 years. By year 5, the Assembly anchor has decayed to ~30 % weight rather than 60 %.

### 4c. Add an incumbency-tenure term

Variables that *should* be in any future Kerala model:

- `is_incumbent_alliance` (one-hot)
- `terms_in_power` (continuous; 1, 2, 3+)
- `national_government_aligned` (alignment with central government)
- `years_since_last_change` (proxy for "incumbency fatigue")

The +/− 0.1 pp/yr drift term is too small a hammer for "you've been in power 10 years". A two-term incumbent should have a structural −3 to −5 pp shift built in, not a smooth drift.

### 4d. Re-derive turnout elasticity from mechanism, not correlation

The "LDF wins in high-turnout years" pattern is a *sample selection* artefact: LDF won those elections, so by construction the winners' turnout looked like LDF-favorable turnout. A causal turnout model needs:

- Whose marginal voter shows up when turnout rises? (Is it LDF-aligned demographics, UDF-aligned, or anti-incumbent?)
- Is current-cycle mobilization expanding the LDF base, the UDF base, or pulling neutrals?
- Survey data (CSDS / CVoter / etc.) discriminating turnout-driven swing from switching-driven swing.

A safer default for a stable model: **set turnout elasticity to zero unless there's a strong mechanism to assert otherwise.** Don't model what you don't understand.

### 4e. Use all historical pairs, weighted by recency, with explicit uncertainty

Instead of "pick the recent pair as Medium and let the user choose Low/High":

- Compute the conversion offset distribution over ALL available LS→Assembly pairs (not just the 2 in the model). Kerala has 8–10 such pairs across cycles.
- Use a Bayesian prior with the historical distribution.
- Let the σ of the conversion-offset distribution feed into the model's σ — *uncertainty about the offset itself* should widen the forecast distribution, not just within-cycle noise.

### 4f. Wider tails, allow asymmetry

`mixture σ = 1.1` for LDF was over-confident because it represented "noise around a known regime". When there's substantive uncertainty about regime, σ should be 2–3 pp at the prior level. The actual residuals (5 pp for LDF, 7 pp for UDF) suggest the right base σ is 3–4 pp, not 1–2.

For incumbents in their second term, an **asymmetric mixture** (`wLow = 0.40, wHigh = 0.15`) would acknowledge that anti-incumbency surprise is more likely than pro-incumbency surprise.

### 4g. Forecast at AC level, then aggregate

The 2026 dataset shows AC-level structure (cohort patterns: mature growers, low-base breakouts, vote-share decomposition). A model that forecasts each of 140 ACs — even crudely, with district-level priors and uniform-swing fallbacks — would surface:

- Where the seat-count cliffs are (UDF gets 102 seats at 46 % share but only 75 at 43 %).
- Which sub-regions are most volatile (the Christian-belt swing in this cycle).
- AC-level vote-flow consistency checks (does the implied UDF gain in Idukki make sense given the Latin-Catholic gradient?).

This is a bigger build but produces a fundamentally more useful forecast than "statewide percent".

### 4h. Out-of-sample validation

Before publishing the 2031 forecast, **withhold the most recent Assembly and predict it from older data**. Use 2011–2019 LS + Local + the 2011 Assembly to predict 2016, then add 2014 LS + 2015 Local + 2016 Assembly to predict 2021. Compare predictions to truth. The 2026 model could have done this on a smaller dataset; it would have surfaced σ inadequacy.

If the model can't predict 2021 from earlier data within its own quoted σ, its quoted σ for 2026 was over-confident.

### 4i. Add fundamentals: economic / sentiment / candidate-level inputs

The forecast had zero non-historical-election inputs. For 2031:

- **Sentiment / surveys**: even one or two CSDS-style polls 3–6 months out narrow uncertainty hugely.
- **Economic indicators**: Kerala remittance inflows, unemployment, fiscal stress proxies.
- **Candidate-quality**: incumbent retiring? cross-over from another alliance? prominent newcomer? AC-level binary flags help.
- **National-government alignment**: in 2026, BJP at the centre — Kerala's UDF benefited from being the opposition to both LDF (state) AND BJP (centre). In 2031, alignment may flip.

### 4j. Document calibration provenance and rerun on each data update

Every parameter in `adjustment-parameters.json` and `conversion-factors.json` should carry a comment with (a) which historical pairs informed it and (b) when it was last reviewed. When 2026 results came in, those parameters should have been mechanically re-calibrated and a new "Medium" published.

---

## 5. Quick reference — knob settings that would have helped

For curiosity / sanity-check on whether the 2026 outcome was reachable with the user-facing knobs:

| Adjustment | Knob change | Effect on point estimate | Closes the gap by |
| --- | --- | ---: | ---: |
| **UDF: every UDF-favourable knob** | LS-conv: Medium → High (8 → 5), Local: Medium → High (+1.6 → +2.5), Trend: Medium → High (0 → +0.3 pp/yr) | UDF: 38.88 → ~40.5 | ~22 % of the 7.67 pp gap |
| **LDF: every LDF-unfavourable knob** | LS-conv: Medium → Low (+10 → +6), Local: Medium → Low (+5 → +4), Trend: Medium → Low (0 → −0.3) | LDF: 42.93 → ~40.5 | ~46 % of the 5.29 pp gap |

Even with **every** user-reachable knob at the extreme, the model could not produce UDF > 41 % or LDF < 40 %. The architecture, not the parameterisation, was the binding constraint.

---

## 6. Summary scorecard

| Dimension | Verdict |
| --- | --- |
| NDA point estimate | ✅ Hit. Within 1σ. |
| UDF point estimate | ❌ Catastrophic miss. 4.8 σ off. |
| LDF point estimate | ❌ Catastrophic miss. 3.5 σ off. |
| Joint UDF/LDF swing direction | ❌ Wrong direction (model expected UDF-LDF gap to widen in LDF's favour; actual was opposite by 13 pp). |
| Calibration of uncertainty (σ) | ❌ Too narrow for two-term-incumbent cycle. |
| Conversion-factor framework | ✅ Directionally right. Magnitudes over-fit to recent pair. |
| Trend term | ⚠️ Worked for NDA. Wrong sign / magnitude for UDF and LDF given the regime shift. |
| Turnout term | ⚠️ Sign uncertain pending actual turnout; mechanism almost certainly wrong for LDF in any case. |
| Independent-alliance design | ❌ Couldn't represent the central event (vote transfer between LDF and UDF). |
| Seat-count forecast | ➖ Not attempted. |
| Self-awareness of failure modes | ✅ Forecast docs identified every binding constraint that ended up biting. |

**The most useful thing in the kerala-vote-forecast project, in hindsight, is its `methodology.md` §6 — the "where this can fail" list. It got the post-mortem right before the post-mortem existed.** The model architecture didn't have enough degrees of freedom to act on its own diagnoses; that's the lesson for next cycle.
