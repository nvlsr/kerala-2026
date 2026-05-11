/**
 * Phase 2: classify OSM place-of-worship POIs.
 *
 * Reads the raw Overpass dump, dedupes spatially, normalises religion +
 * denomination, infers religion/denomination from name where tags are
 * missing, spatially joins to AC, applies a district-level prior to
 * disambiguate generic `catholic` POIs into Latin / Syro-Malabar /
 * Syro-Malankara, and emits a per-POI JSON.
 *
 *   in:  data/raw/osm/places-of-worship-kerala.json
 *   out: data/places-of-worship.json
 *
 * Usage: bun run scripts/classify-osm-pow.ts
 */


// ── Types ─────────────────────────────────────────────────────────────
type OsmElement = {
  type: "node" | "way" | "relation"
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

type Religion = "christian" | "muslim" | "hindu" | "other" | "unknown"
type Confidence =
  | "tag"
  | "name_strong"
  | "name_weak"
  | "inferred_religion_only"
  | "unknown"

type ClassifiedPOI = {
  id: string
  lat: number
  lon: number
  religion: Religion
  denomination: string | null
  denomination_confidence: Confidence
  name: string | null
  name_ml: string | null
  ac_id: number | null
  ac_name: string | null
  district: string | null
  source: "amenity" | "building" | "shrine" | "unknown"
}

type ACFeature = {
  id: number
  name: string
  districtId: string
  bbox: [number, number, number, number] // [minLon, minLat, maxLon, maxLat]
  ring: number[][] // [[lon, lat], …]
}

// ── Religion normalisation ────────────────────────────────────────────
const RELIGION_MAP: Record<string, Religion> = {
  christian: "christian",
  hindu: "hindu",
  muslim: "muslim",
  islamic: "muslim",
  islam: "muslim",
  sikh: "other",
  buddhist: "other",
  jain: "other",
  jewish: "other",
  shinto: "other",
  jacobite_syrian_christian: "christian",
  ipc_gannesareth: "christian",
  hindhu: "hindu",
  hindus: "hindu",
  all: "other",
  multifaith: "other",
  none: "unknown",
  nil: "unknown",
  gurumandiram: "hindu",
}

const normaliseKey = (s: string): string =>
  s.trim().toLowerCase().replace(/[\s\-]+/g, "_")

const inferReligionFromTag = (raw: string | undefined): Religion => {
  if (!raw) return "unknown"
  const key = normaliseKey(raw)
  const direct = RELIGION_MAP[key]
  if (direct) return direct
  // Names that leaked into the religion field (e.g. "Mannuthy_Mahallu_Jumma_Musjid")
  if (/masjid|musjid|mosque|jumma/i.test(raw)) return "muslim"
  if (/church|chapel|cathedral/i.test(raw)) return "christian"
  if (/temple|kshetram/i.test(raw)) return "hindu"
  return "unknown"
}

const RELIGION_FROM_NAME: Array<[RegExp, Religion]> = [
  [
    /\b(church|chapel|cathedral|basilica|kurisupally|kurishupally|christian|catholic|orthodox|jacobite|marthoma|mar\s*thoma|csi|pentecostal|ipc|adventist|baptist|holy\s+(family|cross|trinity|spirit)|st\.?\s+\w|saint\s+\w|mar\s+\w|carmelite|jesus|christ)\b/i,
    "christian",
  ],
  [
    /\b(masjid|musjid|mosque|jumma|juma\b|muslim|islamic|islam|dargah|jamath|jamaat|madrassa|mahallu|sunni|salafi|mujahid|ahmadiyya|jamia|jami\s)\b/i,
    "muslim",
  ],
  [
    /\b(temple|kshetram|kshetra|devasthanam|kshethram|kavu|ambalam|mandir|mandiram|sree\s|sri\s|shiva|krishna|vishnu|narasimha|hanuman|durga|kali|bhagav|bhagavath|ayyappa|ayyappan|ganesh|ganapathy|ganapathi|saraswati|mahadeva|narayan|devi\s|maha\s+vishnu|guruvayur)\b/i,
    "hindu",
  ],
]

const inferReligionFromName = (name: string | undefined): Religion => {
  if (!name) return "unknown"
  for (const [rx, religion] of RELIGION_FROM_NAME) {
    if (rx.test(name)) return religion
  }
  return "unknown"
}

// ── Denomination normalisation (variants → canonical) ────────────────
// Canonical Christian buckets:
//   latin_catholic, syro_malabar, syro_malankara, knanaya_catholic,
//   catholic_generic (needs disambiguation by AC/district),
//   marthoma, indian_orthodox, jacobite_syrian, knanaya_jacobite,
//   csi, pentecostal, brethren, other_christian
// Canonical Muslim buckets:
//   sunni, salafi_mujahid, jamaat_islami, ahmadiyya, shia, other_muslim
// Hindu: no sub-denomination (single bucket).

const DENOMINATION_MAP: Record<string, string> = {
  // Catholic (generic — needs spatial prior to split)
  catholic: "catholic_generic",
  roman_catholic: "catholic_generic",
  caholic: "catholic_generic",

  // Catholic sub-rites — explicit
  latin_catholic: "latin_catholic",
  latin: "latin_catholic",
  latin_catholic_diocese_of_neyyattinkara: "latin_catholic",
  roman_catholic_latin_church: "latin_catholic",
  syro_malabar_catholic: "syro_malabar",
  syro_malabar: "syro_malabar",
  "catholic,_syro_malabar": "syro_malabar",
  cmi: "syro_malabar", // Carmelites of Mary Immaculate (Syro-Malabar order)
  vincentian: "syro_malabar", // Vincentian Congregation (Syro-Malabar)
  syro_malankara: "syro_malankara",
  syro_malankara_catholic: "syro_malankara",
  malankara_catholic: "syro_malankara",
  knanaya_catholic: "knanaya_catholic",
  knanaya: "knanaya_catholic",
  syrian_roman_catholic: "syro_malabar",

  // Marthoma
  marthoma: "marthoma",
  mar_thoma: "marthoma",
  marthoma_church: "marthoma",
  mar_thoma_syrian: "marthoma",
  mar_thoma_syrian_church_of_malabar: "marthoma",
  marthomite: "marthoma",
  martho: "marthoma",
  mathoma: "marthoma",
  marthomatie: "marthoma",

  // Indian/Malankara Orthodox
  orthodox: "indian_orthodox",
  indian_orthodox: "indian_orthodox",
  malankara_orthodox: "indian_orthodox",
  malankara: "indian_orthodox",
  orthodox_syrian_church: "indian_orthodox",

  // Jacobite Syrian
  jacobite: "jacobite_syrian",
  jacobite_syrian: "jacobite_syrian",
  jacobite_syrian_orthodox: "jacobite_syrian",
  jacobite_syrian_orthodox_church: "jacobite_syrian",
  jacobite_syrian_church: "jacobite_syrian",
  jacobite_syrian_soonoro_church: "jacobite_syrian",
  syrian_jacobite: "jacobite_syrian",
  syriac_orthodox: "jacobite_syrian", // closely related; pragmatic lump
  syriac_catholic: "syro_malabar", // small body in Kerala; closest to SM
  assyrian: "other_christian",

  // Knanaya Jacobite
  knanaya_jacobite: "knanaya_jacobite",

  // CSI
  csi: "csi",
  c_s_i: "csi",
  church_of_south_india: "csi",
  church_of_southindia: "csi",
  cms: "csi", // Church Missionary Society — CSI predecessor
  siuc: "csi",

  // Pentecostal
  pentecostal: "pentecostal",
  penthecost: "pentecostal",
  ipc: "pentecostal",
  tpm: "pentecostal",
  assemblies_of_god: "pentecostal",
  horeb: "pentecostal", // common Pentecostal church name

  // Brethren
  brethren: "brethren",

  // Other Christian — Protestant + smaller bodies
  protestant: "other_christian",
  anglican: "other_christian",
  baptist: "other_christian",
  evangelical: "other_christian",
  evangelical_lutheran: "other_christian",
  lutheran: "other_christian",
  methodist: "other_christian",
  nondenominational: "other_christian",
  jehovahs_witness: "other_christian",
  seventh_day_adventist: "other_christian",
  new_apostolic: "other_christian",
  maronite: "other_christian",
  malabar_independent_syrian_church: "other_christian",
  united: "other_christian",
  uniting: "other_christian",
  salvation_army: "other_christian",
  quaker: "other_christian",
  la_luz_del_mundo: "other_christian",

  // Muslim
  sunni: "sunni",
  sunni_ap: "sunni",
  hanafi: "sunni", // Hanafi madhhab — Sunni default
  salafi: "salafi_mujahid",
  mujahid: "salafi_mujahid",
  ahmadiyya: "ahmadiyya",
  shia: "shia",
  sufi: "other_muslim",
  jamath_islami: "jamaat_islami",
  jamat_islami: "jamaat_islami",
  "jamaa'th_e_islami": "jamaat_islami",
  jamaa_th_e_islami: "jamaat_islami",
  jamath: "jamaat_islami", // ambiguous but typically JIH in this context
  jamaath: "jamaat_islami",
  jamaet: "jamaat_islami",
  jamat: "jamaat_islami",
}

// Junk: things that appear in `denomination` field but aren't denominations
// (deity names, temple names, parsing noise). We strip these.
const DENOMINATION_JUNK_PATTERNS: RegExp[] = [
  /^shiva$/i,
  /^krishna$/i,
  /^hanuman$/i,
  /^vishnu$/i,
  /^ayyappa(n)?$/i,
  /^ganapath[iy]$/i,
  /^durga$/i,
  /^devi(_temple)?$/i,
  /^lord_/i,
  /^sri[\s_]/i,
  /^sree[\s_]/i,
  /^bagavathi$/i,
  /^bhagavathi/i,
  /^siva_/i,
  /^shiva_/i,
  /^maha_/i,
  /^vadakkanthara$/i,
  /^narasimha/i,
  /^manapulli_/i,
  /^kumminiveettil/i,
  /^gramakulam_/i,
  /^thampuran_/i,
  /^puliyara_/i,
  /^bathru_/i,
  /^traditional_tribals$/i,
  /^devaswom_/i,
  /^moothan_/i,
  /^gurupadapuri$/i,
  /^nayar$/i, // caste name; not actionable
  /^thiyya$/i,
  /^ezhava$/i,
  /^eezhava$/i,
  /^sndp$/i,
  /^shaivism$/i,
  /^shaktism$/i,
  /^vaishnavism$/i,
  /^smartism$/i,
  /^hindu$/i, // duplicate of religion=hindu
  /^muslim$/i, // duplicate of religion=muslim
  /^christian$/i, // duplicate of religion=christian
  /^islamic$/i,
  /^islam$/i,
  /^temple$/i,
  /^church$/i,
  /^mosque$/i,
  /^all$/i,
  /^h$/i,
  /^1$/,
  /^nil$/i,
  /^not_known$/i,
  /^yogi$/i,
  /^uniting$/i,
  /^bishop/i,
  /^farook_juma_sunni_musjid/i,
]

const isDenominationJunk = (raw: string): boolean => {
  return DENOMINATION_JUNK_PATTERNS.some((rx) => rx.test(raw))
}

const normaliseDenominationTag = (raw: string | undefined): string | null => {
  if (!raw) return null
  if (isDenominationJunk(raw)) return null
  const key = normaliseKey(raw)
  const mapped = DENOMINATION_MAP[key]
  return mapped ?? null
}

// Which canonical denominations belong to which religion.
const CHRISTIAN_DENOMS = new Set([
  "catholic_generic",
  "latin_catholic",
  "syro_malabar",
  "syro_malankara",
  "knanaya_catholic",
  "marthoma",
  "indian_orthodox",
  "jacobite_syrian",
  "knanaya_jacobite",
  "csi",
  "pentecostal",
  "brethren",
  "other_christian",
])
const MUSLIM_DENOMS = new Set([
  "sunni",
  "salafi_mujahid",
  "jamaat_islami",
  "ahmadiyya",
  "shia",
  "other_muslim",
])

const religionOfDenomination = (denom: string): Religion => {
  if (CHRISTIAN_DENOMS.has(denom)) return "christian"
  if (MUSLIM_DENOMS.has(denom)) return "muslim"
  return "unknown"
}

// ── Name-regex denomination inference ─────────────────────────────────
// Strong = unambiguous keyword; weak = generic/contextual marker.
type Pattern = { rx: RegExp; bucket: string; strength: "strong" | "weak" }

const CHRISTIAN_PATTERNS: Pattern[] = [
  { rx: /\bmar\s*thoma|marthoma/i, bucket: "marthoma", strength: "strong" },
  {
    rx: /\bsyro[-\s]?malabar|forane/i,
    bucket: "syro_malabar",
    strength: "strong",
  },
  {
    rx: /\bsyro[-\s]?malankara/i,
    bucket: "syro_malankara",
    strength: "strong",
  },
  { rx: /\bjacobite/i, bucket: "jacobite_syrian", strength: "strong" },
  {
    rx: /\b(malankara\s+orthodox|indian\s+orthodox|orthodox\s+syrian)/i,
    bucket: "indian_orthodox",
    strength: "strong",
  },
  { rx: /\borthodox\b/i, bucket: "indian_orthodox", strength: "weak" },
  {
    rx: /\b(csi|church\s+of\s+south\s+india)\b/i,
    bucket: "csi",
    strength: "strong",
  },
  {
    rx: /\b(ipc|pentecostal|penthecost|assemblies\s+of\s+god|\btpm\b|the\s+pentecostal\s+mission)\b/i,
    bucket: "pentecostal",
    strength: "strong",
  },
  {
    rx: /\b(plymouth\s+)?brethren\b/i,
    bucket: "brethren",
    strength: "strong",
  },
  { rx: /\bknanaya/i, bucket: "knanaya_catholic", strength: "weak" },
  {
    rx: /\blatin\s+catholic|roman\s+catholic\b/i,
    bucket: "latin_catholic",
    strength: "strong",
  },
  { rx: /\b(carmelite|cmi)\b/i, bucket: "syro_malabar", strength: "strong" },
  { rx: /\bcatholic\b/i, bucket: "catholic_generic", strength: "weak" },
]

const MUSLIM_PATTERNS: Pattern[] = [
  {
    rx: /\b(mujahid|salafi|islahi|knm|ism)\b/i,
    bucket: "salafi_mujahid",
    strength: "strong",
  },
  {
    rx: /\b(jamaat[-\s]e[-\s]islami|jih|hira\s+centre|hira\s+islamic)/i,
    bucket: "jamaat_islami",
    strength: "strong",
  },
  { rx: /\bahmadiyya\b/i, bucket: "ahmadiyya", strength: "strong" },
  { rx: /\bshia\b/i, bucket: "shia", strength: "strong" },
]

// ── Catholic disambiguation: district-level prior ─────────────────────
// Used when a POI is tagged `catholic` or `roman_catholic` (no sub-rite)
// AND name-regex didn't resolve. Districts mapped to dominant sub-rite.
const CATHOLIC_PRIOR_BY_DISTRICT: Record<string, string> = {
  thiruvananthapuram: "latin_catholic", // Trivandrum Latin archdiocese
  kollam: "latin_catholic", // Quilon Latin diocese
  alappuzha: "latin_catholic", // Alleppey Latin diocese (coastal)
  pathanamthitta: "syro_malankara", // Tiruvalla SMK heartland
  kottayam: "syro_malabar", // Pala / Changanacherry / Kottayam (all SM)
  idukki: "syro_malabar", // Idukki + Kanjirapally eparchies
  ernakulam: "syro_malabar", // Ernakulam-Angamaly Major (with Verapoly Latin in city)
  thrissur: "syro_malabar", // Thrissur Archeparchy
  palakkad: "syro_malabar", // SM migrant majority
  malappuram: "syro_malabar", // SM minority (mostly Nilambur)
  kozhikode: "latin_catholic", // Calicut Latin diocese
  wayanad: "syro_malabar", // Mananthavady SM eparchy
  kannur: "latin_catholic", // Kannur Latin diocese
  kasaragod: "latin_catholic", // Calicut/Kannur Latin coverage
}

// AC-level overrides where the district default is wrong. Use the AC name
// exactly as it appears in `data/kerala-constituencies.geojson`.
const CATHOLIC_AC_OVERRIDE: Record<string, string> = {
  // Ernakulam coastal Latin (Verapoly archdiocese, est. 1659)
  "Kochi": "latin_catholic",
  "Vypen": "latin_catholic",
  "Eranakulam": "latin_catholic",
  // Trivandrum interior — Malayalam SMK pockets, but Latin dominates broadly
  // (no override needed)
  // Pathanamthitta has SM as well as SMK; coarsen to SMK only at district level
  "Konni": "syro_malabar", // Konni has SM presence
  "Ranni": "syro_malabar", // mixed but SM leans
  // Wayanad — Sulthanbathery has both, Mananthavady is SM
  // Alappuzha — Chengannur has SM presence inland
  "Chengannur": "syro_malabar",
  // Thrissur — Kodungallur is Latin (Cranganore historical Latin diocese)
  "Kodungallur": "latin_catholic",
  // Kollam — Kunnathur/Pathanapuram inland SMK presence
  "Pathanapuram": "syro_malankara",
}

// ── AC spatial join ───────────────────────────────────────────────────
async function loadACs(geojsonPath: string): Promise<ACFeature[]> {
  const data = (await Bun.file(geojsonPath).json()) as {
    features: Array<{
      properties: {
        constituencyNumber: number
        name: string
        districtId: string
      }
      geometry: { type: "Polygon"; coordinates: number[][][] }
    }>
  }
  return data.features.map((f) => {
    const ring = f.geometry.coordinates[0] // outer ring (no multipolygons in this file)
    let minLon = Infinity,
      minLat = Infinity,
      maxLon = -Infinity,
      maxLat = -Infinity
    for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon
      if (lon > maxLon) maxLon = lon
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    }
    return {
      id: f.properties.constituencyNumber,
      name: f.properties.name,
      districtId: f.properties.districtId,
      bbox: [minLon, minLat, maxLon, maxLat],
      ring,
    }
  })
}

