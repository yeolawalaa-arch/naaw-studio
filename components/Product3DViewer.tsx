"use client";
import { useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, RoundedBox, Cylinder, Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { ProductColors } from "./ProductCanvas";
import { METALS, SHELLS, FABRICS, GEMS, LENS_TYPES, LENS_COLORS, FabricSpec, PART_COLORS } from "../lib/productOptions";

// Resolve a per-part colour option id → hex (falls back to a given colour).
const partColor = (id: string | undefined, fallback: string): string => (id && PART_COLORS[id]) || fallback;

type Opts = Record<string, string> | undefined;

// ── Canvas texture for 3D pattern material ──
function makeTexture(colors: ProductColors, pattern: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = colors.main;
  ctx.fillRect(0, 0, size, size);
  const ac = colors.accent;

  if (pattern === "bandhani") {
    for (let y = 0; y < size; y += 48) for (let x = 0; x < size; x += 48) {
      ctx.strokeStyle = ac; ctx.globalAlpha = 0.42; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x+24,y+24,17,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.35;
      ctx.beginPath(); ctx.arc(x+24,y+24,5,0,Math.PI*2); ctx.fill();
    }
  } else if (pattern === "ikat") {
    ctx.globalAlpha = 0.38;
    for (let y = 0; y < size; y += 44) for (let x = 0; x < size; x += 44) {
      ctx.fillStyle = ac;
      ctx.beginPath(); ctx.moveTo(x+22,y+4); ctx.lineTo(x+40,y+22); ctx.lineTo(x+22,y+40); ctx.lineTo(x+4,y+22); ctx.closePath(); ctx.fill();
    }
  } else if (pattern === "gradient") {
    const g = ctx.createLinearGradient(0,0,size,size);
    g.addColorStop(0,colors.main); g.addColorStop(1,colors.accent);
    ctx.fillStyle = g; ctx.globalAlpha = 1; ctx.fillRect(0,0,size,size);
  } else if (pattern === "plaid") {
    ctx.globalAlpha = 0.38;
    for (let i = 0; i < size; i += 48) {
      ctx.fillStyle = ac; ctx.fillRect(i,0,14,size); ctx.fillRect(0,i,size,14);
    }
    ctx.globalAlpha = 0.18; ctx.fillStyle = colors.detail;
    for (let i = 24; i < size; i += 48) {
      ctx.fillRect(i,0,6,size); ctx.fillRect(0,i,size,6);
    }
  } else if (pattern === "sashiko") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.38; ctx.lineWidth = 2;
    for (let y = 0; y < size; y += 48) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(size,y); ctx.stroke(); }
    for (let x = 0; x < size; x += 48) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,size); ctx.stroke(); }
    for (let y = 0; y < size; y += 48) for (let x = 0; x < size; x += 48) {
      ctx.beginPath(); ctx.arc(x,y,12,0,Math.PI*2); ctx.stroke();
    }
  } else if (pattern === "kente") {
    ctx.globalAlpha = 0.38;
    for (let y = 0; y < size; y += 40) for (let x = 0; x < size; x += 40) {
      ctx.fillStyle = (x+y) % 80 === 0 ? ac : colors.detail;
      ctx.fillRect(x,y,20,20);
    }
    ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.globalAlpha = 0.3;
    for (let y = 0; y < size; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(size,y); ctx.stroke(); }
  } else if (pattern === "camo") {
    const blobs: [number,number,number,number,number][] = [
      [80,80,90,60,0.35],[250,60,80,55,0.32],[160,180,100,65,0.38],
      [340,200,85,50,0.3],[70,310,95,55,0.35],[310,340,80,60,0.32],[430,100,70,45,0.28]
    ];
    blobs.forEach(([x,y,rx,ry,a]) => {
      ctx.globalAlpha = a; ctx.fillStyle = ac;
      ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0.4,0,Math.PI*2); ctx.fill();
    });
  } else if (pattern === "tiedye") {
    for (let r = 220; r > 0; r -= 28) {
      ctx.strokeStyle = r % 56 === 0 ? ac : colors.secondary;
      ctx.lineWidth = 16; ctx.globalAlpha = 0.2;
      ctx.beginPath(); ctx.arc(256,256,r,0,Math.PI*2); ctx.stroke();
    }
  } else if (pattern === "dots") {
    ctx.fillStyle = ac; ctx.globalAlpha = 0.42;
    for (let y = 22; y < size; y += 32) for (let x = 22; x < size; x += 32) {
      ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();
    }
  } else if (pattern === "geometric") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.38; ctx.lineWidth = 2.5;
    for (let y = 0; y < size; y += 44) for (let x = 0; x < size; x += 44) {
      ctx.beginPath(); ctx.moveTo(x+22,y+2); ctx.lineTo(x+42,y+22); ctx.lineTo(x+22,y+42); ctx.lineTo(x+2,y+22); ctx.closePath(); ctx.stroke();
      ctx.globalAlpha = 0.15; ctx.fillStyle = ac; ctx.beginPath(); ctx.moveTo(x+22,y+10); ctx.lineTo(x+34,y+22); ctx.lineTo(x+22,y+34); ctx.lineTo(x+10,y+22); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 0.38;
    }
  } else if (pattern === "diagonal") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.32; ctx.lineWidth = 4;
    for (let i = -size; i < size*2; i += 28) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i+size,size); ctx.stroke(); }
  } else if (pattern === "houndstooth") {
    ctx.globalAlpha = 0.38;
    for (let y = 0; y < size; y += 32) for (let x = 0; x < size; x += 32) {
      ctx.fillStyle = (x/32 + y/32) % 2 === 0 ? ac : "transparent";
      ctx.fillRect(x,y,16,16);
      if ((x/32 + y/32) % 2 === 0) { ctx.fillRect(x+16,y+16,16,16); }
    }
  } else if (pattern === "argyle") {
    ctx.globalAlpha = 0.35;
    for (let y = 0; y < size; y += 60) for (let x = 0; x < size; x += 60) {
      ctx.fillStyle = ac;
      ctx.beginPath(); ctx.moveTo(x+30,y); ctx.lineTo(x+60,y+30); ctx.lineTo(x+30,y+60); ctx.lineTo(x,y+30); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = colors.detail; ctx.globalAlpha = 0.2; ctx.lineWidth = 1;
    for (let i = -size; i < size*2; i += 30) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i+size,size); ctx.stroke(); }
    for (let i = -size; i < size*2; i += 30) { ctx.beginPath(); ctx.moveTo(size-i,0); ctx.lineTo(-i,size); ctx.stroke(); }
  } else if (pattern === "chevron") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.4; ctx.lineWidth = 10; ctx.lineJoin = "miter";
    for (let y = 0; y < size; y += 40) {
      ctx.beginPath();
      for (let x = 0; x < size; x += 80) {
        ctx.moveTo(x,y+20); ctx.lineTo(x+40,y); ctx.lineTo(x+80,y+20);
      }
      ctx.stroke();
    }
  } else if (pattern === "aztec") {
    ctx.globalAlpha = 0.38;
    for (let y = 0; y < size; y += 48) for (let x = 0; x < size; x += 48) {
      ctx.fillStyle = ac;
      ctx.fillRect(x+4,y+4,16,4); ctx.fillRect(x+4,y+4,4,16);
      ctx.fillRect(x+28,y+4,16,4); ctx.fillRect(x+40,y+4,4,16);
      ctx.fillRect(x+4,y+28,4,16); ctx.fillRect(x+4,y+40,16,4);
      ctx.fillRect(x+28,y+40,16,4); ctx.fillRect(x+40,y+28,4,16);
      ctx.strokeStyle = ac; ctx.lineWidth = 2;
      ctx.strokeRect(x+18,y+18,12,12);
    }
  } else if (pattern === "nordic") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.42; ctx.lineWidth = 3;
    for (let y = 0; y < size; y += 50) for (let x = 0; x < size; x += 50) {
      ctx.beginPath(); ctx.moveTo(x+25,y+5); ctx.lineTo(x+25,y+45); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+5,y+25); ctx.lineTo(x+45,y+25); ctx.stroke();
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x+10,y+10); ctx.lineTo(x+40,y+40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+40,y+10); ctx.lineTo(x+10,y+40); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.45;
      ctx.beginPath(); ctx.arc(x+25,y+25,4,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = 0.42;
    }
  } else if (pattern === "kikko") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.42; ctx.lineWidth = 2;
    const hw = 22; const hh = 13;
    for (let row = -1; row < size/hh/2+2; row++) for (let col = -1; col < size/hw+2; col++) {
      const ox = col*hw + (row%2)*hw/2; const oy = row*hh*2;
      ctx.beginPath();
      ctx.moveTo(ox+hw/2,oy); ctx.lineTo(ox+hw,oy+hh); ctx.lineTo(ox+hw,oy+hh*2);
      ctx.lineTo(ox+hw/2,oy+hh*3); ctx.lineTo(ox,oy+hh*2); ctx.lineTo(ox,oy+hh); ctx.closePath();
      ctx.stroke();
    }
  } else if (pattern === "moroccan") {
    ctx.globalAlpha = 0.38;
    for (let y = 0; y < size; y += 56) for (let x = 0; x < size; x += 56) {
      ctx.strokeStyle = ac; ctx.lineWidth = 2;
      const pts = Array.from({length:8},(_,i) => {
        const a = i*Math.PI/4; const r = i%2===0?26:18;
        return [x+28+r*Math.cos(a), y+28+r*Math.sin(a)];
      });
      ctx.beginPath(); pts.forEach(([px,py],i) => i===0?ctx.moveTo(px,py):ctx.lineTo(px,py)); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.14;
      ctx.beginPath(); pts.forEach(([px,py],i) => i===0?ctx.moveTo(px,py):ctx.lineTo(px,py)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 0.38;
    }
  } else if (pattern === "kilim") {
    ctx.globalAlpha = 0.38;
    for (let y = 0; y < size; y += 28) for (let x = 0; x < size; x += 28) {
      ctx.fillStyle = (x/28+y/28)%2===0 ? ac : colors.detail;
      ctx.beginPath(); ctx.moveTo(x+14,y); ctx.lineTo(x+28,y+28); ctx.lineTo(x,y+28); ctx.closePath(); ctx.fill();
    }
  } else if (pattern === "batik") {
    for (let y = 0; y < size; y += 70) for (let x = 0; x < size; x += 70) {
      ctx.strokeStyle = ac; ctx.globalAlpha = 0.35; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(x+20,y+20,18,12,0.5,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x+50,y+50,15,10,-0.4,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.arc(x+35,y+35,4,0,Math.PI*2); ctx.fill();
    }
  } else if (pattern === "greek-key") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.4; ctx.lineWidth = 3;
    const unit = 16;
    for (let y = 0; y < size; y += unit*4) {
      for (let x = 0; x < size; x += unit*4) {
        ctx.beginPath();
        ctx.moveTo(x,y+unit); ctx.lineTo(x+unit*2,y+unit); ctx.lineTo(x+unit*2,y); ctx.lineTo(x+unit*3,y); ctx.lineTo(x+unit*3,y+unit*2);
        ctx.lineTo(x+unit,y+unit*2); ctx.lineTo(x+unit,y+unit*3); ctx.lineTo(x+unit*4,y+unit*3);
        ctx.stroke();
      }
    }
  } else if (pattern === "adinkra") {
    for (let y = 0; y < size; y += 56) for (let x = 0; x < size; x += 56) {
      ctx.strokeStyle = ac; ctx.globalAlpha = 0.38; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x+28,y+28,20,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x+28,y+28,10,0,Math.PI*2); ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x+28,y+8); ctx.lineTo(x+28,y+48); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+8,y+28); ctx.lineTo(x+48,y+28); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.arc(x+28,y+28,3,0,Math.PI*2); ctx.fill(); ctx.globalAlpha = 0.38;
    }
  } else if (pattern === "celtic") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.4; ctx.lineWidth = 3;
    for (let y = 0; y < size; y += 56) for (let x = 0; x < size; x += 56) {
      ctx.beginPath(); ctx.arc(x+28,y+28,22,0,Math.PI*2); ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x+28,y+28,12,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+6,y+6); ctx.lineTo(x+50,y+50); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+50,y+6); ctx.lineTo(x+6,y+50); ctx.stroke();
    }
  } else if (pattern === "suzani") {
    for (let y = 0; y < size; y += 70) for (let x = 0; x < size; x += 70) {
      ctx.strokeStyle = ac; ctx.globalAlpha = 0.32; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x+35,y+35,26,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x+35,y+35,14,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle = ac;
      for (let a = 0; a < 8; a++) {
        const ang = a*Math.PI/4;
        ctx.globalAlpha = 0.35;
        ctx.beginPath(); ctx.arc(x+35+26*Math.cos(ang), y+35+26*Math.sin(ang),4,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 0.45;
      ctx.beginPath(); ctx.arc(x+35,y+35,4,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = 0.32;
    }
  } else if (pattern === "persian") {
    for (let y = 0; y < size; y += 64) for (let x = 0; x < size; x += 64) {
      ctx.strokeStyle = ac; ctx.globalAlpha = 0.35; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(x+32,y+32,22,28,0,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x+32,y+32,10,14,0,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.arc(x+32,y+32,3,0,Math.PI*2); ctx.fill(); ctx.globalAlpha = 0.35;
    }
  } else if (pattern === "phulkari") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.42; ctx.lineWidth = 2.5;
    for (let y = 0; y < size; y += 40) for (let x = 0; x < size; x += 40) {
      ctx.beginPath(); ctx.moveTo(x+20,y+4); ctx.lineTo(x+20,y+36); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+4,y+20); ctx.lineTo(x+36,y+20); ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x+8,y+8); ctx.lineTo(x+32,y+32); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+32,y+8); ctx.lineTo(x+8,y+32); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.arc(x+20,y+20,3.5,0,Math.PI*2); ctx.fill(); ctx.globalAlpha = 0.42;
    }
  } else if (pattern === "warli") {
    ctx.globalAlpha = 0.4;
    for (let y = 0; y < size; y += 48) for (let x = 0; x < size; x += 48) {
      ctx.strokeStyle = ac; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x+24,y+4); ctx.lineTo(x+44,y+36); ctx.lineTo(x+4,y+36); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.25;
      ctx.beginPath(); ctx.arc(x+24,y+36,5,0,Math.PI*2); ctx.fill(); ctx.globalAlpha = 0.4;
    }
  } else if (pattern === "seigaiha") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.4; ctx.lineWidth = 2;
    for (let row = 0; row < size/26+2; row++) for (let col = -1; col < size/32+2; col++) {
      const x = col*32 + (row%2)*16; const y = row*26;
      ctx.beginPath(); ctx.arc(x,y+26,16,Math.PI,0); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.1;
      ctx.beginPath(); ctx.arc(x,y+26,16,Math.PI,0); ctx.fill(); ctx.globalAlpha = 0.4;
    }
  } else if (pattern === "leheriya") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.4; ctx.lineWidth = 5;
    for (let i = -size; i < size*2; i += 28) {
      ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i-size,size); ctx.stroke();
    }
    ctx.strokeStyle = colors.secondary; ctx.lineWidth = 2; ctx.globalAlpha = 0.25;
    for (let i = -size+14; i < size*2; i += 28) {
      ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i-size,size); ctx.stroke();
    }
  } else if (pattern === "paisley") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.38; ctx.lineWidth = 2;
    for (let y = 0; y < size; y += 56) for (let x = 0; x < size; x += 48) {
      ctx.save(); ctx.translate(x+24,y+28);
      ctx.beginPath(); ctx.ellipse(0,0,10,20,0,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(8,-16,5,8,0.5,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.arc(0,-16,2.5,0,Math.PI*2); ctx.fill(); ctx.globalAlpha = 0.38;
      ctx.restore();
    }
  } else if (pattern === "mudcloth") {
    ctx.globalAlpha = 0.38;
    for (let y = 0; y < size; y += 40) for (let x = 0; x < size; x += 40) {
      if ((x/40 + y/40) % 2 === 0) { ctx.fillStyle = ac; ctx.fillRect(x+2,y+2,16,16); }
      ctx.strokeStyle = ac; ctx.lineWidth = 2;
      ctx.strokeRect(x+20,y+20,18,18);
    }
  } else if (pattern === "ankara") {
    for (let y = 0; y < size; y += 52) for (let x = 0; x < size; x += 52) {
      ctx.strokeStyle = ac; ctx.globalAlpha = 0.35; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x+26,y+26,20,0,Math.PI*2); ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x+26,y+26,11,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.arc(x+26,y+26,4,0,Math.PI*2); ctx.fill(); ctx.globalAlpha = 0.35;
    }
  } else if (pattern === "kanga") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.35; ctx.lineWidth = 3;
    ctx.strokeRect(20,20,size-40,size-40);
    ctx.strokeRect(10,10,size-20,size-20);
    ctx.lineWidth = 1.5; ctx.globalAlpha = 0.2;
    for (let y = 0; y < size; y += 40) { ctx.beginPath(); ctx.moveTo(20,y); ctx.lineTo(size-20,y); ctx.stroke(); }
    ctx.fillStyle = ac; ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(size/2,size/2,40,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha = 0.38; ctx.strokeStyle = ac; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(size/2,size/2,25,0,Math.PI*2); ctx.stroke();
  } else if (pattern === "arabesque") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.38; ctx.lineWidth = 2;
    for (let y = 0; y < size; y += 48) for (let x = 0; x < size; x += 48) {
      ctx.beginPath(); ctx.moveTo(x+24,y+2); ctx.lineTo(x+46,y+24); ctx.lineTo(x+24,y+46); ctx.lineTo(x+2,y+24); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.15;
      ctx.beginPath(); ctx.moveTo(x+24,y+10); ctx.lineTo(x+38,y+24); ctx.lineTo(x+24,y+38); ctx.lineTo(x+10,y+24); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 0.38;
    }
  } else if (pattern === "mosaic") {
    ctx.globalAlpha = 0.35;
    for (let y = 0; y < size; y += 28) for (let x = 0; x < size; x += 28) {
      ctx.fillStyle = (x/28+y/28)%4 === 0 ? ac : (x/28+y/28)%4===1 ? colors.detail : (x/28+y/28)%4===2 ? colors.secondary : colors.lining;
      ctx.fillRect(x+1,y+1,26,26);
    }
  } else if (pattern === "pinstripe") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.38; ctx.lineWidth = 2;
    for (let x = 0; x < size; x += 18) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,size); ctx.stroke(); }
  } else if (pattern === "denim") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.18; ctx.lineWidth = 2;
    for (let i = -size; i < size*2; i += 12) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i+size,size); ctx.stroke(); }
    ctx.lineWidth = 1; ctx.globalAlpha = 0.1;
    for (let i = -size+6; i < size*2; i += 12) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i+size,size); ctx.stroke(); }
  } else if (pattern === "asanoha") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.38; ctx.lineWidth = 1.8;
    for (let y = 0; y < size; y += 36) for (let x = 0; x < size; x += 36) {
      ctx.beginPath(); ctx.moveTo(x+18,y); ctx.lineTo(x+18,y+36); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x,y+18); ctx.lineTo(x+36,y+18); ctx.stroke();
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+36,y+36); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+36,y); ctx.lineTo(x,y+36); ctx.stroke();
      ctx.lineWidth = 1.8;
    }
  } else if (pattern === "wave") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.4; ctx.lineWidth = 3;
    for (let y = 0; y < size; y += 30) {
      ctx.beginPath();
      for (let x = 0; x < size; x++) {
        const yy = y + Math.sin(x*Math.PI/30)*12;
        x === 0 ? ctx.moveTo(x,yy) : ctx.lineTo(x,yy);
      }
      ctx.stroke();
    }
  } else if (pattern === "grid") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.28; ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 24) {
      ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(size,i); ctx.stroke();
    }
  } else if (pattern === "ajrakh") {
    ctx.strokeStyle = ac; ctx.lineWidth = 1.5;
    for (let y = 0; y < size; y += 40) for (let x = 0; x < size; x += 40) {
      ctx.globalAlpha = 0.4; ctx.strokeRect(x+6, y+6, 28, 28);
      ctx.fillStyle = ac; ctx.globalAlpha = 0.3; ctx.fillRect(x+15, y+15, 10, 10);
      ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.moveTo(x+20,y); ctx.lineTo(x+26,y+6); ctx.lineTo(x+20,y+12); ctx.lineTo(x+14,y+6); ctx.closePath(); ctx.stroke();
    }
  } else if (pattern === "damask") {
    ctx.strokeStyle = ac; ctx.lineWidth = 2;
    for (let y = 0; y < size; y += 64) for (let x = 0; x < size; x += 64) {
      const cx = x+32, cy = y+32;
      ctx.globalAlpha = 0.34;
      ctx.beginPath(); ctx.ellipse(cx, cy, 16, 26, 0, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy, 9, 16, 0, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.42; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI*2); ctx.fill();
    }
  } else if (pattern === "kalamkari") {
    ctx.strokeStyle = ac; ctx.lineWidth = 2;
    for (let y = 0; y < size; y += 44) {
      ctx.globalAlpha = 0.38; ctx.beginPath();
      for (let x = 0; x < size; x++) { const yy = y + Math.sin(x*Math.PI/40)*14; x === 0 ? ctx.moveTo(x,yy) : ctx.lineTo(x,yy); }
      ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.3;
      for (let x = 0; x < size; x += 44) { ctx.beginPath(); ctx.arc(x+22, y, 4, 0, Math.PI*2); ctx.fill(); }
    }
  } else if (pattern === "madhubani") {
    ctx.strokeStyle = ac; ctx.lineWidth = 1.4;
    for (let y = 0; y < size; y += 48) for (let x = 0; x < size; x += 48) {
      const cx = x+24, cy = y+24;
      ctx.globalAlpha = 0.32;
      ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = ac; ctx.globalAlpha = 0.42; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 0.32;
      for (let a = 0; a < 8; a++) { const ang = a*Math.PI/4; ctx.beginPath(); ctx.moveTo(cx+Math.cos(ang)*16, cy+Math.sin(ang)*16); ctx.lineTo(cx+Math.cos(ang)*22, cy+Math.sin(ang)*22); ctx.stroke(); }
    }
  }

  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  tex.repeat.set(3, 3);
  tex.needsUpdate = true;
  return tex;
}

function useMat(colors: ProductColors, pattern: string, roughness = 0.6, metalness = 0, clearcoat = 0, fabric?: FabricSpec) {
  return useMemo(() => {
    const tex = typeof window !== "undefined" ? makeTexture(colors, pattern) : null;
    const r = fabric ? fabric.roughness : roughness;
    const cc = fabric ? fabric.clearcoat : clearcoat;
    const sheen = fabric ? fabric.sheen : 0;
    const mtl = fabric?.metalness ?? metalness;
    if (cc > 0 || sheen > 0) {
      const m = new THREE.MeshPhysicalMaterial({
        map: tex, color: new THREE.Color(tex ? 0xffffff : colors.main),
        roughness: r, metalness: mtl, clearcoat: cc, clearcoatRoughness: 0.15,
      });
      if (sheen > 0) { m.sheen = sheen; m.sheenRoughness = 0.45; m.sheenColor = new THREE.Color(colors.accent); }
      return m;
    }
    return new THREE.MeshStandardMaterial({
      map: tex, color: new THREE.Color(tex ? 0xffffff : colors.main), roughness: r, metalness: mtl,
    });
  }, [colors.main, colors.accent, colors.detail, colors.secondary, colors.lining, pattern, roughness, metalness, clearcoat, fabric?.roughness, fabric?.clearcoat, fabric?.sheen, fabric?.metalness]);
}

