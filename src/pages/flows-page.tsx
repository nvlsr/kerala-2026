import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"

import { DriftsTeaser } from "@/components/drifts-teaser"
import { SingleCyclePatternSection } from "@/components/flow-pattern-section"
import { PageShell } from "@/components/page-shell"
import { ReligionOverlaySection } from "@/components/religion-overlay-section"
import { StateFlowSankey } from "@/components/state-flow-sankey"
import { TOTAL_SEATS } from "@/lib/constants"
import {
  getSingleCycleFlows,
  singleCyclePatternKey,
  singleCyclePatternLabel,
  type SeatFlow,
} from "@/lib/data/flows"

// Hand-written editorial framings for the single-cycle flow × religion
// overlay. Only two patterns earn a framing — the others are either too
// small, too scattered, or land in seats whose district-religion mix
// doesn't share a coherent religion-level story (see SECTION_INTRO).
const SINGLE_CYCLE_RELIGION_FRAMINGS: Record<string, string> = {
  LDF_to_UDF:
    "Muslim voters who'd voted LDF more heavily in 2021 returned to UDF/IUML in 2026 — a textbook anti-incumbency consolidation. The deepest greens on the Muslim gradient (Malappuram + the northern districts) carry roughly half of this 48-seat pattern; the non-northern half reads as the broader anti-LDF wave that lifted UDF everywhere. Mainstream post-result analysis (The Federal, The Week, Onmanorama) frames the 2026 swing as a minority-vote consolidation against the CPI(M)-led LDF — the geography lines up with that framing precisely.",
  "LDF+NDA_to_UDF":
    "The most concentrated single-cycle pattern in the entire dataset. UDF gained at the expense of both LDF and NDA in 21 seats, with 12 clustered tightly in Thrissur and Ernakulam — Kerala's central Catholic-heavy districts. The Christian community consolidated decisively with UDF in 2026, pulling votes from both fronts simultaneously. Several converging drivers in mainstream reporting: diocesan bishops in Kanjirappally, Thrissur, and Pala publicly campaigned for UDF; Catholic newspaper Deepika ran a pro-Congress line; the FCRA amendment was named as the trigger nudging Christian voters who had drifted toward BJP back into UDF; and Kerala Congress (M)'s LDF affiliation since 2020 backfired — all 12 KC(M) candidates lost in 2026, including chairman Jose K. Mani at Pala. KCBC institutionally kept its standard neutral line; the visible pro-UDF push came from individual dioceses, not the Bishops' Conference as a body. The remaining 9 of 21 seats are smaller clusters in southern-Ezhava (Kollam), northern-mixed (Kasaragod/Kannur), and coastal Alappuzha — broader-than-Catholic Christian-influenced consolidation.",
}

const SINGLE_CYCLE_CROSS_PATTERN_OBSERVATION =
  "Two religion-keyed consolidations against LDF drove most of 2026's single-cycle movement: Muslim voters returned to UDF (driving most of the 48-seat LDF→UDF pattern in the northern districts where Muslim share is highest), and Christian voters consolidated with UDF (driving most of the 21-seat LDF+NDA→UDF pattern in the central districts where Christian share is highest). Together those two religion-keyed blocs account for over 40% of all 2026 flow movement. The remainder is the broader anti-incumbency wave plus seat-specific candidate effects. NDA's three actual 2026 wins (Nemom, Kazhakoottam, Chathannoor — all in southern Hindu-majority districts) sit on the Hindu-saffron background of all three maps, but only Chathannoor passes the LDF→NDA single-cycle classifier cleanly; Nemom and Kazhakoottam are three-way share movements the binary classifier doesn't catch. For the structural Hindu-sub-community rise of NDA, the multi-cycle /drifts page is the right lens — those wins are the latest dot on a 15-year arc."

