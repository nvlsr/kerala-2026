import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { IconInfoCircle } from "@tabler/icons-react"

import { BeltOverlaySection } from "@/components/belt-overlay-section"
import { MultiCycleDriftSection } from "@/components/flow-pattern-section"
import { RecentLegChart } from "@/components/recent-leg-chart"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  getMultiCycleDrifts,
  multiCyclePatternKey,
  multiCyclePatternLabel,
  type MultiCycleDrift,
} from "@/lib/data/flows"

// Hand-written editorial framings for the recent-leg (2021 → 2026)
// section. The bars show the per-seat magnitudes; these sentences
// frame what shape to look for and why it matters.
const RECENT_LEG_FRAMINGS: Record<string, string> = {
  LDF_to_NDA:
    "NDA's 2021 → 2026 movement across the 24 seats. The shape is mixed: a handful at the top with strong positive bars (drift is genuinely accelerating — Thiruvalla, Haripad, Chathannoor, Attingal lead), a larger middle band of small-positive bars (the drift is alive but slowing), and two or three seats at the bottom where the most recent cycle reversed against the cumulative arc (Malampuzha, Kunnathunad). One pattern worth flagging across the cumulative cards above and these bars together: NDA's vote share has never crossed 40% in any of these 24 seats over 15 years. The high-water marks cluster in the 31-38% band — Chathannoor 2026 (38%) is the visible peak. The recent-leg deceleration is consistent with that band acting as a soft ceiling: share keeps creeping, but per-cycle gains have visibly slowed near the top. Whether the ceiling is structural (Hindu-belt seats top out around a third because the remaining vote pool is structurally hostile) or just hasn't been breached yet is the genuinely open question for 2031.",
  LDF_to_UDF:
    "UDF's 2021 → 2026 movement in the 11 mostly Syro-Malabar seats. This pattern is the cumulative consequence of KC(M)'s 2020 front-switch settling out — the 2016 → 2021 leg captured most of the rebalancing, so the 2021 → 2026 bars show whether UDF's gain has held, extended, or partially reversed. Read flat-positive bars as 'consolidation', strongly positive as 'still extending', mixed as 'absorbed and now stable'.",
  UDF_to_NDA:
    "NDA's 2021 → 2026 movement in the 6 Trivandrum-and-Kottayam-highland seats. The smallest of the three patterns — every seat is informative individually. Strong positive bars here would mean the Trivandrum-Nair drift has further to run; flat or mixed bars would mean the cumulative shift has mostly settled.",
}

const RECENT_LEG_CROSS_PATTERN_OBSERVATION =
  "The recent leg is the most-predictive slice for what 2031 looks like. The 'sustained drift' classification flagged these seats by their cumulative 15-year behaviour; whether the underlying motion is still alive is what these bars actually show. Each pattern poses a different forward question: for LDF → NDA, whether the 31-38% band that contains every seat's high-water mark is a structural ceiling or a level that more seats will break through next cycle. For LDF → UDF, whether the post-2020 KC(M) effect is fully through the system. For UDF → NDA, whether the small Trivandrum cluster broadens or holds. Treating any single pattern as monolithic overstates the data — real political drift is messy, and the bars show it."

// Hand-written editorial framings for the multi-cycle drift × belt
// overlay. Numeric specifics are data-derived inside BeltOverlaySection;
// these sentences carry interpretation the data alone can't.
const MULTI_CYCLE_BELT_FRAMINGS: Record<string, string> = {
  LDF_to_NDA:
    "Spread across central and southern Kerala — central-syromalabar (5), southern-ezhava (5), and southern-nair-latin (4) lead, with smaller clusters across the central-reformed-christian, central-hindu, northern-mixed, and southern-coastal-mixed belts. The conspicuous absence is northern-muslim: IUML's structural hold in Malappuram blocks NDA's third-pole rise from reaching the Muslim belt at all. The drift lives in Hindu and Christian sub-community zones; it stops at the Muslim border.",
  LDF_to_UDF:
    "Heavily Christian-belt. The central-syromalabar zone holds 4 of 11 (Angamaly, Piravom, Muvattupuzha, Peerumade) — Syro-Malabar Catholic seats where KC(M) was historically UDF before its 2020 switch to LDF. The cumulative 15-year arc still reads as LDF→UDF in those seats because UDF's earlier base survives the cycle math. This pattern is largely a denominational story.",
  UDF_to_NDA:
    "Tightly clustered. Half (3 of 6) sit in southern-nair-latin — the Trivandrum Nair belt is the one place NDA has stripped UDF votes at scale. Two more in central-reformed-christian (Pala, Poonjar in Kottayam highlands), one in central-hindu (Ottappalam). The Ezhava and Syro-Malabar belts that drive LDF→NDA are absent here entirely; this is a different drift in a different geography.",
}

