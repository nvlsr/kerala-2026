import { Link } from "react-router-dom"
import { IconArrowRight, IconExternalLink } from "@tabler/icons-react"

import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import { SURFACE_CARD } from "@/components/walkthroughs/typography"
import { cn } from "@/lib/utils"

const FORECAST_URL = "https://kerala.jillen.com"
const POST_MORTEM_URL =
  "https://github.com/nvlsr/kerala-2026/blob/main/docs/forecast-post-mortem.md"

type ResidualRow = {
  alliance: "UDF" | "LDF" | "NDA"
  forecast: number
  actual: number
  residualPp: number
  residualSigma: number
  tone: "miss" | "miss" | "hit"
}

const RESIDUALS: ResidualRow[] = [
  {
    alliance: "UDF",
    forecast: 38.88,
    actual: 46.55,
    residualPp: +7.67,
    residualSigma: +4.8,
    tone: "miss",
  },
  {
    alliance: "LDF",
    forecast: 42.93,
    actual: 37.64,
    residualPp: -5.29,
    residualSigma: -3.5,
    tone: "miss",
  },
  {
    alliance: "NDA",
    forecast: 15.77,
    actual: 14.2,
    residualPp: -1.57,
    residualSigma: -0.9,
    tone: "hit",
  },
]

type AnalysisLink = {
  href: string
  title: string
  blurb: string
  external?: boolean
}

const NARRATIVE_LINKS: AnalysisLink[] = [
  {
    href: "/walkthroughs/ldf-walkthrough",
    title: "LDF — the anti-LDF wave was uniform",
    blurb:
      "Mean −7.4 pp loss across nearly every AC. Press-favoured mechanisms (Sabarimala, cabinet collapse) don't survive AC-level testing. Reads more like anti-incumbency than realignment.",
  },
  {
    href: "/walkthroughs/udf-walkthrough",
    title: "UDF — minority consolidation + Christian-belt strategy",
    blurb:
      "How UDF turned a 5.9 pp LS lead into a 102-seat sweep. Central-Kerala kingmaker analysis; the 36-AC Christian-belt strategy table; Malappuram non-reserved tactics.",
  },
  {
    href: "/walkthroughs/nda-walkthrough",
    title: "NDA — targeted consolidation, not statewide expansion",
    blurb:
      "Three wins (Nemom, Kazhakoottam, Chathannoor) + six cohort archetypes. BJP grew +5.2 pp inside a 30-seat target set; flat statewide aggregate hides the geography.",
  },
  {
    href: "/walkthroughs/christian-walkthrough",
    title: "Christian sub-rite cohorts",
    blurb:
      "OSM-derived sub-rite layer (Latin Catholic / Syro-Malabar / Syro-Malankara / Marthoma / etc.). Multi-cycle trajectories per cohort + the M1/M2/M3 mitigation tests.",
  },
]

const TOOL_LINKS: AnalysisLink[] = [
  {
    href: "/",
    title: "Dashboard",
    blurb:
      "Statewide results — alliance tallies, party breakdowns, the 140-AC map, 2011→2026 trends. Filters down to district / alliance / party / seat.",
  },
  {
    href: "/explore",
    title: "Explore",
    blurb:
      "Deep-dive per seat. Full candidate roster, per-AC historical chart, vote-flow patterns, religion + belt overlays.",
  },
  {
    href: "/questions",
    title: "Curated questions",
    blurb:
      'Pre-filtered views answering "where did NDA grow the most?", "which UDF wins were tight?", and similar narrative questions.',
  },
  {
    href: "/flows",
    title: "Vote flows (state-level)",
    blurb:
      "Statewide Sankey of alliance Δshares 2021→2026. Where the LDF vote went; how much landed on UDF vs NDA vs OTHER.",
  },
  {
    href: "/drifts",
    title: "Drifts (per-seat flows)",
    blurb:
      "Seat-level multi-cycle drift detection. Identifies the 41 ACs where significant alliance-level flows happened.",
  },
  {
    href: "/religion-map",
    title: "Religion gradient map",
    blurb:
      "District-level religion shares (AC-level for the 114 SHRUG-matched seats). Toggle between 2011 baseline and 2025 projection.",
  },
  {
    href: "/walkthroughs/insights",
    title: "Cohort overlay (interactive)",
    blurb:
      "Build-your-own intersection: pick a BJP cohort + a demographic cohort, see which ACs sit in both. Open-ended hypothesis tool.",
  },
  {
    href: "/walkthroughs/methodology",
    title: "Methodology",
    blurb:
      "Confidence vocabulary, mitigation tests, what the analysis can and can't say. Read before drawing causal conclusions.",
  },
]

function Residual({ row }: { row: ResidualRow }) {
  const isHit = row.tone === "hit"
  return (
    <tr className="border-b last:border-b-0">
      <td className="py-2.5 pr-4 font-semibold">{row.alliance}</td>
      <td className="py-2.5 pr-4 text-right tabular-nums">
        {row.forecast.toFixed(2)}%
      </td>
      <td className="py-2.5 pr-4 text-right font-medium tabular-nums">
        {row.actual.toFixed(2)}%
      </td>
      <td
        className={cn(
          "py-2.5 pr-4 text-right tabular-nums",
          isHit ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"
        )}
      >
        {row.residualPp > 0 ? "+" : ""}
        {row.residualPp.toFixed(2)} pp
      </td>
      <td
        className={cn(
          "py-2.5 text-right tabular-nums",
          isHit ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"
        )}
      >
        {row.residualSigma > 0 ? "+" : ""}
        {row.residualSigma.toFixed(1)} σ
      </td>
    </tr>
  )
}

