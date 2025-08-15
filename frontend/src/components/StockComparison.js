import React, { useState, useEffect } from 'react';
import { compareStocks, getCompanies } from '../services/api';

const StockComparison = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState(['AAPL', 'MSFT']);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (selectedStocks.length === 0) return;

      try {
        setLoading(true);
        setError(null);
        const symbols = selectedStocks.join(',');
        const data = await compareStocks(symbols);
        setComparisonData(data);
      } catch (err) {
        setError('Failed to load comparison data');
        console.error('Error fetching comparison data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [selectedStocks]);

  const handleStockChange = (index, symbol) => {
    const newStocks = [...selectedStocks];
    newStocks[index] = symbol;
    setSelectedStocks(newStocks);
  };

  const addStock = () => {
    if (selectedStocks.length < 5) {
      setSelectedStocks([...selectedStocks, 'GOOGL']);
    }
  };

  const removeStock = (index) => {
    if (selectedStocks.length > 1) {
      const newStocks = selectedStocks.filter((_, i) => i !== index);
      setSelectedStocks(newStocks);
    }
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Stock Comparison
      </h2>

      {/* Stock Selection */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 items-center mb-4">
          {selectedStocks.map((symbol, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={symbol}
                onChange={(e) => handleStockChange(index, e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {companies.map((company) => (
                  <option key={company.symbol} value={company.symbol}>
                    {company.symbol} - {company.name}
                  </option>
                ))}
              </select>
              {selectedStocks.length > 1 && (
                <button
                  onClick={() => removeStock(index)}
                  className="px-2 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {selectedStocks.length < 5 && (
            <button
              onClick={addStock}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              + Add Stock
            </button>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {loading && (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {comparisonData && !loading && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3">Metric</th>
                {comparisonData.stocks.map((stock) => (
                  <th key={stock.symbol} className="px-4 py-3 text-center">
                    {stock.symbol}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3 font-medium">Current Price</td>
                {comparisonData.stocks.map((stock) => (
                  <td key={stock.symbol} className="px-4 py-3 text-center">
                    ${stock.current_price}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3 font-medium">Change</td>
                {comparisonData.stocks.map((stock) => (
                  <td key={stock.symbol} className="px-4 py-3 text-center">
                    <span className={stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.change_percent >= 0 ? '+' : ''}{stock.change_percent}%)
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3 font-medium">Volume</td>
                {comparisonData.stocks.map((stock) => (
                  <td key={stock.symbol} className="px-4 py-3 text-center">
                    {formatVolume(stock.volume)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3 font-medium">Market Cap</td>
                {comparisonData.stocks.map((stock) => (
                  <td key={stock.symbol} className="px-4 py-3 text-center">
                    {formatMarketCap(stock.market_cap)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3 font-medium">P/E Ratio</td>
                {comparisonData.stocks.map((stock) => (
                  <td key={stock.symbol} className="px-4 py-3 text-center">
                    {stock.pe_ratio ? stock.pe_ratio.toFixed(2) : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3 font-medium">Dividend Yield</td>
                {comparisonData.stocks.map((stock) => (
                  <td key={stock.symbol} className="px-4 py-3 text-center">
                    {stock.dividend_yield ? `${(stock.dividend_yield * 100).toFixed(2)}%` : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Beta</td>
                {comparisonData.stocks.map((stock) => (
                  <td key={stock.symbol} className="px-4 py-3 text-center">
                    {stock.beta ? stock.beta.toFixed(2) : 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {comparisonData && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Comparison date: {comparisonData.comparison_date}
        </div>
      )}
    </div>
  );
};

export default StockComparison;
