import React, { useState } from 'react';
import {
  X,
  Cpu,
  Sliders,
  FileCode,
  Wrench,
  BookOpen,
  Database,
  Shield,
  ArrowRightLeft,
  Check,
} from 'lucide-react';
import { WorkflowNode, AgentConfig } from '../../types';
import { TOOL_INTEGRATIONS, KNOWLEDGE_BASES } from '../../data/catalog';

interface AgentDetailPanelProps {
  node: WorkflowNode;
  onClose: () => void;
  onUpdateNode: (updatedNode: WorkflowNode) => void;
}

export const AgentDetailPanel: React.FC<AgentDetailPanelProps> = ({
  node,
  onClose,
  onUpdateNode,
}) => {
  const isAgent = node.type === 'agent' && node.config.category === 'agent';
  const [activeTab, setActiveTab] = useState<
    'general' | 'instructions' | 'model' | 'tools' | 'knowledge' | 'memory' | 'schemas' | 'permissions'
  >('general');

  // Local editing state for responsiveness
  const [localNode, setLocalNode] = useState<WorkflowNode>(JSON.parse(JSON.stringify(node)));

  const handleSave = (modified: WorkflowNode) => {
    setLocalNode(modified);
    onUpdateNode(modified);
  };

  const agentConfig = isAgent ? (localNode.config as AgentConfig & { category: 'agent' }) : null;

  const updateAgentField = <K extends keyof AgentConfig>(key: K, value: AgentConfig[K]) => {
    if (!agentConfig) return;
    const updatedConfig = { ...agentConfig, [key]: value };
    const updated = { ...localNode, config: updatedConfig };
    handleSave(updated);
  };

  const toggleTool = (toolName: string) => {
    if (!agentConfig) return;
    const current = agentConfig.tools || [];
    const next = current.includes(toolName)
      ? current.filter((t) => t !== toolName)
      : [...current, toolName];
    updateAgentField('tools', next);
  };

  const toggleKB = (kbName: string) => {
    if (!agentConfig) return;
    const current = agentConfig.knowledgeBases || [];
    const next = current.includes(kbName)
      ? current.filter((k) => k !== kbName)
      : [...current, kbName];
    updateAgentField('knowledgeBases', next);
  };

  const togglePermission = (permKey: keyof AgentConfig['permissions']) => {
    if (!agentConfig) return;
    const current = { ...agentConfig.permissions };
    current[permKey] = !current[permKey];
    updateAgentField('permissions', current);
  };

  return (
    <>
      {/* Mobile Backdrop on smaller viewports */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
      />

      <div className="fixed inset-y-0 right-0 w-full sm:w-96 md:w-[420px] lg:relative lg:w-96 h-full bg-[#11141b] border-l border-zinc-800 flex flex-col z-50 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-[#141721]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-md bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block leading-none font-semibold">
              Configuration
            </span>
            <span className="text-xs font-semibold text-zinc-100 truncate block mt-0.5">
              {localNode.name}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isAgent && agentConfig ? (
        <>
          {/* Tabs Navigation */}
          <div className="flex items-center overflow-x-auto border-b border-zinc-800 bg-[#0e1017] px-2 py-1 scrollbar-none text-[11px] font-medium">
            {[
              { id: 'general', label: 'General' },
              { id: 'instructions', label: 'Instructions' },
              { id: 'model', label: 'Model' },
              { id: 'tools', label: 'Tools' },
              { id: 'knowledge', label: 'Knowledge' },
              { id: 'memory', label: 'Memory' },
              { id: 'schemas', label: 'I/O Schema' },
              { id: 'permissions', label: 'Permissions' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-zinc-800 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* 1. General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={localNode.name}
                    onChange={(e) => {
                      const updated = { ...localNode, name: e.target.value };
                      handleSave(updated);
                    }}
                    className="w-full bg-[#181b24] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Specialist Role
                  </label>
                  <input
                    type="text"
                    value={agentConfig.role}
                    onChange={(e) => updateAgentField('role', e.target.value)}
                    className="w-full bg-[#181b24] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Description & Purpose
                  </label>
                  <textarea
                    rows={3}
                    value={localNode.description || ''}
                    onChange={(e) => {
                      const updated = { ...localNode, description: e.target.value };
                      handleSave(updated);
                    }}
                    className="w-full bg-[#181b24] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 2. Instructions Tab */}
            {activeTab === 'instructions' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-zinc-400">
                    System Prompt
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {agentConfig.systemPrompt.length} chars
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={agentConfig.systemPrompt}
                  onChange={(e) => updateAgentField('systemPrompt', e.target.value)}
                  className="w-full bg-[#181b24] border border-zinc-800 rounded-md p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                  placeholder="Define instructions, persona, constraints, and reasoning protocols..."
                />
                <p className="text-[10px] text-zinc-500 italic">
                  Defines the agent's core decision heuristics and domain boundaries.
                </p>
              </div>
            )}

            {/* 3. Model Tab */}
            {activeTab === 'model' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Foundation Model
                  </label>
                  <select
                    value={agentConfig.model}
                    onChange={(e) => {
                      updateAgentField('model', e.target.value);
                      handleSave({ ...localNode, subtitle: `Model: ${e.target.value}` });
                    }}
                    className="w-full bg-[#181b24] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Best Reasoning)</option>
                    <option value="GPT-4o">GPT-4o (Multimodal & Fast)</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Large Context Window)</option>
                    <option value="Llama 3.3 70B">Llama 3.3 70B (Open Weights)</option>
                    <option value="GPT-4o mini">GPT-4o mini (High Efficiency)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono text-zinc-400">Temperature</label>
                    <span className="font-mono text-zinc-300">{agentConfig.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={agentConfig.temperature}
                    onChange={(e) => updateAgentField('temperature', parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>Deterministic (0.0)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Max Output Tokens
                  </label>
                  <input
                    type="number"
                    value={agentConfig.maxTokens}
                    onChange={(e) => updateAgentField('maxTokens', parseInt(e.target.value) || 2048)}
                    className="w-full bg-[#181b24] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Reasoning Effort Level
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-[#181b24] p-1 rounded-md border border-zinc-800">
                    {(['low', 'medium', 'high'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => updateAgentField('reasoningLevel', lvl)}
                        className={`py-1 text-[11px] font-mono uppercase rounded transition-colors ${
                          agentConfig.reasoningLevel === lvl
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Tools Tab */}
            {activeTab === 'tools' && (
              <div className="space-y-3">
                <div className="text-[11px] text-zinc-400">
                  Select tools that this agent is authorized to invoke during autonomous execution:
                </div>
                <div className="space-y-1.5">
                  {TOOL_INTEGRATIONS.map((tool) => {
                    const isEnabled = agentConfig.tools.includes(tool.name);
                    return (
                      <div
                        key={tool.id}
                        onClick={() => toggleTool(tool.name)}
                        className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-colors ${
                          isEnabled
                            ? 'bg-indigo-950/30 border-indigo-500/40 text-zinc-100'
                            : 'bg-[#181b24]/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-medium text-zinc-200">{tool.name}</div>
                          <div className="text-[10px] text-zinc-500 line-clamp-1">{tool.description}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isEnabled
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'border-zinc-700 bg-zinc-900'
                          }`}
                        >
                          {isEnabled && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Knowledge Tab */}
            {activeTab === 'knowledge' && (
              <div className="space-y-3">
                <div className="text-[11px] text-zinc-400">
                  Attach curated knowledge bases to ground this agent in verified domain documents:
                </div>
                <div className="space-y-2">
                  {KNOWLEDGE_BASES.map((kb) => {
                    const isAttached = (agentConfig.knowledgeBases || []).includes(kb.name);
                    return (
                      <div
                        key={kb.id}
                        onClick={() => toggleKB(kb.name)}
                        className={`p-2.5 rounded-md border cursor-pointer transition-colors ${
                          isAttached
                            ? 'bg-indigo-950/30 border-indigo-500/40'
                            : 'bg-[#181b24]/60 border-zinc-800/80 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs text-zinc-200">{kb.name}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{kb.documentCount} docs</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-2">{kb.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. Memory Tab */}
            {activeTab === 'memory' && (
              <div className="space-y-4">
                <label className="block text-[11px] font-mono text-zinc-400">Memory Scope</label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'none',
                      title: 'None (Stateless)',
                      desc: 'Agent discards state after executing each prompt.',
                    },
                    {
                      id: 'workflow',
                      title: 'Workflow Execution Memory',
                      desc: 'Retains context across steps during the current workflow run.',
                    },
                    {
                      id: 'persistent',
                      title: 'Persistent Cross-Run Memory',
                      desc: 'Preserves learned preferences, cached entities, and citations across all historical runs.',
                    },
                  ].map((mem) => (
                    <div
                      key={mem.id}
                      onClick={() => updateAgentField('memoryType', mem.id as any)}
                      className={`p-3 rounded-md border cursor-pointer transition-colors ${
                        agentConfig.memoryType === mem.id
                          ? 'bg-indigo-950/40 border-indigo-500 text-zinc-100'
                          : 'bg-[#181b24]/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-semibold text-xs text-zinc-200 mb-0.5">{mem.title}</div>
                      <div className="text-[11px] text-zinc-500">{mem.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Schemas Tab */}
            {activeTab === 'schemas' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Input Schema (JSON Schema)
                  </label>
                  <textarea
                    rows={4}
                    value={agentConfig.inputSchema}
                    onChange={(e) => updateAgentField('inputSchema', e.target.value)}
                    className="w-full bg-[#181b24] border border-zinc-800 rounded-md p-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Output Schema (Structured Enforcement)
                  </label>
                  <textarea
                    rows={6}
                    value={agentConfig.outputSchema}
                    onChange={(e) => updateAgentField('outputSchema', e.target.value)}
                    className="w-full bg-[#181b24] border border-zinc-800 rounded-md p-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* 8. Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="space-y-3">
                <div className="text-[11px] text-zinc-400">
                  Granular permission gates control what resources this agent can access autonomously:
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'readFiles', label: 'Read Workspace Files & PDFs' },
                    { key: 'writeFiles', label: 'Write Files & Datasets' },
                    { key: 'sendEmails', label: 'Send Outbound Emails' },
                    { key: 'searchWeb', label: 'Access Live Web Search & Scraping' },
                    { key: 'executeCode', label: 'Execute Code in Sandbox Runtime' },
                    { key: 'callAPIs', label: 'Invoke External REST APIs' },
                  ].map((perm) => {
                    const enabled = agentConfig.permissions[perm.key as keyof AgentConfig['permissions']];
                    return (
                      <div
                        key={perm.key}
                        onClick={() => togglePermission(perm.key as any)}
                        className="flex items-center justify-between p-2.5 rounded-md bg-[#181b24] border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
                      >
                        <span className="text-xs text-zinc-200">{perm.label}</span>
                        <div
                          className={`w-8 h-4 rounded-full transition-colors relative ${
                            enabled ? 'bg-indigo-600' : 'bg-zinc-700'
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                              enabled ? 'translate-x-4' : 'translate-x-0.5'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Config for non-agent nodes (Trigger, Condition, Approval, Tool, Memory, Output) */
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Node Title</label>
            <input
              type="text"
              value={localNode.name}
              onChange={(e) => {
                const updated = { ...localNode, name: e.target.value };
                handleSave(updated);
              }}
              className="w-full bg-[#181b24] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Subtitle / Summary</label>
            <input
              type="text"
              value={localNode.subtitle || ''}
              onChange={(e) => {
                const updated = { ...localNode, subtitle: e.target.value };
                handleSave(updated);
              }}
              className="w-full bg-[#181b24] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={localNode.description || ''}
              onChange={(e) => {
                const updated = { ...localNode, description: e.target.value };
                handleSave(updated);
              }}
              className="w-full bg-[#181b24] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Condition settings */}
          {localNode.type === 'condition' && localNode.config.category === 'condition' && (
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <div className="text-[11px] font-mono text-amber-400 font-semibold">
                Branching Logic
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Evaluation Field</label>
                <input
                  type="text"
                  value={localNode.config.field}
                  onChange={(e) => {
                    const cfg = { ...localNode.config, field: e.target.value };
                    handleSave({ ...localNode, config: cfg as any });
                  }}
                  className="w-full bg-[#181b24] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Threshold Value</label>
                <input
                  type="text"
                  value={String(localNode.config.value)}
                  onChange={(e) => {
                    const cfg = { ...localNode.config, value: e.target.value };
                    handleSave({ ...localNode, config: cfg as any });
                  }}
                  className="w-full bg-[#181b24] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100"
                />
              </div>
            </div>
          )}

          {/* Approval settings */}
          {localNode.type === 'approval' && localNode.config.category === 'approval' && (
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <div className="text-[11px] font-mono text-orange-400 font-semibold">
                Human Approval Checkpoint
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Approver Role</label>
                <input
                  type="text"
                  value={localNode.config.approverRole}
                  onChange={(e) => {
                    const cfg = { ...localNode.config, approverRole: e.target.value };
                    handleSave({ ...localNode, config: cfg as any });
                  }}
                  className="w-full bg-[#181b24] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Approval Prompt</label>
                <textarea
                  rows={3}
                  value={localNode.config.prompt}
                  onChange={(e) => {
                    const cfg = { ...localNode.config, prompt: e.target.value };
                    handleSave({ ...localNode, config: cfg as any });
                  }}
                  className="w-full bg-[#181b24] border border-zinc-800 rounded-md p-2 text-xs text-zinc-100 resize-none"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};
