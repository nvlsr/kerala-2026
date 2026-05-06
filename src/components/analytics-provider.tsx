import { useLocation } from "react-router-dom"
import { VisitorTracker } from "@jillen/analytics"

/**
 * Mount once near the app root. Forwards the current pathname from
 * react-router-dom to the framework-agnostic `VisitorTracker` so each
 * client-side navigation registers as a page view.
 *
 * Production-only: the underlying tracker no-ops when
 * `process.env.NODE_ENV !== "production"`. Vite replaces that constant
 * at build time, so dev sessions don't post any analytics.
 */
export function AnalyticsProvider() {
  const { pathname } = useLocation()
  return <VisitorTracker pathname={pathname} />
}
