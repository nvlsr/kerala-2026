/**
 * Pre-project Kerala GeoJSON files into SVG path strings.
 *
 * Reads:
 *   data/district.geojson
 *   data/ac.geojson
 *
 * Writes:
 *   data/district-paths.json
 *   data/ac-paths.json
 *
 * Run: bun run scripts/pipeline/build-kerala-map-paths.ts
 */
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..")

type FeatureCollection<Props> = {
  type: "FeatureCollection"
  features: Array<{
    type: "Feature"
    properties: Props
    geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon
  }>
}

function project<Props>(
  fc: FeatureCollection<Props>,
  width: number,
  height: number
) {
  const projection = geoMercator().fitSize(
    [width, height],
    fc as GeoPermissibleObjects
  )
  const path = geoPath(projection)
  return fc.features.map((f) => ({
    properties: f.properties,
    pathD: path(f as GeoPermissibleObjects),
  }))
}

// Districts — 14 polygons, used for the top-of-page choropleth. Only the
// id key is emitted; the display name lives in `data/districts.json`.
{
  const fc = JSON.parse(
    readFileSync(resolve(ROOT, "data/district.geojson"), "utf8")
  ) as FeatureCollection<{
    id: string
    name: string
    censuscode?: number | null
  }>

  const width = 400
  const height = 600
  const districts = project(fc, width, height).map((f) => ({
    id: f.properties.id,
    pathD: f.pathD,
  }))

  const out = { width, height, districts }
  const path = resolve(ROOT, "data/district-paths.json")
  writeFileSync(path, JSON.stringify(out))
  console.log(
    `✓ ${path.replace(ROOT + "/", "")}: ${districts.length} districts, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`
  )
}

// Constituencies — 140 polygons, used for the per-AC analytical map. Only
// the AC number key is emitted; display name + districtId live in
// `ac-names.json` + `districts.json` respectively.
{
  const fc = JSON.parse(
    readFileSync(resolve(ROOT, "data/ac.geojson"), "utf8")
  ) as FeatureCollection<{
    constituencyNumber: number
    name: string
    districtId: string
  }>

  const width = 600
  const height = 900
  const constituencies = project(fc, width, height).map((f) => ({
    constituencyNumber: f.properties.constituencyNumber,
    pathD: f.pathD,
  }))

  const out = { width, height, constituencies }
  const path = resolve(ROOT, "data/ac-paths.json")
  writeFileSync(path, JSON.stringify(out))
  console.log(
    `✓ ${path.replace(ROOT + "/", "")}: ${constituencies.length} constituencies, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`
  )
}
