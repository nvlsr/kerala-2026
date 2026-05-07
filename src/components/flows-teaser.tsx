import { Link } from "react-router-dom"
import { IconKey } from "@tabler/icons-react"

/**
 * Quiet bottom-of-/questions nudge to /flows. A single small line —
 * visible to readers who've worked through the curated questions,
 * easy to ignore for everyone else. Replaces the prior "One layer
 * deeper, unlocked" CTA card. The IconKey is preserved (small,
 * inline) to keep a hint of the "unlocked next layer" framing
 * without the visual weight.
 */
export function FlowsTeaser() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center">
        <Link
          to="/flows"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconKey className="h-4 w-4" aria-hidden />
          Which alliance gained at which other's expense? →
        </Link>
      </div>
    </section>
  )
}
