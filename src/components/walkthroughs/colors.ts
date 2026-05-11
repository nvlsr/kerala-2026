/**
 * Centralised colour tokens for the walkthrough surface.
 *
 * Conventions:
 * - Alliance hues mirror the project's standing alliance colour scheme
 *   (UDF blue, LDF red, NDA orange).
 * - Religious/strategy hues are tied to the cohort family they
 *   represent (Christian belt = UDF blue, Muslim belt = IUML emerald,
 *   Christian-alliance KEC = amber).
 *
 * Used both in JSX (style + ChoroplethMap categoricalColors) and in
 * data files (e.g. STRATEGY_COLOURS maps in walkthroughs-udf-data).
 */

// Alliance core hues — match the standing project alliance colour map.
export const UDF_BLUE = "#1F77B4"
export const LDF_RED = "#D62728"
export const NDA_ORANGE = "#FF7F0E"

/**
 * Standard symmetric domain for alliance Δshare choropleths
 * (red = loss, blue = gain), in percentage points. Same range across
 * all three alliances + party-level Δ maps so cross-page visual
 * comparison stays calibrated.
 */
export const DELTA_DOMAIN = [-25, 25] as const satisfies readonly [
  number,
  number,
]

/**
 * Per-cohort hues for the NDA walkthrough cohort maps. Each cohort
 * is a distinct binary-membership choropleth (see CohortMap); these
 * tokens give them visual identity without leaking magic hex into
 * the page file.
 */
export const COHORT_GROWER_BLUE = "#2563EB" // mature growers — blue-600
export const COHORT_BREAKOUT_CYAN = "#0891B2" // low-base breakouts — cyan-600
export const COHORT_DECLINING_RED = "#DC2626" // declining mature — red-600
export const COHORT_WAVE_AMBER = "#D97706" // wave-capture — amber-600
export const COHORT_ABSTAIN_VIOLET = "#8B5CF6" // strategic abstention — violet-500
export const COHORT_EXCLUSION_RED = "#991B1B" // structural exclusion — red-800

// Religious-belt hues — used on the Central-5 sweep choropleth and on
// the two cohort-section choropleths. The same hue threads through:
//   - Central-5 sweep map (district shading)
//   - Christian-belt scatter point colour
//   - Christian Alliance / INC-Christian / INC-Hindu strategy palette
//   - Muslim Alliance / INC-Muslim strategy palette
export const CHRISTIAN_BELT_BLUE = UDF_BLUE
export const MUSLIM_BELT_GREEN = "#15B981" // emerald-500

// Christian-strategy palette (UDF strategy in Christian belt seats).
export const KEC_AMBER = "#D97706" // amber-600 — Christian alliance (KEC, KC-Jacob)
export const INC_CHRISTIAN_BLUE = UDF_BLUE
export const INC_HINDU_EMERALD = MUSLIM_BELT_GREEN
export const SPECIAL_GRAY = "#9CA3AF" // gray-400 — for the special-case bucket

// ── Sub-rite palette (OSM religious-POI inventory) ───────────────────
// Used on /religion-map and /walkthroughs/christian-walkthrough for
// the categorical dominant-sub-rite maps and the per-sub-rite gradient
// grid. The 6 visible Christian cohorts get six maximally distinct
// hues (spaced ~60° apart on the colour wheel) for clear contrast on
// dense maps. Less-frequent cohorts get the residual hues.
export const CHRISTIAN_SUBRITE_COLORS: Record<string, string> = {
  syro_malabar: "#7C3AED", // violet — biggest cohort, interior central Kerala
  latin_catholic: "#2563EB", // royal blue — coastal Latin diocesan
  indian_orthodox: "#F59E0B", // amber — central Travancore
  jacobite_syrian: "#DC2626", // red — small central Kerala cohort
  marthoma: "#10B981", // emerald — Pathanamthitta corridor
  csi: "#EC4899", // pink — Trivandrum cluster (geographically confounded)
  // Less-frequent cohorts (small n or zero dominant ACs).
  syro_malankara: "#EA580C", // orange — small Tiruvalla-belt presence
  knanaya_catholic: "#FACC15", // yellow — Kottayam-Changanacherry endemic
  knanaya_jacobite: "#0D9488", // teal — rare
  pentecostal: "#A855F7", // light purple
  brethren: "#6B7280", // gray
  other_christian: SPECIAL_GRAY,
}

export const MUSLIM_SUBRITE_COLORS: Record<string, string> = {
  sunni: "#15B981", // emerald — dominant Sunni
  salafi_mujahid: "#0D9488", // teal-600 — KNM / Mujahid
  jamaat_islami: "#84CC16", // lime-500 — Jamaat-e-Islami
  ahmadiyya: "#65A30D", // lime-600 — small minority
  shia: "#16A34A", // green-600 — rare
  other_muslim: SPECIAL_GRAY,
}

// Used when an AC has zero classified POIs of a religion.
export const NO_DATA_GRAY = "#E5E7EB" // gray-200
