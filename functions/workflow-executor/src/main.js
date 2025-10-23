const { Client, Databases, Functions, Realtime, Storage } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const functions = new Functions(client);
const realtime = new Realtime(client);
const storage = new Storage(client);

// Configuration
const config = {
  databaseId: process.env.APPWRITE_DATABASE_ID || 'promptpilot-db',
  collections: {
    workflows: 'workflows',
    executions: 'executions',
    executionLogs: 'execution-logs',
  },
  functions: {
    aiTextOperations: process.env.APPWRITE_AI_TEXT_FUNCTION_ID || 'ai-text-operations',
    aiImageGeneration: process.env.APPWRITE_AI_IMAGE_FUNCTION_ID || 'ai-image-generation',
  },
};

// Workflow Execution Engine
class WorkflowExecutor {
  constructor(workflowId, executionId, userId) {
    this.workflowId = workflowId;
    this.executionId = executionId;
    this.userId = userId;
    this.nodeResults = new Map();
    this.executionContext = {
      startTime: new Date(),
      variables: {},
    };
  }

  async execute() {
    try {
      await this.logInfo('Workflow execution started');
      
      // Get workflow definition
      const workflow = await this.getWorkflow();
      const { nodes, edges } = workflow;

      // Update execution status
      await this.updateExecutionStatus('running', {
        totalNodes: nodes.length,
        completedNodes: 0,
        failedNodes: 0,
      });

      // Find starting nodes (nodes with no incoming edges)
      const startingNodes = this.findStartingNodes(nodes, edges);
      
      if (startingNodes.length === 0) {
        throw new Error('No starting nodes found in workflow');
      }

      // Execute workflow using topological sort
      const executionOrder = this.getExecutionOrder(nodes, edges);
      let completedNodes = 0;
      let failedNodes = 0;

      for (const nodeId of executionOrder) {
        try {
          await this.logInfo(`Executing node: ${nodeId}`);
          
          // Broadcast current node execution
          await this.broadcastNodeExecution(nodeId, 'started');
          
          // Execute the node
          const result = await this.executeNode(nodeId, nodes, edges);
          this.nodeResults.set(nodeId, result);
          
          completedNodes++;
          
          // Update execution progress
          await this.updateExecutionStatus('running', {
            completedNodes,
            failedNodes,
            currentNode: nodeId,
          });

          await this.broadcastNodeExecution(nodeId, 'completed', result);
          await this.logInfo(`Node ${nodeId} completed successfully`);

        } catch (error) {
          failedNodes++;
          await this.logError(`Node ${nodeId} failed: ${error.message}`);
          await this.broadcastNodeExecution(nodeId, 'failed', null, error);
          
          // For now, stop execution on first error
          // In the future, we could implement error handling strategies
          throw error;
        }
      }

      // Collect final results
      const results = {};
      this.nodeResults.forEach((value, key) => {
        results[key] = value;
      });

      // Update execution status to completed
      await this.updateExecutionStatus('completed', {
        completedNodes,
        failedNodes,
        results,
      });

      await this.logInfo('Workflow execution completed successfully');
      return results;

    } catch (error) {
      await this.logError(`Workflow execution failed: ${error.message}`);
      await this.updateExecutionStatus('failed', { error: error.message });
      throw error;
    }
  }

  async executeNode(nodeId, nodes, edges) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    const { data } = node;
    const { blockType, config = {} } = data;

    // Prepare inputs from previous nodes
    const inputs = await this.prepareNodeInputs(nodeId, edges);

