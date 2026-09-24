import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Zap,
  RotateCw,
} from 'lucide-react';
import { SCHEDULE_TRIGGERS } from '../../data/catalog';
import { ScheduleTrigger } from '../../types';

export const SchedulesView: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleTrigger[]>(SCHEDULE_TRIGGERS);

  const toggleSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#0b0d11] p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Workflow Schedules & Triggers</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure automated cron intervals, webhook listeners, and incoming event dispatches.
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors self-start">
          <Plus className="w-3.5 h-3.5" />
          <span>New Scheduled Trigger</span>
        </button>
      </div>

      {/* Schedules List */}
      <div className="space-y-3">
        {schedules.map((sch) => (
          <div
            key={sch.id}
            className="p-4 rounded-xl bg-[#12151e] border border-zinc-800 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`p-2.5 rounded-lg border ${
                  sch.type === 'cron'
                    ? 'bg-sky-950/60 border-sky-500/30 text-sky-400'
                    : 'bg-indigo-950/60 border-indigo-500/30 text-indigo-400'
                }`}
              >
                {sch.type === 'cron' ? <Clock className="w-5 h-5" /> : <Zap className="w-5 h-5 text-indigo-400" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-zinc-100">
                    {sch.workflowName}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {sch.scheduleExpression}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-3 font-mono">
                  <span>Timezone: {sch.timezone}</span>
                  <span>·</span>
                  <span>Next run: {sch.nextRun}</span>
                  <span>·</span>
                  <span>Last run: {sch.lastRun}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Toggle switch */}
              <button
                onClick={() => toggleSchedule(sch.id)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                  sch.isEnabled ? 'bg-indigo-600' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    sch.isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
