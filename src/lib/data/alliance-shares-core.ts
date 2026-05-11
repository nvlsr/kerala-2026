/**
 * Pure alliance-share computation.
 *
 * Shared by both the runtime app (consumed via walkthrough-metrics.ts
 * + page-side data modules) and the Bun analysis scripts (which can't
 * import historical.ts because it uses Vite-only `import.meta.glob`).
 *
 * The functions take raw candidate arrays — they do NOT load data
 * themselves. Loading lives at the boundary (each caller provides
 * candidates from whatever source).
 *
 * Convention:
 *   2026 — NOTA excluded from denominator. Matches std political-analysis
 *          practice (alliance shares of valid party votes, not all ballots).
 *   2011/2016/2019/2021 — NOTA INCLUDED in denominator. Reproduces the
 *          Python analysis catalogue's asymmetry, where the script
 *          checks isNota (true on 2026 NOTA) but not the historical
 *          NOTA alliance label. The asymmetry drags 2021 alliance shares
 *          by ~0.2-0.4pp of NOTA share but stays consistent with the
 *          upstream catalogue.
 */

export type AllianceShares = {
  UDF: number
  LDF: number
  NDA: number
  OTHER: number
}

/** Minimal candidate shape consumed by share computation. */
export type ShareCandidate = {
  alliance?: string
  isNota?: boolean
  votes: number
}

/** 2026-style: NOTA excluded from denominator via the `isNota` flag. */
export function shares2026FromCandidates(
  candidates: readonly ShareCandidate[]
): AllianceShares {
  let total = 0
  for (const c of candidates) {
    if (c.isNota) continue
    total += c.votes
  }
  const out: AllianceShares = { UDF: 0, LDF: 0, NDA: 0, OTHER: 0 }
  if (total === 0) return out
  for (const c of candidates) {
    if (c.isNota) continue
    const a = c.alliance
    if (a === "UDF" || a === "LDF" || a === "NDA") {
      out[a] += (c.votes / total) * 100
    } else {
      out.OTHER += (c.votes / total) * 100
    }
  }
  return out
}

/**
 * Historical (2011/2016/2019/2021) shape: NOTA INCLUDED in denominator,
 * but the NOTA-alliance candidate itself is excluded from the buckets.
 * Reproduces the Python catalogue's asymmetry — see module docstring.
 */
export function sharesHistoricalFromCandidates(
  candidates: readonly ShareCandidate[]
): AllianceShares | null {
  let total = 0
  for (const c of candidates) total += c.votes
  if (total === 0) return null
  const out: AllianceShares = { UDF: 0, LDF: 0, NDA: 0, OTHER: 0 }
  for (const c of candidates) {
    if (c.alliance === "NOTA") continue
    const pct = (c.votes / total) * 100
    if (c.alliance === "UDF" || c.alliance === "LDF" || c.alliance === "NDA") {
      out[c.alliance] += pct
    } else {
      out.OTHER += pct
    }
  }
  return out
}

/** Argmax of the four alliance shares. */
export function winnerOf(
  s: AllianceShares
): keyof AllianceShares {
  let best: keyof AllianceShares = "UDF"
  let bestVal = -Infinity
  for (const a of ["UDF", "LDF", "NDA", "OTHER"] as const) {
    if (s[a] > bestVal) {
      bestVal = s[a]
      best = a
    }
  }
  return best
}
