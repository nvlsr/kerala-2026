import { useState } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { casteByDistrictMeta, type HinduCasteShares } from "@/lib/data/loaders"
import {
  constituencies,
  displayConstituencyName,
  formatPercent,
  getDemographicsFor,
  getDistrict,
  getReligionForAC,
} from "@/lib/data"
import { districtsMeta } from "@/lib/data/loaders"
import { cn } from "@/lib/utils"

type CasteRow = {
  key: keyof HinduCasteShares
  label: string
  color: string
}

const CASTE_ROWS: CasteRow[] = [
  { key: "nair", label: "Nair", color: "#0EA5E9" },
  { key: "ezhava", label: "Ezhava", color: "#F97316" },
  { key: "brahmin", label: "Brahmin", color: "#EAB308" },
  { key: "nadar", label: "Nadar", color: "#DC2626" },
  { key: "viswakarma", label: "Viswakarma", color: "#A855F7" },
  { key: "sc", label: "SC", color: "#0891B2" },
  { key: "st", label: "ST", color: "#65A30D" },
]

type ReligionRow = {
  key: "hindu" | "muslim" | "christian" | "other"
  label: string
  color: string
}

const RELIGION_ROWS: ReligionRow[] = [
  { key: "hindu", label: "Hindu", color: "#B45309" },
  { key: "muslim", label: "Muslim", color: "#16A34A" },
  { key: "christian", label: "Christian", color: "#7C3AED" },
  { key: "other", label: "Other", color: "#6B7280" },
]

type View = "religion" | "caste"

type Props = {
  /**
   * Scope for the panel:
   *   - `{ kind: "ac", acNumber }`        single-AC view (religion is
   *     AC-level; caste falls back to that AC's district)
   *   - `{ kind: "district", districtId }` district view (both
   *     religion and caste are district-level)
   *   - `{ kind: "state" }`                statewide aggregates
   */
  scope:
    | { kind: "ac"; acNumber: number }
    | { kind: "district"; districtId: string }
    | { kind: "state" }
}

/**
 * Always-on demographics panel — toggles between Religion (AC-level
 * Census 2011 + 2025 cohort projection) and Caste (district-level
 * Hindu sub-community shares from Zachariah/KSI 2000). Co-located
 * with the historical chart in `ConstituencySection`. The two
 * toggles are deliberately separate views: religion is granular
 * AC-level for ~114 of 140 ACs; caste only exists at district
 * granularity.
 */
export function DemographicsPanel({ scope }: Props) {
  const [view, setView] = useState<View>("religion")

  const { religion, caste, scopeLabel, fallbackNote } = useScopedData(scope)

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4">
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-medium tracking-wider text-muted-foreground/80 uppercase">
            Demographics
          </p>
          <p className="truncate text-sm font-medium text-foreground">
            {scopeLabel}
          </p>
        </div>
        <ToggleGroup
          value={[view]}
          onValueChange={(v) => {
            const next = (v[0] as View | undefined) ?? "religion"
            setView(next)
          }}
          variant="outline"
          size="sm"
          spacing={2}
          aria-label="Demographic dimension"
        >
          <ToggleGroupItem value="religion" className="rounded-full text-xs">
            Religion
          </ToggleGroupItem>
          <ToggleGroupItem value="caste" className="rounded-full text-xs">
            Caste
          </ToggleGroupItem>
        </ToggleGroup>
      </header>
      {view === "religion" ? (
        <ReligionTable religion={religion} />
      ) : (
        <CasteTable caste={caste} />
      )}
      <footer className="text-[10px] leading-snug text-muted-foreground/80">
        {view === "religion" ? (
          <>
            Source: Census 2011 + 2025 cohort projection (CRS births by
            religion). {fallbackNote}
          </>
        ) : (
          <>
            Source: Zachariah/KSI 2000 household survey. Caste data is
            district-level only; values shown are % of total population
            (caste-share-of-Hindus × district Hindu share).
          </>
        )}
      </footer>
    </div>
  )
}

function ReligionTable({
  religion,
}: {
  religion: Record<"hindu" | "muslim" | "christian" | "other", number>
}) {
  return (
    <table className="w-full text-sm tabular-nums">
      <tbody>
        {RELIGION_ROWS.map((r) => {
          const value = religion[r.key]
          return (
            <Row
              key={r.key}
              label={r.label}
              color={r.color}
              value={value}
              dim={value < 0.5}
            />
          )
        })}
      </tbody>
    </table>
  )
}

