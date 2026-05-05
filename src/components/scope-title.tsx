import { ThemeToggle } from "@/components/theme-toggle"
import { getDistrict, getStateSummary } from "@/lib/data"

type Props = {
  scope: string | null
}

export function ScopeTitle({ scope }: Props) {
  const district = scope ? getDistrict(scope) : null
  const summary = getStateSummary(scope)

  const overline = district ? "Kerala · District" : "Kerala · May 2026"
  const title = district
    ? district.name
    : "Legislative Assembly Election Results"

  return (
    <header>
      <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-6">
        <div>
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {overline}
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
        </div>
        <div className="flex items-start gap-4">
          <dl className="flex gap-6 text-sm text-muted-foreground">
            <div>
              <dt className="text-xs tracking-wide uppercase">Seats</dt>
              <dd className="text-lg font-medium text-foreground tabular-nums">
                {summary.totalSeats}
              </dd>
            </div>
          </dl>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
