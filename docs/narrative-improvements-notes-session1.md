# Session 1 working notes — methodology hardening results

**Run date:** 2026-05-07
**Scripts:** `scripts/narrative-regression.py`, `scripts/narrative-a1-no-kcm.py`
**Status:** complete; ready to feed into Session 2 prose edits

## Headline findings

1. **A1's Christian-belt UDF premium SURVIVES district fixed effects.** Coefficient drops 14% (+0.225 → +0.194) but stays significant at p=0.008. The within-district Christian-share variation predicts UDF gain robustly.

2. **A1's Muslim-share signal collapses entirely with district FE.** Within-district, Muslim share has no detectable effect on UDF Δ (β=+0.016, p=0.795). The simple-Pearson finding was driven by between-district variation (Malappuram clustering). This actually *strengthens* A1's "Muslim-share doesn't predict differential swing" framing — the within-district test is the cleaner test, and it confirms.

3. **LDF × Christian share is a between-district phenomenon only.** Simple correlation r=-0.05 is already weak; collapses to ~0 with district FE. Soften A1's framing about LDF dropping more in Christian-heavy ACs.

4. **A3's BJP-share × Hindu effect weakens under district FE.** Coefficient stays similar (+0.108 → +0.098) but p drifts from 0.012 to 0.213. The "BJP wins concentrated in Hindu-heavy seats" claim survives as a *descriptive* statement about the 3 specific wins, but the gradient claim ("more Hindu = more BJP growth") doesn't hold robustly.

5. **A3's NDA × Hindu effect collapses with even region FE.** β=+0.066 (p=0.031) → +0.034 (p=0.301) with region FE. Drop the gradient framing for NDA growth.

6. **B3+B4's Nair × UDF Δ effect SURVIVES region FE but weakens.** β=-0.222 (p=0.002) → -0.272 (p=0.044). Just barely significant. District FE absorbs caste perfectly (caste is district-constant), so we can't go further. Demote to exploratory per the original plan.

7. **B3+B4's Nair × NDA Δ effect DOES NOT hold.** Already weak (p=0.114 simple), collapses with region FE (p=0.562). Drop or qualify heavily.

8. **KC(M) alliance-relabel concern doesn't apply.** KC(M) was LDF in both 2021 AND 2026 in our data (verified). The agent confused the 2016→2020 alliance switch with a 2021→2026 switch. No relabel artifact in our cycle comparison.

9. **KC(M) base did defect partially.** In the 12 ACs where KC(M) contested both cycles, mean KC(M) share dropped from 41.2% to 34.4% (~7pp). In those specific ACs, UDF Δ closely tracks KC(M) loss (e.g., Idukki: KC(M) -10.88, UDF +12.02). This is a behavioral story (Christian voters abandoning KC(M)/LDF for UDF), not a relabel.

10. **The Christian-belt UDF premium is ~12% mechanical KC(M) and ~88% non-KC(M).** Christian-heavy bin premium: +3.11pp (original) → +2.74pp (KC(M)-stripped). The KC(M) story is real but doesn't dominate.

## Detailed regression tables

### A1 — Christian-belt UDF premium

```
=== Dep var: udf_delta ===

  Model 1: no controls
    christian              +0.225   SE 0.045   t  +5.03   p 0.000 ***
    muslim                 +0.160   SE 0.036   t  +4.42   p 0.000 ***
    udf21                  -0.273   SE 0.065   t  -4.20   p 0.000 ***
    R²=0.184  n=140

  Model 2: + region FE (Central=ref)
    christian              +0.223   SE 0.047   t  +4.72   p 0.000 ***
    muslim                 +0.116   SE 0.040   t  +2.90   p 0.004 ***
    udf21                  -0.282   SE 0.064   t  -4.39   p 0.000 ***
    R²=0.218  n=140

  Model 3: + district FE (Alappuzha=ref)
    christian              +0.194   SE 0.073   t  +2.66   p 0.008 ***
    muslim                 +0.016   SE 0.062   t  +0.26   p 0.795
    udf21                  -0.337   SE 0.067   t  -5.05   p 0.000 ***
    R²=0.321  n=140
```

