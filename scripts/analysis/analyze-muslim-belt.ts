/**
 * Muslim-belt analysis — Wayanad + Malappuram (19 ACs).
 *
 * Produces:
 *   - Premium history (UDF at ≥70% Muslim vs UDF statewide, by cycle)
 *   - Per-AC UDF candidate / party / strategy / ΔUDF / won
 *   - Strategy bucket means (Muslim Alliance / INC-Muslim / INC-Hindu / Special)
 *
 * Source for the markdown at docs/narratives/muslim-belt-deep-dive.md.
 *
 * Run: bun run scripts/analysis/analyze-muslim-belt.ts
 */
import * as fs from "fs"
import * as path from "path"

type Cand = {
  name: string
  party: string
  alliance?: string
  votes: number
  status?: string
  isNota?: boolean
}
type C2026 = {
  constituencyNumber: number
  constituencyName: string
  candidates: Cand[]
}
type HistElection = { year: number; type?: string; candidates: Cand[] }
type Hist = {
  constituencyNumber: number
  constituencyName: string
  elections: HistElection[]
}

const data2026: C2026[] = JSON.parse(
  fs.readFileSync("data/results-2026.json", "utf8")
)
const histByNum = new Map<number, Hist>()
for (const f of fs.readdirSync("data/historical")) {
  if (!f.startsWith("S11-")) continue
  const h: Hist = JSON.parse(
    fs.readFileSync(path.join("data/historical", f), "utf8")
  )
  histByNum.set(h.constituencyNumber, h)
}
const acDemo = JSON.parse(
  fs.readFileSync("data/ac-religion-2025.json", "utf8")
).constituencies as Record<
  string,
  { religions: { hindu: number; muslim: number; christian: number } }
>
const districts = JSON.parse(
  fs.readFileSync("data/districts.json", "utf8")
).constituencyToDistrict as Record<string, string>
const reservations = JSON.parse(
  fs.readFileSync("data/reservations.json", "utf8")
).constituencyToReservation as Record<string, "SC" | "ST">
const partyToAlliance = JSON.parse(
  fs.readFileSync("data/alliances.json", "utf8")
).partyToAlliance as Record<string, string>

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

const MUSLIM_DISTRICTS = new Set(["wayanad", "malappuram"])

// Per-AC table
console.log("=".repeat(72))
console.log("Per-AC table (Wayanad + Malappuram)")
console.log("=".repeat(72))
console.log(
  "AC  Name              District   H/C/M  Res  UDF Cand                      Party     ΔUDF  Won?"
)

const rows: {
  ac: number
  name: string
  district: string
  h: number
  c: number
  m: number
  res: string
  udfCand: string
  udfParty: string
  udfDelta: number
  won: boolean
  ldfPartyTop: string
}[] = []
for (const c of data2026) {
  const ac = c.constituencyNumber
  const district = districts[String(ac)]
  if (!MUSLIM_DISTRICTS.has(district)) continue
  const dem = acDemo[String(ac)]
  const h = histByNum.get(ac)
  const e21 = h?.elections.find((e) => e.year === 2021 && e.type === "general")
  if (!dem || !e21) continue

  const sorted = [...c.candidates]
    .filter((x) => !x.isNota)
    .sort((a, b) => b.votes - a.votes)
  const udf = sorted.find(
    (x) => (x.alliance ?? partyToAlliance[x.party] ?? "OTHER") === "UDF"
  )
  const ldf = sorted.find(
    (x) => (x.alliance ?? partyToAlliance[x.party] ?? "OTHER") === "LDF"
  )
  const winner = c.candidates.find((x) => x.status === "won")
  const winAlli =
    partyToAlliance[winner?.party ?? ""] ?? winner?.alliance ?? "?"

  const udf26 = shareForAlliance(c.candidates, "UDF")
  const udf21 = shareForAlliance(e21.candidates, "UDF")

  rows.push({
    ac,
    name: c.constituencyName,
    district,
    h: dem.religions.hindu,
    c: dem.religions.christian,
    m: dem.religions.muslim,
    res: reservations[String(ac)] ?? "—",
    udfCand: udf?.name ?? "(no UDF)",
    udfParty: udf?.party ?? "—",
    udfDelta: udf26 - udf21,
    won: winAlli === "UDF",
    ldfPartyTop: ldf?.party ?? "—",
  })
}

