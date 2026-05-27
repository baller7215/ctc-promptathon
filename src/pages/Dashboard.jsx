import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, 
  Briefcase, ArrowUpRight, ArrowDownRight, 
  Sparkles, Info 
} from 'lucide-react';
import { analyzePortfolio } from '../lib/agents';
import TutorChat from '../components/TutorChat';

const COLORS = ['#7c3aed', '#1a1a1a', '#8e8e93', '#e5e5e7'];

const KPICard = ({ title, value, change, icon, isLighter = false }) => (
  <div className={`p-6 rounded-2xl flex flex-col justify-between h-40 ${isLighter ? 'bg-brand-accent text-white' : 'bg-white border border-brand-border shadow-soft'}`}>
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg ${isLighter ? 'bg-white/30' : 'bg-brand-gray'}`}>
        {icon}
      </div>
      {change && (
        <div className={`flex items-center text-xs font-bold ${change > 0 ? (isLighter ? 'text-brand-dark/70' : 'text-green-500') : 'text-red-500'}`}>
          {change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <div>
      <p className={`text-sm ${isLighter ? 'text-brand-dark/70' : 'text-brand-gray-dark'}`}>{title}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-black">{title}</h3>
    <button className="text-brand-gray-dark hover:text-brand-dark">
      <Info size={18} />
    </button>
  </div>
);

const Dashboard = ({ portfolio, onReset }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [livePrices, setLivePrices] = useState({});

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices(prev => {
        const next = { ...prev };
        portfolio.forEach(h => {
          const current = next[h.ticker] || 100;
          const change = (Math.random() - 0.5) * 2; // +/- 1%
          next[h.ticker] = Math.max(1, current + change);
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [portfolio]);

  useEffect(() => {
    const getAnalysis = async () => {
      const result = await analyzePortfolio(portfolio);
      setAnalysis(result);
      setLoading(false);
    };
    getAnalysis();
  }, [portfolio]);

  const totalValue = useMemo(() => {
    return portfolio.reduce((acc, h) => acc + (h.shares * (livePrices[h.ticker] || 100)), 0);
  }, [portfolio, livePrices]);

  const performanceData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 6000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: totalValue || 3490 },
  ];

  const allocationData = useMemo(() => {
    const sectors = portfolio.reduce((acc, h) => ({ ...acc, [h.sector]: (acc[h.sector] || 0) + 1 }), {});
    return Object.entries(sectors).map(([name, value]) => ({ name, value }));
  }, [portfolio]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 border-4 border-brand-accent border-t-brand-dark rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-black">Decrypting your portfolio...</p>
        <p className="text-brand-gray-dark">Fetching live market data via Gemini</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard 
          title="Total Portfolio Value" 
          value={`$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
          change={2.4} 
          icon={<Briefcase size={20} />} 
          isLighter 
        />
        <KPICard 
          title="Active Assets" 
          value={portfolio.length} 
          icon={<Briefcase size={20} />} 
        />
        <KPICard 
          title="Top Sector" 
          value={allocationData[0]?.name || 'N/A'} 
          icon={<TrendingUp size={20} />} 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Stats Column */}
        <div className="space-y-10 lg:col-span-1">
          <div className="dash-card p-6">
            <SectionHeader title="Balance" />
            <div className="mb-6">
              <p className="text-3xl font-black flex items-center gap-2">
                $80,300 <span className="text-sm font-bold text-green-500 bg-green-100 px-2 py-1 rounded-lg">+3.2%</span>
              </p>
              <p className="text-xs text-brand-gray-dark mt-1">Ready to be deployed</p>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-brand-dark text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                <ArrowDownRight size={16} /> Deposit
              </button>
              <button className="flex-1 py-3 bg-white border border-brand-border rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                <ArrowUpRight size={16} /> Withdraw
              </button>
            </div>
          </div>

          <div className="dash-card p-6">
            <SectionHeader title="Portfolio allocation" />
            <div className="h-48 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-1/2 space-y-2">
                {allocationData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-brand-gray-dark">{d.name}</span>
                    </div>
                    <span className="font-bold">{(d.value / portfolio.length * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Main Column */}
        <div className="lg:col-span-2 space-y-10">
          <div className="dash-card p-8">
            <SectionHeader title="Portfolio performance" />
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
             <div className="dash-card p-6 border-l-8 border-brand-accent">
              <h3 className="text-sm font-bold text-brand-gray-dark mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-dark" /> AI Insights
              </h3>
              <p className="text-md leading-relaxed text-brand-dark italic">
                "{analysis.beginnerExplanation}"
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {analysis.learningTopics.slice(0, 2).map((topic, i) => (
                  <span key={i} className="text-[10px] bg-brand-gray px-2 py-1 rounded-full uppercase tracking-widest font-black text-brand-gray-dark">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <TutorChat portfolio={portfolio} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
