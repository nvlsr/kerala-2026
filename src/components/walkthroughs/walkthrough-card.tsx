import { Link } from "react-router-dom"
import { IconArrowRight } from "@tabler/icons-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  /** Short title — fits on one line at md+. */
  title: string
  /** One-clause headline statistic — bold, foregrounded. */
  headlineStat: ReactNode
  /** ~80-word summary. Plain text or short JSX. */
  summary: ReactNode
  /** Visual rendered above the summary text. Typically a small map. */
  visual: ReactNode
  /** Confidence label — uses the same vocabulary as the page-level
   *  ThesisLede ("Strong" or "Tentative"). */
  confidence: "Strong" | "Tentative"
  /** Internal route to the walkthrough page. */
  href: string
}

/**
 * One of the three arc-summary cards on the /walkthroughs top page.
 * Stacked vertically on mobile; 3-up grid on lg+. Each card is a
 * compact pitch for the arc — title + key stat + visual + 80-word
 * summary + read-more link.
 */
export function WalkthroughCard({
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
        "flex flex-col gap-4 rounded-sm border bg-card/50 p-6",
        "transition-colors hover:border-foreground/40"
      )}
    >
      <header>
        <p className="text-xs font-medium tracking-wider text-muted-foreground/80 uppercase">
          {confidence}
        </p>
        <h2 className="mt-1 font-heading text-lg leading-tight font-semibold tracking-tight sm:text-xl">
          {title}
        </h2>
      </header>
      <div className="flex items-center justify-center rounded-sm border bg-muted/30 p-3">
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
