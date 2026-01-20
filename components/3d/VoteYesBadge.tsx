'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface VoteYesBadgeProps {
  position?: [number, number, number];
  scale?: number;
}

export default function VoteYesBadge({
  position = [0, 0, 0],
  scale = 1,
}: VoteYesBadgeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const floatRef = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      floatRef.current += delta;

      // Floating animation
      groupRef.current.position.y =
        position[1] + Math.sin(floatRef.current * 1.5) * 0.08;

      // Rotation on hover
      const targetRotation = hovered ? Math.PI * 2 : 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        delta * 2
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Badge base - circular */}
      <mesh>
        <cylinderGeometry args={[1.2, 1.2, 0.2, 64]} />
        <meshStandardMaterial
          color={hovered ? '#4a90d9' : '#e53935'}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Inner ring */}
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1.1, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>

      {/* VOTE text */}
      <Text
        position={[0, 0.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        VOTE
      </Text>

      {/* YES text */}
      <Text
        position={[0, 0.12, 0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        YES
      </Text>

      {/* Checkmark */}
      <mesh position={[0, 0.12, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
