/**
 * Per-AC community-relevance records.
 *
 * Loaded from `data/community-relevance.json` (built by
 * `scripts/pipeline/build-community-relevance.ts`).
 *
 * Each record describes the politically-relevant communities at an AC:
 * Christian sub-rites + aggregate, Muslim with sub-type, Hindu sub-caste
 * district overlay. Plus a 6-cell `allianceRoles` matrix describing how
 * each alliance flips or blocks the seat.
 *
 * Framework documentation: `docs/community-relevance.md`.
 */
import communityRelevanceJson from "@data/community-relevance.json"

import type { AllianceCode } from "@/lib/data/alliances"

export type Tag = "decisive" | "blocking" | "latent"
export type Tier = "HIGH" | "MEDIUM" | "LOW"
export type Coordination = "single" | "coordinated" | "fractured"

export type ChristianSubrite =
  | "latin_catholic"
  | "syro_malabar"
  | "syro_malankara"
  | "knanaya_catholic"
  | "marthoma"
  | "indian_orthodox"
  | "jacobite_syrian"
  | "knanaya_jacobite"
  | "csi"
  | "pentecostal"
  | "brethren"
  | "other_christian"

export type MuslimSubType =
  | "iuml-stronghold"
  | "mixed-muslim"
  | "mixed-muslim-wayanad"
  | "cosmopolitan"

export type SubRiteEntry = {
  name: ChristianSubrite
  share: number
  tag: Tag | null
  tier: Tier | null
  direction: "UDF-up" | "NDA-leaning" | "T20-mixed"
}

export type AllianceRoleCell = {
  flipTo: string | null
  blockFrom: string | null
}

/**
 * 3-cycle durability of the WINNER alliance (past stability).
 *
 * Distinct from `stableFor`, which is the *forward-looking* structural
 * reading derived from blocker cells.
 */
export type DurabilityCategory =
  | "always-UDF" | "always-LDF" | "always-NDA"
  | "udf-since-2021" | "ldf-since-2021" | "nda-since-2021"
  | "flipped-2026"
  | "other"

export type CommunityRelevanceRecord = {
  ac: number
  name: string
  district: string
  margin: number
  winner: AllianceCode
  winnerCandidateReligion: "Christian" | "Hindu" | "Muslim" | null

  christian: {
    aggregateShare: number
    aggregateTag: Tag | null
    aggregateTier: Tier | null
    subRites: SubRiteEntry[]
    coordination: Coordination | null
  }
  muslim: {
    aggregateShare: number
    aggregateTag: Tag | null
    aggregateTier: Tier | null
    subType: MuslimSubType
  }
  hindu: {
    profile: string
    nair: number
    ezhava: number
    sc: number
  }

  primaryDriver: string
  confidence: Tier | "UNKNOWN"
  netTag: Tag | "hindu-driven" | "diffuse"

  /** PAST stability — alliance winners across 3 cycles. */
  history: {
    y2016: AllianceCode | null
    y2021: AllianceCode | null
    y2026: AllianceCode
  }
  /** Categorical past-stability reading. */
  durabilityCategory: DurabilityCategory

  /**
   * FORWARD stability — which alliance is structurally favoured
   * regardless of cycle, derived from the blocker pattern.
   * Set when the other two alliances both have structural blockers
   * and this alliance has none.
   */
  stableFor: AllianceCode | null

  allianceRoles: {
    UDF: AllianceRoleCell
    LDF: AllianceRoleCell
    NDA: AllianceRoleCell
  }

  note: string
}

const records = communityRelevanceJson as unknown as CommunityRelevanceRecord[]
const byAc = new Map<number, CommunityRelevanceRecord>(
  records.map((r) => [r.ac, r])
)

/** All 140 per-AC records, in AC-number order. */
export const communityRelevance: readonly CommunityRelevanceRecord[] = records

/** Lookup a single AC's record. Returns undefined for invalid AC numbers. */
export function getCommunityRelevance(
  acNumber: number
): CommunityRelevanceRecord | undefined {
  return byAc.get(acNumber)
}
