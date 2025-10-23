'use client';

import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';

import 'reactflow/dist/style.css';

import { WorkflowNode } from './nodes/workflow-node';
import { NodePanel } from './panels/node-panel';
import { PropertiesPanel } from './panels/properties-panel';
import { ExecutionPanel } from './panels/execution-panel';

const nodeTypes = {
  workflowNode: WorkflowNode,
};

const initialNodes: Node[] = [
  {
    id: 'trigger',
    type: 'workflowNode',
    position: { x: 100, y: 100 },
    data: {
      label: 'Manual Trigger',
      blockType: 'trigger',
      inputs: {},
      outputs: { triggeredAt: '', userId: '' },
      config: {},
    },
  },
];

const initialEdges: Edge[] = [];

interface WorkflowBuilderProps {
  workflowId?: string;
  isReadOnly?: boolean;
}

export function WorkflowBuilder({ workflowId, isReadOnly = false }: WorkflowBuilderProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const blockData = JSON.parse(event.dataTransfer.getData('application/json'));

      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - (reactFlowBounds?.left ?? 0),
        y: event.clientY - (reactFlowBounds?.top ?? 0),
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: 'workflowNode',
        position,
        data: {
          label: blockData.name,
          blockType: blockData.type,
          inputs: {},
          outputs: {},
          config: blockData.config || {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setIsPanelOpen(false);
  }, []);

  const executeWorkflow = useCallback(async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    // TODO: Implement workflow execution
    console.log('Executing workflow with nodes:', nodes, 'and edges:', edges);
    
    // Simulate execution
    setTimeout(() => {
      setIsExecuting(false);
    }, 5000);
  }, [nodes, edges, isExecuting]);

  const saveWorkflow = useCallback(async () => {
    // TODO: Implement workflow saving
    console.log('Saving workflow:', { nodes, edges });
  }, [nodes, edges]);

  return (
    <div className="h-screen flex bg-slate-900">
      {/* Node Library Panel */}
      <div className="w-80 border-r border-white/10 bg-slate-800/50 backdrop-blur-sm">
        <NodePanel />
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          className="bg-slate-900"
          fitView
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgba(255, 255, 255, 0.1)"
          />
          <Controls className="glass-card" />
          <MiniMap
            className="glass-card"
            nodeColor="#334155"
            maskColor="rgba(0, 0, 0, 0.3)"
            position="bottom-left"
          />
        </ReactFlow>

        {/* Toolbar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="glass-card px-4 py-2">
            <h1 className="text-lg font-semibold text-white">
              Workflow Builder
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={saveWorkflow}
              className="glass-button px-4 py-2 text-sm font-medium text-white hover:text-neon-cyan transition-colors"
            >
              Save
            </button>
            <button
              onClick={executeWorkflow}
              disabled={isExecuting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isExecuting
                  ? 'bg-amber-500/20 text-amber-400 cursor-not-allowed'
                  : 'bg-neon-gradient text-white hover:opacity-90'
              }`}
            >
              {isExecuting ? 'Executing...' : 'Run Workflow'}
            </button>
          </div>
        </div>

        {/* Execution Status */}
        {isExecuting && (
          <div className="absolute bottom-4 left-4 right-4">
            <ExecutionPanel />
          </div>
        )}
      </div>

      {/* Properties Panel */}
      {isPanelOpen && (
        <div className="w-80 border-l border-white/10 bg-slate-800/50 backdrop-blur-sm">
          <PropertiesPanel 
            node={selectedNode} 
            onClose={() => setIsPanelOpen(false)}
            onUpdateNode={(updatedNode) => {
              setNodes((nodes) =>
                nodes.map((node) =>
                  node.id === updatedNode.id ? updatedNode : node
                )
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

export function WorkflowBuilderWrapper(props: WorkflowBuilderProps) {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder {...props} />
    </ReactFlowProvider>
  );
}