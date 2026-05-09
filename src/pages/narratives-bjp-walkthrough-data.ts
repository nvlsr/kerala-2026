/**
 * Cohort row data + vote-share decomposition data for the BJP
 * narrative page. Extracted into a sibling file so the page
 * component itself stays scannable. All numbers are pre-computed
 * from canonical year-aware alliance attribution in
 * `data/historical/` and `data/kerala-2026.json`.
 */


/**
 * Combined view: union of Cohort 1 (snapshot definition) and Cohort 2
 * (sustained-trajectory definition), deduplicated. 11 unique seats,
 * sorted by 2026 BJP share descending. The `trajectory` flag marks
 * the 4 seats that also satisfy the multi-cycle (Cohort 2) criterion.
 */
export type MatureGrowerRow = {
  ac: number
  seat: string
  district: string
  hcm: string
  base21: number
  share26: number
  delta: number
  outcome: string
  trajectory?: boolean
}

export const MATURE_GROWER_ROWS: MatureGrowerRow[] = [
  { ac: 135, seat: "Nemom", district: "Trivandrum", hcm: "69/17/14", base21: 35.5, share26: 40.9, delta: 5.4, outcome: "BJP WIN" },
  { ac: 126, seat: "Chathannoor", district: "Kollam", hcm: "72/13/15", base21: 30.6, share26: 38.2, delta: 7.6, outcome: "BJP WIN", trajectory: true },
  { ac: 132, seat: "Kazhakoottam", district: "Trivandrum", hcm: "69/17/14", base21: 29.1, share26: 35.7, delta: 6.6, outcome: "BJP WIN" },
  { ac: 128, seat: "Attingal", district: "Trivandrum", hcm: "69/17/14", base21: 25.9, share26: 30.8, delta: 4.9, outcome: "LDF", trajectory: true },
  { ac: 111, seat: "Thiruvalla", district: "Pathanamthitta", hcm: "48/48/4", base21: 16.2, share26: 30.7, delta: 14.5, outcome: "UDF" },
  { ac: 68, seat: "Nattika", district: "Thrissur", hcm: "64/16/20", base21: 22.0, share26: 29.0, delta: 7.0, outcome: "LDF" },
  { ac: 27, seat: "Kozhikode North", district: "Kozhikode", hcm: "57/2/41", base21: 22.5, share26: 28.3, delta: 5.8, outcome: "UDF" },
  { ac: 93, seat: "Pala", district: "Kottayam", hcm: "38/52/10", base21: 7.9, share26: 26.1, delta: 18.2, outcome: "UDF" },
  { ac: 28, seat: "Kozhikode South", district: "Kozhikode", hcm: "57/2/41", base21: 20.9, share26: 25.6, delta: 4.7, outcome: "UDF", trajectory: true },
  { ac: 52, seat: "Ottappalam", district: "Palakkad", hcm: "54/2/43", base21: 15.5, share26: 25.1, delta: 9.6, outcome: "LDF" },
  { ac: 107, seat: "Haripad", district: "Alappuzha", hcm: "79/9/11", base21: 11.9, share26: 21.5, delta: 9.6, outcome: "UDF", trajectory: true },
]

export type Cohort3Row = {
  ac: number
  seat: string
  district: string
  hcm: string
  base21: number
  base21Source: string
  share26: number
  delta: number
  outcome: string
  mechanism: string
}

export const COHORT_3_ROWS: Cohort3Row[] = [
  {
    ac: 93,
    seat: "Pala",
    district: "Kottayam",
    hcm: "38/52/10",
    base21: 7.9,
    base21Source: "BJP",
    share26: 26.1,
    delta: 18.2,
    outcome: "UDF",
    mechanism: "Marquee Christian (Shone George) at Christian-majority seat",
  },
  {
    ac: 116,
    seat: "Karunagappally",
    district: "Kollam",
    hcm: "65/5/28",
    base21: 7.0,
    base21Source: "BJP",
    share26: 18.7,
    delta: 11.6,
    outcome: "UDF",
    mechanism:
      "Same-vehicle continuity — BJP fielded both years; organic build",
  },
  {
    ac: 127,
    seat: "Varkala",
    district: "Trivandrum",
    hcm: "71/4/25",
    base21: 8.3,
    base21Source: "BDJS",
    share26: 19.9,
    delta: 11.6,
    outcome: "LDF",
    mechanism: "Slot rotation — BDJS held 2021, BJP took back 2026",
  },
]

