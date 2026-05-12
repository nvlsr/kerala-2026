import { acSummaries, type AcSummary } from "@/lib/data/loaders"

export type { AcSummary }

export function getSummaryForAC(constituencyNumber: number): AcSummary | null {
  return acSummaries[constituencyNumber] ?? null
}
