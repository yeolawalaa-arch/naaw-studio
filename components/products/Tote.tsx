"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Tote({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `tt${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 100,120 L 88,370 C 88,382 162,392 250,392 C 338,392 412,382 412,370 L 400,120 Z`;
  const HANDLE_L = `M 148,120 C 138,80 148,48 175,40 C 195,34 210,44 215,68 L 218,120 Z`;
  const HANDLE_R = `M 352,120 C 362,80 352,48 325,40 C 305,34 290,44 285,68 L 282,120 Z`;
  const RIM = `M 98,120 L 402,120 L 400,138 L 100,138 Z`;

  return (
    <svg viewBox="0 0 500 430" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/><stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <linearGradient id={`${u}hg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,8)}/><stop offset="100%" stopColor={darken(colors.main,26)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
      </defs>

      <path d={HANDLE_L} fill={`url(#${u}hg)`} stroke={darken(colors.main,30)} strokeWidth="2"/>
      <path d={HANDLE_R} fill={`url(#${u}hg)`} stroke={darken(colors.main,30)} strokeWidth="2"/>
      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`}/>
      <path d={RIM} fill={colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1.5"/>
      {/* Side seams */}
      <line x1="100" y1="138" x2="90" y2="390" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="4,5"/>
      <line x1="400" y1="138" x2="410" y2="390" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="4,5"/>
      {/* Bottom seam */}
      <path d="M 90,385 C 130,394 190,398 250,398 C 310,398 370,394 410,385" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" strokeDasharray="4,5"/>
      <text x="250" y="275" textAnchor="middle" fill="rgba(255,255,255,0.14)" fontSize="26" fontWeight="900" fontFamily="Arial" letterSpacing="6">NAAW</text>
    </svg>
  );
}
