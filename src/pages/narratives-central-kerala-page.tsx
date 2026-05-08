import { Link } from "react-router-dom"

import { ChoroplethLegend } from "@/components/charts/choropleth-legend"
import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { ComparisonBar } from "@/components/charts/comparison-bar"
import { ScatterWithTrend } from "@/components/charts/scatter-with-trend"
import { NarrativeArcBreadcrumb } from "@/components/narratives/narrative-arc-breadcrumb"
import { NarrativeSection } from "@/components/narratives/narrative-section"
import { PullQuote } from "@/components/narratives/pull-quote"
import { TakeawayBox } from "@/components/narratives/takeaway-box"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import { acDemo2025Meta } from "@/lib/data/loaders"
import {
  getAllACMetrics,
  getPerACAllianceDelta,
  getPerACWinner2026,
} from "@/lib/data/narrative-metrics"

const OUTLIER_AC_NUMBERS = new Set([
  93, // Pala
  101, // Poonjar
  111, // Thiruvalla
  89, // Udumbanchola
  41, // Vengara
  98, // Puthuppally
])

/**
 * Arc 2 — Central Kerala UDF amplification. The 47-of-47 sweep
 * across 5 districts + the Christian-belt premium (β=+0.19,
 * p=0.008 with district FE) + the FPTP mechanism (UDF
 * seat:vote-share ratio 1.04 → 2.18) that turned a 7pp swing
 * into a 102-seat majority.
 *
 * Built per docs/narratives-publish-plan.md Phase 7.
 */
