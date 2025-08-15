# 🚀 Enhanced Stock Market Dashboard

A modern, feature-rich stock market dashboard built with React and FastAPI, providing real-time stock data, market analysis, and comprehensive financial insights.

## ✨ **New Features & Improvements**

### 🎨 **Enhanced UI/UX**
- **Dark/Light Theme Toggle** - Switch between themes with persistent preferences
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Loading Animations** - Smooth loading states and transitions
- **Modern Tabbed Interface** - Organized content with intuitive navigation

### 📊 **New Dashboard Features**
- **Market Summary** - Real-time market overview with top gainers and losers
- **Stock Comparison Tool** - Compare up to 5 stocks side-by-side
- **Enhanced Stock Data** - Comprehensive metrics including P/E ratio, beta, dividend yield
- **Sector Performance** - Track performance across different market sectors

### 🔧 **Backend Improvements**
- **Robust Mock Data System** - Comprehensive fallback data for 15+ major stocks
- **Rate Limiting Protection** - Handles API rate limiting gracefully
- **New API Endpoints** - Market summary, stock comparison, sector analysis
- **Enhanced Error Handling** - Better error messages and fallback mechanisms

### 📈 **Data Visualization**
- **Interactive Charts** - Real-time stock price charts with multiple timeframes
- **Market Metrics** - Total market cap, stock count, market status
- **Performance Indicators** - Gainers/losers tracking with visual indicators

## 🛠️ **Technology Stack**

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework with dark mode support
- **Lucide React** - Beautiful, customizable icons
- **Recharts** - Composable charting library for React

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **yfinance** - Yahoo Finance API wrapper
- **Pandas** - Data manipulation and analysis
- **Uvicorn** - Lightning-fast ASGI server

## 🚀 **Quick Start**

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-market-dashboard
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Run the Application**

   **Option 1: Use the convenience script**
   ```bash
   python run.py
   ```

   **Option 2: Run manually**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   venv\Scripts\activate
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📱 **Features Overview**

### **Stock Chart Tab**
- Interactive price charts with multiple timeframes (1D, 1W, 1M, 3M, 1Y)
- Real-time stock data with price, change, volume, and market cap
- Company information and sector details
- Refresh functionality for latest data

### **Market Summary Tab**
- Total market capitalization overview
- Top 5 gainers and losers with percentage changes
- Market status indicator (open/closed)
- Real-time updates every 30 seconds

### **Stock Comparison Tab**
- Compare up to 5 stocks simultaneously
- Side-by-side metrics comparison
- Key ratios: P/E, dividend yield, beta
- Add/remove stocks dynamically

### **Enhanced Company List**
- Real-time price updates
- Color-coded price changes
- Company sector information
- Responsive design for all screen sizes

## 🔧 **API Endpoints**

### Core Endpoints
- `GET /api/companies` - List all available companies
- `GET /api/stocks/{symbol}` - Get current stock data
- `GET /api/stocks/{symbol}/history` - Get historical data

### New Endpoints
- `GET /api/market-summary` - Market overview and top performers
- `GET /api/compare/{symbols}` - Compare multiple stocks
- `GET /api/sectors` - Sector performance analysis
- `GET /api/health` - Health check endpoint

## 🎨 **Theme System**

The dashboard supports both light and dark themes:

- **Automatic Detection** - Respects system preference
- **Manual Toggle** - Click the sun/moon icon in the header
- **Persistent Storage** - Remembers your preference
- **Smooth Transitions** - Elegant theme switching

## 📊 **Data Sources**

- **Primary**: Yahoo Finance API (via yfinance)
- **Fallback**: Comprehensive mock data system
- **Real-time**: Live market data when available
- **Historical**: Price history and performance metrics

## 🔒 **Error Handling**

- **Graceful Degradation** - App continues working with mock data
- **User-Friendly Messages** - Clear error explanations
- **Automatic Retry** - Smart retry mechanisms for failed requests
- **Offline Support** - Basic functionality when offline

## 🚀 **Performance Features**

- **Lazy Loading** - Components load only when needed
- **Caching** - Intelligent data caching for better performance
- **Optimized Bundles** - Efficient code splitting and bundling
- **Responsive Images** - Optimized for different screen sizes

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 **Acknowledgments**

- **Yahoo Finance** - For providing stock data APIs
- **Tailwind CSS** - For the amazing utility-first CSS framework
- **React Community** - For the excellent ecosystem and tools
- **FastAPI** - For the modern, fast web framework

---

**Built with ❤️ using React & FastAPI**
