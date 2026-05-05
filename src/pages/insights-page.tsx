import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { InsightCard } from "@/components/insight-card"
import {
  InsightsFilterBar,
  type PartyFilter,
  type ThemeFilter,
} from "@/components/insights-filter-bar"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  allianceForInsightParty,
  curatedInsights,
  getAvailableParties,
  getAvailableThemes,
} from "@/lib/curated-insights"

export function InsightsPage() {
  const [partyFilter, setPartyFilter] = useState<PartyFilter>("all")
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>("all")

  const visibleInsights = useMemo(() => {
    return curatedInsights.filter((insight) => {
      if (partyFilter !== "all") {
        const partyMatch = insight.tags.party === partyFilter
        const allianceMatch =
          insight.tags.alliance === allianceForInsightParty(partyFilter)
        if (!partyMatch && !allianceMatch) return false
      }
      if (themeFilter !== "all" && insight.tags.theme !== themeFilter) {
        return false
      }
      return true
    })
  }, [partyFilter, themeFilter])

  const parties = getAvailableParties()
  const themes = getAvailableThemes()

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
      <InsightsFilterBar
        parties={parties}
        themes={themes}
        partyFilter={partyFilter}
        themeFilter={themeFilter}
        onPartyChange={setPartyFilter}
        onThemeChange={setThemeFilter}
        shownCount={visibleInsights.length}
        totalCount={curatedInsights.length}
      />
      <main className="mx-auto max-w-6xl px-6 py-6 pb-10">
        {visibleInsights.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
            No insights match this combination.{" "}
            <button
              type="button"
              onClick={() => {
                setPartyFilter("all")
                setThemeFilter("all")
              }}
              className="text-foreground underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-6">
            {visibleInsights.map((insight) => (
              <li key={insight.id}>
                <InsightCard insight={insight} />
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
