/**
 * WhatWouldWeakenSection — terminal-section convention used by the
 * arc walkthroughs. Section header + a bullet list. Each bullet has
 * a foreground-emphasised lead phrase + the rationale.
 *
 * Usage:
 *
 *   <WhatWouldWeakenSection
 *     bullets={[
 *       {
 *         lead: "Higher-resolution geographic controls",
 *         rest: "(sub-district / Lok Sabha FE) showing the
 *                Christian-belt premium dissolves at finer geographic
 *                resolution — would force a reframe to ...",
 *       },
 *       ...
 *     ]}
 *   />
 *
 * Section anchor id is fixed at "what-would-weaken" to match the
 * convention used in rail nav across the arc pages.
 */
import type { ReactNode } from "react"

export type Weakener = {
  lead: ReactNode
  rest: ReactNode
}

type Props = {
  bullets: ReadonlyArray<Weakener>
}

export function WhatWouldWeakenSection({ bullets }: Props) {
  return (
    <section id="what-would-weaken" className="scroll-mt-20 border-t pt-8">
      <h2 className="mb-4 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
        What would weaken this conclusion
      </h2>
      <ul className="max-w-prose list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground">
        {bullets.map((b, i) => (
          <li key={i}>
            <strong className="font-medium text-foreground">{b.lead}</strong>{" "}
            {b.rest}
          </li>
        ))}
      </ul>
    </section>
  )
}
