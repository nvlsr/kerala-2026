import { describe, expect, test } from "vitest"

import {
  COHORT_VOTER_SHARE_THRESHOLD,
  COHORT_YEAR,
  getDominantChristianSubRite,
  getDominantMuslimSubRite,
  getReligiousSignatureForAC,
  getSubRiteVoterShare,
  getVoterShareBreakdown,
  religiousPOIs,
} from "@/lib/data/religious-pois"
import {
  acsByChristianSubRite,
  christianCohortSizes,
  christianSubRiteCohortFor,
  muslimCohortSizes,
  muslimSubRiteCohortFor,
} from "@/lib/data/subrite-bins"

// Reference AC numbers (canonical primary names from
// data/ac-names.json — keep this stable across renames).
const AC = {
  Pala: 93,
  Kochi: 80,
  Thiruvalla: 111,
  Manjeri: 37,
  Vamanapuram: 131,
  Udma: 3,
} as const

function acNumber(name: keyof typeof AC): number {
  return AC[name]
}

describe("religious-pois — inventory shape", () => {
  test("inventory covers all 140 ACs", () => {
    expect(religiousPOIs).toHaveLength(140)
    const ids = new Set(religiousPOIs.map((r) => r.ac_id))
    expect(ids.size).toBe(140)
  })
})

describe("religious-pois — voter-share metric", () => {
  test("Pala is Syro-Malabar dominant with high voter share", () => {
    const ac = acNumber("Pala")
    const b = getVoterShareBreakdown(ac, "christian", "syro_malabar", 2025)
    expect(b).not.toBeNull()
    // Pala is Syro-Malabar heartland; ≥30% est. voters is expected.
    expect(b!.voterSharePct).toBeGreaterThan(30)
    expect(b!.classifiedCount).toBeGreaterThan(20)
  })

  test("Udma Latin Catholic share is small-sample (low voter share)", () => {
    const ac = acNumber("Udma")
    const share = getSubRiteVoterShare(ac, "christian", "latin_catholic", 2025)
    expect(share).not.toBeNull()
    // Was 100% in raw share; voter-share metric should drop it well
    // under 15%.
    expect(share!).toBeLessThan(15)
  })

  test("Kochi Latin Catholic is genuinely dominant by voter share", () => {
    const ac = acNumber("Kochi")
    const share = getSubRiteVoterShare(ac, "christian", "latin_catholic", 2025)
    expect(share!).toBeGreaterThan(25)
  })
})

describe("religious-pois — dominant sub-rite accessors", () => {
  test("Pala dominant Christian = syro_malabar", () => {
    expect(getDominantChristianSubRite(acNumber("Pala"))).toBe("syro_malabar")
  })

  test("Kochi dominant Christian = latin_catholic", () => {
    expect(getDominantChristianSubRite(acNumber("Kochi"))).toBe(
      "latin_catholic"
    )
  })

  test("Thiruvalla dominant Christian = indian_orthodox", () => {
    // Tiruvalla AC: Niranam/Parumala Orthodox dominance over Marthoma.
    expect(getDominantChristianSubRite(acNumber("Thiruvalla"))).toBe(
      "indian_orthodox"
    )
  })

  test("Manjeri dominant Muslim = sunni", () => {
    expect(getDominantMuslimSubRite(acNumber("Manjeri"))).toBe("sunni")
  })

  test("Hindu-majority interior AC has no dominant Christian", () => {
    // Vamanapuram is ~85% Hindu — Christians are too few for any
    // sub-rite to clear the 5% threshold.
    expect(getDominantChristianSubRite(acNumber("Vamanapuram"))).toBeNull()
  })
})

describe("religious-pois — full signature", () => {
  test("Pala signature has Christian dominant + Muslim absent", () => {
    const sig = getReligiousSignatureForAC(acNumber("Pala"))
    expect(sig).not.toBeNull()
    expect(sig!.religionPopPct.christian).toBeGreaterThan(40)
    expect(sig!.christian.dominant?.code).toBe("syro_malabar")
    // Muslim share in Pala is tiny — no cohort assignment.
    expect(sig!.muslim.dominant).toBeNull()
  })

  test("classified-N drives confidence flag", () => {
    const sig = getReligiousSignatureForAC(acNumber("Pala"))
    expect(sig!.christian.confidence).toBe("high")
    // Small Muslim presence in Pala means few classified Muslim POIs.
    // Could be "none" or "low" depending on tag richness — assert
    // it's not "high".
    expect(sig!.muslim.confidence).not.toBe("high")
  })

  test("year switch changes religion shares but not OSM sub-rite mix", () => {
    const sig2025 = getReligiousSignatureForAC(acNumber("Pala"), 2025)
    const sig2011 = getReligiousSignatureForAC(acNumber("Pala"), 2011)
    expect(sig2011!.religionPopPct.christian).not.toBe(
      sig2025!.religionPopPct.christian
    )
    // Dominant sub-rite is determined by the same OSM POIs in either
    // year, but the voter-share % shifts with the religion-share
    // multiplier — the LABEL should be stable.
    expect(sig2025!.christian.dominant?.code).toBe(
      sig2011!.christian.dominant?.code
    )
  })
})

describe("subrite-bins — cohort assignment", () => {
  test("every AC gets exactly one Christian cohort", () => {
    let total = 0
    for (const v of christianCohortSizes().values()) total += v
    expect(total).toBe(140)
  })

  test("every AC gets exactly one Muslim cohort", () => {
    let total = 0
    for (const v of muslimCohortSizes().values()) total += v
    expect(total).toBe(140)
  })

  test("Pala is in syro_malabar Christian cohort", () => {
    expect(christianSubRiteCohortFor(acNumber("Pala"))).toBe("syro_malabar")
    expect(acsByChristianSubRite("syro_malabar").has(acNumber("Pala"))).toBe(
      true
    )
  })

  test("Kochi is in latin_catholic Christian cohort", () => {
    expect(christianSubRiteCohortFor(acNumber("Kochi"))).toBe("latin_catholic")
  })

  test("Manjeri is in sunni Muslim cohort", () => {
    expect(muslimSubRiteCohortFor(acNumber("Manjeri"))).toBe("sunni")
  })

  test("Vamanapuram falls into 'below_threshold' for both religions", () => {
    expect(christianSubRiteCohortFor(acNumber("Vamanapuram"))).toBe(
      "below_threshold"
    )
    expect(muslimSubRiteCohortFor(acNumber("Vamanapuram"))).toBe(
      "below_threshold"
    )
  })

  test("cohort sizes match expectations after the N≥3 gate", () => {
    // After the MIN_CLASSIFIED_FOR_COHORT=3 gate (filters out N=1/2
    // small-sample artefacts where the few classified POIs happen to
    // all share a sub-rite — most common in Muslim-minority ACs).
    const c = christianCohortSizes()
    expect(c.get("syro_malabar")).toBe(31)
    expect(c.get("latin_catholic")).toBe(28)
    expect(c.get("indian_orthodox")).toBe(10)
    expect(c.get("below_threshold")).toBe(61)

    const m = muslimCohortSizes()
    expect(m.get("sunni")).toBe(48)
    expect(m.get("salafi_mujahid")).toBe(14)
    expect(m.get("below_threshold")).toBe(78)
  })
})

describe("religious-pois — constants", () => {
  test("locked year is 2025", () => {
    expect(COHORT_YEAR).toBe(2025)
  })
  test("voter-share threshold is 5%", () => {
    expect(COHORT_VOTER_SHARE_THRESHOLD).toBe(5)
  })
})
