/**
 * Lightweight in-memory search index over the dashboard's queryable
 * entities — candidates, constituencies, parties, districts, alliances.
 *
 * ~1200 entries total. Substring match (case-insensitive, multi-word
 * AND). No fuzzy matching in v1; add later if data shows users typing
 * misspellings frequently.
 *
 * Each result resolves to a URL that the existing dashboard understands
 * (filter-based query params). Search is just a faster way to navigate
 * to a structured view that already exists.
 */

import {
  alliances,
  constituencies,
  districts,
  type AllianceCode,
} from "@/lib/data"
import { alliancesMeta } from "@/lib/data/loaders"

export type SearchResultType =
  | "candidate"
  | "constituency"
  | "party"
  | "district"
  | "alliance"

export type SearchResult = {
  type: SearchResultType
  primaryText: string
  secondaryText?: string
  url: string
  /** Higher = better match. Used for ranking within a result group. */
  matchScore: number
  /** Used as React key. */
  key: string
  /**
   * AC number for constituency / candidate results. Lets the search-bar
   * UI render an SC/ST reservation badge next to a seat name without
   * re-parsing the URL.
   */
  seat?: number
}

type IndexEntry = {
  type: SearchResultType
  primaryText: string
  secondaryText?: string
  url: string
  /** Lowercased concatenation of all matchable text. */
  searchKey: string
  /** Stable unique id for React keying. */
  id: string
  /** AC number for constituency / candidate entries. */
  seat?: number
}

let _index: IndexEntry[] | null = null

/**
 * Returns the variant strings (abbreviations, alternate transliterations,
 * historical forms) that should resolve to the given canonical party
 * name. Sourced directly from data/alliances.json — the project's
 * single source of truth for party-name canonicalization. The returned
 * tokens get appended to the party's searchKey so a user typing "T2P",
 * "BJP", "KCB", "CPIM", etc. surfaces the canonical "Twenty 20 Party",
 * "Bharatiya Janata Party", "Kerala Congress (B)", "Communist Party of
 * India (Marxist)" entries via substring match.
 *
 * Combines two inputs:
 *   - alliancesMeta.partyAbbreviation[canonical]: the official short form
 *     (e.g. "BJP", "20-20", "CPI(M)")
 *   - alliancesMeta.partyAliases: variant strings → canonical (e.g.
 *     "T2P" / "Twenty Twenty Party" → "Twenty 20 Party")
 */
function partyAliases(canonical: string): string[] {
  const out = new Set<string>()
  const abbrev = alliancesMeta.partyAbbreviation[canonical]
  if (abbrev) out.add(abbrev.toLowerCase())
  for (const [variant, target] of Object.entries(alliancesMeta.partyAliases)) {
    if (variant.startsWith("_")) continue
    if (target === canonical) out.add(variant.toLowerCase())
  }
  return [...out]
}

