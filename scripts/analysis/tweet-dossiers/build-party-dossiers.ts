/**
 * Phase 4 builder: generates one markdown dossier per key party (10).
 *
 * Output: twitter-responses/data/parties/<slug>.md
 *
 * Per-party content:
 *  - Statewide vote share trajectory (4 cycles, ECI denominator)
 *  - "Vote share where contested" — the party's strike rate
 *  - Seats contested vs won per cycle
 *  - Alliance affiliation per cycle (detects switchers like KEC(M))
 *  - Top 25 ACs by party share (2026)
 *  - Cross-cycle candidate continuity (multi-appearance keys via normalizeName)
 *  - Featured /questions filtered by party tag
 *
 * Usage:
 *   bun run scripts/analysis/tweet-dossiers/build-party-dossiers.ts
 *   bun run scripts/analysis/tweet-dossiers/build-party-dossiers.ts --party bjp
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import results2026 from "../../../data/results-2026.json"
import history from "../../../data/ac-history.json"
import names from "../../../data/ac-names.json"
import districts from "../../../data/districts.json"
import alliancesMeta from "../../../data/alliances.json"

import { curatedQuestions } from "../../../src/lib/curated-questions"
import { replayAllQuestions, type QuestionTopList } from "./lib/replay-questions"
import {
  buildCanonicalNameMap,
  canonicalKey,
  canonicalSlug,
  displayName,
} from "./lib/canonical-names"

const PROJECT_ROOT = resolve(__dirname, "..", "..", "..")
const OUT_DIR = resolve(PROJECT_ROOT, "twitter-responses", "data", "parties")

const partyToAlliance: Record<string, string> = (alliancesMeta as any).partyToAlliance
const acToDistrict: Record<string, string> = (districts as any).constituencyToDistrict

let canonicalNameMap: Map<string, string> = new Map()
const display = (raw: string) => displayName(canonicalNameMap, raw)

// ─── party definitions ───────────────────────────────────────────────────────

type PartyDef = {
  key: string                       // slug
  display_name: string
  short: string                     // BJP, INC, CPI(M), etc.
  /** All party-name aliases used across cycles. First entry is canonical for 2026. */
  aliases: string[]
  /** Current alliance (2026). Detected automatically per cycle for the trajectory. */
  current_alliance: string
  /** One-line role description. */
  role: string
}

const PARTIES: PartyDef[] = [
  {
    key: "bjp",
    display_name: "Bharatiya Janata Party",
    short: "BJP",
    aliases: ["Bharatiya Janata Party"],
    current_alliance: "NDA",
    role: "NDA lead party. Right-wing Hindutva, expanding from a 1-seat base.",
  },
  {
    key: "inc",
    display_name: "Indian National Congress",
    short: "INC",
    aliases: ["Indian National Congress"],
    current_alliance: "UDF",
    role: "UDF lead party. Centre-left big-tent; in government from 2026.",
  },
  {
    key: "cpim",
    display_name: "Communist Party of India (Marxist)",
    short: "CPI(M)",
    aliases: ["Communist Party of India (Marxist)"],
    current_alliance: "LDF",
    role: "LDF lead party. Left-wing; held government for two consecutive cycles before 2026.",
  },
  {
    key: "cpi",
    display_name: "Communist Party of India",
    short: "CPI",
    aliases: ["Communist Party of India"],
    current_alliance: "LDF",
    role: "LDF second party. Smaller communist partner; long-standing.",
  },
  {
    key: "iuml",
    display_name: "Indian Union Muslim League",
    short: "IUML",
    aliases: ["Indian Union Muslim League"],
    current_alliance: "UDF",
    role: "UDF second party. Muslim-community institutional party, Malabar stronghold.",
  },
  {
    key: "kec-m",
    display_name: "Kerala Congress (M)",
    short: "KEC(M)",
    aliases: ["Kerala Congress (M)", "Kerala Congress(M)"],
    current_alliance: "UDF",
    role: "Christian Syro-Malabar-aligned party. Switched LDF→UDF over the recent cycles.",
  },
  {
    key: "kec",
    display_name: "Kerala Congress (parent)",
    short: "KEC",
    aliases: ["Kerala Congress"],
    current_alliance: "UDF",
    role: "Older Kerala Congress (Joseph-line); UDF partner. KEC family includes (M), (Jacob), (B) splinters.",
  },
  {
    key: "bdjs",
    display_name: "Bharath Dharma Jana Sena",
    short: "BDJS",
    aliases: ["Bharath Dharma Jana Sena"],
    current_alliance: "NDA",
    role: "NDA junior partner. Founded 2015 to mobilise Ezhava vote for NDA; share has collapsed since 2016 peak.",
  },
  {
    key: "rsp",
    display_name: "Revolutionary Socialist Party",
    short: "RSP",
    aliases: ["Revolutionary Socialist Party"],
    current_alliance: "UDF",
    role: "Smaller socialist party. Long-time LDF; switched to UDF post-2014.",
  },
  {
    key: "twenty20",
    display_name: "Twenty 20 Party",
    short: "Twenty 20",
    aliases: ["Twenty 20 Party"],
    current_alliance: "NDA",
    role: "Kizhakkambalam-based corporate-backed regional party. Aligned with NDA in 2026.",
  },
]

