import { Link } from "react-router-dom"

/**
 * Quiet bottom-of-dashboard nudge to /insights. A single small line,
 * not a full CTA card — visible to readers who scroll all the way
 * down, easy to ignore for everyone else. Replaces the prior "A
 * treat for the curious" gift card which competed with actual
 * content for attention.
 */
export function InsightsTeaser() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center">
        <Link
          to="/insights"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          A few curated questions for the curious →
        </Link>
      </div>
    </section>
  )
}
