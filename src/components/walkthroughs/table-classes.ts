/**
 * Compact-table styling tokens used inside walkthrough sections.
 *
 * These are designed to fit in the right-side prose column of a
 * `CohortSection` — denser than default shadcn Table styling.
 *
 * Apply to shadcn `<Table>` parts:
 *
 *   <TableHead className={COMPACT_HEAD_CLASS}>Seat</TableHead>
 *   <TableHead className={cn(COMPACT_HEAD_CLASS, NUM_HEAD_CLASS)}>UDF Δ</TableHead>
 *   <TableCell className={COMPACT_CELL_CLASS}>...</TableCell>
 *   <TableCell className={cn(COMPACT_CELL_CLASS, NUM_CELL_CLASS)}>+12.0</TableCell>
 *
 * Use HIGHLIGHT_ROW_CLASS on `<TableRow>` for amber-emphasised rows.
 */
export const HIGHLIGHT_ROW_CLASS =
  "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/40"

export const NUM_CELL_CLASS = "text-right font-mono tabular-nums"
export const NUM_HEAD_CLASS = "text-right"
export const COMPACT_CELL_CLASS = "px-2 py-1.5 text-[12.5px]"
export const COMPACT_HEAD_CLASS =
  "h-8 px-2 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground"