export type Cohort4Row = {
  ac: number
  seat: string
  district: string
  hcm: string
  base21: number
  share26: number
  delta: number
  outcome: string
}

export const COHORT_4A_ROWS: Cohort4Row[] = [
  {
    ac: 114,
    seat: "Konni",
    district: "Pathanamthitta",
    hcm: "61/33/5",
    base21: 21.9,
    share26: 0.0,
    delta: -21.9,
    outcome: "LDF (BJP withdrew)",
  },
  {
    ac: 67,
    seat: "Thrissur",
    district: "Thrissur",
    hcm: "54/39/5",
    base21: 31.3,
    share26: 23.3,
    delta: -8.0,
    outcome: "UDF",
  },
  {
    ac: 101,
    seat: "Poonjar",
    district: "Kottayam",
    hcm: "42/41/16",
    base21: 29.9,
    share26: 25.1,
    delta: -4.8,
    outcome: "UDF",
  },
  {
    ac: 109,
    seat: "Mavelikkara",
    district: "Alappuzha",
    hcm: "73/18/7",
    base21: 20.5,
    share26: 16.3,
    delta: -4.2,
    outcome: "LDF",
  },
  {
    ac: 70,
    seat: "Irinjalakuda",
    district: "Thrissur",
    hcm: "63/26/9",
    base21: 22.1,
    share26: 17.9,
    delta: -4.2,
    outcome: "UDF",
  },
  {
    ac: 71,
    seat: "Pudukkad",
    district: "Thrissur",
    hcm: "58/35/5",
    base21: 22.3,
    share26: 18.3,
    delta: -4.0,
    outcome: "LDF",
  },
  {
    ac: 51,
    seat: "Shornur",
    district: "Palakkad",
    hcm: "60/1/37",
    base21: 24.3,
    share26: 20.9,
    delta: -3.4,
    outcome: "LDF",
  },
  {
    ac: 2,
    seat: "Kasaragod",
    district: "Kasaragod",
    hcm: "43/2/53",
    base21: 34.9,
    share26: 31.9,
    delta: -3.0,
    outcome: "UDF",
  },
]

export type Cohort6Row = {
  ac: number
  seat: string
  district: string
  nda21: number
  nda26: number
  ndaD: number
  udfD: number
  ldfD: number
  gap: number
  outcome: string
  highlight?: boolean
}

