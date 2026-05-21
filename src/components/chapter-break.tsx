import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

type ChapterBreakProps = {
  to: string
  headline: ReactNode
  subline?: ReactNode
  eyebrow?: string
}

/**
 * Page-section transition used at the bottom of /explore, /questions,
 * /flows — "you got this far, here's the deeper layer." Each element
 * fades + slides in (staggered) the first time the section scrolls into
 * view, so skimmers never trigger anything. Respects
 * prefers-reduced-motion by showing immediately without animation.
 */
export function ChapterBreak({
  to,
  headline,
  subline,
  eyebrow = "Next",
}: ChapterBreakProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  )

  useEffect(() => {
    if (visible) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  return (
    <section ref={ref} className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-14 text-center sm:py-16">
        <Link to={to} className="group inline-block">
          <p
            className={cn(
              "text-xs font-medium tracking-wider text-muted-foreground uppercase transition-all duration-500 ease-out",
              visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
          >
            {eyebrow}
          </p>
          <h2
            className={cn(
              "mt-3 text-2xl font-semibold text-foreground transition-all delay-100 duration-700 ease-out group-hover:underline group-hover:underline-offset-4 sm:text-3xl",
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            {headline}{" "}
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </h2>
          {subline ? (
            <p
              className={cn(
                "mt-3 text-sm text-muted-foreground transition-all delay-200 duration-700 ease-out",
                visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              )}
            >
              {subline}
            </p>
          ) : null}
        </Link>
      </div>
    </section>
  )
}
