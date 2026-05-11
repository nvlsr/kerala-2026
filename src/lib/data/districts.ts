import { districtsMeta } from "@/lib/data/loaders"
import type { Constituency } from "@/lib/data/constituencies"

export type District = {
  id: string
  name: string
}

// Districts are stored in display order in districts.json; preserve.
export const districts: District[] = districtsMeta.districts.slice()

export function getDistrict(id: string): District | null {
  return districts.find((d) => d.id === id) ?? null
}

export function districtForConstituency(c: Constituency): District | null {
  const id = districtsMeta.constituencyToDistrict[String(c.constituencyNumber)]
  return id ? getDistrict(id) : null
}
