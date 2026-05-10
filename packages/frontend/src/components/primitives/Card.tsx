import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  raised?: boolean;
  flush?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Card({ children, raised, flush, className = '', style }: Props) {
  const variantClass = raised ? 'card--raised' : flush ? 'card--flush' : '';
  return <div className={`card ${variantClass} ${className}`} style={style}>{children}</div>;
}
