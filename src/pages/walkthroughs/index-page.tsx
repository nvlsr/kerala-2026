import { Link } from "react-router-dom"

import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { ReligionCategoricalMap } from "@/components/religion-categorical-map"
import {
  CHRISTIAN_SUBRITE_COLORS,
  NO_DATA_GRAY,
} from "@/components/walkthroughs/colors"
import { WalkthroughCard } from "@/components/walkthroughs/walkthrough-card"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import {
  getPerACAllianceDelta,
  getPerACBJPDelta,
  getPerACWinner2026,
} from "@/lib/data/walkthrough-metrics"
import { COHORT_BY_AC } from "@/pages/walkthroughs/christian-data"

const SURPRISES = [
  {
    title: "Sabarimala-route effect: wrong sign",
    body: "Press framing predicted larger LDF losses in pilgrim-route ACs. Data shows -3.6pp vs -7.3pp in matched controls — LDF lost LESS in route ACs. NDA share also fell there, opposite of the prediction.",
  },
  {
    title: "Muslim-belt: stable lead, ordinary swing",
    body: 'Muslim-heavy ACs lead UDF by ~+11pp every cycle (the level). In 2026 they swung at the wave rate, not above it (the gradient). Press "minority consolidation" framings conflate the two — the data supports the first, not the second.',
  },
  {
    title: "Cabinet-status: no penalty above the LDF baseline",
    body: "Mean LDF Δshare among 21 ministers: -6.89pp. Among 78 non-minister LDF incumbents: -7.63pp. Ministers lost slightly LESS than non-minister incumbents.",
  },
  {
    title: "UDF wins not narrow on average",
    body: "UDF's median winning margin is 12.19pp; LDF's is 6.99pp. UDF won by larger margins, not tight 1-2pp escapes. The 'tight wins' framing the press used doesn't fit the data.",
  },
  {
    title: "BJP aggregate: hides ±25pp AC reorganisation",
    body: "Statewide BJP +0.18pp. Per-AC distribution ranges -21.9pp to +25.1pp. 11 ACs gained ≥10pp; 26 ACs were BJP cessions to NDA allies. Gains and cessions roughly cancel at the aggregate.",
  },
]

const ARC_KEY_STAT_CLASS = "text-base font-semibold"

/**
 * Top page of the /walkthroughs surface. Hero + 3 arc cards + sidebar
 * callouts. The reader should grasp the three-arc thesis in 90s.
 *
 */
