import { useState } from "react"
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
import { belts } from "@/lib/data/belts"
import { cn } from "@/lib/utils"

/**
 * Belt taxonomy reference. Just the 9-belt geography of Kerala —
 * map, legend, methodology, no analytical interpretation.
 *
 * The per-pattern overlay analysis (which drifts sit in which belts)
 * lives on `/drifts` via the `<BeltOverlaySection>` component. This
 * page is the standalone reference: deep-link target for anyone who
 * wants to study the taxonomy itself, exploration tool via the
 * click-to-highlight legend.
 */
export function BeltsPage() {
  const [selectedBeltId, setSelectedBeltId] = useState<string | null>(null)

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
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
                      Reference page: just the taxonomy.
                    </p>
                    <p className="border-t pt-3 text-muted-foreground">
                      The per-pattern overlay analysis (which drifts
                      sit in which belts) lives on{" "}
                      <Link
                        to="/drifts"
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        /drifts
                      </Link>{" "}
                      under the "By community belt" section.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Nine belts assigned to Kerala's 14 districts. Click any
              card on the right to highlight just that belt on the map.
              For analytical interpretation overlaid on the multi-cycle
              drift findings, see the "By community belt" section on{" "}
              <Link
                to="/drifts"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                /drifts
              </Link>
              .
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-8">
        <section>
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
                  Caveats worth holding on to.
                </span>
              </p>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  Districts are administrative units; community
                  boundaries cross them. Within a belt, AC-level
                  variation is real and not yet captured here. Pass 2
                  will refine per-AC labels for the 41 multi-cycle
                  drift seats.
                </li>
                <li>
                  Author judgement shaped each label. Where two belts
                  could plausibly fit (e.g. Pathanamthitta is both
                  Reformed Christian and significantly Ezhava-Hindu),
                  the primary label may understate the secondary
                  presence.
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
                The drift overlay analysis (which patterns sit in which
                belts) lives on{" "}
                <Link
                  to="/drifts"
                  className="underline-offset-2 hover:underline"
                >
                  /drifts
                </Link>
                . The future religion-gradient page (planned, not
                built) is sketched in{" "}
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
