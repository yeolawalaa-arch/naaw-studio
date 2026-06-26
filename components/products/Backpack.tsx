"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Backpack({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `bp${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 120,80 C 120,62 135,52 250,52 C 365,52 380,62 380,80 L 395,360 C 395,375 330,385 250,385 C 170,385 105,375 105,360 Z`;
  const FRONT_POCKET = `M 148,240 L 148,340 C 148,350 195,356 250,356 C 305,356 352,350 352,340 L 352,240 C 352,230 305,224 250,224 C 195,224 148,230 148,240 Z`;
  const TOP_HANDLE = `M 210,52 C 210,40 220,34 250,34 C 280,34 290,40 290,52`;
  const ZIP_MAIN = `M 145,175 C 145,165 192,158 250,158 C 308,158 355,165 355,175`;
  const STRAP_L = `M 118,95 C 100,95 88,108 85,125 L 80,340 C 78,352 85,358 95,355 L 120,350 L 125,125 C 125,112 120,102 118,95 Z`;
  const STRAP_R = `M 382,95 C 400,95 412,108 415,125 L 420,340 C 422,352 415,358 405,355 L 380,350 L 375,125 C 375,112 380,102 382,95 Z`;

  return (
    <svg viewBox="0 0 500 420" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/><stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <linearGradient id={`${u}sg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,8)}/><stop offset="100%" stopColor={darken(colors.main,26)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
        <clipPath id={`${u}pc`}><path d={FRONT_POCKET}/></clipPath>
      </defs>

      {/* Straps behind */}
      <path d={STRAP_L} fill={`url(#${u}sg)`} stroke={darken(colors.main,30)} strokeWidth="1.5"/>
      <path d={STRAP_R} fill={`url(#${u}sg)`} stroke={darken(colors.main,30)} strokeWidth="1.5"/>

      {/* Main body */}
      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`}/>

      {/* Front pocket */}
      <path d={FRONT_POCKET} fill={darken(colors.main,14)} stroke={darken(colors.main,28)} strokeWidth="1.5"/>
      <PatternOverlay u={u} path={FRONT_POCKET} colors={colors} pattern={pattern} clipId={`${u}pc`}/>

      {/* Zippers */}
      <path d={ZIP_MAIN} stroke={darken(colors.main,25)} strokeWidth="2.5" fill="none" strokeDasharray="5,3"/>
      <circle cx="355" cy="175" r="7" fill={colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1.5"/>
      <path d="M 148,240 C 148,230 195,224 250,224 C 305,224 352,230 352,240" stroke={darken(colors.main,25)} strokeWidth="2.5" fill="none" strokeDasharray="5,3"/>
      <circle cx="352" cy="240" r="6" fill={colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1.5"/>

      {/* Top handle */}
      <path d={TOP_HANDLE} stroke={colors.accent} strokeWidth="6" fill="none" strokeLinecap="round"/>

      {/* Side stitch */}
      <line x1="125" y1="95" x2="130" y2="355" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" strokeDasharray="4,5"/>
      <line x1="375" y1="95" x2="370" y2="355" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" strokeDasharray="4,5"/>

      
    </svg>
  );
}
