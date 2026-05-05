import { useMemo, useState } from "react"
import { IconSearch } from "@tabler/icons-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SeatCard, subjectOf, type SeatView } from "@/components/seat-card"
import {
  allianceForCandidate,
  constituenciesIn,
  getAlliance,
  getDistrict,
  partyShort,
  totalVotesIn,
  winnerOf,
  type AllianceCode,
  type Constituency,
} from "@/lib/data"

type SortKey =
  | "number"
  | "margin-asc"
  | "margin-desc"
  | "votes-desc"
  | "share-desc"
  | "share-margin-desc"
  | "nota-desc"

type AllianceFilter = "ALL" | "UDF" | "LDF" | "NDA"

const ALLIANCE_CHIPS: AllianceFilter[] = ["ALL", "UDF", "LDF", "NDA"]

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "number", label: "By number" },
  { value: "margin-asc", label: "Closest first" },
  { value: "margin-desc", label: "Largest margin" },
  { value: "votes-desc", label: "Most votes" },
  { value: "share-desc", label: "Vote share" },
  { value: "share-margin-desc", label: "Vote share margin" },
  { value: "nota-desc", label: "NOTA %" },
]

const VIEW_OPTIONS: Array<{ value: SeatView; label: string }> = [
  { value: "winner", label: "Winners" },
  { value: "runnerUp", label: "Runner-ups" },
  { value: "secondRunnerUp", label: "2nd runner-ups" },
]

const notaShareIn = (c: Constituency) => {
  const total = totalVotesIn(c)
  const nota = c.candidates.find((x) => x.isNota)
  return nota && total > 0 ? nota.votes / total : 0
}

const shareIn = (c: Constituency, view: SeatView) => {
  const total = totalVotesIn(c)
  const subj = subjectOf(c, view)
  return subj && total > 0 ? subj.votes / total : 0
}

const votesIn = (c: Constituency, view: SeatView) =>
  subjectOf(c, view)?.votes ?? -1

type Props = {
  scope: string | null
  onSelect: (n: number) => void
}

export function SeatGrid({ scope, onSelect }: Props) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("number")
  const [view, setView] = useState<SeatView>("winner")
  const [allianceFilter, setAllianceFilter] = useState<AllianceFilter>("ALL")

  const district = scope ? getDistrict(scope) : null
  const scopedConstituencies = useMemo(() => constituenciesIn(scope), [scope])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = scopedConstituencies.filter((c) => {
      if (allianceFilter !== "ALL") {
        const subj = subjectOf(c, view)
        if (!subj) return false
        const a = allianceForCandidate(c, subj)
        if (a !== allianceFilter) return false
      }
      if (!q) return true
      if (c.constituencyName.toLowerCase().includes(q)) return true
      return c.candidates.some(
        (cand) =>
          cand.name.toLowerCase().includes(q) ||
          cand.party.toLowerCase().includes(q) ||
          partyShort(cand.party).toLowerCase().includes(q)
      )
    })

    const sorted = [...list]
    switch (sort) {
      case "margin-asc":
        sorted.sort((a, b) => winnerOf(a).margin - winnerOf(b).margin)
        break
      case "margin-desc":
        sorted.sort((a, b) => winnerOf(b).margin - winnerOf(a).margin)
        break
      case "votes-desc":
        sorted.sort((a, b) => votesIn(b, view) - votesIn(a, view))
        break
      case "share-desc":
        sorted.sort((a, b) => shareIn(b, view) - shareIn(a, view))
        break
      case "share-margin-desc":
        sorted.sort((a, b) => {
          const ta = totalVotesIn(a) || 1
          const tb = totalVotesIn(b) || 1
          return winnerOf(b).margin / tb - winnerOf(a).margin / ta
        })
        break
      case "nota-desc":
        sorted.sort((a, b) => notaShareIn(b) - notaShareIn(a))
        break
      default:
        sorted.sort((a, b) => a.constituencyNumber - b.constituencyNumber)
    }
    return sorted
  }, [query, sort, view, allianceFilter, scopedConstituencies])

  const scopedTotal = scopedConstituencies.length
  const showOf = filtered.length !== scopedTotal

  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {district ? `Constituencies in ${district.name}` : "Constituencies"}
            <span className="ml-1.5 font-normal text-muted-foreground/70 normal-case">
              · {filtered.length}
              {showOf ? ` of ${scopedTotal}` : ""}
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <IconSearch
                className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search seat, candidate, party"
                className="w-60 pl-8"
              />
            </div>
            <Select
              value={view}
              onValueChange={(v) => v && setView(v as SeatView)}
            >
              <SelectTrigger aria-label="Show winners or runner-ups">
                <SelectValue placeholder="Show">
                  {(value: string) =>
                    VIEW_OPTIONS.find((o) => o.value === value)?.label ?? "Show"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {VIEW_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sort}
              onValueChange={(v) => v && setSort(v as SortKey)}
            >
              <SelectTrigger aria-label="Sort by">
                <SelectValue placeholder="Sort by">
                  {(value: string) =>
                    SORT_OPTIONS.find((o) => o.value === value)?.label ??
                    "Sort by"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ToggleGroup
          value={[allianceFilter]}
          onValueChange={(v) => {
            const next = (v[0] as AllianceFilter | undefined) ?? "ALL"
            setAllianceFilter(next)
          }}
          variant="outline"
          size="sm"
          spacing={2}
          className="mb-5"
        >
          {ALLIANCE_CHIPS.map((code) => {
            const meta =
              code === "ALL" ? null : getAlliance(code as AllianceCode)
            const active = allianceFilter === code
            return (
              <ToggleGroupItem
                key={code}
                value={code}
                aria-label={code === "ALL" ? "All alliances" : code}
                className="rounded-full"
                style={
                  active && meta
                    ? {
                        backgroundColor: meta.color,
                        borderColor: meta.color,
                        color: "#fff",
                      }
                    : undefined
                }
              >
                {meta && (
                  <span
                    className="mr-1 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: meta.color }}
                    aria-hidden
                  />
                )}
                {code === "ALL" ? "All alliances" : code}
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
            No constituencies match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <SeatCard
                key={c.constituencyNumber}
                constituency={c}
                view={view}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