    switch (blockType) {
      case 'trigger':
        return this.executeTriggerNode(node, inputs);
      
      case 'ai-text':
        return this.executeAITextNode(node, inputs, config);
      
      case 'ai-image':
        return this.executeAIImageNode(node, inputs, config);
      
      case 'webhook':
        return this.executeWebhookNode(node, inputs, config);
      
      case 'action':
        return this.executeActionNode(node, inputs, config);
      
      case 'condition':
        return this.executeConditionNode(node, inputs, config);
      
      case 'delay':
        return this.executeDelayNode(node, inputs, config);
      
      case 'loop':
        return this.executeLoopNode(node, inputs, config);
      
      default:
        throw new Error(`Unsupported block type: ${blockType}`);
    }
  }

  async executeTriggerNode(node, inputs) {
    return {
      triggeredAt: new Date().toISOString(),
      userId: this.userId,
      executionId: this.executionId,
    };
  }

  async executeAITextNode(node, inputs, config) {
    const { operation = 'summarize', text } = inputs;
    const inputText = text || inputs.input || '';

    if (!inputText) {
      throw new Error('No text input provided for AI text operation');
    }

    const payload = {
      operation,
      input: inputText,
      config: {
        model: config.model || 'gpt-3.5-turbo',
        maxTokens: config.maxTokens || 1000,
        temperature: config.temperature || 0.7,
        ...config,
      },
    };

    const response = await functions.createExecution(
      config.functions.aiTextOperations,
      JSON.stringify(payload)
    );

    if (!response.responseStatusCode || response.responseStatusCode >= 400) {
      throw new Error(`AI text operation failed: ${response.stderr || 'Unknown error'}`);
    }

    const result = JSON.parse(response.stdout || '{}');
    
    if (!result.success) {
      throw new Error(result.error || 'AI text operation failed');
    }

    return result.result;
  }

  async executeWebhookNode(node, inputs, config) {
    const {
      url,
      method = 'POST',
      headers = {},
      timeout = 30000,
    } = config;

    if (!url) {
      throw new Error('Webhook URL is required');
    }

    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: method !== 'GET' ? JSON.stringify(inputs) : undefined,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.text();
      let parsedData;

      try {
        parsedData = JSON.parse(responseData);
      } catch {
        parsedData = responseData;
      }

      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: parsedData,
        success: response.ok,
      };

    } catch (error) {
      clearTimeout(timeoutId);
      throw new Error(`Webhook request failed: ${error.message}`);
    }
  }

  async executeDelayNode(node, inputs, config) {
    const { duration = 60, unit = 'seconds' } = config;
    
    let delayMs;
    switch (unit) {
      case 'milliseconds':
        delayMs = duration;
        break;
      case 'seconds':
        delayMs = duration * 1000;
        break;
      case 'minutes':
        delayMs = duration * 60 * 1000;
        break;
      case 'hours':
        delayMs = duration * 60 * 60 * 1000;
        break;
      default:
        throw new Error(`Unsupported delay unit: ${unit}`);
    }

    await new Promise(resolve => setTimeout(resolve, delayMs));

    return {
      delayed: true,
      duration,
      unit,
      delayedUntil: new Date(Date.now() + delayMs).toISOString(),
    };
  }

  // Helper methods
  async prepareNodeInputs(nodeId, edges) {
    const inputs = {};
    
    // Find incoming edges to this node
    const incomingEdges = edges.filter(edge => edge.target === nodeId);
    
    for (const edge of incomingEdges) {
      const sourceResult = this.nodeResults.get(edge.source);
      if (sourceResult) {
        // Merge results from source nodes
        Object.assign(inputs, sourceResult);
      }
    }

    return inputs;
  }

  findStartingNodes(nodes, edges) {
    const nodesWithIncoming = new Set(edges.map(edge => edge.target));
    return nodes.filter(node => !nodesWithIncoming.has(node.id));
  }

  getExecutionOrder(nodes, edges) {
    // Simple topological sort implementation
    const visited = new Set();
    const visiting = new Set();
    const result = [];

    const visit = (nodeId) => {
      if (visiting.has(nodeId)) {
        throw new Error('Circular dependency detected in workflow');
      }
      if (visited.has(nodeId)) {
        return;
      }

      visiting.add(nodeId);

      // Visit all nodes that this node depends on
      const dependencies = edges
        .filter(edge => edge.target === nodeId)
        .map(edge => edge.source);

      for (const depId of dependencies) {
        visit(depId);
      }

      visiting.delete(nodeId);
      visited.add(nodeId);
      result.push(nodeId);
    };

    for (const node of nodes) {
      visit(node.id);
    }

    return result;
  }

  async getWorkflow() {
    const workflow = await databases.getDocument(
      config.databaseId,
      config.collections.workflows,
      this.workflowId
    );

    return {
      ...workflow,
      nodes: JSON.parse(workflow.nodes || '[]'),
      edges: JSON.parse(workflow.edges || '[]'),
    };
  }

  async updateExecutionStatus(status, data = {}) {
    await databases.updateDocument(
      config.databaseId,
      config.collections.executions,
      this.executionId,
      {
        status,
        ...data,
        updatedAt: new Date().toISOString(),
      }
    );

    // Broadcast execution update
    await this.broadcastExecutionUpdate(status, data);
  }

  async broadcastExecutionUpdate(status, data) {
    const event = {
      type: 'execution.progress',
      executionId: this.executionId,
      status,
      ...data,
      timestamp: new Date().toISOString(),
    };

    // In a real implementation, use Appwrite Realtime to broadcast
    console.log('Broadcasting execution update:', event);
  }

  async broadcastNodeExecution(nodeId, type, result = null, error = null) {
    const event = {
      type: `node.${type}`,
      executionId: this.executionId,
      nodeId,
      result,
      error: error ? { message: error.message, stack: error.stack } : null,
      timestamp: new Date().toISOString(),
    };

    console.log('Broadcasting node execution:', event);
  }

  async logInfo(message) {
    await this.createLog('info', message);
  }

  async logError(message, data = null) {
    await this.createLog('error', message, data);
  }

  async createLog(level, message, data = null) {
    try {
      await databases.createDocument(
        config.databaseId,
        config.collections.executionLogs,
        'unique()',
        {
          executionId: this.executionId,
          nodeId: 'workflow',
          level,
          message,
          data: data ? JSON.stringify(data) : null,
          timestamp: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Failed to create log:', error);
    }
  }
}

// Main function handler
export default async ({ req, res, log, error }) => {
  log('Workflow executor function started');

  try {
    const requestData = JSON.parse(req.body || '{}');
    const { workflowId, executionId, userId } = requestData;

    if (!workflowId || !executionId || !userId) {
      throw new Error('Missing required fields: workflowId, executionId, userId');
    }

    log(`Executing workflow ${workflowId} for user ${userId}`);

    const executor = new WorkflowExecutor(workflowId, executionId, userId);
    const results = await executor.execute();

    return res.json({
      success: true,
      executionId,
      results,
      completedAt: new Date().toISOString(),
    });

  } catch (err) {
    error('Workflow execution error:', err);
    
    return res.json({
      success: false,
      error: err.message || 'Internal server error',
    }, 500);
  }
};