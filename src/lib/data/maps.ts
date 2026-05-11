/**
 * Bridge between the trimmed paths.json files (object-keyed by AC# /
 * district id) and the array-shaped API the map components were built
 * against. Centralised here so the JSON shape stays minimal while the
 * consumers stay compact.
 */
import acPathsJson from "@data/ac-paths.json"
import districtPathsJson from "@data/district-paths.json"

type RawPaths<K extends string> = {
  w: number
  h: number
  paths: Record<K, string>
}

const rawAc = acPathsJson as RawPaths<string>
const rawDistrict = districtPathsJson as RawPaths<string>

export type AcPathEntry = {
  constituencyNumber: number
  pathD: string
}

export type DistrictPathEntry = {
  id: string
  pathD: string
}

export const acPaths = {
  width: rawAc.w,
  height: rawAc.h,
  constituencies: Object.entries(rawAc.paths)
    .map(([k, pathD]) => ({ constituencyNumber: Number(k), pathD }))
    .sort((a, b) => a.constituencyNumber - b.constituencyNumber),
}

export const districtPaths = {
  width: rawDistrict.w,
  height: rawDistrict.h,
  districts: Object.entries(rawDistrict.paths).map(([id, pathD]) => ({
    id,
    pathD,
  })),
}
