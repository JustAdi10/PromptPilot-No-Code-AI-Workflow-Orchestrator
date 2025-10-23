'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

function SimpleScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Simple floating cubes */}
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#00E0FF" />
      </mesh>
      
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#9B51E0" />
      </mesh>
      
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#FFB800" />
      </mesh>
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>
      
      <OrbitControls enableZoom={false} />
    </>
  );
}

export function Simple3DScene() {
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [5, 3, 5], fov: 60 }}
        style={{ 
          height: '100vh',
          background: 'transparent' 
        }}
      >
        <SimpleScene />
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

      {/* Bottom CTA */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="glass-card px-8 py-4 backdrop-blur-md">
          <motion.button
            className="px-6 py-2 bg-neon-cyan text-black font-semibold rounded-lg hover:bg-opacity-80 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Workflow
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}