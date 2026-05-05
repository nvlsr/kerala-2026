import { useMemo, useState } from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AlliancePill } from "@/components/alliance-pill"
import {
  PartyHistoricalChart,
  type PartyMode,
} from "@/components/party-historical-chart"
import {
  formatNumber,
  formatPercent,
  getAlliance,
  getPartyConstituencies,
  getPartyTrendData,
  normalizeCandidateName,
  partyShort,
  type PartyLens,
} from "@/lib/data"

type Props = {
  party: string | null
  scope: string | null
  onClose: () => void
  onSelectConstituency: (n: number) => void
}

export function PartyDetail({
  party,
  scope,
  onClose,
  onSelectConstituency,
}: Props) {
  return (
    <Sheet
      open={party != null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent
        side="right"
        className="!w-full sm:!max-w-2xl md:!max-w-3xl lg:!max-w-4xl"
      >
        {party && (
          <PartyBody
            party={party}
            scope={scope}
            onSelectConstituency={onSelectConstituency}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

function PartyBody({
  party,
  scope,
  onSelectConstituency,
}: {
  party: string
  scope: string | null
  onSelectConstituency: (n: number) => void
}) {
  const [mode, setMode] = useState<PartyMode>("share")
  const [lens, setLens] = useState<PartyLens>("top-share")

  const trend = useMemo(() => getPartyTrendData(party, scope), [party, scope])
  const meta = getAlliance(trend.allianceCode)
  const current = trend.points[trend.points.length - 1]
  const previous =
    trend.points.length >= 2 ? trend.points[trend.points.length - 2] : null

  return (
    <div className="flex h-full flex-col">
      <div
        className="h-1 w-full shrink-0"
        style={{ backgroundColor: trend.color }}
        aria-hidden
      />
      <div className="border-b px-6 py-5">
        <SheetDescription className="text-xs font-medium tracking-wide uppercase">
          {scope ? "District" : "Kerala"} · Party · {trend.partyShort}
        </SheetDescription>
        <div className="flex items-baseline gap-2">
          <SheetTitle className="font-heading text-2xl font-semibold tracking-tight">
            {party}
          </SheetTitle>
          <AlliancePill code={trend.allianceCode} />
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Aligned with {meta.name}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-b px-6 py-3 text-sm">
        <div className="flex items-center gap-6">
          <InlineStat
            label="Seats won"
            value={current ? `${current.seats} / ${trend.totalSeats}` : "—"}
          />
          <InlineStat
            label="Vote share"
            value={current ? formatPercent(current.share / 100, 2) : "—"}
            delta={current && previous ? current.share - previous.share : null}
          />
          <InlineStat
            label="Contested"
            value={current ? String(current.contested) : "—"}
          />
        </div>
        <ToggleGroup
          value={[mode]}
          onValueChange={(v) => {
            const next = (v[0] as PartyMode | undefined) ?? mode
            setMode(next)
          }}
          variant="outline"
          size="sm"
          spacing={0}
        >
          <ToggleGroupItem value="share">Share %</ToggleGroupItem>
          <ToggleGroupItem value="seats">Seats</ToggleGroupItem>
          <ToggleGroupItem value="votes">Votes</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mb-5 rounded-lg border bg-muted/40 p-4">
          <div className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            History · 2011 → 2026
          </div>
          {trend.years.length === 0 ? (
            <div className="py-3 text-center text-xs text-muted-foreground">
              No historical data.
            </div>
          ) : (
            <PartyHistoricalChart party={party} scope={scope} mode={mode} />
          )}
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Constituencies · top 10
            </div>
            <ToggleGroup
              value={[lens]}
              onValueChange={(v) => {
                const next = (v[0] as PartyLens | undefined) ?? lens
                setLens(next)
              }}
              variant="outline"
              size="sm"
              spacing={0}
            >
              <ToggleGroupItem value="top-share">Top share</ToggleGroupItem>
              <ToggleGroupItem value="won">Won</ToggleGroupItem>
              <ToggleGroupItem value="closest-losses">
                Closest losses
              </ToggleGroupItem>
              <ToggleGroupItem value="biggest-gains">
                Biggest gains
              </ToggleGroupItem>
              <ToggleGroupItem value="biggest-declines">
                Biggest declines
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <ConstituenciesTable
            party={party}
            scope={scope}
            lens={lens}
            mode={mode}
            color={trend.color}
            onSelectConstituency={onSelectConstituency}
          />
          <div className="mt-3 text-[11px] leading-relaxed text-muted-foreground/70">
            Showing top 10 of constituencies where {trend.partyShort} fielded a
            candidate in 2026. Gains/declines compare 2026 vote share against
            2021.
          </div>
        </div>
      </div>
    </div>
  )
}

const LENS_EMPTY: Record<PartyLens, string> = {
  "top-share": "Did not contest in 2026.",
  won: "No seats won in 2026.",
  "closest-losses": "No losses in 2026.",
  "biggest-gains": "No comparable 2021 contests.",
  "biggest-declines": "No comparable 2021 contests.",
}

function ConstituenciesTable({
  party,
  scope,
  lens,
  mode,
  color,
  onSelectConstituency,
}: {
  party: string
  scope: string | null
  lens: PartyLens
  mode: PartyMode
  color: string
  onSelectConstituency: (n: number) => void
}) {
  const rows = useMemo(
    () => getPartyConstituencies(party, lens, scope),
    [party, lens, scope]
  )

  if (rows.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground">
        {LENS_EMPTY[lens]}
      </div>
    )
  }

  return (
    <ul className="flex flex-col">
      {rows.map((r) => {
        const winnerMeta = getAlliance(r.winnerAllianceCode)
        const primary =
          mode === "share"
            ? formatPercent(r.share / 100, 1)
            : mode === "votes"
              ? formatNumber(r.votes)
              : `#${r.rank}`
        const marginText =
          mode === "share"
            ? `${r.marginPct >= 0 ? "+" : ""}${formatPercent(r.marginPct / 100, 1)}`
            : `${r.margin >= 0 ? "+" : ""}${formatNumber(r.margin)}`
        const showDelta =
          (lens === "biggest-gains" || lens === "biggest-declines") &&
          r.shareDelta != null
        return (
          <li
            key={r.constituencyNumber}
            className="border-b border-border/40 last:border-b-0"
          >
            <button
              type="button"
              onClick={() => onSelectConstituency(r.constituencyNumber)}
              className="flex w-full items-center gap-3 py-2 text-left text-xs hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:outline-none"
            >
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: r.isWinner ? color : winnerMeta.color,
                }}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">
                  {r.constituencyName}
                </span>
                <span className="truncate text-muted-foreground">
                  {normalizeCandidateName(r.candidateName)} ·{" "}
                  {r.isWinner
                    ? "won"
                    : `lost to ${partyShort(r.winnerParty)} (#${r.rank})`}
                </span>
              </span>
              {showDelta ? (
                <span
                  className="w-20 shrink-0 text-right tabular-nums"
                  style={{
                    color: (r.shareDelta ?? 0) >= 0 ? color : undefined,
                  }}
                >
                  {(r.shareDelta ?? 0) >= 0 ? "+" : ""}
                  {formatPercent((r.shareDelta ?? 0) / 100, 1)}
                </span>
              ) : (
                <span className="w-16 shrink-0 text-right tabular-nums">
                  {primary}
                </span>
              )}
              <span className="w-16 shrink-0 text-right text-muted-foreground tabular-nums">
                {marginText}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function InlineStat({
  label,
  value,
  delta,
}: {
  label: string
  value: string
  delta?: number | null
}) {
  return (
    <div>
      <div className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-base font-medium tabular-nums">{value}</span>
        {delta != null && (
          <span
            className={
              delta >= 0
                ? "text-[10px] text-emerald-600 tabular-nums dark:text-emerald-500"
                : "text-[10px] text-red-600 tabular-nums dark:text-red-500"
            }
          >
            {delta >= 0 ? "+" : ""}
            {formatPercent(delta / 100, 1)}
          </span>
        )}
      </div>
    </div>
  )
}
