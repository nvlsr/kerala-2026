/**
 * Phase 1 builder: generates one markdown dossier per AC (140 files).
 *
 * Output: twitter-responses/data/acs/<NNN>-<slug>.md
 *
 * Usage:
 *   bun run scripts/analysis/tweet-dossiers/build-ac-dossiers.ts            # all 140
 *   bun run scripts/analysis/tweet-dossiers/build-ac-dossiers.ts --ac 135   # single AC
 *
 * Idempotent: every regeneration produces the same output from the same
 * source data.
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import results2026 from "../../../data/results-2026.json"
import history from "../../../data/ac-history.json"
import names from "../../../data/ac-names.json"
import reservations from "../../../data/reservations.json"
import districts from "../../../data/districts.json"
import acReligion from "../../../data/ac-religion.json"
import districtReligion from "../../../data/district-religion.json"
import districtHinduCastes from "../../../data/district-hindu-castes.json"
import acReligiousPois from "../../../data/ac-religious-pois.json"
import communityRelevance from "../../../data/community-relevance.json"
import communityBelts from "../../../data/community-belts.json"
import acSummaries from "../../../data/ac-summaries.json"
import hereditarySeats from "../../../data/hereditary-seats.json"
import ldfMinisters from "../../../data/ldf-ministers-2021.json"
import alliancesMeta from "../../../data/alliances.json"

import { replayAllQuestions, type QuestionTopList } from "./lib/replay-questions"
import {
  buildCanonicalNameMap,
  canonicalKey as canonicalKeyFromName,
  canonicalSlug,
  displayName,
} from "./lib/canonical-names"

// ─── lookups ─────────────────────────────────────────────────────────────────

const PROJECT_ROOT = resolve(__dirname, "..", "..", "..")
const OUT_DIR = resolve(PROJECT_ROOT, "twitter-responses", "data", "acs")

const partyToAlliance: Record<string, string> = (alliancesMeta as any).partyToAlliance
const acToDistrict: Record<string, string> = (districts as any).constituencyToDistrict
const acToReservation: Record<string, string> =
  (reservations as any).constituencyToReservation ?? {}
const districtToBelt: Record<string, string> = (communityBelts as any).districtToBelt
const constituencyBeltOverrides: Record<string, string> =
  (communityBelts as any).constituencyOverrides ?? {}

const PARTY_SHORT: Record<string, string> = {
  "Bharatiya Janata Party": "BJP",
  "Indian National Congress": "INC",
  "Communist Party of India (Marxist)": "CPI(M)",
  "Communist Party of India": "CPI",
  "Indian Union Muslim League": "IUML",
  "Kerala Congress (M)": "KEC(M)",
  "Kerala Congress": "KEC",
  "Revolutionary Socialist Party": "RSP",
  "Bharath Dharma Jana Sena": "BDJS",
  "Janata Dal (Secular)": "JD(S)",
  "Janata Dal (United)": "JD(U)",
  "All India Anna Dravida Munnetra Kazhagam": "AIADMK",
  "Aam Aadmi Party": "AAP",
  "Independent": "Ind",
  "None of the Above": "NOTA",
}

const partyShort = (p: string) => PARTY_SHORT[p] ?? p

/**
 * Module-level canonical-name map: keyed by `normalizeName(rawName)`, value is
 * the best-quality display variant seen across all cycles. Built once at
 * startup; used by `display()` to render every candidate name consistently.
 */
let canonicalNameMap: Map<string, string> = new Map()

/** Render the canonical display name for any raw candidate name. */
function display(raw: string): string {
  return displayName(canonicalNameMap, raw)
}

// ─── types ───────────────────────────────────────────────────────────────────

type RawCandidate2026 = { name: string; party: string; votes: number }
type HistCandidate = {
  name: string
  party: string
  votes: number
  votePct: number
  alliance: string
}
type CycleAlliance = { NDA: number; LDF: number; UDF: number }

// ─── per-AC context ──────────────────────────────────────────────────────────

function getAllianceFor(party: string): string {
  return partyToAlliance[party] ?? "OTHER"
}

