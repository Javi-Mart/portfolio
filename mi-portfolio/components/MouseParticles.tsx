"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  color?: string;          // ej "#FF4346"
  maxParticles?: number;   // default 140
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;     // 0..1
  size: number;
  alpha: number;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export default function MouseParticles({
  className,
  color = "#FF4346",
  maxParticles = 140,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Respeta reduced motion
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

    // Mouse target y “cursor con delay”
    const target = { x: w * 0.5, y: h * 0.5, active: false };
    const follower = { x: w * 0.5, y: h * 0.5 };

    // Partículas
    const particles: Particle[] = [];
    let lastTime = performance.now();

    const addParticle = (x: number, y: number, intensity = 1) => {
      if (particles.length >= maxParticles) particles.shift();

      const a = Math.random() * Math.PI * 2;
      const sp = (0.6 + Math.random() * 1.2) * intensity;

      particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 1,
        size: 1.2 + Math.random() * 2.2,
        alpha: 0.55 + Math.random() * 0.25,
      });
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

    // Escucha eventos en el padre para que solo funcione dentro del Hero
    const parent = canvas.parentElement;
    parent?.addEventListener("pointermove", onMove);
    parent?.addEventListener("pointerleave", onLeave);

    let raf = 0;

    const tick = (t: number) => {
      const dt = Math.min(0.033, (t - lastTime) / 1000);
      lastTime = t;

      // Fondo: limpiar con un fade sutil para "trail"
      ctx.clearRect(0, 0, w, h);
      // Si quieres un trail más marcado, cambia a:
      // ctx.fillStyle = "rgba(0,0,0,0.08)";
      // ctx.fillRect(0,0,w,h);

      if (!reduced) {
        // follower con delay (smoothing)
        const followStrength = target.active ? 0.10 : 0.05;
        follower.x += (target.x - follower.x) * followStrength;
        follower.y += (target.y - follower.y) * followStrength;

        // Spawn rate depende de movimiento
        const dx = target.x - follower.x;
        const dy = target.y - follower.y;
        const speed = Math.sqrt(dx * dx + dy * dy);

        // Si está activo, genera pequeñas ráfagas
        if (target.active) {
          const rate = clamp01(speed / 80);
          const count = 1 + Math.floor(rate * 5);
          for (let i = 0; i < count; i++) addParticle(follower.x, follower.y, 1);
        }

        // También un spawn suave aunque esté quieto
        if (target.active && Math.random() < 0.25) addParticle(follower.x, follower.y, 0.6);
      }

      // Update y draw partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Física suave
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vy += 0.02; // ligera gravedad

        p.x += p.vx * (dt * 60);
        p.y += p.vy * (dt * 60);

        // Vida
        p.life -= dt * 0.9;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const a = p.alpha * (p.life * p.life);

        // glow
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = color;
        ctx.globalAlpha = a;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.8 + (1 - p.life) * 0.6), 0, Math.PI * 2);
        ctx.fill();

        // halo suave
        ctx.globalAlpha = a * 0.35;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      parent?.removeEventListener("pointermove", onMove);
      parent?.removeEventListener("pointerleave", onLeave);
    };
  }, [color, maxParticles]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
