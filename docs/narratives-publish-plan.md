# Implementation Plan — /narratives publish surface

End-to-end plan for the public-facing analytical surface. Top page (`/narratives`) plus three arc pages, with choropleths and supporting charts. Linked from the bottom of `/questions`.

## Goal

Surface the catalog's three-arc analytical thesis as a publication-quality web section. Visualisations carry the analytical weight; prose glues them together; cross-links to `/explore` and `docs/narrative-cards/` give readers two depth levels (academic-detailed source docs vs. interactive seat-level exploration).

## Scope

**In scope:**
- 4 new routes: `/narratives`, `/narratives/anti-ldf-wave`, `/narratives/central-kerala`, `/narratives/bjp-pocket`
- 1 reusable `<ChoroplethMap>` component (the visual centerpiece)
- 4-5 supporting chart components (histogram, scatter, bar comparison, stacked bar, trajectory)
- Per-AC alliance Δshare computation utilities (TS, used by all narrative components)
- Hero composite visualisation (3 small Kerala maps side-by-side on top page)
- Mobile responsiveness
- Replace `<FlowsTeaser>` at the bottom of `/questions` with `<NarrativesTeaser>`
- Cross-links from each arc page back to source `docs/narrative-cards/*.md`
- Cross-links from arc pages to `/explore` filtered views (where applicable)

