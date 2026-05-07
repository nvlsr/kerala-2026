import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IconSearch, IconX } from "@tabler/icons-react"

import { ReservationBadge } from "@/components/reservation-badge"

import {
  SEARCH_GROUP_LABEL,
  SEARCH_GROUP_LIMIT,
  SEARCH_GROUP_ORDER,
  searchAll,
  type SearchResult,
  type SearchResultType,
} from "@/lib/search"
import { cn } from "@/lib/utils"

type Props = {
  /** When true, renders as a Google-style hero search bar — larger
   *  input, bigger font, narrower centered max-width, more vertical
   *  breathing room. Used on `/` where search is the page's primary
   *  affordance. Default false (compact) for /explore where search is
   *  one of several navigation tools. */
  prominent?: boolean
}

/**
 * Search affordance. Resolves candidate / seat / party / district /
 * alliance queries to existing filter-based URLs.
 *
 * Single in-memory index over ~1200 entities; substring match
 * case-insensitive, multi-word AND. Results group by type with a cap
 * per group; click any result to navigate.
 */
export function SearchBar({ prominent = false }: Props = {}) {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Compute groups + flat-ordered list (used for keyboard navigation)
  const { grouped, flat } = useMemo(() => {
    const results = searchAll(query)
    const grouped = new Map<SearchResultType, SearchResult[]>()
    for (const r of results) {
      if (!grouped.has(r.type)) grouped.set(r.type, [])
      grouped.get(r.type)!.push(r)
    }
    // Cap each group, then flatten in display order for keyboard nav.
    const flat: SearchResult[] = []
    const cappedGroups = new Map<SearchResultType, SearchResult[]>()
    for (const t of SEARCH_GROUP_ORDER) {
      const list = grouped.get(t) ?? []
      const capped = list.slice(0, SEARCH_GROUP_LIMIT)
      if (capped.length > 0) {
        cappedGroups.set(t, capped)
        flat.push(...capped)
      }
    }
    return { grouped: cappedGroups, flat }
  }, [query])

  // Reset highlight when results change
  useEffect(() => {
    setHighlightIdx(0)
  }, [query])

  // Click-outside to close
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  function selectResult(r: SearchResult) {
    navigate(r.url)
    setQuery("")
    setOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIdx((i) => Math.min(flat.length - 1, i + 1))
      setOpen(true)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIdx((i) => Math.max(0, i - 1))
    } else if (e.key === "Enter") {
      const target = flat[highlightIdx]
      if (target) {
        e.preventDefault()
        selectResult(target)
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const showDropdown = open && query.trim().length > 0
  const noMatches = showDropdown && flat.length === 0

  return (
    <section className={cn(prominent ? "py-12 sm:py-16" : "py-4")}>
      <div
        className={cn(
          "mx-auto px-6",
          prominent ? "max-w-3xl" : "max-w-6xl"
        )}
      >
        <div ref={containerRef} className="relative">
          <div
            className={cn(
              "flex items-center rounded-lg border focus-within:border-foreground/40",
              prominent
                ? "gap-3 bg-muted/60 px-5 py-4 focus-within:ring-2 focus-within:ring-foreground/15"
                : "gap-2 bg-card/50 px-3 py-2 focus-within:ring-1 focus-within:ring-foreground/15"
            )}
          >
            <IconSearch
              aria-hidden
              className={cn(
                "shrink-0 text-muted-foreground",
                prominent ? "h-5 w-5" : "h-4 w-4"
              )}
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={
                prominent
                  ? "Search any seat, candidate, party, or district…"
                  : "Search seats, candidates, parties, districts, or alliances…"
              }
              className={cn(
                "w-full bg-transparent placeholder:text-muted-foreground/60 focus:outline-none",
                prominent ? "text-base" : "text-sm"
              )}
              aria-label="Search"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("")
                  inputRef.current?.focus()
                }}
                aria-label="Clear search"
                className="shrink-0 rounded p-0.5 text-muted-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              >
                <IconX
                  className={prominent ? "h-4 w-4" : "h-3.5 w-3.5"}
                  aria-hidden
                />
              </button>
            )}
          </div>
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[60vh] overflow-y-auto rounded-lg border bg-popover text-popover-foreground shadow-md">
              {noMatches ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No matches for{" "}
                  <span className="font-medium text-foreground">
                    "{query.trim()}"
                  </span>
                  . Try a candidate name, seat name, party (e.g. "BJP"),
                  district (e.g. "Kollam"), or alliance.
                </div>
              ) : (
                <ResultsList
                  grouped={grouped}
                  flat={flat}
                  highlightIdx={highlightIdx}
                  onSelect={selectResult}
                  onHover={setHighlightIdx}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ResultsList({
  grouped,
  flat,
  highlightIdx,
  onSelect,
  onHover,
}: {
  grouped: Map<SearchResultType, SearchResult[]>
  flat: SearchResult[]
  highlightIdx: number
  onSelect: (r: SearchResult) => void
  onHover: (idx: number) => void
}) {
  const flatIndex = useMemo(() => {
    const m = new Map<string, number>()
    flat.forEach((r, i) => m.set(r.key, i))
    return m
  }, [flat])

  return (
    <div>
      {SEARCH_GROUP_ORDER.map((type) => {
        const items = grouped.get(type)
        if (!items || items.length === 0) return null
        return (
          <div
            key={type}
            className="border-b last:border-b-0"
          >
            <p className="px-3 pt-2 pb-1 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              {SEARCH_GROUP_LABEL[type]}
            </p>
            <ul>
              {items.map((r) => {
                const idx = flatIndex.get(r.key) ?? -1
                const highlighted = idx === highlightIdx
                return (
                  <li key={r.key}>
                    <button
                      type="button"
                      onClick={() => onSelect(r)}
                      onMouseEnter={() => onHover(idx)}
                      className={cn(
                        "flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-sm transition-colors",
                        highlighted
                          ? "bg-foreground/[0.06]"
                          : "hover:bg-foreground/[0.03]"
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-1.5 truncate font-medium">
                        <span className="truncate">{r.primaryText}</span>
                        {r.seat != null && <ReservationBadge seat={r.seat} />}
                      </span>
                      {r.secondaryText && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {r.secondaryText}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
