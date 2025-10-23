'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Text, Sphere } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DrivingCar } from './DrivingCar';
import { WorkflowTrack } from './WorkflowTrack';
import { ParticleField } from './ParticleField';
import * as THREE from 'three';

// Loading fallback for 3D scene
function SceneLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-pulse text-neon-cyan">
        <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

// 3D Scene Contents
function SceneContents() {
  return (
    <>
      {/* Environment lighting */}
      <Environment preset="night" />
      
      {/* Ambient lighting for mood */}
      <ambientLight intensity={0.2} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={1} 
        color="#00E0FF"
        castShadow
      />
      <pointLight 
        position={[-10, 5, 5]} 
        intensity={0.5} 
        color="#9B51E0"
      />
      
      {/* Camera controls */}
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
      
      {/* Background particle field */}
      <ParticleField />
      
      {/* Main workflow track that car drives along */}
      <WorkflowTrack />
      
      {/* The driving car - main character */}
      <DrivingCar />
      
      {/* Floating text elements */}
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        <Text
          position={[-3, 3, 0]}
          fontSize={0.8}
          color="#00E0FF"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          AI WORKFLOWS
        </Text>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
        <Text
          position={[3, 2, -1]}
          fontSize={0.6}
          color="#9B51E0"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          NO CODE
        </Text>
      </Float>
      
      {/* Workflow nodes scattered around */}
      <Float speed={2} rotationIntensity={0.1}>
        <Sphere args={[0.3]} position={[-2, 1, -2]}>
          <meshStandardMaterial 
            color="#00E0FF" 
            emissive="#00E0FF" 
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.15}>
        <Sphere args={[0.25]} position={[4, 0.5, -3]}>
          <meshStandardMaterial 
            color="#9B51E0" 
            emissive="#9B51E0" 
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </Float>
      
      <Float speed={2.2} rotationIntensity={0.05}>
        <Sphere args={[0.2]} position={[1, 2.5, -4]}>
          <meshStandardMaterial 
            color="#10B981" 
            emissive="#10B981" 
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </Float>
    </>
  );
}

// Main HeroScene component
interface HeroSceneProps {
  className?: string;
}

export function HeroScene({ className = "" }: HeroSceneProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 3D Canvas */}
            <Canvas
        camera={{ 
          position: [8, 6, 8], 
          fov: 50
        }}
        style={{ 
          height: '100vh',
          background: 'transparent' 
        }}
      >
        <SceneContents />
      </Canvas>
      
      {/* Loading overlay */}
      <Suspense fallback={<SceneLoading />}>
        <div className="sr-only">3D Scene Loaded</div>
      </Suspense>
      
      {/* Overlay UI elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left floating info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute top-8 left-8 glass p-4 rounded-lg"
        >
          <div className="text-sm text-scene-text-secondary">WebGL Scene</div>
          <div className="text-neon-cyan font-mono text-xs">
            Interactive 3D Workflow
          </div>
        </motion.div>
        
        {/* Bottom-right controls hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 right-8 glass p-3 rounded-lg"
        >
          <div className="text-xs text-scene-text-muted">
            Click & drag to explore
          </div>
        </motion.div>
        
        {/* Floating particles overlay for extra magic */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neon-cyan rounded-full opacity-30"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight 
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}