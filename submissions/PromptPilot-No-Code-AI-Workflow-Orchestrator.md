# Hackathon Submission: PromptPilot

## GitHub handle
JustAdi10

## Project Title
🧩 PromptPilot – No-Code AI Workflow Orchestrator (Built with Appwrite)

## Project Description    
PromptPilot is a powerful no-code AI automation platform that enables users to visually design and execute multi-step AI workflows using a drag-and-drop interface. Think "Zapier + ChatGPT" but with visual flow building capabilities.

The platform allows users to:
- **Visually build AI workflows** using draggable blocks for different operations
- **Execute workflows in real-time** with live status updates and animated progress
- **Integrate AI services** like text summarization, translation, image generation, and sentiment analysis
- **Connect external APIs** through webhook blocks and HTTP requests
- **Collaborate in teams** with shared workspaces and workflow libraries
- **Schedule automated runs** with cron-based scheduling
- **Monitor execution logs** with detailed real-time insights

Key features include a React Flow-based visual editor, real-time execution monitoring with glowing animations, comprehensive AI block library, team collaboration, and a scalable architecture powered entirely by Appwrite services.

## Inspiration behind the Project  
The inspiration came from witnessing the complexity gap between powerful AI tools and non-technical users who want to leverage them. While tools like ChatGPT and DALL-E are incredibly powerful, creating complex multi-step AI workflows often requires coding skills or expensive enterprise solutions.

I wanted to democratize AI automation by creating a platform where anyone can build sophisticated AI workflows visually - from content creators who want to automate their publishing pipeline to small businesses looking to streamline customer support with AI-powered responses.

The hackathon theme of building with Appwrite was perfect timing, as I realized Appwrite's comprehensive backend services (Auth, Database, Functions, Realtime, Storage) could power the entire platform without needing separate services, making it truly cohesive and performant.

## Tech Stack    
**Frontend:**
- Next.js 14 with TypeScript for the web application
- React Flow for the visual workflow builder interface
- TailwindCSS for modern, responsive styling with glassmorphism design
- Framer Motion for smooth animations and real-time execution effects
- Zustand for state management
- SWR for data fetching and caching

**Backend (100% Appwrite):**
- **Appwrite Auth** for user authentication and team management
- **Appwrite Databases** for storing workflows, blocks, executions, and logs
- **Appwrite Functions** for AI operations (Node.js runtime with OpenAI integration)
- **Appwrite Storage** for generated files (images, PDFs, results)
- **Appwrite Realtime** for live execution updates and collaborative editing
- **Appwrite Teams** for workspace collaboration

**AI Integration:**
- OpenAI GPT models for text operations (summarization, translation, sentiment analysis)
- DALL-E 3 for AI image generation
- Custom function wrappers for extensible AI operations

**Deployment:**
- Frontend deployed on Vercel with automatic deployments
- Appwrite Cloud for backend services
- Database collections and storage buckets auto-configured via setup scripts

### Appwrite products
- [x] Auth - User authentication, registration, and team management
- [x] Databases - Storing workflows, blocks, executions, and execution logs
- [x] Storage - Generated files (AI images, PDFs, text results)
- [x] Functions - AI text operations, image generation, and workflow executor
- [ ] Messaging - (Planned for notifications)
- [x] Realtime - Live execution updates and collaborative workflow editing
- [ ] Sites - (Using Vercel for frontend deployment)

## Project Repo  
https://github.com/JustAdi10/PromptPilot-No-Code-AI-Workflow-Orchestrator

## Deployed Site URL
Coming soon - will be deployed to `.appwrite.network` subdomain

## Demo Video/Photos  
**Demo Workflow:** RSS Feed → AI Summarization → Image Generation → Webhook Notification

The demo showcases:
1. **Visual Workflow Building** - Drag AI blocks from library, connect with animated edges
2. **Real-time Execution** - Watch nodes glow and animate during execution
3. **AI Operations** - Text summarization of RSS feeds, AI image generation of summaries
4. **External Integration** - Webhook notifications with execution results
5. **Execution Monitoring** - Live logs, progress tracking, and error handling

**Key Technical Highlights:**
- **Deep Appwrite Integration:** Every major feature powered by Appwrite services
- **Scalable Architecture:** Modular design supporting custom blocks and enterprise features  
- **Real-time Collaboration:** Multiple users can edit workflows simultaneously
- **Production Ready:** Comprehensive error handling, logging, and monitoring
- **Extensible Platform:** Plugin architecture for custom AI operations and integrations

**Innovation Factor:**
- First visual AI workflow builder specifically optimized for Appwrite's service ecosystem
- Real-time collaborative editing with live execution visualization
- Comprehensive demo showing complex multi-step AI automation (RSS → Summarization → Image Generation → Webhooks)
- Production-ready architecture that showcases Appwrite's capabilities at scale

This project demonstrates how Appwrite's unified backend can power a complex, feature-rich application without requiring multiple third-party services, making it perfect for hackathon judges who value technical depth and creative use of the platform.

---

*Built with ❤️ for Appwrite Hacktoberfest 2025*