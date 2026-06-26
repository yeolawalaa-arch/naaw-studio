"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Shirt({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `sh${Math.random().toString(36).slice(2,5)}`;
  const BODY = `M 155,95 L 75,130 L 55,195 L 100,205 L 100,400 L 400,400 L 400,205 L 445,195 L 425,130 L 345,95 C 320,115 295,126 250,126 C 205,126 180,115 155,95 Z`;
  const SLEEVE_L = `M 155,95 C 130,82 88,86 70,130 L 50,200 L 100,210 L 118,148 C 130,116 145,98 155,95 Z`;
  const SLEEVE_R = `M 345,95 C 370,82 412,86 430,130 L 450,200 L 400,210 L 382,148 C 370,116 355,98 345,95 Z`;
  const COLLAR_L = `M 250,70 C 220,70 195,80 175,95 L 222,125 Z`;
  const COLLAR_R = `M 250,70 C 280,70 305,80 325,95 L 278,125 Z`;
  const PLACKET = `M 244,125 L 244,400 L 256,400 L 256,125 Z`;

  return (
    <svg viewBox="0 0 500 440" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}bg`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/>
          <stop offset="100%" stopColor={darken(colors.main,22)}/>
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

      <path d={SLEEVE_L} fill={`url(#${u}sg)`} stroke={darken(colors.main,32)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SLEEVE_L} colors={colors} pattern={pattern} clipId={`${u}slc`}/>

      <path d={SLEEVE_R} fill={`url(#${u}sg)`} stroke={darken(colors.main,32)} strokeWidth="1.5" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={SLEEVE_R} colors={colors} pattern={pattern} clipId={`${u}src`}/>

      <path d={BODY} fill={`url(#${u}bg)`} stroke={darken(colors.main,28)} strokeWidth="2" filter={`url(#${u}ds)`}/>
      <PatternOverlay u={u} path={BODY} colors={colors} pattern={pattern} clipId={`${u}bc`}/>

      {/* Placket */}
      <path d={PLACKET} fill={darken(colors.main,10)} opacity="0.6"/>
      {/* Buttons */}
      {[155,195,235,275,315,355].map(y => (
        <circle key={y} cx="250" cy={y} r="5" fill={colors.secondary || darken(colors.main,30)} stroke={darken(colors.main,40)} strokeWidth="1"/>
      ))}
      {/* Collar */}
      <path d={COLLAR_L} fill={lighten(colors.main,8)} stroke={darken(colors.main,30)} strokeWidth="1.5"/>
      <path d={COLLAR_R} fill={lighten(colors.main,8)} stroke={darken(colors.main,30)} strokeWidth="1.5"/>
      {/* Collar seam */}
      <line x1="250" y1="70" x2="250" y2="126" stroke={darken(colors.main,30)} strokeWidth="1"/>
      {/* Pocket */}
      <rect x="116" y="225" width="56" height="52" rx="3" fill={darken(colors.main,12)} stroke={darken(colors.main,28)} strokeWidth="1.2"/>

      
    </svg>
  );
}
