"use client";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, RoundedBox, Cylinder, Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { ProductColors } from "./ProductCanvas";

function makeTexture(colors: ProductColors, pattern: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Base color
  ctx.fillStyle = colors.main;
  ctx.fillRect(0, 0, size, size);

  const ac = colors.accent;

  if (pattern === "bandhani") {
    for (let y = 0; y < size; y += 40) {
      for (let x = 0; x < size; x += 40) {
        ctx.strokeStyle = ac; ctx.globalAlpha = 0.4; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x + 20, y + 20, 14, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = ac; ctx.globalAlpha = 0.3;
        ctx.beginPath(); ctx.arc(x + 20, y + 20, 4, 0, Math.PI * 2); ctx.fill();
      }
    }
  } else if (pattern === "ikat") {
    ctx.globalAlpha = 0.35;
    for (let y = 0; y < size; y += 44) {
      for (let x = 0; x < size; x += 44) {
        ctx.fillStyle = ac;
        ctx.beginPath();
        ctx.moveTo(x + 22, y + 4); ctx.lineTo(x + 40, y + 22);
        ctx.lineTo(x + 22, y + 40); ctx.lineTo(x + 4, y + 22);
        ctx.closePath(); ctx.fill();
      }
    }
  } else if (pattern === "gradient") {
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, colors.main); g.addColorStop(1, colors.accent);
    ctx.fillStyle = g; ctx.globalAlpha = 1; ctx.fillRect(0, 0, size, size);
  } else if (pattern === "plaid") {
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < size; i += 48) {
      ctx.fillStyle = ac;
      ctx.fillRect(i, 0, 16, size);
      ctx.fillRect(0, i, size, 16);
    }
  } else if (pattern === "sashiko") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.35; ctx.lineWidth = 1.5;
    for (let y = 0; y < size; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
    }
    for (let x = 0; x < size; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke();
    }
    for (let y = 0; y < size; y += 40) {
      for (let x = 0; x < size; x += 40) {
        ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.stroke();
      }
    }
  } else if (pattern === "kente") {
    ctx.globalAlpha = 0.35;
    for (let y = 0; y < size; y += 36) {
      for (let x = 0; x < size; x += 36) {
        ctx.fillStyle = (x + y) % 72 === 0 ? ac : colors.detail;
        ctx.fillRect(x, y, 18, 18);
      }
    }
    ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.globalAlpha = 0.3;
    for (let y = 0; y < size; y += 36) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
    }
  } else if (pattern === "camo") {
    const blobs = [
      [100, 100, 80, 55], [280, 80, 70, 50], [180, 200, 90, 60],
      [350, 220, 75, 45], [80, 320, 85, 50], [300, 350, 70, 55],
    ];
    blobs.forEach(([x, y, rx, ry]) => {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = ac;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0.3, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (pattern === "tiedye") {
    for (let r = 200; r > 0; r -= 30) {
      ctx.strokeStyle = r % 60 === 0 ? ac : colors.secondary;
      ctx.lineWidth = 14; ctx.globalAlpha = 0.22;
      ctx.beginPath(); ctx.arc(256, 256, r, 0, Math.PI * 2); ctx.stroke();
    }
  } else if (pattern === "dots") {
    ctx.fillStyle = ac; ctx.globalAlpha = 0.4;
    for (let y = 20; y < size; y += 30) {
      for (let x = 20; x < size; x += 30) {
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
      }
    }
  } else if (pattern === "geometric") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.35; ctx.lineWidth = 2;
    for (let y = 0; y < size; y += 40) {
      for (let x = 0; x < size; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x + 20, y + 2); ctx.lineTo(x + 38, y + 20);
        ctx.lineTo(x + 20, y + 38); ctx.lineTo(x + 2, y + 20);
        ctx.closePath(); ctx.stroke();
      }
    }
  } else if (pattern === "diagonal") {
    ctx.strokeStyle = ac; ctx.globalAlpha = 0.3; ctx.lineWidth = 3;
    for (let i = -size; i < size * 2; i += 24) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + size, size); ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

function useMat(colors: ProductColors, pattern: string, roughness = 0.6, metalness = 0) {
  return useMemo(() => {
    const tex = typeof window !== "undefined" ? makeTexture(colors, pattern) : null;
    return new THREE.MeshStandardMaterial({
      map: tex, color: new THREE.Color(colors.main),
      roughness, metalness,
    });
  }, [colors.main, colors.accent, colors.detail, colors.secondary, pattern, roughness, metalness]);
}

function AccentMat(colors: ProductColors, roughness = 0.5) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness });
}

