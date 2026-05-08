import { ChoroplethLegend } from "@/components/charts/choropleth-legend"
import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { StackedBarByCategory } from "@/components/charts/stacked-bar-by-category"
import {
  TrajectoryLines,
  type TrajectorySeries,
} from "@/components/charts/trajectory-lines"
import { ConfidenceBadge } from "@/components/narratives/confidence-badge"
import {
  type Footnote,
  FootnoteRef,
  Footnotes,
} from "@/components/narratives/footnotes"
import { GoingInCallout } from "@/components/narratives/going-in-callout"
import { MethodologyPopover } from "@/components/narratives/methodology-popover"
import { NarrativeArcBreadcrumb } from "@/components/narratives/narrative-arc-breadcrumb"
import { NarrativeSection } from "@/components/narratives/narrative-section"
import {
  PartyLink,
  PROSE_LINK_CLASS,
  ProseLink,
  SeatLink,
} from "@/components/narratives/prose-link"
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
 * Pre-poll strategy citations referenced from Going-in callouts on
 * this page. Numbering is manual; authors keep <FootnoteRef n={N} />
 * usage aligned with these entries. See docs/narratives/pre-election-*.md
 * for the full sourced strategy catalogue.
 */
const FOOTNOTES: Footnote[] = [
  {
    n: 1,
    content: (
      <>
        Twenty 20 formally inducted into NDA. Rajeev Chandrasekhar /{" "}
        <a
          href="https://www.thehindu.com/news/national/kerala/twenty20-party-in-kerala-joins-nda/article70537444.ece"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          The Hindu
        </a>
        {" "}/ 22 January 2026.
      </>
    ),
  },
  {
    n: 2,
    content: (
      <>
        Twenty 20 framed as ideological partner, not seat-sharing
        convenience. Sabu M. Jacob, T20 chief coordinator: "What
        matters more is that the ideology of development that
        Twenty20 and NDA share should flourish." <em>Times of India</em>
        {" "}/ 6 February 2026.
      </>
    ),
  },
  {
    n: 3,
    content: (
      <>
        BDJS allocated Kayamkulam and Kuttanad. Thushar Vellappally,
        BDJS president. <em>The New Indian Express</em> / 7 March
        2026.
      </>
    ),
  },
  {
    n: 4,
    content: (
      <>
        Sneha Yathra — 10-day Christian outreach.{" "}
        <a
          href="https://www.thehindu.com/news/national/kerala/bjp-to-rebuild-ties-with-christians-in-kerala-ahead-of-lok-sabha-elections/article67607956.ece"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          The Hindu
        </a>
        {" "}/ BJP Kerala leadership / 2025.
      </>
    ),
  },
  {
    n: 5,
    content: (
      <>
        "Micro-minority" status framing for Christians. Rajeev
        Chandrasekhar /{" "}
        <a
          href="https://www.thehindu.com/news/national/kerala/church-requested-micro-minority-status-at-meet-with-rijiju-chandrasekhar/article70667327.ece"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          The Hindu
        </a>
        {" "}/ February 2026.
      </>
    ),
  },
  {
    n: 6,
    content: (
      <>
        BJP manifesto — institutional recognition for Christian
        micro-minorities: "Institutional recognition will help
        integrate micro-minorities into Keralam's development agenda."
        BJP manifesto / <em>ThePrint</em> / 7 April 2026.
      </>
    ),
  },
  {
    n: 7,
    content: (
      <>
        Munambam Latin Catholic land-dispute plank. Amit Shah, Union
        Home Minister: amendments to safeguard residents' property.
        <em> The New Indian Express</em> / 6 April 2026.
      </>
    ),
  },
]

