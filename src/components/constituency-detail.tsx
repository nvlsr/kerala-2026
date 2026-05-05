import { useState } from "react"
import {
  IconArrowUpRight,
  IconCheck,
  IconChevronDown,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AlliancePill } from "@/components/alliance-pill"
import { HistoricalChart, type DrawerMode } from "@/components/historical-chart"
import { PartyLink } from "@/components/party-link"
import { PastWinners } from "@/components/past-winners"
import {
  allianceForCandidate,
  displayConstituencyName,
  districtForConstituency,
  formatNumber,
  formatPercent,
  getAlliance,
  isMainFront,
  normalizeCandidateName,
  totalVotesIn,
  winnerOf,
  type Candidate,
  type Constituency,
} from "@/lib/data"

type Props = {
  constituency: Constituency | null
  onClose: () => void
  onSelectDistrict: (districtId: string) => void
  onSelectParty: (party: string) => void
}

export function ConstituencyDetail({
  constituency,
  onClose,
  onSelectDistrict,
  onSelectParty,
}: Props) {
  return (
    <Sheet
      open={constituency != null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent
        side="right"
        className="!w-full sm:!max-w-xl md:!max-w-2xl lg:!w-1/2 lg:!max-w-[900px]"
      >
        {constituency && (
          <DetailBody
            constituency={constituency}
            onSelectDistrict={onSelectDistrict}
            onSelectParty={onSelectParty}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

function DetailBody({
  constituency,
  onSelectDistrict,
  onSelectParty,
}: {
  constituency: Constituency
  onSelectDistrict: (districtId: string) => void
  onSelectParty: (party: string) => void
}) {
  const [mode, setMode] = useState<DrawerMode>("share")
  const winner = winnerOf(constituency)
  const winnerAlliance = getAlliance(allianceForCandidate(constituency, winner))
  const total = totalVotesIn(constituency)
  const district = districtForConstituency(constituency)

  const realCandidates = [...constituency.candidates]
    .filter((c) => !c.isNota)
    .sort((a, b) => b.votes - a.votes)
  const runnersUp = realCandidates.slice(1, 3)
  const tail = realCandidates.slice(3)
  const nota = constituency.candidates.find((c) => c.isNota) ?? null

  const winnerSharePct = total > 0 ? (winner.votes / total) * 100 : 0
  const winnerMarginPct = total > 0 ? (winner.margin / total) * 100 : 0

  return (
    <div className="flex h-full flex-col">
      <div
        className="h-1 w-full shrink-0"
        style={{ backgroundColor: winnerAlliance.color }}
        aria-hidden
      />
      <div className="border-b px-6 py-5">
        <SheetDescription className="text-xs font-medium tracking-wide uppercase">
          {constituency.state} · Assembly Constituency
        </SheetDescription>
        <SheetTitle className="font-heading text-2xl font-semibold tracking-tight">
          {displayConstituencyName(constituency)}
        </SheetTitle>
        {district && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => onSelectDistrict(district.id)}
            className="mt-2"
            title={`Filter to ${district.name} district`}
          >
            <IconArrowUpRight />
            {district.name} district
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-b px-6 py-3 text-sm">
        <div className="flex items-center gap-6">
          <InlineStat
            label="Candidates"
            value={String(
              constituency.candidates.filter((c) => !c.isNota).length
            )}
          />
          <InlineStat label="Votes counted" value={formatNumber(total)} />
        </div>
        <ToggleGroup
          value={[mode]}
          onValueChange={(v) => {
            const next = (v[0] as DrawerMode | undefined) ?? mode
            setMode(next)
          }}
          variant="outline"
          size="sm"
          spacing={0}
        >
          <ToggleGroupItem value="share">Share %</ToggleGroupItem>
          <ToggleGroupItem value="votes">Votes</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mb-5 rounded-lg border bg-muted/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Winner
            </div>
            <AlliancePill code={winnerAlliance.code} />
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-semibold">
                {normalizeCandidateName(winner.name)}
              </div>
              <PartyLink
                party={winner.party}
                onSelect={onSelectParty}
                className="block text-sm text-muted-foreground"
              />
            </div>
            <div className="shrink-0 text-right">
              <div className="text-lg font-semibold tabular-nums">
                {mode === "share"
                  ? formatPercent(winnerSharePct / 100, 1)
                  : formatNumber(winner.votes)}
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">
                margin +
                {mode === "share"
                  ? formatPercent(winnerMarginPct / 100, 1)
                  : formatNumber(winner.margin)}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <HistoricalChart
            constituencyNumber={constituency.constituencyNumber}
            mode={mode}
          />
        </div>

        <div className="mb-5">
          <PastWinners
            constituencyNumber={constituency.constituencyNumber}
            mode={mode}
          />
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Other candidates
          </div>
          <ol className="flex flex-col gap-2">
            {runnersUp.map((cand, i) => (
              <CandidateRow
                key={cand.name + cand.party}
                candidate={cand}
                rank={i + 2}
                constituency={constituency}
                winnerVotes={winner.votes}
                isWinner={false}
                mode={mode}
                onSelectParty={onSelectParty}
              />
            ))}
          </ol>

          {nota && (
            <CompactRow
              candidate={nota}
              rank={null}
              constituency={constituency}
              mode={mode}
              onSelectParty={onSelectParty}
            />
          )}

          {tail.length > 0 && (
            <details className="group/tail mt-3">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-md px-1 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                <IconChevronDown className="h-3.5 w-3.5 transition-transform group-open/tail:rotate-180" />
                <span>
                  {tail.length} more candidate{tail.length === 1 ? "" : "s"}
                </span>
              </summary>
              <ul className="mt-1 flex flex-col">
                {tail.map((cand, i) => (
                  <CompactRow
                    key={cand.name + cand.party}
                    candidate={cand}
                    rank={i + 4}
                    constituency={constituency}
                    mode={mode}
                    onSelectParty={onSelectParty}
                  />
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

function InlineStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="text-base font-medium tabular-nums">{value}</div>
    </div>
  )
}

function CandidateRow({
  candidate,
  rank,
  constituency,
  winnerVotes,
  isWinner,
  mode,
  onSelectParty,
}: {
  candidate: Candidate
  rank: number
  constituency: Constituency
  winnerVotes: number
  isWinner: boolean
  mode: DrawerMode
  onSelectParty: (party: string) => void
}) {
  const allianceCode = allianceForCandidate(constituency, candidate)
  const alliance = getAlliance(allianceCode)
  const widthPct = winnerVotes > 0 ? (candidate.votes / winnerVotes) * 100 : 0
  const totalVotes = totalVotesIn(constituency)
  const sharePct = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
  const marginPct = totalVotes > 0 ? (candidate.margin / totalVotes) * 100 : 0
  const main = isMainFront(allianceCode)

  return (
    <li
      className={cn(
        "relative overflow-hidden rounded-lg border px-3 py-2.5",
        isWinner && "border-foreground/20",
        !main && "opacity-90"
      )}
    >
      {main ? (
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${widthPct}%`,
            backgroundColor: alliance.color + (isWinner ? "26" : "12"),
          }}
          aria-hidden
        />
      ) : (
        <div
          className="absolute inset-y-0 left-0 bg-muted/60"
          style={{ width: `${widthPct}%` }}
          aria-hidden
        />
      )}
      <div className="relative flex items-center gap-3">
        <span className="w-5 shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={cn("truncate text-sm", isWinner && "font-semibold")}
            >
              {normalizeCandidateName(candidate.name)}
            </span>
            {isWinner && (
              <IconCheck
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: main ? alliance.color : undefined }}
              />
            )}
          </div>
          <div className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <PartyLink
              party={candidate.party}
              onSelect={onSelectParty}
              className="truncate"
            />
            <AlliancePill code={allianceCode} />
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-medium tabular-nums">
            {mode === "share"
              ? formatPercent(sharePct / 100, 1)
              : formatNumber(candidate.votes)}
          </div>
          <div className="text-[11px] text-muted-foreground tabular-nums">
            {mode === "share"
              ? `${marginPct >= 0 ? "+" : ""}${formatPercent(marginPct / 100, 1)}`
              : `${candidate.margin >= 0 ? "+" : ""}${formatNumber(candidate.margin)}`}
          </div>
        </div>
      </div>
    </li>
  )
}

function CompactRow({
  candidate,
  rank,
  constituency,
  mode,
  onSelectParty,
}: {
  candidate: Candidate
  rank: number | null
  constituency: Constituency
  mode: DrawerMode
  onSelectParty: (party: string) => void
}) {
  const allianceCode = allianceForCandidate(constituency, candidate)
  const alliance = getAlliance(allianceCode)
  const main = isMainFront(allianceCode)
  const totalVotes = totalVotesIn(constituency)
  const sharePct = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0

  return (
    <li className="flex items-center gap-3 border-b px-1 py-1.5 text-xs last:border-b-0">
      <span className="w-5 shrink-0 text-muted-foreground tabular-nums">
        {rank ?? "—"}
      </span>
      <span
        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          backgroundColor: main ? alliance.color : "var(--muted-foreground)",
          opacity: main ? 1 : 0.5,
        }}
        aria-hidden
      />
      <span
        className={cn(
          "min-w-0 flex-1 truncate",
          candidate.isNota && "font-medium"
        )}
        title={candidate.party}
      >
        {candidate.isNota
          ? candidate.name
          : normalizeCandidateName(candidate.name)}
      </span>
      <span className="shrink-0 text-muted-foreground">
        {candidate.isNota ? (
          ""
        ) : (
          <PartyLink party={candidate.party} onSelect={onSelectParty} />
        )}
      </span>
      <span className="w-16 shrink-0 text-right tabular-nums">
        {mode === "share"
          ? formatPercent(sharePct / 100, 1)
          : formatNumber(candidate.votes)}
      </span>
    </li>
  )
}
