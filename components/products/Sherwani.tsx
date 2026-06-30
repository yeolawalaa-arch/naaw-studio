"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Sherwani({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `sh${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 178,88 L 118,116 L 108,205 L 150,216 L 150,455 L 350,455 L 350,216 L 392,205 L 382,116 L 322,88 C 302,110 278,120 250,120 C 222,120 198,110 178,88 Z`;
  const SLEEVE_L = `M 178,88 C 148,78 126,90 118,116 L 108,205 L 150,216 L 164,150 C 168,118 173,98 178,88 Z`;
  const SLEEVE_R = `M 322,88 C 352,78 374,90 382,116 L 392,205 L 350,216 L 336,150 C 332,118 327,98 322,88 Z`;

  return (
    <svg viewBox="0 0 500 490" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,14)}/><stop offset="100%" stopColor={darken(colors.main,26)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
      </defs>

      <path d={SLEEVE_L} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={SLEEVE_R} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:108,y:88,w:284,h:367}}/>
      {/* Ornate mandarin collar */}
      <path d="M 202,90 C 222,108 250,114 250,114 C 250,114 278,108 298,90 C 284,76 268,70 250,70 C 232,70 216,76 202,90 Z" fill={colors.accent} stroke={darken(colors.accent,30)} strokeWidth="1.5"/>
      {/* Full button placket with many buttons + brocade trim */}
      <line x1="250" y1="114" x2="250" y2="450" stroke={colors.accent} strokeWidth="4" opacity="0.9"/>
      {Array.from({length:9},(_,i)=>(<circle key={i} cx="250" cy={140+i*34} r="4.5" fill={lighten(colors.accent,30)} stroke={darken(colors.accent,30)} strokeWidth="1"/>))}
      {/* Embroidered hem + cuffs */}
      <rect x="150" y="442" width="200" height="13" fill={colors.accent} opacity="0.85"/>
      <rect x="120" y="200" width="34" height="10" fill={colors.accent} opacity="0.7"/>
      <rect x="346" y="200" width="34" height="10" fill={colors.accent} opacity="0.7"/>
    </svg>
  );
}