// Resolve the chosen soft-good finish (fabric/material option) into a FabricSpec.
function finishOf(o: Opts): FabricSpec | undefined {
  if (!o) return undefined;
  return FABRICS[o.fabric || o.material || ""];
}

// ── option-driven material resolvers (pure → wrap in useMemo at call site) ──
function metalMaterial(kind: string | undefined, fallback: string): THREE.Material {
  const m = kind ? METALS[kind] : undefined;
  if (m) return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(m.color), metalness: m.metalness, roughness: m.roughness, clearcoat: 1.0, clearcoatRoughness: 0.12 });
  const s = kind ? SHELLS[kind] : undefined;
  if (s) return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(s.color), metalness: s.metalness, roughness: s.roughness, clearcoat: s.clearcoat });
  return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(fallback), metalness: 0.9, roughness: 0.2, clearcoat: 1.0 });
}

function gemMaterial(kind: string | undefined, fallbackColor: string): THREE.Material {
  const g = kind ? GEMS[kind] : undefined;
  const color = g ? g.color : fallbackColor;
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    transmission: g ? g.transmission : 0.8,
    roughness: g ? g.roughness : 0,
    metalness: g ? g.metalness : 0,
    thickness: 0.6, clearcoat: 1.0, clearcoatRoughness: 0.05, ior: 2.2, reflectivity: 0.7,
  });
}

function lensMaterial(type: string | undefined, colorId: string | undefined, fallback: string): THREE.Material {
  const t = (type && LENS_TYPES[type]) || LENS_TYPES.tinted;
  const col = (colorId && LENS_COLORS[colorId]) || fallback;
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(col),
    transmission: t.transmission, metalness: t.metalness, roughness: t.roughness,
    thickness: 0.3, clearcoat: 1.0, clearcoatRoughness: 0.05,
    reflectivity: t.metalness > 0.5 ? 1 : 0.5,
  });
}

const SOLE_COLORS: Record<string, string> = { white: "#F2F2F2", gum: "#C9A26A", black: "#1C1C1C", cream: "#EBE3D0", ice: "#DCE6EC", navy: "#1E2A44", red: "#7A2222", tan: "#B98A5E" };
const LACE_COLORS: Record<string, string> = { white: "#FFFFFF", black: "#1A1A1A", none: "#777777", accent: "#FFD700", red: "#7A2222", blue: "#1C3A66", gum: "#C9A26A" };
const WASH_COLORS: Record<string, string> = { indigo: "#2A4A7A", light: "#7C9CC4", black: "#1A1A1A", grey: "#6A6A6A", acid: "#A8B8CC", stone: "#9AA0A6", vintage: "#5C6E86", jet: "#0E0E10" };
const STITCH_COLORS: Record<string, string> = { gold: "#D4A853", white: "#EDEDED", tonal: "#3A3A3A", red: "#9A3A3A", blue: "#2A4A7A", cream: "#E9E0C8" };

// gemstone cut → geometry (every cut yields a visibly distinct stone)
function gemCutGeometry(cut: string | undefined, r: number): THREE.BufferGeometry {
  switch (cut) {
    case "princess":    return new THREE.BoxGeometry(r * 1.45, r * 1.1, r * 1.45);
    case "emerald-cut": return new THREE.BoxGeometry(r * 1.2, r * 0.85, r * 1.8);
    case "marquise":    { const g = new THREE.OctahedronGeometry(r, 0); g.scale(0.6, 1, 1.8); return g; }
    case "oval":        { const g = new THREE.SphereGeometry(r, 22, 16); g.scale(1, 0.72, 1.45); return g; }
    case "pear":        { const g = new THREE.OctahedronGeometry(r, 0); g.scale(0.82, 1.7, 0.82); return g; }
    case "heart":       { const g = new THREE.SphereGeometry(r, 22, 16); g.scale(1.32, 1.18, 0.62); return g; }
    case "cushion":     { const g = new THREE.SphereGeometry(r, 20, 14); g.scale(1.3, 0.92, 1.3); return g; }
    case "radiant":     return new THREE.BoxGeometry(r * 1.35, r * 1.0, r * 1.55);
    case "trillion":    return new THREE.CylinderGeometry(r * 1.35, r * 1.35, r * 0.72, 3);
    case "baguette":    return new THREE.BoxGeometry(r * 0.72, r * 0.5, r * 2.0);
    case "asscher":     { const g = new THREE.BoxGeometry(r * 1.25, r * 1.0, r * 1.25); g.rotateY(Math.PI / 4); return g; }
    case "cabochon":    { const g = new THREE.SphereGeometry(r, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2); g.scale(1.2, 0.8, 1.2); return g; }
    case "rose-cut":    return new THREE.ConeGeometry(r * 1.2, r * 0.9, 8);
    case "briolette":   { const g = new THREE.OctahedronGeometry(r, 0); g.scale(0.7, 1.9, 0.7); return g; }
    case "hexagon":     return new THREE.CylinderGeometry(r * 1.2, r * 1.2, r * 0.7, 6);
    case "kite":        { const g = new THREE.OctahedronGeometry(r, 0); g.scale(0.9, 1.5, 0.5); g.rotateZ(Math.PI / 4); return g; }
    case "round":
    default:            return new THREE.IcosahedronGeometry(r, 0);
  }
}

function RotatingModel({ children, still }: { children: React.ReactNode; still?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (ref.current && !still) ref.current.rotation.y += delta * 0.38; });
  return <group ref={ref}>{children}</group>;
}

// ── NAAW brand wordmark, drawn to a transparent canvas texture and applied as a
//    flat print decal. Cached per colour so we don't rebuild the texture each frame. ──
const _brandTexCache: Record<string, THREE.CanvasTexture> = {};
function brandTexture(color: string): THREE.CanvasTexture {
  if (_brandTexCache[color]) return _brandTexCache[color];
  const w = 512, h = 192;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = color;
  ctx.font = "900 120px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  // letter-spaced wordmark
  const letters = "NAAW".split("");
  const gap = 92;
  const startX = w / 2 - (gap * (letters.length - 1)) / 2;
  letters.forEach((ch, i) => ctx.fillText(ch, startX + i * gap, h / 2 + 4));
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8; tex.needsUpdate = true;
  _brandTexCache[color] = tex;
  return tex;
}
function BrandMark({ position, rotation, width = 0.85, color = "#F5F5F5", opacity = 0.95 }: {
  position: [number, number, number]; rotation?: [number, number, number]; width?: number; color?: string; opacity?: number;
}) {
  const tex = useMemo(() => brandTexture(color), [color]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, width * 0.375]} />
      <meshStandardMaterial map={tex} transparent alphaTest={0.25} opacity={opacity} roughness={0.5} metalness={0} depthWrite={false} />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// CHUNKY SOLE UNIT — thick stacked midsole + treaded outsole + bulbous toe bumper.
