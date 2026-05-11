/**
 * Shared viewport state for Kerala AC maps — viewBox, zoom, drag-to-pan.
 *
 * Used by both `KeralaACMapBase` (simple categorical/gradient via
 * render-prop) and `ReligionGradientMap` (more complex map with
 * district-level hover and outlined-seat overlay that keeps its own
 * SVG render). The hook is the single source of truth for zoom math
 * + pointer event handling.
 */
import { useRef, useState } from "react"

import { acPaths as paths } from "@/lib/data/maps"

export type ViewBox = { x: number; y: number; w: number; h: number }
export const FULL_VIEW: ViewBox = { x: 0, y: 0, w: paths.width, h: paths.height }
export const ZOOM_FACTOR = 1.5
export const MIN_W = paths.width / 8 // max zoom = 8×

export type ACMapViewport = {
  viewBox: ViewBox
  viewBoxAttr: string
  isZoomed: boolean
  isDragging: boolean
  cursorClass: string
  /** Forward to the SVG element. */
  onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void
  onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void
  onPointerUp: (e: React.PointerEvent<SVGSVGElement>) => void
  /** Bind to zoom button onClick. */
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
  /** Disabled-state flags for zoom buttons. */
  zoomInDisabled: boolean
  zoomOutDisabled: boolean
  resetDisabled: boolean
}

/** Returns viewport state + handlers. `enabled` toggles drag-to-pan. */
export function useACMapViewport(enabled: boolean): ACMapViewport {
  const [viewBox, setViewBox] = useState<ViewBox>(FULL_VIEW)
  const isZoomed = viewBox.w < paths.width
  const dragRef = useRef<{
    startClientX: number
    startClientY: number
    startVbX: number
    startVbY: number
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const cursorClass =
    enabled && isZoomed ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""

  const zoomBy = (factor: number) =>
    setViewBox((v) => {
      const newW = clamp(v.w * factor, MIN_W, paths.width)
      const newH = (newW / paths.width) * paths.height
      const cx = v.x + v.w / 2
      const cy = v.y + v.h / 2
      let nx = cx - newW / 2
      let ny = cy - newH / 2
      nx = clamp(nx, 0, paths.width - newW)
      ny = clamp(ny, 0, paths.height - newH)
      return { x: nx, y: ny, w: newW, h: newH }
    })

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!enabled || !isZoomed) return
    if ((e.target as Element).tagName === "BUTTON") return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startVbX: viewBox.x,
      startVbY: viewBox.y,
    }
    setIsDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const dx =
      ((e.clientX - dragRef.current.startClientX) / rect.width) * viewBox.w
    const dy =
      ((e.clientY - dragRef.current.startClientY) / rect.height) * viewBox.h
    setViewBox((v) => ({
      ...v,
      x: clamp(dragRef.current!.startVbX - dx, 0, paths.width - v.w),
      y: clamp(dragRef.current!.startVbY - dy, 0, paths.height - v.h),
    }))
  }
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    dragRef.current = null
    setIsDragging(false)
  }

  return {
    viewBox,
    viewBoxAttr: `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`,
    isZoomed,
    isDragging,
    cursorClass,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    zoomIn: () => zoomBy(1 / ZOOM_FACTOR),
    zoomOut: () => zoomBy(ZOOM_FACTOR),
    reset: () => setViewBox(FULL_VIEW),
    zoomInDisabled: viewBox.w <= MIN_W,
    zoomOutDisabled: !isZoomed,
    resetDisabled: !isZoomed,
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
