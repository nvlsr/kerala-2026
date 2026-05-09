import { getReservation } from "@/lib/data"
import { cn } from "@/lib/utils"

type Props = {
  /** AC number. Renders nothing for unreserved seats. */
  seat: number
  /** Visual size. Default "sm" (inline with body text). */
  size?: "sm" | "md"
  /** Override the default styling — caller can pass extra class names. */
  className?: string
}

/**
 * Compact "SC" / "ST" badge shown next to a constituency name to flag
 * its reservation status. Renders nothing if the seat isn't reserved,
 * so callers can drop this in unconditionally next to any seat name.
 *
 * Reservations are stable across the 2011/2016/2021/2026 elections
 * (set by the 2008 Delimitation Order). See data/reservations.json
 * and src/lib/data/constituencies.ts:getReservation.
 */
export function ReservationBadge({ seat, size = "sm", className }: Props) {
  const reservation = getReservation(seat)
  if (!reservation) return null

  // Tooltip explains what the badge means without forcing a click
  const title =
    reservation === "SC"
      ? "Reserved for Scheduled Caste candidates (only SC candidates contest)"
      : "Reserved for Scheduled Tribe candidates (only ST candidates contest)"

  return (
    <span
      title={title}
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm border font-medium tracking-wide uppercase tabular-nums",
        size === "sm"
          ? "px-1 py-0 text-[0.625rem] leading-tight"
          : "px-1.5 py-0.5 text-xs",
        // Subtle muted styling — the badge is informational, not decorative
        "border-muted-foreground/40 bg-muted/40 text-muted-foreground",
        className
      )}
      aria-label={`${reservation}-reserved seat`}
    >
      {reservation}
    </span>
  )
}