// ─── shared utils ────────────────────────────────────────────────────────────

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

// ─── per-cycle party stats ───────────────────────────────────────────────────

type CycleStats = {
  contested: number
  won: number
  partyVotes: number
  totalPolledStatewide: number
  totalPolledWhereContested: number
  shareEci: number          // partyVotes / totalPolledStatewide
  shareWhereContested: number  // partyVotes / totalPolledWhereContested
  alliance: string | null   // most-common alliance tag for this party's candidates
}

function cycleStats(party: PartyDef, year: 2011 | 2016 | 2021 | 2026): CycleStats {
  let partyVotes = 0,
    totalPolledStatewide = 0,
    totalPolledWhereContested = 0,
    contested = 0,
    won = 0
  const allianceCounts: Record<string, number> = {}

  const iterate = (
    payload: any,
    cands: Array<{ name: string; party: string; votes: number; alliance?: string }>
  ) => {
    let acTotal = 0
    let partyHereVotes = 0
    let partyHereCount = 0
    for (const c of cands) acTotal += c.votes
    totalPolledStatewide += acTotal

    for (const c of cands) {
      if (party.aliases.includes(c.party)) {
        partyVotes += c.votes
        partyHereVotes += c.votes
        partyHereCount++
        if (c.alliance) allianceCounts[c.alliance] = (allianceCounts[c.alliance] ?? 0) + 1
      }
    }
    if (partyHereCount > 0) {
      contested += partyHereCount  // counts multiple candidates from same party in same AC as separate
      totalPolledWhereContested += acTotal
      // Determine winner — was a party-aligned candidate first?
      const sorted = [...cands].sort((a, b) => b.votes - a.votes)
      const winner = sorted[0]
      if (party.aliases.includes(winner.party)) won++
    }
  }

  if (year === 2026) {
    for (const payload of Object.values(results2026 as any)) {
      const cands = (payload as any).candidates as Array<{
        name: string
        party: string
        votes: number
      }>
      // Inject alliance from partyToAlliance map for 2026 (history has it built in)
      const enriched = cands.map((c) => ({ ...c, alliance: partyToAlliance[c.party] }))
      iterate(payload, enriched)
    }
  } else {
    for (const payload of Object.values(history as any)) {
      const ev = (payload as any).elections.find(
        (e: any) => e.year === year && e.type === "general"
      )
      if (!ev) continue
      iterate(ev, ev.candidates)
    }
  }

  const allianceEntries = Object.entries(allianceCounts).sort(([, a], [, b]) => b - a)
  const alliance = allianceEntries[0]?.[0] ?? null

  return {
    contested,
    won,
    partyVotes,
    totalPolledStatewide,
    totalPolledWhereContested,
    shareEci: totalPolledStatewide > 0 ? (partyVotes / totalPolledStatewide) * 100 : 0,
    shareWhereContested:
      totalPolledWhereContested > 0
        ? (partyVotes / totalPolledWhereContested) * 100
        : 0,
    alliance,
  }
}

// ─── per-AC stats for 2026 ───────────────────────────────────────────────────

type AcPartyResult = {
  ac: number
  name: string
  district: string
  candidate: string
  votes: number
  share: number
  marginPct: number
  result: "won" | "runner-up" | "third" | "lower"
  allianceRank: number      // 1, 2, 3 within AC
}