**Key:** Christian effect survives at p<0.01 even with district FE. Muslim effect collapses (within-district, Muslim share doesn't predict swing).

### A1 — LDF Δ vs religion

```
  Model 1: no controls
    christian              -0.081   p 0.020 **
    muslim                 -0.045   p 0.078 *
    ldf21                  -0.292   p 0.000 ***
    R²=0.176

  Model 3: + district FE
    christian              +0.001   p 0.993
    muslim                 +0.045   p 0.388
    ldf21                  -0.263   p 0.000 ***
    R²=0.256
```

**Key:** LDF Δ × Christian collapses entirely under district FE. The simple correlation was a between-district artifact.

### A3 — BJP party-share × Hindu

```
  Model 1: no controls
    hindu                  +0.108   p 0.012 **
    bjp21                  -0.196   p 0.005 ***
    R²=0.074

  Model 2: + region FE
    hindu                  +0.099   p 0.036 **
    bjp21                  -0.213   p 0.002 ***
    R²=0.109

  Model 3: + district FE
    hindu                  +0.098   p 0.213
    bjp21                  -0.256   p 0.001 ***
    R²=0.191
```

**Key:** BJP × Hindu effect's coefficient is stable but loses significance with district FE. The 3 BJP wins are real (descriptive observation); the gradient claim is weak.

### A3 — NDA alliance × Hindu

```
  Model 1: no controls         hindu +0.066   p 0.031 **
  Model 2: + region FE         hindu +0.034   p 0.301
  Model 3: + district FE       hindu +0.045   p 0.413
```

**Key:** Drops out at first level of regional control.

### B3+B4 — Nair × UDF Δ

```
  Model 1: no controls
    nair                   -0.222   p 0.002 ***
    ezhava                 +0.005   p 0.927
    R²=0.069

  Model 2: + region FE
    nair                   -0.272   p 0.044 **
    ezhava                 +0.015   p 0.803
    R²=0.072

  Model 3: + district FE — SKIPPED (caste district-constant)
```

**Key:** Survives region FE but weakly. With only 14 districts and 3 regions, can't push controls further. Demote framing to "geographic overlap, not voter-behavior claim."

### B3+B4 — Nair × NDA Δ

```
  Model 1: no controls       nair +0.102   p 0.114
  Model 2: + region FE       nair +0.072   p 0.562
```

**Key:** Doesn't hold. Original card's r=+0.13 was already marginal; controls kill it.

### Reference: how much variance is region-explained?

```
  UDF_delta ~ region only:    R²=0.040
  UDF_delta ~ district FE:    R²=0.128
  UDF_delta ~ christian + muslim + udf21 + district FE: R²=0.321
```

Religion + prior share add substantial explanatory power (R² jumps from 0.13 to 0.32). Geography alone doesn't dominate.

## KC(M) rerun details

### Composition

- **KC(M) contested 12 ACs in 2021, 12 ACs in 2026** (same 12, no expansion).
- **Alliance: LDF in both cycles** (verified — no relabel).
- All 12 are central Kerala mixed-religion seats:

| AC | Name | Christian % | KC(M) '21 | KC(M) '26 | Δ |
|---|---|---|---|---|---|
| 91 | IDUKKI | 47.3 | 47.5 | 36.6 | -10.9 |
| 99 | CHANGANASSERY | 43.5 | 44.8 | 39.5 | -5.4 |
| 100 | KANJIRAPPALLY | 43.0 | 43.8 | 37.6 | -6.2 |
| 9 | IRIKKUR | 28.1 | 43.8 | 32.1 | -11.6 |
| 72 | CHALAKUDY | 44.4 | 42.5 | 35.1 | -7.4 |
| 94 | KADUTHURUTHY | 44.1 | 42.2 | 31.5 | -10.6 |
| 101 | POONJAR | 41.5 | 41.9 | 34.8 | -7.1 |
| 112 | RANNI | 46.9 | 41.2 | 40.8 | -0.4 |
| 93 | PALA | 52.0 | 39.3 | 35.3 | -4.0 |
| 85 | PIRAVOM | 42.1 | 37.8 | 29.7 | -8.1 |
| 74 | PERUMBAVOOR | 38.6 | 35.1 | 31.8 | -3.3 |
| 90 | THODUPUZHA | 40.6 | 34.0 | 27.9 | -6.1 |

Mean KC(M) share where contested: 41.2% (2021) → 34.4% (2026) — about a 7pp decline.

### Stripped-share analysis (limitations noted)

The "exclude KC(M) from numerator AND denominator" analysis works for UDF (KC(M) is LDF, so stripping doesn't directly affect UDF numerator) but produces degenerate LDF counterfactuals (in 7 of 12 KC(M) seats, KC(M) was the only major LDF candidate; stripping makes LDF share = 0 mechanically).

**For UDF (interpretable result):**
- Christian-heavy bin (n=32) UDF Δ: +10.40pp original → +9.71pp stripped (-0.69pp difference)
- Christian-heavy *premium vs statewide*: +3.11pp original → +2.74pp stripped
- ~12% of A1's Christian-belt premium attributable to KC(M) accounting; ~88% is non-KC(M).

**For LDF (degenerate counterfactual):**
- Don't report. Stripping eliminates LDF candidates entirely in KC(M)-only seats, producing artificially zero LDF Δ. Better approach: regress UDF Δ on KC(M) Δ + religion variables to partial out the KC(M)-specific component. Deferred — the simple Pearson finding (LDF × Christian doesn't survive district FE) already softens this without needing the KC(M) test.

### KC(M) seats: where did the alliance Δ go?

In KC(M)-active ACs, UDF Δ closely tracks KC(M) loss:

| AC | KC(M) Δ | UDF Δ | Net (UDF + KC(M)) |
|---|---|---|---|
| Idukki | -10.88 | +12.02 | +1.14 |
| Kaduthuruthy | -10.63 | +11.40 | +0.77 |
| Thodupuzha | -6.15 | +9.74 | +3.59 |
| Kanjirappally | -6.16 | +8.06 | +1.90 |
| Chalakudy | -7.42 | +8.74 | +1.32 |
| Changanassery | -5.37 | +6.48 | +1.11 |
| Piravom | -8.10 | +5.40 | -2.70 |
| Pala | -3.97 | -12.87 | -16.84 (NDA absorbed via Mani C. Kappan) |

**Pattern:** In 7 of 8 KC(M)-active Christian-heavy seats, UDF gained roughly KC(M)'s loss. Roughly 1:1 transfer. **The mechanism in KC(M) seats is straightforward Christian-Catholic voter defection from Jose K. Mani's KC(M) (LDF column) to INC/KC(J) (UDF column).** Pala is the major exception — KC(M) loss went to NDA via Mani C. Kappan's NCP, not UDF.

The two outliers worth noting:
- **Poonjar:** KC(M) -7.14, UDF +14.68 — UDF gain is 2× KC(M) loss. Half of UDF gain is from non-KC(M) sources (likely net LDF erosion + Independent absorption; P.C. George's switch to BJP also moved voters around).
- **Perumbavoor:** KC(M) -3.28, UDF +14.09 — UDF gain is 4× KC(M) loss. Major non-KC(M) UDF surge.

## Decisions for Session 2

Per the plan's decision points:

✓ **A1 Christian effect survives district FE → A1 strengthens.** Update with the within-district coefficient. The headline ("Christian-belt UDF premium") holds. Add a methodology paragraph showing the FE robustness and explicitly noting the within-district interpretation.

✓ **KC(M)-stripped analysis: ~88% of premium survives → KC(M) caveat is footnote-sized.** A1 mechanism splits into "behavioral consolidation (~88%) + KC(M)-specific defection (~12%)". Add a paragraph in A1's methodology section. NOT a major reframe — KC(M) is a sub-mechanism, not the main story.

✓ **B3+B4 region FE result barely survives → demote to exploratory.** Per plan.

✓ **A3 BJP × Hindu gradient weakens with district FE → soften "concentration thesis".** The 3 wins themselves are still in Hindu-heavy seats (descriptive); but "BJP grew more in Hindu-heavy seats" as a gradient claim doesn't survive controls. Reframe A3 around the 3 specific wins + their UDF underperformance, not a Hindu-share gradient.

✓ **A2, A6, A8: no regression test, no changes triggered.** A2 was a treatment-control test (already controlled by matched-Hindu comparison). A6 was treatment-control. A8 was descriptive geography. All OK.

## Items deferred to Session 2 prose work

- Add "What this directly shows / What it does NOT prove / What would weaken this conclusion" sections to all 6 cards
- Single-pass language tightening (inference discipline, confidence gradients)
- Constituency-as-unit disclaimer ("each AC counts once" boilerplate)
- KC(M) caveat in A1 + A8
- Demote B3+B4 to exploratory framing
- Update A1 with regression-controlled coefficients
- Soften A3's gradient claim
- Write the synthesis card ("Three overlapping patterns")
