import { BeltsMap } from "@/components/belts-map"
import {
  belts,
  buildBeltCrossTab,
  type BeltCrossTabRow,
} from "@/lib/data/belts"
import type { Constituency } from "@/lib/data/constituencies"

/**
 * Reusable section: per-pattern community-belt overlay analysis.
 *
 * Each consumer (`/drifts`, future `/flows`) supplies their own pattern
 * groups + hand-written editorial framings + optional cross-pattern
 * observation. The component handles the cross-tab build, the per-pattern
 * blocks, the maps, and the layout.
 *
 * The framings encode interpretation — they're hand-written per page
 * because the analytical story differs (multi-cycle 15-year drifts vs
 * single-cycle 2021→2026 flows). The data-derived parts (which belts
 * hold which seats, which are absent) come from the cross-tab.
 */

export type BeltOverlayPatternGroup = {
  key: string
  label: string
  seats: Constituency[]
}

type Props = {
  patternGroups: BeltOverlayPatternGroup[]
  /** Map of patternKey → editorial framing prose. Missing keys render
   *  no framing (just the map + belt list). */
  framings: Record<string, string>
  /** Optional callout shown after the per-pattern blocks. Useful for
   *  observations that span multiple patterns at once. */
  crossPatternObservation?: string
  sectionTitle: string
  sectionDescription: string
}

export function BeltOverlaySection({
  patternGroups,
  framings,
  crossPatternObservation,
  sectionTitle,
  sectionDescription,
}: Props) {
  const crossTab = buildBeltCrossTab(patternGroups)

  return (
    <section>
      <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
        {sectionTitle}
      </h2>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-muted-foreground">
        {sectionDescription}
      </p>
      <ul className="flex flex-col gap-8">
        {patternGroups.map((g) => {
          const focus = new Set(g.seats.map((s) => s.constituencyNumber))
          const row = crossTab.rows.find((r) => r.patternKey === g.key)
          if (!row) return null
          return (
            <li key={g.key}>
              <PerPatternBlock
                patternLabel={g.label}
                row={row}
                focusSeats={focus}
                framing={framings[g.key]}
              />
            </li>
          )
        })}
      </ul>
      {crossPatternObservation && (
        <aside className="mt-6 rounded-md border-l-2 border-foreground/30 bg-muted/30 px-4 py-3 text-sm">
          <p className="mb-1 text-[10px] font-medium tracking-wider text-foreground/70 uppercase">
            Across patterns
          </p>
          <p className="leading-relaxed text-muted-foreground">
            {crossPatternObservation}
          </p>
        </aside>
      )}
    </section>
  )
}

// ─── Per-pattern block ────────────────────────────────────────────────

type PerPatternBlockProps = {
  patternLabel: string
  row: BeltCrossTabRow
  focusSeats: Set<number>
  framing?: string
}

function PerPatternBlock({
  patternLabel,
  row,
  focusSeats,
  framing,
}: PerPatternBlockProps) {
  const beltById = new Map(belts.map((b) => [b.id, b]))
  const present = Object.entries(row.byBelt)
    .filter(([, v]) => v.count > 0)
    .map(([id, v]) => ({ belt: beltById.get(id)!, ...v }))
    .sort((a, b) => b.count - a.count)
  const absent = Object.entries(row.byBelt)
    .filter(([, v]) => v.count === 0)
    .map(([id]) => beltById.get(id)!)
    .filter(Boolean)

  // Only mention absences when there's a meaningful structural story —
  // arbitrarily: when 3 or fewer belts are absent. Beyond that the list
  // becomes noise (most absences are mathematical rather than informative).
  const showAbsences = absent.length > 0 && absent.length <= 3

  return (
    <article className="rounded-lg border bg-card/40 p-5 sm:p-6">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
          {patternLabel}
        </h3>
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          {row.total} seats
        </span>
      </header>
      {framing && (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {framing}
        </p>
      )}
      <div className="mt-5 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BeltsMap
            focusSeats={focusSeats}
            strokeSeats={focusSeats}
            ariaLabel={`Belt map with ${patternLabel} pattern seats highlighted`}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium tracking-wider text-foreground/70 uppercase">
            Belts holding this pattern
          </p>
          <ul className="space-y-1.5">
            {present.map((p) => (
              <li
                key={p.belt.id}
                className="flex items-center gap-2 text-sm"
                title={p.seats.join(", ")}
              >
                <span
                  className="inline-block h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: p.belt.color }}
                  aria-hidden
                />
                <span className="flex-1 truncate">{p.belt.label}</span>
                <span className="font-medium text-foreground tabular-nums">
                  {p.count}
                </span>
              </li>
            ))}
          </ul>
          {showAbsences && (
            <p className="mt-3 text-xs leading-snug text-muted-foreground">
              <span className="font-medium text-foreground/70">
                Absent from:
              </span>{" "}
              {absent.map((b) => b.label).join(", ")}.
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
