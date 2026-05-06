# Vote flow analysis (2011 → 2026)

Alliance-level vote flow patterns across Kerala's 140 ACs. Split across two pages:

- [`/flows`](https://kerala-2026.jillen.com/flows) — single-cycle shifts (2021 → 2026), with the state-level Sankey hero.
- [`/drifts`](https://kerala-2026.jillen.com/drifts) — sustained 15-year drifts (2011 → 2026). Different time horizon, different question.

The detection script (`scripts/detect-flows.ts`) is the working tool for ad-hoc analysis and threshold tuning; runtime versions of the same logic live in `src/lib/data/flows.ts`.

## Status

| Surface | State |
|---|---|
| `scripts/detect-flows.ts` | ✅ Shipped. CLI tool for ad-hoc analysis. |
| `src/lib/data/flows.ts` | ✅ Shipped. Runtime classification used by both pages. |
| `/flows` page | ✅ Shipped. Single-cycle (2021→2026) shifts only — Sankey hero, pattern cards, focused AC maps. |
| `/drifts` page | ✅ Shipped. Sustained 15-year drift cards (2011→2026), Layer-A observations per card, separated from `/flows` in mid-2026 because the two stories read at different time horizons. |
| Discovery teasers | ✅ Shipped. Homepage→`/insights` (emerald, gift), `/insights`→`/flows` (indigo, key), `/flows`→`/drifts` (amber, history) — each tier rewards more analytic depth. |
| State-level Sankey hero | ✅ Shipped on `/flows`. Custom-SVG, 2021→2026 seat-winner flows. |
| Per-pattern permalinks | ✅ Shipped. `/flows#single-<key>` and `/drifts#drift-<key>`. |
| 4-column Sankey hero on `/drifts` (2011→2016→2021→2026) | ☐ Open / optional polish. Doesn't earn its space until designed properly. |
| Per-seat trajectory mini-charts | ☐ Deferred. The text trajectory ("NDA 3 → 20 → 26 → 31") reads better than charts would; revisit only if it stops working. |
| Flow-mode on dashboard AC map | ☐ Open / optional. |

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
2. **Per-cycle alliance attribution.** Each candidate (2026 + every historical record) carries its own `alliance` field reflecting whichever alliance they ran with that cycle — not anchored to the 2026 mapping. Parties that switched fronts (KC(M) UDF→LDF in 2020, KC(B) UDF→LDF in 2016, RSP LDF→UDF in 2014) are correctly placed in each cycle's alliance. Earlier versions of this analysis used the 2026 party→alliance mapping retroactively and produced different counts; that approach is no longer used anywhere.
3. **Thresholds are heuristic.** The 5pp / 10pp / 2pp / 3pp numbers were tuned against three known examples (Manjeshwar, Karunagappally, Attingal). Defensible but not derived from anything more rigorous.
4. **OTHER absorbs noise.** Big swings into OTHER (e.g. Ottappalam +29.8pp OTHER) usually indicate an Independent or non-front candidate doing well; treat such seats with care.

## Findings (current as of last data refresh)

The full per-seat lists are visible on `/flows`. Headline counts:

| Single-cycle pattern (2021 → 2026) | Seats |
|---|---|
| LDF → UDF | 47 |
| LDF + NDA → UDF | 21 (combined "two-way + both-to-one" subgroups) |
| LDF → NDA | 9 |
| LDF + UDF → NDA | 4 (combined two-way + both-to-one) |
| UDF → NDA | 1 |
| NDA → UDF | 1 |
| **Total classified** | **83 of 140** |

| Multi-cycle drift (2011 → 2026, sustained) | Seats |
|---|---|
| LDF → NDA | 24 *— the sustained third-pole rise* |
| LDF → UDF | 11 |
| UDF → NDA | 7 |
| **Total classified** | **42 of 140** |

The most consequential single finding is **24 seats with sustained LDF → NDA drift over 15 years** — including Attingal (NDA 4 → 20 → 26 → 31 across four cycles), Chathannoor, Malampuzha. Geographically concentrated in southern districts (Kollam, Trivandrum) plus Hindu-belt central pockets (Palakkad, Thrissur, Ernakulam). The southern UDF→NDA seats (Trivandrum + Kottayam Hindu pockets) make a separate but adjacent story.

## Validation against three test intuitions

| Seat | Hypothesis | Detected as | Verdict |
|---|---|---|---|
| Manjeshwar | LDF → UDF in 2026 | Single-cycle LDF→UDF (UDF +13.6, LDF −12.2) AND multi-cycle LDF→UDF | ✅ |
| Karunagappally | LDF + UDF declining, NDA gaining | Single-cycle [LDF+UDF]→NDA (UDF −6.4, LDF −5.0, NDA +11.6) | ✅ |
| Attingal | LDF → NDA | Multi-cycle LDF→NDA (NDA 4→20→26→31, every cycle same direction) | ✅ |

## Remaining stages

### Stage 4 — Flow-mode on the dashboard AC map *(optional)*

A new encoding mode in `seat-encoding.ts` that colours dashboard ACs by detected flow pattern (saffron-on-red gradient for LDF→NDA, blue-on-red for LDF→UDF, etc.). Surfaces flow context where dashboard users are already looking. Pure polish — only worth doing if the dashboard's existing encoding modes feel limiting.

### Stage 3 (deferred) — Per-seat trajectory mini-charts

The original plan was to replace text trajectories ("NDA 3 → 25 → 31 → 38") with mini line charts. After living with the page, the text format works *better* than charts would — it's compact, scannable, and conveys the trend in less vertical space. Skip unless we hit a specific case where the text feels insufficient.

## Re-running the script

After data corrections (especially historical), re-run:

```bash
bun run scripts/detect-flows.ts
```

The script reads `data/kerala-2026.json`, `data/historical/S11-*.json`, and `data/alliances.json`. Thresholds are constants at the top — adjust there if findings need re-tuning. The runtime version (`src/lib/data/flows.ts`) uses the same constants and is regenerated on every page load — no separate update needed.
