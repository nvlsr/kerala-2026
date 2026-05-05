# Historical data — audit clean

As of 2026-05-04, all known issues are resolved:

- ✅ 0 null `votePct`
- ✅ 0 null `marginPct` (where `margin` is set)
- ✅ 0 null `turnout`
- ✅ 0 margin mismatches >1000 votes
- ✅ 0 alliance-as-party placeholder rows

## Sub-party identity notes

A few candidates ran as alliance-backed Independents. To preserve their alliance identity in our 2026-anchored mapping, they're stored with these conventional party labels (added to `partyToAlliance`):

- `"Independent (LDF)"` → routes to LDF
- `"Independent (UDF)"` → routes to UDF
- `"Independent (NDA)"` → routes to NDA
- `"National Secular Conference"` → LDF (P. T. A. Rahim's party, founded 2011)
- `"Nationalist Congress Kerala"` → UDF (small UDF ally — Sulfikar Mayoori 2021 Elathur)

A. K. Saseendran's historical NCP candidacies (Elathur 2011/2016/2021) are stored as `"Nationalist Congress Party - Sharadchandra Pawar"` to honor the 2026-anchor convention — his 2026 party after the NCP split — so that he correctly routes to LDF across all cycles.

## Limitations / caveats

- **2016 Tirur Gafoor P. Lillis** — sources disagree (NSC vs CPI(M)). Stored as `Independent (LDF)` for safety.
- **2021 Devikulam Ganesan S.** — original NDA candidate's nomination was rejected; he ran as Independent. Stored as `Independent (NDA)`. The actual NDA-supported candidate that cycle was AIADMK.
- **2016 Ernad runner-up "Abdurahiman"** — stored as Communist Party of India based on continuity with 2021's K. T. Abdul Rahiman (CPI). Some sources list the 2016 runner-up as Independent; if you find conflicting evidence, swap to `Independent (LDF)`.

The 2026-anchor footnote (rendered in the alliance section of the UI) explains the broader convention: alliance affiliations are anchored on 2026 composition; parties that switched alliances historically (e.g. KEC(M) flipped UDF→LDF in 2018) are still attributed to their 2026 alliance.
