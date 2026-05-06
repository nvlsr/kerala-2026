import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { IconInfoCircle, IconX } from "@tabler/icons-react"

import { BeltsMap } from "@/components/belts-map"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  belts,
  buildBeltCrossTab,
  type BeltCrossTabRow,
} from "@/lib/data/belts"
import {
  getMultiCycleDrifts,
  multiCyclePatternKey,
  multiCyclePatternLabel,
  type MultiCycleDrift,
} from "@/lib/data/flows"
import type { BeltDef } from "@/lib/data/loaders"
import { cn } from "@/lib/utils"

function groupBy<T, K extends string>(
  items: T[],
  key: (t: T) => K,
  label: (t: T) => string
): { key: K; label: string; items: T[] }[] {
  const map = new Map<K, { key: K; label: string; items: T[] }>()
  for (const item of items) {
    const k = key(item)
    if (!map.has(k)) map.set(k, { key: k, label: label(item), items: [] })
    map.get(k)!.items.push(item)
  }
  return [...map.values()].sort((a, b) => b.items.length - a.items.length)
}

// Hand-written editorial framing per pattern. The numeric specifics are
// data-derived (see PerPatternBlock); these sentences carry the
// interpretation the data alone can't.
const PATTERN_FRAMINGS: Record<string, string> = {
  LDF_to_NDA:
    "Spread across central and southern Kerala — central-syromalabar (5), southern-ezhava (5), and southern-nair-latin (4) lead, with smaller clusters across the central-reformed-christian, central-hindu, northern-mixed, and southern-coastal-mixed belts. The conspicuous absence is northern-muslim: IUML's structural hold in Malappuram blocks NDA's third-pole rise from reaching the Muslim belt at all. The drift lives in Hindu and Christian sub-community zones; it stops at the Muslim border.",
  LDF_to_UDF:
    "Heavily Christian-belt. The central-syromalabar zone holds 4 of 11 (Angamaly, Piravom, Muvattupuzha, Peerumade) — Syro-Malabar Catholic seats where KC(M) was historically UDF before its 2020 switch to LDF. The cumulative 15-year arc still reads as LDF→UDF in those seats because UDF's earlier base survives the cycle math. This pattern is largely a denominational story.",
  UDF_to_NDA:
    "Tightly clustered. Half (3 of 6) sit in southern-nair-latin — the Trivandrum Nair belt is the one place NDA has stripped UDF votes at scale. Two more in central-reformed-christian (Pala, Poonjar in Kottayam highlands), one in central-hindu (Ottappalam). The Ezhava and Syro-Malabar belts that drive LDF→NDA are absent here entirely; this is a different drift in a different geography.",
}

const CROSS_PATTERN_OBSERVATION =
  "Notice that central-syromalabar appears in both LDF→NDA (5 seats) and LDF→UDF (4 seats). The Syro-Malabar Catholic belt is the most politically churned in the dataset — drifting in opposite directions in different seats simultaneously. Most other belts feed at most one drift pattern."

