import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BookOpen, 
  Wallet, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: 'customer' | 'student';
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, role, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'market', label: 'Market Analysis', icon: TrendingUp },
    ...(role === 'customer' ? [{ id: 'portfolio', label: 'My Portfolio', icon: Wallet }] : []),
    { id: 'learning', label: 'Learning Center', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={cn(
        "h-screen glass border-r border-white/10 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center border border-white/10">
              <Activity className="text-accent-green w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-200">StockSmart</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-accent-green/10 text-accent-green" 
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            )}
          >
            <item.icon size={22} className={cn(
              "transition-colors",
              activeTab === item.id ? "text-accent-green" : "group-hover:text-slate-200"
            )} />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-accent-red transition-colors"
        >
          <LogOut size={22} />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
