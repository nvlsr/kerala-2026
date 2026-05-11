/**
 * A2 — Did the Sabarimala gold scandal hammer LDF in
 * Devaswom-route seats specifically, or was the loss uniform?
 *
 * Hypothesis (per narratives.md): "LDF lost MORE share in
 * Sabarimala-route ACs than in matched Hindu-majority controls."
 *
 * The narrative names six ACs. Five exist in our data; "Pathanamthitta"
 * is the district name, not an AC. We test:
 *
 *   1. Geographic Sabarimala-route (Aranmula, Konni, Ranni — the three
 *      ACs closest to the shrine)
 *   2. Wider "Devaswom-route" set as named (5 ACs: Aranmula, Konni,
 *      Ranni, Ettumanoor, Kottayam) — the Pathanamthitta-district
 *      pilgrim corridor + the two Kottayam-district seats with
 *      explicit Devaswom-Board / minister connections
 *   3. Devaswom ministers' own seats (Ettumanoor — Vasavan; Aranmula —
 *      Veena George; Kazhakoottam — Kadakampally Surendran). Pure
 *      minister-level scrutiny.
 *
 * Each test compares the treatment group's mean LDF Δshare ('21→'26)
 * against:
 *   (a) statewide controls (all 140 ACs)
 *   (b) Hindu-majority controls (Hindu ≥ 50% in 2025 projection)
 *
 * Statewide LDF lost ~7pp uniformly. The narrative implies the
 * Devaswom-route ACs lost MORE. If the treatment-vs-control
 * differential is small, the "Sabarimala backlash" framing is
 * generic anti-incumbency dressed up as a Hindu-issue story.
 *
 * Run: bun run scripts/analysis/narrative-a2-sabarimala.ts
 */
import * as fs from "fs"
import {
  load2026,
  loadHistorical,
  type Candidate2026 as Cand,
  type Constituency2026 as C2026,
  type HistoricalConstituency as Hist,
} from "../_lib/load"

const data2026: C2026[] = load2026()
const histByNum: Map<number, Hist> = loadHistorical()
const hist: Hist[] = [...histByNum.values()]
const acDemo = JSON.parse(
  fs.readFileSync("data/ac-religion-2025.json", "utf8")
)

// Treatment groups
const SABARIMALA_GEOGRAPHIC = new Set([113, 114, 112]) // Aranmula, Konni, Ranni
const DEVASWOM_ROUTE_FULL = new Set([113, 114, 112, 96, 97]) // + Ettumanoor + Kottayam
const MINISTERS_DEVASWOM = new Set([96, 113, 132]) // Vasavan-Ettumanoor, Veena George-Aranmula, Kadakampally-Kazhakoottam

// AC numbers → human labels for reporting
const NAMES: Record<number, string> = {
  113: "Aranmula",
  114: "Konni",
  112: "Ranni",
  96: "Ettumanoor",
  97: "Kottayam",
  132: "Kazhakoottam",
  111: "Thiruvalla",
  115: "Adoor",
}

function shareIn(cands: Cand[], a: string): number {
  let v = 0,
    t = 0
  for (const c of cands) {
    if (c.isNota) continue
    t += c.votes
    if (c.alliance === a) v += c.votes
  }
  return t > 0 ? (v / t) * 100 : 0
}

type Row = {
  seat: number
  name: string
  hindu: number
  muslim: number
  christian: number
  udfDelta: number
  ldfDelta: number
  ndaDelta: number
}

const rows: Row[] = []
for (const c of data2026) {
  const ac = acDemo.constituencies[String(c.constituencyNumber)]
  if (!ac) continue
  const h = histByNum.get(c.constituencyNumber)
  const e21 = h?.elections.find((e) => e.year === 2021 && e.type === "general")
  if (!e21) continue
  rows.push({
    seat: c.constituencyNumber,
    name: c.constituencyName,
    hindu: ac.religions.hindu,
    muslim: ac.religions.muslim,
    christian: ac.religions.christian,
    udfDelta: shareIn(c.candidates, "UDF") - shareIn(e21.candidates, "UDF"),
    ldfDelta: shareIn(c.candidates, "LDF") - shareIn(e21.candidates, "LDF"),
    ndaDelta: shareIn(c.candidates, "NDA") - shareIn(e21.candidates, "NDA"),
  })
}

console.log(`Loaded ${rows.length} ACs.\n`)

const mean = (xs: number[]) =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length