// ── Product 3D Models ──

function TShirt3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.85);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.9 }), [colors.secondary]);
  return (
    <group rotation={[0, 0, 0]}>
      <RoundedBox args={[2.8, 3.2, 0.12]} radius={0.06} position={[0, 0, 0]} material={mat}/>
      <RoundedBox args={[1.2, 1.0, 0.10]} radius={0.05} position={[-1.7, 0.9, 0]} rotation={[0, 0, 0.3]} material={dark}/>
      <RoundedBox args={[1.2, 1.0, 0.10]} radius={0.05} position={[1.7, 0.9, 0]} rotation={[0, 0, -0.3]} material={dark}/>
      <Torus args={[0.42, 0.1, 12, 32, Math.PI]} position={[0, 1.7, 0]} rotation={[0, 0, Math.PI]} material={dark}/>
    </group>
  );
}

function Hoodie3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.9);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.9 }), [colors.secondary]);
  return (
    <group>
      <RoundedBox args={[2.8, 3.2, 0.14]} radius={0.06} position={[0, 0, 0]} material={mat}/>
      <RoundedBox args={[1.2, 1.1, 0.12]} radius={0.05} position={[-1.75, 0.8, 0]} rotation={[0, 0, 0.3]} material={mat}/>
      <RoundedBox args={[1.2, 1.1, 0.12]} radius={0.05} position={[1.75, 0.8, 0]} rotation={[0, 0, -0.3]} material={mat}/>
      <RoundedBox args={[2.6, 0.5, 0.15]} radius={0.05} position={[0, -1.75, 0]} material={dark}/>
      <RoundedBox args={[1.6, 0.9, 0.16]} radius={0.1} position={[0, 1.9, 0.04]} material={dark}/>
    </group>
  );
}

function SneakerLow3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.7);
  const soleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.5 }), [colors.secondary]);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.4 }), [colors.accent]);
  return (
    <group rotation={[0, 0.3, 0]}>
      <RoundedBox args={[3.4, 0.35, 1.1]} radius={0.12} position={[0, -0.8, 0]} material={soleMat}/>
      <RoundedBox args={[3.0, 0.2, 0.9]} radius={0.08} position={[0, -0.55, 0]} material={accentMat}/>
      <mesh material={mat} position={[0.1, -0.1, 0]}>
        <extrudeGeometry args={[(() => {
          const s = new THREE.Shape();
          s.moveTo(-1.5, 0); s.quadraticCurveTo(-1.6, 0.6, -0.8, 0.9);
          s.quadraticCurveTo(0, 1.1, 0.8, 0.9); s.quadraticCurveTo(1.5, 0.7, 1.6, 0.2);
          s.lineTo(1.6, 0); s.closePath();
          return s;
        })(), { depth: 0.85, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.04, bevelSegments: 4 }]}/>
      </mesh>
      {[0.2, 0.5, 0.9, 1.2].map((x, i) => (
        <mesh key={i} position={[x - 0.8, 0.55, 0.45]} material={accentMat}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 8]}/>
        </mesh>
      ))}
    </group>
  );
}

function Cap3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.85);
  const brimMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.8 }), [colors.secondary]);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.5 }), [colors.accent]);
  return (
    <group>
      <mesh material={mat} position={[0, 0.2, -0.1]}>
        <sphereGeometry args={[1.15, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]}/>
      </mesh>
      <RoundedBox args={[2.1, 0.14, 0.9]} radius={0.06} position={[0, -0.38, 0.3]} rotation={[-0.15, 0, 0]} material={brimMat}/>
      <mesh material={accentMat} position={[0, 1.15, -0.1]}>
        <sphereGeometry args={[0.12, 12, 12]}/>
      </mesh>
    </group>
  );
}

