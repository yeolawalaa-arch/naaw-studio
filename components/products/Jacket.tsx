"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Jacket({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `jk${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 155,105 L 68,148 L 46,240 L 100,250 L 100,420 L 400,420 L 400,250 L 454,240 L 432,148 L 345,105 C 322,125 296,136 250,136 C 204,136 178,125 155,105 Z`;
  const SLEEVE_L = `M 155,105 C 124,88 78,92 62,148 L 38,248 L 100,260 L 118,178 C 130,138 146,112 155,105 Z`;
  const SLEEVE_R = `M 345,105 C 376,88 422,92 438,148 L 462,248 L 400,260 L 382,178 C 370,138 354,112 345,105 Z`;
  const COLLAR = `M 155,105 C 172,88 205,78 250,76 C 295,78 328,88 345,105 C 325,115 295,122 250,122 C 205,122 175,115 155,105 Z`;
  const ZIP = `M 248,122 L 248,420 L 252,420 L 252,122 Z`;
  const POCKET_L = `M 108,285 L 108,330 L 196,330 L 196,285 Z`;
  const POCKET_R = `M 304,285 L 304,330 L 392,330 L 392,285 Z`;

  return (
    <svg viewBox="0 0 500 460" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,20)}/>
          <stop offset="100%" stopColor={darken(colors.main,24)}/>
        </linearGradient>
        <linearGradient id={`${u}sg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,10)}/>
          <stop offset="100%" stopColor={darken(colors.main,30)}/>
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

      <path d={COLLAR} fill={colors.secondary || darken(colors.main,10)} stroke={darken(colors.main,30)} strokeWidth="1.5"/>
      <path d={ZIP} fill={darken(colors.main,15)} opacity="0.7"/>
      {[155,185,215,245,275,305,335,365,395].map(y => (
        <rect key={y} x="246" y={y} width="8" height="6" rx="1" fill={colors.accent} opacity="0.7"/>
      ))}
      <path d={POCKET_L} fill={darken(colors.main,14)} stroke={darken(colors.main,28)} strokeWidth="1.2" rx="3"/>
      <path d={POCKET_R} fill={darken(colors.main,14)} stroke={darken(colors.main,28)} strokeWidth="1.2" rx="3"/>

      {/* Accent stripe on sleeve */}
      <path d="M 60,180 L 100,184" stroke={colors.accent} strokeWidth="5" strokeLinecap="round"/>
      <path d="M 440,180 L 400,184" stroke={colors.accent} strokeWidth="5" strokeLinecap="round"/>
      
    </svg>
  );
}
