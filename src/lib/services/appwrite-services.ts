import { databases, storage, functions, APPWRITE_CONFIG } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

// Workflow Management
export class WorkflowService {
  static async createWorkflow(userId: string, name: string, description: string = '') {
    try {
      const workflow = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workflows,
        ID.unique(),
        {
          name,
          description,
          userId,
          status: 'draft',
          blocks: [],
          connections: [],
          executionCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
      return workflow;
    } catch (error) {
      console.error('Failed to create workflow:', error);
      throw error;
    }
  }

  static async getUserWorkflows(userId: string) {
    try {
      const workflows = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workflows,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
      return workflows.documents;
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
      throw error;
    }
  }

  static async updateWorkflow(workflowId: string, updates: Partial<any>) {
    try {
      const workflow = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workflows,
        workflowId,
        {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      );
      return workflow;
    } catch (error) {
      console.error('Failed to update workflow:', error);
      throw error;
    }
  }

  static async deleteWorkflow(workflowId: string) {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workflows,
        workflowId
      );
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      throw error;
    }
  }

  static async duplicateWorkflow(workflowId: string, userId: string) {
    try {
      const original = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workflows,
        workflowId
      );

      const duplicate = await this.createWorkflow(
        userId,
        `${original.name} (Copy)`,
        original.description
      );

      // Copy blocks and connections
      await this.updateWorkflow(duplicate.$id, {
        blocks: original.blocks,
        connections: original.connections
      });

      return duplicate;
    } catch (error) {
      console.error('Failed to duplicate workflow:', error);
      throw error;
    }
  }
}

// Execution Management
export class ExecutionService {
  static async createExecution(workflowId: string, userId: string, input?: any) {
    try {
      const execution = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.executions,
        ID.unique(),
        {
          workflowId,
          userId,
          status: 'running',
          input: input || {},
          output: null,
          logs: [],
          startedAt: new Date().toISOString(),
          completedAt: null,
          error: null
        }
      );

      // Trigger workflow execution function
      const functionExecution = await functions.createExecution(
        APPWRITE_CONFIG.functions.workflowExecutor,
        JSON.stringify({
          executionId: execution.$id,
          workflowId,
          input
        })
      );

      return { execution, functionExecution };
    } catch (error) {
      console.error('Failed to create execution:', error);
      throw error;
    }
  }

  static async getWorkflowExecutions(workflowId: string) {
    try {
      const executions = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.executions,
        [
          Query.equal('workflowId', workflowId),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );
      return executions.documents;
    } catch (error) {
      console.error('Failed to fetch executions:', error);
      throw error;
    }
  }

  static async getUserExecutions(userId: string) {
    try {
      const executions = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.executions,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
      return executions.documents;
    } catch (error) {
      console.error('Failed to fetch user executions:', error);
      throw error;
    }
  }
}

// File Management
export class FileService {
  static async uploadFile(file: File, bucketId: string = APPWRITE_CONFIG.buckets.userUploads) {
    try {
      const uploadedFile = await storage.createFile(
        bucketId,
        ID.unique(),
        file
      );
      return uploadedFile;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  static async getFilePreview(fileId: string, bucketId: string = APPWRITE_CONFIG.buckets.userUploads) {
    try {
      const preview = storage.getFilePreview(bucketId, fileId, 300, 300);
      return preview;
    } catch (error) {
      console.error('Failed to get file preview:', error);
      throw error;
    }
  }

  static async downloadFile(fileId: string, bucketId: string = APPWRITE_CONFIG.buckets.userUploads) {
    try {
      const file = storage.getFileDownload(bucketId, fileId);
      return file;
    } catch (error) {
      console.error('Failed to download file:', error);
      throw error;
    }
  }

  static async deleteFile(fileId: string, bucketId: string = APPWRITE_CONFIG.buckets.userUploads) {
    try {
      await storage.deleteFile(bucketId, fileId);
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }
}

// AI Operations
export class AIService {
  static async processText(text: string, operation: 'summarize' | 'translate' | 'analyze', config?: any) {
    try {
      const result = await functions.createExecution(
        APPWRITE_CONFIG.functions.aiTextOperations,
        JSON.stringify({
          text,
          operation,
          config
        })
      );
      return JSON.parse(result.responseBody);
    } catch (error) {
      console.error('Failed to process text:', error);
      throw error;
    }
  }

  static async generateImage(prompt: string, config?: any) {
    try {
      const result = await functions.createExecution(
        APPWRITE_CONFIG.functions.aiImageGeneration,
        JSON.stringify({
          prompt,
          config: {
            width: 512,
            height: 512,
            steps: 20,
            ...config
          }
        })
      );
      return JSON.parse(result.responseBody);
    } catch (error) {
      console.error('Failed to generate image:', error);
      throw error;
    }
  }
}

// Analytics and Monitoring
export class AnalyticsService {
  static async getWorkflowStats(workflowId: string) {
    try {
      const executions = await this.getExecutionStats(workflowId);
      return {
        totalExecutions: executions.total,
        successfulExecutions: executions.successful,
        failedExecutions: executions.failed,
        averageExecutionTime: executions.averageTime,
        successRate: executions.total > 0 ? (executions.successful / executions.total) * 100 : 0
      };
    } catch (error) {
      console.error('Failed to get workflow stats:', error);
      throw error;
    }
  }

  static async getExecutionStats(workflowId: string) {
    try {
      const executions = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.executions,
        [
          Query.equal('workflowId', workflowId),
          Query.limit(1000)
        ]
      );

      const total = executions.documents.length;
      const successful = executions.documents.filter(e => e.status === 'completed').length;
      const failed = executions.documents.filter(e => e.status === 'failed').length;

      // Calculate average execution time
      const completedExecutions = executions.documents.filter(e => 
        e.status === 'completed' && e.startedAt && e.completedAt
      );
      
      const averageTime = completedExecutions.length > 0 
        ? completedExecutions.reduce((sum, e) => {
            const start = new Date(e.startedAt).getTime();
            const end = new Date(e.completedAt).getTime();
            return sum + (end - start);
          }, 0) / completedExecutions.length / 1000 // Convert to seconds
        : 0;

      return {
        total,
        successful,
        failed,
        averageTime
      };
    } catch (error) {
      console.error('Failed to get execution stats:', error);
      throw error;
    }
  }

  static async getUserStats(userId: string) {
    try {
      const workflows = await WorkflowService.getUserWorkflows(userId);
      const executions = await ExecutionService.getUserExecutions(userId);

      return {
        totalWorkflows: workflows.length,
        activeWorkflows: workflows.filter(w => w.status === 'active').length,
        totalExecutions: executions.length,
        recentExecutions: executions.slice(0, 10)
      };
    } catch (error) {
      console.error('Failed to get user stats:', error);
      throw error;
    }
  }
}