// ──────────────────────────────────────────────────────────────
// Per-product configurator options + shared material data.
// Framework-agnostic (no THREE import) so it can be used by both
// the studio UI (app/studio/page.tsx) and the 3D viewer
// (components/Product3DViewer.tsx).
// ──────────────────────────────────────────────────────────────

export interface OptionChoice {
  id: string;
  label: string;
  swatch?: string; // optional colour preview for the chip
}
export interface ProductOption {
  id: string;
  label: string;
  choices: OptionChoice[];
  default: string;
}

// ── Material parameter tables (consumed by the 3D viewer) ──
export interface MetalSpec { color: string; metalness: number; roughness: number }
export const METALS: Record<string, MetalSpec> = {
  gold:        { color: "#D4AF37", metalness: 1,    roughness: 0.16 },
  "rose-gold": { color: "#E0A899", metalness: 1,    roughness: 0.18 },
  silver:      { color: "#E8E8EC", metalness: 1,    roughness: 0.12 },
  platinum:    { color: "#E5E4E2", metalness: 1,    roughness: 0.10 },
  gunmetal:    { color: "#2E353B", metalness: 0.95, roughness: 0.34 },
  black:       { color: "#1A1A1A", metalness: 0.85, roughness: 0.42 },
  titanium:    { color: "#8A8A86", metalness: 0.90, roughness: 0.30 },
  copper:      { color: "#B87333", metalness: 1,    roughness: 0.24 },
  bronze:      { color: "#CD7F32", metalness: 1,    roughness: 0.28 },
};

// Non-metal frame / shell materials (acetate, plastic, wood…)
export interface ShellSpec { color: string; metalness: number; roughness: number; clearcoat: number }
export const SHELLS: Record<string, ShellSpec> = {
  acetate:  { color: "#222226", metalness: 0.05, roughness: 0.35, clearcoat: 0.7 },
  tortoise: { color: "#5A3318", metalness: 0.05, roughness: 0.4,  clearcoat: 0.6 },
  matte:    { color: "#161616", metalness: 0.0,  roughness: 0.85, clearcoat: 0.0 },
  wood:     { color: "#6B4226", metalness: 0.0,  roughness: 0.7,  clearcoat: 0.2 },
};

export interface FabricSpec { roughness: number; clearcoat: number; sheen: number; metalness?: number }
export const FABRICS: Record<string, FabricSpec> = {
  cotton:    { roughness: 0.85, clearcoat: 0.0,  sheen: 0.0 },
  jersey:    { roughness: 0.80, clearcoat: 0.05, sheen: 0.1 },
  linen:     { roughness: 0.92, clearcoat: 0.0,  sheen: 0.0 },
  denim:     { roughness: 0.78, clearcoat: 0.06, sheen: 0.0 },
  fleece:    { roughness: 0.96, clearcoat: 0.0,  sheen: 0.0 },
  wool:      { roughness: 0.90, clearcoat: 0.0,  sheen: 0.15 },
  silk:      { roughness: 0.26, clearcoat: 0.6,  sheen: 0.8 },
  satin:     { roughness: 0.18, clearcoat: 0.7,  sheen: 0.9 },
  velvet:    { roughness: 0.62, clearcoat: 0.1,  sheen: 1.0 },
  leather:   { roughness: 0.50, clearcoat: 0.45, sheen: 0.0 },
  suede:     { roughness: 0.92, clearcoat: 0.0,  sheen: 0.2 },
  canvas:    { roughness: 0.88, clearcoat: 0.0,  sheen: 0.0 },
  nylon:     { roughness: 0.45, clearcoat: 0.35, sheen: 0.3 },
  patent:    { roughness: 0.08, clearcoat: 1.0,  sheen: 0.0 },
  mesh:      { roughness: 0.70, clearcoat: 0.1,  sheen: 0.0 },
  georgette: { roughness: 0.40, clearcoat: 0.3,  sheen: 0.5 },
  chiffon:   { roughness: 0.35, clearcoat: 0.3,  sheen: 0.55 },
  corduroy:  { roughness: 0.88, clearcoat: 0.0,  sheen: 0.25 },
};

