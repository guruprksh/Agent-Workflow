import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Play,
  Bot,
  LayoutTemplate,
  Layers,
  Wrench,
  Settings,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Workflow } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  workflows: Workflow[];
  onSelectWorkflow: (wf: Workflow) => void;
  onNavigateTab: (tab: string) => void;
  onOpenGenerator: () => void;
  onRunWorkflow: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  workflows,
  onSelectWorkflow,
  onNavigateTab,
  onOpenGenerator,
  onRunWorkflow,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredWorkflows = workflows.filter((w) =>
    w.name.toLowerCase().includes(query.toLowerCase())
  );

  const actions = [
    {
      id: 'act-new-wf',
      title: 'Generate New Workflow with AI',
      subtitle: 'Describe goal in natural language',
      icon: Sparkles,
      color: 'text-indigo-400',
      action: () => {
        onClose();
        onOpenGenerator();
      },
    },
    {
      id: 'act-run',
      title: 'Run Current Active Workflow',
      subtitle: 'Execute live simulation pipeline',
      icon: Play,
      color: 'text-emerald-400',
      action: () => {
        onClose();
        onRunWorkflow();
      },
    },
    {
      id: 'act-agents',
      title: 'Browse Reusable Agents & Teams',
      subtitle: 'Coordinator, Reviewer, Librarian catalogue',
      icon: Bot,
      color: 'text-cyan-400',
      action: () => {
        onClose();
        onNavigateTab('agents');
      },
    },
    {
      id: 'act-templates',
      title: 'Explore Workflow Templates',
      subtitle: 'Pre-built research, sales & developer templates',
      icon: LayoutTemplate,
      color: 'text-amber-400',
      action: () => {
        onClose();
        onNavigateTab('templates');
      },
    },
    {
      id: 'act-integrations',
      title: 'Configure Tool Marketplace & Integrations',
      subtitle: 'APIs, web tools, databases, and OAuth connections',
      icon: Wrench,
      color: 'text-sky-400',
      action: () => {
        onClose();
        onNavigateTab('integrations');
      },
    },
    {
      id: 'act-settings',
      title: 'Open Settings & LLM Model Keys',
      subtitle: 'Configure foundation models and workspace',
      icon: Settings,
      color: 'text-zinc-400',
      action: () => {
        onClose();
        onNavigateTab('settings');
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="w-full max-w-xl bg-[#12151e] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-zinc-800 flex items-center gap-3 bg-[#151824]">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search workflows..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 text-xs">
          {/* Workflows matches */}
          {filteredWorkflows.length > 0 && (
            <div className="mb-2">
              <div className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 font-semibold">
                Workflows
              </div>
              {filteredWorkflows.map((wf) => (
                <button
                  key={wf.id}
                  onClick={() => {
                    onSelectWorkflow(wf);
                    onClose();
                    onNavigateTab('workflows');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#1a1e2b] text-zinc-300 hover:text-white transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-zinc-100">{wf.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {wf.agentCount} agents · {wf.status}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 font-semibold">
              Platform Actions
            </div>
            {actions
              .filter((a) => a.title.toLowerCase().includes(query.toLowerCase()))
              .map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#1a1e2b] text-zinc-300 hover:text-white transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${action.color} shrink-0`} />
                      <div>
                        <div className="font-semibold text-zinc-100">{action.title}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {action.subtitle}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </button>
                );
              })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-800/80 bg-[#0e1017] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Navigate with arrows / click</span>
          <span>AgentFlow Quick Command</span>
        </div>
      </div>
    </div>
  );
};
