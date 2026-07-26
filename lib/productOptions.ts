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
  "white-gold":{ color: "#E8E8E0", metalness: 1,    roughness: 0.14 },
  champagne:   { color: "#E6CBA8", metalness: 1,    roughness: 0.18 },
  chrome:      { color: "#DDE2E6", metalness: 1,    roughness: 0.08 },
  graphite:    { color: "#3A3F44", metalness: 0.95, roughness: 0.38 },
  pewter:      { color: "#8E8E8E", metalness: 0.90, roughness: 0.34 },
  brass:       { color: "#C9A227", metalness: 1,    roughness: 0.26 },
  "yellow-gold":{ color: "#E6BE45", metalness: 1,   roughness: 0.15 },
  "antique-gold":{ color: "#9C7A2E", metalness: 0.95, roughness: 0.46 },
  vermeil:     { color: "#E8C66A", metalness: 1,    roughness: 0.20 },
  rhodium:     { color: "#F0F2F5", metalness: 1,    roughness: 0.07 },
  sterling:    { color: "#D9DCE1", metalness: 1,    roughness: 0.16 },
  oxidized:    { color: "#4A4E54", metalness: 0.92, roughness: 0.50 },
  ruthenium:   { color: "#36393E", metalness: 0.95, roughness: 0.40 },
  hematite:    { color: "#2B2D33", metalness: 1,    roughness: 0.22 },
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
  knit:      { roughness: 0.72, clearcoat: 0.05, sheen: 0.15 },
  georgette: { roughness: 0.40, clearcoat: 0.3,  sheen: 0.5 },
  chiffon:   { roughness: 0.35, clearcoat: 0.3,  sheen: 0.55 },
  corduroy:  { roughness: 0.88, clearcoat: 0.0,  sheen: 0.25 },
  // Rich traditional / ethnic fabrics
  brocade:   { roughness: 0.40, clearcoat: 0.3,  sheen: 0.7,  metalness: 0.25 },
  banarasi:  { roughness: 0.32, clearcoat: 0.5,  sheen: 0.85, metalness: 0.18 },
  jacquard:  { roughness: 0.50, clearcoat: 0.2,  sheen: 0.5 },
  organza:   { roughness: 0.30, clearcoat: 0.4,  sheen: 0.6 },
  net:       { roughness: 0.60, clearcoat: 0.1,  sheen: 0.25 },
  khadi:     { roughness: 0.95, clearcoat: 0.0,  sheen: 0.0 },
  cashmere:  { roughness: 0.88, clearcoat: 0.0,  sheen: 0.2 },
  twill:     { roughness: 0.80, clearcoat: 0.05, sheen: 0.05 },
  tweed:     { roughness: 0.92, clearcoat: 0.0,  sheen: 0.1 },
  ripstop:   { roughness: 0.50, clearcoat: 0.30, sheen: 0.2 },
  terry:     { roughness: 0.95, clearcoat: 0.0,  sheen: 0.0 },
  flannel:   { roughness: 0.90, clearcoat: 0.0,  sheen: 0.1 },
  sherpa:    { roughness: 0.97, clearcoat: 0.0,  sheen: 0.0 },
  gabardine: { roughness: 0.70, clearcoat: 0.1,  sheen: 0.1 },
  modal:     { roughness: 0.55, clearcoat: 0.15, sheen: 0.3 },
  crepe:     { roughness: 0.60, clearcoat: 0.1,  sheen: 0.2 },
  chambray:  { roughness: 0.78, clearcoat: 0.05, sheen: 0.05 },
  oxford:    { roughness: 0.80, clearcoat: 0.05, sheen: 0.05 },
  poplin:    { roughness: 0.70, clearcoat: 0.1,  sheen: 0.1 },
  pashmina:  { roughness: 0.85, clearcoat: 0.0,  sheen: 0.32 },
  chanderi:  { roughness: 0.45, clearcoat: 0.3,  sheen: 0.5 },
  tussar:    { roughness: 0.50, clearcoat: 0.2,  sheen: 0.42 },
  kanjivaram:{ roughness: 0.30, clearcoat: 0.5,  sheen: 0.85, metalness: 0.22 },
  "raw-silk":{ roughness: 0.50, clearcoat: 0.25, sheen: 0.45 },
  tissue:    { roughness: 0.30, clearcoat: 0.45, sheen: 0.7,  metalness: 0.30 },
  velour:    { roughness: 0.60, clearcoat: 0.15, sheen: 0.7 },
  shearling: { roughness: 0.98, clearcoat: 0.0,  sheen: 0.0 },
  boucle:    { roughness: 0.90, clearcoat: 0.0,  sheen: 0.12 },
  lame:      { roughness: 0.25, clearcoat: 0.6,  sheen: 0.6,  metalness: 0.6 },
  sequin:    { roughness: 0.30, clearcoat: 0.5,  sheen: 0.7,  metalness: 0.5 },
  crochet:   { roughness: 0.85, clearcoat: 0.0,  sheen: 0.1 },
  lace:      { roughness: 0.60, clearcoat: 0.2,  sheen: 0.3 },
  croc:      { roughness: 0.42, clearcoat: 0.55, sheen: 0.25 },
  saffiano:  { roughness: 0.55, clearcoat: 0.32, sheen: 0.12 },
  carbon:    { roughness: 0.34, clearcoat: 0.7,  sheen: 0.0, metalness: 0.28 },
  pebbled:   { roughness: 0.62, clearcoat: 0.28, sheen: 0.1 },
  nubuck:    { roughness: 0.9,  clearcoat: 0.0,  sheen: 0.18 },
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
  garnet:     { color: "#7B1F2B", transmission: 0.55, roughness: 0.03, metalness: 0.0 },
  peridot:    { color: "#9DC209", transmission: 0.66, roughness: 0.03, metalness: 0.0 },
  tanzanite:  { color: "#4661B8", transmission: 0.60, roughness: 0.03, metalness: 0.0 },
  opal:       { color: "#D8E7E0", transmission: 0.40, roughness: 0.12, metalness: 0.15 },
  turquoise:  { color: "#3AB0A2", transmission: 0.0,  roughness: 0.20, metalness: 0.1 },
  morganite:  { color: "#E6B7B0", transmission: 0.68, roughness: 0.03, metalness: 0.0 },
  jade:       { color: "#3E9B6E", transmission: 0.25, roughness: 0.18, metalness: 0.0 },
  moonstone:  { color: "#DDE6EC", transmission: 0.50, roughness: 0.10, metalness: 0.1 },
  "black-diamond": { color: "#1B1B1F", transmission: 0.20, roughness: 0.02, metalness: 0.2 },
  spinel:     { color: "#C8385A", transmission: 0.58, roughness: 0.03, metalness: 0.0 },
  kunzite:    { color: "#E6A8C8", transmission: 0.66, roughness: 0.03, metalness: 0.0 },
  tourmaline: { color: "#2EA37A", transmission: 0.62, roughness: 0.03, metalness: 0.0 },
  alexandrite:{ color: "#6B5B95", transmission: 0.60, roughness: 0.03, metalness: 0.0 },
  "lapis-lazuli": { color: "#26619C", transmission: 0.0, roughness: 0.22, metalness: 0.15 },
  coral:      { color: "#FF7F50", transmission: 0.0,  roughness: 0.30, metalness: 0.0 },
  amber:      { color: "#C8821E", transmission: 0.55, roughness: 0.10, metalness: 0.0 },
  "blue-topaz": { color: "#6FC3DF", transmission: 0.70, roughness: 0.02, metalness: 0.0 },
  "smoky-quartz": { color: "#6B5645", transmission: 0.58, roughness: 0.04, metalness: 0.0 },
  "rose-quartz":  { color: "#E7A6B6", transmission: 0.52, roughness: 0.08, metalness: 0.0 },
  zircon:     { color: "#C9E6F0", transmission: 0.80, roughness: 0.02, metalness: 0.0 },
  "tigers-eye": { color: "#A0701E", transmission: 0.0, roughness: 0.16, metalness: 0.35 },
  malachite:  { color: "#1F7A52", transmission: 0.0,  roughness: 0.20, metalness: 0.1 },
  sunstone:   { color: "#E0772E", transmission: 0.40, roughness: 0.14, metalness: 0.2 },
};

