# Historical data issues

Audit run on 2026-05-04 across all 140 `data/historical/S11-*.json` files.

## Auto-fixed (no manual input)

These will be patched programmatically:

- **Aluva 2021** — replaced with the 8-candidate Wikipedia list you pasted (votes, party labels, computed `votePct`, `margin`, `marginPct`)
- **8 elections** with `marginPct` null but `margin` and `turnout` set: Parassala / Balusseri / Kanhangad / Tirurangadi / Pattambi / Mannarkkad / Aluva / Kaduthuruthy 2021. Computed as `margin / turnout * 100`.
- **`UDF` / `LDF` / `NDA` added to `partyToAlliance`** in `data/alliances.json`. Fixes 27 records across 18 constituencies that had an alliance code in the `party` field — they now correctly aggregate at the alliance level (party-level identity is still imprecise; see the deferred section).
- **31 small margin mismatches** (under 1000 votes) — left as-is. Trusted Wikipedia "margin of victory" stays; the small drift comes from minor candidates that didn't get scraped.

## Need data from you

For each section below, paste the full candidate list from Wikipedia (party + name + votes) and the turnout number. Same format as the Aluva 2021 paste you sent works fine.

### 1. ~~Eravipuram #125 — 2021 general~~ ✅ resolved

Was Lok Sabha data; replaced with Assembly data: M. Noushad (CPI(M)) won by 28,121 over Babu Divakaran (RSP). Full 8-candidate list + 127,241 turnout patched.

### 2. ~~Konni #114 — 2021 general~~ ✅ resolved

Full 6-candidate list patched (added ADHMPI, API, Independent below the top 3). Turnout 149,722; turnoutPct 73.85%.

### 3. ~~Vamanapuram #131 — 2021 general~~ ✅ resolved

10-candidate list patched. Turnout 146,525 (73.27%); margin 10,242 (6.99%).

### 4. ~~Neyyattinkara #140 — 2021 general~~ ✅ resolved

4-candidate list patched (BSP minor candidate added; margin corrected from stored 14,642 to actual 14,262). Turnout 139,291 (74.60%).

### 5. ~~Kunnathunad #84 — 2021 general~~ ✅ resolved

8-candidate list patched (Twenty 20 Party at 27.56% — major third party). Turnout 154,924 (82.54%); margin 2,715 (1.75%).

### 6. ~~Kottayam #97 — 2021 general~~ ✅ resolved

6-candidate list patched. Turnout 121,738 (73.66%); margin 18,743 (15.40%).

### 7. ~~Thrikkakara #83 — 2021 general~~ ✅ resolved

10-candidate list patched (was 3 cands at 88.9% sum; now 99.49% + NOTA). Turnout 136,570; margin 14,329 (10.49%). J. Jacob's party still stored as "LDF" placeholder.

### 8. ~~Nilambur #35 — 2021 general~~ ✅ resolved

6-candidate list patched. Turnout 173,205; margin 2,700 (1.56%). P. V. Anvar's party stored as "LDF" (he ran as LDF-backed Independent).

## Need verification (likely scrape errors)

These have a stored `margin` that disagrees with `winner − runnerUp` by more than 1000 votes. Either the stored margin is wrong, or the candidate list is missing the actual runner-up.

### 9. ~~Neyyattinkara #140 — 2016 general~~ ✅ resolved

Vote counts had typos: K. Ansalan 62,113 → 63,559; R. Selvaraj 59,016 → 54,016. With corrected votes, computed margin (9,543) now matches stored.

### 10. ~~Aruvikkara #136 — 2015 by-election~~ ✅ resolved

Winner votes had typo (59,448 → 56,448; 3,000 vote discrepancy). Replaced with full 16-candidate list. Vijayakumar's party corrected from "CPI" → "CPI(M)".

### 11. ~~Beypore #29 — 2016 general~~ ✅ resolved

Replaced with full 9-candidate list from your data. Margin (14,363) now matches stored.

### 12. ~~Vaikom #95 — 2016 general~~ ✅ resolved

Replaced with full 8-candidate list. Margin (24,584) now matches stored.

---

**Audit clean as of 2026-05-04**: 0 null `votePct`, 0 null `marginPct`, 0 null `turnout`, 0 margin mismatches >1000 votes.

## Deferred (alliance-as-party)

These have `"LDF"` / `"UDF"` / `"NDA"` literal in the `party` field instead of the actual party name. Alliance-level aggregates are correct (via `partyToAlliance` map), but specific party identity is imprecise. Resolution requires confirming each candidate's actual party (often a small alliance ally like NCK, JDS, KEC sub-faction, or LDF-backed Independent).

Touched in this batch:
- #026 ELATHUR — Saseendran rewritten as `NCP(SP)` (his 2026 carry-over party); 2021 Sulfikar Mayoori still `"UDF"` (NCK)
- #030 KUNNAMANGALAM — Rahim still `"LDF"`; 2021 Dinesh Perumanna `"UDF"`
- #033 KONDOTTY — Beerankutty/Sulaiman Haji still `"LDF"`

Remaining: #034 ERNAD, #035 NILAMBUR, #038 PERINTHALMANNA, #043 TIRURANGADI, #045 TIRUR, #047 THAVANUR, #056 PALAKKAD, #076 ALUVA, #082 ERANAKULAM, #083 THRIKKAKARA, #088 DEVIKULAM, #090 THODUPUZHA, #101 POONJAR, #117 CHAVARA, #124 KOLLAM, #133 VATTIYOORKAVU.
