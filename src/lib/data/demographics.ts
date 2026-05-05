import { demoMeta } from "@/lib/data/loaders"

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
