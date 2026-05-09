import { useMemo, useState } from "react"

import { ChoroplethMap } from "@/components/charts/choropleth-map"
import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { constituencies } from "@/lib/data/constituencies"
import {
  acDemo2025Meta,
  beltsMeta,
  districtsMeta,
  reservationsMeta,
} from "@/lib/data/loaders"
import {
  COHORT_3_ACS,
  COHORT_4A_ACS,
  COHORT_5A_ACS,
  COHORT_5B_ACS,
  COHORT_6_ACS,
  MATURE_GROWERS_ACS,
} from "./walkthroughs-nda-data"

/**
 * BJP cohort options for the left selector. The "targeted" option is
 * the union of the 4 active cohorts (mature growers, low-base
 * breakouts, declining mature, wave-capture, deduplicated) — the
 * 30-seat target universe from the NDA walkthrough lede.
 */
const TARGETED_ACS = new Set<number>([
  ...MATURE_GROWERS_ACS,
  ...COHORT_3_ACS,
  ...COHORT_4A_ACS,
  ...COHORT_6_ACS,
])

type BJPCohortOption = {
  value: string
  label: string
  acs: Set<number>
}

const BJP_COHORTS: BJPCohortOption[] = [
  {
    value: "targeted",
    label: `Targeted set (${TARGETED_ACS.size} seats)`,
    acs: TARGETED_ACS,
  },
  {
    value: "mature",
    label: `Mature growers (${MATURE_GROWERS_ACS.size})`,
    acs: MATURE_GROWERS_ACS,
  },
  {
    value: "low-base",
    label: `Low-base breakouts (${COHORT_3_ACS.size})`,
    acs: COHORT_3_ACS,
  },
  {
    value: "declining",
    label: `Declining mature (${COHORT_4A_ACS.size})`,
    acs: COHORT_4A_ACS,
  },
  {
    value: "wave",
    label: `Wave-capture (${COHORT_6_ACS.size})`,
    acs: COHORT_6_ACS,
  },
  {
    value: "abstention",
    label: `Strategic abstention (${COHORT_5A_ACS.size})`,
    acs: COHORT_5A_ACS,
  },
  {
    value: "exclusion",
    label: `Structural exclusion (${COHORT_5B_ACS.size})`,
    acs: COHORT_5B_ACS,
  },
]

/**
 * Demographic cohort options for the right selector. Three groups:
 * Religion mix (AC-level, derived from ac-demographics-2025.json),
 * Community belts (district-level, from community-belts.json),
 * and Reservation (AC-level, from reservations.json).
 */
type DemoCohortOption = {
  value: string
  label: string
  group: "religion" | "belt" | "reservation"
  acs: Set<number>
}

function buildAcsFromReligion(
  predicate: (r: {
    hindu: number
    christian: number
    muslim: number
  }) => boolean
): Set<number> {
  const set = new Set<number>()
  for (const [acStr, ac] of Object.entries(acDemo2025Meta.constituencies)) {
    if (predicate(ac.religions)) set.add(Number(acStr))
  }
  return set
}

function buildAcsFromBelt(beltId: string): Set<number> {
  const set = new Set<number>()
  for (const [acStr, district] of Object.entries(
    districtsMeta.constituencyToDistrict
  )) {
    const belt = beltsMeta.districtToBelt[district]
    if (belt === beltId) set.add(Number(acStr))
  }
  return set
}

function buildAcsFromReservation(code: "SC" | "ST"): Set<number> {
  const set = new Set<number>()
  for (const [acStr, r] of Object.entries(
    reservationsMeta.constituencyToReservation
  )) {
    if (r === code) set.add(Number(acStr))
  }
  return set
}

const HINDU_HEAVY = buildAcsFromReligion((r) => r.hindu >= 65)
const CHRISTIAN_HEAVY = buildAcsFromReligion((r) => r.christian >= 25)
const MUSLIM_MAJORITY = buildAcsFromReligion((r) => r.muslim >= 60)
const MUSLIM_MIXED = buildAcsFromReligion(
  (r) => r.muslim >= 30 && r.muslim < 60
)

const DEMO_COHORTS: DemoCohortOption[] = [
  {
    value: "hindu-heavy",
    label: `Hindu-heavy (≥65%, ${HINDU_HEAVY.size})`,
    group: "religion",
    acs: HINDU_HEAVY,
  },
  {
    value: "christian-heavy",
    label: `Christian-heavy (≥25%, ${CHRISTIAN_HEAVY.size})`,
    group: "religion",
    acs: CHRISTIAN_HEAVY,
  },
  {
    value: "muslim-majority",
    label: `Muslim-majority (≥60%, ${MUSLIM_MAJORITY.size})`,
    group: "religion",
    acs: MUSLIM_MAJORITY,
  },
  {
    value: "muslim-mixed",
    label: `Muslim-mixed (30–60%, ${MUSLIM_MIXED.size})`,
    group: "religion",
    acs: MUSLIM_MIXED,
  },
  ...beltsMeta.belts.map<DemoCohortOption>((b) => {
    const acs = buildAcsFromBelt(b.id)
    return {
      value: `belt-${b.id}`,
      label: `${b.label} (${acs.size})`,
      group: "belt",
      acs,
    }
  }),
  {
    value: "sc-reserved",
    label: `SC reserved (${buildAcsFromReservation("SC").size})`,
    group: "reservation",
    acs: buildAcsFromReservation("SC"),
  },
  {
    value: "st-reserved",
    label: `ST reserved (${buildAcsFromReservation("ST").size})`,
    group: "reservation",
    acs: buildAcsFromReservation("ST"),
  },
]

