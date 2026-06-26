"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function SneakerHigh({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `sh2${Math.random().toString(36).slice(2,5)}`;
  const UPPER = `M 30,290 C 28,268 28,242 36,214 C 46,182 70,158 104,140 C 136,122 174,112 220,108 C 248,106 268,108 284,118 C 274,130 266,148 264,170 L 262,205 C 282,180 310,162 344,152 C 382,140 428,136 472,142 C 506,148 528,162 542,182 C 556,202 562,228 560,255 L 558,290 Z`;
  const ANKLE = `M 284,118 C 278,110 268,105 258,104 C 248,103 238,106 230,112 C 222,108 268,108 284,118 Z M 230,112 L 225,145 L 264,170 L 275,130 Z`;
  const HEEL = `M 462,290 L 464,145 C 498,138 528,150 548,168 C 564,184 568,208 566,238 L 558,290 Z`;
  const COLLAR = `M 230,112 C 238,106 248,103 258,104 C 268,105 278,110 284,118 L 280,108 C 270,98 255,94 245,96 C 235,98 226,104 220,112 Z`;
  const STRIPE = `M 148,278 C 196,254 264,232 338,220 C 386,212 432,210 468,216 C 492,220 508,230 514,242 C 495,246 472,248 444,248 C 398,248 338,258 278,278 C 224,296 172,314 152,302 C 146,296 142,288 148,278 Z`;
  const TONGUE = `M 250,290 L 252,200 C 254,182 262,168 274,162 C 284,156 296,156 306,162 C 316,168 322,182 323,200 L 324,290 Z`;
  const LACE_ZONE = `M 230,148 L 322,165`;
  const MIDSOLE = `M 26,290 L 28,312 L 562,312 L 560,290 Z`;
  const OUTSOLE = `M 26,312 L 24,325 C 24,334 32,340 52,344 C 104,350 208,353 324,353 C 424,353 518,350 570,346 C 590,342 600,336 600,328 L 562,312 Z`;

  return (
    <svg viewBox="0 0 640 368" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
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
        <linearGradient id={`${u}ag`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.accent,20)}/><stop offset="100%" stopColor={darken(colors.accent,20)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="5" stdDeviation="9" floodColor="#000" floodOpacity="0.6"/></filter>
        <filter id={`${u}bl`}><feGaussianBlur stdDeviation="7"/></filter>
        <clipPath id={`${u}uc`}><path d={UPPER}/></clipPath>
      </defs>
      <ellipse cx="320" cy="357" rx="278" ry="10" fill="#000" opacity="0.5" filter={`url(#${u}bl)`}/>
      <path d={OUTSOLE} fill={`url(#${u}sg)`}/>
      {Array.from({length:12},(_,i)=>(<rect key={i} x={40+i*46} y="328" width="34" height="7" rx="2" fill={darken(colors.secondary||"#111",30)} opacity="0.65"/>))}
      <path d={MIDSOLE} fill={`url(#${u}mg)`} stroke={darken(colors.lining||"#fff",16)} strokeWidth="1.2"/>
      <path d={UPPER} fill={`url(#${u}ug)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={UPPER} colors={colors} pattern={pattern} clipId={`${u}uc`}/>
      <path d={HEEL} fill={darken(colors.main,18)} stroke={darken(colors.main,32)} strokeWidth="1.4" opacity="0.92"/>
      <path d={STRIPE} fill={`url(#${u}ag)`} stroke={darken(colors.accent,16)} strokeWidth="1.2"/>
      <path d={TONGUE} fill={darken(colors.main,5)} stroke={darken(colors.main,24)} strokeWidth="1.4"/>
      <rect x="264" y="230" width="56" height="22" rx="3" fill={darken(colors.main,26)} opacity="0.78"/>
      
      {/* Ankle strap */}
      <path d="M 225,148 L 322,165" stroke={darken(colors.main,18)} strokeWidth="8" strokeLinecap="round"/>
      {/* Laces — two zones */}
      {[0,1,2,3,4,5,6,7].map(i=>{const y=170+i*15,lx=258-i*0.8,rx=310+i*0.8,wd=i%2===0?-2:2;return(<g key={i}><path d={`M ${lx},${y} C ${lx+12},${y+wd} ${rx-12},${y-wd} ${rx},${y}`} stroke={colors.detail||"#fff"} strokeWidth="2.8" fill="none" strokeLinecap="round"/><circle cx={lx} cy={y} r="3.8" fill={darken(colors.main,34)} stroke="#bbb" strokeWidth="0.9"/><circle cx={lx} cy={y} r="1.8" fill="#888"/><circle cx={rx} cy={y} r="3.8" fill={darken(colors.main,34)} stroke="#bbb" strokeWidth="0.9"/><circle cx={rx} cy={y} r="1.8" fill="#888"/></g>);})}
    </svg>
  );
}
