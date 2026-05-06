import { Link, useNavigate } from "react-router-dom"
import { IconArrowRight } from "@tabler/icons-react"

import { AllianceSection } from "@/components/alliance-section"
import { HomeHeader } from "@/components/scope-title"
import { SearchBar } from "@/components/search-bar"
import { SiteFooter } from "@/components/site-footer"

/**
 * Lean home page: headline summary + search + explore CTA + footer.
 * Detail browsing lives on `/explore`.
 */
export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <HomeHeader />
      <AllianceSection
        scope={null}
        selectedAlliance={null}
        onSelectAlliance={(alliance) => {
          if (alliance) navigate(`/explore?alliance=${alliance}`)
        }}
      />
      <SearchBar />
      <ExploreCTA />
      <SiteFooter />
    </div>
  )
}

function ExploreCTA() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link
          to="/explore"
          className="group flex items-center justify-between gap-4 rounded-lg border bg-card/40 p-5 transition-colors hover:bg-foreground/[0.03] sm:p-6"
        >
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">
              Browse all 140 seats
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The full constituency-level explorer — filter by district,
              alliance, or party; sort the candidate table; click any
              seat for its detail panel and historical chart.
            </p>
          </div>
          <IconArrowRight
            className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  )
}
