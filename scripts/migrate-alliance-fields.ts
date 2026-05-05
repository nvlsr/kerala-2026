/**
 * Backfill the `alliance` field on candidate records that don't already
 * have one. Idempotent and safe to re-run.
 *
 * Existing alliance values on a candidate are PRESERVED. The script only
 * fills missing fields (e.g. when a new historical cycle's JSON is added,
 * or when a candidate is hand-added without an alliance).
 *
 *   bun run scripts/migrate-alliance-fields.ts
 *
 * To fix a misclassified candidate, edit the `alliance` field directly
 * on the relevant candidate record in data/kerala-2026.json or
 * data/historical/S11-*.json.
 */

import { readFileSync, readdirSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER" | "NOTA"

type AlliancesMeta = {
  partyToAlliance: Record<string, string>
  partyAbbreviation: Record<string, string>
  partyAliases: Record<string, string>
}

const meta: AlliancesMeta = JSON.parse(
  readFileSync(join(root, "data/alliances.json"), "utf8")
)

const abbreviationToFull: Record<string, string> = {}
for (const [full, abbr] of Object.entries(meta.partyAbbreviation)) {
  abbreviationToFull[abbr] = full
}

function canonicalPartyName(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return trimmed
  if (meta.partyAbbreviation[trimmed]) return trimmed
  if (meta.partyAliases[trimmed]) return meta.partyAliases[trimmed]
  if (abbreviationToFull[trimmed]) return abbreviationToFull[trimmed]
  return trimmed
}

const ALLIANCE_CODES: ReadonlySet<AllianceCode> = new Set([
  "UDF",
  "LDF",
  "NDA",
  "OTHER",
  "NOTA",
])

function isAllianceCode(v: unknown): v is AllianceCode {
  return typeof v === "string" && ALLIANCE_CODES.has(v as AllianceCode)
}

/**
 * Manual classifications for Independents who had alliance backing.
 * Used only when filling alliance for the first time — once a candidate
 * has an alliance field in the data, the migration leaves it alone.
 * Add a new entry here ONLY if you need the migration to re-derive the
 * value during a fresh run; otherwise edit the candidate's `alliance`
 * field directly in the relevant JSON.
 */
const independentOverrides: Record<string, AllianceCode> = {
  "6:V. KUNHIKRISHNAN": "UDF",
  "8:T K GOVINDAN MASTER S/O KUNHIKKANNAN NAMBIAR": "UDF",
  "93:MANI C KAPPEN": "UDF",
  "105:G.SUDHAKARAN": "UDF",
  "134:SUDHIR KARAMANA": "LDF",
  "24:C H Ebrahimkutty": "UDF",
}

function classify(
  constituencyNumber: number,
  candidate: { name: string; party: string; isNota?: boolean }
): AllianceCode {
  if (candidate.isNota || candidate.party === "NOTA") return "NOTA"
  const canonical = canonicalPartyName(candidate.party)
  if (canonical === "Independent") {
    return (
      independentOverrides[`${constituencyNumber}:${candidate.name}`] ?? "OTHER"
    )
  }
  const fromMap = meta.partyToAlliance[canonical]
  return isAllianceCode(fromMap) ? fromMap : "OTHER"
}

type Candidate2026 = {
  name: string
  party: string
  alliance?: AllianceCode
  votes: number
  isNota?: boolean
} & Record<string, unknown>

type Seat2026 = {
  constituencyNumber: number
  candidates: Candidate2026[]
} & Record<string, unknown>

const path2026 = join(root, "data/kerala-2026.json")
const seats2026: Seat2026[] = JSON.parse(readFileSync(path2026, "utf8"))
let filled2026 = 0
let preserved2026 = 0
for (const seat of seats2026) {
  for (const cand of seat.candidates) {
    if (cand.alliance) {
      preserved2026++
    } else {
      cand.alliance = classify(seat.constituencyNumber, cand)
      filled2026++
    }
  }
}
if (filled2026 > 0) {
  writeFileSync(path2026, JSON.stringify(seats2026, null, 2) + "\n")
}
console.log(
  `kerala-2026.json: filled ${filled2026}, preserved ${preserved2026}`
)

type HistoricalCandidate = {
  name: string
  party: string
  alliance?: AllianceCode
  votePct: number
  isNota?: boolean
} & Record<string, unknown>

type HistoricalSeat = {
  constituencyNumber: number
  elections: Array<{ candidates: HistoricalCandidate[] } & Record<string, unknown>>
} & Record<string, unknown>

const histDir = join(root, "data/historical")
const histFiles = readdirSync(histDir).filter(
  (f) => f.startsWith("S11-") && f.endsWith(".json")
)

/**
 * Historical files use a compact one-candidate-per-line format that
 * JSON.stringify(_, null, 2) explodes into 6-line objects. We preserve the
 * original formatting by doing an in-place string edit: regex-find each
 * candidate object, and append `, "alliance": "<code>"` before the closing
 * brace if absent. Idempotent — runs that find an existing alliance leave
 * the object alone.
 */
const CANDIDATE_OBJECT_RE = /\{[^{}]*"name"\s*:[^{}]*\}/g

let filledHist = 0
let preservedHist = 0
let filesTouched = 0

for (const file of histFiles) {
  const path = join(histDir, file)
  const original = readFileSync(path, "utf8")
  const parsed: HistoricalSeat = JSON.parse(original)

  // Document-order list of candidates so we can pair each regex match with
  // its already-parsed counterpart (and look up classifications properly).
  const candidatesInOrder: HistoricalCandidate[] = []
  for (const election of parsed.elections) {
    for (const cand of election.candidates) {
      candidatesInOrder.push(cand)
    }
  }

  let i = 0
  let touched = false
  const updated = original.replace(CANDIDATE_OBJECT_RE, (match) => {
    const cand = candidatesInOrder[i++]
    if (!cand) return match
    if (match.includes('"alliance"')) {
      preservedHist++
      return match
    }
    const alliance = classify(parsed.constituencyNumber, cand)
    filledHist++
    touched = true
    return match.replace(/\s*\}$/, `, "alliance": "${alliance}" }`)
  })

  if (touched) {
    writeFileSync(path, updated)
    filesTouched++
  }
}
console.log(
  `historical: filled ${filledHist}, preserved ${preservedHist}, touched ${filesTouched} of ${histFiles.length} files`
)

console.log(
  `\nDone. Total filled: ${filled2026 + filledHist}, preserved: ${preserved2026 + preservedHist}`
)
