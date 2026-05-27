import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle, Lightbulb, MessageCircle } from 'lucide-react';
import { analyzePortfolio } from '../lib/agents';
import TutorChat from '../components/TutorChat';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const Dashboard = ({ portfolio, onBack, onReset }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnalysis = async () => {
      const result = await analyzePortfolio(portfolio);
      setAnalysis(result);
      setLoading(false);
    };
    getAnalysis();
  }, [portfolio]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-xl font-medium text-slate-600">Analyzing your portfolio with Gemini...</p>
        </div>
      </div>
    );
  }

  const assetTypeData = [
    { name: 'Stocks', value: portfolio.filter(h => h.type === 'Stock').length },
    { name: 'ETFs', value: portfolio.filter(h => h.type === 'ETF').length },
  ];

  const sectorData = Object.entries(
    portfolio.reduce((acc, h) => ({ ...acc, [h.sector]: (acc[h.sector] || 0) + 1 }), {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Edit
        </button>
        <button onClick={onReset} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
          Start Over
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Analysis Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary Card */}
          <section className="glass-card p-8 rounded-3xl">
            <h1 className="text-3xl font-bold mb-4">Portfolio Insights</h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              {analysis.summary}
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white/50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-primary-600 uppercase tracking-wider text-xs font-bold">
                  <PieChart className="w-4 h-4" /> Diversification Score
                </div>
                <div className="text-4xl font-black">{analysis.diversificationScore}/100</div>
              </div>
              <div className="p-6 bg-white/50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-accent-600 uppercase tracking-wider text-xs font-bold">
                  <AlertCircle className="w-4 h-4" /> Risk Level
                </div>
                <div className="text-4xl font-black">{analysis.riskLevel}</div>
              </div>
            </div>
          </section>

          {/* Charts Row */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="glass-card p-6 rounded-3xl min-h-[400px] flex flex-col">
              <h3 className="font-bold text-xl mb-6">Sector Exposure</h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-3xl min-h-[400px] flex flex-col">
              <h3 className="font-bold text-xl mb-6">Asset Allocation</h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetTypeData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Educational Explanation */}
          <section className="glass-card p-8 rounded-3xl border-l-8 border-primary-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="text-yellow-500" /> Explain it like I'm a student
            </h3>
            <p className="text-lg text-slate-700 italic">
              "{analysis.beginnerExplanation}"
            </p>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Tutor Chat */}
          <TutorChat portfolio={portfolio} />

          {/* Checklist */}
          <section className="glass-card p-6 rounded-3xl">
            <h3 className="font-bold text-lg mb-4">Educational Next Steps</h3>
            <div className="space-y-4">
              {analysis.learningTopics.map((topic, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle className="w-5 h-5 text-slate-300" />
                  </div>
                  <span className="text-slate-600">{topic}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