function LinkCard({ link }: { link: AnalysisLink }) {
  const Inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-base font-semibold tracking-tight">
          {link.title}
        </h3>
        {link.external ? (
          <IconExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <IconArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        )}
      </div>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
        {link.blurb}
      </p>
    </>
  )

  const baseClass =
    "group block rounded-md border bg-card/30 p-4 transition-colors hover:bg-card/60"

  return link.external ? (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClass}
    >
      {Inner}
    </a>
  ) : (
    <Link to={link.href} className={baseClass}>
      {Inner}
    </Link>
  )
}

/**
 * Landing page for readers arriving from the kerala-vote-forecast project
 * (kerala.jillen.com). Not linked from the main app nav; reachable only
 * via deep link from the forecast site.
 *
 * The frame: "you came from the forecast — here's what actually happened
 * and what the post-election analysis says about it."
 *
 * Layout:
 *   1. Hero + 1-paragraph framing.
 *   2. Forecast vs actual residuals table.
 *   3. Post-mortem distilled (~150 words) + link to the full markdown.
 *   4. Bridge text.
 *   5. Two grids of analysis links: narrative walkthroughs + tools.
 */
export function FromForecastPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: "From the forecast" }]}
      title="From forecast to retrospective"
      subtitle={
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          You came from{" "}
          <a
            href={FORECAST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline decoration-foreground/30 underline-offset-2 hover:decoration-foreground"
          >
            kerala.jillen.com
          </a>{" "}
          — the pre-election forecast for the 2026 Kerala Assembly. The
          results are in. This page is the bridge: a brief post-mortem of
          the forecast, followed by an index of the post-election analysis.
        </p>
      }
    >
      <PageMain className="space-y-10 py-6 pb-12">
        {/* ── Residuals table ─────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Forecast vs reality
          </h2>
          <div className="overflow-hidden rounded-md border bg-card/30">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-3 py-2 text-left">Alliance</th>
                  <th className="px-3 py-2 text-right">Forecast point</th>
                  <th className="px-3 py-2 text-right">Actual</th>
                  <th className="px-3 py-2 text-right">Residual</th>
                  <th className="px-3 py-2 text-right">σ off</th>
                </tr>
              </thead>
              <tbody>
                {RESIDUALS.map((r) => (
                  <Residual key={r.alliance} row={r} />
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            All knobs at the forecast's published default (Medium). σ values
            are the forecast's stated per-alliance distribution width.
          </p>
        </section>

        {/* ── Post-mortem highlights ──────────────────────────────── */}
        <section className={cn(SURFACE_CARD, "space-y-3")}>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            What the post-mortem found
          </h2>
          <ul className="space-y-2 text-[14.5px] leading-relaxed">
            <li>
              <strong>NDA: the model got it right</strong> — point estimate
              inside 1 σ of actual. Direction, magnitude, and "small but
              expanding" framing all correct.
            </li>
            <li>
              <strong>UDF + LDF: catastrophic miss in the same direction.</strong>{" "}
              The model expected a small UDF decline and LDF holding ground.
              Reality was a ~13 pp swing between them, which the model
              assigned essentially zero joint probability to.
            </li>
            <li>
              <strong>Architectural ceiling.</strong> Even at every
              user-reachable knob extreme, the model couldn't reach UDF{" "}
              {">"} 41 % or LDF {"<"} 40 %. The miss was structural, not
              parameterisation.
            </li>
            <li>
              <strong>The forecast author saw the trapdoors.</strong> The
              methodology doc's "where this can fail" checklist named every
              binding constraint that ended up biting — anchoring 60 % on
              2021, no incumbency term, alliance independence. The model just
              couldn't act on its own diagnoses.
            </li>
          </ul>
          <p className="pt-2 text-sm">
            <a
              href={POST_MORTEM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium underline decoration-foreground/30 underline-offset-2 hover:decoration-foreground"
            >
              Read the full post-mortem
              <IconExternalLink className="h-3.5 w-3.5" />
            </a>
          </p>
        </section>

        {/* ── Bridge ───────────────────────────────────────────────── */}
        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            The post-election analysis
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            Now that we have AC-level results, this project breaks down what
            actually happened — by alliance, by religion, by cohort, and by
            geography. Start with the narrative walkthroughs (the "what
            happened and why" pages), then drop into the dashboard and tools
            for deeper exploration.
          </p>
        </section>

        {/* ── Narrative walkthroughs ──────────────────────────────── */}
        <section className="space-y-3">
          <h3 className="font-heading text-base font-semibold tracking-tight text-muted-foreground">
            Narrative walkthroughs
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {NARRATIVE_LINKS.map((l) => (
              <LinkCard key={l.href} link={l} />
            ))}
          </div>
          <p className="pt-1 text-sm">
            <Link
              to="/walkthroughs"
              className="inline-flex items-center gap-1 font-medium underline decoration-foreground/30 underline-offset-2 hover:decoration-foreground"
            >
              See the walkthroughs index
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </section>

        {/* ── Tools + dashboard ───────────────────────────────────── */}
        <section className="space-y-3">
          <h3 className="font-heading text-base font-semibold tracking-tight text-muted-foreground">
            Dashboard & exploration tools
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {TOOL_LINKS.map((l) => (
              <LinkCard key={l.href} link={l} />
            ))}
          </div>
        </section>
      </PageMain>
    </PageShell>
  )
}
