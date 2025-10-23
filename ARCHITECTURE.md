# 🧩 PromptPilot Architecture

## 🎯 System Overview

PromptPilot is a no-code AI workflow orchestrator that enables users to visually design and execute multi-step AI automation workflows. Think "Zapier + ChatGPT" with a visual interface.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  Dashboard    │  Workflow Builder  │  Execution View       │
│               │  (React Flow)      │  (Realtime)           │
├─────────────────────────────────────────────────────────────┤
│               APPWRITE BACKEND SERVICES                     │
├─────────────────────────────────────────────────────────────┤
│  Auth         │  Database         │  Storage               │
│  - Users      │  - Workflows      │  - Generated Files     │
│  - Teams      │  - Blocks         │  - Images/PDFs         │
│               │  - Execution Logs │                        │
├─────────────────────────────────────────────────────────────┤
│  Functions                        │  Realtime              │
│  - AI Operations                  │  - Execution Updates   │
│  - Workflow Executor             │  - Live Status         │
│  - API Integrations              │                        │
├─────────────────────────────────────────────────────────────┤
│               EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────┤
│  OpenAI API   │  Webhooks        │  Third-party APIs      │
│  - GPT-4      │  - HTTP Requests │  - Email Services      │
│  - DALL-E     │  - Triggers      │  - Data Sources        │
└─────────────────────────────────────────────────────────────┘
```

## 🧱 Component Hierarchy

### Frontend Components
```
App
├── Layout
│   ├── Header (Navigation, User Menu)
│   ├── Sidebar (Workflow List)
│   └── Main Content
├── Pages
│   ├── Dashboard (/dashboard)
│   ├── WorkflowBuilder (/workflow/[id])
│   ├── ExecutionView (/execution/[id])
│   └── Settings (/settings)
├── Workflow Components
│   ├── FlowCanvas (React Flow)
│   ├── NodeTypes (AI Blocks)
│   ├── EdgeTypes (Connections)
│   └── NodePanel (Block Library)
└── Execution Components
    ├── ExecutionMonitor
    ├── LogViewer
    └── StatusIndicator
```

### Backend Services (Appwrite)
```
Appwrite Project
├── Authentication
│   ├── Users Collection
│   └── Teams/Organizations
├── Database
│   ├── workflows Collection
│   ├── blocks Collection
│   ├── executions Collection
│   └── execution_logs Collection
├── Storage
│   ├── generated-files Bucket
│   └── user-uploads Bucket
├── Functions
│   ├── ai-text-operations
│   ├── ai-image-generation
│   ├── workflow-executor
│   ├── webhook-handler
│   └── scheduler-trigger
└── Realtime
    └── execution-updates Channel
```

## 🔄 Data Flow

1. **Workflow Creation**
   ```
   User → React Flow Editor → Appwrite Database → Store Workflow Graph
   ```

2. **Workflow Execution**
   ```
   Trigger → Appwrite Function → Parse Graph → Execute Nodes → 
   Update Realtime → Store Logs → Return Results
   ```

3. **Real-time Updates**
   ```
   Execution Engine → Appwrite Realtime → Frontend → UI Updates
   ```

## 📊 Database Schema

### Workflows Collection
```typescript
interface Workflow {
  $id: string;
  name: string;
  description: string;
  owner: string; // User ID
  team?: string; // Team ID
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  settings: {
    autoSave: boolean;
    schedule?: ScheduleConfig;
  };
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}
```

### Blocks Collection (Node Library)
```typescript
interface Block {
  $id: string;
  type: 'ai-text' | 'ai-image' | 'webhook' | 'trigger' | 'action';
  name: string;
  description: string;
  category: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  functionId?: string; // Appwrite Function ID
  isCustom: boolean;
  owner?: string;
}
```

### Executions Collection
```typescript
interface Execution {
  $id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  trigger: 'manual' | 'schedule' | 'webhook';
  startedAt: string;
  completedAt?: string;
  totalNodes: number;
  completedNodes: number;
  currentNode?: string;
  results: Record<string, any>;
  error?: string;
}
```

## 🎨 UI/UX Design System

### Color Palette
- **Primary**: Cyan (#00D4FF) to Purple (#8B5CF6) gradient
- **Secondary**: Emerald (#10B981) for success states
- **Accent**: Amber (#F59E0B) for warnings
- **Neutral**: Slate grays for text and backgrounds
- **Background**: Dark (#0F172A) with glassmorphism overlays

### Typography
- **Headers**: Inter Bold
- **Body**: Inter Regular
- **Code**: JetBrains Mono

### Components Style
- **Cards**: Rounded-xl with backdrop-blur glassmorphism
- **Buttons**: Gradient backgrounds with hover animations
- **Nodes**: Glowing borders that pulse during execution
- **Connections**: Animated flow lines with particles

## 🚀 Performance Optimizations

1. **Frontend**
   - React.memo for expensive components
   - Virtual scrolling for large workflow lists
   - Debounced auto-save
   - Optimistic UI updates

2. **Backend**
   - Function warming strategies
   - Database indexing on frequently queried fields
   - Batch operations for bulk updates
   - Realtime subscription management

3. **Caching Strategy**
   - Client-side caching with SWR
   - Function result caching for expensive operations
   - Static file caching via CDN

## 🔒 Security Considerations

1. **Authentication & Authorization**
   - JWT-based auth via Appwrite
   - Role-based access control (RBAC)
   - Team-based resource isolation

2. **Data Protection**
   - Input validation and sanitization
   - API key encryption in storage
   - Secure function execution environments

3. **Rate Limiting**
   - Per-user execution limits
   - API call throttling
   - Resource usage monitoring