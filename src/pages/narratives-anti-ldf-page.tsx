import { Link } from "react-router-dom"

import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"

/**
 * Arc 1 page — the anti-LDF wave. Documents the broad uniform LDF
 * loss (mean -7.4pp, SD 4.5pp) and the three falsifications
 * (religion-blind, route-blind, cabinet-status-blind).
 *
 * Built per `docs/narratives-publish-plan.md` Phase 6. Currently a
 * scaffold (Phase 1); sections and visuals ship in Phase 6.
 */
export function NarrativesAntiLDFPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Narratives", href: "/narratives" },
        { label: "Anti-LDF wave" },
      ]}
      title="The anti-LDF wave was uniform"
    >
      <PageMain className="py-6 pb-10">
        <div className="rounded-lg border border-dashed bg-card/50 p-8 text-center text-sm text-muted-foreground">
          Arc 1 page is in scaffold state. Sections covering the
          uniform-loss distribution, religion / route / cabinet
          falsifications, and the where-did-LDF-loss-go flow
          decomposition ship in Phase 6.
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
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/a2-sabarimala-route.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              A2
            </a>
            ,{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/a6-cabinet-collapse.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              A6
            </a>
            ,{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/ldf-shallow-distribution.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              ldf-shallow-distribution
            </a>
            ,{" "}
            <a
              href="https://github.com/nvlsr/kerala-2026/blob/main/docs/narrative-cards/anti-ldf-flow.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              anti-ldf-flow
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
