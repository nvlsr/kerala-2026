import { Link } from "react-router-dom"

import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { ComparisonBar } from "@/components/charts/comparison-bar"
import { ScatterWithTrend } from "@/components/charts/scatter-with-trend"
import { CohortSection } from "@/components/walkthroughs/cohort-section"
import { ConfidenceBadge } from "@/components/walkthroughs/confidence-badge"
import { MethodologyPopover } from "@/components/walkthroughs/methodology-popover"
import { SeatLink } from "@/components/walkthroughs/prose-link"
import { SeeAlsoQuestions } from "@/components/walkthroughs/see-also-questions"
import {
  COMPACT_CELL_CLASS,
  COMPACT_HEAD_CLASS,
  HIGHLIGHT_ROW_CLASS,
  NUM_CELL_CLASS,
  NUM_HEAD_CLASS,
} from "@/components/walkthroughs/table-classes"
import { ASIDE, SECTION_LEAD } from "@/components/walkthroughs/typography"
import { WalkthroughSection } from "@/components/walkthroughs/walkthrough-section"
import { PageRail } from "@/components/walkthroughs/walkthrough-rail"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTriggerButton,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { acDemo2025Meta, districtsMeta } from "@/lib/data/loaders"
import {
  getAllACMetrics,
  getPerACWinner2026,
} from "@/lib/data/walkthrough-metrics"
import { cn } from "@/lib/utils"

import {
  CHRISTIAN_ALLIANCE_C3,
  CHRISTIAN_BELT_36,
  INC_CHRISTIAN_C3,
  INC_HINDU_C3,
  PERFORMANCE_C3,
  PREMIUM_HISTORY,
} from "./walkthroughs-udf-data"

const OUTLIER_AC_NUMBERS = new Set([
  93, // Pala
  101, // Poonjar
  111, // Thiruvalla
  89, // Udumbanchola
  41, // Vengara
  98, // Puthuppally
])

/**
 * The five districts where UDF swept 47-of-47: Idukki, Ernakulam,
 * Wayanad, Malappuram, Kottayam. Drives the binary highlight on the
 * Central-5 sweep choropleth — only ACs in these districts get
 * coloured; the rest of the state is muted.
 */
const CENTRAL_5_DISTRICTS = new Set([
  "idukki",
  "ernakulam",
  "wayanad",
  "malappuram",
  "kottayam",
])

/** Right-rail nav anchors for this page. Each id matches a `<section id="...">` below. */
const RAIL_GROUPS = [
  {
    label: "The geography",
    items: [
      { id: "central-5-sweep", label: "Central-5 sweep" },
      { id: "christian-belt", label: "Christian-belt premium" },
    ],
  },
  {
    label: "The mechanism",
    items: [
      { id: "fptp-amplification", label: "FPTP amplification" },
      { id: "muslim-null", label: "Muslim-share null" },
    ],
  },
  {
    label: "Caveats",
    items: [{ id: "what-would-weaken", label: "What would weaken this" }],
  },
] as const

/**
 * Arc 2 — Central Kerala UDF amplification. The 47-of-47 sweep across
 * 5 districts + the Christian-belt premium (β=+0.19, p=0.008 with
 * district FE) + the FPTP mechanism (UDF seat:vote-share ratio
 * 1.04 → 2.18) that turned a 7pp swing into a 102-seat majority.
 */
