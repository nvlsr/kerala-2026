import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { IconAlertTriangle } from "@tabler/icons-react"

import {
  MultiCycleDriftSection,
  SingleCyclePatternSection,
} from "@/components/flow-pattern-section"
import { SiteFooter } from "@/components/site-footer"
import { StateFlowSankey } from "@/components/state-flow-sankey"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  getMultiCycleDrifts,
  getSingleCycleFlows,
  multiCyclePatternKey,
  multiCyclePatternLabel,
  singleCyclePatternKey,
  singleCyclePatternLabel,
  type MultiCycleDrift,
  type SeatFlow,
} from "@/lib/data/flows"

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

export function FlowsPage() {
  const single = useMemo(() => getSingleCycleFlows(), [])
  const drifts = useMemo(() => getMultiCycleDrifts(), [])

  const singleGroups = useMemo(
    () =>
      groupBy<SeatFlow, string>(
        single,
        (f) => singleCyclePatternKey(f.flow),
        (f) => singleCyclePatternLabel(f.flow)
      ),
    [single]
  )

  const driftGroups = useMemo(
    () =>
      groupBy<MultiCycleDrift, string>(
        drifts,
        (d) => multiCyclePatternKey(d),
        (d) => multiCyclePatternLabel(d)
      ),
    [drifts]
  )

  // Browsers compute :target before React mounts the cards on initial load,
  // so the native scroll lands nowhere. Re-set the hash after the first paint
  // to trigger :target and produce the correct scroll. Same trick the
  // /insights page uses.
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
              · Vote flows
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Where votes shifted
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Seats grouped by alliance-level vote share movement. The
              dashboard's tables show how a single party did; this page shows
              how the three fronts moved against each other — the cross-current
              the cards format can't capture.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <IconAlertTriangle
            aria-hidden
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500"
          />
          <p className="text-foreground/85">
            <span className="font-medium">These flows are inferred, not
              observed.</span>{" "}
            We classify a seat by the net change in alliance vote share between
            elections. The data can't tell us whether a flow labelled "LDF →
            NDA" actually means LDF voters chose NDA, or whether old LDF voters
            stayed home while new NDA voters showed up. Both produce the same
            net deltas. Read the pattern as "alliance X gained at alliance Y's
            expense", not as "voters moved from Y to X".
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="mb-12">
          <StateFlowSankey />
        </section>

        <section>
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              Single-cycle shifts (2021 → 2026)
            </h2>
            <span className="text-xs tracking-wide text-muted-foreground uppercase">
              {single.length} of 140 seats
            </span>
          </div>
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Seats where one alliance gained at least 5pp at another's expense
            in this election alone. The third alliance is roughly stable, or
            (for the "both → one" patterns) lost alongside the first.
          </p>
          <ul className="flex flex-col gap-6">
            {singleGroups.map((g) => (
              <li key={g.key}>
                <SingleCyclePatternSection
                  patternLabel={g.label}
                  patternId={`single-${g.key}`}
                  flows={g.items}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              Sustained 15-year drifts (2011 → 2026)
            </h2>
            <span className="text-xs tracking-wide text-muted-foreground uppercase">
              {drifts.length} of 140 seats
            </span>
          </div>
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Seats where the cumulative shift across four cycles is at least
            10pp, AND the gainer's gains were sustained across at least two
            of the three transitions — filtering out single-cycle anomalies.
            These are the long-term drifts, not one-off swings.
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
          <details className="rounded-lg border bg-card/40 p-6 text-sm">
            <summary className="cursor-pointer font-medium">
              Methodology &amp; thresholds
            </summary>
            <div className="mt-3 space-y-3 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  Single-cycle thresholds.
                </span>{" "}
                Two-way: biggest gainer ≥ +5pp, biggest loser ≤ −5pp, third
                alliance moved less than ±2pp. Both-to-one: gainer ≥ +5pp, both
                others lost ≥ 2pp each, combined drop within 3pp of the gain.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Multi-cycle thresholds.
                </span>{" "}
                Cumulative gainer ≥ +10pp, loser ≤ −10pp across 2011→2026, and
                at least 2 of the 3 cycle transitions for the gainer agree
                with the cumulative direction.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Party→alliance is fixed at the 2026 mapping.
                </span>{" "}
                Major parties have been alliance-stable, so this is fine for
                the dominant fronts. Minor parties that switched alliances may
                be mis-attributed in earlier cycles.
              </p>
              <p>
                <span className="font-medium text-foreground">OTHER</span> can
                spike when an Independent or non-front candidate does well in
                a seat (e.g. Ottappalam). Treat seats with large OTHER swings
                cautiously — the alliance-flow story may not be the main
                event.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Religion mix figures.
                </span>{" "}
                The "Observations" notes on multi-cycle drift cards use the
                2011 census — the most recent available. Differential
                fertility since 2011 means the Hindu and Christian numbers
                shown are likely a slight high-end estimate, and the Muslim
                number a slight low-end. Composition is averaged equally
                across the seats in each card (each seat contributes its
                district's mix once), not population-weighted.
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
