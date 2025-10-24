'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function RotatingCube({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Rotating cubes */}
      <RotatingCube position={[-2, 0, 0]} color="#00E0FF" />
      <RotatingCube position={[2, 0, 0]} color="#9B51E0" />
      <RotatingCube position={[0, 2, 0]} color="#FFB800" />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

export function BasicThreeScene() {
  return (
    <div 
      className="relative overflow-hidden"
      style={{ 
        height: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #1e293b 100%)'
      }}
    >
      {/* 3D Canvas */}
      <Canvas camera={{ position: [5, 3, 5], fov: 60 }}>
        <Scene />
      </Canvas>
      
      {/* UI Overlay */}
      <motion.div
        className="absolute z-20"
        style={{ top: '2rem', left: '2rem' }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div 
          className="p-4 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: '#00E0FF' }}
          >
            PromptPilot
          </h2>
          <p 
            className="text-sm"
            style={{ color: '#d1d5db' }}
          >
            AI-Powered Workflow Orchestration
          </p>
        </div>
      </motion.div>

      {/* Stats overlay */}
      <motion.div
        className="absolute z-20"
        style={{ top: '2rem', right: '2rem' }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <div 
          className="p-4 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div 
              className="text-2xl font-bold"
              style={{ color: '#9B51E0', fontSize: '24px', fontWeight: 'bold' }}
            >
              127
            </div>
            <div 
              className="text-xs"
              style={{ color: '#9ca3af', fontSize: '12px' }}
            >
              Active Workflows
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="absolute z-20"
        style={{ 
          bottom: '2rem', 
          left: '50%', 
          transform: 'translateX(-50%)' 
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div 
          className="rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            padding: '16px 32px'
          }}
        >
          <div 
            className="flex items-center"
            style={{ gap: '24px', alignItems: 'center' }}
          >
            <motion.button
              className="rounded-lg font-semibold transition-colors"
              style={{
                padding: '8px 24px',
                backgroundColor: '#00E0FF',
                color: 'black',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Workflow
            </motion.button>
            <motion.div
              className="text-sm"
              style={{ color: '#d1d5db', fontSize: '14px' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Explore the 3D interface →
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}