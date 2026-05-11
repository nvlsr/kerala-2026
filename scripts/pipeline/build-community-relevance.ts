/**
 * Phase 3 — Build per-AC community-relevance records.
 *
 * Reads:
 *   - data/ac-religion-2025.json + data/ac-religion.json (Christian/Muslim shares)
 *   - data/ac-religious-pois.json (Christian sub-rite voter shares)
 *   - data/district-hindu-castes.json (Hindu sub-caste district profile)
 *   - data/community-belts.json (Muslim sub-type via district belt)
 *   - data/results-2026.json (margins + winners)
 *   - data/ac-history.json (2021 winners for durable flag)
 *   - src/pages/walkthroughs/udf-data.ts:CHRISTIAN_BELT_36 (winner candidate religion)
 *
 * Writes:
 *   - data/community-relevance.json (compact, one record per AC, 140 total)
 *
 * Framework documented in docs/community-relevance.md.
 * Run: bun run scripts/pipeline/build-community-relevance.ts
 */
import { religiousPOIs, getVoterShareBreakdown, COHORT_YEAR } from "@/lib/data/religious-pois"
import { constituencies, type Candidate } from "@/lib/data/constituencies"
import { acDemo2025Meta, districtsMeta, casteByDistrictMeta, beltsMeta } from "@/lib/data/loaders"
import { CHRISTIAN_BELT_36 } from "@/pages/walkthroughs/udf-data"
import { loadHistorical } from "../_lib/load"
import { saveJson } from "../_lib/save"

// ── Constants ─────────────────────────────────────────────────────────

const PRESENCE_THRESHOLD = 5            // ≥5% voter-share to be considered "present"
const PLAUSIBLE_SWING = 25              // pp — knee of threshold sensitivity (validated)
const BLOCKING_SHARE = 20               // ≥20% to be "blocking" if not decisive
const NEAR_MARGIN = 7                   // ≤7pp = decisive (capacity-relevant for 2026)
const HINDU_PATH_MARGIN = 12            // margin within which Hindu-driven flip-to is credible

const CSR = [
  "latin_catholic","syro_malabar","syro_malankara","knanaya_catholic",
  "marthoma","indian_orthodox","jacobite_syrian","knanaya_jacobite",
  "csi","pentecostal","brethren","other_christian",
] as const

type ChristianSubrite = typeof CSR[number]

const SUBRITE_DIRECTION: Record<ChristianSubrite, "UDF-up" | "NDA-leaning" | "T20-mixed"> = {
  latin_catholic:"UDF-up", syro_malabar:"UDF-up", syro_malankara:"UDF-up", knanaya_catholic:"UDF-up",
  marthoma:"UDF-up", indian_orthodox:"UDF-up", jacobite_syrian:"T20-mixed", knanaya_jacobite:"UDF-up",
  csi:"NDA-leaning", pentecostal:"UDF-up", brethren:"UDF-up", other_christian:"UDF-up",
}

// Pulled from CHRISTIAN_BELT_36 — extend with Malappuram inference (all Muslim) below.
const CANDIDATE_RELIGION_OVERRIDES: Record<number, "Christian" | "Hindu" | "Muslim"> = {}
for (const row of CHRISTIAN_BELT_36) {
  CANDIDATE_RELIGION_OVERRIDES[row.ac] = row.candidateReligion as any
}
// Malappuram non-reserved ACs — IUML/INC/etc all field Muslim candidates per
// walkthroughs/udf-data.ts § Malappuram strategy. Inferred religion = Muslim.
for (const acNum of [38, 39, 40, 41, 42, 43, 44, 45, 46, 48, 50, 51]) {
  if (!(acNum in CANDIDATE_RELIGION_OVERRIDES)) CANDIDATE_RELIGION_OVERRIDES[acNum] = "Muslim"
}

// ── Types ─────────────────────────────────────────────────────────────

type Tag = "decisive" | "blocking" | "latent"
type Tier = "HIGH" | "MEDIUM" | "LOW"
type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER"
type Coordination = "single" | "coordinated" | "fractured"

interface SubRite {
  name: ChristianSubrite
  share: number
  tag: Tag | null
  tier: Tier | null
  direction: "UDF-up" | "NDA-leaning" | "T20-mixed"
}

interface AllianceRoleCell {
  flipTo: string | null
  blockFrom: string | null
}