function computeShares2026(cands: RawCandidate2026[]) {
  const total = cands.reduce((s, c) => s + c.votes, 0)
  const byAlliance: Record<string, number> = { NDA: 0, LDF: 0, UDF: 0, OTHER: 0, NOTA: 0 }
  for (const c of cands) byAlliance[getAllianceFor(c.party)] += c.votes
  const shareEci = (key: string) => (byAlliance[key] / total) * 100
  const majorTotal = byAlliance.NDA + byAlliance.LDF + byAlliance.UDF
  const shareMajor = (key: string) => (byAlliance[key] / majorTotal) * 100
  return { total, byAlliance, shareEci, shareMajor }
}

function rankSortedDesc<T>(arr: T[], key: (t: T) => number): T[] {
  return [...arr].sort((a, b) => key(b) - key(a))
}

function getAcSummary(ac: number): string | null {
  const entry = (acSummaries as any).summaries.find((s: any) => s.ac === ac)
  return entry?.summary ?? null
}

function getLdfMinister2021(ac: number) {
  return (ldfMinisters as any).ministers.find(
    (m: any) => m.constituencyNumber === ac
  )
}

function getHereditarySeat(ac: number) {
  return (hereditarySeats as any).seats.find((s: any) => s.ac === ac)
}

function getCommunityRelevance(ac: number) {
  return (communityRelevance as any[]).find((c: any) => c.ac === ac)
}

function getBelt(ac: number, district: string): string | null {
  return constituencyBeltOverrides[String(ac)] ?? districtToBelt[district] ?? null
}

// ─── rendering ───────────────────────────────────────────────────────────────

