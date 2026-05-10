/**
 * Fetch place-of-worship POIs from OpenStreetMap via Overpass API.
 * Unions three filters to maximise coverage:
 *
 *   1. amenity=place_of_worship             — the standard tag
 *   2. building∈{church,mosque,temple,…}    — building polygons missing the amenity tag
 *   3. historic=wayside_shrine              — small shrines / Kurisupally
 *
 * Deduplication (clustering by proximity) happens in inspect-osm-pow.ts.
 *
 * Usage:
 *   bun run scripts/fetch-osm-pow.ts --sample   // Kottayam district
 *   bun run scripts/fetch-osm-pow.ts --full     // entire Kerala state
 */

const ENDPOINT = "https://overpass-api.de/api/interpreter"

const BUILDING_VALUES = [
  "church",
  "mosque",
  "temple",
  "chapel",
  "cathedral",
  "shrine",
  "monastery",
  "religious",
] as const

const buildAreaQuery = (areaFilter: string, timeout: number) => {
  const buildingLines = BUILDING_VALUES.map(
    (v) => `  nwr["building"="${v}"](area.k);`
  ).join("\n")
  return `[out:json][timeout:${timeout}];
${areaFilter}
(
  nwr["amenity"="place_of_worship"](area.k);
${buildingLines}
  nwr["historic"="wayside_shrine"](area.k);
);
out center tags;`
}

const QUERIES = {
  sample: buildAreaQuery(
    `area["name"="Kottayam"]["admin_level"="5"]->.k;`,
    300
  ),
  full: buildAreaQuery(`area["ISO3166-2"="IN-KL"]->.k;`, 600),
} as const

const OUTPUT_PATHS = {
  sample: "data/raw/osm/places-of-worship-kottayam-sample.json",
  full: "data/raw/osm/places-of-worship-kerala.json",
} as const

const arg = process.argv[2]
if (arg !== "--sample" && arg !== "--full") {
  console.error("Usage: bun run scripts/fetch-osm-pow.ts [--sample|--full]")
  process.exit(1)
}
const mode = arg === "--sample" ? "sample" : "full"

console.log(`[fetch-osm-pow] mode=${mode}`)
console.log(`[fetch-osm-pow] endpoint=${ENDPOINT}`)
console.log(`[fetch-osm-pow] query:\n${QUERIES[mode]}\n`)

const startMs = Date.now()
const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: {
    "User-Agent":
      "kerala-2026-walkthroughs/1.0 (https://github.com/nvlsr/kerala-2026)",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({ data: QUERIES[mode] }),
})

if (!res.ok) {
  const text = await res.text()
  console.error(`HTTP ${res.status} ${res.statusText}`)
  console.error(text.slice(0, 2000))
  process.exit(1)
}

const json = (await res.json()) as { elements?: unknown[] }
const elapsedSec = ((Date.now() - startMs) / 1000).toFixed(1)
const count = json.elements?.length ?? 0

const outPath = OUTPUT_PATHS[mode]
await Bun.write(outPath, JSON.stringify(json, null, 2))

console.log(
  `[fetch-osm-pow] saved ${count} elements to ${outPath} (${elapsedSec}s)`
)
