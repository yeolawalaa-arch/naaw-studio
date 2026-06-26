"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Joggers({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `jg${Math.random().toString(36).slice(2,5)}`;
  const LEFT_LEG = `M 118,82 L 70,380 C 75,396 130,402 165,400 L 185,240 L 250,200 L 250,82 Z`;
  const RIGHT_LEG = `M 382,82 L 430,380 C 425,396 370,402 335,400 L 315,240 L 250,200 L 250,82 Z`;

  return (
    <svg viewBox="0 0 500 440" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}lg`} x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/>
          <stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <linearGradient id={`${u}rg`} x1="100%" y1="0%" x2="20%" y2="100%">
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

      {/* Waistband */}
      <rect x="108" y="62" width="284" height="30" rx="4" fill={colors.secondary || colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1.5"/>
      <line x1="210" y1="70" x2="195" y2="92" stroke={darken(colors.accent,10)} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="290" y1="70" x2="305" y2="92" stroke={darken(colors.accent,10)} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="210" cy="70" r="4" fill={darken(colors.accent,20)}/>
      <circle cx="290" cy="70" r="4" fill={darken(colors.accent,20)}/>

      {/* Ankle cuff */}
      <path d="M 72,378 C 68,390 72,400 120,404 C 158,407 175,402 180,394 L 165,398 C 130,400 80,396 72,378 Z" fill={colors.secondary || colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1"/>
      <path d="M 428,378 C 432,390 428,400 380,404 C 342,407 325,402 320,394 L 335,398 C 370,400 420,396 428,378 Z" fill={colors.secondary || colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1"/>

      {/* Side stripe */}
      <line x1="118" y1="92" x2="73" y2="376" stroke={colors.accent} strokeWidth="5" strokeLinecap="round" opacity="0.65"/>
      <line x1="382" y1="92" x2="427" y2="376" stroke={colors.accent} strokeWidth="5" strokeLinecap="round" opacity="0.65"/>

      <line x1="250" y1="82" x2="250" y2="200" stroke={darken(colors.main,22)} strokeWidth="1.5" strokeDasharray="4,4"/>
    </svg>
  );
}
