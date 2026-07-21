import React from 'react';

const variants = {
  info: 'border-blue-400/30 bg-blue-500/5 text-blue-400',
  success: 'border-green-400/30 bg-green-500/5 text-green-400',
  warning: 'border-amber-400/30 bg-amber-500/5 text-amber-400',
  neutral: 'border-white/10 bg-white/3 text-gray-400',
  purple: 'border-purple-400/30 bg-purple-500/5 text-purple-400',
  cyan: 'border-cyan-400/30 bg-cyan-500/5 text-cyan-400',
  gray: 'border-gray-400/30 bg-gray-500/5 text-gray-400',
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