function pointInRing(lon: number, lat: number, ring: number[][]): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0],
      yi = ring[i][1]
    const xj = ring[j][0],
      yj = ring[j][1]
    if (
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    )
      inside = !inside
  }
  return inside
}

function findAC(
  lat: number,
  lon: number,
  acs: ACFeature[]
): ACFeature | null {
  for (const ac of acs) {
    if (lon < ac.bbox[0] || lon > ac.bbox[2]) continue
    if (lat < ac.bbox[1] || lat > ac.bbox[3]) continue
    if (pointInRing(lon, lat, ac.ring)) return ac
  }
  return null
}

// ── Dedup (BFS-cluster within 30m, prefer richest-tagged member) ──────
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

function dedup(elements: OsmElement[], thresholdM = 30): OsmElement[] {
  const cellDeg = 50 / 111_000
  const points = elements.map(pointOf)
  const buckets = new Map<string, number[]>()
  for (let i = 0; i < elements.length; i++) {
    const p = points[i]
    if (!p) continue
    const key = `${Math.floor(p[0] / cellDeg)}|${Math.floor(p[1] / cellDeg)}`
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key)!.push(i)
  }
  const cluster = new Int32Array(elements.length).fill(-1)
  let nextId = 0
  const neighbors = (lat: number, lon: number): number[] => {
    const cy = Math.floor(lat / cellDeg)
    const cx = Math.floor(lon / cellDeg)
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
    if (pi) {
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
    }
    nextId++
  }
  const groups = new Map<number, number[]>()
  for (let i = 0; i < elements.length; i++) {
    const c = cluster[i]
    if (!groups.has(c)) groups.set(c, [])
    groups.get(c)!.push(i)
  }
  const kept: OsmElement[] = []
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
    const merged: OsmElement = {
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
  }
  return kept
}

