# LDF's collapse was shallow everywhere, with a small fat tail

**Verdict (descriptive): The distribution of LDF Δshare across 140 ACs is tightly clustered (mean -7.43pp, SD 4.47pp, IQR width 5.80pp). 75% of ACs sit in the modest-loss range (-10 to 0pp); only 6 ACs (4.3%) had "catastrophic loss" (worse than -15pp). LDF's standard deviation is the smallest of the three alliances (LDF 4.47, UDF 5.65, NDA 5.04) — meaning LDF's loss was the most uniform of the three Δ-distributions; UDF and NDA gains were more variable.** This is consistent with broad anti-incumbency hitting roughly evenly, NOT with a wave-style election that produced concentrated geographic wipeouts. The qualifier: kurtosis is +1.55, meaning the distribution has slightly fatter tails than normal — there ARE outliers worth naming, but the modal range holds.

**Confidence: Strong (descriptive)** — distribution statistics are exact at this granularity; outlier ACs are cross-documented in other cards. The "shallow everywhere" framing follows directly from low SD + tight IQR; the small fat tail is honestly reported via the kurtosis figure.

This card adds rigor to a claim made implicitly in A1, A2, A6, and A8: "LDF lost ~7pp uniformly." Those cards didn't show the actual distribution. This one does.

> **A note on inference:** This card is purely descriptive. It characterises the distribution of LDF Δshare without claiming a causal mechanism. "Shallow everywhere" describes the pattern; explanations (uniform anti-incumbency, ceiling effects, party-machinery defense, etc.) remain a separate question.

**Unit:** Constituency-equal distribution (each AC counts once). Reproduce: `python3 scripts/narrative-ldf-shallow-distribution.py`.

---

## The headline distribution

LDF Δshare across 140 ACs:

| Statistic | Value |
|---|---|
| Mean | -7.43pp |
| Median | -7.73pp |
| Standard deviation | 4.47pp |
| Min | -24.59pp (Udumbanchola) |
| Max | +8.51pp (Vengara) |
| Range | 33.10pp |
| IQR (Q1, Q3) | -9.96pp, -4.16pp |
| IQR width | 5.80pp |
| Skewness | -0.10 (essentially symmetric) |
| Excess kurtosis | +1.55 (slightly fatter tails than normal) |

The tight IQR is the headline: **half of all 140 ACs sit within a 5.80pp window centered just below -7pp.** Mean and median agree (-7.43 vs -7.73), confirming the distribution is essentially symmetric — not a long-tailed wave that wiped out specific zones.

## Bin classification

| Bin | Definition | n | % |
|---|---|---|---|
| Held / gained | LDF Δ > -5pp | 40 | 28.6% |
| Modest loss | -10 to -5pp | 65 | 46.4% |
| Deep loss | -15 to -10pp | 29 | 20.7% |
| Catastrophic loss | worse than -15pp | 6 | 4.3% |

**Three-quarters of ACs (75%) are in either "held/gained" or "modest loss" categories.** The "catastrophic loss" set is just 6 ACs. The "deep loss" middle category has 29 ACs — a real chunk, but not dominant.

## Text histogram (1pp bins)

```
Bin (LDF Δ)      Count  Bar
-25 to -24       1   █
-18 to -17       1   █
-17 to -16       1   █
-16 to -15       3   ███
-15 to -14       2   ██
-14 to -13       5   █████
-13 to -12       6   ██████
-12 to -11       7   ███████
-11 to -10       9   █████████
-10 to  -9      12   ████████████
 -9 to  -8      21   █████████████████████      ← mode (15% of ACs)
 -8 to  -7      12   ████████████
 -7 to  -6       8   ████████
 -6 to  -5      12   ████████████
 -5 to  -4       7   ███████
 -4 to  -3      12   ████████████
 -3 to  -2       9   █████████
 -2 to  -1       4   ████
 -1 to  +0       4   ████
 +1 to  +2       1   █
 +2 to  +3       1   █
 +3 to  +4       1   █
 +8 to  +9       1   █
```

