import { Card } from "@/components/ui/card"
import {
  demographicsYear,
  formatNumber,
  formatPercent,
  getDemographicsFor,
  religions,
  type ReligionCode,
} from "@/lib/data"

const VISIBLE: ReligionCode[] = ["hindu", "muslim", "christian"]

type Props = {
  scope: string | null
}

export function DemographicsStrip({ scope }: Props) {
  const demo = getDemographicsFor(scope)

  return (
    <Card size="sm" className="gap-2 px-4 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Demographics
        </div>
        <div className="text-[10px] text-muted-foreground/70">
          {demographicsYear} census
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {religions
          .filter((r) => VISIBLE.includes(r.code))
          .map((r) => {
            const share = demo.religions[r.code] / 100
            return (
              <ReligionBar
                key={r.code}
                label={r.label}
                color={r.color}
                share={share}
              />
            )
          })}
      </div>
      <div className="text-[10px] text-muted-foreground/80 tabular-nums">
        Population {formatNumber(demo.population)}
      </div>
    </Card>
  )
}

function ReligionBar({
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
        {label.slice(0, 3)}
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
