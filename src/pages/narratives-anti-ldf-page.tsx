import { Link } from "react-router-dom"

import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { ChoroplethLegend } from "@/components/charts/choropleth-legend"
import { ComparisonBar } from "@/components/charts/comparison-bar"
import { Histogram } from "@/components/charts/histogram"
import { NarrativeSection } from "@/components/narratives/narrative-section"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import {
  getAllACMetrics,
  getPerACAllianceDelta,
} from "@/lib/data/narrative-metrics"

const SABARIMALA_ROUTE_ACS = new Set([113, 114, 112]) // Aranmula, Konni, Ranni

/**
 * Arc 1 — the anti-LDF wave. Documents the broad uniform LDF loss
 * (mean -7.4pp, SD 4.5pp) and the three falsifications
 * (religion-blind, route-blind, cabinet-status-blind).
 *
 * Built per docs/narratives-publish-plan.md Phase 6.
 */
export function NarrativesAntiLDFPage() {
  const all = getAllACMetrics()
  const ldfDeltas = all.map((m) => m.deltas.LDF)
  const ldfDeltaMap = getPerACAllianceDelta("LDF")

  const meanLDF =
    ldfDeltas.reduce((s, v) => s + v, 0) / ldfDeltas.length

  // Sabarimala-route comparison
  const routeAcs = all.filter((m) => SABARIMALA_ROUTE_ACS.has(m.acNumber))
  const routeMean =
    routeAcs.reduce((s, m) => s + m.deltas.LDF, 0) / routeAcs.length
  // Hindu ≥ 50% controls excluding the route ACs
  // (using the published 2025-projection Hindu share would require
  //  an extra import; for the purposes of this comparison bar we
  //  use the matched-control numbers directly from A2's published
  //  result: -7.3pp mean).
  const matchedHinduControlMean = -7.3

  // Cabinet-status comparison (numbers from A6).
  const ministerMean = -6.89
  const nonMinisterIncumbentMean = -7.63

  return (
    <PageShell
      breadcrumbs={[
        { label: "Narratives", href: "/narratives" },
        { label: "Anti-LDF wave" },
      ]}
      title="The anti-LDF wave was uniform"
      subtitle={
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          LDF lost approximately 7pp of vote share across nearly
          every constituency. The drop was effectively
          religion-blind, route-blind, and cabinet-status-blind: the
          press's "Sabarimala backlash" and "minister-targeted
          anti-incumbency" framings don't show up at the
          constituency level. <strong className="font-medium text-foreground/90">Confidence: Strong.</strong>
        </p>
      }
    >
      <PageMain className="space-y-10 py-6 pb-12">
        <NarrativeSection
          heading="The wave was uniform"
          visual={
            <div className="space-y-2">
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
          <p>
            Across all 140 constituencies, LDF lost an average of{" "}
            <strong>{meanLDF.toFixed(2)}pp</strong> with a standard
            deviation of just 4.47pp. Three quarters of ACs sit in
            the modest-loss range (-10 to 0pp). Only 6 ACs (4.3%)
            had what could be called catastrophic loss
            (worse than -15pp).
          </p>
          <p>
            LDF's standard deviation is the smallest of the three
            alliances (LDF 4.47, UDF 5.65, NDA 5.04). The losing
            party's distribution is the tightest: voters left LDF
            broadly and evenly, not in concentrated wipeout zones.
          </p>
        </NarrativeSection>

        <NarrativeSection
          heading="Distribution shape: a tight bell with a small fat tail"
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
          caption="Distribution of LDF Δshare across all 140 ACs. Mean -7.43pp; median -7.73pp; IQR 5.80pp wide."
        >
          <p>
            Mean and median agree closely (-7.43 vs -7.73), so the
            distribution is essentially symmetric. The IQR — the
            middle 50% of ACs — spans just 5.80pp. The bulk of the
            mass sits between -12pp and -3pp.
          </p>
          <p>
            Excess kurtosis is +1.55, slightly fatter-tailed than a
            normal distribution. The outliers worth naming —
            Udumbanchola (-24.6pp), Payyannur (-17.8pp), Puthuppally
            (-16.8pp) on the loss side; Vengara (+8.5pp), Konni
            (+3.2pp) on the gain side — sit visibly outside the
            modal cluster. The "shallow everywhere" framing
            coexists with these specific outliers; both are true.
          </p>
        </NarrativeSection>

        <NarrativeSection
          heading="It wasn't Sabarimala-route-targeted"
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
          caption="Mean LDF Δshare: 3 Sabarimala-route ACs vs 88 Hindu-majority controls. Numbers from A2 analysis."
        >
          <p>
            Press framing predicted larger LDF losses in pilgrim-route
            ACs as evidence of Hindu backlash over the Sabarimala
            gold-cladding scandal and lingering 2018 anger. The data
            shows the opposite: the three geographic Sabarimala-route
            ACs (Aranmula, Konni, Ranni) had a smaller LDF loss
            ({routeMean.toFixed(1)}pp) than matched Hindu-majority
            controls (-7.3pp). NDA share also fell in those ACs
            (-2.3pp vs +1.9pp in matched controls), the wrong sign
            for the "Hindu shift to BJP" hypothesis.
          </p>
          <p>
            What does happen: the three Devaswom-related ministers
            (Vasavan / Ettumanoor, Veena George / Aranmula,
            Kadakampally / Kazhakoottam) lost their own seats by ~4pp
            more than matched controls. That's a minister-incumbency
            penalty applied to specific high-visibility cabinet
            members, not a route-targeted geographic effect.
          </p>
        </NarrativeSection>

        <NarrativeSection
          heading="It wasn't cabinet-status-targeted"
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
          <p>
            The "13 of 21 ministers defeated" headline is correctly
            reported — minister losses were highly visible. But on
            this data, ministers lost slightly less share than
            non-minister LDF incumbents (-6.89pp vs -7.63pp). The
            "minister-targeted anti-incumbency" hypothesis predicts
            a more-negative differential for ministers; the data
            shows a slightly less-negative one.
          </p>
          <p>
            The 14 ministers who lost their seats lost them because
            they happened to be sitting in the LDF column when a 7pp
            wave hit, not because voters specifically targeted
            cabinet members. Outsized individual losses concentrate
            among small-party LDF allies (JD(S), NCP, KC(M)) — that's
            a coalition-cohesion finding, not a cabinet-rejection one.
          </p>
        </NarrativeSection>

        <NarrativeSection
          heading="Where the LDF loss landed"
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
              ariaLabel="Mean Δshare by alliance — UDF absorbed almost the entire LDF loss"
              yDomain={[-3, 9]}
            />
          }
          caption="Mean per-AC Δshare 2021 → 2026. UDF absorbed 98% of LDF's loss; NDA absorbed 28%; OTHER bled."
          layout="side-by-side"
        >
          <p>
            The "UDF surge" reads more accurately as the geographic
            landing pattern of LDF erosion. UDF gained an average of
            +7.29pp per AC — almost numerically identical to LDF's
            -7.43pp loss. NDA also gained (+2.05pp), and OTHER
            alliances/independents bled (-1.91pp).
          </p>
          <p>
            65% of ACs show UDF-dominant absorption (UDF received
            &gt;70% of LDF's loss). 23% show NDA-dominant absorption
            (concentrated in southern Kerala — see Arc 3). Only 3%
            saw LDF hold or gain.
          </p>
          <p>
            This reframe matters for 2031: an "anti-LDF wave"
            interpretation predicts that recovering LDF voters could
            reverse the swing in future cycles. A "UDF mobilisation"
            interpretation would predict more durable UDF strength.
            The data on this cycle is more consistent with the
            former, but a 2031 LDF recovery (or its absence) is the
            real test.
          </p>
        </NarrativeSection>

        <section className="border-t pt-8">
          <h2 className="font-heading mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
            What would weaken this conclusion
          </h2>
          <ul className="max-w-prose list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="font-medium text-foreground">
                A more inclusive Sabarimala-route definition
              </strong>{" "}
              that includes additional ACs and shows a coherent LDF
              differential — would suggest the route effect is real
              but the 3-AC subset was too narrow.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Survey microdata
              </strong>{" "}
              showing voters in pilgrim-route ACs cited Sabarimala
              as a primary motivator at higher rates than elsewhere
              — would indicate a latent effect masked at the AC
              level.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Multi-cycle data showing ministers usually lose more
                than non-minister incumbents
              </strong>{" "}
              in similar conditions — would suggest the +0.74pp
              non-detection here is a 2026-specific artefact.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                A 2031 LDF recovery from the -7pp baseline
              </strong>{" "}
              — would confirm the anti-LDF reading. Failure to
              recover would suggest 2026 was a structural
              realignment rather than a transient anti-incumbency
              wave.
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
      </PageMain>
    </PageShell>
  )
}