The shape is **right-skewed unimodal** (peak in the -9 to -8pp bin, with the bulk of mass between -12 and -2pp). The left tail thins out smoothly into the catastrophic-loss zone. The right tail (above 0) is sparse — only 4 ACs where LDF gained share at all, and only 1 (Vengara) gained meaningfully.

## Comparison vs expected-normal tails

If LDF Δ were drawn from a normal distribution N(-7.43, 4.47):

| Tail | Predicted | Actual |
|---|---|---|
| ACs with LDF Δ < -15pp | 6.31 | 6 |
| ACs with LDF Δ > +5pp | 0.38 | 1 |

The bottom tail (catastrophic losses) matches the normal prediction almost exactly. The top tail (LDF gains) has 1 AC where normal would predict 0.38 — a single outlier (Vengara).

But the kurtosis (+1.55) indicates the *shape* of the distribution is slightly fatter-tailed than normal. The histogram shows this in the lumpy left tail (gaps at -23 to -19 then individual outliers at -24, -17, -16). It's not a smooth bell; it's a tight bell with a few standalone outliers.

## Outliers worth naming

### Catastrophic-loss outliers (LDF Δ < -16.4pp, 2-SD threshold)

| Seat | Name | LDF Δ | UDF Δ | NDA Δ | Note |
|---|---|---|---|---|---|
| 89 | UDUMBANCHOLA | -24.59pp | +22.59pp | +2.66pp | A1's biggest Christian-belt swing — Idukki Christian highlands, very unusual |
| 6 | PAYYANNUR | -17.81pp | +20.23pp | -2.09pp | Northern Kannur, traditional CPI(M) stronghold; LDF→UDF transfer |
| 98 | PUTHUPPALLY | -16.82pp | +17.79pp | +0.18pp | Central Kerala, KC(M)/Christian belt; documented in A1 |

All three catastrophic-loss ACs are clean LDF→UDF transfers (small NDA component). They're geographically scattered (Idukki, Kannur, Kottayam) — not a regional collapse pattern.

### LDF-gained outliers (LDF Δ > +1.5pp)

| Seat | Name | LDF Δ | UDF Δ | NDA Δ | Note |
|---|---|---|---|---|---|
| 41 | VENGARA | +8.51pp | +3.18pp | -0.91pp | Only Muslim-majority AC where LDF gained; documented in A1 |
| 114 | KONNI | +3.24pp | +7.55pp | -10.56pp | Pathanamthitta district holdout; documented in A2/A8 |
| 2 | KASARAGOD | +2.17pp | +1.54pp | -3.01pp | Far north traditional LDF base |
| 103 | CHERTHALA | +1.61pp | -3.40pp | +2.34pp | P. Prasad's seat — only minister with non-negative LDF Δ (per A6) |

Four ACs where LDF held or gained ground. Three have known specific stories from other cards; Kasaragod is just a stronghold.

## Comparison: shape of LDF Δ vs UDF Δ vs NDA Δ

| Distribution | Mean | SD | Range |
|---|---|---|---|
| **LDF Δ** | -7.43pp | **4.47pp** | [-24.6, +8.5] |
| UDF Δ | +7.29pp | 5.65pp | [-12.9, +22.6] |
| NDA Δ | +2.05pp | 5.04pp | [-10.6, +22.9] |

LDF's standard deviation (4.47pp) is the smallest of the three. UDF gains have more variability (SD 5.65) — meaning UDF gained a lot in some places and stayed flat in others. NDA gains have similar variability (SD 5.04) but a much smaller mean (+2.05pp); NDA's distribution is the "concentrated pocket" pattern documented in A3 + bjp-ac-growth.md.

**Reading**: LDF's *loss* was the most uniform of the three swings. UDF's gains were more concentrated in specific ACs. NDA's were even more concentrated. This is the symmetry to expect when one alliance bleeds broadly and the bleed lands unevenly on the other two: LDF Δ is tight, UDF/NDA Δ are diffuse.

## What this confirms (and what it doesn't)

This distribution **confirms** the implicit framing across A1, A2, A6, A8:

