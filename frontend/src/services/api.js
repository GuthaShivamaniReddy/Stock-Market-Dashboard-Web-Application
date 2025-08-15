import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 404) {
      throw new Error('Data not found');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error(error.response?.data?.detail || 'An error occurred');
    }
  }
);

export const stockAPI = {
  // Get list of companies
  getCompanies: async () => {
    const response = await api.get('/api/companies');
    return response.data;
  },

  // Get current stock data
  getStockData: async (symbol) => {
    const response = await api.get(`/api/stocks/${symbol}`);
    return response.data;
  },

  // Get historical stock data
  getStockHistory: async (symbol, period = '1mo') => {
    const response = await api.get(`/api/stocks/${symbol}/history?period=${period}`);
    return response.data;
  },

  // Get market summary
  getMarketSummary: async () => {
    const response = await api.get('/api/market-summary');
    return response.data;
  },

  // Compare multiple stocks
  compareStocks: async (symbols) => {
    const response = await api.get(`/api/compare/${symbols}`);
    return response.data;
  },

  // Get sector performance
  getSectors: async () => {
    const response = await api.get('/api/sectors');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },
};

// Export individual functions for easier imports
export const getCompanies = stockAPI.getCompanies;
export const getStockData = stockAPI.getStockData;
export const getStockHistory = stockAPI.getStockHistory;
export const getMarketSummary = stockAPI.getMarketSummary;
export const compareStocks = stockAPI.compareStocks;
export const getSectors = stockAPI.getSectors;
export const healthCheck = stockAPI.healthCheck;

export default api;
