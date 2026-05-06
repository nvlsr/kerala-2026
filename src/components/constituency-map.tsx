import { useMemo, useState } from "react"

import paths from "@data/kerala-constituencies-paths.json"
import { Section } from "@/components/section"
import { tint } from "@/lib/color"
import {
  constituencies as allConstituencies,
  displayConstituencyName,
  formatNumber,
  formatPercent,
  getAlliance,
  partyShort,
  type CandidateRow,
} from "@/lib/data"
import type { Filters, SortColumn } from "@/lib/filters"
import {
  buildMapData,
  NEGATIVE_HUE,
  NEUTRAL_HUE,
  POSITIVE_HUE,
  valueForSort,
  type EncodingMode,
  type MapData,
} from "@/lib/seat-encoding"

type Props = {
  filters: Filters
  inFilterSet: Set<number>
  selectedSeat: number | null
  onSelect: (n: number | null) => void
}

export function ConstituencyMap({
  filters,
  inFilterSet,
  selectedSeat,
  onSelect,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  const data = useMemo(
    () => buildMapData(filters, inFilterSet),
    [filters, inFilterSet]
  )
  const fills = data.encodings

  const focusedSeat = hovered ?? selectedSeat
  const subtitle = describeSubtitle(filters, inFilterSet.size, data.mode)

  return (
    <Section title="Constituency map" subtitle={subtitle}>
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
        <div className="relative flex justify-center lg:col-span-3">
          <svg
            viewBox={`0 0 ${paths.width} ${paths.height}`}
            role="img"
            aria-label="Kerala constituency map"
            className="h-auto w-full max-w-xl"
          >
            {paths.constituencies.map((c) => {
              const num = c.constituencyNumber
              const isSelected = selectedSeat === num
              const isHovered = hovered === num
              const fill = fills.get(num) ?? {
                color: "var(--muted)",
                opacity: 0.2,
              }
              const baseOpacity = fill.opacity
              return (
                <path
                  key={num}
                  d={c.pathD}
                  role="button"
                  aria-label={`${c.name} (${num})`}
                  aria-pressed={isSelected}
                  tabIndex={0}
                  fill={fill.color}
                  fillOpacity={
                    isSelected
                      ? 0.95
                      : isHovered
                        ? Math.min(1, baseOpacity + 0.2)
                        : baseOpacity
                  }
                  stroke={
                    isSelected ? "var(--foreground)" : "var(--border)"
                  }
                  strokeWidth={isSelected ? 1.5 : 0.5}
                  className="cursor-pointer transition-opacity outline-none focus-visible:stroke-foreground focus-visible:[stroke-width:1.5]"
                  onClick={() => onSelect(isSelected ? null : num)}
                  onMouseEnter={() => setHovered(num)}
                  onMouseLeave={() => setHovered(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onSelect(isSelected ? null : num)
                    }
                  }}
                />
              )
            })}
          </svg>
        </div>

        <div className="lg:col-span-2">
          {focusedSeat != null ? (
            <SeatPanel
              constituencyNumber={focusedSeat}
              filters={filters}
              data={data}
            />
          ) : (
            <Hint mode={data.mode} />
          )}
        </div>
      </div>
    </Section>
  )
}

function describeSubtitle(
  filters: Filters,
  inFilterSize: number,
  mode: EncodingMode
): string {
  const subset =
    inFilterSize === paths.constituencies.length
      ? null
      : `${inFilterSize} of ${paths.constituencies.length} seats`
  const encoding =
    mode === "magnitude"
      ? `colored by ${sortLabel(filters.sort.column)}`
      : mode === "diverging"
        ? `colored by ${sortLabel(filters.sort.column)} (gain / loss)`
        : filters.result === "losers"
          ? "colored by runner-up's alliance"
          : "colored by winning alliance"
  return [subset, encoding].filter(Boolean).join(" · ")
}

function sortLabel(col: SortColumn): string {
  switch (col) {
    case "votes":
      return "votes"
    case "share":
      return "vote share"
    case "margin":
      return "margin"
    case "shareDelta":
      return "Δ share '21"
    case "marginDelta":
      return "Δ margin '21"
    default:
      return "winner"
  }
}

