import {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  ValidationIssue,
  RunTrace,
  RunStep,
  NodeStatus,
} from '../types';

export function validateWorkflow(workflow: Workflow): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const nodeMap = new Map<string, WorkflowNode>();
  workflow.nodes.forEach((n) => nodeMap.set(n.id, n));

  const incomingEdges = new Map<string, number>();
  const outgoingEdges = new Map<string, number>();

  workflow.nodes.forEach((n) => {
    incomingEdges.set(n.id, 0);
    outgoingEdges.set(n.id, 0);
  });

  workflow.edges.forEach((e) => {
    incomingEdges.set(e.to, (incomingEdges.get(e.to) || 0) + 1);
    outgoingEdges.set(e.from, (outgoingEdges.get(e.from) || 0) + 1);
  });

  // Check triggers
  const triggerNodes = workflow.nodes.filter((n) => n.type === 'trigger');
  if (triggerNodes.length === 0) {
    issues.push({
      id: 'no-trigger',
      severity: 'error',
      message: 'Workflow has no Trigger node to initiate execution.',
      recommendation: 'Add a Schedule, Webhook, or Manual trigger node at the start.',
    });
  }

  // Check for orphan or disconnected nodes
  workflow.nodes.forEach((node) => {
    const incoming = incomingEdges.get(node.id) || 0;
    const outgoing = outgoingEdges.get(node.id) || 0;

    if (node.type !== 'trigger' && incoming === 0) {
      issues.push({
        id: `orphan-${node.id}`,
        severity: 'warning',
        nodeId: node.id,
        nodeName: node.name,
        message: `Node "${node.name}" has no incoming connection.`,
        recommendation: 'Connect an upstream node to this node.',
      });
    }

    if (node.type !== 'output' && outgoing === 0 && node.type !== 'condition') {
      issues.push({
        id: `deadend-${node.id}`,
        severity: 'info',
        nodeId: node.id,
        nodeName: node.name,
        message: `Node "${node.name}" has no outgoing connection.`,
        recommendation: 'Connect this node to a downstream agent, tool, or output node.',
      });
    }

    // Agent specific validation
    if (node.type === 'agent') {
      const config = node.config;
      if (config.category === 'agent') {
        if (!config.systemPrompt || config.systemPrompt.trim().length < 10) {
          issues.push({
            id: `prompt-${node.id}`,
            severity: 'warning',
            nodeId: node.id,
            nodeName: node.name,
            message: `Agent "${node.name}" has an incomplete system prompt.`,
            recommendation: 'Provide clear domain instructions in the agent configuration panel.',
          });
        }
      }
    }
  });

  return issues;
}

