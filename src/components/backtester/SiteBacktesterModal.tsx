import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Play,
  RotateCcw,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  Terminal,
  ChevronRight,
  Cpu,
  RefreshCw,
  Wrench,
  Maximize2,
  X,
  Layers,
  ArrowUpRight,
  Gauge,
  Sliders,
} from 'lucide-react';
import {
  Workflow,
  BacktestRunSummary,
  BacktestTestCase,
  BacktestAgentLog,
  SimulatedDeviceType,
  SimulatedDeviceSpec,
} from '../../types';
import { AutonomousBacktester, SIMULATED_DEVICES } from '../../services/autonomousBacktester';

interface SiteBacktesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflows: Workflow[];
  activeWorkflow: Workflow;
  onUpdateWorkflow: (updated: Workflow) => void;
  currentSimulatedDevice: SimulatedDeviceType;
  onChangeSimulatedDevice: (device: SimulatedDeviceType) => void;
}

export const SiteBacktesterModal: React.FC<SiteBacktesterModalProps> = ({
  isOpen,
  onClose,
  workflows,
  activeWorkflow,
  onUpdateWorkflow,
  currentSimulatedDevice,
  onChangeSimulatedDevice,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<BacktestRunSummary | null>(null);
  const [logs, setLogs] = useState<BacktestAgentLog[]>([]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'agent_logs' | 'devices' | 'auto_heal'>('matrix');
  const [selectedSuite, setSelectedSuite] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<BacktestTestCase | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-run on first open if no summary exists
  useEffect(() => {
    if (isOpen && !summary && !isRunning) {
      handleRunBacktest();
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab === 'agent_logs' && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  const handleRunBacktest = async () => {
    setIsRunning(true);
    setLogs([]);
    setSelectedCase(null);

    const backtester = new AutonomousBacktester({
      onLog: (log) => {
        setLogs((prev) => [...prev, log]);
      },
    });

    try {
      const result = await backtester.runFullBacktest(workflows, activeWorkflow);
      setSummary(result);
      setLogs(result.logs);
      if (result.cases.length > 0) {
        setSelectedCase(result.cases[0]);
      }
    } catch (err: any) {
      console.error('Backtest error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleApplyAutoHeal = (recommendationId: string) => {
    if (recommendationId === 'rec-add-approval') {
      // Automatically add human approval node before first output node
      const outputNode = activeWorkflow.nodes.find((n) => n.type === 'output');
      const approvalNodeId = `node-approval-${Date.now().toString(36)}`;
      const approvalPos = outputNode
        ? { x: outputNode.position.x - 40, y: Math.max(outputNode.position.y - 120, 80) }
        : { x: 500, y: 300 };

      const newApprovalNode = {
        id: approvalNodeId,
        type: 'approval' as const,
        name: 'Human Review Gate',
        subtitle: 'Review & Authorize Action',
        position: approvalPos,
        status: 'idle' as const,
        config: {
          category: 'approval' as const,
          title: 'Review Payload',
          prompt: 'Verify execution output before dispatching.',
          approverRole: 'Workflow Owner',
          timeoutHours: 24,
          allowEditing: true,
        },
      };

      const updatedNodes = [...activeWorkflow.nodes, newApprovalNode];
      onUpdateWorkflow({
        ...activeWorkflow,
        nodes: updatedNodes,
      });

      // Update recommendations list
      if (summary) {
        setSummary({
          ...summary,
          recommendations: summary.recommendations.filter((r) => r.id !== recommendationId),
        });
      }
    }
  };

  if (!isOpen) return null;

  const filteredCases = summary
    ? selectedSuite === 'all'
      ? summary.cases
      : summary.cases.filter((c) => c.suite === selectedSuite)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-5xl h-[92vh] bg-[#0d0f17] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-zinc-800/80 bg-[#121520] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-base sm:text-lg text-white tracking-tight">
                  AgentFlow Sentinel
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Autonomous QA Agent
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Full-stack backtesting for Canvas DAG, Execution Engine, and Dynamic Screen Viewports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunBacktest}
              disabled={isRunning}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md transition-all ${
                isRunning
                  ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Agent Backtesting...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Full Backtest</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overview Health Bar */}
        {summary && (
          <div className="px-4 sm:px-6 py-3 bg-[#151824] border-b border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">Tests Passed</span>
                <span className="text-sm font-semibold text-emerald-400">
                  {summary.passed} / {summary.totalTests}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">Screen Health Score</span>
                <span className="text-sm font-semibold text-indigo-300">
                  {summary.screenHealthScore}% Optimal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">Total Duration</span>
                <span className="text-sm font-semibold text-zinc-200">
                  {summary.durationMs} ms
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">Self-Healing Fixes</span>
                <span className="text-sm font-semibold text-purple-300">
                  {summary.recommendations.length} Suggestions
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 border-b border-zinc-800 bg-[#0f121a] flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'matrix', label: 'Test Matrix & Assertions', icon: CheckCircle2 },
              { id: 'agent_logs', label: 'Agent Reasoning Stream', icon: Terminal },
              { id: 'devices', label: 'Simulate Any Screen', icon: Smartphone },
              {
                id: 'auto_heal',
                label: `Auto-Heal (${summary?.recommendations.length || 0})`,
                icon: Sparkles,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-300'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Screen Viewport Selector */}
          <div className="flex items-center gap-1 py-2 text-xs">
            <span className="text-[11px] font-mono text-zinc-500 hidden md:inline">Viewport:</span>
            <div className="flex items-center bg-[#181b26] p-1 rounded-lg border border-zinc-800 text-zinc-400">
              <button
                onClick={() => onChangeSimulatedDevice('responsive')}
                title="Fluid / Desktop"
                className={`p-1.5 rounded transition-colors ${
                  currentSimulatedDevice === 'responsive'
                    ? 'bg-indigo-600 text-white'
                    : 'hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeSimulatedDevice('laptop')}
                title="Laptop (1366px)"
                className={`p-1.5 rounded transition-colors ${
                  currentSimulatedDevice === 'laptop'
                    ? 'bg-indigo-600 text-white'
                    : 'hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeSimulatedDevice('tablet')}
                title="Tablet (820px)"
                className={`p-1.5 rounded transition-colors ${
                  currentSimulatedDevice === 'tablet'
                    ? 'bg-indigo-600 text-white'
                    : 'hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeSimulatedDevice('mobile')}
                title="Mobile Phone (393px)"
                className={`p-1.5 rounded transition-colors ${
                  currentSimulatedDevice === 'mobile'
                    ? 'bg-indigo-600 text-white'
                    : 'hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#0a0c12]">
          {/* TAB 1: Test Matrix & Assertions */}
          {activeTab === 'matrix' && (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Column: Test Cases List */}
              <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-800/80 flex flex-col bg-[#0e111a] shrink-0">
                {/* Suite Filter Bar */}
                <div className="p-3 border-b border-zinc-800/80 flex gap-1 overflow-x-auto scrollbar-none text-[11px]">
                  {['all', 'canvas_dag', 'execution_engine', 'responsive_screens', 'copilot_generator'].map(
                    (suite) => (
                      <button
                        key={suite}
                        onClick={() => setSelectedSuite(suite)}
                        className={`px-2 py-1 rounded whitespace-nowrap transition-colors ${
                          selectedSuite === suite
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {suite === 'all'
                          ? 'All'
                          : suite === 'canvas_dag'
                          ? 'DAG Canvas'
                          : suite === 'execution_engine'
                          ? 'Execution'
                          : suite === 'responsive_screens'
                          ? 'Screens'
                          : 'Copilot'}
                      </button>
                    )
                  )}
                </div>

                {/* Case List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {filteredCases.map((tc) => {
                    const isSelected = selectedCase?.id === tc.id;
                    return (
                      <button
                        key={tc.id}
                        onClick={() => setSelectedCase(tc)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow'
                            : 'bg-[#121520]/60 border-zinc-800/60 text-zinc-300 hover:bg-zinc-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium truncate block max-w-[190px]">
                            {tc.name}
                          </span>
                          {tc.status === 'passed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : tc.status === 'warning' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                          <span className="capitalize">{tc.suite.replace('_', ' ')}</span>
                          <span>{tc.durationMs}ms</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Case Deep Dive */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#0b0e16]">
                {selectedCase ? (
                  <div className="space-y-4 max-w-3xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                          {selectedCase.suite}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">
                          Duration: {selectedCase.durationMs}ms
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mt-1">
                        {selectedCase.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {selectedCase.description}
                      </p>
                    </div>

                    {/* Assertions */}
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold block">
                        Verified Assertions ({selectedCase.assertions.length})
                      </span>
                      <div className="space-y-2">
                        {selectedCase.assertions.map((a, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg bg-[#121522] border border-zinc-800/80 flex items-start gap-3 text-xs"
                          >
                            <div className="mt-0.5">
                              {a.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <span className="font-medium text-zinc-200 block">
                                {a.name}
                              </span>
                              {a.details && (
                                <span className="text-zinc-400 text-[11px] block mt-0.5">
                                  {a.details}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                a.passed
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                                  : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                              }`}
                            >
                              {a.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
                    Select a test case on the left to inspect assertion details.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Agent Reasoning Stream */}
          {activeTab === 'agent_logs' && (
            <div className="flex-1 p-4 sm:p-6 flex flex-col overflow-hidden bg-[#090b10] font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-zinc-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="text-zinc-200 font-semibold">Autonomous QA Thought Stream</span>
                </div>
                <span className="text-[11px] text-zinc-500">
                  {logs.length} events logged
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pt-3 space-y-2 scrollbar-thin">
                {logs.map((log) => {
                  let badgeColor = 'text-zinc-400 bg-zinc-800/80';
                  if (log.level === 'agent') badgeColor = 'text-purple-300 bg-purple-950/60 border border-purple-800/60';
                  if (log.level === 'success') badgeColor = 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/60';
                  if (log.level === 'warn') badgeColor = 'text-amber-300 bg-amber-950/60 border border-amber-800/60';
                  if (log.level === 'error') badgeColor = 'text-rose-300 bg-rose-950/60 border border-rose-800/60';

                  return (
                    <div key={log.id} className="flex items-start gap-2.5 text-[11px] leading-relaxed">
                      <span className="text-zinc-600 shrink-0 select-none">[{log.timestamp}]</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-semibold shrink-0 ${badgeColor}`}>
                        {log.level}
                      </span>
                      <span className="text-zinc-300">{log.message}</span>
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>
            </div>
          )}

          {/* TAB 3: Simulate Any Screen (Device Viewport Matrix) */}
          {activeTab === 'devices' && (
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-[#0b0e16]">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Multi-Device Dynamic Viewport Simulation
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Test and inspect the live AgentFlow website inside any responsive screen dimension.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SIMULATED_DEVICES.map((spec) => {
                  const isCurrent = currentSimulatedDevice === spec.id;
                  const Icon =
                    spec.id === 'mobile'
                      ? Smartphone
                      : spec.id === 'tablet'
                      ? Tablet
                      : spec.id === 'laptop'
                      ? Laptop
                      : Monitor;

                  return (
                    <div
                      key={spec.id}
                      onClick={() => onChangeSimulatedDevice(spec.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-indigo-950/30 border-indigo-500 shadow-lg shadow-indigo-600/10'
                          : 'bg-[#121522] border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-zinc-800 text-indigo-400">
                          <Icon className="w-5 h-5" />
                        </div>
                        {isCurrent ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500 text-white font-semibold">
                            Active Preview
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-500">
                            Click to switch
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm text-zinc-100">{spec.name}</h4>
                      <p className="text-xs text-zinc-400 font-mono mt-1">
                        {spec.width > 0 ? `${spec.width}px × ${spec.height}px` : 'Fluid Width 100%'}
                      </p>
                      <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>{spec.touchEnabled ? 'Touch gestures: Active' : 'Mouse & Keyboard'}</span>
                        <span className="font-mono">{spec.dpr}x DPR</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Dynamic Screen Engine</span>
                  AgentFlow adapts automatically via CSS flex wrapping, collapsible drawers, touch pan/pinch gestures on canvas, and responsive breakpoints across all screen sizes.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Self-Healing Recommendations */}
          {activeTab === 'auto_heal' && (
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#0b0e16]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Self-Healing Diagnoses & Automated Fixes
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Sentinel autonomously detects architecture opportunities and applies 1-click repairs.
                  </p>
                </div>
              </div>

              {summary && summary.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {summary.recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-xl bg-[#121522] border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                              rec.severity === 'high'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {rec.type}
                          </span>
                          <span className="font-semibold text-zinc-100">{rec.title}</span>
                        </div>
                        <p className="text-zinc-400 max-w-xl leading-relaxed">{rec.description}</p>
                      </div>

                      {rec.autoFixable && (
                        <button
                          onClick={() => handleApplyAutoHeal(rec.id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 shrink-0 shadow-md transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Apply Auto-Fix</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-[#121522] border border-zinc-800/80 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="font-semibold text-zinc-200 text-sm">All Systems Optimal</h4>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    Sentinel detected zero architectural flaws or layout clipping issues.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
