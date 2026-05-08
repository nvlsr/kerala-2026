import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type Footnote = {
  /** 1-based number used for the inline reference and the list. */
  n: number
  /** Display content of the footnote: source line, leader, date, link. */
  content: ReactNode
}

const SUPERSCRIPTS = ["¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "¹⁰"]

/**
 * Inline footnote reference — a small superscript that links to
 * the corresponding footnote entry at the bottom of the page.
 *
 * Numbering is manual: pages declare their footnote list (see
 * Footnotes below) and call <FootnoteRef n={N} /> wherever the
 * source applies. Authors are responsible for keeping numbering
 * consistent across the page.
 */
export function FootnoteRef({ n }: { n: number }) {
  const label = SUPERSCRIPTS[n - 1] ?? `[${n}]`
  return (
    <a
      href={`#fn-${n}`}
      className="ml-px text-[0.85em] font-medium text-foreground/70 underline-offset-2 hover:text-foreground hover:underline"
      aria-label={`Footnote ${n}`}
    >
      {label}
    </a>
  )
}

type FootnotesProps = {
  items: Footnote[]
  className?: string
}

/**
 * Page-level footnotes block. Renders the list of sources at the
 * bottom of the page; each entry has an id (#fn-N) so inline
 * superscript references jump to it.
 */
export function Footnotes({ items, className }: FootnotesProps) {
  if (items.length === 0) return null
  return (
    <section
      aria-label="Footnotes"
      className={cn("border-t pt-6 text-xs text-muted-foreground", className)}
    >
      <h2 className="font-heading text-[10px] font-semibold tracking-widest uppercase text-foreground/70">
        Sources
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 leading-relaxed">
        {items.map((f) => (
          <li key={f.n} id={`fn-${f.n}`} className="scroll-mt-20">
            {f.content}
          </li>
        ))}
      </ol>
    </section>
  )
}
