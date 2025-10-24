'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  SparklesIcon,
  DocumentTextIcon,
  PlayIcon,
  ClockIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useAppwrite } from '@/lib/providers/appwrite-provider';
import { databases, APPWRITE_CONFIG } from '@/lib/appwrite';
import { toast } from 'sonner';

interface Workflow {
  $id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused';
  lastExecuted?: string;
  executionCount: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, logout, isLoading: authLoading } = useAppwrite();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    successRate: 0
  });

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchWorkflows();
    }
  }, [user]);

  const fetchWorkflows = async () => {
    try {
      setIsLoading(true);
      
      // Fetch workflows from Appwrite
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workflows,
        [
          // Filter by current user (assuming we have a userId field)
          // Query.equal('userId', user.$id)
        ]
      );

      const workflowsData = response.documents.map(doc => ({
        $id: doc.$id,
        name: doc.name || 'Untitled Workflow',
        description: doc.description || '',
        status: doc.status || 'draft',
        lastExecuted: doc.lastExecuted,
        executionCount: doc.executionCount || 0,
        createdAt: doc.$createdAt
      })) as Workflow[];

      setWorkflows(workflowsData);

      // Calculate stats
      const totalWorkflows = workflowsData.length;
      const activeWorkflows = workflowsData.filter(w => w.status === 'active').length;
      const totalExecutions = workflowsData.reduce((sum, w) => sum + w.executionCount, 0);
      
      setStats({
        totalWorkflows,
        activeWorkflows,
        totalExecutions,
        successRate: totalExecutions > 0 ? 85 : 0 // Mock success rate
      });

    } catch (error: any) {
      console.error('Failed to fetch workflows:', error);
      if (error.code === 401) {
        toast.error('Session expired. Please login again.');
        router.push('/auth/login');
      } else {
        toast.error('Failed to load workflows');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const createNewWorkflow = async () => {
    try {
      const newWorkflow = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workflows,
        'unique()',
        {
          name: 'New Workflow',
          description: 'A new AI workflow',
          status: 'draft',
          userId: user?.$id,
          blocks: [],
          connections: [],
          executionCount: 0
        }
      );

      toast.success('New workflow created!');
      router.push(`/workflows/${newWorkflow.$id}`);
    } catch (error: any) {
      console.error('Failed to create workflow:', error);
      toast.error('Failed to create workflow');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="border-b border-dark-border bg-dark-surface">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <SparklesIcon className="w-6 h-6 text-brand-orange" />
              <span className="text-xl font-bold text-white">PromptPilot</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={createNewWorkflow}
                className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-brand-orange-dark transition-colors font-medium flex items-center gap-2 shadow-glow-orange"
              >
                <PlusIcon className="w-4 h-4" />
                New Workflow
              </button>
              
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="w-6 h-6 text-dark-text-secondary" />
                <span className="text-white font-medium">{user.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="text-dark-text-secondary hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-dark-card"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-dark-text-secondary">
            Here's what's happening with your AI workflows today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              icon: DocumentTextIcon,
              label: 'Total Workflows',
              value: stats.totalWorkflows,
              change: '+2 this week',
              color: 'text-blue-400'
            },
            {
              icon: PlayIcon,
              label: 'Active Workflows',
              value: stats.activeWorkflows,
              change: '+1 today',
              color: 'text-green-400'
            },
            {
              icon: ChartBarIcon,
              label: 'Total Executions',
              value: stats.totalExecutions,
              change: '+12% vs last month',
              color: 'text-brand-orange'
            },
            {
              icon: ClockIcon,
              label: 'Success Rate',
              value: `${stats.successRate}%`,
              change: '+5% improvement',
              color: 'text-purple-400'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-dark-card p-6 rounded-xl border border-dark-border hover:border-brand-orange/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-dark-text-secondary mb-1">{stat.label}</div>
              <div className="text-xs text-green-400">{stat.change}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Create Workflow',
                description: 'Start building a new AI workflow',
                icon: PlusIcon,
                action: createNewWorkflow,
                color: 'bg-brand-orange hover:bg-brand-orange-dark'
              },
              {
                title: 'Browse Templates',
                description: 'Explore pre-built workflow templates',
                icon: DocumentTextIcon,
                action: () => router.push('/templates'),
                color: 'bg-blue-600 hover:bg-blue-700'
              },
              {
                title: 'Settings',
                description: 'Configure integrations and preferences',
                icon: Cog6ToothIcon,
                action: () => router.push('/settings'),
                color: 'bg-gray-600 hover:bg-gray-700'
              }
            ].map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                onClick={action.action}
                className={`${action.color} text-white p-6 rounded-xl transition-colors text-left group`}
              >
                <action.icon className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
                <ArrowRightIcon className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Workflows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Workflows</h2>
            <Link
              href="/workflows"
              className="text-brand-orange hover:text-brand-orange-light transition-colors text-sm font-medium"
            >
              View all workflows →
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-dark-card p-6 rounded-xl border border-dark-border animate-pulse">
                  <div className="h-4 bg-dark-border rounded mb-2 w-1/3" />
                  <div className="h-3 bg-dark-border rounded mb-4 w-2/3" />
                  <div className="flex space-x-4">
                    <div className="h-3 bg-dark-border rounded w-16" />
                    <div className="h-3 bg-dark-border rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : workflows.length > 0 ? (
            <div className="space-y-4">
              {workflows.slice(0, 5).map((workflow, index) => (
                <motion.div
                  key={workflow.$id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-dark-card p-6 rounded-xl border border-dark-border hover:border-brand-orange/30 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/workflows/${workflow.$id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1 group-hover:text-brand-orange transition-colors">
                        {workflow.name}
                      </h3>
                      <p className="text-dark-text-secondary text-sm mb-2">
                        {workflow.description || 'No description'}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-dark-text-muted">
                        <span className={`px-2 py-1 rounded ${
                          workflow.status === 'active' 
                            ? 'bg-green-900/30 text-green-400' 
                            : workflow.status === 'paused'
                            ? 'bg-yellow-900/30 text-yellow-400'
                            : 'bg-gray-900/30 text-gray-400'
                        }`}>
                          {workflow.status}
                        </span>
                        <span>Executed {workflow.executionCount} times</span>
                        <span>
                          Created {new Date(workflow.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-dark-text-muted group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-dark-card p-12 rounded-xl border border-dark-border text-center">
              <SparklesIcon className="w-12 h-12 text-brand-orange mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No workflows yet</h3>
              <p className="text-dark-text-secondary mb-6">
                Create your first AI workflow to get started with automation.
              </p>
              <button
                onClick={createNewWorkflow}
                className="bg-brand-orange text-white px-6 py-3 rounded-lg hover:bg-brand-orange-dark transition-colors font-medium flex items-center gap-2 mx-auto shadow-glow-orange"
              >
                <PlusIcon className="w-4 h-4" />
                Create Your First Workflow
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}