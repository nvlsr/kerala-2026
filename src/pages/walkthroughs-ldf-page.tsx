import { Link } from "react-router-dom"

import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { ChoroplethLegend } from "@/components/charts/choropleth-legend"
import { ComparisonBar } from "@/components/charts/comparison-bar"
import { Histogram } from "@/components/charts/histogram"
import { ConfidenceBadge } from "@/components/walkthroughs/confidence-badge"
import { MethodologyPopover } from "@/components/walkthroughs/methodology-popover"
import { SeatLink } from "@/components/walkthroughs/prose-link"
import { PullQuote } from "@/components/walkthroughs/pull-quote"
import { SeeAlsoQuestions } from "@/components/walkthroughs/see-also-questions"
import { ASIDE, SECTION_LEAD } from "@/components/walkthroughs/typography"
import { WalkthroughSection } from "@/components/walkthroughs/walkthrough-section"
import { PageRail } from "@/components/walkthroughs/walkthrough-rail"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import {
  getAllACMetrics,
  getPerACAllianceDelta,
} from "@/lib/data/walkthrough-metrics"

const SABARIMALA_ROUTE_ACS = new Set([113, 114, 112]) // Aranmula, Konni, Ranni

/** Right-rail nav anchors for this page. Each id matches a `<section id="...">` below. */
const RAIL_GROUPS = [
  {
    label: "Wave shape",
    items: [
      { id: "uniform", label: "Uniform, not concentrated" },
      { id: "distribution", label: "A tight, symmetric distribution" },
    ],
  },
  {
    label: "Falsifications",
    items: [
      { id: "not-sabarimala", label: "Not Sabarimala-route" },
      { id: "not-cabinet", label: "Not cabinet-status" },
    ],
  },
  {
    label: "Mechanism + caveats",
    items: [
      { id: "where-it-went", label: "Most went to UDF" },
      { id: "what-would-weaken", label: "What would weaken this" },
    ],
  },
] as const

/**
 * Arc 1 — the anti-LDF wave. Documents the broad uniform LDF loss
 * (mean -7.4pp, SD 4.5pp) and the three falsifications
 * (religion-blind, route-blind, cabinet-status-blind).
 */
