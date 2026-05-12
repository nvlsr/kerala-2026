/**
 * Phase 1 builder: generates flat tabular lookups for cross-AC queries.
 *
 * Output:
 *   twitter-responses/data/_lookups/ac-table.tsv     — 140 rows × N cols, awk-friendly
 *   twitter-responses/data/_lookups/party-alliance.json
 *
 * Usage:
 *   bun run scripts/analysis/tweet-dossiers/build-lookups.ts
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import results2026 from "../../../data/results-2026.json"
import history from "../../../data/ac-history.json"
import names from "../../../data/ac-names.json"
import districts from "../../../data/districts.json"
import reservations from "../../../data/reservations.json"
import alliancesMeta from "../../../data/alliances.json"
import communityRelevance from "../../../data/community-relevance.json"

const PROJECT_ROOT = resolve(__dirname, "..", "..", "..")
const OUT_DIR = resolve(PROJECT_ROOT, "twitter-responses", "data", "_lookups")

const partyToAlliance: Record<string, string> = (alliancesMeta as any)
  .partyToAlliance
const acToDistrict: Record<string, string> = (districts as any)
  .constituencyToDistrict
const acToReservation: Record<string, string> =
  (reservations as any).constituencyToReservation ?? {}

function getAllianceFor(party: string): string {
  return partyToAlliance[party] ?? "OTHER"
}

function getCommunityRelevance(ac: number) {
  return (communityRelevance as any[]).find((c: any) => c.ac === ac)
}

function getCycleShares(
  ac: number,
  year: number
): { NDA: number; LDF: number; UDF: number } | null {
  if (year === 2026) {
    const cands = (results2026 as any)[String(ac)].candidates as {
      party: string
      votes: number
    }[]
    const total = cands.reduce((s, c) => s + c.votes, 0)
    const sum: Record<string, number> = { NDA: 0, LDF: 0, UDF: 0 }
    for (const c of cands) {
      const al = getAllianceFor(c.party)
      if (sum[al] != null) sum[al] += c.votes
    }
    return {
      NDA: (sum.NDA / total) * 100,
      LDF: (sum.LDF / total) * 100,
      UDF: (sum.UDF / total) * 100,
    }
  }
  const ev = (history as any)[String(ac)]?.elections.find(
    (e: any) => e.year === year && e.type === "general"
  )
  if (!ev) return null
  const sum = { NDA: 0, LDF: 0, UDF: 0 }
  for (const c of ev.candidates as { alliance: string; votePct: number }[]) {
    if (sum[c.alliance as keyof typeof sum] != null) {
      sum[c.alliance as keyof typeof sum] += c.votePct
    }
  }
  return sum
}

type Row = {
  ac: number
  name: string
  district: string
  reservation: string
  winner: string
  margin: number
  nda_2026: number
  ldf_2026: number
  udf_2026: number
  nda_2021: number
  ldf_2021: number
  udf_2021: number
  nda_2016: number
  ldf_2016: number
  udf_2016: number
  nda_delta_21_26: number
  ldf_delta_21_26: number
  udf_delta_21_26: number
  muslim_pct: number | null
  christian_pct: number | null
  hindu_profile: string
  muslim_subtype: string
  primary_driver: string
  durability: string
  nda_trend: string
  net_tag: string
}

function buildRow(ac: number): Row {
  const acStr = String(ac)
  const nameMeta = (names as any)[acStr]
  const r2026 = (results2026 as any)[acStr]
  const cands = r2026.candidates as { name: string; party: string; votes: number }[]
  const total = cands.reduce((s, c) => s + c.votes, 0)
  const sorted = [...cands].sort((a, b) => b.votes - a.votes)
  const winner = sorted[0]
  const runner = sorted[1]
  const margin = ((winner.votes - runner.votes) / total) * 100

  const s2026 = getCycleShares(ac, 2026)!
  const s2021 = getCycleShares(ac, 2021) ?? { NDA: 0, LDF: 0, UDF: 0 }
  const s2016 = getCycleShares(ac, 2016) ?? { NDA: 0, LDF: 0, UDF: 0 }
  const cr = getCommunityRelevance(ac)

  return {
    ac,
    name: nameMeta.primary,
    district: acToDistrict[acStr] ?? "",
    reservation: acToReservation[acStr] ?? "GEN",
    winner: getAllianceFor(winner.party),
    margin,
    nda_2026: s2026.NDA,
    ldf_2026: s2026.LDF,
    udf_2026: s2026.UDF,
    nda_2021: s2021.NDA,
    ldf_2021: s2021.LDF,
    udf_2021: s2021.UDF,
    nda_2016: s2016.NDA,
    ldf_2016: s2016.LDF,
    udf_2016: s2016.UDF,
    nda_delta_21_26: s2026.NDA - s2021.NDA,
    ldf_delta_21_26: s2026.LDF - s2021.LDF,
    udf_delta_21_26: s2026.UDF - s2021.UDF,
    muslim_pct: cr?.muslim?.aggregateShare ?? null,
    christian_pct: cr?.christian?.aggregateShare ?? null,
    hindu_profile: cr?.hindu?.profile ?? "",
    muslim_subtype: cr?.muslim?.subType ?? "",
    primary_driver: cr?.primaryDriver ?? "",
    durability: cr?.durabilityCategory ?? "",
    nda_trend: cr?.ndaTrend ?? "",
    net_tag: cr?.netTag ?? "",
  }
}

function fmt(v: number | string | null, digits = 2): string {
  if (v == null) return ""
  if (typeof v === "number") return v.toFixed(digits)
  return v
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  const rows: Row[] = []
  for (let ac = 1; ac <= 140; ac++) {
    try {
      rows.push(buildRow(ac))
    } catch (err: any) {
      console.error(`  AC ${ac} failed:`, err.message)
    }
  }

  const cols: (keyof Row)[] = [
    "ac",
    "name",
    "district",
    "reservation",
    "winner",
    "margin",
    "nda_2026",
    "ldf_2026",
    "udf_2026",
    "nda_2021",
    "ldf_2021",
    "udf_2021",
    "nda_2016",
    "ldf_2016",
    "udf_2016",
    "nda_delta_21_26",
    "ldf_delta_21_26",
    "udf_delta_21_26",
    "muslim_pct",
    "christian_pct",
    "hindu_profile",
    "muslim_subtype",
    "primary_driver",
    "durability",
    "nda_trend",
    "net_tag",
  ]
  const header = cols.join("\t")
  const body = rows
    .map((r) => cols.map((c) => fmt(r[c] as any)).join("\t"))
    .join("\n")
  writeFileSync(resolve(OUT_DIR, "ac-table.tsv"), header + "\n" + body, "utf-8")

  writeFileSync(
    resolve(OUT_DIR, "party-alliance.json"),
    JSON.stringify(partyToAlliance, null, 2),
    "utf-8"
  )

  console.log(`Wrote ${rows.length} rows to ac-table.tsv`)
  console.log(`Wrote party-alliance.json (${Object.keys(partyToAlliance).length} parties)`)
}

main()
