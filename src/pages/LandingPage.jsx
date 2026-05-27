import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BookOpen, ShieldCheck, PieChart } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            <span className="block">Understand your </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Investments</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl mx-auto text-xl text-slate-600"
          >
            InvestEd AI helps students analyze portfolios, understand risk, and learn investing basics with Gemini-powered explanations.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex justify-center gap-4"
          >
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all hover:scale-105"
            >
              Get Started
            </button>
            <button
              className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Learn More
            </button>
          </motion.div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<PieChart className="w-8 h-8 text-primary-500" />}
            title="Portfolio Analysis"
            description="Deep dive into your diversification and sector exposure."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-accent-500" />}
            title="Risk Education"
            description="Understand what 'risk' actually means for your specific holdings."
          />
          <FeatureCard 
            icon={<BookOpen className="w-8 h-8 text-primary-500" />}
            title="AI Tutor"
            description="Ask our Gemini-powered tutor anything about your investments."
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-8 rounded-3xl"
  >
    <div className="bg-white/50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </motion.div>
);

export default LandingPage;
