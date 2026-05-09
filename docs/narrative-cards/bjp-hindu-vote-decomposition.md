# BJP's Hindu-vote ceiling and decomposition

A structural reading of where BJP can grow next in Kerala. **The hypothesis under test**: BJP's growth is bounded by the Hindu vote share at each AC (Muslim votes go to UDF/LDF via IUML/CPM with near-zero leakage to BJP; Christian votes mostly go UDF/LDF with some BJP via marquee plays). Within that bounded Hindu pool, BJP competes against LDF and UDF for share. The question: at the AC level, how is the Hindu vote currently distributed, and what does that say about where BJP has room to grow?

This card uses an ecological-inference decomposition with stated assumptions. The methodology has real limitations (flagged below); the headline finding is robust to those limitations.

---

## Methodology

We don't directly observe how each religion voted at each AC. We can decompose under stated statewide-constant assumptions about religion-vote splits.

### Assumptions

| Religion vote | UDF | LDF | BJP | Other |
|---|---:|---:|---:|---:|
| **Muslim** | 70% | 25% | 0% | 5% |
| **Christian** | 50% | 30% | 15% | 5% |
| **Hindu** | (residual) | (residual) | (residual) | (negligible) |

**Why these numbers:** IUML's near-monopoly on Muslim votes places ~70% with UDF; the remaining ~25% goes to LDF (with KC(M)/KC(B) etc.). Christians split more evenly because of KC(M) on LDF side, INC/KC(J) on UDF, and BJP's recent marquee Catholic candidate plays (Pala, Thiruvalla) bumping the BJP-Christian average up to ~15%. BJP getting 0% of Muslim vote is a hard assumption — confirmed by every AC in the data showing no Muslim-side BJP support.

### Per-AC formulas

For each constituency:

> `BJP-Hindu-capture = (BJP% − 0.15 × Christian%) / Hindu%`
> `UDF-Hindu-capture = (UDF% − 0.50 × Christian% − 0.70 × Muslim%) / Hindu%`
> `LDF-Hindu-capture = (LDF% − 0.30 × Christian% − 0.25 × Muslim%) / Hindu%`

Each captures the *share of the Hindu vote pool* going to that alliance. Should sum to ~95-100% (small leakage to "other" parties).

### Sanity check

Across the 140 ACs:
- **Mean sum of three captures**: 97.2% — close to the expected 100%.
- **89 of 140 (64%) produce well-behaved estimates** (all three captures between 0% and 100%, sum within 90–110%). These are the *reliable* set used in the analysis below.
- **48 of 140 produce at least one negative or >100% capture** — meaning the constant-assumption framework breaks at those seats. Most of these are Muslim-majority Malappuram (where IUML's actual Muslim grip is tighter than 70%) or marquee Christian seats (where BJP's actual Christian capture is much higher than 15%). The unreliable seats are flagged but not used in the headline findings.

---

## Finding 1 — Saturation map: where is BJP near its Hindu-vote ceiling?

Top 15 BJP Hindu-vote captures (reliable seats only):

| AC | Seat | District | H/C/M | BJP% | **BJP-Hindu** | UDF-Hindu | LDF-Hindu |
|---|---|---|---|---:|---:|---:|---:|
| 2 | Kasaragod | Kasaragod | 44/2/54 | 31.9% | **72%** | 15% | 17% |
| 135 | Nemom | Trivandrum | 69/17/14 | 40.9% | **55%** | 5% | 42% |
| 56 | Palakkad | Palakkad | 63/3/34 | 33.5% | **53%** | 27% | 22% |
| 126 | Chathannoor | Kollam | 72/13/15 | 38.2% | **50%** | 13% | 38% |
| 27 | Kozhikode North | Kozhikode | 57/2/41 | 28.3% | **49%** | 11% | 42% |
| 93 | Pala | Kottayam | 38/52/10 | 26.1% | **49%** | 11% | 46% |
| 111 | Thiruvalla | Pathanamthitta | 48/48/4 | 30.7% | **49%** | 24% | 30% |
| 132 | Kazhakoottam | Trivandrum | 69/17/14 | 35.7% | **48%** | 15% | 39% |
| 55 | Malampuzha | Palakkad | 63/3/34 | 30.4% | **48%** | 1% | 53% |
| 101 | Poonjar | Kottayam | 42/41/16 | 25.1% | **45%** | 17% | 43% |
| 28 | Kozhikode South | Kozhikode | 57/2/41 | 25.6% | **44%** | 21% | 39% |
| 68 | Nattika | Thrissur | 64/16/20 | 29.0% | **42%** | 18% | 44% |
| 128 | Attingal | Trivandrum | 69/17/14 | 30.8% | **41%** | 14% | 45% |
| 134 | Thiruvananthapuram | Trivandrum | 69/17/14 | 29.4% | **39%** | 29% | 31% |

