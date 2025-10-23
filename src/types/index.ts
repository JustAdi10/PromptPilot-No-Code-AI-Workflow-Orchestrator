import { Models } from 'appwrite';

// Base types from Appwrite
export type User = Models.User<Models.Preferences>;
export type Team = Models.Team<Models.Preferences>;

// Workflow Types
export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    blockType: BlockType;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    config: Record<string, any>;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface Workflow extends Models.Document {
  name: string;
  description: string;
  owner: string; // User ID
  team?: string; // Team ID
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  settings: WorkflowSettings;
  status: 'draft' | 'active' | 'archived';
  tags?: string[];
  isPublic: boolean;
  version: number;
}

export interface WorkflowSettings {
  autoSave: boolean;
  schedule?: ScheduleConfig;
  retryPolicy?: RetryPolicy;
  timeout: number; // in seconds
  maxConcurrentExecutions: number;
}

export interface ScheduleConfig {
  enabled: boolean;
  cron: string;
  timezone: string;
  nextRun?: string;
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number; // in seconds
  exponentialBackoff: boolean;
}

// Block Types
export type BlockType = 
  | 'trigger'
  | 'ai-text'
  | 'ai-image'
  | 'webhook'
  | 'action'
  | 'condition'
  | 'loop'
  | 'delay';

export interface Block extends Models.Document {
  type: BlockType;
  name: string;
  description: string;
  category: string;
  icon: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  functionId?: string; // Appwrite Function ID
  isCustom: boolean;
  owner?: string;
  version: string;
  tags: string[];
}

export interface JSONSchema {
  type: string;
  properties: Record<string, {
    type: string;
    description?: string;
    required?: boolean;
    default?: any;
    enum?: string[];
    format?: string;
  }>;
  required?: string[];
}

// Execution Types
export type ExecutionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';
export type TriggerType = 'manual' | 'schedule' | 'webhook' | 'api';

export interface Execution extends Models.Document {
  workflowId: string;
  status: ExecutionStatus;
  trigger: TriggerType;
  triggerData?: Record<string, any>;
  startedAt: string;
  completedAt?: string;
  duration?: number; // in milliseconds
  totalNodes: number;
  completedNodes: number;
  failedNodes: number;
  currentNode?: string;
  results: Record<string, any>;
  error?: ExecutionError;
  metadata: ExecutionMetadata;
}

export interface ExecutionError {
  code: string;
  message: string;
  nodeId?: string;
  stack?: string;
  timestamp: string;
}

export interface ExecutionMetadata {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  executionTime: number;
  memoryUsage?: number;
  costEstimate?: number;
}

export interface ExecutionLog extends Models.Document {
  executionId: string;
  nodeId: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: Record<string, any>;
  timestamp: string;
  duration?: number;
}

// AI Operation Types
export interface AITextOperation {
  operation: 'summarize' | 'translate' | 'sentiment' | 'extract' | 'generate' | 'classify';
  input: string;
  config: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    language?: string; // for translation
    prompt?: string; // for custom operations
  };
}

export interface AIImageOperation {
  operation: 'generate' | 'edit' | 'vary' | 'analyze';
  input?: string; // text prompt or base64 image
  config: {
    model?: string;
    size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
    quality?: 'standard' | 'hd';
    style?: 'natural' | 'vivid';
    responseFormat?: 'url' | 'b64_json';
  };
}

// Webhook Types
export interface WebhookConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  authentication?: {
    type: 'none' | 'basic' | 'bearer' | 'api_key';
    config: Record<string, string>;
  };
  timeout: number;
  retries: number;
}

// Store Types (Zustand)
export interface AppState {
  user: User | null;
  currentTeam: Team | null;
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  isLoading: boolean;
  error: string | null;
}

export interface WorkflowBuilderState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  selectedEdge: WorkflowEdge | null;
  isExecuting: boolean;
  executionId: string | null;
  executionLogs: ExecutionLog[];
}

// Component Props Types
export interface NodeData {
  label: string;
  blockType: BlockType;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  config: Record<string, any>;
  isExecuting?: boolean;
  isCompleted?: boolean;
  hasError?: boolean;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Realtime Event Types
export type RealtimeEvent = 
  | ExecutionStartedEvent
  | ExecutionProgressEvent
  | ExecutionCompletedEvent
  | ExecutionFailedEvent
  | NodeExecutionEvent;

export interface ExecutionStartedEvent {
  type: 'execution.started';
  executionId: string;
  workflowId: string;
  timestamp: string;
}

export interface ExecutionProgressEvent {
  type: 'execution.progress';
  executionId: string;
  completedNodes: number;
  totalNodes: number;
  currentNode: string;
  timestamp: string;
}

export interface ExecutionCompletedEvent {
  type: 'execution.completed';
  executionId: string;
  results: Record<string, any>;
  duration: number;
  timestamp: string;
}

export interface ExecutionFailedEvent {
  type: 'execution.failed';
  executionId: string;
  error: ExecutionError;
  timestamp: string;
}

export interface NodeExecutionEvent {
  type: 'node.started' | 'node.completed' | 'node.failed';
  executionId: string;
  nodeId: string;
  data?: any;
  error?: ExecutionError;
  timestamp: string;
}