function Backpack3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.85);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.9 }), [colors.secondary]);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.4, metalness: 0.3 }), [colors.accent]);
  return (
    <group>
      <RoundedBox args={[2.2, 2.8, 0.9]} radius={0.15} position={[0, 0, 0]} material={mat}/>
      <RoundedBox args={[1.6, 1.0, 0.12]} radius={0.08} position={[0, -0.6, 0.52]} material={dark}/>
      <mesh material={accentMat} position={[0.8, -0.6, 0.52]}>
        <sphereGeometry args={[0.1, 12, 12]}/>
      </mesh>
      <RoundedBox args={[0.18, 2.4, 0.12]} radius={0.06} position={[-1.3, 0, -0.4]} material={dark}/>
      <RoundedBox args={[0.18, 2.4, 0.12]} radius={0.06} position={[1.3, 0, -0.4]} material={dark}/>
    </group>
  );
}

function Tote3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.85);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.6 }), [colors.accent]);
  return (
    <group>
      <RoundedBox args={[2.6, 2.8, 0.6]} radius={0.1} position={[0, -0.2, 0]} material={mat}/>
      <Torus args={[0.7, 0.07, 12, 32, Math.PI]} position={[-0.7, 1.5, 0]} rotation={[0, 0, 0.15]} material={accentMat}/>
      <Torus args={[0.7, 0.07, 12, 32, Math.PI]} position={[0.7, 1.5, 0]} rotation={[0, 0, -0.15]} material={accentMat}/>
    </group>
  );
}

function Boot3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.75);
  const soleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.5 }), [colors.secondary]);
  return (
    <group rotation={[0, 0.3, 0]}>
      <RoundedBox args={[3.2, 0.4, 1.0]} radius={0.12} position={[0, -1.0, 0]} material={soleMat}/>
      <RoundedBox args={[2.8, 1.6, 0.85]} radius={0.12} position={[0.1, -0.1, 0]} material={mat}/>
      <RoundedBox args={[2.0, 1.8, 0.82]} radius={0.1} position={[-0.4, 1.2, 0]} material={mat}/>
    </group>
  );
}

function Sandal3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.7);
  const soleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.6 }), [colors.secondary]);
  return (
    <group rotation={[0.3, 0.2, 0]}>
      <RoundedBox args={[3.4, 0.25, 1.1]} radius={0.1} position={[0, -0.5, 0]} material={soleMat}/>
      <RoundedBox args={[2.8, 0.18, 0.5]} radius={0.06} position={[0, -0.2, 0.2]} material={mat}/>
      <RoundedBox args={[0.4, 0.18, 1.0]} radius={0.06} position={[-0.8, -0.2, -0.1]} material={mat}/>
      <RoundedBox args={[0.4, 0.18, 1.0]} radius={0.06} position={[0.8, -0.2, -0.1]} material={mat}/>
    </group>
  );
}

function Beanie3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.9);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.8 }), [colors.accent]);
  return (
    <group>
      <Sphere args={[1.1, 32, 32]} material={mat}/>
      <mesh material={accentMat} position={[0, 1.12, 0]}>
        <sphereGeometry args={[0.18, 12, 12]}/>
      </mesh>
      <RoundedBox args={[2.4, 0.35, 2.4]} radius={0.1} position={[0, -0.8, 0]} material={accentMat}/>
    </group>
  );
}

function BucketHat3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.85);
  const brimMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.85 }), [colors.secondary]);
  return (
    <group>
      <Cylinder args={[0.8, 1.0, 1.0, 32]} position={[0, 0.3, 0]} material={mat}/>
      <Cylinder args={[1.6, 1.7, 0.18, 32]} position={[0, -0.28, 0]} material={brimMat}/>
    </group>
  );
}

function Watch3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.5);
  const caseMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.2, metalness: 0.8 }), [colors.accent]);
  const faceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.1, metalness: 0.3 }), [colors.secondary]);
  return (
    <group rotation={[0.3, 0.3, 0]}>
      <Cylinder args={[1.0, 1.0, 0.22, 40]} position={[0, 0, 0]} material={caseMat}/>
      <Cylinder args={[0.88, 0.88, 0.06, 40]} position={[0, 0.12, 0]} material={faceMat}/>
      <RoundedBox args={[0.55, 2.2, 0.18]} radius={0.08} position={[0, 1.7, -0.02]} rotation={[0.1, 0, 0]} material={mat}/>
      <RoundedBox args={[0.55, 2.2, 0.18]} radius={0.08} position={[0, -1.7, -0.02]} rotation={[-0.1, 0, 0]} material={mat}/>
      <mesh material={caseMat} position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 8]}/>
      </mesh>
    </group>
  );
}

