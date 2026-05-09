import { Fragment, useEffect, useState, type ReactNode } from "react"

import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { WalkthroughBreadcrumb } from "@/components/walkthroughs/walkthrough-breadcrumb"
import {
  PROSE_LINK_CLASS,
  ProseLink,
  SeatLink,
} from "@/components/walkthroughs/prose-link"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getAllACMetrics,
  getPerACAllianceShare,
  getPerACWinner2026,
} from "@/lib/data/walkthrough-metrics"
import { cn } from "@/lib/utils"

import {
  COHORT_3_ACS,
  COHORT_3_ROWS,
  COHORT_4A_ACS,
  COHORT_4A_ROWS,
  COHORT_5A_ACS,
  COHORT_5A_ROWS,
  COHORT_5B_ACS,
  COHORT_5B_ROWS,
  COHORT_6_ACS,
  COHORT_6_ROWS,
  COHORT_BREAKDOWN,
  FOOTPRINT,
  MATURE_GROWER_ROWS,
  MATURE_GROWERS_ACS,
  NDA_TOTAL_2021,
  NDA_TOTAL_2026,
  PARTITIONS,
  PARTY_DECOMPOSITION,
  SOUTH_CLUSTER_VIEWBOX,
  THREE_LENSES,
} from "./walkthroughs-nda-data"

/**
 * Typography system for the BJP walkthrough page.
 *
 * Five named tiers, applied consistently across all sections so the
 * reader's eye learns the hierarchy quickly:
 *
 * 1. SECTION_LEAD — opening paragraph of a section. Slightly larger,
 *    almost-foreground colour. Sets the scene before detail prose
 *    starts. Used right after each section's <h2>.
 * 2. SUB_HEADING — h3 inside a section. Bigger than body so the
 *    visual jump is clear; tracking-tight to match h2.
 * 3. DEFINITION — italic muted block with a left border, one per
 *    cohort, stating the formal selection criteria. Reads as
 *    "metadata about this section" rather than body emphasis.
 * 4. PREVIEW_LIST — compact ordered list shown right after a lead
 *    paragraph that says "N patterns / N reasons / N mechanisms".
 *    Tells the reader what the next N sub-sections will cover.
 * 5. ASIDE — small muted text for parenthetical notes and footnote-
 *    equivalents (e.g. "Caste data is district-level only").
 *
 * Body prose default is `text-sm sm:text-[15px] leading-relaxed`,
 * applied at the section level by CohortSection, so individual <p>
 * elements inherit it without an explicit class. Only override when
 * the paragraph is one of the five named tiers above.
 *
 * Documented in `docs/architecture.md` → "Walkthrough pages" →
 * "Typography system".
 */
const SECTION_LEAD =
  "text-base leading-relaxed text-foreground/90 sm:text-[16.5px]"
const SUB_HEADING = "mt-7 font-heading text-lg font-semibold tracking-tight"
const DEFINITION =
  "border-l-2 border-muted-foreground/30 pl-3 italic text-muted-foreground"
const PREVIEW_LIST =
  "my-3 list-inside list-decimal space-y-0.5 text-[14px] text-muted-foreground"
const ASIDE = "text-[12.5px] text-muted-foreground"

const HIGHLIGHT_ROW_CLASS =
  "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/40"
const NUM_CELL_CLASS = "text-right font-mono tabular-nums"
const NUM_HEAD_CLASS = "text-right"
const COMPACT_CELL_CLASS = "px-2 py-1.5 text-[12.5px]"
const COMPACT_HEAD_CLASS =
  "h-8 px-2 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground"

function makeBinaryValueMap(
  acs: Set<number>,
  allACs: number[]
): Map<number, number> {
  const out = new Map<number, number>()
  for (const ac of allACs) out.set(ac, acs.has(ac) ? 1 : 0)
  return out
}

function CohortLink({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <a
      href={`#${slug}`}
      className="font-medium text-foreground underline decoration-foreground/30 decoration-[1.5px] underline-offset-2 hover:text-foreground hover:decoration-foreground"
    >
      {children}
    </a>
  )
}

function fmtPp(value: number): string {
  const s = value.toFixed(1)
  return value > 0 ? `+${s}` : s
}

function CohortMap({
  valueByAC,
  acs,
  color,
  ariaLabel,
  acNameLookup,
  badgeLabel,
}: {
  valueByAC: Map<number, number>
  acs: Set<number>
  color: string
  ariaLabel: string
  acNameLookup: Map<number, string>
  badgeLabel: string
}) {
  return (
    <ChoroplethMap
      valueByAC={valueByAC}
      colorScale="sequential"
      domain={[0, 1]}
      sequentialColor={color}
      highlightSeats={acs}
      ariaLabel={ariaLabel}
      unit=""
      decimals={0}
      tooltipFormat={(acNumber, value) => {
        const inCohort = (value ?? 0) > 0.5
        return (
          <span>
            <span className="font-medium">
              {acNameLookup.get(acNumber) ?? `AC ${acNumber}`}
            </span>
            {inCohort && (
              <span className="ml-1 rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[10px]">
                {badgeLabel}
              </span>
            )}
          </span>
        )
      }}
    />
  )
}

/**
 * 2-column section: heading on top, then map | content side-by-side
 * on lg+. Stacks (map → content) on mobile. Used for cohort sections
 * where the map answers "where" and the content answers "what".
 *
 * Pass `id` to make the section anchor-linkable from elsewhere on the
 * page (e.g. clickable cohort names in the vote-share decomposition
 * tables jump back to the cohort detail).
 */
