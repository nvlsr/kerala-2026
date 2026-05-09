/**
 * Audits our 2021 statewide totals against Wikipedia's reported
 * vote counts and shares for the major LDF parties. Helps diagnose
 * which dataset is the source of CPI(M)/CPI Δ '21 discrepancies.
 *
 * Wikipedia 2026 page reports 2026 deltas relative to 2021. Implied
 * Wikipedia 2021 share = 2026 share + delta.
 */
import * as fs from "fs"
import * as path from "path"

const histDir = "data/historical"
const histFiles = fs.readdirSync(histDir).filter((f) => f.startsWith("S11-"))

type Cand = {
  name: string
  party: string
  votes: number
  alliance?: string
  isNota?: boolean
}
type Election = {
  year: number
  candidates: Cand[]
  totalValidVotesPolled?: number
}
type Hist = {
  constituencyName: string
  constituencyNumber: number
  elections: Election[]
}

const hist: Hist[] = histFiles.map((f) =>
  JSON.parse(fs.readFileSync(path.join(histDir, f), "utf8"))
)

console.log(`Loaded ${hist.length} historical files\n`)

// 2021 statewide
let totalValid2021 = 0
const tally2021: Record<
  string,
  { votes: number; cands: number; seats: number[] }
> = {}
const winnerByParty2021: Record<string, number> = {}

for (const h of hist) {
  const e = h.elections.find((x) => x.year === 2021)
  if (!e) continue
  let constValid = 0
  let topVotes = -1
  let topParty = ""
  for (const c of e.candidates) {
    if (c.isNota) continue
    constValid += c.votes
    if (!tally2021[c.party])
      tally2021[c.party] = { votes: 0, cands: 0, seats: [] }
    tally2021[c.party].votes += c.votes
    tally2021[c.party].cands++
    tally2021[c.party].seats.push(h.constituencyNumber)
    if (c.votes > topVotes) {
      topVotes = c.votes
      topParty = c.party
    }
  }
  totalValid2021 += constValid
  winnerByParty2021[topParty] = (winnerByParty2021[topParty] || 0) + 1
}

console.log(`Total valid votes 2021: ${totalValid2021.toLocaleString()}\n`)

// Print interesting LDF parties
const ldfParties = [
  "Communist Party of India (Marxist)",
  "Communist Party of India",
  "Kerala Congress (M)",
  "Independent (LDF)",
  "Independent",
  "Indian National League",
  "Nationalist Congress Party",
  "Nationalist Congress Party - Sharadchandra Pawar",
  "Janata Dal (Secular)",
  "Loktantrik Janata Dal",
  "Congress (Secular)",
  "Indian Socialist Janata Dal",
  "Kerala Congress (B)",
  "Kerala Revolutionary Socialist Party (Leninist- Marxist)",
  "Rashtriya Janata Dal",
]

console.log("=== 2021 statewide totals (our data) ===")
console.log(
  "Party                                          Votes        Share    Cands  Wins"
)
for (const p of ldfParties) {
  const t = tally2021[p]
  if (!t) {
    console.log(`${p.padEnd(46)}  -- not present --`)
    continue
  }
  const share = (t.votes / totalValid2021) * 100
  const wins = winnerByParty2021[p] || 0
  console.log(
    `${p.padEnd(46)}  ${t.votes.toString().padStart(10)}  ${share.toFixed(3).padStart(7)}%  ${t.cands.toString().padStart(5)}  ${wins.toString().padStart(4)}`
  )
}

// Compare with Wikipedia 2026 page's "implied 2021" numbers
console.log("\n=== Wikipedia 2026 page's 2021 figures (LDF) ===")
console.log("(implied from share + delta, or directly listed)")
const wikiImplied: Array<{ party: string; share: number; votes?: number }> = [
  { party: "CPI(M)", share: 25.38 }, // 21.77 + 3.61
  { party: "CPI", share: 7.58 }, // 6.64 + 0.94
  { party: "KC(M)", share: 3.28 }, // 2.60 + 0.68
  { party: "NCP-SP", share: 0.99 }, // 0.68 + 0.31
  { party: "INL", share: 0.66 }, // 0.19 + 0.47
  { party: "Cong(S)", share: 0.29 }, // 0.24 + 0.05
]
for (const w of wikiImplied) {
  console.log(`${w.party.padEnd(10)}  Wikipedia 2021 ≈ ${w.share}%`)
}

// Specific check: CPI(M) candidates count and total
console.log("\n=== CPI(M) and CPI 2021 detailed ===")
const cpim = tally2021["Communist Party of India (Marxist)"]
const cpi = tally2021["Communist Party of India"]
console.log(
  `CPI(M):  ${cpim?.votes.toLocaleString()} votes, ${cpim?.cands} candidates, ${winnerByParty2021["Communist Party of India (Marxist)"] || 0} wins`
)
console.log(
  `CPI:     ${cpi?.votes.toLocaleString()} votes, ${cpi?.cands} candidates, ${winnerByParty2021["Communist Party of India"] || 0} wins`
)
console.log(
  `Combined: ${((cpim?.votes ?? 0) + (cpi?.votes ?? 0)).toLocaleString()} votes`
)

// Wikipedia 2021 reported (based on 2021 page directly):
//   CPI(M): 25.38% with 62 wins (from 85 contested)
//   CPI:    7.58% with 17 wins (from 25 contested)
console.log(`\nWikipedia 2021 (source: 2021 election Wikipedia page):`)
console.log(`  CPI(M): 25.38%, 62 wins, 85 contested`)
console.log(`  CPI:    7.58%, 17 wins, 25 contested`)