function Sunglasses3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const lensMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colors.main), roughness: 0, metalness: 0.1,
    transmission: 0.5, thickness: 0.3,
  }), [colors.main]);
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.2, metalness: 0.6 }), [colors.accent]);
  return (
    <group>
      <Cylinder args={[0.85, 0.85, 0.08, 40]} position={[-1.0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={lensMat}/>
      <Cylinder args={[0.85, 0.85, 0.08, 40]} position={[1.0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={lensMat}/>
      <Torus args={[0.85, 0.07, 12, 40]} position={[-1.0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={frameMat}/>
      <Torus args={[0.85, 0.07, 12, 40]} position={[1.0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={frameMat}/>
      <RoundedBox args={[0.4, 0.1, 0.08]} radius={0.03} position={[0, 0, 0]} material={frameMat}/>
      <RoundedBox args={[1.4, 0.08, 0.06]} radius={0.03} position={[-1.95, 0, -0.6]} rotation={[0, 0.4, 0]} material={frameMat}/>
      <RoundedBox args={[1.4, 0.08, 0.06]} radius={0.03} position={[1.95, 0, -0.6]} rotation={[0, -0.4, 0]} material={frameMat}/>
    </group>
  );
}

function Belt3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.7);
  const buckleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.1, metalness: 0.9 }), [colors.accent]);
  return (
    <group rotation={[0.3, 0, 0]}>
      <Torus args={[2.2, 0.22, 12, 60, Math.PI * 1.6]} position={[0, 0, 0]} material={mat}/>
      <RoundedBox args={[0.6, 0.55, 0.18]} radius={0.05} position={[-1.9, 0.8, 0]} material={buckleMat}/>
      <Torus args={[0.2, 0.05, 8, 20]} position={[-1.9, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]} material={buckleMat}/>
    </group>
  );
}

function Chain3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.1, metalness: 0.95 }), [colors.accent]);
  const pendantMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.main), roughness: 0.15, metalness: 0.8 }), [colors.main]);
  return (
    <group>
      {Array.from({ length: 14 }, (_, i) => (
        <Torus key={i} args={[0.22, 0.06, 8, 20]}
          position={[Math.sin(i * 0.5) * 0.1, 1.8 - i * 0.28, 0]}
          rotation={[0, i % 2 === 0 ? 0 : Math.PI / 2, 0]}
          material={mat}/>
      ))}
      <Sphere args={[0.28, 16, 16]} position={[0, -1.8, 0]} material={pendantMat}/>
    </group>
  );
}

function Wallet3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.65);
  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining), roughness: 0.7 }), [colors.lining]);
  return (
    <group rotation={[0.2, 0.3, 0]}>
      <RoundedBox args={[3.0, 1.8, 0.22]} radius={0.1} position={[0, 0, 0]} material={mat}/>
      <RoundedBox args={[2.85, 1.65, 0.06]} radius={0.08} position={[0, 0, 0.12]} material={innerMat}/>
      <RoundedBox args={[1.1, 0.9, 0.1]} radius={0.06} position={[0.8, 0.25, 0.18]} material={innerMat}/>
    </group>
  );
}

function Scarf3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.9);
  return (
    <group>
      <Torus args={[1.2, 0.28, 16, 60, Math.PI * 1.5]} position={[0, 0.3, 0]} rotation={[0.3, 0, 0]} material={mat}/>
      <RoundedBox args={[0.52, 3.0, 0.14]} radius={0.1} position={[-0.4, -1.5, 0]} rotation={[0, 0, 0.15]} material={mat}/>
    </group>
  );
}

function Socks3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.88);
  const cuffMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.88 }), [colors.accent]);
  return (
    <group rotation={[0.2, 0.3, 0]}>
      <Cylinder args={[0.55, 0.5, 2.2, 24]} position={[0, 0.5, 0]} material={mat}/>
      <Cylinder args={[0.58, 0.56, 0.45, 24]} position={[0, 1.7, 0]} material={cuffMat}/>
      <RoundedBox args={[1.3, 0.45, 0.9]} radius={0.12} position={[0.3, -0.75, 0.1]} rotation={[0.3, 0, 0]} material={mat}/>
    </group>
  );
}