const BUILDING_RX =
  /^(church|mosque|temple|chapel|cathedral|shrine|monastery|religious)$/
function sourceOf(e: OsmElement): ClassifiedPOI["source"] {
  const t = e.tags ?? {}
  if (t.amenity === "place_of_worship") return "amenity"
  if (t.historic === "wayside_shrine") return "shrine"
  if (t.building && BUILDING_RX.test(t.building)) return "building"
  return "unknown"
}

// ── Classification ────────────────────────────────────────────────────
function classify(e: OsmElement, acs: ACFeature[]): ClassifiedPOI | null {
  const p = pointOf(e)
  if (!p) return null
  const [lat, lon] = p
  const tags = e.tags ?? {}
  const name = tags.name ?? null
  const nameMl = tags["name:ml"] ?? null

  // Religion
  let religion = inferReligionFromTag(tags.religion)
  if (religion === "unknown") {
    religion = inferReligionFromName(name ?? "")
  }

  // AC join
  const ac = findAC(lat, lon, acs)

  // Denomination
  let denomination: string | null = null
  let confidence: Confidence = "unknown"

  // Step 1: try the OSM denomination tag (after normalisation)
  if (tags.denomination) {
    const normalised = normaliseDenominationTag(tags.denomination)
    if (normalised) {
      const denomReligion = religionOfDenomination(normalised)
      if (religion === "unknown" && denomReligion !== "unknown") {
        // Religion was missing — recover it from the denomination
        religion = denomReligion
        denomination = normalised
        confidence = "tag"
      } else if (denomReligion === "unknown" || denomReligion === religion) {
        denomination = normalised
        confidence = "tag"
      }
      // else: cross-religion leak (e.g. religion=muslim + denom=pentecostal); drop
    }
  }

  // Step 2: name-regex fallback (or refinement if tag was 'catholic_generic')
  const combinedName = `${name ?? ""} ${nameMl ?? ""}`
  if (
    religion === "christian" &&
    (!denomination || denomination === "catholic_generic")
  ) {
    for (const p of CHRISTIAN_PATTERNS) {
      if (p.rx.test(combinedName)) {
        if (p.bucket === "catholic_generic" && denomination === "catholic_generic") {
          break // already there from tag; keep
        }
        if (
          p.bucket !== "catholic_generic" &&
          // don't downgrade a strong tag-based hit
          (!denomination || denomination === "catholic_generic")
        ) {
          denomination = p.bucket
          confidence = p.strength === "strong" ? "name_strong" : "name_weak"
          break
        }
        if (!denomination) {
          denomination = p.bucket
          confidence = p.strength === "strong" ? "name_strong" : "name_weak"
          break
        }
      }
    }
  }

  if (religion === "muslim" && !denomination) {
    for (const p of MUSLIM_PATTERNS) {
      if (p.rx.test(combinedName)) {
        denomination = p.bucket
        confidence = p.strength === "strong" ? "name_strong" : "name_weak"
        break
      }
    }
  }

  // Step 3: catholic_generic → AC/district prior
  if (denomination === "catholic_generic") {
    const acOverride = ac ? CATHOLIC_AC_OVERRIDE[ac.name] : undefined
    const districtPrior = ac
      ? CATHOLIC_PRIOR_BY_DISTRICT[ac.districtId]
      : undefined
    const prior = acOverride ?? districtPrior
    if (prior) {
      denomination = prior
      confidence = "name_weak" // prior-based assignment, low confidence
    }
  }

  // Step 4: religion known but no denomination → mark accordingly
  if (!denomination && religion !== "unknown") {
    confidence = "inferred_religion_only"
  }

  return {
    id: `${e.type}/${e.id}`,
    lat,
    lon,
    religion,
    denomination,
    denomination_confidence: confidence,
    name,
    name_ml: nameMl,
    ac_id: ac?.id ?? null,
    ac_name: ac?.name ?? null,
    district: ac?.districtId ?? null,
    source: sourceOf(e),
  }
}

