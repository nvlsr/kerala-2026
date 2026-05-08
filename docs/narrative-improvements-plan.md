# Narrative-cards improvements plan

**Status:** in flight (3 sessions). Last updated 2026-05-07.

## Context

Six narrative cards landed in `docs/narrative-cards/` (A1, A2, A3, A6, A8, B3+B4). External analytical review surfaced three structural issues plus a unified-thesis suggestion:

1. **Inference discipline** — prose sometimes overstates (e.g., "Christian voters shifted") what the data shows ("Christian-heavy constituencies swung"). Ecological-fallacy caveats in methodology don't redeem causal language in body prose.
2. **Regional controls absent** — Pearson correlations have no district / region fixed effects. Christian-share signal in A1 could partly be Central-Kerala-region clustering. Nair-share signal in B3+B4 could be Trivandrum-region clustering. Untested.
3. **KC(M) alliance-relabel risk in A1+A8** — KC(M) was LDF in 2021, UDF in 2026. Christian-heavy ACs (where KC(M) is strong) inherit a mechanical UDF gain from this realignment that isn't voter switching. Not a falsification, but the mechanism splits into "alliance bookkeeping + behavioral consolidation" rather than a single behavioral story.

Agreed corrective thesis (synthesizes A1, A3, A6, A8): **Kerala 2026 was not one wave but three overlapping patterns — a broad anti-LDF swing, a Central-Kerala UDF coalition-share surge, and a geographically concentrated BJP advance in southern/high-Hindu pockets. Press post-mortems collapse these into one "minority consolidation" story.**

Sequencing principle: **methodology first, prose second, new content third** — because regression and KC(M) results may change what the prose needs to say.

---

## Session 1 — Methodology hardening (analysis only, no prose changes) ✓ COMPLETE

Goal: find out which findings survive controls and quantify the KC(M) effect.

- [x] **Built `scripts/narrative-regression.py`** — OLS with district FE and region FE controls (Python instead of TypeScript; numpy-only, no scipy/statsmodels needed).
- [x] **Built `scripts/narrative-a1-no-kcm.py`** — KC(M)-isolated A1 rerun.
- [x] **Captured results in `docs/narrative-improvements-notes-session1.md`** — full regression tables and decision points.

**Findings that triggered:**
- **A1 Christian effect SURVIVES district FE** (+0.225 → +0.194, p=0.008). Strengthens, not collapses. Within-district Christian variation predicts UDF gain robustly.
- **A1 Muslim effect collapses with district FE** (β=+0.016, p=0.795). Strengthens A1's "Muslim share doesn't matter" framing — the within-district test is the clean test.
- **A1 LDF × Christian collapses with district FE** (β=+0.001, p=0.993). Was a between-district artifact. Soften that framing.
- **A3 BJP × Hindu gradient weakens with district FE** (p drifts 0.012 → 0.213). The 3 specific wins are still descriptively in Hindu-heavy seats, but "BJP grew more in Hindu-heavy seats" as a gradient doesn't hold robustly.
- **A3 NDA × Hindu collapses with even region FE** (p 0.031 → 0.301). Drop the gradient framing.
- **B3+B4 Nair × UDF Δ barely survives region FE** (β=-0.272, p=0.044). Demote to exploratory per plan.
- **B3+B4 Nair × NDA Δ doesn't hold** (p 0.114 → 0.562 with region FE). Drop or qualify heavily.
- **KC(M) was LDF in BOTH cycles** — agent's relabel concern was based on the 2016→2020 switch, not 2021→2026. No relabel artifact.
- **~12% of A1's Christian-belt premium is mechanical KC(M) accounting**, ~88% is non-KC(M). Footnote-sized caveat.

---

## Session 2 — Prose tightening + reframing + synthesis card

Goal: incorporate Session 1 findings into the cards, fix language across the board, add the unified thesis.

- [ ] **Add a "What this directly shows / What it does NOT prove" section** to every card (A1, A2, A3, A6, A8, B3+B4). Format:
  - "What this directly shows" — the constituency-level pattern observed, in inference-disciplined language.
  - "What it does NOT prove" — voter-level claims, mechanism causality, sub-community effects, etc.
  - "What would weaken this conclusion" — falsification triggers (booth-level surveys, sub-community geography, multi-cycle 2031 confirmation, etc.).

