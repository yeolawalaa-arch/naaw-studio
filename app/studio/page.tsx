"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ProductType, ProductColors, TextOverlay } from "../../components/ProductCanvas";

const ProductCanvas = dynamic(() => import("../../components/ProductCanvas"), { ssr: false });
const Product3DViewer = dynamic(() => import("../../components/Product3DViewer"), { ssr: false });

// Free plan: only these 5 products
const FREE_PRODUCTS: ProductType[] = ["tshirt", "hoodie", "sneaker-low", "cap", "tote"];

const PRODUCTS: { type: ProductType; label: string; category: string }[] = [
  { type: "tshirt", label: "T-Shirt", category: "Tops" },
  { type: "shirt", label: "Shirt", category: "Tops" },
  { type: "polo", label: "Polo", category: "Tops" },
  { type: "hoodie", label: "Hoodie", category: "Tops" },
  { type: "jacket", label: "Jacket", category: "Tops" },
  { type: "bomber", label: "Bomber", category: "Tops" },
  { type: "shorts", label: "Shorts", category: "Bottoms" },
  { type: "joggers", label: "Joggers", category: "Bottoms" },
  { type: "jeans", label: "Jeans", category: "Bottoms" },
  { type: "saree", label: "Saree", category: "Traditional" },
  { type: "sneaker-low", label: "Sneaker Low", category: "Footwear" },
  { type: "sneaker-high", label: "Sneaker High", category: "Footwear" },
  { type: "boot", label: "Boot", category: "Footwear" },
  { type: "sandal", label: "Sandal", category: "Footwear" },
  { type: "slip-on", label: "Slip-On", category: "Footwear" },
  { type: "cap", label: "Cap", category: "Hats" },
  { type: "beanie", label: "Beanie", category: "Hats" },
  { type: "bucket-hat", label: "Bucket Hat", category: "Hats" },
  { type: "backpack", label: "Backpack", category: "Bags" },
  { type: "tote", label: "Tote Bag", category: "Bags" },
  { type: "watch", label: "Watch", category: "Accessories" },
  { type: "sunglasses", label: "Sunglasses", category: "Accessories" },
  { type: "belt", label: "Belt", category: "Accessories" },
  { type: "chain", label: "Chain", category: "Accessories" },
  { type: "wallet", label: "Wallet", category: "Accessories" },
  { type: "scarf", label: "Scarf", category: "Accessories" },
  { type: "socks", label: "Socks", category: "Accessories" },
  { type: "phone-case", label: "Phone Case", category: "Accessories" },
  { type: "ring", label: "Ring", category: "Accessories" },
  { type: "earrings", label: "Earrings", category: "Accessories" },
];

const CATEGORIES = ["Tops", "Bottoms", "Footwear", "Hats", "Bags", "Accessories", "Traditional"];

const PATTERN_STYLES: { id: string; label: string; patterns: { id: string; label: string }[] }[] = [
  { id: "basic", label: "Basic", patterns: [
    { id: "solid", label: "Solid" },
    { id: "gradient", label: "Gradient" },
    { id: "camo", label: "Camo" },
    { id: "tiedye", label: "Tie-Dye" },
  ]},
  { id: "indian", label: "🇮🇳 Indian", patterns: [
    { id: "bandhani", label: "Bandhani" },
    { id: "ikat", label: "Ikat" },
    { id: "ajrakh", label: "Ajrakh" },
    { id: "phulkari", label: "Phulkari" },
    { id: "kalamkari", label: "Kalamkari" },
    { id: "madhubani", label: "Madhubani" },
    { id: "warli", label: "Warli" },
    { id: "leheriya", label: "Leheriya" },
    { id: "paisley", label: "Paisley" },
    { id: "geometric", label: "Geometric" },
  ]},
  { id: "japanese", label: "🇯🇵 Japanese", patterns: [
    { id: "sashiko", label: "Sashiko" },
    { id: "asanoha", label: "Asanoha" },
    { id: "seigaiha", label: "Seigaiha" },
    { id: "wave", label: "Wave" },
  ]},
  { id: "african", label: "🌍 African", patterns: [
    { id: "kente", label: "Kente" },
    { id: "ankara", label: "Ankara" },
    { id: "mudcloth", label: "Mudcloth" },
  ]},
  { id: "middleeast", label: "🕌 Middle East", patterns: [
    { id: "arabesque", label: "Arabesque" },
    { id: "mosaic", label: "Mosaic" },
  ]},
  { id: "western", label: "🌎 Western", patterns: [
    { id: "plaid", label: "Plaid" },
    { id: "pinstripe", label: "Pinstripe" },
    { id: "denim", label: "Denim" },
  ]},
  { id: "minimal", label: "◻ Minimal", patterns: [
    { id: "dots", label: "Dots" },
    { id: "grid", label: "Grid" },
    { id: "diagonal", label: "Diagonal" },
  ]},
];