function SeatPanel({
  constituencyNumber,
  filters,
  data,
}: {
  constituencyNumber: number
  filters: Filters
  data: MapData
}) {
  const c = allConstituencies.find(
    (x) => x.constituencyNumber === constituencyNumber
  )
  if (!c) return null
  const subject = data.subjects.get(constituencyNumber) ?? null
  const enc = data.encodings.get(constituencyNumber)

  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <div className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {displayConstituencyName(c)}
      </div>

      {subject ? (
        <SeatSubject subject={subject} filters={filters} />
      ) : (
        <div className="mb-2 text-xs text-muted-foreground">
          {filters.party
            ? `${partyShort(filters.party)} did not contest`
            : "no candidate matches the active filter"}
        </div>
      )}

      {subject && enc && (
        <EncodingChip
          subject={subject}
          data={data}
          fillColor={enc.color}
          fillOpacity={enc.opacity}
        />
      )}

      {subject && (
        <SeatStats subject={subject} sortCol={filters.sort.column} />
      )}
    </div>
  )
}

function SeatSubject({
  subject,
  filters,
}: {
  subject: CandidateRow
  filters: Filters
}) {
  const meta = getAlliance(subject.allianceCode)
  const role = subjectRole(subject, filters)
  return (
    <div className="mb-3">
      <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
        {role}
      </div>
      <div className="mt-0.5 text-sm">
        <span className="font-medium">{subject.candidateDisplay}</span>
        <span className="ml-2 text-muted-foreground">
          {partyShort(subject.candidate.party)}
        </span>
        <span
          className="ml-2 inline-block rounded px-1 py-px text-[10px] font-semibold tracking-wider uppercase"
          style={{
            color: meta.color,
            backgroundColor: tint.bg(meta.color),
          }}
        >
          {meta.code}
        </span>
      </div>
    </div>
  )
}

function subjectRole(row: CandidateRow, filters: Filters): string {
  if (row.isWinner) return "Winner"
  if (filters.result === "losers" && filters.party)
    return `${partyShort(filters.party)} (loser)`
  if (filters.party) return partyShort(filters.party)
  if (filters.result === "losers") return "Top runner-up"
  return `Runner-up #${row.rank - 1}`
}

function EncodingChip({
  subject,
  data,
  fillColor,
  fillOpacity,
}: {
  subject: CandidateRow
  data: MapData
  fillColor: string
  fillOpacity: number
}) {
  const sortVal = valueForSort(subject, data.sortCol)
  return (
    <div className="mb-3 rounded border bg-background/40 p-2">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-sm border"
          style={{ backgroundColor: fillColor, opacity: fillOpacity }}
          aria-hidden
        />
        <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
          {chipLabel(data.mode, data.sortCol)}
        </span>
      </div>
      {data.isMagSort && sortVal != null && data.maxAbs > data.minAbs && (
        <ScaleBar
          value={sortVal}
          minAbs={data.minAbs}
          maxAbs={data.maxAbs}
          mode={data.mode}
        />
      )}
      {sortVal != null && (
        <div className="mt-1 text-xs font-medium tabular-nums">
          {formatSortValue(data.sortCol, sortVal)}
        </div>
      )}
    </div>
  )
}

function chipLabel(mode: EncodingMode, col: SortColumn): string {
  if (mode === "alliance") return `Alliance · ${sortLabel(col)}`
  if (mode === "magnitude") return `Magnitude · ${sortLabel(col)}`
  return `Gain / loss · ${sortLabel(col)}`
}

