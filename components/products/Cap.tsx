"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Cap({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const u = `cp${Math.random().toString(36).slice(2,5)}`;
  const CROWN = `M 80,220 C 80,140 155,80 250,80 C 345,80 420,140 420,220 Z`;
  const BRIM = `M 60,228 C 50,232 42,240 44,252 C 46,262 58,268 90,270 L 440,270 C 460,268 470,260 468,250 C 466,240 456,232 440,228 Z`;
  const SWEATBAND = `M 82,222 L 418,222 L 420,230 L 80,230 Z`;
  const BUTTON = `M 250,82 C 255,78 262,78 265,82 C 262,88 255,90 250,88 Z`;
  const PANEL_L = `M 80,220 C 80,140 155,80 250,80 L 250,220 Z`;
  const PANEL_R = `M 250,220 L 250,80 C 345,80 420,140 420,220 Z`;
  const STITCH_L = `M 165,88 C 150,120 148,165 152,210`;
  const STITCH_R = `M 335,88 C 350,120 352,165 348,210`;

  return (
    <svg viewBox="0 0 500 310" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{background:"#111"}}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}lg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main,18)}/>
          <stop offset="100%" stopColor={darken(colors.main,22)}/>
        </linearGradient>
        <linearGradient id={`${u}rg`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,5)}/>
          <stop offset="100%" stopColor={darken(colors.main,28)}/>
        </linearGradient>
        <linearGradient id={`${u}brg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.main,8)}/>
          <stop offset="100%" stopColor={darken(colors.main,30)}/>
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/></filter>
        <clipPath id={`${u}lc`}><path d={PANEL_L}/></clipPath>
        <clipPath id={`${u}rc`}><path d={PANEL_R}/></clipPath>
      </defs>

      {/* Left panel */}
      <path d={PANEL_L} fill={`url(#${u}lg)`} stroke="none"/>
      <PatternOverlay u={u} path={PANEL_L} colors={colors} pattern={pattern} clipId={`${u}lc`}/>

      {/* Right panel */}
      <path d={PANEL_R} fill={`url(#${u}rg)`} stroke="none"/>
      <PatternOverlay u={u} path={PANEL_R} colors={colors} pattern={pattern} clipId={`${u}rc`}/>

      {/* Crown outline */}
      <path d={CROWN} fill="none" stroke={darken(colors.main,30)} strokeWidth="2" filter={`url(#${u}ds)`}/>

      {/* Panel seam stitches */}
      <path d={STITCH_L} stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" fill="none" strokeDasharray="4,5"/>
      <path d={STITCH_R} stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" fill="none" strokeDasharray="4,5"/>

      {/* Sweatband */}
      <path d={SWEATBAND} fill={colors.secondary || colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1"/>

      {/* Brim */}
      <path d={BRIM} fill={`url(#${u}brg)`} stroke={darken(colors.main,35)} strokeWidth="1.5"/>
      {/* Brim under stitch */}
      <path d="M 65,258 C 90,268 170,274 250,274 C 330,274 420,268 442,258" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" strokeDasharray="4,5"/>

      {/* Top button */}
      <circle cx="250" cy="84" r="8" fill={colors.accent} stroke={darken(colors.accent,20)} strokeWidth="1"/>

      {/* Brand label on front */}
      
    </svg>
  );
}