// Gem cuts → maps to a geometry choice in the viewer
export const GEM_CUTS = ["round", "princess", "emerald-cut", "marquise", "oval", "pear", "heart", "cushion", "radiant", "trillion", "baguette", "asscher"] as const;

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
  red:    "#7A2222", orange: "#B5651D", yellow: "#B59A1D", teal:   "#1E5A5A", ice:    "#9FC9DA",
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
  C("silver", "Silver", LENS_COLORS.silver), C("red", "Red", LENS_COLORS.red),
  C("orange", "Orange", LENS_COLORS.orange), C("yellow", "Yellow", LENS_COLORS.yellow),
  C("teal", "Teal", LENS_COLORS.teal), C("ice", "Ice", LENS_COLORS.ice),
];

// ── Shared per-part colour palette. Lets every detail of a product get its own
//    colour option (body, lining, trim, laces, straps…). PART_COLORS is the id→hex
//    map the 3D viewer reads; COLOR_OPT builds a colour picker for a named part. ──
const COLOR_SWATCHES: [string, string, string][] = [
  ["black","Black","#1B1B1D"],["charcoal","Charcoal","#33353A"],["slate","Slate","#5A6270"],
  ["grey","Grey","#8A8D92"],["silver","Silver","#C8CCD2"],["white","White","#ECECEC"],
  ["cream","Cream","#E9E0C8"],["sand","Sand","#D8C4A0"],["tan","Tan","#B98A5E"],
  ["camel","Camel","#C08A4E"],["brown","Brown","#6B4A2E"],["chocolate","Chocolate","#3E2A1C"],
  ["oxblood","Oxblood","#5A2A2A"],["red","Red","#9A2A2A"],["crimson","Crimson","#B01E3C"],
  ["rust","Rust","#A2502A"],["orange","Orange","#C4622A"],["mustard","Mustard","#C79A32"],
  ["yellow","Yellow","#E0B93A"],["lime","Lime","#8DB02E"],["olive","Olive","#5A5A2E"],
  ["green","Green","#2E6E4E"],["forest","Forest","#1F4A32"],["teal","Teal","#1F6B6B"],
  ["navy","Navy","#22386A"],["blue","Blue","#2A4A9A"],["royal","Royal","#2350C8"],
  ["sky","Sky","#5A86C4"],["purple","Purple","#5A3A7A"],["plum","Plum","#4A2A44"],
  ["pink","Pink","#C86A86"],["magenta","Magenta","#A02A6A"],["burgundy","Burgundy","#5C1F2E"],
];
export const PART_COLORS: Record<string, string> = Object.fromEntries(COLOR_SWATCHES.map(([i, , h]) => [i, h]));
const COLOR_CHOICES: OptionChoice[] = COLOR_SWATCHES.map(([i, l, h]) => C(i, l, h));
const COLOR_OPT = (id: string, label: string, def: string): ProductOption => ({ id, label, default: def, choices: COLOR_CHOICES });

