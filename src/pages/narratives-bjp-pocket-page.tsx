import { Link } from "react-router-dom"

import { ChoroplethLegend } from "@/components/charts/choropleth-legend"
import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { StackedBarByCategory } from "@/components/charts/stacked-bar-by-category"
import {
  TrajectoryLines,
  type TrajectorySeries,
} from "@/components/charts/trajectory-lines"
import { NarrativeArcBreadcrumb } from "@/components/narratives/narrative-arc-breadcrumb"
import { NarrativeSection } from "@/components/narratives/narrative-section"
import { PullQuote } from "@/components/narratives/pull-quote"
import { TakeawayBox } from "@/components/narratives/takeaway-box"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import {
  getAllACMetrics,
  getBJPShareInYear,
  getPerACAllianceShare,
  getPerACBJPDelta,
  getPerACWinner2026,
} from "@/lib/data/narrative-metrics"

/** Top BJP gainers, classified by trajectory type per Arc 3 card. */
const CONTEST_ENTRY_AC_LABELS: Array<{
  ac: number
  label: string
  color: string
}> = [
  { ac: 101, label: "Poonjar (P.C. George)", color: "rgb(255, 127, 14)" },
  { ac: 127, label: "Varkala", color: "rgb(255, 152, 50)" },
  { ac: 95, label: "Vaikom", color: "rgb(255, 175, 80)" },
  { ac: 13, label: "Thalassery", color: "rgb(255, 195, 100)" },
  { ac: 88, label: "Devikulam", color: "rgb(255, 215, 130)" },
  { ac: 78, label: "Paravur", color: "rgb(255, 230, 160)" },
]

const ORGANIC_AC_LABELS: Array<{
  ac: number
  label: string
  color: string
}> = [
  { ac: 111, label: "Thiruvalla (Anoop Antony)", color: "rgb(31, 119, 180)" },
  { ac: 116, label: "Karunagappally", color: "rgb(60, 145, 200)" },
  { ac: 93, label: "Pala (Shone George)", color: "rgb(95, 165, 215)" },
]

const CESSION_DISTRICTS_DATA = [
  { category: "Trivandrum", positive: 19.9 + 0, negative: 0 },
  { category: "Kottayam", positive: 25.1 + 18.2 + 16.2, negative: -10.9 - 8.9 - 7.1 },
  { category: "Pathanamthitta", positive: 14.5, negative: -21.9 },
  { category: "Thrissur", positive: 17.9, negative: -18.9 - 18.0 - 8.0 },
  { category: "Ernakulam", positive: 12.8, negative: -15.2 - 11.3 - 10.5 - 10.4 - 8.5 - 7.0 - 6.3 },
  { category: "Idukki", positive: 13.5, negative: -15.3 },
  { category: "Kollam", positive: 11.6 + 11.6, negative: -13.7 - 9.0 },
  { category: "Kannur", positive: 15.8, negative: -6.4 },
  { category: "Malappuram", positive: 9.8, negative: -6.8 },
]

/**
 * Arc 3 — BJP geographic pocket. Documents the +0.18pp / ±25pp
 * paradox: BJP grew 14-25pp in 11 ACs (mostly contest-entry
 * activations) while withdrawing entirely from 26 others, with
 * the net cancelling at the statewide aggregate.
 *
 * Built per docs/narratives-publish-plan.md Phase 8.
 */
