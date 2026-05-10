/**
 * /religion-map — OSM-derived religious sub-community section.
 *
 * Two blocks:
 *   1. Two large categorical maps showing dominant Christian / Muslim
 *      sub-rite per AC.
 *   2. Grid of 13 small gradient maps: 9 Christian sub-rites + 4
 *      Muslim sub-rites. Each gradient shades by % share among that
 *      religion's classified POIs in the AC.
 *
 * Source: data/ac-religious-poi-inventory.json (per-AC counts from OSM
 * Overpass dump, classified via scripts/classify-osm-pow.ts).
 */
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
import {
  buildChristianDenominationShareMap,
  buildDominantChristianMap,
  buildDominantMuslimMap,
  buildMuslimDenominationShareMap,
  getReligiousPOIsForAC,
  type ChristianDenomination,
  type MuslimDenomination,
} from "@/lib/data/religious-pois"
import { constituencies } from "@/lib/data"

// ── Display order + labels ────────────────────────────────────────────
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
  const dominantChristian = buildDominantChristianMap()
  const dominantMuslim = buildDominantMuslimMap()
  const christianCounts = bucketCounts(dominantChristian)
  const muslimCounts = bucketCounts(dominantMuslim)

  // 140 ACs total; the "(no data)" bucket = 140 − sum-of-classified
  const totalACs = 140
  const christianNoData =
    totalACs -
    [...christianCounts.values()].reduce((a, b) => a + b, 0)
  const muslimNoData =
    totalACs - [...muslimCounts.values()].reduce((a, b) => a + b, 0)

  return (
    <section className="space-y-12">
      <header>
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Religious sub-communities (from OpenStreetMap)
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What Census doesn&apos;t disaggregate: Christian sub-rites and
          Muslim sub-sects per AC, derived from{" "}
          <a
            href="https://github.com/nvlsr/kerala-2026/blob/main/data/raw/osm/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            ~22,000 religious POIs in OSM
          </a>{" "}
          (snapshot 2026-05-10). <span className="font-medium text-foreground">
          POI count is not population share
          </span>{" "}
          — Hindu temples are smaller and more numerous per capita than
          churches/mosques. Use this to identify which sub-rite has the
          most parishes/mosques in each AC, not which is the largest
          population.
        </p>
      </header>

      {/* Block 1 — Dominant per AC (2 large categorical maps) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DominantMapCard
          title="Dominant Christian sub-rite"
          acValues={dominantChristian}
          buckets={CHRISTIAN_BUCKETS}
          bucketColors={CHRISTIAN_SUBRITE_COLORS}
          counts={christianCounts}
          noDataCount={christianNoData}
          hoveredSeat={hoveredSeat}
          onAcHover={onAcHover}
          religion="christian"
        />
        <DominantMapCard
          title="Dominant Muslim sub-rite"
          acValues={dominantMuslim}
          buckets={MUSLIM_BUCKETS}
          bucketColors={MUSLIM_SUBRITE_COLORS}
          counts={muslimCounts}
          noDataCount={muslimNoData}
          hoveredSeat={hoveredSeat}
          onAcHover={onAcHover}
          religion="muslim"
        />
      </div>

      {/* Block 2 — Per-sub-rite gradient maps */}
      <div>
        <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
          Christian sub-rite — share among Christian POIs per AC
        </h3>
        <ul className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CHRISTIAN_BUCKETS.map((b) => (
            <SubriteGradientCard
              key={b.code}
              label={b.label}
              color={CHRISTIAN_SUBRITE_COLORS[b.code]!}
              acValues={buildChristianDenominationShareMap(b.code)}
              religion="christian"
              code={b.code}
              hoveredSeat={hoveredSeat}
              onAcHover={onAcHover}
            />
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
          Muslim sub-rite — share among Muslim POIs per AC
        </h3>
        <ul className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MUSLIM_BUCKETS.map((b) => (
            <SubriteGradientCard
              key={b.code}
              label={b.label}
              color={MUSLIM_SUBRITE_COLORS[b.code]!}
              acValues={buildMuslimDenominationShareMap(b.code)}
              religion="muslim"
              code={b.code}
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
  noDataCount,
  hoveredSeat,
  onAcHover,
  religion,
}: {
  title: string
  acValues: Record<string, string>
  buckets: Array<{ code: string; label: string }>
  bucketColors: Record<string, string>
  counts: Map<string, number>
  noDataCount: number
  hoveredSeat: number | null
  onAcHover: (seat: number | null) => void
  religion: "christian" | "muslim"
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
      <DominantHoverCaption religion={religion} hoveredSeat={hoveredSeat} />
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
        {noDataCount > 0 && (
          <li className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: NO_DATA_GRAY }}
              aria-hidden
            />
            <span className="text-muted-foreground">No classified POIs</span>
            <span className="tabular-nums text-muted-foreground">
              {noDataCount}
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
}: {
  religion: "christian" | "muslim"
  hoveredSeat: number | null
}) {
  if (hoveredSeat == null) return null
  const ac = getReligiousPOIsForAC(hoveredSeat)
  if (!ac) return null
  const seatMeta = constituencies.find(
    (c) => c.constituencyNumber === hoveredSeat
  )
  const buckets =
    religion === "christian"
      ? ac.by_christian_denomination
      : ac.by_muslim_denomination
  const dominant =
    religion === "christian"
      ? ac.dominant_christian_denomination
      : ac.dominant_muslim_denomination
  let classified = 0
  for (const [k, v] of Object.entries(buckets)) {
    if (k !== "(none)") classified += v
  }
  const dominantCount =
    dominant && classified > 0 ? (buckets[dominant] ?? 0) : 0
  const dominantPct =
    classified > 0 ? ((dominantCount / classified) * 100).toFixed(0) : "0"
  return (
    <p className="mt-2 text-xs">
      <span className="font-medium text-foreground">
        {seatMeta?.constituencyName ?? `AC ${hoveredSeat}`}
      </span>
      :{" "}
      {dominant ? (
        <>
          <span className="tabular-nums">{dominantPct}%</span>{" "}
          <span className="text-muted-foreground">
            {dominant.replaceAll("_", " ")} ({dominantCount}/{classified}{" "}
            classified)
          </span>
        </>
      ) : (
        <span className="text-muted-foreground">
          no classified {religion} POIs
        </span>
      )}
    </p>
  )
}

// ── Per-sub-rite gradient card ────────────────────────────────────────
function SubriteGradientCard({
  label,
  color,
  acValues,
  religion,
  code,
  hoveredSeat,
  onAcHover,
}: {
  label: string
  color: string
  acValues: Record<string, number>
  religion: "christian" | "muslim"
  code: ChristianDenomination | MuslimDenomination
  hoveredSeat: number | null
  onAcHover: (seat: number | null) => void
}) {
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
        religion={religion === "christian" ? "christian" : "muslim"}
        baseColor={color}
        level="ac"
        acValuesOverride={acValues}
        hoveredSeat={hoveredSeat}
        onAcHover={onAcHover}
        zoomable
        ariaLabel={`Kerala constituencies shaded by ${label} share among ${religion} POIs`}
      />
      <SubriteGradientCaption
        code={code}
        religion={religion}
        acValues={acValues}
        hoveredSeat={hoveredSeat}
      />
    </li>
  )
}

function SubriteGradientCaption({
  code,
  religion,
  acValues,
  hoveredSeat,
}: {
  code: ChristianDenomination | MuslimDenomination
  religion: "christian" | "muslim"
  acValues: Record<string, number>
  hoveredSeat: number | null
}) {
  if (hoveredSeat != null) {
    const ac = getReligiousPOIsForAC(hoveredSeat)
    const pct = acValues[String(hoveredSeat)]
    if (ac && pct != null) {
      const buckets =
        religion === "christian"
          ? ac.by_christian_denomination
          : ac.by_muslim_denomination
      const n = buckets[code] ?? 0
      let classified = 0
      for (const [k, v] of Object.entries(buckets)) {
        if (k !== "(none)") classified += v
      }
      return (
        <p className="mt-2 text-xs">
          <span className="font-medium text-foreground">{ac.ac_name}</span>:{" "}
          <span className="tabular-nums">{pct.toFixed(1)}%</span>{" "}
          <span className="text-muted-foreground">
            ({n}/{classified})
          </span>
        </p>
      )
    }
  }
  const entries = Object.entries(acValues).map(([acStr, pct]) => ({
    acNumber: Number(acStr),
    pct,
  }))
  entries.sort((a, b) => b.pct - a.pct)
  const top = entries[0]
  if (!top || top.pct === 0) return null
  const ac = getReligiousPOIsForAC(top.acNumber)
  return (
    <p className="mt-2 text-xs text-muted-foreground">
      Highest share:{" "}
      <span className="font-medium text-foreground">
        {ac?.ac_name ?? `AC ${top.acNumber}`}
      </span>{" "}
      at {top.pct.toFixed(1)}%
    </p>
  )
}
