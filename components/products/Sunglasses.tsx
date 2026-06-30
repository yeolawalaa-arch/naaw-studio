"use client";
import { ProductColors } from "../ProductCanvas";
import { lighten, darken } from "../patternUtils";

export default function Sunglasses({ colors }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `sg${Math.random().toString(36).slice(2,5)}`;
  const LENS_L = "M 95,150 Q 95,118 135,116 L 215,116 Q 232,118 230,150 Q 226,210 160,212 Q 100,210 95,150 Z";
  const LENS_R = "M 405,150 Q 405,118 365,116 L 285,116 Q 268,118 270,150 Q 274,210 340,212 Q 400,210 405,150 Z";
  return (
    <svg viewBox="0 0 500 310" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        <linearGradient id={`${u}ln`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.secondary,30)}/><stop offset="100%" stopColor={darken(colors.secondary,20)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#000" floodOpacity="0.5"/></filter>
      </defs>

      {/* Temples */}
      <path d="M 95,150 L 40,138 L 36,150 L 92,166 Z" fill={darken(colors.main,8)} stroke={darken(colors.main,30)} strokeWidth="1.5"/>
      <path d="M 405,150 L 460,138 L 464,150 L 408,166 Z" fill={darken(colors.main,8)} stroke={darken(colors.main,30)} strokeWidth="1.5"/>
      {/* Lenses */}
      <path d={LENS_L} fill={`url(#${u}ln)`} stroke={colors.main} strokeWidth="9" filter={`url(#${u}ds)`}/>
      <path d={LENS_R} fill={`url(#${u}ln)`} stroke={colors.main} strokeWidth="9" filter={`url(#${u}ds)`}/>
      {/* Bridge */}
      <path d="M 230,134 Q 250,124 270,134" fill="none" stroke={colors.main} strokeWidth="9" strokeLinecap="round"/>
      {/* Glare highlights */}
      <path d="M 120,140 Q 150,128 180,140" fill="none" stroke={lighten(colors.secondary,55)} strokeWidth="4" opacity="0.6" strokeLinecap="round"/>
      <path d="M 320,140 Q 350,128 380,140" fill="none" stroke={lighten(colors.secondary,55)} strokeWidth="4" opacity="0.6" strokeLinecap="round"/>
      {/* Hinge studs */}
      <circle cx="100" cy="150" r="4" fill={colors.accent}/>
      <circle cx="400" cy="150" r="4" fill={colors.accent}/>
    </svg>
  );
}
