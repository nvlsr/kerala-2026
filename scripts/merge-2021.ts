/**
 * Merge scraped 2021 data into historical files.
 *
 * Strategy: REPLACE the 2021 general election candidates list per seat
 * with the scrape (which is comprehensive and matches Wikipedia's totals).
 * Preserve `result` and `reason` from existing entries.
 *
 * Party-name canonicalization uses an explicit map below. Unmapped codes
 * are flagged at the end for review.
 */
import * as fs from "fs"
import * as path from "path"

type Alliance = "UDF" | "LDF" | "NDA" | "OTHER" | "NOTA"
type Mapped = { canonicalName: string; alliance: Alliance }

// Canonical mapping. Names match existing entries in our DB where possible.
const partyMap: Record<string, Mapped> = {
  // ============= UDF =============
  INC: { canonicalName: "Indian National Congress", alliance: "UDF" },
  IUML: { canonicalName: "Indian Union Muslim League", alliance: "UDF" },
  KC: { canonicalName: "Kerala Congress", alliance: "UDF" },
  RSP: { canonicalName: "Revolutionary Socialist Party", alliance: "UDF" },
  KCA: { canonicalName: "Kerala Congress (Jacob)", alliance: "UDF" },
  RMP: { canonicalName: "Revolutionary Marxist Party of India", alliance: "UDF" },
  UDF: { canonicalName: "Independent (UDF)", alliance: "UDF" },
  CMP: { canonicalName: "Communist Marxist Party Kerala State Committee", alliance: "UDF" },

  // ============= LDF =============
  CPIM: { canonicalName: "Communist Party of India (Marxist)", alliance: "LDF" },
  CPI: { canonicalName: "Communist Party of India", alliance: "LDF" },
  KCM: { canonicalName: "Kerala Congress (M)", alliance: "LDF" },
  JDS: { canonicalName: "Janata Dal (Secular)", alliance: "LDF" },
  NCP: {
    canonicalName: "Nationalist Congress Party - Sharadchandra Pawar",
    alliance: "LDF",
  },
  LJD: { canonicalName: "Loktantrik Janata Dal", alliance: "LDF" },
  INL: { canonicalName: "Indian National League", alliance: "LDF" },
  CS: { canonicalName: "Congress (Secular)", alliance: "LDF" },
  LDF: { canonicalName: "Independent (LDF)", alliance: "LDF" },
  KCB: { canonicalName: "Kerala Congress (B)", alliance: "LDF" },
  JKC: { canonicalName: "JKC", alliance: "LDF" },
  NSC: { canonicalName: "National Secular Conference", alliance: "LDF" },

  // ============= NDA =============
  BJP: { canonicalName: "Bharatiya Janata Party", alliance: "NDA" },
  BDJS: { canonicalName: "Bharath Dharma Jana Sena", alliance: "NDA" },
  AIADMK: { canonicalName: "AIADMK", alliance: "NDA" },
  NDA: { canonicalName: "Independent (NDA)", alliance: "NDA" },

  // ============= OTHER (small parties / generic Independents) =============
  IND: { canonicalName: "Independent", alliance: "OTHER" },
  T2P: { canonicalName: "Twenty 20 Party", alliance: "OTHER" },
  SDPI: { canonicalName: "Social Democratic Party Of India", alliance: "OTHER" },
  BSP: { canonicalName: "Bahujan Samaj Party", alliance: "OTHER" },
  KJS: { canonicalName: "KJ(S)", alliance: "OTHER" },
  WPI: { canonicalName: "Welfare Party of India", alliance: "OTHER" },
  SUCIC: {
    canonicalName: "Socialist Unity Centre Of India (COMMUNIST)",
    alliance: "OTHER",
  },
  DSJP: { canonicalName: "DSJP", alliance: "OTHER" },
  ADHMPI: { canonicalName: "Anna DHRM", alliance: "OTHER" },
  MCPIU: { canonicalName: "MCPI(U)", alliance: "OTHER" },
  API: { canonicalName: "Ambedkarite Party of India", alliance: "OTHER" },
  BDP: { canonicalName: "Bahujan Dravida Party", alliance: "OTHER" },
  ICSP: { canonicalName: "ICSP", alliance: "OTHER" },
  CPIMLR: {
    canonicalName: "Communist Party of India (Marxist-Leninist) Red Star",
    alliance: "OTHER",
  },
  RJD: { canonicalName: "Rashtriya Janata Dal", alliance: "OTHER" },
  DHRMP: { canonicalName: "Anna DHRM", alliance: "OTHER" },
  JDU: { canonicalName: "Janata Dal (United)", alliance: "OTHER" },
  IGP: { canonicalName: "Indian Gandhiyan Party", alliance: "OTHER" },
  ABHMS: { canonicalName: "ABHMS", alliance: "OTHER" },
  SS: { canonicalName: "SS", alliance: "OTHER" },
  KKC: { canonicalName: "KKC", alliance: "OTHER" },
  JRS: { canonicalName: "JRS", alliance: "OTHER" },
  KJP: { canonicalName: "KJP", alliance: "OTHER" },
  NLP: { canonicalName: "NLP", alliance: "OTHER" },
  RPIA: { canonicalName: "RPIA", alliance: "OTHER" },
  SDC: { canonicalName: "SDC", alliance: "OTHER" },
  SI: { canonicalName: "SI", alliance: "OTHER" },
  SVJP: { canonicalName: "SVJP", alliance: "OTHER" },
  SFB: { canonicalName: "SFB", alliance: "OTHER" },
  NEWLP: { canonicalName: "NEWLP", alliance: "OTHER" },
}

