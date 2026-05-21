import { ChapterBreak } from "@/components/chapter-break"

/**
 * Bottom-of-/questions transition into /walkthroughs. Thin wrapper
 * around [[ChapterBreak]] with the walkthrough copy.
 */
export function WalkthroughsTeaser() {
  return (
    <ChapterBreak
      to="/walkthroughs"
      headline="The three patterns behind Kerala 2026"
      subline="LDF · UDF · NDA · Christian"
    />
  )
}
