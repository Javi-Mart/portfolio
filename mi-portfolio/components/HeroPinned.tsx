"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Scene3DHero from "./Scene3DHero";
import styles from "./HeroPinned.module.css";
import MouseParticles from "./MouseParticles";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const NAME_SVG_URL = `${BASE_PATH}/jv_name.svg`;
const BRAND_PNG_URL = `${BASE_PATH}/short_icon.png`;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function HeroPinned() {
  const wrapperRef = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduceMotion(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const el = wrapperRef.current;
      if (!el) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      const totalScroll = Math.max(1, r.height - vh);
      const scrolled = clamp01((-r.top) / totalScroll);

      setP(reduceMotion ? 1 : scrolled);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  // Timeline
  const nameT = useMemo(() => clamp01((p - 0.20) / (0.48 - 0.20)), [p]);
  const roleT = useMemo(() => clamp01((p - 0.40) / (0.70 - 0.40)), [p]);

  const nameE = easeOutCubic(nameT);
  const roleE = easeOutCubic(roleT);

  // ✅ Movimiento hacia arriba mientras aparece
  const nameOpacity = nameE;
  const nameBlur = lerp(22, 0, nameE);
  const nameY = lerp(64, 0, nameE); // empieza más abajo, termina en 0 (sube)

  const roleOpacity = roleE;
  const roleBlur = lerp(14, 0, roleE);
  const roleY = lerp(46, 0, roleE); // también sube

  const onPointerMove: React.PointerEventHandler<HTMLElement> = (e) => {
    const el = wrapperRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
    const y = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
  };

  return (
    <section
      ref={wrapperRef}
      className={styles.wrapper}
      onPointerMove={onPointerMove}
    >
      <div className={styles.sticky}>
        <MouseParticles className={styles.particles} color={"#FF4346"} />

        <header className={styles.header}>
          <div className={styles.brand}>
            <img
                className={styles.brandImg}
                src={BRAND_PNG_URL}
                alt="JM"
                draggable={false}
            />
          </div>

          <nav className={styles.nav}>
            <a className={styles.navLink} href="#sobre-mi">
              Sobre mí
            </a>
            <a className={styles.navLink} href="#proyectos">
              Proyectos
            </a>
          </nav>

          <a className={styles.cta} href="#contacto">
            Contacto
          </a>
        </header>

        <div className={styles.canvas}>
          <Scene3DHero progress={p} />
        </div>

        <div className={styles.center}>
            <div className={styles.stack}>
                <div
                className={styles.nameWrap}
                style={{
                    opacity: nameOpacity,
                    filter: `blur(${nameBlur}px)`,
                    transform: `translateY(${nameY}px) translateY(var(--name-nudge-y))`,
                }}
                >
                <img
                    className={styles.nameSvg}
                    src={NAME_SVG_URL}
                    alt="Javier Martínez"
                    draggable={false}
                />
                </div>

                <div
                className={styles.role}
                style={{
                    opacity: roleOpacity,
                    filter: `blur(${roleBlur}px)`,
                    transform: `translateY(${roleY}px)`,
                }}
                >
                Graphic Designer · <span className={styles.roleAccent}>Technical Artist</span>
                </div>
            </div>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <span className={styles.scrollLine} />
          <span className={styles.scrollText}>Scroll</span>
        </div>
      </div>
    </section>
  );
}
