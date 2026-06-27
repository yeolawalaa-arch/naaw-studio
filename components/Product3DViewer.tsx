"use client";
import { useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, RoundedBox, Cylinder, Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { ProductColors } from "./ProductCanvas";

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

function useMat(colors: ProductColors, pattern: string, roughness = 0.6, metalness = 0, clearcoat = 0) {
  return useMemo(() => {
    const tex = typeof window !== "undefined" ? makeTexture(colors, pattern) : null;
    if (clearcoat > 0) {
      return new THREE.MeshPhysicalMaterial({
        map: tex, color: new THREE.Color(colors.main),
        roughness, metalness, clearcoat, clearcoatRoughness: 0.15,
      });
    }
    return new THREE.MeshStandardMaterial({
      map: tex, color: new THREE.Color(colors.main), roughness, metalness,
    });
  }, [colors.main, colors.accent, colors.detail, colors.secondary, colors.lining, pattern, roughness, metalness, clearcoat]);
}

function RotatingModel({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.38; });
  return <group ref={ref}>{children}</group>;
}

// ─────────────────────────────────────────────
// SNEAKER LOW — proper shoe shape via ExtrudeGeometry
// ─────────────────────────────────────────────
function SneakerLow3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  // Material — white leather with clearcoat
  const upperMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xF6F6F6, roughness: 0.18, metalness: 0, clearcoat: 1.0, clearcoatRoughness: 0.08,
  }), []);
  const soleMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xE2E2E2, roughness: 0.88, metalness: 0,
  }), []);
  const outsoleRubber = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0xD0D0D0, roughness: 0.95,
  }), []);
  const accentMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colors.accent), roughness: 0.35, metalness: 0.05, clearcoat: 0.5,
  }), [colors.accent]);
  const laceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.92 }), []);
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
      {/* Tongue — flat panel at front opening */}
      <RoundedBox args={[1.05, 1.15, 0.12]} radius={0.06} position={[-0.45, 1.35, 0.9]}
        rotation={[-0.14, 0, 0]} material={tongueMat}/>
      {/* Accent side swoosh / logo stripe */}
      <RoundedBox args={[3.0, 0.18, 0.06]} radius={0.04}
        position={[0.1, 0.88, 1.44]} rotation={[0, 0, 0.05]} material={accentMat}/>
      {/* Laces */}
      {[-0.95,-0.5,-0.05,0.4,0.82].map((x,i) => (
        <RoundedBox key={i} args={[0.13, 0.06, 1.28]} radius={0.03}
          position={[x, 1.52+i*0.035, 0.84]} rotation={[-0.12,0,0]} material={laceMat}/>
      ))}
      {/* Heel tab accent */}
      <RoundedBox args={[0.25, 0.68, 0.13]} radius={0.06} position={[2.6, 0.96, 0.1]} material={accentMat}/>
      {/* Eyelet rings */}
      {[-0.95,-0.5,-0.05,0.4,0.82].map((x,i) => (
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
function SneakerHigh3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const upperMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colors.main), roughness: 0.22, metalness: 0, clearcoat: 0.9, clearcoatRoughness: 0.1,
  }), [colors.main]);
  const soleMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 0xE2E2E2, roughness: 0.88 }), []);
  const outsoleRubber = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xCCCCCC, roughness: 0.95 }), []);
  const accentMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colors.accent), roughness: 0.3, clearcoat: 0.6,
  }), [colors.accent]);
  const laceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.92 }), []);

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
function TShirt3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.82, 0, 0.3);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.88 }), [colors.secondary]);
  const collar = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.75 }), [colors.secondary]);
  return (
    <group>
      {/* Body */}
      <RoundedBox args={[2.85, 3.5, 0.14]} radius={0.08} position={[0,-0.1,0]} material={mat}/>
      {/* Left sleeve */}
      <RoundedBox args={[1.25, 1.05, 0.12]} radius={0.06} position={[-2.0,0.85,0]} rotation={[0,0,0.32]} material={dark}/>
      {/* Right sleeve */}
      <RoundedBox args={[1.25, 1.05, 0.12]} radius={0.06} position={[2.0,0.85,0]} rotation={[0,0,-0.32]} material={dark}/>
      {/* Collar (half-torus) */}
      <Torus args={[0.45, 0.11, 12, 32, Math.PI]} position={[0,1.82,0.02]} rotation={[0,0,Math.PI]} material={collar}/>
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
function Hoodie3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.88, 0, 0.15);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.9 }), [colors.secondary]);
  const accent = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.5 }), [colors.accent]);
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
      {/* Kangaroo pocket */}
      <RoundedBox args={[2.0, 0.7, 0.05]} radius={0.08} position={[0,-0.7,0.09]} material={dark}/>
      {/* Drawstring */}
      <RoundedBox args={[0.06, 0.8, 0.06]} radius={0.03} position={[-0.28, 1.6, 0.1]} material={accent}/>
      <RoundedBox args={[0.06, 0.8, 0.06]} radius={0.03} position={[0.28, 1.6, 0.1]} material={accent}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// SHIRT (button-down)