const ZONES = [
  { id: "full", label: "Full" },
  { id: "upper", label: "Upper Half" },
  { id: "lower", label: "Lower Half" },
  { id: "center", label: "Center" },
  { id: "left", label: "Left Side" },
  { id: "right", label: "Right Side" },
];

const PALETTES: { name: string; colors: ProductColors }[] = [
  { name: "Naaw Black", colors: { main: "#111111", secondary: "#1a1a1a", accent: "#FFD700", detail: "#888888", lining: "#222222" } },
  { name: "Saffron", colors: { main: "#FF6B00", secondary: "#CC4400", accent: "#FFD700", detail: "#FF9500", lining: "#FFF0E0" } },
  { name: "Royal Indigo", colors: { main: "#1A1A7E", secondary: "#0D0D4F", accent: "#C0A000", detail: "#4444AA", lining: "#E8E8FF" } },
  { name: "Jaipur Pink", colors: { main: "#C2185B", secondary: "#880E4F", accent: "#FFD54F", detail: "#E91E63", lining: "#FCE4EC" } },
  { name: "Mughal Green", colors: { main: "#1B5E20", secondary: "#0A3D0A", accent: "#FFD700", detail: "#2E7D32", lining: "#E8F5E9" } },
  { name: "Kashmir Red", colors: { main: "#B71C1C", secondary: "#7F0000", accent: "#FFC107", detail: "#D32F2F", lining: "#FFEBEE" } },
  { name: "Thar Sand", colors: { main: "#D4A44C", secondary: "#8B6914", accent: "#C62828", detail: "#F0C040", lining: "#FFF8E1" } },
  { name: "Ocean Blue", colors: { main: "#0D47A1", secondary: "#002171", accent: "#00BCD4", detail: "#1565C0", lining: "#E3F2FD" } },
  { name: "Chalk White", colors: { main: "#F5F5F5", secondary: "#E0E0E0", accent: "#212121", detail: "#BDBDBD", lining: "#FFFFFF" } },
  { name: "Olive Drip", colors: { main: "#556B2F", secondary: "#2F3B1A", accent: "#C0A000", detail: "#8A9A5B", lining: "#EEF0E8" } },
  { name: "Berry", colors: { main: "#4A0072", secondary: "#2D0047", accent: "#E040FB", detail: "#6A1B9A", lining: "#F3E5F5" } },
  { name: "Rust", colors: { main: "#8B3A0F", secondary: "#5C1F00", accent: "#FFA726", detail: "#BF6030", lining: "#FFF3E0" } },
];

