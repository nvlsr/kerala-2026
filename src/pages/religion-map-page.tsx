import { useState } from "react"
import { Link } from "react-router-dom"
import { IconInfoCircle } from "@tabler/icons-react"

import { ReligionGradientMap } from "@/components/religion-gradient-map"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import districtPaths from "@data/kerala-districts-paths.json"
import { demoMeta } from "@/lib/data/loaders"
import { getReligion, type ReligionCode } from "@/lib/data/demographics"

const RELIGIONS_TO_SHOW: Array<{
  code: ReligionCode
  label: string
  voteBank: string
}> = [
  {
    code: "hindu",
    label: "Hindu",
    voteBank:
      "Hindu majority across most districts (>55% statewide). Necessary but not sufficient for NDA wins — Hindu sub-community variation (Ezhava, Nair, SC, ST) drives the politics within these districts. See /belts for that disaggregation.",
  },
  {
    code: "muslim",
    label: "Muslim",
    voteBank:
      "Concentrated in Malappuram (~70%), Kasaragod and Kozhikode (~30% each). The structural geography of IUML's strength — Malappuram alone carried much of the 2026 LDF→UDF Muslim consolidation visible on /flows.",
  },
  {
    code: "christian",
    label: "Christian",
    voteBank:
      "Heaviest in Kottayam, Pathanamthitta, Idukki, Ernakulam (35-45%). The historical base of Kerala Congress parties and of the central-Kerala Catholic political tradition. The 2026 LDF+NDA→UDF Christian consolidation visible on /flows lives here.",
  },
]

