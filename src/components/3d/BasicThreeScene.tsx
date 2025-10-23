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
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [5, 3, 5], fov: 60 }}>
        <Scene />
      </Canvas>
      
      {/* UI Overlay */}
      <motion.div
        className="absolute top-8 left-8 z-20"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="glass-card p-4 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-neon-cyan mb-2">PromptPilot</h2>
          <p className="text-gray-300 text-sm">AI-Powered Workflow Orchestration</p>
        </div>
      </motion.div>

      {/* Stats overlay */}
      <motion.div
        className="absolute top-8 right-8 z-20"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <div className="glass-card p-4 backdrop-blur-md">
          <div className="text-right">
            <div className="text-neon-purple text-2xl font-bold">127</div>
            <div className="text-gray-400 text-xs">Active Workflows</div>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="glass-card px-8 py-4 backdrop-blur-md">
          <div className="flex items-center space-x-6">
            <motion.button
              className="px-6 py-2 bg-neon-cyan text-black font-semibold rounded-lg hover:bg-opacity-80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Workflow
            </motion.button>
            <motion.div
              className="text-gray-300 text-sm"
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