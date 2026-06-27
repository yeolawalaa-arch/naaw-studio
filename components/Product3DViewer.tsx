"use client";
import { useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, RoundedBox, Cylinder, Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { ProductColors } from "./ProductCanvas";
import { METALS, SHELLS, FABRICS, GEMS, LENS_TYPES, LENS_COLORS, FabricSpec } from "../lib/productOptions";

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
  }

  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
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
        map: tex, color: new THREE.Color(colors.main),
        roughness: r, metalness: mtl, clearcoat: cc, clearcoatRoughness: 0.15,
      });
      if (sheen > 0) { m.sheen = sheen; m.sheenRoughness = 0.45; m.sheenColor = new THREE.Color(colors.accent); }
      return m;
    }
    return new THREE.MeshStandardMaterial({
      map: tex, color: new THREE.Color(colors.main), roughness: r, metalness: mtl,
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

const SOLE_COLORS: Record<string, string> = { white: "#F2F2F2", gum: "#C9A26A", black: "#1C1C1C", cream: "#EBE3D0" };
const LACE_COLORS: Record<string, string> = { white: "#FFFFFF", black: "#1A1A1A", none: "#777777" };
const WASH_COLORS: Record<string, string> = { indigo: "#2A4A7A", light: "#7C9CC4", black: "#1A1A1A", grey: "#6A6A6A", acid: "#A8B8CC" };
const STITCH_COLORS: Record<string, string> = { gold: "#D4A853", white: "#EDEDED", tonal: "#3A3A3A" };

// gemstone cut → geometry
function gemCutGeometry(cut: string | undefined, r: number): THREE.BufferGeometry {
  switch (cut) {
    case "princess":    return new THREE.BoxGeometry(r * 1.45, r * 1.1, r * 1.45);
    case "emerald-cut": return new THREE.BoxGeometry(r * 1.2, r * 0.85, r * 1.8);
    case "marquise":    { const g = new THREE.OctahedronGeometry(r, 0); g.scale(0.6, 1, 1.8); return g; }
    case "oval":        { const g = new THREE.SphereGeometry(r, 22, 16); g.scale(1, 0.72, 1.45); return g; }
    case "round":
    default:            return new THREE.IcosahedronGeometry(r, 0);
  }
}

function RotatingModel({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.38; });
  return <group ref={ref}>{children}</group>;
}

// ─────────────────────────────────────────────
// SNEAKER LOW — proper shoe shape via ExtrudeGeometry
// ─────────────────────────────────────────────
function SneakerLow3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const fin = FABRICS[o.material || "leather"] || FABRICS.leather;
  const soleCol = SOLE_COLORS[o.sole || "white"] || "#F2F2F2";
  const laceId = o.lace || "white";
  const laceCol = laceId === "accent" ? colors.accent : (LACE_COLORS[laceId] || "#FFFFFF");
  const showLaces = laceId !== "none";
  const toe = o.toe || "cap";
  // Material — white upper, finish varies (leather/canvas/suede/mesh/patent)
  const upperMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xF6F6F6, roughness: fin.roughness, metalness: 0, clearcoat: fin.clearcoat, clearcoatRoughness: 0.08,
  }), [fin]);
  const perfMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.9 }), []);
  const soleMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(soleCol), roughness: 0.88, metalness: 0,
  }), [soleCol]);
  const outsoleRubber = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(soleCol).multiplyScalar(0.88), roughness: 0.95,
  }), [soleCol]);
  const accentMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colors.accent), roughness: 0.35, metalness: 0.05, clearcoat: 0.5,
  }), [colors.accent]);
  const laceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(laceCol), roughness: 0.92 }), [laceCol]);
  const tongueMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xF0F0F0, roughness: 0.35, clearcoat: 0.4,
  }), []);

  // Shoe side profile — drawn in XY plane, extruded along Z
  const shoeShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.15, 0.12);
    // Toe front curve (vertical face of toe box)
    s.bezierCurveTo(-2.5, 0.12, -2.65, 0.35, -2.65, 0.62);
    // Toe box top
    s.bezierCurveTo(-2.65, 1.0, -2.38, 1.18, -1.92, 1.22);
    // Vamp — gently rises toward ankle
    s.bezierCurveTo(-0.7, 1.28, 0.65, 1.45, 1.38, 1.78);
    // Ankle collar — peaks here
    s.bezierCurveTo(1.9, 2.05, 2.28, 2.02, 2.5, 1.8);
    // Heel back
    s.bezierCurveTo(2.75, 1.52, 2.88, 1.18, 2.82, 0.85);
    // Heel bottom
    s.bezierCurveTo(2.75, 0.5, 2.58, 0.16, 2.3, 0.04);
    // Sole bottom (heel to toe)
    s.bezierCurveTo(1.6, -0.04, -1.4, -0.04, -1.95, 0.06);
    s.bezierCurveTo(-2.06, 0.09, -2.15, 0.12, -2.15, 0.12);
    return s;
  }, []);

  // Flat outsole slightly taller than shoe base
  const soleShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.35, 0);
    s.bezierCurveTo(-2.7, 0, -2.78, 0.14, -2.78, 0.32);
    s.bezierCurveTo(-2.78, 0.5, -2.6, 0.58, -2.3, 0.58);
    s.lineTo(2.32, 0.58);
    s.bezierCurveTo(2.65, 0.58, 2.78, 0.46, 2.78, 0.28);
    s.bezierCurveTo(2.78, 0.1, 2.62, 0, 2.32, 0);
    s.lineTo(-2.35, 0);
    return s;
  }, []);

  const shoeGeo = useMemo(() => new THREE.ExtrudeGeometry(shoeShape, {
    depth: 1.65, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.22, bevelSegments: 8,
  }), [shoeShape]);

  const soleGeo = useMemo(() => new THREE.ExtrudeGeometry(soleShape, {
    depth: 1.65, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.1, bevelSegments: 4,
  }), [soleShape]);

  const cx = -0.82; // half of depth centered

  return (
    <group rotation={[0.1, -0.28, 0.04]} position={[0, -0.9, 0]}>
      {/* Rubber outsole */}
      <mesh geometry={soleGeo} material={outsoleRubber} position={[0, -0.04, cx]}/>
      {/* White foam midsole strip */}
      <mesh geometry={soleGeo} material={soleMat} position={[0, 0.28, cx]}/>
      {/* Upper shoe body */}
      <mesh geometry={shoeGeo} material={upperMat} position={[0, 0, cx]}/>
      {/* Toe box — rubber cap / perforations / plain */}
      {toe === "cap" && (
        <RoundedBox args={[0.5, 0.92, 1.78]} radius={0.2} position={[-2.16, 0.6, cx]} material={outsoleRubber}/>
      )}
      {toe === "perf" && [0,1].flatMap(r => [0,1,2,3].map(c => (
        <mesh key={`perf-${r}-${c}`} position={[-1.95 + r*0.32, 1.2 + r*0.04, cx - 0.55 + c*0.4]} material={perfMat}>
          <cylinderGeometry args={[0.045, 0.045, 0.05, 10]}/>
        </mesh>
      )))}
      {/* Tongue — flat panel at front opening */}
      <RoundedBox args={[1.05, 1.15, 0.12]} radius={0.06} position={[-0.45, 1.35, 0.9]}
        rotation={[-0.14, 0, 0]} material={tongueMat}/>
      {/* Accent side swoosh / logo stripe */}
      <RoundedBox args={[3.0, 0.18, 0.06]} radius={0.04}
        position={[0.1, 0.88, 1.44]} rotation={[0, 0, 0.05]} material={accentMat}/>
      {/* Laces */}
      {showLaces && [-0.95,-0.5,-0.05,0.4,0.82].map((x,i) => (
        <RoundedBox key={i} args={[0.13, 0.06, 1.28]} radius={0.03}
          position={[x, 1.52+i*0.035, 0.84]} rotation={[-0.12,0,0]} material={laceMat}/>
      ))}
      {/* Heel tab accent */}
      <RoundedBox args={[0.25, 0.68, 0.13]} radius={0.06} position={[2.6, 0.96, 0.1]} material={accentMat}/>
      {/* Eyelet rings */}
      {showLaces && [-0.95,-0.5,-0.05,0.4,0.82].map((x,i) => (
        <mesh key={i} position={[x, 1.52+i*0.035, 1.44]} rotation={[Math.PI/2,0,0]} material={accentMat}>
          <torusGeometry args={[0.09, 0.024, 6, 12]}/>
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// SNEAKER HIGH — same profile, taller ankle collar
// ─────────────────────────────────────────────
function SneakerHigh3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const fin = FABRICS[o.material || "leather"] || FABRICS.leather;
  const soleCol = SOLE_COLORS[o.sole || "white"] || "#F2F2F2";
  const laceId = o.lace || "white";
  const laceCol = laceId === "accent" ? colors.accent : (LACE_COLORS[laceId] || "#FFFFFF");
  const toe = o.toe || "cap";
  const upperMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colors.main), roughness: fin.roughness, metalness: 0, clearcoat: fin.clearcoat, clearcoatRoughness: 0.1,
  }), [colors.main, fin]);
  const perfMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.9 }), []);
  const soleMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(soleCol), roughness: 0.88 }), [soleCol]);
  const outsoleRubber = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(soleCol).multiplyScalar(0.86), roughness: 0.95 }), [soleCol]);
  const accentMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colors.accent), roughness: 0.3, clearcoat: 0.6,
  }), [colors.accent]);
  const laceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(laceCol), roughness: 0.92 }), [laceCol]);

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

  const soleShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.35, 0); s.bezierCurveTo(-2.75, 0, -2.82, 0.14, -2.82, 0.32);
    s.bezierCurveTo(-2.82, 0.5, -2.62, 0.58, -2.32, 0.58); s.lineTo(2.45, 0.58);
    s.bezierCurveTo(2.7, 0.58, 2.82, 0.44, 2.82, 0.28); s.bezierCurveTo(2.82, 0.1, 2.65, 0, 2.45, 0);
    s.lineTo(-2.35, 0);
    return s;
  }, []);

  const shoeGeo = useMemo(() => new THREE.ExtrudeGeometry(highShoeShape, {
    depth: 1.65, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.22, bevelSegments: 8,
  }), [highShoeShape]);
  const soleGeo = useMemo(() => new THREE.ExtrudeGeometry(soleShape, {
    depth: 1.65, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.1, bevelSegments: 4,
  }), [soleShape]);

  const cx = -0.82;
  return (
    <group rotation={[0.1, -0.28, 0.04]} position={[0, -1.2, 0]}>
      <mesh geometry={soleGeo} material={outsoleRubber} position={[0, -0.04, cx]}/>
      <mesh geometry={soleGeo} material={soleMat} position={[0, 0.28, cx]}/>
      <mesh geometry={shoeGeo} material={upperMat} position={[0, 0, cx]}/>
      {/* Toe box — rubber cap / perforations / plain */}
      {toe === "cap" && (
        <RoundedBox args={[0.5, 0.96, 1.78]} radius={0.2} position={[-2.16, 0.62, cx]} material={outsoleRubber}/>
      )}
      {toe === "perf" && [0,1].flatMap(r => [0,1,2,3].map(c => (
        <mesh key={`perf-${r}-${c}`} position={[-1.95 + r*0.32, 1.24 + r*0.04, cx - 0.55 + c*0.4]} material={perfMat}>
          <cylinderGeometry args={[0.045, 0.045, 0.05, 10]}/>
        </mesh>
      )))}
      <RoundedBox args={[1.05, 1.2, 0.12]} radius={0.06} position={[-0.45, 1.4, 0.9]} rotation={[-0.14,0,0]} material={upperMat}/>
      <RoundedBox args={[2.8, 0.18, 0.06]} radius={0.04} position={[0.05, 0.88, 1.44]} material={accentMat}/>
      {[-0.95,-0.5,-0.05,0.4,0.82,1.2,1.55].map((x,i) => (
        <RoundedBox key={i} args={[0.12, 0.06, 1.28]} radius={0.03}
          position={[x, 1.52+i*0.03, 0.84]} rotation={[-0.12,0,0]} material={laceMat}/>
      ))}
      <RoundedBox args={[0.22, 0.68, 0.13]} radius={0.06} position={[2.78, 0.96, 0.1]} material={accentMat}/>
      <RoundedBox args={[0.22, 0.68, 0.13]} radius={0.06} position={[1.9, 2.9, 0.1]} material={accentMat}/>
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
  const sl = sleeve === "long" ? { h: 2.3, y: 0.2 } : { h: 1.05, y: 0.85 };
  return (
    <group>
      {/* Body */}
      <RoundedBox args={[2.85, 3.5, 0.14]} radius={0.08} position={[0,-0.1,0]} material={mat}/>
      {/* Sleeves */}
      {sleeve !== "sleeveless" && <>
        <RoundedBox args={[1.25, sl.h, 0.12]} radius={0.06} position={[-2.0,sl.y,0]} rotation={[0,0,0.32]} material={dark}/>
        <RoundedBox args={[1.25, sl.h, 0.12]} radius={0.06} position={[2.0,sl.y,0]} rotation={[0,0,-0.32]} material={dark}/>
      </>}
      {/* Collar — crew (half-torus) / v-neck / scoop */}
      {neck === "vneck" ? (
        <>
          <RoundedBox args={[0.12, 0.7, 0.16]} radius={0.04} position={[-0.24,1.55,0.03]} rotation={[0,0,-0.5]} material={collar}/>
          <RoundedBox args={[0.12, 0.7, 0.16]} radius={0.04} position={[0.24,1.55,0.03]} rotation={[0,0,0.5]} material={collar}/>
        </>
      ) : (
        <Torus args={[neck === "scoop" ? 0.6 : 0.45, 0.11, 12, 32, Math.PI]} position={[0,1.82,0.02]} rotation={[0,0,Math.PI]} material={collar}/>
      )}
      {/* Shoulder seam lines */}
      <RoundedBox args={[0.04, 0.9, 0.15]} radius={0.02} position={[-1.42,0.85,0.01]} rotation={[0,0,0.32]} material={collar}/>
      <RoundedBox args={[0.04, 0.9, 0.15]} radius={0.02} position={[1.42,0.85,0.01]} rotation={[0,0,-0.32]} material={collar}/>
      {/* Bottom hem */}
      <RoundedBox args={[2.85, 0.1, 0.16]} radius={0.04} position={[0,-1.88,0.01]} material={collar}/>
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
      <RoundedBox args={[2.7, 0.55, 0.65]} radius={0.09} position={[0,1.9,0]} material={waist}/>
      <RoundedBox args={[1.12, 3.42, 0.6]} radius={0.1} position={[-0.72,-0.15,0]} material={mat}/>
      <RoundedBox args={[1.12, 3.42, 0.6]} radius={0.1} position={[0.72,-0.15,0]} material={mat}/>
      {/* Topstitching */}
      <RoundedBox args={[0.04, 3.42, 0.62]} radius={0.02} position={[-0.22,-0.15,0.01]} material={stitchMat}/>
      <RoundedBox args={[0.04, 3.42, 0.62]} radius={0.02} position={[0.22,-0.15,0.01]} material={stitchMat}/>
      {/* Belt loops */}
      {[-0.9,-0.3,0.3,0.9].map((x,i) => (
        <RoundedBox key={i} args={[0.12, 0.45, 0.08]} radius={0.04} position={[x,1.95,0.34]} material={waist}/>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// CAP
// ─────────────────────────────────────────────
function Cap3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.82, 0, 0.2, finishOf(options));
  const brim = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.75, clearcoat: 0.4 }), [colors.secondary]);
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
  const mat = useMat(colors, pattern, 0.9, 0, 0.1, finishOf(options));
  const acc = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.82 }), [colors.accent]);
  const pom = options?.pom !== "no";
  return (
    <group>
      {/* Main knit dome */}
      <Sphere args={[1.12, 32, 32]} material={mat}/>
      {/* Pom-pom */}
      {pom && <Sphere args={[0.24, 16, 16]} position={[0, 1.15, 0]} material={acc}/>}
      {/* Cuff fold */}
      <Cylinder args={[1.15, 1.18, 0.42, 36]} position={[0,-0.78,0]} material={acc}/>
      {/* Rib texture bands */}
      {[-0.55,-0.2,0.15,0.5,0.85].map((y,i) => (
        <Torus key={i} args={[1.12, 0.025, 6, 36, Math.PI*2]} position={[0,y,0]} rotation={[Math.PI/2,0,0]} material={acc}/>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// BUCKET HAT
// ─────────────────────────────────────────────
function BucketHat3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.82, 0, 0.2, finishOf(options));
  const brim = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.82, clearcoat: 0.2 }), [colors.secondary]);
  return (
    <group>
      {/* Crown */}
      <Cylinder args={[0.82, 1.02, 1.05, 36]} position={[0,0.32,0]} material={mat}/>
      {/* Top cap */}
      <mesh material={mat} position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.1, 36]}/>
      </mesh>
      {/* Floppy brim */}
      <mesh material={brim} position={[0,-0.22,0]} rotation={[-0.18,0,0]}>
        <torusGeometry args={[1.4, 0.22, 12, 36, Math.PI*2]}/>
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
  const mat = useMat(colors, pattern, 0.68, 0, 0.3, finishOf(options));
  const soleCol = SOLE_COLORS[options?.sole || "white"] || colors.secondary;
  const sole = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(soleCol), roughness: 0.88 }), [soleCol]);
  const elastic = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining || "#aaa"), roughness: 0.88 }), [colors.lining]);

  const shoeShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.1,0.1); s.bezierCurveTo(-2.5,0.1,-2.6,0.32,-2.6,0.58); s.bezierCurveTo(-2.6,0.9,-2.3,1.1,-1.85,1.14);
    s.bezierCurveTo(-0.5,1.2,0.7,1.4,1.4,1.55); s.bezierCurveTo(1.8,1.62,2.05,1.5,2.2,1.28);
    s.bezierCurveTo(2.48,0.9,2.58,0.55,2.5,0.28); s.bezierCurveTo(2.4,0.06,2.2,0.0,1.95,0.0);
    s.bezierCurveTo(1.1,-0.05,-1.5,-0.05,-1.9,0.06); s.bezierCurveTo(-2.02,0.08,-2.1,0.1,-2.1,0.1);
    return s;
  }, []);

  const soleS = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.25,0); s.bezierCurveTo(-2.65,0,-2.72,0.14,-2.72,0.3); s.bezierCurveTo(-2.72,0.46,-2.54,0.54,-2.25,0.54);
    s.lineTo(2.18,0.54); s.bezierCurveTo(2.52,0.54,2.62,0.42,2.62,0.26); s.bezierCurveTo(2.62,0.1,2.48,0,2.18,0); s.lineTo(-2.25,0);
    return s;
  }, []);

  const shoeGeo = useMemo(() => new THREE.ExtrudeGeometry(shoeShape, { depth:1.6, bevelEnabled:true, bevelThickness:0.2, bevelSize:0.22, bevelSegments:7 }), [shoeShape]);
  const soleGeo2 = useMemo(() => new THREE.ExtrudeGeometry(soleS, { depth:1.6, bevelEnabled:true, bevelThickness:0.07, bevelSize:0.09, bevelSegments:4 }), [soleS]);

  return (
    <group rotation={[0.1,-0.28,0.04]} position={[0,-0.75,0]}>
      <mesh geometry={soleGeo2} material={sole} position={[0,-0.02,-0.8]}/>
      <mesh geometry={shoeGeo} material={mat} position={[0,0,-0.8]}/>
      {/* Elastic gusset panels */}
      <RoundedBox args={[1.0,0.38,0.1]} radius={0.06} position={[-0.6,1.22,0.82]} rotation={[-0.12,0,0]} material={elastic}/>
      <RoundedBox args={[1.0,0.38,0.1]} radius={0.06} position={[0.6,1.22,0.82]} rotation={[-0.12,0,0]} material={elastic}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// BACKPACK
// ─────────────────────────────────────────────
function Backpack3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.82, 0, 0.2, finishOf(options));
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.88 }), [colors.secondary]);
  const metal = useMemo(() => metalMaterial(options?.hardware, colors.accent), [options?.hardware, colors.accent]);
  return (
    <group>
      {/* Main body */}
      <RoundedBox args={[2.35, 3.0, 1.0]} radius={0.18} position={[0,0.1,0]} material={mat}/>
      {/* Front pocket */}
      <RoundedBox args={[1.72, 1.1, 0.14]} radius={0.1} position={[0,-0.62,0.57]} material={dark}/>
      {/* Zipper pull on pocket */}
      <mesh material={metal} position={[0.86,-0.62,0.6]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.05,0.05,0.16,8]}/>
      </mesh>
      {/* Main compartment zip */}
      <RoundedBox args={[2.35,0.1,0.08]} radius={0.04} position={[0,1.62,0.04]} material={dark}/>
      <mesh material={metal} position={[1.18,1.62,0.1]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.06,0.06,0.18,8]}/>
      </mesh>
      {/* Shoulder straps */}
      <RoundedBox args={[0.22, 2.6, 0.14]} radius={0.08} position={[-0.7,0,-0.42]} material={dark}/>
      <RoundedBox args={[0.22, 2.6, 0.14]} radius={0.08} position={[0.7,0,-0.42]} material={dark}/>
      {/* Handle */}
      <RoundedBox args={[0.58, 0.18, 0.16]} radius={0.07} position={[0,1.72,-0.18]} material={dark}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// TOTE
