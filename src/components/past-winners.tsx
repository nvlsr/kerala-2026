import { IconCheck } from "@tabler/icons-react"

import { tint } from "@/lib/color"
import { cn } from "@/lib/utils"
import {
  formatNumber,
  formatPercent,
  getAlliance,
  getPastCandidates,
  isMainFront,
  normalizeCandidateName,
  type PastCandidate,
} from "@/lib/data"

type Props = {
  constituencyNumber: number
  selectedParty: string | null
}

export function PastWinners({ constituencyNumber, selectedParty }: Props) {
  const records = getPastCandidates(constituencyNumber, selectedParty)
  const showParty = selectedParty == null

  if (records.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground">
        Did not contest in any post-2008 election.
      </div>
    )
  }

  return (
    <table className="w-full table-fixed text-sm">
      <colgroup>
        <col style={{ width: "10%" }} />
        {showParty && <col style={{ width: "12%" }} />}
        <col style={{ width: showParty ? "32%" : "44%" }} />
        <col style={{ width: "7%" }} />
        <col style={{ width: "14%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "15%" }} />
      </colgroup>
      <thead className="bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <tr>
          <th className="border-b px-3 py-2 text-left">Year</th>
          {showParty && <th className="border-b px-3 py-2 text-left">Party</th>}
          <th className="border-b px-3 py-2 text-left">Candidate</th>
          <th className="border-b px-3 py-2 text-center">
            <IconCheck
              className="inline-block h-3.5 w-3.5"
              aria-label="Winner"
            />
          </th>
          <th className="border-b px-3 py-2 text-right">Votes</th>
          <th className="border-b px-3 py-2 text-right">Share</th>
          <th className="border-b px-3 py-2 text-right">Margin</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <PastCandidateRow
            key={`${r.year}-${r.type}`}
            record={r}
            showParty={showParty}
          />
        ))}
      </tbody>
    </table>
  )
}

function PastCandidateRow({
  record,
  showParty,
}: {
  record: PastCandidate
  showParty: boolean
}) {
  const meta = getAlliance(record.allianceCode)
  const main = isMainFront(record.allianceCode)
  const dnc = record.didNotContest
  const marginText = `${record.marginPct >= 0 ? "+" : ""}${formatPercent(
    record.marginPct / 100,
    1
  )}`

  return (
    <tr
      className={cn(
        "border-b last:border-b-0",
        record.isCurrent && !dnc && "font-medium",
        dnc && "text-muted-foreground/60"
      )}
    >
      <td className="px-3 py-2 text-muted-foreground tabular-nums">
        {record.year}
      </td>
      {showParty && (
        <td className="relative px-3 py-2">
          {!dnc && (
            <span
              className="absolute inset-y-0 left-0 w-0.5"
              style={{
                backgroundColor: main ? meta.color : "var(--border)",
              }}
              aria-hidden
            />
          )}
          <span className="block truncate" title={record.party}>
            {dnc ? "—" : record.partyShort}
          </span>
        </td>
      )}
      <td
        className={cn(
          "relative px-3 py-2",
          // Apply alliance accent to candidate cell when party column is hidden
          // (party-pill view); same pattern as RosterTable's accent.
          !showParty && !dnc && "border-l-0"
        )}
      >
        {!showParty && !dnc && (
          <span
            className="absolute inset-y-0 left-0 w-0.5"
            style={{
              backgroundColor: main ? meta.color : "var(--border)",
            }}
            aria-hidden
          />
        )}
        <span
          className="flex items-center gap-1.5"
          title={dnc ? undefined : record.winnerName}
        >
          <span className="truncate">
            {dnc
              ? "did not contest"
              : normalizeCandidateName(record.winnerName)}
          </span>
          {record.type === "by-election" && !dnc && (
            <span className="shrink-0 rounded px-1 py-px text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase ring-1 ring-border ring-inset">
              by-poll
            </span>
          )}
          {record.isCurrent && !dnc && (
            <span
              className="shrink-0 rounded px-1 py-px text-[9px] font-semibold tracking-wider uppercase"
              style={{
                color: meta.color,
                backgroundColor: tint.bg(meta.color),
              }}
            >
              current
            </span>
          )}
        </span>
      </td>
      <td className="px-3 py-2 text-center">
        {record.isWinnerOfElection && !dnc && (
          <IconCheck
            className="inline-block h-3.5 w-3.5 text-emerald-500"
            aria-label="Winner"
          />
        )}
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        {dnc ? "—" : formatNumber(record.votes)}
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        {dnc ? "—" : formatPercent(record.share / 100, 1)}
      </td>
      <td
        className={cn(
          "px-3 py-2 text-right tabular-nums",
          record.isWinnerOfElection && !dnc
            ? "text-foreground"
            : "text-muted-foreground"
        )}
      >
        {dnc ? "—" : marginText}
      </td>
    </tr>
  )
}
