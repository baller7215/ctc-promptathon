import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BookOpen, ShieldCheck, PieChart } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="relative min-h-screen bg-brand-gray overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-accent rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob"></div>
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-32 relative">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-brand-dark"
          >
            <span className="block italic">Secure your </span>
            <span className="block bg-brand-accent text-white px-4 py-2 inline-block -rotate-1">Future.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 max-w-xl mx-auto text-lg text-brand-gray-dark font-medium leading-relaxed"
          >
            PortfolioPilot helps students navigate the complex world of investing with Gemini-powered insights and professional-grade visualizations.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex justify-center gap-6"
          >
            <button
              onClick={onGetStarted}
              className="px-10 py-5 bg-brand-dark text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl flex items-center gap-3"
            >
              Get Started <TrendingUp className="w-6 h-6 text-brand-accent" />
            </button>
            <button
              className="px-10 py-5 bg-white text-brand-dark rounded-2xl font-bold text-lg shadow-soft border border-brand-border hover:bg-brand-gray transition-all"
            >
              Learn More
            </button>
          </motion.div>
        </div>

        <div className="mt-40 grid md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<PieChart className="w-8 h-8 text-brand-dark" />}
            title="Smarter Analysis"
            description="Professional metrics simplified for student portfolios."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-brand-dark" />}
            title="Risk Radar"
            description="Visualizing the true risk of your holdings in real-time."
          />
          <FeatureCard 
            icon={<BookOpen className="w-8 h-8 text-brand-dark" />}
            title="AI Copilot"
            description="A dedicated Gemini tutor to guide your financial literacy journey."
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="dash-card p-10 hover:border-brand-accent transition-colors"
  >
    <div className="bg-brand-accent/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
      {icon}
    </div>
    <h3 className="text-xl font-black mb-3">{title}</h3>
    <p className="text-brand-gray-dark text-sm leading-relaxed font-medium">{description}</p>
  </motion.div>
);

export default LandingPage;
