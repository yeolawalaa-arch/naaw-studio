"use client";

interface Colors {
  upper: string; sole: string; laces: string; accent: string; midsole: string; tongue: string;
}
interface Props { colors: Colors; pattern: string; }

const clamp = (v: number) => Math.min(255, Math.max(0, v));
function lighten(hex: string, a: number) {
  return `rgb(${clamp(parseInt(hex.slice(1,3),16)+a)},${clamp(parseInt(hex.slice(3,5),16)+a)},${clamp(parseInt(hex.slice(5,7),16)+a)})`;
}
const darken = (h: string, a: number) => lighten(h, -a);

/*
  ViewBox 640 x 310
  Proper low-top sneaker side profile:
    - Toe (left):  low, extends far left
    - Heel (right): TALL — heel counter rises high
    - Ankle opening: visible dip in the top edge

  Key Y coords:
    Heel counter top:  y = 88
    Vamp high point:   y = 108
    Ankle dip:         y = 122 (lowest point of the "opening" indent)
    Toe box top:       y = 155
    Toe tip:           y = 218
    Midsole top:       y = 238
    Midsole bottom:    y = 260
    Outsole bottom:    y = 292
*/

export default function SneakerCanvas({ colors, pattern }: Props) {
  const u = `m${Math.random().toString(36).slice(2,5)}`;

  // The full shoe upper silhouette
  // READ: starts at heel-top-right, goes counter-clockwise
  const UPPER = `
    M 570,112
    C 590,128 602,152 604,178
    C 606,202 600,224 592,238
    L 36,238
    C 32,224 32,204 38,182
    C 44,160 56,142 74,130
    C 90,120 112,114 140,112
    C 156,114 168,120 176,130
    C 178,122 188,112 202,106
    C 228,96 260,94 288,98
    C 280,108 274,120 272,134
    C 284,118 302,108 322,104
    C 378,96 440,98 496,108
    C 530,114 554,116 570,112
    Z
  `;

  // Simpler, cleaner outline:
  const SHOE = `
    M 36,238
    C 32,216 32,192 40,170
    C 48,148 64,132 88,120
    C 112,110 144,106 180,106
    C 192,106 202,108 210,114
    C 204,124 200,136 198,150
    L 196,238
    L 36,238 Z
  `;

  // The ONE correct silhouette for the whole upper
  // Toe left, heel right, heel is taller
  const S = `
    M 34,238
    C 30,214 30,188 38,164
    C 46,140 64,122 90,110
    C 116,98 152,94 194,94
    C 220,94 240,98 252,106
    C 248,116 244,130 242,146
    L 240,238
    L 34,238 Z
  `;

  // Full proper silhouette — THIS is the one we use
  const FULL = `
    M 32,238
    C 28,212 28,184 36,160
    C 46,134 64,116 92,104
    C 120,92 158,88 200,88
    C 224,88 244,92 256,102
    C 248,114 242,130 240,148
    L 238,238
    L 32,238 Z
  `;

  // Actually let me draw this properly as one unified shape
  // The shoe side profile from toe (left) going clockwise:
  const SILHOUETTE = `
    M 30,236
    C 28,210 28,182 38,156
    C 48,130 68,112 98,100
    C 128,88 166,84 208,84
    C 240,84 264,90 276,102
    C 266,116 260,134 258,154
    L 256,236
    L 30,236 Z
  `;

  // Heel counter area (right portion of shoe, taller)
  // The heel goes from the heel counter join point up to the heel back
  // Real shoe: toe area low, heel area HIGH
  // Let me do this properly:
  //   Shoe bottom: horizontal from x=30 to x=580, y=238
  //   Toe front curves UP-LEFT from (30, 238) going up to (50, 170) → (80, 140) → (120, 118)
  //   Vamp continues: (160, 102) → (220, 92) — highest
  //   Ankle indent: DIPS DOWN to (270, 108) — foot opening
  //   Back up to: (310, 92)
  //   Continues: (380, 86) → (460, 84)  ← heel top, very high
  //   Heel back: curves DOWN (520, 94) → (560, 128) → (576, 200) → (578, 238)

  const PROPER = `
    M 30,238
    C 28,212 30,184 40,160
    C 50,136 68,116 96,102
    C 122,90 155,84 195,82
    C 218,80 238,82 250,90
    C 242,102 236,118 234,136
    L 232,238
    L 30,238 Z
  `;

  // Ok I need to approach this differently. Let me use a fixed, well-tested sneaker path
  // Nike Dunk Low approximate SVG path (normalized to 640x310 viewbox)

  // Bottom of shoe: y=242 (midsole top)
  // The shoe "ground" is horizontal. Above this is the upper.

  // UPPER OUTLINE (clockwise from bottom-left):
  const U = `
    M 34,242
    L 34,238
    C 32,218 32,194 40,170
    C 50,144 68,124 96,110
    C 124,96 160,90 204,88
    C 232,87 254,90 268,100
    C 260,112 254,128 252,148
    L 250,242
    Z
  `;

  // THE FINAL proper path for the sneaker
  // I'll trace the outline properly:
  // LEFT SIDE (toe): bottom (30, 242) → up the toe front
  // TOP: toe area → ankle dip → heel top
  // RIGHT SIDE (heel): heel top → heel back → bottom (590, 242)
  const UPPER_PATH = `
    M 30,242
    C 28,222 28,196 36,172
    C 44,148 62,128 90,114
    C 118,100 156,94 200,92
    C 224,91 246,93 260,101
    C 250,113 244,129 242,147
    L 240,242
    Z
  `;

  // For the heel area (separate from toe area above)
  const HEEL_PATH = `
    M 240,242
    L 242,147
    C 246,129 252,113 262,101
    C 268,93 248,91 260,101
    C 280,90 320,86 368,84
    C 408,82 452,84 488,92
    C 520,100 548,114 566,134
    C 580,150 586,170 586,194
    C 587,214 584,230 582,242
    Z
  `;

  // ONE UNIFIED CORRECT PATH:
  // This traces the entire shoe upper in one path.
  // Starts at toe bottom-left, goes up toe front, across vamp top,
  // dips at ankle, goes up to heel top, down heel back, to heel bottom-right
  const SHOE_UPPER = `
    M 30,242
    C 28,220 28,194 36,170
    C 46,144 66,122 96,108
    C 126,94 166,88 212,86
    C 238,85 260,87 274,97
    C 264,109 256,125 254,143
    L 252,158
    C 270,138 296,122 326,112
    C 362,100 406,94 452,94
    C 492,94 530,98 558,108
    C 578,118 590,140 592,170
    C 594,198 592,224 590,242
    Z
  `;

  // Toe box region (left portion)
  const TOE_REGION = `
    M 30,242
    C 28,220 30,196 38,174
    C 46,152 62,134 86,120
    C 100,114 116,110 134,110
    L 140,112
    C 130,128 124,148 122,170
    L 120,242 Z
  `;

  // Heel counter region (right portion)
  const HEEL_REGION = `
    M 448,242
    L 450,100
    C 486,98 520,110 548,128
    C 572,144 586,166 590,192
    L 588,242 Z
  `;

  // Ankle collar area
  const COLLAR = `
    M 260,97
    C 270,87 284,86 254,143
  `;

  const PatternOverlay = () => {
    const clip = `url(#${u}c)`;
    if (pattern === "bandhani") return (
      <g clipPath={clip}>
        {Array.from({length:9},(_,r)=>Array.from({length:20},(_,c)=>(
          <g key={`${r}${c}`}>
            <circle cx={38+c*30} cy={88+r*18} r={6.5} stroke={colors.accent} strokeWidth="1.3" fill="none" opacity="0.42"/>
            <circle cx={38+c*30} cy={88+r*18} r={2} fill={colors.accent} opacity="0.45"/>
          </g>
        )))}
      </g>
    );
    if (pattern === "ikat") return (
      <g clipPath={clip}>
        {Array.from({length:9},(_,r)=>Array.from({length:21},(_,c)=>(
          <polygon key={`${r}${c}`}
            points={`${32+c*28},${86+r*18} ${46+c*28},${95+r*18} ${32+c*28},${104+r*18} ${18+c*28},${95+r*18}`}
            stroke={colors.accent} strokeWidth="1.1" fill={colors.accent} fillOpacity="0.14" strokeOpacity="0.42"/>
        )))}
      </g>
    );
    if (pattern === "ajrakh") return (
      <g clipPath={clip}>
        {Array.from({length:9},(_,r)=>Array.from({length:21},(_,c)=>(
          <g key={`${r}${c}`}>
            <rect x={32+c*28} y={86+r*18} width="16" height="16" stroke={colors.accent} strokeWidth="0.9" fill="none" opacity="0.32"/>
            <rect x={38+c*28} y={92+r*18} width="5" height="5" fill={colors.accent} opacity="0.32"/>
          </g>
        )))}
      </g>
    );
    if (pattern === "phulkari") return (
      <g clipPath={clip}>
        {Array.from({length:9},(_,r)=>Array.from({length:19},(_,c)=>(
          <g key={`${r}${c}`} transform={`translate(${40+c*30},${94+r*18})`}>
            <line x1="-8" y1="0" x2="8" y2="0" stroke={colors.accent} strokeWidth="1.6" opacity="0.42"/>
            <line x1="0" y1="-8" x2="0" y2="8" stroke={colors.accent} strokeWidth="1.6" opacity="0.42"/>
            <line x1="-5" y1="-5" x2="5" y2="5" stroke={colors.accent} strokeWidth="0.9" opacity="0.3"/>
            <line x1="5" y1="-5" x2="-5" y2="5" stroke={colors.accent} strokeWidth="0.9" opacity="0.3"/>
            <circle cx="0" cy="0" r="2" fill={colors.accent} opacity="0.5"/>
          </g>
        )))}
      </g>
    );
    if (pattern === "kalamkari") return (
      <g clipPath={clip}>
        {Array.from({length:6},(_,r)=>(
          <path key={r} d={`M 32,${116+r*22} Q 140,${96+r*22} 250,${116+r*22} Q 360,${136+r*22} 470,${116+r*22} Q 555,${96+r*22} 600,${116+r*22}`}
            stroke={colors.accent} strokeWidth="1.3" fill="none" opacity="0.32"/>
        ))}
        {Array.from({length:16},(_,i)=>(<circle key={i} cx={45+i*34} cy={116+(i%3)*22} r="3" fill={colors.accent} opacity="0.28"/>))}
      </g>
    );
    if (pattern === "madhubani") return (
      <g clipPath={clip}>
        {Array.from({length:5},(_,r)=>Array.from({length:11},(_,c)=>(
          <g key={`${r}${c}`}>
            <circle cx={52+c*54} cy={100+r*30} r="14" stroke={colors.accent} strokeWidth="1.1" fill="none" opacity="0.26"/>
            <circle cx={52+c*54} cy={100+r*30} r="7" stroke={colors.accent} strokeWidth="0.9" fill="none" opacity="0.22"/>
            <circle cx={52+c*54} cy={100+r*30} r="2" fill={colors.accent} opacity="0.32"/>
          </g>
        )))}
      </g>
    );
    if (pattern === "warli") return (
      <g clipPath={clip}>
        {Array.from({length:6},(_,r)=>Array.from({length:13},(_,c)=>(
          <polygon key={`${r}${c}`}
            points={`${40+c*44},${88+r*24} ${54+c*44},${112+r*24} ${26+c*44},${112+r*24}`}
            stroke={colors.accent} strokeWidth="1.3" fill="none" opacity="0.38"/>
        )))}
      </g>
    );
    if (pattern === "leheriya") return (
      <g clipPath={clip}>
        {Array.from({length:26},(_,i)=>(
          <line key={i} x1={-20+i*25} y1="72" x2={100+i*25} y2="258"
            stroke={i%2===0?colors.accent:lighten(colors.accent,36)}
            strokeWidth={i%2===0?3.5:2.2} opacity="0.34"/>
        ))}
      </g>
    );
    if (pattern === "geometric") return (
      <g clipPath={clip}>
        {Array.from({length:9},(_,r)=>Array.from({length:20},(_,c)=>(
          <polygon key={`${r}${c}`}
            points={`${32+c*30},${86+r*18} ${46+c*30},${95+r*18} ${32+c*30},${104+r*18} ${18+c*30},${95+r*18}`}
            stroke={colors.accent} strokeWidth="0.9" fill="none" opacity="0.32"/>
        )))}
      </g>
    );
    if (pattern === "camo") return (
      <g clipPath={clip}>
        {[
          [100,140,55,24],[196,120,46,20],[298,144,55,24],[396,118,48,20],[492,140,52,22],[565,160,44,18],
          [130,188,50,22],[226,200,58,24],[330,184,46,20],[430,196,52,22],[520,184,42,18],
        ].map(([cx,cy,rx,ry],i)=>(
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
            fill={i%3===0?darken(colors.upper,20):i%3===1?lighten(colors.upper,14):colors.accent}
            opacity="0.26"/>
        ))}
      </g>
    );
    if (pattern === "gradient") return (
      <>
        <defs>
          <linearGradient id={`${u}gr`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={lighten(colors.upper,14)}/>
            <stop offset="100%" stopColor={colors.accent}/>
          </linearGradient>
        </defs>
        <path d={SHOE_UPPER} fill={`url(#${u}gr)`}/>
      </>
    );
    return null;
  };

  return (
    <svg viewBox="0 0 640 310" xmlns="http://www.w3.org/2000/svg"
      className="w-full rounded-2xl"
      style={{background:"linear-gradient(135deg,#141414 0%,#0a0a0a 100%)"}}>
      <defs>
        <clipPath id={`${u}c`}><path d={SHOE_UPPER}/></clipPath>
        <linearGradient id={`${u}ug`} x1="0%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.upper,22)}/>
          <stop offset="55%" stopColor={colors.upper}/>
          <stop offset="100%" stopColor={darken(colors.upper,26)}/>
        </linearGradient>
        <linearGradient id={`${u}ag`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.accent,22)}/>
          <stop offset="100%" stopColor={darken(colors.accent,22)}/>
        </linearGradient>
        <linearGradient id={`${u}tg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.tongue,20)}/>
          <stop offset="100%" stopColor={darken(colors.tongue,12)}/>
        </linearGradient>
        <linearGradient id={`${u}mg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lighten(colors.midsole,30)}/>
          <stop offset="100%" stopColor={darken(colors.midsole,10)}/>
        </linearGradient>
        <linearGradient id={`${u}sg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={darken(colors.sole,2)}/>
          <stop offset="100%" stopColor={darken(colors.sole,28)}/>
        </linearGradient>
        <filter id={`${u}ds`}>
          <feDropShadow dx="0" dy="5" stdDeviation="9" floodColor="#000" floodOpacity="0.6"/>
        </filter>
        <filter id={`${u}bl`}><feGaussianBlur stdDeviation="7"/></filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="320" cy="305" rx="278" ry="10" fill="#000" opacity="0.5" filter={`url(#${u}bl)`}/>

      {/* Outsole */}
      <path d="
        M 26,266 L 24,278
        C 24,286 32,292 50,295
        C 100,301 200,304 320,304
        C 420,304 508,302 562,298
        C 594,295 608,289 608,281
        L 604,266 Z
      " fill={`url(#${u}sg)`}/>
      {Array.from({length:12},(_,i)=>(
        <rect key={i} x={40+i*46} y="280" width="34" height="7" rx="2"
          fill={darken(colors.sole,30)} opacity="0.65"/>
      ))}
      {/* Heel rubber block */}
      <path d="M 548,266 L 606,266 L 608,282 C 604,292 584,298 560,299 L 540,299 L 536,282 Z"
        fill={darken(colors.sole,20)} opacity="0.9"/>

      {/* Midsole */}
      <path d="M 26,242 L 28,266 L 604,266 L 602,242 Z"
        fill={`url(#${u}mg)`} stroke={darken(colors.midsole,16)} strokeWidth="1.2"/>
      <line x1="32" y1="247" x2="596" y2="247" stroke={lighten(colors.midsole,35)} strokeWidth="1.2" opacity="0.5"/>
      <path d="M 30,264 L 598,264" stroke={darken(colors.midsole,16)} strokeWidth="0.8" strokeDasharray="5,4" opacity="0.4"/>

      {/* Main upper */}
      <path d={SHOE_UPPER} fill={`url(#${u}ug)`} stroke={darken(colors.upper,30)} strokeWidth="2"
        filter={`url(#${u}ds)`}/>

      {/* Pattern overlay */}
      <PatternOverlay/>

      {/* Heel counter */}
      <path d="
        M 452,242
        L 454,96
        C 490,92 528,98 556,110
        C 576,120 590,142 592,170
        L 590,242 Z
      " fill={darken(colors.upper,16)} stroke={darken(colors.upper,30)} strokeWidth="1.4" opacity="0.9"/>
      <path d="M 456,100 L 452,242" stroke="rgba(255,255,255,0.13)" strokeWidth="1" fill="none" strokeDasharray="3,5"/>

      {/* Toe box */}
      <path d={TOE_REGION} fill={lighten(colors.upper,16)} stroke={darken(colors.upper,22)} strokeWidth="1.4"/>
      <path d="M 121,118 L 120,242" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" strokeDasharray="3,5"/>

      {/* Ankle collar */}
      <path d="
        M 210,87
        C 232,85 252,86 266,94
        C 258,106 252,120 250,136
        L 248,155
      " stroke={darken(colors.upper,26)} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 210,87 C 232,84 254,85 268,94"
        stroke={lighten(colors.upper,16)} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.35"/>

      {/* NAAW swoosh stripe */}
      <path d="
        M 136,230
        C 184,208 248,188 318,178
        C 366,170 412,168 446,174
        C 468,178 484,186 490,196
        C 472,200 450,202 422,202
        C 378,202 322,210 264,228
        C 212,244 164,260 144,250
        C 138,244 134,238 136,230 Z
      " fill={`url(#${u}ag)`} stroke={darken(colors.accent,16)} strokeWidth="1.2"/>

      {/* Tongue */}
      <path d="
        M 238,242 L 240,156
        C 241,140 249,128 260,122
        C 269,118 280,118 289,122
        C 298,128 304,140 305,156
        L 306,242 Z
      " fill={`url(#${u}tg)`} stroke={darken(colors.tongue,26)} strokeWidth="1.4"/>
      <line x1="272" y1="126" x2="272" y2="242" stroke={darken(colors.tongue,18)} strokeWidth="0.8" opacity="0.35"/>
      <rect x="246" y="196" width="52" height="22" rx="3" fill={darken(colors.tongue,28)} opacity="0.78"/>
      <text x="272" y="211" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="bold" fontFamily="Arial" letterSpacing="2" opacity="0.95">NAAW</text>

      {/* Heel pull tab — inside heel counter */}
      <path d="M 554,108 C 556,100 560,96 564,96 C 568,96 570,100 568,108 L 564,120 L 558,120 Z"
        fill={colors.accent} stroke={darken(colors.accent,18)} strokeWidth="1"/>

      {/* Laces */}
      {[0,1,2,3,4,5].map(i => {
        const y = 165 + i * 14;
        const lx = 250 - i;
        const rx = 294 + i;
        const wd = i%2===0 ? -2.5 : 2.5;
        return (
          <g key={i}>
            <path d={`M ${lx},${y} C ${lx+14},${y+wd} ${rx-14},${y-wd} ${rx},${y}`}
              stroke={colors.laces} strokeWidth="3" fill="none" strokeLinecap="round"/>
            <circle cx={lx} cy={y} r="4" fill={darken(colors.upper,36)} stroke="#bbb" strokeWidth="0.9"/>
            <circle cx={lx} cy={y} r="2" fill="#888"/>
            <circle cx={rx} cy={y} r="4" fill={darken(colors.upper,36)} stroke="#bbb" strokeWidth="0.9"/>
            <circle cx={rx} cy={y} r="2" fill="#888"/>
          </g>
        );
      })}
      {/* Bow */}
      <path d="M 256,242 C 248,228 244,218 256,213 C 264,210 270,212 272,220"
        stroke={colors.laces} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 288,242 C 296,228 300,218 288,213 C 280,210 274,212 272,220"
        stroke={colors.laces} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="272" cy="218" r="4.5" fill={colors.laces}/>

      {/* Specular highlight */}
      <path d="M 72,188 C 94,162 128,144 168,132 C 204,122 244,120 270,126 C 238,130 204,144 180,162 C 156,180 142,202 136,220 Z"
        fill="white" opacity="0.055"/>
    </svg>
  );
}
