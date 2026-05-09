/**
 * Audits per-alliance-row deltas using the alliance-aware filter
 * implemented in PartySection. Mirrors the production logic so we
 * can verify which rows resolve to:
 *   - a numeric delta (peak ≥ 0.5%, prev > 0)
 *   - "new to <alliance>" badge (prev = 0, cur > 0)
 *   - "—" suppression (peak < 0.5%)
 */
import * as fs from "fs"
import * as path from "path"

type Cand = {
  name: string
  party: string
  votes: number
  alliance?: string
  isNota?: boolean
  status?: string
}
type C2026 = { candidates: Cand[] }
type Hist = {
  elections: { year: number; type?: string; candidates: Cand[] }[]
}

const _raw = JSON.parse(fs.readFileSync("data/kerala-2026.json", "utf8"))
const data2026: C2026[] = Array.isArray(_raw) ? _raw : _raw.constituencies
const histDir = "data/historical"
const hist: Hist[] = fs
  .readdirSync(histDir)
  .filter((f) => f.startsWith("S11-"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(histDir, f), "utf8")))

function shareForPartyAlliance(
  year: number,
  party: string,
  alliance: string
): number {
  let votes = 0
  let total = 0
  if (year === 2026) {
    for (const c of data2026) {
      for (const cand of c.candidates) {
        if (cand.isNota) continue
        total += cand.votes
        if (cand.party === party && cand.alliance === alliance)
          votes += cand.votes
      }
    }
  } else {
    for (const h of hist) {
      const e = h.elections.find((x) => x.year === year)
      if (!e) continue
      for (const cand of e.candidates) {
        if (cand.isNota) continue
        total += cand.votes
        if (cand.party === party && cand.alliance === alliance)
          votes += cand.votes
      }
    }
  }
  return total > 0 ? (votes / total) * 100 : 0
}

const allianceParties: Record<string, Set<string>> = {
  LDF: new Set(),
  UDF: new Set(),
  NDA: new Set(),
}
for (const c of data2026) {
  for (const cand of c.candidates) {
    if (cand.isNota) continue
    if (cand.alliance && allianceParties[cand.alliance]) {
      allianceParties[cand.alliance].add(cand.party)
    }
  }
}

for (const code of ["LDF", "UDF", "NDA"]) {
  console.log(`── ${code} ──`)
  const parties = [...allianceParties[code]].sort()
  for (const party of parties) {
    const cur = shareForPartyAlliance(2026, party, code)
    const prev = shareForPartyAlliance(2021, party, code)
    const peak = Math.max(cur, prev)
    const delta = cur - prev
    const isNew = prev === 0 && cur > 0
    const isHidden = peak < 0.5
    const display = isNew
      ? `new to ${code}`
      : isHidden
        ? "—"
        : `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}pp`
    console.log(
      `  ${party.padEnd(28)}  '21=${prev.toFixed(3).padStart(7)}%  '26=${cur.toFixed(3).padStart(7)}%  Δ → ${display}`
    )
  }
  console.log()
}
