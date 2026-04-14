import { Component, Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, ContactShadows, Float, Sparkles, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { modelAsset } from '../content/assets';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type SceneBoundaryProps = {
  children: React.ReactNode;
};

type SceneBoundaryState = {
  hasError: boolean;
};

type PointerSignal = MutableRefObject<{
  x: number;
  y: number;
}>;

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

function useGlobalPointer(reduceMotion: boolean) {
  const pointerSignal = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;

      pointerSignal.current.x = (event.clientX / width) * 2 - 1;
      pointerSignal.current.y = -(event.clientY / height) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [reduceMotion]);

  return pointerSignal;
}

function PortfolioModel({ pointerSignal, reduceMotion }: { pointerSignal: PointerSignal; reduceMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(modelAsset);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const viewport = useThree((state) => state.viewport);
  const isCompact = viewport.width < 7;

  useEffect(() => {
    const warmLift = new THREE.Color('#f0d9c7');

    const enhanceMaterial = (material: THREE.Material) => {
      const cloned = material.clone();

      if (cloned instanceof THREE.MeshStandardMaterial || cloned instanceof THREE.MeshPhysicalMaterial) {
        cloned.metalness = Math.max(cloned.metalness, 0.28);
        cloned.roughness = Math.min(Math.max(cloned.roughness, 0.24), 0.62);

        if (cloned.color.getHSL({ h: 0, s: 0, l: 0 }).l < 0.34) {
          cloned.color.lerp(warmLift, 0.42);
        }

        cloned.emissive = new THREE.Color('#160704');
        cloned.emissiveIntensity = 0.08;
      }

      return cloned;
    };

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = Array.isArray(mesh.material) ? mesh.material.map(enhanceMaterial) : enhanceMaterial(mesh.material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    if (typeof window !== 'undefined') {
      const validationWindow = window as Window & { __portfolioHeroModelLoaded?: boolean };

      validationWindow.__portfolioHeroModelLoaded = true;
      document.documentElement.dataset.heroModelLoaded = 'true';
      window.dispatchEvent(new Event('portfolioHeroModelLoaded'));
    }
  }, [scene]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;

    const elapsed = clock.getElapsedTime();
    const baseX = isCompact ? 0.12 : 2.12;
    const baseY = isCompact ? -0.3 : -0.08;
    const mouseX = reduceMotion ? 0 : pointerSignal.current.x;
    const mouseY = reduceMotion ? 0 : pointerSignal.current.y;

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
        position={[isCompact ? 0.12 : 2.12, isCompact ? -0.3 : -0.08, 0]}
        scale={isCompact ? 1.9 : 2.02}
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
  const pointerSignal = useGlobalPointer(reduceMotion);
  const preserveDrawingBuffer =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('visualValidation');

  return (
    <div className="hero-canvas" aria-hidden="true">
      <SceneBoundary>
        <Canvas
          shadows
          dpr={[1, 1.55]}
          camera={{ position: [0, 0, 6], fov: 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer }}
        >
          <ambientLight intensity={0.72} />
          <directionalLight position={[3.6, 4.8, 4.4]} intensity={4} castShadow />
          <spotLight position={[0.2, 4.4, 3.4]} angle={0.34} penumbra={0.72} intensity={4.6} color="#fff0de" />
          <pointLight position={[-3.2, -1.4, 3.4]} intensity={3.4} color="#32d6ff" />
          <pointLight position={[3.8, -1.6, 2.5]} intensity={4} color="#ff7448" />
          <Suspense fallback={null}>
            <PortfolioModel pointerSignal={pointerSignal} reduceMotion={reduceMotion} />
            <Sparkles
              count={reduceMotion ? 0 : 46}
              scale={[5.8, 3.2, 2.2]}
              size={1.4}
              speed={0.18}
              opacity={0.22}
              color="#ff8758"
              position={[0.8, 0.1, -0.5]}
            />
            <ContactShadows
              position={[0.5, -1.68, 0]}
              opacity={0.34}
              scale={8}
              blur={3}
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
