import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  className?: string
}

/**
 * "Going in" callout — a small bordered aside that places
 * pre-poll positioning (stated strategy, alliance moves,
 * positioning announcements) next to the section it grounds.
 *
 * Distinct from PullQuote (which extracts a punch line from the
 * body) and TakeawayBox (which restates a conclusion). Going-in
 * callouts come from *outside* the body — sourced quotes and
 * dated leader statements that the data section then evaluates
 * against.
 *
 * Footnote-style numeric citations (e.g. ¹, ², ³) are referenced
 * via the FootnoteRef component and resolved in the page-level
 * Footnotes block.
 */
export function GoingInCallout({ children, className }: Props) {
  return (
    <aside
      className={cn(
        "my-6 max-w-prose rounded-sm border border-foreground/30 bg-muted/30 px-5 py-4",
        className
      )}
    >
      <p className="font-heading text-[10px] font-semibold tracking-widest text-foreground/70 uppercase">
        Going in
      </p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-foreground sm:text-[15px]">
        {children}
      </div>
    </aside>
  )
}
