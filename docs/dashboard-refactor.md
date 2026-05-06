# Dashboard refactor — search-led home + dedicated explorer

A planned refactor of `/` (the homepage / dashboard) to simplify the entry experience for casual visitors while preserving full exploration capability for engaged users. The goal is a simpler page that does less work cleanly, not a feature reduction.

## Goals

1. **Lead with the result of the election.** The first thing a visitor sees should be the headline ("UDF 102 / LDF 35 / NDA 3"), not a map of districts.
2. **Search bar collapses the decision space.** Instead of a cascade (district → alliance → party → seat) imposed on every visitor, search lets users go directly to the candidate / seat / party / district they care about.
3. **Dedicated explorer page** for browse-driven users. The current dashboard's filter UI, candidate table, and constituency map move to `/explore`, where they can be the primary surface for users who want to scroll, sort, and pattern-spot.
4. **Discoverability**: the homepage summary's clickable elements double as entry points to `/explore`, so users don't just find what they came for — they also learn that `/explore` exists.

## Why this is worth doing

The current dashboard has accumulated multiple navigation paths (cascade, two maps, table search, scope title) on a single very long page. None of them are bad individually; together they create a "what am I supposed to do here?" first-impression for visitors without a specific target. Most casual visitors are probably looking for one of two things: "what happened in 2026" (headline-driven) or "find my seat / candidate" (lookup-driven). The current page serves neither cleanly — both require scrolling past content that isn't relevant to their intent.

A search-led home + explorer split serves both intents directly:
- Casual visitor lands → sees the headline + a search bar → either has the answer (lookup) or sees the result they came for and can choose to drill in.
- Engaged visitor lands → sees the search bar + clear "Explore all 140 seats" affordance → goes to `/explore` and uses the existing filter machinery.

## Target architecture

### Route map after the refactor

| Path | Purpose | Notes |
|---|---|---|
| `/` | Headline summary + search bar + teasers | Minimal. No filter UI, no candidate table. |
| `/explore` | Current dashboard's filter / table / map / detail experience | Renamed and slightly reorganised; URL contract preserved. |
| `/insights` | unchanged |
| `/flows` | unchanged |
| `/drifts` | unchanged |
| `/belts` | unchanged |
| `/religion-map` | unchanged |

### `/` (new home)

Sections, top to bottom:

1. **Hero summary** — Kerala 2026 result at a glance.
   - Alliance breakdown bar: seats won + vote share for UDF / LDF / NDA / OTHER / NOTA.
   - Each alliance segment is a link to `/explore?alliance=UDF` etc.
   - Below the bar: short one-line context ("UDF won 87 of 140; sharpest win since 2011" or similar editorial line).
2. **Search bar** — prominent, single input.
   - Resolves candidate / seat / party / alliance / district queries to the appropriate `/explore?...` URL.
   - Result dropdown shows matched entities with type tags (Seat, Candidate, Party, District, Alliance).
3. **"Explore all 140 seats" CTA** — single link / button to `/explore`.
   - For users who'd rather scroll than search.
4. **Footer** — unchanged. (No InsightsTeaser here — that lives on `/explore` only, per the decisions section.)

### `/explore` (the existing dashboard, renamed)

Content unchanged; route renamed. All current sections move:

