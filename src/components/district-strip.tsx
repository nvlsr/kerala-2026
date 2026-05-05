import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  districts,
  formatPercent,
  getAlliance,
  getDemographicsFor,
  getReligion,
  getStateSummary,
  type AllianceCode,
  type ReligionCode,
} from "@/lib/data"

const COMP_ALLIANCES: AllianceCode[] = ["UDF", "LDF", "NDA", "OTHER"]
const COMP_RELIGIONS: ReligionCode[] = ["hindu", "muslim", "christian"]

type Scope = string | null

type Props = {
  scope: Scope
  onSelect: (districtId: Scope) => void
}

export function DistrictStrip({ scope, onSelect }: Props) {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <h2 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Districts
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <DistrictChip
            label="All Kerala"
            districtId={null}
            active={scope === null}
            onSelect={onSelect}
          />
          {districts.map((d) => (
            <DistrictChip
              key={d.id}
              label={d.name}
              districtId={d.id}
              active={scope === d.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function DistrictChip({
  label,
  districtId,
  active,
  onSelect,
}: {
  label: string
  districtId: Scope
  active: boolean
  onSelect: (id: Scope) => void
}) {
  const summary = getStateSummary(districtId)
  const demo = getDemographicsFor(districtId)
  const seatRow = (code: AllianceCode) =>
    summary.rows.find((r) => r.code === code)!

  const seatSegments = COMP_ALLIANCES.map((code) => {
    const row = seatRow(code)
    return {
      key: code,
      color: getAlliance(code).color,
      widthPct:
        summary.totalSeats > 0 ? (row.seats / summary.totalSeats) * 100 : 0,
    }
  })

  const voteSegments = COMP_ALLIANCES.map((code) => {
    const row = seatRow(code)
    return {
      key: code,
      color: getAlliance(code).color,
      widthPct: row.voteShare * 100,
    }
  })

  const religionSegments = COMP_RELIGIONS.map((code) => ({
    key: code,
    color: getReligion(code).color,
    widthPct: demo.religions[code],
  }))

  return (
    <Card
      size="sm"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(districtId)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(districtId)
        }
      }}
      className={cn(
        "cursor-pointer gap-2 px-3 py-2.5 transition-shadow",
        "hover:shadow-sm hover:ring-foreground/30",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        active && "ring-2 ring-foreground/60"
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-sm font-semibold">{label}</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {summary.totalSeats}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <CompositionBar
          label="Seats"
          segments={seatSegments}
          showLabel={active}
        />
        <CompositionBar
          label="Votes"
          segments={voteSegments}
          showLabel={active}
        />
        <CompositionBar
          label="Relig"
          segments={religionSegments}
          showLabel={active}
        />
      </div>

      {active && (
        <>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground tabular-nums">
            {COMP_ALLIANCES.map((code) => {
              const row = seatRow(code)
              const meta = getAlliance(code)
              return (
                <span key={code} className="flex items-center gap-1">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                    aria-hidden
                  />
                  <span>
                    <span className="font-medium text-foreground/80">
                      {code === "OTHER" ? "Oth" : code}
                    </span>{" "}
                    {row.seats} / {formatPercent(row.voteShare, 0)}
                  </span>
                </span>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground tabular-nums">
            {COMP_RELIGIONS.map((code) => {
              const meta = getReligion(code)
              const share = demo.religions[code]
              return (
                <span key={code} className="flex items-center gap-1">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                    aria-hidden
                  />
                  <span>
                    <span className="font-medium text-foreground/80">
                      {meta.label.charAt(0)}
                    </span>{" "}
                    {share.toFixed(0)}%
                  </span>
                </span>
              )
            })}
          </div>
        </>
      )}
    </Card>
  )
}

function CompositionBar({
  label,
  segments,
  showLabel,
}: {
  label: string
  segments: Array<{ key: string; color: string; widthPct: number }>
  showLabel: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      {showLabel && (
        <span className="w-9 shrink-0 text-[9px] tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
      )}
      <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        {segments.map((s) => {
          if (s.widthPct <= 0) return null
          return (
            <div
              key={s.key}
              style={{ width: `${s.widthPct}%`, backgroundColor: s.color }}
            />
          )
        })}
      </div>
    </div>
  )
}