export function WalkthroughsUDFPage() {
  const all = getAllACMetrics()
  const winner2026 = getPerACWinner2026()
  const udfWins = new Set<number>()
  for (const [acNumber, alliance] of winner2026.entries()) {
    if (alliance === "UDF") udfWins.add(acNumber)
  }
  // Binary map: 1 if AC is in one of the Central-5 districts, 0 otherwise.
  // UDF won all 47 of these — the sweep IS the cohort, so highlighting
  // by district is equivalent to highlighting UDF wins inside Central-5.
  const central5Acs = new Set<number>()
  for (const m of all) {
    const district = districtsMeta.constituencyToDistrict[String(m.acNumber)]
    if (district && CENTRAL_5_DISTRICTS.has(district)) {
      central5Acs.add(m.acNumber)
    }
  }
  const central5ValueMap = new Map<number, number>()
  for (const m of all) {
    central5ValueMap.set(m.acNumber, central5Acs.has(m.acNumber) ? 1 : 0)
  }

  // Christian-share × UDF Δshare scatter points
  const scatterPoints = all
    .map((m) => {
      const ac = acDemo2025Meta.constituencies[String(m.acNumber)]
      const christianPct = ac?.religions?.christian ?? 0
      return {
        x: christianPct,
        y: m.deltas.UDF,
        acNumber: m.acNumber,
        acName: m.acName,
        highlighted: OUTLIER_AC_NUMBERS.has(m.acNumber),
      }
    })
    .filter((p) => p.x > 0 || p.y !== 0)

  // Seat:vote-share efficiency-flip bars (numbers from
  // vote-efficiency.md card).
  const efficiencyGroups = [
    { label: "UDF 2021", mean: 1.04, n: 41, color: "rgb(31, 119, 180)" },
    { label: "UDF 2026", mean: 2.18, n: 102, color: "rgb(31, 119, 180)" },
    { label: "LDF 2021", mean: 2.19, n: 99, color: "rgb(214, 39, 40)" },
    { label: "LDF 2026", mean: 0.93, n: 35, color: "rgb(214, 39, 40)" },
  ]

  // UDF Δshare by Muslim-share bin (numbers from A1 card)
  const muslimBinGroups = [
    {
      label: "Muslim ≥ 60% (n=16)",
      mean: 8.98,
      n: 16,
      color: "rgb(31, 119, 180)",
    },
    {
      label: "Muslim 40–60% (n=23)",
      mean: 5.76,
      n: 23,
      color: "rgb(31, 119, 180)",
    },
    {
      label: "Muslim 20–40% (n=44)",
      mean: 7.8,
      n: 44,
      color: "rgb(31, 119, 180)",
    },
    {
      label: "Low Muslim (<20%, n=57)",
      mean: 7.03,
      n: 57,
      color: "rgb(31, 119, 180)",
    },
  ]

  return (
    <PageShell
      breadcrumbs={[
        { label: "Walkthroughs", href: "/walkthroughs" },
        { label: "UDF" },
      ]}
      title="Central Kerala provided nearly half of UDF's majority margin"
    >
      <PageMain className="py-6 pb-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div className="min-w-0 space-y-10">
            {/* THESIS LEDE */}
            <section className="rounded-md border bg-card/50 p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Thesis
                </p>
                <ConfidenceBadge level="strong" />
              </div>
              <p className="text-base leading-relaxed font-medium text-foreground sm:text-[16.5px]">
                <strong>
                  UDF's 102-seat majority was concentrated, not statewide.
                </strong>{" "}
                Central Kerala provided 46% of UDF's majority margin via a
                47-of-47 sweep across five districts. Christian-heavy ACs added
                a robust ~3-4pp premium on top of the statewide ~7pp{" "}
                <Link
                  to="/walkthroughs/ldf-walkthrough"
                  className="font-medium underline-offset-2 hover:underline"
                >
                  anti-LDF wave
                </Link>
                .{" "}
                <strong>
                  FPTP amplified the combined swing into a 2× seat-conversion
                  ratio
                </strong>{" "}
                — doubling UDF's seats-per-vote-share from 1.04 (in 2021) to
                2.18 (in 2026).
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[14.5px]">
                Behind the landslide is a less-romantic finding: UDF didn't win
                mostly on tight margins (median UDF margin was 12.19pp). The
                mechanism is the <strong>seat:vote-share ratio flip</strong> —
                UDF and LDF effectively traded efficiency between cycles. The
                same vote distribution that wasted UDF's votes in 2021 converted
                them in 2026.
              </p>
            </section>

            {/* SECTION 1 — Central-5 sweep */}
            <WalkthroughSection
              id="central-5-sweep"
              heading="Central-5 sweep"
              sectionType="foundational"
              layout="visual-right"
              visual={
                <div className="mx-auto max-w-sm space-y-2">
                  <ChoroplethMap
                    valueByAC={central5ValueMap}
                    colorScale="sequential"
                    domain={[0, 1]}
                    sequentialColor="#1F77B4"
                    ariaLabel="Kerala constituencies; the 5 districts where UDF swept 47-of-47 (Idukki, Ernakulam, Wayanad, Malappuram, Kottayam) highlighted in blue"
                    unit=""
                    decimals={0}
                    highlightSeats={central5Acs}
                  />
                </div>
              }
              caption="The 5 districts where UDF swept 47-of-47 — Idukki, Ernakulam, Wayanad, Malappuram, Kottayam — highlighted in blue across the full state. The non-contiguous geography is itself part of the story."
            >
              <p className={SECTION_LEAD}>
                <strong>Five districts went UDF in every seat.</strong> 47 of
                47.
              </p>
              <p>
                Idukki, Ernakulam, Wayanad, Malappuram, Kottayam. Pollsters
                expected ~33; UDF got 47.
              </p>
              <p>
                46% of UDF's 102-seat majority came from these 5 districts,
                which contain 34% of Kerala's ACs. Stripping Central-5 from the
                count: UDF would have 55 seats.{" "}
                <strong>
                  Central Kerala provided the arithmetic difference between a
                  plurality and a majority government.
                </strong>
              </p>
            </WalkthroughSection>

            {/* SECTION 2 — Christian-belt premium */}
            <CohortSection
              id="christian-belt"
              heading="The Christian-belt premium"
              mapSide="left"
              map={
                <ScatterWithTrend
                  points={scatterPoints}
                  xLabel="Christian share (%)"
                  yLabel="UDF Δshare (pp)"
                  xUnit="%"
                  yUnit="pp"
                  showTrend
                  pointColor="rgb(31, 119, 180)"
                  ariaLabel="Christian share vs UDF Δshare, 140 ACs"
                />
              }
              mapCaption="Each dot is one of 140 ACs. Christian-heavy ACs (right side of x-axis) cluster above the trend, showing the premium on top of the statewide wave."
            >
              <p className={SECTION_LEAD}>
                <strong>
                  In ACs with high Christian share, UDF's vote share has run
                  ahead of its statewide average in every cycle since 2011 — and
                  in 2026 that gap doubled.
                </strong>{" "}
                Christian-heavy ACs gained an extra ~3–4pp on top of the
                baseline UDF lead they have always had.
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Year</TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      UDF ≥40% Chr
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      UDF statewide
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      Premium
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PREMIUM_HISTORY.map((row) => (
                    <TableRow
                      key={row.year}
                      className={
                        "highlight" in row && row.highlight
                          ? HIGHLIGHT_ROW_CLASS
                          : undefined
                      }
                    >
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {row.year}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {row.udfHigh}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {row.udfStatewide}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {row.premiumRaw}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className={ASIDE}>
                "UDF ≥40% Chr" shows the raw mean / cleaned mean (outliers
                dropped). Premium = raw mean − statewide. Cleaned 2026 premium:
                +6.4pp.
              </p>

              <h3 className="mt-6 font-heading text-base font-semibold">
                UDF's three Christian strategies
              </h3>
              <p>
                Review the 36 Christian-belt ACs to identify UDF's three
                distinct approaches listed below:{" "}
                <Sheet>
                  <SheetTriggerButton>
                    See all 36 Christian-belt ACs →
                  </SheetTriggerButton>
                  <SheetContent
                    side="right"
                    className="sm:max-w-[75vw]"
                  >
                    <SheetHeader>
                      <SheetTitle>
                        The 36 Christian-belt ACs (≥30% Christian)
                      </SheetTitle>
                      <SheetDescription>
                        Sorted by Christian share. Strategy column shows how UDF
                        chose to contest each seat.
                      </SheetDescription>
                    </SheetHeader>
                    <SheetBody>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className={COMPACT_HEAD_CLASS}>
                              District
                            </TableHead>
                            <TableHead className={COMPACT_HEAD_CLASS}>
                              Name
                            </TableHead>
                            <TableHead className={COMPACT_HEAD_CLASS}>
                              H/C/M
                            </TableHead>
                            <TableHead className={COMPACT_HEAD_CLASS}>
                              Res
                            </TableHead>
                            <TableHead className={COMPACT_HEAD_CLASS}>
                              Candidate
                            </TableHead>
                            <TableHead className={COMPACT_HEAD_CLASS}>
                              Party
                            </TableHead>
                            <TableHead
                              className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                            >
                              UDF Δ
                            </TableHead>
                            <TableHead className={COMPACT_HEAD_CLASS}>
                              Won?
                            </TableHead>
                            <TableHead className={COMPACT_HEAD_CLASS}>
                              Strategy
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {CHRISTIAN_BELT_36.map((row) => (
                            <TableRow key={row.ac}>
                              <TableCell className={COMPACT_CELL_CLASS}>
                                {row.district}
                              </TableCell>
                              <TableCell className={COMPACT_CELL_CLASS}>
                                <SeatLink ac={row.ac}>{row.name}</SeatLink>
                              </TableCell>
                              <TableCell
                                className={cn(
                                  COMPACT_CELL_CLASS,
                                  "font-mono tabular-nums"
                                )}
                              >
                                {row.hcm}
                              </TableCell>
                              <TableCell className={COMPACT_CELL_CLASS}>
                                {row.reservation ?? "—"}
                              </TableCell>
                              <TableCell className={COMPACT_CELL_CLASS}>
                                {row.candidate}{" "}
                                <span className="text-muted-foreground">
                                  ({row.candidateReligion})
                                </span>
                              </TableCell>
                              <TableCell className={COMPACT_CELL_CLASS}>
                                {row.party}
                              </TableCell>
                              <TableCell
                                className={cn(
                                  COMPACT_CELL_CLASS,
                                  NUM_CELL_CLASS
                                )}
                              >
                                {row.udfDelta > 0
                                  ? `+${row.udfDelta.toFixed(1)}`
                                  : row.udfDelta.toFixed(1)}
                              </TableCell>
                              <TableCell className={COMPACT_CELL_CLASS}>
                                {row.wonNote ?? (row.won ? "won" : "lost")}
                              </TableCell>
                              <TableCell className={COMPACT_CELL_CLASS}>
                                {row.strategy}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </SheetBody>
                  </SheetContent>
                </Sheet>
              </p>

              <h3 className="mt-6 font-heading text-base font-semibold">
                Christian Alliance — KEC or KC-Jacob
              </h3>
              <p className={ASIDE}>
                UDF gave these seat to a Christian-affiliated alliance partner.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      Party (full)
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      Party 2021
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      Party 2026
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      UDF Δ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CHRISTIAN_ALLIANCE_C3.map((row) => (
                    <TableRow key={row.ac}>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        <SeatLink ac={row.ac}>{row.name}</SeatLink>
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {row.partyFull}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {row.party2021.toFixed(1)}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {row.party2026.toFixed(1)}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        +{row.udfDelta.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <h3 className="mt-6 font-heading text-base font-semibold">
                INC-Christian — INC fields a Christian candidate
              </h3>
              <p className={ASIDE}>
                INC contested itself with a Christian candidate.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      Candidate
                    </TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>H/C/M</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>Res</TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      UDF Δ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INC_CHRISTIAN_C3.map((row) => (
                    <TableRow key={row.ac}>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        <SeatLink ac={row.ac}>{row.name}</SeatLink>
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {row.candidate}
                      </TableCell>
                      <TableCell
                        className={cn(
                          COMPACT_CELL_CLASS,
                          "font-mono tabular-nums"
                        )}
                      >
                        {row.hcm}
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {row.reservation ?? "—"}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        +{row.udfDelta.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <h3 className="mt-6 font-heading text-base font-semibold">
                INC-Hindu — INC fields a Hindu candidate
              </h3>
              <p className={ASIDE}>
                INC contested with a Hindu candidate at seats where the Hindu
                share matched or exceeded the Christian share.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      Candidate
                    </TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>H/C/M</TableHead>
                    <TableHead className={COMPACT_HEAD_CLASS}>Res</TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      UDF Δ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INC_HINDU_C3.map((row) => (
                    <TableRow key={row.ac}>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        <SeatLink ac={row.ac}>{row.name}</SeatLink>
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {row.candidate}
                      </TableCell>
                      <TableCell
                        className={cn(
                          COMPACT_CELL_CLASS,
                          "font-mono tabular-nums"
                        )}
                      >
                        {row.hcm}
                      </TableCell>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        {row.reservation ?? "—"}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {row.udfDelta > 0
                          ? `+${row.udfDelta.toFixed(1)}`
                          : row.udfDelta.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <h3 className="mt-6 font-heading text-base font-semibold">
                Performance in Christian Districts
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={COMPACT_HEAD_CLASS}>
                      Strategy
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      n
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      Won
                    </TableHead>
                    <TableHead
                      className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}
                    >
                      Mean ΔUDF
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PERFORMANCE_C3.map((row) => (
                    <TableRow key={row.strategy}>
                      <TableCell className={COMPACT_CELL_CLASS}>
                        <strong>{row.strategy}</strong>
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {row.n}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        {row.won}
                      </TableCell>
                      <TableCell
                        className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
                      >
                        +{row.meanUdfDelta.toFixed(1)}pp
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className={ASIDE}>Statewide ΔUDF reference: ~+7pp.</p>

              <p className="mt-4">
                <strong>
                  Christians voted Congress, not a Christian candidate or a
                  Christian party.
                </strong>{" "}
                Where UDF contested directly via INC — with a Hindu or a
                Christian — it gained ~3pp more than where it ceded the seat
                to its Christian ally KEC.
              </p>
            </CohortSection>

            {/* SECTION 3 — FPTP amplification */}
            <WalkthroughSection
              id="fptp-amplification"
              heading="FPTP amplification"
              sectionType="mechanism"
              layout="visual-left"
              visual={
                <ComparisonBar
                  groups={efficiencyGroups}
                  yUnit=""
                  yDecimals={2}
                  ariaLabel="Seats per percentage point of statewide vote share — UDF and LDF, 2021 vs 2026"
                  yDomain={[0, 2.5]}
                />
              }
              caption="Seats won per percentage point of statewide vote share. UDF and LDF effectively traded efficiency between cycles. Higher = more seats per vote."
            >
              <p className={SECTION_LEAD}>
                <strong>
                  FPTP near threshold doubled UDF's seats-per-vote.
                </strong>{" "}
                A 7pp swing produced 61 additional UDF seats — six times the
                proportional rate.
              </p>
              <p>
                The mechanism: Kerala's vote distribution sat close to 50/50 in
                many ACs in 2021, and a uniform 7pp swing crossed those
                thresholds simultaneously.
              </p>
              <p>
                UDF's seats-per-vote-share ratio more than doubled (1.04 →
                2.18). LDF's halved (2.19 → 0.93). The two alliances effectively
                swapped efficiency. Under a counterfactual where 2021 vote
                shares had held statewide, UDF would have won 44 seats — not
                102. About 58 of UDF's 102 seats are amplification beyond what
                proportional representation would produce.
              </p>
              <p>
                The combination is what produced the landslide. The{" "}
                <Link
                  to="/walkthroughs/ldf-walkthrough"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  anti-LDF wave
                </Link>{" "}
                supplied the swing; Central-5's geography (sitting near
                threshold) routed it into seat conversion. Neither alone
                explains a 102-35-3 split — together they do.
              </p>
            </WalkthroughSection>

            {/* SECTION 4 — Muslim-share null (falsification) */}
            <WalkthroughSection
              id="muslim-null"
              heading="Muslim share didn't add a separate premium"
              sectionType="falsification"
              layout="visual-right"
              visual={
                <ComparisonBar
                  groups={muslimBinGroups}
                  yUnit="pp"
                  yDecimals={1}
                  baseline={7.29}
                  baselineLabel="statewide mean +7.29pp"
                  ariaLabel="UDF Δshare by Muslim-share bin"
                  yDomain={[0, 12]}
                />
              }
              caption="Mean UDF Δshare by Muslim-share bin. Each bar's height shows mean UDF gain across the bin's ACs. Muslim-majority and low-Muslim bins both track the statewide mean."
            >
              <p className={SECTION_LEAD}>
                <strong>
                  Muslim share didn't predict differential UDF swing.
                </strong>{" "}
                The press's "minority consolidation" framing pools two distinct
                phenomena; only one carries constituency-level signal.
              </p>
              <p>
                Muslim-majority ACs (≥60%, n=16) gained +8.98pp UDF — slightly
                above the statewide ~7.3pp baseline but within the noise. The
                40-60% Muslim bin actually gained <em>less</em> (+5.76pp) than
                the low-Muslim bin (+7.03pp). No monotonic relationship.
              </p>
              <p>
                Once we account for{" "}
                <MethodologyPopover term="fixed-effects">
                  district-level differences
                </MethodologyPopover>
                , the Muslim-share coefficient on UDF Δshare collapses to β =
                +0.016 (p = 0.795). Within a district, Muslim share has no
                detectable predictive power. The simple-Pearson signal in the
                raw data was driven entirely by between-district clustering —
                primarily Malappuram. Muslim-heavy ACs participated in the
                LDF→UDF wave at the statewide rate; they didn't supercharge it.
              </p>
              <p className={ASIDE}>
                Numbers from the A1 minority-consolidation analysis. See
                "Underlying analyses" at the bottom for the full derivation.
              </p>
            </WalkthroughSection>

            {/* Cross-references — synthesis pointing at the other walkthroughs */}
            <section className="rounded-md border bg-card/50 p-5 sm:p-6">
              <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Where this connects
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                <li>
                  The supply side of UDF's amplification was the{" "}
                  <Link
                    to="/walkthroughs/ldf-walkthrough"
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    anti-LDF wave
                  </Link>
                  . LDF lost ~7pp uniformly across nearly every constituency;
                  UDF absorbed most of it (98% on average) and FPTP did the
                  rest.
                </li>
                <li>
                  In 21 southern Hindu-heavy seats, UDF lost the absorption
                  competition to NDA. See the{" "}
                  <Link
                    to="/walkthroughs/nda-walkthrough#wave-capture"
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    NDA walkthrough's wave-capture cohort
                  </Link>{" "}
                  — the seats where BJP and UDF directly bid for the same
                  defectors and NDA out-bid.
                </li>
              </ul>
            </section>

            <SeeAlsoQuestions
              items={[
                {
                  id: "udf-gains-christian-heavy",
                  label: "Where did UDF gain most in Christian-heavy seats?",
                  hint: "Direct seat-level evidence on the Christian-belt premium.",
                },
                {
                  id: "ldf-collapse-christian-heavy",
                  label:
                    "Where did LDF collapse most in Christian-heavy seats?",
                  hint: "Mirror image of the UDF gains in the same belt.",
                },
                {
                  id: "udf-gains-muslim-majority",
                  label: "Where did UDF gain most in Muslim-majority seats?",
                  hint: "Cross-checks the 'minority consolidation' framing.",
                },
                {
                  id: "udf-underperformed-christian-heavy",
                  label: "Where did UDF underperform in Christian-heavy seats?",
                  hint: "Negative cases inside the central belt.",
                },
              ]}
            />

            {/* What would weaken this conclusion */}
            <section
              id="what-would-weaken"
              className="scroll-mt-20 border-t pt-8"
            >
              <h2 className="mb-4 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                What would weaken this conclusion
              </h2>
              <ul className="max-w-prose list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <strong className="font-medium text-foreground">
                    Higher-resolution geographic controls
                  </strong>{" "}
                  (sub-district / Lok Sabha constituency FE) showing the
                  Christian-belt premium dissolves at finer geographic
                  resolution — would force a reframe to "central-Kerala region
                  effect" rather than "Christian-share effect."
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Sub-community survey microdata
                  </strong>{" "}
                  showing the Christian-belt premium is concentrated in one
                  denomination (e.g. Latin Catholic Munambam backlash,
                  Syro-Malabar specifically) — would shift the interpretation
                  from a generic Christian shift to a specific community
                  reaction.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    A 2031 Christian-belt revert
                  </strong>{" "}
                  — would suggest 2026 was anti-incumbency channelled through
                  the Christian belt, not a structural re-alignment.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Multi-cycle FPTP analysis showing Kerala's vote distribution
                    doesn't typically sit near threshold
                  </strong>{" "}
                  — would suggest the 2026 amplification was an unusual
                  configuration that won't recur.
                </li>
              </ul>
            </section>

            {/* Underlying analyses (renamed from "Source analyses") */}
            <section className="border-t pt-8 text-xs leading-relaxed text-muted-foreground">
              <p>
                <strong className="font-medium text-foreground">
                  Underlying analyses.
                </strong>{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/a1-minority-consolidation.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  A1 — Minority consolidation
                </a>
                {" · "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/a8-central-kerala-kingmaker.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  A8 — Central Kerala kingmaker
                </a>
                {" · "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/vote-efficiency.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  Vote efficiency
                </a>
                .
              </p>
              <p className="mt-2">
                <strong className="font-medium text-foreground">
                  Explore the data:
                </strong>{" "}
                see the central-Kerala UDF gainers on{" "}
                <Link
                  to="/explore?seat=89"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  Udumbanchola
                </Link>
                ,{" "}
                <Link
                  to="/explore?seat=98"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  Puthuppally
                </Link>
                ,{" "}
                <Link
                  to="/explore?seat=96"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  Ettumanoor
                </Link>
                .
              </p>
            </section>
          </div>
          <PageRail groups={RAIL_GROUPS} />
        </div>
      </PageMain>
    </PageShell>
  )
}
