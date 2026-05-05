import { candidateAliases, constituencyNames } from "@/lib/data/loaders"
import type { Constituency } from "@/lib/data/constituencies"

export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN")
}

export function formatPercent(p: number, digits = 1): string {
  return `${(p * 100).toFixed(digits)}%`
}

export function displayConstituencyName(c: Constituency | number): string {
  const num = typeof c === "number" ? c : c.constituencyNumber
  const entry = constituencyNames[String(num)]
  if (entry?.primary) return entry.primary
  if (typeof c !== "number") return c.constituencyName
  return ""
}

export function normalizeCandidateName(raw: string): string {
  if (!raw) return raw
  const aliased = candidateAliases[raw] ?? raw
  return aliased
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((token) => {
      const stripped = token.replace(/,/g, "")
      if (stripped.length === 0) return ""
      if (stripped.length === 1) return stripped.toUpperCase() + "."
      return stripped.charAt(0).toUpperCase() + stripped.slice(1).toLowerCase()
    })
    .filter(Boolean)
    .join(" ")
}
