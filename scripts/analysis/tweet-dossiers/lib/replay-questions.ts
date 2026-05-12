/**
 * Replays the /questions page's filter + sort + top-5 logic against every
 * curated question.
 *
 * Returns two views:
 * - byAc:       per-AC list of "which questions does this AC appear in" with rank.
 * - byQuestion: full top-5 per question, so dossiers can render the surrounding
 *               rows for context (not just this AC's own rank).
 *
 * Uses the SAME functions the live question cards use (buildCandidateRows,
 * sortCandidateRows, getFilteredConstituencyNumbers) so output matches what
 * users see on the site exactly.
 */

import { curatedQuestions } from "../../../../src/lib/curated-questions"
import { buildCandidateRows } from "../../../../src/lib/data/candidate-rows"
import { sortCandidateRows } from "../../../../src/lib/candidate-sort"
import {
  getFilteredConstituencyNumbers,
  initialFilters,
  type Filters,
  type SortColumn,
} from "../../../../src/lib/filters"

const TOP_N = 5

export type TopRow = {
  rank: number
  ac: number
  constituencyName: string
  candidate: string
  party: string
  partyShort: string
  alliance: string
  metricValue: string
  metricRaw: number | null
}

export type QuestionTopList = {
  id: string
  question: string
  theme: string
  party?: string
  alliance?: string
  metricLabel: string
  rows: TopRow[]
}

export type QuestionAppearance = {
  id: string
  rank: number
}

function resolveFilters(preset: Partial<Filters>): Filters {
  return { ...initialFilters, ...preset }
}

function pickSignFilter(filters: Filters) {
  const { column, dir } = filters.sort
  if (column === "shareDelta") {
    return (r: any) =>
      r.shareDelta2021 != null &&
      (dir === "desc" ? r.shareDelta2021 > 0 : r.shareDelta2021 < 0)
  }
  if (column === "marginDelta") {
    return (r: any) =>
      r.marginDelta2021 != null &&
      (dir === "desc" ? r.marginDelta2021 > 0 : r.marginDelta2021 < 0)
  }
  return null
}

function metricLabel(col: SortColumn): string {
  if (col === "shareDelta") return "Δ share vs 2021"
  if (col === "marginDelta") return "Δ margin vs 2021"
  if (col === "margin") return "2026 margin"
  if (col === "share") return "2026 share"
  return col
}

function extractMetric(
  r: any,
  col: SortColumn
): { value: string; raw: number | null } {
  if (col === "shareDelta") {
    const v = r.shareDelta2021
    return {
      value: v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(2)} pp`,
      raw: v ?? null,
    }
  }
  if (col === "marginDelta") {
    const v = r.marginDelta2021
    return {
      value: v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(2)} pp`,
      raw: v ?? null,
    }
  }
  if (col === "margin") {
    return { value: `${r.marginPct.toFixed(2)} pp`, raw: r.marginPct }
  }
  if (col === "share") {
    return { value: `${r.share.toFixed(2)}%`, raw: r.share }
  }
  return { value: "—", raw: null }
}

const PARTY_SHORT: Record<string, string> = {
  "Bharatiya Janata Party": "BJP",
  "Indian National Congress": "INC",
  "Communist Party of India (Marxist)": "CPI(M)",
  "Communist Party of India": "CPI",
  "Indian Union Muslim League": "IUML",
  "Bharath Dharma Jana Sena": "BDJS",
  "Kerala Congress (M)": "KEC(M)",
  "Kerala Congress": "KEC",
  "Revolutionary Socialist Party": "RSP",
}
const short = (p: string) => PARTY_SHORT[p] ?? p

export function replayAllQuestions(): {
  byAc: Record<number, QuestionAppearance[]>
  byQuestion: Record<string, QuestionTopList>
} {
  const all = buildCandidateRows(null)
  const byAc: Record<number, QuestionAppearance[]> = {}
  const byQuestion: Record<string, QuestionTopList> = {}

  for (const q of curatedQuestions) {
    const filters = resolveFilters(q.filters)
    const inFilterSet = getFilteredConstituencyNumbers(filters)
    let rows = all.filter((r) => {
      if (!inFilterSet.has(r.constituency.constituencyNumber)) return false
      if (filters.result === "winners" && !r.isWinner) return false
      if (filters.result === "losers" && r.isWinner) return false
      if (filters.alliance && r.allianceCode !== filters.alliance) return false
      if (filters.party && r.party !== filters.party) return false
      return true
    })
    const signFilter = pickSignFilter(filters)
    if (signFilter) rows = rows.filter(signFilter)
    const top = sortCandidateRows(
      rows,
      filters.sort.column,
      filters.sort.dir
    ).slice(0, TOP_N)

    const topRows: TopRow[] = top.map((r, i) => {
      const m = extractMetric(r, filters.sort.column)
      return {
        rank: i + 1,
        ac: r.constituency.constituencyNumber,
        constituencyName: r.constituencyName,
        candidate: r.candidateDisplay,
        party: r.party,
        partyShort: short(r.party),
        alliance: r.allianceCode ?? "—",
        metricValue: m.value,
        metricRaw: m.raw,
      }
    })

    byQuestion[q.id] = {
      id: q.id,
      question: q.question,
      theme: q.tags.theme,
      party: q.tags.party,
      alliance: q.tags.alliance,
      metricLabel: metricLabel(filters.sort.column),
      rows: topRows,
    }

    for (const r of topRows) {
      ;(byAc[r.ac] ??= []).push({ id: q.id, rank: r.rank })
    }
  }

  return { byAc, byQuestion }
}