- `<ScopeTitle>` (filter breadcrumb)
- `<KeralaMap>` (district choropleth, click-to-filter)
- `<AllianceSection>` (alliance breakdown for scope)
- `<PartySection>` (when alliance selected)
- `<CandidateTable>`
- `<ConstituencyMap>`
- `<ConstituencySection>` (when seat selected)
- `<InsightsTeaser>` (no longer needed here since it's on home, but we could keep it as a "where to go next" prompt for engaged users)

### URL contract

**Filter-based URLs on `/explore`:**
- `/explore` (default, no filters)
- `/explore?district=kollam`
- `/explore?alliance=NDA`
- `/explore?seat=76`
- `/explore?district=kollam&alliance=NDA&party=...&seat=...`

**No backward compatibility burden.** The site has no live users yet, so old `/?seat=76` URLs / old code / old UI can be changed without any redirect logic. Phase 3 simplifies accordingly — we don't need a "filter params on `/` → redirect to `/explore`" path.

**No new entity routes.** We're not introducing `/seat/76`, `/party/BJP`, `/district/kollam` as separate routes. The filter-URL contract is simpler: every "view of an entity" is `/explore?filter=value`. Search results route there.

## Search component design

A single in-memory search index over ~1200 items (140 seat names + ~1000 candidate names + ~50 parties + 14 districts + 5 alliances). Trivial to maintain and query.

### Indexed entity types

| Type | Source | Resolves to |
|---|---|---|
| Candidate | `constituency.candidates[].name` | `/explore?seat={n}` (with row highlight) |
| Constituency name | `constituency.constituencyName` | `/explore?seat={n}` |
| Constituency number | as-typed integer | `/explore?seat={n}` |
| Party | `partyShort` + canonical name | `/explore?party={key}` |
| District | `districts.json` | `/explore?district={id}` |
| Alliance | `alliances.json` | `/explore?alliance={code}` |

### Match strategy

Simple substring match (case-insensitive), with these heuristics:
- Exact match on alliance code (`UDF` / `LDF` / `NDA`) → top result
- Numeric input → match on constituency number first
- Multi-word input → all words must be present in the entity's searchable text
- Results grouped by type in the dropdown ("Seats", "Candidates", "Parties", etc.)
- Cap at ~10 results per group; if more, show "+N more"

No fuzzy / Levenshtein matching in v1 — substring is enough for known names. Add fuzzy later if data shows users typing misspellings.

### Edge cases worth thinking through

- "Pradeep" matches several candidates → show all in candidate group
- "Idukki" matches both a district and a constituency → show both with type tags
- Empty / very short input → show no results (don't show all 1200 entities)
- No matches → small "No results — try [examples]" footer

## Phased implementation plan

### Phase 1 — Lead with summary on `/` (low-risk warmup)

**What:** reorder the existing dashboard so `<AllianceSection>` appears first, above `<KeralaMap>`. Make the alliance segments clickable to set the alliance filter (this may already work; verify and polish).

**Why:** small, safe change. Tests the "headline first" hypothesis without committing to the full refactor. If after a few days we don't like it, easy to revert.

**Effort:** ~30 min.

**Risk:** very low. No URL changes, no new routes, no data layer changes.

### Phase 2 — Search bar (additive, no removal)

**What:** build a `<SearchBar>` component, mount it on the dashboard at the top (above the alliance summary). Ships alongside the existing dashboard — search is added, nothing is removed.

**Implementation:**
1. Build a search index module (`src/lib/search.ts`) — runs once at module load, gives a `searchAll(query)` function that returns grouped results.
2. Build `<SearchBar>` component — input + dropdown of grouped results, click → `navigate()` to result URL.
3. Mount on dashboard between hero summary and the rest of the page.

**Effort:** ~3 hours.

**Risk:** low. Pure addition; if search has bugs, the rest of the page works.

### Phase 3 — Split home and `/explore` (the actual refactor)

**What:** the architectural change. Create `/explore` route, move dashboard content there, redesign `/` as the lean home.

**Implementation:**

1. **Add `/explore` route.** Move the current `DashboardPage` body (everything except the existing hero / new search bar) to a new `ExplorePage` component. Add the route in `App.tsx`.
2. **Redesign `/`** as the new home — keep only the hero summary + search bar + "Explore all 140 seats" CTA + InsightsTeaser + footer. Remove the cascade UI (Kerala map click-to-filter, AllianceSection click-to-set-alliance, etc.) — those affordances move to `/explore`.
3. **Backward-compatibility redirect.** In `DashboardPage`, on mount, check `URLSearchParams`. If any filter param is present (`district`, `alliance`, `party`, `seat`, etc.), redirect to `/explore?same params`. This preserves all bookmarks.
4. **Update internal links.** Anywhere we link to `/` with the assumption that filters work (e.g., the candidate-table seat-link helper that builds `?seat=...&result=all` URLs), update to point at `/explore`.
5. **Lazy-load `/explore`.** Same pattern as `/insights`, `/flows`, `/drifts`. The new home becomes very fast.

**Effort:** ~half a day, including testing.

**Risk:** medium. Major URL-structure change. Risks are caught by:
- Tests on filter parsing / URL preservation
- Manual verification of common URL patterns (`/?seat=76`, `/?district=kollam`, etc.)
- Pre-push hook + manual smoke tests on key flows

### Phase 4 — Polish + final touches

**What:**
- Verify all teasers, breadcrumbs, links across the site point at the right URLs.
- Polish search UX (keyboard navigation, focus states, loading states if any).
- Verify mobile experience.
- Consider adding "recently viewed seats" or "popular searches" to the empty search dropdown if data supports it.

**Effort:** ~2 hours.

**Risk:** low.

### Total effort estimate

~1 day of focused work. Phases 1 and 2 are independently shippable. Phase 3 is the architectural commitment.

## What's preserved

- All filter-state URLs continue to work.
- The full filter cascade UI (district → alliance → party → seat) lives on `/explore`, unchanged.
- Candidate table with sort and search.
- Both maps (Kerala district map + constituency map).
- Per-seat detail panel (chart + past winners).
- Per-party trend chart, per-alliance trend chart.
- Discovery teasers (homepage → `/insights` → `/flows` → `/drifts`).
- All deeper pages (`/insights`, `/flows`, `/drifts`, `/belts`, `/religion-map`) unchanged.

## What's lost or de-emphasised

### Priority functionality affected — flagging for your call

1. **Single-page exploration on `/`.** Currently the dashboard is a long page where everything is reachable by scrolling. After the refactor, `/` is short, and full exploration requires a click into `/explore`. Users who currently bookmark `/` and scroll to find specific things will land on a different experience. *Severity: medium.* Mitigation: the "Explore all 140 seats" CTA is prominent on `/`, so the path to the existing experience is one click away.

2. **Inline scroll-and-click discovery of the cascade.** Currently a casual visitor can scroll past the alliance section and naturally discover that clicking "UDF" opens the party section. After the refactor, that affordance lives on `/explore`. Visitors who don't click into `/explore` won't experience the cascade. *Severity: low–medium.* Mitigation: search handles the same intent more directly. Click affordances on the home alliance summary still go somewhere useful (`/explore` filtered to that alliance).

3. **InsightsTeaser placement change.** Currently shown on `/` (conditional on filter engagement). After the refactor:
   - Removed from `/` entirely. The new home is intentionally minimal.
   - Lives on `/explore` only — replacing the current conditional rendering with unconditional. Anyone on `/explore` is browse-driven by definition; teasing the deeper pages there is appropriate.
   - *Severity: low.* Same teaser, different surface.

### Minor functionality OK to lose

1. **The "scroll all the way down" home experience.** The new home is short. People who liked having "everything on one page" will need to click `/explore`. Not a real loss for most users.
2. **The `<ScopeTitle>` breadcrumb on `/`.** Doesn't apply to the new home (no filters there). Lives on `/explore` only.
3. **The "filters in URL of `/`" capability.** Existing bookmarks redirect to `/explore`; new bookmarks land on `/explore`. The home URL becomes filter-free.

### Things explicitly NOT changing

- The data layer (`src/lib/data/*`). No new aggregations needed; `<ExplorePage>` reuses everything.
- The deeper analysis pages (`/insights` through `/religion-map`). They're orthogonal.
- The pre-push hook, tests, build pipeline.
- The teaser ladder (`/insights` → `/flows` → `/drifts`).

## Decisions

The five open questions have been answered:

1. **Old bookmark / URL handling.** No backward compatibility needed. The site has no live users yet, so old `/?seat=76` URLs, old UI, and old code can be changed freely without redirect logic.

2. **InsightsTeaser placement.** On `/explore` only (not on the new `/`). The new home is intentionally minimal — discovery to the deeper pages happens once a user has chosen to engage with the explorer.

3. **`<KeralaMap>` (district choropleth) on `/explore`.** Keep as-is for Phase 3 to ship sooner, but **flagged as TBC.** Once `/explore` is live, revisit whether the choropleth needs to be the page's hero UI or whether a different layout would be easier for browse-driven users. The choropleth is a good piece of engineering; that doesn't automatically mean it's the right top-of-page element for the explorer's stated purpose.

4. **Headline summary on `/explore` too.** Yes — but `/explore` should also tell the user what the page is for (a one-liner / brief framing distinguishing it from `/`). The unscoped statewide summary on `/`; the scope-aware `<AllianceSection>` on `/explore`; an explicit "this is the explorer for browsing all 140 seats" note up top.

5. **No personalisation / automatic decisions.** No "default landing for power users" logic, no remembering preferences. Site behaves the same for every visitor.

## Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Old `/?seat=76` URLs break | Low | Medium | Add redirect from `/` with filter params → `/explore?...same params`. Test before shipping. |
| Search has performance issues on slow devices | Very low | Low | ~1200 items, all in-memory. Sub-millisecond. Not a real concern. |
| Users miss the cascade discovery on `/` | Medium | Low | "Explore all 140 seats" CTA on `/`, plus search covers most direct intents. Track usage via the analytics integration. |
| Mobile layout regressions | Low | Medium | Manual mobile QA before shipping each phase. |
| Internal links pointing at `/?seat=...` break | Medium | Low | Audit and update during Phase 3. Pre-push tests catch broken builds. |

## Decision points before I start

If you want me to proceed, I need decisions on the five open questions above. If you're happy with my recommendations, just say "proceed with recommendations" and I'll start with Phase 1 and ship each phase as it completes.

If anything in this plan looks wrong or under-specified, flag it before Phase 1 ships — Phase 1 alone is harmless to revert, but Phases 2 and 3 are progressively harder to undo.

## Status

Planned. Not started. This document is the agreed scope before implementation.