/**
 * Arc 3 — BJP geographic pocket. Documents the +0.18pp / ±25pp
 * paradox: BJP grew 14-25pp in 11 ACs (mostly contest-entry
 * activations) while withdrawing entirely from 26 others, with
 * the net cancelling at the statewide aggregate.
 *
 * Built per docs/narratives-publish-plan.md Phase 8. Strategy
 * integration sourced from docs/narratives/pre-election-*.md.
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
            <ConfidenceBadge level="strong" />
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
              What's surprising here:
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
          heading="BJP turned Nemom into a 3-seat Trivandrum cluster"
          sectionType="foundational"
          layout="visual-right"
          visual={
            <div className="mx-auto max-w-sm space-y-2">
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
            Going into 2026, BJP had momentum in Trivandrum's
            organisational politics: the party flipped Trivandrum
            City Corporation in late 2025, ending 45 years of LDF
            rule. The Assembly outcome — 3 wins clustered around
            the same district — extends that pattern into state
            politics.
          </p>
          <p>
            Three seats: <SeatLink ac={135}>Nemom</SeatLink>{" "}
            (Rajeev Chandrasekhar, ~5,000),{" "}
            <SeatLink ac={126}>Chathannoor</SeatLink> (B.B.
            Gopakumar, 4,402), and{" "}
            <SeatLink ac={132}>Kazhakoottam</SeatLink>{" "}
            (V. Muraleedharan, 428 — effectively a coin flip). In
            interviews leading up to the election, Chandrasekhar
            framed BJP's approach as candidate-quality-first; the
            Trivandrum slate is consistent with that.
          </p>
          <p>
            <SeatLink ac={135}>Nemom</SeatLink> was already a BJP
            seat in 2016 — so what's new in 2026? Three things, all
            clustered together. All three wins are in or adjacent
            to Trivandrum district. All three are in 65%+
            Hindu-share seats. Mean Hindu share of the 3 wins is
            ~70%, vs ~53% statewide.
          </p>
          <p>
            <strong>
              If demographics matter so much, why didn't BJP win
              more Hindu-heavy seats?
            </strong>{" "}
            UDF Δshare in the 3 wins was +0.6pp vs +5.8pp in{" "}
            <MethodologyPopover term="matched-controls">
              matched Hindu-majority controls
            </MethodologyPopover>
            {" "}— a real 5pp gap. We can't fully attribute it. Two
            factors are likely contributing, neither testable from
            constituency-level data alone:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-[14px] sm:text-[15px]">
            <li>
              <strong>Marquee BJP candidates.</strong>{" "}
              <em>Rajeev Chandrasekhar</em> at Nemom (Union MoS,
              national-profile name) and <em>V. Muraleedharan</em>{" "}
              at Kazhakoottam (former Union MoS, BJP Kerala
              state-org veteran) are observably stronger BJP picks
              than the party's typical Kerala field. In three-way
              contests, a marquee NDA candidate can pull crossover
              votes that would otherwise have gone UDF.
            </li>
            <li>
              <strong>
                Sub-demographic features specific to the Trivandrum
                belt.
              </strong>{" "}
              Nair share, Hindu+Muslim composition (rather than
              Hindu+Christian), and the IT-corridor /
              professional-class profile of Kazhakoottam and Nemom
              are all plausible factors. None of these is
              observable cleanly at the AC level in our data —{" "}
              <MethodologyPopover term="fixed-effects">
                district fixed effects
              </MethodologyPopover>{" "}
              absorb caste-share variation, so we can detect
              district-level signal but not within-district.
            </li>
          </ul>
          <p>
            <strong>
              Did BJP grow generally wherever the Hindu population
              was higher across Kerala?
            </strong>{" "}
            No — once we account for district-level differences,
            the relationship collapses (β = +0.098, p = 0.213).
            What we have is a <em>cluster</em>, not a gradient — and
            a cluster doesn't extrapolate.
          </p>
        </NarrativeSection>

        <NarrativeSection
          heading="Beneath the flat aggregate, gains and withdrawals tell two different stories"
          sectionType="foundational"
          layout="visual-left"
          visual={
            <div className="mx-auto max-w-sm space-y-2">
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
            <strong>The descriptive picture.</strong> Per-AC{" "}
            <PartyLink party="Bharatiya Janata Party">BJP</PartyLink>{" "}
            party-share Δ ranges from -21.9pp (
            <SeatLink ac={114}>Konni</SeatLink> — BJP fielded in
            2021, withdrew in 2026) to +25.1pp (
            <SeatLink ac={101}>Poonjar</SeatLink> — BJP didn't
            seriously contest in 2021, P.C. George contested in
            2026). BJP fielded fewer candidates overall — down to
            98 from 115 in 2021.
          </p>
          <p>
            The +0.18pp statewide aggregate is the sum of three
            distinct buckets that nearly cancel:
          </p>
          <figure className="my-3 max-w-prose overflow-hidden rounded-sm border bg-card/30">
            <table className="w-full text-[13px] sm:text-[14px]">
              <thead className="bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Bucket</th>
                  <th className="px-3 py-2">What happened</th>
                  <th className="px-3 py-2 text-right whitespace-nowrap">
                    VS delta
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-3 py-2 align-top font-medium">
                    Grew
                  </td>
                  <td className="px-3 py-2 align-top text-muted-foreground">
                    ~60 ACs where BJP gained share
                  </td>
                  <td className="px-3 py-2 align-top text-right whitespace-nowrap font-mono text-emerald-700 dark:text-emerald-500">
                    +350pp
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 align-top font-medium">
                    Shrank but still ran
                  </td>
                  <td className="px-3 py-2 align-top text-muted-foreground">
                    ~12 ACs (e.g. BJP 15% → 10%)
                  </td>
                  <td className="px-3 py-2 align-top text-right whitespace-nowrap font-mono text-red-700 dark:text-red-500">
                    −47pp
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 align-top font-medium">
                    Withdrew entirely
                  </td>
                  <td className="px-3 py-2 align-top text-muted-foreground">
                    26 ACs (e.g. BJP 22% → 0%)
                  </td>
                  <td className="px-3 py-2 align-top text-right whitespace-nowrap font-mono text-red-700 dark:text-red-500">
                    −262pp
                  </td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="px-3 py-2 align-top font-semibold">
                    Net
                  </td>
                  <td className="px-3 py-2 align-top text-muted-foreground">
                    +40pp constituency-equal → vote-weighted
                  </td>
                  <td className="px-3 py-2 align-top text-right whitespace-nowrap font-mono font-semibold">
                    +0.18pp
                  </td>
                </tr>
              </tbody>
            </table>
          </figure>
          <p>
            <strong>
              BJP-the-party was flat (+0.18pp), but
              NDA-the-alliance modestly grew (+1.83pp).
            </strong>{" "}
            Of that 1.83pp, ~1.6pp came from{" "}
            <PartyLink party="Twenty 20 Party">Twenty 20</PartyLink>
            's expansion — alliance growth that doesn't show up in
            BJP's column.
          </p>
          <GoingInCallout>
            <p>
              Twenty 20 was formally inducted into NDA on 22 January
              2026<FootnoteRef n={1} />. Its chief coordinator framed
              the alliance as ideological alignment, not seat-sharing
              convenience<FootnoteRef n={2} />. BDJS was allocated
              specific seats — Kayamkulam and Kuttanad among them —
              by early March<FootnoteRef n={3} />.
            </p>
          </GoingInCallout>
          <p>
            <strong>Two distinct withdrawal patterns.</strong> The
            26 withdrawal ACs split by which NDA ally substituted,
            and the two patterns go in <em>opposite</em> directions:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14px] sm:text-[15px]">
            <li>
              <strong>
                Where{" "}
                <PartyLink party="Twenty 20 Party">
                  Twenty 20
                </PartyLink>{" "}
                substituted (mostly Ernakulam) — NDA aggregate
                grew.
              </strong>{" "}
              <SeatLink ac={81}>Thripunithura</SeatLink> +4pp,{" "}
              <SeatLink ac={83}>Thrikkakara</SeatLink> +4pp,{" "}
              <SeatLink ac={74}>Perumbavoor</SeatLink> +5pp. T20
              fielded 19 candidates in 2026 (up from a much smaller
              2021 footprint) and crossed 15-19% in several of
              those seats, exceeding BJP's previous showing.
            </li>
            <li>
              <strong>
                Where{" "}
                <PartyLink party="Bharath Dharma Jana Sena">
                  BDJS
                </PartyLink>{" "}
                substituted (elsewhere) — NDA aggregate shrank.
              </strong>{" "}
              <SeatLink ac={114}>Konni</SeatLink> -11pp,{" "}
              <SeatLink ac={62}>Kunnamkulam</SeatLink> -7pp,{" "}
              <SeatLink ac={90}>Thodupuzha</SeatLink> -7pp. BDJS
              recovered only about half of BJP's previous share.
            </li>
          </ul>
          <p>
            <strong>What likely paid off, and what didn't.</strong>{" "}
            Two things look like clear wins. First, Twenty 20's
            Ernakulam expansion: NDA went from "BJP scraping 10-15%
            in scattered Ernakulam seats" to "T20 broadly present
            at 15-19%" — alliance growth, not just substitution.
            Second, the 11 BJP gainers, where concentrated effort
            plus marquee candidates (Anoop Antony at{" "}
            <SeatLink ac={111}>Thiruvalla</SeatLink>, P.C. George
            at <SeatLink ac={101}>Poonjar</SeatLink>, Shone George
            at <SeatLink ac={93}>Pala</SeatLink>) produced +14-25pp
            jumps. The miss was the BDJS substitution zone —
            alliance courtesy without immediate payoff.
          </p>
        </NarrativeSection>

        <PullQuote>
          A statewide +0.18pp masks a +349pp / −309pp reshuffle. The
          aggregate is the wrong unit; the per-AC pattern is the
          story.
        </PullQuote>

        <NarrativeSection
          heading="BJP ran three different strategies in three types of districts"
          sectionType="mechanism"
          layout="visual-right"
          visual={
            <StackedBarByCategory
              rows={CESSION_DISTRICTS_DATA}
              positiveLabel="Sum of BJP gains (pp)"
              negativeLabel="Sum of BJP withdrawals (pp)"
              positiveColor="rgb(31, 119, 180)"
              negativeColor="rgb(220, 38, 38)"
              yUnit="pp"
              yDecimals={0}
              ariaLabel="BJP gains and withdrawals summed by district"
            />
          }
          caption="Sum of positive (gains) and negative (withdrawals) BJP party-share Δs per district. The shape of each bar — gains-only, balanced gains-and-withdrawals, or withdrawals-dominated — sorts districts into three archetypes."
        >
          <p>
            The chart slices the gains-vs-withdrawals split by
            district. The interesting finding: BJP didn't run a
            single statewide strategy. The bars sort cleanly into
            three archetypes:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-[14px] sm:text-[15px]">
            <li>
              <strong>Push districts (gains-only).</strong>{" "}
              Trivandrum (+20pp gains, ~0 withdrawals), Kannur
              (+16 / -6). BJP added pockets without retreating
              anywhere. Trivandrum holds the 3 wins plus the
              biggest non-winning gainer (
              <SeatLink ac={127}>Varkala</SeatLink> +19.9).
              Kannur's gain is dominated by{" "}
              <SeatLink ac={13}>Thalassery</SeatLink> (+15.8pp).
            </li>
            <li>
              <strong>
                Swap districts (high-variance gains AND
                withdrawals).
              </strong>{" "}
              Kottayam (+60 / -27), Kollam (+23 / -23). BJP
              repositioned <em>within</em> the district —
              aggressive new fielding in some seats, full
              withdrawal from others. Kottayam is the clearest
              case: massive gains in{" "}
              <SeatLink ac={101}>Poonjar</SeatLink> (+25),{" "}
              <SeatLink ac={93}>Pala</SeatLink> (+18),{" "}
              <SeatLink ac={95}>Vaikom</SeatLink> (+16) sit
              alongside large withdrawals in{" "}
              <SeatLink ac={96}>Ettumanoor</SeatLink> (-10.9) and{" "}
              <SeatLink ac={94}>Kaduthuruthy</SeatLink> (-8.9).
              The district-mean is meaningless without this
              context.
            </li>
            <li>
              <strong>
                Retreat districts (withdrawals dominate).
              </strong>{" "}
              Ernakulam (+13 / -69), Thrissur (+18 / -45),
              Pathanamthitta (+14 / -22), Idukki (+13 / -15). BJP
              pulled its candidate from many more seats than it
              advanced into. Ernakulam is the extreme case — 7+
              withdrawals, mostly Christian-mixed seats handed to{" "}
              <PartyLink party="Twenty 20 Party">
                Twenty 20
              </PartyLink>
              .
            </li>
          </ul>
          <p>
            The aggregate-level wash (+0.18pp net) hides this
            geographic shape. Trivandrum was about expansion;
            Kottayam was about repositioning; Ernakulam was about
            getting out of the way for an ally. Three different
            strategies, three different archetypes, one statewide
            number that papers over all of it.
          </p>
        </NarrativeSection>

        <NarrativeSection
          heading="Most big BJP gains are candidate-driven, not durable brand expansion"
          sectionType="exploratory"
          layout="visual-right"
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
          <GoingInCallout>
            <p>
              BJP ran a multi-year Christian outreach: a 10-day
              <em> Sneha Yathra</em> through Christian-belt
              districts in 2025<FootnoteRef n={4} />; a "micro-minority"
              status framing for Christians in early 2026
              <FootnoteRef n={5} />; an institutional-recognition
              promise for Christian micro-minorities in the manifesto
              <FootnoteRef n={6} />; and a Munambam Latin Catholic
              land-dispute plank during the campaign
              <FootnoteRef n={7} />. Christian candidates were fielded
              prominently in central-Kerala mixed-religion seats
              (Anoop Antony at Thiruvalla, Shone George at Pala).
            </p>
          </GoingInCallout>
          <p>
            Of the top 11 BJP gainers (Δ ≥ +9.6pp): 8 are
            <strong> contest-entry activations</strong> — BJP
            fielding seriously where it had previously stood
            aside. <SeatLink ac={101}>Poonjar</SeatLink>{" "}
            (0% → 25%), <SeatLink ac={127}>Varkala</SeatLink>{" "}
            (0% → 20%), <SeatLink ac={95}>Vaikom</SeatLink>{" "}
            (0% → 16%), <SeatLink ac={13}>Thalassery</SeatLink>{" "}
            (0% → 16%), <SeatLink ac={88}>Devikulam</SeatLink>,{" "}
            <SeatLink ac={78}>Paravur</SeatLink>,{" "}
            <SeatLink ac={123}>Kundara</SeatLink>,{" "}
            <SeatLink ac={47}>Thavanur</SeatLink>. Only 3 are{" "}
            <strong>organic expansion</strong>:{" "}
            <SeatLink ac={111}>Thiruvalla</SeatLink> (16% → 31%),{" "}
            <SeatLink ac={116}>Karunagappally</SeatLink>{" "}
            (7% → 19%), <SeatLink ac={93}>Pala</SeatLink>{" "}
            (8% → 26% with the Shone George candidacy).
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
            Anoop Antony at <SeatLink ac={111}>Thiruvalla</SeatLink>{" "}
            is a BJP heavyweight with his own Christian-leadership
            network — the +14.5pp gain is hard to fully separate
            from him personally. The cleaner distinction we can
            draw: Thiruvalla had a 16% baseline to grow from
            (doubling), while Poonjar grew from a 0% base (pure
            activation). The 2031 test is whether Thiruvalla holds
            20%+ even with a different candidate.
          </p>
          <p>
            <SeatLink ac={116}>Karunagappally</SeatLink> is the
            cleanest organic case in the list — no marquee
            candidate, but a 7% → 19% climb that looks like genuine
            ground-level brand drift in a Hindu-mixed seat.
          </p>
        </NarrativeSection>

        <TakeawayBox>
          <p>
            BJP-the-party was flat in 2026 (+0.18pp); NDA-the-alliance
            modestly grew (+1.83pp), with{" "}
            <PartyLink party="Twenty 20 Party">Twenty 20</PartyLink>{" "}
            providing most of the difference. Beneath the flat
            aggregate, three patterns play out at the district
            level: <strong>push</strong> in Trivandrum and Kannur
            (gains, no retreat), <strong>swap</strong> in Kottayam
            and Kollam (big gains alongside big withdrawals), and{" "}
            <strong>retreat</strong> in Ernakulam, Thrissur,
            Pathanamthitta, Idukki (withdrew much more than
            advanced). The 3 wins themselves are a Trivandrum-area
            cluster — Hindu-heavy seats with marquee BJP candidates
            in three-way contests; the gradient claim ("BJP grew
            wherever Hindu share was higher") doesn't hold up under
            district FE. Most of the +14-25pp gainers ride on
            individual candidates more than on brand drift, which
            sets up the 2031 durability question.
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
              className={PROSE_LINK_CLASS}
            >
              A3 — BJP's 3 wins concentrated
            </a>
            {" · "}
            <a
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/bjp-ac-growth.md"
              target="_blank"
              rel="noopener noreferrer"
              className={PROSE_LINK_CLASS}
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
            <SeatLink ac={101}>Poonjar</SeatLink>,{" "}
            <SeatLink ac={93}>Pala</SeatLink>,{" "}
            <SeatLink ac={111}>Thiruvalla</SeatLink>, or browse all
            BJP-related questions on{" "}
            <ProseLink to="/questions">/questions</ProseLink>.
          </p>
        </section>

        <Footnotes items={FOOTNOTES} />
      </PageMain>
    </PageShell>
  )
}
