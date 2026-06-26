"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function SlipOn({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `so${Math.random().toString(36).slice(2,5)}`;
  const UPPER = `M 40,230 C 36,210 36,186 44,162 C 52,138 72,118 104,106 C 136,94 178,90 224,90 C 270,90 325,95 375,112 C 415,126 440,148 450,174 C 458,196 456,220 452,235 Z`;
  const COLLAR = `M 220,90 C 230,80 260,76 286,82 C 278,92 270,100 265,110 L 248,105 L 224,90 Z`;
  const MIDSOLE = `M 36,235 L 38,255 L 456,255 L 454,235 Z`;
  const OUTSOLE = `M 36,255 L 34,268 C 34,276 44,282 66,285 C 110,291 190,294 248,294 C 320,294 408,290 444,284 C 462,280 468,272 466,264 L 454,255 Z`;
  const ELASTIC_L = `M 218,90 C 222,84 228,80 228,90 L 228,108 C 222,108 216,108 216,100 Z`;
  const ELASTIC_R = `M 282,90 C 278,84 272,80 272,90 L 272,108 C 278,108 284,108 284,100 Z`;

  return (
    <svg viewBox="0 0 500 310" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}ug`} x1="0%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,20)}/><stop offset="100%" stopColor={darken(colors.main,24)}/>
        </linearGradient>
        <linearGradient id={`${u}mg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.lining||"#fff",20)}/><stop offset="100%" stopColor={darken(colors.lining||"#fff",8)}/>
        </linearGradient>
        <linearGradient id={`${u}sg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.secondary||"#111",5)}/><stop offset="100%" stopColor={darken(colors.secondary||"#111",28)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="5" stdDeviation="9" floodColor="#000" floodOpacity="0.6"/></filter>
        <filter id={`${u}bl`}><feGaussianBlur stdDeviation="6"/></filter>
        <clipPath id={`${u}uc`}><path d={UPPER}/></clipPath>
      </defs>
      <ellipse cx="250" cy="300" rx="220" ry="9" fill="#000" opacity="0.5" filter={`url(#${u}bl)`}/>
      <path d={OUTSOLE} fill={`url(#${u}sg)`}/>
      {Array.from({length:9},(_,i)=>(<rect key={i} x={50+i*44} y="268" width="32" height="7" rx="2" fill={darken(colors.secondary||"#111",30)} opacity="0.65"/>))}
      <path d={MIDSOLE} fill={`url(#${u}mg)`} stroke={darken(colors.lining||"#fff",16)} strokeWidth="1.2"/>
      <path d={UPPER} fill={`url(#${u}ug)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={UPPER} colors={colors} pattern={pattern} clipId={`${u}uc`}/>
      {/* Elastic side panels */}
      <path d={ELASTIC_L} fill={darken(colors.main,10)} stroke={darken(colors.main,24)} strokeWidth="1"/>
      <path d={ELASTIC_R} fill={darken(colors.main,10)} stroke={darken(colors.main,24)} strokeWidth="1"/>
      {/* Elastic lines */}
      {[94,100,106].map(y=>(<line key={y} x1="216" y1={y} x2="284" y2={y} stroke={darken(colors.main,20)} strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>))}
      <path d={COLLAR} fill={darken(colors.main,15)} stroke={darken(colors.main,30)} strokeWidth="1.5"/>
      {/* Brand side print */}
      
    </svg>
  );
}
