import React from 'react';
import { 
  LayoutDashboard, 
  Music, 
  Users,
  Library,
  DollarSign, 
  Settings, 
  LogOut,
  PlusCircle,
  ShieldCheck,
  Flag,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AdminRoleType, hasPermission } from '../lib/permissions';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'user' | 'admin';
  adminRole?: AdminRoleType;
  onOpenReport?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, userRole, adminRole, onOpenReport, isOpen, onClose }: SidebarProps) {
  const creatorMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Catalog', icon: Library },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const adminMenuItems = [
    { id: 'admin-overview', label: 'Overview', icon: LayoutDashboard, permission: 'view_overview' },
    { id: 'admin-users', label: 'Users', icon: Users, permission: 'manage_users' },
    { id: 'admin-tracks', label: 'Tracks', icon: Music, permission: 'manage_tracks' },
    { id: 'admin-verifications', label: 'Verifications', icon: ShieldCheck, permission: 'manage_verifications' },
    { id: 'admin-royalties', label: 'Royalties', icon: DollarSign, permission: 'manage_royalties' },
    { id: 'admin-reports', label: 'Reports', icon: Flag, permission: 'manage_reports' },
    { id: 'admin-settings', label: 'Settings', icon: Settings, permission: 'manage_settings' },
  ];

  const filteredAdminItems = adminMenuItems.filter(item => 
    !adminRole || hasPermission(adminRole, item.permission as any)
  );

  const menuItems = userRole === 'admin' ? filteredAdminItems : creatorMenuItems;

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 h-screen flex flex-col border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 lg:relative lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center text-white font-bold">K</div>
          <div className="flex flex-col -space-y-1">
            <span className="text-zinc-900 dark:text-white font-bold text-xl tracking-tight leading-none">KulSound</span>
            <span className="text-[6px] font-bold uppercase tracking-widest text-zinc-500">...the creator galaxy</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm dark:shadow-none" 
                : "hover:bg-zinc-200/50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeTab === item.id ? "text-brand-purple" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-400"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {userRole !== 'admin' && (
        <div className="px-4 py-2 space-y-4">
          <button 
            onClick={onOpenReport}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-all duration-200 group border border-rose-500/20"
          >
            <Flag className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Report Issue</span>
          </button>

          <div className="p-4 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Storage</p>
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
              <div className="w-3/4 h-full bg-brand-gradient rounded-full shadow-[0_0_8px_rgba(192,38,211,0.5)]" />
            </div>
            <div className="flex justify-between text-[10px] font-medium">
              <span className="text-zinc-500 dark:text-zinc-400">7.5 GB used</span>
              <span className="text-zinc-400 dark:text-zinc-500">10 GB total</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