// Shared by the low & high sneakers so both sit on a real, chunky platform.
// ─────────────────────────────────────────────
function ChunkySole({ soleMat, outsoleMat, toe, toeMat, depth = 2.04 }: {
  soleMat: THREE.Material; outsoleMat: THREE.Material; toe: string; toeMat: THREE.Material; depth?: number;
}) {
  // Thick foam midsole — tall band, bulging out past the toe and heel (dad-shoe look).
  const midsoleShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.5, 0.36);
    s.bezierCurveTo(-2.96, 0.4, -3.06, 0.72, -2.96, 1.02);   // bulbous toe front
    s.bezierCurveTo(-2.88, 1.2, -2.5, 1.27, -2.0, 1.25);     // toe top
    s.lineTo(2.05, 1.23);
    s.bezierCurveTo(2.6, 1.25, 3.0, 1.14, 3.06, 0.86);       // heel bulge
    s.bezierCurveTo(3.1, 0.6, 3.0, 0.42, 2.62, 0.38);        // heel down
    s.lineTo(-2.5, 0.36);
    return s;
  }, []);
  // Outsole slab — the ground-contact layer, slightly up-turned at the toe.
  const outsoleShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.54, 0.08);
    s.bezierCurveTo(-2.92, 0.1, -3.0, 0.26, -2.94, 0.44);
    s.lineTo(2.66, 0.44);
    s.bezierCurveTo(2.92, 0.44, 3.0, 0.26, 2.92, 0.06);
    s.bezierCurveTo(2.62, -0.04, -2.22, -0.04, -2.54, 0.08);
    return s;
  }, []);
  const midGeo = useMemo(() => new THREE.ExtrudeGeometry(midsoleShape, {
    depth, bevelEnabled: true, bevelThickness: 0.26, bevelSize: 0.34, bevelSegments: 8,
  }), [midsoleShape, depth]);
  const outGeo = useMemo(() => new THREE.ExtrudeGeometry(outsoleShape, {
    depth: depth + 0.14, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.14, bevelSegments: 5,
  }), [outsoleShape, depth]);
  const cxMid = -depth / 2;
  const cxOut = -(depth + 0.14) / 2;
  // Tread lugs under the toe and heel (skip the arch so it reads like a real outsole).
  const lugX = [-2.05, -1.65, -1.25, -0.85, 0.95, 1.35, 1.75, 2.15];
  return (
    <group>
      {/* Outsole + tread */}
      <mesh geometry={outGeo} material={outsoleMat} position={[0, 0, cxOut]} castShadow receiveShadow/>
      {lugX.map((x, i) => (
        <mesh key={`lug-${i}`} position={[x, -0.06, cxOut]} material={outsoleMat} castShadow>
          <boxGeometry args={[0.2, 0.22, depth - 0.08]}/>
        </mesh>
      ))}
      {/* Thick foam midsole */}
      <mesh geometry={midGeo} material={soleMat} position={[0, 0, cxMid]} castShadow receiveShadow/>
      {/* Rubber toe bumper wraps the chunky front */}
      {toe === "cap" && (
        <RoundedBox args={[0.6, 1.02, depth + 0.06]} radius={0.28} position={[-2.5, 0.95, cxMid]} material={toeMat} castShadow/>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────
// SNEAKER LOW — chunky platform + low-top upper
// ─────────────────────────────────────────────
function SneakerLow3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const fin = FABRICS[o.material || "leather"] || FABRICS.leather;
  const soleCol = SOLE_COLORS[o.sole || "white"] || "#F2F2F2";
  const laceId = o.lace || "white";
  const laceCol = laceId === "accent" ? colors.accent : (LACE_COLORS[laceId] || "#FFFFFF");
  const showLaces = laceId !== "none";
  const toe = o.toe || "cap";
  // Per-part colours: upper, overlays, accent (swoosh), lining/collar, metal eyelets.
  const upperMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(partColor(o.upperColor, "#F6F6F6")), roughness: fin.roughness, metalness: 0, clearcoat: fin.clearcoat, clearcoatRoughness: 0.08,
  }), [fin, o.upperColor]);
  const panelMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(partColor(o.overlayColor, colors.main)), roughness: fin.roughness, clearcoat: fin.clearcoat * 0.8, clearcoatRoughness: 0.12,
  }), [o.overlayColor, colors.main, fin]);
  const perfMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.9 }), []);
  const soleMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(soleCol), roughness: 0.82, metalness: 0, clearcoat: 0.25,
  }), [soleCol]);
  const outsoleRubber = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(soleCol).multiplyScalar(0.78), roughness: 0.95,
  }), [soleCol]);
  const accentMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(partColor(o.accentColor, colors.accent)), roughness: 0.35, metalness: 0.05, clearcoat: 0.5,
  }), [o.accentColor, colors.accent]);
  const eyeletMat = useMemo(() => metalMaterial(o.eyelets, colors.accent), [o.eyelets, colors.accent]);
  const laceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(laceCol), roughness: 0.92 }), [laceCol]);
  const tongueMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(partColor(o.liningColor, "#F0F0F0")), roughness: 0.35, clearcoat: 0.4,
  }), [o.liningColor]);

  // Proven low-top upper profile (seated onto the chunky midsole via the lifted group)
  const shoeShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.15, 0.12);
    s.bezierCurveTo(-2.5, 0.12, -2.65, 0.35, -2.65, 0.62);
    s.bezierCurveTo(-2.65, 1.0, -2.38, 1.18, -1.92, 1.22);
    s.bezierCurveTo(-0.7, 1.28, 0.65, 1.45, 1.38, 1.78);
    s.bezierCurveTo(1.9, 2.05, 2.28, 2.02, 2.5, 1.8);
    s.bezierCurveTo(2.75, 1.52, 2.88, 1.18, 2.82, 0.85);
    s.bezierCurveTo(2.75, 0.5, 2.58, 0.16, 2.3, 0.04);
    s.bezierCurveTo(1.6, -0.04, -1.4, -0.04, -1.95, 0.06);
    s.bezierCurveTo(-2.06, 0.09, -2.15, 0.12, -2.15, 0.12);
    return s;
  }, []);
  const shoeGeo = useMemo(() => new THREE.ExtrudeGeometry(shoeShape, {
    depth: 1.82, bevelEnabled: true, bevelThickness: 0.22, bevelSize: 0.26, bevelSegments: 8,
  }), [shoeShape]);

  const cx = -0.91;     // half of upper depth
  const liftY = 0.82;   // raise the upper to sit on the chunky midsole

  return (
    <group rotation={[0.08, -0.3, 0.03]} position={[0, -1.3, 0]} scale={0.92}>
      <ChunkySole soleMat={soleMat} outsoleMat={outsoleRubber} toe={toe} toeMat={outsoleRubber} depth={2.04}/>
      {/* Upper + detailing, lifted onto the platform */}
      <group position={[0, liftY, 0]}>
        <mesh geometry={shoeGeo} material={upperMat} position={[0, 0, cx]} castShadow/>
        {/* Coloured side panel for a multi-panel upper */}
        <RoundedBox args={[2.1, 0.72, 0.06]} radius={0.05} position={[0.35, 0.95, 1.46]} material={panelMat}/>
        {/* Perforated toe (option) */}
        {toe === "perf" && [0,1].flatMap(r => [0,1,2,3].map(c => (
          <mesh key={`perf-${r}-${c}`} position={[-1.95 + r*0.32, 1.2 + r*0.04, 0.55 - c*0.4]} material={perfMat}>
            <cylinderGeometry args={[0.045, 0.045, 0.05, 10]}/>
          </mesh>
        )))}
        {/* Tongue at the front opening */}
        <RoundedBox args={[1.05, 1.15, 0.12]} radius={0.06} position={[-0.45, 1.35, 0.96]} rotation={[-0.14, 0, 0]} material={tongueMat}/>
        {/* Accent side swoosh / logo stripe */}
        <RoundedBox args={[3.0, 0.2, 0.06]} radius={0.04} position={[0.1, 0.82, 1.5]} rotation={[0, 0, 0.05]} material={accentMat}/>
        {/* Laces */}
        {showLaces && [-0.95,-0.5,-0.05,0.4,0.82].map((x,i) => (
          <RoundedBox key={`l-${i}`} args={[0.14, 0.06, 1.32]} radius={0.03} position={[x, 1.52+i*0.035, 0.9]} rotation={[-0.12,0,0]} material={laceMat}/>
        ))}
        {/* Eyelet rings */}
        {showLaces && [-0.95,-0.5,-0.05,0.4,0.82].map((x,i) => (
          <mesh key={`e-${i}`} position={[x, 1.52+i*0.035, 1.5]} rotation={[Math.PI/2,0,0]} material={eyeletMat}>
            <torusGeometry args={[0.09, 0.024, 6, 12]}/>
          </mesh>
        ))}
        {/* Heel tab + pull loop */}
        <RoundedBox args={[0.26, 0.7, 0.14]} radius={0.06} position={[2.6, 0.95, 0.1]} material={accentMat}/>
        <Torus args={[0.16, 0.05, 8, 16]} position={[2.8, 1.5, 0.1]} rotation={[Math.PI/2, 0, 0]} material={accentMat}/>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────
// SNEAKER HIGH — chunky platform + tall hi-top collar
// ─────────────────────────────────────────────
function SneakerHigh3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const fin = FABRICS[o.material || "leather"] || FABRICS.leather;
  const soleCol = SOLE_COLORS[o.sole || "white"] || "#F2F2F2";
  const laceId = o.lace || "white";
  const laceCol = laceId === "accent" ? colors.accent : (LACE_COLORS[laceId] || "#FFFFFF");
  const showLaces = laceId !== "none";
  const toe = o.toe || "cap";
  const upperMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(partColor(o.upperColor, "#F6F6F6")), roughness: fin.roughness, metalness: 0, clearcoat: fin.clearcoat, clearcoatRoughness: 0.1,
  }), [o.upperColor, fin]);
  const panelMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(partColor(o.overlayColor, colors.main)), roughness: fin.roughness, clearcoat: fin.clearcoat * 0.8, clearcoatRoughness: 0.12,
  }), [o.overlayColor, colors.main, fin]);
  const perfMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.9 }), []);
  const soleMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(soleCol), roughness: 0.82, clearcoat: 0.25 }), [soleCol]);
  const outsoleRubber = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(soleCol).multiplyScalar(0.76), roughness: 0.95 }), [soleCol]);
  const accentMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(partColor(o.accentColor, colors.accent)), roughness: 0.3, clearcoat: 0.6,
  }), [o.accentColor, colors.accent]);
  const eyeletMat = useMemo(() => metalMaterial(o.eyelets, colors.accent), [o.eyelets, colors.accent]);
  const laceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(laceCol), roughness: 0.92 }), [laceCol]);
  const tongueMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(partColor(o.liningColor, "#F0F0F0")), roughness: 0.4 }), [o.liningColor]);

  const highShoeShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.15, 0.12);
    s.bezierCurveTo(-2.5, 0.12, -2.65, 0.38, -2.65, 0.66);
    s.bezierCurveTo(-2.65, 1.05, -2.35, 1.22, -1.9, 1.26);
    s.bezierCurveTo(-0.6, 1.32, 0.6, 1.5, 1.3, 1.85);
    // High collar — taller than low
    s.bezierCurveTo(1.65, 2.0, 1.78, 2.5, 1.78, 2.85);
    s.bezierCurveTo(1.78, 3.15, 1.92, 3.25, 2.1, 3.25);
    s.bezierCurveTo(2.28, 3.25, 2.42, 3.1, 2.42, 2.85);
    s.bezierCurveTo(2.42, 2.5, 2.55, 2.05, 2.82, 1.8);
    s.bezierCurveTo(2.98, 1.55, 3.05, 1.18, 2.98, 0.85);
    s.bezierCurveTo(2.9, 0.5, 2.7, 0.16, 2.42, 0.04);
    s.bezierCurveTo(1.72, -0.04, -1.4, -0.04, -1.95, 0.06);
    s.bezierCurveTo(-2.06, 0.09, -2.15, 0.12, -2.15, 0.12);
    return s;
  }, []);
  const shoeGeo = useMemo(() => new THREE.ExtrudeGeometry(highShoeShape, {
    depth: 1.82, bevelEnabled: true, bevelThickness: 0.22, bevelSize: 0.26, bevelSegments: 8,
  }), [highShoeShape]);

  const cx = -0.91;
  const liftY = 0.82;
  return (
    <group rotation={[0.08, -0.3, 0.03]} position={[0, -1.55, 0]} scale={0.84}>
      <ChunkySole soleMat={soleMat} outsoleMat={outsoleRubber} toe={toe} toeMat={outsoleRubber} depth={2.04}/>
      <group position={[0, liftY, 0]}>
        <mesh geometry={shoeGeo} material={upperMat} position={[0, 0, cx]} castShadow/>
        {/* Perforated toe (option) */}
        {toe === "perf" && [0,1].flatMap(r => [0,1,2,3].map(c => (
          <mesh key={`perf-${r}-${c}`} position={[-1.95 + r*0.32, 1.24 + r*0.04, 0.55 - c*0.4]} material={perfMat}>
            <cylinderGeometry args={[0.045, 0.045, 0.05, 10]}/>
          </mesh>
        )))}
        {/* Padded tongue rising into the collar */}
        <RoundedBox args={[1.05, 1.3, 0.12]} radius={0.06} position={[-0.4, 1.5, 0.96]} rotation={[-0.14,0,0]} material={tongueMat}/>
        {/* Coloured eyestay / mudguard overlay */}
        <RoundedBox args={[2.2, 0.85, 0.06]} radius={0.05} position={[0.35, 1.15, 1.46]} material={panelMat}/>
        {/* Accent stripe */}
        <RoundedBox args={[2.8, 0.2, 0.06]} radius={0.04} position={[0.05, 0.82, 1.5]} material={accentMat}/>
        {/* Laces — extra rows up the higher collar */}
        {showLaces && [-0.95,-0.5,-0.05,0.4,0.82,1.2,1.55].map((x,i) => (
          <RoundedBox key={`l-${i}`} args={[0.13, 0.06, 1.32]} radius={0.03} position={[x, 1.52+i*0.03, 0.9]} rotation={[-0.12,0,0]} material={laceMat}/>
        ))}
        {/* Metal eyelet rings */}
        {showLaces && [-0.95,-0.5,-0.05,0.4,0.82,1.2].map((x,i) => (
          <mesh key={`e-${i}`} position={[x, 1.54+i*0.03, 1.5]} rotation={[Math.PI/2,0,0]} material={eyeletMat}>
            <torusGeometry args={[0.085, 0.022, 6, 12]}/>
          </mesh>
        ))}
        {/* Heel tab + collar trim + pull loop */}
        <RoundedBox args={[0.24, 0.7, 0.14]} radius={0.06} position={[2.78, 0.96, 0.1]} material={accentMat}/>
        <RoundedBox args={[0.24, 0.7, 0.14]} radius={0.06} position={[1.95, 2.9, 0.1]} material={accentMat}/>
        <Torus args={[0.16, 0.05, 8, 16]} position={[2.5, 3.2, 0.1]} rotation={[Math.PI/2, 0, 0]} material={accentMat}/>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────
// T-SHIRT
// ─────────────────────────────────────────────
function TShirt3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.82, 0, 0.3, finishOf(options));
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.88 }), [colors.secondary]);
  const collar = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.75 }), [colors.secondary]);
  const sleeve = options?.sleeve || "short";
  const neck = options?.neck || "crew";
  const length = options?.length || "regular";
  const sl = sleeve === "long" ? { h: 2.3, y: 0.2 } : sleeve === "three-quarter" ? { h: 1.7, y: 0.5 }
    : sleeve === "cap" ? { h: 0.55, y: 1.08 } : { h: 1.05, y: 0.85 };
  // shoulders stay fixed at the top (~1.65); only the hem rises (crop) or drops (long)
  const bodyH = length === "crop" ? 2.4 : length === "long" ? 4.4 : 3.5;
  const bodyY = 1.65 - bodyH / 2;
  const hemY = bodyY - bodyH / 2 + 0.06;
  return (
    <group>
      {/* Body */}
      <RoundedBox args={[2.85, bodyH, 0.14]} radius={0.08} position={[0,bodyY,0]} material={mat}/>
      <BrandMark position={[0, 0.95, 0.1]} width={0.85}/>
      {/* Sleeves */}
      {sleeve !== "sleeveless" && <>
        <RoundedBox args={[1.25, sl.h, 0.12]} radius={0.06} position={[-2.0,sl.y,0]} rotation={[0,0,0.32]} material={dark}/>
        <RoundedBox args={[1.25, sl.h, 0.12]} radius={0.06} position={[2.0,sl.y,0]} rotation={[0,0,-0.32]} material={dark}/>
      </>}
      {/* Collar — crew / scoop (torus) · v-neck · boat · square */}
      {neck === "vneck" ? (
        <>
          <RoundedBox args={[0.12, 0.7, 0.16]} radius={0.04} position={[-0.24,1.55,0.03]} rotation={[0,0,-0.5]} material={collar}/>
          <RoundedBox args={[0.12, 0.7, 0.16]} radius={0.04} position={[0.24,1.55,0.03]} rotation={[0,0,0.5]} material={collar}/>
        </>
      ) : neck === "boat" ? (
        <RoundedBox args={[1.7, 0.13, 0.18]} radius={0.05} position={[0,1.74,0.03]} material={collar}/>
      ) : neck === "square" ? (
        <>
          <RoundedBox args={[0.12, 0.62, 0.16]} radius={0.04} position={[-0.5,1.5,0.03]} material={collar}/>
          <RoundedBox args={[0.12, 0.62, 0.16]} radius={0.04} position={[0.5,1.5,0.03]} material={collar}/>
          <RoundedBox args={[1.12, 0.12, 0.16]} radius={0.04} position={[0,1.24,0.03]} material={collar}/>
        </>
      ) : (
        <Torus args={[neck === "scoop" ? 0.6 : 0.45, 0.11, 12, 32, Math.PI]} position={[0,1.82,0.02]} rotation={[0,0,Math.PI]} material={collar}/>
      )}
      {/* Shoulder seam lines */}
      <RoundedBox args={[0.04, 0.9, 0.15]} radius={0.02} position={[-1.42,0.85,0.01]} rotation={[0,0,0.32]} material={collar}/>
      <RoundedBox args={[0.04, 0.9, 0.15]} radius={0.02} position={[1.42,0.85,0.01]} rotation={[0,0,-0.32]} material={collar}/>
      {/* Bottom hem */}
      <RoundedBox args={[2.85, 0.1, 0.16]} radius={0.04} position={[0,hemY,0.01]} material={collar}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// HOODIE
// ─────────────────────────────────────────────
function Hoodie3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.88, 0, 0.15, finishOf(options));
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.9 }), [colors.secondary]);
  const accent = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.5 }), [colors.accent]);
  const metal = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.18, metalness: 0.9 }), [colors.accent]);
  const pocket = options?.pocket || "kangaroo";
  const zip = options?.closure === "zip";
  return (
    <group>
      <RoundedBox args={[2.95, 3.5, 0.16]} radius={0.08} position={[0,-0.1,0]} material={mat}/>
      <BrandMark position={[0, 1.0, 0.11]} width={0.85}/>
      <RoundedBox args={[1.28, 1.15, 0.14]} radius={0.06} position={[-1.88,0.78,0]} rotation={[0,0,0.32]} material={mat}/>
      <RoundedBox args={[1.28, 1.15, 0.14]} radius={0.06} position={[1.88,0.78,0]} rotation={[0,0,-0.32]} material={mat}/>
      {/* Hood */}
      <RoundedBox args={[1.7, 1.0, 0.18]} radius={0.12} position={[0,2.02,0.06]} material={dark}/>
      {/* Ribbed hem */}
      <RoundedBox args={[2.95, 0.38, 0.2]} radius={0.08} position={[0,-1.95,0]} material={dark}/>
      {/* Ribbed cuffs */}
      <RoundedBox args={[1.1, 0.28, 0.15]} radius={0.06} position={[-2.42,-0.04,0]} rotation={[0,0,0.32]} material={dark}/>
      <RoundedBox args={[1.1, 0.28, 0.15]} radius={0.06} position={[2.42,-0.04,0]} rotation={[0,0,-0.32]} material={dark}/>
      {/* Full-zip track */}
      {zip && <RoundedBox args={[0.1, 3.4, 0.2]} radius={0.04} position={[0,-0.1,0.1]} material={metal}/>}
      {/* Pocket — kangaroo / split / none */}
      {pocket === "kangaroo" && <RoundedBox args={[2.0, 0.7, 0.05]} radius={0.08} position={[0,-0.7,0.09]} material={dark}/>}
      {pocket === "split" && <>
        <RoundedBox args={[0.9, 0.7, 0.05]} radius={0.08} position={[-0.6,-0.7,0.09]} material={dark}/>
        <RoundedBox args={[0.9, 0.7, 0.05]} radius={0.08} position={[0.6,-0.7,0.09]} material={dark}/>
      </>}
      {/* Drawstring */}
      <RoundedBox args={[0.06, 0.8, 0.06]} radius={0.03} position={[-0.28, 1.6, 0.1]} material={accent}/>
      <RoundedBox args={[0.06, 0.8, 0.06]} radius={0.03} position={[0.28, 1.6, 0.1]} material={accent}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// SHIRT (button-down)
// ─────────────────────────────────────────────
function Shirt3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.78, 0, 0.2, finishOf(options));
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.85 }), [colors.secondary]);
  const btnMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 0xEEEEEE, roughness: 0.2, clearcoat: 0.8 }), []);
  return (
    <group>
      <RoundedBox args={[2.85, 3.55, 0.12]} radius={0.06} position={[0,-0.1,0]} material={mat}/>
      <BrandMark position={[-0.55, 1.15, 0.09]} width={0.5}/>
      <RoundedBox args={[1.2, 1.08, 0.10]} radius={0.05} position={[-1.75,0.82,0]} rotation={[0,0,0.28]} material={mat}/>
      <RoundedBox args={[1.2, 1.08, 0.10]} radius={0.05} position={[1.75,0.82,0]} rotation={[0,0,-0.28]} material={mat}/>
      {/* Collar left and right flaps */}
      <RoundedBox args={[0.7, 0.6, 0.14]} radius={0.07} position={[-0.32,1.82,0.07]} rotation={[0,0,-0.25]} material={dark}/>
      <RoundedBox args={[0.7, 0.6, 0.14]} radius={0.07} position={[0.32,1.82,0.07]} rotation={[0,0,0.25]} material={dark}/>
      {/* Button placket */}
      <RoundedBox args={[0.22, 3.5, 0.14]} radius={0.04} position={[0,-0.1,0.07]} material={dark}/>
      {/* Buttons */}
      {[0.7, 0.1, -0.5, -1.1, -1.65].map((y,i) => (
        <mesh key={i} position={[0, y, 0.1]} rotation={[Math.PI/2,0,0]} material={btnMat}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 12]}/>
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// POLO
// ─────────────────────────────────────────────
function Polo3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.8, 0, 0.2, finishOf(options));
  const collarMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.78 }), [colors.accent]);
  const btnMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 0xEEEEEE, roughness: 0.2, clearcoat: 0.8 }), []);
  return (
    <group>
      <RoundedBox args={[2.85, 3.5, 0.12]} radius={0.07} position={[0,-0.1,0]} material={mat}/>
      <BrandMark position={[-0.52, 1.18, 0.09]} width={0.45}/>
      <RoundedBox args={[1.22, 1.05, 0.10]} radius={0.05} position={[-1.72,0.85,0]} rotation={[0,0,0.3]} material={mat}/>
      <RoundedBox args={[1.22, 1.05, 0.10]} radius={0.05} position={[1.72,0.85,0]} rotation={[0,0,-0.3]} material={mat}/>
      {/* Polo collar - flat two-layer */}
      <RoundedBox args={[2.0, 0.4, 0.16]} radius={0.07} position={[0,1.75,0.05]} material={collarMat}/>
      <RoundedBox args={[1.5, 0.28, 0.18]} radius={0.07} position={[0,1.98,0.06]} material={collarMat}/>
      {/* Placket + 2 buttons */}
      <RoundedBox args={[0.2, 0.9, 0.14]} radius={0.04} position={[0,1.28,0.07]} material={collarMat}/>
      {[1.42, 1.12].map((y,i) => (
        <mesh key={i} position={[0, y, 0.12]} rotation={[Math.PI/2,0,0]} material={btnMat}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 12]}/>
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// JACKET
// ─────────────────────────────────────────────
function Jacket3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.72, 0, 0.35, finishOf(options));
  const lining = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining), roughness: 0.85 }), [colors.lining]);
  const zipper = useMemo(() => metalMaterial(options?.hardware, colors.accent), [options?.hardware, colors.accent]);
  return (
    <group>
      <RoundedBox args={[2.95, 3.55, 0.18]} radius={0.09} position={[0,-0.1,0]} material={mat}/>
      <BrandMark position={[-0.6, 1.2, 0.12]} width={0.55}/>
      <RoundedBox args={[1.28, 1.2, 0.16]} radius={0.07} position={[-1.9,0.72,0]} rotation={[0,0,0.26]} material={mat}/>
      <RoundedBox args={[1.28, 1.2, 0.16]} radius={0.07} position={[1.9,0.72,0]} rotation={[0,0,-0.26]} material={mat}/>
      {/* Lapels */}
      <RoundedBox args={[0.68, 1.1, 0.2]} radius={0.08} position={[-0.45,1.3,0.1]} rotation={[0,0,-0.2]} material={lining}/>
      <RoundedBox args={[0.68, 1.1, 0.2]} radius={0.08} position={[0.45,1.3,0.1]} rotation={[0,0,0.2]} material={lining}/>
      {/* Zipper track */}
      <RoundedBox args={[0.1, 3.4, 0.22]} radius={0.04} position={[0,-0.1,0.1]} material={zipper}/>
      {/* Zipper pull */}
      <RoundedBox args={[0.2, 0.4, 0.18]} radius={0.06} position={[0,1.0,0.16]} material={zipper}/>
      {/* Breast pocket */}
      <RoundedBox args={[0.7, 0.5, 0.06]} radius={0.06} position={[-1.0,0.8,0.1]} material={lining}/>
      {/* Hem */}
      <RoundedBox args={[2.95, 0.12, 0.2]} radius={0.04} position={[0,-1.92,0.01]} material={lining}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// BOMBER
// ─────────────────────────────────────────────
function Bomber3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.72, 0, 0.3, finishOf(options));
  const rib = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.88 }), [colors.accent]);
  const inner = useMemo(() => metalMaterial(options?.hardware, colors.secondary), [options?.hardware, colors.secondary]);
  return (
    <group>
      <RoundedBox args={[3.0, 3.0, 0.2]} radius={0.1} position={[0,0.1,0]} material={mat}/>
      <BrandMark position={[0, 0.95, 0.14]} width={0.8}/>
      <RoundedBox args={[1.3, 1.15, 0.18]} radius={0.07} position={[-1.95,0.65,0]} rotation={[0,0,0.28]} material={mat}/>
      <RoundedBox args={[1.3, 1.15, 0.18]} radius={0.07} position={[1.95,0.65,0]} rotation={[0,0,-0.28]} material={mat}/>
      {/* Ribbed hem */}
      <RoundedBox args={[3.0, 0.42, 0.22]} radius={0.09} position={[0,-1.58,0]} material={rib}/>
      {/* Ribbed collar */}
      <RoundedBox args={[2.5, 0.32, 0.22]} radius={0.08} position={[0,1.68,0]} material={rib}/>
      {/* Ribbed sleeve cuffs */}
      <RoundedBox args={[1.25, 0.3, 0.2]} radius={0.07} position={[-2.55,-0.1,0]} rotation={[0,0,0.28]} material={rib}/>
      <RoundedBox args={[1.25, 0.3, 0.2]} radius={0.07} position={[2.55,-0.1,0]} rotation={[0,0,-0.28]} material={rib}/>
      {/* Zipper */}
      <RoundedBox args={[0.1, 2.8, 0.24]} radius={0.04} position={[0,0.1,0.12]} material={inner}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// SHORTS
// ─────────────────────────────────────────────
function Shorts3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.85, 0, 0.1, finishOf(options));
  const waist = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.9 }), [colors.secondary]);
  const cord = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.7 }), [colors.accent]);
  return (
    <group>
      <RoundedBox args={[2.7, 0.5, 0.65]} radius={0.09} position={[0,1.18,0]} material={waist}/>
      <RoundedBox args={[1.18, 1.72, 0.6]} radius={0.1} position={[-0.72,0.08,0]} material={mat}/>
      <RoundedBox args={[1.18, 1.72, 0.6]} radius={0.1} position={[0.72,0.08,0]} material={mat}/>
      {/* Drawcord */}
      <RoundedBox args={[0.08, 0.85, 0.08]} radius={0.04} position={[-0.22,1.18,0.34]} material={cord}/>
      <RoundedBox args={[0.08, 0.85, 0.08]} radius={0.04} position={[0.22,1.18,0.34]} material={cord}/>
      {/* Hem detail */}
      <RoundedBox args={[1.18, 0.1, 0.62]} radius={0.04} position={[-0.72,-0.76,0]} material={waist}/>
      <RoundedBox args={[1.18, 0.1, 0.62]} radius={0.04} position={[0.72,-0.76,0]} material={waist}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// JOGGERS
// ─────────────────────────────────────────────
function Joggers3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.85, 0, 0.1, finishOf(options));
  const cuff = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.88 }), [colors.secondary]);
  const cord = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.7 }), [colors.accent]);
  return (
    <group>
      <RoundedBox args={[2.75, 0.52, 0.65]} radius={0.1} position={[0,1.72,0]} material={cuff}/>
      <RoundedBox args={[1.15, 2.65, 0.6]} radius={0.1} position={[-0.72,0.06,0]} material={mat}/>
      <RoundedBox args={[1.15, 2.65, 0.6]} radius={0.1} position={[0.72,0.06,0]} material={mat}/>
      {/* Tapered ankle cuffs */}
      <RoundedBox args={[0.95, 0.42, 0.52]} radius={0.09} position={[-0.72,-1.42,0]} material={cuff}/>
      <RoundedBox args={[0.95, 0.42, 0.52]} radius={0.09} position={[0.72,-1.42,0]} material={cuff}/>
      {/* Drawcord */}
      <RoundedBox args={[0.08, 0.9, 0.08]} radius={0.04} position={[-0.22,1.72,0.34]} material={cord}/>
      <RoundedBox args={[0.08, 0.9, 0.08]} radius={0.04} position={[0.22,1.72,0.34]} material={cord}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// JEANS
// ─────────────────────────────────────────────
function Jeans3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const washColor = WASH_COLORS[options?.wash || ""] || colors.main;
  const denimColors = useMemo(() => ({ ...colors, main: washColor }), [colors, washColor]);
  const mat = useMat(denimColors, "denim", 0.75, 0, 0.1);
  const waist = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(washColor), roughness: 0.8 }), [washColor]);
  const stitchMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(STITCH_COLORS[options?.stitch || "gold"] || "#D4A853"), roughness: 0.85 }), [options?.stitch]);
  return (
    <group>
      <RoundedBox args={[2.7, 0.55, 0.86]} radius={0.09} position={[0,1.9,0.04]} material={waist}/>
      {/* Solid hip/seat block — one piece, no centre gap where the inner thighs used to show through */}
      <RoundedBox args={[2.5, 1.6, 0.82]} radius={0.12} position={[0,1.05,0.04]} material={mat}/>
      {/* Two legs that OVERLAP across the centre line, at a uniform forward depth so the thighs sit behind */}
      <RoundedBox args={[1.35, 2.8, 0.82]} radius={0.12} position={[-0.56,-0.85,0.04]} material={mat}/>
      <RoundedBox args={[1.35, 2.8, 0.82]} radius={0.12} position={[0.56,-0.85,0.04]} material={mat}/>
      {/* Centre-front + inseam topstitching */}
      <RoundedBox args={[0.04, 1.4, 0.04]} radius={0.02} position={[0,1.0,0.46]} material={stitchMat}/>
      <RoundedBox args={[0.04, 2.7, 0.04]} radius={0.02} position={[-0.2,-0.85,0.46]} material={stitchMat}/>
      <RoundedBox args={[0.04, 2.7, 0.04]} radius={0.02} position={[0.2,-0.85,0.46]} material={stitchMat}/>
      {/* Belt loops */}
      {[-0.9,-0.3,0.3,0.9].map((x,i) => (
        <RoundedBox key={i} args={[0.12, 0.45, 0.08]} radius={0.04} position={[x,1.95,0.48]} material={waist}/>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// CAP
// ─────────────────────────────────────────────
function Cap3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat({ ...colors, main: partColor(options?.bodyColor, colors.main) }, pattern, 0.82, 0, 0.2, finishOf(options));
  const brim = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(partColor(options?.brimColor, colors.secondary)), roughness: 0.75, clearcoat: 0.4 }), [options?.brimColor, colors.secondary]);
  const acc = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.3, clearcoat: 0.6 }), [colors.accent]);
  const btnMat = useMemo(() => (!options?.button || options.button === "accent") ? acc : metalMaterial(options.button, colors.accent), [options?.button, acc, colors.accent]);
  const flat = options?.brim === "flat";
  return (
    <group rotation={[0.15, 0.2, 0]}>
      {/* Dome */}
      <mesh material={mat} position={[0, 0.22, -0.08]}>
        <sphereGeometry args={[1.18, 32, 18, 0, Math.PI*2, 0, Math.PI*0.56]}/>
      </mesh>
      {/* Sweatband */}
      <Cylinder args={[1.15, 1.15, 0.22, 36]} position={[0,-0.18,-0.08]} material={brim}/>
      {/* Brim — curved (angled) or flat (straight) */}
      <RoundedBox args={[2.2, 0.12, flat ? 1.15 : 1.0]} radius={0.05} position={[0,-0.35,flat ? 0.5 : 0.45]} rotation={[flat ? 0 : -0.18,0,0]} material={brim}/>
      {/* Button on top */}
      <mesh material={btnMat} position={[0, 1.2, -0.08]}>
        <sphereGeometry args={[0.12, 12, 12]}/>
      </mesh>
      {/* Front panel seam */}
      <RoundedBox args={[0.04, 1.05, 0.04]} radius={0.02} position={[0, 0.58, 1.12]} material={brim}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// BEANIE
// ─────────────────────────────────────────────
function Beanie3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat({ ...colors, main: partColor(options?.bodyColor, colors.main) }, pattern, 0.92, 0, 0, finishOf(options));
  const cuffCol = partColor(options?.cuffColor, colors.main);
  const cuffMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(cuffCol), roughness: 0.92 }), [cuffCol]);
  // Ribs are the SAME knit as the cuff, just a touch darker — knit grooves without a metallic look.
  const rib = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(cuffCol).multiplyScalar(0.8), roughness: 0.96 }), [cuffCol]);
  const pomMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.68 }), [colors.accent]);
  const pom = options?.pom !== "no";
  const cuff = options?.cuff || "folded";
  const domeY = cuff === "slouch" ? 0.16 : cuff === "tight" ? -0.04 : 0.06;
  const domeSY = cuff === "slouch" ? 1.04 : cuff === "tight" ? 0.74 : 0.86;
  const cuffH = cuff === "tight" ? 0.26 : 0.36;
  const RIBS = 22;
  const domeTop = domeY + 1.02 * domeSY;
  return (
    <group>
      {/* Knit dome — open-bottomed cap the head fills (no floating ball) */}
      <mesh position={[0, domeY, 0]} scale={[1, domeSY, 1]} material={mat}>
        <sphereGeometry args={[1.02, 40, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
      </mesh>
      {/* Rolled cuff band around the forehead */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={cuffMat}>
        <torusGeometry args={[1.0, 0.17, 16, 48]} />
      </mesh>
      {/* Vertical knit ribs riding the cuff */}
      {Array.from({ length: RIBS }).map((_, i) => {
        const a = (i / RIBS) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.1, 0, Math.sin(a) * 1.1]} rotation={[0, -a, 0]} material={rib}>
            <boxGeometry args={[0.07, cuffH, 0.12]} />
          </mesh>
        );
      })}
      {/* Small pom-pom on top */}
      {pom && (
        <mesh position={[0, domeTop + 0.04, 0]} material={pomMat}>
          <sphereGeometry args={[0.2, 20, 20]} />
        </mesh>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────
// BUCKET HAT
// ─────────────────────────────────────────────
function BucketHat3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat({ ...colors, main: partColor(options?.bodyColor, colors.main) }, pattern, 0.82, 0, 0.2, finishOf(options));
  const brim = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(partColor(options?.brimColor, colors.secondary)), roughness: 0.82, clearcoat: 0.2 }), [options?.brimColor, colors.secondary]);
  const brimSize = options?.brim || "medium";
  const brimR = brimSize === "short" ? 1.26 : brimSize === "wide" ? 1.66 : 1.44;
  return (
    <group>
      {/* Crown */}
      <Cylinder args={[0.82, 1.02, 1.05, 36]} position={[0,0.32,0]} material={mat}/>
      {/* Top cap */}
      <mesh material={mat} position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.1, 36]}/>
      </mesh>
      {/* Down-turned floppy brim (cone flaring out + down, not a flat halo) */}
      <mesh material={brim} position={[0,-0.34,0]}>
        <cylinderGeometry args={[1.0, brimR, 0.52, 40, 1, true]}/>
      </mesh>
      {/* Rolled brim edge */}
      <mesh material={brim} position={[0,-0.6,0]} rotation={[Math.PI/2,0,0]}>
        <torusGeometry args={[brimR, 0.07, 10, 40, Math.PI*2]}/>
      </mesh>
      {/* Band detail */}
      <Torus args={[1.02, 0.06, 10, 36, Math.PI*2]} position={[0,-0.02,0]} rotation={[Math.PI/2,0,0]} material={brim}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────
