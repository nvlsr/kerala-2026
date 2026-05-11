/**
 * Inspect a raw Overpass JSON dump of place-of-worship POIs.
 *
 * Runs a spatial dedup pass (BFS-cluster within 30m, merge tags into the
 * richest-tagged member) and prints coverage / histogram tables for both
 * the raw and deduped sets.
 *
 * Usage:
 *   bun run scripts/pipeline/inspect-osm-pow.ts <path-to-osm-json>
 */

type OsmElement = {
  type: "node" | "way" | "relation"
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

type AnnotatedElement = OsmElement & { _source: SourceTag }
type SourceTag = "amenity" | "building" | "shrine" | "unknown"

const BUILDING_RX = /^(church|mosque|temple|chapel|cathedral|shrine|monastery|religious)$/

const path = process.argv[2]
if (!path) {
  console.error("Usage: bun run scripts/pipeline/inspect-osm-pow.ts <path>")
  process.exit(1)
}

const data = (await Bun.file(path).json()) as { elements?: OsmElement[] }
const raw = data.elements ?? []
if (raw.length === 0) {
  console.error("No elements found — wrong file?")
  process.exit(1)
}

// ── Source labelling ──────────────────────────────────────────────────
function sourceOf(e: OsmElement): SourceTag {
  const t = e.tags ?? {}
  if (t.amenity === "place_of_worship") return "amenity"
  if (t.historic === "wayside_shrine") return "shrine"
  if (t.building && BUILDING_RX.test(t.building)) return "building"
  return "unknown"
}

const annotated: AnnotatedElement[] = raw.map((e) => ({
  ...e,
  _source: sourceOf(e),
}))

// ── Spatial dedup (30m cluster, prefer richest-tagged element) ────────
function pointOf(e: OsmElement): [number, number] | null {
  const lat = e.center?.lat ?? e.lat
  const lon = e.center?.lon ?? e.lon
  return lat === undefined || lon === undefined ? null : [lat, lon]
}

function haversineM(a: [number, number], b: [number, number]): number {
  const R = 6_371_000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLon = toRad(b[1] - a[1])
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

function scoreTags(e: OsmElement): number {
  const t = e.tags ?? {}
  let s = Object.keys(t).length
  if (t.religion) s += 10
  if (t.denomination) s += 10
  if (t.name) s += 5
  if (t["name:ml"]) s += 1
  if (t.amenity === "place_of_worship") s += 3
  return s
}

function dedup(
  elements: AnnotatedElement[],
  thresholdM = 30
): { kept: AnnotatedElement[]; clusters: number; dropped: number } {
  const cellSizeDeg = 50 / 111_000
  const points = elements.map(pointOf)
  const buckets = new Map<string, number[]>()
  for (let i = 0; i < elements.length; i++) {
    const p = points[i]
    if (!p) continue
    const key = `${Math.floor(p[0] / cellSizeDeg)}|${Math.floor(p[1] / cellSizeDeg)}`
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key)!.push(i)
  }

  const cluster = new Int32Array(elements.length).fill(-1)
  let nextId = 0

  const neighbors = (lat: number, lon: number): number[] => {
    const cy = Math.floor(lat / cellSizeDeg)
    const cx = Math.floor(lon / cellSizeDeg)
    const out: number[] = []
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const ids = buckets.get(`${cy + dy}|${cx + dx}`)
        if (ids) out.push(...ids)
      }
    return out
  }

  for (let i = 0; i < elements.length; i++) {
    if (cluster[i] !== -1) continue
    cluster[i] = nextId
    const pi = points[i]
    if (!pi) {
      nextId++
      continue
    }
    const queue = [i]
    while (queue.length > 0) {
      const j = queue.pop()!
      const pj = points[j]
      if (!pj) continue
      for (const k of neighbors(pj[0], pj[1])) {
        if (cluster[k] !== -1) continue
        const pk = points[k]
        if (!pk) continue
        if (haversineM(pj, pk) <= thresholdM) {
          cluster[k] = nextId
          queue.push(k)
        }
      }
    }
    nextId++
  }

  const groups = new Map<number, number[]>()
  for (let i = 0; i < elements.length; i++) {
    const c = cluster[i]
    if (!groups.has(c)) groups.set(c, [])
    groups.get(c)!.push(i)
  }

  const kept: AnnotatedElement[] = []
  let droppedCount = 0
  for (const indices of groups.values()) {
    if (indices.length === 1) {
      kept.push(elements[indices[0]])
      continue
    }
    let bestIdx = indices[0]
    let bestScore = scoreTags(elements[bestIdx])
    for (const j of indices.slice(1)) {
      const s = scoreTags(elements[j])
      if (s > bestScore) {
        bestScore = s
        bestIdx = j
      }
    }
    const merged: AnnotatedElement = {
      ...elements[bestIdx],
      tags: { ...elements[bestIdx].tags },
    }
    for (const j of indices) {
      if (j === bestIdx) continue
      for (const [k, v] of Object.entries(elements[j].tags ?? {})) {
        if (!(k in (merged.tags ?? {}))) merged.tags![k] = v
      }
    }
    kept.push(merged)
    droppedCount += indices.length - 1
  }
  return { kept, clusters: nextId, dropped: droppedCount }
}

