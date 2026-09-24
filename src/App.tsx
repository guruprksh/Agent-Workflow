import React, { useState } from 'react';
import { DEMO_WORKFLOWS } from './data/demoWorkflows';
import { Workflow, WorkflowNode, SimulatedDeviceType } from './types';
import { Sidebar } from './components/common/Sidebar';
import { HomeDashboard } from './components/views/HomeDashboard';
import { WorkflowsView } from './components/views/WorkflowsView';
import { AgentsView } from './components/views/AgentsView';
import { TemplatesView } from './components/views/TemplatesView';
import { RunsView } from './components/views/RunsView';
import { KnowledgeView } from './components/views/KnowledgeView';
import { MemoryView } from './components/views/MemoryView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { SchedulesView } from './components/views/SchedulesView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';
import { LandingPageView as LandingPage } from './components/views/LandingPageView';
import { WorkflowGeneratorModal } from './components/common/WorkflowGeneratorModal';
import { CommandPalette } from './components/common/CommandPalette';
import { RunMonitorModal } from './components/editor/RunMonitorModal';
import { SiteBacktesterModal } from './components/backtester/SiteBacktesterModal';
import {
  Menu,
  ShieldCheck,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  X,
  Maximize2,
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [workflows, setWorkflows] = useState<Workflow[]>(DEMO_WORKFLOWS);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow>(DEMO_WORKFLOWS[0]);

  // Modals & Panels
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generatorInitialPrompt, setGeneratorInitialPrompt] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isLiveRunOpen, setIsLiveRunOpen] = useState(false);
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [isBacktesterOpen, setIsBacktesterOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [simulatedDevice, setSimulatedDevice] = useState<SimulatedDeviceType>('responsive');

  // Workflow update handler
  const handleUpdateWorkflow = (updated: Workflow) => {
    setActiveWorkflow(updated);
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  // Node status updater during run
  const handleUpdateWorkflowNodes = (updatedNodes: WorkflowNode[]) => {
    handleUpdateWorkflow({
      ...activeWorkflow,
      nodes: updatedNodes,
    });
  };

  // Run Workflow Trigger
  const handleRunWorkflow = (wf?: Workflow) => {
    const target = wf || activeWorkflow;
    setActiveWorkflow(target);
    setIsLiveRunOpen(true);
  };

  // Natural Language Creator flow
  const handleOpenGeneratorWithPrompt = (prompt: string) => {
    setGeneratorInitialPrompt(prompt);
    setIsGeneratorOpen(true);
  };

  const handleWorkflowGenerated = (newWf: Workflow) => {
    setWorkflows([newWf, ...workflows]);
    setActiveWorkflow(newWf);
    setIsGeneratorOpen(false);
    setCurrentTab('workflows');
  };

  // Use Template flow
  const handleUseTemplate = (tplWorkflow: Workflow) => {
    const cloned: Workflow = {
      ...JSON.parse(JSON.stringify(tplWorkflow)),
      id: `wf-${Date.now().toString(36)}`,
      name: `${tplWorkflow.name} (My Instance)`,
      status: 'active',
      lastRunAt: 'Never',
    };
    setWorkflows([cloned, ...workflows]);
    setActiveWorkflow(cloned);
    setCurrentTab('workflows');
  };

  const renderActiveView = () => {
    if (isLandingPage) {
      return <LandingPage onEnterApp={() => setIsLandingPage(false)} />;
    }

    switch (currentTab) {
      case 'home':
        return (
          <HomeDashboard
            workflows={workflows}
            onSelectWorkflow={(wf) => {
              setActiveWorkflow(wf);
              setCurrentTab('workflows');
            }}
            onOpenGeneratorWithPrompt={handleOpenGeneratorWithPrompt}
            onNavigateTab={(t) => setCurrentTab(t)}
            onRunWorkflowNow={handleRunWorkflow}
            onOpenBacktester={() => setIsBacktesterOpen(true)}
          />
        );
      case 'workflows':
        return (
          <WorkflowsView
            workflow={activeWorkflow}
            allWorkflows={workflows}
            onSelectWorkflow={(wf) => setActiveWorkflow(wf)}
            onUpdateWorkflow={handleUpdateWorkflow}
            onRunWorkflow={handleRunWorkflow}
            isRunning={isLiveRunOpen}
          />
        );
      case 'agents':
        return <AgentsView />;
      case 'templates':
        return <TemplatesView onUseTemplate={handleUseTemplate} />;
      case 'runs':
        return <RunsView onOpenLiveRun={(trace) => setIsLiveRunOpen(true)} />;
      case 'knowledge':
        return <KnowledgeView />;
      case 'memory':
        return <MemoryView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'schedules':
        return <SchedulesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  // Device simulation specifications
  const getDeviceStyle = () => {
    switch (simulatedDevice) {
      case 'mobile':
        return {
          width: '393px',
          height: '852px',
          maxHeight: '92vh',
          borderRadius: '44px',
          border: '10px solid #1f2330',
        };
      case 'tablet':
        return {
          width: '820px',
          height: '1180px',
          maxHeight: '92vh',
          borderRadius: '28px',
          border: '12px solid #1f2330',
        };
      case 'laptop':
        return {
          width: '100%',
          maxWidth: '1280px',
          height: '800px',
          maxHeight: '90vh',
          borderRadius: '16px',
          border: '10px solid #1f2330',
        };
      default:
        return null;
    }
  };

  const isSimulated = simulatedDevice !== 'responsive';
  const deviceStyle = getDeviceStyle();

  return (
    <div className="flex flex-col w-screen h-screen bg-[#08090d] text-zinc-100 font-sans overflow-hidden">
      {/* Top Device Simulation Bar (when active) */}
      {isSimulated && (
        <div className="bg-[#121520] border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs z-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-zinc-200">
              Screen Preview Simulator:
            </span>
            <span className="font-mono text-indigo-300 capitalize">
              {simulatedDevice} Viewport
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#191c28] p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setSimulatedDevice('responsive')}
                title="Full Responsive"
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSimulatedDevice('laptop')}
                title="Laptop"
                className={`p-1 rounded ${
                  simulatedDevice === 'laptop' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSimulatedDevice('tablet')}
                title="Tablet"
                className={`p-1 rounded ${
                  simulatedDevice === 'tablet' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSimulatedDevice('mobile')}
                title="Mobile"
                className={`p-1 rounded ${
                  simulatedDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setIsBacktesterOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Backtest Viewport</span>
            </button>

            <button
              onClick={() => setSimulatedDevice('responsive')}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Exit Simulation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Application Outer Body */}
      <div className={`flex-1 flex overflow-hidden ${isSimulated ? 'items-center justify-center p-4 bg-[#050608]' : ''}`}>
        <div
          style={deviceStyle || { width: '100%', height: '100%' }}
          className={`flex w-full h-full relative overflow-hidden bg-[#08090d] shadow-2xl transition-all duration-300 ${
            isSimulated ? 'box-content shadow-black/80' : ''
          }`}
        >
          {/* Mobile Top Navigation Header (visible on < lg screens) */}
          <header className="lg:hidden absolute top-0 left-0 right-0 h-12 bg-[#0d0f15]/95 backdrop-blur-md border-b border-zinc-800/80 px-3 flex items-center justify-between z-30">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  AF
                </div>
                <span className="font-semibold text-xs text-white">
                  AgentFlow
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsBacktesterOpen(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px]">Sentinel</span>
              </button>
            </div>
          </header>

          {/* Sidebar Navigation */}
          <Sidebar
            currentTab={currentTab}
            onNavigate={(tab) => {
              setIsLandingPage(false);
              setCurrentTab(tab);
            }}
            pendingApprovalsCount={1}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            isLandingPage={isLandingPage}
            onToggleLandingPage={() => setIsLandingPage(!isLandingPage)}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onOpenBacktester={() => setIsBacktesterOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1 h-full relative flex overflow-hidden pt-12 lg:pt-0">
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* Workflow Generator Modal */}
      {isGeneratorOpen && (
        <WorkflowGeneratorModal
          initialPrompt={generatorInitialPrompt}
          onClose={() => setIsGeneratorOpen(false)}
          onWorkflowGenerated={handleWorkflowGenerated}
        />
      )}

      {/* ⌘K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        workflows={workflows}
        onSelectWorkflow={(wf) => {
          setActiveWorkflow(wf);
          setCurrentTab('workflows');
        }}
        onNavigateTab={(t) => setCurrentTab(t)}
        onOpenGenerator={() => {
          setGeneratorInitialPrompt('');
          setIsGeneratorOpen(true);
        }}
        onRunWorkflow={() => handleRunWorkflow()}
      />

      {/* Live Workflow Run Monitor Modal with Human in the Loop */}
      {isLiveRunOpen && (
        <RunMonitorModal
          workflow={activeWorkflow}
          onClose={() => setIsLiveRunOpen(false)}
          onUpdateWorkflowNodes={handleUpdateWorkflowNodes}
        />
      )}

      {/* Autonomous QA Sentinel Backtester Modal */}
      <SiteBacktesterModal
        isOpen={isBacktesterOpen}
        onClose={() => setIsBacktesterOpen(false)}
        workflows={workflows}
        activeWorkflow={activeWorkflow}
        onUpdateWorkflow={handleUpdateWorkflow}
        currentSimulatedDevice={simulatedDevice}
        onChangeSimulatedDevice={(dev) => setSimulatedDevice(dev)}
      />
    </div>
  );
}

