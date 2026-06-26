"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ProductType, ProductColors, TextOverlay } from "../../components/ProductCanvas";

const ProductCanvas = dynamic(() => import("../../components/ProductCanvas"), { ssr: false });

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
];

const CATEGORIES = ["Tops", "Bottoms", "Footwear", "Hats", "Bags"];

const PATTERNS = [
  { id: "solid", label: "Solid" },
  { id: "gradient", label: "Gradient" },
  { id: "bandhani", label: "Bandhani" },
  { id: "ikat", label: "Ikat" },
  { id: "ajrakh", label: "Ajrakh" },
  { id: "phulkari", label: "Phulkari" },
  { id: "kalamkari", label: "Kalamkari" },
  { id: "madhubani", label: "Madhubani" },
  { id: "warli", label: "Warli" },
  { id: "leheriya", label: "Leheriya" },
  { id: "geometric", label: "Geometric" },
  { id: "camo", label: "Camo" },
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
  main: "Main Color",
  secondary: "Secondary",
  accent: "Accent / Stripe",
  detail: "Detail",
  lining: "Lining / Inner",
};

const DEFAULT_COLORS: ProductColors = {
  main: "#111111", secondary: "#1a1a1a", accent: "#FFD700", detail: "#888888", lining: "#222222"
};