export function NarrativesCentralKeralaPage() {
  const all = getAllACMetrics()
  const udfDeltaMap = getPerACAllianceDelta("UDF")
  const winner2026 = getPerACWinner2026()
  const udfWins = new Set<number>()
  for (const [acNumber, alliance] of winner2026.entries()) {
    if (alliance === "UDF") udfWins.add(acNumber)
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
        { label: "Narratives", href: "/narratives" },
        { label: "Central Kerala" },
      ]}
      title="Central Kerala provided nearly half of UDF's majority margin"
      subtitle={
        <>
          <NarrativeArcBreadcrumb current={2} />
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            UDF won 47 of 47 seats across Idukki, Ernakulam,
            Wayanad, Malappuram, and Kottayam. Christian-heavy ACs
            added a robust ~3-4pp UDF premium on top of the
            statewide ~7pp wave. FPTP amplification turned that
            combined swing into a 102-seat majority.{" "}
            <strong className="font-medium text-foreground/90">
              Confidence: Strong.
            </strong>
          </p>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground/80">
            <strong className="font-medium text-foreground/80">
              Surprise from this arc:
            </strong>{" "}
            UDF didn't win mostly on tight margins. Median UDF
            winning margin was 12.19pp; LDF's was 6.99pp. The
            efficiency story is the seat:vote-share ratio flip
            (UDF 1.04 → 2.18), not "tight wins."
          </p>
        </>
      }
    >
      <PageMain className="space-y-10 py-6 pb-12">
        <NarrativeSection
          heading="UDF won every seat in 5 central-Kerala districts"
          sectionType="foundational"
          layout="visual-right"
          visual={
            <div className="space-y-2">
              <ChoroplethMap
                valueByAC={udfDeltaMap}
                colorScale="diverging"
                domain={[-25, 25]}
                ariaLabel="Kerala constituencies shaded by UDF Δshare 2021 → 2026"
                unit="pp"
                decimals={1}
                highlightSeats={udfWins}
              />
              <ChoroplethLegend
                colorScale="diverging"
                domain={[-25, 25]}
                unit="pp"
                decimals={0}
              />
            </div>
          }
          caption="UDF Δshare 2021 → 2026; UDF-won ACs outlined. Central-5 (Idukki, Ernakulam, Wayanad, Malappuram, Kottayam) shows uniformly strong UDF gains."
        >
          <p>
            UDF won every seat in five districts: Idukki, Ernakulam,
            Wayanad, Malappuram, and Kottayam. 47 of 47.
            Pre-poll Manorama-C Voter projected "UDF 33 of 53 in
            Central Kerala" — an underestimate of 23-38pp depending
            on the bundle definition.
          </p>
          <p>
            46% of UDF's 102-seat majority came from these 5
            districts, which contain only 34% of Kerala's ACs.
            Stripping Central-5 from the count: UDF would have 55
            seats — enough to remain the largest bloc but below the
            71-seat majority threshold. Central Kerala provided the
            arithmetic difference between a plurality and a
            majority government.
          </p>
        </NarrativeSection>

        <NarrativeSection
          heading="Christian-heavy ACs gave UDF an extra ~3-4pp on top of the wave"
          sectionType="foundational"
          layout="stacked"
          visual={
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
          caption="Each dot is one of 140 ACs. Outlier ACs (Pala, Poonjar, Thiruvalla, Udumbanchola, Puthuppally, Vengara) are highlighted with stronger styling."
        >
          <p>
            Christian-heavy ACs gained UDF more than the statewide
            average. Pearson r = +0.20; under district fixed
            effects, β = +0.194 (p = 0.008). The relationship
            survives the strictest geographic control available at
            this resolution — within a Kerala district, ACs with
            higher Christian share systematically swung more
            strongly to UDF.
          </p>
          <p>
            About ~12% of the Christian-belt premium is
            mechanical KC(M)-base movement: Kerala Congress (M)
            stayed alliance-tagged LDF in both cycles, but its
            party-share dropped ~7pp on average across the 12 ACs
            it contested, and that base partially defected to UDF.
            The remaining ~88% is a non-KC(M) cross-community
            signal — Christian-heavy ACs gained UDF beyond what
            KC(M) churn alone explains.
          </p>
          <p>
            Outliers visible on the chart: <strong>Pala</strong>{" "}
            (52% Christian, UDF -12.9pp; Mani C. Kappan / NCP /
            KC(M) churn unrelated to religion) and{" "}
            <strong>Thiruvalla</strong> (48% Christian, UDF +1.6pp,
            NDA +14.5pp; three-way fragmentation with a JD(S)
            winner). On the gain side,{" "}
            <strong>Udumbanchola</strong> at 48% Christian had the
            largest single-AC swing (UDF +22.6pp).
          </p>
        </NarrativeSection>

        <PullQuote>
          UDF and LDF effectively traded efficiency between cycles.
          The same geographic vote distribution that wasted UDF's
          votes in 2021 converted them into seats in 2026.
        </PullQuote>

        <NarrativeSection
          heading="Why a 7pp swing produced a 102-seat majority"
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
          <p>
            The 7.4pp UDF gain produced 61 additional UDF seats —
            roughly 8 seats per pp, six times the proportional
            rate. This is FPTP plurality near threshold: Kerala's
            vote distribution sat close to 50/50 in many ACs in
            2021, and a uniform 7pp swing crossed those thresholds
            simultaneously.
          </p>
          <p>
            UDF's seats-per-vote-share ratio more than doubled
            (1.04 → 2.18). LDF's halved (2.19 → 0.93). The two
            alliances effectively swapped efficiency. Under a
            counterfactual where 2021 vote shares had held
            statewide, UDF would have won 44 seats — not 102. About
            58 of UDF's 102 seats are amplification beyond what
            proportional representation would produce.
          </p>
          <p>
            The combination is what produced the landslide. Pattern
            1 (anti-LDF wave) supplied the swing. Pattern 2's
            geography (Central-5 sitting near threshold) routed it
            into seat conversion. Neither alone explains a 102-35-3
            split — together they do.
          </p>
        </NarrativeSection>

        <NarrativeSection
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
          <p>
            The press's "minority consolidation" framing pooled
            Muslim and Christian shares as a single consolidating
            bloc. The data splits the two: Christian-share predicts
            differential UDF swing (above), but Muslim-share
            doesn't.
          </p>
          <p>
            Muslim-majority ACs (≥60%, n=16) gained +8.98pp UDF —
            slightly above the statewide ~7.3pp baseline but
            within the noise. The 40-60% Muslim bin actually
            gained <em>less</em> (+5.76pp) than the low-Muslim bin
            (+7.03pp). No monotonic relationship.
          </p>
          <p>
            Under district fixed effects, the Muslim-share
            coefficient on UDF Δshare collapses to β = +0.016
            (p = 0.795). Within a district, Muslim share has no
            detectable predictive power. The simple-Pearson signal
            in the raw data was driven entirely by between-district
            clustering — primarily Malappuram. Muslim-heavy ACs
            participated in the LDF→UDF wave at the statewide rate;
            they didn't supercharge it.
          </p>
        </NarrativeSection>

        <TakeawayBox>
          <p>
            Central Kerala provided the arithmetic difference
            between a UDF plurality and a UDF majority government.
            The Christian-heavy ACs added a real ~3-4pp premium on
            top of the statewide ~7pp wave (robust to district
            fixed effects), and FPTP plurality amplified the
            combined swing into 102 seats. Muslim-share variation
            didn't add a separate premium — the press's "minority
            consolidation" framing pools two distinct phenomena, and
            only one carries constituency-level signal.
          </p>
        </TakeawayBox>

        <section className="border-t pt-8">
          <h2 className="font-heading mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
            What would weaken this conclusion
          </h2>
          <ul className="max-w-prose list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="font-medium text-foreground">
                Higher-resolution geographic controls
              </strong>{" "}
              (sub-district / Lok Sabha constituency FE) showing
              the Christian-belt premium dissolves at finer
              geographic resolution — would force a reframe to
              "central-Kerala region effect" rather than
              "Christian-share effect."
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Sub-community survey microdata
              </strong>{" "}
              showing the Christian-belt premium is concentrated
              in one denomination (e.g. Latin Catholic Munambam
              backlash, Syro-Malabar specifically) — would shift
              the interpretation from a generic Christian shift to
              a specific community reaction.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                A 2031 Christian-belt revert
              </strong>{" "}
              — would suggest 2026 was anti-incumbency channelled
              through the Christian belt, not a structural
              re-alignment.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Multi-cycle FPTP analysis showing Kerala's
                vote distribution doesn't typically sit near
                threshold
              </strong>{" "}
              — would suggest the 2026 amplification was an
              unusual configuration that won't recur.
            </li>
          </ul>
        </section>

        <section className="border-t pt-8 text-xs text-muted-foreground">
          <p>
            <strong className="font-medium text-foreground">
              Source analyses (full detail).
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
      </PageMain>
    </PageShell>
  )
}
