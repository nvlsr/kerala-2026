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
]
