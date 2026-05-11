/**
 * Candidate-name utilities shared across pipeline + analysis scripts.
 *
 * Kerala ECI publications have inconsistent name formatting across
 * cycles: case (UPPERCASE vs Title Case), period placement (`A K M`
 * vs `A. K. M.`), honorifics (`Dr.`, `Adv.`, `Sri.`, `Smt.`), word
 * order (`P. K. Sasi` vs `Sasi P. K.`), and occasional transliteration
 * drift. This module gives downstream code one canonical key per name.
 *
 * Use `normalizeName()` for equality matching (tenure detection, etc.)
 * and `nameSimilarity()` for "are these probably the same person"
 * audits.
 */

/**
 * Honorifics that appear before names in ECI/Wikipedia fields.
 * Stripped during normalisation so `"Dr. T. M. Thomas Isaac"` matches
 * `"T. M. Thomas Isaac"`. Keep strict — only honorifics with empirical
 * evidence, to avoid mangling real name tokens.
 */
const HONORIFIC_PREFIXES = new Set([
  "DR", "ADV", "MR", "MRS", "MS",
  "SRI", "SHRI", "SMT", "PROF",
])

/**
 * Suffix titles dropped between cycles. ECI 2026 publications sometimes
 * include `"Master"` (an Indian honorific for teachers) which the same
 * person didn't carry in earlier cycles. Strip only at the trailing
 * position so we don't lose actual surnames.
 */
const HONORIFIC_SUFFIXES = new Set(["MASTER"])

/**
 * Canonical key for cross-cycle equality matching.
 *
 * Pipeline:
 *  1. replace periods with space (so `"ADV.K. ANILKUMAR"` separates
 *     `ADV` from `K` cleanly — earlier versions of this normaliser
 *     stripped periods first and produced `"ADVK ANILKUMAR"`)
 *  2. strip remaining punctuation (commas, quotes, backticks)
 *  3. uppercase + collapse whitespace
 *  4. drop leading honorific tokens (Dr / Adv / Prof / etc.)
 *  5. drop trailing honorific tokens (Master)
 *
 * `"Adv. K. K. Sasi"` → `"K K SASI"`.
 * `"Adv.K. Anilkumar"` ↔ `"K. Anilkumar"` → both `"K ANILKUMAR"`.
 * `"E. T. Taison Master"` ↔ `"E. T. Taison"` → both `"E T TAISON"`.
 */
export function normalizeName(name: string): string {
  const upper = name
    .replace(/\./g, " ")              // period → space (separator)
    .replace(/[,'"`]/g, "")            // strip remaining punctuation
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim()

  const tokens = upper.split(" ")

  let start = 0
  while (start < tokens.length && HONORIFIC_PREFIXES.has(tokens[start])) {
    start++
  }
  let end = tokens.length
  while (end > start && HONORIFIC_SUFFIXES.has(tokens[end - 1])) {
    end--
  }
  return tokens.slice(start, end).join(" ")
}

/**
 * Token set used by `nameSimilarity()` — uppercase tokens of length ≥ 2
 * (preserves initials like `"K"` but drops single-character noise).
 */
export function nameTokens(name: string): Set<string> {
  return new Set(
    normalizeName(name)
      .split(" ")
      .filter(t => t.length >= 2)
  )
}

/**
 * Jaccard similarity of name token sets. Used for "suspected same
 * person but didn't match by full key" audits. 0.0 = no shared tokens,
 * 1.0 = identical token set (different word order).
 *
 *   `"Sasi P K"` ↔ `"P K Sasi"` → 1.0 (same set, different order)
 *   `"Thomas Isaac"` ↔ `"T M Thomas Isaac"` → ~0.5
 *   `"K Surendran"` ↔ `"Surendran"` → 0.5
 */
export function nameSimilarity(a: string, b: string): number {
  const A = nameTokens(a)
  const B = nameTokens(b)
  if (A.size === 0 || B.size === 0) return 0
  let intersection = 0
  for (const t of A) if (B.has(t)) intersection++
  const union = A.size + B.size - intersection
  return intersection / union
}
