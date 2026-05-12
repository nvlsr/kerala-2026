/**
 * Phase 2 builder: generates one markdown dossier per community.
 *
 * Output: twitter-responses/data/communities/<slug>.md
 *
 * Covers 10 communities:
 *   - Hindu sub-castes (6): Nair, Ezhava, SC, ST, Nadar, Brahmin
 *   - Christian sub-rites (3): Syro-Malabar, Latin Catholic, CSI
 *   - Muslim (1) — with sub-sections for Malabar-bloc + Cosmopolitan
 *
 * Usage:
 *   bun run scripts/analysis/tweet-dossiers/build-community-dossiers.ts
 *   bun run scripts/analysis/tweet-dossiers/build-community-dossiers.ts --community nair
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import names from "../../../data/ac-names.json"
import districts from "../../../data/districts.json"
import districtHinduCastes from "../../../data/district-hindu-castes.json"
import districtReligion from "../../../data/district-religion.json"
import communityRelevance from "../../../data/community-relevance.json"
import acReligiousPois from "../../../data/ac-religious-pois.json"

const PROJECT_ROOT = resolve(__dirname, "..", "..", "..")
const OUT_DIR = resolve(PROJECT_ROOT, "twitter-responses", "data", "communities")
const DOCS_DIR = resolve(PROJECT_ROOT, "docs")

const acToDistrict: Record<string, string> = (districts as any).constituencyToDistrict

/** Proper-cased AC name from ac-names.json — community-relevance stores them ALL CAPS. */
function acName(ac: number): string {
  return (names as any)[String(ac)]?.primary ?? `AC ${ac}`
}

// ─── community definitions ───────────────────────────────────────────────────

type CommunityKind = "hindu-caste" | "christian-subrite" | "muslim"

type CommunityDef = {
  key: string                           // file slug
  name: string
  kind: CommunityKind
  alignment: string                     // 1-line political tendency
  caste_field?: string                  // for hindu: key in district-hindu-castes
  sub_rite_key?: string                 // for christian: matches christian.subRites[].name
  role_keywords: string[]               // for text-match against allianceRoles.flipTo / blockFrom
  narrative_file: string | null         // path relative to docs/ — full file inlined
  related: string[]                     // other dossier slugs to link
}

