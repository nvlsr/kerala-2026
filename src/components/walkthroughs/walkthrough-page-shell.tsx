/**
 * WalkthroughPageShell — outer chrome for the LDF / NDA / UDF
 * walkthrough pages. Bundles the breadcrumb + title + 1fr+180px grid
 * + section-stack scroll-y + sticky right rail into one component so
 * page bodies only need to provide `railGroups` + their content.
 *
 * Methodology and Insights walkthrough pages have different layouts
 * (TOC at top / interactive UI) and don't use this shell.
 */
import type { ReactNode } from "react"

import { PageMain } from "@/components/page-main"
import { PageShell } from "@/components/page-shell"
import {
  PageRail,
  type RailGroup,
} from "@/components/walkthroughs/walkthrough-rail"

type Props = {
  /** Page title (large heading). */
  title: string
  /** Breadcrumb leaf label (e.g. "UDF"). The "Walkthroughs" parent
   *  crumb is added automatically. */
  breadcrumbLeaf: string
  /** Right-rail anchor groups. */
  railGroups: ReadonlyArray<RailGroup>
  /** Section content for the left column. Rendered inside a
   *  `space-y-10` container. */
  children: ReactNode
}

export function WalkthroughPageShell({
  title,
  breadcrumbLeaf,
  railGroups,
  children,
}: Props) {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Walkthroughs", href: "/walkthroughs" },
        { label: breadcrumbLeaf },
      ]}
      title={title}
    >
      <PageMain className="py-6 pb-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div className="min-w-0 space-y-10">{children}</div>
          <PageRail groups={railGroups} />
        </div>
      </PageMain>
    </PageShell>
  )
}
