"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Belt({ colors, pattern, patternIntensity = 60, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `bl${Math.random().toString(36).slice(2,5)}`;
  const STRAP = "M 60,128 L 300,128 L 300,182 L 60,182 Z";
  return (
    <svg viewBox="0 0 500 310" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,14)}/><stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <linearGradient id={`${u}bk`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.accent,34)}/><stop offset="100%" stopColor={darken(colors.accent,20)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}sc`}><path d={STRAP}/></clipPath>
      </defs>

      {/* Strap */}
      <path d={STRAP} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={STRAP} colors={colors} pattern={pattern} clipId={`${u}sc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:60,y:128,w:240,h:54}}/>
      {/* stitch line */}
      <line x1="68" y1="138" x2="296" y2="138" stroke={colors.detail} strokeWidth="1.2" strokeDasharray="5,4" opacity="0.6"/>
      <line x1="68" y1="172" x2="296" y2="172" stroke={colors.detail} strokeWidth="1.2" strokeDasharray="5,4" opacity="0.6"/>
      {/* holes */}
      {[120,150,180,210].map((x,i)=>(<circle key={i} cx={x} cy="155" r="5" fill="#0c0c0c" stroke={darken(colors.main,30)} strokeWidth="1"/>))}
      {/* Buckle */}
      <rect x="318" y="112" width="92" height="86" rx="12" fill="none" stroke={`url(#${u}bk)`} strokeWidth="16" filter={`url(#${u}ds)`}/>
      <line x1="318" y1="155" x2="300" y2="155" stroke={`url(#${u}bk)`} strokeWidth="10"/>
      <line x1="364" y1="118" x2="364" y2="192" stroke={`url(#${u}bk)`} strokeWidth="8"/>
    </svg>
  );
}
