/**
 * Constants for the LDF walkthrough page. Sibling of `ldf-page.tsx` —
 * matches the UDF / NDA / Christian co-location pattern. Kept separate
 * so the page component stays focused on composition.
 */
import { type Weakener } from "@/components/walkthroughs/what-would-weaken"

/**
 * The three ACs that sit along the Pamba-Sabarimala pilgrim route
 * (Aranmula 113, Konni 114, Ranni 112). Used to test whether the
 * Sabarimala gold scandal hammered LDF specifically in pilgrim-route
 * seats. The test fails — see narrative-a2-sabarimala.ts.
 */
export const SABARIMALA_ROUTE_ACS = new Set([113, 114, 112])

export const WEAKENERS: ReadonlyArray<Weakener> = [
  {
    lead: "A more inclusive Sabarimala-route definition",
    rest: "that includes additional ACs and shows a coherent LDF differential — would suggest the route effect is real but the 3-AC subset was too narrow.",
  },
  {
    lead: "Survey microdata",
    rest: "showing voters in pilgrim-route ACs cited Sabarimala as a primary motivator at higher rates than elsewhere — would indicate a latent effect masked at the AC level.",
  },
  {
    lead: "Multi-cycle data showing ministers usually lose more than non-minister incumbents",
    rest: "in similar conditions — would suggest the +0.74pp non-detection here is a 2026-specific artefact.",
  },
  {
    lead: "A 2031 LDF recovery from the −7pp baseline",
    rest: "— would confirm the anti-LDF reading. Failure to recover would suggest 2026 was a structural realignment rather than a transient anti-incumbency wave.",
  },
] as const

/** Right-rail nav anchors. Each id matches a `<section id="...">` in the page. */
export const RAIL_GROUPS = [
  {
    label: "Wave shape",
    items: [
      { id: "uniform", label: "Uniform, not concentrated" },
      { id: "distribution", label: "A tight, symmetric distribution" },
    ],
  },
  {
    label: "Falsifications",
    items: [
      { id: "not-sabarimala", label: "Not Sabarimala-route" },
      { id: "not-cabinet", label: "Not cabinet-status" },
    ],
  },
  {
    label: "Mechanism + caveats",
    items: [
      { id: "where-it-went", label: "Most went to UDF" },
      { id: "what-would-weaken", label: "What would weaken this" },
    ],
  },
] as const
