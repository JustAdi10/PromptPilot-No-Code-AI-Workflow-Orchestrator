'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  CpuChipIcon,
  LinkIcon,
  PlayIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export function SimpleLandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-6 h-6 text-brand-orange" />
              <span className="text-xl font-bold text-white">PromptPilot</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/auth/login" className="text-dark-text-secondary hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-brand-orange-dark transition-colors shadow-glow-orange"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-5xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Build AI Workflows{' '}
            <span className="text-brand-orange">Visually</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-dark-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The no-code AI automation platform that lets you create powerful workflows 
            by connecting AI tasks, APIs, and actions with simple drag-and-drop blocks.
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/auth/register"
              className="bg-brand-orange text-white px-8 py-4 rounded-lg hover:bg-brand-orange-dark transition-all duration-200 font-semibold flex items-center gap-2 shadow-glow-orange hover:shadow-glow-orange-strong"
            >
              Start Building Free
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="text-dark-text-secondary hover:text-white transition-colors font-semibold flex items-center gap-2 border border-dark-border hover:border-brand-orange px-6 py-4 rounded-lg"
            >
              <PlayIcon className="w-4 h-4" />
              Watch Demo
            </Link>
          </motion.div>

          {/* Simple Demo Placeholder */}
          <motion.div 
            className="bg-dark-card rounded-2xl p-8 border border-dark-border"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="text-center">
              <div className="bg-dark-surface rounded-lg p-6 border border-dark-border inline-block">
                <CpuChipIcon className="w-12 h-12 text-brand-orange mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white">Visual Workflow Builder</h3>
                <p className="text-dark-text-secondary text-sm">Drag, drop, connect. No coding required.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple Workflow Steps */}
      <section className="py-16 bg-dark-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">A radically simple workflow</h2>
            <p className="text-xl text-dark-text-secondary">Build powerful AI automations in three easy steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Design",
                description: "Drag and drop AI blocks to create your workflow visually. No coding required.",
                icon: CpuChipIcon
              },
              {
                step: "2", 
                title: "Connect",
                description: "Link blocks together and configure AI tasks, APIs, and data sources.",
                icon: LinkIcon
              },
              {
                step: "3",
                title: "Execute", 
                description: "Run your workflows instantly or schedule them to run automatically.",
                icon: PlayIcon
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-brand-orange text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-6 shadow-glow-orange">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-dark-text-secondary leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-dark-bg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">AI Automation on Autopilot</h2>
            <p className="text-xl text-dark-text-secondary">Everything you need to build powerful workflows</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Visual Builder",
                description: "Drag-and-drop interface powered by React Flow for intuitive workflow creation.",
                icon: CpuChipIcon
              },
              {
                title: "AI-Powered Blocks", 
                description: "Pre-built blocks for text operations, image generation, and data processing.",
                icon: SparklesIcon
              },
              {
                title: "API Integrations",
                description: "Connect to webhooks, databases, and third-party services seamlessly.",
                icon: LinkIcon
              },
              {
                title: "Real-time Execution",
                description: "Watch your workflows execute live with detailed logs and monitoring.",
                icon: PlayIcon
              },
              {
                title: "Team Collaboration",
                description: "Share workflows with your team and collaborate in real-time.",
                icon: CheckIcon
              },
              {
                title: "Production Ready",
                description: "Built on Appwrite with enterprise-grade security and reliability.",
                icon: CheckIcon
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-dark-card p-6 rounded-xl border border-dark-border hover:border-brand-orange transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <feature.icon className="w-8 h-8 text-brand-orange mb-4 group-hover:text-brand-orange-light transition-colors" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-orange text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to automate with AI?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers building the future of automation.
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-brand-orange px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold inline-flex items-center gap-2 shadow-lg"
          >
            Start Building Free
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border py-8 bg-dark-bg">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-dark-text-muted">
            Built with <span className="text-brand-orange">❤️</span> for the Appwrite Hacktoberfest 2025 Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}