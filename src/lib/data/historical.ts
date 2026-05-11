import { constituencyNames } from "@/lib/data/loaders"

import type { AllianceCode } from "@/lib/data/alliances"

export type HistoricalCandidate = {
  name: string
  party: string
  alliance: AllianceCode
  votes: number
  votePct: number
}

export type HistoricalElection = {
  year: number
  type: "general" | "by-election"
  reason: string | null
  candidates: HistoricalCandidate[]
  margin: number | null
  marginPct: number | null
  turnout: number | null
  turnoutPct: number | null
  result: string | null
}

export type HistoricalConstituency = {
  constituencyNumber: number
  constituencyName: string
  wikipediaName: string
  wikipediaUrl: string
  elections: HistoricalElection[]
}

type RawHistoricalConstituency = {
  constituencyNumber: number
  elections: HistoricalElection[]
}

const historicalModules = import.meta.glob<{
  default: RawHistoricalConstituency
}>("../../../data/historical/S11-*.json", { eager: true })

const historicalByNumber = new Map<number, HistoricalConstituency>()
for (const path in historicalModules) {
  const mod = historicalModules[path] as
    | { default: RawHistoricalConstituency }
    | RawHistoricalConstituency
  const data = "default" in mod ? mod.default : mod
  const entry = constituencyNames[String(data.constituencyNumber)]
  historicalByNumber.set(data.constituencyNumber, {
    constituencyNumber: data.constituencyNumber,
    constituencyName: entry?.eci ?? "",
    wikipediaName: entry?.wikipedia ?? "",
    wikipediaUrl: entry?.wikipediaUrl ?? "",
    elections: data.elections,
  })
}

export function getHistoricalFor(
  constituencyNumber: number
): HistoricalConstituency | null {
  return historicalByNumber.get(constituencyNumber) ?? null
}