interface CommunityRelevanceRecord {
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
    subRites: SubRite[]
    coordination: Coordination | null
  }
  muslim: {
    aggregateShare: number
    aggregateTag: Tag | null
    aggregateTier: Tier | null
    subType: "iuml-stronghold" | "mixed-muslim" | "mixed-muslim-wayanad" | "cosmopolitan"
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
  durable: boolean | null

  allianceRoles: {
    UDF: AllianceRoleCell
    LDF: AllianceRoleCell
    NDA: AllianceRoleCell
  }

  note: string
}

// ── Helpers ───────────────────────────────────────────────────────────

function tierAndTag(
  presence: number,
  requiredSwing: number,
  hasFallback: boolean
): { tier: Tier | null; tag: Tag | null } {
  if (presence < PRESENCE_THRESHOLD) return { tier: null, tag: null }
  if (requiredSwing <= PLAUSIBLE_SWING) {
    let tier: Tier
    if (presence >= 12 && requiredSwing <= 15 && !hasFallback) tier = "HIGH"
    else if (presence >= 8 && requiredSwing <= 20) tier = "MEDIUM"
    else tier = "LOW"
    return { tier, tag: "decisive" }
  }
  if (presence >= BLOCKING_SHARE) {
    const tier: Tier = (presence >= 25 && !hasFallback) ? "HIGH" : "MEDIUM"
    return { tier, tag: "blocking" }
  }
  return { tier: "LOW", tag: "latent" }
}

function hinduProfile(districtId: string) {
  const c = casteByDistrictMeta.districts[districtId]
  if (!c) return { profile: "unknown", nair: 0, ezhava: 0, sc: 0 }
  const { nair, ezhava, sc } = c
  let profile: string
  if (districtId === "wayanad") profile = "sc-st-heavy"
  else if (nair >= 35) profile = "nair-heavy"
  else if (ezhava >= 50) profile = "ezhava-very-heavy"
  else if (ezhava >= 40) profile = "ezhava-heavy"
  else if (nair >= 25 && ezhava >= 25) profile = "mixed-nair-ezhava"
  else if (ezhava >= 30) profile = "mixed-ezhava-leaning"
  else profile = "mixed-fragmented"
  return { profile, nair, ezhava, sc }
}

function muslimSubType(districtId: string): CommunityRelevanceRecord["muslim"]["subType"] {
  if (districtId === "wayanad") return "mixed-muslim-wayanad"
  const b = beltsMeta.districtToBelt[districtId]
  if (b === "northern-muslim") return "iuml-stronghold"
  if (b === "northern-mixed") return "mixed-muslim"
  return "cosmopolitan"
}

function determineCoordination(
  subRites: SubRite[]
): Coordination | null {
  // Loosened rule: fractured when CSI present at ≥5% AND any UDF-up sub-rite
  // present at ≥5%, regardless of whether they cross the tier threshold.
  const csiPresent = subRites.find(s => s.direction === "NDA-leaning" && s.share >= 5)
  const udfUpPresent = subRites.find(
    s => (s.direction === "UDF-up" || s.direction === "T20-mixed") && s.share >= 5
  )
  if (csiPresent && udfUpPresent) return "fractured"

  const relevant = subRites.filter(s => s.tag === "decisive" || s.tag === "blocking")
  if (relevant.length === 0) return null
  if (relevant.length === 1) return "single"
  // Multiple tagged — all same direction (since fractured handled above)
  return "coordinated"
}

// ── Alliance roles rule encoder ───────────────────────────────────────

/**
 * Compute the 6-cell alliance_roles matrix for an AC, given its
 * relevant communities. Sparse by design — most cells are null.
 *
 * Rules are conservative: leave blank when ambiguous.
 */
