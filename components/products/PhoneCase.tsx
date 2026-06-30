"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function PhoneCase({ colors, pattern, patternIntensity = 65, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `pc${Math.random().toString(36).slice(2,5)}`;
  const BODY = "M 175,50 L 325,50 Q 360,50 360,90 L 360,360 Q 360,400 325,400 L 175,400 Q 140,400 140,360 L 140,90 Q 140,50 175,50 Z";
  return (
    <svg viewBox="0 0 500 440" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,16)}/><stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="7" stdDeviation="12" floodColor="#000" floodOpacity="0.55"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
      </defs>

      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:140,y:50,w:220,h:350}}/>
      {/* Camera module */}
      <rect x="168" y="78" width="110" height="110" rx="26" fill={darken(colors.secondary,6)} stroke={darken(colors.main,30)} strokeWidth="1.5"/>
      {[[198,108],[248,108],[198,158]].map(([cx,cy],i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r="20" fill="#0d0f12" stroke={darken(colors.detail,10)} strokeWidth="3"/>
          <circle cx={cx} cy={cy} r="9" fill={lighten(colors.secondary,20)} opacity="0.5"/>
          <circle cx={cx-5} cy={cy-5} r="3" fill="#ffffff" opacity="0.7"/>
        </g>
      ))}
      <circle cx="258" cy="158" r="8" fill={colors.accent} opacity="0.8"/>
      {/* Side buttons */}
      <rect x="134" y="120" width="6" height="40" rx="3" fill={darken(colors.main,26)}/>
      <rect x="134" y="172" width="6" height="28" rx="3" fill={darken(colors.main,26)}/>
      <rect x="360" y="130" width="6" height="56" rx="3" fill={darken(colors.main,26)}/>
    </svg>
  );
}
