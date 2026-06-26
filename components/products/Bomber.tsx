"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Bomber({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `bm${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 152,112 L 62,158 L 42,250 L 100,258 L 100,390 C 100,402 170,412 250,412 C 330,412 400,402 400,390 L 400,258 L 458,250 L 438,158 L 348,112 C 325,130 296,140 250,140 C 204,140 175,130 152,112 Z`;
  const SLEEVE_L = `M 152,112 C 118,94 70,98 54,158 L 32,256 L 100,268 L 118,182 C 130,142 146,116 152,112 Z`;
  const SLEEVE_R = `M 348,112 C 382,94 430,98 446,158 L 468,256 L 400,268 L 382,182 C 370,142 354,116 348,112 Z`;
  const COLLAR = `M 152,112 C 175,92 208,84 250,82 C 292,84 325,92 348,112 C 325,128 294,136 250,136 C 206,136 175,128 152,112 Z`;
  const RIB_BOTTOM = `M 100,390 C 100,402 170,412 250,412 C 330,412 400,402 400,390 L 400,370 C 400,382 330,390 250,390 C 170,390 100,382 100,370 Z`;
  const RIB_SLEEVE_L = `M 38,248 C 30,256 30,266 38,272 L 98,280 L 100,268 Z`;
  const RIB_SLEEVE_R = `M 462,248 C 470,256 470,266 462,272 L 402,280 L 400,268 Z`;

  return (
    <svg viewBox="0 0 500 455" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,20)}/>
          <stop offset="100%" stopColor={darken(colors.main,24)}/>
        </linearGradient>
        <linearGradient id={`${u}sg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,8)}/>
          <stop offset="100%" stopColor={darken(colors.main,28)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY}/></clipPath>
        <clipPath id={`${u}slc`}><path d={SLEEVE_L}/></clipPath>
        <clipPath id={`${u}src`}><path d={SLEEVE_R}/></clipPath>
      </defs>

      <path d={SLEEVE_L} fill={`url(#${u}sg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SLEEVE_L} colors={colors} pattern={pattern} clipId={`${u}slc`}/>
      <path d={SLEEVE_R} fill={`url(#${u}sg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SLEEVE_R} colors={colors} pattern={pattern} clipId={`${u}src`}/>
      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`}/>

      {/* Ribbing */}
      <path d={RIB_BOTTOM} fill={colors.secondary || colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1"/>
      <path d={RIB_SLEEVE_L} fill={colors.secondary || colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1"/>
      <path d={RIB_SLEEVE_R} fill={colors.secondary || colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1"/>
      {/* Collar */}
      <path d={COLLAR} fill={colors.secondary || colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1.5"/>
      {/* Zip */}
      <line x1="250" y1="136" x2="250" y2="390" stroke={darken(colors.main,20)} strokeWidth="3"/>
      {[160,185,210,235,260,285,310,335,360].map(y => (
        <rect key={y} x="246" y={y} width="8" height="5" rx="1" fill={colors.detail || "#888"} opacity="0.8"/>
      ))}
      
    </svg>
  );
}
