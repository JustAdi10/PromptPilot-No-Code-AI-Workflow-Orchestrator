#!/usr/bin/env node

/**
 * PromptPilot Database Setup Script
 * 
 * This script sets up the Appwrite database, collections, and storage buckets
 * required for PromptPilot to function properly.
 */

// Load environment variables
require('dotenv').config();

const { Client, Databases, Storage, Permission, Role, IndexType } = require('node-appwrite');

// Configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '',
  apiKey: process.env.APPWRITE_API_KEY || '',
  databaseId: process.env.APPWRITE_DATABASE_ID || 'promptpilot-db',
};

// Initialize client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

// Collection schemas (simplified to respect Appwrite limits)
const collections = {
  workflows: {
    id: 'workflows',
    name: 'Workflows',
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 1000, required: false },
      { key: 'owner', type: 'string', size: 36, required: true },
      { key: 'data', type: 'string', size: 65535, required: true }, // Combined workflow data as JSON
      { key: 'status', type: 'enum', elements: ['draft', 'active', 'archived'], required: true },
      { key: 'isPublic', type: 'boolean', required: true },
    ],
    indexes: [
      { key: 'owner_idx', type: IndexType.Key, attributes: ['owner'] },
      { key: 'team_idx', type: IndexType.Key, attributes: ['team'] },
      { key: 'status_idx', type: IndexType.Key, attributes: ['status'] },
      { key: 'public_idx', type: IndexType.Key, attributes: ['isPublic'] },
    ],
    permissions: [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
  },

  blocks: {
    id: 'blocks',
    name: 'Blocks',
    attributes: [
      { key: 'type', type: 'enum', elements: ['trigger', 'ai-text', 'ai-image', 'webhook', 'action', 'condition'], required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'category', type: 'string', size: 100, required: true },
      { key: 'config', type: 'string', size: 10000, required: true }, // Combined config as JSON
      { key: 'isCustom', type: 'boolean', required: true },
    ],
    indexes: [
      { key: 'type_idx', type: IndexType.Key, attributes: ['type'] },
      { key: 'category_idx', type: IndexType.Key, attributes: ['category'] },
      { key: 'owner_idx', type: IndexType.Key, attributes: ['owner'] },
      { key: 'custom_idx', type: IndexType.Key, attributes: ['isCustom'] },
    ],
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
  },

  executions: {
    id: 'executions',
    name: 'Executions',
    attributes: [
      { key: 'workflowId', type: 'string', size: 36, required: true },
      { key: 'status', type: 'enum', elements: ['queued', 'running', 'completed', 'failed'], required: true },
      { key: 'startedAt', type: 'datetime', required: true },
      { key: 'completedAt', type: 'datetime', required: false },
      { key: 'results', type: 'string', size: 65535, required: false }, // JSON with all execution data
    ],
    indexes: [
      { key: 'workflow_idx', type: IndexType.Key, attributes: ['workflowId'] },
      { key: 'status_idx', type: IndexType.Key, attributes: ['status'] },
      { key: 'trigger_idx', type: IndexType.Key, attributes: ['trigger'] },
      { key: 'started_idx', type: IndexType.Key, attributes: ['startedAt'], orders: ['DESC'] },
    ],
    permissions: [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
  },

  executionLogs: {
    id: 'execution-logs',
    name: 'Execution Logs',
    attributes: [
      { key: 'executionId', type: 'string', size: 36, required: true },
      { key: 'level', type: 'enum', elements: ['info', 'warn', 'error'], required: true },
      { key: 'message', type: 'string', size: 2000, required: true },
      { key: 'timestamp', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'execution_idx', type: IndexType.Key, attributes: ['executionId'] },
      { key: 'node_idx', type: IndexType.Key, attributes: ['nodeId'] },
      { key: 'level_idx', type: IndexType.Key, attributes: ['level'] },
      { key: 'timestamp_idx', type: IndexType.Key, attributes: ['timestamp'], orders: ['DESC'] },
    ],
    permissions: [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
  },
};

// Storage buckets
const buckets = {
  generatedFiles: {
    id: 'generated-files',
    name: 'Generated Files',
    permissions: [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    fileSecurity: true,
    enabled: true,
    maximumFileSize: 50000000, // 50MB
    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'txt', 'json', 'csv'],
    compression: 'gzip',
    encryption: true,
    antivirus: true,
  },

  userUploads: {
    id: 'user-uploads',
    name: 'User Uploads',
    permissions: [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    fileSecurity: true,
    enabled: true,
    maximumFileSize: 10000000, // 10MB
    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'txt', 'csv', 'json'],
    compression: 'gzip',
    encryption: true,
    antivirus: true,
  },
};

async function setupDatabase() {
  try {
    console.log('🚀 Starting PromptPilot database setup...');

    // Create database
    console.log('📦 Creating database...');
    try {
      await databases.create(config.databaseId, 'PromptPilot Database');
      console.log('✅ Database created successfully');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Database already exists');
      } else {
        throw error;
      }
    }

    // Create collections
    console.log('📋 Creating collections...');
    for (const [key, collection] of Object.entries(collections)) {
      try {
        await databases.createCollection(
          config.databaseId,
          collection.id,
          collection.name,
          collection.permissions
        );
        console.log(`✅ Collection "${collection.name}" created`);

        // Create attributes
        for (const attr of collection.attributes) {
          if (attr.type === 'string') {
            await databases.createStringAttribute(
              config.databaseId,
              collection.id,
              attr.key,
              attr.size,
              attr.required
            );
          } else if (attr.type === 'integer') {
            await databases.createIntegerAttribute(
              config.databaseId,
              collection.id,
              attr.key,
              attr.required
            );
          } else if (attr.type === 'boolean') {
            await databases.createBooleanAttribute(
              config.databaseId,
              collection.id,
              attr.key,
              attr.required
            );
          } else if (attr.type === 'datetime') {
            await databases.createDatetimeAttribute(
              config.databaseId,
              collection.id,
              attr.key,
              attr.required
            );
          } else if (attr.type === 'enum') {
            await databases.createEnumAttribute(
              config.databaseId,
              collection.id,
              attr.key,
              attr.elements,
              attr.required
            );
          }
        }

        // Wait a bit for attributes to be created
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create indexes
        for (const index of collection.indexes) {
          await databases.createIndex(
            config.databaseId,
            collection.id,
            index.key,
            index.type,
            index.attributes,
            index.orders
          );
        }

        console.log(`✅ Attributes and indexes created for "${collection.name}"`);

      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Collection "${collection.name}" already exists`);
        } else {
          console.error(`❌ Error creating collection "${collection.name}":`, error);
        }
      }
    }

    // Create storage buckets
    console.log('🪣 Creating storage buckets...');
    for (const [key, bucket] of Object.entries(buckets)) {
      try {
        await storage.createBucket(
          bucket.id,
          bucket.name,
          bucket.permissions,
          bucket.fileSecurity,
          bucket.enabled,
          bucket.maximumFileSize,
          bucket.allowedFileExtensions,
          bucket.compression,
          bucket.encryption,
          bucket.antivirus
        );
        console.log(`✅ Bucket "${bucket.name}" created`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Bucket "${bucket.name}" already exists`);
        } else {
          console.error(`❌ Error creating bucket "${bucket.name}":`, error);
        }
      }
    }

    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

async function seedBlocks() {
  console.log('🌱 Seeding default blocks...');
  
  try {
    // Check if blocks already exist
    const existingBlocks = await databases.listDocuments(
      config.databaseId,
      'blocks'
    );
    
    if (existingBlocks.total > 0) {
      console.log(`ℹ️  Blocks already seeded (${existingBlocks.total} blocks found)`);
      return;
    }
    
    // If no blocks exist, we'll skip seeding for now
    console.log('ℹ️  Skipping block seeding for demo - can be added manually in Appwrite console');
    
  } catch (error) {
    console.error(`❌ Error checking existing blocks:`, error.message);
    console.log('ℹ️  Continuing without seeding blocks...');
  }
}

// Main execution
async function main() {
  if (!config.projectId || !config.apiKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   APPWRITE_PROJECT_ID');
    console.error('   APPWRITE_API_KEY');
    console.error('');
    console.error('Please set these in your .env file');
    process.exit(1);
  }

  await setupDatabase();
  await seedBlocks();
}

if (require.main === module) {
  main();
}

module.exports = { setupDatabase, seedBlocks };