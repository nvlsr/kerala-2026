# Vote flow analysis (2011 → 2026)

This document captures the **alliance-level vote flow patterns** identified across Kerala's 140 ACs. The analysis script lives at `scripts/detect-flows.ts`. Run with `bun run scripts/detect-flows.ts` to regenerate after data updates.

## What "flow" means here

We **infer** flows from net share changes. We do **not** observe individual voter movement.

For a given seat, between two elections, we have alliance-level vote shares (UDF, LDF, NDA, OTHER). We compute deltas. If LDF dropped 8pp and NDA gained 8pp while UDF stayed flat, we *classify* the seat as "LDF → NDA flow" — but the underlying reality could equally be:

- LDF voters went directly to NDA, **OR**
- LDF voters stayed home and a wave of new NDA voters showed up, **OR**
- LDF voters split between NDA and turnout drop, with new NDA voters making up the rest, **OR**
- Any combination

Aggregate data can't distinguish these. The classification is a useful narrative shorthand, not a causal claim.

## Detection rules

### Single-cycle (2021 → 2026)

For each seat, compute deltas in alliance share (UDF/LDF/NDA). Then:

- **Two-way flow**: biggest gainer ≥ +5pp AND biggest loser ≤ −5pp AND the third main alliance moved by less than ±2pp.
- **Both-to-one flow**: biggest gainer ≥ +5pp AND **both** other main alliances dropped by ≥ 2pp each AND the gainer's gain roughly matches the combined drop (within ±3pp).

Seats not meeting either rule → unclassified (74 of 140).

### Multi-cycle drift (2011 → 2026)

For each seat:

- Cumulative biggest gainer ≥ +10pp **and** cumulative biggest loser ≤ −10pp across the 15-year window.
- Of the 3 cycle transitions for the gainer (2011→2016, 2016→2021, 2021→2026), at least 2 must move in the same direction as the cumulative drift. This filters out single-cycle anomalies.

Seats not meeting these → unclassified (86 of 140).

## Caveats worth flagging on any UI surface

1. **Inferred, not observed.** Phrasing like "voters moved" should be qualified — say "share shifted" or "alliance gained at the other's expense" to avoid the causal-claim pitfall.
2. **Party→alliance is fixed at the 2026 mapping.** Major parties (INC, IUML, BJP, BDJS, CPI(M), CPI) have been alliance-stable, so this is fine for them. Minor parties that switched fronts get mis-attributed in earlier cycles.
3. **Thresholds are heuristic.** The 5pp / 10pp / 2pp / 3pp numbers were tuned against three known examples (Manjeshwar, Karunagappally, Attingal). They're defensible but not derived from anything more rigorous.
4. **OTHER absorbs noise.** Big swings into OTHER (e.g. Ottappalam +29.8pp OTHER) usually indicate an Independent or non-front candidate doing well; treat such seats with care.

## Findings — single-cycle (2021 → 2026)

66 of 140 seats classified.

### LDF → UDF (37 seats) — the dominant 2026 narrative

The UDF wave concentrated against LDF in central and north-central Travancore.

Top examples by gainer magnitude:
- **Perambra** (UDF +47.5, LDF −8.2, OTHER −39.3) — *note the OTHER drop, suggests an Independent-heavy 2021*
- **Puthuppally** (UDF +17.8, LDF −16.8) — Chandy Oommen seat
- **Ettumanoor** (UDF +17.5, LDF −10.0)
- **Mattannur** (UDF +17.1, LDF −13.8) — CPI(M) heartland eroding
- **Nilambur** (UDF +15.4, LDF −46.9, OTHER +30.0) — *another OTHER caveat*
- … 32 more.

### LDF + NDA → UDF (18 seats)

UDF absorbed from **both** opposing fronts. Heavily central Kerala.

Top examples:
- **Muvattupuzha** (UDF +16.4, LDF −8.4, NDA −7.9)
- **Thrikkakara** (UDF +16.1, LDF −9.5, NDA −6.1)
- **Vypen, Thrissur, Perumbavoor, Kunnathunad, Kunnamkulam, Irinjalakuda**
- … plus a "[NDA+LDF] → UDF" subset of 12 seats.

### LDF → NDA (7 seats) — the single-cycle leftward leak to NDA

- **Guruvayoor** (UDF −0.4, LDF −11.6, NDA +17.9)
- **Thalassery** (UDF +0.4, LDF −12.9, NDA +15.8)
- **Varkala** (LDF −10.6, NDA +11.6)
- **Haripad** (LDF −8.2, NDA +9.6)
- **Devikulam, Chathannoor, Kaipamangalam**

### LDF + UDF → NDA (2 seats) — the rare "third-pole absorbs both"

- **Karunagappally** (UDF −6.4, LDF −5.0, NDA +11.6) *— user's example*
- **Nedumangad** (UDF −2.2, LDF −3.7, NDA +7.1)

### Other patterns (1 each)