const unmappedCodes = new Map<string, number>()

function mapParty(code: string): Mapped {
  if (partyMap[code]) return partyMap[code]
  unmappedCodes.set(code, (unmappedCodes.get(code) || 0) + 1)
  return { canonicalName: code, alliance: "OTHER" }
}

type ScrapedSeat = {
  seat: number
  constituencyName: string
  electorate: number | null
  validVotesPolled: number | null
  pollingPct: number | null
  nota: number | null
  margin: number | null
  candidates: Array<{ name: string; party: string; votes: number; pct: number }>
}

const scrapeDir = "data/scraped-2021"
const histDir = "data/historical"

let updatedFiles = 0
let unchangedFiles = 0

for (let n = 1; n <= 140; n++) {
  const scrapeFile = path.join(scrapeDir, `seat-${n}.json`)
  const histFile = path.join(histDir, `S11-${n}.json`)
  if (!fs.existsSync(scrapeFile) || !fs.existsSync(histFile)) continue

  const scrape = JSON.parse(fs.readFileSync(scrapeFile, "utf8")) as ScrapedSeat
  const hist = JSON.parse(fs.readFileSync(histFile, "utf8"))
  const e2021Idx = (hist.elections || []).findIndex(
    (e: { year: number; type: string }) =>
      e.year === 2021 && e.type === "general"
  )
  if (e2021Idx < 0) continue
  const old = hist.elections[e2021Idx]

  const totalValid = scrape.validVotesPolled || 0
  if (!totalValid) {
    console.error(`Seat ${n}: missing validVotesPolled, skipping`)
    continue
  }

  // Build new candidates list
  const newCandidates: Array<{
    name: string
    party: string
    votes: number
    votePct: number
    alliance: Alliance
  }> = []

  for (const c of scrape.candidates) {
    const m = mapParty(c.party)
    newCandidates.push({
      name: c.name,
      party: m.canonicalName,
      votes: c.votes,
      votePct: parseFloat((c.votes / totalValid * 100).toFixed(2)),
      alliance: m.alliance,
    })
  }

  // Add NOTA as a candidate (consistent with our 2026 convention)
  if (scrape.nota && scrape.nota > 0) {
    newCandidates.push({
      name: "NOTA",
      party: "None of the Above",
      votes: scrape.nota,
      votePct: parseFloat((scrape.nota / totalValid * 100).toFixed(2)),
      alliance: "NOTA",
    })
  }

  // Sort by votes descending (our convention)
  newCandidates.sort((a, b) => b.votes - a.votes)

  // Recompute margin from top two candidates (excluding NOTA)
  const topTwo = newCandidates.filter((c) => c.alliance !== "NOTA").slice(0, 2)
  const computedMargin = topTwo.length === 2 ? topTwo[0].votes - topTwo[1].votes : 0
  const finalMargin = scrape.margin ?? computedMargin

  hist.elections[e2021Idx] = {
    year: 2021,
    type: "general",
    reason: old.reason ?? null,
    candidates: newCandidates,
    margin: finalMargin,
    marginPct: parseFloat((finalMargin / totalValid * 100).toFixed(2)),
    turnout: totalValid,
    turnoutPct: scrape.pollingPct ?? old.turnoutPct,
    result: old.result ?? null,
  }

  fs.writeFileSync(histFile, JSON.stringify(hist, null, 2) + "\n")
  updatedFiles++
}

console.log(`Updated ${updatedFiles} historical files`)
console.log(`Unchanged: ${unchangedFiles}`)
console.log("")
if (unmappedCodes.size > 0) {
  console.log("Unmapped party codes (defaulted to OTHER, name = code):")
  for (const [code, count] of [...unmappedCodes.entries()].sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`  ${code}: ${count} occurrences`)
  }
} else {
  console.log("All party codes mapped ✓")
}
