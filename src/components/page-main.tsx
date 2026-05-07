import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  /**
   * Override or extend the default classes. Default is
   * `mx-auto max-w-6xl px-6 py-8` — applies the project's standard
   * width cap and padding. Pages that want section spacing should add
   * `space-y-12`; pages with sticky filter bars above adjust padding
   * (e.g. `py-6 pb-10` on /questions).
   */
  className?: string
}

/**
 * Standard `<main>` wrapper for routed pages. Lives next to PageShell
 * but stays a separate component because not every page wants a
 * `<main>` — /explore renders a series of <Section> components
 * directly without one, and pages with a teaser footer (DriftsTeaser,
 * FlowsTeaser) need PageMain to close before the teaser.
 */
export function PageMain({ children, className }: Props) {
  return (
    <main className={cn("mx-auto max-w-6xl px-6 py-8", className)}>
      {children}
    </main>
  )
}
