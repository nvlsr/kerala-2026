import { IconCheck } from "@tabler/icons-react"

import { AlliancePill } from "@/components/alliance-pill"
import {
  allianceForCandidate,
  displayConstituencyName,
  districtForConstituency,
  formatNumber,
  formatPercent,
  normalizeCandidateName,
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
 * a note prompting click-to-commit.
 *
 * Layout is engineered for stability across hovers — fixed card
 * min-height, fixed positions for district (top-right) and
 * AlliancePill (right-of-row), `truncate` on variable-length text
 * so long names don't wrap. Pointer-events-none lets the cursor
 * pass through to the map underneath so the user can quickly hover
 * adjacent seats without the card's edges interfering.
 */
export function SeatPreviewCard({ constituency }: Props) {
  const winner = winnerOf(constituency)
  const allianceCode = allianceForCandidate(constituency, winner)
  const total = totalVotesIn(constituency)
  const sharePct = total > 0 ? (winner.votes / total) * 100 : 0
  const marginPct = total > 0 ? (winner.margin / total) * 100 : 0
  const district = districtForConstituency(constituency)

  return (
    <div className="min-h-[12rem] rounded-lg border border-dashed p-4 text-xs">
      <div className="mb-3 flex items-baseline gap-2">
        <span className="truncate font-medium tracking-wide text-foreground/80 uppercase">
          {displayConstituencyName(constituency)}
        </span>
        {district && (
          <span className="ml-auto shrink-0 text-[10px] tracking-wide text-muted-foreground/70 uppercase">
            {district.name} district
          </span>
        )}
      </div>
      <div className="mb-1 flex items-center gap-2 text-sm">
        <IconCheck
          className="h-3.5 w-3.5 shrink-0 text-emerald-500"
          aria-label="Winner"
        />
        <AlliancePill
          code={allianceCode}
          className="shrink-0 min-w-[3rem]"
        />
        <span className="min-w-0 truncate font-medium">
          {normalizeCandidateName(winner.name)}
        </span>
      </div>
      <div
        className="mb-4 truncate text-xs text-muted-foreground"
        title={winner.party}
      >
        {winner.party}
      </div>
      <dl className="grid grid-cols-3 gap-3">
        <Stat label="Share" value={formatPercent(sharePct / 100, 1)} />
        <Stat
          label="Margin"
          value={`+${formatPercent(marginPct / 100, 1)}`}
        />
        <Stat label="Votes" value={formatNumber(winner.votes)} />
      </dl>
      <div className="mt-4 text-[10px] tracking-wide text-muted-foreground/70 uppercase">
        Click for full detail
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] tracking-wide text-muted-foreground/80 uppercase">
        {label}
      </dt>
      <dd className="truncate font-medium tabular-nums">{value}</dd>
    </div>
  )
}
