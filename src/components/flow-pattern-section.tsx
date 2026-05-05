import { Link } from "react-router-dom"

import { MiniACMap } from "@/components/mini-ac-map"
import {
  initialFilters,
  serializeFilters,
  type Filters,
} from "@/lib/filters"
import {
  type AllianceShares,
  type MultiCycleDrift,
  type SeatFlow,
} from "@/lib/data/flows"
import type { Constituency } from "@/lib/data"
import { displayConstituencyName } from "@/lib/data"
import { cn } from "@/lib/utils"

const ALLIANCE_LABEL: Record<string, string> = {
  UDF: "UDF",
  LDF: "LDF",
  NDA: "NDA",
  OTHER: "Oth",
  NOTA: "NOTA",
}

const ALLIANCE_TEXT_CLASS: Record<string, string> = {
  UDF: "text-[#1F77B4]",
  LDF: "text-[#D62728]",
  NDA: "text-[#FF7F0E]",
  OTHER: "text-muted-foreground",
}

function fmtSigned(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`
}

function deltaColor(n: number, threshold = 0.5): string {
  if (n > threshold) return "text-emerald-600 dark:text-emerald-500"
  if (n < -threshold) return "text-red-600 dark:text-red-500"
  return "text-muted-foreground/70"
}

function buildSeatUrl(seat: Constituency): string {
  const f: Filters = {
    ...initialFilters,
    seat: seat.constituencyNumber,
    result: "all",
  }
  return `/?${serializeFilters(f).toString()}`
}

// ─── Single-cycle pattern section ───────────────────────────────────────

type SinglePatternProps = {
  patternLabel: string
  flows: SeatFlow[]
}

export function SingleCyclePatternSection({
  patternLabel,
  flows,
}: SinglePatternProps) {
  const focusSeats = new Set(
    flows.map((f) => f.constituency.constituencyNumber)
  )
  const filtersForMap: Filters = {
    ...initialFilters,
    result: "all",
  }

  return (
    <article className="rounded-lg border bg-card/50 p-6">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
          {patternLabel}
        </h3>
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          {flows.length} {flows.length === 1 ? "seat" : "seats"}
        </span>
      </header>
      <div className="mt-5 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SingleFlowsTable flows={flows} />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-[260px]">
            <MiniACMap
              filters={filtersForMap}
              inFilterSet={
                new Set(
                  // pass all 140 so unfocused seats render muted
                  Array.from({ length: 140 }, (_, i) => i + 1)
                )
              }
              focusSeats={focusSeats}
              ariaLabel={`Constituency map for: ${patternLabel}`}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

function SingleFlowsTable({ flows }: { flows: SeatFlow[] }) {
  const cell = "px-2 py-1.5"
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="text-left text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <th className={cell}>Seat</th>
            <th className={cn(cell, "text-right")}>ΔUDF</th>
            <th className={cn(cell, "text-right")}>ΔLDF</th>
            <th className={cn(cell, "text-right")}>ΔNDA</th>
          </tr>
        </thead>
        <tbody>
          {flows
            .sort((a, b) => b.flow.magnitude - a.flow.magnitude)
            .slice(0, 8)
            .map((f) => (
              <tr key={f.constituency.constituencyNumber} className="border-t">
                <td className={cell}>
                  <Link
                    to={buildSeatUrl(f.constituency)}
                    className="font-medium hover:underline"
                  >
                    {displayConstituencyName(f.constituency)}
                  </Link>
                </td>
                <td className={cn(cell, "text-right", deltaColor(f.deltas.UDF))}>
                  {fmtSigned(f.deltas.UDF)}
                </td>
                <td className={cn(cell, "text-right", deltaColor(f.deltas.LDF))}>
                  {fmtSigned(f.deltas.LDF)}
                </td>
                <td className={cn(cell, "text-right", deltaColor(f.deltas.NDA))}>
                  {fmtSigned(f.deltas.NDA)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {flows.length > 8 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Showing top 8 of {flows.length}.
        </p>
      )}
    </div>
  )
}

// ─── Multi-cycle drift pattern section ──────────────────────────────────

type DriftPatternProps = {
  patternLabel: string
  drifts: MultiCycleDrift[]
}

export function MultiCycleDriftSection({
  patternLabel,
  drifts,
}: DriftPatternProps) {
  const focusSeats = new Set(
    drifts.map((d) => d.constituency.constituencyNumber)
  )
  const filtersForMap: Filters = {
    ...initialFilters,
    result: "all",
  }

  return (
    <article className="rounded-lg border bg-card/50 p-6">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
          {patternLabel}
        </h3>
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          {drifts.length} {drifts.length === 1 ? "seat" : "seats"} · sustained
          across cycles
        </span>
      </header>
      <div className="mt-5 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DriftTable drifts={drifts} />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-[260px]">
            <MiniACMap
              filters={filtersForMap}
              inFilterSet={
                new Set(Array.from({ length: 140 }, (_, i) => i + 1))
              }
              focusSeats={focusSeats}
              ariaLabel={`Constituency map for: ${patternLabel}`}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

function DriftTable({ drifts }: { drifts: MultiCycleDrift[] }) {
  const cell = "px-2 py-1.5"
  // Sort by net cumulative shift magnitude (gainer cumulative - loser cumulative)
  const sorted = [...drifts].sort((a, b) => {
    const aNet = a.cumulative[a.gainer] - a.cumulative[a.loser]
    const bNet = b.cumulative[b.gainer] - b.cumulative[b.loser]
    return bNet - aNet
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="text-left text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <th className={cell}>Seat</th>
            <th className={cn(cell, "text-left")}>
              {/* gainer trail */}
              Trajectory (2011 → 2026)
            </th>
            <th className={cn(cell, "text-right")}>Cumulative</th>
          </tr>
        </thead>
        <tbody>
          {sorted.slice(0, 8).map((d) => {
            const ga = d.gainer
            const lo = d.loser
            const trail = (a: typeof ga) =>
              [d.shares[2011], d.shares[2016], d.shares[2021], d.shares[2026]]
                .map((s) => (s ? Math.round(s[a]) : null))
                .filter((v): v is number => v != null)
                .join(" → ")
            return (
              <tr key={d.constituency.constituencyNumber} className="border-t">
                <td className={cell}>
                  <Link
                    to={buildSeatUrl(d.constituency)}
                    className="font-medium hover:underline"
                  >
                    {displayConstituencyName(d.constituency)}
                  </Link>
                </td>
                <td className={cell}>
                  <div
                    className={cn(
                      "text-xs",
                      ALLIANCE_TEXT_CLASS[ga] ?? "text-foreground"
                    )}
                  >
                    {ALLIANCE_LABEL[ga]} {trail(ga)}
                  </div>
                  <div
                    className={cn(
                      "text-xs",
                      ALLIANCE_TEXT_CLASS[lo] ?? "text-muted-foreground"
                    )}
                  >
                    {ALLIANCE_LABEL[lo]} {trail(lo)}
                  </div>
                </td>
                <td className={cn(cell, "text-right")}>
                  <div
                    className={cn(
                      "text-xs",
                      deltaColor(d.cumulative[ga], 1)
                    )}
                  >
                    {ALLIANCE_LABEL[ga]} {fmtSigned(d.cumulative[ga])}
                  </div>
                  <div
                    className={cn(
                      "text-xs",
                      deltaColor(d.cumulative[lo], 1)
                    )}
                  >
                    {ALLIANCE_LABEL[lo]} {fmtSigned(d.cumulative[lo])}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {drifts.length > 8 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Showing top 8 of {drifts.length} by net shift magnitude.
        </p>
      )}
    </div>
  )
}

// helper used by sort-helpers above too
export type AllianceSharesView = AllianceShares
