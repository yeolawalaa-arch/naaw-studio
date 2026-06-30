"use client";
import { ProductColors } from "../ProductCanvas";
import { lighten, darken } from "../patternUtils";

export default function Chain({ colors }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `ch${Math.random().toString(36).slice(2,5)}`;
  // Necklace: links following a U curve + pendant
  const links = Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    const x = 110 + t * 280;
    const y = 90 + Math.sin(t * Math.PI) * 230;
    return { x, y, i };
  });
  return (
    <svg viewBox="0 0 500 410" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        <radialGradient id={`${u}mk`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor={lighten(colors.accent,40)}/><stop offset="100%" stopColor={darken(colors.accent,20)}/>
        </radialGradient>
        <radialGradient id={`${u}gem`} cx="40%" cy="32%" r="80%">
          <stop offset="0%" stopColor={lighten(colors.secondary,30)}/><stop offset="100%" stopColor={darken(colors.secondary,22)}/>
        </radialGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.5"/></filter>
      </defs>

      {/* Chain links */}
      {links.map(({ x, y, i }) => (
        <ellipse key={i} cx={x} cy={y} rx={i % 2 ? 9 : 6} ry={i % 2 ? 6 : 9}
          fill="none" stroke={`url(#${u}mk)`} strokeWidth="4.5" filter={i === 0 ? `url(#${u}ds)` : undefined}/>
      ))}
      {/* Pendant bail + gem */}
      <circle cx="250" cy="322" r="10" fill="none" stroke={`url(#${u}mk)`} strokeWidth="5"/>
      <path d="M 250,332 L 282,366 L 250,402 L 218,366 Z" fill={`url(#${u}gem)`} stroke={darken(colors.secondary,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <path d="M 250,332 L 266,366 L 250,402 L 234,366 Z" fill={lighten(colors.secondary,18)} opacity="0.5"/>
      <path d="M 218,366 L 282,366" stroke={darken(colors.secondary,26)} strokeWidth="1.2" opacity="0.7"/>
    </svg>
  );
}
