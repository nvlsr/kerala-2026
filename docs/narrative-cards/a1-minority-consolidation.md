# A1 — Did "minority consolidation" really drive UDF's 2026 sweep?

**Verdict (v2, AC-level): The "minority consolidation" framing is half right and half wrong. There was a real Christian-share consolidation that delivered UDF an extra ~4pp gain in Christian-belt seats. There was *not* a Muslim-share consolidation — Muslim-heavy seats followed the statewide LDF→UDF trend with no extra pull.** The press framing pooled the two religions into one bloc story; only one of the two carries data signal. LDF's 7pp collapse remained religion-blind across all bins.

This card has two versions of the verdict. The original district-level analysis (still useful as a methodology demonstration) is preserved at the bottom. **The current verdict above uses AC-level religion data**, built by joining SHRUG's `shrid → AC` keys against Census 2011 Table C-01 (sub-district + town religion shares) — see `scripts/build-ac-demographics.py`.

## The consensus claim

Six post-mortems (Federal, Quint, Outlook, ToI, NIE, Lokniti baseline) converged on this story:

> Lokniti-CSDS 2021 had recorded ~40% of Muslims and Christians voting LDF — peak Left support among minorities. The 2026 verdict reversed that decisively: UDF swept all seats in Idukki, Ernakulam, Wayanad, Malappuram, and Kottayam — the Christian-Muslim heartland — and IUML won 22 of 27 contested seats (81% strike rate). Multiple sources describe the shift in Muslim and Christian-majority pockets as "near total."

If correct, we should see (a) substantially stronger UDF growth in high-minority districts vs Hindu-majority ones, (b) substantially deeper LDF losses in those same minority districts. The narrative treats Muslim-share and Christian-share as one consolidating bloc.

## What the AC-level data shows

### Correlations across 140 ACs (AC religion shares × per-AC alliance Δ)

|  | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|
| Muslim share | r = **+0.00** | r = +0.03 | r = -0.10 |
| Christian share | r = **+0.21** | r = -0.06 | r = +0.07 |
| Hindu share | r = -0.23 | r = +0.03 | r = +0.06 |
| (Muslim + Christian) | r = +0.23 | r = -0.03 | r = -0.06 |

When religion share is measured at the AC level (instead of broadcast from district), the picture sharpens dramatically:

- **Christian share's correlation with UDF gain nearly DOUBLED** (district: +0.11 → AC: +0.21). Real, meaningful effect.
- **Muslim share's correlation collapsed further toward zero** (district: +0.07 → AC: +0.00). Statistically indistinguishable from "no relationship."
- The pooled "minority share" signal (+0.23) is **entirely the Christian half** carrying weight; the Muslim half adds no signal.

### Mean swings by Christian-share bin

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Christian-majority (≥50%) | 2 | **-2.28pp**¹ | -6.27pp | **+9.78pp** |
| Christian-heavy (30–50%) | 34 | **+10.45pp** | -8.03pp | +2.51pp |
| Christian-mid (15–30%) | 35 | +6.70pp | -6.84pp | +0.92pp |
| Low Christian (<15%) | 69 | +6.30pp | -7.46pp | +2.18pp |

¹ The 2 Christian-majority ACs are PALA (52% C) and ANGAMALY (64% C). They split very differently — Angamaly +8.3pp UDF (clean swing), Pala -12.9pp UDF / +18.2pp NDA (Mani C. Kappan / NCP / KC(M) churn unrelated to religion). The bin mean reflects this.

The Christian-heavy 30–50% bin is the headline finding: **+10.45pp UDF gain across 34 ACs**, vs +6.30pp in low-Christian seats. A clean **4.15pp differential** attributable to Christian-share — the actual signal "minority consolidation" was pointing at.

### Mean swings by Muslim-share bin

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Muslim-majority (≥60%) | 14 | +8.54pp | -7.93pp | +0.41pp |
| Muslim-heavy (40–60%) | 13 | +5.96pp | -6.74pp | +2.07pp |
| Muslim-mid (20–40%) | 39 | +6.82pp | -7.46pp | +2.18pp |
| Low Muslim (<20%) | 74 | +7.53pp | -7.44pp | +2.29pp |

Muslim-majority ACs gained UDF +8.54pp — slightly above the statewide ~7pp trend, but not dramatically. The 40–60% Muslim bin actually gained LESS than the low-Muslim bin (+5.96pp vs +7.53pp). **There is no monotonic relationship between Muslim share and UDF gain.** Muslim-heavy seats followed the state trend; they didn't supercharge it.

This contradicts the headline framing in coverage which emphasized "Muslim consolidation" as a primary driver.

### Pala and the limit of correlation analysis

Looking at the top-10 most-Christian ACs, individual seats show very different swings:

