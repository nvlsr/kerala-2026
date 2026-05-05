# Kerala 2026 Election Scraping — Requirements

## Goal

Scrape Kerala 2026 election results from the Election Commission of India website (`https://results.eci.gov.in/ResultAcGenMay2026/`) into local JSON files so we can build a UI on top of clean data.

## Data Source

- Base path: `https://results.eci.gov.in/ResultAcGenMay2026/`
- State code for Kerala: `S11`
- Partywise summary: `partywiseresult-S11.htm`
- Partywise winners (per party): `partywisewinresult-{partyId}S11.htm` (e.g. BJP = `369`)
- Constituency page: `candidateswise-S11{constituencyNumber}.htm` (e.g. `candidateswise-S11126.htm` for AC #126 - CHATHANNOOR)

## Phased Plan

### Phase 1 — Pilot (BJP, 3 constituencies)

1. Fetch and save `partywiseresult-S11.htm` locally (raw HTML).
2. From it, follow the link next to "Bharatiya Janata Party - BJP" (count `3`) → fetch and save `partywisewinresult-369S11.htm`.
3. From the BJP winners page, extract the constituency links (Constituency column).
4. For each of the 3 constituencies, fetch the `candidateswise-S11{N}.htm` page and parse it to JSON.

**Goal of pilot:** verify scraping accuracy. The user manually spot-checks; checksum catches arithmetic errors.

### Phase 2 — Expand to all 140 constituencies

- After the pilot is verified, repeat the per-party flow for every other party that won at least one seat.
- Aggregate into a single dataset.
- Verify all 140 constituencies are present and complete (no missing fields).

### Phase 3 — UI

Out of scope for this task. Begins only after the dataset is complete and validated.

## Per-Constituency JSON Schema

```json
{
  "constituency": "126 - CHATHANNOOR (Kerala)",
  "constituencyNumber": 126,
  "state": "Kerala",
  "candidates": [
    {
      "name": "...",
      "party": "...",
      "votes": 12345,
      "margin": 6789
    }
  ],
  "checksum": {
    "computedMarginsMatchScraped": true,
    "mismatches": []
  }
}
```

### Margin definition

- **Winner (rank 1):** `margin = winner.votes - runnerUp.votes` (positive).
- **Other candidates (rank ≥ 2):** `margin = candidate.votes - winner.votes` (negative; how far behind the winner).

### Checksum

For every candidate we recompute the margin from the votes and compare it to the value scraped from the page. Any candidate whose computed margin differs from the scraped value is flagged in `checksum.mismatches[]` so we can re-inspect the page manually. The aggregate boolean `computedMarginsMatchScraped` is `true` only when every candidate matches.

## Tooling Notes

- Prefer `WebFetch`. If it fails or returns insufficient detail, switch to the Claude-in-Chrome browser tools (Chrome is already open with the sidebar).
- Save raw HTML under `data/raw/` so re-parsing doesn't require re-fetching.
- Save parsed JSON under `data/constituencies/`.
- Aggregate dataset (Phase 2): `data/kerala-2026.json`.

## Out of Scope

- UI work of any kind.
- Historical comparisons / analytics.
- Anything beyond the data described above.
