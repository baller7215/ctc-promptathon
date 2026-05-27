import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Plus, ArrowRight, Play, Wallet } from 'lucide-react';
import { DEMO_PORTFOLIOS, STOCKS_METADATA } from '../data/mockData';

const PortfolioInput = ({ onBack, onAnalyze }) => {
  const [holdings, setHoldings] = useState([]);
  const [newTicker, setNewTicker] = useState('');
  const [newShares, setNewShares] = useState('');

  const addHolding = () => {
    if (!newTicker || !newShares) return;
    const ticker = newTicker.toUpperCase();
    const metadata = STOCKS_METADATA[ticker] || { name: 'Unknown Asset', type: 'Stock', sector: 'Other', risk: 'Medium' };
    
    setHoldings([...holdings, {
      ticker,
      shares: parseFloat(newShares),
      name: metadata.name,
      type: metadata.type,
      sector: metadata.sector,
      risk: metadata.risk
    }]);
    setNewTicker('');
    setNewShares('');
  };

  const removeHolding = (index) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const loadDemo = (demo) => {
    const demoHoldings = demo.holdings.map(h => {
      const metadata = STOCKS_METADATA[h.ticker] || { name: 'Unknown', type: 'ETF', sector: 'Other', risk: 'Medium' };
      return {
        ...h,
        name: metadata.name,
        type: metadata.type,
        sector: metadata.sector,
        risk: metadata.risk
      };
    });
    setHoldings(demoHoldings);
  };

  return (
    <div className="min-h-screen bg-brand-gray py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-12 flex items-center text-brand-gray-dark hover:text-brand-dark transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> EXIT TO LANDING
        </button>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-brand-lime" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Select a Template</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {DEMO_PORTFOLIOS.map(demo => (
              <button
                key={demo.id}
                onClick={() => loadDemo(demo)}
                className="dash-card p-6 text-left hover:border-brand-dark border-2 border-transparent transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-sm uppercase tracking-wider">{demo.name}</h3>
                  <Play className="w-4 h-4 text-brand-lime fill-brand-dark opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-brand-gray-dark leading-relaxed font-medium">{demo.description}</p>
                <div className="absolute bottom-0 left-0 h-1 bg-brand-lime w-0 group-hover:w-full transition-all duration-300"></div>
              </button>
            ))}
          </div>
        </div>

        <div className="dash-card p-10">
          <h2 className="text-2xl font-black mb-8">Build Custom Portfolio</h2>
          
          <div className="flex flex-wrap gap-4 mb-10">
            <input
              type="text"
              placeholder="TICKER (e.g. AAPL)"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              className="flex-1 min-w-[200px] px-5 py-4 rounded-xl bg-brand-gray border-none focus:ring-2 focus:ring-brand-dark outline-none font-bold text-sm"
            />
            <input
              type="number"
              placeholder="SHARES"
              value={newShares}
              onChange={(e) => setNewShares(e.target.value)}
              className="w-32 px-5 py-4 rounded-xl bg-brand-gray border-none focus:ring-2 focus:ring-brand-dark outline-none font-bold text-sm"
            />
            <button
              onClick={addHolding}
              className="px-8 py-4 bg-brand-dark text-white rounded-xl font-black text-sm hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5 text-brand-lime" /> ADD
            </button>
          </div>

          <div className="space-y-4 mb-10">
            <AnimatePresence>
              {holdings.map((h, i) => (
                <motion.div
                  key={`${h.ticker}-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-5 bg-brand-gray rounded-xl group border border-transparent hover:border-brand-border"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-black text-lg text-brand-dark bg-brand-lime px-3 py-1 rounded-lg">{h.ticker}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-brand-dark">{h.name}</span>
                      <span className="text-xs text-brand-gray-dark">{h.shares} units · {h.sector}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeHolding(i)}
                    className="p-2 text-brand-gray-dark hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {holdings.length === 0 && (
              <div className="text-center py-16 text-brand-gray-dark border-2 border-dashed border-brand-border rounded-2xl font-bold italic">
                Your hanger is empty. Add a stock or choose a template to begin.
              </div>
            )}
          </div>

          {holdings.length > 0 && (
            <button
              onClick={() => onAnalyze(holdings)}
              className="w-full py-5 bg-brand-lime text-brand-dark rounded-2xl font-black text-xl hover:bg-brand-dark hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
            >
              LIFT OFF <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioInput;
