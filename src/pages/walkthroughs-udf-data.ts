/**
 * Static data for the Christian-belt premium section of the UDF
 * walkthrough.
 *
 * Source: `docs/narratives/udf.md §3` (Christian-belt strategy detail)
 * + `scripts/analysis/analyze-christian-belt.ts`. To refresh, re-run the script
 * and update the constants below.
 */

import {
  INC_CHRISTIAN_BLUE,
  INC_HINDU_EMERALD,
  KEC_AMBER,
  MUSLIM_BELT_GREEN,
  SPECIAL_GRAY,
  UDF_BLUE,
} from "@/components/walkthroughs/colors"

export type Strategy =
  | "Christian Alliance"
  | "INC-Christian"
  | "INC-Hindu"
  | "Special"

export type ChristianBeltRow = {
  ac: number
  district: string
  name: string
  hcm: string // "H/C/M" e.g. "34/65/1"
  reservation: "SC" | "ST" | null
  candidate: string
  candidateReligion: "Christian" | "Hindu" | "Muslim"
  party: string // e.g. "INC", "KEC", "KC-Jacob", "IUML", "Independent"
  udfDelta: number
  won: boolean
  wonNote?: string // e.g. "won (Indep)" for AC 93 Pala
  strategy: Strategy
}

/** UDF mean at ≥40% Christian vs UDF statewide, by cycle. */
export const PREMIUM_HISTORY = [
  {
    year: 2011,
    udfHigh: "48.8% / 49.2%",
    udfStatewide: "46.2%",
    premiumRaw: "+2.6pp",
    premiumCleaned: "+3.0pp",
  },
  {
    year: 2016,
    udfHigh: "42.2% / 43.4%",
    udfStatewide: "39.3%",
    premiumRaw: "+2.9pp",
    premiumCleaned: "+4.1pp",
  },
  {
    year: 2021,
    udfHigh: "41.4% / 41.9%",
    udfStatewide: "39.3%",
    premiumRaw: "+2.1pp",
    premiumCleaned: "+2.7pp",
  },
  {
    year: 2026,
    udfHigh: "51.2% / 53.1%",
    udfStatewide: "46.6%",
    premiumRaw: "+4.6pp",
    premiumCleaned: "+6.4pp",
    highlight: true,
  },
] as const

/**
 * The 36 Christian-belt ACs — every AC with ≥30% Christian share, plus
 * the two KEC-allocated seats below 30% (Irinjalakuda 26.6%, Kothamangalam
 * 29.2%). Excludes AC 4 Kanhangad (12% Christian, coalition allocation
 * only). Sorted by Christian share descending.
 */
