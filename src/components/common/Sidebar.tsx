import React from 'react';
import {
  Home,
  Layers,
  Bot,
  LayoutTemplate,
  PlaySquare,
  BookOpen,
  Database,
  Wrench,
  Calendar,
  BarChart2,
  Settings,
  Globe,
  HelpCircle,
  ChevronDown,
  User,
  Sparkles,
  Command,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  pendingApprovalsCount?: number;
  onOpenCommandPalette: () => void;
  isLandingPage: boolean;
  onToggleLandingPage: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  pendingApprovalsCount = 1,
  onOpenCommandPalette,
  isLandingPage,
  onToggleLandingPage,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'workflows', label: 'Workflows', icon: Layers },
    { id: 'agents', label: 'Agents & Teams', icon: Bot },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    {
      id: 'runs',
      label: 'Runs',
      icon: PlaySquare,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} pending` : undefined,
    },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
    { id: 'memory', label: 'Memory', icon: Database },
    { id: 'integrations', label: 'Integrations', icon: Wrench },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 h-screen bg-[#0d0f15] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 select-none z-30">
      {/* Top Brand & Workspace */}
      <div className="p-3.5 space-y-3">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1.5 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-bold text-sm tracking-tight">
              AF
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-white block leading-none">
                AgentFlow
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5 block">
                Multi-Agent OS
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Dropdown */}
        <div className="bg-[#131620] border border-zinc-800/80 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] flex items-center justify-center font-bold">
              AR
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium text-zinc-200 truncate block leading-none">
                Applied AI Lab
              </span>
              <span className="text-[10px] text-zinc-500 truncate block mt-0.5">
                Pro Workspace
              </span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
        </div>

        {/* Quick Command Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#141722]/80 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors text-xs"
        >
          <span className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5 text-indigo-400" />
            <span>Search & Actions</span>
          </span>
          <kbd className="text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-2.5 py-1 space-y-0.5 overflow-y-auto scrollbar-none text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !isLandingPage && currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isLandingPage) onToggleLandingPage();
                onNavigate(item.id);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#141722]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile, Landing Page toggle & Help */}
      <div className="p-3 border-t border-zinc-800/80 space-y-2 bg-[#0a0c10]">
        {/* Toggle Landing Page button */}
        <button
          onClick={onToggleLandingPage}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
            isLandingPage
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-[#131620] border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isLandingPage ? 'Back to App' : 'Public Landing Page'}</span>
          </div>
          <span className="text-[10px] font-mono opacity-70">
            {isLandingPage ? 'Exit' : 'View'}
          </span>
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between px-2 py-1.5 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="font-medium text-zinc-200 truncate block leading-none">
                Alex Chen
              </span>
              <span className="text-[10px] text-zinc-500 truncate block mt-0.5 font-mono">
                Research Lead
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="text-zinc-500 hover:text-zinc-300 p-1"
            title="Account Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
