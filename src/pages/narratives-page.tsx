import { Link } from "react-router-dom"

import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"

/**
 * Top page of the /narratives surface. Hero + 3 arc cards + sidebar
 * callouts. The reader should grasp the three-arc thesis in 90s.
 *
 * Built per `docs/narratives-publish-plan.md` Phase 5. Currently a
 * scaffold (Phase 1); visuals and arc cards added in Phase 5.
 */
export function NarrativesPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: "Narratives" }]}
      title="Kerala 2026 was three overlapping patterns, not one wave"
      aboutContent={
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            A constituency-level decomposition of Kerala 2026.
            Anti-LDF anti-incumbency was the broad universal driver
            (~7pp uniform). Central Kerala added a Christian-belt UDF
            premium that converted a normal anti-incumbency election
            into a landslide. BJP's flat statewide aggregate masked a
            major per-AC reorganisation in southern and central
            Kerala.
          </p>
          <p className="border-t pt-3 text-muted-foreground">
            Each arc has its own page with choropleths and supporting
            charts. Source analyses linked from each arc page are at{" "}
            <Link
              to="/explore"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              /explore
            </Link>{" "}
            (interactive seat-level data) and on GitHub (academic
            depth, the full narrative-card source documents).
          </p>
        </div>
      }
    >
      <PageMain className="py-6 pb-10">
        <div className="rounded-lg border border-dashed bg-card/50 p-8 text-center text-sm text-muted-foreground">
          Top page is in scaffold state. Arc cards, hero composite
          visualisation, and sidebar callouts ship in Phase 5.
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-foreground">
            <Link
              to="/narratives/anti-ldf-wave"
              className="rounded-md border bg-background px-3 py-1.5 hover:bg-foreground/5"
            >
              Arc 1 — Anti-LDF wave
            </Link>
            <Link
              to="/narratives/central-kerala"
              className="rounded-md border bg-background px-3 py-1.5 hover:bg-foreground/5"
            >
              Arc 2 — Central Kerala
            </Link>
            <Link
              to="/narratives/bjp-pocket"
              className="rounded-md border bg-background px-3 py-1.5 hover:bg-foreground/5"
            >
              Arc 3 — BJP geographic pocket
            </Link>
          </div>
        </div>
      </PageMain>
    </PageShell>
  )
}
