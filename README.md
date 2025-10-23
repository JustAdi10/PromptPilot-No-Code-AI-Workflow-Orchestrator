# 🧩 PromptPilot - No-Code AI Workflow Orchestrator

[![Built for Appwrite Hacktoberfest 2025](https://img.shields.io/badge/Built%20for-Appwrite%20Hacktoberfest%202025-fd366e)](https://hacktoberfest.appwrite.io)
[![Powered by Appwrite](https://img.shields.io/badge/Powered%20by-Appwrite-fd366e)](https://appwrite.io)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)](https://typescriptlang.org)

> **Think "Zapier + ChatGPT" with visual workflow building capabilities, powered entirely by Appwrite!**

PromptPilot is a powerful no-code AI automation platform that enables users to visually design and execute multi-step AI workflows using an intuitive drag-and-drop interface.

## ✨ Features

### 🎨 Visual Workflow Builder
- Drag-and-drop interface powered by React Flow
- Real-time collaborative editing
- Comprehensive block library (AI, webhooks, logic)
- Visual execution with animated progress

### 🤖 AI-Powered Blocks
- **Text Operations**: Summarization, translation, sentiment analysis
- **Image Generation**: DALL-E integration for AI-generated images  
- **Classification**: Automated content categorization
- **Custom Prompts**: Flexible AI operations with custom instructions

### 🔗 Integration Capabilities
- **Webhooks**: HTTP requests to external APIs
- **Scheduling**: Cron-based automated workflow execution
- **Real-time Updates**: Live execution monitoring
- **Team Collaboration**: Shared workspaces and workflow libraries

### 🏗️ Production-Ready Architecture
- Comprehensive error handling and retry policies
- Detailed execution logging and monitoring
- Scalable infrastructure powered by Appwrite
- Security-first design with proper authentication

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 with TypeScript
- React Flow for visual workflow building
- TailwindCSS with glassmorphism design
- Framer Motion for animations
- Zustand for state management

**Backend (100% Appwrite)**
- **Auth**: User authentication & team management
- **Databases**: Workflows, executions, logs storage
- **Functions**: AI operations & workflow execution engine
- **Storage**: Generated files (images, results)
- **Realtime**: Live updates & collaborative editing

**AI Integration**
- OpenAI GPT models for text operations
- DALL-E 3 for image generation
- Extensible architecture for additional AI services

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Appwrite Cloud account or self-hosted instance
- OpenAI API key

### 1. Setup
```bash
git clone <repository-url> promptpilot
cd promptpilot
npm install
cp .env.example .env.local
```

### 2. Configure Appwrite
1. Create new Appwrite project
2. Update `.env.local` with your credentials
3. Run database setup: `node scripts/setup-database.js`
4. Deploy Appwrite Functions (see DEPLOYMENT.md)

### 3. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

## 📖 Documentation

- [🏗️ **System Architecture**](./ARCHITECTURE.md) - Detailed technical architecture
- [🚀 **Deployment Guide**](./DEPLOYMENT.md) - Complete deployment instructions
- [🎯 **Demo Workflow**](./demo/sample-workflow.json) - Example RSS → AI → Webhook workflow

## 🎪 Demo Workflow

The included demo showcases a complete AI automation pipeline:

1. **RSS Feed Fetcher** → Retrieves latest articles
2. **AI Summarizer** → Generates concise summaries using GPT
3. **Image Generator** → Creates visual summaries with DALL-E
4. **Webhook Notifier** → Sends results to external systems

**Demo Flow**: `RSS Feed → AI Summarization → Image Generation → Webhook Notification`

## 🏆 Appwrite Integration Depth

PromptPilot showcases comprehensive use of Appwrite's service ecosystem:

### Core Services
- **Authentication**: Complete user lifecycle management
- **Databases**: Multi-collection data architecture with relationships
- **Functions**: Custom AI operations with external API integration
- **Storage**: File management with proper permissions
- **Realtime**: Live collaborative features

### Advanced Features  
- **Teams**: Workspace collaboration and sharing
- **Permissions**: Fine-grained access control
- **Scheduled Functions**: Automated workflow execution
- **Function Chaining**: Complex workflow orchestration
- **Real-time Subscriptions**: Live execution monitoring

## 🎯 Hackathon Highlights

### Innovation
- **First visual AI workflow builder** optimized for Appwrite
- **Real-time collaborative editing** with live execution visualization
- **Deep platform integration** - every major feature powered by Appwrite

### Technical Excellence
- **Production-ready architecture** with comprehensive error handling
- **Scalable design** supporting enterprise features
- **Clean code practices** with TypeScript and modern tooling

### User Experience
- **Intuitive visual interface** - no coding required
- **Real-time feedback** with animated execution progress
- **Comprehensive demo** showing practical AI automation

## 🎬 Demo Script (2 Minutes)

1. **Landing Page** (15s) - Show platform overview
2. **Workflow Builder** (45s) - Demonstrate visual building
3. **Real-time Execution** (45s) - Run demo workflow with live updates
4. **Results** (15s) - Show generated content and webhook delivery

## 📁 Project Structure

```
promptpilot/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   │   ├── landing/         # Landing page components
│   │   └── workflow/        # Workflow builder components
│   ├── lib/                 # Appwrite configuration & utilities
│   ├── types/               # TypeScript type definitions
│   └── styles/              # Global styles and themes
├── functions/               # Appwrite Functions
│   ├── ai-text-operations/  # AI text processing
│   └── workflow-executor/   # Workflow execution engine
├── scripts/                 # Database setup and utilities
├── demo/                    # Demo workflow and examples
└── docs/                    # Documentation
```

## 🤝 Contributing

This project was built for the Appwrite Hacktoberfest 2025 Hackathon. Contributions, issues, and feature requests are welcome!

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Appwrite Team** for the amazing backend platform
- **React Flow** for the excellent workflow visualization library
- **OpenAI** for powerful AI capabilities
- **Vercel** for seamless deployment experience

---

**Built with ❤️ for Appwrite Hacktoberfest 2025**

*Democratizing AI automation, one visual workflow at a time* 🧩✨