export function generateWorkflowFromPrompt(prompt: string): Workflow {
  const p = prompt.toLowerCase();
  const id = `wf-${Date.now().toString(36)}`;
  const title = generateTitleFromPrompt(prompt);

  // Check domain patterns
  const isResearch = p.includes('paper') || p.includes('arxiv') || p.includes('research') || p.includes('scientific') || p.includes('literature');
  const isSales = p.includes('lead') || p.includes('sales') || p.includes('crm') || p.includes('hubspot') || p.includes('customer');
  const isBug = p.includes('bug') || p.includes('github') || p.includes('code') || p.includes('pr') || p.includes('git');
  const isMarket = p.includes('competitor') || p.includes('market') || p.includes('price') || p.includes('scrap');
  const isTrip = p.includes('travel') || p.includes('trip') || p.includes('flight') || p.includes('hotel') || p.includes('vacation');

  const nodes: WorkflowNode[] = [];
  const edges: WorkflowEdge[] = [];
  let y = 40;
  const x = 380;

  // 1. Trigger
  const triggerType = p.includes('monday') || p.includes('every') || p.includes('daily') || p.includes('weekly') ? 'schedule' : (p.includes('webhook') ? 'webhook' : 'manual');
  const scheduleText = p.includes('monday') ? 'Every Monday at 08:00 UTC' : (p.includes('daily') ? 'Daily at 09:00 UTC' : 'On demand / Manual trigger');

  nodes.push({
    id: `${id}-trigger`,
    type: 'trigger',
    name: triggerType === 'schedule' ? 'Schedule Trigger' : 'Workflow Trigger',
    subtitle: scheduleText,
    position: { x, y },
    status: 'idle',
    config: {
      category: 'trigger',
      triggerType,
      scheduleHuman: scheduleText,
    },
  });
  y += 140;

  if (isResearch) {
    // Researcher -> Extractor -> Relevance -> Condition -> Summarizer -> Approval -> Save -> Notify
    nodes.push({
      id: `${id}-scout`,
      type: 'agent',
      name: 'Literature Scout Agent',
      subtitle: 'Model: Claude 3.5 Sonnet',
      description: 'Scans academic databases and preprints matching keyword criteria.',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'agent',
        role: 'Scientific Literature Scout',
        model: 'Claude 3.5 Sonnet',
        temperature: 0.2,
        maxTokens: 4096,
        reasoningLevel: 'high',
        systemPrompt: `You are an autonomous literature scout. Parse user inquiry: "${prompt}". Identify authoritative preprints on arXiv and Crossref.`,
        tools: ['Web Search', 'arXiv API', 'Semantic Scholar API'],
        knowledgeBases: ['Lab Research Taxonomy'],
        memoryType: 'persistent',
        inputSchema: '{"query": "string", "filters": "object"}',
        outputSchema: '{"found_papers": [{"title": "string", "abstract": "string", "doi": "string"}]}',
        permissions: { readFiles: true, writeFiles: false, sendEmails: false, searchWeb: true, executeCode: false, callAPIs: true },
      },
    });
    edges.push({ id: `e-${nodes[0].id}-${id}-scout`, from: nodes[0].id, to: `${id}-scout`, label: 'Dispatches query' });
    y += 140;

    nodes.push({
      id: `${id}-eval`,
      type: 'agent',
      name: 'Relevance & Method Evaluator',
      subtitle: 'Model: GPT-4o',
      description: 'Inspects full PDF content and scores methodology validity against target criteria.',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'agent',
        role: 'Scientific Reviewer',
        model: 'GPT-4o',
        temperature: 0.1,
        maxTokens: 2048,
        reasoningLevel: 'high',
        systemPrompt: 'Filter papers with strict relevance score (0-1). Verify whether experimental setup matches requested criteria.',
        tools: ['PDF Reader', 'Citation Graph'],
        knowledgeBases: ['Evaluation Criteria'],
        memoryType: 'workflow',
        inputSchema: '{"papers": "object[]"}',
        outputSchema: '{"scored_papers": [{"id": "string", "score": "number", "relevance": "boolean"}]}',
        permissions: { readFiles: true, writeFiles: false, sendEmails: false, searchWeb: false, executeCode: false, callAPIs: false },
      },
    });
    edges.push({ id: `e-${id}-scout-${id}-eval`, from: `${id}-scout`, to: `${id}-eval`, label: 'Raw papers' });
    y += 140;

    // Condition
    nodes.push({
      id: `${id}-cond`,
      type: 'condition',
      name: 'Is Relevance Score >= 0.8?',
      subtitle: 'Branch: Threshold check',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'condition',
        field: 'relevance_score',
        operator: 'greater_than',
        value: 0.8,
        trueTargetLabel: 'YES',
        falseTargetLabel: 'NO',
      },
    });
    edges.push({ id: `e-${id}-eval-${id}-cond`, from: `${id}-eval`, to: `${id}-cond` });
    y += 140;

    nodes.push({
      id: `${id}-summary`,
      type: 'agent',
      name: 'Synthesis & Summary Agent',
      subtitle: 'Model: Claude 3.5 Sonnet',
      position: { x: x - 180, y },
      status: 'idle',
      config: {
        category: 'agent',
        role: 'Research Synthesis Specialist',
        model: 'Claude 3.5 Sonnet',
        temperature: 0.3,
        maxTokens: 4096,
        reasoningLevel: 'medium',
        systemPrompt: 'Produce structured, scannable summaries covering methodology, key numerical metrics, and research limitations.',
        tools: ['Markdown Formatter'],
        knowledgeBases: ['Lab Taxonomy'],
        memoryType: 'workflow',
        inputSchema: '{"papers": "object[]"}',
        outputSchema: '{"summaries": "object[]"}',
        permissions: { readFiles: true, writeFiles: false, sendEmails: false, searchWeb: false, executeCode: false, callAPIs: false },
      },
    });
    edges.push({ id: `e-${id}-cond-${id}-summary`, from: `${id}-cond`, to: `${id}-summary`, label: 'YES (Score >= 0.8)', fromHandle: 'yes' });

    nodes.push({
      id: `${id}-archive`,
      type: 'output',
      name: 'Archive Non-Relevant Papers',
      subtitle: 'Cold Index Storage',
      position: { x: x + 240, y },
      status: 'idle',
      config: { category: 'output', destination: 'database', format: 'json', target: 'weekly_research_archive' },
    });
    edges.push({ id: `e-${id}-cond-${id}-archive`, from: `${id}-cond`, to: `${id}-archive`, label: 'NO (Score < 0.8)', fromHandle: 'no' });
    y += 140;

    nodes.push({
      id: `${id}-approval`,
      type: 'approval',
      name: 'Principal Investigator Review',
      subtitle: 'Approve before library ingestion',
      position: { x: x - 180, y },
      status: 'idle',
      config: {
        category: 'approval',
        title: 'Review Extracted Papers for Knowledge Base Ingestion',
        prompt: 'Autonomous agents selected high-relevance papers. Confirm before committing to permanent lab library.',
        approverRole: 'Principal Investigator',
        timeoutHours: 48,
        allowEditing: true,
        previewData: { count: 3, papers: ['Preprint #1', 'Preprint #2', 'Preprint #3'] },
      },
    });
    edges.push({ id: `e-${id}-summary-${id}-approval`, from: `${id}-summary`, to: `${id}-approval` });
    y += 140;

    nodes.push({
      id: `${id}-save`,
      type: 'tool',
      name: 'Zotero & Vector DB Sync',
      subtitle: 'Tool: Persistent Storage',
      position: { x: x - 180, y },
      status: 'idle',
      config: {
        category: 'tool',
        toolName: 'Zotero Bridge',
        categoryType: 'research',
        parameters: { collection: 'AutoIndexed' },
      },
    });
    edges.push({ id: `e-${id}-approval-${id}-save`, from: `${id}-approval`, to: `${id}-save`, label: 'Approved' });
    y += 140;

    nodes.push({
      id: `${id}-out`,
      type: 'output',
      name: 'Executive Digest to Slack',
      subtitle: 'Channel: #research-briefs',
      position: { x: x - 180, y },
      status: 'idle',
      config: { category: 'output', destination: 'slack', format: 'markdown', target: '#research-briefs' },
    });
    edges.push({ id: `e-${id}-save-${id}-out`, from: `${id}-save`, to: `${id}-out` });

  } else if (isSales) {
    // Enricher -> Scorer -> Condition -> Custom Pitch -> Approval -> Slack
    nodes.push({
      id: `${id}-enricher`,
      type: 'agent',
      name: 'Lead Enrichment Agent',
      subtitle: 'Model: GPT-4o',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'agent',
        role: 'Firmographic Researcher',
        model: 'GPT-4o',
        temperature: 0.1,
        maxTokens: 2048,
        reasoningLevel: 'medium',
        systemPrompt: 'Enrich lead with company size, verified ARR estimate, and installed software tools.',
        tools: ['Web Search', 'Clearbit API'],
        knowledgeBases: ['ICP Rules'],
        memoryType: 'persistent',
        inputSchema: '{"domain": "string"}',
        outputSchema: '{"profile": "object"}',
        permissions: { readFiles: false, writeFiles: false, sendEmails: false, searchWeb: true, executeCode: false, callAPIs: true },
      },
    });
    edges.push({ id: `e-${nodes[0].id}-${id}-enricher`, from: nodes[0].id, to: `${id}-enricher` });
    y += 140;

    nodes.push({
      id: `${id}-scorer`,
      type: 'agent',
      name: 'ICP Intent Scoring Agent',
      subtitle: 'Model: Claude 3.5 Sonnet',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'agent',
        role: 'Lead Qualification Specialist',
        model: 'Claude 3.5 Sonnet',
        temperature: 0.2,
        maxTokens: 1024,
        reasoningLevel: 'high',
        systemPrompt: 'Score buyer intent and calculate ICP fit (0-100).',
        tools: ['CRM DB'],
        knowledgeBases: ['Sales Playbook'],
        memoryType: 'workflow',
        inputSchema: '{"company": "object"}',
        outputSchema: '{"score": "number", "is_enterprise": "boolean"}',
        permissions: { readFiles: false, writeFiles: false, sendEmails: false, searchWeb: false, executeCode: false, callAPIs: false },
      },
    });
    edges.push({ id: `e-${id}-enricher-${id}-scorer`, from: `${id}-enricher`, to: `${id}-scorer` });
    y += 140;

    nodes.push({
      id: `${id}-cond`,
      type: 'condition',
      name: 'Score >= 80 (Enterprise)?',
      subtitle: 'Condition: ICP Fit',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'condition',
        field: 'score',
        operator: 'greater_than',
        value: 80,
        trueTargetLabel: 'YES',
        falseTargetLabel: 'NO',
      },
    });
    edges.push({ id: `e-${id}-scorer-${id}-cond`, from: `${id}-scorer`, to: `${id}-cond` });
    y += 140;

    nodes.push({
      id: `${id}-pitch`,
      type: 'agent',
      name: 'Outreach Personalization Agent',
      subtitle: 'Model: Claude 3.5 Sonnet',
      position: { x: x - 160, y },
      status: 'idle',
      config: {
        category: 'agent',
        role: 'Executive Outreach Copywriter',
        model: 'Claude 3.5 Sonnet',
        temperature: 0.3,
        maxTokens: 2048,
        reasoningLevel: 'medium',
        systemPrompt: 'Draft customized outreach messaging emphasizing specific pain points.',
        tools: ['Notion'],
        knowledgeBases: ['Case Studies'],
        memoryType: 'workflow',
        inputSchema: '{"lead": "object"}',
        outputSchema: '{"pitch": "string"}',
        permissions: { readFiles: false, writeFiles: false, sendEmails: false, searchWeb: false, executeCode: false, callAPIs: false },
      },
    });
    edges.push({ id: `e-${id}-cond-${id}-pitch`, from: `${id}-cond`, to: `${id}-pitch`, label: 'YES (Enterprise)', fromHandle: 'yes' });

    nodes.push({
      id: `${id}-nurture`,
      type: 'output',
      name: 'HubSpot Auto Nurture',
      subtitle: 'Standard Email Flow',
      position: { x: x + 200, y },
      status: 'idle',
      config: { category: 'output', destination: 'database', format: 'json', target: 'hubspot_drip' },
    });
    edges.push({ id: `e-${id}-cond-${id}-nurture`, from: `${id}-cond`, to: `${id}-nurture`, label: 'NO (Self Serve)', fromHandle: 'no' });
    y += 140;

    nodes.push({
      id: `${id}-approval`,
      type: 'approval',
      name: 'AE Approval to Dispatch',
      subtitle: 'Human-in-the-Loop Gate',
      position: { x: x - 160, y },
      status: 'idle',
      config: {
        category: 'approval',
        title: 'Review Customized Executive Pitch',
        prompt: 'Account Executive: Review personalized outreach before automated dispatch.',
        approverRole: 'Enterprise Account Executive',
        timeoutHours: 24,
        allowEditing: true,
      },
    });
    edges.push({ id: `e-${id}-pitch-${id}-approval`, from: `${id}-pitch`, to: `${id}-approval` });
    y += 140;

    nodes.push({
      id: `${id}-slack`,
      type: 'output',
      name: 'Notify #enterprise-leads',
      subtitle: 'Slack Channel Alert',
      position: { x: x - 160, y },
      status: 'idle',
      config: { category: 'output', destination: 'slack', format: 'markdown', target: '#enterprise-leads' },
    });
    edges.push({ id: `e-${id}-approval-${id}-slack`, from: `${id}-approval`, to: `${id}-slack`, label: 'Approved' });

  } else {
    // General high-quality multi-agent decomposition
    // Goal Analyzer Agent -> Specialist Worker Agent -> Quality Reviewer Agent -> Human Approval -> Output
    nodes.push({
      id: `${id}-planner`,
      type: 'agent',
      name: 'Strategic Coordinator Agent',
      subtitle: 'Model: Claude 3.5 Sonnet',
      description: 'Decomposes primary goal into discrete milestones and monitors dependencies.',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'agent',
        role: 'Lead Workflow Coordinator',
        model: 'Claude 3.5 Sonnet',
        temperature: 0.2,
        maxTokens: 4096,
        reasoningLevel: 'high',
        systemPrompt: `You are the lead coordinator for the goal: "${prompt}". Decompose this into clear tasks, coordinate tool execution, and pass structured intermediate states.`,
        tools: ['Web Search', 'HTTP Request'],
        knowledgeBases: ['Workspace Guidelines'],
        memoryType: 'workflow',
        inputSchema: '{"objective": "string"}',
        outputSchema: '{"plan": [{"step": "string", "parameters": "object"}]}',
        permissions: { readFiles: true, writeFiles: true, sendEmails: false, searchWeb: true, executeCode: true, callAPIs: true },
      },
    });
    edges.push({ id: `e-${nodes[0].id}-${id}-planner`, from: nodes[0].id, to: `${id}-planner`, label: 'Initiates task' });
    y += 140;

    nodes.push({
      id: `${id}-executor`,
      type: 'agent',
      name: 'Specialist Execution Agent',
      subtitle: 'Model: GPT-4o',
      description: 'Executes core domain logic, interacts with integrated tools, and compiles findings.',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'agent',
        role: 'Specialist Domain Operator',
        model: 'GPT-4o',
        temperature: 0.2,
        maxTokens: 4096,
        reasoningLevel: 'high',
        systemPrompt: `Execute domain requirements for "${prompt}". Utilize available tools, validate accuracy, and produce structured outputs.`,
        tools: ['Web Search', 'Python Sandbox', 'Browser'],
        knowledgeBases: ['Domain Reference'],
        memoryType: 'persistent',
        inputSchema: '{"task": "object"}',
        outputSchema: '{"result": "object", "confidence": "number"}',
        permissions: { readFiles: true, writeFiles: true, sendEmails: true, searchWeb: true, executeCode: true, callAPIs: true },
      },
    });
    edges.push({ id: `e-${id}-planner-${id}-executor`, from: `${id}-planner`, to: `${id}-executor`, label: 'Delegates' });
    y += 140;

    nodes.push({
      id: `${id}-reviewer`,
      type: 'agent',
      name: 'Quality & Fact Reviewer',
      subtitle: 'Model: Claude 3.5 Sonnet',
      description: 'Critiques agent output against accuracy constraints and verifies consistency.',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'agent',
        role: 'Adversarial Quality Critic',
        model: 'Claude 3.5 Sonnet',
        temperature: 0.1,
        maxTokens: 2048,
        reasoningLevel: 'high',
        systemPrompt: 'Verify claims, check syntax, validate compliance with user guidelines, and assign a confidence rating.',
        tools: ['Fact Validator'],
        knowledgeBases: ['Compliance Rules'],
        memoryType: 'workflow',
        inputSchema: '{"draft": "object"}',
        outputSchema: '{"is_valid": "boolean", "critique": "string", "adjusted_output": "object"}',
        permissions: { readFiles: true, writeFiles: false, sendEmails: false, searchWeb: false, executeCode: false, callAPIs: false },
      },
    });
    edges.push({ id: `e-${id}-executor-${id}-reviewer`, from: `${id}-executor`, to: `${id}-reviewer`, label: 'Draft output' });
    y += 140;

    nodes.push({
      id: `${id}-approval`,
      type: 'approval',
      name: 'Human Approval & Review',
      subtitle: 'Operator Oversight',
      description: 'Pauses workflow execution until operator validates synthesized results.',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'approval',
        title: 'Review Generated Actions & Output',
        prompt: `The AI team generated an execution proposal for: "${prompt}". Verify before committing final action.`,
        approverRole: 'Workflow Owner',
        timeoutHours: 24,
        allowEditing: true,
      },
    });
    edges.push({ id: `e-${id}-reviewer-${id}-approval`, from: `${id}-reviewer`, to: `${id}-approval` });
    y += 140;

    nodes.push({
      id: `${id}-out`,
      type: 'output',
      name: 'Deliver Notification & Report',
      subtitle: 'Destination: Multi-channel Broadcast',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'output',
        destination: 'slack',
        format: 'markdown',
        target: '#agentflow-results',
      },
    });
    edges.push({ id: `e-${id}-approval-${id}-out`, from: `${id}-approval`, to: `${id}-out`, label: 'Approved' });
  }

  const agentNodes = nodes.filter((n) => n.type === 'agent');

  return {
    id,
    name: title,
    description: `Automated team workflow designed to accomplish: "${prompt.slice(0, 140)}..."`,
    goalPrompt: prompt,
    status: 'active',
    version: 'v1.0',
    versions: [
      {
        id: 'v1',
        version: 'v1.0',
        name: 'Auto-Generated Workflow',
        createdAt: 'Just now',
        description: 'Initial pipeline designed from natural language description',
        isActive: true,
        nodes,
        edges,
      },
    ],
    nodes,
    edges,
    agentCount: agentNodes.length,
    lastRunAt: 'Never',
    nextRunAt: triggerType === 'schedule' ? 'Next cycle' : 'Manual trigger',
    successRate: 100,
    totalRuns: 0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    tags: [isResearch ? 'Research' : isSales ? 'Sales' : isBug ? 'Dev' : isMarket ? 'Strategy' : 'Automation', 'Multi-Agent'],
  };
}

