"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function TShirt({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `ts${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 160,80 L 80,110 L 60,170 L 100,178 L 100,380 L 400,380 L 400,178 L 440,170 L 420,110 L 340,80 C 320,100 300,112 250,112 C 200,112 180,100 160,80 Z`;
  const SLEEVE_L = `M 160,80 C 140,70 100,72 80,110 L 60,170 L 100,178 L 118,128 C 130,100 148,86 160,80 Z`;
  const SLEEVE_R = `M 340,80 C 360,70 400,72 420,110 L 440,170 L 400,178 L 382,128 C 370,100 352,86 340,80 Z`;
  const COLLAR = `M 160,80 C 175,95 200,108 250,108 C 300,108 325,95 340,80 C 325,68 302,60 250,60 C 198,60 175,68 160,80 Z`;

  return (
    <svg viewBox="0 0 500 420" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/><stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <linearGradient id={`${u}sg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,8)}/><stop offset="100%" stopColor={darken(colors.main,28)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
        <clipPath id={`${u}slc`}><path d={SLEEVE_L}/></clipPath>
        <clipPath id={`${u}src`}><path d={SLEEVE_R}/></clipPath>
      </defs>

      <path d={SLEEVE_L} fill={`url(#${u}sg)`} stroke={darken(colors.main,32)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SLEEVE_L} colors={colors} pattern={pattern} clipId={`${u}slc`}/>
      <path d={SLEEVE_R} fill={`url(#${u}sg)`} stroke={darken(colors.main,32)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SLEEVE_R} colors={colors} pattern={pattern} clipId={`${u}src`}/>
      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`}/>
      <path d={COLLAR} fill={darken(colors.main,12)} stroke={darken(colors.main,32)} strokeWidth="1.5"/>
      <line x1="250" y1="108" x2="250" y2="380" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" strokeDasharray="6,6"/>
      <text x="250" y="270" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="28" fontWeight="900" fontFamily="Arial" letterSpacing="6">NAAW</text>
    </svg>
  );
}
