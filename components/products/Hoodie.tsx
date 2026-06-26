"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Hoodie({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `hd${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 158,118 L 72,155 L 50,230 L 100,238 L 100,420 L 400,420 L 400,238 L 450,230 L 428,155 L 342,118 C 318,140 295,152 250,152 C 205,152 182,140 158,118 Z`;
  const SLEEVE_L = `M 158,118 C 130,104 85,106 66,155 L 44,236 L 100,246 L 120,172 C 132,138 148,120 158,118 Z`;
  const SLEEVE_R = `M 342,118 C 370,104 415,106 434,155 L 456,236 L 400,246 L 380,172 C 368,138 352,120 342,118 Z`;
  const HOOD = `M 158,118 C 158,70 182,42 250,38 C 318,42 342,70 342,118 C 320,105 295,98 250,98 C 205,98 180,105 158,118 Z`;
  const POCKET = `M 170,310 C 170,295 182,285 250,285 C 318,285 330,295 330,310 L 330,370 C 330,380 318,386 250,386 C 182,386 170,380 170,370 Z`;
  const DRAWSTRING_L = `M 220,98 L 200,152`;
  const DRAWSTRING_R = `M 280,98 L 300,152`;

  return (
    <svg viewBox="0 0 500 460" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/>
          <stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <linearGradient id={`${u}sg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,8)}/>
          <stop offset="100%" stopColor={darken(colors.main,26)}/>
        </linearGradient>
        <linearGradient id={`${u}hg`} x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,5)}/>
          <stop offset="100%" stopColor={darken(colors.main,20)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
        <clipPath id={`${u}slc`}><path d={SLEEVE_L}/></clipPath>
        <clipPath id={`${u}src`}><path d={SLEEVE_R}/></clipPath>
        <clipPath id={`${u}hc`}><path d={HOOD}/></clipPath>
      </defs>

      <path d={SLEEVE_L} fill={`url(#${u}sg)`} stroke={darken(colors.main,32)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SLEEVE_L} colors={colors} pattern={pattern} clipId={`${u}slc`}/>

      <path d={SLEEVE_R} fill={`url(#${u}sg)`} stroke={darken(colors.main,32)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SLEEVE_R} colors={colors} pattern={pattern} clipId={`${u}src`}/>

      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`}/>

      <path d={POCKET} fill={darken(colors.main,14)} stroke={darken(colors.main,30)} strokeWidth="1.5"/>
      <line x1="250" y1="285" x2="250" y2="386" stroke={darken(colors.main,30)} strokeWidth="1.2"/>

      <path d={HOOD} fill={`url(#${u}hg)`} stroke={darken(colors.main,30)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={HOOD} colors={colors} pattern={pattern} clipId={`${u}hc`}/>

      <path d={DRAWSTRING_L} stroke={colors.accent} strokeWidth="3" strokeLinecap="round"/>
      <path d={DRAWSTRING_R} stroke={colors.accent} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="200" cy="154" r="5" fill={colors.accent}/>
      <circle cx="300" cy="154" r="5" fill={colors.accent}/>

      <text x="250" y="268" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="22" fontWeight="900" fontFamily="Arial" letterSpacing="5">NAAW</text>
    </svg>
  );
}
