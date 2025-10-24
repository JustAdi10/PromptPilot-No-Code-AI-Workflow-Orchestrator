#!/bin/bash

# PromptPilot Deployment Script
# This script sets up the complete Appwrite backend for PromptPilot

set -e  # Exit on any error

echo "🚀 Starting PromptPilot Appwrite Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${APPWRITE_PROJECT_ID:-""}
ENDPOINT=${APPWRITE_ENDPOINT:-"https://cloud.appwrite.io/v1"}
DATABASE_ID="promptpilot-db"

# Check if appwrite CLI is installed
if ! command -v appwrite &> /dev/null; then
    echo -e "${RED}❌ Appwrite CLI is not installed. Please install it first:${NC}"
    echo "npm install -g appwrite-cli"
    exit 1
fi

# Check if project ID is set
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠️  APPWRITE_PROJECT_ID not set. Please set it in your environment:${NC}"
    echo "export APPWRITE_PROJECT_ID=your-project-id"
    exit 1
fi

echo -e "${GREEN}✅ Using Project ID: $PROJECT_ID${NC}"

# Login to Appwrite (if not already logged in)
echo "🔐 Checking Appwrite authentication..."
if ! appwrite account get &> /dev/null; then
    echo "Please login to Appwrite:"
    appwrite login
fi

# Set project context
echo "🔧 Setting project context..."
appwrite client setProject $PROJECT_ID
appwrite client setEndpoint $ENDPOINT

# Create database
echo "🗄️  Creating database..."
appwrite databases create \
    --databaseId $DATABASE_ID \
    --name "PromptPilot Database" || echo "Database already exists"

# Create collections
echo "📚 Creating collections..."

# Workflows Collection
echo "  Creating workflows collection..."
appwrite databases createCollection \
    --databaseId $DATABASE_ID \
    --collectionId workflows \
    --name "Workflows" \
    --documentSecurity true || echo "Workflows collection already exists"

# Add attributes to workflows
appwrite databases createStringAttribute \
    --databaseId $DATABASE_ID \
    --collectionId workflows \
    --key name \
    --size 255 \
    --required true || true

appwrite databases createStringAttribute \
    --databaseId $DATABASE_ID \
    --collectionId workflows \
    --key description \
    --size 1000 \
    --required false || true

appwrite databases createStringAttribute \
    --databaseId $DATABASE_ID \
    --collectionId workflows \
    --key userId \
    --size 255 \
    --required true || true

appwrite databases createEnumAttribute \
    --databaseId $DATABASE_ID \
    --collectionId workflows \
    --key status \
    --elements "draft,active,paused" \
    --required true \
    --default "draft" || true

# Executions Collection  
echo "  Creating executions collection..."
appwrite databases createCollection \
    --databaseId $DATABASE_ID \
    --collectionId executions \
    --name "Executions" \
    --documentSecurity true || echo "Executions collection already exists"

# Add attributes to executions
appwrite databases createStringAttribute \
    --databaseId $DATABASE_ID \
    --collectionId executions \
    --key workflowId \
    --size 255 \
    --required true || true

appwrite databases createStringAttribute \
    --databaseId $DATABASE_ID \
    --collectionId executions \
    --key userId \
    --size 255 \
    --required true || true

appwrite databases createEnumAttribute \
    --databaseId $DATABASE_ID \
    --collectionId executions \
    --key status \
    --elements "running,completed,failed" \
    --required true \
    --default "running" || true

# Blocks Collection
echo "  Creating blocks collection..."
appwrite databases createCollection \
    --databaseId $DATABASE_ID \
    --collectionId blocks \
    --name "Blocks" \
    --documentSecurity true || echo "Blocks collection already exists"

# Add attributes to blocks
appwrite databases createStringAttribute \
    --databaseId $DATABASE_ID \
    --collectionId blocks \
    --key name \
    --size 255 \
    --required true || true

