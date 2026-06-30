"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Pathani({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `pt${Math.random().toString(36).slice(2,5)}`;
  const KAMEEZ = `M 178,90 L 120,118 L 110,200 L 152,212 L 152,330 L 348,330 L 348,212 L 390,200 L 380,118 L 322,90 C 302,112 278,122 250,122 C 222,122 198,112 178,90 Z`;
  const SLEEVE_L = `M 178,90 C 148,80 128,92 120,118 L 110,200 L 152,212 L 166,150 C 170,118 173,100 178,90 Z`;
  const SLEEVE_R = `M 322,90 C 352,80 372,92 380,118 L 390,200 L 348,212 L 334,150 C 330,118 327,100 322,90 Z`;
  const SALWAR = `M 158,330 L 158,460 L 240,460 L 250,360 L 260,460 L 342,460 L 342,330 Z`;

  return (
    <svg viewBox="0 0 500 490" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,15)}/><stop offset="100%" stopColor={darken(colors.main,24)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={KAMEEZ}/></clipPath>
      </defs>

      {/* Salwar pants */}
      <path d={SALWAR} fill={darken(colors.secondary,4)} stroke={darken(colors.secondary,26)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      {/* Kameez */}
      <path d={SLEEVE_L} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={SLEEVE_R} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={KAMEEZ} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={KAMEEZ} colors={colors} pattern={pattern} clipId={`${u}bc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:110,y:90,w:280,h:240}}/>
      {/* Mandarin collar + placket */}
      <path d="M 204,92 C 224,110 250,116 250,116 C 250,116 276,110 296,92 C 282,80 266,74 250,74 C 234,74 218,80 204,92 Z" fill={colors.accent} stroke={darken(colors.accent,28)} strokeWidth="1.5"/>
      <line x1="250" y1="116" x2="250" y2="250" stroke={darken(colors.main,32)} strokeWidth="2.5"/>
      {[140,176,212].map((y,i)=>(<circle key={i} cx="250" cy={y} r="4" fill={colors.accent} stroke={darken(colors.accent,28)} strokeWidth="1"/>))}
    </svg>
  );
}
