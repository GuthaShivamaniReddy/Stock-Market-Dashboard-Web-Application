import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const StockChart = ({ historicalData, stockData, loading, period, onPeriodChange }) => {
  const [chartType, setChartType] = useState('line'); // Default to line chart for cleaner look
  const [showVolume, setShowVolume] = useState(true);
  const [showMA, setShowMA] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [timeframe, setTimeframe] = useState('1mo');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toLocaleString();
  };

  const calculateMovingAverage = (data, period = 20) => {
    if (!data || data.length < period) return data;
    
    return data.map((item, index) => {
      if (index < period - 1) return item;
      
      const sum = data
        .slice(index - period + 1, index + 1)
        .reduce((acc, val) => acc + val.close, 0);
      const ma = sum / period;
      
      return { ...item, ma20: ma };
    });
  };

  const calculateRSI = (data, period = 14) => {
    if (!data || data.length < period + 1) return data;
    
    return data.map((item, index) => {
      if (index < period) return item;
      
      let gains = 0;
      let losses = 0;
      
      for (let i = index - period + 1; i <= index; i++) {
        const change = data[i].close - data[i - 1].close;
        if (change > 0) gains += change;
        else losses -= change;
      }
      
      const avgGain = gains / period;
      const avgLoss = losses / period;
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      
      return { ...item, rsi: rsi };
    });
  };

  const prepareChartData = () => {
    if (!historicalData || !historicalData.prices) return [];

    const baseData = historicalData.prices.map((price, index) => ({
      date: historicalData.dates[index],
      price: parseFloat(price),
      close: parseFloat(price), // For compatibility with existing code
      volume: historicalData.volumes ? historicalData.volumes[index] : 0
    }));
    
    // Add technical indicators
    let enhancedData = calculateMovingAverage(baseData, 20);
    if (showRSI) {
      enhancedData = calculateRSI(enhancedData, 14);
    }

    return enhancedData;
  };



  const renderProfessionalLineChart = (data) => (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF"
          fontSize={11}
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke="#9CA3AF"
          fontSize={11}
          tickFormatter={formatCurrency}
          domain={['dataMin - 2', 'dataMax + 2']}
          axisLine={false}
          tickLine={false}
          orientation="right"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F9FAFB',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
          }}
          formatter={(value, name) => [
            name === 'volume' ? formatVolume(value) : formatCurrency(value),
            name === 'volume' ? 'Volume' : name.charAt(0).toUpperCase() + name.slice(1)
          ]}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
          cursor={{ stroke: '#6B7280', strokeWidth: 1 }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="close" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={false}
          name="Price"
          activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#FFFFFF' }}
        />
        {showMA && (
          <Line 
            type="monotone" 
            dataKey="ma20" 
            stroke="#F59E0B" 
            strokeWidth={1.5}
            dot={false}
            name="20-Day MA"
          />
        )}
        {showVolume && (
          <Bar 
            dataKey="volume" 
            fill="#6B7280" 
            fillOpacity={0.3}
            yAxisId={1}
            name="Volume"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderProfessionalAreaChart = (data) => (
    <ResponsiveContainer width="100%" height={500}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF"
          fontSize={11}
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke="#9CA3AF"
          fontSize={11}
          tickFormatter={formatCurrency}
          domain={['dataMin - 2', 'dataMax + 2']}
          axisLine={false}
          tickLine={false}
          orientation="right"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F9FAFB',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
          }}
          formatter={(value, name) => [
            name === 'volume' ? formatVolume(value) : formatCurrency(value),
            name === 'volume' ? 'Volume' : name.charAt(0).toUpperCase() + name.slice(1)
          ]}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
          cursor={{ stroke: '#6B7280', strokeWidth: 1 }}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="close" 
          stroke="#3B82F6" 
          fill="url(#priceGradient)"
          strokeWidth={2}
          name="Price"
        />
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        {showMA && (
          <Line 
            type="monotone" 
            dataKey="ma20" 
            stroke="#F59E0B" 
            strokeWidth={1.5}
            dot={false}
            name="20-Day MA"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderProfessionalVolumeChart = (data) => {
    // Calculate average volume for color coding
    const volumes = data.map(item => item.volume).filter(v => v > 0);
    const avgVolume = volumes.length > 0 ? volumes.reduce((a, b) => a + b, 0) / volumes.length : 0;
    
    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={11}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={11}
            tickFormatter={formatVolume}
            axisLine={false}
            tickLine={false}
            orientation="right"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
            }}
            formatter={(value, name) => [formatVolume(value), name]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            cursor={{ stroke: '#6B7280', strokeWidth: 1 }}
          />
          <Legend />
                     <Bar 
             dataKey="volume" 
             name="Volume"
             radius={[2, 2, 0, 0]}
             fillOpacity={0.8}
             fill={(entry) => {
               if (entry.volume === 0) return '#6B7280'; // Gray for zero volume
               if (entry.volume > avgVolume * 1.5) return '#7C3AED'; // Dark purple for high volume
               if (entry.volume > avgVolume) return '#A855F7'; // Purple for above average
               return '#C084FC'; // Light purple for below average
             }}
           />
          {/* Average volume reference line */}
          <ReferenceLine 
            y={avgVolume} 
            stroke="#F59E0B" 
            strokeDasharray="3 3" 
            strokeWidth={1}
            label={{ 
              value: `Avg: ${formatVolume(avgVolume)}`, 
              position: 'insideTopRight',
              fill: '#F59E0B',
              fontSize: 10
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    const data = prepareChartData();
    
    switch (chartType) {
      case 'line':
        return renderProfessionalLineChart(data);
      case 'area':
        return renderProfessionalAreaChart(data);
      case 'volume':
        return renderProfessionalVolumeChart(data);
      default:
        return renderProfessionalLineChart(data);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  if (!historicalData || !stockData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400 py-16">
          <div className="text-4xl mb-4">📈</div>
          <p className="text-lg font-medium">Select a company to view stock data</p>
          <p className="text-sm mt-2">Choose from the list on the left to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Professional Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {stockData.symbol}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(stockData.current_price)}
              <span className={`ml-2 font-medium ${
                stockData.change >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stockData.change >= 0 ? '+' : ''}{stockData.change} ({stockData.change_percent >= 0 ? '+' : ''}{stockData.change_percent}%)
              </span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Chart Type Selector */}
            <div className="flex items-center space-x-2">
                             <select
                 value={chartType}
                 onChange={(e) => setChartType(e.target.value)}
                 className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                 <option value="line">Line</option>
                 <option value="area">Area</option>
                 <option value="volume">Volume</option>
               </select>
            </div>

            {/* Period Selector */}
            <div className="flex items-center space-x-2">
              <select
                value={period}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1d">1D</option>
                <option value="5d">5D</option>
                <option value="1mo">1M</option>
                <option value="3mo">3M</option>
                <option value="6mo">6M</option>
                <option value="1y">1Y</option>
                <option value="2y">2Y</option>
                <option value="5y">5Y</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                 <div className="flex items-center space-x-6">
           {chartType === 'line' && (
             <>
               <label className="flex items-center space-x-2">
                 <input
                   type="checkbox"
                   checked={showMA}
                   onChange={(e) => setShowMA(e.target.checked)}
                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                 />
                 <span className="text-sm text-gray-700 dark:text-gray-300">20-Day MA</span>
               </label>
               <label className="flex items-center space-x-2">
                 <input
                   type="checkbox"
                   checked={showVolume}
                   onChange={(e) => setShowVolume(e.target.checked)}
                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                 />
                 <span className="text-sm text-gray-700 dark:text-gray-300">Volume</span>
               </label>
             </>
           )}

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showRSI}
              onChange={(e) => setShowRSI(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">RSI</span>
          </label>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        {renderChart()}
      </div>

      {/* Professional Footer with Key Metrics */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Volume:</span>
            <span className="ml-2 text-gray-900 dark:text-white font-medium">
              {formatVolume(stockData.volume)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Market Cap:</span>
            <span className="ml-2 text-gray-900 dark:text-white font-medium">
              {stockData.market_cap ? `$${(stockData.market_cap / 1e9).toFixed(2)}B` : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">P/E Ratio:</span>
            <span className="ml-2 text-gray-900 dark:text-white font-medium">
              {stockData.pe_ratio ? stockData.pe_ratio.toFixed(2) : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Dividend Yield:</span>
            <span className="ml-2 text-gray-900 dark:text-white font-medium">
              {stockData.dividend_yield ? `${(stockData.dividend_yield * 100).toFixed(2)}%` : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">52W High:</span>
            <span className="ml-2 text-gray-900 dark:text-white font-medium">
              {stockData.high_52_week ? formatCurrency(stockData.high_52_week) : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">52W Low:</span>
            <span className="ml-2 text-gray-900 dark:text-white font-medium">
              {stockData.low_52_week ? formatCurrency(stockData.low_52_week) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
