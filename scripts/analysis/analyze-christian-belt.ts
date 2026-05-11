/**
 * Christian-belt deep dive — produces tables for
 * docs/narratives/christian-belt-deep-dive.md
 *
 * Sections produced:
 *   1. Historical UDF baseline at high-Christian ACs (2011 → 2026)
 *   2. Christian-party seats over time (UDF: KEC, KC-Jacob; LDF: KC(M), KC(B))
 *   3. 2026 swing decomposition at KC(M) seats — defection vs cross-community
 *   4. Central-5 internal heterogeneity — Christian-party vs not, Christian-belt vs Muslim-belt
 *   5. Bin-sliced regression — Δshare by Christian-share bin, with Christian-party-seat flag
 *
 * Run: bun run scripts/analysis/analyze-christian-belt.ts
 */
import * as fs from "fs"
import * as path from "path"
import {
  load2026,
  loadHistorical,
  type Candidate2026 as Cand,
  type Constituency2026 as C2026,
  type HistoricalConstituency as Hist,
} from "../_lib/load"

const data2026: C2026[] = load2026()
const histByNum: Map<number, Hist> = loadHistorical()
const hist: Hist[] = [...histByNum.values()]

const acDemo = JSON.parse(
  fs.readFileSync("data/ac-religion-2025.json", "utf8")
)
const religionByAc = acDemo.constituencies as Record<
  string,
  { religions: Record<string, number>; source: string }
>

const districts = JSON.parse(fs.readFileSync("data/districts.json", "utf8"))
const acToDistrict = districts.constituencyToDistrict as Record<string, string>

const alliancesData = JSON.parse(fs.readFileSync("data/alliances.json", "utf8"))
const partyToAlliance = alliancesData.partyToAlliance as Record<string, string>

const reservations = JSON.parse(
  fs.readFileSync("data/reservations.json", "utf8")
).constituencyToReservation as Record<string, "SC" | "ST">

// --- Constants ---------------------------------------------------------

const CHRISTIAN_PARTIES_UDF = ["Kerala Congress", "Kerala Congress (Jacob)"]
const CHRISTIAN_PARTIES_LDF = ["Kerala Congress (M)", "Kerala Congress (B)"]
const CENTRAL_5 = new Set([
  "idukki",
  "ernakulam",
  "kottayam",
  "wayanad",
  "malappuram",
])

// --- Helpers -----------------------------------------------------------

