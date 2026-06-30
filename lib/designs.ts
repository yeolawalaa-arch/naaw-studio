// ──────────────────────────────────────────────────────────────
// Client-side design persistence. Saves the full studio state so a
// user can come back to their work. localStorage today; the same
// shape can later sync to a DB for cross-device cloud projects.
// ──────────────────────────────────────────────────────────────
import type { ProductColors, TextOverlay } from "../components/ProductCanvas";

export interface DesignState {
  product: string;
  activeCategory: string;
  gender: "unisex" | "men" | "women";
  colors: ProductColors;
  pattern: string;
  patternStyle: string;
  patternZone: string;
  patternIntensity: number;
  options: Record<string, string>;
  textOverlay: TextOverlay;
  printImage: { src: string; x: number; y: number; scale: number; opacity: number } | null;
  bodyMode: "none" | "male" | "female";
  pose: string;
  view3D: boolean;
}

export interface SavedDesign {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumb?: string; // small dataURL preview
  state: DesignState;
}

const KEY = "naaw_designs_v1";

export function listDesigns(): SavedDesign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as SavedDesign[]) : [];
    return Array.isArray(arr) ? arr.sort((a, b) => b.updatedAt - a.updatedAt) : [];
  } catch {
    return [];
  }
}

function persist(all: SavedDesign[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Quota exceeded (usually too many large thumbnails) — drop thumbs and retry.
    try {
      window.localStorage.setItem(KEY, JSON.stringify(all.map((d) => ({ ...d, thumb: undefined }))));
    } catch { /* give up silently */ }
  }
}

// Create a new design or update an existing one (matched by id).
export function saveDesign(input: { id?: string; name: string; state: DesignState; thumb?: string }): SavedDesign {
  const all = listDesigns();
  const now = Date.now();
  if (input.id) {
    const idx = all.findIndex((d) => d.id === input.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], name: input.name, state: input.state, thumb: input.thumb ?? all[idx].thumb, updatedAt: now };
      persist(all);
      return all[idx];
    }
  }
  const design: SavedDesign = {
    id: Math.random().toString(36).slice(2, 10),
    name: input.name,
    createdAt: now,
    updatedAt: now,
    thumb: input.thumb,
    state: input.state,
  };
  persist([design, ...all]);
  return design;
}

export function deleteDesign(id: string): void {
  persist(listDesigns().filter((d) => d.id !== id));
}

export function renameDesign(id: string, name: string): void {
  const all = listDesigns();
  const idx = all.findIndex((d) => d.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], name, updatedAt: Date.now() };
    persist(all);
  }
}
