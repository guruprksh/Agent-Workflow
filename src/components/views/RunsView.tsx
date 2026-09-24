import React, { useState } from 'react';
import {
  PlaySquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Search,
  Filter,
  DollarSign,
  Cpu,
} from 'lucide-react';
import { RUN_TRACES } from '../../data/catalog';
import { RunTrace } from '../../types';

interface RunsViewProps {
  onOpenLiveRun: (trace: RunTrace) => void;
}

export const RunsView: React.FC<RunsViewProps> = ({ onOpenLiveRun }) => {
  const [selectedRun, setSelectedRun] = useState<RunTrace | null>(RUN_TRACES[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [runsList, setRunsList] = useState<RunTrace[]>(RUN_TRACES);

  const filteredRuns = runsList.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const handleApprovePending = (runId: string) => {
    setRunsList((prev) =>
      prev.map((r) =>
        r.id === runId
          ? {
              ...r,
              status: 'completed',
              duration: '1m 24s',
              steps: r.steps.map((s) => ({ ...s, status: 'completed' })),
            }
          : r
      )
    );
    if (selectedRun?.id === runId) {
      setSelectedRun((prev) => (prev ? { ...prev, status: 'completed' } : null));
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#0b0d11] p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Workflow Runs & Audit Logs</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time execution telemetry, agent-to-agent traces, token consumption, and human approvals.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-[#141722] p-1 rounded-lg border border-zinc-800">
          {(['all', 'completed', 'waiting_approval', 'running', 'failed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs rounded font-medium capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Runs List + Trace Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Runs Table / List */}
        <div className="lg:col-span-2 space-y-2">
          {filteredRuns.map((run) => {
            const isSelected = selectedRun?.id === run.id;
            const isApprovalWaiting = run.status === 'waiting_approval';
            const isCompleted = run.status === 'completed';
            const isFailed = run.status === 'failed';

            return (
              <div
                key={run.id}
                onClick={() => setSelectedRun(run)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-950/20 border-indigo-500/80 shadow-md'
                    : isApprovalWaiting
                    ? 'bg-amber-950/15 border-amber-800/40 hover:border-amber-700'
                    : 'bg-[#12151e] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-zinc-200">
                      {run.id}
                    </span>
                    <span className="text-zinc-500">·</span>
                    <span className="font-semibold text-xs text-zinc-100">
                      {run.workflowName}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isApprovalWaiting ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 text-[11px] font-mono animate-pulse">
                        <ShieldAlert className="w-3.5 h-3.5" /> AWAITING APPROVAL
                      </span>
                    ) : isCompleted ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED
                      </span>
                    ) : isFailed ? (
                      <span className="flex items-center gap-1 text-rose-400 font-mono text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5" /> FAILED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-indigo-400 font-mono text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" /> RUNNING
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
                  <div className="flex items-center gap-3">
                    <span>Started: {run.startedAt}</span>
                    <span>·</span>
                    <span>Duration: {run.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{(run.tokenUsage?.total ?? 3420).toLocaleString()} tokens</span>
                    <span>·</span>
                    <span className="text-zinc-300">${(run.costUsd ?? 0.048).toFixed(4)}</span>
                  </div>
                </div>

                {/* Inline Action for Pending Approval */}
                {isApprovalWaiting && (
                  <div className="mt-3 pt-2.5 border-t border-amber-900/40 flex items-center justify-between">
                    <span className="text-xs text-amber-300">
                      Research Agent requested permission to index 8 papers.
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprovePending(run.id);
                      }}
                      className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      Authorize Execution
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Step-by-Step Execution Trace Details */}
        {selectedRun && (
          <div className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 space-y-4 text-xs h-fit sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <div className="font-semibold text-sm text-zinc-100">{selectedRun.id}</div>
                <div className="text-[10px] font-mono text-zinc-400">
                  {selectedRun.workflowName}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-zinc-300 text-xs">${(selectedRun.costUsd ?? 0.048).toFixed(4)}</div>
                <div className="text-[10px] font-mono text-zinc-500">
                  {(selectedRun.tokenUsage?.total ?? 3420).toLocaleString()} tokens
                </div>
              </div>
            </div>

            {/* Trace Steps Timeline */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Execution Steps ({selectedRun.steps.length})
              </span>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {selectedRun.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-3 rounded-lg bg-[#161924] border border-zinc-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : step.status === 'paused' ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        )}
                        <span className="font-semibold text-zinc-200">{step.nodeName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{step.duration}</span>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {step.reasoningSummary}
                    </p>

                    {step.toolCalls && step.toolCalls.length > 0 && (
                      <div className="pt-1 text-[10px] font-mono text-cyan-400">
                        Tool invoked: {step.toolCalls.map((t) => t.tool).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
