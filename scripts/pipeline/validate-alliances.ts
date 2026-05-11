/**
 * Validate alliance data integrity.
 *
 *   bun run scripts/pipeline/validate-alliances.ts
 *
 * Checks:
 *   1. Every 2026 candidate has a valid `alliance` field (UDF/LDF/NDA/OTHER/NOTA).
 *   2. Seats sum to 140 across all alliances.
 *   3. Every distinct 2026 party appears in `data/alliances.json`'s
 *      `partyToAlliance` map. The map is consumed by the legacy
 *      `allianceForRawParty` lookup in `src/lib/data/alliances.ts` (used to
 *      pick a colour for per-party trend lines based on the party's current
 *      alliance). Per-candidate alliance assignment lives on the records
 *      themselves and is the source of truth — this map is metadata.
 *   4. Prints Independent winners with their tagged alliance for a spot-check.
 */

import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dir, "..", "..")

type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER" | "NOTA"
const VALID: ReadonlySet<string> = new Set([
  "UDF",
  "LDF",
  "NDA",
  "OTHER",
  "NOTA",
])

const all = JSON.parse(
  readFileSync(join(ROOT, "data", "kerala-2026.json"), "utf8")
) as Array<{
  constituencyNumber: number
  constituencyName: string
  candidates: Array<{
    name: string
    party: string
    alliance: string
    votes: number
    status: string
  }>
}>

const meta = JSON.parse(
  readFileSync(join(ROOT, "data", "alliances.json"), "utf8")
) as {
  partyToAlliance: Record<string, string>
}

const issues: string[] = []

// 1 + 4: per-candidate alliance integrity
const seatsByAlliance: Record<AllianceCode, number> = {
  UDF: 0,
  LDF: 0,
  NDA: 0,
  OTHER: 0,
  NOTA: 0,
}
const votesByAlliance: Record<AllianceCode, number> = {
  UDF: 0,
  LDF: 0,
  NDA: 0,
  OTHER: 0,
  NOTA: 0,
}
let totalVotes = 0
const independentWinners: Array<{
  constituencyNumber: number
  constituencyName: string
  name: string
  alliance: string
}> = []

for (const c of all) {
  for (const cand of c.candidates) {
    if (!VALID.has(cand.alliance)) {
      issues.push(
        `#${c.constituencyNumber} ${c.constituencyName} — ${cand.name} (${cand.party}) has invalid alliance "${cand.alliance}"`
      )
      continue
    }
    const a = cand.alliance as AllianceCode
    votesByAlliance[a] += cand.votes
    totalVotes += cand.votes
    if (cand.status === "won") {
      seatsByAlliance[a]++
      if (cand.party === "Independent") {
        independentWinners.push({
          constituencyNumber: c.constituencyNumber,
          constituencyName: c.constituencyName,
          name: cand.name,
          alliance: cand.alliance,
        })
      }
    }
  }
}

// 2: seats sum to 140
const sumSeats = (Object.keys(seatsByAlliance) as AllianceCode[]).reduce(
  (s, a) => s + seatsByAlliance[a],
  0
)
if (sumSeats !== 140) {
  issues.push(`alliance seats sum to ${sumSeats}, expected 140`)
}

// 3: party→alliance metadata coverage (for legacy chart-colour lookup)
const seenParties = new Set<string>()
for (const c of all)
  for (const cand of c.candidates) seenParties.add(cand.party)
for (const p of seenParties) {
  if (p === "None of the Above") continue
  if (!(p in meta.partyToAlliance)) {
    issues.push(`party not in partyToAlliance map: "${p}"`)
  }
}

// ─── Report ────────────────────────────────────────────────────────────

console.log("=== alliance summary (2026, per-cycle assignment) ===")
console.log(`total seats:  ${all.length}`)
console.log(`total votes:  ${totalVotes.toLocaleString()}`)
console.log("")
console.log(
  `${"alliance".padEnd(8)} ${"seats".padStart(6)} ${"vote%".padStart(8)} ${"votes".padStart(12)}`
)
const order: AllianceCode[] = ["UDF", "LDF", "NDA", "OTHER", "NOTA"]
for (const a of order) {
  const seats = seatsByAlliance[a]
  const v = votesByAlliance[a]
  const pct = ((v / totalVotes) * 100).toFixed(2)
  console.log(
    `${a.padEnd(8)} ${seats.toString().padStart(6)} ${pct.padStart(7)}% ${v.toLocaleString().padStart(12)}`
  )
}

console.log("")
console.log(`sum seats: ${sumSeats}  (expected 140)`)

console.log("\n--- Independent winners (alliance from candidate record) ---")
for (const w of independentWinners.sort(
  (a, b) => a.constituencyNumber - b.constituencyNumber
)) {
  console.log(
    `#${w.constituencyNumber.toString().padStart(3)} ${w.constituencyName.padEnd(20)} ${w.name.padEnd(45)} alliance=${w.alliance}`
  )
}

if (issues.length === 0) {
  console.log("\nall checks pass ✓")
} else {
  console.log("\nissues:")
  for (const i of issues) console.log("  - " + i)
  process.exit(1)
}
