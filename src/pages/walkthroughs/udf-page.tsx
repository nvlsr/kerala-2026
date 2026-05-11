import { Link } from "react-router-dom"

import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { ScatterWithTrend } from "@/components/charts/scatter-with-trend"
import { CohortSection } from "@/components/walkthroughs/cohort-section"
import {
  CHRISTIAN_BELT_BLUE,
  MUSLIM_BELT_GREEN,
  UDF_BLUE,
} from "@/components/walkthroughs/colors"
import {
  SynthesisCard,
  ThesisLede,
} from "@/components/walkthroughs/eyebrow-card"
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
import { WalkthroughPageShell } from "@/components/walkthroughs/walkthrough-page-shell"
import { WalkthroughSection } from "@/components/walkthroughs/walkthrough-section"
import {
  WhatWouldWeakenSection,
  type Weakener,
} from "@/components/walkthroughs/what-would-weaken"
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
  CENTRAL_3_VIEWBOX,
  CHRISTIAN_ALLIANCE_C3,
  CHRISTIAN_BELT_36,
  INC_CHRISTIAN_C3,
  INC_HINDU_C3,
  INC_MUSLIM_MAL,
  MALAPPURAM_VIEWBOX,
  MUSLIM_ALLIANCE_MAL,
  MUSLIM_PERFORMANCE_MAL,
  MUSLIM_PREMIUM_HISTORY,
  MUSLIM_SPECIAL_MAL,
  MUSLIM_STRATEGY_COLOURS,
  PERFORMANCE_C3,
  PREMIUM_HISTORY,
  STRATEGY_COLOURS,
} from "./udf-data"

const OUTLIER_AC_NUMBERS = new Set([
  93, // Pala
  101, // Poonjar
  111, // Thiruvalla
  89, // Udumbanchola
  41, // Vengara
  98, // Puthuppally
])

/**
 * Christian-belt and Muslim-belt sub-clusters within Central-5.
 * The Central-5 sweep choropleth colours each AC by its sub-cluster
 * to telegraph the two subsequent sections (Christian-belt premium,
 * Muslim-belt premium). Christian-belt = the 3 adjacent southern
 * districts; Muslim-belt = the 2 northern districts.
 */
const CHRISTIAN_BELT_DISTRICTS = new Set(["idukki", "ernakulam", "kottayam"])
const MUSLIM_BELT_DISTRICTS = new Set(["wayanad", "malappuram"])

const WEAKENERS: ReadonlyArray<Weakener> = [
  {
    lead: "Higher-resolution geographic controls",
    rest: '(sub-district / Lok Sabha constituency FE) showing the Christian-belt premium dissolves at finer geographic resolution — would force a reframe to "central-Kerala region effect" rather than "Christian-share effect."',
  },
  {
    lead: "Sub-community microdata",
    rest: "showing the Christian-belt premium is concentrated in one denomination (e.g. Latin Catholic Munambam backlash, Syro-Malabar specifically) — would shift the interpretation from a generic Christian shift to a specific community reaction.",
  },
  {
    lead: "Coalition-arithmetic alternative for the Muslim-belt finding",
    rest: "— the \"INC-Hindu wasn't on the menu\" claim assumes UDF chose who to field. If IUML's seat-share agreement simply doesn't leave non-reserved Malappuram seats for INC to contest with whatever candidate INC wants, the finding becomes coalition bookkeeping, not community-pressure read.",
  },
  {
    lead: "A 2031 reversion in either belt",
    rest: "— would suggest 2026 was anti-incumbency channelled through the central-Kerala belts, not a structural re-alignment.",
  },
  {
    lead: "Candidate-religion misclassification",
    rest: "— religion inferred from name in some cases. Several wrong classifications could shift the strategy bucket means, particularly for the smaller buckets (INC-Muslim n=2; INC-Hindu n=11 in Christian-belt).",
  },
] as const