function Boot3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.68, 0, 0.45, finishOf(options));
  const soleCol = SOLE_COLORS[options?.sole || "black"] || colors.secondary;
  const sole = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(soleCol), roughness: 0.92 }), [soleCol]);
  const acc = useMemo(() => metalMaterial(options?.hardware, colors.accent), [options?.hardware, colors.accent]);

  const bootShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.0, 0.1);
    s.bezierCurveTo(-2.3, 0.1, -2.45, 0.3, -2.45, 0.55);
    s.bezierCurveTo(-2.45, 0.88, -2.2, 1.08, -1.8, 1.12);
    s.bezierCurveTo(-0.5, 1.18, 0.4, 1.4, 0.8, 1.7);
    s.bezierCurveTo(1.0, 1.9, 1.05, 2.1, 1.05, 3.2); // tall shaft
    s.bezierCurveTo(1.05, 3.5, 1.2, 3.65, 1.5, 3.65);
    s.bezierCurveTo(1.8, 3.65, 1.95, 3.5, 1.95, 3.2);
    s.bezierCurveTo(1.95, 2.1, 2.1, 1.88, 2.5, 1.62);
    s.bezierCurveTo(2.78, 1.38, 2.88, 1.0, 2.82, 0.72);
    s.bezierCurveTo(2.75, 0.42, 2.58, 0.14, 2.32, 0.04);
    s.bezierCurveTo(1.6,-0.04,-1.3,-0.04,-1.8,0.06);
    s.bezierCurveTo(-1.92,0.08,-2.0,0.1,-2.0,0.1);
    return s;
  }, []);

  const bootGeo = useMemo(() => new THREE.ExtrudeGeometry(bootShape, {
    depth: 1.65, bevelEnabled: true, bevelThickness: 0.22, bevelSize: 0.24, bevelSegments: 8,
  }), [bootShape]);

  const soleShape2 = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.2,0); s.bezierCurveTo(-2.6,0,-2.72,0.14,-2.72,0.32); s.bezierCurveTo(-2.72,0.5,-2.52,0.58,-2.22,0.58);
    s.lineTo(2.42,0.58); s.bezierCurveTo(2.7,0.58,-2.45,0,-2.2,0); // intentional: flat line
    s.moveTo(-2.2,0); s.bezierCurveTo(-2.6,0,-2.72,0.14,-2.72,0.32);
    return s;
  }, []);

  const simSole = useMemo(() => new THREE.ExtrudeGeometry((() => {
    const s = new THREE.Shape();
    s.moveTo(-2.22,0); s.bezierCurveTo(-2.65,0,-2.75,0.14,-2.75,0.32); s.bezierCurveTo(-2.75,0.5,-2.55,0.6,-2.22,0.6);
    s.lineTo(2.42,0.6); s.bezierCurveTo(2.68,0.6,2.75,0.46,2.75,0.28); s.bezierCurveTo(2.75,0.1,2.62,0,2.42,0); s.lineTo(-2.22,0);
    return s;
  })(), { depth: 1.65, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.1, bevelSegments: 4 }), []);

  return (
    <group rotation={[0.1,-0.28,0.04]} position={[0,-1.4,0]}>
      <mesh geometry={simSole} material={sole} position={[0,-0.04,-0.82]}/>
      <mesh geometry={bootGeo} material={mat} position={[0,0,-0.82]}/>
      {/* Lace hooks */}
      {[1.0,1.35,1.7,2.05].map((y,i) => (
        <mesh key={i} position={[0.8,y,0.84]} rotation={[Math.PI/2,0,0]} material={acc}>
          <torusGeometry args={[0.08,0.022,6,10]}/>
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// SANDAL
// ─────────────────────────────────────────────
function Sandal3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.65, 0, 0.4, finishOf(options));
  const sole = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.88 }), [colors.secondary]);
  const acc = useMemo(() => metalMaterial(options?.hardware, colors.accent), [options?.hardware, colors.accent]);

  const footprintGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.8,-0.72); s.bezierCurveTo(-2.2,-0.72,-2.4,-0.5,-2.4,-0.25); s.bezierCurveTo(-2.4,0,-2.1,0.18,-1.7,0.28);
    s.lineTo(1.5,0.38); s.bezierCurveTo(2.0,0.38,2.3,0.2,2.3,0); s.bezierCurveTo(2.3,-0.25,2.0,-0.62,1.6,-0.72);
    s.lineTo(-1.8,-0.72);
    return new THREE.ExtrudeGeometry(s, { depth:0.38, bevelEnabled:true, bevelThickness:0.04, bevelSize:0.06, bevelSegments:3 });
  }, []);

  return (
    <group rotation={[0.35,0.2,0]} position={[0,-0.5,0]}>
      <mesh geometry={footprintGeo} material={sole} position={[0,0,-0.19]}/>
      {/* Toe strap */}
      <RoundedBox args={[1.6,0.22,0.08]} radius={0.04} position={[-0.5,0.42,0.1]} rotation={[-0.15,0,0.1]} material={mat}/>
      {/* Ankle cross straps */}
      <RoundedBox args={[2.8,0.2,0.08]} radius={0.04} position={[0.6,0.32,0.08]} rotation={[-0.1,0,-0.15]} material={mat}/>
      <RoundedBox args={[2.8,0.2,0.08]} radius={0.04} position={[0.6,0.62,0.08]} rotation={[-0.1,0,0.15]} material={mat}/>
      {/* Buckle */}
      <RoundedBox args={[0.38,0.38,0.12]} radius={0.06} position={[1.5,0.42,0.14]} material={acc}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// SLIP-ON
// ─────────────────────────────────────────────
function SlipOn3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const mat = useMat(colors, pattern, 0.6, 0, 0.35, finishOf(o));
  const soleCol = SOLE_COLORS[o.sole || "white"] || colors.secondary;
  const sole = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(soleCol), roughness: 0.8, clearcoat: 0.2 }), [soleCol]);
  const foxing = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(soleCol).multiplyScalar(0.95), roughness: 0.85 }), [soleCol]);
  const elastic = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining || colors.secondary), roughness: 0.86 }), [colors.lining, colors.secondary]);

  // Smooth one-piece laceless upper, gently bulbous.
  const shoeShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.1, 0.46);
    s.bezierCurveTo(-2.56, 0.46, -2.72, 0.78, -2.66, 1.08);
    s.bezierCurveTo(-2.6, 1.34, -2.24, 1.52, -1.78, 1.56);
    s.bezierCurveTo(-0.5, 1.64, 0.72, 1.8, 1.46, 1.94);
    s.bezierCurveTo(1.92, 2.02, 2.2, 1.88, 2.36, 1.62);
    s.bezierCurveTo(2.62, 1.2, 2.68, 0.85, 2.58, 0.58);
    s.bezierCurveTo(2.48, 0.42, 2.22, 0.4, 1.96, 0.4);
    s.lineTo(-2.1, 0.46);
    return s;
  }, []);
  // Thick smooth midsole (chunkier than before, but no tread — keeps the slip-on smooth).
  const soleS = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.4, 0.05);
    s.bezierCurveTo(-2.8, 0.06, -2.88, 0.32, -2.84, 0.58);
    s.bezierCurveTo(-2.8, 0.76, -2.5, 0.82, -2.2, 0.82);
    s.lineTo(2.22, 0.8);
    s.bezierCurveTo(2.58, 0.8, 2.76, 0.62, 2.76, 0.42);
    s.bezierCurveTo(2.76, 0.14, 2.5, 0.0, 2.18, 0.0);
    s.bezierCurveTo(1.2, -0.05, -1.6, -0.05, -2.4, 0.05);
    return s;
  }, []);
  const shoeGeo = useMemo(() => new THREE.ExtrudeGeometry(shoeShape, { depth:1.78, bevelEnabled:true, bevelThickness:0.24, bevelSize:0.3, bevelSegments:8 }), [shoeShape]);
  const soleGeo2 = useMemo(() => new THREE.ExtrudeGeometry(soleS, { depth:1.92, bevelEnabled:true, bevelThickness:0.16, bevelSize:0.22, bevelSegments:6 }), [soleS]);
  const cxU = -0.89; const cxS = -0.96;

  return (
    <group rotation={[0.1,-0.3,0.04]} position={[0,-1.0,0]} scale={0.98}>
      {/* Thick smooth midsole */}
      <mesh geometry={soleGeo2} material={sole} position={[0,0,cxS]} castShadow receiveShadow/>
      {/* Outsole base line for a subtle two-tone */}
      <mesh geometry={soleGeo2} material={foxing} position={[0,-0.16,cxS]} scale={[1.0,0.4,1.0]}/>
      {/* Smooth upper */}
      <mesh geometry={shoeGeo} material={mat} position={[0,0,cxU]} castShadow/>
      {/* Elastic gusset panels — slip-on signature */}
      <RoundedBox args={[1.0,0.42,0.1]} radius={0.06} position={[-0.55,1.5,0.86]} rotation={[-0.12,0,0]} material={elastic}/>
      <RoundedBox args={[1.0,0.42,0.1]} radius={0.06} position={[0.55,1.5,0.86]} rotation={[-0.12,0,0]} material={elastic}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// BACKPACK
// ─────────────────────────────────────────────
function Backpack3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const body = useMat({ ...colors, main: partColor(o.bodyColor, colors.main) }, pattern, 0.82, 0, 0.2, finishOf(o));
  const pocket = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(partColor(o.pocketColor, colors.secondary)), roughness: 0.86 }), [o.pocketColor, colors.secondary]);
  const strap = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(partColor(o.strapColor, colors.secondary)), roughness: 0.84 }), [o.strapColor, colors.secondary]);
  const trim = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(partColor(o.trimColor, colors.detail)), roughness: 0.7 }), [o.trimColor, colors.detail]);
  const lining = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(partColor(o.liningColor, colors.lining)), roughness: 0.7 }), [o.liningColor, colors.lining]);
  const metal = useMemo(() => metalMaterial(o.hardware, colors.accent), [o.hardware, colors.accent]);
  const closed = o.flap === "closed";
  return (
    <group>
      {/* Open-top lining rim (visible when not flapped) */}
      {!closed && <RoundedBox args={[2.02, 0.5, 0.86]} radius={0.1} position={[0,1.5,0.02]} material={lining}/>}
      {/* Main body */}
      <RoundedBox args={[2.35, 3.0, 1.0]} radius={0.18} position={[0,0.1,0]} material={body}/>
      {/* Front pocket */}
      <RoundedBox args={[1.72, 1.1, 0.16]} radius={0.1} position={[0,-0.62,0.57]} material={pocket}/>
      {/* Pocket zip + pull */}
      <RoundedBox args={[1.6,0.07,0.06]} radius={0.03} position={[0,-0.08,0.62]} material={trim}/>
      <mesh material={metal} position={[0.8,-0.08,0.66]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.05,0.05,0.16,8]}/></mesh>
      {/* Top: buckled flap or zip */}
      {closed ? (<>
        <RoundedBox args={[2.42, 1.3, 0.16]} radius={0.14} position={[0,1.16,0.5]} rotation={[0.32,0,0]} material={body}/>
        <RoundedBox args={[0.4,0.6,0.1]} radius={0.05} position={[0,0.6,0.74]} material={strap}/>
        <RoundedBox args={[0.36,0.22,0.14]} radius={0.05} position={[0,0.34,0.78]} material={metal}/>
      </>) : (<>
        <RoundedBox args={[2.35,0.1,0.08]} radius={0.04} position={[0,1.62,0.04]} material={trim}/>
        <mesh material={metal} position={[1.18,1.62,0.1]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.06,0.06,0.18,8]}/></mesh>
      </>)}
      {/* Shoulder straps (back of pack) */}
      <RoundedBox args={[0.22, 2.6, 0.14]} radius={0.08} position={[-0.7,0,-0.42]} material={strap}/>
      <RoundedBox args={[0.22, 2.6, 0.14]} radius={0.08} position={[0.7,0,-0.42]} material={strap}/>
      {/* Front straps — drape over the shoulders onto the chest so the pack reads as "worn" from the front. */}
      <RoundedBox args={[0.44, 2.3, 0.4]} radius={0.1} position={[-1.0,0.85,-2.3]} material={strap}/>
      <RoundedBox args={[0.44, 2.3, 0.4]} radius={0.1} position={[1.0,0.85,-2.3]} material={strap}/>
      {/* Sternum clip tying the two front straps together */}
      <RoundedBox args={[2.0, 0.2, 0.34]} radius={0.08} position={[0,0.2,-2.28]} material={metal}/>
      {/* Handle */}
      <RoundedBox args={[0.58, 0.18, 0.16]} radius={0.07} position={[0,1.72,-0.18]} material={trim}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// TOTE
// ─────────────────────────────────────────────
function Tote3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const body = useMat({ ...colors, main: partColor(o.bodyColor, colors.main) }, pattern, 0.8, 0, 0.2, finishOf(o));
  const trim = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(partColor(o.trimColor, colors.detail)), roughness: 0.72 }), [o.trimColor, colors.detail]);
  const lining = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(partColor(o.liningColor, colors.lining)), roughness: 0.72 }), [o.liningColor, colors.lining]);
  const handle = useMemo(() => o.handle === "tonal"
    ? new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.detail), roughness: 0.5, clearcoat: 0.3 })
    : metalMaterial(o.handle, colors.accent), [o.handle, colors.accent, colors.detail]);
  const snap = o.open === "snap";
  return (
    <group>
      {/* Interior lining (peeks through the open top) */}
      <RoundedBox args={[2.52, 2.7, 0.5]} radius={0.1} position={[0,-0.05,0]} material={lining}/>
      {/* Body */}
      <RoundedBox args={[2.75, 3.0, 0.65]} radius={0.12} position={[0,-0.15,0]} material={body}/>
      {/* Base panel */}
      <RoundedBox args={[2.78, 0.5, 0.68]} radius={0.1} position={[0,-1.4,0]} material={trim}/>
      {/* Top fold / binding */}
      <RoundedBox args={[2.78, 0.22, 0.7]} radius={0.08} position={[0,1.52,0]} material={trim}/>
      {snap && <mesh material={handle} position={[0,1.48,0.37]}><sphereGeometry args={[0.11,16,16]}/></mesh>}
      {/* Handles */}
      <Torus args={[0.72, 0.07, 12, 34, Math.PI]} position={[-0.72,1.68,0]} rotation={[0,0,0.14]} material={handle}/>
      <Torus args={[0.72, 0.07, 12, 34, Math.PI]} position={[0.72,1.68,0]} rotation={[0,0,-0.14]} material={handle}/>
      {/* Stitching lines */}
      <RoundedBox args={[2.6,0.04,0.67]} radius={0.02} position={[0,0.0,0.01]} material={trim}/>
      <RoundedBox args={[2.6,0.04,0.67]} radius={0.02} position={[0,-0.85,0.01]} material={trim}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// WATCH
// ─────────────────────────────────────────────
function Watch3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const strapId = o.strap || "leather";
  const strapFab: FabricSpec =
    strapId === "nylon"  ? FABRICS.nylon :
    strapId === "rubber" ? { roughness: 0.55, clearcoat: 0.4, sheen: 0 } :
    strapId === "suede"  ? FABRICS.suede :
    strapId === "canvas" ? FABRICS.canvas :
    FABRICS.leather;
  const bandFabricMat = useMat({ ...colors, main: partColor(o.strapColor, colors.main) }, pattern, 0.62, 0, 0.4, strapFab);
  const caseMat = useMemo(() => metalMaterial(o.caseMetal, colors.accent), [o.caseMetal, colors.accent]);
  const bandMat = strapId === "steel" ? caseMat : bandFabricMat;
  const dialCol = partColor(o.dialColor, colors.secondary);
  const dialMat = useMemo(() => {
    const d = o.dial || "sunburst";
    if (d === "matte") return new THREE.MeshStandardMaterial({ color: new THREE.Color(dialCol), roughness: 0.7, metalness: 0.1 });
    if (d === "carbon") return new THREE.MeshStandardMaterial({ color: new THREE.Color("#191B1E"), roughness: 0.45, metalness: 0.55 });
    if (d === "skeleton") return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(dialCol), roughness: 0.1, metalness: 0.25, transmission: 0.5, thickness: 0.3 });
    return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(dialCol), roughness: 0.08, metalness: 0.55, clearcoat: 0.9 });
  }, [o.dial, dialCol]);
  const glassMat = useMemo(() => {
    const tint: Record<string, number> = { clear: 0xCFE8FF, blue: 0x3A7BD5, smoke: 0x555555, green: 0x2E7D5B, purple: 0x6A4AA0, rose: 0xC98A9B };
    return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(tint[o.glass || "clear"] ?? 0xCFE8FF), roughness: 0, metalness: 0, transmission: 0.85, thickness: 0.2 });
  }, [o.glass]);
  return (
    <group rotation={[0.35, 0.3, 0.1]}>
      {/* Case */}
      <Cylinder args={[1.05, 1.05, 0.26, 44]} position={[0,0,0]} material={caseMat}/>
      {/* Bezel ring */}
      <Torus args={[1.05, 0.08, 10, 44]} position={[0,0.13,0]} rotation={[Math.PI/2,0,0]} material={caseMat}/>
      {/* Dial face */}
      <Cylinder args={[0.92, 0.92, 0.04, 44]} position={[0,0.14,0]} material={dialMat}/>
      {/* Crystal glass */}
      <Cylinder args={[0.9, 0.9, 0.04, 44]} position={[0,0.18,0]} material={glassMat}/>
      {/* Hour markers — style varies */}
      {(() => {
        const m = o.markers || "index";
        if (m === "none") {
          return [0,3,6,9].map(i => { const a = i*Math.PI/6; return (
            <mesh key={i} position={[0.78*Math.cos(a), 0.22, 0.78*Math.sin(a)]} rotation={[0, Math.PI/2 - a, 0]} material={caseMat}>
              <boxGeometry args={[0.05, 0.05, 0.1]}/>
            </mesh>
          );});
        }
        return Array.from({length:12},(_,i) => {
          const a = i*Math.PI/6; const x = 0.75*Math.cos(a), z = 0.75*Math.sin(a);
          if (m === "dot") return (
            <mesh key={i} position={[x, 0.22, z]} material={caseMat}><cylinderGeometry args={[0.05, 0.05, 0.05, 14]}/></mesh>
          );
          if (m === "roman") return (
            <mesh key={i} position={[x, 0.22, z]} rotation={[0, Math.PI/2 - a, 0]} material={caseMat}><boxGeometry args={[0.04, 0.05, 0.22]}/></mesh>
          );
          if (m === "baton") return (
            <mesh key={i} position={[x, 0.22, z]} rotation={[0, Math.PI/2 - a, 0]} material={caseMat}><boxGeometry args={[0.05, 0.07, 0.26]}/></mesh>
          );
          if (m === "arabic") {
            // bold bars at the cardinal hours, dots between — reads like a numbered dial
            if (i % 3 === 0) return (
              <mesh key={i} position={[x, 0.22, z]} rotation={[0, Math.PI/2 - a, 0]} material={caseMat}><boxGeometry args={[0.07, 0.07, 0.2]}/></mesh>
            );
            return (
              <mesh key={i} position={[x, 0.22, z]} material={caseMat}><cylinderGeometry args={[0.045, 0.045, 0.05, 12]}/></mesh>
            );
          }
          // index bars
          return (
            <mesh key={i} position={[x, 0.22, z]} rotation={[0, Math.PI/2 - a, 0]} material={caseMat}><boxGeometry args={[0.06, 0.06, 0.15]}/></mesh>
          );
        });
      })()}
      {/* Crown */}
      <Cylinder args={[0.1, 0.1, 0.28, 12]} position={[1.1,0,0]} rotation={[0,0,Math.PI/2]} material={caseMat}/>
      {/* Bands */}
      <RoundedBox args={[0.58, 2.35, 0.2]} radius={0.09} position={[0,1.82,-0.04]} rotation={[0.12,0,0]} material={bandMat}/>
      <RoundedBox args={[0.58, 2.35, 0.2]} radius={0.09} position={[0,-1.82,-0.04]} rotation={[-0.12,0,0]} material={bandMat}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// SUNGLASSES
// ─────────────────────────────────────────────
function Sunglasses3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const lensMat = useMemo(() => lensMaterial(o.lensType, o.lensColor, colors.main), [o.lensType, o.lensColor, colors.main]);
  const frame = useMemo(() => metalMaterial(o.frame, colors.accent), [o.frame, colors.accent]);
  const temple = useMemo(() => metalMaterial(o.frame, colors.secondary), [o.frame, colors.secondary]);
  const shape = o.shape || "round";
  const renderLens = (x: number) => {
    if (shape === "square") {
      return (
        <group key={x} position={[x, 0, 0]}>
          <RoundedBox args={[1.55, 1.2, 0.08]} radius={0.12} material={lensMat}/>
          <RoundedBox args={[1.72, 1.36, 0.05]} radius={0.14} position={[0,0,-0.04]} material={frame}/>
        </group>
      );
    }
    if (shape === "hexagon") {
      return (
        <group key={x} position={[x, 0, 0]} rotation={[0,0,Math.PI/6]}>
          <mesh rotation={[Math.PI/2,0,0]} material={lensMat}><cylinderGeometry args={[0.92,0.92,0.08,6]}/></mesh>
          <mesh rotation={[Math.PI/2,0,0]} position={[0,0,-0.03]} material={frame}><cylinderGeometry args={[1.04,1.04,0.05,6]}/></mesh>
        </group>
      );
    }
    const over = shape === "oversized";
    const sx = shape === "cat-eye" ? 1.05 : over ? 1.3 : 1;
    const sy = shape === "aviator" || shape === "cat-eye" ? 0.82 : over ? 1.2 : 1;
    const rz = shape === "cat-eye" ? (x < 0 ? 0.18 : -0.18) : 0;
    const oy = shape === "aviator" ? -0.06 : 0;
    return (
      <group key={x} position={[x, oy, 0]} scale={[sx, sy, 1]} rotation={[0, 0, rz]}>
        <Cylinder args={[0.9, 0.9, 0.08, 44]} rotation={[Math.PI/2,0,0]} material={lensMat}/>
        <Torus args={[0.9, 0.075, 14, 44]} rotation={[Math.PI/2,0,0]} material={frame}/>
      </group>
    );
  };
  return (
    <group rotation={[0.08, 0.15, 0]}>
      {renderLens(-1.08)}
      {renderLens(1.08)}
      {/* Bridge */}
      <RoundedBox args={[0.42, 0.1, 0.08]} radius={0.04} position={[0,0.06,0]} material={frame}/>
      {/* Nose pads */}
      <RoundedBox args={[0.08, 0.12, 0.06]} radius={0.03} position={[-0.14,-0.1,0.08]} rotation={[0,0,0.2]} material={frame}/>
      <RoundedBox args={[0.08, 0.12, 0.06]} radius={0.03} position={[0.14,-0.1,0.08]} rotation={[0,0,-0.2]} material={frame}/>
      {/* Temples */}
      <RoundedBox args={[1.55, 0.08, 0.06]} radius={0.03} position={[-2.02,0,-0.75]} rotation={[0,0.42,0]} material={temple}/>
      <RoundedBox args={[1.55, 0.08, 0.06]} radius={0.03} position={[2.02,0,-0.75]} rotation={[0,-0.42,0]} material={temple}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// BELT
// ─────────────────────────────────────────────
function Belt3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat({ ...colors, main: partColor(options?.strapColor, colors.main) }, pattern, 0.62, 0, 0.45, finishOf(options));
  const buckle = useMemo(() => metalMaterial(options?.buckle, colors.accent), [options?.buckle, colors.accent]);
  const buckleStyle = options?.buckleStyle || "frame";
  return (
    <group rotation={[0.3, 0.1, 0]}>
      {/* Belt strap */}
      <Torus args={[2.25, 0.24, 14, 64, Math.PI*1.65]} position={[0,0,0]} material={mat}/>
      {/* Tail end */}
      <RoundedBox args={[0.5, 0.48, 0.1]} radius={0.06} position={[2.0,-0.9,0]} rotation={[0,0,0.6]} material={mat}/>
      {/* Buckle — frame / plate / ring / double-ring / western */}
      {(() => {
        const bx = -1.95, by = 0.88;
        if (buckleStyle === "ring")
          return <Torus args={[0.34, 0.08, 12, 28]} position={[bx,by,0]} rotation={[Math.PI/2,0,0]} material={buckle}/>;
        if (buckleStyle === "double-ring")
          return (<>
            <Torus args={[0.26, 0.07, 12, 26]} position={[bx-0.16,by,0]} rotation={[Math.PI/2,0,0]} material={buckle}/>
            <Torus args={[0.26, 0.07, 12, 26]} position={[bx+0.16,by,0]} rotation={[Math.PI/2,0,0]} material={buckle}/>
          </>);
        if (buckleStyle === "plate")
          return <RoundedBox args={[0.82, 0.66, 0.16]} radius={0.08} position={[bx,by,0]} material={buckle}/>;
        if (buckleStyle === "western")
          return (<>
            <RoundedBox args={[1.05, 0.78, 0.18]} radius={0.13} position={[bx,by,0]} material={buckle}/>
            <Torus args={[0.3, 0.04, 10, 28]} position={[bx,by,0.1]} material={buckle}/>
            <mesh position={[bx,by,0.15]} material={buckle}><octahedronGeometry args={[0.13,0]}/></mesh>
          </>);
        // frame (default)
        return (<>
          <RoundedBox args={[0.68, 0.58, 0.2]} radius={0.06} position={[bx,by,0]} material={buckle}/>
          <Torus args={[0.22, 0.055, 8, 20]} position={[bx,by,0]} rotation={[Math.PI/2,0,0]} material={buckle}/>
        </>);
      })()}
      {/* Belt holes */}
      {[0.5, 0.9, 1.3].map((v,i) => (
        <mesh key={i} position={[2.0-v*0.5,-0.9+v*0.4,0.06]} rotation={[Math.PI/2,0,0.6]} material={buckle}>
          <cylinderGeometry args={[0.05,0.05,0.1,8]}/>
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// CHAIN
// ─────────────────────────────────────────────
function Chain3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const chainMat = useMemo(() => metalMaterial(o.metal, colors.accent), [o.metal, colors.accent]);
  const pendantMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.main), roughness: 0.06, metalness: 0.85, clearcoat: 0.9 }), [colors.main]);
  const gemMat = useMemo(() => gemMaterial("diamond", colors.accent), [colors.accent]);
  const link = o.link || "round";
  const pendant = o.pendant || "tag";

  const renderLink = (i: number) => {
    const y = 2.0 - i*0.28; const x = Math.sin(i*0.52)*0.18; const rot = i%2===0 ? 0 : Math.PI/2;
    if (link === "box") return <RoundedBox key={i} args={[0.36,0.28,0.14]} radius={0.05} position={[x,y,0]} rotation={[0,rot,0]} material={chainMat}/>;
    if (link === "rope") return <Sphere key={i} args={[0.16,16,16]} position={[x,y,0]} material={chainMat}/>;
    if (link === "snake") return <Sphere key={i} args={[0.13,16,16]} position={[x,y,0]} material={chainMat}/>;
    if (link === "cuban") return <group key={i} position={[x,y,0]} scale={[1.35,1,0.55]} rotation={[0,rot,0]}><Torus args={[0.24,0.085,10,24]} material={chainMat}/></group>;
    if (link === "figaro") {
      const long = i % 3 === 0;
      return <group key={i} position={[x,y,0]} scale={long ? [1,1.55,0.6] : [1,1,0.6]} rotation={[0,rot,0]}><Torus args={[0.22,0.075,10,24]} material={chainMat}/></group>;
    }
    if (link === "mariner") return (
      <group key={i} position={[x,y,0]} scale={[1,1.3,0.6]} rotation={[0,rot,0]}>
        <Torus args={[0.22,0.07,10,24]} material={chainMat}/>
        <mesh material={chainMat}><boxGeometry args={[0.4,0.05,0.05]}/></mesh>
      </group>
    );
    return <Torus key={i} args={[0.24,0.065,10,22]} position={[x,y,0]} rotation={[0,rot,0]} material={chainMat}/>;
  };

  return (
    <group>
      {Array.from({length:16},(_,i) => renderLink(i))}
      {/* Bail */}
      {pendant !== "none" && <mesh position={[0,-2.28,0]} rotation={[Math.PI/2,0,0]} material={chainMat}><torusGeometry args={[0.08,0.04,8,16]}/></mesh>}
      {/* Pendant — tag / cross / gem */}
      {pendant === "tag" && <mesh position={[0,-2.58,0]} material={pendantMat}><cylinderGeometry args={[0.38,0.38,0.1,6]}/></mesh>}
      {pendant === "cross" && <>
        <RoundedBox args={[0.18,0.72,0.1]} radius={0.04} position={[0,-2.62,0]} material={pendantMat}/>
        <RoundedBox args={[0.5,0.18,0.1]} radius={0.04} position={[0,-2.5,0]} material={pendantMat}/>
      </>}
      {pendant === "gem" && <mesh position={[0,-2.62,0]} material={gemMat}><octahedronGeometry args={[0.34,0]}/></mesh>}
      {pendant === "heart" && <>
        <mesh position={[-0.14,-2.5,0]} material={pendantMat}><sphereGeometry args={[0.19,18,18]}/></mesh>
        <mesh position={[0.14,-2.5,0]} material={pendantMat}><sphereGeometry args={[0.19,18,18]}/></mesh>
        <mesh position={[0,-2.78,0]} rotation={[0,0,Math.PI/4]} material={pendantMat}><boxGeometry args={[0.3,0.3,0.12]}/></mesh>
      </>}
      {pendant === "star" && <mesh position={[0,-2.6,0]} scale={[1,1,0.4]} material={pendantMat}><octahedronGeometry args={[0.42,0]}/></mesh>}
      {pendant === "coin" && <>
        <mesh position={[0,-2.6,0]} rotation={[Math.PI/2,0,0]} material={pendantMat}><cylinderGeometry args={[0.4,0.4,0.08,32]}/></mesh>
        <Torus args={[0.4,0.045,10,32]} position={[0,-2.6,0.02]} material={pendantMat}/>
      </>}
    </group>
  );
}

// ─────────────────────────────────────────────
// WALLET
// ─────────────────────────────────────────────
// Open, detailed wallet — every part is a separate colour option (body, lining,
// stitch, edge paint, hardware) and the style drives the geometry.
function Wallet3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const style = o.style || "bifold";
  const bodyMat = useMat({ ...colors, main: partColor(o.bodyColor, colors.main) }, pattern, 0.6, 0, 0.5, finishOf(o));
  const lining = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(partColor(o.liningColor, colors.lining)), roughness: 0.72 }), [o.liningColor, colors.lining]);
  const slotMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(partColor(o.bodyColor, colors.main)), roughness: 0.6 }), [o.bodyColor, colors.main]);
  const stitch = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(partColor(o.stitch, colors.accent)), roughness: 0.82 }), [o.stitch, colors.accent]);
  const edge = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(partColor(o.edge, "#2A2A2A")), roughness: 0.78 }), [o.edge]);
  const hardware = useMemo(() => metalMaterial(o.hardware, colors.accent), [o.hardware, colors.accent]);
  const idWin = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#cdd6de"), roughness: 0.08, transmission: 0.7, transparent: true, opacity: 0.5, metalness: 0 }), []);

  const single = style === "cardholder" || style === "money-clip";
  const pw = single ? 1.5 : 1.7;
  const ph = style === "long" ? 2.5 : 1.95;
  const th = 0.12;
  const slots = style === "cardholder" ? 4 : style === "long" ? 5 : style === "money-clip" ? 2 : 3;
  const panels = style === "trifold" ? 3 : single ? 1 : 2;
  const half = (panels - 1) / 2;

  const renderPanel = (i: number, x: number, cards: boolean) => (
    <group key={i} position={[x, 0, 0]}>
      {/* painted edge rim + body panel + interior lining */}
      <RoundedBox args={[pw + 0.06, ph + 0.06, th * 0.7]} radius={0.06} position={[0, 0, -0.02]} material={edge}/>
      <RoundedBox args={[pw, ph, th]} radius={0.08} position={[0, 0, 0]} material={bodyMat}/>
      <RoundedBox args={[pw - 0.12, ph - 0.12, 0.02]} radius={0.06} position={[0, 0, th / 2 + 0.011]} material={lining}/>
      {/* stitch frame (top + bottom) */}
      <RoundedBox args={[pw - 0.06, 0.03, th + 0.02]} radius={0.01} position={[0, ph / 2 - 0.08, 0.01]} material={stitch}/>
      <RoundedBox args={[pw - 0.06, 0.03, th + 0.02]} radius={0.01} position={[0, -ph / 2 + 0.08, 0.01]} material={stitch}/>
      {cards
        ? Array.from({ length: slots }, (_, k) => {
            const sy = ph / 2 - 0.5 - k * ((ph - 0.7) / slots);
            return (
              <group key={k} position={[0, sy, th / 2 + 0.02 + k * 0.012]}>
                <RoundedBox args={[pw - 0.18, 0.5, 0.03]} radius={0.03} material={slotMat}/>
                <RoundedBox args={[pw - 0.18, 0.03, 0.035]} radius={0.01} position={[0, 0.25, 0.006]} material={stitch}/>
              </group>
            );
          })
        : (<group>
            <RoundedBox args={[pw - 0.16, ph * 0.62, 0.03]} radius={0.04} position={[0, -0.12, th / 2 + 0.03]} material={lining}/>
            <RoundedBox args={[pw - 0.4, 0.62, 0.03]} radius={0.03} position={[0, ph / 2 - 0.5, th / 2 + 0.05]} material={slotMat}/>
            <mesh position={[0, ph / 2 - 0.5, th / 2 + 0.066]} material={idWin}><planeGeometry args={[pw - 0.52, 0.48]}/></mesh>
          </group>)}
    </group>
  );

  return (
    <group rotation={[0.5, -0.12, 0]} scale={1.05}>
      {Array.from({ length: panels }, (_, i) => renderPanel(i, (i - half) * (pw + 0.04), single ? true : i % 2 === 0))}
      {/* fold crease(s) */}
      {panels > 1 && Array.from({ length: panels - 1 }, (_, i) => (
        <RoundedBox key={`h${i}`} args={[0.04, ph, th + 0.02]} radius={0.02} position={[(i - half + 0.5) * (pw + 0.04), 0, 0.01]} material={edge}/>
      ))}
      {/* zip-around track + pull */}
      {style === "zip" && <>
        {[ph / 2 + 0.03, -ph / 2 - 0.03].map((y, i) => (
          <RoundedBox key={i} args={[panels * (pw + 0.04) + 0.08, 0.09, th + 0.05]} radius={0.03} position={[0, y, 0]} material={hardware}/>
        ))}
        <mesh position={[panels * (pw + 0.04) / 2, ph / 2 + 0.03, 0.09]} material={hardware}><boxGeometry args={[0.1, 0.2, 0.06]}/></mesh>
      </>}
      {/* money clip on the back */}
      {style === "money-clip" && <RoundedBox args={[pw * 0.72, 0.18, 0.05]} radius={0.03} position={[0, 0.1, -th / 2 - 0.05]} material={hardware}/>}
      {/* corner hardware plate (not for money-clip) */}
      {style !== "money-clip" && <RoundedBox args={[0.36, 0.14, 0.04]} radius={0.03} position={[half * (pw + 0.04) - 0.34, -ph / 2 + 0.3, th / 2 + 0.03]} material={hardware}/>}
      {/* monogram */}
      {o.monogram === "corner" && <RoundedBox args={[0.22, 0.22, 0.03]} radius={0.02} position={[-half * (pw + 0.04) + 0.3, ph / 2 - 0.32, th / 2 + 0.03]} material={hardware}/>}
      {o.monogram === "center" && <RoundedBox args={[0.5, 0.16, 0.03]} radius={0.03} position={[-half * (pw + 0.04), 0, th / 2 + 0.03]} material={hardware}/>}
    </group>
  );
}

