"use client";
import { ProductColors } from "../ProductCanvas";
import { lighten, darken } from "../patternUtils";

export default function Ring({ colors }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `rg${Math.random().toString(36).slice(2,5)}`;
  return (
    <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        <linearGradient id={`${u}bn`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.accent,40)}/><stop offset="50%" stopColor={colors.accent}/><stop offset="100%" stopColor={darken(colors.accent,24)}/>
        </linearGradient>
        <radialGradient id={`${u}gem`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={lighten(colors.secondary,40)}/><stop offset="60%" stopColor={colors.secondary}/><stop offset="100%" stopColor={darken(colors.secondary,26)}/>
        </radialGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#000" floodOpacity="0.55"/></filter>
      </defs>

      {/* Band */}
      <ellipse cx="250" cy="220" rx="108" ry="92" fill="none" stroke={`url(#${u}bn)`} strokeWidth="26" filter={`url(#${u}ds)`}/>
      <ellipse cx="250" cy="220" rx="108" ry="92" fill="none" stroke={lighten(colors.accent,50)} strokeWidth="4" opacity="0.5"/>
      {/* Prongs */}
      {[[-30,-30],[30,-30],[-30,28],[30,28]].map(([dx,dy],i)=>(<line key={i} x1="250" y1="120" x2={250+dx} y2={120+dy} stroke={darken(colors.accent,10)} strokeWidth="6" strokeLinecap="round"/>))}
      {/* Centre gem (brilliant) */}
      <polygon points="250,72 304,120 250,182 196,120" fill={`url(#${u}gem)`} stroke={darken(colors.secondary,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <polygon points="250,72 274,120 250,140 226,120" fill={lighten(colors.secondary,28)} opacity="0.7"/>
      <polygon points="196,120 304,120 250,182" fill={darken(colors.secondary,10)} opacity="0.35"/>
      <line x1="196" y1="120" x2="304" y2="120" stroke={lighten(colors.secondary,40)} strokeWidth="1.5" opacity="0.6"/>
    </svg>
  );
}