const acByNumber = new Map(constituencies.map((c) => [c.constituencyNumber, c]))

function makeBinaryValueMap(acs: Set<number>): Map<number, number> {
  const out = new Map<number, number>()
  for (const c of constituencies) {
    out.set(c.constituencyNumber, acs.has(c.constituencyNumber) ? 1 : 0)
  }
  return out
}

function CohortMap({
  acs,
  color,
  ariaLabel,
  badgeLabel,
}: {
  acs: Set<number>
  color: string
  ariaLabel: string
  badgeLabel: string
}) {
  const valueByAC = useMemo(() => makeBinaryValueMap(acs), [acs])
  return (
    <ChoroplethMap
      valueByAC={valueByAC}
      colorScale="sequential"
      domain={[0, 1]}
      sequentialColor={color}
      highlightSeats={acs}
      ariaLabel={ariaLabel}
      unit=""
      decimals={0}
      tooltipFormat={(acNumber, value) => {
        const ac = acByNumber.get(acNumber)
        const inCohort = (value ?? 0) > 0.5
        return (
          <span>
            <span className="font-medium">
              {ac?.constituencyName ?? `AC ${acNumber}`}
            </span>
            {inCohort && (
              <span className="ml-1 rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[10px]">
                {badgeLabel}
              </span>
            )}
          </span>
        )
      }}
    />
  )
}

function findOption<T extends { value: string }>(
  options: T[],
  value: string
): T {
  return options.find((o) => o.value === value) ?? options[0]
}