export function BeltsPage() {
  const [selectedBeltId, setSelectedBeltId] = useState<string | null>(null)
  const drifts = useMemo(() => getMultiCycleDrifts(), [])

  const driftGroups = useMemo(
    () =>
      groupBy<MultiCycleDrift, string>(
        drifts,
        (d) => multiCyclePatternKey(d),
        (d) => multiCyclePatternLabel(d)
      ),
    [drifts]
  )

  const crossTab = useMemo(
    () =>
      buildBeltCrossTab(
        driftGroups.map((g) => ({
          key: g.key,
          label: g.label,
          seats: g.items.map((d) => d.constituency),
        }))
      ),
    [driftGroups]
  )

  const driftSeatsByPattern = useMemo(() => {
    const out = new Map<string, Set<number>>()
    for (const g of driftGroups) {
      out.set(
        g.key,
        new Set(g.items.map((d) => d.constituency.constituencyNumber))
      )
    }
    return out
  }, [driftGroups])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header>
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-6">
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-foreground">
                Kerala 2026
              </Link>{" "}
              · Belts
            </p>
            <h1 className="font-heading flex items-center gap-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Drift, by community belt
              <Popover>
                <PopoverTrigger
                  aria-label="About this page"
                  className="inline-flex shrink-0 items-center justify-center rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <IconInfoCircle className="h-5 w-5" aria-hidden />
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 sm:w-96"
                  align="start"
                  sideOffset={8}
                >
                  <div className="space-y-3 text-sm leading-relaxed">
                    <p>
                      A qualitative geography of Kerala's community
                      "belts" overlaid against the multi-cycle drift
                      findings from{" "}
                      <Link
                        to="/drifts"
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        /drifts
                      </Link>
                      . The question: do the drift patterns
                      concentrate in particular community zones?
                    </p>
                    <p className="border-t pt-3 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Inferred, not measured.
                      </span>{" "}
                      The taxonomy comes from academic literature
                      (Zachariah 2003, GeoCurrents synthesis 2014,
                      KCBC diocese geography), not from sub-district
                      census data. Author judgement shaped each label.
                      The conclusions are pattern-suggestive, not
                      statistical evidence.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              The short answer: <span className="text-foreground">yes</span>,
              the multi-cycle drifts cluster in particular belts — and the
              clusters tell three different stories.{" "}
              <span className="font-medium text-foreground">LDF→NDA</span>{" "}
              is broad but stops at the Muslim belt;{" "}
              <span className="font-medium text-foreground">LDF→UDF</span>{" "}
              is overwhelmingly Syro-Malabar Christian;{" "}
              <span className="font-medium text-foreground">UDF→NDA</span>{" "}
              is a tight Trivandrum-Nair plus Kottayam-highland cluster.
              Read on for each pattern's geography.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-8">
        {/* ─── Belt map ─── */}
        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            The nine belts
          </h2>
          <p className="mt-1 mb-4 max-w-2xl text-sm text-muted-foreground">
            Every AC is shaded by its district's primary belt. Click any
            belt card on the right to highlight just that zone on the
            map; click again to clear.
          </p>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <BeltsMap
                selectedBeltId={selectedBeltId}
                ariaLabel={
                  selectedBeltId
                    ? `Kerala constituency map highlighting ${selectedBeltId} belt`
                    : "Kerala constituency map shaded by community belt"
                }
              />
              {selectedBeltId && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Showing only the selected belt. Click another card to
                  switch, or use the reset button to see all belts.
                </p>
              )}
            </div>
            <BeltLegend
              selectedBeltId={selectedBeltId}
              onSelect={(id) =>
                setSelectedBeltId((current) => (current === id ? null : id))
              }
              onReset={() => setSelectedBeltId(null)}
            />
          </div>
        </section>

        {/* ─── Per-pattern blocks ─── */}
        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            How each drift pattern maps onto the belts
          </h2>
          <p className="mt-1 mb-6 max-w-2xl text-sm text-muted-foreground">
            For each of the three multi-cycle drift patterns, the same
            belt baseline with that pattern's drift seats outlined.
            Right of each map: which belts the drift concentrates in,
            and which belts it skips.
          </p>
          <ul className="flex flex-col gap-8">
            {driftGroups.map((g) => {
              const focus = driftSeatsByPattern.get(g.key)!
              const row = crossTab.rows.find((r) => r.patternKey === g.key)
              if (!row) return null
              return (
                <li key={g.key}>
                  <PerPatternBlock
                    patternKey={g.key}
                    patternLabel={g.label}
                    row={row}
                    focusSeats={focus}
                  />
                </li>
              )
            })}
          </ul>
          <aside className="mt-6 rounded-md border-l-2 border-foreground/30 bg-muted/30 px-4 py-3 text-sm">
            <p className="text-[10px] mb-1 font-medium tracking-wider text-foreground/70 uppercase">
              Across patterns
            </p>
            <p className="leading-relaxed text-muted-foreground">
              {CROSS_PATTERN_OBSERVATION}
            </p>
          </aside>
        </section>

        {/* ─── Methodology ─── */}
        <section>
          <details className="rounded-lg border bg-card/40 p-6 text-sm">
            <summary className="cursor-pointer font-medium">
              Methodology &amp; sources
            </summary>
            <div className="mt-3 space-y-3 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  Belt taxonomy.
                </span>{" "}
                Nine belts, one primary label per district. The
                assignments live in{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/data/community-belts.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  data/community-belts.json
                </a>{" "}
                — readers can challenge specific labels and submit
                corrections.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Sources informing the taxonomy.
                </span>{" "}
                Zachariah, Mathew &amp; Rajan,{" "}
                <em>Dynamics of Migration in Kerala</em> (2003); the
                GeoCurrents 2014 Kerala electoral-geography synthesis;
                KCBC diocese boundaries; Wikipedia AC pages where they
                describe community character. The 2011 Census
                religion-mix at district level (already in the data
                layer) was used as the quantitative cross-check.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Caveats worth holding on to as you read this page.
                </span>
              </p>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  Districts are administrative units; community
                  boundaries cross them. Within a belt, AC-level
                  variation is real and not yet captured here. Pass 2
                  will refine per-AC labels for the 41 drift seats.
                </li>
                <li>
                  Author judgement shaped each label. Where two belts
                  could plausibly fit (e.g. Pathanamthitta is both
                  Reformed Christian and significantly Ezhava-Hindu),
                  the primary label may understate the secondary
                  presence.
                </li>
                <li>
                  This is qualitative correlation, not statistical
                  evidence. n=41 split across nine belts is too few
                  cells for confidence beyond pattern-suggestion.
                </li>
                <li>
                  The 2011 Census is the most recent — differential
                  fertility since then has shifted the picture
                  modestly, especially raising Muslim share and
                  lowering Hindu and Christian shares versus what's
                  shown here.
                </li>
                <li>
                  No public dataset captures Christian denomination
                  geography below diocese level; KCBC diocese
                  boundaries are an approximation.
                </li>
              </ul>
              <p>
                <span className="font-medium text-foreground">
                  Related pages.
                </span>{" "}
                The drift data itself is computed on{" "}
                <Link
                  to="/drifts"
                  className="underline-offset-2 hover:underline"
                >
                  /drifts
                </Link>
                ; the 2021 → 2026 leg specifically (which seats are
                still climbing vs which have plateaued) is in the
                "Recent leg" section there. The future religion-gradient
                page (planned, not built) is sketched in{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/religion-map.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  docs/religion-map.md
                </a>
                .
              </p>
            </div>
          </details>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

// ─── Per-pattern block ────────────────────────────────────────────────

type PerPatternBlockProps = {
  patternKey: string
  patternLabel: string
  row: BeltCrossTabRow
  focusSeats: Set<number>
}

function PerPatternBlock({
  patternKey,
  patternLabel,
  row,
  focusSeats,
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
  // arbitrarily: when 2 or fewer belts are absent. Beyond that the list
  // becomes noise (most of the absences are mathematical, not interesting).
  const showAbsences = absent.length > 0 && absent.length <= 3
  const framing = PATTERN_FRAMINGS[patternKey]

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
            ariaLabel={`Belt map with ${patternLabel} drift seats highlighted`}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium tracking-wider text-foreground/70 uppercase">
            Belts holding this drift
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
                <span className="font-medium tabular-nums text-foreground">
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

// ─── Belt legend ─────────────────────────────────────────────────────

type BeltLegendProps = {
  selectedBeltId: string | null
  onSelect: (id: string) => void
  onReset: () => void
}

function BeltLegend({ selectedBeltId, onSelect, onReset }: BeltLegendProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Click a belt to highlight
        </p>
        {selectedBeltId && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs font-medium hover:bg-foreground/5"
          >
            <IconX className="h-3 w-3" aria-hidden />
            Reset
          </button>
        )}
      </div>
      <ul className="space-y-2 text-sm">
        {belts.map((b) => {
          const isSelected = selectedBeltId === b.id
          const dimmed = selectedBeltId !== null && !isSelected
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => onSelect(b.id)}
                aria-pressed={isSelected}
                className={cn(
                  "flex w-full items-start gap-2 rounded-md border p-2 text-left transition-colors",
                  isSelected
                    ? "border-foreground/60 bg-foreground/5 ring-1 ring-foreground/20"
                    : "bg-card/30 hover:bg-foreground/[0.03]",
                  dimmed && "opacity-50"
                )}
              >
                <span
                  className="mt-0.5 inline-block h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: b.color }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="font-medium leading-tight">{b.label}</p>
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    {b.description}
                  </p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// `BeltDef` import retained because PerPatternBlock receives belt
// metadata indirectly through cross-tab; keep type imports tidy.
export type { BeltDef }
