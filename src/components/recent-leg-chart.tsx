import { Link } from "react-router-dom"

import { getAlliance, type AllianceCode } from "@/lib/data"
import { displayConstituencyName } from "@/lib/data"
import type { MultiCycleDrift } from "@/lib/data/flows"
import {
  initialFilters,
  serializeFilters,
  type Filters,
} from "@/lib/filters"
import { cn } from "@/lib/utils"

type Props = {
  drifts: MultiCycleDrift[]
}

type Row = {
  seatNumber: number
  seatName: string
  delta: number | null
  gainer: AllianceCode
  trajectory: { y2021: number | null; y2026: number }
}

function buildSeatUrl(seatNumber: number): string {
  const f: Filters = {
    ...initialFilters,
    seat: seatNumber,
    result: "all",
  }
  return `/explore?${serializeFilters(f).toString()}`
}

/**
 * Per-seat 2021 → 2026 delta for the gainer alliance, sorted descending.
 * Surfaces which seats in a multi-cycle drift pattern are still climbing
 * (top of list, strong colour) versus plateaued or reversing (bottom of
 * list, muted bars on the left of the zero line).
 *
 * The "sustained drift" classifier only checks that ≥ 2 of 3 cycle
 * transitions agreed with the cumulative direction — so a seat can pass
 * the multi-cycle filter while its most-recent leg is plateaued or
 * reversing. This chart makes that distinction visible.
 */
export function RecentLegChart({ drifts }: Props) {
  if (drifts.length === 0) return null

  const rows: Row[] = drifts
    .map((d): Row => {
      const s2021 = d.shares[2021]
      const s2026 = d.shares[2026]
      const y2021 = s2021 ? s2021[d.gainer] : null
      const y2026 = s2026[d.gainer]
      const delta = y2021 == null ? null : y2026 - y2021
      return {
        seatNumber: d.constituency.constituencyNumber,
        seatName: displayConstituencyName(d.constituency),
        delta,
        gainer: d.gainer,
        trajectory: { y2021, y2026 },
      }
    })
    .filter((r) => r.delta !== null)
    .sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0))

  const maxAbs = rows.reduce(
    (m, r) => Math.max(m, Math.abs(r.delta ?? 0)),
    0
  )
  const scale = maxAbs > 0 ? 50 / maxAbs : 0 // each unit pp = N% of half-width
  const gainer = rows[0]?.gainer
  const gainerColor = gainer ? getAlliance(gainer).color : "var(--foreground)"

  return (
    <div className="overflow-hidden rounded-lg border bg-card/40">
      <div className="space-y-px p-2">
        {rows.map((r) => {
          const delta = r.delta ?? 0
          const widthPct = Math.abs(delta) * scale
          const positive = delta >= 0
          return (
            <div
              key={r.seatNumber}
              className="grid grid-cols-[8rem_1fr_3.5rem] items-center gap-2 px-2 py-0.5 text-xs"
            >
              <Link
                to={buildSeatUrl(r.seatNumber)}
                className="truncate font-medium hover:underline"
                title={r.seatName}
              >
                {r.seatName}
              </Link>
              <div className="relative h-3">
                <div className="absolute inset-y-0 left-1/2 w-px bg-border" />
                <div
                  className={cn("absolute h-full rounded-sm")}
                  style={{
                    left: positive ? "50%" : `${50 - widthPct}%`,
                    width: `${widthPct}%`,
                    backgroundColor: positive
                      ? gainerColor
                      : "var(--muted-foreground)",
                    opacity: positive ? 0.75 : 0.4,
                  }}
                  aria-hidden
                />
              </div>
              <span
                className={cn(
                  "text-right tabular-nums",
                  positive
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                title={`${r.gainer} share: ${r.trajectory.y2021?.toFixed(1) ?? "—"}% in 2021 → ${r.trajectory.y2026.toFixed(1)}% in 2026`}
              >
                {positive ? "+" : ""}
                {delta.toFixed(1)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
