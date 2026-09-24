import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Bell,
  HardDrive,
  Download,
  Upload,
  Check,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [workspaceName, setWorkspaceName] = useState('Applied AI Lab');
  const [defaultModel, setDefaultModel] = useState('Claude 3.5 Sonnet');
  const [maxConcurrency, setMaxConcurrency] = useState(10);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#0b0d11] p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Workspace Settings</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure foundation model providers, default permissions, concurrency, and alert integrations.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved Settings</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </button>
      </div>

      <div className="max-w-3xl space-y-6 text-xs">
        {/* Workspace Identity */}
        <div className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 space-y-4">
          <div className="font-semibold text-sm text-zinc-100 border-b border-zinc-800 pb-2">
            General Configuration
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Workspace Title
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full bg-[#181b25] border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Default Foundation Model for Generated Agents
            </label>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="w-full bg-[#181b25] border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Default Recommended)</option>
              <option value="GPT-4o">GPT-4o</option>
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
              <option value="Llama 3.3 70B">Llama 3.3 70B</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Maximum Concurrent Agent Executions ({maxConcurrency})
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={maxConcurrency}
              onChange={(e) => setMaxConcurrency(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <span className="text-[10px] text-zinc-500 font-mono">
              Prevents API rate limiting across parallel agents.
            </span>
          </div>
        </div>

        {/* Human Approval Notification Channels */}
        <div className="p-5 rounded-xl bg-[#12151e] border border-zinc-800 space-y-4">
          <div className="font-semibold text-sm text-zinc-100 border-b border-zinc-800 pb-2">
            Human-in-the-Loop Notifications
          </div>

          <div className="space-y-3">
            <div
              onClick={() => setSlackAlerts(!slackAlerts)}
              className="flex items-center justify-between p-3 rounded-lg bg-[#181b25] border border-zinc-800 cursor-pointer"
            >
              <div>
                <div className="font-semibold text-zinc-200">Slack Dispatch Alerts</div>
                <div className="text-[10px] text-zinc-400">
                  Notify #agentflow-approvals channel with 1-click authorize buttons
                </div>
              </div>
              <div
                className={`w-8 h-4 rounded-full relative transition-colors ${
                  slackAlerts ? 'bg-indigo-600' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                    slackAlerts ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </div>

            <div
              onClick={() => setEmailAlerts(!emailAlerts)}
              className="flex items-center justify-between p-3 rounded-lg bg-[#181b25] border border-zinc-800 cursor-pointer"
            >
              <div>
                <div className="font-semibold text-zinc-200">Emergency Operator Email</div>
                <div className="text-[10px] text-zinc-400">
                  Send high-priority email alerts when an approval gate times out
                </div>
              </div>
              <div
                className={`w-8 h-4 rounded-full relative transition-colors ${
                  emailAlerts ? 'bg-indigo-600' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                    emailAlerts ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
