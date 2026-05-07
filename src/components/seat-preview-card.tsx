import { IconCheck } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import {
  allianceForCandidate,
  displayConstituencyName,
  districtForConstituency,
  formatNumber,
  formatPercent,
  getAlliance,
  isMainFront,
  normalizeCandidateName,
  partyShort,
  totalVotesIn,
  winnerOf,
  type Constituency,
} from "@/lib/data"

type Props = {
  constituency: Constituency
}

/**
 * Compact preview shown in the detail column while the user is
 * hovering a seat on the map (and no seat is committed). Surfaces
 * the headline answer ("who won this seat?") plus a few stats, with
 * a note prompting click-to-commit. Replaced the old hover behavior
 * inside the map's right panel after that panel was removed in the
 * layout restructure.
 */
export function SeatPreviewCard({ constituency }: Props) {
  const winner = winnerOf(constituency)
  const allianceCode = allianceForCandidate(constituency, winner)
  const meta = getAlliance(allianceCode)
  const main = isMainFront(allianceCode)
  const total = totalVotesIn(constituency)
  const sharePct = total > 0 ? (winner.votes / total) * 100 : 0
  const marginPct = total > 0 ? (winner.margin / total) * 100 : 0
  const district = districtForConstituency(constituency)

  return (
    <div className="rounded-lg border border-dashed p-4 text-xs">
      <div className="mb-3 flex items-baseline gap-2 font-medium tracking-wide text-foreground/80 uppercase">
        <span>{displayConstituencyName(constituency)}</span>
        {district && (
          <span className="text-[10px] text-muted-foreground/70">
            · {district.name} district
          </span>
        )}
      </div>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <IconCheck
          className="h-3.5 w-3.5 shrink-0 text-emerald-500"
          aria-label="Winner"
        />
        <span className="font-medium">
          {normalizeCandidateName(winner.name)}
        </span>
        <span className="text-muted-foreground" title={winner.party}>
          {partyShort(winner.party)}
        </span>
        <span
          className={cn(
            "rounded px-1 py-px text-[10px] font-semibold tracking-wider uppercase",
            !main && "text-muted-foreground"
          )}
          style={
            main
              ? { color: "#fff", backgroundColor: meta.color }
              : undefined
          }
        >
          {meta.code}
        </span>
      </div>
      <dl className="grid grid-cols-3 gap-3">
        <Stat label="Share" value={formatPercent(sharePct / 100, 1)} />
        <Stat
          label="Margin"
          value={`+${formatPercent(marginPct / 100, 1)}`}
        />
        <Stat label="Votes" value={formatNumber(winner.votes)} />
      </dl>
      <div className="mt-3 text-[10px] tracking-wide text-muted-foreground/70 uppercase">
        Click for full detail
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-wide text-muted-foreground/80 uppercase">
        {label}
      </dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  )
}