- [ ] **Single-pass language edit** across all 6 cards:
  - Replace "Christian voters shifted" → "Christian-heavy constituencies swung"
  - Replace "no Muslim consolidation" → "Muslim-share variation does not explain differential UDF swing"
  - Replace "falsified" / "wrong" / "collapses" with confidence-gradient language: "consistent with" / "limited evidence for" / "we do not detect"
  - Replace "minister-targeting was wrong" → "we do not detect a constituency-level minister penalty beyond the statewide anti-incumbency swing" (A6)
  - Add the constituency-as-unit disclaimer to each: "Unless otherwise noted, bin means and correlations are constituency-equal: each AC counts once. Statewide aggregate vote-share figures are vote-weighted."

- [ ] **Add KC(M) caveat to A1 + A8** with the magnitude from Session 1's KC(M)-stripped rerun. A1 gets a methodology paragraph; A8 gets a one-paragraph note in the cross-references section.

- [ ] **Demote B3+B4** to exploratory framing:
  - Retitle: "B3+B4 — district caste-belt geography overlaps with alliance geography (exploratory)"
  - Reframe verdict: "we do not test caste effects at AC granularity (data is district-level)" — switch from voter-behavior claim to geography-overlap observation.
  - Add "EXPLORATORY" badge in the verdict line.

- [ ] **Update each card with regression-control results** from Session 1:
  - A1: add a "with district fixed effects" subsection in the methodology block; report the controlled Christian coefficient.
  - B3+B4: definitively demote to exploratory based on FE results.
  - A2/A6/A8: probably unchanged (small-N treatment-control comparisons aren't materially affected by FE), but add a note confirming.
  - A3: add FE results for the BJP-share growth claim.

- [ ] **Write the synthesis card** `docs/narrative-cards/synthesis-three-patterns.md`:
  - Top-level claim: "Three overlapping patterns: anti-LDF swing + Central-Kerala UDF coalition surge + BJP geographic pocket."
  - Cite each as a chapter (A1, A6 → wave; A1, A8 → Central-Kerala; A3 → BJP pocket).
  - Closing: how the press post-mortems conflate the three.

---

## Session 3 — BJP AC-level growth card

Goal: write the most-original analytical card we have, surfacing the +0.18pp aggregate hiding ±25pp AC-level moves.

- [ ] **Write `scripts/narrative-bjp-ac-growth.ts`** — extend the A3 analysis to fully explore BJP's per-AC growth distribution.
  - Top 20 BJP party-share gainers (already have top 12).
  - Bottom 20 BJP party-share losers (mostly ACs ceded to NDA allies).
  - Cross-tab with religion mix: where did BJP grow and shrink, by Hindu/Christian/Muslim profile?
  - Cross-tab with prior-cycle 2016/2011 BJP base: was 2026 growth concentrated in ACs where BJP had any prior toehold, or did it appear from zero?

- [ ] **Write `docs/narrative-cards/bjp-ac-growth.md`** with the structure the agent recommended (lead with hook, unpack):
  - Hook: "BJP grew +0.18pp statewide. The same number moved by ±25pp at the AC level. Both are true."
  - Geography of growth.
  - Geography of cession.
  - Why it cancels in aggregate.
  - 2031 falsification triggers (especially: P.C. George/Poonjar — is the +25pp durable or candidate-specific? Test by checking if BJP holds 20%+ in Poonjar in 2031 with a different candidate.).

- [ ] **Cross-link** the card from A3 + the synthesis card.

---

## Out of scope (deferred)

- **Visualizations** — scatterplots, swing maps, residual plots, concentration maps would substantially strengthen the work but require building chart components and editorial selection. Defer until the analytical foundation is hardened.
- **A4 (FCRA), A5 (Twenty20), A7 (Munambam)** — testable but lower priority than tightening existing cards. Consider after Session 3.
- **Vote-weighted alternative analyses** — answers a different question than constituency-equal (population-preference shift vs seat-conversion pattern). Not strictly needed; just label units clearly.
- **Sub-community religion data** (Latin vs Syro-Malabar Christian; Sunni vs Mujahid Muslim) — would unlock A4, A7 fully and sharpen A1. Hand-coded denomination geography is laborious.

## References

- Master narrative catalog: `docs/narratives.md`
- External feedback: this conversation's history (May 2026 review pass)
- Existing scripts: `scripts/narrative-a*.ts`, `scripts/narrative-b3b4-caste.ts`
- Existing cards: `docs/narrative-cards/{a1, a2, a3, a6, a8, b3b4}.md`

## Progress log

- 2026-05-07: Plan created.
- 2026-05-07: **Session 1 complete.** Built regression and KC(M)-isolation Python scripts. Captured numbers in `docs/narrative-improvements-notes-session1.md`. Headline result: A1 strengthens, B3+B4 confirmed weak, A3 gradient claim weakens, KC(M) relabel concern is moot but base-defection is a real ~12% sub-mechanism. Sessions 2-3 still pending.
