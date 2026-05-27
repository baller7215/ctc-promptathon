import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import PortfolioInput from './pages/PortfolioInput';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import AIPilotPage from './pages/AIPilotPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeTab, setActiveTab] = useState('overview');
  const [portfolio, setPortfolio] = useState([]);

  const startAnalysis = (data) => {
    setPortfolio(data);
    setCurrentPage('dashboard');
  };

  const reset = () => {
    setPortfolio([]);
    setCurrentPage('landing');
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-brand-gray text-brand-dark">
      {currentPage === 'landing' && <LandingPage onGetStarted={() => setCurrentPage('input')} />}
      
      {currentPage === 'input' && (
        <PortfolioInput 
          onBack={() => setCurrentPage('landing')} 
          onAnalyze={startAnalysis}
        />
      )}

      {currentPage === 'dashboard' && (
        <DashboardLayout 
          onBack={reset} 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        >
          {activeTab === 'overview' ? (
            <Dashboard 
              portfolio={portfolio} 
              onBack={() => setCurrentPage('input')}
              onReset={reset}
            />
          ) : (
            <AIPilotPage portfolio={portfolio} />
          )}
        </DashboardLayout>
      )}
    </div>
  );
}

export default App;
