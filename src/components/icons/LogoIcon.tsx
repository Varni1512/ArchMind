import React from "react";

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className={className}>
      <rect x="1" y="10" width="9" height="9" rx="2.5" stroke="#354259" strokeWidth="2" />
      <rect x="16" y="1" width="9" height="9" rx="2.5" fill="#C2DED1" stroke="#354259" strokeWidth="2" />
      <rect x="16" y="16" width="9" height="9" rx="2.5" stroke="#354259" strokeWidth="2" />
      <path d="M10 14.5H16M20.5 10V16" stroke="#354259" strokeWidth="1.6" />
    </svg>
  );
}
