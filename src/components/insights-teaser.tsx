import { Link } from "react-router-dom"
import { IconArrowUpRight, IconGift } from "@tabler/icons-react"

/**
 * Bottom-of-dashboard invitation to /insights. Mounted by DashboardPage only
 * when the user has engaged with the data (any non-default filter), so that
 * passive scrollers don't see it but anyone exploring does.
 */
export function InsightsTeaser() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <article className="rounded-lg border bg-card/40 p-6 sm:p-8">
          <h3 className="font-heading flex items-center gap-3 text-xl font-semibold tracking-tight sm:text-2xl">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <IconGift className="h-5 w-5" aria-hidden />
            </span>
            A treat for the curious
          </h3>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Since you're already digging in, you might enjoy the curated
            questions we've put together — each with a top-5 table, a focused
            constituency map, and a one-click path back to the full dashboard.
            Free, open source, no signup.
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
