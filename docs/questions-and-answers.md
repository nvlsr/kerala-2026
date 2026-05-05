# Questions and answers — Kerala 2026

Inventory of the analytical questions worth answering with the dashboard, plus a record of which have been turned into curated cards on **`/insights`**. Each question pins down:

- **Unit** — seat / candidate / district / party.
- **Metric** — the dashboard column or aggregate.
- **Filter recipe** — the UI controls that produce the ranked answer.

## Status legend

- ✅ **Live** — has a curated card on `/insights`. Card id in parentheses.
- 🟡 **Open** — the dashboard supports the filter recipe ad-hoc but no curated card exists yet. Easy to add.
- 🔴 **Blocked** — needs a dashboard capability that doesn't exist yet (multi-cycle rendering, district-level cards, derived metrics).

## Conventions

- **Δ share '21** = (party's 2026 vote share) − (party's 2021 vote share) in the same seat. Absolute, in percentage points.
- **Δ margin '21** = (winning margin in 2026) − (winning margin in 2021). For winners, positive Δ margin = won by more this time. For runners-up, positive Δ margin = closed the gap.
- **"Lost"** = the party's candidate did not win the seat in 2026 (came 2nd, 3rd, …).
- **"Won"** = the party's candidate won the seat in 2026.
- "Vote count" deltas are not a UI column. Use Δ share as the swing metric; raw vote count moves with turnout and is not a clean swing signal.

---

## A. Per-party template

Four questions, applied to each featured party. The dashboard answers each one as a single ranked candidate-table:

| # | Question | Filter | Sort | Status |
|---|---|---|---|---|
| **A1** | Where did P grow / lose vote share most? | `party=P, result=all` | `shareDelta` desc / asc | ✅ **Live** for BJP, BDJS, INC, IUML, CPI(M) (10 cards: `bjp-gains`, `bjp-declines`, `bdjs-gains`, `bdjs-declines`, `inc-gains`, `inc-declines`, `iuml-gains`, `iuml-declines`, `cpim-gains`, `cpim-declines`). |
| **A2** | Where did P win, by margin size? | `party=P, result=winners` | `margin` desc / asc | 🟡 **Open** at party level. State-wide variant ✅ live (`closest-2026-contests`, `biggest-2026-blowouts`). |
| **A3** | Where did P lose but close the gap from 2021? | `party=P, result=losers` | `marginDelta` desc | ✅ **Live** at alliance level (`udf-gap-closers`, `ldf-gap-closers`, `nda-gap-closers`). 🟡 **Open** at party level. |
| **A4** | Where did P win but lose ground vs 2021? | `party=P, result=winners` | `marginDelta` asc | ✅ **Live** at alliance level (`udf-at-risk-wins`, `ldf-at-risk-wins`, `nda-at-risk-wins`). 🟡 **Open** at party level. |

---

## B. Per-alliance specifics

Listing the parties as **observed alliance constituents in 2026**, not as predictions.

### NDA — main constituents: BJP, BDJS, 20-20, RPI

- **B1.** BJP's biggest vote-share gainers / droppers — A1 with BJP. ✅ **Live** (`bjp-gains`, `bjp-declines`).
- **B2.** BJP's seats won, by margin size — A2 with BJP. 🟡 **Open**.
- **B3.** BJP's losing seats where it closed the gap — A3 with BJP. ✅ Folded into the alliance-level NDA gap-closers card (`nda-gap-closers`); 🟡 **Open** as a BJP-specific card.
- **B4.** Did BDJS / 20-20 win any seat? `party=Bharath Dharma Jana Sena, result=winners`. 🟡 **Open** (existence-style if zero matches).
- **B5.** Where did NDA come 2nd (not 3rd)? — i.e. where is NDA the runner-up alliance. 🔴 **Blocked**: needs a `result=runners-up` filter rather than the current `losers` (which lumps ranks 2 and 3+).

> **Open question — combined NDA share.** "Where did combined NDA vote share (BJP + BDJS + 20-20 in the same seat) cross 30% / 40%?" 🔴 **Blocked**: the dashboard does not expose alliance-summed vote share at the seat level.

### UDF — main constituents: INC, IUML, KC(M), RSP

- **U1.** INC's biggest gainers / droppers — A1 with INC. ✅ **Live** (`inc-gains`, `inc-declines`).
- **U2.** INC's seats won by smallest margin — A2 asc with INC. 🟡 **Open**.
- **U3.** INC's seats lost where it closed the gap — A3 with INC. ✅ Folded into alliance-level (`udf-gap-closers`); 🟡 **Open** as INC-specific.
- **U4.** IUML's vote-share movement in Malappuram / Kozhikode strongholds. 🟡 **Open**: doable with `district=...&party=Indian Union Muslim League` filter combo on a card. Card not yet added.
- **U5.** KC(M) / RSP — did the smaller UDF parties hold their allotted seats? 🟡 **Open**.

### LDF — main constituents: CPI(M), CPI, JD(S), KC(B), NCP

- **L1.** CPI(M)'s biggest gainers / droppers. ✅ **Live** (`cpim-gains`, `cpim-declines`).
- **L2.** CPI(M) seats lost — symmetry vs U3. ✅ Folded into `ldf-gap-closers`; 🟡 **Open** as CPI(M)-specific.
- **L3.** CPI's smaller footprint — did CPI win or come close in any of its allocated seats? 🟡 **Open**.
- **L4.** Long-time CPI(M) strongholds — seats won by CPI(M) in all four cycles, then check 2026. 🔴 **Blocked**: needs multi-cycle rendering on the card.

---

## C. Cross-alliance / structural questions

- **C1. The closest 2026 contests** — `result=winners, sort=margin asc`. ✅ **Live** (`closest-2026-contests`).
- **C2. The biggest blowouts** — `result=winners, sort=margin desc`. ✅ **Live** (`biggest-2026-blowouts`).
- **C3. Biggest swings 2021→2026** — `result=all, sort=marginDelta desc / asc`. 🟡 **Open**: same shape as the existing margin-movement cards but state-wide (no alliance/party tag). Sign filter handles direction.
- **C4. Alliance flips.** Seats where the winning alliance differs between 2021 and 2026. 🔴 **Blocked**: needs a derived "winning-alliance-changed" filter or a comparison view.
- **C5. Three-way contests.** Seats where #1, #2, #3 are all within ~10pp. 🔴 **Blocked**: derived metric, not currently computed.
- **C6. NDA-as-spoiler.** Seats where NDA's vote-share gain since 2021 is larger than the UDF-LDF margin. 🔴 **Blocked**: derived per-seat metric.
- **C7. Vote-share / seat-share mismatch.** A party gaining state-wide share without a corresponding seat gain. 🔴 **Blocked**: aggregate-level question, not a top-5-seat list.

---

## D. Candidate-level questions

- **D1. Defeated incumbents.** 2021 winners who contested again in 2026 and lost. 🔴 **Blocked**: needs cross-cycle candidate identity matching.
- **D2. Over- / under-performers vs party trend.** Per-candidate Δ share minus state-wide party Δ share. 🔴 **Blocked**: derived column.
- **D3. Independents / smaller parties within 5pp of winning.** Candidate search + `result=losers, sort=margin desc`, then visual scan for non-front parties. 🟡 **Open**: doable as a card, but the rows would mix front parties unless the data layer adds a "minor-party" classification.
- **D4. Plurality winners.** `result=winners, sort=share asc`. 🟡 **Open**: easy add. Striking finding (winners with <40% share — most of the seat voted against them).
- **D5. Highest-vote-share losers.** `result=losers, sort=share desc`. 🟡 **Open**: easy add.

---

## E. Geographic / district questions

- **E1. District-level alliance shift.** Per-district seat tally + Δ share. 🔴 **Blocked** as a card: the curated card format is seat-row-list-based; districts are an aggregate dimension.
- **E2. Districts where NDA crossed 20% combined share.** 🔴 **Blocked**: aggregate (not seat-level), and combined share isn't surfaced.
- **E3. Most volatile districts.** Districts where the same seat changed alliance across 2011→2016→2021→2026. 🔴 **Blocked**: multi-cycle + district aggregate.
- **E4. North vs south Kerala swing direction.** District comparison. 🔴 **Blocked**: aggregate-level.

---

## F. Historical / multi-cycle questions (2011 → 2016 → 2021 → 2026)

All of these need **per-seat history rendering** in the card, which is a substantial component addition.

- **F1. Perpetual swing seats.** Flipped alliance every consecutive election. 🔴 **Blocked**.
- **F2. Four-cycle strongholds.** Same party held all four cycles. 🔴 **Blocked**.
- **F3. Trend reversals.** A 3-cycle direction reversed in 2026. 🔴 **Blocked**.
- **F4. Generational handovers.** Seat held by same party but different candidates over cycles. 🔴 **Blocked**.

---

## G. Narrative checks (one-screen reads)

- **G1.** "BJP gains" insight chip on the dashboard. ✅ Already a chip; ✅ also `bjp-gains` card on `/insights`.
- **G2.** "Closest contests" insight chip. ✅ Already a chip; ✅ also `closest-2026-contests` card.
- **G3.** Anti-incumbency: uniform swing or noisy? Read off the AC map under `sort=marginDelta`. 🟡 **Open** as a card; also visible in the dashboard map.
- **G4.** RELIG mix vs winner alliance correlation. 🔴 **Blocked**: would need a different visual (correlation plot or table) than the snippet card format.

---

## Implementation queue (not-yet-implemented, sorted by ease)

Ordered by what's quickest to ship next.

### Tier 1 — append-only data records

These are already supported by every part of the system (filters, columns, notes, sign filter, theme pills). Each one is a single record in `src/lib/curated-insights.ts`.

1. **Plurality winners** (D4). `result=winners, sort=share:asc, theme=margins`. State-wide. Striking story: where did the winner get less than 40% of the vote? *Single card.*
2. **Highest-vote-share losers** (D5). `result=losers, sort=share:desc`. *Single card.*
3. **State-wide biggest swings** (C3). `result=all, sort=marginDelta:desc/asc, theme=margin-movement`. *Two cards (gainers, droppers).*
4. **Per-party closest wins** (A2 specific). `party=P, result=winners, sort=margin:asc, theme=margins`. *5 cards (BJP, BDJS, INC, IUML, CPI(M)) — each surfaces that party's tightest 2026 wins.*
5. **Per-party at-risk wins** (A4). `party=P, result=winners, sort=marginDelta:asc, theme=margin-movement`. *5 cards.*
6. **Per-party gap-closers** (A3). `party=P, result=losers, sort=marginDelta:desc, theme=margin-movement`. *5 cards.*
7. **BDJS as winners** (B4). `party=Bharath Dharma Jana Sena, result=winners, sort=margin:desc`. Existence-style if BDJS won zero seats.
8. **CPI footprint** (L3). `party=Communist Party of India` ×2 (gains/declines) + `result=winners` for its seat-by-seat performance. *2-3 cards.*
9. **KC(M) / RSP** (U5). One card each on whether they held their allocated seats. *Per smaller UDF party.*
10. **IUML in Malabar** (U4). District-scoped variants — `district=Malappuram` etc. *Card needs to support `district` in the filter preset (already in `Filters` shape, just unused on `/insights`).*

**Tier 1 estimate: ~25 cards. All append-only.**

### Tier 2 — small architectural additions

1. **NDA as runner-up** (B5). Needs a new `result=runners-up` filter value (rank-2-only) instead of the current `losers` (ranks 2-N). One reducer addition + filter rendering update.
2. **D3 Independents / minor parties** within 5pp. Cleaner if the data layer adds a "non-front" classification. Otherwise visible by scanning.
3. **Anti-incumbency** as a card (G3). Conceptual; could be a card whose snippet is a histogram or a state-wide marginDelta scan rather than a top-5 list.

### Tier 3 — needs new components or derived metrics

1. **Multi-cycle questions** (F1-F4, L4). Requires per-seat history rendering on the card — a multi-row sparkline-style snippet would be cleanest.
2. **Alliance flips** (C4). Needs a derived "winning-alliance-changed-vs-2021" boolean per seat.
3. **Defeated incumbents** (D1). Cross-cycle candidate identity matching.
4. **Three-way contests** (C5). Derived "top-3 within 10pp" metric.
5. **NDA-as-spoiler** (C6). Derived "swing > UDF-LDF margin" per seat.
6. **Over/under-performers vs party trend** (D2). Derived per-candidate column.
7. **District-level questions** (E1-E4, plus E2's combined NDA share, plus C7 vote-share/seat-share mismatch). Card format would need to switch from "top-5 seats" to "top-5 districts" (or similar). Probably worth a separate "Geographic" card variant.
8. **RELIG correlation** (G4). Visualisation type unlike a top-5 table.
9. **Combined alliance vote share** (open question in B). Aggregate of party shares per seat.

---

## Notes for follow-up

Things the dashboard doesn't surface natively (yet):

- Alliance-summed vote share at the seat level (NDA total, UDF total, LDF total).
- Δ vote count (raw votes, not share) — depends on turnout normalisation.
- Per-candidate over/under-performance vs party trend — a derived column, not raw data.
- Multi-cycle filter — currently inferred via the per-seat panel.
- `result=runners-up` (rank-2-only) filter — currently `losers` includes all non-winners.