// ─────────────────────────────────────────────
// SCARF
// ─────────────────────────────────────────────
function Scarf3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const fab = FABRICS[options?.fabric || ""] || { roughness: 0.88, clearcoat: 0.1, sheen: 0.15 };
  const mat = useMat(colors, pattern, 0.88, 0, 0.1, fab);
  const acc = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.85 }), [colors.accent]);
  const fringe = options?.fringe !== "no";
  return (
    <group>
      {/* Wrapped loop around neck */}
      <Torus args={[1.3, 0.3, 18, 64, Math.PI*1.6]} position={[0,0.4,0]} rotation={[0.32,0,0]} material={mat}/>
      {/* Left hanging end */}
      <RoundedBox args={[0.56, 3.2, 0.15]} radius={0.12} position={[-0.42,-1.55,0]} rotation={[0,0,0.16]} material={mat}/>
      {/* Right hanging end (behind) */}
      <RoundedBox args={[0.52, 2.4, 0.14]} radius={0.12} position={[0.55,-1.25,-0.12]} rotation={[0,0,-0.1]} material={acc}/>
      {/* Fringe */}
      {fringe && <>
        {[-0.2,0,0.2].map((x,i) => <RoundedBox key={i} args={[0.06,0.35,0.06]} radius={0.03} position={[x-0.42,-3.22,0]} material={acc}/>)}
        {[-0.15,0.05,0.25].map((x,i) => <RoundedBox key={`r${i}`} args={[0.06,0.32,0.06]} radius={0.03} position={[x+0.55,-2.45,-0.12]} material={acc}/>)}
      </>}
    </group>
  );
}

// ─────────────────────────────────────────────
// SOCKS
// ─────────────────────────────────────────────
function Socks3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.86, 0, 0.1, finishOf(options));
  const cuff = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.86 }), [colors.accent]);
  const len = options?.length || "crew";
  const legH = len === "ankle" ? 1.25 : len === "knee" ? 3.45 : 2.35;
  const legY = -0.6 + legH / 2;
  const cuffY = -0.6 + legH + 0.05;
  return (
    <group rotation={[0.2, 0.3, 0]}>
      {/* Leg tube */}
      <Cylinder args={[0.58, 0.52, legH, 26]} position={[0,legY,0]} material={mat}/>
      {/* Ribbed cuff */}
      <Cylinder args={[0.6, 0.6, 0.48, 26]} position={[0,cuffY,0]} material={cuff}/>
      {/* Rib lines on cuff */}
      {Array.from({length:10},(_,i) => (
        <Torus key={i} args={[0.6, 0.018, 6, 26, Math.PI*2]} position={[0,cuffY-0.22+i*0.04,0]} rotation={[Math.PI/2,0,0]} material={cuff}/>
      ))}
      {/* Heel */}
      <Sphere args={[0.58, 16, 16, Math.PI, Math.PI, 0, Math.PI/2]} position={[0.35,-0.62,0.25]} rotation={[Math.PI/2,Math.PI/2,0]} material={cuff}/>
      {/* Foot tube */}
      <Cylinder args={[0.52, 0.46, 1.4, 24]} position={[0.5,-0.62,0.1]} rotation={[0,0,Math.PI/2]} material={mat}/>
      {/* Toe */}
      <Sphere args={[0.46, 16, 16]} position={[1.25,-0.62,0.1]} material={mat}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// PHONE CASE
// ─────────────────────────────────────────────
type PhoneCam = "ios-square" | "ios-diagonal" | "ios-single" | "samsung-vertical" | "pixel-bar" | "oneplus-circle";
type PhoneFront = "island" | "punch" | "home";
interface PhoneSpec { w: number; h: number; r: number; thick: number; cam: PhoneCam; front: PhoneFront; lenses?: number; fold?: "book" | "flip"; }
const PHONE_SPECS: Record<string, PhoneSpec> = {
  "iphone-16-pro-max": { w: 2.18, h: 4.55, r: 0.42, thick: 0.30, cam: "ios-square",       front: "island" },
  "iphone-16-pro":     { w: 2.04, h: 4.18, r: 0.40, thick: 0.30, cam: "ios-square",       front: "island" },
  "iphone-15-pro-max": { w: 2.12, h: 4.45, r: 0.40, thick: 0.30, cam: "ios-square",       front: "island" },
  "iphone-15-pro":     { w: 2.00, h: 4.10, r: 0.38, thick: 0.30, cam: "ios-square",       front: "island" },
  "iphone-15":         { w: 2.00, h: 4.10, r: 0.42, thick: 0.28, cam: "ios-diagonal",     front: "island" },
  "iphone-se":         { w: 1.82, h: 3.66, r: 0.20, thick: 0.28, cam: "ios-single",       front: "home" },
  "galaxy-s25-ultra":  { w: 2.18, h: 4.58, r: 0.12, thick: 0.30, cam: "samsung-vertical", front: "punch", lenses: 4 },
  "galaxy-s24-ultra":  { w: 2.16, h: 4.55, r: 0.10, thick: 0.30, cam: "samsung-vertical", front: "punch", lenses: 4 },
  "galaxy-s24":        { w: 1.94, h: 4.05, r: 0.34, thick: 0.28, cam: "samsung-vertical", front: "punch", lenses: 3 },
  "galaxy-z-fold-7":   { w: 3.74, h: 4.30, r: 0.18, thick: 0.22, cam: "samsung-vertical", front: "punch", lenses: 3, fold: "book" },
  "galaxy-z-flip-6":   { w: 1.96, h: 4.18, r: 0.40, thick: 0.28, cam: "samsung-vertical", front: "punch", lenses: 2, fold: "flip" },
  "pixel-9-pro":       { w: 2.08, h: 4.34, r: 0.40, thick: 0.30, cam: "pixel-bar",        front: "punch" },
  "pixel-8-pro":       { w: 2.06, h: 4.32, r: 0.38, thick: 0.30, cam: "pixel-bar",        front: "punch" },
  "oneplus-13":        { w: 2.14, h: 4.48, r: 0.44, thick: 0.32, cam: "oneplus-circle",   front: "punch" },
  "oneplus-12":        { w: 2.12, h: 4.45, r: 0.42, thick: 0.32, cam: "oneplus-circle",   front: "punch" },
};

function PhoneCase3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const spec = PHONE_SPECS[o.phone || "iphone-15-pro"] || PHONE_SPECS["iphone-15-pro"];
  const caseFin: FabricSpec = o.material === "matte" ? { roughness: 0.85, clearcoat: 0, sheen: 0 }
    : o.material === "leather" ? FABRICS.leather
    : o.material === "silicone" ? { roughness: 0.6, clearcoat: 0.2, sheen: 0 }
    : FABRICS.patent;
  const mat = useMat(colors, pattern, 0.55, 0, 0.6, caseFin);
  const screen = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 0x07070C, roughness: 0.04, metalness: 0.1, transmission: 0.18, clearcoat: 1.0, clearcoatRoughness: 0.02 }), []);
  const ring = useMemo(() => metalMaterial(o.lens, "#1a1a1a"), [o.lens]);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 0x0b0b16, roughness: 0, metalness: 0.15, transmission: 0.55, thickness: 0.4, clearcoat: 1.0, ior: 1.7, reflectivity: 0.6 }), []);
  const tint = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0, transmission: 0.5, thickness: 0.4, clearcoat: 1.0 }), [colors.accent]);
  const dark = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 0x0a0a0c, roughness: 0.25, metalness: 0.2, clearcoat: 0.7 }), []);
  const flashMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xFFE9B0, roughness: 0.15, emissive: 0x2a2008, emissiveIntensity: 0.5 }), []);

  const frontZ = spec.thick / 2;
  const backZ = -spec.thick / 2;

  // One camera lens: metal ring + glass + tinted centre
  const Lens = (x: number, y: number, rad: number, key: string) => (
    <group key={key} position={[x, y, 0]}>
      <mesh position={[0, 0, backZ - 0.12]} rotation={[Math.PI / 2, 0, 0]} material={ring}><cylinderGeometry args={[rad, rad, 0.2, 28]} /></mesh>
      <mesh position={[0, 0, backZ - 0.2]} rotation={[Math.PI / 2, 0, 0]} material={glass}><cylinderGeometry args={[rad * 0.74, rad * 0.74, 0.06, 28]} /></mesh>
      <mesh position={[0, 0, backZ - 0.23]} material={tint}><sphereGeometry args={[rad * 0.42, 16, 16]} /></mesh>
    </group>
  );
  const Flash = (x: number, y: number, key: string) => (
    <mesh key={key} position={[x, y, backZ - 0.1]} rotation={[Math.PI / 2, 0, 0]} material={flashMat}><cylinderGeometry args={[0.07, 0.07, 0.14, 16]} /></mesh>
  );

  const renderCamera = () => {
    const mx = -spec.w * 0.24, my = spec.h * 0.30;
    switch (spec.cam) {
      case "ios-square": {
        const s = spec.w * 0.66;
        return (<>
          <RoundedBox args={[s, s, 0.16]} radius={0.18} position={[mx, my, backZ - 0.06]} material={mat} />
          {Lens(mx - 0.17, my + 0.17, 0.2, "a")}
          {Lens(mx - 0.17, my - 0.17, 0.2, "b")}
          {Lens(mx + 0.18, my, 0.2, "c")}
          {Flash(mx + 0.2, my + 0.2, "f")}
          <mesh position={[mx + 0.18, my - 0.2, backZ - 0.1]} rotation={[Math.PI / 2, 0, 0]} material={dark}><cylinderGeometry args={[0.05, 0.05, 0.12, 12]} /></mesh>
        </>);
      }
      case "ios-diagonal": {
        const s = spec.w * 0.6;
        return (<>
          <RoundedBox args={[s, s, 0.15]} radius={0.18} position={[mx, my, backZ - 0.06]} material={mat} />
          {Lens(mx - 0.16, my + 0.16, 0.21, "a")}
          {Lens(mx + 0.16, my - 0.16, 0.21, "b")}
          {Flash(mx + 0.18, my + 0.18, "f")}
        </>);
      }
      case "ios-single":
        return (<>
          {Lens(mx, my, 0.24, "a")}
          {Flash(mx + 0.4, my - 0.05, "f")}
        </>);
      case "samsung-vertical": {
        const n = spec.lenses ?? 3, sx = -spec.w * 0.3, topy = spec.h * 0.34;
        return (<>
          {Array.from({ length: n }).map((_, i) => Lens(sx, topy - i * 0.46, i < 2 ? 0.21 : 0.15, "s" + i))}
          {Flash(sx + 0.36, topy - 0.05, "f")}
        </>);
      }
      case "pixel-bar": {
        const by = spec.h * 0.26;
        return (<>
          <RoundedBox args={[spec.w * 0.94, 0.54, 0.16]} radius={0.22} position={[0, by, backZ - 0.05]} material={dark} />
          {Lens(-spec.w * 0.24, by, 0.2, "a")}
          {Lens(0, by, 0.2, "b")}
          <mesh position={[spec.w * 0.2, by, backZ - 0.13]} rotation={[Math.PI / 2, 0, 0]} material={glass}><cylinderGeometry args={[0.12, 0.12, 0.16, 20]} /></mesh>
          {Flash(spec.w * 0.32, by, "f")}
        </>);
      }
      case "oneplus-circle": {
        const cy = spec.h * 0.28;
        return (<>
          <mesh position={[0, cy, backZ - 0.06]} rotation={[Math.PI / 2, 0, 0]} material={ring}><cylinderGeometry args={[0.66, 0.66, 0.14, 44]} /></mesh>
          <mesh position={[0, cy, backZ - 0.08]} rotation={[Math.PI / 2, 0, 0]} material={dark}><cylinderGeometry args={[0.56, 0.56, 0.12, 44]} /></mesh>
          {Lens(0, cy + 0.24, 0.18, "a")}
          {Lens(-0.22, cy - 0.14, 0.18, "b")}
          {Lens(0.22, cy - 0.14, 0.18, "c")}
          {Flash(0.36, cy + 0.26, "f")}
        </>);
      }
    }
  };

  const renderFront = () => {
    if (spec.front === "island")
      return <RoundedBox args={[0.52, 0.17, 0.05]} radius={0.085} position={[0, spec.h * 0.35, frontZ - 0.01]} material={dark} />;
    if (spec.front === "punch")
      return <mesh position={[0, spec.h * 0.38, frontZ - 0.01]} rotation={[Math.PI / 2, 0, 0]} material={dark}><cylinderGeometry args={[0.075, 0.075, 0.05, 18]} /></mesh>;
    // home (SE): forehead camera dot + Touch ID home button
    return (<>
      <mesh position={[0, spec.h * 0.40, frontZ - 0.01]} rotation={[Math.PI / 2, 0, 0]} material={dark}><cylinderGeometry args={[0.05, 0.05, 0.05, 14]} /></mesh>
      <mesh position={[0, -spec.h * 0.40, frontZ]} rotation={[Math.PI / 2, 0, 0]} material={ring}><cylinderGeometry args={[0.22, 0.22, 0.06, 28]} /></mesh>
      <mesh position={[0, -spec.h * 0.40, frontZ + 0.01]} rotation={[Math.PI / 2, 0, 0]} material={screen}><cylinderGeometry args={[0.17, 0.17, 0.04, 28]} /></mesh>
    </>);
  };

  const isHome = spec.front === "home";
  const screenW = spec.w - (isHome ? 0.28 : 0.2);
  const screenH = spec.h - (isHome ? 1.0 : 0.34);
  const screenY = isHome ? 0.08 : 0;
  const screenR = isHome ? 0.06 : Math.max(0.1, spec.r - 0.08);

  return (
    <group rotation={[0, 0.25, 0]}>
      {/* Body */}
      <RoundedBox args={[spec.w, spec.h, spec.thick]} radius={spec.r} position={[0, 0, 0]} material={mat} />
      {/* Screen */}
      <RoundedBox args={[screenW, screenH, 0.05]} radius={screenR} position={[0, screenY, frontZ]} material={screen} />
      {renderFront()}
      {renderCamera()}
      {/* Foldable hinge crease + cover display */}
      {spec.fold === "book" && (<>
        {/* faint vertical fold line down the centre of the inner screen */}
        <RoundedBox args={[0.05, screenH * 0.96, 0.02]} radius={0.01} position={[0, screenY, frontZ + 0.005]} material={dark} />
        {/* metal hinge spine along the left edge */}
        <RoundedBox args={[0.14, spec.h, spec.thick * 1.05]} radius={0.06} position={[-spec.w / 2 - 0.02, 0, 0]} material={ring} />
      </>)}
      {spec.fold === "flip" && (<>
        {/* horizontal fold line across the middle of the screen */}
        <RoundedBox args={[screenW * 0.96, 0.05, 0.02]} radius={0.01} position={[0, screenY, frontZ + 0.005]} material={dark} />
        {/* rear cover display window beside the cameras */}
        <RoundedBox args={[spec.w * 0.5, spec.h * 0.2, 0.04]} radius={0.08} position={[spec.w * 0.16, spec.h * 0.3, backZ - 0.04]} material={screen} />
      </>)}
      {/* Side buttons (aluminium frame) */}
      <RoundedBox args={[0.05, 0.55, spec.thick * 0.7]} radius={0.02} position={[spec.w / 2 + 0.005, spec.h * 0.16, 0]} material={ring} />
      <RoundedBox args={[0.05, 0.34, spec.thick * 0.7]} radius={0.02} position={[-spec.w / 2 - 0.005, spec.h * 0.22, 0]} material={ring} />
      <RoundedBox args={[0.05, 0.34, spec.thick * 0.7]} radius={0.02} position={[-spec.w / 2 - 0.005, spec.h * 0.04, 0]} material={ring} />
    </group>
  );
}

