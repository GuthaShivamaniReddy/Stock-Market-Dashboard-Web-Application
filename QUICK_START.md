# ⚡ Quick Start Guide

Get the Stock Market Dashboard running in under 5 minutes!

## 🚀 One-Command Setup

### Option 1: Automatic Setup (Recommended)

```bash
# Clone or download the project
# Navigate to the project directory
python run.py
```

This will automatically:

- ✅ Install all dependencies
- ✅ Start the backend server
- ✅ Start the frontend server
- ✅ Open your browser

### Option 2: Manual Setup

If you prefer to set up manually:

#### Backend Setup

```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📱 Features You'll See

1. **Left Panel**: Scrollable list of 15+ popular companies
2. **Main Panel**: Interactive stock charts with real-time data
3. **Time Periods**: 1D, 5D, 1M, 3M, 6M, 1Y, 2Y, 5Y
4. **Stock Metrics**: Price, change, volume, market cap, 52-week high/low
5. **Responsive Design**: Works on desktop, tablet, and mobile

## 🎯 Quick Test

1. Click on any company from the left panel
2. Watch the chart load with real-time data
3. Try different time periods (1D, 1M, 1Y)
4. Hover over the chart to see detailed price information

## 🔧 Troubleshooting

### Common Issues

**"Node.js not found"**

```bash
# Install Node.js from https://nodejs.org/
```

**"Python not found"**

```bash
# Install Python 3.8+ from https://python.org/
```

**"Port already in use"**

```bash
# Kill existing processes or change ports
# Backend: uvicorn app.main:app --reload --port 8001
# Frontend: PORT=3001 npm start
```

**"API connection failed"**

- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify network connectivity

### Still Having Issues?

1. Check the full logs in the terminal
2. Ensure all dependencies are installed
3. Try restarting both servers
4. Clear browser cache

## 📊 Data Sources

- **Real-time Data**: Yahoo Finance API (via yfinance)
- **Company List**: Curated selection of popular stocks
- **Historical Data**: Up to 5 years of price history

## 🎨 Customization

### Add More Companies

Edit `backend/app/routes/stocks.py`:

```python
SAMPLE_COMPANIES = [
    {"symbol": "AAPL", "name": "Apple Inc.", "sector": "Technology"},
    # Add your companies here
    {"symbol": "YOUR_SYMBOL", "name": "Your Company", "sector": "Your Sector"},
]
```

### Change Chart Colors

Edit `frontend/src/components/StockChart.js`:

```javascript
borderColor: stockData.change >= 0 ? '#your-green-color' : '#your-red-color',
```

### Modify Time Periods

Edit the `periodOptions` array in `StockChart.js`:

```javascript
const periodOptions = [
  { value: "1d", label: "1D" },
  // Add or remove periods
];
```

## 🚀 Next Steps

1. **Deploy to Cloud**: See [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Add Features**: Technical indicators, news feed, portfolio tracking
3. **Customize**: Add your own companies, change styling
4. **Scale**: Add caching, database optimization, monitoring

## 📞 Need Help?

- Check the [main README](README.md) for detailed documentation
- Review the [deployment guide](DEPLOYMENT.md) for cloud hosting
- Test the API endpoints at http://localhost:8000/docs

Happy trading! 📈