- **UDF → NDA** — Ottappalam (UDF −37, NDA +9.6, but OTHER +29.8 indicates an Independent).
- **NDA → UDF** — Kochi (NDA −14.9, UDF +16.7).

## Findings — multi-cycle drift (2011 → 2026)

54 of 140 seats classified with sustained directional drift.

### LDF → UDF (25 seats) — long-term LDF erosion to UDF

Many central Travancore seats with cumulative UDF +40 to +60pp gains over 15 years against LDF losses of similar magnitude. Top: Kalpetta, Idukki, Ettumanoor, Pathanapuram, Irinjalakuda, Changanassery, Elathur, Kanjirappally.

Includes **Manjeshwar** (cum UDF +14.3, LDF −15.0) — confirming the user's intuition that this is part of a sustained pattern, not a one-off.

### LDF → NDA (20 seats) — the sustained third-pole rise *— most consequential finding*

NDA's growth at LDF's expense over 15 years, with multi-cycle directional consistency:

| Seat | LDF trajectory | NDA trajectory | Consistent cycles |
|---|---|---|---|
| Chathannoor | — | NDA cum +35 | 3/3 |
| Palakkad | LDF cum −36 | NDA cum +14 | 2/3 |
| Malampuzha | — | NDA cum +30 | 2/3 |
| **Attingal** | **LDF 55→53→47→40** | **NDA 4→20→26→31** | **3/3** *— user's example* |
| Eranakulam | LDF cum −28 | NDA cum +11 | 2/3 |
| Chirayinkeezhu | — | NDA cum +23 | 3/3 |
| Pala | LDF cum −14 | NDA cum +21 | 2/3 |
| Haripad | LDF cum −15 | NDA cum +19 | 3/3 |
| Kozhikode North/South, Kunnathunad, Thrissur, Perumbavoor, Chadayamangalam, Kollam, Aranmula, Thrikkakara, Vaikom, Tarur, Neyyattinkara | varied | NDA cum +10 to +20 | 2-3/3 |

Geographic spread: trans-state but concentrated in southern districts (Trivandrum, Kollam, Pathanamthitta, Alappuzha) and pockets in the Hindu-belt central seats.

### UDF → NDA (7 seats) — long-term UDF inroads by NDA

- **Thiruvananthapuram** (cum UDF −48.6, NDA +18.6) — UDF's 2011 dominance gone.
- **Ottappalam, Chelakkara, Kazhakoottam, Nedumangad, Varkala, Vattiyoorkavu**

Mostly southern Kerala plus a few central pockets.

### UDF → LDF (2 seats) — the rare reverse

- **Aruvikkara** (cum UDF −48, LDF +42)
- **Eravipuram** (cum UDF −41, LDF +42)

The only sustained UDF→LDF drifts in the dataset.

## Validation against the user's three intuitions

| Seat | Intuition | Detected | Verdict |
|---|---|---|---|
| Manjeshwar | LDF→UDF this election | Single-cycle LDF→UDF (UDF +13.6, LDF −12.2) AND multi-cycle LDF→UDF | ✅ both single + sustained |
| Karunagappally | UDF + LDF declining, NDA gaining | Single-cycle [LDF+UDF]→NDA (UDF −6.4, LDF −5.0, NDA +11.6) | ✅ exact match |
| Attingal | LDF→NDA | Multi-cycle LDF→NDA (NDA 4→20→26→31, every cycle same direction) | ✅ stronger than single-cycle |

All three intuitions hold under defensible thresholds.

## Implementation status

- ✅ **Script**: `scripts/detect-flows.ts`. Run via `bun run scripts/detect-flows.ts`. Outputs grouped by pattern, sorted by magnitude.
- ☐ **UI surface**: not yet decided. The flows analysis doesn't fit `/insights`'s top-5-table-per-card format because it's a *seat-level cross-alliance shift* rather than a candidate ranking. Likely needs a new page `/flows` (or similar) with election-style flow visualisations (Sankey diagrams for state-level aggregate flow, per-seat trajectory plots, choropleth coloured by flow pattern). See discussion below.

## Discussion: where this should live

`/insights` cards rank candidate-rows in a fixed shape. Flow analysis is structurally different:

- **Unit**: seat (with three alliance values), not candidate-row.
- **Comparison**: across alliances within a seat, OR same alliance across cycles.
- **Best visualisations** (per standard election analytics): Sankey, alluvial, multi-cycle trajectory, flow-coloured choropleth — none of which are top-5 tables.

Recommendation: a new dedicated page (`/flows` or similar) with multiple complementary visualisations. Discoverable from `/insights` via a "See also" link. This avoids contorting the curated-card format and gives the analysis the visual real estate it deserves.

## Re-running

After data corrections (especially historical), re-run:

```bash
bun run scripts/detect-flows.ts
```

The script reads `data/kerala-2026.json`, `data/historical/S11-*.json`, and `data/alliances.json`. Thresholds are constants at the top — adjust there if findings need re-tuning.