function generateTitleFromPrompt(prompt: string): string {
  const p = prompt.trim();
  if (p.length < 40) return p;
  const words = p.split(/\s+/).slice(0, 5).join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1) + ' System';
}

export function modifyWorkflowWithCopilot(workflow: Workflow, command: string): { updatedWorkflow: Workflow; message: string } {
  const c = command.toLowerCase();
  const newWorkflow: Workflow = JSON.parse(JSON.stringify(workflow));

  if (c.includes('approval') && !newWorkflow.nodes.some((n) => n.type === 'approval')) {
    // Add human approval node before outputs
    const outputNode = newWorkflow.nodes.find((n) => n.type === 'output');
    const approvalId = `approval-added-${Date.now().toString(36)}`;
    const x = outputNode ? outputNode.position.x : 380;
    const y = outputNode ? Math.max(100, outputNode.position.y - 120) : 500;

    const approvalNode: WorkflowNode = {
      id: approvalId,
      type: 'approval',
      name: 'Human Approval Gate',
      subtitle: 'Added via Copilot',
      description: 'Pauses workflow execution before output actions.',
      position: { x, y },
      status: 'idle',
      config: {
        category: 'approval',
        title: 'Review Final Results Before Output',
        prompt: 'Review generated findings and authorize downstream execution.',
        approverRole: 'Workflow Owner',
        timeoutHours: 24,
        allowEditing: true,
      },
    };

    if (outputNode) {
      // rewire edges pointing to output to point to approval, and approval to output
      const incomingToOutput = newWorkflow.edges.filter((e) => e.to === outputNode.id);
      newWorkflow.edges = newWorkflow.edges.filter((e) => e.to !== outputNode.id);
      incomingToOutput.forEach((edge) => {
        newWorkflow.edges.push({ ...edge, to: approvalId });
      });
      newWorkflow.edges.push({ id: `e-app-out-${Date.now()}`, from: approvalId, to: outputNode.id, label: 'Approved' });
    }

    newWorkflow.nodes.push(approvalNode);
    return {
      updatedWorkflow: newWorkflow,
      message: 'Added Human Approval Gate before the final output.',
    };
  }

  if (c.includes('reviewer') || c.includes('critique')) {
    // Add reviewer agent
    const revId = `reviewer-${Date.now().toString(36)}`;
    const reviewerNode: WorkflowNode = {
      id: revId,
      type: 'agent',
      name: 'Adversarial Reviewer Agent',
      subtitle: 'Model: GPT-4o',
      description: 'Cross-verifies claims and scores output accuracy.',
      position: { x: 380, y: 460 },
      status: 'idle',
      config: {
        category: 'agent',
        role: 'Fact Checker & Reviewer',
        model: 'GPT-4o',
        temperature: 0.1,
        maxTokens: 2048,
        reasoningLevel: 'high',
        systemPrompt: 'Scrutinize inputs for accuracy, logical fallacies, or unverified assertions.',
        tools: ['Fact Validator'],
        knowledgeBases: ['Styleguide'],
        memoryType: 'workflow',
        inputSchema: '{"content": "object"}',
        outputSchema: '{"approved": "boolean", "feedback": "string"}',
        permissions: { readFiles: true, writeFiles: false, sendEmails: false, searchWeb: false, executeCode: false, callAPIs: false },
      },
    };
    newWorkflow.nodes.push(reviewerNode);
    newWorkflow.agentCount = newWorkflow.nodes.filter((n) => n.type === 'agent').length;
    return {
      updatedWorkflow: newWorkflow,
      message: 'Added Adversarial Reviewer Agent to verify step outputs.',
    };
  }

  if (c.includes('email') || c.includes('notification')) {
    const notifyId = `notify-${Date.now().toString(36)}`;
    const notifyNode: WorkflowNode = {
      id: notifyId,
      type: 'output',
      name: 'Email Alert & Digest',
      subtitle: 'Destination: Team Inbox',
      position: { x: 580, y: 700 },
      status: 'idle',
      config: {
        category: 'output',
        destination: 'email',
        format: 'markdown',
        target: 'team@organization.ai',
      },
    };
    newWorkflow.nodes.push(notifyNode);
    return {
      updatedWorkflow: newWorkflow,
      message: 'Added Email Alert & Digest output node.',
    };
  }

  if (c.includes('condition') || c.includes('if')) {
    const condId = `cond-${Date.now().toString(36)}`;
    const condNode: WorkflowNode = {
      id: condId,
      type: 'condition',
      name: 'Confidence Filter (> 80%)',
      subtitle: 'Condition: Threshold Check',
      position: { x: 380, y: 400 },
      status: 'idle',
      config: {
        category: 'condition',
        field: 'confidence',
        operator: 'greater_than',
        value: 0.8,
        trueTargetLabel: 'YES',
        falseTargetLabel: 'NO',
      },
    };
    newWorkflow.nodes.push(condNode);
    return {
      updatedWorkflow: newWorkflow,
      message: 'Added Condition Filter node to branch workflow based on confidence.',
    };
  }

  // Generic acknowledgement with node addition
  const noteId = `tool-enrich-${Date.now().toString(36)}`;
  const toolNode: WorkflowNode = {
    id: noteId,
    type: 'tool',
    name: 'Web Scraper & API Call',
    subtitle: 'Tool Node',
    position: { x: 560, y: 320 },
    status: 'idle',
    config: {
      category: 'tool',
      toolName: 'Web Search',
      categoryType: 'web',
      parameters: { searchDepth: 'deep' },
    },
  };
  newWorkflow.nodes.push(toolNode);
  return {
    updatedWorkflow: newWorkflow,
    message: `Copilot executed: "${command}". Modified workflow topology.`,
  };
}
