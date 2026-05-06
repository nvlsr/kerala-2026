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
          <h3 className="flex items-center gap-3 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <IconGift className="h-5 w-5" aria-hidden />
            </span>
            A treat for the curious
          </h3>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Most readers stop at the headline numbers; you didn't. As a small
            treat for you, I've curated a few questions I've been working
            through.
            <em>
              Which seats did a particular party grow thier vote share the
              most/least?
            </em>{" "}
            <br />
            Free, open source, no signup.{" "}
            <Link
              to="/insights"
              className="group font-medium text-foreground underline-offset-2 hover:underline"
            >
              <span className="inline-flex items-center gap-0.5">
                See the curated set
                <IconArrowUpRight
                  aria-hidden
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          </p>
        </article>
      </div>
    </section>
  )
}
