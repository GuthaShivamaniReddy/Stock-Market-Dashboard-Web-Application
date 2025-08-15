from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import logging
import time
import random

from ..database import get_db, Company
from ..models import Company as CompanyModel, StockData, HistoricalData, APIResponse

router = APIRouter(prefix="/api", tags=["stocks"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate limiting variables
last_request_time = 0
min_request_interval = 3.0  # Increased to 3 seconds between requests

# Sample companies data
SAMPLE_COMPANIES = [
    {"symbol": "AAPL", "name": "Apple Inc.", "sector": "Technology"},
    {"symbol": "MSFT", "name": "Microsoft Corporation", "sector": "Technology"},
    {"symbol": "GOOGL", "name": "Alphabet Inc.", "sector": "Technology"},
    {"symbol": "AMZN", "name": "Amazon.com Inc.", "sector": "Consumer Discretionary"},
    {"symbol": "TSLA", "name": "Tesla Inc.", "sector": "Consumer Discretionary"},
    {"symbol": "META", "name": "Meta Platforms Inc.", "sector": "Technology"},
    {"symbol": "NVDA", "name": "NVIDIA Corporation", "sector": "Technology"},
    {"symbol": "NFLX", "name": "Netflix Inc.", "sector": "Communication Services"},
    {"symbol": "JPM", "name": "JPMorgan Chase & Co.", "sector": "Financial Services"},
    {"symbol": "JNJ", "name": "Johnson & Johnson", "sector": "Healthcare"},
    {"symbol": "V", "name": "Visa Inc.", "sector": "Financial Services"},
    {"symbol": "PG", "name": "Procter & Gamble Co.", "sector": "Consumer Staples"},
    {"symbol": "UNH", "name": "UnitedHealth Group Inc.", "sector": "Healthcare"},
    {"symbol": "HD", "name": "The Home Depot Inc.", "sector": "Consumer Discretionary"},
    {"symbol": "DIS", "name": "The Walt Disney Company", "sector": "Communication Services"}
]

# Enhanced mock data with more comprehensive stock information
MOCK_STOCK_DATA = {
    "AAPL": {
        "currentPrice": 175.50, 
        "previousClose": 174.20, 
        "volume": 50000000, 
        "marketCap": 2750000000000,
        "fiftyTwoWeekHigh": 198.23,
        "fiftyTwoWeekLow": 124.17,
        "trailingPE": 28.5,
        "dividendYield": 0.005,
        "beta": 1.29,
        "avgVolume": 55000000,
        "open": 174.80,
        "dayLow": 173.90,
        "dayHigh": 176.20
    },
    "MSFT": {
        "currentPrice": 380.25, 
        "previousClose": 378.90, 
        "volume": 25000000, 
        "marketCap": 2820000000000,
        "fiftyTwoWeekHigh": 420.82,
        "fiftyTwoWeekLow": 213.43,
        "trailingPE": 35.2,
        "dividendYield": 0.008,
        "beta": 0.88,
        "avgVolume": 28000000,
        "open": 379.10,
        "dayLow": 377.50,
        "dayHigh": 381.80
    },
    "GOOGL": {
        "currentPrice": 140.80, 
        "previousClose": 139.50, 
        "volume": 20000000, 
        "marketCap": 1780000000000,
        "fiftyTwoWeekHigh": 153.78,
        "fiftyTwoWeekLow": 83.34,
        "trailingPE": 25.8,
        "dividendYield": 0.0,
        "beta": 1.05,
        "avgVolume": 22000000,
        "open": 139.80,
        "dayLow": 138.90,
        "dayHigh": 141.50
    },
    "AMZN": {
        "currentPrice": 145.30, 
        "previousClose": 144.80, 
        "volume": 35000000, 
        "marketCap": 1510000000000,
        "fiftyTwoWeekHigh": 189.77,
        "fiftyTwoWeekLow": 81.43,
        "trailingPE": 60.3,
        "dividendYield": 0.0,
        "beta": 1.18,
        "avgVolume": 38000000,
        "open": 145.10,
        "dayLow": 144.20,
        "dayHigh": 146.40
    },
    "TSLA": {
        "currentPrice": 245.60, 
        "previousClose": 242.40, 
        "volume": 80000000, 
        "marketCap": 780000000000,
        "fiftyTwoWeekHigh": 299.29,
        "fiftyTwoWeekLow": 138.80,
        "trailingPE": 75.2,
        "dividendYield": 0.0,
        "beta": 2.34,
        "avgVolume": 85000000,
        "open": 243.20,
        "dayLow": 241.80,
        "dayHigh": 247.90
    },
    "META": {
        "currentPrice": 320.45, 
        "previousClose": 318.20, 
        "volume": 15000000, 
        "marketCap": 820000000000,
        "fiftyTwoWeekHigh": 485.58,
        "fiftyTwoWeekLow": 88.09,
        "trailingPE": 22.1,
        "dividendYield": 0.0,
        "beta": 1.21,
        "avgVolume": 16000000,
        "open": 319.10,
        "dayLow": 317.50,
        "dayHigh": 322.80
    },
    "NVDA": {
        "currentPrice": 890.20, 
        "previousClose": 885.60, 
        "volume": 30000000, 
        "marketCap": 2200000000000,
        "fiftyTwoWeekHigh": 974.00,
        "fiftyTwoWeekLow": 211.93,
        "trailingPE": 75.8,
        "dividendYield": 0.002,
        "beta": 1.87,
        "avgVolume": 32000000,
        "open": 887.50,
        "dayLow": 883.20,
        "dayHigh": 895.40
    },
    "NFLX": {
        "currentPrice": 580.30, 
        "previousClose": 575.80, 
        "volume": 8000000, 
        "marketCap": 250000000000,
        "fiftyTwoWeekHigh": 639.00,
        "fiftyTwoWeekLow": 162.71,
        "trailingPE": 45.2,
        "dividendYield": 0.0,
        "beta": 1.42,
        "avgVolume": 8500000,
        "open": 577.20,
        "dayLow": 574.50,
        "dayHigh": 582.60
    },
    "JPM": {
        "currentPrice": 180.40, 
        "previousClose": 179.90, 
        "volume": 12000000, 
        "marketCap": 520000000000,
        "fiftyTwoWeekHigh": 200.11,
        "fiftyTwoWeekLow": 120.78,
        "trailingPE": 12.8,
        "dividendYield": 0.024,
        "beta": 1.12,
        "avgVolume": 13000000,
        "open": 180.10,
        "dayLow": 179.20,
        "dayHigh": 181.50
    },
    "JNJ": {
        "currentPrice": 165.70, 
        "previousClose": 164.80, 
        "volume": 6000000, 
        "marketCap": 400000000000,
        "fiftyTwoWeekHigh": 181.88,
        "fiftyTwoWeekLow": 144.95,
        "trailingPE": 16.2,
        "dividendYield": 0.031,
        "beta": 0.65,
        "avgVolume": 6500000,
        "open": 165.20,
        "dayLow": 164.50,
        "dayHigh": 166.80
    },
    "V": {
        "currentPrice": 280.90, 
        "previousClose": 279.50, 
        "volume": 10000000, 
        "marketCap": 570000000000,
        "fiftyTwoWeekHigh": 290.96,
        "fiftyTwoWeekLow": 206.87,
        "trailingPE": 32.1,
        "dividendYield": 0.008,
        "beta": 0.99,
        "avgVolume": 11000000,
        "open": 280.20,
        "dayLow": 279.10,
        "dayHigh": 282.40
    },
    "PG": {
        "currentPrice": 155.20, 
        "previousClose": 154.60, 
        "volume": 8000000, 
        "marketCap": 365000000000,
        "fiftyTwoWeekHigh": 165.22,
        "fiftyTwoWeekLow": 135.83,
        "trailingPE": 24.8,
        "dividendYield": 0.024,
        "beta": 0.43,
        "avgVolume": 8500000,
        "open": 154.90,
        "dayLow": 154.20,
        "dayHigh": 156.30
    },
    "UNH": {
        "currentPrice": 520.80, 
        "previousClose": 518.40, 
        "volume": 3000000, 
        "marketCap": 480000000000,
        "fiftyTwoWeekHigh": 554.70,
        "fiftyTwoWeekLow": 445.27,
        "trailingPE": 20.5,
        "dividendYield": 0.015,
        "beta": 0.78,
        "avgVolume": 3200000,
        "open": 519.10,
        "dayLow": 517.80,
        "dayHigh": 522.90
    },
    "HD": {
        "currentPrice": 380.60, 
        "previousClose": 378.90, 
        "volume": 5000000, 
        "marketCap": 380000000000,
        "fiftyTwoWeekHigh": 415.08,
        "fiftyTwoWeekLow": 274.26,
        "trailingPE": 22.3,
        "dividendYield": 0.025,
        "beta": 1.05,
        "avgVolume": 5500000,
        "open": 379.50,
        "dayLow": 377.80,
        "dayHigh": 382.40
    },
    "DIS": {
        "currentPrice": 85.40, 
        "previousClose": 84.20, 
        "volume": 15000000, 
        "marketCap": 155000000000,
        "fiftyTwoWeekHigh": 118.18,
        "fiftyTwoWeekLow": 78.73,
        "trailingPE": 45.8,
        "dividendYield": 0.0,
        "beta": 1.35,
        "avgVolume": 16000000,
        "open": 84.80,
        "dayLow": 83.90,
        "dayHigh": 86.20
    }
}

def rate_limit():
    """Implement rate limiting to avoid Yahoo Finance API throttling"""
    global last_request_time
    current_time = time.time()
    time_since_last = current_time - last_request_time
    
    if time_since_last < min_request_interval:
        sleep_time = min_request_interval - time_since_last + random.uniform(0.1, 0.5)
        time.sleep(sleep_time)
    
    last_request_time = time.time()

def get_stock_data_with_retry(symbol: str, max_retries: int = 3):
    """Get stock data with retry mechanism and rate limiting"""
    # First, try to use mock data to avoid API rate limiting
    if symbol.upper() in MOCK_STOCK_DATA:
        logger.info(f"Using mock data for {symbol} to avoid API rate limiting")
        return MOCK_STOCK_DATA[symbol.upper()]
    
    # Only try Yahoo Finance if no mock data available
    for attempt in range(max_retries):
        try:
            rate_limit()
            ticker = yf.Ticker(symbol.upper())
            info = ticker.info
            
            # Check if we got valid data
            if not info or 'currentPrice' not in info or info['currentPrice'] is None:
                raise ValueError("No valid data received from Yahoo Finance")
            
            return info
            
        except Exception as e:
            logger.warning(f"Attempt {attempt + 1} failed for {symbol}: {e}")
            if attempt < max_retries - 1:
                time.sleep(5 + (attempt * 3))  # Longer delays: 5s, 8s, 11s
            else:
                raise e

def get_historical_data_with_retry(symbol: str, period: str, max_retries: int = 3):
    """Get historical data with retry mechanism and rate limiting"""
    # First, try to use mock data to avoid API rate limiting
    if symbol.upper() in MOCK_STOCK_DATA:
        logger.info(f"Using mock historical data for {symbol} to avoid API rate limiting")
        return None  # Signal to use mock data generation
    
    # Only try Yahoo Finance if no mock data available
    for attempt in range(max_retries):
        try:
            rate_limit()
            ticker = yf.Ticker(symbol.upper())
            history = ticker.history(period=period)
            
            if history.empty:
                raise ValueError("No historical data available")
            
            return history
            
        except Exception as e:
            logger.warning(f"Historical data attempt {attempt + 1} failed for {symbol}: {e}")
            if attempt < max_retries - 1:
                time.sleep(5 + (attempt * 3))  # Longer delays: 5s, 8s, 11s
            else:
                raise e

@router.get("/companies", response_model=List[CompanyModel])
async def get_companies(db: Session = Depends(get_db)):
    """Get list of available companies"""
    try:
        # Check if companies exist in database
        companies = db.query(Company).all()
        
        if not companies:
            # Initialize database with sample companies
            for company_data in SAMPLE_COMPANIES:
                company = Company(**company_data)
                db.add(company)
            db.commit()
            companies = db.query(Company).all()
        
        return companies
    except Exception as e:
        logger.error(f"Error fetching companies: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch companies")

@router.get("/stocks/{symbol}", response_model=StockData)
async def get_stock_data(symbol: str, db: Session = Depends(get_db)):
    """Get current stock data for a specific symbol"""
    try:
        # Get company info from database
        company = db.query(Company).filter(Company.symbol == symbol.upper()).first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        
        # Fetch data using yfinance with retry mechanism (will use mock data by default)
        info = get_stock_data_with_retry(symbol.upper())
        
        # Get current price and previous close
        current_price = info.get('currentPrice', 0)
        previous_close = info.get('previousClose', current_price)
        
        # Calculate change
        change = current_price - previous_close
        change_percent = (change / previous_close * 100) if previous_close > 0 else 0
        
        # Get additional data
        volume = info.get('volume', 0)
        market_cap = info.get('marketCap')
        high_52_week = info.get('fiftyTwoWeekHigh')
        low_52_week = info.get('fiftyTwoWeekLow')
        pe_ratio = info.get('trailingPE')
        dividend_yield = info.get('dividendYield')
        
        # Update company data in database
        company.current_price = current_price
        company.market_cap = market_cap
        company.last_updated = datetime.now()
        db.commit()
        
        return StockData(
            symbol=symbol.upper(),
            current_price=current_price,
            change=round(change, 2),
            change_percent=round(change_percent, 2),
            volume=volume,
            market_cap=market_cap,
            high_52_week=high_52_week,
            low_52_week=low_52_week,
            pe_ratio=pe_ratio,
            dividend_yield=dividend_yield,
            last_updated=datetime.now()
        )
        
    except Exception as e:
        logger.error(f"Error fetching stock data for {symbol}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch stock data for {symbol}")

@router.get("/stocks/{symbol}/history", response_model=HistoricalData)
async def get_stock_history(
    symbol: str, 
    period: str = "1mo",
    db: Session = Depends(get_db)
):
    """Get historical stock data for a specific symbol"""
    try:
        # Validate period
        valid_periods = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]
        if period not in valid_periods:
            raise HTTPException(status_code=400, detail="Invalid period")
        
        # Get company info from database
        company = db.query(Company).filter(Company.symbol == symbol.upper()).first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        
        # Fetch historical data using yfinance with retry mechanism
        history = get_historical_data_with_retry(symbol.upper(), period)
        
        # If history is None, it means mock data was used
        if history is None:
            # Generate mock historical data as fallback
            if symbol.upper() in MOCK_STOCK_DATA:
                mock_data = MOCK_STOCK_DATA[symbol.upper()]
                base_price = mock_data["currentPrice"]
                
                # Generate 30 days of mock data
                from datetime import datetime, timedelta
                dates = []
                prices = []
                volumes = []
                
                for i in range(30):
                    date = datetime.now() - timedelta(days=29-i)
                    dates.append(date.strftime('%Y-%m-%d'))
                    
                    # Add some random variation to the price
                    import random
                    variation = random.uniform(-0.02, 0.02)  # ±2% variation
                    price = base_price * (1 + variation)
                    prices.append(round(price, 2))
                    
                    # Add some random variation to volume
                    base_volume = mock_data["volume"]
                    volume_variation = random.uniform(0.8, 1.2)  # ±20% variation
                    volumes.append(int(base_volume * volume_variation))
                
                return HistoricalData(
                    symbol=symbol.upper(),
                    dates=dates,
                    prices=prices,
                    volumes=volumes,
                    period=period
                )
            else:
                raise HTTPException(status_code=500, detail=f"Failed to fetch historical data for {symbol}")
        
        # Convert to lists
        dates = [date.strftime('%Y-%m-%d') for date in history.index]
        prices = history['Close'].tolist()
        volumes = history['Volume'].tolist()
        
        return HistoricalData(
            symbol=symbol.upper(),
            dates=dates,
            prices=prices,
            volumes=volumes,
            period=period
        )
        
    except Exception as e:
        logger.error(f"Error fetching historical data for {symbol}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch historical data for {symbol}")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now()}

