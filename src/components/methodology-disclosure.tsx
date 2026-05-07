import { type ReactNode } from "react"
import { IconChevronDown } from "@tabler/icons-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type Props = {
  /** Header text (typically "Methodology & X"). */
  title: ReactNode
  /** Body content shown when expanded. */
  children: ReactNode
}

/**
 * Shared "Methodology & ___" disclosure used at the bottom of /belts,
 * /drifts, /flows, and /religion-map. Wraps shadcn's Collapsible with
 * the project's standard card framing + a rotating chevron affordance.
 *
 * Replaces the four hand-written `<details>`/`<summary>` blocks that
 * each page used to inline; gives proper ARIA state, animated open/
 * close, and a single source of truth for the styling.
 */
export function MethodologyDisclosure({ title, children }: Props) {
  return (
    <Collapsible className="rounded-lg border bg-card/40 p-6 text-sm">
      <CollapsibleTrigger className="group flex w-full cursor-pointer items-center gap-2 text-left font-medium">
        <IconChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180"
          aria-hidden
        />
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-3 text-muted-foreground">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
