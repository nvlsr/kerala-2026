import { useMemo } from "react"

import { getStateLevelFlow } from "@/lib/data/flows"
import { getAlliance, type AllianceCode } from "@/lib/data"

/**
 * State-level Sankey: 2021 seat winners → 2026 seat winners. Three nodes
 * left, three right, ribbons proportional to seat counts. Custom SVG —
 * 6 nodes and ≤9 ribbons make this small enough to lay out by hand.
 */
const ORDER: AllianceCode[] = ["UDF", "LDF", "NDA"]

const VIEW_W = 720
const VIEW_H = 320
const PAD_X = 64 // room for labels outside the nodes
const PAD_Y = 16
const NODE_W = 14
const NODE_GAP = 12 // vertical gap between nodes within a column

export function StateFlowSankey() {
  const flow = useMemo(() => getStateLevelFlow(), [])

  const total = flow.fromTotals.UDF + flow.fromTotals.LDF + flow.fromTotals.NDA

  const layout = useMemo(() => {
    if (total === 0) return null
    const innerH = VIEW_H - 2 * PAD_Y
    const totalNodeH = innerH - (ORDER.length - 1) * NODE_GAP
    const yScale = totalNodeH / total

    type NodeRect = { x: number; y: number; w: number; h: number }
    const fromNodes: Record<AllianceCode, NodeRect> = {
      UDF: { x: 0, y: 0, w: 0, h: 0 },
      LDF: { x: 0, y: 0, w: 0, h: 0 },
      NDA: { x: 0, y: 0, w: 0, h: 0 },
      OTHER: { x: 0, y: 0, w: 0, h: 0 },
      NOTA: { x: 0, y: 0, w: 0, h: 0 },
    }
    const toNodes: Record<AllianceCode, NodeRect> = {
      ...fromNodes,
    }

    const fromX = PAD_X
    const toX = VIEW_W - PAD_X - NODE_W

    let yL = PAD_Y
    for (const a of ORDER) {
      const h = flow.fromTotals[a] * yScale
      fromNodes[a] = { x: fromX, y: yL, w: NODE_W, h }
      yL += h + NODE_GAP
    }

    let yR = PAD_Y
    for (const a of ORDER) {
      const h = flow.toTotals[a] * yScale
      toNodes[a] = { x: toX, y: yR, w: NODE_W, h }
      yR += h + NODE_GAP
    }

    // Ribbon attachment offsets — track how much of each node's height has
    // been consumed by previously laid ribbons so the next ribbon attaches
    // immediately below.
    const fromOffsets: Record<AllianceCode, number> = {
      UDF: 0,
      LDF: 0,
      NDA: 0,
      OTHER: 0,
      NOTA: 0,
    }
    const toOffsets: Record<AllianceCode, number> = { ...fromOffsets }

    type Ribbon = {
      from: AllianceCode
      to: AllianceCode
      count: number
      d: string
    }
    const ribbons: Ribbon[] = []

    // Iterate in display order so ribbons stack predictably
    for (const from of ORDER) {
      for (const to of ORDER) {
        const pair = flow.byPair.find((p) => p.from === from && p.to === to)
        if (!pair || pair.count === 0) continue
        const h = pair.count * yScale
        const fromTop = fromNodes[from].y + fromOffsets[from]
        const toTop = toNodes[to].y + toOffsets[to]
        const x1 = fromNodes[from].x + fromNodes[from].w
        const x2 = toNodes[to].x

        // Bezier curve: control points at the midpoint x of the gap
        const midX = (x1 + x2) / 2
        const topPath = `M ${x1} ${fromTop} C ${midX} ${fromTop}, ${midX} ${toTop}, ${x2} ${toTop}`
        const bottomPath = `L ${x2} ${toTop + h} C ${midX} ${toTop + h}, ${midX} ${fromTop + h}, ${x1} ${fromTop + h} Z`

        ribbons.push({
          from,
          to,
          count: pair.count,
          d: `${topPath} ${bottomPath}`,
        })
        fromOffsets[from] += h
        toOffsets[to] += h
      }
    }

    return { fromNodes, toNodes, ribbons, yScale }
  }, [flow, total])

  if (!layout) return null

  return (
    <figure className="rounded-lg border bg-card/50 p-6">
      <figcaption className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
          Where each 2021 seat ended up in 2026
        </h3>
        <span className="text-xs text-muted-foreground">
          {flow.totalSeats - flow.missingFromCount} of {flow.totalSeats} seats
        </span>
      </figcaption>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            role="img"
            aria-label="Seat-winner flow from 2021 to 2026"
            className="h-auto w-full"
          >
            <text
              x={PAD_X + NODE_W / 2}
              y={PAD_Y - 4}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-medium tracking-wide uppercase"
            >
              2021
            </text>
            <text
              x={VIEW_W - PAD_X - NODE_W / 2}
              y={PAD_Y - 4}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-medium tracking-wide uppercase"
            >
              2026
            </text>

            {/* Ribbons first so nodes draw on top */}
            {layout.ribbons.map((r, i) => {
              const fromColor = getAlliance(r.from).color
              return (
                <path
                  key={i}
                  d={r.d}
                  fill={fromColor}
                  fillOpacity={0.35}
                  stroke="none"
                >
                  <title>
                    {r.from} → {r.to}: {r.count} seat{r.count === 1 ? "" : "s"}
                  </title>
                </path>
              )
            })}

            {/* Left nodes + labels */}
            {ORDER.map((a) => {
              const n = layout.fromNodes[a]
              const count = flow.fromTotals[a]
              if (count === 0) return null
              return (
                <g key={`from-${a}`}>
                  <rect
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                    fill={getAlliance(a).color}
                  />
                  <text
                    x={n.x - 6}
                    y={n.y + n.h / 2}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="fill-foreground text-xs font-medium"
                  >
                    {a}
                  </text>
                  <text
                    x={n.x - 6}
                    y={n.y + n.h / 2 + 14}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-[11px] tabular-nums"
                  >
                    {count}
                  </text>
                </g>
              )
            })}

            {/* Right nodes + labels */}
            {ORDER.map((a) => {
              const n = layout.toNodes[a]
              const count = flow.toTotals[a]
              if (count === 0) return null
              return (
                <g key={`to-${a}`}>
                  <rect
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                    fill={getAlliance(a).color}
                  />
                  <text
                    x={n.x + n.w + 6}
                    y={n.y + n.h / 2}
                    textAnchor="start"
                    dominantBaseline="middle"
                    className="fill-foreground text-xs font-medium"
                  >
                    {a}
                  </text>
                  <text
                    x={n.x + n.w + 6}
                    y={n.y + n.h / 2 + 14}
                    textAnchor="start"
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-[11px] tabular-nums"
                  >
                    {count}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        <div className="lg:col-span-2">
          <FlowBreakdown flow={flow} />
        </div>
      </div>
    </figure>
  )
}

function FlowBreakdown({
  flow,
}: {
  flow: ReturnType<typeof getStateLevelFlow>
}) {
  // Group ribbons by source for a readable breakdown
  const bySource: Record<AllianceCode, typeof flow.byPair> = {
    UDF: [],
    LDF: [],
    NDA: [],
    OTHER: [],
    NOTA: [],
  }
  for (const p of flow.byPair) bySource[p.from].push(p)

  return (
    <div className="space-y-4 text-sm">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Tracking seat winners between cycles. Ribbon width is the number of
        seats; colour is the 2021 alliance.
      </p>
      {ORDER.filter((a) => flow.fromTotals[a] > 0).map((from) => {
        const pairs = bySource[from].slice().sort((a, b) => b.count - a.count)
        const fromTotal = flow.fromTotals[from]
        const fromColor = getAlliance(from).color
        return (
          <div key={from}>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <span
                className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                style={{ backgroundColor: fromColor }}
                aria-hidden
              />
              {from} won {fromTotal} in 2021
            </p>
            <ul className="mt-1 space-y-0.5 text-xs">
              {pairs.map((p) => (
                <li
                  key={`${p.from}-${p.to}`}
                  className="flex items-center justify-between"
                >
                  <span>
                    {p.to === from ? (
                      <span className="text-foreground">stayed {p.to}</span>
                    ) : (
                      <span>
                        flipped to{" "}
                        <span
                          className="font-medium"
                          style={{ color: getAlliance(p.to).color }}
                        >
                          {p.to}
                        </span>
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {p.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
