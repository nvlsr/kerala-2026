/**
 * One-shot fix for two known party-switch issues in the historical data.
 *
 * The migration that backfilled `alliance` used the 2026 alliance mapping
 * for all historical cycles. Two parties switched fronts during the
 * 2011–2026 window:
 *
 *   - Kerala Congress (M) — Jose K. Mani faction left UDF in 2020 and
 *     joined LDF. Pre-2020 KC(M) candidates should be UDF.
 *   - Kerala Congress (B) — Balakrishna Pillai faction left UDF in 2016
 *     and joined LDF. Pre-2016 KC(B) candidates should be UDF.
 *
 * Idempotent. Re-running after the fix is a no-op.
 *
 *   bun run scripts/fix-party-switches.ts
 */

import { readFileSync, readdirSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER" | "NOTA"

type HistoricalCandidate = {
  name: string
  party: string
  alliance?: AllianceCode
  votePct: number
} & Record<string, unknown>

type HistoricalElection = {
  year: number
  type: string
  candidates: HistoricalCandidate[]
} & Record<string, unknown>

type HistoricalSeat = {
  constituencyNumber: number
  elections: HistoricalElection[]
} & Record<string, unknown>

const KCM_FORMS = new Set(["KC(M)", "KCM", "KC (M)"])
const KCB_FORMS = new Set(["KC(B)", "KCB", "KC (B)"])

function shouldFix(
  party: string,
  year: number,
  alliance: AllianceCode | undefined
): boolean {
  if (alliance !== "LDF") return false
  if (KCM_FORMS.has(party) && year < 2020) return true
  if (KCB_FORMS.has(party) && year < 2016) return true
  return false
}

const histDir = join(root, "data/historical")
const histFiles = readdirSync(histDir).filter(
  (f) => f.startsWith("S11-") && f.endsWith(".json")
)

const CANDIDATE_OBJECT_RE = /\{[^{}]*"name"\s*:[^{}]*\}/g

let kcmUpdated = 0
let kcbUpdated = 0
let filesTouched = 0

for (const file of histFiles) {
  const path = join(histDir, file)
  const original = readFileSync(path, "utf8")
  const parsed: HistoricalSeat = JSON.parse(original)

  type Pair = { cand: HistoricalCandidate; year: number }
  const candidatesInOrder: Pair[] = []
  for (const election of parsed.elections) {
    for (const cand of election.candidates) {
      candidatesInOrder.push({ cand, year: election.year })
    }
  }

  let i = 0
  let touched = false
  const updated = original.replace(CANDIDATE_OBJECT_RE, (match) => {
    const pair = candidatesInOrder[i++]
    if (!pair) return match
    const { cand, year } = pair
    if (!shouldFix(cand.party, year, cand.alliance)) return match

    const replaced = match.replace(
      /"alliance"\s*:\s*"LDF"/,
      '"alliance": "UDF"'
    )
    if (replaced === match) return match

    if (KCM_FORMS.has(cand.party)) kcmUpdated++
    else if (KCB_FORMS.has(cand.party)) kcbUpdated++
    touched = true
    return replaced
  })

  if (touched) {
    writeFileSync(path, updated)
    filesTouched++
  }
}

console.log(`KC(M) records updated: ${kcmUpdated}`)
console.log(`KC(B) records updated: ${kcbUpdated}`)
console.log(`Files touched: ${filesTouched} of ${histFiles.length}`)
