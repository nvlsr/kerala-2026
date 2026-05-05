import type { MouseEvent, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { canonicalPartyName, partyShort } from "@/lib/data"

type Props = {
  party: string
  onSelect?: ((party: string) => void) | null
  className?: string
  title?: string
  children?: ReactNode
}

export function PartyLink({
  party,
  onSelect,
  className,
  title,
  children,
}: Props) {
  const canonical = canonicalPartyName(party)
  const label = children ?? partyShort(party)
  const linkable = onSelect != null && canonical !== "Independent"

  if (!linkable) {
    return (
      <span className={cn("truncate", className)} title={title ?? party}>
        {label}
      </span>
    )
  }

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onSelect(canonical)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title ?? `Open ${canonical}`}
      className={cn(
        "truncate underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none",
        className
      )}
    >
      {label}
    </button>
  )
}
