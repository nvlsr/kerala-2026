import { Card } from "@/components/ui/card"
import { AlliancePill } from "@/components/alliance-pill"
import { cn } from "@/lib/utils"
import {
  allianceForCandidate,
  displayConstituencyName,
  formatNumber,
  formatPercent,
  getAlliance,
  isMainFront,
  normalizeCandidateName,
  partyShort,
  runnerUpOf,
  secondRunnerUpOf,
  totalVotesIn,
  winnerOf,
  type Candidate,
  type Constituency,
} from "@/lib/data"

export type SeatView = "winner" | "runnerUp" | "secondRunnerUp"

// eslint-disable-next-line react-refresh/only-export-components
export function subjectOf(c: Constituency, view: SeatView): Candidate | null {
  switch (view) {
    case "winner":
      return winnerOf(c)
    case "runnerUp":
      return runnerUpOf(c)
    case "secondRunnerUp":
      return secondRunnerUpOf(c)
  }
}

type Props = {
  constituency: Constituency
  view: SeatView
  onSelect: (n: number) => void
}

export function SeatCard({ constituency, view, onSelect }: Props) {
  const subject = subjectOf(constituency, view)
  const total = totalVotesIn(constituency)
  const allianceCode = subject
    ? allianceForCandidate(constituency, subject)
    : "OTHER"
  const alliance = getAlliance(allianceCode)
  const main = isMainFront(allianceCode)

  const subjectShare = subject && total > 0 ? subject.votes / total : 0
  const shareMargin = subject && total > 0 ? subject.margin / total : 0
  const marginPositive = subject ? subject.margin >= 0 : false

  return (
    <Card
      size="sm"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(constituency.constituencyNumber)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(constituency.constituencyNumber)
        }
      }}
      className={cn(
        "relative cursor-pointer gap-2 px-3 py-3 text-left transition-shadow",
        "hover:shadow-sm hover:ring-foreground/30",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      )}
    >
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: main ? alliance.color : "var(--border)" }}
        aria-hidden
      />
      <div className="flex items-baseline justify-between gap-2 pl-1.5">
        <h3 className="truncate text-sm font-semibold tracking-tight">
          {displayConstituencyName(constituency)}
        </h3>
        <AlliancePill code={allianceCode} />
      </div>

      <div className="min-w-0 pl-1.5">
        <div className="truncate text-sm font-medium">
          {subject ? normalizeCandidateName(subject.name) : "—"}
        </div>
        <div
          className="truncate text-xs text-muted-foreground"
          title={subject?.party}
        >
          {subject ? partyShort(subject.party) : "—"}
        </div>
      </div>

      {subject && (
        <div className="mt-auto grid grid-cols-2 gap-2 pt-1 pl-1.5 text-[11px] tabular-nums">
          <div className="flex flex-col">
            <span className="text-muted-foreground">
              {formatNumber(subject.votes)}
            </span>
            <span>{formatPercent(subjectShare, 1)}</span>
          </div>
          <div
            className={cn(
              "flex flex-col items-end rounded-md px-1.5 py-0.5",
              !main && "bg-muted/60 text-muted-foreground"
            )}
            style={
              main
                ? {
                    color: alliance.color,
                    backgroundColor: alliance.color + "12",
                  }
                : undefined
            }
            title={
              view === "winner" ? "Margin over runner-up" : "Gap behind winner"
            }
          >
            <span>
              {marginPositive ? "+" : ""}
              {formatNumber(subject.margin)}
            </span>
            <span>
              {marginPositive ? "+" : ""}
              {formatPercent(shareMargin, 1)}
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}
