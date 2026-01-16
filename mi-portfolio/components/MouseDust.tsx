"use client";

import { useEffect, useRef } from "react";

const DUST = {
  life: 0.995,
  emitterRadius: 80,
  sizeMin: 0.2,
  sizeMax: 25.0,
  spawnBase: 14,
  spawnGain: 32,
  maxSpawn: 64,
  speed: 0.45,
  friction: 0.985,
  turbulence: 0.002,
  driftUp: 0.0008,
  alphaMin: 0.08,
  alphaMax: 0.16,
};

type Props = {
  className?: string;
  color?: string;          // "#FF4346" (o un gris si quieres más polvo real)
  maxParticles?: number;   // 600–1400
  sizeMin?: number;        // 0.5
  sizeMax?: number;        // 1.6
  trail?: number;          // 0..1  (0 = sin trail / 1 = trail fuerte). Recomiendo 0.15
  spawnMin?: number;     // 👈 NUEVO: emisión mínima (cursor quieto)
  spawnMax?: number;     // 👈 NUEVO: emisión máxima (cursor rápido)
  radiusMin?: number;    // 👈 NUEVO: emisor mínimo
  radiusMax?: number;    // 👈 NUEVO: emisor máximo
  speedMin?: number;     // 👈 NUEVO: px/s donde empieza a subir
  speedMax?: number;     // 👈 NUEVO: px/s donde ya está al máximo
};

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;  // 0..1
  size: number;
  a: number;
  seed: number;
  decay: number;
};

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}
function clamp01(v: number) {
  return clamp(v, 0, 1);
}
function remap01(v: number, inMin: number, inMax: number) {
  const t = (v - inMin) / (inMax - inMin);
  return clamp01(t);
}

// ruido baratito para “turbulencia”
function hash2(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}
function noise2(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);

  const u = smoothstep(xf);
  const v = smoothstep(yf);

  const ab = a + (b - a) * u;
  const cd = c + (d - c) * u;
  return ab + (cd - ab) * v;
}

