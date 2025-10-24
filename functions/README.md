# PromptPilot Functions

This directory contains Appwrite Cloud Functions for PromptPilot workflow execution.

## Functions Overview

### 1. workflow-executor
Executes complete workflows by processing blocks in sequence and managing execution state.

**Endpoint**: `/functions/workflow-executor`

**Parameters**:
```json
{
  "workflowId": "string",
  "userId": "string", 
  "input": "object"
}
```

**Response**:
```json
{
  "success": true,
  "executionId": "string",
  "output": "object"
}
```

### 2. ai-text-operations
Handles AI-powered text operations like generation, summarization, translation, and analysis.

**Endpoint**: `/functions/ai-text-operations`

**Parameters**:
```json
{
  "operation": "generate|summarize|translate|analyze|extract",
  "text": "string",
  "prompt": "string",
  "model": "gpt-3.5-turbo",
  "targetLanguage": "English",
  "extractType": "keywords"
}
```

**Response**:
```json
{
  "success": true,
  "result": "object",
  "operation": "string"
}
```

## Deployment

### Prerequisites

1. Appwrite CLI installed: `npm install -g appwrite-cli`
2. Appwrite project configured
3. Environment variables set

### Environment Variables

Both functions require these environment variables:

```env
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-key (optional)
DATABASE_ID=promptpilot-db
```

### Deploy workflow-executor

```bash
cd functions/workflow-executor
npm install

appwrite functions create \
  --functionId workflow-executor \
  --name "Workflow Executor" \
  --runtime node-18.0 \
  --execute users

appwrite functions createDeployment \
  --functionId workflow-executor \
  --code . \
  --activate true
```

### Deploy ai-text-operations

```bash
cd functions/ai-text-operations
npm install

appwrite functions create \
  --functionId ai-text-operations \
  --name "AI Text Operations" \
  --runtime node-18.0 \
  --execute users

appwrite functions createDeployment \
  --functionId ai-text-operations \
  --code . \
  --activate true
```

### Set Environment Variables

```bash
appwrite functions updateVariable \
  --functionId workflow-executor \
  --key OPENAI_API_KEY \
  --value your-openai-api-key

appwrite functions updateVariable \
  --functionId ai-text-operations \
  --key OPENAI_API_KEY \
  --value your-openai-api-key
```

## Usage Examples

### Execute a Workflow

```javascript
import { Functions } from 'appwrite';

const functions = new Functions(client);

const execution = await functions.createExecution(
  'workflow-executor',
  JSON.stringify({
    workflowId: '64f...',
    userId: user.$id,
    input: { text: 'Hello world' }
  })
);

console.log(JSON.parse(execution.response));
```

### Generate Text with AI

```javascript
const result = await functions.createExecution(
  'ai-text-operations',
  JSON.stringify({
    operation: 'generate',
    prompt: 'Write a professional email about...',
    model: 'gpt-3.5-turbo'
  })
);

console.log(JSON.parse(result.response));
```

### Summarize Text

```javascript
const result = await functions.createExecution(
  'ai-text-operations',
  JSON.stringify({
    operation: 'summarize',
    text: 'Long article text here...'
  })
);

console.log(JSON.parse(result.response));
```

## Monitoring

### Function Logs

View logs in Appwrite Console:
1. Go to Functions
2. Select function
3. Click "Executions" tab
4. View individual execution logs

### Error Handling

Functions return structured error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Performance Monitoring

- Monitor execution time in Appwrite Console
- Set up alerts for failed executions
- Track usage and costs

## Development

### Local Testing

Use Appwrite CLI to test functions locally:

```bash
appwrite functions create-execution \
  --functionId workflow-executor \
  --data '{"workflowId":"test","userId":"test"}'
```

### Adding New Operations

To add new AI operations:

1. Add case to switch statement in `ai-text-operations/src/main.js`
2. Implement operation function
3. Update documentation
4. Redeploy function

### Block Types

Supported workflow block types:
- `trigger`: Workflow entry point
- `text-input`: Static text input
- `ai-text`: AI-powered text generation
- `condition`: Conditional logic
- `loop`: Iterate over arrays
- `output`: Workflow result

## Security

### API Keys

- Store API keys as function environment variables
- Never expose keys in client code
- Rotate keys regularly

### Permissions

- Functions execute with elevated permissions
- Validate user ownership of resources
- Implement rate limiting if needed

### Input Validation

- Validate all function inputs
- Sanitize user-provided data
- Use type checking for parameters