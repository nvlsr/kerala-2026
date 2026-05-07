import { Fragment, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { IconHome, IconInfoCircle } from "@tabler/icons-react"

import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Variant = "default" | "compact"

/**
 * One crumb in the breadcrumb between Home and the current page.
 * The active page (last crumb) typically omits `href`; intermediate
 * crumbs that link to a parent route should set it.
 */
export type PageCrumb = {
  label: string
  href?: string
}

type Props = {
  /**
   * Crumbs after Home. Most pages pass a single-element array
   * `[{ label: "Belts" }]`. Drifts is hierarchical:
   * `[{ label: "Vote flows", href: "/flows" }, { label: "Drifts" }]`.
   */
  breadcrumbs: PageCrumb[]
  /** Page title — h1 content. */
  title: ReactNode
  /**
   * "default" — large title (text-3xl/4xl), full py-6 padding, supports
   *             info-icon popover beside title. Used by belts, drifts,
   *             flows, questions, religion-map.
   * "compact" — smaller title (text-2xl/3xl), pt-6 pb-2 padding, no
   *             popover slot. Used by explore (where the FilterBreadcrumb
   *             sits below).
   */
  variant?: Variant
  /** Optional info-popover content (default variant only). */
  aboutContent?: ReactNode
  /** Optional subtitle paragraph rendered below the h1. */
  subtitle?: ReactNode
  /** Page body — typically a <PageMain>, but pages may slot any flow. */
  children: ReactNode
}

/**
 * Shared layout shell for routed pages. Wraps the standard
 *   <div min-h-svh> → <header> (breadcrumb + title + ThemeToggle) →
 *   {children} → <SiteFooter />
 * structure that every page repeated.
 *
 * Breadcrumb: home icon (links to "/") + crumbs separated by middle
 * dots. The home/dashboard uses a separate <HomeHeader> shell and is
 * intentionally not migrated.
 */
export function PageShell({
  breadcrumbs,
  title,
  variant = "default",
  aboutContent,
  subtitle,
  children,
}: Props) {
  const isCompact = variant === "compact"
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header>
        <div
          className={cn(
            "mx-auto flex max-w-6xl items-start justify-between gap-4 px-6",
            isCompact ? "pt-6 pb-2" : "py-6"
          )}
        >
          <div className="min-w-0">
            <Breadcrumb>
              <BreadcrumbList className="text-sm font-medium tracking-wide uppercase">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    render={<Link to="/" aria-label="Home" />}
                    className="inline-flex items-center"
                  >
                    <IconHome className="h-4 w-4" aria-hidden />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb, i) => {
                  const isLast = i === breadcrumbs.length - 1
                  return (
                    <Fragment key={crumb.label}>
                      <BreadcrumbSeparator>·</BreadcrumbSeparator>
                      <BreadcrumbItem>
                        {isLast || !crumb.href ? (
                          <BreadcrumbPage className="font-medium text-muted-foreground">
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink render={<Link to={crumb.href} />}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
            <h1
              className={cn(
                "font-heading font-semibold tracking-tight",
                isCompact
                  ? "mt-1 text-2xl sm:text-3xl"
                  : "mt-1 flex items-center gap-2 text-3xl sm:text-4xl"
              )}
            >
              {title}
              {!isCompact && aboutContent && (
                <Popover>
                  <PopoverTrigger
                    aria-label="About this page"
                    className="inline-flex shrink-0 items-center justify-center rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    <IconInfoCircle className="h-5 w-5" aria-hidden />
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 sm:w-96"
                    align="start"
                    sideOffset={8}
                  >
                    {aboutContent}
                  </PopoverContent>
                </Popover>
              )}
            </h1>
            {subtitle}
          </div>
          <ThemeToggle />
        </div>
      </header>
      {children}
      <SiteFooter />
    </div>
  )
}
