# A8 — Was Central Kerala the kingmaker region?

**Verdict (confirms with sharper numbers than the consensus): The "Central Kerala kingmaker" framing is consistent with the data and the magnitudes are larger than the press headlines suggested. UDF won 47 of 47 seats across Idukki, Ernakulam, Wayanad, Malappuram, and Kottayam — a complete sweep of those five districts. The pre-poll Manorama-C Voter projection of "UDF 33 of 53 in Central Kerala" was a substantial underestimate; UDF won 47 of 47 in the Central-5 reading, or 55 of 65 in the wider 7-district reading. 46% of UDF's 102-seat majority came from just 5 districts representing 34% of all ACs.**

**Confidence: Strong (descriptive)** — the geographic facts are robust (district-level seat tallies are exact). The "kingmaker" framing is interpretive — every coalition's majority depends on some regional bloc; what's distinctive here is the magnitude (46% from 5 districts), not the structural dependency.

> **A note on inference:** This card describes seat-level outcomes and district-level vote-share aggregates. "Central Kerala swung to UDF" is shorthand for the constituency-level pattern; the underlying mechanism overlaps with A1 (Christian-belt premium, partly KC(M) base movement, partly cross-community shift) and is separately analysed there. A8 is primarily descriptive geography.

This card uses 2026 winners + 2021/2026 alliance Δ shares per district. See `scripts/narrative-a8-central-kerala.ts` to reproduce.

**Unit:** Seat tallies are constituency counts; vote-share Δ figures are constituency-equal means. Statewide reference uses vote-weighted aggregates. The unit of analysis is the constituency, not the individual voter.

## The consensus claim

Multiple sources (Onmanorama, The South First, Madhyamam, The Federal):

> UDF won every seat in Idukki, Ernakulam, Wayanad, Malappuram, Kottayam — losing only one each in Pathanamthitta, Kasaragod, Kozhikode. LDF residual strength: Thrissur and Kannur (and not even those fully). Pre-poll Manorama-C Voter projection had already flagged this geography (UDF 33 of 53 in Central Kerala).

Four sub-claims, all directly checkable.

## Sub-claim (i): UDF swept 5 districts

| District | ACs | UDF | LDF | NDA | Mean UDF Δ | Mean LDF Δ |
|---|---|---|---|---|---|---|
| Idukki | 5 | **5** | 0 | 0 | +11.4pp | -12.9pp |
| Ernakulam | 14 | **14** | 0 | 0 | +10.5pp | -5.7pp |
| Wayanad | 3 | **3** | 0 | 0 | +4.2pp | -8.3pp |
| Malappuram | 16 | **16** | 0 | 0 | +9.0pp | -8.3pp |
| Kottayam | 9 | **9** | 0 | 0 | +8.8pp | -9.4pp |
| **Total** | **47** | **47** | **0** | **0** | | |

**Confirmed exactly. UDF 47 of 47.** No LDF or NDA wins anywhere in these five districts. The mean UDF gain across the 5-district set is +9.4pp — about 2pp ahead of the statewide +7.3pp baseline.

The intra-set variation is interesting:
- **Idukki had the *largest* mean swings** in either direction (+11.4 UDF / -12.9 LDF) — the cleanest LDF→UDF flip pattern.
- **Ernakulam had the *smallest* LDF collapse** (-5.7pp) but still flipped completely to UDF — meaning UDF gained share without proportional LDF loss. NDA + others must have leaked to UDF here. Latin Catholic + Munambam Waqf effects (per A1, A7) likely explain Ernakulam's specific mechanism.
- **Wayanad's mean UDF Δ is only +4.2pp** — the *smallest* of the five — yet UDF still swept 3 of 3. Meaning Wayanad seats were already structurally close enough that a modest swing flipped them.

## Sub-claim (ii): UDF lost only one each in 3 districts

| District | UDF wins | UDF lost | Lost seat |
|---|---|---|---|
| Pathanamthitta | 4 of 5 | 1 | KONNI → LDF |
| Kasaragod | 4 of 5 | 1 | KANHANGAD → LDF |
| Kozhikode | 12 of 13 | 1 | BEYPORE → LDF |

**All three confirmed exactly.** And the three exceptions are individually meaningful:

- **KONNI** (Pathanamthitta) — the one Pathanamthitta-district AC where LDF held. Note from A2: Konni was also an outlier in the Sabarimala-route test (LDF +3.2pp gain when surrounding ACs lost). Probably a candidate-specific local hold.
- **KANHANGAD** (Kasaragod) — far north Kerala, traditional CPI(M) belt. Held against the wave.
- **BEYPORE** (Kozhikode) — P.A. Mohammed Riyas, LDF Public Works Minister and the CM's son-in-law. Held by a sitting cabinet minister with political-family backing.

Each "exception" has a candidate-specific narrative. The pattern is: UDF won everything *except where a particular sitting LDF candidate had personal hold*.

