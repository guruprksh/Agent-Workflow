import React, { useState } from 'react';
import {
  LayoutTemplate,
  Cpu,
  Wrench,
  ArrowRight,
  Search,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { WORKFLOW_TEMPLATES } from '../../data/catalog';
import { WorkflowTemplate, Workflow } from '../../types';
import { DEMO_WORKFLOWS } from '../../data/demoWorkflows';

interface TemplatesViewProps {
  onUseTemplate: (workflow: Workflow) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onUseTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'research', label: 'Research & Academia' },
    { id: 'sales', label: 'Sales & Growth' },
    { id: 'engineering', label: 'Engineering & DevOps' },
    { id: 'operations', label: 'Operations & Support' },
  ];

  const filteredTemplates = WORKFLOW_TEMPLATES.filter((tpl) => {
    const matchesCat = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesQuery =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleApplyTemplate = (tpl: WorkflowTemplate) => {
    // Map template to a corresponding rich demo workflow or fallback
    let matched = DEMO_WORKFLOWS.find(
      (w) => w.name.toLowerCase().includes(tpl.title.toLowerCase().slice(0, 8))
    );
    if (!matched) {
      matched = DEMO_WORKFLOWS[0];
    }
    onUseTemplate(matched);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#0b0d11] p-8 space-y-6">
      {/* Header */}
      <div className="space-y-1 border-b border-zinc-800 pb-5">
        <h1 className="text-xl font-semibold text-zinc-100">Workflow Templates</h1>
        <p className="text-xs text-zinc-400">
          Battle-tested multi-agent blueprints with pre-connected tools, schemas, and human checkpoints.
        </p>
      </div>

      {/* Filter and Category tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-[#12151e] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-[#12151e] border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="font-semibold text-sm text-zinc-100 group-hover:text-indigo-300 transition-colors">
                  {tpl.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                  {tpl.category}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                {tpl.description}
              </p>

              {/* Stats */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-4 text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1 text-zinc-300">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  {tpl.agentCount ?? tpl.agents.length} Agents
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  {(tpl.toolsIncluded ?? tpl.tools).length} Tools
                </span>
              </div>

              {/* Tools chips */}
              <div className="flex flex-wrap gap-1">
                {(tpl.toolsIncluded ?? tpl.tools).slice(0, 3).map((tool: string, i: number) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom action */}
            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 font-mono">
                {(tpl.usageCount ?? 28).toLocaleString()} uses
              </span>
              <button
                onClick={() => handleApplyTemplate(tpl)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
