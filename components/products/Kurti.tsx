"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Kurti({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `kt${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 185,92 L 130,118 L 120,195 L 158,206 L 150,410 L 350,410 L 342,206 L 380,195 L 370,118 L 315,92 C 298,118 275,150 250,150 C 225,150 202,118 185,92 Z`;
  const SLEEVE_L = `M 185,92 C 158,82 138,94 130,118 L 120,195 L 158,206 L 172,150 C 176,122 180,102 185,92 Z`;
  const SLEEVE_R = `M 315,92 C 342,82 362,94 370,118 L 380,195 L 342,206 L 328,150 C 324,122 320,102 315,92 Z`;

  return (
    <svg viewBox="0 0 500 440" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,16)}/><stop offset="100%" stopColor={darken(colors.main,24)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
      </defs>

      <path d={SLEEVE_L} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={SLEEVE_R} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:120,y:92,w:260,h:318}}/>
      {/* Neckline trim (U-shape) */}
      <path d="M 200,96 C 218,140 232,156 250,156 C 268,156 282,140 300,96" fill="none" stroke={colors.accent} strokeWidth="5" strokeLinecap="round"/>
      {/* Embroidered placket */}
      <line x1="250" y1="156" x2="250" y2="300" stroke={colors.accent} strokeWidth="3" strokeDasharray="2,5" opacity="0.8"/>
      {/* Hem border */}
      <rect x="150" y="400" width="200" height="10" fill={colors.accent} opacity="0.85"/>
    </svg>
  );
}
