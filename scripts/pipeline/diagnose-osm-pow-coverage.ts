/**
 * Diagnostic count queries to decide whether to broaden the OSM POW fetch.
 *
 * Splits the building filter into one query per exact-match value (Overpass
 * indexes equality far better than ~regex on tag values).
 *
 * Usage: bun run scripts/pipeline/diagnose-osm-pow-coverage.ts
 */

const ENDPOINT = "https://overpass-api.de/api/interpreter"
const AREA = `area["name"="Kottayam"]["admin_level"="5"]->.k;`

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

const buildingUnion = BUILDING_VALUES.map(
  (v) => `  nwr["building"="${v}"](area.k);`
).join("\n")

const buildingUnionNoAmenity = BUILDING_VALUES.map(
  (v) => `  nwr["building"="${v}"]["amenity"!="place_of_worship"](area.k);`
).join("\n")

const QUERIES: Record<string, string> = {
  amenity_only: `[out:json][timeout:180];
${AREA}
nwr["amenity"="place_of_worship"](area.k);
out count;`,

  building_only: `[out:json][timeout:180];
${AREA}
(
${buildingUnion}
);
out count;`,

  union_all: `[out:json][timeout:180];
${AREA}
(
  nwr["amenity"="place_of_worship"](area.k);
${buildingUnion}
);
out count;`,

  building_without_amenity: `[out:json][timeout:180];
${AREA}
(
${buildingUnionNoAmenity}
);
out count;`,
}

type CountResponse = {
  elements: {
    type: string
    tags?: { nodes?: string; ways?: string; relations?: string; total?: string }
  }[]
}

async function runQuery(name: string, body: string): Promise<number> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "User-Agent":
        "kerala-2026-walkthroughs/1.0 (https://github.com/nvlsr/kerala-2026)",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ data: body }),
  })
  if (!res.ok) {
    console.error(`[${name}] HTTP ${res.status}`)
    return -1
  }
  const json = (await res.json()) as CountResponse
  const tags = json.elements?.[0]?.tags ?? {}
  return parseInt(tags.total ?? "0", 10)
}

console.log(`Running 4 count queries against Overpass…\n`)
const results: Record<string, number> = {}
for (const [name, body] of Object.entries(QUERIES)) {
  process.stdout.write(`  ${name.padEnd(28)} … `)
  const t0 = Date.now()
  const n = await runQuery(name, body)
  results[name] = n
  console.log(`${n}  (${((Date.now() - t0) / 1000).toFixed(1)}s)`)
  await Bun.sleep(800)
}

const A = results.amenity_only
const B = results.building_only
const U = results.union_all
const netBuilding = results.building_without_amenity

console.log(`\n=== Coverage analysis for Kottayam district ===\n`)
console.log(`A: amenity=place_of_worship           : ${A}`)
console.log(`B: building=<religious type>          : ${B}`)
console.log(`U: A ∪ B                              : ${U}`)
console.log(`overlap (A + B − U)                   : ${A + B - U}`)
console.log(``)
console.log(`Net gain from broadening:`)
console.log(`  building-only (no amenity tag)      : +${netBuilding}   (${pct(netBuilding, A)} of A)`)
console.log(`  wayside_shrine (no amenity tag)     : +68   (3.2% of A — from earlier run)`)
console.log(``)
console.log(`Hypothetical broadened set            : ${A + netBuilding + 68}  (vs. baseline ${A})`)
console.log(`Overlap as % of B                     : ${B > 0 ? (((A + B - U) / B) * 100).toFixed(1) + "%" : "n/a"}`)

function pct(n: number, base: number): string {
  if (base === 0) return "n/a"
  if (n < 0) return "(failed)"
  return `${((n / base) * 100).toFixed(1)}%`
}
