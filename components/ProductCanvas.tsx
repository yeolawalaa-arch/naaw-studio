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
  | "sneaker-low" | "sneaker-high" | "boot" | "sandal" | "slip-on"
  | "cap" | "beanie" | "bucket-hat"
  | "backpack" | "tote";

import dynamic from "next/dynamic";

const products: Record<ProductType, React.ComponentType<{colors: ProductColors; pattern: string}>> = {
  "tshirt":      dynamic(() => import("./products/TShirt")),
  "shirt":       dynamic(() => import("./products/Shirt")),
  "polo":        dynamic(() => import("./products/Polo")),
  "hoodie":      dynamic(() => import("./products/Hoodie")),
  "jacket":      dynamic(() => import("./products/Jacket")),
  "bomber":      dynamic(() => import("./products/Bomber")),
  "shorts":      dynamic(() => import("./products/Shorts")),
  "joggers":     dynamic(() => import("./products/Joggers")),
  "jeans":       dynamic(() => import("./products/Jeans")),
  "sneaker-low": dynamic(() => import("./products/SneakerLow")),
  "sneaker-high":dynamic(() => import("./products/SneakerHigh")),
  "boot":        dynamic(() => import("./products/Boot")),
  "sandal":      dynamic(() => import("./products/Sandal")),
  "slip-on":     dynamic(() => import("./products/SlipOn")),
  "cap":         dynamic(() => import("./products/Cap")),
  "beanie":      dynamic(() => import("./products/Beanie")),
  "bucket-hat":  dynamic(() => import("./products/BucketHat")),
  "backpack":    dynamic(() => import("./products/Backpack")),
  "tote":        dynamic(() => import("./products/Tote")),
};

import React from "react";

export default function ProductCanvas({ productType, colors, pattern }: {
  productType: ProductType;
  colors: ProductColors;
  pattern: string;
}) {
  const Component = products[productType];
  if (!Component) return null;
  return <Component colors={colors} pattern={pattern}/>;
}
