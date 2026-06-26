"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Jeans({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `jn${Math.random().toString(36).slice(2,5)}`;
  const LEFT_LEG = `M 118,90 L 82,430 L 178,435 L 200,250 L 250,210 L 250,90 Z`;
  const RIGHT_LEG = `M 382,90 L 418,430 L 322,435 L 300,250 L 250,210 L 250,90 Z`;
  const WAISTBAND = `M 108,68 L 392,68 L 395,100 L 105,100 Z`;

  return (
    <svg viewBox="0 0 500 470" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}lg`} x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/>
          <stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <linearGradient id={`${u}rg`} x1="100%" y1="0%" x2="20%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,5)}/>
          <stop offset="100%" stopColor={darken(colors.main,28)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}llc`}><path d={LEFT_LEG}/></clipPath>
        <clipPath id={`${u}rlc`}><path d={RIGHT_LEG}/></clipPath>
      </defs>

      <path d={LEFT_LEG} fill={`url(#${u}lg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={LEFT_LEG} colors={colors} pattern={pattern} clipId={`${u}llc`}/>
      <path d={RIGHT_LEG} fill={`url(#${u}rg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={RIGHT_LEG} colors={colors} pattern={pattern} clipId={`${u}rlc`}/>

      {/* Crotch seam */}
      <line x1="250" y1="90" x2="250" y2="210" stroke={darken(colors.main,22)} strokeWidth="1.5" strokeDasharray="4,4"/>

      {/* Waistband */}
      <path d={WAISTBAND} fill={darken(colors.main,14)} stroke={darken(colors.main,30)} strokeWidth="1.5"/>
      {/* Belt loops */}
      {[135,185,248,315,365].map(x => (
        <rect key={x} x={x-6} y="68" width="12" height="26" rx="2" fill={darken(colors.main,20)} stroke={darken(colors.main,35)} strokeWidth="1"/>
      ))}
      {/* Fly */}
      <line x1="250" y1="100" x2="250" y2="145" stroke={darken(colors.main,28)} strokeWidth="2"/>
      {/* Fly button */}
      <circle cx="250" cy="83" r="5" fill={darken(colors.main,30)} stroke={darken(colors.main,40)} strokeWidth="1"/>

      {/* Pocket stitch */}
      <path d="M 128,108 C 115,125 112,155 118,180" stroke="rgba(255,215,0,0.35)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 372,108 C 385,125 388,155 382,180" stroke="rgba(255,215,0,0.35)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Back pocket stitch */}
      <path d="M 142,178 L 155,195 L 148,215" stroke="rgba(255,215,0,0.3)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
