"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Kurta({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `ku${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 180,90 L 120,118 L 108,200 L 150,212 L 150,452 L 200,452 L 200,250 L 300,250 L 300,452 L 350,452 L 350,212 L 392,200 L 380,118 L 320,90 C 300,112 278,124 250,124 C 222,124 200,112 180,90 Z`;
  const BODY_FILL = `M 180,90 L 120,118 L 108,200 L 150,212 L 150,452 L 350,452 L 350,212 L 392,200 L 380,118 L 320,90 C 300,112 278,124 250,124 C 222,124 200,112 180,90 Z`;
  const SLEEVE_L = `M 180,90 C 150,80 128,92 120,118 L 108,200 L 150,212 L 165,150 C 170,120 175,100 180,90 Z`;
  const SLEEVE_R = `M 320,90 C 350,80 372,92 380,118 L 392,200 L 350,212 L 335,150 C 330,120 325,100 320,90 Z`;

  return (
    <svg viewBox="0 0 500 480" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,16)}/><stop offset="100%" stopColor={darken(colors.main,24)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}bc`}><path d={BODY_FILL}/></clipPath>
      </defs>

      <path d={SLEEVE_L} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={SLEEVE_R} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={BODY_FILL} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY_FILL} colors={colors} pattern={pattern} clipId={`${u}bc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:108,y:90,w:284,h:362}}/>
      {/* Mandarin collar */}
      <path d="M 205,92 C 222,108 250,114 250,114 C 250,114 278,108 295,92 C 282,80 266,74 250,74 C 234,74 218,80 205,92 Z" fill={darken(colors.accent,6)} stroke={darken(colors.accent,28)} strokeWidth="1.5"/>
      {/* Front placket + buttons */}
      <line x1="250" y1="114" x2="250" y2="250" stroke={darken(colors.main,34)} strokeWidth="2.5"/>
      {[140,176,212].map((y,i)=>(<circle key={i} cx="250" cy={y} r="4" fill={colors.accent} stroke={darken(colors.accent,30)} strokeWidth="1"/>))}
      {/* Side slits + hem trim */}
      <rect x="150" y="446" width="50" height="6" fill={colors.accent} opacity="0.85"/>
      <rect x="300" y="446" width="50" height="6" fill={colors.accent} opacity="0.85"/>
    </svg>
  );
}