export const COHORT_6_ROWS: Cohort6Row[] = [
  {
    ac: 93,
    seat: "Pala",
    district: "Kottayam",
    nda21: 7.9,
    nda26: 26.1,
    ndaD: 18.2,
    udfD: -12.9,
    ldfD: -4.0,
    gap: 31.1,
    outcome: "UDF",
  },
  {
    ac: 63,
    seat: "Guruvayoor",
    district: "Thrissur",
    nda21: 0.0,
    nda26: 17.9,
    ndaD: 17.9,
    udfD: -0.4,
    ldfD: -11.6,
    gap: 18.3,
    outcome: "LDF",
  },
  {
    ac: 116,
    seat: "Karunagappally",
    district: "Kollam",
    nda21: 7.0,
    nda26: 18.7,
    ndaD: 11.6,
    udfD: -6.4,
    ldfD: -5.0,
    gap: 18.1,
    outcome: "UDF",
  },
  {
    ac: 52,
    seat: "Ottappalam",
    district: "Palakkad",
    nda21: 15.5,
    nda26: 25.1,
    ndaD: 9.6,
    udfD: -8.3,
    ldfD: -1.8,
    gap: 17.9,
    outcome: "LDF",
  },
  {
    ac: 13,
    seat: "Thalassery",
    district: "Kannur",
    nda21: 0.0,
    nda26: 15.8,
    ndaD: 15.8,
    udfD: 0.4,
    ldfD: -12.9,
    gap: 15.4,
    outcome: "LDF",
  },
  {
    ac: 18,
    seat: "Sulthanbathery",
    district: "Wayanad",
    nda21: 9.1,
    nda26: 17.8,
    ndaD: 8.8,
    udfD: -3.4,
    ldfD: -5.8,
    gap: 12.2,
    outcome: "UDF",
  },
  {
    ac: 107,
    seat: "Haripad",
    district: "Alappuzha",
    nda21: 11.9,
    nda26: 21.5,
    ndaD: 9.6,
    udfD: -1.1,
    ldfD: -8.2,
    gap: 10.7,
    outcome: "UDF",
  },
  {
    ac: 127,
    seat: "Varkala",
    district: "Trivandrum",
    nda21: 8.3,
    nda26: 19.9,
    ndaD: 11.6,
    udfD: 1.0,
    ldfD: -10.6,
    gap: 10.6,
    outcome: "LDF",
  },
  {
    ac: 130,
    seat: "Nedumangad",
    district: "Trivandrum",
    nda21: 17.6,
    nda26: 24.7,
    ndaD: 7.1,
    udfD: -2.2,
    ldfD: -3.7,
    gap: 9.3,
    outcome: "LDF",
  },
  {
    ac: 135,
    seat: "Nemom",
    district: "Trivandrum",
    nda21: 35.5,
    nda26: 40.9,
    ndaD: 5.4,
    udfD: -3.7,
    ldfD: -0.9,
    gap: 9.1,
    outcome: "BJP WIN",
    highlight: true,
  },
  {
    ac: 101,
    seat: "Poonjar",
    district: "Kottayam",
    nda21: 2.1,
    nda26: 25.1,
    ndaD: 22.9,
    udfD: 14.7,
    ldfD: -7.1,
    gap: 8.3,
    outcome: "UDF",
  },
  {
    ac: 136,
    seat: "Aruvikkara",
    district: "Trivandrum",
    nda21: 10.6,
    nda26: 16.3,
    ndaD: 5.7,
    udfD: -1.9,
    ldfD: -3.5,
    gap: 7.6,
    outcome: "LDF",
  },
  {
    ac: 61,
    seat: "Chelakkara",
    district: "Thrissur",
    nda21: 15.7,
    nda26: 23.0,
    ndaD: 7.3,
    udfD: 0.1,
    ldfD: -7.4,
    gap: 7.2,
    outcome: "LDF",
  },
  {
    ac: 126,
    seat: "Chathannoor",
    district: "Kollam",
    nda21: 30.6,
    nda26: 38.2,
    ndaD: 7.6,
    udfD: 1.1,
    ldfD: -8.1,
    gap: 6.6,
    outcome: "BJP WIN",
    highlight: true,
  },
  {
    ac: 27,
    seat: "Kozhikode North",
    district: "Kozhikode",
    nda21: 22.5,
    nda26: 28.3,
    ndaD: 5.8,
    udfD: 2.4,
    ldfD: -8.1,
    gap: 3.5,
    outcome: "UDF",
  },
  {
    ac: 68,
    seat: "Nattika",
    district: "Thrissur",
    nda21: 22.0,
    nda26: 29.0,
    ndaD: 7.0,
    udfD: 4.3,
    ldfD: -9.7,
    gap: 2.7,
    outcome: "LDF",
  },
  {
    ac: 128,
    seat: "Attingal",
    district: "Trivandrum",
    nda21: 25.9,
    nda26: 30.8,
    ndaD: 4.9,
    udfD: 2.8,
    ldfD: -7.5,
    gap: 2.1,
    outcome: "LDF",
  },
  {
    ac: 132,
    seat: "Kazhakoottam",
    district: "Trivandrum",
    nda21: 29.1,
    nda26: 35.7,
    ndaD: 6.6,
    udfD: 4.6,
    ldfD: -10.7,
    gap: 2.0,
    outcome: "BJP WIN",
    highlight: true,
  },
  {
    ac: 65,
    seat: "Wadakkanchery",
    district: "Thrissur",
    nda21: 12.8,
    nda26: 15.9,
    ndaD: 3.1,
    udfD: 1.3,
    ldfD: -4.2,
    gap: 1.8,
    outcome: "LDF",
  },
  {
    ac: 81,
    seat: "Thripunithura",
    district: "Ernakulam",
    nda21: 15.2,
    nda26: 19.2,
    ndaD: 4.0,
    udfD: 3.7,
    ldfD: -7.7,
    gap: 0.4,
    outcome: "UDF",
  },
  {
    ac: 4,
    seat: "Kanhangad",
    district: "Kasaragod",
    nda21: 12.9,
    nda26: 15.5,
    ndaD: 2.6,
    udfD: 2.5,
    ldfD: -5.0,
    gap: 0.0,
    outcome: "LDF",
  },
]