export function WalkthroughsInsightsPage() {
  const [bjpValue, setBjpValueRaw] = useState<string>("mature")
  const [demoValue, setDemoValueRaw] = useState<string>("hindu-heavy")
  const setBjpValue = (v: string | null) => {
    if (v) setBjpValueRaw(v)
  }
  const setDemoValue = (v: string | null) => {
    if (v) setDemoValueRaw(v)
  }

  const bjp = findOption(BJP_COHORTS, bjpValue)
  const demo = findOption(DEMO_COHORTS, demoValue)

  const intersection = useMemo(() => {
    const out = new Set<number>()
    bjp.acs.forEach((ac) => {
      if (demo.acs.has(ac)) out.add(ac)
    })
    return out
  }, [bjp.acs, demo.acs])

  const overlapPctOfBjp =
    bjp.acs.size > 0 ? (intersection.size / bjp.acs.size) * 100 : 0
  const overlapPctOfDemo =
    demo.acs.size > 0 ? (intersection.size / demo.acs.size) * 100 : 0

  const intersectionNames = useMemo(() => {
    const names: string[] = []
    intersection.forEach((ac) => {
      const c = acByNumber.get(ac)
      if (c) names.push(c.constituencyName)
    })
    return names.sort()
  }, [intersection])

  return (
    <PageShell
      breadcrumbs={[
        { label: "Walkthroughs", href: "/walkthroughs" },
        { label: "Insights" },
      ]}
      title="Build your own cohort overlap"
      subtitle={
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Pick a BJP cohort on the left and a demographic cohort on the right.
          The maps highlight each cohort&rsquo;s seats; the stat line below
          quantifies the overlap.
        </p>
      }
    >
      <PageMain className="space-y-8 py-6 pb-12">
        {/* Two-column maps with selectors */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* LEFT — BJP cohort */}
          <div className="space-y-3">
            <SelectorBlock
              label="BJP cohort"
              value={bjpValue}
              onValueChange={setBjpValue}
              options={BJP_COHORTS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
            />
            <div className="rounded-sm border bg-card/40 p-3 sm:p-4">
              <div className="mx-auto max-w-sm">
                <CohortMap
                  acs={bjp.acs}
                  color="#FF7F0E"
                  ariaLabel={`Map highlighting ${bjp.label}`}
                  badgeLabel="BJP cohort"
                />
              </div>
            </div>
            <p className="min-h-[2.5rem] text-xs leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground/80">
                {bjp.label}
              </strong>{" "}
              — {bjp.acs.size} seats highlighted on the map.
            </p>
          </div>

          {/* RIGHT — Demographic cohort */}
          <div className="space-y-3">
            <DemoSelector value={demoValue} onValueChange={setDemoValue} />
            <div className="rounded-sm border bg-card/40 p-3 sm:p-4">
              <div className="mx-auto max-w-sm">
                <CohortMap
                  acs={demo.acs}
                  color="#2563EB"
                  ariaLabel={`Map highlighting ${demo.label}`}
                  badgeLabel="Demographic cohort"
                />
              </div>
            </div>
            <p className="min-h-[2.5rem] text-xs leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground/80">
                {demo.label}
              </strong>{" "}
              —{" "}
              {demo.group === "belt"
                ? "district-level classification."
                : "AC-level classification."}{" "}
              {demo.acs.size} seats highlighted.
            </p>
          </div>
        </div>

        {/* Overlap stat */}
        <div className="min-h-[5rem] rounded-md border bg-card/50 p-5 sm:p-6">
          <p className="text-sm leading-relaxed sm:text-[15px]">
            <strong className="font-semibold">
              {intersection.size}{" "}
              {intersection.size === 1 ? "seat is" : "seats are"} in both
            </strong>{" "}
            — {intersection.size} of {bjp.acs.size}{" "}
            {bjp.label.split(" (")[0].toLowerCase()} seats (
            {overlapPctOfBjp.toFixed(0)}%) and {intersection.size} of{" "}
            {demo.acs.size} {demo.label.split(" (")[0].toLowerCase()} seats (
            {overlapPctOfDemo.toFixed(0)}%).
          </p>
          {intersection.size > 0 && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {intersectionNames.slice(0, 12).join(" · ")}
              {intersectionNames.length > 12
                ? ` … and ${intersectionNames.length - 12} more`
                : ""}
            </p>
          )}
        </div>

        {/* Sources */}
        <section className="border-t pt-6 text-xs leading-relaxed text-muted-foreground">
          <h2 className="mb-2 font-heading text-base font-semibold tracking-tight text-foreground">
            Sources
          </h2>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong className="font-medium text-foreground/80">
                Election results:
              </strong>{" "}
              Election Commission of India and{" "}
              <a
                href="http://keralaassembly.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                keralaassembly.org
              </a>{" "}
              (2026); keralaassembly.org, Wikipedia, and{" "}
              <a
                href="https://datameet.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                datameet
              </a>{" "}
              (historical 2011 / 2016 / 2021).
            </li>
            <li>
              <strong className="font-medium text-foreground/80">
                Religion shares:
              </strong>{" "}
              2011 Census of India via{" "}
              <a
                href="https://www.devdatalab.org/shrug"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                SHRUG
              </a>{" "}
              (Socioeconomic High-resolution Rural-Urban Geographic Platform),
              with cohort-multiplier projection to ~2025.
            </li>
            <li>
              <strong className="font-medium text-foreground/80">
                Reservation status:
              </strong>{" "}
              2008 Delimitation Order, Government of India. 14 SC + 2 ST seats,
              stable across the 2011 / 2016 / 2021 / 2026 cycles.
            </li>
          </ul>
          <p className="mt-3 max-w-prose">
            Full methodology — including how cohort criteria are operationalised
            and how community belts are derived — lives on the{" "}
            <a
              href="/walkthroughs/methodology"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              walkthroughs methodology
            </a>{" "}
            page.
          </p>
        </section>

        {/* Feedback callout */}
        <section className="rounded-md border bg-card/50 p-5 sm:p-6">
          <h2 className="mb-2 font-heading text-base font-semibold tracking-tight">
            Have an idea for a cohort overlay?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This page is a starter set. If you have a hypothesis you&rsquo;d
            like to test — a different demographic slice, a candidate-quality
            lens, a historical-vote pattern — open a{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              GitHub issue
            </a>{" "}
            with the cohort definition. Good fits get added to this page; the
            issue thread becomes the methodology trail.
          </p>
        </section>
      </PageMain>
    </PageShell>
  )
}

function SelectorBlock({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (v: string | null) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10.5px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function DemoSelector({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (v: string | null) => void
}) {
  const groups: Array<{
    key: "religion" | "belt" | "reservation"
    title: string
    options: DemoCohortOption[]
  }> = [
    {
      key: "religion",
      title: "Religion mix (AC-level)",
      options: DEMO_COHORTS.filter((o) => o.group === "religion"),
    },
    {
      key: "belt",
      title: "Community belts (district-level)",
      options: DEMO_COHORTS.filter((o) => o.group === "belt"),
    },
    {
      key: "reservation",
      title: "Reservation (AC-level)",
      options: DEMO_COHORTS.filter((o) => o.group === "reservation"),
    },
  ]
  return (
    <div className="space-y-1.5">
      <label className="text-[10.5px] font-semibold tracking-wide text-muted-foreground uppercase">
        Demographic cohort
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {groups.map((g, i) => (
            <SelectGroup key={g.key}>
              {i > 0 && <div className="mx-1 my-1 h-px bg-border" />}
              <SelectLabel>{g.title}</SelectLabel>
              {g.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
