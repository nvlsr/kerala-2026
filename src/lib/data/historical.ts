import acHistoryJson from "@data/ac-history.json"

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

type RawAcHistory = Record<string, { elections: HistoricalElection[] }>

const rawHistory = acHistoryJson as RawAcHistory

const historicalByNumber = new Map<number, HistoricalConstituency>()
for (const [k, v] of Object.entries(rawHistory)) {
  const acNum = Number(k)
  const entry = constituencyNames[k]
  historicalByNumber.set(acNum, {
    constituencyNumber: acNum,
    constituencyName: entry?.eci ?? "",
    wikipediaName: entry?.wikipedia ?? "",
    wikipediaUrl: entry?.wikipediaUrl ?? "",
    elections: v.elections,
  })
}

export function getHistoricalFor(
  constituencyNumber: number
): HistoricalConstituency | null {
  return historicalByNumber.get(constituencyNumber) ?? null
}
