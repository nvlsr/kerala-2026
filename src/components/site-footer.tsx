import { Link } from "react-router-dom"

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-auto flex w-full max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-6 pt-8 pb-10 text-xs text-muted-foreground">
      <span>Data: Election Commission of India · results.eci.gov.in</span>
      <span aria-hidden>·</span>
      <Link
        to="/insights"
        className="underline-offset-2 hover:text-foreground hover:underline"
      >
        Insights
      </Link>
      <span aria-hidden>·</span>
      <a
        href="https://github.com/nvlsr/kerala-2026"
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-2 hover:text-foreground hover:underline"
      >
        Open source (MIT) on GitHub
      </a>
      <span aria-hidden>·</span>
      <a
        href="https://github.com/nvlsr/kerala-2026/issues/new"
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-2 hover:text-foreground hover:underline"
      >
        Report an issue
      </a>
    </footer>
  )
}
