import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export type RailItem = { id: string; label: string }
export type RailGroup = { label: string; items: ReadonlyArray<RailItem> }

/**
 * Tracks which section anchor is currently in the viewport so the
 * rail can highlight it. Uses IntersectionObserver with a top-biased
 * rootMargin so the "active" anchor matches what the reader is
 * actually reading, not what's marginally peeking from the bottom.
 */
function useActiveSection(ids: ReadonlyArray<string>): string | null {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (typeof window === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top
          )
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

/**
 * Sticky right-rail navigation for walkthrough pages. Renders a
 * grouped list of section anchors; the active section is highlighted
 * with a left-border accent as the reader scrolls.
 *
 * Hidden on mobile (`hidden lg:block`) — the page chrome carries
 * cross-walkthrough navigation, and within-page jumps are less
 * critical on small viewports.
 *
 * Usage:
 *
 *   const RAIL_GROUPS = [
 *     { label: "Section group", items: [{ id: "anchor", label: "Section name" }] },
 *   ]
 *
 *   <PageRail groups={RAIL_GROUPS} />
 *
 * Each anchor `id` should match a corresponding `<section id="...">`
 * elsewhere on the page.
 */
export function PageRail({ groups }: { groups: ReadonlyArray<RailGroup> }) {
  const allIds = groups.flatMap((g) => g.items.map((i) => i.id))
  const active = useActiveSection(allIds)
  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="On this page"
        className="sticky top-6 space-y-4 text-[13px]"
      >
        <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          On this page
        </p>
        {groups.map((g) => (
          <div key={g.label} className="space-y-1.5">
            <p className="text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase">
              {g.label}
            </p>
            <ul className="space-y-0.5 border-l border-border">
              {g.items.map((item) => {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "-ml-px block border-l-2 py-1 pl-3 leading-snug transition-colors",
                        isActive
                          ? "border-foreground font-medium text-foreground"
                          : "border-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
