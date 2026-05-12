/**
 * Canonical display-name lookup for candidates.
 *
 * Problem: ECI publishes the same candidate's name differently across cycles
 * (case, periods, honorifics, caste suffixes), so "RAJEEV CHANDRASEKHAR" in
 * 2026 and "Rajeev Chandrasekhar" in 2021 are the same person but show up
 * inconsistently. Dossiers should display **one** canonical name per
 * candidate, regardless of which cycle's raw record we're rendering.
 *
 * This module builds a single map from `normalizeName(raw)` → best-quality
 * display string, using:
 *  - `scripts/_lib/names.ts:normalizeName()` — the canonical-key util the rest
 *    of the pipeline already uses (community-relevance, hereditary-seats,
 *    candidate-continuity builders all import from it).
 *  - `data/candidate-aliases.json` — manual overrides for cases where
 *    normalizeName fails to merge (spelling variants like Kappan/Kappen).
 *  - A "richest display" heuristic when multiple raw names map to the same
 *    canonical key.
 *
 * Use:
 *   const map = buildCanonicalNameMap()
 *   const display = displayName(map, rawNameFromCycle)
 *   const slug    = canonicalSlug(rawNameFromCycle)
 */

import results2026 from "../../../../data/results-2026.json"
import history from "../../../../data/ac-history.json"
import aliasesFile from "../../../../data/candidate-aliases.json"
import { normalizeName } from "../../../_lib/names"

const aliasMap: Record<string, string> = (aliasesFile as any).aliases ?? {}

function applyAlias(name: string): string {
  return aliasMap[name] ?? name
}

/** Canonical equality key — feed this into Maps when matching across cycles. */
export function canonicalKey(rawName: string): string {
  return normalizeName(applyAlias(rawName))
}

/** Slug derived from the canonical key (lowercase kebab). */
export function canonicalSlug(rawName: string): string {
  return canonicalKey(rawName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Score a raw name to pick the "best" display variant across cycles.
 * Higher score = more polished:
 *   +10 has any lowercase letter (proper case beats UPPERCASE)
 *   +2  contains a period (initials with periods read better)
 *   +len * 0.1  longer names usually have more complete tokens
 */
function displayScore(raw: string): number {
  let s = 0
  if (/[a-z]/.test(raw)) s += 10
  if (/\./.test(raw)) s += 2
  s += raw.length * 0.1
  return s
}

/**
 * Fallback for candidates whose only raw variant is UPPERCASE (e.g. 2026-only
 * candidates like Rajeev Chandrasekhar — first-time MLA, no history match).
 * Word-boundary title-case: "RAJEEV CHANDRASEKHAR" → "Rajeev Chandrasekhar".
 */
function titleCaseIfNeeded(raw: string): string {
  if (/[a-z]/.test(raw)) return raw
  return raw
    .toLowerCase()
    .replace(/\b(\w)/g, (m) => m.toUpperCase())
}

export function buildCanonicalNameMap(): Map<string, string> {
  const variantsByKey: Map<string, Set<string>> = new Map()

  function addCandidate(raw: string) {
    const aliased = applyAlias(raw)
    const key = normalizeName(aliased)
    if (!key) return
    if (!variantsByKey.has(key)) variantsByKey.set(key, new Set())
    variantsByKey.get(key)!.add(aliased)
  }

  // Walk every cycle's candidate list. We don't care which AC — names that
  // collide across ACs are the same canonical key by design.
  for (const payload of Object.values(results2026 as any)) {
    for (const c of (payload as any).candidates as { name: string }[]) {
      addCandidate(c.name)
    }
  }
  for (const payload of Object.values(history as any)) {
    for (const ev of (payload as any).elections as { candidates: { name: string }[] }[]) {
      for (const c of ev.candidates) addCandidate(c.name)
    }
  }

  const canonical: Map<string, string> = new Map()
  for (const [key, variants] of variantsByKey) {
    const best = [...variants].sort((a, b) => displayScore(b) - displayScore(a))[0]
    canonical.set(key, titleCaseIfNeeded(best))
  }
  return canonical
}

/** Look up display name for any raw name, falling back to the raw if no match. */
export function displayName(map: Map<string, string>, rawName: string): string {
  return map.get(canonicalKey(rawName)) ?? rawName
}
