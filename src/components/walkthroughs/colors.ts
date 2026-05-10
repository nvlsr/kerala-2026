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
