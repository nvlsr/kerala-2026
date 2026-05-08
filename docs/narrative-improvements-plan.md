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

## Session 2 — Prose tightening + reframing + synthesis card ✓ COMPLETE

Goal: incorporate Session 1 findings into the cards, fix language across the board, add the unified thesis.

- [x] **Added "What this directly shows / What it does NOT prove / What would weaken this conclusion" sections** to all 6 cards.
- [x] **Single-pass language edit** across all 6 cards: inference-discipline phrasing, confidence gradients, "we do not detect" replaces "falsified" where appropriate, constituency-as-unit disclaimers added.
- [x] **KC(M) caveat added to A1 + A8** with Session-1 magnitudes (~88% non-KC(M), ~12% KC(M)-mechanical).
- [x] **B3+B4 demoted to exploratory.** Retitled "district-level Hindu caste-belt geography overlaps with alliance geography (exploratory)". Verdict reframed to geography-overlap rather than voter-behavior claim.
- [x] **Regression results integrated:**
  - A1: full FE table added showing Christian effect surviving district FE (β=+0.194, p=0.008) and Muslim effect collapsing.
  - A3: gradient claim softened with district FE result (p=0.213).
  - B3+B4: region-FE table shows Nair × UDF Δ barely surviving (p=0.044).
  - A2, A6, A8: no FE test required (treatment-control / descriptive); language tightened.
- [x] **Synthesis card written** at `docs/narrative-cards/synthesis-three-patterns.md`. Three-patterns spine: anti-LDF wave (A1/A2/A6) + Central-Kerala UDF surge (A1/A8) + BJP geographic pocket (A3/B3+B4).

---

## Session 3 — BJP AC-level growth card ✓ COMPLETE

Goal: write the most-original analytical card we have, surfacing the +0.18pp aggregate hiding ±25pp AC-level moves.

- [x] **Built `scripts/narrative-bjp-ac-growth.py`** — 10-section analysis: statewide aggregate, distribution stats, top 20 gainers, top 20 losers/cessions, fielding patterns (26 cessions, 89 fielded both, 9 new entries), district-level reshuffle table, religion-bin cross-tab, 2016 prior-toehold check, net pp movement, NDA absorption check on cessions.
- [x] **Wrote `docs/narrative-cards/bjp-ac-growth.md`** with hook-first structure: lead with the +0.18pp / ±25pp paradox, unpack geography of growth + cession + aggregate cancellation + 2031 falsification triggers (especially P.C. George/Poonjar candidate-personality test).
- [x] **Cross-linked** from A3 and the synthesis card. Updated synthesis Pattern-3 section to incorporate the broader reshuffle finding.

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
- 2026-05-07: **Session 1 complete.** Built regression and KC(M)-isolation Python scripts. Captured numbers in `docs/narrative-improvements-notes-session1.md`. Headline result: A1 strengthens, B3+B4 confirmed weak, A3 gradient claim weakens, KC(M) relabel concern is moot but base-defection is a real ~12% sub-mechanism.
- 2026-05-07: **Session 2 complete.** All 6 existing cards updated: inference-discipline language, confidence gradients, regression FE results integrated, KC(M) caveat in A1 + A8, B3+B4 demoted to exploratory framing, "What this directly shows / cannot prove / would weaken" sections added everywhere. Synthesis card written.
- 2026-05-07: **Session 3 complete.** Built `scripts/narrative-bjp-ac-growth.py` (10-section analysis) and wrote `docs/narrative-cards/bjp-ac-growth.md` with hook-first structure. Cross-linked from A3 and synthesis card. **Full plan executed.** Catalog now has 8 cards (A1, A2, A3, A6, A8, B3+B4, synthesis, BJP AC-growth) + 1 working notes file + 4 analysis scripts (3 TS, 4 Python).
