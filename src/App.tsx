import { lazy, Suspense, useEffect } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import { AnalyticsProvider } from "@/components/analytics-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DashboardPage } from "@/pages/dashboard-page"

// Secondary pages are lazy-loaded so the lean home (the most-visited
// surface) doesn't ship their code on first paint. Each page becomes
// its own chunk; vendor deps it depends on (recharts, base-ui, etc.)
// stay in shared chunks via vite.config.ts manualChunks.
const ExplorePage = lazy(() =>
  import("@/pages/explore-page").then((m) => ({ default: m.ExplorePage }))
)
const InsightsPage = lazy(() =>
  import("@/pages/insights-page").then((m) => ({ default: m.InsightsPage }))
)
const FlowsPage = lazy(() =>
  import("@/pages/flows-page").then((m) => ({ default: m.FlowsPage }))
)
const DriftsPage = lazy(() =>
  import("@/pages/drifts-page").then((m) => ({ default: m.DriftsPage }))
)
// Exploratory page — community-belt overlay against drift findings.
// Intentionally not linked from anywhere yet; reachable only via direct URL.
const BeltsPage = lazy(() =>
  import("@/pages/belts-page").then((m) => ({ default: m.BeltsPage }))
)
// Religion-gradient reference page. District-level shading per religion.
// Linked from /flows methodology + /belts; no top-level nav entry.
const ReligionMapPage = lazy(() =>
  import("@/pages/religion-map-page").then((m) => ({
    default: m.ReligionMapPage,
  }))
)

/** Minimal skeleton — keeps the page footprint stable while the chunk
 *  loads. No spinner: the chunks are small and on a warm cache the
 *  swap is imperceptible; a spinner would be more flicker than help. */
function PageFallback() {
  return <div className="min-h-svh bg-background" aria-busy="true" />
}

/** Scrolls to top of viewport whenever the route's pathname changes.
 *  Without this, in-app navigations via React Router's <Link> carry
 *  the previous page's scroll position with them — e.g. clicking the
 *  InsightsTeaser link near the bottom of /explore would land the
 *  user at the bottom of /insights too. Direct visits (fresh page
 *  loads) are unaffected. Query-string changes within the same
 *  pathname (e.g. /explore?seat=39) don't trigger a scroll, so
 *  filter interactions keep scroll position. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function App() {
  return (
    <TooltipProvider delay={200}>
      <AnalyticsProvider />
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/flows" element={<FlowsPage />} />
          <Route path="/drifts" element={<DriftsPage />} />
          <Route path="/belts" element={<BeltsPage />} />
          <Route path="/religion-map" element={<ReligionMapPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  )
}

export default App
