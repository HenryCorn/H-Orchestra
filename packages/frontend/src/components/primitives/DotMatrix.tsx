import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function DotMatrix({ children, className = '' }: Props) {
  return <div className={`dot-matrix ${className}`}>{children}</div>;
}
