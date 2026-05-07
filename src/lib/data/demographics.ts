import { acDemoMeta, demoMeta } from "@/lib/data/loaders"

export type ReligionCode = "hindu" | "muslim" | "christian" | "other"

export type Religion = {
  code: ReligionCode
  label: string
  color: string
}

export const religions: Religion[] = [
  { code: "hindu", label: "Hindu", color: "#B45309" },
  { code: "muslim", label: "Muslim", color: "#16A34A" },
  { code: "christian", label: "Christian", color: "#7C3AED" },
  { code: "other", label: "Other", color: "#6B7280" },
]

export function getReligion(code: ReligionCode): Religion {
  return religions.find((r) => r.code === code)!
}

export const demographicsYear = demoMeta.year

/**
 * AC-level religion shares from SHRUG + Census C-01 aggregation.
 * 114 of 140 ACs are directly aggregated; 26 urban-heavy ACs fall back
 * to district URBAN religion shares. See docs/data-pipeline.md.
 */
export type AcDemographicsResult = {
  religions: Record<ReligionCode, number>
  source: "shrug-c01-aggregated" | "district-urban-fallback" | "district-total-fallback" | null
}

export function getReligionForAC(
  constituencyNumber: number
): AcDemographicsResult | null {
  const entry = acDemoMeta.constituencies[String(constituencyNumber)]
  if (!entry) return null
  // Collapse smaller religion buckets into "other" to match the
  // ReligionCode shape the rest of the app uses.
  const r = entry.religions
  const other =
    (r.other ?? 0) + (r.sikh ?? 0) + (r.buddhist ?? 0) + (r.jain ?? 0)
  return {
    religions: {
      hindu: r.hindu,
      muslim: r.muslim,
      christian: r.christian,
      other,
    },
    source: entry.source,
  }
}

export type Demographics = {
  scope: "state" | "district"
  population: number
  religions: Record<ReligionCode, number>
}

export function getDemographicsFor(districtId: string | null): Demographics {
  if (districtId) {
    const d = demoMeta.districts[districtId]
    if (!d) {
      return {
        scope: "district",
        population: 0,
        religions: { hindu: 0, muslim: 0, christian: 0, other: 0 },
      }
    }
    return {
      scope: "district",
      population: d.population,
      religions: { ...d.religions },
    }
  }
  let total = 0
  const counts: Record<ReligionCode, number> = {
    hindu: 0,
    muslim: 0,
    christian: 0,
    other: 0,
  }
  for (const id in demoMeta.districts) {
    const d = demoMeta.districts[id]!
    total += d.population
    for (const code of [
      "hindu",
      "muslim",
      "christian",
      "other",
    ] as ReligionCode[]) {
      counts[code] += (d.religions[code] / 100) * d.population
    }
  }
  return {
    scope: "state",
    population: total,
    religions: {
      hindu: total > 0 ? (counts.hindu / total) * 100 : 0,
      muslim: total > 0 ? (counts.muslim / total) * 100 : 0,
      christian: total > 0 ? (counts.christian / total) * 100 : 0,
      other: total > 0 ? (counts.other / total) * 100 : 0,
    },
  }
}
