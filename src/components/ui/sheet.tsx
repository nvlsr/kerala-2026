/**
 * Sheet — a side-panel modal. Wraps `@base-ui/react/dialog` with
 * positioning + transitions for a slide-in panel from the right (or
 * other sides). API mirrors shadcn/ui's Sheet.
 *
 * Usage:
 *
 *   <Sheet>
 *     <SheetTrigger asChild><Button>Open</Button></SheetTrigger>
 *     <SheetContent side="right">
 *       <SheetHeader>
 *         <SheetTitle>...</SheetTitle>
 *         <SheetDescription>...</SheetDescription>
 *       </SheetHeader>
 *       ...
 *     </SheetContent>
 *   </Sheet>
 */
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

function Sheet({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetBackdrop({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="sheet-backdrop"
      className={cn(
        "fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]",
        "transition-opacity duration-200",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

type Side = "right" | "left" | "top" | "bottom"

const sideClasses: Record<Side, string> = {
  right:
    "inset-y-0 right-0 h-full border-l data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full",
  left: "inset-y-0 left-0 h-full border-r data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full",
  top: "inset-x-0 top-0 w-full border-b data-[ending-style]:-translate-y-full data-[starting-style]:-translate-y-full",
  bottom:
    "inset-x-0 bottom-0 w-full border-t data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full",
}

function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Popup> & {
  side?: Side
}) {
  return (
    <SheetPortal>
      <SheetBackdrop />
      <DialogPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-background shadow-lg",
          "transition-transform duration-300 ease-out",
          sideClasses[side],
          side === "right" || side === "left"
            ? "w-full sm:max-w-xl"
            : "h-full sm:max-h-[85vh]",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1 border-b px-6 py-4", className)}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn("flex-1 overflow-y-auto px-6 py-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function SheetTriggerButton({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Trigger> & { children: ReactNode }) {
  return (
    <DialogPrimitive.Trigger
      data-slot="sheet-trigger-button"
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border border-border bg-background px-2.5 py-1 text-[12px] font-medium text-foreground transition-colors hover:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Trigger>
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetTriggerButton,
  SheetClose,
  SheetPortal,
  SheetBackdrop,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetDescription,
}
