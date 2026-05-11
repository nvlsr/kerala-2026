import { communityRelevance } from "@/lib/data/community-relevance"

const tierStars = (t: string) =>
  t === "HIGH" ? "★★★" : t === "MEDIUM" ? "★★" : t === "LOW" ? "★" : "—"

const allianceCompact = (a: string | null) => a ? a.charAt(0) : "?"  // U/L/N or ?

const historyToken = (h: { y2016: string | null; y2021: string | null; y2026: string }) =>
  `${allianceCompact(h.y2016)}-${allianceCompact(h.y2021)}-${allianceCompact(h.y2026)}`

const stableToken = (s: string | null) => s ? `→${s}` : "—"

const driverShort: Record<string, string> = {
  "both-christian-muslim": "Christian + Muslim",
  "christian-subrite": "Christian (sub-rite)",
  "christian-aggregate": "Christian (aggregate)",
  "muslim": "Muslim",
  "hindu-district": "Hindu (district)",
  "diffuse": "—",
}

// Group by district, sorted by AC#
const byDistrict = new Map<string, typeof communityRelevance[number][]>()
for (const r of communityRelevance) {
  if (!byDistrict.has(r.district)) byDistrict.set(r.district, [])
  byDistrict.get(r.district)!.push(r)
}

// District display order: by lowest AC# in district
const districtOrder = [...byDistrict.entries()].sort(
  (a, b) => Math.min(...a[1].map(r => r.ac)) - Math.min(...b[1].map(r => r.ac))
)

const DISTRICT_DISPLAY: Record<string, string> = {
  kasaragod: "Kasaragod",
  kannur: "Kannur",
  wayanad: "Wayanad",
  kozhikode: "Kozhikode",
  malappuram: "Malappuram",
  palakkad: "Palakkad",
  thrissur: "Thrissur",
  ernakulam: "Ernakulam",
  idukki: "Idukki",
  kottayam: "Kottayam",
  alappuzha: "Alappuzha",
  pathanamthitta: "Pathanamthitta",
  kollam: "Kollam",
  thiruvananthapuram: "Thiruvananthapuram",
}

for (const [district, acs] of districtOrder) {
  acs.sort((a, b) => a.ac - b.ac)
  const name = DISTRICT_DISPLAY[district] ?? district
  console.log(`### ${name} (${acs.length} ACs)`)
  console.log("")
  console.log("| AC | Name | Margin | Tag | Conf | History | Stable | Driver | Note |")
  console.log("| ---: | --- | ---: | --- | :---: | :---: | :---: | --- | --- |")
  for (const r of acs) {
    const marginStr = `${r.margin >= 0 ? "+" : ""}${r.margin.toFixed(1)}pp ${r.winner}`
    const conf = tierStars(r.confidence)
    const hist = historyToken(r.history)
    const stable = stableToken(r.stableFor)
    const driver = driverShort[r.primaryDriver] ?? r.primaryDriver
    console.log(`| ${r.ac} | ${r.name} | ${marginStr} | ${r.netTag} | ${conf} | ${hist} | ${stable} | ${driver} | ${r.note} |`)
  }
  console.log("")
}

console.log("---")
console.log("")
console.log("**History column legend**: `2016-2021-2026` → letters are first character of alliance (`U`=UDF, `L`=LDF, `N`=NDA, `O`=OTHER, `?`=missing). e.g. `U-L-U` = UDF in 2016, LDF in 2021, UDF in 2026 (flipped-2026 returning to 2016 pattern).")
console.log("")
console.log("**Stable column**: `stableFor` derived from blocker pattern. `→UDF` means NDA + LDF both have structural blockers, UDF does not.")