@router.get("/market-summary")
async def get_market_summary():
    """Get market summary with top gainers and losers"""
    try:
        # Calculate market summary from mock data
        all_stocks = []
        total_market_cap = 0
        
        for symbol, data in MOCK_STOCK_DATA.items():
            change = data["currentPrice"] - data["previousClose"]
            change_percent = (change / data["previousClose"] * 100) if data["previousClose"] > 0 else 0
            
            stock_info = {
                "symbol": symbol,
                "current_price": data["currentPrice"],
                "change": round(change, 2),
                "change_percent": round(change_percent, 2),
                "volume": data["volume"],
                "market_cap": data["marketCap"]
            }
            all_stocks.append(stock_info)
            total_market_cap += data["marketCap"]
        
        # Sort by change percentage
        gainers = sorted(all_stocks, key=lambda x: x["change_percent"], reverse=True)[:5]
        losers = sorted(all_stocks, key=lambda x: x["change_percent"])[:5]
        
        return {
            "total_market_cap": total_market_cap,
            "total_stocks": len(all_stocks),
            "top_gainers": gainers,
            "top_losers": losers,
            "market_status": "open" if datetime.now().hour < 16 else "closed"
        }
        
    except Exception as e:
        logger.error(f"Error fetching market summary: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch market summary")