| Seat | Christian% | UDF Δ | LDF Δ | NDA Δ | Notes |
|---|---|---|---|---|---|
| ANGAMALY | 64% | +8.3 | -8.6 | +1.3 | Clean swing |
| **PALA** | 52% | **-12.9** | -4.0 | **+18.2** | Mani C. Kappan / NCP / KC(M) churn |
| PUTHUPPALLY | 49% | +17.8 | -16.8 | +0.2 | Massive UDF consolidation |
| **UDUMBANCHOLA** | 48% | **+22.6** | -24.6 | +2.7 | Largest Christian-belt swing |
| **THIRUVALLA** | 48% | +1.6 | -14.6 | **+14.5** | LDF crater + JD(S) winner / fragmentation; NDA caught the residue |
| IDUKKI | 47% | +12.0 | -10.9 | +0.3 | Clean swing |
| RANNI | 47% | +4.1 | -0.4 | -0.7 | Stable / minimal swing |
| ETTUMANOOR | 45% | +17.5 | -10.0 | -0.3 | Devaswom Minister Vasavan lost — Sabarimala backlash visible |

The Christian-belt narrative holds across most ACs but **two outliers (Pala, Thiruvalla) account for ~18pp of NDA gain in this top-10 alone**. Both reflect non-religious local dynamics: Pala's NCK/KC(M) coalition churn and Thiruvalla's three-way fragmentation with a JD(S) winner. Strip those two and the Christian-belt → UDF story is even cleaner than the bin means suggest.

For the top-10 Muslim ACs, the picture is different: 9 of 10 show strong LDF→UDF swings (UDF +5 to +14pp); only Vengara saw LDF gain. But this is mostly **incumbent IUML strongholds** holding ground — IUML's strike rate of 22/27 reflects its existing base, not new consolidation.

## The opinionated reframe (v2)

> **Anti-incumbency punished LDF ~7pp uniformly across every religion mix. The "minority consolidation" story collapses into two distinct phenomena once we look at AC-level data: a real ~4pp Christian-belt premium for UDF (driven by central-Kerala Syro-Malabar dioceses + Idukki Christian highlands + Pathanamthitta), and essentially nothing on the Muslim side beyond IUML's incumbent hold. The press framing — pooling Muslim + Christian into one consolidating bloc — averaged a real signal with a non-signal and called the result "minority consolidation."**

The Christian half of the "minority bloc" did the work the headlines attributed to both. The Muslim half just held its existing turf.

## What the new resolution unlocked

Moving from district-level to AC-level religion data wasn't just a refinement — it changed the verdict's character. Three things became visible:

1. **The Christian effect was twice as strong as previously measurable.** District averages diluted the signal; once we resolved at AC level (with PALA at 52% C distinguishable from rural Kottayam at 30% C), the correlation jumped from +0.11 to +0.21.
2. **The Muslim effect went from "weak" to "absent."** Same disaggregation, opposite direction. Within Malappuram district, Muslim shares vary from 70% (Malappuram AC) to 83% (Vengara) to 79% (Tirurangadi) — and their UDF swings vary from +3.2 to +14.1pp. The Muslim share doesn't predict the swing.
3. **Outliers became identifiable.** Pala's UDF -12.9pp and Thiruvalla's NDA +14.5pp are now correctly placed in their actual religion context (both are 48–52% Christian seats with non-religious local dynamics), instead of being averaged into Kottayam/Pathanamthitta district means.

## Notable outliers

| Seat | District | Christian% | Muslim% | UDF Δ | LDF Δ | What's going on |
|---|---|---|---|---|---|---|
| 93 PALA | Kottayam | 52% | 9% | **-12.9pp** | -4.0pp | NCK / Mani C. Kappan / KC(M) churn |
| 78 PARAVUR | Ernakulam | (urban-fallback) | — | -2.3pp | -1.8pp | Latin Catholic coastal — Munambam Waqf effect |
| 111 THIRUVALLA | Pathanamthitta | 48% | 3% | +1.6pp | **-14.6pp** | NDA +14.5pp — Sabarimala-route + JD(S) winner |
| 41 VENGARA | Malappuram | 0% | 83% | +3.2pp | **+8.5pp** | Only Muslim-majority seat where LDF GAINED |
| 89 UDUMBANCHOLA | Idukki | 48% | 3% | **+22.6pp** | -24.6pp | Largest single-seat Christian-belt swing |

These outliers are no longer "explained away" by district-mean averaging — they sit visibly outside the trend at AC resolution.

## Methodology & limitations

### What we improved
- **Religion data resolution**: 14 districts → 114 AC-level + 26 district-fallback (urban-heavy ACs).
- **Source**: Census 2011 Table C-01 (religion at sub-district + town level) joined to SHRUG's `shrid → AC` mapping with population-weighted aggregation.
- **State aggregate sanity check**: Recomputed from AC-level data = Hindu 53.8% / Muslim 26.8% / Christian 19.1%. Census state totals: 54.7% / 26.6% / 18.4%. Within 1pp on all three, confirming aggregation correctness.

