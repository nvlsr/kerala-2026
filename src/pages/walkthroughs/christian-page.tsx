import { useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"

import {
  ReligionCategoricalMap,
  bucketCounts,
} from "@/components/religion-categorical-map"
import { TrajectoryLines } from "@/components/charts/trajectory-lines"
import {
  CHRISTIAN_SUBRITE_COLORS,
  NO_DATA_GRAY,
} from "@/components/walkthroughs/colors"
import { ThesisLede } from "@/components/walkthroughs/eyebrow-card"
import { SECTION_LEAD } from "@/components/walkthroughs/typography"
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
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Link } from "react-router-dom"
import {
  COHORT_AC_LIST,
  COHORT_BY_AC,
  COHORT_COLOR,
  COHORT_LABEL,
  COHORT_SIZE,
  COHORT_TABLE_ROWS,
  COHORT_TRAJECTORY,
  CYCLE_YEARS,
  LATIN_ZONE_BREAKDOWN,
  M_EVIDENCE,
  REAL_COHORTS,
  type CohortRow,
} from "@/pages/walkthroughs/christian-data"
import type { ChristianSubRiteCohort } from "@/lib/data/subrite-bins"

const WEAKENERS: ReadonlyArray<Weakener> = [
  {
    lead: "Pre-2011 baseline data",
    rest: "showing that Latin Catholic was UDF-leaning in 2001 or 2006 — would convert the 2026 'flip' into 'longer return' framing, and re-merge Story A and Story B.",
  },
  {
    lead: "Individual-level data (exit polls / CSDS microdata)",
    rest: "showing the AC-level swings don't actually map onto sub-rite-community swings. The walkthrough's community claims rest on the structural assumption that AC swings track community behaviour.",
  },
  {
    lead: "A 2031 cycle reversal",
    rest: "where Latin Catholic ACs swing back to LDF would suggest the 2026 'flip' was a one-off anti-incumbency wave, not a structural realignment.",
  },
  {
    lead: "Better Catholic-rite resolution (within Catholic-generic)",
    rest: "from sources beyond OSM POIs — diocesan boundaries, parish lists — could refine the Syro-Malabar vs Latin split where OSM has only generic 'catholic' tags. ~1,100 such POIs are assigned via district-prior.",
  },
] as const

const RAIL_GROUPS = [
  {
    label: "Sub-rite Kerala",
    items: [
      { id: "geography", label: "Geographic clusters" },
      { id: "trajectories", label: "Historical patterns" },
    ],
  },
  {
    label: "Two 2026 stories",
    items: [
      { id: "restorations", label: "Story A — Restorations" },
      { id: "flips", label: "Story B — Flips" },
      { id: "nda-latin", label: "NDA × Latin Catholic" },
    ],
  },
  {
    label: "Confidence",
    items: [
      { id: "evidence", label: "Cohort effect is Christian-driven" },
      { id: "what-would-weaken", label: "What would weaken this" },
    ],
  },
] as const

// Builds a single TrajectoryLines series per cohort, where the value
// is UDF vote share at each cycle.
function buildUDFSeries(cohorts: readonly (typeof REAL_COHORTS)[number][]) {
  return cohorts.map((cohort) => ({
    label: COHORT_LABEL[cohort],
    color: COHORT_COLOR[cohort],
    values: COHORT_TRAJECTORY[cohort].map((p) => p.UDF),
  }))
}

const ALL_UDF_SERIES = buildUDFSeries(REAL_COHORTS)
const STORY_A_COHORTS = [
  "syro_malabar",
  "jacobite_syrian",
  "indian_orthodox",
] as const
const STORY_B_COHORTS = ["latin_catholic", "marthoma"] as const

/**
 * Arc 4 — Christian sub-communities. Reads the 2026 cycle through
 * the new OSM-derived Christian sub-rite cohort layer. Each cohort
 * has its own multi-cycle alliance pattern; the 2026 swing was two
 * stories (restorations + flips).
 */
