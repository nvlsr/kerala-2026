import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { IconInfoCircle } from "@tabler/icons-react"

import { BeltOverlaySection } from "@/components/belt-overlay-section"
import { DriftsTeaser } from "@/components/drifts-teaser"
import { SingleCyclePatternSection } from "@/components/flow-pattern-section"
import { SiteFooter } from "@/components/site-footer"
import { StateFlowSankey } from "@/components/state-flow-sankey"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  getSingleCycleFlows,
  singleCyclePatternKey,
  singleCyclePatternLabel,
  type SeatFlow,
} from "@/lib/data/flows"

// Hand-written editorial framings for the single-cycle flow × belt
// overlay. Only two patterns earn a framing — the others are either
// too small, too diffuse, or have district-level belt labels that
// mislead at AC level (see SECTION_INTRO below for why).
const SINGLE_CYCLE_BELT_FRAMINGS: Record<string, string> = {
  LDF_to_UDF:
    "Half the pattern — 24 of 48 seats — sits in the two northern belts (Malappuram, Kasaragod, Kannur, Kozhikode). The Muslim community, which had voted LDF more heavily than usual in 2021, returned to UDF/IUML in 2026 — a textbook anti-incumbency consolidation. The non-northern half spreads across central and southern belts and reads as the broader anti-LDF wave. Mainstream post-result analysis frames the 2026 swing as a minority-vote consolidation against the CPI(M)-led LDF; this northern concentration is the dominant geographic signature of that consolidation.",
  "LDF+NDA_to_UDF":
    "The most concentrated single-cycle belt pattern in the entire dataset: 12 of 21 seats sit in central-syromalabar (Thrissur + Ernakulam Catholic country) — Thrissur, Eranakulam, Thrikkakara, Muvattupuzha, Kothamangalam, Perumbavoor, Vypen, Irinjalakuda, Pudukkad, Kunnamkulam, Kunnathunad, Kodungallur. UDF gained at the expense of both LDF and NDA in these seats — the Christian community consolidated decisively with UDF, pulling votes from both fronts simultaneously. Several converging drivers in mainstream reporting: diocesan bishops in Kanjirappally, Thrissur, and Pala publicly campaigned for UDF; Catholic newspaper Deepika ran a pro-Congress line; the FCRA amendment was named as the trigger nudging Christian voters who had drifted toward BJP back into UDF; and Kerala Congress (M)'s LDF affiliation since 2020 backfired — all 12 KC(M) candidates lost in 2026, including chairman Jose K. Mani at Pala. KCBC institutionally kept its standard neutral line; the visible pro-UDF push came from individual dioceses, not the Bishops' Conference as a body.",
}

const SINGLE_CYCLE_CROSS_PATTERN_OBSERVATION =
  "Two community-keyed consolidations against LDF drove most of 2026's single-cycle movement: Muslim voters returned to UDF (24 of the 48-seat LDF→UDF pattern), and Christian voters consolidated with UDF (12 of the 21-seat LDF+NDA→UDF pattern). Together those two community blocs account for 36 of 85 classified flow seats — over 40% of all 2026 flow movement is explained by community-keyed consolidation against the incumbent. The remainder is the broader anti-incumbency wave plus seat-specific candidate effects. Worth noting separately: NDA's three actual wins in 2026 — Nemom, Kazhakoottam (both Trivandrum), and Chathannoor (Kollam) — sit in southern Hindu-Nair / Hindu-Ezhava terrain. Only Chathannoor passes the LDF→NDA single-cycle threshold cleanly; Nemom and Kazhakoottam don't classify as flows because UDF and NDA both gained while LDF dropped (a three-way share movement the binary classification doesn't catch). For the structural Hindu-belt rise of NDA in southern Kerala, the multi-cycle /drifts page is the right lens."

const SINGLE_CYCLE_BELT_SECTION_INTRO =
  "Of the five single-cycle flow patterns, two have clear community-keyed belt geography. The other three are skipped: NDA→UDF (n=1, only Kochi) is too small; LDF+UDF→NDA (n=6) is scattered across five belts with no concentration; LDF→NDA (n=9) has district-level belt labels that mislead at AC granularity — four seats fall under 'central-syromalabar' by district but at AC level are Hindu-temple (Guruvayoor), SC-reserved (Chelakkara, Devikulam), or mixed-coastal (Kaipamangalam) seats, not actually Catholic. Forcing belt analysis on those would produce a misleading 'Christian shift to NDA' framing that the AC-level demographics don't support. The two patterns covered below are where the data and the belt taxonomy genuinely line up."

// Patterns whose belt geography earns a per-pattern framing block.
// Other classified patterns (NDA→UDF, LDF+UDF→NDA, LDF→NDA) are
// deliberately excluded — see SECTION_INTRO above.
const BELT_SECTION_PATTERN_KEYS = new Set(["LDF_to_UDF", "LDF+NDA_to_UDF"])

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

