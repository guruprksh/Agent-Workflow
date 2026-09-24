import React, { useState } from 'react';
import {
  Wrench,
  Search,
  CheckCircle2,
  ExternalLink,
  Plus,
  Sliders,
  Shield,
} from 'lucide-react';
import { TOOL_INTEGRATIONS } from '../../data/catalog';
import { ToolIntegration } from '../../types';

export const IntegrationsView: React.FC = () => {
  const [tools, setTools] = useState<ToolIntegration[]>(TOOL_INTEGRATIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'research', label: 'Research & Search' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'developer', label: 'Code & Sandboxes' },
    { id: 'database', label: 'Data & DBs' },
    { id: 'communication', label: 'Communication' },
  ];

  const filteredTools = tools.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesQuery =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const toggleConnection = (id: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, connected: !t.connected, isConnected: !t.connected } : t))
    );
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#0b0d11] p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Tool Integrations Marketplace</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Empower agents with search engines, execution sandboxes, databases, and OAuth connections.
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors self-start">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom OpenAPI Tool</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-[#12151e] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tool integrations..."
            className="w-full bg-[#12151e] border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-zinc-100 block">
                      {tool.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      {tool.category}
                    </span>
                  </div>
                </div>

                {tool.isConnected ? (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> CONNECTED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    DISCONNECTED
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500">
                {tool.isConnected ? 'OAuth active' : 'API key needed'}
              </span>
              <button
                onClick={() => toggleConnection(tool.id)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  tool.isConnected
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {tool.isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
