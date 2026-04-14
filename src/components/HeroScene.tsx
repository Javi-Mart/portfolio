import { Component, Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, ContactShadows, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { modelAsset } from '../content/assets';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type SceneBoundaryProps = {
  children: React.ReactNode;
};

type SceneBoundaryState = {
  hasError: boolean;
};

class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <HeroSceneFallback />;
    }

    return this.props.children;
  }
}

function HeroSceneFallback() {
  return (
    <div className="hero-fallback" aria-hidden="true">
      <div className="fallback-core">
        <span>3D</span>
      </div>
    </div>
  );
}

function PortfolioModel({ reduceMotion }: { reduceMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(modelAsset);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const viewport = useThree((state) => state.viewport);
  const isCompact = viewport.width < 7;

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame(({ pointer, clock }) => {
    const group = groupRef.current;
    if (!group) return;

    const elapsed = clock.getElapsedTime();
    const baseX = isCompact ? 0.08 : 1.12;
    const baseY = isCompact ? -0.62 : -0.08;
    const mouseX = reduceMotion ? 0 : pointer.x;
    const mouseY = reduceMotion ? 0 : pointer.y;

    group.position.x = THREE.MathUtils.lerp(group.position.x, baseX + mouseX * 0.16, 0.06);
    group.position.y = THREE.MathUtils.lerp(group.position.y, baseY + mouseY * 0.08, 0.06);
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      mouseX * 0.34 + (reduceMotion ? 0 : Math.sin(elapsed * 0.28) * 0.08),
      0.08,
    );
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, mouseY * 0.14, 0.08);
  });

  return (
    <Float speed={reduceMotion ? 0 : 1.2} rotationIntensity={reduceMotion ? 0 : 0.14} floatIntensity={reduceMotion ? 0 : 0.26}>
      <group
        ref={groupRef}
        position={[isCompact ? 0.08 : 1.12, isCompact ? -0.62 : -0.08, 0]}
        scale={isCompact ? 1.55 : 2.08}
      >
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
    </Float>
  );
}

export function HeroScene() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div className="hero-canvas" aria-hidden="true">
      <SceneBoundary>
        <Canvas
          shadows
          dpr={[1, 1.55]}
          camera={{ position: [0, 0, 6], fov: 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.74} />
          <directionalLight position={[3.6, 4.8, 4.4]} intensity={2.7} castShadow />
          <pointLight position={[-3.2, -1.4, 3.4]} intensity={3.4} color="#43ffb4" />
          <pointLight position={[2.8, -2.2, 2.2]} intensity={1.1} color="#ffffff" />
          <Suspense fallback={null}>
            <PortfolioModel reduceMotion={reduceMotion} />
            <ContactShadows
              position={[0, -1.58, 0]}
              opacity={0.28}
              scale={7}
              blur={2.6}
              far={3.8}
              resolution={768}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      </SceneBoundary>
      <div className="hero-shade" />
    </div>
  );
}

useGLTF.preload(modelAsset);
