import { Link } from "react-router-dom"

import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { NarrativeArcCard } from "@/components/narratives/narrative-arc-card"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import {
  getPerACAllianceDelta,
  getPerACBJPDelta,
  getPerACWinner2026,
} from "@/lib/data/narrative-metrics"

const SURPRISES = [
  {
    title: "Sabarimala-route effect: wrong sign",
    body:
      "Press framing predicted larger LDF losses in pilgrim-route ACs. Data shows -3.6pp vs -7.3pp in matched controls — LDF lost LESS in route ACs. NDA share also fell there, opposite of the prediction.",
  },
  {
    title: "Muslim-share gradient: collapses under district FE",
    body:
      "Simple Pearson r ≈ 0; once district fixed effects are added, β=+0.016, p=0.795. Within a district, Muslim share doesn't predict UDF Δshare.",
  },
  {
    title: "Cabinet-status: no penalty above the LDF baseline",
    body:
      "Mean LDF Δshare among 21 ministers: -6.89pp. Among 78 non-minister LDF incumbents: -7.63pp. Ministers lost slightly LESS than non-minister incumbents.",
  },
  {
    title: "UDF wins not narrow on average",
    body:
      "UDF's median winning margin is 12.19pp; LDF's is 6.99pp. UDF won by larger margins. The efficiency story is the seat:vote-share ratio flip (UDF 1.04 → 2.18), not 'tight wins'.",
  },
  {
    title: "BJP aggregate: hides ±25pp AC reorganisation",
    body:
      "Statewide BJP +0.18pp. Per-AC distribution ranges -21.9pp to +25.1pp. 11 ACs gained ≥10pp; 26 ACs were BJP cessions to NDA allies. Gains and cessions roughly cancel at the aggregate.",
  },
]

const ARC_KEY_STAT_CLASS = "text-base font-semibold"

/**
 * Top page of the /narratives surface. Hero + 3 arc cards + sidebar
 * callouts. The reader should grasp the three-arc thesis in 90s.
 *
 * Built per docs/narratives-publish-plan.md Phase 5.
 */
