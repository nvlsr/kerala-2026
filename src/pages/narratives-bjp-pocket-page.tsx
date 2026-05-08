import { Link } from "react-router-dom"

import { ChoroplethLegend } from "@/components/charts/choropleth-legend"
import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { StackedBarByCategory } from "@/components/charts/stacked-bar-by-category"
import {
  TrajectoryLines,
  type TrajectorySeries,
} from "@/components/charts/trajectory-lines"
import { ConfidenceBadge } from "@/components/narratives/confidence-badge"
import { MethodologyPopover } from "@/components/narratives/methodology-popover"
import { NarrativeArcBreadcrumb } from "@/components/narratives/narrative-arc-breadcrumb"
import { NarrativeSection } from "@/components/narratives/narrative-section"
import { PullQuote } from "@/components/narratives/pull-quote"
import { SeeAlsoQuestions } from "@/components/narratives/see-also-questions"
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
  { ac: 123, label: "Kundara", color: "rgb(255, 165, 60)" },
  { ac: 47, label: "Thavanur", color: "rgb(255, 185, 80)" },
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
      title="BJP grew +0.18pp statewide. The same number moved by ±25pp at the constituency level."
      subtitle={
        <>
          <NarrativeArcBreadcrumb current={3} />
          <div className="mt-3">
            <ConfidenceBadge level="moderate-strong" />
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            BJP did not become a statewide challenger in Kerala in
            2026. But beneath a nearly flat statewide vote share,
            the party reorganized its electoral geography —
            withdrawing its candidate from some constituencies (ACs),
            concentrating resources in others, and building stronger
            pockets in South Kerala and a few candidate-driven
            Central Kerala seats. The Trivandrum belt looks like
            BJP's clearest long-term base area, while some Central
            Kerala gains may depend heavily on individual
            personalities rather than durable ideological expansion.
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
            Three seats:{" "}
            <Link
              to="/explore?seat=135"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Nemom
            </Link>{" "}
            (Rajeev Chandrasekhar, ~5,000),{" "}
            <Link
              to="/explore?seat=126"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Chathannoor
            </Link>{" "}
            (B.B. Gopakumar, 4,402), and{" "}
            <Link
              to="/explore?seat=132"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Kazhakoottam
            </Link>{" "}
            (V. Muraleedharan, 428 — effectively a coin flip). All
            three are in high-Hindu-share Trivandrum-area seats;
            mean Hindu share of the 3 wins is 70.2% vs 53.4%
            statewide.
          </p>
          <p>
            UDF underperformed in those 3 seats: mean UDF Δshare
            +0.6pp vs +5.8pp in{" "}
            <MethodologyPopover term="matched-controls">
              matched Hindu-majority controls
            </MethodologyPopover>
            . About a 5pp UDF underperformance gap. The "weak UDF
            candidates" reading has empirical support here, though
            candidate quality is observed indirectly — through
            outcomes rather than directly.
          </p>
          <p>
            A natural follow-up: did BJP grow more wherever the
            Hindu population was higher across Kerala? The data
            says no. Once we account for{" "}
            <MethodologyPopover term="fixed-effects">
              district-level differences
            </MethodologyPopover>
            , the relationship is statistically weak (β = +0.098,
            p = 0.213). What we actually find is a <em>cluster</em>:
            3 specific wins concentrated in Trivandrum-area
            Hindu-heavy seats, not a Kerala-wide pattern of "more
            Hindu → more BJP". The distinction matters for
            prediction — a cluster doesn't extrapolate.
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
            26 ACs saw BJP withdraw entirely, ceding ground to its
            two NDA allies — Twenty 20 and BDJS (Bharath Dharma Jana
            Sena, the SNDP-linked NDA partner).
          </p>
          <p>
            Across all 140 ACs, BJP gained a sum of{" "}
            <strong>+349.6pp</strong> in seats where it grew, and
            lost <strong>-308.7pp</strong> in seats where it shrank.
            The two roughly cancel — yielding the +0.18pp statewide
            aggregate. BJP fielded fewer candidates in 2026 (98 of
            140) than in 2021 (115 of 140): the withdrawal pattern
            was deliberate alliance-management, not collapse.
          </p>
          <p>
            Withdrawal ACs went from a mean NDA-aggregate of 9.6%
            to 9.8% — alliance allies absorbed BJP's withdrawn vote
            share roughly 1:1. The aggregate stayed flat in those
            ACs. So the withdrawals are alliance-management, not
            voter-loss. But "held" doesn't mean "leveraged" — NDA
            in those ACs was at ~10% and stayed ~10%.
          </p>
          <p>
            One note against expectations: <strong>Manjeswar</strong>{" "}
            (BJP's traditional north-tip seat) shows light red, not
            blue — i.e. BJP slipped slightly there. The pocket
            strategy in 2026 was decidedly southern; the
            traditional Karnataka-border foothold did not feature
            in the expansion plan.
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
          caption="Sum of positive (gains) and negative (withdrawals) BJP party-share Δs per district. Ernakulam was the biggest withdrawal zone; Kottayam shows the biggest gains AND large withdrawals."
        >
          <p>
            Ernakulam was the biggest withdrawal zone — BJP pulled
            its candidate from 7+ Christian-mixed ACs there, ceding
            ground almost entirely to Twenty 20 (BDJS picked up
            ground elsewhere, but in Ernakulam Twenty 20 was the
            destination). Mean Ernakulam BJP Δ: -4.40pp.
          </p>
          <p>
            Kottayam shows the most extreme variance: massive
            gains (Poonjar +25, Pala +18, Vaikom +16) AND large
            withdrawals (Ettumanoor -10.9, Kaduthuruthy -8.9). The
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
              ariaLabel="BJP party-share trajectory 2016 → 2021 → 2026 for top 11 gainer ACs, color-coded by contest-entry vs organic"
            />
          }
          caption="BJP party-share trajectory across three cycles for the top 11 gainers. Dashed orange/yellow lines = contest-entry activations (Poonjar, Varkala, Vaikom, Thalassery, Devikulam, Paravur, Kundara, Thavanur — most start near 0% in 2021 and overlap on the x-axis). Solid blue lines = the 3 organic expansions (Thiruvalla, Karunagappally, Pala)."
        >
          <p>
            Of the top 11 BJP gainers (Δ ≥ +9.6pp): 8 are
            <strong> contest-entry activations</strong> — BJP
            fielding seriously where it had previously stood
            aside. Poonjar (0% → 25%), Varkala (0% → 20%), Vaikom
            (0% → 16%), Thalassery (0% → 16%), Devikulam,
            Paravur, Kundara, Thavanur. Only 3 are{" "}
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
            Even the "organic" cases aren't pure brand expansion.
            Anoop Antony at Thiruvalla is a BJP heavyweight with
            his own Christian-leadership network — the +14.5pp
            gain is hard to fully separate from him personally.
            The cleaner distinction we can draw: Thiruvalla had a
            16% baseline to grow from (doubling), while Poonjar
            grew from a 0% base (pure activation). The 2031 test
            is whether Thiruvalla holds 20%+ even with a different
            candidate.
          </p>
          <p>
            Karunagappally is the cleanest organic case in the
            list — no marquee candidate, but a 7% → 19% climb that
            looks like genuine ground-level brand drift in a
            Hindu-mixed seat.
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

        <SeeAlsoQuestions
          items={[
            {
              id: "bjp-gains",
              label: "Where did BJP gain the most vote share?",
              hint: "Table of the top BJP gainers across all 140 ACs.",
            },
            {
              id: "bjp-declines",
              label: "Where did BJP lose the most vote share?",
              hint: "The withdrawal pattern as a sortable seat table.",
            },
            {
              id: "bjp-closest-wins",
              label: "Where did BJP win by the smallest margin?",
              hint: "Surfaces the Kazhakoottam coin flip.",
            },
            {
              id: "nda-growth-hindu-heavy",
              label: "Where did NDA grow the most in Hindu-heavy seats?",
              hint: "Direct evidence on the Hindu-share gradient question.",
            },
            {
              id: "bjp-closest-hindu-heavy",
              label: "Where did BJP come closest to winning in Hindu-heavy seats?",
              hint: "Trivandrum belt expansion in detail.",
            },
          ]}
        />

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
                Withdrawal ACs showing NDA-aggregate decline to ≤5%
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
