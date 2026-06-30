"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Dhoti({ colors, pattern, patternIntensity = 60, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `dh${Math.random().toString(36).slice(2,5)}`;
  // Draped lower garment: waist band + pleated wrap + two legs
  const WRAP = `M 130,120 L 370,120 L 360,250 L 270,250 L 250,200 L 230,250 L 140,250 Z`;
  const LEG_L = `M 140,250 L 230,250 L 222,400 L 150,400 Z`;
  const LEG_R = `M 270,250 L 360,250 L 350,400 L 278,400 Z`;
  const DRAPE = `M 230,200 Q 250,260 250,330 Q 250,260 270,200 Z`;

  return (
    <svg viewBox="0 0 500 430" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/><stop offset="100%" stopColor={darken(colors.main,18)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}wc`}><path d={WRAP}/></clipPath>
      </defs>

      <path d={LEG_L} fill={`url(#${u}bg)`} stroke={darken(colors.main,26)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={LEG_R} fill={`url(#${u}bg)`} stroke={darken(colors.main,26)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={WRAP} fill={`url(#${u}bg)`} stroke={darken(colors.main,24)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={WRAP} colors={colors} pattern={pattern} clipId={`${u}wc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:130,y:120,w:240,h:130}}/>
      {/* central front pleat */}
      <path d={DRAPE} fill={darken(colors.main,12)} stroke={darken(colors.main,28)} strokeWidth="1"/>
      {[244,250,256].map((x,i)=>(<line key={i} x1={x} y1="205" x2={x} y2="320" stroke={darken(colors.main,30)} strokeWidth="1" opacity="0.6"/>))}
      {/* Waistband + gold border */}
      <rect x="128" y="116" width="244" height="16" rx="4" fill={colors.accent} stroke={darken(colors.accent,28)} strokeWidth="1"/>
      <rect x="140" y="392" width="82" height="8" fill={colors.accent} opacity="0.85"/>
      <rect x="278" y="392" width="72" height="8" fill={colors.accent} opacity="0.85"/>
    </svg>
  );
}
