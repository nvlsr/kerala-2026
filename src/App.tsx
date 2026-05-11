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
const QuestionsPage = lazy(() =>
  import("@/pages/questions-page").then((m) => ({ default: m.QuestionsPage }))
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

// Entry point for readers arriving from the kerala-vote-forecast project
// (kerala.jillen.com). Bridges the pre-election forecast post-mortem and
// the post-election analysis. Not linked from main nav — reachable only
// via deep link from the forecast site.
const FromForecastPage = lazy(() =>
  import("@/pages/from-forecast-page").then((m) => ({
    default: m.FromForecastPage,
  }))
)

// Walkthroughs — public-facing analytical surface with three alliance
// pages. Top page summarises; alliance pages carry choropleths +
// supporting charts.
const WalkthroughsPage = lazy(() =>
  import("@/pages/walkthroughs/index-page").then((m) => ({
    default: m.WalkthroughsPage,
  }))
)
const WalkthroughsLDFPage = lazy(() =>
  import("@/pages/walkthroughs/ldf-page").then((m) => ({
    default: m.WalkthroughsLDFPage,
  }))
)
const WalkthroughsUDFPage = lazy(() =>
  import("@/pages/walkthroughs/udf-page").then((m) => ({
    default: m.WalkthroughsUDFPage,
  }))
)
const WalkthroughsNDAPage = lazy(() =>
  import("@/pages/walkthroughs/nda-page").then((m) => ({
    default: m.WalkthroughsNDAPage,
  }))
)
const WalkthroughsChristianPage = lazy(() =>
  import("@/pages/walkthroughs/christian-page").then((m) => ({
    default: m.WalkthroughsChristianPage,
  }))
)
const WalkthroughsMethodologyPage = lazy(() =>
  import("@/pages/walkthroughs/methodology-page").then((m) => ({
    default: m.WalkthroughsMethodologyPage,
  }))
)
const WalkthroughsInsightsPage = lazy(() =>
  import("@/pages/walkthroughs/insights-page").then((m) => ({
    default: m.WalkthroughsInsightsPage,
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
 *  QuestionsTeaser link near the bottom of /explore would land the
 *  user at the bottom of /questions too. Direct visits (fresh page
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
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/flows" element={<FlowsPage />} />
          <Route path="/drifts" element={<DriftsPage />} />
          <Route path="/belts" element={<BeltsPage />} />
          <Route path="/religion-map" element={<ReligionMapPage />} />
          <Route path="/from-forecast" element={<FromForecastPage />} />
          <Route path="/walkthroughs" element={<WalkthroughsPage />} />
          <Route
            path="/walkthroughs/ldf-walkthrough"
            element={<WalkthroughsLDFPage />}
          />
          <Route
            path="/walkthroughs/udf-walkthrough"
            element={<WalkthroughsUDFPage />}
          />
          <Route
            path="/walkthroughs/nda-walkthrough"
            element={<WalkthroughsNDAPage />}
          />
          <Route
            path="/walkthroughs/christian-walkthrough"
            element={<WalkthroughsChristianPage />}
          />
          <Route
            path="/walkthroughs/methodology"
            element={<WalkthroughsMethodologyPage />}
          />
          <Route
            path="/walkthroughs/insights"
            element={<WalkthroughsInsightsPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  )
}

export default App
