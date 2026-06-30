"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Scarf({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `sc${Math.random().toString(36).slice(2,5)}`;
  const LOOP = "M 150,70 Q 250,40 350,70 Q 360,110 330,130 Q 250,100 170,130 Q 140,110 150,70 Z";
  const TAIL_L = "M 168,128 L 248,128 L 236,400 L 176,400 Z";
  const TAIL_R = "M 252,128 L 332,128 L 324,400 L 264,400 Z";
  return (
    <svg viewBox="0 0 500 440" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="30%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,16)}/><stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}lc`}><path d={TAIL_L}/></clipPath>
        <clipPath id={`${u}rc`}><path d={TAIL_R}/></clipPath>
        <clipPath id={`${u}oc`}><path d={LOOP}/></clipPath>
      </defs>

      <path d={TAIL_L} fill={`url(#${u}bg)`} stroke={darken(colors.main,26)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={TAIL_L} colors={colors} pattern={pattern} clipId={`${u}lc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:168,y:128,w:80,h:272}}/>
      <path d={TAIL_R} fill={`url(#${u}bg)`} stroke={darken(colors.main,26)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={TAIL_R} colors={colors} pattern={pattern} clipId={`${u}rc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:252,y:128,w:80,h:272}}/>
      <path d={LOOP} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={LOOP} colors={colors} pattern={pattern} clipId={`${u}oc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:140,y:40,w:220,h:100}}/>
      {/* Fringe */}
      {Array.from({length:7},(_,i)=>(<line key={`fl${i}`} x1={180+i*9} y1="400" x2={178+i*9} y2="424" stroke={colors.accent} strokeWidth="3"/>))}
      {Array.from({length:7},(_,i)=>(<line key={`fr${i}`} x1={266+i*9} y1="400" x2={264+i*9} y2="424" stroke={colors.accent} strokeWidth="3"/>))}
      {/* Border stripes */}
      <line x1="176" y1="150" x2="246" y2="150" stroke={colors.accent} strokeWidth="3" opacity="0.7"/>
      <line x1="264" y1="150" x2="332" y2="150" stroke={colors.accent} strokeWidth="3" opacity="0.7"/>
    </svg>
  );
}
