import { Link } from "react-router-dom"
import { IconArrowUpRight, IconKey } from "@tabler/icons-react"

/**
 * Bottom-of-/insights invitation to /flows. The reader has scrolled
 * through curated questions; reward that depth with the next layer down —
 * alliance-level vote share moving between fronts across cycles, the
 * cross-currents the per-question cards can't capture.
 *
 * Mirrors `InsightsTeaser` (homepage → /insights) in tone and structure
 * but with an "unlocked" framing instead of "treat" — the reader has
 * earned this layer by demonstrating analytic interest.
 */
export function FlowsTeaser() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <article className="rounded-lg border bg-card/40 p-6 sm:p-8">
          <h3 className="font-heading flex items-center gap-3 text-xl font-semibold tracking-tight sm:text-2xl">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <IconKey className="h-5 w-5" aria-hidden />
            </span>
            One layer deeper, unlocked
          </h3>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Made it to the end of the curated set? Then the analyst's view is
            yours. The cards above ask <em>who did best where</em>. There's a
            harder question lurking under that — <em>which alliance gained at
            which other's expense</em>, and where the pattern has sustained
            across cycles. /flows is the page I built to answer that:
            state-level Sankey of every 2021 seat → 2026 winner up top, then
            the seats grouped by movement pattern, with multi-cycle drifts
            called out separately. If you came this far, you'll enjoy it.{" "}
            <Link
              to="/flows"
              className="group font-medium text-foreground underline-offset-2 hover:underline"
            >
              <span className="inline-flex items-center gap-0.5">
                See where the vote shifted
                <IconArrowUpRight
                  aria-hidden
                  className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </p>
        </article>
      </div>
    </section>
  )
}
