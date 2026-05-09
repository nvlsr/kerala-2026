import type { ReactNode } from "react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

/**
 * Subtle underline-by-default styling for body-prose internal
 * links. Keeps clickable affordance visible without making the
 * paragraph look like a sea of stripes.
 *
 * Decoration: 1px line in muted color; thickens + matches text on
 * hover. Use this class — not the bolder header/CTA link styles —
 * for in-paragraph links to /explore, /questions, /walkthroughs, etc.
 */
export const PROSE_LINK_CLASS =
  "underline decoration-foreground/30 decoration-[1.5px] underline-offset-2 hover:decoration-foreground hover:text-foreground"

type Props = {
  to: string
  children: ReactNode
  className?: string
}

/** Sugar wrapper around <Link> with PROSE_LINK_CLASS applied. */
export function ProseLink({ to, children, className }: Props) {
  return (
    <Link to={to} className={cn(PROSE_LINK_CLASS, className)}>
      {children}
    </Link>
  )
}

const SEAT_LINK_CLASS = "font-medium text-foreground"

/**
 * Inline link for a constituency name. Goes to
 * /explore?seat=<acNumber>. Uses the prose-link underline style so
 * readers can see clickable seat names without hovering. The label
 * itself is shown in slightly stronger weight than surrounding
 * prose so a series of named seats still reads as discrete entities
 * (e.g. when listing 11 BJP gainers).
 */
export function SeatLink({
  ac,
  children,
  className,
}: {
  ac: number
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      to={`/explore?seat=${ac}`}
      className={cn(PROSE_LINK_CLASS, SEAT_LINK_CLASS, className)}
    >
      {children}
    </Link>
  )
}

/** Inline link for a party page. Goes to /explore?party=<canonical>. */
export function PartyLink({
  party,
  children,
  className,
}: {
  party: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      to={`/explore?party=${encodeURIComponent(party)}`}
      className={cn(PROSE_LINK_CLASS, className)}
    >
      {children}
    </Link>
  )
}
