interface Props {
  value: number;
  max: number;
  segments?: number;
  showLabel?: boolean;
  critical?: boolean;
}

export function SegmentedProgress({ value, max, segments = 20, showLabel = false, critical = false }: Props) {
  const filled = max === 0 ? 0 : Math.round((value / max) * segments);

  return (
    <div className="flex flex-col gap-1">
      <div className="progress-bar">
        {Array.from({ length: segments }, (_, i) => {
          const isFilled = i < filled;
          const cls = critical && isFilled
            ? 'progress-bar__segment--critical'
            : isFilled
              ? 'progress-bar__segment--filled-active'
              : 'progress-bar__segment';
          return <div key={i} className={`progress-bar__segment ${cls}`} />;
        })}
      </div>
      {showLabel && (
        <span className="text-metadata">
          {value} / {max}
        </span>
      )}
    </div>
  );
}
