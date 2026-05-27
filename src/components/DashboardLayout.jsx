import React from 'react';
import { LayoutDashboard, Wallet, BarChart3, ArrowLeftRight, FileText, Search, Bell, User } from 'lucide-react';

const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-brand-lime text-brand-dark font-bold' : 'text-brand-gray-dark hover:bg-white hover:text-brand-dark'
  }`}>
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const DashboardLayout = ({ children, onBack }) => {
  return (
    <div className="flex min-h-screen bg-brand-gray">
      {/* Sidebar */}
      <aside className="w-64 border-r border-brand-border bg-brand-gray flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-brand-accent" />
          </div>
          <span className="text-xl font-black tracking-tighter">PortfolioPilot</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
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
        <header className="h-20 border-b border-brand-border flex items-center justify-between px-10 bg-brand-gray/50 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black">Welcome back, Traveler</h2>
            <p className="text-xs text-brand-gray-dark">Your financial journey is in safe hands.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold">InvestEd Student</p>
                <p className="text-xs text-brand-gray-dark">portfolio@pilot.ai</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white border border-brand-border overflow-hidden p-1">
                <div className="w-full h-full rounded-full bg-brand-accent flex items-center justify-center">
                  <User size={20} className="text-brand-dark" />
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
