'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export function DrivingCar() {
  const carRef = useRef<THREE.Group>(null);
  const wheelRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];

  // Car path - figure-8 track with workflow nodes
  const path = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4, 0, 2),
      new THREE.Vector3(-2, 0, 4),
      new THREE.Vector3(0, 0, 3),
      new THREE.Vector3(2, 0, 1),
      new THREE.Vector3(4, 0, -1),
      new THREE.Vector3(2, 0, -3),
      new THREE.Vector3(0, 0, -2),
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(-4, 0, 2),
    ]);
    curve.closed = true;
    return curve;
  }, []);

  useFrame((state) => {
    if (!carRef.current) return;

    // Animate car along the path
    const time = state.clock.elapsedTime * 0.1;
    const point = path.getPoint(time % 1);
    const tangent = path.getTangent(time % 1);
    
    // Position car
    carRef.current.position.copy(point);
    carRef.current.position.y = 0.3; // Slightly above ground
    
    // Orient car to follow path
    carRef.current.lookAt(
      point.x + tangent.x,
      point.y + tangent.y,
      point.z + tangent.z
    );
    
    // Add slight bobbing motion
    carRef.current.position.y += Math.sin(state.clock.elapsedTime * 4) * 0.05;
    
    // Rotate wheels
    wheelRefs.forEach((wheelRef) => {
      if (wheelRef.current) {
        wheelRef.current.rotation.x = -state.clock.elapsedTime * 3;
      }
    });
    
    // Slight car tilt when turning
    const nextPoint = path.getPoint((time + 0.01) % 1);
    const turnDirection = point.x - nextPoint.x;
    carRef.current.rotation.z = turnDirection * 0.3;
  });

  return (
    <group ref={carRef}>
      {/* Car body */}
      <Box args={[1.2, 0.4, 0.6]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#00E0FF" 
          emissive="#00E0FF" 
          emissiveIntensity={0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
      
      {/* Car roof */}
      <Box args={[0.8, 0.3, 0.5]} position={[0, 0.3, 0]}>
        <meshStandardMaterial 
          color="#0099CC" 
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      
      {/* Wheels */}
      <Cylinder 
        ref={wheelRefs[0]}
        args={[0.15, 0.15, 0.1]} 
        position={[-0.4, -0.2, 0.35]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#333333" />
      </Cylinder>
      
      <Cylinder 
        ref={wheelRefs[1]}
        args={[0.15, 0.15, 0.1]} 
        position={[0.4, -0.2, 0.35]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#333333" />
      </Cylinder>
      
      <Cylinder 
        ref={wheelRefs[2]}
        args={[0.15, 0.15, 0.1]} 
        position={[-0.4, -0.2, -0.35]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#333333" />
      </Cylinder>
      
      <Cylinder 
        ref={wheelRefs[3]}
        args={[0.15, 0.15, 0.1]} 
        position={[0.4, -0.2, -0.35]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#333333" />
      </Cylinder>
      
      {/* Headlights */}
      <Sphere args={[0.08]} position={[0.6, 0, 0.2]}>
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFFFFF"
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      <Sphere args={[0.08]} position={[0.6, 0, -0.2]}>
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFFFFF"
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      {/* Exhaust trail effect */}
      <group position={[-0.7, -0.1, 0]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Sphere 
            key={i}
            args={[0.05 - i * 0.008]} 
            position={[-i * 0.2, Math.random() * 0.1, Math.random() * 0.1 - 0.05]}
          >
            <meshStandardMaterial 
              color="#666666" 
              transparent
              opacity={0.3 - i * 0.05}
            />
          </Sphere>
        ))}
      </group>
    </group>
  );
}