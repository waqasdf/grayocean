import React from 'react';

const variants = {
  info: 'border-[color:var(--go-accent-border)] bg-[var(--go-accent-soft)] text-[color:var(--go-accent-text)]',
  success: 'border-[color:var(--go-success-border)] bg-[var(--go-success-fill)] text-[color:var(--go-success)]',
  warning: 'border-[color:var(--go-warning-border)] bg-[var(--go-warning-fill)] text-[color:var(--go-warning)]',
  neutral: 'border-[color:var(--go-border)] bg-[var(--go-bg-panel)] text-[color:var(--go-text-muted)]',
  purple: 'border-[color:var(--go-accent-border)] bg-[var(--go-accent-soft)] text-[color:var(--go-accent-text)]',
  cyan: 'border-[color:var(--go-accent-border)] bg-[var(--go-accent-soft)] text-[color:var(--go-accent-text)]',
  gray: 'border-[color:var(--go-border)] bg-[var(--go-bg-panel)] text-[color:var(--go-text-muted)]',
};

const sizes = {
  xs: 'px-1.5 py-0.5 text-[9px]',
  sm: 'px-2 py-1 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export function MinimalBadge({ 
  children, 
  variant = 'neutral', 
  size = 'sm',
  className = '' 
}) {
  return (
    <span 
      className={`
        inline-flex items-center
        border rounded-md
        font-medium uppercase tracking-wider
        transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}