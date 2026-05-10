interface Props {
  value: number | string;
  label?: string;
  unit?: string;
}

export function MetricDisplay({ value, label, unit }: Props) {
  return (
    <div className="flex flex-col gap-1" style={{ gap: 'var(--spacing-1)' }}>
      {label && <span className="text-metadata">{label}</span>}
      <div className="flex items-baseline gap-2" style={{ gap: 'var(--spacing-2)', alignItems: 'baseline' }}>
        <span className="metric-number">{value}</span>
        {unit && <span className="text-metadata">{unit}</span>}
      </div>
    </div>
  );
}
