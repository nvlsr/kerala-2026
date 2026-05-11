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
import { ReligiousPOIsSection } from "@/components/religious-pois-section"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import casteData from "@data/hindu-caste-by-district.json"
import {
  acDemo2025Meta,
  acDemoMeta,
  demoMeta,
  districtsMeta,
} from "@/lib/data/loaders"
import {
  getReligionForAC,
  getReligion,
  type ReligionCode,
} from "@/lib/data/demographics"
import { constituencies, getReservation } from "@/lib/data"

const RELIGIONS_TO_SHOW: Array<{
  code: ReligionCode
  label: string
}> = [
  { code: "hindu", label: "Hindu" },
  { code: "muslim", label: "Muslim" },
  { code: "christian", label: "Christian" },
]

type CasteCode =
  | "nair"
  | "ezhava"
  | "brahmin"
  | "nadar"
  | "viswakarma"
  | "sc"
  | "st"
const CASTES_TO_SHOW: Array<{
  code: CasteCode
  label: string
  color: string
}> = [
  { code: "nair", label: "Nair", color: "#0EA5E9" },
  { code: "ezhava", label: "Ezhava", color: "#F97316" },
  { code: "brahmin", label: "Brahmin", color: "#EAB308" },
  { code: "nadar", label: "Nadar", color: "#DC2626" },
  { code: "viswakarma", label: "Viswakarma", color: "#A855F7" },
  { code: "sc", label: "SC", color: "#0891B2" },
  { code: "st", label: "ST", color: "#65A30D" },
]
const ALL_CASTE_CODES = CASTES_TO_SHOW.map((c) => c.code)

/**
 * Compute per-district caste share AS PERCENT OF TOTAL POPULATION
 * (the source data from Zachariah 2003 reports caste as % of HINDU
 * population). For each district: caste% × hindu% / 100.
 */
