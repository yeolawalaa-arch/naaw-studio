"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Anarkali({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `an${Math.random().toString(36).slice(2,5)}`;
  // Fitted bodice flaring into a floor-length frock
  const FROCK = `M 205,160 L 295,160 L 300,210 C 360,250 392,360 392,452 C 330,470 170,470 108,452 C 108,360 140,250 200,210 Z`;
  const BODICE = `M 188,92 L 200,160 L 300,160 L 312,92 C 294,114 274,124 250,124 C 226,124 206,114 188,92 Z`;
  const SLEEVE_L = `M 188,92 C 158,84 140,98 134,128 L 128,250 L 168,258 L 184,150 C 186,120 187,102 188,92 Z`;
  const SLEEVE_R = `M 312,92 C 342,84 360,98 366,128 L 372,250 L 332,258 L 316,150 C 314,120 313,102 312,92 Z`;

  return (
    <svg viewBox="0 0 500 490" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="45%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,16)}/><stop offset="100%" stopColor={darken(colors.main,26)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}fc`}><path d={FROCK}/></clipPath>
      </defs>

      <path d={SLEEVE_L} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={SLEEVE_R} fill={`url(#${u}bg)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d={FROCK} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={FROCK} colors={colors} pattern={pattern} clipId={`${u}fc`} intensity={patternIntensity} zone={patternZone} viewBox={{x:108,y:160,w:284,h:300}}/>
      {/* Flare pleat lines */}
      {[150,200,250,300,350].map((x,i)=>(<line key={i} x1="250" y1="200" x2={x} y2="458" stroke={darken(colors.main,28)} strokeWidth="1" opacity="0.35"/>))}
      {/* Yoke + embroidery */}
      <path d={BODICE} fill={darken(colors.secondary,4)} stroke={darken(colors.accent,24)} strokeWidth="1.5"/>
      <path d="M 206,96 C 224,124 236,136 250,136 C 264,136 276,124 294,96" fill="none" stroke={colors.accent} strokeWidth="4"/>
      <rect x="200" y="156" width="100" height="12" fill={colors.accent} opacity="0.9"/>
      {/* Gold hem */}
      <path d="M 108,452 C 170,470 330,470 392,452" fill="none" stroke={colors.accent} strokeWidth="9" strokeLinecap="round"/>
    </svg>
  );
}
