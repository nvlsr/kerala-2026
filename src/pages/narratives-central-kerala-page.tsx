import { Link } from "react-router-dom"

import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"

/**
 * Arc 2 page — Central Kerala UDF amplification. Documents the
 * 47-of-47 sweep + the Christian-belt premium (β=+0.19, p=0.008
 * with district FE) + the FPTP mechanism (UDF seat:vote-share
 * ratio 1.04 → 2.18) that turned a 7pp swing into a 102-seat
 * majority.
 *
 * Built per `docs/narratives-publish-plan.md` Phase 7. Currently a
 * scaffold (Phase 1); sections and visuals ship in Phase 7.
 */
export function NarrativesCentralKeralaPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Narratives", href: "/narratives" },
        { label: "Central Kerala" },
      ]}
      title="Central Kerala provided nearly half of UDF's majority margin"
    >
      <PageMain className="py-6 pb-10">
        <div className="rounded-lg border border-dashed bg-card/50 p-8 text-center text-sm text-muted-foreground">
          Arc 2 page is in scaffold state. Sections covering the
          47-of-47 sweep, the Christian-belt premium scatter, the
          FPTP efficiency-flip mechanism, and the Muslim-share
          non-finding ship in Phase 7.
          <div className="mt-4 text-xs">
            Source cards:{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/a1-minority-consolidation.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              A1
            </a>
            ,{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/a8-central-kerala-kingmaker.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              A8
            </a>
            ,{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/vote-efficiency.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              vote-efficiency
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
