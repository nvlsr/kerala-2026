/**
 * Lists every CPI(M) candidate in our 2021 data and the seat-rank
 * of each. Helps identify the 1 CPI(M) candidate who's NOT in
 * Wikipedia's top-2 view (the by-constituency listing only shows
 * winner + runner-up, so a CPI(M) candidate who finished 3rd or
 * lower won't be visible there even though they exist).
 *
 * Also surfaces any candidate Wikipedia labels CPI(M) but our scrape
 * tagged differently (the documented Aluva/Shelna Nishad case).
 */
import * as fs from "fs"
import * as path from "path"

type Cand = { name: string; party: string; votes: number; alliance?: string; isNota?: boolean }
type Hist = {
  constituencyNumber: number
  constituencyName: string
  elections: { year: number; candidates: Cand[] }[]
}

const histDir = "data/historical"
const hist: Hist[] = fs
  .readdirSync(histDir)
  .filter((f) => f.startsWith("S11-"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(histDir, f), "utf8")))

const ours: Array<{ seat: number; name: string; constituency: string; votes: number; rank: number; total: number }> = []

let totalCPIMVotes = 0

for (const h of hist) {
  const e = h.elections.find((x) => x.year === 2021)
  if (!e) continue
  const sorted = [...e.candidates].filter(c=>!c.isNota).sort((a, b) => b.votes - a.votes)
  for (let i = 0; i < sorted.length; i++) {
    const c = sorted[i]
    if (c.party === "Communist Party of India (Marxist)") {
      ours.push({
        seat: h.constituencyNumber,
        name: c.name,
        constituency: h.constituencyName,
        votes: c.votes,
        rank: i + 1,
        total: sorted.length,
      })
      totalCPIMVotes += c.votes
    }
  }
}

console.log(`Our 2021 CPI(M) candidates: ${ours.length}`)
console.log(`Total CPI(M) votes: ${totalCPIMVotes.toLocaleString()}`)
console.log()
console.log("Candidates by rank (1=winner, 2=runner-up, 3+=below):")
console.log("=".repeat(80))
for (const c of ours) {
  const flag = c.rank === 1 ? "WIN" : c.rank === 2 ? "R-U" : "LOW"
  console.log(`  ${flag}  rank=${c.rank}/${c.total}  seat=${c.seat.toString().padStart(3)}  ${c.constituency.padEnd(20)}  ${c.name.padEnd(30)}  votes=${c.votes.toLocaleString().padStart(8)}`)
}

const winners = ours.filter(c => c.rank === 1).length
const runnerUps = ours.filter(c => c.rank === 2).length
const below = ours.filter(c => c.rank > 2)
console.log()
console.log(`Wins (rank 1):       ${winners}`)
console.log(`Runner-ups (rank 2): ${runnerUps}`)
console.log(`Rank 3+:             ${below.length}`)
console.log()
if (below.length > 0) {
  console.log("CPI(M) candidates who finished 3rd or lower (NOT in Wikipedia top-2 view):")
  for (const c of below) {
    console.log(`  seat=${c.seat}  ${c.constituency}  ${c.name}  rank=${c.rank}/${c.total}  votes=${c.votes.toLocaleString()}`)
  }
}

// Spot-check Aluva (76)
console.log()
console.log("=== Aluva (76) — Wiki labels Shelna Nishad as CPI(M); ours as ??? ===")
const aluva = hist.find(h => h.constituencyNumber === 76)!
const e21 = aluva.elections.find(e => e.year === 2021)!
for (const c of e21.candidates) {
  console.log(`  ${(c.alliance||"?").padEnd(6)}  ${c.party.padEnd(40)}  ${c.name}  votes=${c.votes.toLocaleString()}`)
}
