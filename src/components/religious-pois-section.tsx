/**
 * /religion-map — OSM-derived religious sub-community section.
 *
 * Two blocks:
 *   1. Two large categorical maps showing the dominant Christian /
 *      Muslim sub-rite per AC, filtered to ACs where the dominant
 *      sub-rite is ≥5% of estimated voters (electoral threshold).
 *   2. Grid of 13 small gradient maps (9 Christian + 4 Muslim) shading
 *      ACs by ESTIMATED VOTER SHARE of that sub-rite:
 *        (OSM share among religion's POIs) × (Census religion share).
 *      ACs below 3% are rendered as gray (electorally irrelevant).
 *
 * The metric combines OSM (within-religion sub-rite mix) with Census
 * (religion population share) so a 100% Latin share among 2 Christian
 * POIs in Udma (where Christians are ~7% of population) shows up as
 * ~7% of voters — barely visible — rather than saturating the map.
 */
import { useState } from "react"

import {
  CHRISTIAN_SUBRITE_COLORS,
  MUSLIM_SUBRITE_COLORS,
  NO_DATA_GRAY,
} from "@/components/walkthroughs/colors"
import {
  ReligionCategoricalMap,
  bucketCounts,
} from "@/components/religion-categorical-map"
import { ReligionGradientMap } from "@/components/religion-gradient-map"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  buildDominantSubRiteByVoterShare,
  buildSubRiteVoterShareMap,
  filterVoterShareMap,
  getReligiousPOIsForAC,
  getVoterShareBreakdown,
  type ChristianDenomination,
  type MuslimDenomination,
  type Year,
} from "@/lib/data/religious-pois"
import { constituencies } from "@/lib/data"

const MIN_VISIBLE_VOTER_PCT = 3 // ACs below this get gray fill
const DOMINANT_THRESHOLD_PCT = 5 // dominant sub-rite must be ≥ this

const CHRISTIAN_BUCKETS: Array<{
  code: ChristianDenomination
  label: string
}> = [
  { code: "latin_catholic", label: "Latin Catholic" },
  { code: "syro_malabar", label: "Syro-Malabar" },
  { code: "syro_malankara", label: "Syro-Malankara" },
  { code: "knanaya_catholic", label: "Knanaya Catholic" },
  { code: "marthoma", label: "Marthoma" },
  { code: "indian_orthodox", label: "Indian Orthodox" },
  { code: "jacobite_syrian", label: "Jacobite Syrian" },
  { code: "csi", label: "CSI" },
  { code: "pentecostal", label: "Pentecostal" },
]

const MUSLIM_BUCKETS: Array<{
  code: MuslimDenomination
  label: string
}> = [
  { code: "sunni", label: "Sunni" },
  { code: "salafi_mujahid", label: "Salafi / Mujahid" },
  { code: "jamaat_islami", label: "Jamaat-e-Islami" },
  { code: "ahmadiyya", label: "Ahmadiyya" },
]

type Props = {
  hoveredSeat: number | null
  onAcHover: (seat: number | null) => void
}

