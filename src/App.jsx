import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import PortfolioInput from './pages/PortfolioInput';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/DashboardLayout';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [portfolio, setPortfolio] = useState([]);

  const startAnalysis = (newPortfolio) => {
    setPortfolio(newPortfolio);
    setCurrentPage('dashboard');
  };

  const reset = () => {
    setPortfolio([]);
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {currentPage === 'landing' && (
        <LandingPage 
          onGetStarted={() => setCurrentPage('input')} 
        />
      )}
      
      {currentPage === 'input' && (
        <PortfolioInput 
          onBack={() => setCurrentPage('landing')}
          onAnalyze={startAnalysis}
        />
      )}

      {currentPage === 'dashboard' && (
        <DashboardLayout onBack={reset}>
          <Dashboard 
            portfolio={portfolio} 
            onBack={() => setCurrentPage('input')}
            onReset={reset}
          />
        </DashboardLayout>
      )}
    </div>
  );
}

export default App;