function ScaleBar({
  value,
  minAbs,
  maxAbs,
  mode,
}: {
  value: number
  minAbs: number
  maxAbs: number
  mode: EncodingMode
}) {
  const t = Math.max(0, Math.min(1, (Math.abs(value) - minAbs) / (maxAbs - minAbs)))
  if (mode === "diverging") {
    // Two-sided bar: rose left, emerald right; tick offset by sign
    const sign = value >= 0 ? 1 : -1
    const half = t * 50 // percent from center
    const tickPct = 50 + sign * half
    return (
      <div className="relative mt-2 h-1.5 overflow-hidden rounded">
        <div
          className="absolute inset-y-0 left-0 w-1/2"
          style={{
            background: `linear-gradient(to right, ${NEGATIVE_HUE}, ${NEGATIVE_HUE}33)`,
          }}
          aria-hidden
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2"
          style={{
            background: `linear-gradient(to right, ${POSITIVE_HUE}33, ${POSITIVE_HUE})`,
          }}
          aria-hidden
        />
        <div
          className="absolute inset-y-[-2px] w-0.5 bg-foreground"
          style={{ left: `calc(${tickPct}% - 1px)` }}
          aria-hidden
        />
      </div>
    )
  }
  // Single-hue bar (alliance or magnitude)
  return (
    <div className="relative mt-2 h-1.5 overflow-hidden rounded">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${NEUTRAL_HUE}33, ${NEUTRAL_HUE})`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-y-[-2px] w-0.5 bg-foreground"
        style={{ left: `calc(${t * 100}% - 1px)` }}
        aria-hidden
      />
    </div>
  )
}

function SeatStats({
  subject,
  sortCol,
}: {
  subject: CandidateRow
  sortCol: SortColumn
}) {
  const cells: Array<{
    col: SortColumn
    label: string
    value: string | null
  }> = [
    {
      col: "share",
      label: "Share",
      value: formatPercent(subject.share / 100, 1),
    },
    {
      col: "margin",
      label: "Margin",
      value: `${subject.margin >= 0 ? "+" : "−"}${formatPercent(
        Math.abs(subject.marginPct) / 100,
        1
      )}`,
    },
    {
      col: "shareDelta",
      label: "Δ share '21",
      value:
        subject.shareDelta2021 == null
          ? null
          : `${subject.shareDelta2021 >= 0 ? "+" : "−"}${Math.abs(
              subject.shareDelta2021
            ).toFixed(1)}pp`,
    },
    {
      col: "marginDelta",
      label: "Δ margin '21",
      value:
        subject.marginDelta2021 == null
          ? null
          : `${subject.marginDelta2021 >= 0 ? "+" : "−"}${Math.abs(
              subject.marginDelta2021
            ).toFixed(1)}pp`,
    },
  ]
  return (
    <dl className="grid grid-cols-2 gap-2 text-xs">
      {cells.map((cell) => (
        <Stat
          key={cell.col}
          label={cell.label}
          value={cell.value ?? "—"}
          highlighted={cell.col === sortCol}
        />
      ))}
    </dl>
  )
}

function Stat({
  label,
  value,
  highlighted,
}: {
  label: string
  value: string
  highlighted?: boolean
}) {
  return (
    <div
      className={
        highlighted
          ? "rounded border-l-2 border-foreground/60 pl-2"
          : "pl-[10px]"
      }
    >
      <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="font-medium tabular-nums">{value}</div>
    </div>
  )
}

function formatSortValue(col: SortColumn, value: number): string {
  switch (col) {
    case "votes":
      return formatNumber(value)
    case "share":
      return formatPercent(value / 100, 1)
    case "margin":
      return `${value >= 0 ? "+" : "−"}${formatNumber(Math.abs(value))} votes`
    case "shareDelta":
    case "marginDelta":
      return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(1)}pp`
    default:
      return ""
  }
}

function Hint({ mode }: { mode: EncodingMode }) {
  const explainer =
    mode === "magnitude"
      ? "Single neutral hue; darker shades = higher values on the active sort column."
      : mode === "diverging"
        ? "Green = gain over 2021, rose = loss; darker shades = larger swings."
        : "Polygons are colored by alliance. When sorted by a numeric column, darker shades mean a bigger value or swing."
  return (
    <div className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
      <div className="mb-2 font-medium tracking-wide text-foreground/70 uppercase">
        Hover or click a seat
      </div>
      {explainer} Out-of-filter seats fade.
    </div>
  )
}
