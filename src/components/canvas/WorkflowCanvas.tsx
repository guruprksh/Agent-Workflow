import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  LayoutGrid,
  CheckCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  Download,
  Upload,
  Undo2,
  Redo2,
  MapPin,
  Bot,
  Wrench,
  Clock,
  GitBranch,
  ShieldAlert,
  Database,
  Send,
} from 'lucide-react';
import {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  NodeCategory,
  ValidationIssue,
} from '../../types';
import { NodeCard } from './NodeCard';

interface WorkflowCanvasProps {
  workflow: Workflow;
  onUpdateWorkflow: (updated: Workflow) => void;
  onSelectNode: (node: WorkflowNode | null) => void;
  selectedNodeId: string | null;
  onRunWorkflow: () => void;
  isRunning: boolean;
  validationIssues: ValidationIssue[];
  onOpenValidation: () => void;
  onOpenCopilot: () => void;
  onOpenVersions: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  workflow,
  onUpdateWorkflow,
  onSelectNode,
  selectedNodeId,
  onRunWorkflow,
  isRunning,
  validationIssues,
  onOpenValidation,
  onOpenCopilot,
  onOpenVersions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(0.9);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 260, y: 40 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Node Dragging
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Connecting wire
  const [connecting, setConnecting] = useState<{
    fromNodeId: string;
    fromHandle: string;
    currentPos: { x: number; y: number };
  } | null>(null);

