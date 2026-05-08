# A8 — Was Central Kerala the kingmaker region?

**Verdict (confirms with sharper numbers than the consensus): The "Central Kerala kingmaker" framing is exactly right and the data is more dramatic than the headlines. UDF won 47 of 47 seats across Idukki, Ernakulam, Wayanad, Malappuram, and Kottayam — every single AC in those five districts. The pre-poll Manorama-C Voter projection of "UDF 33 of 53 in Central Kerala" was a substantial UNDERESTIMATE; UDF actually swept 47 of 47 in the strict Central-5 reading, or 55 of 65 in the wider 7-district reading. 46% of UDF's 102-seat majority came from just 5 districts representing 34% of all ACs.**

This card uses 2026 winners + 2021/2026 alliance Δ shares per district. See `scripts/narrative-a8-central-kerala.ts` to reproduce.

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

If we strip Central-5 from the count: UDF would have 55 seats (102 - 47), well below the 71-seat majority threshold. **Without Central Kerala, UDF doesn't form government.** The other 9 districts give UDF a plurality (55 vs LDF's 35) but no majority. The "kingmaker" label is literal.

## The opinionated reframe

> **Central Kerala wasn't just the swing region — it was the entire majority. UDF swept 47 of 47 seats across Idukki, Ernakulam, Wayanad, Malappuram, and Kottayam, supplying 46% of its 102-seat majority. Pre-poll surveys flagged the right geography but underestimated the wave by 23-38pp. Strip those 47 wins and UDF doesn't form government.**

The story isn't "UDF won everywhere"; it's "UDF won absolutely everywhere in 5 specific districts, while remaining merely competitive in the rest of the state." The geography of the 2026 sweep is concentrated, not diffused.

## Cross-references with the rest of the catalog

This card synthesizes the geographic implications of A1–A7:

- **A1 (minority consolidation)**: established that Christian-belt swings explained ~4pp of UDF's gain. A8 shows the *result*: that ~4pp Christian-belt premium converted to a 100% sweep across the 5 Christian-Muslim districts.
- **A2 (Sabarimala falsification)**: established that Hindu-issue framing didn't move the LDF→UDF wave. A8 corroborates: the wave was geographically Christian-Muslim (Central-5), not Hindu-route (Sabarimala). The two stories are spatially separate.
- **A3 (BJP's 3 wins concentrated)**: BJP wins concentrated in Trivandrum's Hindu pockets. A8 shows the inverse: UDF's wins concentrated in central Kerala's Christian-Muslim heartland. Same Kerala, two different geographic concentrations.
- **A6 (cabinet collapse)**: ministers lost at the same rate as non-minister LDF incumbents. A8 contextualizes: the 14 cabinet losses are scattered across Central-5 (Vasavan/Ettumanoor, Veena George/Aranmula, Riyas-survival/Beypore, etc.) where LDF lost wholesale. Cabinet collapse is geographically aligned with the UDF sweep, not separate from it.

Together these tell a coherent 2026 story: **the LDF→UDF wave was uniform in size (~7pp) and Christian-Muslim-belt-concentrated in geography. Anti-incumbency was the universal driver; Central Kerala's pre-existing minority weight converted modest swings into a complete sweep there.**

## Methodology & limitations

- **District definitions**: standard 14-district Kerala administrative division. "Central Kerala" doesn't have a single agreed definition; we report 5-district and 7-district readings.
- **Vote share Δ**: alliance-level shares 2021→2026.
- **Manorama-C Voter pre-poll number ("33 of 53")**: cited from narrative; we couldn't verify the exact 53-AC bundle they used. Either reading we tested places the actual UDF tally substantially above 62%.
- **What we can't tell**:
  - Whether the kingmaker effect is durable or cycle-specific. 2031 will reveal whether Central-5 is structurally UDF-aligned or this was a one-off anti-incumbency surge.
  - District-mean masking: within Central-5, individual ACs varied (e.g., Idukki +11pp UDF Δ vs Wayanad +4pp). The "100% sweep" hides the fact that some seats were close-call wins.

## Reproduce

`bun run scripts/narrative-a8-central-kerala.ts`
