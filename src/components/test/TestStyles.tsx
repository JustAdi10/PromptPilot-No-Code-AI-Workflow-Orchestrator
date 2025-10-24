'use client';

import { motion } from 'framer-motion';

export function TestStyles() {
  return (
    <div 
      className="min-h-screen p-8"
      style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #1e293b 100%)',
        minHeight: '100vh' 
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: 'white' }}>CSS Test Page</h1>
        
        {/* Basic Tailwind Classes Test */}
        <div 
          className="rounded-xl p-6 mb-6"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#60a5fa' }}>Basic Tailwind Test</h2>
          <p style={{ color: '#d1d5db' }}>If you can see this styled, basic Tailwind is working.</p>
          <button 
            className="mt-4 px-6 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white',
              marginTop: '16px',
              padding: '8px 24px',
              borderRadius: '8px'
            }}
          >
            Basic Button
          </button>
        </div>

        {/* Custom Neon Colors Test */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#00E0FF' }}>Inline Neon Cyan</h2>
          <h2 className="text-2xl font-bold text-neon-cyan mb-4">Tailwind Neon Cyan</h2>
          <p className="text-gray-300 mb-4">Testing custom color utilities...</p>
          <button 
            className="px-6 py-2 rounded-lg text-black font-semibold mr-4"
            style={{ backgroundColor: '#00E0FF' }}
          >
            Inline Neon Button
          </button>
          <button className="px-6 py-2 bg-neon-cyan text-black rounded-lg font-semibold">
            Tailwind Neon Button
          </button>
        </div>

        {/* Glass Effects Test */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Glass Card Test</h2>
          <p className="text-gray-300">Testing glass morphism effects with custom CSS classes.</p>
        </div>

        {/* Animation Test */}
        <motion.div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-xl text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Animation Test</h2>
          <p>Testing Framer Motion animations.</p>
        </motion.div>
      </div>
    </div>
  );
}