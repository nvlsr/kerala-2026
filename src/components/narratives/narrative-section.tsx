import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Layout = "visual-right" | "visual-left" | "stacked"

type Props = {
  /** Section heading. Rendered as h2. */
  heading: string
  /**
   * Visual element (chart, choropleth, etc.). Optional — when
   * omitted, the section renders as a text-only block constrained
   * to a comfortable reading width. When present, placement is
   * controlled by `layout`.
   */
  visual?: ReactNode
  /** Section prose. ~200-400 words typically. */
  children: ReactNode
  /**
   * Layout for the section. Only consulted when `visual` is set.
   *
   * - `visual-right` (default): text on the left, visual on the
   *   right at lg+. Stacks (text → visual) on smaller screens.
   *   Best for compact visuals (choropleths, small bar charts).
   * - `visual-left`: visual on the left, text on the right at lg+.
   *   Stacks (text → visual) on smaller screens. Use to alternate
   *   the side and avoid all visuals lining up on the same edge.
   * - `stacked`: visual centered above the prose at full width.
   *   Best for wide visuals that need horizontal room (histograms,
   *   trajectory charts, stacked bars by category).
   */
  layout?: Layout
  /** Optional small caption beneath the visual. */
  caption?: ReactNode
}

/**
 * Section building-block for arc pages. Heading + prose + optional
 * visual, with consistent spacing and a small horizontal rule
 * between sections. All arc pages compose 4-6 of these.
 *
 * Layout API: see Props.layout — three side-by-side / stacked
 * choices when a visual is supplied; text-only when it isn't. The
 * page author picks per section; no auto-alternation. Mobile
 * always stacks text-then-visual regardless of `layout`.
 */
export function NarrativeSection({
  heading,
  visual,
  children,
  layout = "visual-right",
  caption,
}: Props) {
  const proseClass =
    "max-w-prose space-y-3 text-sm leading-relaxed sm:text-[15px]"

  return (
    <section className="border-t pt-8 first:border-t-0 first:pt-0">
      <h2 className="font-heading mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
        {heading}
      </h2>
      {visual == null ? (
        <div className={proseClass}>{children}</div>
      ) : layout === "stacked" ? (
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
          <div className={proseClass}>{children}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          <div
            className={cn(
              layout === "visual-left" ? "lg:col-span-3 lg:order-2" : "lg:col-span-3"
            )}
          >
            <div className={proseClass}>{children}</div>
          </div>
          <figure
            className={cn(
              layout === "visual-left"
                ? "lg:col-span-2 lg:order-1"
                : "lg:col-span-2"
            )}
          >
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