// ─────────────────────────────────────────────
function Shirt3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.78, 0, 0.2);
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
function Polo3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.8, 0, 0.2);
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
function Jacket3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.72, 0, 0.35);
  const lining = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining), roughness: 0.85 }), [colors.lining]);
  const zipper = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.1, metalness: 0.95 }), [colors.accent]);
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
function Bomber3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.72, 0, 0.3);
  const rib = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.88 }), [colors.accent]);
  const inner = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.9 }), [colors.secondary]);
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
function Shorts3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.85, 0, 0.1);
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
function Joggers3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.85, 0, 0.1);
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
function Jeans3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, "denim", 0.75, 0, 0.1);
  const waist = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.8 }), [colors.secondary]);
  const stitchMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xD4A853, roughness: 0.85 }), []);
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
function Cap3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.82, 0, 0.2);
  const brim = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.75, clearcoat: 0.4 }), [colors.secondary]);
  const acc = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.3, clearcoat: 0.6 }), [colors.accent]);
  return (
    <group rotation={[0.15, 0.2, 0]}>
      {/* Dome */}
      <mesh material={mat} position={[0, 0.22, -0.08]}>
        <sphereGeometry args={[1.18, 32, 18, 0, Math.PI*2, 0, Math.PI*0.56]}/>
      </mesh>
      {/* Sweatband */}
      <Cylinder args={[1.15, 1.15, 0.22, 36]} position={[0,-0.18,-0.08]} material={brim}/>
      {/* Structured brim */}
      <RoundedBox args={[2.2, 0.12, 1.0]} radius={0.05} position={[0,-0.35,0.45]} rotation={[-0.18,0,0]} material={brim}/>
      {/* Button on top */}
      <mesh material={acc} position={[0, 1.2, -0.08]}>
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
function Beanie3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.9, 0, 0.1);
  const acc = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.82 }), [colors.accent]);
  return (
    <group>
      {/* Main knit dome */}
      <Sphere args={[1.12, 32, 32]} material={mat}/>
      {/* Pom-pom */}
      <Sphere args={[0.24, 16, 16]} position={[0, 1.15, 0]} material={acc}/>
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
function BucketHat3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.82, 0, 0.2);
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
function Boot3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.68, 0, 0.45);
  const sole = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.92 }), [colors.secondary]);
  const acc = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.15, metalness: 0.85 }), [colors.accent]);

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
function Sandal3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.65, 0, 0.4);
  const sole = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.88 }), [colors.secondary]);
  const acc = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.2, metalness: 0.7 }), [colors.accent]);

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
function SlipOn3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.68, 0, 0.3);
  const sole = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.88 }), [colors.secondary]);
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
function Backpack3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.82, 0, 0.2);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.88 }), [colors.secondary]);
  const metal = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.1, metalness: 0.9 }), [colors.accent]);
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
function Tote3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.8, 0, 0.2);
  const handle = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.5, clearcoat: 0.4 }), [colors.accent]);
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
function Watch3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const bandMat = useMat(colors, pattern, 0.62, 0, 0.4);
  const caseMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.08, metalness: 0.95, clearcoat: 1.0 }), [colors.accent]);
  const dialMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.08, metalness: 0.15, clearcoat: 0.9 }), [colors.secondary]);
  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 0x88CCFF, roughness: 0, metalness: 0, transmission: 0.85, thickness: 0.2 }), []);
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
      {/* Hour markers */}
      {Array.from({length:12},(_,i) => {
        const a = i*Math.PI/6; return (
          <mesh key={i} position={[0.75*Math.cos(a), 0.22, 0.75*Math.sin(a)]} material={caseMat}>
            <boxGeometry args={[0.06, 0.06, 0.12]}/>
          </mesh>
        );
      })}
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
function Sunglasses3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const lensMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colors.main), roughness: 0.02, metalness: 0.12,
    transmission: 0.55, thickness: 0.32, clearcoat: 1.0,
  }), [colors.main]);
  const frame = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.18, metalness: 0.65, clearcoat: 0.8 }), [colors.accent]);
  const temple = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.55, clearcoat: 0.3 }), [colors.secondary]);
  return (
    <group rotation={[0.08, 0.15, 0]}>
      {/* Left lens */}
      <Cylinder args={[0.9, 0.9, 0.08, 44]} position={[-1.08,0,0]} rotation={[Math.PI/2,0,0]} material={lensMat}/>
      {/* Right lens */}
      <Cylinder args={[0.9, 0.9, 0.08, 44]} position={[1.08,0,0]} rotation={[Math.PI/2,0,0]} material={lensMat}/>
      {/* Left frame */}
      <Torus args={[0.9, 0.075, 14, 44]} position={[-1.08,0,0]} rotation={[Math.PI/2,0,0]} material={frame}/>
      {/* Right frame */}
      <Torus args={[0.9, 0.075, 14, 44]} position={[1.08,0,0]} rotation={[Math.PI/2,0,0]} material={frame}/>
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
function Belt3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.62, 0, 0.45);
  const buckle = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.06, metalness: 0.95, clearcoat: 1.0 }), [colors.accent]);
  return (
    <group rotation={[0.3, 0.1, 0]}>
      {/* Belt strap */}
      <Torus args={[2.25, 0.24, 14, 64, Math.PI*1.65]} position={[0,0,0]} material={mat}/>
      {/* Tail end */}
      <RoundedBox args={[0.5, 0.48, 0.1]} radius={0.06} position={[2.0,-0.9,0]} rotation={[0,0,0.6]} material={mat}/>
      {/* Buckle frame */}
      <RoundedBox args={[0.68, 0.58, 0.2]} radius={0.06} position={[-1.95,0.88,0]} material={buckle}/>
      <Torus args={[0.22, 0.055, 8, 20]} position={[-1.95,0.88,0]} rotation={[Math.PI/2,0,0]} material={buckle}/>
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
function Chain3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const chainMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.04, metalness: 0.98, clearcoat: 1.0 }), [colors.accent]);
  const pendant = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.main), roughness: 0.06, metalness: 0.85, clearcoat: 0.9 }), [colors.main]);
  return (
    <group>
      {Array.from({length:16},(_,i) => (
        <Torus key={i} args={[0.24, 0.065, 10, 22]}
          position={[Math.sin(i*0.52)*0.18, 2.0-i*0.28, 0]}
          rotation={[0, i%2===0 ? 0 : Math.PI/2, 0]}
          material={chainMat}/>
      ))}
      {/* Pendant — hexagonal tag */}
      <mesh position={[0,-2.4,0]} material={pendant}>
        <cylinderGeometry args={[0.38, 0.38, 0.1, 6]}/>
      </mesh>
      <mesh position={[0,-2.28,0]} rotation={[Math.PI/2,0,0]} material={chainMat}>
        <torusGeometry args={[0.08,0.04,8,16]}/>
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// WALLET
// ─────────────────────────────────────────────
function Wallet3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.6, 0, 0.5);
  const inner = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining), roughness: 0.7 }), [colors.lining]);
  const stitchMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.8 }), [colors.accent]);
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
function Scarf3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.88, 0, 0.1);
  const acc = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.85 }), [colors.accent]);
  return (
    <group>
      {/* Wrapped loop around neck */}
      <Torus args={[1.3, 0.3, 18, 64, Math.PI*1.6]} position={[0,0.4,0]} rotation={[0.32,0,0]} material={mat}/>
      {/* Left hanging end */}
      <RoundedBox args={[0.56, 3.2, 0.15]} radius={0.12} position={[-0.42,-1.55,0]} rotation={[0,0,0.16]} material={mat}/>
      {/* Right hanging end (behind) */}
      <RoundedBox args={[0.52, 2.4, 0.14]} radius={0.12} position={[0.55,-1.25,-0.12]} rotation={[0,0,-0.1]} material={acc}/>
      {/* Fringe top */}
      {[-0.2,0,0.2].map((x,i) => <RoundedBox key={i} args={[0.06,0.35,0.06]} radius={0.03} position={[x-0.42,-3.22,0]} material={acc}/>)}
      {[-0.15,0.05,0.25].map((x,i) => <RoundedBox key={i} args={[0.06,0.32,0.06]} radius={0.03} position={[x+0.55,-2.45,-0.12]} material={acc}/>)}
    </group>
  );
}

