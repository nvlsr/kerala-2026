import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dir, "..")
const AGG = join(ROOT, "data", "kerala-2026.json")
const DIR = join(ROOT, "data", "constituencies")

type Candidate = {
  name: string
  party: string
  votes: number
  margin: number
  status: "won" | "lost" | "nota"
  isNota: boolean
}

type Constituency = {
  constituency: string
  constituencyNumber: number
  constituencyName: string
  state: string
  candidates: Candidate[]
  checksum: { computedMarginsMatchScraped: boolean; mismatches: unknown[] }
  source: string
}

const REQUIRED_FIELDS = [
  "constituency",
  "constituencyNumber",
  "constituencyName",
  "state",
  "candidates",
  "checksum",
  "source",
] as const

const issues: string[] = []
const aggregate = JSON.parse(readFileSync(AGG, "utf8")) as Constituency[]
const filesByNumber = new Map<number, Constituency>()

for (const file of readdirSync(DIR)) {
  if (!file.startsWith("S11-") || !file.endsWith(".json")) continue
  const c = JSON.parse(readFileSync(join(DIR, file), "utf8")) as Constituency
  filesByNumber.set(c.constituencyNumber, c)
}

if (aggregate.length !== 140)
  issues.push(`aggregate has ${aggregate.length} entries, expected 140`)
if (filesByNumber.size !== 140)
  issues.push(`per-constituency files: ${filesByNumber.size}, expected 140`)

for (let n = 1; n <= 140; n++) {
  if (!filesByNumber.has(n))
    issues.push(`missing per-constituency file for S11-${n}`)
}

let totalCandidates = 0
let totalCheckumPassed = 0
let withNota = 0
let withoutNota = 0

for (const c of aggregate) {
  for (const f of REQUIRED_FIELDS) {
    if ((c as Record<string, unknown>)[f] === undefined) {
      issues.push(`#${c.constituencyNumber}: missing field "${f}"`)
    }
  }
  if (!Array.isArray(c.candidates) || c.candidates.length === 0) {
    issues.push(`#${c.constituencyNumber}: empty candidates`)
    continue
  }
  totalCandidates += c.candidates.length
  c.candidates.forEach((cand, i) => {
    for (const f of [
      "name",
      "party",
      "votes",
      "margin",
      "status",
      "isNota",
    ] as const) {
      if (cand[f] === undefined || cand[f] === null) {
        issues.push(`#${c.constituencyNumber} candidate[${i}]: missing "${f}"`)
      }
    }
    if (typeof cand.votes !== "number" || Number.isNaN(cand.votes)) {
      issues.push(`#${c.constituencyNumber} candidate[${i}]: invalid votes`)
    }
    if (typeof cand.margin !== "number" || Number.isNaN(cand.margin)) {
      issues.push(`#${c.constituencyNumber} candidate[${i}]: invalid margin`)
    }
  })

  const winners = c.candidates.filter((x) => x.status === "won")
  if (winners.length !== 1)
    issues.push(`#${c.constituencyNumber}: ${winners.length} winners`)

  const sorted = [...c.candidates].sort((a, b) => b.votes - a.votes)
  const winner = sorted[0]
  const runnerUp = sorted[1]
  if (!winner || !runnerUp) {
    issues.push(
      `#${c.constituencyNumber}: <2 candidates, can't compute margins`
    )
    continue
  }
  for (const cand of c.candidates) {
    const computed =
      cand.name === winner.name && cand.votes === winner.votes
        ? winner.votes - runnerUp.votes
        : cand.votes - winner.votes
    if (computed !== cand.margin) {
      issues.push(
        `#${c.constituencyNumber} ${cand.name}: scraped=${cand.margin} computed=${computed}`
      )
    }
  }

  if (c.checksum?.computedMarginsMatchScraped !== true) {
    issues.push(`#${c.constituencyNumber}: checksum did not pass during scrape`)
  } else {
    totalCheckumPassed++
  }

  if (c.candidates.some((x) => x.isNota)) withNota++
  else withoutNota++

  const file = filesByNumber.get(c.constituencyNumber)
  if (!file) continue
  if (JSON.stringify(file) !== JSON.stringify(c)) {
    issues.push(
      `#${c.constituencyNumber}: per-constituency file diverges from aggregate`
    )
  }
}

const winnerByParty = new Map<string, number>()
for (const c of aggregate) {
  const winner = c.candidates.find((x) => x.status === "won")
  if (!winner) continue
  winnerByParty.set(winner.party, (winnerByParty.get(winner.party) ?? 0) + 1)
}

console.log("=== Kerala 2026 dataset validation ===")
console.log(`constituencies in aggregate: ${aggregate.length}`)
console.log(`per-constituency files:      ${filesByNumber.size}`)
console.log(`total candidates:            ${totalCandidates}`)
console.log(`with NOTA row:               ${withNota}`)
console.log(`without NOTA row:            ${withoutNota}`)
console.log(`checksum-passed at scrape:   ${totalCheckumPassed}/140`)
console.log("")
console.log("seats by winning party:")
for (const [party, n] of [...winnerByParty.entries()].sort(
  (a, b) => b[1] - a[1]
)) {
  console.log(`  ${party.padEnd(45)} ${n}`)
}
console.log("")
if (issues.length === 0) {
  console.log("✅ all checks passed")
} else {
  console.log(`❌ ${issues.length} issue(s):`)
  for (const i of issues) console.log("  - " + i)
  process.exit(1)
}
