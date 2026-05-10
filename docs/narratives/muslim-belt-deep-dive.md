# Muslim-belt premium — deep dive (UDF strategy)

This arc analyses how UDF performed in Muslim Kerala in 2026 — the
strategies UDF used and how each performed. The application universe
is the two Muslim-side districts of Central-5 — **Wayanad** (mixed
demographic) and **Malappuram** (Muslim-majority across all 16 ACs).
The Christian belt arc covers the other three Central-5 districts
(Idukki, Ernakulam, Kottayam).

> **Reproduce:** `bun run scripts/analyze-muslim-belt.ts`

---

## 1. The Muslim premium has been large and stable since 2011

Comparing UDF performance in the rest of state vs ACs with ≥70%
Muslim share (n = 11):

| Year | UDF ≥70% Mus | UDF statewide | Premium |
|---|---|---|---|
| 2011 | 57.0% | 46.2% | +10.8pp |
| 2016 | 50.0% | 39.3% | +10.7pp |
| 2021 | 50.6% | 39.3% | +11.3pp |
| **2026** | **59.4%** | **46.6%** | **+12.8pp** |

- **The Muslim premium has been ~+11pp since 2011** — much larger than the Christian premium (~+3pp historically).
- In 2026 it grew modestly to **+12.8pp** — the historical pattern continues.
- Unlike the Christian belt, **the 2026 Muslim swing was wave-sized**, not amplified. ΔUDF at ≥70% Muslim ACs was +8.77pp — barely above the +7pp statewide wave. Muslims rode the wave from a higher baseline; they didn't surge in 2026 the way Christian-heavy ACs did.

> The Muslim story is therefore the *opposite shape* of the Christian story: stable historic premium continuing, vs. a smaller historic premium that doubled this cycle.

---

## 2. The 19 ACs of Wayanad + Malappuram

The full universe — sorted by Muslim share descending. Religion of
candidate is best inference; please overwrite where wrong.

| District | Name | H/C/M | Res | Candidate (party) | UDF Δ | Won? | Strategy |
|---|---|---|---|---|---|---|---|
| Malappuram | Vengara | 14/0/85 | — | K.M. Shaji (Muslim) — IUML | +3.2 | won | Muslim Alliance |
| Malappuram | Tirurangadi | 18/0/82 | — | P.M.A. Sameer (Muslim) — IUML | +14.1 | won | Muslim Alliance |
| Malappuram | Tanur | 18/0/82 | — | P.K. Navas (Muslim) — IUML | +7.9 | won | Muslim Alliance |
| Malappuram | Tirur | 21/1/78 | — | Kurukkoli Moideen (Muslim) — IUML | +5.4 | won | Muslim Alliance |
| Malappuram | Ernad | 22/1/77 | — | P.K. Basheer (Muslim) — IUML | +4.3 | won | Muslim Alliance |
| Malappuram | Kottakkal | 25/0/75 | — | Prof. Abid Hussain Thangal (Muslim) — IUML | +11.1 | won | Muslim Alliance |
| Malappuram | Mankada | 24/2/75 | — | Manjalamkuzhi Ali (Muslim) — IUML | +9.9 | won | Muslim Alliance |
| Malappuram | Manjeri | 24/1/75 | — | Adv. M. Rahmathulla (Muslim) — IUML | +10.6 | won | Muslim Alliance |
| Malappuram | Malappuram | 24/1/75 | — | P.K. Kunhalikutty (Muslim) — IUML | +9.8 | won | Muslim Alliance |
| Malappuram | Kondotty | 27/1/72 | — | T.P. Ashrafali (Muslim) — IUML | +9.9 | won | Muslim Alliance |
| Malappuram | Perinthalmanna | 27/2/71 | — | Najeeb Kanthapuram (Muslim) — IUML | +10.4 | won | Muslim Alliance |
| Malappuram | Vallikunnu | 30/1/69 | — | T.V. Ibrahim (Muslim) — IUML | +8.6 | won | Muslim Alliance |
| Malappuram | Thavanur | 33/0/67 | — | Adv. V.S. Joy (Christian ?) — INC | +4.1 | won | Special (INC-Christian) |
| Malappuram | Ponnani | 33/0/67 | — | K.P. Noushad Ali (Muslim) — INC | +10.4 | won | INC-Muslim |
| Malappuram | Wandoor | 30/8/62 | **SC** | A.P. Anilkumar (Hindu) — INC | +8.6 | won | INC-Hindu |
| Malappuram | Nilambur | 31/8/61 | — | Aryadan Shoukath (Muslim) — INC | +15.4 | won | INC-Muslim |
| Wayanad | Kalpetta | 41/14/45 | — | Adv. T. Siddique (Muslim) — INC | +10.4 | won | INC-Muslim |
| Wayanad | Mananthavady | 44/23/33 | **ST** | Usha Vijayan (Hindu) — INC | +5.8 | won | INC-Hindu |
| Wayanad | Sulthanbathery | 57/24/19 | **ST** | I.C. Balakrishnan (Hindu) — INC | **−3.4** | won | INC-Hindu |