export function WalkthroughsChristianPage() {
  const [openCohort, setOpenCohort] =
    useState<ChristianSubRiteCohort | null>(null)
  const openRow = openCohort
    ? COHORT_TABLE_ROWS.find((r) => r.code === openCohort)
    : null
  const openList = openCohort ? COHORT_AC_LIST[openCohort] : []

  return (
    <WalkthroughPageShell
      breadcrumbLeaf="Christian communities"
      title="How Kerala's Christian sub-communities moved in 2026"
      railGroups={RAIL_GROUPS}
    >
      <ThesisLede confidence="tentative">
        <p className="text-base leading-relaxed font-medium text-foreground sm:text-[16.5px]">
          <strong>Each Christian sub-rite has its own historical alliance
          pattern.</strong>{" "}
          The 2026 "Christian swing toward UDF" wasn't a single
          movement — it was at least two distinct ones, on top of cohorts
          that started from different historical baselines.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[14.5px]">
          Syro-Malabar, Jacobite, and Indian Orthodox cohorts{" "}
          <em>returned</em> to their 2011-era UDF baselines after a
          2-cycle LDF-leaning wobble (continuity). Latin Catholic and
          Marthoma cohorts <em>flipped</em> from structurally LDF-leaning
          territory to UDF for the first time in our dataset (shift).
          Built on the new OSM-derived sub-rite cohort layer + Census
          religion shares, with three confounder tests documented in §11.
        </p>
      </ThesisLede>

      {/* §2 — Geographic clusters */}
      <WalkthroughSection
        id="geography"
        heading="Each sub-rite lives in a distinct geographic cluster"
        sectionType="foundational"
        layout="visual-right"
        visual={
          <div className="mx-auto max-w-sm space-y-3">
            <ReligionCategoricalMap
              acValues={COHORT_BY_AC}
              bucketColors={CHRISTIAN_SUBRITE_COLORS}
              noDataColor={NO_DATA_GRAY}
              ariaLabel="Kerala constituencies coloured by dominant Christian sub-rite"
            />
            <ul className="flex flex-wrap gap-x-2.5 gap-y-1 text-[11px]">
              {REAL_COHORTS.map((code) => {
                const n =
                  bucketCounts(COHORT_BY_AC).get(code) ?? COHORT_SIZE[code]
                if (n === 0) return null
                return (
                  <li key={code} className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: COHORT_COLOR[code] }}
                      aria-hidden
                    />
                    <span className="font-medium text-foreground">
                      {COHORT_LABEL[code]}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {n}
                    </span>
                  </li>
                )
              })}
              <li className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: NO_DATA_GRAY }}
                  aria-hidden
                />
                <span className="text-muted-foreground">
                  No consequential Christian sub-rite
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {COHORT_SIZE.below_threshold}
                </span>
              </li>
            </ul>
          </div>
        }
        caption="Dominant Christian sub-rite per AC (≥5% of voters, ≥3 classified POIs). From OSM POI mix × Census religion share."
      >
        <p className={SECTION_LEAD}>
          <strong>Christian Kerala is not one community.</strong> At least 6
          sub-rites operate at AC granularity, each with its own theology,
          demographic geography, and political history.
        </p>
        <p>
          Christians are roughly <strong>17.6%</strong> of Kerala's
          population in the 2025 projection — down from ~24% in 1901 via
          differential fertility and outmigration. Across 79 of 140 ACs,
          some Christian sub-rite is electorally consequential (≥5% of
          voters).
        </p>
        <p>
          The cohorts (largest to smallest), with their geographic
          anchors. Click any row for the list of ACs in that cohort:
        </p>
        <div className="not-prose -mx-2 mt-2 overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-8 px-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                  Sub-rite
                </TableHead>
                <TableHead className="h-8 px-3 text-right text-[11px] uppercase tracking-wide text-muted-foreground">
                  ACs
                </TableHead>
                <TableHead className="h-8 px-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                  Geographic anchor
                </TableHead>
                <TableHead className="h-8 w-8 px-2" aria-hidden />
              </TableRow>
            </TableHeader>
            <TableBody>
              {COHORT_TABLE_ROWS.map((row) => (
                <CohortTableRow
                  key={row.code}
                  row={row}
                  onOpen={() => setOpenCohort(row.code)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </WalkthroughSection>

      <Sheet
        open={openCohort != null}
        onOpenChange={(v) => {
          if (!v) setOpenCohort(null)
        }}
      >
        <SheetContent side="right" className="sm:max-w-md">
          {openRow && (
            <>
              <SheetHeader>
                <SheetTitle>
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ backgroundColor: openRow.color }}
                      aria-hidden
                    />
                    {openRow.label}{" "}
                    <span className="font-normal text-muted-foreground">
                      · {openRow.n} ACs
                    </span>
                  </span>
                </SheetTitle>
                <SheetDescription>{openRow.anchor}</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-8 text-[11px] uppercase tracking-wide text-muted-foreground">
                        AC
                      </TableHead>
                      <TableHead className="h-8 text-[11px] uppercase tracking-wide text-muted-foreground">
                        District
                      </TableHead>
                      <TableHead className="h-8 text-right text-[11px] uppercase tracking-wide text-muted-foreground">
                        Christian
                      </TableHead>
                      <TableHead className="h-8 text-right text-[11px] uppercase tracking-wide text-muted-foreground">
                        {openRow.label} voters
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openList.map((ac) => (
                      <TableRow key={ac.acNumber}>
                        <TableCell className="py-1.5">
                          <Link
                            to={`/explore?seat=${ac.acNumber}`}
                            className="font-medium text-foreground hover:underline"
                          >
                            {ac.acName}
                          </Link>
                        </TableCell>
                        <TableCell className="py-1.5 text-xs capitalize text-muted-foreground">
                          {ac.district}
                        </TableCell>
                        <TableCell className="py-1.5 text-right tabular-nums text-muted-foreground">
                          {ac.christianPct.toFixed(1)}%
                        </TableCell>
                        <TableCell className="py-1.5 text-right tabular-nums">
                          {ac.voterSharePct.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Sorted by Christian population share (descending).
                  "Christian" is the AC's overall Christian population
                  percentage (Census 2025 projection); "{openRow.label}{" "}
                  voters" is the estimated share of total voters belonging
                  to this sub-rite (Census religion share × OSM sub-rite
                  POI mix).
                </p>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* §3-§7 — Multi-cycle trajectories per cohort */}
      <WalkthroughSection
        id="trajectories"
        heading="Each sub-rite has its own multi-cycle alliance pattern"
        sectionType="foundational"
        layout="visual-left"
        visual={
          <TrajectoryLines
            cycles={[...CYCLE_YEARS]}
            series={ALL_UDF_SERIES}
            yDomain={[25, 60]}
            yUnit="%"
            yDecimals={0}
            ariaLabel="UDF vote share per Christian sub-rite cohort across 2011, 2016, 2021, 2026"
            className="h-80 w-full"
          />
        }
        caption="Mean UDF vote share within each sub-rite cohort across four cycles. Hover for exact values."
      >
        <p className={SECTION_LEAD}>
          <strong>Four cycles, six distinct patterns.</strong> The chart
          shows mean UDF share per cohort across 2011 → 2016 → 2021 → 2026.
          No two cohorts trace the same trajectory.
        </p>
        <ul className="ml-4 list-disc space-y-1.5 marker:text-muted-foreground">
          <li>
            <strong>Syro-Malabar</strong>: started UDF-leaning ({COHORT_TRAJECTORY.syro_malabar[0].UDF.toFixed(0)}% in 2011, 21 of 31 wins);
            LDF clawed close in 2016/2021 (13-14 wins); 2026 restored UDF
            dominance ({COHORT_TRAJECTORY.syro_malabar[3].UDF.toFixed(0)}%, 26 wins).
          </li>
          <li>
            <strong>Latin Catholic</strong>: structurally LDF-leaning
            2011-2021 (UDF won{" "}
            <strong>just 4 of 28 ACs in both 2016 AND 2021</strong>); 2026
            flipped 17 ACs LDF→UDF (now 21 of 28 UDF wins).
          </li>
          <li>
            <strong>Indian Orthodox</strong>: perennial 50/50 across
            cycles. Even in UDF's best 2026, wins split 5/4/1 — the
            Tiruvalla–Niranam belt stays competitive.
          </li>
          <li>
            <strong>Jacobite Syrian</strong> (n=3, directional only):
            historically UDF-leaning; 100% UDF wins in 2026.
          </li>
          <li>
            <strong>Marthoma</strong> (n=2, directional only): LDF in
            2016/2021; flipped to UDF in 2026.
          </li>
          <li>
            <strong>CSI</strong> (n=5): flat UDF across all four cycles
            (31-36%). But all 5 ACs are in Trivandrum district — see §11
            for why this cohort is geographically confounded.
          </li>
        </ul>
      </WalkthroughSection>

      {/* §8 — Story A: Restorations */}
      <WalkthroughSection
        id="restorations"
        heading="2026 Story A — Restorations"
        sectionType="mechanism"
        layout="visual-right"
        visual={
          <TrajectoryLines
            cycles={[...CYCLE_YEARS]}
            series={buildUDFSeries(STORY_A_COHORTS)}
            yDomain={[30, 60]}
            yUnit="%"
            yDecimals={0}
            ariaLabel="Story A: UDF vote share trajectories for Syro-Malabar, Jacobite, and Indian Orthodox cohorts"
            className="h-72 w-full"
          />
        }
        caption="The three 'Restoration' cohorts — each ended 2026 close to its 2011 baseline after a 2-cycle LDF-leaning wobble."
      >
        <p className={SECTION_LEAD}>
          <strong>Three cohorts returned to their long-run UDF baselines.</strong>{" "}
          Syro-Malabar, Jacobite, and Indian Orthodox each ended 2026 at
          roughly the alliance share they had in 2011. The 2016/2021 LDF
          edge in these cohorts was a 2-cycle dip; 2026 closed it.
        </p>
        <p>
          The shape is <em>continuity</em>, not realignment — each
          cohort's 2026 column matches its 2011 column:
        </p>
        <div className="not-prose -mx-2 mt-2 overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-8 px-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                  Cohort
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] uppercase tracking-wide text-muted-foreground">
                  2011
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] uppercase tracking-wide text-muted-foreground">
                  2016
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] uppercase tracking-wide text-muted-foreground">
                  2021
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] uppercase tracking-wide text-muted-foreground">
                  2026
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {STORY_A_COHORTS.map((cohort) => (
                <TrajectoryTableRow
                  key={cohort}
                  cohort={cohort}
                  label={COHORT_LABEL[cohort]}
                  color={COHORT_COLOR[cohort]}
                />
              ))}
            </TableBody>
          </Table>
          <p className="border-t bg-muted/30 px-3 py-1.5 text-[11px] text-muted-foreground">
            Each cell shows mean UDF vote share, with AC wins
            (UDF/total) underneath.
          </p>
        </div>
      </WalkthroughSection>

      {/* §9 — Story B: Flips */}
      <WalkthroughSection
        id="flips"
        heading="2026 Story B — Flips"
        sectionType="mechanism"
        layout="visual-left"
        visual={
          <TrajectoryLines
            cycles={[...CYCLE_YEARS]}
            series={buildUDFSeries(STORY_B_COHORTS)}
            yDomain={[30, 55]}
            yUnit="%"
            yDecimals={0}
            ariaLabel="Story B: UDF vote share trajectories for Latin Catholic and Marthoma cohorts"
            className="h-72 w-full"
          />
        }
        caption="Two cohorts crossed parity in 2026 for the first time in our dataset. Latin Catholic flipped 17 of 28 ACs LDF→UDF."
      >
        <p className={SECTION_LEAD}>
          <strong>Two cohorts genuinely flipped.</strong> Latin Catholic
          and Marthoma — both structurally LDF-leaning through 2011–2021 —
          crossed parity and went majority-UDF in 2026 for the first time
          in our 4-cycle window.
        </p>
        <p>
          <strong>Latin Catholic is the biggest single sub-rite shift of
          2026:</strong> UDF wins went from 4 of 28 (in both 2016 and
          2021) to <strong>21 of 28</strong>. <strong>17 ACs flipped
          LDF→UDF.</strong> This was a structural realignment relative to
          recent history, not a return to baseline.
        </p>
        <p>
          Marthoma (n=2 — Aranmula and Ranni) followed the same pattern
          at much smaller sample size — UDF won 0 of 2 in 2016 and 2021,
          then 2 of 2 in 2026.
        </p>
      </WalkthroughSection>

      {/* §10 — NDA × Latin Catholic */}
      <WalkthroughSection
        id="nda-latin"
        heading="NDA hasn't succeeded with central Latin Catholics"
        sectionType="mechanism"
        layout="visual-right"
        visual={
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm tabular-nums">
              <thead className="bg-muted/50 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Latin zone</th>
                  <th className="px-3 py-2 text-right">n</th>
                  <th className="px-3 py-2 text-right">NDA 2026</th>
                  <th className="px-3 py-2 text-right">Δ NDA</th>
                </tr>
              </thead>
              <tbody>
                {LATIN_ZONE_BREAKDOWN.map((z) => (
                  <tr
                    key={z.zone}
                    className="border-t border-border/60"
                  >
                    <td className="px-3 py-2 capitalize text-foreground">
                      {z.zone}
                    </td>
                    <td className="px-3 py-2 text-right text-muted-foreground">
                      {z.n}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {z.meanNDA2026.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-right text-muted-foreground">
                      {z.meanDeltaNDA >= 0 ? "+" : ""}
                      {z.meanDeltaNDA.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
        caption="NDA 2026 share and 2021→2026 Δ within the Latin Catholic cohort, split by geographic zone."
      >
        <p className={SECTION_LEAD}>
          <strong>The Latin Catholic heartland is BJP's empty quarter.</strong>{" "}
          Central Latin ACs — Ernakulam, Alappuzha, Kochi, Kodungallur,
          Vypeen — where Latin Catholics are most concentrated, are the
          zone where NDA's 2026 surge didn't land.
        </p>
        <p>
          Central Latin NDA share is{" "}
          <strong>
            {LATIN_ZONE_BREAKDOWN.find((z) => z.zone === "central")?.meanNDA2026.toFixed(0)}%
          </strong>{" "}
          in 2026, almost flat from 2021. North Latin is similar —
          essentially BJP-free at{" "}
          {LATIN_ZONE_BREAKDOWN.find((z) => z.zone === "north")?.meanNDA2026.toFixed(0)}%.{" "}
          <strong>South Latin</strong> (TVM/Kollam) is the exception, with
          NDA at{" "}
          {LATIN_ZONE_BREAKDOWN.find((z) => z.zone === "south")?.meanNDA2026.toFixed(0)}%
          and growing{" "}
          (+{LATIN_ZONE_BREAKDOWN.find((z) => z.zone === "south")?.meanDeltaNDA.toFixed(1)}
          pp) — but that's the part of the Latin cohort with lower Christian
          shares (~17%), where BJP gains may be drawing more from
          Hindu/Muslim co-residents than Latin Catholics themselves.
        </p>
        <p>
          For BJP, this is the strategic gap. The cohort where Christians
          are most numerous is structurally NDA-resistant.
        </p>
      </WalkthroughSection>

      {/* §11 — Evidence the cohort effect is Christian-driven */}
      <WalkthroughSection
        id="evidence"
        heading="The cohort effect is Christian-driven, not aggregate confounding"
        sectionType="foundational"
        layout="stacked"
      >
        <p className={SECTION_LEAD}>
          <strong>Three independent tests confirm the cohort findings
          reflect a Christian-community signal.</strong> Aggregate AC-level
          data has known confounders (district effects, Hindu vote
          shifts, religion-share heterogeneity); each was tested.
        </p>
        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-md border bg-card/40 p-4">
            <h3 className="font-heading text-sm font-semibold tracking-tight">
              Same-district control
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              In Ernakulam district alone, Latin-cohort ACs swung +
              {M_EVIDENCE.ernakulam.latin.deltaUDF.toFixed(1)}
              pp UDF vs SM-cohort's +
              {M_EVIDENCE.ernakulam.sm.deltaUDF.toFixed(1)}pp.
            </p>
            <p className="mt-2 text-2xl font-medium tabular-nums">
              {M_EVIDENCE.ernakulam.gap.toFixed(1)}pp gap
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              District context held constant; cohort identity drives a
              7-point ΔUDF gap.
            </p>
          </div>
          <div className="rounded-md border bg-card/40 p-4">
            <h3 className="font-heading text-sm font-semibold tracking-tight">
              Dose-response by Christian share
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Within every Christian cohort, high-Christian-share ACs
              swung more than low-share ACs. Below-threshold cohort shows
              no such gradient.
            </p>
            <p className="mt-2 text-2xl font-medium tabular-nums">
              +
              {M_EVIDENCE.highLowChristianShare.latin.gap.toFixed(1)} to +
              {M_EVIDENCE.highLowChristianShare.sm.gap.toFixed(1)}pp
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Latin: low {M_EVIDENCE.highLowChristianShare.latin.lowDelta.toFixed(1)} vs
              high {M_EVIDENCE.highLowChristianShare.latin.highDelta.toFixed(1)}. SM:{" "}
              {M_EVIDENCE.highLowChristianShare.sm.lowDelta.toFixed(1)} vs{" "}
              {M_EVIDENCE.highLowChristianShare.sm.highDelta.toFixed(1)}.
            </p>
          </div>
          <div className="rounded-md border bg-card/40 p-4">
            <h3 className="font-heading text-sm font-semibold tracking-tight">
              Hindu-NDA bleed
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              In Thrissur, Hindu-majority ACs saw NDA grow {M_EVIDENCE.thrissurNda.hindu.toFixed(1)}
              pp — but SM-cohort ACs in the same district saw NDA shrink {M_EVIDENCE.thrissurNda.sm.toFixed(1)}pp.
            </p>
            <p className="mt-2 text-2xl font-medium tabular-nums">
              {(
                M_EVIDENCE.thrissurNda.hindu - M_EVIDENCE.thrissurNda.sm
              ).toFixed(1)}
              pp separation
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Hindu-belt NDA gains don't bleed into Christian-cohort ACs.
              Geographically separate.
            </p>
          </div>
        </div>
        <p className="mt-4">
          The dose-response result is the strongest of the three. If the
          cohort swing were driven by Hindu/Muslim co-residents in
          cohort-labelled ACs, we'd expect <em>uniform</em> swings
          regardless of Christian share. Instead, more Christians in the
          AC = bigger UDF swing — exactly the signature a
          Christian-driven swing produces. The non-Christian-cohort ACs
          show no such gradient.
        </p>
        <p>
          <strong>CSI cohort caveat:</strong> all 5 CSI cohort ACs are in
          Thiruvananthapuram district. The CSI cohort's behaviour is
          geographically confounded with Trivandrum-specific patterns
          and should be read as a Trivandrum-area finding, not a
          CSI-denomination finding.
        </p>
      </WalkthroughSection>

      {/* What would weaken this view */}
      <WhatWouldWeakenSection bullets={WEAKENERS} />
    </WalkthroughPageShell>
  )
}

function TrajectoryTableRow({
  cohort,
  label,
  color,
}: {
  cohort: ChristianSubRiteCohort
  label: string
  color: string
}) {
  const points = COHORT_TRAJECTORY[cohort]
  const cohortSize = COHORT_SIZE[cohort]
  return (
    <TableRow>
      <TableCell className="py-1.5">
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <span className="font-medium text-foreground">{label}</span>
        </span>
      </TableCell>
      {points.map((p, i) => {
        const isLast = i === points.length - 1
        return (
          <TableCell
            key={p.year}
            className="py-1.5 px-2 text-right tabular-nums"
          >
            <div className={isLast ? "font-semibold text-foreground" : ""}>
              {p.UDF.toFixed(0)}%
            </div>
            <div className="text-[11px] text-muted-foreground">
              {p.udfWins}/{cohortSize}
            </div>
          </TableCell>
        )
      })}
    </TableRow>
  )
}

function CohortTableRow({
  row,
  onOpen,
}: {
  row: CohortRow
  onOpen: () => void
}) {
  return (
    <TableRow
      className="cursor-pointer transition-colors hover:bg-muted/50"
      onClick={onOpen}
    >
      <TableCell className="py-2">
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: row.color }}
            aria-hidden
          />
          <span className="font-medium text-foreground">{row.label}</span>
        </span>
      </TableCell>
      <TableCell className="py-2 text-right text-muted-foreground tabular-nums">
        {row.n}
      </TableCell>
      <TableCell className="py-2 text-xs leading-snug text-muted-foreground">
        {row.anchor}
      </TableCell>
      <TableCell className="py-2 pr-3 text-right">
        <IconChevronRight
          className="ml-auto h-3.5 w-3.5 text-muted-foreground/60"
          aria-hidden
        />
      </TableCell>
    </TableRow>
  )
}