// ─────────────────────────────────────────────
// SOCKS
// ─────────────────────────────────────────────
function Socks3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.86, 0, 0.1);
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
function PhoneCase3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.55, 0, 0.6);
  const screen = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 0x0A0A12, roughness: 0.02, metalness: 0.08, transmission: 0.22, clearcoat: 1.0 }), []);
  const cam = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.04, metalness: 0.6, clearcoat: 1.0 }), []);
  const lens = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0, transmission: 0.6, thickness: 0.5, clearcoat: 1.0 }), [colors.accent]);
  return (
    <group>
      <RoundedBox args={[2.05, 4.0, 0.28]} radius={0.22} position={[0,0,0]} material={mat}/>
      {/* Screen */}
      <RoundedBox args={[1.78, 3.5, 0.08]} radius={0.16} position={[0,0,0.16]} material={screen}/>
      {/* Camera module */}
      <RoundedBox args={[0.68, 0.68, 0.12]} radius={0.1} position={[-0.5,1.5,-0.16]} material={cam}/>
      {/* Camera lenses */}
      <mesh position={[-0.58,1.58,-0.22]} rotation={[Math.PI/2,0,0]} material={lens}>
        <cylinderGeometry args={[0.16,0.16,0.12,20]}/>
      </mesh>
      <mesh position={[-0.38,1.42,-0.22]} rotation={[Math.PI/2,0,0]} material={lens}>
        <cylinderGeometry args={[0.14,0.14,0.12,20]}/>
      </mesh>
      {/* Flash */}
      <mesh position={[-0.22,1.6,-0.22]} rotation={[Math.PI/2,0,0]} material={new THREE.MeshPhysicalMaterial({color:0xFFEEAA,roughness:0.1,clearcoat:0.8})}>
        <cylinderGeometry args={[0.07,0.07,0.08,12]}/>
      </mesh>
      {/* Home bar */}
      <RoundedBox args={[0.62,0.07,0.06]} radius={0.03} position={[0,-1.65,0.2]} material={screen}/>
    </group>
  );
}

