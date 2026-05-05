import { Link } from "react-router-dom"

import { InsightCard } from "@/components/insight-card"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { curatedInsights } from "@/lib/curated-insights"

export function InsightsPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header>
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-6">
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-foreground">
                Kerala 2026
              </Link>{" "}
              · Insights
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Curated questions
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              A growing list of questions worth asking the 2026 results, each
              with its own top-5 table and constituency-map snippet. Open any
              card in the full dashboard to refine, drill in, and share.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 pb-10">
        <ul className="flex flex-col gap-6">
          {curatedInsights.map((insight) => (
            <li key={insight.id}>
              <InsightCard insight={insight} />
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  )
}