export type Cohort5aRow = {
  ac: number
  seat: string
  district: string
  hcm: string
  vehicle: string
  share: number
}

export const COHORT_5A_ROWS: Cohort5aRow[] = [
  {
    ac: 54,
    seat: "Mannarkkad",
    district: "Palakkad",
    hcm: "43/7/49",
    vehicle: "BDJS",
    share: 6.4,
  },
  {
    ac: 69,
    seat: "Kaipamangalam",
    district: "Thrissur",
    hcm: "53/4/41",
    vehicle: "BDJS",
    share: 13.8,
  },
  {
    ac: 72,
    seat: "Chalakudy",
    district: "Thrissur",
    hcm: "48/44/6",
    vehicle: "T20",
    share: 11.7,
  },
  {
    ac: 77,
    seat: "Kalamassery",
    district: "Ernakulam",
    hcm: "45/33/20",
    vehicle: "BDJS",
    share: 8.7,
  },
  {
    ac: 87,
    seat: "Kothamangalam",
    district: "Ernakulam",
    hcm: "33/29/37",
    vehicle: "BDJS",
    share: 5.1,
  },
  {
    ac: 89,
    seat: "Udumbanchola",
    district: "Idukki",
    hcm: "47/48/3",
    vehicle: "BDJS",
    share: 8.4,
  },
  {
    ac: 91,
    seat: "Idukki",
    district: "Idukki",
    hcm: "47/47/4",
    vehicle: "BDJS",
    share: 7.4,
  },
  {
    ac: 102,
    seat: "Aroor",
    district: "Alappuzha",
    hcm: "65/23/10",
    vehicle: "BDJS",
    share: 12.6,
  },
  {
    ac: 103,
    seat: "Cherthala",
    district: "Alappuzha",
    hcm: "66/18/15",
    vehicle: "BDJS",
    share: 10.5,
  },
  {
    ac: 106,
    seat: "Kuttanad",
    district: "Alappuzha",
    hcm: "59/36/3",
    vehicle: "BDJS",
    share: 15.1,
  },
  {
    ac: 108,
    seat: "Kayamkulam",
    district: "Alappuzha",
    hcm: "82/7/10",
    vehicle: "BDJS",
    share: 11.0,
  },
  {
    ac: 112,
    seat: "Ranni",
    district: "Pathanamthitta",
    hcm: "48/46/4",
    vehicle: "T20",
    share: 14.6,
  },
  {
    ac: 125,
    seat: "Eravipuram",
    district: "Kollam",
    hcm: "53/18/27",
    vehicle: "BDJS",
    share: 8.0,
  },
  {
    ac: 131,
    seat: "Vamanapuram",
    district: "Trivandrum",
    hcm: "64/13/22",
    vehicle: "BDJS",
    share: 8.2,
  },
]

export type Cohort5bRow = {
  ac: number
  seat: string
  district: string
  hcm: string
  v2016: number
  v2021: number
  v2026: number
}

