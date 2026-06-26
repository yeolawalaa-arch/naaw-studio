"use client";
import { ProductColors } from "../ProductCanvas";
import { makePatternDefs, PatternOverlay, lighten, darken } from "../patternUtils";

export default function Saree({ colors, pattern, patternIntensity = 70, patternZone = "full" }: { colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string }) {
  const u = `sr${Math.random().toString(36).slice(2,5)}`;

  // Drape paths — saree laid flat showing pallu draped over shoulder
  // BLOUSE (choli) — fitted top
  const BLOUSE = `M 180,95 L 160,105 L 155,160 L 345,160 L 340,105 L 320,95 C 305,105 280,112 250,112 C 220,112 195,105 180,95 Z`;
  // NECKLINE
  const NECK = `M 180,95 C 195,110 220,118 250,118 C 280,118 305,110 320,95 C 305,82 280,75 250,75 C 220,75 195,82 180,95 Z`;
  // MAIN SKIRT DRAPE — the petticoat/ghagra layer
  const SKIRT = `M 148,160 L 120,430 L 380,430 L 352,160 Z`;
  // PALLU — draped fabric going from hip across body and over shoulder
  const PALLU = `M 155,170 L 130,155 L 60,90 L 72,78 L 148,135 L 170,180 Z`;
  // PALLU BODY — the fabric hanging down from shoulder
  const PALLU_HANG = `M 62,78 L 48,80 L 30,260 L 55,265 L 72,90 Z`;
  // BORDER — decorative border at bottom of skirt
  const BORDER_SKIRT = `M 120,395 L 120,430 L 380,430 L 380,395 Z`;
  // BORDER — decorative border along pallu
  const BORDER_PALLU = `M 48,80 L 30,260 L 40,261 L 57,82 L 62,78 Z`;

  return (
    <svg viewBox="0 0 500 480" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ background: "#111" }}>
      <defs>
        {makePatternDefs(u, colors, pattern)}
        <linearGradient id={`${u}sk`} x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main, 15)} />
          <stop offset="100%" stopColor={darken(colors.main, 20)} />
        </linearGradient>
        <linearGradient id={`${u}pl`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.main, 10)} />
          <stop offset="100%" stopColor={darken(colors.main, 25)} />
        </linearGradient>
        <linearGradient id={`${u}bl`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.secondary, 10)} />
          <stop offset="100%" stopColor={darken(colors.secondary, 20)} />
        </linearGradient>
        <filter id={`${u}ds`}><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5" /></filter>
        <filter id={`${u}ds2`}><feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.4" /></filter>
        <clipPath id={`${u}skc`}><path d={SKIRT} /></clipPath>
        <clipPath id={`${u}plc`}><path d={PALLU} /></clipPath>
        <clipPath id={`${u}phc`}><path d={PALLU_HANG} /></clipPath>
        <clipPath id={`${u}blc`}><path d={BLOUSE} /></clipPath>
      </defs>

      {/* Pallu hanging down (back layer) */}
      <path d={PALLU_HANG} fill={`url(#${u}pl)`} stroke={darken(colors.main, 30)} strokeWidth="1.5" filter={`url(#${u}ds2)`} />
      <PatternOverlay u={u + "ph"} path={PALLU_HANG} colors={colors} pattern={pattern} clipId={`${u}phc`} intensity={patternIntensity} zone={patternZone} />
      {/* Pallu border strip */}
      <path d={BORDER_PALLU} fill={colors.accent} stroke={darken(colors.accent, 20)} strokeWidth="1" />

      {/* Main skirt */}
      <path d={SKIRT} fill={`url(#${u}sk)`} stroke={darken(colors.main, 28)} strokeWidth="2" filter={`url(#${u}ds)`} />
      <PatternOverlay u={u + "sk"} path={SKIRT} colors={colors} pattern={pattern} clipId={`${u}skc`} intensity={patternIntensity} zone={patternZone} />

      {/* Skirt border (decorative band at bottom) */}
      <path d={BORDER_SKIRT} fill={colors.accent} stroke={darken(colors.accent, 20)} strokeWidth="1" />
      {/* Border inner detail line */}
      <line x1="120" y1="403" x2="380" y2="403" stroke={colors.detail} strokeWidth="1.5" strokeDasharray="6,3" opacity="0.7" />
      <line x1="120" y1="410" x2="380" y2="410" stroke={darken(colors.accent, 15)} strokeWidth="1" />

      {/* Blouse (choli) */}
      <path d={BLOUSE} fill={`url(#${u}bl)`} stroke={darken(colors.secondary, 30)} strokeWidth="2" filter={`url(#${u}ds2)`} />
      <PatternOverlay u={u + "bl"} path={BLOUSE} colors={colors} pattern={pattern} clipId={`${u}blc`} intensity={patternIntensity * 0.6} zone="upper" />
      {/* Blouse neckline */}
      <path d={NECK} fill={darken(colors.secondary, 15)} stroke={darken(colors.secondary, 35)} strokeWidth="1.5" />
      {/* Blouse center seam */}
      <line x1="250" y1="118" x2="250" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Pallu drape over shoulder */}
      <path d={PALLU} fill={`url(#${u}pl)`} stroke={darken(colors.main, 30)} strokeWidth="1.5" filter={`url(#${u}ds2)`} />
      <PatternOverlay u={u + "pl"} path={PALLU} colors={colors} pattern={pattern} clipId={`${u}plc`} intensity={patternIntensity} zone={patternZone} />

      {/* Fold/pleat lines on skirt */}
      {[175, 210, 250, 290, 325].map((x, i) => (
        <line key={i} x1={x} y1="160" x2={x + (x < 250 ? -10 : 10)} y2="430"
          stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}

      {/* Waist tuck indicator */}
      <path d="M 148,160 Q 250,152 352,160" fill="none" stroke={darken(colors.main, 20)} strokeWidth="2" />

      {/* Blouse border detail */}
      <path d="M 155,158 L 345,158" stroke={colors.accent} strokeWidth="2.5" />
      <path d="M 155,153 L 345,153" stroke={colors.detail} strokeWidth="1" opacity="0.6" />

      {/* Shimmer highlight on main drape */}
      <path d="M 200,165 L 185,430" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
    </svg>
  );
}
