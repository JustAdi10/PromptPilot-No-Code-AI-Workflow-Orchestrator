'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Text3D, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface WorkflowNode {
  id: string;
  position: [number, number, number];
  label: string;
  type: 'input' | 'process' | 'output' | 'decision';
  color: string;
}

const workflowNodes: WorkflowNode[] = [
  {
    id: 'input',
    position: [-3, 0.5, 3],
    label: 'Input',
    type: 'input',
    color: '#00E0FF'
  },
  {
    id: 'ai-process',
    position: [0, 0.8, 2],
    label: 'AI Process',
    type: 'process',
    color: '#9B51E0'
  },
  {
    id: 'decision',
    position: [3, 0.6, 0],
    label: 'Decision',
    type: 'decision',
    color: '#FFB800'
  },
  {
    id: 'output',
    position: [0, 0.4, -2],
    label: 'Output',
    type: 'output',
    color: '#00FF88'
  },
  {
    id: 'feedback',
    position: [-2, 0.3, -1],
    label: 'Feedback',
    type: 'process',
    color: '#FF6B6B'
  },
];

function WorkflowNode({ node, index }: { node: WorkflowNode; index: number }) {
  const nodeRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!nodeRef.current || !glowRef.current) return;

    // Floating animation with different phases
    const time = state.clock.elapsedTime + index * 0.5;
    nodeRef.current.position.y = node.position[1] + Math.sin(time * 0.8) * 0.2;
    
    // Rotation animation
    nodeRef.current.rotation.y = Math.sin(time * 0.3) * 0.3;
    
    // Pulsing glow effect
    const glowIntensity = 0.3 + Math.sin(time * 2) * 0.2;
    glowRef.current.scale.setScalar(1 + glowIntensity * 0.2);
    
    // Color shifting for AI nodes
    if (node.type === 'process') {
      const hue = (time * 0.1) % 1;
      const color = new THREE.Color().setHSL(hue * 0.3 + 0.6, 0.8, 0.6);
      (glowRef.current.material as THREE.MeshBasicMaterial).color.copy(color);
    }
  });

  const getNodeShape = () => {
    switch (node.type) {
      case 'input':
        return <Sphere args={[0.3]}><meshStandardMaterial color={node.color} /></Sphere>;
      case 'decision':
        return (
          <Box args={[0.4, 0.4, 0.4]} rotation={[0, Math.PI / 4, 0]}>
            <meshStandardMaterial color={node.color} />
          </Box>
        );
      case 'output':
        return (
          <RoundedBox args={[0.5, 0.3, 0.3]} radius={0.05}>
            <meshStandardMaterial color={node.color} />
          </RoundedBox>
        );
      default: // process
        return (
          <Box args={[0.6, 0.4, 0.3]}>
            <meshStandardMaterial color={node.color} metalness={0.8} roughness={0.2} />
          </Box>
        );
    }
  };

  return (
    <group ref={nodeRef} position={node.position}>
      {/* Glowing background */}
      <Sphere ref={glowRef} args={[0.5]}>
        <meshBasicMaterial 
          color={node.color} 
          transparent 
          opacity={0.2}
        />
      </Sphere>
      
      {/* Main node shape */}
      {getNodeShape()}
      
      {/* Connection lines/particles */}
      <group>
        {Array.from({ length: 8 }).map((_, i) => (
          <Sphere key={i} args={[0.02]} position={[
            Math.cos(i * Math.PI / 4) * 0.8,
            Math.sin(i * Math.PI / 4) * 0.1,
            Math.sin(i * Math.PI / 4) * 0.8
          ]}>
            <meshBasicMaterial 
              color={node.color} 
              transparent 
              opacity={0.6}
            />
          </Sphere>
        ))}
      </group>
      
      {/* Energy streams between nodes */}
      {index < workflowNodes.length - 1 && (
        <group>
          {Array.from({ length: 3 }).map((_, i) => (
            <Sphere key={i} args={[0.03]} position={[
              i * 0.5 - 0.5,
              Math.sin(Date.now() * 0.003 + i) * 0.1,
              0
            ]}>
              <meshBasicMaterial 
                color="#FFFFFF" 
                transparent 
                opacity={0.8}
              />
            </Sphere>
          ))}
        </group>
      )}
    </group>
  );
}

export function WorkflowTrack() {
  const trackRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!trackRef.current) return;
    
    // Subtle breathing animation for the entire track
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    trackRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={trackRef}>
      {/* Render workflow nodes */}
      {workflowNodes.map((node, index) => (
        <WorkflowNode key={node.id} node={node} index={index} />
      ))}
      
      {/* Track ground/platform */}
      <Box args={[12, 0.1, 8]} position={[0, -0.5, 0]}>
        <meshStandardMaterial 
          color="#1a1a2e" 
          transparent 
          opacity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      
      {/* Track borders with neon effect */}
      <group>
        {/* Left border */}
        <Box args={[0.05, 0.2, 8]} position={[-6, -0.3, 0]}>
          <meshStandardMaterial 
            color="#00E0FF" 
            emissive="#00E0FF"
            emissiveIntensity={0.5}
          />
        </Box>
        
        {/* Right border */}
        <Box args={[0.05, 0.2, 8]} position={[6, -0.3, 0]}>
          <meshStandardMaterial 
            color="#00E0FF" 
            emissive="#00E0FF"
            emissiveIntensity={0.5}
          />
        </Box>
        
        {/* Front border */}
        <Box args={[12, 0.2, 0.05]} position={[0, -0.3, 4]}>
          <meshStandardMaterial 
            color="#9B51E0" 
            emissive="#9B51E0"
            emissiveIntensity={0.5}
          />
        </Box>
        
        {/* Back border */}
        <Box args={[12, 0.2, 0.05]} position={[0, -0.3, -4]}>
          <meshStandardMaterial 
            color="#9B51E0" 
            emissive="#9B51E0"
            emissiveIntensity={0.5}
          />
        </Box>
      </group>
      
      {/* Data flow visualization */}
      <group>
        {Array.from({ length: 20 }).map((_, i) => (
          <Sphere key={i} args={[0.02]} position={[
            (i - 10) * 0.6,
            -0.2 + Math.sin(Date.now() * 0.002 + i * 0.3) * 0.1,
            Math.sin(i * 0.5) * 3
          ]}>
            <meshBasicMaterial 
              color="#00E0FF" 
              transparent 
              opacity={0.7}
            />
          </Sphere>
        ))}
      </group>
    </group>
  );
}