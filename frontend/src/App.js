import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CompanyList from './components/CompanyList';
import StockChart from './components/StockChart';
import MarketSummary from './components/MarketSummary';
import StockComparison from './components/StockComparison';
import { stockAPI } from './services/api';
import { AlertCircle, RefreshCw, BarChart3, TrendingUp, PieChart } from 'lucide-react';

function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [period, setPeriod] = useState('1mo');
  const [activeTab, setActiveTab] = useState('chart'); // 'chart', 'market', 'compare'

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, []);

  // Load stock data when company is selected
  useEffect(() => {
    if (selectedCompany && activeTab === 'chart') {
      loadStockData(selectedCompany.symbol);
    }
  }, [selectedCompany, period, activeTab]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockAPI.getCompanies();
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies. Please try again.');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStockData = async (symbol) => {
    try {
      setChartLoading(true);
      setError(null);
      
      // Load current stock data and historical data in parallel
      const [currentData, historyData] = await Promise.all([
        stockAPI.getStockData(symbol),
        stockAPI.getStockHistory(symbol, period)
      ]);
      
      setStockData(currentData);
      setHistoricalData(historyData);
      
      // Update company in the list with current price
      setCompanies(prev => 
        prev.map(company => 
          company.symbol === symbol 
            ? { ...company, current_price: currentData.current_price, last_updated: currentData.last_updated }
            : company
        )
      );
    } catch (err) {
      setError(`Failed to load data for ${symbol}. Please try again.`);
      console.error('Error loading stock data:', err);
    } finally {
      setChartLoading(false);
    }
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setStockData(null);
    setHistoricalData(null);
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const handleRefresh = () => {
    if (selectedCompany) {
      loadStockData(selectedCompany.symbol);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chart':
        return (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Stock Analysis
            </h2>
            {selectedCompany && (
              <button
                onClick={handleRefresh}
                disabled={chartLoading}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${chartLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
          </div>
        );
      case 'market':
        return (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Market Overview
            </h2>
          </div>
        );
      case 'compare':
        return (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Stock Comparison
            </h2>
          </div>
        );
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chart':
        return (
          <StockChart
            historicalData={historicalData}
            stockData={stockData}
            loading={chartLoading}
            period={period}
            onPeriodChange={handlePeriodChange}
          />
        );
      case 'market':
        return <MarketSummary />;
      case 'compare':
        return <StockComparison />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header isOnline={isOnline} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Company List */}
          <div className="lg:col-span-1">
            <CompanyList
              companies={companies}
              selectedCompany={selectedCompany}
              onCompanySelect={handleCompanySelect}
              loading={loading}
            />
          </div>

          {/* Main Panel - Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('chart')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'chart'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Stock Chart
                </button>
                <button
                  onClick={() => setActiveTab('market')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'market'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Market Summary
                </button>
                <button
                  onClick={() => setActiveTab('compare')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'compare'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  Compare Stocks
                </button>
              </nav>
            </div>

            {/* Tab Header */}
            {renderTabContent()}
            
            {/* Tab Content */}
            {renderMainContent()}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>
              Data provided by Yahoo Finance • Built with React & FastAPI
            </p>
            <p className="mt-1">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
