'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
}

export default function ParticleField({
  count = 100,
  color = '#f5a623',
  size = 0.02,
  spread = 10,
}: ParticleFieldProps) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    // Seeded pseudo-random for deterministic results
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (seededRandom(i * 3) - 0.5) * spread;
      positions[i * 3 + 1] = (seededRandom(i * 3 + 1) - 0.5) * spread;
      positions[i * 3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * spread;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count, spread]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.05;

      const positions = points.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < count; i++) {
        // Move particles upward slowly
        positions[i * 3 + 1] += delta * 0.1;

        // Reset particles that go too high
        if (positions[i * 3 + 1] > spread / 2) {
          positions[i * 3 + 1] = -spread / 2;
        }
      }

      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
