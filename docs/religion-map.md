# Religion gradient map (planned)

A future visualisation showing each religion's distribution across Kerala districts as a continuous gradient. Separate page, separate analytical purpose from `/belts`.

## Why this is its own surface (not a layer on /belts)

Religion data is **quantitative** (district-level census shares of Hindu / Muslim / Christian / Other) and naturally renders as a smooth gradient. The belt taxonomy on `/belts` is **qualitative** (sub-community character drawn from academic literature) and lives in discrete zones. Forcing a religion gradient on top of belt categories was confusing during prototyping because:

- The three Hindu belts (`central-hindu`, `southern-ezhava`, `southern-nair-latin`) all share one "% Hindu" gradient — the gradient itself can't distinguish them
- The three Christian belts (`central-syromalabar`, `central-reformed-christian`, `southern-coastal-mixed`) all share one "% Christian" gradient
- The mixed/tribal belts (`northern-mixed`, `northeastern-tribal`) have no clean defining religion to gradient-map at all

Splitting religion onto its own page lets each visualisation be honest about what its data shows. The belts page handles "where the academic literature places communities". The religion map handles "where the census measures religion populations".

## What this map will show

Three small choropleths shown together (row or stacked):

- **% Hindu by district** — varies roughly 50% (Pathanamthitta) to 75%+ (Kasaragod, Palakkad)
- **% Muslim by district** — varies roughly 5% (Pathanamthitta, Kottayam) to 70% (Malappuram)
- **% Christian by district** — varies roughly 5% (Malappuram) to 45% (Kottayam, Pathanamthitta)

Each district shaded by its religion percentage, with continuous colour intensity proportional to share. Hover-tooltip showing the exact percentage. Same colour-keying as `/belts` (Hindu = saffron family, Muslim = green, Christian = purple) for cross-page consistency.

## What this map answers well

**Where each alliance/party's structural vote bank lives.** This is intuitive to anyone who follows Kerala politics, but worth visualising because the intuition isn't always obvious to readers coming in fresh.

- IUML's stronghold geography snaps into focus when the Muslim choropleth is right next to a map of IUML-won seats — Malappuram district lights up in both views and the correlation is immediate
- Kerala Congress / Marthoma political tradition lines up with the central Christian belt (Pathanamthitta + Kottayam)
- BJP/NDA's structural opportunity space aligns with the Hindu-majority districts — necessary but not sufficient for NDA wins, which is exactly the point worth making visible
- The "Christian-heavy = traditional UDF / Congress" narrative becomes a visual claim instead of an asserted one

In short: this map makes the structural geography of Kerala's vote banks legible at a glance, including for readers whose mental model of "Kerala has three big communities and a lot of seat-level politics" isn't yet wired to specific districts.

## What this map CANNOT answer

Why specific seats **drifted** between alliances. Religion explains the structural floor and ceiling; it doesn't explain the marginal seat-level movement that drives election outcomes. The `/drifts` and `/flows` pages already cover that question with vote-share data; this map is reference context, not a substitute.

Religion at district level also cannot:

- Distinguish Christian denominations (Syro-Malabar / Marthoma / Orthodox / Latin Catholic). They're all "Christian" in the census.
- Distinguish Hindu sub-communities (Ezhava / Nair / SC / ST). All "Hindu".
- Capture political behavioural variation within a religion bucket. A 70% Hindu seat in Trivandrum and a 70% Hindu seat in Kollam can vote very differently because Nair-vs-Ezhava politics is sub-religious.

The map is **structural geography, not behavioural prediction**.

## Data sources (already in place)

- `data/demographics.json` — 2011 census religion shares per district (already loaded as `demoMeta`)
- `src/lib/data/demographics.ts` — `getDemographicsFor(districtId)` API
- District boundaries already render via the existing district-level map machinery

The infrastructure exists. The missing pieces are the page and a small district-level gradient component (the existing AC-level `MiniACMap` works at constituency granularity; this would need a district-aggregated companion).

## Page structure

A new route `/religion-map`, following the existing patterns:

- Lazy-loaded via `React.lazy` in `App.tsx`, separate page chunk
- Header with breadcrumb + info popover (matching `/flows`, `/drifts`, `/belts`)
- Three side-by-side district choropleths (or stacked on mobile)
- Per-religion intensity legends below each map
- A small read-out: hovering a district anywhere shows that district's full Hindu/Muslim/Christian breakdown
- Methodology disclosure listing caveats

## Linkability

Worth a small "see also" link from `/belts` and `/drifts` since religion gradient is useful baseline reading. **Not** part of the depth-of-engagement teaser ladder (homepage → /insights → /flows → /drifts) — those celebrate analytic deep-dives. The religion map is more of a reference / context surface.

## Methodology caveats to surface on the page

- Census 2011 is the most recent available. Differential fertility since then has raised Muslim share modestly and lowered Hindu and Christian shares versus what's shown.
- District granularity smooths real intra-district variation. The same caveat that makes `/belts` inferential applies here: AC-level mix isn't visible from district averages.
- "Religion does not equal vote choice." This map is structural geography. People in Malappuram still vote — IUML's dominance there is one of several explanations.
- The "Other" bucket includes SC/ST and Adivasi populations partly, plus Sikhs/Buddhists/Jains/None — useful at the margins (Wayanad's tribal share shows up here) but ambiguous on its own.

## Effort estimate

~1 hour for the page + a district-level choropleth component, given the data layer is already in place.

## When to build

Lower priority than:

1. Per-cycle delta visualisation for `/drifts` (forward-looking — *being built now*)
2. Turnout-corrected drift analysis (the most analytically meaningful next step)
3. Pass 2 of `/belts` — per-AC overrides for the 41 drift seats (already-planned follow-up)

Build the religion map when there's appetite for a "context / reference" page rather than a substantive analytic addition. It tells a different and useful story; it just isn't the *load-bearing* next thing for the drift question.

## Status

Planned. Not built. Captured here so the rationale isn't lost when we get to it.
