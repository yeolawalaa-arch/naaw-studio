"use client";
// TEMP visual-iteration page (not linked anywhere) for perfecting the mannequin.
// Renders representative garments "worn" on the male/female body. Delete before launch.
import Product3DViewer from "../../components/Product3DViewer";
import { defaultOptions } from "../../lib/productOptions";

const COLORS = { main: "#8a2230", secondary: "#34343a", accent: "#FFD700", detail: "#9a9a9a", lining: "#222222" };

const TILES: { product: string; gender: "male" | "female"; label: string }[] = [
  { product: "tshirt", gender: "male",   label: "T-Shirt - M" },
  { product: "tshirt", gender: "female", label: "T-Shirt - F" },
  { product: "hoodie", gender: "male",   label: "Hoodie - M" },
  { product: "jacket", gender: "male",   label: "Jacket - M" },
  { product: "shirt",  gender: "female", label: "Shirt - F" },
  { product: "jeans",  gender: "male",   label: "Jeans - M" },
  { product: "shorts", gender: "female", label: "Shorts - F" },
  { product: "kurta",  gender: "male",   label: "Kurta - M" },
  { product: "saree",  gender: "female", label: "Saree - F" },
];

export default function BodyLab() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {TILES.map((t) => (
          <div key={t.label} style={{ background: "#0d0d0d", borderRadius: 12, overflow: "hidden", border: "1px solid #222" }}>
            <div style={{ color: "#fff", font: "600 13px system-ui, sans-serif", padding: "5px 10px" }}>{t.label}</div>
            <div style={{ height: 285 }}>
              <Product3DViewer
                productType={t.product}
                colors={COLORS}
                pattern="solid"
                options={defaultOptions(t.product)}
                showBody
                bodyGender={t.gender}
                still
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
