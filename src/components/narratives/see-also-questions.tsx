import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

type Item = {
  id: string
  label: string
  hint?: string
}

type Props = {
  items: Item[]
  heading?: string
  className?: string
}

/**
 * Footer rail of related /questions cards. Each item deep-links to
 * the card via hash anchor (e.g. /questions#bjp-gains). Lets readers
 * pivot from the narrative essay into the explorable seat-level
 * tables for a specific question.
 */
export function SeeAlsoQuestions({
  items,
  heading = "Explore related questions",
  className,
}: Props) {
  return (
    <section
      aria-label="Related questions"
      className={cn("border-t pt-6", className)}
    >
      <h2 className="font-heading text-base font-semibold tracking-tight">
        {heading}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Drill into seat-level tables for each question on /questions.
      </p>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={`/questions#${item.id}`}
              className="block h-full rounded-sm border bg-card/30 p-3 text-left transition-colors hover:border-foreground/40 hover:bg-card/60"
            >
              <p className="text-sm font-medium leading-snug">
                {item.label}
              </p>
              {item.hint && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.hint}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