export const CHRISTIAN_BELT_36: ChristianBeltRow[] = [
  {
    ac: 75,
    district: "Ernakulam",
    name: "Angamaly",
    hcm: "34/65/1",
    reservation: null,
    candidate: "Roji M. John",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 8.3,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 93,
    district: "Kottayam",
    name: "Pala",
    hcm: "38/52/10",
    reservation: null,
    candidate: "Mani C. Kappen",
    candidateReligion: "Christian",
    party: "Independent",
    udfDelta: -12.9,
    won: true,
    wonNote: "won (Indep)",
    strategy: "Special",
  },
  {
    ac: 98,
    district: "Kottayam",
    name: "Puthuppally",
    hcm: "49/49/2",
    reservation: null,
    candidate: "Chandy Oommen",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 17.8,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 89,
    district: "Idukki",
    name: "Udumbanchola",
    hcm: "48/48/4",
    reservation: null,
    candidate: "Senapathy Venu",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: 22.6,
    won: true,
    strategy: "INC-Hindu",
  },
  {
    ac: 111,
    district: "Pathanamthitta",
    name: "Thiruvalla",
    hcm: "48/48/4",
    reservation: null,
    candidate: "Varghese Mammen",
    candidateReligion: "Christian",
    party: "KEC",
    udfDelta: 1.6,
    won: true,
    strategy: "Christian Alliance",
  },
  {
    ac: 91,
    district: "Idukki",
    name: "Idukki",
    hcm: "48/47/5",
    reservation: null,
    candidate: "Roy K. Paulose",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 12.0,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 112,
    district: "Pathanamthitta",
    name: "Ranni",
    hcm: "48/47/5",
    reservation: null,
    candidate: "Pazhakulam Madhu",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: 4.1,
    won: true,
    strategy: "INC-Hindu",
  },
  {
    ac: 137,
    district: "Thiruvananthapuram",
    name: "Parassala",
    hcm: "49/45/6",
    reservation: null,
    candidate: "Neyyattinkara Sanal",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: 2.7,
    won: false,
    strategy: "INC-Hindu",
  },
  {
    ac: 96,
    district: "Kottayam",
    name: "Ettumanoor",
    hcm: "49/45/6",
    reservation: null,
    candidate: "Nattakom Suresh",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: 17.5,
    won: true,
    strategy: "INC-Hindu",
  },
  {
    ac: 72,
    district: "Thrissur",
    name: "Chalakudy",
    hcm: "49/44/7",
    reservation: null,
    candidate: "Saneeshkumar Joseph",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 8.7,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 94,
    district: "Kottayam",
    name: "Kaduthuruthy",
    hcm: "53/44/3",
    reservation: null,
    candidate: "Mons Joseph",
    candidateReligion: "Christian",
    party: "KEC",
    udfDelta: 11.4,
    won: true,
    strategy: "Christian Alliance",
  },
  {
    ac: 99,
    district: "Kottayam",
    name: "Changanassery",
    hcm: "46/44/11",
    reservation: null,
    candidate: "Vinu Job Kuzhimannil",
    candidateReligion: "Christian",
    party: "KEC",
    udfDelta: 6.5,
    won: true,
    strategy: "Christian Alliance",
  },
  {
    ac: 100,
    district: "Kottayam",
    name: "Kanjirappally",
    hcm: "46/43/10",
    reservation: null,
    candidate: "Rony K. Baby",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 8.1,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 85,
    district: "Ernakulam",
    name: "Piravom",
    hcm: "49/42/9",
    reservation: null,
    candidate: "Anoop Jacob",
    candidateReligion: "Christian",
    party: "KC-Jacob",
    udfDelta: 5.4,
    won: true,
    strategy: "Christian Alliance",
  },
  {
    ac: 101,
    district: "Kottayam",
    name: "Poonjar",
    hcm: "42/41/16",
    reservation: null,
    candidate: "Sebastian M.J.",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 14.7,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 92,
    district: "Idukki",
    name: "Peerumade",
    hcm: "51/41/8",
    reservation: null,
    candidate: "Cyriac Thomas",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 11.4,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 97,
    district: "Kottayam",
    name: "Kottayam",
    hcm: "50/41/9",
    reservation: null,
    candidate: "Thiruvanchoor Radhakrishnan",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: 7.2,
    won: true,
    strategy: "INC-Hindu",
  },
  {
    ac: 79,
    district: "Ernakulam",
    name: "Vypen",
    hcm: "52/41/7",
    reservation: null,
    candidate: "Tony Chammany",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 15.5,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 90,
    district: "Idukki",
    name: "Thodupuzha",
    hcm: "39/41/21",
    reservation: null,
    candidate: "Apu John Joseph",
    candidateReligion: "Christian",
    party: "KEC",
    udfDelta: 9.7,
    won: true,
    strategy: "Christian Alliance",
  },
  {
    ac: 86,
    district: "Ernakulam",
    name: "Muvattupuzha",
    hcm: "35/40/24",
    reservation: null,
    candidate: "Mathew Kuzhalnadan",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 16.4,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 80,
    district: "Ernakulam",
    name: "Kochi",
    hcm: "43/40/17",
    reservation: null,
    candidate: "Mohammed Shiyas",
    candidateReligion: "Muslim",
    party: "INC",
    udfDelta: 16.7,
    won: true,
    strategy: "Special",
  },
  {
    ac: 67,
    district: "Thrissur",
    name: "Thrissur",
    hcm: "54/40/6",
    reservation: null,
    candidate: "Rajan J. Pallan",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: 15.4,
    won: true,
    strategy: "INC-Hindu",
  },
  {
    ac: 74,
    district: "Ernakulam",
    name: "Perumbavoor",
    hcm: "43/39/19",
    reservation: null,
    candidate: "Manoj Moothedan",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: 14.1,
    won: true,
    strategy: "INC-Hindu",
  },
  {
    ac: 106,
    district: "Alappuzha",
    name: "Kuttanad",
    hcm: "59/37/4",
    reservation: null,
    candidate: "Reji Cheriyan",
    candidateReligion: "Christian",
    party: "KEC",
    udfDelta: 9.3,
    won: true,
    strategy: "Christian Alliance",
  },
  {
    ac: 113,
    district: "Pathanamthitta",
    name: "Aranmula",
    hcm: "55/36/8",
    reservation: null,
    candidate: "Abin Varkey Kodiyattu",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 10.1,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 71,
    district: "Thrissur",
    name: "Pudukkad",
    hcm: "59/36/6",
    reservation: null,
    candidate: "K.M. Baburajan",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: 10.0,
    won: false,
    strategy: "INC-Hindu",
  },
  {
    ac: 84,
    district: "Ernakulam",
    name: "Kunnathunad",
    hcm: "45/35/20",
    reservation: "SC",
    candidate: "V.P. Sajeendran",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: 11.9,
    won: true,
    strategy: "INC-Hindu",
  },
  {
    ac: 77,
    district: "Ernakulam",
    name: "Kalamassery",
    hcm: "45/34/21",
    reservation: null,
    candidate: "V.E. Abdul Gafoor",
    candidateReligion: "Muslim",
    party: "IUML",
    udfDelta: 10.1,
    won: true,
    strategy: "Special",
  },
  {
    ac: 81,
    district: "Ernakulam",
    name: "Thripunithura",
    hcm: "45/34/21",
    reservation: null,
    candidate: "Deepak Joy",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 3.7,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 82,
    district: "Ernakulam",
    name: "Eranakulam",
    hcm: "45/34/21",
    reservation: null,
    candidate: "T.J. Vinod",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: 15.8,
    won: true,
    strategy: "INC-Hindu",
  },
  {
    ac: 83,
    district: "Ernakulam",
    name: "Thrikkakara",
    hcm: "45/34/21",
    reservation: null,
    candidate: "Uma Thomas",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 16.1,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 78,
    district: "Ernakulam",
    name: "Paravur",
    hcm: "59/33/7",
    reservation: null,
    candidate: "V.D. Satheesan",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: -2.3,
    won: true,
    strategy: "INC-Hindu",
  },
  {
    ac: 114,
    district: "Pathanamthitta",
    name: "Konni",
    hcm: "61/33/5",
    reservation: null,
    candidate: "Satheesh Kochuparambil",
    candidateReligion: "Hindu",
    party: "INC",
    udfDelta: 7.6,
    won: false,
    strategy: "INC-Hindu",
  },
  {
    ac: 88,
    district: "Idukki",
    name: "Devikulam",
    hcm: "61/32/7",
    reservation: "SC",
    candidate: "F. Raja",
    candidateReligion: "Christian",
    party: "INC",
    udfDelta: 1.2,
    won: true,
    strategy: "INC-Christian",
  },
  {
    ac: 87,
    district: "Ernakulam",
    name: "Kothamangalam",
    hcm: "34/29/37",
    reservation: null,
    candidate: "Shibu Theckumpuram",
    candidateReligion: "Christian",
    party: "KEC",
    udfDelta: 10.9,
    won: true,
    strategy: "Christian Alliance",
  },
  {
    ac: 70,
    district: "Thrissur",
    name: "Irinjalakuda",
    hcm: "64/27/10",
    reservation: null,
    candidate: "Thomas Unniyadan",
    candidateReligion: "Christian",
    party: "KEC",
    udfDelta: 7.3,
    won: true,
    strategy: "Christian Alliance",
  },
]

