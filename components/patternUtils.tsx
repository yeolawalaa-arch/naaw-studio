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
  // ── Indian Heritage ──
  if (pattern === "gradient") return (
    <linearGradient key={`${u}pat`} id={`${u}pat`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={colors.main}/><stop offset="100%" stopColor={colors.accent}/>
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
  if (pattern === "paisley") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M18,4 C26,4 32,10 32,18 C32,26 26,32 18,32 C10,32 4,26 4,18 C4,10 10,4 18,4 Z" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.3"/>
      <path d="M18,8 C14,8 10,12 10,18 C10,22 12,28 18,28" stroke={colors.accent} strokeWidth="1.5" fill="none" opacity="0.35"/>
      <circle cx="18" cy="10" r="2" fill={colors.accent} opacity="0.4"/>
    </pattern>
  );

  // ── Japanese ──
  if (pattern === "sashiko") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="30" height="30" patternUnits="userSpaceOnUse">
      <line x1="0" y1="15" x2="30" y2="15" stroke={colors.accent} strokeWidth="1" opacity="0.4"/>
      <line x1="15" y1="0" x2="15" y2="30" stroke={colors.accent} strokeWidth="1" opacity="0.4"/>
      <circle cx="15" cy="15" r="5" stroke={colors.accent} strokeWidth="0.8" fill="none" opacity="0.35"/>
      <circle cx="0" cy="0" r="5" stroke={colors.accent} strokeWidth="0.8" fill="none" opacity="0.25"/>
      <circle cx="30" cy="30" r="5" stroke={colors.accent} strokeWidth="0.8" fill="none" opacity="0.25"/>
      <circle cx="0" cy="30" r="5" stroke={colors.accent} strokeWidth="0.8" fill="none" opacity="0.25"/>
      <circle cx="30" cy="0" r="5" stroke={colors.accent} strokeWidth="0.8" fill="none" opacity="0.25"/>
    </pattern>
  );
  if (pattern === "asanoha") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="28" height="24" patternUnits="userSpaceOnUse">
      <line x1="14" y1="0" x2="14" y2="24" stroke={colors.accent} strokeWidth="0.8" opacity="0.38"/>
      <line x1="0" y1="12" x2="28" y2="12" stroke={colors.accent} strokeWidth="0.8" opacity="0.38"/>
      <line x1="0" y1="0" x2="28" y2="24" stroke={colors.accent} strokeWidth="0.8" opacity="0.28"/>
      <line x1="28" y1="0" x2="0" y2="24" stroke={colors.accent} strokeWidth="0.8" opacity="0.28"/>
      <polygon points="14,2 22,12 14,22 6,12" stroke={colors.accent} strokeWidth="0.6" fill="none" opacity="0.32"/>
    </pattern>
  );
  if (pattern === "seigaiha") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="32" height="28" patternUnits="userSpaceOnUse">
      <path d="M 0,14 A 16,14 0 0,1 32,14" stroke={colors.accent} strokeWidth="1.2" fill={colors.accent} fillOpacity="0.12" strokeOpacity="0.4"/>
      <path d="M -16,28 A 16,14 0 0,1 16,28" stroke={colors.accent} strokeWidth="1.2" fill={colors.accent} fillOpacity="0.12" strokeOpacity="0.4"/>
      <path d="M 16,28 A 16,14 0 0,1 48,28" stroke={colors.accent} strokeWidth="1.2" fill={colors.accent} fillOpacity="0.12" strokeOpacity="0.4"/>
    </pattern>
  );
  if (pattern === "wave") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="40" height="20" patternUnits="userSpaceOnUse">
      <path d="M 0,10 Q 10,0 20,10 Q 30,20 40,10" stroke={colors.accent} strokeWidth="1.5" fill="none" opacity="0.38"/>
      <path d="M 0,18 Q 10,8 20,18 Q 30,28 40,18" stroke={colors.accent} strokeWidth="0.8" fill="none" opacity="0.2"/>
    </pattern>
  );

  // ── African ──
  if (pattern === "kente") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="24" height="24" patternUnits="userSpaceOnUse">
      <rect width="24" height="24" fill="none"/>
      <rect x="0" y="0" width="12" height="8" fill={colors.accent} opacity="0.25"/>
      <rect x="12" y="8" width="12" height="8" fill={colors.accent} opacity="0.25"/>
      <rect x="0" y="16" width="12" height="8" fill={colors.accent} opacity="0.25"/>
      <line x1="0" y1="0" x2="24" y2="0" stroke={colors.detail} strokeWidth="1.5" opacity="0.4"/>
      <line x1="0" y1="8" x2="24" y2="8" stroke={colors.detail} strokeWidth="1.5" opacity="0.4"/>
      <line x1="0" y1="16" x2="24" y2="16" stroke={colors.detail} strokeWidth="1.5" opacity="0.4"/>
    </pattern>
  );
  if (pattern === "ankara") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="14" stroke={colors.accent} strokeWidth="2" fill={colors.accent} fillOpacity="0.1" strokeOpacity="0.3"/>
      <circle cx="18" cy="18" r="8" fill={colors.accent} opacity="0.2"/>
      <circle cx="18" cy="18" r="3" fill={colors.accent} opacity="0.5"/>
      <circle cx="0" cy="0" r="5" fill={colors.detail} opacity="0.2"/>
      <circle cx="36" cy="0" r="5" fill={colors.detail} opacity="0.2"/>
      <circle cx="0" cy="36" r="5" fill={colors.detail} opacity="0.2"/>
      <circle cx="36" cy="36" r="5" fill={colors.detail} opacity="0.2"/>
    </pattern>
  );
  if (pattern === "mudcloth") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="32" height="32" patternUnits="userSpaceOnUse">
      <rect x="2" y="2" width="12" height="12" fill={colors.accent} opacity="0.3"/>
      <rect x="18" y="18" width="12" height="12" fill={colors.accent} opacity="0.3"/>
      <rect x="10" y="10" width="12" height="12" stroke={colors.accent} strokeWidth="1.5" fill="none" opacity="0.3"/>
      <line x1="0" y1="16" x2="32" y2="16" stroke={colors.accent} strokeWidth="2" opacity="0.2"/>
      <line x1="16" y1="0" x2="16" y2="32" stroke={colors.accent} strokeWidth="2" opacity="0.2"/>
    </pattern>
  );

  // ── Middle Eastern ──
  if (pattern === "arabesque") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M16,2 L30,16 L16,30 L2,16 Z" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.35"/>
      <path d="M16,8 L24,16 L16,24 L8,16 Z" fill={colors.accent} opacity="0.15"/>
      <circle cx="16" cy="16" r="3" fill={colors.accent} opacity="0.4"/>
      <circle cx="2" cy="16" r="2" fill={colors.accent} opacity="0.25"/>
      <circle cx="30" cy="16" r="2" fill={colors.accent} opacity="0.25"/>
      <circle cx="16" cy="2" r="2" fill={colors.accent} opacity="0.25"/>
      <circle cx="16" cy="30" r="2" fill={colors.accent} opacity="0.25"/>
    </pattern>
  );
  if (pattern === "mosaic") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="24" height="24" patternUnits="userSpaceOnUse">
      <rect x="1" y="1" width="10" height="10" fill={colors.accent} opacity="0.2" rx="1"/>
      <rect x="13" y="1" width="10" height="10" fill={colors.detail} opacity="0.2" rx="1"/>
      <rect x="1" y="13" width="10" height="10" fill={colors.detail} opacity="0.2" rx="1"/>
      <rect x="13" y="13" width="10" height="10" fill={colors.accent} opacity="0.2" rx="1"/>
    </pattern>
  );

  // ── Western / Street ──
  if (pattern === "plaid") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="24" height="24" patternUnits="userSpaceOnUse">
      <rect width="24" height="24" fill="none"/>
      <line x1="0" y1="8" x2="24" y2="8" stroke={colors.accent} strokeWidth="3" opacity="0.3"/>
      <line x1="0" y1="16" x2="24" y2="16" stroke={colors.accent} strokeWidth="3" opacity="0.3"/>
      <line x1="8" y1="0" x2="8" y2="24" stroke={colors.accent} strokeWidth="3" opacity="0.3"/>
      <line x1="16" y1="0" x2="16" y2="24" stroke={colors.accent} strokeWidth="3" opacity="0.3"/>
      <line x1="0" y1="12" x2="24" y2="12" stroke={colors.detail} strokeWidth="1" opacity="0.2"/>
      <line x1="12" y1="0" x2="12" y2="24" stroke={colors.detail} strokeWidth="1" opacity="0.2"/>
    </pattern>
  );
  if (pattern === "pinstripe") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="10" height="10" patternUnits="userSpaceOnUse">
      <line x1="5" y1="0" x2="5" y2="10" stroke={colors.accent} strokeWidth="0.8" opacity="0.35"/>
    </pattern>
  );
  if (pattern === "denim") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke={colors.accent} strokeWidth="1.5" opacity="0.18"/>
      <line x1="4" y1="0" x2="4" y2="8" stroke={colors.accent} strokeWidth="0.8" opacity="0.12"/>
    </pattern>
  );
  if (pattern === "tiedye") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="30" cy="30" r="28" stroke={colors.accent} strokeWidth="3" fill="none" opacity="0.18"/>
      <circle cx="30" cy="30" r="22" stroke={darken(colors.accent,10)} strokeWidth="3" fill="none" opacity="0.18"/>
      <circle cx="30" cy="30" r="16" stroke={colors.accent} strokeWidth="3" fill="none" opacity="0.2"/>
      <circle cx="30" cy="30" r="10" stroke={darken(colors.accent,15)} strokeWidth="3" fill="none" opacity="0.22"/>
      <circle cx="30" cy="30" r="4" fill={colors.accent} opacity="0.3"/>
    </pattern>
  );

  // ── Minimal / Clean ──
  if (pattern === "dots") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1.5" fill={colors.accent} opacity="0.4"/>
    </pattern>
  );
  if (pattern === "grid") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="20" height="20" patternUnits="userSpaceOnUse">
      <line x1="0" y1="10" x2="20" y2="10" stroke={colors.accent} strokeWidth="0.5" opacity="0.25"/>
      <line x1="10" y1="0" x2="10" y2="20" stroke={colors.accent} strokeWidth="0.5" opacity="0.25"/>
    </pattern>
  );
  if (pattern === "diagonal") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="14" stroke={colors.accent} strokeWidth="1.5" opacity="0.3"/>
    </pattern>
  );

  return null;
}

