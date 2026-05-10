import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'active' | 'danger';
  children: ReactNode;
}

export function PillButton({ variant = 'default', className = '', children, ...rest }: Props) {
  const variantClass =
    variant === 'active' ? 'pill-btn--active' : variant === 'danger' ? 'pill-btn--danger' : '';
  return (
    <button className={`pill-btn ${variantClass} ${className}`} {...rest}>
      {children}
    </button>
  );
}
