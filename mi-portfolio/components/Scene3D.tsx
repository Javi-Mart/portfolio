"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const MODEL_URL = "/models/hero.glb";

/** Scroll global -> progress [0..1] */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = doc.scrollHeight || document.body.scrollHeight || 1;
      const clientHeight = doc.clientHeight || window.innerHeight || 1;

      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      setProgress(THREE.MathUtils.clamp(scrollTop / maxScroll, 0, 1));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

/** Centra + escala automática por bounding box */
function normalizeScene(scene: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  box.getSize(size);

  const center = new THREE.Vector3();
  box.getCenter(center);

  const maxAxis = Math.max(size.x, size.y, size.z);
  const scale = maxAxis > 0 ? 1.2 / maxAxis : 1;

  scene.position.sub(center);
  scene.scale.setScalar(scale);
  scene.updateMatrixWorld(true);

  return { size, center, scale };
}

/** Damping suave (frame-rate independent) */
function damp(current: number, target: number, smoothing: number, delta: number) {
  // smoothing típico: 0.001–0.01
  const k = 1 - Math.pow(smoothing, delta);
  return THREE.MathUtils.lerp(current, target, k);
}

function ModelRig({
  url,
  scrollProgress,
}: {
  url: string;
  scrollProgress: number;
}) {
  const rig = useRef<THREE.Group>(null);
  const modelGroup = useRef<THREE.Group>(null);

  const { scene } = useGLTF(url);

  useMemo(() => {
    normalizeScene(scene);
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });
  }, [scene]);

  // Ajustes PRO (tuneables)
  const turns = 1.6; // vueltas en Y a lo largo del scroll
  const maxRotationY = turns * Math.PI * 2;

  const minTiltX = 0.10; // tilt inicial
  const maxTiltX = 0.35; // tilt final

  useFrame((state, delta) => {
    if (!rig.current || !modelGroup.current) return;

    // Scroll -> targets
    const targetY = scrollProgress * maxRotationY;
    const targetX = THREE.MathUtils.lerp(minTiltX, maxTiltX, scrollProgress);

    // Suavizado
    rig.current.rotation.y = damp(rig.current.rotation.y, targetY, 0.001, delta);
    rig.current.rotation.x = damp(rig.current.rotation.x, targetX, 0.001, delta);

    // Micro-life muy leve
    const t = state.clock.elapsedTime;
    rig.current.rotation.z = Math.sin(t * 0.6) * 0.02;

    // Un poquito de “parallax” sutil al mover el mouse (opcional, muy low-key)
    // Si no lo quieres, bórralo:
    const mx = (state.pointer.x ?? 0) * 0.06;
    const my = (state.pointer.y ?? 0) * 0.06;
    modelGroup.current.position.x = damp(modelGroup.current.position.x, mx, 0.001, delta);
    modelGroup.current.position.y = damp(modelGroup.current.position.y, my, 0.001, delta);
  });

  return (
    <group ref={rig}>
      <group ref={modelGroup}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}

function SceneContents() {
  const scrollProgress = useScrollProgress();

  // Rig de cámara para zoom suave (sin cambiar fov)
  const cameraRig = useRef<THREE.Group>(null);

  // Zoom settings (ajústalos a gusto)
  const zNear = 2.0; // más cerca = más grande
  const zFar = 3.2;  // más lejos = más pequeño

  // Un poquito de “elevación” con scroll (opcional)
  const yNear = 0.15;
  const yFar = 0.35;

  useFrame((state, delta) => {
    if (!cameraRig.current) return;

    // Scroll -> zoom (invirtiendo si quieres)
    // 0 => cerca, 1 => lejos
    const targetZ = THREE.MathUtils.lerp(zFar, zNear, scrollProgress);
    const targetY = THREE.MathUtils.lerp(yNear, yFar, scrollProgress);

    // Suavizado
    cameraRig.current.position.z = damp(cameraRig.current.position.z, targetZ, 0.001, delta);
    cameraRig.current.position.y = damp(cameraRig.current.position.y, targetY, 0.001, delta);

    // “Look at” suavizado hacia el origen (modelo centrado)
    const lookTarget = new THREE.Vector3(0, 0, 0);
    state.camera.position.set(
      cameraRig.current.position.x,
      cameraRig.current.position.y,
      cameraRig.current.position.z
    );
    state.camera.lookAt(lookTarget);
    state.camera.updateProjectionMatrix();
  });

  return (
    <>
      {/* La cámara real la controla el Canvas, pero usamos un rig para interpolar */}
      <group ref={cameraRig} position={[0, 0.2, 2.4]} />

      <Suspense fallback={<LoadingFallback />}>
        <ModelRig url={MODEL_URL} scrollProgress={scrollProgress} />
        <Environment preset="city" />
      </Suspense>
    </>
  );
}

export default function Scene3D() {
  return (
    <div className="scene3d" style={{ minHeight: 320 }}>
      <Canvas camera={{ position: [0, 0.2, 2.4], fov: 45 }} dpr={[1, 2]}>
        {/* Luces */}
        <ambientLight intensity={0.65} />
        <directionalLight position={[2.5, 3, 2]} intensity={1.15} />
        <directionalLight position={[-2.5, 1.5, -2]} intensity={0.6} />

        <SceneContents />
      </Canvas>

      {/* Overlay opcional */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          padding: 16,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            maxWidth: 360,
            background: "rgba(2, 6, 23, 0.55)",
            border: "1px solid rgba(31, 41, 55, 0.75)",
            backdropFilter: "blur(10px)",
            borderRadius: 14,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(156,163,175,0.95)",
              marginBottom: 6,
            }}
          >
            3D · Scroll-driven
          </div>
          <div style={{ fontSize: 13, color: "rgba(229,231,235,0.95)" }}>
            Rotación + zoom suave con easing.
          </div>
        </div>
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
