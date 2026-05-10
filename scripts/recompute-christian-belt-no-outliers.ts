/**
 * Recompute §4 means for the Christian-belt deep-dive with personal-vote
 * outliers removed:
 *
 *   - AC 93  Pala       (Mani C. Kappan independent, three-way personal vote)
 *   - AC 101 Poonjar    (P.C. George personal vote moved KJ(S) → BJP)
 *   - AC 78  Paravur    (V.D. Satheesan home seat — only neg ΔUDF in 4c)
 *   - AC 88  Devikulam  (ST reserved — different dynamics)
 *   - AC 92  Peerumade  (SC reserved — different dynamics)
 *   - AC 111 Thiruvalla (3-way fragmentation; KEC seat)
 *
 * Also:
 *   - Same numbers WITH outliers (sanity check vs deep-dive doc)
 *   - Ceiling-adjusted view: ΔUDF / (100 − UDF2021) — Δ as a fraction of
 *     the headroom available — to control for the "KEC seats started higher"
 *     alternative explanation.
 *
 * Run: bun run scripts/recompute-christian-belt-no-outliers.ts
 */
import * as fs from "fs"
import * as path from "path"

const DROP = new Set([93, 101, 78, 88, 92, 111])

const data2026 = JSON.parse(fs.readFileSync("data/kerala-2026.json", "utf8"))
const partyToAlliance = JSON.parse(
  fs.readFileSync("data/alliances.json", "utf8")
).partyToAlliance as Record<string, string>
const districts = JSON.parse(fs.readFileSync("data/districts.json", "utf8"))
  .constituencyToDistrict as Record<string, string>
const acDemo = JSON.parse(
  fs.readFileSync("data/ac-demographics-2025.json", "utf8")
).constituencies as Record<string, { religions: Record<string, number> }>

const histByNum = new Map<number, any>()
for (const f of fs.readdirSync("data/historical")) {
  if (!f.startsWith("S11-")) continue
  const h = JSON.parse(
    fs.readFileSync(path.join("data/historical", f), "utf8")
  )
  histByNum.set(h.constituencyNumber, h)
}

const CHRISTIAN_PARTIES_UDF = ["Kerala Congress", "Kerala Congress (Jacob)"]
const CHRISTIAN_PARTIES_LDF = ["Kerala Congress (M)", "Kerala Congress (B)"]
const CENTRAL_5 = new Set([
  "idukki",
  "ernakulam",
  "kottayam",
  "wayanad",
  "malappuram",
])

function shareForAlliance(cands: any[], alliance: string): number {
  let v = 0,
    t = 0
  for (const c of cands) {
    if (c.isNota) continue
    t += c.votes
    const a = c.alliance ?? partyToAlliance[c.party] ?? "OTHER"
    if (a === alliance) v += c.votes
  }
  return t > 0 ? (v / t) * 100 : 0
}

type Row = {
  ac: number
  name: string
  district: string
  chrisPct: number
  muslimPct: number
  central5: boolean
  udf21: number
  udf26: number
  udfDelta: number
  ldfDelta: number
  ndaDelta: number
  kecContested26: boolean
  kemContested26: boolean
  isOutlier: boolean
}

const rows: Row[] = []
for (const c of data2026 as any[]) {
  const ac = c.constituencyNumber
  const h = histByNum.get(ac)
  const e21 = h?.elections.find(
    (e: any) => e.year === 2021 && e.type === "general"
  )
  if (!e21) continue
  const dem = acDemo[String(ac)]
  if (!dem) continue
  const u21 = shareForAlliance(e21.candidates, "UDF")
  const u26 = shareForAlliance(c.candidates, "UDF")
  rows.push({
    ac,
    name: c.constituencyName,
    district: districts[String(ac)] ?? "?",
    chrisPct: dem.religions.christian ?? 0,
    muslimPct: dem.religions.muslim ?? 0,
    central5: CENTRAL_5.has(districts[String(ac)] ?? ""),
    udf21: u21,
    udf26: u26,
    udfDelta: u26 - u21,
    ldfDelta:
      shareForAlliance(c.candidates, "LDF") -
      shareForAlliance(e21.candidates, "LDF"),
    ndaDelta:
      shareForAlliance(c.candidates, "NDA") -
      shareForAlliance(e21.candidates, "NDA"),
    kecContested26: c.candidates.some((x: any) =>
      CHRISTIAN_PARTIES_UDF.includes(x.party)
    ),
    kemContested26: c.candidates.some((x: any) =>
      CHRISTIAN_PARTIES_LDF.includes(x.party)
    ),
    isOutlier: DROP.has(ac),
  })
}

function pp(x: number): string {
  return (x >= 0 ? "+" : "") + x.toFixed(2) + "pp"
}

function describe(label: string, subset: Row[]): void {
  if (subset.length === 0) {
    console.log(`  ${label}: (empty)`)
    return
  }
  const meanU = subset.reduce((a, r) => a + r.udfDelta, 0) / subset.length
  const meanU21 =
    subset.reduce((a, r) => a + r.udf21, 0) / subset.length
  const meanCeilingAdj =
    subset.reduce(
      (a, r) => (r.udf21 < 100 ? a + r.udfDelta / (100 - r.udf21) : a),
      0
    ) / subset.length
  const meanChr =
    subset.reduce((a, r) => a + r.chrisPct, 0) / subset.length
  console.log(
    `  ${label.padEnd(54)} n=${subset.length.toString().padStart(2)}  ΔUDF ${pp(meanU).padStart(8)}  UDF21 ${meanU21.toFixed(1).padStart(5)}%  Δ/headroom ${(meanCeilingAdj * 100).toFixed(2).padStart(5)}%  meanChr ${meanChr.toFixed(1).padStart(5)}%`
  )
}