/**
 * Three Central-3 districts (Idukki, Ernakulam, Kottayam) — the
 * application focus of the Christian-belt analysis. The other two of
 * Central-5 (Wayanad, Malappuram) are Muslim-belt and analysed in the
 * Muslim arc.
 */
export const CENTRAL_3 = new Set(["Idukki", "Ernakulam", "Kottayam"])

/** Christian Alliance cohort, Central-3 only — extra column: Christian party (full name) + party 2021/2026 vote share. */
export const CHRISTIAN_ALLIANCE_C3 = [
  {
    ac: 85,
    district: "Ernakulam",
    name: "Piravom",
    hcm: "49/42/9",
    partyFull: "Kerala Congress (Jacob)",
    party2021: 53.8,
    party2026: 59.2,
    partyDelta: 5.4,
    udfDelta: 5.4,
  },
  {
    ac: 87,
    district: "Ernakulam",
    name: "Kothamangalam",
    hcm: "34/29/37",
    partyFull: "Kerala Congress (Joseph)",
    party2021: 42.2,
    party2026: 53.1,
    partyDelta: 10.9,
    udfDelta: 10.9,
  },
  {
    ac: 90,
    district: "Idukki",
    name: "Thodupuzha",
    hcm: "39/41/21",
    partyFull: "Kerala Congress (Joseph)",
    party2021: 48.6,
    party2026: 58.4,
    partyDelta: 9.7,
    udfDelta: 9.7,
  },
  {
    ac: 94,
    district: "Kottayam",
    name: "Kaduthuruthy",
    hcm: "53/44/3",
    partyFull: "Kerala Congress (Joseph)",
    party2021: 45.4,
    party2026: 56.8,
    partyDelta: 11.4,
    udfDelta: 11.4,
  },
  {
    ac: 99,
    district: "Kottayam",
    name: "Changanassery",
    hcm: "46/44/11",
    partyFull: "Kerala Congress (Joseph)",
    party2021: 39.9,
    party2026: 46.4,
    partyDelta: 6.5,
    udfDelta: 6.5,
  },
] as const

