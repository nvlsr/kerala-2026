type Props = {
  label: string
  value: string
}

export function Stat({ label, value }: Props) {
  return (
    <div>
      <div className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="text-base font-medium tabular-nums">{value}</div>
    </div>
  )
}
