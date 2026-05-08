import { Link } from "react-router-dom"

import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"

/**
 * Arc 3 page — BJP geographic pocket. Documents the +0.18pp
 * statewide / ±25pp AC-level paradox: BJP grew 14-25pp in 11 ACs
 * (mostly contest-entry activations rather than organic
 * expansion) while withdrawing entirely from 26 others, with the
 * net cancelling at the statewide aggregate.
 *
 * Built per `docs/narratives-publish-plan.md` Phase 8. Currently a
 * scaffold (Phase 1); sections and visuals ship in Phase 8.
 */
export function NarrativesBJPPocketPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Narratives", href: "/narratives" },
        { label: "BJP geographic pocket" },
      ]}
      title="BJP grew +0.18pp statewide. The same number moved by ±25pp at the AC level."
    >
      <PageMain className="py-6 pb-10">
        <div className="rounded-lg border border-dashed bg-card/50 p-8 text-center text-sm text-muted-foreground">
          Arc 3 page is in scaffold state. Sections covering the 3
          BJP wins, the per-AC reshuffle (gains vs cessions), and
          the contest-entry vs organic distinction (with 2031
          falsification triggers) ship in Phase 8.
          <div className="mt-4 text-xs">
            Source cards:{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/a3-bjp-three-wins.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              A3
            </a>
            ,{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/bjp-ac-growth.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              bjp-ac-growth
            </a>
            .
          </div>
          <Link
            to="/narratives"
            className="mt-3 inline-block text-foreground underline-offset-2 hover:underline"
          >
            ← Back to /narratives
          </Link>
        </div>
      </PageMain>
    </PageShell>
  )
}
