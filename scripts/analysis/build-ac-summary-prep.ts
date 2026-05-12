/**
 * Builds data/temp/ac-summary-prep.json — the compact joined view
 * of all source layers needed to hand-compose the narrative
 * summaries in data/ac-summaries.json.
 *
 * The summaries themselves are hand-written prose (140 of them,
 * ~80-120 words each). This script does NOT regenerate the prose;
 * it regenerates the *input table* a human (or LLM) reads when
 * composing or auditing them.
 *
 * Sources joined per AC:
 *   - data/community-relevance.json — driver, durability, alliance
 *     roles matrix, NDA trajectory, sub-rite tags
 *   - data/hereditary-seats.json — family lineage for the 6
 *     confirmed hereditary seats
 *   - src/pages/walkthroughs/nda-data.ts — NDA cohort memberships
 *     (mature-grower, declining-mature, strategic-abstention,
 *     structural-exclusion, wave-capture) parsed as text
 *
 * Use this when:
 *   - Upstream data refreshed (e.g. community-relevance pipeline
 *     re-run) and you need to audit which summaries are now stale
 *   - Drafting a new summary or revising an existing one
 *   - Verifying a factual claim in an existing summary
 *
 * Run: bun run scripts/analysis/build-ac-summary-prep.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..", "..")

type CommunityRelevanceRecord = {
  ac: number
  name: string
  district: string
  winner: string
  margin: number
  primaryDriver: string
  confidence: string
  durabilityCategory: string
  stableFor: string | null
  ndaTrend: string
  ndaShareTrajectory: { y2016: number; y2021: number; y2026: number }
  history: { y2016: string; y2021: string; y2026: string }
  christian: {
    aggregateShare: number
    aggregateTag: string | null
    coordination: string | null
    subRites: Array<{
      name: string
      share: number
      tier: string
      direction: string
      tag: string | null
    }>
  }
  muslim: {
    aggregateShare: number
    aggregateTag: string | null
    subType: string | null
  }
  hindu: {
    profile: string | null
    nair: number
    ezhava: number
    sc: number
  }
  allianceRoles: {
    UDF: { flipTo: string | null; blockFrom: string | null }
    LDF: { flipTo: string | null; blockFrom: string | null }
    NDA: { flipTo: string | null; blockFrom: string | null }
  }
  winnerCandidateReligion?: string | null
}

type HereditarySeat = {
  ac: number
  name: string
  family: Array<{ displayName: string }>
}

type PrepRecord = {
  ac: number
  name: string
  dist: string
  winner: string
  margin: number
  driver: string
  conf: string
  durab: string
  stableFor: string | null
  cAgg: number
  cTag: string | null
  cCoord: string | null
  cSubRites: string
  mAgg: number
  mTag: string | null
  mSub: string | null
  hProf: string | null
  nair: number
  ezhava: number
  sc: number
  hist: string
  nda: string
  ndaTrend: string
  blockUDF: string | null
  blockLDF: string | null
  blockNDA: string | null
  flipUDF: string | null
  flipLDF: string | null
  flipNDA: string | null
  cohorts: string
  hereditary: string
  winnerRel: string | null
}

const COHORT_LABELS: Record<string, string> = {
  COHORT_3_ROWS: "mature-grower",
  COHORT_4A_ROWS: "declining-mature",
  COHORT_5A_ROWS: "strategic-abstention",
  COHORT_5B_ROWS: "structural-exclusion",
  COHORT_6_ROWS: "wave-capture",
}

function parseNdaCohorts(): Map<number, string[]> {
  const ndaText = readFileSync(
    resolve(ROOT, "src/pages/walkthroughs/nda-data.ts"),
    "utf-8"
  )
  const byAc = new Map<number, string[]>()
  for (const [varName, label] of Object.entries(COHORT_LABELS)) {
    const match = ndaText.match(
      new RegExp(`export const ${varName}.*?= \\[([\\s\\S]*?)\\]`)
    )
    if (!match) continue
    const acs = [...match[1].matchAll(/ac:\s*(\d+)/g)].map((m) =>
      Number(m[1])
    )
    for (const ac of acs) {
      const existing = byAc.get(ac) ?? []
      existing.push(label)
      byAc.set(ac, existing)
    }
  }
  return byAc
}

function shortSubRiteName(name: string): string {
  return name.length >= 3 ? name.slice(0, 3) : name
}

function formatSubRites(
  subRites: CommunityRelevanceRecord["christian"]["subRites"]
): string {
  const tagged = subRites.filter((s) => s.tag)
  if (tagged.length === 0) return "-"
  return tagged
    .map((s) =>
      `${shortSubRiteName(s.name)}${Math.round(s.share)}%/${s.tier}/${s.direction}`
    )
    .join("|")
}

function main() {
  const crRaw = JSON.parse(
    readFileSync(resolve(ROOT, "data/community-relevance.json"), "utf-8")
  ) as CommunityRelevanceRecord[] | { records: CommunityRelevanceRecord[] }
  const crRecords: CommunityRelevanceRecord[] = Array.isArray(crRaw)
    ? crRaw
    : crRaw.records

  const heredRaw = JSON.parse(
    readFileSync(resolve(ROOT, "data/hereditary-seats.json"), "utf-8")
  ) as { seats: HereditarySeat[] }
  const heredByAc = new Map(heredRaw.seats.map((s) => [s.ac, s]))

  const cohortsByAc = parseNdaCohorts()

  const rows: PrepRecord[] = crRecords.map((r) => {
    const hered = heredByAc.get(r.ac)
    const heredTag = hered
      ? ` HER:[${hered.family.map((m) => m.displayName).join(" → ")}]`
      : ""
    const cohorts = cohortsByAc.get(r.ac) ?? []
    return {
      ac: r.ac,
      name: r.name,
      dist: r.district,
      winner: r.winner,
      margin: r.margin,
      driver: r.primaryDriver,
      conf: r.confidence,
      durab: r.durabilityCategory,
      stableFor: r.stableFor,
      cAgg: r.christian.aggregateShare,
      cTag: r.christian.aggregateTag,
      cCoord: r.christian.coordination,
      cSubRites: formatSubRites(r.christian.subRites),
      mAgg: r.muslim.aggregateShare,
      mTag: r.muslim.aggregateTag,
      mSub: r.muslim.subType,
      hProf: r.hindu.profile,
      nair: r.hindu.nair,
      ezhava: r.hindu.ezhava,
      sc: r.hindu.sc,
      hist: `${r.history.y2016}>${r.history.y2021}>${r.history.y2026}`,
      nda: `${Math.round(r.ndaShareTrajectory.y2016)}>${Math.round(r.ndaShareTrajectory.y2021)}>${Math.round(r.ndaShareTrajectory.y2026)}`,
      ndaTrend: r.ndaTrend,
      blockUDF: r.allianceRoles.UDF.blockFrom,
      blockLDF: r.allianceRoles.LDF.blockFrom,
      blockNDA: r.allianceRoles.NDA.blockFrom,
      flipUDF: r.allianceRoles.UDF.flipTo,
      flipLDF: r.allianceRoles.LDF.flipTo,
      flipNDA: r.allianceRoles.NDA.flipTo,
      cohorts: cohorts.length ? cohorts.join(",") : "-",
      hereditary: heredTag,
      winnerRel: r.winnerCandidateReligion ?? null,
    }
  })

  rows.sort((a, b) => a.ac - b.ac)

  const outPath = resolve(ROOT, "data/temp/ac-summary-prep.json")
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, JSON.stringify(rows, null, 1))
  console.log(`Wrote ${rows.length} compact records to data/temp/ac-summary-prep.json`)
}

main()
