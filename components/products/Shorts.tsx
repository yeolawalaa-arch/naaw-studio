"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Shorts({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `sq${Math.random().toString(36).slice(2,5)}`;
  const LEFT_LEG = `M 120,80 L 80,320 L 180,330 L 250,200 L 250,80 Z`;
  const RIGHT_LEG = `M 380,80 L 420,320 L 320,330 L 250,200 L 250,80 Z`;
  const WAISTBAND = `M 115,65 L 385,65 L 390,95 L 110,95 Z`;
  const BODY = `M 115,80 L 250,80 L 385,80 L 390,95 L 250,200 L 110,95 Z`;

  return (
    <svg viewBox="0 0 500 370" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}lg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/>
          <stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <linearGradient id={`${u}rg`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,5)}/>
          <stop offset="100%" stopColor={darken(colors.main,25)}/>
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
      <line x1="250" y1="80" x2="250" y2="200" stroke={darken(colors.main,25)} strokeWidth="1.5" strokeDasharray="4,4"/>

      {/* Waistband */}
      <path d={WAISTBAND} fill={colors.secondary || colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1.5"/>
      {/* Drawstring */}
      <line x1="195" y1="80" x2="180" y2="95" stroke={darken(colors.accent,10)} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="305" y1="80" x2="320" y2="95" stroke={darken(colors.accent,10)} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="195" cy="80" r="4" fill={darken(colors.accent,20)}/>
      <circle cx="305" cy="80" r="4" fill={darken(colors.accent,20)}/>

      {/* Side stripe */}
      <line x1="120" y1="95" x2="82" y2="318" stroke={colors.accent} strokeWidth="5" strokeLinecap="round" opacity="0.7"/>
      <line x1="380" y1="95" x2="418" y2="318" stroke={colors.accent} strokeWidth="5" strokeLinecap="round" opacity="0.7"/>

      
    </svg>
  );
}
