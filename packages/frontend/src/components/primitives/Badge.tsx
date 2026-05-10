type Variant = 'default' | 'active' | 'failed' | 'complete' | 'in-progress';

interface Props {
  children: string;
  variant?: Variant;
}

export function Badge({ children, variant = 'default' }: Props) {
  const cls =
    variant === 'active'
      ? 'badge--active'
      : variant === 'failed'
        ? 'badge--failed'
        : variant === 'complete'
          ? 'badge--complete'
          : variant === 'in-progress'
            ? 'badge--in-progress'
            : '';
  return <span className={`badge ${cls}`}>{children}</span>;
}
