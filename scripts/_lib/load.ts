/**
 * Shared data loaders for bun scripts.
 *
 * Loads the trimmed JSON files in `data/` and rehydrates to the full
 * runtime shape (with derived candidate.alliance / status / margin /
 * isNota) so analysis scripts can iterate per-candidate without
 * recomputing the same logic 18 times.
 *
 * Mirrors `src/lib/data/constituencies.ts:hydrateConstituency` — kept
 * in sync by hand. The src/ runtime is the source of truth; scripts
 * are batch consumers.
 */
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")

// ── Types ────────────────────────────────────────────────────────────

export type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER" | "NOTA"

export type Candidate2026 = {
  name: string
  party: string
  alliance: AllianceCode
  votes: number
  margin: number
  status: "won" | "lost" | "nota"
  isNota: boolean
}

export type Constituency2026 = {
  constituencyNumber: number
  constituencyName: string
  candidates: Candidate2026[]
}

export type HistoricalCandidate = {
  name: string
  party: string
  alliance: AllianceCode
  votes: number
  votePct: number
}

export type HistoricalElection = {
  year: number
  type: "general" | "by-election"
  reason: string | null
  candidates: HistoricalCandidate[]
  margin: number | null
  marginPct: number | null
  turnout: number | null
  turnoutPct: number | null
  result: string | null
}

export type HistoricalConstituency = {
  constituencyNumber: number
  constituencyName: string
  elections: HistoricalElection[]
}

export type AlliancesMeta = {
  alliances: Record<
    AllianceCode,
    {
      code: AllianceCode
      name: string
      color: string
      ledBy: string
    }
  >
  partyToAlliance: Record<string, AllianceCode>
  partyAbbreviation: Record<string, string>
  partyAliases: Record<string, string>
}

// ── Loaders ──────────────────────────────────────────────────────────

function readJSON<T>(rel: string): T {
  return JSON.parse(readFileSync(join(ROOT, rel), "utf8")) as T
}

export function loadAlliances(): AlliancesMeta {
  return readJSON<AlliancesMeta>("data/alliances.json")
}

export function loadAcNames(): Record<string, { primary: string; eci: string }> {
  type Raw = Record<string, { primary: string }>
  const raw = readJSON<Raw>("data/ac-names.json")
  const out: Record<string, { primary: string; eci: string }> = {}
  for (const [k, v] of Object.entries(raw)) {
    out[k] = { primary: v.primary, eci: v.primary.toUpperCase() }
  }
  return out
}

/**
 * Load + hydrate 2026 results. Returns the array in AC order.
 * Per-candidate alliance/status/margin/isNota are derived (since the
 * source JSON now stores only name/party/votes — see commit ac1d440).
 */
export function load2026(): Constituency2026[] {
  type RawCandidate = { name: string; party: string; votes: number }
  type RawFile = Record<string, { candidates: RawCandidate[] }>
  const raw = readJSON<RawFile>("data/results-2026.json")
  const alliances = loadAlliances()
  const names = loadAcNames()
  return Object.entries(raw)
    .map(([k, { candidates: rawC }]) => {
      const acNum = Number(k)
      const sorted = [...rawC].sort((a, b) => b.votes - a.votes)
      const winnerVotes = sorted[0]?.votes ?? 0
      const secondVotes = sorted[1]?.votes ?? 0
      const candidates: Candidate2026[] = sorted.map((c, rank) => {
        const isNota = c.name === "NOTA"
        const status: Candidate2026["status"] = isNota
          ? "nota"
          : rank === 0
            ? "won"
            : "lost"
        const margin =
          rank === 0 ? winnerVotes - secondVotes : c.votes - winnerVotes
        const alliance = isNota
          ? "NOTA"
          : ((alliances.partyToAlliance[c.party] as AllianceCode | undefined) ??
            "OTHER")
        return {
          name: c.name,
          party: c.party,
          alliance,
          votes: c.votes,
          margin,
          status,
          isNota,
        }
      })
      return {
        constituencyNumber: acNum,
        constituencyName: names[k]?.eci ?? "",
        candidates,
      }
    })
    .sort((a, b) => a.constituencyNumber - b.constituencyNumber)
}

/**
 * Load consolidated historical data. Returns Map<AC# → HistoricalConstituency>.
 */
export function loadHistorical(): Map<number, HistoricalConstituency> {
  type RawFile = Record<string, { elections: HistoricalElection[] }>
  const raw = readJSON<RawFile>("data/ac-history.json")
  const names = loadAcNames()
  const out = new Map<number, HistoricalConstituency>()
  for (const [k, v] of Object.entries(raw)) {
    const acNum = Number(k)
    out.set(acNum, {
      constituencyNumber: acNum,
      constituencyName: names[k]?.eci ?? "",
      elections: v.elections,
    })
  }
  return out
}
