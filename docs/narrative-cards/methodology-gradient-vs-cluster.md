# Methodology brief — gradient vs cluster

A short distinction that runs through the catalog: **gradient effects** and **cluster effects** are different statistical phenomena, often confused in election commentary. Making the distinction explicit clarifies what each card claims and what alternatives look like.

## The distinction

A **gradient effect** says: *as variable X increases, outcome Y changes systematically.* The relationship is monotonic across the full range of X. The key test is correlation or regression coefficient: does β_X stay non-zero (with appropriate controls)?

A **cluster effect** says: *outcomes are concentrated in a specific subset of cases that share some property (geographic, demographic, structural).* The relationship doesn't have to be monotonic. The key test is whether the subset is descriptively distinguishable, regardless of whether a smooth gradient exists.

These are *different statistical phenomena*. A finding can be a gradient without a cluster (smooth correlation, no concentration), a cluster without a gradient (concentrated subset, no monotonic relationship), both, or neither.

## Examples from this catalog

| Finding | Gradient? | Cluster? |
|---|---|---|
| **A1**: Christian-heavy ACs swung more to UDF | **Yes** (β=+0.19, p=0.008 with district FE; the Christian-share gradient is monotonic) | Partial (Central Kerala has both Christian-heavy ACs *and* the strongest UDF swings, so the gradient appears partly clustered) |
| **A1**: Muslim-heavy ACs swung more to UDF | **No** (β collapses with district FE — Muslim share doesn't predict swing variation within-district) | Partial (Muslim-majority ACs *did* swing to UDF, but they're a structurally consolidated bloc; their swing magnitude doesn't vary monotonically with Muslim share) |
| **A3**: BJP wins concentrated in Hindu-heavy seats | Weak (gradient claim collapses to p=0.213 with district FE) | **Yes** (3 wins in 3 Hindu-heavy ACs, mean 70% Hindu vs 53% statewide; geographically clustered in Trivandrum) |
| **B3+B4**: Nair-share negatively associated with UDF Δ | Weak (β=-0.272, p=0.044 with region FE only; district FE absorbs caste perfectly) | **Yes** (Trivandrum-region cluster shows lower UDF Δ; the Nair-Trivandrum-NDA geography overlaps) |
| **bjp-ac-growth**: BJP grew +14-25pp in central-Kerala mixed-religion ACs | No gradient (no smooth Hindu-share or Christian-share predictor) | **Yes** (cluster of ~11 ACs with major gains; mostly contest-entry activations) |
| **A8**: UDF swept Central-5 districts | N/A (descriptive sweep, not a smooth-variable claim) | **Yes** (clear geographic cluster) |
| **A6**: No cabinet-status penalty | No gradient (binary status) | **No cluster** (the 21 ministers don't cluster differently from non-ministers in LDF Δ) |

## Why the distinction matters

**Gradient claims are stronger evidence for a mechanism.** A monotonic Christian-share-vs-UDF-Δ relationship that survives district FE means *within-district* variation in Christian share predicts swing variation — strong evidence that something tied to Christian-share is driving the differential, not just the geographic clustering of Christian-heavy ACs.

**Cluster claims describe a phenomenon without specifying its mechanism.** "BJP's 3 wins are clustered in Trivandrum" is a true descriptive statement; it doesn't tell us *why* they clustered there. Hindu share, Nair concentration, BJP organisational strength, NSS/SNDP politics, government-employee concentration, and three-way fragmentation are all candidate mechanisms — and the cluster framing alone doesn't discriminate among them.

## How the catalog handles each type

For **gradient claims**, we run regression with district / region fixed effects (`scripts/narrative-regression.py`). The within-district β is the test. A coefficient that survives FE → real gradient. A coefficient that collapses → between-district artifact, often a cluster effect masquerading as a gradient.

For **cluster claims**, we describe the subset and test specific hypotheses about *what makes the subset distinctive*. Treatment-control designs (A2, A6) compare cluster ACs to matched non-cluster ACs on candidate explanations. Bin tables (A1's Christian-heavy 30-50% bin) describe the subset and quantify the differential.

## Failure modes

**False gradient** — interpreting a cluster as a gradient. *Example*: pre-FE, A1's Christian-share Pearson r was +0.20. Without controls, this looks like "more Christian = more UDF gain monotonically." District FE shows the gradient is real but smaller (β=+0.19); without FE, we'd have over-claimed magnitude. B3+B4's original framing ("Nair share predicts swing") was a similar over-claim corrected to geography-overlap reading.

**Hidden cluster** — interpreting a gradient as fully smooth. *Example*: BJP's +0.18pp statewide aggregate looks like a uniform smooth shift. The bjp-ac-growth card breaks this by showing the +0.18 is the net of clustered +14-25pp gains and clustered cessions.

**Spurious cluster** — finding a "cluster" that's just a subset of an underlying gradient. *Example*: identifying "the BJP-3-wins" as a special cluster could obscure that they're three points on a noisier Hindu-share gradient. A3's regression test confirms that beyond the 3 wins, the gradient is weak — so calling it a cluster is more accurate than calling it the visible top of a gradient.

## How to read this catalog with the distinction in mind

When a card claims **"X explains the swing in Y direction"**:

- If accompanied by FE-robust regression (β survives controls): treat as gradient claim. Mechanism candidates are constrained.
- If accompanied by treatment-control comparison or bin tables: treat as cluster claim. Mechanism is descriptive; alternative explanations remain in play.
- If accompanied by both: gradient + cluster overlap. The within-cluster gradient (where it survives) is the strongest evidence; the geographic cluster gives the where.

When a card claims **"we do not detect X"**:

- The non-detection is gradient-specific. We can claim "Muslim-share doesn't predict swing variation" (no gradient) without claiming "Muslims didn't move" (which would require voter-level data).
- Cluster non-detection is rarer — usually we observe a subset and check whether it's distinctive; if no, we don't claim a cluster.

## Cross-references

This methodology distinction is most explicit in:
- **A3** — gradient (Hindu share × BJP) weakens; cluster (3 wins in Trivandrum) holds
- **B3+B4** — gradient (Nair share × UDF Δ) barely survives; geography-overlap framing is the honest cluster reading
- **bjp-ac-growth** — no gradient; clear cluster with sub-classification (contest-entry vs organic)
- **A1** — both: Christian gradient + Central-Kerala cluster
- **synthesis-three-patterns.md** — the three patterns are: Pattern 1 is universal (no gradient, no cluster — uniform wave); Pattern 2 is gradient + cluster (Christian gradient AND Central-Kerala cluster); Pattern 3 is cluster only (geographic concentration without gradient)

This is the conceptual scaffolding the catalog has converged on.
