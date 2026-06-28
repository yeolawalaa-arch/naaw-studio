"use client";
// TEMP visual-iteration page (not linked anywhere) for perfecting the mannequin.
// Renders representative garments + accessories "worn" on the male/female body.
// Only ONE group (4 tiles) renders at once to stay under the browser's ~16 WebGL
// context limit. Switch groups via the buttons up top. Delete before launch.
import { useState } from "react";
import Product3DViewer from "../../components/Product3DViewer";
import { defaultOptions } from "../../lib/productOptions";

const COLORS = { main: "#8a2230", secondary: "#34343a", accent: "#FFD700", detail: "#9a9a9a", lining: "#222222" };

type Tile = { product: string; gender: "male" | "female"; label: string };

const GROUPS: { id: string; name: string; tiles: Tile[] }[] = [
  {
    id: "garments",
    name: "Garments",
    tiles: [
      { product: "tshirt", gender: "male", label: "T-Shirt - M" },
      { product: "jeans", gender: "male", label: "Jeans - M" },
      { product: "kurta", gender: "male", label: "Kurta - M" },
      { product: "saree", gender: "female", label: "Saree - F" },
    ],
  },
  {
    id: "head",
    name: "Headwear / Face",
    tiles: [
      { product: "cap", gender: "male", label: "Cap - M" },
      { product: "beanie", gender: "male", label: "Beanie - M" },
      { product: "bucket-hat", gender: "male", label: "Bucket - M" },
      { product: "sunglasses", gender: "male", label: "Sunglasses - M" },
    ],
  },
  {
    id: "neck",
    name: "Neck / Ears / Waist",
    tiles: [
      { product: "chain", gender: "male", label: "Chain - M" },
      { product: "scarf", gender: "male", label: "Scarf - M" },
      { product: "earrings", gender: "female", label: "Earrings - F" },
      { product: "belt", gender: "male", label: "Belt - M" },
    ],
  },
  {
    id: "hand",
    name: "Wrist / Hand",
    tiles: [
      { product: "watch", gender: "male", label: "Watch - M" },
      { product: "ring", gender: "female", label: "Ring - F" },
      { product: "wallet", gender: "male", label: "Wallet - M" },
      { product: "phone-case", gender: "male", label: "Phone - M" },
    ],
  },
  {
    id: "bags",
    name: "Bags / Sneakers",
    tiles: [
      { product: "backpack", gender: "male", label: "Backpack - M" },
      { product: "tote", gender: "female", label: "Tote - F" },
      { product: "sneaker-low", gender: "male", label: "Sneaker Lo - M" },
      { product: "sneaker-high", gender: "male", label: "Sneaker Hi - M" },
    ],
  },
  {
    id: "feet",
    name: "Footwear",
    tiles: [
      { product: "boot", gender: "male", label: "Boot - M" },
      { product: "sandal", gender: "female", label: "Sandal - F" },
      { product: "slip-on", gender: "male", label: "Slip-On - M" },
      { product: "socks", gender: "male", label: "Socks - M" },
    ],
  },
];

export default function BodyLab() {
  const [gid, setGid] = useState("garments");
  const group = GROUPS.find((x) => x.id === gid) || GROUPS[0];
  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {GROUPS.map((x) => (
          <button
            key={x.id}
            onClick={() => setGid(x.id)}
            style={{
              color: x.id === group.id ? "#000" : "#fff",
              background: x.id === group.id ? "#FFD700" : "#1a1a1a",
              font: "600 12px system-ui, sans-serif",
              padding: "6px 12px",
              borderRadius: 8,
              cursor: "pointer",
              border: "1px solid #333",
            }}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {group.tiles.map((t) => (
          <div key={t.label} style={{ background: "#0d0d0d", borderRadius: 12, overflow: "hidden", border: "1px solid #222" }}>
            <div style={{ color: "#fff", font: "600 13px system-ui, sans-serif", padding: "6px 10px" }}>{t.label}</div>
            <div style={{ height: 340 }}>
              <Product3DViewer
                productType={t.product}
                colors={COLORS}
                pattern="solid"
                options={defaultOptions(t.product)}
                showBody
                bodyGender={t.gender}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