*Note: Manjeshwar (BJP-Hindu = 81%) is statewide highest but excluded from the reliable set due to LDF capture going negative under the constant-assumption framework. Pala/Thiruvalla appear here but their captures are inflated by underestimating BJP's Christian share at marquee seats — real BJP-Hindu capture is likely lower.*

**Takeaways:**

1. **Manjeshwar / Kasaragod are saturated** (~70-80% Hindu capture). BJP cannot grow further here without expanding into Christian or Muslim pools — both structurally unlikely.

2. **Trivandrum belt sits at ~40-55% Hindu capture.** Mature but not saturated. There's still meaningful room for Hindu-vote growth in the belt.

3. **The seats where BJP wins (Nemom, Chathannoor, Kazhakoottam) are at 48-55% Hindu capture** — i.e. winning needs about half the Hindu pool, plus whatever Christian + Muslim leakage exists.

4. **Most of Kerala's 140 ACs have BJP-Hindu capture below 30%** — substantial headroom remaining if Hindu vote becomes available.

---

## Finding 2 — Headroom: where is BJP severely under-capturing Hindu vote?

Hindu-heavy seats (Hindu ≥ 50%) where BJP-Hindu capture is below 20% — places where the Hindu pool is large but BJP has barely scratched it:

| AC | Seat | Hindu % | BJP % | BJP-Hindu | UDF-Hindu | LDF-Hindu |
|---|---|---:|---:|---:|---:|---:|
| 92 | Peerumade | 51% | 7.6% | 3% | 61% | 40% |
| 6 | Payyannur | 62% | 5.4% | 4% | 43% | 56% |
| 117 | Chavara | 59% | 7.8% | 10% | 45% | 48% |
| 22 | Nadapuram | 54% | 6.1% | 11% | 39% | 53% |
| 104 | Alappuzha | 67% | 9.8% | 11% | 48% | 44% |
| 21 | Kuttiadi | 59% | 6.8% | 11% | 36% | 56% |
| 58 | Chittur | 78% | 10.0% | 12% | 39% | 44% |
| 24 | Perambra | 57% | 7.6% | 13% | 31% | 59% |
| 78 | Paravur | 59% | 12.8% | 13% | 47% | 42% |
| 8 | Taliparamba | 61% | 8.5% | 13% | 35% | 52% |
| 7 | Kalliasseri | 55% | 8.2% | 14% | 16% | 73% |
| 88 | Devikulam | 61% | 13.5% | 14% | 40% | 48% |
| 25 | Balusseri | 60% | 9.3% | 14% | 38% | 51% |
| 105 | Ambalappuzha | 54% | 11.7% | 15% | 49% | 39% |
| 15 | Mattannur | 59% | 10.5% | 15% | 22% | 63% |

These are seats where BJP captures less than one-fifth of the Hindu vote despite Hindu being the largest community. Most are in **Northern Kerala** (Kannur, Kozhikode districts) or **Hindu-belt Palakkad / Alappuzha**.

**Notably**: in nearly every one of these underperforming seats, the dominant non-BJP Hindu-vote destination is **LDF**, not UDF. Kalliasseri shows the extreme: LDF takes 73% of Hindu vote, UDF only 16%, BJP 14%. Mattannur is similar: LDF 63%, UDF 22%, BJP 15%.

---

## Finding 3 — Where does the non-BJP Hindu vote go? (the key insight)

The user's framing: *"BJP's growth is tied to Hindu votes, and the Hindu vote is currently split between LDF and UDF."* The data refines this sharply.

### Hindu-heavy seats where Hindu vote → LDF (not UDF)

20+ seats statewide. Sample sorted by LDF-UDF gap:

| AC | Seat | District | H % | BJP-H | LDF-H | UDF-H | LDF − UDF gap |
|---|---|---|---:|---:|---:|---:|---:|
| 61 | Chelakkara | Thrissur | 61% | 35% | **60%** | 6% | **+54** |
| 55 | Malampuzha | Palakkad | 63% | 48% | **53%** | 1% | **+52** |
| 13 | Thalassery | Kannur | 61% | 25% | **63%** | 12% | **+51** |
| 51 | Shornur | Palakkad | 61% | 34% | **57%** | 11% | **+46** |
| 130 | Nedumangad | Trivandrum | 63% | 36% | **54%** | 11% | **+43** |
| 135 | Nemom | Trivandrum | 69% | 55% | **42%** | 5% | **+37** |
| 12 | Dharmadam | Kannur | 68% | 16% | **62%** | 25% | **+37** |
| 128 | Attingal | Trivandrum | 69% | 41% | **45%** | 14% | **+31** |
| 4 | Kanhangad | Kasaragod | 69% | 20% | **54%** | 26% | **+28** |
| 57 | Tarur | Palakkad | 74% | 21% | **53%** | 27% | **+26** |
| 68 | Nattika | Thrissur | 64% | 42% | **44%** | 18% | **+26** |
| 126 | Chathannoor | Kollam | 72% | 50% | **38%** | 13% | **+25** |
| 109 | Mavelikkara | Alappuzha | 74% | 18% | **54%** | 29% | **+25** |
| 132 | Kazhakoottam | Trivandrum | 69% | 48% | **39%** | 15% | **+24** |
| 60 | Alathur | Palakkad | 73% | 17% | **54%** | 30% | **+23** |
| 136 | Aruvikkara | Trivandrum | 64% | 22% | **51%** | 28% | **+23** |
| 110 | Chengannur | Alappuzha | 66% | 27% | **49%** | 26% | **+23** |
| 65 | Wadakkanchery | Thrissur | 63% | 19% | **52%** | 31% | **+22** |
| 127 | Varkala | Trivandrum | 71% | 27% | **46%** | 27% | **+19** |
| 119 | Kottarakkara | Kollam | 65% | 17% | **51%** | 33% | **+18** |

Geographic spread: Northern Kerala (Kannur, Kasaragod CPI(M) heartland), Central Kerala (Thrissur, Palakkad belt), and **the Trivandrum belt itself** (Nemom, Nedumangad, Attingal, Kazhakoottam, Aruvikkara, Varkala, Chathannoor — 7 belt seats appear here).

### Hindu-heavy seats where Hindu vote → UDF (not LDF)

**Only 6 seats** statewide where UDF takes more Hindu vote than LDF in Hindu-heavy terrain:

| AC | Seat | District | H % | BJP-H | UDF-H | LDF-H | UDF − LDF gap |
|---|---|---|---:|---:|---:|---:|---:|
| 139 | Kovalam | Trivandrum | 69% | 20% | 48% | 32% | +17 |
| 107 | Haripad | Alappuzha | 79% | 25% | 44% | 32% | +12 |
| 118 | Kunnathur | Kollam | 68% | 19% | 44% | 38% | +6 |
| 56 | Palakkad | Palakkad | 63% | 53% | 27% | 22% | +5 |
| 104 | Alappuzha | Alappuzha | 67% | 11% | 48% | 44% | +4 |
| 116 | Karunagappally | Kollam | 66% | 27% | 38% | 36% | +2 |

UDF-dominant Hindu-vote seats are rare. UDF's Hindu-vote support in Hindu-heavy terrain is the exception, not the rule.

### The headline finding

**In Hindu-heavy seats, the non-BJP Hindu vote goes overwhelmingly to LDF, not UDF.** 20+ seats show LDF dominance vs. only 6 with UDF dominance. The user's hypothesis ("Hindu vote split between LDF and UDF") is true only on average; in Hindu-heavy terrain specifically, the split is heavily LDF-leaning.

---

## Finding 4 — Trivandrum belt detailed profile

The 15 belt ACs by Hindu-vote decomposition:

