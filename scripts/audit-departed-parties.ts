/**
 * Audit script that reproduces getDepartedAllianceParties using only
 * raw JSON files (so it runs under bun without Vite's import.meta.glob).
 * Used to verify the production function returns the expected list
 * for each alliance.
 */
import * as fs from "fs"
import * as path from "path"

type Cand2026 = {
  party: string
  votes: number
  alliance: string
  isNota?: boolean
}
type AC2026 = { candidates: Cand2026[] }

type HistCand = {
  name: string
  party: string
  votes: number
  alliance: string
  isNota?: boolean
}
type HistElection = { year: number; candidates: HistCand[] }
type HistAC = { elections: HistElection[] }

const _r = JSON.parse(fs.readFileSync("data/kerala-2026.json", "utf8")) as
  | AC2026[]
  | { constituencies: AC2026[] }
const cs2026: AC2026[] = Array.isArray(_r) ? _r : _r.constituencies
const histDir = "data/historical"
const hist: HistAC[] = fs
  .readdirSync(histDir)
  .filter((f) => f.startsWith("S11-"))
  .map(
    (f) => JSON.parse(fs.readFileSync(path.join(histDir, f), "utf8")) as HistAC
  )

let totalValid2021 = 0
for (const h of hist) {
  const e = h.elections.find((x) => x.year === 2021)
  if (!e) continue
  for (const c of e.candidates) {
    if (c.isNota) continue
    totalValid2021 += c.votes
  }
}

for (const code of ["LDF", "UDF", "NDA"]) {
  console.log(`── ${code}: parties that left after 2021 ──`)
  const currentParties = new Set<string>()
  for (const c of cs2026) {
    for (const cand of c.candidates) {
      if (cand.isNota) continue
      if (cand.alliance === code) currentParties.add(cand.party)
    }
  }
  const tally: Record<string, { votes: number; cands: number; wins: number }> =
    {}
  for (const h of hist) {
    const e = h.elections.find((x) => x.year === 2021)
    if (!e) continue
    const winner = [...e.candidates].sort((a, b) => b.votes - a.votes)[0]
    for (const c of e.candidates) {
      if (c.isNota) continue
      if (c.alliance !== code) continue
      if (currentParties.has(c.party)) continue
      if (!tally[c.party]) tally[c.party] = { votes: 0, cands: 0, wins: 0 }
      tally[c.party].votes += c.votes
      tally[c.party].cands++
      if (winner.name === c.name && winner.party === c.party)
        tally[c.party].wins++
    }
  }
  const sorted = Object.entries(tally).sort((a, b) => b[1].votes - a[1].votes)
  for (const [p, t] of sorted) {
    const share = (t.votes / totalValid2021) * 100
    console.log(
      `  ${p.padEnd(28)}  '21=${share.toFixed(2)}%  cands=${t.cands}  wins=${t.wins}  votes=${t.votes.toLocaleString()}`
    )
  }
  console.log()
}
