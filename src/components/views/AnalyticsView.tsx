import React from 'react';
import {
  BarChart2,
  TrendingUp,
  DollarSign,
  Cpu,
  Clock,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#0b0d11] p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-xl font-semibold text-zinc-100">Workflow & Agent Analytics</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Autonomous team efficiency, cost per run, token distribution, and human intervention frequency.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#12151e] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-500">TOTAL EXECUTIONS</span>
          <div className="text-2xl font-semibold text-white">1,492</div>
          <span className="text-[10px] text-emerald-400 font-mono">↑ 18% this week</span>
        </div>

        <div className="p-4 rounded-xl bg-[#12151e] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-500">AVERAGE COST PER RUN</span>
          <div className="text-2xl font-semibold text-indigo-300">$0.0142</div>
          <span className="text-[10px] text-zinc-400 font-mono">~1,780 tokens / run</span>
        </div>

        <div className="p-4 rounded-xl bg-[#12151e] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-500">PIPELINE RELIABILITY</span>
          <div className="text-2xl font-semibold text-emerald-400">98.7%</div>
          <span className="text-[10px] text-zinc-400 font-mono">0.3% retried</span>
        </div>

        <div className="p-4 rounded-xl bg-[#12151e] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-500">HUMAN INTERVENTION RATE</span>
          <div className="text-2xl font-semibold text-amber-300">11.4%</div>
          <span className="text-[10px] text-zinc-400 font-mono">Pauses at approval gates</span>
        </div>
      </div>

      {/* Breakdown Charts / Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Consumption by Agent Specialist */}
        <div className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-zinc-100">
              Token Consumption by Agent Role
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Total: 4.8M tokens</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { role: 'Research Agent (Web & ArXiv)', pct: 44, color: 'bg-indigo-500' },
              { role: 'Summarizer & Synthesizer', pct: 26, color: 'bg-cyan-500' },
              { role: 'Reviewer & Fact Checker', pct: 18, color: 'bg-amber-500' },
              { role: 'Coordinator & Planner', pct: 12, color: 'bg-emerald-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-300">{item.role}</span>
                  <span className="font-mono text-zinc-400">{item.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    style={{ width: `${item.pct}%` }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Executed Workflows */}
        <div className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-zinc-100">
              Most Active Multi-Agent Pipelines
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Last 30 Days</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { name: 'Research Paper Monitor', runs: 420, avgDur: '48s', success: '98.8%' },
              { name: 'Customer Lead Analyzer', runs: 382, avgDur: '31s', success: '99.2%' },
              { name: 'GitHub Bug Investigator', runs: 215, avgDur: '1m 12s', success: '94.5%' },
              { name: 'Competitor Intelligence', runs: 160, avgDur: '55s', success: '97.4%' },
            ].map((wf, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[#161924] border border-zinc-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-zinc-200">{wf.name}</div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    Avg duration: {wf.avgDur}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-zinc-200 font-semibold">{wf.runs} runs</div>
                  <div className="text-[10px] font-mono text-emerald-400">{wf.success}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
