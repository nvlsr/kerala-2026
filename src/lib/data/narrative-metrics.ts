/**
 * Per-AC narrative metrics consumed by the /narratives surface
 * components (choropleths, scatter plots, bin charts, etc.).
 *
 * Centralised here to:
 *   - guarantee every narrative visualisation reads the same numbers
 *   - avoid recomputing the same per-AC Δshares in multiple components
 *   - cache the computation (cheap but worth doing once on load)
 *
 * Convention: all share figures in percent (0-100), not fractions.
 * Δshares are 2026 minus 2021 in percentage points.
 */

import { constituencies, type Constituency } from "@/lib/data/constituencies"
import { getHistoricalFor } from "@/lib/data/historical"
import { districtsMeta } from "@/lib/data/loaders"

export type Region = "N" | "C" | "S"

const NORTH_DISTRICTS = new Set([
  "kasaragod",
  "kannur",
  "kozhikode",
  "wayanad",
  "malappuram",
])
const CENTRAL_DISTRICTS = new Set([
  "palakkad",
  "thrissur",
  "ernakulam",
  "idukki",
  "kottayam",
  "pathanamthitta",
  "alappuzha",
])
const SOUTH_DISTRICTS = new Set(["kollam", "thiruvananthapuram"])

const districtOfAC: Record<string, string> = districtsMeta.constituencyToDistrict

export function getRegionForAC(acNumber: number): Region | null {
  const district = districtOfAC[String(acNumber)]
  if (!district) return null
  if (NORTH_DISTRICTS.has(district)) return "N"
  if (CENTRAL_DISTRICTS.has(district)) return "C"
  if (SOUTH_DISTRICTS.has(district)) return "S"
  return null
}

export type AllianceShares = {
  UDF: number
  LDF: number
  NDA: number
  /** Aggregate of OTHER + NOTA (small-party + independent + NOTA). */
  OTHER: number
}

export type ACMetrics = {
  acNumber: number
  acName: string
  district: string
  region: Region | null
  shares2021: AllianceShares
  shares2026: AllianceShares
  /** 2026 − 2021, percentage points. */
  deltas: AllianceShares
  /** 2026 winner alliance. Null only if data is degenerate. */
  winner2026: keyof AllianceShares | null
  /** BJP party-share Δ (party-level, distinct from NDA alliance Δ). */
  bjpDelta: number
  bjp2021: number
  bjp2026: number
}

const BJP_PARTY = "Bharatiya Janata Party"

function shares2026Of(c: Constituency): AllianceShares {
  // Convention: shares are computed with NOTA EXCLUDED from the
  // denominator (matches the Python analysis scripts and standard
  // political-analysis practice — alliance shares of valid party
  // votes, not of total ballots cast). NOTA is reported separately
  // via the OTHER bucket here? No — NOTA is excluded entirely. The
  // OTHER bucket represents non-aligned independents and small
  // parties.
  let total = 0
  for (const cand of c.candidates) {
    if (cand.isNota) continue
    total += cand.votes
  }
  const out: AllianceShares = { UDF: 0, LDF: 0, NDA: 0, OTHER: 0 }
  if (total === 0) return out
  for (const cand of c.candidates) {
    if (cand.isNota) continue
    if (cand.alliance === "UDF" || cand.alliance === "LDF" || cand.alliance === "NDA") {
      out[cand.alliance] += (cand.votes / total) * 100
    } else {
      out.OTHER += (cand.votes / total) * 100
    }
  }
  return out
}

function shares2021Of(acNumber: number): AllianceShares | null {
  const hist = getHistoricalFor(acNumber)
  if (!hist) return null
  const election = hist.elections.find(
    (e) => e.year === 2021 && e.type === "general"
  )
  if (!election) return null

  // 2021 denominator includes NOTA. The Python analysis scripts
  // filter NOTA via `cand.get("isNota")` which is true on 2026 NOTA
  // (which has isNota:true) but falsy on 2021 historical NOTA
  // (which only has alliance:"NOTA", no isNota field). To match
  // the Python numbers exactly, this implementation reproduces
  // the asymmetry: 2026 excludes NOTA from denominator, 2021
  // includes NOTA.
  //
  // The asymmetry has a real-world cost (2021 alliance shares are
  // dragged down by ~0.2-0.4pp of NOTA), but stays consistent with
  // the upstream analysis catalogue.
  let total = 0
  for (const cand of election.candidates) {
    total += cand.votes
  }
  if (total === 0) return null

  const out: AllianceShares = { UDF: 0, LDF: 0, NDA: 0, OTHER: 0 }
  for (const cand of election.candidates) {
    if (cand.alliance === "NOTA") continue
    const pct = (cand.votes / total) * 100
    if (
      cand.alliance === "UDF" ||
      cand.alliance === "LDF" ||
      cand.alliance === "NDA"
    ) {
      out[cand.alliance] += pct
    } else {
      out.OTHER += pct
    }
  }
  return out
}