export const COHORT_5B_ROWS: Cohort5bRow[] = [
  {
    ac: 5,
    seat: "Trikaripur",
    district: "Kasaragod",
    hcm: "68/9/21",
    v2016: 7.0,
    v2021: 6.8,
    v2026: 0.0,
  },
  {
    ac: 9,
    seat: "Irikkur",
    district: "Kannur",
    hcm: "49/28/22",
    v2016: 5.6,
    v2021: 5.1,
    v2026: 0.0,
  },
  {
    ac: 16,
    seat: "Peravoor",
    district: "Kannur",
    hcm: "51/22/25",
    v2016: 6.8,
    v2021: 6.4,
    v2026: 5.5,
  },
  {
    ac: 21,
    seat: "Kuttiadi",
    district: "Kozhikode",
    hcm: "59/1/38",
    v2016: 7.9,
    v2021: 5.4,
    v2026: 6.8,
  },
  {
    ac: 24,
    seat: "Perambra",
    district: "Kozhikode",
    hcm: "56/1/41",
    v2016: 5.6,
    v2021: 6.8,
    v2026: 7.6,
  },
  {
    ac: 32,
    seat: "Thiruvambadi",
    district: "Kozhikode",
    hcm: "33/12/54",
    v2016: 6.6,
    v2021: 5.5,
    v2026: 0.0,
  },
  {
    ac: 34,
    seat: "Ernad",
    district: "Malappuram",
    hcm: "21/1/76",
    v2016: 4.5,
    v2021: 4.7,
    v2026: 5.2,
  },
  {
    ac: 35,
    seat: "Nilambur",
    district: "Malappuram",
    hcm: "31/7/60",
    v2016: 7.6,
    v2021: 5.0,
    v2026: 6.8,
  },
  {
    ac: 36,
    seat: "Wandoor",
    district: "Malappuram",
    hcm: "29/7/62",
    v2016: 6.1,
    v2021: 4.2,
    v2026: 0.0,
  },
  {
    ac: 38,
    seat: "Perinthalmanna",
    district: "Malappuram",
    hcm: "26/1/71",
    v2016: 4.0,
    v2021: 4.8,
    v2026: 3.9,
  },
  {
    ac: 39,
    seat: "Mankada",
    district: "Malappuram",
    hcm: "23/1/74",
    v2016: 4.5,
    v2021: 3.9,
    v2026: 5.3,
  },
  {
    ac: 40,
    seat: "Malappuram",
    district: "Malappuram",
    hcm: "24/0/74",
    v2016: 5.2,
    v2021: 3.6,
    v2026: 4.7,
  },
  {
    ac: 41,
    seat: "Vengara",
    district: "Malappuram",
    hcm: "14/0/85",
    v2016: 6.0,
    v2021: 4.5,
    v2026: 3.6,
  },
  {
    ac: 43,
    seat: "Tirurangadi",
    district: "Malappuram",
    hcm: "17/0/81",
    v2016: 6.1,
    v2021: 5.6,
    v2026: 6.6,
  },
  {
    ac: 45,
    seat: "Tirur",
    district: "Malappuram",
    hcm: "21/0/77",
    v2016: 5.9,
    v2021: 5.3,
    v2026: 4.4,
  },
  {
    ac: 54,
    seat: "Mannarkkad",
    district: "Palakkad",
    hcm: "43/7/49",
    v2016: 7.0,
    v2021: 0.0,
    v2026: 6.4,
  },
  {
    ac: 75,
    seat: "Angamaly",
    district: "Ernakulam",
    hcm: "34/64/1",
    v2016: 0.0,
    v2021: 6.3,
    v2026: 0.0,
  },
  {
    ac: 86,
    seat: "Muvattupuzha",
    district: "Ernakulam",
    hcm: "35/40/24",
    v2016: 6.9,
    v2021: 5.2,
    v2026: 0.0,
  },
  {
    ac: 87,
    seat: "Kothamangalam",
    district: "Ernakulam",
    hcm: "33/29/37",
    v2016: 0.0,
    v2021: 3.4,
    v2026: 5.1,
  },
]

export const MATURE_GROWERS_ACS = new Set(MATURE_GROWER_ROWS.map((r) => r.ac))
export const COHORT_3_ACS = new Set(COHORT_3_ROWS.map((r) => r.ac))
export const COHORT_4A_ACS = new Set(COHORT_4A_ROWS.map((r) => r.ac))
export const COHORT_6_ACS = new Set(COHORT_6_ROWS.map((r) => r.ac))
export const COHORT_5A_ACS = new Set(COHORT_5A_ROWS.map((r) => r.ac))
export const COHORT_5B_ACS = new Set(COHORT_5B_ROWS.map((r) => r.ac))

/**
 * Bounding box for Trivandrum + Kollam districts in the
 * `kerala-constituencies-paths.json` coordinate space (canvas
 * 600 × 900). Used to zoom the "3 wins" map to the southern
 * cluster instead of showing the full state. Computed from the
 * 25 ACs in those two districts with a 5% margin.
 */
export const SOUTH_CLUSTER_VIEWBOX: [number, number, number, number] = [
  358, 716, 174, 193,
]