// ─────────────────────────────────────────────
function Tote3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.8, 0, 0.2, finishOf(options));
  const handle = useMemo(() => options?.handle === "tonal"
    ? new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.detail), roughness: 0.5, clearcoat: 0.3 })
    : metalMaterial(options?.handle, colors.accent), [options?.handle, colors.accent, colors.detail]);
  return (
    <group>
      {/* Body */}
      <RoundedBox args={[2.75, 3.0, 0.65]} radius={0.12} position={[0,-0.15,0]} material={mat}/>
      {/* Inner top fold */}
      <RoundedBox args={[2.75, 0.22, 0.68]} radius={0.08} position={[0,1.52,0]} material={handle}/>
      {/* Handles */}
      <Torus args={[0.72, 0.07, 12, 34, Math.PI]} position={[-0.72,1.68,0]} rotation={[0,0,0.14]} material={handle}/>
      <Torus args={[0.72, 0.07, 12, 34, Math.PI]} position={[0.72,1.68,0]} rotation={[0,0,-0.14]} material={handle}/>
      {/* Stitching lines */}
      <RoundedBox args={[2.6,0.04,0.67]} radius={0.02} position={[0,0.0,0.01]} material={handle}/>
      <RoundedBox args={[2.6,0.04,0.67]} radius={0.02} position={[0,-0.85,0.01]} material={handle}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// WATCH
// ─────────────────────────────────────────────
function Watch3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const o = options || {};
  const strapId = o.strap || "leather";
  const strapFab: FabricSpec = strapId === "nylon" ? FABRICS.nylon : strapId === "rubber" ? { roughness: 0.55, clearcoat: 0.4, sheen: 0 } : FABRICS.leather;
  const bandFabricMat = useMat(colors, pattern, 0.62, 0, 0.4, strapFab);
  const caseMat = useMemo(() => metalMaterial(o.caseMetal, colors.accent), [o.caseMetal, colors.accent]);
  const bandMat = strapId === "steel" ? caseMat : bandFabricMat;
  const dialMat = useMemo(() => {
    const d = o.dial || "sunburst";
    if (d === "matte") return new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.7, metalness: 0.1 });
    if (d === "skeleton") return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.1, metalness: 0.25, transmission: 0.5, thickness: 0.3 });
    return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.08, metalness: 0.55, clearcoat: 0.9 });
  }, [o.dial, colors.secondary]);
  const glassMat = useMemo(() => {
    const tint: Record<string, number> = { clear: 0xCFE8FF, blue: 0x3A7BD5, smoke: 0x555555 };
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
    const sx = shape === "cat-eye" ? 1.05 : 1;
    const sy = shape === "aviator" || shape === "cat-eye" ? 0.82 : 1;
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
  const mat = useMat(colors, pattern, 0.62, 0, 0.45, finishOf(options));
  const buckle = useMemo(() => metalMaterial(options?.buckle, colors.accent), [options?.buckle, colors.accent]);
  const buckleStyle = options?.buckleStyle || "frame";
  return (
    <group rotation={[0.3, 0.1, 0]}>
      {/* Belt strap */}
      <Torus args={[2.25, 0.24, 14, 64, Math.PI*1.65]} position={[0,0,0]} material={mat}/>
      {/* Tail end */}
      <RoundedBox args={[0.5, 0.48, 0.1]} radius={0.06} position={[2.0,-0.9,0]} rotation={[0,0,0.6]} material={mat}/>
      {/* Buckle — frame / plate / ring */}
      {buckleStyle === "ring" ? (
        <Torus args={[0.34, 0.08, 12, 28]} position={[-1.95,0.88,0]} rotation={[Math.PI/2,0,0]} material={buckle}/>
      ) : buckleStyle === "plate" ? (
        <RoundedBox args={[0.82, 0.66, 0.16]} radius={0.08} position={[-1.95,0.88,0]} material={buckle}/>
      ) : (<>
        <RoundedBox args={[0.68, 0.58, 0.2]} radius={0.06} position={[-1.95,0.88,0]} material={buckle}/>
        <Torus args={[0.22, 0.055, 8, 20]} position={[-1.95,0.88,0]} rotation={[Math.PI/2,0,0]} material={buckle}/>
      </>)}
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
    if (link === "cuban") return <group key={i} position={[x,y,0]} scale={[1.35,1,0.55]} rotation={[0,rot,0]}><Torus args={[0.24,0.085,10,24]} material={chainMat}/></group>;
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
    </group>
  );
}

// ─────────────────────────────────────────────
// WALLET
// ─────────────────────────────────────────────
function Wallet3D({ colors, pattern, options }: { colors: ProductColors; pattern: string; options?: Opts }) {
  const mat = useMat(colors, pattern, 0.6, 0, 0.5, finishOf(options));
  const inner = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining), roughness: 0.7 }), [colors.lining]);
  const stitchCol = options?.stitch === "white" ? "#EDEDED" : options?.stitch === "tonal" ? "#3A3A3A" : colors.accent;
  const stitchMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(stitchCol), roughness: 0.8 }), [stitchCol]);
  return (
    <group rotation={[0.22, 0.32, 0]}>
      {/* Wallet body */}
      <RoundedBox args={[3.2, 1.92, 0.24]} radius={0.12} position={[0,0,0]} material={mat}/>
      {/* Inner card slot visible */}
      <RoundedBox args={[3.0, 1.72, 0.08]} radius={0.1} position={[0,0,0.14]} material={inner}/>
      {/* Card slots */}
      <RoundedBox args={[1.18, 1.0, 0.1]} radius={0.08} position={[0.88,0.28,0.2]} material={inner}/>
      <RoundedBox args={[1.18, 0.85, 0.1]} radius={0.08} position={[-0.88,0.22,0.2]} material={inner}/>
      {/* Center divider */}
      <RoundedBox args={[0.06, 1.72, 0.22]} radius={0.03} position={[0,0,0.06]} material={stitchMat}/>
      {/* Stitching edge */}
      {[-1.52,1.52].map((x,i) => <RoundedBox key={i} args={[0.04,1.72,0.26]} radius={0.02} position={[x,0,0]} material={stitchMat}/>)}
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
  return (
    <group rotation={[0.2, 0.3, 0]}>
      {/* Leg tube */}
      <Cylinder args={[0.58, 0.52, 2.35, 26]} position={[0,0.58,0]} material={mat}/>
      {/* Ribbed cuff */}
      <Cylinder args={[0.6, 0.6, 0.48, 26]} position={[0,1.82,0]} material={cuff}/>
      {/* Rib lines on cuff */}
      {Array.from({length:10},(_,i) => (
        <Torus key={i} args={[0.6, 0.018, 6, 26, Math.PI*2]} position={[0,1.6+i*0.04,0]} rotation={[Math.PI/2,0,0]} material={cuff}/>
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
interface PhoneSpec { w: number; h: number; r: number; thick: number; cam: PhoneCam; front: PhoneFront; lenses?: number; }
const PHONE_SPECS: Record<string, PhoneSpec> = {
  "iphone-15-pro-max": { w: 2.12, h: 4.45, r: 0.40, thick: 0.30, cam: "ios-square",       front: "island" },
  "iphone-15-pro":     { w: 2.00, h: 4.10, r: 0.38, thick: 0.30, cam: "ios-square",       front: "island" },
  "iphone-15":         { w: 2.00, h: 4.10, r: 0.42, thick: 0.28, cam: "ios-diagonal",     front: "island" },
  "iphone-se":         { w: 1.82, h: 3.66, r: 0.20, thick: 0.28, cam: "ios-single",       front: "home" },
  "galaxy-s24-ultra":  { w: 2.16, h: 4.55, r: 0.10, thick: 0.30, cam: "samsung-vertical", front: "punch", lenses: 4 },
  "galaxy-s24":        { w: 1.94, h: 4.05, r: 0.34, thick: 0.28, cam: "samsung-vertical", front: "punch", lenses: 3 },
  "pixel-8-pro":       { w: 2.06, h: 4.32, r: 0.38, thick: 0.30, cam: "pixel-bar",        front: "punch" },
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
  const metal = useMemo(() => metalMaterial(o.metal, colors.accent), [o.metal, colors.accent]);
  const gem = useMemo(() => gemMaterial(o.gem, colors.main), [o.gem, colors.main]);
  const cutGeo = useMemo(() => gemCutGeometry(o.gem === "pearl" ? "round" : "marquise", 0.28), [o.gem]);
  const style = o.style || "drop";
  const renderEarring = (x: number) => {
    if (style === "hoop") {
      // Big statement hoop only
      return (
        <group key={x} position={[x, 0.1, 0]}>
          <Torus args={[0.78, 0.085, 16, 52]} material={metal}/>
          <mesh position={[0, 0.78, 0]} material={metal}><sphereGeometry args={[0.1, 16, 16]}/></mesh>
        </group>
      );
    }
    if (style === "stud") {
      // Small gem on a post, sitting close to the ear
      return (
        <group key={x} position={[x, 0.2, 0]}>
          <mesh material={metal}><cylinderGeometry args={[0.34, 0.34, 0.1, 24]}/></mesh>
          <mesh position={[0, 0, 0.12]} geometry={cutGeo} material={gem}/>
          {[0,72,144,216,288].map((a,i) => (
            <mesh key={i} position={[0.26*Math.cos(a*Math.PI/180), 0.26*Math.sin(a*Math.PI/180), 0.1]} material={metal}>
              <boxGeometry args={[0.04, 0.16, 0.04]}/>
            </mesh>
          ))}
        </group>
      );
    }
    // drop — hoop top + post + dangling gem
    return (
      <group key={x}>
        <Torus args={[0.52, 0.075, 14, 44]} position={[x,0.55,0]} material={metal}/>
        <RoundedBox args={[0.1, 0.55, 0.1]} radius={0.05} position={[x,-0.14,0]} material={metal}/>
        <mesh position={[x,-0.58,0]} geometry={cutGeo} material={gem}/>
      </group>
    );
  };
  return (
    <group>
      {renderEarring(-1.25)}
      {renderEarring(1.25)}
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
  const palluX = drape === "gujarati" ? 2.18 : -2.18;
  const palluRot = drape === "gujarati" ? -0.2 : 0.2;
  const palluBorderX = drape === "gujarati" ? 2.66 : -2.66;
  const palluWidth = drape === "bengali" ? 1.35 : 0.95;
  return (
    <group>
      {/* Main drape */}
      <RoundedBox args={[2.95, 4.8, 0.09]} radius={0.06} position={[0,-0.45,0]} material={mat}/>
      {/* Blouse */}
      <RoundedBox args={[2.55, 1.05, 0.16]} radius={0.08} position={[0,2.1,0.06]} material={blouse}/>
      {/* Pallu drape over shoulder */}
      <RoundedBox args={[palluWidth, 3.85, 0.08]} radius={0.06} position={[palluX,0.35,0.07]} rotation={[0,0,palluRot]} material={mat}/>
      {/* Pallu border */}
      <RoundedBox args={[0.22, 3.85, 0.1]} radius={0.04} position={[palluBorderX,0.35,0.08]} rotation={[0,0,palluRot]} material={border}/>
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

// ─────────────────────────────────────────────
// MODEL MAP
// ─────────────────────────────────────────────
const MODEL_MAP: Record<string, React.FC<{ colors: ProductColors; pattern: string; options?: Opts }>> = {
  "tshirt": TShirt3D, "shirt": Shirt3D, "polo": Polo3D,
  "hoodie": Hoodie3D, "jacket": Jacket3D, "bomber": Bomber3D,
  "shorts": Shorts3D, "joggers": Joggers3D, "jeans": Jeans3D, "saree": Saree3D,
  "sneaker-low": SneakerLow3D, "sneaker-high": SneakerHigh3D,
  "boot": Boot3D, "sandal": Sandal3D, "slip-on": SlipOn3D,
  "cap": Cap3D, "beanie": Beanie3D, "bucket-hat": BucketHat3D,
  "backpack": Backpack3D, "tote": Tote3D,
  "watch": Watch3D, "sunglasses": Sunglasses3D, "belt": Belt3D,
  "chain": Chain3D, "wallet": Wallet3D, "scarf": Scarf3D,
  "socks": Socks3D, "phone-case": PhoneCase3D,
  "ring": Ring3D, "earrings": Earrings3D,
};

export default function Product3DViewer({ productType, colors, pattern, options }: {
  productType: string; colors: ProductColors; pattern: string; options?: Record<string, string>;
}) {
  const Model = MODEL_MAP[productType] || TShirt3D;
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      style={{ background: "#0d0d0d" }}
    >
      <ambientLight intensity={0.42} />
      <directionalLight position={[6, 10, 7]} intensity={2.1} castShadow shadow-mapSize={[2048,2048]} shadow-bias={-0.0001}/>
      <directionalLight position={[-6, 5, -4]} intensity={0.75} color="#bcd4ff"/>
      <directionalLight position={[0, -4, 5]} intensity={0.4} color="#ffe7c2"/>
      <spotLight position={[0, 9, 5]} angle={0.4} penumbra={0.7} intensity={1.6} castShadow/>
      <Suspense fallback={null}>
        <RotatingModel>
          <Model colors={colors} pattern={pattern} options={options}/>
        </RotatingModel>
        <ContactShadows position={[0,-3.5,0]} opacity={0.6} scale={16} blur={2.6} resolution={1024} far={5}/>
        <Environment preset="studio"/>
      </Suspense>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={14} enableDamping dampingFactor={0.08}/>
    </Canvas>
  );
}
