import { cn } from "@/lib/utils"

export type ConfidenceLevel = "strong" | "tentative"

const STYLES: Record<
  ConfidenceLevel,
  { label: string; classes: string; tooltip: string }
> = {
  strong: {
    label: "Strong",
    classes: "border-foreground/20 text-muted-foreground",
    tooltip:
      "Multiple independent tests converge; effect is robust to specification changes.",
  },
  tentative: {
    label: "Tentative",
    classes:
      "border-amber-500/40 text-amber-700 dark:text-amber-500",
    tooltip:
      "Suggestive evidence; sensitive to data resolution, specification choices, or extrapolation beyond the observed cycle.",
  },
}

type Props = {
  level: ConfidenceLevel
  className?: string
}

/**
 * Compact confidence indicator used near arc-page titles. Two
 * levels: Strong (default; muted neutral) and Tentative (subtle
 * amber). Strong is the catalog norm — it's not meant to draw the
 * eye. Tentative is reserved for findings whose extrapolation,
 * mechanism, or specification stability is genuinely uncertain;
 * those should *deserve* the reader's attention.
 */
export function ConfidenceBadge({ level, className }: Props) {
  const meta = STYLES[level]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase",
        meta.classes,
        className
      )}
      title={meta.tooltip}
    >
      Confidence: {meta.label}
    </span>
  )
}
