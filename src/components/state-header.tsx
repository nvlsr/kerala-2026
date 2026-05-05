import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DemographicsStrip } from "@/components/demographics-strip"
import { cn } from "@/lib/utils"
import {
  formatNumber,
  formatPercent,
  getAlliance,
  getStateSummary,
  type AllianceCode,
} from "@/lib/data"

const HERO_ALLIANCES: AllianceCode[] = ["UDF", "LDF", "NDA"]
const BAR_ALLIANCES: AllianceCode[] = ["UDF", "LDF", "NDA", "OTHER"]

type Props = {
  scope: string | null
  onSelectAlliance: (code: AllianceCode) => void
}

export function StateHeader({ scope, onSelectAlliance }: Props) {
  const summary = getStateSummary(scope)
  const seatRow = (code: AllianceCode) =>
    summary.rows.find((r) => r.code === code)!

  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <h2 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Summary
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {HERO_ALLIANCES.map((code) => {
            const row = seatRow(code)
            const meta = getAlliance(code)
            const isLeader =
              summary.totalSeats > 0 && row.seats > summary.totalSeats / 2
            return (
              <Card
                key={code}
                size="sm"
                role="button"
                tabIndex={0}
                onClick={() => onSelectAlliance(code)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onSelectAlliance(code)
                  }
                }}
                className={cn(
                  "cursor-pointer gap-1 px-4 py-3 transition-shadow",
                  "hover:shadow-sm hover:ring-foreground/30",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                )}
                style={{ borderColor: meta.color + "55" }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className="text-xs font-semibold tracking-wider uppercase"
                    style={{ color: meta.color }}
                  >
                    {meta.code}
                  </span>
                  {isLeader && (
                    <Badge
                      className="border-transparent text-[10px] tracking-wider uppercase"
                      style={{ backgroundColor: meta.color, color: "#fff" }}
                    >
                      Majority
                    </Badge>
                  )}
                </div>
                <div className="text-2xl font-semibold tabular-nums">
                  {row.seats}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    seats
                  </span>
                </div>
                <div className="text-xs text-muted-foreground tabular-nums">
                  {formatNumber(row.votes)} votes
                </div>
              </Card>
            )
          })}

          <Card size="sm" className="gap-2 px-4 py-3">
            <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Vote share
            </div>
            <div className="flex flex-col gap-1.5">
              {BAR_ALLIANCES.map((code) => {
                const row = seatRow(code)
                const meta = getAlliance(code)
                return (
                  <VoteShareBar
                    key={code}
                    label={meta.code === "OTHER" ? "Other" : meta.code}
                    color={meta.color}
                    share={row.voteShare}
                  />
                )
              })}
            </div>
          </Card>

          <DemographicsStrip scope={scope} />
        </div>
      </div>
    </section>
  )
}

function VoteShareBar({
  label,
  color,
  share,
}: {
  label: string
  color: string
  share: number
}) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-9 shrink-0 font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <div className="relative flex h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{
            width: `${share * 100}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <span className="w-10 shrink-0 text-right tabular-nums">
        {formatPercent(share, 1)}
      </span>
    </div>
  )
}
