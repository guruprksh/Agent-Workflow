import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Layers,
  ShieldAlert,
  Wrench,
  Database,
  Cpu,
  CheckCircle2,
  Play,
} from 'lucide-react';

interface LandingPageViewProps {
  onEnterApp: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterApp }) => {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#08090d] text-zinc-100 select-none">
      {/* Top Nav */}
      <header className="border-b border-zinc-800/80 bg-[#08090d]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-bold text-sm tracking-tight">
              AF
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              AgentFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onEnterApp}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onEnterApp}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>The Autonomous Multi-Agent Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Build AI Teams That Do Real Work.
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Describe the work. Build the team. Let the team execute it. AgentFlow turns high-level prompts into visual, verifiable multi-agent architectures with human-in-the-loop oversight.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Building for Free</span>
          </button>
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-medium border border-zinc-800 transition-all"
          >
            <Play className="w-4 h-4 text-indigo-400 fill-current" />
            <span>Interactive Demo</span>
          </button>
        </div>
      </section>

      {/* Canvas UI Graphic / Mock Preview */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div
          onClick={onEnterApp}
          className="rounded-2xl border border-zinc-800/80 bg-[#10131c] shadow-2xl p-4 sm:p-6 overflow-hidden relative cursor-pointer group hover:border-indigo-500/50 transition-all"
        >
          {/* Mock Canvas Toolbar */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-200">
                Research Paper Monitor & Synthesizer
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                v2.1 Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" /> Ready to Run
              </span>
              <span className="px-3 py-1 rounded bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1">
                <Play className="w-3 h-3 fill-current" /> Run Workflow
              </span>
            </div>
          </div>

          {/* Connected Cards Mockup */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-4">
            <div className="p-3.5 rounded-xl bg-[#141722] border border-sky-500/40 space-y-1">
              <span className="text-[10px] font-mono text-sky-400 font-semibold">TRIGGER</span>
              <div className="font-semibold text-xs text-white">Cron: Every Monday 08:00</div>
              <div className="text-[10px] text-zinc-400">Automated schedule</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141722] border border-indigo-500/60 space-y-1 shadow-lg shadow-indigo-500/10">
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">AGENT 1</span>
              <div className="font-semibold text-xs text-white">Domain Researcher</div>
              <div className="text-[10px] text-zinc-400">ArXiv & Semantic Scholar</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141722] border border-orange-500/60 space-y-1">
              <span className="text-[10px] font-mono text-orange-400 font-semibold">HUMAN APPROVAL</span>
              <div className="font-semibold text-xs text-white">Authorize Synthesis</div>
              <div className="text-[10px] text-zinc-400">Operator review gate</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141722] border border-violet-500/40 space-y-1">
              <span className="text-[10px] font-mono text-violet-400 font-semibold">OUTPUT</span>
              <div className="font-semibold text-xs text-white">Zotero & Slack</div>
              <div className="text-[10px] text-zinc-400">Persist to knowledge base</div>
            </div>
          </div>

          <div className="text-center pt-4 text-xs text-zinc-500 font-mono">
            Click to open interactive visual workspace →
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Engineered for production multi-agent workflows
          </h2>
          <p className="text-xs text-zinc-400">
            Everything your team needs to deploy autonomous systems safely.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 space-y-2.5">
            <div className="p-2 w-fit rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100">Multi-Agent Collaboration</h3>
            <p className="text-zinc-400 leading-relaxed">
              Orchestrate specialized agents into teams with distinct roles: Coordinators, Researchers, Reviewers, and Writers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 space-y-2.5">
            <div className="p-2 w-fit rounded-lg bg-orange-950/60 border border-orange-500/30 text-orange-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100">Human-in-the-Loop Gates</h3>
            <p className="text-zinc-400 leading-relaxed">
              Insert approval checkpoints where agents pause execution and wait for human review before taking critical actions.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 space-y-2.5">
            <div className="p-2 w-fit rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100">RAG & Shared Memory</h3>
            <p className="text-zinc-400 leading-relaxed">
              Connect your company knowledge bases and give agents cross-run memory to learn domain preferences over time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 px-6 text-center text-xs text-zinc-500 font-mono">
        AgentFlow Multi-Agent Operating System · Built for autonomous enterprise teams
      </footer>
    </div>
  );
};