const SINGLE_CYCLE_RELIGION_SECTION_INTRO =
  "Of the five single-cycle flow patterns, two have geography that lines up with one of Kerala's religion-share gradients. The other three are skipped from this section: NDA→UDF (n=1, only Kochi) is too small; LDF+UDF→NDA (n=6) is scattered across districts with no religion concentration; LDF→NDA (n=9) classifies seats where NDA's vote share grew but the underlying seats span Hindu-temple, SC-reserved, and mixed-coastal districts that don't share a religion-keyed story. Forcing a religion lens on those three would be misleading. The two patterns covered below are where the geography and a single religion's gradient genuinely align."

// Patterns whose geography earns a per-pattern religion-overlay block.
// Other classified patterns (NDA→UDF, LDF+UDF→NDA, LDF→NDA) are
// deliberately excluded — see SECTION_INTRO above.
const RELIGION_SECTION_PATTERN_KEYS = new Set([
  "LDF_to_UDF",
  "LDF+NDA_to_UDF",
])

// Map of which religion's gradient explains each pattern.
const PATTERN_RELIGION: Record<string, "hindu" | "muslim" | "christian"> = {
  LDF_to_UDF: "muslim",
  "LDF+NDA_to_UDF": "christian",
}

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
  // /questions page uses.
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
    <PageShell
      breadcrumb="Vote flows"
      title="Where votes shifted"
      aboutContent={
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            Seats grouped by alliance-level vote share movement. The
            dashboard's tables show how a single party did; this page
            shows how the three fronts moved against each other — the
            cross-current the cards format can't capture.
          </p>
          <p className="border-t pt-3 text-muted-foreground">
            <span className="font-medium text-foreground">
              Inferred, not observed.
            </span>{" "}
            We classify a seat by the net change in alliance vote share
            between elections. A flow labelled "LDF → NDA" could mean
            LDF voters chose NDA, <em>or</em> old LDF voters stayed home
            while new NDA voters showed up — both produce the same
            deltas. Read it as "alliance X gained at alliance Y's
            expense", not "voters moved from Y to X".
          </p>
        </div>
      }
    >
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
              {single.length} of {TOTAL_SEATS} seats
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
            {SINGLE_CYCLE_RELIGION_SECTION_INTRO}
          </p>
          <ReligionOverlaySection
            patternGroups={singleGroups
              .filter((g) => RELIGION_SECTION_PATTERN_KEYS.has(g.key))
              .map((g) => ({
                key: g.key,
                label: g.label,
                seats: g.items.map((f) => f.constituency),
                religion: PATTERN_RELIGION[g.key]!,
              }))}
            framings={SINGLE_CYCLE_RELIGION_FRAMINGS}
            crossPatternObservation={SINGLE_CYCLE_CROSS_PATTERN_OBSERVATION}
            sectionTitle="By religion — what each flow tells us about who moved"
            sectionDescription="The single-cycle flows where the geography lines up with one of Kerala's religion-share gradients. Two religion blocs — Muslim and Christian — drove most of 2026's anti-LDF movement; the maps below show each pattern's seats outlined on top of the relevant religion's district-by-district gradient."
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
                  Religion-gradient overlay.
                </span>{" "}
                The "By religion" section above applies district-level
                religion shares (2011 census) as a colour gradient
                under each flow pattern's outlined seats. Religion is
                the right lens for single-cycle flows because the
                conclusions (Muslim consolidation, Christian
                consolidation) operate at religion-level, not at
                sub-community level — Kerala's tactical anti-incumbency
                consolidations move whole religious blocs, not specific
                Hindu sub-communities. For the multi-cycle structural
                drifts where sub-community matters (Ezhava vs Nair,
                Syro-Malabar vs Marthoma), see the community-belt
                analysis on{" "}
                <Link
                  to="/drifts"
                  className="underline-offset-2 hover:underline"
                >
                  /drifts
                </Link>
                . The bare religion-map reference is at{" "}
                <Link
                  to="/religion-map"
                  className="underline-offset-2 hover:underline"
                >
                  /religion-map
                </Link>
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
    </PageShell>
  )
}