export function ReligionMapPage() {
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(
    null
  )

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header>
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-6">
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-foreground">
                Kerala 2026
              </Link>{" "}
              · Religion map
            </p>
            <h1 className="font-heading flex items-center gap-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Where each religion lives
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
                      Kerala's three big religion groups, each shaded
                      district-by-district by 2011 census share. A
                      reference page for the structural geography of
                      each community's vote bank — useful for reading
                      the alliance flows on{" "}
                      <Link
                        to="/flows"
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        /flows
                      </Link>{" "}
                      and the multi-cycle drifts on{" "}
                      <Link
                        to="/drifts"
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        /drifts
                      </Link>
                      .
                    </p>
                    <p className="border-t pt-3 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Structural, not behavioural.
                      </span>{" "}
                      The map shows where each religion's population
                      lives. It does not show how they vote — religion
                      and vote choice correlate but aren't identical.
                      Census 2011 is the most recent; differential
                      fertility since has shifted shares modestly.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Hover any district to see its full breakdown. The
              Christian and Muslim concentrations are tighter than the
              statewide averages suggest — most of Malappuram is
              ~70% Muslim while most other districts are under 30%;
              Kottayam and Pathanamthitta lead the Christian map at
              35-45% while northern districts barely register.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-8">
        <section>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {RELIGIONS_TO_SHOW.map((r) => (
              <li
                key={r.code}
                className="rounded-lg border bg-card/40 p-4 sm:p-5"
              >
                <header className="mb-2 flex items-baseline justify-between gap-2">
                  <h2 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
                    {r.label}
                  </h2>
                  <span
                    className="inline-flex h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: getReligion(r.code).color }}
                    aria-hidden
                  />
                </header>
                <ReligionGradientMap
                  religion={r.code}
                  baseColor={getReligion(r.code).color}
                  hoveredDistrictId={hoveredDistrictId}
                  onDistrictHover={setHoveredDistrictId}
                  ariaLabel={`Kerala districts shaded by ${r.label} percentage of population`}
                />
                <ReligionMapCaption
                  religion={r.code}
                  hoveredDistrictId={hoveredDistrictId}
                />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            What this tells you about Kerala's vote banks
          </h2>
          <p className="mt-1 mb-4 max-w-2xl text-sm text-muted-foreground">
            The structural floor and ceiling of each alliance's
            community base, made visible. None of these maps predicts
            how a specific seat votes — they show the demographic
            terrain on which Kerala's politics happens.
          </p>
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {RELIGIONS_TO_SHOW.map((r) => (
              <li
                key={r.code}
                className="rounded-lg border bg-card/30 p-4 text-sm leading-relaxed"
              >
                <h3 className="mb-1 flex items-center gap-2 font-heading text-sm font-semibold tracking-tight">
                  <span
                    className="inline-block h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: getReligion(r.code).color }}
                    aria-hidden
                  />
                  {r.label}
                </h3>
                <p className="text-muted-foreground">{r.voteBank}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <details className="rounded-lg border bg-card/40 p-6 text-sm">
            <summary className="cursor-pointer font-medium">
              Methodology &amp; caveats
            </summary>
            <div className="mt-3 space-y-3 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  Data source.
                </span>{" "}
                2011 Census of India — district-level religion shares.
                Loaded from{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/data/demographics.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  data/demographics.json
                </a>
                .
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Granularity is district, not assembly constituency.
                </span>{" "}
                The public Census doesn't publish religion at AC level
                in any single accessible file (sub-district / tehsil
                level exists but doesn't cleanly aggregate to AC
                boundaries without a GIS pass). Within a district, all
                ACs share the same gradient shading on this page —
                that's a real limitation, not a rendering choice. AC-
                level religion variation within a district is unknown
                from this data.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Differential fertility since 2011.
                </span>{" "}
                The Muslim share is likely modestly higher today than
                shown; Hindu and Christian shares are likely modestly
                lower. The shape of the map (which districts have the
                concentration) is unchanged; the absolute numbers in
                tooltips are 15-year-old snapshots.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Religion ≠ vote choice.
                </span>{" "}
                This is structural geography. Religion correlates with
                voting in Kerala in known ways (Muslim → IUML/UDF;
                Catholic → historically UDF; Hindu sub-communities vary
                widely) but the correlation is partial. People in
                Malappuram still vote — IUML's dominance is one of
                several explanations, not the explanation.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Sub-community blindness.
                </span>{" "}
                Religion at this granularity cannot distinguish Hindu
                Ezhava from Hindu Nair, or Syro-Malabar Catholic from
                Marthoma Christian. For drift analysis where those
                distinctions matter, see{" "}
                <Link
                  to="/belts"
                  className="underline-offset-2 hover:underline"
                >
                  /belts
                </Link>
                {" "}— a qualitative belt taxonomy that maps
                sub-community geography from academic literature.
              </p>
            </div>
          </details>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function ReligionMapCaption({
  religion,
  hoveredDistrictId,
}: {
  religion: ReligionCode
  hoveredDistrictId: string | null
}) {
  if (!hoveredDistrictId) {
    // Default: show the highest-share district as the orientation anchor
    const entries = Object.entries(demoMeta.districts).map(([id, d]) => ({
      id,
      name: districtPaths.districts.find((p) => p.id === id)?.name ?? id,
      pct: d.religions[religion],
    }))
    entries.sort((a, b) => b.pct - a.pct)
    const top = entries[0]
    if (!top) return null
    return (
      <p className="mt-2 text-xs text-muted-foreground">
        Highest share: <span className="font-medium text-foreground">{top.name}</span>{" "}
        at {top.pct.toFixed(1)}%
      </p>
    )
  }
  const d = demoMeta.districts[hoveredDistrictId]
  if (!d) return null
  const name =
    districtPaths.districts.find((p) => p.id === hoveredDistrictId)?.name ??
    hoveredDistrictId
  return (
    <p className="mt-2 text-xs">
      <span className="font-medium text-foreground">{name}</span>:{" "}
      <span className="tabular-nums">{d.religions[religion].toFixed(1)}%</span>{" "}
      <span className="text-muted-foreground">{getReligion(religion).label}</span>
    </p>
  )
}
