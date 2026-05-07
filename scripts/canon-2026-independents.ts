/**
 * Canonicalize alliance-aligned Independents in 2026 to use the
 * `Independent (LDF/UDF/NDA)` naming, matching the 2021 historical
 * convention. Without this, getPartyTrendData("Independent") pools
 * 2026 alliance-aligned independents but not 2021 ones, producing
 * misleading vote-share deltas in PartySection.
 */
import * as fs from "fs"

const file = "data/kerala-2026.json"
const j = JSON.parse(fs.readFileSync(file, "utf8"))
const cs = j.constituencies || j

let renamed = 0
const breakdown: Record<string, number> = {}

for (const c of cs) {
  for (const cand of c.candidates || []) {
    if (cand.party !== "Independent") continue
    if (cand.alliance === "OTHER" || cand.alliance === "NOTA") continue
    const newName = `Independent (${cand.alliance})`
    cand.party = newName
    breakdown[newName] = (breakdown[newName] || 0) + 1
    renamed++
  }
}

fs.writeFileSync(file, JSON.stringify(j, null, 2) + "\n")
console.log(`Renamed ${renamed} entries in ${file}`)
for (const [k, v] of Object.entries(breakdown)) {
  console.log(`  ${k}: ${v} candidates`)
}