function buildIndex(): IndexEntry[] {
  const entries: IndexEntry[] = []

  // ─── Constituencies (by name only — nobody searches by AC number) ──
  for (const c of constituencies) {
    entries.push({
      type: "constituency",
      primaryText: c.constituencyName,
      secondaryText: "Seat",
      url: `/explore?seat=${c.constituencyNumber}`,
      searchKey: c.constituencyName.toLowerCase(),
      id: `constituency-${c.constituencyNumber}`,
      seat: c.constituencyNumber,
    })
  }

  // ─── Candidates ─────────────────────────────────────────────────────
  // result=all so the searched candidate is visible in the table
  // regardless of winner status (without it, the default winners-only
  // filter would hide losing candidates from the table — they'd only
  // appear in the seat detail panel).
  for (const c of constituencies) {
    for (const cand of c.candidates) {
      if (cand.isNota) continue
      entries.push({
        type: "candidate",
        primaryText: cand.name,
        secondaryText: `${cand.party} · ${c.constituencyName}`,
        url: `/explore?seat=${c.constituencyNumber}&result=all`,
        searchKey:
          `${cand.name} ${cand.party} ${c.constituencyName}`.toLowerCase(),
        id: `candidate-${c.constituencyNumber}-${cand.name}`,
        seat: c.constituencyNumber,
      })
    }
  }

  // ─── Parties (deduplicated by canonical party name) ─────────────────
  // Each party also gets common abbreviation variants appended to its
  // searchKey so users typing "KCB", "KC(B)", "KCM", "BJP", "INC", etc.
  // surface the canonical "Kerala Congress (B)" / "Indian National
  // Congress" entries. The substring-match search would otherwise miss
  // these (e.g. "kcb" isn't a substring of "kerala congress (b)").
  const seenParties = new Set<string>()
  for (const c of constituencies) {
    for (const cand of c.candidates) {
      if (cand.isNota) continue
      if (seenParties.has(cand.party)) continue
      seenParties.add(cand.party)
      const aliases = partyAliases(cand.party)
      const searchKey = [cand.party.toLowerCase(), ...aliases]
        .filter(Boolean)
        .join(" ")
      entries.push({
        type: "party",
        primaryText: cand.party,
        url: `/explore?party=${encodeURIComponent(cand.party)}`,
        searchKey,
        id: `party-${cand.party}`,
      })
    }
  }

  // ─── Districts ──────────────────────────────────────────────────────
  for (const d of districts) {
    entries.push({
      type: "district",
      primaryText: d.name,
      secondaryText: "District",
      url: `/explore?district=${d.id}`,
      searchKey: d.name.toLowerCase(),
      id: `district-${d.id}`,
    })
  }

  // ─── Alliances ─────────────────────────────────────────────────────
  const allianceCodes: AllianceCode[] = ["UDF", "LDF", "NDA"]
  for (const code of allianceCodes) {
    const alliance = alliances.find((a) => a.code === code)
    if (!alliance) continue
    entries.push({
      type: "alliance",
      primaryText: alliance.code,
      secondaryText: alliance.name,
      url: `/explore?alliance=${code}`,
      searchKey: `${alliance.code} ${alliance.name}`.toLowerCase(),
      id: `alliance-${code}`,
    })
  }

  return entries
}

function getIndex(): IndexEntry[] {
  if (!_index) _index = buildIndex()
  return _index
}

/**
 * Returns sorted matches for a query. Empty / very short query returns
 * an empty array — the caller decides whether to show an empty-state
 * helper instead.
 */
export function searchAll(query: string): SearchResult[] {
  const trimmed = query.trim().toLowerCase()
  if (trimmed.length === 0) return []

  const index = getIndex()
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0)
  if (words.length === 0) return []

  const matches: SearchResult[] = []

  for (const entry of index) {
    let allMatch = true
    let score = 0
    for (const word of words) {
      const idx = entry.searchKey.indexOf(word)
      if (idx < 0) {
        allMatch = false
        break
      }
      // Prefer matches earlier in the text
      score -= idx
      // Strong bonus for exact match on the whole searchKey
      if (entry.searchKey === word) score += 10000
      // Bonus for matches at the start of a word boundary
      if (idx === 0 || entry.searchKey[idx - 1] === " ") score += 100
    }
    if (!allMatch) continue

    matches.push({
      type: entry.type,
      primaryText: entry.primaryText,
      secondaryText: entry.secondaryText,
      url: entry.url,
      matchScore: score,
      key: entry.id,
      seat: entry.seat,
    })
  }

  matches.sort((a, b) => b.matchScore - a.matchScore)
  return matches
}

export const SEARCH_GROUP_ORDER: SearchResultType[] = [
  "constituency",
  "candidate",
  "party",
  "district",
  "alliance",
]

export const SEARCH_GROUP_LABEL: Record<SearchResultType, string> = {
  constituency: "Seats",
  candidate: "Candidates",
  party: "Parties",
  district: "Districts",
  alliance: "Alliances",
}

export const SEARCH_GROUP_LIMIT = 6
