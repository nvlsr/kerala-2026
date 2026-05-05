import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dir, "..")
const SOURCE = join(ROOT, "data", "kerala-2026.json")
const OUT_DIR = join(ROOT, "data", "constituencies")

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

const all = JSON.parse(readFileSync(SOURCE, "utf8")) as Constituency[]

if (!existsSync(OUT_DIR)) {
  throw new Error(`out dir missing: ${OUT_DIR}`)
}

let written = 0
for (const c of all) {
  const path = join(OUT_DIR, `S11-${c.constituencyNumber}.json`)
  writeFileSync(path, JSON.stringify(c, null, 2) + "\n")
  written++
}

const sorted = [...all].sort(
  (a, b) => a.constituencyNumber - b.constituencyNumber
)
writeFileSync(SOURCE, JSON.stringify(sorted, null, 2) + "\n")

console.log(`wrote ${written} constituencies → ${OUT_DIR}`)
