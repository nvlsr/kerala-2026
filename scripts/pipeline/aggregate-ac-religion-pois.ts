/**
 * Aggregate the classified per-POI inventory into per-AC summary.
 *
 *   in:  data/places-of-worship.json (per-POI, ~22k rows; gitignored)
 *   out: data/ac-religious-pois.json (140 ACs, keyed by AC#)
 *
 * Output schema (per AC, keyed by string AC number):
 *   "1": {
 *     totalPois,
 *     byReligion:        { christian, muslim, hindu, other, unknown },
 *     christianByDenom:  { syro_malabar, latin_catholic, …, "(none)" },
 *     muslimByDenom:     { sunni, salafi_mujahid, …, "(none)" },
 *     dominantChristian: <bucket or null>,
 *     dominantMuslim:    <bucket or null>
 *   }
 *
 * `ac_name` + `district` are NOT stored — they're rehydrated at load
 * time from `data/ac-names.json` + `data/districts.json`.
 *
 * Usage: bun run scripts/pipeline/aggregate-ac-religion-pois.ts
 */
import { saveJson } from "../_lib/save"

type ClassifiedPOI = {
  religion: "christian" | "muslim" | "hindu" | "other" | "unknown"
  denomination: string | null
  denomination_confidence: string
  ac_id: number | null
  ac_name: string | null
  district: string | null
}

type ACSummary = {
  totalPois: number
  byReligion: Record<string, number>
  christianByDenom: Record<string, number>
  muslimByDenom: Record<string, number>
  dominantChristian: string | null
  dominantMuslim: string | null
}

const INPUT = "data/places-of-worship.json"
const OUTPUT = "data/ac-religious-pois.json"

console.log(`[aggregate] reading ${INPUT}`)
const data = (await Bun.file(INPUT).json()) as ClassifiedPOI[]
console.log(`[aggregate] ${data.length} POIs in`)

// Group by AC
const groups = new Map<number, ClassifiedPOI[]>()
for (const p of data) {
  if (p.ac_id == null) continue
  if (!groups.has(p.ac_id)) groups.set(p.ac_id, [])
  groups.get(p.ac_id)!.push(p)
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

const summaries: Record<string, ACSummary> = {}
for (const acId of ACS) {
  const pois = groups.get(acId)!

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

  summaries[String(acId)] = {
    totalPois: pois.length,
    byReligion,
    christianByDenom: christian.hist,
    muslimByDenom: muslim.hist,
    dominantChristian: christian.top,
    dominantMuslim: muslim.top,
  }
}

saveJson(OUTPUT, summaries)
console.log(
  `[aggregate] wrote ${Object.keys(summaries).length} AC summaries to ${OUTPUT}`
)

// ── Summary stats ─────────────────────────────────────────────────────
const dominantChristian = new Map<string, number>()
const dominantMuslim = new Map<string, number>()
for (const s of Object.values(summaries)) {
  if (s.dominantChristian)
    dominantChristian.set(
      s.dominantChristian,
      (dominantChristian.get(s.dominantChristian) ?? 0) + 1
    )
  if (s.dominantMuslim)
    dominantMuslim.set(
      s.dominantMuslim,
      (dominantMuslim.get(s.dominantMuslim) ?? 0) + 1
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