// ─────────────────────────────────────────────
// RING
// ─────────────────────────────────────────────
function Ring3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const metal = useMemo(() => metalMaterial(o.metal, colors.accent), [o.metal, colors.accent]);
  const gem = useMemo(() => gemMaterial(o.gem, colors.main), [o.gem, colors.main]);
  const gem2 = useMemo(() => gemMaterial(o.gem, colors.secondary), [o.gem, colors.secondary]);
  const centerGeo = useMemo(() => gemCutGeometry(o.cut, 0.42), [o.cut]);
  return (
    <group rotation={[0.5, 0.4, 0.2]}>
      {/* Band */}
      <Torus args={[1.05, 0.25, 20, 64]} position={[0,0,0]} material={metal}/>
      {/* Setting prongs */}
      {[0,72,144,216,288].map((a,i) => (
        <mesh key={i} position={[1.05*Math.cos(a*Math.PI/180+Math.PI/2), 0.25, 1.05*Math.sin(a*Math.PI/180+Math.PI/2)]} material={metal}>
          <boxGeometry args={[0.05, 0.35, 0.05]}/>
        </mesh>
      ))}
      {/* Centre stone — cut varies geometry */}
      <mesh position={[0, 0.48, 0]} geometry={centerGeo} material={gem}/>
      {/* Side stones */}
      {[-0.5,0.5].map((y,i) => (
        <mesh key={i} position={[0, 0.22, y]} material={gem2}>
          <icosahedronGeometry args={[0.2, 0]}/>
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// EARRINGS
// ─────────────────────────────────────────────
function Earrings3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const metal  = useMemo(() => metalMaterial(o.metal, colors.accent), [o.metal, colors.accent]);
  const metal2 = useMemo(() => metalMaterial(o.metal, colors.secondary), [o.metal, colors.secondary]);
  const gem  = useMemo(() => gemMaterial(o.gem, colors.main), [o.gem, colors.main]);
  const gem2 = useMemo(() => gemMaterial(o.gem, colors.secondary), [o.gem, colors.secondary]);
  const cut = o.gem === "pearl" ? "round" : (o.cut || "round");
  const gemBig = useMemo(() => gemCutGeometry(cut, 0.30), [cut]);
  const gemMid = useMemo(() => gemCutGeometry(cut, 0.19), [cut]);
  const gemSm  = useMemo(() => gemCutGeometry(cut, 0.12), [cut]);
  const pearGeo = useMemo(() => gemCutGeometry("pear", 0.34), []);
  const style = o.style || "drop";
  const sizeMap: Record<string, number> = { tiny: 0.6, small: 0.78, medium: 1.0, large: 1.26, statement: 1.5, oversized: 1.8 };
  const s = sizeMap[o.size || "medium"] ?? 1.0;

  // one earring's geometry, anchored near the lobe (origin), built once and mirrored for the pair
  const content = () => {
    switch (style) {
      case "hoop": return (<>
        <Torus args={[0.7, 0.085, 16, 52]} position={[0,-0.12,0]} material={metal}/>
        <mesh position={[0, 0.6, 0]} material={metal}><sphereGeometry args={[0.1, 16, 16]}/></mesh>
      </>);
      case "huggie": return (<>
        <Torus args={[0.4, 0.15, 16, 40]} material={metal}/>
        <mesh position={[0,0.36,0.18]} geometry={gemSm} material={gem}/>
        <mesh position={[0,0.16,0.2]} geometry={gemSm} material={gem}/>
      </>);
      case "stud": return (<>
        <mesh material={metal}><cylinderGeometry args={[0.3,0.3,0.1,24]}/></mesh>
        <mesh position={[0,0,0.12]} geometry={gemBig} material={gem}/>
        {[0,72,144,216,288].map((a,i)=>(
          <mesh key={i} position={[0.24*Math.cos(a*Math.PI/180),0.24*Math.sin(a*Math.PI/180),0.12]} material={metal}><boxGeometry args={[0.04,0.16,0.04]}/></mesh>
        ))}
      </>);
      case "teardrop": return (<>
        <mesh position={[0,0.7,0]} material={metal}><sphereGeometry args={[0.1,14,14]}/></mesh>
        <mesh position={[0,0.34,0]} material={metal}><cylinderGeometry args={[0.03,0.03,0.5,8]}/></mesh>
        <mesh position={[0,-0.12,0]} geometry={pearGeo} material={gem}/>
      </>);
      case "chandelier": return (<>
        <mesh position={[0,0.9,0]} material={metal}><cylinderGeometry args={[0.16,0.16,0.08,20]}/></mesh>
        <mesh position={[0,0.9,0.07]} geometry={gemMid} material={gem}/>
        <RoundedBox args={[0.9,0.1,0.08]} radius={0.04} position={[0,0.5,0]} material={metal}/>
        {[-0.34,0,0.34].map((dx,i)=>(
          <group key={i} position={[dx,0,0]}>
            <mesh position={[0,0.28,0]} material={metal}><cylinderGeometry args={[0.02,0.02,0.42-Math.abs(dx),8]}/></mesh>
            <mesh position={[0,0.0-Math.abs(dx),0]} geometry={gemMid} material={i===1?gem:gem2}/>
          </group>
        ))}
      </>);
      case "threader": return (<>
        <mesh position={[0,0.3,0]} rotation={[0,0,0.12]} material={metal}><cylinderGeometry args={[0.03,0.03,1.7,10]}/></mesh>
        <mesh position={[0.12,-0.62,0]} geometry={gemMid} material={gem}/>
      </>);
      case "ear-cuff": return (<>
        <Torus args={[0.5, 0.09, 14, 40, Math.PI*1.4]} rotation={[0,0,Math.PI*0.32]} material={metal}/>
        <mesh position={[0.44,0.34,0]} geometry={gemSm} material={gem}/>
      </>);
      case "jhumka": return (<>
        <mesh position={[0,0.62,0]} material={metal}><cylinderGeometry args={[0.16,0.16,0.08,20]}/></mesh>
        <mesh position={[0,0.62,0.06]} geometry={gemSm} material={gem}/>
        <Cylinder args={[0.14, 0.5, 0.42, 28]} position={[0,0.24,0]} material={metal}/>
        <Sphere args={[0.5, 24, 16, 0, Math.PI*2, 0, Math.PI/2]} position={[0,0.02,0]} rotation={[Math.PI,0,0]} material={metal2}/>
        {Array.from({length:9},(_,i)=>{const a=(i/9)*Math.PI*2; return (
          <mesh key={i} position={[0.46*Math.cos(a), -0.12, 0.46*Math.sin(a)]} material={gem}><sphereGeometry args={[0.07,12,12]}/></mesh>
        );})}
      </>);
      case "cluster": return (<>
        <mesh material={metal2}><cylinderGeometry args={[0.42,0.42,0.08,28]}/></mesh>
        <mesh position={[0,0,0.12]} geometry={gemMid} material={gem}/>
        {Array.from({length:6},(_,i)=>{const a=(i/6)*Math.PI*2; return (
          <mesh key={i} position={[0.28*Math.cos(a), 0.28*Math.sin(a), 0.11]} geometry={gemSm} material={gem2}/>
        );})}
      </>);
      case "bar": return (<>
        <RoundedBox args={[0.12, 0.85, 0.12]} radius={0.05} material={metal}/>
        <mesh position={[0,0.52,0.05]} geometry={gemSm} material={gem}/>
      </>);
      case "star": return (<>
        <mesh material={metal}><cylinderGeometry args={[0.22,0.22,0.08,20]}/></mesh>
        <mesh position={[0,0,0.14]} scale={[1,1,0.4]} material={gem}><octahedronGeometry args={[0.38,0]}/></mesh>
      </>);
      case "chandbali": return (<>
        {/* top stud */}
        <mesh position={[0,0.78,0]} material={metal}><cylinderGeometry args={[0.13,0.13,0.08,20]}/></mesh>
        <mesh position={[0,0.78,0.06]} geometry={gemSm} material={gem}/>
        {/* double crescent dome */}
        <Sphere args={[0.52, 28, 18, 0, Math.PI*2, 0, Math.PI/2]} position={[0,0.12,0]} rotation={[Math.PI,0,0]} material={metal2}/>
        <Torus args={[0.52, 0.07, 12, 40, Math.PI]} position={[0,0.12,0.02]} rotation={[0,0,Math.PI]} material={metal}/>
        {Array.from({length:7},(_,i)=>{const a=Math.PI*(0.08+0.84*i/6); return (
          <mesh key={i} position={[0.46*Math.cos(a), 0.12+0.46*Math.sin(a)-0.46, 0.06]} geometry={gemSm} material={i%2?gem2:gem}/>
        );})}
        {/* hanging pearls */}
        {[-0.32,0,0.32].map((dx,i)=>(
          <mesh key={i} position={[dx,-0.46,0]} material={gem}><sphereGeometry args={[0.1,14,14]}/></mesh>
        ))}
      </>);
      case "ear-jacket": return (<>
        {/* front stud */}
        <mesh material={metal}><cylinderGeometry args={[0.26,0.26,0.1,24]}/></mesh>
        <mesh position={[0,0,0.13]} geometry={gemMid} material={gem}/>
        {[0,72,144,216,288].map((a,i)=>(
          <mesh key={i} position={[0.2*Math.cos(a*Math.PI/180),0.2*Math.sin(a*Math.PI/180),0.12]} geometry={gemSm} material={gem2}/>
        ))}
        {/* jacket sweeping under the lobe */}
        <Torus args={[0.52, 0.1, 14, 40, Math.PI*1.1]} position={[0,-0.3,0]} rotation={[0,0,Math.PI*1.05]} material={metal2}/>
        {[-0.4,0,0.4].map((dx,i)=>(
          <mesh key={i} position={[dx,-0.74,0]} geometry={gemSm} material={gem}/>
        ))}
      </>);
      case "tassel": return (<>
        <mesh position={[0,0.55,0]} material={metal}><sphereGeometry args={[0.14,16,16]}/></mesh>
        <mesh position={[0,0.32,0]} geometry={gemMid} material={gem}/>
        <mesh position={[0,0.08,0]} material={metal2}><cylinderGeometry args={[0.2,0.12,0.22,20]}/></mesh>
        {Array.from({length:7},(_,i)=>{const dx=(i-3)*0.06; const len=0.7-Math.abs(i-3)*0.06; return (
          <group key={i} position={[dx,-0.05,0]}>
            <mesh position={[0,-len/2,0]} material={metal}><cylinderGeometry args={[0.02,0.02,len,8]}/></mesh>
            <mesh position={[0,-len,0]} material={gem2}><sphereGeometry args={[0.05,10,10]}/></mesh>
          </group>
        );})}
      </>);
      case "halo": return (<>
        <mesh material={metal2}><cylinderGeometry args={[0.34,0.34,0.08,28]}/></mesh>
        <mesh position={[0,0,0.13]} geometry={gemMid} material={gem}/>
        {Array.from({length:10},(_,i)=>{const a=(i/10)*Math.PI*2; return (
          <mesh key={i} position={[0.3*Math.cos(a),0.3*Math.sin(a),0.11]} geometry={gemSm} material={gem2}/>
        );})}
      </>);
      case "climber": return (<>
        <mesh material={metal}><cylinderGeometry args={[0.12,0.12,0.08,16]}/></mesh>
        {Array.from({length:5},(_,i)=>{const a=Math.PI*(0.5+0.42*i/4); const rad=0.62; return (
          <mesh key={i} position={[rad*Math.cos(a)-rad*0.2, rad*Math.sin(a)-0.1, 0.06]} geometry={gemCutGeometry(cut, 0.1+i*0.03)} material={i%2?gem2:gem}/>
        );})}
      </>);
      case "heart": return (<>
        <mesh material={metal}><cylinderGeometry args={[0.18,0.18,0.08,20]}/></mesh>
        <group position={[0,0.02,0.12]}>
          <mesh position={[-0.13,0.08,0]} material={gem}><sphereGeometry args={[0.16,18,18]}/></mesh>
          <mesh position={[0.13,0.08,0]} material={gem}><sphereGeometry args={[0.16,18,18]}/></mesh>
          <mesh position={[0,-0.16,0]} rotation={[0,0,Math.PI/4]} material={gem}><boxGeometry args={[0.26,0.26,0.16]}/></mesh>
        </group>
      </>);
      case "dangle": return (<>
        <Torus args={[0.18, 0.05, 12, 30]} position={[0,0.7,0]} material={metal}/>
        {Array.from({length:5},(_,i)=>(
          <Sphere key={i} args={[0.07,12,12]} position={[0,0.5-i*0.18,0]} material={metal}/>
        ))}
        <mesh position={[0,-0.55,0]} geometry={gemBig} material={gem}/>
      </>);
      case "pave-hoop": return (<>
        <Torus args={[0.66, 0.1, 16, 52]} position={[0,-0.12,0]} material={metal}/>
        {Array.from({length:14},(_,i)=>{const a=(i/14)*Math.PI*2; return (
          <mesh key={i} position={[0.66*Math.cos(a),-0.12+0.66*Math.sin(a),0.1]} geometry={gemSm} material={gem}/>
        );})}
        <mesh position={[0,0.58,0]} material={metal}><sphereGeometry args={[0.09,14,14]}/></mesh>
      </>);
      // drop (default) — small hoop top + post + dangling gem
      default: return (<>
        <Torus args={[0.42, 0.07, 14, 44]} position={[0,0.55,0]} material={metal}/>
        <RoundedBox args={[0.1, 0.5, 0.1]} radius={0.05} position={[0,0.05,0]} material={metal}/>
        <mesh position={[0,-0.4,0]} geometry={gemBig} material={gem}/>
      </>);
    }
  };

  return (
    <group>
      <group position={[-1.25, 0.1, 0]} scale={s}>{content()}</group>
      <group position={[1.25, 0.1, 0]} scale={s}>{content()}</group>
    </group>
  );
}

// ─────────────────────────────────────────────
// SAREE (3D)
// ─────────────────────────────────────────────
function Saree3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const fab = finishOf(o);
  const mat = useMat(colors, pattern, 0.52, 0, 0.3, fab);
  const blouse = useMat({...colors, main: colors.secondary}, pattern, 0.58, 0, 0.2, fab);
  const border = useMemo(() => metalMaterial(o.border, colors.accent), [o.border, colors.accent]);
  // Drape style varies how the pallu falls: nivi over left shoulder, bengali fuller/centered, gujarati over right
  const drape = o.drape || "nivi";
  const blouseSleeve = o.blouse || "short";
  const side = drape === "gujarati" ? 1 : -1; // shoulder the pallu crosses to
  const sashRot = -side * 0.62;
  const sashCX = side * 0.05;
  const sashCY = 0.95;
  const bx = sashCX + 0.5 * Math.cos(sashRot);
  const by = sashCY + 0.5 * Math.sin(sashRot);
  return (
    <group>
      {/* Main drape */}
      <RoundedBox args={[2.95, 4.8, 0.09]} radius={0.06} position={[0,-0.45,0]} material={mat}/>
      {/* Choli (blouse) — fitted on the chest, below the neckline */}
      <RoundedBox args={[2.4, 0.86, 0.2]} radius={0.1} position={[0,1.78,0.05]} material={blouse}/>
      {/* Blouse sleeves (sleeveless / short / elbow / full) */}
      {blouseSleeve !== "sleeveless" && (() => { const sh = blouseSleeve === "full" ? 1.9 : blouseSleeve === "elbow" ? 1.1 : 0.5; const sy = 2.0 - sh/2; return (<>
        <RoundedBox args={[0.6, sh, 0.24]} radius={0.1} position={[-1.42, sy, 0.05]} rotation={[0,0,0.12]} material={blouse}/>
        <RoundedBox args={[0.6, sh, 0.24]} radius={0.1} position={[1.42, sy, 0.05]} rotation={[0,0,-0.12]} material={blouse}/>
      </>); })()}
      {/* Pallu — diagonal sash drawn across the torso (hip → opposite shoulder) */}
      <RoundedBox args={[0.98, 3.5, 0.1]} radius={0.06} position={[sashCX, sashCY, 0.2]} rotation={[0,0,sashRot]} material={mat}/>
      <RoundedBox args={[0.2, 3.5, 0.12]} radius={0.04} position={[bx, by, 0.22]} rotation={[0,0,sashRot]} material={border}/>
      {/* Pallu falling from the shoulder down the side */}
      <RoundedBox args={[1.0, 2.8, 0.08]} radius={0.06} position={[side*1.18, 0.5, 0.05]} rotation={[0,0,-side*0.08]} material={mat}/>
      <RoundedBox args={[0.18, 2.8, 0.1]} radius={0.04} position={[side*1.64, 0.5, 0.06]} rotation={[0,0,-side*0.08]} material={border}/>
      {/* Bottom border */}
      <RoundedBox args={[2.95, 0.32, 0.12]} radius={0.05} position={[0,-2.9,0.06]} material={border}/>
      {/* Waistband */}
      <RoundedBox args={[2.95, 0.12, 0.18]} radius={0.04} position={[0,1.55,0.08]} material={border}/>
      {/* Pleat lines */}
      {[-0.7,-0.35,0,0.35,0.7].map((x,i) => (
        <RoundedBox key={i} args={[0.04,4.8,0.1]} radius={0.02} position={[x,-0.45,0.05]} material={border}/>
      ))}
    </group>
  );
}

// ═════════════════════════════════════════════
// TRADITIONAL WEAR — MEN
// ═════════════════════════════════════════════

// KURTA — long tunic + churidar/pajama, mandarin collar, button placket
function Kurta3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const mat = useMat(colors, pattern, 0.8, 0, 0.25, finishOf(o));
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.72 }), [colors.secondary]);
  const pj = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining), roughness: 0.86 }), [colors.lining]);
  const btn = useMemo(() => metalMaterial(o.button === "accent" || !o.button ? undefined : o.button, colors.accent), [o.button, colors.accent]);
  const collar = o.collar || "mandarin";
  const length = o.length || "regular";
  const bottom = o.bottom || "churidar";
  const bodyH = length === "long" ? 4.6 : length === "short" ? 3.2 : 4.0;
  const cy = 1.9 - bodyH / 2;
  const hemY = cy - bodyH / 2;
  const legW = bottom === "pajama" ? 0.82 : 0.6;
  return (
    <group>
      {bottom !== "none" && [-0.6, 0.6].map((x, i) => (
        <RoundedBox key={`l${i}`} args={[legW, 2.4, legW * 0.9]} radius={0.16} position={[x, -2.1, 0]} material={pj}/>
      ))}
      {bottom === "churidar" && [-0.6, 0.6].map((x, i) => (
        [-2.85, -3.0, -3.15].map((y, j) => (
          <Torus key={`g${i}-${j}`} args={[legW * 0.5, 0.05, 8, 18]} position={[x, y, 0]} rotation={[Math.PI/2,0,0]} material={pj}/>
        ))
      ))}
      <RoundedBox args={[2.55, bodyH, 0.16]} radius={0.1} position={[0, cy, 0]} material={mat}/>
      <RoundedBox args={[0.95, 2.5, 0.14]} radius={0.07} position={[-1.62, cy + 0.55, 0]} rotation={[0,0,0.18]} material={mat}/>
      <RoundedBox args={[0.95, 2.5, 0.14]} radius={0.07} position={[1.62, cy + 0.55, 0]} rotation={[0,0,-0.18]} material={mat}/>
      {collar === "mandarin" && <RoundedBox args={[0.95, 0.4, 0.22]} radius={0.08} position={[0,1.82,0.05]} material={dark}/>}
      {collar === "round" && <Torus args={[0.5,0.1,12,32,Math.PI]} position={[0,1.78,0.04]} rotation={[0,0,Math.PI]} material={dark}/>}
      {collar === "v-placket" && <>
        <RoundedBox args={[0.12,0.8,0.18]} radius={0.04} position={[-0.22,1.5,0.05]} rotation={[0,0,-0.4]} material={dark}/>
        <RoundedBox args={[0.12,0.8,0.18]} radius={0.04} position={[0.22,1.5,0.05]} rotation={[0,0,0.4]} material={dark}/>
      </>}
      <RoundedBox args={[0.16, 1.4, 0.18]} radius={0.04} position={[0, 1.0, 0.08]} material={dark}/>
      {[1.5,1.15,0.8,0.45].map((y,i) => (
        <mesh key={`b${i}`} position={[0,y,0.18]} rotation={[Math.PI/2,0,0]} material={btn}><cylinderGeometry args={[0.06,0.06,0.05,12]}/></mesh>
      ))}
      {[-1.2,1.2].map((x,i) => (
        <RoundedBox key={`s${i}`} args={[0.04, bodyH*0.4, 0.18]} radius={0.02} position={[x, hemY + bodyH*0.2, 0.02]} material={dark}/>
      ))}
    </group>
  );
}