function reportGroup(label: string, treatment: Set<number>, hinduMin?: number) {
  const treat = rows.filter((r) => treatment.has(r.seat))
  const allOthers = rows.filter((r) => !treatment.has(r.seat))
  const hinduMatched = allOthers.filter((r) =>
    hinduMin == null ? true : r.hindu >= hinduMin
  )

  console.log(`=== ${label} ===`)
  console.log(`  Treatment ACs (n=${treat.length}):`)
  for (const r of treat) {
    console.log(
      `    ${r.seat.toString().padStart(3)} ${r.name.padEnd(14)}  H ${r.hindu.toFixed(1)}%  ` +
        `UDF Δ ${r.udfDelta >= 0 ? "+" : ""}${r.udfDelta.toFixed(1)}pp   ` +
        `LDF Δ ${r.ldfDelta >= 0 ? "+" : ""}${r.ldfDelta.toFixed(1)}pp   ` +
        `NDA Δ ${r.ndaDelta >= 0 ? "+" : ""}${r.ndaDelta.toFixed(1)}pp`
    )
  }
  const tLDF = mean(treat.map((r) => r.ldfDelta))
  const tUDF = mean(treat.map((r) => r.udfDelta))
  const tNDA = mean(treat.map((r) => r.ndaDelta))
  const cLDF = mean(allOthers.map((r) => r.ldfDelta))
  const cUDF = mean(allOthers.map((r) => r.udfDelta))
  const cNDA = mean(allOthers.map((r) => r.ndaDelta))
  console.log(
    `\n  Treatment mean   UDF ${tUDF >= 0 ? "+" : ""}${tUDF.toFixed(2)}pp   ` +
      `LDF ${tLDF >= 0 ? "+" : ""}${tLDF.toFixed(2)}pp   ` +
      `NDA ${tNDA >= 0 ? "+" : ""}${tNDA.toFixed(2)}pp`
  )
  console.log(
    `  Statewide ctrl   UDF ${cUDF >= 0 ? "+" : ""}${cUDF.toFixed(2)}pp   ` +
      `LDF ${cLDF >= 0 ? "+" : ""}${cLDF.toFixed(2)}pp   ` +
      `NDA ${cNDA >= 0 ? "+" : ""}${cNDA.toFixed(2)}pp   (n=${allOthers.length})`
  )
  console.log(
    `  Differential     UDF ${tUDF - cUDF >= 0 ? "+" : ""}${(tUDF - cUDF).toFixed(2)}pp   ` +
      `LDF ${tLDF - cLDF >= 0 ? "+" : ""}${(tLDF - cLDF).toFixed(2)}pp   ` +
      `NDA ${tNDA - cNDA >= 0 ? "+" : ""}${(tNDA - cNDA).toFixed(2)}pp`
  )
  if (hinduMin != null) {
    const mLDF = mean(hinduMatched.map((r) => r.ldfDelta))
    const mUDF = mean(hinduMatched.map((r) => r.udfDelta))
    const mNDA = mean(hinduMatched.map((r) => r.ndaDelta))
    console.log(
      `  Hindu≥${hinduMin}% ctrl   UDF ${mUDF >= 0 ? "+" : ""}${mUDF.toFixed(2)}pp   ` +
        `LDF ${mLDF >= 0 ? "+" : ""}${mLDF.toFixed(2)}pp   ` +
        `NDA ${mNDA >= 0 ? "+" : ""}${mNDA.toFixed(2)}pp   (n=${hinduMatched.length})`
    )
    console.log(
      `  Differential     UDF ${tUDF - mUDF >= 0 ? "+" : ""}${(tUDF - mUDF).toFixed(2)}pp   ` +
        `LDF ${tLDF - mLDF >= 0 ? "+" : ""}${(tLDF - mLDF).toFixed(2)}pp   ` +
        `NDA ${tNDA - mNDA >= 0 ? "+" : ""}${(tNDA - mNDA).toFixed(2)}pp`
    )
  }
  console.log()
}

reportGroup(
  "TEST 1 — Geographic Sabarimala route (Aranmula, Konni, Ranni)",
  SABARIMALA_GEOGRAPHIC,
  50
)
reportGroup(
  "TEST 2 — Devaswom-route as named in narrative (5 ACs)",
  DEVASWOM_ROUTE_FULL,
  50
)
reportGroup(
  "TEST 3 — Devaswom ministers' own seats (3 ACs)",
  MINISTERS_DEVASWOM,
  50
)

// Bonus: was Pathanamthitta district as a whole hit harder?
const PATHANAMTHITTA_DISTRICT = new Set([111, 112, 113, 114, 115])
reportGroup(
  "TEST 4 — Pathanamthitta district full (5 ACs incl. Thiruvalla, Adoor)",
  PATHANAMTHITTA_DISTRICT,
  50
)
console.log(
  `\n  ${NAMES[111] ?? "111"} = THIRUVALLA, ${NAMES[115] ?? "115"} = ADOOR`
)

// And the full Hindu-majority cohort baseline for reference
const hindu50 = rows.filter((r) => r.hindu >= 50)
const hindu60 = rows.filter((r) => r.hindu >= 60)
console.log(
  `\nFor reference:  Hindu ≥ 50%  n=${hindu50.length}   ` +
    `LDF Δ mean ${mean(hindu50.map((r) => r.ldfDelta)).toFixed(2)}pp`
)
console.log(
  `                Hindu ≥ 60%  n=${hindu60.length}   ` +
    `LDF Δ mean ${mean(hindu60.map((r) => r.ldfDelta)).toFixed(2)}pp`
)
console.log(
  `                Hindu ≥ 70%  n=${rows.filter((r) => r.hindu >= 70).length}   ` +
    `LDF Δ mean ${mean(
      rows.filter((r) => r.hindu >= 70).map((r) => r.ldfDelta)
    ).toFixed(2)}pp`
)
console.log(
  `                Statewide    n=${rows.length}    ` +
    `LDF Δ mean ${mean(rows.map((r) => r.ldfDelta)).toFixed(2)}pp`
)
