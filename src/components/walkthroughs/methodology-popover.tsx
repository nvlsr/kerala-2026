import { Link } from "react-router-dom"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type MethodologyTerm =
  | "fixed-effects"
  | "matched-controls"
  | "constituency-equal"
  | "vote-weighted"

const TERMS: Record<
  MethodologyTerm,
  { title: string; body: string; anchor: string }
> = {
  "fixed-effects": {
    title: "District fixed effects",
    body: "A statistical control that compares ACs only against other ACs in the same district. It removes any district-wide trend (campaign attention, regional shocks) from the estimate, isolating within-district variation.",
    anchor: "fixed-effects",
  },
  "matched-controls": {
    title: "Matched controls",
    body: "A comparison group of ACs with similar covariate composition (e.g. similar Hindu population share) but lying outside the cluster of interest. The contrast estimates how much of the observed effect is specific to that cluster vs the broader population.",
    anchor: "fixed-effects",
  },
  "constituency-equal": {
    title: "Constituency-equal aggregation",
    body: "Each AC counts once. Useful when describing geographic distribution. Does not weight by voter turnout — different from vote-weighted aggregates.",
    anchor: "vote-share",
  },
  "vote-weighted": {
    title: "Vote-weighted aggregation",
    body: "Each AC contributes proportional to its vote count. Matches the statewide vote-share figures news outlets report. Different from constituency-equal aggregates.",
    anchor: "vote-share",
  },
}

type Props = {
  term: MethodologyTerm
  children: React.ReactNode
  className?: string
}

/**
 * Inline tooltip-style popover that explains methodology terms
 * without leaving the page. Click target is the wrapped text;
 * the popover body links out to /walkthroughs/methodology for the
 * full treatment.
 */
export function MethodologyPopover({ term, children, className }: Props) {
  const meta = TERMS[term]
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "cursor-help border-b border-dotted border-foreground/40 underline-offset-2 hover:border-foreground/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              className
            )}
          >
            {children}
          </button>
        }
      />
      <PopoverContent
        side="top"
        align="center"
        className="w-80 max-w-[calc(100vw-2rem)] text-sm"
      >
        <p className="font-heading text-sm font-semibold tracking-tight">
          {meta.title}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {meta.body}
        </p>
        <p className="mt-2.5 text-xs">
          <Link
            to={`/walkthroughs/methodology#${meta.anchor}`}
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Full methodology →
          </Link>
        </p>
      </PopoverContent>
    </Popover>
  )
}