export function PatternOverlay({
  u, path, colors, pattern, clipId, intensity = 100, zone, viewBox
}: {
  u: string;
  path: string;
  colors: ProductColors;
  pattern: string;
  clipId: string;
  intensity?: number;
  zone?: string;
  viewBox?: { x: number; y: number; w: number; h: number };
}) {
  if (pattern === "solid") return null;

  const opacity = intensity / 100;

  // Zone mask: clip pattern to a portion of the product
  const zoneClipId = zone && zone !== "full" ? `${clipId}_zone` : null;

  const zoneRect = (() => {
    if (!zone || zone === "full" || !viewBox) return null;
    const { x, y, w, h } = viewBox;
    if (zone === "upper") return { x, y, w, h: h * 0.45 };
    if (zone === "lower") return { x, y: y + h * 0.55, w, h: h * 0.45 };
    if (zone === "center") return { x, y: y + h * 0.25, w, h: h * 0.5 };
    if (zone === "left") return { x, y, w: w * 0.4, h };
    if (zone === "right") return { x: x + w * 0.6, y, w: w * 0.4, h };
    if (zone === "edges") return null; // handled separately
    return null;
  })();

  return (
    <>
      {zoneRect && zoneClipId && (
        <defs>
          <clipPath id={zoneClipId}>
            <rect x={zoneRect.x} y={zoneRect.y} width={zoneRect.w} height={zoneRect.h}/>
          </clipPath>
        </defs>
      )}
      <path
        d={path}
        fill={pattern === "gradient" ? `url(#${u}pat)` : `url(#${u}pat)`}
        clipPath={zoneClipId ? `url(#${zoneClipId})` : `url(#${clipId})`}
        opacity={opacity}
      />
      {/* For "edges" zone: render left + right strips */}
      {zone === "edges" && viewBox && (
        <>
          <path d={path} fill={`url(#${u}pat)`}
            clipPath={`url(#${clipId})`}
            opacity={opacity}
            style={{ clipPath: `polygon(0% 0%, 30% 0%, 30% 100%, 0% 100%)` }}/>
          <path d={path} fill={`url(#${u}pat)`}
            clipPath={`url(#${clipId})`}
            opacity={opacity}
            style={{ clipPath: `polygon(70% 0%, 100% 0%, 100% 100%, 70% 100%)` }}/>
        </>
      )}
    </>
  );
}