const COMMUNITIES: CommunityDef[] = [
  {
    key: "nair",
    name: "Nair",
    kind: "hindu-caste",
    alignment: "NDA-curious in elite layer (Nair Service Society organisation); broadly UDF-Hindu otherwise",
    caste_field: "nair",
    role_keywords: ["nair"],
    narrative_file: "caste-data.md",
    related: ["alliance-nda", "district-thiruvananthapuram", "ac-135-nemom"],
  },
  {
    key: "ezhava",
    name: "Ezhava",
    kind: "hindu-caste",
    alignment: "Structural LDF base; SNDP institutional alignment historically Left-friendly",
    caste_field: "ezhava",
    role_keywords: ["ezhava", "tiyya"],
    narrative_file: "caste-data.md",
    related: ["alliance-ldf"],
  },
  {
    key: "sc",
    name: "SC (Scheduled Castes)",
    kind: "hindu-caste",
    alignment: "Structural LDF base; reserved-seat seats follow district mood",
    caste_field: "sc",
    role_keywords: ["sc", "scheduled cast", "dalit"],
    narrative_file: "caste-data.md",
    related: ["alliance-ldf"],
  },
  {
    key: "st",
    name: "ST (Scheduled Tribes)",
    kind: "hindu-caste",
    alignment: "Wayanad-concentrated; mixed alliance pattern",
    caste_field: "st",
    role_keywords: ["st", "scheduled tribe", "tribal"],
    narrative_file: "caste-data.md",
    related: ["alliance-ldf"],
  },
  {
    key: "nadar",
    name: "Nadar",
    kind: "hindu-caste",
    alignment: "Trivandrum-concentrated; mixed alliance pattern with some BJP affinity",
    caste_field: "nadar",
    role_keywords: ["nadar"],
    narrative_file: "caste-data.md",
    related: ["district-thiruvananthapuram"],
  },
  {
    key: "brahmin",
    name: "Brahmin",
    kind: "hindu-caste",
    alignment: "Small (~2% of Hindu); BJP-aligned in upper-caste-organised politics",
    caste_field: "brahmin",
    role_keywords: ["brahmin", "nampoothiri", "namboothiri"],
    narrative_file: "caste-data.md",
    related: ["alliance-nda"],
  },
  {
    key: "syro-malabar",
    name: "Syro-Malabar Catholic",
    kind: "christian-subrite",
    alignment: "Kerala Congress (M) institutional alignment; UDF-leaning historically; cross-cutting on social issues",
    sub_rite_key: "syro_malabar",
    role_keywords: ["syro-malabar", "syro malabar", "kec(m)", "kerala congress"],
    narrative_file: "narratives/christian.md",
    related: ["alliance-udf", "district-kottayam"],
  },
  {
    key: "latin-catholic",
    name: "Latin Catholic",
    kind: "christian-subrite",
    alignment: "Coastal-belt UDF-leaning; some LDF affinity in fisher-community ACs",
    sub_rite_key: "latin_catholic",
    role_keywords: ["latin catholic", "latin-catholic", "latin"],
    narrative_file: "narratives/christian.md",
    related: ["alliance-udf"],
  },
  {
    key: "csi",
    name: "CSI (Church of South India / Reformed Protestant)",
    kind: "christian-subrite",
    alignment: "Pathanamthitta + Trivandrum belt; mixed/NDA-curious in southern fragmented-Christian ACs",
    sub_rite_key: "csi",
    role_keywords: ["csi", "church of south india", "reformed"],
    narrative_file: "narratives/christian.md",
    related: ["alliance-nda", "ac-135-nemom"],
  },
  {
    key: "muslim",
    name: "Muslim",
    kind: "muslim",
    alignment: "Two sub-types: Malabar bloc-voting (IUML/UDF stronghold); Cosmopolitan urban (split/swing)",
    role_keywords: ["muslim", "iuml"],
    narrative_file: null, // no dedicated muslim.md narrative
    related: ["alliance-udf"],
  },
]

// ─── shared utils ────────────────────────────────────────────────────────────

