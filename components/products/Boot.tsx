"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Boot({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `bt${Math.random().toString(36).slice(2,5)}`;
  const SHAFT = `M 180,60 C 175,60 168,65 165,75 L 152,310 L 380,310 L 367,75 C 364,65 357,60 352,60 Z`;
  const TOE = `M 105,330 C 100,320 100,312 115,308 L 380,308 L 380,330 C 360,345 300,352 220,352 C 160,352 110,342 105,330 Z`;
  const HEEL = `M 320,310 L 325,355 C 325,365 345,370 360,368 C 380,365 390,355 390,344 L 390,318 Z`;
  const SOLE = `M 100,332 L 95,345 C 95,356 115,364 165,368 C 200,372 240,374 270,374 C 330,374 380,368 395,360 C 405,354 405,344 400,338 L 390,322 C 385,342 365,352 345,354 C 325,356 310,348 310,336 L 310,310 L 152,310 L 145,330 C 140,340 160,348 220,350 C 270,352 305,346 310,336`;
  const LACE_PANEL = `M 210,68 L 322,68 L 335,280 L 197,280 Z`;

  return (
    <svg viewBox="0 0 500 410" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,20)}/><stop offset="100%" stopColor={darken(colors.main,24)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.55"/></filter>
        <clipPath id={`${u}sc`}><path d={SHAFT}/></clipPath>
      </defs>

      {/* Sole */}
      <path d={SOLE} fill={darken(colors.secondary||"#222",10)} stroke={darken(colors.secondary||"#222",30)} strokeWidth="1.5"/>
      <path d={HEEL} fill={darken(colors.secondary||"#222",5)} stroke={darken(colors.secondary||"#222",25)} strokeWidth="1.5"/>
      {/* Toe box */}
      <path d={TOE} fill={darken(colors.main,15)} stroke={darken(colors.main,30)} strokeWidth="1.5"/>
      {/* Shaft */}
      <path d={SHAFT} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SHAFT} colors={colors} pattern={pattern} clipId={`${u}sc`}/>

      {/* Lace panel */}
      <path d={LACE_PANEL} fill={darken(colors.main,12)} stroke={darken(colors.main,24)} strokeWidth="1" opacity="0.7"/>
      {/* Laces */}
      {[90,115,140,165,190,215,240,265].map((y,i)=>{const lx=215-i*0.5,rx=317+i*0.5,wd=i%2===0?-2:2;return(<g key={y}><path d={`M ${lx},${y} C ${lx+14},${y+wd} ${rx-14},${y-wd} ${rx},${y}`} stroke={colors.detail||"#ccc"} strokeWidth="3" fill="none" strokeLinecap="round"/><circle cx={lx} cy={y} r="5" fill={darken(colors.main,35)} stroke="#aaa" strokeWidth="1"/><circle cx={rx} cy={y} r="5" fill={darken(colors.main,35)} stroke="#aaa" strokeWidth="1"/></g>);})}
      {/* Collar */}
      <path d="M 167,75 C 170,60 185,52 266,50 C 347,52 362,60 365,75" stroke={darken(colors.main,25)} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Speed hooks */}
      {[100,120,140].map(y=>(<g key={y}><path d={`M ${212},${y} L ${206},${y-3} L ${206},${y+3}`} stroke={colors.accent} strokeWidth="2" fill="none"/><path d={`M ${320},${y} L ${326},${y-3} L ${326},${y+3}`} stroke={colors.accent} strokeWidth="2" fill="none"/></g>))}

      
    </svg>
  );
}
