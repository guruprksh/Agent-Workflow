# AgentFlow ⚡
### *Describe the work. Build the team. Let the team execute it.*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**AgentFlow** is a modern visual AI agent workflow builder and orchestration engine. It enables developers and teams to transform natural language prompts into production-grade multi-agent teams with connected tools, vector memory, human-in-the-loop approvals, and real-time execution telemetry.

---

## 🚀 Key Features

### 1. 🎨 Infinite Visual Workflow Canvas
- **Smooth Navigation**: Zoom (`+`/`-`/scroll), Pan, Fit to Center, and interactive Canvas Minimap.
- **Dynamic Bezier Curves**: Animated SVG connections with real-time data-flow particle pulses.
- **Rich Node Taxonomy**:
  - ⚡ **Trigger Nodes**: Cron schedules, Webhooks, Incoming Events, and Manual Dispatches.
  - 🤖 **Agent Nodes**: Multi-model autonomous agents with customizable roles, prompts, reasoning levels, and tool access.
  - 🛠️ **Tool Nodes**: Pre-built OpenAPI tools (Playwright browser, arXiv, Semantic Scholar, Python Sandbox, Clearbit, Zotero).
  - 🔀 **Condition Nodes**: Logic branches (`equals`, `contains`, `greater_than`) with labeled `YES` / `NO` ports.
  - 🛡️ **Human Approval Nodes**: Human-in-the-loop safety gates that pause execution for approval before sensitive steps.
  - 🧠 **Memory Nodes**: Key-value workflow caches and long-term vector embeddings.
  - 📤 **Output Nodes**: Multi-channel dispatchers (Slack, Email, Notion, Webhook, Postgres/Database).

### 2. 🪄 Natural Language Workflow Generator
- Describe a complex multi-stage task in plain English (e.g., *"Monitor AI safety papers on arXiv every morning, summarize key breakthroughs, verify citations, and send a Slack digest with approval"*).
- Watch AgentFlow perform real-time chain-of-thought DAG synthesis:
  1. **Intent Analysis & Goal Decomposition**
  2. **Agent Specialist Selection**
  3. **Tool Capability Matching**
  4. **Topological Graph Wiring**

### 3. 🤖 Deep Agent Specialist Inspector
- **Model Switching**: Switch between Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro, and Llama 3.3 70B per agent.
- **Reasoning Controls**: Adjust reasoning depth (`low`, `medium`, `high`), temperature, and maximum token budgets.
- **Granular Security Sandbox**: Explicit permissions for web access, code execution, filesystem reads, emails, and external APIs.
- **Schema Validation**: Live JSON Schema editors for input parameters and structured output contracts.

### 4. ⚡ Live Execution Runner & Telemetry
- Step-by-step animated execution with node state indicators (`idle`, `running`, `completed`, `waiting`, `error`).
- Real-time streaming logs, tool call arguments, execution timing, token usage, and cumulative cost tracking.
- **Interactive Approval Modal**: Halts on sensitive nodes, previews payloads, and allows manual Authorization or Rejection.

### 5. 💬 In-Canvas AI Workflow Copilot
- Modify live workflows conversationally:
  - *"Add a human review step before sending Slack messages."*
  - *"Change the research agent model to Claude 3.5 Sonnet."*
  - *"Insert a Python sandbox validation node after the synthesizer."*

### 6. 🔍 Graph Linter & Auto-Fix Engine
- Continuous static analysis detecting:
  - Missing trigger entry points
  - Unconfigured agent models
  - Unhandled condition branches
  - Circular deadlocks and orphaned nodes
- One-click **Auto-Fix** resolutions.

### 7. 📚 Full Suite of Multi-Agent Tools
- **Version History & Snapshots**: Revert, compare, or tag workflow snapshots (`v1.0.0`, `v1.1.0`).
- **Templates Library**: Pre-built templates for Research Monitoring, B2B Lead Enrichment, Code Patch Generation, and Competitor Tracking.
- **Knowledge Base RAG**: Semantic vector document search and test bench.
- **Integrations Marketplace**: Manage API keys, OAuth status, and rate limits.
- **Analytics & Observability**: Cost breakdowns by specialist, token volume, and run success rates.
- **Global `⌘K` Command Palette**: Instant navigation and quick actions across the platform.

---

## 🛠️ Architecture & Tech Stack

```
Agent-Workflow/
├── src/
│   ├── components/
│   │   ├── canvas/          # Visual DAG canvas, nodes, connectors, minimap
│   │   ├── copilot/         # AI workflow modification copilot
│   │   ├── execution/       # Live run monitor, telemetry drawer, approval modal
│   │   ├── generator/       # Natural language team builder modal
│   │   ├── inspector/       # Agent, Tool, Condition & Trigger property inspectors
│   │   ├── layout/          # Navigation sidebar, header, command palette
│   │   ├── validation/      # Graph linter and diagnostic panel
│   │   └── views/           # Workflows, Agents, Templates, Knowledge, Runs, Analytics
│   ├── context/             # React Context for global workflow state & execution engine
│   ├── data/                # Preloaded workflows, templates, agents, tools, memory stores
│   ├── types/               # TypeScript interfaces for nodes, edges, runs, and agents
│   ├── App.tsx              # Main application router and state orchestration
│   └── main.tsx             # React DOM entry point
├── public/                  # Static assets
├── index.html               # Web entry with dark-mode styling & Geist fonts
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build tooling
```

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **Build System**: Vite
- **Typography**: Geist Mono & Inter

---

## 🏁 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/guruprksh/Agent-Workflow.git
   cd Agent-Workflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` or `http://localhost:5173`.

4. **Run type-checking / linting:**
   ```bash
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🧩 Node Types Reference

| Node Type | Icon | Purpose | Key Configurations |
| :--- | :---: | :--- | :--- |
| **Trigger** | ⚡ | Graph entry point | Cron schedule, Webhook URL, Event payload |
| **Agent** | 🤖 | Autonomous LLM agent | Model, System Prompt, Reasoning depth, Tools, Sandbox |
| **Tool** | 🛠️ | Deterministic execution | API endpoints, Browser automation, Sandbox scripts |
| **Condition** | 🔀 | Decision tree routing | Field path, Operator (`==`, `!=`, `>`, `<`), Target value |
| **Approval** | 🛡️ | Human-in-the-loop gate | Timeout, Reviewer role, Required approval message |
| **Memory** | 🧠 | Vector / KV storage | Store key, TTL, Vector collection name |
| **Output** | 📤 | Final delivery | Slack webhook, Email recipient, Notion database ID |

---

## 🤝 Contributing

Contributions, feature requests, and suggestions are welcome!
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