**Out of scope (deferred):**
- Interactive choropleth pan/zoom (hover-tooltip is in scope; map manipulation is not)
- User-customizable filters / bins on narrative pages
- Removing `/flows` or `/drifts` (parked — keep them so their components remain reusable)
- Methodology pages on the published surface (link from footer; don't make them user-facing pages)
- B3+B4 caste card (not published; remains in `docs/narrative-cards/` only)
- Search across narratives
- Print/PDF export

## Cards published per arc

| Arc | Source cards merged into the page |
|---|---|
| **Arc 1 — Anti-LDF wave** | A1 (religion-blind LDF), A2 (Sabarimala-route falsification), A6 (cabinet-status null), ldf-shallow-distribution, anti-ldf-flow |
| **Arc 2 — Central Kerala amplification** | A1 (Christian-belt premium), A8 (47-of-47 sweep), vote-efficiency (FPTP amplification mechanism) |
| **Arc 3 — BJP geographic pocket** | A3 (3 wins concentrated), bjp-ac-growth (per-AC reshuffle + contest-entry vs organic) |

8 cards mapped to 3 arcs. Source cards remain in `docs/narrative-cards/` as the rigour backstop.

---

## Phase 1 — Scaffolding & routing (no visuals)

Goal: have all 4 pages reachable, prose-empty, navigation working. Establishes the layout skeleton before building visuals.

- [ ] **1.1** Add 4 routes to `src/App.tsx` (lazy-loaded), with placeholder pages
- [ ] **1.2** Create `src/pages/narratives-page.tsx` (top page shell)
- [ ] **1.3** Create `src/pages/narratives-anti-ldf-page.tsx` (Arc 1 shell)
- [ ] **1.4** Create `src/pages/narratives-central-kerala-page.tsx` (Arc 2 shell)
- [ ] **1.5** Create `src/pages/narratives-bjp-pocket-page.tsx` (Arc 3 shell)
- [ ] **1.6** Create `src/components/narratives/narrative-arc-card.tsx` (used 3× on top page; arc title + claim + visual + summary + link)
- [ ] **1.7** Create `src/components/narratives/narrative-section.tsx` (heading + prose + visual; used as the building block on arc pages)
- [ ] **1.8** Create `src/components/narratives/narratives-teaser.tsx` (replacement for `<FlowsTeaser>` at /questions bottom)
- [ ] **1.9** Update `src/pages/questions-page.tsx` to use `<NarrativesTeaser>` instead of `<FlowsTeaser>` (do not delete `<FlowsTeaser>` — leave it usable for now)
- [ ] **1.10** Add `/narratives` to the breadcrumb / page-shell title where appropriate

## Phase 2 — Data layer

Goal: per-AC alliance Δshares + religion bins + region tags computed once, consumed by all narrative components.

- [ ] **2.1** Create `src/lib/data/narrative-metrics.ts` with helpers:
  - `getPerACAllianceDelta(allianceCode)` → `Map<acNumber, deltaShare>`
  - `getPerACBJPDelta()` → `Map<acNumber, deltaShare>` (party-level, not alliance)
  - `getPerACAlliance21And26(allianceCode)` → for trajectory plots
  - `getRegionForAC(acNumber)` → `"N" | "C" | "S"` (region partition matches `methodology-core-concepts.md`)
- [ ] **2.2** Sanity-check: compute statewide aggregates from these helpers and verify they match the Python script outputs (UDF +7.29pp / LDF -7.43pp / NDA +2.05pp constituency-equal means)
- [ ] **2.3** Add unit tests for the helpers (data correctness — small targeted tests)

## Phase 3 — ChoroplethMap component (the centerpiece)

Goal: a reusable choropleth component used on every arc page. Diverging color scale support for Δ values; sequential support for absolute shares; hover tooltip.

- [ ] **3.1** Create `src/components/charts/choropleth-map.tsx`:
  - Props: `valueByAC: Map<number, number>`, `colorScale: "diverging" | "sequential"`, `domain?: [min, max]` (auto-fit if absent), `tooltipFormat?: (acNumber, value) => string`, `highlightSeats?: Set<number>`
  - Renders Kerala SVG using existing `kerala-constituencies-paths.json`
  - Diverging: red (-) ↔ neutral ↔ blue (+) with configurable midpoint
  - Sequential: light-to-dark single-hue
  - Hover state: AC outlined, tooltip showing AC name + formatted value
  - Mobile: responsive viewBox; tap-to-show-tooltip on touch devices
- [ ] **3.2** Build a small `<ChoroplethLegend>` companion (color bar + min/max labels)
- [ ] **3.3** Performance: render path elements only once; update fills via React's reconciliation when value map changes

## Phase 4 — Supporting chart components

Goal: 4-5 chart primitives used across arc pages. Recharts-based where possible.

- [ ] **4.1** `histogram.tsx` — binned bar chart with configurable bin width and centered/diverging x-axis (used for LDF Δ distribution)
- [ ] **4.2** `comparison-bar.tsx` — small bar chart comparing 2-3 group means (used for minister vs non-minister, treatment vs control)
- [ ] **4.3** `scatter-with-trend.tsx` — Recharts ScatterChart with a regression line overlay (used for Christian-share vs UDF Δ)
- [ ] **4.4** `stacked-bar-by-category.tsx` — used for BJP gains vs cessions by district
- [ ] **4.5** `trajectory-lines.tsx` — multi-line chart showing 2016/2021/2026 trajectories per AC (used for BJP contest-entry vs organic)

All five components live in `src/components/charts/`.

## Phase 5 — Top page (`/narratives`)

Goal: hero + 3 arc cards + sidebar. The reader should grasp the three-arc thesis in 90 seconds.

- [ ] **5.1** Hero block: one-line thesis + ~150-word lede ("Kerala 2026 was three overlapping patterns, not one wave.")
- [ ] **5.2** Composite hero visualisation: 3 small Kerala maps side-by-side, each tinted for one arc
  - Map 1: LDF Δ choropleth (showing the broad uniform pattern)
  - Map 2: UDF Δ with Central-5 outlined
  - Map 3: NDA Δ + winner highlight on the 3 BJP wins
- [ ] **5.3** Three `<NarrativeArcCard>` blocks below the hero, each:
  - Arc title + one-sentence claim
  - One key statistic (e.g., "LDF lost 7.4pp uniformly across 140 ACs")
  - 80-word summary
  - "Read more →" link to arc page
- [ ] **5.4** Sidebar / footer callouts:
  - "Swing source vs seat amplification" — one short paragraph linking to the synthesis card section
  - "What contradicted prior expectations" — 5-bullet list (Sabarimala wrong sign, Muslim-gradient collapse, minister-penalty absent, UDF margins not narrow, BJP aggregate hides reshuffle)
- [ ] **5.5** Footer: methodology link (to `docs/narrative-cards/methodology-core-concepts.md` on GitHub) + reproduce-this-analysis link (to `scripts/`)

## Phase 6 — Arc 1 page (`/narratives/anti-ldf-wave`)

Goal: establish the "broad uniform anti-LDF" finding through visualisation and the three falsification cards.

- [ ] **6.1** Hero: "LDF lost ~7pp uniformly. There was no concentrated collapse zone." Confidence label: Strong.
- [ ] **6.2** Section "The wave was uniform" — choropleth (LDF Δshare per AC, diverging) + histogram (LDF Δ distribution showing the bell shape with kurtosis)
- [ ] **6.3** Section "It wasn't religion-targeted" — scatter (Christian/Muslim share vs LDF Δ, showing flat pattern within district FE) + brief A1 finding summary
- [ ] **6.4** Section "It wasn't Sabarimala-route-targeted" — comparison bar (3 Sabarimala-route ACs vs 88 matched-Hindu controls; LDF Δ -3.6 vs -7.3, with NDA Δ also showing wrong-direction)
- [ ] **6.5** Section "It wasn't cabinet-status-targeted" — comparison bar (21 minister incumbents vs 78 non-minister LDF incumbents; LDF Δ -6.89 vs -7.63, +0.74pp differential)
- [ ] **6.6** Section "Where the loss landed" — flow-decomposition visual (per-AC bar showing UDF / NDA / OTHER absorption shares, color-coded; statewide aggregate at top)
- [ ] **6.7** Closing "What would weaken this conclusion" — adapted from cards' falsification triggers
- [ ] **6.8** Cross-links: 5 source cards in `docs/narrative-cards/`, plus `/explore` link filtered to top-3 LDF Δ outliers

## Phase 7 — Arc 2 page (`/narratives/central-kerala`)

Goal: establish the Christian-belt UDF amplification finding + the FPTP mechanism that converted it to a landslide.

- [ ] **7.1** Hero: "Central Kerala provided 46% of UDF's majority margin. UDF won 47 of 47 seats across 5 districts." Confidence label: Strong.
- [ ] **7.2** Section "The 47-of-47 sweep" — choropleth (UDF wins 2026 with Central-5 districts outlined; sequential color)
- [ ] **7.3** Section "The Christian-belt premium" — scatter (Christian-share % vs UDF Δshare, with regression line and outliers labelled — Pala, Thiruvalla, Udumbanchola, Vengara)
- [ ] **7.4** Section "Why a 7pp swing produced a landslide" — efficiency-flip bar chart (UDF/LDF seat:vote-share ratios 2021 vs 2026) + counterfactual summary ("Under 2021 vote shares, UDF would have won 44 seats, not 102")
- [ ] **7.5** Section "Muslim-share didn't add a separate premium" — bin chart (UDF Δ by Muslim-share bin, showing flat pattern) + brief explanation
- [ ] **7.6** Closing
- [ ] **7.7** Cross-links: A1, A8, vote-efficiency in `docs/narrative-cards/`; `/explore` link to "UDF gains in Christian-heavy seats" question

## Phase 8 — Arc 3 page (`/narratives/bjp-pocket`)

Goal: surface the +0.18pp / ±25pp paradox and the contest-entry-vs-organic durability question.

- [ ] **8.1** Hero: "BJP grew +0.18pp statewide. The same number moved by ±25pp at the AC level. Both are true." Confidence label: Moderate-strong.
- [ ] **8.2** Section "The 3 wins" — choropleth (2026 winners with NDA highlighted) + brief on Hindu-share concentration + UDF underperformance
- [ ] **8.3** Section "The reshuffle hidden by the aggregate" — BJP party-share Δ choropleth (diverging, ±25pp) + stacked bar (gains vs cessions by district)
- [ ] **8.4** Section "Contest-entry vs organic" — trajectory chart (BJP share 2016/2021/2026 for the 12 big-gainer ACs, color-coded as contest-entry vs organic) + the key durability question
- [ ] **8.5** Section "Why this matters for 2031" — adapted from bjp-ac-growth's "Forward implications" + the falsification triggers
- [ ] **8.6** Closing
- [ ] **8.7** Cross-links: A3, bjp-ac-growth in `docs/narrative-cards/`; `/explore` filtered to BJP party + sort by share Δ desc

## Phase 9 — Polish & QA

Goal: production quality across all 4 pages. Mobile, accessibility, visual consistency.

- [ ] **9.1** Mobile responsiveness pass (each page tested at 375px, 768px, 1280px)
- [ ] **9.2** Color-scheme consistency: same palette for diverging/sequential across all choropleths and charts
- [ ] **9.3** Tooltip / hover-state consistency across components
- [ ] **9.4** Accessibility: alt text on charts, keyboard navigation for tooltips, aria labels, WCAG color contrast for the diverging palette
- [ ] **9.5** Cross-link audit: every "Read more →" / "[See full analysis →]" / `/explore` link works and points to the right place
- [ ] **9.6** Build + typecheck + test (existing test suite must still pass)
- [ ] **9.7** Visual review using Chrome MCP — capture screenshots of each page and verify rendering
- [ ] **9.8** Update memory + plan progress log

## Sequencing notes

- Phases 1, 2, 3, 4 are mostly independent. Build them roughly in parallel within a session — the choropleth (Phase 3) is the single largest component, so it gets its own focused block.
- Phases 5-8 sequentially depend on Phases 1-4 being usable. Build them one at a time, top page first (lighter; mostly layout) then arcs in order.
- Phase 9 happens once all visuals are wired. Don't polish until structure is settled.

## Components inventory (reference)

```
src/components/narratives/
├── narrative-arc-card.tsx
├── narrative-section.tsx
└── narratives-teaser.tsx

src/components/charts/
├── choropleth-map.tsx                  (the centerpiece)
├── choropleth-legend.tsx
├── histogram.tsx
├── comparison-bar.tsx
├── scatter-with-trend.tsx
├── stacked-bar-by-category.tsx
└── trajectory-lines.tsx

src/lib/data/
└── narrative-metrics.ts                (per-AC alliance / party Δshare helpers)

src/pages/
├── narratives-page.tsx                 (/narratives)
├── narratives-anti-ldf-page.tsx        (/narratives/anti-ldf-wave)
├── narratives-central-kerala-page.tsx  (/narratives/central-kerala)
└── narratives-bjp-pocket-page.tsx      (/narratives/bjp-pocket)
```

## Page wireframes (text-form)

### `/narratives` (top page)
```
[breadcrumb] Kerala > Narratives
[hero] H1: "Kerala 2026 was three overlapping patterns, not one wave"
       [composite hero visualisation: 3 small maps side-by-side]
       [~150 word lede]
[arc cards horizontal grid]
  ┌─ Arc 1 ──────────┐ ┌─ Arc 2 ──────────┐ ┌─ Arc 3 ──────────┐
  │ Anti-LDF wave    │ │ Central Kerala   │ │ BJP geographic   │
  │ [headline stat]  │ │ [headline stat]  │ │ [headline stat]  │
  │ [hero visual]    │ │ [hero visual]    │ │ [hero visual]    │
  │ [80 word summary]│ │ [80 word summary]│ │ [80 word summary]│
  │ Read more →      │ │ Read more →      │ │ Read more →      │
  └──────────────────┘ └──────────────────┘ └──────────────────┘
[sidebar callouts]
  - Swing source vs seat amplification
  - What contradicted prior expectations (5 bullets)
[footer] methodology link · reproduce-this-analysis link · GitHub
```

### Arc page (`/narratives/anti-ldf-wave` etc., template)
```
[breadcrumb] Kerala > Narratives > [arc name]
[hero] H1: arc title
       [confidence label]
       [hero claim paragraph]
[content sections, each NarrativeSection: heading + prose + visual]
  ## Section 1: ...
    [visual]
    [prose]
  ## Section 2: ...
    [visual]
    [prose]
  ... (5-6 sections)
[closing]
  ## What would weaken this conclusion
  [bulleted falsification triggers]
[cross-links footer]
  Source analyses: [N narrative cards]
  Explore the data: [/explore filtered link]
```

## Risks / decisions to watch

- **Choropleth color scale standardisation** — diverging scales have many subjective choices (centered at 0? at the median? color extremes?). Decide once and use consistently.
- **Mobile choropleth UX** — hover tooltips don't work on touch. Tap-to-show with a small persistent label might be needed.
- **Prose density** — risk of arc pages becoming as long as the source cards. Aim for ~600-1000 words per arc page; surplus content goes to the cross-link in `docs/narrative-cards/`.
- **Performance** — 140-path SVG renders fine in /explore; should be fine here too. But running 3 maps in the hero composite needs verifying.
- **Cross-references** — `/explore` link integration depends on URL params we already built (religionMix, reservation). Some arc-specific links may need new filter dimensions; check before promising deep-link parity.

## Definition of done

- All 4 pages build and render without console errors
- Each arc page contains the listed sections with visuals
- Hover tooltips work on every choropleth and chart
- Mobile layout passes 375px width without horizontal scroll
- `/questions` footer now links to `/narratives` instead of `/flows`
- Build + typecheck + tests pass
- A reader can land on `/narratives`, read for 5 minutes, and arrive at the synthesis-card-equivalent understanding (anti-LDF wave + Christian-belt amplification + BJP pocket = three patterns, not one)

## Estimated effort

This is a multi-session task. Rough estimate:
- Phases 1-2: 1 session (scaffolding + data helpers)
- Phase 3: 1 session (choropleth — the largest component)
- Phase 4: 1 session (the 5 chart primitives)
- Phase 5: 1 session (top page)
- Phase 6: 1 session (Arc 1)
- Phase 7: 1 session (Arc 2)
- Phase 8: 1 session (Arc 3)
- Phase 9: 1 session (polish + QA)

Total: ~8 sessions equivalent. Will be executed continuously starting now.