const c5 = rows.filter((r) => r.central5)

const subsetA = c5.filter((r) => r.kecContested26)
const subsetB = c5.filter((r) => r.kemContested26 && !r.kecContested26)
const subsetC = c5.filter(
  (r) => r.chrisPct >= 30 && !r.kecContested26 && !r.kemContested26
)
const subsetMuslim = c5.filter((r) => r.muslimPct >= 50)

console.log("=== §4 means — INCLUDING outliers (sanity check vs doc) ===\n")
describe("4a. KEC/KC-Jacob (UDF Christian-alliance)", subsetA)
describe("4b. LDF-Christian-only (KC(M)/KC(B), no UDF Christian)", subsetB)
describe("4c. High-Christian (≥30%) — no Christian party", subsetC)
describe("Muslim-heavy (≥50%) — for reference", subsetMuslim)

console.log("\n=== §4 means — EXCLUDING outliers ===")
console.log(
  `(Dropped: AC 93 Pala, AC 101 Poonjar, AC 78 Paravur, AC 88 Devikulam, AC 92 Peerumade, AC 111 Thiruvalla)\n`
)
const ka = subsetA.filter((r) => !r.isOutlier)
const kb = subsetB.filter((r) => !r.isOutlier)
const kc = subsetC.filter((r) => !r.isOutlier)
describe("4a. KEC/KC-Jacob (UDF Christian-alliance)", ka)
describe("4b. LDF-Christian-only (KC(M)/KC(B), no UDF Christian)", kb)
describe("4c. High-Christian (≥30%) — no Christian party", kc)

console.log("\n=== Bin-sliced ΔUDF — INCLUDING outliers ===\n")
const bins = [
  { label: "<5%", lo: 0, hi: 5 },
  { label: "5-15%", lo: 5, hi: 15 },
  { label: "15-30%", lo: 15, hi: 30 },
  { label: "30-40%", lo: 30, hi: 40 },
  { label: "≥40%", lo: 40, hi: 101 },
]
for (const b of bins) {
  const xs = rows.filter((r) => r.chrisPct >= b.lo && r.chrisPct < b.hi)
  if (xs.length === 0) continue
  const wParty = xs.filter((r) => r.kecContested26 || r.kemContested26)
  const noParty = xs.filter((r) => !r.kecContested26 && !r.kemContested26)
  const m = (a: Row[]) =>
    a.length === 0
      ? "n/a"
      : `${pp(a.reduce((s, r) => s + r.udfDelta, 0) / a.length)}`
  console.log(
    `  bin ${b.label.padEnd(6)} all n=${xs.length.toString().padStart(3)} ΔUDF ${m(xs).padStart(8)}    party n=${wParty.length.toString().padStart(2)} ΔUDF ${m(wParty).padStart(8)}    no-party n=${noParty.length.toString().padStart(2)} ΔUDF ${m(noParty).padStart(8)}`
  )
}

console.log("\n=== Bin-sliced ΔUDF — EXCLUDING outliers ===\n")
for (const b of bins) {
  const xs = rows.filter(
    (r) => !r.isOutlier && r.chrisPct >= b.lo && r.chrisPct < b.hi
  )
  if (xs.length === 0) continue
  const wParty = xs.filter((r) => r.kecContested26 || r.kemContested26)
  const noParty = xs.filter((r) => !r.kecContested26 && !r.kemContested26)
  const m = (a: Row[]) =>
    a.length === 0
      ? "n/a"
      : `${pp(a.reduce((s, r) => s + r.udfDelta, 0) / a.length)}`
  console.log(
    `  bin ${b.label.padEnd(6)} all n=${xs.length.toString().padStart(3)} ΔUDF ${m(xs).padStart(8)}    party n=${wParty.length.toString().padStart(2)} ΔUDF ${m(wParty).padStart(8)}    no-party n=${noParty.length.toString().padStart(2)} ΔUDF ${m(noParty).padStart(8)}`
  )
}

console.log("\n=== Christian premium re-stated — EXCLUDING outliers ===\n")
function udfYear(ac: number, year: number): number | null {
  const h = histByNum.get(ac)
  const e = h?.elections.find(
    (x: any) => x.year === year && x.type === "general"
  )
  if (!e) return null
  return shareForAlliance(e.candidates, "UDF")
}
for (const yr of [2011, 2016, 2021, 2026]) {
  const high = rows.filter((r) => !r.isOutlier && r.chrisPct >= 40)
  const all = rows.filter((r) => !r.isOutlier)
  const valHigh =
    yr === 2026
      ? high.reduce((a, r) => a + r.udf26, 0) / high.length
      : high
          .map((r) => udfYear(r.ac, yr))
          .filter((v): v is number => v != null)
          .reduce((a, b, _, arr) => a + b / arr.length, 0)
  const valAll =
    yr === 2026
      ? all.reduce((a, r) => a + r.udf26, 0) / all.length
      : all
          .map((r) => udfYear(r.ac, yr))
          .filter((v): v is number => v != null)
          .reduce((a, b, _, arr) => a + b / arr.length, 0)
  console.log(
    `  ${yr}  UDF at ≥40% chr ${valHigh.toFixed(1)}%   UDF statewide ${valAll.toFixed(1)}%   premium ${pp(valHigh - valAll)}`
  )
}
