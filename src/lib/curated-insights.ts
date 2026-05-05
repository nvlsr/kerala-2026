import type { Filters } from "@/lib/filters"

export type CuratedInsight = {
  id: string
  question: string
  filters: Partial<Filters>
}

/**
 * Hand-picked questions worth answering with the dashboard. Each entry maps to
 * a card on /insights — the card renders the top-5 matching constituencies
 * plus the corresponding constituency-map view, and links to the full
 * dashboard pre-loaded with the same filters.
 *
 * Adding a new insight: append a record. The `filters` field is the same
 * partial-Filters shape used by InsightChip presets in src/lib/insights.ts.
 */
export const curatedInsights: CuratedInsight[] = [
  {
    id: "bjp-gains",
    question: "Where did BJP gain the most vote share, 2021 → 2026?",
    filters: {
      party: "Bharatiya Janata Party",
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    },
  },
  {
    id: "bjp-declines",
    question: "Where did BJP lose the most vote share, 2021 → 2026?",
    filters: {
      party: "Bharatiya Janata Party",
      result: "all",
      sort: { column: "shareDelta", dir: "asc" },
    },
  },
  {
    id: "inc-gains",
    question: "Where did INC gain the most vote share, 2021 → 2026?",
    filters: {
      party: "Indian National Congress",
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    },
  },
  {
    id: "inc-declines",
    question: "Where did INC lose the most vote share, 2021 → 2026?",
    filters: {
      party: "Indian National Congress",
      result: "all",
      sort: { column: "shareDelta", dir: "asc" },
    },
  },
  {
    id: "iuml-gains",
    question: "Where did IUML gain the most vote share, 2021 → 2026?",
    filters: {
      party: "Indian Union Muslim League",
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    },
  },
  {
    id: "iuml-declines",
    question: "Did IUML lose vote share in any seats?",
    filters: {
      party: "Indian Union Muslim League",
      result: "all",
      sort: { column: "shareDelta", dir: "asc" },
    },
  },
  {
    id: "cpim-gains",
    question: "Did CPI(M) gain vote share in any seats?",
    filters: {
      party: "Communist Party of India (Marxist)",
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    },
  },
  {
    id: "cpim-declines",
    question: "Where did CPI(M) lose the most vote share, 2021 → 2026?",
    filters: {
      party: "Communist Party of India (Marxist)",
      result: "all",
      sort: { column: "shareDelta", dir: "asc" },
    },
  },
]