const CULTURE_PRESETS: { name: string; pattern: string; colors: ProductColors }[] = [
  { name: "Bandhani", pattern: "bandhani", colors: { main: "#C2185B", secondary: "#880E4F", accent: "#FFD54F", detail: "#E91E63", lining: "#FCE4EC" } },
  { name: "Ikat Loom", pattern: "ikat", colors: { main: "#1A1A7E", secondary: "#0D0D4F", accent: "#C0A000", detail: "#4444AA", lining: "#E8E8FF" } },
  { name: "Ajrakh Block", pattern: "ajrakh", colors: { main: "#B71C1C", secondary: "#7F0000", accent: "#FFC107", detail: "#D32F2F", lining: "#FFEBEE" } },
  { name: "Phulkari", pattern: "phulkari", colors: { main: "#4A0072", secondary: "#2D0047", accent: "#FF6B6B", detail: "#6A1B9A", lining: "#F3E5F5" } },
  { name: "Kalamkari", pattern: "kalamkari", colors: { main: "#1B5E20", secondary: "#0A3D0A", accent: "#FFD700", detail: "#2E7D32", lining: "#E8F5E9" } },
  { name: "Madhubani", pattern: "madhubani", colors: { main: "#FF6B00", secondary: "#CC4400", accent: "#FFD700", detail: "#FF9500", lining: "#FFF0E0" } },
  { name: "Warli Tribe", pattern: "warli", colors: { main: "#5C3317", secondary: "#3B1E08", accent: "#F5E6C8", detail: "#8B6914", lining: "#FFF8E1" } },
  { name: "Leheriya", pattern: "leheriya", colors: { main: "#00695C", secondary: "#004D40", accent: "#FFC107", detail: "#00897B", lining: "#E0F2F1" } },
  { name: "Rajasthani", pattern: "geometric", colors: { main: "#D4A44C", secondary: "#8B6914", accent: "#C62828", detail: "#F0C040", lining: "#FFF8E1" } },
  { name: "Mughal Garden", pattern: "geometric", colors: { main: "#1B5E20", secondary: "#0A3D0A", accent: "#B8860B", detail: "#2E7D32", lining: "#F0F4E8" } },
  { name: "Indigo Craft", pattern: "ikat", colors: { main: "#0D2137", secondary: "#060F1A", accent: "#E8D5A3", detail: "#1A3D5C", lining: "#EEF2F7" } },
  { name: "Pashmina", pattern: "bandhani", colors: { main: "#8B3A0F", secondary: "#5C1F00", accent: "#FFA726", detail: "#BF6030", lining: "#FFF3E0" } },
];

const STREET_PRESETS: { name: string; pattern: string; colors: ProductColors }[] = [
  { name: "All Black", pattern: "solid", colors: { main: "#0A0A0A", secondary: "#111111", accent: "#333333", detail: "#555555", lining: "#1A1A1A" } },
  { name: "Triple White", pattern: "solid", colors: { main: "#F8F8F8", secondary: "#EEEEEE", accent: "#CCCCCC", detail: "#DDDDDD", lining: "#FFFFFF" } },
  { name: "Bred", pattern: "solid", colors: { main: "#CC0000", secondary: "#111111", accent: "#FFFFFF", detail: "#880000", lining: "#1A1A1A" } },
  { name: "Royal", pattern: "solid", colors: { main: "#0033AA", secondary: "#111111", accent: "#FFFFFF", detail: "#002288", lining: "#F5F5F5" } },
  { name: "Volt", pattern: "solid", colors: { main: "#111111", secondary: "#222222", accent: "#CCFF00", detail: "#333333", lining: "#1A1A1A" } },
  { name: "Camo Green", pattern: "camo", colors: { main: "#556B2F", secondary: "#3B4A20", accent: "#8B7355", detail: "#8A9A5B", lining: "#EEF0E8" } },
];

const COLOR_LABELS: (keyof ProductColors)[] = ["main", "secondary", "accent", "detail", "lining"];
const COLOR_DISPLAY: Record<keyof ProductColors, string> = {
  main: "Main Color", secondary: "Secondary", accent: "Accent / Stripe", detail: "Detail", lining: "Lining / Inner",
};

const DEFAULT_COLORS: ProductColors = {
  main: "#111111", secondary: "#1a1a1a", accent: "#FFD700", detail: "#888888", lining: "#222222"
};