export default function MouseDust({
  className,
  color = "#fdb4b5",
  maxParticles = 1100,
  sizeMin = 0.55,
  sizeMax = 1.55,
  trail = 0.15,
  spawnMin = 2,
  spawnMax = 40,
  radiusMin = 18,
  radiusMax = 110,
  speedMin = 20,
  speedMax = 1200,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reduced = mq?.matches ?? false;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = Math.max(1, parent.clientWidth);
      h = Math.max(1, parent.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Fondo del hero (#1F1F1F) para hacer trail sin “mancha”
    const bg = { r: 31, g: 31, b: 31 };

    // Mouse target + follower (delay)
    const target = { x: w * 0.5, y: h * 0.55, active: false };
    const follow = { x: w * 0.5, y: h * 0.55, vx: 0, vy: 0 };
    const emitterVel = { x: 0, y: 0 };      // px/s suavizada
    const lastFollow = { x: follow.x, y: follow.y };

    const parts: P[] = [];

    const spawn = (
      x: number,
      y: number,
      strength: number,
      mvx: number,
      mvy: number,
      radius: number,
      countOverride?: number
    ) => {

      // muchas partículas pequeñas
      const count = Math.floor(countOverride ?? clamp(
        DUST.spawnBase + strength * DUST.spawnGain,
        DUST.spawnBase,
        DUST.maxSpawn
      ));

      
      // espacio disponible
      const room = maxParticles - parts.length;
      if (room <= 0) return;

      const finalCount = Math.min(count, room);

      for (let i = 0; i < finalCount; i++) {

        const mv = Math.hypot(mvx, mvy);
        const nx = mv > 1e-5 ? mvx / mv : 0;
        const ny = mv > 1e-5 ? mvy / mv : 0;

        // velocidad base por inercia (ajusta este multiplicador)
        const inertia = clamp(mv * 0.012, 0, 6.5); // prueba 0.008–0.02 y max 4–10

        // dispersión lateral (spray)
        const a = Math.random() * Math.PI * 2;
        const jitter = (0.10 + Math.random() * 0.25) * (0.5 + strength);

        // emisor circular (ya lo tienes)
        const angle = Math.random() * Math.PI * 2;
        const rr = Math.pow(Math.random(), 0.6) * radius;
        const ox = Math.cos(angle) * rr;
        const oy = Math.sin(angle) * rr;

        parts.push({
          x: x + ox,
          y: y + oy,

          // ✅ inercia hacia la dirección del movimiento
          vx: nx * inertia + Math.cos(a) * jitter,
          vy: ny * inertia + Math.sin(a) * jitter,

          life: 1,
          size: sizeMin + Math.random() * (sizeMax - sizeMin),
          a: DUST.alphaMin + Math.random() * (DUST.alphaMax - DUST.alphaMin),
          seed: Math.random() * 1000,
          decay: DUST.life * (0.85 + Math.random() * 0.30),
        });


      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      target.active = true;
    };
    const onLeave = () => {
      target.active = false;
    };

    const parent = canvas.parentElement;
    parent?.addEventListener("pointermove", onMove);
    parent?.addEventListener("pointerleave", onLeave);

    let last = performance.now();
    let raf = 0;

    const tick = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;

      // ✅ SIN BLOOM: dibujamos normal
      ctx.globalCompositeOperation = "source-over";

      // Trail controlado: si no quieres trail, pon trail=0
      if (trail > 0) {
        const a = clamp(trail, 0, 0.35);
        ctx.fillStyle = `rgba(${bg.r},${bg.g},${bg.b},${a})`;
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      if (!reduced) {
        // follower con delay “spring”
        const tx = target.active ? target.x : w * 0.5;
        const ty = target.active ? target.y : h * 0.55;

        const ax = (tx - follow.x) * 0.020;
        const ay = (ty - follow.y) * 0.020;

        follow.vx = follow.vx * 0.82 + ax;
        follow.vy = follow.vy * 0.82 + ay;

        follow.x += follow.vx * (dt * 60);
        follow.y += follow.vy * (dt * 60);

        // velocidad real del emisor (px/s)
        const invDt = dt > 1e-6 ? 1 / dt : 0;
        const rawVx = (follow.x - lastFollow.x) * invDt;
        const rawVy = (follow.y - lastFollow.y) * invDt;

        // suavizado para que no sea nervioso
        emitterVel.x = emitterVel.x * 0.75 + rawVx * 0.25;
        emitterVel.y = emitterVel.y * 0.75 + rawVy * 0.25;

        lastFollow.x = follow.x;
        lastFollow.y = follow.y;

        // intensidad según velocidad real
        const v = Math.hypot(emitterVel.x, emitterVel.y); // px/s

        // 0..1 según velocidad, con curva suave
        const k = smoothstep(remap01(v, speedMin, speedMax));

        const speed = Math.sqrt(follow.vx * follow.vx + follow.vy * follow.vy);
        const spawnCount = Math.round(clamp(
          spawnMin + k * (spawnMax - spawnMin),
          0,
          9999
        ));

        const emitterRadius = radiusMin + k * (radiusMax - radiusMin);



        // spawn solo si está activo (y poquito aunque se mueva poco)
        if (target.active) {
          spawn(
            follow.x,
            follow.y,
            k,                 // strength (0..1)
            emitterVel.x,
            emitterVel.y,
            emitterRadius,
            spawnCount         // 👈 fuerza count exacto
          );
        }

      }

      // Update + draw
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];

        // vida
        p.life -= dt * p.decay;

        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }

        // turbulencia suave (simula humo/polvo sin manchas)
        const n = noise2(p.x * 0.008 + t * 0.00025, p.y * 0.008 + p.seed);
        const ang = (n - 0.5) * 0.9;

        p.vx += Math.cos(ang) * DUST.turbulence;
        p.vy += Math.sin(ang) * DUST.turbulence;
        p.vy -= DUST.driftUp;

        // fricción
        p.vx *= DUST.friction;
        p.vy *= DUST.friction;

        // mover
        p.x += p.vx * (dt * 60);
        p.y += p.vy * (dt * 60);

        // alpha (sin bloom)
        const a = p.a * (p.life * p.life);

        ctx.globalAlpha = a;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(tick);
    };

    // init
    ctx.clearRect(0, 0, w, h);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      parent?.removeEventListener("pointermove", onMove);
      parent?.removeEventListener("pointerleave", onLeave);
    };
  }, [color, maxParticles, sizeMin, sizeMax, trail]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
