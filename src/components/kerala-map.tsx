import { useMemo, useState } from "react"

import paths from "@data/kerala-districts-paths.json"
import { Section } from "@/components/section"
import {
  COMPARABLE_ALLIANCE_CODES,
  formatPercent,
  getAlliance,
  getDemographicsFor,
  getReligion,
  getStateSummary,
  MAIN_FRONT_CODES,
  type AllianceCode,
  type ReligionCode,
} from "@/lib/data"

const COMP_RELIGIONS: ReligionCode[] = ["hindu", "muslim", "christian"]

type Props = {
  scope: string | null
  onSelect: (id: string | null) => void
}

export function KeralaMap({ scope, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  const districtFills = useMemo(() => {
    const map = new Map<string, { fill: string; opacity: number }>()
    for (const d of paths.districts) {
      const summary = getStateSummary(d.id)
      const total = summary.totalSeats || 1
      let topCode: AllianceCode = "OTHER"
      let topSeats = 0
      for (const code of MAIN_FRONT_CODES) {
        const row = summary.rows.find((r) => r.code === code)!
        if (row.seats > topSeats) {
          topSeats = row.seats
          topCode = code
        }
      }
      const dominance = topSeats / total
      const opacity = 0.35 + Math.min(0.55, dominance * 0.7)
      map.set(d.id, {
        fill: getAlliance(topCode).color,
        opacity: topSeats === 0 ? 0.15 : opacity,
      })
    }
    return map
  }, [])

  return (
    <Section title="Map" subtitle="click a district to filter">
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
        <div className="relative flex justify-center lg:col-span-3">
          <svg
            viewBox={`0 0 ${paths.width} ${paths.height}`}
            role="img"
            aria-label="Kerala districts map"
            className="h-auto w-full max-w-md"
          >
            {paths.districts.map((d) => {
              const isSelected = scope === d.id
              const isHovered = hovered === d.id
              const fill = districtFills.get(d.id)!
              return (
                <path
                  key={d.id}
                  d={d.pathD}
                  role="button"
                  aria-label={d.name}
                  aria-pressed={isSelected}
                  tabIndex={0}
                  fill={fill.fill}
                  fillOpacity={
                    isSelected
                      ? 0.95
                      : isHovered
                        ? Math.min(1, fill.opacity + 0.2)
                        : fill.opacity
                  }
                  stroke={
                    isSelected ? "var(--foreground)" : "var(--background)"
                  }
                  strokeWidth={isSelected ? 2 : 1}
                  className="cursor-pointer transition-opacity outline-none focus-visible:stroke-foreground focus-visible:[stroke-width:2]"
                  onClick={() => onSelect(isSelected ? null : d.id)}
                  onMouseEnter={() => setHovered(d.id)}
                  onMouseLeave={() => setHovered(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onSelect(isSelected ? null : d.id)
                    }
                  }}
                />
              )
            })}
          </svg>
        </div>

        <div className="lg:col-span-2">
          <DistrictPanel id={hovered ?? scope ?? null} />
        </div>
      </div>
    </Section>
  )
}

function DistrictPanel({ id }: { id: string | null }) {
  const summary = getStateSummary(id)
  const demo = getDemographicsFor(id)
  const name = id
    ? (paths.districts.find((d) => d.id === id)?.name ?? id)
    : "All Kerala"
  const seatRow = (code: AllianceCode) =>
    summary.rows.find((r) => r.code === code)!

  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <span className="font-heading text-sm font-semibold">{name}</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {summary.totalSeats} seats
        </span>
      </div>

      <CompositionRow
        label="Seats"
        segments={COMPARABLE_ALLIANCE_CODES.map((code) => {
          const row = seatRow(code)
          return {
            key: code,
            color: getAlliance(code).color,
            widthPct:
              summary.totalSeats > 0
                ? (row.seats / summary.totalSeats) * 100
                : 0,
          }
        })}
      />
      <CompositionRow
        label="Votes"
        segments={COMPARABLE_ALLIANCE_CODES.map((code) => {
          const row = seatRow(code)
          return {
            key: code,
            color: getAlliance(code).color,
            widthPct: row.voteShare * 100,
          }
        })}
      />
      <CompositionRow
        label="Relig"
        segments={COMP_RELIGIONS.map((code) => ({
          key: code,
          color: getReligion(code).color,
          widthPct: demo.religions[code],
        }))}
      />

      <div className="mt-3 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground tabular-nums">
        {COMPARABLE_ALLIANCE_CODES.map((code) => {
          const row = seatRow(code)
          const meta = getAlliance(code)
          return (
            <span key={code} className="flex items-center gap-1">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: meta.color }}
                aria-hidden
              />
              <span>
                <span className="font-medium text-foreground/80">
                  {code === "OTHER" ? "Oth" : code}
                </span>{" "}
                {row.seats} / {formatPercent(row.voteShare, 1)}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

function CompositionRow({
  label,
  segments,
}: {
  label: string
  segments: Array<{ key: string; color: string; widthPct: number }>
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 last:mb-0">
      <span className="w-9 shrink-0 text-[9px] tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        {segments.map((s) => {
          if (s.widthPct <= 0) return null
          return (
            <div
              key={s.key}
              style={{ width: `${s.widthPct}%`, backgroundColor: s.color }}
            />
          )
        })}
      </div>
    </div>
  )
}