function shareForAlliance(cands: Cand[], alliance: string): number {
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

function shareForParty(cands: Cand[], partyNames: string[]): number {
  let v = 0,
    t = 0
  for (const c of cands) {
    if (c.isNota) continue
    t += c.votes
    if (partyNames.includes(c.party)) v += c.votes
  }
  return t > 0 ? (v / t) * 100 : 0
}

function chrisShare(ac: number): number {
  return religionByAc[String(ac)]?.religions.christian ?? 0
}
function muslimShare(ac: number): number {
  return religionByAc[String(ac)]?.religions.muslim ?? 0
}
function district(ac: number): string {
  return acToDistrict[String(ac)] ?? "?"
}
function name(ac: number): string {
  const c = data2026.find((d) => d.constituencyNumber === ac)
  return c ? c.constituencyName : "?"
}

function bin(c: number): string {
  if (c < 5) return "<5%"
  if (c < 15) return "5-15%"
  if (c < 30) return "15-30%"
  if (c < 40) return "30-40%"
  return ">=40%"
}

// --- Build per-AC table ------------------------------------------------

type Row = {
  ac: number
  name: string
  district: string
  chrisPct: number
  muslimPct: number
  bin: string
  central5: boolean
  reserved: "SC" | "ST" | null
  udf21: number
  udf26: number
  udfDelta: number
  ldf21: number
  ldf26: number
  ldfDelta: number
  nda21: number
  nda26: number
  ndaDelta: number
  // Christian-party party-share at this AC, current cycle
  kecVote26: number // KEC + KC-Jacob (UDF Christian)
  kemVote26: number // KC(M) + KC(B) (LDF Christian)
  kecVote21: number
  kemVote21: number
  kecContested26: boolean
  kemContested26: boolean
  kecContested21: boolean
  kemContested21: boolean
}

const rows: Row[] = []
for (const c of data2026) {
  const ac = c.constituencyNumber
  const h = histByNum.get(ac)
  const e21 = h?.elections.find((e) => e.year === 2021 && e.type === "general")
  if (!e21) continue
  const cp = chrisShare(ac)
  rows.push({
    ac,
    name: c.constituencyName,
    district: district(ac),
    chrisPct: cp,
    muslimPct: muslimShare(ac),
    bin: bin(cp),
    central5: CENTRAL_5.has(district(ac)),
    reserved: reservations[String(ac)] ?? null,
    udf21: shareForAlliance(e21.candidates, "UDF"),
    udf26: shareForAlliance(c.candidates, "UDF"),
    udfDelta:
      shareForAlliance(c.candidates, "UDF") -
      shareForAlliance(e21.candidates, "UDF"),
    ldf21: shareForAlliance(e21.candidates, "LDF"),
    ldf26: shareForAlliance(c.candidates, "LDF"),
    ldfDelta:
      shareForAlliance(c.candidates, "LDF") -
      shareForAlliance(e21.candidates, "LDF"),
    nda21: shareForAlliance(e21.candidates, "NDA"),
    nda26: shareForAlliance(c.candidates, "NDA"),
    ndaDelta:
      shareForAlliance(c.candidates, "NDA") -
      shareForAlliance(e21.candidates, "NDA"),
    kecVote26: shareForParty(c.candidates, CHRISTIAN_PARTIES_UDF),
    kemVote26: shareForParty(c.candidates, CHRISTIAN_PARTIES_LDF),
    kecVote21: shareForParty(e21.candidates, CHRISTIAN_PARTIES_UDF),
    kemVote21: shareForParty(e21.candidates, CHRISTIAN_PARTIES_LDF),
    kecContested26: c.candidates.some((x) =>
      CHRISTIAN_PARTIES_UDF.includes(x.party)
    ),
    kemContested26: c.candidates.some((x) =>
      CHRISTIAN_PARTIES_LDF.includes(x.party)
    ),
    kecContested21: e21.candidates.some((x) =>
      CHRISTIAN_PARTIES_UDF.includes(x.party)
    ),
    kemContested21: e21.candidates.some((x) =>
      CHRISTIAN_PARTIES_LDF.includes(x.party)
    ),
  })
}

console.log(`Loaded ${rows.length}/140 ACs.\n`)

// --- Section 1: Historical UDF at high-Christian ACs -------------------

console.log("=".repeat(60))
console.log("SECTION 1 — Historical UDF baseline at high-Christian ACs")
console.log("=".repeat(60))

function udfShareYear(ac: number, year: number): number | null {
  const h = histByNum.get(ac)
  const e = h?.elections.find((x) => x.year === year && x.type === "general")
  if (!e) return null
  return shareForAlliance(e.candidates, "UDF")
}

const yearsHist = [2011, 2016, 2021]
for (const yr of yearsHist) {
  const valsByBin: Record<string, number[]> = {
    "<5%": [],
    "5-15%": [],
    "15-30%": [],
    "30-40%": [],
    ">=40%": [],
  }
  for (const r of rows) {
    const v = udfShareYear(r.ac, yr)
    if (v != null) valsByBin[r.bin].push(v)
  }
  console.log(`\n${yr} UDF vote share by Christian-share bin (mean):`)
  for (const b of Object.keys(valsByBin)) {
    const xs = valsByBin[b]
    if (xs.length === 0) continue
    const mean = xs.reduce((a, b) => a + b, 0) / xs.length
    console.log(`  ${b.padEnd(8)}  n=${xs.length.toString().padStart(3)}  UDF mean ${mean.toFixed(1)}%`)
  }
}
{
  const valsByBin: Record<string, number[]> = {
    "<5%": [],
    "5-15%": [],
    "15-30%": [],
    "30-40%": [],
    ">=40%": [],
  }
  for (const r of rows) valsByBin[r.bin].push(r.udf26)
  console.log(`\n2026 UDF vote share by Christian-share bin (mean):`)
  for (const b of Object.keys(valsByBin)) {
    const xs = valsByBin[b]
    if (xs.length === 0) continue
    const mean = xs.reduce((a, b) => a + b, 0) / xs.length
    console.log(`  ${b.padEnd(8)}  n=${xs.length.toString().padStart(3)}  UDF mean ${mean.toFixed(1)}%`)
  }
}

// Statewide UDF for reference
console.log(`\nStatewide UDF (vote-weighted equivalent — constituency-mean here):`)
for (const yr of [2011, 2016, 2021]) {
  const xs = rows
    .map((r) => udfShareYear(r.ac, yr))
    .filter((v): v is number => v != null)
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length
  console.log(`  ${yr}  ${mean.toFixed(1)}%  (n=${xs.length})`)
}
{
  const xs = rows.map((r) => r.udf26)
  console.log(
    `  2026  ${(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1)}%  (n=${xs.length})`
  )
}

// --- Section 2: Christian-party seats over time -----------------------

console.log("\n" + "=".repeat(60))
console.log("SECTION 2 — Christian-party seats")
console.log("=".repeat(60))

console.log("\n2026: UDF Christian-party seats (KEC + KC-Jacob)")
console.log("ac  district          name              chr%  partyVote%  allianceVote%  Δalliance  status")
for (const r of rows.filter((r) => r.kecContested26).sort((a, b) => a.ac - b.ac)) {
  const c2026 = data2026.find((x) => x.constituencyNumber === r.ac)
  const cand = c2026?.candidates.find((x) =>
    CHRISTIAN_PARTIES_UDF.includes(x.party)
  )
  console.log(
    `${r.ac.toString().padStart(3)} ${r.district.padEnd(16)} ${r.name.padEnd(18)} ${r.chrisPct.toFixed(1).padStart(5)} ${r.kecVote26.toFixed(1).padStart(8)} ${r.udf26.toFixed(1).padStart(13)} ${r.udfDelta.toFixed(1).padStart(9)} ${cand?.status ?? "?"}`
  )
}

console.log("\n2026: LDF Christian-party seats (KC(M) + KC(B))")
console.log("ac  district          name              chr%  partyVote%  allianceVote%  Δalliance  status")
for (const r of rows.filter((r) => r.kemContested26).sort((a, b) => a.ac - b.ac)) {
  const c2026 = data2026.find((x) => x.constituencyNumber === r.ac)
  const cand = c2026?.candidates.find((x) =>
    CHRISTIAN_PARTIES_LDF.includes(x.party)
  )
  console.log(
    `${r.ac.toString().padStart(3)} ${r.district.padEnd(16)} ${r.name.padEnd(18)} ${r.chrisPct.toFixed(1).padStart(5)} ${r.kemVote26.toFixed(1).padStart(8)} ${r.ldf26.toFixed(1).padStart(13)} ${r.ldfDelta.toFixed(1).padStart(9)} ${cand?.status ?? "?"}`
  )
}

// 2021 picture for the same seats
console.log("\n2021: KEC/KC-Jacob votes at the seats they contested in 2026")
for (const r of rows.filter((r) => r.kecContested26).sort((a, b) => a.ac - b.ac)) {
  console.log(
    `${r.ac.toString().padStart(3)} ${r.name.padEnd(18)}  KEC2021=${r.kecVote21.toFixed(1)}%  KEC2026=${r.kecVote26.toFixed(1)}%  Δ=${(r.kecVote26 - r.kecVote21).toFixed(1)}pp`
  )
}

console.log("\n2021: KC(M)/KC(B) votes at the seats they contested in 2026")
for (const r of rows.filter((r) => r.kemContested26).sort((a, b) => a.ac - b.ac)) {
  console.log(
    `${r.ac.toString().padStart(3)} ${r.name.padEnd(18)}  KCM2021=${r.kemVote21.toFixed(1)}%  KCM2026=${r.kemVote26.toFixed(1)}%  Δ=${(r.kemVote26 - r.kemVote21).toFixed(1)}pp`
  )
}

// Head-to-head: where both KEC and KC(M) contested in 2026
console.log("\nHead-to-head ACs (UDF Christian party vs LDF Christian party in 2026):")
for (const r of rows.filter((r) => r.kecContested26 && r.kemContested26)) {
  console.log(
    `  AC ${r.ac} ${r.name} (chr ${r.chrisPct.toFixed(1)}%) — KEC ${r.kecVote26.toFixed(1)}% vs KCM ${r.kemVote26.toFixed(1)}%  ΔUDF ${r.udfDelta.toFixed(1)}  ΔLDF ${r.ldfDelta.toFixed(1)}`
  )
}

// --- Section 3: Decomposition at KC(M) seats --------------------------

console.log("\n" + "=".repeat(60))
console.log("SECTION 3 — KC(M) seat decomposition (where did the votes go?)")
console.log("=".repeat(60))

const kemSeats = rows.filter((r) => r.kemContested26)
console.log("\nAt the 12 KC(M) seats: alliance vote-share movements 2021→2026")
console.log("ac  name              chr%  KCM21 KCM26 ΔKCM  UDF21 UDF26 ΔUDF  LDF21 LDF26 ΔLDF  NDA21 NDA26 ΔNDA")
for (const r of kemSeats.sort((a, b) => b.chrisPct - a.chrisPct)) {
  console.log(
    `${r.ac.toString().padStart(3)} ${r.name.padEnd(18)} ${r.chrisPct.toFixed(1).padStart(4)}  ${r.kemVote21.toFixed(1).padStart(5)} ${r.kemVote26.toFixed(1).padStart(5)} ${(r.kemVote26 - r.kemVote21).toFixed(1).padStart(5)}  ${r.udf21.toFixed(1).padStart(5)} ${r.udf26.toFixed(1).padStart(5)} ${r.udfDelta.toFixed(1).padStart(5)}  ${r.ldf21.toFixed(1).padStart(5)} ${r.ldf26.toFixed(1).padStart(5)} ${r.ldfDelta.toFixed(1).padStart(5)}  ${r.nda21.toFixed(1).padStart(5)} ${r.nda26.toFixed(1).padStart(5)} ${r.ndaDelta.toFixed(1).padStart(5)}`
  )
}
{
  const meanKemDrop =
    kemSeats.reduce((a, r) => a + (r.kemVote26 - r.kemVote21), 0) /
    kemSeats.length
  const meanUdfGain =
    kemSeats.reduce((a, r) => a + r.udfDelta, 0) / kemSeats.length
  const meanLdfDelta =
    kemSeats.reduce((a, r) => a + r.ldfDelta, 0) / kemSeats.length
  const meanNdaDelta =
    kemSeats.reduce((a, r) => a + r.ndaDelta, 0) / kemSeats.length
  console.log(
    `\nMean across 12 KC(M) seats: ΔKCM ${meanKemDrop.toFixed(2)}pp,  ΔUDF ${meanUdfGain.toFixed(2)}pp,  ΔLDF ${meanLdfDelta.toFixed(2)}pp,  ΔNDA ${meanNdaDelta.toFixed(2)}pp`
  )
}

// --- Section 4: Central-5 internal heterogeneity ---------------------

console.log("\n" + "=".repeat(60))
console.log("SECTION 4 — Central-5 internal heterogeneity")
console.log("=".repeat(60))

const c5 = rows.filter((r) => r.central5)
console.log(`\nCentral-5 has ${c5.length} ACs total.`)

const groupings = {
  "UDF Christian-party seat (KEC/KC-Jacob)": c5.filter((r) => r.kecContested26),
  "LDF Christian-party seat only (KC(M)/KC(B), no UDF Christian party)": c5.filter(
    (r) => r.kemContested26 && !r.kecContested26
  ),
  "High-Christian (>=30%) but NO Christian party either side": c5.filter(
    (r) => r.chrisPct >= 30 && !r.kecContested26 && !r.kemContested26
  ),
  "Muslim-heavy (>=50%)": c5.filter((r) => r.muslimPct >= 50),
  "Other Central-5 seats": c5.filter(
    (r) =>
      !r.kecContested26 &&
      !r.kemContested26 &&
      r.chrisPct < 30 &&
      r.muslimPct < 50
  ),
}

for (const [label, subset] of Object.entries(groupings)) {
  if (subset.length === 0) {
    console.log(`\n${label}: (none)`)
    continue
  }
  const meanUdf =
    subset.reduce((a, r) => a + r.udfDelta, 0) / subset.length
  const meanChr =
    subset.reduce((a, r) => a + r.chrisPct, 0) / subset.length
  const meanMus =
    subset.reduce((a, r) => a + r.muslimPct, 0) / subset.length
  console.log(
    `\n${label}: n=${subset.length}, mean ΔUDF ${meanUdf.toFixed(1)}pp, mean chr ${meanChr.toFixed(1)}%, mean mus ${meanMus.toFixed(1)}%`
  )
  for (const r of subset.sort((a, b) => a.ac - b.ac)) {
    console.log(
      `  AC ${r.ac} ${r.name.padEnd(16)} (${r.district.padEnd(12)}) chr ${r.chrisPct.toFixed(1).padStart(5)}%  mus ${r.muslimPct.toFixed(1).padStart(5)}%  ΔUDF ${r.udfDelta.toFixed(1).padStart(5)}pp`
    )
  }
}

// --- Section 5: Bin-sliced regression --------------------------------

console.log("\n" + "=".repeat(60))
console.log("SECTION 5 — Bin-sliced ΔUDF + Christian-party seat flag")
console.log("=".repeat(60))

console.log("\nMean UDF Δshare by Christian-share bin (all 140 ACs):")
const binsOrder = ["<5%", "5-15%", "15-30%", "30-40%", ">=40%"]
for (const b of binsOrder) {
  const xs = rows.filter((r) => r.bin === b)
  if (xs.length === 0) continue
  const mean = xs.reduce((a, r) => a + r.udfDelta, 0) / xs.length
  const meanLdf = xs.reduce((a, r) => a + r.ldfDelta, 0) / xs.length
  const meanNda = xs.reduce((a, r) => a + r.ndaDelta, 0) / xs.length
  console.log(
    `  ${b.padEnd(8)}  n=${xs.length.toString().padStart(3)}  ΔUDF ${mean.toFixed(2).padStart(5)}pp   ΔLDF ${meanLdf.toFixed(2).padStart(5)}pp   ΔNDA ${meanNda.toFixed(2).padStart(5)}pp`
  )
}

console.log("\nMean UDF Δshare — by bin × Christian-party-seat flag:")
for (const b of binsOrder) {
  const xs = rows.filter((r) => r.bin === b)
  if (xs.length === 0) continue
  const withParty = xs.filter((r) => r.kecContested26 || r.kemContested26)
  const withoutParty = xs.filter(
    (r) => !r.kecContested26 && !r.kemContested26
  )
  const m1 =
    withParty.length === 0
      ? null
      : withParty.reduce((a, r) => a + r.udfDelta, 0) / withParty.length
  const m2 =
    withoutParty.length === 0
      ? null
      : withoutParty.reduce((a, r) => a + r.udfDelta, 0) / withoutParty.length
  console.log(
    `  ${b.padEnd(8)}  Christian-party seat: n=${withParty.length} ΔUDF ${
      m1 == null ? "n/a" : m1.toFixed(2) + "pp"
    }    no Christian party: n=${withoutParty.length} ΔUDF ${
      m2 == null ? "n/a" : m2.toFixed(2) + "pp"
    }`
  )
}

console.log("\nKey question: at high-Christian ACs WITHOUT a Christian-party")
console.log("candidate, does the UDF premium still appear?")
{
  const highChrisNoParty = rows.filter(
    (r) => r.chrisPct >= 30 && !r.kecContested26 && !r.kemContested26
  )
  if (highChrisNoParty.length > 0) {
    const meanUdf =
      highChrisNoParty.reduce((a, r) => a + r.udfDelta, 0) /
      highChrisNoParty.length
    const meanChr =
      highChrisNoParty.reduce((a, r) => a + r.chrisPct, 0) /
      highChrisNoParty.length
    console.log(
      `  n=${highChrisNoParty.length}, mean Christian ${meanChr.toFixed(1)}%, mean ΔUDF ${meanUdf.toFixed(2)}pp`
    )
    for (const r of highChrisNoParty.sort((a, b) => b.chrisPct - a.chrisPct)) {
      console.log(
        `    AC ${r.ac} ${r.name.padEnd(18)} (${r.district.padEnd(12)}) chr ${r.chrisPct.toFixed(1)}%  ΔUDF ${r.udfDelta.toFixed(1)}pp`
      )
    }
  }
}

// --- Section 6: Muslim parallel (skeleton) -----------------------------

console.log("\n" + "=".repeat(60))
console.log("SECTION 6 — Muslim parallel")
console.log("=".repeat(60))

function mbin(c: number): string {
  if (c < 10) return "<10%"
  if (c < 25) return "10-25%"
  if (c < 50) return "25-50%"
  if (c < 70) return "50-70%"
  return ">=70%"
}

const mBins = ["<10%", "10-25%", "25-50%", "50-70%", ">=70%"]
console.log("\nUDF Δshare by Muslim-share bin (all 140 ACs):")
for (const b of mBins) {
  const xs = rows.filter((r) => mbin(r.muslimPct) === b)
  if (xs.length === 0) continue
  const meanU = xs.reduce((a, r) => a + r.udfDelta, 0) / xs.length
  const meanL = xs.reduce((a, r) => a + r.ldfDelta, 0) / xs.length
  const meanN = xs.reduce((a, r) => a + r.ndaDelta, 0) / xs.length
  console.log(
    `  ${b.padEnd(8)}  n=${xs.length.toString().padStart(3)}  ΔUDF ${meanU.toFixed(2).padStart(5)}pp   ΔLDF ${meanL.toFixed(2).padStart(5)}pp   ΔNDA ${meanN.toFixed(2).padStart(5)}pp`
  )
}

console.log(`\nUDF historical share by Muslim-share bin:`)
for (const yr of [2011, 2016, 2021]) {
  console.log(`  ${yr}:`)
  for (const b of mBins) {
    const xs = rows.filter((r) => mbin(r.muslimPct) === b)
    const ys = xs
      .map((r) => udfShareYear(r.ac, yr))
      .filter((v): v is number => v != null)
    if (ys.length === 0) continue
    const m = ys.reduce((a, b) => a + b, 0) / ys.length
    console.log(`    ${b.padEnd(8)}  n=${ys.length.toString().padStart(3)}  UDF ${m.toFixed(1)}%`)
  }
}

console.log(`\n  2026:`)
for (const b of mBins) {
  const xs = rows.filter((r) => mbin(r.muslimPct) === b)
  if (xs.length === 0) continue
  const m = xs.reduce((a, r) => a + r.udf26, 0) / xs.length
  console.log(`    ${b.padEnd(8)}  n=${xs.length.toString().padStart(3)}  UDF ${m.toFixed(1)}%`)
}

console.log("\nDone.")
