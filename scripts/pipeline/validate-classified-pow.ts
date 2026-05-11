/**
 * Validate the classified place-of-worship output against known religious
 * geography. Spot-checks a handful of ACs whose dominant denomination is
 * well-established and prints religion/denomination breakdown per AC.
 *
 * Usage: bun run scripts/pipeline/validate-classified-pow.ts
 */

type ClassifiedPOI = {
  id: string
  lat: number
  lon: number
  religion: string
  denomination: string | null
  denomination_confidence: string
  name: string | null
  ac_id: number | null
  ac_name: string | null
  district: string | null
  source: string
}

const data = (await Bun.file("data/places-of-worship.json").json()) as ClassifiedPOI[]

// NOTE: validation uses "dominant denomination among that religion's POIs",
// not "religion is overall majority of POI count" — Hindu temples are
// smaller and far more numerous than churches/mosques, so raw POI counts
// overstate Hindu vs the population reality. Religion is asserted only
// where it is genuinely the majority (e.g. Malappuram Muslim core).

const CHECKS: Array<{
  ac: string
  expectedReligion?: string
  expectedDenom?: string
  amongReligion?: string
  note: string
}> = [
  // Christian sub-denomination heartlands
  { ac: "Pala", expectedDenom: "syro_malabar", amongReligion: "christian", note: "Pala = Syro-Malabar archeparchy seat" },
  { ac: "Kanjirappally", expectedDenom: "syro_malabar", amongReligion: "christian", note: "SM Kanjirapally diocese" },
  { ac: "Thiruvalla", expectedDenom: "indian_orthodox", amongReligion: "christian", note: "Tiruvalla AC: Niranam/Parumala Orthodox (Marthoma HQ but Orthodox more numerous)" },
  { ac: "Aranmula", expectedDenom: "marthoma", amongReligion: "christian", note: "Marthoma corridor + Hindu temple" },
  { ac: "Cherthala", expectedDenom: "latin_catholic", amongReligion: "christian", note: "Alleppey coast = Latin (dominant Christian sub-rite, not overall)" },
  { ac: "Alappuzha", expectedDenom: "latin_catholic", amongReligion: "christian", note: "Alleppey coast = Latin (dominant Christian sub-rite, not overall)" },
  { ac: "Kochi", expectedDenom: "latin_catholic", amongReligion: "christian", note: "Verapoly Latin archdiocese" },
  { ac: "Ranni", expectedDenom: "marthoma", amongReligion: "christian", note: "Pathanamthitta Marthoma belt (Ranni-Perunad)" },

  // Muslim heartlands (where Muslim is also majority)
  { ac: "Tirurangadi", expectedReligion: "muslim", expectedDenom: "sunni", amongReligion: "muslim", note: "Malappuram Muslim core" },
  { ac: "Tirur", expectedReligion: "muslim", expectedDenom: "sunni", amongReligion: "muslim", note: "Malappuram Muslim core" },
  { ac: "Malappuram", expectedReligion: "muslim", expectedDenom: "sunni", amongReligion: "muslim", note: "District HQ Muslim core" },
  { ac: "Manjeri", expectedReligion: "muslim", expectedDenom: "sunni", amongReligion: "muslim", note: "Malappuram Muslim core" },

  // Hindu majority validation
  { ac: "Vamanapuram", expectedReligion: "hindu", note: "Interior TVM Hindu-majority" },
  { ac: "Wadakkanchery", expectedReligion: "hindu", note: "Thrissur interior Hindu (geojson spelling)" },

  // Manjeshwar — small POI count, hindu/muslim/christian tightly competitive
  // (Muslim plurality by population but Hindu plurality by POI count).
  { ac: "Manjeshwar", note: "Kasaragod; small POI count, no religion plurality expected" },
]

const acData = new Map<string, ClassifiedPOI[]>()
for (const p of data) {
  if (!p.ac_name) continue
  if (!acData.has(p.ac_name)) acData.set(p.ac_name, [])
  acData.get(p.ac_name)!.push(p)
}

function histogram(items: ClassifiedPOI[], key: "religion" | "denomination"): [string, number][] {
  const m = new Map<string, number>()
  for (const i of items) {
    const v = (i[key] ?? "(none)") + ""
    m.set(v, (m.get(v) ?? 0) + 1)
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

console.log(`=== AC validation ===\n`)
let passCount = 0
let failCount = 0
for (const check of CHECKS) {
  const pois = acData.get(check.ac)
  if (!pois) {
    console.log(`  ⚠️  ${check.ac}: not found in output`)
    failCount++
    continue
  }
  const religionHist = histogram(pois, "religion")
  const topRel = religionHist[0]
  const total = pois.length

  let ok = true
  if (check.expectedReligion) {
    ok = ok && topRel[0] === check.expectedReligion
  }

  let denomLine = ""
  if (check.expectedDenom && check.amongReligion) {
    const relPois = pois.filter(
      (p) => p.religion === check.amongReligion && p.denomination
    )
    const denomHist = histogram(relPois, "denomination")
    const topDenom = denomHist[0]
    ok = ok && topDenom && topDenom[0] === check.expectedDenom
    denomLine = `     top ${check.amongReligion} denom: ${denomHist.slice(0, 3).map(([k, v]) => `${k}=${v}`).join(", ")}`
  }

  const expectedStr = [
    check.expectedReligion ? `religion=${check.expectedReligion}` : null,
    check.expectedDenom ? `${check.amongReligion}_denom=${check.expectedDenom}` : null,
  ]
    .filter(Boolean)
    .join(", ")

  console.log(
    `  ${ok ? "✅" : "❌"} ${check.ac.padEnd(20)} (${total} POIs)  top religion: ${topRel[0]}=${topRel[1]}${ok ? "" : "  — expected: " + expectedStr}`
  )
  if (denomLine) console.log(denomLine)
  console.log(`     ${check.note}`)
  console.log(``)
  if (ok) passCount++
  else failCount++
}

console.log(`Result: ${passCount} passed, ${failCount} failed of ${CHECKS.length} checks\n`)

// Top 5 ACs by religion mix
console.log(`=== Top-3 ACs by Christian POI count ===`)
const acChristianCount = [...acData.entries()]
  .map(([ac, pois]) => [ac, pois.filter((p) => p.religion === "christian").length] as [string, number])
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
for (const [ac, n] of acChristianCount) {
  console.log(`  ${ac.padEnd(24)} ${n}`)
}

console.log(`\n=== Top-10 ACs by Muslim POI count ===`)
const acMuslimCount = [...acData.entries()]
  .map(([ac, pois]) => [ac, pois.filter((p) => p.religion === "muslim").length] as [string, number])
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
for (const [ac, n] of acMuslimCount) {
  console.log(`  ${ac.padEnd(24)} ${n}`)
}