const CASTE_DISTRICT_VALUES: Record<CasteCode, Record<string, number>> = {
  nair: {},
  ezhava: {},
  brahmin: {},
  nadar: {},
  viswakarma: {},
  sc: {},
  st: {},
}
for (const [distId, data] of Object.entries(
  casteData.districts as Record<string, Record<string, number>>
)) {
  const hinduShare = demoMeta.districts[distId]?.religions?.hindu ?? 0
  for (const code of ALL_CASTE_CODES) {
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
  brahmin: {},
  nadar: {},
  viswakarma: {},
  sc: {},
  st: {},
}
for (const [acStr, distId] of Object.entries(
  districtsMeta.constituencyToDistrict
)) {
  for (const code of ALL_CASTE_CODES) {
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
  const [year, setYear] = useState<GradientYear>(2025)

  return (
    <PageShell
      breadcrumbs={[{ label: "Religion map" }]}
      title="Where each religion lives"
      aboutContent={
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            Kerala's three big religion groups, each shaded
            constituency-by-constituency. The default view uses a 2025 cohort
            projection of Census 2011 (toggle to 2011 raw if preferred — the
            geographic gradient is identical, only absolute shares drift). A
            reference page for the structural geography of each community's vote
            bank — useful for reading the alliance flows on{" "}
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
            The map shows where each religion's population lives. It does not
            show how they vote — religion and vote choice correlate but aren't
            identical. Census 2011 is the most recent; differential fertility
            since has shifted shares modestly.
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

        <ReligiousPOIsSection
          hoveredSeat={hoveredSeat}
          onAcHover={setHoveredSeat}
        />

        <section>
          <header className="mb-3">
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              Hindu sub-communities &amp; SC/ST (district-level only)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Source: Zachariah, Mathew &amp; Rajan (2003) — Kerala Statistical
              Institute household survey, 2000. District data only; every AC in
              a district shares the same shade. All shares shown as % of total
              district population. See{" "}
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
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                Religion — 2011 baseline.
              </span>{" "}
              Source: Census 2011 Table C-01 (religious community), at
              sub-district (Rural rows) and town (Urban rows) granularity.
              AC-level shading is built by joining each shrid&apos;s religion
              mix from C-01 to its assembly constituency via{" "}
              <a
                href="https://www.devdatalab.org/shrug"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                SHRUG
              </a>{" "}
              (post-2008 delimitation), weighted by shrid population and
              SHRUG&apos;s con08 fragment-weights. 114 of 140 ACs are aggregated
              at this resolution; 26 urban-heavy ACs fall back to district-Urban
              shares because their city corporations span multiple
              constituencies and Census doesn&apos;t publish ward-level data
              uniformly. State aggregate from this pipeline matches Census state
              totals within ~0.6pp on each religion. See{" "}
              <a
                href="https://github.com/nvlsr/kerala-2026/blob/main/docs/data-pipeline.md"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                docs/data-pipeline.md
              </a>{" "}
              for the full architecture and improvements roadmap.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Religion — 2025 projection.
              </span>{" "}
              State-level uniform cohort projection of the 2011 baseline: Hindu
              × 0.96, Muslim × 1.12, Christian × 0.97, renormalised per AC.
              Multipliers come from Kerala CRS births-by-religion (2011–2023) +
              crude death rate ~7/1000. The projection assumes Kerala&apos;s
              geographic religion gradient is unchanged from 2011 — only
              absolute shares drift. AC-specific fertility differentials (Muslim
              TFR is higher in already-Muslim-heavy areas) are NOT modelled.
              Because the multipliers are uniform statewide, rank order is
              preserved exactly: 2025 and 2011 produce essentially the same
              correlation analysis (Pearson r shifts by ≤0.01).
              <strong className="font-medium text-foreground">
                {" "}
                2025 is the recommended default for absolute-share claims and
                external cross-checks; 2011 remains available for verification.
              </strong>
            </p>
            <p>
              <span className="font-medium text-foreground">
                Hindu sub-communities (Nair, Ezhava).
              </span>{" "}
              Source: Zachariah, Mathew &amp; Rajan (2003),{" "}
              <em>Dynamics of Migration in Kerala</em> (Orient Longman), based
              on Kerala Statistical Institute household survey (last conducted
              2000). Provenance verified via the Wikipedia &quot;Demographics of
              Nair community&quot; article&apos;s cross-citation. ~25 years old,
              sample- based, district-level only. Within a district, every AC
              shares the same caste shade — same ecological-fallacy caveat as
              the district-level religion view. See{" "}
              <a
                href="https://github.com/nvlsr/kerala-2026/blob/main/docs/caste-data.md"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                docs/caste-data.md
              </a>{" "}
              for source notes;{" "}
              <a
                href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narratives/udf.md#5-caste-share-geography-district-level-exploratory"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                docs/narratives/udf.md §5 (caste-share geography)
              </a>{" "}
              for what the data implies for the 2026 swing.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Religion ≠ vote choice.
              </span>{" "}
              This is structural geography. Religion correlates with voting in
              Kerala in known ways (Muslim → IUML/UDF; Catholic → historically
              UDF; Hindu sub-communities vary widely) but the correlation is
              partial. People in Malappuram still vote — IUML&apos;s dominance
              is one of several explanations, not the explanation.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Christian + Muslim sub-rite — from OpenStreetMap.
              </span>{" "}
              Census doesn&apos;t disaggregate Christian denomination or Muslim
              sub-sect, so the section above is built from a different source:
              ~22,000 religious places-of-worship in OpenStreetMap (Overpass
              snapshot 2026-05-10), each classified by sub-rite via OSM tags,
              name-regex inference, and a hand-curated diocesan prior for
              generic-Catholic POIs. The aggregate lives at{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-[0.8em]">
                data/ac-religious-poi-inventory.json
              </code>
              ; pipeline detail in{" "}
              <a
                href="https://github.com/nvlsr/kerala-2026/blob/main/data/raw/osm/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                data/raw/osm/README.md
              </a>
              . The dataset has known limits: POI count is not population
              share (Hindu temples are smaller and more numerous per capita);
              ~33% of Christians and ~13% of Muslims have an explicit
              denomination tag (the rest is name-inferred or prior-based);
              EK-vs-AP Sunni and Hindu caste are not derivable. For
              qualitative sub-community boundaries derived from academic
              literature, see{" "}
              <Link to="/belts" className="underline-offset-2 hover:underline">
                /belts
              </Link>
              .
            </p>
            <p>
              <span className="font-medium text-foreground">
                Mechanism is ambiguous.
              </span>{" "}
              An AC&apos;s alliance Δ vs its religion mix correlates with vote
              outcome but doesn&apos;t prove the mechanism. A +X pp UDF gain in
              a Christian-heavy AC could be (a) Christians switching LDF→UDF,
              (b) Christian LDF voters staying home while UDF held, or (c)
              Christian non-voters mobilising for UDF. Distinguishing these
              requires survey microdata we don&apos;t have.
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
    const seatMeta = constituencies.find(
      (c) => c.constituencyNumber === hoveredSeat
    )
    const acDemo =
      year === 2025
        ? acDemo2025Meta.constituencies[String(hoveredSeat)]
        : acDemoMeta.constituencies[String(hoveredSeat)]
    const isFallback = acDemo?.source === "district-urban-fallback"
    const reservation = getReservation(hoveredSeat)
    if (ac && seatMeta) {
      return (
        <p className="mt-2 text-xs">
          <span className="font-medium text-foreground">
            {seatMeta.constituencyName}
          </span>
          {reservation && (
            <span className="text-muted-foreground"> ({reservation})</span>
          )}
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
      districtsMeta.districts.find((d) => d.id === hoveredDistrictId)?.name ??
      hoveredDistrictId
    return (
      <p className="mt-2 text-xs">
        <span className="font-medium text-foreground">{name}</span>:{" "}
        <span className="tabular-nums">
          {d.religions[religion].toFixed(1)}%
        </span>{" "}
        <span className="text-muted-foreground">
          {getReligion(religion).label}
        </span>
      </p>
    )
  }

  // Default: show the highest-share district/AC as the orientation anchor
  if (level === "ac") {
    const data =
      year === 2025 ? acDemo2025Meta.constituencies : acDemoMeta.constituencies
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
        <span className="font-medium text-foreground">{top.name}</span> at{" "}
        {top.pct.toFixed(1)}%{year === 2025 && " (est.)"}
      </p>
    )
  }
  const entries = Object.entries(demoMeta.districts).map(([id, d]) => ({
    id,
    name: districtsMeta.districts.find((d) => d.id === id)?.name ?? id,
    pct: d.religions[religion],
  }))
  entries.sort((a, b) => b.pct - a.pct)
  const top = entries[0]
  if (!top) return null
  return (
    <p className="mt-2 text-xs text-muted-foreground">
      Highest share:{" "}
      <span className="font-medium text-foreground">{top.name}</span> at{" "}
      {top.pct.toFixed(1)}%
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
  const label = CASTES_TO_SHOW.find((c) => c.code === caste)?.label ?? caste

  if (hoveredDistrictId) {
    const pct = CASTE_DISTRICT_VALUES[caste][hoveredDistrictId]
    if (pct == null) return null
    const name =
      districtsMeta.districts.find((d) => d.id === hoveredDistrictId)?.name ??
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
      name: districtsMeta.districts.find((d) => d.id === id)?.name ?? id,
      pct,
    })
  )
  entries.sort((a, b) => b.pct - a.pct)
  const top = entries[0]
  if (!top) return null
  return (
    <p className="mt-2 text-xs text-muted-foreground">
      Highest share:{" "}
      <span className="font-medium text-foreground">{top.name}</span> at{" "}
      {top.pct.toFixed(1)}%
    </p>
  )
}
