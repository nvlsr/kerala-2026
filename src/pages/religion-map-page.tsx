import { useState } from "react"
import { Link } from "react-router-dom"

import { MethodologyDisclosure } from "@/components/methodology-disclosure"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import {
  ReligionGradientMap,
  type GradientLevel,
  type GradientYear,
} from "@/components/religion-gradient-map"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import casteData from "@data/hindu-caste-by-district.json"
import districtPaths from "@data/kerala-districts-paths.json"
import { acDemo2025Meta, acDemoMeta, demoMeta, districtsMeta } from "@/lib/data/loaders"
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

type CasteCode = "nair" | "ezhava"
const CASTES_TO_SHOW: Array<{
  code: CasteCode
  label: string
  color: string
}> = [
  { code: "nair", label: "Nair", color: "#0EA5E9" },
  { code: "ezhava", label: "Ezhava", color: "#F97316" },
]

/**
 * Compute per-district caste share AS PERCENT OF TOTAL POPULATION
 * (the source data from Zachariah 2003 reports caste as % of HINDU
 * population). For each district: caste% × hindu% / 100.
 */
const CASTE_DISTRICT_VALUES: Record<CasteCode, Record<string, number>> = {
  nair: {},
  ezhava: {},
}
for (const [distId, data] of Object.entries(
  casteData.districts as Record<string, { nair?: number; ezhava?: number }>
)) {
  const hinduShare = demoMeta.districts[distId]?.religions?.hindu ?? 0
  for (const code of ["nair", "ezhava"] as CasteCode[]) {
    const sub = data[code]
    if (sub != null) {
      CASTE_DISTRICT_VALUES[code][distId] = (sub * hinduShare) / 100
    }
  }
}

/**
 * Each AC inherits its district's caste share (caste data is district-
 * level only — Zachariah 2003's KSI 2000 survey doesn't go finer).
 * Subject to ecological-fallacy caveats; see docs/caste-data.md.
 */
const CASTE_AC_VALUES: Record<CasteCode, Record<string, number>> = {
  nair: {},
  ezhava: {},
}
for (const [acStr, distId] of Object.entries(
  districtsMeta.constituencyToDistrict
)) {
  for (const code of ["nair", "ezhava"] as CasteCode[]) {
    const v = CASTE_DISTRICT_VALUES[code][distId]
    if (v != null) CASTE_AC_VALUES[code][acStr] = v
  }
}

