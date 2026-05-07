import { useState } from "react"
import { Link } from "react-router-dom"

import { MethodologyDisclosure } from "@/components/methodology-disclosure"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import {
  ReligionGradientMap,
  type GradientLevel,
} from "@/components/religion-gradient-map"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import districtPaths from "@data/kerala-districts-paths.json"
import { acDemoMeta, demoMeta } from "@/lib/data/loaders"
import {
  getReligionForAC,
  getReligion,
  type ReligionCode,
} from "@/lib/data/demographics"
import { constituencies } from "@/lib/data"

const RELIGIONS_TO_SHOW: Array<{
  code: ReligionCode
  label: string
}> = [
  { code: "hindu", label: "Hindu" },
  { code: "muslim", label: "Muslim" },
  { code: "christian", label: "Christian" },
]

export function ReligionMapPage() {
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(
    null
  )
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null)
  const [level, setLevel] = useState<GradientLevel>("ac")

  return (
    <PageShell
      breadcrumbs={[{ label: "Religion map" }]}
      title="Where each religion lives"
      aboutContent={
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            Kerala's three big religion groups, each shaded
            district-by-district by 2011 census share. A reference page
            for the structural geography of each community's vote bank
            — useful for reading the alliance flows on{" "}
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
            The map shows where each religion's population lives. It
            does not show how they vote — religion and vote choice
            correlate but aren't identical. Census 2011 is the most
            recent; differential fertility since has shifted shares
            modestly.
          </p>
        </div>
      }
    >
      <PageMain className="space-y-12">
        <section>
          <div className="mb-4 flex justify-end">
            <ToggleGroup
              value={[level]}
              onValueChange={(v) => {
                const next = (v[0] as GradientLevel | undefined) ?? "ac"
                setLevel(next)
              }}
              variant="outline"
              size="sm"
              spacing={2}
              aria-label="Map granularity"
            >
              <ToggleGroupItem value="district" className="rounded-full">
                By district
              </ToggleGroupItem>
              <ToggleGroupItem value="ac" className="rounded-full">
                By AC
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
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
                  level={level}
                  hoveredDistrictId={hoveredDistrictId}
                  onDistrictHover={setHoveredDistrictId}
                  hoveredSeat={hoveredSeat}
                  onAcHover={setHoveredSeat}
                  zoomable
                  ariaLabel={`Kerala ${level === "ac" ? "constituencies" : "districts"} shaded by ${r.label} percentage of population`}
                />
                <ReligionMapCaption
                  religion={r.code}
                  level={level}
                  hoveredDistrictId={hoveredDistrictId}
                  hoveredSeat={hoveredSeat}
                />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <MethodologyDisclosure title="Methodology & caveats">
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
          </MethodologyDisclosure>
        </section>
      </PageMain>
    </PageShell>
  )
}

function ReligionMapCaption({
  religion,
  level,
  hoveredDistrictId,
  hoveredSeat,
}: {
  religion: ReligionCode
  level: GradientLevel
  hoveredDistrictId: string | null
  hoveredSeat: number | null
}) {
  // AC mode + hovered seat: show that AC's specific religion share
  if (level === "ac" && hoveredSeat != null) {
    const ac = getReligionForAC(hoveredSeat)
    const seatMeta = constituencies.find((c) => c.constituencyNumber === hoveredSeat)
    const acDemo = acDemoMeta.constituencies[String(hoveredSeat)]
    const isFallback = acDemo?.source === "district-urban-fallback"
    if (ac && seatMeta) {
      return (
        <p className="mt-2 text-xs">
          <span className="font-medium text-foreground">
            {seatMeta.constituencyName}
          </span>
          :{" "}
          <span className="tabular-nums">
            {ac.religions[religion].toFixed(1)}%
          </span>{" "}
          <span className="text-muted-foreground">
            {getReligion(religion).label}
            {isFallback && " (district-urban fallback)"}
          </span>
        </p>
      )
    }
  }

  // District mode + hovered district, OR AC mode falling back to district highlight:
  if (hoveredDistrictId) {
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

  // Default: show the highest-share district/AC as the orientation anchor
  if (level === "ac") {
    const entries = Object.entries(acDemoMeta.constituencies).map(
      ([num, c]) => ({
        seat: Number(num),
        name:
          constituencies.find((x) => x.constituencyNumber === Number(num))
            ?.constituencyName ?? `AC ${num}`,
        pct: c.religions[religion] ?? 0,
      })
    )
    entries.sort((a, b) => b.pct - a.pct)
    const top = entries[0]
    if (!top) return null
    return (
      <p className="mt-2 text-xs text-muted-foreground">
        Highest share:{" "}
        <span className="font-medium text-foreground">{top.name}</span>{" "}
        at {top.pct.toFixed(1)}%
      </p>
    )
  }
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
