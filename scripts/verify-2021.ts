import * as fs from "fs"
import * as path from "path"

const dir = "data/historical"
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f.startsWith("S11-"))

let total2021 = 0
const a2021: Record<string, number> = { UDF: 0, LDF: 0, NDA: 0, OTHER: 0, NOTA: 0 }
const partyTotals2021: Record<string, number> = {}

for (const f of files) {
  const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))
  const e = (j.elections || []).find(
    (e: { year: number; type: string }) => e.year === 2021 && e.type === "general"
  )
  if (!e) continue
  for (const c of e.candidates || []) {
    total2021 += c.votes
    a2021[c.alliance] += c.votes
    partyTotals2021[c.party] = (partyTotals2021[c.party] || 0) + c.votes
  }
}

const data2026 = JSON.parse(fs.readFileSync("data/kerala-2026.json", "utf8"))
let total2026 = 0
const a2026: Record<string, number> = { UDF: 0, LDF: 0, NDA: 0, OTHER: 0, NOTA: 0 }
for (const c of data2026.constituencies || data2026) {
  for (const cand of c.candidates || []) {
    total2026 += cand.votes
    a2026[cand.alliance] += cand.votes
  }
}

console.log("=== 2021 alliance totals (after merge) ===")
console.log("Alliance | Ours       | Wikipedia  | Gap")
console.log("---------|------------|------------|--------")
const wiki: Record<string, number> = { UDF: 39.47, LDF: 45.43, NDA: 12.41 }
for (const code of ["UDF", "LDF", "NDA"]) {
  const ourPct = (a2021[code] / total2021) * 100
  const gap = ourPct - wiki[code]
  console.log(
    `${code.padEnd(8)} | ${ourPct.toFixed(2).padStart(6)}%    | ${wiki[code].toFixed(2)}%     | ${gap >= 0 ? "+" : ""}${gap.toFixed(2)}pp`
  )
}
console.log("")
console.log("=== Total 2021 votes ===")
console.log(`  Ours: ${total2021.toLocaleString()}`)
console.log(`  Wikipedia/ECI: 20,833,888`)
console.log(`  Gap: ${(total2021 - 20833888).toLocaleString()}`)
console.log("")
console.log("=== Delta vote share '21 to '26 ===")
const wikiDelta: Record<string, number> = { UDF: 7.07, LDF: -7.79, NDA: 1.79 }
for (const code of ["UDF", "LDF", "NDA"]) {
  const our2021 = (a2021[code] / total2021) * 100
  const our2026 = (a2026[code] / total2026) * 100
  const ourDelta = our2026 - our2021
  const gap = ourDelta - wikiDelta[code]
  console.log(
    `  ${code} delta: ${ourDelta >= 0 ? "+" : ""}${ourDelta.toFixed(2)}pp (Wikipedia ${wikiDelta[code] >= 0 ? "+" : ""}${wikiDelta[code]}pp, gap ${gap >= 0 ? "+" : ""}${gap.toFixed(2)}pp)`
  )
}
console.log("")
console.log("=== Major-party 2021 votes vs Wikipedia ===")
const wikiParty: Record<string, number> = {
  "Indian National Congress": 5233429,
  "Communist Party of India (Marxist)": 5288507,
  "Bharatiya Janata Party": 2354468,
  "Indian Union Muslim League": 1723593,
  "Communist Party of India": 1579235,
  "Kerala Congress (M)": 684363,
  "Kerala Congress": 554115,
  "Janata Dal (Secular)": 265789,
  "Revolutionary Socialist Party": 244388,
  "Bharath Dharma Jana Sena": 217445,
  "None of the Above": 97693,
  "Loktantrik Janata Dal": 193010,
  "Indian National League": 138587,
  "Kerala Congress (Jacob)": 85056,
  "Revolutionary Marxist Party of India": 65093,
  "Congress (Secular)": 60313,
  "Nationalist Congress Party - Sharadchandra Pawar": 206130,
}
for (const [name, wikiVotes] of Object.entries(wikiParty)) {
  const our = partyTotals2021[name] || 0
  const diff = our - wikiVotes
  const status = diff === 0 ? "match" : `${diff > 0 ? "+" : ""}${diff}`
  console.log(`  ${name}: ${our.toLocaleString()} (${status})`)
}
