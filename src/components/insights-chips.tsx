import type { Dispatch } from "react"

import { InfoIcon } from "@/components/info-icon"
import { insightChips } from "@/lib/insights"
import type { FilterAction } from "@/lib/filters"

type Props = {
  dispatch: Dispatch<FilterAction>
}

export function InsightsChips({ dispatch }: Props) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-1.5">
      <span className="flex items-center gap-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        Insights
        <InfoIcon text="One-click views — each chip applies a curated combination of party filter, sort, and result toggle. Use as a starting point; refine afterwards as usual." />
      </span>
      {insightChips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          title={chip.description}
          onClick={() =>
            dispatch({ type: "apply-preset", preset: chip.preset })
          }
          className="inline-flex items-center rounded-full border bg-muted/40 px-2 py-0.5 text-xs font-medium hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {chip.label}
        </button>
      ))}
    </div>
  )
}
