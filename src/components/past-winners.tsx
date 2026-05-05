import { tint } from "@/lib/color"
import { cn } from "@/lib/utils"
import {
  formatPercent,
  getAlliance,
  getPastCandidates,
  normalizeCandidateName,
  type PastCandidate,
} from "@/lib/data"

type Props = {
  constituencyNumber: number
  selectedParty: string | null
}

export function PastWinners({ constituencyNumber, selectedParty }: Props) {
  const records = getPastCandidates(constituencyNumber, selectedParty)

  if (records.length === 0) {
    return (
      <div className="py-3 text-center text-xs text-muted-foreground">
        Did not contest in any post-2008 election.
      </div>
    )
  }

  return (
    <ul className="flex flex-col">
      {records.map((r) => (
        <PastCandidateRow
          key={`${r.year}-${r.type}`}
          record={r}
          showParty={selectedParty == null}
        />
      ))}
    </ul>
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
  const marginText = `${record.marginPct >= 0 ? "+" : ""}${formatPercent(
    record.marginPct / 100,
    1
  )}`

  return (
    <li
      className={cn(
        "flex items-center gap-2 border-b border-border/40 py-1.5 text-xs last:border-b-0",
        record.isCurrent && !record.didNotContest && "font-medium",
        record.didNotContest && "text-muted-foreground/60"
      )}
    >
      <span className="w-9 shrink-0 text-muted-foreground tabular-nums">
        {record.year}
      </span>
      {showParty && (
        <span className="flex w-16 shrink-0 items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: meta.color }}
            aria-hidden
          />
          <span className="truncate text-foreground/80" title={record.party}>
            {record.partyShort}
          </span>
        </span>
      )}
      <span
        className="min-w-0 flex-1 truncate"
        title={record.didNotContest ? undefined : record.winnerName}
      >
        {record.didNotContest
          ? "did not contest"
          : normalizeCandidateName(record.winnerName)}
      </span>
      {record.type === "by-election" && (
        <span className="shrink-0 rounded px-1 py-px text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase ring-1 ring-border ring-inset">
          by-poll
        </span>
      )}
      {record.isWinnerOfElection && !showParty && !record.didNotContest && (
        <span
          className="shrink-0 rounded px-1 py-px text-[9px] font-semibold tracking-wider uppercase"
          style={{
            color: meta.color,
            backgroundColor: tint.bg(meta.color),
          }}
        >
          won
        </span>
      )}
      {record.isCurrent && !record.didNotContest && (
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
      <span className="w-12 shrink-0 text-right tabular-nums">
        {record.didNotContest ? "—" : formatPercent(record.share / 100, 1)}
      </span>
      <span className="w-16 shrink-0 text-right text-muted-foreground tabular-nums">
        {record.didNotContest ? "—" : marginText}
      </span>
    </li>
  )
}