// ── Main ──────────────────────────────────────────────────────────────
const INPUT = "data/raw/osm/places-of-worship-kerala.json"
const OUTPUT = "data/places-of-worship.json"
const GEOJSON = "data/kerala-constituencies.geojson"

console.log(`[classify-osm-pow] reading ${INPUT}`)
const raw = (await Bun.file(INPUT).json()) as { elements?: OsmElement[] }
const elements = raw.elements ?? []
console.log(`[classify-osm-pow] raw elements: ${elements.length}`)

const deduped = dedup(elements)
console.log(`[classify-osm-pow] deduped: ${deduped.length}`)

console.log(`[classify-osm-pow] loading AC polygons from ${GEOJSON}`)
const acs = await loadACs(GEOJSON)
console.log(`[classify-osm-pow] loaded ${acs.length} ACs`)

console.log(`[classify-osm-pow] classifying…`)
const classified: ClassifiedPOI[] = []
for (const e of deduped) {
  const c = classify(e, acs)
  if (c) classified.push(c)
}

await Bun.write(OUTPUT, JSON.stringify(classified, null, 2))
console.log(`[classify-osm-pow] wrote ${classified.length} POIs to ${OUTPUT}`)

// ── Summary stats ─────────────────────────────────────────────────────
const byReligion = new Map<string, number>()
const byChristianDenom = new Map<string, number>()
const byMuslimDenom = new Map<string, number>()
const byConfidence = new Map<string, number>()
let unjoined = 0
for (const c of classified) {
  byReligion.set(c.religion, (byReligion.get(c.religion) ?? 0) + 1)
  byConfidence.set(
    c.denomination_confidence,
    (byConfidence.get(c.denomination_confidence) ?? 0) + 1
  )
  if (c.religion === "christian") {
    const d = c.denomination ?? "(none)"
    byChristianDenom.set(d, (byChristianDenom.get(d) ?? 0) + 1)
  }
  if (c.religion === "muslim") {
    const d = c.denomination ?? "(none)"
    byMuslimDenom.set(d, (byMuslimDenom.get(d) ?? 0) + 1)
  }
  if (!c.ac_id) unjoined++
}

console.log(`\n=== Summary ===`)
console.log(`\nReligion:`)
for (const [k, v] of [...byReligion.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(12)} ${v}`)
}
console.log(`\nChristian denomination:`)
for (const [k, v] of [...byChristianDenom.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(24)} ${v}`)
}
console.log(`\nMuslim denomination:`)
for (const [k, v] of [...byMuslimDenom.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(24)} ${v}`)
}
console.log(`\nConfidence:`)
for (const [k, v] of [...byConfidence.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(28)} ${v}`)
}
console.log(`\nUnjoined to AC (outside Kerala boundary): ${unjoined}`)
