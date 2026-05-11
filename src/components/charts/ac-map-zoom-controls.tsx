/**
 * Zoom +/- and reset button group for Kerala AC maps. Pairs with
 * `useACMapViewport` — pass the matching disabled flags + callbacks.
 */
import { IconPlus, IconMinus, IconRefresh } from "@tabler/icons-react"
import type { ReactNode } from "react"

import type { ACMapViewport } from "@/components/charts/use-ac-map-viewport"

export function ACMapZoomControls({
  zoomIn,
  zoomOut,
  reset,
  zoomInDisabled,
  zoomOutDisabled,
  resetDisabled,
}: Pick<
  ACMapViewport,
  | "zoomIn"
  | "zoomOut"
  | "reset"
  | "zoomInDisabled"
  | "zoomOutDisabled"
  | "resetDisabled"
>) {
  return (
    <div className="absolute top-2 right-2 flex flex-col gap-1 rounded-md border bg-background/85 p-0.5 shadow-sm supports-backdrop-filter:backdrop-blur">
      <Btn onClick={zoomIn} disabled={zoomInDisabled} label="Zoom in">
        <IconPlus className="h-3.5 w-3.5" aria-hidden />
      </Btn>
      <Btn onClick={zoomOut} disabled={zoomOutDisabled} label="Zoom out">
        <IconMinus className="h-3.5 w-3.5" aria-hidden />
      </Btn>
      <Btn onClick={reset} disabled={resetDisabled} label="Reset zoom">
        <IconRefresh className="h-3.5 w-3.5" aria-hidden />
      </Btn>
    </div>
  )
}

function Btn({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled: boolean
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}
