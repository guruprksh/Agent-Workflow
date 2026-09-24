import React from 'react';
import { X, Layers, Check, Copy, RotateCcw, Clock } from 'lucide-react';
import { Workflow, WorkflowVersion } from '../../types';

interface VersionHistoryModalProps {
  workflow: Workflow;
  onClose: () => void;
  onRestoreVersion: (version: WorkflowVersion) => void;
  onSaveCurrentAsVersion: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  workflow,
  onClose,
  onRestoreVersion,
  onSaveCurrentAsVersion,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#12151d] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#151824] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-zinc-100">Workflow Version History</span>
              <span className="text-[10px] text-zinc-500 font-mono block">
                Immutable Snapshots & Rollback
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Versions List */}
        <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto text-xs">
          {workflow.versions.map((ver) => (
            <div
              key={ver.id}
              className={`p-3.5 rounded-lg border transition-all ${
                ver.isActive
                  ? 'bg-indigo-950/30 border-indigo-500/50'
                  : 'bg-[#181b24]/60 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-indigo-300 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    {ver.version}
                  </span>
                  <span className="font-semibold text-zinc-100">{ver.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{ver.createdAt}</span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 mb-3">{ver.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                {ver.isActive ? (
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> CURRENTLY ACTIVE
                  </span>
                ) : (
                  <button
                    onClick={() => onRestoreVersion(ver)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-indigo-400" />
                    Restore this version
                  </button>
                )}

                <span className="text-[10px] font-mono text-zinc-500">
                  {ver.nodes.length > 0 ? `${ver.nodes.length} nodes` : 'Snapshot'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#151824] border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={onSaveCurrentAsVersion}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            Snapshot Current as New Version
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
