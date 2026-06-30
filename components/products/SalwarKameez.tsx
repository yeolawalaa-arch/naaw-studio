"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function SalwarKameez({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `sk${Math.random().toString(36).slice(2,5)}`;
  const KAMEEZ = `M 182,92 L 124,118 L 114,198 L 154,210 L 154,338 L 346,338 L 346,210 L 386,198 L 376,118 L 318,92 C 300,116 276,128 250,128 C 224,128 200,116 182,92 Z`;
  const SLEEVE_L = `M 182,92 C 152,82 132,94 124,118 L 114,198 L 154,210 L 168,150 C 172,120 177,102 182,92 Z`;
  const SLEEVE_R = `M 318,92 C 348,82 368,94 376,118 L 386,198 L 346,210 L 332,150 C 328,120 323,102 318,92 Z`;
  const SALWAR = `M 162,338 L 338,338 C 332,400 320,430 300,452 L 262,452 L 250,372 L 238,452 L 200,452 C 180,430 168,400 162,338 Z`;

  return (
    <svg viewBox="0 0 500 490" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="55%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,15)}/><stop offset="100%" stopColor={darken(colors.main,24)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}kc`}><path d={KAMEEZ}/></clipPath>
      </defs>

      {/* Baggy salwar */}
      <path d={SALWAR} fill={darken(colors.lining||colors.secondary,2)} stroke={darken(colors.secondary,24)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      {[210,250,290].map((x,i)=>(<line key={i} x1={x} y1="340" x2={x} y2="448" stroke={darken(colors.secondary,20)} strokeWidth="1" opacity="0.5"/>))}
      {/* Kameez */}
      <path d={SLEEVE_L} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={SLEEVE_R} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={KAMEEZ} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={KAMEEZ} colors={colors} pattern={pattern} clipId={`${u}kc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:114,y:92,w:272,h:246}}/>
      {/* Neckline + placket */}
      <path d="M 208,94 C 226,128 238,144 250,144 C 262,144 274,128 292,94" fill="none" stroke={colors.accent} strokeWidth="5" strokeLinecap="round"/>
      <line x1="250" y1="144" x2="250" y2="280" stroke={colors.accent} strokeWidth="2.5" strokeDasharray="2,5" opacity="0.8"/>
      {/* Dupatta drape across */}
      <path d="M 150,150 Q 250,200 350,150 L 360,176 Q 250,228 140,176 Z" fill={lighten(colors.secondary,10)} opacity="0.55" stroke={colors.accent} strokeWidth="1.5"/>
      {/* Hem border */}
      <rect x="154" y="330" width="192" height="9" fill={colors.accent} opacity="0.85"/>
    </svg>
  );
}
