/**
 * EyebrowCard — bordered card with a small uppercase eyebrow label
 * and an optional right-aligned slot in the header. Used for thesis
 * ledes, synthesis recaps, and similar standout summary cards in the
 * walkthrough pages.
 *
 * Variants:
 *   <ThesisLede confidence="strong">…thesis prose…</ThesisLede>
 *   <SynthesisCard id="synthesis">…recap prose…</SynthesisCard>
 *
 * (Both are thin wrappers over EyebrowCard with preset labels.)
 */
import type { ReactNode } from "react"

import {
  ConfidenceBadge,
  type ConfidenceLevel,
} from "@/components/walkthroughs/confidence-badge"
import { cn } from "@/lib/utils"

type EyebrowCardProps = {
  /** Uppercase tag shown at the top-left of the card (e.g. "Thesis"). */
  label: string
  /** Optional anchor id; pairs with `scroll-mt-20` for in-page jumps. */
  id?: string
  /** Optional right-aligned slot in the header (e.g. ConfidenceBadge). */
  rightSlot?: ReactNode
  /** Body. */
  children: ReactNode
}

export function EyebrowCard({
  label,
  id,
  rightSlot,
  children,
}: EyebrowCardProps) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-md border bg-card/50 p-5 sm:p-6",
        id && "scroll-mt-20"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          rightSlot ? "mb-3 justify-between" : "mb-2"
        )}
      >
        <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          {label}
        </p>
        {rightSlot}
      </div>
      {children}
    </section>
  )
}

type ThesisLedeProps = {
  confidence: ConfidenceLevel
  children: ReactNode
}

/** Thesis lede card — used at the top of every walkthrough arc page. */
export function ThesisLede({ confidence, children }: ThesisLedeProps) {
  return (
    <EyebrowCard
      label="Thesis"
      rightSlot={<ConfidenceBadge level={confidence} />}
    >
      {children}
    </EyebrowCard>
  )
}

type SynthesisCardProps = {
  id?: string
  children: ReactNode
}

/** Synthesis recap card — used at the end of a walkthrough arc. */
export function SynthesisCard({
  id = "synthesis",
  children,
}: SynthesisCardProps) {
  return (
    <EyebrowCard label="Synthesis" id={id}>
      {children}
    </EyebrowCard>
  )
}