export function WalkthroughsPage() {
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
      breadcrumbs={[{ label: "Walkthroughs" }]}
      title="Kerala 2026 was three overlapping patterns, not one wave"
      aboutContent={
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            A constituency-level decomposition of Kerala 2026. Anti-LDF
            anti-incumbency was the broad universal driver (~7pp uniform). Two
            religious belts in central Kerala — Christian (Idukki, Ernakulam,
            Kottayam) and Muslim (Wayanad, Malappuram) — delivered a 47-of-47
            UDF sweep covering 46% of its majority margin. BJP's flat
            statewide aggregate masked targeted consolidation in a 30-seat
            target set, not statewide expansion.
          </p>
          <p className="border-t pt-3 text-muted-foreground">
            Each arc has its own page with choropleths and supporting charts.
            Drill into individual seat data on{" "}
            <Link
              to="/explore"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              /explore
            </Link>
            ; full underlying analyses live in{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/tree/main/docs/narratives"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              docs/narratives/
            </a>{" "}
            on GitHub.
          </p>
        </div>
      }
      subtitle={
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Kerala 2026 is best read as three distinct patterns laid over the
          same map. Anti-LDF anti-incumbency was the broad universal driver
          (~7pp uniform). On top of that, two religious belts in central
          Kerala — Christian (south) and Muslim (north) — gave UDF a
          47-of-47 sweep that delivered 46% of its majority margin. BJP's
          near-flat statewide aggregate (+0.18pp) hid targeted consolidation
          in a 30-seat target set, not statewide expansion.
        </p>
      }
    >
      <PageMain className="space-y-12 py-6 pb-12">
        {/* Three arc cards */}
        <section
          aria-label="Three arcs"
          className="grid grid-cols-1 gap-5 lg:grid-cols-3"
        >
          <WalkthroughCard
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
                Three quarters of ACs fell in the modest-loss range (-10 to
                0pp). Only 6 (4.3%) had catastrophic loss. The drop was
                religion-blind, route-blind, and cabinet-status-blind: the
                press's "Sabarimala backlash" and "minister-targeted
                anti-incumbency" framings don't show up at the constituency
                level.
              </>
            }
            href="/walkthroughs/ldf-walkthrough"
          />
          <WalkthroughCard
            title="Central Kerala provided nearly half the majority margin"
            confidence="Strong"
            headlineStat={
              <span className={ARC_KEY_STAT_CLASS}>
                47 of 47 UDF wins across Idukki, Ernakulam, Wayanad, Malappuram,
                Kottayam
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
                Two religious belts carried the sweep: the Christian belt
                (Idukki, Ernakulam, Kottayam) where the historic UDF lead
                doubled to +4.6pp in 2026, and the Muslim belt (Wayanad,
                Malappuram) where UDF's stable +11pp lean held with a
                wave-sized swing. UDF deployed different strategies in each
                belt — and both delivered.
              </>
            }
            href="/walkthroughs/udf-walkthrough"
          />
          <WalkthroughCard
            title="BJP 2026: targeted consolidation, not statewide expansion"
            confidence="Strong"
            headlineStat={
              <span className={ARC_KEY_STAT_CLASS}>
                Statewide BJP +0.3pp; inside a 30-seat target set, +5.2pp and
                3 wins
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
                BJP traded breadth for intensity: fewer seats contested
                (115 → 98 candidates), higher share where it does. A guided
                tour through 6 cohorts — mature-base growers, multi-cycle
                builders, low-base breakouts, declining mature seats,
                anti-LDF wave-capture, and the negative-space terrain where
                BJP doesn't compete.
              </>
            }
            href="/walkthroughs/nda-walkthrough"
          />
        </section>

        {/* By-religion walkthroughs */}
        <section aria-label="By-religion walkthroughs">
          <header className="mb-4">
            <h2 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">
              By religion
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <WalkthroughCard
              title="How Kerala's Christian sub-communities moved in 2026"
              confidence="Tentative"
              headlineStat={
                <span className={ARC_KEY_STAT_CLASS}>
                  Each sub-rite has its own historical alliance pattern
                </span>
              }
              visual={
                <ReligionCategoricalMap
                  acValues={COHORT_BY_AC}
                  bucketColors={CHRISTIAN_SUBRITE_COLORS}
                  noDataColor={NO_DATA_GRAY}
                  ariaLabel="Kerala constituencies coloured by dominant Christian sub-rite"
                  className="max-h-44"
                />
              }
              summary={
                <>
                  Christian Kerala isn't a single bloc. Across 4 cycles, the
                  six sub-rite cohorts trace distinct trajectories.
                  Syro-Malabar, Jacobite, and Indian Orthodox cohorts{" "}
                  <em>returned</em> to their 2011-era UDF baselines in 2026.
                  Latin Catholic and Marthoma cohorts{" "}
                  <em>flipped</em> from structurally LDF-leaning territory —
                  17 of 28 Latin ACs swung LDF→UDF. Three confounder tests
                  document why the cohort effect is community-driven, not
                  district or share artefact.
                </>
              }
              href="/walkthroughs/christian-walkthrough"
            />
          </div>
        </section>

        {/* Sidebar callouts */}
        <section
          aria-label="Cross-cutting framings"
          className="grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          <article className="rounded-sm border bg-card/50 p-6">
            <h2 className="font-heading text-base font-semibold tracking-tight">
              Swing source vs geographic concentration
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Two analytically separable layers explain the 2026 outcome. The{" "}
              <em>swing source</em> — where votes came from — was mostly LDF
              erosion landing on UDF (98% of LDF's loss; see Arc 1). The{" "}
              <em>geographic concentration</em> — where the swing landed
              hardest — was the two religious belts in central Kerala
              (47-of-47 UDF sweep; see Arc 2). A 7pp statewide swing alone
              wouldn't have produced a 102-seat majority; the two-belt
              concentration is what turned it into a landslide.
            </p>
          </article>
          <article className="rounded-sm border bg-card/50 p-6">
            <h2 className="font-heading text-base font-semibold tracking-tight">
              Religious belts, not religious realignment
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The catalog implies a calmer reading than the dominant press
              framing. LDF's loss had a tight distribution (SD 4.5pp); the
              Christian-belt premium is modest (+4.6pp); the Muslim-belt
              swing was wave-sized; BJP's pocket is concentrated in 3
              specific seats. A polarized communal-realignment interpretation
              predicts bimodal distributions, large within-district gradients,
              and broad-based BJP advance. None of those show up. The 2026
              result reads as a calm distribution shift overlaid with modest
              local patterns.
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
              Findings that reversed pre-analysis intuitions during the
              catalog's construction. The full discussion is in the synthesis
              card.
            </p>
          </header>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {SURPRISES.map((s) => (
              <li key={s.title} className="rounded-sm border bg-card/30 p-4">
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
            All bin means and per-AC differentials are constituency-equal (each
            AC counts once). Statewide aggregates are vote-weighted. The unit of
            analysis is the constituency, not the individual voter — see the{" "}
            <Link
              to="/walkthroughs/methodology"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              methodology page
            </Link>{" "}
            for the standing convention on inference, alliance-share accounting,
            district / region fixed effects, gradient-vs-cluster distinction,
            counterfactual logic, and falsification triggers.
          </p>
          <p className="mt-2">
            <strong className="font-medium text-foreground">Reproduce.</strong>{" "}
            Source data, Python analysis scripts, and the full source cards are
            in the project repository:{" "}
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
