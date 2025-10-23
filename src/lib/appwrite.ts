import { Client, Databases, Storage, Functions, Account, Teams } from 'appwrite';

// Appwrite configuration
export const APPWRITE_CONFIG = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  
  // Database
  databaseId: process.env.APPWRITE_DATABASE_ID || 'promptpilot-db',
  
  // Collections
  collections: {
    workflows: process.env.APPWRITE_WORKFLOWS_COLLECTION_ID || 'workflows',
    blocks: process.env.APPWRITE_BLOCKS_COLLECTION_ID || 'blocks',
    executions: process.env.APPWRITE_EXECUTIONS_COLLECTION_ID || 'executions',
    executionLogs: process.env.APPWRITE_EXECUTION_LOGS_COLLECTION_ID || 'execution-logs',
  },
  
  // Storage
  buckets: {
    generatedFiles: process.env.APPWRITE_GENERATED_FILES_BUCKET_ID || 'generated-files',
    userUploads: process.env.APPWRITE_USER_UPLOADS_BUCKET_ID || 'user-uploads',
  },
  
  // Functions
  functions: {
    aiTextOperations: process.env.APPWRITE_AI_TEXT_FUNCTION_ID || 'ai-text-operations',
    aiImageGeneration: process.env.APPWRITE_AI_IMAGE_FUNCTION_ID || 'ai-image-generation',
    workflowExecutor: process.env.APPWRITE_WORKFLOW_EXECUTOR_FUNCTION_ID || 'workflow-executor',
    webhookHandler: process.env.APPWRITE_WEBHOOK_HANDLER_FUNCTION_ID || 'webhook-handler',
  },
} as const;

// Initialize Appwrite client
export const appwriteClient = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

// Initialize services
export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export const storage = new Storage(appwriteClient);
export const functions = new Functions(appwriteClient);
export const teams = new Teams(appwriteClient);

// Realtime is accessed directly through the client
export const realtime = appwriteClient;

// Server-side client (for API routes and server actions)
export const createServerClient = () => {
  const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId);
    
  // For server-side operations, we'll handle API key authentication 
  // in the individual API route handlers or use session-based auth
  return client;
};