export function ReligiousPOIsSection({ hoveredSeat, onAcHover }: Props) {
  const [year, setYear] = useState<Year>(2025)

  const dominantChristian = buildDominantSubRiteByVoterShare(
    "christian",
    year,
    DOMINANT_THRESHOLD_PCT
  )
  const dominantMuslim = buildDominantSubRiteByVoterShare(
    "muslim",
    year,
    DOMINANT_THRESHOLD_PCT
  )
  const christianCounts = bucketCounts(dominantChristian)
  const muslimCounts = bucketCounts(dominantMuslim)
  const totalACs = 140
  const christianBelowThreshold =
    totalACs -
    [...christianCounts.values()].reduce((a, b) => a + b, 0)
  const muslimBelowThreshold =
    totalACs - [...muslimCounts.values()].reduce((a, b) => a + b, 0)

  return (
    <section className="space-y-12">
      <header>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              Religious sub-communities (from OpenStreetMap)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Estimated <span className="font-medium text-foreground">share
              of total voters</span> in each sub-rite per AC:{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-[0.85em]">
                sub-rite share among religion&apos;s POIs (from{" "}
                <a
                  href="https://github.com/nvlsr/kerala-2026/blob/main/data/raw/osm/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  OSM
                </a>
                ) × religion share of population (from Census)
              </code>
              . ACs below {MIN_VISIBLE_VOTER_PCT}% estimated voter share are
              rendered as gray (electorally irrelevant); the dominant map
              additionally requires the dominant sub-rite to be ≥
              {DOMINANT_THRESHOLD_PCT}% of voters.
            </p>
          </div>
          <ToggleGroup
            value={[String(year)]}
            onValueChange={(v) => {
              const next = v[0] === "2011" ? 2011 : 2025
              setYear(next as Year)
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
        </div>
      </header>

      {/* Block 1 — Dominant per AC */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DominantMapCard
          title={`Dominant Christian sub-rite (≥${DOMINANT_THRESHOLD_PCT}% of voters)`}
          acValues={dominantChristian}
          buckets={CHRISTIAN_BUCKETS}
          bucketColors={CHRISTIAN_SUBRITE_COLORS}
          counts={christianCounts}
          belowThresholdCount={christianBelowThreshold}
          hoveredSeat={hoveredSeat}
          onAcHover={onAcHover}
          religion="christian"
          year={year}
        />
        <DominantMapCard
          title={`Dominant Muslim sub-rite (≥${DOMINANT_THRESHOLD_PCT}% of voters)`}
          acValues={dominantMuslim}
          buckets={MUSLIM_BUCKETS}
          bucketColors={MUSLIM_SUBRITE_COLORS}
          counts={muslimCounts}
          belowThresholdCount={muslimBelowThreshold}
          hoveredSeat={hoveredSeat}
          onAcHover={onAcHover}
          religion="muslim"
          year={year}
        />
      </div>

      {/* Block 2 — Per-sub-rite gradient maps */}
      <div>
        <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
          Christian sub-rite — estimated share of voters per AC
        </h3>
        <ul className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CHRISTIAN_BUCKETS.map((b) => (
            <SubriteGradientCard
              key={b.code}
              label={b.label}
              color={CHRISTIAN_SUBRITE_COLORS[b.code]!}
              religion="christian"
              code={b.code}
              year={year}
              hoveredSeat={hoveredSeat}
              onAcHover={onAcHover}
            />
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
          Muslim sub-rite — estimated share of voters per AC
        </h3>
        <ul className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MUSLIM_BUCKETS.map((b) => (
            <SubriteGradientCard
              key={b.code}
              label={b.label}
              color={MUSLIM_SUBRITE_COLORS[b.code]!}
              religion="muslim"
              code={b.code}
              year={year}
              hoveredSeat={hoveredSeat}
              onAcHover={onAcHover}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

// ── Dominant categorical map card ─────────────────────────────────────
function DominantMapCard({
  title,
  acValues,
  buckets,
  bucketColors,
  counts,
  belowThresholdCount,
  hoveredSeat,
  onAcHover,
  religion,
  year,
}: {
  title: string
  acValues: Record<string, string>
  buckets: Array<{ code: string; label: string }>
  bucketColors: Record<string, string>
  counts: Map<string, number>
  belowThresholdCount: number
  hoveredSeat: number | null
  onAcHover: (seat: number | null) => void
  religion: "christian" | "muslim"
  year: Year
}) {
  return (
    <div className="rounded-lg border bg-card/40 p-4 sm:p-5">
      <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
        {title}
      </h3>
      <div className="mt-3">
        <ReligionCategoricalMap
          acValues={acValues}
          bucketColors={bucketColors}
          noDataColor={NO_DATA_GRAY}
          hoveredSeat={hoveredSeat}
          onAcHover={onAcHover}
          zoomable
          ariaLabel={`Kerala constituencies coloured by dominant ${religion} sub-rite`}
        />
      </div>
      <DominantHoverCaption
        religion={religion}
        hoveredSeat={hoveredSeat}
        year={year}
      />
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
        {buckets.map((b) => {
          const n = counts.get(b.code) ?? 0
          if (n === 0) return null
          return (
            <li key={b.code} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: bucketColors[b.code] }}
                aria-hidden
              />
              <span className="font-medium text-foreground">{b.label}</span>
              <span className="tabular-nums text-muted-foreground">{n}</span>
            </li>
          )
        })}
        {belowThresholdCount > 0 && (
          <li className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: NO_DATA_GRAY }}
              aria-hidden
            />
            <span className="text-muted-foreground">
              Below {DOMINANT_THRESHOLD_PCT}% threshold
            </span>
            <span className="tabular-nums text-muted-foreground">
              {belowThresholdCount}
            </span>
          </li>
        )}
      </ul>
    </div>
  )
}

function DominantHoverCaption({
  religion,
  hoveredSeat,
  year,
}: {
  religion: "christian" | "muslim"
  hoveredSeat: number | null
  year: Year
}) {
  if (hoveredSeat == null) return null
  const ac = getReligiousPOIsForAC(hoveredSeat)
  if (!ac) return null
  const seatMeta = constituencies.find(
    (c) => c.constituencyNumber === hoveredSeat
  )
  const dominant =
    religion === "christian"
      ? ac.dominant_christian_denomination
      : ac.dominant_muslim_denomination
  if (!dominant) {
    return (
      <p className="mt-2 text-xs">
        <span className="font-medium text-foreground">
          {seatMeta?.constituencyName ?? `AC ${hoveredSeat}`}
        </span>
        : <span className="text-muted-foreground">no classified {religion} POIs</span>
      </p>
    )
  }
  const b = getVoterShareBreakdown(hoveredSeat, religion, dominant, year)
  if (!b) return null
  return (
    <p className="mt-2 text-xs">
      <span className="font-medium text-foreground">
        {seatMeta?.constituencyName ?? `AC ${hoveredSeat}`}
      </span>
      :{" "}
      <span className="tabular-nums">{b.voterSharePct.toFixed(1)}%</span>{" "}
      <span className="text-muted-foreground">
        est. voters {dominant.replaceAll("_", " ")} ({religion}{" "}
        {b.religionPopPct.toFixed(0)}% × {b.subriteShareOfReligion.toFixed(0)}%
        sub-rite, n={b.classifiedCount})
      </span>
    </p>
  )
}

// ── Per-sub-rite gradient card ────────────────────────────────────────
function SubriteGradientCard({
  label,
  color,
  religion,
  code,
  year,
  hoveredSeat,
  onAcHover,
}: {
  label: string
  color: string
  religion: "christian" | "muslim"
  code: ChristianDenomination | MuslimDenomination
  year: Year
  hoveredSeat: number | null
  onAcHover: (seat: number | null) => void
}) {
  const fullMap = buildSubRiteVoterShareMap(religion, code, year)
  const filteredMap = filterVoterShareMap(fullMap, MIN_VISIBLE_VOTER_PCT)
  return (
    <li className="rounded-lg border bg-card/40 p-4 sm:p-5">
      <header className="mb-2 flex items-baseline justify-between gap-2">
        <h4 className="font-heading text-sm font-semibold tracking-tight sm:text-base">
          {label}
        </h4>
        <span
          className="inline-flex h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      </header>
      <ReligionGradientMap
        religion={religion}
        baseColor={color}
        level="ac"
        acValuesOverride={filteredMap}
        noDataColor={NO_DATA_GRAY}
        hoveredSeat={hoveredSeat}
        onAcHover={onAcHover}
        zoomable
        ariaLabel={`Kerala constituencies shaded by estimated ${label} voter share`}
      />
      <SubriteGradientCaption
        code={code}
        religion={religion}
        fullMap={fullMap}
        year={year}
        hoveredSeat={hoveredSeat}
      />
    </li>
  )
}

function SubriteGradientCaption({
  code,
  religion,
  fullMap,
  year,
  hoveredSeat,
}: {
  code: ChristianDenomination | MuslimDenomination
  religion: "christian" | "muslim"
  fullMap: Record<string, number>
  year: Year
  hoveredSeat: number | null
}) {
  if (hoveredSeat != null) {
    const ac = getReligiousPOIsForAC(hoveredSeat)
    const b = getVoterShareBreakdown(hoveredSeat, religion, code, year)
    if (ac && b) {
      const belowThreshold = b.voterSharePct < MIN_VISIBLE_VOTER_PCT
      return (
        <p className="mt-2 text-xs">
          <span className="font-medium text-foreground">{ac.ac_name}</span>:{" "}
          <span className="tabular-nums">{b.voterSharePct.toFixed(1)}%</span>{" "}
          <span className="text-muted-foreground">
            est. voters ({religion} {b.religionPopPct.toFixed(0)}% ×{" "}
            {b.subriteShareOfReligion.toFixed(0)}% sub-rite, n=
            {b.classifiedCount}
            {belowThreshold &&
              `, below ${MIN_VISIBLE_VOTER_PCT}% — shown as gray`}
            )
          </span>
        </p>
      )
    }
    if (ac && !b) {
      return (
        <p className="mt-2 text-xs">
          <span className="font-medium text-foreground">{ac.ac_name}</span>:{" "}
          <span className="text-muted-foreground">
            no classified {religion} POIs
          </span>
        </p>
      )
    }
  }
  const entries = Object.entries(fullMap)
    .map(([acStr, pct]) => ({ acNumber: Number(acStr), pct }))
    .sort((a, b) => b.pct - a.pct)
  const top = entries[0]
  if (!top || top.pct === 0) return null
  const ac = getReligiousPOIsForAC(top.acNumber)
  return (
    <p className="mt-2 text-xs text-muted-foreground">
      Highest share:{" "}
      <span className="font-medium text-foreground">
        {ac?.ac_name ?? `AC ${top.acNumber}`}
      </span>{" "}
      at {top.pct.toFixed(1)}% est. voters
    </p>
  )
}
