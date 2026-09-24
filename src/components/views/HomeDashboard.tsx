import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  LayoutTemplate,
  Play,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  Plus,
} from 'lucide-react';
import { Workflow } from '../../types';

interface HomeDashboardProps {
  workflows: Workflow[];
  onSelectWorkflow: (wf: Workflow) => void;
  onOpenGeneratorWithPrompt: (prompt: string) => void;
  onNavigateTab: (tab: string) => void;
  onRunWorkflowNow: (wf: Workflow) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  workflows,
  onSelectWorkflow,
  onOpenGeneratorWithPrompt,
  onNavigateTab,
  onRunWorkflowNow,
}) => {
  const [promptInput, setPromptInput] = useState('');

  const samplePrompts = [
    'Monitor new research papers about composite materials, identify relevant papers, summarize them and add them to my research library.',
    'Score inbound leads, enrich with Clearbit & LinkedIn, check enterprise tier criteria, and alert sales AE on Slack.',
    'Check competitor pricing pages weekly, detect diffs, summarize threat impacts, and publish to Notion wiki.',
  ];

  const handleBuild = () => {
    if (!promptInput.trim()) {
      onOpenGeneratorWithPrompt(samplePrompts[0]);
    } else {
      onOpenGeneratorWithPrompt(promptInput);
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#0b0d11] p-8 space-y-10">
      {/* Central Hero Input Card */}
      <div className="max-w-4xl mx-auto pt-6 space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Autonomous Multi-Agent Orchestration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            What do you want your AI team to do?
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Describe the job in plain English. AgentFlow automatically designs the team, connects tools, sets up human approval checkpoints, and prepares the visual workflow.
          </p>
        </div>

        {/* Big Search Input Box */}
        <div className="bg-[#12151f] border border-zinc-800 rounded-xl p-2.5 shadow-2xl focus-within:border-indigo-500 transition-colors">
          <textarea
            rows={3}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g. Monitor new research papers about composite materials, identify relevant papers, summarize them and add them to my research library..."
            className="w-full bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none resize-none leading-relaxed"
          />

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-zinc-400">
              <span className="font-mono text-zinc-500">Try:</span>
              <button
                onClick={() => setPromptInput(samplePrompts[0])}
                className="hover:text-indigo-300 truncate max-w-xs transition-colors"
              >
                Research paper monitor
              </button>
              <span>·</span>
              <button
                onClick={() => setPromptInput(samplePrompts[1])}
                className="hover:text-indigo-300 truncate max-w-xs transition-colors"
              >
                Lead qualification
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('templates')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
              >
                Start from Template
              </button>
              <button
                onClick={handleBuild}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Build Workflow</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#12151e] border border-zinc-800/80 space-y-1">
          <span className="text-[11px] font-mono text-zinc-500">ACTIVE WORKFLOWS</span>
          <div className="text-xl font-semibold text-zinc-100">
            {workflows.filter((w) => w.status === 'active').length}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Running on schedule</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#12151e] border border-zinc-800/80 space-y-1">
          <span className="text-[11px] font-mono text-zinc-500">AUTONOMOUS AGENTS</span>
          <div className="text-xl font-semibold text-zinc-100">
            {workflows.reduce((acc, w) => acc + w.agentCount, 0)}
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">Coordinated in teams</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#12151e] border border-zinc-800/80 space-y-1">
          <span className="text-[11px] font-mono text-zinc-500">AVERAGE SUCCESS RATE</span>
          <div className="text-xl font-semibold text-emerald-400">98.4%</div>
          <span className="text-[10px] text-zinc-400 font-mono">Over 780 executions</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#12151e] border border-zinc-800/80 space-y-1">
          <span className="text-[11px] font-mono text-zinc-500">EST. TIME SAVED</span>
          <div className="text-xl font-semibold text-indigo-300">148 hrs</div>
          <span className="text-[10px] text-zinc-400 font-mono">This month</span>
        </div>
      </div>

      {/* Recent Workflows Section */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Recent Workflows</h2>
            <p className="text-xs text-zinc-400">
              Active multi-agent systems and their real-time execution states
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('workflows')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            <span>View all workflows</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Workflows List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => {
                onSelectWorkflow(wf);
                onNavigateTab('workflows');
              }}
              className="p-4 rounded-xl bg-[#12151e] border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-zinc-100 group-hover:text-indigo-300 transition-colors">
                    {wf.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        wf.status === 'active'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {wf.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {wf.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    {wf.agentCount} Agents
                  </span>
                  <span>·</span>
                  <span>Last run: {wf.lastRunAt || 'Never'}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRunWorkflowNow(wf);
                  }}
                  className="px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all flex items-center gap-1 font-semibold"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
