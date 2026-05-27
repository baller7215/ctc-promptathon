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
  Sparkles, Info, ArrowRight 
} from 'lucide-react';
import { analyzePortfolio, getMarketData } from '../lib/agents';
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

  useEffect(() => {
    const getDashboardData = async () => {
      setLoading(true);
      try {
        const tickers = portfolio.map(h => h.ticker);
        const [analysisResult, marketResult] = await Promise.all([
          analyzePortfolio(portfolio),
          getMarketData(tickers)
        ]);
        
        setAnalysis(analysisResult);
        setLivePrices(marketResult);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    getDashboardData();
  }, [portfolio]);

  // Slow drift to "simulate" live ticks from the base real price
  useEffect(() => {
    if (loading || Object.keys(livePrices).length === 0) return;
    
    const interval = setInterval(() => {
      setLivePrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(ticker => {
          const change = (Math.random() - 0.5) * 0.1; // Very subtle +/- 0.05%
          next[ticker] = {
            ...next[ticker],
            price: next[ticker].price + (next[ticker].price * (change/100))
          };
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [loading, livePrices]);

  const totalValue = useMemo(() => {
    return portfolio.reduce((acc, h) => {
      const marketInfo = livePrices[h.ticker];
      return acc + (h.shares * (marketInfo?.price || 0));
    }, 0);
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
    const sectors = portfolio.reduce((acc, h) => {
      const sector = livePrices[h.ticker]?.sector || h.sector || 'Other';
      return { ...acc, [sector]: (acc[sector] || 0) + 1 };
    }, {});
    return Object.entries(sectors).map(([name, value]) => ({ name, value }));
  }, [portfolio, livePrices]);

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
    <div className="space-y-10 pb-20">
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
          icon={<TrendingUp size={20} />} 
        />
        <KPICard 
          title="Primary Sector" 
          value={allocationData[0]?.name || 'N/A'} 
          icon={<Sparkles size={20} />} 
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left Side: Stats & Allocation */}
        <div className="lg:col-span-4 space-y-10">
          <div className="dash-card p-6">
            <SectionHeader title="Your Net Worth" />
            <div className="mb-2">
              <p className="text-3xl font-black text-brand-dark">
                ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+3.2% Today</span>
                <span className="text-xs text-brand-dark opacity-40">Live Market</span>
              </div>
            </div>
          </div>

          <div className="dash-card p-6">
            <SectionHeader title="Asset Allocation" />
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Total</p>
                <p className="text-lg font-black">{portfolio.length}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {allocationData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-xs font-bold text-brand-dark opacity-60">{d.name}</span>
                  </div>
                  <span className="text-xs font-black">{(d.value / portfolio.length * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Performance & Holdings */}
        <div className="lg:col-span-8 space-y-10">
          <div className="dash-card p-8">
            <SectionHeader title="Performance History" />
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#7c3aed" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorVal)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-accent" /> Asset Breakdown
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {portfolio.map((item, i) => {
                const live = livePrices[item.ticker] || {};
                const value = item.shares * (live.price || 0);
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 bg-white border border-brand-border rounded-2xl flex justify-between items-center group hover:border-brand-accent transition-colors shadow-sm"
                  >
                    <div>
                      <p className="text-xs font-black text-brand-accent mb-1">{item.ticker}</p>
                      <p className="text-sm font-bold text-brand-dark">{item.shares} Shares</p>
                      <p className="text-[10px] text-brand-dark opacity-40 uppercase tracking-tighter mt-1">{live.sector || 'Loading...'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-brand-dark">
                        ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-[10px] font-black text-green-500">
                        <ArrowUpRight size={10} />
                        {live.change?.toFixed(2) || '0.00'}%
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="dash-card p-8 bg-brand-accent/5 border-none">
            <h3 className="text-sm font-black text-brand-accent mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 fill-brand-accent" /> AI Insight Snapshot
            </h3>
            <p className="text-xl font-bold text-brand-dark italic leading-relaxed">
              "{analysis.beginnerExplanation}"
            </p>
            <div className="mt-6">
              <button 
                onClick={() => document.querySelector('div[onClick*="pilot"]').click()}
                className="text-xs font-black text-brand-accent hover:underline flex items-center gap-1"
              >
                Go to AI Pilot for deep learning <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
