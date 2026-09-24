import React, { useState } from 'react';
import { X, Sparkles, Send, CornerDownLeft, Bot, Check } from 'lucide-react';
import { Workflow } from '../../types';
import { modifyWorkflowWithCopilot } from '../../services/workflowEngine';

interface WorkflowCopilotProps {
  workflow: Workflow;
  onUpdateWorkflow: (updated: Workflow) => void;
  onClose: () => void;
}

export const WorkflowCopilot: React.FC<WorkflowCopilotProps> = ({
  workflow,
  onUpdateWorkflow,
  onClose,
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'assistant'; text: string; timestamp: string }>
  >([
    {
      sender: 'assistant',
      text: 'I can help refine your multi-agent architecture. Try asking me to add adversarial reviewers, insert human approval gates, or modify tool connections.',
      timestamp: 'Now',
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const quickPrompts = [
    'Add human approval before saving anything',
    'Add a reviewer after the summarizer',
    'Add an email notification when the workflow finishes',
    'Add a condition filter node for confidence > 80%',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    setTimeout(() => {
      const { updatedWorkflow, message } = modifyWorkflowWithCopilot(workflow, text);
      onUpdateWorkflow(updatedWorkflow);

      const botMsg = {
        sender: 'assistant' as const,
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="absolute top-16 right-4 z-40 w-96 max-h-[580px] bg-[#12151d] border border-indigo-500/30 rounded-xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-4 py-3 bg-[#151824] border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-950/60 border border-indigo-500/40 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-100 block">Workflow Copilot</span>
            <span className="text-[10px] font-mono text-indigo-400">Autonomous Graph Mutator</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[320px] text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-2.5 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#1a1e29] border border-zinc-800 text-zinc-200'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] font-mono text-zinc-500 mt-0.5 px-1">{m.timestamp}</span>
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono p-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span>Updating workflow topology...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-2 border-t border-zinc-800/80 bg-[#0d0f15] space-y-1">
        <span className="text-[10px] font-mono text-zinc-500 px-1 uppercase tracking-wider">
          Suggested edits
        </span>
        <div className="flex flex-wrap gap-1">
          {quickPrompts.slice(0, 2).map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="text-[11px] text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 px-2 py-1 rounded text-left transition-colors border border-zinc-700/60"
            >
              + {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="p-2.5 border-t border-zinc-800 bg-[#141721] flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="e.g. Add human approval before output..."
          className="flex-1 bg-[#1a1e2a] border border-zinc-700/80 rounded-md px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