export function FlowsPage() {
  const single = useMemo(() => getSingleCycleFlows(), [])

  const singleGroups = useMemo(
    () =>
      groupBy<SeatFlow, string>(
        single,
        (f) => singleCyclePatternKey(f.flow),
        (f) => singleCyclePatternLabel(f.flow)
      ),
    [single]
  )

  // Browsers compute :target before React mounts the cards on initial load,
  // so the native scroll lands nowhere. Re-set the hash after the first paint
  // to trigger :target and produce the correct scroll. Same trick the
  // /insights page uses.
  useEffect(() => {
    if (!window.location.hash) return
    const hash = window.location.hash
    const handle = requestAnimationFrame(() => {
      window.location.hash = ""
      window.location.hash = hash.slice(1)
    })
    return () => cancelAnimationFrame(handle)
  }, [])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header>
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-6">
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-foreground">
                Kerala 2026
              </Link>{" "}
              · Vote flows
            </p>
            <h1 className="font-heading flex items-center gap-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Where votes shifted
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
                      Seats grouped by alliance-level vote share movement.
                      The dashboard's tables show how a single party did;
                      this page shows how the three fronts moved against
                      each other — the cross-current the cards format can't
                      capture.
                    </p>
                    <p className="border-t pt-3 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Inferred, not observed.
                      </span>{" "}
                      We classify a seat by the net change in alliance vote
                      share between elections. A flow labelled "LDF → NDA"
                      could mean LDF voters chose NDA, <em>or</em> old LDF
                      voters stayed home while new NDA voters showed up —
                      both produce the same deltas. Read it as "alliance X
                      gained at alliance Y's expense", not "voters moved
                      from Y to X".
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="mb-12">
          <StateFlowSankey />
        </section>

        <section>
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              Single-cycle shifts (2021 → 2026)
            </h2>
            <span className="text-xs tracking-wide text-muted-foreground uppercase">
              {single.length} of 140 seats
            </span>
          </div>
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Seats where one alliance gained at least 5pp at another's expense
            in this election alone. The third alliance is roughly stable, or
            (for the "both → one" patterns) lost alongside the first.
          </p>
          <ul className="flex flex-col gap-6">
            {singleGroups.map((g) => (
              <li key={g.key}>
                <SingleCyclePatternSection
                  patternLabel={g.label}
                  patternId={`single-${g.key}`}
                  flows={g.items}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {SINGLE_CYCLE_BELT_SECTION_INTRO}
          </p>
          <BeltOverlaySection
            patternGroups={singleGroups
              .filter((g) => BELT_SECTION_PATTERN_KEYS.has(g.key))
              .map((g) => ({
                key: g.key,
                label: g.label,
                seats: g.items.map((f) => f.constituency),
              }))}
            framings={SINGLE_CYCLE_BELT_FRAMINGS}
            crossPatternObservation={SINGLE_CYCLE_CROSS_PATTERN_OBSERVATION}
            sectionTitle="By community belt — what each flow tells us about who moved"
            sectionDescription="The single-cycle flows where the geography lines up with Kerala's community-belt taxonomy. Two community blocs — Muslim and Christian — drove most of 2026's anti-LDF movement; the maps and per-pattern framings below trace where each consolidation happened."
          />
        </section>

        <section className="mt-12">
          <details className="rounded-lg border bg-card/40 p-6 text-sm">
            <summary className="cursor-pointer font-medium">
              Methodology &amp; thresholds
            </summary>
            <div className="mt-3 space-y-3 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  Single-cycle thresholds.
                </span>{" "}
                Two-way: biggest gainer ≥ +5pp, biggest loser ≤ −5pp, third
                alliance moved less than ±2pp. Both-to-one: gainer ≥ +5pp, both
                others lost ≥ 2pp each, combined drop within 3pp of the gain.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Per-cycle alliance attribution.
                </span>{" "}
                Each candidate carries their own per-cycle alliance — KC(M)
                is UDF in 2011/2016 and LDF from 2020 onwards, RSP is LDF in
                2011 and UDF from 2014, etc. Parties that switched fronts
                are correctly placed in each cycle's alliance, not anchored
                to today's.
              </p>
              <p>
                <span className="font-medium text-foreground">OTHER</span> can
                spike when an Independent or non-front candidate does well in
                a seat (e.g. Ottappalam). Treat seats with large OTHER swings
                cautiously — the alliance-flow story may not be the main
                event.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Community-belt overlay.
                </span>{" "}
                The "By community belt" section above applies a 9-belt
                qualitative taxonomy (academic literature: Zachariah 2003,
                GeoCurrents 2014, KCBC diocese geography) at district
                level. Hand-written framings carry interpretation;
                numeric breakdowns per pattern are data-derived. Three
                of the five flow patterns are excluded from belt
                framing — see the section intro for why. The full belt
                taxonomy reference lives at{" "}
                <Link
                  to="/belts"
                  className="underline-offset-2 hover:underline"
                >
                  /belts
                </Link>
                ; raw assignments at{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/data/community-belts.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  data/community-belts.json
                </a>
                .
              </p>
              <p>
                The full methodology document (with caveats and validation
                cases) lives at{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/docs/vote-flows.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  docs/vote-flows.md
                </a>
                .
              </p>
            </div>
          </details>
        </section>
      </main>

      <DriftsTeaser />
      <SiteFooter />
    </div>
  )
}