function ProBadge({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-400/20 border border-yellow-400/40 rounded-full text-yellow-400 text-[9px] font-bold hover:bg-yellow-400/30 transition">
      ★ PRO
    </button>
  );
}

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-white/15 rounded-2xl p-8 max-w-sm w-full">
        <p className="text-white text-xl font-black mb-1">Upgrade to Pro</p>
        <p className="text-white/40 text-sm mb-6">Unlock everything — all products, AI design, custom text, and export.</p>
        <div className="space-y-2 mb-6">
          {["All 19 product types", "AI design generator", "Custom text & logo overlay", "Export SVG/PNG", "All Indian textile patterns"].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-white/70">
              <span className="text-yellow-400">✓</span> {f}
            </div>
          ))}
        </div>
        <div className="text-center mb-4">
          <span className="text-3xl font-black text-white">$9</span>
          <span className="text-white/40 text-sm">/month</span>
        </div>
        <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition text-sm mb-3">
          Upgrade Now — $9/mo
        </button>
        <button onClick={onClose} className="w-full text-white/40 text-xs hover:text-white transition">
          Maybe later
        </button>
      </div>
    </div>
  );
}

export default function StudioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isPro = (session?.user as any)?.plan === "pro";

  const [product, setProduct] = useState<ProductType>("tshirt");
  const [activeCategory, setActiveCategory] = useState("Tops");
  const [colors, setColors] = useState<ProductColors>(DEFAULT_COLORS);
  const [pattern, setPattern] = useState("solid");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"culture" | "street">("culture");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [patternStyle, setPatternStyle] = useState("basic");
  const [patternZone, setPatternZone] = useState("full");
  const [patternIntensity, setPatternIntensity] = useState(70);
  const [textOverlay, setTextOverlay] = useState<TextOverlay>({
    text: "", color: "#ffffff", size: 28, x: 50, y: 50,
    font: "Arial", bold: true, italic: false, opacity: 90,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-white/40 text-sm">Loading...</p>
    </div>;
  }

  const updateText = (patch: Partial<TextOverlay>) => setTextOverlay(prev => ({ ...prev, ...patch }));

  const handleAI = async () => {
    if (!isPro) { setShowUpgrade(true); return; }
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/ai-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, product }),
      });
      const data = await res.json();
      if (data.colors) {
        setColors({ ...DEFAULT_COLORS, ...data.colors });
        if (data.patternSuggestion) setPattern(data.patternSuggestion);
      }
      setAiResult(data.description || "Design applied!");
    } catch {
      setAiResult("Could not connect to AI. Try manually.");
    }
    setAiLoading(false);
  };

  const handleExport = () => {
    if (!isPro) { setShowUpgrade(true); return; }
    const svg = document.querySelector("#product-canvas svg") as SVGElement;
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `design-${product}.svg`;
    a.click();
  };

  const handleProductSelect = (type: ProductType) => {
    if (!isPro && !FREE_PRODUCTS.includes(type)) { setShowUpgrade(true); return; }
    setProduct(type);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <a href="/" className="text-xl font-black tracking-widest text-white">NAAW</a>
        <div className="flex items-center gap-3">
          {!isPro && (
            <button onClick={() => setShowUpgrade(true)} className="px-3 py-1.5 bg-yellow-400/20 border border-yellow-400/40 rounded-full text-yellow-400 text-xs font-bold hover:bg-yellow-400/30 transition">
              ★ Upgrade to Pro
            </button>
          )}
          {isPro && <span className="px-3 py-1.5 bg-yellow-400/20 border border-yellow-400/40 rounded-full text-yellow-400 text-xs font-bold">★ Pro</span>}
          <span className="text-white/40 text-xs">{session?.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-white/30 text-xs hover:text-white transition">Sign out</button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)]">
        {/* Left Panel */}
        <div className="lg:w-[340px] flex-shrink-0 overflow-y-auto border-r border-white/10 p-5 space-y-6">

          {/* Product Picker */}
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Product Type</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${activeCategory === cat ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {PRODUCTS.filter(p => p.category === activeCategory).map(p => {
                const locked = !isPro && !FREE_PRODUCTS.includes(p.type);
                return (
                  <button key={p.type} onClick={() => handleProductSelect(p.type)}
                    className={`py-2 px-1 rounded-lg text-[11px] font-semibold transition text-center relative ${product === p.type ? "bg-white text-black" : locked ? "bg-white/4 border border-white/8 text-white/30" : "bg-white/8 border border-white/10 text-white/70 hover:bg-white/15"}`}>
                    {p.label}
                    {locked && <span className="absolute top-1 right-1 text-[8px]">🔒</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Prompt */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">AI Design Generator</p>
              {!isPro && <ProBadge onClick={() => setShowUpgrade(true)} />}
            </div>
            <div className="flex gap-2">
              <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAI()}
                placeholder={isPro ? "e.g. Rajasthani sunset vibes..." : "Upgrade to Pro to use AI"}
                disabled={!isPro}
                className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 disabled:opacity-40" />
              <button onClick={handleAI} disabled={aiLoading || !isPro}
                className="px-3 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90 disabled:opacity-40 transition">
                {aiLoading ? "..." : "Go"}
              </button>
            </div>
            {aiResult && <p className="mt-2 text-xs text-white/50 leading-relaxed">{aiResult}</p>}
          </div>

          {/* Presets */}
          <div>
            <div className="flex gap-3 mb-3">
              <button onClick={() => setActiveTab("culture")}
                className={`text-[11px] font-bold tracking-wider pb-1 transition border-b-2 ${activeTab === "culture" ? "border-white text-white" : "border-transparent text-white/40"}`}>
                Indian Culture
              </button>
              <button onClick={() => setActiveTab("street")}
                className={`text-[11px] font-bold tracking-wider pb-1 transition border-b-2 ${activeTab === "street" ? "border-white text-white" : "border-transparent text-white/40"}`}>
                Street Style
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(activeTab === "culture" ? CULTURE_PRESETS : STREET_PRESETS).map(p => (
                <button key={p.name} onClick={() => { setColors(p.colors); setPattern(p.pattern); }}
                  className="py-2 px-1 rounded-lg text-[10px] font-semibold bg-white/8 border border-white/10 text-white/70 hover:bg-white/15 transition text-center">
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Color Palettes</p>
            <div className="grid grid-cols-4 gap-1.5">
              {PALETTES.map(p => (
                <button key={p.name} onClick={() => setColors(p.colors)} title={p.name}
                  className="h-8 rounded-lg border border-white/15 hover:scale-105 transition overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${p.colors.main} 50%, ${p.colors.accent} 50%)` }} />
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Custom Colors</p>
            <div className="space-y-2">
              {COLOR_LABELS.map(key => (
                <div key={key} className="flex items-center gap-3">
                  <input type="color" value={colors[key]}
                    onChange={e => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent" />
                  <span className="text-xs text-white/60">{COLOR_DISPLAY[key]}</span>
                  <span className="ml-auto text-[10px] text-white/30 font-mono">{colors[key].toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern / Texture */}
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Pattern / Texture</p>

            {/* Style tabs */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {PATTERN_STYLES.map(s => (
                <button key={s.id} onClick={() => setPatternStyle(s.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition ${patternStyle === s.id ? "bg-white text-black" : "bg-white/10 text-white/50 hover:bg-white/20"}`}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Patterns for selected style */}
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {(PATTERN_STYLES.find(s => s.id === patternStyle)?.patterns ?? []).map(p => (
                <button key={p.id} onClick={() => setPattern(p.id)}
                  className={`py-2 px-1 rounded-lg text-[10px] font-semibold transition text-center ${pattern === p.id ? "bg-white text-black" : "bg-white/8 border border-white/10 text-white/60 hover:bg-white/15"}`}>
                  {p.label}
                </button>
              ))}
            </div>

            {/* Intensity slider */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-white/40 w-16">Intensity</span>
              <input type="range" min="10" max="100" value={patternIntensity}
                onChange={e => setPatternIntensity(Number(e.target.value))}
                className="flex-1 accent-white"/>
              <span className="text-[10px] text-white/40 w-8 text-right">{patternIntensity}%</span>
            </div>

            {/* Zone picker */}
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Apply Pattern To</p>
            <div className="grid grid-cols-3 gap-1.5">
              {ZONES.map(z => (
                <button key={z.id} onClick={() => setPatternZone(z.id)}
                  className={`py-2 px-1 rounded-lg text-[10px] font-semibold transition text-center ${patternZone === z.id ? "bg-white text-black" : "bg-white/8 border border-white/10 text-white/60 hover:bg-white/15"}`}>
                  {z.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text / Logo */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Text / Logo</p>
              {!isPro && <ProBadge onClick={() => setShowUpgrade(true)} />}
            </div>
            {!isPro ? (
              <button onClick={() => setShowUpgrade(true)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white/40 hover:bg-white/10 transition text-center">
                🔒 Upgrade to Pro to add custom text & logo
              </button>
            ) : (
              <>
                <input type="text" value={textOverlay.text}
                  onChange={e => updateText({ text: e.target.value })}
                  placeholder="Type your brand name or logo text..."
                  className="w-full bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 mb-3" />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select value={textOverlay.font} onChange={e => updateText({ font: e.target.value })}
                    className="bg-white/8 border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none">
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Impact">Impact</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <input type="color" value={textOverlay.color}
                      onChange={e => updateText({ color: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent flex-shrink-0" />
                    <span className="text-[10px] text-white/40">Color</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-2">
                  <button onClick={() => updateText({ bold: !textOverlay.bold })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${textOverlay.bold ? "bg-white text-black" : "bg-white/10 text-white/60"}`}>B</button>
                  <button onClick={() => updateText({ italic: !textOverlay.italic })}
                    className={`px-3 py-1.5 rounded-lg text-xs italic transition ${textOverlay.italic ? "bg-white text-black" : "bg-white/10 text-white/60"}`}>I</button>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Size", key: "size" as const, min: 10, max: 80 },
                    { label: "Left ↔", key: "x" as const, min: 5, max: 95 },
                    { label: "Up ↕", key: "y" as const, min: 5, max: 95 },
                    { label: "Opacity", key: "opacity" as const, min: 10, max: 100 },
                  ].map(({ label, key, min, max }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-[10px] text-white/40 w-12">{label}</span>
                      <input type="range" min={min} max={max} value={textOverlay[key]}
                        onChange={e => updateText({ [key]: Number(e.target.value) })}
                        className="flex-1 accent-white" />
                      <span className="text-[10px] text-white/40 w-8 text-right">{textOverlay[key]}{key === "opacity" ? "%" : ""}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export */}
          <div>
            <button onClick={handleExport}
              className={`w-full py-3 rounded-xl text-sm font-bold transition ${isPro ? "bg-white text-black hover:bg-white/90" : "bg-white/10 text-white/40 hover:bg-white/15"}`}>
              {isPro ? "Export SVG" : "🔒 Export — Pro Only"}
            </button>
          </div>
        </div>

        {/* Right Panel — Canvas */}
        <div className="flex-1 flex flex-col bg-[#0d0d0d]">
          {/* View toggle */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button onClick={() => setView3D(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${!view3D ? "bg-white text-black" : "bg-white/10 text-white/50 hover:bg-white/15"}`}>
              2D Flat
            </button>
            <button onClick={() => setView3D(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${view3D ? "bg-white text-black" : "bg-white/10 text-white/50 hover:bg-white/15"}`}>
              ✦ 3D Live Preview
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            {view3D ? (
              <div className="w-full max-w-xl" style={{ height: "480px" }}>
                <Product3DViewer productType={product} colors={colors} pattern={pattern}/>
                <p className="text-center text-white/25 text-[10px] mt-2">Drag to rotate · Scroll to zoom</p>
              </div>
            ) : (
              <div id="product-canvas" className="w-full max-w-xl">
                <ProductCanvas productType={product} colors={colors} pattern={pattern}
                  patternIntensity={patternIntensity} patternZone={patternZone}
                  textOverlay={isPro ? textOverlay : undefined} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