function fmtPct(x: number | null | undefined, digits = 1): string {
  if (x == null) return "—"
  return x.toFixed(digits)
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

function safeReadNarrative(rel: string | null): string | null {
  if (!rel) return null
  try {
    return readFileSync(resolve(DOCS_DIR, rel), "utf-8")
  } catch {
    return null
  }
}

function roleStringMatches(text: string | null | undefined, keywords: string[]): boolean {
  if (!text) return false
  const lower = text.toLowerCase()
  return keywords.some((kw) => lower.includes(kw.toLowerCase()))
}

// ─── per-community context ───────────────────────────────────────────────────

function buildHinduContext(comm: CommunityDef) {
  if (!comm.caste_field) throw new Error("Hindu community missing caste_field")
  const field = comm.caste_field

  // District-level shares (of Hindu population)
  const districtData = (districtHinduCastes as any).districts
  const districtRows: Array<{ district: string; share_of_hindu: number }> = []
  for (const [d, payload] of Object.entries(districtData as Record<string, any>)) {
    if (payload[field] != null) {
      districtRows.push({ district: d, share_of_hindu: payload[field] })
    }
  }
  districtRows.sort((a, b) => b.share_of_hindu - a.share_of_hindu)

  // State aggregate (from stateAggregate field if present)
  const stateAgg = (districtHinduCastes as any).stateAggregate?.[field] ?? null

  // ACs where this community is named in hindu.profile
  // Profile values include: "nair-heavy", "ezhava-heavy", "sc-heavy", "balanced", etc.
  const profileMatch = `${field}-heavy`
  const drivenACs = (communityRelevance as any[])
    .filter((cr) => cr.hindu?.profile === profileMatch)
    .map((cr) => ({
      ac: cr.ac,
      name: acName(cr.ac),
      district: cr.district,
      profile: cr.hindu.profile,
      shareOfHindu: cr.hindu[field] ?? null,
      durabilityCategory: cr.durabilityCategory,
      winner: cr.history?.y2026 ?? null,
    }))
    .sort((a, b) => (b.shareOfHindu ?? 0) - (a.shareOfHindu ?? 0))

  return {
    districtRows,
    stateAgg,
    drivenACs,
  }
}

function buildChristianContext(comm: CommunityDef) {
  if (!comm.sub_rite_key) throw new Error("Christian community missing sub_rite_key")
  const key = comm.sub_rite_key

  // ACs where this sub-rite has a direction tag
  const directedACs = (communityRelevance as any[])
    .filter((cr) =>
      cr.christian?.subRites?.some((s: any) => s.name === key)
    )
    .map((cr) => {
      const sub = cr.christian.subRites.find((s: any) => s.name === key)
      return {
        ac: cr.ac,
        name: acName(cr.ac),
        district: cr.district,
        share: sub?.share ?? null,
        direction: sub?.direction ?? null,
        tier: sub?.tier ?? null,
        tag: sub?.tag ?? null,
        durabilityCategory: cr.durabilityCategory,
        winner: cr.history?.y2026 ?? null,
      }
    })
    .sort((a, b) => (b.share ?? 0) - (a.share ?? 0))

  // Direction summary
  const directionCounts: Record<string, number> = {}
  for (const r of directedACs) {
    if (r.direction) directionCounts[r.direction] = (directionCounts[r.direction] ?? 0) + 1
  }

  // POI inventory — count POIs by AC where this sub-rite shows up
  const poiACs: Array<{ ac: number; name: string; district: string; count: number; total: number }> = []
  for (const [acStr, payload] of Object.entries(acReligiousPois as any)) {
    const denom = (payload as any).christianByDenom ?? {}
    const cnt = denom[key] ?? 0
    if (cnt > 0) {
      poiACs.push({
        ac: Number(acStr),
        name: (names as any)[acStr]?.primary ?? "(unknown)",
        district: acToDistrict[acStr] ?? "",
        count: cnt,
        total: (payload as any).totalPois ?? 0,
      })
    }
  }
  poiACs.sort((a, b) => b.count - a.count)
  const totalPois = poiACs.reduce((s, r) => s + r.count, 0)

  // Dominant-in-AC count
  const dominantInAcCount = Object.values(acReligiousPois as any).filter(
    (p: any) => p.dominantChristian === key
  ).length

  return {
    directedACs,
    directionCounts,
    poiACs,
    totalPois,
    dominantInAcCount,
  }
}

/**
 * Muslim sub-type labels and descriptions per the community-relevance framework.
 * Listed in order of bloc-coordination strength (most coordinated first).
 * Source of truth for what subType values exist: `data/community-relevance.json`.
 */
const MUSLIM_SUBTYPES: Array<{
  key: string
  label: string
  description: string
}> = [
  {
    key: "iuml-stronghold",
    label: "IUML stronghold (Malappuram bloc)",
    description:
      "IUML institutional alignment; coordinated voting; high share concentrations (60-77%) in Malappuram-district interior. The structural Muslim-bloc seat type — treats as an alliance block, not a swing constituency.",
  },
  {
    key: "mixed-muslim",
    label: "Mixed Muslim (Kasaragod / coastal-north)",
    description:
      "Kasaragod-district + adjacent coastal-north Kerala. Muslim share 18-54% but communal-political identity less bloc-coordinated than Malappuram interior — IUML presence diluted by local Sunni/Salafi institutional dynamics + Karnataka-border cultural mix.",
  },
  {
    key: "mixed-muslim-wayanad",
    label: "Mixed Muslim (Wayanad)",
    description:
      "Three Wayanad ACs (Mananthavady, Sulthanbathery, Kalpetta) — Muslim 19-45%. Mountain/tribal-cohabitation context; voting patterns differ from Malabar lowland.",
  },
  {
    key: "cosmopolitan",
    label: "Cosmopolitan (urban + Palakkad + south)",
    description:
      "Trivandrum + Ernakulam + Kollam urban Muslim communities, plus Palakkad-belt mixed-rural ACs. Demographically diverse — professional / business / agrarian. Lower bloc-coordination than Malabar interior; vote splits across LDF / UDF / occasional NDA at the individual level.",
  },
]

function buildMuslimContext() {
  const bySubType: Record<string, any[]> = {}
  for (const cr of (communityRelevance as any[])) {
    if (!cr.muslim) continue
    const t = cr.muslim.subType ?? "unknown"
    bySubType[t] ??= []
    bySubType[t].push({
      ac: cr.ac,
      name: acName(cr.ac),
      district: cr.district,
      share: cr.muslim.aggregateShare,
      tag: cr.muslim.aggregateTag,
      tier: cr.muslim.aggregateTier,
      durabilityCategory: cr.durabilityCategory,
      winner: cr.history?.y2026 ?? null,
    })
  }
  for (const list of Object.values(bySubType)) {
    list.sort((a, b) => (b.share ?? 0) - (a.share ?? 0))
  }

  // POI inventory — Muslim POIs
  const poiACs: Array<{
    ac: number
    name: string
    district: string
    muslim: number
    total: number
    dominant: string | null
  }> = []
  for (const [acStr, payload] of Object.entries(acReligiousPois as any)) {
    const m = (payload as any).byReligion?.muslim ?? 0
    if (m > 0) {
      poiACs.push({
        ac: Number(acStr),
        name: (names as any)[acStr]?.primary ?? "(unknown)",
        district: acToDistrict[acStr] ?? "",
        muslim: m,
        total: (payload as any).totalPois ?? 0,
        dominant: (payload as any).dominantMuslim ?? null,
      })
    }
  }
  poiACs.sort((a, b) => b.muslim - a.muslim)
  const totalMuslimPois = poiACs.reduce((s, r) => s + r.muslim, 0)

  return { bySubType, poiACs, totalMuslimPois }
}

function buildAllianceRoleCounts(comm: CommunityDef) {
  // For each alliance × {flipTo, blockFrom}, count ACs whose text mentions any role_keyword.
  const counts: Record<string, { flipTo: number; blockFrom: number }> = {
    UDF: { flipTo: 0, blockFrom: 0 },
    LDF: { flipTo: 0, blockFrom: 0 },
    NDA: { flipTo: 0, blockFrom: 0 },
  }
  const flipExamples: Record<string, Array<{ ac: number; name: string; text: string }>> = {
    UDF: [],
    LDF: [],
    NDA: [],
  }
  const blockExamples: Record<string, Array<{ ac: number; name: string; text: string }>> = {
    UDF: [],
    LDF: [],
    NDA: [],
  }

  for (const cr of (communityRelevance as any[])) {
    if (!cr.allianceRoles) continue
    for (const alliance of ["UDF", "LDF", "NDA"] as const) {
      const role = cr.allianceRoles[alliance]
      if (!role) continue
      if (roleStringMatches(role.flipTo, comm.role_keywords)) {
        counts[alliance].flipTo++
        if (flipExamples[alliance].length < 5) {
          flipExamples[alliance].push({ ac: cr.ac, name: acName(cr.ac), text: role.flipTo })
        }
      }
      if (roleStringMatches(role.blockFrom, comm.role_keywords)) {
        counts[alliance].blockFrom++
        if (blockExamples[alliance].length < 5) {
          blockExamples[alliance].push({ ac: cr.ac, name: acName(cr.ac), text: role.blockFrom })
        }
      }
    }
  }
  return { counts, flipExamples, blockExamples }
}

function buildContext(comm: CommunityDef) {
  const allianceRoles = buildAllianceRoleCounts(comm)
  let kindCtx: any = {}
  if (comm.kind === "hindu-caste") kindCtx = buildHinduContext(comm)
  else if (comm.kind === "christian-subrite") kindCtx = buildChristianContext(comm)
  else if (comm.kind === "muslim") kindCtx = buildMuslimContext()
  const narrative = safeReadNarrative(comm.narrative_file)
  return { ...comm, ...kindCtx, allianceRoles, narrative }
}

// ─── rendering ───────────────────────────────────────────────────────────────

function renderFrontmatter(ctx: any): string {
  const lines: string[] = ["---"]
  lines.push(`type: community`)
  lines.push(`key: ${ctx.key}`)
  lines.push(`slug: community-${ctx.key}`)
  lines.push(`name: ${ctx.name}`)
  lines.push(`parent_religion: ${ctx.kind === "muslim" ? "muslim" : ctx.kind === "christian-subrite" ? "christian" : "hindu"}`)
  lines.push(`political_alignment_tendency: ${JSON.stringify(ctx.alignment)}`)
  lines.push(`data_granularity: ${ctx.kind === "hindu-caste" ? "district" : "ac"}`)
  lines.push("")
  if (ctx.kind === "hindu-caste") {
    lines.push(`state_share_of_hindu_pct: ${ctx.stateAgg ?? "null"}`)
    if (ctx.districtRows.length > 0) {
      lines.push(`top_district: ${ctx.districtRows[0].district}`)
      lines.push(`top_district_share_of_hindu: ${ctx.districtRows[0].share_of_hindu}`)
    }
    lines.push(`ac_count_driven_by_community: ${ctx.drivenACs.length}`)
  } else if (ctx.kind === "christian-subrite") {
    lines.push(`ac_count_with_direction_tag: ${ctx.directedACs.length}`)
    lines.push(`ac_count_dominant_christian_subrite: ${ctx.dominantInAcCount}`)
    lines.push(`total_pois_statewide: ${ctx.totalPois}`)
    lines.push(`direction_distribution:`)
    for (const [d, n] of Object.entries(ctx.directionCounts as Record<string, number>)) {
      lines.push(`  ${d}: ${n}`)
    }
  } else if (ctx.kind === "muslim") {
    lines.push(`ac_count_by_subtype:`)
    for (const st of MUSLIM_SUBTYPES) {
      const ct = (ctx.bySubType[st.key] ?? []).length
      lines.push(`  ${st.key}: ${ct}`)
    }
    lines.push(`total_muslim_pois_statewide: ${ctx.totalMuslimPois}`)
  }
  lines.push("")
  lines.push(`alliance_role_counts:`)
  for (const a of ["UDF", "LDF", "NDA"] as const) {
    lines.push(`  ${a}_flip_to: ${ctx.allianceRoles.counts[a].flipTo}`)
    lines.push(`  ${a}_block_from: ${ctx.allianceRoles.counts[a].blockFrom}`)
  }
  lines.push("")
  lines.push(`related:`)
  for (const r of ctx.related) lines.push(`  - "[[${r}]]"`)
  lines.push("---")
  return lines.join("\n")
}

function renderTitle(ctx: any): string {
  return `\n# ${ctx.name}\n\nReligion: ${ctx.kind === "muslim" ? "Muslim" : ctx.kind === "christian-subrite" ? "Christian" : "Hindu"} · Political tendency: ${ctx.alignment}`
}

function renderTldr(ctx: any): string {
  const out: string[] = []
  out.push("\n## TL;DR")
  out.push("")
  if (ctx.kind === "hindu-caste") {
    const top = ctx.districtRows[0]
    out.push(
      `**${ctx.name}** is ${ctx.stateAgg ?? "—"}% of Kerala's Hindu population. Most concentrated in **${top?.district ?? "—"}** district (${top?.share_of_hindu ?? "—"}% of district Hindu). Named in **${ctx.drivenACs.length} ACs** as the structural Hindu-profile driver. Alliance-role mentions: flip-to NDA in ${ctx.allianceRoles.counts.NDA.flipTo} ACs / UDF in ${ctx.allianceRoles.counts.UDF.flipTo} / LDF in ${ctx.allianceRoles.counts.LDF.flipTo}.`
    )
    out.push("")
    out.push(
      `*Caveat:* Data granularity is **district-level** (Hindu sub-castes are not measured at AC level in our dataset). District shares come from a 2000 household survey; geographic rank is stable but absolute %s may have drifted with differential fertility. See \`docs/caste-data.md\` for full provenance.`
    )
  } else if (ctx.kind === "christian-subrite") {
    out.push(
      `**${ctx.name}** is the dominant Christian sub-rite in **${ctx.dominantInAcCount} ACs** (per OSM-mapped places of worship). Tagged with a direction in **${ctx.directedACs.length} ACs**: ${Object.entries(ctx.directionCounts as Record<string, number>).map(([d, n]) => `${n} ${d}`).join(", ")}.`
    )
  } else if (ctx.kind === "muslim") {
    const counts = MUSLIM_SUBTYPES.map((st) => {
      const n = (ctx.bySubType[st.key] ?? []).length
      return `${n} ${st.key}`
    }).join(" / ")
    out.push(
      `**Muslim community** in Kerala segments into four sub-types in our framework: ${counts}. Statewide Muslim POI inventory: ${ctx.totalMuslimPois.toLocaleString()}. The IUML-stronghold cluster is the only one that vote-coordinates as a bloc; the others split.`
    )
  }
  return out.join("\n")
}

function renderHinduFootprint(ctx: any): string {
  const out: string[] = []
  out.push("\n## Statewide footprint (district-level)\n")
  out.push("Shares are % of district's **Hindu population** (2000 household survey, see `docs/caste-data.md`). To convert to district-of-total share, multiply by district Hindu % from `data/district-religion.json`.\n")
  out.push(`| District | ${ctx.name} % of Hindu |`)
  out.push(`| --- | --- |`)
  for (const r of ctx.districtRows) {
    out.push(`| ${r.district} | ${fmtPct(r.share_of_hindu)}% |`)
  }
  if (ctx.stateAgg != null) {
    out.push(`| **Kerala (aggregate)** | **${fmtPct(ctx.stateAgg)}%** |`)
  }
  return out.join("\n")
}

function renderHinduDrivenACs(ctx: any): string {
  const out: string[] = []
  out.push(`\n## ACs where ${ctx.name} is the structural Hindu-profile driver (${ctx.drivenACs.length})\n`)
  if (ctx.drivenACs.length === 0) {
    out.push(`*(none — Hindu profile field never resolves to \`${ctx.caste_field}-heavy\`)*`)
    return out.join("\n")
  }
  out.push(`Profile tag: \`${ctx.caste_field}-heavy\` in \`community-relevance.json:hindu.profile\`.\n`)
  out.push(`| AC | District | ${ctx.name} % of district Hindu | 2026 winner | Durability |`)
  out.push(`| --- | --- | --- | --- | --- |`)
  for (const r of ctx.drivenACs.slice(0, 30)) {
    const acLink = `[${r.name}](../acs/${padAc(r.ac)}-${slugify(r.name)}.md)`
    out.push(`| ${acLink} | ${r.district} | ${fmtPct(r.shareOfHindu, 1)}% | ${r.winner ?? "—"} | ${r.durabilityCategory ?? "—"} |`)
  }
  if (ctx.drivenACs.length > 30) {
    out.push(`\n*…and ${ctx.drivenACs.length - 30} more.*`)
  }
  return out.join("\n")
}

function renderChristianDirectedACs(ctx: any): string {
  const out: string[] = []
  out.push(`\n## ACs where ${ctx.name} has a direction tag (${ctx.directedACs.length})\n`)
  out.push(`Source: \`community-relevance.json:christian.subRites[]\` matching \`name === "${ctx.sub_rite_key}"\`. Direction values: NDA-leaning, UDF-up, LDF-leaning, neutral.\n`)
  out.push(`| AC | District | Sub-rite share | Direction | 2026 winner | Durability |`)
  out.push(`| --- | --- | --- | --- | --- | --- |`)
  for (const r of ctx.directedACs.slice(0, 40)) {
    const acLink = `[${r.name}](../acs/${padAc(r.ac)}-${slugify(r.name)}.md)`
    out.push(`| ${acLink} | ${r.district} | ${fmtPct(r.share, 2)}% | ${r.direction ?? "—"} | ${r.winner ?? "—"} | ${r.durabilityCategory ?? "—"} |`)
  }
  if (ctx.directedACs.length > 40) {
    out.push(`\n*…and ${ctx.directedACs.length - 40} more.*`)
  }
  return out.join("\n")
}

function renderChristianPOIs(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Religious-institution POI inventory\n`)
  out.push(`Statewide total: **${ctx.totalPois.toLocaleString()}** ${ctx.name} POIs across ${ctx.poiACs.length} ACs. Dominant sub-rite in **${ctx.dominantInAcCount}** ACs.\n`)
  out.push(`### Top 20 ACs by ${ctx.name} POI count\n`)
  out.push(`| AC | District | ${ctx.name} POIs | Total AC POIs |`)
  out.push(`| --- | --- | --- | --- |`)
  for (const r of ctx.poiACs.slice(0, 20)) {
    const acLink = `[${r.name}](../acs/${padAc(r.ac)}-${slugify(r.name)}.md)`
    out.push(`| ${acLink} | ${r.district} | ${r.count} | ${r.total} |`)
  }
  return out.join("\n")
}

function renderMuslimSections(ctx: any): string {
  const out: string[] = []
  for (const st of MUSLIM_SUBTYPES) {
    const list = ctx.bySubType[st.key] ?? []
    if (list.length === 0) continue
    out.push(`\n## Muslim — ${st.label} (${list.length} ACs)\n`)
    out.push(`*${st.description}*\n`)
    out.push(`| AC | District | Muslim share | Tag | 2026 winner |`)
    out.push(`| --- | --- | --- | --- | --- |`)
    for (const r of list.slice(0, 30)) {
      const acLink = `[${r.name}](../acs/${padAc(r.ac)}-${slugify(r.name)}.md)`
      out.push(`| ${acLink} | ${r.district} | ${fmtPct(r.share)}% | ${r.tag ?? "—"} | ${r.winner ?? "—"} |`)
    }
    if (list.length > 30) out.push(`\n*…and ${list.length - 30} more.*`)
  }
  // Surface any unknown sub-types we didn't anticipate
  for (const [key, list] of Object.entries(ctx.bySubType as Record<string, any[]>)) {
    if (MUSLIM_SUBTYPES.some((s) => s.key === key)) continue
    out.push(`\n## Muslim — Sub-type \`${key}\` (${list.length} ACs)\n`)
    out.push(`*(unrecognised sub-type — extend MUSLIM_SUBTYPES in \`build-community-dossiers.ts\` to add a description)*\n`)
    out.push(`| AC | District | Muslim share | Tag | 2026 winner |`)
    out.push(`| --- | --- | --- | --- | --- |`)
    for (const r of list.slice(0, 30)) {
      const acLink = `[${r.name}](../acs/${padAc(r.ac)}-${slugify(r.name)}.md)`
      out.push(`| ${acLink} | ${r.district} | ${fmtPct(r.share)}% | ${r.tag ?? "—"} | ${r.winner ?? "—"} |`)
    }
  }
  return out.join("\n")
}

function renderMuslimPOIs(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Muslim POI inventory\n`)
  out.push(`Statewide Muslim POIs (mosques, dargahs, etc. mapped via OSM): **${ctx.totalMuslimPois.toLocaleString()}** across ${ctx.poiACs.length} ACs.\n`)
  out.push(`### Top 20 ACs by Muslim POI count\n`)
  out.push(`| AC | District | Muslim POIs | Total AC POIs | Dominant sub-denom |`)
  out.push(`| --- | --- | --- | --- | --- |`)
  for (const r of ctx.poiACs.slice(0, 20)) {
    const acLink = `[${r.name}](../acs/${padAc(r.ac)}-${slugify(r.name)}.md)`
    out.push(`| ${acLink} | ${r.district} | ${r.muslim} | ${r.total} | ${r.dominant ?? "—"} |`)
  }
  return out.join("\n")
}

function renderAllianceRoles(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Alliance roles (text-match on community-relevance allianceRoles)\n`)
  out.push(
    `Heuristic: counts ACs whose \`flipTo\` or \`blockFrom\` text mentions any of these keywords: \`${ctx.role_keywords.join("`, `")}\` (case-insensitive). The framework's role strings are prose, so this is approximate — examples included for spot-checking.\n`
  )
  out.push(`| Alliance | flip-to mentions | block-from mentions |`)
  out.push(`| --- | --- | --- |`)
  for (const a of ["NDA", "UDF", "LDF"] as const) {
    out.push(`| ${a} | ${ctx.allianceRoles.counts[a].flipTo} | ${ctx.allianceRoles.counts[a].blockFrom} |`)
  }

  for (const a of ["NDA", "UDF", "LDF"] as const) {
    if (ctx.allianceRoles.flipExamples[a].length === 0 && ctx.allianceRoles.blockExamples[a].length === 0) continue
    out.push(`\n### Examples — ${a}\n`)
    if (ctx.allianceRoles.flipExamples[a].length > 0) {
      out.push(`*flip-to ${a}:*`)
      for (const ex of ctx.allianceRoles.flipExamples[a]) {
        out.push(`- ${ex.name} (AC ${ex.ac}): "${ex.text}"`)
      }
    }
    if (ctx.allianceRoles.blockExamples[a].length > 0) {
      out.push(`*block-from ${a}:*`)
      for (const ex of ctx.allianceRoles.blockExamples[a]) {
        out.push(`- ${ex.name} (AC ${ex.ac}): "${ex.text}"`)
      }
    }
  }
  return out.join("\n")
}

