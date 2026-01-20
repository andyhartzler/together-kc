'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingIconProps {
  emoji: string;
  position?: [number, number, number];
  scale?: number;
  delay?: number;
  color?: string;
}

export default function FloatingIcon({
  emoji,
  position = [0, 0, 0],
  scale = 1,
  delay = 0,
  color = '#4a90d9',
}: FloatingIconProps) {
  const groupRef = useRef<THREE.Group>(null);
  const time = useRef(delay);

  useFrame((state, delta) => {
    if (groupRef.current) {
      time.current += delta;
      // Floating bob animation
      groupRef.current.position.y =
        position[1] + Math.sin(time.current * 1.2) * 0.1;
      // Subtle rotation
      groupRef.current.rotation.y = Math.sin(time.current * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Background rounded box */}
      <RoundedBox args={[1.2, 1.2, 0.2]} radius={0.15} smoothness={4}>
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.8}
          transparent
          opacity={0.9}
        />
      </RoundedBox>

      {/* Emoji as 3D text */}
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {emoji}
      </Text>
    </group>
  );
}