function topAcsForParty(party: PartyDef): AcPartyResult[] {
  const out: AcPartyResult[] = []
  for (const [acStr, payload] of Object.entries(results2026 as any)) {
    const cands = (payload as any).candidates as Array<{
      name: string
      party: string
      votes: number
    }>
    let totalPolled = 0
    for (const c of cands) totalPolled += c.votes
    const sorted = [...cands].sort((a, b) => b.votes - a.votes)
    let partyCand: typeof sorted[0] | null = null
    let rank = 0
    for (let i = 0; i < sorted.length; i++) {
      if (party.aliases.includes(sorted[i].party)) {
        partyCand = sorted[i]
        rank = i + 1
        break
      }
    }
    if (!partyCand) continue

    const winner = sorted[0]
    const runner = sorted[1]
    const marginPct = ((winner.votes - (runner?.votes ?? 0)) / totalPolled) * 100

    let result: AcPartyResult["result"] = "lower"
    if (rank === 1) result = "won"
    else if (rank === 2) result = "runner-up"
    else if (rank === 3) result = "third"

    out.push({
      ac: Number(acStr),
      name: (names as any)[acStr]?.primary ?? `AC ${acStr}`,
      district: acToDistrict[acStr] ?? "",
      candidate: partyCand.name,
      votes: partyCand.votes,
      share: (partyCand.votes / totalPolled) * 100,
      marginPct,
      result,
      allianceRank: rank,
    })
  }
  out.sort((a, b) => b.share - a.share)
  return out
}

// ─── cross-cycle candidate continuity ────────────────────────────────────────

type CandidateAppearance = {
  canonical_key: string
  display: string
  appearances: Array<{
    year: 2011 | 2016 | 2021 | 2026
    ac: number
    acName: string
    party: string
    votes: number
    share: number
    result: "won" | "runner-up" | "third" | "lower"
  }>
}

function candidatesForParty(party: PartyDef): CandidateAppearance[] {
  const byKey: Map<string, CandidateAppearance> = new Map()

  function addAppearance(
    year: 2011 | 2016 | 2021 | 2026,
    ac: number,
    cands: Array<{ name: string; party: string; votes: number }>,
    totalPolled: number
  ) {
    const sorted = [...cands].sort((a, b) => b.votes - a.votes)
    for (let i = 0; i < sorted.length; i++) {
      const c = sorted[i]
      if (!party.aliases.includes(c.party)) continue
      const key = canonicalKey(c.name)
      if (!byKey.has(key)) {
        byKey.set(key, { canonical_key: key, display: display(c.name), appearances: [] })
      }
      const entry = byKey.get(key)!
      entry.appearances.push({
        year,
        ac,
        acName: (names as any)[String(ac)]?.primary ?? `AC ${ac}`,
        party: c.party,
        votes: c.votes,
        share: (c.votes / totalPolled) * 100,
        result: i === 0 ? "won" : i === 1 ? "runner-up" : i === 2 ? "third" : "lower",
      })
    }
  }

  // 2026
  for (const [acStr, payload] of Object.entries(results2026 as any)) {
    const cands = (payload as any).candidates
    let totalPolled = 0
    for (const c of cands) totalPolled += c.votes
    addAppearance(2026, Number(acStr), cands, totalPolled)
  }
  // History
  for (const [acStr, payload] of Object.entries(history as any)) {
    for (const ev of (payload as any).elections as Array<any>) {
      if (ev.type !== "general") continue
      if (![2011, 2016, 2021].includes(ev.year)) continue
      let totalPolled = 0
      for (const c of ev.candidates as { votes: number }[]) totalPolled += c.votes
      addAppearance(ev.year as any, Number(acStr), ev.candidates, totalPolled)
    }
  }

  // Sort each entry's appearances by year, then sort entries by total appearances desc
  for (const e of byKey.values()) {
    e.appearances.sort((a, b) => a.year - b.year)
  }
  return [...byKey.values()].sort((a, b) => b.appearances.length - a.appearances.length)
}

// ─── rendering ───────────────────────────────────────────────────────────────

