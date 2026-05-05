/**
 * Pre-project Kerala district GeoJSON into SVG path strings + centroids.
 *
 * Reads:  data/kerala-districts.geojson
 * Writes: data/kerala-districts-paths.json
 *
 * Run:    bun run scripts/build-kerala-map-paths.ts
 */
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const SRC = resolve(ROOT, "data/kerala-districts.geojson")
const OUT = resolve(ROOT, "data/kerala-districts-paths.json")

const WIDTH = 400
const HEIGHT = 600

type DistrictFeature = {
  type: "Feature"
  properties: { id: string; name: string; censuscode?: number | null }
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon
}

type FeatureCollection = {
  type: "FeatureCollection"
  features: DistrictFeature[]
}

const fc = JSON.parse(readFileSync(SRC, "utf8")) as FeatureCollection

const projection = geoMercator().fitSize(
  [WIDTH, HEIGHT],
  fc as GeoPermissibleObjects
)
const path = geoPath(projection)

const districts = fc.features.map((f) => ({
  id: f.properties.id,
  name: f.properties.name,
  pathD: path(f as GeoPermissibleObjects),
}))

const out = { width: WIDTH, height: HEIGHT, districts }
writeFileSync(OUT, JSON.stringify(out))

console.log(`✓ Wrote ${OUT.replace(ROOT + "/", "")}`)
console.log(`  Districts: ${districts.length}`)
console.log(`  Size: ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`)
