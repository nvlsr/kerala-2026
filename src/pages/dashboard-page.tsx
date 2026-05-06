import { Link, useNavigate } from "react-router-dom"

import { AllianceSection } from "@/components/alliance-section"
import { HomeHeader } from "@/components/scope-title"
import { SearchBar } from "@/components/search-bar"
import { SiteFooter } from "@/components/site-footer"

/**
 * Lean home page. Search-led: the search bar is the page's hero
 * affordance, with the alliance summary as supporting headline
 * context and a small inline "browse" link for users who'd rather
 * scroll than search.
 */
export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <HomeHeader />
      <SearchBar prominent />
      <BrowseLink />
      <AllianceSection
        scope={null}
        selectedAlliance={null}
        onSelectAlliance={(alliance) => {
          if (alliance) navigate(`/explore?alliance=${alliance}`)
        }}
      />
      <SiteFooter />
    </div>
  )
}

function BrowseLink() {
  return (
    <div className="mx-auto max-w-3xl px-6 -mt-8 mb-12 text-center">
      <p className="text-xs text-muted-foreground">
        or{" "}
        <Link
          to="/explore"
          className="underline-offset-2 hover:text-foreground hover:underline"
        >
          browse all 140 seats →
        </Link>
      </p>
    </div>
  )
}
