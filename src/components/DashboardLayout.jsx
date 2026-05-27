import React from 'react';
import { LayoutDashboard, Wallet, BarChart3, ArrowLeftRight, FileText, Search, Bell, User, Sparkles } from 'lucide-react';

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active ? 'bg-brand-accent text-white font-black shadow-lg shadow-purple-500/20 scale-105' : 'text-brand-dark opacity-60 hover:bg-brand-gray hover:opacity-100 hover:text-brand-dark'
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const DashboardLayout = ({ children, onBack, activeTab, onTabChange }) => {
  return (
    <div className="flex min-h-screen bg-brand-gray">
      {/* Sidebar */}
      <aside className="w-64 border-r border-brand-border bg-white flex flex-col p-6 space-y-8 h-screen sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-brand-accent" />
          </div>
          <span className="text-xl font-black tracking-tighter">PortfolioPilot</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'overview'} 
            onClick={() => onTabChange('overview')}
          />
          <SidebarItem 
            icon={<Sparkles size={20} />} 
            label="AI Pilot" 
            active={activeTab === 'pilot'} 
            onClick={() => onTabChange('pilot')}
          />
        </nav>

        <div className="pt-8 border-t border-brand-border">
          <button onClick={onBack} className="flex items-center gap-2 text-brand-gray-dark hover:text-brand-dark text-sm px-4">
            <ArrowLeftRight className="w-4 h-4" /> Reset Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 p-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-brand-border">
          <div>
            <h2 className="text-xl font-black text-brand-dark">
              {activeTab === 'overview' ? 'Portfolio Overview' : 'AI Mentor Session'}
            </h2>
            <p className="text-xs text-brand-dark opacity-60">
              {activeTab === 'overview' ? 'Real-time performance tracking.' : 'Deep learning and insights powered by Gemini.'}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-brand-dark">InvestEd Student</p>
                <p className="text-xs text-brand-dark opacity-60">portfolio@pilot.ai</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white border border-brand-border overflow-hidden p-1 shadow-sm">
                <div className="w-full h-full rounded-full bg-brand-accent flex items-center justify-center">
                  <User className="text-white w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
