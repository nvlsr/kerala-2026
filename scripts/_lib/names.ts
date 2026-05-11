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
  "DR", "ADV", "ADVOCATE", "MR", "MRS", "MS",
  "SRI", "SHRI", "SMT", "PROF",
])

/**
 * Suffix honorifics dropped between cycles. Both `"Master"` and
 * `"Teacher"` are Malayalam-political honorifics for someone who was
 * formerly a school teacher (the most common path into LDF/UDF Kerala
 * politics through trade-union/local-leadership work). ECI sometimes
 * publishes them and sometimes doesn't — strip from the trailing
 * position only, so we don't mangle real surnames.
 */
const HONORIFIC_SUFFIXES = new Set(["MASTER", "TEACHER"])

/**
 * Hindu caste-name suffixes. Tracked SEPARATELY from honorifics so we
 * can preserve the information for future analyses (e.g. "all Nair
 * candidates in Trivandrum 2026"). `normalizeName()` strips them from
 * the canonical key, but `extractCasteSuffix()` records what was
 * stripped.
 *
 * Conservative list: Hindu caste-names with strong empirical evidence
 * of appearing as trailing-suffix-only (not first-name or middle-name)
 * in Kerala ECI publications. We deliberately exclude ambiguous cases
 * like THANGAL (Muslim Sayyid title) — these would go in a future
 * `RELIGIOUS_TITLES` set if needed.
 */
const CASTE_SUFFIXES = new Set([
  "NAIR",
  "PILLAI",
  "MENON",
  "IYER",
  "NAMPOOTHIRI",
  "NAMBOOTHIRI",
])

/**
 * Extract the trailing caste suffix from a raw candidate name, if any.
 * Returns the suffix as found in `CASTE_SUFFIXES` (uppercase) or null.
 *
 * Mirrors the trailing-token check inside `normalizeName()`, so a name
 * and its caste suffix together fully reconstruct the original.
 */
export function extractCasteSuffix(name: string): string | null {
  const tokens = name
    .replace(/\./g, " ")
    .replace(/[,'"`]/g, "")
    .toUpperCase()
    .split(/\s+/)
    .filter(t => t.length > 0)
  if (tokens.length === 0) return null
  const last = tokens[tokens.length - 1]
  return CASTE_SUFFIXES.has(last) ? last : null
}

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
 *  5. drop trailing honorific tokens (Master, Teacher)
 *  6. drop trailing caste-name suffix (Nair, Pillai, Menon, Iyer,
 *     Nampoothiri/Namboothiri) — preserved separately via
 *     `extractCasteSuffix()` for downstream analysis
 *
 * `"Adv. K. K. Sasi"` → `"K K SASI"`.
 * `"Adv.K. Anilkumar"` ↔ `"K. Anilkumar"` → both `"K ANILKUMAR"`.
 * `"E. T. Taison Master"` ↔ `"E. T. Taison"` → both `"E T TAISON"`.
 * `"Chenkal S. Rajasekharan Nair"` ↔ `"Chenkal Rajasekharan"` → both `"CHENKAL S RAJASEKHARAN"` and `"CHENKAL RAJASEKHARAN"` respectively (caste stripped but token-count still differs).
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
  // Drop trailing honorific + caste suffix tokens (in either order —
  // both "X Master" and "X Nair" or even theoretical "X Master Nair")
  while (
    end > start &&
    (HONORIFIC_SUFFIXES.has(tokens[end - 1]) ||
      CASTE_SUFFIXES.has(tokens[end - 1]))
  ) {
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
