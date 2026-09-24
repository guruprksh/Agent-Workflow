import React from 'react';
import {
  Clock,
  Cpu,
  Wrench,
  GitBranch,
  ShieldAlert,
  Database,
  Send,
  MoreHorizontal,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Play,
  Settings,
} from 'lucide-react';
import { WorkflowNode } from '../../types';

interface NodeCardProps {
  node: WorkflowNode;
  isSelected: boolean;
  isConnecting?: boolean;
  onSelect: (nodeId: string) => void;
  onStartConnect: (nodeId: string, handle: string, e: React.MouseEvent) => void;
  onEndConnect: (nodeId: string, e: React.MouseEvent) => void;
  onDelete: (nodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
  onOpenConfig: (node: WorkflowNode) => void;
  onMouseDown: (nodeId: string, e: React.MouseEvent) => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  node,
  isSelected,
  onSelect,
  onStartConnect,
  onEndConnect,
  onDelete,
  onDuplicate,
  onOpenConfig,
  onMouseDown,
}) => {
  const isAgent = node.type === 'agent';
  const isCondition = node.type === 'condition';
  const isApproval = node.type === 'approval';
  const isTrigger = node.type === 'trigger';
  const isTool = node.type === 'tool';
  const isMemory = node.type === 'memory';
  const isOutput = node.type === 'output';

  // Category styling
  const getCategoryTheme = () => {
    switch (node.type) {
      case 'trigger':
        return {
          icon: Clock,
          color: 'text-sky-400',
          bgHeader: 'bg-sky-950/40',
          borderAccent: 'border-sky-500/30',
          badgeText: 'TRIGGER',
        };
      case 'agent':
        return {
          icon: Cpu,
          color: 'text-indigo-400',
          bgHeader: 'bg-indigo-950/40',
          borderAccent: 'border-indigo-500/40',
          badgeText: 'AGENT',
        };
      case 'tool':
        return {
          icon: Wrench,
          color: 'text-cyan-400',
          bgHeader: 'bg-cyan-950/40',
          borderAccent: 'border-cyan-500/30',
          badgeText: 'TOOL',
        };
      case 'condition':
        return {
          icon: GitBranch,
          color: 'text-amber-400',
          bgHeader: 'bg-amber-950/40',
          borderAccent: 'border-amber-500/40',
          badgeText: 'BRANCH',
        };
      case 'approval':
        return {
          icon: ShieldAlert,
          color: 'text-orange-400',
          bgHeader: 'bg-orange-950/40',
          borderAccent: 'border-orange-500/50',
          badgeText: 'HUMAN APPROVAL',
        };
      case 'memory':
        return {
          icon: Database,
          color: 'text-emerald-400',
          bgHeader: 'bg-emerald-950/40',
          borderAccent: 'border-emerald-500/30',
          badgeText: 'MEMORY',
        };
      case 'output':
        return {
          icon: Send,
          color: 'text-violet-400',
          bgHeader: 'bg-violet-950/40',
          borderAccent: 'border-violet-500/30',
          badgeText: 'OUTPUT',
        };
    }
  };

  const theme = getCategoryTheme();
  const Icon = theme.icon;

  const getStatusBadge = () => {
    switch (node.status) {
      case 'running':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            RUNNING
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            COMPLETED
          </span>
        );
      case 'paused':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 font-medium animate-pulse">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            WAITING APPROVAL
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            FAILED
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono text-zinc-500">
            IDLE
          </span>
        );
    }
  };

  return (
    <div
      style={{
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
        width: 320,
      }}
      className={`absolute select-none rounded-xl bg-[#11141a]/95 backdrop-blur-md border transition-all duration-150 group shadow-xl ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10'
          : node.status === 'running'
          ? 'border-indigo-400 node-running'
          : 'border-zinc-800/90 hover:border-zinc-700'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onMouseDown={(e) => {
        // Only drag from card, not buttons
        if ((e.target as HTMLElement).closest('button')) return;
        onMouseDown(node.id, e);
      }}
    >
      {/* Top Input Handle */}
      {!isTrigger && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center cursor-crosshair z-20 group/handle"
          onMouseUp={(e) => {
            e.stopPropagation();
            onEndConnect(node.id, e);
          }}
          title="Connect input"
        >
          <div className="w-3 h-3 rounded-full bg-zinc-800 border-2 border-zinc-500 group-hover/handle:border-indigo-400 group-hover/handle:bg-indigo-600 transition-colors" />
        </div>
      )}

      {/* Header bar */}
      <div className={`px-3.5 py-2.5 rounded-t-xl border-b border-zinc-800/70 flex items-center justify-between ${theme.bgHeader}`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className={`p-1.5 rounded-md bg-[#0a0c10]/70 border border-zinc-800 ${theme.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono tracking-wider font-semibold text-zinc-400 uppercase block leading-none">
              {theme.badgeText}
            </span>
            <span className="text-xs font-semibold text-zinc-200 truncate block mt-0.5" title={node.name}>
              {node.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenConfig(node);
              }}
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              title="Configure Node"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(node.id);
              }}
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              title="Duplicate Node"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30"
              title="Delete Node"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 text-xs space-y-2">
        {node.subtitle && (
          <p className="text-[11px] font-mono text-zinc-400 truncate">
            {node.subtitle}
          </p>
        )}

        {node.description && (
          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
            {node.description}
          </p>
        )}

        {/* Agent Details */}
        {isAgent && node.config.category === 'agent' && (
          <div className="pt-1 border-t border-zinc-800/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-500 font-mono">Model:</span>
              <span className="font-mono text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                {node.config.model}
              </span>
            </div>

            {node.config.tools && node.config.tools.length > 0 && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500 font-mono">Tools:</span>
                <span className="text-zinc-300 truncate max-w-[170px]" title={node.config.tools.join(', ')}>
                  {node.config.tools.slice(0, 2).join(', ')}
                  {node.config.tools.length > 2 && ` +${node.config.tools.length - 2}`}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
              <span>Reasoning: {node.config.reasoningLevel}</span>
              <span>Temp: {node.config.temperature}</span>
            </div>
          </div>
        )}

        {/* Condition Preview */}
        {isCondition && node.config.category === 'condition' && (
          <div className="pt-1 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">
              {node.config.field} {node.config.operator === 'greater_than' ? '>' : '='} {String(node.config.value)}
            </span>
            <span className="text-amber-400 text-[10px] font-semibold">2 BRANCHES</span>
          </div>
        )}

        {/* Human Approval Preview */}
        {isApproval && node.config.category === 'approval' && (
          <div className="pt-1 border-t border-zinc-800/60 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Role:</span>
              <span className="text-orange-300 font-mono text-[10px]">{node.config.approverRole}</span>
            </div>
            <div className="text-[10px] text-zinc-400 italic">
              Pauses execution until operator decision
            </div>
          </div>
        )}

        {/* Trigger Preview */}
        {isTrigger && node.config.category === 'trigger' && (
          <div className="pt-1 border-t border-zinc-800/60 text-[11px] font-mono text-sky-300">
            {node.config.scheduleHuman || node.config.triggerType}
          </div>
        )}
      </div>

      {/* Output Handles */}
      {isCondition ? (
        <div className="border-t border-zinc-800/80 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono bg-zinc-950/40 rounded-b-xl">
          {/* YES branch handle */}
          <div
            className="flex items-center gap-1.5 cursor-crosshair group/yes"
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartConnect(node.id, 'yes', e);
            }}
            title="Connect YES branch"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 group-hover/yes:scale-125 transition-transform" />
            <span className="text-emerald-400 text-[10px] font-semibold">YES (True)</span>
          </div>

          {/* NO branch handle */}
          <div
            className="flex items-center gap-1.5 cursor-crosshair group/no"
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartConnect(node.id, 'no', e);
            }}
            title="Connect NO branch"
          >
            <span className="text-rose-400 text-[10px] font-semibold">NO (False)</span>
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/20 group-hover/no:scale-125 transition-transform" />
          </div>
        </div>
      ) : (
        /* Standard Bottom Handle */
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center cursor-crosshair z-20 group/handle"
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConnect(node.id, 'out', e);
          }}
          title="Drag to connect"
        >
          <div className="w-3 h-3 rounded-full bg-zinc-800 border-2 border-zinc-500 group-hover/handle:border-indigo-400 group-hover/handle:bg-indigo-600 transition-colors" />
        </div>
      )}
    </div>
  );
};
