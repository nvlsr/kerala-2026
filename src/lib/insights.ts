import type { Filters } from "@/lib/filters"

export type InsightChip = {
  id: string
  label: string
  description: string
  preset: Partial<Filters>
}

const FEATURED_PARTIES: Array<{ canonical: string; short: string }> = [
  { canonical: "Indian National Congress", short: "INC" },
  { canonical: "Communist Party of India (Marxist)", short: "CPI(M)" },
  { canonical: "Indian Union Muslim League", short: "IUML" },
  { canonical: "Bharatiya Janata Party", short: "BJP" },
]

const closestWins: InsightChip = {
  id: "closest-wins",
  label: "Closest wins",
  description: "Seats won by the smallest margin (winner over runner-up).",
  preset: {
    alliance: null,
    party: null,
    seat: null,
    result: "winners",
    sort: { column: "margin", dir: "asc" },
  },
}

const closestLosses: InsightChip = {
  id: "closest-losses",
  label: "Closest losses",
  description: "Losing candidates with the smallest deficit behind the winner.",
  preset: {
    alliance: null,
    party: null,
    seat: null,
    result: "losers",
    sort: { column: "margin", dir: "desc" },
  },
}

function biggestGainsFor(p: {
  canonical: string
  short: string
}): InsightChip {
  return {
    id: `biggest-gains-${p.short}`,
    label: `${p.short} gains`,
    description: `Constituencies where ${p.short}'s 2026 vote share grew the most over 2021.`,
    preset: {
      alliance: null,
      party: p.canonical,
      seat: null,
      result: "all",
      sort: { column: "shareDelta", dir: "desc" },
    },
  }
}

function biggestDeclinesFor(p: {
  canonical: string
  short: string
}): InsightChip {
  return {
    id: `biggest-declines-${p.short}`,
    label: `${p.short} declines`,
    description: `Constituencies where ${p.short}'s 2026 vote share fell the most below 2021.`,
    preset: {
      alliance: null,
      party: p.canonical,
      seat: null,
      result: "all",
      sort: { column: "shareDelta", dir: "asc" },
    },
  }
}

export const insightChips: InsightChip[] = [
  closestWins,
  closestLosses,
  ...FEATURED_PARTIES.map(biggestGainsFor),
  ...FEATURED_PARTIES.map(biggestDeclinesFor),
]
