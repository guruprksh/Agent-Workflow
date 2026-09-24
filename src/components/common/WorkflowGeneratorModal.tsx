import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Send,
  Zap,
} from 'lucide-react';
import { Workflow } from '../../types';
import { generateWorkflowFromPrompt } from '../../services/workflowEngine';

interface WorkflowGeneratorModalProps {
  initialPrompt?: string;
  onClose: () => void;
  onWorkflowGenerated: (newWorkflow: Workflow) => void;
}

export const WorkflowGeneratorModal: React.FC<WorkflowGeneratorModalProps> = ({
  initialPrompt = '',
  onClose,
  onWorkflowGenerated,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<Workflow | null>(null);

  const generationStages = [
    'Understanding objective...',
    'Identifying required agents...',
    'Selecting tools...',
    'Designing workflow...',
    'Checking dependencies...',
    'Preparing workflow...',
  ];

  const handleStartGeneration = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setCurrentStepIdx(0);
  };

  useEffect(() => {
    if (!isGenerating) return;

    if (currentStepIdx < generationStages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIdx((idx) => idx + 1);
      }, 550);
      return () => clearTimeout(timer);
    } else {
      // Finished all stages!
      const timer = setTimeout(() => {
        const wf = generateWorkflowFromPrompt(prompt);
        setGeneratedWorkflow(wf);
        setIsGenerating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, currentStepIdx, prompt]);

  // If initialPrompt was provided, trigger immediately
  useEffect(() => {
    if (initialPrompt && initialPrompt.length > 10 && !isGenerating && !generatedWorkflow) {
      handleStartGeneration();
    }
  }, []);

  const examplePrompts = [
    'Every Monday search for new papers about nonlinear ultrasonics and composite damage. Determine which papers are relevant to my research, summarize them, identify the experimental methods and add relevant papers to my research library.',
    'When a high-value customer signs up, enrich firmographics from Clearbit, evaluate ICP fit, draft customized pitch points, and alert AE on Slack for approval.',
    'Every Friday monitor competitor pricing and releases, extract changelogs, analyze community sentiment on Reddit, and build an executive brief.',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#11141c] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#141723] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-sm text-zinc-100">
                Natural Language Workflow Creator
              </span>
              <span className="text-[11px] text-zinc-400 block">
                Describe the work. Build the team. Let the team execute it.
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isGenerating && !generatedWorkflow ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-2 font-medium">
                  What do you want your AI team to accomplish?
                </label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='e.g. "Every Monday search for new papers about composite damage, summarize them, verify claims, and require my approval before saving to Zotero..."'
                  className="w-full bg-[#171a25] border border-zinc-800 rounded-lg p-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed shadow-inner"
                />
              </div>

              <div>
                <span className="text-[11px] font-mono text-zinc-500 block mb-2 uppercase tracking-wider">
                  Or pick an example prompt:
                </span>
                <div className="space-y-1.5">
                  {examplePrompts.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(ex)}
                      className="w-full text-left p-2.5 rounded-lg bg-[#151822] hover:bg-[#1a1e2b] border border-zinc-800/80 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition-colors line-clamp-2 leading-relaxed"
                    >
                      "{ex}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleStartGeneration}
                  disabled={!prompt.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 disabled:opacity-40 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Build Workflow Team</span>
                </button>
              </div>
            </div>
          ) : isGenerating ? (
            /* Generating Animation Stages */
            <div className="py-8 px-4 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-indigo-500/10">
                  <Bot className="w-6 h-6 animate-bounce" />
                </div>
                <div className="font-semibold text-sm text-zinc-100">
                  Synthesizing Multi-Agent System
                </div>
                <p className="text-xs text-zinc-400 max-w-md mx-auto truncate">
                  "{prompt}"
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-2.5">
                {generationStages.map((stage, idx) => {
                  const isCurrent = idx === currentStepIdx;
                  const isDone = idx < currentStepIdx;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 text-xs font-mono transition-colors ${
                        isDone
                          ? 'text-emerald-400'
                          : isCurrent
                          ? 'text-indigo-400 font-semibold'
                          : 'text-zinc-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0 mx-0.5" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 shrink-0 mx-1" />
                      )}
                      <span>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Workflow Generated Summary */
            <div className="py-4 space-y-5">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-900/40 text-emerald-400 border border-emerald-800/60">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-emerald-200 block">
                      Workflow Generated Successfully
                    </span>
                    <span className="text-xs text-zinc-400">
                      Formed an autonomous team of {generatedWorkflow?.agentCount} specialist agents with tools and oversight.
                    </span>
                  </div>
                </div>
              </div>

              {generatedWorkflow && (
                <div className="p-4 rounded-lg bg-[#151824] border border-zinc-800 space-y-3 text-xs">
                  <div className="font-semibold text-zinc-200 text-sm">
                    {generatedWorkflow.name}
                  </div>
                  <div className="text-zinc-400 line-clamp-2">
                    {generatedWorkflow.description}
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-4 text-zinc-400 font-mono text-[11px]">
                    <span className="text-indigo-400 font-semibold">
                      {generatedWorkflow.nodes.filter((n) => n.type === 'agent').length} Agents
                    </span>
                    <span>·</span>
                    <span>{generatedWorkflow.nodes.length} Nodes</span>
                    <span>·</span>
                    <span>{generatedWorkflow.edges.length} Connections</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setGeneratedWorkflow(null);
                    setIsGenerating(false);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Adjust Prompt
                </button>
                <button
                  onClick={() => generatedWorkflow && onWorkflowGenerated(generatedWorkflow)}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <span>Open in Visual Canvas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