function CohortSection({
  id,
  heading,
  map,
  mapCaption,
  mapSide = "left",
  children,
}: {
  id?: string
  heading: string
  map: ReactNode
  mapCaption?: ReactNode
  mapSide?: "left" | "right"
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t pt-10">
      <h2 className="mb-5 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
        {heading}
      </h2>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <figure className={cn(mapSide === "right" ? "lg:order-2" : "")}>
          <div className="rounded-sm border bg-card/40 p-3 sm:p-4">{map}</div>
          {mapCaption && (
            <figcaption className="mt-2 text-xs text-muted-foreground">
              {mapCaption}
            </figcaption>
          )}
        </figure>
        <div
          className={cn(
            "min-w-0 space-y-3 text-sm leading-relaxed sm:text-[15px]",
            mapSide === "right" ? "lg:order-1" : ""
          )}
        >
          {children}
        </div>
      </div>
    </section>
  )
}

/**
 * Right-rail navigation. Sticky list of section anchors; the active
 * section is highlighted as the reader scrolls. Hidden on mobile —
 * the chip-strip breadcrumb at the top covers cross-walkthrough nav,
 * and within-page jumps are less critical on small viewports.
 */
const RAIL_GROUPS: ReadonlyArray<{
  label: string
  items: ReadonlyArray<{ id: string; label: string }>
}> = [
  {
    label: "The cohorts",
    items: [
      { id: "three-wins", label: "The 3 wins" },
      { id: "mature-growers", label: "Mature growers" },
      { id: "low-base-breakouts", label: "Low-base breakouts" },
      { id: "declining-mature", label: "Declining mature" },
      { id: "wave-capture", label: "Wave-capture" },
    ],
  },
  {
    label: "Negative space",
    items: [
      { id: "strategic-abstention", label: "Strategic abstention" },
      { id: "structural-exclusion", label: "Structural exclusion" },
    ],
  },
  {
    label: "Synthesis",
    items: [
      { id: "vote-share-decomposition", label: "Statewide is the wrong lens" },
      { id: "does-not-mean", label: "What this does NOT mean" },
      { id: "methodology", label: "Methodology" },
    ],
  },
]

const RAIL_IDS: string[] = RAIL_GROUPS.flatMap((g) => g.items.map((i) => i.id))

