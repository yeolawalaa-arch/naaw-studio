"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function NehruJacket({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `nj${Math.random().toString(36).slice(2,5)}`;
  // Sleeveless waistcoat with mandarin collar
  const BODY = `M 175,96 L 150,120 L 150,360 L 350,360 L 350,120 L 325,96 C 305,116 280,126 250,126 C 220,126 195,116 175,96 Z`;
  const ARM_L = `M 175,96 L 150,120 L 150,200 C 138,170 140,128 175,96 Z`;
  const ARM_R = `M 325,96 L 350,120 L 350,200 C 362,170 360,128 325,96 Z`;

  return (
    <svg viewBox="0 0 500 410" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,14)}/><stop offset="100%" stopColor={darken(colors.main,26)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
      </defs>

      {/* under-shirt sleeves (kurta) */}
      <path d={ARM_L} fill={darken(colors.lining||colors.secondary,4)} stroke={darken(colors.main,30)} strokeWidth="1"/>
      <path d={ARM_R} fill={darken(colors.lining||colors.secondary,4)} stroke={darken(colors.main,30)} strokeWidth="1"/>
      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:150,y:96,w:200,h:264}}/>
      {/* Mandarin collar */}
      <path d="M 200,98 C 222,116 250,122 250,122 C 250,122 278,116 300,98 C 286,84 268,78 250,78 C 232,78 214,84 200,98 Z" fill={colors.accent} stroke={darken(colors.accent,28)} strokeWidth="1.5"/>
      {/* V-front opening + buttons */}
      <path d="M 250,122 L 250,360" stroke={darken(colors.main,34)} strokeWidth="2.5"/>
      {[160,205,250,295].map((y,i)=>(<circle key={i} cx="250" cy={y} r="4.5" fill={lighten(colors.accent,26)} stroke={darken(colors.accent,28)} strokeWidth="1"/>))}
      {/* welt pockets */}
      <rect x="180" y="300" width="46" height="7" rx="2" fill={darken(colors.main,30)}/>
      <rect x="274" y="300" width="46" height="7" rx="2" fill={darken(colors.main,30)}/>
    </svg>
  );
}
