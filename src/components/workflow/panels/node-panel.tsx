'use client';

import { useState } from 'react';
import { 
  SparklesIcon,
  PlayIcon,
  CpuChipIcon,
  LinkIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import type { BlockType } from '@/types';

interface BlockDefinition {
  id: string;
  type: BlockType;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  config: Record<string, any>;
}

const blockCategories = {
  triggers: 'Triggers',
  'ai-operations': 'AI Operations',
  actions: 'Actions',
  logic: 'Logic & Control',
};

const availableBlocks: BlockDefinition[] = [
  // Triggers
  {
    id: 'manual-trigger',
    type: 'trigger',
    name: 'Manual Trigger',
    description: 'Start workflow manually',
    category: 'triggers',
    icon: PlayIcon,
    config: {},
  },
  
  // AI Operations
  {
    id: 'summarize-text',
    type: 'ai-text',
    name: 'Summarize Text',
    description: 'Generate a concise summary of the input text',
    category: 'ai-operations',
    icon: SparklesIcon,
    config: {
      maxLength: 100,
      model: 'gpt-3.5-turbo',
    },
  },
  {
    id: 'translate-text',
    type: 'ai-text',
    name: 'Translate Text',
    description: 'Translate text between languages',
    category: 'ai-operations',
    icon: SparklesIcon,
    config: {
      targetLanguage: 'en',
      model: 'gpt-3.5-turbo',
    },
  },
  {
    id: 'generate-image',
    type: 'ai-image',
    name: 'Generate Image',
    description: 'Create images from text descriptions',
    category: 'ai-operations',
    icon: SparklesIcon,
    config: {
      size: '1024x1024',
      quality: 'standard',
      style: 'natural',
    },
  },
  {
    id: 'analyze-sentiment',
    type: 'ai-text',
    name: 'Analyze Sentiment',
    description: 'Determine the emotional tone of text',
    category: 'ai-operations',
    icon: SparklesIcon,
    config: {
      model: 'gpt-3.5-turbo',
    },
  },
  
  // Actions
  {
    id: 'send-webhook',
    type: 'webhook',
    name: 'Send Webhook',
    description: 'Send HTTP request to an external API',
    category: 'actions',
    icon: LinkIcon,
    config: {
      method: 'POST',
      timeout: 30,
    },
  },
  {
    id: 'send-email',
    type: 'action',
    name: 'Send Email',
    description: 'Send an email notification',
    category: 'actions',
    icon: CpuChipIcon,
    config: {},
  },
  
  // Logic & Control
  {
    id: 'condition',
    type: 'condition',
    name: 'Condition',
    description: 'Branch workflow based on conditions',
    category: 'logic',
    icon: CpuChipIcon,
    config: {},
  },
  {
    id: 'delay',
    type: 'delay',
    name: 'Delay',
    description: 'Wait for a specified amount of time',
    category: 'logic',
    icon: ClockIcon,
    config: {
      duration: 60,
      unit: 'seconds',
    },
  },
  {
    id: 'loop',
    type: 'loop',
    name: 'Loop',
    description: 'Repeat actions for each item in a list',
    category: 'logic',
    icon: CpuChipIcon,
    config: {
      maxIterations: 10,
    },
  },
];

export function NodePanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBlocks = availableBlocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const groupedBlocks = filteredBlocks.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, BlockDefinition[]>);

  const onDragStart = (event: React.DragEvent, blockType: string, blockData: BlockDefinition) => {
    event.dataTransfer.setData('application/reactflow', blockType);
    event.dataTransfer.setData('application/json', JSON.stringify(blockData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Block Library</h2>
        
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          />
        </div>
        
        {/* Category Filter */}
        <div className="mt-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          >
            <option value="all">All Categories</option>
            {Object.entries(blockCategories).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Block List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {Object.entries(groupedBlocks).map(([category, blocks]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              {blockCategories[category as keyof typeof blockCategories] || category}
            </h3>
            
            <div className="space-y-2">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(event) => onDragStart(event, 'workflowNode', block)}
                  className="glass-card p-3 cursor-grab hover:bg-white/10 transition-all duration-200 active:cursor-grabbing"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                      <block.icon className="w-4 h-4 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">
                        {block.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {block.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {filteredBlocks.length === 0 && (
        <div className="p-8 text-center">
          <SparklesIcon className="w-8 h-8 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No blocks found</p>
          <p className="text-gray-600 text-xs mt-1">
            Try adjusting your search or filter
          </p>
        </div>
      )}
    </div>
  );
}