function renderFrontmatter(ctx: any): string {
  const lines: string[] = ["---"]
  lines.push(`type: party`)
  lines.push(`key: ${ctx.key}`)
  lines.push(`slug: party-${ctx.key}`)
  lines.push(`name: ${ctx.display_name}`)
  lines.push(`short: ${JSON.stringify(ctx.short)}`)
  lines.push(`current_alliance: ${ctx.current_alliance}`)
  lines.push("")
  for (const yr of [2011, 2016, 2021, 2026] as const) {
    lines.push(`seats_won_${yr}: ${ctx.stats[yr].won}`)
  }
  for (const yr of [2011, 2016, 2021, 2026] as const) {
    lines.push(`vote_share_eci_${yr}: ${fmtPct(ctx.stats[yr].shareEci)}`)
  }
  for (const yr of [2011, 2016, 2021, 2026] as const) {
    lines.push(`share_where_contested_${yr}: ${fmtPct(ctx.stats[yr].shareWhereContested)}`)
  }
  for (const yr of [2011, 2016, 2021, 2026] as const) {
    lines.push(`contested_acs_${yr}: ${ctx.stats[yr].contested}`)
  }
  lines.push("")
  lines.push(`alliance_by_cycle:`)
  for (const yr of [2011, 2016, 2021, 2026] as const) {
    lines.push(`  ${yr}: ${ctx.stats[yr].alliance ?? "(did not contest)"}`)
  }
  lines.push("")
  lines.push(`top_ac_2026: ${ctx.top2026[0]?.name ?? "—"}`)
  lines.push(`top_ac_2026_share: ${fmtPct(ctx.top2026[0]?.share)}`)
  lines.push("")
  lines.push(`multi_cycle_candidate_count: ${ctx.multiCycleCandidates.length}`)
  lines.push("")
  lines.push(`related:`)
  for (const r of ctx.related) lines.push(`  - "[[${r}]]"`)
  lines.push("---")
  return lines.join("\n")
}

function renderTitle(ctx: any): string {
  return `\n# ${ctx.display_name} (${ctx.short})\n\nCurrent alliance: ${ctx.current_alliance} · ${ctx.role}`
}

function renderTldr(ctx: any): string {
  const s2026 = ctx.stats[2026]
  const s2021 = ctx.stats[2021]
  const delta = s2026.shareEci - s2021.shareEci
  return `\n## TL;DR\n\n${ctx.short} won **${s2026.won} of ${s2026.contested} contested ACs** in 2026 with **${fmtPct(s2026.shareEci)}%** statewide vote share (${fmtPct(s2026.shareWhereContested)}% where contested). Δ vs 2021: ${fmtSignedPp(delta)} pp. Alliance: **${s2026.alliance ?? ctx.current_alliance}**.`
}

function renderTrajectory(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Vote share trajectory\n`)
  out.push(`Two denominators side-by-side: statewide (total polled, ECI-format) and "where contested" (total polled in ACs the party fielded a candidate).\n`)
  out.push(`| Year | Contested | Won | Statewide share | Share where contested | Alliance |`)
  out.push(`| --- | --- | --- | --- | --- | --- |`)
  for (const yr of [2011, 2016, 2021, 2026] as const) {
    const s = ctx.stats[yr]
    out.push(
      `| ${yr} | ${s.contested} | ${s.won} | ${fmtPct(s.shareEci)}% | ${fmtPct(s.shareWhereContested)}% | ${s.alliance ?? "—"} |`
    )
  }
  return out.join("\n")
}

function renderTopAcs(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Top 25 ACs by ${ctx.short} share (2026)\n`)
  if (ctx.top2026.length === 0) {
    out.push(`*(${ctx.short} did not contest any AC in 2026)*`)
    return out.join("\n")
  }
  out.push(`| Rank | AC | District | Candidate | Vote share | Within-AC rank | Margin |`)
  out.push(`| --- | --- | --- | --- | --- | --- | --- |`)
  for (let i = 0; i < Math.min(25, ctx.top2026.length); i++) {
    const r = ctx.top2026[i]
    const acLink = `[${r.name}](../acs/${padAc(r.ac)}-${slugify(r.name)}.md)`
    const rankCell =
      r.result === "won"
        ? "**WON**"
        : r.result === "runner-up"
          ? "2nd"
          : r.result === "third"
            ? "3rd"
            : `${r.allianceRank}th`
    out.push(
      `| #${i + 1} | ${acLink} | ${r.district} | ${display(r.candidate)} | ${fmtPct(r.share)}% | ${rankCell} | ${fmtPct(r.marginPct)} pp |`
    )
  }
  return out.join("\n")
}

