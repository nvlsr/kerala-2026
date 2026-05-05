import { useEffect, useMemo, useRef, useState } from "react"
import { IconCheck } from "@tabler/icons-react"

import { AlliancePill } from "@/components/alliance-pill"
import { Section } from "@/components/section"
import { Stat } from "@/components/stat"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { HistoricalChart } from "@/components/historical-chart"
import { PastWinners } from "@/components/past-winners"
import { cn } from "@/lib/utils"
import {
  allianceForCandidate,
  displayConstituencyName,
  districtForConstituency,
  formatNumber,
  formatPercent,
  getAlliance,
  getTrendData,
  isMainFront,
  normalizeCandidateName,
  partyShort,
  totalVotesIn,
  winnerOf,
  type Candidate,
  type Constituency,
} from "@/lib/data"

const WINNERS_KEY = "__winners__"
const ROSTER_KEY = "__roster__"
// Hide candidates polling under 1% from the default roster view
const ROSTER_THRESHOLD = 0.01

type Props = {
  constituency: Constituency
}

export function ConstituencySection({ constituency }: Props) {
  const [selectedKey, setSelectedKey] = useState<string>(WINNERS_KEY)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (el) {
      requestAnimationFrame(() =>
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      )
    }
  }, [])

  const winner = winnerOf(constituency)
  const winnerAllianceCode = allianceForCandidate(constituency, winner)
  const winnerAlliance = getAlliance(winnerAllianceCode)
  const total = totalVotesIn(constituency)
  const winnerShare = total > 0 ? (winner.votes / total) * 100 : 0
  const winnerMarginPct = total > 0 ? (winner.margin / total) * 100 : 0
  const district = districtForConstituency(constituency)

  const trend = useMemo(
    () => getTrendData(constituency.constituencyNumber),
    [constituency.constituencyNumber]
  )
  const partyOptions = trend?.series ?? []
  const isRoster = selectedKey === ROSTER_KEY
  const isWinners = selectedKey === WINNERS_KEY
  const selectedParty = isRoster || isWinners ? null : selectedKey
  const highlightParty = isRoster ? null : selectedParty

  return (
    <Section
      refEl={sectionRef}
      className="scroll-mt-4"
      title="Constituency"
      subtitle={
        <>
          {displayConstituencyName(constituency)}
          {district && (
            <span className="text-muted-foreground/60">
              {" · "}
              {district.name} district
            </span>
          )}
        </>
      }
    >
      <div className="mb-4 overflow-hidden rounded-lg border bg-muted/40">
        <div
          className="h-1 w-full"
          style={{ backgroundColor: winnerAlliance.color }}
          aria-hidden
        />
        <div className="flex flex-wrap items-baseline justify-between gap-3 p-4">
          <div className="min-w-0">
            <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Winner
            </div>
            <div className="flex items-baseline gap-2">
              <span className="truncate font-heading text-lg font-semibold">
                {normalizeCandidateName(winner.name)}
              </span>
              <span
                className="text-sm text-muted-foreground"
                title={winner.party}
              >
                {partyShort(winner.party)}
              </span>
              <AlliancePill code={winnerAllianceCode} />
            </div>
          </div>
          <div className="flex items-baseline gap-6 text-sm">
            <Stat label="Share" value={formatPercent(winnerShare / 100, 1)} />
            <Stat
              label="Margin"
              value={`+${formatPercent(winnerMarginPct / 100, 1)}`}
            />
            <Stat label="Votes" value={formatNumber(winner.votes)} />
          </div>
        </div>
      </div>

      <ToggleGroup
        value={[selectedKey]}
        onValueChange={(v) => {
          const next = (v[0] as string | undefined) ?? WINNERS_KEY
          setSelectedKey(next)
        }}
        variant="outline"
        size="sm"
        spacing={2}
        className="mb-3"
      >
        <ToggleGroupItem value={WINNERS_KEY} className="rounded-full">
          Winners
        </ToggleGroupItem>
        <ToggleGroupItem value={ROSTER_KEY} className="rounded-full">
          2026 roster
        </ToggleGroupItem>
        {partyOptions.map((p) => {
          const active = selectedKey === p.party
          return (
            <ToggleGroupItem
              key={p.party}
              value={p.party}
              className="rounded-full"
              style={
                active
                  ? {
                      backgroundColor: p.color,
                      borderColor: p.color,
                      color: "#fff",
                    }
                  : undefined
              }
            >
              <span
                className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: p.color }}
                aria-hidden
              />
              {p.partyShort}
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="overflow-hidden rounded-lg border bg-muted/40 p-4 lg:col-span-3">
          {isRoster ? (
            <RosterTable constituency={constituency} />
          ) : (
            <PastWinners
              constituencyNumber={constituency.constituencyNumber}
              selectedParty={selectedParty}
            />
          )}
        </div>
        <div className="rounded-lg border bg-muted/40 p-4 lg:col-span-2">
          <HistoricalChart
            constituencyNumber={constituency.constituencyNumber}
            highlightParty={highlightParty}
          />
        </div>
      </div>
    </Section>
  )
}

function RosterTable({ constituency }: { constituency: Constituency }) {
  const total = totalVotesIn(constituency)
  const winner = winnerOf(constituency)
  const candidates = [...constituency.candidates]
    .filter(
      (c) => !c.isNota && total > 0 && c.votes / total >= ROSTER_THRESHOLD
    )
    .sort((a, b) => b.votes - a.votes)

  if (candidates.length === 0) {
    return (
      <div className="py-3 text-center text-xs text-muted-foreground">
        No major-party candidates with at least 1% share.
      </div>
    )
  }

  return (
    <ul className="flex flex-col">
      {candidates.map((c, i) => (
        <RosterRow
          key={c.name + c.party}
          rank={i + 1}
          candidate={c}
          constituency={constituency}
          winner={winner}
          total={total}
        />
      ))}
    </ul>
  )
}

function RosterRow({
  rank,
  candidate,
  constituency,
  winner,
  total,
}: {
  rank: number
  candidate: Candidate
  constituency: Constituency
  winner: Candidate
  total: number
}) {
  const allianceCode = allianceForCandidate(constituency, candidate)
  const meta = getAlliance(allianceCode)
  const main = isMainFront(allianceCode)
  const isWinner = candidate === winner
  const margin = isWinner ? candidate.margin : candidate.votes - winner.votes
  const marginPct = total > 0 ? (margin / total) * 100 : 0
  const sharePct = total > 0 ? (candidate.votes / total) * 100 : 0

  return (
    <li
      className={cn(
        "flex items-center gap-2 border-b border-border/40 py-1.5 text-xs last:border-b-0",
        isWinner && "font-medium"
      )}
    >
      <span className="w-5 shrink-0 text-muted-foreground tabular-nums">
        {rank}
      </span>
      <span className="flex w-16 shrink-0 items-center gap-1.5">
        <span
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
          style={{
            backgroundColor: main ? meta.color : "var(--muted-foreground)",
            opacity: main ? 1 : 0.5,
          }}
          aria-hidden
        />
        <span className="truncate text-foreground/80" title={candidate.party}>
          {partyShort(candidate.party)}
        </span>
      </span>
      <span className="min-w-0 flex-1 truncate" title={candidate.name}>
        {normalizeCandidateName(candidate.name)}
      </span>
      {isWinner && (
        <IconCheck
          className="h-3.5 w-3.5 shrink-0"
          style={{ color: main ? meta.color : undefined }}
          aria-hidden
        />
      )}
      <span className="w-12 shrink-0 text-right tabular-nums">
        {formatPercent(sharePct / 100, 1)}
      </span>
      <span className="w-16 shrink-0 text-right text-muted-foreground tabular-nums">
        {margin >= 0 ? "+" : ""}
        {formatPercent(marginPct / 100, 1)}
      </span>
    </li>
  )
}
