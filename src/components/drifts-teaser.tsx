import { Link } from "react-router-dom"
import { IconHistory } from "@tabler/icons-react"

/**
 * Quiet bottom-of-/flows nudge to /drifts. A single small line —
 * visible to readers who've worked through the alliance flows, easy
 * to ignore for everyone else. Replaces the prior "boss level,
 * unlocked" CTA card. The IconHistory is preserved (small, inline)
 * to keep a hint of the "zoom out to multi-cycle drifts" framing
 * without the visual weight.
 */
export function DriftsTeaser() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center">
        <Link
          to="/drifts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconHistory className="h-4 w-4" aria-hidden />
          Which seats have drifted the same way for four cycles? →
        </Link>
      </div>
    </section>
  )
}
