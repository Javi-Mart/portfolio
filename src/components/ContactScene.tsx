import { Component, Suspense, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, ContactShadows, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { contactModelAsset } from '../content/assets';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type PointerSignal = MutableRefObject<{
  x: number;
  y: number;
}>;

type SceneBoundaryProps = {
  children: ReactNode;
};

type SceneBoundaryState = {
  hasError: boolean;
};

class ContactSceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ContactSceneFallback />;
    }

    return this.props.children;
  }
}

function ContactSceneFallback() {
  return (
    <div className="contact-3d-fallback" aria-hidden="true">
      <span>3D</span>
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

function ContactModel({ pointerSignal, reduceMotion }: { pointerSignal: PointerSignal; reduceMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(contactModelAsset);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const viewport = useThree((state) => state.viewport);
  const isCompact = viewport.width < 4.8;

  useEffect(() => {
    const warmLift = new THREE.Color('#ffd0bd');
    const accentShadow = new THREE.Color('#240804');

    const enhanceMaterial = (material: THREE.Material) => {
      const cloned = material.clone();

      if (cloned instanceof THREE.MeshStandardMaterial || cloned instanceof THREE.MeshPhysicalMaterial) {
        cloned.metalness = Math.max(cloned.metalness, 0.34);
        cloned.roughness = Math.min(Math.max(cloned.roughness, 0.22), 0.58);
        cloned.color.lerp(warmLift, 0.16);
        cloned.emissive = accentShadow;
        cloned.emissiveIntensity = 0.1;
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
      const validationWindow = window as Window & { __portfolioContactModelLoaded?: boolean };

      validationWindow.__portfolioContactModelLoaded = true;
      document.documentElement.dataset.contactModelLoaded = 'true';
      window.dispatchEvent(new Event('portfolioContactModelLoaded'));
    }
  }, [scene]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;

    const elapsed = clock.getElapsedTime();
    const mouseX = reduceMotion ? 0 : pointerSignal.current.x;
    const mouseY = reduceMotion ? 0 : pointerSignal.current.y;
    const targetY = mouseX * 0.42 + (reduceMotion ? 0 : elapsed * 0.18);
    const targetX = mouseY * 0.18 + (reduceMotion ? 0 : Math.sin(elapsed * 0.42) * 0.05);

    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, 0.055);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.055);
    group.position.x = THREE.MathUtils.lerp(group.position.x, mouseX * 0.09, 0.045);
    group.position.y = THREE.MathUtils.lerp(group.position.y, mouseY * 0.06, 0.045);
  });

  return (
    <Float speed={reduceMotion ? 0 : 1.08} rotationIntensity={reduceMotion ? 0 : 0.12} floatIntensity={reduceMotion ? 0 : 0.22}>
      <group ref={groupRef} position={[0, -0.02, 0]} scale={isCompact ? 1.35 : 1.58}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
    </Float>
  );
}

export function ContactScene() {
  const reduceMotion = usePrefersReducedMotion();
  const pointerSignal = useGlobalPointer(reduceMotion);
  const preserveDrawingBuffer =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('visualValidation');

  return (
    <div className="contact-3d" aria-hidden="true">
      <ContactSceneBoundary>
        <Canvas
          shadows
          dpr={[1, 1.35]}
          camera={{ position: [0, 0, 4.8], fov: 36 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer }}
        >
          <ambientLight intensity={0.86} />
          <directionalLight position={[2.8, 4.8, 4.2]} intensity={3.1} castShadow />
          <spotLight position={[-2.6, 2.4, 3.2]} angle={0.42} penumbra={0.7} intensity={4.2} color="#ff7b4f" />
          <pointLight position={[2.5, -1.8, 2.6]} intensity={2.6} color="#36d7ff" />
          <Suspense fallback={null}>
            <ContactModel pointerSignal={pointerSignal} reduceMotion={reduceMotion} />
            <ContactShadows
              position={[0, -1.26, 0]}
              opacity={0.36}
              scale={4.2}
              blur={2.5}
              far={2.7}
              resolution={512}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      </ContactSceneBoundary>
    </div>
  );
}

useGLTF.preload(contactModelAsset);
