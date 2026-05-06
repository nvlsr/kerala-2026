import { Link } from "react-router-dom"
import { IconArrowUpRight, IconHistory } from "@tabler/icons-react"

/**
 * Bottom-of-/flows invitation to /drifts. The reader has scrolled
 * through this election's shifts; reward that with the longer view —
 * sustained drifts across four cycles. Different time horizon, different
 * question.
 *
 * Mirrors InsightsTeaser (homepage→/insights) and FlowsTeaser
 * (/insights→/flows) but escalates the metaphor again: amber + history
 * icon for the time-tinted "zoom out" feel.
 */
export function DriftsTeaser() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <article className="rounded-lg border bg-card/40 p-6 sm:p-8">
          <h3 className="font-heading flex items-center gap-3 text-xl font-semibold tracking-tight sm:text-2xl">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <IconHistory className="h-5 w-5" aria-hidden />
            </span>
            Now zoom out — the 15-year view
          </h3>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            What you just saw was this election's shifts — votes flowing one
            way in 2026 vs 2021. There's a slower story underneath: 42 seats
            where the same alliance has been gaining (or losing) for four
            cycles running. Different time horizon, different question —
            patterns that survived the candidates and the campaigns. If you
            came this far, you'll want to see them.{" "}
            <Link
              to="/drifts"
              className="group font-medium text-foreground underline-offset-2 hover:underline"
            >
              <span className="inline-flex items-center gap-0.5">
                See the sustained drifts
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