function computeAllianceRoles(args: {
  winner: AllianceCode
  margin: number
  cAggShare: number
  cAggTag: Tag | null
  cIsDecisive: boolean
  cIsBlocking: boolean
  cIsRelevant: boolean
  coordination: Coordination | null
  hasCSI: boolean
  mAggShare: number
  mIsDecisive: boolean
  mIsBlocking: boolean
  mIsRelevant: boolean
  mSubType: CommunityRelevanceRecord["muslim"]["subType"]
  hinduProf: string
  ezhavaPct: number
  nairPct: number
}): CommunityRelevanceRecord["allianceRoles"] {
  const r: CommunityRelevanceRecord["allianceRoles"] = {
    UDF: { flipTo: null, blockFrom: null },
    LDF: { flipTo: null, blockFrom: null },
    NDA: { flipTo: null, blockFrom: null },
  }
  const margin = args.margin
  const W = args.winner

  // ── block-NDA: structural Muslim/Christian blocks (durable, alliance-agnostic to winner)
  if (args.mAggShare >= 25) {
    r.NDA.blockFrom = `Muslim community @${args.mAggShare.toFixed(0)}% (mechanically blocks Hindu-only NDA path)`
  } else if (args.cIsBlocking && args.coordination !== "fractured" && args.cAggShare >= 20) {
    r.NDA.blockFrom = `Christian community @${args.cAggShare.toFixed(0)}% (UDF-aligned, blocks NDA)`
  } else if (args.cAggShare >= 15 && args.mAggShare >= 15 && args.coordination !== "fractured") {
    r.NDA.blockFrom = `Christian + Muslim combined @${(args.cAggShare + args.mAggShare).toFixed(0)}% (minority coalition blocks NDA)`
  }

  // ── block-UDF / block-LDF when not the winner
  if (W !== "UDF") {
    if (args.hinduProf === "ezhava-very-heavy" && W === "LDF" && margin > NEAR_MARGIN) {
      r.UDF.blockFrom = `Ezhava-Tiyya LDF base (${args.ezhavaPct.toFixed(0)}% Ezhava in district) + LDF organisational strength`
    } else if (W === "NDA" && args.hinduProf === "nair-heavy") {
      r.UDF.blockFrom = `Hindu Nair NDA-curious vote (${args.nairPct.toFixed(0)}% Nair in district) + organised BJP`
    } else if (W === "LDF" && args.mAggShare >= 25) {
      r.UDF.blockFrom = `LDF-aligned coalition (Muslim @${args.mAggShare.toFixed(0)}% + Hindu base)`
    } else if (W === "LDF" && args.cIsRelevant && args.coordination !== "fractured") {
      r.UDF.blockFrom = `Christian + LDF-aligned community (CPI(M) organisational strength)`
    }
  }

  if (W !== "LDF") {
    if (W === "UDF" && args.cIsRelevant && args.coordination !== "fractured") {
      r.LDF.blockFrom = `Christian community @${args.cAggShare.toFixed(0)}% (UDF-aligned in 2026)`
    } else if (W === "UDF" && args.mAggShare >= 25) {
      r.LDF.blockFrom = `Muslim community @${args.mAggShare.toFixed(0)}% (UDF-aligned)`
    } else if (W === "NDA" && args.hinduProf === "nair-heavy") {
      r.LDF.blockFrom = `Hindu Nair NDA-curious vote + organised BJP`
    }
  }

  // ── flip-to-WINNER: who delivered 2026?
  if (Math.abs(margin) <= NEAR_MARGIN) {
    if (W === "UDF") {
      if (args.cIsDecisive && args.coordination !== "fractured") {
        const subRiteSummary = args.coordination === "coordinated"
          ? "Christian community (coordinated sub-rites, all UDF-up)"
          : "Christian community"
        r.UDF.flipTo = subRiteSummary
      } else if (args.mIsDecisive) {
        r.UDF.flipTo = `Muslim community @${args.mAggShare.toFixed(0)}% (large UDF-aligned)`
      }
    } else if (W === "LDF") {
      if (args.mIsDecisive) {
        r.LDF.flipTo = `Muslim community @${args.mAggShare.toFixed(0)}% (LDF-aligned segment) + LDF Hindu base`
      } else if (args.cIsDecisive && args.coordination !== "fractured") {
        r.LDF.flipTo = `LDF organisational strength + Christian aligned segment`
      } else if (args.hinduProf === "ezhava-very-heavy") {
        r.LDF.flipTo = `Ezhava-Tiyya base (${args.ezhavaPct.toFixed(0)}% Ezhava in district)`
      }
    } else if (W === "NDA") {
      if (args.coordination === "fractured" || args.hasCSI) {
        r.NDA.flipTo = `Hindu Nair consolidation (${args.nairPct.toFixed(0)}% Nair) + CSI Christian segment + strong BJP candidate`
      } else if (args.hinduProf === "nair-heavy") {
        r.NDA.flipTo = `Hindu Nair consolidation (${args.nairPct.toFixed(0)}% Nair) + strong BJP candidate`
      } else {
        r.NDA.flipTo = `Hindu vote consolidation + strong BJP candidate`
      }
    }
  }

  // ── flip-to-RUNNER_UP: only if margin very close and a credible swing path exists
  if (Math.abs(margin) <= 5) {
    if (W === "UDF") {
      if (args.mIsDecisive && args.mSubType !== "iuml-stronghold") {
        r.LDF.flipTo = `Muslim community swing-back + LDF Hindu base (historical alternation)`
      } else if (args.hinduProf === "ezhava-very-heavy") {
        r.LDF.flipTo = `Ezhava-Tiyya base if Christian/Muslim return to LDF`
      }
    } else if (W === "LDF") {
      if (args.mIsDecisive) {
        r.UDF.flipTo = `Muslim community @${args.mAggShare.toFixed(0)}% (UDF-aligned in mixed-muslim cohort)`
      } else if (args.cIsDecisive && args.coordination !== "fractured") {
        r.UDF.flipTo = `Christian community @${args.cAggShare.toFixed(0)}% if it consolidates UDF`
      }
    } else if (W === "NDA") {
      // NDA marginal wins — what could flip the seat back?
      if (args.cAggShare >= 15 && !args.hasCSI) {
        r.UDF.flipTo = `Christian community @${args.cAggShare.toFixed(0)}% if it consolidates UDF (no CSI fragmentation here)`
      } else if (args.cAggShare >= 15 && args.coordination === "fractured") {
        r.UDF.flipTo = `Christian community would need to overcome CSI NDA-lean to consolidate UDF`
      }
    }
  }

  // ── flip-to-NDA: credible BJP paths in non-NDA-winning ACs
  if (W !== "NDA") {
    if (args.hinduProf === "nair-heavy" && Math.abs(margin) <= HINDU_PATH_MARGIN
        && args.mAggShare < 25 && !(args.cIsRelevant && args.coordination === "coordinated")) {
      r.NDA.flipTo = `Hindu Nair consolidation (${args.nairPct.toFixed(0)}% Nair) + CSI Christian if present`
    }
  }

  return r
}

