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
// Used on /religion-map for the categorical dominant-sub-rite maps and
// the per-sub-rite gradient grid. Christian buckets pick warm/blue
// hues; Muslim buckets pick green family.
export const CHRISTIAN_SUBRITE_COLORS: Record<string, string> = {
  latin_catholic: "#1F77B4", // UDF blue — coastal Latin diocesan
  syro_malabar: "#7C3AED", // violet-600 — interior Syro-Malabar belt
  syro_malankara: "#EC4899", // pink-500 — small Tiruvalla-belt presence
  knanaya_catholic: "#F59E0B", // amber-500 — Kottayam-Changanacherry endemic
  marthoma: "#10B981", // emerald-500 — Pathanamthitta corridor
  indian_orthodox: "#0EA5E9", // sky-500 — central Travancore
  jacobite_syrian: "#06B6D4", // cyan-500 — central Kerala
  knanaya_jacobite: "#F97316", // orange-500 — rare
  csi: "#A855F7", // purple-500
  pentecostal: "#DC2626", // red-600
  brethren: "#6B7280", // gray-500
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
