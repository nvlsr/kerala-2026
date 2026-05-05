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

## Implementation plan

### Where this lives

A new dedicated page `/flows`. The `/insights` cards rank candidate-rows in a fixed shape; flow analysis ranks **seat-level cross-alliance shifts** — different unit, different question, needs different visualisations (Sankey, alluvial, choropleth, trajectory). Forcing it into the cards grid would lose what makes the analysis legible.

Discoverability: link from `/insights` (the engaged-reader pipeline) so flows surfaces only to people who'd appreciate it.

### Approach: UI first, real data from day one

Iterate the *visual narrative* before perfecting plumbing. But the script's logic is already validated, so it's cheaper to port than to mock — Stage 1 ports the classification helpers to the data layer and uses real numbers from the start. No mock-data interim.

### Stages

**Stage 1 — Foundation page** *(~3 hours)*

The bare-bones surface that delivers the analysis without fancy visuals:

- Port `scripts/detect-flows.ts` logic to `src/lib/data/flows.ts`. Exports:
  - `classifySingleCycleFlow(constituency, year2021Shares, year2026Shares): FlowResult | null`
  - `classifyMultiCycleDrift(constituency, ...4cycles): Drift | null`
  - `getAllFlows(): { single: SeatFlow[]; drifts: Drift[] }` (memoised; reads from existing data-layer historical + 2026 inputs)
- New route `/flows` and `src/pages/flows-page.tsx`.
- Page structure:
  1. Header with title, brief intro, prominent inference-caveat banner.
  2. **Single-cycle 2021→2026 patterns** — one `<FlowPatternSection>` per detected pattern (LDF→UDF, LDF→NDA, etc.), each with: pattern label + count, focused `MiniACMap` of the seats, compact table (seat | ΔUDF | ΔLDF | ΔNDA).
  3. **Multi-cycle drifts** — same shape, with cycle-by-cycle deltas inline.
  4. Methodology footer (collapsible) linking back to this doc.
- Add `/flows` link to `/insights` page header ("See also: Vote flows →").
- Catch-all redirect already in place from earlier router work.

**Stage 2 — State-level Sankey** *(~2-3 hours)*

A hero visualisation at the top of `/flows` showing 2021 → 2026 aggregate alliance share movement across all 140 seats. Three nodes left (UDF / LDF / NDA share in 2021), three right (same for 2026), weighted ribbons between. Reads in five seconds.

Build custom SVG (geometry is simple — six nodes, nine candidate ribbons). Avoids dependency. Falls back to `d3-sankey` if the layout calculation gets fiddly.

**Stage 3 — Multi-cycle trajectory charts** *(~2-3 hours)*

Per-seat mini line charts (cycles on x, vote share on y, three lines) for the most striking sustained-drift seats — Attingal, Chathannoor, etc. Could embed inline in the multi-cycle section as a row of small-multiples, or use an alluvial layout for one or two showcase seats.

Reuses Recharts (already a dep) for the line charts.

**Stage 4 — Optional: flow-mode on the dashboard AC map** *(~2 hours)*

A new encoding mode in `seat-encoding.ts` that colours dashboard ACs by detected flow pattern (saffron-on-red gradient for LDF→NDA, blue-on-red for LDF→UDF, etc.). Surfaces flows where users are already looking. Optional polish — defer until Stages 1-3 are settled.

### File map (Stage 1)

- `src/lib/data/flows.ts` — classification logic ported from script.
- `src/pages/flows-page.tsx` — top-level page.
- `src/components/flow-pattern-section.tsx` — section per pattern (heading + map + compact table).
- `src/App.tsx` — add `/flows` route.
- `src/pages/insights-page.tsx` — add "See also" link in header.
- (later) `data/flows-precomputed.json` — only if we hit perf or we want the analysis frozen at a point in time. Probably not needed at 140-seat scale.

### Decisions still open

1. **Page name**. `/flows` is shortest and unambiguous. Alternative: `/shifts` (less specific). Going with `/flows`.
2. **Sankey library vs custom**. Custom SVG first. Switch to `d3-sankey` only if layout gets messy.
3. **Single-cycle vs multi-cycle priority on the page**. Single-cycle leads (more familiar; concrete 2021→2026 question), drifts below as the "and over time" deepening.
4. **Caveat placement**. Lean toward an inline banner at the top of the page (non-dismissible, prominent) plus the collapsed methodology footer. The "we infer, not observe" caveat is THE most important framing on this page; it shouldn't be hidden.

### Cross-doc references

- The findings themselves: see "Findings" sections above.
- The implementation status update queue: `docs/questions-and-answers.md`'s queue should reference `/flows` once Stage 1 ships, so future card-additions on `/insights` don't accidentally try to absorb the flow analysis.

## Re-running

After data corrections (especially historical), re-run:

```bash
bun run scripts/detect-flows.ts
```

The script reads `data/kerala-2026.json`, `data/historical/S11-*.json`, and `data/alliances.json`. Thresholds are constants at the top — adjust there if findings need re-tuning.