/** INC-Christian cohort, Central-3 only. */
export const INC_CHRISTIAN_C3 = [
  {
    ac: 75,
    district: "Ernakulam",
    name: "Angamaly",
    hcm: "34/65/1",
    reservation: null,
    candidate: "Roji M. John",
    udfDelta: 8.3,
  },
  {
    ac: 98,
    district: "Kottayam",
    name: "Puthuppally",
    hcm: "49/49/2",
    reservation: null,
    candidate: "Chandy Oommen",
    udfDelta: 17.8,
  },
  {
    ac: 91,
    district: "Idukki",
    name: "Idukki",
    hcm: "48/47/5",
    reservation: null,
    candidate: "Roy K. Paulose",
    udfDelta: 12.0,
  },
  {
    ac: 100,
    district: "Kottayam",
    name: "Kanjirappally",
    hcm: "46/43/10",
    reservation: null,
    candidate: "Rony K. Baby",
    udfDelta: 8.1,
  },
  {
    ac: 101,
    district: "Kottayam",
    name: "Poonjar",
    hcm: "42/41/16",
    reservation: null,
    candidate: "Sebastian M.J.",
    udfDelta: 14.7,
  },
  {
    ac: 92,
    district: "Idukki",
    name: "Peerumade",
    hcm: "51/41/8",
    reservation: null,
    candidate: "Cyriac Thomas",
    udfDelta: 11.4,
  },
  {
    ac: 79,
    district: "Ernakulam",
    name: "Vypen",
    hcm: "52/41/7",
    reservation: null,
    candidate: "Tony Chammany",
    udfDelta: 15.5,
  },
  {
    ac: 86,
    district: "Ernakulam",
    name: "Muvattupuzha",
    hcm: "35/40/24",
    reservation: null,
    candidate: "Mathew Kuzhalnadan",
    udfDelta: 16.4,
  },
  {
    ac: 81,
    district: "Ernakulam",
    name: "Thripunithura",
    hcm: "45/34/21",
    reservation: null,
    candidate: "Deepak Joy",
    udfDelta: 3.7,
  },
  {
    ac: 83,
    district: "Ernakulam",
    name: "Thrikkakara",
    hcm: "45/34/21",
    reservation: null,
    candidate: "Uma Thomas",
    udfDelta: 16.1,
  },
  {
    ac: 88,
    district: "Idukki",
    name: "Devikulam",
    hcm: "61/32/7",
    reservation: "SC" as const,
    candidate: "F. Raja",
    udfDelta: 1.2,
  },
] as const

