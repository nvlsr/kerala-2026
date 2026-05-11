import { Link } from "react-router-dom"

import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import { cn } from "@/lib/utils"

const TOC = [
  { id: "inference", label: "Constituency-level vs voter-level inference" },
  { id: "vote-share", label: "Vote-share Δ accounting" },
  { id: "fixed-effects", label: "District / region fixed effects" },
  { id: "gradient-vs-cluster", label: "Gradient vs cluster" },
  { id: "counterfactual", label: "Counterfactual logic" },
  { id: "falsification", label: "Falsification triggers" },
]

/**
 * Methodology page — first-class, surfacable, anchored. Arc pages
 * link to specific sections instead of inline-explaining ecological
 * fallacy / FE controls / counterfactual logic / etc.
 *
 * This page is the canonical methodology surface — the deeper analytical
 * notes per page now live in `docs/narratives/{ldf,udf,nda,christian,muslim}.md`.
 */
export function WalkthroughsMethodologyPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Walkthroughs", href: "/walkthroughs" },
        { label: "Methodology" },
      ]}
      title="Methodology"
      subtitle={
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The catalog's analytical credibility rests on a small number of
          methodological choices: how alliance shares are computed, what
          fixed-effect controls test, what constituency-level data can and
          cannot tell us, and what would falsify each finding. This page
          documents those choices once so arc pages can reference them rather
          than re-explaining.
        </p>
      }
    >
      <PageMain className="space-y-12 py-6 pb-12">
        {/* Table of contents */}
        <nav
          aria-label="Methodology sections"
          className="rounded-sm border bg-card/40 p-5"
        >
          <p className="mb-3 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            On this page
          </p>
          <ul className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
            {TOC.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-foreground/80 underline-offset-2 hover:text-foreground hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Section
          id="inference"
          heading="Constituency-level vs voter-level inference"
        >
          <p>
            Almost every analysis in this catalog operates on{" "}
            <strong>constituency-level totals</strong> (vote share, seats,
            alliance Δ) rather than voter-level data (individual voter intent,
            sub-community motivation, turnout decomposition). This is
            consequential.
          </p>
          <p>
            A constituency-level pattern is consistent with multiple voter-level
            mechanisms. The finding "Christian-heavy ACs swung +3-4pp more to
            UDF than matched Hindu-majority controls" is consistent with all of:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Christian voters individually switching from LDF to UDF (the
              press's typical reading)
            </li>
            <li>
              Differential turnout — Christian LDF voters staying home,
              Christian UDF voters showing up
            </li>
            <li>
              Cross-community voter movement — Hindu and Muslim voters in those
              ACs moving to UDF for non-religion reasons that happened to
              correlate with Christian-share geography
            </li>
            <li>
              Candidate-personality effects — UDF candidates in Christian-heavy
              ACs being structurally stronger
            </li>
            <li>
              Sub-community dynamics — specific Christian denominations moving
              differently
            </li>
          </ul>
          <p>
            Constituency-level data cannot discriminate between these
            mechanisms. Survey microdata could.
          </p>
          <p>
            <strong className="font-medium text-foreground">
              Convention used in this catalog:
            </strong>{" "}
            when a card says "Christian-heavy ACs swung to UDF," that's
            shorthand for the constituency-level pattern. When precision
            matters, cards use formulations like "Christian-heavy constituencies
            showed larger UDF swings" rather than "Christian voters moved to
            UDF." The former is what the data says; the latter is one inference
            consistent with the former.
          </p>
        </Section>

        <Section id="vote-share" heading="Vote-share Δ accounting">
          <p>
            Per-AC alliance vote-share Δ between 2021 and 2026 is the basic
            operation underlying most cards. Definitions:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong>Alliance share in an AC</strong> = (sum of alliance-tagged
              candidate votes) / (total non-NOTA votes) × 100, computed per AC.
            </li>
            <li>
              <strong>Alliance Δshare</strong> = 2026 share − 2021 share, per
              AC.
            </li>
            <li>
              <strong>Statewide aggregate</strong> = vote-weighted across all
              140 ACs. Different from constituency-equal mean.
            </li>
          </ul>
          <h3 className="mt-4 font-heading text-base font-semibold">
            Alliance tagging
          </h3>
          <p>
            Every candidate has an{" "}
            <code className="rounded bg-muted/40 px-1 font-mono text-xs">
              alliance
            </code>{" "}
            field set in the source data. Most candidates are tagged via their
            party (Congress → UDF, CPI(M) → LDF, BJP → NDA). Allied small
            parties (KC(M), KC(J), JD(S), NCP, RSP, BDJS, etc.) are tagged with
            their alliance at the time of each election. Independents come in
            four variants:{" "}
            <code className="rounded bg-muted/40 px-1 font-mono text-xs">
              Independent (UDF)
            </code>
            ,{" "}
            <code className="rounded bg-muted/40 px-1 font-mono text-xs">
              Independent (LDF)
            </code>
            ,{" "}
            <code className="rounded bg-muted/40 px-1 font-mono text-xs">
              Independent (NDA)
            </code>
            , and{" "}
            <code className="rounded bg-muted/40 px-1 font-mono text-xs">
              Independent
            </code>{" "}
            (unaligned, tagged OTHER).
          </p>
          <h3 className="mt-4 font-heading text-base font-semibold">
            KC(M) handling
          </h3>
          <p>
            Kerala Congress (M) — Jose K. Mani's faction — was alliance-tagged
            LDF in <em>both</em> 2021 AND 2026. KC(M) joined LDF in 2020, before
            this analysis window. The "KC(M) returned to UDF in 2026" claim that
            some commentary makes is a misremembering of the 2016→2020 switch.
            There is no alliance-relabel artifact in 2021→2026 figures from
            KC(M).
          </p>
          <p>
            KC(M)'s vote share <em>did</em> drop ~7pp on average across the 12
            ACs it contested in 2026, and that drop appears as LDF Δshare. In
            those specific ACs, the LDF loss reflects KC(M) base movement to
            other alliances (mostly UDF), not relabeling. A1 reports the
            magnitude: about 12% of A1's Christian-belt UDF premium is
            mechanically attributable to KC(M)-specific dynamics; ~88% is
            non-KC(M).
          </p>
          <h3 className="mt-4 font-heading text-base font-semibold">
            Constituency-equal vs vote-weighted
          </h3>
          <p>
            <strong>Constituency-equal mean Δshare</strong> sums per-AC Δshares
            and divides by 140. Each AC counts once regardless of turnout. Used
            for bin tables, regression coefficients, and most card-level
            comparisons. The unit of analysis is the constituency.
          </p>
          <p>
            <strong>Vote-weighted statewide Δshare</strong> sums alliance votes
            / sum of total votes. Each voter counts once regardless of which AC
            they're in. Used for headline statewide aggregates ("BJP +0.18pp
            statewide").
          </p>
          <p>
            These can differ. In Kerala 2026 they happen to be close
            (constituency-equal UDF Δ = +7.29pp, vote-weighted UDF Δ = +7.40pp),
            but the distinction is methodologically real. Cards state their
            convention.
          </p>
        </Section>

        <Section id="fixed-effects" heading="District / region fixed effects">
          <p>
            Fixed-effect (FE) regression tests whether per-AC Pearson
            correlations between religion / caste shares and alliance Δshare
            survive geographic-clustering controls.
          </p>
          <h3 className="mt-4 font-heading text-base font-semibold">
            District FE (14 dummies, one dropped as reference)
          </h3>
          <p>
            Each AC contributes a dummy for its district (one dropped to avoid
            perfect collinearity). In a model{" "}
            <code className="rounded bg-muted/40 px-1 font-mono text-xs">
              udf_delta ~ christian + muslim + udf21 + district_FE
            </code>
            , the coefficient on{" "}
            <code className="rounded bg-muted/40 px-1 font-mono text-xs">
              christian
            </code>{" "}
            represents the <em>within-district</em> effect of Christian share on
            UDF Δshare. ACs in the same district share the same district fixed
            effect, so the coefficient captures only AC-to-AC variation within
            each district.
          </p>
          <p>
            This is the strictest geographic control available with our data
            resolution. If a coefficient survives district FE at p&lt;0.05, the
            relationship is robust to "the religion gradient is just a
            Central-Kerala-region effect" critique.
          </p>
          <p>
            District FE absorbs <strong>caste data perfectly</strong> because
            Hindu sub-community shares in this catalog are inherited from
            district-level data — every AC in a given district has the same
            caste shares. So caste effects can only be tested under region FE,
            not district FE.
          </p>
          <h3 className="mt-4 font-heading text-base font-semibold">
            Region FE (3 regions: North / Central / South)
          </h3>
          <p>
            Coarser geographic control. North = Kasaragod / Kannur / Kozhikode /
            Wayanad / Malappuram; Central = Palakkad / Thrissur / Ernakulam /
            Idukki / Kottayam / Pathanamthitta / Alappuzha; South = Kollam /
            Trivandrum.
          </p>
          <p>
            Used when district FE is too strong (e.g., for caste analysis where
            district FE absorbs the predictor) or when region-level
            interpretation is more informative than district-level.
          </p>
          <h3 className="mt-4 font-heading text-base font-semibold">
            Reading FE results
          </h3>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong className="font-medium text-foreground">
                Survives district FE.
              </strong>{" "}
              Within-district variation in the predictor genuinely associates
              with the outcome. Strongest evidence.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Survives region FE only.
              </strong>{" "}
              The predictor associates at coarser geographic resolution but not
              within-district. Weaker; possibly some region-level factor
              correlated with the predictor.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Doesn't survive even region FE.
              </strong>{" "}
              The simple Pearson r was driven by between-region clustering. The
              "gradient" was actually a "cluster."
            </li>
          </ul>
        </Section>

        <Section id="gradient-vs-cluster" heading="Gradient vs cluster">
          <p>
            A distinction that runs through the catalog: gradient effects and
            cluster effects are different statistical phenomena, often confused.
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              A <strong>gradient effect</strong> says: as variable X increases,
              outcome Y changes systematically. The relationship is monotonic
              across the range of X. Test: Pearson correlation or regression
              coefficient.
            </li>
            <li>
              A <strong>cluster effect</strong> says: outcomes are concentrated
              in a specific subset of cases that share some property
              (geographic, demographic, structural). The relationship doesn't
              have to be monotonic. Test: whether the subset is descriptively
              distinguishable from the rest.
            </li>
          </ul>
          <p>
            <strong>
              Gradient claims are stronger evidence for a mechanism.
            </strong>{" "}
            A monotonic relationship that survives district FE means
            within-district variation in the predictor drives the outcome.
            Strong evidence that something tied to the predictor is causing the
            differential.
          </p>
          <p>
            <strong>
              Cluster claims describe a phenomenon without specifying its
              mechanism.
            </strong>{" "}
            "BJP's 3 wins are clustered in Trivandrum" is a true descriptive
            statement; it doesn't establish <em>why</em> they clustered there.
            Hindu share, Nair concentration, BJP organisational strength, NSS /
            SNDP politics, government-employee concentration, and three-way
            fragmentation are all candidate mechanisms.
          </p>
          <p>
            Findings in this catalog can be gradients (A1's Christian premium),
            clusters (A3's BJP wins), both (A1's full picture), or neither (A6's
            null finding on minister status).
          </p>
        </Section>

        <Section id="counterfactual" heading="Counterfactual logic">
          <p>
            Some findings rest on counterfactuals — "if condition X had held,
            what would have happened?" The vote-efficiency card's "+58 seats
            from FPTP amplification" claim is the clearest example.
          </p>
          <p>
            <strong>The counterfactual specifically:</strong> uniformly shift
            each AC's 2026 alliance share back to 2021 statewide levels.
            Recompute the winner of each AC under those shares. Result: UDF wins
            44 seats instead of 102. Difference: 58 seats.
          </p>
          <p>
            <strong>Limitation:</strong> the counterfactual assumes a uniform
            per-AC swing. A religion- or region-conditioned counterfactual
            (where the swing varies systematically with Christian share, for
            example) would attribute fewer seats to "geography" and more to
            "differentiated swing magnitude." The +58 estimate is therefore an
            upper bound on the FPTP-amplification effect.
          </p>
          <p>
            The qualitative point — FPTP near-threshold amplification produced
            an outsized seat shift — is robust regardless of the
            counterfactual's specifics. The exact number is more sensitive.
          </p>
        </Section>

        <Section id="falsification" heading="Falsification triggers">
          <p>
            Every evidence card includes a "What would weaken this conclusion"
            section listing concrete tests that would force a re-evaluation.
            This is Popperian methodology applied to election analysis: the
            value of a finding is partly defined by what would falsify it.
          </p>
          <p>Common falsification triggers across the catalog:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong>Multi-cycle replication failure.</strong> If 2031 doesn't
              show a similar pattern, the 2026 effect was cycle-specific.
            </li>
            <li>
              <strong>Survey microdata.</strong> If voter-level surveys
              contradict a constituency-level inference, the inference loses
              ground.
            </li>
            <li>
              <strong>Higher-resolution geographic controls.</strong>{" "}
              Sub-district / Lok Sabha-constituency FE could absorb a finding
              currently surviving district FE.
            </li>
            <li>
              <strong>Sub-community data.</strong> Christian / Muslim
              sub-community polling could decompose patterns the catalog treats
              as monolithic.
            </li>
            <li>
              <strong>Counterfactual sharpening.</strong> A religion-conditioned
              counterfactual could re-attribute the +58-seat amplification.
            </li>
          </ul>
          <p>
            Each card lists its own specific falsification triggers in the
            trifecta closing section.
          </p>
        </Section>

        <section className="rounded-sm border bg-muted/30 p-6 text-xs text-muted-foreground">
          <p>
            <strong className="font-medium text-foreground">
              Per-page deep reference.
            </strong>{" "}
            Each walkthrough has a companion markdown reference under{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/tree/main/docs/narratives"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              docs/narratives/
            </a>{" "}
            — full data tables, mitigation tests, per-cohort breakdowns, and
            cross-references that don't make it onto the page itself.
          </p>
          <p className="mt-2">
            <strong className="font-medium text-foreground">Reproduce.</strong>{" "}
            Analysis scripts are under{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/tree/main/scripts"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              scripts/
            </a>
            . Each narrative file lists its reproduction commands.
          </p>
          <Link
            to="/walkthroughs"
            className="mt-3 inline-block font-medium text-foreground underline-offset-2 hover:underline"
          >
            ← Back to walkthroughs overview
          </Link>
        </section>
      </PageMain>
    </PageShell>
  )
}

function Section({
  id,
  heading,
  children,
}: {
  id: string
  heading: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        "max-w-prose scroll-mt-8 space-y-3 text-sm leading-relaxed sm:text-[15px]"
      )}
    >
      <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
        {heading}
      </h2>
      {children}
    </section>
  )
}