## Sub-claim (iii): LDF residual strength in Thrissur, Kannur (but not fully)

| District | UDF | LDF | NDA | Mean LDF share | Mean LDF Δ |
|---|---|---|---|---|---|
| Thrissur | 4 | **9** | 0 | 40.3% | -6.8pp |
| Kannur | 5 | **6** | 0 | 43.9% | -9.1pp |
| Kasaragod | 4 | 1 | 0 | 33.2% | -5.8pp |

Thrissur and Kannur confirmed as LDF residual strongholds. **Kasaragod is NOT** — the narrative was wrong to lump it in. Kasaragod went UDF 4 / LDF 1, the same pattern as Pathanamthitta (mostly UDF with one LDF holdout). The far-north isn't an LDF stronghold this cycle.

The "and not even those fully" caveat is borne out: LDF held 9 of 13 Thrissur seats (69%) and 6 of 11 Kannur seats (55%). The traditional CPI(M) heartland kept majority status but ceded ~30-45% to UDF — a meaningful breach.

## Sub-claim (iv): "UDF 33 of 53 in Central Kerala" (Manorama-C Voter pre-poll)

The pre-poll prediction defines "Central Kerala" loosely; coverage suggests a 53-AC bundle. Two readings of "Central Kerala":

| Reading | District set | Total ACs | UDF wins |
|---|---|---|---|
| Central-5 (strict) | Idukki, Ernakulam, Wayanad, Malappuram, Kottayam | 47 | **47 (100%)** |
| Central-7 (with Pathanamthitta + Thrissur) | + Pathanamthitta, Thrissur | 65 | **55 (85%)** |

The pre-poll number "33 of 53" sits between these readings (62%). It seems to assume a 53-AC bundle that's wider than Central-5 but with Thrissur partially included as LDF-leaning. Either way, **UDF dramatically outperformed the prediction in both readings**:

- 47/47 = 100% in Central-5 (vs prediction ~62%)
- 55/65 = 85% in Central-7 (vs prediction ~62%)

The pre-poll surveys flagged the right geography but **underestimated the magnitude by 23-38pp**. The wave was deeper than what late-March/early-April surveys captured.

## The kingmaker arithmetic

UDF's path to 102 seats (a 71-seat majority threshold + 31 seats safety margin):

| Source | UDF wins | Cumulative | % of UDF total |
|---|---|---|---|
| Central-5 districts | 47 | 47 | 46.1% |
| + Pathanamthitta + Thrissur | +8 | 55 | 53.9% |
| + Kannur, Kollam, Alappuzha | +19 | 74 | 72.5% |
| + remainder (Kozhikode, Trivandrum, etc.) | +28 | 102 | 100% |

**46% of UDF's 102-seat majority came from just 5 districts containing 34% of Kerala's ACs.** The kingmaker framing is empirically validated by this concentration ratio: Central Kerala wasn't merely a strong UDF region, it was the *primary numerical source* of the majority.

If we strip Central-5 from the count: UDF would have 55 seats (102 - 47), enough to remain the largest bloc but below the 71-seat majority threshold. **Central Kerala provided nearly half of UDF's eventual majority margin, making it the single most important regional bloc in the coalition's path to power.** The arithmetic dependency is real, but the "kingmaker" framing is interpretive — every majority coalition depends on some region for its majority margin; what's distinctive here is the *magnitude* (46% from 5 districts representing 34% of ACs), not the structural existence of the dependency.

## The opinionated reframe

> **Central Kerala provided nearly half of UDF's majority margin. UDF swept 47 of 47 seats across Idukki, Ernakulam, Wayanad, Malappuram, and Kottayam — supplying 46% of its 102-seat majority from 34% of the state's ACs. Pre-poll surveys flagged the right geography but underestimated the wave's magnitude by 23-38pp. Stripped of those 47 wins, UDF would still be Kerala's largest bloc (55 seats) but below the 71-seat majority threshold.**

The story isn't "UDF won everywhere"; it's "UDF won absolutely everywhere in 5 specific districts, while remaining merely competitive in the rest of the state." The geography of the 2026 sweep is concentrated, not diffused.

## Cross-references with the rest of the catalog

This card synthesizes the geographic implications of A1–A7:

