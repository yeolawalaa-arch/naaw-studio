"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Polo({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `pl${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 162,100 L 78,132 L 58,192 L 102,200 L 102,400 L 398,400 L 398,200 L 442,192 L 422,132 L 338,100 C 316,118 294,128 250,128 C 206,128 184,118 162,100 Z`;
  const SLEEVE_L = `M 162,100 C 136,88 92,90 72,132 L 52,198 L 102,208 L 120,146 C 132,114 148,102 162,100 Z`;
  const SLEEVE_R = `M 338,100 C 364,88 408,90 428,132 L 448,198 L 398,208 L 380,146 C 368,114 352,102 338,100 Z`;
  const COLLAR = `M 195,100 L 250,72 L 305,100 L 268,128 L 250,115 L 232,128 Z`;
  const PLACKET = `M 244,128 L 244,185 L 256,185 L 256,128 Z`;

  return (
    <svg viewBox="0 0 500 440" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/>
          <stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <linearGradient id={`${u}sg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,8)}/>
          <stop offset="100%" stopColor={darken(colors.main,26)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
        <clipPath id={`${u}slc`}><path d={SLEEVE_L}/></clipPath>
        <clipPath id={`${u}src`}><path d={SLEEVE_R}/></clipPath>
      </defs>

      <path d={SLEEVE_L} fill={`url(#${u}sg)`} stroke={darken(colors.main,32)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SLEEVE_L} colors={colors} pattern={pattern} clipId={`${u}slc`}/>
      <path d={SLEEVE_R} fill={`url(#${u}sg)`} stroke={darken(colors.main,32)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SLEEVE_R} colors={colors} pattern={pattern} clipId={`${u}src`}/>
      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`}/>

      {/* Collar stripe */}
      <path d={COLLAR} fill={colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1.5"/>
      <path d={PLACKET} fill={colors.accent} opacity="0.8"/>
      {[148,165,182].map(y => (
        <circle key={y} cx="250" cy={y} r="4.5" fill={darken(colors.accent,20)} stroke={darken(colors.accent,35)} strokeWidth="1"/>
      ))}
      
    </svg>
  );
}
