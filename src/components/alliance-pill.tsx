import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getAlliance, isMainFront, type AllianceCode } from "@/lib/data"

type Props = {
  code: AllianceCode
  className?: string
}

export function AlliancePill({ code, className }: Props) {
  const alliance = getAlliance(code)
  const baseClass = "px-1.5 text-[10px] uppercase tracking-wider font-semibold"

  if (!isMainFront(code)) {
    return (
      <Badge
        variant="outline"
        className={cn(baseClass, "text-muted-foreground/80", className)}
      >
        {alliance.code}
      </Badge>
    )
  }

  return (
    <Badge
      className={cn(baseClass, className)}
      style={{
        color: alliance.color,
        backgroundColor: alliance.color + "1A",
      }}
    >
      {alliance.code}
    </Badge>
  )
}
