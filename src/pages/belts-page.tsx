import { useMemo } from "react"
import { Link } from "react-router-dom"
import { IconInfoCircle } from "@tabler/icons-react"

import { BeltsMap } from "@/components/belts-map"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { belts, buildBeltCrossTab } from "@/lib/data/belts"
import {
  getMultiCycleDrifts,
  multiCyclePatternKey,
  multiCyclePatternLabel,
  type MultiCycleDrift,
} from "@/lib/data/flows"
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

export function BeltsPage() {
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
              Community belts
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
                      "belts" — the rough zones where particular
                      religious or caste-community groups dominate.
                      Districts are assigned a primary belt; per-AC
                      overrides will be added for finer signal where
                      needed.
                    </p>
                    <p className="border-t pt-3 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Inferred, not measured.
                      </span>{" "}
                      The taxonomy comes from academic literature
                      (Zachariah 2003, GeoCurrents synthesis 2014,
                      KCBC diocese geography), not from sub-district
                      census data. Author judgement shaped each label.
                      Cross-tab counts below are pattern-suggestive,
                      not statistical evidence.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Exploratory page. No nav entry yet — meant to be
              eyeballed and compared with published community-belt maps
              before being wired into the rest of the site.
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
            Every AC is shaded by its district's primary belt. Pass 2 of
            this work will refine the labels for the 41 multi-cycle
            drift seats individually, but for now this is the coarse
            district-default view.
          </p>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <BeltsMap ariaLabel="Kerala constituency map shaded by community belt" />
            </div>
            <BeltLegend />
          </div>
        </section>

        {/* ─── Per-pattern overlay maps ─── */}
        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            Drift patterns on the belt baseline
          </h2>
          <p className="mt-1 mb-4 max-w-2xl text-sm text-muted-foreground">
            The same belt map for each multi-cycle drift pattern —
            drift seats outlined, all other seats dimmed. The shapes
            of the highlighted clusters are the question to look at:
            do they sit in particular belts, or are they scattered?
          </p>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {driftGroups.map((g) => {
              const focus = driftSeatsByPattern.get(g.key)!
              return (
                <li
                  key={g.key}
                  className="rounded-lg border bg-card/40 p-4"
                >
                  <header className="mb-2 flex items-baseline justify-between gap-2">
                    <h3 className="font-heading text-sm font-semibold tracking-tight">
                      {g.label}
                    </h3>
                    <span className="text-xs tracking-wide text-muted-foreground uppercase">
                      {g.items.length} seats
                    </span>
                  </header>
                  <BeltsMap
                    focusSeats={focus}
                    strokeSeats={focus}
                    ariaLabel={`Belt map with ${g.label} drift seats highlighted`}
                  />
                </li>
              )
            })}
          </ul>
        </section>

        {/* ─── Cross-tab ─── */}
        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            Drift × belt cross-tab
          </h2>
          <p className="mt-1 mb-4 max-w-2xl text-sm text-muted-foreground">
            How many seats of each drift pattern fall into each belt.
            Read the rows: where is each shift concentrated? Read the
            columns: which belts are seeing which kind of movement?
            n=41 split across nine belts is too few cells for
            statistical confidence — read this as pattern-suggestive
            only.
          </p>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left">Pattern</th>
                  <th className="px-3 py-2 text-right">Total</th>
                  {crossTab.belts.map((b) => (
                    <th
                      key={b.id}
                      className="px-2 py-2 text-right"
                      title={b.label}
                    >
                      <span
                        className="mr-1 inline-block h-2 w-2 rounded-full align-middle"
                        style={{ backgroundColor: b.color }}
                        aria-hidden
                      />
                      {b.label.replace(/^[A-Z][a-z]+ /, "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {crossTab.rows.map((r) => (
                  <tr key={r.patternKey} className="border-t">
                    <td className="px-3 py-2 font-medium">
                      {r.patternLabel}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {r.total}
                    </td>
                    {crossTab.belts.map((b) => {
                      const cell = r.byBelt[b.id]!
                      const empty = cell.count === 0
                      return (
                        <td
                          key={b.id}
                          className={cn(
                            "px-2 py-2 text-right tabular-nums",
                            empty
                              ? "text-muted-foreground/30"
                              : "font-medium text-foreground"
                          )}
                          title={
                            cell.count > 0
                              ? cell.seats.join(", ")
                              : undefined
                          }
                        >
                          {cell.count || "—"}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Hover any non-zero cell to see the seat names in that
            cross-section.
          </p>
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
                  evidence. The cross-tab is small — n=41 split across
                  nine belts.
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
                  Why this page exists.
                </span>{" "}
                We wanted to overlay the multi-cycle drift findings on
                Kerala's community geography to see whether shifts
                cluster in particular belts. The drift data is
                statistically computed (see{" "}
                <Link to="/drifts" className="underline-offset-2 hover:underline">
                  /drifts
                </Link>
                ); the belt overlay is qualitative interpretation.
                Together they suggest hypotheses, not conclusions.
              </p>
            </div>
          </details>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function BeltLegend() {
  return (
    <ul className="space-y-2 text-sm">
      {belts.map((b) => (
        <li
          key={b.id}
          className="flex items-start gap-2 rounded-md border bg-card/30 p-2"
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
        </li>
      ))}
    </ul>
  )
}
