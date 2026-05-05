import { Link } from "react-router-dom"
import { IconArrowUpRight, IconGift } from "@tabler/icons-react"

import { curatedInsights } from "@/lib/curated-insights"

/**
 * Bottom-of-dashboard invitation to /insights. Mounted by DashboardPage only
 * when the user has engaged with the data (any non-default filter), so that
 * passive scrollers don't see it but anyone exploring does.
 */
export function InsightsTeaser() {
  const count = curatedInsights.length
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <article className="rounded-lg border bg-card/40 p-6 sm:p-8">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <IconGift className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            A treat for the curious
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Since you're already digging in, here are {count} curated
            questions about parties' 2021 → 2026 movement — each with a top-5
            table, a focused constituency map, and a one-click path back to
            the full dashboard. Free, open source, no signup.
          </p>
          <Link
            to="/insights"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium hover:bg-foreground/10"
          >
            See the curated set
            <IconArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </article>
      </div>
    </section>
  )
}