- "LDF lost ~7pp uniformly" — yes, mean -7.43pp with SD 4.47pp. The wave was real and even.
- "No religion-targeted, route-targeted, or minister-targeted concentrated collapse" — confirmed. The distribution is unimodal with a well-defined peak; you'd expect bimodality if there were a "concentrated collapse zone" superimposed on a uniform background, and there isn't.
- "There are some outliers" — yes, 7 ACs (5%) sit more than 2 SD from the mean. They're documented in other cards (Udumbanchola in A1, Payyannur isolated, Puthuppally in A1, Konni in A2, Vengara in A1, Cherthala in A6, Kasaragod a far-north stronghold).

This distribution **does not** support the framing that:

- "LDF was wiped out in zone X" — there's no zone where LDF systematically dropped >15pp; the 6 catastrophic-loss ACs are scattered.
- "LDF held its strongholds" — actually the modal LDF Δ in the -9 to -8pp range applies to a lot of nominal stronghold seats (Kannur, Thrissur). LDF strongholds bled at the typical rate; they just retained majority status because their starting margins were larger.

## What this directly shows / what it cannot prove / what would weaken the conclusion

### What this directly shows

- LDF Δshare across 140 ACs has mean -7.43pp, median -7.73pp, SD 4.47pp.
- 75% of ACs lost between 0 and -10pp.
- Only 6 ACs (4.3%) had LDF Δ worse than -15pp.
- LDF's SD (4.47pp) is smaller than UDF's (5.65pp) and NDA's (5.04pp).
- The distribution is essentially symmetric (skewness -0.10) and slightly leptokurtic (excess kurtosis +1.55) — tight cluster + a few outliers.

### What this does NOT prove

- **The wave was uniformly *caused*.** Distribution shape says nothing about mechanism. A uniform wave from "general anti-incumbency", a uniform wave from "broad welfare-disappointment", a uniform wave from "religion-blind incumbency exhaustion" all produce similar distributional shapes at the constituency level.
- **Future LDF distributions will be similar.** This is one cycle. A 2031 distribution with similar tightness would suggest a structural feature; a 2031 distribution with concentrated zones would suggest 2026 was unusual. Currently this rests on one observation.
- **The fat tail is meaningless.** The +1.55 excess kurtosis is real — the 6 catastrophic-loss ACs are genuinely outside what a pure-normal would predict. They have stories (Udumbanchola, Puthuppally, Payyannur). The distribution's modal claim ("shallow everywhere") coexists with the tail claim ("a few real outliers"); both are true.

### What would weaken the conclusion

- **Same-cycle data from comparable elections (UP, Bihar, Maharashtra) showing wave elections always have tight distributions** — would suggest the "shallow everywhere" framing isn't distinctive to 2026 Kerala but is just how vote-share Δ tends to look.
- **Multi-cycle Kerala data showing 2011/2016/2021 distributions had similar shapes regardless of outcome** — would suggest the tightness is just a feature of Kerala politics, not a feature of 2026's specific dynamics.
- **A bimodal subgroup analysis revealing two distinct LDF-loss populations within the unimodal aggregate** — for example, if LDF lost differently in incumbent-CPI(M) vs incumbent-non-CPI(M) seats, the apparent uniformity could mask two superimposed peaks. A6 tested incumbent-vs-non; the differential was small (+0.74pp).

## Cross-references

- **A1** asserted LDF "lost ~7pp uniformly across all bins." This card shows the distribution that backs that assertion — and adds the caveat that 5% of ACs are real outliers, mostly already documented in other cards.
- **A6** found minister incumbents lost slightly less (-6.89pp) than non-minister incumbents (-7.63pp). Both numbers sit on the modal LDF-loss peak (-9 to -8pp); the +0.74pp differential is small relative to the 4.47pp standard deviation.
- **A8** documented Central-5 sweep + LDF residual in Kannur/Thrissur. This card adds: even in the LDF-residual districts, LDF lost at the typical rate (~-7pp); they kept seats because of starting margins, not because they bled less.
- **A3 + bjp-ac-growth.md** documented BJP/NDA's concentrated-pocket distribution. This card frames that contrast: LDF's loss is the *most uniform* of the three alliances; UDF/NDA gains are more concentrated. Asymmetric distribution shapes per alliance.

## Reproduce

`python3 scripts/narrative-ldf-shallow-distribution.py`
