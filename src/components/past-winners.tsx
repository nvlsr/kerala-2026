import { useState } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { type DrawerMode } from "@/components/historical-chart"
import {
  formatNumber,
  formatPercent,
  getAlliance,
  getPastCandidates,
  getTrendData,
  normalizeCandidateName,
  type PastCandidate,
} from "@/lib/data"

type Props = {
  constituencyNumber: number
  mode: DrawerMode
}

const WINNERS_KEY = "__winners__"

export function PastWinners({ constituencyNumber, mode }: Props) {
  const [partyKey, setPartyKey] = useState<string>(WINNERS_KEY)

  const trend = getTrendData(constituencyNumber)
  const partyOptions = trend?.series ?? []

  const records = getPastCandidates(
    constituencyNumber,
    partyKey === WINNERS_KEY ? null : partyKey
  )

  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <div className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Past candidates
      </div>

      <ToggleGroup
        value={[partyKey]}
        onValueChange={(v) => {
          const next = (v[0] as string | undefined) ?? WINNERS_KEY
          setPartyKey(next)
        }}
        variant="outline"
        size="sm"
        spacing={2}
        className="mb-3"
      >
        <ToggleGroupItem value={WINNERS_KEY} className="rounded-full">
          Winners
        </ToggleGroupItem>
        {partyOptions.map((p) => {
          const active = partyKey === p.party
          return (
            <ToggleGroupItem
              key={p.party}
              value={p.party}
              className="rounded-full"
              style={
                active
                  ? {
                      backgroundColor: p.color,
                      borderColor: p.color,
                      color: "#fff",
                    }
                  : undefined
              }
            >
              <span
                className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: p.color }}
                aria-hidden
              />
              {p.partyShort}
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>

      {records.length === 0 ? (
        <div className="py-3 text-center text-xs text-muted-foreground">
          Did not contest in any post-2008 election.
        </div>
      ) : (
        <ul className="flex flex-col">
          {records.map((r) => (
            <PastCandidateRow
              key={`${r.year}-${r.type}`}
              record={r}
              mode={mode}
              showParty={partyKey === WINNERS_KEY}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function PastCandidateRow({
  record,
  mode,
  showParty,
}: {
  record: PastCandidate
  mode: DrawerMode
  showParty: boolean
}) {
  const meta = getAlliance(record.allianceCode)
  const marginValue = mode === "share" ? record.marginPct : record.margin
  const marginText =
    mode === "share"
      ? `${marginValue >= 0 ? "+" : ""}${formatPercent(marginValue / 100, 1)}`
      : `${marginValue >= 0 ? "+" : ""}${formatNumber(marginValue)}`

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
            backgroundColor: meta.color + "1A",
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
            backgroundColor: meta.color + "1A",
          }}
        >
          current
        </span>
      )}
      <span className="w-12 shrink-0 text-right tabular-nums">
        {record.didNotContest
          ? "—"
          : mode === "share"
            ? formatPercent(record.share / 100, 1)
            : formatNumber(record.votes)}
      </span>
      <span className="w-16 shrink-0 text-right text-muted-foreground tabular-nums">
        {record.didNotContest ? "—" : marginText}
      </span>
    </li>
  )
}