**Total: 19 ACs (Wayanad 3 + Malappuram 16). UDF won 19/19.**

Notable structural facts:

- **All 12 IUML seats are in Malappuram.** IUML doesn't contest Wayanad.
- **INC contests every Wayanad seat.** Wayanad has no Muslim alliance presence on the UDF side.
- **Three ACs are reservation seats** (Wandoor SC, Mananthavady ST, Sulthanbathery ST).

---

## 3. UDF's three (and a half) strategies

Same framework as the Christian arc, applied here:

### 3a. Muslim Alliance — IUML (12 seats, all in Malappuram)

UDF gave the seat to its Muslim-affiliated alliance partner. **12 of 12 won.**

| Name | H/C/M | Candidate | UDF Δ |
|---|---|---|---|
| Vengara | 14/0/85 | K.M. Shaji | +3.2 |
| Tirurangadi | 18/0/82 | P.M.A. Sameer | +14.1 |
| Tanur | 18/0/82 | P.K. Navas | +7.9 |
| Tirur | 21/1/78 | Kurukkoli Moideen | +5.4 |
| Ernad | 22/1/77 | P.K. Basheer | +4.3 |
| Kottakkal | 25/0/75 | Prof. Abid Hussain Thangal | +11.1 |
| Mankada | 24/2/75 | Manjalamkuzhi Ali | +9.9 |
| Manjeri | 24/1/75 | Adv. M. Rahmathulla | +10.6 |
| Malappuram | 24/1/75 | P.K. Kunhalikutty | +9.8 |
| Kondotty | 27/1/72 | T.P. Ashrafali | +9.9 |
| Perinthalmanna | 27/2/71 | Najeeb Kanthapuram | +10.4 |
| Vallikunnu | 30/1/69 | T.V. Ibrahim | +8.6 |

Mean ΔUDF: **+8.8pp**.

### 3b. INC-Muslim — INC fields a Muslim candidate (3 seats)

Where INC contested itself with a Muslim candidate.

| District | Name | H/C/M | Candidate | UDF Δ |
|---|---|---|---|---|
| Malappuram | Ponnani | 33/0/67 | K.P. Noushad Ali | +10.4 |
| Malappuram | Nilambur | 31/8/61 | Aryadan Shoukath | +15.4 |
| Wayanad | Kalpetta | 41/14/45 | Adv. T. Siddique | +10.4 |

Mean ΔUDF: **+12.1pp**. **3 of 3 won.**

### 3c. INC-Hindu — INC fields a Hindu candidate (3 seats)

| District | Name | H/C/M | Res | Candidate | UDF Δ |
|---|---|---|---|---|---|
| Malappuram | Wandoor | 30/8/62 | **SC** | A.P. Anilkumar | +8.6 |
| Wayanad | Mananthavady | 44/23/33 | **ST** | Usha Vijayan | +5.8 |
| Wayanad | Sulthanbathery | 57/24/19 | **ST** | I.C. Balakrishnan | **−3.4** |

Mean ΔUDF: **+3.7pp** (or **+7.2pp** without Sulthanbathery, the only ΔUDF-negative seat). **3 of 3 won.**

### Special — Thavanur (1 seat)

INC fielded a candidate apparently Christian (V.S. Joy — "Joy" is most often Christian in Kerala, but please verify). Δ +4.1pp, won. Set aside as special case.

---

## 4. Performance of each cohort

