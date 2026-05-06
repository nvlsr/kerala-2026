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
}

let _index: IndexEntry[] | null = null

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
    })
  }

  // ─── Candidates ─────────────────────────────────────────────────────
  for (const c of constituencies) {
    for (const cand of c.candidates) {
      if (cand.isNota) continue
      entries.push({
        type: "candidate",
        primaryText: cand.name,
        secondaryText: `${cand.party} · ${c.constituencyName}`,
        url: `/explore?seat=${c.constituencyNumber}`,
        searchKey:
          `${cand.name} ${cand.party} ${c.constituencyName}`.toLowerCase(),
        id: `candidate-${c.constituencyNumber}-${cand.name}`,
      })
    }
  }

  // ─── Parties (deduplicated by canonical party name) ─────────────────
  const seenParties = new Set<string>()
  for (const c of constituencies) {
    for (const cand of c.candidates) {
      if (cand.isNota) continue
      if (seenParties.has(cand.party)) continue
      seenParties.add(cand.party)
      entries.push({
        type: "party",
        primaryText: cand.party,
        url: `/explore?party=${encodeURIComponent(cand.party)}`,
        searchKey: cand.party.toLowerCase(),
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
