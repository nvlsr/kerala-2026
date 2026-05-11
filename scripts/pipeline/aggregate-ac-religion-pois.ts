/**
 * Aggregate the classified per-POI inventory into per-AC summary.
 *
 *   in:  data/places-of-worship.json (per-POI, ~22k rows)
 *   out: data/ac-religious-poi-inventory.json (140 ACs)
 *
 * Output schema (per AC):
 *   {
 *     ac_id, ac_name, district,
 *     total_pois,
 *     by_religion:               { christian, muslim, hindu, other, unknown },
 *     by_christian_denomination: { syro_malabar, latin_catholic, …, "(none)" },
 *     by_muslim_denomination:    { sunni, salafi_mujahid, …, "(none)" },
 *     dominant_christian_denomination: <bucket or null>,
 *     dominant_muslim_denomination:    <bucket or null>
 *   }
 *
 * Usage: bun run scripts/pipeline/aggregate-ac-religion-pois.ts
 */

type ClassifiedPOI = {
  religion: "christian" | "muslim" | "hindu" | "other" | "unknown"
  denomination: string | null
  denomination_confidence: string
  ac_id: number | null
  ac_name: string | null
  district: string | null
}

type ACSummary = {
  ac_id: number
  ac_name: string
  district: string
  total_pois: number
  by_religion: Record<string, number>
  by_christian_denomination: Record<string, number>
  by_muslim_denomination: Record<string, number>
  dominant_christian_denomination: string | null
  dominant_muslim_denomination: string | null
}

const INPUT = "data/places-of-worship.json"
const OUTPUT = "data/ac-religious-poi-inventory.json"

console.log(`[aggregate] reading ${INPUT}`)
const data = (await Bun.file(INPUT).json()) as ClassifiedPOI[]
console.log(`[aggregate] ${data.length} POIs in`)

// Group by AC
const groups = new Map<number, ClassifiedPOI[]>()
const acMeta = new Map<number, { name: string; district: string }>()
for (const p of data) {
  if (p.ac_id == null || !p.ac_name || !p.district) continue
  if (!groups.has(p.ac_id)) groups.set(p.ac_id, [])
  groups.get(p.ac_id)!.push(p)
  acMeta.set(p.ac_id, { name: p.ac_name, district: p.district })
}

const ACS = [...groups.keys()].sort((a, b) => a - b)

function dominantDenom(
  pois: ClassifiedPOI[],
  religion: "christian" | "muslim"
): { hist: Record<string, number>; top: string | null } {
  const hist: Record<string, number> = {}
  for (const p of pois) {
    if (p.religion !== religion) continue
    const key = p.denomination ?? "(none)"
    hist[key] = (hist[key] ?? 0) + 1
  }
  // Dominant = highest-count non-"(none)" bucket; null if no classified POIs
  let top: string | null = null
  let topN = 0
  for (const [k, v] of Object.entries(hist)) {
    if (k === "(none)") continue
    if (v > topN) {
      topN = v
      top = k
    }
  }
  return { hist, top }
}

const summaries: ACSummary[] = []
for (const acId of ACS) {
  const pois = groups.get(acId)!
  const meta = acMeta.get(acId)!

  const byReligion: Record<string, number> = {
    christian: 0,
    muslim: 0,
    hindu: 0,
    other: 0,
    unknown: 0,
  }
  for (const p of pois) byReligion[p.religion] = (byReligion[p.religion] ?? 0) + 1

  const christian = dominantDenom(pois, "christian")
  const muslim = dominantDenom(pois, "muslim")

  summaries.push({
    ac_id: acId,
    ac_name: meta.name,
    district: meta.district,
    total_pois: pois.length,
    by_religion: byReligion,
    by_christian_denomination: christian.hist,
    by_muslim_denomination: muslim.hist,
    dominant_christian_denomination: christian.top,
    dominant_muslim_denomination: muslim.top,
  })
}

await Bun.write(OUTPUT, JSON.stringify(summaries, null, 2))
console.log(`[aggregate] wrote ${summaries.length} AC summaries to ${OUTPUT}`)

// ── Summary stats ─────────────────────────────────────────────────────
const dominantChristian = new Map<string, number>()
const dominantMuslim = new Map<string, number>()
for (const s of summaries) {
  if (s.dominant_christian_denomination)
    dominantChristian.set(
      s.dominant_christian_denomination,
      (dominantChristian.get(s.dominant_christian_denomination) ?? 0) + 1
    )
  if (s.dominant_muslim_denomination)
    dominantMuslim.set(
      s.dominant_muslim_denomination,
      (dominantMuslim.get(s.dominant_muslim_denomination) ?? 0) + 1
    )
}

console.log(`\n=== ACs by dominant Christian sub-rite ===`)
for (const [k, v] of [...dominantChristian.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(24)} ${v} ACs`)
}

console.log(`\n=== ACs by dominant Muslim sub-rite ===`)
for (const [k, v] of [...dominantMuslim.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(24)} ${v} ACs`)
}

// Total unjoined check
const unjoined = data.filter((p) => p.ac_id == null).length
console.log(`\nUnjoined POIs (outside AC polygons): ${unjoined}`)