// Reusable broad choice lists (all wired through METALS / GEMS / gemCutGeometry)
const METAL_CHOICES: OptionChoice[] = [
  M("gold","Gold"),M("yellow-gold","Yellow Gold"),M("rose-gold","Rose Gold"),M("white-gold","White Gold"),
  M("vermeil","Vermeil"),M("antique-gold","Antique Gold"),M("silver","Silver"),M("sterling","Sterling"),
  M("rhodium","Rhodium"),M("platinum","Platinum"),M("titanium","Titanium"),M("gunmetal","Gunmetal"),
  M("oxidized","Oxidized"),M("ruthenium","Ruthenium"),M("hematite","Hematite"),M("black","Black"),
  M("copper","Copper"),M("bronze","Bronze"),M("brass","Brass"),M("champagne","Champagne"),
  M("chrome","Chrome"),M("graphite","Graphite"),M("pewter","Pewter"),
];
const GEM_CHOICES: OptionChoice[] = [
  G("diamond","Diamond"),G("black-diamond","Black Diamond"),G("ruby","Ruby"),G("emerald","Emerald"),
  G("sapphire","Sapphire"),G("amethyst","Amethyst"),G("topaz","Topaz"),G("blue-topaz","Blue Topaz"),
  G("aquamarine","Aquamarine"),G("citrine","Citrine"),G("pearl","Pearl"),G("onyx","Onyx"),
  G("garnet","Garnet"),G("peridot","Peridot"),G("tanzanite","Tanzanite"),G("opal","Opal"),
  G("turquoise","Turquoise"),G("morganite","Morganite"),G("jade","Jade"),G("moonstone","Moonstone"),
  G("spinel","Spinel"),G("kunzite","Kunzite"),G("tourmaline","Tourmaline"),G("alexandrite","Alexandrite"),
  G("lapis-lazuli","Lapis Lazuli"),G("coral","Coral"),G("amber","Amber"),G("smoky-quartz","Smoky Quartz"),
  G("rose-quartz","Rose Quartz"),G("zircon","Zircon"),G("tigers-eye","Tiger's Eye"),G("malachite","Malachite"),
  G("sunstone","Sunstone"),
];
const CUT_CHOICES: OptionChoice[] = [
  F("round","Round"),F("princess","Princess"),F("emerald-cut","Emerald"),F("marquise","Marquise"),
  F("oval","Oval"),F("pear","Pear"),F("heart","Heart"),F("cushion","Cushion"),
  F("radiant","Radiant"),F("trillion","Trillion"),F("baguette","Baguette"),F("asscher","Asscher"),
  F("cabochon","Cabochon"),F("rose-cut","Rose Cut"),F("briolette","Briolette"),F("hexagon","Hexagon"),F("kite","Kite"),
];