/** Right-rail nav anchors for this page. Each id matches a `<section id="...">` below. */
const RAIL_GROUPS = [
  {
    label: "The argument",
    items: [
      { id: "central-5-sweep", label: "Central-5 sweep" },
      { id: "christian-belt", label: "Christian-belt premium" },
      { id: "muslim-belt", label: "Muslim-belt premium" },
    ],
  },
  {
    label: "Wrap-up",
    items: [
      { id: "synthesis", label: "Synthesis" },
      { id: "what-would-weaken", label: "What would weaken this" },
    ],
  },
] as const

/**
 * Arc 2 — Central Kerala UDF amplification. The 47-of-47 sweep across
 * 5 districts plus the Christian-belt premium that delivered ~46% of
 * UDF's majority margin.
 */
export function WalkthroughsUDFPage() {
  const all = getAllACMetrics()
  const winner2026 = getPerACWinner2026()
  const udfWins = new Set<number>()
  for (const [acNumber, alliance] of winner2026.entries()) {
    if (alliance === "UDF") udfWins.add(acNumber)
  }
  // Two-belt categorical map for the Central-5 sweep choropleth.
  // Christian-belt districts (Idukki, Ernakulam, Kottayam) get the
  // Christian-belt colour; Muslim-belt districts (Wayanad, Malappuram)
  // get the Muslim-belt colour. Other ACs are absent from the map and
  // render with the default muted/outline fill.
  const central5Acs = new Set<number>()
  const central5Colours = new Map<number, string>()
  const central5ValueMap = new Map<number, number>()
  for (const m of all) {
    const district = districtsMeta.constituencyToDistrict[String(m.acNumber)]
    if (!district) continue
    if (CHRISTIAN_BELT_DISTRICTS.has(district)) {
      central5Acs.add(m.acNumber)
      central5Colours.set(m.acNumber, CHRISTIAN_BELT_BLUE)
      central5ValueMap.set(m.acNumber, 1)
    } else if (MUSLIM_BELT_DISTRICTS.has(district)) {
      central5Acs.add(m.acNumber)
      central5Colours.set(m.acNumber, MUSLIM_BELT_GREEN)
      central5ValueMap.set(m.acNumber, 1)
    }
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

  // Muslim-share × UDF Δshare scatter points (parallel to Christian scatter)
  const muslimScatterPoints = all
    .map((m) => {
      const ac = acDemo2025Meta.constituencies[String(m.acNumber)]
      const muslimPct = ac?.religions?.muslim ?? 0
      return {
        x: muslimPct,
        y: m.deltas.UDF,
        acNumber: m.acNumber,
        acName: m.acName,
        highlighted: false,
      }
    })
    .filter((p) => p.x > 0 || p.y !== 0)

  // Malappuram strategy choropleth data. 15 non-reserved ACs get
  // strategy colours; Wandoor (SC reserved) is absent from the
  // categorical map and therefore renders muted/outline.
  const malappuramStrategyColors = new Map<number, string>()
  const malappuramDeltaMap = new Map<number, number>()
  const malappuramStrategyByAC = new Map<
    number,
    { name: string; strategy: string }
  >()
  for (const r of MUSLIM_ALLIANCE_MAL) {
    malappuramStrategyColors.set(
      r.ac,
      MUSLIM_STRATEGY_COLOURS["Muslim Alliance"]
    )
    malappuramDeltaMap.set(r.ac, r.udfDelta)
    malappuramStrategyByAC.set(r.ac, {
      name: r.name,
      strategy: "Muslim Alliance",
    })
  }
  for (const r of INC_MUSLIM_MAL) {
    malappuramStrategyColors.set(r.ac, MUSLIM_STRATEGY_COLOURS["INC-Muslim"])
    malappuramDeltaMap.set(r.ac, r.udfDelta)
    malappuramStrategyByAC.set(r.ac, { name: r.name, strategy: "INC-Muslim" })
  }
  for (const r of MUSLIM_SPECIAL_MAL) {
    malappuramStrategyColors.set(r.ac, MUSLIM_STRATEGY_COLOURS.Special)
    malappuramDeltaMap.set(r.ac, r.udfDelta)
    malappuramStrategyByAC.set(r.ac, { name: r.name, strategy: "Special" })
  }

  // Strategy choropleth data: each Christian-belt AC maps to its
  // strategy colour and ΔUDF (used for tooltip). Non-Christian-belt
  // ACs in Central-3 (Aluva, Vaikom) get an outline-only / muted
  // treatment by virtue of being absent from the categorical map.
  const christianBeltStrategyColors = new Map<number, string>()
  const christianBeltDeltaMap = new Map<number, number>()
  const central3StrategyByAC = new Map<
    number,
    { name: string; strategy: string }
  >()
  for (const row of CHRISTIAN_BELT_36) {
    const district = row.district.toLowerCase()
    if (
      district !== "idukki" &&
      district !== "ernakulam" &&
      district !== "kottayam"
    )
      continue
    christianBeltStrategyColors.set(row.ac, STRATEGY_COLOURS[row.strategy])
    christianBeltDeltaMap.set(row.ac, row.udfDelta)
    central3StrategyByAC.set(row.ac, {
      name: row.name,
      strategy: row.strategy,
    })
  }

  return (
    <WalkthroughPageShell
      breadcrumbLeaf="UDF"
      title="Central Kerala provided nearly half of UDF's majority margin"
      railGroups={RAIL_GROUPS}
    >
      <ThesisLede confidence="strong">
        <p className="text-base leading-relaxed font-medium text-foreground sm:text-[16.5px]">
          <strong>
            UDF's 102-seat majority was concentrated, not statewide.
          </strong>{" "}
          Two religious belts in central Kerala provided 46% of UDF's majority
          margin via a 47-of-47 sweep across five districts.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[14.5px]">
          The rest of this article is how they did it.
        </p>
      </ThesisLede>

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
              sequentialColor={UDF_BLUE}
              categoricalColors={central5Colours}
              ariaLabel="Kerala constituencies; the 5 districts where UDF swept 47-of-47 highlighted in two colours — blue for the southern Christian belt (Idukki, Ernakulam, Kottayam) and emerald for the northern Muslim belt (Wayanad, Malappuram)"
              unit=""
              decimals={0}
              highlightSeats={central5Acs}
            />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: CHRISTIAN_BELT_BLUE }}
                />
                <span className="text-muted-foreground">Christian belt</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: MUSLIM_BELT_GREEN }}
                />
                <span className="text-muted-foreground">Muslim belt</span>
              </span>
            </div>
          </div>
        }
        caption="The 5 districts where UDF swept 47-of-47, split into two sub-clusters: the southern Christian belt (Idukki, Ernakulam, Kottayam — blue) and the northern Muslim belt (Wayanad, Malappuram — emerald). The two belts are analysed separately in the next two sections."
      >
        <p className={SECTION_LEAD}>
          <strong>Five districts went UDF in every seat.</strong> 47 of 47.
        </p>
        <p>
          Idukki, Ernakulam, Wayanad, Malappuram, Kottayam. Pollsters expected
          ~33; UDF got 47.
        </p>
        <p>
          46% of UDF's 102-seat majority came from these 5 districts, which
          contain 34% of Kerala's ACs. Stripping Central-5 from the count: UDF
          would have 55 seats.{" "}
          <strong>
            Central Kerala provided the arithmetic difference between a
            plurality and a majority government.
          </strong>
        </p>
        <p>
          The 5 districts split into two distinct sub-clusters: the{" "}
          <strong>
            <span style={{ color: CHRISTIAN_BELT_BLUE }}>
              southern Christian belt
            </span>
          </strong>{" "}
          (Idukki, Ernakulam, Kottayam) and the{" "}
          <strong>
            <span style={{ color: MUSLIM_BELT_GREEN }}>
              northern Muslim belt
            </span>
          </strong>{" "}
          (Wayanad, Malappuram). Different communities, different UDF
          strategies, different stories — analysed in turn below.
        </p>
      </WalkthroughSection>

      {/* SECTION 2 — Christian-belt premium */}
      <CohortSection
        id="christian-belt"
        heading="The Christian-belt premium"
        mapSide="left"
        map={
          <div className="space-y-6">
            <div>
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
              <p className="mt-2 text-xs text-muted-foreground">
                Each dot is one of 140 ACs. Christian-heavy ACs (right side of
                x-axis) cluster above the trend, showing the premium on top of
                the statewide wave.
              </p>
            </div>
            <div>
              <ChoroplethMap
                valueByAC={christianBeltDeltaMap}
                colorScale="sequential"
                categoricalColors={christianBeltStrategyColors}
                viewBox={CENTRAL_3_VIEWBOX}
                ariaLabel="Central-3 districts (Idukki, Ernakulam, Kottayam) coloured by UDF's 2026 Christian strategy"
                unit="pp"
                decimals={1}
                tooltipFormat={(acNumber, value) => {
                  const row = central3StrategyByAC.get(acNumber)
                  return (
                    <span>
                      <span className="font-medium">
                        {row?.name ?? `AC ${acNumber}`}
                      </span>
                      {row && (
                        <>
                          {" "}
                          <span className="text-muted-foreground">
                            ({row.strategy})
                          </span>
                          :{" "}
                          {value != null && (
                            <span className="font-mono">
                              {value >= 0 ? "+" : ""}
                              {value.toFixed(1)}pp
                            </span>
                          )}
                        </>
                      )}
                    </span>
                  )
                }}
              />
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                {(
                  Object.entries(STRATEGY_COLOURS) as [
                    keyof typeof STRATEGY_COLOURS,
                    string,
                  ][]
                ).map(([label, color]) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5"
                  >
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-muted-foreground">{label}</span>
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Idukki, Ernakulam, Kottayam — the 3 adjacent central districts.
                ACs with ≥30% Christian share coloured by UDF's 2026 strategy.
                Christian Alliance seats cluster eastern; INC-Hindu hugs
                Ernakulam city; INC-Christian fills the rest.
              </p>
            </div>
          </div>
        }
      >
        <p className={SECTION_LEAD}>
          <strong>
            In ACs with high Christian share, UDF's vote share has run ahead of
            its statewide average in every cycle since 2011 — and in 2026 that
            gap doubled.
          </strong>{" "}
          Christian-heavy ACs gained an extra ~3–4pp on top of the baseline UDF
          lead they have always had.
        </p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={COMPACT_HEAD_CLASS}>Year</TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                UDF ≥40% Chr
              </TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                UDF statewide
              </TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
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
                <TableCell className={COMPACT_CELL_CLASS}>{row.year}</TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.udfHigh}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.udfStatewide}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.premiumRaw}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className={ASIDE}>
          "UDF ≥40% Chr" shows the raw mean / cleaned mean (outliers dropped).
          Premium = raw mean − statewide. Cleaned 2026 premium: +6.4pp.
        </p>

        <h3 className="mt-6 font-heading text-base font-semibold">
          UDF's three Christian strategies
        </h3>
        <p>
          Review the 36 Christian-belt ACs to identify UDF's three distinct
          approaches listed below:{" "}
          <Sheet>
            <SheetTriggerButton>
              See all 36 Christian-belt ACs →
            </SheetTriggerButton>
            <SheetContent side="right" className="sm:max-w-[75vw]">
              <SheetHeader>
                <SheetTitle>
                  The 36 Christian-belt ACs (≥30% Christian)
                </SheetTitle>
                <SheetDescription>
                  Sorted by Christian share. Strategy column shows how UDF chose
                  to contest each seat.
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={COMPACT_HEAD_CLASS}>
                        District
                      </TableHead>
                      <TableHead className={COMPACT_HEAD_CLASS}>Name</TableHead>
                      <TableHead className={COMPACT_HEAD_CLASS}>
                        H/C/M
                      </TableHead>
                      <TableHead className={COMPACT_HEAD_CLASS}>Res</TableHead>
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
                      <TableHead className={COMPACT_HEAD_CLASS}>Won?</TableHead>
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
                          className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}
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
              <TableHead className={COMPACT_HEAD_CLASS}>Party (full)</TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                Party 2021
              </TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                Party 2026
              </TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
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
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.party2021.toFixed(1)}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.party2026.toFixed(1)}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
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
              <TableHead className={COMPACT_HEAD_CLASS}>Candidate</TableHead>
              <TableHead className={COMPACT_HEAD_CLASS}>H/C/M</TableHead>
              <TableHead className={COMPACT_HEAD_CLASS}>Res</TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
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
                  className={cn(COMPACT_CELL_CLASS, "font-mono tabular-nums")}
                >
                  {row.hcm}
                </TableCell>
                <TableCell className={COMPACT_CELL_CLASS}>
                  {row.reservation ?? "—"}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
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
          INC contested with a Hindu candidate at seats where the Hindu share
          matched or exceeded the Christian share.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
              <TableHead className={COMPACT_HEAD_CLASS}>Candidate</TableHead>
              <TableHead className={COMPACT_HEAD_CLASS}>H/C/M</TableHead>
              <TableHead className={COMPACT_HEAD_CLASS}>Res</TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
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
                  className={cn(COMPACT_CELL_CLASS, "font-mono tabular-nums")}
                >
                  {row.hcm}
                </TableCell>
                <TableCell className={COMPACT_CELL_CLASS}>
                  {row.reservation ?? "—"}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
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
              <TableHead className={COMPACT_HEAD_CLASS}>Strategy</TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                n
              </TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                Won
              </TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
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
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.n}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.won}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  +{row.meanUdfDelta.toFixed(1)}pp
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className={ASIDE}>Statewide ΔUDF reference: ~+7pp.</p>

        <p className="mt-4">
          <strong>
            Christians voted Congress, not a Christian candidate or a Christian
            party.
          </strong>{" "}
          Where UDF contested directly via INC — with a Hindu or a Christian —
          it gained ~3pp more than where it ceded the seat to its Christian ally
          KEC.
        </p>
      </CohortSection>

      {/* SECTION 3 — Muslim-belt premium */}
      <CohortSection
        id="muslim-belt"
        heading="The Muslim-belt premium"
        mapSide="left"
        map={
          <div className="space-y-6">
            <div>
              <ScatterWithTrend
                points={muslimScatterPoints}
                xLabel="Muslim share (%)"
                yLabel="UDF Δshare (pp)"
                xUnit="%"
                yUnit="pp"
                showTrend
                pointColor="rgb(31, 119, 180)"
                ariaLabel="Muslim share vs UDF Δshare, 140 ACs"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Each dot is one of 140 ACs. The high-Muslim cluster (right side)
                sits at high UDF baselines but the swing tracks the statewide
                wave — no Christian-belt-style surge.
              </p>
            </div>
            <div>
              <ChoroplethMap
                valueByAC={malappuramDeltaMap}
                colorScale="sequential"
                categoricalColors={malappuramStrategyColors}
                viewBox={MALAPPURAM_VIEWBOX}
                ariaLabel="Malappuram ACs coloured by UDF's 2026 Muslim strategy (non-reserved seats only)"
                unit="pp"
                decimals={1}
                tooltipFormat={(acNumber, value) => {
                  const row = malappuramStrategyByAC.get(acNumber)
                  return (
                    <span>
                      <span className="font-medium">
                        {row?.name ?? `AC ${acNumber}`}
                      </span>
                      {row && (
                        <>
                          {" "}
                          <span className="text-muted-foreground">
                            ({row.strategy})
                          </span>
                          {value != null && (
                            <>
                              :{" "}
                              <span className="font-mono">
                                {value >= 0 ? "+" : ""}
                                {value.toFixed(1)}pp
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </span>
                  )
                }}
              />
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                {(
                  [
                    [
                      "Muslim Alliance",
                      MUSLIM_STRATEGY_COLOURS["Muslim Alliance"],
                    ],
                    ["INC-Muslim", MUSLIM_STRATEGY_COLOURS["INC-Muslim"]],
                    ["Special / excluded", MUSLIM_STRATEGY_COLOURS.Special],
                  ] as [string, string][]
                ).map(([label, color]) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5"
                  >
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-muted-foreground">{label}</span>
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Malappuram non-reserved seats coloured by UDF's 2026 strategy.
                IUML covers nearly the whole district; INC-Muslim contests the
                eastern edge (Nilambur, Ponnani). Wandoor (SC reserved) is
                uncoloured. Wayanad is excluded from this analysis entirely.
              </p>
            </div>
          </div>
        }
      >
        <p className={SECTION_LEAD}>
          <strong>
            The Muslim premium has been large and stable since 2011 —
            Muslim-heavy ACs lead UDF by ~+11pp above its statewide average
            every cycle, and in 2026 the gap nudged up to +12.8pp.
          </strong>{" "}
          Unlike the Christian belt, the Muslim swing in 2026 was wave-sized:
          Muslims rode the wave from a higher baseline rather than surging.
        </p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={COMPACT_HEAD_CLASS}>Year</TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                UDF ≥70% Mus
              </TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                UDF statewide
              </TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                Premium
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MUSLIM_PREMIUM_HISTORY.map((row) => (
              <TableRow
                key={row.year}
                className={
                  "highlight" in row && row.highlight
                    ? HIGHLIGHT_ROW_CLASS
                    : undefined
                }
              >
                <TableCell className={COMPACT_CELL_CLASS}>{row.year}</TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.udfHigh}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.udfStatewide}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.premium}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className={ASIDE}>
          Premium = mean UDF at ≥70% Muslim − mean UDF statewide.
        </p>

        <h3 className="mt-6 font-heading text-base font-semibold">
          UDF's strategies in non-reserved Malappuram
        </h3>
        <p>
          The analysis universe is{" "}
          <strong>Malappuram, non-reserved seats only — 15 ACs</strong>. Wayanad
          (mixed-demographic, two ST seats) and Wandoor (SC reserved) are
          filtered out — reservation forces candidate choice and Wayanad's
          tribal-mixed dynamics don't fit the Muslim-belt frame.
        </p>

        <h3 className="mt-6 font-heading text-base font-semibold">
          Muslim Alliance — IUML (12 seats)
        </h3>
        <p className={ASIDE}>
          UDF gave the seat to its Muslim-affiliated alliance partner.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
              <TableHead className={COMPACT_HEAD_CLASS}>H/C/M</TableHead>
              <TableHead className={COMPACT_HEAD_CLASS}>Candidate</TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                UDF Δ
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MUSLIM_ALLIANCE_MAL.map((row) => (
              <TableRow key={row.ac}>
                <TableCell className={COMPACT_CELL_CLASS}>
                  <SeatLink ac={row.ac}>{row.name}</SeatLink>
                </TableCell>
                <TableCell
                  className={cn(COMPACT_CELL_CLASS, "font-mono tabular-nums")}
                >
                  {row.hcm}
                </TableCell>
                <TableCell className={COMPACT_CELL_CLASS}>
                  {row.candidate}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  +{row.udfDelta.toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <h3 className="mt-6 font-heading text-base font-semibold">
          INC-Muslim — INC fields a Muslim candidate (2 seats)
        </h3>
        <p className={ASIDE}>INC contested itself with a Muslim candidate.</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
              <TableHead className={COMPACT_HEAD_CLASS}>H/C/M</TableHead>
              <TableHead className={COMPACT_HEAD_CLASS}>Candidate</TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                UDF Δ
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INC_MUSLIM_MAL.map((row) => (
              <TableRow key={row.ac}>
                <TableCell className={COMPACT_CELL_CLASS}>
                  <SeatLink ac={row.ac}>{row.name}</SeatLink>
                </TableCell>
                <TableCell
                  className={cn(COMPACT_CELL_CLASS, "font-mono tabular-nums")}
                >
                  {row.hcm}
                </TableCell>
                <TableCell className={COMPACT_CELL_CLASS}>
                  {row.candidate}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  +{row.udfDelta.toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <h3 className="mt-6 font-heading text-base font-semibold">
          INC-Hindu — empty bucket
        </h3>
        <p>
          <strong>
            No non-reserved Muslim-majority Malappuram seat had a Hindu INC
            candidate in 2026.
          </strong>{" "}
          The bucket is empty by strategic choice — see closing.
        </p>

        <h3 className="mt-6 font-heading text-base font-semibold">
          Special — Thavanur (1 seat)
        </h3>
        <p className={ASIDE}>
          INC fielded a Christian candidate at a 67%-Muslim seat. Anomaly.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
              <TableHead className={COMPACT_HEAD_CLASS}>H/C/M</TableHead>
              <TableHead className={COMPACT_HEAD_CLASS}>Candidate</TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                UDF Δ
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MUSLIM_SPECIAL_MAL.map((row) => (
              <TableRow key={row.ac}>
                <TableCell className={COMPACT_CELL_CLASS}>
                  <SeatLink ac={row.ac}>{row.name}</SeatLink>
                </TableCell>
                <TableCell
                  className={cn(COMPACT_CELL_CLASS, "font-mono tabular-nums")}
                >
                  {row.hcm}
                </TableCell>
                <TableCell className={COMPACT_CELL_CLASS}>
                  {row.candidate}{" "}
                  <span className="text-muted-foreground">
                    ({row.religion})
                  </span>
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  +{row.udfDelta.toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <h3 className="mt-6 font-heading text-base font-semibold">
          Performance summary
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={COMPACT_HEAD_CLASS}>Strategy</TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                n
              </TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                Won
              </TableHead>
              <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>
                Mean ΔUDF
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MUSLIM_PERFORMANCE_MAL.map((row) => (
              <TableRow key={row.strategy}>
                <TableCell className={COMPACT_CELL_CLASS}>
                  <strong>{row.strategy}</strong>
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.n}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.n === 0 ? "—" : row.won}
                </TableCell>
                <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>
                  {row.meanUdfDelta == null
                    ? "—"
                    : `+${row.meanUdfDelta.toFixed(1)}pp`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className={ASIDE}>Statewide ΔUDF reference: ~+7pp.</p>

        <p className="mt-4">
          <strong>
            In Muslim-Kerala UDF's playbook had two options — IUML or
            INC-Muslim. INC-Hindu wasn't on the menu.
          </strong>{" "}
          In Christian-belt seats UDF freely mixed candidate religions inside
          INC. In non-reserved Muslim-majority Malappuram, UDF didn't field a
          Hindu candidate in a single seat — either alliance with IUML, or run a
          Muslim INC. The asymmetry IS the strategy.
        </p>
      </CohortSection>

      <SynthesisCard>
        <p className="mt-3 text-sm leading-relaxed">
          The supply side of UDF's amplification was the{" "}
          <Link
            to="/walkthroughs/ldf-walkthrough"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            anti-LDF wave
          </Link>
          . LDF lost ~7pp uniformly across nearly every constituency; UDF
          absorbed most of it (98% on average).
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          In 21 southern Hindu-heavy seats, UDF lost the absorption competition
          to NDA — see the{" "}
          <Link
            to="/walkthroughs/nda-walkthrough#wave-capture"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            NDA walkthrough's wave-capture cohort
          </Link>{" "}
          for the seats where BJP and UDF bid for the same defectors and NDA
          out-bid. But UDF{" "}
          <strong>held strong in the two central-Kerala belts above</strong>,
          catapulting them to a clear majority.
        </p>
      </SynthesisCard>

      <SeeAlsoQuestions
        items={[
          {
            id: "udf-gains-christian-heavy",
            label: "Where did UDF gain most in Christian-heavy seats?",
            hint: "Direct seat-level evidence on the Christian-belt premium.",
          },
          {
            id: "udf-gains-muslim-majority",
            label: "Where did UDF gain most in Muslim-majority seats?",
            hint: "Direct seat-level evidence on the Muslim-belt premium.",
          },
          {
            id: "ldf-collapse-christian-heavy",
            label: "Where did LDF collapse most in Christian-heavy seats?",
            hint: "Mirror image of the UDF gains in the same belt.",
          },
          {
            id: "udf-underperformed-christian-heavy",
            label: "Where did UDF underperform in Christian-heavy seats?",
            hint: "Negative cases inside the central belt.",
          },
        ]}
      />

      <WhatWouldWeakenSection bullets={WEAKENERS} />

      {/* Underlying analyses (renamed from "Source analyses") */}
      <section className="border-t pt-8 text-xs leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-medium text-foreground">
            Underlying analyses.
          </strong>{" "}
          Full data tables (Christian-belt premium history + strategy
          deep-dive, Central-5 kingmaker arithmetic, vote-efficiency
          decomposition, district-FE regressions) live in{" "}
          <a
            href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narratives/udf.md"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            docs/narratives/udf.md
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
    </WalkthroughPageShell>
  )
}
