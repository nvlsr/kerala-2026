import type { Filters } from "@/lib/filters"

export type QuestionParty =
  | "BJP"
  | "BDJS"
  | "INC"
  | "IUML"
  | "CPI(M)"
  | "CPI"

export type QuestionAlliance = "UDF" | "LDF" | "NDA"

export type QuestionTheme =
  | "vote-share"
  | "margins"
  | "margin-movement"
  | "multi-cycle"
  | "geographic"

export type CuratedQuestion = {
  id: string
  question: string
  filters: Partial<Filters>
  tags: {
    /** Party this card is about. Omit for cross-party / state-level cards. */
    party?: QuestionParty
    /** Alliance this card is about. A party-pill selection also surfaces the
     *  matching alliance's cards (e.g. clicking BJP shows NDA cards too). */
    alliance?: QuestionAlliance
    /** The dimension being measured. Direction (gains vs losses) is encoded
     *  in the filters' sort dir, not the tag — paired questions share a tag. */
    theme: QuestionTheme
  }
}

const ALLIANCE_FOR_PARTY: Record<QuestionParty, QuestionAlliance> = {
  BJP: "NDA",
  BDJS: "NDA",
  INC: "UDF",
  IUML: "UDF",
  "CPI(M)": "LDF",
  CPI: "LDF",
}

/** Which alliance a party belongs to. Drives the "BJP filter also shows
 *  NDA-level cards" behaviour on /questions. */
export function allianceForQuestionParty(party: QuestionParty): QuestionAlliance {
  return ALLIANCE_FOR_PARTY[party]
}

/**
 * Hand-picked questions worth answering with the dashboard. Each entry maps to
 * a card on /questions — the card renders the top-5 matching constituencies
 * plus the corresponding constituency-map view, and links to the full
 * dashboard pre-loaded with the same filters.
 *
 * Adding a new question: append a record. The `filters` field is the same
 * partial-Filters shape used by QuickView presets in src/lib/quick-views.ts.
 * Tag the card so the /questions filter bar can group it with related cards.
 */
