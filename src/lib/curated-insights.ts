import type { Filters } from "@/lib/filters"

export type InsightParty = "BJP" | "BDJS" | "INC" | "IUML" | "CPI(M)"

export type InsightTheme =
  | "vote-share"
  | "margins"
  | "margin-movement"
  | "multi-cycle"
  | "geographic"

export type CuratedInsight = {
  id: string
  question: string
  filters: Partial<Filters>
  tags: {
    /** Party this card is about. Omit for cross-party / state-level cards. */
    party?: InsightParty
    /** The dimension being measured. Direction (gains vs losses) is encoded
     *  in the filters' sort dir, not the tag — paired questions share a tag. */
    theme: InsightTheme
  }
}

/**
 * Hand-picked questions worth answering with the dashboard. Each entry maps to
 * a card on /insights — the card renders the top-5 matching constituencies
 * plus the corresponding constituency-map view, and links to the full
 * dashboard pre-loaded with the same filters.
 *
 * Adding a new insight: append a record. The `filters` field is the same
 * partial-Filters shape used by InsightChip presets in src/lib/insights.ts.
 * Tag the card so the /insights filter bar can group it with related cards.
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
    tags: { party: "BJP", theme: "vote-share" },
  },
  {
    id: "bjp-declines",
    question: "Where did BJP lose the most vote share, 2021 → 2026?",
    filters: {
      party: "Bharatiya Janata Party",
      result: "all",
      sort: { column: "shareDelta", dir: "asc" },
    },
    tags: { party: "BJP", theme: "vote-share" },
  },
  {
    id: "bdjs-gains",
    question: "Where did BDJS gain the most vote share, 2021 → 2026?",
    filters: {
      party: "Bharath Dharma Jana Sena",
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    },
    tags: { party: "BDJS", theme: "vote-share" },
  },
  {
    id: "bdjs-declines",
    question: "Did BDJS lose vote share in any seats?",
    filters: {
      party: "Bharath Dharma Jana Sena",
      result: "all",
      sort: { column: "shareDelta", dir: "asc" },
    },
    tags: { party: "BDJS", theme: "vote-share" },
  },
  {
    id: "inc-gains",
    question: "Where did INC gain the most vote share, 2021 → 2026?",
    filters: {
      party: "Indian National Congress",
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    },
    tags: { party: "INC", theme: "vote-share" },
  },
  {
    id: "inc-declines",
    question: "Where did INC lose the most vote share, 2021 → 2026?",
    filters: {
      party: "Indian National Congress",
      result: "all",
      sort: { column: "shareDelta", dir: "asc" },
    },
    tags: { party: "INC", theme: "vote-share" },
  },
  {
    id: "iuml-gains",
    question: "Where did IUML gain the most vote share, 2021 → 2026?",
    filters: {
      party: "Indian Union Muslim League",
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    },
    tags: { party: "IUML", theme: "vote-share" },
  },
  {
    id: "iuml-declines",
    question: "Did IUML lose vote share in any seats?",
    filters: {
      party: "Indian Union Muslim League",
      result: "all",
      sort: { column: "shareDelta", dir: "asc" },
    },
    tags: { party: "IUML", theme: "vote-share" },
  },
  {
    id: "cpim-gains",
    question: "Did CPI(M) gain vote share in any seats?",
    filters: {
      party: "Communist Party of India (Marxist)",
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    },
    tags: { party: "CPI(M)", theme: "vote-share" },
  },
  {
    id: "cpim-declines",
    question: "Where did CPI(M) lose the most vote share, 2021 → 2026?",
    filters: {
      party: "Communist Party of India (Marxist)",
      result: "all",
      sort: { column: "shareDelta", dir: "asc" },
    },
    tags: { party: "CPI(M)", theme: "vote-share" },
  },
  {
    id: "closest-2026-contests",
    question: "What were the closest 2026 contests?",
    filters: {
      result: "winners",
      sort: { column: "margin", dir: "asc" },
    },
    tags: { theme: "margins" },
  },
  {
    id: "biggest-2026-blowouts",
    question: "Where were the biggest 2026 blowouts?",
    filters: {
      result: "winners",
      sort: { column: "margin", dir: "desc" },
    },
    tags: { theme: "margins" },
  },
  {
    id: "udf-gap-closers",
    question: "Where is UDF gaining ground in losing seats?",
    filters: {
      alliance: "UDF",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { theme: "margin-movement" },
  },
  {
    id: "udf-at-risk-wins",
    question: "Where is UDF losing ground in winning seats?",
    filters: {
      alliance: "UDF",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { theme: "margin-movement" },
  },
  {
    id: "ldf-gap-closers",
    question: "Where is LDF gaining ground in losing seats?",
    filters: {
      alliance: "LDF",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { theme: "margin-movement" },
  },
  {
    id: "ldf-at-risk-wins",
    question: "Where is LDF losing ground in winning seats?",
    filters: {
      alliance: "LDF",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { theme: "margin-movement" },
  },
  {
    id: "nda-gap-closers",
    question: "Where is NDA gaining ground in losing seats?",
    filters: {
      alliance: "NDA",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { theme: "margin-movement" },
  },
  {
    id: "nda-at-risk-wins",
    question: "Where is NDA losing ground in winning seats?",
    filters: {
      alliance: "NDA",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { theme: "margin-movement" },
  },
]

/** Stable display order for party filter pills (grouped by alliance: NDA, UDF, LDF). */
const PARTY_ORDER: InsightParty[] = ["BJP", "BDJS", "INC", "IUML", "CPI(M)"]

/** Stable display order for theme filter pills. */
const THEME_ORDER: InsightTheme[] = [
  "vote-share",
  "margins",
  "margin-movement",
  "multi-cycle",
  "geographic",
]

const THEME_LABELS: Record<InsightTheme, string> = {
  "vote-share": "Vote share",
  margins: "Margins",
  "margin-movement": "Margin movement",
  "multi-cycle": "Multi-cycle",
  geographic: "Geographic",
}

export function themeLabel(theme: InsightTheme): string {
  return THEME_LABELS[theme]
}

/** Parties that appear in at least one curated insight, in stable order. */
export function getAvailableParties(): InsightParty[] {
  const present = new Set<InsightParty>()
  for (const i of curatedInsights) {
    if (i.tags.party) present.add(i.tags.party)
  }
  return PARTY_ORDER.filter((p) => present.has(p))
}

/** Themes that appear in at least one curated insight, in stable order. */
export function getAvailableThemes(): InsightTheme[] {
  const present = new Set<InsightTheme>()
  for (const i of curatedInsights) present.add(i.tags.theme)
  return THEME_ORDER.filter((t) => present.has(t))
}
