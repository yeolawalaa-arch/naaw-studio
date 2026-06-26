"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function BucketHat({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `bh${Math.random().toString(36).slice(2,5)}`;
  const CROWN = `M 170,220 C 165,170 175,120 195,95 C 215,70 235,62 250,62 C 265,62 285,70 305,95 C 325,120 335,170 330,220 Z`;
  const BRIM = `M 80,232 C 75,242 78,258 96,266 C 130,278 190,284 250,284 C 310,284 370,278 404,266 C 422,258 425,242 420,232 L 335,224 L 165,224 Z`;
  const BAND = `M 167,222 L 333,222 L 335,232 L 165,232 Z`;

  return (
    <svg viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,20)}/>
          <stop offset="100%" stopColor={darken(colors.main,24)}/>
        </linearGradient>
        <linearGradient id={`${u}brg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,5)}/>
          <stop offset="100%" stopColor={darken(colors.main,28)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}cc`}><path d={CROWN}/></clipPath>
        <clipPath id={`${u}brc`}><path d={BRIM}/></clipPath>
      </defs>

      <path d={BRIM} fill={`url(#${u}brg)`} stroke={darken(colors.main,30)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BRIM} colors={colors} pattern={pattern} clipId={`${u}brc`}/>

      <path d={CROWN} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2"/>
      <PatternOverlay u={u} path={CROWN} colors={colors} pattern={pattern} clipId={`${u}cc`}/>

      <path d={BAND} fill={colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1"/>

      {/* Eyelets */}
      {[200,235,265,300].map(x=>(
        <circle key={x} cx={x} cy={150} r="4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      ))}

      {/* Brim stitch */}
      <path d="M 86,258 C 130,272 190,278 250,278 C 310,278 370,272 414,258" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" fill="none" strokeDasharray="4,5"/>

      <text x="250" y="170" textAnchor="middle" fill="rgba(255,255,255,0.16)" fontSize="20" fontWeight="900" fontFamily="Arial" letterSpacing="4">NAAW</text>
    </svg>
  );
}
