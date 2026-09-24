import React, { useState } from 'react';
import {
  Bot,
  Users,
  Plus,
  Search,
  BookOpen,
  ShieldCheck,
  BarChart3,
  PenTool,
  Activity,
  Cpu,
  ArrowRight,
  Sliders,
  Check,
  Share2,
  Workflow as WorkflowIcon,
} from 'lucide-react';
import { AgentTemplate, AgentTeam } from '../../types';
import { REUSABLE_AGENTS, AGENT_TEAMS } from '../../data/catalog';

interface AgentsViewProps {
  onAddAgentToWorkflow?: (agent: AgentTemplate) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({ onAddAgentToWorkflow }) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'teams'>('agents');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentTemplate | null>(REUSABLE_AGENTS[0]);
  const [selectedTeam, setSelectedTeam] = useState<AgentTeam | null>(AGENT_TEAMS[0]);

  const filteredAgents = REUSABLE_AGENTS.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#0b0d11] p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Agents & Agent Teams</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Create, configure, and orchestrate reusable autonomous specialist agents into collaborative teams.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[#141722] p-1 rounded-lg border border-zinc-800 self-start">
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'agents'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Reusable Agents ({REUSABLE_AGENTS.length})
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'teams'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Agent Teams ({AGENT_TEAMS.length})
          </button>
        </div>
      </div>

      {activeTab === 'agents' ? (
        /* Reusable Agents Grid & Inspector */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Agents List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reusable agents by name, role or capabilities..."
                className="w-full bg-[#12151e] border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredAgents.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-950/20 border-indigo-500/80 shadow-indigo-500/10'
                        : 'bg-[#12151e] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-zinc-100">{agent.name}</div>
                          <div className="text-[10px] font-mono text-zinc-400">{agent.role}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {agent.usageCount} workflows
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                      {agent.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-400">
                      <span className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                        {agent.model}
                      </span>
                      <span>{agent.tools.length} Tools</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Agent Specification */}
          {selectedAgent && (
            <div className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 space-y-4 text-xs h-fit sticky top-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-zinc-100 block">
                      {selectedAgent.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {selectedAgent.role}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                  Core Instructions / System Prompt
                </span>
                <div className="p-3 rounded-lg bg-[#0e1017] border border-zinc-800 text-zinc-300 font-mono text-[11px] leading-relaxed">
                  {selectedAgent.systemPrompt}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                  Authorized Tools
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedAgent.tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-[#161924] border border-zinc-700/80 text-[11px] text-zinc-300 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Model: {selectedAgent.model}</span>
                <span>Category: {selectedAgent.category}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Multi-Agent Teams Section */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AGENT_TEAMS.map((team) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTeam?.id === team.id
                    ? 'bg-indigo-950/20 border-indigo-500/80'
                    : 'bg-[#12151e] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs text-zinc-100">{team.name}</span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {team.description}
                </p>
                <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="uppercase text-indigo-400 font-semibold">
                    {team.hierarchyType}
                  </span>
                  <span>{team.memberAgentIds.length + 2} agents in team</span>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Team Hierarchy Diagram */}
          {selectedTeam && (
            <div className="p-6 rounded-xl bg-[#12151e] border border-zinc-800 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-zinc-100">
                    {selectedTeam.name} Architecture
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {selectedTeam.hierarchyType}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                  {selectedTeam.description}
                </p>
              </div>

              {/* Hierarchy Tree Visualization */}
              <div className="py-6 flex flex-col items-center space-y-6">
                {/* 1. Coordinator */}
                <div className="p-3 rounded-xl bg-indigo-950/50 border border-indigo-500 text-center w-64 shadow-lg shadow-indigo-500/10">
                  <div className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                    Coordinator
                  </div>
                  <div className="text-xs font-semibold text-white mt-0.5">
                    Team Orchestrator
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Delegates tasks & monitors dependencies
                  </div>
                </div>

                {/* Downward line connector */}
                <div className="w-0.5 h-6 bg-indigo-500/50" />

                {/* 2. Worker Agents Cluster */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
                  {selectedTeam.memberAgentIds.map((agentId, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#161924] border border-zinc-800 text-center"
                    >
                      <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                        Specialist #{i + 1}
                      </div>
                      <div className="text-xs font-semibold text-zinc-200 mt-0.5 capitalize">
                        {agentId.replace('agent-', '')}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        Parallel autonomous worker
                      </div>
                    </div>
                  ))}
                </div>

                {/* Downward line connector */}
                <div className="w-0.5 h-6 bg-indigo-500/50" />

                {/* 3. Synthesizer */}
                <div className="p-3 rounded-xl bg-violet-950/50 border border-violet-500 text-center w-64 shadow-lg shadow-violet-500/10">
                  <div className="text-[10px] font-mono text-violet-400 uppercase font-semibold">
                    Synthesizer & Writer
                  </div>
                  <div className="text-xs font-semibold text-white mt-0.5">
                    Unified Output Author
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Aggregates subagent results
                  </div>
                </div>
              </div>

              {/* Protocol Configuration Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800 text-xs">
                <div className="p-3 rounded-lg bg-[#141721] border border-zinc-800/80">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                    Shared Memory
                  </span>
                  <span className="font-semibold text-zinc-200">
                    {selectedTeam.sharedMemory ? 'Active (Cross-agent cache)' : 'Disabled'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#141721] border border-zinc-800/80">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                    Escalation Policy
                  </span>
                  <span className="font-semibold text-zinc-200 truncate block" title={selectedTeam.escalationPolicy}>
                    {selectedTeam.escalationPolicy}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#141721] border border-zinc-800/80">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                    Communication Protocol
                  </span>
                  <span className="font-semibold text-zinc-200">
                    Structured JSON RPC & Blackboard
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
