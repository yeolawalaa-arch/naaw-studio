"use client";
import { ProductColors } from "../ProductCanvas";
import { lighten, darken } from "../patternUtils";

export default function Earrings({ colors }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `er${Math.random().toString(36).slice(2,5)}`;
  const one = (cx: number, key: string) => (
    <g key={key}>
      {/* Hook / stud top */}
      <circle cx={cx} cy="86" r="9" fill={`url(#${u}mk)`} stroke={darken(colors.accent,24)} strokeWidth="1.5"/>
      {/* Connector */}
      <line x1={cx} y1="95" x2={cx} y2="128" stroke={`url(#${u}mk)`} strokeWidth="4"/>
      {/* Teardrop gem */}
      <path d={`M ${cx},126 C ${cx-46},170 ${cx-40},250 ${cx},290 C ${cx+40},250 ${cx+46},170 ${cx},126 Z`} fill={`url(#${u}gem)`} stroke={darken(colors.secondary,26)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <path d={`M ${cx},150 C ${cx-22},182 ${cx-20},240 ${cx},268 C ${cx+20},240 ${cx+22},182 ${cx},150 Z`} fill={lighten(colors.secondary,22)} opacity="0.5"/>
      {/* Halo dots */}
      {Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2;return(<circle key={i} cx={cx+Math.cos(a)*52} cy={208+Math.sin(a)*82} r="3.5" fill={`url(#${u}mk)`}/>);})}
    </g>
  );
  return (
    <svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        <radialGradient id={`${u}mk`} cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor={lighten(colors.accent,42)}/><stop offset="100%" stopColor={darken(colors.accent,20)}/>
        </radialGradient>
        <radialGradient id={`${u}gem`} cx="40%" cy="28%" r="82%">
          <stop offset="0%" stopColor={lighten(colors.secondary,34)}/><stop offset="60%" stopColor={colors.secondary}/><stop offset="100%" stopColor={darken(colors.secondary,24)}/>
        </radialGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#000" floodOpacity="0.5"/></filter>
      </defs>
      {one(170, "L")}
      {one(330, "R")}
    </svg>
  );
}
