"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function SneakerLow({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `sl${Math.random().toString(36).slice(2,5)}`;
  const UPPER = `M 30,242 C 28,220 28,194 36,170 C 46,144 66,122 96,108 C 126,94 166,88 212,86 C 238,85 260,87 274,97 C 264,109 256,125 254,143 L 252,158 C 270,138 296,122 326,112 C 362,100 406,94 452,94 C 492,94 530,98 558,108 C 578,118 590,140 592,170 C 594,198 592,224 590,242 Z`;
  const HEEL = `M 452,242 L 454,96 C 490,92 528,98 556,110 C 576,120 590,142 592,170 L 590,242 Z`;
  const TOE = `M 30,242 C 28,220 30,196 38,174 C 46,152 62,134 86,120 C 100,114 116,110 136,110 L 144,112 C 136,128 130,148 128,170 L 126,242 Z`;
  const STRIPE = `M 136,230 C 184,208 248,188 318,178 C 366,170 412,168 446,174 C 468,178 484,186 490,196 C 472,200 450,202 422,202 C 378,202 322,210 264,228 C 212,244 164,260 144,250 C 138,244 134,238 136,230 Z`;
  const TONGUE = `M 238,242 L 240,156 C 241,140 249,128 260,122 C 269,118 280,118 289,122 C 298,128 304,140 305,156 L 306,242 Z`;
  const MIDSOLE = `M 26,242 L 28,262 L 598,262 L 596,242 Z`;
  const OUTSOLE = `M 26,262 L 24,274 C 24,282 32,288 50,291 C 100,297 200,300 320,300 C 420,300 508,298 562,294 C 586,291 598,285 598,277 L 596,262 Z`;

  return (
    <svg viewBox="0 0 640 310" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}ug`} x1="0%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,20)}/><stop offset="100%" stopColor={darken(colors.main,24)}/>
        </linearGradient>
        <linearGradient id={`${u}mg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.lining||"#ffffff",20)}/><stop offset="100%" stopColor={darken(colors.lining||"#ffffff",8)}/>
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

      <ellipse cx="320" cy="305" rx="278" ry="10" fill="#000" opacity="0.5" filter={`url(#${u}bl)`}/>
      <path d={OUTSOLE} fill={`url(#${u}sg)`}/>
      {Array.from({length:12},(_,i)=>(<rect key={i} x={40+i*46} y="276" width="34" height="7" rx="2" fill={darken(colors.secondary||"#111",30)} opacity="0.65"/>))}
      <path d={MIDSOLE} fill={`url(#${u}mg)`} stroke={darken(colors.lining||"#fff",16)} strokeWidth="1.2"/>
      <path d={UPPER} fill={`url(#${u}ug)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={UPPER} colors={colors} pattern={pattern} clipId={`${u}uc`}/>
      <path d={HEEL} fill={darken(colors.main,18)} stroke={darken(colors.main,32)} strokeWidth="1.4" opacity="0.92"/>
      <path d={TOE} fill={lighten(colors.main,16)} stroke={darken(colors.main,22)} strokeWidth="1.4"/>
      <path d={STRIPE} fill={`url(#${u}ag)`} stroke={darken(colors.accent,16)} strokeWidth="1.2"/>
      <path d={TONGUE} fill={darken(colors.main,5)} stroke={darken(colors.main,24)} strokeWidth="1.4"/>
      <rect x="246" y="196" width="52" height="22" rx="3" fill={darken(colors.main,26)} opacity="0.78"/>
      <text x="272" y="211" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="bold" fontFamily="Arial" letterSpacing="2" opacity="0.9">NAAW</text>
      <path d="M 238,220 C 230,206 226,190 230,178 C 234,168 242,164 252,166" stroke={darken(colors.main,24)} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {[0,1,2,3,4,5].map(i=>{const y=165+i*14,lx=250-i,rx=294+i,wd=i%2===0?-2.5:2.5;return(<g key={i}><path d={`M ${lx},${y} C ${lx+14},${y+wd} ${rx-14},${y-wd} ${rx},${y}`} stroke={colors.detail||"#fff"} strokeWidth="3" fill="none" strokeLinecap="round"/><circle cx={lx} cy={y} r="4" fill={darken(colors.main,35)} stroke="#bbb" strokeWidth="0.9"/><circle cx={lx} cy={y} r="2" fill="#888"/><circle cx={rx} cy={y} r="4" fill={darken(colors.main,35)} stroke="#bbb" strokeWidth="0.9"/><circle cx={rx} cy={y} r="2" fill="#888"/></g>);})}
    </svg>
  );
}