/**
 * Pre-computed vote-share decomposition data. Source: scripts in
 * `/tmp/nda_vote_share.py` running over `data/historical/` (canonical
 * year-aware alliance attribution) and `data/kerala-2026.json`.
 * Methodology details inline in the page body.
 */
export type ThreeLensRow = {
  lens: string
  question: string
  n: number
  bjpDelta: number
}

export const THREE_LENSES: ThreeLensRow[] = [
  {
    lens: "Statewide",
    question: "Average across all 140 ACs (uniform-effort assumption)",
    n: 140,
    bjpDelta: 0.3,
  },
  {
    lens: "Where BJP fielded both years (paired)",
    question: "At seats BJP contested in both 2021 and 2026",
    n: 89,
    bjpDelta: 1.65,
  },
  {
    lens: "Targeted seats",
    question: "Five-cohort union — where BJP put real effort",
    n: 30,
    bjpDelta: 5.16,
  },
]

export type PartyRow = {
  party: string
  abbrev: string
  v2021: number
  v2026: number
}

export const PARTY_DECOMPOSITION: PartyRow[] = [
  { party: "Bharatiya Janata Party", abbrev: "BJP", v2021: 11.29, v2026: 11.58 },
  {
    party: "Bharath Dharma Jana Sena",
    abbrev: "BDJS",
    v2021: 1.14,
    v2026: 1.42,
  },
  { party: "Twenty 20 Party", abbrev: "T20", v2021: 0.75, v2026: 1.51 },
]
export const NDA_TOTAL_2021 = 12.49
export const NDA_TOTAL_2026 = 14.54

export type CohortBreakdownRow = {
  slug: string
  name: string
  n: number
  bjp21: number
  bjp26: number
  nda21: number
  nda26: number
}

export const COHORT_BREAKDOWN: CohortBreakdownRow[] = [
  {
    slug: "mature-growers",
    name: "Mature growers",
    n: 11,
    bjp21: 21.64,
    bjp26: 30.17,
    nda21: 21.64,
    nda26: 30.17,
  },
  {
    slug: "low-base-breakouts",
    name: "Low-base breakouts",
    n: 3,
    bjp21: 4.95,
    bjp26: 21.56,
    nda21: 7.72,
    nda26: 21.56,
  },
  {
    slug: "declining-mature",
    name: "Declining mature",
    n: 8,
    bjp21: 22.18,
    bjp26: 19.21,
    nda21: 22.44,
    nda26: 20.63,
  },
  {
    slug: "wave-capture",
    name: "Wave-capture",
    n: 21,
    bjp21: 14.36,
    bjp26: 23.16,
    nda21: 14.86,
    nda26: 24.07,
  },
  {
    slug: "strategic-abstention",
    name: "Strategic abstention",
    n: 14,
    bjp21: 0.0,
    bjp26: 0.0,
    nda21: 8.04,
    nda26: 10.11,
  },
  {
    slug: "structural-exclusion",
    name: "Structural exclusion",
    n: 19,
    bjp21: 4.7,
    bjp26: 2.53,
    nda21: 5.24,
    nda26: 5.51,
  },
]

export type PartitionRow = {
  partition: string
  n: number
  bjpDelta: number
  ndaDelta: number
}

export const PARTITIONS: PartitionRow[] = [
  {
    partition: "Targeted (5-cohort union)",
    n: 30,
    bjpDelta: 5.16,
    ndaDelta: 5.84,
  },
  { partition: "Neutral (rest of state)", n: 79, bjpDelta: -0.92, ndaDelta: 1.0 },
  {
    partition: "Negative-space (abstention ∪ exclusion)",
    n: 31,
    bjpDelta: -1.33,
    ndaDelta: 1.06,
  },
]

export type FootprintRow = {
  party: string
  fielded21: number
  fielded26: number
  share21: number
  share26: number
}

export const FOOTPRINT: FootprintRow[] = [
  {
    party: "BJP",
    fielded21: 115,
    fielded26: 98,
    share21: 13.74,
    share26: 16.5,
  },
  {
    party: "BDJS",
    fielded21: 21,
    fielded26: 22,
    share21: 7.61,
    share26: 9.04,
  },
  {
    party: "T20",
    fielded21: 8,
    fielded26: 19,
    share21: 13.14,
    share26: 11.18,
  },
]
