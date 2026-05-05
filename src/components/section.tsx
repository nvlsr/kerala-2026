import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  refEl?: React.Ref<HTMLElement>
}

export function Section({
  title,
  subtitle,
  actions,
  children,
  className,
  refEl,
}: Props) {
  const heading = (
    <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
      {title}
      {subtitle != null && (
        <span className="ml-1.5 font-normal text-muted-foreground/70 normal-case">
          · {subtitle}
        </span>
      )}
    </h2>
  )

  return (
    <section ref={refEl} className={cn("border-t", className)}>
      <div className="mx-auto max-w-6xl px-6 py-6">
        {actions ? (
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {heading}
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          </div>
        ) : (
          <div className="mb-3">{heading}</div>
        )}
        {children}
      </div>
    </section>
  )
}