  // Add Node Menu popup
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);

  // Undo / Redo history
  const [history, setHistory] = useState<Workflow[]>([workflow]);
  const [historyIdx, setHistoryIdx] = useState<number>(0);

  const pushHistory = useCallback(
    (newWf: Workflow) => {
      const sliced = history.slice(0, historyIdx + 1);
      setHistory([...sliced, newWf]);
      setHistoryIdx(sliced.length);
      onUpdateWorkflow(newWf);
    },
    [history, historyIdx, onUpdateWorkflow]
  );

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      onUpdateWorkflow(prev);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      onUpdateWorkflow(next);
    }
  };

  // Touch support for mobile & tablet
  const [touchDist, setTouchDist] = useState<number | null>(null);
  const [initialTouchZoom, setInitialTouchZoom] = useState<number>(zoom);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsPanning(true);
      setStartPan({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    } else if (e.touches.length === 2) {
      setIsPanning(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDist(dist);
      setInitialTouchZoom(zoom);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - startPan.x,
        y: touch.clientY - startPan.y,
      });
    } else if (e.touches.length === 2 && touchDist !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / touchDist;
      const newZoom = Math.min(Math.max(0.3, initialTouchZoom * ratio), 2);
      setZoom(Number(newZoom.toFixed(2)));
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setTouchDist(null);
  };

  // Fit all nodes to current viewport
  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current || workflow.nodes.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const minX = Math.min(...workflow.nodes.map((n) => n.position.x));
    const maxX = Math.max(...workflow.nodes.map((n) => n.position.x + 300));
    const minY = Math.min(...workflow.nodes.map((n) => n.position.y));
    const maxY = Math.max(...workflow.nodes.map((n) => n.position.y + 160));
    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const scaleX = (rect.width - 60) / Math.max(graphWidth, 400);
    const scaleY = (rect.height - 100) / Math.max(graphHeight, 400);
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.35), 1.2);
    const newPanX = (rect.width - graphWidth * newZoom) / 2 - minX * newZoom;
    const newPanY = (rect.height - graphHeight * newZoom) / 2 - minY * newZoom + 10;
    setZoom(Number(newZoom.toFixed(2)));
    setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
  }, [workflow.nodes]);

  // Pan canvas logic
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    // If clicked on canvas background
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      onSelectNode(null);
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
      return;
    }

    if (draggingNodeId) {
      const newX = (e.clientX - pan.x) / zoom - dragOffset.x;
      const newY = (e.clientY - pan.y) / zoom - dragOffset.y;

      const updatedNodes = workflow.nodes.map((n) =>
        n.id === draggingNodeId ? { ...n, position: { x: Math.round(newX), y: Math.round(newY) } } : n
      );
      onUpdateWorkflow({ ...workflow, nodes: updatedNodes });
      return;
    }

    if (connecting) {
      const canvasRect = containerRef.current?.getBoundingClientRect();
      if (canvasRect) {
        setConnecting({
          ...connecting,
          currentPos: {
            x: (e.clientX - canvasRect.left - pan.x) / zoom,
            y: (e.clientY - canvasRect.top - pan.y) / zoom,
          },
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    if (draggingNodeId) {
      setDraggingNodeId(null);
      pushHistory(workflow);
    }
    if (connecting) {
      setConnecting(null);
    }
  };

  // Node Drag Start
  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    onSelectNode(node);
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: (e.clientX - pan.x) / zoom - node.position.x,
      y: (e.clientY - pan.y) / zoom - node.position.y,
    });
  };

  // Wire Connection
  const handleStartConnect = (nodeId: string, handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const sourceX = node.position.x + (handle === 'yes' ? 60 : handle === 'no' ? 260 : 160);
    const sourceY = node.position.y + 140;

    setConnecting({
      fromNodeId: nodeId,
      fromHandle: handle,
      currentPos: { x: sourceX, y: sourceY },
    });
  };

  const handleEndConnect = (targetNodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!connecting || connecting.fromNodeId === targetNodeId) {
      setConnecting(null);
      return;
    }

    // Check if edge already exists
    const exists = workflow.edges.some(
      (edge) => edge.from === connecting.fromNodeId && edge.to === targetNodeId
    );

    if (!exists) {
      const newEdge: WorkflowEdge = {
        id: `e-${Date.now().toString(36)}`,
        from: connecting.fromNodeId,
        to: targetNodeId,
        fromHandle: connecting.fromHandle,
        label: connecting.fromHandle === 'yes' ? 'YES' : connecting.fromHandle === 'no' ? 'NO' : undefined,
      };

      const updated = {
        ...workflow,
        edges: [...workflow.edges, newEdge],
      };
      pushHistory(updated);
    }

    setConnecting(null);
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    const updatedNodes = workflow.nodes.filter((n) => n.id !== nodeId);
    const updatedEdges = workflow.edges.filter((e) => e.from !== nodeId && e.to !== nodeId);
    const updated = {
      ...workflow,
      nodes: updatedNodes,
      edges: updatedEdges,
      agentCount: updatedNodes.filter((n) => n.type === 'agent').length,
    };
    pushHistory(updated);
    if (selectedNodeId === nodeId) onSelectNode(null);
  };

  // Duplicate node
  const handleDuplicateNode = (nodeId: string) => {
    const target = workflow.nodes.find((n) => n.id === nodeId);
    if (!target) return;

    const newId = `${target.id}-copy-${Date.now().toString(36).slice(-4)}`;
    const clonedNode: WorkflowNode = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId,
      name: `${target.name} (Copy)`,
      position: { x: target.position.x + 40, y: target.position.y + 40 },
      status: 'idle',
    };

    const updated = {
      ...workflow,
      nodes: [...workflow.nodes, clonedNode],
      agentCount: [...workflow.nodes, clonedNode].filter((n) => n.type === 'agent').length,
    };
    pushHistory(updated);
  };

  // Add new Node
  const handleAddNode = (category: NodeCategory) => {
    const id = `node-${category}-${Date.now().toString(36)}`;
    const posX = -pan.x / zoom + 350;
    const posY = -pan.y / zoom + 200;

    let newNode: WorkflowNode;

    switch (category) {
      case 'trigger':
        newNode = {
          id,
          type: 'trigger',
          name: 'Manual Trigger',
          subtitle: 'On demand dispatch',
          position: { x: posX, y: posY },
          status: 'idle',
          config: { category: 'trigger', triggerType: 'manual' },
        };
        break;
      case 'agent':
        newNode = {
          id,
          type: 'agent',
          name: 'New Autonomous Agent',
          subtitle: 'Model: Claude 3.5 Sonnet',
          position: { x: posX, y: posY },
          status: 'idle',
          config: {
            category: 'agent',
            role: 'Domain Specialist',
            model: 'Claude 3.5 Sonnet',
            temperature: 0.2,
            maxTokens: 4096,
            reasoningLevel: 'high',
            systemPrompt: 'You are an autonomous AI agent. Fulfill user objectives precisely using configured tools.',
            tools: ['Web Search'],
            knowledgeBases: [],
            memoryType: 'workflow',
            inputSchema: '{"input": "string"}',
            outputSchema: '{"output": "string"}',
            permissions: { readFiles: true, writeFiles: false, sendEmails: false, searchWeb: true, executeCode: false, callAPIs: true },
          },
        };
        break;
      case 'tool':
        newNode = {
          id,
          type: 'tool',
          name: 'Python Execution Tool',
          subtitle: 'Tool: Python Sandbox',
          position: { x: posX, y: posY },
          status: 'idle',
          config: { category: 'tool', toolName: 'Python Sandbox', categoryType: 'developer' },
        };
        break;
      case 'condition':
        newNode = {
          id,
          type: 'condition',
          name: 'Branch: Threshold Check',
          subtitle: 'Condition: score > 0.8',
          position: { x: posX, y: posY },
          status: 'idle',
          config: {
            category: 'condition',
            field: 'score',
            operator: 'greater_than',
            value: 0.8,
            trueTargetLabel: 'YES',
            falseTargetLabel: 'NO',
          },
        };
        break;
      case 'approval':
        newNode = {
          id,
          type: 'approval',
          name: 'Human Approval Gate',
          subtitle: 'Operator Checkpoint',
          position: { x: posX, y: posY },
          status: 'idle',
          config: {
            category: 'approval',
            title: 'Authorize Next Action',
            prompt: 'Review agent generated recommendations and authorize downstream execution.',
            approverRole: 'Workflow Owner',
            timeoutHours: 24,
            allowEditing: true,
          },
        };
        break;
      case 'memory':
        newNode = {
          id,
          type: 'memory',
          name: 'Query Knowledge Base',
          subtitle: 'Memory: Read Context',
          position: { x: posX, y: posY },
          status: 'idle',
          config: { category: 'memory', operation: 'read', namespace: 'workspace' },
        };
        break;
      case 'output':
        newNode = {
          id,
          type: 'output',
          name: 'Slack Broadcast',
          subtitle: 'Channel: #agentflow-runs',
          position: { x: posX, y: posY },
          status: 'idle',
          config: { category: 'output', destination: 'slack', format: 'markdown', target: '#agentflow-runs' },
        };
        break;
    }

    const updated = {
      ...workflow,
      nodes: [...workflow.nodes, newNode],
      agentCount: [...workflow.nodes, newNode].filter((n) => n.type === 'agent').length,
    };
    pushHistory(updated);
    setShowAddMenu(false);
    onSelectNode(newNode);
  };

  // Auto layout (hierarchical positioning)
  const handleAutoLayout = () => {
    // Topological-like layout
    const updatedNodes = [...workflow.nodes];
    const incomingCount = new Map<string, number>();
    workflow.nodes.forEach((n) => incomingCount.set(n.id, 0));
    workflow.edges.forEach((e) => incomingCount.set(e.to, (incomingCount.get(e.to) || 0) + 1));

    // Simple vertical hierarchical placement
    let currentY = 40;
    const sorted = [...updatedNodes].sort((a, b) => (incomingCount.get(a.id) || 0) - (incomingCount.get(b.id) || 0));

    sorted.forEach((node, index) => {
      node.position = {
        x: node.type === 'output' && node.name.includes('Archive') ? 680 : 380,
        y: currentY,
      };
      currentY += 130;
    });

    const updated = { ...workflow, nodes: sorted };
    pushHistory(updated);
  };

  // Delete Edge
  const handleDeleteEdge = (edgeId: string) => {
    const updated = {
      ...workflow,
      edges: workflow.edges.filter((e) => e.id !== edgeId),
    };
    pushHistory(updated);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          handleDeleteNode(selectedNodeId);
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        onRunWorkflow();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, workflow, onRunWorkflow]);

  // Compute bezier edge curves
  const renderEdge = (edge: WorkflowEdge) => {
    const fromNode = workflow.nodes.find((n) => n.id === edge.from);
    const toNode = workflow.nodes.find((n) => n.id === edge.to);

    if (!fromNode || !toNode) return null;

    let startX = fromNode.position.x + 160;
    let startY = fromNode.position.y + 140;

    if (fromNode.type === 'condition') {
      if (edge.fromHandle === 'yes' || edge.label?.includes('YES')) {
        startX = fromNode.position.x + 60;
      } else if (edge.fromHandle === 'no' || edge.label?.includes('NO')) {
        startX = fromNode.position.x + 260;
      }
    }

    const endX = toNode.position.x + 160;
    const endY = toNode.position.y;

    const deltaY = Math.abs(endY - startY);
    const controlPointY1 = startY + Math.max(deltaY * 0.5, 40);
    const controlPointY2 = endY - Math.max(deltaY * 0.5, 40);

    const pathD = `M ${startX} ${startY} C ${startX} ${controlPointY1}, ${endX} ${controlPointY2}, ${endX} ${endY}`;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    const isEdgeActive = isRunning && (fromNode.status === 'completed' || fromNode.status === 'running');

    return (
      <g key={edge.id} className="group/edge cursor-pointer" onClick={() => handleDeleteEdge(edge.id)}>
        {/* Invisible wider stroke for hover and click */}
        <path d={pathD} fill="none" stroke="transparent" strokeWidth="16" />

        {/* Outer Glow during active run */}
        {isEdgeActive && (
          <path
            d={pathD}
            fill="none"
            stroke="rgba(99, 102, 241, 0.4)"
            strokeWidth="6"
            className="filter blur-[2px]"
          />
        )}

        {/* Visible Edge Line */}
        <path
          d={pathD}
          fill="none"
          stroke={
            edge.label?.includes('NO')
              ? 'rgba(244, 63, 94, 0.6)'
              : edge.label?.includes('YES')
              ? 'rgba(16, 185, 129, 0.7)'
              : isEdgeActive
              ? '#818cf8'
              : '#3f3f46'
          }
          strokeWidth={isEdgeActive ? 2.5 : 1.75}
          markerEnd={
            edge.label?.includes('NO')
              ? 'url(#arrow-rose)'
              : edge.label?.includes('YES')
              ? 'url(#arrow-emerald)'
              : isEdgeActive
              ? 'url(#arrow-active)'
              : 'url(#arrow-zinc)'
          }
          className={`transition-colors group-hover/edge:stroke-indigo-400 ${
            isEdgeActive ? 'edge-animated' : ''
          }`}
        />

        {/* Label Badge */}
        {edge.label && (
          <g transform={`translate(${midX}, ${midY})`}>
            <rect
              x="-48"
              y="-11"
              width="96"
              height="22"
              rx="4"
              className={
                edge.label.includes('NO')
                  ? 'fill-rose-950/90 stroke stroke-rose-800/80'
                  : edge.label.includes('YES')
                  ? 'fill-emerald-950/90 stroke stroke-emerald-800/80'
                  : 'fill-zinc-900/90 stroke stroke-zinc-700/80'
              }
            />
            <text
              textAnchor="middle"
              dy="3.5"
              className={`text-[10px] font-mono font-medium select-none ${
                edge.label.includes('NO')
                  ? 'fill-rose-300'
                  : edge.label.includes('YES')
                  ? 'fill-emerald-300'
                  : 'fill-zinc-300'
              }`}
            >
              {edge.label}
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0b0d11] overflow-hidden select-none">
      {/* Top Floating Canvas Toolbar */}
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-30 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Workflow metadata & actions */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#12151c]/95 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-800 shadow-xl max-w-full overflow-hidden">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="font-semibold text-xs sm:text-sm text-zinc-100 truncate max-w-[140px] sm:max-w-[220px]">
                {workflow.name}
              </span>
              <button
                onClick={onOpenVersions}
                className="text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-1 shrink-0"
                title="Manage Workflow Versions"
              >
                <Layers className="w-3 h-3 text-indigo-400" />
                <span>{workflow.version}</span>
              </button>
            </div>
            <div className="hidden sm:flex text-[11px] text-zinc-400 items-center gap-2 mt-0.5">
              <span>{workflow.agentCount} Agents</span>
              <span>·</span>
              <span>{workflow.nodes.length} Nodes</span>
              <span>·</span>
              <span>{workflow.edges.length} Connections</span>
            </div>
          </div>

          <div className="h-4 sm:h-5 w-px bg-zinc-800 mx-0.5 sm:mx-1 shrink-0" />

          {/* Validation Status Indicator */}
          <button
            onClick={onOpenValidation}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-mono transition-colors shrink-0 ${
              validationIssues.some((i) => i.severity === 'error')
                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60 hover:bg-rose-900/60'
                : validationIssues.length > 0
                ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60'
                : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/40'
            }`}
          >
            {validationIssues.length === 0 ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Ready</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{validationIssues.length}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Primary Run & Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0 ml-auto sm:ml-0">
          {/* Workflow Copilot Trigger */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#12151c]/95 backdrop-blur-md rounded-lg border border-indigo-500/30 text-indigo-300 text-xs font-medium hover:bg-indigo-950/40 hover:border-indigo-400 transition-all shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Workflow Copilot</span>
            <span className="md:hidden">Copilot</span>
          </button>

          {/* Add Node Button */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#12151c]/95 backdrop-blur-md rounded-lg border border-zinc-800 text-zinc-200 text-xs font-medium hover:bg-zinc-800 hover:text-white transition-all shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Node</span>
            </button>

            {/* Dropdown Menu */}
            {showAddMenu && (
              <div className="absolute top-full mt-1.5 right-0 w-52 bg-[#141720] border border-zinc-800 rounded-lg shadow-2xl p-1 z-50">
                <div className="text-[10px] font-mono text-zinc-500 px-2 py-1 uppercase tracking-wider font-semibold">
                  Add to Canvas
                </div>
                <button
                  onClick={() => handleAddNode('agent')}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded transition-colors text-left"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Agent Node</span>
                </button>
                <button
                  onClick={() => handleAddNode('trigger')}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded transition-colors text-left"
                >
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Trigger Node</span>
                </button>
                <button
                  onClick={() => handleAddNode('tool')}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded transition-colors text-left"
                >
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tool Node</span>
                </button>
                <button
                  onClick={() => handleAddNode('condition')}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded transition-colors text-left"
                >
                  <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                  <span>Condition Node</span>
                </button>
                <button
                  onClick={() => handleAddNode('approval')}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded transition-colors text-left"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
                  <span>Human Approval Gate</span>
                </button>
                <button
                  onClick={() => handleAddNode('memory')}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded transition-colors text-left"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Memory Node</span>
                </button>
                <button
                  onClick={() => handleAddNode('output')}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded transition-colors text-left"
                >
                  <Send className="w-3.5 h-3.5 text-violet-400" />
                  <span>Output Node</span>
                </button>
              </div>
            )}
          </div>

          {/* Auto Layout */}
          <button
            onClick={handleAutoLayout}
            className="p-2 bg-[#12151c]/95 backdrop-blur-md rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-lg"
            title="Auto-Align Layout"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>

          {/* Run Button */}
          <button
            onClick={onRunWorkflow}
            disabled={isRunning}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold shadow-lg transition-all ${
              isRunning
                ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline">Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Main Canvas Area with Touch Gestures */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing canvas-grid relative overflow-hidden touch-none"
        onMouseDown={handleMouseDownCanvas}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            setZoom((z) => Math.min(Math.max(0.3, z + delta), 2));
          } else {
            setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
          }
        }}
      >
        {/* Transformable Canvas Group */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* SVG Connections & Wire Layer */}
          <svg className="absolute inset-0 w-[8000px] h-[8000px] overflow-visible pointer-events-auto">
            <defs>
              <marker
                id="arrow-zinc"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#52525b" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
              </marker>
              <marker
                id="arrow-emerald"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
              </marker>
              <marker
                id="arrow-rose"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
              </marker>
            </defs>

            {/* Existing Edges */}
            {workflow.edges.map(renderEdge)}

            {/* Currently Dragging Wire */}
            {connecting && (
              <path
                d={`M ${
                  (workflow.nodes.find((n) => n.id === connecting.fromNodeId)?.position.x || 0) + 160
                } ${
                  (workflow.nodes.find((n) => n.id === connecting.fromNodeId)?.position.y || 0) + 140
                } L ${connecting.currentPos.x} ${connecting.currentPos.y}`}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            )}
          </svg>

          {/* Node Cards Layer */}
          <div className="absolute inset-0 pointer-events-auto">
            {workflow.nodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                isSelected={selectedNodeId === node.id}
                onSelect={(id) => onSelectNode(workflow.nodes.find((n) => n.id === id) || null)}
                onMouseDown={handleNodeMouseDown}
                onStartConnect={handleStartConnect}
                onEndConnect={handleEndConnect}
                onDelete={handleDeleteNode}
                onDuplicate={handleDuplicateNode}
                onOpenConfig={(n) => onSelectNode(n)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Floating Controls (Zoom, History, Minimap) */}
      <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-[#12151c]/90 backdrop-blur-md rounded-lg border border-zinc-800 p-0.5 shadow-xl">
          <button
            onClick={handleUndo}
            disabled={historyIdx === 0}
            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 rounded transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 rounded transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center bg-[#12151c]/90 backdrop-blur-md rounded-lg border border-zinc-800 p-0.5 shadow-xl">
          <button
            onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}
            className="p-1.5 text-zinc-400 hover:text-white rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoom(0.9);
              setPan({ x: 260, y: 40 });
            }}
            className="px-2 py-1 text-[11px] font-mono text-zinc-300 hover:text-white rounded transition-colors"
            title="Reset Zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
            className="p-1.5 text-zinc-400 hover:text-white rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-zinc-800 my-auto" />
          <button
            onClick={handleFitToScreen}
            className="p-1.5 text-zinc-400 hover:text-white rounded transition-colors flex items-center gap-1 text-[11px] font-mono px-2"
            title="Fit All Nodes into Screen"
          >
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Fit</span>
          </button>
        </div>
      </div>

      {/* Bottom Right Minimap (Desktop only for clutter-free mobile touch) */}
      {showMinimap && (
        <div className="hidden md:block absolute bottom-4 right-4 z-30 w-44 h-32 bg-[#12151c]/90 backdrop-blur-md rounded-lg border border-zinc-800 shadow-2xl p-1.5 overflow-hidden">
          <div className="w-full h-full relative bg-[#090b0e] rounded border border-zinc-900 overflow-hidden">
            {/* Miniature Node dots */}
            {workflow.nodes.map((node) => {
              const miniX = (node.position.x / 1400) * 150 + 10;
              const miniY = (node.position.y / 1600) * 100 + 10;
              return (
                <div
                  key={node.id}
                  style={{ left: `${miniX}px`, top: `${miniY}px` }}
                  className={`absolute w-3 h-2 rounded-xs ${
                    node.type === 'agent'
                      ? 'bg-indigo-500'
                      : node.type === 'approval'
                      ? 'bg-orange-500'
                      : node.type === 'trigger'
                      ? 'bg-sky-500'
                      : 'bg-zinc-600'
                  }`}
                />
              );
            })}
            <div className="absolute bottom-1 right-1 text-[9px] font-mono text-zinc-600">
              MINIMAP
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
