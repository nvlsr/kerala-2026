/**
 * Audits which party rows would have their Δ '21 column suppressed
 * under the 0.5% peak-share threshold. Reads JSON files directly to
 * avoid Vite's import.meta.glob (which Bun doesn't support).
 */
import * as fs from "fs"
import * as path from "path"

const THRESHOLD = 0.5

type Cand = {
  party: string
  alliance: string
  votes: number
  isNota?: boolean
}
type C2026 = { candidates: Cand[]; totalVotesPolled?: number }
type Hist = {
  elections: {
    year: number
    candidates: { party: string; votes: number; isNota?: boolean }[]
    totalValidVotesPolled?: number
  }[]
}

const _raw = JSON.parse(fs.readFileSync("data/kerala-2026.json", "utf8"))
const data2026: C2026[] = Array.isArray(_raw) ? _raw : _raw.constituencies

const histDir = "data/historical"
const histFiles = fs.readdirSync(histDir).filter((f) => f.startsWith("S11-"))
const hist: Hist[] = histFiles.map((f) =>
  JSON.parse(fs.readFileSync(path.join(histDir, f), "utf8"))
)

function statewideShareByParty(year: number): Record<string, number> {
  const totals: Record<string, number> = {}
  let valid = 0
  if (year === 2026) {
    for (const c of data2026) {
      for (const cand of c.candidates) {
        if (cand.isNota) continue
        totals[cand.party] = (totals[cand.party] || 0) + cand.votes
        valid += cand.votes
      }
    }
  } else {
    for (const h of hist) {
      const e = h.elections.find((x) => x.year === year)
      if (!e) continue
      for (const cand of e.candidates) {
        if (cand.isNota) continue
        totals[cand.party] = (totals[cand.party] || 0) + cand.votes
        valid += cand.votes
      }
    }
  }
  const out: Record<string, number> = {}
  for (const [p, v] of Object.entries(totals)) {
    out[p] = (v / valid) * 100
  }
  return out
}

const share26 = statewideShareByParty(2026)
const share21 = statewideShareByParty(2021)

const allianceParties: Record<string, Set<string>> = {
  LDF: new Set(),
  UDF: new Set(),
  NDA: new Set(),
}
for (const c of data2026) {
  for (const cand of c.candidates) {
    if (cand.isNota) continue
    if (allianceParties[cand.alliance]) {
      allianceParties[cand.alliance].add(cand.party)
    }
  }
}

for (const code of ["LDF", "UDF", "NDA"]) {
  console.log(`── ${code} ──`)
  const parties = [...allianceParties[code]].sort()
  for (const party of parties) {
    const cur = share26[party] ?? 0
    const prev = share21[party] ?? 0
    const peak = Math.max(cur, prev)
    const delta = cur - prev
    const suppressed = peak < THRESHOLD
    const flag = suppressed ? "  HIDE" : "  show"
    const deltaStr = `${delta >= 0 ? "+" : ""}${delta.toFixed(3)}pp`
    console.log(
      `${flag}  ${party.padEnd(28)}  '21=${prev.toFixed(3).padStart(7)}%  '26=${cur.toFixed(3).padStart(7)}%  Δ=${deltaStr}`
    )
  }
  console.log()
}