const MULTI_CYCLE_CROSS_PATTERN_OBSERVATION =
  "Notice that central-syromalabar appears in both LDF→NDA (5 seats) and LDF→UDF (4 seats). The Syro-Malabar Catholic belt is the most politically churned in the dataset — drifting in opposite directions in different seats simultaneously. Most other belts feed at most one drift pattern."

function groupBy<T, K extends string>(
  items: T[],
  key: (t: T) => K,
  label: (t: T) => string
): { key: K; label: string; items: T[] }[] {
  const map = new Map<K, { key: K; label: string; items: T[] }>()
  for (const item of items) {
    const k = key(item)
    if (!map.has(k)) map.set(k, { key: k, label: label(item), items: [] })
    map.get(k)!.items.push(item)
  }
  return [...map.values()].sort((a, b) => b.items.length - a.items.length)
}

export function DriftsPage() {
  const drifts = useMemo(() => getMultiCycleDrifts(), [])

  const driftGroups = useMemo(
    () =>
      groupBy<MultiCycleDrift, string>(
        drifts,
        (d) => multiCyclePatternKey(d),
        (d) => multiCyclePatternLabel(d)
      ),
    [drifts]
  )

  // Same hash-bounce trick the other pages use — re-set the hash after
  // first paint so :target picks up the right card on initial load.
  useEffect(() => {
    if (!window.location.hash) return
    const hash = window.location.hash
    const handle = requestAnimationFrame(() => {
      window.location.hash = ""
      window.location.hash = hash.slice(1)
    })
    return () => cancelAnimationFrame(handle)
  }, [])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header>
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-6">
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-foreground">
                Kerala 2026
              </Link>{" "}
              ·{" "}
              <Link to="/flows" className="hover:text-foreground">
                Vote flows
              </Link>{" "}
              · Drifts
            </p>
            <h1 className="font-heading flex items-center gap-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Sustained drifts
              <Popover>
                <PopoverTrigger
                  aria-label="About this page"
                  className="inline-flex shrink-0 items-center justify-center rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <IconInfoCircle className="h-5 w-5" aria-hidden />
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 sm:w-96"
                  align="start"
                  sideOffset={8}
                >
                  <div className="space-y-3 text-sm leading-relaxed">
                    <p>
                      The 15-year view. Seats where the same alliance has
                      been gaining (or losing) for multiple cycles running
                      — patterns that survived candidate changes, campaign
                      cycles, and at least one government in between. A
                      different question from the single-cycle{" "}
                      <Link
                        to="/flows"
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        Vote flows
                      </Link>
                      .
                    </p>
                    <p className="border-t pt-3 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Inferred, not observed.
                      </span>{" "}
                      We classify a seat by net change in alliance vote
                      share across cycles. A drift labelled "LDF → NDA"
                      could mean LDF voters chose NDA, <em>or</em> old LDF
                      voters stayed home while new NDA voters showed up.
                      Read it as "alliance X gained at alliance Y's
                      expense", not "voters moved from Y to X".
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <section>
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              Sustained 15-year drifts (2011 → 2026)
            </h2>
            <span className="text-xs tracking-wide text-muted-foreground uppercase">
              {drifts.length} of 140 seats
            </span>
          </div>
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Seats where the cumulative alliance shift across four cycles is
            at least 10pp, AND the gainer's gains were sustained across at
            least two of the three transitions — filtering out single-cycle
            anomalies. The long-term drifts, not one-off swings.
          </p>
          <ul className="flex flex-col gap-6">
            {driftGroups.map((g) => (
              <li key={g.key}>
                <MultiCycleDriftSection
                  patternLabel={g.label}
                  patternId={`drift-${g.key}`}
                  drifts={g.items}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              Recent leg (2021 → 2026): is the drift still going?
            </h2>
          </div>
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            The cumulative 15-year arc passes the "sustained drift"
            filter, but the most recent cycle is the most predictive
            slice for what 2031 looks like. Each bar shows how a
            seat's gainer-alliance share moved between 2021 and 2026.
            Bars to the right (positive, in the gainer's colour) mean
            the drift is still alive; bars to the left mean the seat
            has plateaued or reversed.
          </p>
          <ul className="flex flex-col gap-6">
            {driftGroups.map((g) => {
              const framing = RECENT_LEG_FRAMINGS[g.key]
              return (
                <li key={g.key}>
                  <article className="rounded-lg border bg-card/30 p-4 sm:p-6">
                    <header className="flex items-baseline justify-between gap-3">
                      <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
                        {g.label}
                      </h3>
                      <span className="text-xs tracking-wide text-muted-foreground uppercase">
                        sorted by 2021 → 2026 delta
                      </span>
                    </header>
                    {framing && (
                      <p className="mt-3 mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                        {framing}
                      </p>
                    )}
                    <RecentLegChart drifts={g.items} />
                  </article>
                </li>
              )
            })}
          </ul>
          <aside className="mt-6 rounded-md border-l-2 border-foreground/30 bg-muted/30 px-4 py-3 text-sm">
            <p className="mb-1 text-[10px] font-medium tracking-wider text-foreground/70 uppercase">
              Across patterns
            </p>
            <p className="leading-relaxed text-muted-foreground">
              {RECENT_LEG_CROSS_PATTERN_OBSERVATION}
            </p>
          </aside>
        </section>

        <section className="mt-12">
          <BeltOverlaySection
            patternGroups={driftGroups.map((g) => ({
              key: g.key,
              label: g.label,
              seats: g.items.map((d) => d.constituency),
            }))}
            framings={MULTI_CYCLE_BELT_FRAMINGS}
            crossPatternObservation={MULTI_CYCLE_CROSS_PATTERN_OBSERVATION}
            sectionTitle="By community belt — where each drift sits"
            sectionDescription="Each drift pattern's seats overlaid on Kerala's community-belt geography (Hindu / Muslim / Christian sub-community zones drawn from academic literature). The clusters tell three different stories about which communities are moving, and which aren't."
          />
        </section>

        <section className="mt-12">
          <details className="rounded-lg border bg-card/40 p-6 text-sm">
            <summary className="cursor-pointer font-medium">
              Methodology &amp; thresholds
            </summary>
            <div className="mt-3 space-y-3 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  Multi-cycle thresholds.
                </span>{" "}
                Cumulative gainer ≥ +10pp, loser ≤ −10pp across 2011→2026,
                and at least 2 of the 3 cycle transitions for the gainer
                agree with the cumulative direction.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Per-cycle alliance attribution.
                </span>{" "}
                Each candidate (2026 + every historical record) carries
                their own per-cycle alliance — KC(M) is UDF in 2011/2016
                and LDF from 2020 onwards, RSP is LDF in 2011 and UDF from
                2014, etc. Parties that switched fronts are correctly
                placed in each cycle's alliance, not anchored to today's.
              </p>
              <p>
                <span className="font-medium text-foreground">OTHER</span>{" "}
                can spike when an Independent or non-front candidate does
                well in a seat. Treat seats with large OTHER swings
                cautiously — the alliance-flow story may not be the main
                event.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Religion mix figures.
                </span>{" "}
                The "Observations" notes on each card use the 2011 census —
                the most recent available. Differential fertility since
                2011 means the Hindu and Christian numbers shown are
                likely a slight high-end estimate, and the Muslim number a
                slight low-end. Composition is averaged equally across the
                seats in each card (each seat contributes its district's
                mix once), not population-weighted.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Community-belt overlay.
                </span>{" "}
                The "By community belt" section uses a 9-belt qualitative
                taxonomy derived from academic literature (Zachariah
                2003; GeoCurrents 2014; KCBC diocese geography), assigned
                at district level. Hand-written editorial framings carry
                interpretation; numeric breakdowns per pattern are
                data-derived. The full belt taxonomy reference, with the
                map and click-to-highlight legend, lives on{" "}
                <Link
                  to="/belts"
                  className="underline-offset-2 hover:underline"
                >
                  /belts
                </Link>
                . Raw belt assignments are at{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/data/community-belts.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  data/community-belts.json
                </a>{" "}
                — open to challenge and PRs.
              </p>
              <p>
                The full methodology document (with caveats and validation
                cases) lives at{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/vote-flows.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  docs/vote-flows.md
                </a>
                .
              </p>
            </div>
          </details>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
