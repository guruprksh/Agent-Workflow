import React, { useState } from 'react';
import { Database, Plus, Trash2, Search, Cpu, Key, Layers } from 'lucide-react';
import { MEMORY_ITEMS } from '../../data/catalog';
import { MemoryStoreItem } from '../../types';

export const MemoryView: React.FC = () => {
  const [items, setItems] = useState<MemoryStoreItem[]>(MEMORY_ITEMS);
  const [activeScope, setActiveScope] = useState<'all' | 'workspace' | 'agent' | 'workflow'>('all');
  const [search, setSearch] = useState('');

  const filtered = items.filter((item) => {
    const matchesScope = activeScope === 'all' || item.scope === activeScope;
    const matchesSearch =
      item.key.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(item.value).toLowerCase().includes(search.toLowerCase());
    return matchesScope && matchesSearch;
  });

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#0b0d11] p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Agent Memory System</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage ephemeral workflow state, cross-session agent memories, and workspace persistent stores.
          </p>
        </div>

        {/* Scope selector */}
        <div className="flex items-center gap-1 bg-[#141722] p-1 rounded-lg border border-zinc-800 self-start">
          {(['all', 'workflow', 'agent', 'workspace'] as const).map((sc) => (
            <button
              key={sc}
              onClick={() => setActiveScope(sc)}
              className={`px-3 py-1 text-xs rounded-md capitalize font-medium transition-colors ${
                activeScope === sc
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Items Table */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#12151e] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
                  {item.key}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">
                  {item.scope}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  Namespace: {item.namespace}
                </span>
              </div>
              <div className="font-mono text-xs text-zinc-300 bg-[#0e1017] p-2 rounded border border-zinc-900 overflow-x-auto">
                {JSON.stringify(item.value)}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
              <span className="text-[10px] font-mono text-zinc-500">
                Updated {item.updatedAt}
              </span>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-zinc-500 hover:text-rose-400 rounded transition-colors"
                title="Purge key"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
