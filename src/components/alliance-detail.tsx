import { useMemo, useState } from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import {
  AllianceHistoricalChart,
  type AllianceMode,
} from "@/components/alliance-historical-chart"
import { PartyLink } from "@/components/party-link"
import {
  formatNumber,
  formatPercent,
  getAlliance,
  getAllianceBreakdown,
  getAllianceTrendData,
  getDistrict,
  getStateSummary,
  type AllianceCode,
  type PartyBreakdown,
} from "@/lib/data"

type Props = {
  alliance: AllianceCode | null
  scope: string | null
  onClose: () => void
  onSelectParty: (party: string) => void
}

export function AllianceDetail({
  alliance,
  scope,
  onClose,
  onSelectParty,
}: Props) {
  return (
    <Sheet
      open={alliance != null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent
        side="right"
        className="!w-full sm:!max-w-2xl md:!max-w-3xl lg:!max-w-4xl"
      >
        {alliance && (
          <AllianceBody
            code={alliance}
            scope={scope}
            onSelectParty={onSelectParty}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

function AllianceBody({
  code,
  scope,
  onSelectParty,
}: {
  code: AllianceCode
  scope: string | null
  onSelectParty: (party: string) => void
}) {
  const [mode, setMode] = useState<AllianceMode>("share")
  const meta = getAlliance(code)
  const breakdown = getAllianceBreakdown(code, scope)
  const district = scope ? getDistrict(scope) : null
  const summary = getStateSummary(scope)

  return (
    <div className="flex h-full flex-col">
      <div
        className="h-1 w-full shrink-0"
        style={{ backgroundColor: meta.color }}
        aria-hidden
      />
      <div className="border-b px-6 py-5">
        <SheetDescription className="text-xs font-medium tracking-wide uppercase">
          {district
            ? `${district.name} · Alliance · ${meta.code}`
            : `Kerala · Alliance · ${meta.code}`}
        </SheetDescription>
        <SheetTitle className="font-heading text-2xl font-semibold tracking-tight">
          {meta.name}
        </SheetTitle>
        {meta.ledBy && (
          <div className="mt-1 text-xs text-muted-foreground">
            Led by {meta.ledBy}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-b px-6 py-3 text-sm">
        <div className="flex items-center gap-6">
          <InlineStat
            label="Seats won"
            value={`${breakdown.totalSeats} / ${summary.totalSeats}`}
          />
          <InlineStat
            label="Vote share"
            value={formatPercent(breakdown.totalVoteShare, 2)}
          />
          <InlineStat
            label="Candidates"
            value={String(breakdown.totalContested)}
          />
        </div>
        <ToggleGroup
          value={[mode]}
          onValueChange={(v) => {
            const next = (v[0] as AllianceMode | undefined) ?? mode
            setMode(next)
          }}
          variant="outline"
          size="sm"
          spacing={0}
        >
          <ToggleGroupItem value="share">Share %</ToggleGroupItem>
          <ToggleGroupItem value="seats">Seats</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mb-5 rounded-lg border bg-muted/40 p-4">
          <div className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            History · 2011 → 2026
          </div>
          <AllianceHistoricalChart selected={code} scope={scope} mode={mode} />
          <Legend selected={code} />
        </div>

        <div className="mb-5 rounded-lg border bg-muted/40 p-4">
          <div className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            By election cycle
          </div>
          <CycleTable code={code} scope={scope} mode={mode} />
          <div className="mt-3 text-[11px] leading-relaxed text-muted-foreground/70">
            Alliance composition anchored on 2026. Parties are classified by
            their current 2026 alliance for all cycles, so historical totals do
            not reflect alliance switches (e.g. KEC(M) flipped UDF→LDF in 2018).
          </div>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Member parties · {breakdown.parties.length}
          </div>
          {breakdown.parties.length === 0 ? (
            <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
              No parties recorded for this alliance.
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {breakdown.parties.map((p) => (
                <PartyRow
                  key={p.party}
                  party={p}
                  color={meta.color}
                  shareScopeLabel={district ? "district share" : "statewide"}
                  onSelectParty={onSelectParty}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

const FRONTS: AllianceCode[] = ["UDF", "LDF", "NDA"]

function Legend({ selected }: { selected: AllianceCode }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
      {FRONTS.map((code) => {
        const meta = getAlliance(code)
        const active = code === selected
        return (
          <span key={code} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: meta.color,
                opacity: active ? 1 : 0.45,
              }}
              aria-hidden
            />
            <span
              className={cn(
                "font-medium text-foreground/80",
                !active && "text-muted-foreground/70"
              )}
            >
              {meta.code}
            </span>
          </span>
        )
      })}
    </div>
  )
}

function CycleTable({
  code,
  scope,
  mode,
}: {
  code: AllianceCode
  scope: string | null
  mode: AllianceMode
}) {
  const trend = useMemo(() => getAllianceTrendData(scope), [scope])
  const meta = getAlliance(code)
  const points = trend.series[code]

  if (points.length === 0) {
    return (
      <div className="py-3 text-center text-xs text-muted-foreground">
        No historical data.
      </div>
    )
  }

  return (
    <ul className="flex flex-col">
      {points.map((p, i) => {
        const prev = i > 0 ? points[i - 1] : null
        const seatsDelta = prev ? p.seats - prev.seats : null
        const shareDelta = prev ? p.share - prev.share : null
        const primaryValue =
          mode === "share"
            ? formatPercent(p.share / 100, 1)
            : `${p.seats} / ${trend.totalSeats}`
        const primaryDelta =
          mode === "share"
            ? shareDelta != null
              ? `${shareDelta >= 0 ? "+" : ""}${formatPercent(
                  shareDelta / 100,
                  1
                )}`
              : null
            : seatsDelta != null
              ? `${seatsDelta >= 0 ? "+" : ""}${seatsDelta}`
              : null
        return (
          <li
            key={p.year}
            className="flex items-center gap-3 border-b border-border/40 py-1.5 text-xs last:border-b-0"
          >
            <span className="w-9 shrink-0 text-muted-foreground tabular-nums">
              {p.year}
            </span>
            <span className="flex w-20 shrink-0 items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: meta.color }}
                aria-hidden
              />
              <span className="text-foreground/80">{meta.code}</span>
            </span>
            <span className="flex-1 truncate text-muted-foreground">
              {p.contested} candidate{p.contested === 1 ? "" : "s"} ·{" "}
              {formatNumber(p.votes)} votes
            </span>
            <span className="w-24 shrink-0 text-right font-medium tabular-nums">
              {primaryValue}
            </span>
            <span className="w-14 shrink-0 text-right text-muted-foreground tabular-nums">
              {primaryDelta ?? "—"}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function InlineStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="text-base font-medium tabular-nums">{value}</div>
    </div>
  )
}

function PartyRow({
  party,
  color,
  shareScopeLabel,
  onSelectParty,
}: {
  party: PartyBreakdown
  color: string
  shareScopeLabel: string
  onSelectParty: (party: string) => void
}) {
  const winRate = party.contested > 0 ? party.won / party.contested : 0

  return (
    <li className="rounded-lg border bg-background p-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <PartyLink
              party={party.party}
              onSelect={onSelectParty}
              className="text-sm font-semibold"
            >
              {party.partyShort}
            </PartyLink>
            <PartyLink
              party={party.party}
              onSelect={onSelectParty}
              className="truncate text-xs text-muted-foreground"
            >
              {party.party}
            </PartyLink>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-medium tabular-nums">
            {party.won}
            <span className="text-muted-foreground"> / {party.contested}</span>
            <span className="ml-1 text-xs text-muted-foreground">won</span>
          </div>
          <div className="text-[11px] text-muted-foreground tabular-nums">
            {formatPercent(winRate, 0)} win rate
          </div>
        </div>
      </div>
      <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${winRate * 100}%`, backgroundColor: color }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="tabular-nums">{formatNumber(party.votes)} votes</span>
        <span className="tabular-nums">
          {formatPercent(party.voteShare, 2)} {shareScopeLabel}
        </span>
      </div>
    </li>
  )
}
