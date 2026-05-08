import { cn } from "@/lib/utils"

export type SectionType =
  | "foundational"
  | "falsification"
  | "mechanism"
  | "exploratory"
  | "synthesis"

const STYLES: Record<
  SectionType,
  { label: string; classes: string; tooltip: string }
> = {
  foundational: {
    label: "Foundational finding",
    classes:
      "border-foreground/30 bg-foreground/5 text-foreground/80",
    tooltip:
      "A primary descriptive observation that the rest of the arc rests on.",
  },
  falsification: {
    label: "Falsification test",
    classes:
      "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400",
    tooltip:
      "Tests a press claim or prior hypothesis; reports whether the data supports it.",
  },
  mechanism: {
    label: "Mechanism",
    classes:
      "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-400",
    tooltip:
      "Explains how the observed pattern is produced (e.g. FPTP amplification, vote-flow accounting).",
  },
  exploratory: {
    label: "Exploratory",
    classes:
      "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400",
    tooltip:
      "Provisional reading. Limited by data resolution or sample size; cite cautiously.",
  },
  synthesis: {
    label: "Synthesis",
    classes:
      "border-purple-500/30 bg-purple-500/5 text-purple-700 dark:text-purple-400",
    tooltip:
      "Pulls multiple findings together; framework rather than evidence.",
  },
}

type Props = {
  type: SectionType
  className?: string
}

/**
 * Small badge surfacing the structural role of a narrative section.
 * Helps readers distinguish primary findings from falsifications,
 * mechanisms, and exploratory readings — the catalog already has
 * this hierarchy substantively; this exposes it visually.
 */
export function SectionTypeBadge({ type, className }: Props) {
  const meta = STYLES[type]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase",
        meta.classes,
        className
      )}
      title={meta.tooltip}
    >
      {meta.label}
    </span>
  )
}