// ──────────────────────────────────────────────────────────────
// PRODUCT OPTIONS — each product has its OWN set of functions
// ──────────────────────────────────────────────────────────────
export const PRODUCT_OPTIONS: Record<string, ProductOption[]> = {
  // ── TOPS ──
  tshirt: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["jersey","Jersey"],["linen","Linen"],["modal","Modal"],["silk","Silk"],["satin","Satin"],["velvet","Velvet"],["terry","Terry"],["chiffon","Chiffon"],["georgette","Georgette"],["lace","Lace"],["crochet","Crochet"],["crepe","Crepe"],["pashmina","Pashmina"]]),
    { id: "neck", label: "Neckline", default: "crew", choices: [F("crew","Crew"),F("vneck","V-Neck"),F("scoop","Scoop"),F("boat","Boat"),F("square","Square")] },
    { id: "sleeve", label: "Sleeve", default: "short", choices: [F("short","Short"),F("three-quarter","3/4"),F("long","Long"),F("cap","Cap"),F("sleeveless","Sleeveless")] },
    { id: "length", label: "Length", default: "regular", choices: [F("crop","Crop"),F("regular","Regular"),F("long","Long")] },
  ],
  shirt: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["linen","Linen"],["silk","Silk"],["satin","Satin"],["denim","Denim"],["twill","Twill"],["flannel","Flannel"],["corduroy","Corduroy"],["chambray","Chambray"],["oxford","Oxford"],["poplin","Poplin"],["crepe","Crepe"]]),
    { id: "collar", label: "Collar", default: "classic", choices: [F("classic","Classic"),F("button-down","Button-Down"),F("mandarin","Mandarin")] },
    { id: "fit", label: "Fit", default: "regular", choices: [F("regular","Regular"),F("slim","Slim"),F("oversized","Oversized")] },
  ],
  polo: [
    FABRIC_OPT("jersey", [["jersey","Pique"],["cotton","Cotton"],["modal","Modal"],["linen","Linen"],["silk","Silk"],["knit","Knit"],["oxford","Oxford"]]),
    { id: "collar", label: "Collar", default: "ribbed", choices: [F("ribbed","Ribbed"),F("flat","Flat")] },
  ],
  hoodie: [
    FABRIC_OPT("fleece", [["fleece","Fleece"],["cotton","Cotton"],["terry","Terry"],["sherpa","Sherpa"],["jersey","Jersey"],["velvet","Velvet"],["boucle","Boucle"],["velour","Velour"]]),
    { id: "closure", label: "Closure", default: "pullover", choices: [F("pullover","Pullover"),F("zip","Full-Zip")] },
    { id: "pocket", label: "Pocket", default: "kangaroo", choices: [F("kangaroo","Kangaroo"),F("split","Split"),F("none","None")] },
  ],
  jacket: [
    FABRIC_OPT("leather", [["leather","Leather"],["denim","Denim"],["nylon","Nylon"],["wool","Wool"],["suede","Suede"],["gabardine","Gabardine"],["tweed","Tweed"],["corduroy","Corduroy"]]),
    { id: "hardware", label: "Hardware", default: "silver", choices: [M("silver","Silver"),M("gold","Gold"),M("gunmetal","Gunmetal"),M("black","Black"),M("bronze","Bronze"),M("brass","Brass"),M("chrome","Chrome")] },
  ],
  bomber: [
    FABRIC_OPT("nylon", [["nylon","Nylon"],["satin","Satin"],["wool","Wool"],["leather","Leather"],["ripstop","Ripstop"],["suede","Suede"]]),
    { id: "hardware", label: "Zip Metal", default: "silver", choices: [M("silver","Silver"),M("gold","Gold"),M("gunmetal","Gunmetal"),M("black","Black"),M("bronze","Bronze"),M("brass","Brass")] },
  ],

  // ── BOTTOMS ──
  shorts: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["nylon","Nylon"],["denim","Denim"],["fleece","Fleece"],["twill","Twill"],["ripstop","Ripstop"],["linen","Linen"],["terry","Terry"]]),
    { id: "length", label: "Length", default: "mid", choices: [F("short","Short"),F("mid","Mid"),F("long","Long")] },
  ],
  joggers: [
    FABRIC_OPT("fleece", [["fleece","Fleece"],["cotton","Cotton"],["terry","Terry"],["modal","Modal"],["nylon","Nylon"],["sherpa","Sherpa"]]),
    { id: "cuff", label: "Cuff", default: "elastic", choices: [F("elastic","Elastic"),F("open","Open")] },
  ],
  jeans: [
    { id: "wash", label: "Wash", default: "indigo", choices: [
      C("indigo","Indigo","#2A4A7A"),C("light","Light","#7C9CC4"),C("black","Black","#1A1A1A"),
      C("grey","Grey","#6A6A6A"),C("acid","Acid Wash","#A8B8CC"),C("stone","Stone","#9AA0A6"),
      C("vintage","Vintage","#5C6E86"),C("jet","Jet","#0E0E10") ] },
    { id: "stitch", label: "Stitch", default: "gold", choices: [
      C("gold","Gold","#D4A853"),C("white","White","#EDEDED"),C("tonal","Tonal","#3A3A3A"),
      C("red","Red","#9A3A3A"),C("blue","Blue","#2A4A7A"),C("cream","Cream","#E9E0C8") ] },
    { id: "fit", label: "Fit", default: "regular", choices: [F("skinny","Skinny"),F("regular","Regular"),F("baggy","Baggy")] },
  ],

  // ── TRADITIONAL ──
  // Women
  saree: [
    FABRIC_OPT("silk", [["silk","Silk"],["georgette","Georgette"],["chiffon","Chiffon"],["cotton","Cotton"],["satin","Satin"],["banarasi","Banarasi"],["kanjivaram","Kanjivaram"],["organza","Organza"],["net","Net"],["chanderi","Chanderi"],["tussar","Tussar"],["tissue","Tissue"],["velvet","Velvet"],["crepe","Crepe"]]),
    { id: "border", label: "Border / Zari", default: "gold", choices: [M("gold","Gold Zari"),M("yellow-gold","Yellow Zari"),M("silver","Silver Zari"),M("copper","Copper"),M("bronze","Antique"),M("rose-gold","Rose Gold"),M("oxidized","Oxidized")] },
    { id: "drape", label: "Drape", default: "nivi", choices: [F("nivi","Nivi"),F("bengali","Bengali"),F("gujarati","Gujarati")] },
    { id: "blouse", label: "Blouse Sleeve", default: "short", choices: [F("sleeveless","Sleeveless"),F("short","Short"),F("elbow","Elbow"),F("full","Full")] },
  ],
  lehenga: [
    FABRIC_OPT("silk", [["silk","Silk"],["georgette","Georgette"],["velvet","Velvet"],["satin","Satin"],["net","Net"],["brocade","Brocade"],["organza","Organza"],["banarasi","Banarasi"],["kanjivaram","Kanjivaram"],["tissue","Tissue"],["chanderi","Chanderi"],["sequin","Sequin"]]),
    { id: "border", label: "Zari Border", default: "gold", choices: [M("gold","Gold"),M("yellow-gold","Yellow Gold"),M("silver","Silver"),M("copper","Copper"),M("bronze","Antique"),M("rose-gold","Rose Gold"),M("oxidized","Oxidized")] },
    { id: "flare", label: "Skirt Flare", default: "a-line", choices: [F("a-line","A-Line"),F("circular","Circular"),F("mermaid","Mermaid"),F("flared","Lehenga Flare")] },
    { id: "work", label: "Hand Work", default: "embroidered", choices: [F("plain","Plain"),F("embroidered","Embroidered"),F("mirror","Mirror"),F("sequined","Sequined")] },
    { id: "dupatta", label: "Dupatta", default: "yes", choices: [F("yes","With Dupatta"),F("no","No Dupatta")] },
  ],
  anarkali: [
    FABRIC_OPT("georgette", [["georgette","Georgette"],["silk","Silk"],["chiffon","Chiffon"],["net","Net"],["satin","Satin"],["banarasi","Banarasi"],["velvet","Velvet"],["chanderi","Chanderi"],["tissue","Tissue"],["crepe","Crepe"],["organza","Organza"]]),
    { id: "border", label: "Zari Border", default: "gold", choices: [M("gold","Gold"),M("yellow-gold","Yellow Gold"),M("silver","Silver"),M("copper","Copper"),M("rose-gold","Rose Gold"),M("oxidized","Oxidized")] },
    { id: "sleeve", label: "Sleeve", default: "long", choices: [F("long","Full"),F("three-quarter","3/4"),F("short","Short"),F("sleeveless","Sleeveless")] },
    { id: "length", label: "Length", default: "floor", choices: [F("floor","Floor"),F("ankle","Ankle"),F("knee","Knee Frock")] },
    { id: "dupatta", label: "Dupatta", default: "yes", choices: [F("yes","With Dupatta"),F("no","No Dupatta")] },
  ],
  "salwar-kameez": [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["silk","Silk"],["georgette","Georgette"],["chiffon","Chiffon"],["linen","Linen"],["satin","Satin"],["modal","Modal"],["crepe","Crepe"],["chanderi","Chanderi"],["khadi","Khadi"]]),
    { id: "salwar", label: "Salwar Style", default: "patiala", choices: [F("patiala","Patiala"),F("straight","Straight"),F("churidar","Churidar"),F("palazzo","Palazzo")] },
    { id: "border", label: "Trim", default: "gold", choices: [M("gold","Gold"),M("silver","Silver"),M("copper","Copper"),C("tonal","Tonal","#8a6d3b")] },
    { id: "length", label: "Kameez Length", default: "regular", choices: [F("regular","Regular"),F("long","Long"),F("short","Short")] },
    { id: "dupatta", label: "Dupatta", default: "yes", choices: [F("yes","With Dupatta"),F("no","No Dupatta")] },
  ],
  kurti: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["silk","Silk"],["linen","Linen"],["georgette","Georgette"],["chiffon","Chiffon"],["khadi","Khadi"],["velvet","Velvet"],["chanderi","Chanderi"],["modal","Modal"],["crepe","Crepe"],["lace","Lace"]]),
    { id: "neck", label: "Neckline", default: "round", choices: [F("round","Round"),F("v","V-Neck"),F("boat","Boat"),F("square","Square"),F("collar","Collar"),F("keyhole","Keyhole")] },
    { id: "sleeve", label: "Sleeve", default: "three-quarter", choices: [F("three-quarter","3/4"),F("full","Full"),F("short","Short"),F("sleeveless","Sleeveless")] },
    { id: "length", label: "Length", default: "long", choices: [F("short","Short"),F("long","Long")] },
    { id: "bottom", label: "Bottom", default: "leggings", choices: [F("leggings","Leggings"),F("palazzo","Palazzo"),F("none","Tunic Only")] },
  ],
  // Men
  kurta: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["silk","Silk"],["linen","Linen"],["khadi","Khadi"],["velvet","Velvet"],["satin","Satin"],["banarasi","Banarasi"]]),
    { id: "collar", label: "Collar", default: "mandarin", choices: [F("mandarin","Mandarin"),F("round","Round"),F("v-placket","V-Placket")] },
    { id: "length", label: "Length", default: "regular", choices: [F("regular","Regular"),F("long","Long"),F("short","Short")] },
    { id: "bottom", label: "Bottom", default: "churidar", choices: [F("churidar","Churidar"),F("pajama","Pajama"),F("none","Kurta Only")] },
    { id: "button", label: "Buttons", default: "gold", choices: [M("gold","Gold"),M("silver","Silver"),M("bronze","Bronze"),C("accent","Accent")] },
  ],
  sherwani: [
    FABRIC_OPT("silk", [["silk","Silk"],["velvet","Velvet"],["brocade","Brocade"],["banarasi","Banarasi"],["jacquard","Jacquard"],["satin","Satin"]]),
    { id: "collar", label: "Collar", default: "bandhgala", choices: [F("bandhgala","Bandhgala"),F("mandarin","Mandarin"),F("round","Round")] },
    { id: "work", label: "Embellishment", default: "embroidered", choices: [F("plain","Plain"),F("embroidered","Embroidered"),F("sequined","Sequined")] },
    { id: "button", label: "Buttons", default: "gold", choices: [M("gold","Gold"),M("silver","Silver"),M("copper","Copper"),M("bronze","Bronze")] },
    { id: "stole", label: "Stole / Dupatta", default: "yes", choices: [F("yes","With Stole"),F("no","No Stole")] },
  ],
  "nehru-jacket": [
    FABRIC_OPT("silk", [["silk","Silk"],["cotton","Cotton"],["linen","Linen"],["velvet","Velvet"],["wool","Wool"],["jacquard","Jacquard"]]),
    { id: "button", label: "Buttons", default: "gold", choices: [M("gold","Gold"),M("silver","Silver"),M("bronze","Bronze"),S("wood","Wood")] },
    { id: "pocket", label: "Pockets", default: "welt", choices: [F("welt","Welt"),F("patch","Patch"),F("none","None")] },
    { id: "inner", label: "Worn Over", default: "kurta", choices: [F("kurta","Kurta"),F("shirt","Shirt")] },
  ],
  pathani: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["linen","Linen"],["khadi","Khadi"],["silk","Silk"]]),
    { id: "collar", label: "Collar", default: "band", choices: [F("band","Band"),F("round","Round")] },
    { id: "length", label: "Length", default: "regular", choices: [F("regular","Regular"),F("long","Long")] },
    { id: "pocket", label: "Pockets", default: "yes", choices: [F("yes","With Pockets"),F("no","None")] },
    { id: "button", label: "Buttons", default: "silver", choices: [M("silver","Silver"),M("gold","Gold"),C("accent","Accent")] },
  ],
  dhoti: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["silk","Silk"],["khadi","Khadi"],["satin","Satin"]]),
    { id: "border", label: "Zari Border", default: "gold", choices: [M("gold","Gold"),M("silver","Silver"),M("copper","Copper"),M("bronze","Maroon")] },
    { id: "drape", label: "Drape Style", default: "veshti", choices: [F("veshti","Veshti"),F("panche","Panche"),F("pleated","Pleated")] },
    { id: "length", label: "Length", default: "regular", choices: [F("regular","Regular"),F("long","Long")] },
  ],

  // ── FOOTWEAR ──
  "sneaker-low": [
    { id: "material", label: "Upper Material", default: "leather", choices: [
      F("leather","Leather"),F("canvas","Canvas"),F("suede","Suede"),F("mesh","Mesh"),F("patent","Patent"),F("nylon","Nylon"),F("knit","Knit"),F("corduroy","Corduroy"),F("nubuck","Nubuck") ] },
    COLOR_OPT("upperColor","Upper Colour","white"),
    COLOR_OPT("overlayColor","Overlays","black"),
    COLOR_OPT("accentColor","Swoosh / Accent","red"),
    COLOR_OPT("liningColor","Lining / Collar","grey"),
    { id: "eyelets", label: "Eyelets", default: "silver", choices: METAL_CHOICES },
    { id: "toe", label: "Toe Box", default: "cap", choices: [
      F("cap","Rubber Cap"),F("perf","Perforated"),F("plain","Plain") ] },
    { id: "sole", label: "Sole Color", default: "white", choices: [
      C("white","White","#F2F2F2"),C("gum","Gum","#C9A26A"),C("black","Black","#1C1C1C"),C("cream","Cream","#EBE3D0"),
      C("ice","Ice","#DCE6EC"),C("navy","Navy","#1E2A44"),C("red","Red","#7A2222"),C("tan","Tan","#B98A5E") ] },
    { id: "lace", label: "Laces", default: "white", choices: [
      C("white","White","#FFFFFF"),C("black","Black","#1A1A1A"),C("accent","Accent","#FFD700"),
      C("red","Red","#7A2222"),C("blue","Blue","#1C3A66"),C("gum","Gum","#C9A26A"),C("none","No Laces","#777") ] },
  ],
  "sneaker-high": [
    { id: "material", label: "Upper Material", default: "leather", choices: [
      F("leather","Leather"),F("canvas","Canvas"),F("suede","Suede"),F("patent","Patent"),F("nylon","Nylon"),F("corduroy","Corduroy"),F("nubuck","Nubuck") ] },
    COLOR_OPT("upperColor","Upper Colour","white"),
    COLOR_OPT("overlayColor","Overlays","black"),
    COLOR_OPT("accentColor","Swoosh / Accent","red"),
    COLOR_OPT("liningColor","Lining / Collar","grey"),
    { id: "eyelets", label: "Eyelets", default: "silver", choices: METAL_CHOICES },
    { id: "toe", label: "Toe Box", default: "cap", choices: [
      F("cap","Rubber Cap"),F("perf","Perforated"),F("plain","Plain") ] },
    { id: "sole", label: "Sole Color", default: "white", choices: [
      C("white","White","#F2F2F2"),C("gum","Gum","#C9A26A"),C("black","Black","#1C1C1C"),C("cream","Cream","#EBE3D0"),C("ice","Ice","#DCE6EC"),C("red","Red","#7A2222") ] },
    { id: "lace", label: "Laces", default: "white", choices: [
      C("white","White","#FFFFFF"),C("black","Black","#1A1A1A"),C("accent","Accent","#FFD700"),C("red","Red","#7A2222"),C("blue","Blue","#1C3A66") ] },
  ],
  boot: [
    { id: "material", label: "Material", default: "leather", choices: [
      F("leather","Leather"),F("suede","Suede"),F("patent","Patent"),F("canvas","Canvas"),F("nylon","Nylon") ] },
    { id: "sole", label: "Sole", default: "black", choices: [
      C("black","Black","#1C1C1C"),C("gum","Gum","#C9A26A"),C("white","White","#F2F2F2"),C("tan","Tan","#B98A5E") ] },
    { id: "hardware", label: "Eyelets", default: "gold", choices: [M("gold","Gold"),M("silver","Silver"),M("gunmetal","Gunmetal"),M("black","Black"),M("bronze","Bronze"),M("brass","Brass")] },
  ],
  sandal: [
    { id: "material", label: "Strap", default: "leather", choices: [F("leather","Leather"),F("suede","Suede"),F("nylon","Nylon"),F("canvas","Canvas"),F("patent","Patent")] },
    { id: "hardware", label: "Buckle", default: "gold", choices: [M("gold","Gold"),M("silver","Silver"),M("bronze","Bronze"),M("gunmetal","Gunmetal"),M("rose-gold","Rose Gold"),M("brass","Brass")] },
  ],
  "slip-on": [
    { id: "material", label: "Upper", default: "canvas", choices: [F("canvas","Canvas"),F("leather","Leather"),F("suede","Suede"),F("velvet","Velvet"),F("corduroy","Corduroy"),F("denim","Denim")] },
    { id: "sole", label: "Sole", default: "white", choices: [C("white","White","#F2F2F2"),C("gum","Gum","#C9A26A"),C("black","Black","#1C1C1C"),C("cream","Cream","#EBE3D0")] },
  ],

  // ── HATS ──
  cap: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["denim","Denim"],["wool","Wool"],["mesh","Trucker Mesh"],["canvas","Canvas"],["corduroy","Corduroy"],["nylon","Nylon"],["twill","Twill"],["suede","Suede"]]),
    COLOR_OPT("bodyColor","Crown Colour","navy"),
    COLOR_OPT("brimColor","Brim Colour","navy"),
    { id: "brim", label: "Brim", default: "curved", choices: [F("curved","Curved"),F("flat","Flat")] },
    { id: "button", label: "Top Button", default: "accent", choices: [M("gold","Gold"),M("silver","Silver"),M("black","Black"),M("gunmetal","Gunmetal"),M("bronze","Bronze"),C("accent","Match Accent")] },
  ],
  beanie: [
    FABRIC_OPT("wool", [["wool","Wool Knit"],["fleece","Fleece"],["cotton","Cotton"],["knit","Ribbed Knit"],["cashmere","Cashmere"],["sherpa","Sherpa"],["terry","Terry"]]),
    COLOR_OPT("bodyColor","Colour","charcoal"),
    COLOR_OPT("cuffColor","Cuff Colour","charcoal"),
    { id: "cuff", label: "Cuff", default: "folded", choices: [F("folded","Folded"),F("slouch","Slouch"),F("tight","Tight")] },
    { id: "pom", label: "Pom-Pom", default: "yes", choices: [F("yes","With Pom"),F("no","No Pom")] },
  ],
  "bucket-hat": [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["denim","Denim"],["nylon","Nylon"],["corduroy","Corduroy"],["canvas","Canvas"],["twill","Twill"],["terry","Terry"],["suede","Suede"]]),
    COLOR_OPT("bodyColor","Colour","olive"),
    COLOR_OPT("brimColor","Brim Colour","olive"),
    { id: "brim", label: "Brim", default: "medium", choices: [F("short","Short"),F("medium","Medium"),F("wide","Wide")] },
  ],

  // ── BAGS ──
  backpack: [
    { id: "material", label: "Material", default: "nylon", choices: [F("nylon","Nylon"),F("leather","Leather"),F("canvas","Canvas"),F("suede","Suede"),F("ripstop","Ripstop"),F("denim","Denim"),F("mesh","Mesh"),F("knit","Knit"),F("nubuck","Nubuck")] },
    COLOR_OPT("bodyColor","Body Colour","charcoal"),
    COLOR_OPT("pocketColor","Front Pocket","black"),
    COLOR_OPT("strapColor","Straps","black"),
    COLOR_OPT("trimColor","Trim / Piping","grey"),
    COLOR_OPT("liningColor","Lining","red"),
    { id: "hardware", label: "Hardware", default: "silver", choices: [M("silver","Silver"),M("gold","Gold"),M("gunmetal","Gunmetal"),M("black","Black"),M("bronze","Bronze"),M("brass","Brass"),M("chrome","Chrome"),M("titanium","Titanium")] },
    { id: "flap", label: "Flap", default: "open", choices: [F("open","Open Top"),F("closed","Buckled Flap")] },
  ],
  tote: [
    { id: "material", label: "Material", default: "canvas", choices: [F("canvas","Canvas"),F("leather","Leather"),F("denim","Denim"),F("nylon","Nylon"),F("corduroy","Corduroy"),F("suede","Suede"),F("twill","Twill"),F("croc","Croc"),F("saffiano","Saffiano")] },
    COLOR_OPT("bodyColor","Body Colour","cream"),
    COLOR_OPT("trimColor","Trim / Base","tan"),
    COLOR_OPT("liningColor","Lining","navy"),
    { id: "handle", label: "Handle", default: "gold", choices: [M("gold","Gold"),M("silver","Silver"),M("black","Black"),M("gunmetal","Gunmetal"),M("bronze","Bronze"),M("brass","Brass"),C("tonal","Tonal","#8a6d3b")] },
    { id: "open", label: "Opening", default: "open", choices: [F("open","Open"),F("snap","Snap Closed")] },
  ],

  // ── ACCESSORIES ──
  watch: [
    { id: "caseMetal", label: "Case Metal", default: "silver", choices: METAL_CHOICES },
    { id: "strap", label: "Strap", default: "leather", choices: [
      F("leather","Leather"),F("steel","Steel"),F("nylon","NATO"),F("rubber","Rubber"),F("suede","Suede"),F("canvas","Canvas") ] },
    { id: "dial", label: "Dial", default: "sunburst", choices: [
      F("sunburst","Sunburst"),F("matte","Matte"),F("carbon","Carbon"),F("skeleton","Skeleton") ] },
    { id: "markers", label: "Markers", default: "index", choices: [
      F("index","Index Bars"),F("baton","Baton"),F("roman","Roman"),F("arabic","Arabic"),F("dot","Dots"),F("none","Minimal") ] },
    { id: "glass", label: "Crystal Tint", default: "clear", choices: [
      C("clear","Clear","#cfe8ff"),C("blue","Blue","#3a7bd5"),C("green","Green","#2E7D5B"),
      C("purple","Purple","#6A4AA0"),C("rose","Rose","#C98A9B"),C("smoke","Smoke","#555") ] },
    COLOR_OPT("strapColor","Strap Colour","brown"),
    COLOR_OPT("dialColor","Dial Colour","charcoal"),
  ],
  sunglasses: [
    { id: "frame", label: "Frame Material", default: "silver", choices: [
      M("silver","Silver"),M("gold","Gold"),M("rose-gold","Rose Gold"),M("gunmetal","Gunmetal"),
      M("black","Black"),M("titanium","Titanium"),M("bronze","Bronze"),M("chrome","Chrome"),
      S("acetate","Acetate"),S("tortoise","Tortoise"),S("matte","Matte Black"),S("wood","Wood") ] },
    { id: "lensType", label: "Lens Type", default: "tinted", choices: [
      F("tinted","Tinted"),F("gradient","Gradient"),F("mirror","Mirror"),F("polarized","Polarized"),F("clear","Clear") ] },
    { id: "lensColor", label: "Lens Color", default: "smoke", choices: LENS_COLOR_CHOICES },
    { id: "shape", label: "Shape", default: "round", choices: [
      F("round","Round"),F("square","Square"),F("aviator","Aviator"),F("cat-eye","Cat-Eye"),
      F("oversized","Oversized"),F("hexagon","Hexagon") ] },
  ],
  belt: [
    FABRIC_OPT("leather", [["leather","Leather"],["suede","Suede"],["croc","Croc"],["patent","Patent"],["canvas","Canvas"],["nylon","Woven"],["denim","Denim"]]),
    COLOR_OPT("strapColor","Strap Colour","brown"),
    { id: "buckle", label: "Buckle Metal", default: "gold", choices: METAL_CHOICES },
    { id: "buckleStyle", label: "Buckle Style", default: "frame", choices: [
      F("frame","Frame"),F("plate","Plate"),F("ring","Ring"),F("double-ring","Double Ring"),F("western","Western") ] },
  ],
  chain: [
    { id: "metal", label: "Metal", default: "gold", choices: METAL_CHOICES },
    { id: "link", label: "Link Style", default: "round", choices: [
      F("round","Round"),F("cuban","Cuban"),F("box","Box"),F("rope","Rope"),
      F("snake","Snake"),F("figaro","Figaro"),F("mariner","Mariner") ] },
    { id: "pendant", label: "Pendant", default: "tag", choices: [
      F("tag","Tag"),F("cross","Cross"),F("gem","Gem"),F("heart","Heart"),
      F("star","Star"),F("coin","Coin"),F("none","None") ] },
  ],
  wallet: [
    { id: "style", label: "Style", default: "bifold", choices: [
      F("bifold","Bifold"),F("trifold","Trifold"),F("cardholder","Card Holder"),
      F("long","Long Wallet"),F("zip","Zip-Around"),F("money-clip","Money Clip") ] },
    FABRIC_OPT("leather", [["leather","Leather"],["suede","Suede"],["croc","Croc"],["saffiano","Saffiano"],["pebbled","Pebbled"],["nubuck","Nubuck"],["patent","Patent"],["carbon","Carbon Fibre"],["nylon","Nylon"],["canvas","Canvas"],["denim","Denim"]]),
    COLOR_OPT("bodyColor","Body Colour","brown"),
    COLOR_OPT("liningColor","Lining","tan"),
    COLOR_OPT("stitch","Stitch","cream"),
    { id: "hardware", label: "Hardware", default: "gold", choices: METAL_CHOICES },
    COLOR_OPT("edge","Edge Paint","chocolate"),
    { id: "monogram", label: "Monogram", default: "none", choices: [
      F("none","None"),F("corner","Corner Tag"),F("center","Center Emboss") ] },
  ],
  scarf: [
    FABRIC_OPT("wool", [["wool","Wool"],["silk","Silk"],["cashmere","Cashmere"],["chiffon","Chiffon"],["modal","Modal"],["linen","Linen"],["velvet","Velvet"],["jacquard","Jacquard"],["khadi","Khadi"]]),
    { id: "fringe", label: "Fringe", default: "yes", choices: [F("yes","Fringed"),F("no","Clean Edge")] },
  ],
  socks: [
    FABRIC_OPT("cotton", [["cotton","Cotton"],["wool","Wool"],["mesh","Athletic"],["terry","Terry"],["modal","Modal"],["jersey","Jersey"]]),
    { id: "length", label: "Length", default: "crew", choices: [F("ankle","Ankle"),F("crew","Crew"),F("knee","Knee-High")] },
  ],
  "phone-case": [
    { id: "phone", label: "Phone Model", default: "iphone-16-pro", choices: [
      F("iphone-16-pro-max","iPhone 16 Pro Max"),F("iphone-16-pro","iPhone 16 Pro"),
      F("iphone-15-pro-max","iPhone 15 Pro Max"),F("iphone-15-pro","iPhone 15 Pro"),
      F("iphone-15","iPhone 15"),F("iphone-se","iPhone SE"),
      F("galaxy-s25-ultra","Galaxy S25 Ultra"),F("galaxy-s24-ultra","Galaxy S24 Ultra"),F("galaxy-s24","Galaxy S24"),
      F("galaxy-z-fold-7","Galaxy Z Fold 7"),F("galaxy-z-flip-6","Galaxy Z Flip 6"),
      F("pixel-9-pro","Pixel 9 Pro"),F("pixel-8-pro","Pixel 8 Pro"),
      F("oneplus-13","OnePlus 13"),F("oneplus-12","OnePlus 12") ] },
    { id: "material", label: "Material", default: "patent", choices: [
      F("patent","Glossy"),F("matte","Matte"),F("leather","Leather"),F("silicone","Silicone") ] },
    { id: "lens", label: "Camera Ring", default: "silver", choices: [
      M("silver","Silver"),M("gold","Gold"),M("black","Black"),M("gunmetal","Gunmetal"),
      M("graphite","Graphite"),M("titanium","Titanium"),M("rose-gold","Rose Gold"),M("chrome","Chrome"),M("bronze","Bronze") ] },
  ],
  ring: [
    { id: "metal", label: "Band Metal", default: "gold", choices: METAL_CHOICES },
    { id: "gem", label: "Gemstone", default: "diamond", choices: GEM_CHOICES },
    { id: "cut", label: "Cut", default: "round", choices: CUT_CHOICES },
  ],
  earrings: [
    { id: "metal", label: "Metal", default: "gold", choices: METAL_CHOICES },
    { id: "gem", label: "Gemstone", default: "diamond", choices: GEM_CHOICES },
    { id: "style", label: "Style", default: "drop", choices: [
      F("stud","Stud"),F("hoop","Hoop"),F("pave-hoop","Pavé Hoop"),F("huggie","Huggie"),
      F("drop","Drop"),F("dangle","Dangle"),F("teardrop","Teardrop"),F("chandelier","Chandelier"),
      F("chandbali","Chandbali"),F("jhumka","Jhumka"),F("threader","Threader"),F("ear-cuff","Ear Cuff"),
      F("ear-jacket","Ear Jacket"),F("climber","Climber"),F("tassel","Tassel"),F("cluster","Cluster"),
      F("halo","Halo"),F("heart","Heart"),F("bar","Bar"),F("star","Star") ] },
    { id: "cut", label: "Stone Cut", default: "round", choices: CUT_CHOICES },
    { id: "size", label: "Size", default: "medium", choices: [
      F("tiny","Tiny"),F("small","Small"),F("medium","Medium"),F("large","Large"),
      F("statement","Statement"),F("oversized","Oversized") ] },
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
