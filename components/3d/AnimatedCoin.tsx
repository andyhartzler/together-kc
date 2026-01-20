'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedCoinProps {
  position?: [number, number, number];
  scale?: number;
}

export default function AnimatedCoin({
  position = [0, 0, 0],
  scale = 1,
}: AnimatedCoinProps) {
  const coinRef = useRef<THREE.Group>(null);
  const floatRef = useRef(0);

  useFrame((state, delta) => {
    if (coinRef.current) {
      // Continuous rotation
      coinRef.current.rotation.y += delta * 0.5;

      // Floating animation
      floatRef.current += delta;
      coinRef.current.position.y =
        position[1] + Math.sin(floatRef.current * 1.5) * 0.15;
    }
  });

  return (
    <group ref={coinRef} position={position} scale={scale}>
      {/* Coin body */}
      <mesh>
        <cylinderGeometry args={[1, 1, 0.15, 64]} />
        <meshStandardMaterial
          color="#f5a623"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Front face ring */}
      <mesh position={[0, 0.076, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.95, 64]} />
        <meshStandardMaterial
          color="#d4920e"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* 1% text on front */}
      <Text
        position={[0, 0.08, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="#1e3a5f"
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        1%
      </Text>

      {/* Back face ring */}
      <mesh position={[0, -0.076, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.95, 64]} />
        <meshStandardMaterial
          color="#d4920e"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* KC text on back */}
      <Text
        position={[0, -0.08, 0]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        fontSize={0.35}
        color="#1e3a5f"
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        KC
      </Text>
    </group>
  );
}