/** INC-Hindu cohort, Central-3 only. */
export const INC_HINDU_C3 = [
  {
    ac: 89,
    district: "Idukki",
    name: "Udumbanchola",
    hcm: "48/48/4",
    reservation: null,
    candidate: "Senapathy Venu",
    udfDelta: 22.6,
  },
  {
    ac: 96,
    district: "Kottayam",
    name: "Ettumanoor",
    hcm: "49/45/6",
    reservation: null,
    candidate: "Nattakom Suresh",
    udfDelta: 17.5,
  },
  {
    ac: 97,
    district: "Kottayam",
    name: "Kottayam",
    hcm: "50/41/9",
    reservation: null,
    candidate: "Thiruvanchoor Radhakrishnan",
    udfDelta: 7.2,
  },
  {
    ac: 74,
    district: "Ernakulam",
    name: "Perumbavoor",
    hcm: "43/39/19",
    reservation: null,
    candidate: "Manoj Moothedan",
    udfDelta: 14.1,
  },
  {
    ac: 84,
    district: "Ernakulam",
    name: "Kunnathunad",
    hcm: "45/35/20",
    reservation: "SC" as const,
    candidate: "V.P. Sajeendran",
    udfDelta: 11.9,
  },
  {
    ac: 82,
    district: "Ernakulam",
    name: "Eranakulam",
    hcm: "45/34/21",
    reservation: null,
    candidate: "T.J. Vinod",
    udfDelta: 15.8,
  },
  {
    ac: 78,
    district: "Ernakulam",
    name: "Paravur",
    hcm: "59/33/7",
    reservation: null,
    candidate: "V.D. Satheesan",
    udfDelta: -2.3,
  },
] as const

/** Performance summary for Central-3, by strategy. */
export const PERFORMANCE_C3 = [
  {
    strategy: "Christian Alliance" as Strategy,
    n: 5,
    won: 5,
    meanUdfDelta: 8.8,
    read: "Wave-rate. KEC/KC-Jacob won by big margins because of high baselines, but the additional swing on top was modest.",
  },
  {
    strategy: "INC-Christian" as Strategy,
    n: 11,
    won: 11,
    meanUdfDelta: 11.4,
    read: "INC's own Christian candidates picked up large swings.",
  },
  {
    strategy: "INC-Hindu" as Strategy,
    n: 7,
    won: 7,
    meanUdfDelta: 12.4,
    read: "Christians moved toward INC regardless of who INC fielded.",
  },
] as const

/**
 * Cropped viewBox for Idukki + Ernakulam + Kottayam (Central-3).
 * Coordinate space matches `kerala-constituencies-paths.json`
 * (canvas 600 × 900). Computed from the 26 Central-3 ACs with a
 * 5% margin around the bounding box.
 */
export const CENTRAL_3_VIEWBOX: [number, number, number, number] = [
  293, 478, 269, 238,
]

/**
 * Colour palette for the strategy choropleth. Distinct hues so all
 * three INC-direct vs alliance vs special buckets are easily
 * distinguishable.
 */
export const STRATEGY_COLOURS: Record<Strategy, string> = {
  "Christian Alliance": KEC_AMBER,
  "INC-Christian": INC_CHRISTIAN_BLUE,
  "INC-Hindu": INC_HINDU_EMERALD,
  Special: SPECIAL_GRAY,
}

// ===========================================================================
// Muslim-belt section data (Malappuram, non-reserved seats)
// ===========================================================================

export type MuslimStrategy =
  | "Muslim Alliance"
  | "INC-Muslim"
  | "INC-Hindu"
  | "Special"

/** UDF mean at ≥70% Muslim vs UDF statewide, by cycle. */
export const MUSLIM_PREMIUM_HISTORY = [
  {
    year: 2011,
    udfHigh: "57.0%",
    udfStatewide: "46.2%",
    premium: "+10.8pp",
  },
  {
    year: 2016,
    udfHigh: "50.0%",
    udfStatewide: "39.3%",
    premium: "+10.7pp",
  },
  {
    year: 2021,
    udfHigh: "50.6%",
    udfStatewide: "39.3%",
    premium: "+11.3pp",
  },
  {
    year: 2026,
    udfHigh: "59.4%",
    udfStatewide: "46.6%",
    premium: "+12.8pp",
    highlight: true,
  },
] as const