rows.sort((a, b) => b.m - a.m)
for (const r of rows) {
  console.log(
    `${String(r.ac).padStart(3)} ${r.name.padEnd(17)} ${r.district.padEnd(10)} ${r.h.toFixed(0)}/${r.c.toFixed(0)}/${r.m.toFixed(0)}  ${r.res.padEnd(3)}  ${r.udfCand.padEnd(28)} ${r.udfParty.slice(0, 30).padEnd(30)} ${r.udfDelta.toFixed(1).padStart(5)}  ${r.won ? "won" : "lost"}`
  )
}
console.log(`\nTotal: ${rows.length} ACs (Wayanad ${rows.filter((r) => r.district === "wayanad").length}, Malappuram ${rows.filter((r) => r.district === "malappuram").length})`)

// Premium history
console.log("\n" + "=".repeat(72))
console.log("Premium history — UDF at ≥70% Muslim − UDF statewide")
console.log("=".repeat(72))

function udfYear(ac: number, year: number): number | null {
  const h = histByNum.get(ac)
  const e = h?.elections.find((x) => x.year === year && x.type === "general")
  return e ? shareForAlliance(e.candidates, "UDF") : null
}

const allACs: number[] = data2026.map((c) => c.constituencyNumber)
const highMuslim = allACs.filter(
  (ac) => (acDemo[String(ac)]?.religions.muslim ?? 0) >= 70
)
console.log(
  `\nUniverse: ${highMuslim.length} ACs at ≥70% Muslim, ${allACs.length} statewide.`
)

console.log("\n| Year | UDF ≥70% Mus | UDF statewide | Premium |")
console.log("|---|---|---|---|")
for (const yr of [2011, 2016, 2021]) {
  const high = highMuslim
    .map((ac) => udfYear(ac, yr))
    .filter((v): v is number => v != null)
  const all = allACs
    .map((ac) => udfYear(ac, yr))
    .filter((v): v is number => v != null)
  const meanHigh = high.reduce((a, b) => a + b, 0) / high.length
  const meanAll = all.reduce((a, b) => a + b, 0) / all.length
  console.log(
    `| ${yr} | ${meanHigh.toFixed(1)}% | ${meanAll.toFixed(1)}% | +${(meanHigh - meanAll).toFixed(1)}pp |`
  )
}
{
  const high = highMuslim.map((ac) =>
    shareForAlliance(
      data2026.find((c) => c.constituencyNumber === ac)!.candidates,
      "UDF"
    )
  )
  const all = data2026.map((c) => shareForAlliance(c.candidates, "UDF"))
  const meanHigh = high.reduce((a, b) => a + b, 0) / high.length
  const meanAll = all.reduce((a, b) => a + b, 0) / all.length
  console.log(
    `| **2026** | **${meanHigh.toFixed(1)}%** | **${meanAll.toFixed(1)}%** | **+${(meanHigh - meanAll).toFixed(1)}pp** |`
  )
}

// Strategy classification (best inference from party + name)
console.log("\n" + "=".repeat(72))
console.log("Strategy classification (best inference)")
console.log("=".repeat(72))

