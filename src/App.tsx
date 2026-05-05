import { Navigate, Route, Routes } from "react-router-dom"

import { TooltipProvider } from "@/components/ui/tooltip"
import { DashboardPage } from "@/pages/dashboard-page"
import { InsightsPage } from "@/pages/insights-page"

export function App() {
  return (
    <TooltipProvider delay={200}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TooltipProvider>
  )
}

export default App
