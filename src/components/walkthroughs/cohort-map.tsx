/**
 * Shared cohort-map primitives for walkthrough pages.
 *
 * Both NDA and insights pages render the same pattern repeatedly:
 * a choropleth with binary cohort membership encoded as 0/1, plus a
 * tooltip that calls out cohort ACs with a badge. Extracted here so
 * the duplication (previously in nda-page.tsx + insights-page.tsx)
 * stays in one place.
 *
 * `CohortLink` is a small anchor styled to match the walkthrough
 * surface — used for in-page navigation between cohort sections.
 */
import { useMemo, type ReactNode } from "react"

import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { constituencies } from "@/lib/data/constituencies"

/**
 * Build a `{acNumber → 0 | 1}` map covering all 140 ACs, with 1 for
 * members of the cohort set and 0 elsewhere. The choropleth's
 * sequential color scale then renders members and non-members
 * distinctly while keeping the full geometry visible.
 */
export function makeBinaryValueMap(acs: Set<number>): Map<number, number> {
  const out = new Map<number, number>()
  for (const c of constituencies) {
    out.set(c.constituencyNumber, acs.has(c.constituencyNumber) ? 1 : 0)
  }
  return out
}

const acByNumber = new Map(constituencies.map((c) => [c.constituencyNumber, c]))

type CohortMapProps = {
  acs: Set<number>
  color: string
  ariaLabel: string
  badgeLabel: string
}

export function CohortMap({
  acs,
  color,
  ariaLabel,
  badgeLabel,
}: CohortMapProps) {
  const valueByAC = useMemo(() => makeBinaryValueMap(acs), [acs])
  return (
    <ChoroplethMap
      valueByAC={valueByAC}
      colorScale="sequential"
      domain={[0, 1]}
      sequentialColor={color}
      highlightSeats={acs}
      ariaLabel={ariaLabel}
      unit=""
      decimals={0}
      tooltipFormat={(acNumber, value) => {
        const ac = acByNumber.get(acNumber)
        const inCohort = (value ?? 0) > 0.5
        return (
          <span>
            <span className="font-medium">
              {ac?.constituencyName ?? `AC ${acNumber}`}
            </span>
            {inCohort && (
              <span className="ml-1 rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[10px]">
                {badgeLabel}
              </span>
            )}
          </span>
        )
      }}
    />
  )
}

/**
 * Inline anchor link styled to match walkthrough body prose. Used to
 * jump between cohort sections within a single walkthrough page.
 */
export function CohortLink({
  slug,
  children,
}: {
  slug: string
  children: ReactNode
}) {
  return (
    <a
      href={`#${slug}`}
      className="font-medium text-foreground underline decoration-foreground/30 decoration-[1.5px] underline-offset-2 hover:text-foreground hover:decoration-foreground"
    >
      {children}
    </a>
  )
}
