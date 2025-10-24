# Appwrite Setup Guide for PromptPilot

This guide will help you set up Appwrite backend services for PromptPilot.

## Prerequisites

1. [Appwrite Cloud Account](https://cloud.appwrite.io) or self-hosted Appwrite instance
2. Node.js 18+ for Appwrite Functions

## Step 1: Create Appwrite Project

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Click "Create Project"
3. Name your project "PromptPilot"
4. Copy the Project ID

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Update the following variables:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id-here
```

## Step 3: Set up Authentication

1. Go to "Auth" in your Appwrite console
2. Enable "Email/Password" provider
3. Configure settings:
   - Session length: 365 days
   - Password policy: Minimum 8 characters
   - Enable email confirmation (optional)

## Step 4: Create Database and Collections

### Database
- Database ID: `promptpilot-db`

### Collections

#### 1. Workflows Collection
- Collection ID: `workflows`
- Attributes:
  ```
  name (string, required) - Workflow name
  description (string) - Workflow description  
  userId (string, required) - Owner user ID
  status (enum: draft, active, paused) - Workflow status
  blocks (json) - Workflow blocks/nodes
  connections (json) - Node connections
  executionCount (integer, default: 0) - Number of executions
  createdAt (datetime) - Creation timestamp
  updatedAt (datetime) - Last update timestamp
  ```

#### 2. Executions Collection
- Collection ID: `executions`
- Attributes:
  ```
  workflowId (string, required) - Reference to workflow
  userId (string, required) - User who executed
  status (enum: running, completed, failed) - Execution status
  input (json) - Input data
  output (json) - Output data
  logs (json) - Execution logs
  startedAt (datetime) - Start time
  completedAt (datetime) - Completion time
  error (string) - Error message if failed
  ```

#### 3. Blocks Collection (Optional - for templates)
- Collection ID: `blocks`
- Attributes:
  ```
  name (string, required) - Block name
  type (string, required) - Block type
  description (string) - Block description
  config (json) - Default configuration
  category (string) - Block category
  isTemplate (boolean) - Is template block
  ```

### Indexes
Create indexes for better performance:
- `workflows`: userId (ascending)
- `executions`: workflowId (ascending), userId (ascending)
- `blocks`: type (ascending), category (ascending)

### Permissions
Set up permissions for each collection:

**Workflows:**
- Read: `user:USER_ID` (users can read their own workflows)
- Create: `user:USER_ID` (authenticated users can create)
- Update: `user:USER_ID` (users can update their own workflows)
- Delete: `user:USER_ID` (users can delete their own workflows)

**Executions:**
- Read: `user:USER_ID` (users can read their own executions)
- Create: `user:USER_ID` (authenticated users can create)
- Update: `user:USER_ID` (users can update their own executions)
- Delete: `user:USER_ID` (users can delete their own executions)

## Step 5: Set up Storage

### Buckets

#### 1. User Uploads Bucket
- Bucket ID: `user-uploads`
- File size limit: 10MB
- Allowed file types: `jpg,jpeg,png,gif,pdf,txt,csv,json`
- Permissions:
  - Read: `user:USER_ID`
  - Create: `user:USER_ID`
  - Update: `user:USER_ID`
  - Delete: `user:USER_ID`

#### 2. Generated Files Bucket
- Bucket ID: `generated-files`
- File size limit: 50MB
- Allowed file types: `jpg,jpeg,png,gif,pdf,txt,csv,json,mp4,mp3`
- Permissions:
  - Read: `user:USER_ID`
  - Create: `user:USER_ID`
  - Update: `user:USER_ID`
  - Delete: `user:USER_ID`

## Step 6: Deploy Appwrite Functions

### 1. Workflow Executor Function

```bash
cd functions/workflow-executor
npm install
appwrite functions createDeployment \
  --functionId workflow-executor \
  --code . \
  --activate true
```

### 2. AI Text Operations Function

```bash  
cd functions/ai-text-operations
npm install
appwrite functions createDeployment \
  --functionId ai-text-operations \
  --code . \
  --activate true
```

### Environment Variables for Functions
Add these to each function:
- `OPENAI_API_KEY`: Your OpenAI API key
- `HUGGINGFACE_API_KEY`: Your Hugging Face API key

### Function Permissions
- Execute: `users` (any authenticated user)

## Step 7: Configure Realtime

Enable realtime for collections:
1. Go to "Database" > "Settings" 
2. Enable "Realtime" for:
   - `workflows` collection
   - `executions` collection

## Step 8: Test the Setup

1. Start your Next.js application:
   ```bash
   npm run dev
   ```

2. Register a new account
3. Create a test workflow
4. Verify data appears in Appwrite console

## Production Deployment

### Security Checklist

1. **API Keys**: Never expose API keys in client-side code
2. **Permissions**: Review and tighten collection permissions
3. **Rate Limits**: Configure appropriate rate limits
4. **CORS**: Configure CORS for your production domain
5. **Webhooks**: Set up webhooks for important events

### Environment Variables for Production

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-prod-project-id
# ... other variables with production values
```

### Monitoring

1. Enable logging for all functions
2. Set up alerts for failed executions
3. Monitor database performance
4. Track storage usage

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Check project ID and endpoint
2. **Permission Denied**: Verify collection permissions
3. **Function Timeout**: Increase function timeout in settings
4. **Rate Limited**: Check and adjust rate limits

### Debug Mode

Enable debug logging by setting:
```env
APPWRITE_DEBUG=true
```

## Support

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord](https://discord.gg/GSeTUeA)
- [GitHub Issues](https://github.com/appwrite/appwrite/issues)