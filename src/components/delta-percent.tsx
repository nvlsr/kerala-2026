import { formatPercent } from "@/lib/data"

type Props = {
  value: number | null
}

export function DeltaPercent({ value }: Props) {
  if (value == null) {
    return <span className="text-muted-foreground/60">—</span>
  }
  return (
    <span
      className={
        value > 0
          ? "text-emerald-600 dark:text-emerald-500"
          : value < 0
            ? "text-red-600 dark:text-red-500"
            : "text-muted-foreground"
      }
    >
      {value >= 0 ? "+" : ""}
      {formatPercent(value / 100, 1)}
    </span>
  )
}