// SHERWANI — long structured coat, bandhgala collar, full button row, embroidery, stole
function Sherwani3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const mat = useMat(colors, pattern, 0.55, 0, 0.45, finishOf(o));
  const btn = useMemo(() => metalMaterial(o.button, colors.accent), [o.button, colors.accent]);
  const work = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.3, metalness: 0.5, clearcoat: 0.6 }), [colors.accent]);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.7 }), [colors.secondary]);
  const pj = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining), roughness: 0.86 }), [colors.lining]);
  const collar = o.collar || "bandhgala";
  const embellish = (o.work || "embroidered") !== "plain";
  const stole = o.stole !== "no";
  const bodyH = 5.0; const cy = 1.9 - bodyH / 2;
  return (
    <group>
      {[-0.58, 0.58].map((x, i) => (<RoundedBox key={`l${i}`} args={[0.56, 2.2, 0.5]} radius={0.14} position={[x,-2.5,0]} material={pj}/>))}
      <RoundedBox args={[2.5, bodyH, 0.2]} radius={0.1} position={[0,cy,0]} material={mat}/>
      <RoundedBox args={[0.92, 2.7, 0.16]} radius={0.07} position={[-1.6, cy+0.7, 0]} rotation={[0,0,0.16]} material={mat}/>
      <RoundedBox args={[0.92, 2.7, 0.16]} radius={0.07} position={[1.6, cy+0.7, 0]} rotation={[0,0,-0.16]} material={mat}/>
      {collar !== "round"
        ? <RoundedBox args={[1.0, 0.5, 0.24]} radius={0.08} position={[0,1.86,0.06]} material={dark}/>
        : <Torus args={[0.5,0.1,12,32,Math.PI]} position={[0,1.8,0.04]} rotation={[0,0,Math.PI]} material={dark}/>}
      <RoundedBox args={[0.2, bodyH-0.6, 0.22]} radius={0.05} position={[0, cy+0.1, 0.1]} material={embellish ? work : dark}/>
      {Array.from({length:9},(_,i) => (
        <mesh key={`b${i}`} position={[0, 1.5 - i*0.45, 0.22]} rotation={[Math.PI/2,0,0]} material={btn}><cylinderGeometry args={[0.07,0.07,0.05,12]}/></mesh>
      ))}
      {embellish && <>
        <RoundedBox args={[2.5, 0.2, 0.22]} radius={0.05} position={[0, cy - bodyH/2 + 0.2, 0.02]} material={work}/>
        <RoundedBox args={[0.14, bodyH-0.8, 0.2]} radius={0.04} position={[-1.18, cy, 0.04]} material={work}/>
        <RoundedBox args={[0.14, bodyH-0.8, 0.2]} radius={0.04} position={[1.18, cy, 0.04]} material={work}/>
      </>}
      {stole && <RoundedBox args={[0.5, 4.2, 0.1]} radius={0.05} position={[1.5, 0.2, 0.16]} rotation={[0,0,0.12]} material={work}/>}
    </group>
  );
}

// NEHRU JACKET — sleeveless waistcoat over a kurta/shirt, mandarin collar
function NehruJacket3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const mat = useMat(colors, pattern, 0.65, 0, 0.35, finishOf(o));
  const inner = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining), roughness: 0.8 }), [colors.lining]);
  const btn = useMemo(() => metalMaterial(o.button, colors.accent), [o.button, colors.accent]);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.72 }), [colors.secondary]);
  const pocket = o.pocket || "welt";
  const innerStyle = o.inner || "kurta";
  return (
    <group>
      <RoundedBox args={[2.5, 4.2, 0.12]} radius={0.1} position={[0,-0.2,-0.06]} material={inner}/>
      {innerStyle === "shirt" && <>
        <RoundedBox args={[0.6,0.5,0.12]} radius={0.06} position={[-0.3,1.78,0.0]} rotation={[0,0,-0.2]} material={inner}/>
        <RoundedBox args={[0.6,0.5,0.12]} radius={0.06} position={[0.3,1.78,0.0]} rotation={[0,0,0.2]} material={inner}/>
      </>}
      <RoundedBox args={[2.7, 3.4, 0.16]} radius={0.1} position={[0,-0.1,0.02]} material={mat}/>
      <RoundedBox args={[1.0, 0.42, 0.22]} radius={0.08} position={[0,1.78,0.08]} material={dark}/>
      <RoundedBox args={[0.12, 3.2, 0.2]} radius={0.04} position={[0,-0.1,0.12]} material={dark}/>
      {[1.2,0.75,0.3,-0.15,-0.6].map((y,i) => (
        <mesh key={`b${i}`} position={[0,y,0.14]} rotation={[Math.PI/2,0,0]} material={btn}><cylinderGeometry args={[0.07,0.07,0.05,12]}/></mesh>
      ))}
      {pocket === "welt" && [-0.85,0.85].map((x,i) => (<RoundedBox key={`p${i}`} args={[0.8,0.16,0.06]} radius={0.04} position={[x,-1.0,0.12]} material={dark}/>))}
      {pocket === "patch" && [-0.85,0.85].map((x,i) => (<RoundedBox key={`p${i}`} args={[0.78,0.7,0.06]} radius={0.06} position={[x,-1.0,0.12]} material={dark}/>))}
    </group>
  );
}

// PATHANI SUIT — loose long kurta + baggy salwar, band collar
function Pathani3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const mat = useMat(colors, pattern, 0.82, 0, 0.2, finishOf(o));
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.78 }), [colors.secondary]);
  const sal = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining || colors.main), roughness: 0.84 }), [colors.lining, colors.main]);
  const btn = useMemo(() => metalMaterial(o.button === "accent" || !o.button ? undefined : o.button, colors.accent), [o.button, colors.accent]);
  const collar = o.collar || "band";
  const length = o.length || "regular";
  const pocket = o.pocket !== "no";
  const bodyH = length === "long" ? 4.6 : 4.0; const cy = 1.9 - bodyH / 2;
  return (
    <group>
      {[-0.62,0.62].map((x,i) => (<RoundedBox key={`l${i}`} args={[1.0,2.4,0.9]} radius={0.3} position={[x,-2.3,0]} material={sal}/>))}
      {[-0.62,0.62].map((x,i) => (<RoundedBox key={`c${i}`} args={[0.6,0.3,0.6]} radius={0.1} position={[x,-3.4,0]} material={sal}/>))}
      <RoundedBox args={[2.9, bodyH, 0.18]} radius={0.12} position={[0,cy,0]} material={mat}/>
      <RoundedBox args={[1.05, 2.6, 0.16]} radius={0.08} position={[-1.78, cy+0.6, 0]} rotation={[0,0,0.2]} material={mat}/>
      <RoundedBox args={[1.05, 2.6, 0.16]} radius={0.08} position={[1.78, cy+0.6, 0]} rotation={[0,0,-0.2]} material={mat}/>
      {collar === "band"
        ? <RoundedBox args={[1.0,0.42,0.24]} radius={0.08} position={[0,1.84,0.06]} material={dark}/>
        : <Torus args={[0.5,0.1,12,32,Math.PI]} position={[0,1.8,0.04]} rotation={[0,0,Math.PI]} material={dark}/>}
      <RoundedBox args={[0.16,1.5,0.2]} radius={0.04} position={[0,1.0,0.1]} material={dark}/>
      {[1.5,1.1,0.7].map((y,i) => (<mesh key={`b${i}`} position={[0,y,0.2]} rotation={[Math.PI/2,0,0]} material={btn}><cylinderGeometry args={[0.06,0.06,0.05,12]}/></mesh>))}
      {pocket && [-0.95,0.95].map((x,i) => (<RoundedBox key={`p${i}`} args={[0.7,0.7,0.06]} radius={0.06} position={[x, cy-0.6, 0.1]} material={dark}/>))}
    </group>
  );
}

// DHOTI — draped lower wrap with pleated front fan + zari border
function Dhoti3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const mat = useMat(colors, pattern, 0.78, 0, 0.15, finishOf(o));
  const border = useMemo(() => metalMaterial(o.border, colors.accent), [o.border, colors.accent]);
  const drape = o.drape || "veshti";
  const length = o.length || "regular";
  const legH = length === "long" ? 3.0 : 2.4;
  const legCy = 0.6 - legH / 2;
  return (
    <group position={[0,0.4,0]}>
      <Cylinder args={[1.25,1.3,0.9,32]} position={[0,1.0,0]} material={mat}/>
      <Torus args={[1.28,0.08,12,40]} position={[0,1.42,0]} rotation={[Math.PI/2,0,0]} material={border}/>
      {[-0.62,0.62].map((x,i) => (<RoundedBox key={`l${i}`} args={[1.05, legH, 0.95]} radius={0.2} position={[x, legCy, 0]} material={mat}/>))}
      {[-0.62,0.62].map((x,i) => (<RoundedBox key={`b${i}`} args={[1.1,0.16,1.0]} radius={0.05} position={[x, legCy - legH/2 + 0.08, 0]} material={border}/>))}
      {drape !== "panche" && [-0.18,0,0.18].map((x,i) => (<RoundedBox key={`p${i}`} args={[0.12, legH*0.9, 0.3]} radius={0.04} position={[x, legCy + 0.1, 0.55]} material={mat}/>))}
      {drape === "panche" && <RoundedBox args={[0.5, legH*0.8, 0.3]} radius={0.06} position={[1.0, legCy, 0.45]} rotation={[0,0,0.1]} material={mat}/>}
    </group>
  );
}

// ═════════════════════════════════════════════
// TRADITIONAL WEAR — WOMEN
// ═════════════════════════════════════════════

// LEHENGA — choli + flared skirt cone + dupatta + zari hem
function Lehenga3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const mat = useMat(colors, pattern, 0.5, 0, 0.4, finishOf(o));
  const choliMat = useMat({ ...colors, main: colors.secondary }, pattern, 0.55, 0, 0.3, finishOf(o));
  const border = useMemo(() => metalMaterial(o.border, colors.accent), [o.border, colors.accent]);
  const workType = o.work || "embroidered";
  const work = useMemo(() => {
    if (workType === "mirror") return new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#E8EEF2"), metalness: 1, roughness: 0.08, clearcoat: 1 });
    if (workType === "sequined") return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), metalness: 0.9, roughness: 0.16, clearcoat: 0.85 });
    return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.3, metalness: 0.55, clearcoat: 0.6 });
  }, [workType, colors.accent]);
  const flare = o.flare || "a-line";
  const dup = o.dupatta !== "no";
  const embellish = workType !== "plain";
  const botR = flare === "circular" ? 2.7 : flare === "mermaid" ? 1.7 : flare === "flared" ? 2.9 : 2.3;
  const topR = flare === "mermaid" ? 0.7 : 0.85;
  const skirtH = 4.0;
  return (
    <group>
      <RoundedBox args={[2.3, 1.0, 0.5]} radius={0.25} position={[0,1.7,0]} material={choliMat}/>
      <RoundedBox args={[0.7,0.5,0.4]} radius={0.18} position={[-1.35,1.85,0]} rotation={[0,0,0.3]} material={choliMat}/>
      <RoundedBox args={[0.7,0.5,0.4]} radius={0.18} position={[1.35,1.85,0]} rotation={[0,0,-0.3]} material={choliMat}/>
      <Torus args={[0.42,0.08,12,28,Math.PI]} position={[0,1.95,0.22]} rotation={[0,0,Math.PI]} material={border}/>
      <Cylinder args={[topR, botR, skirtH, 48]} position={[0,-1.0,0]} material={mat}/>
      <Cylinder args={[botR+0.02, botR+0.05, 0.3, 48]} position={[0,-2.85,0]} material={border}/>
      <Cylinder args={[topR+0.04, topR+0.04, 0.22, 40]} position={[0,1.0,0]} material={border}/>
      {embellish && Array.from({length:16},(_,i) => { const a = i/16*Math.PI*2; return (
        <mesh key={`w${i}`} position={[Math.sin(a)*(botR+0.04), -2.7, Math.cos(a)*(botR+0.04)]} material={work}><sphereGeometry args={[0.1,12,12]}/></mesh>
      );})}
      {dup && <RoundedBox args={[0.6,3.4,0.08]} radius={0.06} position={[-1.45,0.4,0.3]} rotation={[0,0,0.16]} material={mat}/>}
      {dup && <RoundedBox args={[0.62,0.2,0.09]} radius={0.04} position={[-1.45,-1.25,0.3]} material={border}/>}
    </group>
  );
}

// ANARKALI — fitted bodice flaring into a floor-length gown
function Anarkali3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const mat = useMat(colors, pattern, 0.5, 0, 0.35, finishOf(o));
  const border = useMemo(() => metalMaterial(o.border, colors.accent), [o.border, colors.accent]);
  const yoke = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.3, metalness: 0.5, clearcoat: 0.6 }), [colors.accent]);
  const sleeve = o.sleeve || "long";
  const length = o.length || "floor";
  const dup = o.dupatta !== "no";
  const skirtH = length === "floor" ? 4.2 : length === "ankle" ? 3.6 : 2.6;
  const botR = length === "knee" ? 1.8 : 2.4;
  return (
    <group>
      <RoundedBox args={[2.0, 1.4, 0.6]} radius={0.2} position={[0,1.4,0]} material={mat}/>
      <RoundedBox args={[1.4, 0.5, 0.62]} radius={0.12} position={[0,1.95,0]} material={yoke}/>
      <Torus args={[0.4,0.07,12,28,Math.PI]} position={[0,2.0,0.3]} rotation={[0,0,Math.PI]} material={yoke}/>
      <Cylinder args={[0.95, botR, skirtH, 48]} position={[0, 1.0 - skirtH/2, 0]} material={mat}/>
      <Cylinder args={[botR+0.02, botR+0.05, 0.28, 48]} position={[0, 1.0 - skirtH + 0.14, 0]} material={border}/>
      <Cylinder args={[0.98,0.98,0.18,40]} position={[0,1.0,0]} material={border}/>
      {sleeve !== "sleeveless" && (() => { const sh = sleeve === "long" ? 2.6 : sleeve === "three-quarter" ? 1.9 : 1.0; const sy = 1.9 - sh/2; return (<>
        <RoundedBox args={[0.6, sh, 0.5]} radius={0.18} position={[-1.2, sy, 0]} rotation={[0,0,0.12]} material={mat}/>
        <RoundedBox args={[0.6, sh, 0.5]} radius={0.18} position={[1.2, sy, 0]} rotation={[0,0,-0.12]} material={mat}/>
      </>); })()}
      {dup && <RoundedBox args={[0.7,3.6,0.08]} radius={0.06} position={[1.5,0.3,0.3]} rotation={[0,0,-0.14]} material={mat}/>}
      {dup && <RoundedBox args={[0.72,0.2,0.09]} radius={0.04} position={[1.5,-1.4,0.3]} material={border}/>}
    </group>
  );
}

// SALWAR KAMEEZ — kameez tunic + salwar (patiala/straight/churidar/palazzo) + dupatta
function SalwarKameez3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const mat = useMat(colors, pattern, 0.7, 0, 0.25, finishOf(o));
  const border = useMemo(() => o.border === "tonal"
    ? new THREE.MeshStandardMaterial({ color: new THREE.Color("#8a6d3b"), roughness: 0.6 })
    : metalMaterial(o.border, colors.accent), [o.border, colors.accent]);
  const salMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining || colors.secondary), roughness: 0.82 }), [colors.lining, colors.secondary]);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.74 }), [colors.secondary]);
  const salwar = o.salwar || "patiala";
  const length = o.length || "regular";
  const dup = o.dupatta !== "no";
  const bodyH = length === "long" ? 4.4 : length === "short" ? 3.0 : 3.8; const cy = 1.8 - bodyH / 2;
  const baggy = salwar === "patiala" || salwar === "palazzo";
  const legW = salwar === "palazzo" ? 1.2 : baggy ? 1.0 : salwar === "churidar" ? 0.55 : 0.78;
  return (
    <group>
      {[-0.62,0.62].map((x,i) => (<RoundedBox key={`l${i}`} args={[legW, 2.6, legW*0.9]} radius={baggy ? 0.35 : 0.18} position={[x,-2.4,0]} material={salMat}/>))}
      {salwar !== "palazzo" && [-0.62,0.62].map((x,i) => (<RoundedBox key={`c${i}`} args={[salwar === "churidar" ? 0.5 : 0.62, 0.3, 0.55]} radius={0.1} position={[x,-3.55,0]} material={salMat}/>))}
      <RoundedBox args={[2.5, bodyH, 0.16]} radius={0.1} position={[0,cy,0]} material={mat}/>
      <RoundedBox args={[0.85, 1.9, 0.14]} radius={0.07} position={[-1.55, cy+1.0, 0]} rotation={[0,0,0.2]} material={mat}/>
      <RoundedBox args={[0.85, 1.9, 0.14]} radius={0.07} position={[1.55, cy+1.0, 0]} rotation={[0,0,-0.2]} material={mat}/>
      <Torus args={[0.42,0.08,12,28,Math.PI]} position={[0,1.7,0.06]} rotation={[0,0,Math.PI]} material={border}/>
      <RoundedBox args={[2.5, 0.14, 0.18]} radius={0.05} position={[0, cy - bodyH/2 + 0.07, 0.02]} material={border}/>
      {[-1.18,1.18].map((x,i) => (<RoundedBox key={`s${i}`} args={[0.04, bodyH*0.35, 0.18]} radius={0.02} position={[x, cy - bodyH*0.28, 0.02]} material={dark}/>))}
      {dup && <>
        <Torus args={[1.15,0.18,16,40,Math.PI*1.3]} position={[0,0.9,0.1]} rotation={[0.3,0,0]} material={mat}/>
        <RoundedBox args={[0.6,2.2,0.08]} radius={0.06} position={[-1.2,-0.3,0.2]} rotation={[0,0,0.1]} material={mat}/>
      </>}
    </group>
  );
}

// KURTI — short tunic + leggings/palazzo, neckline & sleeve variations
function Kurti3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const mat = useMat(colors, pattern, 0.74, 0, 0.25, finishOf(o));
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.74 }), [colors.secondary]);
  const acc = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.5 }), [colors.accent]);
  const legMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining || colors.secondary), roughness: 0.84 }), [colors.lining, colors.secondary]);
  const neck = o.neck || "round";
  const sleeve = o.sleeve || "three-quarter";
  const length = o.length || "long";
  const bottom = o.bottom || "leggings";
  const bodyH = length === "long" ? 3.6 : 2.8; const cy = 1.7 - bodyH / 2;
  const shoulderY = cy + bodyH/2 - 0.3;
  return (
    <group>
      {bottom !== "none" && [-0.55,0.55].map((x,i) => (
        <RoundedBox key={`l${i}`} args={[bottom === "palazzo" ? 1.05 : 0.58, 2.4, bottom === "palazzo" ? 0.95 : 0.55]} radius={bottom === "palazzo" ? 0.3 : 0.16} position={[x,-2.3,0]} material={legMat}/>
      ))}
      <RoundedBox args={[2.4, bodyH, 0.15]} radius={0.1} position={[0,cy,0]} material={mat}/>
      {sleeve !== "sleeveless" && (() => { const sh = sleeve === "full" ? 2.4 : sleeve === "three-quarter" ? 1.7 : 0.9; const sy = shoulderY - sh/2 + 0.2; return (<>
        <RoundedBox args={[0.82, sh, 0.13]} radius={0.07} position={[-1.5, sy, 0]} rotation={[0,0,0.2]} material={mat}/>
        <RoundedBox args={[0.82, sh, 0.13]} radius={0.07} position={[1.5, sy, 0]} rotation={[0,0,-0.2]} material={mat}/>
      </>); })()}
      {neck === "round" && <Torus args={[0.42,0.08,12,28,Math.PI]} position={[0,1.62,0.06]} rotation={[0,0,Math.PI]} material={dark}/>}
      {neck === "boat" && <RoundedBox args={[1.3,0.1,0.16]} radius={0.04} position={[0,1.66,0.05]} material={dark}/>}
      {neck === "v" && <>
        <RoundedBox args={[0.1,0.7,0.16]} radius={0.04} position={[-0.2,1.4,0.05]} rotation={[0,0,-0.4]} material={dark}/>
        <RoundedBox args={[0.1,0.7,0.16]} radius={0.04} position={[0.2,1.4,0.05]} rotation={[0,0,0.4]} material={dark}/>
      </>}
      {neck === "keyhole" && <>
        <Torus args={[0.38,0.07,12,28,Math.PI]} position={[0,1.6,0.06]} rotation={[0,0,Math.PI]} material={dark}/>
        <mesh position={[0,1.3,0.06]} material={acc}><sphereGeometry args={[0.12,12,12]}/></mesh>
      </>}
      {neck === "square" && <>
        <RoundedBox args={[0.1,0.58,0.16]} radius={0.04} position={[-0.4,1.42,0.06]} material={dark}/>
        <RoundedBox args={[0.1,0.58,0.16]} radius={0.04} position={[0.4,1.42,0.06]} material={dark}/>
        <RoundedBox args={[0.9,0.1,0.16]} radius={0.04} position={[0,1.18,0.06]} material={dark}/>
      </>}
      {neck === "collar" && <>
        <RoundedBox args={[0.5,0.34,0.18]} radius={0.06} position={[-0.32,1.5,0.07]} rotation={[0,0,-0.3]} material={dark}/>
        <RoundedBox args={[0.5,0.34,0.18]} radius={0.06} position={[0.32,1.5,0.07]} rotation={[0,0,0.3]} material={dark}/>
      </>}
      <RoundedBox args={[2.4, 0.12, 0.16]} radius={0.04} position={[0, cy - bodyH/2 + 0.06, 0.02]} material={acc}/>
      {[-1.13,1.13].map((x,i) => (<RoundedBox key={`s${i}`} args={[0.04, bodyH*0.3, 0.16]} radius={0.02} position={[x, cy - bodyH*0.3, 0.02]} material={dark}/>))}
    </group>
  );
}