function bjpShare2026Of(c: Constituency): number {
  let total = 0
  let bjp = 0
  for (const cand of c.candidates) {
    if (cand.isNota) continue
    total += cand.votes
    if (cand.party === BJP_PARTY) bjp += cand.votes
  }
  return total === 0 ? 0 : (bjp / total) * 100
}

function bjpShare2021Of(acNumber: number): number {
  const hist = getHistoricalFor(acNumber)
  if (!hist) return 0
  const election = hist.elections.find(
    (e) => e.year === 2021 && e.type === "general"
  )
  if (!election) return 0
  // 2021 denominator includes NOTA (matches Python script asymmetry —
  // see shares2021Of for the rationale).
  let total = 0
  let bjp = 0
  for (const cand of election.candidates) {
    total += cand.votes
    if (cand.party === BJP_PARTY) bjp += cand.votes
  }
  return total === 0 ? 0 : (bjp / total) * 100
}

function winner2026Of(c: Constituency): keyof AllianceShares | null {
  const shares = shares2026Of(c)
  let best: keyof AllianceShares | null = null
  let bestVal = -Infinity
  ;(["UDF", "LDF", "NDA", "OTHER"] as const).forEach((a) => {
    if (shares[a] > bestVal) {
      bestVal = shares[a]
      best = a
    }
  })
  return best
}

let cached: ACMetrics[] | null = null

/** All 140 ACs with computed 2021/2026 shares + Δs. Cached. */
export function getAllACMetrics(): ACMetrics[] {
  if (cached) return cached
  const out: ACMetrics[] = []
  for (const c of constituencies) {
    const s21 = shares2021Of(c.constituencyNumber)
    if (!s21) continue
    const s26 = shares2026Of(c)
    const district = districtOfAC[String(c.constituencyNumber)] ?? "?"
    out.push({
      acNumber: c.constituencyNumber,
      acName: c.constituencyName,
      district,
      region: getRegionForAC(c.constituencyNumber),
      shares2021: s21,
      shares2026: s26,
      deltas: {
        UDF: s26.UDF - s21.UDF,
        LDF: s26.LDF - s21.LDF,
        NDA: s26.NDA - s21.NDA,
        OTHER: s26.OTHER - s21.OTHER,
      },
      winner2026: winner2026Of(c),
      bjp2021: bjpShare2021Of(c.constituencyNumber),
      bjp2026: bjpShare2026Of(c),
      bjpDelta:
        bjpShare2026Of(c) - bjpShare2021Of(c.constituencyNumber),
    })
  }
  cached = out
  return out
}

/** Per-AC Map<acNumber, deltaShare> for a given alliance. */
export function getPerACAllianceDelta(
  alliance: keyof AllianceShares
): Map<number, number> {
  const out = new Map<number, number>()
  for (const m of getAllACMetrics()) {
    out.set(m.acNumber, m.deltas[alliance])
  }
  return out
}

/** Per-AC Map<acNumber, BJP party-share Δ>. */
export function getPerACBJPDelta(): Map<number, number> {
  const out = new Map<number, number>()
  for (const m of getAllACMetrics()) {
    out.set(m.acNumber, m.bjpDelta)
  }
  return out
}

/** Per-AC alliance share value (2021 or 2026) for a given alliance. */
export function getPerACAllianceShare(
  alliance: keyof AllianceShares,
  year: 2021 | 2026
): Map<number, number> {
  const out = new Map<number, number>()
  for (const m of getAllACMetrics()) {
    out.set(
      m.acNumber,
      year === 2021 ? m.shares2021[alliance] : m.shares2026[alliance]
    )
  }
  return out
}

/** Per-AC 2026 winner alliance. */
export function getPerACWinner2026(): Map<number, keyof AllianceShares> {
  const out = new Map<number, keyof AllianceShares>()
  for (const m of getAllACMetrics()) {
    if (m.winner2026) out.set(m.acNumber, m.winner2026)
  }
  return out
}

/** Statewide vote-weighted summary stats. Used in sanity checks
 *  and copy. Mean here is constituency-equal across the 140 ACs. */
export function getStatewideSummary(): {
  meanDeltaUDF: number
  meanDeltaLDF: number
  meanDeltaNDA: number
  meanDeltaBJP: number
  count: number
} {
  const all = getAllACMetrics()
  const n = all.length
  return {
    meanDeltaUDF: all.reduce((s, m) => s + m.deltas.UDF, 0) / n,
    meanDeltaLDF: all.reduce((s, m) => s + m.deltas.LDF, 0) / n,
    meanDeltaNDA: all.reduce((s, m) => s + m.deltas.NDA, 0) / n,
    meanDeltaBJP: all.reduce((s, m) => s + m.bjpDelta, 0) / n,
    count: n,
  }
}
