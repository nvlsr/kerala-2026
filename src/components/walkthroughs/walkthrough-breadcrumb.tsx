import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

const WALKTHROUGHS = [
  { code: "LDF" as const, href: "/walkthroughs/ldf-walkthrough" },
  { code: "UDF" as const, href: "/walkthroughs/udf-walkthrough" },
  { code: "NDA" as const, href: "/walkthroughs/nda-walkthrough" },
]

export type WalkthroughCode = (typeof WALKTHROUGHS)[number]["code"]

type Props = {
  current: WalkthroughCode
  className?: string
}

/**
 * Three-walkthrough nav strip on every alliance page. Renders a row
 * of `Walkthroughs · LDF | UDF | NDA` chips with the current alliance
 * highlighted. Sits below the page title, above the subtitle.
 */
export function WalkthroughBreadcrumb({ current, className }: Props) {
  return (
    <nav
      aria-label="Walkthroughs"
      className={cn(
        "mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
        className
      )}
    >
      <Link
        to="/walkthroughs"
        className="rounded-sm font-medium text-foreground/80 underline-offset-2 hover:text-foreground hover:underline"
      >
        Walkthroughs
      </Link>
      <span aria-hidden className="text-muted-foreground/50">
        ·
      </span>
      <span className="flex flex-wrap gap-1.5">
        {WALKTHROUGHS.map((w) => {
          const isCurrent = w.code === current
          return (
            <Link
              key={w.code}
              to={w.href}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "inline-flex items-center rounded-sm border px-2 py-0.5",
                isCurrent
                  ? "border-foreground/40 bg-muted/40 font-medium text-foreground"
                  : "border-transparent bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              {w.code}
            </Link>
          )
        })}
      </span>
    </nav>
  )
}
