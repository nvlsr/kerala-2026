import { Link } from "react-router-dom"
import { IconGift } from "@tabler/icons-react"

/**
 * Quiet bottom-of-dashboard nudge to /questions. A single small line,
 * not a full CTA card — visible to readers who scroll all the way
 * down, easy to ignore for everyone else. Replaces the prior "A
 * treat for the curious" gift card which competed with actual
 * content for attention. The IconGift is preserved (small, inline)
 * to keep a hint of the "gift" framing without the visual weight.
 */
export function QuestionsTeaser() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center">
        <Link
          to="/questions"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconGift className="h-4 w-4" aria-hidden />A few curated questions
          for the curious →
        </Link>
      </div>
    </section>
  )
}
