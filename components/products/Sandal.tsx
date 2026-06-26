"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Sandal({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `sd${Math.random().toString(36).slice(2,5)}`;
  const SOLE = `M 60,290 C 55,278 55,268 65,262 L 440,262 C 450,268 450,278 445,290 C 420,308 340,316 250,316 C 160,316 80,308 60,290 Z`;
  const FOOTBED = `M 65,262 L 440,262 L 438,272 L 67,272 Z`;
  const STRAP_TOE = `M 140,210 C 140,200 148,194 160,192 L 340,192 C 352,194 360,200 360,210 L 360,230 C 360,238 352,244 340,246 L 160,246 C 148,244 140,238 140,230 Z`;
  const STRAP_ANKLE = `M 115,240 C 105,232 105,220 115,214 L 145,208 L 145,248 Z`;
  const STRAP_ANKLE_R = `M 385,240 C 395,232 395,220 385,214 L 355,208 L 355,248 Z`;
  const STRAP_MID = `M 175,170 C 175,160 182,155 195,153 L 305,153 C 318,155 325,160 325,170 L 325,195 C 325,202 318,207 305,207 L 195,207 C 182,207 175,202 175,195 Z`;

  return (
    <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}sol`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.secondary||"#8B7355",10)}/><stop offset="100%" stopColor={darken(colors.secondary||"#8B7355",20)}/>
        </linearGradient>
        <linearGradient id={`${u}str`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/><stop offset="100%" stopColor={darken(colors.main,20)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.55"/></filter>
        <clipPath id={`${u}tc`}><path d={STRAP_TOE}/></clipPath>
        <clipPath id={`${u}mc`}><path d={STRAP_MID}/></clipPath>
      </defs>
      <path d={SOLE} fill={`url(#${u}sol)`} stroke={darken(colors.secondary||"#8B7355",30)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      {Array.from({length:10},(_,i)=>(<line key={i} x1={80+i*36} y1="292" x2={80+i*36} y2="310" stroke={darken(colors.secondary||"#8B7355",35)} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>))}
      <path d={FOOTBED} fill={lighten(colors.secondary||"#8B7355",10)} stroke={darken(colors.secondary||"#8B7355",20)} strokeWidth="1"/>
      <path d={STRAP_ANKLE} fill={`url(#${u}str)`} stroke={darken(colors.main,28)} strokeWidth="1.5"/>
      <path d={STRAP_ANKLE_R} fill={`url(#${u}str)`} stroke={darken(colors.main,28)} strokeWidth="1.5"/>
      <path d={STRAP_MID} fill={`url(#${u}str)`} stroke={darken(colors.main,28)} strokeWidth="1.5"/>
      <PatternOverlay u={u} path={STRAP_MID} colors={colors} pattern={pattern} clipId={`${u}mc`}/>
      <path d={STRAP_TOE} fill={`url(#${u}str)`} stroke={darken(colors.main,28)} strokeWidth="1.5"/>
      <PatternOverlay u={u} path={STRAP_TOE} colors={colors} pattern={pattern} clipId={`${u}tc`}/>
      {/* Buckle */}
      <rect x="108" y="220" width="22" height="18" rx="3" fill={colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1.5"/>
      <line x1="119" y1="220" x2="119" y2="238" stroke={darken(colors.accent,20)} strokeWidth="1.5"/>
      
    </svg>
  );
}
