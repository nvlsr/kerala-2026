/**
 * One-shot fix for known party-switch issues in the historical data.
 *
 * The migration that backfilled `alliance` used the 2026 alliance mapping
 * for all historical cycles. Some parties switched fronts during the
 * 2011–2026 window:
 *
 *   - Kerala Congress (M) — left UDF in 2020 and joined LDF.
 *     Pre-2020 KC(M) records currently say LDF; should be UDF.
 *   - Kerala Congress (B) — left UDF in 2016 and joined LDF.
 *     Pre-2016 KC(B) records currently say LDF; should be UDF.
 *   - Revolutionary Socialist Party (RSP, Baby John faction) — left LDF
 *     in 2014 and joined UDF. Pre-2014 RSP records currently say UDF;
 *     should be LDF. (Reverse direction from KC(M)/KC(B).)
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

type SwitchRule = {
  forms: Set<string>
  switchYear: number
  preSwitch: AllianceCode
  /** Used by the migration's 2026 mapping, so currently in the data. */
  current: AllianceCode
  label: string
}

const RULES: SwitchRule[] = [
  {
    forms: new Set(["KC(M)", "KCM", "KC (M)"]),
    switchYear: 2020,
    preSwitch: "UDF",
    current: "LDF",
    label: "KC(M)",
  },
  {
    forms: new Set(["KC(B)", "KCB", "KC (B)"]),
    switchYear: 2016,
    preSwitch: "UDF",
    current: "LDF",
    label: "KC(B)",
  },
  {
    forms: new Set(["RSP"]),
    switchYear: 2014,
    preSwitch: "LDF",
    current: "UDF",
    label: "RSP",
  },
]

function findRule(party: string, year: number): SwitchRule | null {
  for (const r of RULES) {
    if (r.forms.has(party) && year < r.switchYear) return r
  }
  return null
}

const histDir = join(root, "data/historical")
const histFiles = readdirSync(histDir).filter(
  (f) => f.startsWith("S11-") && f.endsWith(".json")
)

const CANDIDATE_OBJECT_RE = /\{[^{}]*"name"\s*:[^{}]*\}/g

const counts = new Map<string, number>()
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
    const rule = findRule(cand.party, year)
    if (!rule) return match
    if (cand.alliance !== rule.current) return match

    const replaced = match.replace(
      new RegExp(`"alliance"\\s*:\\s*"${rule.current}"`),
      `"alliance": "${rule.preSwitch}"`
    )
    if (replaced === match) return match

    counts.set(rule.label, (counts.get(rule.label) ?? 0) + 1)
    touched = true
    return replaced
  })

  if (touched) {
    writeFileSync(path, updated)
    filesTouched++
  }
}

for (const r of RULES) {
  console.log(`${r.label} records updated: ${counts.get(r.label) ?? 0}`)
}
console.log(`Files touched: ${filesTouched} of ${histFiles.length}`)