// ── Note assembly ─────────────────────────────────────────────────────

function assembleNote(args: {
  cIsRelevant: boolean
  relevantSubs: SubRite[]
  cAggShare: number
  cAggTag: Tag | null
  coordination: Coordination | null
  hasCSI: boolean
  mIsRelevant: boolean
  mAggShare: number
  mSubType: CommunityRelevanceRecord["muslim"]["subType"]
  primaryDriver: string
  hinduProf: string
  nairPct: number
  ezhavaPct: number
}): string {
  const parts: string[] = []
  if (args.cIsRelevant) {
    const subList = args.relevantSubs.map(s => `${s.name}@${s.share.toFixed(0)}%`).join("+")
    if (subList) parts.push(`Christian: ${subList} [${args.coordination}]`)
    else if (args.cAggTag) {
      const fracNote = args.coordination === "fractured" ? "FRACTURED" : "dispersed"
      parts.push(`Aggregate Christian @${args.cAggShare.toFixed(0)}% [${fracNote}]`)
    }
  } else if (args.coordination === "fractured" && args.hasCSI) {
    parts.push(`Christian aggregate @${args.cAggShare.toFixed(0)}% — FRACTURED (CSI NDA-leaning + UDF-up sub-rites cancel)`)
  }
  if (args.mIsRelevant) parts.push(`Muslim @${args.mAggShare.toFixed(0)}% [${args.mSubType}]`)
  if (args.primaryDriver === "hindu-district") {
    parts.push(`Hindu ${args.hinduProf} (Nair ${args.nairPct.toFixed(0)}%, Ezhava ${args.ezhavaPct.toFixed(0)}% in district)`)
  } else if (["nair-heavy","ezhava-very-heavy","sc-st-heavy"].includes(args.hinduProf)) {
    parts.push(`Hindu context: ${args.hinduProf} district`)
  }
  if (parts.length === 0) parts.push("No identified relevant community")
  return parts.join(" + ")
}

// ── Main build ────────────────────────────────────────────────────────

const acMargin = new Map<number, number>()
const acWinner = new Map<number, AllianceCode>()
for (const c of constituencies) {
  const total = c.candidates.reduce((s, x) => s + x.votes, 0)
  if (!total) continue
  const sorted = [...c.candidates].sort((a: Candidate, b: Candidate) => b.votes - a.votes)
  acMargin.set(c.constituencyNumber, ((sorted[0].votes - sorted[1].votes) / total) * 100)
  acWinner.set(c.constituencyNumber, sorted[0].alliance as AllianceCode)
}

