"use client";
import React from "react";
import { ProductColors } from "./ProductCanvas";

const clamp = (v: number) => Math.min(255, Math.max(0, v));
export function lighten(hex: string, a: number) {
  if (!hex || hex.length < 7) return hex;
  return `rgb(${clamp(parseInt(hex.slice(1,3),16)+a)},${clamp(parseInt(hex.slice(3,5),16)+a)},${clamp(parseInt(hex.slice(5,7),16)+a)})`;
}
export const darken = (h: string, a: number) => lighten(h, -a);

export function makePatternDefs(u: string, colors: ProductColors, pattern: string): React.ReactNode {
  if (pattern === "gradient") return (
    <linearGradient key={`${u}pat`} id={`${u}pat`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={colors.main}/>
      <stop offset="100%" stopColor={colors.accent}/>
    </linearGradient>
  );
  if (pattern === "bandhani") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="28" height="26" patternUnits="userSpaceOnUse">
      <circle cx="14" cy="13" r="8" stroke={colors.accent} strokeWidth="1.4" fill="none" opacity="0.45"/>
      <circle cx="14" cy="13" r="3" fill={colors.accent} opacity="0.45"/>
    </pattern>
  );
  if (pattern === "ikat") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="32" height="28" patternUnits="userSpaceOnUse">
      <polygon points="16,2 30,14 16,26 2,14" stroke={colors.accent} strokeWidth="1.2" fill={colors.accent} fillOpacity="0.15" strokeOpacity="0.45"/>
    </pattern>
  );
  if (pattern === "ajrakh") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="28" height="28" patternUnits="userSpaceOnUse">
      <rect x="4" y="4" width="20" height="20" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.35"/>
      <rect x="10" y="10" width="8" height="8" fill={colors.accent} opacity="0.35"/>
      <line x1="0" y1="14" x2="28" y2="14" stroke={colors.accent} strokeWidth="0.5" opacity="0.2"/>
      <line x1="14" y1="0" x2="14" y2="28" stroke={colors.accent} strokeWidth="0.5" opacity="0.2"/>
    </pattern>
  );
  if (pattern === "phulkari") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="30" height="28" patternUnits="userSpaceOnUse">
      <line x1="15" y1="3" x2="15" y2="25" stroke={colors.accent} strokeWidth="1.8" opacity="0.42"/>
      <line x1="3" y1="14" x2="27" y2="14" stroke={colors.accent} strokeWidth="1.8" opacity="0.42"/>
      <line x1="6" y1="6" x2="24" y2="22" stroke={colors.accent} strokeWidth="1" opacity="0.3"/>
      <line x1="24" y1="6" x2="6" y2="22" stroke={colors.accent} strokeWidth="1" opacity="0.3"/>
      <circle cx="15" cy="14" r="2.5" fill={colors.accent} opacity="0.5"/>
    </pattern>
  );
  if (pattern === "kalamkari") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="34" height="30" patternUnits="userSpaceOnUse">
      <path d="M 4,15 Q 10,5 17,15 Q 24,25 30,15" stroke={colors.accent} strokeWidth="1.3" fill="none" opacity="0.38"/>
      <circle cx="4" cy="15" r="2.5" fill={colors.accent} opacity="0.32"/>
      <circle cx="17" cy="15" r="2.5" fill={colors.accent} opacity="0.32"/>
      <circle cx="30" cy="15" r="2.5" fill={colors.accent} opacity="0.32"/>
    </pattern>
  );
  if (pattern === "madhubani") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="12" stroke={colors.accent} strokeWidth="1.1" fill="none" opacity="0.3"/>
      <circle cx="18" cy="18" r="7" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.25"/>
      <circle cx="18" cy="18" r="2.5" fill={colors.accent} opacity="0.38"/>
      <line x1="18" y1="6" x2="18" y2="0" stroke={colors.accent} strokeWidth="0.8" opacity="0.25"/>
      <line x1="18" y1="30" x2="18" y2="36" stroke={colors.accent} strokeWidth="0.8" opacity="0.25"/>
      <line x1="6" y1="18" x2="0" y2="18" stroke={colors.accent} strokeWidth="0.8" opacity="0.25"/>
      <line x1="30" y1="18" x2="36" y2="18" stroke={colors.accent} strokeWidth="0.8" opacity="0.25"/>
    </pattern>
  );
  if (pattern === "warli") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="34" height="32" patternUnits="userSpaceOnUse">
      <polygon points="17,4 28,24 6,24" stroke={colors.accent} strokeWidth="1.3" fill="none" opacity="0.42"/>
      <polygon points="17,28 24,18 10,18" fill={colors.accent} opacity="0.28"/>
      <circle cx="17" cy="8" r="2" fill={colors.accent} opacity="0.32"/>
    </pattern>
  );
  if (pattern === "leheriya") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
      <line x1="0" y1="0" x2="0" y2="22" stroke={colors.accent} strokeWidth="3.5" opacity="0.36"/>
      <line x1="11" y1="0" x2="11" y2="22" stroke={lighten(colors.accent, 40)} strokeWidth="2" opacity="0.26"/>
    </pattern>
  );
  if (pattern === "geometric") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="28" height="28" patternUnits="userSpaceOnUse">
      <polygon points="14,2 26,14 14,26 2,14" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.35"/>
      <polygon points="14,8 20,14 14,20 8,14" fill={colors.accent} opacity="0.2"/>
    </pattern>
  );
  if (pattern === "camo") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="70" height="70" patternUnits="userSpaceOnUse">
      <rect width="70" height="70" fill={colors.main}/>
      <ellipse cx="18" cy="18" rx="20" ry="13" fill={darken(colors.main,22)} opacity="0.5"/>
      <ellipse cx="50" cy="32" rx="16" ry="11" fill={lighten(colors.main,18)} opacity="0.4"/>
      <ellipse cx="30" cy="56" rx="18" ry="12" fill={darken(colors.main,15)} opacity="0.45"/>
      <ellipse cx="62" cy="58" rx="14" ry="9" fill={colors.accent} opacity="0.22"/>
    </pattern>
  );
  return null;
}

export function PatternOverlay({ u, path, colors, pattern, clipId }: {
  u: string; path: string; colors: ProductColors; pattern: string; clipId: string;
}) {
  if (pattern === "solid") return null;
  if (pattern === "gradient") return <path d={path} fill={`url(#${u}pat)`} clipPath={`url(#${clipId})`}/>;
  return <path d={path} fill={`url(#${u}pat)`} clipPath={`url(#${clipId})`}/>;
}