- **A1 (minority consolidation)**: established that Christian-belt swings explained ~4pp of UDF's gain. A8 shows the *result*: that ~4pp Christian-belt premium converted to a 100% sweep across the 5 Christian-Muslim districts.
- **A2 (Sabarimala falsification)**: established that Hindu-issue framing didn't move the LDF→UDF wave. A8 corroborates: the wave was geographically Christian-Muslim (Central-5), not Hindu-route (Sabarimala). The two stories are spatially separate.
- **A3 (BJP's 3 wins concentrated)**: BJP wins concentrated in Trivandrum's Hindu pockets. A8 shows the inverse: UDF's wins concentrated in central Kerala's Christian-Muslim heartland. Same Kerala, two different geographic concentrations.
- **A6 (cabinet collapse)**: ministers lost at the same rate as non-minister LDF incumbents. A8 contextualizes: the 14 cabinet losses are scattered across Central-5 (Vasavan/Ettumanoor, Veena George/Aranmula, Riyas-survival/Beypore, etc.) where LDF lost wholesale. Cabinet collapse is geographically aligned with the UDF sweep, not separate from it.

Together these tell a coherent 2026 story: **the LDF→UDF wave was uniform in size (~7pp) and Christian-Muslim-belt-concentrated in geography. Anti-incumbency was the universal driver; Central Kerala's pre-existing minority weight converted modest swings into a complete sweep there.**

### KC(M) base movement contributes to the Central-5 surge

A meaningful chunk of the Central-5 UDF surge involves a specific party-base movement that's worth flagging: Kerala Congress (M), Jose K. Mani's faction, was alliance-tagged LDF in both 2021 and 2026 (KC(M) didn't switch alliances between our two cycles — they joined LDF in 2020, before our analysis window). KC(M)'s mean party share dropped from 41.2% to 34.4% in the 12 ACs where they contested (~7pp decline). 10 of those 12 ACs are in the Central-5 districts. In KC(M) seats, UDF gain closely tracks KC(M) loss (e.g., Idukki: KC(M) -10.88pp, UDF +12.02pp), suggesting Christian-Catholic voters partially defected from LDF-aligned KC(M) to UDF (INC/KC(J)).

Per A1's KC(M) robustness check, ~12% of A1's Christian-belt UDF premium is attributable to KC(M)-specific dynamics; ~88% is non-KC(M). For A8's geographic claim, the same accounting suggests ~10-15% of the central-Kerala UDF surge is KC(M)-base-movement (a behavioral shift, but specific to that party's voters), with the remainder reflecting broader cross-community consolidation. The 47-of-47 sweep is real; the *mechanism* combines several distinct movements that aren't fully separable from constituency-level vote totals.

## What this directly shows / what it cannot prove / what would weaken the conclusion

### What this directly shows

- UDF won every AC in Idukki, Ernakulam, Wayanad, Malappuram, Kottayam (47 of 47).
- UDF lost exactly one AC each in Pathanamthitta (Konni), Kasaragod (Kanhangad), Kozhikode (Beypore).
- Thrissur (UDF 4 / LDF 9) and Kannur (UDF 5 / LDF 6) are where LDF retained majority status; Kasaragod (4/1) is not an LDF stronghold despite the press lumping it in.
- Central-5 districts contributed 47 of UDF's 102 seats (46.1%); strip them and UDF (55 seats) is below the 71-seat majority threshold.

### What this does NOT prove

- **Central Kerala voters consolidated as a unified bloc behind UDF.** What we observe is a constituency-level outcome (47-0 sweep). The mechanism overlaps with A1's Christian-belt finding (which itself splits into ~88% non-KC(M) consolidation + ~12% KC(M) base movement), Muslim-heavy IUML strongholds (which behaved like the rest of LDF-incumbent seats per A1), and district-specific dynamics. "Central Kerala consolidated" is convenient shorthand for a heterogeneous mix.
- **The kingmaker effect is durable.** 2026 was an anti-LDF wave year; the 47-0 sweep may be cycle-specific. Without a comparable next-cycle observation, durability is unproven.
- **Pathanamthitta's "lost only Konni" is part of the same wave.** Konni was held by LDF independently of broader trends — A2 documented Konni as an outlier (LDF +3.2pp gain when surroundings lost). The "lost only one" framing is a true statement but obscures Konni-specific local dynamics.

### What would weaken this conclusion

- **2031 results showing UDF retains majority statewide but loses Central-5 seats** — would suggest the 2026 sweep was a one-cycle anti-incumbency manifestation, not a structural Central-Kerala UDF alignment.
- **Sub-community polling revealing the Central-5 sweep was a coalition of disparate bases (Catholic farmers + Muslim IUML + cross-community voters) without unified motivation** — would dismantle the "Central Kerala kingmaker" framing and replace it with "5 different stories that happened to align in 2026."
- **Multi-cycle data showing similar Central-5 sweeps in past anti-incumbency years** — would be evidence the kingmaker geography is structural, not 2026-specific. Currently we have a single observation.

## Methodology & limitations

- **District definitions**: standard 14-district Kerala administrative division. "Central Kerala" doesn't have a single agreed definition; we report 5-district and 7-district readings.
- **Vote share Δ**: alliance-level shares 2021→2026, constituency-equal means.
- **Manorama-C Voter pre-poll number ("33 of 53")**: cited from narrative; we couldn't verify the exact 53-AC bundle they used. Either reading we tested places the actual UDF tally substantially above 62%.

## Reproduce

`bun run scripts/narrative-a8-central-kerala.ts`
