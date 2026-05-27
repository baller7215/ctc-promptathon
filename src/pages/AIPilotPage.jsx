import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, ShieldAlert, Zap, ArrowRight, Brain } from 'lucide-react';
import { analyzePortfolio } from '../lib/agents';
import TutorChat from '../components/TutorChat';

const AIPilotPage = ({ portfolio }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tutorQuery, setTutorQuery] = useState(null);

  const askTutor = (topic) => {
    setTutorQuery(`Can you explain ${topic} in the context of my portfolio?`);
    // Reset after a short delay so it can be re-triggered
    setTimeout(() => setTutorQuery(null), 100);
  };

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
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 border-4 border-brand-accent border-t-brand-dark rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-black">PortfolioPilot is scanning your assets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column: Stats & Strengths */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dash-card p-10 bg-white border-2 border-brand-accent/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-brand-accent rounded-lg shadow-lg shadow-purple-500/20">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-brand-dark opacity-40">Mentor Insights</h3>
            </div>
            
            <div className="space-y-8 relative z-10">
              <div>
                <p className="text-xs text-brand-dark font-black tracking-widest uppercase mb-4 opacity-30">Summary Analysis</p>
                <p className="text-3xl font-bold leading-tight text-brand-dark">
                  "{analysis.summary}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-brand-gray rounded-2xl border border-brand-border">
                  <p className="text-[10px] text-brand-dark opacity-50 uppercase font-black mb-1">Risk Profile</p>
                  <p className="text-xl font-black text-brand-accent">{analysis.riskLevel}</p>
                </div>
                <div className="p-6 bg-brand-gray rounded-2xl border border-brand-border">
                  <p className="text-[10px] text-brand-dark opacity-50 uppercase font-black mb-1">Diversification</p>
                  <p className="text-xl font-black text-brand-accent">{analysis.diversificationScore}/100</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="dash-card p-8 border-t-8 border-[#10b981]">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#065f46] mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Strategic Strengths
              </h4>
              <ul className="space-y-4">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm font-bold text-brand-dark leading-snug flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full mt-1.5 shrink-0"></div>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="dash-card p-8 border-t-8 border-[#f59e0b]">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#92400e] mb-6 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Market Considerations
              </h4>
              <ul className="space-y-4">
                {analysis.concerns.map((c, i) => (
                  <li key={i} className="text-sm font-bold text-brand-dark leading-snug flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#f59e0b] rounded-full mt-1.5 shrink-0"></div>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Chat & Learning */}
        <div className="space-y-10 flex flex-col h-full">
          <TutorChat portfolio={portfolio} triggerQuery={tutorQuery} />
          
          <div className="dash-card p-8 bg-white border-2 border-brand-accent shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-brand-accent/10 transition-colors"></div>
            
            <h4 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-brand-accent relative z-10">
              <BookOpen className="w-4 h-4" /> Recommended Learning
            </h4>
            <div className="space-y-3 relative z-10">
              {analysis.learningTopics.map((topic, i) => (
                <button 
                  key={i} 
                  onClick={() => askTutor(topic)}
                  className="w-full px-5 py-4 bg-brand-gray rounded-xl border border-brand-border flex items-center justify-between group/pill hover:bg-brand-accent hover:border-brand-accent transition-all duration-300"
                >
                  <span className="text-sm font-black text-brand-dark group-hover/pill:text-white">{topic}</span>
                  <ArrowRight className="w-4 h-4 text-brand-accent group-hover/pill:text-white transform group-hover/pill:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-brand-border text-[10px] text-brand-dark opacity-40 font-medium leading-relaxed italic">
              Click a topic to ask your AI Mentor for a deep dive.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPilotPage;
