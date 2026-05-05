import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dir, "..")
const all = JSON.parse(
  readFileSync(join(ROOT, "data", "kerala-2026.json"), "utf8")
)
const meta = JSON.parse(
  readFileSync(join(ROOT, "data", "alliances.json"), "utf8")
)

type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER" | "NOTA"
const allianceFor = (party: string, ckey: string): AllianceCode => {
  if (party === "Independent" && meta.independentOverrides[ckey]) {
    return meta.independentOverrides[ckey] as AllianceCode
  }
  return (meta.partyToAlliance[party] ?? "OTHER") as AllianceCode
}

const issues: string[] = []
const seen = new Set<string>()
for (const c of all) for (const cand of c.candidates) seen.add(cand.party)
for (const p of seen) {
  if (p === "None of the Above") continue
  if (!(p in meta.partyToAlliance)) issues.push(`unmapped party: ${p}`)
}

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
for (const c of all) {
  for (const cand of c.candidates) {
    const ckey = `${c.constituencyNumber}:${cand.name}`
    const a = allianceFor(cand.party, ckey)
    votesByAlliance[a] += cand.votes
    totalVotes += cand.votes
    if (cand.status === "won") seatsByAlliance[a]++
  }
}

console.log("=== alliance summary ===")
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
const sumSeats = order.reduce((s, a) => s + seatsByAlliance[a], 0)
console.log(`sum seats: ${sumSeats}  (expected 140)`)
if (sumSeats !== 140)
  issues.push(`alliance seats sum to ${sumSeats}, expected 140`)

if (issues.length === 0) {
  console.log("\nall parties mapped ✓")
} else {
  console.log("\nissues:")
  for (const i of issues) console.log("  - " + i)
  process.exit(1)
}

console.log(
  "\n--- Independent winners (override these in data/alliances.json) ---"
)
for (const c of all) {
  const w = c.candidates.find((x: { status: string }) => x.status === "won")
  if (w?.party !== "Independent") continue
  const ckey = `${c.constituencyNumber}:${w.name}`
  const a = meta.independentOverrides[ckey] ?? "OTHER (default)"
  console.log(
    `#${c.constituencyNumber.toString().padStart(3)} ${c.constituencyName.padEnd(20)} ${w.name.padEnd(45)} alliance=${a}`
  )
}