function PhoneCase3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.6);
  const screenMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#111", roughness: 0.05, metalness: 0.1, transmission: 0.2 }), []);
  return (
    <group>
      <RoundedBox args={[2.0, 3.8, 0.26]} radius={0.2} position={[0, 0, 0]} material={mat}/>
      <RoundedBox args={[1.72, 3.3, 0.08]} radius={0.14} position={[0, 0, 0.14]} material={screenMat}/>
      <Cylinder args={[0.18, 0.18, 0.1, 20]} position={[0, 1.6, 0.14]} rotation={[Math.PI / 2, 0, 0]} material={screenMat}/>
    </group>
  );
}

function Ring3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.05, metalness: 0.95 }), [colors.accent]);
  const gemMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.main), roughness: 0, metalness: 0, transmission: 0.7, thickness: 0.5 }), [colors.main]);
  return (
    <group>
      <Torus args={[1.0, 0.22, 16, 60]} position={[0, 0, 0]} material={mat}/>
      <mesh position={[0, 1.1, 0]} material={gemMat}>
        <octahedronGeometry args={[0.35]}/>
      </mesh>
    </group>
  );
}

function Earrings3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.05, metalness: 0.95 }), [colors.accent]);
  const gemMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colors.main), roughness: 0, transmission: 0.6, thickness: 0.5 }), [colors.main]);
  return (
    <group>
      <Torus args={[0.5, 0.07, 12, 40]} position={[-1.2, 0.5, 0]} material={mat}/>
      <Torus args={[0.5, 0.07, 12, 40]} position={[1.2, 0.5, 0]} material={mat}/>
      <mesh position={[-1.2, -0.6, 0]} material={gemMat}><octahedronGeometry args={[0.25]}/></mesh>
      <mesh position={[1.2, -0.6, 0]} material={gemMat}><octahedronGeometry args={[0.25]}/></mesh>
    </group>
  );
}

function Joggers3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.85);
  const cuffMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.88 }), [colors.secondary]);
  return (
    <group>
      <RoundedBox args={[2.6, 0.55, 0.6]} radius={0.1} position={[0, 1.6, 0]} material={cuffMat}/>
      <RoundedBox args={[1.1, 2.4, 0.55]} radius={0.1} position={[-0.75, 0.1, 0]} material={mat}/>
      <RoundedBox args={[1.1, 2.4, 0.55]} radius={0.1} position={[0.75, 0.1, 0]} material={mat}/>
      <RoundedBox args={[0.9, 0.4, 0.5]} radius={0.08} position={[-0.75, -1.2, 0]} material={cuffMat}/>
      <RoundedBox args={[0.9, 0.4, 0.5]} radius={0.08} position={[0.75, -1.2, 0]} material={cuffMat}/>
    </group>
  );
}

function Shorts3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.85);
  const waistMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.9 }), [colors.secondary]);
  return (
    <group>
      <RoundedBox args={[2.6, 0.45, 0.6]} radius={0.08} position={[0, 1.1, 0]} material={waistMat}/>
      <RoundedBox args={[1.1, 1.6, 0.55]} radius={0.1} position={[-0.72, 0.1, 0]} material={mat}/>
      <RoundedBox args={[1.1, 1.6, 0.55]} radius={0.1} position={[0.72, 0.1, 0]} material={mat}/>
    </group>
  );
}

function Jeans3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, "denim", 0.75);
  const waistMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.8 }), [colors.secondary]);
  return (
    <group>
      <RoundedBox args={[2.6, 0.5, 0.6]} radius={0.08} position={[0, 1.8, 0]} material={waistMat}/>
      <RoundedBox args={[1.1, 3.2, 0.55]} radius={0.1} position={[-0.72, -0.2, 0]} material={mat}/>
      <RoundedBox args={[1.1, 3.2, 0.55]} radius={0.1} position={[0.72, -0.2, 0]} material={mat}/>
    </group>
  );
}