export function NarrativesPage() {
  // Composite hero: 3 small Kerala maps side-by-side, one per arc.
  const ldfDelta = getPerACAllianceDelta("LDF")
  const udfDelta = getPerACAllianceDelta("UDF")
  const winner2026 = getPerACWinner2026()
  const bjpDelta = getPerACBJPDelta()

  // Highlight the 3 BJP wins on Arc 3 hero.
  const bjpWins = new Set<number>()
  for (const [acNumber, alliance] of winner2026.entries()) {
    if (alliance === "NDA") bjpWins.add(acNumber)
  }

  return (
    <PageShell
      breadcrumbs={[{ label: "Narratives" }]}
      title="Kerala 2026 was three overlapping patterns, not one wave"
      aboutContent={
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            A constituency-level decomposition of Kerala 2026.
            Anti-LDF anti-incumbency was the broad universal driver
            (~7pp uniform). Central Kerala added a Christian-belt UDF
            premium that converted a normal anti-incumbency election
            into a landslide. BJP's flat statewide aggregate masked a
            major per-AC reorganisation in southern and central
            Kerala.
          </p>
          <p className="border-t pt-3 text-muted-foreground">
            Each arc has its own page with choropleths and supporting
            charts. Drill into individual seat data on{" "}
            <Link
              to="/explore"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              /explore
            </Link>
            ; full underlying analyses live in{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/tree/main/docs/narrative-cards"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              docs/narrative-cards/
            </a>{" "}
            on GitHub.
          </p>
        </div>
      }
      subtitle={
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Kerala 2026 is best read as three distinct patterns laid
          over the same map. Anti-LDF anti-incumbency was the broad
          universal driver (~7pp uniform). On top of that, Central
          Kerala added a Christian-belt UDF premium that converted a
          normal anti-incumbency election into a landslide. BJP's
          near-flat statewide aggregate (+0.18pp) hid a major AC-level
          reshuffle, with concentrated wins in the Trivandrum belt.
        </p>
      }
    >
      <PageMain className="space-y-12 py-6 pb-12">
        {/* Three arc cards */}
        <section
          aria-label="Three arcs"
          className="grid grid-cols-1 gap-5 lg:grid-cols-3"
        >
          <NarrativeArcCard
            arcNumber={1}
            title="The anti-LDF wave was uniform"
            confidence="Strong"
            headlineStat={
              <span className={ARC_KEY_STAT_CLASS}>
                LDF lost ~7.4pp uniformly across 140 ACs (SD 4.5pp)
              </span>
            }
            visual={
              <ChoroplethMap
                valueByAC={ldfDelta}
                colorScale="diverging"
                domain={[-25, 25]}
                ariaLabel="Kerala constituencies shaded by LDF Δshare 2021 → 2026"
                unit="pp"
                decimals={1}
                className="max-h-44"
              />
            }
            summary={
              <>
                Three quarters of ACs fell in the modest-loss range
                (-10 to 0pp). Only 6 (4.3%) had catastrophic loss.
                The drop was religion-blind, route-blind, and
                cabinet-status-blind: the press's "Sabarimala
                backlash" and "minister-targeted anti-incumbency"
                framings don't show up at the constituency level.
              </>
            }
            href="/narratives/anti-ldf-wave"
          />
          <NarrativeArcCard
            arcNumber={2}
            title="Central Kerala provided nearly half the majority margin"
            confidence="Strong"
            headlineStat={
              <span className={ARC_KEY_STAT_CLASS}>
                47 of 47 UDF wins across Idukki, Ernakulam, Wayanad,
                Malappuram, Kottayam
              </span>
            }
            visual={
              <ChoroplethMap
                valueByAC={udfDelta}
                colorScale="diverging"
                domain={[-25, 25]}
                ariaLabel="Kerala constituencies shaded by UDF Δshare 2021 → 2026"
                unit="pp"
                decimals={1}
                className="max-h-44"
              />
            }
            summary={
              <>
                Christian-heavy ACs added a robust ~3-4pp UDF
                premium on top of the statewide wave (β=+0.19,
                p=0.008 with district FE). Combined with FPTP
                amplification, the modest swing converted into a
                102-seat majority. Muslim-share variation did not
                add a separate detectable premium.
              </>
            }
            href="/narratives/central-kerala"
          />
          <NarrativeArcCard
            arcNumber={3}
            title="BJP's 2026 performance — a data walkthrough"
            confidence="Moderate-strong"
            headlineStat={
              <span className={ARC_KEY_STAT_CLASS}>
                3 BJP wins; 6 cohorts trace where the party grew,
                declined, sat out, and stayed locked out
              </span>
            }
            visual={
              <ChoroplethMap
                valueByAC={bjpDelta}
                colorScale="diverging"
                domain={[-25, 25]}
                highlightSeats={bjpWins}
                ariaLabel="Kerala constituencies shaded by BJP party-share Δ 2021 → 2026; BJP wins outlined"
                unit="pp"
                decimals={1}
                className="max-h-44"
              />
            }
            summary={
              <>
                A guided tour of BJP's 2026 results, starting from
                the 3 wins (Nemom, Chathannoor, Kazhakoottam) and
                expanding outward through cohorts: mature-base
                growers, sustained multi-cycle builders, low-base
                breakouts, declining mature seats, anti-LDF
                wave-capture, and the negative-space terrain where
                BJP doesn't compete. Data-first; no strategic
                reverse-engineering.
              </>
            }
            href="/narratives/bjp-walkthrough"
          />
        </section>

        {/* Sidebar callouts */}
        <section
          aria-label="Cross-cutting framings"
          className="grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          <article className="rounded-sm border bg-card/50 p-6">
            <h2 className="font-heading text-base font-semibold tracking-tight">
              Swing source vs seat amplification
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Two analytically separable layers explain the 2026
              outcome. The <em>swing source</em> — where votes came
              from, where they went — is mostly LDF erosion landing
              on UDF (98% of LDF's loss; see Arc 1's flow
              decomposition). The <em>seat amplification</em> — how
              FPTP plurality converted that vote movement into seats
              — turned a 7.4pp swing into +61 UDF seats (≈8 seats
              per pp, 6× the proportional rate). Neither alone
              explains the landslide; together they do.
            </p>
          </article>
          <article className="rounded-sm border bg-card/50 p-6">
            <h2 className="font-heading text-base font-semibold tracking-tight">
              Kerala 2026 was not highly polarized
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The catalog implies a calmer reading than the dominant
              press framing. LDF's loss had a tight distribution
              (SD 4.5pp); the Christian-belt premium is modest
              (~3-4pp); BJP's pocket is concentrated in 3 specific
              seats. A polarized communal-realignment interpretation
              predicts bimodal distributions, large within-district
              gradients, and broad-based BJP advance. None of those
              show up. The 2026 result reads as a calm distribution
              shift overlaid with modest local patterns.
            </p>
          </article>
        </section>

        {/* What contradicted my prior expectations */}
        <section aria-label="What contradicted prior expectations">
          <header className="mb-4">
            <h2 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">
              What contradicted prior expectations
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Findings that reversed pre-analysis intuitions during
              the catalog's construction. The full discussion is in
              the synthesis card.
            </p>
          </header>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {SURPRISES.map((s) => (
              <li
                key={s.title}
                className="rounded-sm border bg-card/30 p-4"
              >
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Methodology + reproduce footer */}
        <section
          aria-label="Methodology"
          className="rounded-sm border bg-muted/30 p-6 text-xs text-muted-foreground"
        >
          <p>
            <strong className="font-medium text-foreground">
              Methodology.
            </strong>{" "}
            All bin means and per-AC differentials are
            constituency-equal (each AC counts once). Statewide
            aggregates are vote-weighted. The unit of analysis is
            the constituency, not the individual voter — see the{" "}
            <Link
              to="/narratives/methodology"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              methodology page
            </Link>{" "}
            for the standing convention on inference, alliance-share
            accounting, district / region fixed effects,
            gradient-vs-cluster distinction, counterfactual logic,
            and falsification triggers.
          </p>
          <p className="mt-2">
            <strong className="font-medium text-foreground">
              Reproduce.
            </strong>{" "}
            Source data, Python analysis scripts, and the full
            narrative-card documents are in the project repository:{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              github.com/nvlsr/kerala-2026
            </a>
            .
          </p>
        </section>
      </PageMain>
    </PageShell>
  )
}