function fmtPct(x: number | null | undefined, digits = 2): string {
  if (x == null) return "—"
  return `${x.toFixed(digits)}`
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

function renderFrontmatter(ctx: any): string {
  const cr = ctx.communityRelevance
  const lines: string[] = ["---"]
  lines.push(`type: ac`)
  lines.push(`key: ${ctx.ac}`)
  lines.push(`name: ${ctx.name}`)
  lines.push(`slug: ac-${ctx.ac}-${slugify(ctx.name)}`)
  lines.push(`district: ${ctx.district}`)
  lines.push(`reservation: ${ctx.reservation}`)
  lines.push("")
  lines.push(`winner_2026: ${ctx.winner2026.alliance}`)
  lines.push(`winner_2026_candidate: ${display(ctx.winner2026.candidate)}`)
  lines.push(`margin_2026_pp: ${ctx.margin2026.toFixed(2)}`)
  lines.push(`nda_share_eci_2026: ${ctx.shareEci2026.NDA.toFixed(2)}`)
  lines.push(`nda_share_major_2026: ${ctx.shareMajor2026.NDA.toFixed(2)}`)
  lines.push(`ldf_share_eci_2026: ${ctx.shareEci2026.LDF.toFixed(2)}`)
  lines.push(`udf_share_eci_2026: ${ctx.shareEci2026.UDF.toFixed(2)}`)
  lines.push("")
  if (cr) {
    lines.push(`durability: ${cr.durabilityCategory ?? ""}`)
    lines.push(`primary_driver: ${cr.primaryDriver ?? ""}`)
    lines.push(`stable_for: ${cr.stableFor ?? ""}`)
    lines.push(`nda_trend: ${cr.ndaTrend ?? ""}`)
    lines.push(`net_tag: ${cr.netTag ?? ""}`)
    lines.push("")
    if (cr.muslim) {
      lines.push(`muslim_pct: ${cr.muslim.aggregateShare?.toFixed(2)}`)
      lines.push(`muslim_subtype: ${cr.muslim.subType ?? ""}`)
    }
    if (cr.christian) {
      lines.push(`christian_pct: ${cr.christian.aggregateShare?.toFixed(2)}`)
      lines.push(`christian_coordination: ${cr.christian.coordination ?? ""}`)
    }
    if (cr.hindu) {
      lines.push(`hindu_profile: ${cr.hindu.profile ?? ""}`)
      lines.push(`nair_pct_district: ${cr.hindu.nair}`)
      lines.push(`ezhava_pct_district: ${cr.hindu.ezhava}`)
      lines.push(`sc_pct_district: ${cr.hindu.sc}`)
    }
    lines.push("")
  }
  lines.push(`history_winners: [${ctx.historyWinners.join(", ")}]`)
  lines.push("")
  if (ctx.belt) lines.push(`belt: ${ctx.belt}`)
  lines.push(`hereditary_seat: ${ctx.hereditarySeat ? "true" : "false"}`)
  if (ctx.ldfMinister) {
    lines.push(`ldf_minister_2021: ${ctx.ldfMinister.name} (${ctx.ldfMinister.portfolio})`)
  }
  if (ctx.questionAppearances.length > 0) {
    lines.push(
      `featured_in_questions: [${ctx.questionAppearances.map((q: any) => q.id).join(", ")}]`
    )
  }
  lines.push("")
  if (ctx.related.length > 0) {
    lines.push("related:")
    for (const link of ctx.related) lines.push(`  - "[[${link}]]"`)
  }
  lines.push("---")
  return lines.join("\n")
}

function renderTitle(ctx: any): string {
  return `\n# ${ctx.name} (AC ${ctx.ac})\n\nDistrict: ${ctx.districtDisplay} · Reservation: ${ctx.reservation} · Wikipedia: [${ctx.wikipedia}](https://en.wikipedia.org/wiki/${encodeURIComponent(ctx.wikipedia)})`
}

function renderTldr(): string {
  return `\n## TL;DR\n\n*(not auto-generated; fill manually if a tweet exposes a sharp framing)*`
}

function renderTrajectory(ctx: any): string {
  const rows: string[] = []
  rows.push("| Year | NDA | LDF | UDF | Winner | Margin (pp) |")
  rows.push("| --- | --- | --- | --- | --- | --- |")

  for (const cycle of ctx.cycleHistory) {
    const win = cycle.winnerAlliance
    const fmt = (a: string, v: number) =>
      a === win ? `**${fmtPct(v)}**` : fmtPct(v)
    rows.push(
      `| ${cycle.year} | ${fmt("NDA", cycle.shares.NDA)} | ${fmt("LDF", cycle.shares.LDF)} | ${fmt("UDF", cycle.shares.UDF)} | ${cycle.winnerAlliance} (${display(cycle.winnerName)}) | ${fmtPct(cycle.marginPct)} |`
    )
  }

  let deltaText = "\n**Deltas:**\n"
  if (ctx.delta_2021_2026) {
    deltaText += `- 2021 → 2026: NDA **${fmtSignedPp(ctx.delta_2021_2026.NDA)}**, LDF ${fmtSignedPp(ctx.delta_2021_2026.LDF)}, UDF ${fmtSignedPp(ctx.delta_2021_2026.UDF)}\n`
  }
  if (ctx.delta_2016_2026) {
    deltaText += `- 2016 → 2026: NDA ${fmtSignedPp(ctx.delta_2016_2026.NDA)}, LDF ${fmtSignedPp(ctx.delta_2016_2026.LDF)}, UDF ${fmtSignedPp(ctx.delta_2016_2026.UDF)}\n`
  }
  if (ctx.delta_2011_2026) {
    deltaText += `- 2011 → 2026: NDA ${fmtSignedPp(ctx.delta_2011_2026.NDA)}, LDF ${fmtSignedPp(ctx.delta_2011_2026.LDF)}, UDF ${fmtSignedPp(ctx.delta_2011_2026.UDF)}\n`
  }

  let longArc = ""
  if (ctx.cycleHistory.length >= 2) {
    const ndaSeries = ctx.cycleHistory.map((c: any) => c.shares.NDA)
    const peakIdx = ndaSeries.indexOf(Math.max(...ndaSeries))
    const peak = ctx.cycleHistory[peakIdx]
    const current = ctx.cycleHistory[ctx.cycleHistory.length - 1]
    const deltaFromPeak = current.shares.NDA - peak.shares.NDA
    longArc = `\n**Long arc:** NDA share trajectory ${ndaSeries.map((s: number) => Math.round(s)).join(" → ")}. Peak: ${peak.year} (${fmtPct(peak.shares.NDA, 1)}%, ${peak.winnerAlliance === "NDA" ? display(peak.winnerName) : "NDA was runner-up"}). 2026 is ${fmtSignedPp(deltaFromPeak, 1)} pp vs peak.`
  }

  return `\n## Four-cycle alliance trajectory\n\n${rows.join("\n")}\n${deltaText}${longArc}`
}

function renderTopCandidates(ctx: any): string {
  const sections: string[] = []
  for (const cycle of [...ctx.cycleHistory].reverse()) {
    const top3 = cycle.candidates.slice(0, 3)
    const head = `\n### ${cycle.year}\n| Candidate | Party | Alliance | Votes | Share | Result |\n| --- | --- | --- | --- | --- | --- |`
    const rows = top3
      .map((c: any, i: number) => {
        const result = i === 0 ? "**WON**" : "lost"
        return `| ${display(c.name)} | ${partyShort(c.party)} | ${c.alliance ?? "—"} | ${c.votes.toLocaleString()} | ${fmtPct(c.votePct)}% | ${result} |`
      })
      .join("\n")
    let extra = ""
    if (cycle.year === 2026) {
      const nota = cycle.candidates.find((c: any) => c.party === "None of the Above")
      const others = cycle.candidates.filter(
        (c: any) => !["NDA", "LDF", "UDF"].includes(c.alliance) && c.name !== "NOTA"
      )
      const minorVotes = others.reduce((s: number, c: any) => s + c.votes, 0)
      extra = `\n\nTotal polled: ${cycle.total.toLocaleString()} · NOTA: ${(nota?.votes ?? 0).toLocaleString()} · Minor + independent: ${minorVotes.toLocaleString()}`
    }
    sections.push(`${head}\n${rows}${extra}`)
  }
  return `\n## Top candidates per cycle\n${sections.join("\n")}`
}

function renderDemographics(ctx: any): string {
  const out: string[] = []
  out.push("\n## Demographics\n")

  if (ctx.acReligion) {
    const r = ctx.acReligion.religions
    const otherSum =
      (r.sikh ?? 0) + (r.buddhist ?? 0) + (r.jain ?? 0) + (r.other ?? 0)
    out.push(
      "### Religion (AC-level, from `ac-religion.json` — 2011 Census, district-urban-fallback method when SHRUG unmatched)"
    )
    out.push("| Religion | Share |")
    out.push("| --- | --- |")
    out.push(`| Hindu | ${fmtPct(r.hindu)}% |`)
    out.push(`| Christian | ${fmtPct(r.christian)}% |`)
    out.push(`| Muslim | ${fmtPct(r.muslim)}% |`)
    out.push(`| Other | ${fmtPct(otherSum)}% (sikh + buddhist + jain + other) |`)
    if (ctx.acReligion.source) {
      out.push("")
      out.push(`*Source note: ${ctx.acReligion.source}.*`)
    }
    if (ctx.districtReligion) {
      const dr = ctx.districtReligion.religions
      out.push("")
      out.push(
        `*District-level (${ctx.districtDisplay}) for reference: Hindu ${fmtPct(dr.hindu)}% / Christian ${fmtPct(dr.christian)}% / Muslim ${fmtPct(dr.muslim)}%.*`
      )
    }
    out.push("")
  }

  if (ctx.pois) {
    const p = ctx.pois
    out.push(`### Religious-institution inventory (from \`ac-religious-pois.json\`)`)
    out.push(`Total POIs mapped: **${p.totalPois}** across ${ctx.name} AC.`)
    out.push("")
    out.push("| Religion | Count |")
    out.push("| --- | --- |")
    out.push(`| Hindu | ${p.byReligion.hindu ?? 0} |`)
    out.push(`| Muslim | ${p.byReligion.muslim ?? 0} |`)
    out.push(`| Christian | ${p.byReligion.christian ?? 0} |`)
    out.push(
      `| Other / unknown | ${(p.byReligion.other ?? 0) + (p.byReligion.unknown ?? 0)} |`
    )
    if (p.dominantChristian || p.dominantMuslim) {
      out.push("")
      out.push("**Dominant sub-rite among classifiable POIs:**")
      if (p.dominantChristian) {
        const denoms = Object.entries(p.christianByDenom ?? {})
          .map(([k, v]) => `${k} ${v}`)
          .join(", ")
        out.push(`- Christian dominant: **${p.dominantChristian}** (${denoms})`)
      }
      if (p.dominantMuslim) {
        const denoms = Object.entries(p.muslimByDenom ?? {})
          .map(([k, v]) => `${k} ${v}`)
          .join(", ")
        out.push(`- Muslim dominant: **${p.dominantMuslim}** (${denoms})`)
      }
    }
    out.push("")
  }

  if (ctx.districtHindu) {
    const d = ctx.districtHindu
    out.push(`### Hindu sub-castes (${ctx.districtDisplay} district)`)
    out.push("| Sub-community | Share of Hindu |")
    out.push("| --- | --- |")
    const order = ["nair", "ezhava", "sc", "nadar", "barber", "brahmin", "viswakarma", "st", "other"]
    for (const k of order) {
      if (d[k] != null) {
        const label = k === "sc" ? "SC" : k === "st" ? "ST" : k[0].toUpperCase() + k.slice(1)
        out.push(`| ${label} | ${fmtPct(d[k], 1)}% |`)
      }
    }
    out.push("")
  }

  const cr = ctx.communityRelevance
  if (cr) {
    out.push(`### AC-level community-relevance (from framework)`)
    if (cr.muslim) {
      out.push(
        `- **Muslim aggregate:** ${fmtPct(cr.muslim.aggregateShare)}% — tagged \`${cr.muslim.aggregateTag}\` / \`${cr.muslim.aggregateTier}\`. Sub-type: **${cr.muslim.subType}**.`
      )
    }
    if (cr.christian) {
      out.push(
        `- **Christian aggregate:** ${fmtPct(cr.christian.aggregateShare)}% — tagged \`${cr.christian.aggregateTag}\` / \`${cr.christian.aggregateTier}\`. Coordination: **${cr.christian.coordination}**.`
      )
      if (cr.christian.subRites?.length) {
        for (const sr of cr.christian.subRites) {
          out.push(`  - ${sr.name}: ${fmtPct(sr.share)}% — direction *${sr.direction}*`)
        }
      }
    }
    if (cr.hindu) {
      out.push(
        `- **Hindu profile:** \`${cr.hindu.profile}\` (Nair ${cr.hindu.nair}% / Ezhava ${cr.hindu.ezhava}% / SC ${cr.hindu.sc}% of Hindu population).`
      )
    }
    out.push("")
  }

  if (ctx.belt) {
    out.push(`### Political-geography belt (from \`community-belts.json\`)`)
    out.push(`${ctx.name} belongs to the **\`${ctx.belt}\`** belt.`)
    out.push("")
  }

  return out.join("\n").trimEnd()
}

function renderClassification(ctx: any): string {
  const cr = ctx.communityRelevance
  if (!cr) return ""
  const out: string[] = []
  out.push("\n## Classification (from `community-relevance.json`)\n")
  out.push("| Field | Value |")
  out.push("| --- | --- |")
  out.push(`| Primary driver | ${cr.primaryDriver ?? "—"} |`)
  out.push(`| Durability category | **${cr.durabilityCategory ?? "—"}** |`)
  out.push(`| Stable for | ${cr.stableFor ?? "—"} |`)
  out.push(`| NDA trend | ${cr.ndaTrend ?? "—"} |`)
  out.push(`| Net tag | ${cr.netTag ?? "—"} |`)
  out.push(`| Confidence | ${cr.confidence ?? "—"} |`)

  if (cr.allianceRoles) {
    out.push("\n### Alliance roles")
    for (const alliance of ["UDF", "LDF", "NDA"] as const) {
      const role = cr.allianceRoles[alliance]
      if (!role) continue
      out.push(`- **${alliance} flip path:** ${role.flipTo ?? "none identified"}`)
      out.push(`- **${alliance} blocked by:** ${role.blockFrom ?? "none — currently the structurally locked alliance"}`)
    }
  }

  if (cr.story) {
    out.push("\n### Classification narrative (template-generated from community-relevance.json)\n")
    out.push(`> ${cr.story}`)
  }

  return out.join("\n")
}

function renderMethodology(ctx: any): string {
  const out: string[] = []
  out.push("\n## Methodology notes\n")
  out.push("Two vote-share denominators are commonly cited; both shown for cross-checking:\n")
  out.push("| Alliance | ECI-format (ours) | Major-alliance-only | Δ |")
  out.push("| --- | --- | --- | --- |")
  for (const alliance of ["NDA", "LDF", "UDF"] as const) {
    const eci = ctx.shareEci2026[alliance]
    const maj = ctx.shareMajor2026[alliance]
    out.push(`| ${alliance} | ${fmtPct(eci)}% | ${fmtPct(maj)}% | ${fmtSignedPp(maj - eci)} |`)
  }
  out.push("")
  out.push(`- **ECI-format** denominator = total polled (${ctx.total2026.toLocaleString()}) — includes NOTA + minor independents.`)
  out.push(`- **Major-alliance-only** denominator = NDA + LDF + UDF candidate votes (${ctx.majorTotal2026.toLocaleString()}) — standard in TV graphics and politician communications.`)
  out.push("")
  out.push("See `[[../README#methodology]]` — when an author cites a different number, this is the first place to check.")
  return out.join("\n")
}

function renderIncumbency(ctx: any): string {
  if (!ctx.ldfMinister) return ""
  const m = ctx.ldfMinister
  const winnerCycle = ctx.cycleHistory[ctx.cycleHistory.length - 1]
  const minNorm = canonicalKeyFromName(m.name)
  const winNorm = canonicalKeyFromName(winnerCycle.winnerName)
  const lost = minNorm !== winNorm
  const out: string[] = []
  out.push("\n## Incumbency context (2021 cabinet)\n")
  out.push("From `ldf-ministers-2021.json`:")
  out.push(`- **${display(m.name)}** was the 2021-26 Minister for ${m.portfolio} in the Second Vijayan ministry, while serving as MLA for ${m.constituency}.`)
  out.push(`- In 2026 the result was: **${lost ? "lost" : "won"}**.`)
  if (lost) {
    out.push(`- Sitting-minister losses are notable for "anti-incumbency" framing.`)
  }
  return out.join("\n")
}

function renderQuestions(ctx: any): string {
  if (ctx.questionAppearances.length === 0) {
    return "\n## Featured in `/questions`\n\n*(does not appear in any of the 51 curated questions on /questions)*"
  }
  const out: string[] = []
  out.push("\n## Featured in `/questions`\n")
  for (const appearance of ctx.questionAppearances) {
    const q: QuestionTopList = ctx.questionsById[appearance.id]
    if (!q) continue
    out.push(
      `### [${q.question}](https://kerala-2026.jillen.com/questions#${q.id})`
    )
    out.push("")
    out.push(`| Rank | Seat | Candidate | ${q.metricLabel} |`)
    out.push(`| --- | --- | --- | --- |`)
    for (const r of q.rows) {
      const isThis = r.ac === ctx.ac
      const cell = (s: string) => (isThis ? `**${s}**` : s)
      out.push(
        `| ${cell(`#${r.rank}`)} | ${cell(r.constituencyName)} | ${cell(`${r.partyShort} · ${display(r.candidate)}`)} | ${cell(r.metricValue)} |`
      )
    }
    out.push("")
  }
  return out.join("\n").trimEnd()
}

function renderHandSummary(ctx: any): string {
  const out: string[] = []
  out.push("\n## Hand-composed summary\n")
  if (ctx.acSummary) {
    out.push("*From `ac-summaries.json` (v4-manually-reviewed):*\n")
    out.push(`> ${ctx.acSummary}`)
  } else {
    out.push(`*(empty — no entry in \`ac-summaries.json\` for AC ${ctx.ac})*`)
  }
  return out.join("\n")
}

function renderHereditary(ctx: any): string {
  const out: string[] = []
  out.push("\n## Hereditary-seat status\n")
  if (ctx.hereditarySeat) {
    const fam = ctx.hereditarySeat.family
      .map((m: any) => `${m.displayName} (${m.cycles.map((c: any) => c.year).join(", ")})`)
      .join(" → ")
    out.push(`**Hereditary seat.** Family lineage: ${fam}.`)
  } else {
    out.push("Not a hereditary seat. Hereditary ACs are 58 (Chittur), 83 (Thrikkakara), 85 (Piravom), 93 (Pala), 98 (Puthuppally), 106 (Kuttanad).")
  }
  return out.join("\n")
}

// ─── per-AC orchestration ────────────────────────────────────────────────────

function buildContext(
  ac: number,
  questionAppearancesByAc: Record<number, any[]>,
  questionsById: Record<string, QuestionTopList>
) {
  const acStr = String(ac)
  const nameMeta = (names as any)[acStr]
  if (!nameMeta) throw new Error(`No name entry for AC ${ac}`)

  const district = acToDistrict[acStr]
  const districtDisplay = district
    ? district.charAt(0).toUpperCase() + district.slice(1)
    : "(unknown)"
  const reservation = acToReservation[acStr] ?? "GEN"

  // ── 2026 ──
  const r2026 = (results2026 as any)[acStr]
  const candidates2026: RawCandidate2026[] = r2026.candidates
  const { total, byAlliance, shareEci, shareMajor } =
    computeShares2026(candidates2026)
  const majorTotal = byAlliance.NDA + byAlliance.LDF + byAlliance.UDF
  const shareEci2026: CycleAlliance = {
    NDA: shareEci("NDA"),
    LDF: shareEci("LDF"),
    UDF: shareEci("UDF"),
  }
  const shareMajor2026: CycleAlliance = {
    NDA: shareMajor("NDA"),
    LDF: shareMajor("LDF"),
    UDF: shareMajor("UDF"),
  }
  const winner = [...candidates2026].sort((a, b) => b.votes - a.votes)[0]
  const runner = [...candidates2026].sort((a, b) => b.votes - a.votes)[1]
  const margin2026 = ((winner.votes - runner.votes) / total) * 100
  const winner2026 = {
    alliance: getAllianceFor(winner.party),
    candidate: winner.name,
    party: winner.party,
  }

  // ── 2026 candidates with alliance tag ──
  const candidates2026Tagged = candidates2026.map((c) => ({
    ...c,
    votePct: (c.votes / total) * 100,
    alliance: getAllianceFor(c.party),
  }))

  // ── history (2011, 2016, 2021) ──
  const hist = (history as any)[acStr]?.elections ?? []
  const cycleHistory: any[] = []
  const historyWinners: string[] = []
  for (const yr of [2011, 2016, 2021] as const) {
    const ev = hist.find(
      (e: any) => e.year === yr && e.type === "general"
    )
    if (!ev) continue
    const sums: CycleAlliance = { NDA: 0, LDF: 0, UDF: 0 }
    for (const c of ev.candidates as HistCandidate[]) {
      if (sums[c.alliance as keyof CycleAlliance] != null) {
        sums[c.alliance as keyof CycleAlliance] += c.votePct
      }
    }
    const win = [...(ev.candidates as HistCandidate[])].sort(
      (a, b) => b.votes - a.votes
    )[0]
    cycleHistory.push({
      year: yr,
      shares: sums,
      winnerAlliance: win.alliance,
      winnerName: win.name,
      winnerParty: win.party,
      marginPct: ev.marginPct,
      candidates: (ev.candidates as HistCandidate[]).sort(
        (a, b) => b.votes - a.votes
      ),
      total: ev.turnout,
    })
    historyWinners.push(win.alliance)
  }
  cycleHistory.push({
    year: 2026,
    shares: shareEci2026,
    winnerAlliance: winner2026.alliance,
    winnerName: winner2026.candidate,
    winnerParty: winner2026.party,
    marginPct: margin2026,
    candidates: candidates2026Tagged.sort((a, b) => b.votes - a.votes),
    total,
  })
  historyWinners.push(winner2026.alliance)

  // ── deltas ──
  const find = (yr: number) => cycleHistory.find((c) => c.year === yr)
  const c2026 = find(2026)
  const delta = (a: any, b: any) => {
    if (!a || !b) return null
    return { NDA: b.shares.NDA - a.shares.NDA, LDF: b.shares.LDF - a.shares.LDF, UDF: b.shares.UDF - a.shares.UDF }
  }
  const delta_2021_2026 = delta(find(2021), c2026)
  const delta_2016_2026 = delta(find(2016), c2026)
  const delta_2011_2026 = delta(find(2011), c2026)

  // ── joined sources ──
  const acReligionEntry = (acReligion as any).constituencies[acStr]
  const districtReligionEntry = district
    ? (districtReligion as any).districts[district]
    : null
  const districtHinduEntry = district
    ? (districtHinduCastes as any).districts[district]
    : null
  const pois = (acReligiousPois as any)[acStr]
  const cr = getCommunityRelevance(ac)
  const belt = district ? getBelt(ac, district) : null
  const acSummary = getAcSummary(ac)
  const hereditarySeat = getHereditarySeat(ac)
  const ldfMinister = getLdfMinister2021(ac)
  const questionAppearances = questionAppearancesByAc[ac] ?? []

  // ── related links ──
  const related: string[] = []
  related.push(`alliance-${winner2026.alliance.toLowerCase()}`)
  if (district) related.push(`district-${district}`)
  related.push(`candidate-${canonicalSlug(winner.name)}`)
  if (runner) related.push(`candidate-${canonicalSlug(runner.name)}`)
  related.push(`party-${slugify(winner.party)}`)
  if (cr?.hindu?.profile === "nair-heavy") related.push("community-nair")
  if (cr?.hindu?.profile === "ezhava-heavy") related.push("community-ezhava")
  if (cr?.christian?.subRites?.some((s: any) => s.name === "csi")) related.push("community-csi")
  if (cr?.christian?.subRites?.some((s: any) => s.name === "latin_catholic")) related.push("community-latin-catholic")
  if (cr?.christian?.subRites?.some((s: any) => s.name === "syro_malabar")) related.push("community-syro-malabar")
  if (cr?.muslim?.subType) related.push(`community-muslim-${cr.muslim.subType}`)

  return {
    ac,
    name: nameMeta.primary,
    wikipedia: nameMeta.wikipedia ?? nameMeta.primary,
    district,
    districtDisplay,
    reservation,
    winner2026,
    margin2026,
    shareEci2026,
    shareMajor2026,
    total2026: total,
    majorTotal2026: majorTotal,
    cycleHistory,
    historyWinners,
    delta_2021_2026,
    delta_2016_2026,
    delta_2011_2026,
    acReligion: acReligionEntry,
    districtReligion: districtReligionEntry,
    districtHindu: districtHinduEntry,
    pois,
    communityRelevance: cr,
    belt,
    acSummary,
    hereditarySeat,
    ldfMinister,
    questionAppearances,
    questionsById,
    related,
  }
}

function renderDossier(ctx: any): string {
  return [
    renderFrontmatter(ctx),
    renderTitle(ctx),
    renderTldr(),
    renderTrajectory(ctx),
    renderTopCandidates(ctx),
    renderDemographics(ctx),
    renderClassification(ctx),
    renderMethodology(ctx),
    renderIncumbency(ctx),
    renderQuestions(ctx),
    renderHandSummary(ctx),
    renderHereditary(ctx),
    "",
  ].join("\n")
}

// ─── main ────────────────────────────────────────────────────────────────────

function parseArgs(): { ac?: number } {
  const args = process.argv.slice(2)
  const out: { ac?: number } = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--ac" && args[i + 1]) {
      out.ac = Number(args[i + 1])
      i++
    }
  }
  return out
}

function main() {
  const args = parseArgs()

  console.log("Building canonical-name map (cross-cycle)…")
  canonicalNameMap = buildCanonicalNameMap()
  console.log(`  ${canonicalNameMap.size} canonical candidate keys.`)

  console.log("Replaying curated questions against /questions logic…")
  const { byAc: questionAppearances, byQuestion: questionsById } =
    replayAllQuestions()
  console.log(
    `  ${Object.keys(questionAppearances).length} ACs appear in at least one of ${Object.keys(questionsById).length} questions.`
  )

  mkdirSync(OUT_DIR, { recursive: true })

  const acsToBuild = args.ac
    ? [args.ac]
    : Array.from({ length: 140 }, (_, i) => i + 1)

  let written = 0
  for (const ac of acsToBuild) {
    try {
      const ctx = buildContext(ac, questionAppearances, questionsById)
      const md = renderDossier(ctx)
      const filename = `${padAc(ac)}-${slugify(ctx.name)}.md`
      writeFileSync(resolve(OUT_DIR, filename), md, "utf-8")
      written++
    } catch (err: any) {
      console.error(`  AC ${ac} failed:`, err.message)
    }
  }
  console.log(`Wrote ${written} dossier(s) to ${OUT_DIR}`)
}

main()