function Jacket3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.75);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.8 }), [colors.secondary]);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.3, metalness: 0.5 }), [colors.accent]);
  return (
    <group>
      <RoundedBox args={[2.8, 3.4, 0.16]} radius={0.08} position={[0, 0, 0]} material={mat}/>
      <RoundedBox args={[1.2, 1.2, 0.14]} radius={0.06} position={[-1.78, 0.7, 0]} rotation={[0, 0, 0.25]} material={dark}/>
      <RoundedBox args={[1.2, 1.2, 0.14]} radius={0.06} position={[1.78, 0.7, 0]} rotation={[0, 0, -0.25]} material={dark}/>
      <RoundedBox args={[0.14, 3.0, 0.18]} radius={0.04} position={[0, 0, 0.1]} material={accentMat}/>
    </group>
  );
}

function Bomber3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.75);
  const ribMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.88 }), [colors.accent]);
  return (
    <group>
      <RoundedBox args={[2.9, 2.8, 0.18]} radius={0.1} position={[0, 0, 0]} material={mat}/>
      <RoundedBox args={[1.2, 1.1, 0.16]} radius={0.06} position={[-1.78, 0.6, 0]} rotation={[0, 0, 0.25]} material={mat}/>
      <RoundedBox args={[1.2, 1.1, 0.16]} radius={0.06} position={[1.78, 0.6, 0]} rotation={[0, 0, -0.25]} material={mat}/>
      <RoundedBox args={[2.9, 0.38, 0.2]} radius={0.08} position={[0, -1.55, 0]} material={ribMat}/>
      <RoundedBox args={[1.2, 0.28, 0.18]} radius={0.06} position={[-1.78, -0.08, 0]} material={ribMat}/>
      <RoundedBox args={[1.2, 0.28, 0.18]} radius={0.06} position={[1.78, -0.08, 0]} material={ribMat}/>
      <RoundedBox args={[2.4, 0.28, 0.2]} radius={0.06} position={[0, 1.6, 0]} material={ribMat}/>
    </group>
  );
}

function Polo3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.82);
  const collarMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.8 }), [colors.accent]);
  return (
    <group>
      <RoundedBox args={[2.8, 3.2, 0.12]} radius={0.06} position={[0, 0, 0]} material={mat}/>
      <RoundedBox args={[1.2, 1.0, 0.10]} radius={0.05} position={[-1.7, 0.9, 0]} rotation={[0, 0, 0.3]} material={mat}/>
      <RoundedBox args={[1.2, 1.0, 0.10]} radius={0.05} position={[1.7, 0.9, 0]} rotation={[0, 0, -0.3]} material={mat}/>
      <RoundedBox args={[1.8, 0.35, 0.14]} radius={0.06} position={[0, 1.7, 0.04]} material={collarMat}/>
    </group>
  );
}

function Shirt3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.8);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.85 }), [colors.secondary]);
  return (
    <group>
      <RoundedBox args={[2.8, 3.4, 0.11]} radius={0.06} position={[0, 0, 0]} material={mat}/>
      <RoundedBox args={[1.15, 1.05, 0.10]} radius={0.05} position={[-1.72, 0.8, 0]} rotation={[0, 0, 0.28]} material={mat}/>
      <RoundedBox args={[1.15, 1.05, 0.10]} radius={0.05} position={[1.72, 0.8, 0]} rotation={[0, 0, -0.28]} material={mat}/>
      <RoundedBox args={[0.65, 0.55, 0.13]} radius={0.06} position={[-0.3, 1.75, 0.06]} material={dark}/>
      <RoundedBox args={[0.65, 0.55, 0.13]} radius={0.06} position={[0.3, 1.75, 0.06]} material={dark}/>
      {[0.5, 0, -0.5, -1.0].map((y, i) => (
        <Cylinder key={i} args={[0.06, 0.06, 0.06, 8]} position={[0, y, 0.08]} rotation={[Math.PI / 2, 0, 0]}
          material={new THREE.MeshStandardMaterial({ color: "#dddddd", roughness: 0.3 })}/>
      ))}
    </group>
  );
}

