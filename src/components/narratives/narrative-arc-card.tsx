import { Link } from "react-router-dom"
import { IconArrowRight } from "@tabler/icons-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  arcNumber: 1 | 2 | 3
  /** Short title — fits on one line at md+. */
  title: string
  /** One-clause headline statistic — bold, foregrounded. */
  headlineStat: ReactNode
  /** ~80-word summary. Plain text or short JSX. */
  summary: ReactNode
  /** Visual rendered above the summary text. Typically a small map. */
  visual: ReactNode
  /** Confidence label — "Strong", "Moderate-strong", "Strong (descriptive)". */
  confidence: string
  /** Internal route to the arc page. */
  href: string
}

/**
 * One of the three arc-summary cards on the /narratives top page.
 * Stacked vertically on mobile; 3-up grid on lg+. Each card is a
 * compact pitch for the arc — title + key stat + visual + 80-word
 * summary + read-more link.
 */
export function NarrativeArcCard({
  arcNumber,
  title,
  headlineStat,
  summary,
  visual,
  confidence,
  href,
}: Props) {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-card/50 p-6",
        "transition-colors hover:border-foreground/40"
      )}
    >
      <header>
        <p className="text-xs font-medium tracking-wider text-muted-foreground/80 uppercase">
          Arc {arcNumber} · {confidence}
        </p>
        <h2 className="font-heading mt-1 text-lg font-semibold leading-tight tracking-tight sm:text-xl">
          {title}
        </h2>
      </header>
      <div className="flex items-center justify-center rounded-md border bg-muted/30 p-3">
        {visual}
      </div>
      <p className="text-sm font-medium text-foreground/90">{headlineStat}</p>
      <div className="text-sm leading-relaxed text-muted-foreground">
        {summary}
      </div>
      <Link
        to={href}
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
      >
        Read more
        <IconArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </article>
  )
}