// ─────────────────────────────────────────────
// MODEL MAP
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// MANNEQUIN POSES — the figure is articulated (shoulder→elbow, hip→knee) so it can
// be posed. Each preset is a set of joint angles (radians). The studio exposes these
// as buttons so the user can move the legs / arms / body.
// ─────────────────────────────────────────────
export type MannequinPose = "stand" | "relaxed" | "walk" | "hips" | "tpose" | "handsup";
export const POSE_LIST: { id: MannequinPose; label: string }[] = [
  { id: "stand",   label: "Stand" },
  { id: "relaxed", label: "Relaxed" },
  { id: "walk",    label: "Walk" },
  { id: "hips",    label: "Hands on Hips" },
  { id: "tpose",   label: "T-Pose" },
  { id: "handsup", label: "Hands Up" },
];
type PoseAngles = { armRaise: number; armFwd: number; elbow: number; legSpread: number; legStep: number; knee: number };
const POSES: Record<string, PoseAngles> = {
  stand:   { armRaise: 0,    armFwd: 0,    elbow: 0,    legSpread: 0,    legStep: 0,    knee: 0 },
  relaxed: { armRaise: 0.12, armFwd: 0.14, elbow: 0.28, legSpread: 0.07, legStep: 0.14, knee: 0.22 },
  walk:    { armRaise: 0.05, armFwd: 0.55, elbow: 0.32, legSpread: 0.04, legStep: 0.5,  knee: 0.4 },
  hips:    { armRaise: 1.0,  armFwd: 0.1,  elbow: 1.55, legSpread: 0.14, legStep: 0,    knee: 0 },
  tpose:   { armRaise: 1.75, armFwd: 0,    elbow: 0,    legSpread: 0.06, legStep: 0,    knee: 0 },
  handsup: { armRaise: 2.9,  armFwd: 0.12, elbow: 0.18, legSpread: 0.09, legStep: 0,    knee: 0 },
};
const STAND = POSES.stand;

// ─────────────────────────────────────────────
// MANNEQUIN — procedural male / female body so garments can be previewed "worn".
// The torso is flattened + recessed so the (largely flat) garment shells cover it,
// while head, arms and legs keep full volume so the figure reads as a real person.
// Arms/legs are articulated so the figure can be posed (see POSES).
// ─────────────────────────────────────────────
function Mannequin({ gender, bareTorso, pose = STAND }: { gender: "male" | "female"; bareTorso?: boolean; pose?: PoseAngles }) {
  const female = gender === "female";
  // Skin: matte + low env reflection so studio lighting doesn't make it plasticky.
  const skin = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(female ? "#E8BE9C" : "#D7A684"), roughness: 0.78, metalness: 0, envMapIntensity: 0.45 }), [female]);
  const hair = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(female ? "#241813" : "#1C150F"), roughness: 0.5, metalness: 0.1, envMapIntensity: 0.7 }), [female]);
  const eyeWhite = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color("#F2EFEA"), roughness: 0.28 }), []);
  const iris = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color("#3A2A1E"), roughness: 0.22, metalness: 0.1 }), []);
  const brow = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(female ? "#4A3526" : "#33271C"), roughness: 0.72 }), [female]);
  const lips = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(female ? "#A85F54" : "#B07E6A"), roughness: 0.52 }), [female]);

  const shoulderR = female ? 0.92 : 1.14;
  const waistR    = female ? 0.70 : 0.86;
  const hipR      = female ? 1.02 : 0.92;
  const armR      = female ? 0.17 : 0.22;
  const legR      = female ? 0.30 : 0.35;

  return (
    <group>
      {/* Head — egg-shaped skull + jaw, ears, and face features for a human read */}
      <group position={[0, 2.78, 0.02]}>
        {/* cranium / face */}
        <mesh material={skin} scale={[0.92, 1.06, 0.96]}><sphereGeometry args={[0.5, 48, 48]}/></mesh>
        {/* jaw + chin */}
        <mesh material={skin} position={[0, -0.36, 0.05]} scale={[0.66, 0.52, 0.7]}><sphereGeometry args={[0.5, 32, 32]}/></mesh>
        {/* ears */}
        {[-1,1].map((s)=>(<mesh key={`ear${s}`} material={skin} position={[s*0.45, -0.03, -0.04]} scale={[0.38, 0.92, 0.6]}><sphereGeometry args={[0.13, 18, 18]}/></mesh>))}
        {/* hair — cap with a higher, natural hairline */}
        <mesh position={[0, 0.09, -0.04]} material={hair} scale={[1.0, 1.04, 1.03]}>
          <sphereGeometry args={[0.52, 44, 44, 0, Math.PI*2, 0, female ? Math.PI*0.54 : Math.PI*0.42]}/>
        </mesh>
        {/* Female hair — soft rounded back mass + two front locks framing the face */}
        {female && <>
          <mesh position={[0,-0.42,-0.22]} material={hair} scale={[1.02,1.18,0.72]}><sphereGeometry args={[0.6,36,36]}/></mesh>
          {[-1,1].map((s)=>(<mesh key={`lock${s}`} material={hair} position={[s*0.5,-0.34,0.18]} rotation={[0,0,s*0.06]} scale={[0.36,1.05,0.42]}><sphereGeometry args={[0.4,24,24]}/></mesh>))}
        </>}
        {/* brows */}
        {[-1,1].map((s)=>(<mesh key={`br${s}`} material={brow} position={[s*0.17, 0.15, 0.44]} rotation={[0,0,-s*0.08]} scale={[1,0.45,0.5]}><boxGeometry args={[0.16,0.035,0.05]}/></mesh>))}
        {/* eyes — sclera + iris, set slightly into sockets */}
        {[-1,1].map((s)=>(
          <group key={`eye${s}`} position={[s*0.175, 0.02, 0.44]}>
            <mesh material={eyeWhite} scale={[1.15,0.62,0.45]}><sphereGeometry args={[0.072,18,18]}/></mesh>
            <mesh material={iris} position={[0,0,0.045]} scale={[1,1,0.6]}><sphereGeometry args={[0.034,16,16]}/></mesh>
          </group>
        ))}
        {/* nose */}
        <mesh position={[0,-0.04,0.49]} rotation={[Math.PI/2,0,0]} material={skin}><cylinderGeometry args={[0.0, 0.08, 0.26, 12]}/></mesh>
        {/* lips */}
        <mesh material={lips} position={[0,-0.22,0.45]} scale={[1.1,0.3,0.42]}><sphereGeometry args={[0.1,18,14]}/></mesh>
      </group>
      {/* Neck */}
      <Cylinder args={[0.2, 0.25, 0.52, 24]} position={[0, 2.28, 0]} material={skin}/>
      {/* Clavicle / trapezius bridge — connects neck to shoulders so a bare neckline
          reads naturally. Only on the bare body; a garment covers the shoulders and
          would otherwise let this poke through the thin panel. */}
      {bareTorso && <>
        <mesh position={[0, 2.04, 0.06]} scale={[1.5, 0.5, 0.7]} material={skin}><sphereGeometry args={[0.5, 28, 20]}/></mesh>
        {[-1,1].map((s)=>(<mesh key={`trap${s}`} material={skin} position={[s*0.5, 2.06, -0.02]} rotation={[0,0,s*0.5]} scale={[1.1,0.5,0.7]}><sphereGeometry args={[0.32, 20, 16]}/></mesh>))}
      </>}
      {/* Torso. When a top/dress covers it we flatten + recess it so the (flat)
          garment panels sit cleanly over it. When bare (accessories, bottoms) we
          give it natural rounded depth so the figure reads as a real body. */}
      <group scale={[1, 1, bareTorso ? 0.56 : 0.38]} position={[0, 0, bareTorso ? -0.02 : -0.34]}>
        <Cylinder args={[shoulderR, waistR, 1.72, 32]} position={[0, 1.05, 0]} material={skin}/>
        <Cylinder args={[waistR, hipR, 1.2, 32]} position={[0, -0.5, 0]} material={skin}/>
        <Sphere args={[shoulderR*0.6, 24, 24]} position={[0, 1.84, 0]} material={skin}/>
        {/* pectoral / upper-chest definition for the bare male torso */}
        {bareTorso && !female && [-1,1].map((s)=>(<mesh key={`pec${s}`} position={[s*0.42,1.18,0.42]} scale={[1.1,0.8,0.7]} material={skin}><sphereGeometry args={[0.34,20,20]}/></mesh>))}
        {female && <>
          <mesh position={[-0.27, 0.98, 0.5]} scale={[1.15,1,0.72]} material={skin}><sphereGeometry args={[0.22,20,20]}/></mesh>
          <mesh position={[0.27, 0.98, 0.5]} scale={[1.15,1,0.72]} material={skin}><sphereGeometry args={[0.22,20,20]}/></mesh>
        </>}
      </group>
      {/* Pelvis */}
      <Sphere args={[hipR*0.86, 24, 24]} position={[0, -1.05, -0.18]} scale={[1, 0.78, 0.5]} material={skin}/>
      {/* Arms — articulated shoulder → elbow. Base A-pose splay (-sgn*0.18) plus the
          pose's shoulder raise (z) and forward swing (x, contralateral for a stride). */}
      {[-1, 1].map((sgn) => {
        const shoZ = -sgn * 0.18 + sgn * pose.armRaise;
        const shoX = sgn * pose.armFwd;
        return (
        <group key={sgn} position={[sgn*(shoulderR+0.04), 1.72, -0.16]} rotation={[shoX, 0, shoZ]}>
          <Sphere args={[armR*1.2, 18, 18]} material={skin}/>
          <Cylinder args={[armR, armR*0.9, 1.3, 18]} position={[0, -0.66, 0]} material={skin}/>
          {/* elbow joint */}
          <group position={[0, -1.32, 0]} rotation={[pose.elbow, 0, 0]}>
            <Sphere args={[armR*0.95, 16, 16]} material={skin}/>
            <Cylinder args={[armR*0.88, armR*0.74, 1.2, 18]} position={[0, -0.63, 0]} material={skin}/>
            <group position={[0, -1.33, 0]}>
              {/* palm */}
              <mesh position={[0,0.12,0]} scale={[1, 1.1, 0.46]} material={skin}><sphereGeometry args={[armR*1.05, 18, 18]}/></mesh>
              {/* fingers */}
              <RoundedBox args={[armR*1.7, 0.6, armR*0.72]} radius={armR*0.32} position={[0,-0.42,0]} material={skin}/>
              {/* thumb */}
              <mesh position={[sgn*armR*0.82, 0.04, 0.05]} rotation={[0,0,sgn*0.6]} scale={[0.5,0.92,0.42]} material={skin}><sphereGeometry args={[armR*0.58, 12, 12]}/></mesh>
            </group>
          </group>
        </group>
        );
      })}
      {/* Legs — articulated hip → knee. Pose spreads (z), steps (x, contralateral to
          the arms) and bends the rear knee for a natural stride. */}
      {[-1, 1].map((sgn) => {
        const hipZ = sgn * pose.legSpread;
        const hipX = -sgn * pose.legStep;
        const kneeBend = sgn > 0 ? pose.knee : pose.knee * 0.25;
        return (
        <group key={sgn} position={[sgn*0.46, -1.1, 0]} rotation={[hipX, 0, hipZ]}>
          <Sphere args={[legR*1.05, 18, 18]} material={skin}/>
          <Cylinder args={[legR, legR*0.85, 1.55, 20]} position={[0, -0.85, 0]} material={skin}/>
          {/* knee joint */}
          <group position={[0, -1.6, 0]} rotation={[kneeBend, 0, 0]}>
            <Sphere args={[legR*0.8, 16, 16]} material={skin}/>
            <Cylinder args={[legR*0.82, legR*0.5, 1.5, 20]} position={[0, -0.75, 0]} material={skin}/>
            {/* ankle */}
            <mesh position={[0,-1.42,0]} material={skin}><sphereGeometry args={[legR*0.52,16,16]}/></mesh>
            {/* foot (toe forward +Z) */}
            <mesh position={[0, -1.54, 0.32]} scale={[1, 0.5, 2.05]} material={skin}><sphereGeometry args={[legR*0.72, 16, 16]}/></mesh>
            {/* heel */}
            <mesh position={[0,-1.5,-0.16]} scale={[1,0.66,0.95]} material={skin}><sphereGeometry args={[legR*0.5,12,12]}/></mesh>
          </group>
        </group>
        );
      })}
    </group>
  );
}

const MODEL_MAP: Record<string, React.FC<{ colors: ProductColors; pattern: string; options?: Opts }>> = {
  "tshirt": TShirt3D, "shirt": Shirt3D, "polo": Polo3D,
  "hoodie": Hoodie3D, "jacket": Jacket3D, "bomber": Bomber3D,
  "shorts": Shorts3D, "joggers": Joggers3D, "jeans": Jeans3D,
  "saree": Saree3D, "lehenga": Lehenga3D, "anarkali": Anarkali3D,
  "salwar-kameez": SalwarKameez3D, "kurti": Kurti3D,
  "kurta": Kurta3D, "sherwani": Sherwani3D, "nehru-jacket": NehruJacket3D,
  "pathani": Pathani3D, "dhoti": Dhoti3D,
  "sneaker-low": SneakerLow3D, "sneaker-high": SneakerHigh3D,
  "boot": Boot3D, "sandal": Sandal3D, "slip-on": SlipOn3D,
  "cap": Cap3D, "beanie": Beanie3D, "bucket-hat": BucketHat3D,
  "backpack": Backpack3D, "tote": Tote3D,
  "watch": Watch3D, "sunglasses": Sunglasses3D, "belt": Belt3D,
  "chain": Chain3D, "wallet": Wallet3D, "scarf": Scarf3D,
  "socks": Socks3D, "phone-case": PhoneCase3D,
  "ring": Ring3D, "earrings": Earrings3D,
};

// Products whose garment shell covers the torso → mannequin uses the flat recessed
// torso so the panels sit cleanly. Everything else (bottoms, footwear, accessories)
// shows a bare body, so the torso gets natural rounded depth instead.
const TORSO_GARMENTS = new Set<string>([
  "tshirt", "shirt", "polo", "hoodie", "jacket", "bomber",
  "saree", "lehenga", "anarkali", "salwar-kameez", "kurti",
  "kurta", "sherwani", "nehru-jacket", "pathani",
]);

// Products that cover the legs → the leg pose is suppressed so the limbs don't poke
// out of a skirt / trousers. (Bottoms + full-length traditional wear.)
const LEG_GARMENTS = new Set<string>([
  "shorts", "joggers", "jeans", "dhoti",
  "saree", "lehenga", "anarkali", "salwar-kameez",
  "kurti", "kurta", "sherwani", "pathani",
]);

// On-body placement (in mannequin-space units, the coord system shared by the
// Mannequin and the worn garment). Each item is positioned + scaled + rotated so
// it lands on the correct body part. Garments stay scale 1 and only shift in Y
// (tops up to the chest, bottoms down to the hips). Accessories shrink to body
// scale and sit on the matching landmark (head / face / neck / waist / wrist /
// feet). `pair` renders a second mirrored copy for left+right items (shoes,
// socks, earrings already model their own pair). Only applied when showBody.
type WearXf = { pos: [number, number, number]; scale: number | [number, number, number]; rot?: [number, number, number]; pair?: boolean };
const WEAR_TRANSFORM: Record<string, WearXf> = {
  // ── tops (cover the torso) ──
  tshirt: { pos: [0, 0.3, 0], scale: 1 }, shirt: { pos: [0, 0.3, 0], scale: 1 },
  polo: { pos: [0, 0.3, 0], scale: 1 }, hoodie: { pos: [0, 0.32, 0], scale: 1 },
  jacket: { pos: [0, 0.3, 0], scale: 1 }, bomber: { pos: [0, 0.45, 0], scale: 1 },
  // ── bottoms (drop to the hips) ──
  shorts: { pos: [0, -1.5, 0], scale: 1 }, joggers: { pos: [0, -2.0, 0], scale: 1 },
  jeans: { pos: [0, -2.2, 0], scale: 1 },
  // ── traditional / full-length ──
  saree: { pos: [0, -0.1, 0], scale: 1 }, lehenga: { pos: [0, -0.2, 0], scale: 1 },
  anarkali: { pos: [0, 0.0, 0], scale: 1 }, "salwar-kameez": { pos: [0, 0.0, 0], scale: 1 },
  kurti: { pos: [0, 0.1, 0], scale: 1 }, kurta: { pos: [0, 0.1, 0], scale: 1 },
  sherwani: { pos: [0, 0.05, 0], scale: 1 }, "nehru-jacket": { pos: [0, 0.2, 0], scale: 1 },
  pathani: { pos: [0, 0.05, 0], scale: 1 }, dhoti: { pos: [0, -1.3, 0], scale: 1 },
  // ── headwear (sit on top of the head) ──
  cap: { pos: [0, 3.04, -0.06], scale: 0.5, rot: [0.06, -0.2, 0] },
  beanie: { pos: [0, 3.0, -0.04], scale: [0.56, 0.54, 0.56] },
  "bucket-hat": { pos: [0, 3.1, -0.04], scale: 0.5 },
  // ── face ──
  sunglasses: { pos: [0, 2.82, 0.34], scale: 0.26, rot: [0.02, -0.15, 0] },
  // ── neck / chest ──
  chain: { pos: [0, 1.5, 0.46], scale: 0.3 },
  scarf: { pos: [0, 2.02, 0.05], scale: 0.45 },
  earrings: { pos: [0, 2.54, 0.32], scale: 0.34 },
  // ── waist ──
  belt: { pos: [0, 0.08, 0], scale: 0.42, rot: [1.27, -0.1, 0] },
  // ── wrist / hand ──
  watch: { pos: [0.82, -0.62, 0.06], scale: 0.2, rot: [0.55, -0.2, 0.05] },
  ring: { pos: [0.73, -0.92, -0.02], scale: 0.12 },
  wallet: { pos: [0.95, -0.7, 0.32], scale: 0.22 },
  "phone-case": { pos: [0.7, -0.66, 0.44], scale: 0.24, rot: [0.05, 0.22, 0] },
  // ── carried bags ──
  backpack: { pos: [0, 1.0, -0.72], scale: 0.5, rot: [0, Math.PI, 0] },
  tote: { pos: [0.98, -1.05, 0.2], scale: 0.42 },
  // ── footwear (pair: one on each foot, toe pointing forward +Z) ──
  // shoes model a side-profile (toe at -X) → +π/2 about Y turns the toe to face the camera
  "sneaker-low": { pos: [0.46, -4.2, 0.18], scale: 0.2, rot: [0, Math.PI / 2, 0], pair: true },
  "sneaker-high": { pos: [0.46, -4.08, 0.16], scale: 0.2, rot: [0, Math.PI / 2, 0], pair: true },
  boot: { pos: [0.46, -3.98, 0.14], scale: 0.2, rot: [0, Math.PI / 2, 0], pair: true },
  "slip-on": { pos: [0.46, -4.2, 0.18], scale: 0.2, rot: [0, Math.PI / 2, 0], pair: true },
  // sandal models a flat footprint (length X, "up" +Z) → lay it flat + toe forward
  sandal: { pos: [0.46, -4.3, 0.16], scale: 0.2, rot: [-Math.PI / 2, 0, Math.PI / 2], pair: true },
  // ── ankles ── (sock models toe at +X → -π/2 about Y points it forward)
  socks: { pos: [0.46, -3.7, 0.16], scale: 0.4, rot: [0, -Math.PI / 2, 0], pair: true },
};

// Places a product onto the mannequin using its WEAR_TRANSFORM (and mirrors it
// across the body centre-line for paired items like shoes/socks).
function WornModel({ productType, Model, colors, pattern, options }: {
  productType: string;
  Model: React.FC<{ colors: ProductColors; pattern: string; options?: Opts }>;
  colors: ProductColors; pattern: string; options?: Opts;
}) {
  const xf = WEAR_TRANSFORM[productType] || { pos: [0, 0, 0] as [number, number, number], scale: 1 };
  const rot = xf.rot ?? [0, 0, 0];
  if (xf.pair) {
    const ax = Math.abs(xf.pos[0]);
    return (
      <>
        <group position={[ax, xf.pos[1], xf.pos[2]]} scale={xf.scale} rotation={rot}>
          <Model colors={colors} pattern={pattern} options={options}/>
        </group>
        <group position={[-ax, xf.pos[1], xf.pos[2]]} scale={xf.scale} rotation={rot}>
          <Model colors={colors} pattern={pattern} options={options}/>
        </group>
      </>
    );
  }
  return (
    <group position={xf.pos} scale={xf.scale} rotation={rot}>
      <Model colors={colors} pattern={pattern} options={options}/>
    </group>
  );
}

export default function Product3DViewer({ productType, colors, pattern, options, showBody, bodyGender, still, pose }: {
  productType: string; colors: ProductColors; pattern: string; options?: Record<string, string>;
  showBody?: boolean; bodyGender?: "male" | "female"; still?: boolean; pose?: MannequinPose;
}) {
  const Model = MODEL_MAP[productType] || TShirt3D;
  const onBody = !!showBody;
  // Resolve the pose, suppressing arm angles when a top has sleeves and leg angles
  // when a garment covers the legs, so worn clothes never detach from the limbs.
  const effPose = useMemo(() => {
    const base = POSES[pose || "stand"] || STAND;
    const armsBare = !TORSO_GARMENTS.has(productType);
    const legsBare = !LEG_GARMENTS.has(productType);
    return {
      ...base,
      ...(armsBare ? {} : { armRaise: 0, armFwd: 0, elbow: 0 }),
      ...(legsBare ? {} : { legSpread: 0, legStep: 0, knee: 0 }),
    };
  }, [pose, productType]);
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.05 }}
      style={{ background: "#0d0d0d" }}
    >
      {/* Neutral tone mapping + near-white lights keep the rendered colour true to
          the swatch the user picked (ACES used to desaturate/darken it). Fills are
          only faintly tinted so they shape form without shifting the garment hue. */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 7]} intensity={2.0} castShadow shadow-mapSize={[2048,2048]} shadow-bias={-0.0001}/>
      <directionalLight position={[-6, 5, -4]} intensity={0.6} color="#dfe9ff"/>
      <directionalLight position={[0, -4, 5]} intensity={0.32} color="#fff2e0"/>
      <spotLight position={[0, 9, 5]} angle={0.4} penumbra={0.7} intensity={1.3} castShadow/>
      <Suspense fallback={null}>
        <RotatingModel still={still || onBody}>
          {/* On-body view shrinks + lifts the whole rig so the full figure frames cleanly */}
          <group scale={onBody ? 0.65 : 1} position={onBody ? [0, 0.36, 0] : [0, 0, 0]}>
            {onBody && <Mannequin gender={bodyGender === "female" ? "female" : "male"} bareTorso={!TORSO_GARMENTS.has(productType)} pose={effPose}/>}
            {onBody
              ? <WornModel productType={productType} Model={Model} colors={colors} pattern={pattern} options={options}/>
              : <Model colors={colors} pattern={pattern} options={options}/>}
          </group>
        </RotatingModel>
        <ContactShadows position={[0, onBody ? -2.5 : -3.5, 0]} opacity={0.6} scale={16} blur={2.6} resolution={1024} far={5}/>
        <Environment preset="studio"/>
      </Suspense>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={14} enableDamping dampingFactor={0.08}/>
    </Canvas>
  );
}
