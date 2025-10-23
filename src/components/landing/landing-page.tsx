'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  CpuChipIcon,
  LinkIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D scene to avoid SSR issues
const HeroScene = dynamic(() => import('@/components/3d/HeroScene').then(mod => ({ default: mod.HeroScene })), {
  ssr: false,
  loading: () => (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading 3D Experience...</p>
      </div>
    </div>
  )
});

const features = [
  {
    name: 'Visual Workflow Builder',
    description: 'Drag and drop AI blocks to create powerful automation workflows without coding.',
    icon: CpuChipIcon,
  },
  {
    name: 'Real-time Execution',
    description: 'Watch your workflows execute live with glowing animations and detailed logs.',
    icon: PlayIcon,
  },
  {
    name: 'AI-Powered Blocks',
    description: 'Pre-built blocks for text summarization, image generation, translation, and more.',
    icon: SparklesIcon,
  },
  {
    name: 'API Integrations',
    description: 'Connect to webhooks, databases, and third-party services seamlessly.',
    icon: LinkIcon,
  },
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* 3D Hero Scene - Full viewport immersive experience */}
      <Suspense fallback={
        <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading 3D Experience...</p>
          </div>
        </div>
      }>
        <HeroScene />
      </Suspense>
      
      {/* Navigation - overlay on top of 3D scene */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 rounded-lg bg-neon-gradient flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              PromptPilot
            </span>
          </motion.div>
        </div>
        
        <motion.div 
          className="flex space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link 
            href="/auth/login" 
            className="glass-button px-4 py-2 text-sm font-medium text-white hover:text-neon-cyan transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/auth/register" 
            className="bg-neon-gradient px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* Hero content - centered overlay */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <div className="mx-auto max-w-2xl text-center px-6">
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            Build AI Workflows{' '}
            <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Visually
            </span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg leading-8 text-gray-200 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
          >
            The no-code AI automation platform that lets you create powerful workflows 
            by connecting AI tasks, APIs, and actions with simple drag-and-drop blocks.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex items-center justify-center gap-x-6 pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.9 }}
          >
            <Link
              href="/auth/register"
              className="group relative inline-flex items-center gap-x-2 rounded-lg bg-neon-gradient px-6 py-3 text-sm font-semibold text-white shadow-2xl hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan transition-all duration-200"
            >
              Start Building
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/demo"
              className="text-sm font-semibold leading-6 text-gray-200 hover:text-white transition-colors backdrop-blur-sm"
            >
              View Demo <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features section */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.h2 
            className="text-base font-semibold leading-7 text-neon-cyan"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything you need to automate with AI
          </motion.p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                className="relative pl-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-neon-gradient">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to build your first AI workflow?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Join developers and creators who are already building amazing automation workflows with PromptPilot.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth/register"
              className="rounded-lg bg-neon-gradient px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan transition-opacity"
            >
              Get started for free
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-400">
            Built with ❤️ for the Appwrite Hacktoberfest 2025 Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}