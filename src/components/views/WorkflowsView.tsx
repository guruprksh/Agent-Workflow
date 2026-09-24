import React, { useState } from 'react';
import { Workflow, WorkflowNode, WorkflowVersion, ValidationIssue } from '../../types';
import { WorkflowCanvas } from '../canvas/WorkflowCanvas';
import { AgentDetailPanel } from '../editor/AgentDetailPanel';
import { WorkflowCopilot } from '../editor/WorkflowCopilot';
import { ValidationDrawer } from '../editor/ValidationDrawer';
import { VersionHistoryModal } from '../editor/VersionHistoryModal';
import { validateWorkflow } from '../../services/workflowEngine';

interface WorkflowsViewProps {
  workflow: Workflow;
  allWorkflows: Workflow[];
  onSelectWorkflow: (wf: Workflow) => void;
  onUpdateWorkflow: (updated: Workflow) => void;
  onRunWorkflow: (wf: Workflow) => void;
  isRunning: boolean;
}

export const WorkflowsView: React.FC<WorkflowsViewProps> = ({
  workflow,
  allWorkflows,
  onSelectWorkflow,
  onUpdateWorkflow,
  onRunWorkflow,
  isRunning,
}) => {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);

  const validationIssues: ValidationIssue[] = validateWorkflow(workflow);

  const handleUpdateNode = (updatedNode: WorkflowNode) => {
    setSelectedNode(updatedNode);
    const updatedNodes = workflow.nodes.map((n) =>
      n.id === updatedNode.id ? updatedNode : n
    );
    onUpdateWorkflow({ ...workflow, nodes: updatedNodes });
  };

  const handleRestoreVersion = (version: WorkflowVersion) => {
    if (version.nodes && version.nodes.length > 0) {
      onUpdateWorkflow({
        ...workflow,
        nodes: version.nodes,
        edges: version.edges,
        version: version.version,
      });
    }
    setIsVersionsOpen(false);
  };

  const handleSaveCurrentAsVersion = () => {
    const nextVerNum = `v${(parseFloat(workflow.version.replace('v', '')) + 0.1).toFixed(1)}`;
    const newVersion: WorkflowVersion = {
      id: `ver-${Date.now().toString(36)}`,
      version: nextVerNum,
      name: `Snapshot ${nextVerNum}`,
      createdAt: 'Just now',
      description: 'Saved manual snapshot',
      nodes: JSON.parse(JSON.stringify(workflow.nodes)),
      edges: JSON.parse(JSON.stringify(workflow.edges)),
      isActive: true,
    };

    const updatedVersions = workflow.versions.map((v) => ({ ...v, isActive: false }));
    updatedVersions.unshift(newVersion);

    onUpdateWorkflow({
      ...workflow,
      version: nextVerNum,
      versions: updatedVersions,
    });
  };

  return (
    <div className="flex-1 h-screen flex relative overflow-hidden bg-[#0b0d11]">
      {/* Workflow Canvas */}
      <div className="flex-1 h-full relative">
        <WorkflowCanvas
          workflow={workflow}
          onUpdateWorkflow={onUpdateWorkflow}
          onSelectNode={(node) => setSelectedNode(node)}
          selectedNodeId={selectedNode ? selectedNode.id : null}
          onRunWorkflow={() => onRunWorkflow(workflow)}
          isRunning={isRunning}
          validationIssues={validationIssues}
          onOpenValidation={() => setIsValidationOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          onOpenVersions={() => setIsVersionsOpen(true)}
        />

        {/* Copilot Drawer */}
        {isCopilotOpen && (
          <WorkflowCopilot
            workflow={workflow}
            onUpdateWorkflow={onUpdateWorkflow}
            onClose={() => setIsCopilotOpen(false)}
          />
        )}

        {/* Validation Drawer */}
        {isValidationOpen && (
          <ValidationDrawer
            issues={validationIssues}
            onSelectNode={(nodeId) => {
              const target = workflow.nodes.find((n) => n.id === nodeId);
              if (target) setSelectedNode(target);
            }}
            onClose={() => setIsValidationOpen(false)}
          />
        )}
      </div>

      {/* Right Side Detail / Configuration Panel */}
      {selectedNode && (
        <AgentDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdateNode={handleUpdateNode}
        />
      )}

      {/* Version History Modal */}
      {isVersionsOpen && (
        <VersionHistoryModal
          workflow={workflow}
          onClose={() => setIsVersionsOpen(false)}
          onRestoreVersion={handleRestoreVersion}
          onSaveCurrentAsVersion={handleSaveCurrentAsVersion}
        />
      )}
    </div>
  );
};