// 2021 winners — for durable flag
const historical = loadHistorical()
const ac2021Winner = new Map<number, AllianceCode>()
for (const [acNum, h] of historical.entries()) {
  const e2021 = h.elections.find(e => e.year === 2021 && e.type === "general")
  if (!e2021) continue
  const sorted = [...e2021.candidates].sort((a, b) => b.votes - a.votes)
  if (sorted[0]) ac2021Winner.set(acNum, sorted[0].alliance as AllianceCode)
}

const TIER_RANK: Record<Tier, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 }
const records: CommunityRelevanceRecord[] = []

for (const c of constituencies) {
  const margin = acMargin.get(c.constituencyNumber)
  if (margin == null) continue
  const winner = acWinner.get(c.constituencyNumber)!
  const districtId = districtsMeta.constituencyToDistrict[String(c.constituencyNumber)]
  const demo = acDemo2025Meta.constituencies[String(c.constituencyNumber)]
  const hasFallback = demo?.source !== "shrug-c01-aggregated"

  const cAggShare = demo?.religions.christian ?? 0
  const cAggR = tierAndTag(cAggShare, margin / (cAggShare / 100), hasFallback)

  const subRites: SubRite[] = []
  for (const sr of CSR) {
    const b = getVoterShareBreakdown(c.constituencyNumber, "christian", sr, COHORT_YEAR)
    if (!b || b.voterSharePct < PRESENCE_THRESHOLD) continue
    const res = tierAndTag(b.voterSharePct, margin / (b.voterSharePct / 100), hasFallback)
    subRites.push({
      name: sr, share: b.voterSharePct, tag: res.tag, tier: res.tier,
      direction: SUBRITE_DIRECTION[sr],
    })
  }
  subRites.sort((a, b) => b.share - a.share)
  const coordination = determineCoordination(subRites)
  const hasCSI = subRites.some(s => s.direction === "NDA-leaning" && s.share >= 5)

  const mAggShare = demo?.religions.muslim ?? 0
  const mAggR = tierAndTag(mAggShare, margin / (mAggShare / 100), hasFallback)
  const mSubType = muslimSubType(districtId)

  const hindu = hinduProfile(districtId)

  const cIsDecisive = cAggR.tag === "decisive" || subRites.some(s => s.tag === "decisive")
  const cIsBlocking = cAggR.tag === "blocking" || subRites.some(s => s.tag === "blocking")
  const cIsRelevant = cIsDecisive || cIsBlocking
  const mIsDecisive = mAggR.tag === "decisive"
  const mIsBlocking = mAggR.tag === "blocking"
  const mIsRelevant = mIsDecisive || mIsBlocking

  // Primary driver
  let primaryDriver: string
  if (cIsRelevant && mIsRelevant) primaryDriver = "both-christian-muslim"
  else if (cIsRelevant) {
    const hasSub = subRites.some(s => s.tag === "decisive" || s.tag === "blocking")
    primaryDriver = hasSub ? "christian-subrite" : "christian-aggregate"
  } else if (mIsRelevant) primaryDriver = "muslim"
  else if (["nair-heavy","ezhava-very-heavy","sc-st-heavy"].includes(hindu.profile)) primaryDriver = "hindu-district"
  else primaryDriver = "diffuse"

  // Net tag
  let netTag: Tag | "hindu-driven" | "diffuse"
  if (cIsDecisive || mIsDecisive) netTag = "decisive"
  else if (cIsBlocking || mIsBlocking) netTag = "blocking"
  else if (primaryDriver === "hindu-district") netTag = "hindu-driven"
  else netTag = "diffuse"

  // Confidence
  let confidence: Tier | "UNKNOWN"
  if (primaryDriver === "diffuse") confidence = "UNKNOWN"
  else if (primaryDriver === "hindu-district") confidence = "LOW"
  else {
    const tiers: Tier[] = []
    if (cAggR.tier && (cAggR.tag === "decisive" || cAggR.tag === "blocking")) tiers.push(cAggR.tier)
    for (const s of subRites) if (s.tier && (s.tag === "decisive" || s.tag === "blocking")) tiers.push(s.tier)
    if (mAggR.tier && (mAggR.tag === "decisive" || mAggR.tag === "blocking")) tiers.push(mAggR.tier)
    confidence = tiers.length > 0 ? tiers.reduce((acc, t) => TIER_RANK[t] > TIER_RANK[acc] ? t : acc, "LOW" as Tier) : "LOW"
  }

  // Durable flag — 2026 winner same as 2021 winner?
  const w2021 = ac2021Winner.get(c.constituencyNumber)
  let durable: boolean | null
  if (!w2021 || w2021 === "OTHER") durable = null
  else durable = winner === w2021

  // Alliance roles
  const allianceRoles = computeAllianceRoles({
    winner, margin, cAggShare, cAggTag: cAggR.tag,
    cIsDecisive, cIsBlocking, cIsRelevant, coordination, hasCSI,
    mAggShare, mIsDecisive, mIsBlocking, mIsRelevant, mSubType,
    hinduProf: hindu.profile, ezhavaPct: hindu.ezhava, nairPct: hindu.nair,
  })

  const relevantSubs = subRites.filter(s => s.tag === "decisive" || s.tag === "blocking")
  const note = assembleNote({
    cIsRelevant, relevantSubs, cAggShare, cAggTag: cAggR.tag, coordination, hasCSI,
    mIsRelevant, mAggShare, mSubType, primaryDriver,
    hinduProf: hindu.profile, nairPct: hindu.nair, ezhavaPct: hindu.ezhava,
  })

  records.push({
    ac: c.constituencyNumber, name: c.constituencyName, district: districtId,
    margin, winner,
    winnerCandidateReligion: CANDIDATE_RELIGION_OVERRIDES[c.constituencyNumber] ?? null,
    christian: {
      aggregateShare: cAggShare, aggregateTag: cAggR.tag, aggregateTier: cAggR.tier,
      subRites, coordination,
    },
    muslim: {
      aggregateShare: mAggShare, aggregateTag: mAggR.tag, aggregateTier: mAggR.tier,
      subType: mSubType,
    },
    hindu,
    primaryDriver, confidence, netTag, durable,
    allianceRoles, note,
  })
}

