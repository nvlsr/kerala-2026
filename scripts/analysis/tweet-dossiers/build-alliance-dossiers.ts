/**
 * Phase 1 builder: generates one markdown dossier per alliance (NDA / LDF / UDF).
 *
 * Output: twitter-responses/data/alliances/<slug>.md
 *
 * Each dossier is self-contained — embeds the full inline copy of the
 * corresponding `docs/narratives/<alliance>.md` so an alliance-level tweet
 * needs only one file open.
 *
 * Usage:
 *   bun run scripts/analysis/tweet-dossiers/build-alliance-dossiers.ts
 *   bun run scripts/analysis/tweet-dossiers/build-alliance-dossiers.ts --alliance NDA
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import results2026 from "../../../data/results-2026.json"
import history from "../../../data/ac-history.json"
import names from "../../../data/ac-names.json"
import districts from "../../../data/districts.json"
import alliancesMeta from "../../../data/alliances.json"
import communityRelevance from "../../../data/community-relevance.json"
import communityBelts from "../../../data/community-belts.json"

import { curatedQuestions } from "../../../src/lib/curated-questions"
import { replayAllQuestions } from "./lib/replay-questions"
import { buildCanonicalNameMap, displayName } from "./lib/canonical-names"

const PROJECT_ROOT = resolve(__dirname, "..", "..", "..")
const OUT_DIR = resolve(PROJECT_ROOT, "twitter-responses", "data", "alliances")
const NARRATIVES_DIR = resolve(PROJECT_ROOT, "docs", "narratives")

const partyToAlliance: Record<string, string> = (alliancesMeta as any).partyToAlliance
const allianceMeta: Record<string, any> = (alliancesMeta as any).alliances
const acToDistrict: Record<string, string> = (districts as any).constituencyToDistrict
const districtToBelt: Record<string, string> = (communityBelts as any).districtToBelt

const ALLIANCE_FOR_PARTY: Record<string, string> = {
  BJP: "NDA",
  BDJS: "NDA",
  INC: "UDF",
  IUML: "UDF",
  "CPI(M)": "LDF",
  CPI: "LDF",
}

const ALLIANCES = [
  {
    code: "NDA",
    name: "National Democratic Alliance",
    led_by: "Bharatiya Janata Party",
    led_by_short: "BJP",
    color: "#FF7F0E",
    narrative_file: "nda.md",
  },
  {
    code: "LDF",
    name: "Left Democratic Front",
    led_by: "Communist Party of India (Marxist)",
    led_by_short: "CPI(M)",
    color: "#D62728",
    narrative_file: "ldf.md",
  },
  {
    code: "UDF",
    name: "United Democratic Front",
    led_by: "Indian National Congress",
    led_by_short: "INC",
    color: "#1F77B4",
    narrative_file: "udf.md",
  },
] as const

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

function getAllianceFor(party: string): string {
  return partyToAlliance[party] ?? "OTHER"
}

// ─── per-AC + state-aggregate computations ───────────────────────────────────

type PerAcShares = {
  ac: number
  name: string
  district: string
  belt: string
  share_eci: number
  share_major: number
  winner_alliance: string
  winner_candidate: string
  winner_party: string
  margin_pct: number
  rank_within_ac: number      // 1=won, 2=runner-up, 3=third, etc.
}

function buildPerAcSharesAll(
  cycleYear: 2011 | 2016 | 2021 | 2026,
  allianceCode: string
): PerAcShares[] {
  const out: PerAcShares[] = []

  for (let ac = 1; ac <= 140; ac++) {
    const acStr = String(ac)
    let allianceVotes = 0,
      totalPolled = 0,
      majorTotal = 0
    let sortedCandidates: Array<{
      name: string
      party: string
      alliance: string
      votes: number
    }> = []

    if (cycleYear === 2026) {
      const r = (results2026 as any)[acStr]
      if (!r) continue
      const cands = r.candidates as { name: string; party: string; votes: number }[]
      for (const c of cands) {
        const al = getAllianceFor(c.party)
        totalPolled += c.votes
        if (al === allianceCode) allianceVotes += c.votes
        if (al === "NDA" || al === "LDF" || al === "UDF") majorTotal += c.votes
      }
      sortedCandidates = [...cands]
        .map((c) => ({
          name: c.name,
          party: c.party,
          alliance: getAllianceFor(c.party),
          votes: c.votes,
        }))
        .sort((a, b) => b.votes - a.votes)
    } else {
      const hist = (history as any)[acStr]?.elections.find(
        (e: any) => e.year === cycleYear && e.type === "general"
      )
      if (!hist) continue
      const cands = hist.candidates as Array<{
        name: string
        party: string
        votes: number
        alliance: string
      }>
      for (const c of cands) {
        totalPolled += c.votes
        if (c.alliance === allianceCode) allianceVotes += c.votes
        if (c.alliance === "NDA" || c.alliance === "LDF" || c.alliance === "UDF") {
          majorTotal += c.votes
        }
      }
      sortedCandidates = [...cands].sort((a, b) => b.votes - a.votes)
    }

    if (totalPolled === 0) continue
    const winner = sortedCandidates[0]
    const runner = sortedCandidates[1]
    const margin = ((winner.votes - (runner?.votes ?? 0)) / totalPolled) * 100

    // Best-ranked candidate of THIS alliance, to know if alliance won / 2nd / 3rd
    let rankWithin = sortedCandidates.findIndex((c) => c.alliance === allianceCode)
    if (rankWithin === -1) rankWithin = 99
    else rankWithin = rankWithin + 1

    const district = acToDistrict[acStr] ?? ""

    out.push({
      ac,
      name: (names as any)[acStr].primary,
      district,
      belt: districtToBelt[district] ?? "",
      share_eci: (allianceVotes / totalPolled) * 100,
      share_major: majorTotal === 0 ? 0 : (allianceVotes / majorTotal) * 100,
      winner_alliance: winner.alliance,
      winner_candidate: winner.name,
      winner_party: winner.party,
      margin_pct: margin,
      rank_within_ac: rankWithin,
    })
  }

  return out
}

type StateAggregate = {
  eci: number
  major: number
  allianceVotes: number
  totalPolled: number
  majorTotal: number
}

function stateAggregate(
  perAc: PerAcShares[],
  cycle: number,
  allianceCode: string
): StateAggregate {
  let allianceVotes = 0,
    totalPolled = 0,
    majorTotal = 0

  if (cycle === 2026) {
    for (const [acStr, payload] of Object.entries(results2026 as any)) {
      const cands = (payload as any).candidates as { party: string; votes: number }[]
      for (const c of cands) {
        const al = getAllianceFor(c.party)
        totalPolled += c.votes
        if (al === allianceCode) allianceVotes += c.votes
        if (al === "NDA" || al === "LDF" || al === "UDF") majorTotal += c.votes
      }
    }
  } else {
    for (const payload of Object.values(history as any)) {
      const ev = (payload as any).elections.find(
        (e: any) => e.year === cycle && e.type === "general"
      )
      if (!ev) continue
      for (const c of ev.candidates as { alliance: string; votes: number }[]) {
        totalPolled += c.votes
        if (c.alliance === allianceCode) allianceVotes += c.votes
        if (c.alliance === "NDA" || c.alliance === "LDF" || c.alliance === "UDF") {
          majorTotal += c.votes
        }
      }
    }
  }
  return {
    allianceVotes,
    totalPolled,
    majorTotal,
    eci: totalPolled === 0 ? 0 : (allianceVotes / totalPolled) * 100,
    major: majorTotal === 0 ? 0 : (allianceVotes / majorTotal) * 100,
  }
}

function countThreshold(perAc: PerAcShares[], threshold: number): number {
  return perAc.filter((r) => r.share_eci >= threshold).length
}

function countWins(perAc: PerAcShares[], allianceCode: string): number {
  return perAc.filter((r) => r.winner_alliance === allianceCode).length
}

// ─── rendering ───────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function padAc(ac: number): string {
  return String(ac).padStart(3, "0")
}

function renderFrontmatter(ctx: any): string {
  const lines: string[] = ["---"]
  lines.push(`type: alliance`)
  lines.push(`key: ${ctx.code}`)
  lines.push(`slug: alliance-${ctx.code.toLowerCase()}`)
  lines.push(`name: ${ctx.name}`)
  lines.push(`led_by: ${ctx.led_by}`)
  lines.push("")
  lines.push(`seats_won_2026: ${ctx.seatsByCycle[2026]}`)
  lines.push(`seats_won_2021: ${ctx.seatsByCycle[2021]}`)
  lines.push(`seats_won_2016: ${ctx.seatsByCycle[2016]}`)
  lines.push(`seats_won_2011: ${ctx.seatsByCycle[2011]}`)
  lines.push(`runner_up_2026: ${ctx.runnerUp2026}`)
  lines.push("")
  lines.push(`vote_share_eci_2026: ${ctx.state[2026].eci.toFixed(2)}`)
  lines.push(`vote_share_eci_2021: ${ctx.state[2021].eci.toFixed(2)}`)
  lines.push(`vote_share_eci_2016: ${ctx.state[2016].eci.toFixed(2)}`)
  lines.push(`vote_share_eci_2011: ${ctx.state[2011].eci.toFixed(2)}`)
  lines.push(`vote_share_major_2026: ${ctx.state[2026].major.toFixed(2)}`)
  lines.push("")
  lines.push(`ac_count_ge_40_2026: ${ctx.thresholds[2026].ge40}`)
  lines.push(`ac_count_ge_30_2026: ${ctx.thresholds[2026].ge30}`)
  lines.push(`ac_count_ge_20_2026: ${ctx.thresholds[2026].ge20}`)
  lines.push(`ac_count_ge_30_2021: ${ctx.thresholds[2021].ge30}`)
  lines.push(`ac_count_ge_30_2016: ${ctx.thresholds[2016].ge30}`)
  lines.push("")
  lines.push(`constituent_parties: [${ctx.constituentParties.map((p: any) => slugify(p.party)).join(", ")}]`)
  lines.push("")
  lines.push(`durability_flipped_2026: ${ctx.durabilityBuckets.flipped.length}`)
  lines.push(`durability_stable_for_alliance: ${ctx.durabilityBuckets.stable.length}`)
  lines.push("")
  lines.push(`related:`)
  for (const link of ctx.related) lines.push(`  - "[[${link}]]"`)
  lines.push(`---`)
  return lines.join("\n")
}

function renderTitle(ctx: any): string {
  return `\n# ${ctx.name} (${ctx.code})\n\nLed by: ${ctx.led_by}`
}

function renderTldr(ctx: any): string {
  const won = ctx.seatsByCycle[2026]
  const wonLastCycle = ctx.seatsByCycle[2021]
  const seatsDelta = won - wonLastCycle
  const seatsDeltaStr =
    seatsDelta > 0
      ? `up ${seatsDelta} from ${wonLastCycle}`
      : seatsDelta < 0
        ? `down ${Math.abs(seatsDelta)} from ${wonLastCycle}`
        : `unchanged from ${wonLastCycle}`

  const ecishare = ctx.state[2026].eci
  const majShare = ctx.state[2026].major

  let winnersList = ""
  if (won > 0 && won <= 8) {
    const winners = ctx.perAc2026
      .filter((r: PerAcShares) => r.winner_alliance === ctx.code)
      .sort((a: PerAcShares, b: PerAcShares) => b.share_eci - a.share_eci)
      .map((r: PerAcShares) => r.name)
      .join(", ")
    winnersList = ` (${winners})`
  }

  return `\n## TL;DR\n\n${ctx.code} won **${won} seat${won === 1 ? "" : "s"}**${winnersList} in 2026, ${seatsDeltaStr}. State vote share **${fmtPct(ecishare)}% (ECI) / ${fmtPct(majShare)}% (major-only)**. Crossed 30% in **${ctx.thresholds[2026].ge30} ACs** and 20% in **${ctx.thresholds[2026].ge20} ACs**.`
}

function renderTrajectory(ctx: any): string {
  const out: string[] = []
  out.push(`\n## State-aggregate vote share trajectory\n`)
  out.push(`| Year | ECI share | Major-only share | Seats won |`)
  out.push(`| --- | --- | --- | --- |`)
  for (const yr of [2011, 2016, 2021, 2026] as const) {
    out.push(
      `| ${yr} | ${fmtPct(ctx.state[yr].eci)}% | ${fmtPct(ctx.state[yr].major)}% | ${ctx.seatsByCycle[yr]} |`
    )
  }
  out.push("")
  const delta_21_26 = ctx.state[2026].eci - ctx.state[2021].eci
  const delta_16_26 = ctx.state[2026].eci - ctx.state[2016].eci
  out.push(`**Deltas (ECI):** 2021 → 2026 ${fmtSignedPp(delta_21_26)} pp, 2016 → 2026 ${fmtSignedPp(delta_16_26)} pp.`)
  out.push("")
  out.push(`*ECI share* uses total polled (incl. NOTA + minor independents) as denominator. *Major-only share* uses NDA + LDF + UDF candidate votes only — the standard denominator in TV graphics and politician communications. See [data/README.md methodology](../README.md) for the full reasoning.`)
  return out.join("\n")
}

function renderThresholdCounts(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Threshold counts across cycles\n`)
  out.push(`Counts of ACs where ${ctx.code} share crossed each threshold (ECI denominator).`)
  out.push("")
  out.push(`| Threshold | 2011 | 2016 | 2021 | 2026 |`)
  out.push(`| --- | --- | --- | --- | --- |`)
  for (const t of [20, 25, 30, 40] as const) {
    const cells = [2011, 2016, 2021, 2026].map((y) => {
      const k = `ge${t}` as "ge20" | "ge25" | "ge30" | "ge40"
      return ctx.thresholds[y][k] ?? "—"
    })
    out.push(`| ≥${t}% | ${cells.join(" | ")} |`)
  }
  return out.join("\n")
}

function renderSeatsWonByCycle(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Seats won, by cycle\n`)
  for (const yr of [2026, 2021, 2016, 2011] as const) {
    const perAc: PerAcShares[] = ctx.perAcByCycle[yr]
    const wins = perAc.filter((r) => r.winner_alliance === ctx.code)
    if (wins.length === 0) {
      out.push(`- **${yr}**: 0`)
      continue
    }
    const detail = wins
      .sort((a, b) => b.share_eci - a.share_eci)
      .map((r) => {
        if (yr === 2026) {
          return `${r.name} (${display(r.winner_candidate)}, ${fmtPct(r.share_eci)}%)`
        }
        return `${r.name} (${display(r.winner_candidate)})`
      })
      .join("; ")
    out.push(`- **${yr}**: ${wins.length} — ${detail}`)
  }
  return out.join("\n")
}

function renderTopACs(ctx: any): string {
  const perAc: PerAcShares[] = [...ctx.perAc2026].sort(
    (a: PerAcShares, b: PerAcShares) => b.share_eci - a.share_eci
  )
  const top = perAc.slice(0, 25)
  const out: string[] = []
  out.push(`\n## Top 25 ACs by ${ctx.code} share (2026)\n`)
  out.push(`| Rank | AC | District | ${ctx.code} % (ECI) | ${ctx.code} % (major) | Winner | Margin |`)
  out.push(`| --- | --- | --- | --- | --- | --- | --- |`)
  top.forEach((r, i) => {
    const acLink = `[${r.name}](../acs/${padAc(r.ac)}-${slugify(r.name)}.md)`
    const winnerCell = r.winner_alliance === ctx.code ? `**${r.winner_alliance}**` : r.winner_alliance
    out.push(
      `| #${i + 1} | ${acLink} | ${r.district} | ${fmtPct(r.share_eci)}% | ${fmtPct(r.share_major)}% | ${winnerCell} | ${fmtPct(r.margin_pct)} pp |`
    )
  })
  return out.join("\n")
}

function renderDurabilityBuckets(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Durability buckets (from \`community-relevance.json\`)\n`)

  const flipped = ctx.durabilityBuckets.flipped
  out.push(`### Flipped to ${ctx.code} in 2026 (${flipped.length})`)
  if (flipped.length === 0) {
    out.push(`*(none)*`)
  } else {
    out.push("")
    for (const r of flipped) {
      out.push(
        `- [${r.name}](../acs/${padAc(r.ac)}-${slugify(r.name)}.md) — ${fmtPct(r.share_eci)}% ECI, margin ${fmtPct(r.margin_pct)} pp`
      )
    }
  }
  out.push("")

  const stable = ctx.durabilityBuckets.stable
  out.push(`### Structurally stable for ${ctx.code} (${stable.length})`)
  if (stable.length === 0) {
    out.push(`*(none)*`)
  } else {
    out.push("")
    for (const r of stable.slice(0, 20)) {
      out.push(
        `- [${r.name}](../acs/${padAc(r.ac)}-${slugify(r.name)}.md) — ${fmtPct(r.share_eci)}% (${r.winner_alliance} won)`
      )
    }
    if (stable.length > 20) out.push(`- *…and ${stable.length - 20} more*`)
  }
  return out.join("\n")
}

function renderGeographicConcentration(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Geographic concentration\n`)

  const ge30 = ctx.perAc2026.filter((r: PerAcShares) => r.share_eci >= 30)
  if (ge30.length > 0) {
    const byDistrict: Record<string, PerAcShares[]> = {}
    for (const r of ge30) (byDistrict[r.district] ??= []).push(r)
    const dists = Object.entries(byDistrict).sort(([, a], [, b]) => b.length - a.length)
    out.push(`### ACs at ≥30% ${ctx.code} share — by district (${ge30.length} total)\n`)
    out.push(`| District | Count | ACs |`)
    out.push(`| --- | --- | --- |`)
    for (const [d, list] of dists) {
      const acNames = list
        .sort((a, b) => b.share_eci - a.share_eci)
        .map((r) => `${r.name} ${fmtPct(r.share_eci)}%`)
        .join("; ")
      out.push(`| ${d || "(unknown)"} | ${list.length} | ${acNames} |`)
    }
  }

  out.push("")
  const ge30Belts = ctx.perAc2026.filter((r: PerAcShares) => r.share_eci >= 30)
  if (ge30Belts.length > 0) {
    const byBelt: Record<string, number> = {}
    for (const r of ge30Belts) byBelt[r.belt] = (byBelt[r.belt] ?? 0) + 1
    out.push(`### ACs at ≥30% — by political-geography belt\n`)
    out.push(`| Belt | Count |`)
    out.push(`| --- | --- |`)
    for (const [b, n] of Object.entries(byBelt).sort(([, a], [, b]) => b - a)) {
      out.push(`| ${b || "(unknown)"} | ${n} |`)
    }
  }
  return out.join("\n")
}

function renderConstituentParties(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Constituent parties (2026)\n`)
  if (ctx.constituentParties.length === 0) {
    out.push(`*(no party-level breakdown)*`)
    return out.join("\n")
  }
  out.push(`| Party | Seats contested | Seats won | Total votes | State share (ECI) |`)
  out.push(`| --- | --- | --- | --- | --- |`)
  for (const p of ctx.constituentParties) {
    out.push(
      `| ${p.party} | ${p.contested} | ${p.won} | ${p.votes.toLocaleString()} | ${fmtPct(p.share)}% |`
    )
  }
  return out.join("\n")
}

function renderFeaturedQuestions(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Featured \`/questions\`\n`)
  if (ctx.allianceQuestions.length === 0) {
    out.push(`*(none)*`)
    return out.join("\n")
  }
  for (const q of ctx.allianceQuestions) {
    const tagBits: string[] = []
    if (q.tags.party) tagBits.push(q.tags.party)
    if (q.tags.alliance) tagBits.push(q.tags.alliance)
    tagBits.push(q.tags.theme)
    out.push(
      `- [${q.question}](https://kerala-2026.jillen.com/questions#${q.id}) — *${tagBits.join(" · ")}*`
    )
  }
  return out.join("\n")
}

function renderNarrativeCopy(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Narrative reference — full inline copy of \`docs/narratives/${ctx.narrative_file}\`\n`)
  out.push(`*This is the comprehensive reference doc. Embedded verbatim so the alliance dossier is self-contained.*\n`)
  out.push(`---\n`)
  if (ctx.narrativeBody) {
    out.push(ctx.narrativeBody)
  } else {
    out.push(`*(narrative file not found at \`docs/narratives/${ctx.narrative_file}\`)*`)
  }
  return out.join("\n")
}

// ─── per-alliance orchestration ──────────────────────────────────────────────

function buildContext(alliance: typeof ALLIANCES[number], questionsById: any) {
  const perAcByCycle = {
    2011: buildPerAcSharesAll(2011, alliance.code),
    2016: buildPerAcSharesAll(2016, alliance.code),
    2021: buildPerAcSharesAll(2021, alliance.code),
    2026: buildPerAcSharesAll(2026, alliance.code),
  }

  const state = {
    2011: stateAggregate(perAcByCycle[2011], 2011, alliance.code),
    2016: stateAggregate(perAcByCycle[2016], 2016, alliance.code),
    2021: stateAggregate(perAcByCycle[2021], 2021, alliance.code),
    2026: stateAggregate(perAcByCycle[2026], 2026, alliance.code),
  }

  const seatsByCycle = {
    2011: countWins(perAcByCycle[2011], alliance.code),
    2016: countWins(perAcByCycle[2016], alliance.code),
    2021: countWins(perAcByCycle[2021], alliance.code),
    2026: countWins(perAcByCycle[2026], alliance.code),
  }

  const thresholds: Record<number, any> = {}
  for (const yr of [2011, 2016, 2021, 2026] as const) {
    thresholds[yr] = {
      ge20: countThreshold(perAcByCycle[yr], 20),
      ge25: countThreshold(perAcByCycle[yr], 25),
      ge30: countThreshold(perAcByCycle[yr], 30),
      ge40: countThreshold(perAcByCycle[yr], 40),
    }
  }

  const runnerUp2026 = perAcByCycle[2026].filter(
    (r) => r.rank_within_ac === 2
  ).length

  // Durability buckets
  const flipped = perAcByCycle[2026]
    .filter((r) => r.winner_alliance === alliance.code)
    .filter((r) => {
      const cr = (communityRelevance as any[]).find((c: any) => c.ac === r.ac)
      return cr?.durabilityCategory === "flipped-2026"
    })
    .sort((a, b) => b.share_eci - a.share_eci)

  const stable = perAcByCycle[2026]
    .filter((r) => {
      const cr = (communityRelevance as any[]).find((c: any) => c.ac === r.ac)
      return cr?.stableFor === alliance.code
    })
    .sort((a, b) => b.share_eci - a.share_eci)

  // Constituent parties
  const partiesForAlliance = Object.entries(partyToAlliance)
    .filter(([_, al]) => al === alliance.code)
    .map(([party]) => party)
    .filter((p) => p !== alliance.code) // skip generic alliance code itself
  const partyStats: Array<{
    party: string
    contested: number
    won: number
    votes: number
    share: number
  }> = []
  let totalPolled2026 = 0
  for (const payload of Object.values(results2026 as any)) {
    for (const c of (payload as any).candidates as { votes: number }[]) {
      totalPolled2026 += c.votes
    }
  }
  for (const p of partiesForAlliance) {
    let contested = 0,
      won = 0,
      votes = 0
    for (const [acStr, payload] of Object.entries(results2026 as any)) {
      const cands = (payload as any).candidates as {
        name: string
        party: string
        votes: number
      }[]
      const sorted = [...cands].sort((a, b) => b.votes - a.votes)
      for (const c of cands) {
        if (c.party === p) {
          contested++
          votes += c.votes
          if (sorted[0]?.party === p) won++
        }
      }
    }
    if (contested > 0) {
      partyStats.push({
        party: p,
        contested,
        won,
        votes,
        share: (votes / totalPolled2026) * 100,
      })
    }
  }
  partyStats.sort((a, b) => b.votes - a.votes)

  // Featured questions for this alliance
  const allianceQuestions = curatedQuestions.filter(
    (q) =>
      q.tags.alliance === alliance.code ||
      (q.tags.party && ALLIANCE_FOR_PARTY[q.tags.party] === alliance.code)
  )

  // Related dossiers: top 3 ACs, lead party, key seats
  const top3 = [...perAcByCycle[2026]]
    .sort((a, b) => b.share_eci - a.share_eci)
    .slice(0, 3)
  const related: string[] = []
  related.push(`party-${slugify(alliance.led_by)}`)
  for (const r of top3) related.push(`ac-${r.ac}-${slugify(r.name)}`)

  // Narrative file
  let narrativeBody: string | null = null
  try {
    narrativeBody = readFileSync(resolve(NARRATIVES_DIR, alliance.narrative_file), "utf-8")
  } catch {}

  return {
    ...alliance,
    perAc2026: perAcByCycle[2026],
    perAcByCycle,
    state,
    seatsByCycle,
    thresholds,
    runnerUp2026,
    durabilityBuckets: { flipped, stable },
    constituentParties: partyStats,
    allianceQuestions,
    related,
    narrativeBody,
  }
}

function renderDossier(ctx: any): string {
  return [
    renderFrontmatter(ctx),
    renderTitle(ctx),
    renderTldr(ctx),
    renderTrajectory(ctx),
    renderThresholdCounts(ctx),
    renderSeatsWonByCycle(ctx),
    renderTopACs(ctx),
    renderDurabilityBuckets(ctx),
    renderGeographicConcentration(ctx),
    renderConstituentParties(ctx),
    renderFeaturedQuestions(ctx),
    renderNarrativeCopy(ctx),
    "",
  ].join("\n")
}

// ─── main ────────────────────────────────────────────────────────────────────

function parseArgs(): { alliance?: string } {
  const args = process.argv.slice(2)
  const out: { alliance?: string } = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--alliance" && args[i + 1]) {
      out.alliance = args[i + 1]
      i++
    }
  }
  return out
}

function main() {
  const args = parseArgs()

  console.log("Building canonical-name map…")
  canonicalNameMap = buildCanonicalNameMap()

  console.log("Replaying curated questions (used for question-tag lookup)…")
  const { byQuestion: questionsById } = replayAllQuestions()

  mkdirSync(OUT_DIR, { recursive: true })

  const toBuild = args.alliance
    ? ALLIANCES.filter((a) => a.code === args.alliance)
    : ALLIANCES

  let written = 0
  for (const alliance of toBuild) {
    try {
      const ctx = buildContext(alliance, questionsById)
      const md = renderDossier(ctx)
      const filename = `${alliance.code.toLowerCase()}.md`
      writeFileSync(resolve(OUT_DIR, filename), md, "utf-8")
      written++
    } catch (err: any) {
      console.error(`  ${alliance.code} failed:`, err.stack ?? err.message)
    }
  }
  console.log(`Wrote ${written} alliance dossier(s) to ${OUT_DIR}`)
}

main()
