import React from "react";

/** Minimal geometric mark — monochrome, no decorative gradient motion. */
export function LogoMark({ size = 18, className = "" }) {
  const stroke = "currentColor";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color: "var(--go-accent)" }}
      aria-hidden
    >
      <circle cx="10" cy="10" r="8.5" stroke={stroke} strokeWidth="1.5" fill="none" />
      <circle cx="10" cy="10" r="1.5" fill={stroke} />
      <line x1="10" y1="1.5" x2="10" y2="4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18.5" y1="10" x2="16" y2="10" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="18.5" x2="10" y2="16" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function GrayOceanWordmark({ size = "sm", className = "" }) {
  const textClass =
    size === "lg" ? "text-[16px] tracking-[0.22em]" : "text-[11px] tracking-[0.16em]";

  return (
    <span className={`inline-flex items-center select-none ${className}`}>
      <span className={`go-wordmark uppercase ${textClass}`}>GRAYOCEAN</span>
    </span>
  );
}
