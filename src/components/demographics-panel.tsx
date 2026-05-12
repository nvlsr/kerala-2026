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
  getReligiousSignatureForAC,
  getSummaryForAC,
} from "@/lib/data"
import {
  CHRISTIAN_SUBRITE_COHORTS,
  MUSLIM_SUBRITE_COHORTS,
} from "@/lib/data/subrite-bins"
import { districtsMeta } from "@/lib/data/loaders"
import { cn } from "@/lib/utils"

// Lookup tables for sub-rite label + color (from cohort metadata).
const CHRISTIAN_SUBRITE_LABEL = new Map(
  CHRISTIAN_SUBRITE_COHORTS.map((c) => [c.code, c])
)
const MUSLIM_SUBRITE_LABEL = new Map(
  MUSLIM_SUBRITE_COHORTS.map((c) => [c.code, c])
)

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

type View = "religion" | "caste" | "summary"

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
  const summary =
    scope.kind === "ac" ? getSummaryForAC(scope.acNumber) : null

  // If the scope changed and "summary" tab is no longer available,
  // fall back to "religion" for rendering.
  const activeView: View = view === "summary" && !summary ? "religion" : view

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4">
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          {scope.kind !== "ac" && (
            <p className="truncate text-sm font-medium text-foreground">
              {scopeLabel}
            </p>
          )}
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
            Composition
          </ToggleGroupItem>
          <ToggleGroupItem value="caste" className="rounded-full text-xs">
            Caste
          </ToggleGroupItem>
          {summary && (
            <ToggleGroupItem value="summary" className="rounded-full text-xs">
              Summary
            </ToggleGroupItem>
          )}
        </ToggleGroup>
      </header>
      {activeView === "religion" && (
        <ReligionTable
          religion={religion}
          acNumber={scope.kind === "ac" ? scope.acNumber : undefined}
          caste={caste}
        />
      )}
      {activeView === "caste" && <CasteTable caste={caste} />}
      {activeView === "summary" && summary && (
        <p className="text-xs leading-relaxed text-foreground">
          {summary.summary}
        </p>
      )}
      <footer className="text-[10px] leading-snug text-muted-foreground/80">
        {activeView === "religion" && (
          <>
            Religion: Census 2011 + 2025 cohort projection (CRS births by
            religion). {fallbackNote}
            {scope.kind === "ac" && (
              <>
                {" "}
                Muslim/Christian sub-rite: OSM place-of-worship POI mix ×
                Census religion share. Hindu caste sub-row: Zachariah/KSI
                2000 district-level survey, top caste shown when ≥25% of
                total.
              </>
            )}
          </>
        )}
        {activeView === "caste" && (
          <>
            Source: Zachariah/KSI 2000 household survey. Caste data is
            district-level only; values shown are % of total population
            (caste-share-of-Hindus × district Hindu share).
          </>
        )}
        {activeView === "summary" && (
          <>
            Composed from per-AC structured data: 2026 result, three-cycle
            history, community-relevance driver + durability, NDA share
            trajectory, and (where applicable) hereditary lineage.
          </>
        )}
      </footer>
    </div>
  )
}

function ReligionTable({
  religion,
  acNumber,
  caste,
}: {
  religion: Record<"hindu" | "muslim" | "christian" | "other", number>
  acNumber?: number
  caste?: HinduCasteShares
}) {
  // Sub-rite rows are AC-only — district/state dominant sub-rite
  // doesn't have a clean definition.
  const sig =
    acNumber != null ? getReligiousSignatureForAC(acNumber) : null
  const christianSub = sig?.christian.dominant ?? null
  const muslimSub = sig?.muslim.dominant ?? null

  // Hindu sub-row: dominant caste from CASTE_ROWS when ≥25% of total
  // population. District-level data (Zachariah/KSI 2000) scaled to %
  // of total — flagged with "(district avg)" caveat.
  const hinduDominant = caste
    ? CASTE_ROWS.map((r) => ({ row: r, value: caste[r.key] ?? 0 }))
        .filter((c) => c.value >= 25)
        .sort((a, b) => b.value - a.value)[0] ?? null
    : null

  return (
    <table className="w-full text-sm tabular-nums">
      <tbody>
        {RELIGION_ROWS.map((r) => {
          const value = religion[r.key]
          const subRow =
            r.key === "hindu" && hinduDominant
              ? renderHinduCasteRow(hinduDominant.row, hinduDominant.value)
              : r.key === "christian" && christianSub
                ? renderSubRiteRow(
                    CHRISTIAN_SUBRITE_LABEL.get(
                      christianSub.code as never
                    ),
                    christianSub.voterSharePct,
                    sig?.christian.confidence === "low"
                  )
                : r.key === "muslim" && muslimSub
                  ? renderSubRiteRow(
                      MUSLIM_SUBRITE_LABEL.get(
                        muslimSub.code as never
                      ),
                      muslimSub.voterSharePct,
                      sig?.muslim.confidence === "low"
                    )
                  : null
          return (
            <>
              <Row
                key={r.key}
                label={r.label}
                color={r.color}
                value={value}
                dim={value < 0.5}
              />
              {subRow}
            </>
          )
        })}
      </tbody>
    </table>
  )
}

/** Indented sub-rite row rendered immediately under its parent religion. */
function renderSubRiteRow(
  meta: { label: string; color: string } | undefined,
  voterSharePct: number,
  lowConfidence: boolean
) {
  if (!meta) return null
  return (
    <tr
      key={`subrite-${meta.label}`}
      className="border-b border-border/40 last:border-b-0"
    >
      <td className="py-1 pr-2 pl-6">
        <span className="inline-flex items-center gap-2 text-xs">
          <span className="text-muted-foreground/60">↳</span>
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: meta.color }}
            aria-hidden
          />
          <span className="text-muted-foreground">
            {meta.label}{" "}
            <span className="text-muted-foreground/70">
              ({lowConfidence ? "dominant, small sample" : "dominant"})
            </span>
          </span>
        </span>
      </td>
      <td className="py-1 text-right text-xs text-muted-foreground">
        <span className="tabular-nums">
          {formatPercent(voterSharePct / 100, 1)}
        </span>{" "}
        <span className="text-muted-foreground/60">est. voters</span>
      </td>
    </tr>
  )
}

/**
 * Hindu dominant-caste sub-row. Same indent + styling as the
 * Muslim/Christian sub-rite rows, but flagged "(district avg)"
 * because the source is district-level (Zachariah/KSI 2000), not
 * the AC-level POI mix that drives the other sub-rites.
 */
function renderHinduCasteRow(meta: CasteRow, valuePctOfTotal: number) {
  return (
    <tr
      key={`hindu-caste-${meta.label}`}
      className="border-b border-border/40 last:border-b-0"
    >
      <td className="py-1 pr-2 pl-6">
        <span className="inline-flex items-center gap-2 text-xs">
          <span className="text-muted-foreground/60">↳</span>
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: meta.color }}
            aria-hidden
          />
          <span className="text-muted-foreground">
            {meta.label}{" "}
            <span className="text-muted-foreground/70">
              (dominant, district avg)
            </span>
          </span>
        </span>
      </td>
      <td className="py-1 text-right text-xs text-muted-foreground">
        <span className="tabular-nums">
          {valuePctOfTotal.toFixed(1)}%
        </span>
      </td>
    </tr>
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