/** Muslim Alliance (IUML) cohort — Malappuram non-reserved (12 seats). */
export const MUSLIM_ALLIANCE_MAL = [
  {
    ac: 41,
    name: "Vengara",
    hcm: "14/0/85",
    candidate: "K.M. Shaji",
    udfDelta: 3.2,
  },
  {
    ac: 43,
    name: "Tirurangadi",
    hcm: "18/0/82",
    candidate: "P.M.A. Sameer",
    udfDelta: 14.1,
  },
  {
    ac: 44,
    name: "Tanur",
    hcm: "18/0/82",
    candidate: "P.K. Navas",
    udfDelta: 7.9,
  },
  {
    ac: 45,
    name: "Tirur",
    hcm: "21/1/78",
    candidate: "Kurukkoli Moideen",
    udfDelta: 5.4,
  },
  {
    ac: 34,
    name: "Ernad",
    hcm: "22/1/77",
    candidate: "P.K. Basheer",
    udfDelta: 4.3,
  },
  {
    ac: 46,
    name: "Kottakkal",
    hcm: "25/0/75",
    candidate: "Prof. Abid Hussain Thangal",
    udfDelta: 11.1,
  },
  {
    ac: 39,
    name: "Mankada",
    hcm: "24/2/75",
    candidate: "Manjalamkuzhi Ali",
    udfDelta: 9.9,
  },
  {
    ac: 37,
    name: "Manjeri",
    hcm: "24/1/75",
    candidate: "Adv. M. Rahmathulla",
    udfDelta: 10.6,
  },
  {
    ac: 40,
    name: "Malappuram",
    hcm: "24/1/75",
    candidate: "P.K. Kunhalikutty",
    udfDelta: 9.8,
  },
  {
    ac: 33,
    name: "Kondotty",
    hcm: "27/1/72",
    candidate: "T.P. Ashrafali",
    udfDelta: 9.9,
  },
  {
    ac: 38,
    name: "Perinthalmanna",
    hcm: "27/2/71",
    candidate: "Najeeb Kanthapuram",
    udfDelta: 10.4,
  },
  {
    ac: 42,
    name: "Vallikunnu",
    hcm: "30/1/69",
    candidate: "T.V. Ibrahim",
    udfDelta: 8.6,
  },
] as const

/** INC-Muslim cohort — Malappuram non-reserved (2 seats). */
export const INC_MUSLIM_MAL = [
  {
    ac: 48,
    name: "Ponnani",
    hcm: "33/0/67",
    candidate: "K.P. Noushad Ali",
    udfDelta: 10.4,
  },
  {
    ac: 35,
    name: "Nilambur",
    hcm: "31/8/61",
    candidate: "Aryadan Shoukath",
    udfDelta: 15.4,
  },
] as const

/** Thavanur — INC fielded a Christian candidate at a 67%-Muslim seat. */
export const MUSLIM_SPECIAL_MAL = [
  {
    ac: 47,
    name: "Thavanur",
    hcm: "33/0/67",
    candidate: "Adv. V.S. Joy",
    religion: "Christian",
    udfDelta: 4.1,
  },
] as const

/** Performance summary for non-reserved Malappuram. */
export const MUSLIM_PERFORMANCE_MAL = [
  {
    strategy: "Muslim Alliance" as MuslimStrategy,
    n: 12,
    won: 12,
    meanUdfDelta: 8.8,
  },
  {
    strategy: "INC-Muslim" as MuslimStrategy,
    n: 2,
    won: 2,
    meanUdfDelta: 12.9,
  },
  {
    strategy: "INC-Hindu" as MuslimStrategy,
    n: 0,
    won: 0,
    meanUdfDelta: null as number | null,
  },
] as const

/**
 * Cropped viewBox for Malappuram. All 16 ACs render; non-analysis ACs
 * (Wandoor SC reserved) are visible but uncoloured.
 */
export const MALAPPURAM_VIEWBOX: [number, number, number, number] = [
  231, 246, 156, 185,
]

/** Colour palette for the Muslim strategy choropleth. */
export const MUSLIM_STRATEGY_COLOURS: Record<MuslimStrategy, string> = {
  "Muslim Alliance": MUSLIM_BELT_GREEN,
  "INC-Muslim": UDF_BLUE,
  "INC-Hindu": SPECIAL_GRAY, // bucket is empty
  Special: SPECIAL_GRAY,
}
