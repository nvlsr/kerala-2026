/**
 * Scans the keralaassembly.org 2021 raw scrape for candidates whose
 * NAME contains a parenthetical annotation like "(CPI)" or "(RSP-L)".
 * keralaassembly.org puts the alliance code in the `party` field
 * (e.g. "LDF") and disambiguates with the actual party in the name —
 * but our merge-2021.ts ignored those parentheticals, mapping every
 * "LDF" candidate to "Independent (LDF)" regardless. This audit
 * surfaces every affected candidate so we can decide on a fix.
 */
import * as fs from "fs"
import * as path from "path"

type Cand = { name: string; party: string; votes: number; pct: number }
type Seat = { seat: number; constituencyName: string; candidates: Cand[] }

const dir = "data/scraped-2021"
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .sort(
    (a, b) =>
      parseInt(a.match(/seat-(\d+)/)![1]) - parseInt(b.match(/seat-(\d+)/)![1])
  )

const found: Array<{
  seat: number
  constituency: string
  name: string
  paren: string
  partyField: string
  votes: number
  pct: number
}> = []

const parenRegex = /\(([^)]+)\)/

for (const f of files) {
  const s: Seat = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))
  for (const cand of s.candidates) {
    const m = cand.name.match(parenRegex)
    if (!m) continue
    found.push({
      seat: s.seat,
      constituency: s.constituencyName,
      name: cand.name,
      paren: m[1].trim(),
      partyField: cand.party,
      votes: cand.votes,
      pct: cand.pct,
    })
  }
}

// Group by parenthetical content
const byParen: Record<string, typeof found> = {}
for (const f of found) {
  if (!byParen[f.paren]) byParen[f.paren] = []
  byParen[f.paren].push(f)
}

console.log(
  `=== ${found.length} candidate names with parenthetical annotations ===\n`
)

const sortedParens = Object.entries(byParen).sort(
  (a, b) => b[1].length - a[1].length
)
for (const [paren, list] of sortedParens) {
  console.log(`(${paren})  ×${list.length}`)
  for (const c of list) {
    console.log(
      `  seat=${c.seat.toString().padStart(3)}  ${c.constituency.padEnd(20)}  party=${c.partyField.padEnd(6)}  votes=${c.votes.toString().padStart(7)}  pct=${c.pct.toFixed(2).padStart(5)}%  ${c.name}`
    )
  }
  console.log()
}

// Specifically: which parentheticals are followed by party=LDF/UDF/NDA?
console.log(
  `=== Parentheticals where party field is alliance code (LDF/UDF/NDA) ===\n`
)
const allianceFields = new Set(["LDF", "UDF", "NDA"])
const allianceMisclassed = found.filter((c) => allianceFields.has(c.partyField))
console.log(`Total: ${allianceMisclassed.length}\n`)
for (const c of allianceMisclassed) {
  console.log(
    `seat=${c.seat.toString().padStart(3)}  ${c.constituency.padEnd(20)}  party=${c.partyField.padEnd(4)}  votes=${c.votes.toString().padStart(7)}  ${c.name}`
  )
}
