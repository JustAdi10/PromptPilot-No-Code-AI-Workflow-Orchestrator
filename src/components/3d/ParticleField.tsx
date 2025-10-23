'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate particle positions
  const particles = useMemo(() => {
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position particles in a large sphere around the scene
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi);
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Random colors between cyan and purple
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Cyan particles
        colors[i3] = 0;     // R
        colors[i3 + 1] = 0.88; // G
        colors[i3 + 2] = 1;    // B
      } else if (colorChoice < 0.8) {
        // Purple particles
        colors[i3] = 0.61;     // R
        colors[i3 + 1] = 0.32; // G
        colors[i3 + 2] = 0.88; // B
      } else {
        // White particles
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      }
      
      // Random sizes
      sizes[i] = Math.random() * 3 + 1;
    }
    
    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Rotate entire particle field slowly
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.1;
  });

  return (
    <>
      {/* Main particle field */}
      <Points ref={pointsRef} positions={particles.positions} colors={particles.colors}>
        <pointsMaterial
          size={2}
          transparent
          opacity={0.6}
          vertexColors
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Additional sparkle layer */}
      <group>
        {Array.from({ length: 50 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 40,
            ]}
          >
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial
              color={Math.random() > 0.5 ? '#00E0FF' : '#9B51E0'}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
      
      {/* Energy streams */}
      <group>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i * 0.628) * 8,
              (Math.random() - 0.5) * 10,
              Math.cos(i * 0.628) * 8,
            ]}
          >
            <cylinderGeometry args={[0.01, 0.01, 5]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}