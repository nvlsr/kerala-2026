import { useMemo, useState } from "react"

import paths from "@data/kerala-constituencies-paths.json"
import { Section } from "@/components/section"
import { tint } from "@/lib/color"
import {
  allianceForCandidate,
  constituencies as allConstituencies,
  displayConstituencyName,
  formatPercent,
  getAlliance,
  isMainFront,
  partyShort,
  totalVotesIn,
  winnerOf,
} from "@/lib/data"

type Props = {
  inFilterSet: Set<number>
  selectedSeat: number | null
  onSelect: (n: number | null) => void
}

export function ConstituencyMap({
  inFilterSet,
  selectedSeat,
  onSelect,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  const fills = useMemo(() => computeFills(), [])

  const focusedSeat = hovered ?? selectedSeat
  const subtitle =
    inFilterSet.size === paths.constituencies.length
      ? "click a seat to drill in"
      : `${inFilterSet.size} of ${paths.constituencies.length} seats in current filter`

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
              const inSet = inFilterSet.has(num)
              const fill = fills.get(num) ?? {
                color: "var(--muted)",
                opacity: 0.2,
              }
              const baseOpacity = inSet ? fill.opacity : fill.opacity * 0.2
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
                    isSelected ? "var(--foreground)" : "var(--background)"
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
            <SeatPanel constituencyNumber={focusedSeat} />
          ) : (
            <Hint />
          )}
        </div>
      </div>
    </Section>
  )
}

type Fill = { color: string; opacity: number }

function computeFills(): Map<number, Fill> {
  const map = new Map<number, Fill>()
  for (const c of allConstituencies) {
    const winner = winnerOf(c)
    const allianceCode = allianceForCandidate(c, winner)
    const allianceMeta = getAlliance(allianceCode)
    map.set(c.constituencyNumber, {
      color: allianceMeta.color,
      opacity: isMainFront(allianceCode) ? 0.7 : 0.25,
    })
  }
  return map
}

function SeatPanel({ constituencyNumber }: { constituencyNumber: number }) {
  const c = allConstituencies.find(
    (x) => x.constituencyNumber === constituencyNumber
  )
  if (!c) return null
  const winner = winnerOf(c)
  const allianceCode = allianceForCandidate(c, winner)
  const meta = getAlliance(allianceCode)
  const total = totalVotesIn(c)
  const share = total > 0 ? (winner.votes / total) * 100 : 0
  const marginPct = total > 0 ? (winner.margin / total) * 100 : 0

  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <div className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {displayConstituencyName(c)}
      </div>
      <div className="mb-2 text-sm">
        <span className="font-medium">{partyShort(winner.party)}</span>
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
      <dl className="grid grid-cols-2 gap-2 text-xs">
        <Stat label="Share" value={formatPercent(share / 100, 1)} />
        <Stat label="Margin" value={`+${formatPercent(marginPct / 100, 1)}`} />
      </dl>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="font-medium tabular-nums">{value}</div>
    </div>
  )
}

function Hint() {
  return (
    <div className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
      <div className="mb-2 font-medium tracking-wide text-foreground/70 uppercase">
        Hover or click a seat
      </div>
      Polygons are colored by 2026 winning alliance. Out-of-filter seats fade —
      pick a party or apply an Insights chip to see the spatial distribution of
      that filter.
    </div>
  )
}
