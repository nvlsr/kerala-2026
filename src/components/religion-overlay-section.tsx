import { Link } from "react-router-dom"

import { ReligionGradientMap } from "@/components/religion-gradient-map"
import { districtForConstituency } from "@/lib/data"
import { demoMeta } from "@/lib/data/loaders"
import { getReligion, type ReligionCode } from "@/lib/data/demographics"
import type { Constituency } from "@/lib/data/constituencies"

/**
 * Per-pattern religion-gradient overlay analysis. Each pattern is
 * paired with the religion whose share best explains its geography
 * (e.g. Muslim gradient for the LDF→UDF Northern Muslim consolidation;
 * Christian gradient for the LDF+NDA→UDF Christian consolidation).
 *
 * Sibling to `<BeltOverlaySection>` — same shape, different lens.
 * Use whichever lens fits the analytical question better:
 *   - religion when the conclusion lives at religion-level
 *     (single-cycle flows where Muslim/Christian consolidation drove
 *     the swing)
 *   - belts when the conclusion needs sub-community granularity
 *     (multi-cycle drifts where Ezhava/Nair/Syro-Malabar/Marthoma
 *     distinctions carry the story)
 */

export type ReligionOverlayPatternGroup = {
  key: string
  label: string
  seats: Constituency[]
  /** Which religion's district-level gradient to show under this pattern's
   *  outlined seats. Pick the religion whose geography best explains the
   *  flow (e.g. "muslim" for a pattern driven by Muslim consolidation). */
  religion: ReligionCode
}

type Props = {
  patternGroups: ReligionOverlayPatternGroup[]
  /** Hand-written editorial framing per pattern key. */
  framings: Record<string, string>
  /** Optional callout shown after the per-pattern blocks. */
  crossPatternObservation?: string
  sectionTitle: string
  sectionDescription: string
}

export function ReligionOverlaySection({
  patternGroups,
  framings,
  crossPatternObservation,
  sectionTitle,
  sectionDescription,
}: Props) {
  return (
    <section>
      <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
        {sectionTitle}
      </h2>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-muted-foreground">
        {sectionDescription}{" "}
        <Link
          to="/religion-map"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          See the bare religion-map reference →
        </Link>
      </p>
      <ul className="flex flex-col gap-8">
        {patternGroups.map((g) => {
          const focus = new Set(g.seats.map((s) => s.constituencyNumber))
          return (
            <li key={g.key}>
              <PerPatternBlock
                label={g.label}
                seats={g.seats}
                religion={g.religion}
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
  label: string
  seats: Constituency[]
  religion: ReligionCode
  focusSeats: Set<number>
  framing?: string
}

function PerPatternBlock({
  label,
  seats,
  religion,
  focusSeats,
  framing,
}: PerPatternBlockProps) {
  const religionMeta = getReligion(religion)

  // Compute what % of this religion the average seat in this pattern
  // sits in (using each seat's district as the proxy for AC religion mix
  // — the only granularity available). Compared against the state
  // baseline as the "is this concentration real" check.
  const stateAverage = computeStateAverage(religion)
  const patternAverage = computePatternAverage(seats, religion)

  return (
    <article className="rounded-lg border bg-card/40 p-5 sm:p-6">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight sm:text-lg">
          <span
            className="inline-block h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: religionMeta.color }}
            aria-hidden
          />
          {label}
          <span className="text-sm font-normal text-muted-foreground">
            · <span className="font-medium">{religionMeta.label} gradient</span>
          </span>
        </h3>
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          {seats.length} seats
        </span>
      </header>
      {framing && (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {framing}
        </p>
      )}
      <div className="mt-5 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReligionGradientMap
            religion={religion}
            baseColor={religionMeta.color}
            outlinedSeats={focusSeats}
            outlineColor="var(--foreground)"
            ariaLabel={`${religionMeta.label} share gradient with ${label} pattern seats outlined`}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            District shading shows %{" "}
            <span style={{ color: religionMeta.color }} className="font-medium">
              {religionMeta.label}
            </span>
            ; black outlines mark this pattern's seats. The gradient anchor is
            the highest-share district (saturated) versus lowest (faint).
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium tracking-wider text-foreground/70 uppercase">
            Where these seats sit
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-baseline justify-between gap-2 border-b pb-2">
              <span className="text-muted-foreground">
                Avg district {religionMeta.label.toLowerCase()} share
              </span>
              <span className="font-medium tabular-nums">
                {patternAverage.toFixed(1)}%
              </span>
            </li>
            <li className="flex items-baseline justify-between gap-2 border-b pb-2">
              <span className="text-muted-foreground">State baseline</span>
              <span className="font-medium text-muted-foreground tabular-nums">
                {stateAverage.toFixed(1)}%
              </span>
            </li>
            <li className="flex items-baseline justify-between gap-2">
              <span className="text-muted-foreground">Difference</span>
              <span
                className={`font-medium tabular-nums ${
                  patternAverage - stateAverage > 5
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {patternAverage - stateAverage >= 0 ? "+" : ""}
                {(patternAverage - stateAverage).toFixed(1)} pp
              </span>
            </li>
          </ul>
          <p className="mt-3 text-xs leading-snug text-muted-foreground">
            Read the difference: positive means the pattern's seats sit in
            districts with notably higher {religionMeta.label.toLowerCase()}{" "}
            share than the state average — the concentration is real, not just
            sampling noise.
          </p>
        </div>
      </div>
    </article>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────

function computeStateAverage(religion: ReligionCode): number {
  let totalPop = 0
  let totalWeighted = 0
  for (const id in demoMeta.districts) {
    const d = demoMeta.districts[id]!
    totalPop += d.population
    totalWeighted += (d.religions[religion] / 100) * d.population
  }
  return totalPop > 0 ? (totalWeighted / totalPop) * 100 : 0
}

function computePatternAverage(
  seats: Constituency[],
  religion: ReligionCode
): number {
  let sum = 0
  let n = 0
  for (const seat of seats) {
    const district = districtForConstituency(seat)
    if (!district) continue
    const d = demoMeta.districts[district.id]
    if (!d) continue
    sum += d.religions[religion]
    n += 1
  }
  return n > 0 ? sum / n : 0
}