@router.get("/compare/{symbols}")
async def compare_stocks(symbols: str):
    """Compare multiple stocks"""
    try:
        symbol_list = [s.upper().strip() for s in symbols.split(",")]
        comparison_data = []
        
        for symbol in symbol_list:
            if symbol in MOCK_STOCK_DATA:
                data = MOCK_STOCK_DATA[symbol]
                change = data["currentPrice"] - data["previousClose"]
                change_percent = (change / data["previousClose"] * 100) if data["previousClose"] > 0 else 0
                
                comparison_data.append({
                    "symbol": symbol,
                    "current_price": data["currentPrice"],
                    "change": round(change, 2),
                    "change_percent": round(change_percent, 2),
                    "volume": data["volume"],
                    "market_cap": data["marketCap"],
                    "pe_ratio": data["trailingPE"],
                    "dividend_yield": data["dividendYield"],
                    "beta": data["beta"]
                })
        
        return {
            "stocks": comparison_data,
            "comparison_date": datetime.now().strftime("%Y-%m-%d")
        }
        
    except Exception as e:
        logger.error(f"Error comparing stocks: {e}")
        raise HTTPException(status_code=500, detail="Failed to compare stocks")

@router.get("/sectors")
async def get_sectors():
    """Get sector performance summary"""
    try:
        sectors = {}
        
        for company in SAMPLE_COMPANIES:
            sector = company["sector"]
            symbol = company["symbol"]
            
            if symbol in MOCK_STOCK_DATA:
                data = MOCK_STOCK_DATA[symbol]
                change = data["currentPrice"] - data["previousClose"]
                change_percent = (change / data["previousClose"] * 100) if data["previousClose"] > 0 else 0
                
                if sector not in sectors:
                    sectors[sector] = {
                        "stocks": [],
                        "total_market_cap": 0,
                        "avg_change_percent": 0
                    }
                
                sectors[sector]["stocks"].append({
                    "symbol": symbol,
                    "name": company["name"],
                    "current_price": data["currentPrice"],
                    "change_percent": round(change_percent, 2),
                    "market_cap": data["marketCap"]
                })
                sectors[sector]["total_market_cap"] += data["marketCap"]
        
        # Calculate average change for each sector
        for sector in sectors:
            changes = [stock["change_percent"] for stock in sectors[sector]["stocks"]]
            sectors[sector]["avg_change_percent"] = round(sum(changes) / len(changes), 2)
        
        return {
            "sectors": sectors,
            "total_sectors": len(sectors)
        }
        
    except Exception as e:
        logger.error(f"Error fetching sectors: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch sectors")
