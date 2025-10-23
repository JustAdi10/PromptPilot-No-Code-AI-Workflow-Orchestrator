# 🚀 PromptPilot Deployment Guide

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Appwrite Cloud account or self-hosted instance
- OpenAI API key
- Git installed

### 1. Clone and Setup

```bash
git clone <repository-url> promptpilot
cd promptpilot

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### 2. Appwrite Setup

#### Create Appwrite Project
1. Visit [Appwrite Cloud](https://cloud.appwrite.io) or your self-hosted instance
2. Create a new project
3. Note your Project ID and API Endpoint
4. Generate an API key with full permissions

#### Configure Environment
Edit `.env.local` with your Appwrite credentials:

```env
# Appwrite Configuration
APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
APPWRITE_PROJECT_ID="your-project-id-here"
APPWRITE_API_KEY="your-api-key-here"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key-here"

# Public Environment Variables
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT_ID="your-project-id-here"
```

#### Setup Database and Collections
Run the database setup script:

```bash
node scripts/setup-database.js
```

This will create:
- Database: `promptpilot-db`
- Collections: `workflows`, `blocks`, `executions`, `execution-logs`
- Storage buckets: `generated-files`, `user-uploads`
- Default workflow blocks

### 3. Deploy Appwrite Functions

#### AI Text Operations Function
```bash
cd functions/ai-text-operations
zip -r ai-text-operations.zip .
```

In Appwrite Console:
1. Go to Functions > Create Function
2. Function ID: `ai-text-operations`
3. Runtime: Node.js 18
4. Upload the zip file
5. Add environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `APPWRITE_ENDPOINT`: Your Appwrite endpoint
   - `APPWRITE_PROJECT_ID`: Your project ID
   - `APPWRITE_API_KEY`: Your API key

#### Workflow Executor Function
```bash
cd ../workflow-executor
zip -r workflow-executor.zip .
```

Create function with ID: `workflow-executor` and same environment variables.

### 4. Configure Authentication

In Appwrite Console > Auth:
1. Enable Email/Password authentication
2. Configure allowed domains (add your deployment domain)
3. Set session length as needed

### 5. Deploy Frontend

#### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

#### Deploy to Netlify
```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
# Add environment variables in Netlify dashboard
```

#### Deploy to Other Platforms
The app is a standard Next.js application and can be deployed to:
- AWS Amplify
- Digital Ocean App Platform
- Railway
- Render
- Any platform supporting Node.js

### 6. Test the Demo Workflow

1. Access your deployed application
2. Sign up for a new account
3. Import the demo workflow from `demo/sample-workflow.json`
4. Configure the webhook URL (use webhook.site for testing)
5. Run the workflow and monitor execution

## 🛠️ Development Setup

### Local Development
```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Database Development
```bash
# Reset database (careful - deletes all data!)
node scripts/setup-database.js

# Seed sample data
node scripts/seed-data.js
```

### Function Development
```bash
# Test functions locally
cd functions/ai-text-operations
node src/main.js

# Or use Appwrite CLI for local function development
appwrite functions createDeployment --functionId=ai-text-operations
```

## 🎯 Hackathon Demo Script

### 2-Minute Demo Flow

1. **Landing Page** (15 seconds)
   - Show PromptPilot homepage
   - Highlight "Visual AI Workflow Builder"

2. **Workflow Builder** (45 seconds)
   - Open workflow builder
   - Drag AI blocks from library
   - Connect blocks with edges
   - Show real-time property editing

3. **Workflow Execution** (45 seconds)
   - Run the demo RSS workflow
   - Show real-time execution with glowing nodes
   - Display execution logs
   - Show webhook notification received

4. **Results & Wrap-up** (15 seconds)
   - Show generated summary and image
   - Mention Appwrite integration depth
   - Call to action

### Key Talking Points
- "No-code AI automation platform"
- "Powered entirely by Appwrite services"
- "Real-time execution with visual feedback"
- "Extensible block library"
- "Production-ready architecture"

## 📦 Production Considerations

### Security
- Enable rate limiting
- Configure CORS properly
- Use secure API keys storage
- Implement proper user permissions

### Performance
- Enable function warming
- Optimize database queries
- Implement caching strategy
- Monitor execution times

### Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor Appwrite usage limits
- Track workflow execution metrics
- Set up alerts for failures

### Scaling
- Consider function concurrency limits
- Plan for database growth
- Implement workflow queuing
- Monitor storage usage

## 🆘 Troubleshooting

### Common Issues

#### "Cannot connect to Appwrite"
- Check endpoint URL and project ID
- Verify API key permissions
- Ensure CORS is configured

#### "Function execution failed"
- Check function logs in Appwrite console
- Verify environment variables
- Test function locally

#### "Database permission denied"
- Check collection permissions
- Verify user authentication
- Update security rules

#### "OpenAI API errors"
- Check API key validity
- Monitor usage limits
- Verify model availability

### Getting Help
- GitHub Issues: [Repository Issues](link-to-issues)
- Appwrite Discord: [Join Community](https://appwrite.io/discord)
- Documentation: [Appwrite Docs](https://appwrite.io/docs)

## 🏆 Hackathon Submission Checklist

- [ ] Appwrite project configured
- [ ] Database and collections created
- [ ] Functions deployed and working
- [ ] Frontend deployed publicly
- [ ] Demo workflow tested
- [ ] Environment variables secured
- [ ] Documentation complete
- [ ] Demo video recorded (optional)

## 🎉 Success!

Your PromptPilot instance should now be live and ready for the hackathon demo!

Access your app at: `https://your-deployment-url.com`

---

**Happy Hacking!** 🧩✨