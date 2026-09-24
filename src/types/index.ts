export type NodeCategory =
  | 'trigger'
  | 'agent'
  | 'tool'
  | 'condition'
  | 'approval'
  | 'memory'
  | 'output';

export type NodeStatus =
  | 'idle'
  | 'waiting'
  | 'running'
  | 'completed'
  | 'failed'
  | 'paused';

export interface WorkflowNode {
  id: string;
  type: NodeCategory;
  name: string;
  subtitle?: string;
  description?: string;
  position: { x: number; y: number };
  status: NodeStatus;
  config: NodeConfig;
  inputs?: Array<{ id: string; label: string; type: string }>;
  outputs?: Array<{ id: string; label: string; type: string }>;
  executionData?: {
    lastRunAt?: string;
    durationMs?: number;
    tokenUsage?: { prompt: number; completion: number; total: number };
    summary?: string;
    outputData?: any;
    error?: string;
  };
}

export type NodeConfig =
  | ({ category: 'agent' } & AgentConfig)
  | ({ category: 'trigger' } & TriggerConfig)
  | ({ category: 'tool' } & ToolConfig)
  | ({ category: 'condition' } & ConditionConfig)
  | ({ category: 'approval' } & ApprovalConfig)
  | ({ category: 'memory' } & MemoryConfig)
  | ({ category: 'output' } & OutputConfig);

export interface AgentConfig {
  role: string;
  model: string;
  temperature: number;
  maxTokens: number;
  reasoningLevel: 'low' | 'medium' | 'high';
  systemPrompt: string;
  tools: string[];
  knowledgeBases: string[];
  memoryType: 'none' | 'workflow' | 'persistent';
  inputSchema: string;
  outputSchema: string;
  permissions: {
    readFiles: boolean;
    writeFiles: boolean;
    sendEmails: boolean;
    searchWeb: boolean;
    executeCode: boolean;
    callAPIs: boolean;
  };
}

export interface TriggerConfig {
  triggerType: 'schedule' | 'manual' | 'webhook' | 'email' | 'file' | 'api';
  scheduleCron?: string;
  scheduleHuman?: string;
  webhookUrl?: string;
  eventFilter?: string;
}

export interface ToolConfig {
  toolName: string;
  toolCategory?: 'web' | 'productivity' | 'developer' | 'research' | 'data' | 'search' | 'communication' | 'database' | 'crm';
  categoryType?: string;
  parameters?: Record<string, any>;
  timeoutSeconds?: number;
}

export interface ConditionConfig {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'is_true';
  value: string | number;
  trueTargetLabel: string;
  falseTargetLabel: string;
}

export interface ApprovalConfig {
  title: string;
  prompt: string;
  approverRole: string;
  timeoutHours: number;
  allowEditing: boolean;
  previewData?: any;
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'reconsidered';
}

export interface MemoryConfig {
  operation: 'read' | 'write' | 'search' | 'update';
  namespace: string;
  key?: string;
  query?: string;
}

export interface OutputConfig {
  destination: 'email' | 'slack' | 'notion' | 'database' | 'webhook' | 'download';
  format: 'markdown' | 'json' | 'pdf' | 'html';
  target?: string;
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  fromHandle?: string; // e.g. 'out', 'yes', 'no'
  toHandle?: string;
  label?: string; // 'YES', 'NO', 'Branch 1', etc.
  animated?: boolean;
  active?: boolean;
}

export interface WorkflowVersion {
  id: string;
  version: string;
  name: string;
  createdAt: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isActive: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  goalPrompt: string;
  status: 'active' | 'paused' | 'draft';
  version: string;
  versions: WorkflowVersion[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  agentCount: number;
  lastRunAt?: string;
  nextRunAt?: string;
  successRate: number;
  totalRuns: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface AgentTemplate {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  model: string;
  tools: string[];
  systemPrompt: string;
  usageCount: number;
  category: 'core' | 'specialist' | 'utility';
}

export interface AgentTeam {
  id: string;
  name: string;
  description: string;
  coordinatorId: string;
  memberAgentIds: string[];
  synthesizerId: string;
  hierarchyType: 'hierarchical' | 'collaborative' | 'sequential';
  sharedMemory: boolean;
  escalationPolicy: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  totalSize: string;
  indexingStatus: 'ready' | 'indexing' | 'pending';
  embeddingModel?: string;
  chunkSize?: number;
  lastUpdated?: string;
  tags: string[];
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    updated: string;
    status: 'indexed' | 'processing';
  }>;
}

export interface MemoryStore {
  id: string;
  name: string;
  type: string;
  entryCount: number;
  sizeKb: number;
  entries: Record<string, any>;
}

export interface MemoryItem {
  id: string;
  name?: string;
  type?: string;
  scope: 'workflow' | 'agent' | 'workspace';
  targetId?: string; // workflowId, agentName, or 'workspace'
  namespace?: string;
  key: string;
  value: any;
  updatedAt: string;
}

export interface ToolIntegration {
  id: string;
  name: string;
  iconName?: string;
  category: 'web' | 'productivity' | 'developer' | 'research' | 'data' | 'search' | 'communication' | 'database' | 'crm';
  description: string;
  connected?: boolean;
  isConnected?: boolean;
  authType: 'oauth' | 'apiKey' | 'builtIn';
  permissions: string[];
}

export interface RunTrace {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'completed' | 'running' | 'failed' | 'waiting' | 'cancelled' | 'waiting_approval';
  startedAt: string;
  duration: string;
  cost?: string;
  costUsd?: number;
  tokenUsage?: { prompt: number; completion: number; total: number };
  agentCount: number;
  steps: RunStep[];
}

export interface RunStep {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: NodeCategory;
  status: 'completed' | 'running' | 'waiting' | 'failed' | 'paused';
  timestamp: string;
  duration: string;
  input: any;
  reasoningSummary: string;
  toolCalls: Array<{ tool: string; input: any; output: any }>;
  output: any;
  tokenUsage: { prompt: number; completion: number; total: number };
  error?: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: 'research' | 'business' | 'personal' | 'developer' | 'sales' | 'engineering' | 'operations';
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  agents: string[];
  agentCount?: number;
  tools: string[];
  toolsIncluded?: string[];
  usageCount?: number;
  nodeCount: number;
  workflow: Workflow;
}

export interface ScheduleItem {
  id: string;
  workflowId: string;
  workflowName: string;
  frequency: 'Once' | 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Custom Cron';
  cron: string;
  time: string;
  status: 'active' | 'paused';
  isEnabled?: boolean;
  type?: string;
  scheduleExpression?: string;
  timezone?: string;
  lastRun: string;
  nextRun: string;
}

export type MemoryStoreItem = MemoryItem;
export type ScheduleTrigger = ScheduleItem;
export type WorkflowTemplate = Template;

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  nodeId?: string;
  nodeName?: string;
  message: string;
  recommendation: string;
}
