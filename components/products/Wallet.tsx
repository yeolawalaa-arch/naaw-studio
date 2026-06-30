"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Wallet({ colors, pattern, patternIntensity = 55, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `wl${Math.random().toString(36).slice(2,5)}`;
  const BODY = "M 120,100 L 380,100 Q 392,100 392,112 L 392,300 Q 392,312 380,312 L 120,312 Q 108,312 108,300 L 108,112 Q 108,100 120,100 Z";
  return (
    <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,14)}/><stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
      </defs>

      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:108,y:100,w:284,h:212}}/>
      {/* Centre fold */}
      <line x1="250" y1="100" x2="250" y2="312" stroke={darken(colors.main,30)} strokeWidth="2.5" opacity="0.7"/>
      {/* Stitched border */}
      <rect x="122" y="114" width="256" height="184" rx="8" fill="none" stroke={colors.detail} strokeWidth="1.4" strokeDasharray="6,5" opacity="0.55"/>
      {/* Card slot + accent tab */}
      <rect x="146" y="150" width="86" height="54" rx="6" fill={darken(colors.main,16)} stroke={darken(colors.main,30)} strokeWidth="1.2"/>
      <rect x="156" y="162" width="56" height="8" rx="3" fill={colors.accent} opacity="0.8"/>
      <rect x="288" y="150" width="74" height="118" rx="6" fill="none" stroke={colors.accent} strokeWidth="2" opacity="0.7"/>
    </svg>
  );
}