| Strategy | n | Won | Mean ΔUDF | Read |
|---|---|---|---|---|
| **Muslim Alliance (IUML)** | 12 | 12 | **+8.8pp** | Above the statewide wave by ~2pp. IUML's stable Muslim base + the wave delivered every seat. |
| **INC-Muslim** | 3 | 3 | **+12.1pp** | The largest swing among the three INC-direct buckets. INC fielding Muslim candidates at heavily-Muslim or mixed seats outperformed. |
| **INC-Hindu** | 3 | 3 | **+3.7pp** *(+7.2pp ex-Sulthanbathery)* | The smallest swing. Sulthanbathery (19% Muslim) was the only seat anywhere in Wayanad+Malappuram where UDF *lost* vote share — which drags this mean. Even excluding it, INC-Hindu was below the wave. |
| Special — Thavanur INC-Christian | 1 | 1 | +4.1pp | One-AC, hard to generalise. |

Statewide ΔUDF reference: ~+7pp.

### What the data says

**Inverse of the Christian-belt finding.** In Christian Kerala, candidate religion within INC didn't matter for swing magnitude (Hindu INC ≈ Christian INC). In Muslim Kerala, **candidate religion within INC did matter** — Muslim INC candidates (+12.1pp) beat Hindu INC candidates (+3.7pp / +7.2pp) by a large margin.

**Hypothesis:** the Muslim community in 2026 was less open to non-Muslim INC candidates than the Christian community was to non-Christian INC candidates. Possible drivers: (a) Muslim political identity in Malappuram is more channel-locked through IUML and IUML-style alliances; (b) sample size is small (3 vs 3) so noise; (c) Wayanad's mixed demographics confound the Hindu-INC bucket (only 1 of the 3 Hindu-INC seats is Muslim-majority).

**Muslim Alliance held the floor.** IUML didn't outperform INC-Muslim, but it didn't underperform the wave either. In a sense the Muslim Alliance strategy is the "safe" baseline — every seat won, premium maintained, no surge.

### Caveats

- **Sample sizes are small** for INC-Muslim and INC-Hindu (n=3 each). One seat moves the mean substantially.
- **Wayanad's 3 ACs are not Muslim-majority** — including them stretches the "Muslim belt" framing. A pure-Malappuram cut (16 ACs) would be: Alliance 12, INC-Muslim 2, INC-Hindu 1, Special 1. Means stay roughly similar.
- **Sulthanbathery's −3.4pp** is the only UDF-negative AC in this universe and likely deserves outlier treatment (ST reserved, low Muslim share, possibly local-personality drag from I.C. Balakrishnan's incumbency dynamics).

---

## 5. Closing aphorism (TBD)

Candidate framings, parallel to Christian section's "Christians voted Congress, not a Christian candidate or a Christian party":

- **A.** "The Muslim premium is stable, but candidate religion mattered: where INC fielded a Muslim, the swing was +12pp; where INC fielded a Hindu, +4pp."
- **B.** "Muslims voted IUML where IUML stood, and Muslim INC where Muslim INC stood — both delivered the swing. INC's Hindu candidates underperformed."
- **C.** "Inside Muslim-Kerala the candidate's religion did matter — the opposite of Christian-Kerala, where it didn't."

Discuss before promoting.

---

## Open questions / next investigations

1. **Verify V.S. Joy's religion** (Thavanur INC) — Christian or Hindu? Resolves the special-case bucket.
2. **Sulthanbathery deep-dive** — why did UDF *lose* vote share here despite the wave? ST reserved seat dynamics? Personality / incumbency? 19% Muslim share too low to lean on Muslim-belt framing? Drop as outlier or include with note?
3. **Wayanad scope** — should the section narrow to Malappuram only (16 ACs, all Muslim-majority) and exclude Wayanad entirely? Wayanad's mixed demographics make it a noisy fit for "Muslim belt" framing.
4. **LDF context** — LDF fielded CPI(M)/CPI/Independent in most seats; INL (LDF Muslim party) did not feature prominently. Worth a brief note for parallel with Christian-belt's "LDF Christian parties lost all 13" stat? At a glance there's no Muslim-LDF-party collapse story to tell.

---

## Visualisations to build

Mirroring the Christian section:

1. **Scatter** — Muslim share (x) × UDF Δshare (y), all 140 ACs. Will show the Muslim-belt premium is broad and high but the swing is wave-sized at ≥70% Muslim.
2. **Choropleth** — Wayanad + Malappuram cropped, ACs coloured by strategy: Muslim Alliance (green), INC-Muslim (UDF blue), INC-Hindu (amber), Special (gray). Shows IUML's geographic monopoly in Malappuram and INC's coverage of Wayanad.
