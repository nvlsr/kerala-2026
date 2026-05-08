import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

const ARCS = [
  {
    arcNumber: 1 as const,
    title: "Anti-LDF wave",
    href: "/narratives/anti-ldf-wave",
  },
  {
    arcNumber: 2 as const,
    title: "Central Kerala",
    href: "/narratives/central-kerala",
  },
  {
    arcNumber: 3 as const,
    title: "BJP geographic pocket",
    href: "/narratives/bjp-pocket",
  },
]

type Props = {
  current: 1 | 2 | 3
  className?: string
}

/**
 * Reinforces the three-arc framework on every arc page. Renders
 * "Pattern 1 of 3" with quick-jump links to the other two arcs.
 * Sits below the page title, above the subtitle.
 */
export function NarrativeArcBreadcrumb({ current, className }: Props) {
  return (
    <nav
      aria-label="Three-arc framework"
      className={cn(
        "mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
        className
      )}
    >
      <span className="font-medium tracking-wide uppercase">
        Pattern {current} of 3
      </span>
      <span aria-hidden className="text-muted-foreground/50">
        ·
      </span>
      <Link
        to="/narratives"
        className="rounded-sm font-medium text-foreground/80 underline-offset-2 hover:text-foreground hover:underline"
      >
        Three patterns overview
      </Link>
      <span aria-hidden className="text-muted-foreground/50">
        ·
      </span>
      <span className="flex flex-wrap gap-1.5">
        {ARCS.map((a) => {
          const isCurrent = a.arcNumber === current
          return (
            <Link
              key={a.arcNumber}
              to={a.href}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
                isCurrent
                  ? "border-foreground/40 bg-muted/40 font-medium text-foreground"
                  : "border-transparent bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <span className="font-mono">{a.arcNumber}</span>
              <span>{a.title}</span>
            </Link>
          )
        })}
      </span>
    </nav>
  )
}