appwrite databases createStringAttribute \
    --databaseId $DATABASE_ID \
    --collectionId blocks \
    --key type \
    --size 100 \
    --required true || true

appwrite databases createStringAttribute \
    --databaseId $DATABASE_ID \
    --collectionId blocks \
    --key description \
    --size 1000 \
    --required false || true

# Create storage buckets
echo "🗂️  Creating storage buckets..."

appwrite storage createBucket \
    --bucketId user-uploads \
    --name "User Uploads" \
    --fileSecurity true \
    --enabled true \
    --maximumFileSize 10485760 \
    --allowedFileExtensions "jpg,jpeg,png,gif,pdf,txt,csv,json" || echo "User uploads bucket already exists"

appwrite storage createBucket \
    --bucketId generated-files \
    --name "Generated Files" \
    --fileSecurity true \
    --enabled true \
    --maximumFileSize 52428800 \
    --allowedFileExtensions "jpg,jpeg,png,gif,pdf,txt,csv,json,mp4,mp3" || echo "Generated files bucket already exists"

# Create functions
echo "⚙️  Creating and deploying functions..."

# Workflow Executor Function
echo "  Deploying workflow-executor function..."
cd functions/workflow-executor

appwrite functions create \
    --functionId workflow-executor \
    --name "Workflow Executor" \
    --runtime "node-18.0" \
    --execute "users" \
    --timeout 300 || echo "Workflow executor function already exists"

npm install

appwrite functions createDeployment \
    --functionId workflow-executor \
    --code . \
    --activate true

# AI Text Operations Function
echo "  Deploying ai-text-operations function..."
cd ../ai-text-operations

appwrite functions create \
    --functionId ai-text-operations \
    --name "AI Text Operations" \
    --runtime "node-18.0" \
    --execute "users" \
    --timeout 120 || echo "AI text operations function already exists"

npm install

appwrite functions createDeployment \
    --functionId ai-text-operations \
    --code . \
    --activate true

cd ../..

# Set up environment variables for functions
echo "🔐 Setting up function environment variables..."

if [ -n "$OPENAI_API_KEY" ]; then
    appwrite functions createVariable \
        --functionId workflow-executor \
        --key OPENAI_API_KEY \
        --value "$OPENAI_API_KEY" || true

    appwrite functions createVariable \
        --functionId ai-text-operations \
        --key OPENAI_API_KEY \
        --value "$OPENAI_API_KEY" || true
    
    echo -e "${GREEN}✅ OpenAI API key configured${NC}"
else
    echo -e "${YELLOW}⚠️  OPENAI_API_KEY not set. Please set it manually in Appwrite Console${NC}"
fi

appwrite functions createVariable \
    --functionId workflow-executor \
    --key DATABASE_ID \
    --value "$DATABASE_ID" || true

appwrite functions createVariable \
    --functionId ai-text-operations \
    --key DATABASE_ID \
    --value "$DATABASE_ID" || true

# Create indexes for better performance
echo "📊 Creating database indexes..."

appwrite databases createIndex \
    --databaseId $DATABASE_ID \
    --collectionId workflows \
    --key userId_index \
    --type key \
    --attributes userId || true

appwrite databases createIndex \
    --databaseId $DATABASE_ID \
    --collectionId executions \
    --key workflowId_index \
    --type key \
    --attributes workflowId || true

appwrite databases createIndex \
    --databaseId $DATABASE_ID \
    --collectionId executions \
    --key userId_index \
    --type key \
    --attributes userId || true

# Enable realtime
echo "⚡ Enabling realtime for collections..."
# Note: Realtime is typically enabled by default, but you can configure it in the console

echo -e "${GREEN}🎉 PromptPilot Appwrite setup completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Update your .env.local file with the project configuration"
echo "2. Set up collection permissions in Appwrite Console"
echo "3. Configure authentication providers if needed"
echo "4. Test the application by running: npm run dev"
echo ""
echo "Dashboard: https://cloud.appwrite.io/console/project-${PROJECT_ID}"