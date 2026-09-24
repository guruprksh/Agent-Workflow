import React, { useState } from 'react';
import { DEMO_WORKFLOWS } from './data/demoWorkflows';
import { Workflow, WorkflowNode } from './types';
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
import { LandingPage } from './components/views/LandingPage';
import { WorkflowGeneratorModal } from './components/common/WorkflowGeneratorModal';
import { CommandPalette } from './components/common/CommandPalette';
import { RunMonitorModal } from './components/editor/RunMonitorModal';

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

  return (
    <div className="flex w-screen h-screen bg-[#08090d] text-zinc-100 font-sans overflow-hidden">
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
      />

      {/* Main View Area */}
      <main className="flex-1 h-screen relative flex overflow-hidden">
        {isLandingPage ? (
          <LandingPage onEnterApp={() => setIsLandingPage(false)} />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeDashboard
                workflows={workflows}
                onSelectWorkflow={(wf) => {
                  setActiveWorkflow(wf);
                  setCurrentTab('workflows');
                }}
                onOpenGeneratorWithPrompt={handleOpenGeneratorWithPrompt}
                onNavigateTab={(t) => setCurrentTab(t)}
                onRunWorkflowNow={handleRunWorkflow}
              />
            )}

            {currentTab === 'workflows' && (
              <WorkflowsView
                workflow={activeWorkflow}
                allWorkflows={workflows}
                onSelectWorkflow={(wf) => setActiveWorkflow(wf)}
                onUpdateWorkflow={handleUpdateWorkflow}
                onRunWorkflow={handleRunWorkflow}
                isRunning={isLiveRunOpen}
              />
            )}

            {currentTab === 'agents' && <AgentsView />}

            {currentTab === 'templates' && (
              <TemplatesView onUseTemplate={handleUseTemplate} />
            )}

            {currentTab === 'runs' && (
              <RunsView onOpenLiveRun={(trace) => setIsLiveRunOpen(true)} />
            )}

            {currentTab === 'knowledge' && <KnowledgeView />}

            {currentTab === 'memory' && <MemoryView />}

            {currentTab === 'integrations' && <IntegrationsView />}

            {currentTab === 'schedules' && <SchedulesView />}

            {currentTab === 'analytics' && <AnalyticsView />}

            {currentTab === 'settings' && <SettingsView />}
          </>
        )}
      </main>

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
    </div>
  );
}
