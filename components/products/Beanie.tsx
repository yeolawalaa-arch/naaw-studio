"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Beanie({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `bn${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 140,280 C 130,220 130,160 148,120 C 166,80 200,58 250,55 C 300,58 334,80 352,120 C 370,160 370,220 360,280 Z`;
  const POM = `M 250,52 C 230,42 222,30 228,20 C 234,10 250,8 250,8 C 250,8 266,10 272,20 C 278,30 270,42 250,52 Z`;
  const CUFF = `M 136,272 L 364,272 L 360,300 L 140,300 Z`;

  return (
    <svg viewBox="0 0 500 340" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,20)}/>
          <stop offset="100%" stopColor={darken(colors.main,24)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
      </defs>

      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`}/>

      {/* Ribbing lines */}
      {Array.from({length:8},(_,i)=>(
        <path key={i} d={`M ${145+i*3},278 C ${148+i*3},${250-i*6} ${148+i*3},${200-i*4} ${152+i*3},${140-i*3}`}
          stroke="rgba(0,0,0,0.12)" strokeWidth="2.5" fill="none"/>
      ))}
      {Array.from({length:8},(_,i)=>(
        <path key={i} d={`M ${355-i*3},278 C ${352-i*3},${250-i*6} ${352-i*3},${200-i*4} ${348-i*3},${140-i*3}`}
          stroke="rgba(0,0,0,0.12)" strokeWidth="2.5" fill="none"/>
      ))}

      {/* Cuff */}
      <path d={CUFF} fill={colors.secondary || colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1.5"/>
      {/* Cuff ribs */}
      {Array.from({length:18},(_,i)=>(
        <line key={i} x1={142+i*12} y1="272" x2={142+i*12} y2="300" stroke="rgba(0,0,0,0.15)" strokeWidth="2"/>
      ))}

      {/* Pom pom */}
      <circle cx="250" cy="30" r="22" fill={colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1.5"/>
      <circle cx="242" cy="24" r="7" fill={lighten(colors.accent,30)} opacity="0.4"/>

      
    </svg>
  );
}