### What we still can't tell
- **26 ACs (mostly major urban — Trivandrum city, Cochin, Kozhikode city, Alappuzha) fall back to district-level religion** because SHRUG's spatial join failed for those urban shrids. Population coverage of AC-level data: 27.0M of Kerala's 33.4M (~80%). Re-running the analysis on AC-only ACs (n=114) gives: Christian r=+0.22, Muslim r=-0.04 — so the headline finding holds in the strict subset.

### Robustness check — excluding SC/ST reserved seats

Reserved seats (14 SC + 2 ST = 16 of 140) have structurally different dynamics: only SC/ST candidates contest. Reserved seats correlate with high-Hindu/low-minority districts which could confound the religion × vote-swing correlation we measure here.

Re-running with `bun run scripts/narrative-a1-ac-level.ts --exclude-reserved` (n=124):

| | All 140 | n=124 (excl. reserved) |
|---|---|---|
| Christian × UDF Δ | r = +0.20 | r = **+0.22** (slightly stronger) |
| Muslim × UDF Δ | r = -0.00 | r = -0.04 (still ~zero) |
| Muslim + Christian × UDF Δ | r = +0.22 | r = +0.21 (essentially same) |

The Christian-belt premium **strengthens slightly** when reserved seats are dropped (consistent with reserved seats being concentrated in low-Christian Hindu-majority districts that contribute little to the gradient). The Muslim non-finding holds. **A1's verdict is robust to reserved-seat exclusion.**
- **Sub-community shifts** within "Christian" (Syro-Malabar vs Latin vs Marthoma) and "Muslim" (Sunni vs Mujahid) — still invisible. C-01 doesn't disaggregate.
- **Mechanism is still ambiguous**: a +10pp UDF gain in Christian-heavy ACs could be (a) Christians switching LDF→UDF, (b) Christian LDF voters staying home, (c) Christian non-voters mobilizing for UDF. AC-level census + AC-level vote count can't distinguish these — survey microdata can.
- **Census 2011 staleness**: 14 years out of date. Geographic pattern is structurally stable; absolute shares may be off ~3-5pp.

## Next narrative cards (related)

- **A2 — Sabarimala-route Hindu backlash**: Now testable cleanly. Hypothesis: LDF dropped MORE in Sabarimala-pilgrimage ACs (Aranmula, Konni, Ranni, Pathanamthitta, Ettumanoor — all Hindu-Christian mixed seats) than in non-Sabarimala Hindu seats. ETTUMANOOR's UDF +17.5 / LDF -10.0 signature in our top-10 already hints at this.
- **A3 — BJP's 3 wins in Trivandrum**: Hypothesis: concentrated Hindu-belt cluster, not statewide consolidation. With AC-level data we can also test whether NDA's +1.83pp statewide growth came from a few seats (Pala, Thiruvalla, Kazhakoottam, Nemom) or distributed broadly. Current data hints "concentrated."

---

# Appendix — Original district-level analysis (v1)

Preserved for methodology comparison. The verdict shifted meaningfully when we moved to AC-level data; the v1 framing called the narrative "partially supported but substantially overstated." The v2 framing is sharper: "half right, half wrong."

### v1 correlations (district religion shares × per-AC alliance Δ)

|  | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|
| Muslim share (district) | r = +0.07 | r = -0.02 | r = -0.19 |
| Christian share | r = +0.11 | r = -0.06 | r = +0.23 |
| Hindu share | r = -0.24 | r = +0.10 | r = +0.02 |
| (Muslim + Christian) | r = +0.24 | r = -0.10 | — |

### v1 bins (combined minority share)

| Bin | n | UDF Δ | LDF Δ |
|---|---|---|---|
| Very high minority (≥60%) | 16 | +8.98pp | -8.28pp |
| High (50–60%) | 19 | +10.71pp | -7.59pp |
| Mid-high (40–50%) | 48 | +6.86pp | -7.32pp |
| Mid (33–40%) | 34 | +6.82pp | -7.35pp |
| Low / Hindu-heavy (<33%) | 23 | +4.87pp | -7.04pp |

### Why v1 understated

The v1 numbers were blunted by ecological-fallacy attribution: every AC in Malappuram got the same 70% Muslim label, every AC in Kottayam got the same 49% minority label. Within-district variation (PALA at 52% Christian vs surrounding rural-Kottayam at 30% Christian) was invisible. AC-level data brought it into focus — and showed that the Christian half of the "minority bloc" was carrying the entire signal.

## Sources cross-checked

The Federal (5 May 2026), The Quint (May 2026), Outlook (May 2026), Times of India (May 2026), New Indian Express (Jan 2026 pre-poll), Lokniti-CSDS Kerala 2021 post-poll, The Print on Lokniti (2021).

## Reproduce

- AC-level analysis: `bun run scripts/narrative-a1-ac-level.ts`
- AC demographics build: `python3 scripts/build-ac-demographics.py` (requires `data/shrug/` from DDL + `data/census-c01/DDW32C-01-MDDS.XLS` from censusindia.gov.in)
- Original district-level analysis: `bun run scripts/narrative-a1-minority-consolidation.ts`
