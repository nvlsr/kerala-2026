import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { AnalyticsProvider } from "@/components/analytics-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DashboardPage } from "@/pages/dashboard-page"

// Secondary pages are lazy-loaded so the dashboard (the most-visited
// surface) doesn't ship their code on first paint. Each page becomes
// its own chunk; vendor deps it depends on (recharts, base-ui, etc.)
// stay in shared chunks via vite.config.ts manualChunks.
const InsightsPage = lazy(() =>
  import("@/pages/insights-page").then((m) => ({ default: m.InsightsPage }))
)
const FlowsPage = lazy(() =>
  import("@/pages/flows-page").then((m) => ({ default: m.FlowsPage }))
)
const DriftsPage = lazy(() =>
  import("@/pages/drifts-page").then((m) => ({ default: m.DriftsPage }))
)

/** Minimal skeleton — keeps the page footprint stable while the chunk
 *  loads. No spinner: the chunks are small and on a warm cache the
 *  swap is imperceptible; a spinner would be more flicker than help. */
function PageFallback() {
  return <div className="min-h-svh bg-background" aria-busy="true" />
}

export function App() {
  return (
    <TooltipProvider delay={200}>
      <AnalyticsProvider />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/flows" element={<FlowsPage />} />
          <Route path="/drifts" element={<DriftsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  )
}

export default App