export function NarrativesBJPPocketPage() {
  const all = getAllACMetrics()
  const winner2026 = getPerACWinner2026()
  const bjpDeltaMap = getPerACBJPDelta()

  // 3 BJP wins for the winner-map highlight.
  const bjpWins = new Set<number>()
  for (const [acNumber, alliance] of winner2026.entries()) {
    if (alliance === "NDA") bjpWins.add(acNumber)
  }

  // For the "3 wins" section: use NDA share 2026 in sequential
  // (saffron/orange) mode. The 3 BJP wins show as the darkest
  // spots (highest NDA share), with the BJP-win seats outlined.
  const ndaShare2026 = getPerACAllianceShare("NDA", 2026)

  // Build trajectory series.
  const allTrajectorySeries: TrajectorySeries[] = [
    ...CONTEST_ENTRY_AC_LABELS.map((entry): TrajectorySeries => {
      const v2016 = getBJPShareInYear(entry.ac, 2016) ?? 0
      const v2021 = getBJPShareInYear(entry.ac, 2021) ?? 0
      const m = all.find((x) => x.acNumber === entry.ac)
      const v2026 = m?.bjp2026 ?? 0
      return {
        label: `${entry.label} (entry)`,
        color: entry.color,
        strokeStyle: "dashed",
        values: [v2016, v2021, v2026],
      }
    }),
    ...ORGANIC_AC_LABELS.map((entry): TrajectorySeries => {
      const v2016 = getBJPShareInYear(entry.ac, 2016) ?? 0
      const v2021 = getBJPShareInYear(entry.ac, 2021) ?? 0
      const m = all.find((x) => x.acNumber === entry.ac)
      const v2026 = m?.bjp2026 ?? 0
      return {
        label: `${entry.label} (organic)`,
        color: entry.color,
        strokeStyle: "solid",
        values: [v2016, v2021, v2026],
      }
    }),
  ]

  return (
    <PageShell
      breadcrumbs={[
        { label: "Narratives", href: "/narratives" },
        { label: "BJP geographic pocket" },
      ]}
      title="BJP grew +0.18pp statewide. The same number moved by ±25pp at the AC level."
      subtitle={
        <>
          <NarrativeArcBreadcrumb current={3} />
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            BJP did not become a statewide challenger in Kerala in
            2026. But beneath a nearly flat statewide vote share,
            the party reorganized its electoral geography —
            withdrawing from some constituencies, concentrating
            resources in others, and building stronger pockets in
            South Kerala and a few candidate-driven Central Kerala
            seats. The Trivandrum belt looks like BJP's clearest
            long-term base area, while some Central Kerala gains
            may depend heavily on individual personalities rather
            than durable ideological expansion.{" "}
            <strong className="font-medium text-foreground/90">
              Confidence: Moderate-strong (descriptive / mixed
              mechanism).
            </strong>
          </p>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground/80">
            <strong className="font-medium text-foreground/80">
              Surprise from this arc:
            </strong>{" "}
            BJP grew +14-25pp in 11 specific seats while withdrawing
            entirely from 26 others. The aggregate cancels to
            +0.18pp; the per-AC story is a major reshuffle.
          </p>
        </>
      }
    >
      <PageMain className="space-y-10 py-6 pb-12">
        <NarrativeSection
          heading="BJP did not break out statewide; the 3 wins are a Trivandrum-area cluster"
          sectionType="foundational"
          layout="visual-right"
          visual={
            <div className="space-y-2">
              <ChoroplethMap
                valueByAC={ndaShare2026}
                colorScale="sequential"
                domain={[0, 45]}
                sequentialColor="#FF7F0E"
                highlightSeats={bjpWins}
                ariaLabel="NDA vote share per constituency in 2026; BJP wins outlined"
                unit="%"
                decimals={1}
                tooltipFormat={(acNumber, value) => {
                  const m = all.find((x) => x.acNumber === acNumber)
                  const won =
                    winner2026.get(acNumber) === "NDA" ? "NDA win" : null
                  return (
                    <span>
                      <span className="font-medium">
                        {m?.acName ?? `AC ${acNumber}`}
                      </span>
                      : <span className="font-mono">
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
            </div>
          }
          caption="NDA vote share in 2026. The 3 BJP wins (Nemom, Chathannoor, Kazhakoottam) are the darkest spots and are outlined; all three are in or adjacent to Trivandrum district."
        >
          <p>
            BJP captured 3 seats in 2026: <strong>Nemom</strong>{" "}
            (Rajeev Chandrasekhar, ~5,000-vote margin),{" "}
            <strong>Chathannoor</strong> (B.B. Gopakumar, 4,402),
            and <strong>Kazhakoottam</strong> (V. Muraleedharan,
            428 — effectively a coin flip). All three are in
            high-Hindu-share Trivandrum-area seats; mean Hindu
            share of the 3 wins is 70.2% vs 53.4% statewide.
          </p>
          <p>
            UDF underperformed in those 3 seats: mean UDF Δshare
            +0.6pp vs +5.8pp in matched Hindu-majority controls.
            About a 5pp UDF underperformance gap. The Onmanorama
            "weak UDF candidates" framing has empirical support
            here — though candidate quality is observed
            indirectly, through outcomes rather than directly.
          </p>
          <p>
            The "BJP grew systematically more in Hindu-heavy
            seats" gradient claim weakens substantially under
            district fixed effects (β = +0.098, p = 0.213). The 3
            specific wins are real and concentrated, but the
            broader gradient is not robustly detectable. The
            accurate framing: <em>the 3 wins are in Hindu-heavy
            Trivandrum-area seats</em> (descriptive cluster),
            not <em>BJP grew more wherever Hindu share was
            higher</em> (the gradient claim).
          </p>
        </NarrativeSection>

        <NarrativeSection
          heading="Beneath the flat aggregate, BJP reorganized its electoral map"
          sectionType="foundational"
          layout="visual-left"
          visual={
            <div className="space-y-2">
              <ChoroplethMap
                valueByAC={bjpDeltaMap}
                colorScale="diverging"
                domain={[-25, 25]}
                ariaLabel="Kerala constituencies shaded by BJP party-share Δ 2021 → 2026"
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
          caption="BJP party-share Δ 2021 → 2026, per AC. Red = BJP withdrew or lost share; blue = BJP gained. The ±25pp range cancels to +0.18pp at the statewide aggregate."
        >
          <p>
            Per-AC BJP party-share Δ ranges from -21.9pp (Konni —
            BJP fielded in 2021, withdrew in 2026) to +25.1pp
            (Poonjar — BJP didn't seriously contest in 2021,
            P.C. George contested in 2026). 11 ACs gained ≥10pp;
            26 ACs were BJP cessions to NDA allies (BDJS, KC(B),
            Twenty20).
          </p>
          <p>
            Sum of positive Δs: +349.6pp across 129 ACs. Sum of
            negative Δs: -308.7pp across 136 ACs. The two roughly
            cancel — yielding the +0.18pp statewide aggregate.
            BJP fielded fewer candidates in 2026 (98 of 140) than
            in 2021 (115 of 140): the cession strategy was
            deliberate alliance-management.
          </p>
          <p>
            Cession ACs went from a mean NDA-aggregate of 9.6% to
            9.8% — alliance allies absorbed BJP's withdrawn vote
            share roughly 1:1. The aggregate stayed flat in those
            ACs. So the cessions are alliance-management, not
            voter-loss. But "held" doesn't mean "leveraged" — NDA
            in those ACs was at ~10% and stayed ~10%.
          </p>
        </NarrativeSection>

        <PullQuote>
          A statewide +0.18pp masks a +349pp / −309pp reshuffle. The
          aggregate is the wrong unit; the per-AC pattern is the
          story.
        </PullQuote>

        <NarrativeSection
          heading="BJP retreated from Christian-mixed Ernakulam and pushed into Trivandrum"
          sectionType="mechanism"
          layout="stacked"
          visual={
            <StackedBarByCategory
              rows={CESSION_DISTRICTS_DATA}
              positiveLabel="Sum of BJP gains (pp)"
              negativeLabel="Sum of BJP cessions (pp)"
              positiveColor="rgb(31, 119, 180)"
              negativeColor="rgb(220, 38, 38)"
              yUnit="pp"
              yDecimals={0}
              ariaLabel="BJP gains and cessions summed by district"
            />
          }
          caption="Sum of positive (gains) and negative (cessions) BJP party-share Δs per district. Ernakulam was the biggest cession zone; Kottayam shows the biggest gains AND large cessions."
        >
          <p>
            Ernakulam was the biggest cession zone — BJP withdrew
            from 7+ Christian-mixed ACs there, ceding ground to
            Twenty20 (Kitex-backed NDA partner) and KC(B). Mean
            Ernakulam BJP Δ: -4.40pp.
          </p>
          <p>
            Kottayam shows the most extreme variance: massive
            gains (Poonjar +25, Pala +18, Vaikom +16) AND large
            cessions (Ettumanoor -10.9, Kaduthuruthy -8.9). The
            district-mean +3.6pp Δ averages a strategic-withdrawal
            pattern over an aggressive-fielding pattern; the
            average is meaningless without context.
          </p>
          <p>
            Trivandrum's mean +4.5pp Δ is more uniformly positive
            — that's where BJP's pre-existing organisational base
            allows broader cycle-on-cycle expansion, including
            both the 3 wins and surrounding ACs (Varkala +19.9,
            Nedumangad, Kazhakoottam +6.6, Chathannoor +7.6).
          </p>
        </NarrativeSection>

        <NarrativeSection
          heading="Most big BJP gains are candidate-driven, not durable brand expansion"
          sectionType="exploratory"
          layout="stacked"
          visual={
            <TrajectoryLines
              cycles={[2016, 2021, 2026]}
              series={allTrajectorySeries}
              yUnit="%"
              yDecimals={0}
              yDomain={[0, 35]}
              ariaLabel="BJP party-share trajectory 2016 → 2021 → 2026 for top 9 gainer ACs, color-coded by contest-entry vs organic"
            />
          }
          caption="BJP party-share trajectory across three cycles. Dashed lines = contest-entry activations (BJP fielded seriously in 2026 from a near-zero 2021 base). Solid lines = organic expansion."
        >
          <p>
            Of the top 12 BJP gainers (Δ ≥ +9.6pp): 8 are
            <strong> contest-entry activations</strong> — BJP
            fielding seriously where it had previously stood
            aside. Poonjar (0% → 25%), Varkala (0% → 20%), Vaikom
            (0% → 16%), Thalassery (0% → 16%), Devikulam,
            Paravur, Kundara, Thavanur. Only 3-4 are{" "}
            <strong>organic expansion</strong>: Thiruvalla
            (16% → 31%), Karunagappally (7% → 19%), Pala (8% → 26%
            with the Shone George candidacy).
          </p>
          <p>
            The distinction matters for 2031 durability.
            Contest-entry gains depend on candidate retention: if
            BJP doesn't field a comparable name in those seats,
            the share could revert. P.C. George at Poonjar is the
            cleanest test — he had a 5-cycle Poonjar incumbency
            under different colours before joining BJP, so the
            +25pp jump is partly his personal vote. If BJP holds
            20%+ in Poonjar in 2031 with a different candidate,
            durable. If it falls back to 5%, candidate-personality
            effect.
          </p>
          <p>
            Organic expansion (Thiruvalla, Karunagappally) is
            stronger evidence for durable BJP advance. Those ACs
            doubled or tripled an existing base — suggesting brand
            traction beyond the specific candidate.
          </p>
        </NarrativeSection>

        <TakeawayBox>
          <p>
            BJP didn't break out statewide in 2026; it reorganized.
            The 3 wins are a Trivandrum-area Hindu-heavy cluster
            with weak UDF candidates underperforming by ~5pp, not a
            broader gradient (the Hindu-share regression collapses
            under district FE). Beneath the +0.18pp aggregate, BJP
            withdrew from 26 ACs (mostly Christian-mixed Ernakulam)
            and pushed hard into 11 others. Most of the big gainers
            are contest-entry activations or candidate-driven
            jumps; only a few (Thiruvalla, Karunagappally) look
            like organic brand expansion. Durability vs personality
            is the open question for 2031.
          </p>
        </TakeawayBox>

        <section className="border-t pt-8">
          <h2 className="font-heading mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
            What would weaken this conclusion
          </h2>
          <ul className="max-w-prose list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="font-medium text-foreground">
                2031 BJP share reverting to &lt;10%
              </strong>{" "}
              in Pala, Poonjar, Thiruvalla when those candidates
              are no longer on the ballot — would suggest the
              +14-25pp gains were candidate-specific, not BJP
              brand-building.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Cession ACs showing NDA-aggregate decline to ≤5%
                in 2031
              </strong>{" "}
              — would suggest the alliance-management strategy
              permanently sacrificed BJP's footprint there rather
              than maintaining it.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Sub-community polling
              </strong>{" "}
              showing the +14-25pp gains in Christian-heavy ACs
              came overwhelmingly from non-Christian voters in
              those constituencies — would dismantle the implicit
              "BJP making Christian inroads" reading.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Multi-cycle data showing BJP's per-AC variance is
                always large in Kerala
              </strong>{" "}
              — would suggest the ±25pp range is normal cycle-on-
              cycle, not a 2026-specific reshuffle.
            </li>
          </ul>
        </section>

        <section className="border-t pt-8 text-xs text-muted-foreground">
          <p>
            <strong className="font-medium text-foreground">
              Source analyses (full detail).
            </strong>{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/a3-bjp-three-wins.md"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              A3 — BJP's 3 wins concentrated
            </a>
            {" · "}
            <a
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/bjp-ac-growth.md"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              BJP AC-growth
            </a>
            .
          </p>
          <p className="mt-2">
            <strong className="font-medium text-foreground">
              Explore the data:
            </strong>{" "}
            see the BJP gainers on{" "}
            <Link
              to="/explore?seat=101"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Poonjar
            </Link>
            ,{" "}
            <Link
              to="/explore?seat=93"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Pala
            </Link>
            ,{" "}
            <Link
              to="/explore?seat=111"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Thiruvalla
            </Link>
            , or browse all BJP-related questions on{" "}
            <Link
              to="/questions"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              /questions
            </Link>
            .
          </p>
        </section>
      </PageMain>
    </PageShell>
  )
}
