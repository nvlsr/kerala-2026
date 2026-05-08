# Future investigations

Open analytical threads identified during catalog construction or page-review iterations that are worth picking up but aren't blocking current publishing work. Each item names what's missing, why it might matter, and the data we'd need to make progress.

---

## F1 — Religious-composition shape of BJP's Trivandrum cluster

**Question.** The 3 BJP wins (Nemom, Chathannoor, Kazhakoottam) sit in 65-72% Hindu seats whose non-Hindu portion is *Hindu + Muslim*, not *Hindu + Christian* — different from Pala / Thiruvalla / Kanjirappally where BJP also gained but didn't win. Does the *shape* of the religious mix (H+M vs H+C vs H,C,M) predict BJP outcomes independently of Hindu share alone?

**Why it might matter.** The current Arc-3 cluster claim says: "BJP won where Hindu share was high *and* something else." We've narrowed the "something else" to "we can't tell from AC-level data." A composition-shape analysis might recover signal that simple Hindu-share regressions miss. Specifically: in three-way contests, UDF performance against NDA may depend on whether the second-largest community is Muslim (where IUML is strong and UDF leans on coalition turnout) or Christian (where the church-political dynamics differ).

**What we'd need.**
- AC-level religion shares for all three communities (already have via `data/ac-demographics-2025.json`).
- A binning scheme: `H+M` (≥30% Muslim, <15% Christian), `H+C` (≥30% Christian, <15% Muslim), `H,C,M` (mixed), `H-only` (<15% of each).
- Per-bin BJP Δshare and UDF Δshare means; check whether the 3-wins cluster sits in a distinctive bin.
- Robustness: district fixed effects (knowing district FE will absorb most variation, but the within-district contrast may still be visible).

**Hypothesis to test.** BJP performs better in H+M than in H+C or H,C,M, holding Hindu share constant. UDF performs better in H+C than in H+M, also holding Hindu share constant.

**Why it's deferred.** The current page can stand without this — the cluster claim is descriptively defensible. But a composition-shape analysis would be a real refinement, and it's a feasible follow-up card.

---

## F2 — Region-level (vs district-level) cuts of BJP's 3-bucket strategy

**Question.** The Arc-3 page now slices BJP's gains/withdrawals/shrinkages by *district*, identifying 3 archetypes: push (Trivandrum, Kannur), swap (Kottayam, Kollam), retreat (Ernakulam, Thrissur, Pathanamthitta, Idukki). District boundaries are administratively-defined, not strategically-defined. Does a *region-level* cut (e.g. South / Central / North Kerala, or coastal / midland / hill, or Travancore / Cochin / Malabar) reveal a cleaner strategic shape?

**Why it might matter.** District is an arbitrary unit for political analysis. The strategic logic — where to push, where to swap, where to retreat — likely follows political-geographic boundaries (cultural-linguistic regions, historical administrative divisions, or campaign-organisational zones), not modern district lines. The district archetypes we surface may be artefacts of where district boundaries happen to fall vs the underlying strategic logic.

**What we'd need.**
- A region taxonomy (or several to compare):
  - **Travancore / Cochin / Malabar** (historical kingdoms, durable political identity)
  - **South / Central / North** (latitude bands)
  - **Coastal / Midland / Hill** (geographic zones)
  - Or: **NDA-strong / mixed / NDA-weak** belts (data-driven, not pre-imposed).
- Per-region: bucket-1 sums, bucket-2a sums, bucket-2b sums, plus T20-vs-BDJS substitution split.
- Cross-tab the archetypes against districts to see which framing has cleaner explanatory power.

**Hypothesis to test.** South Kerala (or Travancore) is the push region; central Kerala is the swap region; Malabar is mixed. The district-level archetypes may cluster within regions (e.g. Trivandrum + Kollam push and swap = "South push-and-swap"; Ernakulam + Thrissur retreat = "Cochin retreat").

**Why it's deferred.** The current Arc-3 page works at the district level because the chart we have is district-binned. A region cut would need recomputation and possibly a new chart. Worth doing if the district-archetype framing holds up under scrutiny but feels coarse.

---

## How to pick these up

Each item is scoped as a follow-up narrative card. The discipline:

1. Reproduce the analysis as a Python script under `scripts/`.
2. Write a card under `docs/narrative-cards/` with: claim, evidence, what-it-shows, what-it-doesn't-show, what-would-weaken.
3. Surface findings on the relevant arc page only after the card is written and the source-discipline is verified.

If a third or fourth investigation surfaces during ongoing review, append here with the same structure.