function inferReligion(name: string): "Muslim" | "Hindu" | "Christian" | "?" {
  const upper = name.toUpperCase()
  // Muslim markers
  if (
    /\b(MOHAMMED|MUHAMMED|ABDUL|ABDULLA|ABOOBAKKER|ALI|RAFEEK|RAUF|AHMED|HASSAN|AYUB|MUSTAFA|SAYYID|SHAFI|SADIQ|SALIM|FAROOK|RIYAS|RAFI|JAMAL|UMMAR|MUHSIN|HUSAIN|HUSSAIN|NIZAMUDHEEN|HARIS|BASHEER|BAKR|MAULAVI|HAJI|GAFOOR|ABBAS|REHMAN|RAHMAN|HAMEED|MAJEED|SHAFEEQUE|FAYAZ|ANWAR|ASHRAF|NIYAS|NAZAR|ANSARI|JABBAR|RIZWAN|YUSUF|IBRAHIM|ISMAIL|ASLAM|JAFAR|JAFFER)\b/.test(
      upper
    )
  )
    return "Muslim"
  // Christian markers
  if (
    /\b(JOSEPH|GEORGE|VARGHESE|MAMMEN|THOMAS|JACOB|MATHEW|MATHAI|CHACKO|CHERIYAN|JOHN|PAUL|XAVIER|TONY|UMA|ROY|PAULOSE|CYRIAC|ANTONY|OOMMEN|CHANDY|REJI|KAPPEN|PIUS|JOMI|VINCENT|FRANCIS|THANKACHEN|SEBASTIAN)\b/.test(
      upper
    )
  )
    return "Christian"
  return "Hindu"
}

console.log(
  "\nAC  Name              UDF Party                       Cand                 Religion  → Strategy"
)
const strategyByAc = new Map<number, string>()
for (const r of rows) {
  let strategy = "Special"
  const isIUML = r.udfParty === "Indian Union Muslim League"
  const isINC = r.udfParty === "Indian National Congress"
  const isOtherUdfAlly =
    r.udfParty === "Revolutionary Socialist Party" ||
    r.udfParty === "Kerala Congress" ||
    r.udfParty === "Kerala Congress (Jacob)"
  const inferred = inferReligion(r.udfCand)
  if (isIUML) strategy = "Muslim Alliance"
  else if (isINC) {
    if (inferred === "Muslim") strategy = "INC-Muslim"
    else if (inferred === "Hindu") strategy = "INC-Hindu"
    else if (inferred === "Christian") strategy = "INC-Christian"
    else strategy = "INC-?"
  } else if (isOtherUdfAlly) strategy = "Special (other UDF ally)"
  strategyByAc.set(r.ac, strategy)
  console.log(
    `${String(r.ac).padStart(3)} ${r.name.padEnd(17)} ${r.udfParty.slice(0, 30).padEnd(30)} ${r.udfCand.slice(0, 22).padEnd(22)} ${inferred.padEnd(8)} → ${strategy}`
  )
}

// Strategy bucket means
console.log("\n" + "=".repeat(72))
console.log("Strategy bucket means (Wayanad + Malappuram)")
console.log("=".repeat(72))

const buckets = new Map<string, typeof rows>()
for (const r of rows) {
  const s = strategyByAc.get(r.ac)!
  if (!buckets.has(s)) buckets.set(s, [])
  buckets.get(s)!.push(r)
}
console.log("\n| Strategy | n | Won | Mean ΔUDF |")
console.log("|---|---|---|---|")
for (const [strategy, subset] of buckets) {
  const won = subset.filter((r) => r.won).length
  const meanDelta =
    subset.reduce((a, r) => a + r.udfDelta, 0) / subset.length
  console.log(
    `| ${strategy} | ${subset.length} | ${won} | ${meanDelta >= 0 ? "+" : ""}${meanDelta.toFixed(1)}pp |`
  )
}

// LDF strategy at these ACs (for context)
console.log("\n" + "=".repeat(72))
console.log("LDF top candidate / party at each AC (context)")
console.log("=".repeat(72))
for (const r of rows) {
  console.log(`${String(r.ac).padStart(3)} ${r.name.padEnd(17)} LDF: ${r.ldfPartyTop}`)
}