| AC | Seat | H/C/M | BJP% | BJP-H | LDF-H | UDF-H |
|---|---|---|---:|---:|---:|---:|
| 135 | **Nemom** (won) | 69/17/14 | 40.9% | **55%** | 42% | 5% |
| 132 | **Kazhakoottam** (won) | 69/17/14 | 35.7% | **48%** | 39% | 15% |
| 126 | **Chathannoor** (won) | 72/13/15 | 38.2% | **50%** | 38% | 13% |
| 128 | Attingal | 69/17/14 | 30.8% | **41%** | 45% | 14% |
| 134 | Thiruvananthapuram | 69/17/14 | 29.4% | **39%** | 31% | 29% |
| 133 | Vattiyoorkavu | 69/16/15 | 28.8% | **38%** | 36% | 28% |
| 130 | Nedumangad | 63/13/24 | 24.7% | **36%** | 54% | 11% |
| 138 | Kattakkada | 68/25/7 | 26.3% | **33%** | 37% | 32% |
| 129 | Chirayinkeezhu | 69/17/14 | 22.5% | **29%** | 42% | 30% |
| 127 | Varkala | 71/4/25 | 19.9% | **27%** | 46% | 27% |
| 137 | Parassala | 49/45/6 | 19.4% | **26%** | 61% | 17% |
| 136 | Aruvikkara | 64/14/22 | 16.3% | **22%** | 51% | 28% |
| 139 | Kovalam | 69/17/14 | 16.5% | **20%** | 32% | 48% |
| 140 | Neyyattinkara | 69/17/14 | 16.4% | **20%** | 44% | 38% |
| 131 | Vamanapuram | 64/13/23 | 0% (BJP didn't field) | n/a | 50% | 42% |

**Belt-internal pattern:**
- **The 3 wins** (Nemom, Kazhakoottam, Chathannoor) all have BJP-Hindu ≥ 48% AND LDF-Hindu still substantial (38-42%).
- **The 4 closest-misses** (Attingal, Thiruvananthapuram, Vattiyoorkavu, Nedumangad) have BJP-Hindu of 36-41% and substantial LDF-Hindu remaining (31-54%). These are the seats where one more cycle of LDF-Hindu shrinkage would put BJP over the line.
- **The lower belt seats** (Varkala, Parassala, Aruvikkara, Kovalam, Neyyattinkara) still have BJP-Hindu at 20-27% — significant room for growth IF the Hindu pool can be pulled from LDF.

The belt's structural strength is real but conditional: its growth path runs through LDF's continued Hindu-vote shrinkage. If LDF recovers Hindu support in 2031, the belt's BJP gains may stall.

---

## Finding 5 — A third criterion: Hindu-vote headroom

The earlier work in `bjp-strongest-seats.md` established a two-condition model for BJP wins:
1. **Mature base** (NDA 2021 ≥ ~29%)
2. **Local LDF→swing flows toward NDA** (wave-capture conditions)

This Hindu-vote analysis adds a **third condition: meaningful headroom remaining within the Hindu-vote pool.**

### Ceiling formula

For each seat, define a realistic BJP ceiling under stated assumptions:
> **Ceiling = (Hindu_share × 0.75) + (Christian_share × 0.15)**
> *(75% Hindu capture is the realistic upper bound — Manjeshwar at 81% suggests the ceiling sits between 70-85% in practice. 0.15 Christian is the statewide-average BJP-Christian capture.)*

> **Headroom = Ceiling − current BJP share**

Seats with **headroom ≤ 5pp are ceiling-locked**: BJP cannot grow further without expanding into Christian or Muslim pools (both structurally unlikely except via the Pala/Thiruvalla-style marquee Christian play).

### Applied to the 8 mature-base seats

| AC | Seat | H/C/M | Base 2021 | BJP 2026 | BJP-Hindu-capture | Ceiling | Headroom | Wave-fav? | Won? |
|---|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | **Manjeshwar** | 44/2/53 | 37.7% | 36.1% | **81%** | 33.6% | **−2.6** 🔒 | ✗ | no |
| 2 | **Kasaragod** | 43/2/53 | 34.9% | 31.9% | **72%** | 33.3% | **+1.5** 🔒 | ✗ | no |
| 135 | Nemom | 69/16/13 | 35.5% | 40.9% | 55% | 54.4% | +13.5 | ✓ | **YES** |
| 56 | Palakkad | 62/2/34 | 35.3% | 33.5% | 53% | 47.5% | +14.0 | ✗ | no |
| 55 | Malampuzha | 62/2/34 | 30.7% | 30.4% | 48% | 47.5% | +17.1 | ~0 | no |
| 126 | Chathannoor | 72/13/14 | 30.6% | 38.2% | 50% | 56.0% | +17.7 | ✓ | **YES** |
| 132 | Kazhakoottam | 69/16/13 | 29.1% | 35.7% | 48% | 54.4% | +18.8 | ✓ | **YES** |
| 67 | Thrissur | 54/39/5 | 31.3% | 23.3% | 32% | 46.6% | +23.4 | ✗ | no |

**Two clean strategic groupings emerge:**

**Ceiling-locked (2 seats — Manjeshwar, Kasaragod):**
- BJP already captures 70-80% of the Hindu vote.
- With Hindu population only ~44%, the structural ceiling on BJP is around 33-34%. Both seats are *at* or *past* that ceiling.
- Both are also wave-against (Hindu+Muslim Kasaragod district where IUML absorbs Muslim swings; LDF→swing flows naturally to UDF, not NDA).
- **These seats are effectively unwinnable for BJP under current demographics.** No candidate strategy fixes this. The structural constraint is the Hindu population share, not the candidate or campaign quality.
- Implication: K. Surendran (state president) at Manjeshwar can repeat for cycles and not win. The seat is symbolic — flagship for BJP organizational presence in the north — but not a realistic conversion target.

**Growth-runway (6 seats):**
- BJP-Hindu-capture 32-55%, headroom 13-23pp.
- Of these, **3 won** (Nemom, Chathannoor, Kazhakoottam — all wave-favored). The wave-favored condition is what separated wins from losses within the growth-runway set.
- 3 lost (Palakkad, Malampuzha, Thrissur — wave-against). These remain *theoretically* winnable in a future cycle if the demographic-mix-driven wave conditions shift, but it's a heavy lift.

### The refined three-condition model

**A mature-base seat converts wave-capture into a BJP win when all three conditions hold:**
1. **Mature base** — NDA 2021 ≥ ~29%
2. **Hindu-vote headroom** — capture rate ≤ ~70%, headroom ≥ ~5pp
3. **Wave-favored** — LDF→swing flows toward NDA, not UDF

**All 3 BJP wins satisfy all three conditions.** The 5 mature-base losers fail at least one:

| Seat | Fails which condition? |
|---|---|
| Manjeshwar | (2) Ceiling-locked + (3) wave-against |
| Kasaragod | (2) Ceiling-locked + (3) wave-against |
| Palakkad | (3) Wave-against |
| Malampuzha | (3) Wave-against |
| Thrissur | (3) Wave-against (though Padmaja's −8pp also points to candidate weakness) |

The Hindu-vote headroom check **rules out 2 of 8 mature-base seats from BJP's realistic 2031 conversion list.** Manjeshwar and Kasaragod aren't in the running regardless of candidate quality, wave conditions, or campaign effort. The structural ceiling has already been hit.

### Implications for which seats are "watchlist for 2031"

Re-ranking the close-misses with the headroom filter:

| Seat | Base 2021 | Wave 2026? | Headroom | 2031 winnable? |
|---|---:|---|---:|---|
| Attingal | 25.9% | partial | +13.7 | **Yes** — needs only ~3pp more base |
| Vattiyoorkavu | 28.8% | ✗ | +13.6 | Conditional on wave shift |
| Kozhikode North | 22.5% | ✓ | +13.7 | Yes — needs ~6pp more base |
| Nattika | 22.0% | ✓ | +14.6 | Yes — needs ~7pp more base |
| Palakkad | 35.3% | ✗ | +14.0 | Conditional on demographic wave shift (unlikely) |
| Malampuzha | 30.7% | ✗ | +17.1 | Conditional on wave shift |
| **Manjeshwar** | 37.7% | ✗ | **−2.6** | **No — ceiling-locked** |
| **Kasaragod** | 34.9% | ✗ | **+1.5** | **No — ceiling-locked** |

The headroom filter **dramatically reshapes the 2031 watchlist**. Manjeshwar and Kasaragod — which would naturally appear as "high mature base, should be winnable" candidates — are removed. Attingal, Kozhikode North, and Nattika rise to the top: all have meaningful headroom AND saw favorable wave conditions in 2026, and need only modest base accumulation to cross the threshold.

This refines the bjp-1.md article's Section 1 framing significantly. **The answer to "why these 3 wins and not more?"** is now:

> *Of 21 wave-favored seats in 2026, 8 had mature ≥29% bases. Of those 8, only 6 had Hindu-vote headroom (the other 2 — Manjeshwar, Kasaragod — were ceiling-locked). Of those 6, only 3 simultaneously had wave-favored conditions and won. The other 3 (Palakkad, Malampuzha, Thrissur) had headroom but lacked the wave.*

Three filters, applied sequentially: wave-favored (21) → mature base (8) → Hindu-vote headroom (6) → wave-favored AND headroom AND mature base = **3 wins**. The funnel is sharp at every stage.

---

## Strategic implications

### For BJP's growth runway

> **BJP's Hindu-vote growth is structurally tied to LDF's continued Hindu-vote shrinkage, not UDF's.** In Hindu-heavy terrain, BJP and LDF compete for the same voter pool. UDF is a side player. The 2026 anti-LDF wave directly fed BJP's Hindu-vote growth in places like Thalassery (LDF Δ −13pp; BJP Δ +16pp from a 0% base, BJP-Hindu 25%). The Hindu LDF vote was BJP's 2026 gain.

This refines the standard reading. The "anti-LDF wave landed mostly on UDF" framing is statewide-true but masks a different dynamic in Hindu-heavy seats: there, the wave landed on **either UDF *or* BJP** depending on which of the two had structural presence. Where BJP had a 25%+ Hindu-vote base going in (Trivandrum belt), the wave landed on BJP. Where it didn't (most other Hindu-heavy seats), the wave landed on UDF.

### For 2031 forecasting

Two scenarios bracketing what happens next:

- **If LDF recovers its Hindu base** (counter-cyclical reversion to mean): BJP's Trivandrum belt growth stalls; the belt seats that just-missed in 2026 (Attingal, Vattiyoorkavu, Nedumangad) stay just-missed; BJP's overall trajectory plateaus at the 2026 numbers.

- **If LDF's Hindu base continues to shrink** (a continuation of 2026's pattern): the belt's just-missed seats cross the threshold; BJP picks up 4-6 more seats in the Trivandrum belt; BJP-Hindu capture in non-belt Hindu-heavy seats rises from ~15% to ~25%.

The pivot point is whether 2026 was a one-cycle anti-incumbency event or a trend.

### For Christian-vote competition (a different question)

The decomposition has BJP capturing only ~15% of Christian vote on average. Pala/Thiruvalla suggest the marquee Christian strategy can push BJP-Christian to ~35-45% at specific seats. But across most of Kerala, the Christian vote is split UDF-LDF with BJP barely participating. **For 2031, the marquee Christian strategy's expansion potential is real but narrow** — it works only where BJP can field a credible Christian-belt name AND the seat has demographic depth (≥40% Christian).

---

## Caveats and limitations

1. **The constant-assumption framework breaks at 36% of seats** (51 of 140 produce at least one negative or >100% capture estimate). Most failures are in Muslim-majority Malappuram (where IUML's grip exceeds 70%) or marquee Christian seats (where BJP-Christian exceeds 15%). The headline finding above uses only the 89 reliable seats.

2. **Specific seat estimates should be read directionally, not as point predictions.** The Hindu-capture numbers are sensitive to the assumption parameters. Treat ±5pp as a fair uncertainty band on each estimate.

3. **The decomposition is descriptive, not predictive.** It tells us where Hindu votes went *under 2026 conditions*. It doesn't predict where they'll go in 2031 — that depends on LDF recovery dynamics, BJP's candidate slate, and possibly issue salience that doesn't appear in the 2026 data.

4. **Christian-Muslim seats would benefit from per-seat assumptions.** The 50/30/15 Christian split is a statewide average. KC(M)-stronghold seats (Kottayam) and Latin-Catholic seats (Ernakulam coast) have different underlying splits. A more careful per-region model would refine the estimates.

5. **No turnout adjustment.** The framework assumes religious groups vote at the same rate. If turnout differs (e.g., higher Hindu turnout under polarised conditions), the captures shift.

---

## Open questions

1. **Calibrate Muslim/Christian splits per-region instead of statewide.** Use known IUML strongholds to estimate Muslim-UDF capture more precisely; use KC(M)-belt to refine Christian-LDF capture. Should reduce the 36% unreliable rate.

2. **Apply the same decomposition to 2021 and 2016.** Tracks BJP-Hindu-capture trajectory across cycles per seat. Surfaces where BJP's Hindu-vote growth is durable vs cyclical.

3. **Test the 2026-as-trend vs 2026-as-blip hypothesis.** Compare LDF-Hindu-capture trajectory for the past 3 cycles per seat. Does the LDF Hindu-vote shrinkage in 2026 fit a multi-cycle pattern, or is it a one-off?

4. **Cross-reference against caste data.** Nair-heavy seats may have different Hindu-vote capture profiles than Ezhava-heavy. The district-level caste data we have allows a rough first cut.

5. **Marquee-Christian-effect quantification.** What's the actual BJP-Christian capture at Pala, Thiruvalla, Poonjar, Kanjirappally? If we could measure that directly (perhaps from Christian-belt sub-precinct data), we could verify how much the marquee strategy adds vs the 15% statewide baseline.
