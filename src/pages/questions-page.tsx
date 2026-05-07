import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { FlowsTeaser } from "@/components/flows-teaser"
import { QuestionCard } from "@/components/question-card"
import {
  QuestionsFilterBar,
  type PartyFilter,
  type ThemeFilter,
} from "@/components/questions-filter-bar"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  allianceForQuestionParty,
  curatedQuestions,
  getAvailableParties,
  getAvailableThemes,
} from "@/lib/curated-questions"

export function QuestionsPage() {
  const [partyFilter, setPartyFilter] = useState<PartyFilter>("all")
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>("all")

  /**
   * Browsers evaluate :target before React mounts the cards on initial load,
   * so the target pseudo-class never matches and the native scroll lands
   * nowhere. After React renders, force a hash re-set: this both triggers
   * the browser to re-evaluate :target (which our highlight CSS relies on)
   * and produces the scroll. requestAnimationFrame waits one paint so the
   * articles are in the DOM before we try to find ours by id.
   */
  useEffect(() => {
    if (!window.location.hash) return
    const hash = window.location.hash
    const handle = requestAnimationFrame(() => {
      // Clearing then re-applying the hash forces :target re-eval. Setting
      // window.location.hash directly is the only reliable way — pushState
      // and replaceState don't update :target.
      window.location.hash = ""
      window.location.hash = hash.slice(1)
    })
    return () => cancelAnimationFrame(handle)
  }, [])

  const visibleQuestions = useMemo(() => {
    return curatedQuestions.filter((q) => {
      if (partyFilter !== "all") {
        const partyMatch = q.tags.party === partyFilter
        const allianceMatch =
          q.tags.alliance === allianceForQuestionParty(partyFilter)
        if (!partyMatch && !allianceMatch) return false
      }
      if (themeFilter !== "all" && q.tags.theme !== themeFilter) {
        return false
      }
      return true
    })
  }, [partyFilter, themeFilter])

  const parties = getAvailableParties()
  const themes = getAvailableThemes()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header>
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-6">
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-foreground">
                Kerala 2026
              </Link>{" "}
              · Questions
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Curated questions
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <QuestionsFilterBar
        parties={parties}
        themes={themes}
        partyFilter={partyFilter}
        themeFilter={themeFilter}
        onPartyChange={setPartyFilter}
        onThemeChange={setThemeFilter}
        shownCount={visibleQuestions.length}
        totalCount={curatedQuestions.length}
      />
      <main className="mx-auto max-w-6xl px-6 py-6 pb-10">
        {visibleQuestions.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
            No questions match this combination.{" "}
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
            {visibleQuestions.map((q) => (
              <li key={q.id}>
                <QuestionCard question={q} />
              </li>
            ))}
          </ul>
        )}
      </main>
      <FlowsTeaser />
      <SiteFooter />
    </div>
  )
}
