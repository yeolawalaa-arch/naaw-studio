"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Lehenga({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `lh${Math.random().toString(36).slice(2,5)}`;
  // Choli (crop top) + flared skirt + dupatta
  const CHOLI = `M 195,92 L 160,108 L 168,150 L 200,158 L 200,196 L 300,196 L 300,158 L 332,150 L 340,108 L 305,92 C 290,112 272,120 250,120 C 228,120 210,112 195,92 Z`;
  const SKIRT = `M 200,210 L 300,210 L 388,452 C 330,470 170,470 112,452 Z`;
  const DUP = `M 332,150 C 392,170 408,300 360,452 L 322,452 C 360,320 348,200 300,170 Z`;

  return (
    <svg viewBox="0 0 500 490" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}sg`} x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,16)}/><stop offset="100%" stopColor={darken(colors.main,26)}/>
        </linearGradient>
        <linearGradient id={`${u}cg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.secondary,12)}/><stop offset="100%" stopColor={darken(colors.secondary,18)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}sc`}><path d={SKIRT}/></clipPath>
      </defs>

      {/* Dupatta drape behind */}
      <path d={DUP} fill={`url(#${u}sg)`} opacity="0.6" stroke={darken(colors.main,28)} strokeWidth="1"/>
      {/* Flared skirt */}
      <path d={SKIRT} fill={`url(#${u}sg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SKIRT} colors={colors} pattern={pattern} clipId={`${u}sc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:112,y:210,w:276,h:250}}/>
      {/* Pleat lines */}
      {[170,210,250,290,330].map((x,i)=>(<line key={i} x1="250" y1="210" x2={x} y2="458" stroke={darken(colors.main,30)} strokeWidth="1" opacity="0.4"/>))}
      {/* Gold hem border */}
      <path d="M 112,452 C 170,470 330,470 388,452" fill="none" stroke={colors.accent} strokeWidth="9" strokeLinecap="round"/>
      {/* Choli */}
      <path d={CHOLI} fill={`url(#${u}cg)`} stroke={darken(colors.secondary,26)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d="M 210,96 C 226,128 238,140 250,140 C 262,140 274,128 290,96" fill="none" stroke={colors.accent} strokeWidth="4"/>
      {/* Waist border */}
      <rect x="200" y="196" width="100" height="14" fill={colors.accent} opacity="0.9"/>
    </svg>
  );
}