export const curatedQuestions: CuratedQuestion[] = [
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
    id: "cpi-gains",
    question: "Where did CPI gain the most vote share, 2021 → 2026?",
    filters: {
      party: "Communist Party of India",
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    },
    tags: { party: "CPI", theme: "vote-share" },
  },
  {
    id: "cpi-declines",
    question: "Where did CPI lose the most vote share, 2021 → 2026?",
    filters: {
      party: "Communist Party of India",
      result: "all",
      sort: { column: "shareDelta", dir: "asc" },
    },
    tags: { party: "CPI", theme: "vote-share" },
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
    id: "plurality-winners",
    question: "Where did the winner take the smallest share of the vote?",
    filters: {
      result: "winners",
      sort: { column: "share", dir: "asc" },
    },
    tags: { theme: "margins" },
  },
  {
    id: "high-share-losers",
    question: "Which losing candidates took the biggest share of the vote?",
    filters: {
      result: "losers",
      sort: { column: "share", dir: "desc" },
    },
    tags: { theme: "margins" },
  },
  {
    id: "bjp-closest-wins",
    question: "Where did BJP win by the smallest margin?",
    filters: {
      party: "Bharatiya Janata Party",
      result: "winners",
      sort: { column: "margin", dir: "asc" },
    },
    tags: { party: "BJP", theme: "margins" },
  },
  {
    id: "bdjs-closest-wins",
    question: "Where did BDJS win by the smallest margin?",
    filters: {
      party: "Bharath Dharma Jana Sena",
      result: "winners",
      sort: { column: "margin", dir: "asc" },
    },
    tags: { party: "BDJS", theme: "margins" },
  },
  {
    id: "inc-closest-wins",
    question: "Where did INC win by the smallest margin?",
    filters: {
      party: "Indian National Congress",
      result: "winners",
      sort: { column: "margin", dir: "asc" },
    },
    tags: { party: "INC", theme: "margins" },
  },
  {
    id: "iuml-closest-wins",
    question: "Where did IUML win by the smallest margin?",
    filters: {
      party: "Indian Union Muslim League",
      result: "winners",
      sort: { column: "margin", dir: "asc" },
    },
    tags: { party: "IUML", theme: "margins" },
  },
  {
    id: "cpim-closest-wins",
    question: "Where did CPI(M) win by the smallest margin?",
    filters: {
      party: "Communist Party of India (Marxist)",
      result: "winners",
      sort: { column: "margin", dir: "asc" },
    },
    tags: { party: "CPI(M)", theme: "margins" },
  },
  {
    id: "cpi-closest-wins",
    question: "Where did CPI win by the smallest margin?",
    filters: {
      party: "Communist Party of India",
      result: "winners",
      sort: { column: "margin", dir: "asc" },
    },
    tags: { party: "CPI", theme: "margins" },
  },
  {
    id: "udf-gap-closers",
    question: "Where is UDF gaining ground in losing seats?",
    filters: {
      alliance: "UDF",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { alliance: "UDF", theme: "margin-movement" },
  },
  {
    id: "udf-at-risk-wins",
    question: "Where is UDF losing ground in winning seats?",
    filters: {
      alliance: "UDF",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { alliance: "UDF", theme: "margin-movement" },
  },
  {
    id: "ldf-gap-closers",
    question: "Where is LDF gaining ground in losing seats?",
    filters: {
      alliance: "LDF",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { alliance: "LDF", theme: "margin-movement" },
  },
  {
    id: "ldf-at-risk-wins",
    question: "Where is LDF losing ground in winning seats?",
    filters: {
      alliance: "LDF",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { alliance: "LDF", theme: "margin-movement" },
  },
  {
    id: "nda-gap-closers",
    question: "Where is NDA gaining ground in losing seats?",
    filters: {
      alliance: "NDA",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { alliance: "NDA", theme: "margin-movement" },
  },
  {
    id: "nda-at-risk-wins",
    question: "Where is NDA losing ground in winning seats?",
    filters: {
      alliance: "NDA",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { alliance: "NDA", theme: "margin-movement" },
  },
  {
    id: "statewide-gap-closers",
    question: "Across Kerala, where did losing candidates close the biggest gap?",
    filters: {
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { theme: "margin-movement" },
  },
  {
    id: "statewide-at-risk-wins",
    question: "Across Kerala, where did winning margins shrink the most?",
    filters: {
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { theme: "margin-movement" },
  },
  {
    id: "bjp-gap-closers",
    question: "Where is BJP gaining ground in losing seats?",
    filters: {
      party: "Bharatiya Janata Party",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { party: "BJP", theme: "margin-movement" },
  },
  {
    id: "bdjs-gap-closers",
    question: "Where is BDJS gaining ground in losing seats?",
    filters: {
      party: "Bharath Dharma Jana Sena",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { party: "BDJS", theme: "margin-movement" },
  },
  {
    id: "inc-gap-closers",
    question: "Where is INC gaining ground in losing seats?",
    filters: {
      party: "Indian National Congress",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { party: "INC", theme: "margin-movement" },
  },
  {
    id: "iuml-gap-closers",
    question: "Where is IUML gaining ground in losing seats?",
    filters: {
      party: "Indian Union Muslim League",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { party: "IUML", theme: "margin-movement" },
  },
  {
    id: "cpim-gap-closers",
    question: "Where is CPI(M) gaining ground in losing seats?",
    filters: {
      party: "Communist Party of India (Marxist)",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { party: "CPI(M)", theme: "margin-movement" },
  },
  {
    id: "cpi-gap-closers",
    question: "Where is CPI gaining ground in losing seats?",
    filters: {
      party: "Communist Party of India",
      result: "losers",
      sort: { column: "marginDelta", dir: "desc" },
    },
    tags: { party: "CPI", theme: "margin-movement" },
  },
  {
    id: "bjp-at-risk-wins",
    question: "Where is BJP losing ground in winning seats?",
    filters: {
      party: "Bharatiya Janata Party",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { party: "BJP", theme: "margin-movement" },
  },
  {
    id: "bdjs-at-risk-wins",
    question: "Where is BDJS losing ground in winning seats?",
    filters: {
      party: "Bharath Dharma Jana Sena",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { party: "BDJS", theme: "margin-movement" },
  },
  {
    id: "inc-at-risk-wins",
    question: "Where is INC losing ground in winning seats?",
    filters: {
      party: "Indian National Congress",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { party: "INC", theme: "margin-movement" },
  },
  {
    id: "iuml-at-risk-wins",
    question: "Where is IUML losing ground in winning seats?",
    filters: {
      party: "Indian Union Muslim League",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { party: "IUML", theme: "margin-movement" },
  },
  {
    id: "cpim-at-risk-wins",
    question: "Where is CPI(M) losing ground in winning seats?",
    filters: {
      party: "Communist Party of India (Marxist)",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { party: "CPI(M)", theme: "margin-movement" },
  },
  {
    id: "cpi-at-risk-wins",
    question: "Where is CPI losing ground in winning seats?",
    filters: {
      party: "Communist Party of India",
      result: "winners",
      sort: { column: "marginDelta", dir: "asc" },
    },
    tags: { party: "CPI", theme: "margin-movement" },
  },
]

/** Stable display order for party filter pills (grouped by alliance: NDA, UDF, LDF). */
const PARTY_ORDER: QuestionParty[] = [
  "BJP",
  "BDJS",
  "INC",
  "IUML",
  "CPI(M)",
  "CPI",
]

/** Stable display order for theme filter pills. */
const THEME_ORDER: QuestionTheme[] = [
  "vote-share",
  "margins",
  "margin-movement",
  "multi-cycle",
  "geographic",
]

const THEME_LABELS: Record<QuestionTheme, string> = {
  "vote-share": "Vote share",
  margins: "Margins",
  "margin-movement": "Margin movement",
  "multi-cycle": "Multi-cycle",
  geographic: "Geographic",
}

export function themeLabel(theme: QuestionTheme): string {
  return THEME_LABELS[theme]
}

/** Parties that appear in at least one curated question, in stable order. */
export function getAvailableParties(): QuestionParty[] {
  const present = new Set<QuestionParty>()
  for (const i of curatedQuestions) {
    if (i.tags.party) present.add(i.tags.party)
  }
  return PARTY_ORDER.filter((p) => present.has(p))
}

/** Themes that appear in at least one curated question, in stable order. */
export function getAvailableThemes(): QuestionTheme[] {
  const present = new Set<QuestionTheme>()
  for (const i of curatedQuestions) present.add(i.tags.theme)
  return THEME_ORDER.filter((t) => present.has(t))
}
