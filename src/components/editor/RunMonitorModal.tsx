import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Cpu,
  Wrench,
  Send,
  Sparkles,
  RotateCcw,
  Check,
  Maximize2,
} from 'lucide-react';
import { Workflow, WorkflowNode, RunTrace, RunStep } from '../../types';

interface RunMonitorModalProps {
  workflow: Workflow;
  onClose: () => void;
  onUpdateWorkflowNodes: (updatedNodes: WorkflowNode[]) => void;
}

export const RunMonitorModal: React.FC<RunMonitorModalProps> = ({
  workflow,
  onClose,
  onUpdateWorkflowNodes,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [isPausedAtApproval, setIsPausedAtApproval] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Generate realistic sequence of run steps based on workflow nodes
  const [steps, setSteps] = useState<RunStep[]>(() => {
    return workflow.nodes.map((node, i) => ({
      id: `step-${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      status: i === 0 ? 'running' : 'waiting',
      timestamp: 'Pending',
      duration: '--',
      input: { triggerSource: 'user_run', context: workflow.goalPrompt },
      reasoningSummary:
        node.type === 'agent'
          ? `Analyzed instructions for "${node.name}". Formulated search query and verified tool capabilities.`
          : node.type === 'condition'
          ? 'Evaluated upstream candidate metrics against decision boundary.'
          : node.type === 'approval'
          ? 'Halted automated processing to await authenticated human operator signature.'
          : 'Processed step inputs.',
      toolCalls:
        node.type === 'agent' && node.config.category === 'agent' && node.config.tools.length > 0
          ? [
              {
                tool: node.config.tools[0],
                input: { query: 'domain criteria scan' },
                output: { status: '200_OK', records: 12 },
              },
            ]
          : [],
      output:
        node.type === 'agent'
          ? { status: 'SUCCESS', confidence: 0.94, itemsProcessed: 4 }
          : { status: 'COMPLETED' },
      tokenUsage: { prompt: 1200 + i * 340, completion: 450 + i * 120, total: 1650 + i * 460 },
    }));
  });

  // Step runner simulator
  useEffect(() => {
    if (isCompleted || isPausedAtApproval) return;

    if (currentStepIndex >= steps.length) {
      setIsCompleted(true);
      return;
    }

    const currentStep = steps[currentStepIndex];
    const currentNode = workflow.nodes[currentStepIndex];

    // Update node status on canvas
    const updatedNodes = workflow.nodes.map((n, idx) => ({
      ...n,
      status:
        idx === currentStepIndex
          ? ('running' as const)
          : idx < currentStepIndex
          ? ('completed' as const)
          : ('waiting' as const),
    }));
    onUpdateWorkflowNodes(updatedNodes);

    // If approval node, pause!
    if (currentNode && currentNode.type === 'approval') {
      const pausedNodes = workflow.nodes.map((n, idx) => ({
        ...n,
        status: idx === currentStepIndex ? ('paused' as const) : n.status,
      }));
      onUpdateWorkflowNodes(pausedNodes);

      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === currentStepIndex
            ? {
                ...s,
                status: 'paused',
                timestamp: new Date().toLocaleTimeString(),
                duration: 'Awaiting operator decision',
              }
            : s
        )
      );
      setIsPausedAtApproval(true);
      setExpandedStepId(currentStep.id);
      return;
    }

    // Normal node simulation delay
    const timer = setTimeout(() => {
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === currentStepIndex
            ? {
                ...s,
                status: 'completed',
                timestamp: new Date().toLocaleTimeString(),
                duration: `${(1.2 + Math.random() * 2).toFixed(1)}s`,
              }
            : idx === currentStepIndex + 1
            ? { ...s, status: 'running' }
            : s
        )
      );
      setCurrentStepIndex((prev) => prev + 1);
    }, 1400);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isPausedAtApproval, isCompleted]);

  // Handle human approval decision
  const handleApprove = () => {
    setIsPausedAtApproval(false);
    setSteps((prev) =>
      prev.map((s, idx) =>
        idx === currentStepIndex
          ? {
              ...s,
              status: 'completed',
              duration: 'Approved by Operator',
              output: { decision: 'APPROVED', authorizedBy: 'Current User' },
            }
          : s
      )
    );
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handleReject = () => {
    setIsPausedAtApproval(false);
    setIsCompleted(true);
    setSteps((prev) =>
      prev.map((s, idx) =>
        idx === currentStepIndex
          ? {
              ...s,
              status: 'failed',
              error: 'Execution halted: Operator rejected proposed action.',
            }
          : s
      )
    );
  };

  const totalTokens = steps
    .filter((s) => s.status === 'completed')
    .reduce((acc, s) => acc + s.tokenUsage.total, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#10131a] border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#141722] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-950/70 border border-indigo-500/40 text-indigo-400">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-zinc-100">RUN #10483</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {workflow.name}
                </span>
                {isCompleted ? (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> COMPLETED
                  </span>
                ) : isPausedAtApproval ? (
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" /> ACTION REQUIRED
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    EXECUTING
                  </span>
                )}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5 flex items-center gap-3">
                <span>Started: Just now</span>
                <span>·</span>
                <span>Tokens: ~{totalTokens.toLocaleString()}</span>
                <span>·</span>
                <span>Cost: ${(totalTokens * 0.000008).toFixed(4)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Human Approval Required Banner */}
        {isPausedAtApproval && (
          <div className="bg-amber-950/30 border-b border-amber-900/60 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-900/40 text-amber-400 border border-amber-800/60">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-xs text-amber-200">
                  Action Requires Your Approval
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  The autonomous team reached a decision checkpoint. Review extracted papers/payload before continuing.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReject}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700"
              >
                Reject & Halt
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-1.5 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Approve & Continue
              </button>
            </div>
          </div>
        )}

        {/* Steps List & Detail */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
          {steps.map((step, idx) => {
            const isExpanded = expandedStepId === step.id;
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';
            const isPaused = step.status === 'paused';

            return (
              <div
                key={step.id}
                className={`rounded-lg border transition-all ${
                  isPaused
                    ? 'bg-amber-950/20 border-amber-700/60'
                    : isRunning
                    ? 'bg-indigo-950/20 border-indigo-600/60'
                    : isCompleted
                    ? 'bg-[#141722]/80 border-zinc-800/90'
                    : 'bg-[#10121a]/40 border-zinc-900 text-zinc-600'
                }`}
              >
                {/* Step Summary Bar */}
                <div
                  onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                  className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    {/* Status Icon */}
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isRunning ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                    ) : isPaused ? (
                      <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 mx-0.5" />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-200">{step.nodeName}</span>
                        <span className="text-[10px] font-mono uppercase text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-800/80">
                          {step.nodeType}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                        {step.reasoningSummary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-zinc-500">{step.duration}</span>
                    <button className="text-zinc-500 hover:text-zinc-300">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Trace Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-3.5 pt-2 border-t border-zinc-800/80 space-y-3 bg-[#0d0f15]/80">
                    {/* Safe Reasoning Summary */}
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                        Execution Reasoning Summary
                      </div>
                      <div className="p-2.5 rounded bg-[#161924] border border-zinc-800 text-zinc-300 leading-relaxed font-sans text-xs">
                        {step.reasoningSummary}
                      </div>
                    </div>

                    {/* Tool Calls if any */}
                    {step.toolCalls && step.toolCalls.length > 0 && (
                      <div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                          Tool Invocations
                        </div>
                        <div className="space-y-1.5">
                          {step.toolCalls.map((tc, tcIdx) => (
                            <div
                              key={tcIdx}
                              className="p-2 rounded bg-[#141722] border border-zinc-800 font-mono text-[11px]"
                            >
                              <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
                                <span>Tool: {tc.tool}</span>
                                <span className="text-zinc-500">200 OK</span>
                              </div>
                              <div className="text-zinc-400 text-[10px] truncate">
                                Input: {JSON.stringify(tc.input)}
                              </div>
                              <div className="text-zinc-300 text-[10px] truncate mt-0.5">
                                Output: {JSON.stringify(tc.output)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Output & Token Metrics */}
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-500">
                      <span>Prompt: {step.tokenUsage.prompt} tokens</span>
                      <span>Completion: {step.tokenUsage.completion} tokens</span>
                      <span>Total: {step.tokenUsage.total} tokens</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#141722] border-t border-zinc-800 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            {isCompleted
              ? 'Workflow execution finished successfully.'
              : isPausedAtApproval
              ? 'Execution paused at human checkpoint.'
              : 'Executing autonomous pipeline...'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Close Monitor
          </button>
        </div>
      </div>
    </div>
  );
};
