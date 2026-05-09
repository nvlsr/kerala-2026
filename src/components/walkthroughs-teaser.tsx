import { Link } from "react-router-dom"
import { IconKey } from "@tabler/icons-react"

/**
 * Bottom-of-/questions link to /walkthroughs. Replaces the previous
 * FlowsTeaser. Same minimal one-line treatment: visible to readers
 * who finished the curated questions, easy to ignore otherwise. The
 * IconKey is preserved as a quiet "next layer" affordance.
 */
export function WalkthroughsTeaser() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center">
        <Link
          to="/walkthroughs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconKey className="h-4 w-4" aria-hidden />
          The three patterns behind Kerala 2026 →
        </Link>
      </div>
    </section>
  )
}
