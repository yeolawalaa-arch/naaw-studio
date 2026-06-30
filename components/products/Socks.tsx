"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Socks({ colors, pattern, patternIntensity = 65, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `so${Math.random().toString(36).slice(2,5)}`;
  const SOCK_L = "M 130,90 L 200,90 L 200,250 Q 200,300 240,300 L 250,300 Q 270,300 270,330 L 270,360 Q 270,380 240,380 L 175,380 Q 130,380 130,330 Z";
  const SOCK_R = "M 300,90 L 370,90 L 370,330 Q 370,380 325,380 L 260,380 Q 230,380 230,360 L 230,332 Q 230,302 250,302 L 262,302 Q 300,300 300,250 Z";
  return (
    <svg viewBox="0 0 500 420" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,16)}/><stop offset="100%" stopColor={darken(colors.main,20)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}lc`}><path d={SOCK_L}/></clipPath>
        <clipPath id={`${u}rc`}><path d={SOCK_R}/></clipPath>
      </defs>

      <path d={SOCK_L} fill={`url(#${u}bg)`} stroke={darken(colors.main,26)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SOCK_L} colors={colors} pattern={pattern} clipId={`${u}lc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:130,y:90,w:140,h:290}}/>
      <path d={SOCK_R} fill={`url(#${u}bg)`} stroke={darken(colors.main,26)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SOCK_R} colors={colors} pattern={pattern} clipId={`${u}rc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:230,y:90,w:140,h:290}}/>
      {/* Ribbed cuffs */}
      <rect x="130" y="90" width="70" height="34" fill={colors.accent} opacity="0.9"/>
      <rect x="300" y="90" width="70" height="34" fill={colors.accent} opacity="0.9"/>
      {[138,150,162,174,186].map((x,i)=>(<line key={`cl${i}`} x1={x} y1="92" x2={x} y2="122" stroke={darken(colors.accent,22)} strokeWidth="1.4" opacity="0.6"/>))}
      {[308,320,332,344,356].map((x,i)=>(<line key={`cr${i}`} x1={x} y1="92" x2={x} y2="122" stroke={darken(colors.accent,22)} strokeWidth="1.4" opacity="0.6"/>))}
      {/* Heel + toe accents */}
      <path d="M 130,330 Q 130,380 175,380 L 175,340 Q 145,340 145,318 Z" fill={colors.secondary} opacity="0.85"/>
      <ellipse cx="240" cy="362" rx="34" ry="20" fill={colors.secondary} opacity="0.85"/>
      <path d="M 370,330 Q 370,380 325,380 L 325,340 Q 355,340 355,318 Z" fill={colors.secondary} opacity="0.85"/>
      <ellipse cx="290" cy="360" rx="30" ry="18" fill={colors.secondary} opacity="0.85"/>
    </svg>
  );
}
