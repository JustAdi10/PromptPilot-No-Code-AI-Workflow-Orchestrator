'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  SparklesIcon,
  DocumentTextIcon,
  CloudIcon,
  Cog6ToothIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { useAppwrite } from '@/lib/providers/appwrite-provider';
import { databases, functions, realtime, APPWRITE_CONFIG } from '@/lib/appwrite';
import { toast } from 'sonner';

// React Flow imports
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node types
import { WorkflowNode } from '@/components/workflow/nodes/workflow-node';

const nodeTypes = {
  workflowNode: WorkflowNode,
};

interface WorkflowData {
  $id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused';
  blocks: any[];
  connections: any[];
  userId: string;
  executionCount: number;
}

export default function WorkflowBuilderPage() {
  const { user } = useAppwrite();
  const router = useRouter();
  const params = useParams();
  const workflowId = params.id as string;

  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Load workflow data
  useEffect(() => {
    if (user && workflowId) {
      loadWorkflow();
    }
  }, [user, workflowId]);

  // Set up realtime updates
  useEffect(() => {
    if (workflow) {
      const unsubscribe = realtime.subscribe(
        `databases.${APPWRITE_CONFIG.databaseId}.collections.${APPWRITE_CONFIG.collections.workflows}.documents.${workflow.$id}`,
        (response) => {
          console.log('Workflow updated:', response);
          // Handle real-time updates
          if (response.events.includes('databases.*.collections.*.documents.*.update')) {
            toast.info('Workflow updated by another user');
            loadWorkflow();
          }
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [workflow]);

  const loadWorkflow = async () => {
    try {
      setIsLoading(true);
      
      const workflowDoc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workflows,
        workflowId
      );

      const workflowData: WorkflowData = {
        $id: workflowDoc.$id,
        name: workflowDoc.name,
        description: workflowDoc.description,
        status: workflowDoc.status,
        blocks: workflowDoc.blocks || [],
        connections: workflowDoc.connections || [],
        userId: workflowDoc.userId,
        executionCount: workflowDoc.executionCount || 0
      };

      setWorkflow(workflowData);

      // Convert blocks to React Flow nodes
      const reactFlowNodes: Node[] = workflowData.blocks.map((block: any, index: number) => ({
        id: block.id || `node-${index}`,
        type: 'workflowNode',
        position: block.position || { x: 100 + index * 200, y: 100 },
        data: {
          label: block.name || `Node ${index + 1}`,
          type: block.type || 'text',
          config: block.config || {},
          status: block.status || 'idle'
        }
      }));

      // Convert connections to React Flow edges
      const reactFlowEdges: Edge[] = workflowData.connections.map((conn: any, index: number) => ({
        id: conn.id || `edge-${index}`,
        source: conn.source,
        target: conn.target,
        sourceHandle: conn.sourceHandle,
        targetHandle: conn.targetHandle,
        type: 'smoothstep',
        animated: conn.animated || false
      }));

      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);

    } catch (error: any) {
      console.error('Failed to load workflow:', error);
      toast.error('Failed to load workflow');
      if (error.code === 404) {
        router.push('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveWorkflow = async () => {
    if (!workflow || !user) return;

    try {
      setIsSaving(true);

      // Convert React Flow nodes back to blocks
      const blocks = nodes.map(node => ({
        id: node.id,
        name: node.data.label,
        type: node.data.type,
        position: node.position,
        config: node.data.config,
        status: node.data.status
      }));

      // Convert React Flow edges back to connections
      const connections = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        animated: edge.animated
      }));

      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workflows,
        workflow.$id,
        {
          blocks,
          connections,
          updatedAt: new Date().toISOString()
        }
      );

      toast.success('Workflow saved successfully!');
    } catch (error: any) {
      console.error('Failed to save workflow:', error);
      toast.error('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  const executeWorkflow = async () => {
    if (!workflow || !user) return;

    try {
      setIsExecuting(true);
      toast.info('Starting workflow execution...');

      // Call Appwrite function to execute the workflow
      const execution = await functions.createExecution(
        APPWRITE_CONFIG.functions.workflowExecutor,
        JSON.stringify({
          workflowId: workflow.$id,
          blocks: nodes.map(node => ({
            id: node.id,
            type: node.data.type,
            config: node.data.config
          })),
          connections: edges.map(edge => ({
            source: edge.source,
            target: edge.target
          }))
        })
      );

      toast.success('Workflow execution started!');
      
      // Update execution count
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workflows,
        workflow.$id,
        {
          executionCount: workflow.executionCount + 1,
          lastExecuted: new Date().toISOString()
        }
      );

    } catch (error: any) {
      console.error('Failed to execute workflow:', error);
      toast.error('Failed to execute workflow');
    } finally {
      setIsExecuting(false);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'workflowNode',
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      data: {
        label: `${type} Node`,
        type,
        config: {},
        status: 'idle'
      }
    };

    setNodes((nds) => [...nds, newNode]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-text-secondary">Loading workflow...</p>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Workflow not found</h1>
          <Link href="/dashboard" className="text-brand-orange hover:text-brand-orange-light">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="bg-dark-surface border-b border-dark-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-dark-text-secondary hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">{workflow.name}</h1>
              <p className="text-sm text-dark-text-secondary">{workflow.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={saveWorkflow}
              disabled={isSaving}
              className="px-4 py-2 bg-dark-card border border-dark-border text-white rounded-lg hover:border-brand-orange transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <BookmarkIcon className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            
            <button
              onClick={executeWorkflow}
              disabled={isExecuting}
              className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors disabled:opacity-50 flex items-center gap-2 shadow-glow-orange"
            >
              <PlayIcon className="w-4 h-4" />
              {isExecuting ? 'Running...' : 'Run Workflow'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Node Palette */}
        <div className="w-64 bg-dark-surface border-r border-dark-border p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Node Types</h3>
          <div className="space-y-2">
            {[
              { type: 'text', label: 'Text Processing', icon: DocumentTextIcon },
              { type: 'image', label: 'Image Generation', icon: SparklesIcon },
              { type: 'api', label: 'API Call', icon: CloudIcon },
              { type: 'condition', label: 'Condition', icon: Cog6ToothIcon }
            ].map((nodeType) => (
              <button
                key={nodeType.type}
                onClick={() => addNode(nodeType.type)}
                className="w-full p-3 text-left bg-dark-card hover:bg-dark-border border border-dark-border rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <nodeType.icon className="w-5 h-5 text-brand-orange group-hover:scale-110 transition-transform" />
                  <span className="text-white text-sm font-medium">{nodeType.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            className="bg-dark-bg"
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          >
            <Background color="#2A2A2A" />
            <Controls className="bg-dark-card border-dark-border" />
            <MiniMap 
              className="bg-dark-card border-dark-border"
              nodeColor="#FF6B35"
              maskColor="rgba(0, 0, 0, 0.8)"
            />
            
            <Panel position="top-right" className="bg-dark-card p-4 rounded-lg border border-dark-border">
              <div className="text-white text-sm">
                <div>Nodes: {nodes.length}</div>
                <div>Connections: {edges.length}</div>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    workflow.status === 'active' 
                      ? 'bg-green-900/30 text-green-400' 
                      : workflow.status === 'paused'
                      ? 'bg-yellow-900/30 text-yellow-400'
                      : 'bg-gray-900/30 text-gray-400'
                  }`}>
                    {workflow.status}
                  </span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}