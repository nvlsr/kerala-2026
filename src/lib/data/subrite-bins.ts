/**
 * Sub-rite cohort layer: groups ACs by dominant Christian or Muslim
 * sub-rite for cross-cutting analysis (cohort × margin, cohort ×
 * swing, walkthrough sectioning).
 *
 * Mirrors the pattern of `religion-bins.ts` — exposes AC sets per
 * cohort + a metadata array for chart legends and walkthrough section
 * iteration.
 *
 * Cohort assignment uses `COHORT_YEAR` (2025 projection) and the
 * `COHORT_VOTER_SHARE_THRESHOLD` (5% of voters) defined in
 * `religious-pois.ts`. ACs where no sub-rite reaches the threshold get
 * no cohort assignment (the "below threshold" residual is its own
 * named cohort for symmetry with the visualisation).
 */

import {
  CHRISTIAN_SUBRITE_COLORS,
  MUSLIM_SUBRITE_COLORS,
} from "@/components/walkthroughs/colors"
import {
  COHORT_VOTER_SHARE_THRESHOLD,
  COHORT_YEAR,
  getDominantChristianSubRite,
  getDominantMuslimSubRite,
  religiousPOIs,
  type ChristianDenomination,
  type MuslimDenomination,
} from "@/lib/data/religious-pois"

// ── Cohort metadata ──────────────────────────────────────────────────
// Order is the canonical display order in legends + walkthrough
// sections. Includes the "below threshold" pseudo-cohort.

export type ChristianSubRiteCohort = ChristianDenomination | "below_threshold"
export type MuslimSubRiteCohort = MuslimDenomination | "below_threshold"

export const CHRISTIAN_SUBRITE_COHORTS: Array<{
  code: ChristianSubRiteCohort
  label: string
  color: string
}> = [
  {
    code: "latin_catholic",
    label: "Latin Catholic",
    color: CHRISTIAN_SUBRITE_COLORS.latin_catholic!,
  },
  {
    code: "syro_malabar",
    label: "Syro-Malabar",
    color: CHRISTIAN_SUBRITE_COLORS.syro_malabar!,
  },
  {
    code: "syro_malankara",
    label: "Syro-Malankara",
    color: CHRISTIAN_SUBRITE_COLORS.syro_malankara!,
  },
  {
    code: "knanaya_catholic",
    label: "Knanaya Catholic",
    color: CHRISTIAN_SUBRITE_COLORS.knanaya_catholic!,
  },
  {
    code: "marthoma",
    label: "Marthoma",
    color: CHRISTIAN_SUBRITE_COLORS.marthoma!,
  },
  {
    code: "indian_orthodox",
    label: "Indian Orthodox",
    color: CHRISTIAN_SUBRITE_COLORS.indian_orthodox!,
  },
  {
    code: "jacobite_syrian",
    label: "Jacobite Syrian",
    color: CHRISTIAN_SUBRITE_COLORS.jacobite_syrian!,
  },
  { code: "csi", label: "CSI", color: CHRISTIAN_SUBRITE_COLORS.csi! },
  {
    code: "pentecostal",
    label: "Pentecostal",
    color: CHRISTIAN_SUBRITE_COLORS.pentecostal!,
  },
  {
    code: "below_threshold",
    label: "No consequential Christian sub-rite",
    color: "#E5E7EB",
  },
]

export const MUSLIM_SUBRITE_COHORTS: Array<{
  code: MuslimSubRiteCohort
  label: string
  color: string
}> = [
  { code: "sunni", label: "Sunni", color: MUSLIM_SUBRITE_COLORS.sunni! },
  {
    code: "salafi_mujahid",
    label: "Salafi / Mujahid",
    color: MUSLIM_SUBRITE_COLORS.salafi_mujahid!,
  },
  {
    code: "jamaat_islami",
    label: "Jamaat-e-Islami",
    color: MUSLIM_SUBRITE_COLORS.jamaat_islami!,
  },
  {
    code: "ahmadiyya",
    label: "Ahmadiyya",
    color: MUSLIM_SUBRITE_COLORS.ahmadiyya!,
  },
  {
    code: "below_threshold",
    label: "No consequential Muslim sub-rite",
    color: "#E5E7EB",
  },
]

// ── Per-AC cohort assignment ────────────────────────────────────────
// These are the single-AC accessors callers will use most often.

/**
 * Christian sub-rite cohort for an AC. Returns the dominant sub-rite
 * if it clears `COHORT_VOTER_SHARE_THRESHOLD`, otherwise the residual
 * `"below_threshold"` cohort. Never returns null — every AC belongs
 * to exactly one cohort.
 */
export function christianSubRiteCohortFor(
  acNumber: number
): ChristianSubRiteCohort {
  return getDominantChristianSubRite(acNumber, COHORT_YEAR) ?? "below_threshold"
}

export function muslimSubRiteCohortFor(
  acNumber: number
): MuslimSubRiteCohort {
  return getDominantMuslimSubRite(acNumber, COHORT_YEAR) ?? "below_threshold"
}

// ── Cohort → AC set ─────────────────────────────────────────────────
// Built once at module load. Mirrors the religion-bins.ts pattern of
// "give me the AC numbers in this cohort".

const christianCohortByAc = new Map<number, ChristianSubRiteCohort>()
const muslimCohortByAc = new Map<number, MuslimSubRiteCohort>()
const christianAcsByCohort = new Map<ChristianSubRiteCohort, Set<number>>()
const muslimAcsByCohort = new Map<MuslimSubRiteCohort, Set<number>>()

for (const ac of religiousPOIs) {
  const c = christianSubRiteCohortFor(ac.ac_id)
  christianCohortByAc.set(ac.ac_id, c)
  if (!christianAcsByCohort.has(c)) christianAcsByCohort.set(c, new Set())
  christianAcsByCohort.get(c)!.add(ac.ac_id)

  const m = muslimSubRiteCohortFor(ac.ac_id)
  muslimCohortByAc.set(ac.ac_id, m)
  if (!muslimAcsByCohort.has(m)) muslimAcsByCohort.set(m, new Set())
  muslimAcsByCohort.get(m)!.add(ac.ac_id)
}

/** AC numbers in a given Christian sub-rite cohort. */
export function acsByChristianSubRite(
  cohort: ChristianSubRiteCohort
): Set<number> {
  return christianAcsByCohort.get(cohort) ?? new Set()
}

export function acsByMuslimSubRite(
  cohort: MuslimSubRiteCohort
): Set<number> {
  return muslimAcsByCohort.get(cohort) ?? new Set()
}

/** Map of cohort → AC count, for legends + cohort-distribution tables. */
export function christianCohortSizes(): Map<ChristianSubRiteCohort, number> {
  const m = new Map<ChristianSubRiteCohort, number>()
  for (const [c, set] of christianAcsByCohort) m.set(c, set.size)
  return m
}

export function muslimCohortSizes(): Map<MuslimSubRiteCohort, number> {
  const m = new Map<MuslimSubRiteCohort, number>()
  for (const [c, set] of muslimAcsByCohort) m.set(c, set.size)
  return m
}

// ── Re-export thresholds + locked year (single source of truth) ────
export { COHORT_VOTER_SHARE_THRESHOLD, COHORT_YEAR }