export function WalkthroughsLDFPage() {
  const all = getAllACMetrics()
  const ldfDeltas = all.map((m) => m.deltas.LDF)
  const ldfDeltaMap = getPerACAllianceDelta("LDF")

  const meanLDF = ldfDeltas.reduce((s, v) => s + v, 0) / ldfDeltas.length

  // Sabarimala-route comparison
  const routeAcs = all.filter((m) => SABARIMALA_ROUTE_ACS.has(m.acNumber))
  const routeMean =
    routeAcs.reduce((s, m) => s + m.deltas.LDF, 0) / routeAcs.length
  // Hindu ≥ 50% controls excluding the route ACs (numbers from A2's
  // matched-controls analysis: -7.3pp mean).
  const matchedHinduControlMean = -7.3

  // Cabinet-status comparison (numbers from A6).
  const ministerMean = -6.89
  const nonMinisterIncumbentMean = -7.63

  return (
    <PageShell
      breadcrumbs={[
        { label: "Walkthroughs", href: "/walkthroughs" },
        { label: "LDF" },
      ]}
      title="The anti-LDF wave was uniform"
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
                LDF lost{" "}
                <strong>
                  ~7pp of vote share across nearly every constituency
                </strong>{" "}
                — not in concentrated wipeout zones. Two press-favoured
                mechanisms (Sabarimala backlash, cabinet rejection){" "}
                <strong>don't survive constituency-level testing</strong>. The
                lost LDF vote landed mostly on UDF, with NDA picking up a
                meaningful slice in southern Hindu-heavy seats.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[14.5px]">
                The shape of the data — broad, shallow, religion-blind,
                route-blind, cabinet-status-blind — reads more like{" "}
                <em>anti-incumbency</em> than <em>realignment</em>.{" "}
                <strong>
                  Anti-incumbency-driven votes are more reversible than
                  ideologically realigned ones,
                </strong>{" "}
                so LDF's recovery prospects in 2031 depend on whether the wave
                will be situational (UDF-fatigue, Sabarimala memory, inflation)
                or structural (community-shift away from the Left).
              </p>
            </section>

            {/* SECTION 1 — Uniform, not concentrated */}
            <WalkthroughSection
              id="uniform"
              heading="Uniform, not concentrated"
              sectionType="foundational"
              layout="visual-right"
              visual={
                <div className="mx-auto max-w-sm space-y-2">
                  <ChoroplethMap
                    valueByAC={ldfDeltaMap}
                    colorScale="diverging"
                    domain={[-25, 25]}
                    ariaLabel="Kerala constituencies shaded by LDF Δshare 2021 → 2026"
                    unit="pp"
                    decimals={1}
                  />
                  <ChoroplethLegend
                    colorScale="diverging"
                    domain={[-25, 25]}
                    unit="pp"
                    decimals={0}
                  />
                </div>
              }
              caption="LDF Δshare 2021 → 2026, by constituency. Red = LDF loss; blue = LDF gain. Hover for AC values."
            >
              <p className={SECTION_LEAD}>
                <strong>The wave was broad, not deep.</strong> Voters left LDF
                evenly across the state, not in concentrated wipeout zones.
              </p>
              <p>
                Across all 140 constituencies, LDF lost an average of{" "}
                <strong>{meanLDF.toFixed(2)}pp</strong> with a standard
                deviation of just 4.47pp. Three quarters of ACs sit in the
                modest-loss range (−10 to 0pp). Only 6 ACs (4.3%) had what could
                be called catastrophic loss (worse than −15pp).
              </p>
              <p>
                LDF's standard deviation is the smallest of the three alliances
                (LDF 4.47, UDF 5.65, NDA 5.04). The losing party's distribution
                is the tightest — which is the shape "broad anti-incumbency"
                produces, not the shape a "concentrated communal realignment"
                would produce.
              </p>
            </WalkthroughSection>

            {/* SECTION 2 — Distribution shape */}
            <WalkthroughSection
              id="distribution"
              heading="A tight, symmetric distribution"
              sectionType="foundational"
              layout="stacked"
              visual={
                <Histogram
                  values={ldfDeltas}
                  binWidth={2}
                  domain={[-26, 12]}
                  fill="rgb(220, 38, 38)"
                  fillNegative="rgb(200, 30, 30)"
                  divergeAt={0}
                  meanLine={meanLDF}
                  xUnit="pp"
                  xDecimals={0}
                  ariaLabel="Histogram of LDF Δshare across 140 ACs"
                />
              }
              caption="Distribution of LDF Δshare across all 140 ACs. Mean −7.43pp; median −7.73pp; IQR 5.80pp wide."
            >
              <p className={SECTION_LEAD}>
                <strong>Tight middle, light tails.</strong> 75% of ACs lost
                between 0 and 10pp; the IQR is just 5.80pp wide.
              </p>
              <p>
                Mean and median agree closely (−7.43 vs −7.73), so the
                distribution is essentially symmetric. The bulk of the mass sits
                between −12pp and −3pp.
              </p>
              <p>
                A few outliers sit visibly outside the modal cluster —{" "}
                <SeatLink ac={89}>Udumbanchola</SeatLink> (−24.6pp),{" "}
                <SeatLink ac={6}>Payyannur</SeatLink> (−17.8pp),{" "}
                <SeatLink ac={98}>Puthuppally</SeatLink> (−16.8pp) on the loss
                side; <SeatLink ac={41}>Vengara</SeatLink> (+8.5pp),{" "}
                <SeatLink ac={114}>Konni</SeatLink> (+3.2pp) on the gain side.
                The "shallow everywhere" framing coexists with these specific
                outliers; both are true.
              </p>
            </WalkthroughSection>

            <PullQuote>
              The press's "Sabarimala backlash" and "minister-targeted
              anti-incumbency" framings each predict a concentrated collapse
              zone. The data shows neither.
            </PullQuote>

            {/* SECTION 3 — Falsification: Sabarimala */}
            <WalkthroughSection
              id="not-sabarimala"
              heading="It wasn't Sabarimala-route-targeted"
              sectionType="falsification"
              layout="visual-left"
              visual={
                <ComparisonBar
                  groups={[
                    {
                      label: "Sabarimala-route ACs",
                      mean: routeMean,
                      n: 3,
                      color: "rgb(220, 38, 38)",
                      sublabel: "Aranmula, Konni, Ranni",
                    },
                    {
                      label: "Hindu ≥ 50% controls",
                      mean: matchedHinduControlMean,
                      n: 88,
                      color: "var(--muted-foreground)",
                    },
                  ]}
                  yUnit="pp"
                  yDecimals={1}
                  ariaLabel="Sabarimala-route ACs vs matched Hindu-majority controls — mean LDF Δshare"
                  yDomain={[-10, 0]}
                />
              }
              caption="Mean LDF Δshare: 3 Sabarimala-route ACs vs 88 Hindu-majority controls."
            >
              <p className={SECTION_LEAD}>
                <strong>Sabarimala backlash didn't show up in the data.</strong>{" "}
                The wrong-sign result is the hardest part for the press framing
                to explain.
              </p>
              <p>
                Press framing predicted larger LDF losses in pilgrim-route ACs
                as evidence of Hindu backlash over the Sabarimala gold-cladding
                scandal and lingering 2018 anger. The data shows the opposite:
                the three geographic Sabarimala-route ACs (
                <SeatLink ac={113}>Aranmula</SeatLink>,{" "}
                <SeatLink ac={114}>Konni</SeatLink>,{" "}
                <SeatLink ac={112}>Ranni</SeatLink>) had a smaller LDF loss (
                {routeMean.toFixed(1)}pp) than{" "}
                <MethodologyPopover term="matched-controls">
                  matched Hindu-majority controls
                </MethodologyPopover>{" "}
                (−7.3pp). NDA share also fell in those ACs (−2.3pp vs +1.9pp in
                matched controls), the wrong sign for the "Hindu shift to BJP"
                hypothesis.
              </p>
              <p>
                What does happen: the three Devaswom-related ministers (Vasavan
                / <SeatLink ac={96}>Ettumanoor</SeatLink>, Veena George /{" "}
                <SeatLink ac={113}>Aranmula</SeatLink>, Kadakampally /{" "}
                <SeatLink ac={132}>Kazhakoottam</SeatLink>) lost their own seats
                by ~4pp more than matched controls. That's a minister-incumbency
                penalty applied to specific high-visibility cabinet members, not
                a route-targeted geographic effect.
              </p>
              <p className={ASIDE}>
                Numbers from the A2 matched-controls analysis. See "Underlying
                analyses" at the bottom for the full derivation.
              </p>
            </WalkthroughSection>

            {/* SECTION 4 — Falsification: Cabinet status */}
            <WalkthroughSection
              id="not-cabinet"
              heading="It wasn't cabinet-status-targeted"
              sectionType="falsification"
              layout="visual-right"
              visual={
                <ComparisonBar
                  groups={[
                    {
                      label: "21 minister incumbents",
                      mean: ministerMean,
                      n: 21,
                      color: "rgb(220, 38, 38)",
                    },
                    {
                      label: "78 non-minister LDF incumbents",
                      mean: nonMinisterIncumbentMean,
                      n: 78,
                      color: "var(--muted-foreground)",
                    },
                  ]}
                  yUnit="pp"
                  yDecimals={2}
                  ariaLabel="LDF Δshare: 21 cabinet ministers vs 78 non-minister LDF 2021 incumbents"
                  yDomain={[-10, 0]}
                />
              }
              caption="Mean LDF Δshare comparing the 21 cabinet ministers to the 78 non-minister LDF 2021 incumbents. Differential: +0.74pp (ministers lost slightly LESS)."
            >
              <p className={SECTION_LEAD}>
                <strong>
                  Ministers lost slightly *less* than non-minister incumbents.
                </strong>{" "}
                The "minister-targeted anti-incumbency" hypothesis predicts the
                opposite.
              </p>
              <p>
                The "13 of 21 ministers defeated" headline is correctly reported
                — minister losses were highly visible. But on this data,
                ministers lost slightly less share than non-minister LDF
                incumbents (−6.89pp vs −7.63pp).
              </p>
              <p>
                The 14 ministers who lost their seats lost them because they
                happened to be sitting in the LDF column when a 7pp wave hit,
                not because voters specifically targeted cabinet members.
                Outsized individual losses concentrate among small-party LDF
                allies (JD(S), NCP, KC(M)) — that's a coalition-cohesion
                finding, not a cabinet-rejection one.
              </p>
            </WalkthroughSection>

            {/* SECTION 5 — Mechanism: where the vote went */}
            <WalkthroughSection
              id="where-it-went"
              heading="Most of the lost vote landed on UDF"
              sectionType="mechanism"
              visual={
                <ComparisonBar
                  groups={[
                    {
                      label: "UDF absorbed",
                      mean: 7.29,
                      n: 140,
                      color: "rgb(31, 119, 180)",
                    },
                    {
                      label: "NDA absorbed",
                      mean: 2.05,
                      n: 140,
                      color: "rgb(255, 127, 14)",
                    },
                    {
                      label: "OTHER (net)",
                      mean: -1.91,
                      n: 140,
                      color: "var(--muted-foreground)",
                    },
                  ]}
                  yUnit="pp"
                  yDecimals={2}
                  ariaLabel="Mean Δshare by alliance — UDF absorbed most of the LDF loss; NDA absorbed a smaller slice"
                  yDomain={[-3, 9]}
                />
              }
              caption="Mean per-AC Δshare 2021 → 2026. UDF absorbed 98% on average; NDA absorbed 28%; OTHER bled."
              layout="visual-left"
            >
              <p className={SECTION_LEAD}>
                <strong>
                  Most of the LDF loss flowed to UDF — but not all of it.
                </strong>{" "}
                In ~65% of ACs, UDF absorbed the bulk of LDF's defectors. In a
                meaningful subset (23%), NDA out-bid UDF for those voters
                instead.
              </p>
              <p>
                On average, UDF gained +7.29pp per AC — almost numerically
                identical to LDF's −7.43pp loss. NDA also gained (+2.05pp), and
                OTHER alliances/independents bled (−1.91pp). The statewide
                averages mask a real geographic split:
              </p>
              <p>
                65% of ACs show UDF-dominant absorption (UDF received &gt;70% of
                LDF's loss). 23% show NDA-dominant absorption — concentrated in
                southern Kerala, where BJP and UDF directly competed for the
                same defectors. See the{" "}
                <Link
                  to="/walkthroughs/nda-walkthrough#wave-capture"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  NDA walkthrough's wave-capture section
                </Link>{" "}
                for the 21 seats where NDA out-bid. Only 3% of ACs saw LDF hold
                or gain.
              </p>
            </WalkthroughSection>

            {/* Cross-references — synthesis pointing at the other walkthroughs */}
            <section className="rounded-md border bg-card/50 p-5 sm:p-6">
              <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Where this connects
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                <li>
                  The anti-LDF wave landed mostly on UDF — and{" "}
                  <Link
                    to="/walkthroughs/udf-walkthrough"
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    Christian-belt UDF amplification
                  </Link>{" "}
                  added a separate ~3-4pp differential on top of the wave,
                  turning a normal anti-incumbency election into a 102-seat
                  majority.
                </li>
                <li>
                  In 21 seats — overwhelmingly Hindu-heavy, mostly in southern
                  Kerala — NDA out-bid UDF for the defectors. See the{" "}
                  <Link
                    to="/walkthroughs/nda-walkthrough#wave-capture"
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    NDA walkthrough
                  </Link>{" "}
                  for the wave-capture cohort and BJP's competitive frontier
                  with UDF.
                </li>
              </ul>
            </section>

            <SeeAlsoQuestions
              items={[
                {
                  id: "cpim-declines",
                  label: "Where did CPIM lose the most vote share?",
                  hint: "LDF's main party — the seat-level shape of the wave.",
                },
                {
                  id: "ldf-at-risk-wins",
                  label: "Where is LDF losing ground in winning seats?",
                  hint: "Holds with a much-reduced cushion vs 2021.",
                },
                {
                  id: "udf-gap-closers",
                  label: "Where is UDF gaining ground in losing seats?",
                  hint: "The receiving end of the vote-flow accounting.",
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
                    A more inclusive Sabarimala-route definition
                  </strong>{" "}
                  that includes additional ACs and shows a coherent LDF
                  differential — would suggest the route effect is real but the
                  3-AC subset was too narrow.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Survey microdata
                  </strong>{" "}
                  showing voters in pilgrim-route ACs cited Sabarimala as a
                  primary motivator at higher rates than elsewhere — would
                  indicate a latent effect masked at the AC level.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Multi-cycle data showing ministers usually lose more than
                    non-minister incumbents
                  </strong>{" "}
                  in similar conditions — would suggest the +0.74pp
                  non-detection here is a 2026-specific artefact.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    A 2031 LDF recovery from the −7pp baseline
                  </strong>{" "}
                  — would confirm the anti-LDF reading. Failure to recover would
                  suggest 2026 was a structural realignment rather than a
                  transient anti-incumbency wave.
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
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/a2-sabarimala-route.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  A2 — Sabarimala-route falsification
                </a>
                {" · "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/a6-cabinet-collapse.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  A6 — Cabinet-status null
                </a>
                {" · "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/ldf-shallow-distribution.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  LDF shallow distribution
                </a>
                {" · "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/anti-ldf-flow.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  Anti-LDF flow
                </a>
                .
              </p>
              <p className="mt-2">
                <strong className="font-medium text-foreground">
                  Explore the data:
                </strong>{" "}
                see the Sabarimala-route ACs on{" "}
                <Link
                  to="/explore?seat=113"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  /explore (Aranmula)
                </Link>
                ,{" "}
                <Link
                  to="/explore?seat=114"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  Konni
                </Link>
                ,{" "}
                <Link
                  to="/explore?seat=112"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  Ranni
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
