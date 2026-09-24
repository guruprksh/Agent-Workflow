import React from 'react';
import { X, AlertCircle, AlertTriangle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { ValidationIssue } from '../../types';

interface ValidationDrawerProps {
  issues: ValidationIssue[];
  onSelectNode: (nodeId: string) => void;
  onClose: () => void;
}

export const ValidationDrawer: React.FC<ValidationDrawerProps> = ({
  issues,
  onSelectNode,
  onClose,
}) => {
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  return (
    <div className="absolute top-16 left-4 z-40 w-96 bg-[#12151d] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-4 py-3 bg-[#151824] border-b border-zinc-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-100">Workflow Validation</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
              {issues.length} {issues.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            Topology & Configuration Health Check
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Issues list */}
      <div className="max-h-[380px] overflow-y-auto p-3 space-y-2 text-xs">
        {issues.length === 0 ? (
          <div className="py-6 text-center text-zinc-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-medium text-zinc-200">Workflow Ready to Run</div>
            <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
              All agent schemas, tool bindings, triggers, and branches have passed verification.
            </p>
          </div>
        ) : (
          issues.map((issue) => {
            const isErr = issue.severity === 'error';
            const isWarn = issue.severity === 'warning';
            const Icon = isErr ? AlertCircle : isWarn ? AlertTriangle : Info;

            return (
              <div
                key={issue.id}
                onClick={() => issue.nodeId && onSelectNode(issue.nodeId)}
                className={`p-3 rounded-lg border transition-all ${
                  issue.nodeId ? 'cursor-pointer hover:border-zinc-600' : ''
                } ${
                  isErr
                    ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                    : 'bg-blue-950/20 border-blue-900/40 text-blue-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Icon
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isErr ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-blue-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-zinc-100">{issue.message}</span>
                      {issue.nodeId && (
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      {issue.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
