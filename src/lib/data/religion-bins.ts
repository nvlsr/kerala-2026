import { acDemo2025Meta } from "@/lib/data/loaders"
import type { ReligionMix } from "@/lib/filters"

/**
 * Set of AC numbers whose 2025-projected religion mix falls in the
 * named bin. Bin definitions are duplicated in the `ReligionMix` doc
 * comment for discoverability — keep the two in sync.
 *
 *   muslim-majority      Muslim ≥ 60%
 *   muslim-heavy         40 ≤ Muslim < 60
 *   christian-majority   Christian ≥ 50%
 *   christian-heavy      30 ≤ Christian < 50
 *   hindu-heavy          Hindu ≥ 70%
 *
 * The 2025 projection is the default baseline (see docs/data-pipeline.md).
 * Choosing the raw 2011 base instead would shift bin assignments by a
 * handful of borderline ACs but otherwise leave the membership lists
 * identical — the bins are coarse enough that uniform multipliers
 * don't change them materially.
 */
export function getACsInReligionMix(mix: ReligionMix): Set<number> {
  const result = new Set<number>()
  for (const [acStr, ac] of Object.entries(acDemo2025Meta.constituencies)) {
    const r = ac.religions
    const acNum = Number(acStr)
    if (mix === "muslim-majority" && r.muslim >= 60) {
      result.add(acNum)
    } else if (mix === "muslim-heavy" && r.muslim >= 40 && r.muslim < 60) {
      result.add(acNum)
    } else if (mix === "christian-majority" && r.christian >= 50) {
      result.add(acNum)
    } else if (
      mix === "christian-heavy" &&
      r.christian >= 30 &&
      r.christian < 50
    ) {
      result.add(acNum)
    } else if (mix === "hindu-heavy" && r.hindu >= 70) {
      result.add(acNum)
    }
  }
  return result
}
