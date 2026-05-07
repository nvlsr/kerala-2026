/**
 * App-wide constants. Names should be self-explanatory; comments
 * describe WHERE the value is used and WHY this threshold/count.
 *
 * Adding a new constant here is preferred over inlining a magic
 * number in any component or aggregate when the value carries
 * editorial intent (rather than being a one-off layout pixel).
 */

/**
 * Total seats in the Kerala Legislative Assembly. Used for:
 *   - Filter validation (`filters.ts` rejects seat numbers outside 1..140)
 *   - "X of 140 seats" framing on /flows and /drifts page subtitles
 *   - Iterating all seats in flow-pattern-section.tsx for the
 *     unfocused-seat backdrop in mini AC maps
 */
export const TOTAL_SEATS = 140

/**
 * Rows per page in the main candidate table on /explore. Keeps the
 * default winners-only view to one screen at typical viewport sizes
 * (140 winners → 14 pages).
 */
export const CANDIDATE_TABLE_PAGE_SIZE = 10

/**
 * Editorial "noise threshold" for vote-share movements expressed in
 * percentage points. Below this magnitude, party Δ '21 deltas are
 * either suppressed (PartySection) or rendered in muted color
 * (flow-pattern-section's delta column). Picking 0.5pp:
 *   - 1 candidate worth of share is typically <0.05% statewide, so
 *     0.5pp = ~10 candidates' worth — a meaningful aggregate move
 *   - Below 0.5pp the visual noise from rounding outweighs signal
 * Tweak globally; both consumers will pick up the new boundary.
 */
export const DELTA_NOISE_THRESHOLD_PERCENT = 0.5
