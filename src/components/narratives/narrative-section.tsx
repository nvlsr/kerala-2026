import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  /** Section heading. Rendered as h2. */
  heading: string
  /**
   * Visual element (chart, choropleth, etc.). Rendered above the
   * prose on mobile; alongside or above on desktop depending on
   * `layout`.
   */
  visual: ReactNode
  /** Section prose. ~200-400 words typically. */
  children: ReactNode
  /**
   * "stacked"  — visual on top, prose below (default; works for
   *              wide visuals like choropleths or charts that need
   *              full width).
   * "side-by-side" — visual on the right at lg+, stacked on smaller
   *              screens. Use for narrow visuals where the prose
   *              benefits from more reading width.
   */
  layout?: "stacked" | "side-by-side"
  /** Optional small caption beneath the visual. */
  caption?: ReactNode
}

/**
 * Section building-block for arc pages. Heading + prose + visual,
 * with consistent spacing and a small horizontal rule between
 * sections. All arc pages compose 4-6 of these.
 */
export function NarrativeSection({
  heading,
  visual,
  children,
  layout = "stacked",
  caption,
}: Props) {
  return (
    <section className="border-t pt-8 first:border-t-0 first:pt-0">
      <h2 className="font-heading mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
        {heading}
      </h2>
      {layout === "stacked" ? (
        <div className="space-y-4">
          <figure className="mx-auto max-w-xl">
            <div className="rounded-lg border bg-card/40 p-4 sm:p-6">
              {visual}
            </div>
            {caption && (
              <figcaption className="mt-2 text-xs text-muted-foreground">
                {caption}
              </figcaption>
            )}
          </figure>
          <div
            className={cn(
              "max-w-prose space-y-3 text-sm leading-relaxed sm:text-[15px]"
            )}
          >
            {children}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div
              className={cn(
                "max-w-prose space-y-3 text-sm leading-relaxed sm:text-[15px]"
              )}
            >
              {children}
            </div>
          </div>
          <figure className="lg:col-span-2">
            <div className="rounded-lg border bg-card/40 p-4 sm:p-6">
              {visual}
            </div>
            {caption && (
              <figcaption className="mt-2 text-xs text-muted-foreground">
                {caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  )
}
