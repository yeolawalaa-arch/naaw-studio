"use client";

export interface ProductColors {
  main: string;
  secondary: string;
  accent: string;
  detail: string;
  lining: string;
}

export type ProductType =
  | "tshirt" | "shirt" | "polo" | "hoodie" | "jacket" | "bomber"
  | "shorts" | "joggers" | "jeans"
  | "saree" | "lehenga" | "anarkali" | "salwar-kameez" | "kurti"
  | "kurta" | "sherwani" | "nehru-jacket" | "pathani" | "dhoti"
  | "sneaker-low" | "sneaker-high" | "boot" | "sandal" | "slip-on"
  | "cap" | "beanie" | "bucket-hat"
  | "backpack" | "tote"
  | "watch" | "sunglasses" | "belt" | "chain" | "wallet" | "scarf" | "socks" | "phone-case" | "ring" | "earrings";

export interface TextOverlay {
  text: string;
  color: string;
  size: number;
  x: number;
  y: number;
  font: string;
  bold: boolean;
  italic: boolean;
  opacity: number;
  _onDrag?: (x: number, y: number) => void;
}

export interface PrintImage {
  src: string;
  x: number;       // centre X, 0-100 %
  y: number;       // centre Y, 0-100 %
  scale: number;   // width as % of canvas
  opacity: number; // 0-100
  _onDrag?: (x: number, y: number) => void;
}

import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";

const products: Record<ProductType, React.ComponentType<{colors: ProductColors; pattern: string; patternIntensity?: number; patternZone?: string}>> = {
  "tshirt":       dynamic(() => import("./products/TShirt")),
  "shirt":        dynamic(() => import("./products/Shirt")),
  "polo":         dynamic(() => import("./products/Polo")),
  "hoodie":       dynamic(() => import("./products/Hoodie")),
  "jacket":       dynamic(() => import("./products/Jacket")),
  "bomber":       dynamic(() => import("./products/Bomber")),
  "shorts":       dynamic(() => import("./products/Shorts")),
  "joggers":      dynamic(() => import("./products/Joggers")),
  "jeans":        dynamic(() => import("./products/Jeans")),
  "saree":        dynamic(() => import("./products/Saree")),
  // Traditional wear — 3D only, show prompt in 2D view
  "lehenga": () => <AccessoryPrompt label="Lehenga"/>,
  "anarkali": () => <AccessoryPrompt label="Anarkali Suit"/>,
  "salwar-kameez": () => <AccessoryPrompt label="Salwar Kameez"/>,
  "kurti": () => <AccessoryPrompt label="Kurti"/>,
  "kurta": () => <AccessoryPrompt label="Kurta"/>,
  "sherwani": () => <AccessoryPrompt label="Sherwani"/>,
  "nehru-jacket": () => <AccessoryPrompt label="Nehru Jacket"/>,
  "pathani": () => <AccessoryPrompt label="Pathani Suit"/>,
  "dhoti": () => <AccessoryPrompt label="Dhoti"/>,
  "sneaker-low":  dynamic(() => import("./products/SneakerLow")),
  "sneaker-high": dynamic(() => import("./products/SneakerHigh")),
  "boot":         dynamic(() => import("./products/Boot")),
  "sandal":       dynamic(() => import("./products/Sandal")),
  "slip-on":      dynamic(() => import("./products/SlipOn")),
  "cap":          dynamic(() => import("./products/Cap")),
  "beanie":       dynamic(() => import("./products/Beanie")),
  "bucket-hat":   dynamic(() => import("./products/BucketHat")),
  "backpack":     dynamic(() => import("./products/Backpack")),
  "tote":         dynamic(() => import("./products/Tote")),
  // Accessories — 3D only, show prompt in 2D view
  "watch": () => <AccessoryPrompt label="Watch"/>,
  "sunglasses": () => <AccessoryPrompt label="Sunglasses"/>,
  "belt": () => <AccessoryPrompt label="Belt"/>,
  "chain": () => <AccessoryPrompt label="Chain"/>,
  "wallet": () => <AccessoryPrompt label="Wallet"/>,
  "scarf": () => <AccessoryPrompt label="Scarf"/>,
  "socks": () => <AccessoryPrompt label="Socks"/>,
  "phone-case": () => <AccessoryPrompt label="Phone Case"/>,
  "ring": () => <AccessoryPrompt label="Ring"/>,
  "earrings": () => <AccessoryPrompt label="Earrings"/>,
};

function AccessoryPrompt({ label }: { label: string }) {
  return (
    <div className="w-full flex items-center justify-center" style={{ background: "#111", aspectRatio: "1/1" }}>
      <div className="text-center">
        <p className="text-white/20 text-4xl mb-3">✦</p>
        <p className="text-white/50 text-sm font-bold">{label}</p>
        <p className="text-white/25 text-xs mt-1">Switch to 3D Live Preview to see this product</p>
      </div>
    </div>
  );
}

export default function ProductCanvas({ productType, colors, pattern, textOverlay, printImage, patternIntensity, patternZone }: {
  productType: ProductType;
  colors: ProductColors;
  pattern: string;
  textOverlay?: TextOverlay;
  printImage?: PrintImage;
  patternIntensity?: number;
  patternZone?: string;
}) {
  const Component = products[productType];
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dragTarget, setDragTarget] = useState<null | "text" | "image">(null);

  if (!Component) return null;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragTarget || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    if (dragTarget === "text") textOverlay?._onDrag?.(x, y);
    else if (dragTarget === "image") printImage?._onDrag?.(x, y);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setDragTarget(null)}
      onMouseLeave={() => setDragTarget(null)}
    >
      <Component colors={colors} pattern={pattern} patternIntensity={patternIntensity} patternZone={patternZone} />
      {printImage?.src && (
        <div className="absolute inset-0 pointer-events-none" style={{ userSelect: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={printImage.src}
            alt="custom print"
            draggable={false}
            className="absolute cursor-move pointer-events-auto"
            style={{
              left: `${printImage.x}%`,
              top: `${printImage.y}%`,
              width: `${printImage.scale}%`,
              transform: "translate(-50%, -50%)",
              opacity: printImage.opacity / 100,
              userSelect: "none",
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))",
            }}
            onMouseDown={() => setDragTarget("image")}
            title="Drag to move"
          />
        </div>
      )}
      {textOverlay?.text && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ userSelect: "none" }}
        >
          <div
            className="absolute cursor-move pointer-events-auto"
            style={{
              left: `${textOverlay.x}%`,
              top: `${textOverlay.y}%`,
              transform: "translate(-50%, -50%)",
              color: textOverlay.color,
              fontSize: `${textOverlay.size}px`,
              fontFamily: textOverlay.font,
              fontWeight: textOverlay.bold ? "900" : "400",
              fontStyle: textOverlay.italic ? "italic" : "normal",
              opacity: textOverlay.opacity / 100,
              letterSpacing: "0.05em",
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
            }}
            onMouseDown={() => setDragTarget("text")}
            title="Drag to move"
          >
            {textOverlay.text}
          </div>
        </div>
      )}
    </div>
  );
}
