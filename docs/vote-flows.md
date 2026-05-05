# Vote flow analysis (2011 → 2026)

Alliance-level vote flow patterns across Kerala's 140 ACs. The page lives at [`/flows`](https://kerala-2026.jillen.com/flows). The detection script (`scripts/detect-flows.ts`) is the working tool for ad-hoc analysis and threshold tuning; runtime versions of the same logic live in `src/lib/data/flows.ts`.

## Status

| Surface | State |
|---|---|
| `scripts/detect-flows.ts` | ✅ Shipped. CLI tool for ad-hoc analysis. |
| `src/lib/data/flows.ts` | ✅ Shipped. Runtime classification used by the page. |
| `/flows` page (Stage 1) | ✅ Shipped. Pattern lists, focused AC maps per pattern, multi-cycle trajectories as text. |
| Discovery link from `/insights` | ✅ Shipped. |
| State-level Sankey hero (Stage 2) | ☐ Open. |
| Per-seat trajectory mini-charts (Stage 3) | ☐ Open. |
| Flow-mode on dashboard AC map (Stage 4) | ☐ Open / optional. |

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

Seats not meeting either rule → unclassified.

### Multi-cycle drift (2011 → 2026)

For each seat:

- Cumulative biggest gainer ≥ +10pp **and** cumulative biggest loser ≤ −10pp across the 15-year window.
- Of the 3 cycle transitions for the gainer (2011→2016, 2016→2021, 2021→2026), at least 2 must move in the same direction as the cumulative drift. This filters out single-cycle anomalies.

Seats not meeting these → unclassified.

## Caveats worth flagging on any UI surface

1. **Inferred, not observed.** Phrasing like "voters moved" should be qualified — say "share shifted" or "alliance gained at the other's expense" to avoid the causal-claim pitfall.
2. **Party→alliance is fixed at the 2026 mapping.** Major parties (INC, IUML, BJP, BDJS, CPI(M), CPI) have been alliance-stable, so this is fine for them. Minor parties that switched fronts get mis-attributed in earlier cycles.
3. **Thresholds are heuristic.** The 5pp / 10pp / 2pp / 3pp numbers were tuned against three known examples (Manjeshwar, Karunagappally, Attingal). Defensible but not derived from anything more rigorous.
4. **OTHER absorbs noise.** Big swings into OTHER (e.g. Ottappalam +29.8pp OTHER) usually indicate an Independent or non-front candidate doing well; treat such seats with care.

## Findings (current as of last data refresh)

The full per-seat lists are visible on `/flows`. Headline counts:

| Single-cycle pattern (2021 → 2026) | Seats |
|---|---|
| LDF → UDF | 37 |
| LDF + NDA → UDF | 18 (combined "two-way + both-to-one" subgroups) |
| LDF → NDA | 7 |
| LDF + UDF → NDA | 2 |
| UDF → NDA | 1 |
| NDA → UDF | 1 |
| **Total classified** | **66 of 140** |

| Multi-cycle drift (2011 → 2026, sustained) | Seats |
|---|---|
| LDF → UDF | 25 |
| LDF → NDA | 20 *— the sustained third-pole rise* |
| UDF → NDA | 7 |
| UDF → LDF | 2 |
| **Total classified** | **54 of 140** |

The most consequential single finding is **20 seats with sustained LDF → NDA drift over 15 years** — including Attingal (NDA 4 → 20 → 26 → 31 across four cycles), Chathannoor, Palakkad, Malampuzha. Geographically concentrated in southern districts plus Hindu-belt central pockets.

## Validation against three test intuitions

| Seat | Hypothesis | Detected as | Verdict |
|---|---|---|---|
| Manjeshwar | LDF → UDF in 2026 | Single-cycle LDF→UDF (UDF +13.6, LDF −12.2) AND multi-cycle LDF→UDF | ✅ |
| Karunagappally | LDF + UDF declining, NDA gaining | Single-cycle [LDF+UDF]→NDA (UDF −6.4, LDF −5.0, NDA +11.6) | ✅ |
| Attingal | LDF → NDA | Multi-cycle LDF→NDA (NDA 4→20→26→31, every cycle same direction) | ✅ |

## Remaining stages

### Stage 2 — State-level Sankey

A hero visualisation at the top of `/flows` showing 2021 → 2026 aggregate alliance share movement across all 140 seats. Three nodes left (UDF / LDF / NDA share in 2021), three right (same for 2026), weighted ribbons between.

Build custom SVG first (six nodes, nine candidate ribbons — geometry is simple). Fall back to `d3-sankey` (~10KB) if layout calculation gets fiddly.

Open: how to compute aggregate flow weight. Two options:
- **By vote share**: aggregate alliance share statewide in each cycle; ribbon width = share retained vs migrated. Cleanest semantically but requires assigning the migration directions consistently.
- **By seat count**: ribbons widths = number of seats showing that flow pattern. Simpler, more honest about what we're actually computing.

Lean seat-count for the first version. Adds visual context to the per-pattern sections below.

### Stage 3 — Per-seat trajectory mini-charts

Replace the text trajectory ("NDA 3 → 25 → 31 → 38") in the multi-cycle drift section with small line charts. Cycles on x, vote share on y, three lines (UDF/LDF/NDA). Use Recharts (already a dep). Most striking for the LDF → NDA section (Attingal, Chathannoor, etc.).

Trade-off: the text format already conveys the trend cleanly and uses no extra space. Charts would be visually richer but might dilute the at-a-glance scannability. Worth doing only if we observe the page in use and find the text format insufficient.

### Stage 4 — Flow-mode on the dashboard AC map *(optional)*

A new encoding mode in `seat-encoding.ts` that colours dashboard ACs by detected flow pattern (saffron-on-red gradient for LDF→NDA, blue-on-red for LDF→UDF, etc.). Surfaces flow context where dashboard users are already looking. Polish — defer until Stage 2-3 are settled.

## Re-running the script

After data corrections (especially historical), re-run:

```bash
bun run scripts/detect-flows.ts
```

The script reads `data/kerala-2026.json`, `data/historical/S11-*.json`, and `data/alliances.json`. Thresholds are constants at the top — adjust there if findings need re-tuning. The runtime version (`src/lib/data/flows.ts`) uses the same constants and is regenerated on every page load — no separate update needed.
