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
  // ── Basic ──
  if (pattern === "gradient") return (
    <linearGradient key={`${u}pat`} id={`${u}pat`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={colors.main}/><stop offset="100%" stopColor={colors.accent}/>
    </linearGradient>
  );

  // ── Indian Heritage ──
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
  if (pattern === "paisley") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M18,8 C14,8 10,12 10,18 C10,22 12,28 18,28" stroke={colors.accent} strokeWidth="1.5" fill="none" opacity="0.35"/>
      <circle cx="18" cy="10" r="2" fill={colors.accent} opacity="0.4"/>
      <path d="M18,8 C22,8 26,12 26,18 C26,22 24,26 22,24" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.2"/>
    </pattern>
  );
  if (pattern === "geometric") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="28" height="28" patternUnits="userSpaceOnUse">
      <polygon points="14,2 26,14 14,26 2,14" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.35"/>
      <polygon points="14,8 20,14 14,20 8,14" fill={colors.accent} opacity="0.2"/>
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
  // NEW — Japanese kikko (tortoiseshell hexagons)
  if (pattern === "kikko") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="30" height="26" patternUnits="userSpaceOnUse">
      <polygon points="15,1 27,8 27,18 15,25 3,18 3,8" stroke={colors.accent} strokeWidth="1.2" fill="none" opacity="0.4"/>
      <polygon points="0,8 4,8 4,18 0,18" stroke={colors.accent} strokeWidth="0.5" fill="none" opacity="0.2"/>
      <polygon points="30,8 26,8 26,18 30,18" stroke={colors.accent} strokeWidth="0.5" fill="none" opacity="0.2"/>
    </pattern>
  );

  // ── African ──
  if (pattern === "kente") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="24" height="24" patternUnits="userSpaceOnUse">
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
  // NEW — Adinkra (West African)
  if (pattern === "adinkra") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="38" height="38" patternUnits="userSpaceOnUse">
      <circle cx="19" cy="19" r="13" stroke={colors.accent} strokeWidth="1.2" fill="none" opacity="0.38"/>
      <circle cx="19" cy="19" r="7" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.28"/>
      <line x1="19" y1="6" x2="19" y2="32" stroke={colors.accent} strokeWidth="0.8" opacity="0.25"/>
      <line x1="6" y1="19" x2="32" y2="19" stroke={colors.accent} strokeWidth="0.8" opacity="0.25"/>
      <circle cx="19" cy="19" r="2.5" fill={colors.accent} opacity="0.45"/>
    </pattern>
  );
  // NEW — Kanga (East African bold print)
  if (pattern === "kanga") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="none"/>
      <circle cx="20" cy="20" r="16" stroke={colors.accent} strokeWidth="3" fill="none" opacity="0.28"/>
      <circle cx="20" cy="20" r="9" fill={colors.accent} opacity="0.18"/>
      <rect x="0" y="0" width="40" height="4" fill={colors.accent} opacity="0.22"/>
      <rect x="0" y="36" width="40" height="4" fill={colors.accent} opacity="0.22"/>
      <rect x="0" y="0" width="4" height="40" fill={colors.accent} opacity="0.22"/>
      <rect x="36" y="0" width="4" height="40" fill={colors.accent} opacity="0.22"/>
    </pattern>
  );

  // ── Middle Eastern ──
  if (pattern === "arabesque") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M16,2 L30,16 L16,30 L2,16 Z" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.35"/>
      <path d="M16,8 L24,16 L16,24 L8,16 Z" fill={colors.accent} opacity="0.15"/>
      <circle cx="16" cy="16" r="3" fill={colors.accent} opacity="0.4"/>
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
  // NEW — Moroccan star tile
  if (pattern === "moroccan") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="40" height="40" patternUnits="userSpaceOnUse">
      <polygon points="20,2 23,14 35,14 26,22 29,34 20,27 11,34 14,22 5,14 17,14" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.4"/>
      <polygon points="20,7 22,14 28,14 23,18 25,25 20,21 15,25 17,18 12,14 18,14" fill={colors.accent} opacity="0.15"/>
    </pattern>
  );
  // NEW — Persian carpet medallion
  if (pattern === "persian") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="44" height="44" patternUnits="userSpaceOnUse">
      <ellipse cx="22" cy="22" rx="16" ry="18" stroke={colors.accent} strokeWidth="1.2" fill="none" opacity="0.32"/>
      <ellipse cx="22" cy="22" rx="8" ry="10" fill={colors.accent} opacity="0.18"/>
      <line x1="22" y1="4" x2="22" y2="40" stroke={colors.accent} strokeWidth="0.8" opacity="0.2" strokeDasharray="3,3"/>
      <line x1="4" y1="22" x2="40" y2="22" stroke={colors.accent} strokeWidth="0.8" opacity="0.2" strokeDasharray="3,3"/>
      <circle cx="22" cy="22" r="2.5" fill={colors.accent} opacity="0.5"/>
    </pattern>
  );
  // NEW — Kilim geometric rug triangles
  if (pattern === "kilim") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="24" height="16" patternUnits="userSpaceOnUse">
      <polygon points="12,1 22,15 2,15" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.4"/>
      <polygon points="12,4 19,14 5,14" fill={colors.accent} opacity="0.15"/>
      <line x1="0" y1="15" x2="24" y2="15" stroke={colors.accent} strokeWidth="1.5" opacity="0.3"/>
    </pattern>
  );
  // NEW — Suzani Central Asian floral
  if (pattern === "suzani") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="48" height="48" patternUnits="userSpaceOnUse">
      <circle cx="24" cy="24" r="16" stroke={colors.accent} strokeWidth="1.5" fill="none" opacity="0.28"/>
      <circle cx="24" cy="24" r="8" stroke={colors.accent} strokeWidth="1" fill={colors.accent} fillOpacity="0.12" strokeOpacity="0.35"/>
      {[0,45,90,135,180,225,270,315].map((a,i) => (
        <circle key={i}
          cx={24 + Math.cos(a*Math.PI/180)*16}
          cy={24 + Math.sin(a*Math.PI/180)*16}
          r="3" fill={colors.accent} opacity="0.3"/>
      ))}
    </pattern>
  );

  // ── Latin American ──
  // NEW — Aztec stepped geometric
  if (pattern === "aztec") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M4,4 L12,4 L12,8 L8,8 L8,12 L4,12 Z" fill={colors.accent} opacity="0.35"/>
      <path d="M20,4 L28,4 L28,12 L24,12 L24,8 L20,8 Z" fill={colors.accent} opacity="0.35"/>
      <path d="M4,20 L8,20 L8,24 L12,24 L12,28 L4,28 Z" fill={colors.accent} opacity="0.35"/>
      <path d="M24,20 L28,20 L28,28 L20,28 L20,24 L24,24 Z" fill={colors.accent} opacity="0.35"/>
      <rect x="12" y="12" width="8" height="8" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.3"/>
    </pattern>
  );

  // ── European Classics ──
  // NEW — Houndstooth
  if (pattern === "houndstooth") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="20" height="20" patternUnits="userSpaceOnUse">
      <polygon points="0,0 10,0 10,5 5,10 10,10 10,20 0,20 0,15 5,10 0,10" fill={colors.accent} opacity="0.35"/>
      <polygon points="10,0 20,0 20,10 15,10 20,15 20,20 10,20 10,15 15,10 10,10" fill={colors.accent} opacity="0.2"/>
    </pattern>
  );
  // NEW — Argyle diamond
  if (pattern === "argyle") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="30" height="30" patternUnits="userSpaceOnUse">
      <polygon points="15,2 28,15 15,28 2,15" stroke={colors.accent} strokeWidth="1.5" fill={colors.accent} fillOpacity="0.18" strokeOpacity="0.4"/>
      <line x1="2" y1="15" x2="28" y2="15" stroke={colors.detail} strokeWidth="0.6" opacity="0.25"/>
      <line x1="15" y1="2" x2="15" y2="28" stroke={colors.detail} strokeWidth="0.6" opacity="0.25"/>
    </pattern>
  );
  // NEW — Damask floral brocade
  if (pattern === "damask") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M20,2 C26,6 34,10 34,20 C34,30 26,34 20,38 C14,34 6,30 6,20 C6,10 14,6 20,2 Z" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.3"/>
      <path d="M20,8 C23,11 28,14 28,20 C28,26 23,29 20,32 C17,29 12,26 12,20 C12,14 17,11 20,8 Z" fill={colors.accent} opacity="0.12"/>
      <circle cx="20" cy="20" r="3" fill={colors.accent} opacity="0.38"/>
      <circle cx="20" cy="2" r="2" fill={colors.accent} opacity="0.25"/>
      <circle cx="20" cy="38" r="2" fill={colors.accent} opacity="0.25"/>
    </pattern>
  );
  // NEW — Celtic knotwork
  if (pattern === "celtic") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M4,18 C4,10 10,4 18,4 C26,4 32,10 32,18 C32,26 26,32 18,32 C10,32 4,26 4,18 Z" stroke={colors.accent} strokeWidth="2.5" fill="none" opacity="0.3"/>
      <path d="M18,4 C22,4 22,8 18,8 C14,8 14,12 18,12 C22,12 22,16 18,16 C14,16 14,20 18,20 C22,20 22,24 18,24 C14,24 14,28 18,28 C22,28 22,32 18,32" stroke={colors.accent} strokeWidth="1.2" fill="none" opacity="0.25"/>
    </pattern>
  );
  // NEW — Nordic snowflake
  if (pattern === "nordic") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="34" height="34" patternUnits="userSpaceOnUse">
      <line x1="17" y1="3" x2="17" y2="31" stroke={colors.accent} strokeWidth="1.5" opacity="0.4"/>
      <line x1="3" y1="17" x2="31" y2="17" stroke={colors.accent} strokeWidth="1.5" opacity="0.4"/>
      <line x1="5" y1="5" x2="29" y2="29" stroke={colors.accent} strokeWidth="1" opacity="0.3"/>
      <line x1="29" y1="5" x2="5" y2="29" stroke={colors.accent} strokeWidth="1" opacity="0.3"/>
      <circle cx="17" cy="3" r="2" fill={colors.accent} opacity="0.4"/>
      <circle cx="17" cy="31" r="2" fill={colors.accent} opacity="0.4"/>
      <circle cx="3" cy="17" r="2" fill={colors.accent} opacity="0.4"/>
      <circle cx="31" cy="17" r="2" fill={colors.accent} opacity="0.4"/>
      <circle cx="17" cy="17" r="3.5" fill={colors.accent} opacity="0.45"/>
    </pattern>
  );
  // NEW — Greek key meander
  if (pattern === "greek-key") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="32" height="16" patternUnits="userSpaceOnUse">
      <path d="M0,4 L8,4 L8,12 L4,12 L4,8 L12,8 L12,0 L16,0 L16,16 L0,16 Z" fill="none" stroke={colors.accent} strokeWidth="1.2" opacity="0.4"/>
      <path d="M16,0 L16,12 L24,12 L24,4 L20,4 L20,8 L28,8 L28,0 L32,0 L32,16 L16,16" fill="none" stroke={colors.accent} strokeWidth="1.2" opacity="0.4"/>
    </pattern>
  );

  // ── Asia ──
  // NEW — Batik (Indonesian organic)
  if (pattern === "batik") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="50" height="50" patternUnits="userSpaceOnUse">
      <ellipse cx="14" cy="14" rx="10" ry="7" stroke={colors.accent} strokeWidth="1.2" fill="none" opacity="0.32" transform="rotate(30,14,14)"/>
      <ellipse cx="36" cy="36" rx="10" ry="7" stroke={colors.accent} strokeWidth="1.2" fill="none" opacity="0.32" transform="rotate(-20,36,36)"/>
      <ellipse cx="36" cy="14" rx="8" ry="5" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.25" transform="rotate(60,36,14)"/>
      <ellipse cx="14" cy="36" rx="8" ry="5" stroke={colors.accent} strokeWidth="1" fill="none" opacity="0.25" transform="rotate(-45,14,36)"/>
      <circle cx="25" cy="25" r="3" fill={colors.accent} opacity="0.3"/>
    </pattern>
  );

  // ── Western / Street ──
  if (pattern === "plaid") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="24" height="24" patternUnits="userSpaceOnUse">
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
  if (pattern === "camo") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="70" height="70" patternUnits="userSpaceOnUse">
      <rect width="70" height="70" fill={colors.main}/>
      <ellipse cx="18" cy="18" rx="20" ry="13" fill={darken(colors.main,22)} opacity="0.5"/>
      <ellipse cx="50" cy="32" rx="16" ry="11" fill={lighten(colors.main,18)} opacity="0.4"/>
      <ellipse cx="30" cy="56" rx="18" ry="12" fill={darken(colors.main,15)} opacity="0.45"/>
      <ellipse cx="62" cy="58" rx="14" ry="9" fill={colors.accent} opacity="0.22"/>
    </pattern>
  );
  // NEW — Chevron zigzag
  if (pattern === "chevron") return (
    <pattern key={`${u}pat`} id={`${u}pat`} width="28" height="14" patternUnits="userSpaceOnUse">
      <polyline points="0,7 7,0 14,7 21,0 28,7" stroke={colors.accent} strokeWidth="2.5" fill="none" strokeLinejoin="miter" opacity="0.38"/>
      <polyline points="0,14 7,7 14,14 21,7 28,14" stroke={colors.accent} strokeWidth="1.2" fill="none" strokeLinejoin="miter" opacity="0.22"/>
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
  const zoneClipId = zone && zone !== "full" ? `${clipId}_zone` : null;

  const zoneRect = (() => {
    if (!zone || zone === "full" || !viewBox) return null;
    const { x, y, w, h } = viewBox;
    if (zone === "upper") return { x, y, w, h: h * 0.45 };
    if (zone === "lower") return { x, y: y + h * 0.55, w, h: h * 0.45 };
    if (zone === "center") return { x, y: y + h * 0.25, w, h: h * 0.5 };
    if (zone === "left") return { x, y, w: w * 0.4, h };
    if (zone === "right") return { x: x + w * 0.6, y, w: w * 0.4, h };
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
        fill={`url(#${u}pat)`}
        clipPath={zoneClipId ? `url(#${zoneClipId})` : `url(#${clipId})`}
        opacity={opacity}
      />
    </>
  );
}