export interface GemSpec { color: string; transmission: number; roughness: number; metalness: number }
export const GEMS: Record<string, GemSpec> = {
  diamond:    { color: "#F4FBFF", transmission: 0.96, roughness: 0.0,  metalness: 0.0 },
  ruby:       { color: "#E0115F", transmission: 0.60, roughness: 0.02, metalness: 0.0 },
  emerald:    { color: "#2E8B57", transmission: 0.60, roughness: 0.03, metalness: 0.0 },
  sapphire:   { color: "#0F52BA", transmission: 0.60, roughness: 0.02, metalness: 0.0 },
  amethyst:   { color: "#9966CC", transmission: 0.62, roughness: 0.03, metalness: 0.0 },
  topaz:      { color: "#FFC87C", transmission: 0.66, roughness: 0.03, metalness: 0.0 },
  aquamarine: { color: "#7FFFD4", transmission: 0.70, roughness: 0.02, metalness: 0.0 },
  citrine:    { color: "#E4A010", transmission: 0.64, roughness: 0.03, metalness: 0.0 },
  pearl:      { color: "#F8F0E3", transmission: 0.0,  roughness: 0.18, metalness: 0.2 },
  onyx:       { color: "#0A0A0A", transmission: 0.0,  roughness: 0.10, metalness: 0.3 },
};

// Gem cuts → maps to a geometry choice in the viewer
export const GEM_CUTS = ["round", "princess", "emerald-cut", "marquise", "oval"] as const;

// Eyewear lens types
export interface LensSpec { transmission: number; metalness: number; roughness: number; mix: number }
export const LENS_TYPES: Record<string, LensSpec> = {
  clear:     { transmission: 0.90, metalness: 0.05, roughness: 0.02, mix: 0.15 },
  tinted:    { transmission: 0.42, metalness: 0.10, roughness: 0.03, mix: 0.85 },
  gradient:  { transmission: 0.55, metalness: 0.15, roughness: 0.04, mix: 0.70 },
  polarized: { transmission: 0.30, metalness: 0.20, roughness: 0.05, mix: 0.95 },
  mirror:    { transmission: 0.0,  metalness: 0.95, roughness: 0.04, mix: 1.0 },
};
export const LENS_COLORS: Record<string, string> = {
  black:  "#15161A", smoke: "#3A3D44", brown: "#5A3A1E", green: "#1E3D2E",
  blue:   "#1C3A66", rose:  "#C98A9B", gold:  "#C9A227", purple: "#4A2A66", silver: "#C7CBD1",
};

// ── chip builders ──
const M = (id: string, label: string): OptionChoice => ({ id, label, swatch: METALS[id]?.color });
const S = (id: string, label: string): OptionChoice => ({ id, label, swatch: SHELLS[id]?.color });
const G = (id: string, label: string): OptionChoice => ({ id, label, swatch: GEMS[id]?.color });
const F = (id: string, label: string): OptionChoice => ({ id, label });
const C = (id: string, label: string, swatch?: string): OptionChoice => ({ id, label, swatch });

const FABRIC_OPT = (def: string, ids: [string, string][]): ProductOption => ({
  id: "fabric", label: "Fabric", default: def, choices: ids.map(([i, l]) => F(i, l)),
});
const LENS_COLOR_CHOICES: OptionChoice[] = [
  C("smoke", "Smoke", LENS_COLORS.smoke), C("black", "Black", LENS_COLORS.black),
  C("brown", "Brown", LENS_COLORS.brown), C("green", "Green", LENS_COLORS.green),
  C("blue", "Blue", LENS_COLORS.blue), C("rose", "Rose", LENS_COLORS.rose),
  C("gold", "Gold", LENS_COLORS.gold), C("purple", "Purple", LENS_COLORS.purple),
];

