import { Navigate, Route, Routes } from "react-router-dom"

import { TooltipProvider } from "@/components/ui/tooltip"
import { DashboardPage } from "@/pages/dashboard-page"
import { DriftsPage } from "@/pages/drifts-page"
import { FlowsPage } from "@/pages/flows-page"
import { InsightsPage } from "@/pages/insights-page"

export function App() {
  return (
    <TooltipProvider delay={200}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/flows" element={<FlowsPage />} />
        <Route path="/drifts" element={<DriftsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TooltipProvider>
  )
}

export default App