// ── Summary helpers ───────────────────────────────────────────────────
const pct = (n: number, base: number) =>
  base === 0 ? "n/a" : `${((n / base) * 100).toFixed(1)}%`

const tagCount = (elems: AnnotatedElement[], key: string) =>
  elems.filter((e) => e.tags && key in e.tags).length

const histogram = (elems: AnnotatedElement[], key: string) => {
  const m = new Map<string, number>()
  for (const e of elems) {
    const v = e.tags?.[key] ?? "(none)"
    m.set(v, (m.get(v) ?? 0) + 1)
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

const sourceHistogram = (elems: AnnotatedElement[]) => {
  const m = new Map<SourceTag, number>()
  for (const e of elems) m.set(e._source, (m.get(e._source) ?? 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

// ── Report ────────────────────────────────────────────────────────────
console.log(`\n=== OSM Place-of-Worship Inventory: ${path} ===`)
console.log(`Raw elements: ${annotated.length}`)
console.log(`\nSource breakdown (raw):`)
for (const [s, n] of sourceHistogram(annotated)) console.log(`  ${s.padEnd(12)} ${n}`)

console.log(`\nRunning spatial dedup (30m cluster)…`)
const { kept, clusters, dropped } = dedup(annotated)
console.log(`  raw:        ${annotated.length}`)
console.log(`  clusters:   ${clusters}`)
console.log(`  dropped:    ${dropped} (${pct(dropped, annotated.length)})`)
console.log(`  deduped:    ${kept.length}`)

console.log(`\nSource breakdown (deduped):`)
for (const [s, n] of sourceHistogram(kept)) console.log(`  ${s.padEnd(12)} ${n}`)

console.log(`\nTag coverage (deduped):`)
for (const k of [
  "religion",
  "denomination",
  "name",
  "name:ml",
  "name:en",
  "addr:postcode",
  "wikidata",
]) {
  const c = tagCount(kept, k)
  console.log(`  ${k.padEnd(16)} ${pct(c, kept.length).padStart(7)}  (${c}/${kept.length})`)
}

console.log(`\nReligion histogram (deduped):`)
for (const [k, v] of histogram(kept, "religion")) console.log(`  ${k.padEnd(20)} ${v}`)

console.log(`\nDenomination histogram (deduped, raw values):`)
for (const [k, v] of histogram(kept, "denomination")) console.log(`  ${k.padEnd(32)} ${v}`)

const christians = kept.filter((e) => e.tags?.religion === "christian")
const withDenom = christians.filter((e) => e.tags?.denomination).length
console.log(`\nDenomination among Christian POIs (deduped):`)
console.log(`  total christian: ${christians.length}`)
console.log(
  `  with denomination: ${withDenom} (${pct(withDenom, christians.length)})`
)

const muslims = kept.filter((e) => e.tags?.religion === "muslim")
const mWith = muslims.filter((e) => e.tags?.denomination).length
console.log(`\nDenomination among Muslim POIs (deduped):`)
console.log(`  total muslim: ${muslims.length}`)
console.log(`  with denomination: ${mWith} (${pct(mWith, muslims.length)})`)

console.log(`\nName-keyword scan (Christian POIs, deduped):`)
const KEYWORDS = [
  ["marthoma", /\bmar\s*thoma\b|marthoma/i],
  ["syro_malabar", /syro[\s-]?malabar/i],
  ["syro_malankara", /syro[\s-]?malankara/i],
  ["jacobite", /jacobite/i],
  ["orthodox", /orthodox|malankara/i],
  ["csi", /\bcsi\b|church of south india/i],
  ["pentecostal_ipc", /\bipc\b|pentecostal|assemblies of god/i],
  ["catholic_generic", /catholic/i],
  ["brethren", /brethren/i],
  ["knanaya", /knanaya/i],
] as const
for (const [label, rx] of KEYWORDS) {
  const matches = christians.filter((e) => {
    const n = (e.tags?.name ?? "") + " " + (e.tags?.["name:ml"] ?? "")
    return rx.test(n)
  })
  console.log(`  ${label.padEnd(20)} ${matches.length}`)
}

console.log(``)