// ──────────────────────────────────────────────────────────────
// PRODUCT OPTIONS — each product has its OWN set of functions
// ──────────────────────────────────────────────────────────────
export const PRODUCT_OPTIONS: Record<string, ProductOption[]> = {
  // ── TOPS ──
  tshirt: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["jersey","Jersey"],["linen","Linen"],["silk","Silk"],["velvet","Velvet"]]),
    { id: "neck", label: "Neckline", default: "crew", choices: [F("crew","Crew"),F("vneck","V-Neck"),F("scoop","Scoop")] },
    { id: "sleeve", label: "Sleeve", default: "short", choices: [F("short","Short"),F("long","Long"),F("sleeveless","Sleeveless")] },
  ],
  shirt: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["linen","Linen"],["silk","Silk"],["satin","Satin"],["denim","Denim"]]),
    { id: "collar", label: "Collar", default: "classic", choices: [F("classic","Classic"),F("button-down","Button-Down"),F("mandarin","Mandarin")] },
    { id: "fit", label: "Fit", default: "regular", choices: [F("regular","Regular"),F("slim","Slim"),F("oversized","Oversized")] },
  ],
  polo: [
    FABRIC_OPT("jersey", [["jersey","Pique"],["cotton","Cotton"],["silk","Silk"]]),
    { id: "collar", label: "Collar", default: "ribbed", choices: [F("ribbed","Ribbed"),F("flat","Flat")] },
  ],
  hoodie: [
    FABRIC_OPT("fleece", [["fleece","Fleece"],["cotton","Cotton"],["velvet","Velvet"]]),
    { id: "closure", label: "Closure", default: "pullover", choices: [F("pullover","Pullover"),F("zip","Full-Zip")] },
    { id: "pocket", label: "Pocket", default: "kangaroo", choices: [F("kangaroo","Kangaroo"),F("split","Split"),F("none","None")] },
  ],
  jacket: [
    FABRIC_OPT("leather", [["leather","Leather"],["denim","Denim"],["nylon","Nylon"],["wool","Wool"],["suede","Suede"]]),
    { id: "hardware", label: "Hardware", default: "silver", choices: [M("silver","Silver"),M("gold","Gold"),M("gunmetal","Gunmetal"),M("black","Black")] },
  ],
  bomber: [
    FABRIC_OPT("nylon", [["nylon","Nylon"],["satin","Satin"],["wool","Wool"],["leather","Leather"]]),
    { id: "hardware", label: "Zip Metal", default: "silver", choices: [M("silver","Silver"),M("gold","Gold"),M("gunmetal","Gunmetal")] },
  ],

  // ── BOTTOMS ──
  shorts: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["nylon","Nylon"],["denim","Denim"],["fleece","Fleece"]]),
    { id: "length", label: "Length", default: "mid", choices: [F("short","Short"),F("mid","Mid"),F("long","Long")] },
  ],
  joggers: [
    FABRIC_OPT("fleece", [["fleece","Fleece"],["cotton","Cotton"],["nylon","Nylon"]]),
    { id: "cuff", label: "Cuff", default: "elastic", choices: [F("elastic","Elastic"),F("open","Open")] },
  ],
  jeans: [
    { id: "wash", label: "Wash", default: "indigo", choices: [
      C("indigo","Indigo","#2A4A7A"),C("light","Light","#7C9CC4"),C("black","Black","#1A1A1A"),
      C("grey","Grey","#6A6A6A"),C("acid","Acid Wash","#A8B8CC") ] },
    { id: "stitch", label: "Stitch", default: "gold", choices: [
      C("gold","Gold","#D4A853"),C("white","White","#EDEDED"),C("tonal","Tonal","#3A3A3A") ] },
    { id: "fit", label: "Fit", default: "regular", choices: [F("skinny","Skinny"),F("regular","Regular"),F("baggy","Baggy")] },
  ],

  // ── TRADITIONAL ──
  saree: [
    FABRIC_OPT("silk", [["silk","Silk"],["georgette","Georgette"],["chiffon","Chiffon"],["cotton","Cotton"],["satin","Satin"]]),
    { id: "border", label: "Border / Zari", default: "gold", choices: [M("gold","Gold Zari"),M("silver","Silver Zari"),M("copper","Copper"),M("bronze","Antique")] },
    { id: "drape", label: "Drape", default: "nivi", choices: [F("nivi","Nivi"),F("bengali","Bengali"),F("gujarati","Gujarati")] },
  ],

  // ── FOOTWEAR ──
  "sneaker-low": [
    { id: "material", label: "Upper", default: "leather", choices: [
      F("leather","Leather"),F("canvas","Canvas"),F("suede","Suede"),F("mesh","Mesh"),F("patent","Patent") ] },
    { id: "toe", label: "Toe Box", default: "cap", choices: [
      F("cap","Rubber Cap"),F("perf","Perforated"),F("plain","Plain") ] },
    { id: "sole", label: "Sole Color", default: "white", choices: [
      C("white","White","#F2F2F2"),C("gum","Gum","#C9A26A"),C("black","Black","#1C1C1C"),C("cream","Cream","#EBE3D0") ] },
    { id: "lace", label: "Laces", default: "white", choices: [
      C("white","White","#FFFFFF"),C("black","Black","#1A1A1A"),C("accent","Accent","#FFD700"),C("none","No Laces","#777") ] },
  ],
  "sneaker-high": [
    { id: "material", label: "Upper", default: "leather", choices: [
      F("leather","Leather"),F("canvas","Canvas"),F("suede","Suede"),F("patent","Patent") ] },
    { id: "toe", label: "Toe Box", default: "cap", choices: [
      F("cap","Rubber Cap"),F("perf","Perforated"),F("plain","Plain") ] },
    { id: "sole", label: "Sole Color", default: "white", choices: [
      C("white","White","#F2F2F2"),C("gum","Gum","#C9A26A"),C("black","Black","#1C1C1C") ] },
    { id: "lace", label: "Laces", default: "white", choices: [
      C("white","White","#FFFFFF"),C("black","Black","#1A1A1A"),C("accent","Accent","#FFD700") ] },
  ],
  boot: [
    { id: "material", label: "Material", default: "leather", choices: [
      F("leather","Leather"),F("suede","Suede"),F("patent","Patent") ] },
    { id: "sole", label: "Sole", default: "black", choices: [
      C("black","Black","#1C1C1C"),C("gum","Gum","#C9A26A"),C("white","White","#F2F2F2") ] },
    { id: "hardware", label: "Eyelets", default: "gold", choices: [M("gold","Gold"),M("silver","Silver"),M("gunmetal","Gunmetal")] },
  ],
  sandal: [
    { id: "material", label: "Strap", default: "leather", choices: [F("leather","Leather"),F("suede","Suede"),F("nylon","Nylon")] },
    { id: "hardware", label: "Buckle", default: "gold", choices: [M("gold","Gold"),M("silver","Silver"),M("bronze","Bronze")] },
  ],
  "slip-on": [
    { id: "material", label: "Upper", default: "canvas", choices: [F("canvas","Canvas"),F("leather","Leather"),F("suede","Suede"),F("velvet","Velvet")] },
    { id: "sole", label: "Sole", default: "white", choices: [C("white","White","#F2F2F2"),C("gum","Gum","#C9A26A"),C("black","Black","#1C1C1C")] },
  ],

  // ── HATS ──
  cap: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["denim","Denim"],["wool","Wool"],["mesh","Trucker Mesh"]]),
    { id: "brim", label: "Brim", default: "curved", choices: [F("curved","Curved"),F("flat","Flat")] },
    { id: "button", label: "Top Button", default: "accent", choices: [M("gold","Gold"),M("silver","Silver"),C("accent","Match Accent")] },
  ],
  beanie: [
    FABRIC_OPT("wool", [["wool","Wool Knit"],["fleece","Fleece"],["cotton","Cotton"]]),
    { id: "pom", label: "Pom-Pom", default: "yes", choices: [F("yes","With Pom"),F("no","No Pom")] },
  ],
  "bucket-hat": [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["denim","Denim"],["nylon","Nylon"],["corduroy","Corduroy"]]),
  ],

  // ── BAGS ──
  backpack: [
    { id: "material", label: "Material", default: "nylon", choices: [F("nylon","Nylon"),F("leather","Leather"),F("canvas","Canvas"),F("suede","Suede")] },
    { id: "hardware", label: "Hardware", default: "silver", choices: [M("silver","Silver"),M("gold","Gold"),M("gunmetal","Gunmetal"),M("black","Black")] },
  ],
  tote: [
    { id: "material", label: "Material", default: "canvas", choices: [F("canvas","Canvas"),F("leather","Leather"),F("denim","Denim"),F("nylon","Nylon")] },
    { id: "handle", label: "Handle", default: "gold", choices: [M("gold","Gold"),M("silver","Silver"),C("tonal","Tonal","#8a6d3b")] },
  ],

  // ── ACCESSORIES ──
  watch: [
    { id: "caseMetal", label: "Case Metal", default: "silver", choices: [
      M("silver","Silver"),M("gold","Gold"),M("rose-gold","Rose Gold"),M("gunmetal","Gunmetal"),M("black","Black"),M("titanium","Titanium") ] },
    { id: "strap", label: "Strap", default: "leather", choices: [
      F("leather","Leather"),F("steel","Steel"),F("nylon","NATO"),F("rubber","Rubber") ] },
    { id: "dial", label: "Dial", default: "sunburst", choices: [
      F("sunburst","Sunburst"),F("matte","Matte"),F("skeleton","Skeleton") ] },
    { id: "markers", label: "Markers", default: "index", choices: [
      F("index","Index Bars"),F("roman","Roman"),F("dot","Dots"),F("none","Minimal") ] },
    { id: "glass", label: "Crystal Tint", default: "clear", choices: [
      C("clear","Clear","#cfe8ff"),C("blue","Blue","#3a7bd5"),C("smoke","Smoke","#555") ] },
  ],
  sunglasses: [
    { id: "frame", label: "Frame Material", default: "silver", choices: [
      M("silver","Silver"),M("gold","Gold"),M("gunmetal","Gunmetal"),M("titanium","Titanium"),
      S("acetate","Acetate"),S("tortoise","Tortoise"),S("matte","Matte Black") ] },
    { id: "lensType", label: "Lens Type", default: "tinted", choices: [
      F("tinted","Tinted"),F("gradient","Gradient"),F("mirror","Mirror"),F("polarized","Polarized"),F("clear","Clear") ] },
    { id: "lensColor", label: "Lens Color", default: "smoke", choices: LENS_COLOR_CHOICES },
    { id: "shape", label: "Shape", default: "round", choices: [
      F("round","Round"),F("square","Square"),F("aviator","Aviator"),F("cat-eye","Cat-Eye") ] },
  ],
  belt: [
    FABRIC_OPT("leather", [["leather","Leather"],["suede","Suede"],["patent","Patent"]]),
    { id: "buckle", label: "Buckle Metal", default: "gold", choices: [
      M("gold","Gold"),M("silver","Silver"),M("gunmetal","Gunmetal"),M("black","Black"),M("bronze","Bronze") ] },
    { id: "buckleStyle", label: "Buckle Style", default: "frame", choices: [F("frame","Frame"),F("plate","Plate"),F("ring","Ring")] },
  ],
  chain: [
    { id: "metal", label: "Metal", default: "gold", choices: [
      M("gold","Gold"),M("silver","Silver"),M("rose-gold","Rose Gold"),M("gunmetal","Gunmetal"),M("platinum","Platinum") ] },
    { id: "link", label: "Link Style", default: "round", choices: [
      F("round","Round"),F("cuban","Cuban"),F("box","Box"),F("rope","Rope") ] },
    { id: "pendant", label: "Pendant", default: "tag", choices: [
      F("tag","Tag"),F("cross","Cross"),F("gem","Gem"),F("none","None") ] },
  ],
  wallet: [
    FABRIC_OPT("leather", [["leather","Leather"],["suede","Suede"],["patent","Patent"],["nylon","Nylon"]]),
    { id: "stitch", label: "Stitch", default: "accent", choices: [
      C("accent","Accent"),C("white","White","#EDEDED"),C("tonal","Tonal","#3A3A3A") ] },
  ],
  scarf: [
    FABRIC_OPT("wool", [["wool","Wool"],["silk","Silk"],["cashmere","Cashmere"],["chiffon","Chiffon"]]),
    { id: "fringe", label: "Fringe", default: "yes", choices: [F("yes","Fringed"),F("no","Clean Edge")] },
  ],
  socks: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["wool","Wool"],["mesh","Athletic"]]),
    { id: "length", label: "Length", default: "crew", choices: [F("ankle","Ankle"),F("crew","Crew"),F("knee","Knee-High")] },
  ],
  "phone-case": [
    { id: "phone", label: "Phone Model", default: "iphone-15-pro", choices: [
      F("iphone-15-pro-max","iPhone 15 Pro Max"),F("iphone-15-pro","iPhone 15 Pro"),
      F("iphone-15","iPhone 15"),F("iphone-se","iPhone SE"),
      F("galaxy-s24-ultra","Galaxy S24 Ultra"),F("galaxy-s24","Galaxy S24"),
      F("pixel-8-pro","Pixel 8 Pro"),F("oneplus-12","OnePlus 12") ] },
    { id: "material", label: "Material", default: "patent", choices: [
      F("patent","Glossy"),F("matte","Matte"),F("leather","Leather"),F("silicone","Silicone") ] },
    { id: "lens", label: "Camera Ring", default: "silver", choices: [M("silver","Silver"),M("gold","Gold"),M("black","Black")] },
  ],
  ring: [
    { id: "metal", label: "Band Metal", default: "gold", choices: [
      M("gold","Gold"),M("silver","Silver"),M("rose-gold","Rose Gold"),M("platinum","Platinum"),M("black","Black") ] },
    { id: "gem", label: "Gemstone", default: "diamond", choices: [
      G("diamond","Diamond"),G("ruby","Ruby"),G("emerald","Emerald"),G("sapphire","Sapphire"),
      G("amethyst","Amethyst"),G("topaz","Topaz"),G("onyx","Onyx") ] },
    { id: "cut", label: "Cut", default: "round", choices: [
      F("round","Round"),F("princess","Princess"),F("emerald-cut","Emerald"),F("marquise","Marquise"),F("oval","Oval") ] },
  ],
  earrings: [
    { id: "metal", label: "Metal", default: "gold", choices: [
      M("gold","Gold"),M("silver","Silver"),M("rose-gold","Rose Gold"),M("platinum","Platinum") ] },
    { id: "gem", label: "Gemstone", default: "diamond", choices: [
      G("diamond","Diamond"),G("ruby","Ruby"),G("emerald","Emerald"),G("sapphire","Sapphire"),G("pearl","Pearl") ] },
    { id: "style", label: "Style", default: "drop", choices: [
      F("hoop","Hoop"),F("stud","Stud"),F("drop","Drop") ] },
  ],
};

// Products that accept a custom printed graphic/text on the front
export const PRINTABLE = new Set<string>([
  "tshirt", "shirt", "polo", "hoodie", "jacket", "bomber", "tote", "backpack",
]);

export function defaultOptions(product: string): Record<string, string> {
  return Object.fromEntries((PRODUCT_OPTIONS[product] || []).map((o) => [o.id, o.default]));
}

// Validate AI-returned options against the schema; drop anything invalid.
export function sanitizeOptions(product: string, raw: unknown): Record<string, string> {
  const schema = PRODUCT_OPTIONS[product] || [];
  const out = defaultOptions(product);
  if (raw && typeof raw === "object") {
    for (const opt of schema) {
      const v = (raw as Record<string, unknown>)[opt.id];
      if (typeof v === "string" && opt.choices.some((c) => c.id === v)) out[opt.id] = v;
    }
  }
  return out;
}