function useActiveSection(ids: ReadonlyArray<string>): string | null {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (typeof window === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top
          )
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

function PageRail() {
  const active = useActiveSection(RAIL_IDS)
  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="On this page"
        className="sticky top-6 space-y-4 text-[13px]"
      >
        <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          On this page
        </p>
        {RAIL_GROUPS.map((g) => (
          <div key={g.label} className="space-y-1.5">
            <p className="text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase">
              {g.label}
            </p>
            <ul className="space-y-0.5 border-l border-border">
              {g.items.map((item) => {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "-ml-px block border-l-2 py-1 pl-3 leading-snug transition-colors",
                        isActive
                          ? "border-foreground font-medium text-foreground"
                          : "border-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

/**
 * Arc 3 — BJP's 2026 performance walkthrough. Data-first tour through
 * the 3 wins and 6 cohort archetypes; no interpretive leaps. Source
 * markdown: `docs/narrative-cards/bjp-performance-walkthrough.md`.
 */
export function WalkthroughsNDAPage() {
  const all = getAllACMetrics()
  const winner2026 = getPerACWinner2026()

  const bjpWins = new Set<number>()
  for (const [acNumber, alliance] of winner2026.entries()) {
    if (alliance === "NDA") bjpWins.add(acNumber)
  }

  const ndaShare2026 = getPerACAllianceShare("NDA", 2026)
  const acNameLookup = new Map(all.map((m) => [m.acNumber, m.acName]))

  const allACNumbers = all.map((m) => m.acNumber)
  const matureGrowersValues = makeBinaryValueMap(
    MATURE_GROWERS_ACS,
    allACNumbers
  )
  const cohort3Values = makeBinaryValueMap(COHORT_3_ACS, allACNumbers)
  const cohort4aValues = makeBinaryValueMap(COHORT_4A_ACS, allACNumbers)
  const cohort6Values = makeBinaryValueMap(COHORT_6_ACS, allACNumbers)
  const cohort5aValues = makeBinaryValueMap(COHORT_5A_ACS, allACNumbers)
  const cohort5bValues = makeBinaryValueMap(COHORT_5B_ACS, allACNumbers)

  const [showAllCohort6, setShowAllCohort6] = useState(false)
  const COHORT_6_INITIAL = 10
  const cohort6Visible = showAllCohort6
    ? COHORT_6_ROWS
    : COHORT_6_ROWS.slice(0, COHORT_6_INITIAL)

  return (
    <PageShell
      breadcrumbs={[
        { label: "Walkthroughs", href: "/walkthroughs" },
        { label: "NDA" },
      ]}
      title="BJP's 2026 performance — a data walkthrough"
      subtitle={<WalkthroughBreadcrumb current="NDA" />}
    >
      <PageMain className="py-6 pb-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div className="min-w-0 space-y-10">
            {/* THESIS LEDE */}
            <section className="rounded-md border bg-card/50 p-5 sm:p-6">
              <p className="text-base leading-relaxed font-medium text-foreground sm:text-[16.5px]">
                BJP's 2026 performance was{" "}
                <strong>not statewide expansion</strong>. It was{" "}
                <strong>targeted consolidation</strong> inside a limited
                competitive universe. Statewide BJP vote share was almost flat
                (+0.3pp), but inside a <strong>30-seat target set</strong> —
                about 21% of Kerala's Assembly constituencies — BJP grew by{" "}
                <strong>+5.2pp</strong> and converted 3 seats. The party is{" "}
                <strong>trading breadth for intensity</strong>: fewer seats
                contested directly (115 → 98 candidates), higher share where it
                does contest.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[14.5px]">
                Statewide vote share is a blunt instrument for reading this. The
                better questions: where is BJP already structurally competitive,
                where is it investing, and where is the ceiling still hard?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[14.5px]">
                The data answers all three. BJP converted in 2026 only where a{" "}
                <strong>mature NDA base</strong> already existed (≥29% going
                in). It produced large but non-converting jumps in low-base
                seats. It remains structurally excluded or alliance-dependent
                across a large slice of the state. The cohorts below map each of
                these terrains in detail.
              </p>
            </section>

            {/* SECTION 1 — The 3 wins */}
            <CohortSection
              id="three-wins"
              heading="The 3 wins"
              mapSide="right"
              map={
                <ChoroplethMap
                  valueByAC={ndaShare2026}
                  colorScale="sequential"
                  domain={[0, 45]}
                  sequentialColor="#FF7F0E"
                  highlightSeats={bjpWins}
                  viewBox={SOUTH_CLUSTER_VIEWBOX}
                  ariaLabel="NDA vote share in Trivandrum and Kollam districts in 2026; 3 BJP wins outlined"
                  unit="%"
                  decimals={1}
                  tooltipFormat={(acNumber, value) => {
                    const won =
                      winner2026.get(acNumber) === "NDA" ? "NDA win" : null
                    return (
                      <span>
                        <span className="font-medium">
                          {acNameLookup.get(acNumber) ?? `AC ${acNumber}`}
                        </span>
                        :{" "}
                        <span className="font-mono">
                          NDA {value != null ? `${value.toFixed(1)}%` : "—"}
                        </span>
                        {won && (
                          <span className="ml-1 rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[10px]">
                            {won}
                          </span>
                        )}
                      </span>
                    )
                  }}
                />
              }
              mapCaption="Trivandrum + Kollam districts (25 ACs). NDA vote share, 2026. The 3 BJP wins — Nemom, Kazhakoottam, Chathannoor — are outlined."
            >
              <p className={SECTION_LEAD}>
                BJP won three Assembly constituencies in 2026:{" "}
                <SeatLink ac={135}>Nemom</SeatLink> (Rajeev Chandrasekhar),{" "}
                <SeatLink ac={132}>Kazhakoottam</SeatLink> (V. Muraleedharan),
                and <SeatLink ac={126}>Chathannoor</SeatLink> (B.B. Gopakumar).
                All three converged on three observable patterns:
              </p>
              <ol className={PREVIEW_LIST}>
                <li>A Hindu-heavy religion + caste mix.</li>
                <li>An mature NDA-2021 base.</li>
                <li>An above-baseline benefit from the anti-LDF wave.</li>
              </ol>

              <h3 className={SUB_HEADING}>
                1. Religion and caste mix — substantially more Hindu
              </h3>
              <p>
                All three wins are heavily Hindu-majority (
                <strong>~70% on average vs 53% statewide</strong>), with
                correspondingly lower Muslim share. They sit in Nair-meaningful
                districts (Trivandrum and Kollam). Per-seat religion and caste
                figures are in the cohort tables below.
              </p>
              <p className={ASIDE}>
                Caste data is district-level only, so it's approximate — not
                AC-precise.
              </p>

              <h3 className={SUB_HEADING}>
                2. Mature vote-share base going in
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      Candidate
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      NDA 2021
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      NDA 2026
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      Δ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className={COMPACT_CELL_CLASS}>
                      <SeatLink ac={135}>Nemom</SeatLink>
                    </TableCell>
                    <TableCell className={COMPACT_CELL_CLASS}>
                      Rajeev Chandrasekhar
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      35.5%
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      40.9%
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      +5.4
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={COMPACT_CELL_CLASS}>
                      <SeatLink ac={132}>Kazhakoottam</SeatLink>
                    </TableCell>
                    <TableCell className={COMPACT_CELL_CLASS}>
                      V. Muraleedharan
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      29.1%
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      35.7%
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      +6.6
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={COMPACT_CELL_CLASS}>
                      <SeatLink ac={126}>Chathannoor</SeatLink>
                    </TableCell>
                    <TableCell className={COMPACT_CELL_CLASS}>
                      B.B. Gopakumar
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      30.6%
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      38.2%
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      +7.6
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-3">
                All 3 wins had a 2021 NDA base ≥ 29% — already structurally
                close to a winning share before the cycle started. Statewide,
                only 8 seats had bases at or above that level going in (see the{" "}
                <CohortLink slug="mature-growers">mature growers</CohortLink>{" "}
                section for the full set).
              </p>

              <h3 className={SUB_HEADING}>3. Anti-LDF wave benefit</h3>
              <p>
                Statewide, the swing landed mostly on UDF, with a smaller slice
                on NDA. At 21 specific seats, the swing pattern inverted — NDA
                absorbed <em>more</em> of the anti-LDF redistribution than UDF
                did. All 3 wins are in this set; details in the wave-capture
                section below.
              </p>
            </CohortSection>

            {/* SECTION 2 — Mature growers + multi-cycle builders */}
            <CohortSection
              id="mature-growers"
              heading="Mature base + growth"
              mapSide="left"
              map={
                <CohortMap
                  valueByAC={matureGrowersValues}
                  acs={MATURE_GROWERS_ACS}
                  color="#2563EB"
                  ariaLabel="Mature growers + multi-cycle builders"
                  acNameLookup={acNameLookup}
                  badgeLabel="grower"
                />
              }
              mapCaption="11 seats where BJP/NDA grew meaningfully on a mature base. Concentrated in the Trivandrum belt, Kollam, Central Kerala (Thiruvalla, Pala), with scattered outposts (Nattika, Kozhikode N/S, Ottappalam)."
            >
              <p className={DEFINITION}>
                BJP grew meaningfully on a mature base — either reaching ≥25% in
                2026 with ≥+5pp gain (snapshot), or sustaining ≥+2pp growth
                across both 2016→2021 and 2021→2026 (trajectory). 11 unique
                seats, sorted by 2026 BJP share.{" "}
                <span className="not-italic">★</span> marks the 4 seats that
                also satisfy the multi-cycle trajectory criterion.
              </p>
              <p>
                This is the clearest set where BJP expanded from a meaningful
                base — the closest 8 ACs to a winning structural position, plus
                3 trajectory seats showing two-cycle build. If BJP is going to
                convert <em>more than 3 seats</em> next cycle, the most likely
                candidates sit inside this cohort.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      District
                    </TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>H/C/M</TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2021
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2026
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      Δ
                    </TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      Outcome
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MATURE_GROWER_ROWS.map((r) => (
                    <TableRow
                      key={r.ac}
                      className={
                        r.outcome === "BJP WIN" ? HIGHLIGHT_ROW_CLASS : ""
                      }
                    >
                      <TableCell className={COMPACT_CELL_CLASS}>
                        <SeatLink ac={r.ac}>{r.seat}</SeatLink>
                        {r.trajectory && (
                          <span
                            className="ml-1 text-[11px] text-muted-foreground"
                            title="Also satisfies multi-cycle trajectory criterion"
                          >
                            ★
                          </span>
                        )}
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {r.district}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.hcm}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.base21.toFixed(1)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.share26.toFixed(1)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {fmtPp(r.delta)}
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {r.outcome}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-3">
                <strong>
                  Chathannoor is the only sustained-trajectory seat that
                  converted to a 2026 win.
                </strong>{" "}
                The 3 wins all sit at the top of the cohort by 2026 share; the
                other 8 lost despite growing. The other three trajectory seats —{" "}
                <SeatLink ac={107}>Haripad</SeatLink> (8.9 → 11.9 → 21.5%),{" "}
                <SeatLink ac={128}>Attingal</SeatLink> (20.4 → 25.9 → 30.8%),{" "}
                <SeatLink ac={28}>Kozhikode South</SeatLink> (16.8 → 20.9 →
                25.6%) — show durable upward trajectories but lost in 2026.
              </p>
              <p>
                Beyond the 3 wins, the 8 non-win growers sit in mixed terrain: 2
                Christian-mixed Central Kerala (
                <SeatLink ac={111}>Thiruvalla</SeatLink>,{" "}
                <SeatLink ac={93}>Pala</SeatLink> — both with marquee Christian
                candidates Anoop Antony and Shone George); 2 Hindu-Muslim
                Kozhikode (<SeatLink ac={27}>Kozhikode North</SeatLink>,{" "}
                <SeatLink ac={28}>Kozhikode South</SeatLink>); 1 Trivandrum-belt
                (<SeatLink ac={128}>Attingal</SeatLink>); 1 Alappuzha (
                <SeatLink ac={107}>Haripad</SeatLink>); plus{" "}
                <SeatLink ac={68}>Nattika</SeatLink> and{" "}
                <SeatLink ac={52}>Ottappalam</SeatLink>. All 8 lost in 2026.
              </p>

              <h3 className={SUB_HEADING}>A practical conversion threshold?</h3>
              <p>
                The data is consistent with a practical conversion threshold
                near the high-20s in this cycle. The 3 wins all entered with
                NDA-2021 base ≥ 29%. The largest single-cycle Δ in the cohort —{" "}
                <SeatLink ac={93}>Pala</SeatLink> at +18.2pp — didn't convert
                because the base was 7.9%.{" "}
                <SeatLink ac={111}>Thiruvalla</SeatLink> (+14.5pp) ended at
                30.7% but started from 16.2% and lost too.{" "}
                <strong>
                  Large swings alone weren't sufficient unless the seat already
                  entered the cycle near a winning share.
                </strong>
              </p>
              <p className={ASIDE}>
                With n=3 wins this is suggestive, not proven. The threshold
                could move next cycle if other factors shift; what's robust is
                the pattern that base + meaningful Δ converted, while large Δ
                from a low base did not.
              </p>
            </CohortSection>

            {/* SECTION 3 — Low-base breakouts */}
            <CohortSection
              id="low-base-breakouts"
              heading="Low-base breakouts"
              mapSide="right"
              map={
                <CohortMap
                  valueByAC={cohort3Values}
                  acs={COHORT_3_ACS}
                  color="#0891B2"
                  ariaLabel="Low-base breakouts — 3 seats"
                  acNameLookup={acNameLookup}
                  badgeLabel="breakout"
                />
              }
              mapCaption="3 seats — Pala (Kottayam), Karunagappally (Kollam), Varkala (Trivandrum). Each represents a different mechanism."
            >
              <p className={DEFINITION}>
                2021 effective NDA baseline &lt; 10% AND BJP Δ ≥ +10pp in 2026.
                3 seats qualify.
              </p>
              <p>
                Low-base breakouts are a different story from{" "}
                <CohortLink slug="mature-growers">mature growers</CohortLink>.
                These are seats where BJP went from near-zero to a meaningful
                share in one cycle — usually because of a specific lever (a
                marquee candidate, an alliance slot rotation, or an organic
                local base finding the party).
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      District
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      H/C/M
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2021
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2026
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      Δ
                    </TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      Outcome
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COHORT_3_ROWS.map((r) => (
                    <Fragment key={r.ac}>
                      <TableRow className="border-b-0">
                        <TableCell className={COMPACT_CELL_CLASS}>
                          <SeatLink ac={r.ac}>{r.seat}</SeatLink>
                        </TableCell>
                        <TableCell className={COMPACT_CELL_CLASS}>
                          {r.district}
                        </TableCell>
                        <TableCell
                          className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                        >
                          {r.hcm}
                        </TableCell>
                        <TableCell
                          className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                        >
                          {r.base21.toFixed(1)}%{" "}
                          <span className="text-[10px] text-muted-foreground">
                            ({r.base21Source})
                          </span>
                        </TableCell>
                        <TableCell
                          className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                        >
                          {r.share26.toFixed(1)}%
                        </TableCell>
                        <TableCell
                          className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                        >
                          {fmtPp(r.delta)}
                        </TableCell>
                        <TableCell className={COMPACT_CELL_CLASS}>
                          {r.outcome}
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-transparent">
                        <TableCell
                          colSpan={7}
                          className={cn(
                            "px-2 pt-0 pb-3 text-[12.5px] whitespace-normal text-muted-foreground italic"
                          )}
                        >
                          <span className="mr-1.5 rounded-sm bg-muted/60 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase not-italic">
                            Mechanism
                          </span>
                          {r.mechanism}
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-3">
                <strong>None of the three converted to a win</strong> despite
                +11-18pp jumps. Pala's +18.2pp was the largest single-cycle BJP
                Δ on the entire 140-AC list — and still not enough to flip the
                seat. One-cycle breakouts move the share dial dramatically but
                don't necessarily win the seat.
              </p>
              <p>
                Three different mechanisms within "new growth from low base":
                marquee Christian candidate at a Christian-majority seat (Pala);
                organic build from a real BJP base (Karunagappally); alliance-
                vehicle slot rotation BDJS → BJP (Varkala) — the Δ here is
                partly the alliance-vehicle effect, not pure new-voter movement.
              </p>
            </CohortSection>

            {/* SECTION 4 — Declining mature */}
            <CohortSection
              id="declining-mature"
              heading="Declining mature"
              mapSide="left"
              map={
                <CohortMap
                  valueByAC={cohort4aValues}
                  acs={COHORT_4A_ACS}
                  color="#DC2626"
                  ariaLabel="Declining-mature seats"
                  acNameLookup={acNameLookup}
                  badgeLabel="declining"
                />
              }
              mapCaption="8 seats. Heavy clustering in Thrissur (3 seats), the Kottayam/Pathanamthitta Christian belt (Konni, Poonjar), plus scattered erosions at Kasaragod, Mavelikkara, Shornur."
            >
              <p className={DEFINITION}>
                2021 effective NDA baseline ≥ 20% AND Δ21-26 ≤ −2pp. 8 seats
                qualify.
              </p>
              <p>
                This is the negative mirror of{" "}
                <CohortLink slug="mature-growers">mature growers</CohortLink> —
                the seats where BJP <em>had</em> a mature base (≥20%) and lost
                it. Tells us where the alliance got pushed back rather than
                pushed forward, and which terrain BJP couldn't defend.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      District
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      H/C/M
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2021
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2026
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      Δ
                    </TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      Outcome
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COHORT_4A_ROWS.map((r) => (
                    <TableRow key={r.ac}>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        <SeatLink ac={r.ac}>{r.seat}</SeatLink>
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {r.district}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.hcm}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.base21.toFixed(1)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.share26.toFixed(1)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {fmtPp(r.delta)}
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {r.outcome}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-3">
                <strong>
                  75% of declining-mature seats sit in Hindu+Christian terrain.
                </strong>{" "}
                Where BJP fielded marquee Christian candidates in similar
                terrain (Pala +18pp, Thiruvalla +14pp — see{" "}
                <CohortLink slug="mature-growers">mature growers</CohortLink>),
                it gained. Where it fielded non-marquee candidates in this same
                kind of seat, it declined.
              </p>
              <p>
                5 of the 8 are Hindu+Christian (Konni 33% C, Thrissur 39%,
                Mavelikkara 18%, Irinjalakuda 26%, Pudukkad 35%); one more is
                Christian-mixed (Poonjar 41%). 6 of 8 sit in seats with
                significant Christian populations.
              </p>
              <p>
                <strong>Special case — Thrissur with Padmaja Venugopal.</strong>{" "}
                She ran at Thrissur in 2016 as INC (37%) and defected to BJP for
                2026 (23.3%). BJP itself fielded both years, but the seat
                declined 8pp — defection alone didn't translate to a
                marquee-Christian uplift here.
              </p>
            </CohortSection>

            {/* SECTION 5 — Wave-capture, paginated */}
            <CohortSection
              id="wave-capture"
              heading="Wave-capture"
              mapSide="right"
              map={
                <CohortMap
                  valueByAC={cohort6Values}
                  acs={COHORT_6_ACS}
                  color="#D97706"
                  ariaLabel="Wave-capture — 21 seats where NDA out-captured UDF in the anti-LDF wave"
                  acNameLookup={acNameLookup}
                  badgeLabel="wave-capture"
                />
              }
              mapCaption="21 seats spread across the state — clusters in Trivandrum, Thrissur, and Kottayam, with isolated cases in Kannur, Wayanad, Palakkad, Ernakulam, Kasaragod, and Kozhikode."
            >
              <p className={DEFINITION}>
                NDA Δ21-26 &gt; UDF Δ21-26 AND NDA 2026 share ≥ 15% AND LDF
                Δ21-26 &lt; 0. 21 seats qualify — NDA out-captured UDF in the
                anti-LDF wave.
              </p>
              <p>
                This may be the clearest window into BJP's competitive terrain.
                It isolates the seats where NDA out-captured UDF in the
                redistribution of LDF voters — the ~15% of Kerala where the
                anti-LDF wave landed on NDA rather than UDF, against the
                statewide pattern.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      District
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      NDA 2021
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      NDA 2026
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      NDA Δ
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      UDF Δ
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      LDF Δ
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      Gap
                    </TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      Outcome
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cohort6Visible.map((r) => (
                    <TableRow
                      key={r.ac}
                      className={r.highlight ? HIGHLIGHT_ROW_CLASS : ""}
                    >
                      <TableCell className={COMPACT_CELL_CLASS}>
                        <SeatLink ac={r.ac}>{r.seat}</SeatLink>
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {r.district}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.nda21.toFixed(1)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.nda26.toFixed(1)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {fmtPp(r.ndaD)}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {fmtPp(r.udfD)}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {fmtPp(r.ldfD)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          COMPACT_CELL_CLASS,
                          NUM_CELL_CLASS,
                          "font-semibold"
                        )}
                      >
                        {fmtPp(r.gap)}
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {r.outcome}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {COHORT_6_ROWS.length > COHORT_6_INITIAL && (
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {showAllCohort6
                      ? `Showing all ${COHORT_6_ROWS.length} rows.`
                      : `Showing top ${COHORT_6_INITIAL} of ${COHORT_6_ROWS.length} rows by gap.`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAllCohort6((v) => !v)}
                    className="rounded-sm border border-foreground/20 bg-card px-2.5 py-1 font-medium text-foreground hover:bg-muted"
                  >
                    {showAllCohort6
                      ? "Collapse"
                      : `Show all ${COHORT_6_ROWS.length} rows`}
                  </button>
                </div>
              )}
              <p className="mt-3">
                <strong>
                  All 3 BJP wins sit in this set, but conversion required
                  additional factors.
                </strong>{" "}
                <SeatLink ac={93}>Pala</SeatLink> had the largest gap (+31.1pp)
                and didn't win — wave-capture alone wasn't sufficient. The 3
                wins sit in the lower half of the gap distribution; what
                distinguishes them from the 18 non-wins in this set is the
                mature base they already had going in (see{" "}
                <CohortLink slug="mature-growers">mature growers</CohortLink>).
              </p>
              <p>
                Geographic concentration in Trivandrum (5 seats), Thrissur (5
                seats), and Kottayam (2 seats) — over half the cohort sits in
                three districts. Outside those clusters, single-seat appearances
                in Kannur, Wayanad, Palakkad, Ernakulam, Kasaragod, and
                Kozhikode.
              </p>
            </CohortSection>

            {/* SECTION 6 — Negative space (5a + 5b) */}
            <section className="border-t pt-10">
              <h2 className="mb-3 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                Negative space — where BJP doesn't compete
              </h2>
              <p className={cn(SECTION_LEAD, "mb-6 max-w-prose")}>
                Two distinct archetypes of non-engagement: seats where BJP{" "}
                <em>chose</em> to stay out by alliance-management (
                <em>strategic abstention</em>), and seats where BJP/NDA has{" "}
                <em>never</em> broken into double digits across three cycles (
                <em>structural exclusion</em>).
              </p>
            </section>

            <CohortSection
              id="strategic-abstention"
              heading="Strategic abstention"
              mapSide="left"
              map={
                <CohortMap
                  valueByAC={cohort5aValues}
                  acs={COHORT_5A_ACS}
                  color="#8B5CF6"
                  ariaLabel="Strategic-abstention seats highlighted"
                  acNameLookup={acNameLookup}
                  badgeLabel="abstention"
                />
              }
              mapCaption="14 seats where BJP fielded zero candidates across 2016, 2021, 2026. Concentrations along the Alappuzha coast, in Idukki, and in Ernakulam."
            >
              <p className={DEFINITION}>
                BJP fielded zero candidates across the three recent elections
                (2016, 2021, 2026). 14 seats qualify. NDA-aligned vehicles
                (BDJS, Twenty 20) hold the slot — typically 5-15% — but BJP
                itself stays out by deliberate alliance-management.
              </p>
              <p>
                These seats expose the "BJP-the-party vs NDA-the-alliance"
                distinction. BJP at 0%; the alliance still presents a candidate
                via BDJS or Twenty 20, often clearing 10-15%. Tells us where BJP
                has structurally chosen <em>not</em> to compete directly — even
                when there's a viable NDA presence to be had.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      District
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      H/C/M
                    </TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      2026 vehicle
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COHORT_5A_ROWS.map((r) => (
                    <TableRow key={r.ac}>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        <SeatLink ac={r.ac}>{r.seat}</SeatLink>
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {r.district}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.hcm}
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {r.vehicle} {r.share.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-3">
                <strong>NDA grew +2.07pp in this cohort</strong> entirely
                through ally expansion (BDJS / T20). BJP itself never appeared.
                The alliance is moving the needle in seats BJP has decided to
                sit out.
              </p>
              <p>
                12 of 14 seats have Christian share ≥ 13%; half have ≥ 23%. No
                Muslim-majority seats here — strategic abstention is a
                Christian-mixed-terrain story. Geographic clusters: Alappuzha
                coast (4, all BDJS), Idukki hill (2, both BDJS), Ernakulam (2),
                Thrissur (2).
              </p>
            </CohortSection>

            <CohortSection
              id="structural-exclusion"
              heading="Structural exclusion"
              mapSide="right"
              map={
                <CohortMap
                  valueByAC={cohort5bValues}
                  acs={COHORT_5B_ACS}
                  color="#991B1B"
                  ariaLabel="Structural-exclusion seats highlighted"
                  acNameLookup={acNameLookup}
                  badgeLabel="exclusion"
                />
              }
              mapCaption="19 seats where BJP+BDJS aggregate has stayed under 8% across 2016, 2021, 2026. Malappuram dominance: 9 of 19 seats in this single district."
            >
              <p className={DEFINITION}>
                BJP+BDJS aggregate &lt; 8% across all three cycles. 19 seats
                qualify. Effort applied (BJP fielded sometime in many of these),
                no traction.
              </p>
              <p>
                This is the floor of NDA's footprint. Even where BJP{" "}
                <em>does</em> field, the alliance can't crack double digits
                across three cycles. Tells us where the structural ceiling for
                NDA is roughly zero — and contrasts with{" "}
                <CohortLink slug="strategic-abstention">
                  strategic abstention
                </CohortLink>
                , where the ceiling exists but BJP has decided to hand the seat
                to BDJS or T20.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      District
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      H/C/M
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2016
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2021
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2026
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COHORT_5B_ROWS.map((r) => (
                    <TableRow key={r.ac}>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        <SeatLink ac={r.ac}>{r.seat}</SeatLink>
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {r.district}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.hcm}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.v2016.toFixed(1)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.v2021.toFixed(1)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.v2026.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-3">
                <strong>BJP fell −2.17pp in 2026</strong> in this cohort — the
                alliance is getting <em>thinner</em> in this terrain, not
                building. Effort applied; no traction. NDA aggregate barely
                moved (+0.27pp) despite BDJS and small partners trying to fill
                the gap.
              </p>
              <p>
                13 of 19 seats are Muslim-dominant terrain (10 Muslim-majority +
                3 Hindu+Muslim). 9 of 19 are in Malappuram district alone — 56%
                of Malappuram's 16 ACs are persistently weak NDA across three
                cycles.
              </p>
            </CohortSection>

            {/* SECTION 7 — Why the statewide number misleads */}
            <section
              id="vote-share-decomposition"
              className="scroll-mt-20 border-t pt-10"
            >
              <h2 className="mb-2 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                Statewide is the wrong lens
              </h2>
              <p className={cn(SECTION_LEAD, "mb-6 max-w-prose")}>
                The statewide BJP figure (+0.3pp) looks almost flat. But that
                single number averages together three very different terrains: a
                30-seat target universe where BJP grew strongly, a neutral
                middle where movement was limited, and an abstention-or-
                exclusion set where BJP either declined or didn't field. The
                right question isn't "how much did BJP grow statewide?" but
                "where did BJP choose to compete, and what happened there?"
              </p>

              {/* Subsection 1 — Three lenses */}
              <h3 className={cn(SUB_HEADING, "mt-6 mb-3")}>
                Same election, three stories
              </h3>
              <p className="mb-3 max-w-prose text-sm leading-relaxed">
                The same election produces three very different stories
                depending on the lens used. Read top-to-bottom, each lens strips
                away seats where BJP either didn't compete or was structurally
                weak.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Lens</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      Meaning
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      n
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      BJP Δ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {THREE_LENSES.map((r, i) => (
                    <TableRow
                      key={r.lens}
                      className={
                        i === THREE_LENSES.length - 1 ? HIGHLIGHT_ROW_CLASS : ""
                      }
                    >
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, "font-medium")}
                      >
                        {r.lens}
                      </TableCell>
                      <TableCell
                        className={cn(
                          COMPACT_CELL_CLASS,
                          "whitespace-normal text-muted-foreground"
                        )}
                      >
                        {r.meaning}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.n}
                      </TableCell>
                      <TableCell
                        className={cn(
                          COMPACT_CELL_CLASS,
                          NUM_CELL_CLASS,
                          "font-semibold"
                        )}
                      >
                        {fmtPp(r.bjpDelta)}pp
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Subsection 2 — Trading breadth for intensity */}
              <h3 className={cn(SUB_HEADING, "mt-8 mb-3")}>
                Trading breadth for intensity
              </h3>
              <p className="mb-3 max-w-prose text-base leading-relaxed font-medium text-foreground sm:text-[15.5px]">
                BJP shrank its footprint while raising per-seat share — fewer
                seats contested directly, higher share where contested.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Party</TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2021 fielded
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2021 share-where-fielded
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2026 fielded
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2026 share-where-fielded
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FOOTPRINT.map((r) => (
                    <TableRow
                      key={r.party}
                      className={r.party === "BJP" ? HIGHLIGHT_ROW_CLASS : ""}
                    >
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, "font-medium")}
                      >
                        {r.party}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.fielded21}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.share21.toFixed(2)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.fielded26}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.share26.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-3 max-w-prose text-sm leading-relaxed">
                BJP fielded 98 candidates in 2026, down from 115 (−15%); average
                share where contested rose from 13.74% to 16.50%. T20 more than
                doubled its footprint (8 → 19 ACs); per-fielded share dropped
                because the new ACs are thinner terrain, but aggregate impact
                grew. BDJS held footprint steady with a small per-fielded
                uptick.
              </p>

              {/* Subsection 3 — Where the growth lives */}
              <h3 className={cn(SUB_HEADING, "mt-8 mb-3")}>
                Where the growth lives
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      Partition
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      n
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      BJP Δ
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      NDA Δ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PARTITIONS.map((r, i) => (
                    <TableRow
                      key={r.partition}
                      className={i === 0 ? HIGHLIGHT_ROW_CLASS : ""}
                    >
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, "font-medium")}
                      >
                        {r.partition}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.n}
                      </TableCell>
                      <TableCell
                        className={cn(
                          COMPACT_CELL_CLASS,
                          NUM_CELL_CLASS,
                          "font-semibold"
                        )}
                      >
                        {fmtPp(r.bjpDelta)}pp
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {fmtPp(r.ndaDelta)}pp
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-3 max-w-prose text-sm leading-relaxed">
                This is the cleanest single piece of evidence for the
                concentration thesis. BJP's gains weren't distributed across
                Kerala — they concentrated inside the 30-seat targeted subset,
                while the rest of the state was flat-to-negative.
              </p>
              <p className="mt-3 max-w-prose text-sm leading-relaxed">
                <strong>
                  Under first-past-the-post, concentrated growth can convert
                  seats more effectively than thin statewide spread.
                </strong>{" "}
                BJP's 2026 looks less like a broad expansion attempt and more
                like a selective seat-conversion strategy under structural
                constraints.
              </p>

              {/* Subsection 4 — Per-cohort detail */}
              <h3 className={cn(SUB_HEADING, "mt-8 mb-3")}>
                Per-cohort detail
              </h3>
              <p className="mb-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
                The 6 cohorts that make up the targeted, neutral, and
                abstention/exclusion partitions. Click a cohort name to jump
                back to its detail.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Cohort</TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      n
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      BJP 2021
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      BJP 2026
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      BJP Δ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COHORT_BREAKDOWN.map((r) => (
                    <TableRow key={r.name}>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        <CohortLink slug={r.slug}>{r.name}</CohortLink>
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.n}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.bjp21.toFixed(2)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.bjp26.toFixed(2)}%
                      </TableCell>
                      <TableCell
                        className={cn(
                          COMPACT_CELL_CLASS,
                          NUM_CELL_CLASS,
                          "font-semibold"
                        )}
                      >
                        {fmtPp(r.bjp26 - r.bjp21)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Subsection 5 — Alliance arithmetic */}
              <h3 className={cn(SUB_HEADING, "mt-8 mb-3")}>
                Alliance arithmetic
              </h3>
              <p className="mb-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
                Supporting detail: how the three NDA constituents added up. NDA
                grew +2.05pp statewide while BJP itself was flat — the
                difference came from T20's expansion.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Party</TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2021
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      2026
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      Δ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PARTY_DECOMPOSITION.map((r) => (
                    <TableRow key={r.abbrev}>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        <span className="font-medium">{r.abbrev}</span>{" "}
                        <span className="text-muted-foreground">
                          ({r.party})
                        </span>
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.v2021.toFixed(2)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {r.v2026.toFixed(2)}%
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {fmtPp(r.v2026 - r.v2021)}pp
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/40 font-semibold">
                    <TableCell className={COMPACT_CELL_CLASS}>
                      NDA total
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      {NDA_TOTAL_2021.toFixed(2)}%
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      {NDA_TOTAL_2026.toFixed(2)}%
                    </TableCell>
                    <TableCell
                      className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                    >
                      {fmtPp(NDA_TOTAL_2026 - NDA_TOTAL_2021)}pp
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            {/* What this does NOT mean — defensive bracketing */}
            <section id="does-not-mean" className="scroll-mt-20 border-t pt-10">
              <h2 className="mb-2 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                What this does <em>not</em> mean
              </h2>
              <p className={cn(SECTION_LEAD, "mb-5 max-w-prose")}>
                The cohort patterns above are real but bounded. Things they{" "}
                <em>don't</em> say:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed sm:text-[15px]">
                <li>
                  <strong>BJP is not broadly competitive statewide.</strong>{" "}
                  Three wins concentrated in adjacent districts is a long way
                  from a statewide presence. The flat ~+0.3pp aggregate is the
                  truer statewide picture; the +5pp inside the targeted set is a
                  ~21%-of-Kerala phenomenon.
                </li>
                <li>
                  <strong>
                    Large one-cycle swings do not automatically convert seats.
                  </strong>{" "}
                  <SeatLink ac={93}>Pala</SeatLink> (+18.2pp),{" "}
                  <SeatLink ac={111}>Thiruvalla</SeatLink> (+14.5pp), and{" "}
                  <SeatLink ac={101}>Poonjar</SeatLink> (+22.9pp NDA Δ) all
                  moved dramatically and still lost.
                </li>
                <li>
                  <strong>
                    Statewide aggregates can hide intense local concentration.
                  </strong>{" "}
                  The same +0.30pp BJP statewide figure is consistent with both
                  "BJP barely moved" and "BJP grew sharply in a small subset" —
                  the cohort decomposition shows it's the second story, not the
                  first.
                </li>
                <li>
                  <strong>
                    Demographic correlations are not causal claims.
                  </strong>{" "}
                  Hindu-heavy seats are over-represented in the wins, but the
                  data is constituency-level, not voter-level. Multiple
                  voter-level mechanisms are consistent with the same AC pattern
                  (see methodology).
                </li>
                <li>
                  <strong>
                    Candidate effects and alliance-slot effects remain
                    confounders.
                  </strong>{" "}
                  Marquee candidates (Rajeev Chandrasekhar, V. Muraleedharan,
                  Shone George, Anoop Antony, P.C. George) plausibly contribute
                  to the share movements — separating "candidate" from
                  "demographic terrain" from "alliance slot" needs voter-level
                  data we don't have.
                </li>
                <li>
                  <strong>
                    These cohorts are this-cycle observations, not durable laws.
                  </strong>{" "}
                  Cohort membership and the conversion threshold could move in
                  2031 if base shares shift, slot allocations rotate, or the
                  candidate set changes substantially.
                </li>
              </ul>
            </section>

            {/* Methodology + cross-references */}
            <section
              id="methodology"
              className="scroll-mt-20 border-t pt-8 text-xs leading-relaxed text-muted-foreground"
            >
              <h2 className="mb-2 font-heading text-base font-semibold tracking-tight text-foreground">
                Methodology
              </h2>
              <p>
                <strong className="font-medium text-foreground/80">
                  Effective baselines.
                </strong>{" "}
                Comparing 2016/2021/2026 BJP-only shares produces misleading
                deltas when BJP didn't field but BDJS/Twenty 20 did, or when the
                same individual ran under a different party. We compute an
                effective NDA baseline at each AC for each cycle in priority
                order: BJP share if BJP fielded; same-individual share under any
                party (e.g. P.C. George at Poonjar — Independent 2016, KJS 2021,
                BJP 2026); BDJS share; Twenty 20 share; 0% otherwise. Candidate
                continuity is resolved via{" "}
                <code className="font-mono text-[11px]">
                  data/candidate-aliases.json
                </code>
                .
              </p>
              <p className="mt-3">
                <strong className="font-medium text-foreground/80">
                  2021 alliance attribution.
                </strong>{" "}
                JD(S), LJD, NCP small-ally allocations to LDF in 2021 are
                credited to LDF (not OTHER) via per-candidate{" "}
                <code className="font-mono text-[11px]">alliance</code>{" "}
                attribution in{" "}
                <code className="font-mono text-[11px]">data/historical/</code>.
              </p>
              <p className="mt-4">
                <strong className="font-medium text-foreground/80">
                  Source markdown:
                </strong>{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/bjp-performance-walkthrough.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={PROSE_LINK_CLASS}
                >
                  bjp-performance-walkthrough.md
                </a>
                . Companion cards on GitHub:{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/bjp-strongest-seats.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={PROSE_LINK_CLASS}
                >
                  bjp-strongest-seats
                </a>
                ,{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/bjp-hindu-vote-decomposition.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={PROSE_LINK_CLASS}
                >
                  bjp-hindu-vote-decomposition
                </a>
                ,{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/bjp-priority-seats.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={PROSE_LINK_CLASS}
                >
                  bjp-priority-seats
                </a>
                .
              </p>
              <p className="mt-3">
                Drill into individual seat data on{" "}
                <ProseLink to="/explore">/explore</ProseLink>, or browse
                BJP-related questions on{" "}
                <ProseLink to="/questions">/questions</ProseLink>.
              </p>
            </section>
          </div>
          <PageRail />
        </div>
      </PageMain>
    </PageShell>
  )
}
