/**
 * Typography system for walkthrough pages.
 *
 * Five named tiers, applied consistently so the reader's eye learns
 * the hierarchy quickly:
 *
 * 1. SECTION_LEAD — opening paragraph of a section. Slightly larger,
 *    almost-foreground colour. Sets the scene before detail prose
 *    starts. Used right after each section's <h2>.
 * 2. SUB_HEADING — h3 inside a section. Bigger than body so the
 *    visual jump is clear; tracking-tight to match h2.
 * 3. DEFINITION — italic muted block with a left border. Used for
 *    cohort definitions and similar "metadata about this section"
 *    callouts.
 * 4. PREVIEW_LIST — compact ordered list shown right after a lead
 *    paragraph that says "N patterns / N reasons / N mechanisms".
 *    Tells the reader what the next N sub-sections will cover.
 * 5. ASIDE — small muted text for parenthetical notes and footnote-
 *    equivalents (e.g. "Caste data is district-level only").
 *
 * Body prose default is `text-sm sm:text-[15px] leading-relaxed`,
 * applied at the section level by `CohortSection` (NDA page) or
 * `WalkthroughSection`. Only override when the paragraph is one of
 * the five named tiers above.
 *
 * Documented in `docs/architecture.md` → "Walkthrough pages" →
 * "Typography system".
 */

export const SECTION_LEAD =
  "text-base leading-relaxed text-foreground/90 sm:text-[16.5px]"
export const SUB_HEADING =
  "mt-7 font-heading text-lg font-semibold tracking-tight"
export const DEFINITION =
  "border-l-2 border-muted-foreground/30 pl-3 italic text-muted-foreground"
export const PREVIEW_LIST =
  "my-3 list-inside list-decimal space-y-0.5 text-[14px] text-muted-foreground"
export const ASIDE = "text-[12.5px] text-muted-foreground"

/**
 * Surface class for "card-shaped" sections (thesis ledes, synthesis
 * recaps, "where this connects" callouts, the questions-page header
 * card). Same visual as EyebrowCard's wrapper. Use when the section
 * doesn't need an eyebrow label; reach for EyebrowCard when it does.
 */
export const SURFACE_CARD = "rounded-md border bg-card/50 p-5 sm:p-6"
