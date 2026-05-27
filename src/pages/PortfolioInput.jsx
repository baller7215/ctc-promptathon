import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Plus, ArrowRight, Play } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={onBack} className="mb-8 flex items-center text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Landing
      </button>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose a Demo Portfolio</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {DEMO_PORTFOLIOS.map(demo => (
            <button
              key={demo.id}
              onClick={() => loadDemo(demo)}
              className="glass-card p-6 rounded-2xl text-left hover:border-primary-400 border border-transparent transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{demo.name}</h3>
                <Play className="w-5 h-5 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-slate-500">{demo.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl">
        <h2 className="text-2xl font-bold mb-6">Or Enter Manually</h2>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Ticker (e.g. AAPL)"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <input
            type="number"
            placeholder="Shares"
            value={newShares}
            onChange={(e) => setNewShares(e.target.value)}
            className="w-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <button
            onClick={addHolding}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add
          </button>
        </div>

        <div className="space-y-3 mb-8">
          <AnimatePresence>
            {holdings.map((h, i) => (
              <motion.div
                key={`${h.ticker}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-100"
              >
                <div>
                  <span className="font-bold text-primary-600 mr-2">{h.ticker}</span>
                  <span className="text-slate-500">{h.name}</span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="text-slate-600">{h.shares} shares</span>
                </div>
                <button
                  onClick={() => removeHolding(i)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {holdings.length === 0 && (
            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              No holdings added yet.
            </div>
          )}
        </div>

        {holdings.length > 0 && (
          <button
            onClick={() => onAnalyze(holdings)}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Analyze Portfolio <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PortfolioInput;