function SneakerHigh3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.7);
  const soleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.5 }), [colors.secondary]);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.4 }), [colors.accent]);
  return (
    <group rotation={[0, 0.3, 0]}>
      <RoundedBox args={[3.2, 0.36, 1.0]} radius={0.1} position={[0, -1.1, 0]} material={soleMat}/>
      <RoundedBox args={[2.8, 0.2, 0.88]} radius={0.07} position={[0, -0.88, 0]} material={accentMat}/>
      <RoundedBox args={[2.6, 1.1, 0.82]} radius={0.12} position={[0.1, -0.22, 0]} material={mat}/>
      <RoundedBox args={[2.0, 1.5, 0.8]} radius={0.1} position={[-0.35, 0.85, 0]} material={mat}/>
      {[0.2, 0.55, 0.9, 1.25, 1.55].map((y, i) => (
        <mesh key={i} position={[0, y, 0.42]} material={accentMat}>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 8]}/>
        </mesh>
      ))}
    </group>
  );
}

function SlipOn3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.72);
  const soleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.secondary), roughness: 0.5 }), [colors.secondary]);
  const elasticMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.lining || "#aaa"), roughness: 0.85 }), [colors.lining]);
  return (
    <group rotation={[0, 0.3, 0]}>
      <RoundedBox args={[3.3, 0.35, 1.0]} radius={0.1} position={[0, -0.9, 0]} material={soleMat}/>
      <RoundedBox args={[3.2, 0.18, 0.9]} radius={0.07} position={[0, -0.68, 0]} material={elasticMat}/>
      <mesh position={[0, 0, 0]} material={mat}>
        <extrudeGeometry args={[(() => {
          const s = new THREE.Shape();
          s.moveTo(-1.5, 0); s.quadraticCurveTo(-1.5, 0.9, 0, 1.0);
          s.quadraticCurveTo(1.5, 0.9, 1.5, 0); s.closePath();
          return s;
        })(), { depth: 0.82, bevelEnabled: false }]}/>
      </mesh>
      <RoundedBox args={[0.65, 0.55, 0.85]} radius={0.08} position={[0, 0.82, 0]} material={elasticMat}/>
    </group>
  );
}

function Saree3D({ colors, pattern }: { colors: ProductColors; pattern: string }) {
  const mat = useMat(colors, pattern, 0.55);
  const blouseMat = useMat({ ...colors, main: colors.secondary }, pattern, 0.6);
  const borderMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.accent), roughness: 0.4, metalness: 0.3 }), [colors.accent]);
  return (
    <group>
      {/* Main drape body */}
      <RoundedBox args={[2.8, 4.5, 0.08]} radius={0.04} position={[0, -0.5, 0]} material={mat}/>
      {/* Blouse (choli) */}
      <RoundedBox args={[2.4, 1.0, 0.14]} radius={0.06} position={[0, 1.9, 0.04]} material={blouseMat}/>
      {/* Pallu draped over shoulder */}
      <RoundedBox args={[0.9, 3.6, 0.07]} radius={0.04} position={[-2.0, 0.3, 0.06]} rotation={[0, 0, 0.18]} material={mat}/>
      {/* Bottom border */}
      <RoundedBox args={[2.8, 0.28, 0.1]} radius={0.04} position={[0, -2.72, 0.05]} material={borderMat}/>
      {/* Pallu border */}
      <RoundedBox args={[0.2, 3.6, 0.08]} radius={0.03} position={[-2.46, 0.3, 0.07]} rotation={[0, 0, 0.18]} material={borderMat}/>
      {/* Waist line detail */}
      <RoundedBox args={[2.8, 0.1, 0.12]} radius={0.03} position={[0, 1.38, 0.06]} material={borderMat}/>
    </group>
  );
}

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

function RotatingModel({ productType, colors, pattern }: { productType: string; colors: ProductColors; pattern: string }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.4; });
  const Model = MODEL_MAP[productType] || TShirt3D;
  return (
    <group ref={ref}>
      <Model colors={colors} pattern={pattern}/>
    </group>
  );
}

export default function Product3DViewer({
  productType, colors, pattern,
}: {
  productType: string;
  colors: ProductColors;
  pattern: string;
}) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden" style={{ background: "#0d0d0d" }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} shadows>
        <ambientLight intensity={0.5}/>
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow/>
        <directionalLight position={[-5, 2, -5]} intensity={0.4} color="#aaccff"/>
        <pointLight position={[0, -3, 4]} intensity={0.5} color="#fff5ee"/>
        <Suspense fallback={null}>
          <Environment preset="city"/>
          <RotatingModel productType={productType} colors={colors} pattern={pattern}/>
          <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2}/>
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={false} minDistance={3} maxDistance={12}/>
      </Canvas>
    </div>
  );
}
