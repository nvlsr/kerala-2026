/**
 * Audit alliance classifications by checking which seats have one of the
 * three main alliances (UDF / LDF / NDA) entirely missing — i.e. zero
 * candidates classified to that alliance.
 *
 * In Kerala's three-front system, almost every seat has a candidate from
 * all three. When one is missing, it usually means a backed Independent
 * (or an alliance-aligned minor party) was classified as OTHER. Use the
 * report to find the likely candidate and update their `alliance` field.
 *
 *   bun run scripts/audit-alliances.ts
 *
 * Re-run after fixes to see what's left.
 */

import { readFileSync, readdirSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

type AllianceCode = "UDF" | "LDF" | "NDA" | "OTHER" | "NOTA"

type Candidate2026 = {
  name: string
  party: string
  alliance: AllianceCode
  votes: number
  isNota: boolean
}

type Seat2026 = {
  constituencyNumber: number
  constituencyName: string
  candidates: Candidate2026[]
}

type HistoricalCandidate = {
  name: string
  party: string
  alliance: AllianceCode
  votePct: number
}

type HistoricalElection = {
  year: number
  type: string
  candidates: HistoricalCandidate[]
}

type HistoricalSeat = {
  constituencyNumber: number
  constituencyName: string
  elections: HistoricalElection[]
}

const seats2026: Seat2026[] = JSON.parse(
  readFileSync(join(root, "data/kerala-2026.json"), "utf8")
)

const histDir = join(root, "data/historical")
const histFiles = readdirSync(histDir).filter(
  (f) => f.startsWith("S11-") && f.endsWith(".json")
)
const histSeats: HistoricalSeat[] = histFiles.map((f) =>
  JSON.parse(readFileSync(join(histDir, f), "utf8"))
)
histSeats.sort((a, b) => a.constituencyNumber - b.constituencyNumber)

// ─── Unified per-cycle view ─────────────────────────────────────────────

type AuditCandidate = {
  name: string
  party: string
  alliance: AllianceCode
  voteShare: number // 0..100
}

type AuditSeat = {
  constituencyNumber: number
  constituencyName: string
  candidates: AuditCandidate[]
}

function audit2026(): AuditSeat[] {
  return seats2026.map((s) => {
    const real = s.candidates.filter((c) => !c.isNota)
    const total = real.reduce((acc, c) => acc + c.votes, 0)
    return {
      constituencyNumber: s.constituencyNumber,
      constituencyName: s.constituencyName,
      candidates: real.map((c) => ({
        name: c.name,
        party: c.party,
        alliance: c.alliance,
        voteShare: total > 0 ? (c.votes / total) * 100 : 0,
      })),
    }
  })
}

function auditHistorical(year: number): AuditSeat[] {
  const out: AuditSeat[] = []
  for (const seat of histSeats) {
    const e = seat.elections.find(
      (e) => e.year === year && e.type === "general"
    )
    if (!e) continue
    out.push({
      constituencyNumber: seat.constituencyNumber,
      constituencyName: seat.constituencyName,
      candidates: e.candidates
        .filter((c) => c.party !== "NOTA")
        .map((c) => ({
          name: c.name,
          party: c.party,
          alliance: c.alliance,
          voteShare: c.votePct,
        })),
    })
  }
  return out
}

type ByElectionAuditSeat = AuditSeat & { year: number; reason: string | null }

function auditByElections(): ByElectionAuditSeat[] {
  const out: ByElectionAuditSeat[] = []
  for (const seat of histSeats) {
    for (const e of seat.elections) {
      if (e.type !== "by-election") continue
      out.push({
        constituencyNumber: seat.constituencyNumber,
        constituencyName: seat.constituencyName,
        year: e.year,
        reason: (e as { reason?: string | null }).reason ?? null,
        candidates: e.candidates
          .filter((c) => c.party !== "NOTA")
          .map((c) => ({
            name: c.name,
            party: c.party,
            alliance: c.alliance,
            voteShare: c.votePct,
          })),
      })
    }
  }
  return out
}

const cycles: Array<{ year: number; seats: AuditSeat[] }> = [
  { year: 2026, seats: audit2026() },
  { year: 2021, seats: auditHistorical(2021) },
  { year: 2016, seats: auditHistorical(2016) },
  { year: 2011, seats: auditHistorical(2011) },
]

// ─── Find seats missing an alliance ─────────────────────────────────────

const MAIN: AllianceCode[] = ["UDF", "LDF", "NDA"]

type MissingReport = {
  year: number
  seat: AuditSeat
  missing: AllianceCode[]
  others: AuditCandidate[]
}

function missingForCycle(year: number, seats: AuditSeat[]): MissingReport[] {
  const out: MissingReport[] = []
  for (const seat of seats) {
    const present = new Set<AllianceCode>(seat.candidates.map((c) => c.alliance))
    const missing = MAIN.filter((a) => !present.has(a))
    if (missing.length === 0) continue
    const others = seat.candidates
      .filter((c) => c.alliance === "OTHER")
      .sort((a, b) => b.voteShare - a.voteShare)
    out.push({ year, seat, missing, others })
  }
  return out
}

// ─── Markdown output ────────────────────────────────────────────────────

const lines: string[] = []
const out = (s = "") => lines.push(s)

out(`# Data audit — alliance classifications`)
out()
out(
  `Auto-generated by \`bun run scripts/audit-alliances.ts\`. Re-run after fixing issues to see what's left.`
)
out()

out(`## What this audit checks`)
out()
out(
  `For each cycle (2026 / 2021 / 2016 / 2011) and each seat, we check whether all three main alliances (UDF, LDF, NDA) are represented by at least one candidate. In Kerala's three-front system this is almost always true — every seat usually has a UDF, an LDF, and an NDA candidate.`
)
out()
out(
  `When an alliance is *missing* from a seat, the most likely cause is that an alliance-aligned candidate (often an Independent that the front formally backed, or a minor allied party) was classified as \`OTHER\`. The fix is to find the right OTHER candidate in that seat and update their \`alliance\` field.`
)
out()
out(
  `Each entry below shows: the missing alliance, and the seat's OTHER candidates ranked by vote share. The candidate with the highest OTHER vote share in that seat is usually the alliance-backed one to reclassify.`
)
out()

out(`## How to fix an entry`)
out()
out(
  `Each candidate's alliance lives directly on their record in \`data/kerala-2026.json\` (for 2026) or \`data/historical/S11-<N>.json\` (for cycles 2011–2021). To fix a misclassification, edit the \`alliance\` field on that record. Valid values: \`UDF\`, \`LDF\`, \`NDA\`, \`OTHER\`, \`NOTA\`.`
)
out()

// Headline counts
out(`## Summary`)
out()
out(`| Cycle | Seats with a missing alliance |`)
out(`|---:|---:|`)
for (const c of cycles) {
  const reports = missingForCycle(c.year, c.seats)
  out(`| ${c.year} | ${reports.length} of ${c.seats.length} |`)
}
out()

// Per-cycle detail
for (const c of cycles) {
  const reports = missingForCycle(c.year, c.seats)
  out(`## ${c.year}`)
  out()
  if (reports.length === 0) {
    out(`Every seat has a candidate from each main alliance. ✅`)
    out()
    continue
  }
  out(`${reports.length} seat${reports.length === 1 ? "" : "s"} missing one or more main-alliance candidates.`)
  out()
  out(
    `For each seat below: which alliance is missing, then the OTHER-classified candidates in that seat sorted by vote share. Reclassify the most likely one.`
  )
  out()

  for (const r of reports) {
    out(
      `### Seat ${r.seat.constituencyNumber} — ${r.seat.constituencyName} — missing ${r.missing.join(", ")}`
    )
    out()
    if (r.others.length === 0) {
      out(
        `_No OTHER candidates in this seat. The missing alliance simply didn't field anyone here._`
      )
      out()
      continue
    }
    out(`| Candidate | Party | Vote % |`)
    out(`|---|---|---:|`)
    for (const o of r.others) {
      out(`| ${o.name} | ${o.party} | ${o.voteShare.toFixed(1)}% |`)
    }
    out()
  }
}

// ─── By-elections ──────────────────────────────────────────────────────

const byElections = auditByElections()
const byElectionsMissing = byElections
  .map((seat) => {
    const present = new Set<AllianceCode>(
      seat.candidates.map((c) => c.alliance)
    )
    const missing = MAIN.filter((a) => !present.has(a))
    if (missing.length === 0) return null
    const others = seat.candidates
      .filter((c) => c.alliance === "OTHER")
      .sort((a, b) => b.voteShare - a.voteShare)
    return { seat, missing, others }
  })
  .filter((x): x is NonNullable<typeof x> => x !== null)

out(`## By-elections`)
out()
out(
  `By-elections are sparse — most seats don't have any in the dataset window. Listed here are by-election entries where one of UDF/LDF/NDA is missing, same fix pattern as the per-cycle sections above.`
)
out()
out(`Total by-elections in dataset: ${byElections.length}.`)
out(
  `By-elections missing a main-alliance candidate: ${byElectionsMissing.length}.`
)
out()
if (byElectionsMissing.length === 0) {
  out(`Every by-election has all three main alliances represented. ✅`)
  out()
} else {
  for (const r of byElectionsMissing) {
    out(
      `### Seat ${r.seat.constituencyNumber} — ${r.seat.constituencyName} — ${r.seat.year} by-election — missing ${r.missing.join(", ")}`
    )
    if (r.seat.reason) out(`_Reason: ${r.seat.reason}_`)
    out()
    if (r.others.length === 0) {
      out(`_No OTHER candidates in this by-election._`)
      out()
      continue
    }
    out(`| Candidate | Party | Vote % |`)
    out(`|---|---|---:|`)
    for (const o of r.others) {
      out(`| ${o.name} | ${o.party} | ${o.voteShare.toFixed(1)}% |`)
    }
    out()
  }
}

// ─── Known party-switch issues ─────────────────────────────────────────

out(`## Known party-switch issues`)
out()
out(
  `The migration used the 2026 alliance mapping for all historical cycles. Parties that switched alliances between cycles are mis-classified for cycles before their switch.`
)
out()

const SWITCHED_PARTIES: Array<{
  party: string
  partyAbbreviations: string[]
  switchYear: number
  preSwitchAlliance: AllianceCode
  postSwitchAlliance: AllianceCode
  note: string
}> = [
  {
    party: "Kerala Congress (M)",
    partyAbbreviations: ["KC(M)", "KCM", "KC (M)"],
    switchYear: 2020,
    preSwitchAlliance: "UDF",
    postSwitchAlliance: "LDF",
    note:
      "KC(M) (Jose K. Mani faction) left UDF in 2020 and joined LDF. Pre-2020 KC(M) candidates should be UDF.",
  },
  {
    party: "Kerala Congress (B)",
    partyAbbreviations: ["KC(B)", "KCB", "KC (B)"],
    switchYear: 2016,
    preSwitchAlliance: "UDF",
    postSwitchAlliance: "LDF",
    note:
      "KC(B) (Balakrishna Pillai faction) left UDF in 2016 and joined LDF. Pre-2016 KC(B) candidates should be UDF.",
  },
]

for (const sw of SWITCHED_PARTIES) {
  out(`### ${sw.party}`)
  out()
  out(`${sw.note}`)
  out()
  out(
    `Currently mapped to **${sw.postSwitchAlliance}**. Records before ${sw.switchYear} should be **${sw.preSwitchAlliance}**.`
  )
  out()

  const affected: Array<{
    year: number
    seat: HistoricalSeat
    cand: HistoricalCandidate
  }> = []
  for (const seat of histSeats) {
    for (const e of seat.elections) {
      if (e.year >= sw.switchYear) continue
      for (const cand of e.candidates) {
        if (sw.partyAbbreviations.includes(cand.party)) {
          affected.push({ year: e.year, seat, cand })
        }
      }
    }
  }

  if (affected.length === 0) {
    out(`No affected records found.`)
    out()
    continue
  }

  out(`| Year | Seat # | Seat | Candidate | Currently | Should be |`)
  out(`|---:|---:|---|---|---|---|`)
  for (const a of affected) {
    out(
      `| ${a.year} | ${a.seat.constituencyNumber} | ${a.seat.constituencyName} | ${a.cand.name} | ${a.cand.alliance} | ${sw.preSwitchAlliance} |`
    )
  }
  out()
  out(`Affected count: **${affected.length}**.`)
  out()
}

// ─── NOTA sanity ──────────────────────────────────────────────────────

out(`## NOTA sanity`)
out()
let nonNotaWithNotaAlliance = 0
let notaWithNonNotaAlliance = 0
for (const seat of seats2026) {
  for (const cand of seat.candidates) {
    if (cand.isNota && cand.alliance !== "NOTA") notaWithNonNotaAlliance++
    if (!cand.isNota && cand.alliance === "NOTA") nonNotaWithNotaAlliance++
  }
}
for (const seat of histSeats) {
  for (const e of seat.elections) {
    for (const cand of e.candidates) {
      if (cand.party === "NOTA" && cand.alliance !== "NOTA")
        notaWithNonNotaAlliance++
      if (cand.party !== "NOTA" && cand.alliance === "NOTA")
        nonNotaWithNotaAlliance++
    }
  }
}
if (notaWithNonNotaAlliance === 0 && nonNotaWithNotaAlliance === 0) {
  out(`NOTA classification consistent across all candidates. ✅`)
} else {
  out(
    `⚠️ NOTA records with non-NOTA alliance: ${notaWithNonNotaAlliance}; non-NOTA records with alliance=NOTA: ${nonNotaWithNotaAlliance}.`
  )
}
out()

// ─── Write ─────────────────────────────────────────────────────────────

const reportPath = join(root, "docs/data-audit.md")
writeFileSync(reportPath, lines.join("\n") + "\n")
console.log(`Wrote ${reportPath} (${lines.length} lines)`)
console.log()
console.log(`Summary:`)
for (const c of cycles) {
  const reports = missingForCycle(c.year, c.seats)
  console.log(
    `  ${c.year}: ${reports.length} of ${c.seats.length} seats missing a main-alliance candidate`
  )
}