records.sort((a, b) => a.ac - b.ac)
saveJson("data/community-relevance.json", records)

// ── Summary stats ─────────────────────────────────────────────────────

console.log(`Wrote data/community-relevance.json (${records.length} records)`)
console.log("")
const byDriver = new Map<string, number>()
const byConf = new Map<string, number>()
const byTag = new Map<string, number>()
const byCoord = new Map<string, number>()
let durableTrue = 0, durableFalse = 0, durableNull = 0
let withCandReligion = 0
for (const r of records) {
  byDriver.set(r.primaryDriver, (byDriver.get(r.primaryDriver) ?? 0) + 1)
  byConf.set(r.confidence, (byConf.get(r.confidence) ?? 0) + 1)
  byTag.set(r.netTag, (byTag.get(r.netTag) ?? 0) + 1)
  const co = r.christian.coordination ?? "none"
  byCoord.set(co, (byCoord.get(co) ?? 0) + 1)
  if (r.durable === true) durableTrue++
  else if (r.durable === false) durableFalse++
  else durableNull++
  if (r.winnerCandidateReligion) withCandReligion++
}
console.log("By driver:", Object.fromEntries(byDriver))
console.log("By confidence:", Object.fromEntries(byConf))
console.log("By net tag:", Object.fromEntries(byTag))
console.log("By coordination:", Object.fromEntries(byCoord))
console.log(`Durable: true=${durableTrue} false=${durableFalse} null=${durableNull}`)
console.log(`With winner-candidate-religion: ${withCandReligion}`)
console.log("")

// Spot-check the 5 reality-check ACs
console.log("=== Reality-check spot tests ===")
for (const acNum of [12, 28, 52, 102, 135]) {
  const r = records.find(rec => rec.ac === acNum)
  if (!r) continue
  console.log(`\nAC ${acNum} ${r.name} [${r.confidence}/${r.netTag}/durable=${r.durable}]`)
  console.log(`  Note: ${r.note}`)
  console.log(`  Alliance roles:`)
  for (const a of ["UDF","LDF","NDA"] as const) {
    const cell = r.allianceRoles[a]
    if (cell.flipTo) console.log(`    flip-to-${a}: ${cell.flipTo}`)
    if (cell.blockFrom) console.log(`    block-${a}:   ${cell.blockFrom}`)
  }
}
