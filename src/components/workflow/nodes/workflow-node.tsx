'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  SparklesIcon,
  PlayIcon,
  CpuChipIcon,
  LinkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import type { NodeData, BlockType } from '@/types';

const blockIcons: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  trigger: PlayIcon,
  'ai-text': SparklesIcon,
  'ai-image': SparklesIcon,
  webhook: LinkIcon,
  action: CpuChipIcon,
  condition: CpuChipIcon,
  loop: CpuChipIcon,
  delay: ClockIcon,
};

const blockColors: Record<BlockType, string> = {
  trigger: 'from-emerald-500 to-emerald-600',
  'ai-text': 'from-purple-500 to-purple-600',
  'ai-image': 'from-pink-500 to-pink-600',
  webhook: 'from-blue-500 to-blue-600',
  action: 'from-orange-500 to-orange-600',
  condition: 'from-yellow-500 to-yellow-600',
  loop: 'from-indigo-500 to-indigo-600',
  delay: 'from-gray-500 to-gray-600',
};

export const WorkflowNode = memo(({ data, selected }: NodeProps<NodeData>) => {
  const Icon = blockIcons[data.blockType];
  const colorClass = blockColors[data.blockType];
  
  const isExecuting = data.isExecuting;
  const isCompleted = data.isCompleted;
  const hasError = data.hasError;

  return (
    <div
      className={`
        workflow-node min-w-[200px] max-w-[300px]
        ${selected ? 'ring-2 ring-neon-cyan' : ''}
        ${isExecuting ? 'executing' : ''}
        ${isCompleted ? 'completed' : ''}
        ${hasError ? 'error' : ''}
      `}
    >
      {/* Input Handle */}
      {data.blockType !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 border-2 border-white/30 bg-slate-700"
        />
      )}

      {/* Node Content */}
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white truncate">
              {data.label}
            </h3>
            {isExecuting && (
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            )}
            {isCompleted && (
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
            {hasError && (
              <div className="w-2 h-2 rounded-full bg-red-400" />
            )}
          </div>
          
          <p className="text-xs text-gray-400 mt-1 capitalize">
            {data.blockType.replace('-', ' ')}
          </p>

          {/* Input/Output Summary */}
          <div className="mt-2 space-y-1">
            {Object.keys(data.inputs).length > 0 && (
              <div className="text-xs text-gray-500">
                Inputs: {Object.keys(data.inputs).length}
              </div>
            )}
            {Object.keys(data.outputs).length > 0 && (
              <div className="text-xs text-gray-500">
                Outputs: {Object.keys(data.outputs).length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-white/30 bg-neon-cyan/70"
      />

      {/* Execution Progress */}
      {isExecuting && (
        <div className="absolute inset-0 rounded-xl border-2 border-neon-cyan animate-glow-pulse pointer-events-none" />
      )}
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';