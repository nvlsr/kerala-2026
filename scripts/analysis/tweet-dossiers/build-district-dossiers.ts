/**
 * Phase 3 builder: generates one markdown dossier per Kerala district (14).
 *
 * Output: twitter-responses/data/districts/<slug>.md
 *
 * Each district is largely an aggregation of its member ACs plus
 * district-level religion + Hindu sub-caste data. No new source data;
 * everything joins from existing files.
 *
 * Usage:
 *   bun run scripts/analysis/tweet-dossiers/build-district-dossiers.ts
 *   bun run scripts/analysis/tweet-dossiers/build-district-dossiers.ts --district thiruvananthapuram
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import results2026 from "../../../data/results-2026.json"
import history from "../../../data/ac-history.json"
import names from "../../../data/ac-names.json"
import districtsFile from "../../../data/districts.json"
import reservations from "../../../data/reservations.json"
import districtReligion from "../../../data/district-religion.json"
import districtHinduCastes from "../../../data/district-hindu-castes.json"
import alliancesMeta from "../../../data/alliances.json"
import communityRelevance from "../../../data/community-relevance.json"
import communityBelts from "../../../data/community-belts.json"

import { replayAllQuestions, type QuestionTopList } from "./lib/replay-questions"
import { buildCanonicalNameMap, displayName } from "./lib/canonical-names"

const PROJECT_ROOT = resolve(__dirname, "..", "..", "..")
const OUT_DIR = resolve(PROJECT_ROOT, "twitter-responses", "data", "districts")

const partyToAlliance: Record<string, string> = (alliancesMeta as any).partyToAlliance
const acToDistrict: Record<string, string> = (districtsFile as any).constituencyToDistrict
const acToReservation: Record<string, string> =
  (reservations as any).constituencyToReservation ?? {}
const districtToBelt: Record<string, string> = (communityBelts as any).districtToBelt

let canonicalNameMap: Map<string, string> = new Map()
const display = (raw: string) => displayName(canonicalNameMap, raw)

// ─── shared helpers ──────────────────────────────────────────────────────────

function fmtPct(x: number | null | undefined, digits = 2): string {
  if (x == null) return "—"
  return x.toFixed(digits)
}

function fmtSignedPp(x: number | null | undefined, digits = 2): string {
  if (x == null) return "—"
  return `${x >= 0 ? "+" : ""}${x.toFixed(digits)}`
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function padAc(ac: number): string {
  return String(ac).padStart(3, "0")
}

function titleCaseDistrict(slug: string): string {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
}

function getAllianceFor(party: string): string {
  return partyToAlliance[party] ?? "OTHER"
}

// ─── district inventory ──────────────────────────────────────────────────────

function buildDistrictToAcMap(): Map<string, number[]> {
  const m: Map<string, number[]> = new Map()
  for (const [acStr, d] of Object.entries(acToDistrict)) {
    if (!m.has(d)) m.set(d, [])
    m.get(d)!.push(Number(acStr))
  }
  for (const arr of m.values()) arr.sort((a, b) => a - b)
  return m
}

// ─── per-AC share computation for a given cycle ──────────────────────────────

type CycleAlliance = { NDA: number; LDF: number; UDF: number }

function perAcSharesAndWinner(
  ac: number,
  cycle: 2011 | 2016 | 2021 | 2026
): {
  shares: CycleAlliance
  winnerAlliance: string
  winnerName: string
  winnerParty: string
  marginPct: number
  totalPolled: number
  ndaVotes: number
  ldfVotes: number
  udfVotes: number
} | null {
  const acStr = String(ac)

  if (cycle === 2026) {
    const r = (results2026 as any)[acStr]
    if (!r) return null
    const cands = r.candidates as { name: string; party: string; votes: number }[]
    let totalPolled = 0,
      ndaVotes = 0,
      ldfVotes = 0,
      udfVotes = 0
    for (const c of cands) {
      totalPolled += c.votes
      const al = getAllianceFor(c.party)
      if (al === "NDA") ndaVotes += c.votes
      if (al === "LDF") ldfVotes += c.votes
      if (al === "UDF") udfVotes += c.votes
    }
    const sorted = [...cands].sort((a, b) => b.votes - a.votes)
    const winner = sorted[0]
    const runner = sorted[1]
    const marginPct =
      totalPolled === 0 ? 0 : ((winner.votes - (runner?.votes ?? 0)) / totalPolled) * 100
    return {
      shares: {
        NDA: (ndaVotes / totalPolled) * 100,
        LDF: (ldfVotes / totalPolled) * 100,
        UDF: (udfVotes / totalPolled) * 100,
      },
      winnerAlliance: getAllianceFor(winner.party),
      winnerName: winner.name,
      winnerParty: winner.party,
      marginPct,
      totalPolled,
      ndaVotes,
      ldfVotes,
      udfVotes,
    }
  }

  const ev = (history as any)[acStr]?.elections.find(
    (e: any) => e.year === cycle && e.type === "general"
  )
  if (!ev) return null
  const cands = ev.candidates as Array<{
    name: string
    party: string
    votes: number
    alliance: string
  }>
  let totalPolled = 0,
    ndaVotes = 0,
    ldfVotes = 0,
    udfVotes = 0
  for (const c of cands) {
    totalPolled += c.votes
    if (c.alliance === "NDA") ndaVotes += c.votes
    if (c.alliance === "LDF") ldfVotes += c.votes
    if (c.alliance === "UDF") udfVotes += c.votes
  }
  const sorted = [...cands].sort((a, b) => b.votes - a.votes)
  const winner = sorted[0]
  const runner = sorted[1]
  return {
    shares: {
      NDA: (ndaVotes / totalPolled) * 100,
      LDF: (ldfVotes / totalPolled) * 100,
      UDF: (udfVotes / totalPolled) * 100,
    },
    winnerAlliance: winner.alliance,
    winnerName: winner.name,
    winnerParty: winner.party,
    marginPct: ev.marginPct ?? 0,
    totalPolled,
    ndaVotes,
    ldfVotes,
    udfVotes,
  }
}

// ─── district aggregate per cycle ────────────────────────────────────────────

type DistrictAggregate = {
  totalPolled: number
  ndaVotes: number
  ldfVotes: number
  udfVotes: number
  shareEci: CycleAlliance
  shareMajor: CycleAlliance
  wins: { NDA: number; LDF: number; UDF: number; OTHER: number }
}

function districtAggregate(acs: number[], cycle: 2011 | 2016 | 2021 | 2026): DistrictAggregate {
  let totalPolled = 0,
    ndaVotes = 0,
    ldfVotes = 0,
    udfVotes = 0
  const wins = { NDA: 0, LDF: 0, UDF: 0, OTHER: 0 } as DistrictAggregate["wins"]
  for (const ac of acs) {
    const r = perAcSharesAndWinner(ac, cycle)
    if (!r) continue
    totalPolled += r.totalPolled
    ndaVotes += r.ndaVotes
    ldfVotes += r.ldfVotes
    udfVotes += r.udfVotes
    if (r.winnerAlliance in wins) wins[r.winnerAlliance as keyof typeof wins]++
    else wins.OTHER++
  }
  const majorTotal = ndaVotes + ldfVotes + udfVotes
  return {
    totalPolled,
    ndaVotes,
    ldfVotes,
    udfVotes,
    shareEci: {
      NDA: totalPolled === 0 ? 0 : (ndaVotes / totalPolled) * 100,
      LDF: totalPolled === 0 ? 0 : (ldfVotes / totalPolled) * 100,
      UDF: totalPolled === 0 ? 0 : (udfVotes / totalPolled) * 100,
    },
    shareMajor: {
      NDA: majorTotal === 0 ? 0 : (ndaVotes / majorTotal) * 100,
      LDF: majorTotal === 0 ? 0 : (ldfVotes / majorTotal) * 100,
      UDF: majorTotal === 0 ? 0 : (udfVotes / majorTotal) * 100,
    },
    wins,
  }
}

// ─── rendering ───────────────────────────────────────────────────────────────

function renderFrontmatter(ctx: any): string {
  const lines: string[] = ["---"]
  lines.push(`type: district`)
  lines.push(`key: ${ctx.slug}`)
  lines.push(`slug: district-${ctx.slug}`)
  lines.push(`name: ${ctx.name}`)
  lines.push(`belt: ${ctx.belt ?? ""}`)
  lines.push(`ac_count: ${ctx.acs.length}`)
  lines.push("")
  lines.push(`ac_count_won_by_alliance:`)
  for (const a of ["NDA", "UDF", "LDF", "OTHER"] as const) {
    lines.push(`  ${a}: ${ctx.aggregates[2026].wins[a]}`)
  }
  lines.push("")
  lines.push(`vote_share_eci_2026:`)
  lines.push(`  NDA: ${fmtPct(ctx.aggregates[2026].shareEci.NDA)}`)
  lines.push(`  LDF: ${fmtPct(ctx.aggregates[2026].shareEci.LDF)}`)
  lines.push(`  UDF: ${fmtPct(ctx.aggregates[2026].shareEci.UDF)}`)
  lines.push("")
  if (ctx.religion) {
    lines.push(`hindu_pct: ${ctx.religion.hindu}`)
    lines.push(`christian_pct: ${ctx.religion.christian}`)
    lines.push(`muslim_pct: ${ctx.religion.muslim}`)
    lines.push(`district_population_2011: ${ctx.population2011}`)
  }
  lines.push("")
  if (ctx.topHinduCastes.length > 0) {
    lines.push(`top_hindu_castes_of_hindu_pop:`)
    for (const c of ctx.topHinduCastes.slice(0, 3)) {
      lines.push(`  ${c.name}: ${c.share}`)
    }
  }
  lines.push("")
  lines.push(`related:`)
  for (const r of ctx.related) lines.push(`  - "[[${r}]]"`)
  lines.push("---")
  return lines.join("\n")
}

function renderTitle(ctx: any): string {
  return `\n# ${ctx.name} district\n\nBelt: \`${ctx.belt ?? "(unassigned)"}\` · ${ctx.acs.length} ACs`
}

function renderTldr(ctx: any): string {
  const a = ctx.aggregates[2026]
  const a21 = ctx.aggregates[2021]
  const deltas = {
    NDA: a.shareEci.NDA - a21.shareEci.NDA,
    LDF: a.shareEci.LDF - a21.shareEci.LDF,
    UDF: a.shareEci.UDF - a21.shareEci.UDF,
  }
  const dominant = (["UDF", "LDF", "NDA"] as const).reduce(
    (max, k) => (a.wins[k] > a.wins[max] ? k : max),
    "UDF" as "UDF" | "LDF" | "NDA"
  )
  return `\n## TL;DR\n\nIn 2026: **${a.wins[dominant]} of ${ctx.acs.length} ACs** won by ${dominant} (NDA ${a.wins.NDA} / LDF ${a.wins.LDF} / UDF ${a.wins.UDF}). District-aggregate vote share **NDA ${fmtPct(a.shareEci.NDA)}% / LDF ${fmtPct(a.shareEci.LDF)}% / UDF ${fmtPct(a.shareEci.UDF)}%**. Δ vs 2021: NDA ${fmtSignedPp(deltas.NDA)}, LDF ${fmtSignedPp(deltas.LDF)}, UDF ${fmtSignedPp(deltas.UDF)} pp.`
}

function renderMemberACs(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Member ACs (${ctx.acs.length})\n`)
  out.push(`| AC | Name | Reservation | 2026 winner | NDA % | LDF % | UDF % | Margin |`)
  out.push(`| --- | --- | --- | --- | --- | --- | --- | --- |`)
  for (const ac of ctx.acs) {
    const acStr = String(ac)
    const nameMeta = (names as any)[acStr]
    const r = perAcSharesAndWinner(ac, 2026)
    if (!r) continue
    const reservation = acToReservation[acStr] ?? "GEN"
    const winCol =
      r.winnerAlliance === "NDA"
        ? `**NDA** ${display(r.winnerName)}`
        : `${r.winnerAlliance} ${display(r.winnerName)}`
    const acLink = `[${nameMeta?.primary ?? "AC " + ac}](../acs/${padAc(ac)}-${slugify(nameMeta?.primary ?? "ac-" + ac)}.md)`
    out.push(
      `| ${ac} | ${acLink} | ${reservation} | ${winCol} | ${fmtPct(r.shares.NDA, 1)}% | ${fmtPct(r.shares.LDF, 1)}% | ${fmtPct(r.shares.UDF, 1)}% | ${fmtPct(r.marginPct, 1)} pp |`
    )
  }
  return out.join("\n")
}

function renderTrajectory(ctx: any): string {
  const out: string[] = []
  out.push(`\n## District-aggregate vote share trajectory\n`)
  out.push(`Sums the alliance's votes across all member ACs, then divides by the district's total polled.\n`)
  out.push(`| Year | NDA (ECI) | LDF (ECI) | UDF (ECI) | NDA win | LDF win | UDF win |`)
  out.push(`| --- | --- | --- | --- | --- | --- | --- |`)
  for (const yr of [2011, 2016, 2021, 2026] as const) {
    const a = ctx.aggregates[yr]
    out.push(
      `| ${yr} | ${fmtPct(a.shareEci.NDA)}% | ${fmtPct(a.shareEci.LDF)}% | ${fmtPct(a.shareEci.UDF)}% | ${a.wins.NDA} | ${a.wins.LDF} | ${a.wins.UDF} |`
    )
  }
  return out.join("\n")
}

function renderReligion(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Religion profile (district-level, 2011 Census)\n`)
  if (!ctx.religion) {
    out.push(`*(no district-religion entry found for ${ctx.slug})*`)
    return out.join("\n")
  }
  out.push(`District population (2011): **${ctx.population2011.toLocaleString()}**\n`)
  out.push(`| Religion | Share |`)
  out.push(`| --- | --- |`)
  out.push(`| Hindu | ${fmtPct(ctx.religion.hindu)}% |`)
  out.push(`| Christian | ${fmtPct(ctx.religion.christian)}% |`)
  out.push(`| Muslim | ${fmtPct(ctx.religion.muslim)}% |`)
  if (ctx.religion.other != null) out.push(`| Other | ${fmtPct(ctx.religion.other)}% |`)
  return out.join("\n")
}

function renderHinduCastes(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Hindu sub-castes (district-level, 2000 household survey)\n`)
  if (ctx.topHinduCastes.length === 0) {
    out.push(`*(no district-hindu-castes entry found for ${ctx.slug})*`)
    return out.join("\n")
  }
  out.push(`Shares are % of **district Hindu population**. See \`docs/caste-data.md\` for full provenance.\n`)
  out.push(`| Sub-community | % of Hindu | Linked dossier |`)
  out.push(`| --- | --- | --- |`)
  for (const c of ctx.topHinduCastes) {
    const display = c.name === "sc" ? "SC" : c.name === "st" ? "ST" : c.name.charAt(0).toUpperCase() + c.name.slice(1)
    const dossierSlug = c.name === "sc" ? "sc" : c.name === "st" ? "st" : c.name
    const knownDossiers = ["nair", "ezhava", "sc", "st", "nadar", "brahmin"]
    const link = knownDossiers.includes(dossierSlug)
      ? `[community-${dossierSlug}](../communities/${dossierSlug}.md)`
      : "—"
    out.push(`| ${display} | ${fmtPct(c.share, 1)}% | ${link} |`)
  }
  return out.join("\n")
}

function renderDurability(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Durability categorisation (from community-relevance.json)\n`)
  const buckets: Record<string, string[]> = {}
  for (const ac of ctx.acs) {
    const cr = (communityRelevance as any[]).find((c: any) => c.ac === ac)
    if (!cr?.durabilityCategory) continue
    const k = cr.durabilityCategory
    buckets[k] ??= []
    buckets[k].push((names as any)[String(ac)]?.primary ?? `AC ${ac}`)
  }
  if (Object.keys(buckets).length === 0) {
    out.push(`*(no durability tags for ACs in this district)*`)
    return out.join("\n")
  }
  out.push(`| Category | Count | ACs |`)
  out.push(`| --- | --- | --- |`)
  for (const [cat, acs] of Object.entries(buckets).sort(([, a], [, b]) => b.length - a.length)) {
    out.push(`| \`${cat}\` | ${acs.length} | ${acs.join("; ")} |`)
  }
  return out.join("\n")
}

function renderFeaturedQuestions(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Featured \`/questions\` (district ACs appearing in top-5 lists)\n`)
  if (ctx.featuredQuestions.length === 0) {
    out.push(`*(no curated question top-5 includes any AC from this district)*`)
    return out.join("\n")
  }
  out.push(`Each row lists which district ACs surface in the question's top-5 and at what rank.\n`)
  out.push(`| Question | District AC(s) in top-5 |`)
  out.push(`| --- | --- |`)
  for (const q of ctx.featuredQuestions) {
    const acBits = q.districtAcsInTop
      .map((r: any) => `#${r.rank} ${r.constituencyName} (${r.metricValue})`)
      .join("; ")
    out.push(
      `| [${q.question}](https://kerala-2026.jillen.com/questions#${q.id}) | ${acBits} |`
    )
  }
  return out.join("\n")
}

// ─── per-district orchestration ──────────────────────────────────────────────

function buildContext(slug: string, acs: number[], questionsById: Record<string, QuestionTopList>) {
  const name = titleCaseDistrict(slug)
  const belt = districtToBelt[slug] ?? null

  const aggregates = {
    2011: districtAggregate(acs, 2011),
    2016: districtAggregate(acs, 2016),
    2021: districtAggregate(acs, 2021),
    2026: districtAggregate(acs, 2026),
  }

  const religion =
    (districtReligion as any).districts?.[slug]?.religions ?? null
  const population2011 =
    (districtReligion as any).districts?.[slug]?.population ?? null

  // Hindu sub-castes
  const hinduCastesEntry = (districtHinduCastes as any).districts?.[slug] ?? null
  const topHinduCastes: Array<{ name: string; share: number }> = []
  if (hinduCastesEntry) {
    for (const [k, v] of Object.entries(hinduCastesEntry as Record<string, number>)) {
      if (typeof v === "number" && v > 0) {
        topHinduCastes.push({ name: k, share: v })
      }
    }
    topHinduCastes.sort((a, b) => b.share - a.share)
  }

  // Featured /questions — for each question, list which district ACs appear in top-5
  const districtAcSet = new Set(acs)
  const featuredQuestions: Array<{
    id: string
    question: string
    districtAcsInTop: Array<{ rank: number; ac: number; constituencyName: string; metricValue: string }>
  }> = []
  for (const q of Object.values(questionsById)) {
    const hits = q.rows
      .filter((r) => districtAcSet.has(r.ac))
      .map((r) => ({
        rank: r.rank,
        ac: r.ac,
        constituencyName: r.constituencyName,
        metricValue: r.metricValue,
      }))
    if (hits.length > 0) {
      featuredQuestions.push({ id: q.id, question: q.question, districtAcsInTop: hits })
    }
  }

  // Related dossiers
  const related: string[] = []
  if (topHinduCastes.length > 0) {
    const known = ["nair", "ezhava", "sc", "st", "nadar", "brahmin"]
    for (const c of topHinduCastes.slice(0, 3)) {
      if (known.includes(c.name)) related.push(`community-${c.name}`)
    }
  }
  // Christian and Muslim community links if district has any sizeable share
  if (religion?.christian && religion.christian >= 10) {
    related.push("community-syro-malabar", "community-latin-catholic", "community-csi")
  }
  if (religion?.muslim && religion.muslim >= 10) {
    related.push("community-muslim")
  }
  // Most-prominent winning alliance
  const dominantAlliance = (["UDF", "LDF", "NDA"] as const).reduce(
    (max, k) => (aggregates[2026].wins[k] > aggregates[2026].wins[max] ? k : max),
    "UDF" as "UDF" | "LDF" | "NDA"
  )
  related.push(`alliance-${dominantAlliance.toLowerCase()}`)
  // First 3 member ACs
  for (const ac of acs.slice(0, 3)) {
    const n = (names as any)[String(ac)]?.primary ?? `ac-${ac}`
    related.push(`ac-${ac}-${slugify(n)}`)
  }

  return {
    slug,
    name,
    belt,
    acs,
    aggregates,
    religion,
    population2011,
    topHinduCastes,
    featuredQuestions,
    related,
  }
}

function renderDossier(ctx: any): string {
  return [
    renderFrontmatter(ctx),
    renderTitle(ctx),
    renderTldr(ctx),
    renderMemberACs(ctx),
    renderTrajectory(ctx),
    renderReligion(ctx),
    renderHinduCastes(ctx),
    renderDurability(ctx),
    renderFeaturedQuestions(ctx),
    "",
  ].join("\n")
}

// ─── main ────────────────────────────────────────────────────────────────────

function parseArgs(): { district?: string } {
  const args = process.argv.slice(2)
  const out: { district?: string } = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--district" && args[i + 1]) {
      out.district = args[i + 1]
      i++
    }
  }
  return out
}

function main() {
  const args = parseArgs()

  console.log("Building canonical-name map…")
  canonicalNameMap = buildCanonicalNameMap()

  console.log("Replaying curated questions…")
  const { byQuestion: questionsById } = replayAllQuestions()

  mkdirSync(OUT_DIR, { recursive: true })

  const districtToAcs = buildDistrictToAcMap()
  const toBuild = args.district
    ? [args.district]
    : Array.from(districtToAcs.keys()).sort()

  let written = 0
  for (const slug of toBuild) {
    const acs = districtToAcs.get(slug)
    if (!acs) {
      console.error(`  ${slug}: no ACs mapped to this district`)
      continue
    }
    try {
      const ctx = buildContext(slug, acs, questionsById)
      const md = renderDossier(ctx)
      writeFileSync(resolve(OUT_DIR, `${slug}.md`), md, "utf-8")
      written++
    } catch (err: any) {
      console.error(`  ${slug} failed:`, err.stack ?? err.message)
    }
  }
  console.log(`Wrote ${written} district dossier(s) to ${OUT_DIR}`)
}

main()