// ─────────────────────────────────────────────
// RING
// ─────────────────────────────────────────────
function Ring3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const metal = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.02, metalness: 0.98, clearcoat: 1.0 }), [colors.accent]);
  const gem = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.main), roughness: 0, metalness: 0, transmission: 0.8, thickness: 0.6, clearcoat: 1.0 }), [colors.main]);
  const gem2 = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.secondary), roughness: 0, transmission: 0.7, thickness: 0.4, clearcoat: 1.0 }), [colors.secondary]);
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
      {/* Centre stone */}
      <mesh position={[0, 0.42, 0]} material={gem}>
        <octahedronGeometry args={[0.42, 0]}/>
      </mesh>
      {/* Side stones */}
      {[-0.5,0.5].map((y,i) => (
        <mesh key={i} position={[0, 0.22, y]} material={gem2}>
          <octahedronGeometry args={[0.2, 0]}/>
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// EARRINGS
// ─────────────────────────────────────────────
function Earrings3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const metal = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.02, metalness: 0.98, clearcoat: 1.0 }), [colors.accent]);
  const gem = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.main), roughness: 0, transmission: 0.72, thickness: 0.5, clearcoat: 1.0 }), [colors.main]);
  return (
    <group>
      {/* Left earring */}
      <Torus args={[0.52, 0.075, 14, 44]} position={[-1.25,0.55,0]} material={metal}/>
      <RoundedBox args={[0.1, 0.55, 0.1]} radius={0.05} position={[-1.25,-0.14,0]} material={metal}/>
      <mesh position={[-1.25,-0.58,0]} material={gem}>
        <octahedronGeometry args={[0.28, 0]}/>
      </mesh>
      {/* Right earring */}
      <Torus args={[0.52, 0.075, 14, 44]} position={[1.25,0.55,0]} material={metal}/>
      <RoundedBox args={[0.1, 0.55, 0.1]} radius={0.05} position={[1.25,-0.14,0]} material={metal}/>
      <mesh position={[1.25,-0.58,0]} material={gem}>
        <octahedronGeometry args={[0.28, 0]}/>
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// SAREE (3D)
// ─────────────────────────────────────────────
function Saree3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.52, 0, 0.3);
  const blouse = useMat({...colors, main: colors.secondary}, pattern, 0.58, 0, 0.2);
  const border = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.accent), roughness: 0.35, metalness: 0.28, clearcoat: 0.6 }), [colors.accent]);
  return (
    <group>
      {/* Main drape */}
      <RoundedBox args={[2.95, 4.8, 0.09]} radius={0.06} position={[0,-0.45,0]} material={mat}/>
      {/* Blouse */}
      <RoundedBox args={[2.55, 1.05, 0.16]} radius={0.08} position={[0,2.1,0.06]} material={blouse}/>
      {/* Pallu drape over shoulder */}
      <RoundedBox args={[0.95, 3.85, 0.08]} radius={0.06} position={[-2.18,0.35,0.07]} rotation={[0,0,0.2]} material={mat}/>
      {/* Pallu border */}
      <RoundedBox args={[0.22, 3.85, 0.1]} radius={0.04} position={[-2.66,0.35,0.08]} rotation={[0,0,0.2]} material={border}/>
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
const MODEL_MAP: Record<string, React.FC<{ colors: ProductColors; pattern: string }>> = {
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

export default function Product3DViewer({ productType, colors, pattern }: {
  productType: string; colors: ProductColors; pattern: string;
}) {
  const Model = MODEL_MAP[productType] || TShirt3D;
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }} shadows style={{ background: "#0d0d0d" }}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 7]} intensity={1.6} castShadow shadow-mapSize={[2048,2048]}/>
      <directionalLight position={[-5, 4, -4]} intensity={0.6} color="#aaccff"/>
      <directionalLight position={[0, -5, 4]} intensity={0.3} color="#ffeecc"/>
      <spotLight position={[0, 8, 4]} angle={0.35} penumbra={0.6} intensity={1.2} castShadow/>
      <Suspense fallback={null}>
        <RotatingModel>
          <Model colors={colors} pattern={pattern}/>
        </RotatingModel>
        <ContactShadows position={[0,-3.5,0]} opacity={0.55} scale={14} blur={2.2} far={5}/>
        <Environment preset="city"/>
      </Suspense>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={14} enableDamping dampingFactor={0.08}/>
    </Canvas>
  );
}
