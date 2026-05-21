import { ChapterBreak } from "@/components/chapter-break"

/**
 * Bottom-of-/explore transition into /questions. Thin wrapper around
 * [[ChapterBreak]] with the questions copy. Subline names the four
 * primary themes the page is sliced by.
 */
export function QuestionsTeaser() {
  return (
    <ChapterBreak
      to="/questions"
      headline="A few curated questions for the curious"
      subline="Margins · Vote share · Movement · Religion"
    />
  )
}