export function ReligionMapPage() {
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(
    null
  )
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null)
  const [level, setLevel] = useState<GradientLevel>("ac")
  const [year, setYear] = useState<GradientYear>(2011)

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
          <div className="mb-4 flex flex-wrap justify-end gap-2">
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
            {level === "ac" && (
              <ToggleGroup
                value={[String(year)]}
                onValueChange={(v) => {
                  const next = v[0] === "2025" ? 2025 : 2011
                  setYear(next as GradientYear)
                }}
                variant="outline"
                size="sm"
                spacing={2}
                aria-label="Year"
              >
                <ToggleGroupItem value="2011" className="rounded-full">
                  2011
                </ToggleGroupItem>
                <ToggleGroupItem value="2025" className="rounded-full">
                  2025 est.
                </ToggleGroupItem>
              </ToggleGroup>
            )}
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
                  year={year}
                  hoveredDistrictId={hoveredDistrictId}
                  onDistrictHover={setHoveredDistrictId}
                  hoveredSeat={hoveredSeat}
                  onAcHover={setHoveredSeat}
                  zoomable
                  ariaLabel={`Kerala ${level === "ac" ? "constituencies" : "districts"} shaded by ${r.label} percentage of population (${year === 2025 ? "2025 estimate" : "2011 census"})`}
                />
                <ReligionMapCaption
                  religion={r.code}
                  level={level}
                  year={year}
                  hoveredDistrictId={hoveredDistrictId}
                  hoveredSeat={hoveredSeat}
                />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <header className="mb-3">
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              Hindu sub-communities (district-level only)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Source: Zachariah, Mathew &amp; Rajan (2003) — Kerala
              Statistical Institute household survey, 2000. District
              data only; every AC in a district shares the same shade.
              See{" "}
              <a
                href="https://github.com/nvlsr/kerala-2026/blob/main/docs/caste-data.md"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                docs/caste-data.md
              </a>
              .
            </p>
          </header>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {CASTES_TO_SHOW.map((c) => (
              <li
                key={c.code}
                className="rounded-lg border bg-card/40 p-4 sm:p-5"
              >
                <header className="mb-2 flex items-baseline justify-between gap-2">
                  <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
                    {c.label}
                  </h3>
                  <span
                    className="inline-flex h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color }}
                    aria-hidden
                  />
                </header>
                <ReligionGradientMap
                  religion="hindu"
                  baseColor={c.color}
                  level="district"
                  hoveredDistrictId={hoveredDistrictId}
                  onDistrictHover={setHoveredDistrictId}
                  zoomable
                  acValuesOverride={CASTE_AC_VALUES[c.code]}
                  districtValuesOverride={CASTE_DISTRICT_VALUES[c.code]}
                  ariaLabel={`Kerala districts shaded by ${c.label} percentage of total population`}
                />
                <CasteMapCaption
                  caste={c.code}
                  hoveredDistrictId={hoveredDistrictId}
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
  year,
  hoveredDistrictId,
  hoveredSeat,
}: {
  religion: ReligionCode
  level: GradientLevel
  year: GradientYear
  hoveredDistrictId: string | null
  hoveredSeat: number | null
}) {
  // AC mode + hovered seat: show that AC's specific religion share
  if (level === "ac" && hoveredSeat != null) {
    const ac = getReligionForAC(hoveredSeat, year)
    const seatMeta = constituencies.find((c) => c.constituencyNumber === hoveredSeat)
    const acDemo =
      year === 2025
        ? acDemo2025Meta.constituencies[String(hoveredSeat)]
        : acDemoMeta.constituencies[String(hoveredSeat)]
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
    const data =
      year === 2025
        ? acDemo2025Meta.constituencies
        : acDemoMeta.constituencies
    const entries = Object.entries(data).map(([num, c]) => ({
      seat: Number(num),
      name:
        constituencies.find((x) => x.constituencyNumber === Number(num))
          ?.constituencyName ?? `AC ${num}`,
      pct: c.religions[religion] ?? 0,
    }))
    entries.sort((a, b) => b.pct - a.pct)
    const top = entries[0]
    if (!top) return null
    return (
      <p className="mt-2 text-xs text-muted-foreground">
        Highest share:{" "}
        <span className="font-medium text-foreground">{top.name}</span>{" "}
        at {top.pct.toFixed(1)}%
        {year === 2025 && " (est.)"}
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


function CasteMapCaption({
  caste,
  hoveredDistrictId,
}: {
  caste: CasteCode
  hoveredDistrictId: string | null
}) {
  const label = caste === "nair" ? "Nair" : "Ezhava"

  if (hoveredDistrictId) {
    const pct = CASTE_DISTRICT_VALUES[caste][hoveredDistrictId]
    if (pct == null) return null
    const name =
      districtPaths.districts.find((p) => p.id === hoveredDistrictId)?.name ??
      hoveredDistrictId
    return (
      <p className="mt-2 text-xs">
        <span className="font-medium text-foreground">{name}</span>:{" "}
        <span className="tabular-nums">{pct.toFixed(1)}%</span>{" "}
        <span className="text-muted-foreground">{label}</span>
      </p>
    )
  }

  // Default: highest district
  const entries = Object.entries(CASTE_DISTRICT_VALUES[caste]).map(
    ([id, pct]) => ({
      id,
      name: districtPaths.districts.find((p) => p.id === id)?.name ?? id,
      pct,
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
