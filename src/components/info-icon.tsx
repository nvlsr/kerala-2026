import { IconInfoCircle } from "@tabler/icons-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
  text: string
}

export function InfoIcon({ text }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className="inline-flex cursor-help items-center" />}
      >
        <IconInfoCircle
          className="h-3 w-3 text-muted-foreground/50 hover:text-muted-foreground"
          aria-hidden
        />
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}
