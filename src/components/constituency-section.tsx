import { useEffect, useMemo, useRef, useState } from "react"
import { IconCheck } from "@tabler/icons-react"

import { Section } from "@/components/section"
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

const PAST_WINNERS_KEY = "__past-winners__"
const RESULT_KEY = "__result__"
// Hide candidates polling under 1% from the default roster view
const ROSTER_THRESHOLD = 0.01

type Props = {
  constituency: Constituency
}

export function ConstituencySection({ constituency }: Props) {
  const [selectedKey, setSelectedKey] = useState<string>(RESULT_KEY)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (el) {
      requestAnimationFrame(() =>
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      )
    }
  }, [])

  const district = districtForConstituency(constituency)

  const trend = useMemo(
    () => getTrendData(constituency.constituencyNumber),
    [constituency.constituencyNumber]
  )
  const partyOptions = trend?.parties ?? []
  const isResult = selectedKey === RESULT_KEY
  const isPastWinners = selectedKey === PAST_WINNERS_KEY
  const selectedParty = isResult || isPastWinners ? null : selectedKey
  // The chart shows alliance lines, so a party-chip selection highlights the
  // alliance that party belongs to (using its most-recent affiliation).
  const highlightAlliance = isResult
    ? null
    : (partyOptions.find((p) => p.party === selectedParty)?.allianceCode ??
      null)

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
      <ToggleGroup
        value={[selectedKey]}
        onValueChange={(v) => {
          const next = (v[0] as string | undefined) ?? RESULT_KEY
          setSelectedKey(next)
        }}
        variant="outline"
        size="sm"
        spacing={2}
        className="mb-3"
      >
        <ToggleGroupItem value={RESULT_KEY} className="rounded-full">
          2026 result
        </ToggleGroupItem>
        <ToggleGroupItem value={PAST_WINNERS_KEY} className="rounded-full">
          Past winners
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
        <div className="overflow-hidden rounded-lg border lg:col-span-3">
          {isResult ? (
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
            highlightAlliance={highlightAlliance}
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
      <div className="py-6 text-center text-xs text-muted-foreground">
        No major-party candidates with at least 1% share.
      </div>
    )
  }

  return (
    <table className="w-full table-fixed text-sm">
      <colgroup>
        <col style={{ width: "32%" }} />
        <col style={{ width: "14%" }} />
        <col style={{ width: "8%" }} />
        <col style={{ width: "16%" }} />
        <col style={{ width: "12%" }} />
        <col style={{ width: "18%" }} />
      </colgroup>
      <thead className="bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <tr>
          <th className="border-b px-3 py-2 text-left">Candidate</th>
          <th className="border-b px-3 py-2 text-left">Party</th>
          <th className="border-b px-3 py-2 text-center">
            <IconCheck
              className="inline-block h-3.5 w-3.5"
              aria-label="Winner"
            />
          </th>
          <th className="border-b px-3 py-2 text-right">Votes</th>
          <th className="border-b px-3 py-2 text-right">Share</th>
          <th
            className="border-b px-3 py-2 text-right"
            title="Votes ahead of the runner-up (winner, positive) or behind the winner (losers, negative). The smaller value is the margin as a share of total votes cast."
          >
            Margin
          </th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((c) => (
          <RosterRow
            key={c.name + c.party}
            candidate={c}
            constituency={constituency}
            winner={winner}
            total={total}
          />
        ))}
      </tbody>
    </table>
  )
}

function RosterRow({
  candidate,
  constituency,
  winner,
  total,
}: {
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
    <tr
      className={cn(
        "border-b last:border-b-0",
        isWinner && "font-medium"
      )}
    >
      <td className="relative px-3 py-2">
        <span
          className="absolute inset-y-0 left-0 w-0.5"
          style={{ backgroundColor: main ? meta.color : "var(--border)" }}
          aria-hidden
        />
        <span className="block truncate" title={candidate.name}>
          {normalizeCandidateName(candidate.name)}
        </span>
      </td>
      <td className="px-3 py-2">
        <span className="block truncate" title={candidate.party}>
          {partyShort(candidate.party)}
        </span>
      </td>
      <td className="px-3 py-2 text-center">
        {isWinner && (
          <IconCheck
            className="inline-block h-3.5 w-3.5 text-emerald-500"
            aria-label="Winner"
          />
        )}
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        {formatNumber(candidate.votes)}
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        {formatPercent(sharePct / 100, 1)}
      </td>
      <td
        className={cn(
          "px-3 py-2 text-right tabular-nums",
          isWinner ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {margin >= 0 ? "+" : ""}
        {formatNumber(margin)}
        <span className="ml-1 inline-block min-w-[2.75rem] text-right text-[11px] text-muted-foreground/70">
          {marginPct >= 0 ? "+" : ""}
          {formatPercent(marginPct / 100, 1)}
        </span>
      </td>
    </tr>
  )
}