function renderNarrative(ctx: any): string {
  const out: string[] = []
  out.push(`\n## Narrative reference\n`)
  if (ctx.narrative) {
    out.push(`*Full inline copy of \`docs/${ctx.narrative_file}\` — embedded so this dossier is self-contained.*\n`)
    out.push(`---\n`)
    out.push(ctx.narrative)
  } else if (ctx.narrative_file) {
    out.push(`*(narrative file \`docs/${ctx.narrative_file}\` not found)*`)
  } else {
    out.push(`*(no dedicated narrative file for this community in \`docs/narratives/\`. Cross-reference \`docs/narratives/{udf,ldf,nda}.md\` for alliance-level treatment of Muslim politics, especially \`udf.md\` for IUML/Malabar context.)*`)
  }
  return out.join("\n")
}

function renderDossier(ctx: any): string {
  const parts: string[] = [renderFrontmatter(ctx), renderTitle(ctx), renderTldr(ctx)]

  if (ctx.kind === "hindu-caste") {
    parts.push(renderHinduFootprint(ctx))
    parts.push(renderHinduDrivenACs(ctx))
  } else if (ctx.kind === "christian-subrite") {
    parts.push(renderChristianDirectedACs(ctx))
    parts.push(renderChristianPOIs(ctx))
  } else if (ctx.kind === "muslim") {
    parts.push(renderMuslimSections(ctx))
    parts.push(renderMuslimPOIs(ctx))
  }

  parts.push(renderAllianceRoles(ctx))
  parts.push(renderNarrative(ctx))
  parts.push("")
  return parts.join("\n")
}

// ─── main ────────────────────────────────────────────────────────────────────

function parseArgs(): { community?: string } {
  const args = process.argv.slice(2)
  const out: { community?: string } = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--community" && args[i + 1]) {
      out.community = args[i + 1]
      i++
    }
  }
  return out
}

function main() {
  const args = parseArgs()
  mkdirSync(OUT_DIR, { recursive: true })

  const toBuild = args.community
    ? COMMUNITIES.filter((c) => c.key === args.community)
    : COMMUNITIES

  let written = 0
  for (const comm of toBuild) {
    try {
      const ctx = buildContext(comm)
      const md = renderDossier(ctx)
      writeFileSync(resolve(OUT_DIR, `${comm.key}.md`), md, "utf-8")
      written++
    } catch (err: any) {
      console.error(`  ${comm.key} failed:`, err.stack ?? err.message)
    }
  }
  console.log(`Wrote ${written} community dossier(s) to ${OUT_DIR}`)
}

main()
