import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  /** Short heading. Default "Bottom line". */
  heading?: string
  children: ReactNode
  className?: string
}

/**
 * End-of-arc bottom-line summary box. Different in style and
 * purpose from the verdict block at the top: the verdict states
 * what the arc claims; this restates the takeaway after the
 * reader has processed the evidence.
 */
export function TakeawayBox({
  heading = "Bottom line",
  children,
  className,
}: Props) {
  return (
    <aside
      className={cn(
        "max-w-prose rounded-sm border-2 border-foreground/30 bg-foreground/5 p-6",
        className
      )}
    >
      <h2 className="font-heading text-xs font-semibold tracking-widest uppercase text-foreground/70">
        {heading}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-foreground sm:text-[15px]">
        {children}
      </div>
    </aside>
  )
}
