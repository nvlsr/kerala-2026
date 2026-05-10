/**
 * CohortSection — section building-block for walkthrough cohort tours.
 *
 * Two-column layout (visual on one side, prose on the other) with a
 * 2:3 column ratio on lg+ screens. Stacks vertically on smaller
 * viewports.
 *
 * Used by `walkthroughs-nda-page.tsx` and `walkthroughs-udf-page.tsx`.
 *
 * Pattern:
 *
 *   <CohortSection
 *     id="cohort-anchor"
 *     heading="Cohort name"
 *     map={<ChoroplethMap ... />}
 *     mapCaption="..."
 *     mapSide="left"  // or "right"
 *   >
 *     <p>... prose ...</p>
 *     <Table>... compact data table ...</Table>
 *   </CohortSection>
 */
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  id?: string
  heading: string
  map: ReactNode
  mapCaption?: ReactNode
  mapSide?: "left" | "right"
  children: ReactNode
}

export function CohortSection({
  id,
  heading,
  map,
  mapCaption,
  mapSide = "left",
  children,
}: Props) {
  return (
    <section id={id} className="scroll-mt-20 border-t pt-10">
      <h2 className="mb-5 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
        {heading}
      </h2>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <figure className={cn(mapSide === "right" ? "lg:order-2" : "")}>
          <div className="rounded-sm border bg-card/40 p-3 sm:p-4">{map}</div>
          {mapCaption && (
            <figcaption className="mt-2 text-xs text-muted-foreground">
              {mapCaption}
            </figcaption>
          )}
        </figure>
        <div
          className={cn(
            "min-w-0 space-y-3 text-sm leading-relaxed sm:text-[15px]",
            mapSide === "right" ? "lg:order-1" : ""
          )}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
