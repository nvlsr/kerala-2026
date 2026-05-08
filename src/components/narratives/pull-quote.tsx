import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  /** Optional small attribution / caption beneath the quote. */
  attribution?: ReactNode
  className?: string
}

/**
 * Pull quote — extracts the punch line of a section as a visual
 * anchor. Use selectively (1-2 per arc page); over-use dilutes the
 * effect.
 */
export function PullQuote({ children, attribution, className }: Props) {
  return (
    <aside
      className={cn(
        "my-6 rounded-lg border-l-2 border-foreground/40 bg-muted/20 px-6 py-4",
        className
      )}
    >
      <blockquote className="font-heading text-base leading-snug font-medium tracking-tight text-foreground sm:text-lg">
        {children}
      </blockquote>
      {attribution && (
        <p className="mt-2 text-xs text-muted-foreground">{attribution}</p>
      )}
    </aside>
  )
}
