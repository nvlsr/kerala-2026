import { useMemo, useState } from "react"

import paths from "@data/kerala-constituencies-paths.json"
import { Section } from "@/components/section"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { tint } from "@/lib/color"
import {
  allianceForCandidate,
  allianceForRawParty,
  canonicalPartyName,
  constituencies as allConstituencies,
  displayConstituencyName,
  formatPercent,
  get2021Baseline,
  getAlliance,
  getHistoricalFor,
  isMainFront,
  partyShort,
  totalVotesIn,
  winnerOf,
  type AllianceCode,
  type Constituency,
} from "@/lib/data"

type Overlay = "alliance" | "margin" | "swing" | "flips"

type Props = {
  scope: string | null
  selectedSeat: number | null
  onSelect: (n: number | null) => void
}

const FRONTS: AllianceCode[] = ["UDF", "LDF", "NDA"]

export function ConstituencyMap({ scope, selectedSeat, onSelect }: Props) {
  const [overlay, setOverlay] = useState<Overlay>("alliance")
  const [hovered, setHovered] = useState<number | null>(null)

  const fills = useMemo(() => computeFills(overlay), [overlay])

  const focusedSeat = hovered ?? selectedSeat

  return (
    <Section
      title="Constituency map"
      subtitle="click a seat to drill in"
      actions={
        <ToggleGroup
          value={[overlay]}
          onValueChange={(v) => {
            const next = (v[0] as Overlay | undefined) ?? "alliance"
            setOverlay(next)
          }}
          variant="outline"
          size="sm"
          spacing={0}
        >
          <ToggleGroupItem value="alliance">Winner</ToggleGroupItem>
          <ToggleGroupItem value="margin">Margin</ToggleGroupItem>
          <ToggleGroupItem value="swing">Swing '21</ToggleGroupItem>
          <ToggleGroupItem value="flips">Flips</ToggleGroupItem>
        </ToggleGroup>
      }
    >
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
              const inScope = !scope || c.districtId === scope
              const fill = fills.get(num) ?? {
                color: "var(--muted)",
                opacity: 0.2,
              }
              const baseOpacity = inScope ? fill.opacity : fill.opacity * 0.25
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
            <SeatPanel constituencyNumber={focusedSeat} overlay={overlay} />
          ) : (
            <OverlayLegend overlay={overlay} />
          )}
        </div>
      </div>
    </Section>
  )
}

type Fill = { color: string; opacity: number }

function computeFills(overlay: Overlay): Map<number, Fill> {
  const map = new Map<number, Fill>()

  for (const c of allConstituencies) {
    const winner = winnerOf(c)
    const allianceCode = allianceForCandidate(c, winner)
    const allianceMeta = getAlliance(allianceCode)
    const total = totalVotesIn(c)
    const marginPct = total > 0 ? (winner.margin / total) * 100 : 0

    let fill: Fill = { color: allianceMeta.color, opacity: 0.6 }

    if (overlay === "alliance") {
      fill = {
        color: allianceMeta.color,
        opacity: isMainFront(allianceCode) ? 0.7 : 0.25,
      }
    } else if (overlay === "margin") {
      // Tighter race = lighter; landslide = saturated
      const o = Math.min(0.95, 0.2 + (marginPct / 40) * 0.75)
      fill = { color: allianceMeta.color, opacity: o }
    } else if (overlay === "swing") {
      // Color by which front gained the most share vs 2021. Magnitude → opacity.
      const swing = computeSwing(c)
      if (swing) {
        const code = swing.code
        const meta = getAlliance(code)
        const o = Math.min(0.95, 0.2 + (Math.abs(swing.delta) / 15) * 0.75)
        fill = { color: meta.color, opacity: o }
      } else {
        fill = { color: "var(--muted-foreground)", opacity: 0.15 }
      }
    } else if (overlay === "flips") {
      const prevAlliance = previousWinningAlliance(c)
      const flipped = prevAlliance != null && prevAlliance !== allianceCode
      if (flipped) {
        fill = { color: allianceMeta.color, opacity: 0.85 }
      } else {
        fill = { color: allianceMeta.color, opacity: 0.15 }
      }
    }

    map.set(c.constituencyNumber, fill)
  }
  return map
}

function computeSwing(
  c: Constituency
): { code: AllianceCode; delta: number } | null {
  // For each main front, find the candidate from that alliance in 2026 and 2021.
  // Pick the alliance with the largest |Δ share|.
  const total = totalVotesIn(c)
  if (total === 0) return null

  let best: { code: AllianceCode; delta: number } | null = null
  for (const code of FRONTS) {
    const cand = c.candidates.find(
      (x) => !x.isNota && allianceForCandidate(c, x) === code
    )
    if (!cand) continue
    const baseline = get2021Baseline(c, cand.party)
    if (!baseline) continue
    const share = (cand.votes / total) * 100
    const delta = share - baseline.sharePct
    if (best == null || Math.abs(delta) > Math.abs(best.delta)) {
      best = { code, delta }
    }
  }
  return best
}

function previousWinningAlliance(c: Constituency): AllianceCode | null {
  const hist = getHistoricalFor(c.constituencyNumber)
  if (!hist) return null
  const prev = hist.elections.find(
    (e) => e.type === "general" && e.year === 2021
  )
  if (!prev || prev.candidates.length === 0) return null
  const sorted = [...prev.candidates].sort((a, b) => b.votes - a.votes)
  const partyCanonical = canonicalPartyName(sorted[0]!.party)
  if (partyCanonical === "Independent") return null
  return allianceForRawParty(partyCanonical)
}

function SeatPanel({
  constituencyNumber,
  overlay,
}: {
  constituencyNumber: number
  overlay: Overlay
}) {
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
  const swing = computeSwing(c)

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
      <dl className="grid grid-cols-3 gap-2 text-xs">
        <Stat label="Share" value={formatPercent(share / 100, 1)} />
        <Stat label="Margin" value={`+${formatPercent(marginPct / 100, 1)}`} />
        {overlay === "swing" && swing ? (
          <Stat
            label={`Swing ${getAlliance(swing.code).code}`}
            value={`${swing.delta >= 0 ? "+" : ""}${formatPercent(swing.delta / 100, 1)}`}
          />
        ) : (
          <div />
        )}
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

function OverlayLegend({ overlay }: { overlay: Overlay }) {
  const text =
    overlay === "alliance"
      ? "Filled by the winning alliance in each constituency."
      : overlay === "margin"
        ? "Filled by winning alliance, with opacity scaled to margin (a tight win is pale; a landslide is saturated)."
        : overlay === "swing"
          ? "Filled by the alliance with the biggest vote-share movement vs 2021. Opacity scales with magnitude."
          : "Filled when the seat changed alliances since 2021. Held seats are dimmed."

  return (
    <div className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
      <div className="mb-2 font-medium tracking-wide text-foreground/70 uppercase">
        Hover or click a seat
      </div>
      {text}
    </div>
  )
}
