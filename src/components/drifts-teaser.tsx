import { ChapterBreak } from "@/components/chapter-break"

/**
 * Bottom-of-/flows transition into /drifts. Thin wrapper around
 * [[ChapterBreak]] with the drifts copy. Subline names the three
 * sustained-drift patterns documented on the page.
 */
export function DriftsTeaser() {
  return (
    <ChapterBreak
      to="/drifts"
      headline="Which seats have drifted the same way for four cycles?"
      subline="LDF → NDA · LDF → UDF · UDF → NDA"
    />
  )
}