export default function StudioPage() {
  const [product, setProduct] = useState<ProductType>("tshirt");
  const [activeCategory, setActiveCategory] = useState("Tops");
  const [colors, setColors] = useState<ProductColors>(DEFAULT_COLORS);
  const [pattern, setPattern] = useState("solid");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"culture" | "street">("culture");
  const [textOverlay, setTextOverlay] = useState<TextOverlay>({
    text: "",
    color: "#ffffff",
    size: 28,
    x: 50,
    y: 50,
    font: "Arial",
    bold: true,
    italic: false,
    opacity: 90,
    _onDrag: (x: number, y: number) => setTextOverlay(prev => ({ ...prev, x, y })),
  } as TextOverlay);

  const updateText = (patch: Partial<TextOverlay>) =>
    setTextOverlay(prev => ({ ...prev, ...patch }));

  const handleAI = async () => {
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
      setAiResult("AI se connect nahi ho paya, manually design karo.");
    }
    setAiLoading(false);
  };

  const handleExport = () => {
    const svg = document.querySelector("#product-canvas svg") as SVGElement;
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `naaw-${product}.svg`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <a href="/" className="text-xl font-black tracking-widest text-white">NAAW</a>
        <span className="text-xs text-white/40 tracking-widest uppercase">Design Studio</span>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-white/90 transition"
        >
          Export SVG
        </button>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)]">
        {/* Left Panel */}
        <div className="lg:w-[340px] flex-shrink-0 overflow-y-auto border-r border-white/10 p-5 space-y-6">

          {/* Product Picker */}
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Product Type</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${activeCategory === cat ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {PRODUCTS.filter(p => p.category === activeCategory).map(p => (
                <button
                  key={p.type}
                  onClick={() => setProduct(p.type)}
                  className={`py-2 px-1 rounded-lg text-[11px] font-semibold transition text-center ${product === p.type ? "bg-white text-black" : "bg-white/8 border border-white/10 text-white/70 hover:bg-white/15"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Prompt */}
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">AI Design Generator</p>
            <div className="flex gap-2">
              <input
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAI()}
                placeholder="e.g. Rajasthani sunset vibes..."
                className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40"
              />
              <button
                onClick={handleAI}
                disabled={aiLoading}
                className="px-3 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 transition"
              >
                {aiLoading ? "..." : "Go"}
              </button>
            </div>
            {aiResult && (
              <p className="mt-2 text-xs text-white/50 leading-relaxed">{aiResult}</p>
            )}
          </div>

          {/* Presets */}
          <div>
            <div className="flex gap-3 mb-3">
              <button
                onClick={() => setActiveTab("culture")}
                className={`text-[11px] font-bold tracking-wider pb-1 transition border-b-2 ${activeTab === "culture" ? "border-white text-white" : "border-transparent text-white/40"}`}
              >
                Indian Culture
              </button>
              <button
                onClick={() => setActiveTab("street")}
                className={`text-[11px] font-bold tracking-wider pb-1 transition border-b-2 ${activeTab === "street" ? "border-white text-white" : "border-transparent text-white/40"}`}
              >
                Street Style
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(activeTab === "culture" ? CULTURE_PRESETS : STREET_PRESETS).map(p => (
                <button
                  key={p.name}
                  onClick={() => { setColors(p.colors); setPattern(p.pattern); }}
                  className="py-2 px-1 rounded-lg text-[10px] font-semibold bg-white/8 border border-white/10 text-white/70 hover:bg-white/15 transition text-center"
                >
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
                <button
                  key={p.name}
                  onClick={() => setColors(p.colors)}
                  title={p.name}
                  className="h-8 rounded-lg border border-white/15 hover:scale-105 transition overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${p.colors.main} 50%, ${p.colors.accent} 50%)` }}
                />
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Custom Colors</p>
            <div className="space-y-2">
              {COLOR_LABELS.map(key => (
                <div key={key} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors[key]}
                    onChange={e => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs text-white/60">{COLOR_DISPLAY[key]}</span>
                  <span className="ml-auto text-[10px] text-white/30 font-mono">{colors[key].toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern Picker */}
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Pattern / Texture</p>
            <div className="grid grid-cols-3 gap-1.5">
              {PATTERNS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPattern(p.id)}
                  className={`py-2 px-1 rounded-lg text-[10px] font-semibold transition text-center ${pattern === p.id ? "bg-white text-black" : "bg-white/8 border border-white/10 text-white/60 hover:bg-white/15"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text / Logo Overlay */}
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Text / Logo</p>
            <input
              type="text"
              value={textOverlay.text}
              onChange={e => updateText({ text: e.target.value })}
              placeholder="Apna naam ya brand likho..."
              className="w-full bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 mb-3"
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select
                value={textOverlay.font}
                onChange={e => updateText({ font: e.target.value })}
                className="bg-white/8 border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Impact">Impact</option>
                <option value="Courier New">Courier New</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textOverlay.color}
                  onChange={e => updateText({ color: e.target.value })}
                  className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent flex-shrink-0"
                />
                <span className="text-[10px] text-white/40">Color</span>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => updateText({ bold: !textOverlay.bold })}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${textOverlay.bold ? "bg-white text-black" : "bg-white/10 text-white/60"}`}
              >B</button>
              <button
                onClick={() => updateText({ italic: !textOverlay.italic })}
                className={`px-3 py-1.5 rounded-lg text-xs italic transition ${textOverlay.italic ? "bg-white text-black" : "bg-white/10 text-white/60"}`}
              >I</button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 w-12">Size</span>
                <input type="range" min="10" max="80" value={textOverlay.size}
                  onChange={e => updateText({ size: Number(e.target.value) })}
                  className="flex-1 accent-white" />
                <span className="text-[10px] text-white/40 w-6">{textOverlay.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 w-12">Left↔</span>
                <input type="range" min="5" max="95" value={textOverlay.x}
                  onChange={e => updateText({ x: Number(e.target.value) })}
                  className="flex-1 accent-white" />
                <span className="text-[10px] text-white/40 w-6">{textOverlay.x}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 w-12">Up↕</span>
                <input type="range" min="5" max="95" value={textOverlay.y}
                  onChange={e => updateText({ y: Number(e.target.value) })}
                  className="flex-1 accent-white" />
                <span className="text-[10px] text-white/40 w-6">{textOverlay.y}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 w-12">Opacity</span>
                <input type="range" min="10" max="100" value={textOverlay.opacity}
                  onChange={e => updateText({ opacity: Number(e.target.value) })}
                  className="flex-1 accent-white" />
                <span className="text-[10px] text-white/40 w-6">{textOverlay.opacity}%</span>
              </div>
            </div>
            {textOverlay.text && (
              <p className="mt-2 text-[10px] text-white/30">Canvas pe text ko drag karke bhi move kar sakte ho</p>
            )}
          </div>
        </div>

        {/* Right Panel — Canvas */}
        <div className="flex-1 flex items-center justify-center bg-[#0d0d0d] p-6">
          <div id="product-canvas" className="w-full max-w-xl">
            <ProductCanvas productType={product} colors={colors} pattern={pattern} textOverlay={textOverlay} />
          </div>
        </div>
      </div>
    </div>
  );
}