function renderMultiCycleCandidates(ctx: any): string {
  const out: string[] = []
  const multi: CandidateAppearance[] = ctx.multiCycleCandidates
  out.push(`\n## Cross-cycle candidate continuity (${multi.length} candidates with ≥2 cycles under ${ctx.short})\n`)
  if (multi.length === 0) {
    out.push(`*(no cross-cycle continuity — party either new or all candidates appeared in only one cycle under this party name)*`)
    return out.join("\n")
  }
  out.push(`Sorted by number of cycles contested under ${ctx.short}. Multi-AC candidates indicate cross-AC moves.\n`)
  out.push(`| Candidate | Cycles under ${ctx.short} | Distinct ACs | Wins | Latest cycle | Latest AC | Latest result |`)
  out.push(`| --- | --- | --- | --- | --- | --- | --- |`)
  for (const c of multi.slice(0, 30)) {
    const cycles = c.appearances.map((a) => a.year).join("/")
    const distinctACs = new Set(c.appearances.map((a) => a.ac)).size
    const wins = c.appearances.filter((a) => a.result === "won").length
    const latest = c.appearances[c.appearances.length - 1]
    out.push(
      `| ${c.display} | ${cycles} | ${distinctACs} | ${wins} | ${latest.year} | ${latest.acName} | ${latest.result} |`
    )
  }
  if (multi.length > 30) {
    out.push(`\n*…and ${multi.length - 30} more.*`)
  }
  return out.join("\n")
}

function renderFeaturedQuestions(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Featured \`/questions\`\n`)
  if (ctx.partyQuestions.length === 0) {
    out.push(`*(no curated questions tagged with this party)*`)
    return out.join("\n")
  }
  for (const q of ctx.partyQuestions) {
    out.push(`- [${q.question}](https://kerala-2026.jillen.com/questions#${q.id}) — *${q.tags.theme}*`)
  }
  return out.join("\n")
}

function renderDossier(ctx: any): string {
  return [
    renderFrontmatter(ctx),
    renderTitle(ctx),
    renderTldr(ctx),
    renderTrajectory(ctx),
    renderTopAcs(ctx),
    renderMultiCycleCandidates(ctx),
    renderFeaturedQuestions(ctx),
    "",
  ].join("\n")
}

// ─── per-party orchestration ─────────────────────────────────────────────────

function buildContext(party: PartyDef) {
  const stats = {
    2011: cycleStats(party, 2011),
    2016: cycleStats(party, 2016),
    2021: cycleStats(party, 2021),
    2026: cycleStats(party, 2026),
  }
  const top2026 = topAcsForParty(party)
  const allCandidates = candidatesForParty(party)
  const multiCycleCandidates = allCandidates.filter((c) => c.appearances.length >= 2)

  const partyQuestions = curatedQuestions.filter((q) => {
    if (!q.tags.party) return false
    // Map question-tag party codes to our slugs
    const tagMap: Record<string, string> = {
      BJP: "bjp",
      BDJS: "bdjs",
      INC: "inc",
      IUML: "iuml",
      "CPI(M)": "cpim",
      CPI: "cpi",
    }
    return tagMap[q.tags.party] === party.key
  })

  // Related dossiers
  const related: string[] = []
  related.push(`alliance-${party.current_alliance.toLowerCase()}`)
  for (const r of top2026.slice(0, 3)) {
    related.push(`ac-${r.ac}-${slugify(r.name)}`)
  }
  // Add community link for party-community alignments
  if (party.key === "iuml") related.push("community-muslim")
  if (party.key === "kec-m") related.push("community-syro-malabar")
  if (party.key === "bdjs") related.push("community-ezhava")
  if (party.key === "bjp") related.push("community-nair", "community-csi")

  return {
    ...party,
    stats,
    top2026,
    multiCycleCandidates,
    partyQuestions,
    related,
  }
}

// ─── main ────────────────────────────────────────────────────────────────────

function parseArgs(): { party?: string } {
  const args = process.argv.slice(2)
  const out: { party?: string } = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--party" && args[i + 1]) {
      out.party = args[i + 1]
      i++
    }
  }
  return out
}

function main() {
  const args = parseArgs()

  console.log("Building canonical-name map…")
  canonicalNameMap = buildCanonicalNameMap()

  mkdirSync(OUT_DIR, { recursive: true })

  const toBuild = args.party
    ? PARTIES.filter((p) => p.key === args.party)
    : PARTIES

  let written = 0
  for (const party of toBuild) {
    try {
      const ctx = buildContext(party)
      const md = renderDossier(ctx)
      writeFileSync(resolve(OUT_DIR, `${party.key}.md`), md, "utf-8")
      written++
    } catch (err: any) {
      console.error(`  ${party.key} failed:`, err.stack ?? err.message)
    }
  }
  console.log(`Wrote ${written} party dossier(s) to ${OUT_DIR}`)
}

main()