function CasteTable({ caste }: { caste: HinduCasteShares }) {
  return (
    <table className="w-full text-sm tabular-nums">
      <tbody>
        {CASTE_ROWS.map((r) => {
          const value = caste[r.key]
          return (
            <Row
              key={r.key}
              label={r.label}
              color={r.color}
              value={value}
              dim={value < 0.5}
            />
          )
        })}
      </tbody>
    </table>
  )
}

function Row({
  label,
  color,
  value,
  dim,
}: {
  label: string
  color: string
  value: number
  dim?: boolean
}) {
  return (
    <tr className={cn("border-b border-border/40 last:border-b-0")}>
      <td className="py-1.5 pr-2">
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <span className={cn(dim && "text-muted-foreground")}>{label}</span>
        </span>
      </td>
      <td
        className={cn(
          "py-1.5 text-right",
          dim ? "text-muted-foreground/60" : "text-foreground"
        )}
      >
        {formatPercent(value / 100, 1)}
      </td>
    </tr>
  )
}

function useScopedData(scope: Props["scope"]): {
  religion: Record<"hindu" | "muslim" | "christian" | "other", number>
  caste: HinduCasteShares
  scopeLabel: string
  fallbackNote: string
} {
  if (scope.kind === "state") {
    const stateReligion = getDemographicsFor(null)
    return {
      religion: stateReligion.religions,
      caste: scaleCasteToTotal(
        casteByDistrictMeta.stateAggregate,
        stateReligion.religions.hindu
      ),
      scopeLabel: "Kerala (statewide)",
      fallbackNote: "Statewide aggregate.",
    }
  }
  if (scope.kind === "district") {
    const districtReligion = getDemographicsFor(scope.districtId)
    const district = getDistrict(scope.districtId)
    const casteRaw =
      casteByDistrictMeta.districts[scope.districtId] ??
      casteByDistrictMeta.stateAggregate
    return {
      religion: districtReligion.religions,
      caste: scaleCasteToTotal(casteRaw, districtReligion.religions.hindu),
      scopeLabel: district?.name ?? scope.districtId,
      fallbackNote: "District aggregate.",
    }
  }
  // AC scope
  const acRel = getReligionForAC(scope.acNumber, 2025)
  const districtId =
    districtsMeta.constituencyToDistrict[String(scope.acNumber)] ?? null
  const district = districtId ? getDistrict(districtId) : null
  const districtReligion = districtId ? getDemographicsFor(districtId) : null
  const casteRaw =
    (districtId && casteByDistrictMeta.districts[districtId]) ||
    casteByDistrictMeta.stateAggregate
  const hinduForCasteScaling =
    districtReligion?.religions.hindu ?? acRel?.religions.hindu ?? 0
  const constituency = constituencies.find(
    (c) => c.constituencyNumber === scope.acNumber
  )

  const fallbackNote =
    acRel?.source === "shrug-c01-aggregated"
      ? `AC-level religion (SHRUG → Census C-01). Caste shown is ${district?.name ?? "district"} district average.`
      : acRel?.source === "district-urban-fallback"
        ? `Urban-heavy AC: religion uses ${district?.name ?? "district"} URBAN fallback. Caste is district average.`
        : `Religion + caste both fall back to ${district?.name ?? "district"} district average.`

  return {
    religion: acRel?.religions ?? {
      hindu: 0,
      muslim: 0,
      christian: 0,
      other: 0,
    },
    caste: scaleCasteToTotal(casteRaw, hinduForCasteScaling),
    scopeLabel: constituency
      ? displayConstituencyName(constituency)
      : `AC ${scope.acNumber}`,
    fallbackNote,
  }
}

/**
 * Source data reports caste as % of HINDU population. Multiply by
 * the area's Hindu share to convert to % of TOTAL population (so the
 * caste rows are comparable to the religion rows in scale).
 */
function scaleCasteToTotal(
  raw: HinduCasteShares,
  hinduShareOfTotal: number
): HinduCasteShares {
  const f = hinduShareOfTotal / 100
  return {
    nair: raw.nair * f,
    ezhava: raw.ezhava * f,
    brahmin: raw.brahmin * f,
    nadar: raw.nadar * f,
    viswakarma: raw.viswakarma * f,
    barber: raw.barber * f,
    sc: raw.sc * f,
    st: raw.st * f,
    other: raw.other * f,
  }
}
