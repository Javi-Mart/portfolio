"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const MODEL_URL = `${BASE_PATH}/models/jm_icon.glb`;

function scaleToFit(scene: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  box.getSize(size);

  const maxAxis = Math.max(size.x, size.y, size.z);
  const scale = maxAxis > 0 ? 1.35 / maxAxis : 1;

  scene.scale.setScalar(scale);
  scene.updateMatrixWorld(true);
}

function damp(current: number, target: number, smoothing: number, delta: number) {
  const k = 1 - Math.pow(smoothing, delta);
  return THREE.MathUtils.lerp(current, target, k);
}

function Model({ progress }: { progress: number }) {
  const rig = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  const SCALE = {
    start: 7,
    end: 1.0,
  };

  useMemo(() => {
    scaleToFit(scene);
  }, [scene]);

  // “timeline” del hero
  const turns = 1.25;
  const maxY = turns * Math.PI * 2;

  useFrame((state, delta) => {
    if (!rig.current) return;

    // Rotación principal por scroll
    const targetY = progress * maxY;
    rig.current.rotation.y = damp(rig.current.rotation.y, targetY, 0.001, delta);

    // Tilt por scroll
    const targetX = THREE.MathUtils.lerp(0.10, 0.34, progress);
    rig.current.rotation.x = damp(rig.current.rotation.x, targetX, 0.001, delta);

    // ✅ Escala cinematográfica (SIN tocar scene.scale)
    const targetScale = THREE.MathUtils.lerp(SCALE.start, SCALE.end, progress);
    rig.current.scale.x = damp(rig.current.scale.x, targetScale, 0.001, delta);
    rig.current.scale.y = damp(rig.current.scale.y, targetScale, 0.001, delta);
    rig.current.scale.z = damp(rig.current.scale.z, targetScale, 0.001, delta);

    // Parallax por mouse
    const mx = (state.pointer.x ?? 0) * 0.12;
    const my = (state.pointer.y ?? 0) * 0.10;
    rig.current.rotation.y += mx * 0.05;
    rig.current.rotation.x += -my * 0.05;

    // Micro breathing
    const t = state.clock.elapsedTime;
    rig.current.rotation.z = Math.sin(t * 0.6) * 0.015;
  });


  return (
    <group ref={rig}>
      {/* Ajuste fino de composición */}
      <group ref={root} position={[0, 0, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

function CameraRig({ progress }: { progress: number }) {
  const zNear = 2.0;   // más cerca
  const zFar = 3.15;   // más lejos
  const yNear = 0.10;
  const yFar = 0.32;

  useFrame((state, delta) => {
    const targetZ = THREE.MathUtils.lerp(zNear, zFar, progress);
    const targetY = THREE.MathUtils.lerp(yNear, yFar, progress);

    state.camera.position.x = damp(state.camera.position.x, 0, 0.001, delta);
    state.camera.position.z = damp(state.camera.position.z, targetZ, 0.001, delta);
    state.camera.position.y = damp(state.camera.position.y, targetY, 0.001, delta);

    state.camera.lookAt(0, 0, 0);
    state.camera.updateProjectionMatrix();
  });

  return null;
}

export default function Scene3DHero({ progress }: { progress: number }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 2.6], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.72} />
      <directionalLight position={[2.5, 3, 2]} intensity={1.25} />
      <directionalLight position={[-2.2, 1.2, -2]} intensity={0.55} />

      <Suspense fallback={null}>
        <CameraRig progress={progress} />
        <Model progress={progress} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
