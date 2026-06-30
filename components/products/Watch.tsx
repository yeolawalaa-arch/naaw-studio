"use client";
import { ProductColors } from "../ProductCanvas";
import { lighten, darken } from "../patternUtils";

export default function Watch({ colors }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `wa${Math.random().toString(36).slice(2,5)}`;
  return (
    <svg viewBox="0 0 500 430" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        <linearGradient id={`${u}st`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darken(colors.main,18)}/><stop offset="50%" stopColor={lighten(colors.main,10)}/><stop offset="100%" stopColor={darken(colors.main,18)}/>
        </linearGradient>
        <radialGradient id={`${u}cs`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={lighten(colors.detail,40)}/><stop offset="100%" stopColor={darken(colors.detail,18)}/>
        </radialGradient>
        <radialGradient id={`${u}dl`} cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor={lighten(colors.secondary,14)}/><stop offset="100%" stopColor={darken(colors.secondary,24)}/>
        </radialGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.55"/></filter>
      </defs>

      {/* Straps */}
      <path d="M 212,52 L 288,52 L 282,162 L 218,162 Z" fill={`url(#${u}st)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <path d="M 218,268 L 282,268 L 288,378 L 212,378 Z" fill={`url(#${u}st)`} stroke={darken(colors.main,30)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      {[78,108,300,330].map((y,i)=>(<line key={i} x1="220" y1={y} x2="280" y2={y} stroke={darken(colors.main,28)} strokeWidth="2" opacity="0.5"/>))}
      {/* Crown */}
      <rect x="326" y="204" width="22" height="22" rx="4" fill={`url(#${u}cs)`} stroke={darken(colors.detail,24)} strokeWidth="1"/>
      {/* Case + bezel */}
      <circle cx="250" cy="215" r="86" fill={`url(#${u}cs)`} stroke={darken(colors.detail,24)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <circle cx="250" cy="215" r="86" fill="none" stroke={colors.accent} strokeWidth="3" opacity="0.8"/>
      {/* Dial */}
      <circle cx="250" cy="215" r="64" fill={`url(#${u}dl)`} stroke={darken(colors.secondary,28)} strokeWidth="1.5"/>
      {/* Hour markers */}
      {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return(<line key={i} x1={250+Math.sin(a)*58} y1={215-Math.cos(a)*58} x2={250+Math.sin(a)*50} y2={215-Math.cos(a)*50} stroke={colors.accent} strokeWidth={i%3===0?3:1.5}/>);})}
      {/* Hands */}
      <line x1="250" y1="215" x2="250" y2="178" stroke={colors.accent} strokeWidth="4" strokeLinecap="round"/>
      <line x1="250" y1="215" x2="286" y2="226" stroke={colors.accent} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="250" cy="215" r="5" fill={colors.detail}/>
    </svg>
  );
}
