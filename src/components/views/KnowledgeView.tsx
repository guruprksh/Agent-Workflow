import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Upload,
  Search,
  FileText,
  Database,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { KNOWLEDGE_BASES } from '../../data/catalog';
import { KnowledgeBase } from '../../types';

export const KnowledgeView: React.FC = () => {
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeBase[]>(KNOWLEDGE_BASES);
  const [selectedKb, setSelectedKb] = useState<KnowledgeBase | null>(KNOWLEDGE_BASES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [testQuery, setTestQuery] = useState('');
  const [queryResults, setQueryResults] = useState<string[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleTestSearch = () => {
    if (!testQuery.trim()) return;
    setIsQuerying(true);
    setTimeout(() => {
      setQueryResults([
        `Chunk #104 [Score: 0.94]: "...composite laminate specimens under cyclic tensile fatigue exhibited matrix microcracking prior to delamination onset..."`,
        `Chunk #281 [Score: 0.88]: "...piezoelectric transducers detected second harmonic ultrasonic wave generation at 5 MHz frequency bands..."`,
      ]);
      setIsQuerying(false);
    }, 500);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#0b0d11] p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Knowledge Bases</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Ground autonomous agents in proprietary documents, research collections, and API schemas.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors self-start">
          <Plus className="w-3.5 h-3.5" />
          <span>New Knowledge Base</span>
        </button>
      </div>

      {/* Grid: Knowledge Base Cards & Semantic Query Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: KB List */}
        <div className="lg:col-span-2 space-y-3">
          {knowledgeList.map((kb) => {
            const isSelected = selectedKb?.id === kb.id;
            return (
              <div
                key={kb.id}
                onClick={() => setSelectedKb(kb)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-950/20 border-indigo-500/80 shadow-md'
                    : 'bg-[#12151e] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-zinc-100">{kb.name}</div>
                      <div className="text-[10px] font-mono text-zinc-400">
                        {kb.embeddingModel} · Chunk size {kb.chunkSize}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> INDEXED
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                  {kb.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-400">
                  <span>{kb.documentCount} Documents</span>
                  <span>Updated {kb.lastUpdated}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Semantic RAG Retrieval Tester */}
        {selectedKb && (
          <div className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 space-y-4 text-xs h-fit sticky top-6">
            <div className="border-b border-zinc-800 pb-3">
              <span className="font-semibold text-sm text-zinc-100 block">{selectedKb.name}</span>
              <span className="text-[10px] font-mono text-zinc-500">
                Live Vector Retrieval Test
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-mono text-zinc-400">
                Semantic Similarity Query
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  placeholder="e.g. ultrasonic damage detection threshold..."
                  className="flex-1 bg-[#181b25] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleTestSearch}
                  className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                >
                  Query
                </button>
              </div>
            </div>

            {/* Results Preview */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Retrieved Context Chunks
              </span>
              {queryResults.length > 0 ? (
                queryResults.map((res, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded bg-[#161924] border border-zinc-800/80 font-mono text-[10px] text-zinc-300 leading-relaxed"
                  >
                    {res}
                  </div>
                ))
              ) : (
                <div className="p-4 rounded border border-zinc-800/60 bg-[#161924]/40 text-center text-zinc-500 text-[11px]">
                  Run a semantic query above to inspect similarity scoring.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
