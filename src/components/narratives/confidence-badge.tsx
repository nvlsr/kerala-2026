import { cn } from "@/lib/utils"

export type ConfidenceLevel = "strong" | "moderate-strong" | "moderate"

const STYLES: Record<
  ConfidenceLevel,
  { label: string; classes: string; tooltip: string }
> = {
  strong: {
    label: "Strong",
    classes:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    tooltip:
      "Multiple independent tests converge; effect is robust to specification changes.",
  },
  "moderate-strong": {
    label: "Moderate-strong",
    classes:
      "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    tooltip:
      "Pattern is clear, but extrapolation or causal mechanism is partial.",
  },
  moderate: {
    label: "Moderate",
    classes:
      "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400",
    tooltip:
      "Suggestive evidence; sensitive to data resolution or specification choices.",
  },
}

type Props = {
  level: ConfidenceLevel
  className?: string
}

/**
 * Compact confidence indicator used near arc-page titles. Replaces
 * the longer "Confidence: ... (descriptive / mixed mechanism)" text
 * with a sharper visual signal. Methodology nuance is in
 * /narratives/methodology — this badge just establishes the level.
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
