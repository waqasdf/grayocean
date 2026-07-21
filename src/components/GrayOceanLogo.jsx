import React from "react";

/**
 * GrayOcean Logo mark — a minimal geometric mark:
 * Two arcs forming a stylized eye / data lens shape,
 * with a precise horizontal bisector. Clean, architectural, fintech-grade.
 */
export function LogoMark({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`mark-grad-${size}`} x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>
      {/* Outer ring — full circle, institutional weight */}
      <circle cx="10" cy="10" r="8.5" stroke={`url(#mark-grad-${size})`} strokeWidth="1.25" fill="none" />
      {/* Inner geometric cross-hair dots — data node aesthetic */}
      <circle cx="10" cy="10" r="1.5" fill={`url(#mark-grad-${size})`} />
      {/* Three precise tick marks at cardinal points — compass/data grid feel */}
      <line x1="10" y1="1.5" x2="10" y2="4" stroke={`url(#mark-grad-${size})`} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="18.5" y1="10" x2="16" y2="10" stroke={`url(#mark-grad-${size})`} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="10" y1="18.5" x2="10" y2="16" stroke={`url(#mark-grad-${size})`} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Full wordmark: GRAYOCEAN text only
 */
export function GrayOceanWordmark({ size = "sm", className = "" }) {
  const textClass = size === "lg"
    ? "text-[20px] tracking-[0.35em]"
    : "text-[11px] tracking-[0.22em]";

  return (
    <span className={`inline-flex items-center select-none ${className}`}>
      <span className={`font-light uppercase logo-shimmer ${textClass}`}>
        GRAYOCEAN
      </span>
    </span>
  );
}