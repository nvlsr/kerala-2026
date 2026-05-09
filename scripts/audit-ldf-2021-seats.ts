/**
 * Lists every LDF-tagged candidate in 2021 by constituency, grouped
 * by their primary party label. Used to identify any seat where our
 * scraper may have attributed a candidate to CPI(M) when Wikipedia
 * attributes them to CPI (or to a "left Independent" we mistagged).
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
type Election = { year: number; candidates: Cand[] }
type Hist = {
  constituencyName: string
  constituencyNumber: number
  elections: Election[]
}

const hist: Hist[] = histFiles.map((f) =>
  JSON.parse(fs.readFileSync(path.join(histDir, f), "utf8"))
)

const partyByConst: Record<string, string[]> = {}

for (const h of hist) {
  const e = h.elections.find((x) => x.year === 2021)
  if (!e) continue
  for (const c of e.candidates) {
    if (c.alliance !== "LDF") continue
    if (!partyByConst[c.party]) partyByConst[c.party] = []
    partyByConst[c.party].push(
      `${h.constituencyNumber.toString().padStart(3)}  ${h.constituencyName.padEnd(20)}  ${c.name.padEnd(30)}  votes=${c.votes}`
    )
  }
}

const counts = Object.entries(partyByConst)
  .map(([p, list]) => ({ party: p, n: list.length }))
  .sort((a, b) => b.n - a.n)

console.log("=== LDF candidate count by party in 2021 ===")
for (const c of counts) {
  console.log(`${c.n.toString().padStart(4)}  ${c.party}`)
}

console.log("\n=== Independent (LDF) seats in 2021 ===")
for (const line of partyByConst["Independent (LDF)"] || []) console.log(line)

console.log("\n=== Independent (LDF) seats — checking who won ===")
for (const h of hist) {
  const e = h.elections.find((x) => x.year === 2021)
  if (!e) continue
  const ldfCand = e.candidates.find(
    (c) => c.alliance === "LDF" && c.party === "Independent (LDF)"
  )
  if (!ldfCand) continue
  const winner = e.candidates.reduce((a, b) => (a.votes > b.votes ? a : b))
  const winnerLabel =
    winner.party === ldfCand.party && winner.name === ldfCand.name
      ? "WON"
      : `lost (winner: ${winner.party})`
  console.log(
    `${h.constituencyNumber.toString().padStart(3)}  ${h.constituencyName.padEnd(20)}  ${ldfCand.name.padEnd(30)}  votes=${ldfCand.votes.toLocaleString().padStart(7)}  ${winnerLabel}`
  )
}
